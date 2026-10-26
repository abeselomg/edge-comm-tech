import { describe, expect, it } from "vitest";
import { RING_RADII, ringLayout } from "./rings";

type Item = { id: number; logo: boolean };
const make = (n: number): Item[] => Array.from({ length: n }, (_, i) => ({ id: i, logo: i % 3 === 0 }));
const byRing = <T>(cards: ReturnType<typeof ringLayout<T>>, ring: number) => cards.filter((c) => c.ring === ring);
const counts = (n: number) => [0, 1, 2].map((r) => byRing(ringLayout(make(n)), r).length);

// Smallest centre-to-centre distance (in % of the square) we accept on a ring.
// Ring chords at 32 items are about 19, so a card ~6% wide has a wide margin.
const MIN_CHORD = 18;

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

  it("mixes logo and name-only cards on every ring", () => {
    const cards = ringLayout(make(32));
    for (const r of [0, 1, 2]) {
      const kinds = new Set(byRing(cards, r).map((c) => c.item.logo));
      expect(kinds.size).toBe(2);
    }
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
