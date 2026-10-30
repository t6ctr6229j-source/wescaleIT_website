"""Verify actual public release, not just an HTTP 200 from the former Webflow site."""
from urllib.request import urlopen, build_opener, HTTPRedirectHandler
from urllib.error import HTTPError
from urllib.parse import urljoin
import os
import json
import time
from check_release_seo import audit


class InspectRedirect(HTTPRedirectHandler):
    """Do not follow off-site redirects when checking our own rewrite rules."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


redirect_opener = build_opener(InspectRedirect())


def first_redirect(path):
    """Verify the Apache Location header rather than fetching a destination site.

    Cloudflare on another brand may reject scripted requests (HTTP 403) even
    when the source wescaleIT redirect is completely correct.
    """
    url = origin + path + "?release_check=" + str(time.time_ns())
    try:
        with redirect_opener.open(url, timeout=25):
            raise ValueError(path + ": expected an HTTP 301 redirect")
    except HTTPError as response:
        if response.code != 301:
            raise ValueError(path + ": expected HTTP 301, got " + str(response.code)) from response
        location = response.headers.get('Location')
        if not location:
            raise ValueError(path + ": HTTP 301 has no Location header")
        absolute = urljoin(origin, location)
        return absolute.split('#', 1)[0].split('?', 1)[0]

def fresh(path):
    return urlopen(origin + path + "?release_check=" + str(time.time_ns()), timeout=25)

origin = 'https://wescaleit.com'
try:
    with fresh('/release.json') as r:
        live = json.load(r)
    if live['commit'] != os.environ['GITHUB_SHA']:
        raise ValueError('Public domain is not serving this release.')
    for path, marker in [('/', 'No bullshit!'), ('/impressum', 'HRB 755825'), ('/datenschutz', 'G-7QYEF752NM'), ('/robots.txt', 'Allow: /'), ('/sitemap.xml', 'https://wescaleit.com/karriere')]:
        with fresh(path) as r:
            assert marker in r.read().decode(), path
    for old_path, expected in [
        ('/infosec', 'https://www.ciso2hero.com/beratung'),
        ('/isms', 'https://www.ciso2hero.com/beratung'),
        ('/bedarf-ergruenden-itxm', 'https://www.silverback-network.com/'),
        ('/bedarf-ergruenden-karriere', origin + '/karriere'),
        ('/bedarf-ergruenden-addons', origin + '/kontakt'),
    ]:
        actual = first_redirect(old_path)
        assert actual == expected, (old_path, actual, expected)
    try:
        fresh('/__release-check__/missing-page')
    except HTTPError as e:
        assert e.code == 404
    else:
        raise ValueError('Missing page did not return HTTP 404.')
    audit(live=True)
except Exception as e:
    raise SystemExit('Upload and domain routing are separate. Public verification failed: ' + str(e))
print('PASS: production domain, release, legal pages, indexing and 404.')
