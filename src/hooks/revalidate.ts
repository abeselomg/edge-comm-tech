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
function expire(paths: string[], layout = false) {
  try {
    if (layout) {
      // Header and footer come from Site settings, so every route is stale.
      revalidatePath("/", "layout");
      return;
    }
    for (const path of new Set(paths)) {
      revalidatePath(path);
    }
  } catch {
    // Not running inside Next (CLI script). Nothing is cached, nothing to do.
  }
}

type PathsFor<T> = (doc: T) => string[];

/** Revalidate after a document is created or updated. */
export function revalidateAfterChange<T>(paths: PathsFor<T>): CollectionAfterChangeHook {
  return ({ doc, previousDoc }) => {
    expire([...paths(doc as T), ...(previousDoc ? paths(previousDoc as T) : [])]);
    return doc;
  };
}

/** Revalidate after a document is deleted. */
export function revalidateAfterDelete<T>(paths: PathsFor<T>): CollectionAfterDeleteHook {
  return ({ doc }) => {
    expire(paths(doc as T));
    return doc;
  };
}

/** Revalidate after a global is updated. Pass `layout` for site-wide chrome. */
export function revalidateGlobal(paths: string[], layout = false): GlobalAfterChangeHook {
  return ({ doc }) => {
    expire(paths, layout);
    return doc;
  };
}
