import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HeroAmbience, type AmbienceTheme } from "./hero-ambience";
import { PageHead } from "./page-head";

const THEMES: AmbienceTheme[] = ["solutions", "projects", "clients", "general"];
const text = (out: string) =>
  out
    .replace(/<[^>]+>/g, "\n")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

describe("HeroAmbience", () => {
  it("is hidden from assistive tech, inert, and carries no text", () => {
    for (const theme of THEMES) {
      const out = renderToStaticMarkup(<HeroAmbience theme={theme} />);
      expect(out).toMatch(/^<div[^>]*pointer-events-none[^>]*aria-hidden="true"/);
      expect(out).not.toMatch(/tabindex|href=|<a |<button|<title|<img/i);
      expect(text(out)).toEqual([]);
      expect(out).toContain("overflow-clip");
    }
  });

  it("draws different icons for each page family", () => {
    const outs = THEMES.map((t) => renderToStaticMarkup(<HeroAmbience theme={t} />));
    expect(new Set(outs).size).toBe(THEMES.length);
    expect(outs[0].match(/<svg/g)).toHaveLength(6);
  });

  it("adds no text to a PageHead, and sits before the content", () => {
    const props = { eyebrow: "Eyebrow", title: "Title", intro: "Intro" };
    const plain = renderToStaticMarkup(<PageHead {...props} />);
    const withIt = renderToStaticMarkup(<PageHead {...props} ambience="solutions" />);
    expect(text(withIt)).toEqual(text(plain));
    expect(withIt.indexOf('aria-hidden="true"')).toBeLessThan(withIt.indexOf("Eyebrow"));
    expect(plain).not.toContain("eg-float");
  });

  it("is switched on for the solutions, projects and clients heroes", () => {
    for (const page of ["solutions", "projects", "clients"]) {
      const src = readFileSync(`src/app/(frontend)/${page}/page.tsx`, "utf8");
      expect(src).toContain(`ambience="${page}"`);
    }
  });
});
