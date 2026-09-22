# wescaleIT – Eigene Stärken. Gemeinsame Haltung.

Website-Entwurf der wescaleIT AG als Dach für FCTH, Silverback und Psoydo. Alle sechs Seiten verwenden ein gemeinsames Layout- und Typografiesystem. Die bestehende Produktionsdomain wurde nicht verändert.

## Konzept

- **Startseite:** Drei direkt sichtbare Marken führen Kunden weiter. Ein kurzer Bereich erklärt die gemeinsame Haltung und verweist auf Team und Karriere.
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
- Psoydo: https://t6ctr6229j-source.github.io/psoydo_website/de/
- Silverback: zugriffsbeschränkte Vorschau unter https://silverback-network.wescaleit-ag-0446.chatgpt.site – öffentliche Zieladresse vor Launch einsetzen.

Entwurfsstatus: `noindex, nofollow` und `robots.txt`. Impressum und Datenschutz verweisen auf die bestehenden Texte. Kein Formularbackend, Tracking oder vorgetäuschter Versand. Bewerbungen öffnen das E-Mail-Programm.

Vor öffentlichem Launch: Markenadressen, Teamrollen und Stellenstatus bestätigen; visuelle Prüfung im Desktop- und Mobilbrowser durchführen; alte Leistungs-URLs passend weiterleiten. Prüfumfang und Grenzen stehen in `docs/QA.md`.
