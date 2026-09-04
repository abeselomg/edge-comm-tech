import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/chrome";
import { getSiteSettings } from "@/lib/content";
import "./globals.css";

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
    <html lang="en">
      <body className="min-h-screen antialiased">
        <SiteHeader settings={settings} />
        {children}
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}
