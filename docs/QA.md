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


## Überarbeitung: Marken als direkter Einstieg

- Marken-Accordion vollständig durch drei native Link-Flächen ersetzt; keine Marke ist verborgen oder von JavaScript abhängig.
- Langen Dienstleistungs-/Kompetenz-, Zitat-, Kundenlogo- und Recruiting-Pfad auf der Startseite entfernt. Kultur und Karriere bleiben als kompakte Sekundärzugänge und eigene Seiten erhalten.
- Einheitlicher Footer auf allen sechs Seiten mit direkten Markenlinks; bisherige generische Vertriebsansprache entfernt.
- Kontaktseite beginnt mit Markenauswahl; zentraler Kontakt ausdrücklich für die Unternehmensorganisation.
- Lokale Links, Fragmente, Bilder und JavaScript-Syntax erneut geprüft. Die visuelle Browserprüfung ist weiterhin offen.
- Silverback-Zugriff über Sites-Metadaten geprüft: derzeit `custom`, keine öffentliche Website verfügbar. Vorschau im Prototyp klar gekennzeichnet; öffentliche URL bleibt Launch-Voraussetzung.

## Durchgängige Dachgesellschaft – zweite Überarbeitung

Alle sechs Seiten neu strukturiert, mit einem gemeinsamen CSS-System statt einer Mischung aus alten Webflow-Layouts und neuen Komponenten. Die bestehende Farbwelt und lokalen Schriften bleiben. Spline im Einstieg, animierte Markenflächen und Buttons bleiben als Bewegungselemente; alte Scroll-Bildstrecken entfallen.

- Startseite: direkt sichtbare Marken, kurze Erklärung der gemeinsamen Haltung.
- Kultur: Rolle der Dachgesellschaft und konkrete Zusammenarbeit; vorhandene Teamdaten erhalten.
- Karriere: bestehende Jobanforderungen und neun FAQ erhalten, Benefits redaktionell gestrafft.
- Porträts ausschließlich im Teamraster. Kontakt, Bewerbung und sämtliche Footer ohne Personenbilder.
- Gemeinsame Navigation, Abschnittsabstände, Schriftgrößen, Bildformate und Footer.
- Alle sechs Seiten: lokale Links, Fragmente, Assets, Alt-Texte, IDs und genau eine H1 geprüft.
- JavaScript-Syntax und Git-Whitespace-Prüfung bestanden.

Kein visueller Browsertest durchgeführt: Der zuvor abgelehnte lokale Browserzugriff wurde nicht durch einen anderen Renderingweg umgangen. Responsive CSS ist implementiert; die tatsächliche Darstellung und Spline-Laufzeit müssen im Browser noch geprüft werden. Silverback bleibt eine ausdrücklich bezeichnete zugriffsbeschränkte Vorschau.
