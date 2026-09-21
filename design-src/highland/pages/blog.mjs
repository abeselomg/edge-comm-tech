import { POSTS } from "../content.mjs";

/*
 * Editorial hierarchy, not a grid of equal cards: one lead at full width,
 * the rest as a dated list, categories and tags in a rail. A blog where
 * every post looks equally important tells the reader nothing.
 *
 * Categories are coloured by name rather than by index, so a new post never
 * reshuffles the palette.
 */

const [lead, ...rest] = POSTS;

const CAT = {
  Datacenter: "#c48a5a",
  Security: "#056a9a",
  Networks: "#0888c5",
};
const cat = (p) => CAT[p.category] ?? "#0888c5";

const CATEGORIES = [...new Set(POSTS.map((p) => p.category))];
const TAGS = [...new Set(POSTS.flatMap((p) => p.tags))];
const nice = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default {
  title: "Blog — Edge COMM-TECH",
  desc: "Notes from the engineers who build and run the infrastructure.",
  body: `  <main>
    <section class="relative overflow-hidden border-b border-rule bg-paper-2">
      <span class="pointer-events-none absolute -right-28 -top-36 h-[32rem] w-[32rem] rounded-full"
            style="background:radial-gradient(circle,#c48a5a1f,transparent 70%)" aria-hidden="true"></span>
      <div class="relative mx-auto max-w-6xl px-6 py-20">
        <p class="eg-rise font-mono text-[11px] uppercase tracking-[0.28em] text-gold">Blog</p>
        <h1 class="eg-rise mt-3 font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02]" style="--d:.08s">
          Notes <span class="text-gold">from the field</span>
        </h1>
        <p class="eg-rise mt-5 max-w-2xl text-ink/75" style="--d:.16s">
          Written by the engineers who do the work, about the decisions that actually
          bite on Ethiopian campuses and hospitals.
        </p>
      </div>
    </section>

    <div class="mx-auto grid max-w-6xl gap-14 px-6 py-16 lg:grid-cols-[1fr_15rem]">
      <div>
        <a href="blog-post.html"
           class="eg-rise group block overflow-hidden rounded-3xl bg-paper-2 shadow-[0_20px_46px_-32px_rgb(28_36_48/0.6)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-28px_rgb(8_136_197/0.5)]"
           style="--d:.24s">
          <span class="relative block h-44 overflow-hidden md:h-56"
                style="background:linear-gradient(130deg,${cat(lead)}2e,${cat(lead)}0d)" aria-hidden="true">
            <svg viewBox="0 0 800 220" class="absolute inset-0 h-full w-full" fill="none"
                 stroke="${cat(lead)}" stroke-opacity=".45" stroke-width="1.3">
              <circle cx="640" cy="110" r="52" />
              <circle cx="640" cy="110" r="92" stroke-opacity=".28" />
              <circle cx="640" cy="110" r="136" stroke-opacity=".16" />
              <path d="M0 62h800M0 158h800" stroke-opacity=".18" />
            </svg>
          </span>
          <span class="block p-8">
            <span class="inline-block rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-widest"
                  style="background:${cat(lead)}1a;color:${cat(lead)}">${lead.category}</span>
            <span class="ml-2 font-mono text-[10px] uppercase tracking-widest text-steel">${nice(lead.date)}</span>
            <span class="mt-3 block max-w-3xl font-display text-[clamp(1.6rem,3vw,2.5rem)] leading-[1.08] group-hover:text-gold">
              ${lead.title}
            </span>
            <span class="mt-3 block max-w-2xl text-lg leading-relaxed text-ink/75">${lead.standfirst}</span>
            <span class="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white"
                  style="background:${cat(lead)}">Read the piece &rarr;</span>
          </span>
        </a>

        <ul class="mt-4 space-y-3">
          ${rest
            .map(
              (p, i) => `
          <li class="eg-inview">
            <a href="#" class="group flex gap-5 rounded-2xl bg-paper-2 p-5 shadow-[0_16px_36px_-32px_rgb(28_36_48/0.6)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-26px_rgb(8_136_197/0.45)]">
              <span class="w-1 shrink-0 self-stretch rounded-full" style="background:${cat(p)}" aria-hidden="true"></span>
              <span class="min-w-0">
                <span class="inline-block rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest"
                      style="background:${cat(p)}1a;color:${cat(p)}">${p.category}</span>
                <span class="ml-2 font-mono text-[9px] uppercase tracking-widest text-steel">${nice(p.date)}</span>
                <span class="mt-2 block font-display text-xl leading-tight group-hover:text-gold">${p.title}</span>
                <span class="mt-1.5 block max-w-2xl text-sm text-ink/70">${p.standfirst}</span>
              </span>
            </a>
          </li>`,
            )
            .join("")}
        </ul>
      </div>

      <aside class="self-start lg:sticky lg:top-32">
        <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Categories</p>
        <ul class="mt-3 space-y-1.5">
          ${CATEGORIES.map(
            (c) => `<li><a href="#" class="flex items-center gap-2.5 rounded-lg py-1 pl-1 text-sm text-ink/70 hover:bg-paper-2 hover:text-ink">
            <span class="h-2 w-2 rounded-full" style="background:${CAT[c] ?? "#0888c5"}"></span>
            ${c} <span class="font-mono text-[10px] text-steel">${POSTS.filter((p) => p.category === c).length}</span></a></li>`,
          ).join("\n          ")}
        </ul>
        <p class="mt-8 font-mono text-[10px] uppercase tracking-widest text-gold">Tags</p>
        <ul class="mt-3 flex flex-wrap gap-2">
          ${TAGS.map(
            (t, i) =>
              `<li><a href="#" class="block rounded-full px-3 py-1 text-xs transition hover:-translate-y-0.5"
              style="background:${Object.values(CAT)[i % 3]}14;color:${Object.values(CAT)[i % 3]}">${t}</a></li>`,
          ).join("\n          ")}
        </ul>
      </aside>
    </div>
  </main>`,
};
