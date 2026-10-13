import type { GlobalConfig } from "payload";
import { adminOnly } from "../access";
import { forbidsPhrases } from "../fields/validators";
import { revalidateGlobal } from "../hooks/revalidate";

/*
 * Contact details, and where each kind of enquiry goes.
 *
 * Update is ADMIN-ONLY, not editor. A wrong phone number here appears in the
 * footer of all 51 pages, and that exact failure shipped once already: the
 * inherited footer carried a phone number and office address that were not
 * Edge's. Editors can change any amount of prose; they cannot change this.
 *
 * Every write expires the whole layout, because the footer is in it.
 *
 * Text fields carry the phrase validator even where they are labels or
 * identifiers: it also enforces `required`, and it costs nothing on a phone
 * number. Email-typed fields hold an address and nothing else.
 */
export const ContactDetails: GlobalConfig = {
  slug: "contact-details",
  label: "Contact details",
  admin: {
    group: "Company",
    description:
      "Address, phones, emails, hours and enquiry routing. Admin-only: these appear in the footer of every page.",
  },
  access: { read: () => true, update: adminOnly },
  versions: { drafts: false },
  hooks: { afterChange: [revalidateGlobal([], true)] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Office",
          fields: [
            {
              name: "office",
              type: "array",
              minRows: 1,
              labels: { singular: "Line", plural: "Address lines" },
              admin: { description: "One line each, starting with the legal entity name." },
              fields: [{ name: "line", type: "text", required: true, validate: forbidsPhrases() }],
            },
            {
              name: "mapUrl",
              type: "text",
              admin: { description: "A link that opens the office location in a map." },
              validate: forbidsPhrases(),
            },
          ],
        },
        {
          label: "Channels",
          fields: [
            {
              name: "phones",
              type: "array",
              minRows: 1,
              labels: { singular: "Phone", plural: "Phones" },
              fields: [
                { name: "label", type: "text", required: true, validate: forbidsPhrases() },
                {
                  name: "value",
                  type: "text",
                  required: true,
                  admin: { description: "As displayed, e.g. '+251 95 569 5565'." },
                  validate: forbidsPhrases(),
                },
                {
                  name: "tel",
                  type: "text",
                  required: true,
                  admin: { description: "Digits only with country code, for the tel: link." },
                  validate: forbidsPhrases(),
                },
              ],
            },
            {
              name: "whatsapp",
              type: "text",
              admin: { description: "Full wa.me link." },
              validate: forbidsPhrases(),
            },
            {
              name: "emails",
              type: "array",
              minRows: 1,
              labels: { singular: "Email", plural: "Emails" },
              fields: [
                { name: "label", type: "text", required: true, validate: forbidsPhrases() },
                { name: "value", type: "email", required: true },
              ],
            },
            {
              name: "emergency",
              type: "text",
              admin: { description: "The number to call for a live incident." },
              validate: forbidsPhrases(),
            },
            {
              name: "response",
              type: "text",
              required: true,
              admin: { description: "e.g. 'Within one business day'." },
              validate: forbidsPhrases(),
            },
          ],
        },
        {
          label: "Hours",
          fields: [
            {
              name: "hours",
              type: "array",
              minRows: 1,
              labels: { singular: "Row", plural: "Opening hours" },
              fields: [
                { name: "days", type: "text", required: true, validate: forbidsPhrases() },
                { name: "hours", type: "text", required: true, validate: forbidsPhrases() },
              ],
            },
          ],
        },
        {
          label: "Enquiry routing",
          fields: [
            {
              name: "inquiryCategories",
              type: "array",
              minRows: 1,
              labels: { singular: "Category", plural: "Enquiry categories" },
              admin: {
                description:
                  "Each kind of enquiry, what to include, and the address it reaches. Careers deliberately routes through the careers application process rather than the contact form.",
              },
              fields: [
                {
                  name: "key",
                  type: "text",
                  required: true,
                  admin: { description: "Stable identifier, e.g. consultation." },
                  validate: forbidsPhrases(),
                },
                { name: "title", type: "text", required: true, validate: forbidsPhrases() },
                {
                  name: "prompt",
                  type: "textarea",
                  required: true,
                  admin: { description: "What to include so the enquiry can be answered properly." },
                  validate: forbidsPhrases(),
                },
                { name: "route", type: "email", required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};
