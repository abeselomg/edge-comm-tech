import {
  COMPANY, IMPACT, IMPACT_SUPPORT, SOLUTIONS, PRIORITIES, INDUSTRIES,
  PROJECTS, DIFFERENTIATORS, DELIVERY, PARTNERS, CLIENTS, CLIENT_SECTORS,
  ACCENT, CONTACT,
} from "../content.mjs";
import { POSTS } from "../editorial.mjs";
import { mark, esc } from "../ui.mjs";

/*
 * The homepage, following the fifteen-section order the content master sets
 * out in Module 01: hero, impact, who we are, solutions, technology
 * priorities, industries, projects, why us, delivery, partners, clients,
 * success story, insights, careers, final call to action.
 *
 * The hero keeps the approved Highland device -- the sun disk over a horizon,
 * and the offset card at its right -- because that is the look the client
 * signed off. Everything inside it is the approved copy.
 *
 * The priorities band uses Edge's own dark blue (#003D6B) rather than
 * Highland's ink. The content master asks for a dark-blue section there, and
 * it is the one place the approved palette and the approved design agree.
 */

const DARK = "#003D6B";

const MARK = {
  "software-ai-digital": '<path d="M12 3v3m0 12v3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M3 12h3m12 0h3M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1"/><circle cx="12" cy="12" r="3.2"/>',
  "enterprise-network": '<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="18" r="2.2"/><circle cx="19" cy="18" r="2.2"/><path d="M12 7.2v4.3m0 0L6.6 16m5.4-4.5L17.4 16"/>',
  "system-cloud": '<path d="M7 18a4 4 0 0 1-.5-7.97 5.5 5.5 0 0 1 10.6-1.4A3.8 3.8 0 0 1 17.5 18z"/><path d="M12 12v5m0 0-2-2m2 2 2-2"/>',
  "datacenter-facility-it-infrastructure": '<rect x="4" y="3" width="16" height="6" rx="1.5"/><rect x="4" y="11" width="16" height="6" rx="1.5"/><path d="M7 6h.01M7 14h.01M4 19v2M20 19v2"/>',
  cybersecurity: '<path d="M12 3 5 6v6c0 4.2 3 7.4 7 9 4-1.6 7-4.8 7-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  "power-technology": '<path d="M13 2 4.5 13H11l-1 9 8.5-11H12z"/>',
  "broadcast-satellite": '<circle cx="12" cy="12" r="2.4"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4m8.4-8.4a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2m14.2-14.2a10 10 0 0 1 0 14.2"/>',
};

const featured = PROJECTS.filter((p) => p.featured).sort((a, b) => a.featured - b.featured);
const story = PROJECTS.find((p) => p.slug === "bahir-dar-university-smart-classrooms");

const solutionCard = (s) => `<a href="solution-${s.slug}.html"
          class="eg-inview group relative flex flex-col overflow-hidden rounded-2xl bg-paper-2 p-6 shadow-[0_18px_40px_-32px_rgb(28_36_48/0.55)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_52px_-28px_rgb(8_136_197/0.5)]">
          <span class="absolute inset-x-0 top-0 h-1" style="background:linear-gradient(90deg,${ACCENT[s.slug]},${ACCENT[s.slug]}22)"></span>
          <span class="grid h-12 w-12 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style="background:${ACCENT[s.slug]}16;color:${ACCENT[s.slug]}">
            <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6"
                 stroke-linecap="round" stroke-linejoin="round">${MARK[s.slug]}</svg>
          </span>
          <span class="mt-4 font-mono text-[10px] uppercase tracking-widest" style="color:${ACCENT[s.slug]}">Solution ${String(s.n).padStart(2, "0")}</span>
          <h3 class="mt-1 font-display text-2xl leading-snug group-hover:text-gold">${esc(s.title)}</h3>
          <p class="mt-2 text-sm leading-relaxed text-ink/70">${esc(s.blurb)}</p>
          <span class="mt-4 font-mono text-[10px] uppercase tracking-widest" style="color:${ACCENT[s.slug]}">Explore &rarr;</span>
        </a>`;

export default {
  title: "ICT Solutions and Digital Transformation in Ethiopia — Edge Comm-Tech",
  desc: "Edge Comm-Tech delivers enterprise networks, cloud and systems, datacenters, cybersecurity, software, AI, power, and broadcast solutions across Ethiopia and beyond.",
  body: `  <main>
    <!-- 01 Hero ------------------------------------------------------- -->
    <section class="relative overflow-hidden bg-paper">
      <div class="sun-disk" aria-hidden="true"></div>
      <div class="horizon" aria-hidden="true"></div>
      <div class="relative mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1fr_18rem] md:py-32">
        <div>
          <p class="eg-rise font-mono text-[11px] uppercase tracking-[0.28em] text-gold">Addis Ababa &middot; Serving Ethiopia and beyond</p>
          <h1 class="eg-rise mt-5 font-display text-[clamp(2.4rem,6.4vw,4.9rem)] leading-[0.95]" style="--d:.06s">
            Accelerating Africa's digital transformation
          </h1>
          <p class="eg-rise mt-8 max-w-xl text-lg leading-relaxed text-ink/75" style="--d:.14s">
            Edge Comm-Tech designs, delivers, and supports secure, scalable, intelligent, and future-ready
            technology solutions for financial institutions, government organizations, educational institutions,
            and enterprises.
          </p>
          <p class="eg-rise mt-4 max-w-xl leading-relaxed text-ink/65" style="--d:.2s">
            From enterprise networks and AI-ready infrastructure to cloud, cybersecurity, software, intelligent
            automation, power, and broadcast technologies, we help organizations modernize with confidence.
          </p>
          <div class="eg-rise mt-10 flex flex-wrap items-center gap-3" style="--d:.28s">
            <a href="solutions.html" class="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-16px_rgb(8_136_197/0.9)] transition hover:-translate-y-0.5">Explore our solutions</a>
            <a href="contact.html" class="rounded-full border border-gold px-6 py-3 text-sm font-semibold text-gold transition hover:-translate-y-0.5">Talk to our experts</a>
            <a href="projects.html" class="text-sm text-ink/70 underline decoration-rule underline-offset-4 transition hover:text-gold">View our projects</a>
          </div>
        </div>
        <aside class="eg-pop relative z-10 self-end rounded-3xl bg-paper-2 p-6 shadow-[0_20px_50px_-24px_rgb(8_136_197_/_0.45)]" style="--d:.34s">
          <p class="font-mono text-[10px] uppercase tracking-[0.25em] text-gold">Headquarters</p>
          <p class="mt-3 font-display text-2xl leading-tight">${esc(COMPANY.positioning)}</p>
          <p class="mt-3 text-sm text-ink/70">${esc(CONTACT.office[1])}, ${esc(CONTACT.office[2])}.</p>
          <a href="contact.html" class="mt-5 inline-block text-sm text-gold">Call or write &rarr;</a>
        </aside>
      </div>
    </section>

    <!-- 02 Impact ------------------------------------------------------ -->
    <section class="border-y border-rule bg-paper-2">
      <div class="mx-auto max-w-6xl px-6 py-12">
        <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Trusted execution, measurable impact</p>
        <dl class="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          ${IMPACT.map(
            (m) => `<div class="eg-inview">
            <dt class="font-display text-[clamp(2.2rem,4vw,3.2rem)] leading-none text-gold">${esc(m.figure)}
              <span class="ml-1 font-sans text-base font-normal text-ink/60">${esc(m.unit)}</span></dt>
            <dd class="mt-2 text-sm leading-snug text-ink/70">${esc(m.line)}</dd>
          </div>`,
          ).join("\n          ")}
        </dl>
        <p class="mt-8 border-t border-rule pt-6 font-display text-lg text-ink/80">${esc(IMPACT_SUPPORT)}</p>
      </div>
    </section>

    <!-- 03 Who we are -------------------------------------------------- -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <div class="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Who we are</p>
          <h2 class="mt-3 font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-tight">
            Your technology partner from edge to core, core to cloud
          </h2>
          <p class="mt-6 leading-relaxed text-ink/75">
            ${esc(COMPANY.legal)}, known as ${esc(COMPANY.short)}, is an Ethiopian technology solutions and
            systems-integration company established in 2018.
          </p>
          <p class="mt-4 leading-relaxed text-ink/75">
            We combine engineering expertise, strategic consulting, global technology partnerships, and dependable
            project execution to solve complex business and infrastructure challenges. Our capabilities span the
            complete technology lifecycle, from assessment and solution design to supply, implementation,
            integration, training, support, and continuous improvement.
          </p>
          <p class="mt-4 leading-relaxed text-ink/75">
            We do more than deploy technology. We help organizations build resilient operations, secure critical
            information, improve service delivery, unlock institutional knowledge, and create the digital
            foundations required for long-term growth.
          </p>
          <a href="about.html" class="mt-7 inline-block rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold">Discover Edge Comm-Tech</a>
        </div>
        <div class="grid content-start gap-3">
          <div class="eg-inview rounded-2xl bg-paper-2 p-6">
            <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Mission</p>
            <p class="mt-2 font-display text-xl">${esc(COMPANY.mission)}</p>
            <p class="mt-2 text-sm text-ink/70">${esc(COMPANY.missionBody)}</p>
          </div>
          <div class="eg-inview rounded-2xl bg-paper-2 p-6">
            <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Vision</p>
            <p class="mt-2 text-sm leading-relaxed text-ink/75">${esc(COMPANY.vision)}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 04 Solutions ---------------------------------------------------- -->
    <section id="solutions" class="border-t border-rule bg-paper-2/40">
      <div class="mx-auto max-w-6xl px-6 py-20">
        <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Our solutions</p>
        <h2 class="mt-3 max-w-3xl font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-tight">
          One trusted partner, complete technology capabilities
        </h2>
        <p class="mt-5 max-w-2xl text-ink/75">
          Modern organizations need technology that works as one connected ecosystem. Edge Comm-Tech brings
          together infrastructure, connectivity, security, software, artificial intelligence, power, and
          specialized technologies to deliver integrated solutions built around each client's priorities.
        </p>
        <div class="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          ${SOLUTIONS.map(solutionCard).join("\n        ")}
          <a href="services.html" class="eg-inview group flex flex-col justify-between rounded-2xl border border-dashed border-gold/40 bg-transparent p-6 transition hover:-translate-y-1 hover:border-gold">
            <span>
              <span class="font-mono text-[10px] uppercase tracking-widest text-gold">And six professional services</span>
              <h3 class="mt-2 font-display text-2xl leading-snug group-hover:text-gold">Advisory, procurement, implementation, project management, support and training</h3>
            </span>
            <span class="mt-4 font-mono text-[10px] uppercase tracking-widest text-gold">See the service model &rarr;</span>
          </a>
        </div>
      </div>
    </section>

    <!-- 05 Technology priorities ---------------------------------------- -->
    <section class="relative overflow-hidden text-paper" style="background:${DARK}">
      <span class="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true"
            style="background-image:linear-gradient(#ffffff22 1px,transparent 1px),linear-gradient(90deg,#ffffff22 1px,transparent 1px);background-size:64px 64px"></span>
      <div class="relative mx-auto max-w-6xl px-6 py-20">
        <p class="font-mono text-[10px] uppercase tracking-widest text-[#10C7FF]">Building what comes next</p>
        <h2 class="mt-3 max-w-3xl font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-tight text-paper">
          Technology designed for today and ready for tomorrow
        </h2>
        <p class="mt-5 max-w-2xl text-paper/70">
          Organizations need trusted foundations that support artificial intelligence, automation, secure cloud
          adoption, expanding data requirements, connected operations, and sustainable growth.
        </p>
        <div class="mt-12 grid gap-px overflow-hidden rounded-2xl bg-paper/15 md:grid-cols-2 lg:grid-cols-3">
          ${PRIORITIES.map(
            (p) => `<article class="eg-inview p-7" style="background:${DARK}">
            <h3 class="font-display text-xl text-paper">${esc(p.title)}</h3>
            <p class="mt-2.5 text-sm leading-relaxed text-paper/65">${esc(p.body)}</p>
          </article>`,
          ).join("\n          ")}
        </div>
        <a href="contact.html" class="mt-10 inline-block rounded-full bg-[#10C7FF] px-6 py-3 text-sm font-semibold text-[#003D6B] transition hover:-translate-y-0.5">Modernize your technology environment</a>
      </div>
    </section>

    <!-- 06 Industries ---------------------------------------------------- -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Industry expertise</p>
      <h2 class="mt-3 max-w-3xl font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-tight">
        Solutions built around sector-specific priorities
      </h2>
      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        ${INDUSTRIES.map(
          (s) => `<article class="eg-inview rounded-2xl border border-rule p-6 transition hover:border-gold">
          <h3 class="font-display text-xl">${esc(s.title)}</h3>
          <p class="mt-2.5 text-sm leading-relaxed text-ink/70">${esc(s.body)}</p>
        </article>`,
        ).join("\n        ")}
      </div>
    </section>

    <!-- 07 Projects ------------------------------------------------------ -->
    <section class="border-y border-rule bg-paper-2/40">
      <div class="mx-auto max-w-6xl px-6 py-20">
        <div class="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Proven delivery</p>
            <h2 class="mt-3 max-w-2xl font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-tight">
              Technology creating real institutional impact
            </h2>
          </div>
          <a href="projects.html" class="rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold">Explore the project portfolio</a>
        </div>
        <div class="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          ${featured
            .map(
              (p) => `<a href="project-${p.slug}.html" class="eg-inview group flex flex-col rounded-2xl bg-paper-2 p-6 transition hover:-translate-y-1">
            <span class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-steel">
              <span class="h-1.5 w-1.5 rounded-full bg-gold"></span>${esc(p.sector)} &middot; ${esc(p.year)}
            </span>
            <h3 class="mt-3 font-display text-xl leading-snug group-hover:text-gold">${esc(p.title)}</h3>
            <p class="mt-2 flex-1 text-sm leading-relaxed text-ink/70">${esc(p.summary)}</p>
            <span class="mt-4 font-mono text-[10px] uppercase tracking-widest text-gold">View project &rarr;</span>
          </a>`,
            )
            .join("\n          ")}
        </div>
      </div>
    </section>

    <!-- 08 Why Edge Comm-Tech -------------------------------------------- -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Why choose us</p>
      <h2 class="mt-3 max-w-3xl font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-tight">
        Local understanding, global technology, accountable delivery
      </h2>
      <div class="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
        ${DIFFERENTIATORS.map(
          (d, i) => `<div class="eg-inview border-t border-rule pt-5">
          <span class="font-mono text-[10px] text-gold">${String(i + 1).padStart(2, "0")}</span>
          <h3 class="mt-1.5 font-display text-xl">${esc(d.title)}</h3>
          <p class="mt-2 text-sm leading-relaxed text-ink/70">${esc(d.body)}</p>
        </div>`,
        ).join("\n        ")}
      </div>
    </section>

    <!-- 09 Delivery approach ---------------------------------------------- -->
    <section class="border-t border-rule">
      <div class="mx-auto max-w-6xl px-6 py-20">
        <p class="font-mono text-[10px] uppercase tracking-widest text-gold">How we deliver</p>
        <h2 class="mt-3 max-w-3xl font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-tight">
          From business challenge to operational value
        </h2>
        <ol class="mt-12 grid gap-px overflow-hidden rounded-2xl bg-rule md:grid-cols-3 lg:grid-cols-5">
          ${DELIVERY.map(
            (s) => `<li class="eg-inview bg-paper-2 p-6">
            <span class="font-display text-3xl text-gold/30">${String(s.n).padStart(2, "0")}</span>
            <h3 class="mt-2 font-display text-lg">${esc(s.title)}</h3>
            <p class="mt-2 text-sm leading-relaxed text-ink/70">${esc(s.body)}</p>
          </li>`,
          ).join("\n          ")}
        </ol>
      </div>
    </section>

    <!-- 10 Partners -------------------------------------------------------- -->
    <section id="partners" class="border-t border-rule bg-paper-2/40">
      <div class="mx-auto max-w-6xl px-6 py-20">
        <div class="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Global technology ecosystem</p>
            <h2 class="mt-3 max-w-2xl font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-tight">
              World-class technologies, locally delivered
            </h2>
            <p class="mt-5 max-w-2xl text-ink/75">
              Technologies are selected according to suitability, interoperability, scalability, security,
              lifecycle value, and long-term support.
            </p>
          </div>
          <a href="partners.html" class="rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold">View our technology partners</a>
        </div>
        <ul class="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-rule sm:grid-cols-3 lg:grid-cols-6">
          ${PARTNERS.filter((p) => p.featured)
            .map(
              (p) => `<li class="grid h-24 place-items-center bg-paper-2 px-4">${mark(p, { h: "h-12" })}</li>`,
            )
            .join("\n          ")}
        </ul>
      </div>
    </section>

    <!-- 11 Clients ---------------------------------------------------------- -->
    <section id="clients" class="mx-auto max-w-6xl px-6 py-20">
      <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Trusted across critical sectors</p>
      <h2 class="mt-3 max-w-3xl font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-tight">
        Supporting institutions that move Ethiopia forward
      </h2>
      <div class="mt-10 space-y-8">
        ${CLIENT_SECTORS.map(([key, label]) => {
          const group = CLIENTS.filter((c) => c.sector === key);
          return `<div class="eg-inview">
          <p class="font-mono text-[10px] uppercase tracking-widest text-steel">${esc(label)}</p>
          <ul class="mt-3 grid gap-px overflow-hidden rounded-2xl bg-rule sm:grid-cols-2 lg:grid-cols-4">
            ${group
              .map(
                (c) => `<li class="grid h-20 place-items-center bg-paper-2 px-4">${mark(c, { h: "h-10", dir: "clients" })}</li>`,
              )
              .join("\n            ")}
          </ul>
        </div>`;
        }).join("\n        ")}
      </div>
      <a href="clients.html" class="mt-9 inline-block rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold">Meet our clients</a>
    </section>

    <!-- 12 Success story ------------------------------------------------------ -->
    <section class="border-y border-rule bg-paper-2/40">
      <div class="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1fr_1fr]">
        <div>
          <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Success story</p>
          <h2 class="mt-3 font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-tight">
            Transforming learning through smart classroom technology
          </h2>
          <p class="mt-6 leading-relaxed text-ink/75">
            Edge Comm-Tech supported Bahir Dar University in creating connected, technology-enabled learning
            environments designed to improve presentation, collaboration, engagement, and access to digital
            educational resources.
          </p>
          <p class="mt-4 leading-relaxed text-ink/75">
            The solution brought together interactive displays, computing, collaboration technologies, classroom
            infrastructure, implementation services, and user enablement within one coordinated project.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a href="project-${story.slug}.html" class="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5">Read the success story</a>
            <a href="solution-software-ai-digital.html" class="rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold">Explore education solutions</a>
          </div>
        </div>
        <dl class="grid content-start gap-px self-start overflow-hidden rounded-2xl bg-rule sm:grid-cols-2">
          ${[
            ["Client", story.client],
            ["Sector", story.sectorFull],
            ["Completion", story.year],
            ["Status", "Completed"],
          ]
            .map(
              ([k, v]) => `<div class="bg-paper-2 px-6 py-5">
            <dt class="font-mono text-[9px] uppercase tracking-widest text-steel">${k}</dt>
            <dd class="mt-1.5 font-display text-lg leading-snug">${esc(v)}</dd>
          </div>`,
            )
            .join("\n          ")}
        </dl>
      </div>
    </section>

    <!-- 13 Insights ------------------------------------------------------------ -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Insights</p>
          <h2 class="mt-3 max-w-2xl font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-tight">
            Ideas, updates and technology perspectives
          </h2>
        </div>
        <a href="resources.html" class="rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold">Visit our resources</a>
      </div>
      <div class="mt-10 grid gap-4 md:grid-cols-3">
        ${POSTS.slice(0, 3)
          .map(
            (p) => `<a href="solution-${p.to}.html${p.anchor ? `#${p.anchor}` : ""}" class="eg-inview group flex flex-col rounded-2xl border border-rule p-6 transition hover:-translate-y-1 hover:border-gold">
          <span class="font-mono text-[10px] uppercase tracking-widest" style="color:${ACCENT[p.to]}">Insight</span>
          <h3 class="mt-2 font-display text-xl leading-snug group-hover:text-gold">${esc(p.title)}</h3>
          <p class="mt-2 flex-1 text-sm leading-relaxed text-ink/70">${esc(p.paras[0].slice(0, 150))}&hellip;</p>
          <span class="mt-4 font-mono text-[10px] uppercase tracking-widest text-gold">Read more &rarr;</span>
        </a>`,
          )
          .join("\n        ")}
      </div>
    </section>

    <!-- 14 Careers --------------------------------------------------------------- -->
    <section class="border-t border-rule">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 px-6 py-16">
        <div class="max-w-2xl">
          <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Grow with us</p>
          <h2 class="mt-3 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-tight">
            Build skills, create impact, shape the digital future
          </h2>
          <p class="mt-4 text-ink/75">
            We believe Africa's digital transformation depends on talented, curious, and accountable people.
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <a href="careers.html" class="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5">Explore careers</a>
          <a href="careers-e-academy.html" class="rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold">Discover E-Academy</a>
        </div>
      </div>
    </section>

    <!-- 15 Final CTA --------------------------------------------------------------- -->
    <section class="relative overflow-hidden border-t border-rule text-paper" style="background:${DARK}">
      <span class="pointer-events-none absolute -right-20 -top-28 h-[30rem] w-[30rem] rounded-full" aria-hidden="true"
            style="background:radial-gradient(circle,#10C7FF33,transparent 70%)"></span>
      <div class="relative mx-auto max-w-6xl px-6 py-20">
        <p class="font-mono text-[10px] uppercase tracking-widest text-[#10C7FF]">Ready to build what's next</p>
        <h2 class="mt-3 max-w-3xl font-display text-[clamp(1.9rem,3.6vw,3rem)] leading-tight text-paper">
          Whether you are modernizing infrastructure or adopting AI, our team is ready to help
        </h2>
        <p class="mt-5 max-w-2xl text-paper/70">
          Strengthening cybersecurity, moving toward cloud, digitizing operations, improving business continuity,
          or developing a new technology environment &mdash; tell us about your organization, current challenge,
          and intended outcome.
        </p>
        <div class="mt-9 flex flex-wrap gap-3">
          <a href="contact.html" class="rounded-full bg-[#10C7FF] px-6 py-3 text-sm font-semibold text-[#003D6B] transition hover:-translate-y-0.5">Talk to our experts</a>
          <a href="contact.html" class="rounded-full border border-paper/30 px-6 py-3 text-sm font-semibold text-paper transition hover:border-paper">Request a consultation</a>
        </div>
      </div>
    </section>
  </main>`,
};
