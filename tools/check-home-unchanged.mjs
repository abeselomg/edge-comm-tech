/*
 * The homepage is approved. The generator must not have altered it.
 *
 * Compares the emitted <main> against the verbatim copy extract.mjs lifted
 * from the approved page, allowing only the href rewrites pages/home.mjs
 * declares. Reads the committed extraction rather than the source file,
 * because a later task turns that source file into a redirect.
 */
import { readFileSync } from "fs";

const PARTS = "design-src/highland/shell-parts.json";
const OUT = "design-files/highland/index.html";

let a = JSON.parse(readFileSync(PARTS, "utf8")).main;
const out = readFileSync(OUT, "utf8");
const b = out.slice(out.indexOf("<main>"), out.indexOf("</main>") + 7);

a = a.split('href="#contact"').join('href="contact.html"');

if (a !== b) {
  const i = [...a].findIndex((c, n) => c !== b[n]);
  console.error("FAIL — emitted homepage differs from the approved design at char", i);
  console.error("  approved:", JSON.stringify(a.slice(Math.max(0, i - 60), i + 60)));
  console.error("  emitted :", JSON.stringify(b.slice(Math.max(0, i - 60), i + 60)));
  process.exit(1);
}
console.log("PASS — homepage <main> is byte-identical to the approved design");
