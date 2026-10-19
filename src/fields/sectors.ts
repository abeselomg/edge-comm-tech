/*
 * The three sectors in Edge's approved client directory. Shared between
 * clients and projects so the two can never drift into different vocabularies
 * -- a client filed under "Education" whose project says "Higher Education"
 * breaks grouping on both index pages.
 *
 * A three-row collection would be over-modelled: these never change without
 * the content master changing.
 *
 * One table serves both directions. The approved content is inconsistent by
 * accident of how Highland was written: a client carries the slug
 * ("education") while a project carries the short display label
 * ("Education") and Highland maps label to slug at render time
 * (pages/projects.mjs:17). The schema stores the slug for both and derives
 * the display strings, which is the same information in the canonical
 * direction. Because the select options, the short labels and the resolver
 * all read this one table, none of the three can drift from the others.
 */
const SECTORS = [
  {
    value: "education",
    label: "Universities and Education",
    short: "Education",
  },
  {
    value: "banking",
    label: "Banking and Financial Markets",
    short: "Banking",
  },
  {
    value: "government",
    label: "Government and Public Institutions",
    short: "Government",
  },
] as const;

export type SectorSlug = (typeof SECTORS)[number]["value"];

/** The stored vocabulary, in the shape Payload's select field takes. */
export const SECTOR_OPTIONS: { label: string; value: SectorSlug }[] =
  SECTORS.map(({ label, value }) => ({ label, value }));

/*
 * The short form a project card and a page eyebrow print ("Education &middot;
 * 2024"), which is not the select's long label. Both come off the same row.
 */
export const SECTOR_SHORT = Object.fromEntries(
  SECTORS.map(({ value, short }) => [value, short]),
) as Record<SectorSlug, string>;

/**
 * Resolve either spelling the approved content uses -- the slug or the short
 * label, in any casing -- to the stored slug.
 *
 * Throws on anything else rather than guessing. A sector that silently became
 * undefined would write a client or project into no filter group at all, and
 * both index pages group by this value, so the record would simply vanish
 * from the page while the seed reported success.
 */
export function sectorSlug(value: unknown): SectorSlug {
  if (typeof value === "string") {
    const needle = value.trim().toLowerCase();
    const hit = SECTORS.find(
      (s) => s.value === needle || s.short.toLowerCase() === needle,
    );
    if (hit) return hit.value;
  }
  throw new Error(
    `Unknown sector ${JSON.stringify(value)}. The approved vocabulary is ` +
      SECTORS.map((s) => `"${s.value}" (${s.short})`).join(", ") +
      ". Add it to SECTOR_OPTIONS in src/fields/sectors.ts if the content master now carries it.",
  );
}
