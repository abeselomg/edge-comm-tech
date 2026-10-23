import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { brandCard, byCategory } from "./partner-parts";
import { bySector } from "../clients/client-parts";

const cat = (key: string, status = "published") => ({ key, _status: status });
const CATS = [cat("network"), cat("security"), cat("power")];
const partner = (name: string, ...cats: ReturnType<typeof cat>[]) => ({ name, categories: cats });

describe("byCategory", () => {
  it("files a partner under every published category it carries", () => {
    const out = byCategory(
      [partner("A", cat("network"), cat("security")), partner("B", cat("power"))],
      CATS,
    );
    expect(out.network.map((p) => p.name)).toEqual(["A"]);
    expect(out.security.map((p) => p.name)).toEqual(["A"]);
    expect(out.power.map((p) => p.name)).toEqual(["B"]);
  });

  /*
   * Review Focus #2. Payload's depth populate does not re-apply the published
   * filter to related documents, so a partner can arrive carrying a category
   * that has since been unpublished. That category must not become a group.
   */
  it("does not create a group from an unpublished category", () => {
    expect(byCategory([partner("X", cat("network", "draft"))], CATS)).toEqual({});
  });

  it("ignores a bare id where a document was expected", () => {
    const p = { name: "Y", categories: [7 as never, cat("power")] };
    expect(Object.keys(byCategory([p], CATS))).toEqual(["power"]);
  });

  it("keeps the category list's order, not the partners'", () => {
    const out = byCategory([partner("A", cat("power")), partner("B", cat("network"))], CATS);
    expect(Object.keys(out)).toEqual(["network", "power"]);
  });
});

describe("bySector", () => {
  const c = (name: string, sector: string) => ({ name, sector }) as never;
  it("groups by the three approved sectors, in their approved order", () => {
    const out = bySector([c("a", "government"), c("b", "education"), c("c", "banking")]);
    expect(Object.keys(out)).toEqual(["education", "banking", "government"]);
  });
  it("omits a sector with no clients rather than printing an empty section", () => {
    expect(Object.keys(bySector([c("a", "banking")]))).toEqual(["banking"]);
  });
});

describe("brandCard", () => {
  const card = (solution: unknown) =>
    renderToStaticMarkup(
      <ul>
        {brandCard(
          {
            name: "Brand",
            capability: "Does things.",
            logo: null,
            categories: [],
            projects: [],
            solution,
          } as never,
          {},
        )}
      </ul>,
    );

  it("links the solution a brand belongs to when it is published", () => {
    const out = card({ slug: "cyber", short: "Cyber", title: "Cyber", accent: "#111111", _status: "published" });
    expect(out).toContain('href="/solutions/cyber"');
  });

  // Review Focus #2: the depth populate keeps an unpublished solution.
  it("does not link, or take the colour of, an unpublished solution", () => {
    const out = card({ slug: "cyber", short: "Cyber", title: "Cyber", accent: "#111111", _status: "draft" });
    expect(out).not.toContain("/solutions/cyber");
    expect(out).not.toContain("#111111");
    expect(out).toContain("Brand");
  });

  it("copes with a solution that arrived as a bare id", () => {
    expect(card(4)).not.toContain("/solutions/");
  });
});
