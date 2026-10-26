import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Fragment_Mono, Geologica } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/chrome";
import { DraftBanner } from "@/components/draft-banner";
import { NavProgress } from "@/components/ui/nav-progress";
import "./globals.css";

const geologica = Geologica({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-geologica",
  display: "swap",
});

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-atkinson",
  display: "swap",
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
  title: {
    default: "Edge Comm-Tech",
    template: "%s — Edge Comm-Tech",
  },
  description:
    "Edge Communication Technologies — integrated technology solutions across enterprise networks, cloud, datacenters, cybersecurity, software, AI, power and broadcast for Ethiopian institutions.",
};

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geologica.variable} ${atkinson.variable} ${fragmentMono.variable}`}>
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-gold focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <NavProgress />
        <SiteHeader />
        <div id="main">{children}</div>
        <SiteFooter />
        {/* Nothing at all unless an editor is previewing a draft. */}
        <DraftBanner />
      </body>
    </html>
  );
}
