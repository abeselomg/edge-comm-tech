import { Placeholder } from "@/components/placeholder";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Careers" };
export default function Page() {
  return (
    <Placeholder
      title="Careers"
      body="Internships, open roles, and CV apply. Job pages will link into E-Academy materials."
    />
  );
}
