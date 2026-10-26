import type { MetadataRoute } from "next";
import { siteIndexable, siteUrl } from "./site";

/*
 * What /robots.txt says.
 *
 * Not indexable (the default): everything is disallowed and no sitemap is
 * offered, so a crawler that honours robots.txt has nothing to follow. The
 * noindex meta tag and X-Robots-Tag header cover the crawlers that fetch a page
 * anyway.
 *
 * Indexable: the public site is open and the private surfaces are not. Nothing
 * under /_next is blocked -- Google renders pages and needs the scripts and
 * styles in /_next/static. Uploaded pictures are served from
 * /api/media/file/, so that one path is allowed back in beneath the /api/
 * block (the longer rule wins) or no image on the site could appear in image
 * search.
 */
export function buildRobots(env: Record<string, string | undefined> = process.env): MetadataRoute.Robots {
  if (!siteIndexable(env)) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/media/file/"],
      disallow: ["/admin", "/api/", "/preview", "/forms"],
    },
    sitemap: `${siteUrl(env)}/sitemap.xml`,
  };
}
