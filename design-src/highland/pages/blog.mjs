import { POSTS } from "../content.mjs";

const [lead, ...rest] = POSTS;
const CATEGORIES = [...new Set(POSTS.map((p) => p.category))];
const TAGS = [...new Set(POSTS.flatMap((p) => p.tags))];
const nice = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default {
  title: "Blog — Edge COMM-TECH",
  desc: "Notes from the engineers who build and run the infrastructure.",
  body: `  <main class="mx-auto max-w-6xl px-6 py-20">
    <p class="font-mono text-[11px] uppercase tracking-[0.28em] text-gold">Blog</p>
    <h1 class="mt-3 font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02]">Notes from the field</h1>

    <div class="mt-14 grid gap-14 lg:grid-cols-[1fr_15rem]">
      <div>
        <article class="border-b border-gold pb-10">
          <p class="font-mono text-[10px] uppercase tracking-widest text-lamp">${lead.category} · ${nice(lead.date)}</p>
          <h2 class="mt-3 max-w-3xl font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.06]">
            <a href="blog-post.html" class="hover:text-gold">${lead.title}</a>
          </h2>
          <p class="mt-4 max-w-2xl text-lg leading-relaxed text-ink/75">${lead.standfirst}</p>
          <a href="blog-post.html" class="mt-5 inline-block text-sm text-gold">Read →</a>
        </article>

        <ul class="divide-y divide-rule">
          ${rest.map((p) => `
          <li class="py-7">
            <p class="font-mono text-[10px] uppercase tracking-widest text-steel">${p.category} · ${nice(p.date)}</p>
            <h3 class="mt-2 font-display text-xl"><a href="#" class="hover:text-gold">${p.title}</a></h3>
            <p class="mt-2 max-w-2xl text-sm text-ink/70">${p.standfirst}</p>
          </li>`).join("")}
        </ul>
      </div>

      <aside class="self-start lg:sticky lg:top-32">
        <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Categories</p>
        <ul class="mt-3 space-y-1.5 text-sm">
          ${CATEGORIES.map((c) => `<li><a href="#" class="text-ink/70 hover:text-gold">${c} <span class="font-mono text-[10px] text-steel">${POSTS.filter((p) => p.category === c).length}</span></a></li>`).join("\n          ")}
        </ul>
        <p class="mt-8 font-mono text-[10px] uppercase tracking-widest text-gold">Tags</p>
        <ul class="mt-3 flex flex-wrap gap-2">
          ${TAGS.map((t) => `<li><a href="#" class="block rounded-full bg-paper-2 px-3 py-1 text-xs text-ink/70 hover:text-gold">${t}</a></li>`).join("\n          ")}
        </ul>
      </aside>
    </div>
  </main>`,
};
