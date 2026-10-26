import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/*
 * Heading outline: a page must go h1 > h2 > h3 without skipping a level on
 * the way down. This reads each page's source in order and counts the
 * components that render a heading as that level (PageHead is the h1,
 * SectionHead and ClosingCta an h2, the careers vacancy list an h2 per role).
 * It cannot see data-driven markup, so it is a guard against the structural
 * skips (an h3 or h4 straight after the h1/h2), not a full audit.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const COMPONENT_LEVEL: Record<string, number> = {
  PageHead: 1,
  SectionHead: 2,
  ClosingCta: 2,
  PositionsList: 2,
};

/** The heading levels a source file produces, in document order. */
export function headingLevels(src: string): number[] {
  const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
  const levels: { at: number; level: number }[] = [];
  for (const m of code.matchAll(/<h([1-6])[\s>]/g)) levels.push({ at: m.index!, level: Number(m[1]) });
  for (const m of code.matchAll(/<([A-Z]\w*)[\s/>]/g)) {
    const level = COMPONENT_LEVEL[m[1]];
    if (level) levels.push({ at: m.index!, level });
  }
  return levels.sort((a, b) => a.at - b.at).map((l) => l.level);
}

/** Where the outline jumps down by more than one level (an h1 followed by an h3, say). */
export function headingSkips(levels: number[], start = 0): string[] {
  const out: string[] = [];
  let prev = start;
  for (const level of levels) {
    if (level > prev + 1) out.push(`h${level} after ${prev ? `h${prev}` : "nothing"}`);
    prev = level;
  }
  return out;
}

function pages(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) pages(full, out);
    else if (name === "page.tsx") out.push(full);
  }
  return out;
}

const read = (...p: string[]) => readFileSync(path.join(here, ...p), "utf8");

describe("the heading-order helper", () => {
  it("flags an h3 straight after the h1 and passes a clean outline", () => {
    expect(headingSkips(headingLevels("<PageHead /><h3>x</h3>"))).toEqual(["h3 after h1"]);
    expect(headingSkips(headingLevels("<PageHead /><SectionHead /><h3>x</h3><h2>y</h2>"))).toEqual([]);
  });
});

describe("heading order", () => {
  it("never skips a level in any frontend page", () => {
    const bad: Record<string, string[]> = {};
    for (const file of pages(here)) {
      // The home page and detail pages start their own h1; a page with no h1 of
      // its own starts the check from h1 as if PageHead had been first.
      const levels = headingLevels(readFileSync(file, "utf8"));
      const skips = headingSkips(levels, levels.includes(1) ? 0 : 1);
      if (skips.length) bad[path.relative(here, file)] = skips;
    }
    expect(bad).toEqual({});
  });

  it("keeps the first sub-heading level at h2 on e-academy, open positions and services", () => {
    expect(read("careers/e-academy/page.tsx")).not.toMatch(/<h3[^>]*>\{a\.title\}/);
    expect(read("careers/careers-parts.tsx")).not.toMatch(/<h3[^>]*group-hover:text-gold">\s*\{j\.title\}/);
    expect(headingSkips(headingLevels(read("careers/e-academy/page.tsx")))).toEqual([]);
    expect(headingSkips(headingLevels(read("careers/open-positions/page.tsx")))).toEqual([]);
    expect(headingSkips(headingLevels(read("services/page.tsx")))).toEqual([]);
  });

  it("makes the footer column titles h2s, not h4s", () => {
    const chrome = readFileSync(path.join(here, "../../components/chrome.tsx"), "utf8");
    expect(chrome).not.toMatch(/<h[345][\s>]/);
    expect((chrome.match(/<h2[\s>]/g) ?? []).length).toBeGreaterThanOrEqual(3);
  });
});
