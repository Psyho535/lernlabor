/*! IT-Lernlabor · © 2026 Alexander S. · Alle Rechte vorbehalten. Nutzung nur nach LICENSE. */
/* Programmieren: JavaScript. Läuft mit der echten JavaScript-Engine des Browsers in einem eigenen Worker.
   Eingaben kommen über prompt(), Ausgaben über console.log wie in der Browser-Konsole. */
(window.LERN_CODE = window.LERN_CODE || []).push({
  id:"javascript", title:"JavaScript", badge:"JS", color:"#bf5af2",
  sub:"Die Sprache des Webs, im Browser und auf dem Server",
  version:"ECMAScript, Engine deines Browsers",
  why:"JavaScript steckt in fast jeder Weboberfläche. Mit Node.js laufen damit auch Server und Werkzeuge. Für die Systemintegration hilft es, Weboberflächen von Geräten und Admin-Tools zu verstehen.",
  easy:"JavaScript macht Webseiten lebendig. HTML ist das Gerüst, CSS die Farbe, und JavaScript ist der Strom: Es reagiert auf Klicks, rechnet und ändert die Seite, während du sie benutzt.",
  starter:`// Dein JavaScript-Terminal. prompt() fragt im Terminal nach einer Eingabe.
const name = prompt("Wie heißt du?");
console.log(\`Hallo \${name}, willkommen im IT-Lernlabor!\`);
`,
  sources:[
    ["MDN: JavaScript-Leitfaden", "https://developer.mozilla.org/de/docs/Web/JavaScript/Guide"],
    ["MDN: JavaScript-Referenz", "https://developer.mozilla.org/de/docs/Web/JavaScript/Reference"],
    ["ECMAScript-Spezifikation (TC39)", "https://tc39.es/ecma262/"]
  ],
  lessons:[
    {id:"erste-schritte", title:"Erste Schritte", sum:"console.log, Kommentare und wo JavaScript läuft.", task:"hallo",
      easy:"console.log ist der Notizblock von JavaScript: Alles, was du hineinschreibst, erscheint in der Konsole. Entwickler nutzen das ständig, um nachzusehen, was ihr Programm gerade tut.",
      sec:[
        {p:"JavaScript läuft in jedem Browser und mit Node.js auch außerhalb. <code>console.log(...)</code> gibt Werte in der Konsole aus. Im Browser öffnest du sie mit F12 in den Entwicklerwerkzeugen, hier siehst du sie im Terminal."},
        {run:`console.log("Hallo Welt!");
console.log(7 + 5);
console.log("Raum", 204, "hat", 12, "Rechner");
// Ein Kommentar
/* Ein Kommentar
   über mehrere Zeilen */`},
        {h:"Anweisungen", p:"Anweisungen enden üblicherweise mit einem Semikolon. JavaScript ergänzt fehlende Semikolons oft selbst, verlässlicher ist es aber, sie immer zu schreiben. Groß- und Kleinschreibung zählt: <code>console.Log</code> gibt es nicht."},
        {tip:"Im Lernlabor gibt <code>prompt(\"Frage\")</code> die Frage im Terminal aus und wartet auf deine Eingabe. Im Browser öffnet sich dafür ein kleines Fenster."}
      ],
      src:[["MDN: Was ist JavaScript?", "https://developer.mozilla.org/de/docs/Learn_web_development/Core/Scripting/What_is_JavaScript"], ["MDN: console.log()", "https://developer.mozilla.org/de/docs/Web/API/console/log_static"]]},
    {id:"variablen", title:"Variablen und Datentypen", sum:"let, const, typeof und Template-Strings.", task:"mwst",
      easy:"let ist eine Kiste, deren Inhalt du später austauschen darfst. const ist eine versiegelte Kiste: Einmal befüllt, bleibt der Inhalt drin. Nimm const, wenn sich der Wert nicht ändern soll.",
      sec:[
        {p:"Variablen legst du mit <code>let</code> oder <code>const</code> an. <code>const</code> kann nicht neu zugewiesen werden. Das ältere <code>var</code> siehst du noch in altem Code, in neuem Code nutzt man es nicht mehr."},
        {run:`const hostname = "web-01";
let verbindungen = 12;
verbindungen = verbindungen + 3;
const online = true;
let fehler;          // noch kein Wert
console.log(hostname, verbindungen, online, fehler);
console.log(typeof hostname, typeof verbindungen, typeof online, typeof fehler);`},
        {h:"Datentypen", table:{head:["Typ", "Beispiel"], rows:[["<code>number</code>", "<code>42</code>, <code>3.5</code> (es gibt nur einen Zahlentyp)"], ["<code>string</code>", "<code>\"Text\"</code>, <code>'Text'</code>, <code>`Text`</code>"], ["<code>boolean</code>", "<code>true</code>, <code>false</code>"], ["<code>undefined</code>", "Variable ohne Wert"], ["<code>null</code>", "bewusst kein Wert"], ["<code>object</code>", "Objekte und Arrays"]]}},
        {h:"Template-Strings", p:"In Backticks <code>`...`</code> setzt <code>${ausdruck}</code> einen Wert in den Text ein."},
        {run:`const geraet = "Switch";
const ports = 48;
console.log(\`Der \${geraet} hat \${ports} Ports, davon \${ports - 4} frei.\`);`},
        {warn:"Eine <code>const</code>-Variable neu zuzuweisen führt zu <code>TypeError: Assignment to constant variable.</code>"}
      ],
      src:[["MDN: Variablen speichern", "https://developer.mozilla.org/de/docs/Learn_web_development/Core/Scripting/Variables"], ["MDN: let", "https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Statements/let"], ["MDN: const", "https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Statements/const"], ["MDN: Template-Literale", "https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Template_literals"]]},
    {id:"operatoren", title:"Operatoren und Umwandlung", sum:"Rechnen, == gegen ===, Number und toFixed.", task:"bytes",
      easy:"JavaScript versucht hilfsbereit, Werte passend zu machen. Das führt zu Überraschungen: \"5\" + 3 ergibt \"53\", weil + bei Text zusammenklebt. Wandle Eingaben deshalb immer bewusst in Zahlen um.",
      sec:[
        {p:"JavaScript rechnet mit <code>+ - * / %</code> und <code>**</code>. Ist bei <code>+</code> ein Wert ein String, wird zusammengefügt statt addiert. Andere Operatoren wandeln Strings in Zahlen um."},
        {run:`console.log(7 / 2, 7 % 2, 2 ** 10);
console.log("5" + 3);
console.log("5" - 3);
console.log(Number("42") + 1);
console.log(Number("42abc"));
console.log(parseInt("42px"), parseFloat("3.75 GB"));
console.log((19.987).toFixed(2));`},
        {h:"== und ===", p:"<code>===</code> vergleicht Wert und Typ, <code>==</code> wandelt vorher um. Das führt zu unerwarteten Ergebnissen, deshalb nutzt man fast immer <code>===</code> und <code>!==</code>."},
        {run:`console.log(5 == "5");
console.log(5 === "5");
console.log(0 == "");
console.log(null == undefined, null === undefined);`},
        {tip:"<code>prompt()</code> liefert immer einen String. Mit <code>Number(eingabe)</code> wird daraus eine Zahl. Ist das nicht möglich, entsteht <code>NaN</code> (Not a Number). Prüfen kannst du das mit <code>Number.isNaN(wert)</code>."}
      ],
      src:[["MDN: Grundlegende Mathematik", "https://developer.mozilla.org/de/docs/Learn_web_development/Core/Scripting/Math"], ["MDN: Gleichheitsvergleiche", "https://developer.mozilla.org/de/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness"], ["MDN: Number()", "https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Number/Number"]]},
    {id:"verzweigungen", title:"Verzweigungen", sum:"if, else, switch, der ternäre Operator und Truthiness.", task:"ampel",
      easy:"Wie in jeder Sprache entscheidet if, welcher Weg genommen wird. Besonders in JavaScript: Manche Werte gelten als falsch, auch wenn sie nicht false sind, etwa 0, ein leerer Text oder undefined.",
      sec:[
        {run:`const cpu = 91;
if (cpu >= 90) {
  console.log("Alarm");
} else if (cpu >= 70) {
  console.log("Warnung");
} else {
  console.log("Normal");
}
const status = cpu >= 90 ? "rot" : "grün";
console.log(status);`},
        {h:"Logische Operatoren", p:"<code>&amp;&amp;</code> (und), <code>||</code> (oder) und <code>!</code> (nicht) funktionieren wie in anderen Sprachen. Der ternäre Operator <code>bedingung ? a : b</code> liefert je nach Bedingung den einen oder den anderen Wert."},
        {h:"switch", run:`const tag = "Sa";
switch (tag) {
  case "Sa":
  case "So":
    console.log("Wochenende: Notdienst");
    break;
  default:
    console.log("Regulärer Betrieb");
}`},
        {h:"Truthy und falsy", p:"In Bedingungen gelten <code>false</code>, <code>0</code>, <code>\"\"</code>, <code>null</code>, <code>undefined</code> und <code>NaN</code> als falsch (falsy). Alles andere gilt als wahr (truthy), auch <code>\"0\"</code> und leere Arrays."},
        {run:`for (const wert of [0, "", "0", [], null, "admin"]) {
  console.log(JSON.stringify(wert), wert ? "truthy" : "falsy");
}`}
      ],
      src:[["MDN: Entscheidungen im Code", "https://developer.mozilla.org/de/docs/Learn_web_development/Core/Scripting/Conditionals"], ["MDN: Falsy", "https://developer.mozilla.org/de/docs/Glossary/Falsy"], ["MDN: switch", "https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Statements/switch"]]},
    {id:"schleifen", title:"Schleifen", sum:"for, while und for...of.", task:"gerade",
      easy:"Schleifen wiederholen Arbeit. for zählt, while wartet auf eine Bedingung, und for...of geht jeden Eintrag einer Liste durch, wie ein Finger, der von Zeile zu Zeile wandert.",
      sec:[
        {run:`for (let i = 1; i <= 3; i++) {
  console.log(\`Durchlauf \${i}\`);
}

let versuche = 0;
while (versuche < 3) {
  versuche++;
}
console.log("Versuche:", versuche);

const server = ["web-01", "db-01", "mail-01"];
for (const s of server) {
  console.log("Backup:", s);
}`},
        {h:"break und continue", p:"<code>break</code> beendet die Schleife, <code>continue</code> springt zum nächsten Durchlauf."},
        {run:`for (let port = 20; port <= 25; port++) {
  if (port === 23) continue;     // Telnet überspringen
  if (port === 25) break;
  console.log(port);
}`},
        {warn:"<code>for...in</code> läuft über die Schlüssel eines Objekts, nicht über die Werte eines Arrays. Für Arrays nimm <code>for...of</code>."}
      ],
      src:[["MDN: Schleifen und Iteration", "https://developer.mozilla.org/de/docs/Web/JavaScript/Guide/Loops_and_iteration"], ["MDN: for...of", "https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Statements/for...of"]]},
    {id:"arrays", title:"Arrays", sum:"Listen anlegen, ändern und mit map, filter und forEach bearbeiten.", task:"statistik",
      easy:"Ein Array ist eine Liste mit Nummern, beginnend bei 0. Mit filter siebst du Einträge aus, mit map verwandelst du jeden Eintrag, wie eine Maschine, die jedes Teil auf dem Band umformt.",
      sec:[
        {run:`const pings = [23, 18, 145, 20];
pings.push(31);
console.log(pings, pings.length);
console.log(pings[0], pings.at(-1));
console.log(pings.includes(145), pings.indexOf(20));
const letzter = pings.pop();
console.log(letzter, pings);`},
        {h:"map, filter und reduce", p:"Diese Methoden bekommen eine Funktion. <code>map</code> erzeugt ein neues Array aus umgewandelten Werten, <code>filter</code> eines mit den passenden Werten, <code>reduce</code> fasst alles zu einem Wert zusammen."},
        {run:`const pings = [23, 18, 145, 20, 31];
const langsam = pings.filter(ms => ms > 30);
const sekunden = pings.map(ms => ms / 1000);
const summe = pings.reduce((a, b) => a + b, 0);
console.log(langsam);
console.log(sekunden);
console.log("Schnitt:", summe / pings.length);
console.log([...pings].sort((a, b) => a - b));`},
        {warn:"<code>sort()</code> ohne Funktion sortiert als Text: <code>[10, 9, 100].sort()</code> ergibt <code>[10, 100, 9]</code>. Für Zahlen brauchst du <code>sort((a, b) => a - b)</code>. Außerdem verändert <code>sort</code> das Array selbst."}
      ],
      src:[["MDN: Arrays", "https://developer.mozilla.org/de/docs/Learn_web_development/Core/Scripting/Arrays"], ["MDN: Array", "https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array"], ["MDN: Array.prototype.sort()", "https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/sort"]]},
    {id:"funktionen", title:"Funktionen", sum:"function, Pfeilfunktionen, Parameter und return.", task:"bytes",
      easy:"Eine Funktion ist ein kleines Programm im Programm. Du gibst ihr einen Namen, steckst Werte hinein und bekommst mit return ein Ergebnis zurück. Pfeilfunktionen sind nur eine kürzere Schreibweise.",
      sec:[
        {run:`function hosts(praefix) {
  return 2 ** (32 - praefix) - 2;
}

const quadrat = x => x * x;
const begruessung = (name, gruss = "Hallo") => \`\${gruss}, \${name}!\`;

console.log(hosts(24), hosts(26));
console.log(quadrat(12));
console.log(begruessung("Ada"));
console.log(begruessung("Linus", "Moin"));`},
        {h:"Funktionen als Werte", p:"Funktionen sind Werte: Du kannst sie Variablen zuweisen oder anderen Funktionen übergeben. Genau das passiert bei <code>map</code> und <code>filter</code>."},
        {tip:"Eine Funktion ohne <code>return</code> liefert <code>undefined</code>. Bei Pfeilfunktionen ohne geschweifte Klammern wird der Ausdruck automatisch zurückgegeben."}
      ],
      src:[["MDN: Funktionen", "https://developer.mozilla.org/de/docs/Web/JavaScript/Guide/Functions"], ["MDN: Pfeilfunktionen", "https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Functions/Arrow_functions"]]},
    {id:"objekte", title:"Objekte und JSON", sum:"Eigenschaften, Methoden, Arrays aus Objekten und JSON.", task:"inventar",
      easy:"Ein Objekt ist wie ein Steckbrief: Es hat Felder mit Namen, etwa Name, IP-Adresse und Raum. JSON ist die Textform solcher Steckbriefe, mit der Programme Daten austauschen.",
      sec:[
        {run:`const drucker = {
  name: "DR-3OG",
  ip: "10.0.3.50",
  seiten: 18234,
  online: true,
  info() { return \`\${this.name} (\${this.ip})\`; }
};
console.log(drucker.name, drucker["ip"]);
drucker.seiten += 120;
drucker.raum = "3.12";
console.log(drucker.info());
console.log(drucker);`},
        {h:"Arrays aus Objekten", run:`const geraete = [
  { name: "PC-01", typ: "PC", baujahr: 2019 },
  { name: "NB-07", typ: "Laptop", baujahr: 2023 },
  { name: "PC-02", typ: "PC", baujahr: 2021 }
];
const alt = geraete.filter(g => g.baujahr < 2021).map(g => g.name);
console.log("Austauschen:", alt);
for (const { name, typ } of geraete) {
  console.log(name, typ);
}`},
        {h:"JSON", p:"JSON (JavaScript Object Notation) ist ein Textformat für Daten. Viele APIs und Konfigurationsdateien nutzen es. <code>JSON.stringify</code> macht aus einem Objekt Text, <code>JSON.parse</code> aus Text wieder ein Objekt."},
        {run:`const text = '{"host":"db-01","port":5432,"ssl":true}';
const conf = JSON.parse(text);
console.log(conf.port + 1);
console.log(JSON.stringify({ ...conf, port: 5433 }));`}
      ],
      src:[["MDN: Objekte", "https://developer.mozilla.org/de/docs/Learn_web_development/Core/Scripting/Object_basics"], ["MDN: JSON", "https://developer.mozilla.org/de/docs/Learn_web_development/Core/Scripting/JSON"], ["RFC 8259: The JSON Data Interchange Format", "https://www.rfc-editor.org/rfc/rfc8259"]]},
    {id:"dom", title:"Webseiten verändern (DOM)", sum:"Elemente finden, Text ändern und auf Klicks reagieren.", task:"zaehler",
      easy:"Der Browser macht aus dem HTML einen Baum aus Objekten, das DOM. JavaScript kann in diesem Baum Elemente finden und ändern, zum Beispiel einen Text austauschen, wenn jemand auf einen Knopf drückt.",
      sec:[
        {p:"Im Browser stellt das <i>DOM</i> (Document Object Model) die Seite als Objekte dar. <code>document.querySelector(\"selektor\")</code> findet ein Element mit einem CSS-Selektor. Über <code>textContent</code> änderst du den Text, mit <code>addEventListener</code> reagierst du auf Ereignisse."},
        {run:`<button id="knopf">Server prüfen</button>
<p id="status">Noch nicht geprüft</p>
<script>
  const knopf = document.querySelector("#knopf");
  const status = document.querySelector("#status");
  let pruefungen = 0;
  knopf.addEventListener("click", () => {
    pruefungen++;
    status.textContent = \`Erreichbar (\${pruefungen}. Prüfung)\`;
    status.style.color = "green";
    console.log("geklickt", pruefungen);
  });
</script>`, lang:"web"},
        {p:"Dieses Beispiel ist HTML mit eingebettetem JavaScript. Es läuft deshalb in der Vorschau. Tippe in der Vorschau auf den Knopf, die Ausgaben von console.log erscheinen darunter."},
        {h:"Wichtige Werkzeuge", table:{head:["Befehl", "Wirkung"], rows:[["<code>document.querySelector(s)</code>", "erstes passendes Element"], ["<code>document.querySelectorAll(s)</code>", "alle passenden Elemente"], ["<code>el.textContent = \"...\"</code>", "Text setzen"], ["<code>el.classList.add(\"x\")</code>", "Klasse hinzufügen"], ["<code>el.addEventListener(\"click\", f)</code>", "bei Klick f ausführen"], ["<code>document.createElement(\"li\")</code>", "neues Element erzeugen"]]}},
        {warn:"Setze Text aus Eingaben mit <code>textContent</code>, nicht mit <code>innerHTML</code>. Sonst kann jemand HTML oder Skripte einschleusen (Cross-Site-Scripting)."}
      ],
      src:[["MDN: Dokumente manipulieren", "https://developer.mozilla.org/de/docs/Learn_web_development/Core/Scripting/DOM_scripting"], ["MDN: addEventListener()", "https://developer.mozilla.org/de/docs/Web/API/EventTarget/addEventListener"], ["OWASP: Cross Site Scripting", "https://owasp.org/www-community/attacks/xss/"]]}
  ],
  tasks:[
    {id:"hallo", level:1, lesson:"erste-schritte", title:"Erste Ausgabe",
      text:"<p>Gib mit <code>console.log</code> genau diese zwei Zeilen aus:</p>",
      start:`// Zwei Zeilen ausgeben
`,
      tests:[{expect:"Hallo, IT-Lernlabor!\nIch lerne JavaScript.\n"}],
      hints:["Für jede Zeile ein <code>console.log(\"...\");</code>"],
      solution:`console.log("Hallo, IT-Lernlabor!");
console.log("Ich lerne JavaScript.");`},
    {id:"mwst", level:1, lesson:"variablen", title:"Bruttopreis",
      text:"<p>Frage mit <code>prompt</code> nach einem Nettopreis und gib den Bruttopreis mit 19 Prozent Mehrwertsteuer und zwei Nachkommastellen aus, im Format <code>Brutto: 119.00 Euro</code>.</p>",
      start:`const netto = prompt("Nettopreis:");
`,
      tests:[{input:["100"], expect:"Brutto: 119.00 Euro\n"}, {input:["19.99"], expect:"Brutto: 23.79 Euro\n"}],
      hints:["<code>Number(netto)</code> macht aus dem Text eine Zahl.", "<code>wert.toFixed(2)</code> liefert zwei Nachkommastellen."],
      solution:`const netto = Number(prompt("Nettopreis:"));
const brutto = netto * 1.19;
console.log(\`Brutto: \${brutto.toFixed(2)} Euro\`);`},
    {id:"ampel", level:1, lesson:"verzweigungen", title:"Festplatten-Ampel",
      text:"<p>Frage nach der Belegung einer Festplatte in Prozent. Gib bei 90 oder mehr <code>rot</code> aus, ab 75 <code>gelb</code>, sonst <code>grün</code>.</p>",
      start:`const belegt = Number(prompt("Belegung in %:"));
`,
      tests:[{input:["95"], expect:"rot\n"}, {input:["90"], expect:"rot\n"}, {input:["75"], expect:"gelb\n"}, {input:["40"], expect:"grün\n"}],
      hints:["<code>if (belegt >= 90) { ... } else if (belegt >= 75) { ... } else { ... }</code>"],
      solution:`const belegt = Number(prompt("Belegung in %:"));
if (belegt >= 90) {
  console.log("rot");
} else if (belegt >= 75) {
  console.log("gelb");
} else {
  console.log("grün");
}`},
    {id:"gerade", level:2, lesson:"schleifen", title:"Gerade Portnummern",
      text:"<p>Frage nach zwei Zahlen <code>von</code> und <code>bis</code> und gib alle geraden Zahlen dazwischen aus, beide Grenzen eingeschlossen, durch ein Komma und ein Leerzeichen getrennt in einer Zeile.</p>",
      start:`const von = Number(prompt("von:"));
const bis = Number(prompt("bis:"));
`,
      tests:[{input:["3", "12"], expect:"4, 6, 8, 10, 12\n"}, {input:["20", "25"], expect:"20, 22, 24\n"}],
      hints:["Sammle die Zahlen in einem Array und gib es am Ende mit <code>zahlen.join(\", \")</code> aus.", "Gerade heißt: <code>i % 2 === 0</code>"],
      solution:`const von = Number(prompt("von:"));
const bis = Number(prompt("bis:"));
const zahlen = [];
for (let i = von; i <= bis; i++) {
  if (i % 2 === 0) zahlen.push(i);
}
console.log(zahlen.join(", "));`},
    {id:"statistik", level:2, lesson:"arrays", title:"Antwortzeiten auswerten",
      text:"<p>Frage nach einer Liste von Antwortzeiten in Millisekunden, durch Kommas getrennt, etwa <code>120,80,300,95</code>. Gib die Anzahl, die schnellste und die langsamste Zeit und alle Zeiten über 100 ms aus, genau im Format des Beispiels.</p>",
      start:`const eingabe = prompt("Zeiten:");
`,
      tests:[{input:["120,80,300,95"], expect:"Anzahl: 4\nSchnellste: 80 ms\nLangsamste: 300 ms\nÜber 100 ms: 120, 300\n"}, {input:["50, 60"], expect:"Anzahl: 2\nSchnellste: 50 ms\nLangsamste: 60 ms\nÜber 100 ms: keine\n"}],
      hints:["<code>eingabe.split(\",\").map(Number)</code> liefert ein Array von Zahlen. <code>Number</code> ignoriert Leerzeichen am Rand.", "<code>Math.min(...zeiten)</code> und <code>Math.max(...zeiten)</code>", "Für die letzte Zeile: <code>filter</code>, dann <code>join(\", \")</code> oder <code>keine</code>, wenn das Ergebnis leer ist."],
      solution:`const eingabe = prompt("Zeiten:");
const zeiten = eingabe.split(",").map(Number);
const langsam = zeiten.filter(z => z > 100);
console.log(\`Anzahl: \${zeiten.length}\`);
console.log(\`Schnellste: \${Math.min(...zeiten)} ms\`);
console.log(\`Langsamste: \${Math.max(...zeiten)} ms\`);
console.log(\`Über 100 ms: \${langsam.length ? langsam.join(", ") : "keine"}\`);`},
    {id:"bytes", level:2, lesson:"funktionen", title:"Dateigröße lesbar machen",
      text:"<p>Schreibe eine Funktion <code>lesbar(bytes)</code>, die eine Anzahl Bytes in die größte passende Einheit umrechnet: B, KiB, MiB, GiB oder TiB, mit dem Faktor 1024. Ab KiB steht eine Nachkommastelle. Gib für die eingegebene Zahl das Ergebnis aus.</p>",
      start:`function lesbar(bytes) {

}

console.log(lesbar(Number(prompt("Bytes:"))));
`,
      tests:[{input:["500"], expect:"500 B\n"}, {input:["1536"], expect:"1.5 KiB\n"}, {input:["5368709120"], expect:"5.0 GiB\n"}, {input:["1048576"], expect:"1.0 MiB\n"}],
      hints:["Teile in einer Schleife durch 1024, solange der Wert mindestens 1024 ist und es noch eine größere Einheit gibt.", "Die Einheiten in einem Array: <code>[\"B\", \"KiB\", \"MiB\", \"GiB\", \"TiB\"]</code>", "Bytes ohne Nachkommastelle, sonst <code>wert.toFixed(1)</code>."],
      solution:`function lesbar(bytes) {
  const einheiten = ["B", "KiB", "MiB", "GiB", "TiB"];
  let wert = bytes;
  let i = 0;
  while (wert >= 1024 && i < einheiten.length - 1) {
    wert /= 1024;
    i++;
  }
  return i === 0 ? \`\${wert} B\` : \`\${wert.toFixed(1)} \${einheiten[i]}\`;
}

console.log(lesbar(Number(prompt("Bytes:"))));`,
      explain:"KiB, MiB und GiB sind die binären Einheiten mit Faktor 1024 nach IEC 80000-13. KB, MB und GB stehen im SI-System für Faktor 1000."},
    {id:"inventar", level:2, lesson:"objekte", title:"Inventar filtern",
      text:"<p>Das Array <code>geraete</code> ist vorgegeben. Frage nach einem Jahr und gib alle Geräte aus, die vor diesem Jahr gekauft wurden, sortiert nach Kaufjahr (älteste zuerst), im Format <code>PC-03 (2017, Raum 101)</code>. Gibt es keines, gib <code>Keine Geräte gefunden.</code> aus.</p>",
      start:`const geraete = [
  { name: "PC-01", kaufjahr: 2019, raum: "204" },
  { name: "NB-07", kaufjahr: 2023, raum: "Homeoffice" },
  { name: "PC-03", kaufjahr: 2017, raum: "101" },
  { name: "DR-01", kaufjahr: 2020, raum: "204" }
];
const jahr = Number(prompt("Vor welchem Jahr?"));
`,
      tests:[{input:["2021"], expect:"PC-03 (2017, Raum 101)\nPC-01 (2019, Raum 204)\nDR-01 (2020, Raum 204)\n"}, {input:["2018"], expect:"PC-03 (2017, Raum 101)\n"}, {input:["2000"], expect:"Keine Geräte gefunden.\n"}],
      hints:["<code>geraete.filter(g => g.kaufjahr &lt; jahr)</code>", "Sortieren: <code>.sort((a, b) => a.kaufjahr - b.kaufjahr)</code>"],
      solution:`const geraete = [
  { name: "PC-01", kaufjahr: 2019, raum: "204" },
  { name: "NB-07", kaufjahr: 2023, raum: "Homeoffice" },
  { name: "PC-03", kaufjahr: 2017, raum: "101" },
  { name: "DR-01", kaufjahr: 2020, raum: "204" }
];
const jahr = Number(prompt("Vor welchem Jahr?"));
const alt = geraete.filter(g => g.kaufjahr < jahr).sort((a, b) => a.kaufjahr - b.kaufjahr);
if (alt.length === 0) {
  console.log("Keine Geräte gefunden.");
} else {
  for (const g of alt) {
    console.log(\`\${g.name} (\${g.kaufjahr}, Raum \${g.raum})\`);
  }
}`},
    {id:"zaehler", level:3, lesson:"dom", title:"Klickzähler",
      text:"<p>Baue eine kleine Seite mit einem Button mit der id <code>plus</code> und einem Element mit der id <code>anzahl</code>, das am Anfang <code>0</code> anzeigt. Jeder Klick auf den Button erhöht die angezeigte Zahl um 1. Die Prüfung klickt den Button dreimal.</p>",
      lang:"web",
      start:`<button id="plus">+1</button>
<p id="anzahl">0</p>
<script>

</script>
`,
      checks:[
        {label:"Button mit id plus und Anzeige mit id anzahl", test:`!!document.querySelector("#plus") && !!document.querySelector("#anzahl")`},
        {label:"Die Anzeige startet bei 0", test:`document.querySelector("#anzahl").textContent.trim() === "0"`},
        {label:"Nach drei Klicks steht 3 in der Anzeige", test:`(() => { const b = document.querySelector("#plus"); b.click(); b.click(); b.click(); return document.querySelector("#anzahl").textContent.trim() === "3"; })()`}
      ],
      hints:["Hole beide Elemente mit <code>document.querySelector(\"#plus\")</code> und <code>document.querySelector(\"#anzahl\")</code>.", "Ein Zähler mit <code>let zahl = 0;</code>, im Klick-Handler <code>zahl++</code> und <code>anzeige.textContent = zahl;</code>"],
      solution:`<button id="plus">+1</button>
<p id="anzahl">0</p>
<script>
  const knopf = document.querySelector("#plus");
  const anzeige = document.querySelector("#anzahl");
  let zahl = 0;
  knopf.addEventListener("click", () => {
    zahl++;
    anzeige.textContent = zahl;
  });
</script>`}
  ]
});
