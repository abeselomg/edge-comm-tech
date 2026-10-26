import type { GlobalConfig } from "payload";
import { peopleStaff } from "../access";
import { confirmable } from "../fields/confirmable";
import { forbidsPhrases } from "../fields/validators";
import { revalidateGlobal } from "../hooks/revalidate";

const titledBody = [
  { name: "title", type: "text", required: true, validate: forbidsPhrases() },
  { name: "body", type: "textarea", required: true, validate: forbidsPhrases() },
] as const;

const itemList = (plural: string, singular: string) => ({
  type: "array" as const,
  labels: { singular, plural },
  fields: [{ name: "item", type: "text" as const, required: true, validate: forbidsPhrases() }],
});

/*
 * Everything the careers pages need that is not a vacancy or a track.
 *
 * The internship caveat is a required field, not an optional note. The master
 * publishes it in full -- applying does not guarantee placement -- and it has
 * to appear before the form, so the page cannot render without it.
 */
export const Careers: GlobalConfig = {
  slug: "careers-content",
  label: "Careers content",
  admin: {
    group: "People",
    description: "Pathways, culture, the internship programme and E-Academy settings.",
  },
  access: { read: () => true, update: peopleStaff },
  versions: { drafts: false },
  hooks: {
    afterChange: [
      revalidateGlobal([
        "/careers",
        "/careers/open-positions",
        "/careers/internships",
        "/careers/e-academy",
      ], false, ["/careers/open-positions/[slug]"]),
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Working here",
          fields: [
            {
              name: "pathways",
              type: "array",
              minRows: 1,
              labels: { singular: "Pathway", plural: "Career pathways" },
              fields: [...titledBody],
            },
            {
              name: "culture",
              type: "array",
              minRows: 1,
              labels: { singular: "Value", plural: "Culture values" },
              fields: [...titledBody],
            },
            { ...itemList("How people develop", "Point"), name: "development" },
            { ...itemList("What the experience is like", "Point"), name: "experiencePoints" },
            {
              ...itemList("Documents every application needs", "Document"),
              name: "applicationDocs",
            },
          ],
        },
        {
          label: "Internship",
          fields: [
            {
              name: "internship",
              type: "group",
              label: "Graduate internship programme",
              fields: [
                { name: "title", type: "text", required: true, validate: forbidsPhrases() },
                { name: "type", type: "text", required: true, validate: forbidsPhrases() },
                { name: "location", type: "textarea", required: true, validate: forbidsPhrases() },
                confirmable("schedule", {
                  label: "Schedule",
                  defaultPendingLabel: "Dates to be confirmed",
                }),
                confirmable("deadline", {
                  label: "Application deadline",
                  defaultPendingLabel: "Deadline to be confirmed",
                }),
                { name: "intro", type: "textarea", required: true, validate: forbidsPhrases() },
                {
                  name: "caveat",
                  type: "textarea",
                  required: true,
                  admin: {
                    description:
                      "Published in full, before the form. The master requires applicants to be told that applying does not guarantee placement — do not soften or shorten this.",
                  },
                  validate: forbidsPhrases(),
                },
                {
                  name: "tracks",
                  type: "array",
                  minRows: 1,
                  labels: { singular: "Track", plural: "Tracks" },
                  fields: [...titledBody],
                },
                { ...itemList("Eligibility", "Criterion"), name: "eligibility" },
                { ...itemList("Documents required", "Document"), name: "documents" },
                {
                  name: "structure",
                  type: "array",
                  minRows: 1,
                  labels: { singular: "Stage", plural: "Programme structure" },
                  fields: [...titledBody],
                },
                {
                  name: "selection",
                  type: "array",
                  minRows: 1,
                  labels: { singular: "Stage", plural: "Selection stages" },
                  fields: [{ name: "n", type: "number", required: true }, ...titledBody],
                },
              ],
            },
          ],
        },
        {
          label: "E-Academy",
          fields: [
            {
              name: "academyAudiences",
              type: "array",
              minRows: 1,
              labels: { singular: "Audience", plural: "Audiences" },
              fields: [
                ...titledBody,
                {
                  name: "action",
                  type: "text",
                  required: true,
                  admin: { description: "The call to action for this audience." },
                  validate: forbidsPhrases(),
                },
              ],
            },
            { ...itemList("Levels", "Level"), name: "academyLevels" },
            { ...itemList("Delivery modes", "Mode"), name: "academyDelivery" },
            {
              name: "courseSections",
              type: "array",
              minRows: 1,
              labels: { singular: "Section", plural: "Course page sections" },
              admin: {
                description:
                  "The sections every published course listing carries, so programmes can be compared properly.",
              },
              fields: [...titledBody],
            },
          ],
        },
      ],
    },
  ],
};
