import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { FORM_DEFINITIONS, type FormFieldDef, type FormKey } from "./definitions";

const KEYS: FormKey[] = [
  "contact",
  "subscribe",
  "event-registration",
  "academy-enquiry",
  "job-application",
  "internship-application",
];

const root = path.resolve(__dirname, "../../..");
const highland = (rel: string) => path.join(root, "design-src/highland", rel);

/*
 * The Highland FIELDS arrays are module-private constants, and design-src is
 * read-only, so they cannot be imported. Instead the array literal is cut out
 * of the page source and evaluated with the same content modules the page
 * itself imports. A fresh read each run: if Highland moves, parity fails.
 */
async function highlandFields(page: string, constName: string): Promise<Record<string, unknown>[]> {
  const source = readFileSync(highland(`pages/${page}.mjs`), "utf8").replace(/\r\n/g, "\n");
  const start = source.indexOf(`const ${constName} = [`);
  if (start < 0) throw new Error(`${constName} not found in ${page}.mjs`);
  const end = source.indexOf("\n];", start);
  const literal = source.slice(source.indexOf("[", start), end + 3).replace(/;$/, "");
  const content = await import("../../../design-src/highland/content.mjs");
  const people = await import("../../../design-src/highland/people.mjs");
  const fn = new Function(
    "SOLUTIONS",
    "INQUIRY_CATEGORIES",
    "ACADEMY_AUDIENCES",
    "ACADEMY_TRACKS",
    "ACADEMY_LEVELS",
    "ACADEMY_DELIVERY",
    "INTERNSHIP",
    `return ${literal};`,
  );
  return fn(
    content.SOLUTIONS,
    content.INQUIRY_CATEGORIES,
    people.ACADEMY_AUDIENCES,
    people.ACADEMY_TRACKS,
    people.ACADEMY_LEVELS,
    people.ACADEMY_DELIVERY,
    people.INTERNSHIP,
  );
}

const PARITY: Record<FormKey, [string, string]> = {
  contact: ["contact", "FIELDS"],
  subscribe: ["subscribe", "FIELDS"],
  "event-registration": ["event", "REGISTRATION_FIELDS"],
  "academy-enquiry": ["careers-e-academy", "ENQUIRY_FIELDS"],
  "job-application": ["job", "APPLICATION_FIELDS"],
  "internship-application": ["careers-internships", "APPLICATION_FIELDS"],
};

describe("form definitions", () => {
  it("defines exactly the six forms", () => {
    expect(Object.keys(FORM_DEFINITIONS).sort()).toEqual([...KEYS].sort());
  });

  it("contact has nine fields, from Full name to a required wide textarea", () => {
    const f = FORM_DEFINITIONS.contact.fields;
    expect(f).toHaveLength(9);
    expect(f[0].label).toBe("Full name");
    expect(f[1].label).toBe("Organization");
    const last = f[f.length - 1];
    expect(last).toMatchObject({ label: "How can we help?", type: "textarea", required: true, wide: true });
  });

  it("contact inquiry types are the approved categories and exclude Careers", async () => {
    const inquiry = FORM_DEFINITIONS.contact.fields.find((x) => x.label === "Inquiry type")!;
    const { INQUIRY_CATEGORIES } = await import("../../../design-src/highland/content.mjs");
    const titles = INQUIRY_CATEGORIES.map((c: { title: string }) => c.title).filter((t: string) => t !== "Careers");
    expect(inquiry.options).toEqual(["Select", ...titles]);
    expect(inquiry.options).not.toContain("Careers");
    expect(inquiry.options).toHaveLength(7);
  });

  it.each(["job-application", "internship-application"] as const)("%s has one required CV upload", (key) => {
    const uploads = FORM_DEFINITIONS[key].fields.filter((x) => x.type === "upload");
    expect(uploads).toHaveLength(1);
    expect(uploads[0]).toMatchObject({ label: "CV upload", required: true, hint: "PDF or DOCX" });
  });

  it.each(KEYS)("%s: consent, selects and names are well formed", (key) => {
    const def = FORM_DEFINITIONS[key];
    expect(def.consent.startsWith("I ")).toBe(true);
    expect(def.title.length).toBeGreaterThan(0);
    expect(def.confirmationMessage.length).toBeGreaterThan(0);
    const names = def.fields.map((x) => x.name);
    expect(new Set(names).size).toBe(names.length);
    for (const n of names) expect(n).toMatch(/^[a-z][A-Za-z0-9]*$/);
    for (const x of def.fields.filter((y) => y.type === "select")) {
      expect(x.options?.length).toBeGreaterThan(0);
      expect(x.options).not.toContain("");
    }
  });

  it("subscribe carries its two checkbox groups", async () => {
    const { SOLUTIONS } = await import("../../../design-src/highland/content.mjs");
    const boxes = FORM_DEFINITIONS.subscribe.fields.filter((x) => x.type === "checkbox");
    const topics = boxes.filter((x) => x.group === "Topics of interest").map((x) => x.label);
    expect(topics).toEqual(SOLUTIONS.map((s: { short: string }) => s.short));
    expect(boxes.filter((x) => x.group === "What to send").map((x) => x.label)).toEqual([
      "Insights",
      "Events",
      "Company news",
    ]);
    expect(boxes.every((x) => x.group)).toBe(true);
  });

  it.each(KEYS)("%s matches its Highland field list", async (key) => {
    const [page, constName] = PARITY[key];
    let source = await highlandFields(page, constName);
    // The careers category routes to the Careers process, not this form.
    if (key === "contact") {
      source = source.map((s) =>
        s.label === "Inquiry type"
          ? { ...s, options: (s.options as string[]).filter((o) => o !== "Careers") }
          : s,
      );
    }
    const ported = FORM_DEFINITIONS[key].fields.filter((x) => !x.group);
    expect(ported.map((x: FormFieldDef) => x.label)).toEqual(source.map((s) => s.label));
    ported.forEach((x, i) => {
      expect(Boolean(x.required), x.label).toBe(Boolean(source[i].required));
      expect(x.options, x.label).toEqual(source[i].options);
      expect(Boolean(x.wide), x.label).toBe(Boolean(source[i].wide));
      expect(x.hint, x.label).toBe(source[i].hint);
      const t = (source[i].type as string | undefined) ?? "text";
      // Highland types phone numbers as plain text; "tel" is the same field, refined.
      expect(x.type, x.label).toBe(t === "file" ? "upload" : x.type === "tel" ? "tel" : t);
      if (x.type === "tel") expect(t, x.label).toBe("text");
    });
  });

  it("publishes no forbidden organisation, tier, salary or benefit", () => {
    const text = JSON.stringify(FORM_DEFINITIONS);
    for (const word of [/Bonga/i, /Haramaya/i, /Mizan/i, /Yekatit/i, /\btier\b/i, /salary/i, /benefit/i]) {
      expect(text).not.toMatch(word);
    }
  });
});
