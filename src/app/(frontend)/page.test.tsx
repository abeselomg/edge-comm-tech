import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { PROJECTS } from "../../../design-src/highland/content.mjs";
import { featuredProjects, impactCard, SuccessStory } from "./home-parts";
import HomePage from "./page";

vi.mock("@/lib/content", () => ({
  getSiteSettings: async () => ({ impact: [], impactSupport: null }),
  getCompany: async () => ({
    legalName: "Edge Communication Technologies",
    shortName: "Edge Comm-Tech",
    mission: "M",
    missionBody: "MB",
    vision: "V",
    positioning: "P",
    differentiators: [],
    // Still in the CMS, no longer on the page.
    industries: [{ title: "Industry marker title", body: "Industry marker body" }],
    delivery: [{ title: "Delivery marker title", body: "Delivery marker body" }],
  }),
  getContactDetails: async () => ({ office: [] }),
  getPageCopy: async () => ({
    homeHero: {
      eyebrow: "E",
      title: "Hero title",
      intro: "Hero intro",
      introSecondary: "Secondary marker paragraph",
    },
    homePriorities: [],
  }),
  getSolutions: async () => [],
  getProjects: async () => [],
  getClients: async () => [
    { name: "Bahir Dar University", sector: "education", logo: null },
  ],
  getPartners: async () => [{ name: "HPE", featured: true, logo: null }],
  getPosts: async () => [],
}));

const html =(el: React.ReactElement) => renderToStaticMarkup(el);

/*
 * The CMS shape, built from the approved content the way the seed builds it:
 * `featured` is a boolean and `order` carries the position, because the
 * content's 1..6 rank equals each featured project's place in the list.
 */
type Row = { slug: string; featured: boolean; order: number };
const asStored: Row[] = (PROJECTS as { slug: string; featured: number }[]).map((p, i) => ({
  slug: p.slug,
  featured: p.featured > 0,
  order: i + 1,
}));

describe("featuredProjects", () => {
  it("returns the six featured projects in the approved order", () => {
    expect(featuredProjects(asStored).map((p) => p.slug)).toEqual([
      "bahir-dar-university-smart-classrooms",
      "bahir-dar-university-safe-campus",
      "gadaa-bank-computing-infrastructure",
      "national-bank-ethiopia-backup-infrastructure",
      "ministry-urban-infrastructure-computing",
      "siinqee-bank-datacenter-power",
    ]);
  });

  it("drops the two that are not featured", () => {
    // Eight projects exist; six lead the home page.
    expect(asStored).toHaveLength(8);
    expect(featuredProjects(asStored)).toHaveLength(6);
  });

  it("orders by order, not by the order the database returned them", () => {
    const shuffled = [...asStored].reverse();
    expect(featuredProjects(shuffled).map((p) => p.order)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("returns nothing when none are featured, rather than falling back to all", () => {
    // An editor can clear every featured flag. Showing all eight instead
    // would be a page quietly deciding what to promote.
    expect(featuredProjects(asStored.map((p) => ({ ...p, featured: false })))).toEqual([]);
  });
});

describe("impactCard", () => {
  it("renders the figure, its unit and its line", () => {
    /*
     * Review Focus #5. The 100% counter's qualifier lives in `line`, a
     * sibling of `figure` and `unit`. A card that renders the first two and
     * drops the third publishes a bare "100% completion", which the content
     * master forbids wherever the figure appears.
     */
    const out = html(
      impactCard({ figure: "100%", unit: "completion", line: "against agreed project scope" }),
    );
    expect(out).toContain("100%");
    expect(out).toContain("completion");
    expect(out).toContain("against agreed project scope");
  });

  it("renders a counter with no line without printing undefined", () => {
    const out = html(impactCard({ figure: "67+", unit: "projects", line: null }));
    expect(out).toContain("67+");
    expect(out).not.toContain("undefined");
    expect(out).not.toContain("null");
  });
});

describe("SuccessStory", () => {
  const story = (client: unknown) =>
    ({
      slug: "s", title: "T", summary: "S", sectorFull: "Education", location: "L",
      year: { status: "pending", value: null, pendingLabel: "Year to confirm" },
      client, solutions: [], tech: [],
    }) as never;

  // A deleted client sets the relationship to null, and typeof null is "object".
  it("renders when the client relationship is null", () => {
    expect(() => html(<SuccessStory story={story(null)} />)).not.toThrow();
  });
  it("renders the client's name when populated", () => {
    expect(html(<SuccessStory story={story({ name: "Bahir Dar University" })} />)).toContain("Bahir Dar University");
  });
});

describe("HomePage structure (owner's changes, 2026-10-26)", () => {
  const render = async () => html(await HomePage());

  it("has no secondary hero paragraph", async () => {
    const out = await render();
    expect(out).toContain("Hero intro");
    expect(out).not.toContain("Secondary marker paragraph");
  });

  it("has exactly two hero buttons: solutions (filled) and projects (outlined)", async () => {
    const out = await render();
    const start = out.indexOf("mt-10 flex flex-wrap items-center gap-3");
    const hero = out.slice(start, out.indexOf("</div>", start));
    const links = [...hero.matchAll(/<a ([^>]*)>(.*?)<\/a>/g)].map((m) => ({
      href: /href="([^"]*)"/.exec(m[1])?.[1],
      cls: /class="([^"]*)"/.exec(m[1])?.[1] ?? "",
      label: m[2].replace(/<[^>]+>/g, ""), // the label is wrapped in <Tr>'s span
    }));
    expect(links.map((l) => [l.href, l.label])).toEqual([
      ["/solutions", "Explore our solutions"],
      ["/projects", "View our projects"],
    ]);
    expect(links[0].cls).toContain("bg-gold");
    expect(links[1].cls).toContain("border-gold");
    expect(links[1].cls).not.toContain("underline");
    expect(hero).not.toContain("Talk to our experts");
  });

  it("drops Industry expertise and How we deliver, though the CMS still holds them", async () => {
    const out = await render();
    for (const gone of [
      "Industry expertise",
      "Industry marker title",
      "How we deliver",
      "Delivery marker title",
    ]) {
      expect(out).not.toContain(gone);
    }
  });

  it("puts the partners section after the priorities band and before Projects", async () => {
    const out = await render();
    const at = (s: string) => out.indexOf(s);
    expect(at("Building what comes next")).toBeGreaterThan(-1);
    expect(at("Global technology ecosystem")).toBeGreaterThan(at("Building what comes next"));
    expect(at("Proven delivery")).toBeGreaterThan(at("Global technology ecosystem"));
    expect(out).toContain('href="/partners"');
  });

  it("shows a client without a logo by name, with no filled placeholder cells", async () => {
    const out = await render();
    const clients = out.slice(out.indexOf('id="clients"'));
    expect(clients).toContain("Bahir Dar University");
    // The grid no longer paints its background (the blue blocks) behind empty cells.
    const ul = clients.match(/<ul class="[^"]*">/)?.[0] ?? "";
    expect(ul).not.toContain("bg-rule");
  });
});
