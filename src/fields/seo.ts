import type { Field } from "payload";
import { forbidsPhrases } from "./validators";

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
      return { ...field, validate: forbidsPhrases() };
    }

    // The plugin's `meta.image` is the Open Graph and search thumbnail -- the
    // single most widely redistributed image on the site, since every share
    // and every result card copies it. It is an upload to `media` with no
    // filter, so without this an editor could set it to an asset whose source,
    // retrieval date and reviewer were never recorded, defeating Task 8's gate
    // on exactly the image that travels furthest.
    if (field.type === "upload") {
      return { ...field, filterOptions: { approved: { equals: true } } };
    }

    return field;
  });
