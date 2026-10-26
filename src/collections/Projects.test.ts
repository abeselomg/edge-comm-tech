import { describe, expect, it } from "vitest";
import { Projects } from "./Projects";

type AnyField = {
  name?: string;
  type?: string;
  relationTo?: string;
  required?: boolean;
  maxRows?: number;
  filterOptions?: unknown;
  validate?: (value: unknown, options: unknown) => unknown;
  admin?: { description?: string };
  fields?: AnyField[];
};

const fields = Projects.fields as AnyField[];
const get = (n: string) => fields.find((f) => f.name === n)!;

describe("project pictures", () => {
  it("has an optional cover that can only be an approved media file", () => {
    const cover = get("coverImage");
    expect(cover).toMatchObject({ type: "upload", relationTo: "media" });
    expect(cover.required).toBeFalsy();
    expect(cover.filterOptions).toEqual({ approved: { equals: true } });
  });

  it("has an optional gallery of at most eight approved pictures with optional captions", () => {
    const gallery = get("gallery");
    expect(gallery).toMatchObject({ type: "array", maxRows: 8 });
    expect(gallery.required).toBeFalsy();
    const rowFields = gallery.fields!;
    const image = rowFields.find((f) => f.name === "image")!;
    expect(image).toMatchObject({ type: "upload", relationTo: "media", required: true });
    expect(image.filterOptions).toEqual({ approved: { equals: true } });
    const caption = rowFields.find((f) => f.name === "caption")!;
    expect(caption.type).toBe("text");
    expect(caption.required).toBeFalsy();
  });

  it("tells editors the size, the ratio and that only approved images can be chosen", () => {
    expect(get("coverImage").admin?.description).toMatch(/16:10/);
    expect(get("coverImage").admin?.description).toMatch(/approved/i);
    expect(get("gallery").admin?.description).toMatch(/approved/i);
    expect(get("gallery").admin?.description).toMatch(/eight/i);
  });

  it("guards captions with the project wording rules", () => {
    const caption = get("gallery").fields!.find((f) => f.name === "caption")!;
    expect(caption.validate).toBeTypeOf("function");
  });

  it("keeps drafts and versions", () => {
    expect((Projects.versions as { drafts?: unknown }).drafts).toBeTruthy();
  });
});
