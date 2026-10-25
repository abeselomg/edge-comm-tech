import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EventPage from "./page";

const mocks = vi.hoisted(() => ({
  event: {} as Record<string, unknown>,
  getForm: vi.fn(),
}));

vi.mock("@/lib/content", () => ({
  getEvent: async () => mocks.event,
  getEvents: async () => [],
  getContactDetails: async () => ({ emails: [{ label: "Sales and general inquiries", value: "sales@example.com" }] }),
  getForm: mocks.getForm,
}));

const event = (over: Record<string, unknown>) => ({
  _status: "published",
  slug: "agentic-ai",
  title: "Agentic AI webinar",
  category: "Webinar",
  format: "Online",
  venue: "Microsoft Teams",
  headline: "Agentic AI in practice",
  intro: "An intro.",
  audience: "University leaders",
  displayDate: "28 September 2026",
  startsOn: "2026-09-28",
  program: [],
  action: "Register now",
  pendingNote: null,
  ...over,
});

const render = async () =>
  renderToStaticMarkup(await EventPage({ params: Promise.resolve({ slug: "agentic-ai" }) }));

describe("the event page", () => {
  beforeEach(async () => {
    const { formDoc } = await import("@/lib/forms/testing");
    mocks.getForm.mockReset().mockImplementation(async (key: never) => formDoc(key));
  });

  it("an upcoming event renders the registration form with its slug in a hidden event field", async () => {
    mocks.event = event({ status: "upcoming" });
    const out = await render();
    expect(out).toContain('action="/forms/event-registration"');
    expect(out).toMatch(/<input[^>]*name="event"[^>]*value="agentic-ai"|<input[^>]*value="agentic-ai"[^>]*name="event"/);
    expect(out).not.toContain("Form shown for layout review");
    expect(out).not.toContain("not accepting submissions");
    expect(mocks.getForm).toHaveBeenCalledWith("event-registration");
  });

  it("a past event renders no form, keeps the closed state, and never reads the form", async () => {
    mocks.event = event({ status: "past" });
    const out = await render();
    expect(out).not.toContain("<form");
    expect(out).not.toContain("/forms/");
    expect(out).toContain("This event has already run");
    expect(mocks.getForm).not.toHaveBeenCalled();
  });
});
