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

const EXPECTED_NAV = ["About", "Partners", "Solutions", "Projects", "Academy", "Career", "Blog"];

const files = readdirSync(dir).filter((f) => f.endsWith(".html"));
const problems = [];

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
    }
  }

  // A fragment link that points at no id on this page is a dead link.
  const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/href="#([^"]+)"/g)) {
    if (!ids.has(m[1])) problems.push(`${f}: dead fragment "#${m[1]}"`);
  }

  // The desktop nav must carry all seven items.
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
console.log(`PASS — ${files.length} file(s), all links resolve, nav intact`);
