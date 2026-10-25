import type { Block, CollectionConfig } from "payload";
import { solutionHref } from "../lib/routes";
import { adminOnly, publishedOrSignedIn, signedIn } from "../access";
import { orderField, slugField } from "../fields/slug";
import { forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";
import { previewUrl } from "../lib/preview";

export const paths = (doc: { slug?: string | null }) => [
  // Every page that can link a solution, so unpublishing one removes the link
  // everywhere rather than only on its own page.
  "/",
  "/about",
  "/blog",
  "/careers/e-academy",
  "/clients",
  "/partners",
  "/projects",
  "/services",
  "/solutions",
  ...(doc.slug ? [solutionHref(doc.slug)] : []),
];

/*
 * Detail sections.
 *
 * The approved solution pages do not share one shape: most carry a flat
 * capability list, the datacenter family carries two named bands, and others
 * carry a layered architecture or a numbered sequence. Rather than give every
 * solution every field and leave most of them empty, an editor picks from
 * these six.
 *
 * This is deliberately not a page builder. There are six types, they cannot be
 * styled, and they cannot be nested. It mirrors variation the client's own
 * content already has.
 */

const titledBody = [
  { name: "title", type: "text", required: true, validate: forbidsPhrases() },
  { name: "body", type: "textarea", required: true, validate: forbidsPhrases() },
] as const;

const DETAIL_BLOCKS: Block[] = [
  {
    slug: "capabilities",
    labels: { singular: "Capability list", plural: "Capability lists" },
    fields: [
      {
        name: "items",
        type: "array",
        minRows: 1,
        labels: { singular: "Capability", plural: "Capabilities" },
        fields: [...titledBody],
      },
    ],
  },
  {
    slug: "bands",
    labels: { singular: "Capability bands", plural: "Capability bands" },
    fields: [
      {
        name: "items",
        type: "array",
        admin: { description: "Two or more named groups instead of one flat list. Used where a family covers distinct areas, like datacenter facility and IT infrastructure." },
        minRows: 2,
        labels: { singular: "Band", plural: "Bands" },
        fields: [
          {
            name: "label",
            type: "text",
            required: true,
            admin: {
              description:
                "The small line above the band's heading, e.g. 'Datacenter facility'. The approved design renders it as the section eyebrow.",
            },
            validate: forbidsPhrases(),
          },
          { name: "title", type: "text", required: true, validate: forbidsPhrases() },
          {
            name: "entries",
            type: "array",
            minRows: 1,
            labels: { singular: "Entry", plural: "Entries" },
            // Title and body, like `capabilities`, because the approved design
            // renders each entry as a heading with a paragraph under it. A
            // single string here forced the seed to flatten them into
            // "Title: body", which reads as one run-on line and loses the
            // structure the client signed off.
            fields: [...titledBody],
          },
        ],
      },
    ],
  },
  {
    slug: "layers",
    labels: { singular: "Architecture layers", plural: "Architecture layers" },
    fields: [
      { name: "title", type: "text", validate: forbidsPhrases() },
      {
        name: "items",
        type: "array",
        admin: { description: "A stack, rendered top to bottom in this order." },
        minRows: 1,
        labels: { singular: "Layer", plural: "Layers" },
        fields: [...titledBody],
      },
    ],
  },
  {
    slug: "sectors",
    labels: { singular: "Sector relevance", plural: "Sector relevance" },
    fields: [
      { name: "title", type: "text", validate: forbidsPhrases() },
      {
        name: "items",
        type: "array",
        admin: { description: "How this family applies per sector. Three of the seven families carry this; the rest do not." },
        minRows: 1,
        labels: { singular: "Sector", plural: "Sectors" },
        fields: [...titledBody],
      },
    ],
  },
  {
    slug: "measures",
    labels: { singular: "Value measures", plural: "Value measures" },
    fields: [
      { name: "title", type: "text", required: true, validate: forbidsPhrases() },
      {
        name: "items",
        type: "array",
        admin: { description: "How a client judges whether this delivered value." },
        minRows: 1,
        labels: { singular: "Measure", plural: "Measures" },
        fields: [{ name: "item", type: "text", required: true, validate: forbidsPhrases() }],
      },
    ],
  },
  {
    slug: "steps",
    labels: { singular: "Numbered sequence", plural: "Numbered sequences" },
    fields: [
      { name: "title", type: "text", validate: forbidsPhrases() },
      {
        name: "items",
        type: "array",
        admin: { description: "An approach, lifecycle or delivery sequence. Numbered automatically." },
        minRows: 1,
        labels: { singular: "Step", plural: "Steps" },
        fields: [...titledBody],
      },
    ],
  },
  {
    slug: "checklist",
    labels: { singular: "Checklist", plural: "Checklists" },
    fields: [
      { name: "title", type: "text", required: true, validate: forbidsPhrases() },
      {
        name: "items",
        type: "array",
        admin: { description: "Considerations, controls or principles, as a titled list." },
        minRows: 1,
        labels: { singular: "Item", plural: "Items" },
        fields: [{ name: "item", type: "text", required: true, validate: forbidsPhrases() }],
      },
      {
        name: "note",
        type: "textarea",
        admin: { description: "A qualification under the list, where the approved copy has one." },
        validate: forbidsPhrases(),
      },
    ],
  },
  {
    slug: "models",
    labels: { singular: "Engagement models", plural: "Engagement models" },
    fields: [
      { name: "title", type: "text", required: true, validate: forbidsPhrases() },
      {
        name: "items",
        type: "array",
        admin: { description: "Named engagement or support models." },
        minRows: 1,
        labels: { singular: "Model", plural: "Models" },
        fields: [...titledBody],
      },
    ],
  },
];

export const Solutions: CollectionConfig = {
  slug: "solutions",
  labels: { singular: "Solution family", plural: "Solution families" },
  admin: {
    useAsTitle: "title",
    preview: (doc) => previewUrl("solutions", doc),
    defaultColumns: ["title", "order", "_status"],
    group: "Content",
    description:
      "The seven integrated solution families. These are the main pages buyers land on from search.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: adminOnly },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths, { layout: true })],
    afterDelete: [revalidateAfterDelete(paths, { layout: true })],
  },
  fields: [
    { name: "title", type: "text", required: true, validate: forbidsPhrases() },
    slugField("Page URL: /solutions/<slug>"),
    orderField,
    {
      name: "short",
      type: "text",
      required: true,
      admin: { description: "The abbreviated name used in navigation, tags and footers." },
      validate: forbidsPhrases(),
    },
    {
      name: "blurb",
      type: "textarea",
      required: true,
      admin: { description: "One or two sentences. Used on cards and in the solutions ledger." },
      validate: forbidsPhrases(),
    },
    {
      name: "accent",
      type: "text",
      required: true,
      defaultValue: "#0888c5",
      admin: {
        position: "sidebar",
        description: "Hex colour for this family, e.g. #0888c5. Used for numerals, tags and rules.",
      },
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
      admin: { description: "The paragraph under the headline." },
      validate: forbidsPhrases(),
    },
    {
      name: "lead",
      type: "textarea",
      admin: {
        description:
          "A longer opening passage before the body, where the approved copy has one. Two of the seven families do.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "detail",
      type: "blocks",
      blocks: DETAIL_BLOCKS,
      admin: {
        description:
          "The body of the page, in order. Pick the section types this family needs — most use a single capability list.",
      },
    },
    {
      name: "outcomesTitle",
      type: "text",
      admin: { description: "Heading for the outcomes below, where the approved copy has one." },
      validate: forbidsPhrases(),
    },
    {
      name: "outcomes",
      type: "array",
      labels: { singular: "Outcome", plural: "Business outcomes" },
      admin: { description: "What the client gets, in business terms rather than technical ones." },
      fields: [{ name: "item", type: "text", required: true, validate: forbidsPhrases() }],
    },
    {
      name: "note",
      type: "textarea",
      admin: {
        description:
          "A qualification on the whole page. The datacenter family uses this to state that Tier claims are only made when independently verified, and that CCTV and access control are IT infrastructure here rather than cybersecurity.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "partners",
      type: "relationship",
      relationTo: "partners",
      hasMany: true,
      admin: {
        description:
          "The platforms this family is delivered on. All seven families list these, and they are a relationship rather than typed names so a brand cannot appear here under a name it does not use elsewhere.",
      },
    },
    {
      name: "experience",
      type: "textarea",
      admin: {
        description:
          "The approved related-experience paragraph. Name only engagements in the approved client directory.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "related",
      type: "relationship",
      relationTo: "solutions",
      hasMany: true,
      admin: { description: "Families a reader of this page should see next." },
    },
  ],
};
