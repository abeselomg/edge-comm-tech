import { buildMetadata, documentSeo } from "@/lib/seo/metadata";
import { solutionHref } from "@/lib/routes";
import { JsonLd } from "@/components/seo/json-ld";
import { graph, solutionService } from "@/lib/seo/jsonld";
import { Crumb, PageHead, SectionHead, CheckList } from "@/components/ui";
import { SolutionVisual } from "@/components/ui/solution-visual";
import { getPosts, getProjects, getSolution, getSolutions } from "@/lib/content";
import { loadOr404 } from "@/lib/load";
import {
  anchorTargets,
  DeliveredWork,
  DetailBlocks,
  OtherFamilies,
  PartnerSidebar,
  projectsFor,
  RelatedSolutions,
} from "../solution-parts";
import Link from "next/link";

/*
 * One template, seven solution-family pages.
 *
 * The skeleton is a datasheet -- a prose column and a pinned capability sidebar
 * -- but each family draws only the blocks its content carries, so Datacenter
 * gets two capability bands, Software/AI an architecture stack, Cybersecurity a
 * resilience sequence, and no two read alike.
 *
 * A slug that is absent or unpublished is a 404, and the page is prerendered for
 * every published slug.
 */

export async function generateStaticParams() {
  return (await getSolutions()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await getSolution(slug);
  if (!s) return {};
  const seo = documentSeo(s, { title: s.title, description: s.blurb });
  return buildMetadata({ ...seo, path: solutionHref(slug) });
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await loadOr404(() => getSolution(slug));
  const [all, projects, posts] = await Promise.all([getSolutions(), getProjects(), getPosts()]);
  const accent = s.accent;
  const total = all.length;
  const delivered = projectsFor(projects, slug);

  return (
    <main>
      <JsonLd data={graph(solutionService(s))} />
      <PageHead
        eyebrow={`Solution ${String(s.order).padStart(2, "0")} of ${total}`}
        title={s.headline}
        intro={s.intro}
        accent={accent}
        variant="wash"
        visual={<SolutionVisual slug={slug} accent={accent} />}
        crumb={<Crumb trail={[{ label: "Solutions", href: "/solutions" }, { label: s.short }]} />}
      />

      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-16 lg:grid-cols-[1fr_19rem]">
        <article className="min-w-0">
          {s.lead ? <p className="max-w-2xl text-lg leading-relaxed">{s.lead}</p> : null}

          {s.outcomes?.length ? (
            <section>
              <SectionHead
                eyebrow="Business outcomes"
                title={s.outcomesTitle ?? ""}
                accent={accent}
              />
              <CheckList items={s.outcomes.map((o) => o.item)} accent={accent} />
            </section>
          ) : null}

          <DetailBlocks blocks={s.detail} accent={accent} anchors={anchorTargets(posts, slug)} />

          <DeliveredWork projects={delivered} accent={accent} />

          {s.experience ? (
            <p className="mt-10 rounded-2xl bg-paper-2 px-6 py-5 text-sm leading-relaxed text-ink/70">
              {s.experience}
            </p>
          ) : null}
          {s.note ? (
            <p className="mt-4 flex items-start gap-2.5 text-xs leading-relaxed text-steel">
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
              <span>{s.note}</span>
            </p>
          ) : null}
        </article>

        <aside className="self-start lg:sticky lg:top-32">
          <PartnerSidebar partners={s.partners ?? []} accent={accent} />
          <RelatedSolutions related={s.related ?? []} accent={accent} />
          <Link
            href="/contact"
            className="mt-8 block rounded-full px-5 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5"
            style={{ background: accent }}
          >
            Request a consultation
          </Link>
        </aside>
      </div>

      <section className="border-t border-rule bg-paper-2">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gold">
            The other six families
          </p>
          <OtherFamilies solutions={all} currentSlug={slug} />
        </div>
      </section>
    </main>
  );
}
