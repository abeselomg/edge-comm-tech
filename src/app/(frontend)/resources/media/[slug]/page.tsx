import { buildMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClosingCta, Crumb, PageHead, Pending, SectionHead } from "@/components/ui";
import { getContactDetails, getNews, getPageCopy } from "@/lib/content";
import { emailByLabel, mediaHref } from "@/lib/routes";
import {
  isMediaKey,
  MEDIA_KEYS,
  MEDIA_SHAPES,
  MediaEmpty,
  PublishedNow,
  siblingSections,
} from "../media-parts";

/*
 * One template, three media sections: documentaries, press releases, coverage.
 *
 * None has approved items yet, so each renders its structure and an honest empty
 * state. Only the three media keys exist: /resources/media/news is a 404 even
 * though `news` is a resource section, because it has its own page. The page
 * 404s those itself rather than setting dynamicParams = false, which makes a
 * revalidated page unrecoverable (NoFallbackError) until the next deploy.
 */

export function generateStaticParams() {
  return MEDIA_KEYS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isMediaKey(slug)) return {};
  const copy = await getPageCopy();
  const section = copy.resourceSections?.find((s) => s.key === slug);
  return section
    ? buildMetadata({
        title: section.title,
        description: MEDIA_SHAPES[slug].intro,
        path: mediaHref(slug),
      })
    : {};
}

export default async function MediaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isMediaKey(slug)) notFound();
  const [copy, news, contact] = await Promise.all([getPageCopy(), getNews(), getContactDetails()]);
  const sections = copy.resourceSections ?? [];
  const section = sections.find((s) => s.key === slug);
  if (!section) notFound();
  const s = MEDIA_SHAPES[slug];
  const email = emailByLabel(contact, /sales/i);

  return (
    <main>
      <PageHead
        eyebrow={s.lead}
        title={section.title}
        intro={s.intro}
        accent={s.accent}
        variant={s.variant}
        crumb={
          <Crumb trail={[{ label: "Resources", href: "/resources" }, { label: section.title }]} />
        }
        meta={
          <p className="eg-rise mt-6">
            <Pending>Material pending approval from Edge</Pending>
          </p>
        }
      />

      <div className="mx-auto max-w-5xl px-6 py-16">
        <MediaEmpty shape={s} />

        <section className="mt-16">
          <SectionHead
            eyebrow="What will appear here"
            title="The material this section will carry"
            accent={s.accent}
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {s.expect.map(([t, b]) => (
              <div key={t} className="eg-inview flex flex-col rounded-2xl bg-paper-2 p-6">
                <h3 className="font-display text-base leading-snug">{t}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/70">{b}</p>
              </div>
            ))}
          </div>
          <p className="mt-7 max-w-2xl text-sm leading-relaxed text-ink/70">{s.ask}</p>
        </section>

        <PublishedNow news={news} />

        <nav className="mt-14 grid gap-3 sm:grid-cols-2">
          {siblingSections(sections, slug).map((o) => (
            <Link
              key={o.key}
              href={o.href}
              className="eg-inview flex items-center justify-between gap-4 rounded-2xl border border-rule px-6 py-5 transition hover:border-gold hover:text-gold"
            >
              <span>
                <span className="block font-display text-base">{o.title}</span>
                <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-widest text-steel">
                  {isMediaKey(o.key) ? MEDIA_SHAPES[o.key].lead : ""}
                </span>
              </span>
              <span aria-hidden="true" className="text-gold">
                &rarr;
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <ClosingCta
        title="Media and press enquiries"
        body={
          <>
            For interviews, statements, company information or approved media assets, email{" "}
            {email ? (
              <a
                href={`mailto:${email}`}
                className="underline decoration-rule underline-offset-2 hover:text-gold"
              >
                {email}
              </a>
            ) : null}{" "}
            or use the contact form.
          </>
        }
        primary={{ href: "/contact", label: "Contact our team" }}
        secondary={{ href: "/resources", label: "Back to resources" }}
        accent={s.accent}
      />
    </main>
  );
}
