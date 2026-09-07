import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const here = path.dirname(fileURLToPath(import.meta.url));

export const content = JSON.parse(
  readFileSync(path.join(here, "content.json"), "utf8"),
);

export const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const num = (n) => String(n).padStart(2, "0");

/**
 * Unconfirmed figures. Edge has not given us headcount, years operating,
 * project counts or contact details, so every one of them is wrapped and
 * visibly marked rather than passed off as real.
 */
export const PLACEHOLDER = {
  years: "18",
  engineers: "140",
  projects: "260",
  clients: "90",
  phone: "+251 11 000 0000",
  email: "hello@edgecomm-tech.et",
  address: "Bole Road, Addis Ababa",
};

export const ph = (v) => `<span class="ph">${esc(v)}</span>`;

/** Shared marker styling, kept identical across all six so the client learns it once. */
export const PLACEHOLDER_CSS = `
.ph{position:relative;border-bottom:1px dashed currentColor;opacity:.95}
.ph::after{content:"▪";font-size:.55em;vertical-align:super;margin-left:.15em;opacity:.8}
.ph-note{display:flex;gap:.6rem;align-items:flex-start;font-size:.8125rem;line-height:1.5}
.ph-note b{font-weight:600}
`;

export const phNote = (cls = "") => `
<p class="ph-note ${cls}"><span aria-hidden="true">▪</span><span>Figures and contact details marked with a square are <b>placeholders</b>. Edge has not confirmed headcount, years operating, project counts or phone numbers, so nothing here should be quoted.</span></p>`;

export const FONTS = {
  manrope:
    "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;800&display=swap",
  plex: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap",
  document:
    "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap",
  archivo:
    "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;800&family=IBM+Plex+Mono:wght@400&display=swap",
  grotesk:
    "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400&display=swap",
  chivo:
    "https://fonts.googleapis.com/css2?family=Chivo:wght@400;500;700;900&family=IBM+Plex+Mono:wght@400&display=swap",
};

/** Bare document shell. Each design brings its own reset and system. */
export function page({ id, title, font, css, body }) {
  return `<!doctype html>
<html lang="en" data-design="${id}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(title)} — Edge COMM-TECH</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${font}">
<style>
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
button{font:inherit}
h1,h2,h3,h4,p,ul,ol,dl,dd,figure{margin:0}
ul,ol{padding:0;list-style:none}
:focus-visible{outline:2px solid currentColor;outline-offset:3px}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
${PLACEHOLDER_CSS}
${css}
</style>
</head>
<body>
${body}
${switcher(id)}
</body>
</html>`;
}

const DESIGNS = [
  ["01", "Split", "01-split.html"],
  ["02", "Console", "02-console.html"],
  ["03", "Document", "03-document.html"],
  ["04", "Poster", "04-poster.html"],
  ["05", "Topology", "05-topology.html"],
  ["06", "Stack", "06-stack.html"],
];

export { DESIGNS };

/** Fixed switcher so the client can flip between all six without going back. */
function switcher(active) {
  const links = DESIGNS.map(
    ([n, label, file]) =>
      `<a href="${file}"${n === active ? ' aria-current="page"' : ""}><b>${n}</b> ${esc(label)}</a>`,
  ).join("");
  return `
<style>
.dsw{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:9999;
display:flex;gap:2px;padding:4px;border-radius:999px;max-width:calc(100vw - 24px);overflow-x:auto;
background:rgba(8,12,22,.86);backdrop-filter:blur(12px);border:1px solid rgba(226,232,240,.16);
font:500 12px/1 ui-sans-serif,system-ui,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,.45)}
.dsw a{display:flex;gap:.4em;align-items:center;white-space:nowrap;padding:8px 12px;border-radius:999px;
color:rgba(230,235,244,.62);text-decoration:none}
.dsw a b{font-weight:600;opacity:.6}
.dsw a:hover{color:#fff}
.dsw a[aria-current]{background:#e6ebf4;color:#0a101c}
.dsw a[aria-current] b{opacity:.55}
@media print{.dsw{display:none}}
</style>
<nav class="dsw" aria-label="Design directions">${links}</nav>`;
}
