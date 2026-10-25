import { readFileSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Careers } from "@/globals/Careers";
import { Company } from "@/globals/Company";
import { ContactDetails } from "@/globals/ContactDetails";
import { PageCopy } from "@/globals/PageCopy";
import { SiteSettings } from "@/globals/SiteSettings";

/*
 * The behavioural half: content.ts run against a fake Local API and a fake
 * draftMode(). No database and no Next request -- the fakes record what each
 * reader asks Payload for, which is the property that matters: published-only
 * outside draft mode, the latest draft inside it.
 */
let draftEnabled = false;
vi.mock("next/headers", () => ({ draftMode: async () => ({ isEnabled: draftEnabled }) }));

type Doc = Record<string, unknown> & { slug?: string; _status?: string };
type FindArgs = { collection: string; where?: Record<string, any>; draft?: boolean; [k: string]: unknown };
let store: Record<string, Doc[]> = {};

/*
 * Roughly what Payload does: `draft: true` reads the latest version of every
 * document whatever its status; otherwise the main table is read. Either way
 * the `where` applies. Only the filters content.ts uses are understood.
 */
const fake = {
  find: vi.fn(async ({ collection, where = {} }: FindArgs) => {
    // Draft-only documents sit in the main table too, with _status "draft", so
    // without `draft` it is the where clause alone that keeps them out.
    let docs = store[collection] ?? [];
    if (where._status) docs = docs.filter((d) => d._status === where._status.equals);
    if (where.slug) docs = docs.filter((d) => d.slug === where.slug.equals);
    if (where.title) docs = docs.filter((d) => d.title === where.title.equals);
    return { docs };
  }),
  findGlobal: vi.fn(async ({ slug }: { slug: string }) => ({ slug })),
};
vi.mock("payload", () => ({ getPayload: vi.fn(async () => fake) }));
vi.mock("@payload-config", () => ({ default: {} }));

const content = await import("./content");

/** Every list reader and every by-slug reader content.ts exports. */
const LIST_READERS = [
  "getSolutions", "getServices", "getProjects", "getClients", "getPartners",
  "getPartnerCategories", "getPosts", "getPostCategories", "getNews", "getEvents",
  "getDownloads", "getJobs", "getAcademyTracks",
] as const;
const SLUG_READERS = [
  "getSolution", "getService", "getProject", "getNewsItem", "getEvent", "getJob",
] as const;
const GLOBAL_READERS = [
  "getSiteSettings", "getCompany", "getContactDetails", "getCareersContent", "getPageCopy",
] as const;

const callsOf = (fn: typeof fake.find) => fn.mock.calls.map(([a]) => a as FindArgs);

beforeEach(() => {
  draftEnabled = false;
  store = {};
  fake.find.mockClear();
  fake.findGlobal.mockClear();
});

describe("the readers outside draft mode", () => {
  it("every reader filters to published and never asks for drafts", async () => {
    for (const name of LIST_READERS) await content[name]();
    for (const name of SLUG_READERS) await content[name]("x");
    const calls = callsOf(fake.find);
    expect(calls).toHaveLength(LIST_READERS.length + SLUG_READERS.length);
    for (const c of calls) {
      expect(c.where?._status, c.collection).toEqual({ equals: "published" });
      expect(c, c.collection).not.toHaveProperty("draft");
    }
  });

  it("a draft-only document is a null (so loadOr404 answers 404)", async () => {
    store.solutions = [{ slug: "draft-only", _status: "draft", title: "Unfinished" }];
    await expect(content.getSolution("draft-only")).resolves.toBeNull();
    await expect(content.getSolutions()).resolves.toEqual([]);
  });
});

describe("the readers in draft mode", () => {
  beforeEach(() => {
    draftEnabled = true;
  });

  it("every reader asks for the latest draft and drops the published filter", async () => {
    for (const name of LIST_READERS) await content[name]();
    for (const name of SLUG_READERS) await content[name]("x");
    const calls = callsOf(fake.find);
    expect(calls).toHaveLength(LIST_READERS.length + SLUG_READERS.length);
    for (const c of calls) {
      expect(c.draft, c.collection).toBe(true);
      expect(c.where?._status, c.collection).toBeUndefined();
    }
  });

  it("the by-slug readers still match on the slug", async () => {
    await content.getSolution("datacenter");
    expect(callsOf(fake.find)[0].where).toEqual({ slug: { equals: "datacenter" } });
  });

  it("getSolution returns a draft-only document", async () => {
    store.solutions = [{ slug: "draft-only", _status: "draft", title: "Unfinished" }];
    await expect(content.getSolution("draft-only")).resolves.toMatchObject({ title: "Unfinished" });
  });

  it("still strips a logo whose approval was withdrawn -- a content rule, not a publishing one", async () => {
    const unapproved = { id: 1, url: "/m/a.png", approved: false };
    const approved = { id: 2, url: "/m/b.png", approved: true };
    store.clients = [
      { slug: "a", _status: "draft", logo: unapproved },
      { slug: "b", _status: "draft", logo: approved },
    ];
    store.partners = [{ slug: "p", _status: "draft", logo: unapproved }];
    const clients = await content.getClients();
    expect(clients.map((c) => c.logo)).toEqual([null, approved]);
    expect((await content.getPartners())[0].logo).toBeNull();
  });

  it("events keep their derived status in draft mode", async () => {
    store.events = [{ slug: "e", _status: "draft", startsOn: "2000-01-01", endsOn: "2000-01-02" }];
    const [e] = await content.getEvents();
    expect(e.status).toBe("past");
    expect((await content.getEvent("e"))?.status).toBe("past");
  });

  it("getForm is untouched: forms have no drafts, so no draft flag and no status filter", async () => {
    store.forms = [{ title: "Contact" }];
    await expect(content.getForm("contact")).resolves.toMatchObject({ title: "Contact" });
    const [c] = callsOf(fake.find);
    expect(c.collection).toBe("forms");
    expect(c).not.toHaveProperty("draft");
    expect(c.where).not.toHaveProperty("_status");
  });
});

describe("a caller's extra options cannot override the read mode", () => {
  /*
   * many() takes per-reader options (today only byOrder). If those were spread
   * after the read mode, a caller passing `where` or `draft` would replace the
   * published filter or force a draft read on the public site. The type forbids
   * it; this proves the order holds even if the type is cast around.
   */
  const hostile = { sort: "order", where: { slug: { exists: true } }, draft: true } as never;

  it("outside draft mode the published filter stands and no draft is read", async () => {
    await content.many("solutions", hostile);
    const [c] = callsOf(fake.find);
    expect(c.where).toEqual({ _status: { equals: "published" } });
    expect(c).not.toHaveProperty("draft");
    expect(c.sort).toBe("order");
  });

  it("in draft mode the draft read stands and no status filter appears", async () => {
    draftEnabled = true;
    await content.many("solutions", { ...(hostile as object), draft: false } as never);
    const [c] = callsOf(fake.find);
    expect(c.draft).toBe(true);
    expect(c.where).toEqual({});
    expect(c.sort).toBe("order");
  });
});

describe("the draft flag is read per call, not captured once", () => {
  /*
   * React's cache() memoises per server request, and one request has one
   * draft-mode state, so a draft request cannot hand its result to a public
   * one. What would break that is the flag being read outside the cached
   * function (at import, or once per process). Flip it between two calls of
   * the same reader with the same argument and the second must follow.
   */
  it("follows the flag across calls of the same reader and argument", async () => {
    store.solutions = [{ slug: "s", _status: "draft", title: "Draft" }];
    draftEnabled = true;
    await expect(content.getSolution("s")).resolves.not.toBeNull();
    draftEnabled = false;
    await expect(content.getSolution("s")).resolves.toBeNull();
    draftEnabled = true;
    await expect(content.getSolutions()).resolves.toHaveLength(1);
    draftEnabled = false;
    await expect(content.getSolutions()).resolves.toHaveLength(0);
  });
});

describe("the globals", () => {
  /*
   * Every global publishes immediately (versions.drafts false, or no versions
   * at all), so there is no draft to read and findGlobal never gets `draft`.
   * If a global ever gains drafts this test fails, and its reader must then
   * pass `draft: await isDraft()` -- the assertion below is what to change.
   */
  const configs = [Careers, Company, ContactDetails, PageCopy, SiteSettings];

  it("none has drafts enabled", () => {
    expect(configs).toHaveLength(5);
    for (const g of configs) {
      const drafts = typeof g.versions === "object" ? g.versions.drafts : undefined;
      expect(Boolean(drafts), g.slug).toBe(false);
    }
  });

  for (const mode of [false, true]) {
    it(`never passes draft to findGlobal (draft mode ${mode ? "on" : "off"})`, async () => {
      draftEnabled = mode;
      for (const name of GLOBAL_READERS) await content[name]();
      const calls = fake.findGlobal.mock.calls.map(([a]) => a as Record<string, unknown>);
      expect(calls.map((c) => c.slug).sort()).toEqual(configs.map((g) => g.slug).sort());
      for (const c of calls) expect(c, String(c.slug)).not.toHaveProperty("draft");
    });
  }
});

/*
 * Structural checks on the read layer, in the manner of seo.test.ts.
 *
 * Nothing here boots Payload: the readers are verified against the real
 * database by running them (see the Task 19 record in the ledger). What a test
 * can hold in place is the shape of the file, and two things about that shape
 * are load-bearing in a way nothing else catches.
 *
 * The first is the published filter. The Local API defaults to overrideAccess:
 * true, so the access rules in src/access do not apply to these reads at all,
 * and the explicit `_status` filter is the only thing keeping an editor's
 * unfinished draft off the public site. It lives in two helpers; a new reader
 * that calls payload.find directly would silently bypass it, and the symptom
 * would be a draft appearing on one page.
 *
 * The second is the collection names, which are plain strings. A typo reaches
 * production as a page that throws when someone opens it, and nothing before
 * that moment would complain -- not the compiler, since the helpers take a
 * string, and not the other tests.
 */

const source = readFileSync(new URL("./content.ts", import.meta.url), "utf8");

/** The slugs declared by the collections, as Payload knows them. */
const SLUGS = [
  "academyTracks",
  "clients",
  "downloads",
  "events",
  "jobs",
  "media",
  "news",
  "partnerCategories",
  "partners",
  "postCategories",
  "posts",
  "projects",
  "services",
  "solutions",
  "users",
  "forms",
];

describe("the read layer only reads published documents", () => {
  it("keeps every collection read inside the two filtered helpers", () => {
    /*
     * Three call sites, and no more: many(), one(), and the form builder's
     * document, which has no draft status to filter on. A fourth would be a
     * reader that had grown its own query, and the point of this file is that
     * there is one place the filter can be forgotten rather than twenty.
     */
    const callSites = source.match(/payload\.find\(/g) ?? [];
    expect(callSites).toHaveLength(3);
  });

  it("filters on _status in both helpers, unless the request is in draft mode", () => {
    const mode = source.slice(source.indexOf("async function readMode"), source.indexOf("async function many"));
    const many = source.slice(source.indexOf("async function many"), source.indexOf("async function one"));
    const one = source.slice(source.indexOf("async function one"), source.indexOf("/* ------"));
    expect(many, "many() must read through readMode()").toMatch(/\.\.\.\(await readMode\(\)\)/);
    expect(one, "one() must read through readMode()").toMatch(/\.\.\.\(await readMode\(\{/);
    // The draft branch is the only one without the filter, and it is taken
    // only when isDraft() says so. PUBLISHED is spread last so no caller's
    // where clause can override it.
    expect(mode).toMatch(/\(await isDraft\(\)\)\s*\?\s*\{ where, draft: true \}/);
    expect(mode).toMatch(/:\s*\{ where: \{ \.\.\.where, \.\.\.PUBLISHED \} \}/);
    expect(source).toMatch(/PUBLISHED = \{ _status: \{ equals: "published" \} \}/);
  });

  it("reads globals through findGlobal, which has no draft status to filter", () => {
    // Five globals, all with versions.drafts false, so there is no _status to
    // filter and findGlobal is the whole read.
    const globals = source.match(/findGlobal\(\{ slug: "([a-z-]+)"/g) ?? [];
    expect(globals).toHaveLength(5);
  });
});

describe("the read layer names collections that exist", () => {
  it("passes only real slugs to the helpers", () => {
    const named = [...source.matchAll(/(?:many|one)<[A-Za-z]+>\(\s*"([A-Za-z]+)"/g)].map(
      (m) => m[1],
    );
    // Thirteen collections, each read as a list and most also one at a time.
    expect(named.length).toBeGreaterThan(15);
    for (const slug of named) {
      expect(SLUGS, `"${slug}" is not a collection slug`).toContain(slug);
    }
  });

  it("sorts every list read, so the approved order is not left to the database", () => {
    /*
     * Almost nothing here is alphabetical or chronological -- the three news
     * items carry the dates "2018", "Evergreen" and "Date to confirm". An
     * unsorted read returns rows in whatever order Postgres likes, which looks
     * correct on one page load and shuffles on the next, so every list read
     * passes byOrder.
     */
    const listReads = [...source.matchAll(/many<[A-Za-z]+>\("([A-Za-z]+)"([^)]*)\)/g)];
    expect(listReads.length).toBe(13);
    for (const [, slug, rest] of listReads) {
      expect(rest, `many("${slug}") is unsorted`).toContain("byOrder");
    }
    expect(source).toMatch(/const byOrder = \{ sort: "order" \}/);
  });
});
