/*
 * The content master forbids specific claims. The people editing this site
 * will not have read its 207 pages, so guidance in a field description is not
 * enough -- these block on save and name the rule they enforce.
 *
 * Two design notes worth keeping:
 *
 *   - Rich text is a Lexical node tree, not a string. A validator that only
 *     inspects strings passes "Tier III certified" straight through when it is
 *     typed into a rich-text field, which is where most prose lives.
 *     extractText flattens either shape.
 *
 *   - "SOC" is NOT a base rule. It is legitimate on the cybersecurity solution
 *     page; the master's rule is specifically that Bahir Dar's campus spaces
 *     are security control rooms. So it lives in PROJECT_RULES and applies
 *     only there. A guardrail that fires on correct copy gets switched off.
 */

export type Rule = { pattern: RegExp; message: string };

/*
 * Separator between the words of a forbidden phrase.
 *
 * Every rule below originally required whitespace here, which let the most
 * natural marketing spelling through untouched: "Tier-III-certified" and
 * "authorised-reseller" both passed while their spaced forms were blocked.
 * Hyphenating a compound modifier is normal English and arguably the likelier
 * way someone writes these, so whitespace alone was guarding the wrong half of
 * the problem.
 *
 * What this must NOT do is bridge a sentence boundary. An earlier version of
 * this class included the full stop, which made every rule match across two
 * sentences: "labelled fully. Secure racks follow" tripped the absolute-
 * security rule, and "limited to authorized. Partner institutions apply"
 * tripped the authorization rule. The editor then gets told off for a claim
 * they never made and cannot publish -- and as the note above says, a
 * guardrail that fires on correct copy gets switched off. So the class holds
 * joiners only, and excludes every character that can END a sentence: . ! ? ;
 * and :. The sole thing the full stop bought was "Tier.III.certified", the
 * least plausible spelling of the lot.
 *
 * Note what this also does NOT widen, because two earlier decisions depend on
 * it: "certified" still never matches "certification", and the authorization
 * rule still only covers reseller, partner and distributor. Edge's own
 * compliance disclaimers say it holds no certification and that decisions stay
 * "subject to authorized human review" -- a rule that blocks those is a bug,
 * not a stricter guardrail. See the disclaimer tests.
 */
const SEP = String.raw`[\s\-‐-―_/()"']`;

const rule = (source: string, message: string): Rule => ({
  pattern: new RegExp(source.replaceAll("{SEP}", SEP), "i"),
  message,
});

export const BASE_RULES: Rule[] = [
  rule(
    // Both gaps use the joiner class. The second one used to be `\W{0,3}`,
    // which had two bugs at once: `\W` is [^A-Za-z0-9_] so it EXCLUDED the
    // underscore and let "Tier_III_certified" through, while it INCLUDED the
    // full stop and blocked "The facility is Tier III. Certified engineers
    // maintain it." -- a sentence Edge could reasonably publish.
    String.raw`tier{SEP}*(?:iii|iv|3|4){SEP}{0,3}certified`,
    'The content master allows "Tier III-aligned" and never "Tier III-certified". Edge has not certified a facility.',
  ),
  rule(
    String.raw`\b(?:gold|silver|platinum|elite|premier){SEP}+partner\b`,
    "Partnership tiers may not be published. Remove the tier and describe what the technology does instead.",
  ),
  rule(
    String.raw`\bauthori[sz]ed{SEP}+(?:reseller|partner|distributor)\b`,
    "Authorization status may not be published. It changes over time and is governed by each manufacturer's agreement.",
  ),
  rule(String.raw`\bcertified{SEP}+partner\b`, "Certification tiers may not be published."),
  rule(
    String.raw`\b(?:100%|fully|completely|totally){SEP}+secure\b`,
    "Absolute security claims are forbidden. Describe the controls rather than promising an outcome.",
  ),
];

/** Base rules plus the project-only wording rule. */
export const PROJECT_RULES: Rule[] = [
  ...BASE_RULES,
  {
    pattern: /\bSOC\b/,
    message:
      'On project records the approved wording is "campus security control room", not "SOC".',
  },
];

/**
 * Flatten a field value to searchable text. Handles a plain string and a
 * Lexical editor state; anything else contributes nothing.
 */
export function extractText(value: unknown): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";

  const parts: string[] = [];
  const walk = (node: unknown): void => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    const record = node as Record<string, unknown>;
    if (typeof record.text === "string") parts.push(record.text);
    if (record.root) walk(record.root);
    if (Array.isArray(record.children)) record.children.forEach(walk);
  };

  walk(value);
  return parts.join(" ");
}

/**
 * Field validator. Returns true, or the message of the first rule that fires.
 * Empty values pass: whether a field is required is the field's own business.
 */
export function forbidsPhrases(rules: Rule[] = BASE_RULES) {
  return (value: unknown): true | string => {
    const text = extractText(value);
    if (!text.trim()) return true;
    for (const rule of rules) {
      if (rule.pattern.test(text)) return rule.message;
    }
    return true;
  };
}

/**
 * The master requires the 100% completion figure to carry its qualifier
 * everywhere it appears. Applied to the impact counter's `line` field.
 */
export function requiresScopeQualifier(
  value: unknown,
  siblingData: { figure?: string | null },
): true | string {
  const figure = siblingData?.figure ?? "";
  if (!figure.includes("%")) return true;
  if (/against agreed project scope/i.test(extractText(value))) return true;
  return 'A percentage completion figure must carry "against agreed project scope".';
}
