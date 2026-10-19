import { getPayload } from "payload";
import config from "../payload.config";

/*
 * Asserts the database holds what the content master says it should.
 *
 * Counts catch a transform that silently dropped rows. The relationship checks
 * catch the opposite failure: rows that exist but point at nothing, which
 * renders as a project with no client or a partner card linking nowhere.
 */

const EXPECTED: Record<string, number> = {
  solutions: 7,
  services: 6,
  projects: 8,
  clients: 10,
  partners: 32,
  partnerCategories: 10,
  posts: 10,
  postCategories: 10,
  news: 3,
  events: 3,
  downloads: 4,
  jobs: 2,
  academyTracks: 6,
};

const problems: string[] = [];
const payload = await getPayload({ config });

for (const [collection, expected] of Object.entries(EXPECTED)) {
  const { totalDocs } = await payload.count({
    collection: collection as never,
  });
  if (totalDocs !== expected) {
    problems.push(`${collection}: expected ${expected}, found ${totalDocs}`);
  }
}

const { docs: projects } = await payload.find({
  collection: "projects",
  limit: 100,
  depth: 0,
});
for (const p of projects) {
  if (!p.client) problems.push(`project "${p.slug}" has no client`);
  if (!p.solutions?.length)
    problems.push(`project "${p.slug}" has no solutions`);
}

const { docs: partners } = await payload.find({
  collection: "partners",
  limit: 100,
  depth: 0,
});
for (const p of partners) {
  if (!p.solution) problems.push(`partner "${p.name}" links to no solution`);
  if (!p.categories?.length)
    problems.push(`partner "${p.name}" has no category`);
}

const { docs: posts } = await payload.find({
  collection: "posts",
  limit: 100,
  depth: 0,
});
for (const p of posts) {
  if (!p.target) problems.push(`post "${p.slug}" has no target solution`);
}

/* All seven families list the platforms they are delivered on, and those are
   patched in the seed's second pass -- so an empty list here means the patch
   pass did not run, which the counts alone would not reveal. */
const { docs: solutions } = await payload.find({
  collection: "solutions",
  limit: 100,
  depth: 0,
});
for (const sol of solutions) {
  if (!sol.partners?.length)
    problems.push(`solution "${sol.slug}" lists no partners`);
}

/*
 * The globals, which this verifier did not look at until a whole global came
 * back empty and it still said PASS.
 *
 * page-copy's twenty-two hero strings and three lists were never written by
 * the seed at all. Nothing noticed: every count above was right, no
 * relationship dangled, and the required-field validators only fire on a
 * write that is attempted. The seven heroes being required is the only reason
 * the seed itself eventually complained -- an optional field left unwritten
 * would have reached production as a blank section.
 *
 * So each global is checked the way the collections are: the lists by their
 * length from the content master, the scalars by presence. The numbers are
 * written out rather than read from the content modules on purpose, for the
 * same reason the counts above are: a module that failed to load exports
 * nothing, and a length compared against a length would then agree at zero.
 */
const text = (v: unknown): boolean =>
  typeof v === "string" && v.trim().length > 0;
const rows = (v: unknown): number => (Array.isArray(v) ? v.length : -1);

const expectList = (
  where: string,
  field: string,
  got: unknown,
  want: number,
) => {
  const n = rows(got);
  if (n !== want)
    problems.push(
      `${where}.${field}: expected ${want} rows, found ${n < 0 ? "not an array" : n}`,
    );
};
const expectText = (where: string, field: string, got: unknown) => {
  if (!text(got)) problems.push(`${where}.${field}: empty`);
};

const settings = await payload.findGlobal({ slug: "site-settings" });
expectList("site-settings", "nav", settings.nav, 8);
expectList("site-settings", "impact", settings.impact, 4);
expectText("site-settings", "impactSupport", settings.impactSupport);
expectText("site-settings", "headerCta.label", settings.headerCta?.label);
expectText("site-settings", "headerCta.href", settings.headerCta?.href);

const company = await payload.findGlobal({ slug: "company" });
for (const f of [
  "legalName",
  "shortName",
  "domain",
  "positioning",
  "mission",
  "missionBody",
] as const) {
  expectText("company", f, company[f]);
}
expectList("company", "values", company.values, 7);
expectList("company", "journey", company.journey, 10);
expectList("company", "differentiators", company.differentiators, 6);
expectList("company", "delivery", company.delivery, 5);
expectList("company", "industries", company.industries, 4);
expectList("company", "sustainability", company.sustainability, 5);
expectList("company", "executiveRoles", company.executiveRoles, 5);

const contact = await payload.findGlobal({ slug: "contact-details" });
expectList("contact-details", "office", contact.office, 4);
expectList("contact-details", "phones", contact.phones, 2);
expectList("contact-details", "emails", contact.emails, 3);
expectList(
  "contact-details",
  "inquiryCategories",
  contact.inquiryCategories,
  7,
);

const careers = await payload.findGlobal({ slug: "careers-content" });
expectList("careers-content", "pathways", careers.pathways, 6);
expectList("careers-content", "culture", careers.culture, 7);
expectList("careers-content", "development", careers.development, 5);
expectList("careers-content", "experiencePoints", careers.experiencePoints, 5);
expectList("careers-content", "applicationDocs", careers.applicationDocs, 5);
expectList("careers-content", "academyAudiences", careers.academyAudiences, 4);
expectList("careers-content", "academyLevels", careers.academyLevels, 6);
expectList("careers-content", "academyDelivery", careers.academyDelivery, 3);
expectList("careers-content", "courseSections", careers.courseSections, 8);

const copy = await payload.findGlobal({ slug: "page-copy" });
const HEROES = [
  "homeHero",
  "solutionsHero",
  "aboutHero",
  "servicesHero",
  "clientsHero",
  "partnersHero",
  "resourcesHero",
] as const;
for (const name of HEROES) {
  const hero = copy[name] as Record<string, unknown> | undefined;
  for (const part of ["eyebrow", "title", "intro"]) {
    expectText("page-copy", `${name}.${part}`, hero?.[part]);
  }
}
/* The home hero alone has a second paragraph: its template renders two. */
expectText(
  "page-copy",
  "homeHero.introSecondary",
  copy.homeHero?.introSecondary,
);
/* Six for the home page and five for the solutions overview -- two different
   lists in the master, and equal counts here would mean one had been copied
   over the other. */
expectList("page-copy", "homePriorities", copy.homePriorities, 6);
expectList("page-copy", "solutionsPriorities", copy.solutionsPriorities, 5);
expectList("page-copy", "solutionsFramework", copy.solutionsFramework, 6);
expectList("page-copy", "resourceSections", copy.resourceSections, 6);
expectText(
  "page-copy",
  "projectImplementationNote",
  copy.projectImplementationNote,
);

if (problems.length) {
  console.error(`FAIL — ${problems.length} problem(s):`);
  for (const line of problems) console.error(`  ${line}`);
  process.exit(1);
}

console.log(
  `PASS — ${Object.values(EXPECTED).reduce((a, b) => a + b, 0)} documents across ` +
    `${Object.keys(EXPECTED).length} collections and 5 globals, no dangling relationships`,
);
process.exit(0);
