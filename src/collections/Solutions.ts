import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { orderField, slugField } from "../fields/slug";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = (doc: { slug?: string | null }) => [
  "/",
  "/solutions",
  ...(doc.slug ? [`/solutions/${doc.slug}`] : []),
];

export const Solutions: CollectionConfig = {
  slug: "solutions",
  labels: { singular: "Solution domain", plural: "Solution domains" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "order", "_status"],
    group: "Content",
    description: "The core technology domains. These are the main pages buyers land on from search.",
  },
  access: {
    read: publishedOrSignedIn,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  versions: { drafts: true },
  hooks: {
    afterChange: [revalidateAfterChange(paths)],
    afterDelete: [revalidateAfterDelete(paths)],
  },
  fields: [
    { name: "title", type: "text", required: true },
    slugField("Page URL: /solutions/<slug>"),
    orderField,
    {
      name: "headline",
      type: "text",
      required: true,
      admin: { description: "Short promise, shown under the title. One line." },
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      admin: { description: "Two or three sentences describing the domain. Used on cards and in search results." },
    },
    {
      name: "overview",
      type: "richText",
      admin: { description: "The main body of the page." },
    },
    {
      name: "capabilities",
      type: "array",
      labels: { singular: "Capability", plural: "Capabilities" },
      admin: {
        description:
          "What this domain actually delivers. Name the industry term (HCI, NAC, rPDU) and say what it does for the client — buyers search these terms.",
      },
      fields: [
        { name: "name", type: "text", required: true },
        {
          name: "acronym",
          type: "text",
          admin: { description: "Optional. The industry abbreviation, e.g. NAC." },
        },
        { name: "valueLine", type: "textarea", required: true },
      ],
    },
    {
      name: "scopeOfWork",
      type: "array",
      labels: { singular: "Scope item", plural: "Scope of work" },
      admin: { description: "What a typical engagement in this domain includes." },
      fields: [{ name: "item", type: "text", required: true }],
    },
    {
      name: "deliverables",
      type: "array",
      labels: { singular: "Deliverable", plural: "Deliverables" },
      admin: { description: "What the client is handed at the end." },
      fields: [{ name: "item", type: "text", required: true }],
    },
    {
      name: "technologies",
      type: "relationship",
      relationTo: "partners",
      hasMany: true,
      admin: { description: "Vendors and platforms used in this domain." },
    },
  ],
};
