import { CONTACT, SOLUTIONS } from "../content.mjs";
import { BLOG_CATEGORIES } from "../editorial.mjs";
import { pageHead, crumb, sectionHead, field, formNote, esc } from "../ui.mjs";

/*
 * Subscribe.
 *
 * A single-purpose page: the interest checkboxes are the solution families, so
 * a subscriber's preferences map onto the same taxonomy the site is organised
 * by rather than a separate invented list of topics.
 *
 * No frequency promise appears beyond what the content master approves, and
 * the consent line is explicit, because this collects personal data.
 */

const FIELDS = [
  { label: "Full name", required: true },
  { label: "Email address", type: "email", required: true },
  { label: "Organization", required: true },
  { label: "Job title" },
  {
    label: "Sector",
    type: "select",
    options: ["Select a sector", "Banking and finance", "Education", "Government and public", "Enterprise", "Other"],
  },
  { label: "Country", type: "select", options: ["Ethiopia", "Other"] },
];

export default {
  title: "Subscribe to Edge Comm-Tech Updates",
  desc: "Receive Edge Comm-Tech news, event invitations and technology insights relevant to your sector.",
  body: `  <main>
    ${pageHead({
      eyebrow: "Stay informed",
      title: "Updates worth opening",
      intro: "Occasional notes on new insights, upcoming sessions and company news — sent only to people who asked for them, and only when there is something to say.",
      accent: "#2ba8de",
      variant: "wash",
      crumb: crumb([{ label: "Resources", href: "resources.html" }, { label: "Subscribe" }]),
    })}

    <div class="mx-auto grid max-w-6xl gap-14 px-6 py-16 lg:grid-cols-[1fr_19rem]">
      <section class="min-w-0">
        ${sectionHead({ eyebrow: "Subscribe", title: "Tell us who you are and what interests you", accent: "#2ba8de" })}
        <form class="mt-8 grid gap-5 sm:grid-cols-2">
          ${FIELDS.map(field).join("\n          ")}

          <fieldset class="sm:col-span-2">
            <legend class="font-mono text-[10px] uppercase tracking-widest text-steel">Topics of interest</legend>
            <div class="mt-3 grid gap-2 sm:grid-cols-2">
              ${SOLUTIONS.map(
                (s) => `<label class="flex items-start gap-3 rounded-xl bg-paper-2 px-4 py-3 text-sm text-ink/75">
                <input type="checkbox" class="mt-1" disabled>
                <span>${esc(s.short)}</span>
              </label>`,
              ).join("\n              ")}
            </div>
          </fieldset>

          <fieldset class="sm:col-span-2">
            <legend class="font-mono text-[10px] uppercase tracking-widest text-steel">What to send</legend>
            <div class="mt-3 grid gap-2 sm:grid-cols-3">
              ${[
                ["Insights", "New articles as they are published."],
                ["Events", "Invitations to webinars and briefings."],
                ["Company news", "Milestones and announcements."],
              ]
                .map(
                  ([t, b]) => `<label class="flex flex-col gap-1 rounded-xl bg-paper-2 px-4 py-3">
                <span class="flex items-center gap-2.5 text-sm"><input type="checkbox" class="shrink-0" disabled><span>${t}</span></span>
                <span class="pl-[1.6rem] text-[11px] text-steel">${b}</span>
              </label>`,
                )
                .join("\n              ")}
            </div>
          </fieldset>

          <div class="sm:col-span-2">
            <label class="flex items-start gap-3 text-xs leading-relaxed text-steel">
              <input type="checkbox" class="mt-0.5" disabled>
              <span>I consent to Edge Comm-Tech using these details to send the updates I have selected. I understand
              I can unsubscribe at any time using the link in any message, or by emailing the team.</span>
            </label>
          </div>
          <div class="sm:col-span-2">
            <button type="button" class="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white opacity-60" disabled>Subscribe</button>
          </div>
        </form>
        ${formNote}
      </section>

      <aside class="self-start lg:sticky lg:top-32">
        <div class="rounded-2xl bg-paper-2 p-6">
          <p class="font-mono text-[10px] uppercase tracking-widest text-steel">What you can expect</p>
          <ul class="mt-4 space-y-3 text-sm leading-relaxed text-ink/75">
            <li class="flex items-start gap-2.5"><span class="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-gold"></span><span>Only the topics you select.</span></li>
            <li class="flex items-start gap-2.5"><span class="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-gold"></span><span>One unsubscribe click, honoured immediately.</span></li>
            <li class="flex items-start gap-2.5"><span class="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-gold"></span><span>Your details are never sold or passed to a third party.</span></li>
            <li class="flex items-start gap-2.5"><span class="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-gold"></span><span>No sales follow-up unless you ask for one.</span></li>
          </ul>
        </div>

        <div class="mt-4 rounded-2xl border border-rule p-6">
          <p class="font-mono text-[10px] uppercase tracking-widest text-steel">Prefer to just ask?</p>
          <p class="mt-2.5 text-sm leading-relaxed text-ink/70">
            Email <a href="mailto:${CONTACT.emails[0].value}" class="underline decoration-rule underline-offset-2 hover:text-gold">${CONTACT.emails[0].value}</a>
            and a member of the team will reply ${esc(CONTACT.response.toLowerCase())}.
          </p>
          <a href="contact.html" class="mt-4 inline-block font-mono text-[10px] uppercase tracking-widest text-gold">Contact page &rarr;</a>
        </div>

        <p class="mt-6 font-mono text-[10px] uppercase tracking-widest text-steel">We publish on</p>
        <ul class="mt-3 flex flex-wrap gap-1.5">
          ${BLOG_CATEGORIES.map(
            ([, label]) => `<li class="rounded-full bg-paper-2 px-2.5 py-1 text-[11px] text-ink/65">${esc(label)}</li>`,
          ).join("\n          ")}
        </ul>
      </aside>
    </div>
  </main>`,
};
