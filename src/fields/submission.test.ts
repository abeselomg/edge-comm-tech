import { describe, expect, it } from "vitest";
import { submissionExtraFields } from "./submission";

describe("submission audit fields", () => {
  it("are read-only in the admin: consent, meta, emailStatus, emailError", () => {
    for (const name of ["consent", "meta", "emailStatus", "emailError"]) {
      const f = submissionExtraFields.find((x) => "name" in x && x.name === name) as {
        admin?: { readOnly?: boolean };
      };
      expect(f, name).toBeDefined();
      expect(f.admin?.readOnly, name).toBe(true);
    }
  });
});
