import { describe, expect, it } from "vitest";
import { Downloads } from "./Downloads";
import { Posts } from "./Posts";
import { News } from "./News";
import { PostCategories } from "./PostCategories";

type AnyField = {
  name?: string;
  type?: string;
  validate?: (v: unknown, o: unknown) => unknown;
  filterOptions?: unknown;
};
const get = (c: { fields: unknown[] }, name: string) =>
  c.fields.find((f) => (f as AnyField).name === name) as AnyField;

describe("Downloads", () => {
  it("only offers approved media for the file", () => {
    expect(get(Downloads, "file").filterOptions).toEqual({ approved: { equals: true } });
  });

  it("refuses approval without a file", () => {
    const v = get(Downloads, "approved").validate!;
    expect(v(true, { siblingData: {} })).toMatch(/Attach the file/);
    expect(v(true, { siblingData: { file: "m1" } })).toBe(true);
    expect(v(false, { siblingData: {} })).toBe(true);
  });
});

describe("Resources collections", () => {
  it("all sit in the Resources group", () => {
    for (const c of [Downloads, Posts, News, PostCategories]) {
      expect(c.admin?.group).toBe("Resources");
    }
  });

  it("guards the post anchor and body against forbidden phrases", () => {
    expect(get(Posts, "anchor").validate!("Tier III certified", {})).toMatch(/Tier III/);
    expect(get(Posts, "body").validate!("Authorised reseller", {})).toMatch(/Authorization/);
  });

  it("news date is a confirmable group", () => {
    expect(get(News, "date").type).toBe("group");
  });
});
