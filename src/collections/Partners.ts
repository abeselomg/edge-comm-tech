import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = () => ["/", "/partners", "/solutions"];

export const Partners: CollectionConfig = {
  slug: "partners",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "ring", "_status"],
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
    { name: "name", type: "text", required: true },
    {
      name: "label",
      type: "text",
      required: true,
      admin: { description: "What we use them for, in two or three words. Shown under the name." },
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Data Center", value: "data-center" },
        { label: "Cloud & Data", value: "cloud" },
        { label: "Network", value: "network" },
        { label: "Cybersecurity", value: "cyber" },
        { label: "Applications", value: "applications" },
      ],
    },
    {
      name: "ring",
      type: "select",
      required: true,
      defaultValue: "0",
      options: [
        { label: "Inner ring (primary)", value: "0" },
        { label: "Outer ring (secondary)", value: "1" },
      ],
      admin: { description: "Position in the partner diagram on /partners." },
    },
    { name: "logo", type: "upload", relationTo: "media" },
    { name: "website", type: "text" },
    {
      name: "blurb",
      type: "textarea",
      admin: { description: "Optional. One or two sentences on the relationship." },
    },
  ],
};
