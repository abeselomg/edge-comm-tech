import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FontGate } from "./font-gate";
import {
  GATE_BOOT_SCRIPT,
  GATE_FLAG,
  MAX_WAIT_MS,
  MIN_SHOW_MS,
  remainingHoldMs,
  remainingWaitMs,
  shouldShowGate,
} from "./font-gate-logic";

describe("font gate logic", () => {
  it("shows only until the session flag is set", () => {
    expect(shouldShowGate(null)).toBe(true);
    expect(shouldShowGate(undefined)).toBe(true);
    expect(shouldShowGate("")).toBe(true);
    expect(shouldShowGate("1")).toBe(false);
  });

  it("holds for the minimum on a real load and not at all when cached", () => {
    expect(remainingHoldMs(0, false)).toBe(MIN_SHOW_MS);
    expect(remainingHoldMs(100, false)).toBe(MIN_SHOW_MS - 100);
    expect(remainingHoldMs(MIN_SHOW_MS + 500, false)).toBe(0);
    expect(remainingHoldMs(0, true)).toBe(0);
  });

  it("caps the wait", () => {
    expect(remainingWaitMs(0)).toBe(MAX_WAIT_MS);
    expect(remainingWaitMs(MAX_WAIT_MS + 1)).toBe(0);
  });

  it("boot script reads the same flag and hides the cover at once", () => {
    expect(GATE_BOOT_SCRIPT).toContain(GATE_FLAG);
    expect(GATE_BOOT_SCRIPT).toContain('"data-fonts","gone"');
  });
});

describe("FontGate", () => {
  const out = renderToStaticMarkup(<FontGate />);

  it("is an aria-hidden cover with the loader and no text", () => {
    expect(out).toMatch(/^<div class="eg-fontgate" aria-hidden="true">/);
    expect(out).toContain("<svg");
    expect(out).toContain("eg-load-orbit");
    // outside of the inline boot script there is no text node at all
    expect(out.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]*>/g, "").trim()).toBe("");
  });
});