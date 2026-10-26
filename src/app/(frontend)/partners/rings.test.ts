import { describe, expect, it } from "vitest";
import { CARD, RING_RADII, ringLayout } from "./rings";

type Item = { id: number; logo: boolean };
const make = (n: number): Item[] => Array.from({ length: n }, (_, i) => ({ id: i, logo: i % 3 === 0 }));
const byRing = <T>(cards: ReturnType<typeof ringLayout<T>>, ring: number) => cards.filter((c) => c.ring === ring);
const counts = (n: number) => [0, 1, 2].map((r) => byRing(ringLayout(make(n)), r).length);

// Smallest centre-to-centre distance (in % of the square) we accept on a ring
// at 32 items, where the chords are about 19 (18.8-19.1). The bound is for
// n = 32 only: at 48 items the inner ring's chord falls to about 12.4.
const MIN_CHORD = 18;

/*
 * Two non-periodic logo patterns, roughly 40% logos like the real list (13 of
 * 32). A pattern of "every third item" lines up with a three-ring dealing and
 * hides exactly the failure this test exists to catch.
 */
const hashed = (i: number) => (Math.imul(i + 1, 2654435761) >>> 0) % 100 < 40;
const FIXED = "1001100010110000101001100100011100010001011000101".split("").map((c) => c === "1");
const PATTERNS: [string, (i: number) => boolean][] = [
  ["hashed", hashed],
  ["fixed", (i) => FIXED[i]],
];

describe("ringLayout", () => {
  it("returns nothing for no items", () => {
    expect(ringLayout([])).toEqual([]);
  });

  it("splits 32 items 7 / 11 / 14 over the rings", () => {
    expect(counts(32)).toEqual([7, 11, 14]);
  });

  it("uses only the first ring for fewer than 3 items", () => {
    expect(counts(1)).toEqual([1, 0, 0]);
    expect(counts(2)).toEqual([2, 0, 0]);
  });

  it("gives 3 to 5 items sensible counts and never leaves a ring empty", () => {
    expect(counts(3)).toEqual([1, 1, 1]);
    expect(counts(4)).toEqual([1, 1, 2]);
    expect(counts(5)).toEqual([1, 2, 2]);
    for (let n = 3; n <= 48; n++) {
      const c = counts(n);
      expect(c.reduce((a, b) => a + b, 0)).toBe(n);
      expect(Math.min(...c)).toBeGreaterThan(0);
    }
  });

  it("caps at 48 items by default and drops the rest", () => {
    const cards = ringLayout(make(100));
    expect(cards).toHaveLength(48);
    expect(cards.map((c) => c.item.id).sort((a, b) => a - b)).toEqual(make(48).map((i) => i.id));
    expect(ringLayout(make(10), { maxItems: 4 })).toHaveLength(4);
  });

  it("places every item exactly once", () => {
    const cards = ringLayout(make(32));
    expect(cards.map((c) => c.item.id).sort((a, b) => a - b)).toEqual(make(32).map((i) => i.id));
  });

  it("is deterministic", () => {
    expect(ringLayout(make(32))).toEqual(ringLayout(make(32)));
  });

  it("numbers cards 0..k-1 within each ring", () => {
    const cards = ringLayout(make(32));
    for (const r of [0, 1, 2]) {
      expect(byRing(cards, r).map((c) => c.index)).toEqual(byRing(cards, r).map((_, i) => i));
    }
  });

  it("keeps neighbours in the list off the same ring side by side", () => {
    const cards = ringLayout(make(32));
    for (const r of [0, 1, 2]) {
      const ids = byRing(cards, r).map((c) => c.item.id);
      expect(ids).toEqual([...ids].sort((a, b) => a - b)); // dealt order kept
      for (let i = 1; i < ids.length; i++) expect(ids[i] - ids[i - 1]).toBeGreaterThan(1);
    }
  });

  it("mixes logo and name-only cards on every ring of four or more, for 20..48 items", () => {
    for (const [label, logo] of PATTERNS) {
      for (let n = 20; n <= 48; n++) {
        const items = Array.from({ length: n }, (_, i) => ({ id: i, logo: logo(i) }));
        const cards = ringLayout(items, { kind: (i) => i.logo });
        expect(cards).toHaveLength(n);
        for (const r of [0, 1, 2]) {
          const ring = byRing(cards, r);
          if (ring.length < 4) continue;
          const kinds = new Set(ring.map((c) => c.item.logo));
          expect(kinds.size, `${label} n=${n} ring ${r}`).toBe(2);
        }
      }
    }
  });

  it("keeps ring counts, dealt order and each item once when dealing by kind", () => {
    for (let n = 1; n <= 48; n++) {
      const items = Array.from({ length: n }, (_, i) => ({ id: i, logo: hashed(i) }));
      const cards = ringLayout(items, { kind: (i) => i.logo });
      expect([0, 1, 2].map((r) => byRing(cards, r).length)).toEqual(counts(n));
      expect(cards.map((c) => c.item.id).sort((a, b) => a - b)).toEqual(items.map((i) => i.id));
      for (const r of [0, 1, 2]) {
        // Dealt order is kept within each kind; the kinds are interleaved.
        for (const k of [false, true]) {
          const ids = byRing(cards, r).filter((c) => c.item.logo === k).map((c) => c.item.id);
          expect(ids).toEqual([...ids].sort((a, b) => a - b));
        }
      }
    }
  });

  /*
   * Chrome showed the real 32 with three logos in a row on the outer ring:
   * the first six partners in the list all have artwork, so dealt order
   * clustered them. The fewer kind on a ring is now spread evenly round it.
   */
  it("spreads the fewer kind round each ring, never two side by side", () => {
    const REAL = [0, 1, 2, 3, 4, 5, 9, 12, 13, 18, 19, 21, 26]; // logos among the real 32
    const patterns: [string, (i: number) => boolean][] = [...PATTERNS, ["real", (i) => REAL.includes(i)]];
    for (const [label, logo] of patterns) {
      for (let n = 20; n <= 48; n++) {
        const items = Array.from({ length: n }, (_, i) => ({ id: i, logo: logo(i) }));
        for (const r of [0, 1, 2]) {
          const ring = byRing(ringLayout(items, { kind: (i) => i.logo }), r).map((c) => c.item.logo);
          const fewer = ring.filter(Boolean).length * 2 <= ring.length;
          const minority = ring.map((l) => l === fewer);
          if (minority.filter(Boolean).length * 2 > ring.length) continue;
          for (let i = 0; i < ring.length; i++) {
            const pair = minority[i] && minority[(i + 1) % ring.length];
            expect(pair, `${label} n=${n} ring ${r}: ${ring.map((l) => (l ? "L" : "N")).join("")}`).toBe(false);
          }
        }
      }
    }
  });

  it("deals one kind only when every item is that kind", () => {
    const cards = ringLayout(make(32).map((i) => ({ ...i, logo: false })), { kind: (i) => i.logo });
    expect([0, 1, 2].map((r) => byRing(cards, r).length)).toEqual([7, 11, 14]);
  });

  /*
   * Cards stay upright while the rings turn at different speeds, so any two
   * cards -- same ring or neighbouring rings -- eventually meet at every
   * relative bearing. Two upright boxes never overlap at centre distance d in
   * any direction only if the box's diagonal is at most d.
   */
  it("sizes a card so its diagonal fits the closest ring gap and the closest chord", () => {
    const diagonal = Math.hypot(CARD.w, CARD.h);
    const gaps = RING_RADII.slice(1).map((r, i) => r - RING_RADII[i]);
    expect(diagonal).toBeLessThanOrEqual(Math.min(...gaps));
    for (let n = 3; n <= 48; n++) {
      const cards = ringLayout(make(n));
      for (const r of [0, 1, 2]) {
        const k = byRing(cards, r).length;
        if (k >= 2) expect(diagonal).toBeLessThanOrEqual(2 * RING_RADII[r] * Math.sin(Math.PI / k));
      }
    }
    // With a margin: Chrome measured cross-ring gaps of 1-2 px at 8.6 x 5.
    expect(Math.min(...gaps) - diagonal).toBeGreaterThanOrEqual(0.3);
    // And the outer ring's cards stay inside the square.
    expect(RING_RADII[2] + diagonal / 2).toBeLessThan(50);
  });

  it("spaces cards evenly: chord is 2·r·sin(π/k) within 1% and at least the minimum", () => {
    for (const n of [5, 32, 48]) {
      const cards = ringLayout(make(n));
      for (const r of [0, 1, 2]) {
        const ring = byRing(cards, r);
        const k = ring.length;
        if (k < 2) continue;
        const expected = 2 * RING_RADII[r] * Math.sin(Math.PI / k);
        for (let i = 0; i < k; i++) {
          const a = ring[i];
          const b = ring[(i + 1) % k];
          const chord = Math.hypot(a.x - b.x, a.y - b.y);
          expect(Math.abs(chord - expected) / expected).toBeLessThan(0.01);
          if (n === 32) expect(chord).toBeGreaterThanOrEqual(MIN_CHORD);
        }
      }
    }
  });

  it("gives each ring a different start offset", () => {
    const cards = ringLayout(make(32));
    const starts = [0, 1, 2].map((r) => byRing(cards, r)[0].angle);
    expect(new Set(starts).size).toBe(3);
    expect(starts[0]).toBe(0);
  });

  it("puts cards at x = 50 + r·sin(a), y = 50 − r·cos(a), rounded to 2 decimals", () => {
    for (const c of ringLayout(make(32))) {
      const rad = (c.angle * Math.PI) / 180;
      const r = RING_RADII[c.ring];
      expect(Math.abs(c.x - (50 + r * Math.sin(rad)))).toBeLessThan(0.011); // angle is itself rounded
      expect(Math.abs(c.y - (50 - r * Math.cos(rad)))).toBeLessThan(0.011);
      expect(Math.round(c.x * 100) / 100).toBe(c.x);
      expect(Math.round(c.y * 100) / 100).toBe(c.y);
    }
  });

  it("keeps every centre inside [3, 97] for 1, 2, 3, 5, 32, 48 and 100 items", () => {
    for (const n of [1, 2, 3, 5, 32, 48, 100]) {
      for (const c of ringLayout(make(n))) {
        expect(c.x).toBeGreaterThanOrEqual(3);
        expect(c.x).toBeLessThanOrEqual(97);
        expect(c.y).toBeGreaterThanOrEqual(3);
        expect(c.y).toBeLessThanOrEqual(97);
      }
    }
  });
});
