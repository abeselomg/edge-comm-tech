import { beforeEach, describe, expect, it, vi } from "vitest";

const revalidatePath = vi.fn();
vi.mock("next/cache", () => ({ revalidatePath: (...a: unknown[]) => revalidatePath(...a) }));

import { Solutions } from "../collections/Solutions";
import { Services } from "../collections/Services";

beforeEach(() => revalidatePath.mockClear());

const run = (collection: { hooks?: { afterChange?: unknown[]; afterDelete?: unknown[] } }, kind: "afterChange" | "afterDelete") => {
  const hook = collection.hooks?.[kind]?.[0] as (a: unknown) => unknown;
  hook({ doc: { slug: "x" }, previousDoc: { slug: "x" } });
};

/*
 * The site footer lists every published solution, on every page. Unpublishing a
 * solution therefore has to refresh the whole layout, not only the pages that
 * mention it: found on the server, where the solution's own page 404'd and the
 * pages in its revalidation list were clean while /contact, /careers and a dozen
 * others still linked to it from the footer.
 */
describe("a solution change refreshes the layout, because the footer lists solutions", () => {
  for (const kind of ["afterChange", "afterDelete"] as const) {
    it(`Solutions ${kind}`, () => {
      run(Solutions as never, kind);
      expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    });
  }

  it("a service change does not need to (the footer's services link is static)", () => {
    run(Services as never, "afterChange");
    expect(revalidatePath).not.toHaveBeenCalledWith("/", "layout");
  });
});

import { Careers } from "../globals/Careers";
import { Clients } from "../collections/Clients";
import { Company } from "../globals/Company";
import { Events } from "../collections/Events";
import { Jobs } from "../collections/Jobs";
import { News } from "../collections/News";
import { PageCopy } from "../globals/PageCopy";
import { Partners } from "../collections/Partners";
import { Posts } from "../collections/Posts";
import { Projects } from "../collections/Projects";

/*
 * revalidatePath("/projects") refreshes that one URL, not /projects/<slug>.
 * Unpublishing a project therefore left a link to it on every solution page that
 * lists its delivered work, and on its sector siblings -- found by the Phase 5
 * review, because the live proof used a solution, whose layout-wide refresh hid
 * the gap. Each source below must refresh the *dynamic page types* that render
 * it, not only the index.
 */
const PAGE_TYPES: [string, unknown, "collection" | "global", string[]][] = [
  ["Projects", Projects, "collection", ["/solutions/[slug]", "/projects/[slug]"]],
  ["Services", Services, "collection", ["/services/[slug]"]],
  ["News", News, "collection", ["/news/[slug]", "/resources/media/[slug]"]],
  ["Events", Events, "collection", ["/events/[slug]"]],
  ["Jobs", Jobs, "collection", ["/careers/open-positions/[slug]"]],
  ["Clients", Clients, "collection", ["/projects/[slug]", "/solutions/[slug]"]],
  ["Posts", Posts, "collection", ["/solutions/[slug]"]],
  ["Partners", Partners, "collection", ["/solutions/[slug]", "/projects/[slug]"]],
  ["PageCopy", PageCopy, "global", ["/projects/[slug]", "/resources/media/[slug]"]],
  ["Careers", Careers, "global", ["/careers/open-positions/[slug]"]],
];

describe("every source refreshes the dynamic pages that render it", () => {
  for (const [name, config, kind, patterns] of PAGE_TYPES) {
    it(`${name} refreshes ${patterns.join(" and ")}`, () => {
      const hooks = (config as { hooks?: { afterChange?: unknown[] } }).hooks;
      const hook = hooks?.afterChange?.[0] as (a: unknown) => unknown;
      hook(kind === "global" ? { doc: {} } : { doc: { slug: "x" }, previousDoc: { slug: "x" } });
      for (const pattern of patterns) {
        expect(revalidatePath, pattern).toHaveBeenCalledWith(pattern, "page");
      }
    });
  }

  it("Company refreshes the layout, because the footer prints its legal name", () => {
    const hook = (Company as { hooks?: { afterChange?: unknown[] } }).hooks?.afterChange?.[0] as (a: unknown) => unknown;
    hook({ doc: {} });
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("deleting a project refreshes the same page types", () => {
    run(Projects as never, "afterDelete");
    expect(revalidatePath).toHaveBeenCalledWith("/solutions/[slug]", "page");
  });
});

describe("the resource centre", () => {
  it("a client change refreshes the pages that name clients", () => {
    run(Clients as never, "afterChange");
    for (const page of ["/", "/clients", "/about", "/projects", "/solutions"]) {
      expect(revalidatePath, page).toHaveBeenCalledWith(page);
    }
  });
});

/*
 * Live finding: the pattern call alone left /solutions/<slug> and
 * /projects/<slug> pages serving a link to an unpublished project (x-nextjs-cache
 * HIT 15s later). Concrete URLs do purge, so each pattern is expanded to them.
 */
describe("dynamic page types are refreshed by their concrete URLs", () => {
  const payload = {
    find: vi.fn(async ({ collection }: { collection: string }) => ({
      docs:
        collection === "solutions"
          ? [{ slug: "system-cloud" }, { slug: "software-ai-digital" }]
          : [{ slug: "gadaa-bank" }, {}],
    })),
  };

  it("a project change refreshes every solution and project page by URL", async () => {
    const hook = (Projects as { hooks: { afterChange: unknown[] } }).hooks.afterChange[0] as (
      a: unknown,
    ) => Promise<unknown>;
    await hook({ doc: { slug: "x" }, previousDoc: { slug: "x" }, req: { payload } });
    for (const p of ["/solutions/system-cloud", "/solutions/software-ai-digital", "/projects/gadaa-bank"]) {
      expect(revalidatePath, p).toHaveBeenCalledWith(p);
    }
  });

  it("without a payload instance (seed script) it still completes", async () => {
    const hook = (Projects as { hooks: { afterChange: unknown[] } }).hooks.afterChange[0] as (
      a: unknown,
    ) => Promise<unknown>;
    await expect(hook({ doc: { slug: "x" }, previousDoc: null })).resolves.toBeTruthy();
  });
});

import { affectsPublishedSite, revalidateAfterChange, revalidateAfterDelete, revalidateGlobal } from "./revalidate";

/*
 * Phase 7: an autosave or Save Draft over a published document must not re-render
 * the live page, but a publish, an unpublish, or an edit of a published document
 * must. Payload 3.88 hands the afterChange hook, for a draft-version save, the
 * draft version as `doc` and the latest version as `previousDoc`; an Unpublish is
 * a plain PATCH (no `draft=true`) of `_status: "draft"` whose `previousDoc` is the
 * LATEST version, which is "draft" when an autosave is pending. So the statuses
 * alone cannot tell a draft save from an unpublish; `req.query.draft` (set by
 * autosave and Save Draft, never by Unpublish or Publish) is the signal.
 */
describe("affectsPublishedSite", () => {
  const D = { _status: "draft" };
  const P = { _status: "published" };
  const draftSave = { draft: true };
  const cases: [string, { doc: unknown; previousDoc?: unknown; query?: unknown }, boolean][] = [
    ["new document saved as a draft (create, previousDoc {})", { doc: D, previousDoc: {}, query: draftSave }, false],
    ["new draft with no query signal (nothing was ever public)", { doc: D, previousDoc: {} }, false],
    ["autosave of a never-published draft", { doc: D, previousDoc: D, query: draftSave }, false],
    ["autosave over a published document", { doc: D, previousDoc: P, query: draftSave }, false],
    ["Save Draft over a published document (draft=true as a string)", { doc: D, previousDoc: P, query: { draft: "true" } }, false],
    ["publish of a draft", { doc: P, previousDoc: D }, true],
    ["publish of a draft that sent draft=true with _status published", { doc: P, previousDoc: D, query: draftSave }, true],
    ["edit and publish of a published document", { doc: P, previousDoc: P }, true],
    ["unpublish (published -> draft, no draft query)", { doc: D, previousDoc: P }, true],
    ["unpublish while an autosave is pending (draft -> draft, no draft query)", { doc: D, previousDoc: D }, true],
    ["draft over published from the Local API (no query to tell)", { doc: D, previousDoc: P, query: {} }, true],
    ["draft=false is not a draft save", { doc: D, previousDoc: P, query: { draft: "false" } }, true],
    ["no _status at all (global, forms)", { doc: { title: "x" }, previousDoc: { title: "x" } }, true],
    ["no _status and a draft query (a collection without drafts)", { doc: {}, previousDoc: {}, query: draftSave }, true],
  ];
  for (const [name, args, expected] of cases) {
    it(`${name}: ${expected ? "revalidates" : "skips"}`, () => {
      expect(affectsPublishedSite(args as never)).toBe(expected);
    });
  }
});

describe("the change hook skips draft-version saves only", () => {
  const hook = revalidateAfterChange<{ slug: string }>((d) => [`/things/${d.slug}`]);
  const call = (doc: unknown, previousDoc: unknown, query?: unknown) =>
    hook({ doc, previousDoc, req: { query } } as never);
  const x = (_status?: string) => ({ slug: "x", ...(_status ? { _status } : {}) });

  it("draft -> draft on a new document: not called", async () => {
    await call(x("draft"), {}, { draft: true });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
  it("autosave over a published document: not called", async () => {
    await call(x("draft"), x("published"), { draft: true, autosave: true });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
  it("draft -> published: called", async () => {
    await call(x("published"), x("draft"));
    expect(revalidatePath).toHaveBeenCalledWith("/things/x");
  });
  it("published -> published: called", async () => {
    await call(x("published"), x("published"));
    expect(revalidatePath).toHaveBeenCalledWith("/things/x");
  });
  it("a real unpublish: called", async () => {
    await call(x("draft"), x("published"));
    expect(revalidatePath).toHaveBeenCalledWith("/things/x");
  });
  it("a real unpublish with a pending autosave: called", async () => {
    await call(x("draft"), x("draft"));
    expect(revalidatePath).toHaveBeenCalledWith("/things/x");
  });
  it("a document with no _status (forms): called", async () => {
    await call({ slug: "x" }, { slug: "x" });
    expect(revalidatePath).toHaveBeenCalledWith("/things/x");
  });
  it("still returns the doc", async () => {
    const doc = x("draft");
    await expect(call(doc, {}, { draft: true })).resolves.toBe(doc);
  });
});

describe("delete and globals always revalidate", () => {
  it("deleting a draft document still revalidates", async () => {
    await revalidateAfterDelete<{ slug: string }>((d) => [`/things/${d.slug}`])({
      doc: { slug: "x", _status: "draft" },
      req: { query: { draft: true } },
    } as never);
    expect(revalidatePath).toHaveBeenCalledWith("/things/x");
  });
  it("a global update revalidates even with a draft query", async () => {
    await revalidateGlobal(["/about"])({ doc: {}, req: { query: { draft: true } } } as never);
    expect(revalidatePath).toHaveBeenCalledWith("/about");
  });
});
