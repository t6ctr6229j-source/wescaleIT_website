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
cat > cf-dist/_redirects <<'EOF'
# Preserve previously published Apache legacy routes on Cloudflare Pages.
# Do not manually rewrite .html -> extensionless; Pages handles that natively.
/infosec https://www.ciso2hero.com/beratung 301
/infosec/ https://www.ciso2hero.com/beratung 301
/isms https://www.ciso2hero.com/beratung 301
/isms/ https://www.ciso2hero.com/beratung 301
/itxm https://www.silverback-network.com/ 301
/itxm/ https://www.silverback-network.com/ 301
/bedarf-ergruenden-itxm https://www.silverback-network.com/ 301
/bedarf-ergruenden-itxm/ https://www.silverback-network.com/ 301
/bedarf-ergruenden-karriere /karriere 301
/bedarf-ergruenden-karriere/ /karriere 301
/bedarf-ergruenden-addons /kontakt#kontaktformular 301
/bedarf-ergruenden-addons/ /kontakt#kontaktformular 301
EOF
test -s cf-dist/index.html
test -s cf-dist/images/kununu-top-company-2027-aligned.svg
test -s cf-dist/_headers
test ! -e cf-dist/.htaccess
test -s cf-dist/_redirects
echo 'Prepared Cloudflare Pages preview (cf-dist).'
