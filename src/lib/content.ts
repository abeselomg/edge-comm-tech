import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import type { SiteSetting } from "@/payload-types";

export type { SiteSetting };

/*
 * Reduced to the two readers whose collections survive the content-model
 * rebuild. Task 19 adds readers for the thirteen new collections and five
 * globals once they exist; keeping the old getters here would only hold
 * references to collections that are being deleted.
 */

const payloadClient = cache(async () => getPayload({ config }));

/**
 * Only published documents reach the public site. The Local API defaults to
 * overrideAccess: true, so the access rules in src/access are not enough on
 * their own -- every read filters on _status explicitly.
 */
export const PUBLISHED = { _status: { equals: "published" } } as const;

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await payloadClient();
  return payload.findGlobal({ slug: "site-settings", depth: 1 });
});

export type ContactForm = Awaited<ReturnType<typeof getContactForm>>;

/**
 * The contact form is a plugin-form-builder document so Edge staff can add or
 * reorder fields without a deploy. Phase 6 builds the remaining five forms.
 */
export const getContactForm = cache(async () => {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "forms",
    where: { title: { equals: "Contact" } },
    limit: 1,
    depth: 1,
  });
  return docs[0] ?? null;
});
