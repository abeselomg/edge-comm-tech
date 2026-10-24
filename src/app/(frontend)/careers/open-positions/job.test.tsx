import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ApplyPanel, JobAside, JobHeader, JobSections } from "./job-parts";

const html = (el: React.ReactElement | null) => renderToStaticMarkup(<div>{el}</div>);
const job = (over: Record<string, unknown> = {}) =>
  ({
    _status: "published",
    slug: "hr-manager",
    title: "HR Manager",
    department: "People",
    level: "Manager",
    reports: "Chief Executive Officer",
    type: "Full-time",
    status: "Open",
    location: "Addis Ababa",
    deadline: { status: "pending", value: null, pendingLabel: "To be confirmed" },
    purposeTitle: "Lead the people function",
    purpose: "The role purpose.",
    scope: "The scope.",
    responsibilities: [{ item: "Own recruitment" }],
    required: [{ item: "Degree in HR" }],
    preferred: [{ item: "MBA" }],
    success: "Success looks like retention.",
    ...over,
  }) as never;

describe("JobHeader", () => {
  it("shows the facts approved for a listing, with the level exactly as stored", () => {
    const out = html(<JobHeader job={job()} />);
    for (const t of ["People", "Manager", "Chief Executive Officer", "Full-time", "Open", "Addis Ababa"]) {
      expect(out, t).toContain(t);
    }
  });

  it("shows an unconfirmed deadline as a marker, and a confirmed one as a date", () => {
    expect(html(<JobHeader job={job()} />)).toContain("To be confirmed");
    const confirmed = html(<JobHeader job={job({ deadline: { status: "confirmed", value: "30 November 2026" } })} />);
    expect(confirmed).toContain("30 November 2026");
    expect(confirmed).not.toContain("To be confirmed");
  });

  it("carries no salary, benefit or employment condition", () => {
    const out = html(<JobHeader job={job()} />).toLowerCase();
    for (const w of ["salary", "benefit", "compensation", "per month", "etb"]) expect(out).not.toContain(w);
  });
});

describe("JobSections", () => {
  it("keeps required and preferred qualifications apart, as the master requires", () => {
    const out = html(<JobSections job={job()} accent="#0888c5" />);
    expect(out.indexOf("Qualifications and experience")).toBeGreaterThan(-1);
    expect(out.indexOf("What strengthens an application")).toBeGreaterThan(out.indexOf("Qualifications and experience"));
    expect(out.indexOf("Degree in HR")).toBeLessThan(out.indexOf("What strengthens an application"));
    expect(out.indexOf("MBA")).toBeGreaterThan(out.indexOf("What strengthens an application"));
  });

  it("omits a section whose list is empty rather than printing a bare heading", () => {
    const out = html(<JobSections job={job({ preferred: [], scope: null })} accent="#0888c5" />);
    expect(out).not.toContain("What strengthens an application");
    expect(out).not.toContain("The scope.");
    expect(out).toContain("Own recruitment");
  });

  it("states how performance will be judged", () => {
    expect(html(<JobSections job={job()} accent="#0888c5" />)).toContain("Success looks like retention.");
  });
});

describe("ApplyPanel", () => {
  const out = html(<ApplyPanel job={job()} accent="#0888c5" email="hr@example.com" />);
  it("is an inert application form for this role", () => {
    expect(out).toContain("Apply for HR Manager");
    expect(out).toContain("disabled");
    expect(out).not.toMatch(/<input(?![^>]*disabled)/);
    expect(out).not.toMatch(/<button(?![^>]*disabled)/);
  });
  it("says where applications go", () => {
    expect(out).toContain('href="mailto:hr@example.com"');
  });
});

describe("JobAside", () => {
  const docs = [{ item: "Curriculum vitae" }];
  it("lists the documents required and links to the application", () => {
    const out = html(<JobAside job={job()} others={[]} docs={docs} accent="#0888c5" />);
    expect(out).toContain("Curriculum vitae");
    expect(out).toContain('href="#apply"');
  });

  it("offers the other vacancy only when another is published (Review Focus #1)", () => {
    const other = job({ slug: "cto", title: "Chief Technology Officer" });
    expect(html(<JobAside job={job()} others={[other]} docs={docs} accent="#0888c5" />)).toContain('href="/careers/open-positions/cto"');
    const out = html(<JobAside job={job()} others={[job({ slug: "cto", title: "Chief Technology Officer", _status: "draft" })]} docs={docs} accent="#0888c5" />);
    expect(out).not.toContain("Also open");
    expect(out).not.toContain("/cto");
    expect(html(<JobAside job={job()} others={[job()]} docs={docs} accent="#0888c5" />)).not.toContain("Also open");
  });
});
