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
