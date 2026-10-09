import {
  CAREER_PATHWAYS, CULTURE, DEVELOPMENT, EXPERIENCE_POINTS, JOBS, INTERNSHIP, APPLICATION_DOCS,
} from "../people.mjs";
import { CONTACT } from "../content.mjs";
import { pageHead, sectionHead, closingCta, pending, esc } from "../ui.mjs";

/*
 * Careers hub.
 *
 * Three routes in -- open positions, internships, E-Academy -- and the reasons
 * to take one. The open-position count is computed, so this page cannot
 * advertise vacancies that are not published.
 *
 * No salary, benefit or employment condition appears anywhere in the careers
 * module: none has been approved for publication. The internship deadline is
 * shown as unconfirmed rather than invented.
 */

const ROUTES = [
  {
    file: "careers-open-positions.html",
    eyebrow: "Experienced professionals",
    title: "Open positions",
    body: "Current vacancies across engineering, project delivery, commercial and corporate functions.",
    count: `${JOBS.length} role${JOBS.length > 1 ? "s" : ""} open`,
    accent: "#0888c5",
  },
  {
    file: "careers-internships.html",
    eyebrow: "Students and graduates",
    title: "Internship program",
    body: INTERNSHIP.intro.split(". ")[0] + ".",
    count: `${INTERNSHIP.tracks.length} track${INTERNSHIP.tracks.length > 1 ? "s" : ""}`,
    accent: "#2ba8de",
  },
  {
    file: "careers-e-academy.html",
    eyebrow: "Learning and certification",
    title: "Edge E-Academy",
    body: "Structured technology training for individuals, institutions and corporate teams.",
    count: "Courses and workshops",
    accent: "#056a9a",
  },
];

export default {
  title: "Careers at Edge Comm-Tech — Build Africa's Digital Future",
  desc: "Join Edge Comm-Tech. Explore engineering, project delivery and corporate careers, graduate internships and E-Academy training programs in Addis Ababa.",
  body: `  <main>
    ${pageHead({
      eyebrow: "Careers",
      title: "Build the infrastructure a continent runs on",
      intro: "Edge Comm-Tech engineers work on the systems Ethiopian banks, universities and ministries depend on. The work is real, the standards are high, and what you learn here compounds.",
      accent: "#0888c5",
      variant: "grid",
      ctas: `<div class="eg-rise mt-8 flex flex-wrap gap-3" style="--d:.24s">
          <a href="careers-open-positions.html" class="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">See open positions</a>
          <a href="careers-internships.html" class="rounded-full border border-rule px-6 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold">Graduate internships</a>
        </div>`,
    })}

    <!-- Three routes in -->
    <section class="border-b border-rule bg-paper-2/40">
      <div class="mx-auto max-w-6xl px-6 py-14">
        <ul class="grid gap-3 sm:grid-cols-3">
          ${ROUTES.map(
            (r) => `<li><a href="${r.file}" class="eg-inview group flex h-full flex-col rounded-3xl bg-paper p-7 transition hover:-translate-y-1">
            <span class="font-mono text-[10px] uppercase tracking-widest" style="color:${r.accent}">${r.eyebrow}</span>
            <span class="mt-2 font-display text-xl leading-snug group-hover:text-gold">${r.title}</span>
            <span class="mt-2.5 flex-1 text-sm leading-relaxed text-ink/70">${esc(r.body)}</span>
            <span class="mt-5 flex items-center justify-between gap-3 border-t border-rule pt-4 font-mono text-[10px] uppercase tracking-widest">
              <span class="text-steel">${r.count}</span><span class="text-gold" aria-hidden="true">&rarr;</span>
            </span>
          </a></li>`,
          ).join("\n          ")}
        </ul>
      </div>
    </section>

    <!-- Why work here -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      ${sectionHead({
        eyebrow: "The experience",
        title: "What working at Edge Comm-Tech is actually like",
      })}
      <ul class="mt-9 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        ${EXPERIENCE_POINTS.map(
          (x) => `<li class="eg-inview flex items-start gap-3 rounded-2xl bg-paper-2 px-5 py-4 text-sm leading-relaxed text-ink/80">
          <svg viewBox="0 0 24 24" class="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="#0888c5" stroke-width="2.2"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>
          <span>${esc(x)}</span>
        </li>`,
        ).join("\n        ")}
      </ul>
    </section>

    <!-- Career pathways -->
    <section class="border-t border-rule bg-paper-2/40">
      <div class="mx-auto max-w-6xl px-6 py-20">
        ${sectionHead({
          eyebrow: "Career pathways",
          title: "Where people build a career here",
          intro: "Six broad pathways, each with its own progression from early-career contribution through specialist and leadership roles.",
        })}
        <div class="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          ${CAREER_PATHWAYS.map(
            (p, i) => `<div class="eg-inview border-t border-rule pt-5">
            <span class="font-mono text-[10px] text-gold">${String(i + 1).padStart(2, "0")}</span>
            <h3 class="mt-1.5 font-display text-lg leading-snug">${esc(p.title)}</h3>
            <p class="mt-2 text-sm leading-relaxed text-ink/70">${esc(p.body)}</p>
          </div>`,
          ).join("\n          ")}
        </div>
      </div>
    </section>

    <!-- Culture: the seven values, as they apply to working here -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      ${sectionHead({
        eyebrow: "Culture",
        title: "Seven things we hold each other to",
        intro: "The same values that govern how we deliver for clients govern how we work together.",
      })}
      <dl class="mt-10 grid gap-px overflow-hidden rounded-3xl bg-rule sm:grid-cols-2 lg:grid-cols-4">
        ${CULTURE.map(
          ([title, body]) => `<div class="eg-inview bg-paper-2 p-6">
          <dt class="font-display text-lg">${esc(title)}</dt>
          <dd class="mt-2 text-sm leading-relaxed text-ink/70">${esc(body)}</dd>
        </div>`,
        ).join("\n        ")}
      </dl>
      <p class="mt-6 text-xs text-steel">
        These are Edge Comm-Tech's company values. <a href="about.html" class="underline decoration-rule underline-offset-2 hover:text-gold">Read how they shape our delivery</a>.
      </p>
    </section>

    <!-- Development -->
    <section class="border-t border-rule">
      <div class="mx-auto max-w-6xl px-6 py-20">
        <div class="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            ${sectionHead({ eyebrow: "Growth", title: "How people develop here" })}
            <ul class="mt-7 space-y-3">
              ${DEVELOPMENT.map(
                (x) => `<li class="eg-inview flex items-start gap-3 text-sm leading-relaxed text-ink/80">
                <span class="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold"></span><span>${esc(x)}</span>
              </li>`,
              ).join("\n              ")}
            </ul>
          </div>
          <div class="rounded-3xl bg-paper-2 p-8">
            <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Before you apply</p>
            <h3 class="mt-2 font-display text-xl">Have these ready</h3>
            <p class="mt-3 text-sm leading-relaxed text-ink/70">
              Every vacancy and internship application asks for the same documents. Preparing them first makes the
              form a five-minute job.
            </p>
            <ul class="mt-5 space-y-1.5">
              ${APPLICATION_DOCS.map(
                (x) => `<li class="flex items-start gap-3 rounded-xl bg-paper px-4 py-2.5 text-sm text-ink/75">
                <span class="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-gold"></span><span>${esc(x)}</span>
              </li>`,
              ).join("\n              ")}
            </ul>
            <p class="mt-5 text-xs text-steel">
              Applications are acknowledged with a reference number. Our HR team contacts candidates selected for the
              next stage.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Talent community -->
    <section class="border-t border-rule bg-paper-2/40">
      <div class="mx-auto max-w-4xl px-6 py-20 text-center">
        <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Nothing open that fits?</p>
        <h2 class="mt-3 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-tight">Introduce yourself anyway</h2>
        <p class="mx-auto mt-4 max-w-xl leading-relaxed text-ink/75">
          We keep speculative applications on file and review them when a relevant role opens. Send your CV with a
          short note about the work you want to do.
        </p>
        <p class="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a href="mailto:${CONTACT.emails[2].value}" class="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">${CONTACT.emails[2].value}</a>
          <a href="careers-open-positions.html" class="rounded-full border border-rule px-6 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold">Check open roles first</a>
        </p>
        <p class="mt-5 flex justify-center">${pending("Internship intake dates to be confirmed")}</p>
      </div>
    </section>

    ${closingCta({
      title: "Ready to apply?",
      body: `${JOBS.length} position${JOBS.length > 1 ? "s are" : " is"} open now, and the graduate internship program accepts applications between intakes.`,
      primary: { href: "careers-open-positions.html", label: "See open positions" },
      secondary: { href: "careers-e-academy.html", label: "Explore E-Academy" },
    })}
  </main>`,
};
