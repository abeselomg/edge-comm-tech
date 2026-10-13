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

describe("forbidsPhrases fix round 1", () => {
  const validate = forbidsPhrases();

  it("blocks the British spelling of authorised reseller", () => {
    expect(validate("An authorised reseller of HPE.")).not.toBe(true);
  });

  it("blocks Tier IV certified", () => {
    expect(validate("A Tier IV certified facility.")).not.toBe(true);
  });

  // These sentences are Edge's approved compliance copy. Their whole purpose is
  // to say Edge does NOT claim certification. A rule that blocks them is a bug,
  // not a stricter guardrail: do not widen "certified" to match "certification",
  // and do not widen the authorization rule beyond reseller/partner/distributor.
  describe("permits Edge's own compliance disclaimers", () => {
    it.each([
      "Tier III certification is stated separately only if awarded.",
      "Tier claims and certification status are stated only when independently verified.",
      "Sensitive decisions remain subject to authorized human review.",
    ])("passes: %s", (sentence) => {
      expect(validate(sentence)).toBe(true);
    });
  });
});

/*
 * Every rule used to require whitespace between the words of its phrase, which
 * let the most natural spelling straight through: "Tier-III-certified" passed
 * while "Tier III certified" was blocked. Hyphenating a compound modifier is
 * normal English, so the hyphenated form was arguably the likelier one to be
 * typed -- the guardrail was watching the wrong half of the problem.
 */
describe("forbidsPhrases ignores how the words are joined", () => {
  const validate = forbidsPhrases();
  const blocked = (s: string) => expect(validate(s), `should block: ${s}`).not.toBe(true);

  it("blocks the tier claim however it is punctuated", () => {
    for (const s of [
      "Tier III certified",
      "Tier III-certified",
      "Tier-III-certified",
      "tier-iii-certified",
      "Tier_III_certified",
      "Tier–III–certified", // en dash, what a word processor produces
      "Tier III (certified)",
      "a tier-4-certified facility",
    ])
      blocked(s);
  });

  it("blocks authorization status however it is joined", () => {
    for (const s of ["authorized reseller", "authorised-reseller", "authorized_partner"])
      blocked(s);
  });

  it("blocks partnership and certification tiers however they are joined", () => {
    for (const s of ["gold-partner", "Platinum_Partner", "certified-partner"]) blocked(s);
  });

  /*
   * The plural is how these are actually written, and a partner CATEGORY is
   * plural by nature. "Platinum Partners" as a category label was the natural
   * spelling and the one the singular-only rules let through -- it would have
   * published a partnership tier as a filter group and a ring on the partner
   * diagram, with no validator firing.
   */
  it("blocks the plural, which is how a category would be named", () => {
    for (const s of [
      "Gold Partners",
      "Platinum Partners",
      "Elite Partners",
      "premier partners",
      "authorized resellers",
      "authorised distributors",
      "authorized partners",
      "certified partners",
      "Platinum-Partners",
    ])
      blocked(s);
  });

  it("does not block ordinary plural words that merely end in s", () => {
    const fine = (s: string) => expect(validate(s), `should pass: ${s}`).toBe(true);
    fine("Our technology partners are listed below.");
    fine("We work with distributors across the region.");
    fine("Partners and clients can both request a review.");
  });

  it("blocks absolute security claims however they are joined", () => {
    for (const s of ["fully-secure", "100%-secure", "completely_secure"]) blocked(s);
  });

  it("still permits the disclaimers, which is what limits this widening", () => {
    // The separator widened; "certified" vs "certification" and the
    // reseller/partner/distributor list did NOT. These three sentences are why.
    expect(validate("Tier III certification is stated separately only if awarded.")).toBe(true);
    expect(validate("Sensitive decisions remain subject to authorized human review.")).toBe(true);
    expect(validate("Tier III-aligned data centre design.")).toBe(true);
    expect(validate("Our authorized-human review process.")).toBe(true);
  });

  /*
   * The joiner class must not bridge a sentence boundary. When it included the
   * full stop, every rule matched across two sentences and told an editor off
   * for a claim they never made. These four sentences are the regression: each
   * one is copy Edge could legitimately publish, and each was blocked.
   */
  it("does not match across a sentence boundary", () => {
    const fine = (s: string) => expect(validate(s), `should pass: ${s}`).toBe(true);
    fine("Cabling is tested and labelled fully. Secure racks and containment follow.");
    fine("Access is limited to authorized. Partner institutions apply separately.");
    fine("Delivered to a premier. Partner agencies were consulted.");
    fine("The facility is Tier III. Certified engineers maintain it.");
    // The other sentence-enders are excluded for the same reason.
    fine("Is the cabling labelled fully? Secure racks follow.");
    fine("Everything is labelled fully; secure racks follow.");
    fine("One thing remains: partner agencies must be premier. Partner lists follow.");
  });
});

/*
 * A custom `validate` REPLACES Payload's default one, and the default is what
 * enforces `required`. Attaching forbidsPhrases to a field therefore switched
 * its `required` off -- silently, on 63 fields across 11 collections. These
 * tests pin that it now does that job itself, and that it does not overreach
 * into fields which are genuinely optional or genuinely full.
 */
describe("forbidsPhrases enforces required, because nothing else will", () => {
  const validate = forbidsPhrases();
  const req = { required: true };

  it("refuses an empty required field", () => {
    for (const empty of [undefined, null, "", "   ", "\t\n"]) {
      expect(validate(empty, req), JSON.stringify(empty)).toBe("This field is required.");
    }
  });

  it("still lets an empty OPTIONAL field through", () => {
    for (const empty of [undefined, null, "", "   "]) {
      expect(validate(empty, {}), JSON.stringify(empty)).toBe(true);
      expect(validate(empty), JSON.stringify(empty)).toBe(true);
    }
  });

  it("accepts a required field that has content", () => {
    expect(validate("Data centre design and build.", req)).toBe(true);
  });

  it("still blocks a forbidden claim in a required field", () => {
    // The required check must not short-circuit past the phrase rules.
    expect(validate("A Tier III certified facility.", req)).not.toBe(true);
    expect(validate("A Tier III certified facility.", req)).toMatch(/Tier III-aligned/);
  });

  it("treats an empty rich-text body as empty", () => {
    const emptyEditor = {
      root: { type: "root", children: [{ type: "paragraph", children: [] }] },
    };
    expect(validate(emptyEditor, req)).toBe("This field is required.");
  });

  it("does NOT treat a rich-text body holding only an image as empty", () => {
    // A diagram with no caption is a legitimate body. Judging emptiness on the
    // extracted text alone would refuse it.
    const imageOnly = {
      root: {
        type: "root",
        children: [{ type: "upload", relationTo: "media", value: 7 }],
      },
    };
    expect(validate(imageOnly, req)).toBe(true);
  });

  it("reads text inside a rich-text body as content", () => {
    const withText = {
      root: {
        type: "root",
        children: [{ type: "paragraph", children: [{ type: "text", text: "Hello" }] }],
      },
    };
    expect(validate(withText, req)).toBe(true);
  });

  it("does not mistake zero or false for empty", () => {
    expect(validate(0, req)).toBe(true);
    expect(validate(false, req)).toBe(true);
  });
});
