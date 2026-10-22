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

## DNS records verified against United Domains (2026-10-22)
- Source: user's one-page United Domains DNS overview showing "Alle Subdomains" for `wescaleit.com`. Verified all recorded values/hostnames/types/priorities against the pending Cloudflare zone, not only the total count.
- 23 / 23 records match (7 A, 2 AAAA, 4 MX, 3 CNAME, 5 TXT, 2 SRV). Imported scan missed `cb.wescaleit.com` A, `*.dev.wescaleit.com` A and three `gdc.wescaleit.com` MX records; these were added with original values and MX priorities. Removed `www.dev.wescaleit.com` explicit auto-import artifact, because the official `*.dev` wildcard supplies the identical address. Keep every Microsoft 365 DNS entry (root Exchange MX, SPF, DMARC, Autodiscover, Teams/Skype SRV/CNAME), vendor verifications and Apple TXT unchanged. No selector1/selector2 DKIM CNAMEs appear in the supplied export; validate actual Microsoft 365 DKIM state with tenant admin separately, without inventing records.
- Any imported web/other A, AAAA or CNAME records are **DNS-only**. All three Cloudflare zones are still pending and the registrar is still delegated to United Domains; this documentation does not authorize an immediate registrar change.
- Cloudflare has automatic TTL on previously scanned records versus United Domains's 600/3600 seconds. This changes caching interval, not destinations, record types, MX priorities or service functionality.
- Cloudflare DNSSEC remains disabled in this pending zone. Recheck DS at the parent registry immediately before making a nameserver change; the successful preview-branch preflight is not a permanent guarantee.
- Cutover sequence: check DNS immediately beforehand; owner changes nameservers only once approved; verify zone activation, first keep origin DNS-only; link Cloudflare Pages production domains and TLS, set and verify canonical redirects, preserve privacy and mail handling, verify production paths and analytics consent; retain United Domains webspace until acceptance.
