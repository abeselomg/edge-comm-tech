import Link from "next/link";
import { ClosingCta, Crumb, PageHead } from "@/components/ui";
import { getEvents } from "@/lib/content";
import { EventsEmpty, PastRow, splitEvents, UpcomingCard } from "./event-parts";

/*
 * Events and webinars.
 *
 * Upcoming sessions lead; a session that has run sits in a past band with its
 * registration closed, rather than inviting a sign-up that cannot happen. Status
 * comes from the dates, so this page stays correct as time passes -- which is why
 * it revalidates on a timer: a page prerendered while a session was upcoming
 * would otherwise keep inviting registration after the session had ended.
 */

export const revalidate = 3600;

export const metadata = {
  title: "Technology Events and Webinars — Edge Comm-Tech",
  description:
    "Join Edge Comm-Tech webinars, briefings and exhibitions on enterprise AI, infrastructure, cybersecurity and digital transformation.",
};

const PROMPTS = [
  [
    "Speak at an Edge session",
    "We invite client and partner practitioners to share real delivery experience.",
    "/contact",
    "Propose a speaker",
  ],
  [
    "Host a private briefing",
    "A session scoped to one institution's leadership team and its own priorities.",
    "/contact",
    "Request a briefing",
  ],
  [
    "Never miss one",
    "Occasional notices when a new session is confirmed. Nothing else.",
    "/subscribe",
    "Subscribe",
  ],
] as const;

export default async function EventsPage() {
  const { upcoming, past } = splitEvents(await getEvents());

  return (
    <main>
      <PageHead
        eyebrow="Events and webinars"
        title="Sessions worth your hour"
        intro="Online discussions, institutional briefings and international exhibitions where our team shares what is working in practice — and answers the questions that follow."
        accent="#0888c5"
        variant="beam"
        crumb={<Crumb trail={[{ label: "Resources", href: "/resources" }, { label: "Events" }]} />}
      />

      <div className="mx-auto max-w-6xl px-6 py-16">
        {upcoming.length ? (
          <section>
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="font-display text-[clamp(1.4rem,2.6vw,2rem)]">Upcoming</h2>
              <p className="font-mono text-[10px] uppercase tracking-widest text-steel">
                {`${upcoming.length} session${upcoming.length > 1 ? "s" : ""}`}
              </p>
            </div>
            <ul className="mt-8 space-y-4">
              {upcoming.map((e) => (
                <UpcomingCard key={e.slug} event={e} />
              ))}
            </ul>
          </section>
        ) : (
          <EventsEmpty />
        )}

        {past.length ? (
          <section className="mt-16">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="font-display text-[clamp(1.3rem,2.2vw,1.7rem)]">Already held</h2>
              <p className="font-mono text-[10px] uppercase tracking-widest text-steel">
                Materials added once approved
              </p>
            </div>
            <ul className="mt-6 divide-y divide-rule border-t border-rule">
              {past.map((e) => (
                <PastRow key={e.slug} event={e} />
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-16 grid gap-3 sm:grid-cols-3">
          {PROMPTS.map(([t, b, href, cta]) => (
            <div key={t} className="eg-inview flex flex-col rounded-2xl bg-paper-2 p-6">
              <h3 className="font-display text-lg leading-snug">{t}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">{b}</p>
              <Link
                href={href}
                className="mt-4 font-mono text-[10px] uppercase tracking-widest text-gold"
              >
                {cta} &rarr;
              </Link>
            </div>
          ))}
        </section>
      </div>

      <ClosingCta
        title="Bring your questions"
        body="Our sessions are built around the decisions institutions are actually facing. If you have a specific one, tell us before you attend."
        primary={{ href: "/contact", label: "Talk to our experts" }}
        secondary={{ href: "/resources", label: "Back to resources" }}
      />
    </main>
  );
}
