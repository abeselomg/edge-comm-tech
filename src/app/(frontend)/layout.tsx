import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Fragment_Mono, Geologica } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/chrome";
import { DraftBanner } from "@/components/draft-banner";
import { LanguageToggle } from "@/components/i18n/LanguageToggle";

import { FontGate } from "@/components/ui/font-gate";
import { HeaderOverHero } from "@/components/ui/header-over-hero";
import { NavProgress } from "@/components/ui/nav-progress";
import { SITE_DESCRIPTION, TITLE_TEMPLATE } from "@/lib/seo/metadata";
import { SITE_NAME, siteIndexable, siteUrl } from "@/lib/seo/site";
import "./globals.css";

const geologica = Geologica({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-geologica",
  display: "block",
});

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-atkinson",
  display: "block",
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-fragment",
  display: "swap",
});

/*
 * "Edge Comm-Tech", not "Edge COMM-TECH": the short name appears 83 times in
 * the approved content and never in the upper-case form. COMPANY.short in the
 * content master is the authority.
 */
export const metadata: Metadata = {
  /*
   * The origin every relative URL in the metadata resolves against (share
   * images, the canonical link). From SITE_URL; see src/lib/seo/site.ts.
   */
  metadataBase: new URL(siteUrl()),
  title: {
    default: SITE_NAME,
    template: TITLE_TEMPLATE,
  },
  description: SITE_DESCRIPTION,
  /*
   * Not indexable unless SITE_INDEXABLE is exactly "true", for every page under
   * this layout. Pages that build their metadata with buildMetadata() repeat it,
   * since a page's own robots entry replaces the layout's.
   */
  ...(siteIndexable() ? {} : { robots: { index: false, follow: false } }),
};

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geologica.variable} ${atkinson.variable} ${fragmentMono.variable}`}>
      <body className="min-h-screen">
        <FontGate />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-gold focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <NavProgress />
        <SiteHeader />
        <HeaderOverHero />
        <div id="main">{children}</div>
        <SiteFooter />
        {/* Nothing at all unless an editor is previewing a draft. */}
        <DraftBanner />
        <LanguageToggle />
      </body>
    </html>
  );
}
