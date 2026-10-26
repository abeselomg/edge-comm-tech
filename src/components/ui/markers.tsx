import Image from "next/image";
import { approvedLogo } from "@/lib/media";

/*
 * Absent content, and facts not yet confirmed.
 *
 * These three are the reason the ported pages can be honest about what Edge
 * still owes. Five executive biographies, 29 of 32 partner marks, 9 of 10
 * client marks and one project year are missing today, and the content
 * master's rule is that an absence is shown rather than filled with
 * something plausible. A blank space is not an absence shown; it is a layout
 * that looks finished.
 *
 * Ported from design-src/highland/ui.mjs. Highland's esc() is gone because
 * React escapes by default -- which is also why nothing here reaches for
 * dangerouslySetInnerHTML.
 */

/** A fact the content master lists as still to be confirmed by Edge. */
export function Pending({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-lamp/40 bg-lamp/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-lamp">
      <svg viewBox="0 0 8 8" className="h-1.5 w-1.5" aria-hidden="true">
        <circle cx="4" cy="4" r="4" fill="currentColor" />
      </svg>
      {children}
    </span>
  );
}

/** The shape `confirmable()` stores: a value, whether Edge confirmed it, and
 *  what the marker says while they have not. */
export type ConfirmableValue = {
  value?: string | null;
  status?: "confirmed" | "pending" | null;
  pendingLabel?: string | null;
};

/**
 * A confirmable fact.
 *
 * Pending renders the label in a marker. Confirmed renders the value — or an
 * em dash if it is somehow empty, because a confirmed-but-blank field is an
 * editor mistake and a dash is a visible one, where rendering nothing hides
 * it in a layout that still looks right.
 */
export function Confirmable({ value }: { value?: ConfirmableValue }) {
  if (!value) return <>—</>;
  if (value.status === "pending") {
    return <Pending>{value.pendingLabel ?? "To be confirmed"}</Pending>;
  }
  return <>{value.value || "—"}</>;
}

/** An SVG is served untouched: next/image refuses to optimize it, and it is small. */
const isSvg = (url: string) => /\.svg(\?|$)/i.test(url);

/** What a client or partner record carries for its mark. */
export type MarkItem = { name: string; logo?: unknown };

/**
 * A brand or client mark where approved artwork exists, and the institution's
 * name set in the same frame where it does not.
 *
 * One component so the two can never drift apart, and the approval check runs
 * here rather than at each call site. `filterOptions` on the relationship
 * stops an unapproved asset being *selected* in the admin; it does nothing
 * about one un-approved after selection, which is the case the content master
 * cares about, because approval is withdrawn precisely when someone discovers
 * an asset should not have been published.
 */
export function Mark({
  item,
  h = "h-10",
  imgClass,
  nameClass,
  lazy = true,
  sizes = "160px",
}: {
  item: MarkItem;
  h?: string;
  /** Kept for call-site parity with Highland's `box`; the frame is the parent's. */
  box?: string;
  /** Replace the logo's classes, for a frame that sizes the mark itself. */
  imgClass?: string;
  /** Replace the name's classes, likewise. */
  nameClass?: string;
  /**
   * Lazy-load the logo (the default; also stops it being preloaded in the page
   * head). Pass `false` only for a mark inside the first viewport.
   */
  lazy?: boolean;
  /** The width the logo is drawn at, so the optimizer sends a small file. */
  sizes?: string;
}) {
  const logo = approvedLogo(item.logo);
  if (!logo) {
    return (
      <span
        className={nameClass ?? "px-2 text-center font-display text-[13px] leading-tight text-ink/70"}
      >
        {item.name}
      </span>
    );
  }
  /*
   * next/image, so the browser gets a logo resized to the size it is drawn at
   * (a few KB, as AVIF or WebP) rather than the editor's original upload, which
   * can be hundreds of KB for a 40px mark. /api/media/file/** is allowed in
   * images.localPatterns (next.config.ts). The intrinsic width and height only
   * give the aspect ratio; the className still sizes the mark, as before. A
   * logo is never preloaded (no `priority`). SVG is vector already, so it is
   * served as-is.
   */
  return (
    <Image
      src={logo.url}
      alt={item.name}
      width={logo.width ?? 240}
      height={logo.height ?? 160}
      sizes={sizes}
      className={imgClass ?? `${h} w-auto max-w-full object-contain`}
      decoding="async"
      loading={lazy ? "lazy" : "eager"}
      unoptimized={isSvg(logo.url)}
    />
  );
}
