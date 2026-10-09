import { CLIENTS, CLIENT_SECTORS, PROJECTS, SOLUTIONS, ACCENT, DIFFERENTIATORS } from "../content.mjs";
import { pageHead, sectionHead, closingCta, pending, mark, esc } from "../ui.mjs";

/*
 * Client directory.
 *
 * Ten institutions, exactly as listed in the approved client directory. Four
 * organizations that appeared in the earlier draft model are absent from that
 * directory and are not here.
 *
 * Marks: only Bahir Dar University has artwork on file. The rest render their
 * name in the identical frame, because the content master permits publishing
 * only approved assets with a recorded source, retrieval date and reviewer.
 * Dropping a file into design-files/highland/clients/ and setting `logo` is
 * the whole swap.
 */

const SECTOR_ACCENT = { education: "#2ba8de", banking: "#056a9a", government: "#0b6fa8" };
const short = (slug) => SOLUTIONS.find((s) => s.slug === slug)?.short ?? slug;
const missing = CLIENTS.filter((c) => !c.logo).length;

const card = (c) => {
  const work = c.engagements.map((s) => PROJECTS.find((p) => p.slug === s)).filter(Boolean);
  return `<article class="eg-inview grid gap-7 border-t border-rule py-9 lg:grid-cols-[11rem_1fr]">
          <div class="flex h-20 w-full max-w-[11rem] items-center justify-center rounded-2xl border border-rule bg-paper-2 px-4">
            ${mark(c, { h: "h-11", dir: "clients" })}
          </div>
          <div class="min-w-0">
            <h3 class="font-display text-xl leading-snug">${esc(c.name)}</h3>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">${esc(c.summary)}</p>
            <div class="mt-4 flex flex-wrap items-center gap-2">
              ${c.solutions.map((s) => `<a href="solution-${s}.html" class="rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest transition hover:brightness-95" style="background:${ACCENT[s]}16;color:${ACCENT[s]}">${esc(short(s))}</a>`).join("\n              ")}
            </div>
            ${
              work.length
                ? `<ul class="mt-5 space-y-1.5">
              ${work
                .map(
                  (p) => `<li><a href="project-${p.slug}.html" class="group flex items-baseline justify-between gap-4 rounded-xl bg-paper-2 px-4 py-2.5">
                <span class="text-[13px] group-hover:text-gold">${esc(p.title)}</span>
                <span class="shrink-0 font-mono text-[9px] uppercase tracking-widest text-steel">${/confirm/i.test(p.year) ? "Year TBC" : esc(p.year)}</span>
              </a></li>`,
                )
                .join("\n              ")}
            </ul>`
                : `<p class="mt-5 text-[13px] text-steel">Engagement details are not published for this institution.</p>`
            }
          </div>
        </article>`;
};

export default {
  title: "Our Clients — Banks, Universities and Government Institutions | Edge Comm-Tech",
  desc: "Edge Comm-Tech works with Ethiopian banks, universities, ministries and public institutions delivering infrastructure, security, power and digital learning technology.",
  body: `  <main>
    ${pageHead({
      eyebrow: "Clients",
      title: "Trusted where reliability is not negotiable",
      intro: "Banks, universities, ministries and public institutions choose Edge Comm-Tech because their systems have to work. Our client relationships are built on careful delivery, documentation, training and support that continues after handover.",
      accent: "#056a9a",
      variant: "grid",
      ctas: `<div class="eg-rise mt-8 flex flex-wrap gap-3" style="--d:.24s">
          <a href="contact.html" class="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">Become a client</a>
          <a href="projects.html" class="rounded-full border border-rule px-6 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold">Read the project records</a>
        </div>`,
    })}

    <!-- The mark wall. Uniform frames, so a name reads as deliberately as a
         logo and the grid stays even while artwork is still being collected. -->
    <section class="border-b border-rule bg-paper-2/40">
      <div class="mx-auto max-w-6xl px-6 py-14">
        <div class="flex flex-wrap items-baseline justify-between gap-3">
          <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Institutions we serve</p>
          ${missing ? pending(`${missing} marks pending approved artwork`) : ""}
        </div>
        <ul class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          ${CLIENTS.map(
            (c) => `<li class="eg-inview flex h-20 items-center justify-center rounded-2xl border border-rule bg-paper px-4 transition hover:border-gold">
            ${mark(c, { h: "h-10", dir: "clients" })}
          </li>`,
          ).join("\n          ")}
        </ul>
      </div>
    </section>

    <!-- Sector sections ----------------------------------------------------- -->
    ${CLIENT_SECTORS.map(([key, label]) => {
      const list = CLIENTS.filter((c) => c.sector === key);
      const accent = SECTOR_ACCENT[key];
      return `<section class="border-t border-rule">
      <div class="mx-auto max-w-6xl px-6 py-16">
        <div class="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p class="font-mono text-[10px] uppercase tracking-widest" style="color:${accent}">Sector</p>
            <h2 class="mt-2 font-display text-[clamp(1.5rem,2.8vw,2.1rem)]">${esc(label)}</h2>
          </div>
          <p class="font-mono text-[10px] uppercase tracking-widest text-steel">${list.length} institution${list.length > 1 ? "s" : ""}</p>
        </div>
        <div class="mt-8">
          ${list.map(card).join("\n          ")}
        </div>
      </div>
    </section>`;
    }).join("\n    ")}

    <section class="border-t border-rule bg-paper-2/40">
      <div class="mx-auto max-w-6xl px-6 py-20">
        ${sectionHead({
          eyebrow: "Why institutions stay",
          title: "The reasons clients come back for the next project",
        })}
        <div class="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          ${DIFFERENTIATORS.map(
            (d) => `<div class="eg-inview border-t border-rule pt-5">
            <h3 class="font-display text-lg">${esc(d.title)}</h3>
            <p class="mt-2 text-sm leading-relaxed text-ink/70">${esc(d.body)}</p>
          </div>`,
            )
            .join("\n          ")}
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-4xl px-6 py-20">
      ${sectionHead({
        eyebrow: "References",
        title: "Client references on request",
        intro: "Detailed references, named contacts and completion certificates are shared directly with prospective clients and tender committees, subject to each institution's consent.",
      })}
      <p class="mt-6">
        <a href="contact.html" class="inline-block rounded-full border border-rule px-6 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold">Request references</a>
      </p>
    </section>

    ${closingCta({
      title: "Let's talk about your institution",
      body: "Tell us what you are modernizing and what it has to keep running while you do it. We will come back with a practical approach.",
      primary: { href: "contact.html", label: "Contact our team" },
      secondary: { href: "partners.html", label: "See our technology partners" },
      accent: "#056a9a",
    })}
  </main>`,
};
