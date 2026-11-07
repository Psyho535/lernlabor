/*! IT-Lernlabor · © 2026 Alexander S. · Alle Rechte vorbehalten. Nutzung nur nach LICENSE. */
/* Programmieren: Java. Ausgeführt vom Java-Übungsterminal der App, geprüft gegen JDK 25.
   Alle Beispiele und Musterlösungen kompilieren auch mit javac und liefern dort dieselbe Ausgabe. */
(window.LERN_CODE = window.LERN_CODE || []).push({
  id:"java", title:"Java", badge:"J", color:"#ff9f0a",
  sub:"Klassen, Objekte und strenge Typen, Standard in der Ausbildung",
  version:"Java 25 (LTS)",
  why:"Java ist in vielen Ausbildungsbetrieben und Berufsschulen die erste Sprache für objektorientierte Programmierung. Wer Java versteht, liest auch C# und andere Sprachen schnell.",
  easy:"Java ist sehr genau: Du sagst vorher, welche Art von Wert in eine Variable darf, und alles steht in Klassen. Das wirkt am Anfang streng, hilft aber, weil der Compiler viele Fehler findet, bevor das Programm überhaupt läuft.",
  starter:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Wie heißt du? ");
        String name = sc.nextLine();
        System.out.println("Hallo " + name + ", willkommen im IT-Lernlabor!");
    }
}
`,
  sources:[
    ["Learn Java (dev.java, Oracle)", "https://dev.java/learn/"],
    ["Java SE 25 API-Dokumentation", "https://docs.oracle.com/en/java/javase/25/docs/api/index.html"],
    ["Java Language Specification, Java SE 25", "https://docs.oracle.com/javase/specs/jls/se25/html/index.html"]
  ],
  lessons:[
    {id:"hallo-welt", title:"Dein erstes Java-Programm", sum:"Klasse, main-Methode, Ausgabe, Kompilieren und Ausführen.", task:"hallo",
      easy:"Ein Java-Programm ist wie ein Gebäude mit einem Haupteingang. Die Klasse ist das Gebäude, die main-Methode der Eingang: Dort beginnt Java immer. System.out.println schreibt eine Zeile auf den Bildschirm.",
      sec:[
        {p:"Jedes Java-Programm besteht aus mindestens einer Klasse. Java startet in der Methode <code>main</code>. <code>System.out.println(...)</code> gibt eine Zeile aus, <code>System.out.print(...)</code> dasselbe ohne Zeilenumbruch."},
        {run:`public class Main {
    public static void main(String[] args) {
        System.out.println("Hallo Welt!");
        System.out.print("Ohne ");
        System.out.println("Umbruch");
        System.out.println(7 + 5);
    }
}`},
        {h:"Aufbau", list:["<code>public class Main</code>: die Klasse. Eine <code>public class</code> muss genauso heißen wie ihre Datei, hier <code>Main.java</code>.", "<code>public static void main(String[] args)</code>: der Startpunkt.", "Geschweifte Klammern <code>{ }</code> umschließen Blöcke.", "Jede Anweisung endet mit einem Semikolon <code>;</code>.", "Kommentare: <code>// eine Zeile</code> oder <code>/* mehrere Zeilen */</code>"]},
        {h:"Kompilieren und ausführen", p:"Java wird zuerst übersetzt: <code>javac Main.java</code> erzeugt Bytecode in <code>Main.class</code>. <code>java Main</code> startet ihn in der Java Virtual Machine. Das Terminal oben zeigt diese Befehle an. Entdeckt der Compiler einen Fehler, startet das Programm gar nicht."},
        {run:`public class Main {
    public static void main(String[] args) {
        System.out.println("Fehlt hier etwas?")
    }
}`},
        {tip:"Seit Java 25 geht es für kleine Programme auch kürzer, ohne Klasse drumherum: <code>void main() { IO.println(\"Hallo\"); }</code>. Die meisten Bücher und Berufsschulen nutzen aber noch die klassische Form. Das Terminal versteht beide."},
        {warn:"Die Fehlermeldungen erscheinen auf Deutsch, so wie javac sie auf einem deutsch eingestellten Rechner ausgibt. Unter der Meldung erklärt ein Hinweis, was meist dahintersteckt."}
      ],
      src:[["dev.java: Getting Started", "https://dev.java/learn/getting-started/"], ["JEP 512: Compact Source Files and Instance Main Methods", "https://openjdk.org/jeps/512"], ["PrintStream (System.out)", "https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/io/PrintStream.html"]]},
    {id:"variablen", title:"Variablen und Datentypen", sum:"Primitive Typen, String, Konstanten und var.", task:"kreis",
      easy:"In Java hat jede Kiste ein festes Format: In eine int-Kiste passen nur ganze Zahlen, in eine double-Kiste Kommazahlen, in eine String-Kiste Text. Du sagst beim Anlegen, welches Format die Kiste hat.",
      sec:[
        {p:"Eine Variable deklarierst du mit Typ und Namen: <code>int anzahl;</code>. Mit <code>=</code> bekommt sie einen Wert. Beides geht auch in einer Zeile."},
        {run:`public class Main {
    public static void main(String[] args) {
        int anzahlRechner = 24;
        double preis = 649.99;
        boolean imLager = true;
        char raum = 'B';
        String hersteller = "Contoso";
        long bytes = 5_000_000_000L;

        System.out.println(anzahlRechner + " Rechner von " + hersteller);
        System.out.println("Preis: " + preis + ", im Lager: " + imLager);
        System.out.println("Gebäude " + raum + ", " + bytes + " Bytes");
    }
}`},
        {h:"Primitive Datentypen", table:{head:["Typ", "Größe", "Wertebereich"], rows:[["<code>byte</code>", "8 Bit", "-128 bis 127"], ["<code>short</code>", "16 Bit", "-32768 bis 32767"], ["<code>int</code>", "32 Bit", "etwa ±2,1 Milliarden"], ["<code>long</code>", "64 Bit", "etwa ±9,2 Trillionen, Literal mit L"], ["<code>float</code>", "32 Bit", "Kommazahl, etwa 7 Stellen, Literal mit f"], ["<code>double</code>", "64 Bit", "Kommazahl, etwa 15 Stellen"], ["<code>char</code>", "16 Bit", "ein Zeichen in einfachen Anführungszeichen"], ["<code>boolean</code>", "", "<code>true</code> oder <code>false</code>"]]}},
        {p:"<code>String</code> ist kein primitiver Typ, sondern eine Klasse. Deshalb wird er großgeschrieben. Texte stehen in doppelten, einzelne Zeichen (<code>char</code>) in einfachen Anführungszeichen."},
        {h:"Konstanten und var", p:"Mit <code>final</code> wird eine Variable unveränderlich. Konstanten schreibt man üblicherweise groß. Mit <code>var</code> leitet Java den Typ aus dem Wert ab, der Typ steht dann trotzdem fest."},
        {run:`public class Main {
    public static void main(String[] args) {
        final double MWST = 0.19;
        var netto = 100.0;
        System.out.println("Brutto: " + netto * (1 + MWST));
        // MWST = 0.07;   würde einen Compilerfehler auslösen
    }
}`},
        {warn:"Ohne Wert darf eine lokale Variable nicht benutzt werden. <code>int summe; System.out.println(summe);</code> meldet javac als Fehler: Die Variable wurde möglicherweise nicht initialisiert."}
      ],
      src:[["dev.java: Primitive Types", "https://dev.java/learn/language-basics/primitive-types/"], ["dev.java: Variables", "https://dev.java/learn/language-basics/variables/"], ["JLS 4.2: Primitive Types and Values", "https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html#jls-4.2"]]},
    {id:"operatoren", title:"Rechnen und Umwandeln", sum:"Operatoren, Ganzzahldivision, Rest, Casting und Überlauf.", task:"sekunden",
      easy:"Java rechnet genau mit dem Typ, den die Werte haben. Teilst du zwei ganze Zahlen, kommt eine ganze Zahl heraus, der Rest fällt weg. Willst du Nachkommastellen, muss mindestens eine Zahl eine Kommazahl sein.",
      sec:[
        {p:"Java kennt <code>+ - * / %</code>. Sind beide Werte ganze Zahlen, ist auch das Ergebnis ganzzahlig: <code>7 / 2</code> ergibt 3. Erst mit einer Kommazahl wird es 3.5."},
        {run:`public class Main {
    public static void main(String[] args) {
        System.out.println(7 / 2);
        System.out.println(7 % 2);
        System.out.println(7 / 2.0);
        System.out.println((double) 7 / 2);
        int prozent = (int) 87.9;
        System.out.println(prozent);
        System.out.println(Math.round(87.5));
    }
}`},
        {h:"Casting", p:"Ein <i>Cast</i> wandelt bewusst in einen anderen Typ um, etwa <code>(int) 87.9</code>. Dabei werden die Nachkommastellen abgeschnitten, nicht gerundet. Von kleineren in größere Typen (int nach long oder double) wandelt Java automatisch um."},
        {h:"Kurzschreibweisen", table:{head:["Schreibweise", "Bedeutet"], rows:[["<code>x += 5</code>", "<code>x = x + 5</code>"], ["<code>x -= 2</code>", "<code>x = x - 2</code>"], ["<code>x *= 3</code>", "<code>x = x * 3</code>"], ["<code>x++</code>", "<code>x</code> um 1 erhöhen"], ["<code>x--</code>", "<code>x</code> um 1 verringern"]]}},
        {h:"Überlauf", p:"Ein <code>int</code> hat 32 Bit. Wird der größte Wert überschritten, springt er ohne Warnung ins Negative. Für große Zahlen nimmst du <code>long</code>."},
        {run:`public class Main {
    public static void main(String[] args) {
        int max = Integer.MAX_VALUE;
        System.out.println(max);
        System.out.println(max + 1);
        long gross = (long) max + 1;
        System.out.println(gross);
        System.out.println(Math.pow(2, 10) + " " + Math.sqrt(144) + " " + Math.abs(-7));
    }
}`},
        {tip:"<code>Math.round</code> mit einem double liefert ein <code>long</code>. Für eine int-Variable brauchst du deshalb einen Cast: <code>int r = (int) Math.round(x);</code>."}
      ],
      src:[["dev.java: Using Operators", "https://dev.java/learn/language-basics/using-operators/"], ["JLS 5.1.3: Narrowing Primitive Conversion", "https://docs.oracle.com/javase/specs/jls/se25/html/jls-5.html#jls-5.1.3"], ["Klasse Math", "https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Math.html"]]},
    {id:"strings", title:"Strings", sum:"Texte verbinden, untersuchen, vergleichen und formatiert ausgeben.", task:"palindrom",
      easy:"Ein String ist eine Kette von Zeichen, gezählt ab 0. Wichtig in Java: Texte vergleichst du mit equals, nicht mit ==. Das doppelte Gleichheitszeichen prüft, ob es dasselbe Objekt ist, nicht ob der Inhalt gleich ist.",
      sec:[
        {p:"Strings verbindest du mit <code>+</code>. Methoden rufst du mit einem Punkt auf. <code>length()</code> liefert die Länge, <code>charAt(i)</code> das Zeichen an Position i."},
        {run:`public class Main {
    public static void main(String[] args) {
        String host = "mail.firma.de";
        System.out.println(host.length());
        System.out.println(host.charAt(0));
        System.out.println(host.substring(0, 4));
        System.out.println(host.indexOf("."));
        System.out.println(host.toUpperCase());
        System.out.println(host.endsWith(".de"));
        System.out.println(host.replace(".", " Punkt "));
    }
}`},
        {h:"Vergleichen mit equals", p:"<code>==</code> prüft bei Objekten, ob es dasselbe Objekt ist. Texte aus Eingaben oder Rechnungen sind neue Objekte, auch wenn der Inhalt gleich ist. Für den Inhalt nimmst du <code>equals</code>, ohne Rücksicht auf Groß- und Kleinschreibung <code>equalsIgnoreCase</code>."},
        {run:`public class Main {
    public static void main(String[] args) {
        String a = "admin";
        String b = new String("admin");
        System.out.println(a == b);
        System.out.println(a.equals(b));
        System.out.println("ADMIN".equalsIgnoreCase(a));
    }
}`},
        {h:"Formatiert ausgeben", p:"<code>System.out.printf</code> und <code>String.format</code> setzen Werte in Platzhalter ein: <code>%d</code> ganze Zahl, <code>%.2f</code> Kommazahl mit zwei Stellen, <code>%s</code> Text, <code>%n</code> Zeilenumbruch."},
        {run:`public class Main {
    public static void main(String[] args) {
        String geraet = "Laptop";
        int stueck = 3;
        double preis = 1249.5;
        System.out.printf("%d x %s je %.2f Euro%n", stueck, geraet, preis);
        String zeile = String.format("Gesamt: %.2f Euro", stueck * preis);
        System.out.println(zeile);
    }
}`},
        {warn:"printf richtet sich nach der Spracheinstellung des Rechners. Auf einem deutsch eingestellten PC steht <code>1249,50</code> mit Komma, im Übungsterminal wie auf den meisten Online-Compilern <code>1249.50</code> mit Punkt."},
        {tip:"Strings sind unveränderlich. <code>host.toUpperCase()</code> liefert einen neuen String, <code>host</code> selbst bleibt gleich."}
      ],
      src:[["Klasse String", "https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/String.html"], ["Formatter: Syntax der Platzhalter", "https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Formatter.html#syntax"], ["dev.java: Strings", "https://dev.java/learn/strings/"]]},
    {id:"eingabe", title:"Eingaben mit Scanner", sum:"Zahlen und Texte einlesen und die nextInt-nextLine-Falle.", task:"schaltjahr",
      easy:"Der Scanner ist ein Vorleser für die Tastatur. nextInt liest eine ganze Zahl, nextLine eine ganze Zeile Text. Er arbeitet sich von links nach rechts durch alles, was getippt wurde.",
      sec:[
        {p:"Für Eingaben importierst du <code>java.util.Scanner</code> und erzeugst einen Scanner für <code>System.in</code>. Probiere es aus, das Terminal fragt dich unten."},
        {run:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Name: ");
        String name = sc.nextLine();
        System.out.print("Anzahl Geräte: ");
        int anzahl = sc.nextInt();
        System.out.println(name + " betreut " + anzahl + " Geräte.");
    }
}`},
        {h:"Wichtige Methoden", table:{head:["Methode", "Liest"], rows:[["<code>nextLine()</code>", "den Rest der Zeile als String"], ["<code>next()</code>", "das nächste Wort"], ["<code>nextInt()</code>", "eine ganze Zahl"], ["<code>nextDouble()</code>", "eine Kommazahl"], ["<code>hasNextInt()</code>", "prüft, ob als Nächstes eine ganze Zahl kommt"]]}},
        {h:"Die nextInt-nextLine-Falle", p:"<code>nextInt()</code> liest nur die Zahl, nicht das Enter dahinter. Ein folgendes <code>nextLine()</code> findet dann sofort das Zeilenende und liefert einen leeren Text. Abhilfe: nach <code>nextInt()</code> einmal <code>sc.nextLine();</code> aufrufen, um die Zeile abzuschließen."},
        {run:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Raumnummer: ");
        int raum = sc.nextInt();
        sc.nextLine();   // Rest der Zeile verwerfen
        System.out.print("Beschreibung: ");
        String text = sc.nextLine();
        System.out.println("Raum " + raum + ": " + text);
    }
}`},
        {warn:"Tippt jemand Text, wo <code>nextInt()</code> eine Zahl erwartet, bricht das Programm mit <code>InputMismatchException</code> ab."},
        {tip:"Auch Scanner richtet sich nach der Spracheinstellung. Auf einem deutsch eingestellten PC erwartet <code>nextDouble()</code> eine Eingabe wie <code>3,5</code>. Im Übungsterminal gilt der Punkt: <code>3.5</code>."}
      ],
      src:[["Klasse Scanner", "https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Scanner.html"], ["dev.java: Reading user input", "https://dev.java/learn/getting-started/"]]},
    {id:"verzweigungen", title:"Verzweigungen", sum:"if, else if, else, logische Operatoren und switch.", task:"note",
      easy:"if ist eine Weiche: Je nachdem, ob die Bedingung stimmt, nimmt das Programm den einen oder den anderen Weg. switch ist ein Stellwerk mit vielen Gleisen: Für jeden Wert gibt es ein eigenes Gleis.",
      sec:[
        {p:"Die Bedingung steht in runden Klammern und muss <code>true</code> oder <code>false</code> ergeben. Der zugehörige Block steht in geschweiften Klammern."},
        {run:`public class Main {
    public static void main(String[] args) {
        int auslastung = 87;
        if (auslastung >= 90) {
            System.out.println("Kritisch");
        } else if (auslastung >= 75) {
            System.out.println("Hoch");
        } else {
            System.out.println("Normal");
        }
    }
}`},
        {h:"Logische Operatoren", table:{head:["Operator", "Bedeutung"], rows:[["<code>&amp;&amp;</code>", "und: beide Seiten müssen wahr sein"], ["<code>||</code>", "oder: mindestens eine Seite wahr"], ["<code>!</code>", "nicht: kehrt um"], ["<code>==</code>, <code>!=</code>", "gleich, ungleich (bei Zahlen und boolean)"]]}},
        {h:"switch", p:"Mit <code>switch</code> vergleichst du einen Wert mit mehreren festen Werten. Die moderne Form mit Pfeil <code>-></code> braucht kein <code>break</code> und kann direkt einen Wert liefern."},
        {run:`public class Main {
    public static void main(String[] args) {
        int port = 443;
        String dienst = switch (port) {
            case 20, 21 -> "FTP";
            case 22 -> "SSH";
            case 80 -> "HTTP";
            case 443 -> "HTTPS";
            default -> "unbekannt";
        };
        System.out.println(port + ": " + dienst);
    }
}`},
        {h:"Klassisches switch", p:"In älterem Code siehst du die Form mit Doppelpunkt. Dort braucht jeder Fall ein <code>break</code>, sonst läuft Java in den nächsten Fall weiter."},
        {run:`public class Main {
    public static void main(String[] args) {
        String stufe = "WARN";
        switch (stufe) {
            case "ERROR":
                System.out.println("Ticket anlegen");
                break;
            case "WARN":
                System.out.println("Beobachten");
                break;
            default:
                System.out.println("Nichts zu tun");
        }
    }
}`},
        {warn:"Ein Semikolon direkt hinter <code>if (...)</code> beendet die Anweisung. Der Block darunter läuft dann immer."}
      ],
      src:[["dev.java: Control Flow Statements", "https://dev.java/learn/language-basics/controlling-flow/"], ["dev.java: Switch Expressions", "https://dev.java/learn/language-basics/switch-expressions/"]]},
    {id:"schleifen", title:"Schleifen", sum:"while, do-while, for, break und continue.", task:"fizzbuzz",
      easy:"for ist die Zählschleife: Start, Bedingung und Schritt stehen in einer Zeile. while prüft vor jedem Durchlauf, do-while erst danach, deshalb läuft do-while mindestens einmal.",
      sec:[
        {p:"Die <code>for</code>-Schleife hat drei Teile: Startwert, Bedingung und Schritt. Sie eignet sich, wenn die Anzahl der Durchläufe feststeht."},
        {run:`public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println("Port " + (8080 + i) + " prüfen");
        }
        int summe = 0;
        for (int i = 1; i <= 100; i++) {
            summe += i;
        }
        System.out.println("Summe: " + summe);
    }
}`},
        {h:"while und do-while", run:`public class Main {
    public static void main(String[] args) {
        int akku = 100;
        int stunden = 0;
        while (akku > 15) {
            akku -= 12;
            stunden++;
        }
        System.out.println(stunden + " Stunden, Rest " + akku + " %");

        int versuch = 0;
        do {
            versuch++;
            System.out.println("Verbindungsversuch " + versuch);
        } while (versuch < 3);
    }
}`},
        {h:"break und continue", p:"<code>break</code> verlässt die Schleife, <code>continue</code> springt zum nächsten Durchlauf. Verschachtelte Schleifen laufen innen komplett durch, bevor außen der nächste Schritt kommt."},
        {run:`public class Main {
    public static void main(String[] args) {
        for (int zeile = 1; zeile <= 3; zeile++) {
            for (int spalte = 1; spalte <= 4; spalte++) {
                System.out.print(zeile * spalte + "\\t");
            }
            System.out.println();
        }
    }
}`},
        {warn:"Ändert sich die Bedingung einer while-Schleife nie, läuft sie endlos. Das Terminal bricht nach einigen Sekunden ab."}
      ],
      src:[["dev.java: Loops", "https://dev.java/learn/language-basics/controlling-flow/"], ["JLS 14.14: The for Statement", "https://docs.oracle.com/javase/specs/jls/se25/html/jls-14.html#jls-14.14"]]},
    {id:"arrays", title:"Arrays", sum:"Mehrere Werte gleichen Typs speichern und durchlaufen.", task:"temperaturen",
      easy:"Ein Array ist wie ein Regal mit nummerierten Fächern, alle gleich groß. Wie viele Fächer es hat, legst du beim Bauen fest. Das erste Fach hat die Nummer 0.",
      sec:[
        {p:"Ein Array hat einen festen Typ und eine feste Länge. Du erzeugst es mit <code>new int[5]</code> (alle Werte 0) oder direkt mit Werten in geschweiften Klammern. <code>length</code> liefert die Länge."},
        {run:`import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] pings = {23, 18, 145, 20, 31};
        System.out.println(pings[0] + " " + pings.length);
        pings[2] = 99;

        int summe = 0;
        for (int i = 0; i < pings.length; i++) {
            summe += pings[i];
        }
        System.out.println("Schnitt: " + (double) summe / pings.length);

        for (int ms : pings) {
            System.out.print(ms + " ");
        }
        System.out.println();
        Arrays.sort(pings);
        System.out.println(Arrays.toString(pings));
    }
}`},
        {h:"Die for-each-Schleife", p:"<code>for (int ms : pings)</code> geht jeden Wert durch, ohne Index. Brauchst du den Index oder willst du Werte ändern, nimm die normale for-Schleife."},
        {h:"Zweidimensionale Arrays", p:"Ein Array kann Arrays enthalten, etwa für Tabellen. <code>plaene[zeile][spalte]</code> greift auf ein Feld zu."},
        {run:`public class Main {
    public static void main(String[] args) {
        String[][] belegung = new String[2][3];
        belegung[0][1] = "Server";
        belegung[1][2] = "Switch";
        for (String[] reihe : belegung) {
            for (String platz : reihe) {
                System.out.print((platz == null ? "frei" : platz) + " | ");
            }
            System.out.println();
        }
    }
}`},
        {warn:"Gültige Indizes sind 0 bis <code>length - 1</code>. <code>pings[5]</code> bei 5 Elementen führt zu <code>ArrayIndexOutOfBoundsException</code>."},
        {tip:"<code>System.out.println(pings)</code> zeigt nur etwas wie <code>[I@1b6d3586</code>. Für den Inhalt nimmst du <code>Arrays.toString(pings)</code>."}
      ],
      src:[["dev.java: Creating Arrays", "https://dev.java/learn/language-basics/arrays/"], ["Klasse Arrays", "https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Arrays.html"]]},
    {id:"methoden", title:"Methoden", sum:"Eigene Methoden mit Parametern, Rückgabewert und Überladung.", task:"binaer",
      easy:"Eine Methode ist ein Rezept mit Namen. Du schreibst es einmal auf und kochst es dann, so oft du willst. Was in den Klammern steht, sind die Zutaten. Mit return gibt das Rezept das fertige Gericht zurück.",
      sec:[
        {p:"Eine Methode hat einen Rückgabetyp, einen Namen und Parameter. <code>void</code> bedeutet: gibt nichts zurück. Aus <code>main</code> heraus rufst du zunächst <code>static</code>-Methoden auf."},
        {run:`public class Main {
    static int hosts(int praefix) {
        return (int) Math.pow(2, 32 - praefix) - 2;
    }

    static void zeige(String text, int anzahl) {
        System.out.println(text + ": " + anzahl);
    }

    public static void main(String[] args) {
        zeige("/24", hosts(24));
        zeige("/28", hosts(28));
        int summe = hosts(24) + hosts(25);
        System.out.println(summe);
    }
}`},
        {h:"Überladen", p:"Mehrere Methoden dürfen gleich heißen, wenn sich ihre Parameter unterscheiden. Java wählt anhand der Argumente die passende aus."},
        {run:`public class Main {
    static double flaeche(double seite) {
        return seite * seite;
    }

    static double flaeche(double breite, double hoehe) {
        return breite * hoehe;
    }

    public static void main(String[] args) {
        System.out.println(flaeche(3));
        System.out.println(flaeche(3, 4.5));
    }
}`},
        {h:"Werte werden kopiert", p:"Java übergibt Argumente als Kopie des Werts. Änderst du einen int-Parameter in der Methode, bleibt die Variable beim Aufrufer gleich. Ergebnisse gibst du mit <code>return</code> zurück."},
        {warn:"Hat eine Methode einen Rückgabetyp, muss jeder Weg durch die Methode mit <code>return</code> enden. Sonst meldet javac: Rückgabeanweisung fehlt."}
      ],
      src:[["dev.java: Defining Methods", "https://dev.java/learn/classes-objects/defining-methods/"], ["JLS 15.12: Method Invocation Expressions", "https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.12"]]},
    {id:"klassen", title:"Klassen und Objekte", sum:"Eigene Klassen mit Attributen, Konstruktor, Methoden und Kapselung.", task:"konto",
      easy:"Eine Klasse ist ein Bauplan, ein Objekt ist ein Ding, das nach diesem Plan gebaut wurde. Der Bauplan Laptop beschreibt, dass jeder Laptop einen Namen und einen Akkustand hat. Jedes einzelne Gerät ist dann ein eigenes Objekt mit eigenen Werten.",
      sec:[
        {p:"Eine Klasse beschreibt Attribute (Daten) und Methoden (Verhalten). Mit <code>new</code> erzeugst du ein Objekt. Der Konstruktor heißt wie die Klasse und setzt die Startwerte. <code>this</code> meint das aktuelle Objekt."},
        {run:`class Laptop {
    private String name;
    private int akku;

    Laptop(String name) {
        this.name = name;
        this.akku = 100;
    }

    void arbeiten(int stunden) {
        akku = Math.max(0, akku - stunden * 15);
    }

    int getAkku() {
        return akku;
    }

    @Override
    public String toString() {
        return name + " (" + akku + " %)";
    }
}

public class Main {
    public static void main(String[] args) {
        Laptop a = new Laptop("NB-014");
        Laptop b = new Laptop("NB-015");
        a.arbeiten(3);
        System.out.println(a);
        System.out.println(b);
        System.out.println(a.getAkku() < b.getAkku());
    }
}`},
        {h:"Kapselung", p:"Attribute sind meist <code>private</code>: Nur die eigene Klasse darf sie direkt ändern. Von außen geht es über Methoden wie <code>getAkku()</code>. So kann die Klasse prüfen, dass keine ungültigen Werte entstehen."},
        {run:`class Laptop {
    private int akku = 100;
}

public class Main {
    public static void main(String[] args) {
        Laptop l = new Laptop();
        l.akku = -50;
    }
}`},
        {h:"toString", p:"<code>System.out.println(objekt)</code> ruft <code>toString()</code> auf. Ohne eigene Methode erscheint der Klassenname mit einem Hashwert. Mit <code>@Override</code> überschreibst du sie, und der Compiler prüft, dass es die Methode in der Oberklasse wirklich gibt."},
        {tip:"Mehrere Klassen dürfen in einer Datei stehen, aber nur eine davon ist <code>public</code>, und nach ihr heißt die Datei."}
      ],
      src:[["dev.java: Classes and Objects", "https://dev.java/learn/classes-objects/"], ["dev.java: Creating Classes", "https://dev.java/learn/classes-objects/creating-classes/"], ["Object.toString()", "https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Object.html#toString()"]]},
    {id:"arraylist", title:"ArrayList", sum:"Listen, die wachsen: hinzufügen, entfernen und durchlaufen.", task:"einkauf",
      easy:"Ein Array hat eine feste Größe. Eine ArrayList ist wie ein Notizblock, an den du jederzeit neue Seiten anheften oder alte herausreißen kannst.",
      sec:[
        {p:"<code>ArrayList</code> aus <code>java.util</code> wächst bei Bedarf. In spitzen Klammern steht, welche Objekte hineindürfen. Für Zahlen nimmst du die Hüllklasse <code>Integer</code> statt <code>int</code>, Java wandelt automatisch um."},
        {run:`import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> tickets = new ArrayList<>();
        tickets.add("Drucker offline");
        tickets.add("Passwort zurücksetzen");
        tickets.add("VPN langsam");
        tickets.add(0, "Server down");
        System.out.println(tickets);
        System.out.println(tickets.get(1) + ", " + tickets.size() + " Tickets");
        tickets.remove("VPN langsam");
        Collections.sort(tickets);
        for (String t : tickets) {
            System.out.println("- " + t);
        }
    }
}`},
        {h:"Wichtige Methoden", table:{head:["Methode", "Wirkung"], rows:[["<code>add(x)</code>, <code>add(i, x)</code>", "anhängen oder an Position i einfügen"], ["<code>get(i)</code>, <code>set(i, x)</code>", "lesen oder ersetzen"], ["<code>remove(i)</code>, <code>remove(x)</code>", "nach Position oder Wert entfernen"], ["<code>size()</code>", "Anzahl der Einträge"], ["<code>contains(x)</code>, <code>indexOf(x)</code>", "suchen"]]}},
        {h:"Vorsicht bei Integer-Listen", p:"<code>remove(1)</code> entfernt den Eintrag an Position 1. Willst du den Wert 1 entfernen, schreibst du <code>remove(Integer.valueOf(1))</code>."},
        {run:`import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Integer> ports = new ArrayList<>(List.of(1, 22, 80, 443));
        ports.remove(1);
        System.out.println(ports);
        ports.remove(Integer.valueOf(1));
        System.out.println(ports);
    }
}`},
        {warn:"Während eine for-each-Schleife über die Liste läuft, darfst du keine Einträge entfernen. Java bricht sonst mit <code>ConcurrentModificationException</code> ab."}
      ],
      src:[["Klasse ArrayList", "https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/ArrayList.html"], ["dev.java: The Collections Framework", "https://dev.java/learn/api/collections-framework/"]]},
    {id:"exceptions", title:"Exceptions", sum:"Fehler zur Laufzeit abfangen mit try, catch und finally.", task:"ip",
      easy:"Eine Exception ist ein Alarm, den das Programm auslöst, wenn etwas schiefgeht. Mit try und catch legst du fest, wer den Alarm hört und was dann passiert. Ohne catch bricht das Programm ab und zeigt, wo der Alarm losging.",
      sec:[
        {p:"Tritt zur Laufzeit ein Fehler auf, wirft Java eine <i>Exception</i>. Wird sie nicht abgefangen, endet das Programm mit einem Stacktrace: Die erste Zeile nennt die Exception, darunter steht, in welcher Methode und Zeile sie entstand."},
        {run:`public class Main {
    static int teile(int a, int b) {
        return a / b;
    }

    public static void main(String[] args) {
        System.out.println(teile(10, 2));
        System.out.println(teile(10, 0));
    }
}`},
        {h:"try und catch", run:`public class Main {
    public static void main(String[] args) {
        String[] eingaben = {"42", "4x2", "-7"};
        for (String e : eingaben) {
            try {
                int zahl = Integer.parseInt(e);
                System.out.println("Zahl: " + zahl);
            } catch (NumberFormatException ex) {
                System.out.println("Keine Zahl: " + ex.getMessage());
            } finally {
                System.out.println("geprüft: " + e);
            }
        }
    }
}`},
        {h:"Häufige Exceptions", table:{head:["Exception", "Typische Ursache"], rows:[["<code>ArithmeticException</code>", "ganzzahlige Division durch 0"], ["<code>NullPointerException</code>", "Methode auf einer Variable mit dem Wert null aufgerufen"], ["<code>ArrayIndexOutOfBoundsException</code>", "Index außerhalb des Arrays"], ["<code>NumberFormatException</code>", "Text lässt sich nicht in eine Zahl umwandeln"], ["<code>InputMismatchException</code>", "Scanner erwartet eine Zahl, bekommt Text"]]}},
        {h:"Selbst werfen", p:"Mit <code>throw</code> löst du selbst eine Exception aus. Exceptions wie <code>IOException</code> sind <i>geprüft</i>: Der Compiler verlangt, dass du sie abfängst oder mit <code>throws</code> weitergibst."},
        {run:`public class Main {
    static void setzeVlan(int id) {
        if (id < 1 || id > 4094) {
            throw new IllegalArgumentException("VLAN " + id + " ist ungültig");
        }
        System.out.println("VLAN " + id + " gesetzt");
    }

    public static void main(String[] args) {
        try {
            setzeVlan(20);
            setzeVlan(5000);
        } catch (IllegalArgumentException e) {
            System.out.println("Fehler: " + e.getMessage());
        }
    }
}`}
      ],
      src:[["dev.java: Exceptions", "https://dev.java/learn/exceptions/"], ["JLS 11: Exceptions", "https://docs.oracle.com/javase/specs/jls/se25/html/jls-11.html"]]},
    {id:"vererbung", title:"Vererbung und Interfaces", sum:"extends, super, Überschreiben, abstrakte Klassen und Interfaces.", task:"geraete",
      easy:"Vererbung heißt: Eine Klasse übernimmt alles von einer anderen und ergänzt nur das Neue. Ein Laptop ist ein Gerät, also erbt er alles, was jedes Gerät hat. Ein Interface ist ein Versprechen: Wer es umsetzt, hat garantiert bestimmte Methoden.",
      sec:[
        {p:"Mit <code>extends</code> erbt eine Klasse Attribute und Methoden. Im Konstruktor ruft <code>super(...)</code> den Konstruktor der Oberklasse auf. Methoden kannst du mit <code>@Override</code> überschreiben."},
        {run:`abstract class Geraet {
    protected String name;

    Geraet(String name) {
        this.name = name;
    }

    abstract double stromverbrauch();

    String info() {
        return name + " braucht " + stromverbrauch() + " W";
    }
}

class Laptop extends Geraet {
    Laptop(String name) { super(name); }
    double stromverbrauch() { return 45; }
}

class Server extends Geraet {
    private int netzteile;
    Server(String name, int netzteile) { super(name); this.netzteile = netzteile; }
    double stromverbrauch() { return 350.0 * netzteile; }
    @Override
    String info() { return super.info() + " (" + netzteile + " Netzteile)"; }
}

public class Main {
    public static void main(String[] args) {
        Geraet[] inventar = {new Laptop("NB-1"), new Server("SRV-A", 2)};
        double summe = 0;
        for (Geraet g : inventar) {
            System.out.println(g.info());
            summe += g.stromverbrauch();
        }
        System.out.println("Gesamt: " + summe + " W");
    }
}`},
        {h:"Polymorphie", p:"Eine Variable vom Typ <code>Geraet</code> kann einen Laptop oder einen Server enthalten. Java ruft zur Laufzeit die Methode der tatsächlichen Klasse auf. Von einer <code>abstract</code>-Klasse selbst kannst du keine Objekte erzeugen."},
        {h:"Interfaces", p:"Ein Interface legt Methoden fest, die eine Klasse anbieten muss. Eine Klasse kann mehrere Interfaces umsetzen (<code>implements</code>), aber nur von einer Klasse erben. Methoden aus einem Interface sind automatisch <code>public</code>."},
        {run:`interface Pingbar {
    boolean ping();
}

class Drucker implements Pingbar {
    public boolean ping() { return true; }
}

class Kaffeemaschine implements Pingbar {
    public boolean ping() { return false; }
}

public class Main {
    public static void main(String[] args) {
        Pingbar[] netz = {new Drucker(), new Kaffeemaschine()};
        for (Pingbar p : netz) {
            System.out.println(p.getClass().getSimpleName() + ": " + (p.ping() ? "erreichbar" : "offline"));
        }
    }
}`},
        {warn:"Lässt du beim Umsetzen einer Interface-Methode <code>public</code> weg, meldet javac, dass niedrigere Zugriffsberechtigungen nicht erlaubt sind."}
      ],
      src:[["dev.java: Inheritance", "https://dev.java/learn/inheritance/"], ["dev.java: Interfaces", "https://dev.java/learn/interfaces/"]]}
  ],
  tasks:[
    {id:"hallo", level:1, lesson:"hallo-welt", title:"Erste Ausgabe",
      text:"<p>Ergänze die main-Methode so, dass das Programm genau diese zwei Zeilen ausgibt:</p>",
      start:`public class Main {
    public static void main(String[] args) {

    }
}
`,
      tests:[{expect:"Hallo, IT-Lernlabor!\nIch lerne Java.\n"}],
      hints:["Für jede Zeile brauchst du ein <code>System.out.println(\"...\");</code>.", "Vergiss das Semikolon am Ende jeder Anweisung nicht."],
      solution:`public class Main {
    public static void main(String[] args) {
        System.out.println("Hallo, IT-Lernlabor!");
        System.out.println("Ich lerne Java.");
    }
}`},
    {id:"kreis", level:1, lesson:"variablen", title:"Kreisrechner",
      text:"<p>Lies einen Radius als Kommazahl ein und gib Fläche und Umfang mit zwei Nachkommastellen aus. Nutze <code>Math.PI</code>. Fläche ist π·r², Umfang ist 2·π·r.</p>",
      start:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Radius: ");
        double r = sc.nextDouble();

    }
}
`,
      tests:[{input:["2"], expect:"Fläche: 12.57\nUmfang: 12.57\n"}, {input:["1.5"], expect:"Fläche: 7.07\nUmfang: 9.42\n"}],
      hints:["Zwei Nachkommastellen: <code>System.out.printf(\"Fläche: %.2f%n\", flaeche);</code>", "r² schreibst du als <code>r * r</code>."],
      solution:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Radius: ");
        double r = sc.nextDouble();
        double flaeche = Math.PI * r * r;
        double umfang = 2 * Math.PI * r;
        System.out.printf("Fläche: %.2f%n", flaeche);
        System.out.printf("Umfang: %.2f%n", umfang);
    }
}`},
    {id:"sekunden", level:1, lesson:"operatoren", title:"Laufzeit umrechnen",
      text:"<p>Ein Server meldet seine Laufzeit in Sekunden. Lies eine ganze Zahl ein und gib sie als Stunden, Minuten und Sekunden aus, im Format <code>3 h 25 min 45 s</code>.</p>",
      start:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int sekunden = sc.nextInt();

    }
}
`,
      tests:[{input:["12345"], expect:"3 h 25 min 45 s\n"}, {input:["59"], expect:"0 h 0 min 59 s\n"}, {input:["7200"], expect:"2 h 0 min 0 s\n"}],
      hints:["Eine Stunde hat 3600 Sekunden. <code>sekunden / 3600</code> liefert die vollen Stunden.", "Der Rest <code>sekunden % 3600</code> enthält Minuten und Sekunden."],
      solution:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int sekunden = sc.nextInt();
        int h = sekunden / 3600;
        int min = sekunden % 3600 / 60;
        int s = sekunden % 60;
        System.out.println(h + " h " + min + " min " + s + " s");
    }
}`},
    {id:"schaltjahr", level:1, lesson:"eingabe", title:"Schaltjahr",
      text:"<p>Ein Jahr ist ein Schaltjahr, wenn es durch 4 teilbar ist, aber nicht durch 100. Durch 400 teilbare Jahre sind trotzdem Schaltjahre. Lies ein Jahr ein und gib <code>2024 ist ein Schaltjahr.</code> oder <code>2023 ist kein Schaltjahr.</code> aus.</p>",
      start:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int jahr = sc.nextInt();

    }
}
`,
      tests:[{input:["2024"], expect:"2024 ist ein Schaltjahr.\n"}, {input:["2023"], expect:"2023 ist kein Schaltjahr.\n"}, {input:["1900"], expect:"1900 ist kein Schaltjahr.\n"}, {input:["2000"], expect:"2000 ist ein Schaltjahr.\n"}],
      hints:["Teilbar heißt: Der Rest ist 0, also <code>jahr % 4 == 0</code>.", "Die ganze Bedingung: <code>(jahr % 4 == 0 &amp;&amp; jahr % 100 != 0) || jahr % 400 == 0</code>"],
      solution:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int jahr = sc.nextInt();
        boolean schalt = (jahr % 4 == 0 && jahr % 100 != 0) || jahr % 400 == 0;
        if (schalt) {
            System.out.println(jahr + " ist ein Schaltjahr.");
        } else {
            System.out.println(jahr + " ist kein Schaltjahr.");
        }
    }
}`},
    {id:"note", level:2, lesson:"verzweigungen", title:"IHK-Notenschlüssel",
      text:"<p>Rechne Punkte (0 bis 100) nach dem IHK-Schlüssel in eine Note um: 100 bis 92 ergibt 1 (sehr gut), 91 bis 81 ergibt 2 (gut), 80 bis 67 ergibt 3 (befriedigend), 66 bis 50 ergibt 4 (ausreichend), 49 bis 30 ergibt 5 (mangelhaft), darunter 6 (ungenügend). Gib <code>Note: 2 (gut)</code> aus.</p>",
      start:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int punkte = sc.nextInt();

    }
}
`,
      tests:[{input:["92"], expect:"Note: 1 (sehr gut)\n"}, {input:["91"], expect:"Note: 2 (gut)\n"}, {input:["70"], expect:"Note: 3 (befriedigend)\n"}, {input:["50"], expect:"Note: 4 (ausreichend)\n"}, {input:["49"], expect:"Note: 5 (mangelhaft)\n"}, {input:["12"], expect:"Note: 6 (ungenügend)\n"}],
      hints:["Prüfe von der besten Note abwärts mit <code>if</code> und <code>else if</code>.", "Speichere Note und Wort in Variablen und gib am Ende einmal aus."],
      solution:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int punkte = sc.nextInt();
        int note;
        String wort;
        if (punkte >= 92) { note = 1; wort = "sehr gut"; }
        else if (punkte >= 81) { note = 2; wort = "gut"; }
        else if (punkte >= 67) { note = 3; wort = "befriedigend"; }
        else if (punkte >= 50) { note = 4; wort = "ausreichend"; }
        else if (punkte >= 30) { note = 5; wort = "mangelhaft"; }
        else { note = 6; wort = "ungenügend"; }
        System.out.println("Note: " + note + " (" + wort + ")");
    }
}`},
    {id:"fizzbuzz", level:2, lesson:"schleifen", title:"FizzBuzz",
      text:"<p>Lies eine Zahl n ein und gib die Zahlen von 1 bis n aus, jede in einer Zeile. Statt einer durch 3 teilbaren Zahl gib <code>Fizz</code> aus, statt einer durch 5 teilbaren <code>Buzz</code> und statt einer durch 3 und 5 teilbaren <code>FizzBuzz</code>.</p>",
      start:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();

    }
}
`,
      tests:[{input:["15"], expect:"1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n"}, {input:["5"], expect:"1\n2\nFizz\n4\nBuzz\n"}],
      hints:["Prüfe den Fall <code>i % 15 == 0</code> zuerst, sonst greift schon die Regel für 3.", "Die Schleife: <code>for (int i = 1; i &lt;= n; i++)</code>"],
      solution:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 1; i <= n; i++) {
            if (i % 15 == 0) System.out.println("FizzBuzz");
            else if (i % 3 == 0) System.out.println("Fizz");
            else if (i % 5 == 0) System.out.println("Buzz");
            else System.out.println(i);
        }
    }
}`},
    {id:"palindrom", level:2, lesson:"strings", title:"Palindrom",
      text:"<p>Ein Palindrom liest sich vorwärts und rückwärts gleich. Lies ein Wort ein und prüfe es ohne Rücksicht auf Groß- und Kleinschreibung. Gib <code>Anna ist ein Palindrom.</code> oder <code>Java ist kein Palindrom.</code> aus, mit dem Wort so, wie es eingegeben wurde.</p>",
      start:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String wort = sc.nextLine();

    }
}
`,
      tests:[{input:["Anna"], expect:"Anna ist ein Palindrom.\n"}, {input:["Java"], expect:"Java ist kein Palindrom.\n"}, {input:["Rentner"], expect:"Rentner ist ein Palindrom.\n"}],
      hints:["Vergleiche die Zeichen von außen nach innen: <code>charAt(i)</code> mit <code>charAt(laenge - 1 - i)</code>.", "Oder dreh das Wort mit <code>new StringBuilder(klein).reverse().toString()</code> um und vergleiche mit <code>equals</code>."],
      solution:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String wort = sc.nextLine();
        String klein = wort.toLowerCase();
        String umgedreht = new StringBuilder(klein).reverse().toString();
        if (klein.equals(umgedreht)) {
            System.out.println(wort + " ist ein Palindrom.");
        } else {
            System.out.println(wort + " ist kein Palindrom.");
        }
    }
}`},
    {id:"temperaturen", level:2, lesson:"arrays", title:"Serverraum-Temperaturen",
      text:"<p>Lies 7 Temperaturen (ganze Zahlen, eine pro Tag) in ein Array ein. Gib danach die höchste und niedrigste Temperatur sowie den Durchschnitt mit einer Nachkommastelle aus.</p>",
      start:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] temp = new int[7];

    }
}
`,
      tests:[{input:["21", "23", "22", "27", "24", "20", "22"], expect:"Höchstwert: 27\nTiefstwert: 20\nDurchschnitt: 22.7\n"}, {input:["18", "18", "18", "18", "18", "18", "19"], expect:"Höchstwert: 19\nTiefstwert: 18\nDurchschnitt: 18.1\n"}],
      hints:["Fülle das Array in einer for-Schleife mit <code>temp[i] = sc.nextInt();</code>.", "Starte Höchst- und Tiefstwert mit <code>temp[0]</code> und vergleiche dann alle Werte.", "Den Durchschnitt gibst du mit <code>printf(\"Durchschnitt: %.1f%n\", (double) summe / temp.length)</code> aus."],
      solution:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] temp = new int[7];
        for (int i = 0; i < temp.length; i++) {
            temp[i] = sc.nextInt();
        }
        int max = temp[0], min = temp[0], summe = 0;
        for (int t : temp) {
            if (t > max) max = t;
            if (t < min) min = t;
            summe += t;
        }
        System.out.println("Höchstwert: " + max);
        System.out.println("Tiefstwert: " + min);
        System.out.printf("Durchschnitt: %.1f%n", (double) summe / temp.length);
    }
}`},
    {id:"binaer", level:2, lesson:"methoden", title:"Dezimal in Binär",
      text:"<p>Schreibe eine Methode <code>static String zuBinaer(int zahl)</code>, die eine nicht negative Zahl in eine Binärzahl umwandelt, ohne <code>Integer.toBinaryString</code>. Teile dazu immer wieder durch 2 und sammle die Reste. Lies eine Zahl ein und gib <code>10 = 1010</code> aus.</p>",
      start:`import java.util.Scanner;

public class Main {
    static String zuBinaer(int zahl) {
        return "";
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int z = sc.nextInt();
        System.out.println(z + " = " + zuBinaer(z));
    }
}
`,
      tests:[{input:["10"], expect:"10 = 1010\n"}, {input:["255"], expect:"255 = 11111111\n"}, {input:["0"], expect:"0 = 0\n"}, {input:["192"], expect:"192 = 11000000\n"}],
      hints:["Der Rest <code>zahl % 2</code> ist die letzte Binärziffer, danach rechnest du mit <code>zahl / 2</code> weiter.", "Setze jede neue Ziffer vorne an: <code>ergebnis = (zahl % 2) + ergebnis;</code>", "Denk an den Sonderfall 0."],
      solution:`import java.util.Scanner;

public class Main {
    static String zuBinaer(int zahl) {
        if (zahl == 0) return "0";
        String ergebnis = "";
        while (zahl > 0) {
            ergebnis = (zahl % 2) + ergebnis;
            zahl = zahl / 2;
        }
        return ergebnis;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int z = sc.nextInt();
        System.out.println(z + " = " + zuBinaer(z));
    }
}`},
    {id:"konto", level:2, lesson:"klassen", title:"Klasse Lizenzkonto",
      text:"<p>Ein Lizenzkonto verwaltet, wie viele Softwarelizenzen frei sind. Vervollständige die Klasse <code>Lizenzkonto</code>:</p><ul><li>Der Konstruktor bekommt die Gesamtzahl der Lizenzen, am Anfang ist keine vergeben.</li><li><code>boolean vergeben(int anzahl)</code> vergibt Lizenzen, wenn genug frei sind, und gibt dann <code>true</code> zurück, sonst <code>false</code> ohne Änderung.</li><li><code>void zurueckgeben(int anzahl)</code> gibt Lizenzen frei, aber nie mehr als vergeben sind.</li><li><code>int frei()</code> liefert die Zahl freier Lizenzen.</li></ul><p>Die main-Methode ist fertig und darf nicht verändert werden.</p>",
      start:`class Lizenzkonto {
    private int gesamt;
    private int vergeben;

    Lizenzkonto(int gesamt) {
    }

    boolean vergeben(int anzahl) {
        return false;
    }

    void zurueckgeben(int anzahl) {
    }

    int frei() {
        return 0;
    }
}

public class Main {
    public static void main(String[] args) {
        Lizenzkonto office = new Lizenzkonto(10);
        System.out.println(office.vergeben(4) + " " + office.frei());
        System.out.println(office.vergeben(7) + " " + office.frei());
        office.zurueckgeben(2);
        System.out.println(office.frei());
        office.zurueckgeben(5);
        System.out.println(office.frei());
        System.out.println(office.vergeben(10) + " " + office.frei());
    }
}
`,
      tests:[{expect:"true 6\nfalse 6\n8\n10\ntrue 0\n"}],
      hideExample:true,
      hints:["Im Konstruktor: <code>this.gesamt = gesamt;</code>", "Freie Lizenzen sind <code>gesamt - vergeben</code>.", "In <code>zurueckgeben</code> hilft <code>Math.min(anzahl, vergeben)</code>."],
      solution:`class Lizenzkonto {
    private int gesamt;
    private int vergeben;

    Lizenzkonto(int gesamt) {
        this.gesamt = gesamt;
        this.vergeben = 0;
    }

    boolean vergeben(int anzahl) {
        if (anzahl > frei()) return false;
        vergeben += anzahl;
        return true;
    }

    void zurueckgeben(int anzahl) {
        vergeben -= Math.min(anzahl, vergeben);
    }

    int frei() {
        return gesamt - vergeben;
    }
}

public class Main {
    public static void main(String[] args) {
        Lizenzkonto office = new Lizenzkonto(10);
        System.out.println(office.vergeben(4) + " " + office.frei());
        System.out.println(office.vergeben(7) + " " + office.frei());
        office.zurueckgeben(2);
        System.out.println(office.frei());
        office.zurueckgeben(5);
        System.out.println(office.frei());
        System.out.println(office.vergeben(10) + " " + office.frei());
    }
}`},
    {id:"einkauf", level:2, lesson:"arraylist", title:"Bestellliste",
      text:"<p>Lies Artikelnamen ein, einen pro Zeile, bis jemand <code>fertig</code> eingibt. Doppelte Artikel sollen nur einmal in die Liste. Gib danach die Artikel alphabetisch sortiert mit Nummer aus und zum Schluss die Anzahl.</p>",
      start:`import java.util.ArrayList;
import java.util.Collections;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ArrayList<String> artikel = new ArrayList<>();

    }
}
`,
      tests:[{input:["Toner", "Maus", "HDMI-Kabel", "Maus", "fertig"], expect:"1. HDMI-Kabel\n2. Maus\n3. Toner\n3 Artikel\n"}, {input:["fertig"], expect:"0 Artikel\n"}],
      hints:["Eine Schleife mit <code>while (true)</code> und <code>break</code>, sobald die Zeile <code>fertig</code> ist. Vergleiche mit <code>equals</code>.", "Nur hinzufügen, wenn <code>!artikel.contains(name)</code>.", "Sortieren mit <code>Collections.sort(artikel)</code>."],
      solution:`import java.util.ArrayList;
import java.util.Collections;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ArrayList<String> artikel = new ArrayList<>();
        while (true) {
            String name = sc.nextLine();
            if (name.equals("fertig")) break;
            if (!artikel.contains(name)) artikel.add(name);
        }
        Collections.sort(artikel);
        for (int i = 0; i < artikel.size(); i++) {
            System.out.println((i + 1) + ". " + artikel.get(i));
        }
        System.out.println(artikel.size() + " Artikel");
    }
}`},
    {id:"ip", level:3, lesson:"exceptions", title:"IPv4-Adresse prüfen",
      text:"<p>Lies eine Zeile ein und prüfe, ob sie eine gültige IPv4-Adresse ist: vier Teile, durch Punkte getrennt, jeder Teil eine ganze Zahl von 0 bis 255 ohne Vorzeichen. Gib <code>gültig</code> oder <code>ungültig</code> aus. Nutze <code>Integer.parseInt</code> und fange die <code>NumberFormatException</code> ab.</p>",
      start:`import java.util.Scanner;

public class Main {
    static boolean istGueltig(String ip) {
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String ip = sc.nextLine();
        System.out.println(istGueltig(ip) ? "gültig" : "ungültig");
    }
}
`,
      tests:[{input:["192.168.178.1"], expect:"gültig\n"}, {input:["10.0.0.256"], expect:"ungültig\n"}, {input:["10.0.0"], expect:"ungültig\n"}, {input:["10.a.0.1"], expect:"ungültig\n"}, {input:["255.255.255.0"], expect:"gültig\n"}, {input:["1.2.3.-4"], expect:"ungültig\n"}],
      hints:["Der Punkt ist in regulären Ausdrücken ein Sonderzeichen. Zum Trennen schreibst du <code>ip.split(\"\\\\.\")</code>.", "Prüfe zuerst, ob genau 4 Teile herauskommen.", "Ein Minus erkennst du mit <code>teil.startsWith(\"-\")</code>, oder du prüfst den Wertebereich nach dem Umwandeln."],
      solution:`import java.util.Scanner;

public class Main {
    static boolean istGueltig(String ip) {
        String[] teile = ip.split("\\\\.");
        if (teile.length != 4) return false;
        for (String teil : teile) {
            if (teil.isEmpty() || teil.startsWith("-") || teil.startsWith("+")) return false;
            try {
                int wert = Integer.parseInt(teil);
                if (wert < 0 || wert > 255) return false;
            } catch (NumberFormatException e) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String ip = sc.nextLine();
        System.out.println(istGueltig(ip) ? "gültig" : "ungültig");
    }
}`},
    {id:"geraete", level:3, lesson:"vererbung", title:"Inventar mit Vererbung",
      text:"<p>Ergänze das Programm um eine abstrakte Klasse <code>Geraet</code> mit Name und Kaufpreis und der abstrakten Methode <code>double jahresKosten()</code>. Leite zwei Klassen ab:</p><ul><li><code>PC</code>: Jahreskosten sind 20 Prozent des Kaufpreises.</li><li><code>Drucker</code>: zusätzlich Seiten pro Jahr, Jahreskosten sind 10 Prozent des Kaufpreises plus 2 Cent pro Seite.</li></ul><p>Die main-Methode ist fertig und darf nicht verändert werden.</p>",
      start:`// Schreibe hier die Klassen Geraet, PC und Drucker

public class Main {
    public static void main(String[] args) {
        Geraet[] inventar = {
            new PC("PC-01", 900),
            new Drucker("DR-01", 400, 12000),
            new PC("PC-02", 1200)
        };
        double summe = 0;
        for (Geraet g : inventar) {
            System.out.printf("%s: %.2f Euro%n", g.getName(), g.jahresKosten());
            summe += g.jahresKosten();
        }
        System.out.printf("Summe: %.2f Euro%n", summe);
    }
}
`,
      tests:[{expect:"PC-01: 180.00 Euro\nDR-01: 280.00 Euro\nPC-02: 240.00 Euro\nSumme: 700.00 Euro\n"}],
      hideExample:true,
      hints:["<code>abstract class Geraet { ... abstract double jahresKosten(); }</code>", "Die Unterklassen rufen im Konstruktor <code>super(name, preis)</code> auf.", "Für die Seitenkosten: <code>seiten * 0.02</code>."],
      solution:`abstract class Geraet {
    private String name;
    protected double preis;

    Geraet(String name, double preis) {
        this.name = name;
        this.preis = preis;
    }

    String getName() {
        return name;
    }

    abstract double jahresKosten();
}

class PC extends Geraet {
    PC(String name, double preis) {
        super(name, preis);
    }

    double jahresKosten() {
        return preis * 0.2;
    }
}

class Drucker extends Geraet {
    private int seiten;

    Drucker(String name, double preis, int seiten) {
        super(name, preis);
        this.seiten = seiten;
    }

    double jahresKosten() {
        return preis * 0.1 + seiten * 0.02;
    }
}

public class Main {
    public static void main(String[] args) {
        Geraet[] inventar = {
            new PC("PC-01", 900),
            new Drucker("DR-01", 400, 12000),
            new PC("PC-02", 1200)
        };
        double summe = 0;
        for (Geraet g : inventar) {
            System.out.printf("%s: %.2f Euro%n", g.getName(), g.jahresKosten());
            summe += g.jahresKosten();
        }
        System.out.printf("Summe: %.2f Euro%n", summe);
    }
}`}
  ]
});
