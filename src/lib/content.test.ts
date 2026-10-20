import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/*
 * Structural checks on the read layer, in the manner of seo.test.ts.
 *
 * Nothing here boots Payload: the readers are verified against the real
 * database by running them (see the Task 19 record in the ledger). What a test
 * can hold in place is the shape of the file, and two things about that shape
 * are load-bearing in a way nothing else catches.
 *
 * The first is the published filter. The Local API defaults to overrideAccess:
 * true, so the access rules in src/access do not apply to these reads at all,
 * and the explicit `_status` filter is the only thing keeping an editor's
 * unfinished draft off the public site. It lives in two helpers; a new reader
 * that calls payload.find directly would silently bypass it, and the symptom
 * would be a draft appearing on one page.
 *
 * The second is the collection names, which are plain strings. A typo reaches
 * production as a page that throws when someone opens it, and nothing before
 * that moment would complain -- not the compiler, since the helpers take a
 * string, and not the other tests.
 */

const source = readFileSync(new URL("./content.ts", import.meta.url), "utf8");

/** The slugs declared by the collections, as Payload knows them. */
const SLUGS = [
  "academyTracks",
  "clients",
  "downloads",
  "events",
  "jobs",
  "media",
  "news",
  "partnerCategories",
  "partners",
  "postCategories",
  "posts",
  "projects",
  "services",
  "solutions",
  "users",
  "forms",
];

describe("the read layer only reads published documents", () => {
  it("keeps every collection read inside the two filtered helpers", () => {
    /*
     * Three call sites, and no more: many(), one(), and the form builder's
     * document, which has no draft status to filter on. A fourth would be a
     * reader that had grown its own query, and the point of this file is that
     * there is one place the filter can be forgotten rather than twenty.
     */
    const callSites = source.match(/payload\.find\(/g) ?? [];
    expect(callSites).toHaveLength(3);
  });

  it("filters on _status in both helpers", () => {
    const many = source.slice(source.indexOf("async function many"), source.indexOf("async function one"));
    const one = source.slice(source.indexOf("async function one"), source.indexOf("/* ------"));
    expect(many, "many() must filter to published").toMatch(/where:\s*PUBLISHED/);
    expect(one, "one() must filter to published").toMatch(/where:\s*\{\s*\.\.\.PUBLISHED/);
    expect(source).toMatch(/PUBLISHED = \{ _status: \{ equals: "published" \} \}/);
  });

  it("reads globals through findGlobal, which has no draft status to filter", () => {
    // Five globals, all with versions.drafts false, so there is no _status to
    // filter and findGlobal is the whole read.
    const globals = source.match(/findGlobal\(\{ slug: "([a-z-]+)"/g) ?? [];
    expect(globals).toHaveLength(5);
  });
});

describe("the read layer names collections that exist", () => {
  it("passes only real slugs to the helpers", () => {
    const named = [...source.matchAll(/(?:many|one)<[A-Za-z]+>\(\s*"([A-Za-z]+)"/g)].map(
      (m) => m[1],
    );
    // Thirteen collections, each read as a list and most also one at a time.
    expect(named.length).toBeGreaterThan(15);
    for (const slug of named) {
      expect(SLUGS, `"${slug}" is not a collection slug`).toContain(slug);
    }
  });

  it("sorts every list read, so the approved order is not left to the database", () => {
    /*
     * Almost nothing here is alphabetical or chronological -- the three news
     * items carry the dates "2018", "Evergreen" and "Date to confirm". An
     * unsorted read returns rows in whatever order Postgres likes, which looks
     * correct on one page load and shuffles on the next, so every list read
     * passes byOrder.
     */
    const listReads = [...source.matchAll(/many<[A-Za-z]+>\("([A-Za-z]+)"([^)]*)\)/g)];
    expect(listReads.length).toBe(13);
    for (const [, slug, rest] of listReads) {
      expect(rest, `many("${slug}") is unsorted`).toContain("byOrder");
    }
    expect(source).toMatch(/const byOrder = \{ sort: "order" \}/);
  });
});
