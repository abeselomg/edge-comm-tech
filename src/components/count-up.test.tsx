import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CountUp, splitFigure } from "./count-up";

describe("CountUp", () => {
  it("renders the final figure, unchanged, in the server HTML", () => {
    for (const v of ["100%", "7", "1,200+", "98.5%", "2018", "n/a"]) {
      const html = renderToStaticMarkup(<CountUp value={v} />);
      expect(html.replace(/<[^>]+>/g, "")).toBe(v);
    }
  });

  it("splits numbers from their affixes and leaves years alone", () => {
    expect(splitFigure("100%")).toMatchObject({ prefix: "", n: 100, suffix: "%" });
    expect(splitFigure("1,200+")).toMatchObject({ n: 1200, suffix: "+", grouped: true });
    expect(splitFigure("98.5%")).toMatchObject({ n: 98.5, decimals: 1 });
    expect(splitFigure("2018")).toBeNull();
    expect(splitFigure("n/a")).toBeNull();
  });
});
