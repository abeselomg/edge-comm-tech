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
}: {
  item: MarkItem;
  h?: string;
  /** Kept for call-site parity with Highland's `box`; the frame is the parent's. */
  box?: string;
}) {
  const logo = approvedLogo(item.logo);
  if (!logo) {
    return (
      <span className="px-2 text-center font-display text-[13px] leading-tight text-ink/70">
        {item.name}
      </span>
    );
  }
  /*
   * A plain <img>, not next/image. The URL is a CMS upload whose intrinsic
   * size is whatever the editor supplied, the frame around it is fixed by the
   * parent, and next/image would need every uploaded path added to
   * images.localPatterns to be allowed through at all. The disable sits on the
   * element itself because that is the line the rule reports.
   */
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo.url}
      alt={item.name}
      width={logo.width ?? 240}
      height={logo.height ?? 160}
      className={`${h} w-auto max-w-full object-contain`}
      decoding="async"
    />
  );
}
