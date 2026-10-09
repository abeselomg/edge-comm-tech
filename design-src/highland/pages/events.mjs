import { EVENTS } from "../editorial.mjs";
import { pageHead, crumb, closingCta, esc } from "../ui.mjs";

/*
 * Events and webinars.
 *
 * Upcoming sessions lead; the September session has already run and sits in a
 * past band with registration closed, rather than inviting a sign-up that
 * cannot happen. Status comes from the data, so this page stays correct as
 * dates pass without anyone editing it.
 */

const upcoming = EVENTS.filter((e) => e.status !== "past");
const past = EVENTS.filter((e) => e.status === "past");

const big = (e) => `<li><a href="event-${e.slug}.html"
          class="eg-inview group grid overflow-hidden rounded-3xl border border-rule transition hover:border-gold lg:grid-cols-[1fr_15rem]">
          <div class="p-8">
            <p class="font-mono text-[10px] uppercase tracking-widest text-gold">${esc(e.category)}</p>
            <h3 class="mt-3 font-display text-[clamp(1.35rem,2.5vw,2rem)] leading-tight group-hover:text-gold">${esc(e.headline)}</h3>
            <p class="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">${esc(e.intro)}</p>
            <p class="mt-5 text-xs text-steel">For ${esc(e.audience.toLowerCase())}</p>
            <span class="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white">${esc(e.action)} <span aria-hidden="true">&rarr;</span></span>
          </div>
          <dl class="grid content-start gap-px bg-rule">
            ${[
              ["Date", esc(e.date)],
              ["Format", esc(e.format)],
              [e.format === "Online" ? "Platform" : "Venue", esc(e.venue)],
            ]
              .map(
                ([k, v]) => `<div class="bg-paper-2 px-6 py-5">
              <dt class="font-mono text-[9px] uppercase tracking-widest text-steel">${k}</dt>
              <dd class="mt-1.5 text-sm leading-snug">${v}</dd>
            </div>`,
              )
              .join("\n            ")}
          </dl>
        </a></li>`;

export default {
  title: "Technology Events and Webinars — Edge Comm-Tech",
  desc: "Join Edge Comm-Tech webinars, briefings and exhibitions on enterprise AI, infrastructure, cybersecurity and digital transformation.",
  body: `  <main>
    ${pageHead({
      eyebrow: "Events and webinars",
      title: "Sessions worth your hour",
      intro: "Online discussions, institutional briefings and international exhibitions where our team shares what is working in practice — and answers the questions that follow.",
      accent: "#0888c5",
      variant: "beam",
      crumb: crumb([{ label: "Resources", href: "resources.html" }, { label: "Events" }]),
    })}

    <div class="mx-auto max-w-6xl px-6 py-16">
      ${
        upcoming.length
          ? `<section>
        <div class="flex flex-wrap items-baseline justify-between gap-4">
          <h2 class="font-display text-[clamp(1.4rem,2.6vw,2rem)]">Upcoming</h2>
          <p class="font-mono text-[10px] uppercase tracking-widest text-steel">${upcoming.length} session${upcoming.length > 1 ? "s" : ""}</p>
        </div>
        <ul class="mt-8 space-y-4">
          ${upcoming.map(big).join("\n          ")}
        </ul>
      </section>`
          : `<section class="rounded-3xl border border-rule p-10 text-center">
        <h2 class="font-display text-2xl">No sessions scheduled right now</h2>
        <p class="mx-auto mt-3 max-w-lg text-sm text-ink/70">Subscribe and we will let you know as soon as the next one is confirmed.</p>
        <a href="subscribe.html" class="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white">Get event updates</a>
      </section>`
      }

      ${
        past.length
          ? `<section class="mt-16">
        <div class="flex flex-wrap items-baseline justify-between gap-4">
          <h2 class="font-display text-[clamp(1.3rem,2.2vw,1.7rem)]">Already held</h2>
          <p class="font-mono text-[10px] uppercase tracking-widest text-steel">Materials added once approved</p>
        </div>
        <ul class="mt-6 divide-y divide-rule border-t border-rule">
          ${past
            .map(
              (e) => `<li><a href="event-${e.slug}.html" class="group grid gap-x-8 gap-y-2 py-6 lg:grid-cols-[11rem_1fr]">
            <span class="shrink-0">
              <span class="block font-mono text-[10px] uppercase tracking-widest text-steel">${esc(e.date)}</span>
              <span class="mt-1 block font-mono text-[9px] uppercase tracking-widest text-steel">${esc(e.format)}</span>
            </span>
            <span class="min-w-0">
              <span class="block font-display text-lg leading-snug group-hover:text-gold">${esc(e.title)}</span>
              <span class="mt-1.5 block max-w-2xl text-[13px] leading-relaxed text-ink/65">${esc(e.intro)}</span>
            </span>
          </a></li>`,
            )
            .join("\n          ")}
        </ul>
      </section>`
          : ""
      }

      <section class="mt-16 grid gap-3 sm:grid-cols-3">
        ${[
          ["Speak at an Edge session", "We invite client and partner practitioners to share real delivery experience.", "contact.html", "Propose a speaker"],
          ["Host a private briefing", "A session scoped to one institution's leadership team and its own priorities.", "contact.html", "Request a briefing"],
          ["Never miss one", "Occasional notices when a new session is confirmed. Nothing else.", "subscribe.html", "Subscribe"],
        ]
          .map(
            ([t, b, href, cta]) => `<div class="eg-inview flex flex-col rounded-2xl bg-paper-2 p-6">
          <h3 class="font-display text-lg leading-snug">${t}</h3>
          <p class="mt-2 flex-1 text-sm leading-relaxed text-ink/70">${b}</p>
          <a href="${href}" class="mt-4 font-mono text-[10px] uppercase tracking-widest text-gold">${cta} &rarr;</a>
        </div>`,
          )
          .join("\n        ")}
      </section>
    </div>

    ${closingCta({
      title: "Bring your questions",
      body: "Our sessions are built around the decisions institutions are actually facing. If you have a specific one, tell us before you attend.",
      primary: { href: "contact.html", label: "Talk to our experts" },
      secondary: { href: "resources.html", label: "Back to resources" },
    })}
  </main>`,
};
