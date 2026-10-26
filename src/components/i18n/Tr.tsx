import { AM } from "@/lib/i18n/am";

/*
 * Marks a string as translatable. Server-compatible (no hooks), so it works in
 * server and client components alike.
 *
 * Renders the English as the span's text, so the server HTML, crawlers and
 * no-JS readers see English, and carries the Amharic in data-am for
 * LanguageToggle to swap in after hydration. The dictionary is keyed by the
 * exact English string, so CMS-provided text is translated only while it still
 * matches an entry; any other string, or non-string children, renders as plain
 * children with no wrapper at all.
 *
 * Limits: it needs a plain string child, so it cannot wrap text that is
 * already split into elements (for example per-word animation spans); put it
 * around the whole string before splitting, or translate that heading another
 * way.
 */
export function Tr({ children }: { children?: React.ReactNode }) {
  if (typeof children !== "string") return <>{children}</>;
  const am = Object.hasOwn(AM, children) ? AM[children] : undefined;
  if (!am) return <>{children}</>;
  return <span data-am={am}>{children}</span>;
}
