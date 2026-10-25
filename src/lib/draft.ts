import { cache } from "react";
import { draftMode, headers } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

const STAFF = new Set(["admin", "editor"]);

/**
 * Is this request an editor's preview?
 *
 * Two things must both hold:
 *
 * 1. Next says draft mode is on, i.e. the `__prerender_bypass` cookie equals
 *    this build's previewModeId. A forged cookie reads as off. The cookie is
 *    set only by the staff-only /preview route (Phase 7, Task 3).
 * 2. The same request carries a live Payload session for an `admin` or
 *    `editor`. The bypass cookie on its own is NOT trusted: it has one value
 *    per build, is not cleared when the user logs out of Payload, and is a
 *    session cookie a browser may restore -- so a logged-out or removed staff
 *    member, or anyone who copied the value, would otherwise keep seeing
 *    drafts. Logging out therefore ends preview even if the cookie stays.
 *
 * headers() and getPayload are touched only when draft mode is on, so a
 * static prerender or ISR revalidation (where isEnabled reads false) stays
 * static and never authenticates.
 *
 * Outside a request -- the build's generateStaticParams, the seed script, a
 * test -- Next 15's draftMode() throws (synchronously, from
 * throwForMissingRequestStore). That is not an error here: there is no editor,
 * so the answer is "published", and the prerendered site keeps building.
 * During a static prerender or an ISR revalidation it does not throw; it
 * returns an empty DraftMode whose isEnabled is false, and reading isEnabled
 * does not mark the route dynamic (only enable()/disable() do).
 *
 * Anything but a literal `true` plus a staff user is off: every error, a
 * missing session and an unknown role fail closed. Wrapped in React's cache()
 * so one request authenticates once, however many readers ask.
 */
export const isDraft = cache(async (): Promise<boolean> => {
  try {
    const mode = await draftMode();
    if (mode?.isEnabled !== true) return false;
    const payload = await getPayload({ config });
    const { user } = await payload.auth({ headers: await headers() });
    return !!user && STAFF.has((user as { role?: unknown }).role as string);
  } catch {
    return false;
  }
});
