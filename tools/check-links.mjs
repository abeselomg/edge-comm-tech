/*
 * Structural checks over the emitted HTML. No browser, no dependencies.
 *
 * Catches the failure modes that actually happen on a hand-built static
 * site: a link to a page nobody wrote, a nav that lost an item, a page that
 * forgot its robots tag.
 */
import { readdirSync, readFileSync, existsSync } from "fs";
import path from "path";

const dir = process.argv[2];
if (!dir) throw new Error("usage: node check-links.mjs <dir>");

/* Mirrors NAV in design-src/highland/content.mjs. Kept as a literal on
   purpose: if someone reorders or drops a nav item, this list is what notices. */
const EXPECTED_NAV = [
  "Solutions", "Projects", "Clients", "Partners", "Resources", "Blog", "Careers", "About",
];

const files = readdirSync(dir).filter((f) => f.endsWith(".html"));
const problems = [];

/* Every page's ids, gathered up front. A link like blog.html -> that lets us
   check "solution-x.html#private-rag" the same way we check "#private-rag" --
   a cross-page fragment that points at nothing is just as broken, and it is
   the kind that survives review because nobody clicks all of them. */
const idsByFile = new Map(
  files.map((f) => [
    f,
    new Set([...readFileSync(path.join(dir, f), "utf8").matchAll(/id="([^"]+)"/g)].map((m) => m[1])),
  ]),
);

if (!files.includes("index.html")) problems.push("no index.html emitted");

for (const f of files) {
  const html = readFileSync(path.join(dir, f), "utf8");

  const robotsMatch = html.match(/<meta name="robots" content="([^"]*)"/);
  if (!robotsMatch || !robotsMatch[1].includes("noindex") || !robotsMatch[1].includes("nofollow")) {
    problems.push(`${f}: missing robots noindex, nofollow`);
  }

  // Every internal link must resolve to a file that exists.
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|#)/.test(href)) continue;
    const target = href.split("#")[0];
    if (!target) continue;
    if (!existsSync(path.join(dir, target))) {
      problems.push(`${f}: link to missing file "${target}"`);
      continue;
    }
    const frag = href.split("#")[1];
    if (frag && !idsByFile.get(target)?.has(frag)) {
      problems.push(`${f}: dead cross-page fragment "${target}#${frag}"`);
    }
  }

  // Images must point at files that exist, or the mark is an empty box.
  for (const m of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    const src = m[1];
    if (/^(https?:|data:)/.test(src)) continue;
    if (!existsSync(path.join(dir, src))) problems.push(`${f}: image missing "${src}"`);
  }

  // A fragment link that points at no id on this page is a dead link.
  const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/href="#([^"]+)"/g)) {
    if (!ids.has(m[1])) problems.push(`${f}: dead fragment "#${m[1]}"`);
  }

  // The desktop nav must carry every item, in order.
  const nav = html.match(/<nav class="hidden[^>]*>([\s\S]*?)<\/nav>/);
  if (!nav) {
    problems.push(`${f}: no desktop nav`);
  } else {
    for (const label of EXPECTED_NAV) {
      if (!nav[1].includes(`>${label}</a>`)) problems.push(`${f}: nav missing "${label}"`);
    }
    const navPositions = EXPECTED_NAV.map((label) => nav[1].indexOf(`>${label}</a>`));
    if (navPositions.every((p) => p !== -1)) {
      const inOrder = navPositions.every((p, i) => i === 0 || p > navPositions[i - 1]);
      if (!inOrder) problems.push(`${f}: nav items out of order`);
    }
  }

  // The Contact button must reach a real page, not a dead anchor.
  if (!html.includes('href="contact.html"')) {
    problems.push(`${f}: no link to contact.html`);
  }
}

if (problems.length) {
  console.error(`FAIL — ${problems.length} problem(s) in ${files.length} file(s):`);
  problems.forEach((p) => console.error("  " + p));
  process.exit(1);
}
console.log(`PASS — ${files.length} file(s), all links, fragments and images resolve, nav intact`);
