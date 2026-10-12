import { describe, expect, it } from "vitest";
import { PartnerCategories } from "./PartnerCategories";
import { Partners } from "./Partners";

type AnyField = {
  name?: string;
  type?: string;
  filterOptions?: unknown;
  relationTo?: string;
  hasMany?: boolean;
  validate?: (value: unknown, options: unknown) => unknown;
  hooks?: { beforeValidate?: ((a: { value: unknown }) => unknown)[] };
  fields?: AnyField[];
};

const names = (fields: AnyField[]) => fields.map((f) => f.name);

// "key" is a machine identifier, not editor prose.
const prose = (fields: AnyField[]) =>
  fields.filter((f) => (f.type === "text" || f.type === "textarea") && f.name !== "key");

describe("partners", () => {
  const fields = Partners.fields as AnyField[];

  it("has exactly the agreed fields", () => {
    expect(names(fields).sort()).toEqual(
      ["name", "order", "logo", "categories", "featured", "capability", "solution", "projects"].sort(),
    );
  });

  it("has no field that could carry partnership type, authorization or certification tier", () => {
    const banned = /tier|authori[sz]|certif|partnership|level|status|type|programme|program/i;
    for (const n of names(fields)) expect(n, String(n)).not.toMatch(banned);
  });

  it("filters the logo picker to approved media", () => {
    const logo = fields.find((f) => f.name === "logo")!;
    expect(logo.filterOptions).toEqual({ approved: { equals: true } });
  });

  it("relates categories, solution and projects", () => {
    const get = (n: string) => fields.find((f) => f.name === n)!;
    expect(get("categories")).toMatchObject({ relationTo: "partnerCategories", hasMany: true });
    expect(get("solution").relationTo).toBe("solutions");
    expect(get("projects")).toMatchObject({ relationTo: "projects", hasMany: true });
  });

  it("guards every prose field", () => {
    for (const f of prose(fields)) {
      expect(f.validate, f.name).toBeTypeOf("function");
      expect(f.validate!("A Tier III certified facility", {}), f.name).not.toBe(true);
    }
  });
});

describe("partnerCategories", () => {
  const fields = PartnerCategories.fields as AnyField[];

  it("has the agreed fields", () => {
    expect(names(fields).sort()).toEqual(["description", "key", "label", "order", "ringLabel"]);
  });

  it("normalises the key to lower case", () => {
    const key = fields.find((f) => f.name === "key")!;
    expect(key.hooks!.beforeValidate![0]({ value: " System-Cloud " })).toBe("system-cloud");
  });

  it("guards every prose field", () => {
    for (const f of prose(fields)) {
      expect(f.validate, f.name).toBeTypeOf("function");
      expect(f.validate!("A Tier III certified facility", {}), f.name).not.toBe(true);
    }
  });
});
