import type { Field } from "payload";
import { forbidsPhrases, type Rule } from "./validators";

/*
 * A fact Edge may not have confirmed yet.
 *
 * Highland shows these as a visible "pending" badge rather than guessing a
 * plausible value, and that visibility is a content decision, not a styling
 * one -- so the state lives in the schema. The front end renders the badge
 * from `status`, which means an editor confirming a fact clears the badge
 * with no code change.
 *
 * Status defaults to "pending" deliberately: a new document with an empty
 * value should not claim the value is confirmed.
 */

export type ConfirmableValue = {
  value?: string | null;
  status: "confirmed" | "pending";
  pendingLabel?: string | null;
};

export const confirmable = (
  name: string,
  opts: {
    label?: string;
    description?: string;
    defaultPendingLabel?: string;
    /**
     * Which phrase rules apply. Defaults to the base set. Pass PROJECT_RULES on
     * a project, where the approved wording for Bahir Dar's campus spaces is
     * "security control room" and never "SOC" -- otherwise a confirmable fact
     * on a project would be the one prose field in that collection the SOC rule
     * does not reach.
     */
    rules?: Rule[];
  } = {},
): Field => ({
  name,
  type: "group",
  ...(opts.label ? { label: opts.label } : {}),
  ...(opts.description ? { admin: { description: opts.description } } : {}),
  fields: [
    {
      name: "value",
      // Both text fields here are editor-entered prose that reaches the page,
      // so both carry the forbidden-phrase validator. A confirmable fact is
      // exactly the kind of field where an unverified claim gets typed -- that
      // is what it is for -- which makes leaving it unguarded the worst case
      // rather than a safe one.
      type: "text",
      validate: forbidsPhrases(opts.rules),
      admin: { description: "Leave empty while this is still unconfirmed." },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "Confirmed by Edge", value: "confirmed" },
        { label: "Pending confirmation", value: "pending" },
      ],
      admin: {
        description:
          "While this is pending, the site shows a visible marker instead of the value.",
      },
    },
    {
      name: "pendingLabel",
      type: "text",
      validate: forbidsPhrases(opts.rules),
      ...(opts.defaultPendingLabel ? { defaultValue: opts.defaultPendingLabel } : {}),
      admin: {
        description: "What the marker says, e.g. 'Year to confirm'.",
        condition: (_data, siblingData) => siblingData?.status === "pending",
      },
    },
  ],
});
