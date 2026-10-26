"use client";

/*
 * Lets the site header sit transparent over the home page hero while the visitor
 * is at the top of the page, so the hero's sphere shows (and moves) behind the
 * navigation, then goes solid again as soon as the page is scrolled.
 *
 * It only reports two facts for the stylesheet to use ("eg-nav-" block in
 * globals.css): html[data-at-top] is "1" near the top and "0" otherwise, and
 * --eg-header-h is the header's current height (the hero uses it to slide up
 * under the header and keep its own content where it was). No markup changes.
 */
import { useEffect } from "react";

/** Scroll distance below which the page counts as "at the top". */
export const AT_TOP_PX = 24;

export function isAtTop(scrollY: number): boolean {
  return scrollY < AT_TOP_PX;
}

export function HeaderOverHero() {
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>(".eg-site-header");
    let frame = 0;

    const sync = () => {
      frame = 0;
      root.dataset.atTop = isAtTop(window.scrollY) ? "1" : "0";
    };
    const size = () => {
      if (header) root.style.setProperty("--eg-header-h", `${header.offsetHeight}px`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };

    sync();
    size();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", size);
    const observer = header && "ResizeObserver" in window ? new ResizeObserver(size) : null;
    if (header) observer?.observe(header);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", size);
      observer?.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
