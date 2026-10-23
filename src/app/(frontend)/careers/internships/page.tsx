import { ClosingCta, Crumb, Field, FormNote, PageHead, Pending, SectionHead } from "@/components/ui";
import { getCareersContent, getContactDetails } from "@/lib/content";
import { deadlineText, hrEmail } from "../careers-parts";

/*
 * Graduate internship program.
 *
 * Two things the content master insists on, both honoured here:
 *
 *   - Intakes are periodic. Dates, schedule and deadline are all unconfirmed,
 *     so they render as pending rather than as a date nobody has agreed.
 *   - The caveat that applying does not guarantee placement is published in
 *     full, not softened. It appears before the form, not after it.
 */

const ACCENT = "#2ba8de";

export const metadata = {
  title: "Graduate Technology Internship — Edge Comm-Tech",
  description:
    "Supervised graduate internships at Edge Comm-Tech in network engineering and system engineering, with mentorship, structured learning plans and real project exposure.",
};

const STATUS_OPTIONS = [
  "Select",
  "Final-year student",
  "Recent graduate",
  "Technical and vocational graduate",
  "Other",
];

/** "Dates and working schedule to be confirmed" -> "Intake dates to be confirmed". */
const intakeDatesLabel = (schedule: string) =>
  `Intake dates ${schedule.toLowerCase().replace(/^dates and working schedule /, "")}`;

export default async function InternshipsPage() {
  const [careers, contact] = await Promise.all([getCareersContent(), getContactDetails()]);
  const i = careers.internship;
  const email = hrEmail(contact);
  const tracks = i.tracks ?? [];
  const schedule = i.schedule?.status === "pending" ? i.schedule.pendingLabel : i.schedule?.value;

  const FIELDS: Parameters<typeof Field>[0][] = [
    { label: "Full legal name", required: true },
    { label: "Email address", type: "email", required: true },
    { label: "Mobile number", required: true },
    { label: "City and country of residence", required: true },
    {
      label: "Preferred track",
      type: "select",
      required: true,
      options: ["Select a track", ...tracks.map((t) => t.title)],
    },
    { label: "University or institution", required: true },
    { label: "Field of study", required: true },
    { label: "Current status", type: "select", options: STATUS_OPTIONS },
    { label: "Expected or actual graduation year" },
    { label: "CV upload", required: true, hint: "PDF or DOCX" },
    { label: "Why this track", type: "textarea", wide: true, hint: "A short paragraph is enough" },
  ];

  return (
    <main>
      <PageHead
        eyebrow="Internship program"
        title={i.title}
        intro={i.intro}
        accent={ACCENT}
        variant="beam"
        crumb={<Crumb trail={[{ label: "Careers", href: "/careers" }, { label: "Internships" }]} />}
        meta={
          <p className="eg-rise mt-6 flex flex-wrap gap-2">
            {schedule ? <Pending>{intakeDatesLabel(schedule)}</Pending> : null}
            <Pending>{`Application ${deadlineText(i.deadline).toLowerCase()}`}</Pending>
          </p>
        }
      />

      <div className="mx-auto max-w-6xl px-6">
        <dl className="eg-rise -mt-9 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule shadow-[0_20px_50px_-40px_rgb(28_36_48/0.6)] sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Program", i.type],
            ["Tracks", `${tracks.length} available per intake`],
            ["Location", i.location],
            ["Schedule", schedule ?? "To be confirmed"],
          ].map(([k, v]) => (
            <div key={k} className="bg-paper-2 px-5 py-4">
              <dt className="font-mono text-[9px] uppercase tracking-widest text-steel">{k}</dt>
              <dd className="mt-1.5 text-sm leading-snug">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Tracks */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHead
          eyebrow="Tracks"
          title="Two supervised engineering tracks"
          intro="Each intake publishes the tracks it can support, based on departmental capacity, project requirements and available mentors."
          accent={ACCENT}
        />
        <div className="mt-9 grid gap-4 lg:grid-cols-2">
          {tracks.map((t, n) => (
            <article
              key={t.title}
              className="eg-inview rounded-3xl border border-rule p-8 transition hover:border-gold"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#2ba8de]">
                {`Track ${String(n + 1).padStart(2, "0")}`}
              </span>
              <h3 className="mt-2 font-display text-2xl">{t.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">{t.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Program structure */}
      <section className="border-y border-rule bg-paper-2/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <SectionHead eyebrow="Structure" title="How an intake runs" accent={ACCENT} />
          <ol className="mt-9 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {(i.structure ?? []).map((x, n) => (
              <li key={x.title} className="eg-inview border-t border-rule pt-5">
                <span className="font-mono text-[10px] text-[#2ba8de]">
                  {String(n + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1.5 font-display text-lg">{x.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{x.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Eligibility and selection */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHead eyebrow="Eligibility" title="Who we can consider" accent={ACCENT} />
            <ul className="mt-6 space-y-2.5">
              {(i.eligibility ?? []).map((x) => (
                <li
                  key={x.item}
                  className="eg-inview flex items-start gap-3 text-sm leading-relaxed text-ink/80"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-0.5 h-4 w-4 shrink-0"
                    fill="none"
                    stroke={ACCENT}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                  <span>{x.item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHead eyebrow="Selection" title="How applications are assessed" accent={ACCENT} />
            <ol className="mt-6 space-y-4">
              {(i.selection ?? []).map((x) => (
                <li key={x.n} className="eg-inview flex gap-4">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#2ba8de]/15 font-mono text-[10px] text-[#2ba8de]">
                    {x.n}
                  </span>
                  <span>
                    <span className="block font-display text-base">{x.title}</span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-ink/70">
                      {x.body}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* The caveat, published in full and before the form */}
      <section className="mx-auto max-w-4xl px-6">
        <p className="rounded-3xl border border-lamp/40 bg-lamp/[0.07] px-7 py-6 text-sm leading-relaxed text-ink/80">
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-lamp">
            Please read before applying
          </span>
          {i.caveat}
        </p>
      </section>

      {/* Application */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_17rem]">
          <div className="min-w-0">
            <SectionHead eyebrow="Apply" title="Register for the next intake" accent={ACCENT} />
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70">
              Applications are held and reviewed against the next intake&apos;s published tracks and
              criteria. You will receive an acknowledgement with a reference number.
            </p>
            <form className="mt-8 grid gap-5 sm:grid-cols-2">
              {FIELDS.map((f) => (
                <Field key={f.label} {...f} />
              ))}
              <div className="sm:col-span-2">
                <label className="flex items-start gap-3 text-xs leading-relaxed text-steel">
                  <input type="checkbox" className="mt-0.5" disabled />
                  <span>
                    I confirm the information provided is accurate, I have read the note above, and
                    I accept the privacy notice and consent to recruitment processing.
                  </span>
                </label>
              </div>
              <div className="sm:col-span-2">
                <button
                  type="button"
                  className="rounded-full bg-[#2ba8de] px-6 py-3 text-sm font-semibold text-white opacity-60"
                  disabled
                >
                  Submit application
                </button>
              </div>
            </form>
            <FormNote email={email} />
          </div>

          <aside className="self-start lg:sticky lg:top-32">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#2ba8de]">
              Documents required
            </p>
            <ul className="mt-3 space-y-1.5">
              {(i.documents ?? []).map((x) => (
                <li key={x.item} className="rounded-xl bg-paper-2 px-4 py-2.5 text-sm text-ink/75">
                  {x.item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-steel">
              Questions? Email{" "}
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="underline decoration-rule underline-offset-2 hover:text-gold"
                >
                  {email}
                </a>
              ) : null}
              .
            </p>
          </aside>
        </div>
      </section>

      <ClosingCta
        title="Already graduated and looking for a role?"
        body="If you have professional experience behind you, the open positions page is the right place to start."
        primary={{ href: "/careers/open-positions", label: "See open positions" }}
        secondary={{ href: "/careers/e-academy", label: "Explore E-Academy training" }}
        accent={ACCENT}
      />
    </main>
  );
}
