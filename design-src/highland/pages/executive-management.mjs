import { EXECUTIVE_ROLES, VALUES, CONTACT, JOURNEY } from "../content.mjs";
import { pageHead, crumb, sectionHead, closingCta, pending, esc } from "../ui.mjs";

/*
 * Executive management.
 *
 * The content master lists five executive roles and their responsibilities,
 * but no names, biographies or portraits have been approved for publication.
 *
 * So this page publishes the structure honestly: each role, what it owns, and
 * a clearly marked placeholder where the person will go. The alternative --
 * inventing a leadership team, or stock portraits with job titles -- would be
 * worse than an empty frame that says what it is waiting for.
 *
 * When Edge supplies names, photographs and biographies, each card gains
 * them and the pending marker comes off. No layout change is needed.
 */

const DARK = "#003D6B";

/* Role titles are all the master publishes. There are no approved
   responsibilities, biographies or portraits, so the card carries the title, a
   monogram frame, and an explicit marker for what is still to come. */
const initials = (title) =>
  title
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 3)
    .map((w) => w[0])
    .join("");

const card = (title, i) => `<article class="eg-inview flex items-center gap-5 rounded-3xl border border-rule p-7 transition hover:border-gold">
          <span class="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-paper-2 font-display text-xl text-steel/60" aria-hidden="true">${initials(title)}</span>
          <div class="min-w-0">
            <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Role ${String(i + 1).padStart(2, "0")}</p>
            <h2 class="mt-1 font-display text-xl leading-snug">${esc(title)}</h2>
            <p class="mt-3">${pending("Name and biography pending")}</p>
          </div>
        </article>`;

export default {
  title: "Executive Management — Edge Comm-Tech",
  desc: "The executive leadership structure of Edge Communication Technologies PLC and the responsibilities each role carries.",
  body: `  <main>
    ${pageHead({
      eyebrow: "Leadership",
      title: "Executive management",
      intro: "Edge Comm-Tech is led by an executive team accountable for strategy, engineering, delivery, commercial performance and client outcomes.",
      accent: "#056a9a",
      variant: "rule",
      crumb: crumb([{ label: "About", href: "about.html" }, { label: "Executive management" }]),
      meta: `<p class="eg-rise mt-6">${pending("Names, biographies and portraits pending from Edge")}</p>`,
    })}

    <section class="mx-auto max-w-6xl px-6 py-16">
      ${sectionHead({
        eyebrow: "Structure",
        title: `${EXECUTIVE_ROLES.length} executive roles`,
        intro: "The roles accountable for strategy, engineering, delivery, commercial performance and client outcomes.",
        accent: "#056a9a",
      })}
      <div class="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        ${EXECUTIVE_ROLES.map(card).join("\n        ")}
      </div>
      <p class="mt-8 max-w-3xl rounded-2xl bg-paper-2 px-6 py-5 text-xs leading-relaxed text-steel">
        Names, biographies and portraits are published once Edge Comm-Tech approves them for release. In the meantime,
        introductions to the relevant executive are arranged directly for clients, partners and tender committees.
      </p>
    </section>

    <!-- How leadership shows up in the work -->
    <section class="relative overflow-hidden" style="background:${DARK}">
      <span class="pointer-events-none absolute -right-40 -top-32 h-[36rem] w-[36rem] rounded-full"
            style="background:radial-gradient(circle,rgb(255 255 255/0.06),transparent 70%)" aria-hidden="true"></span>
      <div class="relative mx-auto max-w-6xl px-6 py-20 text-white">
        <p class="font-mono text-[10px] uppercase tracking-widest text-white/55">What leadership is held to</p>
        <h2 class="mt-3 max-w-3xl font-display text-[clamp(1.6rem,3.2vw,2.5rem)] leading-tight">The values the executive team is accountable for</h2>
        <div class="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          ${VALUES.map(
            (v) => `<div class="eg-inview border-t border-white/15 pt-5">
            <h3 class="font-display text-lg">${esc(v.title)}</h3>
            <p class="mt-2 text-sm leading-relaxed text-white/70">${esc(v.body)}</p>
          </div>`,
          ).join("\n          ")}
        </div>
      </div>
    </section>

    <!-- A little company context, so the page is not only an empty roster -->
    <section class="mx-auto max-w-5xl px-6 py-20">
      ${sectionHead({
        eyebrow: "Context",
        title: "The company this team leads",
        accent: "#056a9a",
      })}
      <ol class="relative mt-10 border-l border-rule pl-8">
        ${JOURNEY.slice(-4)
          .map(
            (m, i, arr) => `<li class="eg-inview relative pb-8 last:pb-0">
          <span class="absolute -left-[2.3rem] top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-paper ${i === arr.length - 1 ? "bg-gold" : "bg-gold/40"}"></span>
          <p class="font-mono text-[10px] uppercase tracking-widest text-gold">${esc(m.when)}</p>
          <p class="mt-1.5 max-w-2xl leading-relaxed text-ink/80">${esc(m.what)}</p>
        </li>`,
          )
          .join("\n        ")}
      </ol>
      <p class="mt-8">
        <a href="about.html" class="inline-block rounded-full border border-rule px-6 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold">Read the full company story</a>
      </p>
    </section>

    ${closingCta({
      title: "Need to reach the executive team?",
      body: `For partnership discussions, institutional engagements or tender matters, email <a href="mailto:${CONTACT.emails[0].value}" class="underline decoration-rule underline-offset-2 hover:text-gold">${CONTACT.emails[0].value}</a> and your message will be directed to the relevant executive.`,
      primary: { href: "contact.html", label: "Contact Edge Comm-Tech" },
      secondary: { href: "careers.html", label: "Careers at Edge" },
      accent: "#056a9a",
    })}
  </main>`,
};
