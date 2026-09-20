import { PROJECTS, PROJECT_DETAIL as D } from "../content.mjs";

const p = PROJECTS.find((x) => x.slug === D.slug);

const fact = (k, v) => `
        <div class="border-t border-rule py-4">
          <dt class="font-mono text-[10px] uppercase tracking-widest text-steel">${k}</dt>
          <dd class="mt-1.5 text-sm">${v}</dd>
        </div>`;

export default {
  title: `${p.client} — Edge COMM-TECH`,
  desc: `${p.scope} for ${p.client}.`,
  body: `  <main>
    <section class="relative flex min-h-[22rem] items-end bg-ink text-paper">
      <div class="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgb(255_255_255_/_0.04)_0_2px,transparent_2px_14px)]" aria-hidden="true"></div>
      <div class="relative mx-auto w-full max-w-6xl px-6 py-14">
        <p class="font-mono text-[11px] uppercase tracking-[0.28em] text-lamp">${p.sector} · ${p.year}</p>
        <h1 class="mt-3 max-w-3xl font-display text-[clamp(2rem,5vw,3.75rem)] leading-[1.0]">${p.client}</h1>
        <p class="mt-4 text-lg text-paper/75">${p.scope}</p>
      </div>
    </section>

    <div class="mx-auto grid max-w-6xl gap-14 px-6 py-16 lg:grid-cols-[18rem_1fr]">
      <dl class="self-start lg:sticky lg:top-32">
        ${fact("Client", p.client)}
        ${fact("Sector", p.sector)}
        ${fact("Year", p.year)}
        ${fact("Scope", p.scope)}
        ${fact("Technologies", p.tech.join(", "))}
      </dl>

      <article class="max-w-2xl space-y-10">
        <div>
          <h2 class="font-display text-2xl">What was there before</h2>
          <p class="mt-3 leading-relaxed text-ink/80">${D.before}</p>
        </div>
        <div>
          <h2 class="font-display text-2xl">What was built</h2>
          <p class="mt-3 leading-relaxed text-ink/80">${D.built}</p>
        </div>
        <div>
          <h2 class="font-display text-2xl">What it changed</h2>
          <p class="mt-3 leading-relaxed text-ink/80">${D.changed}</p>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="aspect-[4/3] rounded-2xl border border-rule bg-paper-2"></div>
          <div class="aspect-[4/3] rounded-2xl border border-rule bg-paper-2"></div>
        </div>
      </article>
    </div>
  </main>`,
};
