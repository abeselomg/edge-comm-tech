"use client";

import { useEffect, useRef } from "react";
import { tiltFromPointer } from "@/lib/tilt";

/*
 * Sets --eg-sv-rx / --eg-sv-ry on its element from the mouse position, so the
 * CSS can rotate the art in perspective. Throttled to one write per animation
 * frame; does nothing at all on touch / coarse pointers or when the visitor
 * prefers reduced motion, and resets when the pointer leaves the window.
 */
export function TiltStage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const apply = (rx: number, ry: number) => {
      el.style.setProperty("--eg-sv-rx", `${rx}deg`);
      el.style.setProperty("--eg-sv-ry", `${ry}deg`);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const { clientX, clientY } = e;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const t = tiltFromPointer(clientX, clientY, el.getBoundingClientRect());
        apply(t.rx, t.ry);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      apply(0, 0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
