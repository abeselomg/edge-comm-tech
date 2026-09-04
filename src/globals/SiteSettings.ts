import type { GlobalConfig } from "payload";
import { signedIn } from "../access";
import { revalidateGlobal } from "../hooks/revalidate";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site settings",
  admin: { group: "Site", description: "Navigation, contact details, and footer." },
  access: { read: () => true, update: signedIn },
  hooks: { afterChange: [revalidateGlobal([], true)] },
  fields: [
    {
      name: "nav",
      type: "array",
      labels: { singular: "Link", plural: "Main navigation" },
      minRows: 1,
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
    {
      name: "headerCta",
      type: "group",
      fields: [
        { name: "label", type: "text", required: true, defaultValue: "Book a consultation" },
        { name: "href", type: "text", required: true, defaultValue: "/contact" },
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
        { name: "phone", type: "text" },
        { name: "secondaryPhone", type: "text" },
        { name: "email", type: "email" },
        { name: "address", type: "textarea" },
        { name: "mapUrl", type: "text" },
        {
          name: "verified",
          type: "checkbox",
          defaultValue: false,
          admin: { description: "Tick when every field above is real and answered." },
        },
      ],
    },
    {
      name: "social",
      type: "array",
      labels: { singular: "Profile", plural: "Social profiles" },
      fields: [
        { name: "platform", type: "text", required: true },
        { name: "url", type: "text", required: true },
      ],
    },
    { name: "footerNote", type: "text", required: true },
  ],
};
