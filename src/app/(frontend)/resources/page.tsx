import { buildMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import { ClosingCta, CtaRow, PageHead, Pending, SectionHead } from "@/components/ui";
import { getDownloads, getEvents, getNews, getPageCopy, getPosts } from "@/lib/content";
import { teaser } from "@/lib/lexical-text";
import { allInsightsLabel } from "../blog/blog-parts";
import { eventHref } from "@/lib/routes";

/*
 * Resource centre.
 *
 * Six sections, each with its own page. Rather than describe them and leave
 * the visitor to guess whether anything is behind the link, every card reports
 * what it actually holds right now -- a real count, or an honest "publishing
 * soon". Counts come from the collections themselves, so a card cannot
 * advertise items that do not exist. The three media sections have no
 * collection yet and so always say so.
 */

/*
 * The "Coming up" band is derived from event dates, so a page prerendered while
 * a session was upcoming would go on advertising it after it ended. Hourly, like
 * the event pages themselves.
 */
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Resource Centre — News, Events, Media and Downloads | Edge Comm-Tech",
  description:
    "News, announcements, documentary videos, press releases, media coverage, events, webinars and downloadable documents from Edge Comm-Tech.",
  path: "/resources",
});

const UNIT: Record<string, string> = {
  news: "item",
  events: "session",
  downloads: "document",
  documentaries: "video",
  "press-releases": "release",
  coverage: "mention",
};

export default async function ResourcesPage() {
  const [copy, news, events, downloads, posts] = await Promise.all([
    getPageCopy(),
    getNews(),
    getEvents(),
    getDownloads(),
    getPosts(),
  ]);
  const hero = copy.resourcesHero;
  const sections = copy.resourceSections ?? [];
  const stock: Record<string, number> = {
    news: news.length,
    events: events.length,
    downloads: downloads.length,
  };
  const upcoming = events.filter((e) => e.status !== "past");
  const latest = posts.slice(0, 3);

  return (
    <main>
      <PageHead
        eyebrow={hero?.eyebrow}
        title={hero?.title ?? "Resource centre"}
        intro={hero?.intro}
        accent="#0b6fa8"
        variant="grid"
        ambience="general"
        ctas={
          <CtaRow
            primary={{ href: "/subscribe", label: "Subscribe for updates" }}
            secondary={{ href: "/blog", label: "Read our insights" }}
          />
        }
      />

      {upcoming.length ? (
        <section className="border-b border-rule bg-paper-2/50">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <p className="font-mono text-[10px] uppercase tracking-widest text-gold">Coming up</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {upcoming.map((e) => (
                <li key={e.slug}>
                  <Link
                    href={eventHref(e.slug)}
                    className="eg-inview group flex items-start justify-between gap-5 rounded-2xl bg-paper p-6 transition hover:-translate-y-0.5"
                  >
                    <span className="min-w-0">
                      <span className="block font-mono text-[10px] uppercase tracking-widest text-steel">
                        {e.category}
                      </span>
                      <span className="mt-1.5 block font-display text-lg leading-snug group-hover:text-gold">
                        {e.title}
                      </span>
                      <span className="mt-1 block text-xs text-steel">
                        {`${e.format} · ${e.audience}`}
                      </span>
                    </span>
                    <span className="shrink-0 text-right font-mono text-[10px] uppercase tracking-widest text-gold">
                      {e.displayDate}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHead eyebrow="Sections" title="Browse the resource centre" />
        <ul className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s, i) => {
            const n = stock[s.key] ?? 0;
            const unit = UNIT[s.key] ?? "item";
            return (
              <li key={s.key} className={i < 2 ? "sm:col-span-2" : ""}>
                <Link
                  href={s.href}
                  className="eg-inview group flex h-full flex-col rounded-3xl border border-rule p-7 transition hover:-translate-y-1 hover:border-gold"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-[clamp(1.2rem,2vw,1.6rem)] leading-snug group-hover:text-gold">
                      {s.title}
                    </h3>
                    <span
                      className={`shrink-0 font-mono text-[10px] uppercase tracking-widest ${n ? "text-gold" : "text-steel"}`}
                    >
                      {n ? `${n} ${unit}${n > 1 ? "s" : ""}` : "Publishing soon"}
                    </span>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">{s.body}</p>
                  <span className="mt-5 font-mono text-[10px] uppercase tracking-widest text-gold">
                    {`Open ${s.title.toLowerCase()} →`}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-8 flex flex-wrap items-center gap-3 text-xs text-steel">
          <Pending>
            Documentaries, press releases and coverage pending approved material from Edge
          </Pending>
          <span>
            Sections open with their structure in place so material can be published as it is
            approved.
          </span>
        </p>
      </section>

      {/* Insights are not one of the six sections, but visitors look for them
          here, so the latest three are surfaced with a route through. */}
      <section className="border-t border-rule bg-paper-2/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <SectionHead eyebrow="Insights" title="Latest from the team" />
            </div>
            {allInsightsLabel(posts.length) ? (
              <Link
                href="/blog"
                className="rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold"
              >
                {allInsightsLabel(posts.length)}
              </Link>
            ) : null}
          </div>
          <ul className="mt-9 grid gap-3 sm:grid-cols-3">
            {latest.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog#post-${p.slug}`}
                  className="eg-inview group flex h-full flex-col rounded-2xl bg-paper p-6 transition hover:-translate-y-1"
                >
                  <span className="font-display text-lg leading-snug group-hover:text-gold">
                    {p.title}
                  </span>
                  <span className="mt-2.5 flex-1 text-[13px] leading-relaxed text-ink/70">
                    {teaser(p.body, 150)}
                  </span>
                  <span className="mt-4 font-mono text-[10px] uppercase tracking-widest text-gold">
                    Read &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClosingCta
        title="Looking for a document we have not published?"
        body="Company profile, solution datasheets, compliance documentation and references are shared directly on request."
        primary={{ href: "/contact", label: "Request a document" }}
        secondary={{ href: "/downloads", label: "See available downloads" }}
        accent="#0b6fa8"
      />
    </main>
  );
}
