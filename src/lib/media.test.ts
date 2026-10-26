import { describe, expect, it } from "vitest";
import { approvedLogo, projectCover, projectGallery } from "./media";

describe("approvedLogo", () => {
  it("returns an approved asset", () => {
    const logo = { id: 1, url: "/m/hp.png", alt: "HP", approved: true };
    expect(approvedLogo(logo)).toEqual(logo);
  });

  it("returns null for an asset whose approval was withdrawn", () => {
    // Review Focus #5. filterOptions stops SELECTION in the admin; it does
    // nothing about an asset un-approved after it was selected.
    expect(approvedLogo({ id: 1, url: "/m/hp.png", alt: "HP", approved: false })).toBe(null);
  });

  it("returns null when approval is absent rather than assuming true", () => {
    expect(approvedLogo({ id: 1, url: "/m/hp.png", alt: "HP" })).toBe(null);
  });

  it("returns null for an unpopulated relationship", () => {
    // depth: 0 gives a bare id, which carries no approval state to trust.
    expect(approvedLogo(7)).toBe(null);
    expect(approvedLogo("7")).toBe(null);
  });

  it("returns null for null, undefined and nonsense", () => {
    expect(approvedLogo(null)).toBe(null);
    expect(approvedLogo(undefined)).toBe(null);
    expect(approvedLogo({})).toBe(null);
  });

  it("returns null when the asset has no url to render", () => {
    expect(approvedLogo({ id: 1, alt: "HP", approved: true })).toBe(null);
  });
});

describe("projectCover and projectGallery", () => {
  const ok = (n: number) => ({ id: n, url: `/m/${n}.jpg`, alt: `Pic ${n}`, approved: true });

  it("returns the approved cover and nothing for an unapproved or bare one", () => {
    expect(projectCover({ coverImage: ok(1) })?.url).toBe("/m/1.jpg");
    expect(projectCover({ coverImage: { ...ok(1), approved: false } })).toBeNull();
    expect(projectCover({ coverImage: 4 })).toBeNull();
    expect(projectCover({})).toBeNull();
  });

  it("keeps only approved gallery rows, in order, trimming captions to null when blank", () => {
    const rows = projectGallery({
      gallery: [
        { image: ok(1), caption: "  First  " },
        { image: { ...ok(2), approved: false }, caption: "Hidden" },
        { image: ok(3), caption: "   " },
        { image: 9 },
        { image: ok(4) },
      ],
    });
    expect(rows.map((r) => r.image.id)).toEqual([1, 3, 4]);
    expect(rows.map((r) => r.caption)).toEqual(["First", null, null]);
  });

  it("is empty for a missing or malformed gallery", () => {
    expect(projectGallery({})).toEqual([]);
    expect(projectGallery({ gallery: null })).toEqual([]);
  });
});
