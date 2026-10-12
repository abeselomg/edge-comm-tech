import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { orderField, slugField } from "../fields/slug";
import { forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = (doc: { slug?: string | null }) => [
  "/",
  "/services",
  "/solutions",
  ...(doc.slug ? [`/services/${doc.slug}`] : []),
];

/*
 * The six professional services.
 *
 * Deliberately a flatter shape than Solutions: every approved service page
 * carries one capability list, so there is no typed-section list here. The
 * variation that justified blocks on Solutions does not exist on these pages,
 * and offering blocks anyway would invite an editor to invent it.
 */
export const Services: CollectionConfig = {
  slug: "services",
  labels: { singular: "Professional service", plural: "Professional services" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "order", "_status"],
    group: "Content",
    description:
      "The six services spanning the technology lifecycle, from advisory through managed support.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths)],
    afterDelete: [revalidateAfterDelete(paths)],
  },
  fields: [
    { name: "title", type: "text", required: true, validate: forbidsPhrases() },
    slugField("Page URL: /services/<slug>"),
    orderField,
    {
      name: "short",
      type: "text",
      required: true,
      admin: { description: "The abbreviated name used in navigation and cards." },
      validate: forbidsPhrases(),
    },
    {
      name: "blurb",
      type: "textarea",
      required: true,
      admin: { description: "One or two sentences, used on cards." },
      validate: forbidsPhrases(),
    },
    {
      name: "accent",
      type: "text",
      required: true,
      defaultValue: "#056a9a",
      admin: { position: "sidebar", description: "Hex colour for this service, e.g. #056a9a." },
    },
    {
      name: "headline",
      type: "text",
      required: true,
      admin: { description: "The promise at the top of the page. One line." },
      validate: forbidsPhrases(),
    },
    {
      name: "intro",
      type: "textarea",
      required: true,
      validate: forbidsPhrases(),
    },
    {
      name: "capabilities",
      type: "array",
      minRows: 1,
      labels: { singular: "Capability", plural: "What this includes" },
      fields: [
        { name: "title", type: "text", required: true, validate: forbidsPhrases() },
        { name: "body", type: "textarea", required: true, validate: forbidsPhrases() },
      ],
    },
    {
      name: "checklistTitle",
      type: "text",
      admin: { description: "Heading for the checklist below, if this service has one." },
      validate: forbidsPhrases(),
    },
    {
      name: "checklist",
      type: "array",
      labels: { singular: "Item", plural: "Checklist" },
      fields: [{ name: "item", type: "text", required: true, validate: forbidsPhrases() }],
    },
    {
      name: "modelsTitle",
      type: "text",
      admin: { description: "Heading for the engagement or support models below, if any." },
      validate: forbidsPhrases(),
    },
    {
      name: "models",
      type: "array",
      labels: { singular: "Model", plural: "Models" },
      fields: [
        { name: "title", type: "text", required: true, validate: forbidsPhrases() },
        { name: "body", type: "textarea", required: true, validate: forbidsPhrases() },
      ],
    },
    {
      name: "fit",
      type: "textarea",
      admin: {
        description:
          "When this service applies. Shown as a pulled-out line on the overview and the page.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "note",
      type: "textarea",
      admin: { description: "A qualification or caveat, if the approved copy carries one." },
      validate: forbidsPhrases(),
    },
    {
      name: "related",
      type: "relationship",
      relationTo: "services",
      hasMany: true,
      admin: { description: "Services a reader of this page should see next." },
    },
  ],
};
