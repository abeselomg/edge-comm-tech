import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FALLBACK_MS,
  MAX_DELAY_S,
  STEP_S,
  isInInitialViewport,
  revealDelay,
  revealKind,
  SectionReveal,
  startReveal,
  type RevealEntry,
  type RevealPiece,
} from "./section-reveal";

describe("section reveal", () => {
  it("staggers pieces in order and never past the cap", () => {
    expect(revealDelay(0)).toBe(0);
    expect(revealDelay(1)).toBeCloseTo(STEP_S);
    expect(revealDelay(3)).toBeCloseTo(3 * STEP_S);
    expect(revealDelay(500)).toBe(MAX_DELAY_S);
    expect(revealDelay(-4)).toBe(0);
  });

  it("gives every piece the same straight rise, headings included", () => {
    for (const tag of ["H2", "h2", "P", "A", "DIV", "SPAN"]) expect(revealKind(tag)).toBe("up");
  });

  it("renders nothing: it only tags elements and watches them in the browser", () => {
    expect(renderToStaticMarkup(<SectionReveal />)).toBe("");
  });
});

function fakePiece(top: number, left = 0): RevealPiece & { vars: Record<string, string>; classes: Set<string> } {
  const vars: Record<string, string> = {};
  const classes = new Set<string>();
  return {
    tagName: "H2",
    dataset: {},
    vars,
    classes,
    style: {
      setProperty: (k, v) => void (vars[k] = v),
      removeProperty: (k) => void delete vars[k],
    },
    classList: { add: (c) => void classes.add(c), remove: (c) => void classes.delete(c) },
    getBoundingClientRect: () => ({ top, left }) as { top: number },
  };
}

describe("startReveal safety", () => {
  let fire: (entries: RevealEntry[]) => void;
  let observed: Set<RevealPiece>;
  let printListeners: Array<() => void>;
  const root = { dataset: {} as Record<string, string | undefined> };

  beforeEach(() => {
    vi.useFakeTimers();
    observed = new Set();
    printListeners = [];
    root.dataset = {};
  });
  afterEach(() => vi.useRealTimers());

  const start = (pieces: RevealPiece[]) =>
    startReveal({
      pieces,
      root,
      viewportHeight: 800,
      createObserver: (cb) => {
        fire = cb;
        return {
          observe: (el) => void observed.add(el),
          unobserve: (el) => void observed.delete(el),
          disconnect: () => observed.clear(),
        };
      },
      setTimeout: (fn, ms) => setTimeout(fn, ms),
      clearTimeout: (id) => clearTimeout(id as ReturnType<typeof setTimeout>),
      addPrintListener: (fn) => {
        printListeners.push(fn);
        return () => void printListeners.splice(printListeners.indexOf(fn), 1);
      },
    });

  it("plays pieces already on the first screen at once, staggered, without waiting for the observer", () => {
    const a = fakePiece(100);
    const b = fakePiece(300);
    const c = fakePiece(2000);
    start([a, b, c]);
    expect(a.classes.has("eg-rv-in")).toBe(true);
    expect(b.classes.has("eg-rv-in")).toBe(true);
    expect(a.vars["--rv-d"]).toBe("0.00s");
    expect(b.vars["--rv-d"]).toBe(`${STEP_S.toFixed(2)}s`);
    expect(c.classes.has("eg-rv-in")).toBe(false);
    expect(observed.has(a)).toBe(false);
    expect(observed.has(c)).toBe(true);
    expect(isInInitialViewport(800, 800)).toBe(true);
    expect(isInInitialViewport(5000, 800)).toBe(false);
  });

  it("keeps the staggered reveal for pieces that scroll in", () => {
    const c = fakePiece(2000);
    const d = fakePiece(2100);
    start([c, d]);
    fire([
      { target: d, isIntersecting: true, boundingClientRect: { top: 2100, left: 0 } },
      { target: c, isIntersecting: true, boundingClientRect: { top: 2000, left: 0 } },
    ]);
    expect(c.vars["--rv-d"]).toBe("0.00s");
    expect(d.vars["--rv-d"]).toBe(`${STEP_S.toFixed(2)}s`);
  });

  it("reveals everything still hidden after the fallback delay, with no stagger", () => {
    const c = fakePiece(2000);
    const d = fakePiece(4000);
    start([c, d]);
    vi.advanceTimersByTime(FALLBACK_MS - 1);
    expect(d.classes.has("eg-rv-in")).toBe(false);
    vi.advanceTimersByTime(1);
    for (const el of [c, d]) {
      expect(el.classes.has("eg-rv-in")).toBe(true);
      expect(el.vars["--rv-d"]).toBe("0.00s");
    }
    expect(observed.size).toBe(0);
  });

  it("reveals everything before printing", () => {
    const c = fakePiece(3000);
    start([c]);
    printListeners.forEach((fn) => fn());
    expect(c.classes.has("eg-rv-in")).toBe(true);
  });

  it("cleans up: timer cancelled, print listener removed, tags and switch cleared", () => {
    const c = fakePiece(3000);
    const stop = start([c]);
    expect(root.dataset.rv).toBe("on");
    stop();
    vi.advanceTimersByTime(FALLBACK_MS * 2);
    expect(c.classes.has("eg-rv-in")).toBe(false);
    expect(printListeners).toHaveLength(0);
    expect(root.dataset.rv).toBeUndefined();
    expect(c.dataset.rv).toBeUndefined();
  });
});
