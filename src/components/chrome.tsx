import Link from "next/link";
import type { SiteSetting } from "@/lib/content";

export function SiteHeader({ settings }: { settings: SiteSetting }) {
  const nav = settings.nav ?? [];
  const cta = settings.headerCta;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper-2/95 text-ink backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-lg tracking-tight">Edge COMM-TECH</span>
          <span className="font-caption hidden text-sm text-steel sm:inline">Addis Ababa</span>
        </Link>
        <nav className="hidden items-center gap-5 text-[13px] md:flex">
          {nav.map((item) => (
            <Link key={item.id ?? item.href} href={item.href} className="text-ink/70 hover:text-gold">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href={cta?.href ?? "/contact"} className="text-[13px] text-gold">
          {cta?.label ?? "Book a consultation"}
        </Link>
      </div>
      <nav className="flex gap-4 overflow-x-auto border-t border-ink/10 px-6 py-2 text-xs md:hidden">
        {nav.map((item) => (
          <Link key={item.id ?? item.href} href={item.href} className="whitespace-nowrap">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter({ settings }: { settings: SiteSetting }) {
  const contact = settings.contact;
  const showContact = Boolean(contact?.verified);

  return (
    <footer className="border-t border-ink/15 bg-paper-2">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-display text-lg">Edge COMM-TECH</p>
          <p className="font-caption mt-2 max-w-sm text-sm text-steel">{settings.footerNote}</p>
        </div>

        <div className="text-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel">Explore</p>
          <ul className="mt-3 space-y-1.5">
            {(settings.nav ?? []).map((item) => (
              <li key={item.id ?? item.href}>
                <Link href={item.href} className="text-ink/75 hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel">Contact</p>
          {showContact ? (
            <ul className="mt-3 space-y-1.5 text-ink/75">
              {contact?.phone ? (
                <li>
                  <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="hover:text-gold">
                    {contact.phone}
                  </a>
                </li>
              ) : null}
              {contact?.email ? (
                <li>
                  <a href={`mailto:${contact.email}`} className="hover:text-gold">
                    {contact.email}
                  </a>
                </li>
              ) : null}
              {contact?.address ? <li className="whitespace-pre-line">{contact.address}</li> : null}
            </ul>
          ) : (
            <p className="mt-3">
              <Link href="/contact" className="text-gold hover:underline">
                Send us a message
              </Link>
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-ink/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-4 text-xs text-steel md:flex-row md:justify-between">
          <p className="font-caption">
            Edge Communication Technologies · Addis Ababa, Ethiopia
          </p>
          <p>© {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
