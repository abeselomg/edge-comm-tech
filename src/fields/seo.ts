import type { Field } from "payload";
import { forbidsPhrases } from "./validators";
import { stripMarkup } from "../lib/seo/text";

/*
 * Editors see these as "search appearance": what a search result and a shared
 * link show for the page. The caps are the lengths search engines show before
 * cutting. The title cap leaves room for the " | Edge Comm-Tech" the site adds
 * after it.
 */
export const META_TITLE_MAX = 60;
export const META_DESCRIPTION_MAX = 160;

const capped =
  (max: number, what: string, base: ReturnType<typeof forbidsPhrases>) =>
  (value: unknown, options?: { required?: boolean }): true | string => {
    const phrases = base(value, options);
    if (phrases !== true) return phrases;
    const length = typeof value === "string" ? stripMarkup(value).length : 0;
    if (length <= max) return true;
    return `Shorten the ${what} to ${max} characters or fewer; it is ${length}. Search results cut longer text off.`;
  };

const TEXT = {
  title: {
    max: META_TITLE_MAX,
    what: "search title",
    help: "Leave empty to use the page title. About 50-60 characters. The site name is added after it automatically, so do not type it.",
  },
  description: {
    max: META_DESCRIPTION_MAX,
    what: "search description",
    help: "Leave empty to use the summary. About 140-155 characters.",
  },
} as const;

/**
 * Attach the forbidden-phrase validator to the SEO plugin's own meta fields.
 *
 * `@payloadcms/plugin-seo` injects a `meta` group — title, description, image
 * and its preview components — into every collection it is given. Those fields
 * are created by the plugin, so the validators attached in the collection files
 * cannot reach them, and nothing else guards them.
 *
 * That matters more than it sounds. The meta description is the search-result
 * snippet and the Open Graph description: it is the text a buyer reads before
 * they ever load the page. An editor typing "Tier III certified facility" there
 * publishes exactly the claim the content master forbids, in the place it
 * travels furthest.
 *
 * Pass this as the plugin's `fields` option. It preserves every default field
 * and changes nothing but the two prose ones.
 */
export const guardSeoMetaFields = ({ defaultFields }: { defaultFields: Field[] }): Field[] =>
  defaultFields.map((field): Field => {
    // Guard by TYPE, not by name. Matching `title` and `description` by name
    // would cover today's plugin exactly and silently miss any prose field a
    // future version adds under another name. Every text and textarea the
    // plugin supplies is editor-entered prose that reaches a public page, so
    // every one of them wants the validator; the upload and `ui` fields have
    // no prose to check and are returned untouched.
    //
    // Narrow before spreading: spreading the whole Field union loses the
    // discriminant, and TypeScript then tries to match the result against
    // every field variant in it and asks for `relationTo`.
    if (field.type === "text" || field.type === "textarea") {
      // The two fields the plugin is known to create also get a length cap and
      // plain-English help; a prose field under any other name still gets the
      // phrase guard alone.
      const known = TEXT[field.name as keyof typeof TEXT];
      if (!known) return { ...field, validate: forbidsPhrases() };
      return {
        ...field,
        admin: { ...field.admin, description: known.help },
        validate: capped(known.max, known.what, forbidsPhrases()),
      } as Field;
    }

    // The plugin's `meta.image` is the Open Graph and search thumbnail -- the
    // single most widely redistributed image on the site, since every share
    // and every result card copies it. It is an upload to `media` with no
    // filter, so without this an editor could set it to an asset whose source,
    // retrieval date and reviewer were never recorded, defeating Task 8's gate
    // on exactly the image that travels furthest.
    if (field.type === "upload") {
      return {
        ...field,
        admin: {
          ...field.admin,
          description:
            "Picture shown when the page is shared. 1200 x 630 pixels recommended. Leave empty to use the Edge Comm-Tech default.",
        },
        filterOptions: { approved: { equals: true } },
      } as Field;
    }

    return field;
  });
