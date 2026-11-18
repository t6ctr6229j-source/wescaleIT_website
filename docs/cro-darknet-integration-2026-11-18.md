# CRO + Darknet: Integrationsentwurf und mobile QA

## Herkunft und konfliktfreie Review-Lösung

- Unveränderte Quelle CRO: Draft #25, b9b24039fc7e3acde3771ca0817e6574152ebc6c.
- Unveränderte Quelle Darknet: Draft #23, 7da1fee4664e0129fc55c957095d515183ae989e.
- Separater Branch cro/integration-darknet-nov18 startet auf #25. Keine Änderung der beiden Quellbranches, kein Git-/PR-Merge.
- Der vollständige Darknet-Abschnitt und die drei CSS-Regeln wurden exakt aus #23 übernommen. Reihenfolge: Hero mit CRO-CTA → Marken → Darknet-Quickcheck → Unternehmen. Link bleibt https://www.ciso2hero.com/darknet-scan. Keine Einbettung, kein Scan und kein neuer Drittanbieterabruf.
- Zusätzlich nur die während mobiler QA belegten Engstellen korrigiert: Kontaktkarten-Inhalt darf schrumpfen, lange Überschriften umbrechen; Footer-Markenlinks dürfen unter 760px umbrechen.
- Kontaktseite, Analytics, Consent-Code, Tally-Code und Datenschutz sind gegenüber #25 unverändert.

Review-Reihenfolge: zuerst #25 für die CRO-Änderungen und #23 für den Darknet-Inhalt lesen, danach den Integrations-Draft gegen main als gemeinsamen Kandidaten prüfen. Der neue Draft enthält beide Änderungen bereits; #23 und #25 danach nicht zusätzlich einzeln integrieren. Die Ursprungs-Drafts bleiben als Referenz offen. Nur nach gesonderter Freigabe überhaupt weitere Integrations-/Release-Schritte; hier wurde nichts gemergt, geschlossen, veröffentlicht oder per Auto-Merge freigegeben.

## Mobile Browser-QA

18. November 2026, Chrome über CUA, lokale Quellseiten. Testhülle mit gleichursprünglichem iframe, festen Breiten 320/390/430 und Höhe 844 CSS-Pixel. Das erzeugt echte schmale Layout-Viewports und aktiviert die bestehenden Media Queries. Keine Geräte-, Touch-, User-Agent-, DPR- oder Bildschirmtastatur-Emulation; kein Safari/iOS-Test. Die Hülle liegt ausschließlich im ignorierten dist-Verzeichnis und wird nicht mitgeliefert.

Chrome reserviert hier 15px für die vertikale Scrollbar: bei 320/390/430px Rahmenbreite ergibt documentElement.clientWidth 305/375/415px. documentElement.clientHeight nach Korrektur jeweils 844px.

| Seite/Zustand | Rahmenbreite × Höhe | clientWidth | scrollWidth | Ergebnis |
| --- | --- | --- | --- | --- |
| Startseite, vor Korrektur | 320 × 844 | 305 | 326 | 21px horizontaler Überlauf |
| Kontakt, vor Korrektur | 320 × 844 | 305 | 326 | 21px horizontaler Überlauf |
| Startseite, final | 320 × 844 | 305 | 305 | kein Überlauf |
| Startseite, final | 390 × 844 | 375 | 375 | kein Überlauf |
| Startseite, final | 430 × 844 | 415 | 415 | kein Überlauf |
| Kontakt, final | 320 × 844 | 305 | 305 | kein Überlauf |
| Kontakt, final | 390 × 844 | 375 | 375 | kein Überlauf |
| Kontakt, final | 430 × 844 | 415 | 415 | kein Überlauf |
| Kontakt mit geladenem Tally | 320 × 844 | 305 | 305 | kein Überlauf |

Weitere DOM-/UI-Ergebnisse:
- 320px: alle drei Markenkarten clientWidth = scrollWidth = 263px. Darknet-Abschnitt 305/305px, Überschrift 265/265px. Kein horizontaler Überlauf dieser Elemente.
- 390px: mobiles Menü öffnet und schließt; Startseiten-CTA navigiert zur Kontaktseite mit Formularanker.
- 320px: Cookie-Dialog clientWidth = scrollWidth = 265px, clientHeight = scrollHeight = 753px; beide Auswahlbuttons bedienbar.
- Vor Tally-Freigabe 0 eingebettete iframes. Statistik erlauben → weiterhin 0. Cookie-Einstellungen zeigen „Statistik erlaubt“. Danach „Ohne Statistik fortfahren“ gewählt.
- Separates „Formular laden“ trotz Statistik-Ablehnung → 1 iframe; Themenhilfe bleibt sichtbar. Inneres Tally-Dokument clientWidth = scrollWidth = 250px.
- „Formular deaktivieren“ → 0; erneut laden → 1; erneut deaktivieren → 0. Keine Formularfelder ausgefüllt, keine Anfrage gesendet.
- Darknet steht laut DOM unmittelbar nach brand-destinations und vor company-heading, exakt ein Link zum bestehenden FCTH-Scan. Kein Scan aufgerufen.

## Verifikation und Grenzen

Lokale Site-/Asset-/Fragment-Prüfung (12 Seiten), Authorship, Job-Schema, JS-Syntax aller Dateien, Analytics-, Kontaktformular- und Consent-Lifecycle-Tests (9 Lifecycle-Fälle) bestanden. Apache-Produktionsbuild und Cloudflare-Build samt jeweiliger SEO-Prüfung (11 Sitemap-URLs) bestanden. git diff --check bestanden. Quellvergleich bestätigt vollständige Übernahme des #23-Abschnitts und CSS sowie Erhalt sämtlicher #25-Dateien außerhalb der gezielten Ergänzungen.

Produktions-GA4-Netzwerkprüfung bleibt ausdrücklich OFFEN. localhost wird im unveränderten Analytics-Code nicht gemessen; die Dialog- und isolierten Codeprüfungen beweisen keine Netzwerkverarbeitung auf der Produktivdomain. Externe Tally-Texte und bestehende rechtliche/Kontoprüfpunkte bleiben beim Betreiber. Endungslose Hosting-Routen wurden über die Release-Checks geprüft; die UI-Prüfung verwendet lokale .html-Quellseiten.

Der frühere QA-Stand in cro-review-2026-11-18.md bleibt als Historie des unveränderten Drafts #25 erhalten. Die mobile Prüfung und die Konfliktlösung in diesem Dokument beziehen sich auf den separaten Integrationskandidaten.
