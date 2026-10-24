import Link from "next/link";
import { ClosingCta, CtaRow, PageHead, SectionHead } from "@/components/ui";
import {
  getCompany,
  getPageCopy,
  getProjects,
  getServices,
  getSolutions,
} from "@/lib/content";
import { projectHref, publishedOnly, serviceHref, solutionHref } from "@/lib/routes";
import { clientOf } from "../projects/project-parts";
import { projectsFor } from "./solution-parts";

/*
 * Solutions and services overview.
 *
 * The content master gives this page its own five technology priorities and its
 * own six-step delivery framework, both different from the homepage's. They are
 * kept as this page's copy rather than shared, because collapsing them would put
 * the wrong wording on one of the two pages.
 *
 * The project count on each family is computed from the published projects, so
 * it can never drift from the project records.
 */

export const metadata = {
  title: "Technology Solutions and Services in Ethiopia — Edge Comm-Tech",
  description:
    "Explore Edge Comm-Tech solutions across enterprise networks, cloud, datacenters, cybersecurity, software, AI, power, broadcast, and satellite technologies.",
};

const pad = (n: number) => String(n).padStart(2, "0");

export default async function SolutionsPage() {
  const [copy, company, solutions, services, projects] = await Promise.all([
    getPageCopy(),
    getCompany(),
    getSolutions(),
    getServices(),
    getProjects(),
  ]);
  const hero = copy.solutionsHero;
  const published = publishedOnly(projects);

  return (
    <main>
      <PageHead
        eyebrow={hero?.eyebrow}
        title={hero?.title ?? "Solutions and services"}
        intro={hero?.intro}
        accent="#0888c5"
        variant="grid"
        ctas={
          <CtaRow
            primary={{ href: "/contact", label: "Talk to our experts" }}
            secondary={{ href: "#industries", label: "Explore solutions by industry" }}
          />
        }
      />

      <section className="mx-auto max-w-4xl px-6 py-16">
        <SectionHead
          eyebrow="Our approach"
          title="From individual technologies to one operational ecosystem"
        />
        <p className="mt-6 text-lg leading-relaxed text-ink/80">
          A successful transformation depends on more than selecting products. Networks must
          support applications. Datacenter facilities must provide resilient environments for
          critical systems. IT infrastructure must connect, monitor, and protect physical
          operations. Cybersecurity must protect cloud services, networks, applications, endpoints,
          identities, operations, perimeters, and data. Power must sustain critical operations.
          Software and AI must connect to trusted information and existing workflows.
        </p>
        <p className="mt-4 leading-relaxed text-ink/70">
          Edge Comm-Tech brings these requirements together through assessment, design, sourcing,
          implementation, integration, testing, training, support, and continuous improvement.
        </p>
      </section>

      {/* The seven families, as a ledger rather than a card grid. */}
      <section className="border-y border-rule bg-paper-2/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHead eyebrow="Solution portfolio" title="Seven integrated solution families" />
          <ul className="mt-10">
            {solutions.map((s) => {
              const n = projectsFor(published, s.slug).length;
              return (
                <li key={s.slug}>
                  <Link
                    href={solutionHref(s.slug)}
                    className="eg-inview group grid gap-x-8 gap-y-3 border-t border-rule py-8 transition lg:grid-cols-[4rem_1fr_9rem]"
                  >
                    <span
                      className="font-display text-3xl leading-none"
                      style={{ color: s.accent }}
                    >
                      {pad(s.order)}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-[clamp(1.3rem,2.2vw,1.85rem)] leading-snug group-hover:text-gold">
                        {s.title}
                      </span>
                      <span className="mt-2 block max-w-2xl text-sm leading-relaxed text-ink/70">
                        {s.blurb}
                      </span>
                    </span>
                    <span className="flex flex-col items-start gap-2 lg:items-end lg:text-right">
                      {n ? (
                        <span
                          className="rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-widest"
                          style={{ background: `${s.accent}14`, color: s.accent }}
                        >
                          {`${n} project${n > 1 ? "s" : ""}`}
                        </span>
                      ) : null}
                      <span className="font-mono text-[10px] uppercase tracking-widest text-gold">
                        Explore &rarr;
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Professional services */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionHead
              eyebrow="Professional services"
              title="Services that turn technology into operational value"
              intro="Services can support a focused requirement or an integrated multi-technology program."
            />
          </div>
          <Link
            href="/services"
            className="rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold"
          >
            Explore our service model
          </Link>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={serviceHref(s.slug)}
              className="eg-inview group flex flex-col rounded-2xl bg-paper-2 p-6 transition hover:-translate-y-1"
            >
              <span
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: s.accent }}
              >
                {`Service ${pad(s.order)}`}
              </span>
              <h3 className="mt-1.5 font-display text-lg leading-snug group-hover:text-gold">
                {s.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">{s.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Technology priorities */}
      <section className="border-t border-rule bg-paper-2/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHead
            eyebrow="Technology priorities"
            title="Designed for current needs and future change"
          />
          <div className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {(copy.solutionsPriorities ?? []).map((p, i) => (
              <div key={p.title} className="eg-inview border-t border-rule pt-5">
                <span className="font-mono text-[10px] text-gold">{pad(i + 1)}</span>
                <h3 className="mt-1.5 font-display text-xl">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry solutions */}
      <section id="industries" className="mx-auto max-w-6xl px-6 py-20">
        <SectionHead
          eyebrow="Industry solutions"
          title="Technology aligned with sector priorities"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {(company.industries ?? []).map((s) => (
            <article
              key={s.title}
              className="eg-inview rounded-2xl border border-rule p-7 transition hover:border-gold"
            >
              <h3 className="font-display text-xl">{s.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink/70">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Delivery framework */}
      <section className="border-t border-rule">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHead
            eyebrow="Delivery framework"
            title="One accountable partner across the lifecycle"
          />
          <ol className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-rule sm:grid-cols-2 lg:grid-cols-3">
            {(copy.solutionsFramework ?? []).map((s, i) => (
              <li key={s.title} className="eg-inview bg-paper-2 p-7">
                <span className="font-display text-3xl text-gold/25">{pad(i + 1)}</span>
                <h3 className="mt-2 font-display text-lg">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Featured experience */}
      <section className="border-t border-rule bg-paper-2/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHead
            eyebrow="Featured experience"
            title="Solutions proven in critical environments"
            intro="Relevant experience includes Bahir Dar University smart classrooms and CCTV, Gadaa Bank computing infrastructure, National Bank of Ethiopia backup systems, Ministry of Urban and Infrastructure computing, Siinqee Bank power and datacenter-related solutions, Zemen Bank generators, Arba Minch University smart meeting rooms, and Ethiopian Securities Exchange database software."
          />
          <ul className="mt-9 flex flex-wrap gap-2">
            {published.map((p) => {
              const client = clientOf(p)?.name;
              return (
                <li key={p.slug}>
                  <Link
                    href={projectHref(p.slug)}
                    className="block rounded-full bg-paper-2 px-4 py-2 text-xs transition hover:text-gold"
                  >
                    {[client, p.primary].filter(Boolean).join(" · ")}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <ClosingCta
        title="Tell us what you need to deliver"
        body="Share your goals, constraints and existing environment. Our team will help define a practical, interoperable solution pathway."
        primary={{ href: "/contact", label: "Request a consultation" }}
        secondary={{ href: "/projects", label: "Explore our projects" }}
      />
    </main>
  );
}
