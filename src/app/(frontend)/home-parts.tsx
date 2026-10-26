import Link from "next/link";
import { Tr } from "@/components/i18n/Tr";
import { Confirmable } from "@/components/ui";
import { CountUp } from "@/components/count-up";
import type { Project } from "@/lib/content";
import { extractText } from "@/fields/validators";
import { projectHref, solutionHref } from "@/lib/routes";

/*
 * The home page's own pieces: the two helpers its tests exercise, and the two
 * sub-components that would otherwise bury the page's section order.
 *
 * They live beside page.tsx rather than in it because Next allows a page file
 * to export only `default`, `metadata` and a fixed handful of others -- an
 * extra export fails the generated type check with "not assignable to type
 * never". The helpers have to be importable to be tested, so they live here.
 */

/**
 * The projects that lead the home page, in the approved order.
 *
 * `featured` says whether and `order` says where. The content's own figure is
 * a rank 1..6, which for every featured project equals its position in the
 * approved list — so storing the rank twice would be storing it once too
 * often. Returns nothing when none are featured: an editor can clear every
 * flag, and falling back to all eight would be the page deciding what to
 * promote.
 */
export function featuredProjects<T extends { featured?: boolean | null; order?: number | null }>(
  projects: T[],
): T[] {
  return projects
    .filter((p) => p.featured)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * One impact counter.
 *
 * `line` is rendered, always. The 100% counter's qualifier — "against agreed
 * project scope" — lives there, and the content master requires it wherever
 * the figure appears, so a card that prints the figure and drops the line
 * publishes a claim Edge may not make.
 */
export function impactCard(counter: {
  figure: string;
  unit?: string | null;
  line?: string | null;
}) {
  return (
    <div className="eg-inview" key={counter.figure}>
      <dt className="font-display text-[clamp(2.2rem,4vw,3.2rem)] leading-none text-gold">
        <CountUp value={counter.figure} />
        {counter.unit ? (
          <span className="ml-1 font-sans text-base font-normal text-ink/60">{counter.unit}</span>
        ) : null}
      </dt>
      {counter.line ? (
        <dd className="mt-2 text-sm leading-snug text-ink/70">{counter.line}</dd>
      ) : null}
    </div>
  );
}

/** The first 150 characters of a post's body, for the insight teaser. */
export function teaser(body: unknown): string {
  return extractText(body).trim().slice(0, 150);
}

/** The offset card at the hero's right: the approved Highland device. */
export function HeroCard({
  positioning,
  officeLines,
}: {
  positioning: string;
  officeLines: string[];
}) {
  return (
    <aside
      className="eg-pop relative z-10 self-end rounded-3xl bg-paper-2 p-6 shadow-[0_20px_50px_-24px_rgb(8_136_197_/_0.45)]"
      style={{ ["--d" as string]: ".34s" }}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold">
        <Tr>Headquarters</Tr>
      </p>
      <p className="mt-3 font-display text-2xl leading-tight">
        <Tr>{positioning}</Tr>
      </p>
      <p className="mt-3 text-sm text-ink/70">{`${officeLines.join(", ")}.`}</p>
      <Link href="/contact" className="mt-5 inline-block text-sm text-gold">
        <Tr>Call or write →</Tr>
      </Link>
    </aside>
  );
}

/** The Bahir Dar smart-classrooms story, pulled out as the one wide panel. */
export function SuccessStory({ story }: { story: Project }) {
  const client = story.client && typeof story.client === "object" ? story.client.name : null;
  const rows: [string, React.ReactNode][] = [
    ["Client", client],
    ["Sector", story.sectorFull],
    ["Completion", <Confirmable key="y" value={story.year} />],
    ["Status", "Completed"],
  ];
  return (
    <section className="border-y border-rule bg-paper-2/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="eg-m-eyebrow font-mono text-[10px] uppercase tracking-widest text-gold">Success story</p>
          <h2 className="mt-3 font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-tight">
            Transforming learning through smart classroom technology
          </h2>
          <p className="mt-6 leading-relaxed text-ink/75">
            Edge Comm-Tech supported Bahir Dar University in creating connected, technology-enabled
            learning environments designed to improve presentation, collaboration, engagement, and
            access to digital educational resources.
          </p>
          <p className="mt-4 leading-relaxed text-ink/75">
            The solution brought together interactive displays, computing, collaboration
            technologies, classroom infrastructure, implementation services, and user enablement
            within one coordinated project.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={projectHref(story.slug)}
              className="eg-m-sheen rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Read the success story
            </Link>
            <Link
              href={solutionHref("software-ai-digital")}
              className="rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold"
            >
              Explore education solutions
            </Link>
          </div>
        </div>
        <dl className="eg-m-stagger grid content-start gap-px self-start overflow-hidden rounded-2xl bg-rule sm:grid-cols-2">
          {rows.map(([k, v]) => (
            <div key={k} className="eg-inview bg-paper-2 px-6 py-5">
              <dt className="font-mono text-[9px] uppercase tracking-widest text-steel">{k}</dt>
              <dd className="mt-1.5 font-display text-lg leading-snug">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
