# SEO- und GEO-Bestandsaufnahme: wescaleIT AG

**Stand:** 23.10.2026. **Markt:** Deutschland. **Freigabe:** nur Branch und Pull Request, kein Merge, keine Veröffentlichung.

## Aufgabe der Dachmarke

wescaleIT AG aus Ulm verbindet drei eigenständige Marken: From CISO to Hero (Informationssicherheit), Psoydo (Pseudonymisierung sensibler Daten vor KI-Nutzung) und Silverback (Staffing/Interim Management). Die Dachseite dient **Markenorientierung, Unternehmensidentität und Recruiting**, nicht der Konkurrenz gegen die kaufnahen Marken-Landingpages.

## Technischer Zustand

- Cloudflare Pages-Projekt `wescaleit-website`, production aus `main`. Der Build verwendet `python3 scripts/build_release.py --production`, erstellt den indexierbaren Kanonical-Stand und stellt eine produktive Sitemap bereit.
- **Wichtige Falle für Quellcode-Leser:** Root-HTML-Dateien tragen `noindex, nofollow`; die Quell-`robots.txt` sperrt `/`. Diese sind ausdrücklich Vorlagen/Entwurfszustand. Der verifizierte **Live-Build** ersetzt dies durch `index, follow`, Canonicals und `Allow: /`. Bitte nicht auf Basis der Source-Dateien einen angeblichen Live-SEO-Blocker berichten.
- Root hat 12 HTML-Dateien einschließlich 404 und Rechtstexten. Der Produktionsbuilder indexiert alle außer 404 (11 URLs); nicht jede davon ist eine Akquiseseite. Content: Startseite, Unternehmen/Team, Karriere, Informationssicherheitsjob, Kontakt, Vorstandprofil, drei Markenporträts und Rechtstexte.
- Startseiten-H1 `No bullshit! Just quality.` bleibt als Markensignal. Title `wescaleIT AG aus Ulm | FCTH, Silverback & Psoydo`, Organization/Brand-JSON-LD vorhanden. Ergänzung des Karriere-Schemas nur mit bestätigten Daten.

## Messung: aktuell nicht vollständig

- In Windsor.ai ist **nur die URL-Property `http://wescaleit.com/`** mit der Search Console verbunden, nicht die Domain-Property. Sie meldete für 22.09.–19.10.2026 179 Impressionen, 9 Klicks und Ø Position 6,46, zeigt aber allein die HTTP-Seite. **Keine repräsentative Aussage über die heutige HTTPS-Website.**
- Suchanfragen in dieser Property: `wescaleit` 57 Impressionen, `wescaleit ag` 29, `it security ulm` 8; die HTTP-Property/alte Seitentypen können die Werte verzerren.
- GA4 `wescaleIT_website`: 118 gemessene Sitzungen, 0 Key Events, bei consent-basiertem Tracking und älteren URL-Pfaden. Nicht mit echten Leads verwechseln.
- Primärer nächster Schritt außerhalb dieses PR: Domain-Property `sc-domain:wescaleit.com` in Google Search Console mit DNS-Eigentumsnachweis freigeben und vorhandene Sitemaps/Indexreports dort prüfen. **Keine DNS-Veränderungen ohne Freigabe.**

## Keyword-Mapping

| Intention | Zielseite | Einschränkung |
| --- | --- | --- |
| wescaleIT AG, IT-Unternehmen Ulm, Unternehmensmarke | / | Unternehmensidentität |
| wescaleIT Team / Arbeitgeber Ulm | /ueber-uns, /karriere | Kultur und Recruiting |
| IT Karriere Ulm, Informationssicherheit Karriere | /karriere | Recruiting |
| Informationssicherheitsberater / Auditor (m/w/d) | /job-informationssicherheit | **Jobstatus vor weiterem Ausbau bestätigen** |
| Florian Zegar / Vorstand wescaleIT | /florian-zegar | Verantwortliche Person und Expertise |
| FCTH / externe Informationssicherheit | /marke-fcth | Orientierung und Weiterleitung, kein eigener Dienstleistungs-Klon |
| Psoydo / KI-Pseudonymisierung | /marke-psoydo | Orientierung und Weiterleitung |
| Silverback / IT-Staffing | /marke-silverback | Orientierung und Weiterleitung |
| Kontakt wescaleIT | /kontakt | allgemeiner Unternehmenskontakt |

## Änderungen im Branch

- `karriere.html`: Title/Description und sichtbarer Einstieg nennen die Arbeitgeber-/Standortintention klarer, während der vorhandene H1 und das Layout unangetastet bleiben.
- Strukturiertes `WebPage`-/`Organization`-JSON-LD ergänzt, mit bisher belegten Marken, Links und Ulmer Anschrift.
- Keine neue Stellenbehauptung, kein `JobPosting` ohne bestätigte aktive Vakanz, keine fiktiven Benefits oder Mitarbeiterzitate.

## Freigaben und Grenzen

- Ist die Rolle Informationssicherheitsberater/Auditor **aktuell ausgeschrieben**, inklusive rechtlich und personell bestätigter Daten? Erst danach JobPosting-Schema mit echten Jobinformationen.
- Welche Unternehmens-/Teammitglieder und Auszeichnungen sind in 2026/2027 öffentlich bestätigt? Keine pauschalen Aussagen aus Entwürfen übernehmen.
- Die bestehenden Markenlinks und Organigramm-Zuordnung sind zu erhalten. Keine Kannibalisierung mit ciso2hero.com.
- Browser-Performance-Werte, echte Google-URL-Indexierung und Keyword-Schwierigkeit wurden nicht als Messwert bestätigt. Mobile Spline und JavaScript brauchen gesonderte visuelle QA.
- Vor Merge `python3 scripts/check_site.py` und `python3 scripts/build_release.py --production`, Consent-/Webflow-/Spline-/Mobil-Checks sowie korrekte endgültige Canonicals und Preview-Noindex prüfen.
