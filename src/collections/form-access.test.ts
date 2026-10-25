import { describe, expect, it } from "vitest";
import config from "../payload.config";

/*
 * The plugin's public default for form-submissions is `create: () => true`.
 * Left alone a bot can POST /api/form-submissions and skip the honeypot and
 * limiter in the submission route, so these assertions run against the fully
 * resolved config: what Payload will actually enforce, after the plugin merges
 * its defaults with our overrides.
 */

const anon = { req: { user: null } } as never;
const staff = { req: { user: { id: 1, role: "editor" } } } as never;
const admin = { req: { user: { id: 1, role: "admin" } } } as never;

async function collection(slug: string) {
  const resolved = await config;
  const found = resolved.collections.find((c) => c.slug === slug);
  if (!found) throw new Error(`collection ${slug} is not registered`);
  return found;
}

describe("form-submissions access", () => {
  it("refuses anonymous create and read, lets staff read", async () => {
    const { access } = await collection("form-submissions");
    expect(await access.create!(anon)).toBe(false);
    expect(await access.read!(anon)).toBe(false);
    expect(await access.create!(staff)).toBe(false);
    expect(await access.create!(admin)).toBe(true);
    expect(await access.read!(staff)).toBe(true);
  });

  it("limits update and delete to admins", async () => {
    const { access } = await collection("form-submissions");
    for (const op of ["update", "delete"] as const) {
      expect(await access[op]!(anon), `${op} anonymous`).toBe(false);
      expect(await access[op]!(staff), `${op} editor`).toBe(false);
      expect(await access[op]!(admin), `${op} admin`).toBe(true);
    }
  });
});

describe("forms access", () => {
  it("stays publicly readable, since pages render from it", async () => {
    const { access } = await collection("forms");
    expect(await access.read!(anon)).toBe(true);
  });

  it("is writable only by admins, since a reshaped form breaks its route", async () => {
    const { access } = await collection("forms");
    for (const op of ["create", "update", "delete"] as const) {
      expect(await access[op]!(anon), `${op} anonymous`).toBe(false);
      expect(await access[op]!(staff), `${op} editor`).toBe(false);
      expect(await access[op]!(admin), `${op} admin`).toBe(true);
    }
  });
});

describe("forms emails field", () => {
  const emailsField = async () => {
    const { fields } = await collection("forms");
    const found = fields.find((f) => "name" in f && f.name === "emails") as
      | { access?: { read?: (a: never) => unknown } }
      | undefined;
    if (!found) throw new Error("forms has no emails field");
    return found;
  };

  it("hides recipients and templates from anonymous readers, shows them to staff", async () => {
    const { access } = await emailsField();
    expect(access?.read, "emails has a field-level read rule").toBeTypeOf("function");
    expect(await access!.read!(anon)).toBe(false);
    expect(await access!.read!(staff)).toBe(true);
  });
});

describe("applications access", () => {
  it("refuses anonymous reads", async () => {
    const { access } = await collection("applications");
    expect(await access.read!(anon)).toBe(false);
    expect(await access.read!(staff)).toBe(true);
  });
});

describe("form-submissions extra fields", () => {
  const names = async () => {
    const { fields } = await collection("form-submissions");
    return fields.flatMap((f) => ("name" in f && f.name ? [f.name] : []));
  };

  it("carries consent, email status and request metadata", async () => {
    const present = await names();
    for (const n of ["consent", "emailStatus", "emailError", "meta"]) {
      expect(present, n).toContain(n);
    }
  });

  it("stores the IP only as a hash", async () => {
    const { fields } = await collection("form-submissions");
    const meta = fields.find((f) => "name" in f && f.name === "meta") as {
      fields: { name: string }[];
    };
    const sub = meta.fields.map((f) => f.name);
    expect(sub).toEqual(["ipHash", "userAgent"]);
    expect(sub).not.toContain("ip");
  });

  it("offers the four email states", async () => {
    const { fields } = await collection("form-submissions");
    const status = fields.find((f) => "name" in f && f.name === "emailStatus") as {
      options: { value: string }[];
    };
    expect(status.options.map((o) => o.value)).toEqual(["pending", "sent", "failed", "skipped"]);
  });
});

describe("applications storage", () => {
  it("keeps uploads in the directory the service unit lets Payload write", async () => {
    const { upload } = (await collection("applications")) as { upload: { staticDir?: string } };
    expect(upload.staticDir).toMatch(/applications$/);
  });
});
