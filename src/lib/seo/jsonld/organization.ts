import type { Company, ContactDetail, SiteSetting } from "@/payload-types";
import { clean, oneLine, type JsonObject } from "./clean";
import { absoluteUrl, orgId, siteOrigin, websiteId } from "./url";

/*
 * The Organization and WebSite nodes. Emitted on the home page only; every
 * other page's nodes point at the organisation by @id.
 *
 * Everything comes from the CMS globals. There is no LocalBusiness or
 * ProfessionalService subtype: the content has no opening-hours claim the
 * page makes of the company as a "place customers visit", and an Organization
 * with a postal address says what the data supports.
 */

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

/** "March 2018" -> "2018-03"; "2018" -> "2018"; anything else -> undefined. */
export function foundingDate(established: string | null | undefined): string | undefined {
  const text = established?.toLowerCase() ?? "";
  const year = /\b(1[89]\d\d|20\d\d)\b/.exec(text)?.[1];
  if (!year) return undefined;
  const month = MONTHS.findIndex((m) => text.includes(m));
  return month === -1 ? year : `${year}-${String(month + 1).padStart(2, "0")}`;
}

const COUNTRY_CODES: Record<string, string> = { ethiopia: "ET" };

/**
 * A postal address from the office lines.
 *
 * The first line is the legal entity name (the field's own help says so) and
 * is skipped. The last line is "<city>, <country>"; the lines between are the
 * street address. A last line that does not split that way yields no locality
 * rather than a guessed one.
 */
export function postalAddress(office: ContactDetail["office"]): JsonObject | undefined {
  const lines = (office ?? []).map((o) => oneLine(o.line)).filter((l): l is string => !!l);
  if (lines.length < 2) return undefined;
  const rest = lines.slice(1);
  const last = rest[rest.length - 1];
  const parts = last.split(",").map((p) => p.trim()).filter(Boolean);
  const country = parts.length > 1 ? parts[parts.length - 1] : undefined;
  const locality = parts.length > 1 ? parts.slice(0, -1).join(", ") : undefined;
  const street = (locality ? rest.slice(0, -1) : rest).join(", ");
  return (
    clean({
      "@type": "PostalAddress",
      streetAddress: street,
      addressLocality: locality,
      addressCountry: country ? (COUNTRY_CODES[country.toLowerCase()] ?? country) : undefined,
    }) ?? undefined
  );
}

export function organization(input: {
  company: Pick<Company, "legalName" | "shortName" | "established" | "positioning">;
  contact?: Pick<ContactDetail, "office" | "phones" | "emails"> | null;
  social?: SiteSetting["social"];
}): JsonObject {
  const { company, contact } = input;
  const phone = contact?.phones?.[0];
  const contactPoint = [
    ...(contact?.emails ?? []).map((e) => ({
      "@type": "ContactPoint",
      contactType: oneLine(e.label),
      email: oneLine(e.value),
    })),
    phone
      ? {
          "@type": "ContactPoint",
          contactType: oneLine(phone.label),
          telephone: oneLine(phone.tel),
        }
      : undefined,
  ];
  const sameAs = (input.social ?? []).map((s) => oneLine(s.url)).filter((u) => !!u && /^https?:\/\//i.test(u!));

  return (
    clean({
      "@type": "Organization",
      "@id": orgId(),
      name: oneLine(company.shortName),
      legalName: oneLine(company.legalName),
      url: absoluteUrl("/"),
      logo: { "@type": "ImageObject", url: absoluteUrl("/edge-logo.png") },
      description: oneLine(company.positioning),
      foundingDate: foundingDate(company.established),
      address: postalAddress(contact?.office),
      telephone: oneLine(phone?.tel),
      contactPoint,
      sameAs,
    }) ?? {}
  );
}

/** No SearchAction: the site has no site search. */
export function website(company: Pick<Company, "shortName">): JsonObject {
  return (
    clean({
      "@type": "WebSite",
      "@id": websiteId(),
      name: oneLine(company.shortName),
      url: `${siteOrigin()}/`,
      publisher: { "@id": orgId() },
    }) ?? {}
  );
}
