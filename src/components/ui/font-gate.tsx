"use client";

/*
 * The page-load gate: a text-free, aria-hidden overlay in the very first HTML
 * paint that carries the brand loader until the page has finished loading (the
 * window load event) and the two web fonts are in, so the visitor sees the
 * loader for as long as the page is really loading and the typeface never
 * changes after it has gone. It is only ever a cover: the page underneath is
 * untouched and complete in the served HTML.
 *
 * It is hidden in CSS unless the inline boot script switches it on, so a
 * visitor without JavaScript never sees it. Ways out, none of which can trap a
 * visitor:
 *   - this effect: load + fonts done (after a short minimum), or MAX_WAIT_MS;
 *   - a CSS animation in globals.css that hides it a little after that, with
 *     no script, should the effect never run.
 * Client-side navigations never remount it (the layout persists).
 */
import { useEffect } from "react";
import { EdgeLoader } from "./edge-loader";
import {
  FADE_MS,
  GATE_BOOT_SCRIPT,
  GATE_FONTS,
  GATE_SAMPLE,
  remainingHoldMs,
  remainingWaitMs,
} from "./font-gate-logic";

export function FontGate() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.getAttribute("data-fonts")) return;
    const fonts = document.fonts;
    let finished = false;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let holdTimer: ReturnType<typeof setTimeout> | undefined;

    const finish = () => {
      if (finished) return;
      finished = true;
      root.setAttribute("data-fonts", "ready");
      hideTimer = setTimeout(() => root.setAttribute("data-fonts", "gone"), FADE_MS + 50);
    };

    const cap = setTimeout(finish, remainingWaitMs(performance.now()));
    const pageLoaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });
    const fontsLoaded = fonts
      ? Promise.all(GATE_FONTS.map((f) => fonts.load(f, GATE_SAMPLE))).then(() => fonts.ready)
      : Promise.resolve();
    Promise.all([pageLoaded, fontsLoaded.catch(() => undefined)]).then(() => {
      holdTimer = setTimeout(finish, remainingHoldMs(performance.now()));
    });

    return () => {
      clearTimeout(cap);
      clearTimeout(holdTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="eg-fontgate" aria-hidden="true">
      <script dangerouslySetInnerHTML={{ __html: GATE_BOOT_SCRIPT }} />
      <EdgeLoader size="lg" label="" />
    </div>
  );
}
