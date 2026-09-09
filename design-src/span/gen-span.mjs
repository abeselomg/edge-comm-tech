import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { OBJECT_KEYS, object3d } from "./objects3d.mjs";
import { netviz, netvizCss } from "./netviz.mjs";

/*
 * Edge COMM-TECH homepage in the design language of span.framer.ai.
 *
 * What is taken from Span: the compositional system — near-black blue ground
 * with radial glows, centred section anatomy (pill eyebrow, two-line heading,
 * muted sub), the floating pill nav, the tight-tracked Switzer ramp, the
 * stat card, the dark bordered cards.
 *
 * What is Edge's: every word, the nine services, the real clients, partners
 * and contact details, and the accent — their own brand blue #0888c5, which
 * sits almost exactly where Span's #0099ff does.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const logoDir = path.join(here, "logos");

const b64 = (f) =>
  `data:image/png;base64,${readFileSync(path.join(logoDir, f)).toString("base64")}`;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ---------------------------------------------------------------- content */

const SERVICES = [
  ["Datacenter Facility",
   "Designed and built to house IT infrastructure with high-quality materials, industry-leading standards and Tier-rated architecture.",
   ["Tier-rated", "Power", "Cooling", "Containment"]],
  ["Networks (LAN/WLAN)",
   "Campus and wireless networks delivered with our manufacturing partners — the experience and expertise the design actually needs.",
   ["LAN", "WLAN", "Routing", "Switching"]],
  ["Cybersecurity",
   "A complete portfolio of network and data security services, plus the staff of security professionals who operate them.",
   ["Network security", "Data security"]],
  ["NOC and SOC services",
   "Build carrier-grade network operations and security operations centres, and the practice that runs them.",
   ["NOC", "SOC", "Monitoring"]],
  ["Unified Communications",
   "Phone services with unified voice, presence, chat, mobile and data integration across the organisation.",
   ["Voice", "Presence", "Chat", "Mobile"]],
  ["Voice / Data / Internet services",
   "A wide array of plan options and service alternatives, with all telecom and unified communication elements integrated end to end as a fully managed service.",
   ["Managed", "End to end"]],
  ["CCTV and Physical security",
   "Design and installation of CCTV, access control systems, gate barriers, turnstiles and related physical security.",
   ["CCTV", "Access control", "Turnstiles"]],
  ["IT service / Desktop support",
   "Remote and on-site IT helpdesk for enterprise network infrastructure, servers, software and systems.",
   ["Helpdesk", "On-site", "Remote"]],
  ["Professional services",
   "Expert-level certified network and system engineers specialising in design, configuration and troubleshooting.",
   ["Design", "Configuration", "Troubleshooting"]],
];

const PILLARS = [
  ["Advise",
   "We start from what you actually have and what it costs you to run it, then say plainly what should change and in what order."],
  ["Implement",
   "Certified network and system engineers do the design, the configuration and the commissioning — to international standards, not to whatever fits."],
  ["Manage",
   "Continuous follow-up and optimised after-sales service. The contract that builds it is the contract that keeps it running."],
];

const CUSTOM = [
  ["Private residences", "Networks, surveillance and access control for homes and residential compounds."],
  ["Organizations", "Campus and enterprise builds for universities, hospitals and public bodies."],
  ["Factories", "Industrial sites where the network and the physical security are one system."],
];

const CLIENTS = [
  ["bonga.png", "Bonga University"],
  ["bahirdar.png", "Bahir Dar University"],
  ["haramaya.png", "Haramaya University"],
  ["mizantepi.png", "Mizan-Tepi University"],
  ["yekatit.png", "Yekatit 12 Hospital"],
];

const PARTNERS = [
  ["cisco.png", "Cisco"], ["dell.png", "Dell"], ["hp.png", "HP"],
  ["huawei.png", "Huawei"], ["paloalto.png", "Palo Alto Networks"],
  ["vertiv.png", "Vertiv"], ["tripplite.png", "Tripp Lite"],
  ["canovate.png", "Canovate Group"],
];


/* Filter categories. A partner sits in every category it actually
   supplies, so several appear under more than one. */
const CATS = [
  ["all", "All partners"],
  ["net", "Networking"],
  ["sec", "Security"],
  ["cmp", "Compute and storage"],
  ["pwr", "Power and cooling"],
  ["rck", "Racks and cabling"],
];

const PARTNER_CATS = {
  Cisco: ["net", "sec"],
  Dell: ["net", "cmp"],
  HP: ["cmp"],
  Huawei: ["net"],
  "Palo Alto Networks": ["sec"],
  Vertiv: ["pwr"],
  "Tripp Lite": ["pwr", "rck"],
  "Canovate Group": ["rck"],
};

/* "c-net c-sec" — the classes the filter selectors switch on. */
const catClasses = (name) => (PARTNER_CATS[name] ?? []).map((k) => `c-${k}`).join(" ");

const catCount = (k) =>
  k === "all"
    ? PARTNERS.length
    : PARTNERS.filter(([, n]) => (PARTNER_CATS[n] ?? []).includes(k)).length;

/* ------------------------------------------------------------------- icons */

const ICONS = {
  rack: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M7 6h.01M7 12h.01M7 18h.01"/>',
  net: '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v5m0 0-5 5m5-5 5 5"/>',
  shield: '<path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z"/><path d="m9 12 2 2 4-4"/>',
  ops: '<path d="M3 12h4l2 6 4-14 2 8h6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>',
  cam: '<path d="M3 8h11v8H3z"/><path d="m14 11 7-3v8l-7-3z"/><circle cx="7" cy="12" r="1.5"/>',
  desk: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8m-4-4v4"/>',
  wrench: '<path d="M14 6a4 4 0 0 1 5 5l-8 8a2.8 2.8 0 0 1-4-4l8-8a4 4 0 0 1-1-1z"/>',
};
const SERVICE_ICONS = ["rack", "net", "shield", "ops", "phone", "globe", "cam", "desk", "wrench"];

const icon = (k) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>`;

/* Dimensional variant for the drifting field: a gradient stroke that runs
   light-to-deep across the glyph, a soft interior fill, and a rim highlight
   offset behind it. Reads as a lit object rather than a flat outline. */
const icon3d = (k, i) => `<svg viewBox="0 0 24 24" aria-hidden="true">
<defs>
<linearGradient id="s${i}" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#d6f1ff"/><stop offset=".42" stop-color="#4fc3f7"/>
<stop offset="1" stop-color="#0a4d94"/></linearGradient>
<linearGradient id="f${i}" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#7ad4ff" stop-opacity=".34"/>
<stop offset="1" stop-color="#0a4d94" stop-opacity=".04"/></linearGradient>
</defs>
<g fill="url(#f${i})" stroke="#0a4d94" stroke-width="2.6" stroke-linecap="round"
stroke-linejoin="round" opacity=".5" transform="translate(.5,.7)">${ICONS[k]}</g>
<g fill="url(#f${i})" stroke="url(#s${i})" stroke-width="1.45" stroke-linecap="round"
stroke-linejoin="round">${ICONS[k]}</g>
</svg>`;

/* --------------------------------------------------------------------- css */

/* One rule set per category: light the pill, dim everything the category
   does not cover, and reveal that category's tally line. */
const filterCss = `
${CATS.map(([k]) => `#f-${k}:checked~.filter-bar label[for=f-${k}]`).join(",")}{
background:linear-gradient(180deg,#1a72ba,#0b4a8f);border-color:var(--blue-lift);color:#fff;
box-shadow:0 0 0 1px rgba(63,184,245,.28),0 8px 22px rgba(8,80,150,.34)}
${CATS.map(([k]) => `#f-${k}:checked~.filter-bar label[for=f-${k}] b`).join(",")}{color:#bfe4fb}
${CATS.map(([k]) => `#f-${k}:focus-visible~.filter-bar label[for=f-${k}]`).join(",")}{
outline:2px solid var(--blue-glow);outline-offset:2px}
${CATS.filter(([k]) => k !== "all")
  .map(
    ([k]) => `
#f-${k}:checked~.orbit .node:not(.c-${k}){opacity:.14;filter:saturate(.2);pointer-events:none}
#f-${k}:checked~.orbit .sp:not(.c-${k}){opacity:.1}
#f-${k}:checked~.logos figure:not(.c-${k}){opacity:.16;filter:grayscale(1)}
#f-${k}:checked~.tally .t-${k}{display:block}`,
  )
  .join("")}
#f-all:checked~.tally .t-all{display:block}`;

const css = `
:root{
  --void:#000309;
  --ink:#03060e;
  --surface:rgba(255,255,255,.026);
  --surface-2:rgba(255,255,255,.05);
  --line:rgba(255,255,255,.09);
  --line-2:rgba(255,255,255,.14);
  --text:#ffffff;
  --muted:#93a4bd;
  --muted-2:#67788f;
  --blue:#0888c5;          /* Edge's brand blue, kept for UI */
  --blue-lift:#3fb8f5;
  --blue-glow:#7ad4ff;     /* the luminous end, for atmosphere only */
  --blue-deep:#0b4a8f;
  --blue-pale:#b8d7ff;
}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{margin:0;color:var(--text);
background:var(--void);
background-image:radial-gradient(120% 60% at 50% 0%,#061426 0%,#000309 62%);
background-attachment:fixed;
font-family:Switzer,"Switzer Placeholder",system-ui,-apple-system,sans-serif;
font-size:14px;line-height:1.45;font-weight:500;letter-spacing:-.02em;
-webkit-font-smoothing:antialiased;overflow-x:hidden}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
h1,h2,h3,h4,p,figure,dl,dd{margin:0}
ul,ol{margin:0;padding:0;list-style:none}
button{font:inherit}
:focus-visible{outline:2px solid var(--blue-lift);outline-offset:3px;border-radius:6px}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
.mono{font-family:"Fragment Mono",ui-monospace,monospace;letter-spacing:0}

.wrap{width:100%;max-width:1200px;margin:0 auto;padding:0 24px}
.center{text-align:center}

/* ---- placeholders ---- */
.ph{border-bottom:1px dashed rgba(255,255,255,.4)}
.ph::after{content:"▪";font-size:.55em;vertical-align:super;margin-left:.15em;opacity:.85}
.ph-note{display:flex;gap:.55rem;align-items:flex-start;max-width:64ch;margin:0 auto;
font-size:12px;line-height:1.5;color:var(--muted-2)}
.ph-note b{color:var(--muted);font-weight:600}

/* ---- nav ---- */
.nav{position:fixed;inset:0 0 auto;z-index:60;padding:18px 24px;
display:flex;align-items:center;justify-content:space-between;gap:16px;
background:linear-gradient(var(--void) 40%,transparent)}
.brand{display:flex;align-items:center;gap:10px}
.brand img{height:34px;width:34px;filter:brightness(0) invert(1)}
.brand .v{font-size:11px;color:var(--muted-2);border:1px solid var(--line);
border-radius:99px;padding:2px 7px}
.pillnav{display:none;gap:2px;padding:5px;border-radius:99px;
background:rgba(255,255,255,.045);border:1px solid var(--line);backdrop-filter:blur(14px)}
.pillnav a{padding:8px 14px;border-radius:99px;font-size:13px;color:#cfe0f2;
transition:background .15s,color .15s}
.pillnav a:hover{background:rgba(255,255,255,.08);color:#fff}
.pillnav a[aria-current]{background:rgba(63,184,245,.16);color:#fff}

/* Below the pill's breakpoint the bar would otherwise carry no navigation at
   all, so the same links open as a panel. Checkbox rather than script, to keep
   these files standalone. */
.navtog{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
.burger{display:flex;flex-direction:column;justify-content:center;gap:5px;
width:42px;height:38px;padding:0 10px;cursor:pointer;border-radius:9px;
background:rgba(255,255,255,.045);border:1px solid var(--line);
/* The bar is space-between; without this the burger sits marooned in the
   middle once the pill is hidden. Auto margin gathers it to the CTA. */
margin-left:auto}
.burger span{display:block;height:1.5px;border-radius:2px;background:#cfe0f2;
transition:transform .2s,opacity .2s}
.navtog:checked~.burger span:nth-child(1){transform:translateY(6.5px) rotate(45deg)}
.navtog:checked~.burger span:nth-child(2){opacity:0}
.navtog:checked~.burger span:nth-child(3){transform:translateY(-6.5px) rotate(-45deg)}
.navtog:focus-visible~.burger{outline:2px solid var(--blue-glow);outline-offset:2px}
.navtog:checked~.pillnav{display:flex;flex-direction:column;gap:2px;
position:absolute;left:16px;right:16px;top:72px;padding:8px;border-radius:14px;
background:rgba(6,14,26,.94);box-shadow:0 24px 60px rgba(0,6,16,.7)}
.navtog:checked~.pillnav a{padding:13px 14px;border-radius:9px;font-size:15px}

@media (min-width:940px){
  .pillnav{display:flex}
  .burger{display:none}
  /* The panel rules must not survive past the breakpoint if the box is
     still ticked from a narrower window. */
  .navtog:checked~.pillnav{flex-direction:row;position:static;padding:5px;
    border-radius:99px;background:rgba(255,255,255,.045);box-shadow:none}
  .navtog:checked~.pillnav a{padding:8px 14px;border-radius:99px;font-size:13px}
}
.navcta{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:9px;
background:#fff;color:#04101c;font-size:13px;font-weight:600;white-space:nowrap}
.navcta:hover{background:var(--blue-pale)}

/* ---- hero ---- */
.hero{position:relative;padding:140px 0 104px;overflow:hidden}
/* Ambient blue in the upper corners, the way the reference lights its top edge. */
.hero::before{content:"";position:absolute;inset:-40% -20% auto -20%;height:1400px;
pointer-events:none;z-index:0;
background:
  radial-gradient(34% 40% at 14% 30%,rgba(63,184,245,.26),transparent 68%),
  radial-gradient(34% 40% at 86% 28%,rgba(63,184,245,.24),transparent 68%),
  radial-gradient(58% 52% at 50% 46%,rgba(8,136,197,.20),transparent 74%)}
/* The bright band at the horizon — this is the light source, so it runs hot. */
.hero::after{content:"";position:absolute;left:50%;bottom:calc(-1 * var(--glow-drop,230px));transform:translateX(-50%);
width:2100px;height:660px;border-radius:50%;pointer-events:none;z-index:0;filter:blur(52px);
background:radial-gradient(50% 50% at 50% 50%,
  rgba(214,241,255,.92) 0%,rgba(122,212,255,.80) 14%,rgba(63,184,245,.58) 30%,
  rgba(11,110,190,.34) 48%,rgba(8,48,102,.15) 64%,transparent 78%)}
.arcs{position:absolute;left:50%;top:-260px;transform:translateX(-50%);
width:1700px;pointer-events:none;opacity:.5}

.hero-grid{position:relative;z-index:2;display:grid;gap:56px}
.hero-grid{justify-content:center}
@media (min-width:1000px){.hero-grid{grid-template-columns:minmax(0,900px);gap:0}}
.hero-copy{position:relative;z-index:2;text-align:center}

.badge{display:inline-flex;align-items:center;gap:10px;padding:5px 14px 5px 5px;
border-radius:99px;background:rgba(255,255,255,.05);border:1px solid var(--line);
font-size:12.5px;color:#cfe0f2}
.badge b{background:var(--blue);color:#fff;font-weight:600;font-size:11px;
padding:3px 9px;border-radius:99px}
h1{margin-top:24px;font-size:clamp(38px,5.8vw,66px);line-height:1.06;font-weight:500;
letter-spacing:-.04em;text-wrap:balance}
.hero .sub{margin:20px auto 0;max-width:52ch;color:var(--muted);
font-size:15px;line-height:1.6;font-weight:500}
.acts{margin-top:28px;display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
.btn{display:inline-flex;align-items:center;gap:9px;padding:13px 22px;border-radius:9px;
font-size:14px;font-weight:600;transition:background .16s,border-color .16s,color .16s}
.btn-w{background:#fff;color:#04101c}
.btn-w:hover{background:var(--blue-pale)}
.btn-g{background:rgba(255,255,255,.06);border:1px solid var(--line-2);color:#fff}
.btn-g:hover{border-color:var(--blue-lift);color:var(--blue-lift)}
.btn svg{width:15px;height:15px}

.statcard{position:relative;z-index:2;margin:36px auto 0;max-width:600px;border-radius:18px;
background:linear-gradient(180deg,rgba(10,22,40,.88),rgba(5,12,24,.80));
backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.14);padding:18px 10px;
box-shadow:0 20px 50px rgba(0,6,16,.5);
display:grid;grid-template-columns:repeat(3,1fr)}
.statcard div{padding:4px 14px}
.statcard div + div{border-left:1px solid var(--line)}
.statcard dt{font-size:12.5px;color:#a9bcd6}
.statcard dd{margin-top:8px;font-size:24px;font-weight:600;letter-spacing:-.04em}

/* capability field — drifting behind the whole hero, not beside it */
.heroviz{position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.fx{position:absolute;perspective:700px;
animation:drift var(--dur,13s) ease-in-out var(--del,0s) infinite}
.fx svg{width:100%;height:100%;display:block;overflow:visible;
filter:drop-shadow(0 0 46px rgba(88,200,255,.42))
       drop-shadow(0 22px 30px rgba(0,8,20,.60))}
@keyframes drift{
  0%,100%{transform:translate3d(0,0,0) rotate(var(--r,0deg))}
  50%{transform:translate3d(0,-18px,0) rotate(calc(var(--r,0deg) + 2.5deg))}
}

/* ---- about page ---- */
.hero-about{--glow-drop:500px;padding-bottom:170px}
.mark-chip{display:inline-flex;align-items:center;gap:9px;padding:7px 15px 7px 8px;
border-radius:99px;background:rgba(255,255,255,.05);border:1px solid var(--line)}
.mark-chip img{height:20px;width:auto;filter:brightness(0) invert(1)}
.mark-chip span{font-size:13px;font-weight:600;letter-spacing:-.02em}
.mission{margin:24px auto 0;max-width:26ch;font-size:clamp(24px,3.2vw,38px);
line-height:1.24;font-weight:500;letter-spacing:-.035em;text-wrap:balance}
.mission em{font-style:normal;color:var(--blue-lift)}

.approach{margin-top:52px;display:grid;gap:34px}
@media (min-width:840px){.approach{grid-template-columns:repeat(3,1fr);gap:40px}}
.approach .ix{font-family:"Fragment Mono",monospace;font-size:12px;color:var(--blue-lift)}
.approach h3{margin-top:14px;font-size:19px;font-weight:600;letter-spacing:-.03em}
.approach p{margin-top:10px;color:var(--muted);font-size:13.5px;line-height:1.62}
.approach figure{margin-top:22px;height:120px;display:grid;place-items:center}
.approach svg{width:100%;height:100%;overflow:visible}

.people{margin-top:44px;display:grid;gap:14px}
@media (min-width:640px){.people{grid-template-columns:repeat(2,1fr)}}
@media (min-width:1040px){.people{grid-template-columns:repeat(4,1fr)}}
.person{border:1px solid var(--line);border-radius:16px;padding:22px;text-align:left;
background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.012))}
.person .ic{width:40px;height:40px;border-radius:11px;display:grid;place-items:center;
background:rgba(8,136,197,.16);border:1px solid rgba(8,136,197,.36);color:var(--blue-lift)}
.person .ic svg{width:20px;height:20px}
.person h3{margin-top:18px;font-size:16px;font-weight:600;letter-spacing:-.03em}
.person p{margin-top:8px;color:var(--muted);font-size:13px;line-height:1.6}
.hiring{margin:38px auto 0;max-width:52ch;color:var(--muted);font-size:14px;line-height:1.6}

/* ---- partners page ---- */
.crumb-trail{display:flex;gap:.5rem;align-items:center;font-family:"Fragment Mono",monospace;
font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted-2)}
.crumb-trail a:hover{color:var(--blue-lift)}
.crumb-trail span{opacity:.5}
.place{display:inline-flex;align-items:center;gap:.55rem;margin-top:26px;
font-family:"Fragment Mono",monospace;font-size:11px;letter-spacing:.08em;
text-transform:uppercase;color:var(--muted)}
.place i{width:6px;height:6px;border-radius:50%;background:var(--blue-lift);
box-shadow:0 0 0 4px rgba(63,184,245,.18)}

.orbit{position:relative;margin:44px auto 0;width:100%;max-width:760px;aspect-ratio:1}
.orbit svg{position:absolute;inset:0;width:100%;height:100%}
.hub{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
width:31%;aspect-ratio:1;border-radius:50%;display:grid;place-items:center;text-align:center;
background:radial-gradient(circle at 38% 32%,#0e4f8a,#04203f 70%);
border:1px solid rgba(63,184,245,.42);
box-shadow:0 0 70px rgba(63,184,245,.42),inset 0 0 40px rgba(63,184,245,.18)}
.hub img{width:34px;height:34px;filter:brightness(0) invert(1);margin:0 auto}
.hub b{display:block;margin-top:9px;font-size:13px;font-weight:600;letter-spacing:-.02em}
.hub span{display:block;margin-top:3px;font-family:"Fragment Mono",monospace;
font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:#8fc9ee}

.node{position:absolute;transform:translate(-50%,-50%);
padding:9px 14px;border-radius:10px;white-space:nowrap;
background:rgba(9,24,44,.9);border:1px solid var(--line);backdrop-filter:blur(6px);
font-size:12.5px;font-weight:600;letter-spacing:-.02em;
transition:border-color .16s,background .16s,transform .16s}
.node:hover,.node:focus-visible{border-color:var(--blue-lift);background:#0d2b4d;
transform:translate(-50%,-50%) scale(1.05);z-index:3}
.node .areas{position:absolute;left:50%;top:calc(100% + 8px);transform:translateX(-50%);
opacity:0;visibility:hidden;transition:opacity .15s;
padding:6px 10px;border-radius:8px;background:#04203f;border:1px solid rgba(63,184,245,.4);
font-family:"Fragment Mono",monospace;font-size:10px;font-weight:400;letter-spacing:0;
color:#bfe4fb;box-shadow:0 10px 28px rgba(0,6,16,.6)}
.node:hover .areas,.node:focus-visible .areas{opacity:1;visibility:visible}
.orbit .node,.orbit .sp{transition:opacity .22s,filter .22s,border-color .16s,
background .16s,transform .16s}

/* ---- category filter ---- */
.catin{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
.filter-bar{margin-top:30px;display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.filter-bar label{cursor:pointer;display:inline-flex;align-items:center;gap:9px;
padding:8px 15px;border-radius:9px;background:rgba(255,255,255,.045);
border:1px solid var(--line);color:#cfe0f2;
font-size:13px;font-weight:500;letter-spacing:-.015em;
transition:background .16s,border-color .16s,color .16s,box-shadow .16s}
.filter-bar label:hover{background:rgba(63,184,245,.09);border-color:rgba(63,184,245,.42)}
.filter-bar label b{font-family:"Fragment Mono",monospace;font-size:10.5px;font-weight:400;
letter-spacing:.02em;color:var(--muted-2)}
.tally{margin-top:16px;font-size:13px;color:var(--muted-2);min-height:19px}
.tally span{display:none}
.tally em{font-style:normal;color:#cfe0f2}

.logos.filterable figure{transition:opacity .22s,filter .22s}

@media (max-width:700px){
  .orbit{display:none}
}

${filterCss}
${netvizCss}

/* ---- section anatomy (Span's) ---- */
section{position:relative}
.band{padding:96px 0}
.eyebrow{display:inline-flex;align-items:center;gap:8px;padding:5px 13px;border-radius:99px;
background:rgba(255,255,255,.05);border:1px solid var(--line);
font-size:12px;color:#cfe0f2}
.eyebrow i{width:5px;height:5px;border-radius:50%;background:var(--blue);display:block}
h2{margin-top:20px;font-size:clamp(27px,3.4vw,42px);line-height:1.16;font-weight:600;
letter-spacing:-.045em;text-wrap:balance}
.lede{margin:16px auto 0;max-width:56ch;color:var(--muted);font-size:14.5px;line-height:1.6}

/* ---- logo rows ---- */
.logos{margin-top:36px;display:grid;gap:1px;background:var(--line);
border:1px solid var(--line);border-radius:14px;overflow:hidden;
grid-template-columns:repeat(2,1fr)}
@media (min-width:640px){.logos{grid-template-columns:repeat(4,1fr)}}
@media (min-width:1000px){.logos.five{grid-template-columns:repeat(5,1fr)}
.logos.eight{grid-template-columns:repeat(4,1fr)}}
.logos figure{background:#040a13;display:grid;place-items:center;align-content:center;
gap:12px;padding:22px 16px;min-height:146px}
.logos .chip{width:100%;background:#fff;border-radius:10px;padding:14px 16px;
display:grid;place-items:center;min-height:78px;transition:transform .18s}
.logos figure:hover .chip{transform:translateY(-2px)}
.logos img{max-height:46px;width:auto;object-fit:contain}
.logos figcaption{font-size:11.5px;color:var(--muted-2);text-align:center;line-height:1.35}

/* ---- pillars ---- */
.pillars{margin-top:48px;display:grid;gap:14px}
@media (min-width:820px){.pillars{grid-template-columns:repeat(3,1fr)}}
.pillar{position:relative;border:1px solid var(--line);border-radius:16px;padding:26px 24px 28px;
background:linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.012));
text-align:left;overflow:hidden}
.pillar::after{content:"";position:absolute;inset:auto 0 0 0;height:1px;
background:linear-gradient(90deg,transparent,rgba(8,136,197,.6),transparent)}
.pillar .ix{font-size:11.5px;color:var(--blue-lift)}
.pillar h3{margin-top:16px;font-size:20px;font-weight:600;letter-spacing:-.03em}
.pillar p{margin-top:10px;color:var(--muted);font-size:13.5px;line-height:1.6}

/* ---- service grid ---- */
.grid{margin-top:44px;display:grid;gap:14px}
@media (min-width:700px){.grid{grid-template-columns:repeat(2,1fr)}}
@media (min-width:1040px){.grid{grid-template-columns:repeat(3,1fr)}}
.card{position:relative;border:1px solid var(--line);border-radius:16px;padding:24px;
background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.01));
text-align:left;transition:border-color .18s,transform .18s,background .18s}
.card:hover{border-color:rgba(8,136,197,.55);transform:translateY(-2px);
background:linear-gradient(180deg,rgba(8,136,197,.09),rgba(255,255,255,.012))}
.card .ic{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;
background:rgba(8,136,197,.14);border:1px solid rgba(8,136,197,.34);color:var(--blue-lift)}
.card .ic svg{width:19px;height:19px}
.card h3{margin-top:18px;font-size:16.5px;font-weight:600;letter-spacing:-.03em}
.card p{margin-top:9px;color:var(--muted);font-size:13.5px;line-height:1.62}
.tags{margin-top:16px;display:flex;flex-wrap:wrap;gap:6px}
.tags span{font-family:"Fragment Mono",monospace;font-size:10.5px;letter-spacing:0;
color:#a9c6dd;background:rgba(255,255,255,.045);border:1px solid var(--line);
border-radius:6px;padding:3px 8px}

/* ---- steps ---- */
.steps{margin-top:48px;display:grid;gap:14px}
@media (min-width:820px){.steps{grid-template-columns:repeat(3,1fr)}}
.step{border:1px solid var(--line);border-radius:16px;padding:26px 24px;text-align:left;
background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.01))}
.step .n{width:30px;height:30px;border-radius:99px;display:grid;place-items:center;
font-family:"Fragment Mono",monospace;font-size:12px;color:#04101c;background:var(--blue-pale)}
.step h3{margin-top:18px;font-size:17px;font-weight:600;letter-spacing:-.03em}
.step p{margin-top:9px;color:var(--muted);font-size:13.5px;line-height:1.6}

/* ---- stats ---- */
.stats{margin-top:44px;display:grid;gap:1px;background:var(--line);
border:1px solid var(--line);border-radius:16px;overflow:hidden;
grid-template-columns:repeat(2,1fr)}
@media (min-width:900px){.stats{grid-template-columns:repeat(4,1fr)}}
.stats div{background:#040a13;padding:30px 22px}
.stats dd{margin:0;font-size:clamp(30px,4vw,44px);font-weight:600;letter-spacing:-.05em;
background:linear-gradient(180deg,#fff,#7fb6d8);-webkit-background-clip:text;
background-clip:text;color:transparent}
.stats dt{margin-top:8px;font-size:12.5px;color:var(--muted)}

/* ---- closing ---- */
.close{position:relative;padding:110px 0 96px;overflow:hidden;text-align:center}
.close::before{content:"";position:absolute;left:50%;bottom:-320px;transform:translateX(-50%);
width:1300px;height:640px;border-radius:50%;pointer-events:none;
background:radial-gradient(50% 50% at 50% 50%,rgba(8,136,197,.5),transparent 68%);filter:blur(50px)}
.close .inner{position:relative}
.contacts{margin:34px auto 0;display:grid;gap:1px;background:var(--line);max-width:900px;
border:1px solid var(--line);border-radius:16px;overflow:hidden;grid-template-columns:1fr}
@media (min-width:760px){.contacts{grid-template-columns:repeat(3,1fr)}}
.contacts div{background:rgba(4,10,19,.86);padding:22px 20px;text-align:left}
.contacts dt{font-size:11.5px;color:var(--muted-2)}
.contacts dd{margin:8px 0 0;font-size:13.5px;line-height:1.7}
.contacts a:hover{color:var(--blue-lift)}

footer{position:relative;border-top:1px solid var(--line);padding:60px 0 34px}
.fgrid{display:grid;gap:38px}
@media (min-width:760px){.fgrid{grid-template-columns:repeat(2,1fr)}}
@media (min-width:1080px){.fgrid{grid-template-columns:1.5fr repeat(4,1fr);gap:32px}}
.fgrid h4{font-family:"Fragment Mono",monospace;font-size:10.5px;letter-spacing:.12em;
text-transform:uppercase;color:var(--blue-lift);font-weight:400}
.fgrid ul{margin-top:16px;display:grid;gap:11px}
.fgrid li a,.fgrid li span{font-size:13px;color:var(--muted);line-height:1.5}
.fgrid li a:hover{color:#fff}
.fbrand img{height:34px;width:34px;filter:brightness(0) invert(1)}
.fbrand p{margin-top:16px;max-width:34ch;font-size:13px;color:var(--muted);line-height:1.65}
.fbrand b{display:block;margin-top:16px;font-size:13.5px;font-weight:600;color:var(--text)}
.fbot{margin-top:46px;padding-top:22px;border-top:1px solid var(--line);
display:flex;flex-wrap:wrap;gap:14px 24px;justify-content:space-between;align-items:center;
font-size:12px;color:var(--muted-2)}
.social{display:flex;gap:8px}
.social a{width:32px;height:32px;border-radius:8px;display:grid;place-items:center;
border:1px solid var(--line);color:var(--muted);transition:border-color .15s,color .15s}
.social a:hover{border-color:var(--blue-lift);color:var(--blue-lift)}
.social svg{width:15px;height:15px}
`;

/* -------------------------------------------------------------------- build */

const arrow =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';

const services = SERVICES.map(
  ([title, body, tags], i) => `<a class="card" href="#">
<span class="ic">${icon(SERVICE_ICONS[i])}</span>
<h3>${esc(title)}</h3>
<p>${esc(body)}</p>
<span class="tags">${tags.map((t) => `<span>${esc(t)}</span>`).join("")}</span>
</a>`,
).join("");

const pillars = PILLARS.map(
  ([t, b], i) => `<div class="pillar">
<p class="ix mono">0${i + 1}</p><h3>${esc(t)}</h3><p>${esc(b)}</p></div>`,
).join("");

const steps = CUSTOM.map(
  ([t, b], i) => `<div class="step">
<span class="n">${i + 1}</span><h3>${esc(t)}</h3><p>${esc(b)}</p></div>`,
).join("");

const clientLogos = CLIENTS.map(
  ([f, n]) =>
    `<figure><span class="chip"><img src="${b64(f)}" alt="${esc(n)}"></span><figcaption>${esc(n)}</figcaption></figure>`,
).join("");

const partnerLogos = PARTNERS.map(
  ([f, n]) =>
    `<figure class="${catClasses(n)}"><span class="chip"><img src="${b64(f)}" alt="${esc(n)}"></span><figcaption>${esc(n)}</figcaption></figure>`,
).join("");

/* Hand-placed across the whole hero. The band the headline occupies
   (~8-52% across, ~18-46% down) is deliberately kept faint so the type
   never fights the artwork.
   left%, top%, px, opacity, spin, driftSecs, delay, rotateX, rotateY */
const FIELD = [
  [  5,  4, 132, 0.42,  -6, 15, 0.0],
  [ 80,  5, 132, 0.42,   5, 12, 1.7],
  [ 22, 20, 138, 0.24,  -8, 16, 0.4],
  [ 65, 21, 138, 0.24,   6, 13, 2.6],
  [  0, 44, 170, 0.62,  -3, 17, 1.1],
  [ 83, 45, 170, 0.62,   4, 14, 3.2],
  [ 13, 71, 134, 0.46,  -5, 15, 0.8],
  [ 72, 72, 134, 0.46,   7, 13, 2.2],
  [ 45, 88, 120, 0.22,  -4, 16, 3.9],
];

const heroviz = FIELD.map(
  ([x, y, size, op, rot, dur, del], i) =>
    `<span class="fx" style="left:${x}%;top:${y}%;width:${size}px;height:${size}px;opacity:${op};--r:${rot}deg;--dur:${dur}s;--del:${del}s">${object3d(OBJECT_KEYS[i], i)}</span>`,
).join("");


const arcs = `<svg class="arcs" viewBox="0 0 1700 700" fill="none" aria-hidden="true">
${[0, 1, 2, 3, 4]
  .map(
    (i) =>
      `<ellipse cx="850" cy="${330 + i * 6}" rx="${520 + i * 120}" ry="${300 + i * 66}"
stroke="rgba(255,255,255,${0.07 - i * 0.011})" stroke-width="1"/>`,
  )
  .join("")}
</svg>`;

const SOCIAL = `<span class="social">
<a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21h-4z"/></svg></a>
<a href="#" aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 3h3l-6.6 7.5L21.8 21h-5.9l-4.3-5.6L6.6 21H3.5l7-8L2.6 3h6l3.9 5.2zm-1 16h1.7L8.1 4.7H6.3z"/></svg></a>
<a href="mailto:info@edgecomm-tech.com" aria-label="Email"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></a>
</span>`;

const footerHtml = () => `<footer>
  <div class="wrap">
    <div class="fgrid">
      <div class="fbrand">
        <img src="${b64("icon.png")}" alt="Edge Communication Technologies">
        <p>An ICT systems integration company in Addis Ababa, delivering datacenter, network,
        security, communications and support to the institutions that depend on them.</p>
        <b>Built to international standards.</b>
      </div>

      <div><h4>Solutions</h4><ul>
        ${SERVICES.slice(0, 5).map(([t]) => `<li><a href="#">${esc(t)}</a></li>`).join("")}
      </ul></div>

      <div><h4>More</h4><ul>
        ${SERVICES.slice(5).map(([t]) => `<li><a href="#">${esc(t)}</a></li>`).join("")}
      </ul></div>

      <div><h4>Company</h4><ul>
        <li><a href="${PAGES.about}">About us</a></li>
        <li><a href="${PAGES.partners}">Partners</a></li>
        <li><a href="#clients">Our clients</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul></div>

      <div><h4>Get in touch</h4><ul>
        <li><span>Bole, Lubaba Building, 3rd Floor<br>Addis Ababa, Ethiopia</span></li>
        <li><a href="mailto:info@edgecomm-tech.com">info@edgecomm-tech.com</a></li>
        <li><a href="tel:+251922555055">+251 92 255 5055</a></li>
        <li><a href="https://edgecomm-tech.com">edgecomm-tech.com</a></li>
      </ul></div>
    </div>

    <div class="fbot">
      <span>&copy; ${new Date().getFullYear()} Edge Communication Technologies. Advise, implement, manage.</span>
      ${SOCIAL}
    </div>
  </div>
</footer>`;

/* ------------------------------------------------------------- page shell */

const PAGES = {
  home: "07-span-style.html",
  about: "08-span-about.html",
  partners: "09-span-partners.html",
};

/* Header items, in the order Edge's requirements document sets out.
   Third entry is the page an item owns, used to mark the current one;
   Career and Blog have no page designed yet and park on "#". Contact is
   deliberately absent -- the button at the end of the bar is the contact
   route, and listing it twice would be noise. */
const NAV = [
  ["About", () => PAGES.about, "about"],
  ["Partners", () => PAGES.partners, "partners"],
  ["Solutions", (pg) => (pg === "home" ? "#solutions" : PAGES.home + "#solutions")],
  ["Career", () => "#"],
  ["Blog", () => "#"],
];

const navFor = (pg) => `<header class="nav">
  <a class="brand" href="${PAGES.home}" aria-label="Edge Communication Technologies">
    <img src="${b64("icon.png")}" alt="">
  </a>
  <input class="navtog" type="checkbox" id="navtog">
  <label class="burger" for="navtog" aria-label="Open menu"><span></span><span></span><span></span></label>
  <nav class="pillnav" aria-label="Main">
    ${NAV.map(
      ([label, href, owns]) =>
        `<a href="${href(pg)}"${owns === pg ? ' aria-current="page"' : ""}>${esc(label)}</a>`,
    ).join("")}
  </nav>
  <a class="navcta" href="#contact">Contact us ${arrow}</a>
</header>`;

const shell = ({ pg, title, desc, body }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="preconnect" href="https://api.fontshare.com">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f%5B%5D=switzer@400,500,600,700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fragment+Mono&display=swap">
<style>${css}</style>
</head>
<body>

${navFor(pg)}

${body}

${footerHtml()}

</body>
</html>`;

/* -------------------------------------------------------------- about page */

const APPROACH = [
  [
    "Advise",
    "We start from what you already have and what it costs you to run it, then say plainly what should change and in what order.",
    `<svg viewBox="0 0 260 120" fill="none" stroke="url(#la)" stroke-width="1.4">
<defs><linearGradient id="la" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#7ad4ff"/><stop offset="1" stop-color="#0a4d94"/></linearGradient></defs>
<path d="M8 92c26 0 34-58 62-58s34 44 62 44 34-58 62-58 34 26 58 26" stroke-linecap="round"/>
<circle cx="70" cy="34" r="4"/><circle cx="132" cy="78" r="4"/><circle cx="194" cy="20" r="4"/></svg>`,
  ],
  [
    "Implement",
    "Certified network and system engineers do the design, the configuration and the commissioning, to international standards rather than to whatever fits.",
    `<svg viewBox="0 0 260 120" fill="none" stroke="url(#lb)" stroke-width="1.4">
<defs><linearGradient id="lb" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#7ad4ff"/><stop offset="1" stop-color="#0a4d94"/></linearGradient></defs>
<rect x="18" y="20" width="60" height="80" rx="6"/><rect x="100" y="20" width="60" height="80" rx="6"/>
<rect x="182" y="20" width="60" height="80" rx="6"/>
<path d="M18 44h60M100 44h60M182 44h60M18 68h60M100 68h60M182 68h60" opacity=".5"/>
<path d="M78 60h22M160 60h22" stroke-linecap="round"/></svg>`,
  ],
  [
    "Manage",
    "Continuous follow-up and optimised after-sales service. The contract that builds it is the contract that keeps it running.",
    `<svg viewBox="0 0 260 120" fill="none" stroke="url(#lc)" stroke-width="1.4">
<defs><linearGradient id="lc" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#7ad4ff"/><stop offset="1" stop-color="#0a4d94"/></linearGradient></defs>
<circle cx="130" cy="60" r="42"/><circle cx="130" cy="60" r="26" opacity=".5"/>
<path d="M130 18v-10M130 112v-10M88 60H78M182 60h10" stroke-linecap="round"/>
<path d="M130 60l22-14" stroke-linecap="round"/>
<circle cx="130" cy="60" r="4" fill="#7ad4ff" stroke="none"/></svg>`,
  ],
];

const PEOPLE = [
  ["net", "Network engineers", "Certified across Cisco, Huawei, Juniper and Dell for campus, wireless and wide-area design."],
  ["shield", "Security professionals", "The staff behind the NOC and SOC portfolio, from perimeter policy through to incident response."],
  ["rack", "Facilities engineers", "Power, cooling, containment and structured cabling for Tier-rated rooms."],
  ["desk", "Support engineers", "Remote and on-site helpdesk across servers, software and systems."],
];

const approach = APPROACH.map(
  ([t, b, art], i) => `<div>
<p class="ix">0${i + 1}</p><h3>${esc(t)}</h3><p>${esc(b)}</p>
<figure aria-hidden="true">${art}</figure></div>`,
).join("");

const people = PEOPLE.map(
  ([k, t, b]) => `<div class="person">
<span class="ic">${icon(k)}</span><h3>${esc(t)}</h3><p>${esc(b)}</p></div>`,
).join("");

const aboutBody = `
<main>
  <section class="hero center hero-about">
    ${arcs}
    <div class="heroviz" aria-hidden="true">${heroviz}</div>
    <div class="wrap">
      <div class="hero-grid">
        <div class="hero-copy">
          <span class="mark-chip">
            <img src="${b64("icon.png")}" alt=""><span>Edge COMM-TECH</span>
          </span>
          <h1>The company behind the build</h1>
          <p class="sub">An ICT systems integrator in Addis Ababa, working with the institutions
          that cannot afford to be offline.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="band center">
    <div class="wrap">
      <span class="eyebrow"><i></i> Our mission</span>
      <p class="mission">Most failures we are called in to fix happen at the seam between two
      suppliers. Edge stays with a system <em>from the first assessment to the after-sales
      contract</em>.</p>
    </div>
  </section>

  <section class="band center">
    <div class="wrap">
      <span class="eyebrow"><i></i> How we work</span>
      <h2>Advise, implement, manage.<br>One team across all three.</h2>
      <p class="lede">The same engineers who assess the estate design the build, and stay reachable
      once it is running.</p>
      <div class="approach">${approach}</div>
    </div>
  </section>

  <section class="band center">
    <div class="wrap">
      <span class="eyebrow"><i></i> Our people</span>
      <h2>Certified engineers, not resellers</h2>
      <p class="lede">Edge maintains a specialized professional service team across four
      disciplines. Headcount is <span class="ph">40</span>, for Edge to confirm.</p>
      <div class="people">${people}</div>
      <p class="hiring">We hire network, systems and security engineers who want to be in the room
      when a build is commissioned, not just on the drawing.</p>
      <div class="acts" style="margin-top:22px">
        <a class="btn btn-g" href="#contact">Get in touch ${arrow}</a>
      </div>
    </div>
  </section>

  <section class="band center" id="clients">
    <div class="wrap">
      <span class="eyebrow"><i></i> Who we serve</span>
      <h2>Universities and hospitals that cannot afford to be offline</h2>
      <p class="lede">Our proven base is higher education and public health, where a network
      outage stops teaching or treatment.</p>
      <div class="logos five">${clientLogos}</div>
    </div>
  </section>

  <section class="band center" id="partners">
    <div class="wrap">
      <span class="eyebrow"><i></i> Partners</span>
      <h2>Certified across the platforms that run critical systems</h2>
      <div class="logos eight">${partnerLogos}</div>
    </div>
  </section>

  <section class="close" id="contact">
    <div class="wrap inner">
      <span class="eyebrow"><i></i> Get in touch</span>
      <h2>Tell us what you need to build,<br>secure or keep running</h2>
      <p class="lede">An engineer replies, not a sales queue.</p>
      <div class="acts">
        <a class="btn btn-w" href="tel:+251922555055">Call the office ${arrow}</a>
        <a class="btn btn-g" href="mailto:sales@edgecomm-tech.com">Email sales</a>
      </div>

      <dl class="contacts">
        <div><dt>Office</dt><dd>Addis Ababa, Bole<br>Next to Ambassador Hotel<br>Lubaba Building, 3rd Floor</dd></div>
        <div><dt>Telephone</dt><dd><a href="tel:+251922555055">+251 92 255 5055</a><br>
        <a href="tel:+251911538809">+251 91 153 8809</a></dd></div>
        <div><dt>Email</dt><dd><a href="mailto:info@edgecomm-tech.com">info@edgecomm-tech.com</a><br>
        <a href="mailto:sales@edgecomm-tech.com">sales@edgecomm-tech.com</a><br>
        <a href="mailto:support@edgecomm-tech.com">support@edgecomm-tech.com</a></dd></div>
      </dl>
      <p class="ph-note" style="margin-top:26px">
        <span aria-hidden="true">&#9642;</span>
        <span>Figures marked with a square are <b>placeholders</b> for Edge to confirm.
        Partner and client counts are real and countable.</span>
      </p>
    </div>
  </section>
</main>`;


/* ----------------------------------------------------------- partners page */

/* Which of Edge's services each partner actually shows up in. */
const PARTNER_AREAS = {
  Cisco: "Networks · NOC and SOC",
  Dell: "Networks · Datacenter",
  HP: "Datacenter · IT support",
  Huawei: "Networks (LAN/WLAN)",
  "Palo Alto Networks": "Cybersecurity · NOC and SOC",
  Vertiv: "Datacenter · Power and cooling",
  "Tripp Lite": "Datacenter · Power and racks",
  "Canovate Group": "Datacenter · Cabling and racks",
};

const CHOICE = [
  ["We specify against the requirement",
   "The platform is chosen because it fits the brief and the site, not because of where the margin sits. If the right answer is a vendor we do not carry, we will say so."],
  ["Certified on what we deploy",
   "Our engineers hold current certifications across the platforms we sell, so the people specifying the design are the people who configure it."],
  ["Supported after handover",
   "Partner status means direct escalation to the manufacturer and lifecycle visibility on firmware and end-of-support dates, for the life of the estate."],
];

/* Hub-and-spoke ring, drawn in an 800x800 space. */
const R = 292;
const ORBIT = PARTNERS.map(([file, name], i) => {
  const a = (i / PARTNERS.length) * Math.PI * 2 - Math.PI / 2;
  return { name, x: 400 + R * Math.cos(a), y: 400 + R * Math.sin(a) };
});

const spokes = ORBIT.map(
  (n) => `<line class="sp ${catClasses(n.name)}" x1="400" y1="400"
x2="${n.x.toFixed(1)}" y2="${n.y.toFixed(1)}" stroke="url(#spoke)" stroke-width="1.4"/>`,
).join("");

const nodes = ORBIT.map(
  (n) => `<a class="node ${catClasses(n.name)}" href="#" style="left:${((n.x / 800) * 100).toFixed(2)}%;top:${((n.y / 800) * 100).toFixed(2)}%">
${esc(n.name)}<span class="areas">${esc(PARTNER_AREAS[n.name] ?? "")}</span></a>`,
).join("");

const choice = CHOICE.map(
  ([t, b], i) => `<div class="pillar">
<p class="ix">0${i + 1}</p><h3>${esc(t)}</h3><p>${esc(b)}</p></div>`,
).join("");

const partnersBody = `
<main>
  <section class="hero hero-about hero-net">
    ${arcs}
    <div class="netfield">${netviz}</div>
    <div class="wrap">
      <div class="hero-grid">
        <div class="hero-copy" style="text-align:left">
          <p class="crumb-trail"><a href="${PAGES.home}">Home</a><span>/</span>Partners</p>
          <h1 style="max-width:19ch">Built on the platforms that run critical systems</h1>
          <p class="sub" style="margin-left:0">We work with the manufacturers behind the world's
          data centres and networks, so the technology is chosen for the requirement rather than
          for what we happen to stock.</p>
          <p class="place"><i></i> Addis Ababa &mdash; head office</p>
        </div>
      </div>
    </div>
  </section>

  <section class="band center">
    <div class="wrap">
      <span class="eyebrow"><i></i> Partner network</span>
      <h2>Eight manufacturers, one point of contact</h2>
      <p class="lede">Edge holds the partner relationship, so escalation, firmware and lifecycle
      support run through one team rather than eight.</p>

      ${CATS.map(
        ([k], i) =>
          `<input class="catin" type="radio" name="pcat" id="f-${k}"${i === 0 ? " checked" : ""}>`,
      ).join("")}
      <div class="filter-bar" role="group" aria-label="Filter partners by category">
        ${CATS.map(
          ([k, label]) => `<label for="f-${k}">${esc(label)} <b>${catCount(k)}</b></label>`,
        ).join("")}
      </div>
      <p class="tally">
        <span class="t-all">Hover a partner to see the areas we deliver with them.</span>
        ${CATS.filter(([k]) => k !== "all")
          .map(
            ([k, label]) =>
              `<span class="t-${k}"><em>${catCount(k)} of ${PARTNERS.length}</em>
              partners supply ${esc(label.toLowerCase())}.</span>`,
          )
          .join("")}
      </p>

      <div class="orbit">
        <svg viewBox="0 0 800 800" aria-hidden="true">
          <defs>
            <radialGradient id="spoke" gradientUnits="userSpaceOnUse"
              cx="400" cy="400" r="${R}">
              <stop offset="0" stop-color="#7ad4ff" stop-opacity=".85"/>
              <stop offset="0.55" stop-color="#3fb8f5" stop-opacity=".45"/>
              <stop offset="1" stop-color="#3fb8f5" stop-opacity=".10"/>
            </radialGradient>
          </defs>
          <circle cx="400" cy="400" r="${R}" fill="none" stroke="rgba(255,255,255,.07)"/>
          <circle cx="400" cy="400" r="200" fill="none" stroke="rgba(255,255,255,.05)"/>
          ${spokes}
        </svg>
        <div class="hub">
          <div>
            <img src="${b64("icon.png")}" alt="">
            <b>Edge COMM-TECH</b>
            <span>Partner network</span>
          </div>
        </div>
        ${nodes}
      </div>
      <div class="logos eight filterable" style="margin-top:40px">${partnerLogos}</div>
    </div>
  </section>

  <section class="band center">
    <div class="wrap">
      <span class="eyebrow"><i></i> How we choose</span>
      <h2>Technology chosen for the job,<br>not for the margin</h2>
      <div class="pillars">${choice}</div>
    </div>
  </section>

  <section class="close" id="contact">
    <div class="wrap inner">
      <span class="eyebrow"><i></i> Looking for a specific platform?</span>
      <h2>Tell us the outcome,<br>we will recommend the platform</h2>
      <p class="lede">Describe what you are trying to stand up or replace and we will say which
      technology fits, from this list or outside it.</p>
      <div class="acts">
        <a class="btn btn-w" href="tel:+251922555055">Call the office ${arrow}</a>
        <a class="btn btn-g" href="${PAGES.home}#solutions">See our solutions</a>
      </div>
    </div>
  </section>
</main>`;

/* ------------------------------------------------------------------ output */

const outDir = process.argv[2];

writeFileSync(
  `${outDir}/${PAGES.home}`,
  shell({
    pg: "home",
    title: "Edge COMM-TECH — homepage direction",
    desc: "Edge Communication Technologies — ICT systems integration in Addis Ababa.",
    body: `<main>
  <section class="hero">
    ${arcs}
    <div class="heroviz" aria-hidden="true">${heroviz}</div>
    <div class="wrap">
      <div class="hero-grid">
        <div class="hero-copy">
          <span class="badge"><b>Addis Ababa</b> Working with institutions nationwide</span>
          <h1>Infrastructure built to international standards</h1>
          <p class="sub">We advise, implement and manage communication and IT infrastructure for
          Ethiopia&rsquo;s universities, hospitals and enterprises.</p>
          <div class="acts">
            <a class="btn btn-w" href="#solutions">See our solutions ${arrow}</a>
            <a class="btn btn-g" href="#contact">Contact us</a>
          </div>
          <dl class="statcard">
            <div><dt>Certified vendor partners</dt><dd>8</dd></div>
            <div><dt>Named institutional clients</dt><dd>5</dd></div>
            <div><dt>Years operating</dt><dd><span class="ph">6</span></dd></div>
          </dl>
        </div>

      </div>
    </div>
  </section>

  <section class="band center" id="clients" style="padding-top:72px">
    <div class="wrap">
      <span class="eyebrow"><i></i> Trusted by</span>
      <h2>Universities and hospitals that cannot afford to be offline</h2>
      <div class="logos five">${clientLogos}</div>
    </div>
  </section>

  <section class="band center" id="about">
    <div class="wrap">
      <span class="eyebrow"><i></i> What we do</span>
      <h2>Advise, implement, manage.<br>One team across all three.</h2>
      <p class="lede">Most failures we are called in to fix happen at the seam between two
      suppliers. Edge stays with a system from the first assessment to the after-sales contract.</p>
      <div class="pillars">${pillars}</div>
    </div>
  </section>

  <section class="band center" id="solutions">
    <div class="wrap">
      <span class="eyebrow"><i></i> Solutions</span>
      <h2>Nine services, delivered end to end</h2>
      <p class="lede">Voice, data and internet elements integrated end to end as a fully managed
      service — with the engineers who designed it still reachable afterwards.</p>
      <div class="grid">${services}</div>
    </div>
  </section>

  <section class="band center">
    <div class="wrap">
      <span class="eyebrow"><i></i> Custom solutions</span>
      <h2>Built for the site, not from a catalogue</h2>
      <div class="steps">${steps}</div>
    </div>
  </section>

  <section class="band center" id="partners">
    <div class="wrap">
      <span class="eyebrow"><i></i> Partners</span>
      <h2>Certified across the platforms that run critical systems</h2>
      <p class="lede">Our network group, together with our manufacturing partners, has the
      experience and expertise the work needs.</p>
      <div class="logos eight">${partnerLogos}</div>
    </div>
  </section>

  <section class="band center">
    <div class="wrap">
      <span class="eyebrow"><i></i> Track record</span>
      <h2>The numbers Edge can evidence</h2>
      <dl class="stats">
        <div><dd>8</dd><dt>Certified vendor partners</dt></div>
        <div><dd>5</dd><dt>Named institutional clients</dt></div>
        <div><dd><span class="ph">120</span></dd><dt>Projects delivered</dt></div>
        <div><dd><span class="ph">40</span></dd><dt>Engineers on staff</dt></div>
      </dl>
      <p class="ph-note" style="margin-top:22px">
        <span aria-hidden="true">▪</span>
        <span>Figures marked with a square are <b>placeholders</b>. Edge has not published
        headcount, project counts or a founding year, so those are for Edge to fill before
        this goes live. Partner and client counts are real and countable.</span>
      </p>
    </div>
  </section>

  <section class="close" id="contact">
    <div class="wrap inner">
      <span class="eyebrow"><i></i> Get in touch</span>
      <h2>Tell us what you need to build,<br>secure or keep running</h2>
      <p class="lede">An engineer replies, not a sales queue.</p>
      <div class="acts"><a class="btn btn-w" href="tel:+251922555055">Call the office ${arrow}</a>
      <a class="btn btn-g" href="mailto:sales@edgecomm-tech.com">Email sales</a></div>

      <dl class="contacts">
        <div><dt>Office</dt><dd>Addis Ababa, Bole<br>Next to Ambassador Hotel<br>Lubaba Building, 3rd Floor</dd></div>
        <div><dt>Telephone</dt><dd><a href="tel:+251922555055">+251 92 255 5055</a><br>
        <a href="tel:+251911538809">+251 91 153 8809</a></dd></div>
        <div><dt>Email</dt><dd><a href="mailto:info@edgecomm-tech.com">info@edgecomm-tech.com</a><br>
        <a href="mailto:sales@edgecomm-tech.com">sales@edgecomm-tech.com</a><br>
        <a href="mailto:support@edgecomm-tech.com">support@edgecomm-tech.com</a></dd></div>
      </dl>
    </div>
  </section>
</main>`,
  }),
);

writeFileSync(
  `${outDir}/${PAGES.about}`,
  shell({
    pg: "about",
    title: "About — Edge COMM-TECH",
    desc: "The company behind the build: an ICT systems integrator in Addis Ababa.",
    body: aboutBody,
  }),
);

writeFileSync(
  `${outDir}/${PAGES.partners}`,
  shell({
    pg: "partners",
    title: "Partners — Edge COMM-TECH",
    desc: "The manufacturers Edge COMM-TECH builds on, and how the platform gets chosen.",
    body: partnersBody,
  }),
);

console.log(`wrote ${PAGES.home}, ${PAGES.about} and ${PAGES.partners}`);
