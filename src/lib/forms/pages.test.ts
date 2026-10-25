import { describe, expect, it } from "vitest";
import { PATTERN_SOURCE } from "../../hooks/revalidate";
import { isKnownRoute, routeFor } from "../routes";
import { FORM_PATHS, FORM_PATTERNS } from "./pages";

describe("the pages a forms edit refreshes", () => {
  it("names the static form pages at the routes the site serves", () => {
    expect(FORM_PATHS).toEqual(
      expect.arrayContaining([
        routeFor("contact.html"),
        routeFor("subscribe.html"),
        routeFor("careers-e-academy.html"),
        routeFor("careers-internships.html"),
      ]),
    );
    for (const path of FORM_PATHS) expect(isKnownRoute(path), path).toBe(true);
  });

  it("names the event and job detail types, which expandPatterns knows how to list", () => {
    for (const pattern of FORM_PATTERNS) expect(PATTERN_SOURCE[pattern], pattern).toBeDefined();
    expect(FORM_PATTERNS).toContain("/events/[slug]");
  });
});
