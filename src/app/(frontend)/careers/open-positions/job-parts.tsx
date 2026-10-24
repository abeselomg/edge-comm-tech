import Link from "next/link";
import { Confirmable, Field, FormNote, SectionHead } from "@/components/ui";
import { jobHref, publishedOnly } from "@/lib/routes";
import type { Job } from "@/payload-types";
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

const APPLICATION_FIELDS: Parameters<typeof Field>[0][] = [
  { label: "Full legal name", required: true },
  { label: "Email address", type: "email", required: true },
  { label: "Mobile number", required: true },
  { label: "City and country of residence", required: true },
  { label: "Current or most recent position", required: true },
  {
    label: "Years of relevant experience",
    type: "select",
    options: ["Select", "0–2", "3–5", "6–10", "More than 10"],
  },
  {
    label: "Highest education",
    type: "select",
    options: ["Select", "Diploma", "Bachelor's degree", "Postgraduate"],
  },
  { label: "Field of study", required: true },
  { label: "University or institution", required: true },
  { label: "LinkedIn or portfolio URL" },
  { label: "CV upload", required: true, wide: true, hint: "PDF or DOCX" },
];

/** The application, as an inert shell until Phase 6 wires submissions. */
export function ApplyPanel({
  job: j,
  accent,
  email,
}: {
  job: Job;
  accent: string;
  email?: string;
}) {
  return (
    <section className="mt-14" id="apply">
      <SectionHead eyebrow="Apply" title={`Apply for ${j.title}`} accent={accent} />
      <form className="mt-7 grid gap-5 sm:grid-cols-2">
        {APPLICATION_FIELDS.map((f) => (
          <Field key={f.label} {...f} />
        ))}
        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-xs text-steel">
            <input type="checkbox" className="mt-0.5" disabled />
            <span>
              I confirm the information provided is accurate and accept the privacy notice and
              consent to recruitment processing.
            </span>
          </label>
        </div>
        <div className="sm:col-span-2">
          <button
            type="button"
            className="rounded-full px-6 py-3 text-sm font-semibold text-white opacity-60"
            style={{ background: accent }}
            disabled
          >
            Submit application
          </button>
        </div>
      </form>
      <FormNote email={email} />
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
