import type { Metadata } from "next";
import { PartnerNetwork } from "@/components/partner-network";
import { getPartners } from "@/lib/content";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "The vendors and platforms Edge COMM-TECH builds on, across data center, cloud, network, cybersecurity, and applications.",
};

export default async function PartnersPage() {
  const partners = await getPartners();

  return (
    <main>
      <PartnerNetwork
        partners={partners}
        heading="Trusted by the platforms that run critical systems."
        intro="The technology vendors and platforms we build on — all integrated through Edge COMM-TECH."
      />
    </main>
  );
}
