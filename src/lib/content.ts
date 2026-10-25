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

async function many<T>(collection: string, extra: Record<string, unknown> = {}): Promise<T[]> {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: collection as never,
    ...(await readMode()),
    limit: 200,
    depth: 2,
    ...extra,
  });
  return docs as T[];
}

async function one<T>(collection: string, slug: string): Promise<T | null> {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: collection as never,
    ...(await readMode({ slug: { equals: slug } })),
    limit: 1,
    depth: 2,
  });
  return (docs[0] as T) ?? null;
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
