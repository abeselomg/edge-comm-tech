# Edge COMM-TECH

Corporate site for Edge Communication Technologies — one Next.js app serving the
public site and the Payload CMS admin, backed by Postgres.

## Running it

```bash
docker compose up -d     # Postgres on localhost:5434
npm install
npm run seed             # creates the schema and loads content
npm run dev
```

- Site: <http://localhost:3000>
- Admin: <http://localhost:3000/admin> — the first visit creates the admin user

`npm run seed` is a reset, not an append: it clears the seeded collections and
rewrites them. Run it again after changing anything under `src/seed/`.

## Layout

```
src/
  app/(frontend)/     public site — route groups do not affect URLs
  app/(payload)/      admin UI and REST/GraphQL API (generated; do not hand-edit)
  collections/        Solutions, Sectors, Projects, Partners, Courses, Jobs, News, Media, Users
  globals/            HomePage, CompanyPage, SiteSettings
  lib/content.ts      the only place pages read data from
  seed/               seed script and the content it loads
  payload.config.ts
```

`src/lib/content.ts` is the seam between the site and the CMS. Pages import
typed helpers (`getSolutions`, `getCourse`, `flattenLessons`) and never talk to
Payload directly.

## Editing content

Everything on the site is editable at `/admin`. Nothing is hardcoded in the
page components.

## Publishing rules

Content collections use Payload drafts. **Only published documents render on the
public site** — `src/lib/content.ts` filters every query on `_status`, because
the Local API bypasses access control by default.

Two things are deliberately held back until someone at Edge confirms them:

| What | Where | Renders when |
|---|---|---|
| Proof statistics (years, headcount, projects) | Site → Home page | each stat's **Verified** box is ticked |
| Phone, email, office address | Site → Site settings → Contact | the group's **Verified** box is ticked |
| Open roles | Careers | the job is published |

This is intentional. A placeholder phone number on a live site costs more trust
than no phone number at all.

## How edits reach the site

Front-end pages are statically generated. Payload `afterChange` / `afterDelete`
hooks (`src/hooks/revalidate.ts`) call `revalidatePath` for the routes a
document affects, so an edit in the admin is live on the next request without a
rebuild. Site settings revalidate the whole layout, because the header and
footer appear on every page.

The hooks no-op when Payload runs outside Next (the seed script), where there is
no page cache to expire.

## Version constraint

`@payloadcms/next@3.88.0` accepts Next `>=15.4.11 <15.5.0 || >=16.2.6 <17`.
`next` is pinned to an exact `15.4.11` for that reason — a caret range would
resolve past the ceiling and break the admin.

## Commands

| Command | Does |
|---|---|
| `npm run dev` | Site and admin on :3000 |
| `npm run seed` | Reset and reload seeded content |
| `npm run generate:types` | Regenerate `src/payload-types.ts` after a schema change |
| `npm run generate:importmap` | Regenerate the admin import map after adding custom components |
| `npm run build` | Production build |

> `dev` and `build` share `.next` and will corrupt each other's output in both
> directions. A dev server running during a build leaves the built site serving
> 404s for `/admin` and `/api/*`; starting dev on top of a production build
> leaves pages rendering unstyled, because the compiled CSS chunk 404s.
> Whenever you switch between the two, `rm -rf .next` first.
