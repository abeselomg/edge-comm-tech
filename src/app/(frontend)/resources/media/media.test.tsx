import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  isMediaKey,
  MEDIA_KEYS,
  MEDIA_SHAPES,
  MediaEmpty,
  PublishedNow,
  siblingSections,
} from "./media-parts";

const html = (el: React.ReactElement | null) => renderToStaticMarkup(<div>{el}</div>);

describe("the media sections", () => {
  it("are exactly documentaries, press releases and coverage", () => {
    expect([...MEDIA_KEYS].sort()).toEqual(["coverage", "documentaries", "press-releases"]);
    expect(Object.keys(MEDIA_SHAPES).sort()).toEqual([...MEDIA_KEYS].sort());
  });

  it("each carry a lead, an intro, an empty-state sentence, three expectations and an ask", () => {
    for (const key of MEDIA_KEYS) {
      const s = MEDIA_SHAPES[key];
      expect(s.lead, key).toBeTruthy();
      expect(s.intro, key).toBeTruthy();
      expect(s.empty, key).toMatch(/published yet|catalogued here yet/);
      expect(s.expect, key).toHaveLength(3);
      expect(s.ask, key).toBeTruthy();
    }
  });

  // `news` is a resource section but not a media page: /resources/media/news is a 404.
  it("recognise only their own keys", () => {
    expect(isMediaKey("coverage")).toBe(true);
    expect(isMediaKey("news")).toBe(false);
    expect(isMediaKey("downloads")).toBe(false);
    expect(isMediaKey("")).toBe(false);
  });
});

describe("the media route 404s anything else", () => {
  const src = readFileSync(new URL("./[slug]/page.tsx", import.meta.url), "utf8");
  it("prerenders the three keys and 404s any other through isMediaKey", () => {
    expect(src).toMatch(/export (async )?function generateStaticParams/);
    expect(src).toMatch(/if \(!isMediaKey\(slug\)\) notFound\(\)/);
  });

  /*
   * Found on the server: with dynamicParams = false, a layout revalidation (any
   * solution edit) purges the cached page and Next cannot regenerate it. The log
   * says NoFallbackError and the three media pages answer 404 until the next
   * deploy. The default (on-demand rendering of an unknown slug) is safe here
   * because the page itself 404s every key that is not a media key.
   */
  it("does not set dynamicParams = false", () => {
    expect(src).not.toMatch(/export const dynamicParams\s*=\s*false/);
  });
});

describe("siblingSections", () => {
  const sections = [
    { key: "news", title: "News", href: "/news", body: "" },
    { key: "documentaries", title: "Documentary Videos", href: "/resources/media/documentaries", body: "" },
    { key: "press-releases", title: "Press Releases", href: "/resources/media/press-releases", body: "" },
    { key: "coverage", title: "Media Coverage", href: "/resources/media/coverage", body: "" },
  ];
  it("returns the other two media sections, in the order the resource centre lists them", () => {
    expect(siblingSections(sections, "documentaries").map((s) => s.key)).toEqual(["press-releases", "coverage"]);
    expect(siblingSections(sections, "coverage").map((s) => s.key)).toEqual(["documentaries", "press-releases"]);
  });
  it("never includes a section that is not a media section", () => {
    expect(siblingSections(sections, "coverage").map((s) => s.key)).not.toContain("news");
  });
  it("tolerates a resource centre missing a section", () => {
    expect(siblingSections(sections.slice(1, 3), "documentaries").map((s) => s.key)).toEqual(["press-releases"]);
  });
});

describe("empty state and published-now", () => {
  it("states the section's empty sentence and routes the visitor onward", () => {
    const out = html(<MediaEmpty shape={MEDIA_SHAPES.documentaries} />);
    expect(out).toContain("No documentary videos are published yet.");
    expect(out).toContain('href="/subscribe"');
    expect(out).toContain('href="/news"');
  });

  it("shows up to two published news items so the page is not a dead end", () => {
    const item = (slug: string) => ({ _status: "published", slug, kind: "Insight", title: `T-${slug}`, standfirst: "S" });
    const out = html(<PublishedNow news={[item("a"), item("b"), item("c")] as never} />);
    expect(out).toContain("T-a");
    expect(out).toContain("T-b");
    expect(out).not.toContain("T-c");
    expect(out).toContain('href="/news/a"');
  });

  it("omits the block when there is no news", () => {
    expect(html(<PublishedNow news={[]} />)).not.toContain("Published now");
  });
});
