import Link from "next/link";
import { Tr } from "@/components/i18n/Tr";
import { Confirmable, Mark } from "@/components/ui";
import { AnimatedWords } from "@/components/ui/animated-words";
import { SolutionGlyph, SolutionWatermark } from "@/components/ui/solution-glyph";
import { featuredProjects, HeroCard, impactCard, SuccessStory, teaser } from "./home-parts";
import {
  getClients,
  getCompany,
  getContactDetails,
  getPageCopy,
  getPartners,
  getPosts,
  getProjects,
  getSiteSettings,
  getSolutions,
  type Project,
} from "@/lib/content";
import { SECTOR_OPTIONS, SECTOR_SHORT, type SectorSlug } from "@/fields/sectors";
import { projectHref, solutionHref } from "@/lib/routes";
import { ProjectCover } from "./projects/project-images";

/*
 * The home page, in the fifteen-section order the content master sets out in
 * Module 01, as changed at the owner's request on 2026-10-26: hero, impact,
 * who we are, solutions, technology priorities, partners, projects, why us,
 * clients, success story, insights, careers, final call to action. The
 * industry-expertise and how-we-deliver sections are gone and partners moved up.
 *
 * Ported from design-src/highland/pages/home.mjs. Every fact comes from the
 * CMS; the only things written in here are the section headings and standing
 * copy the content master fixes, and the seven solution-family glyphs, which
 * are iconography rather than content and have nowhere in the schema to live.
 *
 * The priorities band and the final call to action use Edge's own dark blue
 * (#003D6B) rather than Highland's ink. The content master asks for a
 * dark-blue section in both places, and it is the one place the approved
 * palette and the approved design agree.
 */

const DARK = "#003D6B";
const CYAN = "#10C7FF";

export default async function HomePage() {
  const [settings, company, contact, copy, solutions, projects, clients, partners, posts] =
    await Promise.all([
      getSiteSettings(),
      getCompany(),
      getContactDetails(),
      getPageCopy(),
      getSolutions(),
      getProjects(),
      getClients(),
      getPartners(),
      getPosts(),
    ]);

  const hero = copy.homeHero;
  const featured = featuredProjects(projects);
  const story = projects.find((p) => p.slug === "bahir-dar-university-smart-classrooms");
  /* office[0] is the legal name; the hero card prints the two address lines. */
  const officeLines = (contact.office ?? []).slice(1, 3).map((l) => l.line);

  return (
    <main>
      {/* 01 Hero */}
      <section data-home-hero className="eg-hero-under-nav relative overflow-hidden bg-paper">
        <div className="sun-disk" aria-hidden="true" />
        <div className="horizon" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1fr_18rem] md:py-32">
          <div>
            <p className="eg-hero-eyebrow eg-hero-shimmer font-mono text-[11px] uppercase tracking-[0.28em] text-gold">
              <Tr>{hero?.eyebrow}</Tr>
            </p>
            <h1 className="eg-hero-wipe eg-hero-shine mt-5 font-display text-[clamp(2.4rem,6.4vw,4.9rem)] leading-[0.95]">
              <Tr>{hero?.title}</Tr>
            </h1>
            <p className="eg-hero-focus mt-8 max-w-xl text-lg leading-relaxed text-ink/75">
              <Tr>{hero?.intro}</Tr>
            </p>
            <div className="eg-hero-up mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/solutions"
                className="eg-hero-cta rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-16px_rgb(8_136_197/0.9)] transition hover:-translate-y-0.5"
              >
                <Tr>Explore our solutions</Tr>
              </Link>
              <Link
                href="/projects"
                className="rounded-full border border-gold px-6 py-3 text-sm font-semibold text-gold transition hover:-translate-y-0.5"
              >
                <Tr>View our projects</Tr>
              </Link>
            </div>
          </div>
          <HeroCard positioning={company.positioning} officeLines={officeLines} />
        </div>
      </section>

      {/* 02 Impact */}
      <section className="border-y border-rule bg-paper-2">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="eg-m-eyebrow font-mono text-[10px] uppercase tracking-widest text-gold">
            Trusted execution, measurable impact
          </p>
          <dl className="eg-m-stagger mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {(settings.impact ?? []).map((m) => impactCard(m))}
          </dl>
          {settings.impactSupport ? (
            <p className="mt-8 border-t border-rule pt-6 font-display text-lg text-ink/80">
              {settings.impactSupport}
            </p>
          ) : null}
        </div>
      </section>

      {/* 03 Who we are */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="eg-m-eyebrow font-mono text-[10px] uppercase tracking-widest text-gold">Who we are</p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-tight">
              Your technology partner from edge to core, core to cloud
            </h2>
            <p className="mt-6 leading-relaxed text-ink/75">
              {`${company.legalName}, known as ${company.shortName}, is an Ethiopian technology solutions and systems-integration company established in 2018.`}
            </p>
            <p className="mt-4 leading-relaxed text-ink/75">
              We combine engineering expertise, strategic consulting, global technology
              partnerships, and dependable project execution to solve complex business and
              infrastructure challenges. Our capabilities span the complete technology lifecycle,
              from assessment and solution design to supply, implementation, integration, training,
              support, and continuous improvement.
            </p>
            <p className="mt-4 leading-relaxed text-ink/75">
              We do more than deploy technology. We help organizations build resilient operations,
              secure critical information, improve service delivery, unlock institutional knowledge,
              and create the digital foundations required for long-term growth.
            </p>
            <Link
              href="/about"
              className="mt-7 inline-block rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold"
            >
              Discover Edge Comm-Tech
            </Link>
          </div>
          <div className="eg-m-stagger grid content-start gap-3">
            <div className="eg-inview rounded-2xl bg-paper-2 p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-gold">Mission</p>
              <p className="mt-2 font-display text-xl">{company.mission}</p>
              <p className="mt-2 text-sm text-ink/70">{company.missionBody}</p>
            </div>
            <div className="eg-inview rounded-2xl bg-paper-2 p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-gold">Vision</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">{company.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 04 Solutions */}
      <section id="solutions" className="border-t border-rule bg-paper-2/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gold">Our solutions</p>
          <h2 className="mt-3 max-w-3xl font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-tight">
            One trusted partner, complete technology capabilities
          </h2>
          <p className="mt-5 max-w-2xl text-ink/75">
            Modern organizations need technology that works as one connected ecosystem. Edge
            Comm-Tech brings together infrastructure, connectivity, security, software, artificial
            intelligence, power, and specialized technologies to deliver integrated solutions built
            around each client&apos;s priorities.
          </p>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s) => (
              <Link
                key={s.slug}
                href={solutionHref(s.slug)}
                className="eg-inview eg-card group relative isolate flex flex-col overflow-hidden rounded-2xl bg-paper-2 p-6 shadow-[0_18px_40px_-32px_rgb(28_36_48/0.55)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_52px_-28px_rgb(8_136_197/0.5)]"
              >
                <span
                  aria-hidden="true"
                  className="eg-card-wash pointer-events-none absolute inset-0 -z-10"
                  style={{ background: `radial-gradient(circle at 100% 100%,${s.accent}1f,transparent 62%)` }}
                />
                <SolutionWatermark slug={s.slug} accent={s.accent} />
                <span
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ background: `linear-gradient(90deg,${s.accent},${s.accent}22)` }}
                />
                <span
                  className="grid h-12 w-12 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${s.accent}16`, color: s.accent }}
                >
                  <SolutionGlyph slug={s.slug} className="h-6 w-6" />
                </span>
                <span
                  className="mt-4 font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: s.accent }}
                >
                  Solution {String(s.order).padStart(2, "0")}
                </span>
                <h3 className="mt-1 font-display text-2xl leading-snug group-hover:text-gold">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{s.blurb}</p>
                <span
                  className="mt-4 font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: s.accent }}
                >
                  Explore →
                </span>
              </Link>
            ))}
            <Link
              href="/services"
              className="eg-inview group flex flex-col justify-between rounded-2xl border border-dashed border-gold/40 bg-transparent p-6 transition hover:-translate-y-1 hover:border-gold"
            >
              <span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-gold">
                  And six professional services
                </span>
                <h3 className="mt-2 font-display text-2xl leading-snug group-hover:text-gold">
                  Advisory, procurement, implementation, project management, support and training
                </h3>
              </span>
              <span className="mt-4 font-mono text-[10px] uppercase tracking-widest text-gold">
                See the service model →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 05 Technology priorities */}
      <section className="relative overflow-hidden text-paper" style={{ background: DARK }}>
        <span className="eg-m-glow" aria-hidden="true" />
        <span
          className="eg-m-grid-drift pointer-events-none absolute inset-0 opacity-20"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff22 1px,transparent 1px),linear-gradient(90deg,#ffffff22 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <p
            className="eg-m-eyebrow font-mono text-[10px] uppercase tracking-widest"
            style={{ color: CYAN }}
          >
            Building what comes next
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-tight text-paper">
            Technology designed for today and ready for tomorrow
          </h2>
          <p className="mt-5 max-w-2xl text-paper/70">
            Organizations need trusted foundations that support artificial intelligence, automation,
            secure cloud adoption, expanding data requirements, connected operations, and
            sustainable growth.
          </p>
          <div className="eg-m-stagger mt-12 grid gap-px overflow-hidden rounded-2xl bg-paper/15 md:grid-cols-2 lg:grid-cols-3">
            {(copy.homePriorities ?? []).map((p) => (
              <article key={p.title} className="eg-inview p-7" style={{ background: DARK }}>
                <h3 className="font-display text-xl text-paper">{p.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-paper/65">{p.body}</p>
              </article>
            ))}
          </div>
          <Link
            href="/contact"
            className="eg-m-sheen mt-10 inline-block rounded-full px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
            style={{ background: CYAN, color: DARK }}
          >
            Modernize your technology environment
          </Link>
        </div>
      </section>

      {/* 06 Partners */}
      <section id="partners" className="border-t border-rule bg-paper-2/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eg-m-eyebrow font-mono text-[10px] uppercase tracking-widest text-gold">
                Global technology ecosystem
              </p>
              <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-tight">
                World-class technologies, locally delivered
              </h2>
              <p className="mt-5 max-w-2xl text-ink/75">
                Technologies are selected according to suitability, interoperability, scalability,
                security, lifecycle value, and long-term support.
              </p>
            </div>
            <Link
              href="/partners"
              className="rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold"
            >
              View our technology partners
            </Link>
          </div>
          {partners.some((p) => p.featured) ? (
            <ul className="eg-m-stagger mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-rule sm:grid-cols-3 lg:grid-cols-6">
              {partners
                .filter((p) => p.featured)
                .map((p) => (
                  <li key={p.name} className="eg-inview eg-m-tile grid h-24 place-items-center bg-paper-2 px-4">
                    <Mark item={p} h="h-12" />
                  </li>
                ))}
            </ul>
          ) : null}
        </div>
      </section>

      {/* 07 Projects */}
      <section className="border-y border-rule bg-paper-2/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-gold">
                Proven delivery
              </p>
              <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-tight">
                Technology creating real institutional impact
              </h2>
            </div>
            <Link
              href="/projects"
              className="rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold"
            >
              Explore the project portfolio
            </Link>
          </div>
          {featured.length ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <Link
                key={p.slug}
                href={projectHref(p.slug)}
                className="eg-inview group flex flex-col overflow-hidden rounded-2xl bg-paper-2 p-6 transition hover:-translate-y-1"
              >
                <ProjectCover
                  project={p}
                  fallback={false}
                  sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
                  className="-mx-6 -mt-6 mb-5"
                />
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-steel">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  {`${SECTOR_SHORT[p.sector as SectorSlug]} · `}
                  <Confirmable value={p.year} />
                </span>
                <h3 className="mt-3 font-display text-xl leading-snug group-hover:text-gold">
                  {p.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">{p.summary}</p>
                <span className="mt-4 font-mono text-[10px] uppercase tracking-widest text-gold">
                  View project →
                </span>
              </Link>
            ))}
          </div>
          ) : null}
        </div>
      </section>

      {/* 08 Why Edge Comm-Tech */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gold">Why choose us</p>
        <h2 className="mt-3 max-w-3xl font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-tight">
          Local understanding, global technology, accountable delivery
        </h2>
        <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {(company.differentiators ?? []).map((d, i) => (
            <div key={d.title} className="eg-inview border-t border-rule pt-5">
              <span className="font-mono text-[10px] text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1.5 font-display text-xl">{d.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 09 Clients */}
      <section id="clients" className="mx-auto max-w-6xl px-6 py-20">
        <p className="eg-m-eyebrow font-mono text-[10px] uppercase tracking-widest text-gold">
          Trusted across critical sectors
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-tight">
          Supporting institutions that move Ethiopia forward
        </h2>
        <div className="mt-10 space-y-8">
          {SECTOR_OPTIONS.map(({ value, label }) => {
            const group = clients.filter((c) => c.sector === value);
            // A sector whose clients are all unpublished is left out, not printed
            // as a label over an empty grid.
            if (!group.length) return null;
            return (
              <div key={value}>
                <p className="font-mono text-[10px] uppercase tracking-widest text-steel">
                  {label}
                </p>
                <ul className="eg-m-stagger mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {group.map((c) => (
                    <li
                      key={c.name}
                      className="eg-inview eg-m-tile grid h-20 place-items-center rounded-2xl border border-rule bg-paper-2 px-4"
                    >
                      <Mark item={c} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <Link
          href="/clients"
          className="mt-9 inline-block rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold"
        >
          Meet our clients
        </Link>
      </section>

      {/* 10 Success story */}
      {story ? <SuccessStory story={story} /> : null}

      {/* 11 Insights */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eg-m-eyebrow font-mono text-[10px] uppercase tracking-widest text-gold">Insights</p>
            <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-tight">
              Ideas, updates and technology perspectives
            </h2>
          </div>
          <Link
            href="/resources"
            className="rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold"
          >
            Visit our resources
          </Link>
        </div>
        {posts.length ? (
        <div className="eg-m-stagger mt-10 grid gap-4 md:grid-cols-3">
          {posts.slice(0, 3).map((p) => {
            const target = typeof p.target === "object" ? p.target : null;
            const href = target
              ? solutionHref(target.slug, p.anchor || undefined)
              : undefined;
            const body = (
              <>
                <span
                  className="font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: target?.accent ?? "#0888c5" }}
                >
                  Insight
                </span>
                <h3 className="mt-2 font-display text-xl leading-snug group-hover:text-gold">
                  {p.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">
                  {`${teaser(p.body)}…`}
                </p>
                <span className="mt-4 font-mono text-[10px] uppercase tracking-widest text-gold">
                  Read more →
                </span>
              </>
            );
            const className =
              "eg-inview eg-m-card group flex flex-col rounded-2xl border border-rule p-6 hover:border-gold";
            /*
             * A post whose target solution is unpublished renders without a
             * link rather than with one to a route that 404s. Payload's
             * populate does not re-apply the published filter.
             */
            return href && target?._status === "published" ? (
              <Link key={p.slug} href={href} className={className}>
                {body}
              </Link>
            ) : (
              <div key={p.slug} className={className}>
                {body}
              </div>
            );
          })}
        </div>
        ) : null}
      </section>

      {/* 12 Careers */}
      <section className="border-t border-rule">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 px-6 py-16">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-widest text-gold">Grow with us</p>
            <h2 className="mt-3 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-tight">
              Build skills, create impact, shape the digital future
            </h2>
            <p className="mt-4 text-ink/75">
              We believe Africa&apos;s digital transformation depends on talented, curious, and
              accountable people.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/careers"
              className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Explore careers
            </Link>
            <Link
              href="/careers/e-academy"
              className="rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold"
            >
              Discover E-Academy
            </Link>
          </div>
        </div>
      </section>

      {/* 13 Final CTA */}
      <section
        className="relative overflow-hidden border-t border-rule text-paper"
        style={{ background: DARK }}
      >
        <span
          className="pointer-events-none absolute -right-20 -top-28 h-[30rem] w-[30rem] rounded-full"
          aria-hidden="true"
          style={{ background: "radial-gradient(circle,#10C7FF33,transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: CYAN }}>
            Ready to build what&apos;s next
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-[clamp(1.9rem,3.6vw,3rem)] leading-tight text-paper">
            Whether you are modernizing infrastructure or adopting AI, our team is ready to help
          </h2>
          <p className="mt-5 max-w-2xl text-paper/70">
            Strengthening cybersecurity, moving toward cloud, digitizing operations, improving
            business continuity, or developing a new technology environment — tell us about your
            organization, current challenge, and intended outcome.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{ background: CYAN, color: DARK }}
            >
              Talk to our experts
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-paper/30 px-6 py-3 text-sm font-semibold text-paper transition hover:border-paper"
            >
              Request a consultation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

