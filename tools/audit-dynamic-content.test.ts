import { describe, expect, it } from "vitest";
import { audit } from "./audit-dynamic-content.mjs";

describe("the dynamic-content audit", () => {
  // Every Highland property the dynamic templates read has a CMS field.
  it("finds no gap between Highland's records and the schema", () => {
    expect(audit()).toEqual([]);
  });

  it("is not vacuous: it reports a property the schema lacks", () => {
    const stripped = readTypes().replace("heldForPublication", "somethingElse");
    expect(audit(stripped).join("\n")).toMatch(/heldForPublication/);
  });
});

import { readFileSync } from "node:fs";
function readTypes() {
  return readFileSync(new URL("../src/payload-types.ts", import.meta.url), "utf8");
}
