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
