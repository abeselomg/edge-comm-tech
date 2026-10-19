import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { slugField } from "../fields/slug";
import { confirmable } from "../fields/confirmable";
import { forbidsPhrases } from "../fields/validators";
import {
  revalidateAfterChange,
  revalidateAfterDelete,
} from "../hooks/revalidate";

const paths = (doc: { slug?: string | null }) => [
  "/careers",
  "/careers/open-positions",
  ...(doc.slug ? [`/careers/jobs/${doc.slug}`] : []),
];

/*
 * Open positions.
 *
 * THERE IS NO FIELD FOR SALARY, BENEFITS OR EMPLOYMENT CONDITIONS, AND NONE
 * MAY BE ADDED. The master approves none of them for publication.
 *
 * Required and preferred qualifications stay separate lists because the master
 * keeps them separate: collapsing them turns a preference into a barrier, and
 * candidates self-select out.
 */
export const Jobs: CollectionConfig = {
  slug: "jobs",
  labels: { singular: "Open position", plural: "Open positions" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "department", "level", "_status"],
    group: "People",
    description:
      "Published vacancies. Salary and benefits are never published — do not add fields for them.",
  },
  access: {
    read: publishedOrSignedIn,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths)],
    afterDelete: [revalidateAfterDelete(paths)],
  },
  fields: [
    { name: "title", type: "text", required: true, validate: forbidsPhrases() },
    slugField("Page URL: /careers/jobs/<slug>"),
    {
      name: "department",
      type: "text",
      required: true,
      admin: { position: "sidebar" },
      validate: forbidsPhrases(),
    },
    {
      name: "level",
      type: "select",
      required: true,
      options: [
        { label: "Executive", value: "Executive" },
        // The approved content carries "Manager" for the HR role, and the page
        // prints this value verbatim as the "Career level" row. The rest of the
        // ladder is for roles Edge has yet to post.
        { label: "Manager", value: "Manager" },
        { label: "Senior", value: "Senior" },
        { label: "Mid-level", value: "Mid-level" },
        { label: "Junior", value: "Junior" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "reports",
      type: "text",
      required: true,
      admin: { position: "sidebar", description: "Who the role reports to." },
      validate: forbidsPhrases(),
    },
    {
      name: "type",
      type: "text",
      required: true,
      admin: { position: "sidebar", description: "e.g. 'Full-time'." },
      validate: forbidsPhrases(),
    },
    {
      name: "status",
      type: "text",
      required: true,
      defaultValue: "Open",
      admin: { position: "sidebar" },
      validate: forbidsPhrases(),
    },
    {
      name: "location",
      type: "text",
      required: true,
      validate: forbidsPhrases(),
    },
    confirmable("deadline", {
      label: "Application deadline",
      description:
        "Leave the value empty and the status pending until Edge sets a date — the site then shows a visible marker rather than implying there is time.",
      defaultPendingLabel: "Deadline to be confirmed",
    }),
    {
      name: "purposeTitle",
      type: "text",
      required: true,
      admin: { description: "A one-line statement of what the role is for." },
      validate: forbidsPhrases(),
    },
    {
      name: "purpose",
      type: "textarea",
      required: true,
      validate: forbidsPhrases(),
    },
    {
      name: "scope",
      type: "textarea",
      admin: {
        description:
          "The breadth of the role, where the approved copy describes it.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "responsibilities",
      type: "array",
      minRows: 1,
      labels: { singular: "Responsibility", plural: "What the role owns" },
      fields: [
        {
          name: "item",
          type: "text",
          required: true,
          validate: forbidsPhrases(),
        },
      ],
    },
    {
      name: "required",
      type: "array",
      minRows: 1,
      labels: { singular: "Requirement", plural: "Required qualifications" },
      admin: {
        description:
          "Genuine requirements only. Anything desirable belongs in Preferred.",
      },
      fields: [
        {
          name: "item",
          type: "text",
          required: true,
          validate: forbidsPhrases(),
        },
      ],
    },
    {
      name: "preferred",
      type: "array",
      labels: { singular: "Preference", plural: "Preferred qualifications" },
      admin: {
        description:
          "What strengthens an application without being a barrier to applying.",
      },
      fields: [
        {
          name: "item",
          type: "text",
          required: true,
          validate: forbidsPhrases(),
        },
      ],
    },
    {
      name: "success",
      type: "textarea",
      required: true,
      admin: { description: "How performance in the role will be judged." },
      validate: forbidsPhrases(),
    },
  ],
};
