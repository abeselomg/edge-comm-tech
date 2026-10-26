import type { MetadataRoute } from "next";
import { buildRobots } from "@/lib/seo/robots";

// Read SITE_INDEXABLE when the request arrives, not when the build ran.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return buildRobots();
}
