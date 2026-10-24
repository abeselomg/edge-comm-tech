import Link from "next/link";
import { Mark } from "@/components/ui";
import { projectHref, publishedOnly, solutionHref } from "@/lib/routes";
import type { Partner, PartnerCategory, Project, Solution } from "@/payload-types";

/*
 * The partner directory's own pieces, beside page.tsx because Next allows a
 * page only its known exports.
 */

type CategoryRef = { key: string; _status?: string | null };
type PartnerLike = { name: string; categories?: unknown[] | null };

/**
 * Group partners under the published categories they carry.
 *
 * Keys follow the categories list's order, not the partners', so the filter
 * bar reads in the approved sequence. A category appears only if it is in
 * `categories` (the published list) *and* the partner's own reference to it is
 * published: Payload's depth populate does not re-apply the published filter to
 * related documents, so a partner can arrive carrying a category that has
 * since been unpublished, and that must not become a group.
 */
export function byCategory<P extends PartnerLike>(
  partners: P[],
  categories: CategoryRef[],
): Record<string, P[]> {
  const live = new Set(categories.filter((c) => c._status === "published").map((c) => c.key));
  const out: Record<string, P[]> = {};
  for (const { key } of categories) {
    if (!live.has(key)) continue;
    const members = partners.filter((p) =>
      publishedOnly<CategoryRef>((p.categories ?? []) as never[]).some((c) => c.key === key),
    );
    if (members.length) out[key] = members;
  }
  return out;
}

/*
 * The ring's geometry, computed so spacing stays even if the category list
 * changes. 820x820 user space; nodes are placed as percentages so they scale.
 * R is 262 rather than 300: a node is 8.5rem wide and centred on its point,
 * and at 1024px (the narrowest two-column width) anything larger crosses the
 * column edge and makes the page scroll sideways.
 */
export const RING = { cx: 410, cy: 410, r: 262 };

export function orbit(keys: string[]) {
  return keys.map((k, i) => {
    const a = (i / keys.length) * Math.PI * 2 - Math.PI / 2;
    return { k, x: RING.cx + RING.r * Math.cos(a), y: RING.cy + RING.r * Math.sin(a) };
  });
}

/**
 * The filter, which is hidden radio inputs plus sibling selectors -- no
 * script, so the page needs no client component.
 */
export function filterCss(keys: string[]): string {
  const all = ["all", ...keys].map((k) => `#f-${k}:checked~.wrap label[for=f-${k}]`).join(",");
  const each = keys
    .map(
      (k) => `
#f-${k}:checked~.wrap .node:not(.c-${k}) .pill{opacity:.3}
#f-${k}:checked~.wrap .spoke:not(.s-${k}){opacity:.1}
#f-${k}:checked~.wrap .brand:not(.c-${k}){display:none}
#f-${k}:checked~.wrap .lede .l-${k}{display:block}`,
    )
    .join("");
  return `
${all}{background:#0888c5;color:#fff;border-color:#0888c5}
${each}
#f-all:checked~.wrap .lede .l-all{display:block}
.spoke,.pill{transition:opacity .22s}
.lede span{display:none}
`;
}

type Ref<T> = T | number | string | null | undefined;
const doc = <T extends object>(r: Ref<T>): T | null => (r && typeof r === "object" ? r : null);

export function brandCard(
  p: Omit<Partner, "logo"> & { logo: Parameters<typeof Mark>[0]["item"]["logo"] },
  ringLabel: Record<string, string>,
) {
  // Published only: the depth populate keeps an unpublished solution, and a
  // link to it is a 404 coloured by a draft.
  const solution = publishedOnly<Solution>([doc<Solution>(p.solution as Ref<Solution>)])[0] ?? null;
  const cats = publishedOnly<PartnerCategory>((p.categories ?? []) as never[]);
  const work = publishedOnly<Project>((p.projects ?? []) as never[]);
  const accent = solution?.accent ?? "#0888c5";
  return (
    <li
      key={p.name}
      className={`brand ${cats.map((c) => `c-${c.key}`).join(" ")} eg-inview flex flex-col rounded-2xl border border-rule bg-paper p-5 transition hover:border-gold`}
    >
      <div className="flex h-14 items-center justify-start">
        <Mark item={p} h="h-9" />
      </div>
      <p className="mt-3 flex-1 text-[13px] leading-relaxed text-ink/70">{p.capability}</p>
      <div className="mt-4 flex flex-wrap gap-1.5 border-t border-rule pt-4">
        {cats.map((c) => (
          <span
            key={c.key}
            className="rounded-full bg-paper-2 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-steel"
          >
            {ringLabel[c.key] ?? c.label}
          </span>
        ))}
      </div>
      {solution ? (
        <Link
          href={solutionHref(solution.slug)}
          className="mt-3 font-mono text-[9px] uppercase tracking-widest transition hover:brightness-90"
          style={{ color: accent }}
        >
          {`${solution.short} →`}
        </Link>
      ) : null}
      {work.length ? (
        <ul className="mt-2 space-y-1">
          {work.map((x) => {
            const client = doc<{ name: string }>(x.client as Ref<{ name: string }>);
            return (
              <li key={x.slug}>
                <Link
                  href={projectHref(x.slug)}
                  className="text-[11px] text-steel underline decoration-rule underline-offset-2 hover:text-gold"
                >
                  {client?.name ?? x.title}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </li>
  );
}
