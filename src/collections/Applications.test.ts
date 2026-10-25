import { describe, expect, it } from "vitest";
import { Applications } from "./Applications";

describe("applications collection", () => {
  it("has the slug the form-builder upload field points at", () => {
    expect(Applications.slug).toBe("applications");
  });

  it("accepts exactly PDF and DOCX", () => {
    const upload = Applications.upload as { mimeTypes?: string[] };
    expect(upload.mimeTypes).toEqual([
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]);
  });

  it("sits in the Site admin group", () => {
    expect(Applications.admin?.group).toBe("Site");
  });

  it("keeps file URLs behind access control", () => {
    const upload = Applications.upload as { disablePayloadAccessControl?: boolean };
    expect(upload.disablePayloadAccessControl).toBeUndefined();
  });

  it("lets staff read, and only admins create, change or delete", () => {
    const as = (user: unknown) => ({ req: { user } }) as never;
    for (const op of ["read", "create", "update", "delete"] as const) {
      const rule = Applications.access?.[op];
      expect(rule, op).toBeTypeOf("function");
      expect(rule?.(as(null)), `${op} anonymous`).toBe(false);
      expect(rule?.(as({ id: 1, role: "editor" })), `${op} editor`).toBe(op === "read");
      expect(rule?.(as({ id: 1, role: "admin" })), `${op} admin`).toBe(true);
    }
  });
});
