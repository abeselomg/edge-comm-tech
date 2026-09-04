import type { CollectionConfig } from "payload";
import { signedIn } from "../access";

export const Media: CollectionConfig = {
  slug: "media",
  admin: { useAsTitle: "alt", group: "Library" },
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  upload: {
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 900, height: 600, position: "centre" },
      { name: "wide", width: 1800 },
    ],
    focalPoint: true,
    mimeTypes: ["image/*", "application/pdf"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: { description: "Describe the image for screen readers and search engines." },
    },
    { name: "caption", type: "text" },
    {
      name: "credit",
      type: "text",
      admin: { description: "Photographer or source, if attribution is required." },
    },
  ],
};
