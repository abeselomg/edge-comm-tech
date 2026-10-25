import type { Form } from "@/payload-types";
import { paragraphs } from "../lexical-text";
import { FORM_DEFINITIONS, type FormDefinition, type FormFieldDef, type FormFieldType } from "./definitions";

/*
 * What a page needs to draw a stored form. Safe for the browser: no node
 * imports (validate.ts reaches node:crypto through guard.ts, so it is not
 * used here).
 *
 * The stored document decides which fields exist, their order, labels,
 * required flags and select options. `hint`, `group`, `maxLength`, the
 * tel/url type and the consent wording are not stored, so they are joined
 * back from FORM_DEFINITIONS by field name, the same join the server makes.
 */

type Block = NonNullable<Form["fields"]>[number];

export type RenderField = {
  name: string;
  label: string;
  type: FormFieldType | "number";
  required: boolean;
  wide: boolean;
  hint?: string;
  group?: string;
  maxLength?: number;
  options?: string[];
  /** The leading "Select ..." option, which stands for not chosen. */
  placeholder?: string;
};

/** Same test as the server's: a leading option that reads "Select ..." is not a choice. */
export const isPlaceholder = (option: string) => /^select\b/i.test(option.trim());

export function definitionOf(form: Pick<Form, "title">): FormDefinition | null {
  for (const def of Object.values(FORM_DEFINITIONS)) if (def.title === form.title) return def;
  return null;
}

export function renderFields(form: Form): RenderField[] {
  const defs = new Map<string, FormFieldDef>((definitionOf(form)?.fields ?? []).map((f) => [f.name, f]));
  const out: RenderField[] = [];
  for (const block of (form.fields ?? []) as Block[]) {
    if (block.blockType === "message") continue;
    const def = defs.get(block.name);
    const base = {
      name: block.name,
      label: block.label || def?.label || block.name,
      required: Boolean("required" in block && block.required),
      wide: Boolean(def?.wide) || ("width" in block && block.width === 100),
      ...(def?.hint ? { hint: def.hint } : {}),
      ...(def?.group ? { group: def.group } : {}),
      ...(def?.maxLength ? { maxLength: def.maxLength } : {}),
    };
    switch (block.blockType) {
      case "select": {
        const options = (block.options ?? []).map((o) => o.value);
        out.push({
          ...base,
          type: "select",
          options,
          ...(options[0] !== undefined && isPlaceholder(options[0]) ? { placeholder: options[0] } : {}),
        });
        break;
      }
      case "email":
      case "textarea":
      case "checkbox":
      case "number":
      case "upload":
        out.push({ ...base, type: block.blockType });
        break;
      default:
        // text, and whatever the plugin offers that this site does not use
        out.push({ ...base, type: def?.type === "tel" || def?.type === "url" ? def.type : "text" });
    }
  }
  return out;
}

export const consentWording = (form: Pick<Form, "title">): string => definitionOf(form)?.consent ?? "";

/** The stored confirmation, as plain paragraphs joined by a blank line. */
export function confirmationText(form: Pick<Form, "title" | "confirmationMessage">): string {
  return paragraphs(form.confirmationMessage).join("\n\n") || definitionOf(form)?.confirmationMessage || "";
}
