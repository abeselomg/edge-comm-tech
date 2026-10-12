import type { Access, FieldAccess } from "payload";

/** Anyone may read published documents; signed-in staff may read drafts too. */
export const publishedOrSignedIn: Access = ({ req: { user } }) => {
  if (user) return true;
  return { _status: { equals: "published" } };
};

/** Only signed-in staff. */
export const signedIn: Access = ({ req: { user } }) => Boolean(user);

/** Only admins. */
export const adminOnly: Access = ({ req: { user } }) => user?.role === "admin";

/** Only admins may edit this field. */
export const adminOnlyField: FieldAccess = ({ req: { user } }) => user?.role === "admin";

/**
 * Only signed-in staff may see this field.
 *
 * For internal notes on an otherwise public document. Media is readable by
 * anyone, because the site serves its files straight from their URLs — but a
 * field carrying a colleague's name or an internal review note has no business
 * in a public API response. Server-side reads are unaffected: the local API
 * overrides access by default, so the read layer and the seed still see
 * everything.
 */
export const signedInField: FieldAccess = ({ req: { user } }) => Boolean(user);
