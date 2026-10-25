import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = path.dirname(fileURLToPath(import.meta.url));

function pages(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) pages(full, out);
    else if (name === "page.tsx") out.push(full);
  }
  return out;
}
function files(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) files(full, out);
    else if (/\.tsx?$/.test(name)) out.push(full);
  }
  return out;
}

/** True when the source sets the dynamicParams segment config to false, however written. */
function dynamicParamsFalse(src: string): boolean {
  const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
  const isFalse = (name: string) =>
    new RegExp(`\\b(?:const|let|var)\\s+${name}\\b[^=;]*=\\s*false\\b`).test(code);
  if (/\bexport\s+(?:const|let|var)\s+dynamicParams\b[^=;]*=\s*false\b/.test(code)) return true;
  for (const m of code.matchAll(/\bexport\s*\{([^}]*)\}\s*(from\b)?/g)) {
    for (const spec of m[1].split(",")) {
      const [local, exported = local] = spec.trim().split(/\s+as\s+/).map((s) => s.trim());
      if (exported !== "dynamicParams") continue;
      // A re-export from another module cannot be checked here, so it is refused.
      if (m[2] || isFalse(local)) return true;
    }
  }
  return false;
}

const rel = (f: string) => path.relative(here, f).replaceAll("\\", "/");
const all = pages(here);
const dynamic = all.filter((f) => rel(f).includes("[slug]"));
const read = (f: string) => readFileSync(f, "utf8");

/*
 * Review Focus #1 as a property of the code, not of one page: every dynamic
 * route prerenders its published slugs and answers 404 for any other, so a
 * future family cannot ship as a page that renders drafts or crashes on an
 * unknown slug.
 */
describe("dynamic routes", () => {
  it("finds the seven [slug] routes this phase builds", () => {
    expect(dynamic.map(rel).sort()).toEqual([
      "careers/open-positions/[slug]/page.tsx",
      "events/[slug]/page.tsx",
      "news/[slug]/page.tsx",
      "projects/[slug]/page.tsx",
      "resources/media/[slug]/page.tsx",
      "services/[slug]/page.tsx",
      "solutions/[slug]/page.tsx",
    ]);
  });

  for (const file of dynamic) {
    it(`${rel(file)} prerenders its slugs and answers 404 for others`, () => {
      const src = read(file);
      expect(src).toMatch(/export (async )?function generateStaticParams/);
      expect(src).toMatch(/loadOr404\(|notFound\(\)/);
    });
  }

  it("the database-backed routes read through loadOr404 so an unpublished slug is a 404", () => {
    for (const file of dynamic.filter((f) => !rel(f).startsWith("resources/media"))) {
      expect(read(file), rel(file)).toMatch(/loadOr404\(/);
    }
  });

  it("no route file sets dynamicParams = false", () => {
    /*
     * Review Focus #5 (Phase 7). generateStaticParams lists published slugs
     * only, so under dynamicParams = false a draft-only document -- the one an
     * editor most wants to preview -- could never be rendered, and a layout
     * revalidation leaves the route unrecoverable (NoFallbackError, see the
     * media page). The 404 for an unknown or unpublished slug is loadOr404's
     * job, not the router's. Every source file is scanned -- layouts and
     * route handlers carry segment config too -- with comments stripped so
     * prose about the setting does not trip it.
     */
    const sources = files(here).filter((f) => !/\.test\.tsx?$/.test(f));
    expect(sources.length).toBeGreaterThan(all.length);
    for (const file of sources) {
      expect(dynamicParamsFalse(read(file)), rel(file)).toBe(false);
    }
  });

  it("the dynamicParams check recognises every way of writing it", () => {
    for (const bad of [
      "export const dynamicParams = false;",
      "export let dynamicParams = false",
      "export var dynamicParams: boolean = false;",
      "export const dynamicParams = false as const;",
      "const dynamicParams = false;\nexport { dynamicParams };",
      "const off = false as const;\nexport { off as dynamicParams };",
      'export { dynamicParams } from "./config";',
    ]) {
      expect(dynamicParamsFalse(bad), bad).toBe(true);
    }
    for (const ok of [
      "/* rather than setting dynamicParams = false, which ... */",
      "// export const dynamicParams = false;",
      "export const dynamicParams = true;",
      "export const revalidate = 3600;",
    ]) {
      expect(dynamicParamsFalse(ok), ok).toBe(false);
    }
  });

  it("no page file exports anything Next does not allow from one", () => {
    const allowed = new Set([
      "default", "metadata", "generateMetadata", "generateStaticParams", "revalidate", "dynamicParams",
    ]);
    for (const file of all) {
      for (const m of read(file).matchAll(/^export\s+(?:default|const|async function|function)\s+(\w+)?/gm)) {
        const name = /^export\s+default/.test(m[0]) ? "default" : m[1];
        expect(allowed.has(name), `${rel(file)} exports ${name}`).toBe(true);
      }
    }
  });
});
