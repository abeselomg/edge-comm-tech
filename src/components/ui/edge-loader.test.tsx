import { existsSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { EdgeLoader, LOADER_SIZE_CLASS, type EdgeLoaderSize } from "./edge-loader";
import { NavProgress, internalNavTarget } from "./nav-progress";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

describe("EdgeLoader", () => {
  it("is a status region with an svg and a screen-reader-only label", () => {
    const out = renderToStaticMarkup(<EdgeLoader />);
    expect(out).toMatch(/^<span[^>]*role="status"[^>]*aria-live="polite"/);
    expect(out).toContain("<svg");
    expect(out).toContain('aria-label="Loading"');
    // the label is an attribute: no "Loading" text node in the markup
    expect(out.replace(/<[^>]*>/g, "")).not.toContain("Loading");
    expect(out).not.toMatch(/<img|<script|href=/);
    expect(out).toContain("eg-load-orbit");
  });

  it("maps sizes to distinct classes", () => {
    const sizes: EdgeLoaderSize[] = ["sm", "md", "lg"];
    sizes.forEach((s) => expect(renderToStaticMarkup(<EdgeLoader size={s} />)).toContain(LOADER_SIZE_CLASS[s]));
    expect(new Set(Object.values(LOADER_SIZE_CLASS)).size).toBe(3);
  });
});

describe("NavProgress", () => {
  it("renders nothing until a navigation starts, so no text and no box", () => {
    expect(renderToStaticMarkup(<NavProgress />)).toBe("");
  });
});

describe("internalNavTarget", () => {
  const origin = "https://edge.test";
  const ev = (o: Partial<MouseEvent> = {}) => ({ button: 0, defaultPrevented: false, ...o }) as MouseEvent;
  const link = (href: string, extra: Partial<HTMLAnchorElement> = {}) =>
    ({ href, target: "", hasAttribute: () => false, ...extra }) as unknown as HTMLAnchorElement;

  it("accepts same-origin plain clicks", () => {
    expect(internalNavTarget(link("https://edge.test/about?x=1"), ev(), origin)).toBe("/about?x=1");
  });
  it("ignores external, modified, new-tab and download clicks", () => {
    expect(internalNavTarget(link("https://other.test/"), ev(), origin)).toBeNull();
    expect(internalNavTarget(link("https://edge.test/a"), ev({ ctrlKey: true }), origin)).toBeNull();
    expect(internalNavTarget(link("https://edge.test/a", { target: "_blank" }), ev(), origin)).toBeNull();
    expect(internalNavTarget(link("https://edge.test/a"), ev({ button: 1 }), origin)).toBeNull();
    expect(internalNavTarget(null, ev(), origin)).toBeNull();
  });
});

describe("no route-level loading boundary", () => {
  it("keeps the (frontend) group free of loading.tsx", () => {
    // A loading.tsx wraps every page in a Suspense boundary, so the HTML a
    // no-JS reader or simple crawler gets would be the loader with the page
    // content streamed into a hidden block after the footer.
    expect(existsSync(join(process.cwd(), "src/app/(frontend)/loading.tsx"))).toBe(false);
  });
});
