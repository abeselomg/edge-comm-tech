import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

/*
 * The "you are previewing" bar. It is the editor's only sign that what they
 * see is not what the public sees, and it must never appear for the public.
 */

const isDraft = vi.fn<() => Promise<boolean>>();
vi.mock("@/lib/draft", () => ({ isDraft: () => isDraft() }));

let pathname: string | null = "/solutions/cybersecurity";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

const { DraftBanner } = await import("./draft-banner");

async function render() {
  const el = await DraftBanner();
  return el ? renderToStaticMarkup(el) : "";
}

describe("DraftBanner", () => {
  it("renders nothing outside draft mode", async () => {
    isDraft.mockResolvedValue(false);
    expect(await DraftBanner()).toBeNull();
    expect(await render()).toBe("");
  });

  it("says it is a preview and links back out to the current page", async () => {
    isDraft.mockResolvedValue(true);
    pathname = "/solutions/cybersecurity";
    const html = await render();
    expect(html).toContain("Preview — unpublished changes are shown");
    expect(html).toContain(`href="/preview/exit?path=${encodeURIComponent("/solutions/cybersecurity")}"`);
    expect(html).toContain("Exit preview");
  });

  it("falls back to a bare exit link when the pathname is unknown", async () => {
    isDraft.mockResolvedValue(true);
    pathname = null;
    expect(await render()).toContain('href="/preview/exit"');
  });

  it("is rendered by the frontend layout", () => {
    const here = path.dirname(fileURLToPath(import.meta.url));
    const layout = readFileSync(path.join(here, "..", "app", "(frontend)", "layout.tsx"), "utf8");
    expect(layout).toMatch(/<DraftBanner\s*\/>/);
  });
});
