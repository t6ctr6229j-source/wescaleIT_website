"""Publish JobPosting only from confirmed vacancy data and the visible job copy."""
from datetime import date
from html import escape, unescape
import json
import re

ORIGIN = 'https://wescaleit.com'


def add_job_schema(filename, content, metadata):
    if not metadata or not metadata.get('publish'):
        return content
    if metadata.get('confirmed_open') is not True:
        raise ValueError(f'{filename}: confirm that the vacancy is open before publishing JobPosting')
    posted = date.fromisoformat(metadata.get('date_posted') or '')
    if posted > date.today():
        raise ValueError(f'{filename}: date_posted cannot be in the future')
    expires = metadata.get('valid_through')
    if expires and (date.fromisoformat(expires) < date.today() or date.fromisoformat(expires) < posted):
        raise ValueError(f'{filename}: expired vacancies must not publish JobPosting')
    address = metadata.get('job_location')
    if not isinstance(address, dict) or not address.get('addressLocality') or not re.fullmatch(r'[A-Z]{2}', address.get('addressCountry', '')):
        raise ValueError(f'{filename}: a confirmed work location is required; company headquarters are insufficient')
    address = {key: str(value).strip() for key, value in address.items()
               if key in ('streetAddress', 'postalCode', 'addressLocality', 'addressRegion', 'addressCountry') and value}
    title_match = re.search(r'<h1\b[^>]*>(.*?)</h1>', content, re.S)
    description_match = re.search(r'<div class="prose" id="job-description">(.*?)</div><aside', content, re.S)
    if not title_match or not description_match:
        raise ValueError(f'{filename}: visible job title or description is missing')
    title = unescape(re.sub(r'<[^>]+>', '', title_match.group(1))).strip()
    description = re.sub(r'<(?!/?(?:p|h2|h3|ul|ol|li|br)\b)[^>]+>', '', description_match.group(1))
    location_text = ', '.join(address[key] for key in ('streetAddress', 'postalCode', 'addressLocality', 'addressCountry') if key in address)
    description += '<p>Arbeitsort: ' + escape(location_text) + '</p>'
    job = {
        '@context': 'https://schema.org', '@type': 'JobPosting',
        '@id': ORIGIN + '/' + filename.removesuffix('.html') + '#job',
        'url': ORIGIN + '/' + filename.removesuffix('.html'),
        'title': title, 'description': description, 'datePosted': posted.isoformat(),
        'employmentType': 'FULL_TIME',
        'hiringOrganization': {
            '@type': 'Organization', '@id': ORIGIN + '/#organization',
            'name': 'wescaleIT AG', 'sameAs': ORIGIN + '/',
            'logo': ORIGIN + '/images/wescaleIT_logo.svg'
        },
        'jobLocation': {'@type': 'Place', 'address': {'@type': 'PostalAddress', **address}}
    }
    if expires:
        job['validThrough'] = expires
    visible = '<dt>Arbeitsort</dt><dd>' + escape(location_text) + '</dd>'
    if content.count('<dt>Unternehmenssitz</dt>') != 1:
        raise ValueError(f'{filename}: expected job facts section is missing')
    content = content.replace('<dt>Unternehmenssitz</dt>', visible + '<dt>Unternehmenssitz</dt>', 1)
    payload = json.dumps(job, ensure_ascii=False).replace('</', '<\\/')
    return content.replace('</head>', '<script type="application/ld+json">' + payload + '</script></head>', 1)
