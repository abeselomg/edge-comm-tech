import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Confirmable } from "@/components/ui";
import { newsHref, publishedOnly } from "@/lib/routes";
import type { News } from "@/payload-types";

/*
 * The newsroom's own pieces, beside the pages because Next allows a page only
 * its known exports.
 */

/** Current items first, archived milestones apart, each keeping its stored order. */
export function splitArchive(items: News[]): { current: News[]; archive: News[] } {
  return {
    current: items.filter((n) => !n.archive),
    archive: items.filter((n) => n.archive),
  };
}

/** How an item's date reads: the date once confirmed, the pending label until then. */
export function dateText(date: News["date"] | null | undefined): string {
  if (date?.status === "confirmed" && date.value) return date.value;
  return date?.pendingLabel || "Date to confirm";
}

export function NewsRow({ item: n, lead = false }: { item: News; lead?: boolean }) {
  const Heading = lead ? "h2" : "h3";
  return (
    <li>
      <Link
        href={newsHref(n.slug)}
        className="eg-inview group grid gap-x-10 gap-y-3 border-t border-rule py-9 lg:grid-cols-[9rem_1fr]"
      >
        <div className="shrink-0">
          <span className="block font-mono text-[10px] uppercase tracking-widest text-gold">
            {n.kind}
          </span>
          <span className="mt-1.5 block text-xs text-steel">
            <Confirmable value={n.date} />
          </span>
        </div>
        <div className="min-w-0">
          <Heading
            className={`font-display ${lead ? "text-[clamp(1.4rem,2.6vw,2rem)]" : "text-[clamp(1.2rem,2vw,1.5rem)]"} leading-snug group-hover:text-gold`}
          >
            {n.title}
          </Heading>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink/70">{n.standfirst}</p>
          <span className="mt-4 inline-block font-mono text-[10px] uppercase tracking-widest text-gold">
            Read the announcement &rarr;
          </span>
        </div>
      </Link>
    </li>
  );
}

/** Older milestones, kept apart so they are not presented as current news. */
export function ArchiveBand({ items }: { items: News[] }) {
  if (!items.length) return null;
  return (
    <section className="mt-16 rounded-3xl bg-paper-2 p-8 sm:p-10">
      <p className="font-mono text-[10px] uppercase tracking-widest text-steel">From the archive</p>
      <h2 className="mt-2 font-display text-[clamp(1.3rem,2.4vw,1.8rem)]">Earlier milestones</h2>
      <ul className="mt-6 divide-y divide-rule">
        {items.map((n) => (
          <li key={n.slug}>
            <Link
              href={newsHref(n.slug)}
              className="group grid gap-x-8 gap-y-1.5 py-5 lg:grid-cols-[6rem_1fr]"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-steel">
                {dateText(n.date)}
              </span>
              <span className="min-w-0">
                <span className="block font-display text-base leading-snug group-hover:text-gold">
                  {n.title}
                </span>
                <span className="mt-1.5 block max-w-2xl text-[13px] leading-relaxed text-ink/65">
                  {n.standfirst}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * What a held item still needs before it can be published as complete.
 *
 * The third approved item is held until six details are supplied, and says so
 * rather than guessing at them (Review Focus #3).
 */
export function PendingDetails({ fields }: { fields: { item: string }[] | null | undefined }) {
  if (!fields?.length) return null;
  return (
    <section className="mt-4 rounded-2xl border border-lamp/30 bg-lamp/5 p-6">
      <p className="font-mono text-[10px] uppercase tracking-widest text-lamp">
        Details to add before publishing
      </p>
      <ul className="mt-4 grid gap-2 text-sm text-ink/75 sm:grid-cols-2">
        {fields.map((f) => (
          <li key={f.item} className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-lamp" />
            {f.item}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-steel">
        Edge Comm-Tech is not described as having accepted, signed, endorsed or committed to formal
        goals; no authorized record supports that wording yet.
      </p>
    </section>
  );
}

/** The article: running text, titled sections, outstanding details, closing block. */
export function ArticleBody({ item: n, accent }: { item: News; accent: string }) {
  const closing = n.closing;
  const hasClosing = Boolean(closing && (closing.title || closing.body));
  const links = (closing?.links ?? []).slice(0, 2);
  return (
    <>
      {n.body ? (
        <div className="eg-inview mb-6 space-y-6 text-lg leading-relaxed text-ink/80">
          <RichText data={n.body as never} />
        </div>
      ) : null}

      {(n.sections ?? []).map((s) => (
        <section key={s.title} className="eg-inview mb-10">
          <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>
            Priority
          </p>
          <h2 className="mt-2 font-display text-2xl">{s.title}</h2>
          <p className="mt-3 leading-relaxed text-ink/75">{s.body}</p>
        </section>
      ))}

      {n.heldForPublication ? <PendingDetails fields={n.pendingFields} /> : null}

      {hasClosing ? (
        <section className="mt-10 rounded-2xl bg-paper-2 p-6">
          {closing?.eyebrow ? (
            <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>
              {closing.eyebrow}
            </p>
          ) : null}
          {closing?.title ? <h2 className="mt-2 font-display text-2xl">{closing.title}</h2> : null}
          {closing?.body ? (
            <p className="mt-3 leading-relaxed text-ink/75">{closing.body}</p>
          ) : null}
          {links.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {links.map((l, i) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={
                    i === 0
                      ? "rounded-full px-4 py-2 text-xs font-semibold text-white"
                      : "rounded-full border border-rule px-4 py-2 text-xs font-semibold transition hover:border-gold hover:text-gold"
                  }
                  style={i === 0 ? { background: accent } : undefined}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </>
  );
}

export function MoreNews({ items, currentSlug }: { items: News[]; currentSlug: string }) {
  const others = publishedOnly<News>(items).filter((o) => o.slug !== currentSlug);
  if (!others.length) return null;
  return (
    <nav className="mt-14 border-t border-rule pt-8">
      <p className="font-mono text-[10px] uppercase tracking-widest text-steel">
        More from the newsroom
      </p>
      <ul className="mt-4 divide-y divide-rule">
        {others.map((o) => (
          <li key={o.slug}>
            <Link
              href={newsHref(o.slug)}
              className="group flex items-baseline justify-between gap-4 py-3.5"
            >
              <span className="font-display text-base group-hover:text-gold">{o.title}</span>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-steel">
                {o.kind}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
