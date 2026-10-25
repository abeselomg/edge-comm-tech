import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import EAcademyPage from "./page";

vi.mock("@/lib/content", () => ({
  getCareersContent: async () => ({ academyAudiences: [], academyLevels: [], academyDelivery: [], courseSections: [] }),
  getAcademyTracks: async () => [],
  getContactDetails: async () => ({
    emails: [{ label: "Sales and general inquiries", value: "sales@example.com" }],
    response: "Within one business day",
  }),
  getForm: async (key: never) => (await import("@/lib/forms/testing")).formDoc(key),
}));

describe("the E-Academy enquiry", () => {
  it("renders the live enquiry form, with no shell wording and nothing disabled", async () => {
    const out = renderToStaticMarkup(await EAcademyPage());
    expect(out).toContain('action="/forms/academy-enquiry"');
    expect(out).toContain(">Send enquiry</button>");
    expect(out).toContain("AI, Software and Digital Skills");
    expect(out).not.toContain("Form shown for layout review");
    expect(out).not.toContain("not accepting submissions");
    expect(out).not.toContain("not yet accepting");
    expect(out).not.toMatch(/\sdisabled=/);
  });
});
