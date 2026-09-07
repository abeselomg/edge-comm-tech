/*
 * Isometric objects for the hero field.
 *
 * Real geometry rather than an outline with a shadow behind it: a top face,
 * a left face and a right face, each on its own gradient so the light reads
 * consistently across every object (source high and to the left), plus a
 * specular pass and a contact shadow on the ground plane.
 *
 * True 2:1 isometric on a 100x100 viewBox — a square footprint of half-
 * diagonal `a` projects to a diamond 2a wide and a tall.
 */

/** Gradient set, one per instance so ids never collide across icons. */
const defs = (i) => `<defs>
<linearGradient id="t${i}" x1="0" y1="0" x2="0.55" y2="1">
<stop offset="0" stop-color="#d8f2ff"/><stop offset="1" stop-color="#74c9f6"/></linearGradient>
<linearGradient id="l${i}" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#2a97d6"/><stop offset="1" stop-color="#10559a"/></linearGradient>
<linearGradient id="r${i}" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#11619f"/><stop offset="1" stop-color="#07305f"/></linearGradient>
<radialGradient id="s${i}" cx="0.34" cy="0.28" r="0.84">
<stop offset="0" stop-color="#f0fbff"/><stop offset="0.44" stop-color="#56c2f2"/>
<stop offset="1" stop-color="#0a3c74"/></radialGradient>
<linearGradient id="g${i}" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#ffffff" stop-opacity=".6"/>
<stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
<radialGradient id="sh${i}" cx="0.5" cy="0.5" r="0.5">
<stop offset="0" stop-color="#01070f" stop-opacity=".6"/>
<stop offset="1" stop-color="#01070f" stop-opacity="0"/></radialGradient>
</defs>`;

const shadow = (i, cy = 88, rx = 30, ry = 9) =>
  `<ellipse cx="50" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#sh${i})"/>`;

/**
 * One isometric box. cx/cy is the centre of the top face, `a` the half-width
 * of its diamond, `h` the extrusion downward.
 */
const box = (i, cx, cy, a, h) => `
<path d="M${cx},${cy - a / 2} L${cx + a},${cy} L${cx},${cy + a / 2} L${cx - a},${cy} Z" fill="url(#t${i})"/>
<path d="M${cx - a},${cy} L${cx},${cy + a / 2} L${cx},${cy + a / 2 + h} L${cx - a},${cy + h} Z" fill="url(#l${i})"/>
<path d="M${cx + a},${cy} L${cx},${cy + a / 2} L${cx},${cy + a / 2 + h} L${cx + a},${cy + h} Z" fill="url(#r${i})"/>`;

/* ------------------------------------------------------------------ shapes */

const SHAPES = {
  /* Three stacked rack units. */
  rack: (i) => `${shadow(i, 90, 30, 8)}
${box(i, 50, 62, 27, 11)}
${box(i, 50, 46, 27, 11)}
${box(i, 50, 30, 27, 11)}
<path d="M50,20 L68,29 L50,38 L32,29 Z" fill="url(#g${i})" opacity=".55"/>
<path d="M30,56 h8 M30,40 h8" stroke="#bfe8ff" stroke-width="1.6" stroke-linecap="round" opacity=".5"/>`,

  /* Three cubes wired together. */
  net: (i) => `${shadow(i, 88, 30, 8)}
<path d="M50,34 L28,60 M50,34 L72,60 M34,70 L66,70" stroke="#7fd2ff" stroke-width="1.8"
stroke-linecap="round" opacity=".55" fill="none"/>
${box(i, 50, 24, 14, 10)}
${box(i, 27, 58, 14, 10)}
${box(i, 73, 58, 14, 10)}`,

  /* Shield with real thickness. */
  shield: (i) => `${shadow(i, 90, 24, 7)}
<path d="M50,15 L75,25 v23 c0,16 -12,27 -25,34 -13,-7 -25,-18 -25,-34 V25 Z"
transform="translate(4,4)" fill="url(#r${i})"/>
<path d="M50,15 L75,25 v23 c0,16 -12,27 -25,34 -13,-7 -25,-18 -25,-34 V25 Z" fill="url(#s${i})"/>
<path d="M50,15 L75,25 v6 c0,4 -12,8 -25,8 -13,0 -25,-4 -25,-8 v-6 Z" fill="url(#g${i})" opacity=".75"/>
<path d="M39,47 l8,8 15,-17" stroke="#f0fbff" stroke-width="4" fill="none"
stroke-linecap="round" stroke-linejoin="round"/>`,

  /* Isometric bar chart, bases on one ground line. */
  ops: (i) => `${shadow(i, 86, 32, 8)}
${box(i, 28, 58, 10, 16)}
${box(i, 50, 46, 10, 28)}
${box(i, 72, 34, 10, 40)}`,

  /* Stacked rings, radar-like. */
  rings: (i) => `${shadow(i, 84, 32, 8)}
<ellipse cx="50" cy="62" rx="36" ry="18" fill="none" stroke="url(#r${i})" stroke-width="8"/>
<ellipse cx="50" cy="58" rx="36" ry="18" fill="none" stroke="url(#l${i})" stroke-width="7"/>
<ellipse cx="50" cy="54" rx="36" ry="18" fill="none" stroke="url(#t${i})" stroke-width="3.4"/>
<ellipse cx="50" cy="54" rx="20" ry="10" fill="none" stroke="#a7e2ff" stroke-width="2.6" opacity=".8"/>
<ellipse cx="50" cy="54" rx="7" ry="3.5" fill="url(#t${i})"/>`,

  /* Sphere with meridians. */
  globe: (i) => `${shadow(i, 90, 26, 7)}
<circle cx="50" cy="48" r="33" fill="url(#s${i})"/>
<ellipse cx="50" cy="48" rx="33" ry="12" fill="none" stroke="#d7f2ff" stroke-width="1.4" opacity=".55"/>
<ellipse cx="50" cy="48" rx="14" ry="33" fill="none" stroke="#d7f2ff" stroke-width="1.4" opacity=".45"/>
<ellipse cx="50" cy="48" rx="27" ry="33" fill="none" stroke="#d7f2ff" stroke-width="1.1" opacity=".28"/>
<ellipse cx="39" cy="33" rx="13" ry="7.5" transform="rotate(-30 39 33)" fill="url(#g${i})" opacity=".8"/>`,

  /* Cylinder. */
  cylinder: (i) => `${shadow(i, 90, 25, 7)}
<path d="M23,34 v30 c0,7 12,12 27,12 s27,-5 27,-12 V34 Z" fill="url(#l${i})"/>
<path d="M50,34 v42 c15,0 27,-5 27,-12 V34 Z" fill="url(#r${i})"/>
<ellipse cx="50" cy="34" rx="27" ry="12" fill="url(#t${i})"/>
<ellipse cx="50" cy="33" rx="18" ry="7.5" fill="url(#g${i})" opacity=".55"/>
<path d="M23,50 c0,7 12,12 27,12 s27,-5 27,-12" fill="none" stroke="#a7e2ff"
stroke-width="1.3" opacity=".45"/>`,

  /* Bullet camera: a barrel body with a lens, on a wall mount. */
  cam: (i) => `${shadow(i, 88, 26, 8)}
<path d="M46,58 h8 v13 h-8 Z" fill="url(#r${i})"/>
<path d="M35,71 h30 v4 a15,7 0 0 1 -30,0 Z" fill="url(#r${i})"/>
<ellipse cx="50" cy="71" rx="15" ry="7" fill="url(#t${i})"/>
<rect x="28" y="32" width="42" height="26" rx="13" fill="url(#l${i})"/>
<rect x="32" y="35" width="34" height="8" rx="4" fill="url(#g${i})" opacity=".45"/>
<ellipse cx="70" cy="45" rx="8" ry="13" fill="url(#r${i})"/>
<ellipse cx="71.5" cy="45" rx="5.4" ry="9" fill="url(#s${i})"/>
<ellipse cx="69.5" cy="40.5" rx="2" ry="3" fill="url(#g${i})" opacity=".85"/>`,

  /* Monitor on a stand. */
  monitor: (i) => `${shadow(i, 90, 28, 8)}
<path d="M46,66 h8 v10 h-8 Z" fill="url(#r${i})"/>
<path d="M33,78 h34 l-5,4 h-24 Z" fill="url(#l${i})"/>
<path d="M17,22 h66 v42 h-66 Z" transform="translate(4,4)" fill="url(#r${i})"/>
<path d="M17,22 h66 v42 h-66 Z" fill="url(#l${i})"/>
<path d="M21,26 h58 v34 h-58 Z" fill="url(#s${i})" opacity=".92"/>
<path d="M21,26 h58 v15 h-58 Z" fill="url(#g${i})" opacity=".38"/>`,
};

export const OBJECT_KEYS = [
  "rack",
  "net",
  "shield",
  "rings",
  "globe",
  "cylinder",
  "cam",
  "monitor",
  "ops",
];

export const object3d = (kind, i) =>
  `<svg viewBox="0 0 100 100" aria-hidden="true">${defs(i)}${SHAPES[kind](i)}</svg>`;
