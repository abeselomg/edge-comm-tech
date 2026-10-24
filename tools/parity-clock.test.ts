import { describe, expect, it } from "vitest";
import {
  alignMovedEvent,
  checkMovedEvent,
  checkMovedIndex,
  checkMovedResources,
  eventMoved,
  stripComingUp,
  upcomingCount,
} from "./parity-clock.mjs";
import { highlandEvent } from "./parity-events.mjs";

/*
 * Highland is a static build: its event pages record the status the events had
 * the day it was built. The CMS derives status from the dates, so once an event
 * has run the port is right and Highland is stale. The checker has to tell "the
 * clock moved" from "the port is wrong" -- and it must take the clock's word from
 * the event's own dates, never from the page under test, or a regression that
 * wrongly closes an upcoming event would be filed as drift.
 */
const upcoming = (extra = "") =>
  `<main><dl><div><dt>Status</dt><dd>Upcoming</dd></div></dl><section class="mt-16 rounded-3xl p-8"><h2>What registrants should expect</h2><form></form></section>${extra}</main>`;
const closed = (extra = "") =>
  `<main><p class="eg-rise mt-6"><span>This session has taken place — registration is closed</span></p><dl><div><dt>Status</dt><dd>Completed</dd></div></dl><section class="mt-16 rounded-3xl p-8"><h2>This event has already run</h2><a href="/subscribe">Get event updates</a></section>${extra}</main>`;

describe("highlandEvent", () => {
  it("knows an event has run only once its last day has passed", () => {
    const gitex = highlandEvent("gitex-global-2026");
    expect(gitex.hasRun(new Date("2026-12-09T10:00:00Z"))).toBe(false); // mid-event
    expect(gitex.hasRun(new Date("2026-12-11T23:30:00Z"))).toBe(false); // its last day
    expect(gitex.hasRun(new Date("2026-12-12T00:30:00Z"))).toBe(true);
  });
  it("exposes the title the index prints", () => {
    expect(highlandEvent("gitex-global-2026").title).toMatch(/GITEX/i);
  });
  it("throws for a slug Highland does not have", () => {
    expect(() => highlandEvent("nope")).toThrow(/nope/);
  });
});

describe("eventMoved", () => {
  it("needs all three: the dates say it has run, Highland shows it open, the site shows it closed", () => {
    expect(eventMoved(upcoming(), closed(), true)).toBe(true);
    expect(eventMoved(upcoming(), closed(), false)).toBe(false);
    expect(eventMoved(upcoming(), upcoming(), true)).toBe(false);
    expect(eventMoved(closed(), closed(), true)).toBe(false);
  });

  // A page closed before its event has ended is a defect, not drift.
  it("never excuses a closed page for an event that has not run", () => {
    expect(eventMoved(upcoming(), closed(), false)).toBe(false);
  });
});

describe("checkMovedEvent", () => {
  it("accepts a properly closed page", () => {
    expect(checkMovedEvent("p", closed())).toEqual([]);
  });
  it("rejects a page that claims closure but keeps a registration form", () => {
    expect(checkMovedEvent("p", closed().replace("</section>", "<form></form></section>")).join()).toMatch(/form/);
  });
  // The header links /subscribe on every page, so the link must be in the panel.
  it("requires the subscribe link inside the closed registration panel, not just anywhere", () => {
    const headerOnly = `<header><a href="/subscribe">Subscribe</a></header>` + closed().replace('<a href="/subscribe">Get event updates</a>', "");
    expect(checkMovedEvent("p", headerOnly).join()).toMatch(/subscribe/);
  });
});

describe("alignMovedEvent", () => {
  it("removes the parts that legitimately differ and leaves the rest to be compared", () => {
    const [e, a] = alignMovedEvent(upcoming("<p>Shared copy.</p>"), closed("<p>Shared copy.</p>"));
    expect(e).toContain("Shared copy.");
    expect(a).toContain("Shared copy.");
    for (const html of [e, a]) {
      expect(html).not.toContain("registration is closed");
      expect(html).not.toContain("What registrants should expect");
      expect(html).not.toContain("This event has already run");
      expect(html).not.toContain("<form");
    }
  });
  it("treats Highland's Upcoming status as the Completed it has become", () => {
    const [e] = alignMovedEvent(upcoming(), closed());
    expect(e).toContain("Completed");
    expect(e).not.toContain("Upcoming");
  });
  it("still lets a real difference through", () => {
    const [e, a] = alignMovedEvent(upcoming("<p>Program one.</p>"), closed("<p>Program two.</p>"));
    expect(e).toContain("Program one.");
    expect(a).toContain("Program two.");
  });
});

describe("upcomingCount and checkMovedIndex", () => {
  const index = (n: number, held = "<h2>Already held</h2><li>Ran Event</li>", up = "") =>
    `<h2>Upcoming</h2><p class="x">${n} session${n > 1 ? "s" : ""}</p>${up}${held}`;

  it("reads the count from the Upcoming band only", () => {
    expect(upcomingCount(index(2))).toBe(2);
    expect(upcomingCount("<h2>No sessions scheduled right now</h2><p>9 sessions elsewhere</p>")).toBe(0);
    expect(upcomingCount("<h2>Upcoming</h2><div>text</div><p>5 sessions in prose</p>")).toBe(0);
  });

  it("expects exactly the moved events out of Upcoming and into Already held, by name", () => {
    expect(checkMovedIndex(index(2), index(1), ["Ran Event"])).toEqual([]);
  });
  it("fails if the count is wrong", () => {
    expect(checkMovedIndex(index(2), index(2), ["Ran Event"]).join()).toMatch(/upcoming/i);
  });
  it("fails if the moved event is not the one in Already held", () => {
    expect(checkMovedIndex(index(2), index(1, "<h2>Already held</h2><li>Other Event</li>"), ["Ran Event"]).join()).toMatch(/Ran Event/);
  });
  it("fails if the moved event is still listed under Upcoming", () => {
    expect(checkMovedIndex(index(2), index(1, "<h2>Already held</h2><li>Ran Event</li>", "<li>Ran Event</li>"), ["Ran Event"]).join()).toMatch(/Ran Event/);
  });
  it("fails without an Already held band", () => {
    expect(checkMovedIndex(index(2), index(1, ""), ["Ran Event"]).join()).toMatch(/already held/i);
  });
});

describe("checkMovedResources and stripComingUp", () => {
  const coming = (links: string[]) =>
    `<section><p>Coming up</p><ul>${links.map((l) => `<li><a href="${l}">x</a></li>`).join("")}</ul></section><section><h2>Sections</h2><a href="/events/ran">elsewhere</a></section>`;
  it("rejects a Coming up band that still lists an event that has run", () => {
    expect(checkMovedResources(coming(["/events/ran", "/events/next"]), ["/events/ran"]).join()).toMatch(/Coming up/);
    expect(checkMovedResources(coming(["/events/next"]), ["/events/ran"])).toEqual([]);
  });
  it("removes only the section holding the band", () => {
    const out = stripComingUp(`<main><section>Intro</section>${coming(["/events/x"])}</main>`);
    expect(out).toContain("Intro");
    expect(out).toContain("Sections");
    expect(out).not.toContain("Coming up");
  });
});
