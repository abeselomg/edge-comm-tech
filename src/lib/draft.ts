import { draftMode } from "next/headers";

/**
 * Is this request an editor's preview?
 *
 * True only when Next says draft mode is on for the current request, which
 * needs the `__prerender_bypass` cookie to equal this build's secret
 * previewModeId -- a forged or stale cookie reads as off. The cookie itself is
 * set only by the staff-only /preview route (Phase 7, Task 3).
 *
 * Outside a request -- the build's generateStaticParams, the seed script, a
 * test -- Next 15's draftMode() throws (synchronously, from
 * throwForMissingRequestStore). That is not an error here: there is no editor,
 * so the answer is "published", and the prerendered site keeps building.
 * During a static prerender or an ISR revalidation it does not throw; it
 * returns an empty DraftMode whose isEnabled is false, and reading isEnabled
 * does not mark the route dynamic (only enable()/disable() do).
 *
 * Anything but a literal `true` is treated as off, so the default fails closed.
 */
export async function isDraft(): Promise<boolean> {
  try {
    const mode = await draftMode();
    return mode?.isEnabled === true;
  } catch {
    return false;
  }
}
