"""Prevent incomplete or expired jobs and verify visible/schema work-location agreement."""
from datetime import date, timedelta
import json
from pathlib import Path
import re
from job_schema import add_job_schema

root = Path(__file__).resolve().parents[1]
filename = 'job-informationssicherheit.html'
page = (root / filename).read_text()
pending = json.loads((root / 'data/job-postings.json').read_text())[filename]
assert add_job_schema(filename, page, {'publish': False}) == page
sample = {
    'publish': True, 'confirmed_open': True, 'date_posted': date.today().isoformat(),
    'job_location': {'addressLocality': 'Testort', 'addressCountry': 'DE'}
}
for invalid in [
    {'publish': True}, {**sample, 'confirmed_open': False},
    {**sample, 'job_location': None}, {**sample, 'date_posted': None},
    {**sample, 'job_location': {'addressLocality': '   ', 'addressCountry': 'DE'}},
    {**sample, 'date_posted': (date.today() + timedelta(days=1)).isoformat()},
    {**sample, 'valid_through': (date.today() - timedelta(days=1)).isoformat()}
]:
    try:
        add_job_schema(filename, page, invalid)
    except (ValueError, TypeError):
        pass
    else:
        raise AssertionError('Incomplete, future or expired vacancy was allowed')
result = add_job_schema(filename, page, sample)
schema = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', result, re.S).group(1))
assert schema['@type'] == 'JobPosting'
assert schema['title'] == 'Informationssicherheitsberater / Auditor (m/w/d)'
assert schema['jobLocation']['address']['addressLocality'] == 'Testort'
assert '<dt>Arbeitsort</dt><dd>Testort, DE</dd>' in result
assert 'Testort, DE' in schema['description']
assert 'baseSalary' not in schema and 'jobLocationType' not in schema
add_job_schema(filename, page, pending)
print('PASS: JobPosting stays unpublished without confirmed vacancy data; visible copy and schema agree when activated.')
