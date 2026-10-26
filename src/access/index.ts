import type { Access, FieldAccess } from "payload";
import { roleOf, type Role } from "./roles";

export * from "./roles";

/** Anyone may read published documents; signed-in staff may read drafts too. */
export const publishedOrSignedIn: Access = ({ req: { user } }) => {
  if (user) return true;
  return { _status: { equals: "published" } };
};

/** Only signed-in staff. */
export const signedIn: Access = ({ req: { user } }) => Boolean(user);

/** Only admins. */
export const adminOnly: Access = ({ req: { user } }) => roleOf(user) === "admin";

/**
 * Admins may touch any document; anyone else only their own record.
 *
 * Returns a `where` filter for non-admins, so the limit is enforced by the
 * query and not by the caller. For `users`, which holds the email and password.
 */
export const selfOrAdmin: Access = ({ req: { user } }) => {
  if (!user) return false;
  if (roleOf(user) === "admin") return true;
  return { id: { equals: user.id } };
};

/** Admins and editors read every account; anyone else (HR) only their own. */
export const usersRead: Access = ({ req: { user } }) => {
  if (!user) return false;
  const role = roleOf(user);
  if (role === "admin" || role === "editor") return true;
  return { id: { equals: user.id } };
};

const hasRole = (user: unknown, roles: readonly Role[]) => {
  const role = roleOf(user);
  return role !== undefined && roles.includes(role);
};

/** Website-content staff: admins and editors. Writes to content, media, company and page copy. */
export const contentStaff: Access = ({ req: { user } }) => hasRole(user, ["admin", "editor"]);

/** Content collections: the public reads published documents; admins and editors also read drafts. HR sees published only. */
export const contentRead: Access = ({ req: { user } }) => {
  if (hasRole(user, ["admin", "editor"])) return true;
  return { _status: { equals: "published" } };
};

/** People staff: admins, editors and HR. Writes to open positions, E-Academy tracks and the careers section. */
export const peopleStaff: Access = ({ req: { user } }) => hasRole(user, ["admin", "editor", "hr"]);

/** Open positions and E-Academy tracks: the public reads published; people staff also read drafts. */
export const peopleRead: Access = ({ req: { user } }) => {
  if (hasRole(user, ["admin", "editor", "hr"])) return true;
  return { _status: { equals: "published" } };
};

/** Titles of the forms that carry candidate data: the careers inbox HR may read. */
export const CAREERS_FORM_TITLES = ["E-Academy enquiry", "Job application", "Internship application"];

/**
 * The form-submissions inbox. Admins and editors read all of it; HR only the
 * careers forms (their ids are looked up by title); everyone else nothing.
 */
export const submissionsRead: Access = async ({ req }) => {
  const role = roleOf(req.user);
  if (role === "admin" || role === "editor") return true;
  if (role !== "hr" || !req.payload) return false;
  const { docs } = await req.payload.find({
    collection: "forms",
    where: { title: { in: CAREERS_FORM_TITLES } },
    limit: CAREERS_FORM_TITLES.length,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  });
  return { form: { in: docs.map((d) => d.id) } };
};

/** Only admins may edit this field. */
export const adminOnlyField: FieldAccess = ({ req: { user } }) => roleOf(user) === "admin";

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
