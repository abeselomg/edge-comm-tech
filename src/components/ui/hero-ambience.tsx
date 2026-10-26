/*
 * The quiet motion behind a page band: a few line icons that float, two soft
 * colour blobs and a dot-grid that drifts. Purely decorative -- no text, no
 * tab stops, never above the content (PageHead puts it first, under the
 * relative content wrapper).
 *
 * Server component, CSS-only: every animation is translate/rotate via the
 * eg-float / eg-drift keyframes in globals.css, and prefers-reduced-motion
 * leaves the layer still. Icons are drawn here as plain strokes in the page
 * accent at low opacity; one of them shows on a phone so a 390px band stays
 * calm.
 */

export type AmbienceTheme = "solutions" | "projects" | "clients" | "general";

// 24x24 line icons. Children only; the wrapper sets stroke and viewBox.
const ICONS: Record<string, React.ReactNode> = {
  network: (
    <>
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="M11 7l-5 9M13 7l5 9M7 18h10" />
    </>
  ),
  server: (
    <>
      <rect x="3" y="4" width="18" height="6" rx="1.5" />
      <rect x="3" y="14" width="18" height="6" rx="1.5" />
      <path d="M7 7h.01M7 17h.01M12 7h6M12 17h6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
  cloud: <path d="M7 18a4.5 4.5 0 01-.6-8.96A6 6 0 0117.7 8.6 4.8 4.8 0 0117 18z" />,
  chip: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="10" y="10" width="4" height="4" />
      <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
    </>
  ),
  blueprint: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M3 9h18M9 9v11M13 14h5M13 17h3" />
    </>
  ),
  crane: (
    <>
      <path d="M6 21V4l-3 3h18M6 4l15 3M17 7v6" />
      <rect x="15" y="13" width="4" height="3" />
      <path d="M3 21h8" />
    </>
  ),
  gantt: (
    <>
      <path d="M3 4v16h18" />
      <path d="M7 8h6M10 12h8M13 16h5" strokeWidth="2.4" />
    </>
  ),
  checklist: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8l1.5 1.5L12 7M8 14l1.5 1.5L12 13M14.5 8.5H17M14.5 14.5H17" />
    </>
  ),
  building: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M11 21v-3h2v3" />
    </>
  ),
  bank: <path d="M3 9l9-5 9 5zM5 20h14M6 11v6M10 11v6M14 11v6M18 11v6" />,
  university: (
    <>
      <path d="M2 9l10-5 10 5-10 5z" />
      <path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5M22 9v6" />
    </>
  ),
  ministry: (
    <>
      <path d="M3 21h18M5 21V10h14v11M4 10l8-6 8 6M12 4V2M12 2h4" />
      <path d="M9 14h6v7H9z" />
    </>
  ),
  mark: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M7 12h10" />
    </>
  ),
};

type Slot = {
  left: string;
  top: string;
  size: number;
  dur: number;
  delay: number;
  tilt: number;
  /** Shown below the md breakpoint too. */
  mobile?: boolean;
};

// Weighted to the right and the corners, where the band has no text.
const SLOTS: Slot[] = [
  { left: "78%", top: "14%", size: 72, dur: 11, delay: 0, tilt: -8 },
  { left: "90%", top: "52%", size: 56, dur: 13, delay: -4, tilt: 7 },
  { left: "64%", top: "66%", size: 64, dur: 15, delay: -7, tilt: -5 },
  { left: "52%", top: "8%", size: 44, dur: 12, delay: -2, tilt: 9 },
  { left: "4%", top: "74%", size: 48, dur: 14, delay: -9, tilt: -9, mobile: true },
  { left: "40%", top: "78%", size: 40, dur: 16, delay: -5, tilt: 6 },
];

const THEMES: Record<AmbienceTheme, string[]> = {
  solutions: ["network", "server", "shield", "cloud", "chip", "network"],
  projects: ["blueprint", "crane", "gantt", "checklist", "blueprint", "gantt"],
  clients: ["building", "bank", "university", "ministry", "mark", "building"],
  general: ["network", "blueprint", "shield", "building", "chip", "checklist"],
};

export function HeroAmbience({
  theme = "general",
  accent = "#0888c5",
}: {
  theme?: AmbienceTheme;
  accent?: string;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 select-none overflow-clip"
      aria-hidden="true"
    >
      <span
        className="eg-drift absolute -left-24 top-1/3 h-72 w-72 rounded-full"
        style={{
          background: `radial-gradient(circle,${accent}1f,transparent 68%)`,
          ["--dur" as string]: "22s",
        }}
      />
      <span
        className="eg-drift absolute -bottom-24 -right-16 h-80 w-80 rounded-full"
        style={{
          background: `radial-gradient(circle,${accent}26,transparent 68%)`,
          ["--dur" as string]: "28s",
          ["--delay" as string]: "-9s",
        }}
      />
      <span
        className="eg-drift absolute -inset-14 hidden md:block"
        style={{
          backgroundImage: `radial-gradient(${accent}33 1.2px,transparent 1.6px)`,
          backgroundSize: "32px 32px",
          maskImage: "linear-gradient(100deg,transparent 40%,#000)",
          WebkitMaskImage: "linear-gradient(100deg,transparent 40%,#000)",
          ["--dur" as string]: "40s",
          ["--dx" as string]: "32px",
          ["--dy" as string]: "32px",
        }}
      />
      {SLOTS.map((s, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width={s.size}
          height={s.size}
          fill="none"
          stroke={accent}
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`eg-float absolute ${s.mobile ? "" : "hidden md:block"}`}
          style={{
            left: s.left,
            top: s.top,
            opacity: 0.16,
            ["--dur" as string]: `${s.dur}s`,
            ["--delay" as string]: `${s.delay}s`,
            ["--tilt" as string]: `${s.tilt}deg`,
          }}
        >
          {ICONS[THEMES[theme][i]]}
        </svg>
      ))}
    </div>
  );
}
