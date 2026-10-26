import { describe, expect, it, vi } from "vitest";
import { buildSitemap, type SitemapSources } from "./sitemap";

const ON = { SITE_INDEXABLE: "true", SITE_URL: "https://www.example.com" };
const NOW = new Date("2026-06-15T00:00:00Z");

const doc = (slug: string, updatedAt = "2026-05-01T10:00:00.000Z") => ({ slug, updatedAt });

const sources = (over: Partial<SitemapSources> = {}): SitemapSources => ({
  solutions: async () => [doc("cybersecurity")],
  services: async () => [doc("advisory")],
  projects: async () => [doc("bahir-dar")],
  news: async () => [doc("milestone"), { ...doc("held-item"), heldForPublication: true }],
  events: async () => [{ ...doc("webinar"), status: "upcoming" }, { ...doc("old-session"), status: "past" }],
  jobs: async () => [
    { ...doc("open-role"), deadline: { status: "confirmed", value: "2026-12-31" } },
    { ...doc("closed-role"), deadline: { status: "confirmed", value: "2026-01-31" } },
    { ...doc("no-deadline"), deadline: { status: "pending", value: null } },
  ],
  ...over,
});

const urls = (list: { url: string }[]) => list.map((e) => e.url);

describe("sitemap", () => {
  it("is empty when the site is not indexable", async () => {
    expect(await buildSitemap(sources(), {}, NOW)).toEqual([]);
    expect(await buildSitemap(sources(), { SITE_INDEXABLE: "1", SITE_URL: "https://x.example" }, NOW)).toEqual([]);
  });

  it("does not even read the database when it is not indexable", async () => {
    const read = vi.fn(async () => []);
    await buildSitemap(sources({ solutions: read }), {}, NOW);
    expect(read).not.toHaveBeenCalled();
  });

  it("lists the static routes as absolute URLs", async () => {
    const list = urls(await buildSitemap(sources(), ON, NOW));
    for (const path of ["/", "/about", "/solutions", "/services", "/projects", "/contact", "/careers/open-positions", "/resources"]) {
      expect(list).toContain(`https://www.example.com${path === "/" ? "/" : path}`);
    }
    expect(list.every((u) => u.startsWith("https://www.example.com/"))).toBe(true);
  });

  it("lists every published dynamic document", async () => {
    const list = urls(await buildSitemap(sources(), ON, NOW));
    for (const path of [
      "/solutions/cybersecurity",
      "/services/advisory",
      "/projects/bahir-dar",
      "/news/milestone",
      "/events/webinar",
      "/events/old-session",
      "/careers/open-positions/open-role",
    ]) {
      expect(list).toContain(`https://www.example.com${path}`);
    }
  });

  it("leaves out a held news item and a closed vacancy, keeps an open-ended one", async () => {
    const list = urls(await buildSitemap(sources(), ON, NOW));
    expect(list).not.toContain("https://www.example.com/news/held-item");
    expect(list).not.toContain("https://www.example.com/careers/open-positions/closed-role");
    expect(list).toContain("https://www.example.com/careers/open-positions/no-deadline");
  });

  it("never lists the private routes", async () => {
    const list = urls(await buildSitemap(sources(), ON, NOW));
    expect(list.filter((u) => /\/(admin|api|preview|forms)(\/|$)/.test(u))).toEqual([]);
  });

  it("only knows what the published-only readers give it: a draft they omit cannot appear", async () => {
    const list = urls(await buildSitemap(sources({ solutions: async () => [] }), ON, NOW));
    expect(list).not.toContain("https://www.example.com/solutions/cybersecurity");
  });

  it("takes lastModified from updatedAt, and leaves it off static routes", async () => {
    const list = await buildSitemap(sources(), ON, NOW);
    const sol = list.find((e) => e.url.endsWith("/solutions/cybersecurity"))!;
    expect(sol.lastModified).toEqual(new Date("2026-05-01T10:00:00.000Z"));
    expect(sol.changeFrequency).toBeTruthy();
    expect(sol.priority).toBeGreaterThan(0);
    expect(list.find((e) => e.url === "https://www.example.com/about")!.lastModified).toBeUndefined();
  });

  it("gives the home page the top priority", async () => {
    const list = await buildSitemap(sources(), ON, NOW);
    const priorities = list.map((e) => e.priority ?? 0);
    expect(list.find((e) => e.url === "https://www.example.com/")!.priority).toBe(Math.max(...priorities));
  });

  it("has no duplicate URLs", async () => {
    const list = urls(await buildSitemap(sources(), ON, NOW));
    expect(new Set(list).size).toBe(list.length);
  });

  it("fails soft: a source that throws is left out and the rest still ships", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const list = urls(
      await buildSitemap(sources({ projects: async () => { throw new Error("db down"); } }), ON, NOW),
    );
    warn.mockRestore();
    expect(list).toContain("https://www.example.com/");
    expect(list).toContain("https://www.example.com/solutions/cybersecurity");
    expect(list.some((u) => u.includes("/projects/"))).toBe(false);
  });
});
