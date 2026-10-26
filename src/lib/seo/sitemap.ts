import type { MetadataRoute } from "next";
import { jobOpen } from "../jobs";
import { eventHref, jobHref, mediaHref, newsHref, projectHref, serviceHref, solutionHref, STATIC_ROUTES } from "../routes";
import { absoluteUrl, siteIndexable } from "./site";

/*
 * The sitemap: every public page a search engine should know about, and nothing
 * else.
 *
 * Static routes come from the route map (src/lib/routes.ts), so a page added
 * there is listed here. Dynamic pages come from the same published-only readers
 * the pages themselves use (src/lib/content.ts) -- never a second query that
 * could forget the filter -- so a draft, or a document taken offline, is never
 * listed. Held news items and closed vacancies are left out too: the first is
 * marked as a draft on its own page, the second no longer takes applications.
 *
 * Not indexable: an empty sitemap. Each source is read inside its own try, so a
 * database that is down yields the static routes rather than an error page for
 * the crawler (and never takes the site down).
 */

type Doc = { slug: string; updatedAt?: string | null };

export type SitemapSources = {
  solutions: () => Promise<Doc[]>;
  services: () => Promise<Doc[]>;
  projects: () => Promise<Doc[]>;
  news: () => Promise<(Doc & { heldForPublication?: boolean | null })[]>;
  events: () => Promise<(Doc & { status?: string })[]>;
  jobs: () => Promise<(Doc & { deadline?: { status?: string | null; value?: string | null } | null })[]>;
};

type Entry = MetadataRoute.Sitemap[number];
type Freq = NonNullable<Entry["changeFrequency"]>;

/** Priority and refresh rate per static route; any route not named is 0.5 monthly. */
const STATIC_WEIGHT: Record<string, [number, Freq]> = {
  "/": [1, "weekly"],
  "/about": [0.8, "monthly"],
  "/solutions": [0.9, "monthly"],
  "/services": [0.8, "monthly"],
  "/projects": [0.8, "monthly"],
  "/contact": [0.8, "yearly"],
  "/clients": [0.6, "monthly"],
  "/partners": [0.6, "monthly"],
  "/careers": [0.6, "monthly"],
  "/careers/open-positions": [0.6, "weekly"],
  "/news": [0.5, "weekly"],
  "/events": [0.5, "weekly"],
  "/blog": [0.5, "weekly"],
  "/resources": [0.5, "monthly"],
  "/downloads": [0.4, "monthly"],
  "/subscribe": [0.3, "yearly"],
};

const FAMILY_INDEX_PATHS = ["/solutions", "/services", "/projects", "/news", "/events"];

const MEDIA_SECTIONS = ["documentaries", "press-releases", "coverage"];

const when = (d?: string | null): Date | undefined => {
  if (!d) return undefined;
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

async function soft<T>(read: () => Promise<T[]>): Promise<T[]> {
  try {
    return await read();
  } catch (error) {
    console.warn("sitemap: a source could not be read, leaving it out:", error);
    return [];
  }
}

export async function buildSitemap(
  sources: SitemapSources,
  env: Record<string, string | undefined> = process.env,
  now = new Date(),
): Promise<MetadataRoute.Sitemap> {
  if (!siteIndexable(env)) return [];

  const entry = (path: string, priority: number, changeFrequency: Freq, updatedAt?: string | null): Entry => ({
    url: absoluteUrl(path, env),
    ...(when(updatedAt) ? { lastModified: when(updatedAt) } : {}),
    changeFrequency,
    priority,
  });

  const out: Entry[] = [];

  // The route map keeps the five family indexes apart from STATIC_ROUTES.
  for (const path of [...Object.values(STATIC_ROUTES), ...FAMILY_INDEX_PATHS]) {
    const [priority, freq] = STATIC_WEIGHT[path] ?? [0.5, "monthly"];
    out.push(entry(path, priority, freq));
  }

  const [solutions, services, projects, news, events, jobs] = await Promise.all([
    soft(sources.solutions),
    soft(sources.services),
    soft(sources.projects),
    soft(sources.news),
    soft(sources.events),
    soft(sources.jobs),
  ]);

  for (const d of solutions) out.push(entry(solutionHref(d.slug), 0.8, "monthly", d.updatedAt));
  for (const d of services) out.push(entry(serviceHref(d.slug), 0.7, "monthly", d.updatedAt));
  for (const d of projects) out.push(entry(projectHref(d.slug), 0.6, "monthly", d.updatedAt));
  for (const d of news) {
    if (d.heldForPublication) continue;
    out.push(entry(newsHref(d.slug), 0.5, "monthly", d.updatedAt));
  }
  for (const d of events) {
    out.push(entry(eventHref(d.slug), d.status === "past" ? 0.3 : 0.5, "weekly", d.updatedAt));
  }
  for (const d of jobs) {
    if (!jobOpen({ deadline: d.deadline } as never, now)) continue;
    out.push(entry(jobHref(d.slug), 0.6, "weekly", d.updatedAt));
  }
  for (const key of MEDIA_SECTIONS) out.push(entry(mediaHref(key), 0.3, "monthly"));

  return out;
}
