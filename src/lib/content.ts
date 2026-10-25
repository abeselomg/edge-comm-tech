import { cache } from "react";
import { getPayload, type Where } from "payload";
import config from "@payload-config";
import type {
  AcademyTrack,
  CareersContent,
  Client,
  Company,
  ContactDetail,
  Download,
  Event,
  Form,
  Job,
  News,
  PageCopy,
  Partner,
  PartnerCategory,
  Post,
  PostCategory,
  Project,
  Service,
  SiteSetting,
  Solution,
} from "@/payload-types";
import { isDraft } from "./draft";
import { eventStatus, type EventStatus } from "./events";
import { FORM_DEFINITIONS, type FormKey } from "./forms/definitions";
import { approvedLogo } from "./media";

export type {
  AcademyTrack,
  CareersContent,
  Client,
  Company,
  ContactDetail,
  Download,
  Event,
  Form,
  Job,
  News,
  PageCopy,
  Partner,
  PartnerCategory,
  Post,
  PostCategory,
  Project,
  Service,
  SiteSetting,
  Solution,
};

/*
 * Every read the public site makes. Routes import from here and never call
 * Payload directly, so the published-only filter and the logo approval gate
 * cannot be forgotten in one route.
 *
 * Only published documents reach the public site. The Local API defaults to
 * overrideAccess: true, so the access rules in src/access are not enough on
 * their own -- every read below filters on _status explicitly. Do not remove
 * that filter to "simplify" a query. The one exception is an editor's preview
 * in Next draft mode; see readMode() below.
 */

const payloadClient = cache(async () => getPayload({ config }));

export const PUBLISHED = { _status: { equals: "published" } } as const;

/*
 * Order comes from the field, not from the database's own idea of it.
 *
 * Almost nothing on this site is alphabetical or chronological: the solutions
 * are numbered on the card, the home page shows six featured projects in a set
 * sequence, and the three news items carry the dates "2018", "Evergreen" and
 * "Date to confirm". Highland encoded that sequence as the position in a
 * hand-written array; here it is the `order` field every seeded collection
 * carries. Without this sort Postgres returns rows in whatever order it
 * likes, which looks right on one page load and shuffles on the next.
 *
 * Events sort by order too, not by date. Highland groups them by status and
 * keeps the approved sequence inside each group, and an approved sequence that
 * is not chronological is a decision to respect rather than correct.
 */
const byOrder = { sort: "order" } as const;

/*
 * Published-only, unless this request is an editor's preview (Phase 7).
 *
 * In draft mode -- which only the staff-only /preview route can switch on, see
 * src/lib/draft.ts -- the read asks Payload for the latest version of each
 * document (`draft: true`) and drops the _status filter, so a draft-only
 * document and the unpublished edits to a published one both show. Everywhere
 * else, including the build and ISR revalidation, isDraft() is false and the
 * filter applies. PUBLISHED is spread last so no caller's where clause can
 * override it.
 *
 * The flag is read inside each reader call rather than once, and the readers
 * are wrapped in React's cache(), which memoises per server request. One
 * request has one draft-mode state, so a preview cannot hand its result to a
 * public render.
 *
 * Media approval is a content rule, not a publishing one: the logo gate below
 * applies in draft mode too.
 */
async function readMode(where: Where = {}): Promise<{ where: Where; draft?: true }> {
  return (await isDraft()) ? { where, draft: true } : { where: { ...where, ...PUBLISHED } };
}

/*
 * The published filter applies to the top-level documents only. Payload's
 * depth populate does not re-apply it to the documents it pulls in, so a
 * published post arrives carrying its draft-only category, label and all --
 * measured live on the review server in Phase 7 (/blog printed the label of a
 * draft-only postCategory). Outside draft mode every result therefore goes
 * through dropUnpublishedRelations() before a route sees it.
 *
 * A nested object counts as a populated related document when it has an `id`
 * and a `_status` key; one whose status is anything but "published" (a null
 * status included -- fail closed, as publishedOnly() in routes.ts does) is
 * removed: a single relationship becomes null, and an entry of a hasMany is
 * dropped from its array. Objects without `_status` -- media, users, groups,
 * array rows, blocks, rich text -- are kept, and walked for related documents
 * further down. The document passed in is not judged itself; the readers have
 * already filtered it.
 *
 * The walk copies rather than mutates (the Local API's result may be shared
 * with Payload's own caches), maps each input object to one copy so a cycle
 * terminates on the copy already made, and stops at MAX_RELATION_DEPTH. Past
 * the bound it returns null instead of the subtree: depth-2 data never gets
 * near it, and an unfiltered subtree is the one outcome that must not happen.
 *
 * The per-page publishedOnly() guards stay; they also keep a link from being
 * rendered to a related document that is published but whose own status a
 * shallow read could not show.
 */
const MAX_RELATION_DEPTH = 32;
const DROP = Symbol("drop");

const isObject = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === "object" && !(v instanceof Date);

const isUnpublishedRelation = (v: Record<string, unknown>) =>
  !Array.isArray(v) && "id" in v && "_status" in v && v._status !== "published";

function walk(value: unknown, depth: number, seen: WeakMap<object, unknown>): unknown {
  if (!isObject(value)) return value;
  if (seen.has(value)) return seen.get(value);
  if (depth > MAX_RELATION_DEPTH) return null;
  if (depth > 0 && isUnpublishedRelation(value)) {
    seen.set(value, DROP);
    return DROP;
  }
  if (Array.isArray(value)) {
    const out: unknown[] = [];
    seen.set(value, out);
    for (const item of value) {
      const next = walk(item, depth + 1, seen);
      if (next !== DROP) out.push(next);
    }
    return out;
  }
  const out: Record<string, unknown> = {};
  seen.set(value, out);
  for (const [key, child] of Object.entries(value)) {
    const next = walk(child, depth + 1, seen);
    out[key] = next === DROP ? null : next;
  }
  return out;
}

export function dropUnpublishedRelations<T>(doc: T): T {
  return walk(doc, 0, new WeakMap()) as T;
}

/** The read's result as a public page may see it: drafts only inside draft mode. */
const forMode = <T>(docs: unknown[], mode: { draft?: true }): T[] =>
  (mode.draft ? docs : docs.map((d) => dropUnpublishedRelations(d))) as T[];

/*
 * `extra` is the per-reader options -- today only the sort. Only `sort` is
 * taken from it: the type forbids `where` and `draft`, and even a caller that
 * casts around the type cannot pass them through, since nothing else is read
 * and the read mode is spread last. So no caller can replace the published
 * filter or force a draft read. Exported for content.test.ts only; routes use
 * the named readers below.
 */
export async function many<T>(collection: string, extra: { sort?: string } = {}): Promise<T[]> {
  const payload = await payloadClient();
  const { sort } = extra;
  const mode = await readMode();
  const { docs } = await payload.find({
    collection: collection as never,
    limit: 200,
    depth: 2,
    ...(sort ? { sort } : {}),
    ...mode,
  });
  return forMode<T>(docs, mode);
}

async function one<T>(collection: string, slug: string): Promise<T | null> {
  const payload = await payloadClient();
  const mode = await readMode({ slug: { equals: slug } });
  const { docs } = await payload.find({
    collection: collection as never,
    ...mode,
    limit: 1,
    depth: 2,
  });
  return forMode<T>(docs, mode)[0] ?? null;
}

/* ---------------------------------------------------------------- globals */

/*
 * The globals publish immediately (versions.drafts false on Company, Careers,
 * Contact details and Page copy; Site settings has no versions), so there is
 * no draft to read and these never pass `draft`, in draft mode or not. If a
 * global gains drafts, its reader must pass `draft: await isDraft()` --
 * content.test.ts fails until it does.
 */

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await payloadClient();
  return payload.findGlobal({ slug: "site-settings", depth: 1 });
});

export const getCompany = cache(async (): Promise<Company> => {
  const payload = await payloadClient();
  return payload.findGlobal({ slug: "company", depth: 1 });
});

export const getContactDetails = cache(async (): Promise<ContactDetail> => {
  const payload = await payloadClient();
  return payload.findGlobal({ slug: "contact-details", depth: 1 });
});

export const getCareersContent = cache(async (): Promise<CareersContent> => {
  const payload = await payloadClient();
  return payload.findGlobal({ slug: "careers-content", depth: 1 });
});

export const getPageCopy = cache(async (): Promise<PageCopy> => {
  const payload = await payloadClient();
  return payload.findGlobal({ slug: "page-copy", depth: 1 });
});

/* ----------------------------------------------- solutions and services */

export const getSolutions = cache(() => many<Solution>("solutions", byOrder));
export const getSolution = cache((slug: string) => one<Solution>("solutions", slug));
export const getServices = cache(() => many<Service>("services", byOrder));
export const getService = cache((slug: string) => one<Service>("services", slug));

/* ---------------------------------------------------------- the evidence */

export const getProjects = cache(() => many<Project>("projects", byOrder));
export const getProject = cache((slug: string) => one<Project>("projects", slug));

/*
 * Clients and partners carry logos, so both strip assets whose approval has
 * been withdrawn. A null logo is the intended state for most of them: the
 * page sets the institution's or brand's name in the same frame.
 */
export type WithLogo<T> = Omit<T, "logo"> & { logo: ReturnType<typeof approvedLogo> };

export const getClients = cache(async (): Promise<WithLogo<Client>[]> => {
  const docs = await many<Client>("clients", byOrder);
  return docs.map((c) => ({ ...c, logo: approvedLogo(c.logo) }));
});

export const getPartners = cache(async (): Promise<WithLogo<Partner>[]> => {
  const docs = await many<Partner>("partners", byOrder);
  return docs.map((p) => ({ ...p, logo: approvedLogo(p.logo) }));
});

export const getPartnerCategories = cache(() =>
  many<PartnerCategory>("partnerCategories", byOrder),
);

/* ------------------------------------------------------------- editorial */

export const getPosts = cache(() => many<Post>("posts", byOrder));
export const getPostCategories = cache(() => many<PostCategory>("postCategories", byOrder));
export const getNews = cache(() => many<News>("news", byOrder));
export const getNewsItem = cache((slug: string) => one<News>("news", slug));

/*
 * Status is derived on read, never stored -- see src/lib/events.ts. That is
 * why it is attached here rather than left to each page: three pages show
 * event status and they must not disagree.
 */
export type EventWithStatus = Event & { status: EventStatus };

export const getEvents = cache(async (): Promise<EventWithStatus[]> => {
  const docs = await many<Event>("events", byOrder);
  return docs.map((e) => ({ ...e, status: eventStatus(e) }));
});

export const getEvent = cache(async (slug: string): Promise<EventWithStatus | null> => {
  const doc = await one<Event>("events", slug);
  return doc ? { ...doc, status: eventStatus(doc) } : null;
});

export const getDownloads = cache(() => many<Download>("downloads", byOrder));

/* ---------------------------------------------------------------- people */

export const getJobs = cache(() => many<Job>("jobs", byOrder));
export const getJob = cache((slug: string) => one<Job>("jobs", slug));
export const getAcademyTracks = cache(() => many<AcademyTrack>("academyTracks", byOrder));

/* ----------------------------------------------------------------- forms */

/**
 * A form is a plugin-form-builder document so Edge staff can add or reorder
 * fields without a deploy. `forms` has no draft status, so there is nothing to
 * filter: a form either exists and is live, or it was never seeded. A missing
 * one throws rather than rendering a page with no way to reach Edge, and it is
 * found by its seeded title, the same lookup the submission route makes.
 */
export const getForm = cache(async (key: FormKey): Promise<Form> => {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "forms",
    where: { title: { equals: FORM_DEFINITIONS[key].title } },
    limit: 1,
    depth: 0,
  });
  if (!docs[0]) throw new Error(`The "${key}" form is not in the forms collection. Run the forms seed.`);
  return docs[0];
});
