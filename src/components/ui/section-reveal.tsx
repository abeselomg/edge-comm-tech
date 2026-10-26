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

export function SectionReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const pieces = Array.from(document.querySelectorAll<HTMLElement>(".eg-sec")).flatMap((section) =>
      Array.from(section.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)),
    );
    if (!pieces.length) return;

    for (const el of pieces) el.dataset.rv = revealKind(el.tagName);
    root.dataset.rv = "on";

    const observer = new IntersectionObserver(
      (entries) => {
        // Pieces that come into view together (a row of cards, a heading and its
        // intro) play one after the other, in the order they sit on the page.
        const entering = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
        entering.forEach((entry, i) => {
          const el = entry.target as HTMLElement;
          el.style.setProperty("--rv-d", `${revealDelay(i).toFixed(2)}s`);
          el.classList.add("eg-rv-in");
          observer.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    pieces.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      delete root.dataset.rv;
      for (const el of pieces) {
        delete el.dataset.rv;
        el.classList.remove("eg-rv-in");
        el.style.removeProperty("--rv-d");
      }
    };
  }, []);

  return null;
}
