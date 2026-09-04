import type { Metadata } from "next";
import { Archivo_Narrow, Instrument_Sans, Newsreader } from "next/font/google";
import "./design.css";

/*
 * Temporary comparison routes for choosing a homepage direction.
 * Delete this folder once a direction is picked.
 */

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const archivoNarrow = Archivo_Narrow({
  subsets: ["latin"],
  variable: "--font-archivo-narrow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Design directions",
  robots: { index: false, follow: false },
};

export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${newsreader.variable} ${instrument.variable} ${archivoNarrow.variable}`}>
      {children}
    </div>
  );
}
