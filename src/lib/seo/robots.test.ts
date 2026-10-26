import { describe, expect, it } from "vitest";
import { buildRobots } from "./robots";

describe("robots.txt", () => {
  it("disallows everything and offers no sitemap when the site is not indexable", () => {
    for (const env of [{}, { SITE_INDEXABLE: "false" }, { SITE_INDEXABLE: "TRUE" }, { SITE_URL: "https://x.example" }]) {
      const robots = buildRobots(env);
      expect(robots.rules).toEqual({ userAgent: "*", disallow: "/" });
      expect(robots.sitemap).toBeUndefined();
    }
  });

  describe("indexable", () => {
    const robots = buildRobots({ SITE_INDEXABLE: "true", SITE_URL: "https://www.example.com/" });
    const rules = robots.rules as { userAgent: string; allow: string[]; disallow: string[] };

    it("opens the public site", () => {
      expect(rules.userAgent).toBe("*");
      expect(rules.allow).toContain("/");
      expect(rules.disallow).not.toContain("/");
    });

    it("keeps the private surfaces out", () => {
      for (const path of ["/admin", "/api/", "/preview", "/forms"]) {
        expect(rules.disallow).toContain(path);
      }
    });

    it("blocks nothing under /_next, which Google needs to render pages", () => {
      expect(rules.disallow.some((p) => p.startsWith("/_next"))).toBe(false);
    });

    it("lets uploaded pictures back in beneath the /api/ block", () => {
      expect(rules.allow).toContain("/api/media/file/");
    });

    it("lists the absolute sitemap URL", () => {
      expect(robots.sitemap).toBe("https://www.example.com/sitemap.xml");
    });
  });
});
