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
  solutions: 7, services: 6, projects: 8, clients: 10, partners: 32,
  partnerCategories: 10, posts: 10, postCategories: 10, news: 3, events: 3,
  downloads: 4, jobs: 2, academyTracks: 6,
};

const problems: string[] = [];
const payload = await getPayload({ config });

for (const [collection, expected] of Object.entries(EXPECTED)) {
  const { totalDocs } = await payload.count({ collection: collection as never });
  if (totalDocs !== expected) {
    problems.push(`${collection}: expected ${expected}, found ${totalDocs}`);
  }
}

const { docs: projects } = await payload.find({ collection: "projects", limit: 100, depth: 0 });
for (const p of projects) {
  if (!p.client) problems.push(`project "${p.slug}" has no client`);
  if (!p.solutions?.length) problems.push(`project "${p.slug}" has no solutions`);
}

const { docs: partners } = await payload.find({ collection: "partners", limit: 100, depth: 0 });
for (const p of partners) {
  if (!p.solution) problems.push(`partner "${p.name}" links to no solution`);
  if (!p.categories?.length) problems.push(`partner "${p.name}" has no category`);
}

const { docs: posts } = await payload.find({ collection: "posts", limit: 100, depth: 0 });
for (const p of posts) {
  if (!p.target) problems.push(`post "${p.slug}" has no target solution`);
}

/* All seven families list the platforms they are delivered on, and those are
   patched in the seed's second pass -- so an empty list here means the patch
   pass did not run, which the counts alone would not reveal. */
const { docs: solutions } = await payload.find({ collection: "solutions", limit: 100, depth: 0 });
for (const sol of solutions) {
  if (!sol.partners?.length) problems.push(`solution "${sol.slug}" lists no partners`);
}

if (problems.length) {
  console.error(`FAIL — ${problems.length} problem(s):`);
  for (const line of problems) console.error(`  ${line}`);
  process.exit(1);
}

console.log(
  `PASS — ${Object.values(EXPECTED).reduce((a, b) => a + b, 0)} documents across ${Object.keys(EXPECTED).length} collections, no dangling relationships`,
);
process.exit(0);
