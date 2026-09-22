# wescaleIT – Eigene Stärken. Gemeinsame Haltung.

Website-Entwurf der wescaleIT AG als Dach für FCTH, Silverback und Psoydo. Alle elf Seiten verwenden ein gemeinsames Layout- und Typografiesystem. Die bestehende Produktionsdomain wurde nicht verändert.

## Konzept

- **Startseite:** Der ursprüngliche große Einstieg mit „No bullshit! Just quality.“, Unterstreichung und Spline-Szene eröffnet die Seite. Unmittelbar darunter führen drei ohne Aufklappen sichtbare Marken Kunden weiter. Ein kurzer Bereich erklärt die gemeinsame Haltung und verweist auf Team und Karriere.
- **Haltung & Team:** Rolle der Dachgesellschaft, vier konkrete Kulturprinzipien und das bestehende Team. Porträts stehen ausschließlich im Teamraster.
- **Karriere:** Stellen, Arbeitskultur, Teameinblicke, bestehende FAQ und ein kompakter Bewerbungsbereich ohne Porträt.
- **Stellendetail:** Bestehende Aufgaben und Anforderungen, Eckdaten und Bewerbung per E-Mail.
- **Kontakt:** Fachliche Anfragen zu den Marken; Unternehmensfragen zu wescaleIT. Textbasierter Kontakt ohne übergroße Personenbilder.
- **404:** Rückweg zur Startseite.

Alle Seiten haben denselben ruhigen Footer mit Marken-, Unternehmens- und Rechtslinks. Keine allgemeinen Dienstleistungsangebote der Dachgesellschaft.

## Gestaltung

Originale Farbwelt (Midnight, Blau, Mint, Peach, Gelb), lokal geladene Neue Machina und Space Grotesk. Das gemeinsame System steht in `css/dachmarke.css`. Die Seiten laden keine alten Webflow-Layouts mehr; so konkurrieren keine alten Abstände, Bildgrößen oder Schriftregeln mit dem neuen Aufbau.

Die originale Spline-Szene im Einstieg wird weiterhin mit `js/webflow.js` geladen. Ohne Netzwerk oder bei reduzierter Bewegung bleibt der farbige Hintergrund. Markenflächen und Buttons haben Auftritts- bzw. Hover-Animationen. Reduzierte Bewegung wird in CSS berücksichtigt. Die alten Scroll-Bildwechsel und endlosen Bildstrecken wurden durch ruhigere, direkt sichtbare Inhalte ersetzt.

Navigation und Datum: `js/dachmarke.js`. Alle Inhalte, Markenlinks, Stellen und FAQ funktionieren ohne JavaScript; auf Mobilgeräten bleibt die Navigation dann aufgeklappt.

## Lokal ansehen und prüfen

Kein Build und keine Installation nötig:

```sh
python3 -m http.server 8080
python3 scripts/check_site.py
node --check js/dachmarke.js
```

Relative interne Links unterstützen GitHub Pages in einem Unterverzeichnis. Pages kann aus `main` / Root bereitgestellt werden.

## Markenlinks und Freigabe

`docs/brand-links.json` dokumentiert die Ziele, ist aber kein Laufzeit-CMS. Bei Änderungen auch alle HTML-Verlinkungen aktualisieren.

- FCTH: https://www.ciso2hero.com/
- Psoydo: https://psoydo.com/de/
- Silverback: https://www.silverback-network.com (vom Nutzer bestätigte Zieladresse).

Entwurfsstatus: `noindex, nofollow` und `robots.txt`. Impressum und Datenschutz sind als lokale Seiten integriert. Kein Formularbackend oder vorgetäuschter Versand. Google Analytics lädt ausschließlich nach Statistikzustimmung. Bewerbungen öffnen das E-Mail-Programm.

Vor öffentlichem Launch: Markenadressen, Teamrollen und Stellenstatus bestätigen; visuelle Prüfung im Desktop- und Mobilbrowser durchführen; alte Leistungs-URLs passend weiterleiten. Prüfumfang und Grenzen stehen in `docs/QA.md`.

## Markenporträts

`marke-fcth.html`, `marke-silverback.html` und `marke-psoydo.html` erklären Schwerpunkt, Zielgruppe und Beziehung zur wescaleIT AG. Eigenständige Texte, individuelle Metadaten und JSON-LD mit Organization/Brand. Keine eigenständigen Tochtergesellschaften behauptet. Die Hauptkarten verlinken weiterhin extern; separate Links darunter und im Footer erschließen die Porträts.

Entwurf bleibt nicht indexierbar. Beim Go-live Indexierung, finale URLs und Canonicals/Sitemap gemeinsam auf die Produktionsdomain abstimmen. Strukturierte Daten garantieren keine Such- oder KI-Platzierung.

## Produktions-Build

`python3 scripts/build_release.py` erstellt einen separaten Apache-Entwurf in `dist/wescaleit/`. Mit `--production` werden Indexierung und Sitemap aktiviert, sobald lokale Rechtstexte und finale Markenlinks vorhanden sind. Hosting-Abhängigkeiten und die konkreten noch offenen Launch-Punkte stehen in `docs/LAUNCH.md`.

## Analytics-Einbindung

Mess-ID `G-7QYEF752NM`, Einbindung in `js/analytics.js`. Zustimmung/Ablehnung im Dialog, Änderung über Cookie-Einstellungen im Footer. Ohne Zustimmung wird kein Google-Tag geladen. Entscheidung 180 Tage gespeichert; Widerruf deaktiviert Analytics und lädt die Seite neu. Prüfen mit `node scripts/check_analytics.cjs`. Datenschutzhinweise und GA4-Kontoeinstellungen vor Produktionsfreigabe abstimmen.
