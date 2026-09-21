/*
 * Replaces the byte-equality guard on the homepage.
 *
 * That guard existed to get the approved design safely into the generator,
 * and it did its job. The client has since directed changes to the homepage,
 * so byte-equality is no longer the right assertion — it would now fail on
 * every intended edit and teach everyone to ignore it.
 *
 * What still matters is that the homepage keeps its signature: the sun disk
 * and horizon that only it carries, the proof strip, the named clients, all
 * nine services each linking to its own page, and the two sections the client
 * asked to be removed staying removed. A regeneration that quietly guts the
 * page fails here.
 */
import { readFileSync } from "fs";

const OUT = "design-files/highland/index.html";
const html = readFileSync(OUT, "utf8");
const main = html.slice(html.indexOf("<main>"), html.indexOf("</main>") + 7);

const problems = [];
const must = (cond, msg) => { if (!cond) problems.push(msg); };

/* Motifs that belong to the homepage alone. */
must(main.includes("sun-disk"), "lost the sun disk");
must(main.includes("horizon"), "lost the horizon line");

/* Proof the client can actually stand behind. */
must(/Certified vendor partners/.test(main), "lost the partner count");
must(/Named institutional clients/.test(main), "lost the client count");
for (const c of ["Bonga University", "Bahir Dar University", "Haramaya University",
                 "Mizan-Tepi University", "Yekatit 12 Hospital"]) {
  must(main.includes(c), `lost client "${c}"`);
}

/* Nine services, each reaching its own page. */
const links = [...new Set([...main.matchAll(/href="(solution-[a-z-]+\.html)"/g)].map((m) => m[1]))];
must(links.length === 9, `expected 9 distinct service links, found ${links.length}`);

/* Sections the client asked to be removed must stay removed. */
must(!main.includes("Custom solutions"), "the custom solutions section came back");
must(!main.includes("Get in touch"), "the get in touch section came back");

/* Placeholder discipline: unpublished figures stay marked. */
must(main.includes('class="ph"'), "lost the placeholder markers on unpublished figures");

if (problems.length) {
  console.error(`FAIL — homepage signature broken (${problems.length}):`);
  problems.forEach((p) => console.error("  " + p));
  process.exit(1);
}
console.log(`PASS — homepage signature intact (${links.length} service pages linked)`);
