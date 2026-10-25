/*
 * What the form probe and its server-side cleanup agree on: the marker that
 * labels every entry the probe writes, and how a stored submission is
 * recognised as the probe's. No heavy imports, because `payload run` loads the
 * cleanup script and this must work there as well as under vitest.
 */

/** Put in every free-text value the probe submits (and in the CV file name's slug). */
export const MARKER = "[automated test – ignore]";

/** True when any stored value of the submission carries the marker. */
export function isMarkedSubmission(submission) {
  const data = Array.isArray(submission?.submissionData) ? submission.submissionData : [];
  return data.some((row) => typeof row?.value === "string" && row.value.includes(MARKER));
}

/** The application (CV) document ids a submission references. */
export function uploadIdsOf(submission) {
  const ids = [];
  for (const group of Array.isArray(submission?.submissionUploads) ? submission.submissionUploads : []) {
    for (const item of Array.isArray(group?.value) ? group.value : []) {
      const id = typeof item?.value === "object" && item.value !== null ? item.value.id : item?.value;
      if (id !== undefined && id !== null) ids.push(id);
    }
  }
  return ids;
}

/**
 * Why the cleanup must not run in this environment, or null when it may.
 * Outside NODE_ENV=production, payload.config.ts turns Payload's dev schema
 * push on, and that push is interactive and can alter the database it is
 * pointed at. FORMS_CLEANUP_ALLOW_DEV=1 is for a throwaway local database.
 */
export function unsafeEnvironment(env) {
  if (env.NODE_ENV === "production" || env.FORMS_CLEANUP_ALLOW_DEV === "1") return null;
  return "Refusing to run: NODE_ENV is not production, so Payload would try its dev schema push against DATABASE_URI. Prefix the command with NODE_ENV=production (or set FORMS_CLEANUP_ALLOW_DEV=1 for a local scratch database).";
}
