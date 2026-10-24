import { describe, expect, it } from "vitest";
import { routeFor } from "../lib/routes";
import { paths as events } from "./Events";
import { paths as jobs } from "./Jobs";
import { paths as news } from "./News";
import { paths as projects } from "./Projects";
import { paths as services } from "./Services";
import { paths as solutions } from "./Solutions";

/*
 * Phase 3 revalidated the job page at /careers/jobs/<slug> while the route map
 * serves it at /careers/open-positions/<slug>, so editing a job would never
 * have refreshed its page. Each collection's detail path is checked against
 * routeFor, not against a string the collection invented.
 */
const CASES: [string, (doc: { slug?: string | null }) => string[], string, string][] = [
  ["solutions", solutions, "solution-x.html", "/solutions"],
  ["services", services, "service-x.html", "/services"],
  ["projects", projects, "project-x.html", "/projects"],
  ["news", news, "news-x.html", "/news"],
  ["events", events, "event-x.html", "/events"],
  ["jobs", jobs, "job-x.html", "/careers/open-positions"],
];

describe("revalidation paths", () => {
  for (const [name, paths, file, index] of CASES) {
    it(`${name}: refreshes its detail page at the route the site serves`, () => {
      expect(paths({ slug: "x" })).toContain(routeFor(file));
    });
    it(`${name}: refreshes its index`, () => {
      expect(paths({ slug: "x" })).toContain(index);
    });
    it(`${name}: does not invent a detail path for a document with no slug`, () => {
      expect(paths({ slug: null }).filter((p) => p.endsWith("/null") || p.endsWith("/undefined"))).toEqual([]);
    });
  }

  // Review Focus #1: unpublishing a solution must refresh every page that
  // would otherwise keep a link to it.
  it("a solution change refreshes every page that links solutions", () => {
    const refreshed = solutions({ slug: "x" });
    for (const page of ["/", "/about", "/partners", "/clients", "/blog", "/projects", "/services", "/careers/e-academy"]) {
      expect(refreshed, page).toContain(page);
    }
  });
});
