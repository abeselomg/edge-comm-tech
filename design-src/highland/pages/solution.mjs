import { SERVICES, PROJECTS, PARTNERS } from "../content.mjs";
import { SERVICE_DETAIL } from "../service-detail.mjs";

/*
 * One factory, nine pages. `make(slug)` returns the page object the generator
 * expects, so a tenth service needs a content entry and a registry line and
 * nothing else.
 *
 * Structure is a datasheet: title block, prose column, pinned specifications
 * sidebar. That shape belongs to this page type and appears nowhere else.
 */

const ACCENT = {
  datacenter: "#0888c5",
  networks: "#2ba8de",
  cybersecurity: "#056a9a",
  "noc-soc": "#0b6fa8",
  "unified-comms": "#c48a5a",
  "voice-data-internet": "#2ba8de",
  "physical-security": "#056a9a",
  "it-support": "#0888c5",
  "professional-services": "#c48a5a",
};

/* Projects that used this service, matched on the scope text. Keeps the
   related list honest: no service claims work it was not part of. */
const KEYWORDS = {
  datacenter: ["datacenter"],
  networks: ["lan", "wireless", "network"],
  cybersecurity: ["security", "access control"],
  "physical-security": ["cctv", "access control"],
  "it-support": [],
  "noc-soc": [],
  "unified-comms": ["telephony"],
  "voice-data-internet": [],
  "professional-services": ["cabling", "rack"],
};
const related = (slug) =>
  PROJECTS.filter((p) =>
    (KEYWORDS[slug] ?? []).some((k) => p.scope.toLowerCase().includes(k)),
  ).slice(0, 3);

export const make = (slug) => {
  const svc = SERVICES.find((s) => s.slug === slug);
  const d = SERVICE_DETAIL[slug];
  if (!svc) throw new Error(`no SERVICES entry for "${slug}"`);
  if (!d) throw new Error(`no SERVICE_DETAIL entry for "${slug}"`);
  const c = ACCENT[slug];
  const others = SERVICES.filter((s) => s.slug !== slug);
  const rel = related(slug);

  return {
    title: `${svc.title} — Edge COMM-TECH`,
    desc: svc.blurb,
    body: `  <main>
    <header class="relative overflow-hidden border-b" style="border-color:${c}33;background:linear-gradient(140deg,${c}14,${c}05)">
      <span class="pointer-events-none absolute -right-24 -top-32 h-[30rem] w-[30rem] rounded-full"
            style="background:radial-gradient(circle,${c}26,transparent 70%)" aria-hidden="true"></span>
      <div class="relative mx-auto max-w-6xl px-6 py-16">
        <nav class="font-mono text-[10px] uppercase tracking-widest text-steel" aria-label="Breadcrumb">
          <a href="solutions.html" class="hover:text-gold">Solutions</a>
          <span class="mx-2">/</span>Service ${String(svc.n).padStart(2, "0")}
        </nav>
        <h1 class="eg-rise mt-4 max-w-3xl font-display text-[clamp(2rem,5vw,3.75rem)] leading-[1.0]">${svc.title}</h1>
        <p class="eg-rise mt-5 max-w-2xl text-lg text-ink/75" style="--d:.08s">${svc.blurb}</p>
        <ul class="eg-rise mt-7 flex flex-wrap gap-2" style="--d:.16s">
          ${d.capabilities
            .map((x) => `<li class="rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest"
              style="background:${c}1a;color:${c}">${x.a}</li>`)
            .join("\n          ")}
        </ul>
      </div>
    </header>

    <div class="mx-auto grid max-w-6xl gap-14 px-6 py-16 lg:grid-cols-[1fr_20rem]">
      <article>
        <p class="max-w-2xl text-lg leading-relaxed">${d.overview}</p>

        <h2 class="mt-12 font-display text-2xl">Scope of work</h2>
        <ol class="mt-5 space-y-2.5">
          ${d.scope
            .map(
              (x, i) => `<li class="eg-inview flex gap-4 rounded-2xl bg-paper-2 px-5 py-4 text-sm">
            <span class="font-mono text-[10px] pt-0.5" style="color:${c}">${String(i + 1).padStart(2, "0")}</span>
            <span class="text-ink/80">${x}</span>
          </li>`,
            )
            .join("\n          ")}
        </ol>

        <h2 class="mt-12 font-display text-2xl">What you receive</h2>
        <ul class="mt-5 grid gap-2.5 sm:grid-cols-2">
          ${d.deliverables
            .map(
              (x) => `<li class="flex items-start gap-3 rounded-2xl bg-paper-2 px-5 py-4 text-sm text-ink/80">
            <svg viewBox="0 0 24 24" class="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="${c}"
                 stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>
            ${x}
          </li>`,
            )
            .join("\n          ")}
        </ul>

        ${
          rel.length
            ? `<h2 class="mt-12 font-display text-2xl">Where we have delivered it</h2>
        <ul class="mt-5 divide-y divide-rule border-y border-rule">
          ${rel
            .map(
              (p) => `<li class="flex items-baseline justify-between gap-4 py-4">
            <span><span class="block font-display text-lg">${p.scope}</span>
            <span class="text-sm text-steel">${p.client}</span></span>
            <span class="font-mono text-xs text-steel">${p.year}</span>
          </li>`,
            )
            .join("\n          ")}
        </ul>`
            : ""
        }
      </article>

      <aside class="self-start lg:sticky lg:top-32">
        <p class="font-mono text-[10px] uppercase tracking-widest" style="color:${c}">Capabilities</p>
        <dl class="mt-4 space-y-3">
          ${d.capabilities
            .map(
              (x) => `<div class="rounded-2xl bg-paper-2 p-4">
            <dt class="font-display text-base">${x.a}
              <span class="block font-sans text-[11px] font-normal text-steel">${x.x}</span></dt>
            <dd class="mt-2 text-xs leading-relaxed text-ink/70">${x.v}</dd>
          </div>`,
            )
            .join("\n          ")}
        </dl>

        <p class="mt-8 font-mono text-[10px] uppercase tracking-widest" style="color:${c}">Platforms used</p>
        <ul class="mt-3 grid grid-cols-3 gap-2">
          ${d.partners
            .map((x) => {
              const p = PARTNERS.find((q) => q.name === x);
              /* Falls back to the name if a partner has no mark on file, so a
                 new entry never renders as an empty box. */
              return p
                ? `<li class="grid h-12 place-items-center rounded-xl bg-paper-2 px-2">
            <img src="logos/${p.logo}.png" alt="${p.name}" width="240" height="160"
                 class="max-h-10 w-auto object-contain" decoding="async"></li>`
                : `<li class="grid h-12 place-items-center rounded-xl bg-paper-2 px-2 text-center text-[11px]">${x}</li>`;
            })
            .join("")}
        </ul>

        <a href="contact.html" class="mt-8 block rounded-full px-5 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5"
           style="background:${c}">Discuss ${svc.title.toLowerCase()}</a>
      </aside>
    </div>

    <section class="border-t border-rule bg-paper-2">
      <div class="mx-auto max-w-6xl px-6 py-14">
        <p class="font-mono text-[10px] uppercase tracking-widest text-gold">The other eight</p>
        <ul class="mt-5 flex flex-wrap gap-2">
          ${others
            .map(
              (s) => `<li><a href="solution-${s.slug}.html"
            class="block rounded-full px-3.5 py-1.5 text-xs font-semibold transition hover:-translate-y-0.5"
            style="background:${ACCENT[s.slug]}14;color:${ACCENT[s.slug]}">${s.title}</a></li>`,
            )
            .join("\n          ")}
        </ul>
      </div>
    </section>
  </main>`,
  };
};
