# Deploying this CMS

Written for: whoever has to touch the server next, including a future me.

The staging box is a Hetzner VPS, Ubuntu 22.04, `168.119.61.125`, hostname
`edgecomm-tech`. It runs the admin and the one public page that exists. The
51 public pages are Phases 4–5 and are not built yet.

**This is not `edgecomm-tech.com`.** That domain resolves to `91.204.209.17`,
a different host, and nothing here touches it.

## What is where

| Thing | Path on the server |
|---|---|
| Application | `/srv/edge-comm-tech/app` |
| Secrets | `/etc/edge-comm-tech.env` (`640 root:edge`) |
| Service | `/etc/systemd/system/edge-comm-tech.service` |
| nginx site | `/etc/nginx/sites-available/edge-comm-tech` |
| Interim TLS | `/etc/ssl/edge-comm-tech/selfsigned.{crt,key}` |
| Uploads | `/srv/edge-comm-tech/app/media` |
| TLS enabler | `/usr/local/sbin/edge-enable-tls` |

The three config files here are copies of what is live. Change them here,
copy them up, reload — not the other way round, or the next person reads a
lie.

## Shape of it

nginx terminates TLS on 443 and proxies to the app on `127.0.0.1:3000`. Port
80 redirects to 443, except `/.well-known/acme-challenge/`, which stays open
so certbot can validate later. The app binds to loopback only, so nginx is
the sole way in; `ufw` allows 22, 80 and 443 and nothing else.

PostgreSQL 16 listens on localhost only. The schema is built by **migration**,
never by Payload's dev push: `push` is off when `NODE_ENV=production`, which
means production cannot create its own schema and `npm run migrate` has to run
before the app starts. That is deliberate — a production boot must not alter
the schema on its own.

The app runs as the `edge` system account with no login shell, under systemd
hardening: the filesystem is read-only to it apart from `.next` (Next's
runtime cache) and `media` (uploads, while no S3 bucket is configured).

## TLS, and the one thing still outstanding

The certificate is **self-signed**, so browsers warn. No DNS record points at
this host, so Let's Encrypt cannot validate it. Serving a login form over
plain HTTP would put staff passwords on the wire in cleartext, so a warning
is the lesser problem.

To finish it: point `cms.edgecomm-tech.com` at `168.119.61.125` with an A
record, then run

```bash
/usr/local/sbin/edge-enable-tls
```

It checks DNS first and refuses to run early, because a premature certbot
burns a rate-limited failed validation and leaves the nginx config half
edited. On success it installs a real certificate and a renewal timer, and
nothing else needs changing.

## Deploying a change

The server has no git remote configured; code arrives as a bundle, so
nothing has to be pushed to GitHub to deploy.

From a machine with the repo:

```bash
git bundle create /tmp/edge.bundle payload-cms-integration
scp /tmp/edge.bundle root@168.119.61.125:/tmp/edge.bundle
ssh root@168.119.61.125 /usr/local/sbin/edge-redeploy
```

`edge-redeploy` fetches the bundle into the checkout, installs dependencies,
runs migrations, rebuilds and restarts. It stops at the first failure rather
than restarting a broken build over a working one.

## Things that will bite

**`next build` depends on Google Fonts at build time.** `next/font/google`
downloads the font files during the build and self-hosts them afterwards, so
there is no runtime dependency — but a build will fail if Google is slow or
unreachable, and it fails with `TypeError: Cannot read properties of null` out
of `loader.js`, which names neither fonts nor the network. This has already
happened once on this server and the retry succeeded with no other change.
If it recurs, retry first; the durable fix is vendoring the three families
and switching to `next/font/local`.

**`npm ci` is stricter on some npm versions than others.** The lockfile was
subtly wrong for a while and only this server's npm refused it. If `npm ci`
complains that the lock is out of sync, regenerate it with the npm that is
refusing it and diff before committing — `npm install` would also bump the
fifteen direct dependencies declared with a caret.

**The seed does not create users.** The first visit to `/admin` offers
"Create first user". Until someone does that, there is no way in.

**Seed modes are environment variables, not flags.** `payload run` strips the
script's arguments, so `--fresh` silently does nothing. Use
`npm run seed:force` or `npm run seed:fresh`.

## Phase 4: the static pages

Fourteen pages now render from the CMS: home, about, executive management,
clients, partners, resources, downloads, blog, the four careers pages, contact
and subscribe. The solution, service, project, news, event and job pages are
Phase 5 and are linked but not yet served.

**Pages are prerendered at build time, so a reseed needs a redeploy.** Changing
data with `seed:force` (or in the admin, before the revalidate hooks reach that
path) does not change what a prerendered page serves until the next build. After
a reseed run `edge-redeploy` again, or the site keeps showing the old copy. This
is how a wrong partner-ring label survived a correct reseed for one check.

**Checking a deploy against Highland.** `npm run check:parity` compares the
fourteen pages with the Highland originals on visible sentences, h1–h3 order and
link targets, and fails any link that is a `.html` filename or a path `routeFor`
does not know. Against this server, whose certificate is self-signed:

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 BASE_URL=https://168.119.61.125 npm run check:parity
```

`npm run check:parity -- --self` compares each Highland page with itself and
must report nothing; run it after editing the checker.

**What the checker deliberately waives**, each listed in `tools/check-parity.mjs`
with its reason: the skip link, the review build's footer note, the form-note
wording on the five disabled forms, the count of logos still awaiting artwork,
the compact nav's "Contact", and the one link `/about` adds to executive
management. A new waiver belongs in that file with a comment, not in a flag.

**Forms are inert until Phase 6.** Contact, subscribe, the internship
application and the E-Academy enquiry render every control disabled with a note
giving a mailbox to use meanwhile. Nothing submits.

**Downloads are listed whether or not they are approved.** The approval gate is
on the file link, not the listing: an unapproved document shows "Approval
pending" and a request route, and only a document that is approved *and* has an
approved file offers Download. See `downloadLink` in
`src/app/(frontend)/downloads/download-parts.tsx`.

## Phase 5: the dynamic routes

All 51 Highland pages are served: the 14 static pages plus five family indexes
and 32 detail pages (7 solutions, 6 services, 8 projects, 3 news, 3 events,
2 jobs, 3 media sections). Detail pages live at `/<family>/<slug>`; jobs sit under
`/careers/open-positions/<slug>` and media under `/resources/media/<slug>`.

**Checking a deploy.** Three commands, all against the self-signed server:

```bash
export NODE_TLS_REJECT_UNAUTHORIZED=0 BASE_URL=https://168.119.61.125
npx tsx tools/check-parity.mjs --all     # 51 pages vs Highland, plus the content rules
npx tsx tools/check-links-live.mjs       # every internal link answers 200
npx tsx tools/audit-dynamic-content.mjs  # every Highland property has a CMS field
```

`check-parity --all` also scans every rendered page for the project-wide rules
(`tools/content-scan.mjs`): no partnership tier, authorization level, salary or
benefit; "Tier III-aligned", never "-certified"; the 100% figure with its scope;
"security control room", never "SOC"; four organisations nowhere; no leaked
`undefined`/`null`.

**Events move with the clock.** Highland is static; the CMS derives an event's
status from its dates. After an event has run, its page, the events index and the
resource centre's "Coming up" band legitimately differ from Highland. The checker
recognises that (`tools/parity-clock.mjs`), skips the sentence comparison for just
those pieces, and instead asserts the event says it has run, has no form and offers
a subscribe link. It prints a `NOTE` line for each. The event routes revalidate
hourly (`revalidate = 3600`) so a page prerendered while an event was upcoming does
not keep inviting registration after it ends.

**Editing a solution refreshes the whole site.** The footer lists every published
solution on every page, so the Solutions collection revalidates the root layout, not
only the pages that mention it. Without that, unpublishing a solution 404'd its own
page and left a link to it in the footer of every other page.

**Never set `dynamicParams = false` on a route that revalidation can touch.**
Once its cache entry is purged Next cannot regenerate the page (`NoFallbackError` in
the service log) and every prerendered slug answers 404 until the next deploy. The
media route 404s unknown keys itself instead.

**Check the repository ignores nothing it should ship.** `.gitignore` once carried a
bare `media` meant for the uploads folder; it also swallowed
`src/app/(frontend)/resources/media/`, and the pages were missing from the first
bundle while every local test passed. `src/lib/repo-hygiene.test.ts` now fails if git
ignores anything under `src`, `tools`, `deploy` or `docs`.

**Migrations.** `20261024_085850_news_holding_state` adds the news item's
held-for-publication flag, outstanding-details list, titled sections and closing
block. It is additive; `edge-redeploy` applies it.
