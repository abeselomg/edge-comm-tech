import type { GlobalConfig } from "payload";
import { adminOnly } from "../access";
import { forbidsPhrases, requiresScopeQualifier } from "../fields/validators";
import { revalidateGlobal } from "../hooks/revalidate";

/*
 * Validator for an impact counter's `line`.
 *
 * `requiresScopeQualifier(value, siblingData)` cannot be attached directly.
 * Payload calls a field validator as `validate(value, options)`, where the
 * sibling values arrive as `options.siblingData` -- so passing the function
 * straight in hands it the whole options object as its second argument, finds
 * no `figure` on it, and passes every value. It would also replace Payload's
 * default validator and so switch `required` off, and skip the phrase rules.
 * This wrapper unpacks `siblingData` and runs the phrase/required check first.
 */
const phrases = forbidsPhrases();
export const impactLineValidator = (
  value: unknown,
  options?: { required?: boolean; siblingData?: { figure?: string | null } },
): true | string => {
  const base = phrases(value, options);
  if (base !== true) return base;
  return requiresScopeQualifier(value, options?.siblingData ?? {});
};

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site settings",
  admin: { group: "Site", description: "Navigation, contact details, and footer." },
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
        { name: "label", type: "text", required: true, validate: forbidsPhrases() },
        { name: "href", type: "text", required: true, validate: forbidsPhrases() },
      ],
    },
    {
      name: "headerCta",
      type: "group",
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          defaultValue: "Book a consultation",
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
          admin: { description: "Tick when every field above is real and answered." },
        },
      ],
    },
    {
      name: "social",
      type: "array",
      labels: { singular: "Profile", plural: "Social profiles" },
      fields: [
        { name: "platform", type: "text", required: true, validate: forbidsPhrases() },
        { name: "url", type: "text", required: true, validate: forbidsPhrases() },
      ],
    },
    { name: "footerNote", type: "text", required: true, validate: forbidsPhrases() },
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
          validate: impactLineValidator,
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
