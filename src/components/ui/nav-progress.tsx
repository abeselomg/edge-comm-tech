"use client";

/*
 * A slim brand-coloured bar across the top edge, with the Edge loader mark in a
 * small badge beneath it, during client-side navigation. (This is the route
 * loading indicator: a route-level loading.tsx would make every page stream its
 * content into a hidden block after the footer, which no-JS readers and simple
 * crawlers would never see.)
 * It starts on a click on an internal link, creeps towards 80% while the next
 * route loads, and completes when the pathname changes. Fixed, inert and
 * aria-hidden, so it cannot shift layout or be read out. No dependency.
 * Hidden outright under prefers-reduced-motion (see "eg-load-" in globals.css).
 */
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { EdgeLoader } from "@/components/ui/edge-loader";

type Phase = "idle" | "start" | "run" | "done";

/** The path a click on this link would navigate to, or null if it is not an in-site client navigation. */
export function internalNavTarget(a: HTMLAnchorElement | null, ev: MouseEvent, origin: string): string | null {
  if (!a || ev.defaultPrevented || ev.button !== 0) return null;
  if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return null;
  if ((a.target && a.target !== "_self") || a.hasAttribute("download")) return null;
  let url: URL;
  try {
    url = new URL(a.href, origin);
  } catch {
    return null;
  }
  if (url.origin !== origin) return null;
  return url.pathname + url.search;
}

export function NavProgress() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [run, setRun] = useState(0);
  const phaseRef = useRef<Phase>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const go = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      const a = (ev.target as Element | null)?.closest?.("a") ?? null;
      const target = internalNavTarget(a as HTMLAnchorElement | null, ev, location.origin);
      if (target === null || target === location.pathname + location.search) return;
      clearTimeout(timer.current);
      setRun((n) => n + 1);
      go("start");
      requestAnimationFrame(() => requestAnimationFrame(() => phaseRef.current === "start" && go("run")));
      // Never leave the bar hanging if the navigation is cancelled.
      timer.current = setTimeout(() => go("done"), 12000);
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (phaseRef.current === "idle" || phaseRef.current === "done") return;
    clearTimeout(timer.current);
    // New route is in; finish once any fonts it pulled in are too (usually none, so this is instant).
    let live = true;
    const cap = setTimeout(() => live && go("done"), 1500);
    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.then(() => live && go("done"), () => live && go("done"));
    return () => {
      live = false;
      clearTimeout(cap);
    };
  }, [pathname]);

  useEffect(() => {
    if (phase !== "done") return;
    timer.current = setTimeout(() => go("idle"), 700);
    return () => clearTimeout(timer.current);
  }, [phase]);

  if (phase === "idle") return null;
  return (
    <div key={run} aria-hidden="true">
      <div className="eg-load-bar" data-phase={phase} />
      <div className="eg-load-badge" data-phase={phase}>
        <EdgeLoader size="sm" />
      </div>
    </div>
  );
}
