/*
 * The second half of the media approval gate.
 *
 * filterOptions on the logo relationships stops an unapproved asset being
 * SELECTED in the admin. It does nothing about one that was selected while
 * approved and un-approved afterwards -- that keeps publishing, which is
 * exactly the case the content master cares about, because approval is
 * withdrawn when someone discovers the asset should not have been published.
 *
 * So every read of a logo goes through here. Absent approval is treated as
 * not approved: the default has to fail closed.
 */

export type MediaDoc = {
  id: number | string;
  url: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  approved?: boolean | null;
};

export function approvedLogo(logo: unknown): MediaDoc | null {
  if (!logo || typeof logo !== "object") return null;
  const doc = logo as Partial<MediaDoc>;
  if (doc.approved !== true) return null;
  if (typeof doc.url !== "string" || !doc.url) return null;
  return doc as MediaDoc;
}
