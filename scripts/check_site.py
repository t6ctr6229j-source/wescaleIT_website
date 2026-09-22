"""Check shipped HTML, local assets and fragments without third-party packages."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
from collections import Counter
import re

ROOT = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path, self.ids, self.refs, self.h1, self.errors = path, [], [], 0, []
        self.feed(path.read_text())
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs: self.ids.append(attrs['id'])
        if tag == 'h1': self.h1 += 1
        for key in ['href', 'src']:
            if attrs.get(key): self.refs.append(attrs[key])
        if attrs.get('srcset'):
            self.refs.extend(x.strip().split()[0] for x in attrs['srcset'].split(',') if x.strip())
        if tag == 'img' and 'alt' not in attrs: self.errors.append('Image has no alt attribute')
        if tag == 'a' and attrs.get('href') == '#': self.errors.append('Placeholder link #')

pages = {p: Page(p) for p in ROOT.glob('*.html')}
errors = []
for path, page in pages.items():
    errors.extend(f'{path.name}: {e}' for e in page.errors)
    if page.h1 != 1: errors.append(f'{path.name}: expected one h1, found {page.h1}')
    for key, n in Counter(page.ids).items():
        if n > 1: errors.append(f'{path.name}: duplicate id {key}')
    for ref in page.refs:
        u = urlsplit(ref)
        if u.scheme or u.netloc: continue
        target = (path.parent / unquote(u.path)).resolve() if u.path else path
        if not target.exists(): errors.append(f'{path.name}: missing {ref}')
        elif u.fragment and target in pages and unquote(u.fragment) not in pages[target].ids:
            errors.append(f'{path.name}: missing fragment {ref}')
for path in (ROOT / 'css').glob('*.css'):
    for ref in re.findall(r'url\([\'\"]?([^\)\'\"]+)', path.read_text()):
        u = urlsplit(ref)
        if not u.scheme and not u.netloc and not ref.startswith('#'):
            if not (path.parent / unquote(u.path)).exists(): errors.append(f'{path.name}: missing CSS asset {ref}')
if errors:
    print('\n'.join(errors)); raise SystemExit(1)
print(f'PASS: {len(pages)} pages, local links, fragments, CSS assets, image alt attributes, unique IDs.')
