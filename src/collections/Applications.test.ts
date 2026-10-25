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

  it("is staff-only for every operation", () => {
    for (const op of ["read", "create", "update", "delete"] as const) {
      const rule = Applications.access?.[op];
      expect(rule, op).toBeTypeOf("function");
      expect(rule?.({ req: { user: null } } as never), `${op} anonymous`).toBe(false);
      expect(rule?.({ req: { user: { id: 1 } } } as never), `${op} signed in`).toBe(true);
    }
  });
});
