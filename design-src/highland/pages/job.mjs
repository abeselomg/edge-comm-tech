import { JOBS, APPLICATION_DOCS } from "../people.mjs";
import { CONTACT } from "../content.mjs";
import { pageHead, crumb, sectionHead, field, formNote, pending, esc } from "../ui.mjs";

/*
 * One factory, two vacancy pages -- the real openings in the content master.
 *
 * Required and preferred qualifications stay separate as the document
 * requires, and no salary, benefit or employment condition appears: none has
 * been approved for publication.
 */

const APPLICATION_FIELDS = [
  { label: "Full legal name", required: true },
  { label: "Email address", type: "email", required: true },
  { label: "Mobile number", required: true },
  { label: "City and country of residence", required: true },
  { label: "Current or most recent position", required: true },
  { label: "Years of relevant experience", type: "select", options: ["Select", "0–2", "3–5", "6–10", "More than 10"] },
  { label: "Highest education", type: "select", options: ["Select", "Diploma", "Bachelor's degree", "Postgraduate"] },
  { label: "Field of study", required: true },
  { label: "University or institution", required: true },
  { label: "LinkedIn or portfolio URL", type: "url" },
  { label: "CV upload", type: "file", required: true, wide: true, hint: "PDF or DOCX" },
];

export const make = (slug) => {
  const j = JOBS.find((x) => x.slug === slug);
  if (!j) throw new Error(`no JOBS entry for "${slug}"`);
  const c = j.level === "Executive" ? "#056a9a" : "#0888c5";
  const other = JOBS.find((x) => x.slug !== slug);

  const header = [
    ["Department", esc(j.department)],
    ["Career level", esc(j.level)],
    ["Reports to", esc(j.reports)],
    ["Employment type", esc(j.type)],
    ["Status", esc(j.status)],
    ["Deadline", pending(j.deadline)],
  ];

  const list = (items) =>
    `<ul class="mt-5 space-y-2.5">
          ${items
            .map(
              (x) => `<li class="eg-inview flex items-start gap-3 text-sm leading-relaxed text-ink/80">
            <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style="background:${c}"></span><span>${x}</span>
          </li>`,
            )
            .join("\n          ")}
        </ul>`;

  return {
    title: `${j.title} — Careers at Edge Comm-Tech`,
    desc: j.purpose,
    body: `  <main>
    ${pageHead({
      eyebrow: `Open position &middot; ${j.department}`,
      title: j.title,
      intro: j.purposeTitle,
      accent: c,
      variant: "rule",
      crumb: crumb([
        { label: "Careers", href: "careers.html" },
        { label: "Open positions", href: "careers-open-positions.html" },
        { label: j.title },
      ]),
    })}

    <div class="mx-auto max-w-6xl px-6">
      <dl class="eg-rise -mt-9 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule shadow-[0_20px_50px_-40px_rgb(28_36_48/0.6)] sm:grid-cols-3 lg:grid-cols-6">
        ${header
          .map(
            ([k, v]) => `<div class="bg-paper-2 px-5 py-4">
          <dt class="font-mono text-[9px] uppercase tracking-widest text-steel">${k}</dt>
          <dd class="mt-1.5 text-sm leading-snug">${v}</dd>
        </div>`,
          )
          .join("\n        ")}
      </dl>
      <p class="mt-4 text-xs text-steel">${esc(j.location)}</p>
    </div>

    <div class="mx-auto grid max-w-6xl gap-14 px-6 py-16 lg:grid-cols-[1fr_17rem]">
      <article class="min-w-0">
        <section>
          ${sectionHead({ eyebrow: "Role purpose", title: j.purposeTitle, accent: c })}
          <p class="mt-5 text-lg leading-relaxed text-ink/80">${j.purpose}</p>
          ${j.scope ? `<p class="mt-4 leading-relaxed text-ink/75">${j.scope}</p>` : ""}
        </section>

        <section class="mt-14">
          ${sectionHead({ eyebrow: "Responsibilities", title: "What the role owns", accent: c })}
          ${list(j.responsibilities)}
        </section>

        <section class="mt-14">
          ${sectionHead({ eyebrow: "Required", title: "Qualifications and experience", accent: c })}
          ${list(j.required)}
        </section>

        <section class="mt-14">
          ${sectionHead({ eyebrow: "Preferred", title: "What strengthens an application", accent: c })}
          ${list(j.preferred)}
        </section>

        <section class="mt-14 rounded-3xl p-8" style="background:${c}0e">
          ${sectionHead({ eyebrow: "Success in the role", title: "How performance will be judged", accent: c })}
          <p class="mt-4 leading-relaxed text-ink/80">${j.success}</p>
        </section>

        <section class="mt-14" id="apply">
          ${sectionHead({ eyebrow: "Apply", title: `Apply for ${esc(j.title)}`, accent: c })}
          <form class="mt-7 grid gap-5 sm:grid-cols-2">
            ${APPLICATION_FIELDS.map(field).join("\n            ")}
            <div class="sm:col-span-2">
              <label class="flex items-start gap-3 text-xs text-steel">
                <input type="checkbox" class="mt-0.5" disabled>
                <span>I confirm the information provided is accurate and accept the privacy notice and consent to recruitment processing.</span>
              </label>
            </div>
            <div class="sm:col-span-2">
              <button type="button" class="rounded-full px-6 py-3 text-sm font-semibold text-white opacity-60" style="background:${c}" disabled>Submit application</button>
            </div>
          </form>
          ${formNote}
          <p class="mt-4 text-xs text-steel">
            Applications are acknowledged with a reference number and routed to
            <a href="mailto:${CONTACT.emails[2].value}" class="underline decoration-rule underline-offset-2 hover:text-gold">${CONTACT.emails[2].value}</a>.
            Our HR team contacts candidates selected for the next stage.
          </p>
        </section>
      </article>

      <aside class="self-start lg:sticky lg:top-32">
        <p class="font-mono text-[10px] uppercase tracking-widest" style="color:${c}">Documents required</p>
        <ul class="mt-3 space-y-1.5">
          ${APPLICATION_DOCS.map((x) => `<li class="rounded-xl bg-paper-2 px-4 py-2.5 text-sm text-ink/75">${esc(x)}</li>`).join("\n          ")}
        </ul>
        <a href="#apply" class="mt-6 block rounded-full px-5 py-3 text-center text-sm font-semibold text-white" style="background:${c}">Apply now</a>
        ${
          other
            ? `<p class="mt-8 font-mono text-[10px] uppercase tracking-widest text-steel">Also open</p>
        <a href="job-${other.slug}.html" class="mt-3 block rounded-2xl bg-paper-2 p-4 transition hover:text-gold">
          <span class="block font-display text-base">${esc(other.title)}</span>
          <span class="mt-1 block text-xs text-steel">${esc(other.department)}</span>
        </a>`
            : ""
        }
        <a href="careers.html" class="mt-4 block rounded-2xl border border-rule p-4 text-sm transition hover:border-gold hover:text-gold">
          Not the right role? Join the talent community
        </a>
      </aside>
    </div>
  </main>`,
  };
};
