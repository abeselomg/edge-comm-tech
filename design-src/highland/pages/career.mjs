import { JOBS } from "../content.mjs";

/*
 * Asymmetric split: why work here on one side, the open roles on the other.
 * Neither column is a grid — that shape belongs to the homepage.
 *
 * Roles are coloured by team, keyed off the team name rather than the index,
 * so adding a role never reshuffles the palette.
 */

const TEAM = {
  Networks: { c: "#0888c5", mark: '<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="18" r="2.2"/><circle cx="19" cy="18" r="2.2"/><path d="M12 7.2v4.3m0 0L6.6 16m5.4-4.5L17.4 16"/>' },
  Cybersecurity: { c: "#056a9a", mark: '<path d="M12 3 5 6v6c0 4.2 3 7.4 7 9 4-1.6 7-4.8 7-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>' },
  Datacenter: { c: "#c48a5a", mark: '<rect x="4" y="3" width="16" height="6" rx="1.5"/><rect x="4" y="11" width="16" height="6" rx="1.5"/><path d="M7 6h.01M7 14h.01"/>' },
  Support: { c: "#2ba8de", mark: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8m-4-4v4"/>' },
};
const team = (j) => TEAM[j.team] ?? TEAM.Networks;
const openCount = JOBS.reduce((n, j) => n + j.positions, 0);

export default {
  title: "Career — Edge COMM-TECH",
  desc: "Work at an ICT systems integrator in Addis Ababa.",
  body: `  <main>
    <section class="relative overflow-hidden border-b border-rule bg-paper-2">
      <span class="pointer-events-none absolute -right-32 -top-44 h-[36rem] w-[36rem] rounded-full"
            style="background:radial-gradient(circle,#0888c524,transparent 70%)" aria-hidden="true"></span>
      <div class="relative mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-[1fr_1fr]">
        <div>
          <p class="eg-rise font-mono text-[11px] uppercase tracking-[0.28em] text-gold">Career</p>
          <h1 class="eg-rise mt-3 font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02]" style="--d:.08s">
            Be in the room <span class="text-gold">when it is commissioned</span>
          </h1>
          <div class="eg-rise mt-8 max-w-md space-y-5 leading-relaxed text-ink/80" style="--d:.16s">
            <p>
              Edge hires engineers who want to see a system through: survey it, design it,
              configure it, hand it over, and still be reachable when it needs changing.
            </p>
            <p>
              That is unusual. Most integrators split design from delivery from support, and
              the engineer who drew it never learns whether it worked. Here you find out.
            </p>
          </div>

          <dl class="eg-rise mt-10 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-2xl bg-rule" style="--d:.24s">
            <div class="bg-paper-2 px-5 py-5">
              <dt class="font-display text-3xl text-gold">${openCount}</dt>
              <dd class="mt-1 font-mono text-[9px] uppercase tracking-widest text-steel">Positions open</dd>
            </div>
            <div class="bg-paper-2 px-5 py-5">
              <dt class="font-display text-3xl text-gold">4</dt>
              <dd class="mt-1 font-mono text-[9px] uppercase tracking-widest text-steel">Disciplines</dd>
            </div>
            <div class="bg-paper-2 px-5 py-5">
              <dt class="font-display text-3xl text-gold"><span class="ph">40</span></dt>
              <dd class="mt-1 font-mono text-[9px] uppercase tracking-widest text-steel">People</dd>
            </div>
          </dl>
        </div>

        <div class="lg:pt-20">
          <p class="font-mono text-[10px] uppercase tracking-widest text-steel">Open positions</p>
          <ul class="mt-4 space-y-3">
            ${JOBS.map(
              (j, i) => `
            <li class="eg-rise" style="--d:${(0.2 + i * 0.08).toFixed(2)}s">
              <a href="${j.slug === "network-engineer" ? "job-network-engineer.html" : "#"}"
                 class="group flex items-center gap-4 rounded-2xl bg-paper-2 p-4 shadow-[0_16px_36px_-30px_rgb(28_36_48/0.6)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-26px_rgb(8_136_197/0.5)]">
                <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                      style="background:${team(j).c}16;color:${team(j).c}">
                  <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor"
                       stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${team(j).mark}</svg>
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block font-display text-lg leading-tight group-hover:text-gold">${j.title}</span>
                  <span class="mt-0.5 block font-mono text-[9px] uppercase tracking-widest" style="color:${team(j).c}">${j.team} &middot; ${j.type}</span>
                </span>
                <span class="shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px]"
                      style="background:${team(j).c}16;color:${team(j).c}">${j.positions}</span>
              </a>
            </li>`,
            ).join("")}
          </ul>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-16">
      <div class="eg-inview overflow-hidden rounded-3xl text-paper"
           style="background:linear-gradient(120deg,#056a9a,#0888c5 55%,#2ba8de)">
        <div class="grid gap-8 p-9 md:grid-cols-[1fr_auto] md:items-center md:p-12">
          <div>
            <p class="font-mono text-[10px] uppercase tracking-widest text-paper/70">Internships</p>
            <h2 class="mt-2 font-display text-3xl md:text-4xl">Graduate internships</h2>
            <p class="mt-3 max-w-xl text-paper/85">
              Placements for final-year and recently graduated engineers, working alongside
              the delivery teams on live installations. Applications open twice a year.
            </p>
          </div>
          <a href="contact.html"
             class="inline-flex shrink-0 items-center gap-2 rounded-full bg-paper px-6 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5">
            Enquire about a placement &rarr;
          </a>
        </div>
      </div>
    </section>
  </main>`,
};
