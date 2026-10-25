import type { CollectionConfig } from "payload";
import { adminOnly, publishedOrSignedIn, signedIn } from "../access";
import { orderField } from "../fields/slug";
import { forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = () => ["/partners"];

/*
 * The ten capability groups the partner network is organised by.
 *
 * ringLabel exists because the partners diagram puts these on a circle, where
 * "Datacenter Facility and IT Infrastructure" does not fit and "Datacenter"
 * does. It is the same category set shorter, not a second name for it -- which
 * is why it lives beside the label rather than being derived by truncation.
 */
export const PartnerCategories: CollectionConfig = {
  slug: "partnerCategories",
  labels: { singular: "Partner category", plural: "Partner categories" },
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "ringLabel", "order"],
    group: "Content",
    description: "Capability groups used to organise and filter the partner network.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: adminOnly },
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
      admin: {
        position: "sidebar",
        description: "Stable identifier used by the filter, e.g. system-cloud. Do not change it.",
      },
      hooks: {
        beforeValidate: [({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value)],
      },
    },
    {
      name: "label",
      type: "text",
      required: true,
      admin: { description: "The full name, e.g. 'System, Computing and Cloud'." },
      validate: forbidsPhrases(),
    },
    {
      name: "ringLabel",
      type: "text",
      required: true,
      admin: {
        description:
          "A short form that fits on the partner diagram, e.g. 'Compute & Cloud'. Two or three words.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      admin: { description: "What this group covers. Shown when the group is selected." },
      validate: forbidsPhrases(),
    },
    orderField,
  ],
};
