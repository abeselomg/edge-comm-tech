import { clean, oneLine, type JsonObject } from "./clean";
import { absoluteUrl } from "./url";

/*
 * Page-level structure: the @graph wrapper, breadcrumbs and index lists.
 */

/** One @graph for a page. Returns undefined when no node survives cleaning. */
export function graph(...nodes: (JsonObject | null | undefined)[]): JsonObject | undefined {
  const kept = nodes.map((n) => clean(n ?? undefined)).filter((n): n is JsonObject => !!n);
  if (kept.length === 0) return undefined;
  return { "@context": "https://schema.org", "@graph": kept };
}

/**
 * Home > ...trail. Takes the same trail the page's visible breadcrumb shows,
 * so the markup cannot claim a hierarchy the reader does not see. The last
 * entry is the current page and carries no URL (Google allows that).
 */
export function breadcrumbs(trail: { label: string; href?: string }[]): JsonObject | undefined {
  const items = trail.filter((t) => oneLine(t.label));
  if (items.length === 0) return undefined;
  const all = [{ label: "Home", href: "/" }, ...items];
  return clean({
    "@type": "BreadcrumbList",
    itemListElement: all.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: oneLine(t.label),
      item: t.href && i < all.length - 1 ? absoluteUrl(t.href) : undefined,
    })),
  });
}

/** An index page's list. Items without a page of their own are listed by name. */
export function itemList(
  name: string,
  items: { name: string; href?: string | null }[],
): JsonObject | undefined {
  return clean({
    "@type": "ItemList",
    name: oneLine(name),
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: oneLine(it.name),
      url: it.href ? absoluteUrl(it.href) : undefined,
    })),
  });
}
