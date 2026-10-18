import { getPayload } from "payload";
import type { Payload } from "payload";
import config from "../payload.config";

import { COMPANY, IMPACT, IMPACT_SUPPORT, VALUES, JOURNEY, DIFFERENTIATORS, DELIVERY, INDUSTRIES, SUSTAINABILITY, EXECUTIVE_ROLES, CONTACT, INQUIRY_CATEGORIES, NAV, SOLUTIONS, SERVICES, CLIENTS, CLIENT_SECTORS, PARTNERS, PARTNER_CATEGORIES, PROJECTS } from "../../design-src/highland/content.mjs";
import { SOLUTION_DETAIL, SERVICE_DETAIL } from "../../design-src/highland/detail.mjs";
import { IMPLEMENTATION, PROJECT_DETAIL } from "../../design-src/highland/project-detail.mjs";
import { BLOG_CATEGORIES, POSTS, NEWS, EVENTS, DOWNLOADS, RESOURCE_SECTIONS } from "../../design-src/highland/editorial.mjs";
import { CAREER_PATHWAYS, CULTURE, DEVELOPMENT, EXPERIENCE_POINTS, APPLICATION_DOCS, INTERNSHIP, ACADEMY_AUDIENCES, ACADEMY_TRACKS, ACADEMY_LEVELS, ACADEMY_DELIVERY, COURSE_SECTIONS, JOBS } from "../../design-src/highland/people.mjs";

import { decideWrite, makeResolver, type SeedMode, type SeedReport } from "./upsert";
import { eventDates, toConfirmable, toDetailBlocks, toItems, toRichParagraphs } from "./transform";

/*
 * Loads Edge's approved content into Payload from the Highland modules.
 *
 * Those modules are the record of what came from
 * Edge_Comm-Tech_Website_Content_Master_2026.pdf, so nothing here is retyped
 * and nothing is invented. design-src/content.json is NOT imported: it is a
 * NEXT IT-derived model from before the client's first correction.
 *
 * Modes (see ./upsert.ts): fill creates what is missing and leaves the rest,
 * force overwrites in place, fresh deletes first. Default is fill, so a
 * re-run cannot destroy an editor's work.
 */

const MODE = (process.argv.find((a) => /^--(fill|force|fresh)$/.test(a))?.slice(2) ??
  "fill") as SeedMode;

const SEEDED = [
  "partnerCategories", "postCategories", "solutions", "services", "clients",
  "projects", "partners", "posts", "news", "events", "downloads", "jobs",
  "academyTracks",
] as const;

type Slugged = (typeof SEEDED)[number];

/*
 * The Highland modules are plain .mjs, so TypeScript infers the exact literal
 * shape of each one: SOLUTION_DETAIL becomes an object with seven named keys
 * rather than a map, and indexing it with a slug variable is an error even
 * though that is precisely what it is for. These two helpers do the widening
 * once, at the boundary, instead of scattering casts through the seed.
 */
/*
 * Values are `any` deliberately, and this is the one place in the project
 * that is true. A detail record holds a different subset of about twenty-seven
 * keys depending on whether it describes a solution, a service or a project,
 * and the modules are untyped .mjs. An interface listing every key as optional
 * would be a fiction: it would claim a single shape that none of the three
 * records actually has, and it would still not catch a typo, because every
 * field would be optional. What does catch a mistake here is the field
 * validators refusing bad data on write, and `seed:verify` counting what
 * landed.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DetailRecord = Record<string, any>;

const detailFor = (map: object, slug: string): DetailRecord =>
  (map as unknown as Record<string, DetailRecord>)[slug] ?? {};

/** Highland stores these as 2-tuples; TypeScript widens them to string[]. */
const pairs = (rows: unknown): [string, string][] => rows as [string, string][];

async function write(
  payload: Payload,
  collection: Slugged,
  key: { field: string; value: string },
  data: Record<string, unknown>,
  report: SeedReport,
): Promise<number> {
  const { docs } = await payload.find({
    collection,
    where: { [key.field]: { equals: key.value } },
    limit: 1,
    depth: 0,
  });
  const existing = docs[0];
  const action = decideWrite(Boolean(existing), MODE);

  if (action === "skip") {
    report.skipped += 1;
    return existing.id as number;
  }
  if (action === "update") {
    const doc = await payload.update({
      collection,
      id: existing.id,
      data: { ...data, _status: "published" },
    });
    report.updated += 1;
    return doc.id as number;
  }
  /*
   * The assertion is on `data` alone, and it is narrower than it looks.
   * `collection` here is a union of thirteen slugs, so `create` asks that the
   * data satisfy every one of their required-field sets simultaneously —
   * something no single object can do. The callers below each build the right
   * shape for the one collection they are writing; this helper cannot see
   * that, and making it generic would only push the same unprovable claim out
   * to nineteen call sites reading untyped .mjs.
   *
   * What actually checks this is not TypeScript: it is the field validators,
   * which refuse a missing required field or a forbidden phrase on write, and
   * `seed:verify`, which counts what landed and fails on a dangling
   * relationship.
   */
  const doc = await payload.create({
    collection,
    data: { ...data, _status: "published" } as never,
  });
  report.created += 1;
  return doc.id as number;
}

async function seed() {
  const payload = await getPayload({ config });
  const report: SeedReport = { created: 0, updated: 0, skipped: 0 };

  if (MODE === "fresh") {
    payload.logger.info("fresh: clearing seeded collections");
    for (const collection of SEEDED) {
      await payload.delete({ collection, where: { id: { exists: true } } });
    }
  }

  /* ---------------------------------------------- 1. no dependencies */

  const categoryIds: { key: string; id: number }[] = [];
  for (const [key, label, description] of PARTNER_CATEGORIES) {
    const ringLabel = label.split(/\s+(?:and|&)\s+/)[0];
    categoryIds.push({
      key,
      id: await write(payload, "partnerCategories", { field: "key", value: key },
        { key, label, ringLabel, description, order: categoryIds.length + 1 }, report),
    });
  }
  const category = makeResolver("partner category", categoryIds);

  const postCatIds: { key: string; id: number }[] = [];
  for (const [key, label] of BLOG_CATEGORIES) {
    postCatIds.push({
      key,
      id: await write(payload, "postCategories", { field: "key", value: key },
        { key, label, order: postCatIds.length + 1 }, report),
    });
  }
  const postCategory = makeResolver("post category", postCatIds);

  /* ------------------------------- 2. solutions and services, pass one */

  const solutionIds: { key: string; id: number }[] = [];
  for (const s of SOLUTIONS) {
    const d = detailFor(SOLUTION_DETAIL, s.slug);
    solutionIds.push({
      key: s.slug,
      id: await write(payload, "solutions", { field: "slug", value: s.slug }, {
        title: s.title, slug: s.slug, short: s.short, blurb: s.blurb, order: s.n,
        accent: "#0888c5", headline: d.headline ?? s.title, intro: d.intro ?? s.blurb,
        lead: d.lead ?? null, detail: toDetailBlocks(d),
        outcomesTitle: d.outcomesTitle ?? null, outcomes: toItems(d.outcomes ?? []),
        note: d.note ?? null, experience: d.experience ?? null,
      }, report),
    });
  }
  const solution = makeResolver("solution", solutionIds);

  const serviceIds: { key: string; id: number }[] = [];
  for (const s of SERVICES) {
    const d = detailFor(SERVICE_DETAIL, s.slug);
    serviceIds.push({
      key: s.slug,
      id: await write(payload, "services", { field: "slug", value: s.slug }, {
        title: s.title, slug: s.slug, short: s.short, blurb: s.blurb, order: s.n,
        accent: "#056a9a", headline: d.headline ?? s.title, intro: d.intro ?? s.blurb,
        capabilities: (d.capabilities ?? []).map((c: { title: string; body: string }) => ({ ...c })),
        checklistTitle: d.checklistTitle ?? null, checklist: toItems(d.checklist ?? []),
        modelsTitle: d.modelsTitle ?? null,
        models: (d.models ?? []).map((m: { title: string; body: string }) => ({ ...m })),
        fit: d.fit ?? null, note: d.note ?? null,
      }, report),
    });
  }
  const service = makeResolver("service", serviceIds);

  /* -------------------------------------- 3. clients, then projects */

  const clientIds: { key: string; id: number }[] = [];
  for (const c of CLIENTS) {
    clientIds.push({
      key: c.name,
      id: await write(payload, "clients", { field: "name", value: c.name }, {
        name: c.name, sector: c.sector, summary: c.summary,
        order: clientIds.length + 1,
        solutions: c.solutions.map(solution),
      }, report),
    });
  }
  const client = makeResolver("client", clientIds);

  const projectIds: { key: string; id: number }[] = [];
  for (const pr of PROJECTS) {
    const d = detailFor(PROJECT_DETAIL, pr.slug);
    projectIds.push({
      key: pr.slug,
      id: await write(payload, "projects", { field: "slug", value: pr.slug }, {
        title: pr.title, slug: pr.slug, client: client(pr.client),
        featured: pr.featured === 1, sector: pr.sector.toLowerCase(),
        sectorFull: pr.sectorFull, location: pr.location,
        year: toConfirmable(pr.year, "Year to confirm"),
        primary: pr.primary, headline: d.headline ?? null, summary: pr.summary,
        solutions: pr.solutions.map(solution), tech: toItems(pr.tech),
        need: d.need ?? pr.summary, scope: d.scope ?? pr.summary,
        delivered: toItems(d.delivered ?? []), outcomes: toItems(d.outcomes ?? []),
        technology: toItems(d.technology ?? []), technologyNote: d.technologyNote ?? null,
        training: d.training ?? null, privacy: d.privacy ?? null,
      }, report),
    });
  }
  const project = makeResolver("project", projectIds);

  /* ------------------------------------------------------ 4. partners */

  const partnerIds: { key: string; id: number }[] = [];
  for (const pt of PARTNERS) {
    partnerIds.push({
      key: pt.name,
      id: await write(payload, "partners", { field: "name", value: pt.name }, {
        name: pt.name, order: PARTNERS.indexOf(pt) + 1,
        categories: pt.cats.map(category), featured: Boolean(pt.featured),
        capability: pt.cap, solution: solution(pt.solution),
        projects: pt.projects.map(project),
      }, report),
    });
  }
  const partner = makeResolver("partner", partnerIds);

  /* ----------------------------------------------------- 5. editorial */

  for (const post of POSTS) {
    await write(payload, "posts", { field: "slug", value: post.slug }, {
      title: post.title, slug: post.slug, order: POSTS.indexOf(post) + 1,
      category: postCategory(post.cat), body: toRichParagraphs(post.paras),
      target: solution(post.to), anchor: post.anchor ?? null,
      readMoreLabel: post.label,
    }, report);
  }

  for (const n of NEWS) {
    await write(payload, "news", { field: "slug", value: n.slug }, {
      title: n.title, slug: n.slug, kind: n.kind,
      date: toConfirmable(n.date, "Date to confirm"),
      archive: Boolean(n.archive), standfirst: n.standfirst,
      body: toRichParagraphs(n.paras),
    }, report);
  }

  for (const e of EVENTS) {
    const { startsOn, endsOn } = eventDates({ iso: e.iso, date: e.date });
    await write(payload, "events", { field: "slug", value: e.slug }, {
      title: e.title, slug: e.slug, startsOn, endsOn, displayDate: e.date,
      category: e.category, format: e.format, venue: e.venue,
      headline: e.headline, intro: e.intro, audience: e.audience,
      program: toItems(e.program), action: e.action, pendingNote: e.pending ?? null,
    }, report);
  }

  for (const d of DOWNLOADS) {
    await write(payload, "downloads", { field: "title", value: d.title }, {
      title: d.title, order: DOWNLOADS.indexOf(d) + 1, category: d.category,
      owner: d.owner, meta: d.meta, note: d.note ?? null, approved: false,
    }, report);
  }

  /* -------------------------------------------------------- 6. people */

  for (const j of JOBS) {
    await write(payload, "jobs", { field: "slug", value: j.slug }, {
      title: j.title, slug: j.slug, department: j.department, level: j.level,
      reports: j.reports, type: j.type, status: j.status, location: j.location,
      deadline: toConfirmable(j.deadline, "Deadline to be confirmed"),
      purposeTitle: j.purposeTitle, purpose: j.purpose, scope: j.scope ?? null,
      responsibilities: toItems(j.responsibilities), required: toItems(j.required),
      preferred: toItems(j.preferred), success: j.success,
    }, report);
  }

  for (const t of ACADEMY_TRACKS) {
    await write(payload, "academyTracks", { field: "slug", value: t.slug }, {
      title: t.title, slug: t.slug, order: ACADEMY_TRACKS.indexOf(t) + 1,
      body: t.body, solution: solution(t.solution),
    }, report);
  }

  /* ------------------- 7. second pass: self and circular relations

     Three relationships cannot be satisfied in one pass: solutions.related
     and services.related point into their own collection, clients.engagements
     and projects.client point at each other, and solutions.partners points at
     partners -- which are created after solutions, because every partner
     points back at a solution. */

  payload.logger.info("patching relations that needed every id to exist");

  for (const s of SOLUTIONS) {
    const d = detailFor(SOLUTION_DETAIL, s.slug);
    const related = (d.links ?? []).filter((x: string) => x !== s.slug);
    const brands = d.partners ?? [];
    if (related.length || brands.length) {
      await payload.update({ collection: "solutions", id: solution(s.slug), data: {
        ...(related.length ? { related: related.map(solution) } : {}),
        ...(brands.length ? { partners: brands.map(partner) } : {}),
      }});
    }
  }

  for (const s of SERVICES) {
    const related = (detailFor(SERVICE_DETAIL, s.slug).links ?? []).filter((x: string) => x !== s.slug);
    if (related.length) {
      await payload.update({ collection: "services", id: service(s.slug),
        data: { related: related.map(service) } });
    }
  }

  for (const c of CLIENTS) {
    if (c.engagements.length) {
      await payload.update({ collection: "clients", id: client(c.name),
        data: { engagements: c.engagements.map(project) } });
    }
  }

  /* ------------------------------------------------------- 8. globals */

  payload.logger.info("seeding globals");

  await payload.updateGlobal({ slug: "site-settings", data: {
    nav: NAV.map(([label, href]) => ({ label, href: `/${href.replace(/\.html$/, "").replace(/^index$/, "")}` })),
    impact: IMPACT.map((m) => ({ figure: m.figure, unit: m.unit, line: m.line })),
    impactSupport: IMPACT_SUPPORT,
  }});

  await payload.updateGlobal({ slug: "company", data: {
    legalName: COMPANY.legal, shortName: COMPANY.short, domain: COMPANY.domain,
    established: COMPANY.established, positioning: COMPANY.positioning,
    mission: COMPANY.mission, missionBody: COMPANY.missionBody,
    vision: COMPANY.vision, visionBody: COMPANY.visionBody,
    values: VALUES.map((v) => ({ ...v })),
    journey: JOURNEY.map((m) => ({ ...m })),
    differentiators: DIFFERENTIATORS.map((d) => ({ ...d })),
    delivery: DELIVERY.map((d) => ({ title: d.title, body: d.body })),
    industries: INDUSTRIES.map((i) => ({ ...i })),
    sustainability: SUSTAINABILITY.map((s) => ({ ...s })),
    executiveRoles: EXECUTIVE_ROLES.map((title: string) => ({
      title, holder: toConfirmable(undefined, "Name and biography pending"),
    })),
  }});

  await payload.updateGlobal({ slug: "contact-details", data: {
    office: CONTACT.office.map((line: string) => ({ line })),
    mapUrl: CONTACT.map, phones: CONTACT.phones.map((p) => ({ ...p })),
    whatsapp: CONTACT.whatsapp, emails: CONTACT.emails.map((e) => ({ ...e })),
    emergency: CONTACT.emergency, response: CONTACT.response,
    hours: pairs(CONTACT.hours).map(([days, hours]) => ({ days, hours })),
    inquiryCategories: INQUIRY_CATEGORIES.map((c) => ({
      key: c.slug, title: c.title, prompt: c.prompt, route: c.route,
    })),
  }});

  await payload.updateGlobal({ slug: "careers-content", data: {
    pathways: CAREER_PATHWAYS.map((x) => ({ ...x })),
    culture: pairs(CULTURE).map(([title, body]) => ({ title, body })),
    development: toItems(DEVELOPMENT), experiencePoints: toItems(EXPERIENCE_POINTS),
    applicationDocs: toItems(APPLICATION_DOCS),
    internship: {
      title: INTERNSHIP.title, type: INTERNSHIP.type, location: INTERNSHIP.location,
      schedule: toConfirmable(INTERNSHIP.schedule, "Dates to be confirmed"),
      deadline: toConfirmable(INTERNSHIP.deadline, "Deadline to be confirmed"),
      intro: INTERNSHIP.intro, caveat: INTERNSHIP.caveat,
      tracks: INTERNSHIP.tracks.map((t) => ({ ...t })),
      eligibility: toItems(INTERNSHIP.eligibility),
      documents: toItems(INTERNSHIP.documents),
      structure: INTERNSHIP.structure.map((s) => ({ ...s })),
      selection: INTERNSHIP.selection.map((s) => ({ n: s.n, title: s.title, body: s.body })),
    },
    academyAudiences: ACADEMY_AUDIENCES.map((a) => ({ ...a })),
    academyLevels: toItems(ACADEMY_LEVELS), academyDelivery: toItems(ACADEMY_DELIVERY),
    courseSections: COURSE_SECTIONS.map((s) => ({ ...s })),
  }});

  await payload.updateGlobal({ slug: "page-copy", data: {
    projectImplementationNote: IMPLEMENTATION,
    resourceSections: RESOURCE_SECTIONS.map((s) => ({
      key: s.slug, title: s.title, body: s.body,
      href: `/${s.file.replace(/\.html$/, "").replace(/^media-/, "resources/media/")}`,
    })),
  }});

  payload.logger.info(
    `seed (${MODE}): ${report.created} created, ${report.updated} updated, ${report.skipped} left alone`,
  );
  if (MODE === "fill" && report.skipped > 0) {
    payload.logger.info("skipped documents already existed. Use --force to overwrite them.");
  }
}

await seed();
process.exit(0);
