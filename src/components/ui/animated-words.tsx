import { Fragment } from "react";

/**
 * Splits a heading into one clipped span per word so CSS can slide the words
 * up in sequence (.eg-hero-word in globals.css). Server component, no JS.
 *
 * The words stay separated by ordinary spaces, so textContent and innerText
 * read exactly as the original string; nothing is duplicated and there is no
 * aria-label. Delay per word is the --i custom property (index), which the
 * stylesheet scales and caps so a long CMS title never delays the h1 past
 * about a second.
 */
export function AnimatedWords({ text }: { text?: string | null }) {
  if (!text) return null;
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          {i > 0 ? " " : null}
          <span className="eg-hero-word">
            <span className="eg-hero-word-in" style={{ ["--i" as string]: i }}>
              {word}
            </span>
          </span>
        </Fragment>
      ))}
    </>
  );
}
