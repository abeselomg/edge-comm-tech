import { getPayload } from "payload";
import type { Payload } from "payload";
import config from "../payload.config";

import {
  COMPANY,
  IMPACT,
  IMPACT_SUPPORT,
  VALUES,
  JOURNEY,
  DIFFERENTIATORS,
  DELIVERY,
  INDUSTRIES,
  SUSTAINABILITY,
  EXECUTIVE_ROLES,
  CONTACT,
  INQUIRY_CATEGORIES,
  NAV,
  ACCENT,
  PRIORITIES,
  SOLUTIONS,
  SERVICES,
  CLIENTS,
  CLIENT_SECTORS,
  PARTNERS,
  PARTNER_CATEGORIES,
  PROJECTS,
} from "../../design-src/highland/content.mjs";
import {
  SOLUTION_DETAIL,
  SERVICE_DETAIL,
} from "../../design-src/highland/detail.mjs";
import {
  IMPLEMENTATION,
  PROJECT_DETAIL,
} from "../../design-src/highland/project-detail.mjs";
import {
  BLOG_CATEGORIES,
  POSTS,
  NEWS,
  EVENTS,
  DOWNLOADS,
  RESOURCE_SECTIONS,
} from "../../design-src/highland/editorial.mjs";
import {
  CAREER_PATHWAYS,
  CULTURE,
  DEVELOPMENT,
  EXPERIENCE_POINTS,
  APPLICATION_DOCS,
  INTERNSHIP,
  ACADEMY_AUDIENCES,
  ACADEMY_TRACKS,
  ACADEMY_LEVELS,
  ACADEMY_DELIVERY,
  COURSE_SECTIONS,
  JOBS,
} from "../../design-src/highland/people.mjs";

import { decideWrite, makeResolver, seedMode, type SeedReport } from "./upsert";
import {
  eventDates,
  titledBodies,
  toConfirmable,
  toDetailBlocks,
  toItems,
  toNewsBody,
  toRichParagraphs,
} from "./transform";
import { sectorSlug } from "../fields/sectors";
import { routeFor } from "../lib/routes";
import { HEROES, SOLUTIONS_FRAMEWORK, SOLUTIONS_PRIORITIES } from "./page-copy";

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
 * re-run cannot destroy an editor's work. Set the mode with the environment
 * variable, not a flag -- `npm run seed:force`, `npm run seed:fresh`, or
 * SEED_MODE=force directly; `payload run` does not forward flags to the
 * script, and seedMode() explains why at length.
 */

const MODE = seedMode(process.env.SEED_MODE);

const SEEDED = [
  "partnerCategories",
  "postCategories",
  "solutions",
  "services",
  "clients",
  "projects",
  "partners",
  "posts",
  "news",
  "events",
  "downloads",
  "jobs",
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
/*
 * No eslint-disable here: this project's config extends next/core-web-vitals
 * only, deliberately, so the typescript-eslint rules are not loaded. A disable
 * comment naming one of them is itself an error ("Definition for rule ... was
 * not found") and fails `next build` while leaving tsc and the tests green.
 */
type DetailRecord = Record<string, any>;

const detailFor = (map: object, slug: string): DetailRecord =>
  (map as unknown as Record<string, DetailRecord>)[slug] ?? {};

/*
 * The family's own accent colour.
 *
 * Both call sites used to pass one hardcoded hex, so all seven solutions were
 * #0888c5 and all six services #056a9a. Highland colours cards, chips,
 * borders and hero washes by family, and a single colour loses that
 * distinction on every page at once while looking perfectly valid in the
 * database. Throws on a slug the approved map does not cover, because the
 * alternative -- defaulting -- is how the bug looked in the first place.
 */
const accentFor = (slug: string): string => {
  const hex = (ACCENT as Record<string, string>)[slug];
  if (!hex) {
    throw new Error(
      `No accent for "${slug}". ACCENT in design-src/highland/content.mjs is ` +
        "the approved source; add the family there rather than defaulting to a colour.",
    );
  }
  return hex;
};

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
  try {
    const doc = await payload.create({
      collection,
      data: { ...data, _status: "published" } as never,
    });
    report.created += 1;
    return doc.id as number;
  } catch (error) {
    /*
     * Payload's ValidationError prints its field list as `[Object]`, which
     * says a document was refused and nothing about why. Every refusal here
     * means the content's shape and the collection's shape disagree, and the
     * field name is the whole diagnosis — so unwrap it, name the document, and
     * show what was actually passed for that field.
     */
    explain(error, `${collection} "${key.value}"`, data);
    throw error;
  }
}

/*
 * Payload's ValidationError prints its field list as `[Object]`, which says a
 * document was refused and nothing about why. Every refusal in this script
 * means the content's shape and the collection's shape disagree, and the field
 * name is the whole diagnosis -- so unwrap it, name the document, and show
 * what was actually passed for that field.
 *
 * Globals report through here too. The first version wrapped only the
 * collection writes, so a refused global printed one field label and no value
 * -- for the half of the seed that is five large nested documents, where the
 * path matters most.
 */
function explain(error: unknown, subject: string, data: unknown): void {
  const errors = (
    error as { data?: { errors?: { path?: string; message?: string }[] } }
  )?.data?.errors;
  if (!errors?.length) return;
  console.error(`\nRefused: ${subject}`);
  for (const e of errors) {
    const at = e.path ?? "(unknown field)";
    const got = at
      .split(/[.[\]]+/)
      .filter(Boolean)
      .reduce<unknown>(
        (v, k) =>
          v && typeof v === "object"
            ? (v as Record<string, unknown>)[k]
            : undefined,
        data,
      );
    console.error(`  ${at}: ${e.message}`);
    console.error(
      `     passed: ${JSON.stringify(got)?.slice(0, 300) ?? "undefined"}`,
    );
  }
  console.error("");
}

/*
 * A global write, with the same diagnosis on refusal that documents get --
 * and, unlike a document, it does not stop the run.
 *
 * The five globals are independent documents, so a throw on the first one
 * hides whatever is wrong with the other four: finding five gaps costs five
 * full runs, each one reseeding thirteen collections to reach the end. Each
 * failure is collected and the run stops after all five have been attempted,
 * so one run reports everything that disagrees.
 */
const globalFailures: string[] = [];

async function writeGlobal(
  payload: Payload,
  slug: Parameters<Payload["updateGlobal"]>[0]["slug"],
  data: Record<string, unknown>,
): Promise<void> {
  try {
    await payload.updateGlobal({ slug, data: data as never });
  } catch (error) {
    explain(error, `global "${slug}"`, data);
    globalFailures.push(slug);
  }
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
      id: await write(
        payload,
        "partnerCategories",
        { field: "key", value: key },
        { key, label, ringLabel, description, order: categoryIds.length + 1 },
        report,
      ),
    });
  }
  const category = makeResolver("partner category", categoryIds);

  const postCatIds: { key: string; id: number }[] = [];
  for (const [key, label] of BLOG_CATEGORIES) {
    postCatIds.push({
      key,
      id: await write(
        payload,
        "postCategories",
        { field: "key", value: key },
        { key, label, order: postCatIds.length + 1 },
        report,
      ),
    });
  }
  const postCategory = makeResolver("post category", postCatIds);

  /* ------------------------------- 2. solutions and services, pass one */

  const solutionIds: { key: string; id: number }[] = [];
  for (const s of SOLUTIONS) {
    const d = detailFor(SOLUTION_DETAIL, s.slug);
    solutionIds.push({
      key: s.slug,
      id: await write(
        payload,
        "solutions",
        { field: "slug", value: s.slug },
        {
          title: s.title,
          slug: s.slug,
          short: s.short,
          blurb: s.blurb,
          order: s.n,
          accent: accentFor(s.slug),
          headline: d.headline ?? s.title,
          intro: d.intro ?? s.blurb,
          lead: d.lead ?? null,
          detail: toDetailBlocks(d),
          outcomesTitle: d.outcomesTitle ?? null,
          outcomes: toItems(d.outcomes ?? []),
          note: d.note ?? null,
          experience: d.experience ?? null,
        },
        report,
      ),
    });
  }
  const solution = makeResolver("solution", solutionIds);

  const serviceIds: { key: string; id: number }[] = [];
  for (const s of SERVICES) {
    const d = detailFor(SERVICE_DETAIL, s.slug);
    serviceIds.push({
      key: s.slug,
      id: await write(
        payload,
        "services",
        { field: "slug", value: s.slug },
        {
          title: s.title,
          slug: s.slug,
          short: s.short,
          blurb: s.blurb,
          order: s.n,
          accent: accentFor(s.slug),
          headline: d.headline ?? s.title,
          intro: d.intro ?? s.blurb,
          capabilities: (d.capabilities ?? []).map(
            (c: { title: string; body: string }) => ({ ...c }),
          ),
          checklistTitle: d.checklistTitle ?? null,
          checklist: toItems(d.checklist ?? []),
          modelsTitle: d.modelsTitle ?? null,
          models: (d.models ?? []).map(
            (m: { title: string; body: string }) => ({ ...m }),
          ),
          fit: d.fit ?? null,
          note: d.note ?? null,
        },
        report,
      ),
    });
  }
  const service = makeResolver("service", serviceIds);

  /* -------------------------------------- 3. clients, then projects */

  const clientIds: { key: string; id: number }[] = [];
  for (const c of CLIENTS) {
    clientIds.push({
      key: c.name,
      id: await write(
        payload,
        "clients",
        { field: "name", value: c.name },
        {
          name: c.name,
          sector: sectorSlug(c.sector),
          summary: c.summary,
          order: clientIds.length + 1,
          solutions: c.solutions.map(solution),
        },
        report,
      ),
    });
  }
  const client = makeResolver("client", clientIds);

  const projectIds: { key: string; id: number }[] = [];
  for (const pr of PROJECTS) {
    const d = detailFor(PROJECT_DETAIL, pr.slug);
    projectIds.push({
      key: pr.slug,
      id: await write(
        payload,
        "projects",
        { field: "slug", value: pr.slug },
        {
          title: pr.title,
          slug: pr.slug,
          client: client(pr.client),
          /*
           * The content's `featured` is a RANK, 1 to 6, with 0 for the two
           * that are not featured -- and `=== 1` wrote five of those six as
           * false, so the home page would have shown one featured project
           * instead of six. The rank itself is not stored: for every featured
           * project the rank equals its position in the approved list, so
           * `featured` says whether and `order` says where, which is the same
           * result without a magic number in a boolean's place.
           */
          featured: pr.featured > 0,
          order: PROJECTS.indexOf(pr) + 1,
          sector: sectorSlug(pr.sector),
          sectorFull: pr.sectorFull,
          location: pr.location,
          year: toConfirmable(pr.year, "Year to confirm"),
          primary: pr.primary,
          headline: d.headline ?? null,
          summary: pr.summary,
          solutions: pr.solutions.map(solution),
          tech: toItems(pr.tech),
          need: d.need ?? pr.summary,
          scope: toItems(d.scope ?? []),
          delivered: titledBodies(d.delivered ?? []),
          outcomes: toItems(d.outcomes ?? []),
          technology: d.technology ?? null,
          technologyNote: d.technologyNote ?? null,
          training: d.training ?? null,
          privacy: d.privacy ?? null,
        },
        report,
      ),
    });
  }
  const project = makeResolver("project", projectIds);

  /* ------------------------------------------------------ 4. partners */

  const partnerIds: { key: string; id: number }[] = [];
  for (const pt of PARTNERS) {
    partnerIds.push({
      key: pt.name,
      id: await write(
        payload,
        "partners",
        { field: "name", value: pt.name },
        {
          name: pt.name,
          order: PARTNERS.indexOf(pt) + 1,
          categories: pt.cats.map(category),
          featured: Boolean(pt.featured),
          capability: pt.cap,
          solution: solution(pt.solution),
          projects: pt.projects.map(project),
        },
        report,
      ),
    });
  }
  const partner = makeResolver("partner", partnerIds);

  /* ----------------------------------------------------- 5. editorial */

  for (const post of POSTS) {
    await write(
      payload,
      "posts",
      { field: "slug", value: post.slug },
      {
        title: post.title,
        slug: post.slug,
        order: POSTS.indexOf(post) + 1,
        category: postCategory(post.cat),
        body: toRichParagraphs(post.paras),
        target: solution(post.to),
        anchor: post.anchor ?? null,
        readMoreLabel: post.label,
      },
      report,
    );
  }

  for (const n of NEWS) {
    await write(
      payload,
      "news",
      { field: "slug", value: n.slug },
      {
        title: n.title,
        slug: n.slug,
        order: NEWS.indexOf(n) + 1,
        kind: n.kind,
        date: toConfirmable(n.date, "Date to confirm"),
        archive: Boolean(n.archive),
        standfirst: n.standfirst,
        body: toNewsBody(n),
      },
      report,
    );
  }

  for (const e of EVENTS) {
    const { startsOn, endsOn } = eventDates({ iso: e.iso, date: e.date });
    await write(
      payload,
      "events",
      { field: "slug", value: e.slug },
      {
        title: e.title,
        slug: e.slug,
        order: EVENTS.indexOf(e) + 1,
        startsOn,
        endsOn,
        displayDate: e.date,
        category: e.category,
        format: e.format,
        venue: e.venue,
        headline: e.headline,
        intro: e.intro,
        audience: e.audience,
        program: toItems(e.program),
        action: e.action,
        pendingNote: e.pending ?? null,
      },
      report,
    );
  }

  for (const d of DOWNLOADS) {
    await write(
      payload,
      "downloads",
      { field: "title", value: d.title },
      {
        title: d.title,
        order: DOWNLOADS.indexOf(d) + 1,
        category: d.category,
        owner: d.owner,
        meta: d.meta,
        note: d.note ?? null,
        approved: false,
      },
      report,
    );
  }

  /* -------------------------------------------------------- 6. people */

  for (const j of JOBS) {
    await write(
      payload,
      "jobs",
      { field: "slug", value: j.slug },
      {
        title: j.title,
        slug: j.slug,
        order: JOBS.indexOf(j) + 1,
        department: j.department,
        level: j.level,
        reports: j.reports,
        type: j.type,
        status: j.status,
        location: j.location,
        deadline: toConfirmable(j.deadline, "Deadline to be confirmed"),
        purposeTitle: j.purposeTitle,
        purpose: j.purpose,
        scope: j.scope ?? null,
        responsibilities: toItems(j.responsibilities),
        required: toItems(j.required),
        preferred: toItems(j.preferred),
        success: j.success,
      },
      report,
    );
  }

  for (const t of ACADEMY_TRACKS) {
    await write(
      payload,
      "academyTracks",
      { field: "slug", value: t.slug },
      {
        title: t.title,
        slug: t.slug,
        order: ACADEMY_TRACKS.indexOf(t) + 1,
        body: t.body,
        solution: solution(t.solution),
      },
      report,
    );
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
      await payload.update({
        collection: "solutions",
        id: solution(s.slug),
        data: {
          ...(related.length ? { related: related.map(solution) } : {}),
          ...(brands.length ? { partners: brands.map(partner) } : {}),
        },
      });
    }
  }

  for (const s of SERVICES) {
    const related = (detailFor(SERVICE_DETAIL, s.slug).links ?? []).filter(
      (x: string) => x !== s.slug,
    );
    if (related.length) {
      await payload.update({
        collection: "services",
        id: service(s.slug),
        data: { related: related.map(service) },
      });
    }
  }

  for (const c of CLIENTS) {
    if (c.engagements.length) {
      await payload.update({
        collection: "clients",
        id: client(c.name),
        data: { engagements: c.engagements.map(project) },
      });
    }
  }

  /* ------------------------------------------------------- 8. globals */

  payload.logger.info("seeding globals");

  await writeGlobal(payload, "site-settings", {
    /*
     * The header's gold button, as the approved build has it
     * (design-src/highland/gen.mjs:147). Seeded rather than left to the
     * field's default: a default is what an editor gets when they create
     * settings from nothing, and relying on one here would mean the approved
     * label and the stored label were the same string only by coincidence.
     */
    headerCta: { label: "Contact us", href: "/contact" },
    /*
     * Routes come from src/lib/routes.ts, not from an inline replace here.
     * Fourteen pages link to each other and to the dynamic families, and a
     * second translation in the seed is a second convention to drift from.
     */
    nav: NAV.map(([label, file]) => ({ label, href: routeFor(file) })),
    impact: IMPACT.map((m) => ({
      figure: m.figure,
      unit: m.unit,
      line: m.line,
    })),
    impactSupport: IMPACT_SUPPORT,
  });

  await writeGlobal(payload, "company", {
    legalName: COMPANY.legal,
    shortName: COMPANY.short,
    domain: COMPANY.domain,
    established: COMPANY.established,
    positioning: COMPANY.positioning,
    mission: COMPANY.mission,
    missionBody: COMPANY.missionBody,
    vision: COMPANY.vision,
    visionBody: COMPANY.visionBody,
    values: VALUES.map((v) => ({ ...v })),
    journey: JOURNEY.map((m) => ({ ...m })),
    differentiators: DIFFERENTIATORS.map((d) => ({ ...d })),
    delivery: DELIVERY.map((d) => ({ title: d.title, body: d.body })),
    industries: INDUSTRIES.map((i) => ({ ...i })),
    sustainability: SUSTAINABILITY.map((s) => ({ ...s })),
    executiveRoles: EXECUTIVE_ROLES.map((title: string) => ({
      title,
      holder: toConfirmable(undefined, "Name and biography pending"),
    })),
  });

  await writeGlobal(payload, "contact-details", {
    office: CONTACT.office.map((line: string) => ({ line })),
    mapUrl: CONTACT.map,
    phones: CONTACT.phones.map((p) => ({ ...p })),
    whatsapp: CONTACT.whatsapp,
    emails: CONTACT.emails.map((e) => ({ ...e })),
    emergency: CONTACT.emergency,
    response: CONTACT.response,
    hours: pairs(CONTACT.hours).map(([days, hours]) => ({ days, hours })),
    inquiryCategories: INQUIRY_CATEGORIES.map((c) => ({
      key: c.slug,
      title: c.title,
      prompt: c.prompt,
      route: c.route,
    })),
  });

  await writeGlobal(payload, "careers-content", {
    pathways: CAREER_PATHWAYS.map((x) => ({ ...x })),
    culture: pairs(CULTURE).map(([title, body]) => ({ title, body })),
    development: toItems(DEVELOPMENT),
    experiencePoints: toItems(EXPERIENCE_POINTS),
    applicationDocs: toItems(APPLICATION_DOCS),
    internship: {
      title: INTERNSHIP.title,
      type: INTERNSHIP.type,
      location: INTERNSHIP.location,
      schedule: toConfirmable(INTERNSHIP.schedule, "Dates to be confirmed"),
      deadline: toConfirmable(INTERNSHIP.deadline, "Deadline to be confirmed"),
      intro: INTERNSHIP.intro,
      caveat: INTERNSHIP.caveat,
      tracks: INTERNSHIP.tracks.map((t) => ({ ...t })),
      eligibility: toItems(INTERNSHIP.eligibility),
      documents: toItems(INTERNSHIP.documents),
      structure: INTERNSHIP.structure.map((s) => ({ ...s })),
      selection: INTERNSHIP.selection.map((s) => ({
        n: s.n,
        title: s.title,
        body: s.body,
      })),
    },
    academyAudiences: ACADEMY_AUDIENCES.map((a) => ({ ...a })),
    academyLevels: toItems(ACADEMY_LEVELS),
    academyDelivery: toItems(ACADEMY_DELIVERY),
    courseSections: COURSE_SECTIONS.map((s) => ({ ...s })),
  });

  await writeGlobal(payload, "page-copy", {
    homeHero: HEROES.home,
    solutionsHero: HEROES.solutions,
    aboutHero: HEROES.about,
    servicesHero: HEROES.services,
    clientsHero: HEROES.clients,
    partnersHero: HEROES.partners,
    resourcesHero: HEROES.resources,
    /*
     * Two lists, deliberately not one. content.mjs's six-item PRIORITIES is
     * the home page's; the solutions overview has its own five, worded
     * differently, and the global keeps them apart for that reason.
     */
    homePriorities: titledBodies(PRIORITIES),
    solutionsPriorities: titledBodies(SOLUTIONS_PRIORITIES),
    solutionsFramework: titledBodies(SOLUTIONS_FRAMEWORK),
    projectImplementationNote: IMPLEMENTATION,
    resourceSections: RESOURCE_SECTIONS.map((s) => ({
      key: s.slug,
      title: s.title,
      body: s.body,
      href: routeFor(s.file),
    })),
  });

  if (globalFailures.length) {
    throw new Error(
      `${globalFailures.length} global(s) refused: ${globalFailures.join(", ")}. ` +
        "Each refusal is printed above with the field and the value passed.",
    );
  }

  payload.logger.info(
    `seed (${MODE}): ${report.created} created, ${report.updated} updated, ${report.skipped} left alone`,
  );
  if (MODE === "fill" && report.skipped > 0) {
    payload.logger.info(
      "skipped documents already existed. Run `npm run seed:force` to overwrite them.",
    );
  }
}

await seed();
process.exit(0);
