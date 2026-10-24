import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  EventDetails,
  EventsEmpty,
  OtherEvents,
  PastRow,
  RegistrationPanel,
  splitEvents,
  UpcomingCard,
} from "./event-parts";

const html = (el: React.ReactElement | null) => renderToStaticMarkup(<div>{el}</div>);
const event = (over: Record<string, unknown> = {}) =>
  ({
    _status: "published",
    slug: "e1",
    title: "Agentic AI webinar",
    category: "Webinar",
    format: "Online",
    venue: "Microsoft Teams",
    headline: "Agentic AI in practice",
    intro: "An intro.",
    audience: "University leaders",
    displayDate: "28 September 2026",
    startsOn: "2026-09-28",
    endsOn: null,
    program: [{ item: "Topic one" }],
    action: "Register now",
    pendingNote: null,
    status: "upcoming",
    ...over,
  }) as never;

describe("splitEvents", () => {
  it("groups by derived status and keeps the approved order inside each group", () => {
    const { upcoming, past } = splitEvents([
      event({ slug: "a", status: "past" }),
      event({ slug: "b" }),
      event({ slug: "c", status: "past" }),
      event({ slug: "d" }),
    ]);
    expect(upcoming.map((e) => e.slug)).toEqual(["b", "d"]);
    expect(past.map((e) => e.slug)).toEqual(["a", "c"]);
  });
});

// Review Focus #2: a prerendered event goes stale once its date passes.
describe("event routes revalidate on a timer", () => {
  for (const file of ["page.tsx", "[slug]/page.tsx"]) {
    it(`${file} exports a revalidate window of a day or less`, () => {
      const src = readFileSync(new URL(`./${file}`, import.meta.url), "utf8");
      const m = /export const revalidate = (\d+)/.exec(src);
      expect(m, `${file} must export revalidate`).not.toBeNull();
      expect(Number(m![1])).toBeGreaterThan(0);
      expect(Number(m![1])).toBeLessThanOrEqual(86400);
    });
  }
});

describe("RegistrationPanel", () => {
  it("is an inert form with its action while the event is upcoming", () => {
    const out = html(<RegistrationPanel event={event()} accent="#0888c5" email="sales@example.com" />);
    expect(out).toContain("What registrants should expect");
    expect(out).toContain("Register now");
    expect(out).toContain("disabled");
    expect(out).not.toMatch(/<input(?![^>]*disabled)/);
    expect(out).not.toMatch(/<button(?![^>]*disabled)/);
  });

  it("is closed, with no form, once the event has run", () => {
    const out = html(<RegistrationPanel event={event({ status: "past" })} accent="#5c6b76" email="x@example.com" />);
    expect(out).toContain("Registration closed");
    expect(out).toContain("This event has already run");
    expect(out).not.toContain("<form");
    expect(out).toContain('href="/subscribe"');
  });
});

describe("EventDetails", () => {
  it("labels the venue Platform for an online event and Venue otherwise", () => {
    expect(html(<EventDetails event={event()} />)).toContain("Platform");
    const hybrid = html(<EventDetails event={event({ format: "In person", venue: "Sheraton" })} />);
    expect(hybrid).toContain("Venue");
    expect(hybrid).not.toContain("Platform");
  });

  it("states Upcoming or Completed from the derived status", () => {
    expect(html(<EventDetails event={event()} />)).toContain("Upcoming");
    expect(html(<EventDetails event={event({ status: "past" })} />)).toContain("Completed");
  });

  it("shows a single date for a one-day event", () => {
    expect(html(<EventDetails event={event()} />)).toContain("28 September 2026");
  });
});

describe("index pieces", () => {
  it("says so, and offers updates, when nothing is upcoming", () => {
    const out = html(<EventsEmpty />);
    expect(out).toContain("No sessions scheduled right now");
    expect(out).toContain('href="/subscribe"');
  });

  it("links an upcoming card and a past row through the route map", () => {
    expect(html(<ul><UpcomingCard event={event()} /></ul>)).toContain('href="/events/e1"');
    expect(html(<ul><PastRow event={event({ status: "past" })} /></ul>)).toContain('href="/events/e1"');
  });

  it("lists the other published events, never the current one", () => {
    const out = html(
      <OtherEvents
        currentSlug="self"
        events={[event({ slug: "self", title: "SelfT" }), event({ slug: "o", title: "OtherT" }), event({ slug: "d", title: "DraftT", _status: "draft" })]}
      />,
    );
    expect(out).toContain("OtherT");
    expect(out).not.toContain("SelfT");
    expect(out).not.toContain("DraftT");
  });
});
