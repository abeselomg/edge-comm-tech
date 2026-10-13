import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { orderField } from "../fields/slug";
import { forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = () => ["/resources", "/downloads"];

/*
 * Documents the site offers.
 *
 * `approved` is separate from the file: a document can exist here, be listed
 * with its status, and still not be downloadable. The master requires each one
 * to be checked against the current solution taxonomy first, and listing a
 * document honestly as under review is better than hiding it or serving a
 * version that contradicts the site.
 */
export const Downloads: CollectionConfig = {
  slug: "downloads",
  labels: { singular: "Download", plural: "Downloads" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "approved", "_status"],
    group: "Resources",
    description:
      "Company profile, brochures, datasheets and vendor catalogues. Until Approved is ticked, the site lists the document and routes the request to the team instead of serving the file.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths)],
    afterDelete: [revalidateAfterDelete(paths)],
  },
  fields: [
    { name: "title", type: "text", required: true, validate: forbidsPhrases() },
    orderField,
    {
      name: "category",
      type: "text",
      required: true,
      admin: {
        position: "sidebar",
        description: "e.g. 'Company profile', 'Solution brochure', 'Datasheet'.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "owner",
      type: "text",
      required: true,
      admin: { position: "sidebar", description: "Who owns the document, e.g. 'Edge Comm-Tech'." },
      validate: forbidsPhrases(),
    },
    {
      name: "meta",
      type: "text",
      required: true,
      admin: { description: "Format and version, e.g. 'PDF · English · Version 13'." },
      validate: forbidsPhrases(),
    },
    {
      name: "note",
      type: "textarea",
      admin: {
        description: "The reviewer's note on what still needs checking before this is offered.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "file",
      type: "upload",
      relationTo: "media",
      filterOptions: { approved: { equals: true } },
      admin: {
        description:
          "The document itself. Only approved assets can be selected. Can be empty while it is still being prepared.",
      },
    },
    {
      name: "approved",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Tick only when the document has been checked against the current solution taxonomy. Until then the site offers to send it on request.",
      },
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        if (!value) return true;
        if (siblingData?.file) return true;
        return "Attach the file before approving it for download.";
      },
    },
  ],
};
