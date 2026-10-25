import type { Form } from "@/payload-types";
import { FORM_DEFINITIONS, type FormDefinition, type FormFieldDef, type FormKey } from "./definitions";
import { HONEYPOT_FIELD } from "./guard";
import { MAX_UPLOAD_BYTES } from "./constants";

export { MAX_UPLOAD_BYTES };

/*
 * Server-side validation of a submission against the stored form document.
 *
 * The browser's `required` and `maxlength` are a convenience; this is the
 * enforcement. Nothing here touches the database.
 *
 * The stored document holds only what the plugin's blocks can carry (name,
 * label, required, options, upload settings). `tel`/`url` types and the
 * length caps exist only in FORM_DEFINITIONS, so the two are joined by field
 * name: the document decides which fields exist and whether they are
 * required, the definition adds the finer type and the cap.
 *
 * Selects keep Highland's leading placeholder ("Select", "Select a sector",
 * ...). On a required select the placeholder counts as not chosen; on an
 * optional one it is accepted and treated as empty.
 */

export type FormDoc = Form;
type Block = NonNullable<Form["fields"]>[number];

const DEFAULT_MAX = 500;
const DEFAULT_TEXTAREA_MAX = 5000;
/** More keys than any form has fields, by a wide margin; past it, the request is junk. */
const MAX_KEYS = 100;

const PDF = "application/pdf";
const DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/** The hidden context field each form carries, set by the page it sits on. */
export const CONTEXT_FIELDS: Partial<Record<FormKey, "event" | "job">> = {
  "event-registration": "event",
  "job-application": "job",
};

export type Entry = { field: string; label: string; value: string };
export type UploadFile = { name: string; mimeType: string; size: number; data: Buffer };
export type UploadEntry = { field: string; label: string; files: UploadFile[] };

export type SubmissionData = {
  key: FormKey;
  definition: FormDefinition;
  entries: Entry[];
  uploads: UploadEntry[];
  consent: { accepted: true; wording: string };
  context: { event?: string; job?: string };
};

export type ValidationResult = { ok: true; data: SubmissionData } | { ok: false; errors: Record<string, string> };

/** The definition a stored form was seeded from, matched by title. */
export function definitionFor(form: Pick<Form, "title">): { key: FormKey; definition: FormDefinition } | null {
  for (const key of Object.keys(FORM_DEFINITIONS) as FormKey[]) {
    if (FORM_DEFINITIONS[key].title === form.title) return { key, definition: FORM_DEFINITIONS[key] };
  }
  return null;
}

const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
const TEL = /^[+\d][\d\s()-]{6,}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Control characters: none at all on one line; a textarea may keep tab and newlines.
const CONTROL = /[\u0000-\u001f\u007f]/;
const CONTROL_MULTILINE = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

const CHECKED = new Set(["on", "true", "1", "yes"]);
const UNCHECKED = new Set(["", "off", "false", "0", "no"]);

/** A checkbox value: true, false, or null when it is not a checkbox value at all. */
function checkboxValue(raw: unknown): boolean | null {
  if (raw === undefined || raw === null || raw === false) return false;
  if (raw === true) return true;
  if (typeof raw === "string") {
    const v = raw.trim().toLowerCase();
    if (CHECKED.has(v)) return true;
    if (UNCHECKED.has(v)) return false;
  }
  return null;
}

const isPlaceholder = (option: string) => /^select\b/i.test(option.trim());

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}

/** A single trimmed string, "" for absent, or null when the value is not one string. */
function single(raw: unknown): string | null {
  if (raw === undefined || raw === null) return "";
  if (typeof raw === "string") return raw.trim();
  if (typeof raw === "number" && Number.isFinite(raw)) return String(raw);
  return null;
}

function detectType(head: Uint8Array): string | null {
  if (head.length >= 5 && Buffer.from(head.subarray(0, 5)).toString("latin1") === "%PDF-") return PDF;
  if (head.length >= 4 && head[0] === 0x50 && head[1] === 0x4b && head[2] === 0x03 && head[3] === 0x04) return DOCX;
  return null;
}

const EXTENSION: Record<string, string> = { [PDF]: ".pdf", [DOCX]: ".docx" };

/** A storage-safe name that keeps the visitor's base name where it can. */
function safeName(original: string, mimeType: string): string {
  const base = (original.split(/[\\/]/).pop() ?? "")
    .replace(/\.[^.]*$/, "")
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 80);
  return `${base || "cv"}${EXTENSION[mimeType]}`;
}

async function checkFiles(
  block: Extract<Block, { blockType: "upload" }>,
  label: string,
  list: File[],
): Promise<{ error: string } | { files: UploadFile[] }> {
  // A browser sends an empty, unnamed part when no file was chosen.
  const chosen = list.filter((f) => !(f.size === 0 && f.name === ""));
  if (!chosen.length) return block.required ? { error: `${label} is required.` } : { files: [] };
  if (!block.multiple && chosen.length > 1) return { error: `${label} takes one file.` };

  const cap = Math.min(MAX_UPLOAD_BYTES, block.maxFileSize || MAX_UPLOAD_BYTES);
  const allowed = (block.mimeTypes ?? []).map((m) => m.mimeType);
  const files: UploadFile[] = [];
  for (const file of chosen) {
    if (file.size === 0) return { error: `${label}: the file is empty.` };
    if (file.size > cap) return { error: `${label}: the file is larger than ${Math.floor(cap / (1024 * 1024))} MB.` };
    const data = Buffer.from(await file.arrayBuffer());
    if (data.length === 0) return { error: `${label}: the file is empty.` };
    if (data.length > cap) return { error: `${label}: the file is larger than ${Math.floor(cap / (1024 * 1024))} MB.` };
    // The type is decided by the content, never by the name or the browser's claim.
    const mimeType = detectType(data);
    const extension = file.name.toLowerCase().match(/\.[a-z0-9]+$/)?.[0];
    if (!mimeType || EXTENSION[mimeType] !== extension || (allowed.length && !allowed.includes(mimeType))) {
      return { error: `${label}: upload a PDF or DOCX file.` };
    }
    files.push({ name: safeName(file.name, mimeType), mimeType, size: data.length, data });
  }
  return { files };
}

export async function validateSubmission(
  form: FormDoc,
  input: Record<string, unknown>,
  files: Record<string, File[]>,
): Promise<ValidationResult> {
  const found = definitionFor(form);
  if (!found) return { ok: false, errors: { _form: "This form is not accepting submissions." } };
  const { key, definition } = found;

  if (Object.keys(input).length + Object.keys(files).length > MAX_KEYS) {
    return { ok: false, errors: { _form: "The submission has too many fields." } };
  }

  const defs = new Map<string, FormFieldDef>(definition.fields.map((f) => [f.name, f]));
  const blocks = (form.fields ?? []).filter((b): b is Exclude<Block, { blockType: "message" }> => b.blockType !== "message");
  const contextField = CONTEXT_FIELDS[key];
  const known = new Set<string>([...blocks.map((b) => b.name), "consent", HONEYPOT_FIELD, ...(contextField ? [contextField] : [])]);

  // Null prototype: a field named "__proto__" must land as an error, not vanish.
  const errors: Record<string, string> = Object.create(null);
  const entries: Entry[] = [];
  const uploads: UploadEntry[] = [];

  for (const name of new Set([...Object.keys(input), ...Object.keys(files)])) {
    if (!known.has(name)) errors[name] = "This field is not part of the form.";
  }

  for (const block of blocks) {
    const name = block.name;
    const def = defs.get(name);
    const label = block.label || def?.label || name;
    const raw = input[name];

    if (block.blockType === "upload") {
      if (raw !== undefined && raw !== "") {
        errors[name] = `${label}: attach the file itself.`;
        continue;
      }
      const result = await checkFiles(block, label, files[name] ?? []);
      if ("error" in result) errors[name] = result.error;
      else if (result.files.length) uploads.push({ field: name, label, files: result.files });
      continue;
    }

    if (files[name]?.length) {
      errors[name] = "This field does not take a file.";
      continue;
    }

    if (block.blockType === "checkbox") {
      const checked = checkboxValue(raw);
      if (checked === null) errors[name] = `${label}: tick or untick the box.`;
      else if (block.required && !checked) errors[name] = `${label} is required.`;
      else if (checked) entries.push({ field: name, label, value: "Yes" });
      continue;
    }

    let value = single(raw);
    if (value === null) {
      errors[name] = `${label}: send a single value.`;
      continue;
    }

    if (block.blockType === "select") {
      const options = (block.options ?? []).map((o) => o.value);
      if (value !== "" && !options.includes(value)) {
        errors[name] = `${label}: choose one of the listed options.`;
        continue;
      }
      if (value !== "" && options[0] === value && isPlaceholder(value)) value = "";
      if (value === "") {
        if (block.required) errors[name] = `${label} is required.`;
        continue;
      }
      entries.push({ field: name, label, value });
      continue;
    }

    const multiline = block.blockType === "textarea";
    if (value === "") {
      if (block.required) errors[name] = `${label} is required.`;
      continue;
    }
    if ((multiline ? CONTROL_MULTILINE : CONTROL).test(value)) {
      errors[name] = `${label} contains characters that cannot be accepted.`;
      continue;
    }
    const max = def?.maxLength ?? (multiline ? DEFAULT_TEXTAREA_MAX : DEFAULT_MAX);
    if (value.length > max) {
      errors[name] = `${label} must be ${max} characters or fewer.`;
      continue;
    }

    const type = block.blockType === "email" ? "email" : block.blockType === "number" ? "number" : def?.type;
    if (type === "email" && !EMAIL.test(value)) errors[name] = `${label}: enter a valid email address.`;
    else if (type === "url" && !isHttpUrl(value)) errors[name] = `${label}: enter a web address starting http:// or https://.`;
    else if (type === "tel" && !TEL.test(value)) errors[name] = `${label}: enter a phone number, including the country code.`;
    else if (type === "number" && !Number.isFinite(Number(value))) errors[name] = `${label}: enter a number.`;
    else entries.push({ field: name, label, value });
  }

  const consent = checkboxValue(input.consent);
  if (consent !== true) errors.consent = `Please confirm: ${definition.consent}`;

  const context: SubmissionData["context"] = {};
  if (contextField) {
    const value = single(input[contextField]);
    if (!value) errors[contextField] = `This ${contextField} could not be identified. Open the form from its page and try again.`;
    else if (value.length > 200 || !SLUG.test(value)) errors[contextField] = `This ${contextField} could not be identified.`;
    else context[contextField] = value;
  }

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: { key, definition, entries, uploads, consent: { accepted: true, wording: definition.consent }, context },
  };
}
