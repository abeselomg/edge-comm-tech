import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { publishedOnly, solutionHref } from "@/lib/routes";
import type { Post, PostCategory, Solution } from "@/payload-types";

/*
 * The insights page's own pieces, beside page.tsx because Next allows a page
 * only its known exports.
 */

const DEFAULT_ACCENT = "#0888c5";

type Ref<T> = T | number | string | null | undefined;
const doc = <T extends object>(r: Ref<T>): T | null => (r && typeof r === "object" ? r : null);

/**
 * The topic rail: only categories that have an article, in article order, so
 * the rail can never offer a jump to an empty section.
 */
export function topics(posts: Post[]) {
  const out: { key: string; label: string; firstSlug: string; count: number }[] = [];
  for (const post of posts) {
    const category = doc<PostCategory>(post.category as Ref<PostCategory>);
    if (!category) continue;
    const seen = out.find((t) => t.key === category.key);
    if (seen) seen.count += 1;
    else out.push({ key: category.key, label: category.label, firstSlug: post.slug, count: 1 });
  }
  return out;
}

/**
 * One article, published in full.
 *
 * The content master says the launch articles are short by design and that
 * Read More goes straight to the matching solution page, so there are no post
 * detail pages. Read More links only if its target is still published: an
 * article stays published when its solution is unpublished, and Payload's
 * depth populate does not re-apply the published filter to related documents,
 * so without this check the link would go to a 404 while the article looked
 * fine to an editor who is signed in.
 */
export function PostArticle({ post, index }: { post: Post; index: number }) {
  const target = publishedOnly<Solution>([doc<Solution>(post.target as Ref<Solution>)])[0];
  const category = doc<PostCategory>(post.category as Ref<PostCategory>);
  const accent = target?.accent ?? DEFAULT_ACCENT;
  const href = target ? solutionHref(target.slug, post.anchor || undefined) : null;

  return (
    <article
      id={`post-${post.slug}`}
      className="scroll-mt-28 border-t border-rule py-14 first:border-t-0 first:pt-0"
    >
      <p
        className="eg-inview font-mono text-[10px] uppercase tracking-widest"
        style={{ color: accent }}
      >
        {/* A category that is not published arrives null (content.ts strips it); the number stands alone. */}
        {category
          ? `${String(index + 1).padStart(2, "0")} · ${category.label}`
          : String(index + 1).padStart(2, "0")}
      </p>
      <h2 className="eg-inview mt-3 max-w-3xl font-display text-[clamp(1.5rem,3vw,2.3rem)] leading-tight">
        {post.title}
      </h2>
      <div className="eg-inview mt-5 max-w-[42rem] space-y-4 leading-relaxed text-ink/80">
        <RichText data={post.body as never} />
      </div>
      {href ? (
        <>
          <Link
            href={href}
            className="eg-inview mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            style={{ background: accent }}
          >
            {post.readMoreLabel} <span aria-hidden="true">&rarr;</span>
          </Link>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-steel">
            {`Goes to ${target?.title}`}
          </p>
        </>
      ) : null}
    </article>
  );
}

/** The "all insights" link text, or null when there is nothing to link to. */
export function allInsightsLabel(count: number): string | null {
  if (count <= 0) return null;
  return `All ${count} insight${count > 1 ? "s" : ""}`;
}
