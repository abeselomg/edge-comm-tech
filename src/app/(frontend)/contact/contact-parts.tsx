import Link from "next/link";
import type { ContactDetail } from "@/payload-types";

/*
 * The contact page's own pieces, beside page.tsx because Next allows a page
 * only its known exports.
 *
 * Every fact here is read from the contact-details record it is handed. That
 * global is admin-only because the inherited page carried the wrong office
 * address and the wrong telephone number on every page; nothing below is a
 * literal address, number or mailbox.
 */

const DARK = "#003D6B";

type Contact = Pick<
  ContactDetail,
  "office" | "mapUrl" | "phones" | "whatsapp" | "emails" | "emergency" | "response" | "hours"
>;

const lower = (s: string | null | undefined) => (s ?? "").toLowerCase();

/** Technical support, found by its label rather than its position in the list. */
export function supportEmail(contact: Pick<ContactDetail, "emails">): string | undefined {
  return (contact.emails ?? []).find((e) => /support/i.test(e.label))?.value;
}

const cta =
  "font-mono text-[10px] uppercase tracking-widest text-gold";

/** The three ways in: call, email, visit. */
export function ContactChannels({ contact }: { contact: Contact }) {
  const phones = contact.phones ?? [];
  const emails = contact.emails ?? [];
  const office = contact.office ?? [];
  const box = "eg-inview flex flex-col bg-paper-2 p-7";
  const dt = "font-mono text-[10px] uppercase tracking-widest text-gold";
  return (
    <dl className="grid gap-px overflow-hidden rounded-3xl bg-rule lg:grid-cols-3">
      <div className={box}>
        <dt className={dt}>Call or WhatsApp</dt>
        <dd className="mt-3 flex-1 space-y-2 text-sm leading-relaxed">
          {phones.map((p) => (
            <p key={p.tel}>
              <a href={`tel:${p.tel}`} className="hover:text-gold">
                {p.value}
              </a>
            </p>
          ))}
        </dd>
        {phones[0] ? <dd className="mt-4 text-xs text-steel">{phones[0].label}</dd> : null}
        {contact.whatsapp ? (
          <dd className="mt-4">
            <a href={contact.whatsapp} className={cta}>
              Open WhatsApp &rarr;
            </a>
          </dd>
        ) : null}
      </div>

      <div className={box}>
        <dt className={dt}>Email</dt>
        <dd className="mt-3 flex-1 space-y-2 text-sm leading-relaxed">
          {emails.map((e) => (
            <p key={e.value}>
              <a href={`mailto:${e.value}`} className="hover:text-gold">
                {e.value}
              </a>
              <span className="block font-mono text-[9px] uppercase tracking-widest text-steel">
                {e.label}
              </span>
            </p>
          ))}
        </dd>
        {contact.response ? (
          <dd className="mt-4 text-xs text-steel">{`Reply ${lower(contact.response)}`}</dd>
        ) : null}
      </div>

      <div className={box}>
        <dt className={dt}>Visit</dt>
        <dd className="mt-3 flex-1 space-y-2 text-sm leading-relaxed">
          <p>
            {office.map((l, i) => (
              <span key={l.line}>
                {l.line}
                {i < office.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        </dd>
        <dd className="mt-4 text-xs text-steel">Please arrange a time before visiting</dd>
        {contact.mapUrl ? (
          <dd className="mt-4">
            <a href={contact.mapUrl} className={cta}>
              Open in Maps &rarr;
            </a>
          </dd>
        ) : null}
      </div>
    </dl>
  );
}

/** One inquiry category: what to include, and where it goes. */
export function InquiryCard({
  c,
}: {
  c: { key: string; title: string; prompt: string; route: string };
}) {
  return (
    <li className="eg-inview flex flex-col rounded-2xl border border-rule p-6 transition hover:border-gold">
      <h3 className="font-display text-lg leading-snug">{c.title}</h3>
      <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-ink/70">{c.prompt}</p>
      <div className="mt-5 border-t border-rule pt-4">
        {c.key === "careers" ? (
          <Link href="/careers/open-positions" className={cta}>
            Use the careers process &rarr;
          </Link>
        ) : (
          <a href={`mailto:${c.route}`} className={cta}>
            {c.route}
          </a>
        )}
      </div>
    </li>
  );
}

/** The sidebar: office hours, the urgent-support line and the map card. */
export function ContactFacts({ contact }: { contact: Contact }) {
  const hours = contact.hours ?? [];
  const phones = contact.phones ?? [];
  const office = contact.office ?? [];
  const support = supportEmail(contact);
  return (
    <aside className="self-start lg:sticky lg:top-32">
      <div className="rounded-2xl bg-paper p-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-steel">Office hours</p>
        <dl className="mt-4 space-y-2.5">
          {hours.map((h) => (
            <div key={h.days} className="flex items-baseline justify-between gap-4 text-sm">
              <dt className="text-ink/75">{h.days}</dt>
              <dd
                className={`shrink-0 ${/closed/i.test(h.hours) ? "text-steel" : "font-mono text-[11px] text-ink/70"}`}
              >
                {h.hours}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {contact.emergency && phones[0] ? (
        <div className="mt-4 rounded-2xl p-6 text-white" style={{ background: DARK }}>
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/55">
            Urgent support
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-white/80">
            For a live incident on a system we support, call first — do not wait on email.
          </p>
          <a
            href={`tel:${phones[0].tel}`}
            className="mt-4 inline-block font-display text-lg text-white hover:text-gold"
          >
            {contact.emergency}
          </a>
          {support ? (
            <p className="mt-3 text-xs text-white/55">
              Then email{" "}
              <a href={`mailto:${support}`} className="underline decoration-white/30 underline-offset-2">
                {support}
              </a>{" "}
              with the project reference and impact.
            </p>
          ) : null}
        </div>
      ) : null}

      {contact.mapUrl && office.length > 2 ? (
        <a
          href={contact.mapUrl}
          className="mt-4 block overflow-hidden rounded-2xl border border-rule transition hover:border-gold"
        >
          <span
            className="relative block h-32"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(#0888c514 1px,transparent 1px),linear-gradient(90deg,#0888c514 1px,transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          >
            <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_0_6px_rgb(196_138_90/0.22)]" />
          </span>
          <span className="block px-5 py-4">
            <span className="block font-display text-base">{office[1].line}</span>
            <span className="mt-0.5 block text-xs text-steel">{office[2].line}</span>
            <span className="mt-2 block font-mono text-[10px] uppercase tracking-widest text-gold">
              Open in Maps &rarr;
            </span>
          </span>
        </a>
      ) : null}
    </aside>
  );
}
