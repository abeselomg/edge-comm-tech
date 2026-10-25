import type { CollectionConfig } from "payload";
import { adminOnly, publishedOrSignedIn, signedIn } from "../access";
import { orderField } from "../fields/slug";
import { forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";
import { previewUrl } from "../lib/preview";

const paths = () => ["/", "/partners", "/solutions"];

/*
 * The thirty-two manufacturers and distributors Edge works with.
 *
 * THERE IS NO FIELD HERE FOR PARTNERSHIP TYPE, AUTHORIZATION LEVEL OR
 * CERTIFICATION TIER, AND NONE MAY BE ADDED.
 *
 * The content master forbids publishing any of them: they change over time and
 * are governed by each manufacturer's own agreements. Absence is the
 * enforcement mechanism -- a validator can be argued with, a missing column
 * cannot. If someone asks for "just a note field" for tier, the answer is the
 * same: it ends up rendered.
 *
 * There is no per-partner page either. Brands link to the Edge solution page
 * they belong to, never to their own site.
 */
export const Partners: CollectionConfig = {
  slug: "partners",
  labels: { singular: "Partner", plural: "Partners" },
  admin: {
    useAsTitle: "name",
    preview: (doc) => previewUrl("partners", doc),
    defaultColumns: ["name", "solution", "featured", "order"],
    group: "Content",
    description:
      "Manufacturers and distributors. Partnership tiers and authorization levels are never published — do not add fields for them.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: adminOnly },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths, { patterns: ["/solutions/[slug]", "/projects/[slug]"] })],
    afterDelete: [revalidateAfterDelete(paths, { patterns: ["/solutions/[slug]", "/projects/[slug]"] })],
  },
  fields: [
    { name: "name", type: "text", required: true, validate: forbidsPhrases() },
    orderField,
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      filterOptions: { approved: { equals: true } },
      admin: {
        description:
          "Only approved assets can be selected. With no logo, the site sets the brand's name in the same frame the mark would occupy — intended behaviour, not a gap. Dropping an approved file in here is the whole swap.",
      },
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "partnerCategories",
      hasMany: true,
      required: true,
      admin: { description: "Every group this brand belongs to. Most belong to one or two." },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar", description: "Featured brands lead the partner network." },
    },
    {
      name: "capability",
      type: "textarea",
      required: true,
      admin: {
        description:
          "What Edge delivers with this technology, in the client's terms. Describe the capability, never the relationship.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "solution",
      type: "relationship",
      relationTo: "solutions",
      required: true,
      admin: {
        description:
          "The Edge solution page this brand links to. Brand cards never link to the brand's own site.",
      },
    },
    {
      name: "projects",
      type: "relationship",
      relationTo: "projects",
      hasMany: true,
      admin: { description: "Delivered engagements where this technology was used, if published." },
    },
  ],
};
