import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AnimatedWords } from "./animated-words";

const html = (t?: string | null) => renderToStaticMarkup(<h1><AnimatedWords text={t} /></h1>);
const textOf = (h: string) => h.replace(/<[^>]*>/g, "");

describe("AnimatedWords", () => {
  it("keeps the text identical", () => {
    const t = "Integrated ICT, built to last";
    expect(textOf(html(t))).toBe(t);
  });

  it("renders one inner span per word with a stagger index", () => {
    const out = html("one two three");
    expect(out.match(/eg-hero-word-in/g)).toHaveLength(3);
    expect(out).toContain("--i:0");
    expect(out).toContain("--i:2");
  });

  it("collapses repeated whitespace to single spaces", () => {
    expect(textOf(html("  a   b \n c "))).toBe("a b c");
  });

  it("handles a single very long word", () => {
    const w = "Telecommunications".repeat(4);
    expect(textOf(html(w))).toBe(w);
  });

  it("renders nothing for empty or missing text", () => {
    expect(html("")).toBe("<h1></h1>");
    expect(html(undefined)).toBe("<h1></h1>");
    expect(html(null)).toBe("<h1></h1>");
  });
});
