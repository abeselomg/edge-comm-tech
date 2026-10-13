import { describe, expect, it } from "vitest";
import { decideWrite, makeResolver, type SeedMode } from "./upsert";

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
    const table = modes.flatMap((m) => [false, true].map((e) => `${m}/${e}=${decideWrite(e, m)}`));
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
    expect(() => resolve("Gadaa Bnak")).toThrow(/Gadaa Bank/);
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
    expect(() => makeResolver("client", [{ key: "  ", id: 9 }])).toThrow(/empty name/);
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
