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
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/news" className="font-mono text-xs uppercase tracking-widest text-gold">
        ← Newsroom
      </Link>
      <p className="mt-6 font-mono text-xs uppercase tracking-widest text-steel">
        {new Date(article.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">{article.title}</h1>
      <p className="mt-4 text-lg text-ink/80">{article.excerpt}</p>
      <RichText data={article.body} className="mt-10" />
    </main>
  );
}
