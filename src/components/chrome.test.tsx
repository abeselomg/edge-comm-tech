import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("next/image", () => ({ default: () => null }));
vi.mock("@/lib/content", () => ({
  getSiteSettings: async () => ({
    nav: [
      { label: "Solutions", href: "/solutions" },
      { label: "Projects", href: "/projects" },
      { label: "Not in the dictionary", href: "/x" },
    ],
    headerCta: { label: "Contact us", href: "/contact" },
  }),
}));

const { SiteHeader } = await import("./chrome");

describe("SiteHeader", () => {
  it("keeps the English labels as text and carries Amharic only where it exists", async () => {
    const html = renderToStaticMarkup(await SiteHeader());
    expect(html).toContain('data-am="መፍትሔዎች">Solutions</span>');
    expect(html).toContain('data-am="ፕሮጀክቶች">Projects</span>');
    expect(html).toContain(">Not in the dictionary</a>");
    expect(html).toContain('data-am="ያግኙን">Contact us</span>');
  });

  it("has exactly one language toggle", async () => {
    const html = renderToStaticMarkup(await SiteHeader());
    expect(html.match(/data-parity="lang-toggle"/g)).toHaveLength(1);
  });
});
