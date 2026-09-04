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
    <main>
      <section className="dark-surface bg-deep text-paper">
        <div className="wrap pb-20 pt-20 md:pb-24 md:pt-28">
          <h1 className="display display-lg max-w-[14ch]">News &amp; insight</h1>
        </div>
      </section>

      <section className="band bg-paper">
        <div className="wrap">
          {articles.length === 0 ? (
            <p className="text-lg text-ink-soft">Nothing published yet.</p>
          ) : (
            <ul>
              {articles.map((a) => (
                <li key={a.id} className="border-t border-rule last:border-b">
                  <Link
                    href={`/news/${a.slug}`}
                    className="group grid gap-3 py-9 md:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] md:gap-10"
                  >
                    <time dateTime={a.date} className="data text-ink-soft md:pt-1.5">
                      {new Date(a.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    <div>
                      <h2 className="display display-sm transition-colors group-hover:text-teal">
                        {a.title}
                      </h2>
                      <p className="measure mt-2.5 leading-relaxed text-ink-soft">{a.excerpt}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
