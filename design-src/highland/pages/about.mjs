import {
  COMPANY, IMPACT, JOURNEY, VALUES, SOLUTIONS, INDUSTRIES, DELIVERY,
  SUSTAINABILITY, EXECUTIVE_ROLES, CLIENTS, CONTACT, ACCENT,
} from "../content.mjs";
import { pageHead, sectionHead, pending, closingCta, esc } from "../ui.mjs";

/*
 * About Us. Module 01, part two.
 *
 * The page's spine is the journey timeline -- ten dated milestones that no
 * other page carries -- and it is what keeps this page from reading like a
 * longer homepage. Mission, vision and the seven values are Edge's own
 * approved wording; an earlier version of this site carried invented ones.
 */

export default {
  title: "About Edge Comm-Tech — Technology Solutions Company in Ethiopia",
  desc: "Learn how Edge Comm-Tech delivers enterprise networks, cloud, datacenters, cybersecurity, software, AI, power, and broadcast solutions across Ethiopia and beyond.",
  body: `  <main>
    ${pageHead({
      eyebrow: "About Edge Comm-Tech",
      title: "Engineering technology, enabling progress",
      intro: `${esc(COMPANY.short)} is Ethiopia's trusted end-to-end technology solutions and systems-integration partner, delivering secure, scalable, intelligent, and future-ready solutions across Ethiopia and beyond.`,
      accent: "#0888c5",
      variant: "wash",
      ctas: `<div class="eg-rise mt-8 flex flex-wrap gap-3" style="--d:.24s">
          <a href="solutions.html" class="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">Explore our solutions</a>
          <a href="contact.html" class="rounded-full border border-rule px-6 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold">Talk to our experts</a>
        </div>`,
    })}

    <section class="mx-auto max-w-6xl px-6 py-20">
      <div class="grid gap-12 lg:grid-cols-[1.15fr_1fr]">
        <div>
          ${sectionHead({
            eyebrow: "Who we are",
            title: "Local expertise connected to global technology",
          })}
          <p class="mt-6 leading-relaxed text-ink/75">
            Since 2018, we have helped financial institutions, government organizations, educational institutions,
            and enterprises modernize infrastructure, secure operations, strengthen resilience, automate services,
            and create sustainable foundations for digital growth.
          </p>
          <p class="mt-4 leading-relaxed text-ink/75">
            We bring together professional expertise, engineering capability, strategic consulting, project
            management, and technologies from respected global vendors and original equipment manufacturers.
            This combination allows us to address complex organizational requirements through solutions designed
            for local operating conditions and aligned with international standards.
          </p>
          <p class="mt-4 leading-relaxed text-ink/75">
            From assessment and architecture design to procurement, implementation, integration, testing,
            training, support, and continuous improvement, we provide one accountable partner throughout the
            solution lifecycle.
          </p>
        </div>
        <dl class="grid content-start gap-px self-start overflow-hidden rounded-2xl bg-rule sm:grid-cols-2">
          ${IMPACT.map(
            (m) => `<div class="bg-paper-2 px-6 py-6">
            <dt class="font-display text-3xl leading-none text-gold">${esc(m.figure)}</dt>
            <dd class="mt-2 text-xs leading-snug text-ink/70">${esc(m.unit)} ${esc(m.line)}</dd>
          </div>`,
          ).join("\n          ")}
        </dl>
      </div>
    </section>

    <!-- The journey ------------------------------------------------------- -->
    <section class="border-y border-rule bg-paper-2/40">
      <div class="mx-auto max-w-6xl px-6 py-20">
        ${sectionHead({
          eyebrow: "Our journey",
          title: "From a focused technology company to an integrated solutions partner",
          intro: "Edge Comm-Tech was established to help organizations access, integrate, and sustain world-class technology through dependable local expertise. The milestones below reflect continuous capability development and sector expansion.",
        })}
        <ol class="relative mt-12 border-l border-rule pl-8">
          ${JOURNEY.map(
            (m, i) => `<li class="eg-inview relative pb-9 last:pb-0">
            <span class="absolute -left-[2.3rem] top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-paper ${i === JOURNEY.length - 1 ? "bg-gold" : "bg-gold/40"}"></span>
            <p class="font-mono text-[10px] uppercase tracking-widest text-gold">${esc(m.when)}</p>
            <p class="mt-1.5 max-w-2xl leading-relaxed text-ink/80">${esc(m.what)}</p>
          </li>`,
          ).join("\n          ")}
        </ol>
      </div>
    </section>

    <!-- Mission and vision ------------------------------------------------- -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Our direction</p>
      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <article class="eg-inview rounded-3xl p-8" style="background:#0888c50e">
          <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Mission</p>
          <h2 class="mt-3 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight">${esc(COMPANY.mission)}</h2>
          <p class="mt-4 leading-relaxed text-ink/75">${esc(COMPANY.missionBody)}</p>
        </article>
        <article class="eg-inview rounded-3xl p-8" style="background:#056a9a0e">
          <p class="font-mono text-[10px] uppercase tracking-widest text-gold-2">Vision</p>
          <h2 class="mt-3 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight">${esc(COMPANY.vision)}</h2>
          <p class="mt-4 leading-relaxed text-ink/75">${esc(COMPANY.visionBody)}</p>
        </article>
      </div>
    </section>

    <!-- Values ------------------------------------------------------------- -->
    <section class="border-t border-rule">
      <div class="mx-auto max-w-6xl px-6 py-20">
        ${sectionHead({ eyebrow: "What guides us", title: "Values that shape every decision and delivery" })}
        <div class="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          ${VALUES.map(
            (v, i) => `<div class="eg-inview border-t border-rule pt-5">
            <span class="font-mono text-[10px] text-gold">${String(i + 1).padStart(2, "0")}</span>
            <h3 class="mt-1.5 font-display text-xl">${esc(v.title)}</h3>
            <p class="mt-2 text-sm leading-relaxed text-ink/70">${esc(v.body)}</p>
          </div>`,
          ).join("\n          ")}
        </div>
      </div>
    </section>

    <!-- Capabilities --------------------------------------------------------- -->
    <section class="border-t border-rule bg-paper-2/40">
      <div class="mx-auto max-w-6xl px-6 py-20">
        ${sectionHead({
          eyebrow: "Our capabilities",
          title: "Integrated solutions across the technology lifecycle",
          intro: "Modern environments depend on successful integration of connectivity, computing, data, security, software, artificial intelligence, facilities, and power. Edge Comm-Tech brings these capabilities together within one coordinated delivery framework.",
        })}
        <ul class="mt-10 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          ${SOLUTIONS.map(
            (s) => `<li><a href="solution-${s.slug}.html" class="eg-inview block h-full rounded-2xl bg-paper-2 p-5 transition hover:-translate-y-1">
            <span class="font-mono text-[10px] uppercase tracking-widest" style="color:${ACCENT[s.slug]}">${String(s.n).padStart(2, "0")}</span>
            <span class="mt-1.5 block font-display text-lg leading-snug">${esc(s.short)}</span>
          </a></li>`,
          ).join("\n          ")}
          <li><a href="services.html" class="eg-inview block h-full rounded-2xl border border-dashed border-gold/40 p-5 transition hover:-translate-y-1 hover:border-gold">
            <span class="font-mono text-[10px] uppercase tracking-widest text-gold">+06</span>
            <span class="mt-1.5 block font-display text-lg leading-snug">Professional services</span>
          </a></li>
        </ul>
      </div>
    </section>

    <!-- Sector experience and delivery ------------------------------------------ -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <div class="grid gap-14 lg:grid-cols-2">
        <div>
          ${sectionHead({ eyebrow: "Sector experience", title: "Technology aligned with institutional priorities" })}
          <dl class="mt-7 divide-y divide-rule border-y border-rule">
            ${INDUSTRIES.map(
              (s) => `<div class="eg-inview py-5">
              <dt class="font-display text-lg">${esc(s.title)}</dt>
              <dd class="mt-1.5 text-sm leading-relaxed text-ink/70">${esc(s.body)}</dd>
            </div>`,
            ).join("\n            ")}
          </dl>
        </div>
        <div>
          ${sectionHead({ eyebrow: "How we work", title: "One accountable partner from strategy to support" })}
          <ol class="mt-7 space-y-2.5">
            ${DELIVERY.map(
              (s) => `<li class="eg-inview flex gap-4 rounded-2xl bg-paper-2 px-5 py-4">
              <span class="pt-0.5 font-mono text-[10px] text-gold">${String(s.n).padStart(2, "0")}</span>
              <span><span class="block font-display text-base">${esc(s.title)}</span>
              <span class="mt-1 block text-sm text-ink/70">${esc(s.body)}</span></span>
            </li>`,
            ).join("\n            ")}
          </ol>
        </div>
      </div>
    </section>

    <!-- Leadership ------------------------------------------------------------ -->
    <section class="border-t border-rule bg-paper-2/40">
      <div class="mx-auto max-w-6xl px-6 py-20">
        ${sectionHead({
          eyebrow: "Professional capability",
          title: "Specialized teams, unified execution",
          intro: "Our organizational model connects strategy, engineering, presales, project management, supply chain, finance, human resources, marketing, and business development. Technical capabilities are supported by professionals with technology, project, and vendor certifications.",
        })}
        <div class="mt-9">
          <p class="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-steel">
            Executive management ${pending("Biographies and portraits pending from Edge")}
          </p>
          <ul class="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
            ${EXECUTIVE_ROLES.map(
              (r) => `<li class="eg-inview rounded-2xl bg-paper-2 p-5">
              <span class="grid h-11 w-11 place-items-center rounded-full bg-gold/10 font-display text-gold" aria-hidden="true">&mdash;</span>
              <span class="mt-3 block font-display text-base leading-snug">${esc(r)}</span>
              <span class="mt-1 block text-xs text-steel">Name to be confirmed</span>
            </li>`,
            ).join("\n            ")}
          </ul>
          <p class="mt-4 text-xs text-steel">
            The content master lists the five executive profiles as Pending. Roles are shown; names, biographies
            and portraits are added when Edge supplies them.
          </p>
        </div>
      </div>
    </section>

    <!-- Sustainability --------------------------------------------------------- -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      ${sectionHead({
        eyebrow: "Sustainable progress",
        title: "Building technology with long-term purpose",
        intro: "Digital transformation should improve organizational performance while contributing positively to communities and the environment. We consider efficiency, durability, responsible sourcing, and lifecycle value in the solutions we recommend and deliver.",
      })}
      <div class="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        ${SUSTAINABILITY.map(
          (s) => `<article class="eg-inview rounded-2xl border border-rule p-6">
          <h3 class="font-display text-lg">${esc(s.title)}</h3>
          <p class="mt-2 text-sm leading-relaxed text-ink/70">${esc(s.body)}</p>
        </article>`,
        ).join("\n        ")}
      </div>
    </section>

    <!-- Clients and home ------------------------------------------------------- -->
    <section id="clients" class="border-t border-rule bg-paper-2/40">
      <div class="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_1fr]">
        <div>
          ${sectionHead({ eyebrow: "Trusted experience", title: "Supporting institutions that drive national progress" })}
          <p class="mt-6 leading-relaxed text-ink/75">
            Through more than 67 executed and delivered projects, we have developed practical experience managing
            complex requirements, global supply chains, multidisciplinary implementation, institutional
            stakeholders, documentation, training, and operational handover.
          </p>
          <ul class="mt-6 flex flex-wrap gap-2">
            ${CLIENTS.map(
              (c) => `<li class="rounded-full bg-paper-2 px-3.5 py-1.5 text-xs text-ink/75">${esc(c.name)}</li>`,
            ).join("\n            ")}
          </ul>
          <a href="clients.html" class="mt-7 inline-block rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold">Meet our clients</a>
        </div>
        <div>
          ${sectionHead({ eyebrow: "Our home", title: "Headquartered in Addis Ababa" })}
          <address class="mt-6 not-italic leading-relaxed text-ink/80">
            ${CONTACT.office.map(esc).join("<br>")}
          </address>
          <p class="mt-4 text-sm leading-relaxed text-ink/70">
            From our headquarters in Addis Ababa, our teams coordinate consulting, engineering, procurement,
            project delivery, client support, and partnership activities across Ethiopia and beyond.
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <a href="contact.html" class="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5">Contact us</a>
            <a href="${CONTACT.map}" class="rounded-full border border-rule px-5 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold">Get directions</a>
          </div>
          <p class="mt-6 rounded-2xl bg-paper-2 px-5 py-4 text-xs leading-relaxed text-steel">
            Edge Communication Technologies PLC operates with the applicable professional licences and government
            registrations required for its business activities. Company-held certifications are distinguished from
            certifications held by individual employees.
          </p>
        </div>
      </div>
    </section>

    ${closingCta({
      title: "Let's build the next stage of your digital transformation",
      body: "Whether you are modernizing critical infrastructure, strengthening cybersecurity, introducing AI and automation, improving business continuity, enabling intelligent learning, digitizing operations, or planning a new technology investment.",
      primary: { href: "contact.html", label: "Talk to our experts" },
      secondary: { href: "solutions.html", label: "Explore our solutions" },
    })}
  </main>`,
};
