import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MAX_DELAY_S, STEP_S, revealDelay, revealKind, SectionReveal } from "./section-reveal";

describe("section reveal", () => {
  it("staggers pieces in order and never past the cap", () => {
    expect(revealDelay(0)).toBe(0);
    expect(revealDelay(1)).toBeCloseTo(STEP_S);
    expect(revealDelay(3)).toBeCloseTo(3 * STEP_S);
    expect(revealDelay(500)).toBe(MAX_DELAY_S);
    expect(revealDelay(-4)).toBe(0);
  });

  it("gives every piece the same straight rise, headings included", () => {
    for (const tag of ["H2", "h2", "P", "A", "DIV", "SPAN"]) expect(revealKind(tag)).toBe("up");
  });

  it("renders nothing: it only tags elements and watches them in the browser", () => {
    expect(renderToStaticMarkup(<SectionReveal />)).toBe("");
  });
});
