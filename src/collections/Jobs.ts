import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { slugField } from "../fields/slug";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = (doc: { slug?: string | null }) => [
  "/careers",
  ...(doc.slug ? [`/careers/jobs/${doc.slug}`] : []),
];

export const Jobs: CollectionConfig = {
  slug: "jobs",
  labels: { singular: "Job", plural: "Careers" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "team", "type", "_status"],
    group: "Content",
    description: "Unpublish a role as soon as it is filled.",
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
    slugField("Page URL: /careers/jobs/<slug>"),
    { name: "team", type: "text", required: true },
    { name: "location", type: "text", required: true, defaultValue: "Addis Ababa, Ethiopia" },
    {
      name: "type",
      type: "select",
      required: true,
      defaultValue: "full-time",
      options: [
        { label: "Full time", value: "full-time" },
        { label: "Contract", value: "contract" },
        { label: "Internship", value: "internship" },
      ],
    },
    { name: "summary", type: "textarea", required: true },
    { name: "description", type: "richText" },
    {
      name: "requirements",
      type: "array",
      labels: { singular: "Requirement", plural: "Requirements" },
      fields: [{ name: "item", type: "text", required: true }],
    },
    {
      name: "relatedCourses",
      type: "relationship",
      relationTo: "courses",
      hasMany: true,
      admin: { position: "sidebar", description: "E-Academy material candidates should watch first." },
    },
  ],
};
