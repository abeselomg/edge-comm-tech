import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ContactPage from "./page";
import { ContactChannels, ContactFacts, InquiryCard, supportEmail } from "./contact-parts";

vi.mock("@/lib/content", () => ({
  getContactDetails: async () => CONTACT,
  getSolutions: async () => [],
  getForm: async (key: never) => (await import("@/lib/forms/testing")).formDoc(key),
}));

const CONTACT = {
  office: [
    { line: "Edge Communication Technologies PLC" },
    { line: "BMA Plaza, 9th Floor" },
    { line: "Gerji Imperial, Bole Sub-City" },
    { line: "Addis Ababa, Ethiopia" },
  ],
  mapUrl: "https://www.google.com/maps/search/?api=1&query=BMA+Plaza+Gerji+Addis+Ababa",
  phones: [
    { label: "Main telephone and WhatsApp", value: "+251 95 569 5565", tel: "+251955695565" },
    { label: "Additional telephone", value: "+251 911 538 809", tel: "+251911538809" },
  ],
  whatsapp: "https://wa.me/251955695565",
  emails: [
    { label: "Sales and general inquiries", value: "sales@edgecomm-tech.com" },
    { label: "Technical support", value: "support@edgecomm-tech.com" },
    { label: "Careers", value: "hr@edgecomm-tech.com" },
  ],
  emergency: "+251 95 569 5565",
  response: "Within one business day",
  hours: [
    { days: "Monday to Friday", hours: "8:00 AM to 5:30 PM" },
    { days: "Sunday", hours: "Closed" },
  ],
} as never;

const html = (el: React.ReactElement) => renderToStaticMarkup(el);

/*
 * contact-details is admin-only because the inherited page carried the wrong
 * office address and the wrong telephone number on every page. Every fact on
 * this page has to come from the record it is handed.
 */
describe("the contact facts", () => {
  const page = html(
    <>
      <ContactChannels contact={CONTACT} />
      <ContactFacts contact={CONTACT} />
    </>,
  );

  it("prints the real office, telephone and mailboxes from the CMS record", () => {
    expect(page).toContain("BMA Plaza, 9th Floor");
    expect(page).toContain("+251 95 569 5565");
    expect(page).toContain("sales@edgecomm-tech.com");
    expect(page).toContain('href="tel:+251955695565"');
  });

  it("carries nothing from the inherited page", () => {
    expect(page).not.toMatch(/lubaba/i);
    expect(page).not.toContain("info@edgecomm");
  });

  it("uses the map link it was given", () => {
    expect(page).toContain("query=BMA+Plaza+Gerji+Addis+Ababa");
  });

  it("shows hours, with Closed in the quieter style", () => {
    expect(page).toContain("8:00 AM to 5:30 PM");
    expect(page).toContain("Closed");
  });

  it("omits what the record does not have rather than printing undefined", () => {
    const bare = html(<ContactChannels contact={{ office: [], phones: [], emails: [] } as never} />);
    expect(bare).not.toContain("undefined");
    expect(bare).not.toContain("null");
  });
});

describe("supportEmail", () => {
  it("finds technical support by its label, not by position", () => {
    const swapped = {
      emails: [
        { label: "Technical support", value: "s@example.com" },
        { label: "Careers", value: "h@example.com" },
      ],
    } as never;
    expect(supportEmail(swapped)).toBe("s@example.com");
  });
});

describe("InquiryCard", () => {
  const cat = (key: string) => ({ key, title: "T", prompt: "P", route: "r@example.com" }) as never;

  it("routes a category to its mailbox", () => {
    expect(html(<InquiryCard c={cat("quotation")} />)).toContain('href="mailto:r@example.com"');
  });

  // The master requires applications to go through the official flow.
  it("sends the careers category to the careers process, not a mailbox", () => {
    const out = html(<InquiryCard c={cat("careers")} />);
    expect(out).toContain('href="/careers/open-positions"');
    expect(out).not.toContain("mailto:");
  });
});

describe("the contact form", () => {
  it("is a live form posting to /forms/contact, with no shell wording and nothing disabled", async () => {
    const out = html(await ContactPage());
    expect(out).toContain('action="/forms/contact"');
    expect(out).toContain("Send message");
    expect(out).toContain("Request a Quotation");
    expect(out).toContain("Cybersecurity");
    expect(out).not.toContain("Form shown for layout review");
    expect(out).not.toContain("not accepting submissions");
    expect(out).not.toContain("not yet accepting");
    expect(out).not.toMatch(/\sdisabled=/);
  });

  it("offers the sales mailbox from the contact-details record, not from code", async () => {
    const out = html(await ContactPage());
    expect(out).toContain("sales@edgecomm-tech.com");
  });
});
