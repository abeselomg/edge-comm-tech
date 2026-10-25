/*
 * Server-side half of the form probe: counts form-submissions and removes the
 * ones check-forms-live.mjs wrote (those whose data contains the marker),
 * together with their CV files. The public HTTP interface cannot do either,
 * and no public endpoint is added for it, so this runs on the server through
 * the local API.
 *
 * `payload run` strips the script's arguments, so the mode is an environment
 * variable, like the seed's:
 *
 *   FORMS_CLEANUP_MODE=dry-run  (default) list what would be deleted; delete nothing
 *   FORMS_CLEANUP_MODE=count    only count
 *   FORMS_CLEANUP_MODE=delete   delete the marked submissions and their CVs
 *   FORMS_CLEANUP_OUT=/tmp/x.json  also write {"total":N,"marked":M} there
 *
 * Run from the app directory with the server's environment loaded:
 *   NODE_ENV=production npx payload run tools/forms-live-cleanup.mjs
 */
import { writeFileSync } from "node:fs";
import { getPayload } from "payload";
import config from "../src/payload.config";
import { isMarkedSubmission, MARKER, unsafeEnvironment, uploadIdsOf } from "./forms-live-shared.mjs";

const unsafe = unsafeEnvironment(process.env);
if (unsafe) {
  console.error(unsafe);
  process.exit(2);
}

const mode = process.env.FORMS_CLEANUP_MODE ?? "dry-run";
if (!["dry-run", "count", "delete"].includes(mode)) {
  console.error(`FORMS_CLEANUP_MODE must be dry-run, count or delete (got "${mode}").`);
  process.exit(2);
}

const payload = await getPayload({ config });
const all = [];
for (let page = 1; ; page += 1) {
  const res = await payload.find({
    collection: "form-submissions",
    page,
    limit: 100,
    depth: 0,
    overrideAccess: true,
    pagination: true,
  });
  all.push(...res.docs);
  if (!res.hasNextPage) break;
}
const marked = all.filter(isMarkedSubmission);
console.log(`form-submissions: ${all.length} total, ${marked.length} carrying the marker ${MARKER}`);
if (process.env.FORMS_CLEANUP_OUT) {
  writeFileSync(process.env.FORMS_CLEANUP_OUT, JSON.stringify({ total: all.length, marked: marked.length }));
}

if (mode === "delete") {
  for (const s of marked) {
    const uploads = uploadIdsOf(s);
    await payload.delete({ collection: "form-submissions", id: s.id, overrideAccess: true });
    for (const id of uploads) await payload.delete({ collection: "applications", id, overrideAccess: true });
    console.log(`deleted submission ${s.id}${uploads.length ? ` and ${uploads.length} CV file(s)` : ""}`);
  }
  console.log(`deleted ${marked.length} marked submission(s).`);
} else if (mode === "dry-run") {
  for (const s of marked) console.log(`would delete submission ${s.id} (${uploadIdsOf(s).length} CV file(s))`);
  console.log("dry run: nothing deleted. Re-run with FORMS_CLEANUP_MODE=delete to remove these.");
}
process.exit(0);
