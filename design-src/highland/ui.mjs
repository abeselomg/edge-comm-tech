/*
 * Shared atoms. Deliberately small.
 *
 * The client's one standing design requirement is that no two pages feel
 * redundant, so this file holds only the pieces where sameness is correct --
 * an eyebrow, a pending marker, a form field, a call-to-action pair. Page
 * layout stays in the page modules, where it can differ.
 */

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const eyebrow = (text, color = "text-gold") =>
  `<p class="eg-rise font-mono text-[11px] uppercase tracking-[0.28em] ${color}">${text}</p>`;

/* A fact the content master lists as still to be confirmed by Edge. Visible
   on purpose: the alternative is a plausible-looking invention. */
export const pending = (text) =>
  `<span class="inline-flex items-center gap-1.5 rounded-full border border-lamp/40 bg-lamp/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-lamp">
    <svg viewBox="0 0 8 8" class="h-1.5 w-1.5" aria-hidden="true"><circle cx="4" cy="4" r="4" fill="currentColor"/></svg>${text}</span>`;

export const ctaRow = (primary, secondary, accent = "#0888c5") => `
  <div class="eg-rise mt-8 flex flex-wrap items-center gap-3" style="--d:.24s">
    <a href="${primary.href}" class="rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-16px_rgb(8_136_197/0.9)] transition hover:-translate-y-0.5"
       style="background:${accent}">${primary.label}</a>
    ${secondary ? `<a href="${secondary.href}" class="rounded-full border border-rule px-6 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold">${secondary.label}</a>` : ""}
  </div>`;

/* The standard interior page band. `variant` changes the decoration so page
   families do not all open the same way. */
export const pageHead = ({ eyebrow: eb, title, intro, accent = "#0888c5", variant = "wash", crumb, meta, ctas }) => {
  const decoration = {
    wash: `<span class="pointer-events-none absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full"
             style="background:radial-gradient(circle,${accent}26,transparent 70%)" aria-hidden="true"></span>`,
    rule: `<span class="pointer-events-none absolute inset-x-0 bottom-0 h-px" style="background:linear-gradient(90deg,${accent},transparent)" aria-hidden="true"></span>`,
    grid: `<span class="pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden="true"
             style="background-image:linear-gradient(${accent}14 1px,transparent 1px),linear-gradient(90deg,${accent}14 1px,transparent 1px);background-size:56px 56px"></span>`,
    beam: `<span class="pointer-events-none absolute -left-24 top-0 h-full w-[28rem] -skew-x-12"
             style="background:linear-gradient(90deg,${accent}1f,transparent)" aria-hidden="true"></span>`,
  }[variant];

  return `<header class="relative overflow-hidden border-b" style="border-color:${accent}2e;background:linear-gradient(140deg,${accent}12,${accent}04)">
      ${decoration}
      <div class="relative mx-auto max-w-6xl px-6 py-16">
        ${crumb ?? ""}
        ${eb ? `<p class="eg-rise font-mono text-[11px] uppercase tracking-[0.28em]" style="color:${accent}">${eb}</p>` : ""}
        <h1 class="eg-rise mt-3 max-w-4xl font-display text-[clamp(2rem,5vw,3.6rem)] leading-[1.02]" style="--d:.06s">${title}</h1>
        ${intro ? `<p class="eg-rise mt-5 max-w-2xl text-lg text-ink/75" style="--d:.14s">${intro}</p>` : ""}
        ${meta ?? ""}
        ${ctas ?? ""}
      </div>
    </header>`;
};

export const crumb = (trail) =>
  `<nav class="font-mono text-[10px] uppercase tracking-widest text-steel" aria-label="Breadcrumb">
          ${trail
            .map((t, i) =>
              t.href
                ? `<a href="${t.href}" class="hover:text-gold">${t.label}</a>${i < trail.length - 1 ? '<span class="mx-2">/</span>' : ""}`
                : `${t.label}`,
            )
            .join("")}
        </nav>`;

export const sectionHead = ({ eyebrow: eb, title, intro, accent = "#0888c5", wide = false }) => `
      <p class="font-mono text-[10px] uppercase tracking-widest" style="color:${accent}">${eb}</p>
      <h2 class="mt-3 ${wide ? "max-w-4xl" : "max-w-3xl"} font-display text-[clamp(1.6rem,3vw,2.5rem)] leading-tight">${title}</h2>
      ${intro ? `<p class="mt-4 max-w-2xl text-ink/75">${intro}</p>` : ""}`;

export const checkList = (items, accent = "#0888c5", cols = "sm:grid-cols-2") => `
        <ul class="mt-5 grid gap-2.5 ${cols}">
          ${items
            .map(
              (x) => `<li class="eg-inview flex items-start gap-3 rounded-2xl bg-paper-2 px-5 py-4 text-sm text-ink/80">
            <svg viewBox="0 0 24 24" class="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="${accent}"
                 stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>
            <span>${x}</span>
          </li>`,
            )
            .join("\n          ")}
        </ul>`;

export const numberedSteps = (steps, accent = "#0888c5") => `
        <ol class="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          ${steps
            .map(
              (s, i) => `<li class="eg-inview relative overflow-hidden rounded-2xl bg-paper-2 p-6">
            <span class="absolute right-4 top-3 font-display text-4xl opacity-10" style="color:${accent}">${String(i + 1).padStart(2, "0")}</span>
            <h3 class="font-display text-xl">${s.title}</h3>
            <p class="mt-2 text-sm text-ink/70">${s.body}</p>
          </li>`,
            )
            .join("\n          ")}
        </ol>`;

/* Forms across the site are shapes for review, not live endpoints -- the
   content master routes every submission through a CMS the review build does
   not have. They are disabled so nobody mistakes them for working. */
export const field = ({ label, type = "text", hint, required, options, wide }) => {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const base =
    "mt-1.5 w-full rounded-xl border border-rule bg-paper-2 px-4 py-2.5 text-sm text-ink/60 shadow-none";
  const control =
    type === "textarea"
      ? `<textarea id="${id}" rows="4" class="${base}" disabled></textarea>`
      : type === "select"
        ? `<select id="${id}" class="${base}" disabled>${(options ?? []).map((o) => `<option>${o}</option>`).join("")}</select>`
        : `<input id="${id}" type="${type}" class="${base}" disabled>`;
  return `<div class="${wide ? "sm:col-span-2" : ""}">
            <label for="${id}" class="font-mono text-[10px] uppercase tracking-widest text-steel">${label}${required ? ' <span class="text-lamp">*</span>' : ""}</label>
            ${control}
            ${hint ? `<p class="mt-1 text-[11px] text-steel">${hint}</p>` : ""}
          </div>`;
};

export const formNote =
  `<p class="mt-5 flex items-start gap-2 rounded-2xl bg-paper-2 px-5 py-4 text-xs text-steel">
      <svg viewBox="0 0 24 24" class="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8"
           stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>
      <span>Form shown for layout review. Fields, validation, consent capture, secure upload and routing are built against the CMS at implementation.</span>
    </p>`;

/* A brand or client mark where artwork exists, and its name set in the same
   frame where it does not. One function so the two never drift apart. */
export const mark = (item, { h = "h-10", box = "h-16", dir = "logos" } = {}) =>
  item.logo
    ? `<img src="${dir}/${item.logo}.png" alt="${esc(item.name)}" width="240" height="160"
           class="${h} w-auto max-w-full object-contain" decoding="async">`
    : `<span class="px-2 text-center font-display text-[13px] leading-tight text-ink/70">${esc(item.name)}</span>`;

export const closingCta = ({ title, body, primary, secondary, accent = "#0888c5" }) => `
    <section class="relative overflow-hidden border-t border-rule">
      <span class="pointer-events-none absolute inset-0" aria-hidden="true"
            style="background:linear-gradient(120deg,${accent}16,transparent 60%)"></span>
      <div class="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
        <h2 class="eg-inview max-w-3xl font-display text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight">${title}</h2>
        <p class="eg-inview mt-4 max-w-2xl text-ink/75">${body}</p>
        ${ctaRow(primary, secondary, accent)}
      </div>
    </section>`;
