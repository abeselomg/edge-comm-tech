import { describe, expect, it } from "vitest";
import { approvedLogo } from "./media";

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
