/* Zweite Runde Erweiterungen: Jede Aussage stammt aus der bei der Lernseite verlinkten Quelle.
   Neue Karten und Fragen nur hinten anhängen: Die Position bestimmt die ID und damit den Lernstand. */
(() => {
const RFC = n => [`RFC ${n}`, `https://www.rfc-editor.org/rfc/rfc${n}.txt`];
const NIST_800_41 = ["NIST SP 800-41 Rev. 1: Firewalls", "https://csrc.nist.gov/pubs/sp/800/41/r1/final"];
const NIST_800_207 = ["NIST SP 800-207: Zero Trust", "https://csrc.nist.gov/pubs/sp/800/207/final"];
const NIST_800_63B = ["NIST SP 800-63B: Authentisierung", "https://pages.nist.gov/800-63-4/sp800-63b.html"];
const NIST_800_34 = ["NIST SP 800-34 Rev. 1: Notfallplanung", "https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final"];
const OWASP_TOP = ["OWASP Top 10:2025", "https://top10.owasp.org/2025/"];
const OWASP_SQL = ["OWASP: SQL Injection Prevention", "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html"];
const OWASP_PW = ["OWASP: Password Storage", "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html"];
const FIPS_197 = ["NIST FIPS 197: AES", "https://csrc.nist.gov/pubs/fips/197/final"];
const BSI_TR = ["BSI TR-02102: Kryptographische Verfahren", "https://www.bsi.bund.de/DE/Themen/Unternehmen-und-Organisationen/Standards-und-Zertifizierung/Technische-Richtlinien/TR-nach-Thema-sortiert/tr02102/tr-02102.html"];
const BSI_BACKUP = ["BSI: Datensicherung, wie geht das?", "https://www.bsi.bund.de/DE/Themen/Verbraucherinnen-und-Verbraucher/Informationen-und-Empfehlungen/Cyber-Sicherheitsempfehlungen/Daten-sichern-verschluesseln-und-loeschen/Datensicherung-und-Datenverlust/Datensicherung-wie-geht-das/datensicherung-wie-geht-das_node.html"];
const BSI_BACKUPDAY = ["BSI: World Backup Day 2026", "https://www.bsi.bund.de/DE/Service-Navi/Presse/Pressemitteilungen/Presse2026/260330_World_Backup_Day.html"];
const NIST_BINARY = ["NIST: Binärpräfixe", "https://physics.nist.gov/cuu/Units/binary.html"];
const SVT = ["Schulz von Thun: Kommunikationsquadrat", "https://www.schulz-von-thun.de/die-modelle/das-kommunikationsquadrat"];
const LASTEN = ["Lexware: Lastenheft (zitiert DIN 69901-5)", "https://www.lexware.de/wissen/unternehmerlexikon/lastenheft/"];
const PFLICHT = ["Lexware: Pflichtenheft (zitiert DIN 69901-5)", "https://www.lexware.de/wissen/unternehmerlexikon/pflichtenheft/"];
const NWA = ["Gabler: Nutzwertanalyse", "https://wirtschaftslexikon.gabler.de/definition/nutzwertanalyse-42926"];
const SCRUM = ["Scrum Guide 2020", "https://scrumguides.org/scrum-guide.html"];
const KRIT = ["Gabler: kritischer Vorgang", "https://wirtschaftslexikon.gabler.de/definition/kritischer-vorgang-38353"];
const PUFFER = ["Gabler: Vorgangspuffer", "https://wirtschaftslexikon.gabler.de/definition/vorgangspuffer-49885"];
const FIAUSBV = ["Verordnung FIAusbV", "https://www.gesetze-im-internet.de/fiausbv/BJNR025000020.html"];

window.LERN_EXT = window.LERN_EXT || [];
window.LERN_EXT.push(
  {id:"netz",
    addSec:{
      subnet:[{h:"CIDR und Sonderfälle", list:["CIDR ersetzt die alten Klassen A, B und C durch klassenlose Präfixe", "Schreibweise: Adresse, Schrägstrich und eine Zahl von 0 bis 32 für die maßgeblichen Bits, etwa 172.16.0.0/16", "Ziel von CIDR: Adressraum sparen und Routen zusammenfassen, damit globale Routingtabellen langsamer wachsen", "Ein /32 ist eine einzelne Adresse, eine sogenannte Host-Route", "Ein /31 ist auf Punkt-zu-Punkt-Verbindungen erlaubt: Beide Adressen gelten dort als Host-Adressen"]},
        {warn:"Die Formel mit minus 2 passt nicht zum /31 auf einer Punkt-zu-Punkt-Verbindung. Dort gibt es keine eigene Netz- und Broadcast-Adresse, beide Adressen sind für Hosts."}],
      switch:[{h:"VLAN-Grenze, STP und ARP", list:["Die VLAN-ID ist 12 Bit lang, die Grenze liegt bei 4094 VLANs", "STP blockiert Leitungen, damit keine Schleifen entstehen. Diese Leitungen bleiben dann ungenutzt", "ARP ermittelt zu einer Protokolladresse wie der IP-Adresse die Ethernet-Adresse im lokalen Netz"]}],
      betrieb:[{h:"Syslog-Schweregrade (RFC 5424)", table:{head:["Wert", "Name", "Bedeutung"], rows:[["0", "Emergency", "System ist unbenutzbar"], ["1", "Alert", "Sofort handeln"], ["2", "Critical", "Kritischer Zustand"], ["3", "Error", "Fehler"], ["4", "Warning", "Warnung"], ["5", "Notice", "Normal, aber bedeutsam"], ["6", "Informational", "Information"], ["7", "Debug", "Meldung zur Fehlersuche"]]}},
        {tip:"Bei Syslog gilt: Je kleiner die Zahl, desto schwerer die Meldung. 0 ist am schlimmsten, 7 ist Debug."},
        {h:"SNMP und VRRP genauer", list:["Manager: fragt Daten ab und empfängt Meldungen", "Agent: läuft auf dem verwalteten Gerät und hat Zugriff auf dessen Verwaltungsdaten", "MIB: virtueller Datenspeicher, in dem die verwalteten Objekte liegen", "SNMPv3 mit USM bietet Authentifizierung der Herkunft und Vertraulichkeit der Daten", "VRRP wählt einen Active Router für ein virtuelles Gateway. Fällt er aus, übernimmt automatisch ein Backup Router"]}]
    },
    sources:{subnet:[RFC(4632), RFC(3021)], switch:[RFC(7348), RFC(826)], betrieb:[RFC(5424), RFC(3411), RFC(3414), RFC(9568)]},
    cards:[
      {u:"subnet", f:"Wofür darf ein /31 genutzt werden?", b:"Für Punkt-zu-Punkt-Verbindungen. Beide Adressen sind dort Host-Adressen (RFC 3021)."},
      {u:"subnet", f:"Was bedeutet ein /32?", b:"Eine einzelne Adresse, eine Host-Route (RFC 4632)."},
      {u:"switch", f:"Wie lang ist die VLAN-ID?", b:"12 Bit, die Grenze liegt bei 4094 VLANs."},
      {u:"switch", f:"Was macht ARP?", b:"Es ermittelt zu einer Protokolladresse wie der IP-Adresse die Ethernet-Adresse im lokalen Netz."},
      {u:"betrieb", f:"Welcher Syslog-Wert ist am schwersten?", b:"0, Emergency: Das System ist unbenutzbar."},
      {u:"betrieb", f:"Was ist die MIB?", b:"Ein virtueller Datenspeicher, in dem bei SNMP die verwalteten Objekte liegen."},
      {u:"betrieb", f:"Wofür dient VRRP?", b:"Mehrere Router stellen ein virtuelles Gateway bereit. Fällt der Active Router aus, übernimmt ein Backup Router."}
    ],
    questions:[
      {u:"subnet", ap:"both", q:"Wo ist ein /31 nach RFC 3021 erlaubt?", o:["Auf Punkt-zu-Punkt-Verbindungen", "In jedem Büronetz", "Nur bei IPv6", "Nur für Broadcasts"], e:"Auf Punkt-zu-Punkt-Verbindungen gelten beide Adressen eines /31 als Host-Adressen."},
      {u:"switch", ap:"both", q:"Wie viele VLANs erlaubt die 12 Bit lange VLAN-ID höchstens?", o:["4094", "256", "1024", "65535"], e:"RFC 7348 nennt für VLANs die Grenze von 4094."},
      {u:"betrieb", ap:"both", q:"Welche Syslog-Meldung ist am schwersten?", o:["Emergency (0)", "Debug (7)", "Warning (4)", "Notice (5)"], e:"RFC 5424 ordnet die Schwere von 0 Emergency bis 7 Debug."},
      {u:"betrieb", ap:"both", q:"Welches Protokoll sichert das Standardgateway mit einem Backup Router ab?", o:["VRRP", "SNMP", "Syslog", "ARP"], e:"VRRP wählt einen Active Router. Fällt er aus, übernimmt ein Backup Router."}
    ]},
  {id:"sicher",
    addSec:{
      krypto:[{h:"AES und TLS genauer", list:["AES verschlüsselt Blöcke von 128 Bit, die Schlüssel sind 128, 192 oder 256 Bit lang", "TLS soll Abhören, Manipulieren und gefälschte Nachrichten verhindern", "Bei TLS 1.3 ist der Server immer authentifiziert, der Client nur optional", "TLS 1.3 hat statisches RSA entfernt: Jeder Schlüsseltausch mit öffentlichen Schlüsseln bietet Forward Secrecy"]},
        {h:"Passwörter richtig speichern", list:["Schnelle Hashes wie SHA-256 eignen sich nicht für Passwörter", "OWASP empfiehlt langsame Verfahren: Argon2id, sonst scrypt, bei Altsystemen bcrypt, bei FIPS-Vorgaben PBKDF2", "Ein Salt ist eine eindeutige, zufällige Zeichenfolge je Passwort. Vorberechnete Tabellen helfen Angreifern dann nicht mehr"]}],
      angriffe:[{h:"OWASP Top 10:2025", table:{head:["Platz", "Kategorie"], rows:[["A01", "Broken Access Control: fehlerhafte Zugriffskontrolle"], ["A02", "Security Misconfiguration: falsche Sicherheitseinstellungen"], ["A03", "Software Supply Chain Failures: Schwächen in der Lieferkette"], ["A04", "Cryptographic Failures: Fehler bei der Kryptografie"], ["A05", "Injection: eingeschleuste Befehle"], ["A06", "Insecure Design: unsicherer Entwurf"], ["A07", "Authentication Failures: Fehler bei der Anmeldung"], ["A08", "Software or Data Integrity Failures: Fehler bei der Integrität"], ["A09", "Security Logging and Alerting Failures: Fehler bei Protokollen und Alarmen"], ["A10", "Mishandling of Exceptional Conditions: falscher Umgang mit Ausnahmen"]]}},
        {h:"SQL-Injection richtig verhindern", list:["Erste Wahl: Prepared Statements mit Parametern", "Manuelles Escaping ersetzt keine Parameter", "Stored Procedures schützen nur den Aufruf, nicht dynamisches SQL in ihrem Inneren", "Minimale Rechte begrenzen den Schaden, verhindern die Lücke aber nicht"]}],
      schutz:[{h:"Firewall-Techniken nach NIST", list:["Stateful Inspection verfolgt den Zustand von Verbindungen und blockiert Pakete, die davon abweichen", "Application Firewall: analysiert Protokolle auf Anwendungsebene und vergleicht sie mit Profilen harmloser Aktivität", "Application-Proxy-Gateway: Es entstehen zwei getrennte Verbindungen, Client zu Proxy und Proxy zu Ziel. Eine direkte Verbindung gibt es nicht"]},
        {h:"Zero Trust nach NIST SP 800-207", list:["Der Schutz verlagert sich von festen Netzgrenzen auf Nutzer, Geräte und Ressourcen", "Jede Kommunikation wird gesichert, der Standort im Netz allein begründet kein Vertrauen", "Zugriff wird je Sitzung gewährt, mit den geringsten nötigen Rechten", "Über den Zugriff entscheidet eine dynamische Richtlinie", "Kein Gerät gilt von sich aus als vertrauenswürdig, sein Sicherheitszustand wird laufend gemessen"]},
        {h:"MFA und VPN genauer", list:["Die drei Faktoren: etwas, das du weißt, etwas, das du hast, und etwas, das du bist", "Für MFA braucht es zwei verschiedene Faktoren", "Ein biometrisches Merkmal allein gilt bei NIST nicht als Authenticator", "IPsec nutzt AH und ESP: AH sichert Integrität und Herkunft, ESP zusätzlich die Vertraulichkeit", "Der Transportmodus schützt vor allem die Protokolle der nächsten Schicht, der Tunnelmodus getunnelte IP-Pakete", "WireGuard kapselt IP-Pakete sicher in UDP"]}],
      backup:[{h:"Kennzahlen genauer (NIST SP 800-34)", list:["RTO: längste Zeit, die eine Ressource ausfallen darf, bevor es zu inakzeptablen Folgen kommt", "RPO: Zeitpunkt vor dem Ausfall, bis zu dem sich Daten aus der letzten Sicherung wiederherstellen lassen", "MTD: gesamte Ausfallzeit, die der Verantwortliche für einen Prozess akzeptiert", "Das RTO muss normalerweise kürzer sein als die MTD"]},
        {h:"Empfehlungen des BSI", list:["Backup räumlich getrennt vom PC aufbewahren", "Grund: So ist für Ernstfälle wie Einbruch oder Brand vorgesorgt", "Sicherstellen, dass sich die Daten auch wieder einspielen lassen", "Backup-Software nutzen, weil die Abläufe von Hand sehr kompliziert sein können", "Die Lebensdauer von Speichermedien lässt sich nicht genau vorhersagen"]}]
    },
    sources:{krypto:[FIPS_197, RFC(8446), OWASP_PW, BSI_TR], angriffe:[OWASP_TOP, OWASP_SQL], schutz:[NIST_800_41, NIST_800_207, NIST_800_63B, RFC(4301), ["WireGuard", "https://www.wireguard.com/"]], backup:[NIST_800_34, BSI_BACKUP, BSI_BACKUPDAY]},
    cards:[
      {u:"krypto", f:"Welche Schlüssellängen und welche Blockgröße hat AES?", b:"Schlüssel mit 128, 192 oder 256 Bit, Blöcke mit 128 Bit (FIPS 197)."},
      {u:"krypto", f:"Warum ist SHA-256 allein schlecht für Passwörter?", b:"Es ist zu schnell. OWASP empfiehlt langsame Verfahren wie Argon2id."},
      {u:"angriffe", f:"Platz 1 der OWASP Top 10:2025?", b:"A01: Broken Access Control, also fehlerhafte Zugriffskontrolle."},
      {u:"angriffe", f:"Beste Abwehr gegen SQL-Injection?", b:"Prepared Statements mit Parametern."},
      {u:"schutz", f:"Was ist der Unterschied zwischen AH und ESP?", b:"AH sichert Integrität und Herkunft, ESP zusätzlich die Vertraulichkeit."},
      {u:"schutz", f:"Grundgedanke von Zero Trust?", b:"Der Standort im Netz allein begründet kein Vertrauen. Zugriff wird je Sitzung geprüft."},
      {u:"backup", f:"Was misst das RPO?", b:"Den Zeitpunkt vor dem Ausfall, bis zu dem Daten wiederhergestellt werden können, also den tolerierbaren Datenverlust."},
      {u:"backup", f:"Was misst das RTO?", b:"Wie lange eine Ressource höchstens ausfallen darf, bevor es zu inakzeptablen Folgen kommt."}
    ],
    questions:[
      {u:"krypto", ap:"both", q:"Welche Blockgröße hat AES?", o:["128 Bit", "56 Bit", "64 Bit", "512 Bit"], e:"FIPS 197: AES transformiert Daten in Blöcken von 128 Bit."},
      {u:"krypto", ap:"both", q:"Welches Verfahren empfiehlt OWASP zum Speichern von Passwörtern?", o:["Argon2id", "SHA-256", "MD5", "AES ohne Salt"], e:"Schnelle Hashes wie SHA-256 sind laut OWASP ungeeignet, empfohlen sind langsame Verfahren wie Argon2id."},
      {u:"angriffe", ap:"both", q:"Was steht auf Platz 1 der OWASP Top 10:2025?", o:["Broken Access Control", "Injection", "Insecure Design", "Cryptographic Failures"], e:"A01:2025 ist Broken Access Control."},
      {u:"angriffe", ap:"both", q:"Welche Maßnahme verhindert SQL-Injection zuerst?", o:["Prepared Statements mit Parametern", "Manuelles Escaping", "Minimale Rechte allein", "Längere Passwörter"], e:"OWASP nennt Prepared Statements als erste Wahl. Minimale Rechte begrenzen nur den Schaden."},
      {u:"schutz", ap:"both", q:"Welches IPsec-Protokoll bietet auch Vertraulichkeit?", o:["ESP", "AH", "ICMP", "ARP"], e:"RFC 4301: ESP bietet dieselben Dienste wie AH und zusätzlich Vertraulichkeit."},
      {u:"schutz", ap:"both", q:"Was gilt bei Zero Trust?", o:["Der Standort im Netz allein begründet kein Vertrauen", "Interne Geräte sind automatisch vertrauenswürdig", "Eine Anmeldung gilt dauerhaft für alles", "Die Firewall ersetzt jede Prüfung"], e:"NIST SP 800-207: Zugriff wird je Sitzung gewährt, kein Gerät gilt von sich aus als vertrauenswürdig."},
      {u:"schutz", ap:"both", q:"Welche Kombination ist echte MFA?", o:["Passwort und Hardware-Token", "Zwei Passwörter", "Passwort und PIN", "Zwei Sicherheitsfragen"], e:"MFA braucht zwei verschiedene Faktoren, hier Wissen und Besitz."},
      {u:"backup", ap:"both", q:"Welche Kennzahl beschreibt den tolerierbaren Datenverlust?", o:["RPO", "RTO", "MTD", "SLA"], e:"Das RPO legt den Zeitpunkt fest, bis zu dem Daten wiederhergestellt werden."}
    ]},
  {id:"platz",
    addSec:{
      einheiten:[{h:"Binärpräfixe genauer", list:["Die IEC hat die Namen 1998 als internationalen Standard beschlossen: kibi, mebi, gibi, tebi, pebi, exbi", "1 kbit = 1000 bit, 1 Kibit = 1024 bit", "1 MiB = 1.048.576 Byte", "1 GiB = 1.073.741.824 Byte", "Die Binärpräfixe gehören nicht zum internationalen Einheitensystem SI"]}],
      beratung:[{h:"Vier Seiten einer Nachricht", table:{head:["Seite", "Darauf achtet das Ohr"], rows:[["Sachinformation", "Stimmt es, ist es wichtig, reicht es aus?"], ["Selbstkundgabe", "Was ist das für einer?"], ["Beziehungshinweis", "Fühle ich mich wertgeschätzt oder abgelehnt?"], ["Appell", "Was soll ich jetzt tun, denken oder fühlen?"]]}},
        {p:"Friedemann Schulz von Thun hat die vier Seiten 1981 als Quadrat dargestellt. Jede Äußerung enthält alle vier Botschaften gleichzeitig. Selbstoffenbarung und Beziehung sind die oft genutzten Namen für Selbstkundgabe und Beziehungshinweis."},
        {h:"Lasten- und Pflichtenheft nach DIN 69901-5", list:["Lastenheft: die vom Auftraggeber festgelegte Gesamtheit der Forderungen an Lieferungen und Leistungen eines Auftragnehmers", "Pflichtenheft: die vom Auftragnehmer erarbeiteten Vorgaben zur Umsetzung, auf Grundlage des Lastenhefts"]}],
      beschaffung:[{h:"Nutzwertanalyse genauer", list:["Sie bewertet Alternativen auch nach Kriterien, die sich nicht in Geld ausdrücken lassen", "Schritt 1: Ziele aufteilen und gewichten", "Schritt 2: Jede Alternative je Kriterium bewerten", "Schritt 3: Gewichtung mal Bewertung rechnen", "Schritt 4: Werte addieren, der höchste Nutzwert gewinnt", "Schwachpunkt: Die Gewichtung ist subjektiv. Ändere sie testweise und prüfe, ob das Ergebnis hält (Sensitivitätsanalyse)"]}]
    },
    sources:{einheiten:[NIST_BINARY], beratung:[SVT, LASTEN, PFLICHT], beschaffung:[NWA]},
    cards:[
      {u:"einheiten", f:"Wie viele Byte hat 1 MiB?", b:"1.048.576 Byte."},
      {u:"beratung", f:"Die vier Seiten einer Nachricht?", b:"Sachinformation, Selbstkundgabe, Beziehungshinweis und Appell."},
      {u:"beschaffung", f:"Wie wird der Zielwert in der Nutzwertanalyse berechnet?", b:"Gewichtung mal Bewertung des Kriteriums."}
    ],
    questions:[
      {u:"einheiten", ap:"both", q:"Wie viele Byte hat 1 GiB?", o:["1.073.741.824", "1.000.000.000", "1.048.576", "1.024.000"], e:"NIST: 1 GiB sind 2 hoch 30 Byte, also 1.073.741.824 Byte."},
      {u:"beratung", ap:"both", q:"Wer legt das Lastenheft fest?", o:["Der Auftraggeber", "Der Auftragnehmer", "Die Bank", "Der Hersteller der Hardware"], e:"DIN 69901-5: die vom Auftraggeber festgelegte Gesamtheit der Forderungen."},
      {u:"beschaffung", ap:"both", q:"Welche Alternative wird bei der Nutzwertanalyse gewählt?", o:["Die mit dem höchsten Nutzwert", "Immer die billigste", "Die mit den meisten Kriterien", "Die mit dem niedrigsten Nutzwert"], e:"Die gewichteten Werte werden addiert, die höchste Summe wird gewählt."}
    ]},
  {id:"wiso",
    addSec:{
      projekt:[{h:"Scrum nach dem Scrum Guide 2020", table:{head:["Ereignis", "Dauer"], rows:[["Sprint", "ein Monat oder weniger"], ["Sprint Planning", "höchstens 8 Stunden bei einem Monat Sprint"], ["Daily Scrum", "15 Minuten"], ["Sprint Review", "höchstens 4 Stunden bei einem Monat Sprint"], ["Sprint Retrospective", "höchstens 3 Stunden bei einem Monat Sprint"]]}},
        {list:["Das Scrum Team besteht aus einem Scrum Master, einem Product Owner und den Developers", "Es umfasst typischerweise 10 oder weniger Personen", "Der Product Owner verantwortet den Wert des Produkts", "Artefakte: Product Backlog (Product Goal), Sprint Backlog (Sprint Goal), Increment (Definition of Done)"]}],
      netzplan:[{h:"Die Begriffe genau", list:["Ein kritischer Vorgang hat einen Gesamtpuffer von null", "Beginnt er später oder dauert er länger, verlängert sich entsprechend die ganze Projektdauer", "Vorgangspuffer: So weit lässt sich ein Vorgang dehnen oder verschieben, ohne das Projektende zu gefährden"]}]
    },
    sources:{projekt:[SCRUM], netzplan:[KRIT, PUFFER]},
    addUnits:[
      {id:"pruefung", title:"Deine Abschlussprüfung", sum:"Prüfungsbereiche, Dauer, Gewichtung und wann du bestanden hast.", src:[FIAUSBV], sec:[
        {p:"Die Ausbildung dauert drei Jahre. Teil 1 der Abschlussprüfung findet im vierten Ausbildungshalbjahr statt, Teil 2 am Ende. Für die Fachrichtung Systemintegration gilt die Verordnung über die Berufsausbildung zum Fachinformatiker (FIAusbV)."},
        {h:"Bereiche und Gewichtung", table:{head:["Prüfungsbereich", "Dauer", "Gewicht"], rows:[["Teil 1: Einrichten eines IT-gestützten Arbeitsplatzes", "90 Minuten", "20 %"], ["Planen und Umsetzen eines Projektes der Systemintegration", "siehe unten", "50 %"], ["Konzeption und Administration von IT-Systemen", "90 Minuten", "10 %"], ["Analyse und Entwicklung von Netzwerken", "90 Minuten", "10 %"], ["Wirtschafts- und Sozialkunde", "60 Minuten", "10 %"]]}},
        {h:"Die betriebliche Projektarbeit", list:["Projekt und Dokumentation: höchstens 40 Stunden", "Präsentation: höchstens 15 Minuten", "Präsentation und Fachgespräch zusammen: höchstens 30 Minuten", "Beide Teile zählen je 50 % des Bereichs"]},
        {h:"So hast du bestanden (§ 24)", list:["Gesamtergebnis aus Teil 1 und Teil 2 mindestens ausreichend", "Ergebnis von Teil 2 mindestens ausreichend", "Mindestens drei Bereiche von Teil 2 mindestens ausreichend", "Kein Bereich von Teil 2 mit ungenügend"]},
        {warn:"Ein einziges Ungenügend in Teil 2 reicht, um nicht zu bestehen, auch wenn der Rest gut ist."},
        {h:"Mündliche Ergänzungsprüfung (§ 25)", list:["Möglich in Konzeption und Administration, in Netzwerken oder in Wirtschafts- und Sozialkunde, nicht im Projekt", "Der Bereich wurde schlechter als ausreichend bewertet und die Prüfung kann über das Bestehen entscheiden", "Nur in einem Bereich", "Sie soll 15 Minuten dauern", "Altes und mündliches Ergebnis zählen im Verhältnis 2 zu 1"]},
        {tip:"Prüfe die Regeln vor der Prüfung noch einmal in der aktuellen Verordnung und frag bei deiner IHK nach, was dort konkret gilt."}
      ]}
    ],
    cards:[
      {u:"projekt", f:"Wie lange dauert ein Sprint höchstens?", b:"Einen Monat (Scrum Guide 2020)."},
      {u:"projekt", f:"Wer gehört zum Scrum Team?", b:"Ein Scrum Master, ein Product Owner und die Developers."},
      {u:"netzplan", f:"Was ist ein kritischer Vorgang?", b:"Ein Vorgang mit Gesamtpuffer null. Verzögert er sich, verlängert sich das Projekt."},
      {u:"pruefung", f:"Wie viel zählt die Projektarbeit?", b:"50 % der Abschlussprüfung."},
      {u:"pruefung", f:"Wie viel zählt Teil 1?", b:"20 %, in 90 Minuten."},
      {u:"pruefung", f:"Wie lange darf die Projektarbeit dauern?", b:"Höchstens 40 Stunden, dazu Präsentation und Fachgespräch mit zusammen höchstens 30 Minuten."}
    ],
    questions:[
      {u:"projekt", ap:"both", q:"Wie lange dauert das Daily Scrum?", o:["15 Minuten", "30 Minuten", "1 Stunde", "4 Stunden"], e:"Scrum Guide 2020: ein 15-Minuten-Ereignis für die Developers."},
      {u:"netzplan", ap:"both", q:"Welchen Gesamtpuffer hat ein kritischer Vorgang?", o:["Null", "Einen Tag", "Die halbe Projektdauer", "Unbegrenzt"], e:"Gabler: ein Vorgang, dessen gesamte Pufferzeit gleich null ist."},
      {u:"pruefung", ap:"both", q:"Wie hoch ist die Gewichtung von Teil 1 der Abschlussprüfung?", o:["20 %", "10 %", "50 %", "40 %"], e:"§ 24 FIAusbV: Teil 1 zählt 20 Prozent."},
      {u:"pruefung", ap:"both", q:"Was führt in Teil 2 auf jeden Fall zum Nichtbestehen?", o:["Ein Bereich mit ungenügend", "Ein Bereich mit befriedigend", "Eine Note 3 im Projekt", "Eine mündliche Ergänzungsprüfung"], e:"§ 24 Abs. 2 FIAusbV: Kein Prüfungsbereich von Teil 2 darf ungenügend sein."},
      {u:"pruefung", ap:"both", q:"In welchem Bereich gibt es keine mündliche Ergänzungsprüfung?", o:["In der Projektarbeit", "In Netzwerken", "In Wirtschafts- und Sozialkunde", "In Konzeption und Administration"], e:"§ 25 FIAusbV nennt nur die drei schriftlichen Bereiche von Teil 2."}
    ]}
);

/* Was ITU-T X.200 (07/94), Abschnitte 7.1 bis 7.7, als Zweck jeder Schicht nennt. Eigene Übersetzung. */
window.LERN_OSI_NORM = {
  1:"Stellt mechanische, elektrische, funktionale und prozedurale Mittel bereit, um physische Verbindungen für die Bitübertragung zu aktivieren, aufrechtzuerhalten und zu deaktivieren (Abschnitt 7.7.2).",
  2:"Stellt die Mittel für die Übertragung zwischen Netzinstanzen bereit und erkennt und korrigiert eventuell Fehler, die in der Bitübertragungsschicht auftreten (Abschnitt 7.6.2).",
  3:"Stellt die Übertragung zwischen Transportinstanzen bereit und macht diese unabhängig von Fragen des Routings und der Weiterleitung (Abschnitt 7.5.2).",
  4:"Überträgt Daten transparent zwischen Sitzungsinstanzen und nimmt ihnen ab, sich darum zu kümmern, wie zuverlässige und kostengünstige Übertragung erreicht wird (Abschnitt 7.4.2).",
  5:"Gibt zusammenarbeitenden Instanzen die Mittel, ihren Dialog zu organisieren und zu synchronisieren und ihren Datenaustausch zu steuern (Abschnitt 7.3.2).",
  6:"Sorgt für eine gemeinsame Darstellung der übertragenen Daten und macht Anwendungen damit unabhängig von der Syntax (Abschnitt 7.2.2).",
  7:"Ist die höchste Schicht und für den Anwendungsprozess der einzige Zugang zur OSI-Umgebung (Abschnitt 7.1.2)."
};
window.LERN_OSI_SRC = [["ITU-T X.200 (07/94): OSI-Referenzmodell", "https://www.itu.int/rec/T-REC-X.200-199407-I/en"], ["RFC 1122: Schichten im Internet", "https://www.rfc-editor.org/rfc/rfc1122.txt"]];
})();
