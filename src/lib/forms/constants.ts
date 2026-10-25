/*
 * Shared by the server guard and the browser form, so it lives apart from
 * guard.ts (which imports node:crypto and cannot reach a client bundle).
 */

/** The honeypot. Rendered hidden, off-screen, tabindex=-1, autocomplete=off. */
export const HONEYPOT_FIELD = "website_url";
