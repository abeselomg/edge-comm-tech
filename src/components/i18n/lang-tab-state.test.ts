import { describe, expect, it } from "vitest";
import { isDelayed, LEAVE_DELAY_MS, nextOpen } from "./lang-tab-state";

describe("language tab open state", () => {
  it("opens on hover and on keyboard focus", () => {
    expect(nextOpen(false, "enter")).toBe(true);
    expect(nextOpen(false, "focus")).toBe(true);
  });

  it("a mouse or keyboard press opens and never closes, since hover or focus already did", () => {
    expect(nextOpen(false, "press")).toBe(true);
    expect(nextOpen(true, "press")).toBe(true);
  });

  it("a touch tap toggles", () => {
    expect(nextOpen(false, "press-touch")).toBe(true);
    expect(nextOpen(true, "press-touch")).toBe(false);
  });

  it("closes on leave, blur, Escape and outside taps", () => {
    for (const e of ["leave", "blur", "escape", "outside"] as const) expect(nextOpen(true, e)).toBe(false);
  });

  it("delays only the leave and blur closes, by a short hover-intent time", () => {
    expect(isDelayed("leave")).toBe(true);
    expect(isDelayed("blur")).toBe(true);
    for (const e of ["escape", "outside", "enter", "focus", "press", "press-touch"] as const) expect(isDelayed(e)).toBe(false);
    expect(LEAVE_DELAY_MS).toBeGreaterThanOrEqual(150);
    expect(LEAVE_DELAY_MS).toBeLessThanOrEqual(400);
  });
});
