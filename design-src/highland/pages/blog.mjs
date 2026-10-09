import { POSTS, BLOG_CATEGORIES } from "../editorial.mjs";
import { SOLUTIONS, ACCENT } from "../content.mjs";
import { pageHead, closingCta, esc } from "../ui.mjs";

/*
 * Insights.
 *
 * The content master is explicit that the ten launch articles are short by
 * design and that their Read More goes straight to the matching solution
 * page: "do not create thin article-detail pages containing the same short
 * copy solely to insert another click."
 *
 * So this page is the articles, not a list of links to them. Each one is
 * published in full, in a readable measure, with its Read More pointing at
 * the solution capability it introduces. There are no post detail pages and
 * none are generated.
 */

const catLabel = (k) => BLOG_CATEGORIES.find(([key]) => key === k)?.[1] ?? k;
const solTitle = (slug) => SOLUTIONS.find((s) => s.slug === slug)?.title ?? slug;

/* Only the categories that actually have an article, in article order, so the
   rail can never offer a jump to an empty section. */
const USED = [...new Set(POSTS.map((p) => p.cat))];

/* One post deliberately has no anchor: the power-technology page has no single
   capability that matches it, so the link goes to the top of that page rather
   than to a fragment that does not exist. */
const article = (p, i) => {
  const c = ACCENT[p.to] ?? "#0888c5";
  return `<article id="post-${p.slug}" class="scroll-mt-28 border-t border-rule py-14 first:border-t-0 first:pt-0">
          <p class="eg-inview font-mono text-[10px] uppercase tracking-widest" style="color:${c}">
            ${String(i + 1).padStart(2, "0")} &middot; ${esc(catLabel(p.cat))}
          </p>
          <h2 class="eg-inview mt-3 max-w-3xl font-display text-[clamp(1.5rem,3vw,2.3rem)] leading-tight">${esc(p.title)}</h2>
          <div class="mt-5 max-w-[42rem] space-y-4">
            ${p.paras.map((x) => `<p class="eg-inview leading-relaxed text-ink/80">${esc(x)}</p>`).join("\n            ")}
          </div>
          <a href="solution-${p.to}.html${p.anchor ? `#${p.anchor}` : ""}"
             class="eg-inview mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
             style="background:${c}">
            ${esc(p.label)} <span aria-hidden="true">&rarr;</span>
          </a>
          <p class="mt-3 font-mono text-[10px] uppercase tracking-widest text-steel">Goes to ${esc(solTitle(p.to))}</p>
        </article>`;
};

export default {
  title: "Insights on Technology, AI and Digital Transformation — Edge Comm-Tech",
  desc: "Practical perspectives from Edge Comm-Tech on enterprise AI, networks, cloud, datacenters, cybersecurity, power, broadcast and digital transformation in Ethiopia.",
  body: `  <main>
    ${pageHead({
      eyebrow: "Insights",
      title: "Practical thinking on the technology decisions in front of you",
      intro: "Short, useful notes from the work itself — what a technology actually requires, where it tends to go wrong, and what good looks like. Each piece links through to the solution it belongs to.",
      accent: "#2ba8de",
      variant: "rule",
    })}

    <div class="mx-auto grid max-w-6xl gap-14 px-6 py-16 lg:grid-cols-[14rem_1fr]">
      <!-- Topic rail. Anchors, not filters: ten articles are all published on
           this page, so jumping is the useful action. -->
      <aside class="self-start lg:sticky lg:top-32">
        <p class="font-mono text-[10px] uppercase tracking-widest text-steel">Topics</p>
        <ul class="mt-3 space-y-0.5">
          ${USED.map((k) => {
            const first = POSTS.find((p) => p.cat === k);
            const n = POSTS.filter((p) => p.cat === k).length;
            return `<li><a href="#post-${first.slug}" class="flex items-baseline justify-between gap-3 rounded-xl px-3 py-2 text-[13px] leading-snug text-ink/70 transition hover:bg-paper-2 hover:text-gold">
            <span>${esc(catLabel(k))}</span>
            ${n > 1 ? `<span class="shrink-0 font-mono text-[9px] text-steel">${n}</span>` : ""}
          </a></li>`;
          }).join("\n          ")}
        </ul>
        <a href="subscribe.html" class="mt-7 block rounded-2xl bg-paper-2 p-4 text-sm transition hover:text-gold">
          <span class="block font-display text-base">Get new insights</span>
          <span class="mt-1 block text-xs text-steel">Occasional updates, no noise.</span>
        </a>
      </aside>

      <div class="min-w-0">
        ${POSTS.map(article).join("\n        ")}
      </div>
    </div>

    ${closingCta({
      title: "Want to talk any of this through?",
      body: "If one of these notes describes a decision you are facing, our team is happy to go into the detail with you.",
      primary: { href: "contact.html", label: "Talk to our experts" },
      secondary: { href: "resources.html", label: "Browse all resources" },
      accent: "#2ba8de",
    })}
  </main>`,
};
