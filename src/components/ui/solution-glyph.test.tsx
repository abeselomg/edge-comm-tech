import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ACCENT } from "../../../design-src/highland/content.mjs";
import { hasSolutionGlyph, SolutionGlyph, SolutionWatermark } from "./solution-glyph";

const html = (el: React.ReactElement) => renderToStaticMarkup(el);
const slugs = Object.keys(ACCENT as Record<string, string>);

describe("SolutionGlyph", () => {
  it("has a drawn glyph for every approved solution and service slug", () => {
    expect(slugs.length).toBeGreaterThanOrEqual(7);
    for (const slug of slugs) expect(hasSolutionGlyph(slug)).toBe(true);
  });

  it("draws something for each slug and falls back for an unknown one", () => {
    for (const slug of [...slugs, "a-future-family"]) {
      expect(html(<SolutionGlyph slug={slug} />)).toMatch(/<(path|circle|rect)/);
    }
    expect(hasSolutionGlyph("a-future-family")).toBe(false);
  });

  it("is decorative: aria-hidden and text-free", () => {
    const out = html(<SolutionGlyph slug="cybersecurity" />);
    expect(out).toContain('aria-hidden="true"');
    expect(out.replace(/<[^>]*>/g, "")).toBe("");
  });
});

describe("SolutionWatermark", () => {
  it("is aria-hidden, ignores the pointer, sits behind and carries no text", () => {
    for (const slug of slugs) {
      const out = html(<SolutionWatermark slug={slug} accent="#0888c5" />);
      expect(out).toContain('aria-hidden="true"');
      expect(out).toContain("pointer-events-none");
      expect(out).toContain("-z-10");
      expect(out).toContain("color:#0888c5");
      expect(out.replace(/<[^>]*>/g, "")).toBe("");
    }
  });
});
