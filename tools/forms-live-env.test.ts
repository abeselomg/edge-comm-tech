import { describe, expect, it } from "vitest";
import { unsafeEnvironment } from "./forms-live-shared.mjs";

describe("unsafeEnvironment", () => {
  it("refuses to run outside production, where payload would push the dev schema", () => {
    expect(unsafeEnvironment({})).toMatch(/NODE_ENV=production/);
    expect(unsafeEnvironment({ NODE_ENV: "development" })).toMatch(/NODE_ENV=production/);
  });

  it("allows production, and an explicit local override", () => {
    expect(unsafeEnvironment({ NODE_ENV: "production" })).toBeNull();
    expect(unsafeEnvironment({ FORMS_CLEANUP_ALLOW_DEV: "1" })).toBeNull();
  });
});
