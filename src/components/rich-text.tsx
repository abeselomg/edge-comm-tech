import {
  RichText as LexicalRichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
});

/**
 * Renders a Payload Lexical field. Typography is applied by the wrapper class
 * so rich text inherits the same rhythm as hand-written page copy.
 */
export function RichText({
  data,
  className = "",
}: {
  data?: SerializedEditorState | null;
  className?: string;
}) {
  if (!data) return null;
  return (
    <div className={`prose-edge ${className}`}>
      <LexicalRichText data={data} converters={converters} />
    </div>
  );
}
