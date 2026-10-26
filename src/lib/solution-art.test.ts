import { describe, expect, it } from "vitest";
import { SOLUTION_ART, solutionArtSrc } from "./solution-art";

describe("solutionArtSrc", () => {
  it("returns null for a slug with no entry", () => {
    expect(solutionArtSrc("cybersecurity", {})).toBeNull();
    expect(solutionArtSrc("toString", {})).toBeNull();
  });

  it("builds the public URL from the slug and extension", () => {
    expect(solutionArtSrc("cybersecurity", { cybersecurity: "png" })).toBe(
      "/solutions/art/cybersecurity.png",
    );
    expect(solutionArtSrc("system-cloud", { "system-cloud": "svg" })).toBe(
      "/solutions/art/system-cloud.svg",
    );
  });

  it("starts with every real solution unlisted", () => {
    expect(Object.keys(SOLUTION_ART)).toEqual([]);
  });
});
