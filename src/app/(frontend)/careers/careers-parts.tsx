import Link from "next/link";
import { Pending } from "@/components/ui";
import type { ConfirmableValue } from "@/components/ui";
import { routeFor } from "@/lib/routes";
import type { ContactDetail, Job } from "@/payload-types";

/*
 * Pieces the four careers pages share, beside careers/page.tsx because Next
 * allows a page only its known exports.
 *
 * Nothing here can print a salary, a benefit or an employment condition: the
 * content master approves none for publication and no field holds one.
 */

const FALLBACK_DEADLINE = "Deadline to be confirmed";

/**
 * The deadline line for a role or an intake.
 *
 * Pending reads as the label stored with it. A confirmed value reads as a
 * date. Anything else -- no record, or "confirmed" with nothing in it -- reads
 * as unconfirmed rather than as a blank, because a missing deadline that
 * renders as nothing looks like there is no deadline.
 */
export function deadlineText(deadline: ConfirmableValue | null | undefined): string {
  if (deadline?.status === "confirmed" && deadline.value) return `Deadline ${deadline.value}`;
  /*
   * The seed stores the master's own words as the label -- "To be confirmed" --
   * so a bare label is prefixed to read as a deadline; one that already says
   * so is left alone.
   */
  const label = deadline?.pendingLabel?.trim();
  if (!label) return FALLBACK_DEADLINE;
  return /^deadline\b/i.test(label) ? label : `Deadline ${label.toLowerCase()}`;
}

/** True while nothing has been confirmed, so the line is shown as a marker. */
export function deadlinePending(deadline: ConfirmableValue | null | undefined): boolean {
  return !(deadline?.status === "confirmed" && deadline.value);
}

/**
 * The careers inbox, found by its label. Highland took the third address in
 * the list by position, which breaks the day an editor reorders the emails
 * in the admin; this does not.
 */
export function hrEmail(contact: Pick<ContactDetail, "emails">): string | undefined {
  return (contact.emails ?? []).find((e) => e.label.trim().toLowerCase() === "careers")?.value;
}

const LEVEL_ACCENT: Record<string, string> = { Executive: "#056a9a" };
const accentFor = (level: string) => LEVEL_ACCENT[level] ?? "#0888c5";

/** One vacancy, linked to its own page through the route map. */
export function jobRow(j: Job) {
  const c = accentFor(j.level);
  const pending = deadlinePending(j.deadline);
  return (
    <li key={j.slug}>
      <Link
        href={routeFor(`job-${j.slug}.html`)}
        className="eg-inview group grid gap-x-10 gap-y-5 border-t border-rule py-9 lg:grid-cols-[1fr_15rem]"
      >
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: c }}>
            {`${j.department} · ${j.level}`}
          </p>
          <h3 className="mt-2.5 font-display text-[clamp(1.3rem,2.3vw,1.8rem)] leading-snug group-hover:text-gold">
            {j.title}
          </h3>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink/70">{j.purpose}</p>
          <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-widest text-steel">
            <span>{j.type}</span>
            <span>{j.location}</span>
            <span>{`Reports to ${j.reports}`}</span>
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 lg:items-end">
          <span
            className="rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-widest"
            style={{ background: `${c}16`, color: c }}
          >
            {j.status}
          </span>
          {pending ? (
            <Pending>{deadlineText(j.deadline)}</Pending>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-widest text-steel">
              {deadlineText(j.deadline)}
            </span>
          )}
          <span className="font-mono text-[10px] uppercase tracking-widest text-gold">
            View role and apply &rarr;
          </span>
        </div>
      </Link>
    </li>
  );
}

/**
 * The vacancy list, or an honest empty state.
 *
 * There are two roles today and an editor can unpublish both; a blank list
 * under a heading that promises roles would read as a broken page.
 */
export function PositionsList({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) {
    return (
      <p className="rounded-2xl bg-paper-2 px-6 py-5 text-sm text-steel">
        There are no open positions right now. Register your interest below and we will review your
        details when a relevant role opens.
      </p>
    );
  }
  return <ul>{jobs.map(jobRow)}</ul>;
}

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

type Intake = {
  schedule?: ConfirmableValue | null;
  deadline?: ConfirmableValue | null;
};

const schedulePending = (schedule: ConfirmableValue | null | undefined) =>
  !(schedule?.status === "confirmed" && schedule.value);

/**
 * The internship hero's two facts. Each is a marker only while it is
 * unconfirmed: once Edge sets a date it reads as plain text, in its own case,
 * rather than staying a "pending" pill with the date lowercased inside it.
 */
export function internshipPills(i: Intake) {
  const label = i.schedule?.pendingLabel?.trim() || "Dates and working schedule to be confirmed";
  const deadline = `Application ${lowerFirst(deadlineText(i.deadline))}`;
  return (
    <>
      {schedulePending(i.schedule) ? (
        <Pending>{`Intake dates ${label.toLowerCase().replace(/^dates and working schedule /, "")}`}</Pending>
      ) : null}
      {deadlinePending(i.deadline) ? (
        <Pending>{deadline}</Pending>
      ) : (
        <span className="font-mono text-[10px] uppercase tracking-widest text-steel">{deadline}</span>
      )}
    </>
  );
}

/** The careers hub's intake marker: shown until the schedule is confirmed, then gone. */
export function intakeNote(schedule: ConfirmableValue | null | undefined) {
  return schedulePending(schedule) ? <Pending>Internship intake dates to be confirmed</Pending> : null;
}
