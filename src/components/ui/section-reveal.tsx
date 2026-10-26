"use client";

/*
 * Plays each home page section's entrance once, with a clear, timed animation,
 * when the section scrolls into view. (The scroll-linked reveals only move as
 * far as the wheel does, so a quick scroll skips straight over them.)
 *
 * It tags the pieces of every .eg-sec section (heading, intro, eyebrow, cards,
 * link pills) with data-rv, then switches html[data-rv] on, which hides tagged
 * pieces until each comes into view; an IntersectionObserver then adds
 * .eg-rv-in to it, with a stagger delay among the pieces that appear together,
 * and the stylesheet plays the entrance (the "eg-rv" block in globals.css). Nothing is hidden before
 * this runs, without JavaScript, or under reduced motion: the switch is simply
 * never turned on, and the page is exactly as served.
 */
import { useEffect } from "react";

/** What gets an entrance inside a section, in document order. */
export const REVEAL_SELECTOR = "h2, h2 + p, .eg-m-eyebrow, .eg-inview, a.rounded-full";

/** Stagger: each piece a little after the one before, never more than MAX_DELAY_S. */
export const STEP_S = 0.09;
export const MAX_DELAY_S = 0.7;

export function revealDelay(index: number): number {
  return Math.min(Math.max(index, 0) * STEP_S, MAX_DELAY_S);
}

/**
 * One entrance for everything: a straight rise. (A heading that slid in from the
 * side next to cards that rise and scale met them at an angle, which read as
 * diagonal.) Kept as a function so a different treatment is one change.
 */
export function revealKind(_tag: string): "up" {
  return "up";
}

/** Pieces this close to (or inside) the first screen play at once, not on a scroll. */
export const INITIAL_MARGIN_PX = 48;
/** If nothing has revealed a piece by now, everything left is shown at once. */
export const FALLBACK_MS = 3000;

export function isInInitialViewport(top: number, viewportHeight: number): boolean {
  return top < viewportHeight + INITIAL_MARGIN_PX;
}

/** The slice of an element, observer and window the reveal touches, so it can be tested without a DOM. */
export type RevealPiece = {
  tagName: string;
  dataset: Record<string, string | undefined>;
  style: { setProperty(name: string, value: string): void; removeProperty(name: string): void };
  classList: { add(name: string): void; remove(name: string): void };
  getBoundingClientRect(): { top: number };
};
export type RevealObserver = {
  observe(el: RevealPiece): void;
  unobserve(el: RevealPiece): void;
  disconnect(): void;
};
export type RevealEntry = { target: RevealPiece; isIntersecting: boolean; boundingClientRect: { top: number; left: number } };
export type RevealDeps = {
  pieces: RevealPiece[];
  root: { dataset: Record<string, string | undefined> };
  viewportHeight: number;
  createObserver(callback: (entries: RevealEntry[]) => void): RevealObserver;
  setTimeout(fn: () => void, ms: number): unknown;
  clearTimeout(id: unknown): void;
  addPrintListener(fn: () => void): () => void;
};

/**
 * Turns the reveal on and returns the cleanup. Nothing is ever left hidden for
 * long: pieces already on the first screen play immediately, every piece still
 * waiting after FALLBACK_MS is shown at once (a renderer that never scrolls),
 * and printing shows them all.
 */
export function startReveal(deps: RevealDeps): () => void {
  const { pieces, root } = deps;
  for (const el of pieces) el.dataset.rv = revealKind(el.tagName);
  root.dataset.rv = "on";

  const waiting = new Set<RevealPiece>();
  const play = (el: RevealPiece, delayS: number) => {
    el.style.setProperty("--rv-d", `${delayS.toFixed(2)}s`);
    el.classList.add("eg-rv-in");
    waiting.delete(el);
  };

  const observer = deps.createObserver((entries) => {
    // Pieces that come into view together (a row of cards, a heading and its
    // intro) play one after the other, in the order they sit on the page.
    const entering = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
    entering.forEach((entry, i) => {
      play(entry.target, revealDelay(i));
      observer.unobserve(entry.target);
    });
  });

  // The first screen plays now, staggered; the rest wait for the observer.
  let first = 0;
  for (const el of pieces) {
    if (isInInitialViewport(el.getBoundingClientRect().top, deps.viewportHeight)) play(el, revealDelay(first++));
    else {
      waiting.add(el);
      observer.observe(el);
    }
  }

  const revealAll = () => {
    for (const el of Array.from(waiting)) {
      play(el, 0);
      observer.unobserve(el);
    }
  };
  const timer = deps.setTimeout(revealAll, FALLBACK_MS);
  const removePrint = deps.addPrintListener(revealAll);

  return () => {
    deps.clearTimeout(timer);
    removePrint();
    observer.disconnect();
    delete root.dataset.rv;
    for (const el of pieces) {
      delete el.dataset.rv;
      el.classList.remove("eg-rv-in");
      el.style.removeProperty("--rv-d");
    }
  };
}

export function SectionReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const pieces = Array.from(document.querySelectorAll<HTMLElement>(".eg-sec")).flatMap((section) =>
      Array.from(section.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)),
    );
    if (!pieces.length) return;

    return startReveal({
      pieces,
      root: document.documentElement,
      viewportHeight: window.innerHeight,
      createObserver: (callback) =>
        new IntersectionObserver((entries) => callback(entries as unknown as RevealEntry[]), {
          rootMargin: "0px 0px -10% 0px",
          threshold: 0.05,
        }) as unknown as RevealObserver,
      setTimeout: (fn, ms) => window.setTimeout(fn, ms),
      clearTimeout: (id) => window.clearTimeout(id as number),
      addPrintListener: (fn) => {
        window.addEventListener("beforeprint", fn);
        return () => window.removeEventListener("beforeprint", fn);
      },
    });
  }, []);

  return null;
}
