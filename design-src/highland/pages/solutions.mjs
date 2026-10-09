import { SOLUTIONS, SERVICES, INDUSTRIES, PROJECTS, ACCENT } from "../content.mjs";
import { pageHead, sectionHead, closingCta, esc } from "../ui.mjs";

/*
 * Solutions and services overview.
 *
 * The content master gives this page its own five technology priorities and
 * its own six-step delivery framework, both different from the homepage's.
 * They are kept here rather than shared, because collapsing them would put
 * the wrong wording on one of the two pages.
 */

const PRIORITIES = [
  { title: "AI-ready and data-driven", body: "Infrastructure and platforms prepared for analytics, automation, enterprise AI, and growing data workloads." },
  { title: "Hybrid and interoperable", body: "Architectures that connect on-premises, cloud, edge, applications, devices, and existing investments." },
  { title: "Secure by design", body: "Identity-centered controls, least privilege, monitoring, resilience, recovery, and responsible data handling." },
  { title: "Operationally resilient", body: "Redundancy, business continuity, backup, disaster recovery, power protection, environmental control, and support." },
  { title: "Sustainable by lifecycle", body: "Energy efficiency, maintainability, monitoring, responsible sourcing, electronic-waste considerations, and long-term value." },
];

const FRAMEWORK = [
  { title: "Discover", body: "Understand business priorities, users, data, risks, current systems, dependencies, and desired outcomes." },
  { title: "Design", body: "Develop secure, scalable, interoperable, and commercially practical architectures." },
  { title: "Source", body: "Coordinate suitable technologies through qualified vendors, OEMs, and distributors." },
  { title: "Implement", body: "Manage logistics, installation, configuration, integration, testing, documentation, and acceptance." },
  { title: "Enable", body: "Provide training, knowledge transfer, handover documentation, and operational guidance." },
  { title: "Support & optimize", body: "Maintain availability, address incidents, improve performance, manage upgrades, and prepare for growth." },
];

/* How many completed projects each family can point at. Computed, so it can
   never drift from the project records. */
const count = (slug) => PROJECTS.filter((p) => p.solutions.includes(slug)).length;

export default {
  title: "Technology Solutions and Services in Ethiopia — Edge Comm-Tech",
  desc: "Explore Edge Comm-Tech solutions across enterprise networks, cloud, datacenters, cybersecurity, software, AI, power, broadcast, and satellite technologies.",
  body: `  <main>
    ${pageHead({
      eyebrow: "Solutions and services",
      title: "Technology that works together",
      intro: "Edge Comm-Tech delivers integrated technology solutions that connect infrastructure, data, applications, security, operations, and people. We help organizations modernize with architectures designed for performance, resilience, security, scalability, and long-term value.",
      accent: "#0888c5",
      variant: "grid",
      ctas: `<div class="eg-rise mt-8 flex flex-wrap gap-3" style="--d:.24s">
          <a href="contact.html" class="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">Talk to our experts</a>
          <a href="#industries" class="rounded-full border border-rule px-6 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold">Explore solutions by industry</a>
        </div>`,
    })}

    <section class="mx-auto max-w-4xl px-6 py-16">
      ${sectionHead({ eyebrow: "Our approach", title: "From individual technologies to one operational ecosystem" })}
      <p class="mt-6 text-lg leading-relaxed text-ink/80">
        A successful transformation depends on more than selecting products. Networks must support applications.
        Datacenter facilities must provide resilient environments for critical systems. IT infrastructure must
        connect, monitor, and protect physical operations. Cybersecurity must protect cloud services, networks,
        applications, endpoints, identities, operations, perimeters, and data. Power must sustain critical
        operations. Software and AI must connect to trusted information and existing workflows.
      </p>
      <p class="mt-4 leading-relaxed text-ink/70">
        Edge Comm-Tech brings these requirements together through assessment, design, sourcing, implementation,
        integration, testing, training, support, and continuous improvement.
      </p>
    </section>

    <!-- The seven families, as a ledger rather than a card grid: the homepage
         already shows them as cards, and this page is the catalogue. -->
    <section class="border-y border-rule bg-paper-2/40">
      <div class="mx-auto max-w-6xl px-6 py-20">
        ${sectionHead({ eyebrow: "Solution portfolio", title: "Seven integrated solution families" })}
        <ul class="mt-10">
          ${SOLUTIONS.map(
            (s) => `<li><a href="solution-${s.slug}.html"
            class="eg-inview group grid gap-x-8 gap-y-3 border-t border-rule py-8 transition lg:grid-cols-[4rem_1fr_9rem]">
            <span class="font-display text-3xl leading-none" style="color:${ACCENT[s.slug]}">${String(s.n).padStart(2, "0")}</span>
            <span class="min-w-0">
              <span class="block font-display text-[clamp(1.3rem,2.2vw,1.85rem)] leading-snug group-hover:text-gold">${esc(s.title)}</span>
              <span class="mt-2 block max-w-2xl text-sm leading-relaxed text-ink/70">${esc(s.blurb)}</span>
            </span>
            <span class="flex flex-col items-start gap-2 lg:items-end lg:text-right">
              ${count(s.slug) ? `<span class="rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-widest" style="background:${ACCENT[s.slug]}14;color:${ACCENT[s.slug]}">${count(s.slug)} project${count(s.slug) > 1 ? "s" : ""}</span>` : ""}
              <span class="font-mono text-[10px] uppercase tracking-widest text-gold">Explore &rarr;</span>
            </span>
          </a></li>`,
          ).join("\n          ")}
        </ul>
      </div>
    </section>

    <!-- Professional services ------------------------------------------------ -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div>
          ${sectionHead({
            eyebrow: "Professional services",
            title: "Services that turn technology into operational value",
            intro: "Services can support a focused requirement or an integrated multi-technology program.",
          })}
        </div>
        <a href="services.html" class="rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold">Explore our service model</a>
      </div>
      <div class="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        ${SERVICES.map(
          (s) => `<a href="service-${s.slug}.html" class="eg-inview group flex flex-col rounded-2xl bg-paper-2 p-6 transition hover:-translate-y-1">
          <span class="font-mono text-[10px] uppercase tracking-widest" style="color:${ACCENT[s.slug]}">Service ${String(s.n).padStart(2, "0")}</span>
          <h3 class="mt-1.5 font-display text-lg leading-snug group-hover:text-gold">${esc(s.title)}</h3>
          <p class="mt-2 flex-1 text-sm leading-relaxed text-ink/70">${esc(s.blurb)}</p>
        </a>`,
        ).join("\n        ")}
      </div>
    </section>

    <!-- Technology priorities --------------------------------------------- -->
    <section class="border-t border-rule bg-paper-2/40">
      <div class="mx-auto max-w-6xl px-6 py-20">
        ${sectionHead({ eyebrow: "Technology priorities", title: "Designed for current needs and future change" })}
        <div class="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          ${PRIORITIES.map(
            (p, i) => `<div class="eg-inview border-t border-rule pt-5">
            <span class="font-mono text-[10px] text-gold">${String(i + 1).padStart(2, "0")}</span>
            <h3 class="mt-1.5 font-display text-xl">${esc(p.title)}</h3>
            <p class="mt-2 text-sm leading-relaxed text-ink/70">${esc(p.body)}</p>
          </div>`,
          ).join("\n          ")}
        </div>
      </div>
    </section>

    <!-- Industry solutions -------------------------------------------------- -->
    <section id="industries" class="mx-auto max-w-6xl px-6 py-20">
      ${sectionHead({ eyebrow: "Industry solutions", title: "Technology aligned with sector priorities" })}
      <div class="mt-10 grid gap-4 sm:grid-cols-2">
        ${INDUSTRIES.map(
          (s) => `<article class="eg-inview rounded-2xl border border-rule p-7 transition hover:border-gold">
          <h3 class="font-display text-xl">${esc(s.title)}</h3>
          <p class="mt-2.5 text-sm leading-relaxed text-ink/70">${esc(s.body)}</p>
        </article>`,
        ).join("\n        ")}
      </div>
    </section>

    <!-- Delivery framework --------------------------------------------------- -->
    <section class="border-t border-rule">
      <div class="mx-auto max-w-6xl px-6 py-20">
        ${sectionHead({ eyebrow: "Delivery framework", title: "One accountable partner across the lifecycle" })}
        <ol class="mt-10 grid gap-px overflow-hidden rounded-2xl bg-rule sm:grid-cols-2 lg:grid-cols-3">
          ${FRAMEWORK.map(
            (s, i) => `<li class="eg-inview bg-paper-2 p-7">
            <span class="font-display text-3xl text-gold/25">${String(i + 1).padStart(2, "0")}</span>
            <h3 class="mt-2 font-display text-lg">${esc(s.title)}</h3>
            <p class="mt-2 text-sm leading-relaxed text-ink/70">${esc(s.body)}</p>
          </li>`,
          ).join("\n          ")}
        </ol>
      </div>
    </section>

    <!-- Featured experience ---------------------------------------------------- -->
    <section class="border-t border-rule bg-paper-2/40">
      <div class="mx-auto max-w-6xl px-6 py-20">
        ${sectionHead({
          eyebrow: "Featured experience",
          title: "Solutions proven in critical environments",
          intro: "Relevant experience includes Bahir Dar University smart classrooms and CCTV, Gadaa Bank computing infrastructure, National Bank of Ethiopia backup systems, Ministry of Urban and Infrastructure computing, Siinqee Bank power and datacenter-related solutions, Zemen Bank generators, Arba Minch University smart meeting rooms, and Ethiopian Securities Exchange database software.",
        })}
        <ul class="mt-9 flex flex-wrap gap-2">
          ${PROJECTS.map(
            (p) => `<li><a href="project-${p.slug}.html" class="block rounded-full bg-paper-2 px-4 py-2 text-xs transition hover:text-gold">${esc(p.client)} &middot; ${esc(p.primary)}</a></li>`,
          ).join("\n          ")}
        </ul>
      </div>
    </section>

    ${closingCta({
      title: "Tell us what you need to deliver",
      body: "Share your goals, constraints and existing environment. Our team will help define a practical, interoperable solution pathway.",
      primary: { href: "contact.html", label: "Request a consultation" },
      secondary: { href: "projects.html", label: "Explore our projects" },
    })}
  </main>`,
};
