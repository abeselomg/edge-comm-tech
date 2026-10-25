import { createHash } from "node:crypto";
import { getPayload, type Payload } from "payload";
import config from "@payload-config";

import type { Event, Job } from "@/payload-types";
import { eventStatus } from "../events";
import { jobOpen } from "../jobs";
import { paragraphs } from "../lexical-text";
import { buildSubmissionBody, recordEmailStatus, sendNotification, type SubmissionEntry } from "../mail";
import { FORM_DEFINITIONS, type FormKey } from "./definitions";
import { clientKey, createDeduper, createLimiter, hashClientKey, isHoneypotTripped, type Deduper, type Limiter } from "./guard";
import { validateSubmission, type FormDoc, type SubmissionData } from "./validate";

/*
 * The one public way into form-submissions: POST /forms/[slug].
 *
 * Order matters and is fixed:
 *   form lookup -> rate limit -> read body -> honeypot -> validate ->
 *   event/job check -> double-submit check -> CV uploads -> submission ->
 *   notification -> respond.
 *
 * Nothing is written until every check has passed, so a rejected request
 * leaves nothing behind. CVs are written first (the submission references
 * them) and deleted again if the submission cannot be created. The mail is
 * sent only after the submission is stored, and its failure is recorded on
 * the submission, never returned to the visitor.
 *
 * The route file itself only exports POST (Next allows nothing else there);
 * everything lives here.
 */

const PUBLISHED = { _status: { equals: "published" } } as const;
const DEDUPE_WINDOW_MS = 10_000;
/** Body caps: a form without an upload has no business sending more than this. */
const MAX_TEXT_BODY = 64 * 1024;
const MAX_UPLOAD_BODY = 5 * 1024 * 1024 + 512 * 1024;
const USER_AGENT_MAX = 300;

type Errors = Record<string, string>;

const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
const fail = (status: number, errors: Errors, headers?: Record<string, string>) => json(status, { errors }, headers);
const GENERIC_500 = "Your submission could not be saved. Please try again later, or contact us by email.";

const positiveInt = (raw: string | undefined, fallback: number) => {
  const n = Number(raw);
  return raw !== undefined && raw.trim() !== "" && Number.isInteger(n) && n > 0 ? n : fallback;
};
const nonNegativeInt = (raw: string | undefined, fallback: number) => {
  const n = Number(raw);
  return raw !== undefined && raw.trim() !== "" && Number.isInteger(n) && n >= 0 ? n : fallback;
};

/* In-memory, per process: see the header of guard.ts. */
let guards: { limiter: Limiter; deduper: Deduper } | null = null;
function getGuards() {
  if (!guards) {
    guards = {
      limiter: createLimiter({
        max: positiveInt(process.env.FORM_RATE_MAX, 5),
        windowMs: positiveInt(process.env.FORM_RATE_WINDOW_SEC, 600) * 1000,
      }),
      deduper: createDeduper({ windowMs: DEDUPE_WINDOW_MS }),
    };
  }
  return guards;
}

const isFormKey = (slug: string): slug is FormKey => Object.prototype.hasOwnProperty.call(FORM_DEFINITIONS, slug);

async function findForm(payload: Payload, key: FormKey): Promise<FormDoc | null> {
  // `forms` has no drafts: a form exists and is live, or it does not exist.
  const { docs } = await payload.find({
    collection: "forms",
    where: { title: { equals: FORM_DEFINITIONS[key].title } },
    limit: 1,
    depth: 0,
  });
  return docs[0] ?? null;
}

function confirmationOf(form: FormDoc, key: FormKey): string {
  const text = paragraphs(form.confirmationMessage).join("\n\n");
  return text || FORM_DEFINITIONS[key].confirmationMessage;
}

/* ------------------------------------------------------------- the body */

type Parsed = { input: Record<string, unknown>; files: Record<string, File[]> };

/** Reads at most `cap` bytes; null when the body is larger, whatever Content-Length said. */
async function readCapped(request: Request, cap: number): Promise<Uint8Array<ArrayBuffer> | null> {
  if (!request.body) return new Uint8Array(0);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > cap) {
      await reader.cancel().catch(() => undefined);
      return null;
    }
    chunks.push(value);
  }
  const out = new Uint8Array(total);
  let at = 0;
  for (const c of chunks) {
    out.set(c, at);
    at += c.byteLength;
  }
  return out;
}

async function parseBody(
  request: Request,
  hasUpload: boolean,
): Promise<{ ok: true; parsed: Parsed } | { ok: false; response: Response }> {
  // Lower-cased for the type checks only. The original goes to the parser:
  // the multipart boundary is case-sensitive, and Chrome and Safari send
  // mixed-case ones (----WebKitFormBoundaryAbC...).
  const contentType = request.headers.get("content-type") ?? "";
  const type = contentType.toLowerCase();
  const multipart = type.startsWith("multipart/form-data");
  const isJson = type.startsWith("application/json");
  if (!multipart && !(isJson && !hasUpload)) {
    return {
      ok: false,
      response: fail(415, { _form: hasUpload ? "Send this form as multipart/form-data." : "Send this form as multipart/form-data or JSON." }),
    };
  }

  const cap = hasUpload ? MAX_UPLOAD_BODY : MAX_TEXT_BODY;
  const tooLarge = () => ({ ok: false as const, response: fail(413, { _form: "The submission is too large." }) });
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > cap) return tooLarge();
  const bytes = await readCapped(request, cap);
  if (!bytes) return tooLarge();

  const unreadable = { ok: false as const, response: fail(422, { _form: "The submission could not be read." }) };
  const input: Record<string, unknown> = Object.create(null);
  const files: Record<string, File[]> = Object.create(null);

  if (isJson) {
    let body: unknown;
    try {
      body = JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      return unreadable;
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) return unreadable;
    Object.assign(input, body);
    return { ok: true, parsed: { input, files } };
  }

  let form: FormData;
  try {
    form = await new Response(bytes, { headers: { "content-type": contentType } }).formData();
  } catch {
    return unreadable;
  }
  for (const [name, value] of form.entries()) {
    if (typeof value === "string") {
      const prev = input[name];
      input[name] = prev === undefined ? value : Array.isArray(prev) ? [...prev, value] : [prev, value];
    } else {
      (files[name] ??= []).push(value);
    }
  }
  return { ok: true, parsed: { input, files } };
}

/* ---------------------------------------------------- event and job */

/** Registration is open while the event has not ended (src/lib/events.ts). */
export const registrationOpen = (event: Pick<Event, "startsOn" | "endsOn">, now = new Date()) =>
  eventStatus(event, now) === "upcoming";

export { jobOpen };

async function resolveContext(
  payload: Payload,
  context: SubmissionData["context"],
): Promise<{ ok: true; entry?: SubmissionEntry & { field: string } } | { ok: false; errors: Errors }> {
  if (context.event) {
    const { docs } = await payload.find({
      collection: "events",
      where: { and: [PUBLISHED, { slug: { equals: context.event } }] },
      limit: 1,
      depth: 0,
    });
    const event = docs[0] as Event | undefined;
    if (!event) return { ok: false, errors: { event: "This event could not be found." } };
    if (!registrationOpen(event)) return { ok: false, errors: { event: "Registration for this event has closed." } };
    return { ok: true, entry: { field: "event", label: "Event", value: `${event.title} (${event.slug})` } };
  }
  if (context.job) {
    const { docs } = await payload.find({
      collection: "jobs",
      where: { and: [PUBLISHED, { slug: { equals: context.job } }] },
      limit: 1,
      depth: 0,
    });
    const job = docs[0] as Job | undefined;
    if (!job) return { ok: false, errors: { job: "This position could not be found." } };
    if (!jobOpen(job)) return { ok: false, errors: { job: "Applications for this position have closed." } };
    return { ok: true, entry: { field: "job", label: "Position", value: `${job.title} (${job.slug})` } };
  }
  return { ok: true };
}

/* ------------------------------------------------------------ the rest */

function dedupeKey(key: FormKey, client: string, data: SubmissionData): string {
  const uploads = data.uploads.map((u) => ({
    field: u.field,
    files: u.files.map((f) => ({ name: f.name, size: f.size, sha: createHash("sha256").update(f.data).digest("hex") })),
  }));
  return createHash("sha256")
    .update(JSON.stringify({ key, client, entries: data.entries, context: data.context, uploads }))
    .digest("hex");
}

/** Recipients come only from the form document; nothing a visitor sends can add one. */
function recipientsOf(form: FormDoc): string[] {
  return (form.emails ?? [])
    .flatMap((e) => (e.emailTo ?? "").split(/[,;]/))
    .map((s) => s.trim())
    .filter((s) => /^[^\s@{}<>]+@[^\s@{}<>]+\.[^\s@{}<>]+$/.test(s));
}

/** From the form's title only, so no submitted value can reach a mail header. */
const subjectOf = (form: FormDoc) =>
  `New ${form.title.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, 120)} submission from the website`;

const messageOf = (err: unknown) => (err instanceof Error ? err.message : String(err));

export async function handleSubmission(request: Request, slug: string): Promise<Response> {
  let payload: Payload | null = null;
  try {
    if (!isFormKey(slug)) return fail(404, { _form: "This form does not exist." });
    const key = slug;
    payload = await getPayload({ config });

    const form = await findForm(payload, key);
    if (!form) return fail(404, { _form: "This form does not exist." });

    const client = clientKey(request.headers, nonNegativeInt(process.env.TRUSTED_PROXY_HOPS, 1));
    const { limiter, deduper } = getGuards();
    const limit = limiter.check(`${key}|${client}`);
    if (!limit.allowed) {
      return fail(429, { _form: "Too many submissions. Please wait a few minutes and try again." }, {
        "retry-after": String(limit.retryAfterSec),
      });
    }

    const hasUpload = (form.fields ?? []).some((f) => f.blockType === "upload");
    const body = await parseBody(request, hasUpload);
    if (!body.ok) return body.response;
    const { input, files } = body.parsed;

    const success = json(200, { ok: true, message: confirmationOf(form, key) });
    // A bot gets exactly what a person gets, and nothing is kept.
    if (isHoneypotTripped(input)) return success;

    const result = await validateSubmission(form, input, files);
    if (!result.ok) return fail(422, result.errors);
    const data = result.data;

    const context = await resolveContext(payload, data.context);
    if (!context.ok) return fail(422, context.errors);

    // A double click within the window is answered but not stored twice.
    const dedupe = dedupeKey(key, client, data);
    if (deduper.seen(dedupe)) return success;

    const uploaded: { field: string; label: string; ids: (string | number)[]; names: string[] }[] = [];
    const removeUploads = async () => {
      for (const u of uploaded) {
        for (const id of u.ids) {
          try {
            await payload!.delete({ collection: "applications", id, overrideAccess: true });
          } catch (err) {
            payload!.logger.error({ err, msg: `Could not remove orphaned application file ${id}.` });
          }
        }
      }
    };

    let submissionId: number | string;
    try {
      for (const u of data.uploads) {
        const entry = { field: u.field, label: u.label, ids: [] as (string | number)[], names: [] as string[] };
        uploaded.push(entry);
        for (const f of u.files) {
          const doc = await payload.create({
            collection: "applications",
            data: {},
            file: { name: f.name, data: f.data, mimetype: f.mimeType, size: f.size },
            overrideAccess: true,
          });
          entry.ids.push(doc.id);
          entry.names.push(f.name);
        }
      }

      const submissionData = [
        ...(context.entry ? [{ field: context.entry.field, value: context.entry.value }] : []),
        ...data.entries.map((e) => ({ field: e.field, value: e.value })),
        // The plugin's beforeChange hook (handleUploads) checks these ids
        // against the upload block and moves them into submissionUploads.
        ...uploaded.map((u) => ({ field: u.field, value: u.ids.map(String).join(",") })),
      ];

      const created = await payload.create({
        collection: "form-submissions",
        data: {
          form: form.id,
          submissionData,
          consent: { accepted: true, acceptedAt: new Date().toISOString(), wording: data.consent.wording },
          meta: {
            ipHash: hashClientKey(client, process.env.PAYLOAD_SECRET ?? ""),
            userAgent: (request.headers.get("user-agent") ?? "").slice(0, USER_AGENT_MAX),
          },
          emailStatus: "pending",
        },
        overrideAccess: true,
      });
      submissionId = created.id;
    } catch (err) {
      deduper.forget(dedupe);
      payload.logger.error({ err, msg: `A ${key} submission could not be stored.` });
      await removeUploads();
      return fail(500, { _form: GENERIC_500 });
    }

    const entries: SubmissionEntry[] = [
      ...(context.entry ? [{ label: context.entry.label, value: context.entry.value }] : []),
      ...data.entries.map((e) => ({ label: e.label, value: e.value })),
      ...uploaded.flatMap((u) => u.names.map((name) => ({ label: u.label, value: name, upload: true }))),
    ];
    try {
      await sendNotification(payload, {
        submissionId,
        to: recipientsOf(form),
        subject: subjectOf(form),
        text: buildSubmissionBody({ title: form.title, entries, consent: data.consent }),
      });
    } catch (err) {
      // sendNotification does not throw; if it ever does, the submission stands.
      payload.logger.error({ err, msg: `Submission ${submissionId} stored; the notification step threw.` });
      await recordEmailStatus(payload, submissionId, "failed", messageOf(err));
    }

    return success;
  } catch (err) {
    if (payload) payload.logger.error({ err, msg: "The form submission route failed." });
    else console.error("The form submission route failed.", err);
    return fail(500, { _form: GENERIC_500 });
  }
}
