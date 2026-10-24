import { revalidatePath } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";

/**
 * Front-end pages are statically generated, so an edit in the admin has to tell
 * Next which paths are now stale. Payload hooks run inside the Next server for
 * admin writes, so `revalidatePath` is available there.
 *
 * The seed script runs outside a Next request context, where `revalidatePath`
 * throws. That is expected and harmless — there is no rendered page to expire.
 */
function expire(paths: string[], layout = false, patterns: string[] = []) {
  try {
    if (layout) {
      // Header and footer come from Site settings, so every route is stale.
      revalidatePath("/", "layout");
      return;
    }
    for (const path of new Set(paths)) {
      revalidatePath(path);
    }
    // revalidatePath("/projects") refreshes that one URL and not /projects/<slug>.
    // A dynamic page type is refreshed by its route pattern.
    for (const pattern of new Set(patterns)) {
      revalidatePath(pattern, "page");
    }
  } catch {
    // Not running inside Next (CLI script). Nothing is cached, nothing to do.
  }
}

type PathsFor<T> = (doc: T) => string[];

/**
 * `layout`: every route is stale (the document appears in the site chrome).
 * `patterns`: dynamic page types to refresh, e.g. "/projects/[slug]".
 */
type HookOptions = { layout?: boolean; patterns?: string[] };

/**
 * Revalidate after a document is created or updated. Pass `layout` when the
 * document appears in the site chrome (the footer lists every published
 * solution), so every route is stale rather than only the ones named.
 */
export function revalidateAfterChange<T>(
  paths: PathsFor<T>,
  options: HookOptions = {},
): CollectionAfterChangeHook {
  return ({ doc, previousDoc }) => {
    expire(
      [...paths(doc as T), ...(previousDoc ? paths(previousDoc as T) : [])],
      options.layout,
      options.patterns,
    );
    return doc;
  };
}

/** Revalidate after a document is deleted. */
export function revalidateAfterDelete<T>(
  paths: PathsFor<T>,
  options: HookOptions = {},
): CollectionAfterDeleteHook {
  return ({ doc }) => {
    expire(paths(doc as T), options.layout, options.patterns);
    return doc;
  };
}

/** Revalidate after a global is updated. Pass `layout` for site-wide chrome. */
export function revalidateGlobal(
  paths: string[],
  layout = false,
  patterns: string[] = [],
): GlobalAfterChangeHook {
  return ({ doc }) => {
    expire(paths, layout, patterns);
    return doc;
  };
}
