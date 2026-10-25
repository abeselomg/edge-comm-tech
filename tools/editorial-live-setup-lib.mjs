/*
 * The logic behind tools/editorial-live-setup.mjs, kept free of Payload imports
 * (the payload client, the file system and the random source are passed in) so
 * the tests can drive it with fakes. `payload run` loads the script; this must
 * work there and under vitest alike.
 */
import { randomBytes } from "node:crypto";
import { unsafeEnvironment } from "./forms-live-shared.mjs";

export const EDITOR_EMAIL = "editor-probe@example.invalid";
export const ADMIN_EMAIL = "admin-probe@example.invalid";
export const DEFAULT_OUT = "/root/editorial-probe.env";
export const MODES = ["dry-run", "create", "delete"];
export const MIN_PASSWORD_LENGTH = 24;

/** A random password: 32 characters of base64url (A-Z a-z 0-9 - _), from 24 random bytes. */
export function generatePassword(bytes = randomBytes) {
  return bytes(24).toString("base64url");
}

/** The KEY=value file the probe's shell reads. Passwords appear only here. */
export function formatEnvFile({ editorPassword, adminPassword }) {
  return [
    `EDITOR_EMAIL=${EDITOR_EMAIL}`,
    `EDITOR_PASSWORD=${editorPassword}`,
    `ADMIN_EMAIL=${ADMIN_EMAIL}`,
    `ADMIN_PASSWORD=${adminPassword}`,
    "",
  ].join("\n");
}

/** Throw when a stored role is not the one that was asked for. Never mentions a password. */
export function assertRole(email, wanted, doc) {
  if (doc?.role !== wanted) {
    throw new Error(`ROLE MISMATCH for ${email}: asked for "${wanted}" but the stored role is "${doc?.role}". Run again with EDITORIAL_SETUP_MODE=delete before retrying.`);
  }
}

const emailsWhere = { email: { in: [EDITOR_EMAIL, ADMIN_EMAIL] } };

/**
 * Run the setup. `deps`: { payload, env, writeFile(path, data, opts), chmod(path, mode), rm(path), log }.
 * Returns a summary object; throws (after undoing what it did) on any failure.
 */
export async function runSetup({ payload, env, writeFile, chmod, rm, log = (_line) => {}, random = randomBytes }) {
  const unsafe = unsafeEnvironment(env);
  if (unsafe) throw new Error(unsafe);
  const mode = env.EDITORIAL_SETUP_MODE ?? "dry-run";
  if (!MODES.includes(mode)) throw new Error(`EDITORIAL_SETUP_MODE must be dry-run, create or delete (got "${mode}").`);
  const out = env.EDITORIAL_SETUP_OUT || DEFAULT_OUT;

  const existing = await payload.find({ collection: "users", where: emailsWhere, limit: 10, depth: 0, overrideAccess: true, pagination: false });
  const found = existing.docs ?? [];

  if (mode === "dry-run") {
    log(`dry run: would create ${ADMIN_EMAIL} (admin), then ${EDITOR_EMAIL} (editor), and write their passwords to ${out} (mode 0600).`);
    log(found.length ? `already present: ${found.map((u) => u.email).join(", ")} (create would refuse)` : "neither user exists yet.");
    return { mode, found: found.length };
  }

  if (mode === "create") {
    if (found.length) throw new Error(`Refusing to create: ${found.map((u) => u.email).join(", ")} already exist(s). Run EDITORIAL_SETUP_MODE=delete first.`);
    const passwords = { adminPassword: generatePassword(random), editorPassword: generatePassword(random) };
    // The file first: a user whose password was never saved is useless. Undone on failure.
    await writeFile(out, formatEnvFile(passwords), { mode: 0o600 });
    await chmod(out, 0o600);
    const made = [];
    try {
      // The admin first: the first-user hook makes whoever is created into an empty table an admin.
      const admin = await payload.create({ collection: "users", data: { email: ADMIN_EMAIL, password: passwords.adminPassword, name: "Editorial probe admin", role: "admin" }, overrideAccess: true, depth: 0 });
      made.push(admin.id);
      assertRole(ADMIN_EMAIL, "admin", admin);
      const editor = await payload.create({ collection: "users", data: { email: EDITOR_EMAIL, password: passwords.editorPassword, name: "Editorial probe editor", role: "editor" }, overrideAccess: true, depth: 0 });
      made.push(editor.id);
      assertRole(EDITOR_EMAIL, "editor", editor);
      // Re-read: what is stored, not what the create call echoed.
      const stored = await payload.find({ collection: "users", where: emailsWhere, limit: 10, depth: 0, overrideAccess: true, pagination: false });
      const byEmail = Object.fromEntries((stored.docs ?? []).map((u) => [u.email, u]));
      assertRole(ADMIN_EMAIL, "admin", byEmail[ADMIN_EMAIL]);
      assertRole(EDITOR_EMAIL, "editor", byEmail[EDITOR_EMAIL]);
    } catch (error) {
      for (const id of made.reverse()) await payload.delete({ collection: "users", id, overrideAccess: true }).catch(() => {});
      await rm(out);
      throw error;
    }
    log(`created ${ADMIN_EMAIL} (admin) and ${EDITOR_EMAIL} (editor). Passwords written to ${out} (mode 0600); not printed.`);
    return { mode, created: 2, out };
  }

  // delete
  // Never leave the server with no administrator: with zero users, anyone who
  // opens /admin can "Create first user" and becomes an admin. So the real
  // administrator must exist before the probe admin goes.
  const allAdmins = await payload.find({ collection: "users", where: { role: { equals: "admin" } }, limit: 100, depth: 0, overrideAccess: true, pagination: false });
  const otherAdmins = (allAdmins.docs ?? []).filter((u) => u.email !== ADMIN_EMAIL);
  if (otherAdmins.length === 0) {
    throw new Error(
      "Refusing to delete: there is no other administrator besides the probe admin, and deleting it could leave the site with no admin " +
        "(an empty users table lets anyone who opens /admin create the first user and become an administrator). " +
        "Have Edge's real administrator create their account at /admin first (they choose their own password), then re-run. Nothing was deleted.",
    );
  }
  for (const user of found) {
    await payload.delete({ collection: "users", id: user.id, overrideAccess: true });
    log(`deleted ${user.email}`);
  }
  await rm(out);
  log(`removed ${out} if it existed.`);
  const total = (await payload.count({ collection: "users", overrideAccess: true })).totalDocs;
  const admins = (await payload.count({ collection: "users", where: { role: { equals: "admin" } }, overrideAccess: true })).totalDocs;
  const editors = (await payload.count({ collection: "users", where: { role: { equals: "editor" } }, overrideAccess: true })).totalDocs;
  log(`remaining users: ${total} (${admins} admin, ${editors} editor)`);
  if (admins === 0) {
    throw new Error(
      "WARNING: NO ADMINISTRATOR LEFT. The users table has no admin. If it is also empty, anyone who opens /admin can create the first user and become an administrator. " +
        "Create Edge's real administrator at /admin NOW.",
    );
  }
  return { mode, deleted: found.length, remaining: { total, admin: admins, editor: editors } };
}
