"""Verify actual public release, not just an HTTP 200 from the former Webflow site."""
from urllib.request import urlopen
from urllib.error import HTTPError
import os
import json
import time

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
    try:
        fresh('/__release-check__/missing-page')
    except HTTPError as e:
        assert e.code == 404
    else:
        raise ValueError('Missing page did not return HTTP 404.')
except Exception as e:
    raise SystemExit('Upload and domain routing are separate. Public verification failed: ' + str(e))
print('PASS: production domain, release, legal pages, indexing and 404.')
