/*
 * Clock drift between Highland and the port.
 *
 * Highland is a static build, so each event page records the status the event
 * had on the day it was built. The CMS derives status from the dates (see
 * src/lib/events.ts). Once an event has run, the port is right and Highland is
 * stale: comparing the two sentence by sentence reports a "defect" that is the
 * clock doing its job.
 *
 * The checker recognises the drift only when the event's own dates say it has run
 * (parity-events.mjs), removes just the parts that legitimately differ -- the
 * registration panel, its meta line and the Status cell -- and compares everything
 * else as normal. The closed panel itself is held to positive assertions. A page
 * closed before its event has ended, or open after it has ended, is a defect and
 * is reported like any other difference.
 */

const CLOSED = "registration is closed";
const PANEL = '<section class="mt-16 rounded-3xl p-8"';

/** The dates say it has run; Highland shows it open; the site shows it closed. */
export function eventMoved(expectedHtml, actualHtml, hasRun) {
  return hasRun && !expectedHtml.includes(CLOSED) && actualHtml.includes(CLOSED);
}

function panelOf(html) {
  const start = html.indexOf(PANEL);
  if (start < 0) return "";
  const end = html.indexOf("</section>", start);
  return html.slice(start, end < 0 ? undefined : end);
}

/** What a closed event page must still offer, and must no longer offer. */
export function checkMovedEvent(page, actualHtml) {
  const problems = [];
  const panel = panelOf(actualHtml);
  if (!panel.includes("This event has already run")) {
    problems.push(`${page}: moved to past but does not say the event has run`);
  }
  if (/<form\b/i.test(actualHtml)) {
    problems.push(`${page}: moved to past but still shows a registration form`);
  }
  // The header links /subscribe on every page, so the link must be in the panel.
  if (!/href="\/subscribe"/.test(panel)) {
    problems.push(`${page}: the closed registration panel offers no subscribe link`);
  }
  return problems;
}

const META = /<p class="eg-rise mt-6">[\s\S]*?<\/p>/;

function stripPanel(html) {
  const start = html.indexOf(PANEL);
  if (start < 0) return html;
  const end = html.indexOf("</section>", start);
  return end < 0 ? html : html.slice(0, start) + html.slice(end + "</section>".length);
}

/**
 * Remove what legitimately differs between an upcoming event (Highland) and the
 * same event once run (the site), so the rest of the page can be compared.
 */
export function alignMovedEvent(expectedHtml, actualHtml) {
  const strip = (html) => stripPanel(html).replace(META, "");
  const expected = strip(expectedHtml).replace(/(Status<\/dt>\s*<dd[^>]*>\s*)Upcoming/, "$1Completed");
  return [expected, strip(actualHtml)];
}

/** The number in the Upcoming band, or 0 when the page says nothing is scheduled. */
export function upcomingCount(html) {
  const m = /Upcoming<\/h2>\s*<p[^>]*>\s*(\d+)\s+sessions?/i.exec(html);
  return m ? Number(m[1]) : 0;
}

/** After events ran, exactly those must have left Upcoming, into Already held, by name. */
export function checkMovedIndex(expectedHtml, actualHtml, movedTitles) {
  const problems = [];
  const want = upcomingCount(expectedHtml) - movedTitles.length;
  const have = upcomingCount(actualHtml);
  if (have !== want) {
    problems.push(
      `events: expected ${want} upcoming session(s) after ${movedTitles.length} moved to past, found ${have}`,
    );
  }
  const held = actualHtml.indexOf("Already held");
  if (held < 0) {
    problems.push("events: a session has moved to past but there is no Already held band");
    return problems;
  }
  const upcomingPart = actualHtml.slice(0, held);
  const heldPart = actualHtml.slice(held);
  for (const title of movedTitles) {
    if (!heldPart.includes(title)) problems.push(`events: "${title}" has run but is not under Already held`);
    if (upcomingPart.includes(title)) problems.push(`events: "${title}" has run but is still listed as upcoming`);
  }
  return problems;
}

/**
 * The resource centre's "Coming up" band must not still list an event that has
 * run. Only that band is inspected: the sections grid below it links to the
 * events index and is unaffected.
 */
export function checkMovedResources(actualHtml, movedRoutes) {
  const start = actualHtml.indexOf("Coming up");
  if (start < 0) return [];
  const end = actualHtml.indexOf("</section>", start);
  const band = actualHtml.slice(start, end < 0 ? undefined : end);
  return movedRoutes
    .filter((route) => band.includes(`href="${route}"`))
    .map((route) => `resources: "Coming up" still lists ${route}, which has run`);
}

/**
 * Remove the section holding the "Coming up" band, so the rest of the resource
 * centre can still be compared sentence by sentence while the band itself is
 * checked on its own terms (checkMovedResources).
 */
export function stripComingUp(html) {
  const at = html.indexOf("Coming up");
  if (at < 0) return html;
  const start = html.lastIndexOf("<section", at);
  const end = html.indexOf("</section>", at);
  if (start < 0 || end < 0) return html;
  return html.slice(0, start) + html.slice(end + "</section>".length);
}
