import { describe, expect, it } from "vitest";
import { SECTOR_OPTIONS, SECTOR_SHORT, sectorSlug } from "./sectors";
import { CLIENTS, PROJECTS } from "../../design-src/highland/content.mjs";

describe("the sector vocabulary", () => {
  it("stores slugs, not display labels", () => {
    expect(SECTOR_OPTIONS.map((o) => o.value)).toEqual([
      "education",
      "banking",
      "government",
    ]);
  });

  it("gives every stored slug a short label for the card chip", () => {
    // The long select label is for the editor; the page prints the short form.
    // Both come off one table, and this fails if a row ever loses its short.
    for (const { value } of SECTOR_OPTIONS) {
      expect(SECTOR_SHORT[value], `no short label for "${value}"`).toBeTruthy();
      expect(SECTOR_SHORT[value]).not.toBe(value);
    }
    expect(SECTOR_SHORT).toEqual({
      education: "Education",
      banking: "Banking",
      government: "Government",
    });
  });
});

describe("resolving a sector", () => {
  it("accepts the slug a client carries", () => {
    expect(sectorSlug("education")).toBe("education");
    expect(sectorSlug("banking")).toBe("banking");
    expect(sectorSlug("government")).toBe("government");
  });

  it("accepts the short label a project carries", () => {
    expect(sectorSlug("Education")).toBe("education");
    expect(sectorSlug("Banking")).toBe("banking");
    expect(sectorSlug("Government")).toBe("government");
  });

  it("ignores casing and surrounding space", () => {
    expect(sectorSlug("  GOVERNMENT  ")).toBe("government");
    expect(sectorSlug("eDuCaTiOn")).toBe("education");
  });

  /*
   * The whole reason this is a function and not a .toLowerCase() call at the
   * two write sites. Both index pages group records by this value, so a sector
   * that resolved to undefined would drop the record out of its group -- the
   * page would simply be missing an institution while the seed reported
   * success. Refusing is the only safe failure.
   */
  it("refuses an unknown sector, naming it and the approved vocabulary", () => {
    expect(() => sectorSlug("Healthcare")).toThrow(
      /Unknown sector "Healthcare"/,
    );
    expect(() => sectorSlug("Healthcare")).toThrow(/"education" \(Education\)/);
    expect(() => sectorSlug("Higher Education")).toThrow(/Unknown sector/);
    expect(() => sectorSlug(undefined)).toThrow(/Unknown sector/);
    expect(() => sectorSlug("")).toThrow(/Unknown sector/);
  });

  /*
   * Every sector the approved content actually supplies, from both shapes.
   * Task 14 set this select's options from the brief rather than the content,
   * which is how jobs.level came to offer four values the content does not use
   * and not the one it does. This loop is that check, kept.
   */
  it("resolves every sector value in the approved content", () => {
    let checked = 0;
    for (const record of [...CLIENTS, ...PROJECTS] as { sector: string }[]) {
      checked += 1;
      const slug = sectorSlug(record.sector);
      expect(SECTOR_OPTIONS.map((o) => o.value)).toContain(slug);
    }
    // 10 clients and 8 projects today. The floor is below both so adding a
    // record never fails this, while an import that stops resolving does.
    expect(checked, "should have read both directories").toBeGreaterThan(15);
  });
});
