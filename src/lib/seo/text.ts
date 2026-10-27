/*
 * Plain-text helpers for titles and descriptions. Pure, and free of Next and
 * Payload imports so payload.config.ts can use them too.
 */

export const DESCRIPTION_LIMIT = 155;

/** Remove tags and character references, and collapse every run of whitespace. */
export function stripMarkup(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * A search-result description: markup stripped and at most `limit` characters,
 * cut at the end of a sentence when there is one in the back half, otherwise at
 * a word boundary with an ellipsis. Never cuts a word in two.
 */
export function trimDescription(input: unknown, limit = DESCRIPTION_LIMIT): string {
  const text = stripMarkup(input);
  if (text.length <= limit) return text;

  const window = text.slice(0, limit + 1);

  // The last full stop followed by a space (or the window's end) past the
  // halfway point: a whole sentence reads better than a clipped one.
  const sentenceEnd = window.lastIndexOf(". ", limit - 1);
  if (sentenceEnd >= limit / 2) return window.slice(0, sentenceEnd + 1).trim();

  const room = window.slice(0, limit - 1); // leave one character for the ellipsis
  const cut = room.lastIndexOf(" ");
  const base = (cut > 0 ? room.slice(0, cut) : room).replace(/[\s,;:–—-]+$/, "");
  return `${base}…`;
}
