import { buildMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import { ClosingCta, Crumb, PageHead } from "@/components/ui";
import { getNews } from "@/lib/content";
import { mediaHref } from "@/lib/routes";
import { ArchiveBand, NewsRow, splitArchive } from "./news-parts";

/*
 * News and announcements.
 *
 * Three approved records. One is a 2018 milestone kept deliberately in an
 * archive band rather than presented as current news; one is undated and says so
 * instead of carrying a plausible-looking date.
 */

export const metadata = buildMetadata({
  title: "News and Announcements — Edge Comm-Tech",
  description:
    "Company milestones, strategic updates, partnership and project announcements, and perspectives on Ethiopia's digital transformation from Edge Comm-Tech.",
  path: "/news",
});

const MEDIA = [
  ["press-releases", "Press releases"],
  ["coverage", "Media coverage"],
] as const;

export default async function NewsPage() {
  const { current, archive } = splitArchive(await getNews());

  return (
    <main>
      <PageHead
        eyebrow="News and announcements"
        title="What is happening at Edge Comm-Tech"
        intro="Company milestones, strategic updates, partnerships, project announcements, participation in national technology initiatives, and perspectives on Ethiopia's digital transformation."
        accent="#0b6fa8"
        variant="rule"
        crumb={<Crumb trail={[{ label: "Resources", href: "/resources" }, { label: "News" }]} />}
      />

      <div className="mx-auto max-w-6xl px-6 py-16">
        {current.length ? (
          <ul>
            {current.map((n, i) => (
              <NewsRow key={n.slug} item={n} lead={i === 0} />
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl bg-paper-2 px-6 py-5 text-sm text-steel">
            There is no current news right now. Subscribe and we will send the next announcement
            when it is ready.
          </p>
        )}

        <ArchiveBand items={archive} />

        <div className="mt-14 grid gap-3 sm:grid-cols-2">
          {MEDIA.map(([slug, label]) => (
            <Link
              key={slug}
              href={mediaHref(slug)}
              className="eg-inview flex items-center justify-between gap-4 rounded-2xl border border-rule px-6 py-5 transition hover:border-gold hover:text-gold"
            >
              <span className="font-display text-base">{label}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-steel">
                Publishing soon
              </span>
            </Link>
          ))}
        </div>
      </div>

      <ClosingCta
        title="Press and media enquiries"
        body="For interviews, statements, company information or media assets, contact our team and we will respond with the appropriate material."
        primary={{ href: "/contact", label: "Contact the team" }}
        secondary={{ href: "/subscribe", label: "Subscribe for updates" }}
        accent="#0b6fa8"
      />
    </main>
  );
}
