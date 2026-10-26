/*
 * Pure decisions for the font gate (see font-gate.tsx and the "eg-fontgate-"
 * block at the end of globals.css). Kept free of the DOM so they can be tested.
 */
export const GATE_FLAG = "eg-fonts-seen";
/** The overlay never shows for less than this, so a fast load does not flash it. */
export const MIN_SHOW_MS = 350;
/** A font that has not arrived by now no longer holds the page back. */
export const MAX_WAIT_MS = 2500;
/** Must match the fade in globals.css. */
export const FADE_MS = 250;

/** The families next/font registers in layout.tsx (the glyph sample forces the latin subset). */
export const GATE_FONTS = ['700 1em "Geologica"', '400 1em "Atkinson Hyperlegible"'] as const;
export const GATE_SAMPLE = "Edge Comm-Tech";

/** The gate is for the first page of a browsing session only. */
export function shouldShowGate(flag: string | null | undefined): boolean {
  return !flag;
}

/**
 * How much longer to hold the overlay once the fonts are known to be in.
 * Already cached (they were in before we even looked) means none at all.
 */
export function remainingHoldMs(elapsedMs: number, alreadyLoaded: boolean): number {
  if (alreadyLoaded) return 0;
  return Math.max(0, MIN_SHOW_MS - elapsedMs);
}

/** The most the overlay may still wait for the fonts, given time already spent. */
export function remainingWaitMs(elapsedMs: number): number {
  return Math.max(0, MAX_WAIT_MS - elapsedMs);
}

/**
 * Runs before first paint, inline at the top of <body>: a returning page view
 * in the same session skips the gate outright.
 */
export const GATE_BOOT_SCRIPT = `try{if(sessionStorage.getItem("${GATE_FLAG}"))document.documentElement.setAttribute("data-fonts","gone")}catch(e){}`;
