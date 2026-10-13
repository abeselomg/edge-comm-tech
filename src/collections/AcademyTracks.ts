import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { orderField, slugField } from "../fields/slug";
import { forbidsPhrases } from "../fields/validators";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const paths = () => ["/careers", "/careers/e-academy"];

/*
 * E-Academy training tracks.
 *
 * Each track teaches a solution family Edge actually implements, which is why
 * `solution` is required: the academy is not a separate catalogue of courses,
 * it teaches the work. A track with no solution behind it would be a course
 * Edge does not do.
 *
 * The slug is an anchor on the E-Academy page. These have no pages of their
 * own; individual courses are published per intake, which Phase 6 handles.
 */
export const AcademyTracks: CollectionConfig = {
  slug: "academyTracks",
  labels: { singular: "Academy track", plural: "Academy tracks" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "solution", "order", "_status"],
    group: "People",
    description: "Training tracks, each mapped to a solution family Edge delivers.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    afterChange: [revalidateAfterChange(paths)],
    afterDelete: [revalidateAfterDelete(paths)],
  },
  fields: [
    { name: "title", type: "text", required: true, validate: forbidsPhrases() },
    slugField("Anchor on the E-Academy page. Not a page of its own."),
    orderField,
    {
      name: "body",
      type: "textarea",
      required: true,
      admin: { description: "What the track covers." },
      validate: forbidsPhrases(),
    },
    {
      name: "solution",
      type: "relationship",
      relationTo: "solutions",
      required: true,
      filterOptions: { _status: { equals: "published" } },
      admin: {
        description:
          "The family this track teaches. Required — a track with no solution behind it is a course Edge does not deliver.",
      },
    },
  ],
};
