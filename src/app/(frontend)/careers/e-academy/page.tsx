import { buildMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import { LiveForm } from "@/components/forms/LiveForm";
import { ClosingCta, Crumb, CtaRow, PageHead, Pending, SectionHead } from "@/components/ui";
import { getAcademyTracks, getCareersContent, getContactDetails, getForm } from "@/lib/content";
import { emailByLabel, publishedOnly, routeFor, solutionHref } from "@/lib/routes";
import type { Solution } from "@/payload-types";

/*
 * Edge E-Academy.
 *
 * Training is one of Edge's six services, so every track here links back to
 * the solution family it teaches -- the academy is not a separate catalogue of
 * invented courses, it teaches what Edge delivers.
 *
 * No course has a published date, price or certificate scheme: none is
 * approved. The course sections are the master's own template for what a
 * course page will contain, and are shown as exactly that -- a template --
 * rather than dressed up as six live course listings.
 */

const DARK = "#003D6B";
const ACCENT = "#056a9a";

export const metadata = buildMetadata({
  title: "Edge E-Academy — Technology Training and Knowledge Transfer",
  description:
    "Structured technology training from Edge Comm-Tech for individuals, institutions and corporate teams across AI, networks, cloud, datacenters, cybersecurity and power.",
  path: "/careers/e-academy",
});

export default async function EAcademyPage() {
  const [careers, tracks, contact, form] = await Promise.all([
    getCareersContent(),
    getAcademyTracks(),
    getContactDetails(),
    getForm("academy-enquiry"),
  ]);
  const audiences = careers.academyAudiences ?? [];
  const levels = (careers.academyLevels ?? []).map((l) => l.item);
  const delivery = (careers.academyDelivery ?? []).map((d) => d.item);
  const sales = emailByLabel(contact, /sales/i);

  return (
    <main>
      <PageHead
        eyebrow="Edge E-Academy"
        title="Technology training from the people who implement it"
        intro="Our training comes out of delivery, not a syllabus. The engineers who build and support these systems for banks, universities and ministries are the ones who teach them."
        accent={ACCENT}
        variant="grid"
        crumb={<Crumb trail={[{ label: "Careers", href: "/careers" }, { label: "E-Academy" }]} />}
        ctas={
          <CtaRow
            primary={{ href: "#enquire", label: "Enquire about training" }}
            secondary={{ href: "#tracks", label: "See the tracks" }}
          />
        }
      />

      {/* Who it is for */}
      <section className="border-b border-rule bg-paper-2/40">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gold">
            Who E-Academy is for
          </p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((a) => (
              <li key={a.title} className="eg-inview flex flex-col rounded-2xl bg-paper p-6">
                <h3 className="font-display text-lg leading-snug">{a.title}</h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink/70">{a.body}</p>
                <a
                  href="#enquire"
                  className="mt-4 font-mono text-[10px] uppercase tracking-widest text-gold"
                >
                  {a.action} &rarr;
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tracks, each tied to the solution family it teaches */}
      <section id="tracks" className="mx-auto max-w-6xl px-6 py-20">
        <SectionHead
          eyebrow="Training tracks"
          title="Six tracks, mapped to what we deliver"
          intro="Each track teaches a solution family Edge Comm-Tech implements and supports, so what you learn matches how these systems are actually run."
          accent={ACCENT}
        />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((t) => {
            // A track whose solution was unpublished keeps its place and loses
            // its link: the depth populate does not re-apply the published filter.
            const solution = publishedOnly<Solution>([t.solution as Solution | number])[0];
            const c = solution?.accent ?? ACCENT;
            return (
              <li
                key={t.title}
                className="eg-inview flex flex-col rounded-2xl border border-rule p-6 transition hover:border-gold"
              >
                <h3 className="font-display text-lg leading-snug">{t.title}</h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink/70">{t.body}</p>
                {solution ? (
                  <Link
                    href={solutionHref(solution.slug)}
                    className="mt-5 border-t border-rule pt-4 font-mono text-[10px] uppercase tracking-widest transition hover:brightness-90"
                    style={{ color: c }}
                  >
                    {`Taught from ${solution.title} →`}
                  </Link>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Levels and delivery, on dark */}
      <section className="relative overflow-hidden" style={{ background: DARK }}>
        <span
          className="pointer-events-none absolute -bottom-40 -left-32 h-[36rem] w-[36rem] rounded-full"
          style={{ background: "radial-gradient(circle,rgb(255 255 255/0.06),transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-white">
          <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/55">Levels</p>
              <h2 className="mt-3 font-display text-[clamp(1.5rem,3vw,2.3rem)] leading-tight">
                From first awareness to administrator depth
              </h2>
              <ul className="mt-8 flex flex-wrap gap-2">
                {levels.map((l) => (
                  <li
                    key={l}
                    className="eg-inview rounded-full border border-white/20 px-4 py-2 text-sm text-white/85"
                  >
                    {l}
                  </li>
                ))}
              </ul>
              <p className="mt-7 max-w-lg text-sm leading-relaxed text-white/65">
                A program is scoped to the level the participants are actually at. Mixed-ability
                groups are split rather than averaged, because the people who need the depth and the
                people who need the overview are not served by the same session.
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/55">
                Delivery
              </p>
              <h2 className="mt-3 font-display text-[clamp(1.5rem,3vw,2.3rem)] leading-tight">
                Wherever the team is
              </h2>
              <ul className="mt-8 space-y-3">
                {delivery.map((d) => (
                  <li
                    key={d}
                    className="eg-inview flex items-center gap-4 rounded-2xl border border-white/15 px-5 py-4"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
                    <span className="text-sm text-white/85">{d}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-7 max-w-lg text-sm leading-relaxed text-white/65">
                Institutional and corporate programs can be delivered at your site, at our offices
                or online, and scheduled around operational cover.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What a course page will carry: shown as the template it is */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <SectionHead
              eyebrow="Course information"
              title="What every course listing will tell you"
              intro="Individual courses are published as each intake is confirmed. Every listing carries the same eight sections, so programs can be compared properly."
              accent={ACCENT}
            />
          </div>
          <Pending>Course schedule pending from Edge</Pending>
        </div>
        <ol className="mt-10 grid gap-px overflow-hidden rounded-3xl bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {(careers.courseSections ?? []).map((s, i) => (
            <li key={s.title} className="eg-inview bg-paper-2 p-6">
              <span className="font-display text-3xl text-[#056a9a]/20">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-base leading-snug">{s.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink/70">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Enquiry */}
      <section id="enquire" className="border-t border-rule bg-paper-2/40">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1fr_17rem]">
          <div className="min-w-0">
            <SectionHead
              eyebrow="Enquire"
              title="Tell us what your team needs to learn"
              accent={ACCENT}
            />
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70">
              Whether you are one person wanting a scheduled course or an institution planning a
              program for forty staff, start here. We will come back with a proposed track, level,
              format and duration.
            </p>
            <LiveForm
              form={form}
              action="/forms/academy-enquiry"
              submitLabel="Send enquiry"
              accent={ACCENT}
              email={sales}
            />
          </div>

          <aside className="self-start lg:sticky lg:top-32">
            <div className="rounded-2xl bg-paper p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-steel">
                Training is a service
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-ink/70">
                Knowledge transfer is built into every Edge Comm-Tech delivery — administrator and
                user training, runbooks, workshops and coaching at handover.
              </p>
              <Link
                href={routeFor("service-training-knowledge-transfer.html")}
                className="mt-4 inline-block font-mono text-[10px] uppercase tracking-widest text-gold"
              >
                Training &amp; knowledge transfer &rarr;
              </Link>
            </div>
            <div className="mt-4 rounded-2xl border border-rule p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-steel">
                Prefer to email?
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-ink/70">
                {sales ? (
                  <a
                    href={`mailto:${sales}`}
                    className="underline decoration-rule underline-offset-2 hover:text-gold"
                  >
                    {sales}
                  </a>
                ) : null}
                <br />
                {`Reply ${(contact.response ?? "").toLowerCase()}.`}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <ClosingCta
        title="Training that outlasts the project"
        body="A system is only as good as the team running it. We build that capability deliberately, as part of delivery and on its own."
        primary={{ href: "/contact", label: "Talk to our team" }}
        secondary={{ href: "/careers", label: "Back to careers" }}
        accent={ACCENT}
      />
    </main>
  );
}
