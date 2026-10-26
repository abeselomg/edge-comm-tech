import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ACCENT } from "../../../design-src/highland/content.mjs";
import { SCENE_SLUGS } from "./solution-scenes";
import { SolutionVisual } from "./solution-visual";

const html = (el: React.ReactElement) => renderToStaticMarkup(el);
const SEVEN = [
  "software-ai-digital",
  "enterprise-network",
  "system-cloud",
  "datacenter-facility-it-infrastructure",
  "cybersecurity",
  "power-technology",
  "broadcast-satellite",
];
const accent = (s: string) => (ACCENT as Record<string, string>)[s];

describe("SolutionVisual", () => {
  it("draws the isometric fallback svg when the manifest has no entry", () => {
    const out = html(
      <SolutionVisual slug="cybersecurity" accent={accent("cybersecurity")} manifest={{}} />,
    );
    expect(out).toContain("<svg");
    expect(out).not.toContain("<img");
  });

  it("uses the image when the manifest lists one, with an empty alt", () => {
    const out = html(
      <SolutionVisual slug="cybersecurity" accent="#1c6ea4" manifest={{ cybersecurity: "webp" }} />,
    );
    expect(out).toContain("<img");
    expect(out).toContain('alt=""');
    expect(out).toContain("cybersecurity.webp");
    expect(out).not.toContain("<svg");
  });

  it("ships with no art listed, so every page shows the fallback today", () => {
    expect(html(<SolutionVisual slug="system-cloud" accent="#056a9a" />)).toContain("<svg");
  });

  it("is decorative: aria-hidden, no visible text, no title, aspect ratio reserved", () => {
    for (const manifest of [{}, { "system-cloud": "png" as const }]) {
      const out = html(
        <SolutionVisual slug="system-cloud" accent="#056a9a" manifest={manifest} />,
      ).replace(/^<link[^>]*>/, ""); // priority adds an image preload hint ahead of the panel
      expect(out).toMatch(/^<div[^>]*aria-hidden="true"/);
      expect(out.replace(/<[^>]*>/g, "").trim()).toBe("");
      expect(out).not.toMatch(/<title|<text/);
      expect(out).toContain("aspect-[6/5]");
    }
  });

  it("has a distinct fallback scene for each of the seven solutions", () => {
    expect([...SCENE_SLUGS].sort()).toEqual([...SEVEN].sort());
    const outs = SEVEN.map((s) =>
      html(<SolutionVisual slug={s} accent={accent(s)} manifest={{}} />),
    );
    expect(new Set(outs).size).toBe(7);
    // Distinct beyond colour: strip hex colours and the slug-keyed ids, compare again.
    const bare = outs.map((o) => o.replace(/#[0-9a-f]{6}/gi, "").replace(/eg-sv-[a-z-]+-(glow|blur|cyl\w*|body|screen)/g, ""));
    expect(new Set(bare).size).toBe(7);
  });

  it("falls back to a plain platform for an unknown slug", () => {
    expect(html(<SolutionVisual slug="a-future-family" accent="#0888c5" manifest={{}} />)).toContain(
      "<svg",
    );
  });
});
