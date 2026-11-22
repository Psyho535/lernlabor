# Weg in den App Store

Stand: 20. November 2026. Diese Liste beschreibt, was für eine Veröffentlichung im Apple App Store schon da ist und was noch fehlt.

## Schon in der App

- **Abo-Gerüst „Pro“**
  - Gratis bleiben die Lernseiten, die OSI-Schichten, die Kapselung, die Fakten und die Programmier-Lektionen.
  - Pro schaltet frei: Quiz, Lernkarten, Rechentraining, Übungen, Tagesmix, die Probeprüfungen AP1 und AP2, das Terminal und die Programmier-Aufgaben. Die Liste steht in `PRO_VIEWS` in `index.html`.
- **Web-Version (GitHub Pages)**
  - Hier bleibt alles kostenlos, und der Abo-Bildschirm erscheint nicht.
  - Vorschau im Browser: `?shop=vorschau` an die Adresse hängen, zum Beenden `?shop=aus`. Die Preise sind dort Beispiele, und Kaufen ist gesperrt.
- **Abo-Bildschirm nach Apples Vorgaben**
  - Er zeigt, was Pro enthält, Preis und Laufzeit je Abo, die Testphase und den Hinweis zur automatischen Verlängerung (Kündigung bis 24 Stunden vor Ende über die Apple-ID).
  - Dazu gibt es „Käufe wiederherstellen“ und Links zu den Nutzungsbedingungen und zum Datenschutz.
- **Rechtstexte als Entwurf** (Einstellungen → Rechtliches)
  - Datenschutz, Nutzungsbedingungen mit Link zu Apples Standard-Lizenzvertrag, Impressum.
  - Sie erscheinen nur in der Vorschau und in der App, nicht in der Web-Version.

## Noch zu tun

1. **Rechtstexte fertigstellen**
   - Alle Platzhalter in eckigen Klammern ausfüllen: Name, Anschrift, E-Mail, Telefon, Stand.
   - Die Texte rechtlich prüfen lassen. Die Entwürfe ersetzen keine Rechtsberatung.
   - Danach den Entwurfshinweis (`LEGAL_DRAFT`) entfernen.
2. **Apple-Entwicklerkonto**
   - Das Apple Developer Program kostet 99 US-Dollar pro Jahr.
   - Wer in der EU verkauft, muss als „Trader“ Adresse, Telefon und E-Mail angeben. Apple zeigt diese Angaben öffentlich im App Store (EU Digital Services Act).
3. **App-Hülle bauen**
   - Die Web-App muss in eine native iPhone-App verpackt werden, zum Beispiel mit Capacitor.
   - Xcode läuft nur auf macOS. Ohne eigenen Mac geht das über einen Cloud-Build-Dienst.
4. **In-App-Kauf anbinden**
   - Die Hülle stellt `window.LernStore` bereit, mit `products()`, `buy(id)`, `restore()` und `isPro()`. Die genaue Beschreibung steht im Kommentar über `PRO_VIEWS`.
   - Produkt-IDs in App Store Connect: `pro_jahr` und `pro_monat`, beide in einer Abo-Gruppe.
5. **Abos in App Store Connect anlegen**
   - Preise, Testphase und Beschreibungen eintragen.
   - Ein Abo muss mindestens 7 Tage laufen und dauerhaften Nutzen bieten (Richtlinie 3.1.2).
6. **Datenschutzangaben in App Store Connect**
   - Dort angeben, welche Daten die App erhebt. Laut Entwurf sind es keine Konten, keine Analyse und kein Tracking.
   - Fremde Server: Google Fonts, jsDelivr (Python), cdnjs (SQL).
   - Besser: Schriften und Laufzeiten direkt in die App packen. Dann entfallen diese Verbindungen, und die App läuft vollständig offline.
7. **Screenshots, Beschreibung, Altersfreigabe, Support-Adresse**

## Risiken bei der Prüfung durch Apple

- **Richtlinie 4.2 (Mindestfunktion):** Apple verlangt mehr als eine verpackte Webseite. Native Extras senken das Risiko einer Ablehnung, zum Beispiel:
  - Erinnerungen per Mitteilung an fällige Karten
  - spürbares Haptik-Feedback
  - ein Widget mit dem Tagesziel
- **Richtlinie 2.5.2 (geladener Code):** Python und SQL laden Laufzeiten aus dem Netz. Für Lern-Apps gibt es eine Ausnahme, wenn der Code für Nutzer vollständig sichtbar und bearbeitbar ist. Der Programmier-Bereich darf höchstens 80 % des Bildschirms einnehmen und muss klar als Programmierumgebung erkennbar sein. Sicherer ist es, die Laufzeiten in die App zu packen.
- **Provision:** Apple behält normalerweise 30 %. Im App Store Small Business Program sind es 15 %, solange der Umsatz unter 1 Mio. US-Dollar im Jahr bleibt. Für Brasilien, die EU, Japan, die Niederlande, Russland und Südkorea können andere Sätze gelten.

## Quellen

- [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Apple Developer Program](https://developer.apple.com/programs/)
- [App Store Small Business Program](https://developer.apple.com/app-store/small-business-program/)
- [EU Digital Services Act: Trader-Angaben](https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-trader-requirements/)
- [Apple Standard-Lizenzvertrag (EULA)](https://www.apple.com/legal/internet-services/itunes/dev/stdeula/)
