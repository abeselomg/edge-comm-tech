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

  it("leaves the image and the UI components without a prose validator", () => {
    // An upload field has no business carrying a prose validator, and a `ui`
    // field has no value to validate at all.
    expect(byName("image")?.validate).toBeUndefined();
    expect(byName("overview")?.validate).toBeUndefined();
    expect(byName("preview")?.validate).toBeUndefined();
  });

  it("filters the Open Graph image to approved assets", () => {
    // meta.image is the most widely redistributed image on the site: every
    // share and every search result copies it. Unfiltered, an editor could
    // point it at an asset with no recorded source, retrieval date or
    // reviewer.
    const image = byName("image") as { filterOptions?: unknown };
    expect(image?.filterOptions).toEqual({ approved: { equals: true } });
  });

  it("does not put a media filter on fields that are not uploads", () => {
    for (const name of ["title", "description", "overview", "preview"]) {
      expect((byName(name) as { filterOptions?: unknown })?.filterOptions, name).toBeUndefined();
    }
  });

  it("does not mutate the fields it was handed", () => {
    const original = defaultFields.find((f) => "name" in f && f.name === "title") as Field & {
      validate?: unknown;
    };
    expect(original.validate).toBeUndefined();
  });

  it("guards a prose field the plugin might add later under another name", () => {
    // Matching on `title` and `description` by name would cover today's plugin
    // exactly and miss anything a future version introduces. Guarding by type
    // means a new prose field arrives already covered.
    const withExtra = guardSeoMetaFields({
      defaultFields: [
        ...defaultFields,
        { name: "ogDescription", type: "textarea", label: "OG description" },
        { name: "twitterTitle", type: "text", label: "Twitter title" },
      ],
    });
    for (const name of ["ogDescription", "twitterTitle"]) {
      const f = withExtra.find((x) => "name" in x && x.name === name) as Field & {
        validate?: (v: unknown, o?: unknown) => unknown;
      };
      expect(f.validate, `${name} should be guarded`).toBeTypeOf("function");
      expect(f.validate!("Tier III certified", {})).not.toBe(true);
    }
  });
});

/*
 * The guard is only worth anything if the config actually passes it. Importing
 * payload.config.ts here is not an option — it boots the whole config and
 * times out well past any sane test timeout, which is why vitest.config.ts
 * says there is no Payload instance to boot.
 *
 * So this asserts on the source text. It is a crude check and it verifies
 * exactly one thing: that nobody has quietly disconnected the guard. Without
 * it, deleting the `fields:` line from the seoPlugin call leaves every other
 * test in this file green while both meta fields go back to being unguarded.
 */
describe("the config wires the guard", () => {
  it("passes guardSeoMetaFields to seoPlugin", async () => {
    const { readFile } = await import("node:fs/promises");
    const source = await readFile(new URL("../payload.config.ts", import.meta.url), "utf8");
    expect(source).toContain('from "./fields/seo"');
    expect(source).toMatch(/fields:\s*guardSeoMetaFields/);
  });
});
