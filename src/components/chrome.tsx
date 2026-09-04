import Link from "next/link";
import { nav } from "@/lib/content";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper-2/95 text-ink backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-lg tracking-tight">Edge COMM-TECH</span>
          <span className="font-caption hidden text-sm text-steel sm:inline">Addis Ababa</span>
        </Link>
        <nav className="hidden items-center gap-5 text-[13px] md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-ink/70 hover:text-gold">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="text-[13px] text-gold">
          Book a consultation
        </Link>
      </div>
      <nav className="flex gap-4 overflow-x-auto border-t border-ink/10 px-6 py-2 text-xs md:hidden">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="whitespace-nowrap">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/15 bg-paper-2">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm md:flex-row md:justify-between">
        <p className="font-caption text-steel">Fig. colophon — Edge Communication Technologies, Ethiopia</p>
        <p>
          <Link href="/academy" className="text-gold">
            E-Academy
          </Link>
          <span className="text-steel"> · </span>
          <Link href="/contact" className="text-gold">
            Contact
          </Link>
        </p>
      </div>
    </footer>
  );
}
