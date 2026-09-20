import { COURSES } from "../content.mjs";

export default {
  title: "Academy — Edge COMM-TECH",
  desc: "Training in the systems Edge designs and operates.",
  body: `  <main class="mx-auto max-w-6xl px-6 py-20">
    <p class="font-mono text-[11px] uppercase tracking-[0.28em] text-gold">Academy</p>
    <h1 class="mt-3 max-w-3xl font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02]">
      We teach what we build
    </h1>
    <p class="mt-5 max-w-2xl text-ink/75">
      ${COURSES.length} courses, each tied to a service Edge delivers. Taught by the engineers
      who do the work, not by a training department.
    </p>

    <ol class="relative mt-16 space-y-px pl-10">
      <span class="absolute left-[3px] top-2 h-[calc(100%-1rem)] w-px bg-[repeating-linear-gradient(180deg,#0888c5_0_6px,transparent_6px_12px)]" aria-hidden="true"></span>
      ${COURSES.map((c, i) => `
      <li class="relative">
        <span class="absolute left-[-2.5rem] top-7 h-2 w-2 rounded-full bg-gold ring-4 ring-paper"></span>
        <a href="${c.slug === "soc" ? "course-soc.html" : "#"}" class="block border-b border-rule py-6 hover:bg-paper-2">
          <p class="font-mono text-[10px] uppercase tracking-widest text-lamp">${String(i + 1).padStart(2, "0")} · ${c.service}</p>
          <h2 class="mt-2 font-display text-2xl">${c.title}</h2>
          <p class="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-steel">
            <span>${c.duration}</span><span>${c.level}</span><span>${c.lessons} lessons</span>
          </p>
        </a>
      </li>`).join("")}
    </ol>
  </main>`,
};
