/*
 * The project-wide content rules, applied to what a visitor actually reads.
 *
 * These are the constraints that outlive any one page: no partnership tier,
 * authorization level, salary or benefit; "Tier III-aligned", never "-certified";
 * the 100% figure always carries its scope; project records say "security control
 * room", never "SOC"; four organisations appear nowhere; and no value leaks
 * through unrendered. The long tail of dynamic pages is exactly where one of these
 * slips in, because no happy-path test looks at it.
 *
 * Every rule is validated against the 51 approved Highland pages (the test
 * asserts they raise nothing), so a hit on the port is a real regression and not
 * a pattern that was merely too greedy.
 */
import { completionFigureUnqualified } from "../src/fields/validators.ts";

const RULES = [
  [/Tier\s+III[-\s]+certified/i, "claims Tier III certification (only \"Tier III-aligned\" is allowed)"],
  [/\bSOC\b/, "says SOC (project records say \"security control room\")"],
  [/\b(gold|silver|platinum|premier|elite)\s+(partner|reseller)\b/i, "publishes a partnership tier"],
  // A claim Edge makes about itself. "Approved by HPE or an authorized
  // distributor" in a reviewer note is a statement about a document's source.
  [
    /\b(?:we|edge[\w\s-]{0,40}?)\s+(?:are|is)\s+(?:an?\s+)?(?:\w+\s+)?authori[sz]ed\s+(?:reseller|distributor|partner|dealer)\b/i,
    "publishes an authorization level",
  ],
  [/\bpartner(ship)?\s+tier\b/i, "publishes a partnership tier"],
  [/\bsalar(y|ies)\b/i, "mentions salary"],
  [/\bbenefits?\s+package\b/i, "mentions a benefits package"],
  [/\bcompensation\b/i, "mentions compensation"],
  [/\bper\s+month\b/i, "states a monthly figure"],
  [/\bETB\s?\d/, "states an amount in birr"],
  [/Bonga|Haramaya|Mizan|Yekatit/i, "names a forbidden organisation"],
  [/\bundefined\b|\[object Object\]|\bnull\b/, "shows an unrendered value"],
];

/** The text a visitor reads: no head, scripts, styles, svg, comments or markup. */
export function readableText(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<head\b[^>]*>[\s\S]*?<\/head>/i, " ")
    .replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** Problems found on one page, as readable strings. Empty means clean. */
export function scanPage(page, html) {
  const text = readableText(html);
  const problems = [];
  for (const [pattern, what] of RULES) {
    const m = pattern.exec(text);
    if (!m) continue;
    const at = Math.max(0, m.index - 30);
    const label = /forbidden/.test(what) ? what.replace("names a forbidden organisation", "names a forbidden organisation") : what;
    problems.push(`${page}: ${label} — "…${text.slice(at, m.index + m[0].length + 30)}…"`);
  }
  if (completionFigureUnqualified(text)) {
    problems.push(`${page}: states the 100% completion figure without "against agreed project scope"`);
  }
  return problems;
}
