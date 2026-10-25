import { revalidatePath } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  Payload,
} from "payload";

/**
 * Front-end pages are statically generated, so an edit in the admin has to tell
 * Next which paths are now stale. Payload hooks run inside the Next server for
 * admin writes, so `revalidatePath` is available there.
 *
 * The seed script runs outside a Next request context, where `revalidatePath`
 * throws. That is expected and harmless — there is no rendered page to expire.
 */

/** The collection that supplies the slugs of each dynamic page type. */
export const PATTERN_SOURCE: Record<string, string> = {
  "/solutions/[slug]": "solutions",
  "/projects/[slug]": "projects",
  "/services/[slug]": "services",
  "/news/[slug]": "news",
  "/resources/media/[slug]": "news",
  "/events/[slug]": "events",
  "/careers/open-positions/[slug]": "jobs",
};

/**
 * revalidatePath("/x/[slug]", "page") did not purge the prerendered pages on the
 * server (found live: an unpublished project stayed linked from solution pages
 * after the pattern call). Concrete paths do work, so each pattern is expanded to
 * the real URL of every document of that type.
 */
export async function expandPatterns(
  payload: Payload | undefined,
  patterns: string[],
): Promise<string[]> {
  if (!payload) return [];
  const out: string[] = [];
  for (const pattern of new Set(patterns)) {
    const collection = PATTERN_SOURCE[pattern];
    if (!collection) continue;
    const found = await payload.find({
      collection: collection as never,
      limit: 0,
      pagination: false,
      depth: 0,
      overrideAccess: true,
      select: { slug: true } as never,
    });
    for (const d of found.docs as { slug?: string }[]) {
      if (d.slug) out.push(pattern.replace("[slug]", d.slug));
    }
  }
  return out;
}

async function expire(
  paths: string[],
  layout = false,
  patterns: string[] = [],
  payload?: Payload,
) {
  try {
    if (layout) {
      // Header and footer come from Site settings, so every route is stale.
      revalidatePath("/", "layout");
      return;
    }
    for (const path of new Set(paths)) {
      revalidatePath(path);
    }
    // A dynamic page type is refreshed by its route pattern and by each concrete URL.
    for (const pattern of new Set(patterns)) {
      revalidatePath(pattern, "page");
    }
    for (const path of new Set(await expandPatterns(payload, patterns))) {
      revalidatePath(path);
    }
  } catch {
    // Not running inside Next (CLI script). Nothing is cached, nothing to do.
  }
}

type PathsFor<T> = (doc: T) => string[];

/**
 * Does this save change what the public site shows? Only published content is
 * public, so a save that touches no published document needs no re-render.
 *
 * What Payload 3.88 passes to afterChange (operations/utilities/update.js):
 * - Autosave and Save Draft (PATCH `?draft=true`, body `_status: "draft"`) over a
 *   published document write only a version row; the live row is untouched.
 *   `doc` is that draft version (`_status: "draft"`), `previousDoc` the latest
 *   version before the save (`"published"`, or `"draft"` if an autosave was pending).
 * - Unpublish (PATCH, body `_status: "draft"`, NO `draft` param) updates the live
 *   row. `doc._status` is "draft" and `previousDoc` is again the latest version,
 *   "published" or, when an autosave is pending, "draft". Statuses alone therefore
 *   cannot tell it from a draft save; only the `draft` query param can.
 * - Publish / edit-and-publish: `doc._status` is "published".
 * - Create: `previousDoc` is `{}`.
 * A draft-version save never changes the live row (Payload skips `updateOne`
 * unless `_status` is "published"), so `draft=true` with `doc._status` "draft" is
 * safe to skip and cannot be used to hide a real change.
 *
 * Rule (correctness first, over-revalidating is harmless):
 * 1. no `_status` on either side (globals, forms): revalidate;
 * 2. `draft` query true and `doc._status` "draft": skip (a draft-version save);
 * 3. either side "published": revalidate (publish, edit, unpublish);
 * 4. no previous status (a new document, never public): skip;
 * 5. otherwise (draft -> draft with no draft signal, e.g. an unpublish while an
 *    autosave is pending, or a Local API draft save): revalidate.
 */
export function affectsPublishedSite(args: {
  doc?: unknown;
  previousDoc?: unknown;
  query?: unknown;
}): boolean {
  const statusOf = (d: unknown) => (d as { _status?: string } | null | undefined)?._status;
  const now = statusOf(args.doc);
  const before = statusOf(args.previousDoc);
  if (now === undefined && before === undefined) return true;
  const draftParam = (args.query as { draft?: unknown } | null | undefined)?.draft;
  if ((draftParam === true || draftParam === "true") && now === "draft") return false;
  if (now === "published" || before === "published") return true;
  if (before === undefined) return false;
  return true;
}

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
  return async ({ doc, previousDoc, req }) => {
    if (!affectsPublishedSite({ doc, previousDoc, query: req?.query })) return doc;
    await expire(
      [...paths(doc as T), ...(previousDoc ? paths(previousDoc as T) : [])],
      options.layout,
      options.patterns,
      req?.payload,
    );
    return doc;
  };
}

/** Revalidate after a document is deleted. */
export function revalidateAfterDelete<T>(
  paths: PathsFor<T>,
  options: HookOptions = {},
): CollectionAfterDeleteHook {
  return async ({ doc, req }) => {
    await expire(paths(doc as T), options.layout, options.patterns, req?.payload);
    return doc;
  };
}

/** Revalidate after a global is updated. Pass `layout` for site-wide chrome. */
export function revalidateGlobal(
  paths: string[],
  layout = false,
  patterns: string[] = [],
): GlobalAfterChangeHook {
  return async ({ doc, req }) => {
    await expire(paths, layout, patterns, req?.payload);
    return doc;
  };
}
