/*
 * Does the HR role behave on the live server?
 *
 * An HTTP-only probe, run from a developer machine against BASE_URL, in the
 * style of tools/check-editorial-live.mjs (it reuses that file's client, cookie
 * jar and masking). Given an ADMIN account it:
 *
 *   1  creates a throwaway user with role `hr` over the REST API (the password is
 *      random, generated here, held in memory and never printed or stored)
 *   2  logs in as it
 *   3  asserts, over REST and /api/access, that HR
 *        - may read applications (CVs), open positions, E-Academy tracks and the
 *          careers form submissions, and create/update jobs and tracks
 *        - may edit the Careers global
 *        - sees ONLY careers forms among the form submissions
 *        - sees no unpublished (draft) solutions, sees only its own user record
 *        - is refused (403) when it writes solutions, media, users, forms,
 *          applications, submissions, jobs deletes, or any global but Careers
 *        - cannot change its own role, and cannot open /preview
 *        - can rename itself (its own account page works)
 *   4  deletes the user (by the admin session), even when a check throws
 *
 * Nothing but that one throwaway user is created, and nothing real is written:
 * every mutation that must be refused targets an id no row has or sends an
 * empty body, and access is evaluated first, so a 403 changes nothing.
 *
 * Usage (BASE_URL defaults to http://localhost:3000):
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... BASE_URL=https://168.119.61.125 \
 *     NODE_TLS_REJECT_UNAUTHORIZED=0 node --import tsx tools/check-hr-live.mjs
 *
 * Needs ADMIN_EMAIL and ADMIN_PASSWORD (never printed).
 */
import { randomBytes } from "node:crypto";
import { pathToFileURL } from "node:url";
import { ABSENT_ID, SESSION_COOKIE, allowed, createHttp, login, maskSecrets } from "./check-editorial-live.mjs";
import { MARKER } from "./forms-live-shared.mjs";

/** Titles of the forms HR may read (the same list as CAREERS_FORM_TITLES in src/access/index.ts). */
export const CAREERS_FORM_TITLES = ["E-Academy enquiry", "Job application", "Internship application"];

/** Collection operations /api/access must show as allowed for HR. */
export const HR_ALLOWED = [
  ["applications", "read"],
  ["jobs", "read"],
  ["jobs", "create"],
  ["jobs", "update"],
  ["academyTracks", "read"],
  ["academyTracks", "create"],
  ["academyTracks", "update"],
  ["form-submissions", "read"],
];

const CONTENT = ["solutions", "services", "clients", "projects", "events", "news", "posts", "postCategories", "partners", "partnerCategories", "downloads"];

/** Collection operations /api/access must show as refused for HR. */
export const HR_REFUSED = [
  ...CONTENT.flatMap((slug) => ["create", "update", "delete"].map((op) => [slug, op])),
  ...["create", "update", "delete"].flatMap((op) => ["media", "forms"].map((slug) => [slug, op])),
  ["users", "create"],
  ["users", "delete"],
  ["jobs", "delete"],
  ["academyTracks", "delete"],
  ...["create", "update", "delete"].flatMap((op) => ["applications", "form-submissions"].map((slug) => [slug, op])),
];

/** Globals HR may edit, and may not. */
export const HR_GLOBALS_ALLOWED = ["careers-content"];
export const HR_GLOBALS_REFUSED = ["company", "page-copy", "contact-details", "site-settings"];

/** null when /api/access matches the expectation for HR, else a message naming the differences. */
export function hrAccessProblems(access) {
  if (!access || typeof access !== "object") return "no access document in the /api/access response";
  const wrong = [];
  for (const [slug, op] of HR_ALLOWED) if (!allowed(access.collections?.[slug]?.[op])) wrong.push(`${slug}.${op} should be allowed`);
  for (const [slug, op] of HR_REFUSED) if (allowed(access.collections?.[slug]?.[op])) wrong.push(`${slug}.${op} should be refused`);
  for (const g of HR_GLOBALS_ALLOWED) if (!allowed(access.globals?.[g]?.update)) wrong.push(`globals.${g}.update should be allowed`);
  for (const g of HR_GLOBALS_REFUSED) if (allowed(access.globals?.[g]?.update)) wrong.push(`globals.${g}.update should be refused`);
  return wrong.length ? wrong.join("; ") : null;
}

/** null when every submission HR can see belongs to a careers form. */
export function submissionsProblem(res) {
  if (res.status !== 200) return `GET form-submissions: expected 200, got ${res.status}`;
  const docs = res.json?.docs;
  if (!Array.isArray(docs)) return "GET form-submissions returned no docs array";
  const other = docs.filter((d) => !CAREERS_FORM_TITLES.includes(d?.form?.title));
  return other.length ? `${other.length} submission(s) of a non-careers form are visible to HR` : null;
}

/** null when no draft is visible in a solutions listing (a 403 is fine too). */
export function draftsProblem(res) {
  if (res.status === 403) return null;
  if (res.status !== 200) return `GET solutions?draft=true: expected 200 or 403, got ${res.status}`;
  const drafts = (res.json?.docs ?? []).filter((d) => d?._status !== "published");
  return drafts.length ? `${drafts.length} unpublished solution(s) are visible to HR` : null;
}

export async function runHrProbe({ base, creds, fetchImpl, log = (_line) => {}, run = String(Date.now()) }) {
  // Random, in memory only; the aA1! suffix satisfies any complexity rule.
  const hrPassword = `${randomBytes(18).toString("hex")}aA1!`;
  const secrets = [creds.adminPassword, hrPassword];
  const out = (line) => log(maskSecrets(line, secrets));
  const http = createHttp({ base, fetchImpl });
  const results = [];
  const record = (name, problem) => {
    const ok = !problem;
    results.push({ name, ok, detail: problem ?? "ok" });
    out(ok ? `ok   ${name}` : `FAIL ${name}: ${problem}`);
    return ok;
  };
  const step = async (name, fn) => {
    try {
      return record(name, (await fn()) || null);
    } catch (error) {
      return record(name, `request failed: ${error.message}`);
    }
  };
  const expectStatus = (res, want, what) => {
    const wants = Array.isArray(want) ? want : [want];
    return wants.includes(res.status) ? null : `${what}: expected ${wants.join("/")}, got ${res.status}`;
  };

  let admin = null;
  let hr = null;
  let hrId = null;
  let leftover = false;
  const asAdmin = (method, path, json) => http(method, path, { cookie: admin.jar.header(), json });
  const asHr = (method, path, json, extra = {}) => http(method, path, { cookie: hr.jar.header(), json, ...extra });

  try {
    admin = await login(http, creds.adminEmail, creds.adminPassword);
    secrets.push(admin.jar.get(SESSION_COOKIE));

    const created = await asAdmin("POST", "/api/users", { email: `hr-probe-${run}@example.invalid`, password: hrPassword, name: MARKER, role: "hr" });
    hrId = created.json?.doc?.id ?? null;
    if (![200, 201].includes(created.status) || hrId === null) {
      record("hr-user-created", `admin POST /api/users: expected 201 with a doc id, got ${created.status}`);
      return { results, leftover: false };
    }
    record("hr-user-created", created.json?.doc?.role === "hr" ? null : `the user was created with role ${created.json?.doc?.role}`);

    hr = await login(http, `hr-probe-${run}@example.invalid`, hrPassword);
    secrets.push(hr.jar.get(SESSION_COOKIE));

    await step("hr-access-matches", async () => {
      const res = await asHr("GET", "/api/access");
      return expectStatus(res, 200, "hr GET /api/access") ?? hrAccessProblems(res.json);
    });

    for (const slug of ["applications", "jobs", "academyTracks"]) {
      await step(`hr-reads-${slug}`, async () => expectStatus(await asHr("GET", `/api/${slug}?limit=1&depth=0`), 200, `hr GET ${slug}`));
    }
    await step("hr-sees-careers-submissions-only", async () => submissionsProblem(await asHr("GET", "/api/form-submissions?limit=100&depth=1")));
    await step("hr-sees-no-solution-drafts", async () => draftsProblem(await asHr("GET", "/api/solutions?draft=true&limit=100&depth=0")));
    await step("hr-sees-only-own-user", async () => {
      const res = await asHr("GET", "/api/users?limit=100&depth=0");
      const bad = expectStatus(res, 200, "hr GET users");
      if (bad) return bad;
      const ids = (res.json?.docs ?? []).map((d) => d.id);
      return ids.length === 1 && ids[0] === hrId ? null : `hr sees ${ids.length} user record(s), expected only its own`;
    });

    // Writes that must be refused. Access runs before validation and lookup: an empty
    // body or an id no row has means a 403 proves "denied" and nothing real is touched.
    await step("hr-cannot-write-content", async () => {
      for (const slug of ["solutions", "news", "events", "posts"]) {
        const bad = expectStatus(await asHr("POST", `/api/${slug}`, {}), 403, `hr POST ${slug}`);
        if (bad) return bad;
      }
      return expectStatus(await asHr("PATCH", `/api/solutions/${ABSENT_ID}`, {}), 403, "hr PATCH solutions");
    });
    await step("hr-cannot-upload-media", async () => expectStatus(await asHr("POST", "/api/media", {}), 403, "hr POST media"));
    await step("hr-cannot-create-users", async () => expectStatus(await asHr("POST", "/api/users", { email: `hr-probe-extra-${run}@example.invalid`, password: hrPassword, name: MARKER, role: "hr" }), 403, "hr POST users"));
    await step("hr-cannot-touch-forms", async () => expectStatus(await asHr("PATCH", `/api/forms/${ABSENT_ID}`, {}), 403, "hr PATCH forms"));
    await step("hr-cannot-change-applications-or-submissions", async () => {
      for (const slug of ["applications", "form-submissions"]) {
        const del = expectStatus(await asHr("DELETE", `/api/${slug}/${ABSENT_ID}`), 403, `hr DELETE ${slug}`);
        if (del) return del;
        const upd = expectStatus(await asHr("PATCH", `/api/${slug}/${ABSENT_ID}`, {}), 403, `hr PATCH ${slug}`);
        if (upd) return upd;
      }
      return null;
    });
    await step("hr-cannot-delete-jobs", async () => expectStatus(await asHr("DELETE", `/api/jobs/${ABSENT_ID}`), 403, "hr DELETE jobs"));
    await step("hr-cannot-edit-other-globals", async () => {
      // Payload updates a global with POST; the empty body writes nothing.
      for (const g of HR_GLOBALS_REFUSED) {
        const bad = expectStatus(await asHr("POST", `/api/globals/${g}`, {}), 403, `hr POST ${g}`);
        if (bad) return bad;
      }
      return null;
    });

    // The account page: HR renames itself, but cannot promote itself.
    await step("hr-can-rename-itself", async () => expectStatus(await asHr("PATCH", `/api/users/${hrId}`, { name: `${MARKER} renamed` }), 200, "hr PATCH own name"));
    await step("hr-cannot-change-own-role", async () => {
      await asHr("PATCH", `/api/users/${hrId}`, { role: "admin" });
      const me = await asHr("GET", "/api/users/me");
      const role = me.json?.user?.role;
      if (role === "admin") {
        await asAdmin("PATCH", `/api/users/${hrId}`, { role: "hr" });
        return "HR became an admin by patching its own role (restored)";
      }
      return role === "hr" ? null : `unexpected role after the attempt: ${role}`;
    });
    await step("hr-cannot-preview-drafts", async () => expectStatus(await asHr("GET", "/preview?path=/", undefined, { redirect: "manual" }), 403, "hr GET /preview"));
  } finally {
    if (admin && hrId !== null) {
      try {
        await asAdmin("DELETE", `/api/users/${hrId}`);
        const gone = await asAdmin("GET", `/api/users/${hrId}?depth=0`);
        leftover = gone.status === 200;
      } catch {
        leftover = true;
      }
      if (leftover) out(`LEFT BEHIND (delete by hand in /admin, Users): hr-probe-${run}@example.invalid`);
    }
  }
  return { results, leftover };
}

export function readCreds(env) {
  const missing = ["ADMIN_EMAIL", "ADMIN_PASSWORD"].filter((n) => !env[n]);
  if (missing.length) throw new Error(`missing environment variable(s): ${missing.join(", ")} (names only; values are never printed). See the usage at the top of this file.`);
  return { adminEmail: env.ADMIN_EMAIL, adminPassword: env.ADMIN_PASSWORD };
}

async function main() {
  const creds = readCreds(process.env);
  const base = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const { results, leftover } = await runHrProbe({ base, creds, fetchImpl: fetch, log: (l) => console.log(l) });
  const failed = results.filter((r) => !r.ok);
  if (failed.length || leftover) {
    console.error(`FAIL: ${failed.length} of ${results.length} checks failed${leftover ? ", the throwaway HR user was left behind" : ""} (${base})`);
    process.exit(1);
  }
  console.log(`PASS: ${results.length} checks (${base}). The throwaway HR user was deleted.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`FAIL: ${maskSecrets(error.message, [process.env.ADMIN_PASSWORD])}`);
    process.exit(1);
  });
}
