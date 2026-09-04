import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import type {
  Course,
  Job,
  News,
  Partner,
  Project,
  Sector,
  Solution,
  CompanyPage,
  HomePage,
  SiteSetting,
} from "@/payload-types";

export type { Course, Job, News, Partner, Project, Sector, Solution, CompanyPage, HomePage, SiteSetting };

const payloadClient = cache(async () => getPayload({ config }));

/**
 * Only published documents reach the public site. The Local API defaults to
 * overrideAccess: true, so the access rules in src/access are not enough on
 * their own — every read below filters on _status explicitly.
 */
const PUBLISHED = { _status: { equals: "published" } } as const;

/* ---------------------------------------------------------------- globals */

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await payloadClient();
  return payload.findGlobal({ slug: "site-settings", depth: 1 });
});

export const getHomePage = cache(async (): Promise<HomePage> => {
  const payload = await payloadClient();
  return payload.findGlobal({ slug: "home-page", depth: 1 });
});

export const getCompanyPage = cache(async (): Promise<CompanyPage> => {
  const payload = await payloadClient();
  return payload.findGlobal({ slug: "company-page", depth: 1 });
});

/* ------------------------------------------------------------- solutions */

export const getSolutions = cache(async (): Promise<Solution[]> => {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "solutions",
    where: PUBLISHED,
    sort: "order",
    limit: 50,
    depth: 1,
  });
  return docs;
});

export const getSolution = cache(async (slug: string): Promise<Solution | null> => {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "solutions",
    where: { ...PUBLISHED, slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  return docs[0] ?? null;
});

/* --------------------------------------------------------------- partners */

export const getPartners = cache(async (): Promise<Partner[]> => {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "partners",
    where: PUBLISHED,
    sort: "name",
    limit: 200,
    depth: 1,
  });
  return docs;
});

/* ---------------------------------------------------------------- sectors */

export const getSectors = cache(async (): Promise<Sector[]> => {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "sectors",
    where: PUBLISHED,
    sort: "order",
    limit: 50,
    depth: 1,
  });
  return docs;
});

export const getSector = cache(async (slug: string): Promise<Sector | null> => {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "sectors",
    where: { ...PUBLISHED, slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  return docs[0] ?? null;
});

/* --------------------------------------------------------------- projects */

export const getProjects = cache(async (): Promise<Project[]> => {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "projects",
    where: PUBLISHED,
    sort: "-year",
    limit: 100,
    depth: 1,
  });
  return docs;
});

export const getProject = cache(async (slug: string): Promise<Project | null> => {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "projects",
    where: { ...PUBLISHED, slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  return docs[0] ?? null;
});

/* ---------------------------------------------------------------- courses */

export const getCourses = cache(async (): Promise<Course[]> => {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "courses",
    where: PUBLISHED,
    sort: "order",
    limit: 100,
    depth: 1,
  });
  return docs;
});

export const getCourse = cache(async (slug: string): Promise<Course | null> => {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "courses",
    where: { ...PUBLISHED, slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  return docs[0] ?? null;
});

/* ------------------------------------------------------------------- jobs */

export const getJobs = cache(async (): Promise<Job[]> => {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "jobs",
    where: PUBLISHED,
    sort: "title",
    limit: 100,
    depth: 1,
  });
  return docs;
});

export const getJob = cache(async (slug: string): Promise<Job | null> => {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "jobs",
    where: { ...PUBLISHED, slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  return docs[0] ?? null;
});

/* ------------------------------------------------------------------- news */

export const getNews = cache(async (): Promise<News[]> => {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "news",
    where: PUBLISHED,
    sort: "-date",
    limit: 100,
    depth: 1,
  });
  return docs;
});

export const getNewsArticle = cache(async (slug: string): Promise<News | null> => {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "news",
    where: { ...PUBLISHED, slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  return docs[0] ?? null;
});

/* ---------------------------------------------------------------- helpers */

export type FlatLesson = NonNullable<
  NonNullable<Course["modules"]>[number]["lessons"]
>[number] & {
  moduleTitle: string;
  moduleIndex: number;
};

/** Every lesson in a course, in reading order, tagged with its module. */
export function flattenLessons(course: Course): FlatLesson[] {
  return (course.modules ?? []).flatMap((mod, moduleIndex) =>
    (mod.lessons ?? []).map((lesson) => ({
      ...lesson,
      moduleTitle: mod.title,
      moduleIndex,
    })),
  );
}

/** Extract the 11-character video id from a YouTube watch or youtu.be URL. */
export function youtubeId(url?: string | null): string {
  if (!url) return "";
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  return m?.[1] ?? "";
}

/** Domain codes render as 01–06, derived from sort order. */
export function domainCode(index: number): string {
  return String(index + 1).padStart(2, "0");
}

/** Proof statistics are hidden until someone at Edge marks them verified. */
export function verifiedStats(home: HomePage) {
  return (home.proofStats ?? []).filter((s) => s.verified);
}

/* ------------------------------------------------------------------ forms */

export type ContactForm = Awaited<ReturnType<typeof getContactForm>>;

/**
 * The contact form is a plugin-form-builder document so Edge staff can add or
 * reword fields without a deploy. Falls back to null if it has not been created.
 */
export const getContactForm = cache(async () => {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "forms",
    where: { title: { equals: "Contact" } },
    limit: 1,
    depth: 0,
  });
  return docs[0] ?? null;
});
