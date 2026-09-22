# Livegang wescaleit.com

United Domains ist bestätigt. `.github/workflows/deploy-united-domains.yml` baut bei Änderungen auf main und manuell die Produktionsfassung und lädt sie ausschließlich nach `wescaleit/` relativ zum SFTP-Stamm hoch. Domainziel bei United Domains: `/wescaleit`, für Hauptdomain und www; HTTPS-Zertifikat für beide erforderlich.

## Veröffentlichung

Secrets: `UD_SFTP_HOST`, `UD_SFTP_USER`, `UD_SFTP_PASSWORD`; optional `UD_SFTP_PORT` (Standard 22) und `UD_SFTP_KNOWN_HOSTS`. Ohne bekannte Hostschlüssel gilt wie bei den anderen Marken Vertrauen bei der ersten Verbindung. Zugangsdaten werden nicht protokolliert.

Die Dateien werden in einem separaten Release-Verzeichnis hochgeladen und per SHA256 geprüft. Erst danach wird `wescaleit/` umgeschaltet. Ein vorhandenes nichtleeres Verzeichnis wird nur mit passender Release-Markierung ersetzt. Vorversionen bleiben in `wescaleit-backup-<run>-<attempt>/` erhalten. Rückkehr: Domainziel auf das gewünschte Backup-Verzeichnis setzen. Keine automatischen Löschungen von Backups.

`python3 scripts/build_release.py --production` erzeugt `dist/wescaleit/` mit Canonicals, Sitemap, robots, eigenen Rechtstexten, HTTPS-/www-Umleitung und echtem 404-Dokument. Apache/mod_rewrite und erlaubte Overrides werden benötigt. GitHub Pages bleibt eine nicht indexierbare Vorschau.

Die öffentliche Abschlussprüfung vergleicht `release.json` mit dem Commit. Ein erfolgreicher Upload allein bedeutet noch keinen abgeschlossenen Domainwechsel. Wenn die öffentliche Prüfung fehlschlägt, zuerst Domainziel und SSL prüfen.

## Rechtstexte und verbleibende Kontoeinstellungen

Impressum: Unternehmensangaben aus https://wescaleit.com/impressum, abgerufen 22.09.2026. Alte TMG-Haftungsbausteine nicht übernommen. Datenschutz auf tatsächliche Website-Funktionen zugeschnitten: United Domains, Vorschau bei GitHub, lokale Einwilligung, GA4, externe Spline-/jsDelivr-Abrufe, Kontakt/Bewerbung und Betroffenenrechte. Quellen: Anbieter-Datenschutzhinweise, in der Seite verlinkt. Keine Behauptung über abgeschlossene Verträge, nicht verifizierte DPF-Zertifizierungen oder eine juristische Freigabe.

Nicht über Website-Code prüfbar: Auftragsverarbeitungsverträge im Hosting-/Google-Konto und eingestellte GA4-Datenaufbewahrung. Die Datenschutzerklärung beschreibt hierfür die Zwecke bzw. die Property-Einstellung, ohne eine unbekannte feste Frist zu erfinden.

## Migration und Prüfung

`/infosec` und `/isms` führen zur FCTH-Beratung, `/itxm` zu Silverback. Unternehmensseiten bleiben unter ihren bisherigen extensionlosen URLs erreichbar. Nicht eindeutig zugeordnete alte Kampagnen-URLs aus `content-map.md` bekommen keine erfundene Zielzuordnung; hierfür sind konkrete aktuelle Angebote erforderlich.

Statische Prüfung: 11 Seiten, lokale Links, Assets, Fragmente, Alternativtexte und IDs. Analytics-Test: kein Google-Tag vor Einwilligung, Ablehnung, Annahme, gespeicherte/abgelaufene/defekte Auswahl, gesperrter Speicher und Widerruf.

Silverback-Ziel ist vom Nutzer als https://www.silverback-network.com bestätigt; der Abruf vor diesem Deployment lieferte HTTP 404. Die andere Markenwebsite wird nicht aus diesem Repo verändert.
