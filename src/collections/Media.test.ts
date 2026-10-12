import { describe, expect, it } from "vitest";
import type { Field } from "payload";
import { Media } from "./Media";

/*
 * The content master permits publishing only assets whose source, retrieval
 * date and internal reviewer are recorded. That rule lives in an inline
 * validator on the `approved` checkbox, which is the one thing standing between
 * an editor's tick and an unlicensed logo on a client page — so it is worth
 * pinning rather than trusting to an admin click-through.
 *
 * The validator is reachable without a database or a file upload: the
 * collection config is exported, so the closure can be called directly.
 */

type ValidatableField = {
  name?: string;
  validate?: (value: unknown, options: unknown) => unknown;
};

const approvedField = (Media.fields as ValidatableField[]).find((f) => f.name === "approved");

const approve = (value: unknown, provenance: unknown) =>
  approvedField!.validate!(value, { siblingData: { provenance } });

const complete = {
  source: "https://brand.example/press-kit",
  retrievedAt: "2026-10-12",
  reviewedBy: "A. Gebrekidan",
};

describe("media approval gate", () => {
  it("is wired to the approved checkbox", () => {
    expect(approvedField).toBeDefined();
    expect(approvedField?.validate).toBeTypeOf("function");
  });

  it("lets an unapproved asset save with nothing recorded", () => {
    // Uploading is not the gated act; publishing is. An editor must be able to
    // park a file and come back to record where it came from.
    expect(approve(false, {})).toBe(true);
    expect(approve(false, undefined)).toBe(true);
  });

  it("refuses approval when no provenance is recorded at all", () => {
    expect(approve(true, {})).toMatch(/source, retrievedAt, reviewedBy/);
    expect(approve(true, undefined)).toMatch(/source, retrievedAt, reviewedBy/);
  });

  it("names only the facts still missing", () => {
    expect(approve(true, { source: complete.source })).toMatch(/retrievedAt, reviewedBy/);
    expect(approve(true, { source: complete.source, retrievedAt: complete.retrievedAt })).toMatch(
      /reviewedBy/,
    );
  });

  it("treats a blank field as unrecorded, not as recorded-and-empty", () => {
    expect(approve(true, { source: "", retrievedAt: "", reviewedBy: "" })).toMatch(
      /source, retrievedAt, reviewedBy/,
    );
    expect(approve(true, { ...complete, reviewedBy: "" })).toMatch(/reviewedBy/);
  });

  it("allows approval once all three are recorded", () => {
    expect(approve(true, complete)).toBe(true);
  });

  it("tells the editor what to do rather than reporting a failure", () => {
    const message = approve(true, {});
    expect(message).toContain("Where this came from");
    expect(message).toContain("before approving");
  });
});

/*
 * Media itself is world-readable, because the site serves its files straight
 * from their URLs. The provenance group is not: `reviewedBy` is a colleague's
 * name and `source` can be an internal handover location, and neither belongs
 * in a public API response. An access rule attached to the wrong field fails
 * silently, so pin where it sits.
 */
describe("provenance is not public", () => {
  const provenance = (Media.fields as Field[]).find(
    (f): f is Extract<Field, { type: "group"; name: string }> =>
      f.type === "group" && "name" in f && f.name === "provenance",
  );

  it("restricts reads to signed-in staff", () => {
    expect(provenance).toBeDefined();
    expect(provenance?.access?.read).toBeTypeOf("function");
    expect(provenance?.access?.read?.({ req: { user: null } } as never)).toBe(false);
    expect(provenance?.access?.read?.({ req: { user: { id: 1 } } } as never)).toBe(true);
  });

  it("covers all three recorded facts, since they live inside the group", () => {
    const names = (provenance?.fields ?? []).flatMap((f) => ("name" in f && f.name ? [f.name] : []));
    expect(names).toEqual(["source", "retrievedAt", "reviewedBy"]);
  });

  it("leaves the collection itself readable, so file URLs keep working", () => {
    expect(Media.access?.read?.({ req: { user: null } } as never)).toBe(true);
  });
});
