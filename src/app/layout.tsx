import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/chrome";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Edge COMM-TECH",
    template: "%s · Edge COMM-TECH",
  },
  description:
    "Edge Communication Technologies — ICT infrastructure, communications, and a public E-Academy in Ethiopia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
