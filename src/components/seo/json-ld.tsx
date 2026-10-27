import { clean } from "@/lib/seo/jsonld/clean";

const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

/** The JSON for a <script>: `<` becomes < so "</script>" cannot end the tag. */
export function serializeJsonLd(data: unknown): string | undefined {
  const cleaned = clean(data);
  if (cleaned === undefined) return undefined;
  return JSON.stringify(cleaned)
    .replace(/</g, "\\u003c")
    .split(LINE_SEPARATOR)
    .join("\\u2028")
    .split(PARAGRAPH_SEPARATOR)
    .join("\\u2029");
}

/**
 * schema.org structured data as a JSON-LD script. Renders nothing when there
 * is nothing to say. A script is not visible text, so it changes no page copy.
 */
export function JsonLd({ data }: { data: unknown }) {
  const json = serializeJsonLd(data);
  if (!json) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
