import { describe, expect, it } from "vitest";
import config from "../payload.config";
import { ADMIN_NAV, CONTENT_SLUGS, PEOPLE_CONTENT_SLUGS, ROLE_MATRIX, UNLOCK_MATRIX, isHiddenInAdmin } from "./matrix";
import { CAREERS_FORM_TITLES } from "./index";
import { ROLES, ROLE_OPTIONS } from "./roles";

/*
 * Runs against the fully resolved config, so plugin-added collections (the
 * form builder's `forms` and `form-submissions`) are classified too.
 */

type Fn = (args: never) => unknown;
type Result = { kind: "boolean"; value: boolean } | { kind: "where"; where: Record<string, unknown> };

const users = {
  anonymous: null,
  editor: { id: 7, role: "editor" },
  hr: { id: 9, role: "hr" },
  admin: { id: 1, role: "admin" },
} as const;
type Role = keyof typeof users;

/** The forms lookup the submissions rule makes for HR: the careers forms have these ids. */
const finds: Record<string, unknown>[] = [];
const payload = {
  find: async (args: Record<string, unknown>) => {
    finds.push(args);
    return { docs: [{ id: 11 }, { id: 12 }, { id: 13 }] };
  },
};

/** Access functions return a boolean or a `where` filter; keep the two apart. */
async function evaluate(accessFn: Fn | undefined, user: unknown): Promise<Result> {
  // A missing rule falls back to Payload's default, which is "signed in".
  if (!accessFn) return { kind: "boolean", value: Boolean(user) };
  const out = await accessFn({ req: { user, payload } } as never);
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

  it("decides every operation for every role on every slug: no role is left out", () => {
    const expected = ["anonymous", ...ROLES].sort();
    for (const [slug, entry] of Object.entries(ROLE_MATRIX)) {
      expect(Object.keys(entry).sort(), slug).toEqual(expected);
    }
    expect(Object.keys(users).sort()).toEqual(expected);
    for (const entry of Object.values(UNLOCK_MATRIX)) expect(Object.keys(entry).sort()).toEqual(expected);
  });
});

describe("the role list", () => {
  it("is the one list: the Users role field offers exactly these roles, with labels", () => {
    const role = collections
      .find((c) => c.slug === "users")!
      .fields.find((f) => "name" in f && f.name === "role") as { options: { label: string; value: string }[] };
    expect(role.options).toEqual(ROLE_OPTIONS);
    expect(role.options.map((o) => o.value)).toEqual([...ROLES]);
    expect(role.options.find((o) => o.value === "hr")?.label).toBe("HR");
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

describe("role matrix: unlock on auth collections", () => {
  it("has an unlock entry for every auth collection", () => {
    const auth = collections.filter((c) => c.auth).map((c) => c.slug);
    expect(auth.sort()).toEqual(Object.keys(UNLOCK_MATRIX).sort());
  });
  for (const c of collections.filter((c) => c.auth)) {
    for (const role of Object.keys(users) as Role[]) {
      it(`${c.slug}: ${role} unlock`, async () => {
        // The resolved config fills a missing unlock with Payload's default
        // (signed in); evaluate whatever it holds.
        const fn = (c.access as Record<string, unknown> | undefined)?.unlock as Fn | undefined;
        const result = await evaluate(fn, users[role]);
        expect(permitted(result)).toBe(UNLOCK_MATRIX[c.slug]?.[role]);
      });
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

  it("limits an editor's and HR's update of users to their own record", async () => {
    const r = await evaluate(find("users").access?.update as Fn, users.editor);
    expect(r).toEqual({ kind: "where", where: { id: { equals: 7 } } });
    const h = await evaluate(find("users").access?.update as Fn, users.hr);
    expect(h).toEqual({ kind: "where", where: { id: { equals: 9 } } });
  });

  it("lets HR read only their own user record; admins and editors read all", async () => {
    const read = find("users").access?.read as Fn;
    expect(await evaluate(read, users.hr)).toEqual({ kind: "where", where: { id: { equals: 9 } } });
    expect(await evaluate(read, users.editor)).toEqual({ kind: "boolean", value: true });
    expect(await evaluate(read, users.admin)).toEqual({ kind: "boolean", value: true });
  });

  it("gives HR drafts of the people collections only; other content stays published-only for HR", async () => {
    for (const slug of CONTENT_SLUGS) {
      const r = await evaluate(find(slug).access?.read as Fn, users.hr);
      const people = (PEOPLE_CONTENT_SLUGS as readonly string[]).includes(slug);
      expect(r, slug).toEqual(
        people
          ? { kind: "boolean", value: true }
          : { kind: "where", where: { _status: { equals: "published" } } },
      );
    }
  });

  it("limits HR's form-submissions to the careers forms, found by title with access overridden", async () => {
    finds.length = 0;
    const r = await evaluate(find("form-submissions").access?.read as Fn, users.hr);
    expect(r).toEqual({ kind: "where", where: { form: { in: [11, 12, 13] } } });
    expect(finds).toHaveLength(1);
    expect(finds[0]).toMatchObject({
      collection: "forms",
      where: { title: { in: CAREERS_FORM_TITLES } },
      overrideAccess: true,
    });
    expect(CAREERS_FORM_TITLES).toEqual(["E-Academy enquiry", "Job application", "Internship application"]);
  });

  it("gives a form-submissions read of nothing to HR when the forms cannot be looked up", async () => {
    const fn = find("form-submissions").access?.read as Fn;
    expect(await fn({ req: { user: users.hr } } as never)).toBe(false);
  });

  it("treats an unknown role as no role", async () => {
    const stranger = { id: 3, role: "intern" };
    for (const slug of ["applications", "form-submissions", "jobs"]) {
      const out = await evaluate(find(slug).access?.update as Fn, stranger);
      expect(permitted(out), slug).toBe(false);
    }
    expect(permitted(await evaluate(find("applications").access?.read as Fn, stranger))).toBe(false);
  });

  it("lets an admin update any user and refuses anonymous", async () => {
    expect(await evaluate(find("users").access?.update as Fn, users.admin)).toEqual({ kind: "boolean", value: true });
    expect(await evaluate(find("users").access?.update as Fn, users.anonymous)).toEqual({
      kind: "boolean",
      value: false,
    });
  });

  it("keeps content deletion and every form-definition write admin-only, with no filter", async () => {
    const cases = [
      ...CONTENT_SLUGS.map((slug) => [slug, "delete"] as const),
      ...(["create", "update", "delete"] as const).map((op) => ["forms", op] as const),
    ];
    for (const [slug, op] of cases) {
      for (const role of ["editor", "hr"] as const) {
        expect(await evaluate(find(slug).access?.[op] as Fn, users[role]), `${slug} ${op} ${role}`).toEqual({
          kind: "boolean",
          value: false,
        });
      }
    }
  });
});

describe("the admin sidebar", () => {
  const sections = [...collections, ...globals];

  it("has a navigation decision for every role", () => {
    expect(Object.keys(ADMIN_NAV).sort()).toEqual([...ROLES].sort());
  });

  it("lists only sections that exist", () => {
    const slugs = new Set<string>(sections.map((s) => s.slug));
    for (const nav of Object.values(ADMIN_NAV)) {
      if (nav !== "all") expect(nav.filter((s) => !slugs.has(s))).toEqual([]);
    }
  });

  it("wires a hidden function onto every collection and global in the resolved config", () => {
    for (const s of sections) {
      expect((s.admin as { hidden?: unknown } | undefined)?.hidden, s.slug).toBeTypeOf("function");
    }
  });

  it("shows admins and editors every section, and HR only the people sections", () => {
    const visible = (user: unknown) =>
      sections
        .filter((s) => !(s.admin as { hidden: (a: { user: unknown }) => boolean }).hidden({ user }))
        .map((s) => s.slug)
        .sort();
    const all = sections.map((s) => s.slug).sort();
    expect(visible(users.admin)).toEqual(all);
    expect(visible(users.editor)).toEqual(all);
    expect(visible(users.hr)).toEqual(
      ["academyTracks", "applications", "careers-content", "form-submissions", "jobs", "users"].sort(),
    );
  });

  it("hides nothing without a session (create-first-user) and everything from an unknown role", () => {
    expect(isHiddenInAdmin("users", null)).toBe(false);
    expect(isHiddenInAdmin("jobs", { id: 1, role: "intern" })).toBe(true);
  });
});
