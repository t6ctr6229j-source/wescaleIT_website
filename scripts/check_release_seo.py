"""Validate built or live production URLs against the published sitemap.

Local: python3 scripts/check_release_seo.py cf-dist
Live:  python3 scripts/check_release_seo.py --live
The live mode intentionally refuses redirects for sitemap URLs.
"""
import argparse
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit
from urllib.request import HTTPRedirectHandler, build_opener
from xml.etree import ElementTree as ET

ORIGIN = 'https://wescaleit.com'
OWNED_HOSTS = {'wescaleit.com', 'www.wescaleit.com', 'ciso2hero.com',
               'www.ciso2hero.com', 'psoydo.com', 'www.psoydo.com',
               'silverback-network.com', 'www.silverback-network.com'}

class Page(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.canonicals, self.og_urls, self.robots, self.links, self.schemas = [], [], [], [], []
        self.h1 = 0
        self.json_active = False
        self.json_text = ''
        self.feed(html)

    def handle_starttag(self, tag, attributes):
        a = dict(attributes)
        if tag == 'link' and 'canonical' in a.get('rel', '').split():
            self.canonicals.append(a.get('href', ''))
        if tag == 'meta':
            if a.get('property') == 'og:url': self.og_urls.append(a.get('content', ''))
            if a.get('name', '').lower() == 'robots': self.robots.append(a.get('content', '').lower())
        if tag == 'a' and 'href' in a: self.links.append(a['href'])
        if tag == 'h1': self.h1 += 1
        if tag == 'script':
            self.json_active = a.get('type') == 'application/ld+json'
            self.json_text = ''

    def handle_data(self, data):
        if self.json_active: self.json_text += data

    def handle_endtag(self, tag):
        if tag == 'script' and self.json_active:
            self.schemas.append(json.loads(self.json_text))
            self.json_active = False


def strings(value):
    if isinstance(value, str): yield value
    elif isinstance(value, dict):
        for child in value.values(): yield from strings(child)
    elif isinstance(value, list):
        for child in value: yield from strings(child)


def validate(html, expected, headers):
    page = Page(html)
    assert page.canonicals == [expected], (expected, 'canonical', page.canonicals)
    assert page.og_urls == [expected], (expected, 'og:url', page.og_urls)
    assert page.h1 == 1, (expected, 'h1', page.h1)
    assert page.robots and all('noindex' not in value for value in page.robots), (expected, 'meta robots')
    assert 'noindex' not in headers.get('X-Robots-Tag', '').lower(), (expected, 'X-Robots-Tag')
    for ref in page.links + [url for schema in page.schemas for url in strings(schema) if url.startswith('https://')]:
        url = urlsplit(urljoin(expected, ref))
        if url.hostname in OWNED_HOSTS:
            assert not url.path.endswith('.html'), (expected, 'redirecting public URL', ref)


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl): return None


def audit(directory=None, live=False):
    opener = build_opener(NoRedirect())
    root = Path(directory) if directory else None
    def read(url):
        if live:
            with opener.open(url, timeout=25) as response:
                assert response.status == 200, (url, response.status)
                return response.read().decode('utf-8'), response.headers
        route = urlsplit(url).path
        file = root / (route.lstrip('/') or 'index.html')
        if not file.suffix: file = file.with_suffix('.html')
        return file.read_text(encoding='utf-8'), {}
    sitemap, _ = read(ORIGIN + '/sitemap.xml')
    urls = [node.text for node in ET.fromstring(sitemap).findall('{*}url/{*}loc')]
    assert urls and len(urls) == len(set(urls)), 'Empty sitemap or duplicate URLs'
    for url in urls:
        parts = urlsplit(url)
        assert parts.scheme == 'https' and parts.netloc == 'wescaleit.com', url
        assert not parts.query and not parts.fragment and not parts.path.endswith('.html'), url
        assert parts.path != '/404', '404 must not be in sitemap'
        html, headers = read(url)
        validate(html, url, headers)
    print('PASS: ' + str(len(urls)) + ' production sitemap URLs, canonical/og:url, indexing, H1, JSON-LD and brand links' + (' over live HTTP without redirects.' if live else ' in built artifact.'))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory', nargs='?', default='cf-dist')
    parser.add_argument('--live', action='store_true')
    args = parser.parse_args()
    audit(args.directory, args.live)
