import { COURSES, COURSE_DETAIL as D } from "../content.mjs";

const c = COURSES.find((x) => x.slug === D.slug);

export default {
  title: `${c.title} — Edge COMM-TECH Academy`,
  desc: D.summary,
  body: `  <main>
    <header class="border-b border-rule bg-paper-2">
      <div class="mx-auto max-w-6xl px-6 py-14">
        <p class="font-mono text-[10px] uppercase tracking-widest text-steel">Academy · ${c.service}</p>
        <h1 class="mt-3 max-w-3xl font-display text-[clamp(1.9rem,4.5vw,3.25rem)] leading-[1.03]">${c.title}</h1>
        <p class="mt-4 flex flex-wrap gap-x-6 font-mono text-[10px] uppercase tracking-widest text-steel">
          <span>${c.duration}</span><span>${c.level}</span><span>${c.lessons} lessons</span>
        </p>
      </div>
    </header>

    <div class="mx-auto grid max-w-6xl gap-14 px-6 py-16 lg:grid-cols-[1fr_20rem]">
      <article>
        <p class="max-w-2xl text-lg leading-relaxed">${D.summary}</p>

        <h2 class="mt-12 font-display text-2xl">What you will be able to do</h2>
        <ul class="mt-4 space-y-2 text-sm text-ink/80">
          ${D.outcomes.map((o) => `<li class="border-l-2 border-lamp pl-4">${o}</li>`).join("\n          ")}
        </ul>

        <h2 class="mt-12 font-display text-2xl">Curriculum</h2>
        <div class="mt-4 divide-y divide-rule border-y border-rule">
          ${D.modules.map((m, i) => `
          <details class="py-4"${i === 0 ? " open" : ""}>
            <summary class="cursor-pointer font-display text-lg">
              <span class="font-mono text-[10px] text-steel">M${i + 1}</span> ${m.title}
            </summary>
            <ol class="mt-3 space-y-1.5 pl-8 text-sm text-ink/75">
              ${m.lessons.map((l) => `<li class="list-decimal">${l}</li>`).join("\n              ")}
            </ol>
          </details>`).join("")}
        </div>
      </article>

      <aside class="self-start rounded-3xl bg-ink p-6 text-paper lg:sticky lg:top-32">
        <p class="font-mono text-[10px] uppercase tracking-widest text-lamp">Register interest</p>
        <p class="mt-3 text-sm text-paper/75">Cohort dates are set once a group forms.</p>
        <label class="mt-5 block">
          <span class="font-mono text-[10px] uppercase tracking-widest text-paper/60">Full name</span>
          <input class="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-paper" />
        </label>
        <label class="mt-4 block">
          <span class="font-mono text-[10px] uppercase tracking-widest text-paper/60">Email</span>
          <input type="email" class="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-paper" />
        </label>
        <button type="button" class="mt-6 w-full rounded-full bg-lamp px-5 py-3 text-sm font-semibold text-ink">Register</button>
        <p class="mt-3 text-center text-[11px] text-paper/50">Design only — does not submit.</p>
      </aside>
    </div>
  </main>`,
};
