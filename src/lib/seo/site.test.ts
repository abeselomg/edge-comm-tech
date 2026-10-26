import { describe, expect, it } from "vitest";
import { absoluteUrl, FALLBACK_SITE_URL, siteIndexable, siteUrl } from "./site";

describe("siteIndexable", () => {
  it("is true only for the exact string 'true'", () => {
    expect(siteIndexable({ SITE_INDEXABLE: "true" })).toBe(true);
  });

  it.each([undefined, "", "TRUE", "True", "1", "yes", " true", "true ", "false", "on"])(
    "is false for %j, so the review server is safe by default",
    (value) => {
      expect(siteIndexable({ SITE_INDEXABLE: value })).toBe(false);
    },
  );

  it("is false when the variable is absent altogether", () => {
    expect(siteIndexable({})).toBe(false);
  });
});

describe("siteUrl", () => {
  it("falls back for dev and test when unset or empty", () => {
    expect(siteUrl({})).toBe(FALLBACK_SITE_URL);
    expect(siteUrl({ SITE_URL: "  " })).toBe(FALLBACK_SITE_URL);
  });

  it("drops a trailing slash and any path, query or fragment", () => {
    expect(siteUrl({ SITE_URL: "https://www.example.com/" })).toBe("https://www.example.com");
    expect(siteUrl({ SITE_URL: "https://www.example.com/en/?a=1#x" })).toBe("https://www.example.com");
  });

  it("falls back on a value that is not an http(s) URL", () => {
    expect(siteUrl({ SITE_URL: "not a url" })).toBe(FALLBACK_SITE_URL);
    expect(siteUrl({ SITE_URL: "ftp://example.com" })).toBe(FALLBACK_SITE_URL);
  });
});

describe("absoluteUrl", () => {
  const env = { SITE_URL: "https://www.example.com" };

  it("joins the origin and the route", () => {
    expect(absoluteUrl("/solutions/cybersecurity", env)).toBe(
      "https://www.example.com/solutions/cybersecurity",
    );
    expect(absoluteUrl("/", env)).toBe("https://www.example.com/");
  });

  it("drops the query string, the fragment and a trailing slash", () => {
    expect(absoluteUrl("/events/x/?utm=1#top", env)).toBe("https://www.example.com/events/x");
  });

  it("roots a path given without a leading slash", () => {
    expect(absoluteUrl("about", env)).toBe("https://www.example.com/about");
  });
});
