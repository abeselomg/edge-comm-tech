import { describe, expect, it } from "vitest";
import { Company } from "./Company";
import { ContactDetails } from "./ContactDetails";
import { Careers } from "./Careers";
import { PageCopy } from "./PageCopy";
import { SiteSettings } from "./SiteSettings";

type AnyField = {
  name?: string;
  type?: string;
  required?: boolean;
  validate?: (value: unknown, options: unknown) => unknown;
  fields?: AnyField[];
  tabs?: { fields: AnyField[] }[];
};

const walk = (fields: AnyField[], visit: (f: AnyField) => void) => {
  for (const f of fields) {
    visit(f);
    if (f.fields) walk(f.fields, visit);
    if (f.tabs) f.tabs.forEach((t) => walk(t.fields, visit));
  }
};
const all = (fields: AnyField[]) => {
  const out: AnyField[] = [];
  walk(fields, (f) => out.push(f));
  return out;
};

const globals = { Company, ContactDetails, Careers, PageCopy, SiteSettings };

describe("globals", () => {
  it("guards every text and textarea field, at any depth", () => {
    for (const [name, g] of Object.entries(globals)) {
      const bad = all(g.fields as AnyField[])
        .filter((f) => (f.type === "text" || f.type === "textarea") && !f.validate)
        .map((f) => f.name);
      expect(bad, name).toEqual([]);
    }
  });

  it("keeps required enforced on a guarded required field", () => {
    const caveat = all(Careers.fields as AnyField[]).find((f) => f.name === "caveat")!;
    expect(caveat.validate!("", { required: true })).toBe("This field is required.");
  });

  it("holds no field for tier, authorization, certification, salary or benefit", () => {
    for (const [name, g] of Object.entries(globals)) {
      const names = all(g.fields as AnyField[]).map((f) => f.name ?? "");
      expect(
        names.filter((n) => /tier|authori|certif|salary|benefit|wage|compensation/i.test(n)),
        name,
      ).toEqual([]);
    }
  });

  it("is admin-only for contact details and site settings", () => {
    const admin = { req: { user: { role: "admin" } } } as never;
    const editor = { req: { user: { role: "editor" } } } as never;
    for (const g of [ContactDetails, SiteSettings]) {
      const update = g.access!.update as (a: never) => boolean;
      expect(update(admin)).toBe(true);
      expect(update(editor)).toBe(false);
    }
  });

  it("registers exactly five distinct slugs", () => {
    expect(Object.values(globals).map((g) => g.slug).sort()).toEqual([
      "careers-content",
      "company",
      "contact-details",
      "page-copy",
      "site-settings",
    ]);
  });

  it("makes the internship caveat required", () => {
    const caveat = all(Careers.fields as AnyField[]).find((f) => f.name === "caveat")!;
    expect(caveat.required).toBe(true);
  });

  it("stores the two technology-priority lists separately", () => {
    const names = all(PageCopy.fields as AnyField[]).map((f) => f.name);
    expect(names).toContain("homePriorities");
    expect(names).toContain("solutionsPriorities");
  });
});

describe("impact counter line", () => {
  const line = () => {
    const impact = (SiteSettings.fields as AnyField[]).find((f) => f.name === "impact")!;
    return impact.fields!.find((f) => f.name === "line")!;
  };

  it("is wired to the scope validator, reading siblings the way Payload supplies them", () => {
    const result = line().validate!("of everything we do", {
      required: true,
      siblingData: { figure: "100%" },
    });
    expect(result).toContain("against agreed project scope");
  });

  it("accepts the qualified line", () => {
    expect(
      line().validate!("against agreed project scope", {
        required: true,
        siblingData: { figure: "100%" },
      }),
    ).toBe(true);
  });

  it("does not demand the qualifier on a non-percentage figure", () => {
    expect(
      line().validate!("projects delivered", { required: true, siblingData: { figure: "67+" } }),
    ).toBe(true);
  });

  it("still enforces required and the phrase rules", () => {
    expect(line().validate!("", { required: true, siblingData: { figure: "67+" } })).toBe(
      "This field is required.",
    );
    expect(
      line().validate!("Tier III certified", { required: true, siblingData: { figure: "67+" } }),
    ).not.toBe(true);
  });
});
