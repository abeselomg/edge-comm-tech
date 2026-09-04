import type { Metadata } from "next";
import { PartnerNetwork } from "@/components/partner-network";

export const metadata: Metadata = { title: "Partners" };

export default function PartnersPage() {
  return (
    <main>
      <PartnerNetwork />
    </main>
  );
}
