import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { applyPageWaivers, copySentences } from "./parity-copy.mjs";

/*
 * The home-page parity waiver (owner's restructure, 2026-10-26): the hero's
 * secondary paragraph and "Talk to our experts" button, the Industry expertise
 * and How we deliver sections are removed, and the partners section moves up to
 * sit before Projects. The waiver rewrites the Highland side only; the port is
 * never rewritten, so a port that still shows any of it is reported.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HIGHLAND = readFileSync(path.join(root, "design-files/highland/index.html"), "utf8");

const SECONDARY = "From enterprise networks and AI-ready infrastructure";
const waived = applyPageWaivers(HIGHLAND, "index", "highland");
/** What a conforming port renders, as far as copy goes. */
const port = waived;

const same = (p: string, h: string = HIGHLAND) =>
  JSON.stringify(copySentences(applyPageWaivers(p, "index", "port"), "index")) ===
  JSON.stringify(copySentences(applyPageWaivers(h, "index", "highland"), "index"));

const headings = (html: string) =>
  [...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => m[1].replace(/\s+/g, " ").trim());

describe("the home-page parity waiver", () => {
  it("finds what it is meant to remove (so the tests below are not vacuous)", () => {
    for (const s of [SECONDARY, "Talk to our experts", "Industry expertise", "How we deliver"]) {
      expect(HIGHLAND).toContain(s);
    }
  });

  it("removes exactly the five waived things from Highland", () => {
    expect(waived).not.toContain(SECONDARY);
    expect(waived).not.toContain("Industry expertise");
    expect(waived).not.toContain("Financial Services");
    expect(waived).not.toContain("How we deliver");
    expect(waived).not.toContain("Assess business priorities");
    // Only the hero button goes; the final call to action keeps its own.
    expect(waived.match(/Talk to our experts/g)).toHaveLength(1);
    expect(waived).toContain("Explore our solutions");
    expect(waived).toContain("View our projects");
    expect(waived).toContain("Who we are");
    expect(waived).toContain("Why choose us");
  });

  it("moves the partners section between the priorities band and Projects, intact", () => {
    const h = headings(waived);
    const i = (s: string) => h.findIndex((x) => x.includes(s));
    expect(i("Technology designed for today")).toBeGreaterThan(-1);
    expect(i("World-class technologies")).toBe(i("Technology designed for today") + 1);
    expect(i("Technology creating real institutional impact")).toBe(i("World-class technologies") + 1);
    // Nothing was lost in the move.
    expect(waived).toContain("View our technology partners");
    expect(waived.match(/<section\b/g)?.length).toBe((HIGHLAND.match(/<section\b/g)?.length ?? 0) - 2);
    expect(waived.match(/<\/section>/g)?.length).toBe((HIGHLAND.match(/<\/section>/g)?.length ?? 0) - 2);
  });

  it("passes a conforming port", () => {
    expect(same(port)).toBe(true);
  });

  it("is not applied to the port side", () => {
    expect(applyPageWaivers(HIGHLAND, "index", "port")).toBe(HIGHLAND);
  });

  it("still fails a port that keeps any removed piece", () => {
    expect(same(port.replace("<main>", `<main><p>${SECONDARY} to cloud, cybersecurity, software.</p>`))).toBe(false);
    expect(same(port.replace("<main>", "<main><p>Industry expertise: solutions built around sector-specific priorities</p>"))).toBe(false);
    expect(same(port.replace("<main>", "<main><p>Assess business priorities, existing environments, risks, technical requirements.</p>"))).toBe(false);
    // The un-waived Highland page is not a conforming port.
    expect(same(HIGHLAND)).toBe(false);
  });

  it("still fails changed or invented copy elsewhere on the home page", () => {
    const s = "Technologies are selected according to suitability";
    expect(port).toContain(s);
    expect(same(port.replace(s, "Technologies are chosen according to suitability"))).toBe(false);
    expect(same(port.replace("<main>", "<main><p>A brand new paragraph that Highland never had.</p>"))).toBe(false);
  });

  it("does not apply to any other page", () => {
    expect(applyPageWaivers(HIGHLAND, "clients", "highland")).toBe(HIGHLAND);
    expect(applyPageWaivers(HIGHLAND, "solutions", "highland")).toBe(HIGHLAND);
  });
});
