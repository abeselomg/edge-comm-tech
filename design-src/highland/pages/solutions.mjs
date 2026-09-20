import { SERVICES } from "../content.mjs";

export default {
  title: "Solutions — Edge COMM-TECH",
  desc: "Nine services, delivered end to end.",
  body: `  <main class="mx-auto max-w-6xl px-6 py-20">
    <p class="font-mono text-[11px] uppercase tracking-[0.28em] text-gold">Solutions</p>
    <h1 class="mt-3 max-w-3xl font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02]">
      Nine services, delivered end to end
    </h1>

    <div class="mt-16 grid gap-12 md:grid-cols-[14rem_1fr]">
      <nav class="self-start md:sticky md:top-32" aria-label="Services">
        <ol class="space-y-1 border-l border-rule">
          ${SERVICES.map((s) => `<li><a href="#s${s.n}" class="block border-l-2 border-transparent py-1.5 pl-4 text-sm text-ink/70 hover:border-gold hover:text-gold"><span class="font-mono text-[10px] text-steel">${String(s.n).padStart(2, "0")}</span> ${s.title}</a></li>`).join("\n          ")}
        </ol>
      </nav>

      <div class="divide-y divide-rule">
        ${SERVICES.map((s) => `
        <article id="s${s.n}" class="scroll-mt-32 py-10 first:pt-0">
          <p class="font-mono text-[10px] uppercase tracking-widest text-lamp">Service ${String(s.n).padStart(2, "0")}</p>
          <h2 class="mt-2 font-display text-3xl">${s.title}</h2>
          <p class="mt-3 max-w-2xl text-ink/75">${s.blurb}</p>
          ${s.slug === "datacenter" ? '<a href="solution-datacenter.html" class="mt-4 inline-block text-sm text-gold">Read the full service page →</a>' : ""}
        </article>`).join("")}
      </div>
    </div>
  </main>`,
};
