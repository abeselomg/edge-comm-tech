import type { CollectionConfig } from "payload";
import { adminOnly, publishedOrSignedIn, signedIn } from "../access";
import { orderField } from "../fields/slug";
import { SECTOR_OPTIONS } from "../fields/sectors";
import { forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = () => ["/", "/about", "/clients", "/projects", "/solutions"];

/*
 * The ten institutions in the approved client directory, and only those.
 * Organisations from earlier drafted models that are absent from the
 * directory were retired rather than edited, and must not be re-added here.
 *
 * There is no per-client page: the approved design has a clients index only.
 * So there is no slug field, and `order` controls the mark wall.
 */
export const Clients: CollectionConfig = {
  slug: "clients",
  labels: { singular: "Client", plural: "Clients" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "sector", "order", "_status"],
    group: "Content",
    description:
      "Institutions Edge works with. Only organisations in the approved client directory belong here.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: adminOnly },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths, { patterns: ["/projects/[slug]", "/solutions/[slug]"] })],
    afterDelete: [revalidateAfterDelete(paths, { patterns: ["/projects/[slug]", "/solutions/[slug]"] })],
  },
  fields: [
    { name: "name", type: "text", required: true, validate: forbidsPhrases() },
    orderField,
    {
      name: "sector",
      type: "select",
      required: true,
      options: [...SECTOR_OPTIONS],
      admin: { position: "sidebar" },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      filterOptions: { approved: { equals: true } },
      admin: {
        description:
          "Only approved assets can be selected. With no logo, the site sets the institution's name in the same frame the mark would occupy — which is the intended behaviour, not a gap.",
      },
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      admin: { description: "Two or three sentences on what Edge has delivered for them." },
      validate: forbidsPhrases(),
    },
    {
      name: "engagements",
      type: "relationship",
      relationTo: "projects",
      hasMany: true,
      admin: {
        description:
          "Published project records for this client. Leave empty where engagement details are not published.",
      },
    },
    {
      name: "solutions",
      type: "relationship",
      relationTo: "solutions",
      hasMany: true,
      admin: { description: "The solution families this relationship spans." },
    },
  ],
};
