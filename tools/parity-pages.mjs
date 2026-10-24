/*
 * Which Highland pages the parity checker covers.
 *
 * Kept apart from check-parity.mjs because that script runs on import. The list
 * is read from the Highland directory rather than written out, so a page added
 * there cannot be forgotten here; only the fourteen slug-less pages Phase 4
 * owns are named, and every other page is "dynamic" by definition.
 */
import { readdirSync } from "node:fs";

const HIGHLAND = new URL("../design-files/highland/", import.meta.url);

/** The fourteen slug-less pages Phase 4 owns, as Highland names them. */
export const STATIC_PAGES = [
  "index",
  "about",
  "executive-management",
  "clients",
  "partners",
  "resources",
  "downloads",
  "blog",
  "careers",
  "careers-open-positions",
  "careers-e-academy",
  "careers-internships",
  "contact",
  "subscribe",
];

/** @param {"static" | "dynamic" | "all"} scope */
export function pageList(scope) {
  const all = readdirSync(HIGHLAND)
    .filter((f) => f.endsWith(".html"))
    .map((f) => f.slice(0, -".html".length))
    .sort();
  if (scope === "all") return all;
  if (scope === "static") return STATIC_PAGES;
  if (scope === "dynamic") return all.filter((p) => !STATIC_PAGES.includes(p));
  throw new Error(`Unknown parity scope ${JSON.stringify(scope)}; use static, dynamic or all.`);
}
