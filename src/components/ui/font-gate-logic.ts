/*
 * Pure decisions for the page-load gate (see font-gate.tsx and the "eg-fontgate-"
 * block at the end of globals.css). Kept free of the DOM so they can be tested.
 *
 * The gate is a cover with the brand loader that stays up until the page has
 * finished loading (the window load event, which includes images and the
 * fonts) and the two web fonts are in. It shows on every full page load, so a
 * slow connection sees the loader for as long as the page is really loading.
 */
/** The overlay never shows for less than this, so a fast load does not flash it. Counted from the start of the navigation. */
export const MIN_SHOW_MS = 1200;
/** The longest the overlay may cover the page, whatever is still loading. */
export const MAX_WAIT_MS = 6000;
/** Must match the fade in globals.css. */
export const FADE_MS = 250;

/** The families next/font registers in layout.tsx (the glyph sample forces the latin subset). */
export const GATE_FONTS = ['700 1em "Geologica"', '400 1em "Atkinson Hyperlegible"'] as const;
export const GATE_SAMPLE = "Edge Comm-Tech";

/** How much longer to hold the overlay once everything is in, given the time since the navigation began. */
export function remainingHoldMs(elapsedMs: number): number {
  return Math.max(0, MIN_SHOW_MS - elapsedMs);
}

/** The most the overlay may still wait, given the time since the navigation began. */
export function remainingWaitMs(elapsedMs: number): number {
  return Math.max(0, MAX_WAIT_MS - elapsedMs);
}

/**
 * Runs before first paint, inline at the top of <body>: it switches the cover
 * ON. The cover is hidden by default in CSS, so a visitor without JavaScript
 * never sees a loader that nothing could remove.
 */
export const GATE_BOOT_SCRIPT = `document.documentElement.setAttribute("data-gate","on")`;
