/*
 * Which solutions have a real image asset for their page hero.
 *
 * Files live in public/solutions/art/<slug>.<ext>. To switch one on, drop the
 * file in that folder and add its extension here, keyed by the solution slug:
 *
 *   "cybersecurity": "png",
 *
 * A slug with no entry shows the hand-drawn
 * isometric fallback scene instead. Existence is decided here, statically,
 * rather than with fs at render time, so the pages stay prerendered and a
 * missing file can never produce a broken image.
 */

export type ArtExt = "png" | "webp" | "jpg" | "jpeg" | "avif" | "svg";
export type ArtManifest = Partial<Record<string, ArtExt>>;

export const SOLUTION_ART: ArtManifest = {
  "software-ai-digital": "png",
  "enterprise-network": "png",
  "system-cloud": "png",
  // Not enabled: the sourced picture shows filing-cabinet-like boxes, so the
  // hand-drawn rack scene stays. Sources and licences: public/solutions/art/LICENSES.md
  // "datacenter-facility-it-infrastructure": "png",
  "cybersecurity": "png",
  "power-technology": "png",
  "broadcast-satellite": "png",
};

/** The public URL of a slug's art, or null when it has none. */
export function solutionArtSrc(slug: string, manifest: ArtManifest = SOLUTION_ART): string | null {
  const ext = Object.prototype.hasOwnProperty.call(manifest, slug) ? manifest[slug] : undefined;
  return ext ? `/solutions/art/${slug}.${ext}` : null;
}
