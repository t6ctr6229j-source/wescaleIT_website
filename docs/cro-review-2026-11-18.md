# CRO-Änderungen vom 18. November 2026

## Besucherführung

- Startseite: bestehendes Markenbild mit konkreten Anliegen und primärem CTA „Anliegen besprechen“. Zweiter, ruhigerer Link führt zu den Angeboten.
- Start- und Kontaktseite: Informationssicherheit/Audits → FCTH; IT-Projekte/Expertenteams → Silverback; sensible Dokumente für KI pseudonymisieren → Psoydo.
- Kontaktformular vor dem Unternehmenskontakt, verständliche Zuordnung zu den bestehenden Tally-Optionen und nächster Schritt nach der Anfrage. Die Themenhilfe bleibt nach Aktivierung sichtbar.
- Karriere eigener Einstieg; E-Mail bleibt Alternative ohne Tally-Einbettung. Keine Zeiten, Preise, kostenlosen Leistungen oder Conversion-Steigerungen versprochen.

## Consent, Messung und Datenschutz

Tally ja1WdE, contact-form.js und analytics.js unverändert. Kein neuer Drittanbieterabruf. Vor Formularfreigabe kein iframe, nach Freigabe genau eines; Deaktivierung entfernt es. Analytics-Freigabe lädt Tally nicht. Keine echte Anfrage im Test abgesendet.

Keine sticky Telefon-/Mailleiste vorhanden (nur sticky Navigation). Daher kein neues contact_click-Ereignis eingebaut. Vorhandene brand_visit, application_contact und generate_lead bleiben getrennt: Nur bestätigte Tally-Abschlüsse können generate_lead auslösen, keine Kontakt- oder Markenlinks. Keine neuen Analyticsanbieter oder Ereignisparameter.

Der alte Befund „kein Kontaktformular im Datenschutz“ trifft auf main nicht zu: Abschnitt 6.1 erklärt Tally bereits, inklusive separater Freigabe. Auch Cloudflare Pages, Spline/jsDelivr/Draco und GA4 sind beschrieben. Rechtstext unverändert; lediglich die veraltete Formularbeschreibung im README aktualisiert.

Offene Prüfung durch Betreiber: endgültige Tally-Texte (Psoydo-Option laut Betreiber bereits als unveröffentlichter Entwurf korrigiert), tatsächliche GA4-Kontoeinstellungen einschließlich erweiterter Messung und deren möglicher Zusatzereignisse. Bestehende offene Punkte aus docs/privacy-review-2026-09-26.md zu Spline-Rolle, Einbettung und Übermittlungsgrundlage bleiben bestehen. Keine neuen Rechtsgrundlagen, Speicherfristen oder Vertragsbestätigungen ergänzt; keine Rechtskonformität bescheinigt.

## Prüfung

Bestanden:
- python3 scripts/check_site.py: 12 Seiten, lokale Links/Fragmente, Assets, Alt-Texte und IDs.
- python3 scripts/check_authorship.py; python3 scripts/check_job_schema.py.
- node --check für alle js/*.js; python3 -m py_compile scripts/verify_public.py.
- node scripts/check_analytics.cjs; node scripts/check-consent-lifecycle.cjs (9 Lifecycle-Prüfungen); node scripts/check_contact_form.cjs.
- python3 scripts/build_release.py --production und python3 scripts/check_release_seo.py dist/wescaleit: 11 Sitemap-URLs, Canonicals, Indexierung, H1 und JSON-LD.
- sh scripts/build-cloudflare-pages.sh und python3 scripts/check_release_seo.py cf-dist.
- git diff --check.

Desktop-Browser (1316 × 884): Startseitenlayout und Kontakt-CTA zu kontakt.html#kontaktformular, Consent denied/granted/revoked im Dialog, Tally 0 → 1 → 0 → 1 → 0 iframes, Themenhilfe nach Aktivierung sichtbar. Keine Formularübermittlung. Produktions-GA4-Netzverkehr nicht getestet: localhost ist im bestehenden Code bewusst von Messung ausgeschlossen; die isolierten Tests decken Produktionshost, Zustimmung, Widerruf, Ablauf, Mehrfachinteraktionen und keine PII-Weitergabe ab.

Grenzen: keine mobile Viewport-/Geräteprüfung; responsive CSS-Prüfung mit bestehendem 760px-Breakpoint und umbrechender CTA-Zeile. Der interne statische Server unterstützt die produktiven endungslosen Routen nicht, deshalb UI-Prüfung der Quellseiten; Release-Rewrites separat über Builds geprüft. Marken-URLs im Repository bestätigt; HTTP-Prüfung aus dem Executor bei allen drei Zielen mit 403 blockiert, keine Erreichbarkeitszusage. Silverback-Inhalt zusätzlich über öffentliche Webabfrage bestätigt.

## Integration

Basis main: 4a2d1d6cd887e65b7bfa6ee674995853927fa7fe. Separater Draft #23 (feat/home-darknet-quickcheck, 7da1fee4664e0129fc55c957095d515183ae989e) verändert ebenfalls index.html und css/dachmarke.css. Nicht übernommen oder verändert. Startseiten-HTML ist weitgehend einzeilig; bei Integration beider PRs ist eine manuelle Zusammenführung zu erwarten. Darknet-Einstieg dabei nach den Marken erhalten. Ältere Drafts #20/#8 sind nicht Teil dieses Auftrags.

Nur Draft-PR; kein Merge, Auto-Merge oder Deployment.
