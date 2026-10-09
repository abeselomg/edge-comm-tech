import { SOLUTIONS, SERVICES, PROJECTS, PARTNERS, ACCENT } from "../content.mjs";
import { SOLUTION_DETAIL } from "../detail.mjs";
import { POSTS } from "../editorial.mjs";
import { pageHead, crumb, sectionHead, checkList, numberedSteps, mark, closingCta, esc } from "../ui.mjs";

/*
 * One factory, seven solution-family pages.
 *
 * The skeleton is a datasheet -- prose column, pinned capability sidebar --
 * but each family draws only the optional blocks its content carries, so
 * Datacenter gets two capability bands, Software/AI gets an architecture
 * stack, Cybersecurity gets a resilience sequence, and no two read alike.
 */

/* Blog cards link to fragments on these pages. The content master requires
   that every destination anchor exists, so each is attached to the capability
   it names rather than invented at the top of the page. */
const ANCHOR_CAPABILITY = {
  "private-rag": "Private Enterprise AI & RAG",
  "agentic-ai": "Industry-Specific Agentic AI",
  "ai-education": "AI for Education",
  "local-language-ai": "Local-Language AI",
  "hci-private-cloud": "Hyperconverged Infrastructure",
  "backup-disaster-recovery": "Backup & Recovery",
  "zero-trust-ztna-nac": "Zero Trust Network Access & NAC",
};
/* The datacenter page has bands rather than a flat list, so its two anchors
   attach to the bands themselves. */
const ANCHOR_BAND = { "datacenter-facility": 0, "safe-campus": 1 };

const anchorsFor = (slug) => POSTS.filter((p) => p.to === slug && p.anchor).map((p) => p.anchor);

const relatedProjects = (slug) => PROJECTS.filter((p) => p.solutions.includes(slug));

export const make = (slug) => {
  const svc = SOLUTIONS.find((s) => s.slug === slug);
  const d = SOLUTION_DETAIL[slug];
  if (!svc) throw new Error(`no SOLUTIONS entry for "${slug}"`);
  if (!d) throw new Error(`no SOLUTION_DETAIL entry for "${slug}"`);
  const c = ACCENT[slug];
  const anchors = anchorsFor(slug);
  const capAnchor = Object.fromEntries(
    anchors.filter((a) => ANCHOR_CAPABILITY[a]).map((a) => [ANCHOR_CAPABILITY[a], a]),
  );
  const bandAnchor = Object.fromEntries(
    anchors.filter((a) => a in ANCHOR_BAND).map((a) => [ANCHOR_BAND[a], a]),
  );
  const others = SOLUTIONS.filter((s) => s.slug !== slug);
  const rel = relatedProjects(slug);

  const capCard = (x) => `<article class="eg-inview rounded-2xl bg-paper-2 p-6"${capAnchor[x.title] ? ` id="${capAnchor[x.title]}"` : ""}>
            <h3 class="font-display text-xl leading-snug">${x.title}</h3>
            <p class="mt-2.5 text-sm leading-relaxed text-ink/70">${x.body}</p>
          </article>`;

  return {
    title: `${svc.title} — Edge Comm-Tech`,
    desc: svc.blurb,
    body: `  <main>
    ${pageHead({
      eyebrow: `Solution ${String(svc.n).padStart(2, "0")} of ${SOLUTIONS.length}`,
      title: d.headline,
      intro: d.intro,
      accent: c,
      variant: "wash",
      crumb: crumb([{ label: "Solutions", href: "solutions.html" }, { label: svc.short }]),
    })}

    <div class="mx-auto grid max-w-6xl gap-14 px-6 py-16 lg:grid-cols-[1fr_19rem]">
      <article class="min-w-0">
        ${d.lead ? `<p class="max-w-2xl text-lg leading-relaxed">${d.lead}</p>` : ""}

        ${
          d.outcomes
            ? `<section>
          ${sectionHead({ eyebrow: "Business outcomes", title: d.outcomesTitle, accent: c })}
          ${checkList(d.outcomes, c)}
        </section>`
            : ""
        }

        ${
          d.bands
            ? d.bands
                .map(
                  (b, i) => `<section class="mt-14"${bandAnchor[i] ? ` id="${bandAnchor[i]}"` : ""}>
          ${sectionHead({ eyebrow: b.label, title: b.title, accent: c })}
          <div class="mt-6 grid gap-3 sm:grid-cols-2">
          ${b.items.map(capCard).join("\n          ")}
          </div>
        </section>`,
                )
                .join("\n        ")
            : ""
        }

        ${
          d.capabilities && d.capabilities.length
            ? `<section class="${d.outcomes || d.lead ? "mt-14" : ""}">
          ${sectionHead({ eyebrow: "Core capabilities", title: "What this covers", accent: c })}
          <div class="mt-6 grid gap-3 sm:grid-cols-2">
          ${d.capabilities.map(capCard).join("\n          ")}
          </div>
        </section>`
            : ""
        }

        ${
          d.layers
            ? `<section class="mt-14">
          ${sectionHead({ eyebrow: "Solution architecture", title: d.layersTitle, accent: c })}
          <ol class="mt-6 overflow-hidden rounded-2xl border border-rule">
            ${d.layers
              .map(
                (l, i) => `<li class="eg-inview flex gap-5 border-b border-rule bg-paper-2 px-6 py-5 last:border-0">
              <span class="mt-1 h-fit rounded-md px-2 py-0.5 font-mono text-[10px]" style="background:${c}18;color:${c}">L${d.layers.length - i}</span>
              <span><span class="block font-display text-lg">${l.title}</span>
              <span class="mt-1 block text-sm text-ink/70">${l.body}</span></span>
            </li>`,
              )
              .join("\n            ")}
          </ol>
        </section>`
            : ""
        }

        ${
          d.steps
            ? `<section class="mt-14">
          ${sectionHead({ eyebrow: "Approach", title: d.stepsTitle, accent: c })}
          ${numberedSteps(d.steps, c)}
        </section>`
            : ""
        }

        ${
          d.checklist
            ? `<section class="mt-14">
          ${sectionHead({ eyebrow: "What we weigh", title: d.checklistTitle, accent: c })}
          ${d.checklistNote ? `<p class="mt-4 max-w-2xl text-sm text-ink/70">${d.checklistNote}</p>` : ""}
          ${checkList(d.checklist, c)}
        </section>`
            : ""
        }

        ${
          d.measures
            ? `<section class="mt-14">
          ${sectionHead({ eyebrow: "Success measures", title: d.measuresTitle, accent: c })}
          <ul class="mt-5 flex flex-wrap gap-2">
            ${d.measures
              .map(
                (x) => `<li class="rounded-full px-3.5 py-1.5 text-xs" style="background:${c}12;color:${c}">${x}</li>`,
              )
              .join("\n            ")}
          </ul>
        </section>`
            : ""
        }

        ${
          d.sectors
            ? `<section class="mt-14">
          ${sectionHead({ eyebrow: "Sector relevance", title: "Where it applies", accent: c })}
          <dl class="mt-6 divide-y divide-rule border-y border-rule">
            ${d.sectors
              .map(
                (s) => `<div class="eg-inview grid gap-2 py-5 sm:grid-cols-[13rem_1fr] sm:gap-6">
              <dt class="font-display text-lg">${s.title}</dt>
              <dd class="text-sm text-ink/70">${s.body}</dd>
            </div>`,
              )
              .join("\n            ")}
          </dl>
        </section>`
            : ""
        }

        ${
          rel.length
            ? `<section class="mt-14">
          ${sectionHead({ eyebrow: "Delivered work", title: "Where we have built it", accent: c })}
          <ul class="mt-5 divide-y divide-rule border-y border-rule">
            ${rel
              .map(
                (p) => `<li><a href="project-${p.slug}.html" class="group flex items-baseline justify-between gap-4 py-4">
              <span><span class="block font-display text-lg group-hover:text-gold">${p.title}</span>
              <span class="text-sm text-steel">${p.client} &middot; ${p.primary}</span></span>
              <span class="shrink-0 font-mono text-xs text-steel">${p.year}</span>
            </a></li>`,
              )
              .join("\n            ")}
          </ul>
        </section>`
            : ""
        }

        ${
          d.experience
            ? `<p class="mt-10 rounded-2xl bg-paper-2 px-6 py-5 text-sm leading-relaxed text-ink/70">${d.experience}</p>`
            : ""
        }
        ${
          d.note
            ? `<p class="mt-4 flex items-start gap-2.5 text-xs leading-relaxed text-steel">
          <svg viewBox="0 0 24 24" class="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8"
               stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>
          <span>${d.note}</span></p>`
            : ""
        }
      </article>

      <aside class="self-start lg:sticky lg:top-32">
        <p class="font-mono text-[10px] uppercase tracking-widest" style="color:${c}">Technologies we build on</p>
        <ul class="mt-3 grid grid-cols-2 gap-2">
          ${d.partners
            .map((name) => {
              const p = PARTNERS.find((q) => q.name === name);
              return `<li class="grid h-14 place-items-center rounded-xl bg-paper-2 px-2">${mark(p ?? { name, logo: null })}</li>`;
            })
            .join("\n          ")}
        </ul>
        <p class="mt-3 text-[11px] leading-relaxed text-steel">
          Edge Comm-Tech selects technology by suitability, interoperability, scalability, security and long-term support.
        </p>

        <p class="mt-8 font-mono text-[10px] uppercase tracking-widest" style="color:${c}">Related solutions</p>
        <ul class="mt-3 space-y-1.5">
          ${d.links
            .map((s) => {
              const t = [...SOLUTIONS, ...SERVICES].find((x) => x.slug === s);
              const file = SOLUTIONS.some((x) => x.slug === s) ? "solution-" : "service-";
              return `<li><a href="${file}${s}.html" class="block rounded-xl bg-paper-2 px-4 py-2.5 text-sm transition hover:text-gold">${t.short}</a></li>`;
            })
            .join("\n          ")}
        </ul>

        <a href="contact.html" class="mt-8 block rounded-full px-5 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5"
           style="background:${c}">Request a consultation</a>
      </aside>
    </div>

    <section class="border-t border-rule bg-paper-2">
      <div class="mx-auto max-w-6xl px-6 py-14">
        <p class="font-mono text-[10px] uppercase tracking-widest text-gold">The other six families</p>
        <ul class="mt-5 flex flex-wrap gap-2">
          ${others
            .map(
              (s) => `<li><a href="solution-${s.slug}.html"
            class="block rounded-full px-4 py-2 text-xs font-semibold transition hover:-translate-y-0.5"
            style="background:${ACCENT[s.slug]}14;color:${ACCENT[s.slug]}">${esc(s.short)}</a></li>`,
            )
            .join("\n          ")}
        </ul>
      </div>
    </section>
  </main>`,
  };
};
