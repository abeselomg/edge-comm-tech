import type { Field } from "payload";

/*
 * Fields added to every form submission, beyond what the form-builder plugin
 * stores. They are written by the submission route (consent and request
 * metadata at receipt, email status after the send attempt).
 *
 * The IP address is never stored in the clear: `ipHash` holds a salted hash,
 * enough to spot repeat senders without keeping a personal identifier.
 */
export const submissionExtraFields: Field[] = [
  {
    name: "consent",
    type: "group",
    admin: { readOnly: true, description: "The consent the visitor gave when submitting." },
    fields: [
      { name: "accepted", type: "checkbox", defaultValue: false },
      { name: "acceptedAt", type: "date" },
      { name: "wording", type: "text", admin: { description: "The exact consent text shown." } },
    ],
  },
  {
    name: "emailStatus",
    type: "select",
    defaultValue: "pending",
    options: [
      { label: "Pending", value: "pending" },
      { label: "Sent", value: "sent" },
      { label: "Failed", value: "failed" },
      { label: "Skipped", value: "skipped" },
    ],
    admin: { position: "sidebar", readOnly: true },
  },
  {
    name: "emailError",
    type: "text",
    admin: { position: "sidebar", readOnly: true, description: "Why the notification email did not send." },
  },
  {
    name: "meta",
    type: "group",
    admin: { readOnly: true },
    fields: [
      { name: "ipHash", type: "text", admin: { description: "Salted hash. The address itself is not stored." } },
      { name: "userAgent", type: "text" },
    ],
  },
];
