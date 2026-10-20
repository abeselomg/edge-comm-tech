import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  eventDates,
  toConfirmable,
  toDetailBlocks,
  toItems,
  toNewsBody,
  toRichParagraphs,
} from "./transform";

describe("toItems", () => {
  it("wraps strings for Payload's array-of-one-field shape", () => {
    expect(toItems(["a", "b"])).toEqual([{ item: "a" }, { item: "b" }]);
  });

  it("returns an empty array for an empty or absent list", () => {
    expect(toItems([])).toEqual([]);
    expect(toItems(undefined as unknown as string[])).toEqual([]);
  });
});

describe("toConfirmable", () => {
  it("treats a real value as confirmed", () => {
    expect(toConfirmable("2024/2025", "Year to confirm")).toEqual({
      value: "2024/2025",
      status: "confirmed",
      pendingLabel: null,
    });
  });

  it("recognises Highland's to-confirm wording as pending", () => {
    expect(toConfirmable("Year to confirm", "Year to confirm")).toEqual({
      value: null,
      status: "pending",
      pendingLabel: "Year to confirm",
    });
  });

  it("recognises the same wording in any case", () => {
    expect(toConfirmable("To be confirmed", "Deadline to be confirmed").status).toBe("pending");
  });

  it("treats an empty or absent value as pending with the fallback label", () => {
    expect(toConfirmable("", "Date to confirm")).toEqual({
      value: null,
      status: "pending",
      pendingLabel: "Date to confirm",
    });
    expect(toConfirmable(undefined, "Date to confirm").status).toBe("pending");
  });

  it("does not mistake a value that merely contains a date for pending", () => {
    expect(toConfirmable("2026", "Date to confirm").status).toBe("confirmed");
  });
});

describe("toRichParagraphs", () => {
  it("builds an editor state whose text survives the round trip", () => {
    const state = toRichParagraphs(["First para.", "Second para."]);
    expect(JSON.stringify(state)).toContain("First para.");
    expect(JSON.stringify(state)).toContain("Second para.");
  });

  it("produces one paragraph node per string", () => {
    const state = toRichParagraphs(["a", "b", "c"]) as { root: { children: unknown[] } };
    expect(state.root.children).toHaveLength(3);
  });
});

describe("eventDates", () => {
  it("derives an end date from a day range", () => {
    // GITEX. Highland stores only the start; the range lives in the display string.
    expect(eventDates({ iso: "2026-12-07", date: "7–11 December 2026" })).toEqual({
      startsOn: "2026-12-07",
      endsOn: "2026-12-11",
    });
  });

  it("handles a hyphen as well as an en dash", () => {
    expect(eventDates({ iso: "2026-12-07", date: "7-11 December 2026" }).endsOn).toBe("2026-12-11");
  });

  it("leaves endsOn null for a single-day event", () => {
    expect(eventDates({ iso: "2026-09-28", date: "28 September 2026" })).toEqual({
      startsOn: "2026-09-28",
      endsOn: null,
    });
  });

  it("leaves endsOn null when the range crosses months, rather than guessing", () => {
    expect(eventDates({ iso: "2026-11-30", date: "30 November – 2 December 2026" }).endsOn).toBe(
      null,
    );
  });

  it("passes the start date through untouched", () => {
    expect(eventDates({ iso: "2026-10-23", date: "23 October 2026" }).startsOn).toBe("2026-10-23");
  });
});

describe("toDetailBlocks", () => {
  it("turns a flat capability list into one capabilities block", () => {
    const blocks = toDetailBlocks({
      capabilities: [{ title: "Cloud Security", body: "Posture and workload protection." }],
    });
    expect(blocks).toHaveLength(1);
    expect(blocks[0].blockType).toBe("capabilities");
    expect((blocks[0].items as unknown[])).toHaveLength(1);
  });

  it("turns named bands into a bands block with nested entries", () => {
    const blocks = toDetailBlocks({
      capabilities: [],
      bands: [
        {
          label: "Facility",
          title: "Datacenter facility",
          items: [
            { title: "Racks", body: "Rack systems." },
            { title: "Cooling", body: "Precision cooling." },
          ],
        },
        { label: "IT", title: "IT infrastructure", items: [{ title: "CCTV", body: "Cameras." }] },
      ],
    });
    expect(blocks).toHaveLength(1);
    expect(blocks[0].blockType).toBe("bands");
    const items = blocks[0].items as {
      label: string;
      title: string;
      entries: { title: string; body: string }[];
    }[];
    expect(items[0].entries).toEqual([
      { title: "Racks", body: "Rack systems." },
      { title: "Cooling", body: "Precision cooling." },
    ]);
    expect(items[0].label).toBe("Facility");
    expect(items[1].label).toBe("IT");
  });

  it("falls back to the title when a band has no label", () => {
    // The eyebrow is required by the block, so it cannot be left empty.
    const blocks = toDetailBlocks({
      bands: [{ title: "Only a title", items: [{ title: "x", body: "y" }] }],
    });
    const items = blocks[0].items as { label: string; title: string }[];
    expect(items[0].label).toBe("Only a title");
  });

  it("emits a checklist block only when there are items", () => {
    expect(toDetailBlocks({ checklistTitle: "Controls", checklist: [] })).toHaveLength(0);
    expect(
      toDetailBlocks({ checklistTitle: "Controls", checklist: ["Least privilege"] }),
    ).toHaveLength(1);
  });

  it("keeps the approved section order", () => {
    const blocks = toDetailBlocks({
      capabilities: [{ title: "A", body: "a" }],
      layers: [{ title: "L", body: "l" }],
      sectors: [{ title: "Banking & Finance", body: "s" }],
      measures: ["Reduced handling time"],
      steps: [{ title: "S", body: "s" }],
      checklistTitle: "C",
      checklist: ["c"],
      modelsTitle: "M",
      models: [{ title: "M1", body: "m" }],
    });
    expect(blocks.map((b) => b.blockType)).toEqual([
      "capabilities",
      "layers",
      "steps",
      "checklist",
      "measures",
      "sectors",
      "models",
    ]);
  });

  it("carries the heading that belongs to each section", () => {
    const blocks = toDetailBlocks({
      layers: [{ title: "L", body: "l" }],
      layersTitle: "Flexible deployment based on risk",
      measures: ["Adoption"],
      measuresTitle: "Measure business value, not only model performance",
      stepsTitle: "How we approach it",
      steps: [{ title: "S", body: "s" }],
    });
    const byType = Object.fromEntries(blocks.map((b) => [b.blockType, b.title]));
    expect(byType.layers).toBe("Flexible deployment based on risk");
    expect(byType.measures).toBe("Measure business value, not only model performance");
    expect(byType.steps).toBe("How we approach it");
  });

  it("carries the qualifying note that belongs under a checklist", () => {
    const blocks = toDetailBlocks({
      checklistTitle: "Principles",
      checklist: ["Least privilege"],
      checklistNote: "Sensitive decisions remain subject to authorized human review.",
    });
    expect(blocks[0].note).toContain("human review");
  });

  it("turns a flat measures list into items rather than titled bodies", () => {
    const blocks = toDetailBlocks({ measures: ["Reduced handling time", "Higher resolution rate"] });
    expect(blocks[0].items).toEqual([
      { item: "Reduced handling time" },
      { item: "Higher resolution rate" },
    ]);
  });

  it("returns nothing for an empty detail record", () => {
    expect(toDetailBlocks({})).toEqual([]);
  });
});

describe("eventDates guards", () => {
  it("returns null rather than a backwards range", () => {
    expect(eventDates({ iso: "2026-12-11", date: "7–11 December 2026" }).endsOn).toBe("2026-12-11");
    expect(eventDates({ iso: "2026-12-12", date: "7–11 December 2026" }).endsOn).toBe(null);
  });
});

describe("toDetailBlocks against Highland's real content", () => {
  /*
   * Highland's bands carry { label, title, items: [{ title, body }] } and all
   * three parts render: solution.mjs passes `label` as the section eyebrow and
   * `title` as its heading, then sends each item through the same card
   * renderer the capability list uses, which emits the item title as an h3
   * with its body as a paragraph. Nothing may be dropped or merged.
   */
  it("carries the band label and keeps each entry's title and body apart", () => {
    const blocks = toDetailBlocks({
      bands: [
        {
          label: "Datacenter facility",
          title: "Tier-aligned modern datacenter facilities",
          items: [{ title: "Racks", body: "Rack systems." }],
        },
      ],
    });
    const items = blocks[0].items as {
      label: string;
      title: string;
      entries: { title: string; body: string }[];
    }[];
    expect(items[0].label).toBe("Datacenter facility");
    expect(items[0].title).toBe("Tier-aligned modern datacenter facilities");
    expect(items[0].entries).toEqual([{ title: "Racks", body: "Rack systems." }]);
    // The old transform merged these into "Racks: Rack systems.".
    expect(JSON.stringify(blocks)).not.toContain("Racks: Rack systems.");
  });

  it("preserves every band label and entry body in the real content", async () => {
    const { SOLUTION_DETAIL } = (await import("../../design-src/highland/detail.mjs")) as {
      SOLUTION_DETAIL: Record<string, Record<string, unknown>>;
    };
    let bandsSeen = 0;
    for (const detail of Object.values(SOLUTION_DETAIL)) {
      const source = (detail.bands ?? []) as {
        label?: string;
        title: string;
        items: { title: string; body: string }[];
      }[];
      if (!source.length) continue;
      const emitted = toDetailBlocks(detail).find((b) => b.blockType === "bands");
      expect(emitted, "a solution with bands should emit a bands block").toBeDefined();
      const items = emitted!.items as {
        label: string;
        entries: { title: string; body: string }[];
      }[];
      expect(items).toHaveLength(source.length);
      source.forEach((band, i) => {
        bandsSeen += 1;
        expect(items[i].label).toBe(band.label ?? band.title);
        expect(items[i].entries).toHaveLength(band.items.length);
        band.items.forEach((entry, j) => {
          expect(items[i].entries[j].title).toBe(entry.title);
          expect(items[i].entries[j].body).toBe(entry.body);
        });
      });
    }
    // Without this the loop could pass by never running.
    expect(bandsSeen, "the real content should contain bands").toBeGreaterThan(0);
  });

  it("draws every solution's content into schema-valid blocks", async () => {
    const { SOLUTION_DETAIL } = (await import("../../design-src/highland/detail.mjs")) as {
      SOLUTION_DETAIL: Record<string, Record<string, unknown>>;
    };
    const slugs = Object.keys(SOLUTION_DETAIL);
    expect(slugs).toHaveLength(7);
    // A URL rather than a path relative to the cwd, so this does not depend on
    // where the runner was started from.
    const solutionsSrc = readFileSync(new URL("../collections/Solutions.ts", import.meta.url), "utf8");
    const blockRegion = solutionsSrc.slice(solutionsSrc.indexOf("const DETAIL_BLOCKS"), solutionsSrc.indexOf("export const Solutions"));
    /*
     * \s+ rather than \n\s+: this repo is checked out with CRLF (core.autocrlf
     * is true and there is no .gitattributes), so a literal \n cannot match
     * the \r\n actually on disk. With it, the match found nothing on a clean
     * checkout and the failure read as "the collection declares no blocks"
     * rather than "the regex missed the line ending".
     */
    const known = [...blockRegion.matchAll(/slug: "([a-z]+)",\s+labels/g)].map((m) => m[1]);
    expect(known).toHaveLength(8);
    for (const slug of slugs) {
      const blocks = toDetailBlocks(SOLUTION_DETAIL[slug]);
      expect(blocks.length).toBeGreaterThan(0);
      for (const b of blocks) {
        expect(known).toContain(b.blockType);
        const items = b.items as Record<string, unknown>[];
        expect(items.length).toBeGreaterThan(0);
        for (const it of items) {
          for (const v of Object.values(it)) {
            if (typeof v === "string") expect(v.length).toBeGreaterThan(0);
          }
        }
        if (b.blockType === "bands") expect(items.length).toBeGreaterThanOrEqual(2);
        // Required titles on the blocks that insist on one.
        if (["measures", "checklist", "models"].includes(b.blockType)) {
          expect(typeof b.title).toBe("string");
        }
      }
    }
    const dc = toDetailBlocks(SOLUTION_DETAIL["datacenter-facility-it-infrastructure"]);
    expect(dc.map((b) => b.blockType)).toEqual(["bands", "steps"]);
  });

  it("draws every service's content too", async () => {
    const { SERVICE_DETAIL } = (await import("../../design-src/highland/detail.mjs")) as {
      SERVICE_DETAIL: Record<string, Record<string, unknown>>;
    };
    expect(Object.keys(SERVICE_DETAIL)).toHaveLength(6);
    const managed = toDetailBlocks(SERVICE_DETAIL["managed-support-maintenance"]);
    expect(managed.map((b) => b.blockType)).toEqual(["capabilities", "models"]);
  });

  it("turns the real event dates and project years into the right shapes", async () => {
    const { EVENTS } = (await import("../../design-src/highland/editorial.mjs")) as {
      EVENTS: { iso: string; date: string }[];
    };
    expect(EVENTS.map(eventDates).map((d) => d.endsOn)).toEqual([null, null, "2026-12-11"]);
    const { PROJECTS } = (await import("../../design-src/highland/content.mjs")) as {
      PROJECTS: { year: string }[];
    };
    const statuses = PROJECTS.map((x) => toConfirmable(x.year, "Year to confirm").status);
    expect(statuses.filter((s) => s === "pending")).toHaveLength(1);
    expect(statuses.filter((s) => s === "confirmed")).toHaveLength(7);
  });
});

/*
 * The review mutated `titledBodies` to `({ title }) => ({ title, body: title })`
 * and all 29 tests still passed — so roughly sixty approved capability, layer
 * and step bodies could have been seeded as copies of their own headings with
 * the suite green. The existing tests only checked that strings were
 * non-empty, and only the band path compared against the source.
 *
 * These compare every titled body in the real content against what is emitted.
 */
describe("every titled body survives the transform", () => {
  const BLOCKS_WITH_BODIES = ["capabilities", "layers", "steps", "sectors", "models"] as const;

  it("matches the source title and body for every entry, in every record", async () => {
    const { SOLUTION_DETAIL, SERVICE_DETAIL } = (await import(
      "../../design-src/highland/detail.mjs"
    )) as {
      SOLUTION_DETAIL: Record<string, Record<string, unknown>>;
      SERVICE_DETAIL: Record<string, Record<string, unknown>>;
    };

    let compared = 0;
    for (const record of [
      ...Object.values(SOLUTION_DETAIL),
      ...Object.values(SERVICE_DETAIL),
    ]) {
      const emitted = toDetailBlocks(record);
      for (const key of BLOCKS_WITH_BODIES) {
        const source = (record[key] ?? []) as { title: string; body: string }[];
        if (!source.length) continue;
        const block = emitted.find((b) => b.blockType === key);
        expect(block, `a record with ${key} should emit a ${key} block`).toBeDefined();
        const items = block!.items as { title: string; body: string }[];
        expect(items, key).toHaveLength(source.length);
        source.forEach((entry, i) => {
          expect(items[i].title, `${key}[${i}].title`).toBe(entry.title);
          expect(items[i].body, `${key}[${i}].body`).toBe(entry.body);
          compared += 1;
        });
      }
    }

    // Without this the loop could pass by comparing nothing at all.
    expect(compared, "should have compared many bodies").toBeGreaterThan(40);
  });

  it("does not let a body be a copy of its own title", async () => {
    // The specific substitution the review used to defeat the old tests.
    const { SOLUTION_DETAIL } = (await import("../../design-src/highland/detail.mjs")) as {
      SOLUTION_DETAIL: Record<string, Record<string, unknown>>;
    };
    let checked = 0;
    for (const record of Object.values(SOLUTION_DETAIL)) {
      const caps = (record.capabilities ?? []) as { title: string; body: string }[];
      if (!caps.length) continue;
      const block = toDetailBlocks(record).find((b) => b.blockType === "capabilities");
      for (const item of block!.items as { title: string; body: string }[]) {
        expect(item.body, item.title).not.toBe(item.title);
        checked += 1;
      }
    }
    expect(checked).toBeGreaterThan(10);
  });
});

/*
 * One of the three approved news records carries `sections` of {title, body}
 * instead of `paras`, because it is a longer Insight piece that
 * news-article.mjs renders as an h2 with a paragraph beneath. Passing `paras`
 * straight through gave it an empty body, and `body` is required, so the seed
 * refused the document — correctly, but only at the database. Nothing before
 * that point knew the shape varied.
 */
describe("toNewsBody handles both shapes Highland uses", () => {
  const texts = (body: unknown): string[] => {
    const out: string[] = [];
    const walk = (n: unknown): void => {
      if (!n || typeof n !== "object") return;
      if (Array.isArray(n)) return void n.forEach(walk);
      const r = n as Record<string, unknown>;
      if (typeof r.text === "string" && r.text) out.push(r.text);
      if (r.root) walk(r.root);
      if (Array.isArray(r.children)) r.children.forEach(walk);
    };
    walk(body);
    return out;
  };
  const tags = (body: unknown): string[] => {
    const root = (body as { root: { children: { type: string; tag?: string }[] } }).root;
    return root.children.map((c) => c.tag ?? c.type);
  };

  it("turns paras into plain paragraphs", () => {
    const body = toNewsBody({ paras: ["First.", "Second."] });
    expect(tags(body)).toEqual(["paragraph", "paragraph"]);
    expect(texts(body)).toEqual(["First.", "Second."]);
  });

  it("turns sections into a heading and a paragraph each", () => {
    const body = toNewsBody({
      sections: [
        { title: "Reliable foundations", body: "Networks first." },
        { title: "Trusted data", body: "Then identity." },
      ],
    });
    expect(tags(body)).toEqual(["h2", "paragraph", "h2", "paragraph"]);
    expect(texts(body)).toEqual([
      "Reliable foundations",
      "Networks first.",
      "Trusted data",
      "Then identity.",
    ]);
  });

  it("produces a body for every approved news record", async () => {
    const { NEWS } = (await import("../../design-src/highland/editorial.mjs")) as {
      NEWS: { slug: string; paras?: string[]; sections?: { title: string; body: string }[] }[];
    };
    expect(NEWS.length).toBeGreaterThan(0);
    for (const n of NEWS) {
      const body = toNewsBody(n);
      // An empty body is refused by the required field, so every record must
      // yield text from whichever shape it happens to carry.
      expect(texts(body).length, `${n.slug} should have body text`).toBeGreaterThan(0);
    }
  });

  it("yields nothing for a record carrying neither shape", () => {
    expect(texts(toNewsBody({}))).toEqual([]);
  });
});
