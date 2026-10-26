// Pure layout for the partners diagram: items are dealt over concentric rings.
// The diagram is a square; every coordinate is a percentage of its width, and
// a card's x/y is its CENTRE. Angles are degrees, 0 = top, clockwise.

type Radii = readonly [number, number, number];
const RINGS = [0, 1, 2] as const;
type Ring = (typeof RINGS)[number];

/** Ring radii, percent of the square's width (inner, middle, outer). */
export const RING_RADII: Radii = [22, 33, 43];

/**
 * A card's box, percent of the square's width (the component sets these in
 * cqw). The rings turn at different speeds while every card stays upright, so
 * any two cards -- same ring or neighbouring rings -- eventually meet at every
 * relative bearing, and two upright boxes never overlap at centre distance d
 * only if the box's diagonal is at most d. The closest ring gap is 10
 * (33 -> 43); hypot(8.4, 4.8) is 9.67, leaving about 0.3 (3px at the full
 * 896px diagram) for the borders and shadows. At 8.6 x 5 Chrome measured
 * cross-ring gaps of 1-2px.
 */
export const CARD = { w: 8.4, h: 4.8 } as const;

/**
 * Start offset of each ring, as a fraction of that ring's own slot (360 / count).
 * 0, 1/3 and 2/3 of a slot differ in absolute degrees on every ring, so cards
 * on neighbouring rings do not line up along a radius.
 */
const OFFSET_FRACTIONS = [0, 1 / 3, 2 / 3];

const DEFAULT_MAX_ITEMS = 48;

export type RingCard<T> = {
  item: T;
  ring: Ring;
  /** Position of the card within its ring, in dealt order. */
  index: number;
  angle: number;
  x: number;
  y: number;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Split n in proportion to weights, summing exactly to n (largest remainder). */
function apportion(n: number, weights: number[]): number[] {
  const total = weights.reduce((a, b) => a + b, 0);
  if (total === 0) return weights.map(() => 0);
  const exact = weights.map((w) => (n * w) / total);
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

/**
 * How many items each ring gets: proportional to radius, summing exactly to n
 * (largest-remainder rounding). Under 3 items only the first ring is used.
 * For 3..5 items the same rule gives 1/1/1, 1/1/2 and 1/2/2 — no ring is left empty.
 */
function ringCounts(n: number, radii: Radii): number[] {
  if (n < 3) return radii.map((_, i) => (i === 0 ? n : 0));
  return apportion(n, [...radii]);
}

/**
 * How many of the `marked` items each ring gets, so that every ring of two or
 * more cards carries both kinds whenever there are enough of each to go
 * round. Proportional first, then repaired one unit at a time, always moving
 * from (or to) the ring with the most to spare, lowest ring first on a tie --
 * deterministic.
 */
function kindCounts(targets: number[], marked: number): number[] {
  const n = targets.reduce((a, b) => a + b, 0);
  const counts = apportion(marked, targets);
  const all = targets.map((_, r) => r);
  const rings = all.filter((r) => targets[r] >= 2);
  const most = (score: (r: number) => number, ok: (r: number) => boolean) =>
    all.filter(ok).sort((a, b) => score(b) - score(a) || a - b)[0];
  const names = (r: number) => targets[r] - counts[r];

  if (marked >= rings.length) {
    for (const r of rings) {
      if (counts[r] > 0) continue;
      const from = most((s) => counts[s], (s) => s !== r && counts[s] >= 2);
      if (from === undefined) break;
      counts[from]--;
      counts[r]++;
    }
  }
  if (n - marked >= rings.length) {
    for (const r of rings) {
      if (names(r) > 0) continue;
      const to = most(names, (s) => s !== r && names(s) >= 2);
      if (to === undefined) break;
      counts[r]--;
      counts[to]++;
    }
  }
  return counts;
}

/**
 * One ring's cards, the two kinds interleaved: the fewer kind is spread evenly
 * round the ring (j-th at slot floor((j + 0.5) * k / m)), so no two of it sit
 * side by side whenever it is at most half the ring. Each kind keeps its dealt
 * order. Without this the ring kept list order, and the real list -- whose
 * first six partners all have artwork -- put three logos in a row.
 */
function interleave<T>(a: T[], b: T[]): T[] {
  const [few, many] = b.length <= a.length ? [b, a] : [a, b];
  const k = a.length + b.length;
  const m = few.length;
  const slots = new Set(few.map((_, j) => Math.floor(((j + 0.5) * k) / m)));
  const out: T[] = [];
  let f = 0;
  let g = 0;
  for (let i = 0; i < k; i++) out.push(slots.has(i) ? few[f++] : many[g++]);
  return out;
}

/**
 * Deal items over three rings and place them.
 *
 * `kind` (optional) splits the items in two -- for the partners, approved
 * logo or name only -- and each kind is dealt over the rings in its own
 * proportional share, so every ring of two or more cards carries both kinds
 * whenever there are enough of each. Without it, kinds mix only as the input
 * order happens to fall: a plain round-robin over three rings can line up with
 * a pattern in the list and leave a ring all one kind (it did, at 20 and 28
 * items, in the tests).
 *
 * The round-robin spreads list neighbours over the rings, but that is NOT a
 * guarantee at every n: two consecutive items can land on the same ring, and
 * dealing by kind loosens it further. Dealt order is kept within each kind on
 * a ring; the two kinds are interleaved (see interleave).
 */
export function ringLayout<T>(
  items: T[],
  opts: { rings?: Radii; maxItems?: number; kind?: (item: T) => boolean } = {},
): RingCard<T>[] {
  const radii = opts.rings ?? RING_RADII;
  const list = items.slice(0, opts.maxItems ?? DEFAULT_MAX_ITEMS);
  const n = list.length;
  if (n === 0) return [];

  const targets = ringCounts(n, radii);
  const kind = opts.kind ?? (() => false);
  const flags = list.map((item) => (kind(item) ? 1 : 0));
  const marked = flags.reduce<number>((a, b) => a + b, 0);
  const markedTargets = kindCounts(targets, marked);
  // Per ring, how many of each kind: [unmarked, marked].
  const quota = RINGS.map((r) => [targets[r] - markedTargets[r], markedTargets[r]]);
  const totals = [n - marked, marked];
  const dealt: [T[], T[]][] = RINGS.map(() => [[], []]);
  const dealtOf = RINGS.map(() => [0, 0]);
  const seen = [0, 0];

  // Weighted round-robin within each kind: an item goes to the ring furthest
  // behind its ideal share of that kind. With no `kind`, every item is the
  // same kind and this is the plain round-robin over the rings.
  list.forEach((item, i) => {
    const k = flags[i];
    const t = seen[k]++;
    let best: Ring | undefined;
    let bestDeficit = -Infinity;
    for (const r of RINGS) {
      if (dealtOf[r][k] >= quota[r][k]) continue;
      const deficit = (quota[r][k] * (t + 1)) / totals[k] - dealtOf[r][k];
      if (deficit > bestDeficit) {
        bestDeficit = deficit;
        best = r;
      }
    }
    // Quotas of each kind sum to that kind's total, so a ring always has room.
    if (best === undefined) throw new Error("ringLayout: no ring has room");
    dealt[best][k].push(item);
    dealtOf[best][k]++;
  });

  const cards: RingCard<T>[] = [];
  for (const r of RINGS) {
    const ringItems = interleave(dealt[r][0], dealt[r][1]);
    const k = ringItems.length;
    const slot = 360 / k;
    const offset = slot * OFFSET_FRACTIONS[r];
    ringItems.forEach((item, index) => {
      const angle = offset + index * slot;
      const rad = (angle * Math.PI) / 180;
      cards.push({
        item,
        ring: r,
        index,
        angle: round2(angle),
        x: round2(50 + radii[r] * Math.sin(rad)),
        y: round2(50 - radii[r] * Math.cos(rad)),
      });
    });
  }
  return cards;
}
