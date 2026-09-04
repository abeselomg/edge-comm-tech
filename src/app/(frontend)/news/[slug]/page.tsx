import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText } from "@/components/rich-text";
import { getNews, getNewsArticle } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = await getNews();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticle(slug);
  if (!article) return { title: "Article" };
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsArticle(slug);
  if (!article) notFound();

  return (
    <main>
      <section className="dark-surface bg-deep text-paper">
        <div className="wrap pb-16 pt-14 md:pb-20 md:pt-20">
          <Link href="/news" className="link-quiet text-[0.9375rem] text-paper/60">
            Newsroom
          </Link>
          <time dateTime={article.date} className="data mt-8 block text-paper/55">
            {new Date(article.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <h1 className="display display-lg mt-3 max-w-[18ch]">{article.title}</h1>
          <p className="lede mt-6 text-paper/70">{article.excerpt}</p>
        </div>
      </section>

      <section className="band bg-paper">
        <div className="wrap-narrow">
          <RichText data={article.body} />
        </div>
      </section>
    </main>
  );
}
