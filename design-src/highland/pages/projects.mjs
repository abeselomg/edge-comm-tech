import { PROJECTS, CLIENT_SECTORS, SOLUTIONS, IMPACT, ACCENT } from "../content.mjs";
import { pageHead, sectionHead, closingCta, pending, esc } from "../ui.mjs";

/*
 * Project index.
 *
 * Eight documented engagements, grouped by the same three sectors the clients
 * page uses. No filter UI here -- eight records across three sectors read
 * better as a grouped index, and the partners page is where filtering earns
 * its keep.
 *
 * The 67+ figure and the eight detailed records are different claims and are
 * presented as such: the counter says how many projects Edge has delivered,
 * the index says which ones are documented for publication.
 */

const SECTOR_OF = { Education: "education", Banking: "banking", Government: "government" };
const short = (slug) => SOLUTIONS.find((s) => s.slug === slug)?.short ?? slug;

/* One index row. The year is rendered as given -- one project's year is still
   to be confirmed and says so rather than guessing. */
const row = (p) => {
  const c = ACCENT[p.solutions[0]];
  const unknownYear = /confirm/i.test(p.year);
  return `<li><a href="project-${p.slug}.html"
          class="eg-inview group grid gap-x-10 gap-y-4 border-t border-rule py-9 lg:grid-cols-[13rem_1fr]">
          <div class="shrink-0">
            <span class="block font-mono text-[10px] uppercase tracking-widest" style="color:${c}">${esc(p.client)}</span>
            <span class="mt-1.5 block text-xs text-steel">${unknownYear ? pending("Year to confirm") : esc(p.year)}</span>
            <span class="mt-1 block text-xs text-steel">${esc(p.location)}</span>
          </div>
          <div class="min-w-0">
            <h3 class="font-display text-[clamp(1.25rem,2.1vw,1.7rem)] leading-snug group-hover:text-gold">${esc(p.title)}</h3>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">${esc(p.summary)}</p>
            <div class="mt-4 flex flex-wrap items-center gap-2">
              ${p.solutions.map((s) => `<span class="rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest" style="background:${ACCENT[s]}16;color:${ACCENT[s]}">${esc(short(s))}</span>`).join("\n              ")}
              ${p.tech.length ? `<span class="font-mono text-[9px] uppercase tracking-widest text-steel">${p.tech.map(esc).join(" &middot; ")}</span>` : ""}
            </div>
          </div>
        </a></li>`;
};

const hero = PROJECTS.find((p) => p.featured === 1) ?? PROJECTS[0];

export default {
  title: "Technology Projects and Case Studies — Edge Comm-Tech",
  desc: "Delivered technology projects across Ethiopian banks, universities and government institutions — smart classrooms, computing infrastructure, backup, CCTV, datacenter and power solutions.",
  body: `  <main>
    ${pageHead({
      eyebrow: "Projects",
      title: "Delivered in environments that cannot afford downtime",
      intro: "Edge Comm-Tech has executed and delivered more than 67 projects for banks, universities, ministries and major enterprises. The engagements documented below show how our solutions and services work in practice.",
      accent: "#0b6fa8",
      variant: "wash",
      ctas: `<div class="eg-rise mt-8 flex flex-wrap gap-3" style="--d:.24s">
          <a href="contact.html" class="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">Discuss a similar project</a>
          <a href="clients.html" class="rounded-full border border-rule px-6 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold">See who we work with</a>
        </div>`,
    })}

    <!-- Counters, then the featured engagement pulled out as the one wide card
         on the page. Everything after this is the grouped index. -->
    <section class="border-b border-rule bg-paper-2/40">
      <div class="mx-auto max-w-6xl px-6 py-12">
        <dl class="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          ${IMPACT.map(
            (m) => `<div class="eg-inview">
            <dt class="font-display text-[clamp(2rem,4vw,2.9rem)] leading-none text-gold">${esc(m.figure)}</dt>
            <dd class="mt-2 font-mono text-[10px] uppercase tracking-widest text-steel">${esc(m.unit)}</dd>
            <dd class="mt-1 text-[13px] leading-snug text-ink/65">${esc(m.line)}</dd>
          </div>`,
          ).join("\n          ")}
        </dl>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-16">
      ${sectionHead({ eyebrow: "Featured engagement", title: esc(hero.title), accent: ACCENT[hero.solutions[0]] })}
      <a href="project-${hero.slug}.html" class="eg-inview group mt-8 grid overflow-hidden rounded-3xl border border-rule transition hover:border-gold lg:grid-cols-[1.15fr_1fr]">
        <div class="p-9">
          <p class="font-mono text-[10px] uppercase tracking-widest" style="color:${ACCENT[hero.solutions[0]]}">${esc(hero.client)} &middot; ${esc(hero.sectorFull)}</p>
          <p class="mt-4 text-lg leading-relaxed text-ink/80">${esc(hero.summary)}</p>
          <div class="mt-6 flex flex-wrap gap-2">${hero.solutions.map((s) => `<span class="rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest" style="background:${ACCENT[s]}16;color:${ACCENT[s]}">${esc(short(s))}</span>`).join("")}</div>
          <span class="mt-7 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gold">Read the project <span aria-hidden="true">&rarr;</span></span>
        </div>
        <dl class="grid grid-cols-2 gap-px bg-rule">
          ${[
            ["Client", esc(hero.client)],
            ["Sector", esc(hero.sectorFull)],
            ["Period", esc(hero.year)],
            ["Location", esc(hero.location)],
            ["Focus", esc(hero.primary)],
            ["Technologies", hero.tech.map(esc).join(", ")],
          ]
            .map(
              ([k, v]) => `<div class="bg-paper-2 px-6 py-5">
            <dt class="font-mono text-[9px] uppercase tracking-widest text-steel">${k}</dt>
            <dd class="mt-1.5 text-sm leading-snug">${v}</dd>
          </div>`,
            )
            .join("\n          ")}
        </dl>
      </a>
    </section>

    <!-- Grouped index, one section per sector -->
    ${CLIENT_SECTORS.map(([key, label]) => {
      const list = PROJECTS.filter((p) => SECTOR_OF[p.sector] === key);
      if (!list.length) return "";
      return `<section class="border-t border-rule">
      <div class="mx-auto max-w-6xl px-6 py-16">
        <div class="flex flex-wrap items-baseline justify-between gap-4">
          <h2 class="font-display text-[clamp(1.5rem,2.8vw,2.1rem)]">${esc(label)}</h2>
          <p class="font-mono text-[10px] uppercase tracking-widest text-steel">${list.length} project${list.length > 1 ? "s" : ""}</p>
        </div>
        <ul class="mt-8">
          ${list.map(row).join("\n          ")}
        </ul>
      </div>
    </section>`;
    }).join("\n    ")}

    <section class="border-t border-rule bg-paper-2/40">
      <div class="mx-auto max-w-6xl px-6 py-16">
        ${sectionHead({
          eyebrow: "By solution family",
          title: "Find the experience closest to your requirement",
        })}
        <ul class="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          ${SOLUTIONS.map((s) => {
            const n = PROJECTS.filter((p) => p.solutions.includes(s.slug)).length;
            return `<li><a href="solution-${s.slug}.html" class="eg-inview flex items-center justify-between gap-4 rounded-2xl bg-paper px-5 py-4 transition hover:text-gold">
            <span class="text-sm">${esc(s.short)}</span>
            <span class="shrink-0 font-mono text-[10px] uppercase tracking-widest" style="color:${ACCENT[s.slug]}">${n ? `${n} project${n > 1 ? "s" : ""}` : "Explore"}</span>
          </a></li>`;
          }).join("\n          ")}
        </ul>
      </div>
    </section>

    ${closingCta({
      title: "Your project could be the next one here",
      body: "Share your requirement and constraints. We will tell you honestly what the work involves and how we would deliver it.",
      primary: { href: "contact.html", label: "Start a conversation" },
      secondary: { href: "solutions.html", label: "Explore solutions" },
      accent: "#0b6fa8",
    })}
  </main>`,
};
