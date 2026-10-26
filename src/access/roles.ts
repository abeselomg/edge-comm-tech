/*
 * The staff roles: ONE list, used by the Users `role` field, the access
 * helpers, the role matrix and the admin descriptions. To add a role, add it
 * here, then give it a column in matrix.ts (the matrix test fails until every
 * collection and global has an explicit decision for it).
 */

export const ROLES = ["admin", "editor", "hr"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_INFO: Record<Role, { label: string; description: string }> = {
  admin: { label: "Admin", description: "everything, including users, settings and deleting." },
  editor: { label: "Editor", description: "website content: pages, news, events, media." },
  hr: { label: "HR", description: "careers and people records only: open positions, E-Academy, applications and CVs." },
};

/** The `options` of the Users `role` select. */
export const ROLE_OPTIONS = ROLES.map((value) => ({ label: ROLE_INFO[value].label, value }));

/** Plain-words help for the `role` field. */
export const ROLE_DESCRIPTION = ROLES.map((r) => `${ROLE_INFO[r].label}: ${ROLE_INFO[r].description}`).join(" ");

export const isRole = (value: unknown): value is Role => (ROLES as readonly unknown[]).includes(value);

/** The role of a signed-in user, or undefined for anonymous visitors and unknown values. */
export const roleOf = (user: unknown): Role | undefined => {
  const role = (user as { role?: unknown } | null | undefined)?.role;
  return isRole(role) ? role : undefined;
};

/** A readable label for a stored role value (the Users list shows this). */
export const roleLabel = (value: unknown): string => (isRole(value) ? ROLE_INFO[value].label : String(value ?? ""));
