import { ClosingCta, Crumb, PageHead, Pending } from "@/components/ui";
import { getNews, getNewsItem } from "@/lib/content";
import { loadOr404 } from "@/lib/load";
import { ArticleBody, dateText, MoreNews } from "../news-parts";

/*
 * One template, the newsroom's articles.
 *
 * The three are deliberately different kinds: an archived 2018 milestone, an
 * evergreen insight, and a company-news item the content master keeps held until
 * six publication details are supplied. The held one renders its outstanding
 * details rather than guessing at them. A slug that is absent or unpublished is a
 * 404.
 */

export async function generateStaticParams() {
  return (await getNews()).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = await getNewsItem(slug);
  return n ? { title: `${n.title} — Edge Comm-Tech`, description: n.standfirst } : {};
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = await loadOr404(() => getNewsItem(slug));
  const all = await getNews();
  const accent = n.heldForPublication ? "#c48a5a" : "#0888c5";

  return (
    <main>
      <PageHead
        eyebrow={`${n.kind} · ${dateText(n.date)}`}
        title={n.title}
        intro={n.standfirst}
        accent={accent}
        variant="rule"
        crumb={
          <Crumb
            trail={[
              { label: "Resources", href: "/resources" },
              { label: "News", href: "/news" },
              { label: n.kind },
            ]}
          />
        }
        meta={
          n.archive ? (
            <p className="eg-rise mt-6">
              <Pending>Archived milestone — published with its original 2018 year</Pending>
            </p>
          ) : n.heldForPublication ? (
            <p className="eg-rise mt-6">
              <Pending>Draft — held until the fields below are confirmed</Pending>
            </p>
          ) : null
        }
      />

      <article className="mx-auto max-w-2xl px-6 py-16">
        <ArticleBody item={n} accent={accent} />
        <MoreNews items={all} currentSlug={slug} />
      </article>

      <ClosingCta
        title="Discuss your transformation priorities"
        body="Our objective is to help institutions modernize in a way that is secure, scalable, interoperable, resilient, and aligned with the services they need to deliver."
        primary={{ href: "/contact", label: "Talk to our experts" }}
        secondary={{ href: "/solutions", label: "Explore solutions and services" }}
        accent={accent}
      />
    </main>
  );
}
