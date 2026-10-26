import type { Event, Job, News, Post, Project, Service, Solution } from "@/payload-types";
import { paragraphs } from "@/lib/lexical-text";
import { eventHref, jobHref, newsHref, projectHref, serviceHref, solutionHref } from "@/lib/routes";
import { clean, oneLine, type JsonObject } from "./clean";
import { absoluteUrl, orgId } from "./url";

/*
 * Per-document builders. Each describes one published document that the page
 * shows, using only fields the document has; a field it lacks is omitted, never
 * invented. No prices, ratings, reviews or awards appear anywhere here: the
 * content has none to describe.
 *
 * Builders return a node without @context; graph() wraps them.
 */

const org = () => ({ "@id": orgId() });

/**
 * Structured data describes published content only. A document that is not
 * explicitly published (a draft shown in an editor's preview, or a read that
 * carries no status) yields no node. Fails closed, like publishedOnly().
 */
type Versioned = { _status?: string | null };
const live = (d: Versioned) => d._status === "published";

/** A year or a full date, as ISO 8601; anything else ("Evergreen") is dropped. */
export function isoDate(raw: string | null | undefined): string | undefined {
  const t = raw?.trim();
  if (!t) return undefined;
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(t)) return t;
  if (/^\d{4}-\d{2}-\d{2}T/.test(t) && !Number.isNaN(Date.parse(t))) return t;
  return undefined;
}

/** The calendar day of an ISO timestamp, so a UTC midnight cannot shift a day. */
const day = (raw: string | null | undefined): string | undefined => {
  const m = /^\d{4}-\d{2}-\d{2}/.exec(raw?.trim() ?? "");
  return m?.[0];
};

function service(
  doc: Pick<Solution | Service, "title" | "blurb" | "slug" | "_status">,
  href: string,
): JsonObject | undefined {
  if (!live(doc)) return undefined;
  return (
    clean({
      "@type": "Service",
      "@id": `${absoluteUrl(href)}#service`,
      name: oneLine(doc.title),
      description: oneLine(doc.blurb),
      url: absoluteUrl(href),
      provider: org(),
      areaServed: { "@type": "Country", name: "Ethiopia" },
    })
  );
}

export const solutionService = (s: Pick<Solution, "title" | "blurb" | "slug" | "_status">) =>
  service(s, solutionHref(s.slug));

export const professionalService = (s: Pick<Service, "title" | "blurb" | "slug" | "_status">) =>
  service(s, serviceHref(s.slug));

/**
 * A news item. Undefined while it is held for publication: such an article
 * presents itself as incomplete on the page, and marking it up as a finished
 * article would say more than the page does.
 */
export function newsArticle(
  n: Pick<News, "title" | "slug" | "standfirst" | "date" | "updatedAt" | "heldForPublication" | "_status">,
): JsonObject | undefined {
  if (!live(n) || n.heldForPublication) return undefined;
  const url = absoluteUrl(newsHref(n.slug));
  return clean({
    "@type": "NewsArticle",
    "@id": `${url}#article`,
    headline: oneLine(n.title),
    description: oneLine(n.standfirst),
    datePublished: n.date?.status === "confirmed" ? isoDate(n.date.value) : undefined,
    dateModified: isoDate(n.updatedAt),
    author: org(),
    publisher: org(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  });
}

/** A blog post. Posts are anchors on /blog, not pages, and carry no published date. */
export function blogPosting(
  p: Pick<Post, "title" | "slug" | "body" | "updatedAt" | "_status">,
): JsonObject | undefined {
  if (!live(p)) return undefined;
  const url = absoluteUrl(`/blog#post-${p.slug}`);
  return (
    clean({
      "@type": "BlogPosting",
      "@id": url,
      headline: oneLine(p.title),
      description: oneLine(paragraphs(p.body)[0]),
      dateModified: isoDate(p.updatedAt),
      author: org(),
      publisher: org(),
      mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl("/blog") },
      url,
    })
  );
}

const TBC = /to be confirmed|\btbc\b|\btba\b/i;

export function event(
  e: Pick<Event, "title" | "slug" | "intro" | "startsOn" | "endsOn" | "format" | "venue" | "_status">,
): JsonObject | undefined {
  if (!live(e)) return undefined;
  const start = day(e.startsOn);
  if (!start) return undefined;
  const end = day(e.endsOn);
  const url = absoluteUrl(eventHref(e.slug));
  const venue = oneLine(e.venue);
  const known = venue && !TBC.test(venue) ? venue : undefined;

  const place = known ? { "@type": "Place", name: known, address: known } : undefined;
  const online = { "@type": "VirtualLocation", url };
  const mode = {
    Online: "https://schema.org/OnlineEventAttendanceMode",
    "In person": "https://schema.org/OfflineEventAttendanceMode",
    Hybrid: "https://schema.org/MixedEventAttendanceMode",
  }[e.format];
  const location =
    e.format === "Online" ? online : e.format === "Hybrid" ? [place, online] : place;

  return clean({
    "@type": "Event",
    "@id": `${url}#event`,
    name: oneLine(e.title),
    description: oneLine(e.intro),
    startDate: start,
    endDate: end && end > start ? end : undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: mode,
    location,
    organizer: org(),
    url,
  });
}

const EMPLOYMENT: [RegExp, string][] = [
  [/full[\s-]?time/i, "FULL_TIME"],
  [/part[\s-]?time/i, "PART_TIME"],
  [/contract/i, "CONTRACTOR"],
  [/temporary|temp\b/i, "TEMPORARY"],
  [/intern/i, "INTERN"],
  [/volunteer/i, "VOLUNTEER"],
  [/per[\s-]?diem/i, "PER_DIEM"],
];

/** schema.org employmentType for the free-text `type`, or undefined when unrecognised. */
export function employmentType(type: string | null | undefined): string | undefined {
  const t = type ?? "";
  return EMPLOYMENT.find(([re]) => re.test(t))?.[1];
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function jobDescription(j: Job): string | undefined {
  const list = (title: string, items: { item: string }[] | null | undefined) =>
    items?.length
      ? `<p>${esc(title)}</p><ul>${items.map((i) => `<li>${esc(i.item)}</li>`).join("")}</ul>`
      : "";
  const html = [
    j.purpose ? `<p>${esc(j.purpose)}</p>` : "",
    j.scope ? `<p>${esc(j.scope)}</p>` : "",
    list("Responsibilities", j.responsibilities),
    list("Required", j.required),
    list("Preferred", j.preferred),
  ].join("");
  return html || undefined;
}

/**
 * A vacancy. Undefined once the confirmed deadline has passed (`open` false):
 * a closed role shows no application form, and a JobPosting for it would
 * advertise a job that cannot be applied for. `directApply` is true because
 * the application form is on the page itself.
 *
 * `datePosted` is the document's creation date: the CMS records no separate
 * posting date. `validThrough` is emitted only for a confirmed, ISO deadline.
 */
export function jobPosting(j: Job, open: boolean, orgName = "Edge Comm-Tech"): JsonObject | undefined {
  if (!open || !live(j)) return undefined;
  const url = absoluteUrl(jobHref(j.slug));
  const [locality] = (j.location ?? "").split(",").map((p) => p.trim());
  const ethiopia = /ethiopia|addis/i.test(j.location ?? "");
  const deadline = j.deadline?.status === "confirmed" ? isoDate(j.deadline.value) : undefined;
  return clean({
    "@type": "JobPosting",
    "@id": `${url}#job`,
    title: oneLine(j.title),
    description: jobDescription(j),
    datePosted: day(j.createdAt),
    validThrough: deadline,
    employmentType: employmentType(j.type),
    hiringOrganization: { "@type": "Organization", "@id": orgId(), name: oneLine(orgName) },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: oneLine(locality),
        addressCountry: ethiopia ? "ET" : undefined,
      },
    },
    directApply: true,
    url,
  });
}

/** A delivered project, as a CreativeWork. `client` is the client's display name. */
export function projectWork(
  p: Pick<Project, "title" | "slug" | "summary" | "location" | "year" | "updatedAt" | "_status">,
  client?: string | null,
): JsonObject | undefined {
  if (!live(p)) return undefined;
  const url = absoluteUrl(projectHref(p.slug));
  const year = p.year?.status === "confirmed" ? p.year.value?.trim() : undefined;
  return (
    clean({
      "@type": "CreativeWork",
      "@id": `${url}#project`,
      name: oneLine(p.title),
      description: oneLine(p.summary),
      dateCreated: year && /^\d{4}$/.test(year) ? year : undefined,
      dateModified: isoDate(p.updatedAt),
      contentLocation: p.location ? { "@type": "Place", name: oneLine(p.location) } : undefined,
      about: client ? { "@type": "Organization", name: oneLine(client) } : undefined,
      creator: org(),
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      url,
    })
  );
}
