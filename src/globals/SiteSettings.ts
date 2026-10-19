import type { GlobalConfig } from "payload";
import { adminOnly } from "../access";
import { forbidsPhrases, requiresScopeQualifier } from "../fields/validators";
import { revalidateGlobal } from "../hooks/revalidate";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site settings",
  admin: {
    group: "Site",
    description: "Navigation, contact details, and footer.",
  },
  // Admin-only: navigation and the footer appear on every page.
  access: { read: () => true, update: adminOnly },
  hooks: { afterChange: [revalidateGlobal([], true)] },
  fields: [
    {
      name: "nav",
      type: "array",
      labels: { singular: "Link", plural: "Main navigation" },
      minRows: 1,
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          validate: forbidsPhrases(),
        },
        {
          name: "href",
          type: "text",
          required: true,
          validate: forbidsPhrases(),
        },
      ],
    },
    {
      name: "headerCta",
      type: "group",
      admin: {
        description:
          "The gold button in the header. The approved build says 'Contact us' and links to /contact.",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          defaultValue: "Contact us",
          validate: forbidsPhrases(),
        },
        {
          name: "href",
          type: "text",
          required: true,
          defaultValue: "/contact",
          validate: forbidsPhrases(),
        },
      ],
    },
    {
      name: "contact",
      type: "group",
      admin: {
        description:
          "Real contact details only. Nothing here reaches the public site until 'Verified' is ticked — a placeholder phone number on a live site costs more trust than an empty one.",
      },
      fields: [
        { name: "phone", type: "text", validate: forbidsPhrases() },
        { name: "secondaryPhone", type: "text", validate: forbidsPhrases() },
        { name: "email", type: "email" },
        { name: "address", type: "textarea", validate: forbidsPhrases() },
        { name: "mapUrl", type: "text", validate: forbidsPhrases() },
        {
          name: "verified",
          type: "checkbox",
          defaultValue: false,
          admin: {
            description: "Tick when every field above is real and answered.",
          },
        },
      ],
    },
    {
      name: "social",
      type: "array",
      labels: { singular: "Profile", plural: "Social profiles" },
      fields: [
        {
          name: "platform",
          type: "text",
          required: true,
          validate: forbidsPhrases(),
        },
        {
          name: "url",
          type: "text",
          required: true,
          validate: forbidsPhrases(),
        },
      ],
    },
    {
      /*
       * Optional, and deliberately so. The approved content has no production
       * footer line: Highland's footer composes the copyright from the legal
       * name and the current year, and its only other line is the review
       * build's own "content pending final approval" marker, which must not
       * ship as site copy. A required field with nothing approved to put in it
       * forces a placeholder, and the rule this schema already follows for
       * contact details applies here too -- an empty line costs less trust
       * than an invented one. The footer renders this only when set.
       */
      name: "footerNote",
      type: "text",
      admin: {
        description:
          "An optional extra line in the footer, under the copyright. Leave empty unless there is something approved to say.",
      },
      validate: forbidsPhrases(),
    },
    {
      name: "impact",
      type: "array",
      maxRows: 4,
      labels: { singular: "Counter", plural: "Impact counters" },
      admin: {
        description:
          "The four figures across the site. A percentage figure must carry its qualifier — the master requires 'against agreed project scope' wherever the completion figure appears.",
      },
      fields: [
        {
          name: "figure",
          type: "text",
          required: true,
          admin: { description: "e.g. '67+', '100%'." },
          validate: forbidsPhrases(),
        },
        {
          name: "unit",
          type: "text",
          required: true,
          admin: { description: "e.g. 'projects', 'completion'." },
          validate: forbidsPhrases(),
        },
        {
          name: "line",
          type: "text",
          required: true,
          admin: { description: "The qualifying sentence under the figure." },
          validate: requiresScopeQualifier(),
        },
      ],
    },
    {
      name: "impactSupport",
      type: "text",
      admin: { description: "The line under the counters." },
      validate: forbidsPhrases(),
    },
  ],
};
