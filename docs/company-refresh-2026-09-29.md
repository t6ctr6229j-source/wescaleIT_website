# Unternehmensauftritt, 29. September 2026

## Ausgangslage und Änderungen

Basis: main 77ff97a, einschließlich veröffentlichter Datenschutz-/Registerkorrekturen vom 26. September. Live-Startseite und Haltung & Team abgerufen. Organization und drei Brand-Knoten waren bereits vorhanden; kein zweiter Graph angelegt. Kontakt war auf der Kontaktseite vorhanden, auf der Startseite fehlten Adresse, Telefon und E-Mail.

Startseite: Title/Description auf Dachgesellschaft und Ulm ausgerichtet; erklärende Sätze in den drei extern verlinkten Markenkacheln; kompakte Unternehmensbeschreibung mit getrennten Wegen zu Marken, Kultur und Karriere; sichtbarer Unternehmenskontakt im Footer. Hero und Spline-Einbindung unverändert.

Haltung & Team: Entwicklung vom gemeinsamen Beratungsauftritt zu den Marken erklärt, ohne unbelegtes Gründungsjahr. Vorstand Florian Zegar und Standort/Geschäftsanschrift sichtbar. Konkretere Aussagen zu früher Ansprache von Problemen, respektvollem Feedback und Ideen unabhängig vom Titel. Bestehende Teamfotos, Kulturbeispiele und Karriereverweise erhalten. Gedankenstriche aus den beiden überarbeiteten Seiten entfernt.

Vorhandene Organization-/Brand-Knoten auf Startseite, Teamseite und den drei Markenporträts konsistent um Logo und NAP ergänzt. Stabile IDs erhalten, FCTH als alternateName. Keine neuen Tochtergesellschaften, LocalBusiness-Behauptungen, sameAs-Verwechslungen oder IP-/Entwicklungsansprüche an Psoydo.

## Quellen und offene Fakten

- Standort/Anschrift, Vorstand: aktuelles Impressum und dokumentierter Registerabgleich in `privacy-review-2026-09-26.md`. Dort ausdrücklich Registersitz Ostfildern, Geschäftsanschrift Ulm. Daher „Standort Ulm“, nicht „Sitz Ulm“.
- Entwicklung: ursprünglicher Webflow-Auftritt mit IT-/Informationssicherheitsberatung, anschließende vom Betreiber beauftragte Markenaufteilung. Keine zusätzlichen historischen Jahreszahlen.
- Arbeitsweise: vom Betreiber vorgegebene Kulturprinzipien; bestehende Kultur-/Karriereinhalte. Keine erfundenen Zitate.
- 120 dauerhaft betreute Kunden, über 70 Audits und über 30 Zertifizierungen: keine eindeutige aktuelle Primärquelle mit Zeitraum und Zählweise in diesem Auftrag. Zahlenblock weggelassen.
- Gründungsjahr, aktuelle Mitgliedschaften und offizielles LinkedIn-Profil: in den geprüften Repo-Unterlagen nicht ausreichend belegt. Nicht ergänzt. Eine spätere Ergänzung benötigt genaue Quellen und bei Kennzahlen die Definition.
- Schema-Modell: https://schema.org/Organization, `brand`, `address`, `logo`, `telephone`, `email`; Brand-Knoten nach https://schema.org/Brand. Gültige strukturierte Daten bedeuten keine garantierten Rich Results oder KI-Nennungen.

## Technische Prüfung vor Veröffentlichung

`python3 scripts/check_site.py`: elf Seiten, Verweise, Assets, Fragmente, Bild-Alternativtexte, IDs und H1.
`node scripts/check_analytics.cjs` und `node scripts/check-consent-lifecycle.cjs`: Einwilligung, Ablehnung, Widerruf, Ablauf, tabübergreifende Änderungen und Cache-Rückkehr. Keine Messdaten an Google gesendet.
`python3 scripts/build_release.py --production`: Produktionsfassung inklusive Canonicals, Sitemap und Routing.
Datenschutz, Impressum, Einwilligungs-JavaScript und Karriereinhalte werden durch diesen Auftrag nicht verändert.

Schema Markup Validator: vollständigen identischen JSON-LD-Graphen als Code-Snippet geprüft, Organization mit eingebetteten drei Marken und PostalAddress erkannt, **0 Fehler, 0 Warnungen**. Kein Anspruch auf einen bestimmten Google-Rich-Result-Typ.

`docs/responsive-review.html` ist eine reine Vorschau-/QA-Seite mit eingebetteter Live-Website und wählbarer Frame-Breite (390/768/1280 px). Sie gehört nicht zum Produktions-Build. Damit können die tatsächlichen responsiven Breakpoints im verfügbaren Desktop-Prüfbrowser geprüft werden.
