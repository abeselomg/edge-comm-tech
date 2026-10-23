import { CtaRow, PageHead, SectionHead } from "@/components/ui";
import { getContactDetails, getSolutions } from "@/lib/content";
import { ContactChannels, ContactFacts, FormShell, InquiryCard } from "./contact-parts";

/*
 * Contact.
 *
 * The seven inquiry categories are the spine of this page. Each one carries
 * the master's own prompt -- what to include so the message can be answered
 * properly -- and the address it routes to, so a visitor can bypass the form
 * entirely if they prefer email.
 *
 * The careers category deliberately routes to the Careers process rather than
 * this form: the master requires applications to go through the official
 * application flow.
 *
 * Every fact comes from the contact-details global. The form is a disabled
 * shell until Phase 6 wires submissions, and says so.
 */

export const metadata = {
  title: "Contact Edge Comm-Tech — Addis Ababa, Ethiopia",
  description:
    "Contact Edge Comm-Tech for consultations, quotations, technical support, partnerships and training. BMA Plaza, Gerji, Addis Ababa.",
};

export default async function ContactPage() {
  const [contact, solutions] = await Promise.all([getContactDetails(), getSolutions()]);
  const categories = contact.inquiryCategories ?? [];
  const sales = (contact.emails ?? [])[0]?.value;

  return (
    <main>
      <PageHead
        eyebrow="Contact"
        title="Tell us what you need to get working"
        intro="Whether you are scoping a program, comparing platforms, chasing a support issue or exploring a partnership — say which, and your message reaches the right team first time."
        accent="#0888c5"
        variant="wash"
        ctas={
          <CtaRow
            primary={{ href: contact.whatsapp ?? "#form", label: "WhatsApp us" }}
            secondary={{ href: "#form", label: "Send a message" }}
          />
        }
      />

      <section className="border-b border-rule">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <ContactChannels contact={contact} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHead
          eyebrow="Where to direct it"
          title={`${categories.length === 7 ? "Seven" : categories.length} kinds of inquiry, each with a route`}
          intro="Pick the one that fits. Each shows what to include so we can answer properly, and the address it reaches if you would rather email directly."
        />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <InquiryCard key={c.key} c={c} />
          ))}
        </ul>
      </section>

      <section id="form" className="border-t border-rule bg-paper-2/40">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1fr_17rem]">
          <div className="min-w-0">
            <SectionHead eyebrow="Send a message" title="One form, routed by inquiry type" />
            <FormShell
              solutions={solutions.map((s) => s.short)}
              inquiryTypes={categories.map((c) => c.title)}
              email={sales}
            />
          </div>
          <ContactFacts contact={contact} />
        </div>
      </section>
    </main>
  );
}
