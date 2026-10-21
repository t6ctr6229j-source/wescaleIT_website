#!/bin/sh
# Build a standalone Cloudflare Pages preview, never touching the United Domains webspace.
set -eu
cd "$(dirname "$0")/.."
python3 scripts/build_release.py --production
rm -rf cf-dist
mkdir -p cf-dist
cp -R dist/wescaleit/. cf-dist/
rm -f cf-dist/.htaccess
cat > cf-dist/_headers <<'EOF'
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Strict-Transport-Security: max-age=31536000
  Content-Security-Policy: base-uri 'self'; object-src 'none'; frame-ancestors 'self'; upgrade-insecure-requests

# Staging search exclusion; not applied to later custom production hostname.
https://wescaleit-website.pages.dev/*
  X-Robots-Tag: noindex, nofollow

https://:version.wescaleit-website.pages.dev/*
  X-Robots-Tag: noindex, nofollow
EOF
test -s cf-dist/index.html
test -s cf-dist/images/kununu-top-company-2027-aligned.svg
test -s cf-dist/_headers
test ! -e cf-dist/.htaccess
echo 'Prepared Cloudflare Pages preview (cf-dist).'
