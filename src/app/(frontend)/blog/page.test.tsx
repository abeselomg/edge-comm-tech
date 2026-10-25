import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { p } from "../../../seed/lexical";
import { allInsightsLabel, PostArticle, topics } from "./blog-parts";

const body = { root: { type: "root", children: [p("First paragraph."), p("Second paragraph.")] } };
const cat = { key: "ai", label: "Enterprise AI", _status: "published" };
const target = (status: string, extra = {}) => ({
  slug: "s",
  title: "Solution S",
  short: "S",
  accent: "#123456",
  _status: status,
  ...extra,
});
const post = (over: Record<string, unknown> = {}) =>
  ({
    slug: "p",
    title: "Post title",
    body,
    category: cat,
    readMoreLabel: "Read more about S…",
    target: target("published"),
    ...over,
  }) as never;

const html = (el: React.ReactElement) => renderToStaticMarkup(el);

describe("PostArticle", () => {
  it("publishes the whole article, in full, under an anchor other pages link to", () => {
    const out = html(<PostArticle post={post()} index={0} />);
    expect(out).toContain('id="post-p"');
    expect(out).toContain("Post title");
    expect(out).toContain("First paragraph.");
    expect(out).toContain("Second paragraph.");
    expect(out).toContain("01 · Enterprise AI");
  });

  it("links Read More to the target solution, with the capability anchor", () => {
    const out = html(<PostArticle post={post({ anchor: "private-rag" })} index={0} />);
    expect(out).toContain('href="/solutions/s#private-rag"');
    expect(out).toContain("Read more about S…");
  });

  it("goes to the top of the page when the post has no anchor", () => {
    const out = html(<PostArticle post={post()} index={0} />);
    expect(out).toContain('href="/solutions/s"');
    expect(out).not.toContain("#undefined");
    expect(out).not.toContain("#null");
  });

  /*
   * Review Focus #2, sharpest here. Payload's depth populate does not re-apply
   * the published filter, so an article stays published while its target is
   * unpublished. Read More would then go to a page that 404s.
   */
  it("renders a post whose target was unpublished without a link to it", () => {
    const out = html(<PostArticle post={post({ target: target("draft") })} index={0} />);
    expect(out).toContain("Post title");
    expect(out).toContain("First paragraph.");
    expect(out).not.toContain("/solutions/s");
    expect(out).not.toContain("Goes to");
  });

  it("copes with a target that arrived as a bare id", () => {
    const out = html(<PostArticle post={post({ target: 7 })} index={0} />);
    expect(out).toContain("Post title");
    expect(out).not.toContain("/solutions/");
  });

  it("drops the category from the eyebrow when it arrives null (unpublished, stripped by the read layer)", () => {
    const out = html(<PostArticle post={post({ category: null })} index={1} />);
    expect(out).toContain("Post title");
    expect(out).toContain(">02<");
    expect(out).not.toContain("02 ·");
  });
});

describe("topics", () => {
  it("leaves out a post whose category arrived null, without throwing", () => {
    const a = post({ slug: "a", category: null });
    const b = post({ slug: "b", category: { key: "net", label: "Network" } });
    expect(topics([a, b])).toEqual([{ key: "net", label: "Network", firstSlug: "b", count: 1 }]);
  });

  it("lists only categories that have an article, in article order, with a count", () => {
    const a = post({ slug: "a", category: { key: "ai", label: "AI" } });
    const b = post({ slug: "b", category: { key: "net", label: "Network" } });
    const c = post({ slug: "c", category: { key: "ai", label: "AI" } });
    expect(topics([a, b, c])).toEqual([
      { key: "ai", label: "AI", firstSlug: "a", count: 2 },
      { key: "net", label: "Network", firstSlug: "b", count: 1 },
    ]);
  });
});

describe("allInsightsLabel", () => {
  it("counts the insights, singular when there is one", () => {
    expect(allInsightsLabel(10)).toBe("All 10 insights");
    expect(allInsightsLabel(1)).toBe("All 1 insight");
  });
  it("offers no link text when there are none", () => {
    expect(allInsightsLabel(0)).toBeNull();
  });
});
