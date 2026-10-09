/*
 * Emits every Highland page from one shell.
 *
 * The head and styles are the approved page's, lifted verbatim by extract.mjs.
 * The header and footer are rebuilt here rather than lifted: the header's links
 * have to vary per page (current-page marking, and Contact us pointing at a
 * real page rather than an anchor), and the footer's every fact now comes from
 * the content model -- see the note above it for why.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { NAV, COMPANY, CONTACT, SOLUTIONS, SERVICES, PROJECTS } from "./content.mjs";
import { NEWS, EVENTS, RESOURCE_SECTIONS } from "./editorial.mjs";
import { JOBS } from "./people.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const parts = JSON.parse(readFileSync(path.join(here, "shell-parts.json"), "utf8"));

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/*
 * Footer, built from the content model.
 *
 * It used to be the single-page design's footer with string surgery applied to
 * it. That stopped being tenable: against Edge's approved content the inherited
 * footer had the wrong office address, the wrong telephone number, an email
 * address Edge does not publish, five solution names from the retired taxonomy
 * (including "NOC and SOC services", which is not a thing Edge offers), and two
 * mottos that were never Edge's.
 *
 * Wrong contact details on fifty-one pages is not a tidying job, so the markup
 * below is generated instead -- same grid, same type, every fact from CONTACT,
 * SOLUTIONS and NAV. `parts.footer` is deliberately no longer read.
 */
const footer = `<footer class="border-t border-rule bg-paper-2">
    <div class="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-5">
      <div class="lg:col-span-2">
        <img src="edge-logo.png" alt="Edge Communication Technologies" width="391" height="176"
             class="h-16 w-auto" decoding="async">
        <p class="mt-3 max-w-sm text-sm text-ink/70">
          An integrated technology company in Addis Ababa, delivering the infrastructure, security, software and
          support that Ethiopian banks, universities and public institutions depend on.
        </p>
        <p class="mt-4 flex flex-wrap gap-2">
          <a href="${CONTACT.whatsapp}" class="rounded-full border border-rule px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink/70 transition hover:border-gold hover:text-gold">WhatsApp</a>
          <a href="subscribe.html" class="rounded-full border border-rule px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink/70 transition hover:border-gold hover:text-gold">Subscribe</a>
        </p>
      </div>

      <div>
        <h4 class="font-display text-sm">Solutions</h4>
        <ul class="mt-3 space-y-1.5 text-sm text-ink/70">
          ${SOLUTIONS.map(
            (x) => `<li><a href="solution-${x.slug}.html" class="hover:text-gold">${esc(x.short)}</a></li>`,
          ).join("\n          ")}
          <li><a href="services.html" class="hover:text-gold">Professional services</a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-display text-sm">Company</h4>
        <ul class="mt-3 space-y-1.5 text-sm text-ink/70">
          ${NAV.filter(([, href]) => href !== "solutions.html")
            .map(([label, href]) => `<li><a href="${href}" class="hover:text-gold">${esc(label)}</a></li>`)
            .join("\n          ")}
          <li><a href="contact.html" class="hover:text-gold">Contact</a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-display text-sm">Get in touch</h4>
        <ul class="mt-3 space-y-1.5 text-sm text-ink/70">
          <li>${CONTACT.office.slice(1).map(esc).join("<br>")}</li>
          ${CONTACT.emails.map((e) => `<li><a href="mailto:${e.value}" class="hover:text-gold">${e.value}</a></li>`).join("\n          ")}
          ${CONTACT.phones.map((t) => `<li><a href="tel:${t.tel}" class="hover:text-gold">${esc(t.value)}</a></li>`).join("\n          ")}
        </ul>
      </div>
    </div>

    <div class="mx-auto flex max-w-6xl flex-col gap-3 border-t border-rule px-6 py-6 text-sm text-steel md:flex-row md:justify-between">
      <p>&copy; ${new Date().getFullYear()} ${esc(COMPANY.legal)}. All rights reserved.</p>
      <p class="text-ink/50">Design review build &mdash; content pending final approval.</p>
    </div>
  </footer>`;

/*
 * Shared motion. Defined once here so pages opt in with a class rather than
 * each carrying its own keyframes.
 *
 * Two rules govern everything below. Content is never hidden by a missing
 * animation: `eg-inview` lives inside an @supports block, so a browser
 * without scroll-driven animations simply shows the element. And
 * prefers-reduced-motion switches the lot off rather than merely slowing it.
 */
const ANIM_CSS = `<style>
/* These animate the independent translate, scale and rotate properties
   rather than transform, and the difference is load-bearing.

   Animating transform with "both" fill mode means the animation's resting
   value wins the cascade over any transform an element also carries. That
   silently killed every hover:-translate-y lift on an .eg-inview card, and it
   wiped the -translate-x-1/2 -translate-y-1/2 centring on the partners ring
   nodes and hub, pushing a node past the viewport edge.

   translate/scale/rotate compose with transform instead of replacing it, so
   Tailwind's utilities and the motion can coexist. */
@keyframes eg-rise{from{opacity:0;translate:0 16px}to{opacity:1;translate:none}}
@keyframes eg-pop{from{opacity:0;scale:.82}to{opacity:1;scale:none}}
@keyframes eg-draw{to{stroke-dashoffset:0}}
@keyframes eg-breathe{0%,100%{scale:1}50%{scale:1.035}}
@keyframes eg-spin{to{rotate:360deg}}

.eg-rise{animation:eg-rise .7s cubic-bezier(.2,.7,.3,1) both;animation-delay:var(--d,0s)}
.eg-pop{animation:eg-pop .55s cubic-bezier(.2,.9,.3,1.25) both;animation-delay:var(--d,0s)}
.eg-draw{stroke-dasharray:var(--len,320);stroke-dashoffset:var(--len,320);
  animation:eg-draw 1s ease-out both;animation-delay:var(--d,0s)}
.eg-breathe{animation:eg-breathe 6s ease-in-out infinite;transform-origin:center;transform-box:fill-box}
.eg-spin-slow{animation:eg-spin 120s linear infinite;transform-origin:center;transform-box:fill-box}

/* Below the fold, play on scroll rather than on load, so nothing animates
   where nobody is looking. Unsupported browsers just show the element. */
@supports (animation-timeline: view()){
  .eg-inview{animation:eg-rise .7s cubic-bezier(.2,.7,.3,1) both;
    animation-timeline:view();animation-range:entry 0% entry 50%}
}

@media (prefers-reduced-motion:reduce){
  .eg-rise,.eg-pop,.eg-draw,.eg-breathe,.eg-spin-slow,.eg-inview{animation:none!important}
  .eg-draw{stroke-dasharray:none;stroke-dashoffset:0}
}
</style>`;

const navFor = (file) => `<header class="sticky top-0 z-40 border-b border-rule bg-paper/90 text-ink backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
      <a href="index.html" class="shrink-0 leading-none">
        <img src="edge-logo.png" alt="Edge Communication Technologies"
             width="391" height="176" class="h-14 w-auto" decoding="async">
      </a>
      <nav class="hidden items-center gap-5 text-sm lg:flex" aria-label="Main">
        ${NAV.map(([label, href]) =>
          `<a href="${href}" class="${href === file ? "text-gold" : "text-ink/70 hover:text-gold"}"${
            href === file ? ' aria-current="page"' : ""
          }>${esc(label)}</a>`).join("\n        ")}
      </nav>
      <a href="contact.html" class="hidden rounded-full bg-gold px-4 py-2 text-sm text-white md:inline-block">Contact us</a>
    </div>
    <nav class="flex gap-4 overflow-x-auto border-t border-rule px-6 py-2.5 text-xs lg:hidden">
      ${NAV.map(([label, href]) =>
        `<a href="${href}" class="whitespace-nowrap ${href === file ? "text-gold" : "text-ink/70"}">${esc(label)}</a>`,
      ).join("\n      ")}
      <a href="contact.html" class="whitespace-nowrap text-gold">Contact</a>
    </nav>
  </header>`;

const shell = ({ file, title, desc, body }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Fragment+Mono&family=Geologica:wght@400;600;700&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            ink: { DEFAULT: "#1c2430", 2: "#2a3544" },
            paper: { DEFAULT: "#eef6f4", 2: "#ffffff" },
            gold: { DEFAULT: "#0888c5", 2: "#056a9a" },
            lamp: "#c48a5a",
            steel: "#5c6b76",
            rule: "#0888c530",
          },
          fontFamily: {
            display: ["Geologica", "Segoe UI", "sans-serif"],
            sans: ["Atkinson Hyperlegible", "Segoe UI", "sans-serif"],
            mono: ["Fragment Mono", "ui-monospace", "monospace"],
          },
        },
      },
    };
  </script>
  ${parts.styles}
  ${ANIM_CSS}
</head>
<body>
  ${navFor(file)}

${body}

  ${footer}
</body>
</html>
`;

/*
 * Registry.
 *
 * Thirty-two of the pages come from seven factories, so a new solution,
 * service, project, vacancy, event or news item needs a content entry and
 * nothing here. The nineteen singletons are listed in the order the site's
 * navigation reads.
 *
 * `one` and `many` exist only to keep that intent legible: a reader should be
 * able to see at a glance which pages are hand-written and which are generated
 * from the content model.
 */
const one = (file, mod) => [file, () => import(`./pages/${mod}.mjs`)];
const many = (mod, items, file) =>
  items.map((it) => [file(it), () => import(`./pages/${mod}.mjs`).then((m) => ({ default: m.make(it.slug) }))]);

const MEDIA = RESOURCE_SECTIONS.filter((s) => s.file.startsWith("media-"));

const PAGES = [
  one("index.html", "home"),

  /* Solutions and services */
  one("solutions.html", "solutions"),
  ...many("solution", SOLUTIONS, (s) => `solution-${s.slug}.html`),
  one("services.html", "services"),
  ...many("service", SERVICES, (s) => `service-${s.slug}.html`),

  /* Evidence */
  one("projects.html", "projects"),
  ...many("project", PROJECTS, (p) => `project-${p.slug}.html`),
  one("clients.html", "clients"),
  one("partners.html", "partners"),

  /* Resource centre */
  one("resources.html", "resources"),
  one("news.html", "news"),
  ...many("news-article", NEWS, (n) => `news-${n.slug}.html`),
  ...many("media", MEDIA, (m) => m.file),
  one("events.html", "events"),
  ...many("event", EVENTS, (e) => `event-${e.slug}.html`),
  one("downloads.html", "downloads"),
  one("subscribe.html", "subscribe"),
  one("blog.html", "blog"),

  /* People */
  one("careers.html", "careers"),
  one("careers-open-positions.html", "careers-open-positions"),
  ...many("job", JOBS, (j) => `job-${j.slug}.html`),
  one("careers-internships.html", "careers-internships"),
  one("careers-e-academy.html", "careers-e-academy"),

  /* Company */
  one("about.html", "about"),
  one("executive-management.html", "executive-management"),
  one("contact.html", "contact"),
];

const outDir = process.argv[2];
if (!outDir) throw new Error("usage: node gen.mjs <outDir>");
mkdirSync(outDir, { recursive: true });

const written = new Set();
for (const [file, load] of PAGES) {
  const { title, desc, body } = await load().then((m) => m.default);
  writeFileSync(path.join(outDir, file), shell({ file, title, desc, body }));
  written.add(file);
}

/* Remove pages from an earlier run that this one no longer generates.
   Without this, a renamed slug leaves the old file behind and it ships --
   stale, unlinked and carrying whatever the nav looked like at the time.
   Only top-level .html is pruned; assets and asset folders are left alone. */
const stale = readdirSync(outDir, { withFileTypes: true })
  .filter((e) => e.isFile() && e.name.endsWith(".html") && !written.has(e.name))
  .map((e) => e.name);
for (const file of stale) rmSync(path.join(outDir, file));

console.log(
  `wrote ${PAGES.length} page(s) to ${outDir}` +
    (stale.length ? `, removed ${stale.length} stale page(s): ${stale.join(", ")}` : ""),
);

export { shell, navFor, esc };
