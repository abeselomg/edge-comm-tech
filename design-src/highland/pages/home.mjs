/*
 * The approved homepage, lifted verbatim.
 *
 * Its <main> is byte-identical to the landing page the client signed off.
 * The only edits permitted here are href rewrites, applied below so that
 * section anchors which used to live on one page now point at real pages.
 */
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const parts = JSON.parse(readFileSync(path.join(here, "../shell-parts.json"), "utf8"));

/* The single-page version pointed everything at anchors. Only the ones that
   now have their own page are rewritten; #solutions et al still exist as
   sections on this page and keep working. */
const REWRITES = [
  ['href="#contact"', 'href="contact.html"'],
];

let body = parts.main;
for (const [from, to] of REWRITES) body = body.split(from).join(to);

export default {
  title: "Edge COMM-TECH — Infrastructure built to international standards",
  desc: "Edge Communication Technologies — ICT systems integration in Addis Ababa.",
  body,
};
