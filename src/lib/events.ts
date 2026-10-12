/*
 * Event status is derived, never stored.
 *
 * A stored status goes stale silently the morning after an event: nobody gets
 * a notification, and the page keeps inviting registrations for a session that
 * has happened.
 *
 * It derives from the END of the range, not the start. Highland kept a single
 * `iso` per event, which is fine for a one-day webinar and wrong for GITEX:
 * that runs 7-11 December, and a start-date comparison marks it past on the
 * 8th while the team is still standing on the floor.
 *
 * Comparison is on whole UTC dates. Comparing timestamps would flip an event
 * to past at midnight UTC rather than at the end of its last day, and
 * comparing in local time would give different answers to a reader in Addis
 * Ababa and the build server.
 *
 * An end typed before the start is tolerated: the later date wins.
 *
 * A missing or unparseable date returns "upcoming" on purpose. The failure
 * mode of guessing wrong here is either an event nobody can find or an event
 * that looks live; the second is visible and gets fixed, the first does not.
 */

export type EventStatus = "upcoming" | "past";

/** Whole-day UTC ordinal, so time of day cannot affect the comparison. */
const dayNumber = (date: Date): number =>
  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000;

export function eventStatus(
  input: { startsOn?: string | null; endsOn?: string | null },
  now: Date = new Date(),
): EventStatus {
  const ends = [input.startsOn, input.endsOn]
    .map((raw) => (raw ? new Date(raw) : null))
    .filter((date): date is Date => date !== null && !Number.isNaN(date.getTime()));
  if (ends.length === 0) return "upcoming";

  // The later of the two dates, so an end typed before the start (a typo the
  // collection also rejects) cannot mark a running or future event past.
  const last = Math.max(...ends.map(dayNumber));
  return last < dayNumber(now) ? "past" : "upcoming";
}
