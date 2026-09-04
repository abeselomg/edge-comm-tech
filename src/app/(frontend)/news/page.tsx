import type { Metadata } from "next";
import Link from "next/link";
import { getNews } from "@/lib/content";

export const metadata: Metadata = {
  title: "News & insight",
  description: "Announcements and technical writing from Edge COMM-TECH.",
};

export default async function NewsPage() {
  const articles = await getNews();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-gold">Newsroom</p>
      <h1 className="mt-3 font-display text-5xl">News &amp; insight</h1>

      {articles.length === 0 ? (
        <p className="mt-8 text-lg text-ink/70">Nothing published yet.</p>
      ) : (
        <ul className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
          {articles.map((a) => (
            <li key={a.id} className="py-6">
              <p className="font-mono text-xs uppercase tracking-widest text-steel">
                {new Date(a.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <h2 className="mt-2 font-display text-2xl">
                <Link href={`/news/${a.slug}`} className="hover:text-gold">
                  {a.title}
                </Link>
              </h2>
              <p className="mt-2 text-ink/75">{a.excerpt}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
