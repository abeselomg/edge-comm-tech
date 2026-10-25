import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import InternshipsPage from "./page";

const mocks = vi.hoisted(() => ({ getForm: vi.fn() }));

vi.mock("@/lib/content", () => ({
  getCareersContent: async () => ({
    internship: {
      title: "Graduate Technology Internship",
      intro: "An intro.",
      type: "Internship",
      location: "Addis Ababa",
      schedule: { status: "pending", pendingLabel: "To be confirmed" },
      caveat: "Applying does not guarantee a placement.",
      tracks: [{ title: "Network Engineer", body: "b" }, { title: "System Engineer", body: "b" }],
      structure: [],
      eligibility: [],
      selection: [],
      documents: [{ item: "Curriculum vitae" }],
    },
  }),
  getContactDetails: async () => ({ emails: [{ label: "Careers", value: "hr@example.com" }] }),
  getForm: mocks.getForm,
}));

describe("the internship application", () => {
  it("renders the live form with a CV upload, and nothing of the old shell", async () => {
    const { formDoc } = await import("@/lib/forms/testing");
    mocks.getForm.mockReset().mockImplementation(async (key: never) => formDoc(key));
    const out = renderToStaticMarkup(await InternshipsPage());
    expect(mocks.getForm).toHaveBeenCalledWith("internship-application");
    expect(out).toContain('action="/forms/internship-application"');
    expect(out).toMatch(/<input[^>]*name="cv"[^>]*>/);
    expect(out).toContain('accept=".pdf,.docx"');
    expect(out).toContain(">Submit application</button>");
    expect(out).not.toContain("not accepting submissions");
    expect(out).not.toContain("not yet accepting");
    expect(out).not.toMatch(/\sdisabled=/);
  });

  it("keeps the caveat, unchanged, before the form", async () => {
    const { formDoc } = await import("@/lib/forms/testing");
    mocks.getForm.mockReset().mockImplementation(async (key: never) => formDoc(key));
    const out = renderToStaticMarkup(await InternshipsPage());
    const caveat = out.indexOf("Applying does not guarantee a placement.");
    expect(out).toContain("Please read before applying");
    expect(caveat).toBeGreaterThan(-1);
    expect(out.indexOf("<form")).toBeGreaterThan(caveat);
    expect(out.indexOf("Please read before applying")).toBeLessThan(out.indexOf("<form"));
  });
});
