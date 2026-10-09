import { NEWS } from "../editorial.mjs";
import { pageHead, crumb, pending, closingCta, esc } from "../ui.mjs";

/*
 * One factory, three news articles.
 *
 * The three are deliberately different kinds: an archived 2018 milestone, an
 * evergreen insight, and a company-news item the content master keeps in
 * Draft until six publication fields are supplied. The third renders its
 * outstanding fields rather than guessing at them.
 */

export const make = (slug) => {
  const a = NEWS.find((x) => x.slug === slug);
  if (!a) throw new Error(`no NEWS entry for "${slug}"`);
  const c = a.draft ? "#c48a5a" : "#0888c5";
  const others = NEWS.filter((x) => x.slug !== slug);

  return {
    title: `${a.title} — Edge Comm-Tech`,
    desc: a.standfirst,
    body: `  <main>
    ${pageHead({
      eyebrow: `${a.kind} &middot; ${a.date}`,
      title: a.title,
      intro: a.standfirst,
      accent: c,
      variant: "rule",
      crumb: crumb([
        { label: "Resources", href: "resources.html" },
        { label: "News", href: "news.html" },
        { label: a.kind },
      ]),
      meta: a.archive
        ? `<p class="eg-rise mt-6">${pending("Archived milestone — published with its original 2018 year")}</p>`
        : a.draft
          ? `<p class="eg-rise mt-6">${pending("Draft — held until the fields below are confirmed")}</p>`
          : "",
    })}

    <article class="mx-auto max-w-2xl px-6 py-16">
      ${
        a.paras
          ? a.paras
              .map((p) => `<p class="eg-inview mb-6 text-lg leading-relaxed text-ink/80">${p}</p>`)
              .join("\n      ")
          : ""
      }
      ${
        a.sections
          ? a.sections
              .map(
                (s) => `<section class="eg-inview mb-10">
        <p class="font-mono text-[10px] uppercase tracking-widest" style="color:${c}">Priority</p>
        <h2 class="mt-2 font-display text-2xl">${s.title}</h2>
        <p class="mt-3 leading-relaxed text-ink/75">${s.body}</p>
      </section>`,
              )
              .join("\n      ")
          : ""
      }

      ${
        a.pendingFields
          ? `<section class="mt-4 rounded-2xl border border-lamp/30 bg-lamp/5 p-6">
        <p class="font-mono text-[10px] uppercase tracking-widest text-lamp">Details to add before publishing</p>
        <ul class="mt-4 grid gap-2 text-sm text-ink/75 sm:grid-cols-2">
          ${a.pendingFields.map((f) => `<li class="flex items-center gap-2"><span class="h-1 w-1 rounded-full bg-lamp"></span>${esc(f)}</li>`).join("\n          ")}
        </ul>
        <p class="mt-4 text-xs leading-relaxed text-steel">
          Edge Comm-Tech is not described as having accepted, signed, endorsed or committed to formal goals; no authorized record supports that wording yet.
        </p>
      </section>`
          : ""
      }

      ${
        a.slug === "edge-comm-tech-established-2018"
          ? `<section class="mt-10 rounded-2xl bg-paper-2 p-6">
        <p class="font-mono text-[10px] uppercase tracking-widest" style="color:${c}">Looking forward</p>
        <h2 class="mt-2 font-display text-2xl">Accelerating Africa's digital transformation</h2>
        <p class="mt-3 leading-relaxed text-ink/75">
          Edge Comm-Tech continues to invest in capable teams, professional certifications, strategic partnerships,
          responsible AI, sustainable infrastructure, and lifecycle support.
        </p>
        <div class="mt-5 flex flex-wrap gap-2">
          <a href="about.html" class="rounded-full px-4 py-2 text-xs font-semibold text-white" style="background:${c}">Learn more about Edge Comm-Tech</a>
          <a href="projects.html" class="rounded-full border border-rule px-4 py-2 text-xs font-semibold transition hover:border-gold hover:text-gold">Explore completed projects</a>
        </div>
      </section>`
          : ""
      }

      <nav class="mt-14 border-t border-rule pt-8">
        <p class="font-mono text-[10px] uppercase tracking-widest text-steel">More from the newsroom</p>
        <ul class="mt-4 divide-y divide-rule">
          ${others
            .map(
              (o) => `<li><a href="news-${o.slug}.html" class="group flex items-baseline justify-between gap-4 py-3.5">
            <span class="font-display text-base group-hover:text-gold">${o.title}</span>
            <span class="shrink-0 font-mono text-[10px] uppercase tracking-widest text-steel">${o.kind}</span>
          </a></li>`,
            )
            .join("\n          ")}
        </ul>
      </nav>
    </article>

    ${closingCta({
      title: "Discuss your transformation priorities",
      body: "Our objective is to help institutions modernize in a way that is secure, scalable, interoperable, resilient, and aligned with the services they need to deliver.",
      primary: { href: "contact.html", label: "Talk to our experts" },
      secondary: { href: "solutions.html", label: "Explore solutions and services" },
      accent: c,
    })}
  </main>`,
  };
};
