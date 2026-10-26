import type { CollectionConfig } from "payload";
import { contentStaff, signedInField } from "../access";

export const Media: CollectionConfig = {
  slug: "media",
  admin: { useAsTitle: "alt", group: "Library" },
  access: {
    read: () => true,
    create: contentStaff,
    update: contentStaff,
    delete: contentStaff,
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
    {
      name: "provenance",
      type: "group",
      label: "Where this came from",
      // `reviewedBy` is a colleague's name and `source` can be an internal
      // handover location. The collection itself is world-readable because the
      // site serves media files from their URLs, so the restriction goes here
      // rather than on the collection. Server-side reads are unaffected.
      access: { read: signedInField },
      admin: {
        description:
          "The content master allows publishing only assets whose source, retrieval date and internal reviewer are recorded. Fill these in before ticking Approved.",
      },
      fields: [
        {
          name: "source",
          type: "text",
          admin: {
            description:
              "Where the file came from — a brand's own press kit URL, the client's handover pack, or the name of the Edge photographer.",
          },
        },
        {
          name: "retrievedAt",
          type: "date",
          admin: { description: "The day it was obtained." },
        },
        {
          name: "reviewedBy",
          type: "text",
          admin: {
            description: "Who at Edge checked that publishing this is permitted.",
          },
        },
      ],
    },
    {
      name: "approved",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Until this is ticked, the file cannot be selected as a logo anywhere on the site. The brand's name is shown instead.",
      },
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        if (!value) return true;
        const p = (siblingData?.provenance ?? {}) as Record<string, unknown>;
        // Strip invisibles before testing. A plain truthiness check counts
        // "   " as a recorded source, which would let an editor approve an
        // asset with three spaces where its licence should be. Neither field
        // is `required` and Payload's text validator does not trim, so nothing
        // else catches it. trim() alone is not enough: a non-breaking space
        // arrives whenever someone pastes from a web page, and zero-width
        // characters survive trim() entirely while being wholly invisible.
        const recorded = (v: unknown) =>
          typeof v === "string"
            ? v.replace(/[​-‍⁠﻿]/g, "").trim().length > 0
            : Boolean(v);
        const missing = (["source", "retrievedAt", "reviewedBy"] as const).filter(
          (k) => !recorded(p[k]),
        );
        if (missing.length === 0) return true;
        return `Record ${missing.join(", ")} under "Where this came from" before approving this asset.`;
      },
    },
  ],
};
