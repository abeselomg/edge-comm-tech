import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PARTNER_CATEGORIES } from "../../design-src/highland/content.mjs";
import { ringLabelFor, RING_LABELS } from "./page-copy";

/*
 * The partner ring's short labels are Highland's own, hand-written to fit a
 * circle. The seed once derived them by splitting the long name on "and", which
 * produced "Software, AI" and "Enterprise Network" -- close, wrong, and visible
 * on every brand card.
 */
describe("RING_LABELS", () => {
  it("has a label for every approved category, and no others", () => {
    expect(Object.keys(RING_LABELS).sort()).toEqual(
      PARTNER_CATEGORIES.map(([k]: string[]) => k).sort(),
    );
  });

  it("matches the labels in Highland's partners page, character for character", () => {
    const src = readFileSync(
      new URL("../../design-src/highland/pages/partners.mjs", import.meta.url),
      "utf8",
    );
    const block = src.slice(src.indexOf("const RING = {"), src.indexOf("};", src.indexOf("const RING = {")));
    for (const [key, label] of Object.entries(RING_LABELS)) {
      const line = block.split(/\r?\n/).find((l) => l.includes(key.includes("-") ? `"${key}"` : `${key}:`));
      expect(line, key).toContain(`"${label}"`);
    }
  });

  it("throws on a category it does not know rather than guessing", () => {
    expect(() => ringLabelFor("invented")).toThrow(/invented/);
  });
});
