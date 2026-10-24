import { describe, expect, it } from "vitest";
import { routeFor } from "../src/lib/routes";
import { pageList } from "./parity-pages.mjs";

describe("pageList", () => {
  it("splits the 51 Highland pages into the 14 static and 37 dynamic", () => {
    expect(pageList("static")).toHaveLength(14);
    expect(pageList("dynamic")).toHaveLength(37);
    expect(pageList("all")).toHaveLength(51);
  });

  it("is derived from the Highland directory, so a new page cannot be forgotten", () => {
    const all = pageList("all");
    expect(new Set(all).size).toBe(all.length);
    expect(all).toContain("solution-cybersecurity");
    expect(all).toContain("media-coverage");
  });

  it("never lists a page twice across the two scopes", () => {
    const overlap = pageList("static").filter((p) => pageList("dynamic").includes(p));
    expect(overlap).toEqual([]);
  });

  it("lists only pages the route map can place", () => {
    for (const page of pageList("all")) {
      expect(() => routeFor(`${page}.html`), page).not.toThrow();
    }
  });

  it("rejects an unknown scope rather than returning nothing", () => {
    expect(() => pageList("everything" as never)).toThrow(/scope/i);
  });
});
