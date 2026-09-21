import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SERVICES, PARTNERS } from "../content.mjs";

/*
 * The approved homepage, with the changes the client asked for applied as
 * surgery on the original rather than a rewrite.
 *
 * Everything not named below is still byte-for-byte the design they signed
 * off. Each operation asserts that it matched: a rewrite that silently hits
 * nothing would leave the page looking fine while doing nothing, which is the
 * failure mode worth guarding against here.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const parts = JSON.parse(readFileSync(path.join(here, "../shell-parts.json"), "utf8"));

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

const MARK = {
  datacenter: '<rect x="4" y="3" width="16" height="6" rx="1.5"/><rect x="4" y="11" width="16" height="6" rx="1.5"/><path d="M7 6h.01M7 14h.01M4 19v2M20 19v2"/>',
  networks: '<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="18" r="2.2"/><circle cx="19" cy="18" r="2.2"/><path d="M12 7.2v4.3m0 0L6.6 16m5.4-4.5L17.4 16"/>',
  cybersecurity: '<path d="M12 3 5 6v6c0 4.2 3 7.4 7 9 4-1.6 7-4.8 7-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  "noc-soc": '<path d="M3 12h3.5l2.2 6 4.2-13 2.3 8.5 1.6-1.5H21"/>',
  "unified-comms": '<path d="M5 4h4l2 5-2.4 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  "voice-data-internet": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>',
  "physical-security": '<path d="M3 8h11v8H3z"/><path d="m14 11 7-3v8l-7-3z"/><circle cx="7.5" cy="12" r="1.6"/>',
  "it-support": '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8m-4-4v4"/>',
  "professional-services": '<circle cx="12" cy="8" r="3.4"/><path d="M5 20a7 7 0 0 1 14 0"/>',
};

/* Cards now carry the service colour and its mark, and the whole card is the
   link to that service's page. */
const cards = SERVICES.map(
  (s) => `<a href="solution-${s.slug}.html"
          class="eg-inview group relative flex flex-col overflow-hidden rounded-2xl bg-paper-2 p-6 shadow-[0_18px_40px_-32px_rgb(28_36_48/0.55)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_52px_-28px_rgb(8_136_197/0.5)]">
          <span class="absolute inset-x-0 top-0 h-1" style="background:linear-gradient(90deg,${ACCENT[s.slug]},${ACCENT[s.slug]}22)"></span>
          <span class="grid h-12 w-12 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style="background:${ACCENT[s.slug]}16;color:${ACCENT[s.slug]}">
            <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6"
                 stroke-linecap="round" stroke-linejoin="round">${MARK[s.slug]}</svg>
          </span>
          <span class="mt-4 font-mono text-[10px] uppercase tracking-widest" style="color:${ACCENT[s.slug]}">Service ${String(s.n).padStart(2, "0")}</span>
          <h3 class="mt-1 font-display text-2xl group-hover:text-gold">${s.title}</h3>
          <p class="mt-2 text-sm text-ink/70">${s.blurb}</p>
          <span class="mt-4 font-mono text-[10px] uppercase tracking-widest" style="color:${ACCENT[s.slug]}">Read more &rarr;</span>
        </a>`,
).join("\n        ");

let body = parts.main;

/* Each operation must change something. A no-op here is a silent regression. */
const apply = (label, fn) => {
  const before = body;
  body = fn(body);
  if (body === before) throw new Error(`home surgery "${label}" matched nothing`);
};

const cut = (label, startMark, endMark) =>
  apply(label, (s) => {
    const a = s.indexOf(startMark);
    const b = s.indexOf(endMark, a);
    if (a === -1 || b === -1) return s;
    return s.slice(0, a) + s.slice(b);
  });

/* 1. The nine service cards become coloured and clickable. */
apply("service cards", (s) => {
  const open = s.indexOf('<div class="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">');
  const close = s.indexOf("</section>", open);
  if (open === -1 || close === -1) return s;
  return (
    s.slice(0, open) +
    `<div class="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">\n        ${cards}\n      </div>\n    ` +
    s.slice(close)
  );
});

/* 2. "Custom solutions" comes out — the client asked for it gone, and the
      service pages now carry that material properly. */
cut("custom solutions section", '<section class="border-t border-rule bg-paper-2">', '<section id="partners"');

/* 3. "Get in touch" comes out of the homepage; Contact is its own page. */
cut("contact section", '<section id="contact"', "</main>");

/* 4. Which leaves the hero buttons pointing at an anchor that no longer
      exists. They go to the Contact page, like every other contact route on
      the site. The link checker catches this if it is ever missed. */
apply("contact anchors", (s) => s.split('href="#contact"').join('href="contact.html"'));

/* 5. The partner band showed names set as type. It shows their marks. */
apply("partner marks", (s) => {
  const open = s.indexOf('<ul class="mt-10 flex flex-wrap gap-3">', s.indexOf('id="partners"'));
  const close = s.indexOf("</ul>", open);
  if (open === -1 || close === -1) return s;
  const band = `<ul class="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-rule sm:grid-cols-4">
        ${PARTNERS.map(
          (p) => `<li class="grid place-items-center bg-paper-2 px-5 py-7">
          <img src="logos/${p.logo}.png" alt="${p.name}" width="240" height="160"
               class="h-14 w-auto max-w-[10rem] object-contain" decoding="async">
        </li>`,
        ).join("")}
      `;
  return s.slice(0, open) + band + s.slice(close);
});

export default {
  title: "Edge COMM-TECH — Infrastructure built to international standards",
  desc: "Edge Communication Technologies — ICT systems integration in Addis Ababa.",
  body,
};
