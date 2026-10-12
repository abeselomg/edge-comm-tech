import { describe, expect, it } from "vitest";
import { Clients } from "./Clients";
import { Projects } from "./Projects";
import { SECTOR_OPTIONS } from "../fields/sectors";

type AnyField = {
  name?: string;
  type?: string;
  options?: { value: string }[];
  filterOptions?: unknown;
  relationTo?: string;
  validate?: (value: unknown, options: unknown) => unknown;
  fields?: AnyField[];
};

const walk = (fields: AnyField[], visit: (f: AnyField) => void) => {
  for (const f of fields) {
    visit(f);
    if (f.fields) walk(f.fields, visit);
  }
};

const proseFields = (fields: AnyField[]) => {
  const out: AnyField[] = [];
  walk(fields, (f) => {
    if (f.type === "text" || f.type === "textarea") out.push(f);
  });
  // Fields owned by shared helpers (slug, confirmable) are not editor prose.
  return out.filter((f) => !["slug", "value", "pendingLabel"].includes(f.name ?? ""));
};

describe("sector vocabulary", () => {
  it("is shared by clients and projects", () => {
    const expected = SECTOR_OPTIONS.map((o) => o.value);
    for (const c of [Clients, Projects]) {
      const sector = (c.fields as AnyField[]).find((f) => f.name === "sector")!;
      expect(sector.options!.map((o) => o.value)).toEqual(expected);
    }
  });
});

describe("clients", () => {
  const fields = Clients.fields as AnyField[];

  it("filters the logo picker to approved media", () => {
    const logo = fields.find((f) => f.name === "logo")!;
    expect(logo.filterOptions).toEqual({ approved: { equals: true } });
  });

  it("has no slug, because there is no per-client page", () => {
    expect(fields.find((f) => f.name === "slug")).toBeUndefined();
  });

  it("guards every prose field against forbidden claims", () => {
    for (const f of proseFields(fields)) {
      expect(f.validate, f.name).toBeTypeOf("function");
      expect(f.validate!("A Tier III certified facility", {}), f.name).not.toBe(true);
    }
  });
});

describe("projects", () => {
  const fields = Projects.fields as AnyField[];

  it("links client as a relationship to clients", () => {
    const client = fields.find((f) => f.name === "client")!;
    expect(client.type).toBe("relationship");
    expect(client.relationTo).toBe("clients");
  });

  it("models year as a confirmable group", () => {
    const year = fields.find((f) => f.name === "year")!;
    expect(year.type).toBe("group");
    expect(year.fields!.map((f) => f.name)).toEqual(["value", "status", "pendingLabel"]);
  });

  it("guards every prose field, including array items, and applies the SOC rule", () => {
    for (const f of proseFields(fields)) {
      expect(f.validate, f.name).toBeTypeOf("function");
      expect(f.validate!("A Tier III certified facility", {}), f.name).not.toBe(true);
      expect(f.validate!("Two campus SOC rooms", {}), f.name).not.toBe(true);
      expect(f.validate!("Two campus security control rooms", {}), f.name).toBe(true);
    }
  });
});
