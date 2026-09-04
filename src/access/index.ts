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
