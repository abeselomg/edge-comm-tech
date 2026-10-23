/*
 * Plain-text reading of a Lexical rich-text value.
 *
 * Only for places that need a teaser or a text comparison. Rendering a body on
 * its page is the rich-text renderer's job, not this file's.
 *
 * Defensive on purpose: a body is editor-supplied JSON, and a teaser that
 * throws takes the whole resource centre down with it.
 */

type LexicalNode = { type?: string; text?: string; children?: unknown };

const nodes = (v: unknown): LexicalNode[] => (Array.isArray(v) ? (v as LexicalNode[]) : []);

function textOf(node: LexicalNode): string {
  if (typeof node.text === "string") return node.text;
  return nodes(node.children).map(textOf).join("");
}

/** Each paragraph's plain text, in order. Headings, quotes and the like are skipped. */
export function paragraphs(body: unknown): string[] {
  const root = (body as { root?: { children?: unknown } } | null | undefined)?.root;
  return nodes(root?.children)
    .filter((n) => n.type === "paragraph")
    .map(textOf)
    .filter((t) => t !== "");
}

/**
 * The first paragraph cut at `limit` characters, with an ellipsis.
 *
 * The ellipsis is unconditional and the cut is a plain slice: that is the rule
 * Highland's resource centre used, and the port keeps it so the copy matches.
 */
export function teaser(body: unknown, limit: number): string {
  const first = paragraphs(body)[0];
  return first === undefined ? "" : `${first.slice(0, limit)}…`;
}
