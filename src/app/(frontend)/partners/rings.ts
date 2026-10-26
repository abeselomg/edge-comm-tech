// Pure layout for the partners diagram: items are dealt over concentric rings.
// The diagram is a square; every coordinate is a percentage of its width, and
// a card's x/y is its CENTRE. Angles are degrees, 0 = top, clockwise.

/** Ring radii, percent of the square's width (inner, middle, outer). */
export const RING_RADII = [22, 33, 43];

/**
 * Start offset of each ring, as a fraction of that ring's own slot (360 / count).
 * 0, 1/3 and 2/3 of a slot differ in absolute degrees on every ring, so cards
 * on neighbouring rings do not line up along a radius.
 */
const OFFSET_FRACTIONS = [0, 1 / 3, 2 / 3];

const DEFAULT_MAX_ITEMS = 48;

export type RingCard<T> = {
  item: T;
  ring: 0 | 1 | 2;
  /** Position of the card within its ring, in dealt order. */
  index: number;
  angle: number;
  x: number;
  y: number;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * How many items each ring gets: proportional to radius, summing exactly to n
 * (largest-remainder rounding). Under 3 items only the first ring is used.
 * For 3..5 items the same rule gives 1/1/1, 1/1/2 and 1/2/2 — no ring is left empty.
 */
function ringCounts(n: number, radii: number[]): number[] {
  if (n < 3) return radii.map((_, i) => (i === 0 ? n : 0));
  const total = radii.reduce((a, b) => a + b, 0);
  const exact = radii.map((r) => (n * r) / total);
  const counts = exact.map(Math.floor);
  let left = n - counts.reduce((a, b) => a + b, 0);
  const order = exact
    .map((e, i) => ({ i, rem: e - Math.floor(e) }))
    .sort((a, b) => b.rem - a.rem || a.i - b.i);
  for (const { i } of order) {
    if (left <= 0) break;
    counts[i]++;
    left--;
  }
  return counts;
}

export function ringLayout<T>(
  items: T[],
  opts: { rings?: number[]; maxItems?: number } = {},
): RingCard<T>[] {
  const radii = opts.rings ?? RING_RADII;
  const list = items.slice(0, opts.maxItems ?? DEFAULT_MAX_ITEMS);
  const n = list.length;
  if (n === 0) return [];

  const targets = ringCounts(n, radii);
  const dealt: T[][] = radii.map(() => []);

  // Weighted round-robin: each step goes to the ring furthest behind its ideal
  // share, so consecutive list entries land on different rings.
  list.forEach((item, t) => {
    let best = -1;
    let bestDeficit = -Infinity;
    for (let r = 0; r < radii.length; r++) {
      if (dealt[r].length >= targets[r]) continue;
      const deficit = (targets[r] * (t + 1)) / n - dealt[r].length;
      if (deficit > bestDeficit) {
        bestDeficit = deficit;
        best = r;
      }
    }
    dealt[best].push(item);
  });

  const cards: RingCard<T>[] = [];
  dealt.forEach((ringItems, r) => {
    const k = ringItems.length;
    const slot = 360 / k;
    const offset = slot * (OFFSET_FRACTIONS[r] ?? 0);
    ringItems.forEach((item, index) => {
      const angle = offset + index * slot;
      const rad = (angle * Math.PI) / 180;
      cards.push({
        item,
        ring: r as 0 | 1 | 2,
        index,
        angle: round2(angle),
        x: round2(50 + radii[r] * Math.sin(rad)),
        y: round2(50 - radii[r] * Math.cos(rad)),
      });
    });
  });
  return cards;
}
