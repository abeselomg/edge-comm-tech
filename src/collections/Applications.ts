import type { CollectionConfig } from "payload";
import { signedIn } from "../access";

/*
 * Uploaded CVs from the two application forms.
 *
 * Deliberately not `media`, which is public by URL: a CV must never be
 * readable by an anonymous request. Every operation is staff-only, and
 * `disablePayloadAccessControl` is left unset so file URLs go through the same
 * access check as the API (an anonymous GET of a file is refused).
 *
 * Files are stored in the `applications` directory (or the `applications/`
 * prefix of the S3 bucket). The form route enforces size and emptiness before
 * anything reaches here; this collection restricts the type.
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
