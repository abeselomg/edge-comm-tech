/*
 * Absolute URLs for structured data.
 *
 * Structured data must use absolute URLs; a relative one is ignored by most
 * consumers. The origin comes from SITE_URL, which is unset until there is a
 * production domain, so it falls back to the local dev origin.
 *
 * This is deliberately its own tiny helper rather than an import of the
 * metadata work's src/lib/seo/site.ts: the two can be pointed at one helper
 * when they are integrated.
 */

const FALLBACK = "http://localhost:3000";

/** The site origin with no trailing slash. */
export function siteOrigin(): string {
  const raw = process.env.SITE_URL?.trim();
  return (raw ? raw : FALLBACK).replace(/\/+$/, "");
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
