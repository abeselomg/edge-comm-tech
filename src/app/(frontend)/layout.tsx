import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Fragment_Mono, Geologica } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/chrome";
import { getSiteSettings } from "@/lib/content";
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

export const metadata: Metadata = {
  title: {
    default: "Edge COMM-TECH",
    template: "%s · Edge COMM-TECH",
  },
  description:
    "Edge Communication Technologies — data center, cybersecurity, network, cloud, and professional services for enterprises in Ethiopia.",
};

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className={`${geologica.variable} ${atkinson.variable} ${fragmentMono.variable}`}>
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-gold focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader settings={settings} />
        <div id="main">{children}</div>
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}
