import Link from "next/link";
import type { SiteSetting } from "@/lib/content";
import { MobileNav } from "@/components/mobile-nav";

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`display text-[1.0625rem] leading-none ${className}`} style={{ fontStretch: "112%" }}>
      Edge<span className="font-normal"> COMM-TECH</span>
    </span>
  );
}

export function SiteHeader({ settings }: { settings: SiteSetting }) {
  const nav = settings.nav ?? [];
  const cta = settings.headerCta;
  const ctaHref = cta?.href ?? "/contact";
  const ctaLabel = cta?.label ?? "Book a consultation";

  return (
    <header
      className="sticky top-0 z-40 border-b border-rule-dark bg-deep text-paper"
      style={{ ["--header-h" as string]: "3.75rem" }}
    >
      <div className="wrap flex h-15 min-h-[3.75rem] items-center justify-between gap-6">
        <Link href="/" className="shrink-0">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.id ?? item.href}
              href={item.href}
              className="text-[0.9375rem] text-paper/70 transition-colors hover:text-brass"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href={ctaHref} className="hidden text-[0.9375rem] text-brass link-quiet md:block">
          {ctaLabel}
        </Link>

        <MobileNav nav={nav} ctaHref={ctaHref} ctaLabel={ctaLabel} />
      </div>
    </header>
  );
}

export function SiteFooter({ settings }: { settings: SiteSetting }) {
  const contact = settings.contact;
  const showContact = Boolean(contact?.verified);
  const nav = settings.nav ?? [];
  const social = settings.social ?? [];

  return (
    <footer className="bg-deep text-paper">
      <div className="wrap band-tight">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <Wordmark className="text-[1.25rem]" />
            <p className="mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-paper/60">
              {settings.footerNote}
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-[0.9375rem] font-semibold text-paper">Explore</h2>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.id ?? item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.9375rem] text-paper/60 transition-colors hover:text-brass"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[0.9375rem] font-semibold text-paper">Contact</h2>
            {showContact ? (
              <ul className="mt-4 space-y-2.5 text-[0.9375rem] text-paper/60">
                {contact?.phone ? (
                  <li>
                    <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="hover:text-brass">
                      {contact.phone}
                    </a>
                  </li>
                ) : null}
                {contact?.email ? (
                  <li>
                    <a href={`mailto:${contact.email}`} className="hover:text-brass">
                      {contact.email}
                    </a>
                  </li>
                ) : null}
                {contact?.address ? <li className="whitespace-pre-line">{contact.address}</li> : null}
              </ul>
            ) : (
              <p className="mt-4 text-[0.9375rem] text-paper/60">
                <Link href="/contact" className="text-brass link-quiet">
                  Send us a message
                </Link>
              </p>
            )}

            {social.length > 0 ? (
              <ul className="mt-5 flex flex-wrap gap-4">
                {social.map((s) => (
                  <li key={s.id ?? s.url}>
                    <a
                      href={s.url}
                      className="text-[0.9375rem] text-paper/60 hover:text-brass"
                      rel="noreferrer"
                    >
                      {s.platform}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-rule-dark">
        <div className="wrap flex flex-col gap-2 py-5 text-sm text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p>Edge Communication Technologies, Addis Ababa</p>
          <p>© {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
