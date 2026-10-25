import Link from "next/link";
import { LiveForm } from "@/components/forms/LiveForm";
import { Crumb, PageHead, SectionHead } from "@/components/ui";
import { getContactDetails, getForm, getPostCategories } from "@/lib/content";
import { emailByLabel } from "@/lib/routes";

/*
 * Subscribe.
 *
 * A single-purpose page: the interest checkboxes are the solution families, so
 * a subscriber's preferences map onto the same taxonomy the site is organised
 * by rather than a separate invented list of topics. They are fields of the
 * stored "Subscribe" form.
 *
 * No frequency promise appears beyond what the content master approves, and
 * the consent line is explicit, because this collects personal data.
 */

const ACCENT = "#2ba8de";

export const metadata = {
  title: "Subscribe to Edge Comm-Tech Updates",
  description:
    "Receive Edge Comm-Tech news, event invitations and technology insights relevant to your sector.",
};

const EXPECT = [
  "Only the topics you select.",
  "One unsubscribe click, honoured immediately.",
  "Your details are never sold or passed to a third party.",
  "No sales follow-up unless you ask for one.",
];

export default async function SubscribePage() {
  const [contact, form, categories] = await Promise.all([
    getContactDetails(),
    getForm("subscribe"),
    getPostCategories(),
  ]);
  const sales = emailByLabel(contact, /sales/i);

  return (
    <main>
      <PageHead
        eyebrow="Stay informed"
        title="Updates worth opening"
        intro="Occasional notes on new insights, upcoming sessions and company news — sent only to people who asked for them, and only when there is something to say."
        accent={ACCENT}
        variant="wash"
        crumb={<Crumb trail={[{ label: "Resources", href: "/resources" }, { label: "Subscribe" }]} />}
      />

      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-16 lg:grid-cols-[1fr_19rem]">
        <section className="min-w-0">
          <SectionHead
            eyebrow="Subscribe"
            title="Tell us who you are and what interests you"
            accent={ACCENT}
          />
          <LiveForm form={form} action="/forms/subscribe" submitLabel="Subscribe" email={sales} />
        </section>

        <aside className="self-start lg:sticky lg:top-32">
          <div className="rounded-2xl bg-paper-2 p-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-steel">
              What you can expect
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink/75">
              {EXPECT.map((x) => (
                <li key={x} className="flex items-start gap-2.5">
                  <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-gold" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-2xl border border-rule p-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-steel">
              Prefer to just ask?
            </p>
            <p className="mt-2.5 text-sm leading-relaxed text-ink/70">
              Email{" "}
              {sales ? (
                <a
                  href={`mailto:${sales}`}
                  className="underline decoration-rule underline-offset-2 hover:text-gold"
                >
                  {sales}
                </a>
              ) : null}{" "}
              {` and a member of the team will reply ${(contact.response ?? "").toLowerCase()}.`}
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-block font-mono text-[10px] uppercase tracking-widest text-gold"
            >
              Contact page &rarr;
            </Link>
          </div>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-steel">
            We publish on
          </p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <li key={c.key} className="rounded-full bg-paper-2 px-2.5 py-1 text-[11px] text-ink/65">
                {c.label}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
