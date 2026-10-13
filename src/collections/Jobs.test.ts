import { describe, expect, it } from "vitest";
import { Jobs } from "./Jobs";
import { AcademyTracks } from "./AcademyTracks";

type AnyField = {
  name?: string;
  type?: string;
  required?: boolean;
  validate?: (value: unknown, options: unknown) => unknown;
  filterOptions?: unknown;
  fields?: AnyField[];
};
const names = (fields: AnyField[], out: string[] = []) => {
  for (const f of fields) {
    if (f.name) out.push(f.name);
    if (f.fields) names(f.fields, out);
  }
  return out;
};
const proseTypes = ["text", "textarea", "richText"];
const unguarded = (fields: AnyField[], out: string[] = []) => {
  for (const f of fields) {
    if (f.type && proseTypes.includes(f.type) && !f.validate && f.name !== "slug") out.push(f.name ?? "?");
    if (f.fields) unguarded(f.fields, out);
  }
  return out;
};

describe("Jobs", () => {
  it("holds no field for salary, benefits or employment conditions", () => {
    const all = names(Jobs.fields as AnyField[]);
    expect(all.filter((n) => /salary|pay|compensation|benefit|wage|condition/i.test(n))).toEqual([]);
  });
  it("guards every prose field", () => {
    expect(unguarded(Jobs.fields as AnyField[])).toEqual([]);
    expect(unguarded(AcademyTracks.fields as AnyField[])).toEqual([]);
  });
  it("keeps required and preferred separate", () => {
    const all = names(Jobs.fields as AnyField[]);
    expect(all).toContain("required");
    expect(all).toContain("preferred");
  });
  it("lives in People", () => {
    expect(Jobs.admin?.group).toBe("People");
    expect(AcademyTracks.admin?.group).toBe("People");
  });
  it("requires a published solution on tracks", () => {
    const f = (AcademyTracks.fields as AnyField[]).find((x) => x.name === "solution")!;
    expect(f.required).toBe(true);
    expect(f.filterOptions).toEqual({ _status: { equals: "published" } });
  });
});
