"use client";

/*
 * The font gate: a text-free, aria-hidden overlay in the very first HTML paint
 * that carries the brand loader until the two web fonts are in, so the page
 * never visibly changes typeface after the loader has gone. It is only ever a
 * cover: the page underneath is untouched and complete in the served HTML.
 *
 * Three independent ways out, none of which can trap a visitor:
 *   - this effect: both fonts loaded (after a short minimum), or MAX_WAIT_MS;
 *   - a CSS animation in globals.css that hides it after ~3.5s with no script;
 *   - the inline boot script, which skips it for later hard loads in a session.
 * Client-side navigations never remount it (the layout persists).
 */
import { useEffect } from "react";
import { EdgeLoader } from "./edge-loader";
import {
  FADE_MS,
  GATE_BOOT_SCRIPT,
  GATE_FLAG,
  GATE_FONTS,
  GATE_SAMPLE,
  remainingHoldMs,
  remainingWaitMs,
} from "./font-gate-logic";

export function FontGate() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.getAttribute("data-fonts")) return;
    const started = performance.now();
    const fonts = document.fonts;
    const alreadyLoaded = !fonts || GATE_FONTS.every((f) => fonts.check(f, GATE_SAMPLE));
    let finished = false;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const finish = () => {
      if (finished) return;
      finished = true;
      root.setAttribute("data-fonts", "ready");
      try {
        sessionStorage.setItem(GATE_FLAG, "1");
      } catch {}
      hideTimer = setTimeout(() => root.setAttribute("data-fonts", "gone"), FADE_MS + 50);
    };

    const cap = setTimeout(finish, remainingWaitMs(0));
    const loaded = fonts
      ? Promise.all(GATE_FONTS.map((f) => fonts.load(f, GATE_SAMPLE))).then(() => fonts.ready)
      : Promise.resolve();
    loaded.catch(() => undefined).then(() => {
      setTimeout(finish, remainingHoldMs(performance.now() - started, alreadyLoaded));
    });

    return () => {
      clearTimeout(cap);
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
