/*! IT-Lernlabor · © 2026 Alexander S. · Alle Rechte vorbehalten. Nutzung nur nach LICENSE. */
/* Programmieren: Python. Lektionen und Aufgaben für Einsteiger, jede Lektion mit Quelle aus der offiziellen Dokumentation.
   Aufgaben werden mit Tests geprüft: Eingaben (input) und erwartete Ausgabe. */
(window.LERN_CODE = window.LERN_CODE || []).push({
  id:"python", title:"Python", badge:"Py", color:"#0a84ff",
  sub:"Leicht lesbar, ideal für Skripte und Automatisierung",
  version:"Python 3.14, echtes CPython im Browser",
  why:"In der Systemintegration automatisierst du mit Python wiederkehrende Aufgaben: Logdateien auswerten, Listen von Geräten prüfen, Konfigurationen erzeugen.",
  easy:"Ein Programm ist eine Liste von Anweisungen, die der Computer der Reihe nach abarbeitet, wie ein Rezept. Python liest sich fast wie Englisch und ist deshalb ein guter erster Schritt. Du schreibst eine Zeile, führst sie aus und siehst sofort, was passiert.",
  starter:`# Dein Python-Terminal. Ändere den Code und tippe auf Ausführen.
name = input("Wie heißt du? ")
print(f"Hallo {name}, willkommen im IT-Lernlabor!")
`,
  sources:[
    ["Python-Tutorial (docs.python.org)", "https://docs.python.org/3/tutorial/index.html"],
    ["Eingebaute Funktionen", "https://docs.python.org/3/library/functions.html"],
    ["Eingebaute Datentypen", "https://docs.python.org/3/library/stdtypes.html"]
  ],
  lessons:[
    {id:"erste-schritte", title:"Dein erstes Programm", sum:"print, Kommentare und wie Python Zeile für Zeile arbeitet.", task:"hallo",
      easy:"print ist wie ein Lautsprecher: Alles, was du in die Klammern schreibst, sagt das Programm laut auf dem Bildschirm. Texte stehen in Anführungszeichen, damit Python weiß, wo sie anfangen und aufhören.",
      sec:[
        {p:"Ein Python-Programm ist eine Textdatei mit Anweisungen. Python führt sie von oben nach unten aus, eine Zeile nach der anderen. Die wichtigste Anweisung für den Anfang ist <code>print</code>: Sie gibt etwas auf dem Bildschirm aus."},
        {run:`print("Hallo Welt!")
print("Ich lerne Python.")
print(7 + 5)`},
        {h:"Texte und Zahlen", p:"Text heißt in Python <i>String</i> und steht in Anführungszeichen. Ob einfache <code>'...'</code> oder doppelte <code>\"...\"</code>, ist egal, sie müssen nur zusammenpassen. Zahlen schreibst du ohne Anführungszeichen. Python rechnet <code>7 + 5</code> aus, der String <code>\"7 + 5\"</code> bleibt dagegen Text."},
        {h:"Mehrere Werte und Kommentare", p:"Trennst du Werte in <code>print</code> mit Kommas, setzt Python automatisch ein Leerzeichen dazwischen. Alles hinter <code>#</code> ist ein Kommentar: Python ignoriert es, Menschen lesen es."},
        {run:`# Das ist ein Kommentar
print("Raum", 204, "hat", 12, "Rechner")
print()          # gibt eine leere Zeile aus
print("Ende")`},
        {warn:"Groß- und Kleinschreibung zählt. <code>Print(\"Hallo\")</code> mit großem P führt zu <code>NameError: name 'Print' is not defined</code>."},
        {tip:"Fehlermeldungen liest du von unten nach oben: In der letzten Zeile steht, was passiert ist, darüber, in welcher Zeile."}
      ],
      src:[["Python-Tutorial: Eine informelle Einführung", "https://docs.python.org/3/tutorial/introduction.html"], ["Funktion print()", "https://docs.python.org/3/library/functions.html#print"]]},
    {id:"variablen", title:"Variablen und Datentypen", sum:"Werte speichern: int, float, str und bool.", task:"steckbrief",
      easy:"Eine Variable ist wie eine beschriftete Kiste. Auf dem Etikett steht der Name, drinnen liegt ein Wert. Mit dem Gleichheitszeichen legst du etwas in die Kiste. Später holst du den Wert über den Namen wieder heraus.",
      sec:[
        {p:"Mit <code>=</code> gibst du einem Wert einen Namen. Das ist eine <i>Zuweisung</i>, kein Vergleich. Danach kannst du den Namen überall statt des Wertes verwenden."},
        {run:`hostname = "pc-raum204-07"
anzahl_kerne = 8
takt_ghz = 3.6
ist_online = True

print(hostname, "hat", anzahl_kerne, "Kerne mit", takt_ghz, "GHz")
print("Online:", ist_online)`},
        {h:"Die wichtigsten Datentypen", table:{head:["Typ", "Bedeutung", "Beispiel"], rows:[["<code>int</code>", "ganze Zahl", "<code>42</code>, <code>-7</code>"], ["<code>float</code>", "Kommazahl, mit Punkt geschrieben", "<code>3.6</code>, <code>0.5</code>"], ["<code>str</code>", "Text (String)", "<code>\"Router\"</code>"], ["<code>bool</code>", "Wahrheitswert", "<code>True</code>, <code>False</code>"]]}},
        {p:"Mit <code>type()</code> fragst du ab, welchen Typ ein Wert hat. Python legt den Typ selbst fest, du schreibst ihn nicht dazu. Eine Variable kann später auch einen Wert anderen Typs bekommen."},
        {run:`preis = 499.90
print(type(preis))
preis = "unbekannt"
print(type(preis))`},
        {h:"Regeln für Namen", list:["Buchstaben, Ziffern und Unterstrich, aber nicht mit einer Ziffer beginnen", "keine Leerzeichen: <code>anzahl_geraete</code> statt <code>anzahl geraete</code>", "Groß- und Kleinschreibung zählt: <code>Name</code> und <code>name</code> sind zwei Variablen", "In Python üblich: kleine Wörter mit Unterstrich (snake_case)"]},
        {tip:"Das Dezimaltrennzeichen ist in Python immer der Punkt: <code>3.6</code>. <code>3,6</code> wäre ein Tupel aus den Zahlen 3 und 6."}
      ],
      src:[["Python-Tutorial: Zahlen und Text", "https://docs.python.org/3/tutorial/introduction.html#using-python-as-a-calculator"], ["Eingebaute Datentypen", "https://docs.python.org/3/library/stdtypes.html"], ["PEP 8: Namenskonventionen", "https://peps.python.org/pep-0008/#naming-conventions"]]},
    {id:"rechnen", title:"Rechnen mit Python", sum:"Operatoren, ganzzahlige Division, Rest und Rundung.", task:"rechner",
      easy:"Python ist ein sehr schneller Taschenrechner. Plus, Minus und Mal kennst du schon. Neu sind nur zwei Zeichen: // teilt und schneidet die Nachkommastellen ab, % liefert den Rest, wie beim schriftlichen Teilen in der Grundschule.",
      sec:[
        {table:{head:["Operator", "Bedeutung", "Beispiel", "Ergebnis"], rows:[["<code>+</code>", "Addition", "<code>7 + 2</code>", "<code>9</code>"], ["<code>-</code>", "Subtraktion", "<code>7 - 2</code>", "<code>5</code>"], ["<code>*</code>", "Multiplikation", "<code>7 * 2</code>", "<code>14</code>"], ["<code>/</code>", "Division, immer float", "<code>7 / 2</code>", "<code>3.5</code>"], ["<code>//</code>", "ganzzahlige Division", "<code>7 // 2</code>", "<code>3</code>"], ["<code>%</code>", "Rest (Modulo)", "<code>7 % 2</code>", "<code>1</code>"], ["<code>**</code>", "Potenz", "<code>2 ** 10</code>", "<code>1024</code>"]]}},
        {run:`gesamt_gb = 1000
genutzt_gb = 734
print("Frei:", gesamt_gb - genutzt_gb, "GB")
print("Belegt:", genutzt_gb / gesamt_gb * 100, "%")

sekunden = 3725
print(sekunden // 60, "Minuten und", sekunden % 60, "Sekunden")
print("Adressen in IPv4:", 2 ** 32)`},
        {h:"Rangfolge", p:"Python rechnet wie in der Mathematik: zuerst <code>**</code>, dann Punkt- vor Strichrechnung. Mit Klammern legst du die Reihenfolge selbst fest: <code>(2 + 3) * 4</code> ergibt 20, <code>2 + 3 * 4</code> ergibt 14."},
        {h:"Kommazahlen sind nicht exakt", p:"Computer speichern Kommazahlen binär. Manche Dezimalzahlen wie 0.1 lassen sich so nicht genau darstellen. Deshalb ergibt <code>0.1 + 0.2</code> nicht genau 0.3. Zum Anzeigen rundest du mit <code>round(wert, stellen)</code>."},
        {run:`print(0.1 + 0.2)
print(round(0.1 + 0.2, 2))
print(round(2.5), round(3.5))`},
        {tip:"<code>round()</code> rundet bei genau ,5 auf die nächste gerade Zahl. Deshalb ergibt <code>round(2.5)</code> 2 und <code>round(3.5)</code> 4. So steht es in der Dokumentation."}
      ],
      src:[["Python-Tutorial: Python als Taschenrechner", "https://docs.python.org/3/tutorial/introduction.html#numbers"], ["Gleitkomma-Arithmetik: Probleme und Grenzen", "https://docs.python.org/3/tutorial/floatingpoint.html"], ["Funktion round()", "https://docs.python.org/3/library/functions.html#round"]]},
    {id:"texte", title:"Texte bearbeiten", sum:"Strings verbinden, zerlegen, durchsuchen und mit f-Strings formatieren.", task:"initialen",
      easy:"Ein String ist eine Perlenkette aus Zeichen. Jede Perle hat eine Nummer, die erste die 0. So kannst du einzelne Zeichen oder ein Stück der Kette herausholen. Mit f-Strings baust du Werte bequem in einen Text ein.",
      sec:[
        {p:"Strings verbindest du mit <code>+</code>. Die Länge liefert <code>len()</code>. Über einen Index in eckigen Klammern holst du einzelne Zeichen: Der erste Index ist 0, der letzte -1."},
        {run:`server = "fileserver01"
print(len(server))
print(server[0], server[-1])
print(server[0:4])      # Zeichen 0 bis 3
print(server[4:])       # ab Zeichen 4 bis zum Ende
print("Ping an " + server)`},
        {h:"Nützliche Methoden", table:{head:["Methode", "Wirkung", "Beispiel"], rows:[["<code>upper()</code>, <code>lower()</code>", "Groß- oder Kleinbuchstaben", "<code>\"Ab\".upper()</code> ergibt <code>\"AB\"</code>"], ["<code>strip()</code>", "Leerzeichen am Rand entfernen", "<code>\" x \".strip()</code>"], ["<code>replace(alt, neu)</code>", "Teile ersetzen", "<code>\"a-b\".replace(\"-\", \":\")</code>"], ["<code>split(trenner)</code>", "in eine Liste zerlegen", "<code>\"10.0.0.1\".split(\".\")</code>"], ["<code>startswith()</code>, <code>endswith()</code>", "Anfang oder Ende prüfen", "<code>\"log.txt\".endswith(\".txt\")</code>"], ["<code>in</code>", "Teil enthalten?", "<code>\"err\" in \"error\"</code>"]]}},
        {run:`mac = "00-1A-2B-3C-4D-5E"
print(mac.replace("-", ":").lower())
ip = "192.168.10.25"
teile = ip.split(".")
print(teile)
print("Letztes Oktett:", teile[3])`},
        {h:"f-Strings", p:"Ein f vor dem Anführungszeichen macht einen f-String. In geschweiften Klammern stehen Variablen oder Rechnungen, Python setzt ihren Wert ein. Hinter einem Doppelpunkt legst du das Format fest, <code>:.2f</code> bedeutet zwei Nachkommastellen."},
        {run:`name = "Drucker 3. OG"
seiten = 1234
toner = 0.18
print(f"{name}: {seiten} Seiten gedruckt")
print(f"Toner noch {toner * 100:.0f} %")
print(f"Kosten: {seiten * 0.035:.2f} Euro")`},
        {warn:"Strings lassen sich nicht verändern. <code>text.upper()</code> liefert einen neuen String. Willst du ihn behalten, weise ihn zu: <code>text = text.upper()</code>."}
      ],
      src:[["Python-Tutorial: Text", "https://docs.python.org/3/tutorial/introduction.html#text"], ["String-Methoden", "https://docs.python.org/3/library/stdtypes.html#string-methods"], ["f-Strings (formatierte String-Literale)", "https://docs.python.org/3/reference/lexical_analysis.html#f-strings"]]},
    {id:"eingabe", title:"Eingaben vom Benutzer", sum:"input liefert Text. Mit int und float wird daraus eine Zahl.", task:"celsius",
      easy:"input stellt eine Frage und wartet, bis jemand etwas eintippt und Enter drückt. Die Antwort ist immer Text, auch wenn jemand eine Zahl tippt. Zum Rechnen musst du sie erst in eine Zahl umwandeln, so wie man eine geschriebene Zahl erst lesen muss, bevor man mit ihr rechnet.",
      sec:[
        {p:"<code>input(\"Frage \")</code> zeigt den Text an, wartet auf eine Eingabe und gibt sie als String zurück. Probiere es aus: Das Terminal fragt dich unten nach deinem Namen."},
        {run:`name = input("Wie heißt du? ")
print("Hallo", name)`},
        {h:"Aus Text wird eine Zahl", p:"Weil <code>input</code> immer Text liefert, ergibt <code>\"3\" + \"4\"</code> den Text <code>\"34\"</code>. Zum Rechnen wandelst du um: <code>int()</code> für ganze Zahlen, <code>float()</code> für Kommazahlen."},
        {run:`anzahl = int(input("Wie viele Rechner? "))
preis = float(input("Preis pro Rechner in Euro? "))
print(f"Gesamt: {anzahl * preis:.2f} Euro")`},
        {warn:"Tippt jemand Buchstaben oder ein Komma, scheitert die Umwandlung mit <code>ValueError</code>. Bei <code>float()</code> gilt der Punkt als Dezimaltrennzeichen: <code>3.5</code> klappt, <code>3,5</code> nicht. Wie du solche Fehler abfängst, zeigt die Lektion über Fehler."},
        {tip:"<code>str(42)</code> macht aus einer Zahl wieder Text. Meist ist ein f-String bequemer: <code>f\"{anzahl} Stück\"</code>."}
      ],
      src:[["Funktion input()", "https://docs.python.org/3/library/functions.html#input"], ["Funktion int()", "https://docs.python.org/3/library/functions.html#int"], ["Funktion float()", "https://docs.python.org/3/library/functions.html#float"]]},
    {id:"verzweigungen", title:"Entscheidungen mit if", sum:"if, elif und else, Vergleiche und logische Operatoren.", task:"note",
      easy:"Mit if trifft dein Programm Entscheidungen wie eine Ampel: Wenn rot, dann halten, sonst fahren. Die Bedingung ist eine Frage, die mit Ja oder Nein beantwortet wird. Was eingerückt darunter steht, passiert nur bei Ja.",
      sec:[
        {p:"Nach <code>if</code> steht eine Bedingung, danach ein Doppelpunkt. Die eingerückten Zeilen darunter laufen nur, wenn die Bedingung wahr ist. <code>elif</code> prüft eine weitere Bedingung, <code>else</code> fängt alles Übrige auf."},
        {run:`speicher_frei = int(input("Freier Speicher in Prozent: "))
if speicher_frei < 10:
    print("Kritisch: sofort aufräumen!")
elif speicher_frei < 25:
    print("Warnung: Speicher wird knapp.")
else:
    print("Alles in Ordnung.")`},
        {h:"Vergleiche", table:{head:["Operator", "Bedeutung"], rows:[["<code>==</code>", "gleich"], ["<code>!=</code>", "ungleich"], ["<code>&lt;</code>, <code>&gt;</code>", "kleiner, größer"], ["<code>&lt;=</code>, <code>&gt;=</code>", "kleiner oder gleich, größer oder gleich"]]}},
        {h:"Bedingungen verknüpfen", p:"<code>and</code> ist nur wahr, wenn beide Seiten wahr sind. <code>or</code> ist wahr, wenn mindestens eine Seite wahr ist. <code>not</code> kehrt um. Python erlaubt auch Ketten wie <code>0 &lt;= port &lt;= 65535</code>."},
        {run:`port = 8080
if 0 <= port <= 65535:
    print("Gültiger Port")
if port == 80 or port == 443:
    print("Webserver-Standardport")
else:
    print("Kein Standardport für Webserver")`},
        {warn:"Die Einrückung gehört in Python zur Sprache. Üblich sind 4 Leerzeichen. Fehlt sie nach einem Doppelpunkt, meldet Python <code>IndentationError</code>."},
        {tip:"<code>=</code> weist zu, <code>==</code> vergleicht. <code>if x = 5:</code> ist ein Syntaxfehler."}
      ],
      src:[["Python-Tutorial: if-Anweisungen", "https://docs.python.org/3/tutorial/controlflow.html#if-statements"], ["Vergleiche", "https://docs.python.org/3/library/stdtypes.html#comparisons"], ["Boolesche Operatoren", "https://docs.python.org/3/library/stdtypes.html#boolean-operations-and-or-not"]]},
    {id:"schleifen", title:"Schleifen", sum:"Wiederholen mit for und while, range, break und continue.", task:"einmaleins",
      easy:"Eine Schleife ist wie ein Fließband: Dieselben Handgriffe werden immer wieder ausgeführt, bis alles erledigt ist. for zählt eine feste Anzahl durch, while wiederholt so lange, wie eine Bedingung gilt.",
      sec:[
        {p:"<code>for</code> geht der Reihe nach durch eine Folge. <code>range(1, 6)</code> liefert die Zahlen 1 bis 5, die Endzahl ist nicht dabei. Mit einem dritten Wert gibst du die Schrittweite an."},
        {run:`for nummer in range(1, 6):
    print(f"pc-{nummer:02d} wird geprüft")

for i in range(10, 0, -3):
    print(i)`},
        {h:"while", p:"<code>while</code> wiederholt, solange die Bedingung wahr ist. Achte darauf, dass sie irgendwann falsch wird, sonst läuft die Schleife endlos."},
        {run:`versuche = 0
kapazitaet = 100
while kapazitaet > 20:
    kapazitaet -= 30
    versuche += 1
print("Nach", versuche, "Runden sind noch", kapazitaet, "% übrig")`},
        {h:"break und continue", p:"<code>break</code> beendet die Schleife sofort. <code>continue</code> springt zum nächsten Durchlauf."},
        {run:`for port in range(20, 30):
    if port == 22:
        print(port, "SSH, überspringen")
        continue
    if port == 25:
        print(port, "SMTP gefunden, fertig")
        break
    print(port)`},
        {h:"Summieren", p:"Ein typisches Muster: Vor der Schleife eine Variable mit 0 anlegen, in der Schleife etwas dazuzählen, danach ausgeben."},
        {run:`summe = 0
for zahl in range(1, 101):
    summe += zahl
print("1 + 2 + ... + 100 =", summe)`}
      ],
      src:[["Python-Tutorial: for-Anweisungen", "https://docs.python.org/3/tutorial/controlflow.html#for-statements"], ["Die Funktion range()", "https://docs.python.org/3/tutorial/controlflow.html#the-range-function"], ["break und continue", "https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements"]]},
    {id:"listen", title:"Listen", sum:"Mehrere Werte in einer Liste speichern, ändern, sortieren und durchlaufen.", task:"statistik",
      easy:"Eine Liste ist wie eine Einkaufsliste: Die Einträge haben eine feste Reihenfolge, du kannst etwas anhängen, streichen oder nachsehen, was an dritter Stelle steht. Gezählt wird ab 0.",
      sec:[
        {p:"Eine Liste schreibst du in eckigen Klammern. Wie bei Strings greifst du per Index auf Einträge zu. Anders als Strings lassen sich Listen verändern."},
        {run:`geraete = ["Router", "Switch", "Firewall"]
print(geraete[0])
geraete.append("Access Point")
geraete[1] = "Core-Switch"
print(geraete)
print(len(geraete), "Geräte")
print("Firewall" in geraete)`},
        {h:"Wichtige Operationen", table:{head:["Befehl", "Wirkung"], rows:[["<code>liste.append(x)</code>", "x hinten anhängen"], ["<code>liste.insert(i, x)</code>", "x an Position i einfügen"], ["<code>liste.remove(x)</code>", "ersten Eintrag mit Wert x entfernen"], ["<code>liste.pop()</code>", "letzten Eintrag entfernen und zurückgeben"], ["<code>liste.sort()</code>", "die Liste selbst sortieren"], ["<code>sorted(liste)</code>", "sortierte Kopie zurückgeben"], ["<code>sum</code>, <code>min</code>, <code>max</code>", "Summe, kleinster, größter Wert"]]}},
        {run:`pings = [23, 18, 145, 20, 31]
print("Durchschnitt:", sum(pings) / len(pings), "ms")
print("Schnellster:", min(pings), "ms, langsamster:", max(pings), "ms")
print(sorted(pings))
for ms in pings:
    if ms > 100:
        print("Ausreißer:", ms)`},
        {h:"Index und Wert zusammen", p:"<code>enumerate</code> liefert beim Durchlaufen zusätzlich die Position."},
        {run:`raeume = ["101", "204", "Serverraum"]
for nr, raum in enumerate(raeume, start=1):
    print(nr, raum)`},
        {warn:"Ein Index außerhalb der Liste führt zu <code>IndexError: list index out of range</code>. Bei 3 Einträgen sind 0, 1 und 2 gültig."}
      ],
      src:[["Python-Tutorial: Listen", "https://docs.python.org/3/tutorial/introduction.html#lists"], ["Mehr über Listen", "https://docs.python.org/3/tutorial/datastructures.html#more-on-lists"], ["Funktion sorted()", "https://docs.python.org/3/library/functions.html#sorted"]]},
    {id:"dictionaries", title:"Dictionaries", sum:"Werte über einen Schlüssel nachschlagen, zählen und durchlaufen.", task:"woerter",
      easy:"Ein Dictionary funktioniert wie ein Telefonbuch: Du schlägst einen Namen nach und findest die passende Nummer. Der Name ist der Schlüssel, die Nummer der Wert. Jeder Schlüssel kommt nur einmal vor.",
      sec:[
        {p:"Ein Dictionary (dict) ordnet Schlüsseln Werte zu. Du schreibst es in geschweiften Klammern mit <code>schlüssel: wert</code>. Zugriff und Änderung laufen über den Schlüssel in eckigen Klammern."},
        {run:`dns = {"intranet": "10.0.0.5", "mail": "10.0.0.8", "drucker": "10.0.0.20"}
print(dns["mail"])
dns["backup"] = "10.0.0.30"      # neuer Eintrag
dns["mail"] = "10.0.0.9"         # Wert ändern
print(len(dns), "Einträge")
for name, ip in dns.items():
    print(f"{name:10} {ip}")`},
        {h:"Sicher nachschlagen", p:"Fehlt ein Schlüssel, führt <code>dns[\"wiki\"]</code> zu einem <code>KeyError</code>. Mit <code>get</code> bekommst du stattdessen <code>None</code> oder einen Standardwert. Mit <code>in</code> prüfst du vorher, ob es den Schlüssel gibt."},
        {run:`dns = {"intranet": "10.0.0.5"}
print(dns.get("wiki"))
print(dns.get("wiki", "nicht eingetragen"))
print("intranet" in dns)`},
        {h:"Zählen mit einem Dictionary", p:"Ein häufiges Muster: Für jedes Element den Zähler erhöhen. <code>get(x, 0)</code> liefert 0, wenn es noch keinen Eintrag gibt."},
        {run:`meldungen = ["INFO", "WARN", "INFO", "ERROR", "INFO", "WARN"]
anzahl = {}
for stufe in meldungen:
    anzahl[stufe] = anzahl.get(stufe, 0) + 1
print(anzahl)`},
        {tip:"Seit Python 3.7 behalten Dictionaries die Reihenfolge, in der die Schlüssel eingefügt wurden."}
      ],
      src:[["Python-Tutorial: Dictionaries", "https://docs.python.org/3/tutorial/datastructures.html#dictionaries"], ["Mapping-Typen (dict)", "https://docs.python.org/3/library/stdtypes.html#mapping-types-dict"]]},
    {id:"funktionen", title:"Funktionen", sum:"Eigene Funktionen mit def, Parametern und return.", task:"subnetz",
      easy:"Eine Funktion ist wie eine Kaffeemaschine: Du gibst etwas hinein (die Parameter), sie erledigt immer denselben Ablauf und gibt etwas heraus (mit return). Einmal gebaut, kannst du sie beliebig oft benutzen.",
      sec:[
        {p:"Mit <code>def</code> legst du eine Funktion an. In Klammern stehen die Parameter. <code>return</code> gibt ein Ergebnis zurück und beendet die Funktion. Erst der Aufruf führt den Code aus."},
        {run:`def hosts(praefix):
    """Nutzbare IPv4-Hostadressen in einem Netz mit diesem Präfix."""
    return 2 ** (32 - praefix) - 2

print(hosts(24))
print(hosts(28))
for p in [16, 24, 30]:
    print(f"/{p}: {hosts(p)} Hosts")`},
        {h:"Standardwerte und benannte Argumente", p:"Parameter können einen Standardwert haben. Beim Aufruf kannst du Argumente auch mit Namen übergeben, dann ist die Reihenfolge egal."},
        {run:`def ping_meldung(host, ms, grenze=100):
    if ms > grenze:
        return f"{host}: langsam ({ms} ms)"
    return f"{host}: ok ({ms} ms)"

print(ping_meldung("gateway", 12))
print(ping_meldung("vpn", 180))
print(ping_meldung("vpn", 180, grenze=200))`},
        {h:"Lokale Variablen", p:"Variablen, die du in einer Funktion anlegst, gibt es nur dort. Ergebnisse gibst du deshalb mit <code>return</code> nach außen, statt globale Variablen zu ändern."},
        {warn:"<code>print</code> zeigt nur etwas an, <code>return</code> gibt einen Wert zurück. Eine Funktion ohne <code>return</code> liefert <code>None</code>."}
      ],
      src:[["Python-Tutorial: Funktionen definieren", "https://docs.python.org/3/tutorial/controlflow.html#defining-functions"], ["Mehr über Funktionen", "https://docs.python.org/3/tutorial/controlflow.html#more-on-defining-functions"]]},
    {id:"fehler", title:"Fehler verstehen und abfangen", sum:"Tracebacks lesen, try und except, eigene Fehler mit raise.", task:"sicher-teilen",
      easy:"Fehler sind keine Katastrophe, sondern Hinweise. Python sagt dir genau, in welcher Zeile was schiefging. Mit try und except baust du ein Sicherheitsnetz: Wenn etwas schiefgeht, fängt das Netz den Fehler auf und dein Programm macht vernünftig weiter.",
      sec:[
        {p:"Bei einem Fehler zeigt Python einen <i>Traceback</i>. Die letzte Zeile nennt Art und Grund des Fehlers, darüber stehen Datei und Zeile. Führe das Beispiel aus und lies die Meldung von unten nach oben."},
        {run:`werte = [10, 20, 30]
print(werte[1])
print(werte[5])`},
        {h:"try und except", p:"Code, der scheitern kann, schreibst du in einen <code>try</code>-Block. Tritt der genannte Fehler auf, springt Python in den passenden <code>except</code>-Block, statt abzubrechen."},
        {run:`eingabe = input("Anzahl Benutzer: ")
try:
    anzahl = int(eingabe)
    print("Lizenzen:", anzahl)
except ValueError:
    print(f"'{eingabe}' ist keine ganze Zahl.")`},
        {h:"Häufige Fehlerarten", table:{head:["Fehler", "Typische Ursache"], rows:[["<code>SyntaxError</code>", "Tippfehler im Code, etwa fehlende Klammer oder fehlender Doppelpunkt"], ["<code>NameError</code>", "Name falsch geschrieben oder noch nicht angelegt"], ["<code>TypeError</code>", "Typen passen nicht, etwa Text plus Zahl"], ["<code>ValueError</code>", "richtiger Typ, falscher Wert, etwa <code>int(\"abc\")</code>"], ["<code>ZeroDivisionError</code>", "Division durch 0"], ["<code>IndexError</code>, <code>KeyError</code>", "Index oder Schlüssel gibt es nicht"]]}},
        {h:"Selbst einen Fehler auslösen", p:"Mit <code>raise</code> meldest du selbst einen Fehler, zum Beispiel bei ungültigen Werten. <code>finally</code> läuft immer, ob ein Fehler auftrat oder nicht."},
        {run:`def setze_vlan(nummer):
    if not 1 <= nummer <= 4094:
        raise ValueError(f"VLAN {nummer} ist ungültig")
    return f"VLAN {nummer} gesetzt"

for v in [10, 5000]:
    try:
        print(setze_vlan(v))
    except ValueError as fehler:
        print("Fehler:", fehler)
    finally:
        print("Prüfung beendet")`}
      ],
      src:[["Python-Tutorial: Fehler und Ausnahmen", "https://docs.python.org/3/tutorial/errors.html"], ["Eingebaute Ausnahmen", "https://docs.python.org/3/library/exceptions.html"]]},
    {id:"module-dateien", title:"Module und Dateien", sum:"import, die Module math und random, Textdateien schreiben und lesen.", task:"logs",
      easy:"Module sind Werkzeugkästen, die Python schon mitbringt. Mit import holst du dir einen Kasten auf den Tisch. Dateien sind wie Notizzettel: Du kannst etwas daraufschreiben und es später wieder lesen.",
      sec:[
        {p:"Python bringt eine große Standardbibliothek mit. Mit <code>import</code> lädst du ein Modul und nutzt seine Funktionen mit einem Punkt davor."},
        {run:`import math
import random

print(math.sqrt(144))
print(math.ceil(10 / 3))        # immer aufrunden
print(random.randint(1, 6))     # Würfel
print(random.choice(["Rot", "Grün", "Blau"]))`},
        {h:"Dateien schreiben und lesen", p:"<code>open(name, \"w\")</code> öffnet eine Datei zum Schreiben, <code>\"r\"</code> zum Lesen, <code>\"a\"</code> zum Anhängen. Mit <code>with</code> wird die Datei am Ende automatisch geschlossen. Im Lernlabor liegen Dateien in einem virtuellen Speicher des Browsers."},
        {run:`with open("server.log", "w", encoding="utf-8") as datei:
    datei.write("10:00 INFO Dienst gestartet\\n")
    datei.write("10:05 ERROR Festplatte voll\\n")
    datei.write("10:07 INFO Backup fertig\\n")

with open("server.log", encoding="utf-8") as datei:
    for zeile in datei:
        zeit, stufe, text = zeile.strip().split(" ", 2)
        if stufe == "ERROR":
            print("Fehler um", zeit + ":", text)`},
        {tip:"<code>split(\" \", 2)</code> trennt höchstens zweimal. So bleibt der Meldungstext mit seinen Leerzeichen zusammen."},
        {warn:"Gib beim Öffnen von Textdateien <code>encoding=\"utf-8\"</code> an. Sonst hängt die Kodierung vom Betriebssystem ab, und Umlaute werden auf manchen Rechnern falsch gelesen."}
      ],
      src:[["Python-Tutorial: Module", "https://docs.python.org/3/tutorial/modules.html"], ["Python-Tutorial: Dateien lesen und schreiben", "https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files"], ["Modul math", "https://docs.python.org/3/library/math.html"], ["Modul random", "https://docs.python.org/3/library/random.html"]]}
  ],
  tasks:[
    {id:"hallo", level:1, lesson:"erste-schritte", title:"Erste Ausgabe",
      text:"<p>Schreibe ein Programm, das genau diese zwei Zeilen ausgibt:</p>",
      start:`# Gib die zwei Zeilen aus
`,
      tests:[{expect:"Hallo, IT-Lernlabor!\nIch lerne Python.\n"}],
      hints:["Für jede Zeile brauchst du ein eigenes <code>print(...)</code>.", "Der Text steht in Anführungszeichen. Achte auf Komma, Bindestrich und Punkt."],
      solution:`print("Hallo, IT-Lernlabor!")
print("Ich lerne Python.")`},
    {id:"steckbrief", level:1, lesson:"variablen", title:"Begrüßung mit Rechnung",
      text:"<p>Lies einen Namen und ein Alter ein. Gib dann <code>Hallo NAME, in 10 Jahren bist du X Jahre alt.</code> aus, wobei X das Alter plus 10 ist.</p>",
      start:`name = input("Name: ")
alter = input("Alter: ")
# Rechne und gib den Satz aus
`,
      tests:[{input:["Ada", "36"], expect:"Hallo Ada, in 10 Jahren bist du 46 Jahre alt.\n"}, {input:["Linus", "17"], expect:"Hallo Linus, in 10 Jahren bist du 27 Jahre alt.\n"}],
      hints:["<code>input</code> liefert Text. Wandle das Alter mit <code>int(alter)</code> in eine Zahl um.", "Mit einem f-String geht es am einfachsten: <code>print(f\"Hallo {name}, ...\")</code>"],
      solution:`name = input("Name: ")
alter = int(input("Alter: "))
print(f"Hallo {name}, in 10 Jahren bist du {alter + 10} Jahre alt.")`},
    {id:"rechner", level:1, lesson:"rechnen", title:"Kleiner Rechner",
      text:"<p>Lies zwei ganze Zahlen a und b ein. Gib Summe, Differenz, Produkt, ganzzahlige Division und Rest jeweils in einer eigenen Zeile aus, genau im Format des Beispiels.</p>",
      start:`a = int(input("a: "))
b = int(input("b: "))
`,
      tests:[{input:["17", "5"], expect:"Summe: 22\nDifferenz: 12\nProdukt: 85\nGanzzahlig geteilt: 3\nRest: 2\n"}, {input:["9", "3"], expect:"Summe: 12\nDifferenz: 6\nProdukt: 27\nGanzzahlig geteilt: 3\nRest: 0\n"}],
      hints:["Ganzzahlige Division schreibst du mit <code>//</code>, den Rest mit <code>%</code>.", "Beispiel für eine Zeile: <code>print(\"Summe:\", a + b)</code>"],
      solution:`a = int(input("a: "))
b = int(input("b: "))
print("Summe:", a + b)
print("Differenz:", a - b)
print("Produkt:", a * b)
print("Ganzzahlig geteilt:", a // b)
print("Rest:", a % b)`},
    {id:"celsius", level:1, lesson:"eingabe", title:"Celsius in Fahrenheit",
      text:"<p>Serverräume werden in Celsius überwacht, manche Geräte melden aber Fahrenheit. Lies eine Temperatur in Grad Celsius ein (auch mit Nachkommastellen) und gib sie in Fahrenheit mit einer Nachkommastelle aus. Die Formel lautet <code>F = C × 9 / 5 + 32</code>.</p>",
      start:`celsius = input("Celsius: ")
`,
      tests:[{input:["20"], expect:"20.0 °C sind 68.0 °F\n"}, {input:["-40"], expect:"-40.0 °C sind -40.0 °F\n"}, {input:["36.6"], expect:"36.6 °C sind 97.9 °F\n"}],
      hints:["Wandle die Eingabe mit <code>float()</code> um.", "Eine Nachkommastelle erreichst du im f-String mit <code>{wert:.1f}</code>."],
      solution:`celsius = float(input("Celsius: "))
fahrenheit = celsius * 9 / 5 + 32
print(f"{celsius:.1f} °C sind {fahrenheit:.1f} °F")`},
    {id:"note", level:2, lesson:"verzweigungen", title:"IHK-Notenschlüssel",
      text:"<p>Die IHK rechnet Punkte (0 bis 100) nach diesem Schlüssel in Noten um:</p><ul><li>100 bis 92: 1 (sehr gut)</li><li>91 bis 81: 2 (gut)</li><li>80 bis 67: 3 (befriedigend)</li><li>66 bis 50: 4 (ausreichend)</li><li>49 bis 30: 5 (mangelhaft)</li><li>29 bis 0: 6 (ungenügend)</li></ul><p>Lies eine Punktzahl ein und gib die Note im Format <code>Note: 2 (gut)</code> aus.</p>",
      start:`punkte = int(input("Punkte: "))
`,
      tests:[{input:["95"], expect:"Note: 1 (sehr gut)\n"}, {input:["81"], expect:"Note: 2 (gut)\n"}, {input:["67"], expect:"Note: 3 (befriedigend)\n"}, {input:["50"], expect:"Note: 4 (ausreichend)\n"}, {input:["30"], expect:"Note: 5 (mangelhaft)\n"}, {input:["0"], expect:"Note: 6 (ungenügend)\n"}],
      hints:["Prüfe von oben nach unten: <code>if punkte >= 92:</code>, dann <code>elif punkte >= 81:</code> und so weiter.", "Die letzte Stufe fängst du mit <code>else:</code> auf."],
      solution:`punkte = int(input("Punkte: "))
if punkte >= 92:
    print("Note: 1 (sehr gut)")
elif punkte >= 81:
    print("Note: 2 (gut)")
elif punkte >= 67:
    print("Note: 3 (befriedigend)")
elif punkte >= 50:
    print("Note: 4 (ausreichend)")
elif punkte >= 30:
    print("Note: 5 (mangelhaft)")
else:
    print("Note: 6 (ungenügend)")`},
    {id:"einmaleins", level:2, lesson:"schleifen", title:"Einmaleins-Reihe",
      text:"<p>Lies eine Zahl n ein und gib ihre Einmaleins-Reihe von 1 bis 10 aus, jede Rechnung in einer eigenen Zeile.</p>",
      start:`n = int(input("Zahl: "))
`,
      tests:[{input:["7"], expect:"7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70\n"}, {input:["12"], expect:"12 x 1 = 12\n12 x 2 = 24\n12 x 3 = 36\n12 x 4 = 48\n12 x 5 = 60\n12 x 6 = 72\n12 x 7 = 84\n12 x 8 = 96\n12 x 9 = 108\n12 x 10 = 120\n"}],
      hints:["<code>for i in range(1, 11):</code> zählt von 1 bis 10.", "Im f-String: <code>f\"{n} x {i} = {n * i}\"</code>"],
      solution:`n = int(input("Zahl: "))
for i in range(1, 11):
    print(f"{n} x {i} = {n * i}")`},
    {id:"statistik", level:2, lesson:"listen", title:"Ping-Statistik",
      text:"<p>Lies zuerst die Anzahl der Messungen ein, danach die einzelnen Ping-Zeiten in Millisekunden (ganze Zahlen). Gib dann den kleinsten Wert, den größten Wert und den Durchschnitt mit zwei Nachkommastellen aus.</p>",
      start:`anzahl = int(input("Anzahl: "))
zeiten = []
`,
      tests:[{input:["4", "20", "35", "18", "151"], expect:"Minimum: 18 ms\nMaximum: 151 ms\nDurchschnitt: 56.00 ms\n"}, {input:["3", "10", "11", "11"], expect:"Minimum: 10 ms\nMaximum: 11 ms\nDurchschnitt: 10.67 ms\n"}],
      hints:["Lies in einer Schleife <code>anzahl</code>-mal ein und hänge jeden Wert mit <code>zeiten.append(int(input()))</code> an.", "<code>min(zeiten)</code>, <code>max(zeiten)</code> und <code>sum(zeiten) / len(zeiten)</code> helfen dir."],
      solution:`anzahl = int(input("Anzahl: "))
zeiten = []
for i in range(anzahl):
    zeiten.append(int(input("Ping in ms: ")))
print(f"Minimum: {min(zeiten)} ms")
print(f"Maximum: {max(zeiten)} ms")
print(f"Durchschnitt: {sum(zeiten) / len(zeiten):.2f} ms")`},
    {id:"passwort", level:2, lesson:"texte", title:"Passwort-Prüfer",
      text:"<p>Lies ein Passwort ein und prüfe vier Regeln: mindestens 12 Zeichen, mindestens eine Ziffer, mindestens ein Großbuchstabe und mindestens ein Kleinbuchstabe. Gib für jede verletzte Regel eine Zeile aus, in dieser Reihenfolge:</p><ul><li><code>Zu kurz</code></li><li><code>Keine Ziffer</code></li><li><code>Kein Großbuchstabe</code></li><li><code>Kein Kleinbuchstabe</code></li></ul><p>Sind alle Regeln erfüllt, gib <code>Passwort erfüllt alle Regeln.</code> aus.</p>",
      start:`passwort = input("Passwort: ")
`,
      tests:[{input:["Sommer2026!Lab"], expect:"Passwort erfüllt alle Regeln.\n"}, {input:["kurz1A"], expect:"Zu kurz\n"}, {input:["nurkleinbuchstaben"], expect:"Keine Ziffer\nKein Großbuchstabe\n"}, {input:["GROSS1234567"], expect:"Kein Kleinbuchstabe\n"}],
      hints:["Ob ein Zeichen eine Ziffer ist, prüft <code>zeichen.isdigit()</code>. Für Groß- und Kleinbuchstaben gibt es <code>isupper()</code> und <code>islower()</code>.", "Mit <code>any(z.isdigit() for z in passwort)</code> prüfst du, ob mindestens ein Zeichen passt. Alternativ zählst du in einer Schleife.", "Merke dir in einer Variable, ob schon ein Fehler ausgegeben wurde."],
      solution:`passwort = input("Passwort: ")
fehler = []
if len(passwort) < 12:
    fehler.append("Zu kurz")
if not any(z.isdigit() for z in passwort):
    fehler.append("Keine Ziffer")
if not any(z.isupper() for z in passwort):
    fehler.append("Kein Großbuchstabe")
if not any(z.islower() for z in passwort):
    fehler.append("Kein Kleinbuchstabe")
if fehler:
    for f in fehler:
        print(f)
else:
    print("Passwort erfüllt alle Regeln.")`},
    {id:"initialen", level:2, lesson:"texte", title:"Benutzernamen erzeugen",
      text:"<p>Viele Firmen bilden Benutzernamen aus dem ersten Buchstaben des Vornamens und dem Nachnamen, alles klein. Lies Vor- und Nachnamen ein (Leerzeichen am Rand sollen nicht stören) und gib den Benutzernamen aus. Aus <code>Grace</code> und <code>Hopper</code> wird <code>ghopper</code>.</p>",
      start:`vorname = input("Vorname: ")
nachname = input("Nachname: ")
`,
      tests:[{input:["Grace", "Hopper"], expect:"ghopper\n"}, {input:["  Linus ", "Torvalds"], expect:"ltorvalds\n"}],
      hints:["<code>strip()</code> entfernt die Leerzeichen am Rand, <code>lower()</code> macht alles klein.", "Den ersten Buchstaben bekommst du mit <code>vorname[0]</code>."],
      solution:`vorname = input("Vorname: ").strip()
nachname = input("Nachname: ").strip()
print((vorname[0] + nachname).lower())`},
    {id:"woerter", level:2, lesson:"dictionaries", title:"Wörter zählen",
      text:"<p>Lies eine Zeile Text ein. Zähle, wie oft jedes Wort vorkommt, ohne auf Groß- und Kleinschreibung zu achten. Gib die Wörter in der Reihenfolge ihres ersten Auftretens aus, jeweils als <code>wort: anzahl</code>.</p>",
      start:`text = input("Text: ")
`,
      tests:[{input:["Der Server und der Client und der Router"], expect:"der: 3\nserver: 1\nund: 2\nclient: 1\nrouter: 1\n"}, {input:["Ping ping PING"], expect:"ping: 3\n"}],
      hints:["<code>text.lower().split()</code> liefert eine Liste der Wörter in Kleinbuchstaben.", "Zählen mit einem Dictionary: <code>anzahl[wort] = anzahl.get(wort, 0) + 1</code>"],
      solution:`text = input("Text: ")
anzahl = {}
for wort in text.lower().split():
    anzahl[wort] = anzahl.get(wort, 0) + 1
for wort, n in anzahl.items():
    print(f"{wort}: {n}")`},
    {id:"subnetz", level:3, lesson:"funktionen", title:"Subnetz-Rechner",
      text:"<p>Schreibe eine Funktion <code>hosts(praefix)</code>, die die Anzahl nutzbarer IPv4-Hostadressen für ein Präfix zurückgibt: 2 hoch (32 minus Präfix), minus 2 für Netz- und Broadcastadresse. Lies ein Präfix ein und gib den Satz aus dem Beispiel aus. Bei einem Präfix größer als 30 soll <code>Für /31 und /32 gelten Sonderregeln.</code> erscheinen, dabei steht die eingegebene Zahl im Satz.</p>",
      start:`def hosts(praefix):
    pass   # ersetze pass durch deine Rechnung

p = int(input("Präfix: "))
`,
      tests:[{input:["24"], expect:"Ein /24-Netz hat 254 nutzbare Hostadressen.\n"}, {input:["30"], expect:"Ein /30-Netz hat 2 nutzbare Hostadressen.\n"}, {input:["16"], expect:"Ein /16-Netz hat 65534 nutzbare Hostadressen.\n"}, {input:["31"], expect:"Für /31 und /32 gelten Sonderregeln.\n"}],
      hints:["Die Rechnung lautet <code>2 ** (32 - praefix) - 2</code>.", "Im Hauptprogramm: <code>if p > 30:</code> für den Sonderfall, sonst die Funktion aufrufen."],
      solution:`def hosts(praefix):
    return 2 ** (32 - praefix) - 2

p = int(input("Präfix: "))
if p > 30:
    print("Für /31 und /32 gelten Sonderregeln.")
else:
    print(f"Ein /{p}-Netz hat {hosts(p)} nutzbare Hostadressen.")`,
      explain:"Bei /31 nutzt man laut RFC 3021 beide Adressen für Punkt-zu-Punkt-Verbindungen, /32 bezeichnet einen einzelnen Host. Deshalb passt die Formel dort nicht."},
    {id:"sicher-teilen", level:3, lesson:"fehler", title:"Robuste Eingabe",
      text:"<p>Lies zwei Eingaben: die Größe einer Datei in MB und die Bandbreite in MB pro Sekunde. Gib die Übertragungszeit mit einer Nachkommastelle aus. Fange zwei Fehler ab:</p><ul><li>Ist eine Eingabe keine Zahl, gib <code>Bitte nur Zahlen eingeben.</code> aus.</li><li>Ist die Bandbreite 0, gib <code>Die Bandbreite darf nicht 0 sein.</code> aus.</li></ul>",
      start:`groesse = input("Dateigröße in MB: ")
bandbreite = input("Bandbreite in MB/s: ")
`,
      tests:[{input:["700", "12.5"], expect:"Übertragung dauert 56.0 Sekunden.\n"}, {input:["1024", "0"], expect:"Die Bandbreite darf nicht 0 sein.\n"}, {input:["viel", "10"], expect:"Bitte nur Zahlen eingeben.\n"}],
      hints:["Setze die Umwandlung mit <code>float()</code> und die Division in einen <code>try</code>-Block.", "Fange <code>ValueError</code> und <code>ZeroDivisionError</code> in zwei <code>except</code>-Blöcken ab."],
      solution:`groesse = input("Dateigröße in MB: ")
bandbreite = input("Bandbreite in MB/s: ")
try:
    sekunden = float(groesse) / float(bandbreite)
    print(f"Übertragung dauert {sekunden:.1f} Sekunden.")
except ValueError:
    print("Bitte nur Zahlen eingeben.")
except ZeroDivisionError:
    print("Die Bandbreite darf nicht 0 sein.")`},
    {id:"logs", level:3, lesson:"module-dateien", title:"Logdatei auswerten",
      text:"<p>Das Programm bekommt Zeilen aus einer Logdatei, eine pro Eingabe, bis keine mehr kommen. Jede Zeile hat das Format <code>UHRZEIT STUFE TEXT</code>, zum Beispiel <code>10:05 ERROR Festplatte voll</code>. Zähle die Zeilen pro Stufe und gib die Stufen alphabetisch sortiert als <code>STUFE: anzahl</code> aus. Gib danach alle Texte der Stufe ERROR in der Reihenfolge ihres Auftretens aus, jeweils mit <code>- </code> davor.</p>",
      start:`zeilen = []
while True:
    try:
        zeilen.append(input())
    except EOFError:
        break
# Werte die Zeilen aus
`,
      tests:[{input:["10:00 INFO Dienst gestartet", "10:05 ERROR Festplatte voll", "10:06 WARN Lüfter langsam", "10:07 INFO Backup fertig", "10:09 ERROR Dienst nicht erreichbar"], expect:"ERROR: 2\nINFO: 2\nWARN: 1\n- Festplatte voll\n- Dienst nicht erreichbar\n"}, {input:["08:00 INFO Start"], expect:"INFO: 1\n"}],
      hints:["<code>zeile.split(\" \", 2)</code> liefert Uhrzeit, Stufe und den restlichen Text.", "Zähle mit einem Dictionary. <code>sorted(anzahl)</code> liefert die Schlüssel alphabetisch.", "Sammle die Fehlertexte in einer zweiten Liste."],
      solution:`zeilen = []
while True:
    try:
        zeilen.append(input())
    except EOFError:
        break
anzahl = {}
fehler = []
for zeile in zeilen:
    zeit, stufe, text = zeile.split(" ", 2)
    anzahl[stufe] = anzahl.get(stufe, 0) + 1
    if stufe == "ERROR":
        fehler.append(text)
for stufe in sorted(anzahl):
    print(f"{stufe}: {anzahl[stufe]}")
for text in fehler:
    print("- " + text)`}
  ]
});
