import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { orderField } from "../fields/slug";
import { forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = () => ["/blog"];

/** Topic labels for the insights rail. No pages of their own. */
export const PostCategories: CollectionConfig = {
  slug: "postCategories",
  labels: { singular: "Insight topic", plural: "Insight topics" },
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "order"],
    group: "Resources",
    description: "Topics used to group the insights page.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths)],
    afterDelete: [revalidateAfterDelete(paths)],
  },
  fields: [
    {
      name: "key",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { position: "sidebar", description: "Stable identifier. Do not change it." },
      hooks: {
        beforeValidate: [({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value)],
      },
    },
    { name: "label", type: "text", required: true, validate: forbidsPhrases() },
    orderField,
  ],
};
