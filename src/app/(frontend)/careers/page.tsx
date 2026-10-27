import { buildMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import { ClosingCta, CtaRow, PageHead, Pending, SectionHead } from "@/components/ui";
import { getCareersContent, getContactDetails, getJobs } from "@/lib/content";
import { hrEmail, intakeNote } from "./careers-parts";

/*
 * Careers hub.
 *
 * Three routes in -- open positions, internships, E-Academy -- and the reasons
 * to take one. The open-position count is computed from the published jobs, so
 * this page cannot advertise vacancies that are not published.
 *
 * No salary, benefit or employment condition appears anywhere in the careers
 * module: none has been approved for publication. The internship deadline is
 * shown as unconfirmed rather than invented.
 */

export const metadata = buildMetadata({
  title: "Careers at Edge Comm-Tech — Build Africa's Digital Future",
  description:
    "Join Edge Comm-Tech. Explore engineering, project delivery and corporate careers, graduate internships and E-Academy training programs in Addis Ababa.",
  path: "/careers",
});

const plural = (n: number, word: string) => `${n} ${word}${n > 1 ? "s" : ""}`;

export default async function CareersPage() {
  const [careers, jobs, contact] = await Promise.all([
    getCareersContent(),
    getJobs(),
    getContactDetails(),
  ]);
  const internship = careers.internship;
  const email = hrEmail(contact);
  const docs = careers.applicationDocs ?? [];

  const routes = [
    {
      href: "/careers/open-positions",
      eyebrow: "Experienced professionals",
      title: "Open positions",
      body: "Current vacancies across engineering, project delivery, commercial and corporate functions.",
      count: jobs.length ? `${plural(jobs.length, "role")} open` : "No roles open",
      accent: "#0888c5",
    },
    {
      href: "/careers/internships",
      eyebrow: "Students and graduates",
      title: "Internship program",
      body: `${internship.intro.split(". ")[0]}.`,
      count: plural(internship.tracks?.length ?? 0, "track"),
      accent: "#2ba8de",
    },
    {
      href: "/careers/e-academy",
      eyebrow: "Learning and certification",
      title: "Edge E-Academy",
      body: "Structured technology training for individuals, institutions and corporate teams.",
      count: "Courses and workshops",
      accent: "#056a9a",
    },
  ];

  return (
    <main>
      <PageHead
        eyebrow="Careers"
        title="Build the infrastructure a continent runs on"
        intro="Edge Comm-Tech engineers work on the systems Ethiopian banks, universities and ministries depend on. The work is real, the standards are high, and what you learn here compounds."
        accent="#0888c5"
        variant="grid"
        ambience="general"
        ctas={
          <CtaRow
            primary={{ href: "/careers/open-positions", label: "See open positions" }}
            secondary={{ href: "/careers/internships", label: "Graduate internships" }}
          />
        }
      />

      {/* Three routes in */}
      <section className="border-b border-rule bg-paper-2/40">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <ul className="grid gap-3 sm:grid-cols-3">
            {routes.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="eg-inview group flex h-full flex-col rounded-3xl bg-paper p-7 transition hover:-translate-y-1"
                >
                  <span
                    className="font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: r.accent }}
                  >
                    {r.eyebrow}
                  </span>
                  <span className="mt-2 font-display text-xl leading-snug group-hover:text-gold">
                    {r.title}
                  </span>
                  <span className="mt-2.5 flex-1 text-sm leading-relaxed text-ink/70">{r.body}</span>
                  <span className="mt-5 flex items-center justify-between gap-3 border-t border-rule pt-4 font-mono text-[10px] uppercase tracking-widest">
                    <span className="text-steel">{r.count}</span>
                    <span className="text-gold" aria-hidden="true">
                      &rarr;
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why work here */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHead
          eyebrow="The experience"
          title="What working at Edge Comm-Tech is actually like"
        />
        <ul className="mt-9 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {(careers.experiencePoints ?? []).map((x) => (
            <li
              key={x.item}
              className="eg-inview flex items-start gap-3 rounded-2xl bg-paper-2 px-5 py-4 text-sm leading-relaxed text-ink/80"
            >
              <svg
                viewBox="0 0 24 24"
                className="mt-0.5 h-4 w-4 shrink-0"
                fill="none"
                stroke="#0888c5"
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
      </section>

      {/* Career pathways */}
      <section className="border-t border-rule bg-paper-2/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHead
            eyebrow="Career pathways"
            title="Where people build a career here"
            intro="Six broad pathways, each with its own progression from early-career contribution through specialist and leadership roles."
          />
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {(careers.pathways ?? []).map((p, i) => (
              <div key={p.title} className="eg-inview border-t border-rule pt-5">
                <span className="font-mono text-[10px] text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1.5 font-display text-lg leading-snug">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture: the seven values, as they apply to working here */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHead
          eyebrow="Culture"
          title="Seven things we hold each other to"
          intro="The same values that govern how we deliver for clients govern how we work together."
        />
        <dl className="mt-10 grid gap-px overflow-hidden rounded-3xl bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {(careers.culture ?? []).map((c) => (
            <div key={c.title} className="eg-inview bg-paper-2 p-6">
              <dt className="font-display text-lg">{c.title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink/70">{c.body}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-xs text-steel">
          These are Edge Comm-Tech&apos;s company values.{" "}
          <Link
            href="/about"
            className="underline decoration-rule underline-offset-2 hover:text-gold"
          >
            Read how they shape our delivery
          </Link>
          .
        </p>
      </section>

      {/* Development */}
      <section className="border-t border-rule">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
            <div>
              <SectionHead eyebrow="Growth" title="How people develop here" />
              <ul className="mt-7 space-y-3">
                {(careers.development ?? []).map((x) => (
                  <li
                    key={x.item}
                    className="eg-inview flex items-start gap-3 text-sm leading-relaxed text-ink/80"
                  >
                    <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{x.item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-paper-2 p-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-gold">
                Before you apply
              </p>
              <h3 className="mt-2 font-display text-xl">Have these ready</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                Every vacancy and internship application asks for the same documents. Preparing them
                first makes the form a five-minute job.
              </p>
              <ul className="mt-5 space-y-1.5">
                {docs.map((x) => (
                  <li
                    key={x.item}
                    className="flex items-start gap-3 rounded-xl bg-paper px-4 py-2.5 text-sm text-ink/75"
                  >
                    <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-gold" />
                    <span>{x.item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-steel">
                Applications are acknowledged with a reference number. Our HR team contacts
                candidates selected for the next stage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Talent community */}
      <section className="border-t border-rule bg-paper-2/40">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gold">
            Nothing open that fits?
          </p>
          <h2 className="mt-3 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-tight">
            Introduce yourself anyway
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-ink/75">
            We keep speculative applications on file and review them when a relevant role opens.
            Send your CV with a short note about the work you want to do.
          </p>
          <p className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {email ? (
              <a
                href={`mailto:${email}`}
                className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                {email}
              </a>
            ) : null}
            <Link
              href="/careers/open-positions"
              className="rounded-full border border-rule px-6 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold"
            >
              Check open roles first
            </Link>
          </p>
          <p className="mt-5 flex justify-center">{intakeNote(internship.schedule)}</p>
        </div>
      </section>

      <ClosingCta
        title="Ready to apply?"
        body={
          jobs.length
            ? `${jobs.length} position${jobs.length > 1 ? "s are" : " is"} open now, and the graduate internship program accepts applications between intakes.`
            : "There are no open positions at the moment, but the graduate internship program accepts applications between intakes."
        }
        primary={{ href: "/careers/open-positions", label: "See open positions" }}
        secondary={{ href: "/careers/e-academy", label: "Explore E-Academy" }}
      />
    </main>
  );
}
