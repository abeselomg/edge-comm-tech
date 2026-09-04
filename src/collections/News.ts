import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { slugField } from "../fields/slug";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = (doc: { slug?: string | null }) => [
  "/news",
  ...(doc.slug ? [`/news/${doc.slug}`] : []),
];

export const News: CollectionConfig = {
  slug: "news",
  labels: { singular: "Article", plural: "News & insight" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date", "_status"],
    group: "Content",
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
    slugField("Page URL: /news/<slug>"),
    {
      name: "date",
      type: "date",
      required: true,
      admin: { position: "sidebar", date: { pickerAppearance: "dayOnly" } },
    },
    { name: "excerpt", type: "textarea", required: true },
    { name: "cover", type: "upload", relationTo: "media" },
    { name: "body", type: "richText" },
    {
      name: "tags",
      type: "array",
      fields: [{ name: "tag", type: "text", required: true }],
      admin: { position: "sidebar" },
    },
  ],
};
