/*
 * The interior page band, its breadcrumb and its call-to-action pair.
 * Ported from design-src/highland/ui.mjs.
 *
 * `variant` changes the decoration so page families do not all open the same
 * way — the client's one standing design requirement is that no two pages
 * feel redundant.
 */

import { HeroAmbience, type AmbienceTheme } from "./hero-ambience";

const ACCENT = "#0888c5";

export type Cta = { label: string; href: string };

export function CtaRow({
  primary,
  secondary,
  accent = ACCENT,
}: {
  primary: Cta;
  secondary?: Cta;
  accent?: string;
}) {
  return (
    <div
      className="eg-rise mt-8 flex flex-wrap items-center gap-3"
      style={{ ["--d" as string]: ".24s" }}
    >
      <a
        href={primary.href}
        className="rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-16px_rgb(8_136_197/0.9)] transition hover:-translate-y-0.5"
        style={{ background: accent }}
      >
        {primary.label}
      </a>
      {secondary ? (
        <a
          href={secondary.href}
          className="rounded-full border border-rule px-6 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold"
        >
          {secondary.label}
        </a>
      ) : null}
    </div>
  );
}

export function Crumb({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav
      className="font-mono text-[10px] uppercase tracking-widest text-steel"
      aria-label="Breadcrumb"
    >
      {trail.map((t, i) => (
        <span key={`${t.label}-${i}`}>
          {t.href ? (
            <a href={t.href} className="hover:text-gold">
              {t.label}
            </a>
          ) : (
            t.label
          )}
          {t.href && i < trail.length - 1 ? <span className="mx-2">/</span> : null}
        </span>
      ))}
    </nav>
  );
}

export type HeadVariant = "wash" | "rule" | "grid" | "beam";

/** The decoration behind the band. Four so page families open differently. */
function Decoration({ variant, accent }: { variant: HeadVariant; accent: string }) {
  switch (variant) {
    case "rule":
      return (
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
          style={{ background: `linear-gradient(90deg,${accent},transparent)` }}
          aria-hidden="true"
        />
      );
    case "grid":
      return (
        <span
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          aria-hidden="true"
          style={{
            backgroundImage: `linear-gradient(${accent}14 1px,transparent 1px),linear-gradient(90deg,${accent}14 1px,transparent 1px)`,
            backgroundSize: "56px 56px",
          }}
        />
      );
    case "beam":
      return (
        <span
          className="pointer-events-none absolute -left-24 top-0 h-full w-[28rem] -skew-x-12"
          style={{ background: `linear-gradient(90deg,${accent}1f,transparent)` }}
          aria-hidden="true"
        />
      );
    default:
      return (
        <span
          className="pointer-events-none absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full"
          style={{ background: `radial-gradient(circle,${accent}26,transparent 70%)` }}
          aria-hidden="true"
        />
      );
  }
}

export function PageHead({
  eyebrow,
  title,
  intro,
  accent = ACCENT,
  variant = "wash",
  crumb,
  meta,
  ctas,
  ambience,
  visual,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  accent?: string;
  variant?: HeadVariant;
  crumb?: React.ReactNode;
  meta?: React.ReactNode;
  ctas?: React.ReactNode;
  /** Floating icons and soft shapes behind the band; omit for none. */
  ambience?: AmbienceTheme;
  /** Decorative art in a right-hand column from lg up (below the text on mobile). */
  visual?: React.ReactNode;
}) {
  return (
    <header
      className="relative overflow-hidden border-b"
      style={{
        borderColor: `${accent}2e`,
        background: `linear-gradient(140deg,${accent}12,${accent}04)`,
      }}
    >
      <Decoration variant={variant} accent={accent} />
      {ambience ? <HeroAmbience theme={ambience} accent={accent} /> : null}
      <div
        className={
          visual
            ? "relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-14"
            : "relative mx-auto max-w-6xl px-6 py-16"
        }
      >
        <div className="min-w-0">
        {crumb}
        {eyebrow ? (
          <p
            className="eg-rise font-mono text-[11px] uppercase tracking-[0.28em]"
            style={{ color: accent }}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1
          className="eg-rise mt-3 max-w-4xl font-display text-[clamp(2rem,5vw,3.6rem)] leading-[1.02]"
          style={{ ["--d" as string]: ".06s" }}
        >
          {title}
        </h1>
        {intro ? (
          <p
            className="eg-rise mt-5 max-w-2xl text-lg text-ink/75"
            style={{ ["--d" as string]: ".14s" }}
          >
            {intro}
          </p>
        ) : null}
        {meta}
        {ctas}
        </div>
        {visual ? <div className="mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">{visual}</div> : null}
      </div>
    </header>
  );
}
