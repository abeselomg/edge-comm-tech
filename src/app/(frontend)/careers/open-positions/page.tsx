import Link from "next/link";
import { ClosingCta, Crumb, PageHead, SectionHead } from "@/components/ui";
import { getCareersContent, getContactDetails, getJobs } from "@/lib/content";
import { hrEmail, PositionsList } from "../careers-parts";

/*
 * Open positions.
 *
 * Each row carries only what the content master approves for a listing --
 * department, level, reporting line, type, status, location -- and the
 * deadline is shown as unconfirmed rather than guessed. No salary or benefit
 * appears: none is approved for publication.
 */

export const metadata = {
  title: "Open Positions — Careers at Edge Comm-Tech",
  description:
    "Current vacancies at Edge Comm-Tech in Addis Ababa across engineering, technology leadership and corporate functions.",
};

export default async function OpenPositionsPage() {
  const [careers, jobs, contact] = await Promise.all([
    getCareersContent(),
    getJobs(),
    getContactDetails(),
  ]);
  const email = hrEmail(contact);

  return (
    <main>
      <PageHead
        eyebrow="Open positions"
        title={
          jobs.length
            ? `${jobs.length} role${jobs.length > 1 ? "s" : ""} open right now`
            : "No roles open right now"
        }
        intro="Every vacancy lists its responsibilities, required and preferred qualifications, and how performance in the role will be judged — so you can decide whether it is right for you before you apply."
        accent="#0888c5"
        variant="rule"
        crumb={<Crumb trail={[{ label: "Careers", href: "/careers" }, { label: "Open positions" }]} />}
      />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <PositionsList jobs={jobs} />

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1fr]">
          <section>
            <SectionHead
              eyebrow="What to prepare"
              title="Documents every application asks for"
            />
            <ul className="mt-6 space-y-1.5">
              {(careers.applicationDocs ?? []).map((x) => (
                <li
                  key={x.item}
                  className="eg-inview flex items-start gap-3 rounded-xl bg-paper-2 px-5 py-3 text-sm text-ink/75"
                >
                  <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-gold" />
                  <span>{x.item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-steel">
              Applications are acknowledged with a reference number and routed to{" "}
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="underline decoration-rule underline-offset-2 hover:text-gold"
                >
                  {email}
                </a>
              ) : null}
              . Our HR team contacts candidates selected for the next stage.
            </p>
          </section>

          <section className="rounded-3xl bg-paper-2 p-8">
            <SectionHead eyebrow="Nothing matching?" title="Register your interest" />
            <p className="mt-4 text-sm leading-relaxed text-ink/75">
              We review speculative applications when a relevant role opens. Tell us which pathway
              your experience sits in and what you want to work on.
            </p>
            <ul className="mt-6 flex flex-wrap gap-1.5">
              {(careers.pathways ?? []).map((p) => (
                <li
                  key={p.title}
                  className="rounded-full bg-paper px-3 py-1.5 text-[11px] text-ink/70"
                >
                  {p.title}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Send your CV
                </a>
              ) : null}
              <Link
                href="/careers/internships"
                className="rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold"
              >
                Graduate internships
              </Link>
            </div>
          </section>
        </div>
      </div>

      <ClosingCta
        title="Questions about a role?"
        body={
          <>
            Email our HR team at{" "}
            {email ? (
              <a
                href={`mailto:${email}`}
                className="underline decoration-rule underline-offset-2 hover:text-gold"
              >
                {email}
              </a>
            ) : null}{" "}
            with the role title and your question.
          </>
        }
        primary={{ href: "/careers", label: "Back to careers" }}
        secondary={{ href: "/about", label: "About Edge Comm-Tech" }}
      />
    </main>
  );
}
