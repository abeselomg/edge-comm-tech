import { EVENTS } from "../editorial.mjs";
import { pageHead, crumb, sectionHead, field, formNote, pending, esc } from "../ui.mjs";

/*
 * One factory, three event pages.
 *
 * The content master supplies a single registration-form shape for all three,
 * so the form is identical by design; the pages differ in status. The
 * 28 September session has already run, so it renders as past with its
 * registration closed rather than inviting a sign-up that cannot happen.
 */

const REGISTRATION_FIELDS = [
  { label: "Full name", required: true },
  { label: "Job title", required: true },
  { label: "Organization", required: true },
  { label: "Sector", type: "select", required: true, options: ["Select a sector", "Banking and finance", "Education", "Government", "Enterprise", "Other"] },
  { label: "Email address", type: "email", required: true },
  { label: "WhatsApp number", required: true, hint: "Include country code" },
  { label: "Preferred updates", type: "select", options: ["Email", "WhatsApp", "Both"] },
  { label: "Attendance mode", type: "select", options: ["Online", "In person", "Meeting request"] },
  { label: "Question or objective", type: "textarea", wide: true },
];

export const make = (slug) => {
  const e = EVENTS.find((x) => x.slug === slug);
  if (!e) throw new Error(`no EVENTS entry for "${slug}"`);
  const past = e.status === "past";
  const c = past ? "#5c6b76" : "#0888c5";
  const others = EVENTS.filter((x) => x.slug !== slug);

  const details = [
    ["Date", esc(e.date)],
    ["Format", esc(e.format)],
    [e.format === "Online" ? "Platform" : "Venue", esc(e.venue)],
    ["Audience", esc(e.audience)],
    ["Status", past ? "Completed" : "Upcoming"],
  ];

  return {
    title: `${e.title} — Edge Comm-Tech`,
    desc: e.intro,
    body: `  <main>
    ${pageHead({
      eyebrow: `${e.category} &middot; ${e.date}`,
      title: e.headline,
      intro: e.intro,
      accent: c,
      variant: "beam",
      crumb: crumb([
        { label: "Resources", href: "resources.html" },
        { label: "Events", href: "events.html" },
        { label: e.title },
      ]),
      meta: past
        ? `<p class="eg-rise mt-6">${pending("This session has taken place — registration is closed")}</p>`
        : e.pending
          ? `<p class="eg-rise mt-6">${pending(e.pending)}</p>`
          : "",
    })}

    <div class="mx-auto max-w-5xl px-6 py-16">
      <dl class="grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-3 lg:grid-cols-5">
        ${details
          .map(
            ([k, v]) => `<div class="bg-paper-2 px-5 py-4">
          <dt class="font-mono text-[9px] uppercase tracking-widest text-steel">${k}</dt>
          <dd class="mt-1.5 text-sm leading-snug">${v}</dd>
        </div>`,
          )
          .join("\n        ")}
      </dl>

      <section class="mt-14">
        ${sectionHead({ eyebrow: "Program", title: "What the session covers", accent: c })}
        <ul class="mt-6 grid gap-2.5 sm:grid-cols-2">
          ${e.program
            .map(
              (x) => `<li class="eg-inview flex items-start gap-3 rounded-2xl bg-paper-2 px-5 py-4 text-sm text-ink/80">
            <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style="background:${c}"></span>
            <span>${x}</span>
          </li>`,
            )
            .join("\n          ")}
        </ul>
      </section>

      <section class="mt-16 rounded-3xl p-8" style="background:${c}0c">
        ${sectionHead({
          eyebrow: past ? "Registration closed" : "Registration",
          title: past ? "This event has already run" : "What registrants should expect",
          accent: c,
        })}
        <p class="mt-4 max-w-2xl text-sm leading-relaxed text-ink/75">
          ${
            past
              ? "Highlights, materials and any recording are added to this page when they are approved. Subscribe to hear about the next session."
              : "Complete the form with your professional details and communication preference. After submission you receive an acknowledgement. A confirmed seat, joining link, venue access instruction or meeting time is sent separately after review where approval is required."
          }
        </p>
        ${
          past
            ? `<a href="subscribe.html" class="mt-6 inline-block rounded-full px-5 py-3 text-sm font-semibold text-white" style="background:${c}">Get event updates</a>`
            : `<form class="mt-7 grid gap-5 sm:grid-cols-2">
          ${REGISTRATION_FIELDS.map(field).join("\n          ")}
          <div class="sm:col-span-2">
            <label class="flex items-start gap-3 text-xs text-steel">
              <input type="checkbox" class="mt-0.5" disabled>
              <span>I accept the event communication and privacy notice.</span>
            </label>
          </div>
          <div class="sm:col-span-2">
            <button type="button" class="rounded-full px-6 py-3 text-sm font-semibold text-white opacity-60" style="background:${c}" disabled>${esc(e.action)}</button>
          </div>
        </form>
        ${formNote}`
        }
      </section>

      <nav class="mt-14 border-t border-rule pt-8">
        <p class="font-mono text-[10px] uppercase tracking-widest text-steel">Other events</p>
        <ul class="mt-4 divide-y divide-rule">
          ${others
            .map(
              (o) => `<li><a href="event-${o.slug}.html" class="group flex items-baseline justify-between gap-4 py-3.5">
            <span class="font-display text-base group-hover:text-gold">${o.title}</span>
            <span class="shrink-0 font-mono text-[10px] uppercase tracking-widest text-steel">${o.date}</span>
          </a></li>`,
            )
            .join("\n          ")}
        </ul>
      </nav>
    </div>
  </main>`,
  };
};
