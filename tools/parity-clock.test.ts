import { describe, expect, it } from "vitest";
import {
  checkMovedEvent,
  checkMovedIndex,
  checkMovedResources,
  stripComingUp,
  eventMoved,
  upcomingCount,
} from "./parity-clock.mjs";

/*
 * Highland is a static build: its event pages record the status the events had
 * the day it was built. The CMS derives status from the dates, so once an event
 * has run, the port is right and Highland is stale. The checker has to tell
 * "the clock moved" from "the port is wrong" and still hold the port to account.
 */
const upcoming = "<h2>What registrants should expect</h2><form></form>";
const closed =
  "<p>This session has taken place — registration is closed</p><h2>This event has already run</h2><a href=\"/subscribe\">Get event updates</a>";

describe("eventMoved", () => {
  it("is true only when Highland shows the event upcoming and the site shows it closed", () => {
    expect(eventMoved(upcoming, closed)).toBe(true);
    expect(eventMoved(upcoming, upcoming)).toBe(false);
    expect(eventMoved(closed, closed)).toBe(false);
  });

  // The reverse is a real defect: a closed page where Highland has it open.
  it("is false when the site shows it upcoming and Highland closed", () => {
    expect(eventMoved(closed, upcoming)).toBe(false);
  });
});

describe("checkMovedEvent", () => {
  it("accepts a properly closed page", () => {
    expect(checkMovedEvent("p", closed)).toEqual([]);
  });
  it("rejects a page that claims closure but keeps a registration form", () => {
    expect(checkMovedEvent("p", closed + "<form></form>").join()).toMatch(/form/);
  });
  it("rejects a page with no way forward for the reader", () => {
    expect(checkMovedEvent("p", closed.replace("/subscribe", "/x")).join()).toMatch(/subscribe/);
  });
});

describe("upcomingCount and checkMovedIndex", () => {
  const index = (n: number, held = true) =>
    `<h2>Upcoming</h2><p>${n} session${n > 1 ? "s" : ""}</p>${held ? "<h2>Already held</h2>" : ""}`;

  it("reads the count from the Upcoming band", () => {
    expect(upcomingCount(index(2))).toBe(2);
    expect(upcomingCount(index(1))).toBe(1);
    expect(upcomingCount("<h2>No sessions scheduled right now</h2>")).toBe(0);
  });

  it("expects exactly the moved events to have left the Upcoming band", () => {
    expect(checkMovedIndex(index(2), index(1), 1)).toEqual([]);
    expect(checkMovedIndex(index(2), index(2), 1).join()).toMatch(/upcoming/i);
    expect(checkMovedIndex(index(2), index(0, true), 1).join()).toMatch(/upcoming/i);
  });

  it("requires the Already held band to exist once something has moved", () => {
    expect(checkMovedIndex(index(2), index(1, false), 1).join()).toMatch(/already held/i);
  });
});

describe("checkMovedResources", () => {
  const coming = (links: string[]) =>
    `<section><p>Coming up</p><ul>${links.map((l) => `<li><a href="${l}">x</a></li>`).join("")}</ul></section><section><h2>Sections</h2><a href="/events/ran">elsewhere</a></section>`;

  it("accepts a Coming up band that no longer lists an event that has run", () => {
    expect(checkMovedResources(coming(["/events/next"]), ["/events/ran"])).toEqual([]);
  });

  it("rejects one that still invites a visitor to an event that has run", () => {
    expect(checkMovedResources(coming(["/events/ran", "/events/next"]), ["/events/ran"]).join()).toMatch(/Coming up/);
  });

  it("looks only inside the Coming up band, not at links elsewhere on the page", () => {
    expect(checkMovedResources(coming([]), ["/events/ran"])).toEqual([]);
  });

  it("passes a page with no Coming up band at all", () => {
    expect(checkMovedResources("<main><h2>Sections</h2></main>", ["/events/ran"])).toEqual([]);
  });
});

describe("stripComingUp", () => {
  it("removes only the section holding the Coming up band", () => {
    const html = "<main><section><p>Intro</p></section><section><p>Coming up</p><a href=\"/events/x\">x</a></section><section><h2>Sections</h2></section></main>";
    const out = stripComingUp(html);
    expect(out).not.toContain("Coming up");
    expect(out).not.toContain("/events/x");
    expect(out).toContain("Intro");
    expect(out).toContain("Sections");
  });
  it("leaves a page without the band untouched", () => {
    const html = "<main><section>Hello</section></main>";
    expect(stripComingUp(html)).toBe(html);
  });
});
