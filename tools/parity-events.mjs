/*
 * What Highland's events say about themselves, for the clock-drift check.
 *
 * "Has this event run?" must come from the event's own dates, through the same
 * eventStatus the site uses, and never from the page under test: otherwise a
 * regression that wrongly closes an upcoming event would be filed as drift.
 */
import { EVENTS } from "../design-src/highland/editorial.mjs";
import { eventDates } from "../src/seed/transform.ts";
import { eventStatus } from "../src/lib/events.ts";

/** @param {string} slug the event slug, without the `event-` prefix */
export function highlandEvent(slug) {
  const record = EVENTS.find((e) => e.slug === slug);
  if (!record) throw new Error(`Highland has no event "${slug}"`);
  const { startsOn, endsOn } = eventDates({ iso: record.iso, date: record.date });
  return {
    title: record.title,
    hasRun: (now = new Date()) => eventStatus({ startsOn, endsOn }, now) === "past",
  };
}
