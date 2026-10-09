import { DOWNLOADS } from "../editorial.mjs";
import { CONTACT } from "../content.mjs";
import { pageHead, crumb, sectionHead, closingCta, pending, esc } from "../ui.mjs";

/*
 * Downloads.
 *
 * Four records, none of them yet cleared for public download: the content
 * master requires each document to be checked against the current taxonomy,
 * and carries an explicit note to that effect on the company profile. So the
 * page lists what exists, states each document's status, and routes the
 * request to the team rather than serving a file that has not been approved.
 *
 * Every card's note is the master's own reviewer note -- not a placeholder
 * written here -- which is why it reads as internal rather than marketing.
 */

const card = (d) => `<li class="eg-inview flex flex-col rounded-2xl border border-rule p-6 transition hover:border-gold">
          <div class="flex items-start justify-between gap-4">
            <span class="font-mono text-[10px] uppercase tracking-widest text-gold">${esc(d.category)}</span>
            <svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0 text-steel" fill="none" stroke="currentColor" stroke-width="1.6"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>
            </svg>
          </div>
          <h3 class="mt-2.5 font-display text-lg leading-snug">${esc(d.title)}</h3>
          <p class="mt-2 font-mono text-[10px] uppercase tracking-widest text-steel">${esc(d.meta)}</p>
          <p class="mt-3 flex-1 text-[13px] leading-relaxed text-ink/65">${esc(d.note)}</p>
          <div class="mt-5 flex flex-wrap items-center gap-3 border-t border-rule pt-4">
            ${pending("Approval pending")}
            <a href="contact.html" class="font-mono text-[10px] uppercase tracking-widest text-gold">Request it &rarr;</a>
          </div>
          <p class="mt-2.5 text-[11px] text-steel">Owner: ${esc(d.owner)}</p>
        </li>`;

export default {
  title: "Downloads — Company Profile, Brochures and Datasheets | Edge Comm-Tech",
  desc: "Request the Edge Comm-Tech company profile, solutions overview, solution datasheets and vendor catalogues.",
  body: `  <main>
    ${pageHead({
      eyebrow: "Downloads",
      title: "The documents clients and tender committees ask for",
      intro: "Company profile, solution brochures, datasheets and vendor catalogues. Each document is checked against the current solution taxonomy before it is published, so some are available on request while that review completes.",
      accent: "#056a9a",
      variant: "grid",
      crumb: crumb([{ label: "Resources", href: "resources.html" }, { label: "Downloads" }]),
      meta: `<p class="eg-rise mt-6">${pending("No document is cleared for direct download yet")}</p>`,
    })}

    <section class="mx-auto max-w-6xl px-6 py-16">
      <div class="flex flex-wrap items-baseline justify-between gap-4">
        ${sectionHead({ eyebrow: "Document library", title: "What exists today", accent: "#056a9a" })}
      </div>
      <ul class="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        ${DOWNLOADS.map(card).join("\n        ")}
      </ul>
      <p class="mt-8 max-w-3xl rounded-2xl bg-paper-2 px-6 py-5 text-xs leading-relaxed text-steel">
        Documents are listed with their status rather than hidden. Where a file is still under review, the team
        sends the current approved version directly — usually the same working day.
      </p>
    </section>

    <section class="border-t border-rule bg-paper-2/40">
      <div class="mx-auto max-w-6xl px-6 py-16">
        ${sectionHead({
          eyebrow: "Also available on request",
          title: "Documentation for procurement and tender",
          intro: "Material that is shared directly rather than published, because it is prepared for a specific requirement or subject to a client's consent.",
          accent: "#056a9a",
        })}
        <ul class="mt-8 grid gap-2.5 sm:grid-cols-2">
          ${[
            "Company registration, licensing and statutory documentation",
            "Client references and completion certificates, subject to each institution's consent",
            "Solution-specific datasheets and bills of quantity prepared for your requirement",
            "Vendor and manufacturer documentation relevant to a proposed platform",
            "Project methodology, quality and handover documentation samples",
            "Training and knowledge-transfer outlines for a proposed scope",
          ]
            .map(
              (x) => `<li class="eg-inview flex items-start gap-3 rounded-2xl bg-paper px-5 py-4 text-sm text-ink/80">
            <span class="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-gold"></span><span>${x}</span>
          </li>`,
            )
            .join("\n          ")}
        </ul>
      </div>
    </section>

    ${closingCta({
      title: "Tell us which document you need",
      body: `Email <a href="mailto:${CONTACT.emails[0].value}" class="underline decoration-rule underline-offset-2 hover:text-gold">${CONTACT.emails[0].value}</a> or use the contact form, and name the document and the requirement it is for.`,
      primary: { href: "contact.html", label: "Request a document" },
      secondary: { href: "resources.html", label: "Back to resources" },
      accent: "#056a9a",
    })}
  </main>`,
};
