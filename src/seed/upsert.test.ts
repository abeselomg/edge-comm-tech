import { describe, expect, it } from "vitest";
import { decideWrite, makeResolver, seedMode, type SeedMode } from "./upsert";

describe("decideWrite", () => {
  it("creates a document that does not exist, in every mode", () => {
    expect(decideWrite(false, "fill")).toBe("create");
    expect(decideWrite(false, "force")).toBe("create");
    expect(decideWrite(false, "fresh")).toBe("create");
  });

  it("skips an existing document in the default fill mode", () => {
    // Review Focus #1: a re-run must not overwrite an editor's work.
    expect(decideWrite(true, "fill")).toBe("skip");
  });

  it("never updates or creates over an existing document unless asked", () => {
    // Guards the regression directly: fill must be the only mode that is safe,
    // and it must be a skip, not merely "not create".
    const result = decideWrite(true, "fill");
    expect(result).not.toBe("update");
    expect(result).not.toBe("create");
  });

  it("updates an existing document only when force is asked for", () => {
    expect(decideWrite(true, "force")).toBe("update");
  });

  it("creates in fresh mode, because fresh deletes everything first", () => {
    expect(decideWrite(true, "fresh")).toBe("create");
  });

  it("is a total, stable truth table", () => {
    const modes: SeedMode[] = ["fill", "force", "fresh"];
    const table = modes.flatMap((m) =>
      [false, true].map((e) => `${m}/${e}=${decideWrite(e, m)}`),
    );
    expect(table).toEqual([
      "fill/false=create",
      "fill/true=skip",
      "force/false=create",
      "force/true=update",
      "fresh/false=create",
      "fresh/true=create",
    ]);
  });
});

describe("makeResolver", () => {
  const resolve = makeResolver("client", [
    { key: "Bahir Dar University", id: 1 },
    { key: "Gadaa Bank", id: 2 },
    { key: "National Bank of Ethiopia", id: 3 },
  ]);

  it("resolves an exact name", () => {
    expect(resolve("Gadaa Bank")).toBe(2);
  });

  it("ignores surrounding whitespace and case", () => {
    expect(resolve("  gadaa bank ")).toBe(2);
    expect(resolve("GADAA BANK\n")).toBe(2);
  });

  it("ignores repeated inner whitespace", () => {
    expect(resolve("Gadaa    Bank")).toBe(2);
  });

  it("resolves an id of 0 instead of treating it as a miss", () => {
    const zero = makeResolver("client", [{ key: "A", id: 0 }]);
    expect(zero("A")).toBe(0);
  });

  it("throws on an unknown name rather than returning undefined", () => {
    // Review Focus #4: a silent undefined produces a project page with no
    // client and no error anywhere.
    expect(() => resolve("Bonga University")).toThrow(/client/i);
  });

  it("names the label, the failing key and how to fix it", () => {
    let message = "";
    try {
      resolve("Bonga University");
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toMatch(/No client matches "Bonga University"/);
    expect(message).toMatch(/directory/);
  });

  it("suggests the closest known name, to catch a typo", () => {
    // Asserting only /Gadaa Bank/ would pass even with the hint disabled,
    // because the fallback lists every known name and that list contains it.
    // Assert the hint's own wording, and that the fallback did NOT fire.
    expect(() => resolve("Gadaa Bnak")).toThrow(/Did you mean "Gadaa Bank"\?/);
    expect(() => resolve("Gadaa Bnak")).not.toThrow(/Known clients:/);
  });

  it("lists the known names when nothing is close", () => {
    try {
      resolve("Something Entirely Different");
      throw new Error("should have thrown");
    } catch (error) {
      expect(String(error)).toContain("Bahir Dar University");
      expect(String(error)).toContain("Something Entirely Different");
    }
  });

  it("rejects an empty key", () => {
    expect(() => resolve("")).toThrow(/client/i);
    expect(() => resolve("   ")).toThrow(/client/i);
  });

  it("rejects an undefined key, as unvalidated Highland content could pass", () => {
    expect(() => resolve(undefined as unknown as string)).toThrow(/client/i);
  });

  it("does not let an empty key match an entry that also normalises to empty", () => {
    expect(() => makeResolver("client", [{ key: "  ", id: 9 }])).toThrow(
      /empty name/,
    );
  });

  it("throws, naming the key, on an empty entries array", () => {
    const none = makeResolver("client", []);
    expect(() => none("Gadaa Bank")).toThrow(/Gadaa Bank/);
    expect(() => none("Gadaa Bank")).toThrow(/no client/i);
    expect(() => none("")).toThrow(/client/i);
  });

  it("refuses duplicate keys instead of letting the later one win silently", () => {
    expect(() =>
      makeResolver("client", [
        { key: "Gadaa Bank", id: 1 },
        { key: " gadaa bank", id: 2 },
      ]),
    ).toThrow(/two clients are named/);
  });

  it("uses the label it was given in every message", () => {
    const partners = makeResolver("partner", [{ key: "Acme", id: 1 }]);
    expect(() => partners("Zed")).toThrow(/No partner matches "Zed"/);
  });
});

/*
 * The lookup tests whether the key is present, not whether its id is usable.
 * An entry registered with no id would therefore "resolve" and hand back
 * undefined, writing a dangling relationship with nothing thrown — the exact
 * fault this resolver exists to prevent. The seed builds entries as
 * `{ key: name, id: created.id }`, so a create that returns no id is how this
 * arrives in practice.
 */
describe("makeResolver rejects an unusable id at construction", () => {
  it("throws when an entry has an undefined id", () => {
    expect(() =>
      makeResolver("client", [
        { key: "Gadaa Bank", id: undefined as unknown as number },
      ]),
    ).toThrow(/registered with no id/);
  });

  it("throws when an entry has a null id", () => {
    expect(() =>
      makeResolver("client", [
        { key: "Gadaa Bank", id: null as unknown as number },
      ]),
    ).toThrow(/registered with no id/);
  });

  it("names the entry and points at the step that failed", () => {
    let message = "";
    try {
      makeResolver("partner", [
        { key: "Cisco", id: undefined as unknown as number },
      ]);
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toMatch(/"Cisco"/);
    expect(message).toMatch(/partner step/);
  });

  it("still accepts an id of 0, which is falsy but valid", () => {
    const resolve = makeResolver("client", [{ key: "Gadaa Bank", id: 0 }]);
    expect(resolve("Gadaa Bank")).toBe(0);
  });

  it("still accepts an empty-string id", () => {
    const resolve = makeResolver("client", [{ key: "Gadaa Bank", id: "" }]);
    expect(resolve("Gadaa Bank")).toBe("");
  });
});

describe("the seed mode", () => {
  it("defaults to fill when unset", () => {
    expect(seedMode(undefined)).toBe("fill");
    expect(seedMode("")).toBe("fill");
  });

  it("reads the three modes", () => {
    expect(seedMode("fill")).toBe("fill");
    expect(seedMode("force")).toBe("force");
    expect(seedMode("fresh")).toBe("fresh");
  });

  /*
   * This used to be read from process.argv, and `payload run` strips the
   * script's arguments entirely -- so seed:force and seed:fresh both ran fill
   * and said so, and the modes were unreachable rather than wrong. Nothing in
   * a test can stop someone moving it back to argv, but a typo defaulting
   * quietly to fill is the same silent failure in miniature, so it throws.
   */
  it("refuses an unrecognised mode rather than defaulting to fill", () => {
    expect(() => seedMode("frsh")).toThrow(/SEED_MODE="frsh" is not a mode/);
    expect(() => seedMode("FRESH")).toThrow(/not a mode/);
    expect(() => seedMode("--fresh")).toThrow(/not a mode/);
    expect(() => seedMode("true")).toThrow(/not a mode/);
  });
});
