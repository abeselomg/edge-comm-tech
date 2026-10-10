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

export const BASE_RULES: Rule[] = [
  {
    pattern: /tier\s*(?:iii|3)\W{0,3}certified/i,
    message:
      'The content master allows "Tier III-aligned" and never "Tier III-certified". Edge has not certified a facility.',
  },
  {
    pattern: /\b(?:gold|silver|platinum|elite|premier)\s+partner\b/i,
    message:
      "Partnership tiers may not be published. Remove the tier and describe what the technology does instead.",
  },
  {
    pattern: /\bauthoriz(?:ed|sed)\s+(?:reseller|partner|distributor)\b/i,
    message:
      "Authorization status may not be published. It changes over time and is governed by each manufacturer's agreement.",
  },
  {
    pattern: /\bcertified\s+partner\b/i,
    message: "Certification tiers may not be published.",
  },
  {
    pattern: /\b(?:100%|fully|completely|totally)\s+secure\b/i,
    message:
      "Absolute security claims are forbidden. Describe the controls rather than promising an outcome.",
  },
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
