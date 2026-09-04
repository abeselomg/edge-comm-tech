import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { orderField, slugField } from "../fields/slug";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = (doc: { slug?: string | null; modules?: ({ lessons?: ({ slug: string } | null)[] | null } | null)[] | null } ) => [
  "/academy",
  ...(doc.slug ? [`/academy/${doc.slug}`] : []),
  ...(doc.slug
    ? (doc.modules ?? []).flatMap((mod) =>
        (mod?.lessons ?? []).map((lesson) => `/academy/${doc.slug}/${lesson?.slug}`),
      )
    : []),
];

export const Courses: CollectionConfig = {
  slug: "courses",
  labels: { singular: "Course", plural: "E-Academy courses" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "level", "duration", "_status"],
    group: "E-Academy",
    description: "Public courses. Modules and lessons are edited inside each course.",
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
    slugField("Page URL: /academy/<slug>"),
    orderField,
    {
      name: "audience",
      type: "text",
      required: true,
      admin: { description: "Who this is for, e.g. 'Candidates for network and security roles'." },
    },
    {
      name: "duration",
      type: "text",
      required: true,
      admin: { description: "Plain language, e.g. 'About 1 week of watching'." },
    },
    {
      name: "level",
      type: "select",
      required: true,
      defaultValue: "all",
      options: [
        { label: "All levels", value: "all" },
        { label: "Beginner", value: "beginner" },
        { label: "Intermediate", value: "intermediate" },
        { label: "Advanced", value: "advanced" },
      ],
    },
    { name: "summary", type: "textarea", required: true },
    {
      name: "outcomes",
      type: "array",
      labels: { singular: "Outcome", plural: "What you will learn" },
      fields: [{ name: "item", type: "text", required: true }],
    },
    {
      name: "modules",
      type: "array",
      labels: { singular: "Module", plural: "Modules" },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "summary", type: "textarea", required: true },
        {
          name: "lessons",
          type: "array",
          labels: { singular: "Lesson", plural: "Lessons" },
          minRows: 1,
          admin: { initCollapsed: true },
          fields: [
            { name: "title", type: "text", required: true },
            {
              name: "slug",
              type: "text",
              required: true,
              admin: { description: "URL segment: /academy/<course>/<slug>. Must be unique within this course." },
              hooks: {
                beforeValidate: [
                  ({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value),
                ],
              },
            },
            { name: "duration", type: "text", required: true, admin: { description: "e.g. '12 min'" } },
            {
              name: "videoUrl",
              type: "text",
              admin: { description: "YouTube watch or youtu.be link. Leave blank for a reading-only lesson." },
            },
            { name: "body", type: "richText" },
          ],
        },
      ],
    },
    {
      name: "relatedSolutions",
      type: "relationship",
      relationTo: "solutions",
      hasMany: true,
      admin: { position: "sidebar" },
    },
    {
      name: "relatedJobs",
      type: "relationship",
      relationTo: "jobs",
      hasMany: true,
      admin: { position: "sidebar", description: "Roles this course prepares candidates for." },
    },
  ],
};
