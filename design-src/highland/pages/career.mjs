import { JOBS } from "../content.mjs";

export default {
  title: "Career — Edge COMM-TECH",
  desc: "Work at an ICT systems integrator in Addis Ababa.",
  body: `  <main>
    <div class="mx-auto grid max-w-6xl gap-16 px-6 py-20 lg:grid-cols-[1fr_1fr]">
      <div>
        <p class="font-mono text-[11px] uppercase tracking-[0.28em] text-gold">Career</p>
        <h1 class="mt-3 font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02]">
          Be in the room when it is commissioned
        </h1>
        <div class="mt-8 max-w-md space-y-5 leading-relaxed text-ink/80">
          <p>
            Edge hires engineers who want to see a system through: survey it, design it,
            configure it, hand it over, and still be reachable when it needs changing.
          </p>
          <p>
            That is unusual. Most integrators split design from delivery from support, and
            the engineer who drew it never learns whether it worked. Here you find out.
          </p>
          <p>
            We are <span class="ph">40</span> people across four disciplines, working with
            institutions that cannot afford to be offline.
          </p>
        </div>

        <div class="mt-12 rounded-3xl bg-paper-2 p-6">
          <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Internships</p>
          <h2 class="mt-2 font-display text-2xl">Graduate internships</h2>
          <p class="mt-3 text-sm text-ink/75">
            Placements for final-year and recently graduated engineers, working alongside the
            delivery teams on live installations. Applications open twice a year.
          </p>
          <a href="contact.html" class="mt-4 inline-block text-sm text-gold">Enquire about a placement →</a>
        </div>
      </div>

      <div class="lg:pt-24">
        <p class="font-mono text-[10px] uppercase tracking-widest text-steel">
          ${JOBS.reduce((n, j) => n + j.positions, 0)} positions open
        </p>
        <ul class="mt-4 divide-y divide-rule border-y border-rule">
          ${JOBS.map((j) => `
          <li>
            <a href="${j.slug === "network-engineer" ? "job-network-engineer.html" : "#"}" class="group flex items-baseline justify-between gap-6 py-6">
              <span>
                <span class="block font-display text-xl group-hover:text-gold">${j.title}</span>
                <span class="mt-1 block font-mono text-[10px] uppercase tracking-widest text-steel">${j.team} · ${j.type}</span>
              </span>
              <span class="shrink-0 rounded-full bg-paper-2 px-3 py-1 font-mono text-[10px] text-steel">${j.positions}</span>
            </a>
          </li>`).join("")}
        </ul>
      </div>
    </div>
  </main>`,
};
