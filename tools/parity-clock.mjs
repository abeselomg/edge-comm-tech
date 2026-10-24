/*
 * Clock drift between Highland and the port.
 *
 * Highland is a static build, so each event page records the status the event
 * had on the day it was built. The CMS derives status from the dates (see
 * src/lib/events.ts). Once an event has run, the port is right and Highland is
 * stale: comparing the two sentence by sentence reports a "defect" that is the
 * clock doing its job.
 *
 * Rather than waive those pages, the checker recognises the drift, skips the text
 * comparison for just those pages, and holds the port to positive assertions
 * about what a closed event must look like. The reverse -- the site open where
 * Highland is closed -- is never drift and is reported like any other difference.
 */

const CLOSED = "registration is closed";

/** Highland shows the event open; the site shows it closed. */
export function eventMoved(expectedHtml, actualHtml) {
  return !expectedHtml.includes(CLOSED) && actualHtml.includes(CLOSED);
}

/** What a closed event page must still offer, and must no longer offer. */
export function checkMovedEvent(page, actualHtml) {
  const problems = [];
  if (!actualHtml.includes("This event has already run")) {
    problems.push(`${page}: moved to past but does not say the event has run`);
  }
  if (/<form\b/i.test(actualHtml)) {
    problems.push(`${page}: moved to past but still shows a registration form`);
  }
  if (!/href="\/subscribe"/.test(actualHtml)) {
    problems.push(`${page}: moved to past but offers no way to hear about the next session (subscribe link)`);
  }
  return problems;
}

/** The number in the Upcoming band, or 0 when the page says nothing is scheduled. */
export function upcomingCount(html) {
  const m = /Upcoming<\/h2>[\s\S]*?(\d+)\s+sessions?/i.exec(html);
  return m ? Number(m[1]) : 0;
}

/** After `moved` events ran, exactly that many must have left Upcoming, into Already held. */
export function checkMovedIndex(expectedHtml, actualHtml, moved) {
  const problems = [];
  const want = upcomingCount(expectedHtml) - moved;
  const have = upcomingCount(actualHtml);
  if (have !== want) {
    problems.push(`events: expected ${want} upcoming session(s) after ${moved} moved to past, found ${have}`);
  }
  if (!actualHtml.includes("Already held")) {
    problems.push("events: a session has moved to past but there is no Already held band");
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
