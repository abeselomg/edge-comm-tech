import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { orderField, slugField } from "../fields/slug";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = (doc: { slug?: string | null }) => [
  "/",
  "/clients",
  ...(doc.slug ? [`/clients/${doc.slug}`] : []),
];

export const Sectors: CollectionConfig = {
  slug: "sectors",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "order", "_status"],
    group: "Content",
    description: "The industries Edge serves.",
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
    slugField("Page URL: /clients/<slug>"),
    orderField,
    {
      name: "line",
      type: "textarea",
      required: true,
      admin: { description: "One sentence on what technology reliability means in this sector." },
    },
    { name: "body", type: "richText" },
    {
      name: "pressures",
      type: "array",
      labels: { singular: "Pressure", plural: "Operating pressures" },
      admin: { description: "Regulatory, uptime, or audit pressures specific to this sector." },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "detail", type: "textarea", required: true },
      ],
    },
    {
      name: "solutions",
      type: "relationship",
      relationTo: "solutions",
      hasMany: true,
      admin: { description: "Domains most often engaged by this sector." },
    },
  ],
};
