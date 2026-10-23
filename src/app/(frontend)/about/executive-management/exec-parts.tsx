import { Confirmable, type ConfirmableValue } from "@/components/ui";

/*
 * The executive-management page's own pieces, beside page.tsx rather than in
 * it because Next allows a page only its known exports.
 */

export type ExecutiveRole = { title: string; holder?: ConfirmableValue };

/**
 * A monogram for the frame beside each card.
 *
 * Capitalised words only, up to three: "Chief Technology Officer" is CTO and
 * "Head of Delivery" is HD, not HoD. It is a visual placeholder standing in
 * for a portrait Edge has not supplied, and it is aria-hidden, so it carries
 * no information a reader needs.
 */
export function initials(title: string): string {
  return title
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 3)
    .map((w) => w[0])
    .join("");
}

/**
 * One executive role.
 *
 * The content master publishes five role titles and no names, biographies or
 * portraits, so every card shows its marker today. The holder is a
 * confirmable rather than a bare string precisely so this page can say what
 * it is waiting for instead of rendering an empty line.
 */
export function executiveCard(role: ExecutiveRole, i: number) {
  return (
    <article
      key={role.title}
      className="eg-inview flex items-center gap-5 rounded-3xl border border-rule p-7 transition hover:border-gold"
    >
      <span
        className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-paper-2 font-display text-xl text-steel/60"
        aria-hidden="true"
      >
        {initials(role.title)}
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gold">
          {`Role ${String(i + 1).padStart(2, "0")}`}
        </p>
        <h2 className="mt-1 font-display text-xl leading-snug">{role.title}</h2>
        <p className="mt-3">
          <Confirmable value={role.holder} />
        </p>
      </div>
    </article>
  );
}
