import { isDraft } from "@/lib/draft";
import { ExitPreviewLink } from "./exit-preview-link";

/*
 * The "you are previewing" pill, rendered by the frontend layout.
 *
 * Outside draft mode it renders nothing at all -- not a hidden element -- so
 * the public site's markup is unchanged. isDraft() is safe in a layout: during
 * a static prerender it reads false without making the page dynamic.
 *
 * A small pill at the bottom left rather than a bar across the top, so it
 * never covers the sticky site header an editor is checking.
 */
export async function DraftBanner() {
  if (!(await isDraft())) return null;
  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-50 flex max-w-[calc(100vw-2rem)] flex-wrap items-center gap-3 rounded-full bg-ink px-4 py-2 text-sm text-paper shadow-lg"
    >
      <span>Preview — unpublished changes are shown</span>
      <ExitPreviewLink />
    </div>
  );
}
