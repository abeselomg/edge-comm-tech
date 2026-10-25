import { describe, expect, it, vi } from "vitest";

/*
 * isDraft() is the one switch between the published site and an editor's
 * preview. It must say yes only when Next says draft mode is on for this
 * request, and it must say no -- never throw -- where there is no request at
 * all: the build's generateStaticParams, the seed script, a test. A throw there
 * would break the prerendered site; a "yes" there would prerender drafts.
 */

const draftMode = vi.fn();
vi.mock("next/headers", () => ({ draftMode: () => draftMode() }));

// Each test sets the fake's behaviour itself. (No beforeEach mockReset: under
// vitest 3.2 a reset spy that then throws fails the test even when the caller
// catches the error.)
const { isDraft } = await import("./draft");

describe("isDraft", () => {
  it("is true when Next reports draft mode enabled", async () => {
    draftMode.mockResolvedValue({ isEnabled: true });
    await expect(isDraft()).resolves.toBe(true);
  });

  it("is false when draft mode is disabled", async () => {
    draftMode.mockResolvedValue({ isEnabled: false });
    await expect(isDraft()).resolves.toBe(false);
  });

  it("is false, not a throw, outside a request scope (synchronous throw)", async () => {
    // Next 15.4's draftMode() throws synchronously when there is no work store.
    draftMode.mockImplementation(() => {
      throw new Error("`draftMode` was called outside a request scope.");
    });
    await expect(isDraft()).resolves.toBe(false);
  });

  it("is false, not a throw, when draftMode() rejects", async () => {
    draftMode.mockImplementation(async () => {
      throw new Error("outside a request scope");
    });
    await expect(isDraft()).resolves.toBe(false);
  });

  it("treats anything but a literal true as not draft (fails closed)", async () => {
    draftMode.mockResolvedValue({ isEnabled: "yes" });
    await expect(isDraft()).resolves.toBe(false);
    draftMode.mockResolvedValue(undefined);
    await expect(isDraft()).resolves.toBe(false);
  });
});
