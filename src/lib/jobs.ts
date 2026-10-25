import type { Job } from "@/payload-types";
import { eventStatus } from "./events";

/*
 * A job takes applications until its confirmed deadline has passed, compared
 * on whole UTC days like event status. An open-ended deadline (pending, empty,
 * or not a date) stays open: the page shows it as unconfirmed, and refusing
 * applications there would close a role nobody meant to close.
 */
export function jobOpen(job: Pick<Job, "deadline">, now = new Date()): boolean {
  const { status, value } = job.deadline ?? {};
  if (status !== "confirmed" || !value) return true;
  return eventStatus({ startsOn: value }, now) === "upcoming";
}
