/*
 * Does every internal link the site emits actually work?
 *
 * Fetches all 51 pages from BASE_URL, collects every internal href, and requests
 * each once. Fails on any non-200 and on any link to a Highland .html file.
 * Parity proves a link goes where Highland's went; this proves it lands.
 *
 * Usage: BASE_URL=https://168.119.61.125 NODE_TLS_REJECT_UNAUTHORIZED=0 \
 *        node tools/check-links-live.mjs
 */
import { routeFor } from "../src/lib/routes.ts";
import { pageList } from "./parity-pages.mjs";

const BASE_URL = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Internal link targets in a page, without fragments or query strings. */
export function internalLinks(html) {
  const out = new Set();
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(href)) continue;
    const target = href.split("#")[0].split("?")[0];
    if (!target || target.startsWith("/_next") || target.startsWith("/api/")) continue;
    out.add(target.replace(/\/$/, "") || "/");
  }
  return out;
}

async function status(path) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, { redirect: "manual" });
    return res.status;
  } catch (error) {
    return `unreachable (${error.message})`;
  }
}

const problems = [];
const seenFrom = new Map(); // link -> first page that emitted it

for (const page of pageList("all")) {
  const route = routeFor(`${page}.html`);
  let html;
  try {
    const res = await fetch(`${BASE_URL}${route}`);
    if (!res.ok) {
      problems.push(`${page}: ${route} returned HTTP ${res.status}`);
      continue;
    }
    html = await res.text();
  } catch (error) {
    problems.push(`${page}: could not fetch ${route} — ${error.message}`);
    continue;
  }
  for (const link of internalLinks(html)) {
    if (link.endsWith(".html")) problems.push(`${page}: links to the Highland file ${link}`);
    if (!seenFrom.has(link)) seenFrom.set(link, page);
  }
}

for (const [link, from] of seenFrom) {
  if (link.endsWith(".html")) continue;
  const code = await status(link);
  if (code !== 200) problems.push(`${from}: link ${link} answers ${code}`);
}

if (problems.length) {
  console.error(`FAIL — ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`PASS — ${seenFrom.size} distinct internal links across 51 pages all answer 200 (${BASE_URL})`);
