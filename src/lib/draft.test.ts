import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

/*
 * isDraft() is the one switch between the published site and an editor's
 * preview. It must say yes only when Next says draft mode is on for this
 * request AND the request carries a live staff session, and it must say no --
 * never throw -- where there is no request at all: the build's
 * generateStaticParams, the seed script, a test. A throw there would break the
 * prerendered site; a "yes" there would prerender drafts.
 *
 * The __prerender_bypass cookie alone is not enough: it has one value per
 * build, survives a Payload logout and may be restored by the browser, so a
 * logged-out or removed editor (or anyone who copied it) would keep seeing
 * drafts. The session is checked on every draft request.
 */

const draftMode = vi.fn();
const headers = vi.fn(async () => new Headers({ cookie: "payload-token=abc" }));
vi.mock("next/headers", () => ({ draftMode: () => draftMode(), headers: () => headers() }));

const auth = vi.fn();
const getPayload = vi.fn(async () => ({ auth }));
vi.mock("payload", () => ({ getPayload: () => getPayload() }));
vi.mock("@payload-config", () => ({ default: {} }));

// Each test sets the fake's behaviour itself. (No beforeEach mockReset: under
// vitest 3.2 a reset spy that then throws fails the test even when the caller
// catches the error.)
const { isDraft } = await import("./draft");

const session = (role: unknown) => ({ user: { id: 1, collection: "users", role } });

describe("isDraft", () => {
  it("is true when draft mode is on and an editor is signed in", async () => {
    draftMode.mockResolvedValue({ isEnabled: true });
    auth.mockResolvedValue(session("editor"));
    await expect(isDraft()).resolves.toBe(true);
  });

  it("is true when draft mode is on and an admin is signed in", async () => {
    draftMode.mockResolvedValue({ isEnabled: true });
    auth.mockResolvedValue(session("admin"));
    await expect(isDraft()).resolves.toBe(true);
  });

  it("authenticates from this request's own headers", async () => {
    draftMode.mockResolvedValue({ isEnabled: true });
    auth.mockResolvedValue(session("editor"));
    const h = new Headers({ cookie: "payload-token=xyz" });
    headers.mockResolvedValueOnce(h);
    await isDraft();
    expect(auth).toHaveBeenLastCalledWith({ headers: h });
  });

  it("is false when the bypass cookie is valid but nobody is signed in (logged out, cookie kept)", async () => {
    draftMode.mockResolvedValue({ isEnabled: true });
    auth.mockResolvedValue({ user: null });
    await expect(isDraft()).resolves.toBe(false);
  });

  it("is false for a signed-in user with a role that is not staff", async () => {
    draftMode.mockResolvedValue({ isEnabled: true });
    auth.mockResolvedValue(session("viewer"));
    await expect(isDraft()).resolves.toBe(false);
    auth.mockResolvedValue(session(undefined));
    await expect(isDraft()).resolves.toBe(false);
  });

  it("is false, not a throw, when authentication fails", async () => {
    draftMode.mockResolvedValue({ isEnabled: true });
    auth.mockRejectedValue(new Error("database down"));
    await expect(isDraft()).resolves.toBe(false);
    getPayload.mockRejectedValueOnce(new Error("no config"));
    auth.mockResolvedValue(session("editor"));
    await expect(isDraft()).resolves.toBe(false);
  });

  it("is false when draft mode is off, without touching headers or Payload (static pages stay static)", async () => {
    draftMode.mockResolvedValue({ isEnabled: false });
    getPayload.mockClear();
    headers.mockClear();
    auth.mockClear();
    await expect(isDraft()).resolves.toBe(false);
    expect(getPayload).not.toHaveBeenCalled();
    expect(headers).not.toHaveBeenCalled();
    expect(auth).not.toHaveBeenCalled();
  });

  it("is false, not a throw, outside a request scope (synchronous throw)", async () => {
    // Next 15.4's draftMode() throws synchronously when there is no work store.
    draftMode.mockImplementation(() => {
      throw new Error("`draftMode` was called outside a request scope.");
    });
    getPayload.mockClear();
    await expect(isDraft()).resolves.toBe(false);
    expect(getPayload).not.toHaveBeenCalled();
  });

  it("is false, not a throw, when draftMode() rejects", async () => {
    draftMode.mockImplementation(async () => {
      throw new Error("outside a request scope");
    });
    await expect(isDraft()).resolves.toBe(false);
  });

  it("treats anything but a literal true as not draft (fails closed)", async () => {
    auth.mockResolvedValue(session("editor"));
    draftMode.mockResolvedValue({ isEnabled: "yes" });
    await expect(isDraft()).resolves.toBe(false);
    draftMode.mockResolvedValue(undefined);
    await expect(isDraft()).resolves.toBe(false);
  });

  it("is memoised with React's cache() so one request authenticates once", () => {
    // Under vitest the non-server React build's cache() does not memoise, so
    // the wrapping is asserted on the source.
    const src = readFileSync(new URL("./draft.ts", import.meta.url), "utf8");
    expect(src).toMatch(/export const isDraft = cache\(/);
  });
});
