/*
 * Does a rendered route say the same things as the Highland page it ports?
 *
 * The spec's done-when for Phase 4 is "parity check passes per page", and the
 * two existing checkers cannot answer it: check-links.mjs and
 * check-render.mjs both take a directory of static HTML and have no idea a
 * Next app exists.
 *
 * This compares CONTENT, not pixels. The theme is already ported and shared,
 * so a styling difference is not what this is for; a dropped section, a
 * sentence that changed, or a link to a route nobody built is. Three things
 * are compared:
 *
 *   - the visible sentences, so copy cannot quietly change or go missing
 *   - the h1/h2/h3 text in order, so a section cannot vanish or move
 *   - the internal link targets, with Highland's mapped through routeFor
 *
 * No browser and no dependencies, for the same reason check-links.mjs has
 * none: a checker that needs a driver gets skipped.
 *
 * Usage:
 *   node tools/check-parity.mjs                 # the fourteen static pages
 *   node tools/check-parity.mjs --dynamic       # the 37 dynamic pages
 *   node tools/check-parity.mjs --all           # all 51
 *   node tools/check-parity.mjs about clients   # named pages
 *   BASE_URL=https://168.119.61.125 node tools/check-parity.mjs
 *   node tools/check-parity.mjs contact --allow-form-diff
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { isKnownRoute, routeFor } from "../src/lib/routes.ts";
import { pageList } from "./parity-pages.mjs";
import {
  alignMovedEvent,
  checkMovedEvent,
  checkMovedIndex,
  checkMovedResources,
  eventMoved,
  stripComingUp,
} from "./parity-clock.mjs";
import { highlandEvent } from "./parity-events.mjs";
import { scanPage } from "./content-scan.mjs";
import { applyPageWaivers, copySentences, normaliseNoise, visibleText } from "./parity-copy.mjs";

const HIGHLAND = "design-files/highland";
const BASE_URL = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

const args = process.argv.slice(2);
const allowFormDiff = args.includes("--allow-form-diff");
/*
 * --self compares a Highland page with itself instead of with a route.
 *
 * A checker that passes because it reports nothing is useless, and one that
 * reports noise on an identical pair buries the real findings among the
 * false ones. This is how the extractors and the normaliser are shown to be
 * deterministic before any page is judged by them.
 */
const selfCheck = args.includes("--self");
const named = args.filter((a) => !a.startsWith("--"));
const scope = args.includes("--all") ? "all" : args.includes("--dynamic") ? "dynamic" : "static";
const pages = named.length ? named : pageList(scope);

/* ------------------------------------------------------------ extraction */



function headings(html) {
  return [...html.matchAll(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map(
    (m) => `h${m[1]}: ${visibleText(m[2])}`,
  );
}

/** Internal link targets, normalised to routes. External links are ignored. */
function links(html, { fromHighland }) {
  const out = new Set();
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(href)) continue;
    const target = href.split("#")[0].split("?")[0];
    if (!target) continue;
    if (fromHighland) {
      if (!target.endsWith(".html")) continue;
      try {
        out.add(routeFor(target));
      } catch {
        out.add(`UNMAPPED:${target}`);
      }
    } else {
      // Next's own asset and API paths are not page links.
      if (target.startsWith("/_next") || target.startsWith("/api/")) continue;
      out.add(target.replace(/\/$/, "") || "/");
    }
  }
  return out;
}


/* Links the port adds on purpose, per page. */
const ADDED_LINKS = { about: ["/about/executive-management"] };

/** How many leading characters two strings share. */
function commonPrefix(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
  return i;
}

const FORM_TAG = /<(input|textarea|select|button)\b/i;

/* ---------------------------------------------------------------- compare */

const problems = [];
const notes = [];

/*
 * Events that have run since Highland was built (see parity-clock.mjs). Found in
 * a pre-pass over every event page, because the events index needs to know how
 * many moved even when only the index was asked for.
 */
const movedEvents = new Map(); // page -> title, for events whose dates say they have run
if (!selfCheck && pages.some((p) => p === "events" || p === "resources" || p.startsWith("event-"))) {
  for (const page of pageList("all").filter((p) => p.startsWith("event-"))) {
    try {
      const res = await fetch(`${BASE_URL}${routeFor(`${page}.html`)}`, { redirect: "follow" });
      if (!res.ok) continue;
      const expected = readFileSync(path.join(HIGHLAND, `${page}.html`), "utf8");
      const text = await res.text();
      const info = highlandEvent(page.slice("event-".length));
      const hasRun = info.hasRun();
      if (eventMoved(expected, text, hasRun)) movedEvents.set(page, info.title);
      else if (hasRun && !text.includes("registration is closed")) {
        // Stale the other way: the dates say it ended and the page still invites sign-up.
        problems.push(`${page}: the event has ended but the page still shows registration open`);
      }
    } catch {
      // A failed fetch is reported by the main loop; the pre-pass only finds drift.
    }
  }
}
let checked = 0;

for (const page of pages) {
  const file = `${page}.html`;
  const highlandPath = path.join(HIGHLAND, file);
  if (!existsSync(highlandPath)) {
    problems.push(`${page}: no Highland page at ${highlandPath}`);
    continue;
  }

  let route;
  try {
    route = routeFor(file);
  } catch (error) {
    problems.push(`${page}: ${error.message}`);
    continue;
  }

  let expected = readFileSync(highlandPath, "utf8");
  let actual;
  if (selfCheck) {
    actual = expected;
    checked += 1;
  } else {
    try {
      const res = await fetch(`${BASE_URL}${route}`, { redirect: "follow" });
      if (!res.ok) {
        problems.push(`${page}: ${BASE_URL}${route} returned HTTP ${res.status}`);
        continue;
      }
      actual = await res.text();
    } catch (error) {
      problems.push(`${page}: could not fetch ${BASE_URL}${route} — ${error.message}`);
      continue;
    }
    checked += 1;
  }

  /* The project-wide content rules, on whatever the site actually renders. */
  if (!selfCheck) problems.push(...scanPage(page, actual));

  /* Clock drift: an event has run since Highland was built. */
  if (!selfCheck && movedEvents.has(page)) {
    problems.push(...checkMovedEvent(page, actual));
    notes.push(`${page}: event has run since Highland was built; its registration panel is checked as a closed one and the rest of the page compared`);
    [expected, actual] = alignMovedEvent(expected, actual);
  }
  if (!selfCheck && page === "resources" && movedEvents.size) {
    const routes = [...movedEvents.keys()].map((e) => routeFor(`${e}.html`));
    problems.push(...checkMovedResources(actual, routes));
    notes.push("resources: an event in Highland's Coming up band has run; that band is checked on its own and the rest of the page compared");
    expected = stripComingUp(expected);
    actual = stripComingUp(actual);
  }
  if (!selfCheck && page === "events" && movedEvents.size) {
    problems.push(...checkMovedIndex(expected, actual, [...movedEvents.values()]));
    notes.push(`events: ${movedEvents.size} session(s) have run since Highland was built; checked structurally`);
    continue;
  }


  /* Deliberate, page-specific replacements (see PAGE_WAIVERS). In --self
     mode both sides are Highland, so both get Highland's waiver. */
  expected = applyPageWaivers(expected, page, "highland");
  actual = applyPageWaivers(actual, page, selfCheck ? "highland" : "port");

  /* Copy. Reported in both directions: a missing sentence is a dropped
     section, and an unexpected one is usually copy invented to fill a gap. */
  const want = copySentences(expected, page);
  const have = copySentences(actual, page);
  const wantSet = new Set(want);
  const haveSet = new Set(have);
  const missingCopy = want.filter((s) => !haveSet.has(s));
  const extraCopy = have.filter((s) => !wantSet.has(s));
  const paired = new Set();

  for (const s of missingCopy) {
    /*
     * A long run that differs in one place reports as two near-identical
     * lines, both truncated before the difference — which is the least
     * useful thing a checker can say. Pair each missing sentence with its
     * closest counterpart and point at the first character that differs.
     */
    const near = extraCopy
      .filter((e) => !paired.has(e))
      .map((e) => ({ e, shared: commonPrefix(s, e) }))
      .sort((a, b) => b.shared - a.shared)[0];
    if (near && near.shared > 40) {
      paired.add(near.e);
      const at = near.shared;
      problems.push(
        `${page}: copy differs at character ${at}\n` +
          `      …${s.slice(Math.max(0, at - 45), at)}[HIGHLAND: ${s.slice(at, at + 45)}…]\n` +
          `      …${near.e.slice(Math.max(0, at - 45), at)}[RENDERED: ${near.e.slice(at, at + 45)}…]`,
      );
    } else {
      problems.push(`${page}: missing copy — "${s.slice(0, 110)}"`);
    }
  }
  for (const s of extraCopy) {
    if (!paired.has(s)) problems.push(`${page}: copy not in Highland — "${s.slice(0, 110)}"`);
  }

  /* Headings, in order. */
  const wantH = headings(expected).map((x) => normaliseNoise(x, page));
  const haveH = headings(actual).map((x) => normaliseNoise(x, page));
  if (wantH.join(" | ") !== haveH.join(" | ")) {
    const missing = wantH.filter((h) => !haveH.includes(h));
    const extra = haveH.filter((h) => !wantH.includes(h));
    for (const h of missing) problems.push(`${page}: missing heading — ${h.slice(0, 90)}`);
    for (const h of extra) problems.push(`${page}: heading not in Highland — ${h.slice(0, 90)}`);
    if (!missing.length && !extra.length) {
      problems.push(`${page}: headings are the same but out of order`);
    }
  }

  /* Links. */
  const wantL = links(expected, { fromHighland: true });
  // In --self mode both sides are the Highland file, whose links are flat
  // .html; comparing mapped routes against raw filenames would differ by
  // design and say nothing about the extractors.
  const haveL = selfCheck ? wantL : links(actual, { fromHighland: false });
  for (const l of wantL) {
    if (l.startsWith("UNMAPPED:")) {
      problems.push(`${page}: Highland links ${l.slice(9)}, which routeFor does not map`);
    } else if (!haveL.has(l)) {
      problems.push(`${page}: missing link to ${l}`);
    }
  }
  for (const l of haveL) {
    /*
     * Whatever the comparison below says, a rendered link must be a route the
     * route map knows and never a Highland filename. This is what keeps a
     * hand-built path from shipping as a working-looking dead link.
     */
    if (!selfCheck && /\.html$/.test(l)) problems.push(`${page}: links to the Highland file ${l}`);
    else if (!selfCheck && !isKnownRoute(l)) problems.push(`${page}: links to ${l}, which routeFor does not know`);
    if (ADDED_LINKS[page]?.includes(l)) continue;
    if (!wantL.has(l)) problems.push(`${page}: links to ${l}, which Highland does not`);
  }

  /* Form controls: present on both sides (live on every form page). */
  if (!allowFormDiff && FORM_TAG.test(expected) !== FORM_TAG.test(actual)) {
    problems.push(
      `${page}: one side has form controls and the other does not ` +
        "(pass --allow-form-diff if that is expected)",
    );
  }
}

if (!checked && !problems.length) {
  console.error("checked nothing — was a page name misspelled?");
  process.exit(1);
}

if (problems.length) {
  console.error(`FAIL — ${problems.length} difference(s) across ${checked} page(s):`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}

for (const n of notes) console.log(`NOTE — ${n}`);
console.log(`PASS — ${checked} page(s) match their Highland originals (${BASE_URL})`);
