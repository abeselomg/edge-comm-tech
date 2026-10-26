import { describe, expect, it } from "vitest";
import { AM } from "./am";

describe("the Amharic dictionary", () => {
  it("has entries, and every key and value is a non-empty string", () => {
    const entries = Object.entries(AM);
    expect(entries.length).toBeGreaterThan(10);
    for (const [en, am] of entries) {
      expect(typeof en).toBe("string");
      expect(en.trim()).not.toBe("");
      expect(typeof am).toBe("string");
      expect(am.trim()).not.toBe("");
    }
  });

  it("keys are the exact English (no stray whitespace) and values are not the English", () => {
    for (const [en, am] of Object.entries(AM)) {
      expect(en).toBe(en.trim());
      expect(am).toBe(am.trim());
      expect(am).not.toBe(en);
    }
  });

  it("values are Ethiopic script, apart from the Latin brand names they keep", () => {
    for (const am of Object.values(AM)) expect(am).toMatch(/[ሀ-፿]/);
  });

  it("covers the main navigation and the home hero", () => {
    for (const k of ["Solutions", "Projects", "Clients", "Partners", "Resources", "Blog", "Careers", "About", "Contact us"]) {
      expect(AM).toHaveProperty(k);
    }
    for (const k of [
      "Addis Ababa · Serving Ethiopia and beyond",
      "Accelerating Africa's digital transformation",
      "Explore our solutions",
      "View our projects",
    ]) {
      expect(AM).toHaveProperty(k);
    }
  });
});
