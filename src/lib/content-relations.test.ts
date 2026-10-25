import { beforeEach, describe, expect, it, vi } from "vitest";

/*
 * Populated relationships outside draft mode.
 *
 * The readers filter the top-level document on _status, but Payload's depth
 * populate does not re-apply that filter to the documents it pulls in: a
 * published post arrives carrying its draft-only category, label and all.
 * Measured live on the review server (Phase 7, probe step j): /blog printed
 * the label of a draft-only postCategory. dropUnpublishedRelations() strips
 * every populated related document that is not published, once, in the read
 * layer, so no page has to remember to.
 */
let draftEnabled = false;
vi.mock("next/headers", () => ({
  draftMode: async () => ({ isEnabled: draftEnabled }),
  headers: async () => new Headers(),
}));

type Doc = Record<string, unknown>;
let store: Record<string, Doc[]> = {};
const fake = {
  find: vi.fn(async ({ collection, where = {} }: { collection: string; where?: Record<string, any> }) => {
    let docs = store[collection] ?? [];
    if (where._status) docs = docs.filter((d) => d._status === where._status.equals);
    if (where.slug) docs = docs.filter((d) => d.slug === where.slug.equals);
    return { docs };
  }),
  findGlobal: vi.fn(async ({ slug }: { slug: string }) => ({ slug })),
  auth: vi.fn(async () => ({ user: { id: 1, collection: "users", role: "editor" } })),
};
vi.mock("payload", () => ({ getPayload: vi.fn(async () => fake) }));
vi.mock("@payload-config", () => ({ default: {} }));

const content = await import("./content");
const { dropUnpublishedRelations } = content;

const draftDoc = (over: Doc = {}) => ({ id: 9, _status: "draft", title: "Draft only", ...over });
const liveDoc = (over: Doc = {}) => ({ id: 8, _status: "published", title: "Live", ...over });
const media = { id: 3, url: "/media/logo.png", approved: true, alt: "Logo" };

beforeEach(() => {
  draftEnabled = false;
  store = {};
  fake.find.mockClear();
});

describe("dropUnpublishedRelations", () => {
  it("turns a single relation to a draft document into null", () => {
    const out = dropUnpublishedRelations({ id: 1, _status: "published", category: draftDoc() });
    expect(out.category).toBeNull();
  });

  it("keeps a single relation to a published document", () => {
    const out = dropUnpublishedRelations({ id: 1, _status: "published", category: liveDoc() });
    expect(out.category).toEqual(liveDoc());
  });

  it("drops the unpublished entries of a hasMany and keeps the published ones in order", () => {
    const a = liveDoc({ id: 11, title: "A" });
    const c = liveDoc({ id: 13, title: "C" });
    const out = dropUnpublishedRelations({
      id: 1,
      solutions: [a, draftDoc({ id: 12, title: "B" }), c, 14],
    });
    expect(out.solutions).toEqual([a, c, 14]);
  });

  it("treats a related document with a null status as unpublished (fails closed)", () => {
    const out = dropUnpublishedRelations({ id: 1, category: { id: 2, _status: null, title: "?" } });
    expect(out.category).toBeNull();
  });

  it("leaves a media object (no _status) untouched", () => {
    const out = dropUnpublishedRelations({ id: 1, _status: "published", logo: media });
    expect(out.logo).toEqual(media);
  });

  it("leaves plain groups and arrays of rows alone, but still looks inside them", () => {
    const out = dropUnpublishedRelations({
      id: 1,
      tech: [{ id: "row1", item: "CCTV" }],
      detail: [{ id: "blk1", blockType: "band", link: draftDoc(), heading: "H" }],
      seo: { title: "T", image: media },
    });
    expect(out.tech).toEqual([{ id: "row1", item: "CCTV" }]);
    expect(out.detail).toEqual([{ id: "blk1", blockType: "band", link: null, heading: "H" }]);
    expect(out.seo).toEqual({ title: "T", image: media });
  });

  it("handles two levels: project -> draft solution, project -> client -> logo media", () => {
    const project = {
      id: 1,
      _status: "published",
      solutions: [draftDoc({ id: 20, title: "Hidden family" }), liveDoc({ id: 21, title: "Datacenter" })],
      client: liveDoc({
        id: 30,
        name: "Bank",
        logo: media,
        engagements: [draftDoc({ id: 31, title: "Hidden project" })],
      }),
    };
    const out = dropUnpublishedRelations(project);
    expect(out.solutions).toEqual([liveDoc({ id: 21, title: "Datacenter" })]);
    expect((out.client as Doc).logo).toEqual(media);
    expect((out.client as Doc).engagements).toEqual([]);
    expect(JSON.stringify(out)).not.toMatch(/Hidden/);
  });

  it("terminates on a cycle (a -> b -> a)", () => {
    const a: Doc = { id: 1, _status: "published", title: "A" };
    const b: Doc = { id: 2, _status: "published", title: "B", back: a };
    a.next = b;
    const out = dropUnpublishedRelations(a);
    const nb = out.next as Doc;
    expect(nb.title).toBe("B");
    expect(nb.back).toBe(out);
  });

  it("does not mutate its input", () => {
    const input = { id: 1, category: draftDoc(), tags: [draftDoc(), liveDoc()] };
    const before = JSON.stringify(input);
    dropUnpublishedRelations(input);
    expect(JSON.stringify(input)).toBe(before);
  });

  it("fails closed past the depth bound rather than returning an unfiltered subtree", () => {
    let deep: Doc = { leaf: draftDoc({ title: "Too deep" }) };
    for (let i = 0; i < 100; i += 1) deep = { child: deep };
    const out = dropUnpublishedRelations({ id: 1, deep });
    expect(JSON.stringify(out)).not.toMatch(/Too deep/);
  });
});

describe("the readers", () => {
  const post = {
    id: 1,
    slug: "p",
    _status: "published",
    title: "Post",
    category: { id: 5, _status: "draft", title: "X-DRAFT-CATEGORY" },
  };

  it("outside draft mode, getPosts() carries no trace of a draft-only category", async () => {
    store.posts = [post];
    const posts = await content.getPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0].category).toBeNull();
    expect(JSON.stringify(posts)).not.toContain("X-DRAFT-CATEGORY");
  });

  it("outside draft mode, the by-slug readers strip it too", async () => {
    store.projects = [{ id: 2, slug: "p", _status: "published", client: draftDoc({ name: "X-DRAFT-CLIENT" }) }];
    const p = await content.getProject("p");
    expect(p?.client).toBeNull();
    expect(JSON.stringify(p)).not.toContain("X-DRAFT-CLIENT");
  });

  it("in draft mode an editor's preview still shows the draft", async () => {
    draftEnabled = true;
    store.posts = [post];
    expect(JSON.stringify(await content.getPosts())).toContain("X-DRAFT-CATEGORY");
  });

  it("keeps the approvedLogo gate and the derived event status working", async () => {
    const unapproved = { id: 4, url: "/m/x.png", approved: false };
    store.clients = [
      { id: 1, slug: "a", _status: "published", logo: media, engagements: [draftDoc()] },
      { id: 2, slug: "b", _status: "published", logo: unapproved },
    ];
    const clients = await content.getClients();
    expect(clients.map((c) => c.logo)).toEqual([media, null]);
    expect(clients[0].engagements).toEqual([]);
    store.events = [{ id: 1, slug: "e", _status: "published", startsOn: "2000-01-01", endsOn: "2000-01-02" }];
    expect((await content.getEvents())[0].status).toBe("past");
  });
});
