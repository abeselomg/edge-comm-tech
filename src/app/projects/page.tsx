import { Placeholder } from "@/components/placeholder";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Projects" };
export default function Page() {
  return (
    <Placeholder
      title="Projects"
      body="Filtered portfolio: scope, client, stack, images. Seed content after the CMS schema."
    />
  );
}
