/*
 * Which Highland properties have somewhere to live in the CMS?
 *
 * Phase 3 modelled the data from the content modules, but only the Phase 4
 * templates were ever rendered against it. The news article template reads
 * `draft` and `pendingFields`, and the schema held neither: the seed had
 * quietly turned `sections` into headings and dropped the other two. A page
 * built on that fails parity one family at a time. This finds every such gap
 * once, before any dynamic page is written.
 *
 * Two checks per Highland record type:
 *   1. every property its records carry is accounted for in MAP, and
 *   2. every CMS field MAP points at exists in the generated payload types.
 * A value of null means the property is derived at render time (a status
 * computed from dates) and needs no field.
 *
 * Usage: node tools/audit-dynamic-content.mjs   (exit 1 on any gap)
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import * as C from "../design-src/highland/content.mjs";
import * as E from "../design-src/highland/editorial.mjs";
import * as P from "../design-src/highland/people.mjs";
import * as D from "../design-src/highland/detail.mjs";
import * as PD from "../design-src/highland/project-detail.mjs";

const TYPES = new URL("../src/payload-types.ts", import.meta.url);

/* Highland property -> CMS field on that collection, or null when derived. */
const MAP = {
  Solution: {
    records: Object.values(C.SOLUTIONS),
    map: { blurb: "blurb", n: "order", short: "short", slug: "slug", title: "title" },
  },
  "Solution (detail)": {
    collection: "Solution",
    records: Object.values(D.SOLUTION_DETAIL),
    map: {
      bands: "detail", capabilities: "detail", checklist: "detail", checklistNote: "detail",
      checklistTitle: "detail", experience: "experience", headline: "headline", intro: "intro",
      layers: "detail", layersTitle: "detail", lead: "lead", links: "related", measures: "detail",
      measuresTitle: "detail", note: "note", outcomes: "outcomes", outcomesTitle: "outcomesTitle",
      partners: "partners", sectors: "detail", steps: "detail", stepsTitle: "detail",
    },
  },
  Service: {
    records: Object.values(C.SERVICES),
    map: { blurb: "blurb", n: "order", short: "short", slug: "slug", title: "title" },
  },
  "Service (detail)": {
    collection: "Service",
    records: Object.values(D.SERVICE_DETAIL),
    map: {
      capabilities: "capabilities", checklist: "checklist", checklistTitle: "checklistTitle",
      fit: "fit", headline: "headline", intro: "intro", links: "related", models: "models",
      modelsTitle: "modelsTitle", note: "note",
    },
  },
  Project: {
    records: Object.values(C.PROJECTS),
    map: {
      client: "client", featured: "featured", location: "location", primary: "primary",
      sector: "sector", sectorFull: "sectorFull", slug: "slug", solutions: "solutions",
      summary: "summary", tech: "tech", title: "title", year: "year",
    },
  },
  "Project (detail)": {
    collection: "Project",
    records: Object.values(PD.PROJECT_DETAIL),
    map: {
      delivered: "delivered", headline: "headline", need: "need", outcomes: "outcomes",
      privacy: "privacy", scope: "scope", technology: "technology",
      technologyNote: "technologyNote", training: "training",
    },
  },
  News: {
    records: E.NEWS,
    map: {
      archive: "archive", date: "date", draft: "heldForPublication", kind: "kind",
      paras: "body", pendingFields: "pendingFields", sections: "sections",
      slug: "slug", standfirst: "standfirst", title: "title",
    },
  },
  Event: {
    records: E.EVENTS,
    map: {
      action: "action", audience: "audience", category: "category", date: "displayDate",
      format: "format", headline: "headline", intro: "intro", iso: "startsOn",
      pending: "pendingNote", program: "program", slug: "slug",
      status: null, // derived from startsOn/endsOn by eventStatus()
      title: "title", venue: "venue",
    },
  },
  Post: {
    records: E.POSTS,
    map: {
      anchor: "anchor", cat: "category", label: "readMoreLabel", paras: "body",
      slug: "slug", title: "title", to: "target",
    },
  },
  Job: {
    records: P.JOBS,
    map: {
      deadline: "deadline", department: "department", level: "level", location: "location",
      preferred: "preferred", purpose: "purpose", purposeTitle: "purposeTitle",
      reports: "reports", required: "required", responsibilities: "responsibilities",
      scope: "scope", slug: "slug", status: "status", success: "success",
      title: "title", type: "type",
    },
  },
};

/** The field names of `export interface <Name> {` in the generated types. */
function interfaceFields(source, name) {
  const start = source.indexOf(`export interface ${name} {`);
  if (start < 0) return null;
  // The generated file may carry CRLF endings (a Windows checkout), so the closing
  // brace is matched with either line ending; otherwise the slice runs to the end
  // of the file and picks up fields of later interfaces.
  const end = start + source.slice(start).search(/\r?\n}\r?\n/);
  const body = source.slice(start, end);
  return new Set([...body.matchAll(/^ {2}(\w+)\??:/gm)].map((m) => m[1]));
}

export function audit(typesSource = readFileSync(TYPES, "utf8")) {
  const problems = [];
  for (const [label, { collection, records, map }] of Object.entries(MAP)) {
    const iface = collection ?? label;
    const fields = interfaceFields(typesSource, iface);
    if (!fields) {
      problems.push(`${label}: no ${iface} interface in payload-types.ts`);
      continue;
    }
    const keys = new Set(records.flatMap((r) => Object.keys(r)));
    for (const key of keys) {
      if (!(key in map)) problems.push(`${label}: Highland property "${key}" is not in the audit map`);
    }
    for (const [key, field] of Object.entries(map)) {
      if (field !== null && !fields.has(field)) {
        problems.push(`${label}: "${key}" maps to ${iface}.${field}, which does not exist`);
      }
    }
  }
  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problems = audit();
  if (problems.length) {
    console.error(`FAIL — ${problems.length} gap(s):`);
    for (const p of problems) console.error(`  ${p}`);
    process.exit(1);
  }
  console.log("PASS — every Highland property used by the dynamic pages has a CMS field");
}
