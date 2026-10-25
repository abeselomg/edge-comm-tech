import {
  eventHref,
  isKnownRoute,
  jobHref,
  newsHref,
  projectHref,
  routeFor,
  serviceHref,
  solutionHref,
} from "./routes";

/*
 * Draft preview: the path guard for /preview and /preview/exit, and the URL the
 * admin's Preview button opens.
 *
 * This file stays free of Payload and Next imports on purpose. The collections
 * import previewUrl for `admin.preview`, and payload.config imports the
 * collections -- a getPayload/@payload-config import here would be a cycle.
 */

/** Longer than any route the site serves by a wide margin. */
const MAX_PATH = 300;

/*
 * One path segment: the characters a slug on this site can contain once
 * lowercased, and nothing that changes how a URL parses. Deliberately no `%`:
 * Next has already decoded the query parameter once, so a `%` left in the
 * value is either a second layer of encoding (`%252F` -> `%2F`) or a slug no
 * page links to. Refusing every `%` refuses encoded slashes, backslashes, dots
 * and control characters at any depth, without having to decode and re-check.
 * `:`, `@`, `\`, whitespace and control characters fall outside the set too.
 */
const SEGMENT = /^[A-Za-z0-9._~-]+$/;
/** An in-page anchor: `apply`, `post-zero-trust`, `tracks`. */
const FRAGMENT = /^[A-Za-z0-9_-]{1,100}$/;
/** Our own machinery: never a preview target, and /preview itself would loop. */
const RESERVED = ["/api", "/admin", "/preview", "/_next"];

/**
 * The internal path to redirect to, or null.
 *
 * Accepts only a single-leading-slash path the route map could have produced
 * (`isKnownRoute`), optionally followed by a `#fragment`. A `?query` is
 * dropped, not validated: nothing on the public site reads one, and carrying
 * it through would mean trusting a second caller-chosen string.
 */
export function safePreviewPath(path: unknown): string | null {
  if (typeof path !== "string") return null;
  if (path.length === 0 || path.length > MAX_PATH) return null;

  // The fragment is everything after the first `#` (a `?` after it is part
  // of the fragment, and the fragment check refuses it); the query is
  // everything between the first `?` and the fragment.
  const hashAt = path.indexOf("#");
  const beforeHash = hashAt === -1 ? path : path.slice(0, hashAt);
  const fragment = hashAt === -1 ? null : path.slice(hashAt + 1);
  const queryAt = beforeHash.indexOf("?");
  const pathname = queryAt === -1 ? beforeHash : beforeHash.slice(0, queryAt);

  if (fragment !== null && !FRAGMENT.test(fragment)) return null;

  // Exactly one leading slash. "//host" and "/\host" are both read by
  // browsers as another origin; the segment check below catches the rest.
  if (!pathname.startsWith("/") || pathname.startsWith("//")) return null;

  if (pathname !== "/") {
    const segments = pathname.slice(1).split("/");
    for (const segment of segments) {
      // An empty segment is "//" or a trailing slash; "." and ".." would be
      // resolved by the browser to a path nobody checked.
      if (!SEGMENT.test(segment) || segment === "." || segment === "..") return null;
    }
  }

  const lower = pathname.toLowerCase();
  if (RESERVED.some((r) => lower === r || lower.startsWith(`${r}/`))) return null;

  if (!isKnownRoute(pathname)) return null;

  return fragment === null ? pathname : `${pathname}#${fragment}`;
}

type PreviewDoc = { slug?: unknown };

const slugOf = (doc: PreviewDoc): string | null =>
  typeof doc.slug === "string" && doc.slug !== "" ? doc.slug : null;

const detail = (href: (slug: string) => string) => (doc: PreviewDoc) => {
  const slug = slugOf(doc);
  return slug ? href(slug) : null;
};

const listing = (file: string, anchor?: string) => () =>
  `${routeFor(file)}${anchor ? `#${anchor}` : ""}`;

/**
 * Where each content collection is seen on the public site.
 *
 * | collection        | previewed at                           |
 * | ----------------- | -------------------------------------- |
 * | solutions         | /solutions/<slug>                      |
 * | services          | /services/<slug>                       |
 * | projects          | /projects/<slug>                       |
 * | news              | /news/<slug>                           |
 * | events            | /events/<slug>                         |
 * | jobs              | /careers/open-positions/<slug>         |
 * | posts             | /blog#post-<slug> (no page of its own) |
 * | postCategories    | /blog                                  |
 * | academyTracks     | /careers/e-academy#tracks              |
 * | downloads         | /downloads                             |
 * | clients           | /clients                               |
 * | partners          | /partners                              |
 * | partnerCategories | /partners                              |
 *
 * A detail-page document with no slug yet has nowhere to go and gets no
 * button. A news item also appears in the resource centre's media sections;
 * its own /news page is the one that shows all of it.
 */
export const PREVIEW_TARGETS: Record<string, (doc: PreviewDoc) => string | null> = {
  solutions: detail(solutionHref),
  services: detail(serviceHref),
  projects: detail(projectHref),
  news: detail(newsHref),
  events: detail(eventHref),
  jobs: detail(jobHref),
  posts: (doc) => {
    const slug = slugOf(doc);
    const anchored = slug ? `${routeFor("blog.html")}#post-${slug}` : null;
    // A slug that cannot be an anchor still previews the page, just unscrolled.
    return anchored && safePreviewPath(anchored) ? anchored : routeFor("blog.html");
  },
  postCategories: listing("blog.html"),
  academyTracks: listing("careers-e-academy.html", "tracks"),
  downloads: listing("downloads.html"),
  clients: listing("clients.html"),
  partners: listing("partners.html"),
  partnerCategories: listing("partners.html"),
};

/**
 * The admin's Preview link: a same-origin, relative `/preview?path=…`, so it
 * works on whichever host the admin is served from. Null -- no button -- for a
 * collection with no public page, or a document whose path the preview route
 * would refuse.
 */
export function previewUrl(collection: string, doc: PreviewDoc): string | null {
  if (!Object.hasOwn(PREVIEW_TARGETS, collection)) return null;
  const path = PREVIEW_TARGETS[collection](doc ?? {});
  if (!path || safePreviewPath(path) !== path) return null;
  return `/preview?path=${encodeURIComponent(path)}`;
}
