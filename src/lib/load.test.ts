import { describe, expect, it, vi } from "vitest";

const NOT_FOUND = new Error("NEXT_NOT_FOUND");
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw NOT_FOUND;
  },
}));

import { loadOr404 } from "./load";

describe("loadOr404", () => {
  it("returns the document when there is one", async () => {
    await expect(loadOr404(async () => ({ slug: "a" }))).resolves.toEqual({ slug: "a" });
  });

  // An absent or unpublished slug is a 404 (Review Focus #1); readers return
  // null for both, because they filter on _status.
  it("calls notFound for null", async () => {
    await expect(loadOr404(async () => null)).rejects.toBe(NOT_FOUND);
  });

  it("calls notFound for undefined", async () => {
    await expect(loadOr404(async () => undefined)).rejects.toBe(NOT_FOUND);
  });

  it("does not swallow a real error as a 404", async () => {
    const boom = new Error("db down");
    await expect(
      loadOr404(async () => {
        throw boom;
      }),
    ).rejects.toBe(boom);
  });
});
