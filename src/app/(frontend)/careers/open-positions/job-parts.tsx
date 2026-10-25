import Link from "next/link";
import { LiveForm } from "@/components/forms/LiveForm";
import { Confirmable, SectionHead } from "@/components/ui";
import { jobOpen } from "@/lib/jobs";
import { jobHref, publishedOnly } from "@/lib/routes";
import type { Form, Job } from "@/payload-types";
import { deadlinePending, deadlineText } from "../careers-parts";

/*
 * The vacancy page's own pieces, beside the page because Next allows a page only
 * its known exports.
 *
 * Required and preferred qualifications stay separate as the document requires.
 * No salary, benefit or employment condition appears: none has been approved for
 * publication, and no field holds one.
 */

const accentFor = (j: Job) => (j.level === "Executive" ? "#056a9a" : "#0888c5");
export { accentFor };

export function JobHeader({ job: j }: { job: Job }) {
  const cells: [string, React.ReactNode][] = [
    ["Department", j.department],
    ["Career level", j.level],
    ["Reports to", j.reports],
    ["Employment type", j.type],
    ["Status", j.status],
    [
      "Deadline",
      deadlinePending(j.deadline) ? (
        <Confirmable key="d" value={j.deadline} />
      ) : (
        deadlineText(j.deadline).replace(/^Deadline /, "")
      ),
    ],
  ];
  return (
    <div className="mx-auto max-w-6xl px-6">
      <dl className="eg-rise -mt-9 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule shadow-[0_20px_50px_-40px_rgb(28_36_48/0.6)] sm:grid-cols-3 lg:grid-cols-6">
        {cells.map(([k, v]) => (
          <div key={k} className="bg-paper-2 px-5 py-4">
            <dt className="font-mono text-[9px] uppercase tracking-widest text-steel">{k}</dt>
            <dd className="mt-1.5 text-sm leading-snug">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs text-steel">{j.location}</p>
    </div>
  );
}

function BulletList({ items, accent }: { items: { item: string }[]; accent: string }) {
  return (
    <ul className="mt-5 space-y-2.5">
      {items.map((x) => (
        <li
          key={x.item}
          className="eg-inview flex items-start gap-3 text-sm leading-relaxed text-ink/80"
        >
          <span
            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: accent }}
          />
          <span>{x.item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Purpose, responsibilities, required, preferred and success. An empty list opens no section. */
export function JobSections({ job: j, accent }: { job: Job; accent: string }) {
  const lists: [string, string, { item: string }[] | null | undefined][] = [
    ["Responsibilities", "What the role owns", j.responsibilities],
    ["Required", "Qualifications and experience", j.required],
    ["Preferred", "What strengthens an application", j.preferred],
  ];
  return (
    <>
      <section>
        <SectionHead eyebrow="Role purpose" title={j.purposeTitle} accent={accent} />
        <p className="mt-5 text-lg leading-relaxed text-ink/80">{j.purpose}</p>
        {j.scope ? <p className="mt-4 leading-relaxed text-ink/75">{j.scope}</p> : null}
      </section>

      {lists.map(([eyebrow, title, items]) =>
        items?.length ? (
          <section key={eyebrow} className="mt-14">
            <SectionHead eyebrow={eyebrow} title={title} accent={accent} />
            <BulletList items={items} accent={accent} />
          </section>
        ) : null,
      )}

      {j.success ? (
        <section className="mt-14 rounded-3xl p-8" style={{ background: `${accent}0e` }}>
          <SectionHead
            eyebrow="Success in the role"
            title="How performance will be judged"
            accent={accent}
          />
          <p className="mt-4 leading-relaxed text-ink/80">{j.success}</p>
        </section>
      ) : null}
    </>
  );
}

/** The application: the live form while the job takes applications, a closed note once it does not. */
export function ApplyPanel({
  job: j,
  accent,
  email,
  form,
}: {
  job: Job;
  accent: string;
  email?: string;
  form?: Form | null;
}) {
  const open = jobOpen(j);
  return (
    <section className="mt-14" id="apply">
      <SectionHead eyebrow="Apply" title={`Apply for ${j.title}`} accent={accent} />
      {!open ? (
        <p className="mt-7 rounded-2xl bg-paper-2 px-5 py-4 text-sm text-ink/80">
          Applications for this position have closed.
        </p>
      ) : form ? (
        <LiveForm
          form={form}
          action="/forms/job-application"
          submitLabel="Submit application"
          accent={accent}
          email={email}
          hidden={{ job: j.slug }}
        />
      ) : null}
      {open ? (
        <p className="mt-4 text-xs text-steel">
          {"Applications are acknowledged with a reference number and routed to "}
          {email ? (
            <a
              href={`mailto:${email}`}
              className="underline decoration-rule underline-offset-2 hover:text-gold"
            >
              {email}
            </a>
          ) : (
            "our HR team"
          )}
          {". Our HR team contacts candidates selected for the next stage."}
        </p>
      ) : null}
    </section>
  );
}

export function JobAside({
  job: j,
  others,
  docs,
  accent,
}: {
  job: Job;
  others: Job[];
  docs: { item: string }[];
  accent: string;
}) {
  const other = publishedOnly<Job>(others).find((o) => o.slug !== j.slug);
  return (
    <aside className="self-start lg:sticky lg:top-32">
      <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>
        Documents required
      </p>
      <ul className="mt-3 space-y-1.5">
        {docs.map((x) => (
          <li key={x.item} className="rounded-xl bg-paper-2 px-4 py-2.5 text-sm text-ink/75">
            {x.item}
          </li>
        ))}
      </ul>
      <a
        href="#apply"
        className="mt-6 block rounded-full px-5 py-3 text-center text-sm font-semibold text-white"
        style={{ background: accent }}
      >
        Apply now
      </a>
      {other ? (
        <>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-widest text-steel">
            Also open
          </p>
          <Link
            href={jobHref(other.slug)}
            className="mt-3 block rounded-2xl bg-paper-2 p-4 transition hover:text-gold"
          >
            <span className="block font-display text-base">{other.title}</span>
            <span className="mt-1 block text-xs text-steel">{other.department}</span>
          </Link>
        </>
      ) : null}
      <Link
        href="/careers"
        className="mt-4 block rounded-2xl border border-rule p-4 text-sm transition hover:border-gold hover:text-gold"
      >
        Not the right role? Join the talent community
      </Link>
    </aside>
  );
}
