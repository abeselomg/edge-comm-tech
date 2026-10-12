/*
 * The three sectors in Edge's approved client directory. Shared between
 * clients and projects so the two can never drift into different vocabularies
 * -- a client filed under "Education" whose project says "Higher Education"
 * breaks grouping on both index pages.
 *
 * A three-row collection would be over-modelled: these never change without
 * the content master changing.
 */
export const SECTOR_OPTIONS = [
  { label: "Universities and Education", value: "education" },
  { label: "Banking and Financial Markets", value: "banking" },
  { label: "Government and Public Institutions", value: "government" },
] as const;
