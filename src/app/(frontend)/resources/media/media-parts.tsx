import Link from "next/link";
import { newsHref } from "@/lib/routes";
import type { News, PageCopy } from "@/payload-types";

/*
 * The media sections' own pieces, beside the page because Next allows a page
 * only its known exports.
 *
 * One template serves three sections: documentaries, press releases and
 * coverage. None has approved items yet. Rather than three near-identical pages
 * -- or three pages that pretend to hold something -- each is a working section
 * with its structure visible, an honest empty state, and the route a visitor
 * actually needs from here. SHAPES holds only what differs between the three;
 * the titles and bodies come from the resource centre in the CMS.
 */

export const MEDIA_KEYS = ["documentaries", "press-releases", "coverage"] as const;
export type MediaKey = (typeof MEDIA_KEYS)[number];

export const isMediaKey = (key: string): key is MediaKey =>
  (MEDIA_KEYS as readonly string[]).includes(key);

export type MediaShape = {
  accent: string;
  variant: "beam" | "rule" | "wash";
  lead: string;
  intro: string;
  empty: string;
  expect: readonly (readonly [string, string])[];
  ask: string;
};

export const MEDIA_SHAPES: Record<MediaKey, MediaShape> = {
  documentaries: {
    accent: "#2ba8de",
    variant: "beam",
    lead: "Short films about the work",
    intro:
      "Documentary videos covering project delivery, client environments, technology explainers and the people behind the engineering.",
    empty: "No documentary videos are published yet.",
    expect: [
      [
        "Project films",
        "How an engagement was scoped, delivered and handed over, filmed on site with the client's consent.",
      ],
      [
        "Technology explainers",
        "Short pieces on what a technology does and what it requires to run well.",
      ],
      ["Team and practice", "The engineers, the methodology and the standards the work is held to."],
    ],
    ask: "If you would like to feature a delivered project, or need footage for an institutional presentation, talk to us.",
  },
  "press-releases": {
    accent: "#056a9a",
    variant: "rule",
    lead: "Official statements",
    intro:
      "Formal company statements on milestones, partnerships, appointments, major project awards and corporate developments.",
    empty: "No press releases are published yet.",
    expect: [
      [
        "Corporate announcements",
        "Company milestones, structural changes and strategic developments.",
      ],
      [
        "Partnership statements",
        "New manufacturer, distributor and institutional relationships, once both parties approve the wording.",
      ],
      [
        "Project awards",
        "Major engagements, published only where the client has agreed to the announcement.",
      ],
    ],
    ask: "Journalists and editors can request a statement, company information or an interview directly.",
  },
  coverage: {
    accent: "#0b6fa8",
    variant: "wash",
    lead: "Edge in the press",
    intro:
      "Articles, interviews, panel appearances and third-party mentions of Edge Comm-Tech in Ethiopian and international media.",
    empty: "No media coverage is catalogued here yet.",
    expect: [
      [
        "Interviews and comment",
        "Where our team has been asked to comment on technology, infrastructure or digital transformation.",
      ],
      [
        "Event and panel appearances",
        "Conferences, exhibitions and institutional forums the team has taken part in.",
      ],
      [
        "Third-party articles",
        "Coverage published by others, linked to the original source rather than reproduced.",
      ],
    ],
    ask: "If you have covered Edge Comm-Tech and would like the mention catalogued here, send us the link.",
  },
};

type Section = NonNullable<PageCopy["resourceSections"]>[number];

/** The other two media sections, in the order the resource centre lists them. */
export function siblingSections(sections: Section[], key: MediaKey): Section[] {
  return sections.filter((s) => isMediaKey(s.key) && s.key !== key);
}

/** The honest empty state: the structure is here; the items are not. */
export function MediaEmpty({ shape: s }: { shape: MediaShape }) {
  return (
    <section
      className="rounded-3xl border border-dashed p-10 text-center"
      style={{ borderColor: `${s.accent}55`, background: `${s.accent}08` }}
    >
      <svg
        viewBox="0 0 24 24"
        className="mx-auto h-8 w-8"
        fill="none"
        stroke={s.accent}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 4v5" />
      </svg>
      <h2 className="mt-4 font-display text-xl">{s.empty}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/70">
        This section is built and ready. Items appear as soon as Edge Comm-Tech approves the
        material, with its source and review recorded.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/subscribe"
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-white"
          style={{ background: s.accent }}
        >
          Tell me when it is published
        </Link>
        <Link
          href="/news"
          className="rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold"
        >
          Read company news
        </Link>
      </div>
    </section>
  );
}

/** Something to actually read, so the page is not a dead end. */
export function PublishedNow({ news }: { news: News[] }) {
  const shown = news.slice(0, 2);
  if (!shown.length) return null;
  return (
    <section className="mt-16 border-t border-rule pt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-steel">Published now</p>
        <Link href="/news" className="font-mono text-[10px] uppercase tracking-widest text-gold">
          All news &rarr;
        </Link>
      </div>
      <ul className="mt-5 divide-y divide-rule">
        {shown.map((n) => (
          <li key={n.slug}>
            <Link
              href={newsHref(n.slug)}
              className="group grid gap-x-8 gap-y-1.5 py-5 lg:grid-cols-[8rem_1fr]"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-steel">
                {n.kind}
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
