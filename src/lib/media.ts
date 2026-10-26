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

/*
 * Project pictures go through the same gate as logos. Un-approving an image
 * after it was attached must remove it from the public site, so the cover and
 * every gallery row are read through here, never straight off the document.
 */
export const approvedImage = approvedLogo;

export type GalleryPicture = { image: MediaDoc; caption: string | null };

/** The project's cover, only while the media is approved. */
export function projectCover(project: { coverImage?: unknown }): MediaDoc | null {
  return approvedImage(project.coverImage);
}

/** The gallery rows whose media is approved, in editor order; a blank caption is null. */
export function projectGallery(project: { gallery?: unknown }): GalleryPicture[] {
  if (!Array.isArray(project.gallery)) return [];
  const out: GalleryPicture[] = [];
  for (const row of project.gallery as { image?: unknown; caption?: unknown }[]) {
    const image = approvedImage(row?.image);
    if (!image) continue;
    const caption = typeof row.caption === "string" && row.caption.trim() ? row.caption.trim() : null;
    out.push({ image, caption });
  }
  return out;
}
