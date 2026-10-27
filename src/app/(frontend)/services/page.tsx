import { buildMetadata } from "@/lib/seo/metadata";
import { ClosingCta, CtaRow, PageHead, SectionHead } from "@/components/ui";
import { getCompany, getServices } from "@/lib/content";
import { ServiceChapter } from "./service-parts";

/*
 * Professional services overview.
 *
 * The solutions overview is a catalogue, so this page is a sequence: the
 * delivery stages run across the top as a rail, and the six services are read
 * as chapters, alternating side so the page does not scan as six more cards.
 */

const DARK = "#003D6B";

export const metadata = buildMetadata({
  title: "Professional Technology Services in Ethiopia — Edge Comm-Tech",
  description:
    "Advisory, procurement, implementation, project management, managed support and training services from Edge Comm-Tech across the full technology lifecycle.",
  path: "/services",
});

const ENGAGEMENTS = [
  [
    "A single service",
    "One defined piece of work — an assessment, a procurement, a training program — with its own scope and acceptance.",
  ],
  [
    "A full delivery",
    "Advisory through support on one solution family, managed under a single project governance structure.",
  ],
  [
    "A multi-technology program",
    "Several solution families coordinated together, with one accountable delivery team across all of them.",
  ],
] as const;

export default async function ServicesPage() {
  const [company, services] = await Promise.all([getCompany(), getServices()]);
  const stages = company.delivery ?? [];

  return (
    <main>
      <PageHead
        eyebrow="Professional services"
        title="Services that turn technology into operational value"
        intro="Technology delivers value when it is correctly specified, properly sourced, carefully implemented, well managed, reliably supported and genuinely understood by the people who use it. Edge Comm-Tech provides services across that entire lifecycle."
        accent="#056a9a"
        variant="beam"
        ctas={
          <CtaRow
            primary={{ href: "/contact", label: "Request a consultation" }}
            secondary={{ href: "/solutions", label: "See the solution portfolio" }}
          />
        }
      />

      {/* Lifecycle rail: the stages, read left to right. */}
      <section className="border-b border-rule bg-paper-2/50">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gold">
            The lifecycle we work across
          </p>
          <ol className="mt-7 grid gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {stages.map((s, i) => (
              <li key={s.title} className="eg-inview relative pr-6">
                <span className="flex items-center gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold/15 font-mono text-[10px] text-gold">
                    {i + 1}
                  </span>
                  {i < stages.length - 1 ? (
                    <span className="hidden h-px flex-1 bg-rule lg:block" />
                  ) : null}
                </span>
                <h2 className="mt-3 font-display text-lg">{s.title}</h2>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink/65">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        {services.map((s, i) => (
          <ServiceChapter key={s.slug} service={s} index={i} />
        ))}
      </div>

      {/* Why Edge, on dark: the only dark band on the page. */}
      <section className="relative overflow-hidden" style={{ background: DARK }}>
        <span
          className="pointer-events-none absolute -right-40 -top-40 h-[40rem] w-[40rem] rounded-full"
          style={{ background: "radial-gradient(circle,rgb(255 255 255/0.07),transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-white">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/55">
            Why Edge Comm-Tech
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-[clamp(1.7rem,3.2vw,2.6rem)] leading-tight">
            One accountable partner, from first assessment to long-term support
          </h2>
          <div className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {(company.differentiators ?? []).map((d, i) => (
              <div key={d.title} className="eg-inview border-t border-white/15 pt-5">
                <span className="font-mono text-[10px] text-white/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1.5 font-display text-xl">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <SectionHead
          eyebrow="Engagement"
          title="Scoped to the work in front of you"
          intro="A service can support a single focused requirement or an integrated multi-technology program. Responsibilities, deliverables, acceptance criteria and support arrangements are agreed in writing before mobilization."
        />
        <div className="mt-9 grid gap-3 sm:grid-cols-3">
          {ENGAGEMENTS.map(([t, b]) => (
            <div
              key={t}
              className="eg-inview rounded-2xl border border-rule p-6 transition hover:border-gold"
            >
              <h3 className="font-display text-lg">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <ClosingCta
        title="Let's scope the work"
        body="Tell us the outcome you need and the environment you are working in. We will come back with a practical service scope and a delivery approach."
        primary={{ href: "/contact", label: "Request a consultation" }}
        secondary={{ href: "/projects", label: "See delivered projects" }}
        accent="#056a9a"
      />
    </main>
  );
}
