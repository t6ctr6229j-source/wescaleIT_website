# wescaleIT – Menschen. Marken. Eine Haltung.

Erster Website-Entwurf als gemeinsames Dach für FCTH, Silverback und Psoydo. Basis ist der vom Auftraggeber bereitgestellte Webflow-Export vom 16.09.2026. Die bestehende Produktionswebsite wurde nicht verändert.

## Lokal ansehen

Keine Installation und kein Build notwendig. Im Repository-Verzeichnis:

```sh
python3 -m http.server 8080
```

Anschließend `http://localhost:8080` öffnen. Alle internen Links sind relativ und funktionieren auch in einem GitHub-Pages-Unterverzeichnis.

## Seiten

- `index.html`: Marken-Einstieg mit drei gleichzeitig sichtbaren, direkt verlinkten Markenflächen; darunter nur ein kompakter Zugang zu Kultur und Karriere.
- `ueber-uns.html`: gemeinsame Kultur, bestehende Bild-/Scroll-Inszenierung, vollständiges Team aus der Live-Seite.
- `karriere.html`: bestehende Kultur- und Benefit-Inhalte, Jobübersicht, FAQ und Bewerbung.
- `job-informationssicherheit.html`: erster redaktioneller Stellenentwurf für Informationssicherheitsberatung/Audit.
- `kontakt.html`: zentrale Ansprechpartner, E-Mail und Telefon.
- `404.html`: Rückweg zur Startseite.

Impressum und Datenschutz verlinken auf die bestehende wescaleIT-Website. Es gibt keine neue Rechtstextfassung und keinen Formulardienst. Bewerbungen öffnen das E-Mail-Programm, sie werden nicht im Browser gespeichert oder als angeblich versendet bestätigt.

## Gestaltung und Animation

Original erhalten: Webflow-Styles und Interaktionsdatei, Neue Machina und Space Grotesk, Farbwelt, Hervorhebungen, Spline-Szene, Scroll-Bildwechsel und bestehende animierte Buttons. Ergänzungen liegen in `css/dachmarke.css` und `js/dachmarke.js`.

Die Startseite ist als kurzer Wegweiser aufgebaut. Alle drei Marken stehen ohne Klick oder JavaScript vollständig sichtbar im Einstieg. Jede Markenfläche ist ein direkter Link; auf kleinen Displays stehen die drei Flächen untereinander. Navigation und Karriere-FAQ funktionieren unabhängig von externen Scripts. Zurückhaltende Auftritts- und Hover-Animationen berücksichtigen reduzierte Bewegung.

Die originale Spline-Szene wird weiterhin über Webflow/Spline geladen und benötigt Netzwerkzugriff. Ohne sie bleiben Hintergrund, Inhalt, Navigation und Links sichtbar. Der Export enthält Space Grotesk Bold nicht; momentan wird dafür die vorhandene Regular-Datei verwendet. Vor dem finalen Launch die lizenzierte Bold-Datei ergänzen.

## Markenlinks

- FCTH: `https://www.ciso2hero.com/` aus der aktuellen Repository-Konfiguration.
- Psoydo: bestehende GitHub-Pages-Adresse `https://t6ctr6229j-source.github.io/psoydo_website/de/`.
- Silverback: `https://silverback-network.wescaleit-ag-0446.chatgpt.site`. Im Prototyp ausdrücklich als zugriffsbeschränkte Vorschau gekennzeichnet. Vor öffentlicher Nutzung muss diese Adresse durch die öffentliche Markenwebsite ersetzt werden. Die Zugriffsrechte der Silverback-Seite wurden nicht verändert.

`docs/brand-links.json` dokumentiert die verwendeten Daten; es ist kein Laufzeit-CMS. Änderungen müssen auch in `index.html` erfolgen.

## Entwurfsstatus

Der Entwurf ist mit `noindex, nofollow` und `robots.txt` gegen Suchmaschinenindexierung vorbereitet. Kein Analytics, kein Cookie-Banner, keine Kontaktformular-Attrappe. Keine Produktionsdomain und keine automatische Veröffentlichung konfiguriert.

Vor Freigabe: Stellenstatus und Stelleninhalt bestätigen, Teamrollen auf Aktualität prüfen, öffentliche Markenlinks finalisieren, Original-Bold-Font ergänzen und visuelles Desktop-/Mobil-QA durchführen. Alte Leistungs-URLs wurden noch nicht umgeleitet; die Zuordnung steht in `docs/content-map.md`.

## Prüfung

```sh
python3 scripts/check_site.py
node --check js/dachmarke.js
node --check js/webflow.js
```

Prüfumfang und Grenzen: `docs/QA.md`.
