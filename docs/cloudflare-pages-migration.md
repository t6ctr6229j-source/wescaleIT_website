# Cloudflare Pages preview: wescaleIT
This branch prepares an independent Cloudflare Pages preview without changing live DNS or United Domains hosting.

- Pages project: `wescaleit-website`
- GitHub repository: `t6ctr6229j-source/wescaleIT_website`
- Git branch: `cloudflare/pages-preview-20261021`
- Build command: `sh scripts/build-cloudflare-pages.sh`
- Output: `cf-dist`
- The script generates the same validated production release as the existing United Domains deployment, but removes Apache-specific `.htaccess` and creates Cloudflare-native `_headers`.
- The staging Pages domains are explicitly nonindexable via host-scoped `X-Robots-Tag`. Do not index the preview.
- This build uses a **minimal** Content Security Policy. Narrowing script-src/connect-src requires separate testing of embedded Tally, analytics and Spline.
- Never move `wescaleit.com` nameservers until the full authoritative DNS zone has been independently compared, particularly Microsoft 365 MX, SPF, DKIM, DMARC, Autodiscover, SIP, vendor verification and Apple domain records. Imported web/service DNS entries are DNS-only for now.
- The existing SFTP deployment still automatically runs for pushes to `main`; do not merge the rollout until the origin host key is verified or United Domains deployment is disabled after cutover.
- The future domain cutover requires host-specific redirects and verification that no staging `noindex` header applies to public `wescaleit.com`.

Cloudflare Git connection smoke test: 2026-10-21. This commit should trigger the independent Pages preview deployment; it does not touch DNS or the current United Domains website.
