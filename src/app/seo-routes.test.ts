import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/*
 * The two route files and next.config.ts, run for real with the content readers
 * faked: the wiring is what these pin, since the logic has its own tests in
 * src/lib/seo.
 */
vi.mock("@/lib/content", () => {
  const published = (slug: string) => [{ slug, updatedAt: "2026-05-01T00:00:00.000Z", _status: "published" }];
  return {
    getSolutions: async () => published("cybersecurity"),
    getServices: async () => published("advisory"),
    getProjects: async () => published("bahir-dar"),
    getNews: async () => published("milestone"),
    getEvents: async () => published("webinar"),
    getJobs: async () => published("engineer"),
  };
});

const saved = { url: process.env.SITE_URL, idx: process.env.SITE_INDEXABLE };
beforeEach(() => {
  process.env.SITE_URL = "https://www.example.com";
});
afterEach(() => {
  for (const [key, value] of [["SITE_URL", saved.url], ["SITE_INDEXABLE", saved.idx]] as const) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

describe("/robots.txt route", () => {
  it("is dynamic, so SITE_INDEXABLE is read per request", async () => {
    const mod = await import("./robots");
    expect(mod.dynamic).toBe("force-dynamic");
  });

  it("disallows everything by default", async () => {
    delete process.env.SITE_INDEXABLE;
    const { default: robots } = await import("./robots");
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
    expect(robots().sitemap).toBeUndefined();
  });

  it("opens up and names the sitemap when indexable", async () => {
    process.env.SITE_INDEXABLE = "true";
    const { default: robots } = await import("./robots");
    expect(robots().sitemap).toBe("https://www.example.com/sitemap.xml");
  });
});

describe("/sitemap.xml route", () => {
  it("is empty by default", async () => {
    delete process.env.SITE_INDEXABLE;
    const { default: sitemap } = await import("./sitemap");
    expect(await sitemap()).toEqual([]);
  });

  it("lists static and published dynamic pages when indexable", async () => {
    process.env.SITE_INDEXABLE = "true";
    const { default: sitemap } = await import("./sitemap");
    const urls = (await sitemap()).map((e) => e.url);
    expect(urls).toContain("https://www.example.com/");
    expect(urls).toContain("https://www.example.com/solutions/cybersecurity");
    expect(urls).toContain("https://www.example.com/careers/open-positions/engineer");
  });
});

describe("next.config.ts X-Robots-Tag", () => {
  const headersFor = async () => {
    vi.resetModules();
    const { default: config } = await import("../../next.config");
    const resolved = typeof config === "function" ? await (config as never as (...a: unknown[]) => unknown)("phase-production-build", { defaultConfig: {} }) : config;
    const all = await (resolved as { headers: () => Promise<{ source: string; headers: { key: string; value: string }[] }[]> }).headers();
    // withPayload adds header rules of its own; only ours are under test.
    return all.filter((r) => r.headers.some((h) => h.key === "X-Robots-Tag"));
  };

  it("sends noindex on every path unless SITE_INDEXABLE is exactly 'true'", async () => {
    for (const value of [undefined, "", "TRUE", "1"]) {
      if (value === undefined) delete process.env.SITE_INDEXABLE;
      else process.env.SITE_INDEXABLE = value;
      const rules = await headersFor();
      expect(rules).toEqual([
        { source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      ]);
    }
  });

  it("keeps the admin, API, preview and forms noindex even when the site is indexable", async () => {
    process.env.SITE_INDEXABLE = "true";
    const rules = await headersFor();
    const sources = rules.map((r) => r.source);
    expect(sources).toEqual(
      expect.arrayContaining(["/admin/:path*", "/preview/:path*", "/forms/:path*"]),
    );
    expect(sources.some((s) => s.startsWith("/api/"))).toBe(true);
    expect(sources).not.toContain("/:path*");
    for (const r of rules) expect(r.headers).toEqual([{ key: "X-Robots-Tag", value: "noindex, nofollow" }]);
  });

  it("does not noindex the uploaded pictures when the site is indexable", async () => {
    process.env.SITE_INDEXABLE = "true";
    const api = (await headersFor()).find((r) => r.source.startsWith("/api/"))!;
    // path-to-regexp source: "/api/:path((?!media/file/).*)"
    const inner = api.source.slice(api.source.indexOf("((") + 1, -1);
    const re = new RegExp(`^${inner}$`);
    expect(re.test("media/file/photo.png")).toBe(false);
    expect(re.test("users/login")).toBe(true);
    expect(re.test("graphql")).toBe(true);
  });
});
