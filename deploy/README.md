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

> **WARNING — an empty users table is an open door.** On a database with no
> users, *anyone* who visits `/admin` can click **Create first user** and is made
> an **administrator** (no invitation, no secret). So right after the first
> deploy, Edge's real administrator creates their own account at `/admin` —
> they choose their own password. That account is never created by a script,
> and its password is never written into a file, an environment variable, a
> chat or this repository. And **never delete the last admin**: deleting it
> reopens the door (`tools/editorial-live-setup.mjs` refuses to).

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

## Phase 7: the editorial workflow

Edge's own staff edit the site in `/admin`. There are three roles: `admin`,
`editor` and `hr`. The list lives in one place, `src/access/roles.ts`; the Users
role field, the access rules, the matrix and its test all read it.

**Who can do what.**

- **Editors** can create, edit, save drafts of and publish every content item
  (solutions, services, projects, clients, partners and their categories,
  events, jobs, E-Academy tracks, news, insights and their topics, downloads),
  and can edit the Company, Careers and Page copy sections. They can upload and
  manage media. They can read the form submissions and the uploaded CVs, and see
  the list of users, and they can change their own name, email and password.
- **Editors cannot** edit Contact details or Site settings, create, change or
  delete form definitions, create or delete users, change another person's
  account, change their own role, change or delete form submissions and CVs, or
  **delete any content**. An editor takes something down with Unpublish.
- **Admins** can do all of that, and are the only ones who delete content,
  create users and edit Contact details, Site settings and the forms.
- **HR** works on careers and people records only, and sees only those
  sections in the admin sidebar: open positions (Jobs) and E-Academy tracks
  (create, edit, save drafts, publish; deleting is an admin action), the
  Careers section, the uploaded CVs (read only) and the **careers form
  submissions** (E-Academy enquiries, job and internship applications; read
  only: the other forms' submissions, such as Contact, Subscribe and event
  registrations, are not visible to HR). HR cannot see or change solutions,
  services, projects, clients, partners, news, insights, events, downloads,
  media, the Company, Page copy, Contact details or Site settings sections,
  form definitions, or other people's accounts, and sees no unpublished draft
  of that content. HR can change their own name, email and password, but not
  their own role. HR cannot use Preview (it opens drafts of any page).
- **Visitors** read published content only. A draft is never served to them.

**Adding the HR role to an existing database.** The `role` column of Users is a
Postgres enum, so the new value `hr` needs one migration (enum
`enum_users_role` gains `'hr'`). Payload's schema push is interactive, so create
and run it on the server (`payload migrate:create`, then `payload migrate`),
not from a laptop. Nothing else in the schema changes. To give someone the role,
an admin opens Users, creates the person and picks **HR**; the role field's help
text lists what each role can do.

The same table is code: `src/access/matrix.ts`, checked against the real
configuration by `src/access/matrix.test.ts`, which fails when a collection or
global is added without a row.

**Checking the HR role on the live server.** `tools/check-hr-live.mjs` creates
one throwaway `hr` user over the REST API (random password, kept in memory,
never printed), logs in as it, and checks that HR can read applications, jobs,
E-Academy tracks and only the careers submissions, but gets 403 or nothing for
solutions (drafts included), media, forms, other users, and every global except
Careers; that it cannot change its own role or open Preview; and then deletes
the user. It needs an admin account in the environment:

    ADMIN_EMAIL=... ADMIN_PASSWORD=... BASE_URL=https://168.119.61.125 \
      NODE_TLS_REJECT_UNAUTHORIZED=0 node --import tsx tools/check-hr-live.mjs

**Editor walkthrough** (no technical knowledge needed).

1. Sign in at `/admin` and open the item under its section (for example
   Resources, then News and announcements).
2. Edit it. The admin saves your work as a draft every second or so ("autosave").
   The live page does **not** change while you do this.
3. Click **Preview**. The real page opens with your unsaved-for-the-public
   changes in it, and a small bar at the bottom left says "Preview — unpublished
   changes are shown". Close the bar's **Exit preview** link when you are done.
4. Happy with it? Click **Publish**. The live page changes within a few seconds,
   with no developer involved.
5. To take something down, use **Unpublish** (it becomes a draft again). Deleting
   content is an admin action; ask an administrator.

**The first admin.** On a new database, visit `/admin`: it offers **Create first
user**. The first user is always made an admin, whatever role the form shows
(`firstUserIsAdmin` in `src/collections/Users.ts`), so the site always has
someone who can manage users. Everyone created after that gets the role an admin
chooses, `editor` by default.

> **WARNING.** Because the first user is *always* an admin, whoever reaches an
> empty `/admin` first owns the site. Edge's real administrator must create
> their account at `/admin` **immediately after the first deploy**, choosing
> their own password — never a script, never a password written down anywhere.
> Never delete the last admin. Only admins can unlock an account locked by too
> many failed logins (`unlock` is admin-only).

**How preview works.** `/preview?path=/news/<slug>` checks the staff session,
accepts only a page this site serves (nothing under `/api`, `/admin`, or off-site),
sets Next's `__prerender_bypass` draft cookie and redirects to that page. Without
a session it answers 401 and sets nothing. The preview cookie alone shows
nothing: every draft page also checks for a live staff session (`isDraft()` in
`src/lib/draft.ts`), so the cookie only works together with a signed-in admin or
editor. Logging out ends preview even if the browser keeps the cookie, and a
copied or forged cookie gets the published page.
The cookie is `SameSite=None; Secure`, so **preview needs HTTPS in production**
(over plain http the browser will not keep it). The banner only exists in draft
mode.

**Frame protection.** A `SameSite=None` draft cookie is sent when another site
frames this one, so a page elsewhere could embed the site as a signed-in staff
member. nginx therefore sends, from the 443 server block in
`deploy/nginx-edge-comm-tech.conf`, `X-Frame-Options: SAMEORIGIN` and
`Content-Security-Policy: frame-ancestors 'self'` on every response (`always`,
so error pages too). Payload's admin only frames its own origin (live preview,
document drawers), so it keeps working. No `location` in that block has an
`add_header` of its own; one that ever does must repeat both lines, because nginx
then drops the inherited ones (`src/lib/deploy-files.test.ts` fails if a location
gains one). The conf is installed by hand (copy it to `/etc/nginx/sites-available/edge-comm-tech`,
`nginx -t`, `systemctl reload nginx`). Verify:

```bash
curl -skI https://168.119.61.125/ | grep -iE 'x-frame-options|content-security-policy'
curl -skI https://168.119.61.125/no-such-page | grep -iE 'x-frame-options|content-security-policy'
# both print: x-frame-options: SAMEORIGIN / content-security-policy: frame-ancestors 'self'
```

The probe prints both headers of the home page and a WARN when neither is set.

**Probe the workflow on the server.** `tools/check-editorial-live.mjs` signs in as
a throwaway editor and a throwaway admin, takes a disposable News item through
draft, publish, autosave, preview, republish and unpublish, tries everything an
editor must not do, and deletes what it made. Operator steps:

```bash
# 0. FIRST: Edge's real administrator has created their own account at /admin
#    (their own password). The probe users are created next to it, and step 3
#    refuses to run if the probe admin would be the last admin.

# 1. On the server, from the app directory with the environment loaded:
EDITORIAL_SETUP_MODE=create NODE_ENV=production npx payload run tools/editorial-live-setup.mjs
#    creates admin-probe@ and editor-probe@example.invalid with random passwords,
#    written to /root/editorial-probe.env (mode 0600) and never printed.
#    (dry-run is the default mode; it refuses if the users already exist.)

# 2. Copy the file's contents into your developer shell WITHOUT echoing them
#    (for example: scp it, then `set -a; . ./editorial-probe.env; set +a`, and delete the copy).
#    Then:
BASE_URL=https://168.119.61.125 NODE_TLS_REJECT_UNAUTHORIZED=0 \
  node --import tsx tools/check-editorial-live.mjs

# 3. Back on the server, remove the throwaway users and the file:
EDITORIAL_SETUP_MODE=delete NODE_ENV=production npx payload run tools/editorial-live-setup.mjs
#    refuses (exit 1, nothing deleted) when no other admin exists; afterwards it
#    prints "remaining users: N (A admin, E editor)" and exits 1 if A is 0.
```

The preview checks prove the fix for a stale cookie: the bypass cookie alone
shows the published page; with the editor's session it shows the draft and the
banner; after `POST /api/users/logout` the same old cookie shows the published
page again. While a draft is pending the probe also checks the anonymous API:
`/api/news/<id>?draft=true` returns the published title, a `?draft=true` listing
of drafts is empty, the News and Contact details versions endpoints answer
401/403, and GraphQL `versionsNews` answers with errors and no data.

The global checks use `POST /api/globals/<slug>` with an empty body, which is how
Payload updates a global (`PATCH` on a global answers 404): the editor must get
403 for Contact details and Site settings. The admin's side is never tested by
writing a live global; the probe reads `GET /api/access` for both sessions and
requires `globals['contact-details'].update`, `collections.users.create` and
`collections.news.delete` to be allowed for the admin and refused for the editor
(the response gives either a bare boolean or `{ permission }`; both are read).

The probe prints `ok` or `FAIL name: reason` per check and exits non-zero on any
FAIL. Its destructive role checks on form submissions and CVs use an id no row has
(a 403 proves denial; a 404 would mean access is open), so a misconfiguration can
never delete a real record. Two things it reports without failing: the frame
headers above, and a "related draft" finding: whether a published page prints the
title of a related item that is only a draft (a published insight whose topic is a
draft). It is reported as LEAK or NO LEAK (a finding, not a gate), and the probe
deletes both test items either way. The first live run reported LEAK; the read
layer (`dropUnpublishedRelations()` in `src/lib/content.ts`) now strips every
populated related document that is not published outside draft mode, so after
that fix is deployed the finding must read NO LEAK. The first-user rule is
exercised by its unit test, not by the probe: by the time the probe runs, the real
admin (step 0) already exists.

## SEO

Two environment variables control how the site presents itself to search
engines. Both go in `/etc/edge-comm-tech.env`, and **both are read when the app
is built** (page metadata, the `X-Robots-Tag` header), so a change needs a
redeploy, not just a restart. `deploy/redeploy.sh` passes them to the build.

| Variable | Meaning |
|---|---|
| `SITE_URL` | The public origin, no trailing slash and no path: `https://www.example.com`. Builds every canonical link, share URL and sitemap entry. Unset, it falls back to `http://localhost:3000`, which is wrong for production. |
| `SITE_INDEXABLE` | Only the exact string `true` lets search engines in. Unset, empty, `TRUE`, `1`, `yes`: all mean *keep out*. |

**Production must set both.** Leave `SITE_INDEXABLE` unset on the review server
and until go-live. Set `SITE_INDEXABLE=true` (and the real `SITE_URL`) at go-live
only, then redeploy.

| | `SITE_INDEXABLE` not `true` (default) | `SITE_INDEXABLE=true` |
|---|---|---|
| `<meta name="robots">` | `noindex, nofollow` on every page | none (default `index, follow`) |
| `X-Robots-Tag` header | `noindex, nofollow` on every response | only on `/admin`, `/api` (not `/api/media/file/`), `/preview`, `/forms` |
| `/robots.txt` | `Disallow: /`, no sitemap line | allows the site; disallows `/admin`, `/api/`, `/preview`, `/forms`; names the sitemap |
| `/sitemap.xml` | empty | every static page plus every published solution, service, project, news item, event and open vacancy |

Verify after a deploy (replace the host):

```bash
curl -s https://HOST/robots.txt
curl -s https://HOST/sitemap.xml | head -20
curl -s https://HOST/ | grep -o '<meta name="robots"[^>]*>'
curl -sI https://HOST/ | grep -i x-robots-tag
curl -s https://HOST/solutions/cybersecurity | grep -oE '<title>[^<]*</title>|<link rel="canonical"[^>]*>|<meta property="og:[a-z:]*" content="[^"]*"'
```

While not indexable you should see `Disallow: /`, an empty sitemap, the
`noindex, nofollow` meta tag and the header. Once indexable: no `robots` meta, the
canonical link on `SITE_URL`, a sitemap with URLs on `SITE_URL`, and a header only
on the private paths.

Editors control each page's search appearance (title, description, share
picture) under **Meta** on solutions, services, projects, news, events and jobs;
left empty, the page's own title and summary are used, and
`public/og-default.png` is the share picture. `tools/make-og-default.mjs`
regenerates that picture.

Submitting the site to Google Search Console and Bing Webmaster Tools, and the
rest of the plan, are in `docs/seo-plan.md`.
