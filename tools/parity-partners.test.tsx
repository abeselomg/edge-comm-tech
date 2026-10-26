import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PARTNERS } from "../design-src/highland/content.mjs";
import { PartnerRings } from "../src/app/(frontend)/partners/PartnerRings";
import { applyPageWaivers, copySentences } from "./parity-copy.mjs";

/*
 * The partners-page waiver: the hero diagram (Highland's ten category nodes,
 * the port's partner rings) is left out on both sides, and the one reworded
 * intro sentence is waived as that exact substitution. Proved on fixtures:
 * the review server does not have the new page yet, so check-parity.mjs
 * cannot be run against it for this.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HIGHLAND = readFileSync(path.join(root, "design-files/highland/partners.html"), "utf8");

const OLD_INTRO =
  "Select a capability group — on the ring or in the list below — to see the manufacturers and distributors Edge Comm-Tech works with in that area.";
const NEW_INTRO =
  "Select a capability group in the list below to see the manufacturers and distributors Edge Comm-Tech works with in that area.";
const DIAGRAM_OPEN = '<div class="relative mx-auto hidden aspect-square w-full max-w-[34rem] md:block">';

/** Highland's diagram block, through its matching close tag. */
function highlandDiagram(html: string) {
  const start = html.indexOf(DIAGRAM_OPEN);
  let depth = 0;
  const tag = /<div\b|<\/div>/g;
  tag.lastIndex = start;
  for (let m = tag.exec(html); m; m = tag.exec(html)) {
    depth += m[0] === "</div>" ? -1 : 1;
    if (depth === 0) return html.slice(start, m.index + m[0].length);
  }
  throw new Error("unbalanced");
}

const rings = renderToStaticMarkup(
  <PartnerRings
    partners={(PARTNERS as { name: string }[]).map((p, i) => ({
      name: p.name,
      logo: i % 3 ? null : { id: p.name, url: `/media/${i}.png`, approved: true },
    })) as never}
  />,
);

/** The port, as it should be: the new rings in place of the old diagram, and the new intro. */
const aligned = HIGHLAND.replace(highlandDiagram(HIGHLAND), rings).replace(OLD_INTRO, NEW_INTRO);

const same = (port: string, page: string, highland = HIGHLAND) =>
  JSON.stringify(copySentences(applyPageWaivers(port, page, "port"), page)) ===
  JSON.stringify(copySentences(applyPageWaivers(highland, page, "highland"), page));

describe("the partners-page parity waiver", () => {
  it("finds the fixtures it is meant to (so the tests below are not vacuous)", () => {
    expect(HIGHLAND).toContain(OLD_INTRO);
    expect(highlandDiagram(HIGHLAND)).toContain("4 brands");
    expect(rings).toContain('data-parity="partner-rings"');
    expect(aligned).not.toContain("brands</span>");
  });

  it("passes the aligned partners page", () => {
    expect(same(aligned, "partners")).toBe(true);
  });

  it("strips both diagrams and nothing else", () => {
    const h = applyPageWaivers(HIGHLAND, "partners", "highland");
    expect(h).not.toContain("4 brands");
    expect(h).toContain("Manufacturers and distributors");
    expect(h).toContain("Why the manufacturer relationship matters");
    const p = applyPageWaivers(aligned, "partners", "port");
    expect(p).not.toContain("partner-rings");
    expect(p).toContain("Show all 32");
    // Each side loses only its own diagram: the port keeps a stray Highland block.
    expect(applyPageWaivers(HIGHLAND, "partners", "port")).toContain("4 brands");
  });

  it("still fails a changed sentence elsewhere on the partners page", () => {
    const s = "Generators, UPS systems and resilient power for branches";
    expect(aligned).toContain(s);
    expect(same(aligned.replace(s, "Generators and resilient power for branches"), "partners")).toBe(false);
    const t = "Why the manufacturer relationship matters";
    expect(same(aligned.replace(`>${t}<`, ">Why the vendor matters<"), "partners")).toBe(false);
  });

  it("still fails a different intro wording: only the approved substitution is waived", () => {
    const other = aligned.replace(NEW_INTRO, NEW_INTRO.replace("in the list below", "on the page"));
    expect(same(other, "partners")).toBe(false);
    // Nor may the old sentence stay on the port side.
    expect(same(aligned.replace(NEW_INTRO, OLD_INTRO), "partners")).toBe(false);
  });

  it("still fails a diagram that grew text outside the stripped root", () => {
    const leak = aligned.replace(rings, `${rings}<p>Our certified gold partners are listed on the rings above.</p>`);
    expect(same(leak, "partners")).toBe(false);
  });

  it("does not apply to any other page", () => {
    expect(same(aligned, "clients")).toBe(false);
    expect(applyPageWaivers(aligned, "clients", "port")).toBe(aligned);
    expect(applyPageWaivers(HIGHLAND, "clients", "highland")).toBe(HIGHLAND);
    expect(applyPageWaivers(HIGHLAND, "index", "highland")).toBe(HIGHLAND);
  });

  it("leaves --self passing for every Highland page", () => {
    const out = execFileSync(
      process.execPath,
      ["--import", "tsx", "tools/check-parity.mjs", "--self", "--all"],
      { cwd: root, encoding: "utf8" },
    );
    expect(out).toMatch(/PASS — 51 page\(s\)/);
  }, 120_000);
});
