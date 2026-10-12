import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { slugField } from "../fields/slug";
import { forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = (doc: { slug?: string | null }) => [
  "/resources",
  "/events",
  ...(doc.slug ? [`/events/${doc.slug}`] : []),
];

/*
 * Webinars, briefings and exhibitions.
 *
 * There is deliberately no `status` field. See src/lib/events.ts: it is
 * derived from endsOn ?? startsOn so it cannot go stale, and storing it would
 * give an editor a value to forget to change.
 *
 * displayDate carries the human string because it cannot be formatted back out
 * of two dates reliably -- "7-11 December 2026" is an editorial choice about
 * an en dash and a dropped month, not a date format.
 */
export const Events: CollectionConfig = {
  slug: "events",
  labels: { singular: "Event", plural: "Events" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "displayDate", "format", "_status"],
    group: "Resources",
    description:
      "Sessions Edge runs or attends. Upcoming and past are worked out from the dates — there is nothing to switch over afterwards.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths)],
    afterDelete: [revalidateAfterDelete(paths)],
  },
  fields: [
    { name: "title", type: "text", required: true, validate: forbidsPhrases() },
    slugField("Page URL: /events/<slug>"),
    {
      name: "startsOn",
      type: "date",
      required: true,
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayOnly" },
        description: "First day of the session.",
      },
    },
    {
      name: "endsOn",
      type: "date",
      validate: (value: unknown, { siblingData }: { siblingData: { startsOn?: string | null } }) => {
        if (!value || !siblingData?.startsOn) return true;
        return new Date(String(value)).getTime() >= new Date(siblingData.startsOn).getTime()
          ? true
          : "The last day cannot be before the first day.";
      },
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayOnly" },
        description:
          "Last day, for sessions running more than one day. Leave empty for a single-day event — the site then uses the start date.",
      },
    },
    {
      name: "displayDate",
      type: "text",
      required: true,
      admin: {
        description:
          "How the date reads on the page, e.g. '7–11 December 2026' or '23 October 2026'.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "category",
      type: "text",
      required: true,
      admin: { description: "e.g. 'Webinar and online event', 'International exhibition'." },
      validate: forbidsPhrases(),
    },
    {
      name: "format",
      type: "select",
      required: true,
      options: [
        { label: "Online", value: "Online" },
        { label: "In person", value: "In person" },
        { label: "Hybrid", value: "Hybrid" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "venue",
      type: "text",
      required: true,
      admin: {
        description:
          "The platform for an online session or the venue for an in-person one. 'Platform to be confirmed' is an acceptable value.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "headline",
      type: "text",
      required: true,
      admin: { description: "The promise at the top of the page. One line." },
      validate: forbidsPhrases(),
    },
    {
      name: "intro",
      type: "textarea",
      required: true,
      validate: forbidsPhrases(),
    },
    {
      name: "audience",
      type: "text",
      required: true,
      admin: { description: "Who the session is for." },
      validate: forbidsPhrases(),
    },
    {
      name: "program",
      type: "array",
      minRows: 1,
      labels: { singular: "Item", plural: "Programme" },
      fields: [{ name: "item", type: "text", required: true, validate: forbidsPhrases() }],
    },
    {
      name: "action",
      type: "text",
      required: true,
      defaultValue: "Register",
      admin: { description: "The registration button's wording, e.g. 'Register Online'." },
      validate: forbidsPhrases(),
    },
    {
      name: "pendingNote",
      type: "text",
      admin: {
        description:
          "Shown as a visible marker where something about the session is not yet confirmed.",
      },
      validate: forbidsPhrases(),
    },
  ],
};
