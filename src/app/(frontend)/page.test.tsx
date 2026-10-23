import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PROJECTS } from "../../../design-src/highland/content.mjs";
import { featuredProjects, impactCard } from "./home-parts";

const html = (el: React.ReactElement) => renderToStaticMarkup(el);

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
