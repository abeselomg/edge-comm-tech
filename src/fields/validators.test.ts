import { describe, expect, it } from "vitest";
import {
  BASE_RULES,
  PROJECT_RULES,
  extractText,
  forbidsPhrases,
  requiresScopeQualifier,
} from "./validators";

describe("extractText", () => {
  it("returns a plain string unchanged", () => {
    expect(extractText("hello")).toBe("hello");
  });

  it("walks a Lexical node tree and joins its text", () => {
    const lexical = {
      root: {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              { type: "text", text: "A " },
              { type: "text", text: "Tier III certified" },
              { type: "text", text: " datacenter" },
            ],
          },
        ],
      },
    };
    expect(extractText(lexical)).toContain("Tier III certified");
  });

  it("reaches text nested several levels deep", () => {
    const lexical = {
      root: { children: [{ children: [{ children: [{ type: "text", text: "gold partner" }] }] }] },
    };
    expect(extractText(lexical)).toContain("gold partner");
  });

  it("returns an empty string for null, undefined and numbers", () => {
    expect(extractText(null)).toBe("");
    expect(extractText(undefined)).toBe("");
    expect(extractText(42)).toBe("");
  });
});

describe("forbidsPhrases", () => {
  const validate = forbidsPhrases();

  it("passes ordinary copy", () => {
    expect(validate("A Tier III-aligned datacenter facility.")).toBe(true);
  });

  it("passes empty and absent values, leaving required-ness to the field", () => {
    expect(validate("")).toBe(true);
    expect(validate(undefined)).toBe(true);
  });

  it("blocks Tier III certified and names the rule", () => {
    const result = validate("A Tier III certified facility.");
    expect(result).not.toBe(true);
    expect(String(result)).toContain("Tier III-aligned");
  });

  it("blocks the hyphenated and cased variants", () => {
    expect(validate("tier iii-certified")).not.toBe(true);
    expect(validate("TIER 3 CERTIFIED")).not.toBe(true);
  });

  it("blocks partner tier claims", () => {
    expect(validate("We are a gold partner.")).not.toBe(true);
    expect(validate("An authorized reseller of HPE.")).not.toBe(true);
    expect(validate("A certified partner.")).not.toBe(true);
  });

  it("blocks absolute security claims", () => {
    expect(validate("Your data is 100% secure.")).not.toBe(true);
    expect(validate("A fully secure network.")).not.toBe(true);
  });

  it("blocks a forbidden phrase hidden in rich text", () => {
    const lexical = {
      root: { children: [{ children: [{ type: "text", text: "Tier III certified" }] }] },
    };
    expect(validate(lexical)).not.toBe(true);
  });

  it("allows SOC by default, because the cybersecurity page needs it", () => {
    expect(validate("Managed SOC services.")).toBe(true);
  });

  it("blocks SOC under the project rules only", () => {
    const projectValidate = forbidsPhrases(PROJECT_RULES);
    const result = projectValidate("Two campus SOC rooms were commissioned.");
    expect(result).not.toBe(true);
    expect(String(result)).toContain("security control room");
    expect(projectValidate("Two campus security control rooms.")).toBe(true);
  });

  it("still applies the base rules when given project rules", () => {
    expect(forbidsPhrases(PROJECT_RULES)("gold partner")).not.toBe(true);
  });

  it("does not fire on SOC inside an unrelated word", () => {
    const projectValidate = forbidsPhrases(PROJECT_RULES);
    expect(projectValidate("Associated social infrastructure.")).toBe(true);
  });

  it("exposes its rules, each with a message", () => {
    expect(BASE_RULES.length).toBeGreaterThan(0);
    for (const rule of BASE_RULES) expect(rule.message).not.toHaveLength(0);
  });
});

describe("requiresScopeQualifier", () => {
  it("requires the qualifier when the figure is a percentage", () => {
    const result = requiresScopeQualifier("of everything", { figure: "100%" });
    expect(result).not.toBe(true);
    expect(String(result)).toContain("against agreed project scope");
  });

  it("accepts the approved qualifier", () => {
    expect(requiresScopeQualifier("against agreed project scope", { figure: "100%" })).toBe(true);
  });

  it("matches the qualifier case-insensitively", () => {
    expect(requiresScopeQualifier("Against Agreed Project Scope", { figure: "100%" })).toBe(true);
  });

  it("ignores non-percentage figures", () => {
    expect(requiresScopeQualifier("projects delivered", { figure: "67+" })).toBe(true);
  });

  it("ignores an absent figure", () => {
    expect(requiresScopeQualifier("anything", {})).toBe(true);
  });
});
