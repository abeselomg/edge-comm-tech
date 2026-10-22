import type { RichTextFieldValidation } from "payload";
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
    // `partners?` -- the plural is how these are actually written. A partner
    // CATEGORY is named in the plural by nature, so "Platinum Partners" as a
    // category label was the natural spelling and the one that slipped through.
    String.raw`\b(?:gold|silver|platinum|elite|premier){SEP}+partners?\b`,
    "Partnership tiers may not be published. Remove the tier and describe what the technology does instead.",
  ),
  rule(
    // Only a CLAIM about Edge, not a factual reference to someone else's
    // status. The rule's own message explains why it exists -- Edge's
    // authorization "changes over time and is governed by each manufacturer's
    // agreement" -- which is about Edge. Matching the bare phrase also caught
    // approved copy describing third parties: the Procurement service says
    // Edge will "Engage relevant manufacturers, authorized distributors, and
    // technology partners", which publishes no status of Edge's and was
    // refused. So the phrase now has to follow a determiner, a possessive, a
    // form of "to be", or "as" -- the shapes a claim takes.
    //
    // Blocks: "An authorised reseller of HPE", "Edge is an authorized
    // partner", "we are authorized resellers", "as an authorized distributor",
    // "our authorized partner".
    // Permits: "manufacturers, authorized distributors, and technology
    // partners", and "decisions remain subject to authorized human review".
    //
    // Residual, accepted: a bare hyphenated form with no determiner, such as a
    // slug "authorised-reseller", is not caught. The absence of any field for
    // authorization status remains the structural guard; this is the prose one.
    // The two lookbehinds carry the rest of the distinction. Preceded by a
    // coordinating conjunction or a comma, the phrase is an item in a list or
    // the object of a preposition, which means it refers to somebody else:
    // "documents supplied or approved by HPE or an authorized distributor" is
    // approved copy, and so is "manufacturers, authorized distributors, and
    // technology partners". The determiner alone refused both.
    String.raw`(?<!\b(?:or|and)\s)(?<!,\s)` +
      String.raw`\b(?:an?|the|our|its|their|your|as|is|are|was|were|am|be|been|becomes?|became|remains?|remained)` +
      String.raw`(?:{SEP}+(?:an?|the))?{SEP}+authori[sz]ed{SEP}+(?:reseller|partner|distributor)s?\b`,
    "Authorization status may not be published. It changes over time and is governed by each manufacturer's agreement.",
  ),
  rule(String.raw`\bcertified{SEP}+partners?\b`, "Certification tiers may not be published."),
  rule(
    String.raw`\b(?:100%|fully|completely|totally){SEP}+secure\b`,
    "Absolute security claims are forbidden. Describe the controls rather than promising an outcome.",
  ),
];

/*
 * The completion figure, in prose.
 *
 * requiresScopeQualifier already guards the impact counter, where the figure
 * and its line are separate fields -- and that counter is the only place the
 * approved content states the figure today. But the master makes the
 * qualifier mandatory wherever the figure appears, and an editor writing "we
 * have delivered 100% completion" into a solution body is writing it
 * somewhere that rule cannot see, because there is no sibling `figure` field
 * to key off.
 *
 * This is a predicate rather than a pattern because the rule is not
 * directional and a regex is. The first attempt looked only forward from the
 * figure, which let "Edge has completed 100% of its projects" through (the
 * claim word came first) and refused "Against agreed project scope, Edge
 * reports 100% completion" (the qualifier came first). Splitting into
 * sentences and asking three unordered questions of each is both correct and
 * easier to read than the regex that would do it.
 */
const COMPLETION_WORD =
  /\b(?:completion|completed|complete|delivery|delivered|success rate|on[- ]time)\b/i;
const FULL_FIGURE = /\b100\s*%/;
const SCOPE_QUALIFIER = /against agreed project scope/i;

export function completionFigureUnqualified(text: string): boolean {
  return text
    .split(/[.!?]+/)
    .some(
      (sentence) =>
        FULL_FIGURE.test(sentence) &&
        COMPLETION_WORD.test(sentence) &&
        !SCOPE_QUALIFIER.test(sentence),
    );
}

const COMPLETION_MESSAGE =
  'A 100% completion figure must carry "against agreed project scope" in the same sentence. The master requires the qualifier wherever the figure appears.';

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

/*
 * Node types that carry no content of their own. Anything else in a Lexical
 * tree -- an upload, a relationship, a list, a block -- means the field holds
 * something even when it yields no text.
 */
const STRUCTURAL_NODES = new Set(["root", "paragraph", "text", "linebreak", "tab"]);

/**
 * Does this field hold nothing an editor would recognise as content?
 *
 * Rich text needs the care here: a body containing only an uploaded diagram
 * yields no text at all, and calling that empty would refuse a legitimate
 * document. So emptiness is judged on the node tree, not on the extracted
 * string.
 */
function isBlank(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value !== "object") return false;

  if (extractText(value).trim().length > 0) return false;

  let hasContentNode = false;
  const walk = (node: unknown): void => {
    if (hasContentNode || !node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    const record = node as Record<string, unknown>;
    if (typeof record.type === "string" && !STRUCTURAL_NODES.has(record.type)) {
      hasContentNode = true;
      return;
    }
    if (record.root) walk(record.root);
    if (Array.isArray(record.children)) record.children.forEach(walk);
  };
  walk(value);
  return !hasContentNode;
}

/**
 * Field validator. Returns true, or the message of the first rule that fires.
 *
 * It also enforces `required`, which looks like someone else's job and is not.
 * Payload installs its default validator -- the one that checks `required` --
 * only when a field has no `validate` of its own:
 *
 *     // payload/dist/fields/config/sanitize.js
 *     if (typeof field.validate === 'undefined') { ... install default ... }
 *
 * So attaching this validator to a field SILENTLY DISABLES its `required`.
 * Before this was fixed, 63 fields across 11 collections carried both
 * `required: true` and this validator, and every one of them would have
 * accepted an empty value at publish: a solution with no title, an insight
 * with no body, a Read More link with no label. Payload passes the field's own
 * config into the options object (`{ ...field, ... }` at the call site in
 * beforeChange/promise.js), which is how `options.required` gets here.
 */
export function forbidsPhrases(rules: Rule[] = BASE_RULES) {
  return (value: unknown, options?: { required?: boolean }): true | string => {
    if (isBlank(value)) {
      return options?.required ? "This field is required." : true;
    }
    const text = extractText(value);
    if (!text.trim()) return true;
    for (const rule of rules) {
      if (rule.pattern.test(text)) return rule.message;
    }
    // Not a Rule, because it asks three unordered questions of each sentence
    // rather than matching one pattern. See completionFigureUnqualified.
    if (completionFigureUnqualified(text)) return COMPLETION_MESSAGE;
    return true;
  };
}

/** Media ids referenced by upload nodes anywhere in a Lexical tree. */
export function uploadedMediaIds(value: unknown): (string | number)[] {
  const ids: (string | number)[] = [];
  const walk = (node: unknown): void => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    const record = node as Record<string, unknown>;
    if (record.type === "upload" && record.relationTo === "media") {
      const raw = record.value;
      const id =
        raw && typeof raw === "object" ? (raw as Record<string, unknown>).id : raw;
      if (typeof id === "string" || typeof id === "number") ids.push(id);
    }
    if (record.root) walk(record.root);
    if (Array.isArray(record.children)) record.children.forEach(walk);
  };
  walk(value);
  return [...new Set(ids)];
}

/**
 * The rich-text counterpart to `forbidsPhrases`: the same phrase rules, plus a
 * check that every image embedded in the body is an approved asset.
 *
 * Every other path to an image is gated by `filterOptions`, which Payload
 * enforces on relationship and upload FIELDS. A Lexical body is neither: the
 * editor's upload feature picks from the whole media collection, and its
 * options (`enabledCollections`, per-collection node `fields`) offer no way to
 * narrow WHICH documents are offered. So the one place an editor would most
 * naturally drop a picture was the one place the provenance gate did not
 * reach.
 *
 * It fails OPEN when it cannot check -- no `req`, no payload instance -- rather
 * than blocking every save in a context that has neither. Payload always
 * supplies `req` on a real save, so in practice the check runs whenever it
 * matters.
 */
export function richTextGuard(rules: Rule[] = BASE_RULES): RichTextFieldValidation {
  const phrases = forbidsPhrases(rules);

  return async (value, options) => {
    const phraseResult = phrases(value, options);
    if (phraseResult !== true) return phraseResult;

    const ids = uploadedMediaIds(value);
    if (ids.length === 0) return true;

    const payload = options?.req?.payload;
    if (!payload) return true;

    const { docs } = await payload.find({
      collection: "media",
      where: { id: { in: ids } },
      limit: ids.length,
      depth: 0,
      overrideAccess: true,
      // Pass the request so the lookup joins the save's transaction. Without
      // it the read happens outside, and could answer from a snapshot that
      // does not match what is being written.
      req: options.req,
    });

    const unapproved = docs.filter((doc) => !doc.approved);
    if (unapproved.length === 0) return true;

    return `This body embeds ${unapproved.length === 1 ? "an image" : `${unapproved.length} images`} that ${unapproved.length === 1 ? "has" : "have"} not been approved for publication. Open each one in the Library, record where it came from and who checked it, then tick Approved.`;
  };
}

/**
 * The master requires the 100% completion figure to carry its qualifier
 * everywhere it appears. Applied to the impact counter's `line` field.
 *
 * A factory, like its siblings, and for a reason worth recording. This was
 * previously a bare `(value, siblingData)` function, and the plan wired it as
 * `validate: requiresScopeQualifier`. Payload passes `(value, options)`, where
 * the sibling data sits at `options.siblingData` -- so the function read
 * `figure` off the options object, found nothing, and PASSED EVERY VALUE. The
 * guard on a legal requirement was a no-op, and its unit tests did not catch it
 * because they called it with `{ figure }` directly, a shape Payload never
 * uses.
 *
 * Taking the whole options object the way `forbidsPhrases` does removes that
 * trap: there is no longer a second argument whose shape a caller can get
 * wrong. It also folds in the phrase rules and the required check, because a
 * custom `validate` replaces Payload's default and anything less would switch
 * `required` off on the field it is attached to.
 */
export function requiresScopeQualifier(rules: Rule[] = BASE_RULES) {
  const phrases = forbidsPhrases(rules);

  return (
    value: unknown,
    options?: { required?: boolean; siblingData?: { figure?: unknown } },
  ): true | string => {
    const base = phrases(value, options);
    if (base !== true) return base;

    const figure = options?.siblingData?.figure;
    if (typeof figure !== "string" || !figure.includes("%")) return true;
    if (/against agreed project scope/i.test(extractText(value))) return true;
    return 'A percentage completion figure must carry "against agreed project scope".';
  };
}
