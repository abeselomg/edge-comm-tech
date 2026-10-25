import { notFound } from "next/navigation";

/**
 * Read a document or answer 404.
 *
 * The readers in content.ts filter on _status and return null for a slug that
 * is absent *or* unpublished, so one null check covers both. (In an editor's
 * draft-mode preview an unpublished slug is found instead.) A thrown error is
 * not a 404 and is left to propagate: a database outage must not look like a
 * page that never existed.
 */
export async function loadOr404<T>(read: () => Promise<T | null | undefined>): Promise<T> {
  const doc = await read();
  if (doc === null || doc === undefined) notFound();
  return doc as T;
}
