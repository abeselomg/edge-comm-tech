import Link from "next/link";
import { CapCard, CheckList, Confirmable, Mark, NumberedSteps, SectionHead } from "@/components/ui";
import { projectHref, publishedOnly, solutionHref } from "@/lib/routes";
import type { Partner, Post, Project, Solution } from "@/payload-types";

/*
 * The solution pages' own pieces, beside the pages because Next allows a page
 * only its known exports.
 */

type Ref<T> = T | number | string | null | undefined;
const doc = <T extends object>(r: Ref<T>): T | null => (r && typeof r === "object" ? r : null);

/*
 * Blog cards link to fragments on solution pages, and the content master
 * requires every destination anchor to exist. Each is attached to the
 * capability it names (or, for the datacenter family, to the band itself)
 * rather than invented at the top of the page. These two tables are Highland's
 * (pages/solution.mjs), kept as data and tested against the real posts and the
 * real solution content.
 */
export const ANCHOR_CAPABILITY: Record<string, string> = {
  "private-rag": "Private Enterprise AI & RAG",
  "agentic-ai": "Industry-Specific Agentic AI",
  "ai-education": "AI for Education",
  "local-language-ai": "Local-Language AI",
  "hci-private-cloud": "Hyperconverged Infrastructure",
  "backup-disaster-recovery": "Backup & Recovery",
  "zero-trust-ztna-nac": "Zero Trust Network Access & NAC",
};
export const ANCHOR_BAND: Record<string, number> = { "datacenter-facility": 0, "safe-campus": 1 };

export type AnchorTargets = {
  byTitle: Record<string, string>;
  byBand: Record<number, string>;
};

/** The anchors the published posts aimed at this solution need to land on. */
export function anchorTargets(posts: Post[], slug: string): AnchorTargets {
  const out: AnchorTargets = { byTitle: {}, byBand: {} };
  for (const post of posts) {
    const target = publishedOnly<Solution>([doc<Solution>(post.target as Ref<Solution>)])[0];
    if (!target || target.slug !== slug || !post.anchor) continue;
    const title = ANCHOR_CAPABILITY[post.anchor];
    if (title) out.byTitle[title] = post.anchor;
    else if (post.anchor in ANCHOR_BAND) out.byBand[ANCHOR_BAND[post.anchor]] = post.anchor;
  }
  return out;
}

/** Published projects that used this solution family. */
export function projectsFor(projects: Project[], slug: string): Project[] {
  return publishedOnly<Project>(projects).filter((p) =>
    (p.solutions ?? []).some((s) => doc<Solution>(s as Ref<Solution>)?.slug === slug),
  );
}

type Block = NonNullable<Solution["detail"]>[number];

function Capabilities({
  items,
  anchors,
}: {
  items: { title: string; body: string }[];
  anchors: AnchorTargets;
}) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {items.map((x) => (
        <CapCard key={x.title} title={x.title} body={x.body} id={anchors.byTitle[x.title]} />
      ))}
    </div>
  );
}

function renderBlock(
  block: Block,
  i: number,
  accent: string,
  anchors: AnchorTargets,
  bands: { n: number },
) {
  if (!block || typeof block !== "object") return null;
  const items = ("items" in block ? block.items : null) ?? [];
  if (!items.length) return null;
  const key = `${block.blockType}-${i}`;

  switch (block.blockType) {
    case "bands":
      return (
        <div key={key}>
          {(block.items ?? []).map((b) => {
            const index = bands.n++;
            return (
              <section key={b.title} className="mt-14" id={anchors.byBand[index]}>
                <SectionHead eyebrow={b.label} title={b.title} accent={accent} />
                <Capabilities items={b.entries ?? []} anchors={anchors} />
              </section>
            );
          })}
        </div>
      );
    case "capabilities":
      return (
        <section key={key} className="mt-14">
          <SectionHead eyebrow="Core capabilities" title="What this covers" accent={accent} />
          <Capabilities items={block.items ?? []} anchors={anchors} />
        </section>
      );
    case "layers":
      return (
        <section key={key} className="mt-14">
          <SectionHead eyebrow="Solution architecture" title={block.title ?? ""} accent={accent} />
          <ol className="mt-6 overflow-hidden rounded-2xl border border-rule">
            {(block.items ?? []).map((l, n, all) => (
              <li
                key={l.title}
                className="eg-inview flex gap-5 border-b border-rule bg-paper-2 px-6 py-5 last:border-0"
              >
                <span
                  className="mt-1 h-fit rounded-md px-2 py-0.5 font-mono text-[10px]"
                  style={{ background: `${accent}18`, color: accent }}
                >
                  {`L${all.length - n}`}
                </span>
                <span>
                  <span className="block font-display text-lg">{l.title}</span>
                  <span className="mt-1 block text-sm text-ink/70">{l.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      );
    case "steps":
      return (
        <section key={key} className="mt-14">
          <SectionHead eyebrow="Approach" title={block.title ?? ""} accent={accent} />
          <NumberedSteps steps={block.items ?? []} accent={accent} />
        </section>
      );
    case "checklist":
      return (
        <section key={key} className="mt-14">
          <SectionHead eyebrow="What we weigh" title={block.title} accent={accent} />
          {block.note ? <p className="mt-4 max-w-2xl text-sm text-ink/70">{block.note}</p> : null}
          <CheckList items={(block.items ?? []).map((x) => x.item)} accent={accent} />
        </section>
      );
    case "measures":
      return (
        <section key={key} className="mt-14">
          <SectionHead eyebrow="Success measures" title={block.title} accent={accent} />
          <ul className="mt-5 flex flex-wrap gap-2">
            {(block.items ?? []).map((x) => (
              <li
                key={x.item}
                className="rounded-full px-3.5 py-1.5 text-xs"
                style={{ background: `${accent}12`, color: accent }}
              >
                {x.item}
              </li>
            ))}
          </ul>
        </section>
      );
    case "sectors":
      return (
        <section key={key} className="mt-14">
          <SectionHead eyebrow="Sector relevance" title="Where it applies" accent={accent} />
          <dl className="mt-6 divide-y divide-rule border-y border-rule">
            {(block.items ?? []).map((s) => (
              <div
                key={s.title}
                className="eg-inview grid gap-2 py-5 sm:grid-cols-[13rem_1fr] sm:gap-6"
              >
                <dt className="font-display text-lg">{s.title}</dt>
                <dd className="text-sm text-ink/70">{s.body}</dd>
              </div>
            ))}
          </dl>
        </section>
      );
    default:
      // Engagement models belong to services; any block type this page does not
      // know is skipped rather than crashing the page it sits on.
      return null;
  }
}

/**
 * The detail blocks, in the order an editor stored them.
 *
 * Anything an editor can leave behind -- no list, an empty list, a block with no
 * items, a block type this page has never heard of -- renders nothing and does
 * not throw (Review Focus #4).
 */
export function DetailBlocks({
  blocks,
  accent,
  anchors,
}: {
  blocks: Solution["detail"] | null | undefined;
  accent: string;
  anchors: AnchorTargets;
}) {
  if (!Array.isArray(blocks)) return null;
  const bands = { n: 0 };
  return <>{blocks.map((block, i) => renderBlock(block, i, accent, anchors, bands))}</>;
}

export function PartnerSidebar({
  partners,
  accent,
}: {
  partners: (Partner | number)[];
  accent: string;
}) {
  const shown = publishedOnly<Partner>(partners);
  if (!shown.length) return null;
  return (
    <>
      <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>
        Technologies we build on
      </p>
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {shown.map((p) => (
          <li key={p.name} className="grid h-14 place-items-center rounded-xl bg-paper-2 px-2">
            <Mark item={p as never} />
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] leading-relaxed text-steel">
        Edge Comm-Tech selects technology by suitability, interoperability, scalability, security
        and long-term support.
      </p>
    </>
  );
}

export function RelatedSolutions({
  related,
  accent,
}: {
  related: (Solution | number)[];
  accent: string;
}) {
  const shown = publishedOnly<Solution>(related);
  if (!shown.length) return null;
  return (
    <>
      <p
        className="mt-8 font-mono text-[10px] uppercase tracking-widest"
        style={{ color: accent }}
      >
        Related solutions
      </p>
      <ul className="mt-3 space-y-1.5">
        {shown.map((s) => (
          <li key={s.slug}>
            <Link
              href={solutionHref(s.slug)}
              className="block rounded-xl bg-paper-2 px-4 py-2.5 text-sm transition hover:text-gold"
            >
              {s.short}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export function OtherFamilies({
  solutions,
  currentSlug,
}: {
  solutions: Solution[];
  currentSlug: string;
}) {
  const others = publishedOnly<Solution>(solutions).filter((s) => s.slug !== currentSlug);
  if (!others.length) return null;
  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {others.map((s) => (
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
    </ul>
  );
}

export function DeliveredWork({ projects, accent }: { projects: Project[]; accent: string }) {
  if (!projects.length) return null;
  return (
    <section className="mt-14">
      <SectionHead eyebrow="Delivered work" title="Where we have built it" accent={accent} />
      <ul className="mt-5 divide-y divide-rule border-y border-rule">
        {projects.map((p) => {
          const client = doc<{ name: string }>(p.client as Ref<{ name: string }>);
          return (
            <li key={p.slug}>
              <Link
                href={projectHref(p.slug)}
                className="group flex items-baseline justify-between gap-4 py-4"
              >
                <span>
                  <span className="block font-display text-lg group-hover:text-gold">
                    {p.title}
                  </span>
                  <span className="text-sm text-steel">{`${client?.name ?? ""} · ${p.primary}`}</span>
                </span>
                <span className="shrink-0 font-mono text-xs text-steel">
                  <Confirmable value={p.year} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
