/*
 * The role matrix: who may do what, for every collection and global.
 *
 * This is the single source of truth for authorization policy. The config
 * enforces it through the helpers in ./index.ts; matrix.test.ts resolves the
 * real config and asserts every cell, and fails when a collection or global
 * exists without an entry here (or an entry exists without one), so nothing can
 * ship unclassified.
 *
 * A cell is `true` when the operation is permitted at all. Some permitted
 * operations carry a filter (anonymous reads of content are limited to
 * published documents; an editor may update only their own user record). Those
 * filters are pinned separately in matrix.test.ts, because a boolean cannot
 * say "only these documents".
 */

import { roleOf, type Role } from "./roles";

export type CollectionOps = { read: boolean; create: boolean; update: boolean; delete: boolean };
export type GlobalOps = { read: boolean; update: boolean };

export type RoleEntry<O> = { anonymous: O } & Record<Role, O>;

const NONE: CollectionOps = { read: false, create: false, update: false, delete: false };
const ALL: CollectionOps = { read: true, create: true, update: true, delete: true };

/** Content collections: public reads (published only), editors write and publish, only admins delete. HR reads published only, like the public. */
const content: RoleEntry<CollectionOps> = {
  anonymous: { read: true, create: false, update: false, delete: false },
  editor: { read: true, create: true, update: true, delete: false },
  hr: { read: true /* published only */, create: false, update: false, delete: false },
  admin: ALL,
};

/** People content (open positions, E-Academy tracks): as content, and HR writes it too. */
const peopleContent: RoleEntry<CollectionOps> = {
  ...content,
  hr: { read: true, create: true, update: true, delete: false },
};

/** Globals that editors may edit. */
const editableGlobal: RoleEntry<GlobalOps> = {
  anonymous: { read: true, update: false },
  editor: { read: true, update: true },
  hr: { read: true, update: false },
  admin: { read: true, update: true },
};

/** The careers global: editors and HR edit it. */
const peopleGlobal: RoleEntry<GlobalOps> = {
  ...editableGlobal,
  hr: { read: true, update: true },
};

/** Globals only admins may edit. */
const adminGlobal: RoleEntry<GlobalOps> = {
  anonymous: { read: true, update: false },
  editor: { read: true, update: false },
  hr: { read: true, update: false },
  admin: { read: true, update: true },
};

/** Slugs of the 13 content collections, each of which has drafts and a public page or rail. */
export const CONTENT_SLUGS = [
  "academyTracks",
  "clients",
  "downloads",
  "events",
  "jobs",
  "news",
  "partnerCategories",
  "partners",
  "postCategories",
  "posts",
  "projects",
  "services",
  "solutions",
] as const;

/** The content collections that are people records: HR creates and edits these. */
export const PEOPLE_CONTENT_SLUGS = ["academyTracks", "jobs"] as const;

export const COLLECTION_MATRIX: Record<string, RoleEntry<CollectionOps>> = {
  ...Object.fromEntries(CONTENT_SLUGS.map((slug) => [slug, content])),
  ...Object.fromEntries(PEOPLE_CONTENT_SLUGS.map((slug) => [slug, peopleContent])),

  // Media is public by URL (the site serves files straight from it); staff manage it.
  media: {
    anonymous: { read: true, create: false, update: false, delete: false },
    editor: ALL,
    hr: { read: true, create: false, update: false, delete: false },
    admin: ALL,
  },

  // Admins and editors read all accounts; only admins create or delete; editors and HR update only their own record (selfOrAdmin).
  users: {
    anonymous: NONE,
    editor: { read: true, create: false, update: true /* own record only */, delete: false },
    hr: { read: true /* own record only */, create: false, update: true /* own record only */, delete: false },
    admin: ALL,
  },

  // Form definitions are read by the public pages; a reshaped form breaks its route.
  forms: {
    anonymous: { read: true, create: false, update: false, delete: false },
    editor: { read: true, create: false, update: false, delete: false },
    hr: { read: true, create: false, update: false, delete: false },
    admin: ALL,
  },

  // The inbox: editors read it; HR reads only the careers forms (E-Academy, job, internship); only admins create (the route uses the local API), change or delete.
  "form-submissions": {
    anonymous: NONE,
    editor: { read: true, create: false, update: false, delete: false },
    hr: { read: true /* careers forms only */, create: false, update: false, delete: false },
    admin: ALL,
  },

  // Uploaded CVs: never public; admins, editors and HR read, only admins change or delete.
  applications: {
    anonymous: NONE,
    editor: { read: true, create: false, update: false, delete: false },
    hr: { read: true, create: false, update: false, delete: false },
    admin: ALL,
  },
};

export const GLOBAL_MATRIX: Record<string, RoleEntry<GlobalOps>> = {
  company: editableGlobal,
  "careers-content": peopleGlobal,
  "page-copy": editableGlobal,
  "contact-details": adminGlobal,
  "site-settings": adminGlobal,
};

/*
 * Auth collections also have an `unlock` operation (POST /api/<slug>/unlock),
 * which clears a locked account's failed-login count. Payload's default is
 * "any signed-in user", so an editor could unlock an admin's account that was
 * locked by a password-guessing attack. Only admins may unlock. Payload reads
 * access.unlock in the unlock operation only; login and forgot-password do not
 * consult it.
 */
export const UNLOCK_MATRIX: Record<string, { anonymous: boolean } & Record<Role, boolean>> = {
  users: { anonymous: false, editor: false, hr: false, admin: true },
};

/** Every collection and global slug, with its permitted operations per role. */
export const ROLE_MATRIX: Record<string, RoleEntry<CollectionOps | GlobalOps>> = {
  ...COLLECTION_MATRIX,
  ...GLOBAL_MATRIX,
};

/*
 * The admin sidebar. Access alone is not enough to hide a section: content is
 * publicly readable, so HR "can read" it over the API but has no business
 * seeing it in the admin. A role listed "all" sees every section; otherwise
 * only the slugs listed (collections and globals alike). Enforced through
 * `admin.hidden` (see hiddenInAdmin) and pinned by matrix.test.ts, which also
 * fails when a role has no entry.
 */
export const ADMIN_NAV: Record<Role, "all" | readonly string[]> = {
  admin: "all",
  editor: "all",
  hr: ["jobs", "academyTracks", "applications", "form-submissions", "careers-content", "users"],
};

/** Whether the admin hides `slug` from this user. No session (create-first-user) hides nothing; an unknown role hides everything. */
export function isHiddenInAdmin(slug: string, user: unknown): boolean {
  if (!user) return false;
  const role = roleOf(user);
  if (!role) return true;
  const nav = ADMIN_NAV[role];
  return nav !== "all" && !nav.includes(slug);
}

/** The `admin.hidden` function for a collection or global. */
export const hiddenInAdmin =
  (slug: string) =>
  ({ user }: { user?: unknown }): boolean =>
    isHiddenInAdmin(slug, user);
