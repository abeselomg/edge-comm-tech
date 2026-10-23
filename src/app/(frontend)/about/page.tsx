import Link from "next/link";
import { ClosingCta, CtaRow, PageHead, Pending, SectionHead } from "@/components/ui";
import {
  getClients,
  getCompany,
  getContactDetails,
  getPageCopy,
  getSiteSettings,
  getSolutions,
} from "@/lib/content";

/*
 * About Us. Module 01, part two.
 *
 * The page's spine is the journey timeline -- ten dated milestones no other
 * page carries -- and it is what keeps this page from reading like a longer
 * homepage. Mission, vision and the seven values are Edge's own approved
 * wording, read from the Company global.
 *
 * The prose paragraphs here are Highland's own page copy rather than CMS
 * fields, which is the division Task 5 settled on for the home page: the
 * heroes and the data arrays are editable, and body prose belonging to one
 * page's argument stays with the page.
 *
 * One deliberate addition: the leadership section links to
 * /about/executive-management, which Highland generated and linked from
 * nowhere.
 */

const ACCENT = "#0888c5";

export const metadata = {
  title: "About Edge Comm-Tech — Technology Solutions Company in Ethiopia",
  description:
    "Learn how Edge Comm-Tech delivers enterprise networks, cloud, datacenters, cybersecurity, software, AI, power, and broadcast solutions across Ethiopia and beyond.",
};

export default async function AboutPage() {
  const [copy, company, settings, solutions, clients, contact] = await Promise.all([
    getPageCopy(),
    getCompany(),
    getSiteSettings(),
    getSolutions(),
    getClients(),
    getContactDetails(),
  ]);
  const hero = copy.aboutHero;
  const journey = company.journey ?? [];

  return (
    <main>
      <PageHead
        eyebrow={hero?.eyebrow}
        title={hero?.title ?? "Engineering technology, enabling progress"}
        intro={hero?.intro}
        accent={ACCENT}
        variant="wash"
        ctas={
          <CtaRow
            primary={{ href: "/solutions", label: "Explore our solutions" }}
            secondary={{ href: "/contact", label: "Talk to our experts" }}
          />
        }
      />

      {/* Who we are, beside the four counters */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <SectionHead
              eyebrow="Who we are"
              title="Local expertise connected to global technology"
            />
            <p className="mt-6 leading-relaxed text-ink/75">
              Since 2018, we have helped financial institutions, government organizations,
              educational institutions, and enterprises modernize infrastructure, secure
              operations, strengthen resilience, automate services, and create sustainable
              foundations for digital growth.
            </p>
            <p className="mt-4 leading-relaxed text-ink/75">
              We bring together professional expertise, engineering capability, strategic
              consulting, project management, and technologies from respected global vendors and
              original equipment manufacturers. This combination allows us to address complex
              organizational requirements through solutions designed for local operating conditions
              and aligned with international standards.
            </p>
            <p className="mt-4 leading-relaxed text-ink/75">
              From assessment and architecture design to procurement, implementation, integration,
              testing, training, support, and continuous improvement, we provide one accountable
              partner throughout the solution lifecycle.
            </p>
          </div>
          <dl className="grid content-start gap-px self-start overflow-hidden rounded-2xl bg-rule sm:grid-cols-2">
            {(settings.impact ?? []).map((m) => (
              <div key={m.figure} className="bg-paper-2 px-6 py-6">
                <dt className="font-display text-3xl leading-none text-gold">{m.figure}</dt>
                {/*
                 * Highland prints the unit and the qualifying line as one
                 * sentence here, where the home page gives the unit its own
                 * span beside the figure. Both read the same two fields.
                 */}
                <dd className="mt-2 text-xs leading-snug text-ink/70">{`${m.unit} ${m.line}`}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* The journey */}
      <section className="border-y border-rule bg-paper-2/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHead
            eyebrow="Our journey"
            title="From a focused technology company to an integrated solutions partner"
            intro="Edge Comm-Tech was established to help organizations access, integrate, and sustain world-class technology through dependable local expertise. The milestones below reflect continuous capability development and sector expansion."
          />
          <ol className="relative mt-12 border-l border-rule pl-8">
            {journey.map((m, i) => (
              <li key={m.when} className="eg-inview relative pb-9 last:pb-0">
                <span
                  className={`absolute -left-[2.3rem] top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-paper ${
                    i === journey.length - 1 ? "bg-gold" : "bg-gold/40"
                  }`}
                />
                <p className="font-mono text-[10px] uppercase tracking-widest text-gold">
                  {m.when}
                </p>
                <p className="mt-1.5 max-w-2xl leading-relaxed text-ink/80">{m.what}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Mission and vision */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gold">Our direction</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="eg-inview rounded-3xl p-8" style={{ background: "#0888c50e" }}>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gold">Mission</p>
            <h2 className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight">
              {company.mission}
            </h2>
            <p className="mt-4 leading-relaxed text-ink/75">{company.missionBody}</p>
          </article>
          <article className="eg-inview rounded-3xl p-8" style={{ background: "#056a9a0e" }}>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gold-2">Vision</p>
            <h2 className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight">
              {company.vision}
            </h2>
            <p className="mt-4 leading-relaxed text-ink/75">{company.visionBody}</p>
          </article>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-rule">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHead
            eyebrow="What guides us"
            title="Values that shape every decision and delivery"
          />
          <div className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {(company.values ?? []).map((v, i) => (
              <div key={v.title} className="eg-inview border-t border-rule pt-5">
                <span className="font-mono text-[10px] text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1.5 font-display text-xl">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-t border-rule bg-paper-2/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHead
            eyebrow="Our capabilities"
            title="Integrated solutions across the technology lifecycle"
            intro="Modern environments depend on successful integration of connectivity, computing, data, security, software, artificial intelligence, facilities, and power. Edge Comm-Tech brings these capabilities together within one coordinated delivery framework."
          />
          <ul className="mt-10 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {solutions.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/solutions/${s.slug}`}
                  className="eg-inview block h-full rounded-2xl bg-paper-2 p-5 transition hover:-translate-y-1"
                >
                  <span
                    className="font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: s.accent }}
                  >
                    {String(s.order).padStart(2, "0")}
                  </span>
                  <span className="mt-1.5 block font-display text-lg leading-snug">{s.short}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/services"
                className="eg-inview block h-full rounded-2xl border border-dashed border-gold/40 p-5 transition hover:-translate-y-1 hover:border-gold"
              >
                <span className="font-mono text-[10px] uppercase tracking-widest text-gold">
                  +06
                </span>
                <span className="mt-1.5 block font-display text-lg leading-snug">
                  Professional services
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Sector experience and delivery */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHead
              eyebrow="Sector experience"
              title="Technology aligned with institutional priorities"
            />
            <dl className="mt-7 divide-y divide-rule border-y border-rule">
              {(company.industries ?? []).map((s) => (
                <div key={s.title} className="eg-inview py-5">
                  <dt className="font-display text-lg">{s.title}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-ink/70">{s.body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <SectionHead
              eyebrow="How we work"
              title="One accountable partner from strategy to support"
            />
            <ol className="mt-7 space-y-2.5">
              {(company.delivery ?? []).map((s, i) => (
                <li key={s.title} className="eg-inview flex gap-4 rounded-2xl bg-paper-2 px-5 py-4">
                  <span className="pt-0.5 font-mono text-[10px] text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-display text-base">{s.title}</span>
                    <span className="mt-1 block text-sm text-ink/70">{s.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="border-t border-rule bg-paper-2/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHead
            eyebrow="Professional capability"
            title="Specialized teams, unified execution"
            intro="Our organizational model connects strategy, engineering, presales, project management, supply chain, finance, human resources, marketing, and business development. Technical capabilities are supported by professionals with technology, project, and vendor certifications."
          />
          <div className="mt-9">
            <p className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-steel">
              Executive management <Pending>Biographies and portraits pending from Edge</Pending>
            </p>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
              {(company.executiveRoles ?? []).map((r) => (
                <li key={r.title} className="eg-inview rounded-2xl bg-paper-2 p-5">
                  <span
                    className="grid h-11 w-11 place-items-center rounded-full bg-gold/10 font-display text-gold"
                    aria-hidden="true"
                  >
                    &mdash;
                  </span>
                  <span className="mt-3 block font-display text-base leading-snug">{r.title}</span>
                  <span className="mt-1 block text-xs text-steel">Name to be confirmed</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-steel">
              The content master lists the five executive profiles as Pending. Roles are shown;
              names, biographies and portraits are added when Edge supplies them.
            </p>
            {/*
             * Highland rendered an executive-management page and linked to it
             * from nowhere. The roster above is the summary; that page carries
             * the structure and what the executive team is held to.
             */}
            <p className="mt-6">
              <Link
                href="/about/executive-management"
                className="inline-block rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold"
              >
                See the executive management structure
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHead
          eyebrow="Sustainable progress"
          title="Building technology with long-term purpose"
          intro="Digital transformation should improve organizational performance while contributing positively to communities and the environment. We consider efficiency, durability, responsible sourcing, and lifecycle value in the solutions we recommend and deliver."
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(company.sustainability ?? []).map((s) => (
            <article key={s.title} className="eg-inview rounded-2xl border border-rule p-6">
              <h3 className="font-display text-lg">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Clients, and where Edge works from */}
      <section id="clients" className="border-t border-rule bg-paper-2/40">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionHead
              eyebrow="Trusted experience"
              title="Supporting institutions that drive national progress"
            />
            <p className="mt-6 leading-relaxed text-ink/75">
              Through more than 67 executed and delivered projects, we have developed practical
              experience managing complex requirements, global supply chains, multidisciplinary
              implementation, institutional stakeholders, documentation, training, and operational
              handover.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {clients.map((c) => (
                <li
                  key={c.name}
                  className="rounded-full bg-paper-2 px-3.5 py-1.5 text-xs text-ink/75"
                >
                  {c.name}
                </li>
              ))}
            </ul>
            <Link
              href="/clients"
              className="mt-7 inline-block rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold"
            >
              Meet our clients
            </Link>
          </div>
          <div>
            <SectionHead eyebrow="Our home" title="Headquartered in Addis Ababa" />
            <address className="mt-6 not-italic leading-relaxed text-ink/80">
              {(contact.office ?? []).map((line, i, arr) => (
                <span key={line.line}>
                  {line.line}
                  {i < arr.length - 1 ? <br /> : null}
                </span>
              ))}
            </address>
            <p className="mt-4 text-sm leading-relaxed text-ink/70">
              From our headquarters in Addis Ababa, our teams coordinate consulting, engineering,
              procurement, project delivery, client support, and partnership activities across
              Ethiopia and beyond.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                Contact us
              </Link>
              {contact.mapUrl ? (
                <a
                  href={contact.mapUrl}
                  className="rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold"
                >
                  Get directions
                </a>
              ) : null}
            </div>
            <p className="mt-6 rounded-2xl bg-paper-2 px-5 py-4 text-xs leading-relaxed text-steel">
              Edge Communication Technologies PLC operates with the applicable professional licences
              and government registrations required for its business activities. Company-held
              certifications are distinguished from certifications held by individual employees.
            </p>
          </div>
        </div>
      </section>

      <ClosingCta
        title="Let's build the next stage of your digital transformation"
        body="Whether you are modernizing critical infrastructure, strengthening cybersecurity, introducing AI and automation, improving business continuity, enabling intelligent learning, digitizing operations, or planning a new technology investment."
        primary={{ href: "/contact", label: "Talk to our experts" }}
        secondary={{ href: "/solutions", label: "Explore our solutions" }}
      />
    </main>
  );
}
