/*! IT-Lernlabor · © 2026 Alexander S. · Alle Rechte vorbehalten. Nutzung nur nach LICENSE. */
/* Programmieren: SQL. Läuft mit echtem SQLite (sql.js) im Browser. Jede Ausführung startet mit dieser Übungsdatenbank.
   Aufgaben vergleichen das Ergebnis der letzten Abfrage mit dem Ergebnis der Musterlösung. */
(window.LERN_CODE = window.LERN_CODE || []).push({
  id:"sql", title:"SQL", badge:"SQL", color:"#30d158",
  sub:"Daten in Datenbanken abfragen und ändern",
  version:"SQLite 3, echtes SQLite im Browser",
  why:"Fast jede Anwendung speichert ihre Daten in einer Datenbank: Benutzerverwaltung, Ticketsystem, Inventar. Mit SQL fragst du diese Daten ab, prüfst sie und behebst Fehler direkt in der Datenbank.",
  easy:"Eine Datenbank ist wie eine Sammlung von Tabellen in einer Tabellenkalkulation. Mit SQL stellst du Fragen an diese Tabellen, zum Beispiel: Zeig mir alle Laptops aus Raum 204. Die Datenbank sucht die passenden Zeilen heraus.",
  setup:`CREATE TABLE geraete (id INTEGER PRIMARY KEY, name TEXT NOT NULL, typ TEXT NOT NULL, raum TEXT, ip TEXT, kaufjahr INTEGER, preis REAL);
INSERT INTO geraete VALUES
 (1, 'PC-101-01', 'PC', '101', '10.0.1.11', 2019, 849.00),
 (2, 'PC-101-02', 'PC', '101', '10.0.1.12', 2021, 899.00),
 (3, 'NB-204-01', 'Laptop', '204', '10.0.2.21', 2023, 1299.00),
 (4, 'NB-204-02', 'Laptop', '204', '10.0.2.22', 2020, 1099.00),
 (5, 'DR-204', 'Drucker', '204', '10.0.2.50', 2018, 459.00),
 (6, 'MON-101-01', 'Monitor', '101', NULL, 2021, 229.00),
 (7, 'MON-204-01', 'Monitor', '204', NULL, 2022, 249.00),
 (8, 'SW-SR-01', 'Switch', 'Serverraum', '10.0.0.2', 2020, 1890.00),
 (9, 'SRV-SR-01', 'Server', 'Serverraum', '10.0.0.10', 2019, 5400.00),
 (10, 'SRV-SR-02', 'Server', 'Serverraum', '10.0.0.11', 2024, 6200.00),
 (11, 'AP-204', 'Access Point', '204', '10.0.2.5', 2022, 189.00),
 (12, 'NB-HO-01', 'Laptop', 'Homeoffice', NULL, 2024, 1399.00);
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, vorname TEXT NOT NULL, nachname TEXT NOT NULL, abteilung TEXT, geraet_id INTEGER REFERENCES geraete(id));
INSERT INTO mitarbeiter VALUES
 (1, 'Anna', 'Becker', 'IT', 3),
 (2, 'Ben', 'Schulz', 'Vertrieb', 4),
 (3, 'Clara', 'Wagner', 'Buchhaltung', 1),
 (4, 'David', 'Klein', 'Vertrieb', 2),
 (5, 'Emma', 'Hoffmann', 'IT', 12),
 (6, 'Finn', 'Neumann', 'Personal', NULL),
 (7, 'Greta', 'Schmitt', 'Buchhaltung', NULL);
CREATE TABLE tickets (id INTEGER PRIMARY KEY, titel TEXT NOT NULL, prioritaet TEXT, status TEXT, erstellt TEXT, mitarbeiter_id INTEGER REFERENCES mitarbeiter(id), geraet_id INTEGER REFERENCES geraete(id));
INSERT INTO tickets VALUES
 (1, 'Drucker druckt leere Seiten', 'mittel', 'offen', '2026-10-01', 2, 5),
 (2, 'Laptop startet nicht', 'hoch', 'in Arbeit', '2026-10-03', 2, 4),
 (3, 'Passwort vergessen', 'niedrig', 'erledigt', '2026-10-05', 3, NULL),
 (4, 'Monitor flackert', 'niedrig', 'offen', '2026-10-08', 3, 6),
 (5, 'VPN bricht ab', 'hoch', 'offen', '2026-10-10', 5, 12),
 (6, 'Server-Festplatte fast voll', 'hoch', 'in Arbeit', '2026-10-12', 1, 9),
 (7, 'Neuen Benutzer anlegen', 'mittel', 'erledigt', '2026-10-14', 6, NULL),
 (8, 'WLAN langsam in Raum 204', 'mittel', 'offen', '2026-10-20', 4, 11);
`,
  schema:[
    {name:"geraete", cols:["id", "name", "typ", "raum", "ip", "kaufjahr", "preis"]},
    {name:"mitarbeiter", cols:["id", "vorname", "nachname", "abteilung", "geraet_id"]},
    {name:"tickets", cols:["id", "titel", "prioritaet", "status", "erstellt", "mitarbeiter_id", "geraet_id"]}
  ],
  starter:`-- Dein SQL-Terminal mit der Übungsdatenbank
SELECT name, typ, raum
FROM geraete
WHERE raum = '204';
`,
  sources:[
    ["SQLite: SQL-Sprachreferenz", "https://www.sqlite.org/lang.html"],
    ["SQLite: SELECT", "https://www.sqlite.org/lang_select.html"],
    ["SQLite: Datentypen", "https://www.sqlite.org/datatype3.html"]
  ],
  lessons:[
    {id:"select", title:"Daten abfragen mit SELECT", sum:"Tabellen, Zeilen, Spalten und die erste Abfrage.", task:"laptops",
      easy:"Eine Tabelle hat Spalten (die Überschriften) und Zeilen (die Einträge). Mit SELECT sagst du, welche Spalten du sehen willst, und mit FROM, aus welcher Tabelle. Die Datenbank liefert dir eine neue, passende Tabelle zurück.",
      sec:[
        {p:"Eine relationale Datenbank speichert Daten in Tabellen. Jede Zeile ist ein Datensatz, jede Spalte ein Merkmal. Die Übungsdatenbank hat drei Tabellen: <code>geraete</code>, <code>mitarbeiter</code> und <code>tickets</code>."},
        {run:`SELECT * FROM geraete;`},
        {h:"Spalten auswählen", p:"<code>*</code> bedeutet alle Spalten. Meist nennst du nur die Spalten, die du brauchst, durch Kommas getrennt. Mit <code>AS</code> gibst du einer Spalte im Ergebnis einen anderen Namen."},
        {run:`SELECT name, ip AS adresse, preis
FROM geraete;`},
        {h:"Schreibweise", list:["SQL-Schlüsselwörter wie <code>SELECT</code> und <code>FROM</code> schreibt man üblicherweise groß, nötig ist es nicht.", "Texte stehen in einfachen Anführungszeichen: <code>'Laptop'</code>.", "Eine Anweisung endet mit einem Semikolon. So kannst du mehrere Anweisungen nacheinander ausführen.", "Kommentare beginnen mit <code>--</code>."]},
        {tip:"Jede Ausführung im Lernlabor startet mit einer frischen Übungsdatenbank. Du kannst also nichts kaputtmachen."}
      ],
      src:[["SQLite: SELECT", "https://www.sqlite.org/lang_select.html"], ["SQLite: Schlüsselwörter", "https://www.sqlite.org/lang_keywords.html"]]},
    {id:"where", title:"Filtern mit WHERE", sum:"Bedingungen, AND, OR, BETWEEN, IN, LIKE und NULL.", task:"alte",
      easy:"WHERE ist ein Sieb: Nur die Zeilen, die die Bedingung erfüllen, fallen durch und landen im Ergebnis. Mit AND und OR kombinierst du mehrere Siebe.",
      sec:[
        {p:"Mit <code>WHERE</code> filterst du Zeilen. Vergleiche schreibst du mit <code>=</code>, <code>&lt;&gt;</code> (ungleich), <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code> und <code>&gt;=</code>."},
        {run:`SELECT name, typ, kaufjahr
FROM geraete
WHERE kaufjahr < 2021 AND typ <> 'Server';`},
        {h:"Weitere Bedingungen", table:{head:["Ausdruck", "Bedeutung"], rows:[["<code>preis BETWEEN 200 AND 1000</code>", "von 200 bis einschließlich 1000"], ["<code>raum IN ('101', '204')</code>", "einer der genannten Werte"], ["<code>name LIKE 'NB-%'</code>", "beginnt mit NB-, <code>%</code> steht für beliebig viele Zeichen, <code>_</code> für genau eines"], ["<code>ip IS NULL</code>", "kein Wert eingetragen"], ["<code>NOT</code>", "kehrt eine Bedingung um"]]}},
        {run:`SELECT name, raum, ip
FROM geraete
WHERE (raum = '204' OR raum = 'Homeoffice')
  AND ip IS NOT NULL;`},
        {warn:"<code>NULL</code> bedeutet: Wert unbekannt. Ein Vergleich wie <code>ip = NULL</code> ergibt nie wahr. Du musst <code>IS NULL</code> oder <code>IS NOT NULL</code> schreiben."},
        {tip:"In SQLite unterscheidet <code>LIKE</code> bei englischen Buchstaben nicht zwischen Groß- und Kleinschreibung, bei Umlauten schon. Andere Datenbanken verhalten sich hier unterschiedlich."}
      ],
      src:[["SQLite: Ausdrücke (BETWEEN, IN, LIKE, IS)", "https://www.sqlite.org/lang_expr.html"], ["SQLite: NULL-Behandlung", "https://www.sqlite.org/nulls.html"]]},
    {id:"sortieren", title:"Sortieren und begrenzen", sum:"ORDER BY, LIMIT und DISTINCT.", task:"alte",
      easy:"ORDER BY sortiert das Ergebnis wie eine Spalte in der Tabellenkalkulation, aufsteigend oder absteigend. LIMIT zeigt nur die ersten Treffer, etwa die drei teuersten Geräte.",
      sec:[
        {p:"Ohne <code>ORDER BY</code> ist die Reihenfolge des Ergebnisses nicht festgelegt. Mit <code>ASC</code> sortierst du aufsteigend (Standard), mit <code>DESC</code> absteigend. Mehrere Sortierspalten trennst du durch Kommas."},
        {run:`SELECT name, typ, preis
FROM geraete
ORDER BY typ, preis DESC;`},
        {h:"Die teuersten drei", run:`SELECT name, preis
FROM geraete
ORDER BY preis DESC
LIMIT 3;`},
        {h:"Doppelte Werte entfernen", p:"<code>DISTINCT</code> zeigt jeden Wert nur einmal."},
        {run:`SELECT DISTINCT raum
FROM geraete
ORDER BY raum;`}
      ],
      src:[["SQLite: ORDER BY", "https://www.sqlite.org/lang_select.html#the_order_by_clause"], ["SQLite: LIMIT und OFFSET", "https://www.sqlite.org/lang_select.html#the_limit_clause"]]},
    {id:"aggregieren", title:"Zählen und zusammenfassen", sum:"COUNT, SUM, AVG, MIN, MAX, GROUP BY und HAVING.", task:"pro-typ",
      easy:"Aggregatfunktionen fassen viele Zeilen zu einer Zahl zusammen: zählen, summieren, Durchschnitt bilden. Mit GROUP BY machst du das für jede Gruppe einzeln, etwa die Anzahl der Geräte pro Raum.",
      sec:[
        {p:"Aggregatfunktionen berechnen einen Wert aus vielen Zeilen: <code>COUNT(*)</code> zählt Zeilen, <code>SUM</code>, <code>AVG</code>, <code>MIN</code> und <code>MAX</code> rechnen mit einer Spalte."},
        {run:`SELECT COUNT(*) AS anzahl,
       SUM(preis) AS gesamtwert,
       ROUND(AVG(preis), 2) AS durchschnitt,
       MIN(kaufjahr) AS aeltestes
FROM geraete;`},
        {h:"GROUP BY", p:"<code>GROUP BY</code> bildet Gruppen mit gleichem Wert und berechnet die Funktion für jede Gruppe."},
        {run:`SELECT raum, COUNT(*) AS anzahl, SUM(preis) AS wert
FROM geraete
GROUP BY raum
ORDER BY wert DESC;`},
        {h:"HAVING", p:"<code>WHERE</code> filtert Zeilen vor dem Gruppieren, <code>HAVING</code> filtert Gruppen danach. Bedingungen mit Aggregatfunktionen gehören deshalb in <code>HAVING</code>."},
        {run:`SELECT typ, COUNT(*) AS anzahl
FROM geraete
WHERE kaufjahr >= 2020
GROUP BY typ
HAVING COUNT(*) >= 2;`},
        {warn:"<code>COUNT(spalte)</code> zählt nur Zeilen, in denen die Spalte nicht NULL ist. <code>COUNT(*)</code> zählt alle Zeilen."}
      ],
      src:[["SQLite: Aggregatfunktionen", "https://www.sqlite.org/lang_aggfunc.html"], ["SQLite: GROUP BY und HAVING", "https://www.sqlite.org/lang_select.html#resultset"]]},
    {id:"join", title:"Tabellen verknüpfen mit JOIN", sum:"INNER JOIN, LEFT JOIN, Fremdschlüssel und Aliase.", task:"offen",
      easy:"Die Tickets wissen nur die Nummer des Mitarbeiters, nicht seinen Namen. Ein JOIN legt zwei Tabellen nebeneinander und verbindet die Zeilen, deren Nummern zusammenpassen, wie zwei Listen, die man über eine gemeinsame Kundennummer zusammenführt.",
      sec:[
        {p:"Tabellen sind über Schlüssel verbunden. <code>tickets.mitarbeiter_id</code> ist ein <i>Fremdschlüssel</i>: Er verweist auf <code>mitarbeiter.id</code>. Mit <code>JOIN ... ON</code> holst du die passenden Zeilen zusammen. Kurze Aliase wie <code>t</code> und <code>m</code> sparen Schreibarbeit."},
        {run:`SELECT t.id, t.titel, m.vorname, m.nachname
FROM tickets AS t
JOIN mitarbeiter AS m ON t.mitarbeiter_id = m.id
ORDER BY t.id;`},
        {h:"LEFT JOIN", p:"<code>JOIN</code> (genauer <code>INNER JOIN</code>) zeigt nur Zeilen mit Partner in beiden Tabellen. <code>LEFT JOIN</code> zeigt alle Zeilen der linken Tabelle, fehlt der Partner, stehen dort NULL-Werte."},
        {run:`SELECT t.titel, g.name AS geraet
FROM tickets AS t
LEFT JOIN geraete AS g ON t.geraet_id = g.id
ORDER BY t.id;`},
        {h:"Drei Tabellen", run:`SELECT m.vorname, g.name, g.typ
FROM mitarbeiter AS m
JOIN geraete AS g ON m.geraet_id = g.id
WHERE g.typ = 'Laptop';`},
        {tip:"Kommt ein Spaltenname in beiden Tabellen vor, etwa <code>id</code>, musst du den Tabellennamen oder Alias davorschreiben. Sonst meldet SQLite <code>ambiguous column name</code>."}
      ],
      src:[["SQLite: JOIN", "https://www.sqlite.org/lang_select.html#joins"], ["SQLite: Fremdschlüssel", "https://www.sqlite.org/foreignkeys.html"]]},
    {id:"aendern", title:"Daten ändern", sum:"INSERT, UPDATE und DELETE, und warum WHERE dabei so wichtig ist.", task:"update",
      easy:"INSERT fügt eine neue Zeile hinzu, UPDATE ändert vorhandene Zeilen, DELETE löscht sie. Bei UPDATE und DELETE sagt WHERE, welche Zeilen gemeint sind. Ohne WHERE trifft es alle Zeilen der Tabelle.",
      sec:[
        {p:"<code>INSERT INTO</code> fügt Zeilen ein. Nennst du die Spalten, ist die Reihenfolge klar und fehlende Spalten bleiben NULL."},
        {run:`INSERT INTO tickets (titel, prioritaet, status, erstellt, mitarbeiter_id)
VALUES ('Headset defekt', 'niedrig', 'offen', '2026-11-02', 7);

SELECT id, titel, status FROM tickets ORDER BY id DESC LIMIT 2;`},
        {h:"UPDATE", run:`UPDATE tickets
SET status = 'erledigt'
WHERE id = 1;

SELECT id, titel, status FROM tickets WHERE id = 1;`},
        {h:"DELETE", run:`DELETE FROM tickets
WHERE status = 'erledigt';

SELECT COUNT(*) AS verbleibend FROM tickets;`},
        {warn:"<code>UPDATE tickets SET status = 'erledigt';</code> ohne WHERE ändert alle Tickets. Prüfe vor einem UPDATE oder DELETE mit einem SELECT und derselben WHERE-Bedingung, welche Zeilen betroffen sind. In echten Datenbanken helfen Transaktionen und Backups."}
      ],
      src:[["SQLite: INSERT", "https://www.sqlite.org/lang_insert.html"], ["SQLite: UPDATE", "https://www.sqlite.org/lang_update.html"], ["SQLite: DELETE", "https://www.sqlite.org/lang_delete.html"]]},
    {id:"tabellen", title:"Tabellen anlegen", sum:"CREATE TABLE, Datentypen, Primärschlüssel und Einschränkungen.", task:"software",
      easy:"Bevor Daten in eine Tabelle passen, legst du ihre Spalten fest, wie die Überschriften einer Liste. Der Primärschlüssel ist eine Nummer, die jede Zeile eindeutig macht, wie eine Inventarnummer.",
      sec:[
        {p:"<code>CREATE TABLE</code> legt eine Tabelle an. Jede Spalte bekommt einen Namen und einen Typ. Der <i>Primärschlüssel</i> (<code>PRIMARY KEY</code>) identifiziert jede Zeile eindeutig. In SQLite vergibt eine Spalte <code>INTEGER PRIMARY KEY</code> automatisch fortlaufende Nummern."},
        {run:`CREATE TABLE lizenzen (
  id INTEGER PRIMARY KEY,
  software TEXT NOT NULL UNIQUE,
  anzahl INTEGER NOT NULL CHECK (anzahl >= 0),
  ablauf TEXT
);
INSERT INTO lizenzen (software, anzahl, ablauf) VALUES ('Office', 25, '2027-03-31');
INSERT INTO lizenzen (software, anzahl) VALUES ('Virenscanner', 40);
SELECT * FROM lizenzen;`},
        {h:"Einschränkungen", table:{head:["Einschränkung", "Bedeutung"], rows:[["<code>PRIMARY KEY</code>", "eindeutiger Schlüssel der Zeile"], ["<code>NOT NULL</code>", "Wert ist Pflicht"], ["<code>UNIQUE</code>", "Wert darf nur einmal vorkommen"], ["<code>CHECK (bedingung)</code>", "Wert muss die Bedingung erfüllen"], ["<code>REFERENCES tabelle(spalte)</code>", "Fremdschlüssel auf eine andere Tabelle"]]}},
        {h:"Datentypen in SQLite", p:"SQLite kennt die Speicherklassen <code>INTEGER</code>, <code>REAL</code>, <code>TEXT</code>, <code>BLOB</code> und <code>NULL</code>. Es ist dabei großzügiger als andere Datenbanken wie MySQL oder PostgreSQL, die etwa <code>VARCHAR(50)</code> oder <code>DATE</code> streng prüfen. Ein Datum speichert man in SQLite meist als Text im Format <code>JJJJ-MM-TT</code>."},
        {run:`CREATE TABLE test (wert INTEGER NOT NULL);
INSERT INTO test VALUES (NULL);`},
        {tip:"<code>DROP TABLE name;</code> löscht eine Tabelle mitsamt allen Daten."}
      ],
      src:[["SQLite: CREATE TABLE", "https://www.sqlite.org/lang_createtable.html"], ["SQLite: Datentypen", "https://www.sqlite.org/datatype3.html"], ["SQLite: ROWID und INTEGER PRIMARY KEY", "https://www.sqlite.org/lang_createtable.html#rowid"]]}
  ],
  tasks:[
    {id:"laptops", level:1, lesson:"select", title:"Alle Laptops",
      text:"<p>Zeige Name und Raum aller Geräte vom Typ <code>Laptop</code>.</p>",
      start:`SELECT
FROM geraete
WHERE ;
`,
      solution:`SELECT name, raum
FROM geraete
WHERE typ = 'Laptop';`,
      hints:["Die Spalten heißen <code>name</code> und <code>raum</code>.", "Texte vergleichst du in einfachen Anführungszeichen: <code>typ = 'Laptop'</code>."]},
    {id:"alte", level:1, lesson:"sortieren", title:"Alte Geräte",
      text:"<p>Zeige Name und Kaufjahr aller Geräte, die vor 2021 gekauft wurden. Sortiere nach Kaufjahr, bei gleichem Jahr nach Name.</p>",
      ordered:true,
      start:`SELECT name, kaufjahr
FROM geraete
`,
      solution:`SELECT name, kaufjahr
FROM geraete
WHERE kaufjahr < 2021
ORDER BY kaufjahr, name;`,
      hints:["Filtern: <code>WHERE kaufjahr &lt; 2021</code>", "Sortieren nach zwei Spalten: <code>ORDER BY kaufjahr, name</code>"]},
    {id:"pro-typ", level:2, lesson:"aggregieren", title:"Geräte pro Typ",
      text:"<p>Zeige für jeden Gerätetyp, wie viele Geräte es davon gibt. Das Ergebnis hat zwei Spalten: den Typ und die Anzahl.</p>",
      start:`SELECT typ,
FROM geraete
`,
      solution:`SELECT typ, COUNT(*) AS anzahl
FROM geraete
GROUP BY typ;`,
      hints:["Zählen mit <code>COUNT(*)</code>.", "Gruppieren mit <code>GROUP BY typ</code>."]},
    {id:"schnitt", level:2, lesson:"aggregieren", title:"Durchschnittspreis",
      text:"<p>Wie viel hat ein Laptop im Durchschnitt gekostet? Gib den Wert auf zwei Nachkommastellen gerundet aus, als einzige Spalte.</p>",
      start:`SELECT
FROM geraete
WHERE typ = 'Laptop';
`,
      solution:`SELECT ROUND(AVG(preis), 2) AS durchschnitt
FROM geraete
WHERE typ = 'Laptop';`,
      hints:["<code>AVG(preis)</code> berechnet den Durchschnitt.", "<code>ROUND(wert, 2)</code> rundet auf zwei Stellen."]},
    {id:"offen", level:2, lesson:"join", title:"Offene Tickets mit Namen",
      text:"<p>Zeige für alle Tickets mit dem Status <code>offen</code> den Titel sowie Vor- und Nachnamen der Person, die das Ticket gemeldet hat.</p>",
      start:`SELECT t.titel,
FROM tickets AS t
`,
      solution:`SELECT t.titel, m.vorname, m.nachname
FROM tickets AS t
JOIN mitarbeiter AS m ON t.mitarbeiter_id = m.id
WHERE t.status = 'offen';`,
      hints:["Verknüpfe über <code>JOIN mitarbeiter AS m ON t.mitarbeiter_id = m.id</code>.", "Filtere danach mit <code>WHERE t.status = 'offen'</code>."]},
    {id:"ohne-ticket", level:3, lesson:"join", title:"Geräte ohne Ticket",
      text:"<p>Welche Geräte hatten noch nie ein Ticket? Zeige ihren Namen.</p>",
      start:`SELECT g.name
FROM geraete AS g
`,
      solution:`SELECT g.name
FROM geraete AS g
LEFT JOIN tickets AS t ON t.geraet_id = g.id
WHERE t.id IS NULL;`,
      hints:["Mit <code>LEFT JOIN tickets</code> bleiben auch Geräte ohne Ticket im Ergebnis.", "Bei ihnen sind alle Ticket-Spalten NULL: <code>WHERE t.id IS NULL</code>"]},
    {id:"raeume", level:3, lesson:"aggregieren", title:"Volle Räume",
      text:"<p>Zeige alle Räume, in denen mehr als zwei Geräte stehen, zusammen mit der Anzahl der Geräte.</p>",
      start:`SELECT raum, COUNT(*) AS anzahl
FROM geraete
`,
      solution:`SELECT raum, COUNT(*) AS anzahl
FROM geraete
GROUP BY raum
HAVING COUNT(*) > 2;`,
      hints:["Gruppiere nach Raum.", "Gruppen filterst du mit <code>HAVING</code>, nicht mit <code>WHERE</code>."]},
    {id:"update", level:2, lesson:"aendern", title:"Ticket schließen",
      text:"<p>Das Ticket mit der id 4 ist erledigt. Setze seinen Status auf <code>erledigt</code>. Zeige danach id und Titel aller Tickets, die noch <code>offen</code> sind.</p>",
      start:`UPDATE tickets

SELECT id, titel FROM tickets WHERE status = 'offen';
`,
      solution:`UPDATE tickets
SET status = 'erledigt'
WHERE id = 4;

SELECT id, titel FROM tickets WHERE status = 'offen';`,
      hints:["<code>UPDATE tickets SET status = 'erledigt' WHERE id = 4;</code> Achte auf das Semikolon vor dem SELECT.", "Ohne WHERE würdest du alle Tickets schließen."]},
    {id:"software", level:3, lesson:"tabellen", title:"Software-Tabelle",
      text:"<p>Lege eine Tabelle <code>software</code> mit den Spalten <code>id</code> (Primärschlüssel), <code>name</code> (Text, Pflicht) und <code>version</code> (Text) an. Füge die Zeilen <code>Firefox</code> mit Version <code>144.0</code> und <code>VLC</code> mit Version <code>3.0.21</code> ein und zeige danach Name und Version aller Einträge.</p>",
      start:`CREATE TABLE software (

);
`,
      solution:`CREATE TABLE software (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT
);
INSERT INTO software (name, version) VALUES ('Firefox', '144.0');
INSERT INTO software (name, version) VALUES ('VLC', '3.0.21');
SELECT name, version FROM software;`,
      hints:["Spaltendefinitionen trennst du mit Kommas: <code>id INTEGER PRIMARY KEY, name TEXT NOT NULL, version TEXT</code>", "Versionsnummern wie <code>'3.0.21'</code> sind Text und stehen in Anführungszeichen."]}
  ]
});
