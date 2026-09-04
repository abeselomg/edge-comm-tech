import type { GlobalConfig } from "payload";
import { signedIn } from "../access";
import { revalidateGlobal } from "../hooks/revalidate";

export const CompanyPage: GlobalConfig = {
  slug: "company-page",
  label: "Company page",
  admin: { group: "Site", description: "The /about page: who Edge is and what it stands for." },
  access: { read: () => true, update: signedIn },
  hooks: { afterChange: [revalidateGlobal(["/about"])] },
  fields: [
    { name: "heading", type: "text", required: true, defaultValue: "The company" },
    { name: "intro", type: "textarea", required: true },
    { name: "commitment", type: "textarea", required: true },
    { name: "body", type: "richText" },
    {
      name: "values",
      type: "array",
      labels: { singular: "Value", plural: "Values" },
      admin: {
        description: "Edge's own values, written by Edge. Not borrowed from another company's about page.",
      },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
      ],
    },
    {
      name: "outcomes",
      type: "array",
      labels: { singular: "Outcome", plural: "What clients get" },
      fields: [{ name: "item", type: "text", required: true }],
    },
    {
      name: "founded",
      type: "group",
      admin: { description: "Hidden from the public site until marked verified." },
      fields: [
        { name: "year", type: "text" },
        { name: "detail", type: "textarea" },
        { name: "verified", type: "checkbox", defaultValue: false },
      ],
    },
  ],
};
