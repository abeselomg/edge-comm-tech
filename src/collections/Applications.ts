import type { CollectionConfig } from "payload";
import { signedIn } from "../access";

/*
 * Uploaded CVs from the two application forms.
 *
 * Deliberately not `media`, which is public by URL: a CV must never be
 * readable by an anonymous request. Every operation is staff-only. Task 2
 * hardens this further (file-size and type checks, no public URLs).
 */
export const Applications: CollectionConfig = {
  slug: "applications",
  labels: { singular: "Application file", plural: "Application files" },
  admin: { group: "Site" },
  access: { read: signedIn, create: signedIn, update: signedIn, delete: signedIn },
  upload: {
    mimeTypes: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
  fields: [],
};
