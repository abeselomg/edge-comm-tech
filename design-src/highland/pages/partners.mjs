import { PARTNERS, PARTNER_CATEGORIES, PROJECTS, SOLUTIONS, ACCENT } from "../content.mjs";
import { pageHead, sectionHead, closingCta, pending, mark, esc } from "../ui.mjs";

/*
 * Partner network.
 *
 * Two things changed from the earlier version of this page.
 *
 * First, the hub-and-spoke device now carries the ten capability categories
 * rather than the brands. The approved list runs to thirty-two names; thirty-
 * two labels on one ring is unreadable, while ten is exactly the scale the
 * device was good at. The ring is also the filter control -- each node is the
 * label for its radio -- so the diagram does real work instead of decorating.
 *
 * Second, all language about certification, authorization and partner tier is
 * gone. The content master forbids publishing partnership type, authorization
 * level or certification tier anywhere public, so no such claim appears here
 * and no field for one exists in the data.
 *
 * Filtering is hidden radio inputs plus sibling selectors -- no script, so
 * each page stays a standalone file.
 */

/* Ring labels only. The full category names are in PARTNER_CATEGORIES and are
   used everywhere there is room for them; these are the same categories set
   short enough to sit on a circle without colliding. */
const RING = {
  "software-ai": "Software & AI",
  network: "Network",
  "system-cloud": "Compute & Cloud",
  datacenter: "Datacenter",
  security: "Security",
  power: "Power",
  education: "Smart education",
  broadcast: "Broadcast",
  ev: "EV charging",
  distribution: "Distribution",
};

const KEYS = PARTNER_CATEGORIES.map(([k]) => k);
const count = (k) => PARTNERS.filter((p) => p.cats.includes(k)).length;
const catLabel = (k) => PARTNER_CATEGORIES.find(([key]) => key === k)[1];
const solShort = (slug) => SOLUTIONS.find((s) => s.slug === slug)?.short ?? slug;
const cls = (p) => p.cats.map((c) => `c-${c}`).join(" ");
const noArt = PARTNERS.filter((p) => !p.logo).length;

/* Ring geometry, computed so the spacing stays even if the category list
   changes. 820x820 user space; nodes placed as percentages so they scale.

   R is 262 rather than the 300 the circle would otherwise want. A node is
   8.5rem wide and centred on its point, so it reaches 68px past the ring. At
   the narrowest width where the two-column layout applies -- 1024, giving this
   column about 475px -- 300/820 is 36.6% of the box and the node half-width
   another 14.3%, which crosses the 50% edge and makes the page scroll
   sideways. 262 leaves 32% + 14.3%, comfortably inside. */
const CX = 410;
const CY = 410;
const R = 262;
const ORBIT = KEYS.map((k, i) => {
  const a = (i / KEYS.length) * Math.PI * 2 - Math.PI / 2;
  return { k, x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
});

const filterCss = `
${["all", ...KEYS].map((k) => `#f-${k}:checked~.wrap label[for=f-${k}]`).join(",")}{background:#0888c5;color:#fff;border-color:#0888c5}
${KEYS.map(
  (k) => `
#f-${k}:checked~.wrap .node:not(.c-${k}) .pill{opacity:.3}
#f-${k}:checked~.wrap .spoke:not(.s-${k}){opacity:.1}
#f-${k}:checked~.wrap .brand:not(.c-${k}){display:none}
#f-${k}:checked~.wrap .lede .l-${k}{display:block}`,
).join("")}
#f-all:checked~.wrap .lede .l-all{display:block}
.spoke,.pill{transition:opacity .22s}
.lede span{display:none}
`;

const spokes = ORBIT.map(
  (n, i) =>
    `<line class="spoke eg-draw s-${n.k}" style="--len:${R};--d:${(i * 0.08).toFixed(2)}s"
            x1="${CX}" y1="${CY}" x2="${n.x.toFixed(1)}" y2="${n.y.toFixed(1)}"
            stroke="url(#spoke)" stroke-width="1.5" />`,
).join("\n          ");

const nodes = ORBIT.map(
  (n, i) => `
        <div class="node ${`c-${n.k}`} eg-pop absolute -translate-x-1/2 -translate-y-1/2"
             style="--d:${(0.45 + i * 0.06).toFixed(2)}s;left:${((n.x / 820) * 100).toFixed(2)}%;top:${((n.y / 820) * 100).toFixed(2)}%">
          <label for="f-${n.k}" class="pill flex w-[8.5rem] cursor-pointer flex-col items-center gap-0.5 rounded-2xl border border-rule bg-paper-2 px-3 py-2.5 text-center shadow-[0_8px_24px_-16px_rgb(8_136_197/0.7)] transition hover:-translate-y-0.5 hover:border-gold">
            <span class="font-display text-[13px] leading-tight">${esc(RING[n.k])}</span>
            <span class="font-mono text-[9px] uppercase tracking-widest text-steel">${count(n.k)} brands</span>
          </label>
        </div>`,
).join("");

const brandCard = (p) => {
  const c = ACCENT[p.solution] ?? "#0888c5";
  const work = p.projects.map((s) => PROJECTS.find((x) => x.slug === s)).filter(Boolean);
  return `<li class="brand ${cls(p)} eg-inview flex flex-col rounded-2xl border border-rule bg-paper p-5 transition hover:border-gold">
            <div class="flex h-14 items-center justify-start">${mark(p, { h: "h-9" })}</div>
            <p class="mt-3 flex-1 text-[13px] leading-relaxed text-ink/70">${esc(p.cap)}</p>
            <div class="mt-4 flex flex-wrap gap-1.5 border-t border-rule pt-4">
              ${p.cats.map((k) => `<span class="rounded-full bg-paper-2 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-steel">${esc(RING[k])}</span>`).join("\n              ")}
            </div>
            <a href="solution-${p.solution}.html" class="mt-3 font-mono text-[9px] uppercase tracking-widest transition hover:brightness-90" style="color:${c}">
              ${esc(solShort(p.solution))} &rarr;
            </a>
            ${
              work.length
                ? `<ul class="mt-2 space-y-1">
              ${work.map((x) => `<li><a href="project-${x.slug}.html" class="text-[11px] text-steel underline decoration-rule underline-offset-2 hover:text-gold">${esc(x.client)}</a></li>`).join("\n              ")}
            </ul>`
                : ""
            }
          </li>`;
};

export default {
  title: "Technology Partners and Manufacturers — Edge Comm-Tech",
  desc: "Edge Comm-Tech works with global technology manufacturers and distributors across software, AI, networking, compute, cloud, datacenter, cybersecurity, power, broadcast and EV charging.",
  body: `  <main>
    <style>${filterCss}</style>
    ${pageHead({
      eyebrow: "Partner network",
      title: "Global technology, delivered and supported locally",
      intro: `Edge Comm-Tech works with more than 40 global vendors, original equipment manufacturers and distributors. Those relationships give our clients access to proven platforms, vendor-aligned implementation and a clear escalation path — with Edge Comm-Tech accountable for the delivered outcome.`,
      accent: "#0888c5",
      variant: "wash",
      ctas: `<div class="eg-rise mt-8 flex flex-wrap gap-3" style="--d:.24s">
          <a href="#network" class="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">Browse the network</a>
          <a href="contact.html" class="rounded-full border border-rule px-6 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold">Discuss a platform</a>
        </div>`,
    })}

    <!-- Radios first: every filterable region below is a later sibling. -->
    <div id="network" class="relative">
      <input type="radio" name="cat" id="f-all" class="sr-only" checked>
      ${KEYS.map((k) => `<input type="radio" name="cat" id="f-${k}" class="sr-only">`).join("\n      ")}

      <div class="wrap">
        <section class="mx-auto max-w-6xl px-6 py-16">
          <div class="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
            <div>
              ${sectionHead({
                eyebrow: "How the network is organised",
                title: "Ten capability groups, one accountable integrator",
              })}
              <p class="lede mt-5 max-w-xl text-sm leading-relaxed text-ink/70">
                <span class="l-all">Select a capability group — on the ring or in the list below — to see the manufacturers and distributors Edge Comm-Tech works with in that area.</span>
                ${PARTNER_CATEGORIES.map(([k, , desc]) => `<span class="l-${k}">${esc(desc)}</span>`).join("\n                ")}
              </p>
              <p class="mt-6">
                <label for="f-all" class="inline-block cursor-pointer rounded-full border border-rule px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition hover:border-gold hover:text-gold">Show all ${PARTNERS.length}</label>
              </p>
            </div>

            <!-- The mesh. Edge at the hub, the ten groups on the ring; each
                 node is its category's filter label.
                 Hidden below md: ten 8.5rem nodes on a ring that narrow is both
                 unreadable and 60px wider than the viewport. The filter bar
                 below does the same job on a phone, so nothing is lost. -->
            <div class="relative mx-auto hidden aspect-square w-full max-w-[34rem] md:block">
              <svg viewBox="0 0 820 820" class="absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="spoke" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#0888c5" stop-opacity=".55"/>
                    <stop offset="100%" stop-color="#0888c5" stop-opacity=".12"/>
                  </linearGradient>
                </defs>
                <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="#0888c5" stroke-opacity=".12" stroke-dasharray="3 7"/>
                ${spokes}
              </svg>
              <div class="eg-breathe absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <span class="grid h-28 w-28 place-items-center rounded-full border border-gold/30 bg-paper text-center shadow-[0_18px_44px_-24px_rgb(8_136_197/0.8)]">
                  <span class="font-display text-[13px] leading-tight">Edge<br>Comm-Tech</span>
                </span>
              </div>
              ${nodes}
            </div>
          </div>
        </section>

        <!-- Filter bar + brand grid -->
        <section class="border-t border-rule bg-paper-2/40">
          <div class="mx-auto max-w-6xl px-6 py-14">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Manufacturers and distributors</p>
              ${noArt ? pending(`${noArt} marks pending approved artwork`) : ""}
            </div>
            <div class="mt-6 flex flex-wrap gap-2">
              <label for="f-all" class="cursor-pointer rounded-full border border-rule px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest transition hover:border-gold">All ${PARTNERS.length}</label>
              ${KEYS.map((k) => `<label for="f-${k}" class="cursor-pointer rounded-full border border-rule px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest transition hover:border-gold">${esc(catLabel(k))} <span class="text-steel">${count(k)}</span></label>`).join("\n              ")}
            </div>
            <ul class="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              ${PARTNERS.map(brandCard).join("\n              ")}
            </ul>
          </div>
        </section>
      </div>
    </div>

    <!-- What a partnership means here, stated without tier claims -->
    <section class="border-t border-rule">
      <div class="mx-auto max-w-6xl px-6 py-20">
        ${sectionHead({
          eyebrow: "What this means for clients",
          title: "Why the manufacturer relationship matters",
        })}
        <div class="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          ${[
            ["Suitable technology", "Platforms selected against your requirements rather than whatever is easiest to source."],
            ["Vendor-aligned delivery", "Implementation that follows the manufacturer's own guidance, so support stays valid."],
            ["A clear escalation path", "Issues that need the manufacturer reach the manufacturer, with Edge Comm-Tech coordinating."],
            ["Lifecycle visibility", "Firmware, licensing, warranty and end-of-support changes tracked as part of support."],
          ]
            .map(
              ([t, b], i) => `<div class="eg-inview border-t border-rule pt-5">
            <span class="font-mono text-[10px] text-gold">${String(i + 1).padStart(2, "0")}</span>
            <h3 class="mt-1.5 font-display text-lg leading-snug">${t}</h3>
            <p class="mt-2 text-sm leading-relaxed text-ink/70">${b}</p>
          </div>`,
            )
            .join("\n          ")}
        </div>
        <p class="mt-10 max-w-3xl rounded-2xl bg-paper-2 px-6 py-5 text-xs leading-relaxed text-steel">
          Partner names and marks are shown to describe the technologies Edge Comm-Tech delivers and supports.
          Specific partnership types, authorization levels and certification tiers are confirmed directly with
          clients and tender committees rather than published, because they change over time and are governed by
          each manufacturer's own agreements.
        </p>
      </div>
    </section>

    ${closingCta({
      title: "Looking for a specific platform?",
      body: "Tell us which technology you are standardising on, or what you need it to do. We will tell you whether we deliver it and how we would support it.",
      primary: { href: "contact.html", label: "Ask about a platform" },
      secondary: { href: "solutions.html", label: "Explore solutions" },
    })}
  </main>`,
};
