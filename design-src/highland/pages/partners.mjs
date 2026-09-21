import { PARTNERS, AREAS } from "../content.mjs";

/*
 * Hub and spokes, after the reference the client pointed at: Edge at the
 * centre, the manufacturers on a ring, a line from the hub to each.
 *
 * Geometry is computed here rather than positioned by hand so the ring stays
 * even if a ninth partner is added. The SVG is a square 800x800 space; nodes
 * are placed as percentages of it so they scale with the container.
 */

const R = 300;
const CX = 400;
const CY = 400;

const ORBIT = PARTNERS.map((p, i) => {
  const a = (i / PARTNERS.length) * Math.PI * 2 - Math.PI / 2;
  return { ...p, x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
});

const count = (k) => PARTNERS.filter((p) => p.areas.includes(k)).length;
const label = (k) => AREAS.find(([key]) => key === k)[1];
const cls = (p) => p.areas.map((a) => `c-${a}`).join(" ");

/* Radio inputs plus sibling selectors — no script, so the page stays a
   standalone file. One rule set per category. */
const filterCss = `
${["all", ...AREAS.map(([k]) => k)]
  .map((k) => `#f-${k}:checked~.fbar label[for=f-${k}]`)
  .join(",")}{background:#0888c5;color:#fff;border-color:#0888c5}
${AREAS.map(
  ([k]) => `
#f-${k}:checked~.mesh .node:not(.c-${k}){opacity:.2}
#f-${k}:checked~.mlist li:not(.c-${k}){display:none}
#f-${k}:checked~.mesh .spoke:not(.c-${k}){opacity:.12}
#f-${k}:checked~.tally .t-${k}{display:block}`,
).join("")}
#f-all:checked~.tally .t-all{display:block}
.node,.spoke{transition:opacity .22s}
.tally span{display:none}
.node .areas{opacity:0;visibility:hidden;transition:opacity .15s}
.node:hover .areas,.node:focus-visible .areas{opacity:1;visibility:visible}
.node:hover{z-index:20}
`;

const spokes = ORBIT.map(
  (p, i) =>
    `<line class="spoke eg-draw ${cls(p)}" style="--len:${R};--d:${(i * 0.09).toFixed(2)}s"
      x1="${CX}" y1="${CY}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}"
      stroke="url(#spoke)" stroke-width="1.5" />`,
).join("\n          ");

const nodes = ORBIT.map(
  (p, i) => `
      <div class="node eg-pop absolute -translate-x-1/2 -translate-y-1/2"
           style="--d:${(0.5 + i * 0.07).toFixed(2)}s;left:${((p.x / 800) * 100).toFixed(2)}%;top:${((p.y / 800) * 100).toFixed(2)}%">
        <span tabindex="0" class="relative block cursor-default whitespace-nowrap rounded-full border border-rule bg-paper-2 px-4 py-2 text-sm font-semibold shadow-[0_8px_24px_-14px_rgb(8_136_197/0.7)] transition duration-200 hover:-translate-y-0.5 hover:border-gold hover:shadow-[0_14px_30px_-14px_rgb(8_136_197/0.8)]">
          ${p.name}
          <span class="areas absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-paper">
            ${p.areas.map(label).join(" · ")}
          </span>
        </span>
      </div>`,
).join("");

export default {
  title: "Partners — Edge COMM-TECH",
  desc: "The manufacturers Edge builds on, and what we deliver with each.",
  body: `  <main class="mx-auto max-w-6xl px-6 py-20">
    <style>${filterCss}</style>

    <p class="eg-rise font-mono text-[11px] uppercase tracking-[0.28em] text-gold">Partner network</p>
    <h1 class="eg-rise mt-3 max-w-3xl font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02]" style="--d:.06s">
      Certified on the platforms, <span class="text-gold">accountable for the outcome</span>
    </h1>
    <p class="eg-rise mt-5 max-w-2xl text-ink/75" style="--d:.14s">
      Being a partner is not a logo on a page. It means our engineers hold current
      certifications on what we sell, we escalate directly to the manufacturer rather than
      through a reseller, and we see firmware and end-of-support notices before you do.
    </p>
    <dl class="eg-rise mt-9 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-2xl bg-rule" style="--d:.22s">
      <div class="bg-paper-2 px-5 py-5"><dt class="font-display text-2xl text-gold">${PARTNERS.length}</dt>
        <dd class="mt-1 font-mono text-[9px] uppercase tracking-widest text-steel">Manufacturers</dd></div>
      <div class="bg-paper-2 px-5 py-5"><dt class="font-display text-2xl text-gold">${AREAS.length}</dt>
        <dd class="mt-1 font-mono text-[9px] uppercase tracking-widest text-steel">Capability areas</dd></div>
      <div class="bg-paper-2 px-5 py-5"><dt class="font-display text-2xl text-gold">1</dt>
        <dd class="mt-1 font-mono text-[9px] uppercase tracking-widest text-steel">Point of contact</dd></div>
    </dl>

    ${["all", ...AREAS.map(([k]) => k)]
      .map((k, i) => `<input class="sr-only" type="radio" name="area" id="f-${k}"${i === 0 ? " checked" : ""}>`)
      .join("\n    ")}

    <div class="fbar mt-10 flex flex-wrap gap-2">
      <label for="f-all" class="cursor-pointer rounded-full border border-rule bg-paper-2 px-4 py-2 text-sm">All <span class="font-mono text-[10px] text-steel">${PARTNERS.length}</span></label>
      ${AREAS.map(
        ([k, l]) =>
          `<label for="f-${k}" class="cursor-pointer rounded-full border border-rule bg-paper-2 px-4 py-2 text-sm">${l} <span class="font-mono text-[10px] text-steel">${count(k)}</span></label>`,
      ).join("\n      ")}
    </div>

    <p class="tally mt-5 min-h-[1.25rem] text-sm text-steel">
      <span class="t-all">Hover a manufacturer to see the areas we deliver with them.</span>
      ${AREAS.map(
        ([k, l]) =>
          `<span class="t-${k}"><b class="font-semibold text-ink">${count(k)} of ${PARTNERS.length}</b> supply ${l.toLowerCase()}.</span>`,
      ).join("\n      ")}
    </p>

    <ul class="mlist mt-10 divide-y divide-rule border-y border-rule md:hidden">
      ${PARTNERS.map(
        (p) => `<li class="${cls(p)} flex items-baseline justify-between gap-4 py-4">
        <span class="font-display text-lg">${p.name}</span>
        <span class="text-right font-mono text-[9px] uppercase tracking-widest text-steel">${p.areas.map(label).join("<br>")}</span>
      </li>`,
      ).join("")}
    </ul>

    <div class="mesh relative mx-auto mt-10 hidden aspect-square w-full max-w-3xl md:block">
      <svg class="absolute inset-0 h-full w-full" viewBox="0 0 800 800" fill="none" aria-hidden="true">
        <defs>
          <radialGradient id="spoke" gradientUnits="userSpaceOnUse" cx="${CX}" cy="${CY}" r="${R}">
            <stop offset="0" stop-color="#0888c5" stop-opacity=".85" />
            <stop offset="0.6" stop-color="#0888c5" stop-opacity=".4" />
            <stop offset="1" stop-color="#0888c5" stop-opacity=".12" />
          </radialGradient>
          <radialGradient id="hub" cx="38%" cy="32%" r="70%">
            <stop offset="0" stop-color="#2ba8de" />
            <stop offset="100%" stop-color="#056a9a" />
          </radialGradient>
        </defs>
        <circle class="eg-spin-slow" cx="${CX}" cy="${CY}" r="${R}" stroke="#0888c5" stroke-opacity=".16"
                stroke-dasharray="3 9" />
        <circle cx="${CX}" cy="${CY}" r="205" stroke="#0888c5" stroke-opacity=".10" />
        ${spokes}
        <circle class="eg-breathe" cx="${CX}" cy="${CY}" r="118" fill="url(#hub)" />
      </svg>

      <div class="absolute left-1/2 top-1/2 w-[30%] -translate-x-1/2 -translate-y-1/2 text-center text-paper">
        <p class="font-display text-lg leading-tight">EDGE<br />COMM-TECH</p>
        <p class="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-paper/80">Partner network</p>
      </div>
      ${nodes}
    </div>

    <section class="mt-20 grid gap-10 border-t border-rule pt-14 md:grid-cols-3">
      <div>
        <p class="font-mono text-[10px] uppercase tracking-widest text-gold">01</p>
        <h3 class="mt-2 font-display text-2xl">Specified against the requirement</h3>
        <p class="mt-3 text-sm text-ink/75">The platform is chosen because it fits the brief and the site, not because of where the margin sits.</p>
      </div>
      <div>
        <p class="font-mono text-[10px] uppercase tracking-widest text-gold">02</p>
        <h3 class="mt-2 font-display text-2xl">Certified on what we deploy</h3>
        <p class="mt-3 text-sm text-ink/75">The people specifying the design are the people who configure it.</p>
      </div>
      <div>
        <p class="font-mono text-[10px] uppercase tracking-widest text-gold">03</p>
        <h3 class="mt-2 font-display text-2xl">Supported after handover</h3>
        <p class="mt-3 text-sm text-ink/75">Partner status means direct escalation to the manufacturer and lifecycle visibility on firmware and end-of-support dates.</p>
      </div>
    </section>
  </main>`,
};
