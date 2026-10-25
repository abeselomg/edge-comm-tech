import type { CollectionConfig } from "payload";
import { adminOnly, publishedOrSignedIn, signedIn } from "../access";
import { orderField, slugField } from "../fields/slug";
import { forbidsPhrases, richTextGuard } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";
import { previewUrl } from "../lib/preview";

/*
 * Insights.
 *
 * THESE HAVE NO DETAIL PAGES, AND NONE MAY BE ADDED.
 *
 * The content master is explicit: "do not create thin article-detail pages
 * containing the same short copy solely to insert another click." The articles
 * are short by design and publish in full on /blog; the Read More goes to the
 * solution capability each one introduces.
 *
 * So the slug here is an anchor on /blog, not a URL, and the revalidation
 * paths list no per-post route. If someone asks for article pages, the answer
 * is in the master.
 */
const paths = () => ["/", "/blog", "/resources"];

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Insight", plural: "Insights" },
  admin: {
    useAsTitle: "title",
    preview: (doc) => previewUrl("posts", doc),
    defaultColumns: ["title", "category", "order", "_status"],
    group: "Resources",
    description:
      "Short articles, published in full on the insights page. They have no separate pages — each one links through to the solution it introduces.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: adminOnly },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths, { patterns: ["/solutions/[slug]"] })],
    afterDelete: [revalidateAfterDelete(paths, { patterns: ["/solutions/[slug]"] })],
  },
  fields: [
    { name: "title", type: "text", required: true, validate: forbidsPhrases() },
    slugField("Anchor on the insights page: /blog#post-<slug>. Not a page of its own."),
    orderField,
    {
      name: "category",
      type: "relationship",
      relationTo: "postCategories",
      required: true,
    },
    {
      name: "body",
      type: "richText",
      required: true,
      admin: {
        description:
          "Two or three paragraphs. Short is the point — the solution page carries the depth.",
      },
      // richTextGuard, not forbidsPhrases: a Lexical body can embed an image,
      // and the editor's upload picker cannot be narrowed to approved assets.
      validate: richTextGuard(),
    },
    {
      name: "target",
      type: "relationship",
      relationTo: "solutions",
      required: true,
      // Only published solutions. Solutions read as publishedOrSignedIn, so a
      // draft target gives the public a 404 behind a Read More link that an
      // editor sees working, because they are signed in.
      filterOptions: { _status: { equals: "published" } },
      admin: { description: "The solution family this article's Read More goes to." },
    },
    {
      name: "anchor",
      type: "text",
      admin: {
        description:
          "Optional. The capability heading on that solution page to jump to. Leave empty to link to the top of the page — one article has no single matching capability and does exactly that.",
      },
      // The description invites typing a heading, and a heading is not a URL
      // fragment: "Private RAG" would build /solutions/x#Private RAG. Normalise
      // to the form a heading id actually takes, then reject anything the
      // normaliser could not rescue so the editor is told rather than left with
      // a link that silently goes nowhere.
      hooks: {
        beforeValidate: [
          ({ value }) =>
            typeof value === "string"
              ? value
                  .trim()
                  .toLowerCase()
                  .replace(/^#+/, "")
                  .replace(/[\s_]+/g, "-")
                  .replace(/[^a-z0-9-]/g, "")
                  .replace(/-{2,}/g, "-")
                  .replace(/^-|-$/g, "")
              : value,
        ],
      },
      validate: (value: unknown, options?: { required?: boolean }) => {
        const phrases = forbidsPhrases()(value, options);
        if (phrases !== true) return phrases;
        if (typeof value !== "string" || value === "") return true;
        return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
          ? true
          : "An anchor can only contain lowercase letters, numbers and single hyphens, because it becomes the #fragment in the link.";
      },
    },
    {
      name: "readMoreLabel",
      type: "text",
      required: true,
      admin: { description: "The link's wording, e.g. 'Read more about Private RAG…'." },
      validate: forbidsPhrases(),
    },
  ],
};
