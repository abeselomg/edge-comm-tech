/*
 * Pointer position -> a small rotation, for the solution visual's tilt.
 * Pure, so it can be tested without a browser. The pointer is measured from
 * the centre of the stage and normalised by 1.5x its size, so the tilt eases
 * out smoothly rather than snapping at the edge, then clamped to +/- `max`.
 */

export type Tilt = { rx: number; ry: number };

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const round2 = (n: number) => Math.round(n * 100) / 100 + 0; // + 0 turns -0 into 0

export function tiltFromPointer(
  x: number,
  y: number,
  rect: { left: number; top: number; width: number; height: number },
  max = 7,
): Tilt {
  if (rect.width <= 0 || rect.height <= 0) return { rx: 0, ry: 0 };
  const nx = clamp((x - (rect.left + rect.width / 2)) / (rect.width * 1.5), -1, 1);
  const ny = clamp((y - (rect.top + rect.height / 2)) / (rect.height * 1.5), -1, 1);
  // Pointer to the right turns the right edge away (positive rotateY);
  // pointer below turns the bottom edge toward the viewer (negative rotateX).
  return { rx: round2(-ny * max), ry: round2(nx * max) };
}
