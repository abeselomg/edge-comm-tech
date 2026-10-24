import Link from "next/link";
import { Mark } from "@/components/ui";
import { SECTOR_OPTIONS, type SectorSlug } from "@/fields/sectors";
import { projectHref, publishedOnly, solutionHref } from "@/lib/routes";
import type { Project, Solution } from "@/payload-types";

/*
 * The client directory's own pieces, beside page.tsx because Next allows a
 * page only its known exports.
 */

/**
 * Group clients by the three approved sectors, in the approved order. A sector
 * with no clients is left out rather than printed as an empty section.
 */
export function bySector<C extends { sector: string }>(
  clients: C[],
): Partial<Record<SectorSlug, C[]>> {
  const out: Partial<Record<SectorSlug, C[]>> = {};
  for (const { value } of SECTOR_OPTIONS) {
    const members = clients.filter((c) => c.sector === value);
    if (members.length) out[value] = members;
  }
  return out;
}

export const SECTOR_ACCENT: Record<SectorSlug, string> = {
  education: "#2ba8de",
  banking: "#056a9a",
  government: "#0b6fa8",
};

/** A project's year, or the short pending form the directory has always used. */
function yearLabel(year: Project["year"]): string {
  if (!year || year.status === "pending") return "Year TBC";
  return year.value || "Year TBC";
}

type ClientCardData = {
  name: string;
  summary: string;
  logo: Parameters<typeof Mark>[0]["item"]["logo"];
  engagements?: unknown[] | null;
  solutions?: unknown[] | null;
};

export function clientCard(c: ClientCardData) {
  const work = publishedOnly<Project>((c.engagements ?? []) as never[]);
  const solutions = publishedOnly<Solution>((c.solutions ?? []) as never[]);
  return (
    <article
      key={c.name}
      className="eg-inview grid gap-7 border-t border-rule py-9 lg:grid-cols-[11rem_1fr]"
    >
      <div className="flex h-20 w-full max-w-[11rem] items-center justify-center rounded-2xl border border-rule bg-paper-2 px-4">
        <Mark item={c} h="h-11" />
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-xl leading-snug">{c.name}</h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">{c.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {solutions.map((s) => (
            <Link
              key={s.slug}
              href={solutionHref(s.slug)}
              className="rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest transition hover:brightness-95"
              style={{ background: `${s.accent}16`, color: s.accent }}
            >
              {s.short}
            </Link>
          ))}
        </div>
        {work.length ? (
          <ul className="mt-5 space-y-1.5">
            {work.map((p) => (
              <li key={p.slug}>
                <Link
                  href={projectHref(p.slug)}
                  className="group flex items-baseline justify-between gap-4 rounded-xl bg-paper-2 px-4 py-2.5"
                >
                  <span className="text-[13px] group-hover:text-gold">{p.title}</span>
                  <span className="shrink-0 font-mono text-[9px] uppercase tracking-widest text-steel">
                    {yearLabel(p.year)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 text-[13px] text-steel">
            Engagement details are not published for this institution.
          </p>
        )}
      </div>
    </article>
  );
}
