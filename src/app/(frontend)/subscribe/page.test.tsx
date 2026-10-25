import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import SubscribePage from "./page";

vi.mock("@/lib/content", () => ({
  getContactDetails: async () => ({
    emails: [{ label: "Sales and general inquiries", value: "sales@example.com" }],
    response: "Within one business day",
  }),
  getPostCategories: async () => [{ key: "a", label: "Insights" }],
  getForm: async (key: never) => (await import("@/lib/forms/testing")).formDoc(key),
}));

describe("the subscribe page", () => {
  it("renders the live subscribe form, with its checkbox groups, and no shell wording", async () => {
    const out = renderToStaticMarkup(await SubscribePage());
    expect(out).toContain('action="/forms/subscribe"');
    expect(out).toContain("Topics of interest");
    expect(out).toContain("What to send");
    expect(out).toContain(">Subscribe</button>");
    expect(out).not.toContain("Form shown for layout review");
    expect(out).not.toContain("not accepting submissions");
    expect(out).not.toContain("not yet accepting");
    expect(out).not.toMatch(/\sdisabled=/);
  });
});
