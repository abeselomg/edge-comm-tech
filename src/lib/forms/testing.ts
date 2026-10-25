import type { FormDoc } from "./validate";
import { FORM_DEFINITIONS, type FormKey } from "./definitions";
import { toBlock } from "../../seed/forms";
import { p, rich } from "../../seed/lexical";

/*
 * A stored `forms` document as the seed writes it, for tests only. Built with
 * the seed's own toBlock so a fixture cannot drift from what is really stored:
 * no hint, group or maxLength, tel/url as text, selects with their placeholder.
 */
export function formDoc(key: FormKey): FormDoc {
  const def = FORM_DEFINITIONS[key];
  return {
    id: 1,
    title: def.title,
    submitButtonLabel: "Submit",
    confirmationType: "message",
    confirmationMessage: rich(p(def.confirmationMessage)),
    fields: def.fields.map(toBlock),
    emails: [],
    updatedAt: "2026-10-24T00:00:00.000Z",
    createdAt: "2026-10-24T00:00:00.000Z",
  } as unknown as FormDoc;
}
