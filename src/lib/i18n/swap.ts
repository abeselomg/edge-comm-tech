/*
 * The client-side half of the Amharic demo: pure helpers, no React.
 *
 * <Tr> puts the Amharic in a data-am attribute and leaves the English as the
 * element's text. Swapping is therefore a text-node write in the browser, after
 * hydration, so the server HTML and the first client render are identical (no
 * hydration mismatch) and crawlers and no-JS readers get English.
 *
 * The text node is edited in place (nodeValue) rather than replaced, so the node
 * React holds a reference to stays attached.
 */

export type Lang = "en" | "am";

export const STORAGE_KEY = "eg-lang";

/** The slice of an Element that swapping touches; lets tests use plain objects. */
export interface SwapEl {
  firstChild: { nodeType: number; nodeValue: string | null } | null;
  getAttribute(name: string): string | null;
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
}

const TEXT_NODE = 3;

export function parseLang(value: unknown): Lang | null {
  return value === "am" || value === "en" ? value : null;
}

/** ?lang= wins (a shared link), then the remembered choice, then English. */
export function pickInitialLang(search: string, stored: string | null): Lang {
  const fromUrl = parseLang(new URLSearchParams(search).get("lang"));
  return fromUrl ?? parseLang(stored) ?? "en";
}

/** Swap one element's text. The English is kept in data-en the first time. */
export function swapEl(el: SwapEl, lang: Lang): void {
  const node = el.firstChild;
  if (!node || node.nodeType !== TEXT_NODE) return;
  if (lang === "am") {
    const am = el.getAttribute("data-am");
    if (!am) return;
    if (el.getAttribute("data-en") === null) el.setAttribute("data-en", node.nodeValue ?? "");
    node.nodeValue = am;
    el.setAttribute("lang", "am");
  } else {
    const en = el.getAttribute("data-en");
    if (en === null) return; // never swapped: still English
    node.nodeValue = en;
    el.removeAttribute("lang");
  }
}

export function swapAll(els: Iterable<SwapEl>, lang: Lang): void {
  for (const el of els) swapEl(el, lang);
}

/** Swap every translatable element at or under `root` (an Element or the document). */
export function swapTree(root: ParentNode, lang: Lang): void {
  if (root instanceof Element && root.matches("[data-am]")) swapEl(root, lang);
  swapAll(root.querySelectorAll<HTMLElement>("[data-am]"), lang);
}
