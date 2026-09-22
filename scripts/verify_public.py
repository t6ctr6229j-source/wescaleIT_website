"""Verify actual public release, not just an HTTP 200 from the former Webflow site."""
from urllib.request import urlopen
from urllib.error import HTTPError
import os
import json

origin = 'https://wescaleit.com'
try:
    with urlopen(origin + '/release.json', timeout=25) as r:
        live = json.load(r)
    if live['commit'] != os.environ['GITHUB_SHA']:
        raise ValueError('Public domain is not serving this release.')
    for path, marker in [('/', 'No bullshit!'), ('/impressum', 'HRB 755825'), ('/datenschutz', 'G-7QYEF752NM'), ('/robots.txt', 'Allow: /'), ('/sitemap.xml', 'https://wescaleit.com/karriere')]:
        with urlopen(origin + path, timeout=25) as r:
            assert marker in r.read().decode(), path
    try:
        urlopen(origin + '/__release-check__/missing-page', timeout=25)
    except HTTPError as e:
        assert e.code == 404
    else:
        raise ValueError('Missing page did not return HTTP 404.')
except Exception as e:
    raise SystemExit('Upload and domain routing are separate. Public verification failed: ' + str(e))
print('PASS: production domain, release, legal pages, indexing and 404.')
