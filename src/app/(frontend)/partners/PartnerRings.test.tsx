import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PARTNERS } from "../../../../design-src/highland/content.mjs";
import { PartnerRings } from "./PartnerRings";

type P = Parameters<typeof PartnerRings>[0]["partners"][number];

const logo = (name: string) => ({ id: name, url: `/media/${name}.png`, approved: true });
const NAMES = (PARTNERS as { name: string }[]).map((p) => p.name);
// Every third brand carries approved artwork; the rest are name cards.
const real: P[] = NAMES.map((name, i) => ({ name, logo: i % 3 === 0 ? logo(name) : null }) as P);
const many = (n: number): P[] =>
  Array.from({ length: n }, (_, i) => ({ name: `Brand ${String.fromCharCode(65 + (i % 26))}${i}`, logo: null }) as P);

const html = (partners: P[]) => renderToStaticMarkup(<PartnerRings partners={partners} />);
const cards = (out: string) => out.match(/class="eg-ring-card[ "]/g) ?? [];
const text = (out: string) =>
  out
    .replace(/<[^>]+>/g, "\n")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

describe("PartnerRings", () => {
  it("draws one card per partner", () => {
    expect(NAMES).toHaveLength(32);
    expect(cards(html(real))).toHaveLength(32);
  });

  it("draws at most 48 cards", () => {
    expect(cards(html(many(60)))).toHaveLength(48);
  });

  // The spinning ring squares swing their corners past the diagram; without a
  // clip they add sideways scroll at viewports with no spare room.
  it("clips the turning rings at the diagram root", () => {
    const root = html(real).match(/<div[^>]*data-parity="partner-rings"[^>]*>/)?.[0] ?? "";
    expect(root).toMatch(/class="[^"]*(?<![\w-])overflow-clip(?![\w-])/);
  });

  it("renders nothing for no partners", () => {
    expect(html([])).toBe("");
  });

  // Review Focus #1: only approved artwork, and the name where there is none.
  it("shows an approved logo as an image named for the partner, and no name text", () => {
    const out = html([{ name: "Vertiv", logo: logo("vertiv") } as P, ...many(4)]);
    expect(out).toContain("/_next/image?url=%2Fmedia%2Fvertiv.png&amp;w=");
    expect(out).toContain('alt="Vertiv"');
    // Lazy, so a phone (diagram hidden) never fetches it and React adds no preload.
    expect(out).toContain('loading="lazy"');
    expect(out).not.toContain("preload");
    expect(text(out)).not.toContain("Vertiv");
  });

  it("shows the name, and no image, for a null, unapproved or url-less logo", () => {
    const cases: P[] = [
      { name: "Null Co", logo: null } as P,
      { name: "Withdrawn Co", logo: { id: 1, url: "/media/w.png", approved: false } } as never,
      { name: "Nourl Co", logo: { id: 2, approved: true } } as never,
    ];
    const out = html(cases);
    // The only image is the hub logo.
    expect(out.match(/<img[^>]*>/g)).toHaveLength(1);
    expect(out).not.toContain("/media/w.png");
    for (const c of cases) expect(text(out)).toContain(c.name);
  });

  it("hides the whole diagram from assistive technology and marks it for the parity check", () => {
    const out = html(real);
    expect(out).toMatch(/^<div[^>]*aria-hidden="true"/);
    expect(out).toMatch(/^<div[^>]*data-parity="partner-rings"/);
    // From lg only: below 1024px the diagram cannot hold 9px names.
    expect(out).toMatch(/^<div[^>]*class="[^"]*\bhidden\b[^"]*\blg:block\b/);
    expect(out).not.toMatch(/\bmd:block\b/);
  });

  // Review Focus #4: no ranking, no labels, no counts -- names and the hub only.
  it("contains no text but the partner names; the hub is the Edge logo image", () => {
    const words = text(html(real));
    const shown = real.filter((p) => !p.logo).map((p) => p.name);
    expect(words.sort()).toEqual([...shown].sort());
    expect(words).not.toContain("Edge");
    expect(words).not.toContain("Comm-Tech");
    expect(words.join(" ")).not.toMatch(/\d|brands/i);
    const alts = [...html(real).matchAll(/alt="([^"]*)"/g)].map((m) => m[1]);
    expect(alts.sort()).toEqual(
      [...real.filter((p) => p.logo).map((p) => p.name), "Edge Communication Technologies"].sort(),
    );
  });

  it("shows the Edge logo once, in the hub, inside the aria-hidden root", () => {
    const out = html(real);
    const hub = out.match(/<div class="eg-breathe[^>]*>(.*?)<\/div>/s)?.[1] ?? "";
    const imgs = hub.match(/<img[^>]*>/g) ?? [];
    expect(imgs).toHaveLength(1);
    expect(imgs[0]).toContain("edge-logo.png");
    expect(imgs[0]).toContain('alt="Edge Communication Technologies"');
    expect(out.match(/edge-logo\.png/g)?.length).toBeGreaterThanOrEqual(1);
    expect([...out.matchAll(/<img[^>]*edge-logo[^>]*>/g)]).toHaveLength(1);
    expect(out).toMatch(/^<div[^>]*aria-hidden="true"/);
    expect(cards(out)).toHaveLength(32);
  });

  it("is not interactive: no links and no labels", () => {
    const out = html(real);
    expect(out).not.toContain("href");
    expect(out).not.toContain("<label");
    expect(out).not.toContain("<a ");
  });

  it("places every card by left/top percentages inside the square", () => {
    for (const out of [html(real), html(many(5)), html(many(48))]) {
      const pos = [...out.matchAll(/class="eg-ring-card[^"]*" style="([^"]*)"/g)].map((m) => m[1]);
      expect(pos.length).toBeGreaterThan(0);
      for (const style of pos) {
        const left = Number(/left:([\d.]+)%/.exec(style)?.[1]);
        const top = Number(/top:([\d.]+)%/.exec(style)?.[1]);
        for (const v of [left, top]) {
          expect(v).toBeGreaterThanOrEqual(3);
          expect(v).toBeLessThanOrEqual(97);
        }
      }
    }
  });

  it("turns the three rings at distinct speeds, alternating direction", () => {
    const rings = [...html(real).matchAll(/class="eg-ring eg-ring-\d"[^>]*style="([^"]*)"/g)].map((m) => m[1]);
    expect(rings).toHaveLength(3);
    const spins = rings.map((s) => /--spin:(\d+)s/.exec(s)?.[1]);
    expect(spins).toEqual(["150", "210", "270"]);
    const dirs = rings.map((s) => /--dir:(\w+)/.exec(s)?.[1]);
    const counter = rings.map((s) => /--counter:(\w+)/.exec(s)?.[1]);
    expect(dirs).toEqual(["normal", "reverse", "normal"]);
    // Each card turns back by the same amount, so it stays upright.
    expect(counter).toEqual(["reverse", "normal", "reverse"]);
  });

  it("draws three dashed ring outlines at the ring radii", () => {
    const out = html(real);
    expect(out.match(/class="eg-ring-line[ "]/g)).toHaveLength(3);
    for (const d of ["44%", "66%", "86%"]) expect(out).toContain(`width:${d};height:${d}`);
  });
});
