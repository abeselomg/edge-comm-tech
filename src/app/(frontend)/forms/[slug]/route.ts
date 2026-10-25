import { handleSubmission } from "@/lib/forms/submit";

/*
 * POST /forms/<slug>: the only public way to submit a form. All of the work,
 * and the reasons for its order, are in src/lib/forms/submit.ts; a route file
 * may export only HTTP verbs and Next's config values.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  return handleSubmission(request, (await params).slug);
}
