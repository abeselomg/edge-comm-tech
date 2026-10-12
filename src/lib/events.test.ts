import { describe, expect, it } from "vitest";
import { eventStatus } from "./events";

const at = (iso: string) => new Date(`${iso}T09:00:00Z`);

describe("eventStatus", () => {
  it("is upcoming before a single-day event", () => {
    expect(eventStatus({ startsOn: "2026-10-23" }, at("2026-10-09"))).toBe("upcoming");
  });

  it("is upcoming on the day of a single-day event", () => {
    expect(eventStatus({ startsOn: "2026-10-23" }, at("2026-10-23"))).toBe("upcoming");
  });

  it("is past the day after a single-day event", () => {
    expect(eventStatus({ startsOn: "2026-09-28" }, at("2026-09-29"))).toBe("past");
  });

  it("is upcoming midway through a multi-day event", () => {
    // GITEX: 7-11 December. On the 8th it is running, not over.
    const gitex = { startsOn: "2026-12-07", endsOn: "2026-12-11" };
    expect(eventStatus(gitex, at("2026-12-08"))).toBe("upcoming");
  });

  it("is upcoming on the final day of a multi-day event", () => {
    expect(eventStatus({ startsOn: "2026-12-07", endsOn: "2026-12-11" }, at("2026-12-11"))).toBe(
      "upcoming",
    );
  });

  it("is past the day after a multi-day event ends", () => {
    expect(eventStatus({ startsOn: "2026-12-07", endsOn: "2026-12-11" }, at("2026-12-12"))).toBe(
      "past",
    );
  });

  it("falls back to the start date when there is no end date", () => {
    expect(eventStatus({ startsOn: "2026-09-28", endsOn: null }, at("2026-09-29"))).toBe("past");
  });

  it("ignores time of day, comparing whole dates only", () => {
    const lateInTheDay = new Date("2026-10-23T23:59:00Z");
    expect(eventStatus({ startsOn: "2026-10-23" }, lateInTheDay)).toBe("upcoming");
  });

  it("accepts a full timestamp as the stored date", () => {
    expect(eventStatus({ startsOn: "2026-12-07T00:00:00.000Z", endsOn: "2026-12-11T00:00:00.000Z" }, at("2026-12-09"))).toBe(
      "upcoming",
    );
  });

  it("treats a missing date as upcoming, so a data error stays visible", () => {
    expect(eventStatus({}, at("2026-10-09"))).toBe("upcoming");
    expect(eventStatus({ startsOn: null }, at("2026-10-09"))).toBe("upcoming");
  });

  it("treats an unparseable date as upcoming rather than hiding the event", () => {
    expect(eventStatus({ startsOn: "not a date" }, at("2026-10-09"))).toBe("upcoming");
  });

  describe("boundaries", () => {
    const gitex = { startsOn: "2026-12-07", endsOn: "2026-12-11" };

    it("is upcoming on exactly the start day of a range", () => {
      expect(eventStatus(gitex, at("2026-12-07"))).toBe("upcoming");
    });

    it("is upcoming the day before a range starts", () => {
      expect(eventStatus(gitex, at("2026-12-06"))).toBe("upcoming");
    });

    it("treats an end equal to the start as a single day", () => {
      const oneDay = { startsOn: "2026-10-23", endsOn: "2026-10-23" };
      expect(eventStatus(oneDay, at("2026-10-23"))).toBe("upcoming");
      expect(eventStatus(oneDay, at("2026-10-24"))).toBe("past");
    });

    it("lets the later date win when the end is typed before the start", () => {
      const typo = { startsOn: "2026-12-11", endsOn: "2026-12-07" };
      expect(eventStatus(typo, at("2026-12-09"))).toBe("upcoming");
      expect(eventStatus(typo, at("2026-12-12"))).toBe("past");
    });

    it("falls back to a valid start when the end is unparseable", () => {
      const bad = { startsOn: "2026-09-28", endsOn: "garbage" };
      expect(eventStatus(bad, at("2026-09-29"))).toBe("past");
    });

    it("flips at midnight UTC after the last day, not before", () => {
      expect(eventStatus(gitex, new Date("2026-12-11T23:59:59.999Z"))).toBe("upcoming");
      expect(eventStatus(gitex, new Date("2026-12-12T00:00:00.000Z"))).toBe("past");
    });

    it("reads a stored noon-UTC timestamp as that calendar day", () => {
      const stored = { startsOn: "2026-12-07T12:00:00.000Z", endsOn: "2026-12-11T12:00:00.000Z" };
      expect(eventStatus(stored, new Date("2026-12-11T20:00:00Z"))).toBe("upcoming");
      expect(eventStatus(stored, new Date("2026-12-12T01:00:00Z"))).toBe("past");
    });

    it("defaults now to the current time", () => {
      expect(eventStatus({ startsOn: "2000-01-01" })).toBe("past");
      expect(eventStatus({ startsOn: "2999-01-01" })).toBe("upcoming");
    });
  });
});
