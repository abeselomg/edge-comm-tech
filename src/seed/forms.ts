import type { Payload } from "payload";

import {
  FORM_DEFINITIONS,
  type FormFieldDef,
  type FormKey,
} from "../lib/forms/definitions";
import { emailByLabel } from "../lib/routes";
import { p, rich } from "./lexical";
import { decideWrite, seedMode } from "./upsert";

/*
 * Upserts the six `forms` documents from FORM_DEFINITIONS, keyed by title.
 *
 * The plugin's blocks carry name, label, required, options and width, so that
 * is what is stored. `hint`, `group` and `maxLength` have no block field; they
 * stay in FORM_DEFINITIONS and are joined back by field name wherever a form
 * is rendered or validated. `tel` and `url` have no block either, so they are
 * stored as `text`.
 *
 * "fresh" updates in place rather than deleting: a form that has submissions
 * pointing at it cannot be removed, and its content is fully determined here.
 */

const UPLOAD_COLLECTION = "applications";
const CV_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const CV_MAX_BYTES = 5 * 1024 * 1024;

/** Which contact-details mailbox receives each form, as a label pattern. */
const GENERAL = /sales|general/i;
const ROUTING: Record<FormKey, RegExp> = {
  contact: GENERAL,
  subscribe: GENERAL,
  "event-registration": GENERAL,
  "academy-enquiry": /training/i,
  "job-application": /careers/i,
  "internship-application": /careers/i,
};

export function toBlock(f: FormFieldDef): Record<string, unknown> {
  const base = {
    name: f.name,
    label: f.label,
    ...(f.required ? { required: true } : {}),
    ...(f.wide ? { width: 100 } : {}),
  };
  switch (f.type) {
    case "select":
      return {
        blockType: "select",
        ...base,
        options: (f.options ?? []).map((o) => ({ label: o, value: o })),
      };
    case "email":
      return { blockType: "email", ...base };
    case "textarea":
      return { blockType: "textarea", ...base };
    case "checkbox":
      return { blockType: "checkbox", ...base };
    case "upload":
      return {
        blockType: "upload",
        ...base,
        uploadCollection: UPLOAD_COLLECTION,
        mimeTypes: CV_MIME_TYPES.map((mimeType) => ({ mimeType })),
        maxFileSize: CV_MAX_BYTES,
      };
    default:
      // text, tel, url
      return { blockType: "text", ...base };
  }
}

/** The recipient for a form: its own mailbox if the global has one, else the general one. */
export function recipientFor(
  key: FormKey,
  contact: { emails?: { label: string; value: string }[] | null },
): string | undefined {
  return emailByLabel(contact, ROUTING[key]) ?? emailByLabel(contact, GENERAL);
}

export async function seedForms(payload: Payload): Promise<void> {
  const mode = seedMode(process.env.SEED_MODE);
  const contact = await payload.findGlobal({ slug: "contact-details", depth: 0 });
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const key of Object.keys(FORM_DEFINITIONS) as FormKey[]) {
    const def = FORM_DEFINITIONS[key];
    const to = recipientFor(key, contact);
    const data = {
      title: def.title,
      submitButtonLabel: "Submit",
      confirmationType: "message" as const,
      confirmationMessage: rich(p(def.confirmationMessage)),
      fields: def.fields.map(toBlock),
      emails: to
        ? [{ emailTo: to, subject: `New ${def.title.toLowerCase()} from the website` }]
        : [],
    };

    const { docs } = await payload.find({
      collection: "forms",
      where: { title: { equals: def.title } },
      limit: 1,
      depth: 0,
    });
    const existing = docs[0];
    // "fresh" behaves as "force" here; see the header.
    const action = decideWrite(Boolean(existing), mode === "fresh" ? "force" : mode);

    if (action === "skip") {
      skipped += 1;
    } else if (action === "update") {
      await payload.update({ collection: "forms", id: existing.id, data: data as never });
      updated += 1;
    } else {
      await payload.create({ collection: "forms", data: data as never });
      created += 1;
    }
  }

  payload.logger.info(`forms (${mode}): ${created} created, ${updated} updated, ${skipped} left alone`);
}
