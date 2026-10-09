import { RESOURCE_SECTIONS, NEWS } from "../editorial.mjs";
import { CONTACT } from "../content.mjs";
import { pageHead, crumb, sectionHead, closingCta, pending, esc } from "../ui.mjs";

/*
 * One factory, three media sections: documentaries, press releases, coverage.
 *
 * None of the three has approved items yet. Rather than three near-identical
 * singleton modules -- or three pages that pretend to hold something -- this
 * builds each one as a working section with its structure visible, an honest
 * empty state, and the route a visitor actually needs from here.
 *
 * `SHAPE` holds only what genuinely differs between the three. When Edge
 * supplies material, each section gets its real item list and this factory
 * splits; until then, sameness is the correct answer.
 */

const SHAPE = {
  documentaries: {
    accent: "#2ba8de",
    variant: "beam",
    lead: "Short films about the work",
    intro:
      "Documentary videos covering project delivery, client environments, technology explainers and the people behind the engineering.",
    empty: "No documentary videos are published yet.",
    expect: [
      ["Project films", "How an engagement was scoped, delivered and handed over, filmed on site with the client's consent."],
      ["Technology explainers", "Short pieces on what a technology does and what it requires to run well."],
      ["Team and practice", "The engineers, the methodology and the standards the work is held to."],
    ],
    ask: "If you would like to feature a delivered project, or need footage for an institutional presentation, talk to us.",
  },
  "press-releases": {
    accent: "#056a9a",
    variant: "rule",
    lead: "Official statements",
    intro:
      "Formal company statements on milestones, partnerships, appointments, major project awards and corporate developments.",
    empty: "No press releases are published yet.",
    expect: [
      ["Corporate announcements", "Company milestones, structural changes and strategic developments."],
      ["Partnership statements", "New manufacturer, distributor and institutional relationships, once both parties approve the wording."],
      ["Project awards", "Major engagements, published only where the client has agreed to the announcement."],
    ],
    ask: "Journalists and editors can request a statement, company information or an interview directly.",
  },
  coverage: {
    accent: "#0b6fa8",
    variant: "wash",
    lead: "Edge in the press",
    intro:
      "Articles, interviews, panel appearances and third-party mentions of Edge Comm-Tech in Ethiopian and international media.",
    empty: "No media coverage is catalogued here yet.",
    expect: [
      ["Interviews and comment", "Where our team has been asked to comment on technology, infrastructure or digital transformation."],
      ["Event and panel appearances", "Conferences, exhibitions and institutional forums the team has taken part in."],
      ["Third-party articles", "Coverage published by others, linked to the original source rather than reproduced."],
    ],
    ask: "If you have covered Edge Comm-Tech and would like the mention catalogued here, send us the link.",
  },
};

export const make = (slug) => {
  const section = RESOURCE_SECTIONS.find((s) => s.slug === slug);
  if (!section) throw new Error(`no RESOURCE_SECTIONS entry for "${slug}"`);
  const s = SHAPE[slug];
  if (!s) throw new Error(`no media SHAPE for "${slug}"`);

  /* The other two media sections, for the cross-links at the foot. */
  const siblings = Object.keys(SHAPE)
    .filter((k) => k !== slug)
    .map((k) => ({ ...RESOURCE_SECTIONS.find((x) => x.slug === k), lead: SHAPE[k].lead }));

  return {
    title: `${section.title} — Edge Comm-Tech`,
    desc: s.intro,
    body: `  <main>
    ${pageHead({
      eyebrow: s.lead,
      title: section.title,
      intro: s.intro,
      accent: s.accent,
      variant: s.variant,
      crumb: crumb([
        { label: "Resources", href: "resources.html" },
        { label: section.title },
      ]),
      meta: `<p class="eg-rise mt-6">${pending("Material pending approval from Edge")}</p>`,
    })}

    <div class="mx-auto max-w-5xl px-6 py-16">
      <!-- Honest empty state. The structure is here; the items are not. -->
      <section class="rounded-3xl border border-dashed p-10 text-center" style="border-color:${s.accent}55;background:${s.accent}08">
        <svg viewBox="0 0 24 24" class="mx-auto h-8 w-8" fill="none" stroke="${s.accent}" stroke-width="1.5"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v5"/>
        </svg>
        <h2 class="mt-4 font-display text-xl">${esc(s.empty)}</h2>
        <p class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/70">
          This section is built and ready. Items appear as soon as Edge Comm-Tech approves the material,
          with its source and review recorded.
        </p>
        <div class="mt-7 flex flex-wrap justify-center gap-3">
          <a href="subscribe.html" class="rounded-full px-5 py-2.5 text-sm font-semibold text-white" style="background:${s.accent}">Tell me when it is published</a>
          <a href="news.html" class="rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold">Read company news</a>
        </div>
      </section>

      <section class="mt-16">
        ${sectionHead({ eyebrow: "What will appear here", title: "The material this section will carry", accent: s.accent })}
        <div class="mt-8 grid gap-3 sm:grid-cols-3">
          ${s.expect
            .map(
              ([t, b]) => `<div class="eg-inview flex flex-col rounded-2xl bg-paper-2 p-6">
            <h3 class="font-display text-base leading-snug">${t}</h3>
            <p class="mt-2 text-[13px] leading-relaxed text-ink/70">${b}</p>
          </div>`,
            )
            .join("\n          ")}
        </div>
        <p class="mt-7 max-w-2xl text-sm leading-relaxed text-ink/70">${esc(s.ask)}</p>
      </section>

      <!-- Something to actually read, so the page is not a dead end -->
      <section class="mt-16 border-t border-rule pt-10">
        <div class="flex flex-wrap items-baseline justify-between gap-4">
          <p class="font-mono text-[10px] uppercase tracking-widest text-steel">Published now</p>
          <a href="news.html" class="font-mono text-[10px] uppercase tracking-widest text-gold">All news &rarr;</a>
        </div>
        <ul class="mt-5 divide-y divide-rule">
          ${NEWS.slice(0, 2)
            .map(
              (n) => `<li><a href="news-${n.slug}.html" class="group grid gap-x-8 gap-y-1.5 py-5 lg:grid-cols-[8rem_1fr]">
            <span class="font-mono text-[10px] uppercase tracking-widest text-steel">${esc(n.kind)}</span>
            <span class="min-w-0">
              <span class="block font-display text-base leading-snug group-hover:text-gold">${esc(n.title)}</span>
              <span class="mt-1.5 block max-w-2xl text-[13px] leading-relaxed text-ink/65">${esc(n.standfirst)}</span>
            </span>
          </a></li>`,
            )
            .join("\n          ")}
        </ul>
      </section>

      <nav class="mt-14 grid gap-3 sm:grid-cols-2">
        ${siblings
          .map(
            (o) => `<a href="${o.file}" class="eg-inview flex items-center justify-between gap-4 rounded-2xl border border-rule px-6 py-5 transition hover:border-gold hover:text-gold">
          <span>
            <span class="block font-display text-base">${esc(o.title)}</span>
            <span class="mt-0.5 block font-mono text-[10px] uppercase tracking-widest text-steel">${esc(o.lead)}</span>
          </span>
          <span aria-hidden="true" class="text-gold">&rarr;</span>
        </a>`,
          )
          .join("\n        ")}
      </nav>
    </div>

    ${closingCta({
      title: "Media and press enquiries",
      body: `For interviews, statements, company information or approved media assets, email <a href="mailto:${CONTACT.emails[0].value}" class="underline decoration-rule underline-offset-2 hover:text-gold">${CONTACT.emails[0].value}</a> or use the contact form.`,
      primary: { href: "contact.html", label: "Contact our team" },
      secondary: { href: "resources.html", label: "Back to resources" },
      accent: s.accent,
    })}
  </main>`,
  };
};
