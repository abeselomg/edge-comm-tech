import { RESOURCE_SECTIONS, NEWS, EVENTS, DOWNLOADS, POSTS } from "../editorial.mjs";
import { pageHead, sectionHead, closingCta, pending, esc } from "../ui.mjs";

/*
 * Resource centre.
 *
 * Six sections, each with its own page. Rather than describe them and leave
 * the visitor to guess whether anything is behind the link, every card
 * reports what it actually holds right now -- a real count, or an honest
 * "publishing soon". Three of the six have no approved items yet and say so.
 */

/* What each section currently holds. Computed from the editorial data, so a
   card cannot advertise items that do not exist. */
const STOCK = {
  news: { n: NEWS.length, unit: "item" },
  events: { n: EVENTS.length, unit: "session" },
  downloads: { n: DOWNLOADS.length, unit: "document" },
  documentaries: { n: 0, unit: "video" },
  "press-releases": { n: 0, unit: "release" },
  coverage: { n: 0, unit: "mention" },
};

const upcoming = EVENTS.filter((e) => e.status !== "past");

const card = (s, i) => {
  const st = STOCK[s.slug] ?? { n: 0, unit: "item" };
  const wide = i < 2;
  return `<li class="${wide ? "sm:col-span-2" : ""}">
          <a href="${s.file}" class="eg-inview group flex h-full flex-col rounded-3xl border border-rule p-7 transition hover:-translate-y-1 hover:border-gold">
            <div class="flex items-start justify-between gap-4">
              <h3 class="font-display text-[clamp(1.2rem,2vw,1.6rem)] leading-snug group-hover:text-gold">${esc(s.title)}</h3>
              <span class="shrink-0 font-mono text-[10px] uppercase tracking-widest ${st.n ? "text-gold" : "text-steel"}">
                ${st.n ? `${st.n} ${st.unit}${st.n > 1 ? "s" : ""}` : "Publishing soon"}
              </span>
            </div>
            <p class="mt-3 flex-1 text-sm leading-relaxed text-ink/70">${esc(s.body)}</p>
            <span class="mt-5 font-mono text-[10px] uppercase tracking-widest text-gold">Open ${esc(s.title.toLowerCase())} &rarr;</span>
          </a>
        </li>`;
};

export default {
  title: "Resource Centre — News, Events, Media and Downloads | Edge Comm-Tech",
  desc: "News, announcements, documentary videos, press releases, media coverage, events, webinars and downloadable documents from Edge Comm-Tech.",
  body: `  <main>
    ${pageHead({
      eyebrow: "Resource centre",
      title: "News, events, media and documents in one place",
      intro: "Company announcements, technology events and webinars, media material and the documents clients and tender committees ask for most.",
      accent: "#0b6fa8",
      variant: "grid",
      ctas: `<div class="eg-rise mt-8 flex flex-wrap gap-3" style="--d:.24s">
          <a href="subscribe.html" class="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">Subscribe for updates</a>
          <a href="blog.html" class="rounded-full border border-rule px-6 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold">Read our insights</a>
        </div>`,
    })}

    ${
      upcoming.length
        ? `<!-- What is actually next. Worth the top of the page while it is true. -->
    <section class="border-b border-rule bg-paper-2/50">
      <div class="mx-auto max-w-6xl px-6 py-12">
        <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Coming up</p>
        <ul class="mt-6 grid gap-3 sm:grid-cols-2">
          ${upcoming
            .map(
              (e) => `<li><a href="event-${e.slug}.html" class="eg-inview group flex items-start justify-between gap-5 rounded-2xl bg-paper p-6 transition hover:-translate-y-0.5">
            <span class="min-w-0">
              <span class="block font-mono text-[10px] uppercase tracking-widest text-steel">${esc(e.category)}</span>
              <span class="mt-1.5 block font-display text-lg leading-snug group-hover:text-gold">${esc(e.title)}</span>
              <span class="mt-1 block text-xs text-steel">${esc(e.format)} &middot; ${esc(e.audience)}</span>
            </span>
            <span class="shrink-0 text-right font-mono text-[10px] uppercase tracking-widest text-gold">${esc(e.date)}</span>
          </a></li>`,
            )
            .join("\n          ")}
        </ul>
      </div>
    </section>`
        : ""
    }

    <section class="mx-auto max-w-6xl px-6 py-16">
      ${sectionHead({ eyebrow: "Sections", title: "Browse the resource centre" })}
      <ul class="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        ${RESOURCE_SECTIONS.map(card).join("\n        ")}
      </ul>
      <p class="mt-8 flex flex-wrap items-center gap-3 text-xs text-steel">
        ${pending("Documentaries, press releases and coverage pending approved material from Edge")}
        <span>Sections open with their structure in place so material can be published as it is approved.</span>
      </p>
    </section>

    <!-- Insights are not one of the six sections, but visitors look for them
         here, so the latest three are surfaced with a route through. -->
    <section class="border-t border-rule bg-paper-2/40">
      <div class="mx-auto max-w-6xl px-6 py-16">
        <div class="flex flex-wrap items-end justify-between gap-5">
          <div>
            ${sectionHead({ eyebrow: "Insights", title: "Latest from the team" })}
          </div>
          <a href="blog.html" class="rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold">All ${POSTS.length} insights</a>
        </div>
        <ul class="mt-9 grid gap-3 sm:grid-cols-3">
          ${POSTS.slice(0, 3)
            .map(
              (p) => `<li><a href="blog.html#post-${p.slug}" class="eg-inview group flex h-full flex-col rounded-2xl bg-paper p-6 transition hover:-translate-y-1">
            <span class="font-display text-lg leading-snug group-hover:text-gold">${esc(p.title)}</span>
            <span class="mt-2.5 flex-1 text-[13px] leading-relaxed text-ink/70">${esc(p.paras[0].slice(0, 150))}&hellip;</span>
            <span class="mt-4 font-mono text-[10px] uppercase tracking-widest text-gold">Read &rarr;</span>
          </a></li>`,
            )
            .join("\n          ")}
        </ul>
      </div>
    </section>

    ${closingCta({
      title: "Looking for a document we have not published?",
      body: "Company profile, solution datasheets, compliance documentation and references are shared directly on request.",
      primary: { href: "contact.html", label: "Request a document" },
      secondary: { href: "downloads.html", label: "See available downloads" },
      accent: "#0b6fa8",
    })}
  </main>`,
};
