import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { fullTitle } from "@/lib/seo/metadata";

/*
 * A page without SEO metadata is a page that goes live with the site name as its
 * title and nothing to say in a search result. This walks the routes on disk, so
 * a page added later fails here until it has metadata of its own, built through
 * buildMetadata so it also gets the canonical link, share tags and noindex
 * switch.
 */
const root = path.dirname(fileURLToPath(import.meta.url));

function pagesUnder(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) out.push(...pagesUnder(full));
    else if (name === "page.tsx") out.push(full);
  }
  return out;
}

const pages = pagesUnder(root);
const rel = (f: string) => path.relative(root, f).replaceAll("\\", "/");
const read = (f: string) => readFileSync(f, "utf8");

describe("every public page has SEO metadata", () => {
  it("finds the pages", () => {
    // 1 home + 17 static + 7 dynamic detail pages. A walk that finds none would
    // make every other test in this file pass for nothing.
    expect(pages.length).toBeGreaterThanOrEqual(25);
  });

  it.each(pages.map((f) => [rel(f), f]))("%s exports metadata or generateMetadata", (_name, file) => {
    const source = read(file);
    expect(source).toMatch(/export (const metadata\b|async function generateMetadata\b|const generateMetadata\b)/);
  });

  it.each(pages.map((f) => [rel(f), f]))("%s builds it through buildMetadata", (_name, file) => {
    expect(read(file)).toContain("buildMetadata(");
  });

  it.each(pages.map((f) => [rel(f), f]))("%s sets its own canonical path", (_name, file) => {
    const source = read(file);
    // A static page spells the path; a detail page builds it with a route helper.
    expect(source).toMatch(/path: ("\/[^"]*"|\w+Href\(slug\))/);
  });
});

describe("the title text in every static page", () => {
  const withTitle = pages
    .map((f) => ({ file: f, m: /export const metadata = buildMetadata\(\{\s*title: ([^\n]*)/.exec(read(f)) }))
    .filter((x) => x.m);

  it("finds them", () => {
    expect(withTitle.length).toBeGreaterThanOrEqual(18);
  });

  it.each(withTitle.map((x) => [rel(x.file), x.m![1]!]))("%s names the site once at most", (_n, literal) => {
    const title = /^"(.*)",$/.exec(literal) ? /^"(.*)",$/.exec(literal)![1]! : null;
    if (title === null) return; // a constant such as HOME_TITLE; covered in metadata.test.ts
    const rendered = fullTitle(title);
    expect((rendered.match(/Edge Comm-Tech/gi) ?? []).length).toBe(1);
  });
});
