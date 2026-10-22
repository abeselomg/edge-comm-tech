#!/usr/bin/env bash
# Deploy the branch from a bundle already placed at /tmp/edge.bundle.
#
# Stops at the first failure rather than restarting a broken build over a
# working one: the running service keeps serving until the new build exists.
set -euo pipefail

APP=/srv/edge-comm-tech/app
BUNDLE=/tmp/edge.bundle
BRANCH=payload-cms-integration

[ -f "$BUNDLE" ] || { echo "No bundle at $BUNDLE. Create and scp one first."; exit 1; }

cd "$APP"
set -a; . /etc/edge-comm-tech.env; set +a
run() { sudo -u edge env \
  DATABASE_URI="$DATABASE_URI" PAYLOAD_SECRET="$PAYLOAD_SECRET" \
  NODE_ENV=production NODE_OPTIONS=--no-deprecation "$@"; }

echo "==> fetching the bundle"
sudo -u edge git fetch "$BUNDLE" "$BRANCH:refs/remotes/bundle/$BRANCH" --force
sudo -u edge git reset --hard "refs/remotes/bundle/$BRANCH"
sudo -u edge git log --oneline -1 | sed 's/^/    now at /'

echo "==> dependencies"
sudo -u edge npm ci --no-audit --no-fund 2>&1 | tail -3

echo "==> migrations"
run npx payload migrate < /dev/null 2>&1 | grep -viE "^\[2K" | tail -4

echo "==> build"
run npx next build < /dev/null 2>&1 | tail -6
[ -f .next/BUILD_ID ] || { echo "    build produced no BUILD_ID; not restarting"; exit 1; }

echo "==> restart"
systemctl restart edge-comm-tech
sleep 7
systemctl is-active --quiet edge-comm-tech || { journalctl -u edge-comm-tech -n 20 --no-pager; exit 1; }
code=$(curl -sk -o /dev/null -w '%{http_code}' --max-time 60 https://localhost/)
echo "    service active, https://localhost/ -> HTTP $code"
[ "$code" = "200" ] || exit 1
