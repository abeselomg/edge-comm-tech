import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import type { Field } from "payload";
import { guardSeoMetaFields, META_DESCRIPTION_MAX, META_TITLE_MAX } from "./seo";

/*
 * "Search appearance" for editors: the title, description and share picture of
 * each public page. The fields come from @payloadcms/plugin-seo (a `meta` group
 * on each collection it is given), so no field is added to any collection and no
 * migration is needed; what Edge controls is the plugin's configuration, pinned
 * here: which collections get it, what the editor is told, and the length caps.
 */
const defaultFields: Field[] = [
  { name: "title", type: "text", label: "Title" },
  { name: "description", type: "textarea", label: "Description" },
  { name: "image", type: "upload", relationTo: "media", label: "Image" },
] as Field[];

type Guarded = Field & {
  validate?: (v: unknown, o?: unknown) => unknown;
  admin?: { description?: string };
  filterOptions?: unknown;
};
const guarded = guardSeoMetaFields({ defaultFields });
const get = (name: string) => guarded.find((f) => "name" in f && f.name === name) as Guarded;

describe("meta title", () => {
  const validate = get("title").validate!;

  it("tells the editor what to do in plain English", () => {
    expect(get("title").admin?.description).toBe(
      "Leave empty to use the page title. About 50-60 characters. The site name is added after it automatically, so do not type it.",
    );
  });

  it("accepts empty and anything up to the cap", () => {
    expect(validate("", {})).toBe(true);
    expect(validate(undefined, {})).toBe(true);
    expect(validate("a".repeat(META_TITLE_MAX), {})).toBe(true);
  });

  it("rejects a longer one and says by how much", () => {
    const result = validate("a".repeat(META_TITLE_MAX + 5), {});
    expect(result).toBe(
      `Shorten the search title to ${META_TITLE_MAX} characters or fewer; it is ${META_TITLE_MAX + 5}. Search results cut longer text off.`,
    );
  });

  it("still blocks a forbidden claim", () => {
    expect(validate("Tier III certified", {})).not.toBe(true);
  });
});

describe("meta description", () => {
  const validate = get("description").validate!;

  it("tells the editor what to do in plain English", () => {
    expect(get("description").admin?.description).toBe(
      "Leave empty to use the summary. About 140-155 characters.",
    );
  });

  it("caps at 160 characters", () => {
    expect(META_DESCRIPTION_MAX).toBe(160);
    expect(validate("a".repeat(160), {})).toBe(true);
    expect(validate("a".repeat(161), {})).toMatch(/^Shorten the search description to 160 characters/);
  });
});

describe("share image", () => {
  it("is an upload to media, approved assets only, with its size guidance", () => {
    const image = get("image");
    expect(image.type).toBe("upload");
    expect(image.filterOptions).toEqual({ approved: { equals: true } });
    expect(image.admin?.description).toBe(
      "Picture shown when the page is shared. 1200 x 630 pixels recommended. Leave empty to use the Edge Comm-Tech default.",
    );
  });
});

describe("the plugin is configured for every collection that has a public page", () => {
  it("covers solutions, services, projects, news, events and jobs (and posts)", async () => {
    const source = await readFile(new URL("../payload.config.ts", import.meta.url), "utf8");
    const list = /seoPlugin\(\{\s*collections: \[([^\]]*)\]/.exec(source)![1]!;
    for (const slug of ["solutions", "services", "projects", "news", "events", "jobs", "posts"]) {
      expect(list).toContain(`"${slug}"`);
    }
  });

  it("generates a title WITHOUT the site name, which the frontend adds itself", async () => {
    const source = await readFile(new URL("../payload.config.ts", import.meta.url), "utf8");
    const generated = /generateTitle:[^\n]*/.exec(source)![0];
    expect(generated).not.toMatch(/Edge Comm-Tech/);
    expect(source).toMatch(/generateDescription:[\s\S]{0,80}trimDescription/);
  });
});
