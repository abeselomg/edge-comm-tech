import { SERVICES, DELIVERY, DIFFERENTIATORS, ACCENT } from "../content.mjs";
import { SERVICE_DETAIL } from "../detail.mjs";
import { pageHead, sectionHead, closingCta, esc } from "../ui.mjs";

/*
 * Professional services overview.
 *
 * The solutions overview is a catalogue, so this page is a sequence: the five
 * delivery stages run across the top as a rail, and the six services are then
 * read as chapters, alternating side so the page does not scan as six more
 * cards. Every service headline and fit sentence comes from SERVICE_DETAIL --
 * the same text the service page itself uses -- so the overview can never
 * describe a service differently from the page it links to.
 */

const DARK = "#003D6B";

export default {
  title: "Professional Technology Services in Ethiopia — Edge Comm-Tech",
  desc: "Advisory, procurement, implementation, project management, managed support and training services from Edge Comm-Tech across the full technology lifecycle.",
  body: `  <main>
    ${pageHead({
      eyebrow: "Professional services",
      title: "Services that turn technology into operational value",
      intro: "Technology delivers value when it is correctly specified, properly sourced, carefully implemented, well managed, reliably supported and genuinely understood by the people who use it. Edge Comm-Tech provides services across that entire lifecycle.",
      accent: "#056a9a",
      variant: "beam",
      ctas: `<div class="eg-rise mt-8 flex flex-wrap gap-3" style="--d:.24s">
          <a href="contact.html" class="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">Request a consultation</a>
          <a href="solutions.html" class="rounded-full border border-rule px-6 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold">See the solution portfolio</a>
        </div>`,
    })}

    <!-- Lifecycle rail: the five stages, read left to right. The services
         below are the work inside these stages. -->
    <section class="border-b border-rule bg-paper-2/50">
      <div class="mx-auto max-w-6xl px-6 py-14">
        <p class="font-mono text-[10px] uppercase tracking-widest text-gold">The lifecycle we work across</p>
        <ol class="mt-7 grid gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          ${DELIVERY.map(
            (s, i) => `<li class="eg-inview relative pr-6">
            <span class="flex items-center gap-3">
              <span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold/15 font-mono text-[10px] text-gold">${s.n}</span>
              ${i < DELIVERY.length - 1 ? `<span class="hidden h-px flex-1 bg-rule lg:block"></span>` : ""}
            </span>
            <h3 class="mt-3 font-display text-lg">${esc(s.title)}</h3>
            <p class="mt-1.5 text-[13px] leading-relaxed text-ink/65">${esc(s.body)}</p>
          </li>`,
          ).join("\n          ")}
        </ol>
      </div>
    </section>

    <!-- Six chapters, alternating. Each one carries the service's own approved
         headline, so the overview and the detail page always agree. -->
    <div class="mx-auto max-w-6xl px-6">
      ${SERVICES.map((s, i) => {
        const d = SERVICE_DETAIL[s.slug];
        const c = ACCENT[s.slug];
        const flip = i % 2 === 1;
        return `<section class="grid items-start gap-10 border-t border-rule py-16 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div class="eg-inview min-w-0 ${flip ? "lg:order-2" : ""}">
          <p class="font-mono text-[10px] uppercase tracking-widest" style="color:${c}">Service ${String(s.n).padStart(2, "0")} &middot; ${esc(s.short)}</p>
          <h2 class="mt-3 font-display text-[clamp(1.5rem,2.8vw,2.2rem)] leading-tight">${esc(d.headline)}</h2>
          <p class="mt-4 leading-relaxed text-ink/75">${esc(d.intro)}</p>
          ${d.fit ? `<p class="mt-4 border-l-2 pl-4 text-sm leading-relaxed text-ink/65" style="border-color:${c}66">${esc(d.fit)}</p>` : ""}
          <a href="service-${s.slug}.html" class="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest" style="color:${c}">
            ${esc(s.title)} <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
        <div class="eg-inview ${flip ? "lg:order-1" : ""}">
          <div class="rounded-3xl p-7" style="background:${c}0d">
            <p class="font-mono text-[10px] uppercase tracking-widest text-steel">What this includes</p>
            <ul class="mt-4 grid gap-2 sm:grid-cols-2">
              ${d.capabilities
                .map(
                  (x) => `<li class="flex items-start gap-2.5 rounded-xl bg-paper px-3.5 py-2.5 text-[13px] leading-snug text-ink/80">
                <span class="mt-[0.4rem] h-1 w-1 shrink-0 rounded-full" style="background:${c}"></span><span>${esc(x.title)}</span>
              </li>`,
                )
                .join("\n              ")}
            </ul>
            <p class="mt-4 text-[11px] text-steel">Full scope on the ${esc(s.short.toLowerCase())} page.</p>
          </div>
        </div>
      </section>`;
      }).join("\n      ")}
    </div>

    <!-- Why Edge, on dark. The only dark band on the page, so it lands. -->
    <section class="relative overflow-hidden" style="background:${DARK}">
      <span class="pointer-events-none absolute -right-40 -top-40 h-[40rem] w-[40rem] rounded-full"
            style="background:radial-gradient(circle,rgb(255 255 255/0.07),transparent 70%)" aria-hidden="true"></span>
      <div class="relative mx-auto max-w-6xl px-6 py-20 text-white">
        <p class="font-mono text-[10px] uppercase tracking-widest text-white/55">Why Edge Comm-Tech</p>
        <h2 class="mt-3 max-w-3xl font-display text-[clamp(1.7rem,3.2vw,2.6rem)] leading-tight">One accountable partner, from first assessment to long-term support</h2>
        <div class="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          ${DIFFERENTIATORS.map(
            (d, i) => `<div class="eg-inview border-t border-white/15 pt-5">
            <span class="font-mono text-[10px] text-white/40">${String(i + 1).padStart(2, "0")}</span>
            <h3 class="mt-1.5 font-display text-xl">${esc(d.title)}</h3>
            <p class="mt-2 text-sm leading-relaxed text-white/70">${esc(d.body)}</p>
          </div>`,
          ).join("\n          ")}
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-4xl px-6 py-20">
      ${sectionHead({
        eyebrow: "Engagement",
        title: "Scoped to the work in front of you",
        intro: "A service can support a single focused requirement or an integrated multi-technology program. Responsibilities, deliverables, acceptance criteria and support arrangements are agreed in writing before mobilization.",
      })}
      <div class="mt-9 grid gap-3 sm:grid-cols-3">
        ${[
          ["A single service", "One defined piece of work — an assessment, a procurement, a training program — with its own scope and acceptance."],
          ["A full delivery", "Advisory through support on one solution family, managed under a single project governance structure."],
          ["A multi-technology program", "Several solution families coordinated together, with one accountable delivery team across all of them."],
        ]
          .map(
            ([t, b]) => `<div class="eg-inview rounded-2xl border border-rule p-6 transition hover:border-gold">
          <h3 class="font-display text-lg">${t}</h3>
          <p class="mt-2 text-sm leading-relaxed text-ink/70">${b}</p>
        </div>`,
          )
          .join("\n        ")}
      </div>
    </section>

    ${closingCta({
      title: "Let's scope the work",
      body: "Tell us the outcome you need and the environment you are working in. We will come back with a practical service scope and a delivery approach.",
      primary: { href: "contact.html", label: "Request a consultation" },
      secondary: { href: "projects.html", label: "See delivered projects" },
      accent: "#056a9a",
    })}
  </main>`,
};
