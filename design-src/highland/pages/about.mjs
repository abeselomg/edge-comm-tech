import { CLIENTS, METHOD, DISCIPLINES, EXECUTIVES, PURPOSE, VALUES } from "../content.mjs";

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
    <section class="relative overflow-hidden border-b border-rule bg-paper-2">
      <!-- Concentric arcs, not the homepage's solid sun disk: the same warm light,
           a different instrument. Blue-black panels read as a different brand. -->
      <svg class="pointer-events-none absolute -right-40 -top-56 h-[44rem] w-[44rem] opacity-70"
           viewBox="0 0 400 400" fill="none" aria-hidden="true">
        <defs>
          <radialGradient id="ab-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#0888c5" stop-opacity="0.20" />
            <stop offset="60%" stop-color="#0888c5" stop-opacity="0.05" />
            <stop offset="100%" stop-color="#0888c5" stop-opacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="200" fill="url(#ab-glow)" />
        <circle cx="200" cy="200" r="70" stroke="#0888c5" stroke-opacity="0.35" />
        <circle cx="200" cy="200" r="110" stroke="#0888c5" stroke-opacity="0.26" />
        <circle cx="200" cy="200" r="152" stroke="#0888c5" stroke-opacity="0.18" />
        <circle cx="200" cy="200" r="196" stroke="#0888c5" stroke-opacity="0.12" />
        <circle cx="200" cy="200" r="7" fill="#c48a5a" />
      </svg>
      <span class="pointer-events-none absolute inset-x-0 top-[78%] h-px
                   bg-gradient-to-r from-transparent via-gold/50 to-transparent" aria-hidden="true"></span>

      <div class="relative mx-auto max-w-6xl px-6 py-28">
        <p class="eg-rise font-mono text-[11px] uppercase tracking-[0.28em] text-gold">The company</p>
        <h1 class="eg-rise mt-4 max-w-4xl font-display text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.0]" style="--d:.06s">
          An ICT systems integrator for the institutions that
          <span class="text-gold">cannot afford to be offline</span>
        </h1>
        <p class="eg-rise mt-8 max-w-2xl text-lg leading-relaxed text-ink/75" style="--d:.14s">
          Edge designs, builds and runs communication and IT infrastructure from an office in
          Bole, Addis Ababa. Universities, hospitals and enterprises across Ethiopia, delivered
          by certified engineers who stay with a system after it is commissioned.
        </p>
        <dl class="eg-rise mt-10 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl bg-rule sm:grid-cols-4" style="--d:.22s">
          <div class="bg-paper-2 px-5 py-5"><dt class="font-display text-2xl text-gold">9</dt>
            <dd class="mt-1 font-mono text-[9px] uppercase tracking-widest text-steel">Services</dd></div>
          <div class="bg-paper-2 px-5 py-5"><dt class="font-display text-2xl text-gold">8</dt>
            <dd class="mt-1 font-mono text-[9px] uppercase tracking-widest text-steel">Partners</dd></div>
          <div class="bg-paper-2 px-5 py-5"><dt class="font-display text-2xl text-gold">5</dt>
            <dd class="mt-1 font-mono text-[9px] uppercase tracking-widest text-steel">Named clients</dd></div>
          <div class="bg-paper-2 px-5 py-5"><dt class="font-display text-2xl text-gold"><span class="ph">40</span></dt>
            <dd class="mt-1 font-mono text-[9px] uppercase tracking-widest text-steel">People</dd></div>
        </dl>
      </div>
    </section>

    <section class="border-b border-rule">
      <div class="mx-auto max-w-6xl px-6 py-20">
        <div class="grid gap-5 md:grid-cols-2">
          <div class="eg-inview overflow-hidden rounded-3xl p-8 text-paper"
               style="background:linear-gradient(135deg,#056a9a,#0888c5 70%)">
            <p class="font-mono text-[10px] uppercase tracking-widest text-paper/70">Mission</p>
            <p class="mt-4 font-display text-[clamp(1.15rem,1.9vw,1.6rem)] leading-snug">${PURPOSE.mission}</p>
          </div>
          <div class="eg-inview overflow-hidden rounded-3xl border border-rule bg-paper-2 p-8">
            <p class="font-mono text-[10px] uppercase tracking-widest text-lamp">Vision</p>
            <p class="mt-4 font-display text-[clamp(1.15rem,1.9vw,1.6rem)] leading-snug">${PURPOSE.vision}</p>
          </div>
        </div>

        <p class="mt-16 font-mono text-[11px] uppercase tracking-[0.28em] text-gold">Core values</p>
        <h2 class="mt-2 font-display text-3xl md:text-4xl">What we hold to</h2>
        <ol class="mt-8 grid gap-4 md:grid-cols-2">
          ${VALUES.map(
            (v, i) => `<li class="eg-inview rounded-2xl bg-paper-2 p-6 shadow-[0_16px_36px_-32px_rgb(28_36_48/0.6)]">
            <p class="font-mono text-[10px] uppercase tracking-widest text-gold">0${i + 1}</p>
            <h3 class="mt-2 font-display text-xl">${v.title}</h3>
            <p class="mt-2 text-sm leading-relaxed text-ink/75">${v.body}</p>
          </li>`,
          ).join("")}
        </ol>
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
        <h2 class="mt-2 max-w-3xl font-display text-4xl md:text-5xl">Where an outage stops teaching or treatment</h2>
        <p class="mt-5 max-w-2xl text-ink/75">
          Higher education and public health are Edge's proven base: campuses where four hundred
          devices associate in ninety seconds, and hospitals where the network is clinical
          infrastructure. The same standards carry into enterprise and industrial sites.
        </p>

        <div class="mt-10 grid gap-3 sm:grid-cols-3">
          ${[
            ["Higher education", "Campus networks, datacenter rooms, structured cabling and access control across university estates.", "#0888c5"],
            ["Public health", "Hospitals where surveillance, telephony and the network are treated as clinical infrastructure.", "#c48a5a"],
            ["Enterprise and industry", "Offices, factories and residential compounds where the network and physical security are one system.", "#056a9a"],
          ].map(
            ([t, b, c]) => `<div class="eg-inview rounded-2xl bg-paper-2 p-6">
            <span class="block h-1 w-10 rounded-full" style="background:${c}"></span>
            <h3 class="mt-4 font-display text-xl">${t}</h3>
            <p class="mt-2 text-sm leading-relaxed text-ink/75">${b}</p>
          </div>`,
          ).join("")}
        </div>

        <p class="mt-12 font-mono text-[10px] uppercase tracking-widest text-steel">Named publicly</p>
        <ul class="mt-4 flex flex-wrap gap-2">
          ${CLIENTS.map(
            (c) => `<li class="rounded-full border border-rule bg-paper-2 px-4 py-2 text-sm">${c}</li>`,
          ).join("")}
        </ul>
      </div>
    </section>
  </main>`,
};
