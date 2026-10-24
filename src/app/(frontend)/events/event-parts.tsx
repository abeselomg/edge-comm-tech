import Link from "next/link";
import { Field, FormNote, SectionHead } from "@/components/ui";
import type { EventWithStatus } from "@/lib/content";
import { eventHref, publishedOnly } from "@/lib/routes";

/*
 * The events pages' own pieces, beside the pages because Next allows a page only
 * its known exports.
 *
 * Status is derived from the dates (see lib/events.ts), never stored, so a page
 * stays correct as dates pass without anyone editing it. The routes revalidate on
 * a timer for the same reason: a page prerendered while an event is upcoming
 * would otherwise keep inviting registration after it has ended.
 */

/** Upcoming sessions and those already held, each in the approved order. */
export function splitEvents(events: EventWithStatus[]): {
  upcoming: EventWithStatus[];
  past: EventWithStatus[];
} {
  return {
    upcoming: events.filter((e) => e.status !== "past"),
    past: events.filter((e) => e.status === "past"),
  };
}

const venueLabel = (e: EventWithStatus) => (e.format === "Online" ? "Platform" : "Venue");

export function UpcomingCard({ event: e }: { event: EventWithStatus }) {
  const cells: [string, string][] = [
    ["Date", e.displayDate],
    ["Format", e.format],
    [venueLabel(e), e.venue],
  ];
  return (
    <li>
      <Link
        href={eventHref(e.slug)}
        className="eg-inview group grid overflow-hidden rounded-3xl border border-rule transition hover:border-gold lg:grid-cols-[1fr_15rem]"
      >
        <div className="p-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gold">{e.category}</p>
          <h3 className="mt-3 font-display text-[clamp(1.35rem,2.5vw,2rem)] leading-tight group-hover:text-gold">
            {e.headline}
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">{e.intro}</p>
          <p className="mt-5 text-xs text-steel">{`For ${e.audience.toLowerCase()}`}</p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white">
            {e.action} <span aria-hidden="true">&rarr;</span>
          </span>
        </div>
        <dl className="grid content-start gap-px bg-rule">
          {cells.map(([k, v]) => (
            <div key={k} className="bg-paper-2 px-6 py-5">
              <dt className="font-mono text-[9px] uppercase tracking-widest text-steel">{k}</dt>
              <dd className="mt-1.5 text-sm leading-snug">{v}</dd>
            </div>
          ))}
        </dl>
      </Link>
    </li>
  );
}

export function PastRow({ event: e }: { event: EventWithStatus }) {
  return (
    <li>
      <Link
        href={eventHref(e.slug)}
        className="group grid gap-x-8 gap-y-2 py-6 lg:grid-cols-[11rem_1fr]"
      >
        <span className="shrink-0">
          <span className="block font-mono text-[10px] uppercase tracking-widest text-steel">
            {e.displayDate}
          </span>
          <span className="mt-1 block font-mono text-[9px] uppercase tracking-widest text-steel">
            {e.format}
          </span>
        </span>
        <span className="min-w-0">
          <span className="block font-display text-lg leading-snug group-hover:text-gold">
            {e.title}
          </span>
          <span className="mt-1.5 block max-w-2xl text-[13px] leading-relaxed text-ink/65">
            {e.intro}
          </span>
        </span>
      </Link>
    </li>
  );
}

/** What the index says when nothing is scheduled. */
export function EventsEmpty() {
  return (
    <section className="rounded-3xl border border-rule p-10 text-center">
      <h2 className="font-display text-2xl">No sessions scheduled right now</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm text-ink/70">
        Subscribe and we will let you know as soon as the next one is confirmed.
      </p>
      <Link
        href="/subscribe"
        className="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white"
      >
        Get event updates
      </Link>
    </section>
  );
}

export function EventDetails({ event: e }: { event: EventWithStatus }) {
  const past = e.status === "past";
  const details: [string, string][] = [
    ["Date", e.displayDate],
    ["Format", e.format],
    [venueLabel(e), e.venue],
    ["Audience", e.audience],
    ["Status", past ? "Completed" : "Upcoming"],
  ];
  return (
    <dl className="grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-3 lg:grid-cols-5">
      {details.map(([k, v]) => (
        <div key={k} className="bg-paper-2 px-5 py-4">
          <dt className="font-mono text-[9px] uppercase tracking-widest text-steel">{k}</dt>
          <dd className="mt-1.5 text-sm leading-snug">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ProgramList({ event: e, accent }: { event: EventWithStatus; accent: string }) {
  if (!e.program?.length) return null;
  return (
    <section className="mt-14">
      <SectionHead eyebrow="Program" title="What the session covers" accent={accent} />
      <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
        {e.program.map((x) => (
          <li
            key={x.item}
            className="eg-inview flex items-start gap-3 rounded-2xl bg-paper-2 px-5 py-4 text-sm text-ink/80"
          >
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: accent }}
            />
            <span>{x.item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const SECTORS = [
  "Select a sector",
  "Banking and finance",
  "Education",
  "Government",
  "Enterprise",
  "Other",
];

/**
 * Registration while the event is upcoming; a closed notice once it has run.
 * The form is an inert shell until Phase 6 wires submissions, and says so. It is
 * the only form on its page, which keeps the label-derived field ids unique.
 */
export function RegistrationPanel({
  event: e,
  accent,
  email,
}: {
  event: EventWithStatus;
  accent: string;
  email?: string;
}) {
  const past = e.status === "past";
  const fields: Parameters<typeof Field>[0][] = [
    { label: "Full name", required: true },
    { label: "Job title", required: true },
    { label: "Organization", required: true },
    { label: "Sector", type: "select", required: true, options: SECTORS },
    { label: "Email address", type: "email", required: true },
    { label: "WhatsApp number", required: true, hint: "Include country code" },
    { label: "Preferred updates", type: "select", options: ["Email", "WhatsApp", "Both"] },
    { label: "Attendance mode", type: "select", options: ["Online", "In person", "Meeting request"] },
    { label: "Question or objective", type: "textarea", wide: true },
  ];
  return (
    <section className="mt-16 rounded-3xl p-8" style={{ background: `${accent}0c` }}>
      <SectionHead
        eyebrow={past ? "Registration closed" : "Registration"}
        title={past ? "This event has already run" : "What registrants should expect"}
        accent={accent}
      />
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/75">
        {past
          ? "Highlights, materials and any recording are added to this page when they are approved. Subscribe to hear about the next session."
          : "Complete the form with your professional details and communication preference. After submission you receive an acknowledgement. A confirmed seat, joining link, venue access instruction or meeting time is sent separately after review where approval is required."}
      </p>
      {past ? (
        <Link
          href="/subscribe"
          className="mt-6 inline-block rounded-full px-5 py-3 text-sm font-semibold text-white"
          style={{ background: accent }}
        >
          Get event updates
        </Link>
      ) : (
        <>
          <form className="mt-7 grid gap-5 sm:grid-cols-2">
            {fields.map((f) => (
              <Field key={f.label} {...f} />
            ))}
            <div className="sm:col-span-2">
              <label className="flex items-start gap-3 text-xs text-steel">
                <input type="checkbox" className="mt-0.5" disabled />
                <span>I accept the event communication and privacy notice.</span>
              </label>
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                className="rounded-full px-6 py-3 text-sm font-semibold text-white opacity-60"
                style={{ background: accent }}
                disabled
              >
                {e.action}
              </button>
            </div>
          </form>
          <FormNote email={email} />
        </>
      )}
    </section>
  );
}

export function OtherEvents({
  events,
  currentSlug,
}: {
  events: EventWithStatus[];
  currentSlug: string;
}) {
  const others = publishedOnly<EventWithStatus>(events).filter((o) => o.slug !== currentSlug);
  if (!others.length) return null;
  return (
    <nav className="mt-14 border-t border-rule pt-8">
      <p className="font-mono text-[10px] uppercase tracking-widest text-steel">Other events</p>
      <ul className="mt-4 divide-y divide-rule">
        {others.map((o) => (
          <li key={o.slug}>
            <Link
              href={eventHref(o.slug)}
              className="group flex items-baseline justify-between gap-4 py-3.5"
            >
              <span className="font-display text-base group-hover:text-gold">{o.title}</span>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-steel">
                {o.displayDate}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
