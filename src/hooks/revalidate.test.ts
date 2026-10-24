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
