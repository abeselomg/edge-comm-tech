import type { CollectionConfig } from "payload";
import { projectHref } from "../lib/routes";
import { publishedOrSignedIn, signedIn } from "../access";
import { orderField, slugField } from "../fields/slug";
import { SECTOR_OPTIONS } from "../fields/sectors";
import { confirmable } from "../fields/confirmable";
import { PROJECT_RULES, forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

export const paths = (doc: { slug?: string | null }) => [
  "/",
  "/clients",
  "/partners",
  "/projects",
  "/services",
  "/solutions",
  ...(doc.slug ? [projectHref(doc.slug)] : []),
];

/*
 * The eight documented engagements.
 *
 * Every free-text field here validates against PROJECT_RULES rather than the
 * base rules, which adds one project-only rule: the approved wording for Bahir
 * Dar's campus spaces is "campus security control room", never "SOC". That
 * rule is scoped to this collection because SOC is correct on the
 * cybersecurity solution page.
 *
 * No contract values and no invented quantities. The master publishes neither.
 */
const projectText = forbidsPhrases(PROJECT_RULES);

export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: "Project", plural: "Projects" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "client", "sector", "_status"],
    group: "Content",
    description: "Delivered engagements, written as case records rather than marketing.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths, { patterns: ["/solutions/[slug]", "/projects/[slug]"] })],
    afterDelete: [revalidateAfterDelete(paths, { patterns: ["/solutions/[slug]", "/projects/[slug]"] })],
  },
  fields: [
    { name: "title", type: "text", required: true, validate: projectText },
    slugField("Page URL: /projects/<slug>"),
    {
      name: "client",
      type: "relationship",
      relationTo: "clients",
      required: true,
      admin: { description: "Must be an institution in the approved client directory." },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "The featured engagement leads the projects index. Tick one.",
      },
    },
    {
      name: "sector",
      type: "select",
      required: true,
      options: [...SECTOR_OPTIONS],
      admin: { position: "sidebar" },
    },
    {
      name: "sectorFull",
      type: "text",
      admin: {
        description:
          "The longer sector description shown on the project page, e.g. 'Higher Education'.",
      },
      validate: projectText,
    },
    {
      name: "location",
      type: "text",
      required: true,
      admin: { description: "Where the work happened, e.g. 'Bahir Dar — university campuses'." },
      validate: projectText,
    },
    confirmable("year", {
      label: "Period",
      description:
        "When the work ran, e.g. '2024/2025'. Leave the value empty and the status pending where Edge has not confirmed it.",
      defaultPendingLabel: "Year to confirm",
      // PROJECT_RULES, not the default base set: without this, these two text
      // fields would be the only prose in this collection the SOC rule misses.
      rules: PROJECT_RULES,
    }),
    {
      name: "primary",
      type: "text",
      required: true,
      admin: { description: "The focus in a few words, e.g. 'Smart learning and collaboration'." },
      validate: projectText,
    },
    {
      name: "headline",
      type: "text",
      admin: {
        description:
          "The promise at the top of the project page, where the approved copy has one distinct from the title.",
      },
      validate: projectText,
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      admin: { description: "Two or three sentences. Used on the index and in search results." },
      validate: projectText,
    },
    {
      name: "solutions",
      type: "relationship",
      relationTo: "solutions",
      hasMany: true,
      required: true,
      admin: {
        description:
          "The families this engagement drew on. CCTV, access control and barriers belong to Datacenter and IT Infrastructure, not Cybersecurity.",
      },
    },
    {
      name: "tech",
      type: "array",
      labels: { singular: "Technology", plural: "Technologies used" },
      admin: { description: "Named platforms, e.g. PeopleLink, IQBoard, NEARITY." },
      fields: [{ name: "item", type: "text", required: true, validate: projectText }],
    },
    {
      name: "need",
      type: "textarea",
      required: true,
      admin: { description: "What the client needed, before any mention of what Edge did." },
      validate: projectText,
    },
    {
      name: "scope",
      // A list, not a paragraph: the approved project page renders these as a
      // numbered sequence of what the engagement covered, one line per step.
      type: "array",
      minRows: 1,
      labels: { singular: "Scope item", plural: "What the engagement covered" },
      admin: { description: "What the engagement covered, one step per row, in order." },
      fields: [{ name: "item", type: "text", required: true, validate: projectText }],
    },
    {
      name: "delivered",
      type: "array",
      labels: { singular: "Item", plural: "What was delivered" },
      minRows: 1,
      // A heading and a paragraph, not a bare line: the approved project page
      // renders each of these as a card with its own title above the body.
      // `outcomes` and `scope` below are genuinely flat lists of sentences.
      fields: [
        { name: "title", type: "text", required: true, validate: projectText },
        { name: "body", type: "textarea", required: true, validate: projectText },
      ],
    },
    {
      name: "outcomes",
      type: "array",
      labels: { singular: "Outcome", plural: "Outcomes" },
      fields: [{ name: "item", type: "text", required: true, validate: projectText }],
    },
    {
      name: "technology",
      // A sentence, not a list. `tech` above holds the named platforms that
      // render as brand chips; this is the paragraph above them describing
      // what was deployed. The two were modelled the wrong way round.
      type: "textarea",
      admin: {
        description:
          "One or two sentences on what was deployed. The named platforms go in Technologies used, above.",
      },
      validate: projectText,
    },
    {
      name: "technologyNote",
      type: "textarea",
      admin: { description: "A qualification on the technology list, if the approved copy has one." },
      validate: projectText,
    },
    {
      name: "training",
      type: "textarea",
      admin: { description: "Knowledge transfer and training delivered at handover." },
      validate: projectText,
    },
    {
      name: "privacy",
      type: "textarea",
      admin: {
        description:
          "Any privacy or data-handling note the client requires alongside this record.",
      },
      validate: projectText,
    },
    orderField,
  ],
};
