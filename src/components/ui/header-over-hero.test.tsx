import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AT_TOP_PX, HeaderOverHero, isAtTop } from "./header-over-hero";

describe("header over the hero", () => {
  it("counts only the very top of the page as the top", () => {
    expect(isAtTop(0)).toBe(true);
    expect(isAtTop(AT_TOP_PX - 1)).toBe(true);
    expect(isAtTop(AT_TOP_PX)).toBe(false);
    expect(isAtTop(900)).toBe(false);
  });

  it("renders nothing (it only sets attributes for the stylesheet)", () => {
    expect(renderToStaticMarkup(<HeaderOverHero />)).toBe("");
  });
});
