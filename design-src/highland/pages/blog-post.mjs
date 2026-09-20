import { POSTS, POST_DETAIL as D } from "../content.mjs";

const p = POSTS.find((x) => x.slug === D.slug);
const nice = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default {
  title: `${p.title} — Edge COMM-TECH`,
  desc: p.standfirst,
  body: `  <main>
    <article class="mx-auto max-w-2xl px-6 py-20">
      <a href="blog.html" class="font-mono text-[10px] uppercase tracking-widest text-gold">← Blog</a>
      <p class="mt-6 font-mono text-[10px] uppercase tracking-widest text-steel">${p.category} · ${nice(p.date)} · ${D.author}</p>
      <h1 class="mt-3 font-display text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.05]">${p.title}</h1>
      <p class="mt-6 text-xl leading-relaxed text-ink/75">${p.standfirst}</p>

      <div class="mt-10 space-y-6 leading-[1.75] text-ink/85">
        ${D.paras.slice(0, 2).map((t) => `<p>${t}</p>`).join("\n        ")}
      </div>

      <blockquote class="my-10 border-l-4 border-lamp pl-6 font-display text-2xl leading-snug">
        ${D.pull}
      </blockquote>

      <div class="space-y-6 leading-[1.75] text-ink/85">
        ${D.paras.slice(2).map((t) => `<p>${t}</p>`).join("\n        ")}
      </div>

      <ul class="mt-12 flex flex-wrap gap-2 border-t border-rule pt-8">
        ${p.tags.map((t) => `<li class="rounded-full bg-paper-2 px-3 py-1 text-xs text-steel">${t}</li>`).join("\n        ")}
      </ul>
    </article>

    <section class="border-t border-rule bg-paper-2">
      <div class="mx-auto max-w-2xl px-6 py-14">
        <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Read next</p>
        <ul class="mt-4 divide-y divide-rule">
          ${POSTS.filter((x) => x.slug !== p.slug).slice(0, 2).map((x) => `
          <li class="py-4">
            <a href="#" class="font-display text-lg hover:text-gold">${x.title}</a>
            <p class="font-mono text-[10px] uppercase tracking-widest text-steel">${x.category}</p>
          </li>`).join("")}
        </ul>
      </div>
    </section>
  </main>`,
};
