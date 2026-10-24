import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { pageList } from "./parity-pages.mjs";
import { scanPage } from "./content-scan.mjs";

const page = (text: string) => `<html><head><title>x</title></head><body><main><p>${text}</p></main></body></html>`;
const found = (text: string) => scanPage("p", page(text)).join("\n");

/*
 * Review Focus #5: the long tail of detail pages still honours the content
 * constraints. These are the project-wide rules, applied to what is rendered.
 */
describe("scanPage flags", () => {
  it("a certified Tier III claim (only 'aligned' is allowed)", () => {
    expect(found("Our Tier III-certified datacenter")).toMatch(/Tier III/i);
    expect(found("A Tier III certified facility")).toMatch(/Tier III/i);
    expect(found("Tier III-aligned design")).toBe("");
  });

  it("SOC as a word, but not inside another word", () => {
    expect(found("Run from the SOC")).toMatch(/SOC/);
    expect(found("A security control room")).toBe("");
    expect(found("Association and social")).toBe("");
  });

  it("partnership tiers and authorization levels", () => {
    expect(found("We are a Gold Partner")).toMatch(/partner/i);
    expect(found("We are an authorized reseller of X")).toMatch(/authori/i);
    expect(found("Edge Comm-Tech is a gold authorized distributor")).toMatch(/authori/i);
    // A statement about a document's source is not a claim about Edge.
    expect(found("supplied or approved by HPE or an authorized distributor")).toBe("");
    expect(found("Premier partner status")).toMatch(/partner/i);
  });

  it("salary, benefit and compensation wording", () => {
    for (const t of ["Salary is competitive", "A generous benefits package", "ETB 50,000 per month", "Compensation details"]) {
      expect(found(t), t).not.toBe("");
    }
  });

  it("each of the four organisations that must not appear", () => {
    for (const org of ["Bonga University", "Haramaya University", "Mizan-Tepi University", "Yekatit 12 Hospital"]) {
      expect(found(`Delivered for ${org}`), org).toMatch(/forbidden organisation/i);
    }
  });

  it("a value that leaked through unrendered", () => {
    for (const t of ["Completion: undefined", "Client null", "Year [object Object]"]) {
      expect(found(t), t).toMatch(/unrendered/i);
    }
  });

  it("the 100% completion figure without its scope qualifier", () => {
    expect(found("100% completion for every project")).toMatch(/against agreed project scope/);
    expect(found("100% completion against agreed project scope")).toBe("");
  });
});

describe("scanPage reads only what a visitor reads", () => {
  it("ignores scripts, styles and the head", () => {
    const html = `<html><head><title>SOC undefined</title><style>.x{}</style></head><body><script>var SOC = null;</script><p>Fine.</p></body></html>`;
    expect(scanPage("p", html)).toEqual([]);
  });
});

describe("scanPage on the approved Highland pages", () => {
  it("raises nothing on any of the 51, so a hit on the port is a real regression", () => {
    const all = pageList("all");
    expect(all).toHaveLength(51);
    for (const name of all) {
      const html = readFileSync(new URL(`../design-files/highland/${name}.html`, import.meta.url), "utf8");
      expect(scanPage(name, html), name).toEqual([]);
    }
  });
});
