/**
 * Minimal builders for Payload's Lexical rich-text format.
 *
 * Seed copy is authored as plain strings; these turn it into the serialized
 * editor state Payload stores. Inline **bold** is supported because the
 * technical copy leans on it to surface acronyms.
 */

type TextNode = {
  type: "text";
  detail: number;
  format: number;
  mode: "normal";
  style: string;
  text: string;
  version: number;
};

/** Shape Payload's rich-text field type expects for every node. */
type Node = { [k: string]: unknown; type: string; version: number };

type ElementNode = Node & {
  format: string;
  indent: number;
  direction: "ltr";
  children: Node[];
};

const BOLD = 1;

/** Split a string on **bold** markers into formatted text nodes. */
function inline(text: string): TextNode[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter((part) => part !== "")
    .map((part) => {
      const bold = part.startsWith("**") && part.endsWith("**");
      return {
        type: "text",
        detail: 0,
        format: bold ? BOLD : 0,
        mode: "normal",
        style: "",
        text: bold ? part.slice(2, -2) : part,
        version: 1,
      };
    });
}

function element(type: string, children: Node[], extra: Record<string, unknown> = {}): ElementNode {
  return { type, format: "", indent: 0, version: 1, direction: "ltr", children, ...extra };
}

export const p = (text: string) => element("paragraph", inline(text), { textFormat: 0, textStyle: "" });

export const h2 = (text: string) => element("heading", inline(text), { tag: "h2" });

export const h3 = (text: string) => element("heading", inline(text), { tag: "h3" });

export const quote = (text: string) => element("quote", inline(text));

const listItems = (items: string[]) =>
  items.map((item, i) =>
    element("listitem", inline(item), { value: i + 1, checked: undefined }),
  );

export const ul = (items: string[]) =>
  element("list", listItems(items), { listType: "bullet", start: 1, tag: "ul" });

export const ol = (items: string[]) =>
  element("list", listItems(items), { listType: "number", start: 1, tag: "ol" });

/** Wrap blocks into a complete serialized editor state. */
export function rich(...blocks: Node[]) {
  return {
    root: {
      type: "root",
      format: "" as const,
      indent: 0,
      version: 1,
      direction: "ltr" as const,
      children: blocks,
    },
  };
}
