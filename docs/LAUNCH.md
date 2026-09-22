# Produktionsstart wescaleit.com

## Build

`python3 scripts/build_release.py` erzeugt einen eigenständigen, weiterhin nicht indexierbaren Entwurf in `dist/wescaleit/`. GitHub Pages bleibt unverändert aus dem Repository-Root erreichbar. Nur Website-Dateien werden ausgeliefert, keine Dokumentation, Skripte oder Git-Metadaten.

`python3 scripts/build_release.py --production` erzeugt nach den technischen Vorprüfungen eine indexierbare Fassung mit Sitemap, Canonicals und Open-Graph-URLs für `https://wescaleit.com`. Die Fehlerseite bleibt noindex. Der Build stoppt bei fehlenden lokalen Rechtstexten oder bekannten Vorschau-Markenlinks. Dies ersetzt keine inhaltliche Freigabe.

Die mitgelieferte `.htaccess` setzt Apache mit mod_rewrite und erlaubten Overrides voraus. Interne Links sind im Release domainrelativ. `/ueber-uns`, `/karriere` und `/kontakt` bleiben erreichbar; `.html`-Adressen werden auf ihre jeweilige kanonische Adresse umgeleitet. Der Build ist deshalb für einen eigenen Domain-Root bestimmt, nicht für das GitHub-Pages-Unterverzeichnis.

## Noch konkret zu klären

- Hosting für `wescaleit.com`: United Domains, vom Nutzer bestätigt. Das konkrete Zielverzeichnis ist noch festzulegen. Keine Verzeichnisse anderer Marken überschreiben.
- Silverback: `https://www.silverback-network.com` ist die bestätigte finale Adresse; Links und JSON-LD sind umgestellt. Erreichbarkeit vor Umschaltung erneut prüfen. Psoydo ist auf `https://psoydo.com/de/` umgestellt.
- Impressum und Datenschutz als lokale Seiten integrieren. Die derzeitigen Links zeigen auf die alte Website. Datenschutz auf den tatsächlichen neuen Hoster, Spline und das einwilligungsabhängige Google Analytics abstimmen; vorhandene Webflow-Hostingangaben nicht ungeprüft übernehmen.
- Alte Leistungs-URLs aus `docs/content-map.md` jeweils einem passenden endgültigen Markenziel zuordnen. Keine pauschale Umleitung aller alten Seiten auf die Startseite.
- Aktuellen Stellenstatus und Teamrollen prüfen; GA4-Aufbewahrung und erweiterte Messung im Konto abgleichen.

## Abnahme und Umschaltung

1. `python3 scripts/check_site.py` und `node scripts/check_analytics.cjs` ausführen, Produktions-Build erzeugen.
2. Build auf dem bestätigten Zielhost bereitstellen. Bestehenden Stand für Rückkehr sichern. Keine DNS-Umschaltung allein durch diesen Build.
3. HTTPS, Startseite, Markenwege, Karriere, lokale Rechtstexte sowie eine erfundene verschachtelte URL (echter HTTP-404-Status) prüfen. Canonicals, Sitemap und robots müssen zur Produktionsdomain passen.
4. Browserprüfung: Desktop/Mobil, Menü, Spline auf WebGL-fähigem Gerät, Statistik ablehnen/erlauben/widerrufen. Ohne Statistikzustimmung darf kein Google-Analytics-Tag geladen werden.
5. Nach Domainumschaltung dieselben öffentlichen URLs erneut prüfen. Erst dann ist der Livegang abgeschlossen.
