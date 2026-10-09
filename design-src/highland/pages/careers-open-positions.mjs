import { JOBS, APPLICATION_DOCS, CAREER_PATHWAYS } from "../people.mjs";
import { CONTACT } from "../content.mjs";
import { pageHead, crumb, sectionHead, closingCta, pending, esc } from "../ui.mjs";

/*
 * Open positions.
 *
 * Two published vacancies. Each row carries only what the content master
 * approves for a listing -- department, level, reporting line, type, status,
 * location -- and the deadline is shown as unconfirmed rather than guessed.
 *
 * No salary or benefit appears: none is approved for publication.
 */

const row = (j) => {
  const c = j.level === "Executive" ? "#056a9a" : "#0888c5";
  return `<li><a href="job-${j.slug}.html"
          class="eg-inview group grid gap-x-10 gap-y-5 border-t border-rule py-9 lg:grid-cols-[1fr_15rem]">
          <div class="min-w-0">
            <p class="font-mono text-[10px] uppercase tracking-widest" style="color:${c}">${esc(j.department)} &middot; ${esc(j.level)}</p>
            <h3 class="mt-2.5 font-display text-[clamp(1.3rem,2.3vw,1.8rem)] leading-snug group-hover:text-gold">${esc(j.title)}</h3>
            <p class="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink/70">${esc(j.purpose)}</p>
            <p class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-widest text-steel">
              <span>${esc(j.type)}</span><span>${esc(j.location)}</span><span>Reports to ${esc(j.reports)}</span>
            </p>
          </div>
          <div class="flex flex-col items-start gap-3 lg:items-end">
            <span class="rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-widest" style="background:${c}16;color:${c}">${esc(j.status)}</span>
            ${pending(`Deadline ${j.deadline.toLowerCase()}`)}
            <span class="font-mono text-[10px] uppercase tracking-widest text-gold">View role and apply &rarr;</span>
          </div>
        </a></li>`;
};

export default {
  title: "Open Positions — Careers at Edge Comm-Tech",
  desc: "Current vacancies at Edge Comm-Tech in Addis Ababa across engineering, technology leadership and corporate functions.",
  body: `  <main>
    ${pageHead({
      eyebrow: "Open positions",
      title: `${JOBS.length} role${JOBS.length > 1 ? "s" : ""} open right now`,
      intro: "Every vacancy lists its responsibilities, required and preferred qualifications, and how performance in the role will be judged — so you can decide whether it is right for you before you apply.",
      accent: "#0888c5",
      variant: "rule",
      crumb: crumb([{ label: "Careers", href: "careers.html" }, { label: "Open positions" }]),
    })}

    <div class="mx-auto max-w-6xl px-6 py-16">
      <ul>
        ${JOBS.map(row).join("\n        ")}
      </ul>

      <div class="mt-16 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <section>
          ${sectionHead({ eyebrow: "What to prepare", title: "Documents every application asks for" })}
          <ul class="mt-6 space-y-1.5">
            ${APPLICATION_DOCS.map(
              (x) => `<li class="eg-inview flex items-start gap-3 rounded-xl bg-paper-2 px-5 py-3 text-sm text-ink/75">
              <span class="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-gold"></span><span>${esc(x)}</span>
            </li>`,
            ).join("\n            ")}
          </ul>
          <p class="mt-5 text-xs leading-relaxed text-steel">
            Applications are acknowledged with a reference number and routed to
            <a href="mailto:${CONTACT.emails[2].value}" class="underline decoration-rule underline-offset-2 hover:text-gold">${CONTACT.emails[2].value}</a>.
            Our HR team contacts candidates selected for the next stage.
          </p>
        </section>

        <section class="rounded-3xl bg-paper-2 p-8">
          ${sectionHead({ eyebrow: "Nothing matching?", title: "Register your interest" })}
          <p class="mt-4 text-sm leading-relaxed text-ink/75">
            We review speculative applications when a relevant role opens. Tell us which pathway your experience sits
            in and what you want to work on.
          </p>
          <ul class="mt-6 flex flex-wrap gap-1.5">
            ${CAREER_PATHWAYS.map(
              (p) => `<li class="rounded-full bg-paper px-3 py-1.5 text-[11px] text-ink/70">${esc(p.title)}</li>`,
            ).join("\n            ")}
          </ul>
          <div class="mt-7 flex flex-wrap gap-3">
            <a href="mailto:${CONTACT.emails[2].value}" class="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5">Send your CV</a>
            <a href="careers-internships.html" class="rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold">Graduate internships</a>
          </div>
        </section>
      </div>
    </div>

    ${closingCta({
      title: "Questions about a role?",
      body: `Email our HR team at <a href="mailto:${CONTACT.emails[2].value}" class="underline decoration-rule underline-offset-2 hover:text-gold">${CONTACT.emails[2].value}</a> with the role title and your question.`,
      primary: { href: "careers.html", label: "Back to careers" },
      secondary: { href: "about.html", label: "About Edge Comm-Tech" },
    })}
  </main>`,
};
