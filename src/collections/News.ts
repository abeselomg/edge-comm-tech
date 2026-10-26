import type { CollectionConfig } from "payload";
import { isKnownRoute, newsHref } from "../lib/routes";
import { adminOnly, contentRead, contentStaff } from "../access";
import { orderField, slugField } from "../fields/slug";
import { confirmable } from "../fields/confirmable";
import { forbidsPhrases, richTextGuard } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";
import { previewUrl } from "../lib/preview";

export const paths = (doc: { slug?: string | null }) => [
  "/resources",
  "/news",
  ...(doc.slug ? [newsHref(doc.slug)] : []),
];

/*
 * Company news and announcements.
 *
 * `archive` keeps the 2018 founding milestone out of the current feed without
 * deleting it: it belongs in an archive band, not presented as news.
 */
export const News: CollectionConfig = {
  slug: "news",
  labels: { singular: "News item", plural: "News and announcements" },
  admin: {
    useAsTitle: "title",
    preview: (doc) => previewUrl("news", doc),
    defaultColumns: ["title", "kind", "archive", "_status"],
    group: "Resources",
    description: "Milestones, partnership and project announcements, and company updates.",
  },
  access: { read: contentRead, create: contentStaff, update: contentStaff, delete: adminOnly },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths, { patterns: ["/news/[slug]", "/resources/media/[slug]"] })],
    afterDelete: [revalidateAfterDelete(paths, { patterns: ["/news/[slug]", "/resources/media/[slug]"] })],
  },
  fields: [
    { name: "title", type: "text", required: true, validate: forbidsPhrases() },
    slugField("Page URL: /news/<slug>"),
    {
      name: "kind",
      type: "text",
      required: true,
      admin: {
        position: "sidebar",
        description: "e.g. 'Company milestone', 'Company news', 'Insight'.",
      },
      validate: forbidsPhrases(),
    },
    confirmable("date", {
      label: "Date",
      description:
        "How the date reads, e.g. '2018' or 'Evergreen'. Leave the value empty and the status pending where Edge has not confirmed it.",
      defaultPendingLabel: "Date to confirm",
    }),
    {
      name: "archive",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Ticked items move to the archive band instead of the current feed. Use for older milestones.",
      },
    },
    {
      name: "standfirst",
      type: "textarea",
      required: true,
      admin: { description: "The opening paragraph, shown on the index and under the headline." },
      validate: forbidsPhrases(),
    },
    {
      name: "body",
      type: "richText",
      // Not required: an item can be all titled sections and no running text.
      // richTextGuard, not forbidsPhrases: a Lexical body can embed an image,
      // and the editor's upload picker cannot be narrowed to approved assets.
      validate: richTextGuard(),
    },
    {
      name: "sections",
      type: "array",
      labels: { singular: "Section", plural: "Sections" },
      admin: {
        description:
          "Titled sections under the opening text. Each shows a 'Priority' label above its heading.",
      },
      fields: [
        { name: "title", type: "text", required: true, validate: forbidsPhrases() },
        { name: "body", type: "textarea", required: true, validate: forbidsPhrases() },
      ],
    },
    {
      name: "heldForPublication",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Tick while details are still outstanding. The article then lists them under 'Details to add before publishing' instead of presenting itself as complete.",
      },
    },
    {
      name: "pendingFields",
      type: "array",
      labels: { singular: "Outstanding detail", plural: "Outstanding details" },
      admin: {
        description:
          "What is still needed before this can be published as complete, e.g. 'Date and venue'. Clear the list and untick Held when it is all supplied.",
      },
      fields: [{ name: "item", type: "text", required: true, validate: forbidsPhrases() }],
    },
    {
      name: "closing",
      type: "group",
      label: "Closing block",
      admin: { description: "An optional boxed look-ahead under the article, with up to two links." },
      fields: [
        { name: "eyebrow", type: "text", validate: forbidsPhrases() },
        { name: "title", type: "text", validate: forbidsPhrases() },
        { name: "body", type: "textarea", validate: forbidsPhrases() },
        {
          name: "links",
          type: "array",
          maxRows: 2,
          labels: { singular: "Link", plural: "Links" },
          fields: [
            { name: "label", type: "text", required: true, validate: forbidsPhrases() },
            {
              name: "href",
              type: "text",
              required: true,
              admin: { description: "A page on this site, e.g. /about. Not a .html file." },
              validate: (value: unknown) => {
                const path = typeof value === "string" ? value.split("#")[0] : "";
                return isKnownRoute(path)
                  ? true
                  : "Use a page this site serves, such as /about or /projects.";
              },
            },
          ],
        },
      ],
    },
    orderField,
  ],
};
