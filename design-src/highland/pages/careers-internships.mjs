import { INTERNSHIP } from "../people.mjs";
import { CONTACT } from "../content.mjs";
import { pageHead, crumb, sectionHead, closingCta, pending, field, formNote, esc } from "../ui.mjs";

/*
 * Graduate internship program.
 *
 * Two things the content master insists on, both honoured here:
 *
 *   - Intakes are periodic. Dates, schedule and deadline are all unconfirmed,
 *     so they render as pending rather than as a date nobody has agreed.
 *   - The caveat that applying does not guarantee placement is published in
 *     full, not softened. It appears before the form, not after it.
 */

const APPLICATION_FIELDS = [
  { label: "Full legal name", required: true },
  { label: "Email address", type: "email", required: true },
  { label: "Mobile number", required: true },
  { label: "City and country of residence", required: true },
  {
    label: "Preferred track",
    type: "select",
    required: true,
    options: ["Select a track", ...INTERNSHIP.tracks.map((t) => t.title)],
  },
  { label: "University or institution", required: true },
  { label: "Field of study", required: true },
  {
    label: "Current status",
    type: "select",
    options: ["Select", "Final-year student", "Recent graduate", "Technical and vocational graduate", "Other"],
  },
  { label: "Expected or actual graduation year" },
  { label: "CV upload", type: "file", required: true, hint: "PDF or DOCX" },
  { label: "Why this track", type: "textarea", wide: true, hint: "A short paragraph is enough" },
];

export default {
  title: "Graduate Technology Internship — Edge Comm-Tech",
  desc: "Supervised graduate internships at Edge Comm-Tech in network engineering and system engineering, with mentorship, structured learning plans and real project exposure.",
  body: `  <main>
    ${pageHead({
      eyebrow: "Internship program",
      title: INTERNSHIP.title,
      intro: INTERNSHIP.intro,
      accent: "#2ba8de",
      variant: "beam",
      crumb: crumb([{ label: "Careers", href: "careers.html" }, { label: "Internships" }]),
      meta: `<p class="eg-rise mt-6 flex flex-wrap gap-2">
          ${pending(`Intake dates ${INTERNSHIP.schedule.toLowerCase().replace(/^dates and working schedule /, "")}`)}
          ${pending(`Application deadline ${INTERNSHIP.deadline.toLowerCase()}`)}
        </p>`,
    })}

    <div class="mx-auto max-w-6xl px-6">
      <dl class="eg-rise -mt-9 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule shadow-[0_20px_50px_-40px_rgb(28_36_48/0.6)] sm:grid-cols-2 lg:grid-cols-4">
        ${[
          ["Program", esc(INTERNSHIP.type)],
          ["Tracks", `${INTERNSHIP.tracks.length} available per intake`],
          ["Location", esc(INTERNSHIP.location)],
          ["Schedule", esc(INTERNSHIP.schedule)],
        ]
          .map(
            ([k, v]) => `<div class="bg-paper-2 px-5 py-4">
          <dt class="font-mono text-[9px] uppercase tracking-widest text-steel">${k}</dt>
          <dd class="mt-1.5 text-sm leading-snug">${v}</dd>
        </div>`,
          )
          .join("\n        ")}
      </dl>
    </div>

    <!-- Tracks -->
    <section class="mx-auto max-w-6xl px-6 py-16">
      ${sectionHead({
        eyebrow: "Tracks",
        title: "Two supervised engineering tracks",
        intro: "Each intake publishes the tracks it can support, based on departmental capacity, project requirements and available mentors.",
        accent: "#2ba8de",
      })}
      <div class="mt-9 grid gap-4 lg:grid-cols-2">
        ${INTERNSHIP.tracks
          .map(
            (t, i) => `<article class="eg-inview rounded-3xl border border-rule p-8 transition hover:border-gold">
          <span class="font-mono text-[10px] uppercase tracking-widest text-[#2ba8de]">Track ${String(i + 1).padStart(2, "0")}</span>
          <h3 class="mt-2 font-display text-2xl">${esc(t.title)}</h3>
          <p class="mt-3 text-sm leading-relaxed text-ink/75">${esc(t.body)}</p>
        </article>`,
          )
          .join("\n        ")}
      </div>
    </section>

    <!-- Program structure -->
    <section class="border-y border-rule bg-paper-2/40">
      <div class="mx-auto max-w-6xl px-6 py-16">
        ${sectionHead({ eyebrow: "Structure", title: "How an intake runs", accent: "#2ba8de" })}
        <ol class="mt-9 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          ${INTERNSHIP.structure
            .map(
              (x, i) => `<li class="eg-inview border-t border-rule pt-5">
            <span class="font-mono text-[10px] text-[#2ba8de]">${String(i + 1).padStart(2, "0")}</span>
            <h3 class="mt-1.5 font-display text-lg">${esc(x.title)}</h3>
            <p class="mt-2 text-sm leading-relaxed text-ink/70">${esc(x.body)}</p>
          </li>`,
            )
            .join("\n          ")}
        </ol>
      </div>
    </section>

    <!-- Eligibility and selection -->
    <section class="mx-auto max-w-6xl px-6 py-16">
      <div class="grid gap-12 lg:grid-cols-[1fr_1fr]">
        <div>
          ${sectionHead({ eyebrow: "Eligibility", title: "Who we can consider", accent: "#2ba8de" })}
          <ul class="mt-6 space-y-2.5">
            ${INTERNSHIP.eligibility
              .map(
                (x) => `<li class="eg-inview flex items-start gap-3 text-sm leading-relaxed text-ink/80">
              <svg viewBox="0 0 24 24" class="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="#2ba8de" stroke-width="2.2"
                   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>
              <span>${esc(x)}</span>
            </li>`,
              )
              .join("\n            ")}
          </ul>
        </div>
        <div>
          ${sectionHead({ eyebrow: "Selection", title: "How applications are assessed", accent: "#2ba8de" })}
          <ol class="mt-6 space-y-4">
            ${INTERNSHIP.selection
              .map(
                (x) => `<li class="eg-inview flex gap-4">
              <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#2ba8de]/15 font-mono text-[10px] text-[#2ba8de]">${x.n}</span>
              <span>
                <span class="block font-display text-base">${esc(x.title)}</span>
                <span class="mt-1 block text-[13px] leading-relaxed text-ink/70">${esc(x.body)}</span>
              </span>
            </li>`,
              )
              .join("\n            ")}
          </ol>
        </div>
      </div>
    </section>

    <!-- The caveat, published in full and before the form -->
    <section class="mx-auto max-w-4xl px-6">
      <p class="rounded-3xl border border-lamp/40 bg-lamp/[0.07] px-7 py-6 text-sm leading-relaxed text-ink/80">
        <span class="mb-2 block font-mono text-[10px] uppercase tracking-widest text-lamp">Please read before applying</span>
        ${esc(INTERNSHIP.caveat)}
      </p>
    </section>

    <!-- Application -->
    <section class="mx-auto max-w-6xl px-6 py-16">
      <div class="grid gap-12 lg:grid-cols-[1fr_17rem]">
        <div class="min-w-0">
          ${sectionHead({ eyebrow: "Apply", title: "Register for the next intake", accent: "#2ba8de" })}
          <p class="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70">
            Applications are held and reviewed against the next intake's published tracks and criteria. You will
            receive an acknowledgement with a reference number.
          </p>
          <form class="mt-8 grid gap-5 sm:grid-cols-2">
            ${APPLICATION_FIELDS.map(field).join("\n            ")}
            <div class="sm:col-span-2">
              <label class="flex items-start gap-3 text-xs leading-relaxed text-steel">
                <input type="checkbox" class="mt-0.5" disabled>
                <span>I confirm the information provided is accurate, I have read the note above, and I accept the
                privacy notice and consent to recruitment processing.</span>
              </label>
            </div>
            <div class="sm:col-span-2">
              <button type="button" class="rounded-full bg-[#2ba8de] px-6 py-3 text-sm font-semibold text-white opacity-60" disabled>Submit application</button>
            </div>
          </form>
          ${formNote}
        </div>

        <aside class="self-start lg:sticky lg:top-32">
          <p class="font-mono text-[10px] uppercase tracking-widest text-[#2ba8de]">Documents required</p>
          <ul class="mt-3 space-y-1.5">
            ${INTERNSHIP.documents
              .map((x) => `<li class="rounded-xl bg-paper-2 px-4 py-2.5 text-sm text-ink/75">${esc(x)}</li>`)
              .join("\n            ")}
          </ul>
          <p class="mt-5 text-xs leading-relaxed text-steel">
            Questions? Email
            <a href="mailto:${CONTACT.emails[2].value}" class="underline decoration-rule underline-offset-2 hover:text-gold">${CONTACT.emails[2].value}</a>.
          </p>
        </aside>
      </div>
    </section>

    ${closingCta({
      title: "Already graduated and looking for a role?",
      body: "If you have professional experience behind you, the open positions page is the right place to start.",
      primary: { href: "careers-open-positions.html", label: "See open positions" },
      secondary: { href: "careers-e-academy.html", label: "Explore E-Academy training" },
      accent: "#2ba8de",
    })}
  </main>`,
};
