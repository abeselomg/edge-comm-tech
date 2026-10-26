/*
 * Where the site lives, and whether search engines may index it.
 *
 * Two environment variables, read in one place so a page, the robots route, the
 * sitemap and next.config.ts cannot disagree:
 *
 *   SITE_URL        the public origin, no trailing slash, e.g.
 *                   https://www.example.com. Unset in dev and test, where the
 *                   fallback keeps absolute URLs well-formed.
 *   SITE_INDEXABLE  only the exact string "true" means indexable. Anything else
 *                   -- unset, "TRUE", "1", "yes", " true" -- means NOT. The
 *                   review server therefore stays out of search results unless
 *                   somebody deliberately flips the switch at go-live.
 *
 * Pure functions of an env object, so tests pass their own and never touch
 * process.env. Nothing here imports Next or Payload.
 */

export const SITE_NAME = "Edge Comm-Tech";
export const FALLBACK_SITE_URL = "http://localhost:3000";

type Env = Record<string, string | undefined>;

/** The public origin without a trailing slash; a malformed value falls back. */
export function siteUrl(env: Env = process.env): string {
  const raw = env.SITE_URL?.trim();
  if (!raw) return FALLBACK_SITE_URL;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return FALLBACK_SITE_URL;
    // The origin only: a path, query or fragment on SITE_URL would end up in
    // every canonical link and sitemap entry.
    return url.origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

/** True only for the exact string "true". The default is "keep out of search". */
export function siteIndexable(env: Env = process.env): boolean {
  return env.SITE_INDEXABLE === "true";
}

/**
 * An absolute URL for a site path. The query string and fragment are dropped:
 * a canonical link names the page, not the way a visitor happened to reach it.
 */
export function absoluteUrl(path: string, env: Env = process.env): string {
  const clean = path.split(/[?#]/)[0] ?? "";
  const rooted = clean.startsWith("/") ? clean : `/${clean}`;
  return rooted === "/" ? `${siteUrl(env)}/` : `${siteUrl(env)}${rooted.replace(/\/+$/, "")}`;
}

/** The picture a page is shared with when it has none of its own. */
export const DEFAULT_SHARE_IMAGE = {
  url: "/og-default.png",
  width: 1200,
  height: 630,
  alt: SITE_NAME,
} as const;
