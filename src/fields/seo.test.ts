import { describe, expect, it } from "vitest";
import type { Field } from "payload";
import { guardSeoMetaFields } from "./seo";

/*
 * The SEO plugin's meta description is the search-result snippet and the Open
 * Graph description — the text a buyer reads before they ever load the page.
 * The plugin creates it, so the validators in the collection files cannot
 * reach it, and an unguarded one publishes a forbidden claim in the place it
 * travels furthest. These tests pin that the guard is attached and that it
 * leaves everything else alone.
 */

// What the plugin actually hands over: a text title, a textarea description,
// an upload image, and UI components with no `name`.
const defaultFields: Field[] = [
  { name: "overview", type: "ui", admin: { components: { Field: "x" } } } as unknown as Field,
  { name: "title", type: "text", label: "Title" },
  { name: "description", type: "textarea", label: "Description" },
  { name: "image", type: "upload", relationTo: "media", label: "Image" },
  { name: "preview", type: "ui", admin: { components: { Field: "y" } } } as unknown as Field,
];

const guarded = guardSeoMetaFields({ defaultFields });
const byName = (n: string) =>
  guarded.find((f) => "name" in f && f.name === n) as
    | (Field & { validate?: (v: unknown, o?: unknown) => unknown })
    | undefined;

describe("guardSeoMetaFields", () => {
  it("returns every field it was given, in order", () => {
    expect(guarded).toHaveLength(defaultFields.length);
    expect(guarded.map((f) => ("name" in f ? f.name : undefined))).toEqual([
      "overview",
      "title",
      "description",
      "image",
      "preview",
    ]);
  });

  it("attaches a validator to the meta title", () => {
    expect(byName("title")?.validate).toBeTypeOf("function");
  });

  it("attaches a validator to the meta description", () => {
    expect(byName("description")?.validate).toBeTypeOf("function");
  });

  it("rejects a forbidden claim in the meta description", () => {
    const validate = byName("description")!.validate!;
    expect(validate("Tier III certified facility in Addis Ababa", {})).not.toBe(true);
    expect(validate("An authorized reseller of enterprise storage", {})).not.toBe(true);
  });

  it("rejects a forbidden claim in the meta title", () => {
    const validate = byName("title")!.validate!;
    expect(validate("Tier IV certified data centre", {})).not.toBe(true);
  });

  it("lets approved copy through", () => {
    const validate = byName("description")!.validate!;
    expect(validate("Tier III-aligned data centre design and build.", {})).toBe(true);
    expect(validate("", {})).toBe(true);
  });

  it("leaves the image and the UI components untouched", () => {
    // An upload field has no business carrying a prose validator, and a `ui`
    // field has no value to validate at all.
    expect(byName("image")?.validate).toBeUndefined();
    expect(byName("overview")?.validate).toBeUndefined();
    expect(byName("preview")?.validate).toBeUndefined();
  });

  it("does not mutate the fields it was handed", () => {
    const original = defaultFields.find((f) => "name" in f && f.name === "title") as Field & {
      validate?: unknown;
    };
    expect(original.validate).toBeUndefined();
  });
});
