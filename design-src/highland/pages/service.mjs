import { SERVICES, SOLUTIONS, ACCENT } from "../content.mjs";
import { SERVICE_DETAIL } from "../detail.mjs";
import { pageHead, crumb, sectionHead, checkList, closingCta, esc } from "../ui.mjs";

/*
 * One factory, six professional-service pages.
 *
 * Deliberately not the solution datasheet. These pages are about method
 * rather than product, so there is no technology sidebar: the column is a
 * single measure, the activities run as a numbered ledger down the left, and
 * the evidence list is the page's visual anchor instead of a capability grid.
 */

export const make = (slug) => {
  const svc = SERVICES.find((s) => s.slug === slug);
  const d = SERVICE_DETAIL[slug];
  if (!svc) throw new Error(`no SERVICES entry for "${slug}"`);
  if (!d) throw new Error(`no SERVICE_DETAIL entry for "${slug}"`);
  const c = ACCENT[slug];
  const others = SERVICES.filter((s) => s.slug !== slug);

  return {
    title: `${svc.title} — Edge Comm-Tech`,
    desc: svc.blurb,
    body: `  <main>
    ${pageHead({
      eyebrow: `Service ${String(svc.n).padStart(2, "0")} of ${SERVICES.length}`,
      title: d.headline,
      intro: d.intro,
      accent: c,
      variant: "beam",
      crumb: crumb([
        { label: "Solutions", href: "solutions.html" },
        { label: "Services", href: "services.html" },
        { label: svc.short },
      ]),
    })}

    <div class="mx-auto max-w-4xl px-6 py-16">
      <section>
        ${sectionHead({ eyebrow: "Core services", title: "What the engagement covers", accent: c })}
        <ol class="mt-7">
          ${d.capabilities
            .map(
              (x, i) => `<li class="eg-inview grid gap-x-6 gap-y-2 border-t border-rule py-6 sm:grid-cols-[3.5rem_1fr]">
            <span class="font-mono text-sm" style="color:${c}">${String(i + 1).padStart(2, "0")}</span>
            <span>
              <span class="block font-display text-xl leading-snug">${x.title}</span>
              <span class="mt-2 block text-sm leading-relaxed text-ink/70">${x.body}</span>
            </span>
          </li>`,
            )
            .join("\n          ")}
        </ol>
      </section>

      ${
        d.checklist
          ? `<section class="mt-16 rounded-3xl p-8" style="background:${c}0c">
        ${sectionHead({ eyebrow: "Deliverables", title: d.checklistTitle, accent: c })}
        ${checkList(d.checklist, c, "sm:grid-cols-1")}
      </section>`
          : ""
      }

      ${
        d.models
          ? `<section class="mt-16">
        ${sectionHead({ eyebrow: "Engagement models", title: d.modelsTitle, accent: c })}
        <dl class="mt-6 grid gap-3 sm:grid-cols-2">
          ${d.models
            .map(
              (m) => `<div class="eg-inview rounded-2xl bg-paper-2 p-6">
            <dt class="font-display text-lg">${m.title}</dt>
            <dd class="mt-2 text-sm text-ink/70">${m.body}</dd>
          </div>`,
            )
            .join("\n          ")}
        </dl>
      </section>`
          : ""
      }

      ${
        d.fit
          ? `<section class="mt-16 border-t border-rule pt-10">
        <p class="font-mono text-[10px] uppercase tracking-widest" style="color:${c}">Best suited for</p>
        <p class="mt-3 text-lg leading-relaxed text-ink/80">${d.fit}</p>
      </section>`
          : ""
      }

      ${
        d.note
          ? `<p class="mt-8 flex items-start gap-2.5 rounded-2xl bg-paper-2 px-6 py-5 text-xs leading-relaxed text-steel">
        <svg viewBox="0 0 24 24" class="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8"
             stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>
        <span>${d.note}</span></p>`
          : ""
      }

      <section class="mt-16 border-t border-rule pt-10">
        <p class="font-mono text-[10px] uppercase tracking-widest" style="color:${c}">Related services</p>
        <ul class="mt-4 flex flex-wrap gap-2">
          ${d.links
            .map((s) => {
              const t = [...SERVICES, ...SOLUTIONS].find((x) => x.slug === s);
              const file = SERVICES.some((x) => x.slug === s) ? "service-" : "solution-";
              return `<li><a href="${file}${s}.html" class="block rounded-full px-4 py-2 text-xs font-semibold transition hover:-translate-y-0.5"
            style="background:${ACCENT[s]}14;color:${ACCENT[s]}">${esc(t.short)}</a></li>`;
            })
            .join("\n          ")}
        </ul>
      </section>
    </div>

    ${closingCta({
      title: "Tell us what you need to deliver",
      body: "Share the requirement, the constraints and the environment you already run. We will say what we would do, in what order, and what it depends on.",
      primary: { href: "contact.html", label: "Request a service consultation" },
      secondary: { href: "projects.html", label: "View projects and success stories" },
      accent: c,
    })}

    <section class="border-t border-rule bg-paper-2">
      <div class="mx-auto max-w-6xl px-6 py-12">
        <p class="font-mono text-[10px] uppercase tracking-widest text-gold">The other five services</p>
        <ul class="mt-5 flex flex-wrap gap-2">
          ${others
            .map(
              (s) => `<li><a href="service-${s.slug}.html"
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
