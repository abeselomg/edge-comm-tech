/*
 * The pages that draw a stored form. Editing a `forms` document in the admin
 * (a label, an option, the confirmation text) must refresh these, or the old
 * form stays on screen until the next deploy. The two job-side pages are the
 * Task 6 forms; they are listed now so the hook does not need touching again.
 */

export const FORM_PATHS = ["/contact", "/subscribe", "/careers/e-academy", "/careers/internships"];

/** Dynamic page types, refreshed by pattern and by every concrete URL. */
export const FORM_PATTERNS = ["/events/[slug]", "/careers/open-positions/[slug]"];
