import Link from "next/link";
import { Crumb, Field, FormNote, PageHead, SectionHead } from "@/components/ui";
import { getContactDetails, getPostCategories, getSolutions } from "@/lib/content";

/*
 * Subscribe.
 *
 * A single-purpose page: the interest checkboxes are the solution families, so
 * a subscriber's preferences map onto the same taxonomy the site is organised
 * by rather than a separate invented list of topics.
 *
 * No frequency promise appears beyond what the content master approves, and
 * the consent line is explicit, because this collects personal data. The form
 * is a disabled shell until Phase 6 wires submissions, and says so.
 */

const ACCENT = "#2ba8de";

export const metadata = {
  title: "Subscribe to Edge Comm-Tech Updates",
  description:
    "Receive Edge Comm-Tech news, event invitations and technology insights relevant to your sector.",
};

const FIELDS: Parameters<typeof Field>[0][] = [
  { label: "Full name", required: true },
  { label: "Email address", type: "email", required: true },
  { label: "Organization", required: true },
  { label: "Job title" },
  {
    label: "Sector",
    type: "select",
    options: [
      "Select a sector",
      "Banking and finance",
      "Education",
      "Government and public",
      "Enterprise",
      "Other",
    ],
  },
  { label: "Country", type: "select", options: ["Ethiopia", "Other"] },
];

const SEND = [
  ["Insights", "New articles as they are published."],
  ["Events", "Invitations to webinars and briefings."],
  ["Company news", "Milestones and announcements."],
] as const;

const EXPECT = [
  "Only the topics you select.",
  "One unsubscribe click, honoured immediately.",
  "Your details are never sold or passed to a third party.",
  "No sales follow-up unless you ask for one.",
];

export default async function SubscribePage() {
  const [contact, solutions, categories] = await Promise.all([
    getContactDetails(),
    getSolutions(),
    getPostCategories(),
  ]);
  const sales = (contact.emails ?? [])[0]?.value;

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
          <form className="mt-8 grid gap-5 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <Field key={f.label} {...f} />
            ))}

            <fieldset className="sm:col-span-2">
              <legend className="font-mono text-[10px] uppercase tracking-widest text-steel">
                Topics of interest
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {solutions.map((s) => (
                  <label
                    key={s.slug}
                    className="flex items-start gap-3 rounded-xl bg-paper-2 px-4 py-3 text-sm text-ink/75"
                  >
                    <input type="checkbox" className="mt-1" disabled />
                    <span>{s.short}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="sm:col-span-2">
              <legend className="font-mono text-[10px] uppercase tracking-widest text-steel">
                What to send
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {SEND.map(([t, b]) => (
                  <label key={t} className="flex flex-col gap-1 rounded-xl bg-paper-2 px-4 py-3">
                    <span className="flex items-center gap-2.5 text-sm">
                      <input type="checkbox" className="shrink-0" disabled />
                      <span>{t}</span>
                    </span>
                    <span className="pl-[1.6rem] text-[11px] text-steel">{b}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="sm:col-span-2">
              <label className="flex items-start gap-3 text-xs leading-relaxed text-steel">
                <input type="checkbox" className="mt-0.5" disabled />
                <span>
                  I consent to Edge Comm-Tech using these details to send the updates I have
                  selected. I understand I can unsubscribe at any time using the link in any
                  message, or by emailing the team.
                </span>
              </label>
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white opacity-60"
                disabled
              >
                Subscribe
              </button>
            </div>
          </form>
          <FormNote email={sales} />
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
              and a member of the team will reply {(contact.response ?? "").toLowerCase()}.
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
