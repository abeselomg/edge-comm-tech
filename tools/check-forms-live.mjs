/*
 * Do the six public forms behave on the live server?
 *
 * For each form this posts to POST /forms/<slug> and checks, over plain HTTP:
 *   - a valid entry, free text marked "[automated test – ignore]"  -> 200
 *     (the two application forms do it twice: a tiny PDF and a DOCX-shaped zip
 *     under the field `cv`)
 *   - the same entry with one required field removed               -> 422
 *   - the honeypot field `website_url` filled                      -> the normal 200
 *   - a rapid burst from one client                                -> 429 with Retry-After
 * and, once for the site, that anonymous requests to /api/form-submissions and
 * /api/applications are refused (401/403).
 *
 * WHAT HTTP ALONE CANNOT PROVE, and this script does not pretend to:
 *   - that the honeypot, 422 and 429 requests stored nothing, and that each valid
 *     one was stored once. The public interface exposes no submission count (and
 *     none is added). Count on the server before and after, with
 *     tools/forms-live-cleanup.mjs, then compare with --expect-count-file below.
 *   - that a stored CV is unreadable anonymously. The response never exposes a
 *     file URL, so the only anonymous fetch possible is a guess at the stored
 *     name; a 401/403 for it is reported, a 404 is reported as inconclusive.
 *     The authoritative check is server-side through the local API.
 *   - emailStatus ("sent" / "failed" / "skipped"). It is stored on the
 *     submission, never returned. Read it on the server.
 *   - removing the test entries. That is forms-live-cleanup.mjs, run on the server.
 *
 * Usage:
 *   BASE_URL=https://168.119.61.125 NODE_TLS_REJECT_UNAUTHORIZED=0 \
 *     node --import tsx tools/check-forms-live.mjs --event-slug <upcoming-event> --job-slug <open-job>
 *
 *   --event-slug / --job-slug   an upcoming event and an open job on the server (or
 *                               EVENT_SLUG / JOB_SLUG); the server rejects a
 *                               registration or application without them
 *   --rate-max N                the server's FORM_RATE_MAX (default 5)
 *   --only a,b                  run just these form keys
 *   --expect-count-file F --actual-count-file G
 *                               no network: F is the count file written before the run,
 *                               G the one written after (see forms-live-cleanup.mjs);
 *                               checks the difference equals the valid posts accepted
 *
 * The limiter keys on the client address the proxy saw (guard.ts clientKey). Behind
 * nginx with TRUSTED_PROXY_HOPS=1 that is this machine's real address, whatever
 * X-Forwarded-For says, so the burst shares its bucket with the earlier posts of the
 * same form; each form has its own bucket, so forms never poison each other. Against
 * the app directly (no proxy) the header IS the key, and a distinct address per form
 * is sent. A rerun inside FORM_RATE_WINDOW_SEC finds the bucket still full and says so.
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { FORM_DEFINITIONS } from "../src/lib/forms/definitions.ts";
import { HONEYPOT_FIELD } from "../src/lib/forms/constants.ts";
import { CONTEXT_FIELDS } from "../src/lib/forms/validate.ts";
import { MARKER } from "./forms-live-shared.mjs";

const APPLICATION_FORMS = (key) => FORM_DEFINITIONS[key].fields.some((f) => f.type === "upload");
const PLACEHOLDER = /^select\b/i;

/* ----------------------------------------------------------- sample data */

function sampleValue(field, ctx) {
  const max = field.maxLength ?? 500;
  switch (field.type) {
    case "email":
      return "automated-test-ignore@example.com";
    case "tel":
      return "+251 11 000 0000";
    case "url":
      return "https://example.com/automated-test-ignore";
    case "select":
      return (field.options ?? []).find((o) => !PLACEHOLDER.test(o.trim())) ?? "";
    case "checkbox":
    case "upload":
      return undefined;
    default:
      // A text field whose cap is shorter than the marker still gets a valid value;
      // the marker is in the others, so the cleanup still finds the submission.
      return MARKER.length <= max ? MARKER : "2026";
  }
}

/** [name, value] pairs of a valid entry (no files, no honeypot), in field order. */
export function validFields(key, ctx) {
  const out = [];
  for (const field of FORM_DEFINITIONS[key].fields) {
    const value = sampleValue(field, ctx);
    if (value !== undefined && value !== "") out.push([field.name, value]);
  }
  if (key === "subscribe") out.push(["sendInsights", "on"]);
  const contextField = CONTEXT_FIELDS[key];
  if (contextField) out.push([contextField, contextField === "event" ? ctx.eventSlug : ctx.jobSlug]);
  out.push(["consent", "on"]);
  return out;
}

/* -------------------------------------------------------------- the files */

export function tinyPdf() {
  const text =
    "%PDF-1.4\n" +
    "1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n" +
    "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n" +
    "3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj\n" +
    "trailer<</Root 1 0 R/Size 4>>\n%%EOF\n";
  return new TextEncoder().encode(text);
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();
function crc32(bytes) {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** A small, uncompressed zip with the three parts of a minimal .docx. */
export function tinyDocx() {
  const enc = new TextEncoder();
  const entries = [
    [
      "[Content_Types].xml",
      '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',
    ],
    [
      "_rels/.rels",
      '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
    ],
    [
      "word/document.xml",
      `<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>${MARKER}</w:t></w:r></w:p></w:body></w:document>`,
    ],
  ].map(([name, content]) => ({ name: enc.encode(name), data: enc.encode(content) }));

  const u16 = (n) => [n & 0xff, (n >>> 8) & 0xff];
  const u32 = (n) => [n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff];
  const local = [];
  const central = [];
  let offset = 0;
  for (const { name, data } of entries) {
    const crc = crc32(data);
    const header = [
      ...u32(0x04034b50), ...u16(20), ...u16(0), ...u16(0), ...u16(0), ...u16(0x21),
      ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(name.length), ...u16(0),
    ];
    local.push(...header, ...name, ...data);
    central.push(
      ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0), ...u16(0), ...u16(0), ...u16(0x21),
      ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(name.length),
      ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(offset), ...name,
    );
    offset += header.length + name.length + data.length;
  }
  const end = [
    ...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(entries.length), ...u16(entries.length),
    ...u32(central.length), ...u32(offset), ...u16(0),
  ];
  return Uint8Array.from([...local, ...central, ...end]);
}

/* ------------------------------------------------------------ the requests */

const DOCX_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const CV_BASE = "automated-test-ignore-cv";

/**
 * The request for one probe kind: valid | missing | honeypot | cv-pdf | cv-docx.
 * Returns { form, removed } where `removed` names the dropped field for "missing".
 */
export function buildRequest(key, kind, ctx) {
  const fields = validFields(key, ctx);
  let removed;
  if (kind === "missing") {
    const required = FORM_DEFINITIONS[key].fields.find((f) => f.required && f.type !== "upload");
    removed = required.name;
  }
  const form = new FormData();
  for (const [name, value] of fields) if (name !== removed) form.append(name, value);
  if (kind === "honeypot") form.append(HONEYPOT_FIELD, "https://spam.example/automated-test");

  const attach = kind === "cv-pdf" ? "pdf" : kind === "cv-docx" ? "docx" : kind === "missing" && APPLICATION_FORMS(key) ? "pdf" : null;
  if (attach === "pdf") form.append("cv", new Blob([tinyPdf()], { type: "application/pdf" }), `${CV_BASE}.pdf`);
  if (attach === "docx") form.append("cv", new Blob([tinyDocx()], { type: DOCX_TYPE }), `${CV_BASE}.docx`);
  return { form, removed };
}

/* ------------------------------------------------------------ the verdicts */

const retryAfter = (res) => Number(res.headers["retry-after"]);

/**
 * null when the answer is the expected one, otherwise what was wrong.
 * kind: valid | missing | honeypot | limit.
 */
export function judge(kind, res, removed) {
  if (kind === "limit") {
    if (res.status !== 429) return `expected 429, got ${res.status}`;
    const wait = retryAfter(res);
    return Number.isInteger(wait) && wait >= 1 ? null : `429 without a usable Retry-After header (got "${res.headers["retry-after"] ?? ""}")`;
  }
  if (res.status === 429) {
    return `already rate limited before this probe (Retry-After ${res.headers["retry-after"] ?? "?"}s): this client's bucket was filled by an earlier run; wait it out or raise FORM_RATE_MAX`;
  }
  if (kind === "valid") return res.status === 200 && res.body?.ok === true ? null : `expected 200 {ok:true}, got ${res.status} ${JSON.stringify(res.body)}`;
  if (kind === "honeypot") return res.status === 200 ? null : `the honeypot must get the normal 200, got ${res.status}`;
  if (kind === "missing") {
    if (res.status !== 422) return `expected 422, got ${res.status}`;
    return res.body?.errors && removed in res.body.errors ? null : `422 did not name the missing field ${removed}: ${JSON.stringify(res.body)}`;
  }
  return `unknown probe kind ${kind}`;
}

async function post(fetchImpl, base, key, form, ip) {
  const res = await fetchImpl(`${base}/forms/${key}`, { method: "POST", body: form, headers: { "x-forwarded-for": ip } });
  let body = null;
  try {
    body = await res.json();
  } catch {
    // a non-JSON answer is judged on its status alone
  }
  return { status: res.status, body, headers: { "retry-after": res.headers.get("retry-after") ?? undefined } };
}

/** Number of stored submissions a clean run must add: one per accepted valid post. */
export function expectedStored(keys) {
  return keys.reduce((n, key) => n + (APPLICATION_FORMS(key) ? 2 : 1), 0);
}

/** null when the server-side counts moved by exactly `expected`. */
export function compareCounts(before, after, expected) {
  if (!Number.isInteger(before?.total) || !Number.isInteger(after?.total)) {
    return 'a count file must hold {"total": <integer>} (written by forms-live-cleanup.mjs)';
  }
  const delta = after.total - before.total;
  return delta === expected
    ? null
    : `form-submissions grew by ${delta}, expected ${expected} (one per accepted valid post; honeypot, 422 and 429 requests must store nothing)`;
}

/** Run every probe for one form. Never throws: a network failure is a failed check. */
export async function runForm(key, { base, ip, ctx, rateMax, fetchImpl }) {
  const results = [];
  const record = (check, problem) => results.push({ form: key, check, ok: !problem, detail: problem ?? "ok" });
  let sent = 0;

  const attempt = async (check, kind, buildKind = kind) => {
    const { form, removed } = buildRequest(key, buildKind, ctx);
    try {
      const res = await post(fetchImpl, base, key, form, ip);
      sent += 1;
      record(check, judge(kind, res, removed));
      return res;
    } catch (error) {
      record(check, `request failed: ${error.message}`);
      return null;
    }
  };

  if (APPLICATION_FORMS(key)) {
    await attempt("valid-cv-pdf", "valid", "cv-pdf");
    await attempt("valid-cv-docx", "valid", "cv-docx");
  } else {
    await attempt("valid", "valid");
  }
  await attempt("missing-required-422", "missing");
  await attempt("honeypot-200", "honeypot");

  // The burst: cheap honeypot posts (answered 200, nothing stored) until the limiter bites.
  let limited = null;
  let failure = null;
  while (!limited && sent <= rateMax + 2) {
    const { form } = buildRequest(key, "honeypot", ctx);
    try {
      const res = await post(fetchImpl, base, key, form, ip);
      sent += 1;
      if (res.status === 429) limited = res;
    } catch (error) {
      failure = `request failed: ${error.message}`;
      break;
    }
  }
  if (failure) record("burst-429", failure);
  else if (!limited) record("burst-429", `no 429 after ${sent} posts from one client (FORM_RATE_MAX ${rateMax}); is the limiter on, and does --rate-max match the server?`);
  else {
    const problem = judge("limit", limited);
    results.push({
      form: key,
      check: "burst-429",
      ok: !problem,
      detail: problem ?? `429 on post ${sent}, Retry-After ${retryAfter(limited)}s`,
    });
  }
  return results;
}

/** Anonymous access to the collections behind the forms must be refused. */
export async function anonymousChecks({ base, fetchImpl, storedName = `${CV_BASE}.pdf` }) {
  const refused = (s) => s === 401 || s === 403;
  const probes = [
    ["anon-GET-form-submissions", "GET", "/api/form-submissions"],
    ["anon-POST-form-submissions", "POST", "/api/form-submissions"],
    ["anon-GET-applications", "GET", "/api/applications"],
  ];
  const results = [];
  for (const [check, method, path] of probes) {
    try {
      const init = method === "POST" ? { method, headers: { "content-type": "application/json" }, body: "{}" } : { method };
      const res = await fetchImpl(`${base}${path}`, init);
      results.push({ form: "(site)", check, ok: refused(res.status), detail: refused(res.status) ? `${res.status}` : `expected 401/403, got ${res.status}` });
    } catch (error) {
      results.push({ form: "(site)", check, ok: false, detail: `request failed: ${error.message}` });
    }
  }
  try {
    const res = await fetchImpl(`${base}/api/applications/file/${storedName}`, { method: "GET" });
    // 404 proves nothing: the real stored name is not known over HTTP. Not a failure, not a pass.
    results.push({
      form: "(site)",
      check: "anon-GET-cv-file",
      ok: refused(res.status) || res.status === 404,
      detail: refused(res.status)
        ? `${res.status}`
        : res.status === 404
          ? "INCONCLUSIVE 404: the stored file name is not knowable over HTTP; verify through the local API on the server"
          : `a CV file URL answered ${res.status} anonymously`,
    });
  } catch (error) {
    results.push({ form: "(site)", check: "anon-GET-cv-file", ok: false, detail: `request failed: ${error.message}` });
  }
  return results;
}

/* ----------------------------------------------------------------- the CLI */

function parseArgs(argv, env) {
  const args = { rateMax: Number(env.FORM_RATE_MAX) || 5, eventSlug: env.EVENT_SLUG, jobSlug: env.JOB_SLUG };
  const takes = { "--event-slug": "eventSlug", "--job-slug": "jobSlug", "--rate-max": "rateMax", "--only": "only", "--expect-count-file": "expectFile", "--actual-count-file": "actualFile" };
  for (let i = 0; i < argv.length; i += 1) {
    const name = takes[argv[i]];
    if (!name) throw new Error(`unknown argument ${argv[i]}`);
    args[name] = argv[(i += 1)];
  }
  args.rateMax = Number(args.rateMax);
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2), process.env);
  const keys = Object.keys(FORM_DEFINITIONS);
  const selected = args.only ? args.only.split(",") : keys;
  const bad = selected.filter((k) => !keys.includes(k));
  if (bad.length) throw new Error(`unknown form key(s): ${bad.join(", ")}`);
  const expected = expectedStored(selected);

  if (args.expectFile || args.actualFile) {
    if (!args.expectFile || !args.actualFile) throw new Error("--expect-count-file and --actual-count-file go together");
    const problem = compareCounts(JSON.parse(readFileSync(args.expectFile, "utf8")), JSON.parse(readFileSync(args.actualFile, "utf8")), expected);
    if (problem) {
      console.error(`FAIL — ${problem}`);
      process.exit(1);
    }
    console.log(`PASS — form-submissions grew by exactly ${expected}: only the valid posts were stored.`);
    return;
  }

  const base = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const ctx = { eventSlug: args.eventSlug, jobSlug: args.jobSlug };
  if (selected.includes("event-registration") && !ctx.eventSlug) throw new Error("event-registration needs --event-slug <an upcoming event>");
  if (selected.includes("job-application") && !ctx.jobSlug) throw new Error("job-application needs --job-slug <an open job>");

  const run = String(Date.now() % 200);
  const results = [];
  for (const [i, key] of selected.entries()) {
    // TEST-NET-3 (203.0.113.0/24), one address per form, varied per run.
    const ip = `203.0.113.${(Number(run) + i * 7) % 250 + 1}`;
    results.push(...(await runForm(key, { base, ip, ctx, rateMax: args.rateMax, fetchImpl: fetch })));
  }
  results.push(...(await anonymousChecks({ base, fetchImpl: fetch })));

  for (const r of results) console.log(`${r.ok ? "ok  " : "FAIL"} ${r.form} ${r.check}: ${r.detail}`);
  const failed = results.filter((r) => !r.ok);

  console.log(`
NOT PROVEN OVER HTTP, to be done on the server (nothing here was faked):
  - stored count: ${expected} new form-submissions are expected from this run; honeypot/422/429 must add none.
    On the server, from the app directory with the environment loaded:
      FORMS_CLEANUP_MODE=count FORMS_CLEANUP_OUT=/tmp/forms-before.json npx payload run tools/forms-live-cleanup.mjs   (before this run)
      FORMS_CLEANUP_MODE=count FORMS_CLEANUP_OUT=/tmp/forms-after.json  npx payload run tools/forms-live-cleanup.mjs   (after)
    then: node --import tsx tools/check-forms-live.mjs --expect-count-file /tmp/forms-before.json --actual-count-file /tmp/forms-after.json
  - emailStatus (sent / failed / skipped) and that stored CVs refuse anonymous reads: inspect the submissions through the local API.
  - cleanup: FORMS_CLEANUP_MODE=dry-run npx payload run tools/forms-live-cleanup.mjs  (lists), then FORMS_CLEANUP_MODE=delete (removes marked entries and their CVs).`);

  if (failed.length) {
    console.error(`FAIL — ${failed.length} of ${results.length} checks failed (${base})`);
    process.exit(1);
  }
  console.log(`PASS — ${results.length} checks (${base}); the server-side items above are still open until run.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`FAIL — ${error.message}`);
    process.exit(1);
  });
}
