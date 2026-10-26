/*
 * Copy extraction and normalisation for check-parity.mjs, split out so the
 * rules that decide what counts as "the same copy" can be tested on their own.
 */

/* Marks the end of a form action button; see markFormBoundaries. */
const SUBMIT_BOUNDARY = "\u0002";
const BLOCK = "\u0001"; // marks where a tag stood, so words cannot fuse

/** Strip scripts, styles and tags; decode the entities Highland emits. */
export function visibleText(html) {
  return decode(
    html
      .replace(/<!--[\s\S]*?-->/g, " ")
      // <head> is not visible copy. Highland writes a full SEO title per page
      // and Next builds its own from metadata, so comparing them would report
      // a difference on all fourteen and say nothing useful.
      .replace(/<head\b[^>]*>[\s\S]*?<\/head>/i, " ")
      .replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
      /*
       * An image contributes its alt text, which is the whole point of alt
       * text. This also makes the two sides comparable where artwork exists
       * on one and not the other: Highland ships one client logo and three
       * partner marks as files, the CMS has no uploaded media yet, and Mark
       * therefore sets the institution's name in the frame instead. Both say
       * "Bahir Dar University"; only one says it as a picture.
       */
      .replace(/<img\b[^>]*\balt="([^"]*)"[^>]*>/gi, (_, alt) => ` ${alt} `)
      .replace(/<[^>]+>/g, BLOCK),
  )
    .replace(new RegExp(BLOCK, "g"), " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decode(s) {
  const named = {
    amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
    middot: "·", mdash: "—", ndash: "–", rarr: "→", larr: "←",
    copy: "©", hellip: "…", times: "×", rsquo: "’", lsquo: "‘",
    ldquo: "“", rdquo: "”", deg: "°", trade: "™", reg: "®",
  };
  return s
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => named[n.toLowerCase()] ?? m);
}

/**
 * Sentences, for comparison.
 *
 * Split on sentence enders and on the block boundaries left by tags, so a
 * heading and the paragraph after it are separate units. Short fragments are
 * dropped: they are nav labels, chips and single words, which the link and
 * heading checks already cover and which otherwise bury the signal.
 */
export function sentences(text) {
  return text
    .split(new RegExp(`(?<=[.!?])\\s+|\\s*${SUBMIT_BOUNDARY}\\s*`))
    .map((s) => s.trim())
    .filter((s) => s.length >= 25);
}

/*
 * Differences that are legitimate and would otherwise drown the signal.
 *
 * Each of these is a deliberate departure from Highland, not a tolerance for
 * sloppiness. Anything not listed here is reported, including a stray space
 * before a comma — that is reader-visible and was a real bug on the first
 * run of this checker.
 */
const DELIBERATE = [
  // An accessibility addition from Phase 3: Highland has no skip link.
  "Skip to content",
  // Highland's footer carried the review build's own marker. The CMS has an
  // optional field for an approved line in that slot and it is empty, so
  // nothing renders. See the footerNote note in SiteSettings.
  "Design review build",
  "content pending final approval",
  // Phase 4: /about links to the executive-management page, which Highland
  // generated and linked from nowhere.
  "See the executive management structure",
  // Phase 4: Highland's review-build form note. Highland carries it on every
  // page with a form, so it is stripped from the Highland side everywhere.
  "Form shown for layout review.",
  "Fields, validation, consent capture, secure upload and routing are built against the CMS at implementation.",
];

/*
 * Phase 6: every form on the site is live, so the CMS-era shell note ("This
 * form is not yet accepting submissions. Please email ... in the meantime.")
 * is waived nowhere. If it reappears it is reported as copy not in Highland.
 */

/*
 * Phrases Highland and the port both have, but worded differently on purpose.
 * Rewriting the Highland side rather than deleting it, so the sentence stays
 * comparable and only the known substitution is waived.
 *
 * The compact nav's call to action: Highland wrote "Contact" there and
 * "Contact us" on the desktop pill. Both now read the one headerCta field
 * from the CMS, because two labels from one field means an editor renaming
 * the button finds half of it unchanged.
 */
/*
 * Per-page waivers, narrower than SUBSTITUTIONS. The contact form's Inquiry
 * type omits "Careers" on purpose: applications go through the Careers
 * process, not the contact form.
 */
const PAGE_SUBSTITUTIONS = {
  contact: [[/(Training and E-Academy) Careers (General Inquiry)/g, "$1 $2"]],
};

const SUBSTITUTIONS = [
  [/About Contact\b(?! us)/g, "About Contact us"],
  // Task 7: the client and partner directories do not print a count of marks
  // still awaiting artwork; a directory should not apologise for what it is
  // waiting on.
  [/\d+ marks pending approved artwork/g, ""],
];

/* Links the port adds on purpose, per page. */
const ADDED_LINKS = { about: ["/about/executive-management"] };

export function normaliseNoise(s, page) {
  let out = s
    // Only the copyright year ticks over. A year anywhere else is content, and
    // normalising it would let a wrong "established 2019" pass.
    .replace(/(©\s*)(19|20)\d{2}\b/g, "$1<year>")
    .replace(/\?v=[\w.]+/g, ""); // Highland's cache-busting query strings
  for (const phrase of DELIBERATE) out = out.split(phrase).join("");
  for (const [from, to] of SUBSTITUTIONS) out = out.replace(from, to);
  for (const [from, to] of PAGE_SUBSTITUTIONS[page] ?? []) out = out.replace(from, to);
  out = out.replace(/\s+/g, " ").trim();
  // Stripping a deliberate phrase can leave behind the punctuation that
  // joined it to its sentence. "— ." is not a finding.
  return /[A-Za-z0-9]/.test(out) ? out : "";
}

/*
 * A form's action button ends the form. Highland's buttons are disabled
 * placeholders (type="button"); the live ones are type="submit". Either way,
 * what follows the button is a new block, not part of its label. Highland used
 * to get that boundary from the review-build form note, which ends in a full
 * stop; the live pages have no such note, so without this the label fuses with
 * the next block's first sentence. Applied to both sides.
 */
export function markFormBoundaries(html) {
  return html.replace(
    /(<button(?=\s)(?=[^>]*(?:type="submit"|\sdisabled(?=[\s>=])))[^>]*>[\s\S]*?<\/button>)/gi,
    `$1${SUBMIT_BOUNDARY}`,
  );
}

/*
 * Per-page regions and wording that the port replaced on purpose, applied to
 * the raw HTML before any comparison (copy, headings, links).
 *
 * partners: the hero diagram. Highland drew the ten capability groups on a
 * ring, each a filter label with an "N brands" count; the port draws the
 * partners themselves on three turning rings (PartnerRings, whose root is
 * marked data-parity="partner-rings"). Each side loses only its own diagram,
 * found by its exact opening tag, through the matching </div>. The intro
 * sentence that pointed at the old ring is rewritten on the Highland side
 * only, to the one approved new wording, so any other wording still fails.
 */
const PAGE_WAIVERS = {
  partners: {
    highland: {
      region: '<div class="relative mx-auto hidden aspect-square w-full max-w-[34rem] md:block">',
      rewrite: [
        "Select a capability group — on the ring or in the list below — to see the manufacturers and distributors Edge Comm-Tech works with in that area.",
        "Select a capability group in the list below to see the manufacturers and distributors Edge Comm-Tech works with in that area.",
      ],
    },
    port: { region: /<div\b[^>]*\bdata-parity="partner-rings"[^>]*>/ },
  },
};

/* The header's EN / አማ switch: Phase 8 addition, no counterpart in Highland. */
const LANG_TOGGLE = /<div\b[^>]*\bdata-parity="lang-toggle"[^>]*>/;

/** Cut the element whose opening tag is the first match of `open`, through its matching close. */
function cutElement(html, open, name) {
  const start = typeof open === "string" ? html.indexOf(open) : html.search(open);
  if (start < 0) return { rest: html, cut: "" };
  const tag = new RegExp(`<${name}\\b|</${name}>`, "gi");
  tag.lastIndex = start;
  let depth = 0;
  for (let m = tag.exec(html); m; m = tag.exec(html)) {
    depth += m[0].toLowerCase() === `</${name}>` ? -1 : 1;
    if (depth === 0) {
      const end = m.index + m[0].length;
      return { rest: `${html.slice(0, start)} ${html.slice(end)}`, cut: html.slice(start, end), start };
    }
  }
  throw new Error(`parity waiver: the waived region has no matching </${name}>`);
}

/** Remove the <div> whose opening tag is the first match of `open`, through its matching close. */
function stripDiv(html, open) {
  return cutElement(html, open, "div").rest;
}

/*
 * The home page, restructured at the owner's request on 2026-10-26. Applied to
 * the Highland side only: the port simply no longer renders these, so if any of
 * them reappears on the port it is reported as copy or a heading Highland has
 * in a different place, and nothing is waived on that side.
 *
 *   - the hero's secondary paragraph ("From enterprise networks ...")
 *   - the hero's "Talk to our experts" button (the hero has two buttons now)
 *   - the Industry expertise section (06)
 *   - the How we deliver section (09)
 *   - the Global technology ecosystem section moves up to sit directly after
 *     the technology-priorities section, before Projects. Copy is compared as
 *     a set, but headings are compared in order, so Highland's copy of the
 *     section is moved the same way rather than the order check being relaxed.
 *
 * The blue block that filled empty cells in the clients grid carries no copy
 * (it was the grid's background showing through), so it needs no waiver.
 * Each target is found by its exact opening text and nothing else is touched.
 */
const HOME_SECONDARY =
  /<p class="eg-rise mt-4 max-w-xl leading-relaxed text-ink\/65"[^>]*>\s*From enterprise networks and AI-ready infrastructure[\s\S]*?<\/p>/;
const HOME_TALK_BUTTON = /<a href="contact\.html" class="rounded-full border border-gold[^>]*>Talk to our experts<\/a>/;
const HOME_INDUSTRIES = /<section class="mx-auto max-w-6xl px-6 py-20">\s*<p[^>]*>Industry expertise<\/p>/;
const HOME_DELIVERY = /<section class="border-t border-rule">\s*<div[^>]*>\s*<p[^>]*>How we deliver<\/p>/;
const HOME_PARTNERS = '<section id="partners"';
const HOME_PROJECTS = /<section class="border-y border-rule bg-paper-2\/40">\s*<div[^>]*>\s*<div[^>]*>\s*<div>\s*<p[^>]*>Proven delivery<\/p>/;

function restructureHighlandHome(html) {
  let out = html.replace(HOME_SECONDARY, " ").replace(HOME_TALK_BUTTON, " ");
  out = cutElement(out, HOME_INDUSTRIES, "section").rest;
  out = cutElement(out, HOME_DELIVERY, "section").rest;
  const partners = cutElement(out, HOME_PARTNERS, "section");
  if (!partners.cut) return out;
  out = partners.rest;
  const at = out.search(HOME_PROJECTS);
  if (at < 0) return out;
  return `${out.slice(0, at)}${partners.cut}${out.slice(at)}`;
}

/**
 * @param {string} html
 * @param {string} page
 * @param {"highland" | "port"} side
 */
export function applyPageWaivers(html, page, side) {
  if (page === "index" && side === "highland") return restructureHighlandHome(html);
  /* The header's language toggle exists only on the port, on every page. Its
     whole <div> (marked data-parity="lang-toggle") is cut from the port side
     and nothing else is; a second one, or any other text, is still reported. */
  const port = side === "port" ? stripDiv(html, LANG_TOGGLE) : html;
  const w = PAGE_WAIVERS[page]?.[side];
  if (!w) return port;
  let out = stripDiv(port, w.region);
  if (w.rewrite) out = out.split(w.rewrite[0]).join(w.rewrite[1]);
  return out;
}

/** The comparable sentences of a page, normalised, in order, without duplicates. */
export function copySentences(html, page) {
  const text = visibleText(markFormBoundaries(html));
  return [...new Set(sentences(text).map((x) => normaliseNoise(x, page)))].filter(Boolean);
}
