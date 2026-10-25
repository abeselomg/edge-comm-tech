import { beforeEach, describe, expect, it, vi } from "vitest";

/*
 * /preview is the only way into draft mode, so these tests are about who gets
 * in. getPayload, payload.auth and Next's draftMode() are faked: no database,
 * no Next server. The session is the only credential -- a draft cookie, a
 * query secret or a guess at either gets nothing.
 */

const enable = vi.fn();
const disable = vi.fn();
let draftEnabled = false;
vi.mock("next/headers", () => ({
  draftMode: async () => ({ enable, disable, isEnabled: draftEnabled }),
}));

const auth = vi.fn();
const getPayload = vi.fn(async () => ({ auth }));
vi.mock("payload", () => ({ getPayload: () => getPayload() }));
vi.mock("@payload-config", () => ({ default: {} }));

const { GET: preview } = await import("./route");
const { GET: exit } = await import("./exit/route");

const staff = (role: "admin" | "editor") => ({ user: { id: 1, collection: "users", role, email: "e@example.test" } });

function request(url: string, headers: Record<string, string> = {}) {
  return new Request(new URL(url, "https://edge.test"), { headers });
}

beforeEach(() => {
  enable.mockClear();
  disable.mockClear();
  auth.mockReset();
  getPayload.mockClear();
  draftEnabled = false;
});

describe("GET /preview", () => {
  it("refuses a request with no session: 401, no cookie, no redirect", async () => {
    auth.mockResolvedValue({ user: null });
    const res = await preview(request("/preview?path=/events"));
    expect(res.status).toBe(401);
    expect(res.headers.get("location")).toBeNull();
    expect(res.headers.get("set-cookie")).toBeNull();
    expect(enable).not.toHaveBeenCalled();
  });

  it("authenticates from the request's own headers", async () => {
    auth.mockResolvedValue({ user: null });
    const req = request("/preview?path=/events", { cookie: "payload-token=abc" });
    await preview(req);
    expect(auth).toHaveBeenCalledWith({ headers: req.headers });
  });

  it("is not fooled by a draft cookie without a session", async () => {
    // A forged or stale __prerender_bypass cookie, and even Next believing
    // draft mode is already on, must not stand in for a signed-in user.
    draftEnabled = true;
    auth.mockResolvedValue({ user: null });
    const res = await preview(
      request("/preview?path=/events", { cookie: "__prerender_bypass=0123456789abcdef" }),
    );
    expect(res.status).toBe(401);
    expect(res.headers.get("location")).toBeNull();
    expect(enable).not.toHaveBeenCalled();
  });

  it("does not accept a secret query parameter in place of a session", async () => {
    auth.mockResolvedValue({ user: null });
    const res = await preview(request("/preview?path=/events&secret=anything&token=x"));
    expect(res.status).toBe(401);
    expect(enable).not.toHaveBeenCalled();
  });

  it("refuses, closed, when authentication itself fails", async () => {
    auth.mockRejectedValue(new Error("database down"));
    const res = await preview(request("/preview?path=/events"));
    expect(res.status).toBe(401);
    expect(enable).not.toHaveBeenCalled();
  });

  it("refuses a signed-in user who is not staff", async () => {
    auth.mockResolvedValue({ user: { id: 9, collection: "users", role: "visitor" } });
    const res = await preview(request("/preview?path=/events"));
    expect(res.status).toBe(403);
    expect(enable).not.toHaveBeenCalled();
  });

  it.each(["admin", "editor"] as const)("lets an %s in: draft mode on, 307 to the path", async (role) => {
    auth.mockResolvedValue(staff(role));
    const res = await preview(request(`/preview?path=${encodeURIComponent("/solutions/cybersecurity")}`));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("/solutions/cybersecurity");
    expect(res.headers.get("cache-control")).toContain("no-store");
    expect(enable).toHaveBeenCalledTimes(1);
  });

  it("keeps a fragment and drops a query string", async () => {
    auth.mockResolvedValue(staff("editor"));
    const path = "/careers/open-positions/hr-manager?x=1#apply";
    const res = await preview(request(`/preview?path=${encodeURIComponent(path)}`));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("/careers/open-positions/hr-manager#apply");
  });

  it.each([
    ["missing", "/preview"],
    ["empty", "/preview?path="],
    ["protocol-relative", `/preview?path=${encodeURIComponent("//evil.test")}`],
    ["absolute", `/preview?path=${encodeURIComponent("https://evil.test/")}`],
    ["backslash", `/preview?path=${encodeURIComponent("/\\evil.test")}`],
    ["encoded slash", `/preview?path=${encodeURIComponent("/%2Fevil.test")}`],
    ["double-encoded slash", "/preview?path=%252F%252Fevil.test"],
    ["api", `/preview?path=${encodeURIComponent("/api/users")}`],
    ["admin", `/preview?path=${encodeURIComponent("/admin")}`],
    ["itself", `/preview?path=${encodeURIComponent("/preview?path=/events")}`],
    ["unknown", `/preview?path=${encodeURIComponent("/not-a-page")}`],
  ])("refuses a %s path with 400 and does not enable draft mode", async (_label, url) => {
    auth.mockResolvedValue(staff("admin"));
    const res = await preview(request(url));
    expect(res.status).toBe(400);
    expect(res.headers.get("location")).toBeNull();
    expect(enable).not.toHaveBeenCalled();
  });

  it("does not echo the caller's input back", async () => {
    auth.mockResolvedValue(staff("admin"));
    const res = await preview(request(`/preview?path=${encodeURIComponent("/<script>alert(1)</script>")}`));
    expect(res.status).toBe(400);
    expect(await res.text()).not.toContain("script");
  });
});

describe("GET /preview/exit", () => {
  it("turns draft mode off and goes back to a safe path, without needing a session", async () => {
    const res = await exit(request(`/preview/exit?path=${encodeURIComponent("/events/expo")}`));
    expect(disable).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("/events/expo");
    expect(auth).not.toHaveBeenCalled();
  });

  it.each([
    ["missing", "/preview/exit"],
    ["protocol-relative", `/preview/exit?path=${encodeURIComponent("//evil.test")}`],
    ["absolute", `/preview/exit?path=${encodeURIComponent("https://evil.test")}`],
    ["unknown", `/preview/exit?path=${encodeURIComponent("/nowhere")}`],
    ["loop", `/preview/exit?path=${encodeURIComponent("/preview")}`],
  ])("falls back to the home page for a %s path", async (_label, url) => {
    const res = await exit(request(url));
    expect(disable).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("/");
  });
});
