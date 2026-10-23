import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { deadlineText, hrEmail, internshipPills, intakeNote, jobRow, PositionsList } from "../careers-parts";

const job = (over: Record<string, unknown> = {}) =>
  ({
    slug: "hr-manager",
    title: "HR Manager",
    level: "Manager",
    department: "People",
    purpose: "Lead the people function.",
    type: "Full-time",
    location: "Addis Ababa",
    reports: "Chief Executive Officer",
    status: "Open",
    deadline: { value: null, status: "pending", pendingLabel: "Deadline to be confirmed" },
    ...over,
  }) as never;

const html = (el: React.ReactElement) => renderToStaticMarkup(el);

describe("jobRow", () => {
  it("prints the level exactly as stored, including Manager", () => {
    // The seed once rejected "Manager" because the select did not carry it.
    expect(html(jobRow(job()))).toContain("People · Manager");
  });

  it("links through the route map, not a hand-built path", () => {
    expect(html(jobRow(job()))).toContain('href="/careers/open-positions/hr-manager"');
  });

  it("shows the unconfirmed deadline as a marker rather than inventing a date", () => {
    const out = html(jobRow(job()));
    expect(out).toContain("Deadline to be confirmed");
    expect(out).not.toContain("undefined");
    expect(out).not.toContain("null");
  });

  /*
   * The content master approves no salary, benefit or employment condition for
   * publication, and no field holds one. A row for a role must not be able to
   * mention one either; this pins the markup, not the data.
   */
  it("carries only what the master approves for a listing", () => {
    const out = html(jobRow(job())).toLowerCase();
    for (const forbidden of ["salary", "benefit", "compensation", "per month", "etb"]) {
      expect(out).not.toContain(forbidden);
    }
    for (const approved of ["full-time", "addis ababa", "reports to chief executive officer"]) {
      expect(out).toContain(approved);
    }
  });
});

describe("deadlineText", () => {
  it("uses the pending label while no date is confirmed", () => {
    expect(deadlineText({ status: "pending", pendingLabel: "Deadline to be confirmed" })).toBe(
      "Deadline to be confirmed",
    );
  });
  it("reads the master's bare 'To be confirmed' as a deadline, as the seed stores it", () => {
    expect(deadlineText({ status: "pending", pendingLabel: "To be confirmed" })).toBe(
      "Deadline to be confirmed",
    );
  });
  it("reads the date once one is confirmed", () => {
    expect(deadlineText({ status: "confirmed", value: "30 November 2026" })).toBe(
      "Deadline 30 November 2026",
    );
  });
  it("never invents a deadline for a record with none", () => {
    expect(deadlineText(undefined)).toBe("Deadline to be confirmed");
    expect(deadlineText({ status: "confirmed", value: "" })).toBe("Deadline to be confirmed");
  });
});

describe("PositionsList", () => {
  // Review Focus #3: an editor can unpublish both roles.
  it("says there are no open positions rather than rendering a blank list", () => {
    const out = html(<PositionsList jobs={[]} />);
    expect(out).toMatch(/no open (positions|roles)/i);
    expect(out).not.toContain("<li");
  });

  it("lists every role it is given", () => {
    const out = html(
      <PositionsList jobs={[job(), job({ slug: "cto", title: "Chief Technology Officer" })]} />,
    );
    expect(out).toContain("HR Manager");
    expect(out).toContain("Chief Technology Officer");
  });
});

describe("hrEmail", () => {
  const contact = (emails: { label: string; value: string }[]) => ({ emails }) as never;

  it("finds the careers address by its label, not by its position in the list", () => {
    const reordered = contact([
      { label: "Careers", value: "hr@example.com" },
      { label: "Sales and general inquiries", value: "sales@example.com" },
    ]);
    expect(hrEmail(reordered)).toBe("hr@example.com");
  });

  it("is undefined when no careers address exists, so a page can omit the line", () => {
    expect(hrEmail(contact([{ label: "Technical support", value: "s@example.com" }]))).toBeUndefined();
  });
});

describe("internshipPills — a confirmed fact must not stay a pending marker", () => {
  const pending = { status: "pending", value: null, pendingLabel: "Dates and working schedule to be confirmed" };
  const pendingDeadline = { status: "pending", value: null, pendingLabel: "To be confirmed" };
  const confirmedDeadline = { status: "confirmed", value: "30 June 2026" };
  const confirmedSchedule = { status: "confirmed", value: "Mondays and Wednesdays" };
  const pills = (schedule: unknown, deadline: unknown) =>
    html(<p>{internshipPills({ schedule, deadline } as never)}</p>);

  it("shows both markers while both are unconfirmed", () => {
    const out = pills(pending, pendingDeadline);
    expect(out).toContain("Intake dates to be confirmed");
    expect(out).toContain("Application deadline to be confirmed");
  });

  it("states a confirmed deadline as a date, not as a marker, with its case intact", () => {
    const out = pills(pending, confirmedDeadline);
    expect(out).toContain("Application deadline 30 June 2026");
    expect(out).not.toContain("30 june");
    expect(out).not.toContain("Application deadline to be confirmed");
  });

  it("drops the intake-dates marker once the schedule is confirmed", () => {
    const out = pills(confirmedSchedule, pendingDeadline);
    expect(out).not.toContain("Intake dates");
    expect(out).not.toContain("Mondays and Wednesdays");
  });
});

describe("intakeNote", () => {
  it("is a marker while the schedule is pending and nothing once it is confirmed", () => {
    expect(html(<div>{intakeNote({ status: "pending", pendingLabel: "x" })}</div>)).toContain("Internship intake dates to be confirmed");
    expect(html(<div>{intakeNote({ status: "confirmed", value: "Mondays" })}</div>)).not.toContain("to be confirmed");
  });
});
