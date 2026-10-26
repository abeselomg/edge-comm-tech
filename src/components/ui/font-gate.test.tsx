import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FontGate } from "./font-gate";
import {
  GATE_BOOT_SCRIPT,
  MAX_WAIT_MS,
  MIN_SHOW_MS,
  remainingHoldMs,
  remainingWaitMs,
} from "./font-gate-logic";

describe("page-load gate logic", () => {
  it("holds for the minimum from the start of the navigation, never beyond it", () => {
    expect(remainingHoldMs(0)).toBe(MIN_SHOW_MS);
    expect(remainingHoldMs(100)).toBe(MIN_SHOW_MS - 100);
    expect(remainingHoldMs(MIN_SHOW_MS + 500)).toBe(0);
  });

  it("caps the wait, and the cap is long enough for a slow connection but shorter than the CSS failsafe", () => {
    expect(remainingWaitMs(0)).toBe(MAX_WAIT_MS);
    expect(remainingWaitMs(MAX_WAIT_MS + 1)).toBe(0);
    expect(MAX_WAIT_MS).toBeGreaterThanOrEqual(5000);
    expect(MAX_WAIT_MS).toBeLessThan(8000); // the CSS failsafe (8s) must outlast it
  });

  it("boot script switches the cover on and nothing else", () => {
    expect(GATE_BOOT_SCRIPT).toContain('"data-gate","on"');
    expect(GATE_BOOT_SCRIPT).not.toContain("sessionStorage");
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