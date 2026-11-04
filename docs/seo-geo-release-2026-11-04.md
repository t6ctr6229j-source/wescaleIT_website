# SEO/GEO und Messung: 4. November 2026

## Umgesetzt

- Markenwechsel werden nach Statistik-Einwilligung als `brand_visit` mit einer festen Markenkennung erfasst. Es werden keine Ziel-URLs oder Suchparameter in dieses Ereignis übernommen.
- Bewerbungslinks auf Karriere- und Stellenseite werden als `application_contact` erfasst. Ein E-Mail-Klick bleibt eine Kontaktabsicht und wird niemals als bestätigte Bewerbung oder als `generate_lead` gezählt.
- Produktivhost-, Widerrufs-, Ablauf- und Vorschau-Schutz gelten auch für diese Ereignisse. Keine rückwirkende Übertragung von Klicks vor Einwilligung.
- Die Datenschutzhinweise beschreiben die tatsächlich ergänzten Ereignisse.
- Die vorhandene Stellenseite verknüpft fachliche Arbeit, Arbeitsmodell, Entwicklung, Bewerbungsunterlagen und Bewerbungsprozess. Keine unbestätigten Gehalts-, Reise- oder Remote-Zusagen ergänzt.
- JobPosting wird aus sichtbaren Inhalten und bestätigten Stellendaten erzeugt. Eine Build-Sperre verhindert die Ausgabe ohne bestätigte offene Vakanz, Veröffentlichungsdatum und tatsächlichen Arbeitsort. Die Konfiguration bleibt bis zu diesen Angaben deaktiviert. Siehe `job-posting-publication.md`.
- CI prüft auch Änderungen an der Stellenkonfiguration.

## Validierung

- `node scripts/check_analytics.cjs`
- `node scripts/check-consent-lifecycle.cjs`
- `node scripts/check_contact_form.cjs`
- `python3 scripts/check_job_schema.py`
- `sh scripts/build-cloudflare-pages.sh`
- `python3 scripts/check_release_seo.py cf-dist`
- `python3 scripts/check_authorship.py`
- `git diff --check`

Die lokalen Ereignisprüfungen senden keine Daten an Google oder Tally. Sie bestätigen das Verhalten des Website-Codes, nicht den tatsächlichen Eingang in einer Google-Property.

## Noch außerhalb des Seitencodes

Die verbundene Search-Console-Datenquelle enthält wescaleIT nur als HTTP-URL-Property. Das Anbinden der Domain- beziehungsweise HTTPS-Property, URL-Prüfungen im Google-Index und die Überprüfung von Google-KI-Berichten benötigen Zugriff auf die Google-Kontoverwaltung. Windsor stellt für GA4 und Search Console derzeit keine Schreibaktionen bereit.

Für GA4: `generate_lead` nur für bestätigte Formularabschlüsse als Schlüsselereignis verwenden. `application_contact` bezeichnet keinen bestätigten Bewerbungseingang. Die benutzerdefinierten Parameter `destination_brand` und `application_type` können in GA4 als ereignisbezogene Dimensionen registriert werden, wenn eine entsprechende Berichtsauswertung benötigt wird. Bestehende Einwilligungsregeln beibehalten.

Echte Projektfälle, Produkttestergebnisse sowie bestätigte Stellendaten sind fachliche Eingaben. Dafür werden keine Ergebnisse, Kundenstimmen oder Beschäftigungsbedingungen erfunden.
