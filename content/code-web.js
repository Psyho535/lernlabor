/*! IT-Lernlabor · © 2026 Alexander S. · Alle Rechte vorbehalten. Nutzung nur nach LICENSE. */
/* Programmieren: HTML und CSS. Die Vorschau läuft in einem abgeschotteten Frame.
   Aufgaben werden geprüft, indem die App die fertige Seite untersucht (Elemente, Texte, berechnete Stile). */
(window.LERN_CODE = window.LERN_CODE || []).push({
  id:"web", title:"HTML und CSS", badge:"&lt;/&gt;", color:"#ff375f",
  sub:"Webseiten aufbauen und gestalten",
  version:"HTML Living Standard und CSS",
  why:"Weboberflächen begegnen dir überall in der IT: Router, Drucker, Firewalls und Monitoring-Tools werden per Browser bedient. Wer HTML und CSS lesen kann, versteht diese Oberflächen und kann einfache Infoseiten selbst bauen.",
  easy:"HTML ist das Gerüst eines Hauses: Wände, Türen, Räume. Es sagt, was eine Überschrift, ein Absatz oder eine Tabelle ist. CSS ist die Einrichtung: Farben, Abstände, Schriften. Erst beides zusammen ergibt eine schöne Webseite.",
  starter:`<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>Meine Seite</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 24px; }
    h1 { color: #0a84ff; }
  </style>
</head>
<body>
  <h1>Hallo Web!</h1>
  <p>Ändere den Code und tippe auf Ausführen.</p>
</body>
</html>
`,
  sources:[
    ["MDN: HTML-Grundlagen", "https://developer.mozilla.org/de/docs/Learn_web_development/Core/Structuring_content"],
    ["MDN: CSS-Grundlagen", "https://developer.mozilla.org/de/docs/Learn_web_development/Core/Styling_basics"],
    ["HTML Living Standard (WHATWG)", "https://html.spec.whatwg.org/multipage/"]
  ],
  lessons:[
    {id:"grundgeruest", title:"Das HTML-Grundgerüst", sum:"Elemente, Tags, Verschachtelung und der Aufbau jeder Seite.", task:"erste-seite",
      easy:"HTML besteht aus Etiketten, den Tags. Ein Text zwischen <h1> und </h1> ist eine Überschrift, zwischen <p> und </p> ein Absatz. Der Browser liest die Etiketten und weiß dadurch, wie er den Inhalt darstellen soll.",
      sec:[
        {p:"Ein HTML-<i>Element</i> besteht meist aus einem Start-Tag, Inhalt und einem End-Tag: <code>&lt;p&gt;Text&lt;/p&gt;</code>. Elemente stehen ineinander, wie Schachteln in Schachteln. Jede Seite hat dieselbe Grundstruktur."},
        {run:`<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>Helpdesk</title>
</head>
<body>
  <h1>IT-Helpdesk</h1>
  <p>Wir helfen bei allen Fragen rund um Hardware und Software.</p>
</body>
</html>`},
        {h:"Die Teile", list:["<code>&lt;!DOCTYPE html&gt;</code>: sagt dem Browser, dass es modernes HTML ist", "<code>&lt;html lang=\"de\"&gt;</code>: die ganze Seite, mit Sprache Deutsch", "<code>&lt;head&gt;</code>: Informationen über die Seite, etwa Zeichensatz und Titel, nicht sichtbar im Inhalt", "<code>&lt;meta charset=\"utf-8\"&gt;</code>: damit Umlaute richtig erscheinen", "<code>&lt;title&gt;</code>: Text im Browser-Tab", "<code>&lt;body&gt;</code>: alles, was auf der Seite zu sehen ist"]},
        {h:"Attribute", p:"Start-Tags können <i>Attribute</i> haben, die das Element genauer beschreiben: <code>&lt;html lang=\"de\"&gt;</code>. Der Wert steht in Anführungszeichen."},
        {tip:"Einige Elemente haben kein End-Tag, zum Beispiel <code>&lt;meta&gt;</code>, <code>&lt;br&gt;</code> und <code>&lt;img&gt;</code>. Man nennt sie leere Elemente."},
        {warn:"Schließe Elemente in umgekehrter Reihenfolge, wie du sie geöffnet hast: <code>&lt;p&gt;&lt;strong&gt;wichtig&lt;/strong&gt;&lt;/p&gt;</code>, nicht <code>&lt;p&gt;&lt;strong&gt;wichtig&lt;/p&gt;&lt;/strong&gt;</code>."}
      ],
      src:[["MDN: Grundlegende HTML-Syntax", "https://developer.mozilla.org/de/docs/Learn_web_development/Core/Structuring_content/Basic_HTML_syntax"], ["MDN: Element &lt;head&gt;", "https://developer.mozilla.org/de/docs/Web/HTML/Reference/Elements/head"]]},
    {id:"text", title:"Überschriften, Absätze und Listen", sum:"h1 bis h6, p, strong, em und Listen.", task:"liste",
      easy:"Überschriften gibt es in sechs Größen, wie Kapitel und Unterkapitel in einem Buch. Listen gibt es als Aufzählung mit Punkten oder als nummerierte Schritte.",
      sec:[
        {p:"<code>&lt;h1&gt;</code> bis <code>&lt;h6&gt;</code> sind Überschriften, <code>h1</code> die wichtigste. Sie bilden eine Gliederung: Auf <code>h1</code> folgt <code>h2</code>, nicht gleich <code>h4</code>. <code>&lt;p&gt;</code> ist ein Absatz. <code>&lt;strong&gt;</code> markiert Wichtiges, <code>&lt;em&gt;</code> betont."},
        {run:`<h1>Netzwerkdrucker einrichten</h1>
<p>Diese Anleitung gilt für alle Drucker im <strong>3. Obergeschoss</strong>.</p>
<h2>Voraussetzungen</h2>
<ul>
  <li>Benutzerkonto in der Domäne</li>
  <li>Verbindung zum Firmennetz</li>
</ul>
<h2>Schritte</h2>
<ol>
  <li>Einstellungen öffnen</li>
  <li>Drucker hinzufügen wählen</li>
  <li>Drucker <em>DR-3OG-01</em> auswählen</li>
</ol>`},
        {h:"Listen", table:{head:["Element", "Bedeutung"], rows:[["<code>&lt;ul&gt;</code>", "ungeordnete Liste mit Punkten"], ["<code>&lt;ol&gt;</code>", "nummerierte Liste"], ["<code>&lt;li&gt;</code>", "ein Listeneintrag, steht in <code>ul</code> oder <code>ol</code>"]]}},
        {tip:"Der Browser fasst mehrere Leerzeichen und Zeilenumbrüche im Code zu einem Leerzeichen zusammen. Einen neuen Absatz erzeugst du mit <code>&lt;p&gt;</code>."}
      ],
      src:[["MDN: Überschriften und Absätze", "https://developer.mozilla.org/de/docs/Learn_web_development/Core/Structuring_content/Headings_and_paragraphs"], ["MDN: Listen", "https://developer.mozilla.org/de/docs/Learn_web_development/Core/Structuring_content/Lists"]]},
    {id:"links-bilder", title:"Links und Bilder", sum:"a mit href, img mit src und alt.", task:"link-bild",
      easy:"Ein Link ist eine Tür zu einer anderen Seite. Das Ziel steht im Attribut href. Ein Bild wird mit img eingebunden. Der alt-Text beschreibt das Bild für Menschen, die es nicht sehen können.",
      sec:[
        {p:"Ein Link entsteht mit <code>&lt;a href=\"ziel\"&gt;Linktext&lt;/a&gt;</code>. Das Ziel kann eine vollständige Adresse sein oder ein Pfad zu einer Datei auf derselben Website. In der Vorschau öffnen sich Links nicht, das Terminal zeigt nur an, wohin sie führen."},
        {run:`<p>Aktuelle Warnungen veröffentlicht das
  <a href="https://www.bsi.bund.de/">Bundesamt für Sicherheit in der Informationstechnik</a>.</p>
<p><a href="anleitungen/vpn.html">VPN-Anleitung</a> (relativer Pfad)</p>
<p><a href="mailto:helpdesk@example.com">Mail an den Helpdesk</a></p>
<img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='80'><rect width='120' height='80' rx='12' fill='%230a84ff'/><text x='60' y='48' font-size='20' text-anchor='middle' fill='white'>LAN</text></svg>" alt="Blaues Symbol mit der Aufschrift LAN" width="120">`},
        {h:"Bilder", p:"<code>&lt;img&gt;</code> hat kein End-Tag. <code>src</code> nennt die Bilddatei, <code>alt</code> einen Ersatztext. Er erscheint, wenn das Bild nicht lädt, und Screenreader lesen ihn vor."},
        {warn:"Ohne <code>alt</code> ist eine Seite für blinde Menschen schwer zu benutzen. Barrierefreiheit ist für Websites öffentlicher Stellen gesetzlich vorgeschrieben, seit Juni 2025 nach dem Barrierefreiheitsstärkungsgesetz auch für viele Online-Angebote von Unternehmen."},
        {tip:"<code>example.com</code> ist eine Domain, die laut RFC 2606 für Beispiele reserviert ist. Sie eignet sich deshalb gut für Übungen."}
      ],
      src:[["MDN: Hyperlinks erstellen", "https://developer.mozilla.org/de/docs/Learn_web_development/Core/Structuring_content/Creating_links"], ["MDN: Element &lt;img&gt;", "https://developer.mozilla.org/de/docs/Web/HTML/Reference/Elements/img"], ["RFC 2606: Reserved Top Level DNS Names", "https://www.rfc-editor.org/rfc/rfc2606"]]},
    {id:"tabellen", title:"Tabellen", sum:"table, tr, th und td für tabellarische Daten.", task:"tabelle",
      easy:"Eine HTML-Tabelle baust du Zeile für Zeile. Jede Zeile ist ein tr, darin stehen Zellen: th für Überschriften, td für normale Daten.",
      sec:[
        {p:"Tabellen sind für Daten mit Zeilen und Spalten gedacht, etwa eine Geräteliste. <code>&lt;tr&gt;</code> ist eine Zeile, <code>&lt;th&gt;</code> eine Kopfzelle, <code>&lt;td&gt;</code> eine Datenzelle. <code>&lt;thead&gt;</code> und <code>&lt;tbody&gt;</code> trennen Kopf und Inhalt."},
        {run:`<style>
  table { border-collapse: collapse; font-family: system-ui, sans-serif; }
  th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
  th { background: #f0f0f3; }
</style>
<table>
  <caption>Geräte im Raum 204</caption>
  <thead>
    <tr><th>Gerät</th><th>IP-Adresse</th><th>Status</th></tr>
  </thead>
  <tbody>
    <tr><td>PC-01</td><td>10.0.4.11</td><td>online</td></tr>
    <tr><td>PC-02</td><td>10.0.4.12</td><td>offline</td></tr>
    <tr><td>Drucker</td><td>10.0.4.50</td><td>online</td></tr>
  </tbody>
</table>`},
        {tip:"<code>&lt;caption&gt;</code> gibt der Tabelle eine Beschriftung, die auch Screenreader vorlesen."},
        {warn:"Nutze Tabellen nicht für das Layout einer Seite. Dafür gibt es CSS, etwa Flexbox."}
      ],
      src:[["MDN: HTML-Tabellen-Grundlagen", "https://developer.mozilla.org/de/docs/Learn_web_development/Core/Structuring_content/HTML_table_basics"], ["MDN: Element &lt;table&gt;", "https://developer.mozilla.org/de/docs/Web/HTML/Reference/Elements/table"]]},
    {id:"formulare", title:"Formulare", sum:"form, label, input, select und button.", task:"formular",
      easy:"Ein Formular ist wie ein Papierformular am Empfang: Es hat beschriftete Felder, in die man etwas einträgt, und einen Knopf zum Abschicken. label ist die Beschriftung, input das Feld.",
      sec:[
        {p:"<code>&lt;form&gt;</code> umschließt die Felder. Jedes Feld bekommt ein <code>&lt;label&gt;</code>. Über <code>for</code> und <code>id</code> gehören Beschriftung und Feld zusammen, dann reicht ein Tipp auf die Beschriftung, um ins Feld zu springen. Das Attribut <code>name</code> bestimmt, unter welchem Namen der Wert verschickt wird."},
        {run:`<form>
  <p>
    <label for="name">Name</label><br>
    <input id="name" name="name" type="text" required>
  </p>
  <p>
    <label for="mail">E-Mail</label><br>
    <input id="mail" name="mail" type="email" required>
  </p>
  <p>
    <label for="prio">Priorität</label><br>
    <select id="prio" name="prio">
      <option>niedrig</option>
      <option selected>mittel</option>
      <option>hoch</option>
    </select>
  </p>
  <button type="submit">Ticket senden</button>
</form>`},
        {h:"Typen von input", table:{head:["type", "Wofür"], rows:[["<code>text</code>", "einzeiliger Text"], ["<code>email</code>", "E-Mail-Adresse, wird geprüft"], ["<code>password</code>", "Eingabe wird verdeckt"], ["<code>number</code>", "Zahl"], ["<code>checkbox</code>", "Häkchen an oder aus"], ["<code>date</code>", "Datum"]]}},
        {tip:"<code>required</code> verhindert das Abschicken, solange das Feld leer ist. Diese Prüfung im Browser ersetzt aber nie die Prüfung auf dem Server."}
      ],
      src:[["MDN: Ihr erstes Formular", "https://developer.mozilla.org/de/docs/Learn_web_development/Extensions/Forms/Your_first_form"], ["MDN: Element &lt;input&gt;", "https://developer.mozilla.org/de/docs/Web/HTML/Reference/Elements/input"], ["MDN: Element &lt;label&gt;", "https://developer.mozilla.org/de/docs/Web/HTML/Reference/Elements/label"]]},
    {id:"css-grundlagen", title:"CSS-Grundlagen", sum:"Selektoren, Eigenschaften, Farben und Schriften.", task:"css",
      easy:"CSS sagt dem Browser, wie etwas aussehen soll. Eine Regel besteht aus zwei Teilen: Wen soll es treffen (der Selektor) und was soll sich ändern (Eigenschaft und Wert).",
      sec:[
        {p:"Eine CSS-Regel hat einen <i>Selektor</i> und in geschweiften Klammern Deklarationen der Form <code>eigenschaft: wert;</code>. Im Lernlabor schreibst du CSS in ein <code>&lt;style&gt;</code>-Element. Auf echten Websites liegt es meist in einer eigenen Datei, eingebunden mit <code>&lt;link rel=\"stylesheet\" href=\"style.css\"&gt;</code>."},
        {run:`<style>
  body { font-family: system-ui, sans-serif; background: #f5f5f7; }
  h1 { color: #ff375f; font-size: 28px; }
  .warnung { background: #fff3cd; padding: 8px 12px; border-radius: 8px; }
  #wartung { font-weight: bold; }
</style>
<h1>Status</h1>
<p class="warnung">Der Mailserver ist langsam.</p>
<p class="warnung" id="wartung">Wartung am Samstag ab 18 Uhr.</p>
<p>Alle anderen Dienste laufen normal.</p>`},
        {h:"Selektoren", table:{head:["Selektor", "Trifft"], rows:[["<code>p</code>", "alle p-Elemente"], ["<code>.warnung</code>", "alle Elemente mit <code>class=\"warnung\"</code>"], ["<code>#wartung</code>", "das Element mit <code>id=\"wartung\"</code>"], ["<code>nav a</code>", "alle a-Elemente innerhalb von nav"], ["<code>h1, h2</code>", "h1 und h2"]]}},
        {h:"Farben", p:"Farben kannst du als Namen (<code>red</code>), als Hexwert (<code>#ff375f</code>) oder mit <code>rgb(255, 55, 95)</code> angeben."},
        {tip:"Treffen mehrere Regeln dasselbe Element, gewinnt die spezifischere: Eine ID schlägt eine Klasse, eine Klasse schlägt einen Elementnamen. Bei Gleichstand gewinnt die spätere Regel. Das nennt man Kaskade."}
      ],
      src:[["MDN: CSS-Grundlagen", "https://developer.mozilla.org/de/docs/Learn_web_development/Core/Styling_basics/What_is_CSS"], ["MDN: CSS-Selektoren", "https://developer.mozilla.org/de/docs/Web/CSS/CSS_selectors"], ["MDN: Spezifität", "https://developer.mozilla.org/de/docs/Web/CSS/Specificity"]]},
    {id:"box-modell", title:"Das Box-Modell", sum:"Inhalt, padding, border und margin.", task:"karte",
      easy:"Jedes Element ist eine Kiste. Innen liegt der Inhalt, darum herum das Polster (padding), dann der Rand (border) und außen der Abstand zu den Nachbarn (margin).",
      sec:[
        {p:"Jedes Element ist ein Rechteck aus vier Schichten: Inhalt, Innenabstand (<code>padding</code>), Rahmen (<code>border</code>) und Außenabstand (<code>margin</code>)."},
        {run:`<style>
  .box {
    width: 220px;
    padding: 16px;
    border: 4px solid #0a84ff;
    margin: 20px;
    background: #e8f2ff;
  }
  .alles-drin { box-sizing: border-box; }
</style>
<div class="box">Breite 220px plus padding und border</div>
<div class="box alles-drin">Mit border-box ist die Box genau 220px breit</div>`},
        {h:"box-sizing", p:"Normalerweise gilt <code>width</code> nur für den Inhalt, padding und border kommen dazu. Mit <code>box-sizing: border-box</code> zählen sie mit. Viele Seiten setzen das deshalb für alle Elemente."},
        {h:"Kurzschreibweisen", list:["<code>margin: 10px</code>: alle vier Seiten", "<code>margin: 10px 20px</code>: oben und unten 10px, links und rechts 20px", "<code>padding: 4px 8px 12px 16px</code>: oben, rechts, unten, links im Uhrzeigersinn", "<code>margin: 0 auto</code>: zentriert einen Block mit fester Breite"]}
      ],
      src:[["MDN: Das Box-Modell", "https://developer.mozilla.org/de/docs/Learn_web_development/Core/Styling_basics/Box_model"], ["MDN: box-sizing", "https://developer.mozilla.org/de/docs/Web/CSS/box-sizing"]]},
    {id:"flexbox", title:"Layout mit Flexbox", sum:"Elemente nebeneinander anordnen, verteilen und ausrichten.", task:"flex",
      easy:"Flexbox ist wie ein Regalbrett: Alle Elemente stehen nebeneinander, und du bestimmst, ob sie links, mittig oder gleichmäßig verteilt stehen und wie viel Platz dazwischen bleibt.",
      sec:[
        {p:"Mit <code>display: flex</code> werden die direkten Kinder eines Elements nebeneinander angeordnet. <code>gap</code> legt den Abstand fest, <code>justify-content</code> die Verteilung in der Hauptrichtung, <code>align-items</code> die Ausrichtung quer dazu."},
        {run:`<style>
  .leiste { display: flex; gap: 12px; justify-content: space-between; align-items: center;
            padding: 12px; background: #1c1c1e; color: white; border-radius: 12px; }
  .karten { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px; }
  .karte { flex: 1 1 140px; padding: 16px; border-radius: 12px; background: #f2f2f7; }
</style>
<div class="leiste"><b>Monitoring</b><span>3 Warnungen</span></div>
<div class="karten">
  <div class="karte">CPU 37 %</div>
  <div class="karte">RAM 68 %</div>
  <div class="karte">Netz 120 Mbit/s</div>
</div>`},
        {h:"Wichtige Eigenschaften", table:{head:["Eigenschaft", "Werte", "Wirkung"], rows:[["<code>flex-direction</code>", "<code>row</code>, <code>column</code>", "Richtung: nebeneinander oder untereinander"], ["<code>justify-content</code>", "<code>flex-start</code>, <code>center</code>, <code>space-between</code>", "Verteilung in der Hauptrichtung"], ["<code>align-items</code>", "<code>stretch</code>, <code>center</code>", "Ausrichtung quer zur Hauptrichtung"], ["<code>flex-wrap</code>", "<code>wrap</code>", "in die nächste Zeile umbrechen"], ["<code>flex</code>", "<code>1 1 140px</code>", "wachsen, schrumpfen, Grundbreite"]]}},
        {tip:"Mit <code>flex-wrap: wrap</code> und einer Grundbreite passen sich Karten von allein an schmale Bildschirme an."}
      ],
      src:[["MDN: Flexbox", "https://developer.mozilla.org/de/docs/Learn_web_development/Core/CSS_layout/Flexbox"], ["MDN: display", "https://developer.mozilla.org/de/docs/Web/CSS/display"]]},
    {id:"semantik", title:"Semantik und Barrierefreiheit", sum:"header, nav, main, footer und eine Seite fürs Handy.", task:"semantik",
      easy:"Semantische Elemente sind wie Schilder in einem Gebäude: Eingang, Flur, Hauptraum, Ausgang. Für Menschen mit Screenreader und für Suchmaschinen ist so sofort klar, welcher Teil der Seite was ist.",
      sec:[
        {p:"Statt alles in <code>&lt;div&gt;</code> zu packen, gibt es Elemente mit Bedeutung. Sie sehen ohne CSS gleich aus, helfen aber Screenreadern, Suchmaschinen und anderen Entwicklern."},
        {run:`<style>
  body { font-family: system-ui, sans-serif; margin: 0; }
  header, footer { background: #1c1c1e; color: white; padding: 12px 16px; }
  nav a { color: #64d2ff; margin-right: 12px; }
  main { padding: 16px; }
  @media (max-width: 500px) { nav a { display: block; margin: 4px 0; } }
</style>
<header>
  <b>IT-Abteilung</b>
  <nav><a href="#status">Status</a><a href="#kontakt">Kontakt</a></nav>
</header>
<main>
  <section id="status">
    <h1>Systemstatus</h1>
    <article><h2>Mailserver</h2><p>Läuft ohne Störung.</p></article>
  </section>
</main>
<footer id="kontakt">Helpdesk: Durchwahl 4711</footer>`},
        {h:"Die wichtigsten Elemente", table:{head:["Element", "Bedeutung"], rows:[["<code>&lt;header&gt;</code>", "Kopfbereich der Seite oder eines Abschnitts"], ["<code>&lt;nav&gt;</code>", "Navigation"], ["<code>&lt;main&gt;</code>", "Hauptinhalt, nur einmal pro Seite"], ["<code>&lt;section&gt;</code>", "thematischer Abschnitt, meist mit Überschrift"], ["<code>&lt;article&gt;</code>", "eigenständiger Inhalt, etwa eine Meldung"], ["<code>&lt;footer&gt;</code>", "Fußbereich"]]}},
        {h:"Für das Handy", p:"Damit eine Seite auf dem Smartphone nicht winzig erscheint, gehört <code>&lt;meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"&gt;</code> in den head. Mit <code>@media</code>-Regeln passt du das Layout an schmale Bildschirme an."}
      ],
      src:[["MDN: Dokument- und Website-Struktur", "https://developer.mozilla.org/de/docs/Learn_web_development/Core/Structuring_content/Structuring_documents"], ["MDN: Media Queries", "https://developer.mozilla.org/de/docs/Web/CSS/CSS_media_queries/Using_media_queries"], ["MDN: Barrierefreiheit", "https://developer.mozilla.org/de/docs/Learn_web_development/Core/Accessibility"]]}
  ],
  tasks:[
    {id:"erste-seite", level:1, lesson:"grundgeruest", title:"Erste Seite",
      text:"<p>Baue eine vollständige HTML-Seite mit Grundgerüst. Sie soll eine Überschrift <code>h1</code> mit dem Text <code>Willkommen</code> und darunter einen Absatz mit beliebigem Text enthalten. Der Titel im Tab soll <code>Startseite</code> lauten.</p>",
      start:`<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
</head>
<body>

</body>
</html>
`,
      checks:[
        {label:"Es gibt eine h1-Überschrift „Willkommen“", test:`document.querySelector("h1") && document.querySelector("h1").textContent.trim() === "Willkommen"`},
        {label:"Es gibt einen Absatz mit Text", test:`[...document.querySelectorAll("p")].some(p => p.textContent.trim().length > 0)`},
        {label:"Der Titel lautet „Startseite“", test:`document.title.trim() === "Startseite"`}
      ],
      hints:["Der Titel gehört als <code>&lt;title&gt;Startseite&lt;/title&gt;</code> in den <code>head</code>.", "Überschrift und Absatz kommen in den <code>body</code>."],
      solution:`<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>Startseite</title>
</head>
<body>
  <h1>Willkommen</h1>
  <p>Schön, dass du da bist.</p>
</body>
</html>`},
    {id:"liste", level:1, lesson:"text", title:"Hardware-Liste",
      text:"<p>Erstelle eine Überschrift <code>h2</code> mit dem Text <code>Komponenten</code> und darunter eine ungeordnete Liste mit mindestens vier Hardware-Komponenten eines PCs.</p>",
      start:`<!-- Überschrift und Liste -->
`,
      checks:[
        {label:"h2 mit dem Text „Komponenten“", test:`[...document.querySelectorAll("h2")].some(h => h.textContent.trim() === "Komponenten")`},
        {label:"Eine ungeordnete Liste (ul)", test:`!!document.querySelector("ul")`},
        {label:"Mindestens vier Einträge in der Liste", test:`document.querySelector("ul") && document.querySelectorAll("ul > li").length >= 4`},
        {label:"Kein Eintrag ist leer", test:`[...document.querySelectorAll("ul > li")].length > 0 && [...document.querySelectorAll("ul > li")].every(li => li.textContent.trim())`}
      ],
      hints:["Eine ungeordnete Liste: <code>&lt;ul&gt;</code> mit mehreren <code>&lt;li&gt;</code> darin.", "Komponenten sind zum Beispiel Prozessor, Arbeitsspeicher, SSD, Netzteil, Mainboard."],
      solution:`<h2>Komponenten</h2>
<ul>
  <li>Prozessor</li>
  <li>Arbeitsspeicher</li>
  <li>SSD</li>
  <li>Netzteil</li>
</ul>`},
    {id:"link-bild", level:1, lesson:"links-bilder", title:"Link und Bild",
      text:"<p>Füge einen Link mit dem Text <code>BSI</code> ein, der auf <code>https://www.bsi.bund.de/</code> zeigt. Füge außerdem ein Bild ein, das einen aussagekräftigen Alternativtext mit mindestens 5 Zeichen hat. Als Bildquelle kannst du <code>logo.png</code> verwenden.</p>",
      start:`<p>Infos zur IT-Sicherheit:</p>
`,
      checks:[
        {label:"Link mit dem Text „BSI“", test:`[...document.querySelectorAll("a")].some(a => a.textContent.trim() === "BSI")`},
        {label:"Der Link zeigt auf https://www.bsi.bund.de/", test:`[...document.querySelectorAll("a")].some(a => a.textContent.trim() === "BSI" && /^https:\\/\\/www\\.bsi\\.bund\\.de\\/?$/.test(a.getAttribute("href") || ""))`},
        {label:"Ein Bild ist eingebunden", test:`!!document.querySelector("img[src]")`},
        {label:"Das Bild hat einen Alternativtext mit mindestens 5 Zeichen", test:`[...document.querySelectorAll("img")].some(i => (i.getAttribute("alt") || "").trim().length >= 5)`}
      ],
      hints:["Ein Link: <code>&lt;a href=\"https://www.bsi.bund.de/\"&gt;BSI&lt;/a&gt;</code>", "Ein Bild: <code>&lt;img src=\"logo.png\" alt=\"...\"&gt;</code> ohne End-Tag."],
      solution:`<p>Infos zur IT-Sicherheit:</p>
<p><a href="https://www.bsi.bund.de/">BSI</a></p>
<img src="logo.png" alt="Logo der IT-Abteilung">`},
    {id:"tabelle", level:2, lesson:"tabellen", title:"Geräteliste als Tabelle",
      text:"<p>Erstelle eine Tabelle mit einer Kopfzeile aus den Kopfzellen <code>Gerät</code> und <code>IP-Adresse</code> und mindestens zwei Datenzeilen mit je zwei Zellen.</p>",
      start:`<table>

</table>
`,
      checks:[
        {label:"Eine Tabelle ist vorhanden", test:`!!document.querySelector("table")`},
        {label:"Kopfzellen „Gerät“ und „IP-Adresse“", test:`(() => { const t = [...document.querySelectorAll("th")].map(x => x.textContent.trim()); return t.includes("Gerät") && t.includes("IP-Adresse"); })()`},
        {label:"Mindestens zwei Zeilen mit je zwei td-Zellen", test:`[...document.querySelectorAll("tr")].filter(r => r.querySelectorAll("td").length >= 2).length >= 2`}
      ],
      hints:["Jede Zeile ist ein <code>&lt;tr&gt;</code>. Die Kopfzeile enthält <code>&lt;th&gt;</code>, die anderen Zeilen <code>&lt;td&gt;</code>.", "Beispielzeile: <code>&lt;tr&gt;&lt;td&gt;PC-01&lt;/td&gt;&lt;td&gt;10.0.0.11&lt;/td&gt;&lt;/tr&gt;</code>"],
      solution:`<table>
  <tr><th>Gerät</th><th>IP-Adresse</th></tr>
  <tr><td>PC-01</td><td>10.0.0.11</td></tr>
  <tr><td>Drucker</td><td>10.0.0.50</td></tr>
</table>`},
    {id:"formular", level:2, lesson:"formulare", title:"Kontaktformular",
      text:"<p>Baue ein Formular mit einem Pflichtfeld für eine E-Mail-Adresse. Das Feld soll vom Typ <code>email</code> sein, ein <code>label</code> haben, das über <code>for</code> und <code>id</code> damit verbunden ist, und einen <code>name</code>. Dazu gehört ein Button zum Absenden.</p>",
      start:`<form>

</form>
`,
      checks:[
        {label:"Eingabefeld vom Typ email", test:`!!document.querySelector("form input[type=email]")`},
        {label:"Das Feld ist ein Pflichtfeld (required)", test:`!!document.querySelector("form input[type=email][required]")`},
        {label:"Das Feld hat einen name", test:`!!(document.querySelector("form input[type=email]") && document.querySelector("form input[type=email]").name)`},
        {label:"Ein label ist über for und id mit dem Feld verbunden", test:`(() => { const i = document.querySelector("form input[type=email]"); return !!(i && i.id && document.querySelector('label[for="' + i.id + '"]')); })()`},
        {label:"Ein Button zum Absenden", test:`!!document.querySelector("form button, form input[type=submit]")`}
      ],
      hints:["<code>&lt;label for=\"mail\"&gt;E-Mail&lt;/label&gt;</code> gehört zu <code>&lt;input id=\"mail\" ...&gt;</code>.", "Ein Pflichtfeld bekommt das Attribut <code>required</code>.", "Teste das Absenden in der Vorschau: Das Terminal zeigt die gesendeten Werte."],
      solution:`<form>
  <label for="mail">E-Mail</label>
  <input id="mail" name="mail" type="email" required>
  <button type="submit">Absenden</button>
</form>`},
    {id:"css", level:2, lesson:"css-grundlagen", title:"Erste Styles",
      text:"<p>Gestalte die vorhandene Seite mit CSS: Die Überschrift <code>h1</code> soll die Farbe <code>blue</code> bekommen. Alle Elemente mit der Klasse <code>hinweis</code> sollen einen gelben Hintergrund (<code>yellow</code>) haben. Ändere dafür nur das <code>style</code>-Element.</p>",
      start:`<style>

</style>
<h1>Wartungsfenster</h1>
<p class="hinweis">Samstag 18 bis 22 Uhr</p>
<p>Bitte vorher speichern.</p>
`,
      checks:[
        {label:"h1 ist blau", test:`getComputedStyle(document.querySelector("h1")).color === "rgb(0, 0, 255)"`},
        {label:"Elemente mit der Klasse hinweis haben einen gelben Hintergrund", test:`getComputedStyle(document.querySelector(".hinweis")).backgroundColor === "rgb(255, 255, 0)"`},
        {label:"Der normale Absatz bleibt ohne Hintergrund", test:`getComputedStyle(document.querySelectorAll("p")[1]).backgroundColor === "rgba(0, 0, 0, 0)"`}
      ],
      hints:["Ein Klassenselektor beginnt mit einem Punkt: <code>.hinweis { ... }</code>", "Die Eigenschaften heißen <code>color</code> und <code>background-color</code>."],
      solution:`<style>
  h1 { color: blue; }
  .hinweis { background-color: yellow; }
</style>
<h1>Wartungsfenster</h1>
<p class="hinweis">Samstag 18 bis 22 Uhr</p>
<p>Bitte vorher speichern.</p>`},
    {id:"karte", level:2, lesson:"box-modell", title:"Statuskarte",
      text:"<p>Gestalte das Element mit der Klasse <code>karte</code>: Innenabstand 16px auf allen Seiten, ein 2px breiter durchgehender Rahmen (solid) in beliebiger Farbe, ein Außenabstand von 24px und eine Breite von genau 300px einschließlich Innenabstand und Rahmen.</p>",
      start:`<style>
  .karte {

  }
</style>
<div class="karte">Backup: erfolgreich, 23:14 Uhr</div>
`,
      checks:[
        {label:"Innenabstand 16px", test:`(() => { const s = getComputedStyle(document.querySelector(".karte")); return ["Top", "Right", "Bottom", "Left"].every(x => s["padding" + x] === "16px"); })()`},
        {label:"Rahmen 2px solid", test:`(() => { const s = getComputedStyle(document.querySelector(".karte")); return s.borderTopWidth === "2px" && s.borderTopStyle === "solid" && s.borderLeftWidth === "2px"; })()`},
        {label:"Außenabstand 24px", test:`getComputedStyle(document.querySelector(".karte")).marginLeft === "24px"`},
        {label:"Gesamtbreite genau 300px", test:`Math.round(document.querySelector(".karte").getBoundingClientRect().width) === 300`}
      ],
      hints:["<code>padding: 16px;</code> und <code>margin: 24px;</code>", "Der Rahmen: <code>border: 2px solid #0a84ff;</code>", "Damit padding und border in die Breite eingerechnet werden: <code>box-sizing: border-box;</code> und <code>width: 300px;</code>"],
      solution:`<style>
  .karte {
    box-sizing: border-box;
    width: 300px;
    padding: 16px;
    border: 2px solid #0a84ff;
    margin: 24px;
  }
</style>
<div class="karte">Backup: erfolgreich, 23:14 Uhr</div>`},
    {id:"flex", level:3, lesson:"flexbox", title:"Dashboard mit Flexbox",
      text:"<p>Ordne die drei Kacheln im Container <code>.kacheln</code> mit Flexbox nebeneinander an. Zwischen den Kacheln sollen 12px Abstand sein, und die Kacheln sollen vertikal mittig ausgerichtet werden.</p>",
      start:`<style>
  .kacheln {

  }
  .kachel { padding: 12px; background: #f2f2f7; border-radius: 10px; }
</style>
<div class="kacheln">
  <div class="kachel">CPU<br>37 %</div>
  <div class="kachel">RAM</div>
  <div class="kachel">Disk<br>81 %<br>!</div>
</div>
`,
      checks:[
        {label:"Der Container nutzt display: flex", test:`getComputedStyle(document.querySelector(".kacheln")).display === "flex"`},
        {label:"Abstand 12px zwischen den Kacheln", test:`(() => { const s = getComputedStyle(document.querySelector(".kacheln")); return s.columnGap === "12px"; })()`},
        {label:"Die Kacheln stehen nebeneinander", test:`(() => { const k = [...document.querySelectorAll(".kachel")].map(e => e.getBoundingClientRect()); return k.length === 3 && k[1].left > k[0].right - 1 && k[2].left > k[1].right - 1; })()`},
        {label:"Vertikal mittig ausgerichtet", test:`getComputedStyle(document.querySelector(".kacheln")).alignItems === "center"`}
      ],
      hints:["<code>display: flex;</code> stellt die Kinder nebeneinander.", "Abstand: <code>gap: 12px;</code>, Ausrichtung: <code>align-items: center;</code>"],
      solution:`<style>
  .kacheln {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .kachel { padding: 12px; background: #f2f2f7; border-radius: 10px; }
</style>
<div class="kacheln">
  <div class="kachel">CPU<br>37 %</div>
  <div class="kachel">RAM</div>
  <div class="kachel">Disk<br>81 %<br>!</div>
</div>`},
    {id:"semantik", level:3, lesson:"semantik", title:"Semantische Seite",
      text:"<p>Baue eine Seite mit semantischen Elementen: ein <code>header</code> mit einer <code>nav</code> darin, die mindestens zwei Links enthält, ein <code>main</code> mit einer <code>h1</code> und ein <code>footer</code>. Es darf nur ein <code>main</code> geben.</p>",
      start:`<!-- header mit nav, main mit h1, footer -->
`,
      checks:[
        {label:"header mit nav darin", test:`!!document.querySelector("header nav")`},
        {label:"Mindestens zwei Links in der Navigation", test:`document.querySelectorAll("nav a[href]").length >= 2`},
        {label:"Genau ein main mit h1", test:`document.querySelectorAll("main").length === 1 && !!document.querySelector("main h1")`},
        {label:"Ein footer", test:`!!document.querySelector("footer")`}
      ],
      hints:["Die Reihenfolge im body: <code>header</code>, <code>main</code>, <code>footer</code>.", "Die Links stehen innerhalb von <code>&lt;nav&gt;</code>, und <code>nav</code> steht innerhalb von <code>header</code>."],
      solution:`<header>
  <nav>
    <a href="#start">Start</a>
    <a href="#kontakt">Kontakt</a>
  </nav>
</header>
<main>
  <h1>IT-Service</h1>
  <p>Hilfe bei allen Fragen.</p>
</main>
<footer id="kontakt">Helpdesk: Durchwahl 4711</footer>`}
  ]
});
