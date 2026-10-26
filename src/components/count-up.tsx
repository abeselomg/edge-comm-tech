"use client";

import { useEffect, useRef } from "react";

/*
 * A figure that counts up once, when it first scrolls into view.
 *
 * The server renders the final text, so crawlers, the parity checker and
 * no-JS visitors all see the real figure. The effect only ever animates a
 * number that is already on screen and always finishes by writing the exact
 * original string back. Reduced motion skips the animation entirely.
 */

type Parts = { prefix: string; n: number; suffix: string; decimals: number; grouped: boolean };

/** Splits "1,200+" into prefix "", number 1200, suffix "+". Null when there is
 *  no number to animate, or when it reads as a year ("2018"). */
export function splitFigure(value: string): Parts | null {
  const m = /^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/.exec(value);
  if (!m) return null;
  const raw = m[2];
  const n = Number(raw.replace(/,/g, ""));
  if (!Number.isFinite(n) || n <= 0) return null;
  const grouped = raw.includes(",");
  if (!grouped && Number.isInteger(n) && n >= 1900 && n <= 2100) return null;
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  return { prefix: m[1], n, suffix: m[3], decimals, grouped };
}

export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parts = splitFigure(value);
    if (!el || !parts) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const { prefix, n, suffix, decimals, grouped } = parts;
    const fmt = (v: number) => {
      const body = grouped
        ? v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        : v.toFixed(decimals);
      return prefix + body + suffix;
    };
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / 1400);
          el.textContent = p >= 1 ? value : fmt(n * (1 - Math.pow(1 - p, 3)));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = value;
    };
  }, [value]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {value}
    </span>
  );
}
