import { describe, expect, it } from "vitest";
import { News } from "./News";

type AnyField = {
  name?: string;
  type?: string;
  required?: boolean;
  validate?: (value: unknown, options: unknown) => unknown;
  defaultValue?: unknown;
  fields?: AnyField[];
};
const find = (fields: AnyField[], name: string): AnyField | undefined => {
  for (const f of fields) {
    if (f.name === name) return f;
    const inner = f.fields ? find(f.fields, name) : undefined;
    if (inner) return inner;
  }
  return undefined;
};
const fields = News.fields as AnyField[];

describe("News — holding state", () => {
  it("can be held for publication, defaulting to not held", () => {
    const f = find(fields, "heldForPublication");
    expect(f?.type).toBe("checkbox");
    expect(f?.defaultValue).toBe(false);
  });

  it("keeps the list of details still outstanding, guarded like all prose", () => {
    const list = find(fields, "pendingFields");
    expect(list?.type).toBe("array");
    const item = find(list?.fields ?? [], "item");
    expect(item?.required).toBe(true);
    expect(item?.validate).toBeTypeOf("function");
  });

  it("keeps titled sections apart from the body", () => {
    const sections = find(fields, "sections");
    expect(sections?.type).toBe("array");
    expect(find(sections?.fields ?? [], "title")?.validate).toBeTypeOf("function");
    expect(find(sections?.fields ?? [], "body")?.validate).toBeTypeOf("function");
  });

  // An item can be all sections and no running text.
  it("does not require a body", () => {
    expect(find(fields, "body")?.required).toBeFalsy();
  });

  it("closes an article with a block whose links must be real routes", () => {
    const closing = find(fields, "closing");
    expect(closing?.type).toBe("group");
    const href = find(closing?.fields ?? [], "href");
    expect(href?.validate).toBeTypeOf("function");
    expect(href?.validate?.("/about", {})).toBe(true);
    expect(href?.validate?.("about.html", {})).not.toBe(true);
    expect(href?.validate?.("/invented", {})).not.toBe(true);
  });
});
