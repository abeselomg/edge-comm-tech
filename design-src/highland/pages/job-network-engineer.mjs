import { JOBS, JOB_DETAIL as D } from "../content.mjs";

const j = JOBS.find((x) => x.slug === D.slug);

export default {
  title: `${j.title} — Edge COMM-TECH`,
  desc: D.summary,
  body: `  <main>
    <header class="border-b border-rule">
      <div class="mx-auto max-w-6xl px-6 py-14">
        <a href="career.html" class="font-mono text-[10px] uppercase tracking-widest text-gold">← All positions</a>
        <h1 class="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.0]">${j.title}</h1>
        <ul class="mt-5 flex flex-wrap gap-2">
          ${[j.team, j.type, `${j.positions} positions`, `Deadline: ${j.deadline}`]
            .map((t) => `<li class="rounded-full bg-paper-2 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-steel">${t}</li>`)
            .join("\n          ")}
        </ul>
      </div>
    </header>

    <div class="mx-auto grid max-w-6xl gap-14 px-6 py-16 lg:grid-cols-[1fr_20rem]">
      <article class="max-w-2xl">
        <h2 class="font-display text-2xl">Job summary</h2>
        <p class="mt-3 leading-relaxed text-ink/80">${D.summary}</p>

        <h2 class="mt-10 font-display text-2xl">Responsibilities</h2>
        <ul class="mt-3 space-y-2 text-sm text-ink/80">
          ${D.responsibilities.map((r) => `<li class="border-l-2 border-gold pl-4">${r}</li>`).join("\n          ")}
        </ul>

        <h2 class="mt-10 font-display text-2xl">Qualification and experience</h2>
        <ul class="mt-3 space-y-2 text-sm text-ink/80">
          ${D.qualifications.map((q) => `<li class="border-l-2 border-lamp pl-4">${q}</li>`).join("\n          ")}
        </ul>

        <h2 class="mt-10 font-display text-2xl">Location</h2>
        <p class="mt-3 text-sm text-ink/80">${D.location}</p>
      </article>

      <aside class="self-start rounded-3xl bg-paper-2 p-6 shadow-[0_20px_50px_-24px_rgb(8_136_197_/_0.45)] lg:sticky lg:top-32">
        <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Apply</p>
        <label class="mt-4 block">
          <span class="font-mono text-[10px] uppercase tracking-widest text-steel">Full name</span>
          <input class="mt-2 w-full rounded-xl border border-rule bg-paper px-4 py-2.5 text-sm" />
        </label>
        <label class="mt-4 block">
          <span class="font-mono text-[10px] uppercase tracking-widest text-steel">Email</span>
          <input type="email" class="mt-2 w-full rounded-xl border border-rule bg-paper px-4 py-2.5 text-sm" />
        </label>
        <label class="mt-4 block">
          <span class="font-mono text-[10px] uppercase tracking-widest text-steel">CV (PDF)</span>
          <span class="mt-2 flex items-center justify-center rounded-xl border border-dashed border-gold bg-paper px-4 py-6 text-xs text-steel">
            Drop a file or browse
          </span>
        </label>
        <button type="button" class="mt-6 w-full rounded-full bg-gold px-5 py-3 text-sm text-white">Submit application</button>
        <p class="mt-3 text-center text-[11px] text-steel">Design only — does not submit.</p>
      </aside>
    </div>
  </main>`,
};
