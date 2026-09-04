import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { getContactForm, getSiteSettings, getSolutions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to Edge COMM-TECH about a data center, network, security, or cloud engagement.",
};

type Props = { searchParams: Promise<{ domain?: string; role?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const { domain, role } = await searchParams;
  const [form, settings, solutions] = await Promise.all([
    getContactForm(),
    getSiteSettings(),
    getSolutions(),
  ]);

  const contact = settings.contact;
  const showContact = Boolean(contact?.verified);
  const selected = solutions.find((s) => s.slug === domain);

  const defaults: Record<string, string> = {};
  if (selected) defaults.domain = selected.title;
  if (role) defaults.message = `I would like to apply for the ${role.replace(/-/g, " ")} role.`;

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-14 md:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-gold">Contact</p>
          <h1 className="mt-3 font-display text-5xl">Talk to an expert</h1>
          <p className="mt-4 text-ink/80">
            Tell us what you are trying to stand up, replace, or secure. An engineer replies — not a
            sales queue.
          </p>
          {selected ? (
            <p className="mt-4 border-l-2 border-gold pl-3 font-caption text-ink/75">
              About {selected.title}.
            </p>
          ) : null}

          {form ? (
            <ContactForm form={form} defaults={defaults} />
          ) : (
            <p className="mt-10 border border-rule bg-paper-2 p-6 text-ink/75">
              The contact form has not been set up yet. An administrator can create a form titled
              &ldquo;Contact&rdquo; in the CMS under Site → Forms.
            </p>
          )}
        </div>

        <aside className="h-fit md:sticky md:top-24">
          <div className="still p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel">Reach us</p>
            {showContact ? (
              <ul className="mt-4 space-y-3 text-sm text-ink/80">
                {contact?.phone ? (
                  <li>
                    <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="hover:text-gold">
                      {contact.phone}
                    </a>
                  </li>
                ) : null}
                {contact?.secondaryPhone ? (
                  <li>
                    <a
                      href={`tel:${contact.secondaryPhone.replace(/\s+/g, "")}`}
                      className="hover:text-gold"
                    >
                      {contact.secondaryPhone}
                    </a>
                  </li>
                ) : null}
                {contact?.email ? (
                  <li>
                    <a href={`mailto:${contact.email}`} className="hover:text-gold">
                      {contact.email}
                    </a>
                  </li>
                ) : null}
                {contact?.address ? (
                  <li className="whitespace-pre-line text-ink/70">{contact.address}</li>
                ) : null}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-ink/70">
                Use the form and we will reply by email. Direct phone and office details are published
                here once confirmed.
              </p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
