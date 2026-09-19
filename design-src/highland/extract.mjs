/*
 * Lifts the shared shell out of the approved landing page.
 *
 * Retyping the head, header and footer would risk the approved design over a
 * mistyped hex value. Every marker below was verified to occur exactly once
 * in the source, so slicing between them is unambiguous.
 */
import { readFileSync, writeFileSync } from "fs";

const SRC = "design-files/landings/highland-microwave.html";
const OUT = "design-src/highland/shell-parts.json";

const src = readFileSync(SRC, "utf8");

const between = (open, close) => {
  const a = src.indexOf(open);
  const b = src.indexOf(close, a);
  if (a === -1 || b === -1) throw new Error(`marker not found: ${open}`);
  return src.slice(a, b + close.length);
};

const parts = {
  styles: between("<style>", "</style>"),
  header: between("<header", "</header>"),
  main: between("<main>", "</main>"),
  footer: between("<footer", "</footer>"),
};

for (const [k, v] of Object.entries(parts)) {
  if (v.length < 200) throw new Error(`${k} suspiciously short: ${v.length} chars`);
}

writeFileSync(OUT, JSON.stringify(parts, null, 2));
console.log(
  Object.entries(parts).map(([k, v]) => `${k}: ${v.length} chars`).join("\n"),
);
