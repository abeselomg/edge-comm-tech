import { SERVICES } from "../content.mjs";

/*
 * Index rail beside scrolling detail. The rail is the navigation; the colour
 * is what stops nine near-identical entries reading as a spreadsheet.
 *
 * Each service owns an accent and a mark. Both are keyed off the slug rather
 * than the index, so reordering SERVICES never reshuffles the colours.
 */

const ACCENT = {
  datacenter: "#0888c5",
  networks: "#2ba8de",
  cybersecurity: "#056a9a",
  "noc-soc": "#0b6fa8",
  "unified-comms": "#c48a5a",
  "voice-data-internet": "#2ba8de",
  "physical-security": "#056a9a",
  "it-support": "#0888c5",
  "professional-services": "#c48a5a",
};

/* Line art, drawn on currentColor so each inherits its service accent. */
const MARK = {
  datacenter: '<rect x="4" y="3" width="16" height="6" rx="1.5"/><rect x="4" y="11" width="16" height="6" rx="1.5"/><path d="M7 6h.01M7 14h.01M4 19v2M20 19v2"/>',
  networks: '<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="18" r="2.2"/><circle cx="19" cy="18" r="2.2"/><path d="M12 7.2v4.3m0 0L6.6 16m5.4-4.5L17.4 16"/>',
  cybersecurity: '<path d="M12 3 5 6v6c0 4.2 3 7.4 7 9 4-1.6 7-4.8 7-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  "noc-soc": '<path d="M3 12h3.5l2.2 6 4.2-13 2.3 8.5 1.6-1.5H21"/>',
  "unified-comms": '<path d="M5 4h4l2 5-2.4 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  "voice-data-internet": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>',
  "physical-security": '<path d="M3 8h11v8H3z"/><path d="m14 11 7-3v8l-7-3z"/><circle cx="7.5" cy="12" r="1.6"/>',
  "it-support": '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8m-4-4v4"/>',
  "professional-services": '<circle cx="12" cy="8" r="3.4"/><path d="M5 20a7 7 0 0 1 14 0"/>',
};

const tile = (s) => `<span class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl"
        style="background:${ACCENT[s.slug]}14;color:${ACCENT[s.slug]}">
        <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor"
             stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${MARK[s.slug]}</svg>
      </span>`;

export default {
  title: "Solutions — Edge COMM-TECH",
  desc: "Nine services, delivered end to end.",
  body: `  <main>
    <section class="relative overflow-hidden border-b border-rule bg-paper-2">
      <span class="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full"
            style="background:radial-gradient(circle,#0888c526,transparent 70%)" aria-hidden="true"></span>
      <div class="relative mx-auto max-w-6xl px-6 py-20">
        <p class="font-mono text-[11px] uppercase tracking-[0.28em] text-gold">Solutions</p>
        <h1 class="mt-3 max-w-3xl font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02]">
          Nine services, <span class="text-gold">delivered end to end</span>
        </h1>
        <p class="mt-5 max-w-2xl text-ink/75">
          Voice, data and internet integrated as one managed service — with the engineers
          who designed it still reachable afterwards.
        </p>
        <ul class="mt-10 flex flex-wrap gap-2">
          ${SERVICES.map(
            (s) =>
              `<li><a href="#s${s.n}" class="block rounded-full px-3.5 py-1.5 text-xs font-semibold"
              style="background:${ACCENT[s.slug]}14;color:${ACCENT[s.slug]}">${s.title}</a></li>`,
          ).join("\n          ")}
        </ul>
      </div>
    </section>

    <div class="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[14rem_1fr]">
      <nav class="self-start md:sticky md:top-32" aria-label="Services">
        <p class="font-mono text-[10px] uppercase tracking-widest text-steel">All nine</p>
        <ol class="mt-4 space-y-1">
          ${SERVICES.map(
            (s) => `<li><a href="#s${s.n}" class="group flex items-center gap-3 rounded-lg py-1.5 pl-2 pr-1 text-sm text-ink/70 hover:bg-paper hover:text-ink">
            <span class="h-2 w-2 shrink-0 rounded-full" style="background:${ACCENT[s.slug]}"></span>
            <span class="font-mono text-[10px] text-steel">${String(s.n).padStart(2, "0")}</span>
            ${s.title}</a></li>`,
          ).join("\n          ")}
        </ol>
      </nav>

      <div class="space-y-5">
        ${SERVICES.map(
          (s) => `
        <article id="s${s.n}" class="scroll-mt-32 overflow-hidden rounded-3xl bg-paper-2 shadow-[0_18px_40px_-30px_rgb(28_36_48_/_0.5)]">
          <span class="block h-1.5" style="background:linear-gradient(90deg,${ACCENT[s.slug]},${ACCENT[s.slug]}22)"></span>
          <div class="flex gap-5 p-7">
            ${tile(s)}
            <div>
              <p class="font-mono text-[10px] uppercase tracking-widest" style="color:${ACCENT[s.slug]}">Service ${String(s.n).padStart(2, "0")}</p>
              <h2 class="mt-1.5 font-display text-2xl">${s.title}</h2>
              <p class="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink/75">${s.blurb}</p>
              ${
                s.slug === "datacenter"
                  ? `<a href="solution-datacenter.html" class="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white" style="background:${ACCENT[s.slug]}">Read the full service page &rarr;</a>`
                  : ""
              }
            </div>
          </div>
        </article>`,
        ).join("")}
      </div>
    </div>
  </main>`,
};
