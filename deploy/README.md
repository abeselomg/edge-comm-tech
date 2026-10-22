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
