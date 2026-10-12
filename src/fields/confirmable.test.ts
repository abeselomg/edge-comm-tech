import { describe, expect, it } from "vitest";
import type { Field } from "payload";
import { confirmable } from "./confirmable";

type GroupField = Extract<Field, { type: "group"; name: string }>;

const subfield = (group: GroupField, name: string) =>
  group.fields.find((f) => "name" in f && f.name === name);

describe("confirmable", () => {
  const field = confirmable("year", {
    label: "Year",
    description: "The year the project completed.",
  }) as GroupField;

  it("is a group named after the fact", () => {
    expect(field.type).toBe("group");
    expect(field.name).toBe("year");
  });

  it("carries the label and description through to the admin", () => {
    expect(field.label).toBe("Year");
    expect(field.admin?.description).toBe("The year the project completed.");
  });

  it("guards both text fields against forbidden claims", () => {
    // A confirmable fact is where an unverified claim gets typed -- that is
    // what the field is for -- so leaving it unguarded is the worst case, not
    // a safe one.
    for (const name of ["value", "pendingLabel"]) {
      const sub = subfield(field, name) as { validate?: (v: unknown, o?: unknown) => unknown };
      expect(sub?.validate, `${name} should be guarded`).toBeTypeOf("function");
      expect(sub.validate!("Tier III certified facility", {})).not.toBe(true);
      expect(sub.validate!("An authorized reseller", {})).not.toBe(true);
    }
  });

  it("still accepts approved copy and empty values in both text fields", () => {
    for (const name of ["value", "pendingLabel"]) {
      const sub = subfield(field, name) as { validate?: (v: unknown, o?: unknown) => unknown };
      expect(sub.validate!("2024", {})).toBe(true);
      expect(sub.validate!("Tier III-aligned", {})).toBe(true);
      expect(sub.validate!("", {})).toBe(true);
    }
  });

  it("holds exactly value, status and pendingLabel", () => {
    const names = field.fields.flatMap((f) => ("name" in f && f.name ? [f.name] : []));
    expect(names).toEqual(["value", "status", "pendingLabel"]);
  });

  it("defaults to pending, so an unfilled fact is never implied as confirmed", () => {
    const status = subfield(field, "status");
    expect(status && "defaultValue" in status && status.defaultValue).toBe("pending");
  });

  it("offers only confirmed and pending", () => {
    const status = subfield(field, "status");
    const options = status && "options" in status ? status.options : [];
    const values = (options as { value: string }[]).map((o) => o.value);
    expect(values).toEqual(["confirmed", "pending"]);
  });

  it("shows pendingLabel only while the fact is pending", () => {
    const pendingLabel = subfield(field, "pendingLabel");
    const condition = pendingLabel?.admin?.condition;
    expect(typeof condition).toBe("function");
    expect(condition?.({}, { status: "pending" }, { user: null } as never)).toBe(true);
    expect(condition?.({}, { status: "confirmed" }, { user: null } as never)).toBe(false);
  });

  it("supplies a default pending label when one is given", () => {
    const withDefault = confirmable("deadline", {
      defaultPendingLabel: "Deadline to be confirmed",
    }) as GroupField;
    const pendingLabel = subfield(withDefault, "pendingLabel");
    expect(pendingLabel && "defaultValue" in pendingLabel && pendingLabel.defaultValue).toBe(
      "Deadline to be confirmed",
    );
  });

  it("works with no options at all", () => {
    const bare = confirmable("completedOn") as GroupField;
    expect(bare.name).toBe("completedOn");
    expect(bare.fields).toHaveLength(3);
  });
});
