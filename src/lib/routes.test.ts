import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { isKnownRoute, publishedOnly, routeFor, STATIC_ROUTES } from "./routes";

describe("routeFor translates Highland's filenames", () => {
  it("maps the slug-less pages", () => {
    expect(routeFor("index.html")).toBe("/");
    expect(routeFor("about.html")).toBe("/about");
    expect(routeFor("blog.html")).toBe("/blog");
    expect(routeFor("clients.html")).toBe("/clients");
    expect(routeFor("contact.html")).toBe("/contact");
    expect(routeFor("downloads.html")).toBe("/downloads");
    expect(routeFor("partners.html")).toBe("/partners");
    expect(routeFor("resources.html")).toBe("/resources");
    expect(routeFor("subscribe.html")).toBe("/subscribe");
  });

  it("nests the page nothing links to under about", () => {
    // executive-management.html is a generated orphan in Highland: no page
    // links to it. It belongs under /about, where a reader would look.
    expect(routeFor("executive-management.html")).toBe("/about/executive-management");
  });

  it("nests the four careers pages", () => {
    expect(routeFor("careers.html")).toBe("/careers");
    expect(routeFor("careers-open-positions.html")).toBe("/careers/open-positions");
    expect(routeFor("careers-e-academy.html")).toBe("/careers/e-academy");
    expect(routeFor("careers-internships.html")).toBe("/careers/internships");
  });

  it("maps the index pages of the dynamic families", () => {
    expect(routeFor("solutions.html")).toBe("/solutions");
    expect(routeFor("services.html")).toBe("/services");
    expect(routeFor("projects.html")).toBe("/projects");
    expect(routeFor("news.html")).toBe("/news");
    expect(routeFor("events.html")).toBe("/events");
  });

  it("nests each per-slug family under its index", () => {
    expect(routeFor("solution-cybersecurity.html")).toBe("/solutions/cybersecurity");
    expect(routeFor("service-procurement-supply.html")).toBe("/services/procurement-supply");
    expect(routeFor("project-siinqee-bank-datacenter-power.html")).toBe(
      "/projects/siinqee-bank-datacenter-power",
    );
    expect(routeFor("news-digital-transformation-meeting.html")).toBe(
      "/news/digital-transformation-meeting",
    );
    expect(routeFor("event-gitex-global-2026.html")).toBe("/events/gitex-global-2026");
  });

  it("puts a job under the positions page and media under resources", () => {
    // A job is read from the open-positions list, and a media section from the
    // resource centre; the seed already wrote resourceSections hrefs that way.
    expect(routeFor("job-hr-manager.html")).toBe("/careers/open-positions/hr-manager");
    expect(routeFor("media-documentaries.html")).toBe("/resources/media/documentaries");
  });

  it("keeps a slug containing a family's own name intact", () => {
    // "news-" is stripped once, as a prefix, not wherever it appears.
    expect(routeFor("project-news-room-build.html")).toBe("/projects/news-room-build");
  });

  it("refuses an unrecognised file instead of guessing a route", () => {
    expect(() => routeFor("nonsense.html")).toThrow(/nonsense\.html/);
    expect(() => routeFor("nonsense.html")).toThrow(/routes\.ts/);
    expect(() => routeFor("")).toThrow();
  });

  it("agrees with STATIC_ROUTES on the fourteen slug-less pages", () => {
    expect(Object.keys(STATIC_ROUTES)).toHaveLength(14);
    for (const [file, path] of Object.entries(STATIC_ROUTES)) {
      expect(routeFor(file), file).toBe(path);
    }
  });

  /*
   * Every link Highland actually emits, read off the generated build rather
   * than listed here. A pattern nobody anticipated fails in this test instead
   * of reaching a page as a dead link.
   */
  it("handles every .html link in the generated build", () => {
    const dir = new URL("../../design-files/highland/", import.meta.url);
    const files = readdirSync(dir).filter((f) => f.endsWith(".html"));
    expect(files.length, "the Highland build should be present").toBeGreaterThan(40);

    const targets = new Set<string>();
    for (const f of files) {
      const html = readFileSync(new URL(f, dir), "utf8");
      for (const m of html.matchAll(/href="([a-z0-9][^"#?]*\.html)/g)) targets.add(m[1]);
    }
    expect(targets.size, "distinct link targets").toBeGreaterThanOrEqual(24);

    const unmapped: string[] = [];
    for (const t of targets) {
      try {
        routeFor(t);
      } catch {
        unmapped.push(t);
      }
    }
    expect(unmapped, `${unmapped.length} link target(s) have no route`).toEqual([]);
  });

  it("never returns a path that still looks like a file", () => {
    for (const t of Object.keys(STATIC_ROUTES)) {
      expect(routeFor(t)).not.toMatch(/\.html$/);
      expect(routeFor(t).startsWith("/"), t).toBe(true);
    }
  });
});

describe("publishedOnly drops what must not be rendered", () => {
  /*
   * Review Focus #2. Payload's depth:2 populate does NOT re-apply the
   * published filter to a related document: measured on this branch,
   * unpublishing a solution leaves a post's `target` populating with
   * _status "draft". A page that links it produces a 404.
   */
  it("keeps a published document", () => {
    const doc = { slug: "a", _status: "published" };
    expect(publishedOnly([doc])).toEqual([doc]);
  });

  it("drops a draft", () => {
    expect(publishedOnly([{ slug: "a", _status: "draft" }])).toEqual([]);
  });

  it("drops an unpopulated relationship, which carries no status to trust", () => {
    expect(publishedOnly([7])).toEqual([]);
    expect(publishedOnly(["7"])).toEqual([]);
  });

  it("drops null and undefined", () => {
    expect(publishedOnly([null, undefined])).toEqual([]);
  });

  it("drops a document with no status at all, failing closed", () => {
    /*
     * The same rule approvedLogo follows: absent is not permission. The type
     * argument is explicit because a literal with no `_status` cannot infer T,
     * and this is a real runtime shape -- a collection without drafts, or a
     * read at a depth that did not populate the field.
     */
    type Undrafted = { slug: string; _status?: string | null };
    expect(publishedOnly<Undrafted>([{ slug: "a" }])).toEqual([]);
  });

  it("keeps order and drops only what fails", () => {
    const a = { slug: "a", _status: "published" };
    const c = { slug: "c", _status: "published" };
    expect(publishedOnly([a, { slug: "b", _status: "draft" }, c, 9, null])).toEqual([a, c]);
  });
});

describe("isKnownRoute", () => {
  it("accepts every route routeFor can produce", () => {
    for (const r of ["/", "/about", "/about/executive-management", "/solutions", "/events"]) {
      expect(isKnownRoute(r), r).toBe(true);
    }
    for (const r of [
      "/solutions/cybersecurity",
      "/careers/open-positions/hr-manager",
      "/resources/media/documentaries",
      "/news/some-item",
    ]) {
      expect(isKnownRoute(r), r).toBe(true);
    }
  });

  it("rejects a Highland filename, which is the leak this guards against", () => {
    expect(isKnownRoute("/about.html")).toBe(false);
    expect(isKnownRoute("about.html")).toBe(false);
  });

  it("rejects paths no one declared, and over-deep slugs", () => {
    expect(isKnownRoute("/nope")).toBe(false);
    expect(isKnownRoute("/solutions/a/b")).toBe(false);
    expect(isKnownRoute("/solutions/")).toBe(false);
  });
});
