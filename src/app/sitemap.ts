import type { MetadataRoute } from "next";
import {
  getEvents,
  getJobs,
  getNews,
  getProjects,
  getServices,
  getSolutions,
} from "@/lib/content";
import { buildSitemap } from "@/lib/seo/sitemap";

/*
 * Dynamic on purpose: the sitemap reads SITE_INDEXABLE and the published
 * documents when a crawler asks, so a build made with the database down or the
 * switch off can never freeze an empty or stale file into the deployment.
 */
export const dynamic = "force-dynamic";

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemap({
    solutions: getSolutions,
    services: getServices,
    projects: getProjects,
    news: getNews,
    events: getEvents,
    jobs: getJobs,
  });
}
