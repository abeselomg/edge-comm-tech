import { describe, expect, it } from "vitest";
import { forbidsPhrases, PROJECT_RULES } from "./validators";

/*
 * Every string in the approved content, run through the rules that will guard
 * the field it lands in.
 *
 * The guardrails have two failure directions and only one of them is obvious.
 * Blocking too little publishes a forbidden claim. Blocking too much refuses
 * copy the client signed off across several rounds — which stops the seed, and
 * stops an editor saving a paragraph they are supposed to be able to save.
 *
 * That second direction has bitten twice. Widening the joiner class made the
 * rules match across sentence boundaries, so "labelled fully. Secure racks
 * follow" read as an absolute security claim. Then the bare authorization
 * phrase refused the Procurement service's "Engage relevant manufacturers,
 * authorized distributors, and technology partners", which publishes no status
 * of Edge's at all.
 *
 * Both were found by someone thinking to look. This test means nobody has to:
 * tighten a rule past what the approved content says, and it fails here rather
 * than in the seed.
 *
 * design-src/ is read-only client-approved material. This only reads it.
 */

/** Every non-empty string anywhere in a value. */
const strings = (value: unknown, out: string[] = []): string[] => {
  if (typeof value === "string") {
    if (value.trim()) out.push(value);
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => strings(item, out));
    return out;
  }
  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => strings(item, out));
    return out;
  }
  return out;
};

describe("the rules permit all of the approved content", () => {
  it("passes every string, under the rules its field will carry", async () => {
    const content = (await import("../../design-src/highland/content.mjs")) as Record<
      string,
      unknown
    >;
    const detail = await import("../../design-src/highland/detail.mjs");
    const projectDetail = await import("../../design-src/highland/project-detail.mjs");

    // Project records carry the extra SOC rule, because the approved wording
    // for Bahir Dar's campus spaces is "security control room" there.
    const underBaseRules: unknown[] = [{ ...content, PROJECTS: undefined }, detail];
    const underProjectRules: unknown[] = [content.PROJECTS, projectDetail];

    const base = forbidsPhrases();
    const project = forbidsPhrases(PROJECT_RULES);
    const failures: string[] = [];
    let checked = 0;

    for (const source of underBaseRules) {
      for (const text of strings(source)) {
        checked += 1;
        const result = base(text);
        if (result !== true) failures.push(`${result}\n    in: ${text.slice(0, 160)}`);
      }
    }
    for (const source of underProjectRules) {
      for (const text of strings(source)) {
        checked += 1;
        const result = project(text);
        if (result !== true) failures.push(`${result}\n    in: ${text.slice(0, 160)}`);
      }
    }

    // Guard against the loop passing by reading nothing: the real content is
    // well over a thousand strings, so a collapse to a handful means the
    // imports changed shape rather than the content shrinking.
    expect(checked, "should have read the whole content set").toBeGreaterThan(1000);
    expect(failures, `${failures.length} approved strings refused`).toEqual([]);
  });
});
