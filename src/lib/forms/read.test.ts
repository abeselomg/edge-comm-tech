import { describe, expect, it } from "vitest";
import { FORM_DEFINITIONS } from "./definitions";
import { confirmationText, consentWording, renderFields } from "./read";
import { formDoc } from "./testing";

describe("renderFields", () => {
  it("keeps the stored order and joins hint, group, maxLength and type by field name", () => {
    const fields = renderFields(formDoc("contact"));
    expect(fields.map((f) => f.name)).toEqual(FORM_DEFINITIONS.contact.fields.map((f) => f.name));
    const phone = fields.find((f) => f.name === "phone")!;
    expect(phone).toMatchObject({ type: "tel", hint: "Include country code", maxLength: 50, required: true });
    const message = fields.find((f) => f.name === "message")!;
    expect(message).toMatchObject({ type: "textarea", wide: true, maxLength: 4000 });
  });

  it("uses the stored document for what exists and whether it is required", () => {
    const doc = formDoc("contact");
    doc.fields = doc.fields!.filter((f) => !("name" in f) || f.name !== "jobTitle");
    const names = renderFields(doc).map((f) => f.name);
    expect(names).not.toContain("jobTitle");
    expect(names).toContain("fullName");
  });

  it("marks a leading Select placeholder and keeps the options in order", () => {
    const sector = renderFields(formDoc("event-registration")).find((f) => f.name === "sector")!;
    expect(sector.options![0]).toBe("Select a sector");
    expect(sector.placeholder).toBe("Select a sector");
    const updates = renderFields(formDoc("event-registration")).find((f) => f.name === "preferredUpdates")!;
    expect(updates.placeholder).toBeUndefined();
    expect(updates.options).toEqual(["Email", "WhatsApp", "Both"]);
  });

  it("carries the checkbox groups for Subscribe", () => {
    const groups = renderFields(formDoc("subscribe")).filter((f) => f.type === "checkbox");
    expect(new Set(groups.map((f) => f.group))).toEqual(new Set(["Topics of interest", "What to send"]));
    expect(groups.find((f) => f.name === "sendEvents")!.hint).toBe("Invitations to webinars and briefings.");
  });
});

describe("consent and confirmation", () => {
  it("takes the consent wording from the definition the form was seeded from", () => {
    expect(consentWording(formDoc("subscribe"))).toBe(FORM_DEFINITIONS.subscribe.consent);
  });
  it("reads the confirmation from the stored rich text, falling back to the definition", () => {
    expect(confirmationText(formDoc("contact"))).toBe(FORM_DEFINITIONS.contact.confirmationMessage);
    const bare = { ...formDoc("contact"), confirmationMessage: null } as never;
    expect(confirmationText(bare)).toBe(FORM_DEFINITIONS.contact.confirmationMessage);
  });
});
