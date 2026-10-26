import { existsSync } from "node:fs";
import { join } from "node:path";
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

  it("lists only files that exist under public/solutions/art", () => {
    for (const [slug, ext] of Object.entries(SOLUTION_ART)) {
      expect(existsSync(join(process.cwd(), "public/solutions/art", `${slug}.${ext}`))).toBe(true);
    }
  });

  it("keeps the datacenter on its hand-drawn scene (its sourced picture reads as filing cabinets)", () => {
    expect(SOLUTION_ART["datacenter-facility-it-infrastructure"]).toBeUndefined();
  });
});
