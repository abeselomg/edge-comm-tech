// @ts-nocheck -- exercises a plain .mjs tool whose parameter types TypeScript can only infer from its defaults
import { describe, expect, it } from "vitest";
import {
  CAREERS_FORM_TITLES,
  HR_ALLOWED,
  HR_GLOBALS_ALLOWED,
  HR_GLOBALS_REFUSED,
  HR_REFUSED,
  draftsProblem,
  hrAccessProblems,
  readCreds,
  runHrProbe,
  submissionsProblem,
} from "./check-hr-live.mjs";

/** An /api/access document that matches the HR policy exactly. */
function goodAccess() {
  const collections: Record<string, Record<string, boolean>> = {};
  for (const [slug, op] of HR_ALLOWED) (collections[slug] ??= {})[op] = true;
  for (const [slug, op] of HR_REFUSED) (collections[slug] ??= {})[op] = false;
  const globals: Record<string, { update: boolean }> = {};
  for (const g of HR_GLOBALS_ALLOWED) globals[g] = { update: true };
  for (const g of HR_GLOBALS_REFUSED) globals[g] = { update: false };
  return { collections, globals };
}

describe("hrAccessProblems", () => {
  it("accepts the HR policy, in either of Payload's two shapes", () => {
    expect(hrAccessProblems(goodAccess())).toBeNull();
    const a = goodAccess();
    a.collections.jobs.create = { permission: true };
    a.collections.solutions.create = { permission: false };
    expect(hrAccessProblems(a)).toBeNull();
  });
  it("names an operation HR should not have, and one it should", () => {
    const a = goodAccess();
    a.collections.solutions.update = true;
    a.collections.applications.read = false;
    a.globals["site-settings"].update = true;
    const msg = hrAccessProblems(a);
    expect(msg).toContain("solutions.update should be refused");
    expect(msg).toContain("applications.read should be allowed");
    expect(msg).toContain("globals.site-settings.update should be refused");
  });
  it("does not allow a missing document", () => {
    expect(hrAccessProblems(null)).toMatch(/no access document/);
  });
});

describe("the REST verdicts", () => {
  it("accepts careers submissions only", () => {
    const docs = CAREERS_FORM_TITLES.map((title) => ({ form: { title } }));
    expect(submissionsProblem({ status: 200, json: { docs } })).toBeNull();
    expect(submissionsProblem({ status: 200, json: { docs: [...docs, { form: { title: "Contact" } }] } })).toMatch(/non-careers/);
    expect(submissionsProblem({ status: 403, json: null })).toMatch(/expected 200/);
  });
  it("accepts published solutions or a refusal, never a draft", () => {
    expect(draftsProblem({ status: 200, json: { docs: [{ _status: "published" }] } })).toBeNull();
    expect(draftsProblem({ status: 403 })).toBeNull();
    expect(draftsProblem({ status: 200, json: { docs: [{ _status: "draft" }] } })).toMatch(/unpublished/);
  });
  it("reads the admin credentials only", () => {
    expect(() => readCreds({})).toThrow(/ADMIN_EMAIL, ADMIN_PASSWORD/);
    expect(readCreds({ ADMIN_EMAIL: "a@b.c", ADMIN_PASSWORD: "x" })).toEqual({ adminEmail: "a@b.c", adminPassword: "x" });
  });
});

/** A fake server that behaves as the HR policy says. */
function fakeServer({ leakDrafts = false } = {}) {
  const calls: string[] = [];
  let hrId: number | null = null;
  let deleted = false;
  const res = (status: number, body: unknown = null, cookie?: string) => ({
    status,
    headers: new Headers(cookie ? { "set-cookie": `payload-token=${cookie}; Path=/` } : {}),
    text: async () => (body === null ? "" : JSON.stringify(body)),
  });
  const fetchImpl = async (url: string, init: { method: string; headers: Record<string, string>; body?: string }) => {
    const path = url.replace("http://x", "");
    const who = init.headers.cookie?.includes("admintoken") ? "admin" : init.headers.cookie?.includes("hrtoken") ? "hr" : "anon";
    calls.push(`${who} ${init.method} ${path}`);
    const body = init.body ? JSON.parse(init.body) : {};
    if (path === "/api/users/login") return body.email === "admin@x.test" ? res(200, { user: { id: 1 } }, "admintoken") : res(200, { user: { id: 50, role: "hr" } }, "hrtoken");
    if (who === "admin" && init.method === "POST" && path === "/api/users") {
      hrId = 50;
      return res(201, { doc: { id: 50, role: body.role } });
    }
    if (who === "admin" && init.method === "DELETE" && path === "/api/users/50") {
      deleted = true;
      return res(200, {});
    }
    if (who === "admin" && path.startsWith("/api/users/50")) return deleted ? res(404, {}) : res(200, { id: 50 });
    if (who !== "hr") return res(401, {});
    if (path === "/api/access") return res(200, goodAccess());
    if (path.startsWith("/preview")) return res(403, {});
    if (init.method === "GET") {
      if (path.startsWith("/api/form-submissions")) return res(200, { docs: [{ form: { title: "Job application" } }] });
      if (path.startsWith("/api/solutions")) return res(200, { docs: leakDrafts ? [{ _status: "draft" }] : [{ _status: "published" }] });
      if (path.startsWith("/api/users/me")) return res(200, { user: { id: 50, role: "hr" } });
      if (path.startsWith("/api/users")) return res(200, { docs: [{ id: 50 }] });
      return res(200, { docs: [] });
    }
    if (path === "/api/users/50" && init.method === "PATCH") return res(200, { doc: { id: 50 } });
    return res(403, {});
  };
  return { fetchImpl, calls, get hrId() { return hrId; }, get deleted() { return deleted; } };
}

describe("runHrProbe", () => {
  const creds = { adminEmail: "admin@x.test", adminPassword: "adminpass-1" };

  it("passes against a server that follows the HR policy, and deletes the throwaway user", async () => {
    const server = fakeServer();
    const lines: string[] = [];
    const { results, leftover } = await runHrProbe({ base: "http://x", creds, fetchImpl: server.fetchImpl, log: (l) => lines.push(l), run: "t1" });
    expect(results.filter((r) => !r.ok)).toEqual([]);
    expect(leftover).toBe(false);
    expect(server.deleted).toBe(true);
    expect(lines.join("\n")).not.toContain("adminpass-1");
  });

  it("fails when HR can see draft solutions, and still deletes the user", async () => {
    const server = fakeServer({ leakDrafts: true });
    const { results } = await runHrProbe({ base: "http://x", creds, fetchImpl: server.fetchImpl, run: "t2" });
    expect(results.filter((r) => !r.ok).map((r) => r.name)).toEqual(["hr-sees-no-solution-drafts"]);
    expect(server.deleted).toBe(true);
  });
});
