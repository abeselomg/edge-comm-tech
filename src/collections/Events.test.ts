import { describe, expect, it } from "vitest";
import { Events } from "./Events";

const field = (name: string) =>
  Events.fields.find((f) => "name" in f && f.name === name) as {
    validate?: (v: unknown, o: unknown) => unknown;
  };

describe("Events collection", () => {
  it("stores no status field", () => {
    expect(Events.fields.some((f) => "name" in f && f.name === "status")).toBe(false);
  });

  it("rejects an end before the start", () => {
    const validate = field("endsOn").validate!;
    const siblingData = { startsOn: "2026-12-11T12:00:00.000Z" };
    expect(validate("2026-12-07T12:00:00.000Z", { siblingData })).toMatch(/cannot be before/);
  });

  it("accepts an end on or after the start, or no end", () => {
    const validate = field("endsOn").validate!;
    const siblingData = { startsOn: "2026-12-07T12:00:00.000Z" };
    expect(validate("2026-12-07T12:00:00.000Z", { siblingData })).toBe(true);
    expect(validate("2026-12-11T12:00:00.000Z", { siblingData })).toBe(true);
    expect(validate(null, { siblingData })).toBe(true);
  });
});
