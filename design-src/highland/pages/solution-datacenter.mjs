import { SOLUTION_DETAIL as D, SERVICES } from "../content.mjs";

const svc = SERVICES.find((s) => s.slug === D.slug);

export default {
  title: `${svc.title} — Edge COMM-TECH`,
  desc: svc.blurb,
  body: `  <main>
    <header class="border-b border-gold bg-paper-2">
      <div class="mx-auto max-w-6xl px-6 py-16">
        <p class="font-mono text-[10px] uppercase tracking-widest text-steel">
          Service ${String(svc.n).padStart(2, "0")} &nbsp;·&nbsp; ${D.sectors.join(" · ")}
        </p>
        <h1 class="mt-3 font-display text-[clamp(2rem,5vw,4rem)] leading-[1.0]">${svc.title}</h1>
        <p class="mt-6 max-w-2xl text-lg text-ink/75">${svc.blurb}</p>
      </div>
    </header>

    <div class="mx-auto grid max-w-6xl gap-14 px-6 py-16 lg:grid-cols-[1fr_20rem]">
      <article>
        <p class="max-w-2xl text-lg leading-relaxed">${D.overview}</p>

        <h2 class="mt-12 font-display text-2xl">Scope of work</h2>
        <ul class="mt-4 space-y-2 text-sm text-ink/80">
          ${D.scope.map((x) => `<li class="border-l-2 border-gold pl-4">${x}</li>`).join("\n          ")}
        </ul>

        <h2 class="mt-12 font-display text-2xl">What you receive</h2>
        <ul class="mt-4 grid gap-2 text-sm text-ink/80 sm:grid-cols-2">
          ${D.deliverables.map((x) => `<li class="rounded-xl bg-paper-2 px-4 py-3">${x}</li>`).join("\n          ")}
        </ul>
      </article>

      <aside class="self-start lg:sticky lg:top-32">
        <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Capabilities</p>
        <dl class="mt-4 divide-y divide-rule border-y border-rule">
          ${D.capabilities.map((c) => `
          <div class="py-4">
            <dt class="font-display text-base">${c.acronym} <span class="font-sans text-xs font-normal text-steel">${c.expansion}</span></dt>
            <dd class="mt-1.5 text-xs leading-relaxed text-ink/70">${c.value}</dd>
          </div>`).join("")}
        </dl>

        <p class="mt-8 font-mono text-[10px] uppercase tracking-widest text-gold">Platforms used</p>
        <ul class="mt-3 flex flex-wrap gap-2">
          ${D.partners.map((p) => `<li class="rounded-full bg-paper-2 px-3 py-1.5 text-xs">${p}</li>`).join("\n          ")}
        </ul>

        <a href="contact.html" class="mt-8 block rounded-full bg-gold px-5 py-3 text-center text-sm text-white">Discuss a datacenter</a>
      </aside>
    </div>
  </main>`,
};
