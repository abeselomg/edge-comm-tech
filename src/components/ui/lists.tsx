/*
 * The three list shapes the pages share, ported from
 * design-src/highland/ui.mjs.
 *
 * Each returns null rather than an empty container when it has nothing to
 * show. An empty <ul> is a gap in the layout with no explanation, and a
 * section with nothing to say should not open at all — the page decides
 * whether to say so instead.
 */

const ACCENT = "#0888c5";

/** A ticked list of capabilities or inclusions. */
export function CheckList({
  items,
  accent = ACCENT,
  cols = "sm:grid-cols-2",
}: {
  items: string[];
  accent?: string;
  cols?: string;
}) {
  if (!items.length) return null;
  return (
    <ul className={`mt-5 grid gap-2.5 ${cols}`}>
      {items.map((item) => (
        <li
          key={item}
          className="eg-inview flex items-start gap-3 rounded-2xl bg-paper-2 px-5 py-4 text-sm text-ink/80"
        >
          <svg
            viewBox="0 0 24 24"
            className="mt-0.5 h-4 w-4 shrink-0"
            fill="none"
            stroke={accent}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m5 12 5 5L20 7" />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** A numbered sequence — the delivery framework and the like. */
export function NumberedSteps({
  steps,
  accent = ACCENT,
}: {
  steps: { title: string; body: string }[];
  accent?: string;
}) {
  if (!steps.length) return null;
  return (
    <ol className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="eg-inview relative overflow-hidden rounded-2xl bg-paper-2 p-6"
        >
          <span
            className="absolute right-4 top-3 font-display text-4xl opacity-10"
            style={{ color: accent }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="font-display text-xl">{step.title}</h3>
          <p className="mt-2 text-sm text-ink/70">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}

/**
 * A heading with a paragraph beneath it.
 *
 * The shape the bands block renders, and the reason the bands block carries
 * `title` and `body` per entry rather than one string: collapsing them into a
 * run-on line would have made the ported page differ from the design the
 * client approved.
 */
export function CapCard({ title, body, id }: { title: string; body: string; id?: string }) {
  return (
    <article id={id} className="eg-inview rounded-2xl bg-paper-2 p-6">
      <h3 className="font-display text-xl">{title}</h3>
      <p className="mt-2 text-sm text-ink/70">{body}</p>
    </article>
  );
}
