#!/usr/bin/env python3
"""Check the production-like artifact, not draft HTML with intentional noindex."""
import json
import re
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1] / "dist" / "wescaleit"
ORIGIN = "https://wescaleit.com"
COMPANY = ORIGIN + "/#organization"
BRANDS = {
    ORIGIN + "/#brand-fcth",
    ORIGIN + "/#brand-silverback",
    ORIGIN + "/#brand-psoydo",
}
pages = sorted(ROOT.glob("*.html"))
if not pages or not (ROOT / "index.html").exists():
    raise SystemExit("Production-like release has no HTML output")

expected_urls = set()
for file in pages:
    content = file.read_text(encoding="utf-8")
    if file.name == "404.html":
        assert '<meta name="robots" content="noindex, nofollow">' in content
        continue
    route = "/" if file.name == "index.html" else "/" + file.stem
    canonical = ORIGIN + route
    expected_urls.add(canonical)
    assert '<meta name="robots" content="index, follow">' in content, file.name
    assert content.count('<link rel="canonical" href="' + canonical + '">') == 1, file.name
    assert '<meta property="og:url" content="' + canonical + '">' in content, file.name

for name in ("index.html", "florian-zegar.html", "karriere.html"):
    content = (ROOT / name).read_text(encoding="utf-8")
    graphs = [json.loads(x) for x in re.findall(
        r'<script type="application/ld\+json">([\s\S]*?)</script>', content)]
    nodes = [node for graph in graphs for node in graph.get("@graph", [graph])]
    organizations = [node for node in nodes if node.get("@type") == "Organization"]
    assert len(organizations) == 1, (name, "expected one corporate entity")
    assert organizations[0].get("@id") == COMPANY, name
    if name == "index.html":
        brands = {node["@id"] for node in nodes if node.get("@type") == "Brand"}
        assert brands == BRANDS, (name, brands)
    if name == "florian-zegar.html":
        profile = next(node for node in nodes if node.get("@type") == "ProfilePage")
        person = profile.get("mainEntity", {})
        assert person.get("@id") == ORIGIN + "/florian-zegar#person", name
        assert person.get("worksFor", {}).get("@id") == COMPANY, name
    if name == "karriere.html":
        webpage = next(node for node in nodes if node.get("@type") == "WebPage")
        assert webpage.get("url") == ORIGIN + "/karriere", name

robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
assert "Allow: /" in robots and "Disallow: /" not in robots, robots
assert "Sitemap: " + ORIGIN + "/sitemap.xml" in robots, robots
root = ET.parse(ROOT / "sitemap.xml").getroot()
urlset = [el.text for el in root.findall(".//{*}loc")]
assert len(urlset) == len(set(urlset)), "Duplicate sitemap URLs"
assert set(urlset) == expected_urls, (len(urlset), len(expected_urls), set(urlset) ^ expected_urls)
print(f"PASS: {len(expected_urls)} indexable production pages, noindex 404, canonicals, sitemap and corporate entity graph.")
