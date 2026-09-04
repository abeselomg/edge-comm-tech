import type { Field } from "payload";

/** URL segment for a document. Lowercased and trimmed on save. */
export const slugField = (describedBy = "Used in the page URL."): Field => ({
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  index: true,
  admin: { position: "sidebar", description: describedBy },
  hooks: {
    beforeValidate: [({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value)],
  },
});

/** Explicit display order. Lower numbers render first. */
export const orderField: Field = {
  name: "order",
  type: "number",
  required: true,
  defaultValue: 99,
  admin: { position: "sidebar", description: "Lower numbers appear first." },
};
