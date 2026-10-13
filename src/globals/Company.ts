import type { GlobalConfig } from "payload";
import { signedIn } from "../access";
import { confirmable } from "../fields/confirmable";
import { forbidsPhrases } from "../fields/validators";
import { revalidateGlobal } from "../hooks/revalidate";

const titledBody = [
  { name: "title", type: "text", required: true, validate: forbidsPhrases() },
  { name: "body", type: "textarea", required: true, validate: forbidsPhrases() },
] as const;

/*
 * Who Edge is. Tabs rather than nine separate globals, because an editor
 * looking for "our values" should not have to know which of fifteen sidebar
 * entries holds them.
 *
 * Executive roles carry titles and a confirmable name. The master publishes
 * the five role titles and no biographies, so the schema offers a name that
 * can be pending and no biography field at all -- there is nothing approved to
 * put in one, and an empty rich-text box invites someone to write it.
 *
 * Every text field carries the phrase validator, including short factual ones
 * such as `domain` and `established`: it also enforces `required`, and a field
 * that reaches the page is a field where an unverified claim can be typed.
 */
export const Company: GlobalConfig = {
  slug: "company",
  label: "Company",
  admin: { group: "Company", description: "Profile, mission, values, history and leadership." },
  access: { read: () => true, update: signedIn },
  versions: { drafts: false },
  hooks: { afterChange: [revalidateGlobal(["/", "/about", "/about/executive-management"])] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Profile",
          fields: [
            { name: "legalName", type: "text", required: true, validate: forbidsPhrases() },
            { name: "shortName", type: "text", required: true, validate: forbidsPhrases() },
            { name: "domain", type: "text", required: true, validate: forbidsPhrases() },
            {
              name: "established",
              type: "text",
              required: true,
              admin: { description: "e.g. 'March 2018'." },
              validate: forbidsPhrases(),
            },
            {
              name: "positioning",
              type: "textarea",
              required: true,
              admin: { description: "One sentence describing what Edge is." },
              validate: forbidsPhrases(),
            },
          ],
        },
        {
          label: "Mission and vision",
          fields: [
            { name: "mission", type: "text", required: true, validate: forbidsPhrases() },
            { name: "missionBody", type: "textarea", required: true, validate: forbidsPhrases() },
            { name: "vision", type: "text", required: true, validate: forbidsPhrases() },
            { name: "visionBody", type: "textarea", required: true, validate: forbidsPhrases() },
          ],
        },
        {
          label: "Values",
          fields: [
            {
              name: "values",
              type: "array",
              minRows: 1,
              labels: { singular: "Value", plural: "Values" },
              fields: [...titledBody],
            },
          ],
        },
        {
          label: "Journey",
          fields: [
            {
              name: "journey",
              type: "array",
              minRows: 1,
              labels: { singular: "Milestone", plural: "Milestones" },
              admin: { description: "In order, oldest first. The last one renders as current." },
              fields: [
                {
                  name: "when",
                  type: "text",
                  required: true,
                  admin: { description: "e.g. 'March 2018', '2024/2025'." },
                  validate: forbidsPhrases(),
                },
                { name: "what", type: "textarea", required: true, validate: forbidsPhrases() },
              ],
            },
          ],
        },
        {
          label: "Why Edge",
          fields: [
            {
              name: "differentiators",
              type: "array",
              minRows: 1,
              labels: { singular: "Differentiator", plural: "Differentiators" },
              fields: [...titledBody],
            },
            {
              name: "delivery",
              type: "array",
              minRows: 1,
              labels: { singular: "Stage", plural: "Delivery stages" },
              admin: { description: "The lifecycle Edge works across, in order." },
              fields: [...titledBody],
            },
            {
              name: "industries",
              type: "array",
              minRows: 1,
              labels: { singular: "Industry", plural: "Industries" },
              fields: [...titledBody],
            },
            {
              name: "sustainability",
              type: "array",
              minRows: 1,
              labels: { singular: "Commitment", plural: "Sustainability commitments" },
              fields: [...titledBody],
            },
          ],
        },
        {
          label: "Leadership",
          fields: [
            {
              name: "executiveRoles",
              type: "array",
              minRows: 1,
              labels: { singular: "Role", plural: "Executive roles" },
              admin: {
                description:
                  "The master publishes role titles only. Leave each name pending until Edge approves it for release — the site then shows the role with a visible marker rather than a blank.",
              },
              fields: [
                { name: "title", type: "text", required: true, validate: forbidsPhrases() },
                confirmable("holder", {
                  label: "Name",
                  defaultPendingLabel: "Name and biography pending",
                }),
              ],
            },
          ],
        },
      ],
    },
  ],
};
