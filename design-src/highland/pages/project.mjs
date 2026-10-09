import { PROJECTS, SOLUTIONS, PARTNERS, ACCENT, CLIENTS } from "../content.mjs";
import { PROJECT_DETAIL, IMPLEMENTATION } from "../project-detail.mjs";
import { pageHead, crumb, sectionHead, mark, pending, closingCta, esc } from "../ui.mjs";

/*
 * One factory, eight completed-project pages.
 *
 * Shaped as a case study rather than a datasheet: context, then what was
 * delivered, then the result. The facts panel sits immediately under the
 * hero as the content master specifies, and carries no contract value,
 * quantity or capacity -- none have been supplied as verified figures.
 */

const SECTOR_ACCENT = {
  Education: "#0888c5",
  Banking: "#056a9a",
  Government: "#0b6fa8",
};

export const make = (slug) => {
  const p = PROJECTS.find((x) => x.slug === slug);
  const d = PROJECT_DETAIL[slug];
  if (!p) throw new Error(`no PROJECTS entry for "${slug}"`);
  if (!d) throw new Error(`no PROJECT_DETAIL entry for "${slug}"`);
  const c = SECTOR_ACCENT[p.sector] ?? "#0888c5";
  const client = CLIENTS.find((x) => x.name === p.client);
  const siblings = PROJECTS.filter((x) => x.slug !== slug && x.sector === p.sector).slice(0, 3);

  const facts = [
    ["Client", esc(p.client)],
    ["Sector", esc(p.sectorFull)],
    ["Location", esc(p.location)],
    ["Completion", p.year === "Year to confirm" ? pending("Year to confirm") : esc(p.year)],
    ["Status", "Completed"],
    ["Technology", p.tech.map(esc).join(", ")],
  ];

  return {
    title: `${p.title} — Edge Comm-Tech`,
    desc: p.summary,
    body: `  <main>
    ${pageHead({
      eyebrow: `${p.sector} &middot; Completed`,
      title: d.headline,
      intro: p.summary,
      accent: c,
      variant: "grid",
      crumb: crumb([{ label: "Projects", href: "projects.html" }, { label: p.client }]),
    })}

    <div class="mx-auto max-w-6xl px-6">
      <dl class="eg-rise -mt-9 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule shadow-[0_20px_50px_-40px_rgb(28_36_48/0.6)] sm:grid-cols-3 lg:grid-cols-6">
        ${facts
          .map(
            ([k, v]) => `<div class="bg-paper-2 px-5 py-4">
          <dt class="font-mono text-[9px] uppercase tracking-widest text-steel">${k}</dt>
          <dd class="mt-1.5 text-sm leading-snug">${v}</dd>
        </div>`,
          )
          .join("\n        ")}
      </dl>
    </div>

    <div class="mx-auto max-w-3xl px-6 py-16">
      <section>
        ${sectionHead({ eyebrow: "Client context", title: "The need", accent: c })}
        <p class="mt-5 text-lg leading-relaxed text-ink/80">${d.need}</p>
      </section>

      <section class="mt-14">
        ${sectionHead({ eyebrow: "Project scope", title: "What Edge Comm-Tech delivered", accent: c })}
        <ul class="mt-6 space-y-2.5">
          ${d.scope
            .map(
              (x, i) => `<li class="eg-inview flex gap-4 rounded-2xl bg-paper-2 px-5 py-4 text-sm">
            <span class="pt-0.5 font-mono text-[10px]" style="color:${c}">${String(i + 1).padStart(2, "0")}</span>
            <span class="text-ink/80">${x}</span>
          </li>`,
            )
            .join("\n          ")}
        </ul>
      </section>

      <section class="mt-14">
        ${sectionHead({ eyebrow: "Delivered solution", title: "An integrated operational solution", accent: c })}
        <div class="mt-6 space-y-3">
          ${d.delivered
            .map(
              (b) => `<article class="eg-inview rounded-2xl border-l-2 bg-paper-2 py-5 pl-6 pr-6" style="border-color:${c}">
            <h3 class="font-display text-lg">${b.title}</h3>
            <p class="mt-2 text-sm leading-relaxed text-ink/70">${b.body}</p>
          </article>`,
            )
            .join("\n          ")}
        </div>
      </section>

      <section class="mt-14">
        ${sectionHead({ eyebrow: "Implementation", title: "From assessment to operational handover", accent: c })}
        <p class="mt-5 leading-relaxed text-ink/75">${IMPLEMENTATION}</p>
      </section>

      <section class="mt-14 rounded-3xl p-8" style="background:${c}0e">
        ${sectionHead({ eyebrow: "Outcomes", title: "The result", accent: c })}
        <ul class="mt-6 space-y-3">
          ${d.outcomes
            .map(
              (x) => `<li class="flex items-start gap-3 text-sm leading-relaxed text-ink/80">
            <svg viewBox="0 0 24 24" class="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="${c}"
                 stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>
            <span>${x}</span>
          </li>`,
            )
            .join("\n          ")}
        </ul>
      </section>

      <section class="mt-14 grid gap-8 border-t border-rule pt-10 sm:grid-cols-2">
        <div>
          <p class="font-mono text-[10px] uppercase tracking-widest" style="color:${c}">Technology</p>
          <p class="mt-3 text-sm leading-relaxed text-ink/75">${d.technology}</p>
          <ul class="mt-4 flex flex-wrap gap-2">
            ${p.tech
              .map((n) => {
                const brand = PARTNERS.find((q) => q.name === n);
                return `<li class="grid h-11 min-w-[6rem] place-items-center rounded-xl bg-paper-2 px-3">${mark(brand ?? { name: n, logo: null }, { h: "h-7" })}</li>`;
              })
              .join("\n            ")}
          </ul>
          ${d.technologyNote ? `<p class="mt-3 text-[11px] leading-relaxed text-steel">${d.technologyNote}</p>` : ""}
        </div>
        <div>
          <p class="font-mono text-[10px] uppercase tracking-widest" style="color:${c}">Training and handover</p>
          <p class="mt-3 text-sm leading-relaxed text-ink/75">${d.training}</p>
        </div>
      </section>

      ${
        d.privacy
          ? `<p class="mt-8 flex items-start gap-2.5 rounded-2xl bg-paper-2 px-6 py-5 text-xs leading-relaxed text-steel">
        <svg viewBox="0 0 24 24" class="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8"
             stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>
        <span>${d.privacy}</span></p>`
          : ""
      }

      <section class="mt-14 border-t border-rule pt-10">
        <p class="font-mono text-[10px] uppercase tracking-widest" style="color:${c}">Related capability</p>
        <ul class="mt-4 flex flex-wrap gap-2">
          ${p.solutions
            .map((s) => {
              const t = SOLUTIONS.find((x) => x.slug === s);
              return `<li><a href="solution-${s}.html" class="block rounded-full px-4 py-2 text-xs font-semibold transition hover:-translate-y-0.5"
            style="background:${ACCENT[s]}14;color:${ACCENT[s]}">${esc(t.short)}</a></li>`;
            })
            .join("\n          ")}
          ${client ? `<li><a href="clients.html" class="block rounded-full border border-rule px-4 py-2 text-xs font-semibold transition hover:border-gold hover:text-gold">All ${esc(p.client)} work</a></li>` : ""}
        </ul>
      </section>

      ${
        siblings.length
          ? `<section class="mt-12">
        <p class="font-mono text-[10px] uppercase tracking-widest text-steel">More in ${esc(p.sector.toLowerCase())}</p>
        <ul class="mt-4 divide-y divide-rule border-y border-rule">
          ${siblings
            .map(
              (s) => `<li><a href="project-${s.slug}.html" class="group flex items-baseline justify-between gap-4 py-4">
            <span class="font-display text-base group-hover:text-gold">${s.title}</span>
            <span class="shrink-0 font-mono text-xs text-steel">${s.year}</span>
          </a></li>`,
            )
            .join("\n          ")}
        </ul>
      </section>`
          : ""
      }
    </div>

    ${closingCta({
      title: "Plan your project with Edge Comm-Tech",
      body: "Every engagement on this page began with an assessment and a written requirement. Tell us yours and we will start in the same place.",
      primary: { href: "contact.html", label: "Discuss a similar project" },
      secondary: { href: "projects.html", label: "View all completed projects" },
      accent: c,
    })}
  </main>`,
  };
};
