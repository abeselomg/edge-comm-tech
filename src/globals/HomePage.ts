import type { GlobalConfig } from "payload";
import { signedIn } from "../access";
import { revalidateGlobal } from "../hooks/revalidate";

export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Home page",
  admin: {
    group: "Site",
    description: "The hero, the proof strip, and how Edge describes the way it works.",
  },
  access: { read: () => true, update: signedIn },
  hooks: { afterChange: [revalidateGlobal(["/"])] },
  fields: [
    {
      name: "tagline",
      type: "text",
      required: true,
      admin: {
        description:
          "Edge's own line, in Edge's own words. Short enough to repeat. Do not use a competitor's slogan.",
      },
    },
    {
      name: "heroStatement",
      type: "textarea",
      required: true,
      admin: { description: "The large sentence under the tagline. What Edge is, plainly." },
    },
    {
      name: "primaryCta",
      type: "group",
      fields: [
        { name: "label", type: "text", required: true, defaultValue: "Explore solutions" },
        { name: "href", type: "text", required: true, defaultValue: "/solutions" },
      ],
    },
    {
      name: "secondaryCta",
      type: "group",
      fields: [
        { name: "label", type: "text", required: true, defaultValue: "Talk to an expert" },
        { name: "href", type: "text", required: true, defaultValue: "/contact" },
      ],
    },
    {
      name: "proofStats",
      type: "array",
      labels: { singular: "Statistic", plural: "Proof statistics" },
      maxRows: 4,
      admin: {
        description:
          "Years operating, headcount, projects delivered. A statistic is hidden from the public site until someone at Edge ticks 'Verified'.",
      },
      fields: [
        { name: "value", type: "text", required: true },
        { name: "label", type: "text", required: true },
        {
          name: "verified",
          type: "checkbox",
          defaultValue: false,
          admin: { description: "Tick only when this number is accurate and Edge can evidence it." },
        },
      ],
    },
    {
      name: "methodTitle",
      type: "text",
      required: true,
      defaultValue: "How we work",
    },
    {
      name: "method",
      type: "array",
      labels: { singular: "Step", plural: "How we work" },
      minRows: 3,
      maxRows: 4,
      admin: {
        description:
          "Edge's own delivery steps. Plain named stages — do not build an acronym out of the company name.",
      },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
      ],
    },
    {
      name: "solutionsIntro",
      type: "text",
      required: true,
      defaultValue: "Six integrated technology domains",
    },
    {
      name: "sectorsIntro",
      type: "text",
      required: true,
      defaultValue: "Built for sectors where downtime is not an option",
    },
  ],
};
