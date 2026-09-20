import { CLIENTS, METHOD, DISCIPLINES, EXECUTIVES } from "../content.mjs";

/* Stations alternate sides of the spine. On narrow screens the spine moves
   to the far left and every station sits to its right. */
const station = ({ title, body }, i) => `
      <li class="relative md:grid md:grid-cols-2 md:gap-12">
        <span class="absolute left-[-2.15rem] top-2 h-3 w-3 rounded-full bg-gold ring-4 ring-paper md:left-1/2 md:-translate-x-1/2"></span>
        <div class="${i % 2 ? "md:col-start-2" : "md:text-right"}">
          <p class="font-mono text-[10px] uppercase tracking-widest text-lamp">Station ${i + 1}</p>
          <h3 class="mt-2 font-display text-3xl">${title}</h3>
          <p class="mt-3 text-sm leading-relaxed text-ink/75 ${i % 2 ? "" : "md:ml-auto"} max-w-sm">${body}</p>
        </div>
      </li>`;

export default {
  title: "About — Edge COMM-TECH",
  desc: "The company behind the build: an ICT systems integrator in Addis Ababa.",
  body: `  <main>
    <section class="bg-ink text-paper">
      <div class="mx-auto max-w-6xl px-6 py-24">
        <p class="font-mono text-[11px] uppercase tracking-[0.28em] text-lamp">The company</p>
        <h1 class="mt-4 max-w-4xl font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.98]">
          Most failures happen at the seam between two suppliers
        </h1>
        <p class="mt-8 max-w-xl text-lg leading-relaxed text-paper/75">
          Edge stays with a system from the first assessment to the after-sales contract,
          so there is no seam to fail at.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-24">
      <p class="font-mono text-[11px] uppercase tracking-[0.28em] text-gold">How we work</p>
      <ol class="relative mt-14 space-y-20 pl-8 md:pl-0">
        <span class="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-gold to-transparent md:left-1/2"></span>
        ${METHOD.map(station).join("")}
      </ol>
    </section>

    <section class="border-t border-rule bg-paper-2">
      <div class="mx-auto max-w-6xl px-6 py-20">
        <p class="font-mono text-[11px] uppercase tracking-[0.28em] text-gold">Our people</p>
        <h2 class="mt-2 font-display text-4xl md:text-5xl">Certified engineers, not resellers</h2>
        <p class="mt-5 max-w-2xl text-ink/75">
          Four disciplines, working on the same estate. Headcount is
          <span class="ph">40</span>, for Edge to confirm.
        </p>
        <dl class="mt-12 divide-y divide-rule border-y border-rule">
          ${DISCIPLINES.map(({ title, body }) => `
          <div class="grid gap-2 py-6 md:grid-cols-[16rem_1fr] md:gap-10">
            <dt class="font-display text-xl">${title}</dt>
            <dd class="text-sm leading-relaxed text-ink/75">${body}</dd>
          </div>`).join("")}
        </dl>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-20">
      <p class="font-mono text-[11px] uppercase tracking-[0.28em] text-gold">Executive management</p>
      <h2 class="mt-2 font-display text-4xl">Who runs Edge</h2>
      <ul class="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        ${EXECUTIVES.map(({ name, role }) => `
        <li>
          <div class="aspect-[4/5] rounded-2xl border border-rule bg-paper-2"></div>
          <p class="mt-4 font-display text-lg">${name}</p>
          <p class="font-mono text-[10px] uppercase tracking-widest text-steel">${role}</p>
        </li>`).join("")}
      </ul>
    </section>

    <section id="clients" class="border-t border-rule">
      <div class="mx-auto max-w-6xl px-6 py-20">
        <p class="font-mono text-[11px] uppercase tracking-[0.28em] text-gold">Who we serve</p>
        <h2 class="mt-2 max-w-3xl font-display text-4xl md:text-5xl">Institutions that cannot afford to be offline</h2>
        <ul class="mt-10 divide-y divide-rule border-y border-rule text-lg">
          ${CLIENTS.map((c) => `<li class="py-5 font-display">${c}</li>`).join("")}
        </ul>
      </div>
    </section>
  </main>`,
};
