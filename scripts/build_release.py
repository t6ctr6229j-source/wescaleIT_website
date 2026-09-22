"""Build a standalone Apache release; draft builds remain unindexable.

Usage: python3 scripts/build_release.py [--production]
Only --production opens indexing, after checking known launch dependencies.
"""
import argparse
import json
import os
from html import escape
from pathlib import Path
import re
import shutil
import subprocess
import sys
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'dist' / 'wescaleit'
ORIGIN = 'https://wescaleit.com'


def blockers(pages):
    issues = []
    for name in ('impressum.html', 'datenschutz.html'):
        if name not in pages:
            issues.append(f'{name}: lokale Rechtstexte fehlen; alte Website wird ersetzt.')
    for name, content in pages.items():
        if re.search(r'chatgpt\.site|github\.io/psoydo_website|Silverback-Vorschau', content):
            issues.append(f'{name}: Markenlink zeigt noch auf eine Vorschau.')
    return issues


def build(production=False):
    pages = {p.name: p.read_text() for p in ROOT.glob('*.html')}
    issues = blockers(pages)
    # Remove stale artifacts even when a subsequent production gate fails.
    if OUT.exists():
        shutil.rmtree(OUT)
    if production and issues:
        raise SystemExit('Live-Build noch gesperrt:\n- ' + '\n- '.join(issues))
    subprocess.run([sys.executable, str(ROOT / 'scripts/check_site.py')], check=True)
    OUT.mkdir(parents=True)
    for directory in ('css', 'js', 'images', 'fonts', 'assets'):
        if (ROOT / directory).exists():
            shutil.copytree(ROOT / directory, OUT / directory)
    (OUT / 'release.json').write_text(json.dumps({'commit': os.environ.get('GITHUB_SHA', subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip())}))
    sitemap = ET.Element('urlset', xmlns='http://www.sitemaps.org/schemas/sitemap/0.9')
    for name, content in pages.items():
        route = '/' if name == 'index.html' else '/' + name.removesuffix('.html')
        canonical = ORIGIN + route
        indexable = production and name != '404.html'
        content = re.sub(r'<meta name="robots"[^>]*>', '', content)
        content = re.sub(r'<link rel="canonical"[^>]*>', '', content)
        content = re.sub(r'<meta property="og:url"[^>]*>', '', content)
        meta = '<meta name="robots" content="' + ('index, follow' if indexable else 'noindex, nofollow') + '">'
        if name != '404.html':
            meta += f'<link rel="canonical" href="{escape(canonical)}"><meta property="og:url" content="{escape(canonical)}">'
        # Root-relative assets also work when the error document serves a nested URL.
        content = re.sub(r'(href|src)="(?![a-zA-Z][a-zA-Z0-9+.-]*:|/|#)([^\"]+)"', r'\1="/\2"', content)
        content = re.sub(r'(href=")/index\.html', r'\1/', content)
        content = re.sub(r'(href="/[^"?#]+)\.html(?=["?#])', r'\1', content)
        content = content.replace('</head>', meta + '</head>')
        (OUT / name).write_text(content)
        if indexable:
            ET.SubElement(ET.SubElement(sitemap, 'url'), 'loc').text = canonical
    if production:
        ET.ElementTree(sitemap).write(OUT / 'sitemap.xml', encoding='utf-8', xml_declaration=True)
    (OUT / 'robots.txt').write_text('User-agent: *\n' + ('Allow: /\nSitemap: ' + ORIGIN + '/sitemap.xml\n' if production else 'Disallow: /\n'))
    (OUT / '.htaccess').write_text('''Options -Indexes -MultiViews
DirectoryIndex index.html
ErrorDocument 404 /404.html
RewriteEngine On
RewriteCond %{HTTPS} !=on [OR]
RewriteCond %{HTTP_HOST} !^wescaleit\\.com$ [NC]
RewriteRule ^ https://wescaleit.com%{REQUEST_URI} [R=301,L]
RewriteRule ^infosec/?$ https://www.ciso2hero.com/beratung.html [R=301,L]
RewriteRule ^isms/?$ https://www.ciso2hero.com/beratung.html [R=301,L]
RewriteRule ^itxm/?$ https://www.silverback-network.com/ [R=301,L]
<FilesMatch "^\\.">
Require all denied
</FilesMatch>
# Keep former extensionless company URLs and one canonical URL per page.
RewriteCond %{THE_REQUEST} \\s/+index\\.html[\\s?] [NC]
RewriteRule ^index\\.html$ / [R=301,L]
RewriteCond %{THE_REQUEST} \\s/+([^?\\ ]+)\\.html[\\s?] [NC]
RewriteRule ^(.+)\\.html$ /$1 [R=301,L]
RewriteRule ^(ueber-uns|karriere|kontakt|job-informationssicherheit|marke-fcth|marke-silverback|marke-psoydo|impressum|datenschutz|404)/?$ $1.html [END]
''')
    print(f'Built {len(pages)} pages in {OUT} ({"production" if production else "draft; noindex"}).')
    if issues:
        print('Offen vor Livegang:\n- ' + '\n- '.join(issues))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--production', action='store_true')
    build(parser.parse_args().production)
