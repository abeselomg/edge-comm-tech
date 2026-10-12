import { describe, expect, it } from "vitest";
import { Services } from "./Services";
import { Solutions } from "./Solutions";

type AnyField = {
  name?: string;
  type?: string;
  validate?: (value: unknown, options: unknown) => unknown;
  fields?: AnyField[];
  blocks?: { slug: string; fields: AnyField[] }[];
};

const walk = (fields: AnyField[], visit: (f: AnyField) => void) => {
  for (const f of fields) {
    visit(f);
    if (f.fields) walk(f.fields, visit);
    if (f.blocks) for (const b of f.blocks) walk(b.fields, visit);
  }
};

const detail = (Solutions.fields as AnyField[]).find((f) => f.name === "detail")!;

describe("solutions detail blocks", () => {
  it("offers the block slugs the transforms target", () => {
    const slugs = detail.blocks!.map((b) => b.slug);
    for (const s of ["capabilities", "bands", "layers", "steps", "checklist", "models"]) {
      expect(slugs).toContain(s);
    }
  });
});

describe.each([
  ["solutions", Solutions],
  ["services", Services],
])("%s guardrails", (_name, collection) => {
  const fields = collection.fields as AnyField[];

  it("rejects Tier III-certified in every free-text field", () => {
    const bad = "A Tier III certified facility";
    const texts: AnyField[] = [];
    walk(fields, (f) => {
      if (f.type === "text" || f.type === "textarea") texts.push(f);
    });
    const guarded = texts.filter((f) => f.validate && f.name !== "slug" && f.name !== "accent");
    expect(guarded.length).toBeGreaterThan(5);
    for (const f of guarded) {
      expect(f.validate!(bad, {}), String(f.name)).not.toBe(true);
    }
  });

  it("accepts Tier III-aligned", () => {
    const f = fields.find((x) => x.name === "headline")!;
    expect(f.validate!("A Tier III-aligned facility", {})).toBe(true);
  });

  it("has no tier, authorization or certification field", () => {
    walk(fields, (f) => {
      expect(f.name ?? "").not.toMatch(/tier|authoriz|authoris|certif/i);
    });
  });
});
