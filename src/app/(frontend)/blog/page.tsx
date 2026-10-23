import Link from "next/link";
import { ClosingCta, PageHead } from "@/components/ui";
import { getPosts } from "@/lib/content";
import { PostArticle, topics } from "./blog-parts";

/*
 * Insights.
 *
 * The content master is explicit that the ten launch articles are short by
 * design and that their Read More goes straight to the matching solution page:
 * "do not create thin article-detail pages containing the same short copy
 * solely to insert another click."
 *
 * So this page is the articles, not a list of links to them. Each is published
 * in full, in a readable measure, with Read More pointing at the solution
 * capability it introduces. There are no post detail pages and none are
 * generated. The topic rail is anchors rather than filters: all ten articles
 * are on this page, so jumping is the useful action, and a server component
 * needs no script for it.
 */

export const metadata = {
  title: "Insights on Technology, AI and Digital Transformation — Edge Comm-Tech",
  description:
    "Practical perspectives from Edge Comm-Tech on enterprise AI, networks, cloud, datacenters, cybersecurity, power, broadcast and digital transformation in Ethiopia.",
};

export default async function BlogPage() {
  const posts = await getPosts();
  const rail = topics(posts);

  return (
    <main>
      <PageHead
        eyebrow="Insights"
        title="Practical thinking on the technology decisions in front of you"
        intro="Short, useful notes from the work itself — what a technology actually requires, where it tends to go wrong, and what good looks like. Each piece links through to the solution it belongs to."
        accent="#2ba8de"
        variant="rule"
      />

      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-16 lg:grid-cols-[14rem_1fr]">
        <aside className="self-start lg:sticky lg:top-32">
          <p className="font-mono text-[10px] uppercase tracking-widest text-steel">Topics</p>
          <ul className="mt-3 space-y-0.5">
            {rail.map((t) => (
              <li key={t.key}>
                <a
                  href={`#post-${t.firstSlug}`}
                  className="flex items-baseline justify-between gap-3 rounded-xl px-3 py-2 text-[13px] leading-snug text-ink/70 transition hover:bg-paper-2 hover:text-gold"
                >
                  <span>{t.label}</span>
                  {t.count > 1 ? (
                    <span className="shrink-0 font-mono text-[9px] text-steel">{t.count}</span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href="/subscribe"
            className="mt-7 block rounded-2xl bg-paper-2 p-4 text-sm transition hover:text-gold"
          >
            <span className="block font-display text-base">Get new insights</span>
            <span className="mt-1 block text-xs text-steel">Occasional updates, no noise.</span>
          </Link>
        </aside>

        <div className="min-w-0">
          {posts.map((post, i) => (
            <PostArticle key={post.slug} post={post} index={i} />
          ))}
        </div>
      </div>

      <ClosingCta
        title="Want to talk any of this through?"
        body="If one of these notes describes a decision you are facing, our team is happy to go into the detail with you."
        primary={{ href: "/contact", label: "Talk to our experts" }}
        secondary={{ href: "/resources", label: "Browse all resources" }}
        accent="#2ba8de"
      />
    </main>
  );
}
