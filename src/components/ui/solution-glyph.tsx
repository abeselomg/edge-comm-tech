/*
 * One line icon per solution family, drawn on a 24x24 grid in a 1.6 stroke.
 * Iconography, not content: the schema has no field for it. The same glyph
 * serves the small chip and the large watermark on a home-page solution card,
 * so the two can never drift apart. An unknown slug gets the generic cube
 * rather than a blank chip.
 */

const CUBE = <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5m0 0 9-4.5M12 12v9" />;

const SHAPES: Record<string, React.ReactNode> = {
  // Code brackets with a small spark: software and AI.
  "software-ai-digital": (
    <>
      <path d="m8 8-4.5 4L8 16m8-8 4.5 4L16 16M13.2 6.5l-2.4 11" />
      <path d="M19 2.5v3M17.5 4h3" />
    </>
  ),
  // A hub wired to four nodes.
  "enterprise-network": (
    <>
      <circle cx="12" cy="12" r="2.6" />
      <circle cx="4.5" cy="5" r="1.9" />
      <circle cx="19.5" cy="5" r="1.9" />
      <circle cx="4.5" cy="19" r="1.9" />
      <circle cx="19.5" cy="19" r="1.9" />
      <path d="m6 6.4 4.1 3.8m7.9-3.8-4.1 3.8M6 17.6l4.1-3.8m7.9 3.8-4.1-3.8" />
    </>
  ),
  "system-cloud": (
    <path d="M7 18a4 4 0 0 1-.5-7.97 5.5 5.5 0 0 1 10.6-1.4A3.8 3.8 0 0 1 17.5 18zM12 12v5m0 0-2-2m2 2 2-2" />
  ),
  // A rack of three servers with status lights.
  "datacenter-facility-it-infrastructure": (
    <>
      <rect x="3.5" y="3" width="17" height="5" rx="1.4" />
      <rect x="3.5" y="9.5" width="17" height="5" rx="1.4" />
      <rect x="3.5" y="16" width="17" height="5" rx="1.4" />
      <path d="M7 5.5h.01M7 12h.01M7 18.5h.01M11 5.5h6M11 12h6M11 18.5h6" />
    </>
  ),
  cybersecurity: <path d="M12 3 5 6v6c0 4.2 3 7.4 7 9 4-1.6 7-4.8 7-9V6zm-3 9 2.2 2.2L15.5 10" />,
  "power-technology": <path d="M13 2 4.5 13H11l-1 9 8.5-11H12z" />,
  "broadcast-satellite": (
    <>
      <circle cx="12" cy="12" r="2.4" />
      <path d="M7.8 7.8a6 6 0 0 0 0 8.4m8.4-8.4a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2m14.2-14.2a10 10 0 0 1 0 14.2" />
    </>
  ),
  // The professional-service families, for any card that wants them.
  "advisory-assessment-design": (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5M8 10.5l1.8 1.8L13.2 9" />
    </>
  ),
  "procurement-supply": CUBE,
  "implementation-integration": (
    <path d="M9 3v4a2 2 0 0 1-2 2H3m6-6h6M15 3v4a2 2 0 0 0 2 2h4M3 15h4a2 2 0 0 1 2 2v4m6 0v-4a2 2 0 0 1 2-2h4" />
  ),
  "project-management-deployment": <path d="M4 5h9M4 12h13M4 19h7M16 5h4M20 19h-5M18.5 17v4" />,
  "training-knowledge-transfer": (
    <path d="m2.5 9 9.5-5 9.5 5-9.5 5zM6.5 11.5V16c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-4.5M21.5 9v6" />
  ),
  "managed-support-maintenance": (
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3.5 17.5a1.8 1.8 0 0 0 3 3l5.8-5.8a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" />
  ),
};

export const SOLUTION_GLYPH_SLUGS = Object.keys(SHAPES);

export function hasSolutionGlyph(slug: string): boolean {
  return slug in SHAPES;
}

type GlyphProps = { slug: string; className?: string; strokeWidth?: number };

/** The glyph as a decorative inline SVG; the generic cube for an unknown slug. */
export function SolutionGlyph({ slug, className, strokeWidth = 1.6 }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {SHAPES[slug] ?? CUBE}
    </svg>
  );
}

/**
 * The large, faint copy behind a card's text. Decorative only: no text,
 * hidden from assistive technology, ignored by the pointer, and painted below
 * the card's content (the card is an `isolate` stacking context). The colour
 * is the solution's own accent, so a card keeps its identity.
 */
export function SolutionWatermark({ slug, accent }: { slug: string; accent: string }) {
  return (
    <span
      aria-hidden="true"
      className="eg-card-mark pointer-events-none absolute -bottom-7 -right-7 -z-10 h-44 w-44"
      style={{ color: accent }}
    >
      <SolutionGlyph slug={slug} className="h-full w-full" strokeWidth={0.7} />
    </span>
  );
}
