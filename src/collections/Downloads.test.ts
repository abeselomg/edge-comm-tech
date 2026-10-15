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

  it("guards the post anchor and body against forbidden phrases", async () => {
    expect(get(Posts, "anchor").validate!("Tier III certified", {})).toMatch(/Tier III/);
    // body is async now: it also checks that embedded images are approved, so
    // its validator returns a promise.
    // "An authorised reseller" rather than the bare phrase: the rule now only
    // catches a claim, because the bare words appear in approved copy about
    // third-party distributors.
    await expect(get(Posts, "body").validate!("An authorised reseller", {})).resolves.toMatch(
      /Authorization/,
    );
  });

  it("news date is a confirmable group", () => {
    expect(get(News, "date").type).toBe("group");
  });
});

/*
 * posts.target + posts.anchor are the Read More destination, and Phase 5 builds
 * /solutions/<target>#<anchor> from them. Both could previously publish a
 * broken link: target accepted a draft solution, which the public sees as a
 * 404 while a signed-in editor sees it working, and anchor was free text whose
 * own description invites typing a heading rather than a fragment.
 */
describe("the Read More destination", () => {
  const field = (name: string) =>
    (Posts.fields as AnyField[]).find((f) => f.name === name) as AnyField & {
      filterOptions?: unknown;
      hooks?: { beforeValidate?: ((a: { value: unknown }) => unknown)[] };
      validate?: (v: unknown, o?: unknown) => unknown;
    };

  it("only offers published solutions as a target", () => {
    expect(field("target").filterOptions).toEqual({ _status: { equals: "published" } });
  });

  it("normalises a typed heading into a usable fragment", () => {
    const normalise = field("anchor").hooks!.beforeValidate![0];
    expect(normalise({ value: "Private RAG" })).toBe("private-rag");
    expect(normalise({ value: "  #Capabilities  " })).toBe("capabilities");
    expect(normalise({ value: "Zero_Trust  Access" })).toBe("zero-trust-access");
    expect(normalise({ value: "Tier III — aligned" })).toBe("tier-iii-aligned");
  });

  it("leaves an empty anchor empty, since it is optional", () => {
    const normalise = field("anchor").hooks!.beforeValidate![0];
    expect(normalise({ value: "" })).toBe("");
    expect(normalise({ value: "   " })).toBe("");
    expect(field("anchor").validate!("", {})).toBe(true);
  });

  it("accepts a well-formed fragment", () => {
    for (const ok of ["capabilities", "zero-trust", "tier-3-design", "a1"]) {
      expect(field("anchor").validate!(ok, {}), ok).toBe(true);
    }
  });

  it("refuses a fragment the normaliser could not rescue", () => {
    for (const bad of ["Private RAG", "#capabilities", "a b", "double--hyphen", "-leading"]) {
      expect(field("anchor").validate!(bad, {}), bad).not.toBe(true);
    }
  });

  it("still blocks a forbidden claim in the anchor", () => {
    expect(field("anchor").validate!("tier-iii-certified", {})).not.toBe(true);
  });
});
