import { describe, expect, it } from "vitest";
import { isHydrated, parseLang, pickInitialLang, swapAll, swapEl, type SwapEl } from "./swap";

/** A stand-in for an element holding one text node, as <Tr> renders it. */
function fake(en: string, am: string): SwapEl & { text: string; attrs: Map<string, string> } {
  const attrs = new Map<string, string>([["data-am", am]]);
  const node = { nodeType: 3, nodeValue: en };
  return {
    get text() {
      return node.nodeValue ?? "";
    },
    attrs,
    firstChild: node,
    getAttribute: (n) => attrs.get(n) ?? null,
    setAttribute: (n, v) => void attrs.set(n, v),
    removeAttribute: (n) => void attrs.delete(n),
  };
}

describe("swapEl", () => {
  it("maps English to Amharic and restores it", () => {
    const el = fake("Solutions", "መፍትሔዎች");
    swapEl(el, "am");
    expect(el.text).toBe("መፍትሔዎች");
    expect(el.attrs.get("lang")).toBe("am");
    swapEl(el, "en");
    expect(el.text).toBe("Solutions");
    expect(el.attrs.has("lang")).toBe(false);
  });

  it("is idempotent and survives repeated round trips", () => {
    const el = fake("Blog", "ብሎግ");
    for (let i = 0; i < 3; i += 1) {
      swapEl(el, "am");
      swapEl(el, "am");
      expect(el.text).toBe("ብሎግ");
      swapEl(el, "en");
      swapEl(el, "en");
      expect(el.text).toBe("Blog");
    }
  });

  it("leaves an element that was never swapped alone when asked for English", () => {
    const el = fake("Clients", "ደንበኞች");
    swapEl(el, "en");
    expect(el.text).toBe("Clients");
    expect(el.attrs.has("data-en")).toBe(false);
  });

  it("ignores elements without Amharic or without a single text node", () => {
    const bare = fake("Partners", "");
    swapEl(bare, "am");
    expect(bare.text).toBe("Partners");
    const empty: SwapEl = { ...fake("x", "y"), firstChild: null };
    expect(() => swapEl(empty, "am")).not.toThrow();
    const elementChild = { ...fake("x", "y"), firstChild: { nodeType: 1, nodeValue: null } };
    expect(() => swapEl(elementChild, "am")).not.toThrow();
  });

  it("swaps a whole list", () => {
    const els = [fake("Projects", "ፕሮጀክቶች"), fake("About", "ስለ እኛ")];
    swapAll(els, "am");
    expect(els.map((e) => e.text)).toEqual(["ፕሮጀክቶች", "ስለ እኛ"]);
    swapAll(els, "en");
    expect(els.map((e) => e.text)).toEqual(["Projects", "About"]);
  });
});

describe("choosing the language", () => {
  it("parses only the two supported values", () => {
    expect(parseLang("am")).toBe("am");
    expect(parseLang("en")).toBe("en");
    for (const v of ["fr", "AM", "", null, undefined, 3]) expect(parseLang(v)).toBeNull();
  });

  it("prefers ?lang=, then the stored choice, then English", () => {
    expect(pickInitialLang("?lang=am", null)).toBe("am");
    expect(pickInitialLang("?lang=en", "am")).toBe("en");
    expect(pickInitialLang("", "am")).toBe("am");
    expect(pickInitialLang("?x=1", "garbage")).toBe("en");
    expect(pickInitialLang("?lang=zz", "am")).toBe("am");
    expect(pickInitialLang("", null)).toBe("en");
  });
});

describe("isHydrated", () => {
  it("is true only for a node React has attached a fiber to", () => {
    expect(isHydrated({})).toBe(false);
    expect(isHydrated({ "__reactProps$abc": {} })).toBe(false);
    expect(isHydrated({ "__reactFiber$abc": {} })).toBe(true);
  });
});
