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

export type CollectionOps = { read: boolean; create: boolean; update: boolean; delete: boolean };
export type GlobalOps = { read: boolean; update: boolean };

export type RoleEntry<O> = { anonymous: O; editor: O; admin: O };

const NONE: CollectionOps = { read: false, create: false, update: false, delete: false };
const ALL: CollectionOps = { read: true, create: true, update: true, delete: true };

/** Content collections: public reads (published only), editors write and publish, only admins delete. */
const content: RoleEntry<CollectionOps> = {
  anonymous: { read: true, create: false, update: false, delete: false },
  editor: { read: true, create: true, update: true, delete: false },
  admin: ALL,
};

/** Globals that editors may edit. */
const editableGlobal: RoleEntry<GlobalOps> = {
  anonymous: { read: true, update: false },
  editor: { read: true, update: true },
  admin: { read: true, update: true },
};

/** Globals only admins may edit. */
const adminGlobal: RoleEntry<GlobalOps> = {
  anonymous: { read: true, update: false },
  editor: { read: true, update: false },
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

export const COLLECTION_MATRIX: Record<string, RoleEntry<CollectionOps>> = {
  ...Object.fromEntries(CONTENT_SLUGS.map((slug) => [slug, content])),

  // Media is public by URL (the site serves files straight from it); staff manage it.
  media: {
    anonymous: { read: true, create: false, update: false, delete: false },
    editor: ALL,
    admin: ALL,
  },

  // Staff may create and read accounts only for themselves; see selfOrAdmin.
  users: {
    anonymous: NONE,
    editor: { read: true, create: false, update: true /* own record only */, delete: false },
    admin: ALL,
  },

  // Form definitions are read by the public pages; a reshaped form breaks its route.
  forms: {
    anonymous: { read: true, create: false, update: false, delete: false },
    editor: { read: true, create: false, update: false, delete: false },
    admin: ALL,
  },

  // The inbox: editors read it, only admins change or delete a record.
  "form-submissions": {
    anonymous: NONE,
    editor: { read: true, create: true, update: false, delete: false },
    admin: ALL,
  },

  // Uploaded CVs: never public, staff only.
  applications: { anonymous: NONE, editor: ALL, admin: ALL },
};

export const GLOBAL_MATRIX: Record<string, RoleEntry<GlobalOps>> = {
  company: editableGlobal,
  "careers-content": editableGlobal,
  "page-copy": editableGlobal,
  "contact-details": adminGlobal,
  "site-settings": adminGlobal,
};

/** Every collection and global slug, with its permitted operations per role. */
export const ROLE_MATRIX: Record<string, RoleEntry<CollectionOps | GlobalOps>> = {
  ...COLLECTION_MATRIX,
  ...GLOBAL_MATRIX,
};
