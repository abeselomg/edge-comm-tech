import Link from "next/link";
import { ClosingCta, CtaRow, PageHead, SectionHead } from "@/components/ui";
import { SECTOR_OPTIONS } from "@/fields/sectors";
import { getProjects, getSiteSettings, getSolutions } from "@/lib/content";
import { publishedOnly, solutionHref } from "@/lib/routes";
import { bySector } from "../clients/client-parts";
import { projectsFor } from "../solutions/solution-parts";
import { FeaturedProject, heroProject, ProjectRow } from "./project-parts";

/*
 * Project index.
 *
 * Eight documented engagements, grouped by the same three sectors the clients
 * page uses. No filter UI here -- eight records across three sectors read better
 * as a grouped index, and the partners page is where filtering earns its keep.
 *
 * The 67+ figure and the eight detailed records are different claims and are
 * presented as such: the counter says how many projects Edge has delivered, the
 * index says which ones are documented for publication.
 */

export const metadata = {
  title: "Technology Projects and Case Studies — Edge Comm-Tech",
  description:
    "Delivered technology projects across Ethiopian banks, universities and government institutions — smart classrooms, computing infrastructure, backup, CCTV, datacenter and power solutions.",
};

export default async function ProjectsPage() {
  const [projects, settings, solutions] = await Promise.all([
    getProjects(),
    getSiteSettings(),
    getSolutions(),
  ]);
  const published = publishedOnly(projects);
  const groups = bySector(published);

  return (
    <main>
      <PageHead
        eyebrow="Projects"
        title="Delivered in environments that cannot afford downtime"
        intro="Edge Comm-Tech has executed and delivered more than 67 projects for banks, universities, ministries and major enterprises. The engagements documented below show how our solutions and services work in practice."
        accent="#0b6fa8"
        variant="wash"
        ctas={
          <CtaRow
            primary={{ href: "/contact", label: "Discuss a similar project" }}
            secondary={{ href: "/clients", label: "See who we work with" }}
          />
        }
      />

      {/* Counters, then the featured engagement as the one wide card. */}
      {(settings.impact ?? []).length ? (
        <section className="border-b border-rule bg-paper-2/40">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {(settings.impact ?? []).map((m) => (
                <div key={m.figure} className="eg-inview">
                  <dt className="font-display text-[clamp(2rem,4vw,2.9rem)] leading-none text-gold">
                    {m.figure}
                  </dt>
                  <dd className="mt-2 font-mono text-[10px] uppercase tracking-widest text-steel">
                    {m.unit}
                  </dd>
                  <dd className="mt-1 text-[13px] leading-snug text-ink/65">{m.line}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      <FeaturedProject project={heroProject(published)} />

      {/* Grouped index, one section per sector */}
      {SECTOR_OPTIONS.map(({ value, label }) => {
        const list = groups[value];
        if (!list) return null;
        return (
          <section key={value} className="border-t border-rule">
            <div className="mx-auto max-w-6xl px-6 py-16">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="font-display text-[clamp(1.5rem,2.8vw,2.1rem)]">{label}</h2>
                <p className="font-mono text-[10px] uppercase tracking-widest text-steel">
                  {`${list.length} project${list.length > 1 ? "s" : ""}`}
                </p>
              </div>
              <ul className="mt-8">
                {list.map((p) => (
                  <ProjectRow key={p.slug} project={p} />
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      <section className="border-t border-rule bg-paper-2/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <SectionHead
            eyebrow="By solution family"
            title="Find the experience closest to your requirement"
          />
          <ul className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s) => {
              const n = projectsFor(published, s.slug).length;
              return (
                <li key={s.slug}>
                  <Link
                    href={solutionHref(s.slug)}
                    className="eg-inview flex items-center justify-between gap-4 rounded-2xl bg-paper px-5 py-4 transition hover:text-gold"
                  >
                    <span className="text-sm">{s.short}</span>
                    <span
                      className="shrink-0 font-mono text-[10px] uppercase tracking-widest"
                      style={{ color: s.accent }}
                    >
                      {n ? `${n} project${n > 1 ? "s" : ""}` : "Explore"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <ClosingCta
        title="Your project could be the next one here"
        body="Share your requirement and constraints. We will tell you honestly what the work involves and how we would deliver it."
        primary={{ href: "/contact", label: "Start a conversation" }}
        secondary={{ href: "/solutions", label: "Explore solutions" }}
        accent="#0b6fa8"
      />
    </main>
  );
}
