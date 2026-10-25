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
| CVs (private, outside `public/`) | `/srv/edge-comm-tech/app/applications` (`750 edge:edge`) |
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
runtime cache), `media` (uploads, while no S3 bucket is configured) and
`applications` (CVs from the two application forms; private, outside `public/`,
served only through Payload's access control). `applications` is created once by
hand, see "One-time setup for CV uploads" under Phase 6.

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
git clone -q --no-hardlinks -b <your-branch> . /tmp/edge-src
git -C /tmp/edge-src branch -m payload-cms-integration
git -C /tmp/edge-src bundle create /tmp/edge.bundle payload-cms-integration
scp /tmp/edge.bundle root@168.119.61.125:/tmp/edge.bundle
ssh root@168.119.61.125 /usr/local/sbin/edge-redeploy
```

`edge-redeploy` hard-codes the ref `payload-cms-integration`, so the bundle must
carry your current branch under that name; a bundle of any other ref fails the
fetch. `git bundle` cannot rename a ref (`<branch>:refs/heads/...` is rejected),
hence the throwaway clone, which is renamed and bundled instead. Strip carriage
returns from any script or unit file copied from a Windows checkout before
installing it on the server (`sed -i 's/\r$//' <file>`); a CRLF shell script does not run.

`edge-redeploy` fetches the bundle into the checkout, installs dependencies,
runs migrations, seeds any missing documents (fill mode, never overwriting),
rebuilds and restarts. It stops at the first failure rather
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
`NODE_ENV=production npm run seed:force` or `NODE_ENV=production npm run seed:fresh`.

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
with its reason: the skip link, the review build's footer note, the count of logos still awaiting artwork,
the compact nav's "Contact", and the one link `/about` adds to executive
management. A new waiver belongs in that file with a comment, not in a flag.

**Forms are live from Phase 6** (see the Phase 6 section at the end). They were
inert in Phase 4, and the form-note waiver listed above went with that.

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

## Phase 6: the forms

Six forms submit: contact, subscribe, event registration, E-Academy enquiry, job
application and internship application.

**The endpoint.** `POST /forms/<slug>` is the only public way in, with slug one of
`contact`, `subscribe`, `event-registration`, `academy-enquiry`,
`job-application`, `internship-application`. It takes `multipart/form-data` (JSON
for the forms without an upload). Answers: 200 `{ok:true,message}`, 404 unknown
form, 413 too large, 415 wrong content type, 422 `{errors:{field:message}}`,
429 with `Retry-After`, 500 generic. Anonymous `GET`/`POST` on
`/api/form-submissions` and `/api/applications` is refused; a CV is stored in the
`applications` collection and has no public URL.

**Environment** (`/etc/edge-comm-tech.env`; names and meaning are in `.env.example`):

| Key | Meaning |
|---|---|
| `SMTP_HOST` | Unset: notification is skipped and recorded `skipped`; the submission is still stored. |
| `SMTP_PORT` | Default 587. 465 uses TLS; others use STARTTLS if offered. |
| `SMTP_USER`, `SMTP_PASS` | Set together or not at all. |
| `SMTP_FROM` | Required once `SMTP_HOST` is set. |
| `FORM_NOTIFY_FALLBACK` | Recipient used only when a form has none of its own. |
| `FORM_RATE_MAX` | Submissions per client per form per window (default 5). |
| `FORM_RATE_WINDOW_SEC` | The window (default 600). |
| `TRUSTED_PROXY_HOPS` | How many proxies append to `X-Forwarded-For` (default 1; nginx alone is 1, a CDN in front makes it 2). |

A failed or absent mail transport never loses or fails a submission: it is stored
first and the outcome is written to its `emailStatus` (`sent`, `failed`,
`skipped`). SMTP credentials from Edge are still outstanding; until then every
submission records `skipped`.

**The limiter is per process (Phase 8 follow-up).** The limiter and the
double-submit memory live in the Node process (`src/lib/forms/guard.ts`). With the
one systemd instance this server runs, that is correct. Run more than one
instance, or a host that starts several, and each holds its own buckets: the
effective limit multiplies by the instance count and a restart forgets them all.
Move that state to a shared store before scaling out.

**If nginx stops setting `X-Forwarded-For`, every visitor shares one bucket.** The
client key is the address the trusted proxy appended. When the header is missing,
has fewer entries than `TRUSTED_PROXY_HOPS`, or holds a non-IP, the key falls
back to a single `unknown` bucket per form. That fails strict, not open, but one
visitor's burst then blocks everyone's submissions on that form for the window.
The nginx site must keep `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for`.

**Submissions hold personal data, and they are kept indefinitely.** Names, emails,
phone numbers, application answers and CVs are kept in `form-submissions` and
`applications` until someone deletes them; the stored IP is only a keyed hash,
salted with the app secret. The browser's `User-Agent` (`meta.userAgent`, capped
at 300 characters) is stored alongside that hash, so a submission also records
which browser and device sent it. Edge has decided to retain submissions,
including uploaded CVs: there is no automatic deletion job, and an administrator
deletes records by hand. This stands until Edge sets a retention period, and it
should be revisited then, with the deletion built to match that period.

**Migration.** `20261024_154422_phase6_forms` is additive: it creates the
`applications` collection (CV files) and the upload-block tables for forms, and
adds the submission-upload, consent and delivery-status columns to
`form_submissions`. Nothing is dropped. `edge-redeploy` applies it.

**The forms are seeded by the redeploy.** The form pages call `getForm` while they
prerender, and it throws on a form that is not in the database. The seed code and
the migration arrive with the very redeploy that needs them, so nothing can be
seeded beforehand; instead `edge-redeploy` now runs the seed in fill mode between
migrations and the build, which adds the six forms if they are missing and
overwrites nothing. **Operator step:** `deploy/redeploy.sh` changed, so copy it to
the server as `/usr/local/sbin/edge-redeploy` (mode 755) before running the first
Phase 6 redeploy; the old copy has no seed step and its build would fail on the
missing forms after rewriting `.next`.

**One-time setup for CV uploads.** Payload stores CVs in `applications/` under the
app directory (the collection's `staticDir`). The service runs with
`ProtectSystem=strict`, so the unit allows writes to that path
(`ReadWritePaths=-/srv/edge-comm-tech/app/applications`) and the directory must
exist, owned by the service user (`edge`, from `User=` in the unit):

```bash
mkdir -p /srv/edge-comm-tech/app/applications
chown edge:edge /srv/edge-comm-tech/app/applications
chmod 750 /srv/edge-comm-tech/app/applications
cp deploy/edge-comm-tech.service /etc/systemd/system/edge-comm-tech.service
systemctl daemon-reload && systemctl restart edge-comm-tech
```

Without the unit change a CV upload fails with a read-only filesystem error and the
form answers 500. `applications/` is git-ignored and is not under `public/`, so no
CV has a public URL.

**Server-side Payload commands need `NODE_ENV=production`.** `/etc/edge-comm-tech.env`
is not known to set it (nothing in `deploy/` or `.env.example` does; only `redeploy.sh` sets it, per command), and
`payload.config.ts` turns the interactive dev schema push on whenever it is not
`production`, which would run against the live database and hang on a prompt. Prefix
every `payload`, `seed` and `migrate` command you run by hand, as below.

**Forms are looked up by title.** The route finds its form by the exact title
seeded from `src/lib/forms/definitions.ts` ("Contact", "Subscribe", "Event
registration", "E-Academy enquiry", "Job application", "Internship application").
Renaming a form in the admin makes `/forms/<slug>` answer 404 and the page fail to
build. Edit its fields, recipients and confirmation message freely; leave the
title alone.

**Checking the forms.** Run against the self-signed server, with an upcoming event
and an open job (the server refuses a registration or application for a closed
one):

```bash
export NODE_TLS_REJECT_UNAUTHORIZED=0 BASE_URL=https://168.119.61.125
npx tsx tools/check-forms-live.mjs --event-slug <upcoming-event> --job-slug <open-job>
```

For each form it posts a valid entry marked `[automated test – ignore]` (200), the
same entry minus one required field (422), the honeypot `website_url` filled (the
normal 200) and a burst past the limit (429 with `Retry-After`); the two
application forms also post a PDF and a DOCX-shaped zip as `cv`. It also checks
that anonymous requests to `/api/form-submissions` and `/api/applications` are
refused. It sends a distinct `X-Forwarded-For` per form, but behind nginx with
`TRUSTED_PROXY_HOPS=1` the key is this machine's real address, so a rerun inside
`FORM_RATE_WINDOW_SEC` finds the bucket full and says so.
**What HTTP alone cannot prove**, so the probe prints it as outstanding instead of
passing it: that the honeypot, 422 and 429 requests stored nothing; that each valid
post was stored once; the `emailStatus` of each; that a stored CV refuses an
anonymous read (the response exposes no file URL, so the probe only tries a guessed
name and reports a 404 as inconclusive); and removing the test entries. These need
the local API, so there is no public endpoint for them. On the server, from the
app directory with the environment loaded (`payload run` drops arguments, so the
mode is an environment variable):

```bash
NODE_ENV=production FORMS_CLEANUP_MODE=count FORMS_CLEANUP_OUT=/tmp/forms-before.json npx payload run tools/forms-live-cleanup.mjs
# ... run check-forms-live from anywhere ...
NODE_ENV=production FORMS_CLEANUP_MODE=count FORMS_CLEANUP_OUT=/tmp/forms-after.json  npx payload run tools/forms-live-cleanup.mjs
node --import tsx tools/check-forms-live.mjs --expect-count-file /tmp/forms-before.json --actual-count-file /tmp/forms-after.json
# expects exactly 8 new submissions (6 forms, plus a second CV type on 2)
NODE_ENV=production npx payload run tools/forms-live-cleanup.mjs      # dry run, the default: lists, deletes nothing
NODE_ENV=production FORMS_CLEANUP_MODE=delete npx payload run tools/forms-live-cleanup.mjs # removes marked submissions and their CVs
```

Read each probe submission's `emailStatus` and its CV's access in the admin or
through the local API before the delete.
