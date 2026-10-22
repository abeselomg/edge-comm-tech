#!/usr/bin/env bash
# Swap the interim self-signed certificate for a real Let's Encrypt one.
#
# Run this AFTER cms.edgecomm-tech.com has an A record pointing at this host.
# It refuses to run before that, because certbot would burn a rate-limited
# failed validation and leave the nginx config half-edited.
set -euo pipefail

DOMAIN=cms.edgecomm-tech.com
EXPECTED_IP=168.119.61.125

echo "Checking DNS for $DOMAIN ..."
RESOLVED=$(getent hosts "$DOMAIN" | awk '{print $1}' | head -1 || true)
if [ -z "$RESOLVED" ]; then
  echo "  $DOMAIN does not resolve yet. Add the A record, wait for it to"
  echo "  propagate, then run this again."
  exit 1
fi
if [ "$RESOLVED" != "$EXPECTED_IP" ]; then
  echo "  $DOMAIN resolves to $RESOLVED, not $EXPECTED_IP."
  echo "  Certbot's HTTP-01 challenge would be answered by the wrong server."
  exit 1
fi
echo "  resolves to $RESOLVED, correct."

echo "Requesting the certificate ..."
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos \
  --email "$(whoami)@${DOMAIN#cms.}" --redirect

echo
echo "Done. Certbot rewrote the ssl_certificate paths in"
echo "/etc/nginx/sites-available/edge-comm-tech and installed a renewal timer:"
systemctl list-timers 'certbot*' --no-pager | head -3
echo
echo "The self-signed files are left in /etc/ssl/edge-comm-tech/ and are no"
echo "longer referenced. Delete them whenever you like."
