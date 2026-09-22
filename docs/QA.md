# Prüfung des ersten Entwurfs – 22.09.2026

## Erfolgreich

- Sechs statische HTML-Seiten, jeweils genau eine H1 und eindeutige Element-IDs.
- Alle lokalen Links, Sprungmarken, Bild-/Script-Dateien, srcset-Varianten und CSS-Assets vorhanden.
- Alle Bilder besitzen ein alt-Attribut; dekorative Bilder dürfen ein leeres Attribut haben.
- Keine leeren Platzhalterlinks mit `href="#"`.
- `node --check` für `js/dachmarke.js`, `js/webflow.js` und sämtliche Inline-Scripts bestanden.
- Die vorhandenen CMS-Teamprofile sind in statisches HTML überführt; lokal verfügbare Profilbilder wurden geprüft.
- Cookie-Script, Hotjar, Plausible und nicht mehr benötigte Finsweet-Abhängigkeiten aus dem Entwurf entfernt.
- Marken-Accordion mit nativen Buttons, aria-expanded, Tastatursteuerung und inaktiven/inert Inhaltsbereichen implementiert.
- FAQ mit nativen details/summary; Bewerbung und Kontakt mit echten E-Mail-Links statt Scheinformularen.
- Unbenutzte Export-Assets entfernt; ausgelieferter Stand etwa 4,6 MB.

## Noch offen

Die lokale Browser-Vorschau wurde von der automatischen Freigabeprüfung blockiert. Es wurde kein alternativer Browserweg als Umgehung benutzt. Deshalb sind Desktop-/Mobil-Rendering, tatsächliche Scroll-/Spline-Animationen und Interaktionen nicht visuell oder im Browser abgenommen. Die vorgenannten Prüfungen sind Code-/Dateiprüfungen, keine bestandenen Browser-Tests.

Vor Veröffentlichung: Darstellung bei 1440, 768 und 390 px, mobile Navigation, Accordion per Tastatur, FAQ, E-Mail-Links, Bildgalerie, Spline sowie reduced-motion prüfen. Den redaktionellen Stellenentwurf, Rollen und Markenlinks bestätigen. Die im Originalexport fehlende Space-Grotesk-Bold-Datei ergänzen.
