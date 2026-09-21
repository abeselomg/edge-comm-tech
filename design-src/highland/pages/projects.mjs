import { PROJECTS } from "../content.mjs";

/*
 * Still a register — one project per full-width row — but each row now
 * carries a generated plate instead of reading as a table of text.
 *
 * The plates are drawn, not photographed: Edge has supplied no project
 * imagery, and a stock photo would be a lie about a real client's site. Each
 * is keyed off the project's own services, so the pattern differs per row
 * without anyone choosing it.
 */

const SECTORS = [...new Set(PROJECTS.map((p) => p.sector))];
const key = (s) => s.toLowerCase().replace(/[^a-z]+/g, "-");

const SECTOR_COLOUR = {
  "higher-education": "#0888c5",
  "public-health": "#c48a5a",
};
const colour = (p) => SECTOR_COLOUR[key(p.sector)] ?? "#0888c5";

/* A plate per project: concentric arcs over a tinted field, rotated by index
   so no two rows look alike. */
const plate = (p, i) => `
        <span class="relative block h-24 w-full overflow-hidden rounded-2xl md:h-20 md:w-36"
              style="background:linear-gradient(135deg,${colour(p)}1f,${colour(p)}08)" aria-hidden="true">
          <svg viewBox="0 0 160 90" class="absolute inset-0 h-full w-full" fill="none"
               stroke="${colour(p)}" stroke-opacity="0.55" stroke-width="1.2">
            <g transform="rotate(${i * 27} 80 45)">
              <circle cx="${28 + i * 18}" cy="45" r="16" />
              <circle cx="${28 + i * 18}" cy="45" r="30" stroke-opacity="0.3" />
              <path d="M0 ${20 + i * 9}h160M0 ${64 - i * 6}h160" stroke-opacity="0.22" />
            </g>
          </svg>
          <span class="absolute bottom-2 right-2.5 font-mono text-[9px] uppercase tracking-widest"
                style="color:${colour(p)}">${String(i + 1).padStart(2, "0")}</span>
        </span>`;

const filterCss = `
${["all", ...SECTORS.map(key)].map((k) => `#p-${k}:checked~.pbar label[for=p-${k}]`).join(",")}{background:#0888c5;color:#fff;border-color:#0888c5}
${SECTORS.map((s) => `#p-${key(s)}:checked~.reg li:not(.k-${key(s)}){display:none}`).join("\n")}
`;

export default {
  title: "Projects — Edge COMM-TECH",
  desc: "Work Edge has delivered for Ethiopian institutions.",
  body: `  <main>
    <section class="relative overflow-hidden border-b border-rule bg-paper-2">
      <span class="pointer-events-none absolute -left-32 -top-40 h-[34rem] w-[34rem] rounded-full"
            style="background:radial-gradient(circle,#0888c51f,transparent 70%)" aria-hidden="true"></span>
      <div class="relative mx-auto max-w-6xl px-6 py-20">
        <p class="font-mono text-[11px] uppercase tracking-[0.28em] text-gold">Projects</p>
        <h1 class="mt-3 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02]">
          Work delivered, <span class="text-gold">by sector</span>
        </h1>

        <dl class="mt-12 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-2xl bg-rule">
          <div class="bg-paper-2 px-5 py-6">
            <dt class="font-display text-3xl text-gold">${PROJECTS.length}</dt>
            <dd class="mt-1 font-mono text-[10px] uppercase tracking-widest text-steel">Named engagements</dd>
          </div>
          <div class="bg-paper-2 px-5 py-6">
            <dt class="font-display text-3xl text-gold">${SECTORS.length}</dt>
            <dd class="mt-1 font-mono text-[10px] uppercase tracking-widest text-steel">Sectors served</dd>
          </div>
          <div class="bg-paper-2 px-5 py-6">
            <dt class="font-display text-3xl text-gold"><span class="ph">120</span></dt>
            <dd class="mt-1 font-mono text-[10px] uppercase tracking-widest text-steel">Delivered overall</dd>
          </div>
        </dl>
      </div>
    </section>

    <div class="mx-auto max-w-6xl px-6 py-16">
      <style>${filterCss}</style>

      ${["all", ...SECTORS.map(key)]
        .map((k, i) => `<input class="sr-only" type="radio" name="sector" id="p-${k}"${i === 0 ? " checked" : ""}>`)
        .join("\n      ")}

      <div class="pbar flex flex-wrap gap-2">
        <label for="p-all" class="cursor-pointer rounded-full border border-rule bg-paper-2 px-4 py-2 text-sm">All <span class="font-mono text-[10px] text-steel">${PROJECTS.length}</span></label>
        ${SECTORS.map(
          (s) =>
            `<label for="p-${key(s)}" class="cursor-pointer rounded-full border border-rule bg-paper-2 px-4 py-2 text-sm">${s} <span class="font-mono text-[10px] text-steel">${PROJECTS.filter((p) => p.sector === s).length}</span></label>`,
        ).join("\n        ")}
      </div>

      <ul class="reg mt-10 space-y-3">
        ${PROJECTS.map(
          (p, i) => `
        <li class="k-${key(p.sector)}">
          <a href="${p.slug === "bonga" ? "project-bonga.html" : "#"}"
             class="group flex flex-col gap-5 rounded-3xl bg-paper-2 p-5 shadow-[0_18px_40px_-32px_rgb(28_36_48/0.55)] transition hover:shadow-[0_22px_50px_-28px_rgb(8_136_197/0.45)] md:flex-row md:items-center">
            ${plate(p, i)}
            <span class="min-w-0 flex-1">
              <span class="inline-block rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest"
                    style="background:${colour(p)}1a;color:${colour(p)}">${p.sector}</span>
              <span class="mt-2 block font-display text-2xl leading-tight group-hover:text-gold">${p.scope}</span>
              <span class="mt-1 block text-sm text-steel">${p.client}</span>
            </span>
            <span class="flex shrink-0 items-center gap-6">
              <span class="hidden flex-wrap justify-end gap-1.5 md:flex md:max-w-[12rem]">
                ${p.tech.map((t) => `<span class="rounded-full bg-paper px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-steel">${t}</span>`).join("\n                ")}
              </span>
              <span class="font-display text-xl text-steel">${p.year}</span>
            </span>
          </a>
        </li>`,
        ).join("")}
      </ul>

      <p class="mt-8 text-xs text-steel">
        The five above are the institutions Edge names publicly. Plates are drawn rather than
        photographed — Edge has supplied no project imagery.
      </p>
    </div>
  </main>`,
};
