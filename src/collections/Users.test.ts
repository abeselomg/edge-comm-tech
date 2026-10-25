import { describe, expect, it } from "vitest";
import { Users } from "./Users";

const editor = { req: { user: { id: 7, role: "editor" } } } as never;
const admin = { req: { user: { id: 1, role: "admin" } } } as never;
const anon = { req: { user: null } } as never;

type Fn = (a: never) => unknown;
const roleField = () =>
  Users.fields.find((f) => "name" in f && f.name === "role") as { access?: { update?: Fn } };

describe("users: an editor cannot escalate", () => {
  it("cannot change a role, their own included", async () => {
    const update = roleField().access?.update;
    expect(update, "role has a field-level update rule").toBeTypeOf("function");
    expect(await update!(editor)).toBe(false);
    expect(await update!(admin)).toBe(true);
  });

  it("can update only their own record, which excludes another user's email and password", async () => {
    const update = Users.access!.update as Fn;
    expect(await update(editor)).toEqual({ id: { equals: 7 } });
    expect(await update(admin)).toBe(true);
    expect(await update(anon)).toBe(false);
  });

  it("cannot create or delete users", async () => {
    for (const op of ["create", "delete"] as const) {
      const fn = Users.access![op] as Fn;
      expect(await fn(editor), op).toBe(false);
      expect(await fn(admin), op).toBe(true);
    }
  });
});

describe("users: the first user is an admin", () => {
  const hook = Users.hooks!.beforeValidate![0] as (a: never) => Promise<unknown>;
  const run = (count: number, operation: string, data: Record<string, unknown>) =>
    hook({
      data,
      operation,
      req: { payload: { count: async () => ({ totalDocs: count }) } },
    } as never);

  it("forces role admin when no user exists, whatever was submitted", async () => {
    expect(await run(0, "create", { name: "A", role: "editor" })).toMatchObject({ role: "admin" });
    expect(await run(0, "create", { name: "A" })).toMatchObject({ role: "admin" });
  });

  it("leaves the submitted role alone once a user exists", async () => {
    expect(await run(1, "create", { name: "B", role: "editor" })).toMatchObject({ role: "editor" });
  });

  it("does nothing on update", async () => {
    expect(await run(0, "update", { role: "editor" })).toMatchObject({ role: "editor" });
  });

  it("counts with access overridden, since the first signup has no session", async () => {
    let args: Record<string, unknown> | undefined;
    await hook({
      data: {},
      operation: "create",
      req: { payload: { count: async (a: Record<string, unknown>) => ((args = a), { totalDocs: 1 }) } },
    } as never);
    expect(args).toMatchObject({ collection: "users", overrideAccess: true });
  });
});
