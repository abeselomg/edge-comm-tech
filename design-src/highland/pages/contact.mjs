import { CONTACT, INQUIRY_CATEGORIES, SOLUTIONS } from "../content.mjs";
import { pageHead, sectionHead, field, formNote, esc } from "../ui.mjs";

/*
 * Contact.
 *
 * The seven inquiry categories are the spine of this page. Each one carries
 * the master's own prompt -- what to include so the message can be answered
 * properly -- and the address it routes to, so a visitor can bypass the form
 * entirely if they prefer email.
 *
 * The careers category deliberately routes to the Careers process rather than
 * this form: the master requires applications to go through the official
 * application flow.
 */

const DARK = "#003D6B";

const FIELDS = [
  { label: "Full name", required: true },
  { label: "Organization", required: true },
  { label: "Job title" },
  { label: "Email address", type: "email", required: true },
  { label: "Phone or WhatsApp", required: true, hint: "Include country code" },
  {
    label: "Sector",
    type: "select",
    options: ["Select a sector", "Banking and finance", "Education", "Government and public", "Enterprise", "Other"],
  },
  {
    label: "Inquiry type",
    type: "select",
    required: true,
    options: ["Select", ...INQUIRY_CATEGORIES.map((c) => c.title)],
  },
  {
    label: "Solution area",
    type: "select",
    options: ["Select if relevant", ...SOLUTIONS.map((s) => s.short), "Not sure yet"],
  },
  { label: "How can we help?", type: "textarea", wide: true, required: true, hint: "The more specific, the more useful our first reply will be" },
];

const CHANNELS = [
  {
    label: "Call or WhatsApp",
    lines: CONTACT.phones.map((p) => `<a href="tel:${p.tel}" class="hover:text-gold">${esc(p.value)}</a>`),
    note: CONTACT.phones[0].label,
    cta: { href: CONTACT.whatsapp, label: "Open WhatsApp" },
  },
  {
    label: "Email",
    lines: CONTACT.emails.map(
      (e) => `<a href="mailto:${e.value}" class="hover:text-gold">${esc(e.value)}</a>
            <span class="block font-mono text-[9px] uppercase tracking-widest text-steel">${esc(e.label)}</span>`,
    ),
    note: `Reply ${CONTACT.response.toLowerCase()}`,
  },
  {
    label: "Visit",
    lines: [CONTACT.office.map(esc).join("<br>")],
    note: "Please arrange a time before visiting",
    cta: { href: CONTACT.map, label: "Open in Maps" },
  },
];

export default {
  title: "Contact Edge Comm-Tech — Addis Ababa, Ethiopia",
  desc: "Contact Edge Comm-Tech for consultations, quotations, technical support, partnerships and training. BMA Plaza, Gerji, Addis Ababa.",
  body: `  <main>
    ${pageHead({
      eyebrow: "Contact",
      title: "Tell us what you need to get working",
      intro: "Whether you are scoping a program, comparing platforms, chasing a support issue or exploring a partnership — say which, and your message reaches the right team first time.",
      accent: "#0888c5",
      variant: "wash",
      ctas: `<div class="eg-rise mt-8 flex flex-wrap gap-3" style="--d:.24s">
          <a href="${CONTACT.whatsapp}" class="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">WhatsApp us</a>
          <a href="#form" class="rounded-full border border-rule px-6 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold">Send a message</a>
        </div>`,
    })}

    <!-- Channels -->
    <section class="border-b border-rule">
      <div class="mx-auto max-w-6xl px-6 py-14">
        <dl class="grid gap-px overflow-hidden rounded-3xl bg-rule lg:grid-cols-3">
          ${CHANNELS.map(
            (ch) => `<div class="eg-inview flex flex-col bg-paper-2 p-7">
            <dt class="font-mono text-[10px] uppercase tracking-widest text-gold">${ch.label}</dt>
            <dd class="mt-3 flex-1 space-y-2 text-sm leading-relaxed">
              ${ch.lines.map((l) => `<p>${l}</p>`).join("\n              ")}
            </dd>
            <dd class="mt-4 text-xs text-steel">${esc(ch.note)}</dd>
            ${ch.cta ? `<dd class="mt-4"><a href="${ch.cta.href}" class="font-mono text-[10px] uppercase tracking-widest text-gold">${ch.cta.label} &rarr;</a></dd>` : ""}
          </div>`,
          ).join("\n          ")}
        </dl>
      </div>
    </section>

    <!-- Inquiry categories: what to include, and where it goes -->
    <section class="mx-auto max-w-6xl px-6 py-16">
      ${sectionHead({
        eyebrow: "Where to direct it",
        title: "Seven kinds of inquiry, each with a route",
        intro: "Pick the one that fits. Each shows what to include so we can answer properly, and the address it reaches if you would rather email directly.",
      })}
      <ul class="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        ${INQUIRY_CATEGORIES.map(
          (c) => `<li class="eg-inview flex flex-col rounded-2xl border border-rule p-6 transition hover:border-gold">
          <h3 class="font-display text-lg leading-snug">${esc(c.title)}</h3>
          <p class="mt-2.5 flex-1 text-[13px] leading-relaxed text-ink/70">${esc(c.prompt)}</p>
          <div class="mt-5 border-t border-rule pt-4">
            ${
              c.slug === "careers"
                ? `<a href="careers-open-positions.html" class="font-mono text-[10px] uppercase tracking-widest text-gold">Use the careers process &rarr;</a>`
                : `<a href="mailto:${c.route}" class="font-mono text-[10px] uppercase tracking-widest text-gold">${esc(c.route)}</a>`
            }
          </div>
        </li>`,
        ).join("\n        ")}
      </ul>
    </section>

    <!-- Form and hours -->
    <section id="form" class="border-t border-rule bg-paper-2/40">
      <div class="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1fr_17rem]">
        <div class="min-w-0">
          ${sectionHead({ eyebrow: "Send a message", title: "One form, routed by inquiry type" })}
          <form class="mt-8 grid gap-5 sm:grid-cols-2">
            ${FIELDS.map(field).join("\n            ")}
            <div class="sm:col-span-2">
              <label class="flex items-start gap-3 text-xs leading-relaxed text-steel">
                <input type="checkbox" class="mt-0.5" disabled>
                <span>I accept the privacy notice and consent to Edge Comm-Tech using these details to respond to my inquiry.</span>
              </label>
            </div>
            <div class="sm:col-span-2">
              <button type="button" class="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white opacity-60" disabled>Send message</button>
            </div>
          </form>
          ${formNote}
        </div>

        <aside class="self-start lg:sticky lg:top-32">
          <div class="rounded-2xl bg-paper p-6">
            <p class="font-mono text-[10px] uppercase tracking-widest text-steel">Office hours</p>
            <dl class="mt-4 space-y-2.5">
              ${CONTACT.hours.map(
                ([d, h]) => `<div class="flex items-baseline justify-between gap-4 text-sm">
                <dt class="text-ink/75">${esc(d)}</dt>
                <dd class="shrink-0 ${/closed/i.test(h) ? "text-steel" : "font-mono text-[11px] text-ink/70"}">${esc(h)}</dd>
              </div>`,
              ).join("\n              ")}
            </dl>
          </div>

          <div class="mt-4 rounded-2xl p-6 text-white" style="background:${DARK}">
            <p class="font-mono text-[10px] uppercase tracking-widest text-white/55">Urgent support</p>
            <p class="mt-2.5 text-sm leading-relaxed text-white/80">
              For a live incident on a system we support, call first — do not wait on email.
            </p>
            <a href="tel:${CONTACT.phones[0].tel}" class="mt-4 inline-block font-display text-lg text-white hover:text-gold">${esc(CONTACT.emergency)}</a>
            <p class="mt-3 text-xs text-white/55">
              Then email <a href="mailto:${CONTACT.emails[1].value}" class="underline decoration-white/30 underline-offset-2">${CONTACT.emails[1].value}</a>
              with the project reference and impact.
            </p>
          </div>

          <a href="${CONTACT.map}" class="mt-4 block overflow-hidden rounded-2xl border border-rule transition hover:border-gold">
            <span class="relative block h-32" aria-hidden="true"
                  style="background-image:linear-gradient(#0888c514 1px,transparent 1px),linear-gradient(90deg,#0888c514 1px,transparent 1px);background-size:22px 22px">
              <span class="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_0_6px_rgb(196_138_90/0.22)]"></span>
            </span>
            <span class="block px-5 py-4">
              <span class="block font-display text-base">${esc(CONTACT.office[1])}</span>
              <span class="mt-0.5 block text-xs text-steel">${esc(CONTACT.office[2])}</span>
              <span class="mt-2 block font-mono text-[10px] uppercase tracking-widest text-gold">Open in Maps &rarr;</span>
            </span>
          </a>
        </aside>
      </div>
    </section>
  </main>`,
};
