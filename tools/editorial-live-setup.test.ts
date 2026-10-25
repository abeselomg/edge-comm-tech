// @ts-nocheck -- exercises plain .mjs tools whose parameter types TypeScript can only infer from their defaults
import { describe, expect, it } from "vitest";
import {
  ADMIN_EMAIL,
  EDITOR_EMAIL,
  assertRole,
  formatEnvFile,
  generatePassword,
  runSetup,
} from "./editorial-live-setup-lib.mjs";

type User = { id: number; email: string; role: string };

/* A fake payload whose users table applies the first-user rule like src/collections/Users.ts. */
function fakePayload(seed: User[] = [], { ignoreRole = false } = {}) {
  const users = [...seed];
  let next = 100;
  const matches = (where: Record<string, Record<string, unknown>> | undefined, u: User) => {
    if (!where) return true;
    return Object.entries(where).every(([field, cond]) => {
      const v = (u as unknown as Record<string, unknown>)[field];
      if ("in" in cond) return (cond.in as unknown[]).includes(v);
      return v === cond.equals;
    });
  };
  return {
    users,
    calls: [] as string[],
    async find({ where }: { where?: never }) {
      return { docs: users.filter((u) => matches(where, u)) };
    },
    async count({ where }: { where?: never }) {
      return { totalDocs: users.filter((u) => matches(where, u)).length };
    },
    async create({ data, overrideAccess }: { data: { email: string; role: string }; overrideAccess: boolean }) {
      expect(overrideAccess).toBe(true);
      const role = users.length === 0 ? "admin" : ignoreRole ? "editor" : data.role;
      const u = { id: next++, email: data.email, role };
      users.push(u);
      return u;
    },
    async delete({ id }: { id: number }) {
      const i = users.findIndex((u) => u.id === id);
      if (i >= 0) users.splice(i, 1);
      return {};
    },
  };
}

function harness(env: Record<string, string>, payload = fakePayload()) {
  const files = new Map<string, { data: string; mode?: number }>();
  const lines: string[] = [];
  const deps = {
    payload,
    env,
    writeFile: async (path: string, data: string, opts?: { mode?: number }) => void files.set(path, { data, mode: opts?.mode }),
    chmod: async () => {},
    rm: async (path: string) => void files.delete(path),
    log: (l: string) => lines.push(l),
  };
  return { deps, files, lines, payload };
}

const prod = { NODE_ENV: "production" };

describe("generatePassword", () => {
  it("is at least 24 characters of url-safe base64 and differs every time", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i += 1) {
      const p = generatePassword();
      expect(p.length).toBeGreaterThanOrEqual(24);
      expect(p).toMatch(/^[A-Za-z0-9_-]+$/);
      seen.add(p);
    }
    expect(seen.size).toBe(200);
  });
});

describe("formatEnvFile", () => {
  it("is KEY=value lines for the four variables the probe reads", () => {
    const text = formatEnvFile({ editorPassword: "ep", adminPassword: "ap" });
    expect(text.split("\n").filter(Boolean)).toEqual([
      `EDITOR_EMAIL=${EDITOR_EMAIL}`,
      "EDITOR_PASSWORD=ep",
      `ADMIN_EMAIL=${ADMIN_EMAIL}`,
      "ADMIN_PASSWORD=ap",
    ]);
  });
});

describe("assertRole", () => {
  it("passes on a match and throws loudly on a mismatch, naming no password", () => {
    expect(() => assertRole("a@x", "admin", { role: "admin" })).not.toThrow();
    expect(() => assertRole("a@x", "editor", { role: "admin" })).toThrow(/ROLE MISMATCH/);
    expect(() => assertRole("a@x", "admin", undefined)).toThrow(/ROLE MISMATCH/);
  });
});

describe("runSetup", () => {
  it("refuses outside production, before touching the database", async () => {
    const h = harness({ EDITORIAL_SETUP_MODE: "create" });
    await expect(runSetup(h.deps)).rejects.toThrow(/NODE_ENV=production/);
    expect(h.payload.users).toHaveLength(0);
    expect(h.files.size).toBe(0);
  });

  it("rejects an unknown mode", async () => {
    await expect(runSetup(harness({ ...prod, EDITORIAL_SETUP_MODE: "wipe" }).deps)).rejects.toThrow(/dry-run, create or delete/);
  });

  it("dry-run changes nothing", async () => {
    const h = harness(prod);
    await runSetup(h.deps);
    expect(h.payload.users).toHaveLength(0);
    expect(h.files.size).toBe(0);
    expect(h.lines.join("\n")).toMatch(/dry run/);
  });

  it("create makes the admin first, then the editor, with the roles asked for, even into an empty table", async () => {
    const h = harness({ ...prod, EDITORIAL_SETUP_MODE: "create", EDITORIAL_SETUP_OUT: "/tmp/probe.env" });
    await runSetup(h.deps);
    expect(h.payload.users.map((u) => [u.email, u.role])).toEqual([
      [ADMIN_EMAIL, "admin"],
      [EDITOR_EMAIL, "editor"],
    ]);
  });

  it("create works next to a real admin as well", async () => {
    const h = harness({ ...prod, EDITORIAL_SETUP_MODE: "create" }, fakePayload([{ id: 1, email: "real@edge", role: "admin" }]));
    await runSetup(h.deps);
    expect(h.payload.users.map((u) => u.role)).toEqual(["admin", "admin", "editor"]);
  });

  it("writes the passwords to the file at mode 0600 and never logs one", async () => {
    const h = harness({ ...prod, EDITORIAL_SETUP_MODE: "create", EDITORIAL_SETUP_OUT: "/tmp/probe.env" });
    await runSetup(h.deps);
    const file = h.files.get("/tmp/probe.env");
    expect(file?.mode).toBe(0o600);
    const kv = Object.fromEntries(file!.data.split("\n").filter(Boolean).map((l) => l.split(/=(.*)/s).slice(0, 2)));
    expect(kv.EDITOR_PASSWORD.length).toBeGreaterThanOrEqual(24);
    expect(kv.ADMIN_PASSWORD.length).toBeGreaterThanOrEqual(24);
    expect(kv.EDITOR_PASSWORD).not.toBe(kv.ADMIN_PASSWORD);
    expect(h.lines.join("\n")).not.toContain(kv.EDITOR_PASSWORD);
    expect(h.lines.join("\n")).not.toContain(kv.ADMIN_PASSWORD);
  });

  it("defaults the file to /root/editorial-probe.env", async () => {
    const h = harness({ ...prod, EDITORIAL_SETUP_MODE: "create" });
    await runSetup(h.deps);
    expect([...h.files.keys()]).toEqual(["/root/editorial-probe.env"]);
  });

  it("refuses when either probe user already exists, and writes nothing", async () => {
    const h = harness({ ...prod, EDITORIAL_SETUP_MODE: "create" }, fakePayload([{ id: 1, email: EDITOR_EMAIL, role: "editor" }]));
    await expect(runSetup(h.deps)).rejects.toThrow(/already exist/);
    expect(h.files.size).toBe(0);
    expect(h.payload.users).toHaveLength(1);
  });

  it("fails loudly and undoes everything when a stored role is not the one asked for", async () => {
    const h = harness({ ...prod, EDITORIAL_SETUP_MODE: "create" }, fakePayload([{ id: 1, email: "real@edge", role: "admin" }], { ignoreRole: true }));
    await expect(runSetup(h.deps)).rejects.toThrow(/ROLE MISMATCH for admin-probe/);
    expect(h.payload.users.map((u) => u.email)).toEqual(["real@edge"]);
    expect(h.files.size).toBe(0);
  });

  it("delete removes both probe users and the file, leaves real users, and reports what remains by role", async () => {
    const h = harness(
      { ...prod, EDITORIAL_SETUP_MODE: "delete", EDITORIAL_SETUP_OUT: "/tmp/probe.env" },
      fakePayload([
        { id: 1, email: "real@edge", role: "admin" },
        { id: 2, email: ADMIN_EMAIL, role: "admin" },
        { id: 3, email: EDITOR_EMAIL, role: "editor" },
      ]),
    );
    h.files.set("/tmp/probe.env", { data: "x" });
    const out = await runSetup(h.deps);
    expect(h.payload.users.map((u) => u.email)).toEqual(["real@edge"]);
    expect(h.files.size).toBe(0);
    expect(out).toMatchObject({ deleted: 2, remaining: { admin: 1, editor: 0 } });
    expect(h.lines.join("\n")).toMatch(/remaining users: 1 admin, 0 editor/);
  });
});
