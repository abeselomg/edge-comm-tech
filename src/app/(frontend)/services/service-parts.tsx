import Link from "next/link";
import { CheckList, SectionHead } from "@/components/ui";
import { publishedOnly, serviceHref } from "@/lib/routes";
import type { Service } from "@/payload-types";

/*
 * The service pages' own pieces, beside the pages because Next allows a page
 * only its known exports.
 */

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The body of one service page: what the engagement covers, then whichever of
 * deliverables, engagement models, "best suited for" and a qualifying note the
 * record carries. A section the record does not carry does not open at all.
 */
export function ServiceBody({ service: s }: { service: Service }) {
  const c = s.accent;
  const capabilities = s.capabilities ?? [];
  const checklist = s.checklist ?? [];
  const models = s.models ?? [];
  return (
    <>
      {capabilities.length ? (
        <section>
          <SectionHead eyebrow="Core services" title="What the engagement covers" accent={c} />
          <ol className="mt-7">
            {capabilities.map((x, i) => (
              <li
                key={x.title}
                className="eg-inview grid gap-x-6 gap-y-2 border-t border-rule py-6 sm:grid-cols-[3.5rem_1fr]"
              >
                <span className="font-mono text-sm" style={{ color: c }}>
                  {pad(i + 1)}
                </span>
                <span>
                  <span className="block font-display text-xl leading-snug">{x.title}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-ink/70">{x.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {checklist.length ? (
        <section className="mt-16 rounded-3xl p-8" style={{ background: `${c}0c` }}>
          <SectionHead eyebrow="Deliverables" title={s.checklistTitle ?? ""} accent={c} />
          <CheckList items={checklist.map((x) => x.item)} accent={c} cols="sm:grid-cols-1" />
        </section>
      ) : null}

      {models.length ? (
        <section className="mt-16">
          <SectionHead eyebrow="Engagement models" title={s.modelsTitle ?? ""} accent={c} />
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {models.map((m) => (
              <div key={m.title} className="eg-inview rounded-2xl bg-paper-2 p-6">
                <dt className="font-display text-lg">{m.title}</dt>
                <dd className="mt-2 text-sm text-ink/70">{m.body}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {s.fit ? (
        <section className="mt-16 border-t border-rule pt-10">
          <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: c }}>
            Best suited for
          </p>
          <p className="mt-3 text-lg leading-relaxed text-ink/80">{s.fit}</p>
        </section>
      ) : null}

      {s.note ? (
        <p className="mt-8 flex items-start gap-2.5 rounded-2xl bg-paper-2 px-6 py-5 text-xs leading-relaxed text-steel">
          <svg
            viewBox="0 0 24 24"
            className="mt-0.5 h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8h.01M11 12h1v4h1" />
          </svg>
          <span>{s.note}</span>
        </p>
      ) : null}
    </>
  );
}

function Pill({ s }: { s: Service }) {
  return (
    <li>
      <Link
        href={serviceHref(s.slug)}
        className="block rounded-full px-4 py-2 text-xs font-semibold transition hover:-translate-y-0.5"
        style={{ background: `${s.accent}14`, color: s.accent }}
      >
        {s.short}
      </Link>
    </li>
  );
}

/** Related services, published ones only: the depth populate keeps an unpublished one. */
export function RelatedServices({
  related,
  accent,
}: {
  related: (Service | number)[];
  accent: string;
}) {
  const shown = publishedOnly<Service>(related);
  if (!shown.length) return null;
  return (
    <section className="mt-16 border-t border-rule pt-10">
      <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>
        Related services
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {shown.map((s) => (
          <Pill key={s.slug} s={s} />
        ))}
      </ul>
    </section>
  );
}

export function OtherServices({
  services,
  currentSlug,
}: {
  services: Service[];
  currentSlug: string;
}) {
  const others = publishedOnly<Service>(services).filter((s) => s.slug !== currentSlug);
  if (!others.length) return null;
  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {others.map((s) => (
        <Pill key={s.slug} s={s} />
      ))}
    </ul>
  );
}

/**
 * One service as a chapter of the overview, alternating sides. The headline,
 * introduction and fit sentence are the service page's own, so the overview can
 * never describe a service differently from the page it links to.
 */
export function ServiceChapter({ service: s, index }: { service: Service; index: number }) {
  const c = s.accent;
  const flip = index % 2 === 1;
  return (
    <section className="grid items-start gap-10 border-t border-rule py-16 lg:grid-cols-[1fr_1fr] lg:gap-16">
      <div className={`eg-inview min-w-0 ${flip ? "lg:order-2" : ""}`}>
        <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: c }}>
          {`Service ${pad(s.order)} · ${s.short}`}
        </p>
        <h2 className="mt-3 font-display text-[clamp(1.5rem,2.8vw,2.2rem)] leading-tight">
          {s.headline}
        </h2>
        <p className="mt-4 leading-relaxed text-ink/75">{s.intro}</p>
        {s.fit ? (
          <p
            className="mt-4 border-l-2 pl-4 text-sm leading-relaxed text-ink/65"
            style={{ borderColor: `${c}66` }}
          >
            {s.fit}
          </p>
        ) : null}
        <Link
          href={serviceHref(s.slug)}
          className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest"
          style={{ color: c }}
        >
          {s.title} <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
      <div className={`eg-inview ${flip ? "lg:order-1" : ""}`}>
        <div className="rounded-3xl p-7" style={{ background: `${c}0d` }}>
          <p className="font-mono text-[10px] uppercase tracking-widest text-steel">
            What this includes
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {(s.capabilities ?? []).map((x) => (
              <li
                key={x.title}
                className="flex items-start gap-2.5 rounded-xl bg-paper px-3.5 py-2.5 text-[13px] leading-snug text-ink/80"
              >
                <span
                  className="mt-[0.4rem] h-1 w-1 shrink-0 rounded-full"
                  style={{ background: c }}
                />
                <span>{x.title}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11px] text-steel">
            {`Full scope on the ${s.short.toLowerCase()} page.`}
          </p>
        </div>
      </div>
    </section>
  );
}
