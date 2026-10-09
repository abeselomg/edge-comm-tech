import {
  ACADEMY_AUDIENCES, ACADEMY_TRACKS, ACADEMY_LEVELS, ACADEMY_DELIVERY, COURSE_SECTIONS,
} from "../people.mjs";
import { CONTACT, SOLUTIONS, ACCENT } from "../content.mjs";
import { pageHead, crumb, sectionHead, closingCta, pending, field, formNote, esc } from "../ui.mjs";

/*
 * Edge E-Academy.
 *
 * Training is one of Edge's six services, so every track here links back to
 * the solution family it teaches -- the academy is not a separate catalogue of
 * invented courses, it teaches what Edge delivers.
 *
 * No course has a published date, price or certificate scheme: none is
 * approved. COURSE_SECTIONS is the master's own template for what a course
 * page will contain, and it is shown as exactly that -- a template -- rather
 * than dressed up as six live course listings.
 */

const DARK = "#003D6B";
const solTitle = (slug) => SOLUTIONS.find((s) => s.slug === slug)?.title ?? slug;

const ENQUIRY_FIELDS = [
  { label: "Full name", required: true },
  { label: "Email address", type: "email", required: true },
  { label: "Mobile number", required: true },
  { label: "Organization" },
  {
    label: "I am enquiring as",
    type: "select",
    required: true,
    options: ["Select", ...ACADEMY_AUDIENCES.map((a) => a.title)],
  },
  {
    label: "Track of interest",
    type: "select",
    required: true,
    options: ["Select a track", ...ACADEMY_TRACKS.map((t) => t.title)],
  },
  { label: "Level", type: "select", options: ["Select", ...ACADEMY_LEVELS] },
  { label: "Preferred delivery", type: "select", options: ["Select", ...ACADEMY_DELIVERY] },
  { label: "Estimated participants", type: "select", options: ["Select", "Just me", "2–5", "6–15", "16–40", "More than 40"] },
  { label: "Preferred timing" },
  { label: "Objectives for the training", type: "textarea", wide: true },
];

export default {
  title: "Edge E-Academy — Technology Training and Knowledge Transfer",
  desc: "Structured technology training from Edge Comm-Tech for individuals, institutions and corporate teams across AI, networks, cloud, datacenters, cybersecurity and power.",
  body: `  <main>
    ${pageHead({
      eyebrow: "Edge E-Academy",
      title: "Technology training from the people who implement it",
      intro: "Our training comes out of delivery, not a syllabus. The engineers who build and support these systems for banks, universities and ministries are the ones who teach them.",
      accent: "#056a9a",
      variant: "grid",
      crumb: crumb([{ label: "Careers", href: "careers.html" }, { label: "E-Academy" }]),
      ctas: `<div class="eg-rise mt-8 flex flex-wrap gap-3" style="--d:.24s">
          <a href="#enquire" class="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">Enquire about training</a>
          <a href="#tracks" class="rounded-full border border-rule px-6 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold">See the tracks</a>
        </div>`,
    })}

    <!-- Who it is for -->
    <section class="border-b border-rule bg-paper-2/40">
      <div class="mx-auto max-w-6xl px-6 py-14">
        <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Who E-Academy is for</p>
        <ul class="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          ${ACADEMY_AUDIENCES.map(
            (a) => `<li class="eg-inview flex flex-col rounded-2xl bg-paper p-6">
            <h3 class="font-display text-lg leading-snug">${esc(a.title)}</h3>
            <p class="mt-2 flex-1 text-[13px] leading-relaxed text-ink/70">${esc(a.body)}</p>
            <a href="#enquire" class="mt-4 font-mono text-[10px] uppercase tracking-widest text-gold">${esc(a.action)} &rarr;</a>
          </li>`,
          ).join("\n          ")}
        </ul>
      </div>
    </section>

    <!-- Tracks, each tied to the solution family it teaches -->
    <section id="tracks" class="mx-auto max-w-6xl px-6 py-20">
      ${sectionHead({
        eyebrow: "Training tracks",
        title: "Six tracks, mapped to what we deliver",
        intro: "Each track teaches a solution family Edge Comm-Tech implements and supports, so what you learn matches how these systems are actually run.",
        accent: "#056a9a",
      })}
      <ul class="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        ${ACADEMY_TRACKS.map((t) => {
          const c = ACCENT[t.solution] ?? "#056a9a";
          return `<li class="eg-inview flex flex-col rounded-2xl border border-rule p-6 transition hover:border-gold">
          <h3 class="font-display text-lg leading-snug">${esc(t.title)}</h3>
          <p class="mt-2.5 flex-1 text-sm leading-relaxed text-ink/70">${esc(t.body)}</p>
          <a href="solution-${t.solution}.html" class="mt-5 border-t border-rule pt-4 font-mono text-[10px] uppercase tracking-widest transition hover:brightness-90" style="color:${c}">
            Taught from ${esc(solTitle(t.solution))} &rarr;
          </a>
        </li>`;
        }).join("\n        ")}
      </ul>
    </section>

    <!-- Levels and delivery, on dark -->
    <section class="relative overflow-hidden" style="background:${DARK}">
      <span class="pointer-events-none absolute -left-32 -bottom-40 h-[36rem] w-[36rem] rounded-full"
            style="background:radial-gradient(circle,rgb(255 255 255/0.06),transparent 70%)" aria-hidden="true"></span>
      <div class="relative mx-auto max-w-6xl px-6 py-20 text-white">
        <div class="grid gap-14 lg:grid-cols-[1fr_1fr]">
          <div>
            <p class="font-mono text-[10px] uppercase tracking-widest text-white/55">Levels</p>
            <h2 class="mt-3 font-display text-[clamp(1.5rem,3vw,2.3rem)] leading-tight">From first awareness to administrator depth</h2>
            <ul class="mt-8 flex flex-wrap gap-2">
              ${ACADEMY_LEVELS.map(
                (l) => `<li class="eg-inview rounded-full border border-white/20 px-4 py-2 text-sm text-white/85">${esc(l)}</li>`,
              ).join("\n              ")}
            </ul>
            <p class="mt-7 max-w-lg text-sm leading-relaxed text-white/65">
              A program is scoped to the level the participants are actually at. Mixed-ability groups are split rather
              than averaged, because the people who need the depth and the people who need the overview are not served
              by the same session.
            </p>
          </div>
          <div>
            <p class="font-mono text-[10px] uppercase tracking-widest text-white/55">Delivery</p>
            <h2 class="mt-3 font-display text-[clamp(1.5rem,3vw,2.3rem)] leading-tight">Wherever the team is</h2>
            <ul class="mt-8 space-y-3">
              ${ACADEMY_DELIVERY.map(
                (d) => `<li class="eg-inview flex items-center gap-4 rounded-2xl border border-white/15 px-5 py-4">
                <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-white/60"></span>
                <span class="text-sm text-white/85">${esc(d)}</span>
              </li>`,
              ).join("\n              ")}
            </ul>
            <p class="mt-7 max-w-lg text-sm leading-relaxed text-white/65">
              Institutional and corporate programs can be delivered at your site, at our offices or online, and
              scheduled around operational cover.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- What a course page will carry: shown as the template it is -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <div class="flex flex-wrap items-end justify-between gap-5">
        <div>
          ${sectionHead({
            eyebrow: "Course information",
            title: "What every course listing will tell you",
            intro: "Individual courses are published as each intake is confirmed. Every listing carries the same eight sections, so programs can be compared properly.",
            accent: "#056a9a",
          })}
        </div>
        ${pending("Course schedule pending from Edge")}
      </div>
      <ol class="mt-10 grid gap-px overflow-hidden rounded-3xl bg-rule sm:grid-cols-2 lg:grid-cols-4">
        ${COURSE_SECTIONS.map(
          (s, i) => `<li class="eg-inview bg-paper-2 p-6">
          <span class="font-display text-3xl text-[#056a9a]/20">${String(i + 1).padStart(2, "0")}</span>
          <h3 class="mt-2 font-display text-base leading-snug">${esc(s.title)}</h3>
          <p class="mt-1.5 text-[13px] leading-relaxed text-ink/70">${esc(s.body)}</p>
        </li>`,
        ).join("\n        ")}
      </ol>
    </section>

    <!-- Enquiry -->
    <section id="enquire" class="border-t border-rule bg-paper-2/40">
      <div class="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1fr_17rem]">
        <div class="min-w-0">
          ${sectionHead({ eyebrow: "Enquire", title: "Tell us what your team needs to learn", accent: "#056a9a" })}
          <p class="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70">
            Whether you are one person wanting a scheduled course or an institution planning a program for forty
            staff, start here. We will come back with a proposed track, level, format and duration.
          </p>
          <form class="mt-8 grid gap-5 sm:grid-cols-2">
            ${ENQUIRY_FIELDS.map(field).join("\n            ")}
            <div class="sm:col-span-2">
              <label class="flex items-start gap-3 text-xs leading-relaxed text-steel">
                <input type="checkbox" class="mt-0.5" disabled>
                <span>I accept the privacy notice and consent to being contacted about this training enquiry.</span>
              </label>
            </div>
            <div class="sm:col-span-2">
              <button type="button" class="rounded-full bg-[#056a9a] px-6 py-3 text-sm font-semibold text-white opacity-60" disabled>Send enquiry</button>
            </div>
          </form>
          ${formNote}
        </div>

        <aside class="self-start lg:sticky lg:top-32">
          <div class="rounded-2xl bg-paper p-6">
            <p class="font-mono text-[10px] uppercase tracking-widest text-steel">Training is a service</p>
            <p class="mt-2.5 text-sm leading-relaxed text-ink/70">
              Knowledge transfer is built into every Edge Comm-Tech delivery — administrator and user training,
              runbooks, workshops and coaching at handover.
            </p>
            <a href="service-training-knowledge-transfer.html" class="mt-4 inline-block font-mono text-[10px] uppercase tracking-widest text-gold">
              Training &amp; knowledge transfer &rarr;
            </a>
          </div>
          <div class="mt-4 rounded-2xl border border-rule p-6">
            <p class="font-mono text-[10px] uppercase tracking-widest text-steel">Prefer to email?</p>
            <p class="mt-2.5 text-sm leading-relaxed text-ink/70">
              <a href="mailto:${CONTACT.emails[0].value}" class="underline decoration-rule underline-offset-2 hover:text-gold">${CONTACT.emails[0].value}</a><br>
              Reply ${esc(CONTACT.response.toLowerCase())}.
            </p>
          </div>
        </aside>
      </div>
    </section>

    ${closingCta({
      title: "Training that outlasts the project",
      body: "A system is only as good as the team running it. We build that capability deliberately, as part of delivery and on its own.",
      primary: { href: "contact.html", label: "Talk to our team" },
      secondary: { href: "careers.html", label: "Back to careers" },
      accent: "#056a9a",
    })}
  </main>`,
};
