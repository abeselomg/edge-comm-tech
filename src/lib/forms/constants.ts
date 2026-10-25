/*
 * Shared by the server guard and the browser form, so it lives apart from
 * guard.ts (which imports node:crypto and cannot reach a client bundle).
 */

/** The honeypot. Rendered hidden, off-screen, tabindex=-1, autocomplete=off. */
export const HONEYPOT_FIELD = "website_url";

/** A CV may be at most this big. The browser checks it first; the server enforces it. */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
