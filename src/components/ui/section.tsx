import { CtaRow, type Cta } from "./page-head";

/*
 * Section headings and the closing call to action.
 * Ported from design-src/highland/ui.mjs.
 */

const ACCENT = "#0888c5";

export function Eyebrow({
  children,
  className = "text-gold",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`eg-rise font-mono text-[11px] uppercase tracking-[0.28em] ${className}`}>
      {children}
    </p>
  );
}

export function SectionHead({
  eyebrow,
  title,
  intro,
  accent = ACCENT,
  wide = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  accent?: string;
  wide?: boolean;
}) {
  return (
    <>
      {eyebrow ? (
        <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`mt-3 ${wide ? "max-w-4xl" : "max-w-3xl"} font-display text-[clamp(1.6rem,3vw,2.5rem)] leading-tight`}
      >
        {title}
      </h2>
      {intro ? <p className="mt-4 max-w-2xl text-ink/75">{intro}</p> : null}
    </>
  );
}

export function ClosingCta({
  title,
  body,
  primary,
  secondary,
  accent = ACCENT,
}: {
  title: React.ReactNode;
  body: React.ReactNode;
  primary: Cta;
  secondary?: Cta;
  accent?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t border-rule">
      <span
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{ background: `linear-gradient(120deg,${accent}16,transparent 60%)` }}
      />
      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
        <h2 className="eg-inview max-w-3xl font-display text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight">
          {title}
        </h2>
        <p className="eg-inview mt-4 max-w-2xl text-ink/75">{body}</p>
        <CtaRow primary={primary} secondary={secondary} accent={accent} />
      </div>
    </section>
  );
}
