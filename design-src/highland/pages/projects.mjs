import { PROJECTS } from "../content.mjs";

const SECTORS = [...new Set(PROJECTS.map((p) => p.sector))];
const key = (s) => s.toLowerCase().replace(/[^a-z]+/g, "-");

const filterCss = `
${["all", ...SECTORS.map(key)].map((k) => `#p-${k}:checked~.pbar label[for=p-${k}]`).join(",")}{background:#0888c5;color:#fff;border-color:#0888c5}
${SECTORS.map((s) => `#p-${key(s)}:checked~.reg li:not(.k-${key(s)}){display:none}`).join("\n")}
`;

export default {
  title: "Projects — Edge COMM-TECH",
  desc: "Work Edge has delivered for Ethiopian institutions.",
  body: `  <main class="mx-auto max-w-6xl px-6 py-20">
    <style>${filterCss}</style>

    <p class="font-mono text-[11px] uppercase tracking-[0.28em] text-gold">Projects</p>
    <h1 class="mt-3 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02]">
      Work delivered, by sector
    </h1>

    ${["all", ...SECTORS.map(key)]
      .map((k, i) => `<input class="sr-only" type="radio" name="sector" id="p-${k}"${i === 0 ? " checked" : ""}>`)
      .join("\n    ")}

    <div class="pbar mt-10 flex flex-wrap gap-2">
      <label for="p-all" class="cursor-pointer rounded-full border border-rule bg-paper-2 px-4 py-2 text-sm">All <span class="font-mono text-[10px] text-steel">${PROJECTS.length}</span></label>
      ${SECTORS.map((s) => `<label for="p-${key(s)}" class="cursor-pointer rounded-full border border-rule bg-paper-2 px-4 py-2 text-sm">${s} <span class="font-mono text-[10px] text-steel">${PROJECTS.filter((p) => p.sector === s).length}</span></label>`).join("\n      ")}
    </div>

    <ul class="reg mt-12 divide-y divide-rule border-y border-rule">
      ${PROJECTS.map((p) => `
      <li class="k-${key(p.sector)} group">
        <a href="${p.slug === "bonga" ? "project-bonga.html" : "#"}" class="grid gap-2 py-7 md:grid-cols-[1fr_14rem_5rem] md:items-baseline md:gap-8">
          <div>
            <h2 class="font-display text-2xl group-hover:text-gold">${p.scope}</h2>
            <p class="mt-1 text-sm text-steel">${p.client}</p>
            <p class="mt-2 hidden font-mono text-[10px] uppercase tracking-widest text-lamp group-hover:block">${p.tech.join(" · ")}</p>
          </div>
          <p class="font-mono text-[10px] uppercase tracking-widest text-steel">${p.sector}</p>
          <p class="font-mono text-sm text-steel md:text-right">${p.year}</p>
        </a>
      </li>`).join("")}
    </ul>

    <p class="mt-8 text-xs text-steel">
      Project count is <span class="ph">120</span> overall, for Edge to confirm. The five above are the
      institutions Edge names publicly.
    </p>
  </main>`,
};
