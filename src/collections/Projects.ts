import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { slugField } from "../fields/slug";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = (doc: { slug?: string | null }) => [
  "/",
  "/projects",
  ...(doc.slug ? [`/projects/${doc.slug}`] : []),
];

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "client", "year", "_status"],
    group: "Content",
    description:
      "Delivered work. Keep a project as a draft until the client has agreed to be named publicly.",
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
    slugField("Page URL: /projects/<slug>"),
    {
      name: "client",
      type: "text",
      required: true,
      admin: { description: "Only name a client Edge has written permission to name." },
    },
    { name: "year", type: "number" },
    { name: "sector", type: "relationship", relationTo: "sectors" },
    { name: "solutions", type: "relationship", relationTo: "solutions", hasMany: true },
    {
      name: "scope",
      type: "textarea",
      required: true,
      admin: { description: "What Edge was engaged to do." },
    },
    { name: "outcome", type: "richText" },
    { name: "cover", type: "upload", relationTo: "media" },
    { name: "gallery", type: "upload", relationTo: "media", hasMany: true },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar", description: "Show on the homepage and sector pages." },
    },
  ],
};
