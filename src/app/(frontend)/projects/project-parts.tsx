import Link from "next/link";
import { Confirmable, Mark, SectionHead } from "@/components/ui";
import { SECTOR_SHORT, type SectorSlug } from "@/fields/sectors";
import { projectHref, publishedOnly, solutionHref } from "@/lib/routes";
import type { Client, Partner, Project, Solution } from "@/payload-types";

/*
 * The project pages' own pieces, beside the pages because Next allows a page
 * only its known exports.
 *
 * These are case studies, not datasheets: context, then what was delivered,
 * then the result. The facts panel carries no contract value, quantity or
 * capacity -- none has been supplied as a verified figure -- and project
 * records say "security control room", never "SOC".
 */

type Ref<T> = T | number | string | null | undefined;
const doc = <T extends object>(r: Ref<T>): T | null => (r && typeof r === "object" ? r : null);

/** Accent by sector, as the detail pages colour themselves (not the clients page's). */
export const PROJECT_SECTOR_ACCENT: Record<SectorSlug, string> = {
  education: "#0888c5",
  banking: "#056a9a",
  government: "#0b6fa8",
};
export const accentFor = (p: Project): string => PROJECT_SECTOR_ACCENT[p.sector] ?? "#0888c5";

const clientOf = (p: Project) => doc<Client>(p.client as Ref<Client>);
const solutionsOf = (p: Project) =>
  publishedOnly<Solution>((p.solutions ?? []) as (Solution | number)[]);
const pad = (n: number) => String(n).padStart(2, "0");

/** The featured engagement: the first featured project in order, else the first. */
export function heroProject(projects: Project[]): Project | null {
  return projects.find((p) => p.featured) ?? projects[0] ?? null;
}

/** Up to three other published projects in the same sector. */
export function siblingProjects(projects: Project[], current: Project): Project[] {
  return publishedOnly<Project>(projects)
    .filter((p) => p.slug !== current.slug && p.sector === current.sector)
    .slice(0, 3);
}

export function ProjectFacts({ project: p }: { project: Project }) {
  const client = clientOf(p);
  const facts: [string, React.ReactNode][] = [
    ["Client", client?.name ?? ""],
    ["Sector", p.sectorFull ?? ""],
    ["Location", p.location],
    ["Completion", <Confirmable key="y" value={p.year} />],
    ["Status", "Completed"],
    ["Technology", (p.tech ?? []).map((t) => t.item).join(", ")],
  ];
  return (
    <div className="mx-auto max-w-6xl px-6">
      <dl className="eg-rise -mt-9 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule shadow-[0_20px_50px_-40px_rgb(28_36_48/0.6)] sm:grid-cols-3 lg:grid-cols-6">
        {facts.map(([k, v]) => (
          <div key={k} className="bg-paper-2 px-5 py-4">
            <dt className="font-mono text-[9px] uppercase tracking-widest text-steel">{k}</dt>
            <dd className="mt-1.5 text-sm leading-snug">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Chip({ s }: { s: Solution }) {
  return (
    <span
      className="rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest"
      style={{ background: `${s.accent}16`, color: s.accent }}
    >
      {s.short}
    </span>
  );
}

/** One index row. The year is rendered as given; an unconfirmed one says so. */
export function ProjectRow({ project: p }: { project: Project }) {
  const solutions = solutionsOf(p);
  const client = clientOf(p);
  const tech = (p.tech ?? []).map((t) => t.item);
  return (
    <li>
      <Link
        href={projectHref(p.slug)}
        className="eg-inview group grid gap-x-10 gap-y-4 border-t border-rule py-9 lg:grid-cols-[13rem_1fr]"
      >
        <div className="shrink-0">
          <span
            className="block font-mono text-[10px] uppercase tracking-widest"
            style={{ color: solutions[0]?.accent }}
          >
            {client?.name}
          </span>
          <span className="mt-1.5 block text-xs text-steel">
            <Confirmable value={p.year} />
          </span>
          <span className="mt-1 block text-xs text-steel">{p.location}</span>
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-[clamp(1.25rem,2.1vw,1.7rem)] leading-snug group-hover:text-gold">
            {p.title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">{p.summary}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {solutions.map((s) => (
              <Chip key={s.slug} s={s} />
            ))}
            {tech.length ? (
              <span className="font-mono text-[9px] uppercase tracking-widest text-steel">
                {tech.join(" · ")}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </li>
  );
}

/** The one wide card on the index, or nothing when there are no projects. */
export function FeaturedProject({ project: p }: { project: Project | null }) {
  if (!p) return null;
  const solutions = solutionsOf(p);
  const client = clientOf(p);
  const accent = solutions[0]?.accent;
  const cells: [string, React.ReactNode][] = [
    ["Client", client?.name ?? ""],
    ["Sector", p.sectorFull ?? ""],
    ["Period", <Confirmable key="y" value={p.year} />],
    ["Location", p.location],
    ["Focus", p.primary],
    ["Technologies", (p.tech ?? []).map((t) => t.item).join(", ")],
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <SectionHead eyebrow="Featured engagement" title={p.title} accent={accent} />
      <Link
        href={projectHref(p.slug)}
        className="eg-inview group mt-8 grid overflow-hidden rounded-3xl border border-rule transition hover:border-gold lg:grid-cols-[1.15fr_1fr]"
      >
        <div className="p-9">
          <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>
            {`${client?.name ?? ""} · ${p.sectorFull ?? ""}`}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink/80">{p.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {solutions.map((s) => (
              <Chip key={s.slug} s={s} />
            ))}
          </div>
          <span className="mt-7 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gold">
            Read the project <span aria-hidden="true">&rarr;</span>
          </span>
        </div>
        <dl className="grid grid-cols-2 gap-px bg-rule">
          {cells.map(([k, v]) => (
            <div key={k} className="bg-paper-2 px-6 py-5">
              <dt className="font-mono text-[9px] uppercase tracking-widest text-steel">{k}</dt>
              <dd className="mt-1.5 text-sm leading-snug">{v}</dd>
            </div>
          ))}
        </dl>
      </Link>
    </section>
  );
}

/** The case study's column: need, scope, delivery, implementation, result, technology. */
export function ProjectBody({
  project: p,
  siblings,
  implementationNote,
  brands = [],
}: {
  project: Project;
  siblings: Project[];
  implementationNote: string;
  brands?: Partner[];
}) {
  const c = accentFor(p);
  const solutions = solutionsOf(p);
  const client = publishedOnly<Client>([clientOf(p)])[0];
  const scope = p.scope ?? [];
  const delivered = p.delivered ?? [];
  const outcomes = p.outcomes ?? [];
  const tech = p.tech ?? [];
  const brandFor = (name: string) => brands.find((b) => b.name === name) ?? { name, logo: null };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <section>
        <SectionHead eyebrow="Client context" title="The need" accent={c} />
        <p className="mt-5 text-lg leading-relaxed text-ink/80">{p.need}</p>
      </section>

      {scope.length ? (
        <section className="mt-14">
          <SectionHead eyebrow="Project scope" title="What Edge Comm-Tech delivered" accent={c} />
          <ul className="mt-6 space-y-2.5">
            {scope.map((x, i) => (
              <li key={x.item} className="eg-inview flex gap-4 rounded-2xl bg-paper-2 px-5 py-4 text-sm">
                <span className="pt-0.5 font-mono text-[10px]" style={{ color: c }}>
                  {pad(i + 1)}
                </span>
                <span className="text-ink/80">{x.item}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {delivered.length ? (
        <section className="mt-14">
          <SectionHead
            eyebrow="Delivered solution"
            title="An integrated operational solution"
            accent={c}
          />
          <div className="mt-6 space-y-3">
            {delivered.map((b) => (
              <article
                key={b.title}
                className="eg-inview rounded-2xl border-l-2 bg-paper-2 py-5 pl-6 pr-6"
                style={{ borderColor: c }}
              >
                <h3 className="font-display text-lg">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{b.body}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-14">
        <SectionHead
          eyebrow="Implementation"
          title="From assessment to operational handover"
          accent={c}
        />
        <p className="mt-5 leading-relaxed text-ink/75">{implementationNote}</p>
      </section>

      {outcomes.length ? (
        <section className="mt-14 rounded-3xl p-8" style={{ background: `${c}0e` }}>
          <SectionHead eyebrow="Outcomes" title="The result" accent={c} />
          <ul className="mt-6 space-y-3">
            {outcomes.map((x) => (
              <li key={x.item} className="flex items-start gap-3 text-sm leading-relaxed text-ink/80">
                <svg
                  viewBox="0 0 24 24"
                  className="mt-0.5 h-4 w-4 shrink-0"
                  fill="none"
                  stroke={c}
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
      ) : null}

      <section className="mt-14 grid gap-8 border-t border-rule pt-10 sm:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: c }}>
            Technology
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink/75">{p.technology}</p>
          {tech.length ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {tech.map((t) => (
                <li
                  key={t.item}
                  className="grid h-11 min-w-[6rem] place-items-center rounded-xl bg-paper-2 px-3"
                >
                  <Mark item={brandFor(t.item) as never} h="h-7" />
                </li>
              ))}
            </ul>
          ) : null}
          {p.technologyNote ? (
            <p className="mt-3 text-[11px] leading-relaxed text-steel">{p.technologyNote}</p>
          ) : null}
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: c }}>
            Training and handover
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink/75">{p.training}</p>
        </div>
      </section>

      {p.privacy ? (
        <p className="mt-8 flex items-start gap-2.5 rounded-2xl bg-paper-2 px-6 py-5 text-xs leading-relaxed text-steel">
          <svg
            viewBox="0 0 24 24"
            className="mt-0.5 h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8h.01M11 12h1v4h1" />
          </svg>
          <span>{p.privacy}</span>
        </p>
      ) : null}

      {solutions.length || client ? (
        <section className="mt-14 border-t border-rule pt-10">
          <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: c }}>
            Related capability
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {solutions.map((s) => (
              <li key={s.slug}>
                <Link
                  href={solutionHref(s.slug)}
                  className="block rounded-full px-4 py-2 text-xs font-semibold transition hover:-translate-y-0.5"
                  style={{ background: `${s.accent}14`, color: s.accent }}
                >
                  {s.short}
                </Link>
              </li>
            ))}
            {client ? (
              <li>
                <Link
                  href="/clients"
                  className="block rounded-full border border-rule px-4 py-2 text-xs font-semibold transition hover:border-gold hover:text-gold"
                >
                  {`All ${client.name} work`}
                </Link>
              </li>
            ) : null}
          </ul>
        </section>
      ) : null}

      {siblings.length ? (
        <section className="mt-12">
          <p className="font-mono text-[10px] uppercase tracking-widest text-steel">
            {`More in ${SECTOR_SHORT[p.sector]?.toLowerCase() ?? p.sector}`}
          </p>
          <ul className="mt-4 divide-y divide-rule border-y border-rule">
            {siblings.map((s) => (
              <li key={s.slug}>
                <Link
                  href={projectHref(s.slug)}
                  className="group flex items-baseline justify-between gap-4 py-4"
                >
                  <span className="font-display text-base group-hover:text-gold">{s.title}</span>
                  <span className="shrink-0 font-mono text-xs text-steel">
                    <Confirmable value={s.year} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
