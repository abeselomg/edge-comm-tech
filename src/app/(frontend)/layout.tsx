import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/chrome";
import { getSiteSettings } from "@/lib/content";
import "./globals.css";

/* Display face carries a width axis; headlines run expanded. */
const archivo = Archivo({
  subsets: ["latin"],
  // Loaded as a variable font so the width axis is available; declaring a
  // static weight list here would disable it.
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
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
    <html lang="en" className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-brass focus:px-4 focus:py-2 focus:text-deep"
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
