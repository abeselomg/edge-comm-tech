import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { PARTNER_CATEGORIES, PARTNERS } from "../../../../design-src/highland/content.mjs";
import PartnersPage from "./page";
import * as parts from "./partner-parts";
import { brandCard, byCategory, filterCss } from "./partner-parts";
import { bySector } from "../clients/client-parts";

const here = path.dirname(fileURLToPath(import.meta.url));

/*
 * The CMS shape, built from the approved content the way the seed builds it.
 * `ringLabel` is the short label the brand cards still show as a pill.
 */
const CATEGORIES = (PARTNER_CATEGORIES as [string, string, string][]).map(([key, label, description]) => ({
  key,
  label,
  ringLabel: `${label.split(" ")[0]} pill`,
  description,
  _status: "published",
}));
const byKey = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));
const LIST = (PARTNERS as { name: string; cats: string[]; cap: string }[]).map((p) => ({
  name: p.name,
  capability: p.cap,
  logo: null,
  categories: p.cats.map((k) => byKey[k]),
  projects: [],
  solution: null,
}));

vi.mock("@/lib/content", () => ({
  getPageCopy: async () => ({ partnersHero: { eyebrow: "Partners", title: "Partner network", intro: "Intro." } }),
  getPartners: async () => LIST,
  getPartnerCategories: async () => CATEGORIES,
}));

const NEW_INTRO =
  "Select a capability group in the list below to see the manufacturers and distributors Edge Comm-Tech works with in that area.";

const out = renderToStaticMarkup(await PartnersPage());

describe("the partners page", () => {
  const grid = out.slice(out.indexOf("Manufacturers and distributors"));

  it("says the new intro sentence, and no longer points at the ring", () => {
    expect(out).toContain(`<span class="l-all">${NEW_INTRO}</span>`);
    expect(out).not.toContain("on the ring");
  });

  it("keeps the eyebrow and headline for ten groups", () => {
    expect(out).toContain("How the network is organised");
    expect(out).toContain("Ten capability groups, one accountable integrator");
  });

  it("keeps the f-all and per-group radios and the Show all label", () => {
    expect(out).toMatch(/<input type="radio" id="f-all"[^>]*name="cat" checked=""/);
    for (const c of CATEGORIES) expect(out).toMatch(new RegExp(`<input type="radio" id="f-${c.key}"[^>]*name="cat"`));
    expect(out).toContain(`<label for="f-all"`);
    expect(out).toContain(`Show all ${LIST.length}`);
    for (const c of CATEGORIES) expect(out).toContain(`class="l-${c.key}"`);
  });

  it("lists every partner once in the brand grid", () => {
    expect(grid.match(/<li class="brand /g)).toHaveLength(LIST.length);
    for (const p of LIST) {
      expect(grid.split(`>${p.name}<`).length - 1, p.name).toBe(1);
    }
  });

  it("shows the turning rings, not the old category nodes", () => {
    expect(out).toContain('data-parity="partner-rings"');
    expect(out).not.toMatch(/class="[^"]*\b(node|pill|spoke)\b/);
    expect(out).not.toContain(" brands<");
  });
});

describe("the old ring diagram is gone", () => {
  it("partner-parts exports no orbit or RING", () => {
    expect(Object.keys(parts)).not.toContain("orbit");
    expect(Object.keys(parts)).not.toContain("RING");
    const src = readFileSync(path.join(here, "partner-parts.tsx"), "utf8");
    expect(src).not.toMatch(/\borbit\b|\bRING\b/);
  });
});

describe("filterCss", () => {
  const css = filterCss(["network", "power"]);

  it("still filters the brand cards and the lede for each group", () => {
    expect(css).toContain("#f-network:checked~.wrap .brand:not(.c-network){display:none}");
    expect(css).toContain("#f-network:checked~.wrap .lede .l-network{display:block}");
    expect(css).toContain("#f-power:checked~.wrap .brand:not(.c-power){display:none}");
    expect(css).toContain("#f-all:checked~.wrap .lede .l-all{display:block}");
    expect(css).toContain(".lede span{display:none}");
  });

  it("still highlights the checked filter's labels", () => {
    expect(css).toContain(
      "#f-all:checked~.wrap label[for=f-all],#f-network:checked~.wrap label[for=f-network],#f-power:checked~.wrap label[for=f-power]{background:#0888c5;color:#fff;border-color:#0888c5}",
    );
  });

  it("styles no node, pill or spoke", () => {
    expect(css).not.toMatch(/\.node|\.pill|\.spoke|\.s-/);
  });
});

describe("globals.css", () => {
  const css = readFileSync(path.join(here, "..", "globals.css"), "utf8");
  const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));

  it("turns the rings and cards off for reduced motion", () => {
    const open = reduced.indexOf("{") + 1;
    const first = reduced.slice(open, reduced.indexOf("{", open));
    expect(first).toContain(".eg-ring");
    expect(first).toContain(".eg-ring-card");
  });

  it("pauses the rings and cards on hover", () => {
    expect(css).toMatch(/\.eg-rings:hover \.eg-ring,\s*\.eg-rings:hover \.eg-ring-card\s*\{\s*animation-play-state: paused/);
  });

  /*
   * eg-spin animates the independent rotate property. A card centres itself
   * with translate and counter-turns with rotate; transform on the same rule
   * would be a third, separate thing to reason about, so none is used.
   */
  it("centres a card with translate and spins with eg-spin, never transform", () => {
    const rule = (sel: string) => {
      const at = css.indexOf(`${sel} {`);
      expect(at, sel).toBeGreaterThan(-1);
      return css.slice(at, css.indexOf("}", at));
    };
    const card = rule(".eg-ring-card");
    expect(card).toContain("translate: -50% -50%");
    expect(card).toContain("animation: eg-spin var(--spin) linear infinite var(--counter)");
    expect(card).not.toContain("transform:");
    const ring = rule(".eg-ring");
    expect(ring).toContain("animation: eg-spin var(--spin) linear infinite var(--dir)");
    expect(ring).not.toContain("transform:");
    expect(rule(".eg-rings")).toContain("container-type: inline-size");
  });
});

const cat = (key: string, status = "published") => ({ key, _status: status });
const CATS = [cat("network"), cat("security"), cat("power")];
const partner = (name: string, ...cats: ReturnType<typeof cat>[]) => ({ name, categories: cats });

describe("byCategory", () => {
  it("files a partner under every published category it carries", () => {
    const out = byCategory(
      [partner("A", cat("network"), cat("security")), partner("B", cat("power"))],
      CATS,
    );
    expect(out.network.map((p) => p.name)).toEqual(["A"]);
    expect(out.security.map((p) => p.name)).toEqual(["A"]);
    expect(out.power.map((p) => p.name)).toEqual(["B"]);
  });

  /*
   * Review Focus #2. Payload's depth populate does not re-apply the published
   * filter to related documents, so a partner can arrive carrying a category
   * that has since been unpublished. That category must not become a group.
   */
  it("does not create a group from an unpublished category", () => {
    expect(byCategory([partner("X", cat("network", "draft"))], CATS)).toEqual({});
  });

  it("ignores a bare id where a document was expected", () => {
    const p = { name: "Y", categories: [7 as never, cat("power")] };
    expect(Object.keys(byCategory([p], CATS))).toEqual(["power"]);
  });

  it("keeps the category list's order, not the partners'", () => {
    const out = byCategory([partner("A", cat("power")), partner("B", cat("network"))], CATS);
    expect(Object.keys(out)).toEqual(["network", "power"]);
  });
});

describe("bySector", () => {
  const c = (name: string, sector: string) => ({ name, sector }) as never;
  it("groups by the three approved sectors, in their approved order", () => {
    const out = bySector([c("a", "government"), c("b", "education"), c("c", "banking")]);
    expect(Object.keys(out)).toEqual(["education", "banking", "government"]);
  });
  it("omits a sector with no clients rather than printing an empty section", () => {
    expect(Object.keys(bySector([c("a", "banking")]))).toEqual(["banking"]);
  });
});

describe("brandCard", () => {
  const card = (solution: unknown) =>
    renderToStaticMarkup(
      <ul>
        {brandCard(
          {
            name: "Brand",
            capability: "Does things.",
            logo: null,
            categories: [],
            projects: [],
            solution,
          } as never,
          {},
        )}
      </ul>,
    );

  it("links the solution a brand belongs to when it is published", () => {
    const out = card({ slug: "cyber", short: "Cyber", title: "Cyber", accent: "#111111", _status: "published" });
    expect(out).toContain('href="/solutions/cyber"');
  });

  // Review Focus #2: the depth populate keeps an unpublished solution.
  it("does not link, or take the colour of, an unpublished solution", () => {
    const out = card({ slug: "cyber", short: "Cyber", title: "Cyber", accent: "#111111", _status: "draft" });
    expect(out).not.toContain("/solutions/cyber");
    expect(out).not.toContain("#111111");
    expect(out).toContain("Brand");
  });

  it("copes with a solution that arrived as a bare id", () => {
    expect(card(4)).not.toContain("/solutions/");
  });
});
