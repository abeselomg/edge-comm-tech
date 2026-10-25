import { draftMode } from "next/headers";

import { safePreviewPath } from "@/lib/preview";

/*
 * GET /preview/exit?path=/events/expo -- leave draft mode and go back to the
 * page. No session needed: turning preview off is harmless. The path goes
 * through the same guard as /preview, so this is not an open redirect either;
 * anything refused lands on the home page.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  (await draftMode()).disable();
  const path = safePreviewPath(new URL(request.url).searchParams.get("path")) ?? "/";
  return new Response(null, {
    status: 307,
    headers: { Location: path, "Cache-Control": "no-store" },
  });
}
