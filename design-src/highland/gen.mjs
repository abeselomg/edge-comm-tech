/*
 * Emits every Highland page from one shell.
 *
 * The head, styles and footer are the approved page's, lifted verbatim by
 * extract.mjs. The header is rebuilt here rather than lifted, because its
 * links have to vary per page (current-page marking, and Contact us pointing
 * at a real page rather than an anchor).
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { NAV, SERVICES } from "./content.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const parts = JSON.parse(readFileSync(path.join(here, "shell-parts.json"), "utf8"));

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* The footer came from a single-page design, where these were section
   anchors. They are now separate pages, and a footer reused on fourteen
   pages cannot carry links that only resolve on one. */
const FOOTER_REWRITES = [
  ['href="#about"', 'href="about.html"'],
  ['href="#partners"', 'href="partners.html"'],
  ['href="#solutions"', 'href="solutions.html"'],
  ['href="#clients"', 'href="about.html#clients"'],
  ['href="#contact"', 'href="contact.html"'],
];

let footer = FOOTER_REWRITES.reduce((s, [a, b]) => s.split(a).join(b), parts.footer);

/* Same reason: that sentence claimed Academy/Career/Blog weren't published
   yet, which stops being true the moment those pages exist -- along with
   the sr-only spans that gave its anchors somewhere to land. */
const FOOTER_REMOVALS = [
  '\n      <p id="academy" class="text-ink/50">Academy, Career and Blog are not published yet.</p>',
  '\n    <span id="career" class="sr-only"></span>',
  '\n    <span id="blog" class="sr-only"></span>',
];
for (const s of FOOTER_REMOVALS) footer = footer.split(s).join("");

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
@keyframes eg-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes eg-pop{from{opacity:0;transform:scale(.82)}to{opacity:1;transform:none}}
@keyframes eg-draw{to{stroke-dashoffset:0}}
@keyframes eg-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}
@keyframes eg-spin{to{transform:rotate(360deg)}}

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
      <a href="index.html" class="leading-none">
        <span class="block font-mono text-[10px] uppercase tracking-[0.35em] text-gold">Edge</span>
        <span class="font-display text-xl tracking-tight">COMM-TECH</span>
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

/* Registry. Later tasks add to this list and nothing else changes. */
const PAGES = [
  ["index.html", () => import("./pages/home.mjs")],
  ["contact.html", () => import("./pages/contact.mjs")],
  ["about.html", () => import("./pages/about.mjs")],
  ["partners.html", () => import("./pages/partners.mjs")],
  ["solutions.html", () => import("./pages/solutions.mjs")],
  /* One page per service, from a single factory: a tenth service needs a
     content entry and nothing here but another SERVICES row. */
  ...SERVICES.map((svc) => [
    `solution-${svc.slug}.html`,
    () => import("./pages/solution.mjs").then((m) => ({ default: m.make(svc.slug) })),
  ]),
  ["projects.html", () => import("./pages/projects.mjs")],
  ["project-bonga.html", () => import("./pages/project-bonga.mjs")],
  ["academy.html", () => import("./pages/academy.mjs")],
  ["course-soc.html", () => import("./pages/course-soc.mjs")],
  ["career.html", () => import("./pages/career.mjs")],
  ["job-network-engineer.html", () => import("./pages/job-network-engineer.mjs")],
  ["blog.html", () => import("./pages/blog.mjs")],
  ["blog-post.html", () => import("./pages/blog-post.mjs")],
];

const outDir = process.argv[2];
if (!outDir) throw new Error("usage: node gen.mjs <outDir>");
mkdirSync(outDir, { recursive: true });

for (const [file, load] of PAGES) {
  const { title, desc, body } = await load().then((m) => m.default);
  writeFileSync(path.join(outDir, file), shell({ file, title, desc, body }));
}
console.log(`wrote ${PAGES.length} page(s) to ${outDir}`);

export { shell, navFor, esc };
