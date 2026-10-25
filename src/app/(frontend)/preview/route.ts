import { draftMode } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

import { safePreviewPath } from "@/lib/preview";

/*
 * GET /preview?path=/solutions/cybersecurity -- the only way into draft mode,
 * and so the only way a draft is ever rendered.
 *
 * The Payload session is the credential, read from this request's own cookie
 * by payload.auth. There is deliberately no secret query parameter: a secret
 * in a URL ends up in browser history, logs and the Referer header, and a
 * session already says who is asking. Next's own __prerender_bypass cookie is
 * an output of this route, never an input: it is not consulted here.
 *
 * Order matters: authenticate, then validate the path, then enable. Nothing
 * sets the cookie until both have passed, and no response echoes the input.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STAFF = new Set(["admin", "editor"]);

const refuse = (status: number, message: string) =>
  new Response(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });

export async function GET(request: Request) {
  let user: { role?: unknown } | null = null;
  try {
    const payload = await getPayload({ config });
    ({ user } = await payload.auth({ headers: request.headers }));
  } catch {
    // An auth failure is a refusal, never a pass.
    user = null;
  }
  if (!user) return refuse(401, "Sign in to the admin to preview.");
  if (!STAFF.has(user.role as string)) return refuse(403, "Only staff can preview.");

  const path = safePreviewPath(new URL(request.url).searchParams.get("path"));
  if (!path) return refuse(400, "That page cannot be previewed.");

  (await draftMode()).enable();
  // Relative Location: the browser resolves it against this origin, so the
  // redirect cannot leave the site whatever the Host header says.
  return new Response(null, {
    status: 307,
    headers: { Location: path, "Cache-Control": "no-store" },
  });
}
