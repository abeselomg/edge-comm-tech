import { describe, expect, it } from "vitest";

import { PREVIEW_TARGETS, previewUrl, safePreviewPath } from "./preview";
import { isKnownRoute, newsHref, solutionHref } from "./routes";

/*
 * The preview route turns a query parameter into a redirect, so the guard is
 * what stands between it and an open redirect. Everything here is refused
 * unless it is an internal path the route map could have produced.
 */

describe("safePreviewPath", () => {
  it.each([
    ["/solutions/cybersecurity"],
    ["/events"],
    ["/"],
    ["/about/executive-management"],
    ["/resources/media/press-kit"],
    ["/careers/open-positions/hr-manager#apply"],
    ["/blog#post-zero-trust"],
  ])("accepts %s", (path) => {
    expect(safePreviewPath(path)).toBe(path);
  });

  it.each([
    ["//evil.test"],
    ["///evil.test"],
    ["/\\evil"],
    ["\\\\evil.test"],
    ["https://evil.test"],
    ["http:/evil.test"],
    ["javascript:alert(1)"],
    ["evil.test"],
    ["solutions/cybersecurity"],
    ["/api/users"],
    ["/api"],
    ["/admin"],
    ["/admin/collections/users"],
    ["/preview"],
    ["/preview/exit"],
    ["/%2Fevil"],
    ["/%2fevil"],
    ["/solutions/%5C"],
    ["/solutions/%5c"],
    ["/solutions/%252Fevil"],
    ["/solutions/%2e%2e"],
    ["/solutions/.."],
    ["/solutions/."],
    ["/solutions/a@evil.test"],
    ["/solutions/a:b"],
    ["/solutions/a b"],
    ["/solutions/a\tb"],
    ["/solutions/a\nb"],
    ["/solutions/a\u0000b"],
    ["/solutions/a\u007fb"],
    ["/solutions/cybersecurity/"],
    ["/solutions//cybersecurity"],
    ["/unknown-page"],
    ["/solutions/a/b"],
    ["/events#"],
    ["/events#a#b"],
    ["/events#<script>"],
    ["/events#a/b"],
    [""],
    ["#apply"],
  ])("refuses %j", (path) => {
    expect(safePreviewPath(path)).toBeNull();
  });

  it.each([[undefined], [null], [42], [["/events"]], [{ path: "/events" }], [true]])(
    "refuses the non-string %j",
    (value) => {
      expect(safePreviewPath(value)).toBeNull();
    },
  );

  it("refuses an absurdly long path even when it is otherwise well-formed", () => {
    expect(safePreviewPath(`/solutions/${"a".repeat(2048)}`)).toBeNull();
    expect(safePreviewPath(`/solutions/${"a".repeat(301)}`)).toBeNull();
  });

  /*
   * The choice for a query string: drop it. Nothing on the public site reads a
   * query parameter, and carrying one through means validating a second
   * attacker-chosen string for no benefit. A fragment is kept, because job
   * and insight pages are reached by anchor.
   */
  it("strips a query string and keeps the fragment", () => {
    expect(safePreviewPath("/events?x=1")).toBe("/events");
    expect(safePreviewPath("/events?next=//evil.test")).toBe("/events");
    expect(safePreviewPath("/careers/open-positions/hr-manager?a=b#apply")).toBe(
      "/careers/open-positions/hr-manager#apply",
    );
  });

  it("checks the path, not the query, against the route map", () => {
    expect(safePreviewPath("/unknown?/events")).toBeNull();
    expect(safePreviewPath("/api?x=/events")).toBeNull();
  });
});

describe("previewUrl", () => {
  it("resolves a solution through the real href helper", () => {
    const url = previewUrl("solutions", { slug: "cybersecurity" });
    expect(url).toBe(`/preview?path=${encodeURIComponent(solutionHref("cybersecurity"))}`);
  });

  it("previews a news item at its /news page", () => {
    expect(previewUrl("news", { slug: "launch" })).toBe(
      `/preview?path=${encodeURIComponent(newsHref("launch"))}`,
    );
  });

  it.each([
    ["solutions", "/solutions/s"],
    ["services", "/services/s"],
    ["projects", "/projects/s"],
    ["news", "/news/s"],
    ["events", "/events/s"],
    ["jobs", "/careers/open-positions/s"],
  ])("gives %s its detail page", (collection, path) => {
    expect(previewUrl(collection, { slug: "s" })).toBe(`/preview?path=${encodeURIComponent(path)}`);
  });

  it.each([
    ["posts", "/blog#post-s"],
    ["postCategories", "/blog"],
    ["academyTracks", "/careers/e-academy#tracks"],
    ["downloads", "/downloads"],
    ["clients", "/clients"],
    ["partners", "/partners"],
    ["partnerCategories", "/partners"],
  ])("gives %s the listing page that shows it", (collection, path) => {
    expect(previewUrl(collection, { slug: "s" })).toBe(`/preview?path=${encodeURIComponent(path)}`);
  });

  it("gives an insight with no slug the insights page without an anchor", () => {
    expect(previewUrl("posts", {})).toBe(`/preview?path=${encodeURIComponent("/blog")}`);
    expect(previewUrl("posts", { slug: "bad slug" })).toBe(`/preview?path=${encodeURIComponent("/blog")}`);
  });

  it.each(["solutions", "services", "projects", "news", "events", "jobs"])(
    "is null for a %s document with no slug yet",
    (collection) => {
      expect(previewUrl(collection, {})).toBeNull();
      expect(previewUrl(collection, { slug: null })).toBeNull();
      expect(previewUrl(collection, { slug: "" })).toBeNull();
    },
  );

  it("is null for a slug the guard would refuse, so the admin never shows a link that 400s", () => {
    expect(previewUrl("solutions", { slug: "a/b" })).toBeNull();
    expect(previewUrl("solutions", { slug: "%2fevil" })).toBeNull();
    expect(previewUrl("solutions", { slug: ".." })).toBeNull();
  });

  it("is null for a collection with no public page", () => {
    expect(previewUrl("users", { slug: "x" })).toBeNull();
    expect(previewUrl("applications", { slug: "x" })).toBeNull();
    expect(previewUrl("toString", { slug: "x" })).toBeNull();
  });

  it("covers all thirteen content collections", () => {
    expect(Object.keys(PREVIEW_TARGETS).sort()).toEqual(
      [
        "academyTracks",
        "clients",
        "downloads",
        "events",
        "jobs",
        "news",
        "partnerCategories",
        "partners",
        "postCategories",
        "posts",
        "projects",
        "services",
        "solutions",
      ].sort(),
    );
  });

  it("only ever produces a path the preview route accepts and the route map knows", () => {
    for (const collection of Object.keys(PREVIEW_TARGETS)) {
      const url = previewUrl(collection, { slug: "sample" });
      expect(url, collection).not.toBeNull();
      const path = new URL(url!, "https://edge.test").searchParams.get("path")!;
      expect(safePreviewPath(path), collection).toBe(path);
      expect(isKnownRoute(path.split("#")[0]), collection).toBe(true);
      expect(url!.startsWith("/preview?path="), collection).toBe(true);
    }
  });
});
