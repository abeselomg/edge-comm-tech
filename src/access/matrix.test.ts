import { describe, expect, it } from "vitest";
import config from "../payload.config";
import { CONTENT_SLUGS, ROLE_MATRIX } from "./matrix";

/*
 * Runs against the fully resolved config, so plugin-added collections (the
 * form builder's `forms` and `form-submissions`) are classified too.
 */

type Fn = (args: never) => unknown;
type Result = { kind: "boolean"; value: boolean } | { kind: "where"; where: Record<string, unknown> };

const users = {
  anonymous: null,
  editor: { id: 7, role: "editor" },
  admin: { id: 1, role: "admin" },
} as const;
type Role = keyof typeof users;

/** Access functions return a boolean or a `where` filter; keep the two apart. */
async function evaluate(accessFn: Fn | undefined, user: unknown): Promise<Result> {
  // A missing rule falls back to Payload's default, which is "signed in".
  if (!accessFn) return { kind: "boolean", value: Boolean(user) };
  const out = await accessFn({ req: { user } } as never);
  if (typeof out === "boolean") return { kind: "boolean", value: out };
  if (out && typeof out === "object") return { kind: "where", where: out as Record<string, unknown> };
  throw new Error(`access returned ${String(out)}`);
}

/** A `where` result means the operation is permitted, but only on matching documents. */
const permitted = (r: Result) => r.kind === "where" || r.value;

const resolved = await config;
// Payload's own internal collections (payload-preferences, payload-migrations,
// payload-locked-documents, ...) are not ours to classify; everything else is.
const ours = (slug: string) => !slug.startsWith("payload-");
const collections = resolved.collections.filter((c) => ours(c.slug));
const globals = (resolved.globals ?? []).filter((g) => ours(g.slug));

describe("role matrix coverage", () => {
  it("has an entry for every collection and global in the resolved config", () => {
    const slugs = [...collections.map((c) => c.slug), ...globals.map((g) => g.slug)];
    expect(slugs.filter((s) => !(s in ROLE_MATRIX))).toEqual([]);
  });

  it("has no entry for a slug that is not in the resolved config", () => {
    const slugs = new Set<string>([...collections.map((c) => c.slug), ...globals.map((g) => g.slug)]);
    expect(Object.keys(ROLE_MATRIX).filter((s) => !slugs.has(s))).toEqual([]);
  });

  it("classifies the 13 content collections", () => {
    expect(CONTENT_SLUGS).toHaveLength(13);
  });
});

describe("role matrix: collections", () => {
  for (const c of collections) {
    for (const role of Object.keys(users) as Role[]) {
      for (const op of ["read", "create", "update", "delete"] as const) {
        it(`${c.slug}: ${role} ${op}`, async () => {
          const expected = (ROLE_MATRIX[c.slug]?.[role] as Record<string, boolean>)[op];
          const result = await evaluate(c.access?.[op] as Fn | undefined, users[role]);
          expect(permitted(result)).toBe(expected);
        });
      }
    }
  }
});

describe("role matrix: globals", () => {
  for (const g of globals) {
    for (const role of Object.keys(users) as Role[]) {
      for (const op of ["read", "update"] as const) {
        it(`${g.slug}: ${role} ${op}`, async () => {
          const expected = (ROLE_MATRIX[g.slug]?.[role] as Record<string, boolean>)[op];
          const result = await evaluate(g.access?.[op] as Fn | undefined, users[role]);
          expect(permitted(result)).toBe(expected);
        });
      }
    }
  }
});

describe("filtered access", () => {
  const find = (slug: string) => collections.find((c) => c.slug === slug)!;

  it("limits anonymous reads of every content collection to published documents", async () => {
    for (const slug of CONTENT_SLUGS) {
      const r = await evaluate(find(slug).access?.read as Fn, users.anonymous);
      expect(r, slug).toEqual({ kind: "where", where: { _status: { equals: "published" } } });
    }
  });

  it("lets signed-in staff read drafts of every content collection unfiltered", async () => {
    for (const slug of CONTENT_SLUGS) {
      for (const role of ["editor", "admin"] as const) {
        expect(await evaluate(find(slug).access?.read as Fn, users[role]), `${slug} ${role}`).toEqual({
          kind: "boolean",
          value: true,
        });
      }
    }
  });

  it("limits an editor's update of users to their own record", async () => {
    const r = await evaluate(find("users").access?.update as Fn, users.editor);
    expect(r).toEqual({ kind: "where", where: { id: { equals: 7 } } });
  });

  it("lets an admin update any user and refuses anonymous", async () => {
    expect(await evaluate(find("users").access?.update as Fn, users.admin)).toEqual({ kind: "boolean", value: true });
    expect(await evaluate(find("users").access?.update as Fn, users.anonymous)).toEqual({
      kind: "boolean",
      value: false,
    });
  });

  it("keeps content deletion and form definitions admin-only, with no filter", async () => {
    for (const slug of [...CONTENT_SLUGS, "forms"]) {
      for (const op of ["delete"] as const) {
        expect(await evaluate(find(slug).access?.[op] as Fn, users.editor), `${slug} ${op}`).toEqual({
          kind: "boolean",
          value: false,
        });
      }
    }
  });
});
