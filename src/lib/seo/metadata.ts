import type { Metadata } from "next";
import { approvedImage } from "../media";
import {
  absoluteUrl,
  DEFAULT_SHARE_IMAGE,
  SITE_NAME,
  siteIndexable,
} from "./site";
import { stripMarkup, trimDescription } from "./text";

/*
 * Every public page builds its <head> through here, so the title format, the
 * canonical link, the Open Graph and Twitter tags and the noindex switch are
 * decided once.
 *
 * Titles. The layout owns the one template, "%s | Edge Comm-Tech". A page hands
 * over its own title and this module guarantees the brand appears exactly once:
 * a title that ends in the brand ("... — Edge Comm-Tech", "... | Edge
 * Comm-Tech") has it removed so the template can add it back in one format, and
 * a title that carries the brand in the middle ("Careers at Edge Comm-Tech —
 * ...") is used as written, with no suffix, rather than saying the name twice.
 */

export const TITLE_TEMPLATE = `%s | ${SITE_NAME}`;

/*
 * The home page and the layout's fallback, both from the site's own copy (the
 * layout description it replaces). The description is kept under the 155
 * characters a search result shows.
 */
export const HOME_TITLE = `${SITE_NAME}: integrated technology solutions in Ethiopia`;
export const SITE_DESCRIPTION =
  "Integrated technology solutions across networks, cloud, datacenters, cybersecurity, software, AI, power and broadcast for Ethiopian institutions.";

export const HOME_DESCRIPTION = SITE_DESCRIPTION;

const BRAND = new RegExp(SITE_NAME.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "i");
const TRAILING_BRAND = new RegExp(`\\s*[|\\u2013\\u2014-]\\s*${BRAND.source}\\s*$`, "i");

/** A title with any trailing brand suffix removed (never to an empty string). */
export function cleanTitle(raw: string): string {
  const text = stripMarkup(raw);
  return text.replace(TRAILING_BRAND, "").trim() || text;
}

/** The title exactly as it appears in a browser tab and in a share card. */
export function fullTitle(raw: string): string {
  const t = cleanTitle(raw);
  return BRAND.test(t) ? t : `${t} | ${SITE_NAME}`;
}

/** The value for Metadata.title: plain (the template adds the brand) or absolute. */
export function titleField(raw: string): NonNullable<Metadata["title"]> {
  const t = cleanTitle(raw);
  return BRAND.test(t) ? { absolute: t } : t;
}

export type ShareImage = {
  url: string;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
};

/**
 * A document's chosen share picture, only while its media is approved. Un-
 * approving an asset after it was picked removes it here, the same gate every
 * other image on the site passes.
 */
export function shareImageOf(media: unknown): ShareImage | null {
  const image = approvedImage(media);
  if (!image) return null;
  return { url: image.url, width: image.width, height: image.height, alt: image.alt };
}

export type SeoInput = {
  title: string;
  description?: string | null;
  /** The route, e.g. "/solutions/cybersecurity". Query strings are ignored. */
  path: string;
  image?: ShareImage | null;
  type?: "website" | "article";
  /** Keep this page out of search results even when the site is indexable. */
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
};

export function buildMetadata(input: SeoInput): Metadata {
  const title = fullTitle(input.title);
  const description = trimDescription(input.description) || undefined;
  const url = absoluteUrl(input.path);
  const picture = input.image ?? DEFAULT_SHARE_IMAGE;
  const pictureUrl = absoluteUrl(picture.url);
  const image = {
    url: pictureUrl,
    ...(picture.width ? { width: picture.width } : {}),
    ...(picture.height ? { height: picture.height } : {}),
    alt: picture.alt || SITE_NAME,
  };

  const openGraph: NonNullable<Metadata["openGraph"]> =
    input.type === "article"
      ? {
          type: "article",
          siteName: SITE_NAME,
          url,
          title,
          description,
          locale: "en_ET",
          images: [image],
          ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
          ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
        }
      : {
          type: "website",
          siteName: SITE_NAME,
          url,
          title,
          description,
          locale: "en_ET",
          images: [image],
        };

  return {
    title: titleField(input.title),
    description,
    alternates: { canonical: url },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
    ...(!siteIndexable() || input.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

type WithMeta = {
  meta?: { title?: string | null; description?: string | null; image?: unknown } | null;
};

/**
 * The title, description and share picture for a CMS document: what the editor
 * typed under "meta" (the SEO plugin's group) if anything, else the document's
 * own title and summary. A blank or whitespace-only override counts as empty.
 */
export function documentSeo(
  doc: WithMeta,
  fallback: { title: string; description?: string | null },
): { title: string; description: string; image: ShareImage | null } {
  const filled = (v: string | null | undefined) => (v && stripMarkup(v) ? stripMarkup(v) : null);
  return {
    title: filled(doc.meta?.title) ?? fallback.title,
    description: filled(doc.meta?.description) ?? stripMarkup(fallback.description),
    image: shareImageOf(doc.meta?.image),
  };
}
