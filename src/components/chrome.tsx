import Image from "next/image";
import Link from "next/link";
import { Tr } from "./i18n/Tr";
import { NavLinks } from "./nav-links";
import { getCompany, getContactDetails, getSiteSettings, getSolutions } from "@/lib/content";
import { solutionHref } from "@/lib/routes";

/*
 * Highland's header and footer.
 *
 * Both fetch their own data rather than taking it as props: they are rendered
 * once by the layout, the readers are cache()d, and threading five globals
 * through the layout as props only invites a page to pass the wrong one.
 *
 * Every fact in the footer comes from the CMS. The footer this replaces was
 * the single-page design's, string-patched, and it carried the wrong office
 * address and the wrong telephone number on every page -- which is why
 * contact-details is admin-only.
 */

export async function SiteHeader() {
  const settings = await getSiteSettings();
  const items = (settings.nav ?? []).map((n) => ({ label: n.label, href: n.href }));
  /*
   * The gold button reads from the CMS rather than being written in here.
   * Highland's markup had "Contact us" on the desktop pill and the shorter
   * "Contact" in the mobile strip; one field drives both, because a strip that
   * already scrolls horizontally has no width problem to solve, and two labels
   * from one field would mean an editor renaming the button and finding half
   * of it unchanged.
   */
  const cta = {
    label: settings.headerCta?.label ?? "Contact us",
    href: settings.headerCta?.href ?? "/contact",
  };

  return (
    <header className="eg-site-header sticky top-0 z-40 border-b border-rule bg-paper/90 text-ink backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="shrink-0 leading-none">
          <Image
            src="/edge-logo.png"
            alt="Edge Communication Technologies"
            width={391}
            height={176}
            className="h-14 w-auto"
            sizes="124px"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-5 text-sm lg:flex" aria-label="Main">
          <NavLinks items={items} />
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href={cta.href}
            className="hidden rounded-full bg-gold px-4 py-2 text-sm text-white md:inline-block"
          >
            <Tr>{cta.label}</Tr>
          </Link>
        </div>
      </div>
      {/*
       * The same links again for narrow screens. Labelled separately from the
       * nav above: two landmarks with one name give a screen-reader user two
       * identical entries in the landmark list and no way to tell them apart.
       */}
      <nav
        className="flex gap-4 overflow-x-auto border-t border-rule px-6 py-2.5 text-xs lg:hidden"
        aria-label="Main, compact"
      >
        <NavLinks items={items} className="whitespace-nowrap" idleClass="text-ink/70" />
        <Link href={cta.href} className="whitespace-nowrap text-gold">
          <Tr>{cta.label}</Tr>
        </Link>
      </nav>
    </header>
  );
}

export async function SiteFooter() {
  const [settings, contact, solutions, company] = await Promise.all([
    getSiteSettings(),
    getContactDetails(),
    getSolutions(),
    getCompany(),
  ]);

  const companyLinks = (settings.nav ?? []).filter((n) => n.href !== "/solutions");
  const pill =
    "rounded-full border border-rule px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink/70 transition hover:border-gold hover:text-gold";

  return (
    <footer className="border-t border-rule bg-paper-2">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Image
            src="/edge-logo.png"
            alt="Edge Communication Technologies"
            width={391}
            height={176}
            className="h-16 w-auto"
          />
          <p className="mt-3 max-w-sm text-sm text-ink/70">
            An integrated technology company in Addis Ababa, delivering the infrastructure,
            security, software and support that Ethiopian banks, universities and public
            institutions depend on.
          </p>
          <p className="mt-4 flex flex-wrap gap-2">
            {contact.whatsapp ? (
              <a href={contact.whatsapp} className={pill}>
                WhatsApp
              </a>
            ) : null}
            <Link href="/subscribe" className={pill}>
              Subscribe
            </Link>
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm">
            <Tr>Solutions</Tr>
          </h4>
          <ul className="mt-3 space-y-1.5 text-sm text-ink/70">
            {solutions.map((s) => (
              <li key={s.slug}>
                <Link href={solutionHref(s.slug)} className="hover:text-gold">
                  {s.short}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/services" className="hover:text-gold">
                <Tr>Professional services</Tr>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm">
            <Tr>Company</Tr>
          </h4>
          <ul className="mt-3 space-y-1.5 text-sm text-ink/70">
            {companyLinks.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-gold">
                  <Tr>{n.label}</Tr>
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="hover:text-gold">
                <Tr>Contact</Tr>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm">Get in touch</h4>
          <ul className="mt-3 space-y-1.5 text-sm text-ink/70">
            <li>
              {/*
               * slice(1) drops the first line, which is the company's legal
               * name: the logo above already carries it, and the approved
               * footer prints the address alone here.
               */}
              {(contact.office ?? []).slice(1).map((line) => (
                <span key={line.line} className="block">
                  {line.line}
                </span>
              ))}
            </li>
            {(contact.emails ?? []).map((e) => (
              <li key={e.value}>
                <a href={`mailto:${e.value}`} className="hover:text-gold">
                  {e.value}
                </a>
              </li>
            ))}
            {(contact.phones ?? []).map((t) => (
              <li key={t.tel}>
                <a href={`tel:${t.tel}`} className="hover:text-gold">
                  {t.value}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-3 border-t border-rule px-6 py-6 text-sm text-steel md:flex-row md:justify-between">
        <p>
          {`© ${new Date().getFullYear()} ${company.legalName}. All rights reserved.`}
        </p>
        {/*
         * Highland's second line here read "Design review build — content
         * pending final approval", which belonged to the review build and must
         * not ship as site copy. The CMS has a field for an approved line in
         * this slot and it is empty, so nothing renders -- see the note on
         * footerNote in SiteSettings.
         */}
        {settings.footerNote ? <p className="text-ink/50">{settings.footerNote}</p> : null}
      </div>
    </footer>
  );
}
