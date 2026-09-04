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
    <main>
      <section className="dark-surface bg-deep text-paper">
        <div className="wrap pb-16 pt-20 md:pb-20 md:pt-28">
          <h1 className="display display-lg max-w-[14ch]">Talk to an expert</h1>
          <p className="lede mt-7 text-paper/70">
            Tell us what you are trying to stand up, replace, or secure. An engineer replies, not a
            sales queue.
          </p>
          {selected ? (
            <p className="mt-5 border-l-2 border-brass pl-4 text-paper/60">
              Your enquiry will be tagged to {selected.title}.
            </p>
          ) : null}
        </div>
      </section>

      <section className="band bg-paper">
        <div className="wrap grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
          <div className="max-w-xl">
            {form ? (
              <ContactForm form={form} defaults={defaults} />
            ) : (
              <div className="card p-8">
                <h2 className="display display-xs">The form is not set up yet</h2>
                <p className="mt-3 leading-relaxed text-ink-soft">
                  An administrator can create a form titled &ldquo;Contact&rdquo; in the CMS under
                  Site → Forms.
                </p>
              </div>
            )}
          </div>

          <aside className="h-fit lg:sticky lg:top-24">
            <div className="card p-6">
              <h2 className="display display-xs">Reach us</h2>
              {showContact ? (
                <ul className="mt-4 space-y-3">
                  {contact?.phone ? (
                    <li>
                      <a
                        href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                        className="link-quiet text-teal"
                      >
                        {contact.phone}
                      </a>
                    </li>
                  ) : null}
                  {contact?.secondaryPhone ? (
                    <li>
                      <a
                        href={`tel:${contact.secondaryPhone.replace(/\s+/g, "")}`}
                        className="link-quiet text-teal"
                      >
                        {contact.secondaryPhone}
                      </a>
                    </li>
                  ) : null}
                  {contact?.email ? (
                    <li>
                      <a href={`mailto:${contact.email}`} className="link-quiet text-teal">
                        {contact.email}
                      </a>
                    </li>
                  ) : null}
                  {contact?.address ? (
                    <li className="whitespace-pre-line text-[0.9375rem] leading-relaxed text-ink-soft">
                      {contact.address}
                    </li>
                  ) : null}
                </ul>
              ) : (
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                  Use the form and we will reply by email. Direct phone and office details are
                  published here once confirmed.
                </p>
              )}
            </div>

            <div className="card mt-5 p-6">
              <h2 className="display display-xs">What happens next</h2>
              <ol className="thread-v mt-5 text-[0.9375rem] leading-relaxed text-ink-soft">
                <li>An engineer reads it, not a sales queue.</li>
                <li>We reply within one business day.</li>
                <li>If it is a fit, we book a scoping call.</li>
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
