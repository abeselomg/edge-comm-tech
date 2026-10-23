/*
 * Every Highland filename, translated to the route that serves it.
 *
 * Highland is a flat set of files -- `solution-cybersecurity.html`,
 * `careers-e-academy.html` -- and this app is nested:
 * `/solutions/cybersecurity`, `/careers/e-academy`. Fourteen static pages
 * link to each other and to the dynamic families, so without one map each
 * page invents its own convention, and the parity checker has nothing to
 * compare a link against.
 *
 * Nested rather than flat for two reasons, one of them already decided:
 * `src/components/chrome.tsx` links `/solutions/<slug>` and the seed wrote
 * `page-copy.resourceSections[].href` as `/resources/media/<slug>`, so half
 * the project had committed to it before this file existed. The other reason
 * is that a reader who lands on `/solutions/cybersecurity` can guess
 * `/solutions`, and nobody can guess `solution-cybersecurity.html`.
 *
 * `executive-management.html` is a generated orphan: nothing in Highland
 * links to it. It is served at `/about/executive-management`, where someone
 * looking for the leadership team would actually look.
 */

/** A filename exactly as Highland emits it, e.g. `"solution-cybersecurity.html"`. */
export type HighlandFile = string;

/** The fourteen pages with no slug, plus the five dynamic-family indexes. */
export const STATIC_ROUTES: Record<string, string> = {
  "index.html": "/",
  "about.html": "/about",
  "executive-management.html": "/about/executive-management",
  "blog.html": "/blog",
  "careers.html": "/careers",
  "careers-open-positions.html": "/careers/open-positions",
  "careers-e-academy.html": "/careers/e-academy",
  "careers-internships.html": "/careers/internships",
  "clients.html": "/clients",
  "contact.html": "/contact",
  "downloads.html": "/downloads",
  "partners.html": "/partners",
  "resources.html": "/resources",
  "subscribe.html": "/subscribe",
};

/*
 * The per-slug families. A job lives under the page that lists it and a media
 * section under the resource centre that indexes it, rather than at the root:
 * both are reached from one place only, and the seed already wrote the media
 * hrefs this way.
 */
const SLUG_FAMILIES: { prefix: string; base: string }[] = [
  { prefix: "solution-", base: "/solutions" },
  { prefix: "service-", base: "/services" },
  { prefix: "project-", base: "/projects" },
  { prefix: "news-", base: "/news" },
  { prefix: "event-", base: "/events" },
  { prefix: "job-", base: "/careers/open-positions" },
  { prefix: "media-", base: "/resources/media" },
];

/** The five family index pages, which are not per-slug. */
const FAMILY_INDEXES: Record<string, string> = {
  "solutions.html": "/solutions",
  "services.html": "/services",
  "projects.html": "/projects",
  "news.html": "/news",
  "events.html": "/events",
};

/**
 * The route that serves a Highland page.
 *
 * Throws on anything it does not recognise. A route guessed from a pattern
 * nobody declared is a dead link that renders as a working one, and the only
 * place it would surface is a reader clicking it.
 */
export function routeFor(file: HighlandFile): string {
  const named = STATIC_ROUTES[file] ?? FAMILY_INDEXES[file];
  if (named) return named;

  if (file.endsWith(".html")) {
    const stem = file.slice(0, -".html".length);
    for (const { prefix, base } of SLUG_FAMILIES) {
      // startsWith, not a replace: a slug may contain a family's own name,
      // and "project-news-room-build" is one project, not a news item.
      if (stem.startsWith(prefix) && stem.length > prefix.length) {
        return `${base}/${stem.slice(prefix.length)}`;
      }
    }
  }

  throw new Error(
    `No route for ${JSON.stringify(file)}. Add it to STATIC_ROUTES, ` +
      "FAMILY_INDEXES or SLUG_FAMILIES in src/lib/routes.ts — a guessed " +
      "route is a dead link that looks like a working one.",
  );
}

/**
 * Whether a path is one `routeFor` could have produced: a named page, a family
 * index, or exactly one slug beneath a family base. The inverse of routeFor,
 * used to prove no rendered link is a Highland filename or an invented path.
 */
export function isKnownRoute(path: string): boolean {
  const named = new Set([...Object.values(STATIC_ROUTES), ...Object.values(FAMILY_INDEXES)]);
  if (named.has(path)) return true;
  return SLUG_FAMILIES.some(({ base }) => {
    if (!path.startsWith(`${base}/`)) return false;
    const slug = path.slice(base.length + 1);
    return slug !== "" && !slug.includes("/");
  });
}

/**
 * The documents in a populated relationship that may actually be rendered.
 *
 * Payload's `depth` populate does not re-apply the published filter to a
 * related document. Measured on this branch: unpublish the solution a post
 * points at and the post still comes back with `target` populated, carrying
 * `_status: "draft"`. A page that renders a link from it sends the reader to
 * a route that 404s.
 *
 * Absent status is treated as unpublished, the same way `approvedLogo` treats
 * absent approval: a bare id from a shallow read carries no status to trust,
 * and failing closed is the only safe default.
 */
export function publishedOnly<T extends { _status?: string | null }>(
  docs: (T | number | string | null | undefined)[],
): T[] {
  return docs.filter(
    (doc): doc is T =>
      Boolean(doc) &&
      typeof doc === "object" &&
      (doc as T)._status === "published",
  );
}
