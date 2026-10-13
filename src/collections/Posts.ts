import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { orderField, slugField } from "../fields/slug";
import { forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

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
    defaultColumns: ["title", "category", "order", "_status"],
    group: "Resources",
    description:
      "Short articles, published in full on the insights page. They have no separate pages — each one links through to the solution it introduces.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths)],
    afterDelete: [revalidateAfterDelete(paths)],
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
      validate: forbidsPhrases(),
    },
    {
      name: "target",
      type: "relationship",
      relationTo: "solutions",
      required: true,
      admin: { description: "The solution family this article's Read More goes to." },
    },
    {
      name: "anchor",
      type: "text",
      admin: {
        description:
          "Optional. The capability heading on that solution page to jump to. Leave empty to link to the top of the page — one article has no single matching capability and does exactly that.",
      },
      validate: forbidsPhrases(),
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
