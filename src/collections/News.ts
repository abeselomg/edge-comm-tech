import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { orderField, slugField } from "../fields/slug";
import { confirmable } from "../fields/confirmable";
import { forbidsPhrases, richTextGuard } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = (doc: { slug?: string | null }) => [
  "/resources",
  "/news",
  ...(doc.slug ? [`/news/${doc.slug}`] : []),
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
    defaultColumns: ["title", "kind", "archive", "_status"],
    group: "Resources",
    description: "Milestones, partnership and project announcements, and company updates.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths)],
    afterDelete: [revalidateAfterDelete(paths)],
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
      required: true,
      // richTextGuard, not forbidsPhrases: a Lexical body can embed an image,
      // and the editor's upload picker cannot be narrowed to approved assets.
      validate: richTextGuard(),
    },
    orderField,
  ],
};
