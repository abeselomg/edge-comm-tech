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

/* While the approved page is still the approved page, prove the extraction
   matches it. A later task replaces that file with a redirect, at which
   point this arm retires and the comparison below carries on alone. */
const SRC = "design-files/landings/highland-microwave.html";
try {
  const src = readFileSync(SRC, "utf8");
  const i = src.indexOf("<main>");
  if (i === -1) {
    console.log("note: source page is no longer a full page — extraction arm skipped");
  } else if (src.slice(i, src.indexOf("</main>") + 7) !== JSON.parse(readFileSync(PARTS, "utf8")).main) {
    console.error("FAIL — shell-parts.json no longer matches the approved page");
    process.exit(1);
  } else {
    console.log("PASS — extraction still matches the approved page");
  }
} catch (e) {
  if (e.code !== "ENOENT") throw e;
}

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
