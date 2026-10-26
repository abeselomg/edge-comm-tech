/*
 * Absolute URLs for structured data.
 *
 * Structured data must use absolute URLs; a relative one is ignored by most
 * consumers. The origin is the site's single SITE_URL helper (src/lib/seo/site.ts),
 * so a page's canonical link, the sitemap and its structured data can never name
 * different origins.
 */
import { siteUrl } from "../site";

/** The site origin with no trailing slash. */
export function siteOrigin(): string {
  return siteUrl();
}

/** `path` ("/solutions/x", "solutions/x" or "") as an absolute URL on the site. */
export function absoluteUrl(path = ""): string {
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith("/") || path === "" ? path : `/${path}`;
  return `${siteOrigin()}${clean}`;
}

/** Stable node ids, so every node on a page can point at the same organisation. */
export const orgId = (): string => `${siteOrigin()}/#organization`;
export const websiteId = (): string => `${siteOrigin()}/#website`;
