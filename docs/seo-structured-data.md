# Structured data (schema.org JSON-LD)

Pages emit one `<script type="application/ld+json">` holding a single `@graph`. Builders are pure functions in `src/lib/seo/jsonld/`; the `JsonLd` component is `src/components/seo/json-ld.tsx`. Absolute URLs come from `SITE_URL` (fallback `http://localhost:3000`) through `src/lib/seo/jsonld/url.ts`.

## What is emitted where

| Page | Types |
| --- | --- |
| `/` | Organization, WebSite |
| Every page that shows a breadcrumb (all inner pages) | BreadcrumbList (Home plus the visible trail) |
| `/solutions/[slug]` | Service |
| `/services/[slug]` | Service |
| `/projects/[slug]` | CreativeWork |
| `/news/[slug]` | NewsArticle (not while "held for publication") |
| `/events/[slug]` | Event |
| `/careers/open-positions/[slug]` | JobPosting (not once the confirmed deadline has passed) |
| `/blog` | BlogPosting per post |
| `/solutions`, `/projects`, `/clients` | ItemList |

The breadcrumb is emitted by the `Crumb` component from the same trail it displays, so the markup cannot claim a hierarchy the reader does not see.

## Rules

- Structured data must match what the page shows. Add a field to a builder only if the page shows the same fact.
- Published content only. Every document builder returns nothing unless `_status === "published"`, so an editor's draft preview emits nothing.
- A field the document lacks is omitted, never invented. `clean()` strips null, empty strings and empty arrays and objects.
- No prices, ratings, reviews or awards: the content has none.
- Dates are ISO 8601. Free-text dates ("Evergreen", "To confirm") are dropped.
- `<` is escaped as `<` in the script body.

## Validating

Once there is a public URL (or a deployed review URL reachable by Google):

1. Google Rich Results Test: https://search.google.com/test/rich-results (Event, JobPosting, breadcrumbs).
2. Schema Markup Validator: https://validator.schema.org (all types, including Organization and Service which have no Google rich result).

`SITE_URL` must be set to the real origin for the `@id` and `url` values to be correct.
