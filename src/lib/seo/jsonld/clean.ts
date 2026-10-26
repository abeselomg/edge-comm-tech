/*
 * Structured data must not carry empty values: `"telephone": ""` reads as a
 * claim that there is a phone number. clean() removes null, undefined, empty
 * or whitespace-only strings, NaN, empty arrays and empty objects, recursively,
 * and reports whether anything is left.
 */

export type JsonValue = string | number | boolean | JsonObject | JsonValue[];
export type JsonObject = Record<string, unknown>;

function isEmpty(v: unknown): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === "string") return v.trim() === "";
  if (typeof v === "number") return Number.isNaN(v);
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "object") return Object.keys(v as object).length === 0;
  return false;
}

/** The value with every empty part removed, or undefined when nothing is left. */
export function clean<T>(value: T): T | undefined {
  if (Array.isArray(value)) {
    const items = value.map((v) => clean(v)).filter((v) => !isEmpty(v));
    return (items.length ? items : undefined) as T | undefined;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const c = clean(v);
      if (!isEmpty(c)) out[k] = c;
    }
    return (Object.keys(out).length ? out : undefined) as T | undefined;
  }
  return isEmpty(value) ? undefined : value;
}

/** Collapse whitespace; structured-data text is a single line of prose. */
export function oneLine(text: string | null | undefined): string | undefined {
  const t = text?.replace(/\s+/g, " ").trim();
  return t ? t : undefined;
}
