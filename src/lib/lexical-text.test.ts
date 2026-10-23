import { describe, expect, it } from "vitest";
import { p } from "../seed/lexical";
import { paragraphs, teaser } from "./lexical-text";

const doc = (...children: unknown[]) => ({ root: { type: "root", children } });

describe("paragraphs", () => {
  it("returns each paragraph's plain text, bold markers gone", () => {
    expect(paragraphs(doc(p("First."), p("Second with **bold** words.")))).toEqual([
      "First.",
      "Second with bold words.",
    ]);
  });

  it("skips headings and other non-paragraph blocks", () => {
    const heading = { type: "heading", tag: "h2", children: [{ type: "text", text: "Title" }] };
    expect(paragraphs(doc(heading, p("Body.")))).toEqual(["Body."]);
  });

  it("returns an empty list for a missing or malformed body rather than throwing", () => {
    expect(paragraphs(null)).toEqual([]);
    expect(paragraphs(undefined)).toEqual([]);
    expect(paragraphs({})).toEqual([]);
    expect(paragraphs({ root: { children: "nope" } })).toEqual([]);
  });
});

describe("teaser", () => {
  it("cuts the first paragraph at the limit and marks the cut", () => {
    const long = "word ".repeat(60).trim();
    const out = teaser(doc(p(long)), 150);
    expect(out.length).toBeLessThanOrEqual(151);
    expect(out.endsWith("…")).toBe(true);
  });

  /*
   * Highland's own rule was paras[0].slice(0, 150) followed by an ellipsis,
   * unconditionally, so a short paragraph still printed "…". The port keeps
   * the character count and the ellipsis so the copy matches; the cut is the
   * same plain slice, not a word-boundary trim.
   */
  it("slices at exactly the limit, as Highland did", () => {
    const text = "x".repeat(200);
    expect(teaser(doc(p(text)), 150)).toBe("x".repeat(150) + "…");
  });

  it("is empty for a post with no paragraph", () => {
    expect(teaser(doc(), 150)).toBe("");
  });
});
