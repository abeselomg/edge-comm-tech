import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { eventDates, toConfirmable, toDetailBlocks, toItems, toRichParagraphs } from "./transform";

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
        { title: "Datacenter facility", items: ["Racks", "Cooling"] },
        { title: "IT infrastructure", items: ["CCTV"] },
      ],
    });
    expect(blocks).toHaveLength(1);
    expect(blocks[0].blockType).toBe("bands");
    const items = blocks[0].items as { title: string; entries: { item: string }[] }[];
    expect(items[0].entries).toEqual([{ item: "Racks" }, { item: "Cooling" }]);
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
  // Highland's bands carry { label, title, items: [{ title, body }] }.
  it("flattens object band entries into strings the bands block accepts", () => {
    const blocks = toDetailBlocks({
      bands: [{ label: "L", title: "T", items: [{ title: "Racks", body: "Rack systems." }] }],
    });
    const items = blocks[0].items as { title: string; entries: { item: string }[] }[];
    expect(items[0].entries).toEqual([{ item: "Racks: Rack systems." }]);
    expect(JSON.stringify(blocks)).not.toContain('"label"');
  });

  it("draws every solution's content into schema-valid blocks", async () => {
    const { SOLUTION_DETAIL } = (await import("../../design-src/highland/detail.mjs")) as {
      SOLUTION_DETAIL: Record<string, Record<string, unknown>>;
    };
    const slugs = Object.keys(SOLUTION_DETAIL);
    expect(slugs).toHaveLength(7);
    const solutionsSrc = readFileSync("src/collections/Solutions.ts", "utf8");
    const blockRegion = solutionsSrc.slice(solutionsSrc.indexOf("const DETAIL_BLOCKS"), solutionsSrc.indexOf("export const Solutions"));
    const known = [...blockRegion.matchAll(/slug: "([a-z]+)",\n\s+labels/g)].map((m) => m[1]);
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
