# Stellenanzeige und Google Jobs

Stand: 4. November 2026.

Die vorhandene Anzeige bleibt erreichbar. Die technische JobPosting-Auszeichnung ist vorbereitet und im Build geprüft. Sie wird derzeit nicht ausgegeben, weil der bestätigte Arbeitsort und das tatsächliche Veröffentlichungsdatum der offenen Stelle fehlen. Die ältere Content-Dokumentation enthält zudem noch keine Bestätigung der offenen Vakanz.

## Benötigte Angaben

- Bestätigung, dass die konkrete Stelle weiterhin offen ist.
- Datum, an dem diese Stelle tatsächlich zur Bewerbung veröffentlicht wurde. Das Datum einer Codeänderung ist dafür kein Ersatz.
- Tatsächlicher Arbeitsort, mindestens Ort und Land. Die Unternehmensanschrift in Ulm beweist keinen Arbeitsort.
- Ablaufdatum der Anzeige, wenn es eine Bewerbungsfrist gibt.

Diese Angaben in `data/job-postings.json` hinterlegen. `confirmed_open` und `publish` erst auf `true` setzen, wenn die Angaben sachlich bestätigt sind. `job_location` verwendet die Schlüssel `addressLocality` und `addressCountry`; `streetAddress`, `postalCode` und `addressRegion` sind optional. Die Anzeige und die strukturierten Daten erhalten den gleichen sichtbaren Arbeitsort automatisch.

Eine ausschließlich ortsunabhängige Stelle benötigt eine gesonderte Abbildung von Remote-Eignung und erlaubten Bewerberstandorten. Aus den allgemeinen flexiblen Arbeitsmodellen des Unternehmens wird keine solche Zusage für diese Stelle abgeleitet. Vergütung und konkrete Reiseanteile sind nicht ergänzt.

## Prüfung und Pflege

1. `python3 scripts/check_job_schema.py`
2. `sh scripts/build-cloudflare-pages.sh`
3. `python3 scripts/check_release_seo.py cf-dist`
4. Die veröffentlichte einzelne Stellenseite im Google Rich Results Test prüfen.
5. Nach Besetzung `publish` deaktivieren und die sichtbare Anzeige entsprechend aktualisieren. Keine JobPosting-Auszeichnung auf einer allgemeinen Karriereübersicht.

Grundlage: https://developers.google.com/search/docs/appearance/structured-data/job-posting
