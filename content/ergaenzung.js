/*! IT-Lernlabor · © 2026 Alexander S. · Alle Rechte vorbehalten. Nutzung nur nach LICENSE. */
/* Erweiterungen mit Quellenangabe je Lernseite. Die Aussagen stützen sich auf die dort verlinkten Quellen.
   Neue Karten und Fragen nur hinten anhängen: Die Position bestimmt die ID und damit den Lernstand. */
const RFC = n => [`RFC ${n}`, `https://www.rfc-editor.org/rfc/rfc${n}.txt`];
const GESETZ = (name, pfad, nr) => [`§ ${nr} ${name}`, `https://www.gesetze-im-internet.de/${pfad}/__${nr}.html`];
const DSGVO = n => [`Art. ${n} DSGVO`, `https://dsgvo-gesetz.de/art-${n}-dsgvo/`];
const MAN = (name, teil) => [`man ${name}`, `https://man7.org/linux/man-pages/man${teil}/${name}.${teil}.html`];
window.LERN_EXT = [
  {id:"netz",
    addSec:{
      ipv4:[{h:"Weitere reservierte Bereiche", table:{head:["Bereich", "Name", "Bedeutung"], rows:[["127.0.0.0/8", "Loopback", "nicht routbar, das eigene Gerät"], ["100.64.0.0/10", "Shared Address Space", "routbar, aber nicht global"], ["192.0.2.0/24", "TEST-NET-1", "nur für Dokumentation"], ["169.254.0.0/16", "Link Local", "gilt nur auf demselben Link"]]}},
        {p:"Private Adressen haben keine globale Bedeutung. Routen zu ihnen sollen nicht zwischen Organisationen weitergegeben werden. Link-Local-Adressen wählt ein Host pseudo-zufällig aus 169.254.1.0 bis 169.254.254.255. Ein DHCP-Server oder Admin soll sie nicht vergeben."}],
      ipv6:[{h:"Schreibweise nach RFC 5952", list:["Hexziffern a bis f immer kleinschreiben", "Führende Nullen immer weglassen, 0000 wird zu 0", ":: so weit wie möglich nutzen, aber nicht für einen einzelnen Null-Block", "Bei mehreren Null-Folgen die längste kürzen, bei gleicher Länge die erste"]},
        {h:"Adressarten", list:["Unicast: eine einzelne Schnittstelle", "Anycast: eine Gruppe von Schnittstellen, zugestellt wird an die nächstgelegene", "Multicast: eine Gruppe, zugestellt wird an alle Mitglieder", "::/128 ist die unspezifizierte Adresse, 2001:db8::/32 ist für Dokumentation reserviert"]},
        {h:"Neighbor Discovery und SLAAC", table:{head:["ICMPv6-Typ", "Nachricht", "Zweck"], rows:[["133", "Router Solicitation", "Host fragt nach Routern"], ["134", "Router Advertisement", "Router meldet sich"], ["135", "Neighbor Solicitation", "fragt nach der Link-Layer-Adresse"], ["136", "Neighbor Advertisement", "antwortet darauf"], ["137", "Redirect", "nennt einen besseren nächsten Hop"]]}},
        {p:"Bei SLAAC erzeugt ein Host selbst eine Link-Local-Adresse und globale Adressen. Duplicate Address Detection prüft, ob die Adresse auf dem Link eindeutig ist."}],
      routing:[{h:"Protokolle genauer", list:["OSPF: Jeder Router führt eine identische Datenbank der Topologie und berechnet daraus einen Shortest-Path-Baum", "OSPF gruppiert Netze in Areas, die Metrik ist dimensionslose Kosten", "RIP: Metrik 1 bis 15, der Wert 16 bedeutet unerreichbar", "BGP: Routing zwischen autonomen Systemen, läuft über TCP-Port 179"]}],
      dienste:[{h:"DHCP-Vergabearten", list:["Automatisch: dauerhafte Adresse vom Server", "Dynamisch: Adresse für begrenzte Zeit, nur diese Art erlaubt Wiederverwendung", "Manuell: Der Admin legt die Adresse fest, DHCP übermittelt sie nur"]},
        {h:"Weitere DHCP-Nachrichten", list:["DHCPNAK: Server lehnt ab", "DHCPDECLINE: Client meldet, dass die Adresse schon benutzt wird", "DHCPRELEASE: Client gibt die Adresse frei", "DHCPINFORM: Client fragt nur nach Parametern"]},
        {h:"Weitere Ports", table:{head:["Port", "Dienst"], rows:[["20 / 21", "FTP Daten / Steuerung"], ["23", "Telnet"], ["69", "TFTP"], ["110", "POP3"], ["162", "SNMP-Traps"], ["179", "BGP"]]}}]
    },
    addUnits:[
      {id:"tcpudp", title:"TCP, UDP und ICMP", sum:"Handshake, Flags, Zustände und ICMP-Meldungen.", sec:[
        {h:"Drei-Wege-Handshake", list:["A sendet SYN mit Sequenznummer 100", "B antwortet mit SYN und ACK: eigene Sequenznummer 300, ACK 101", "A sendet ACK 301, die Verbindung steht"]},
        {h:"Wichtige Flags", table:{head:["Flag", "Bedeutung"], rows:[["SYN", "Sequenznummern synchronisieren"], ["ACK", "Bestätigungsfeld ist gültig"], ["FIN", "Keine weiteren Daten vom Sender"], ["RST", "Verbindung zurücksetzen"]]}},
        {h:"Zustände einer TCP-Verbindung", p:"LISTEN, SYN-SENT, SYN-RECEIVED, ESTABLISHED, FIN-WAIT-1, FIN-WAIT-2, CLOSE-WAIT, CLOSING, LAST-ACK, TIME-WAIT und CLOSED. Wer aktiv schließt, bleibt zwei MSL in TIME-WAIT. Die Spezifikation setzt die MSL auf 2 Minuten."},
        {h:"UDP", list:["Transaktionsorientiert: Zustellung und Schutz vor Duplikaten sind nicht garantiert", "Header aus Quellport, Zielport, Länge und Prüfsumme", "Mindestlänge 8 Byte, IP-Protokollnummer 17"]},
        {h:"ICMP-Typen", table:{head:["Typ", "Meldung"], rows:[["0 / 8", "Echo Reply / Echo, das nutzt ping"], ["3", "Destination Unreachable"], ["5", "Redirect"], ["11", "Time Exceeded, darauf baut traceroute auf"]]}},
        {h:"Destination Unreachable: Codes", table:{head:["Code", "Bedeutung"], rows:[["0", "Netz nicht erreichbar"], ["1", "Host nicht erreichbar"], ["3", "Port nicht erreichbar"], ["4", "Fragmentierung nötig, aber DF gesetzt"]]}}
      ]}
    ],
    sources:{
      ipv4:[RFC(1918), RFC(3927), RFC(6890)], ipv6:[RFC(4291), RFC(5952), RFC(4193), RFC(4861), RFC(4862)],
      routing:[RFC(2328), RFC(2453), RFC(4271)], dienste:[RFC(2131), ["IANA Port-Register", "https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml"]],
      wlan:[["Wi-Fi Alliance", "https://www.wi-fi.org/discover-wi-fi/wi-fi-certified-7"]], tcpudp:[RFC(9293), RFC(768), RFC(792)]
    },
    cards:[
      {u:"tcpudp", f:"Ablauf des TCP-Handshakes", b:"SYN, SYN und ACK, ACK"},
      {u:"tcpudp", f:"Was bedeutet das FIN-Flag?", b:"Keine weiteren Daten vom Sender"},
      {u:"tcpudp", f:"Was bedeutet das RST-Flag?", b:"Die Verbindung wird zurückgesetzt"},
      {u:"tcpudp", f:"ICMP-Typ von ping", b:"Echo (8) und Echo Reply (0)"},
      {u:"tcpudp", f:"ICMP Time Exceeded: Typ", b:"11"},
      {u:"tcpudp", f:"IP-Protokollnummer von UDP", b:"17"},
      {u:"ipv6", f:"ICMPv6-Typen der Neighbor Discovery", b:"133 RS, 134 RA, 135 NS, 136 NA, 137 Redirect"},
      {u:"ipv6", f:"Darf :: einen einzelnen Null-Block ersetzen?", b:"Nach RFC 5952 nein, ein einzelner Block bleibt 0"},
      {u:"ipv6", f:"Wozu dient Duplicate Address Detection?", b:"Sie prüft, ob eine Adresse auf dem Link eindeutig ist"},
      {u:"routing", f:"Welcher RIP-Wert bedeutet unerreichbar?", b:"16"},
      {u:"routing", f:"Auf welchem Port läuft BGP?", b:"TCP 179"},
      {u:"dienste", f:"Die drei DHCP-Vergabearten", b:"Automatisch, dynamisch, manuell"},
      {u:"ipv4", f:"Was ist 100.64.0.0/10?", b:"Shared Address Space, routbar, aber nicht global"},
      {u:"ipv4", f:"Wofür ist 192.0.2.0/24 reserviert?", b:"Für Dokumentation (TEST-NET-1)"}
    ],
    questions:[
      {u:"tcpudp", ap:"both", q:"Welche Reihenfolge hat der TCP-Handshake?", o:["SYN, SYN und ACK, ACK","SYN, ACK, FIN","ACK, SYN, RST","SYN, FIN, ACK"], e:"RFC 9293 beschreibt den Verbindungsaufbau als Drei-Wege-Handshake."},
      {u:"tcpudp", ap:"AP2", q:"Welches Flag bricht eine TCP-Verbindung sofort ab?", o:["RST","FIN","SYN","PSH"], e:"RST setzt die Verbindung zurück. FIN meldet dagegen nur: Vom Sender kommen keine Daten mehr."},
      {u:"tcpudp", ap:"both", q:"Welche Aussage über UDP stimmt?", o:["Zustellung ist nicht garantiert","Es baut zuerst mit einem Handshake eine Verbindung auf","Jedes Segment wird bestätigt","Der Header hat mindestens 20 Byte"], e:"RFC 768: Zustellung und Schutz vor Duplikaten sind nicht garantiert. Der Header ist 8 Byte lang."},
      {u:"tcpudp", ap:"AP2", q:"Ein Router verwirft ein Paket, weil die TTL abgelaufen ist. Welche ICMP-Meldung schickt er?", o:["Time Exceeded (Typ 11)","Echo Reply (Typ 0)","Destination Unreachable (Typ 3)","Echo (Typ 8)"], e:"Code 0 von Typ 11 heißt: time to live exceeded in transit."},
      {u:"tcpudp", ap:"AP2", q:"Ein Zielhost läuft, aber dort lauscht kein Dienst auf dem UDP-Port. Welchen Code von Destination Unreachable erwartest du?", o:["3: Port nicht erreichbar","0: Netz nicht erreichbar","1: Host nicht erreichbar","4: Fragmentierung nötig"], e:"RFC 792 definiert Code 3 als port unreachable."},
      {u:"ipv6", ap:"AP2", q:"Welche Schreibweise entspricht RFC 5952?", o:["2001:db8::1","2001:DB8::1","2001:0db8::1","2001:db8:0:0:0:0:0:1"], e:"Kleinschreibung, keine führenden Nullen und :: so weit wie möglich."},
      {u:"ipv6", ap:"AP2", q:"Mit welcher Nachricht fragt ein Host aktiv nach Routern?", o:["Router Solicitation","Router Advertisement","Neighbor Advertisement","Redirect"], e:"RS ist ICMPv6-Typ 133, der Router antwortet mit einem RA (Typ 134)."},
      {u:"ipv6", ap:"AP2", q:"Wohin wird ein Paket an eine Anycast-Adresse zugestellt?", o:["An die nächstgelegene Schnittstelle der Gruppe","An alle Schnittstellen der Gruppe","An alle Hosts im Link","An den Standard-Router"], e:"Nächstgelegen im Sinne des Routings. An alle Mitglieder geht Multicast."},
      {u:"routing", ap:"AP2", q:"Was ist die Metrik von OSPF?", o:["Dimensionslose Kosten","Anzahl der Hops, maximal 15","Pfad aus autonomen Systemen","Die Bitrate des Providers"], e:"RFC 2328 beschreibt eine einzelne dimensionslose Metrik. Hops zählt RIP."},
      {u:"routing", ap:"AP2", q:"Welches Routingprotokoll arbeitet zwischen autonomen Systemen?", o:["BGP","OSPF","RIP","STP"], e:"BGP ist laut RFC 4271 ein Inter-AS-Protokoll und läuft auf TCP-Port 179."},
      {u:"dienste", ap:"AP2", q:"Bei welcher DHCP-Vergabeart kann eine Adresse automatisch wiederverwendet werden?", o:["Dynamisch","Automatisch","Manuell","Bei keiner"], e:"RFC 2131: Nur die dynamische Vergabe erlaubt die automatische Wiederverwendung."},
      {u:"ipv4", ap:"AP2", q:"Darf ein DHCP-Server Adressen aus 169.254.0.0/16 vergeben?", o:["Nein, das soll er nach RFC 3927 nicht","Ja, das ist dafür vorgesehen","Nur an Server","Nur im IPv6-Betrieb"], e:"Diese Adressen konfiguriert der Host selbst. Sie sollen nicht manuell oder per DHCP vergeben werden."}
    ]
  },
  {id:"sicher",
    addSec:{
      ziele:[{h:"Effekte beim Schutzbedarf", list:["Maximumprinzip: Der schwerste Schaden bestimmt den Schutzbedarf", "Kumulationseffekt: Viele kleine Schäden auf einem System ergeben zusammen einen höheren Schutzbedarf", "Verteilungseffekt: Läuft nur ein unwesentlicher Teil einer Anwendung auf dem System, kann der Schutzbedarf dort niedriger sein"]},
        {h:"Vorgehensweisen nach BSI-Standard 200-2", list:["Basis-Absicherung", "Standard-Absicherung", "Kern-Absicherung"]}],
      dsgvo:[{h:"Wann ist Verarbeitung erlaubt? (Art. 6)", p:"Mindestens eine Bedingung muss erfüllt sein: Einwilligung, Vertrag oder vorvertragliche Maßnahme, rechtliche Verpflichtung, lebenswichtige Interessen, Aufgabe im öffentlichen Interesse oder berechtigtes Interesse, sofern die Rechte der betroffenen Person nicht überwiegen."},
        {h:"Besondere Kategorien (Art. 9)", p:"Grundsätzlich untersagt ist die Verarbeitung von Daten zu Herkunft, politischer Meinung, Religion, Gewerkschaftszugehörigkeit, genetischen und biometrischen Daten zur Identifizierung, Gesundheit und Sexualleben. Ausnahmen regelt Absatz 2, etwa die ausdrückliche Einwilligung."},
        {h:"Fristen und Pflichten", table:{head:["Pflicht", "Regel", "Artikel"], rows:[["Antwort auf Anträge Betroffener", "unverzüglich, spätestens binnen 1 Monat, Verlängerung um 2 Monate möglich", "Art. 12"], ["Meldung an die Behörde", "unverzüglich und möglichst binnen 72 Stunden, außer es besteht voraussichtlich kein Risiko", "Art. 33"], ["Benachrichtigung Betroffener", "unverzüglich bei voraussichtlich hohem Risiko", "Art. 34"], ["Verzeichnis der Verarbeitungstätigkeiten", "schriftlich, auch elektronisch; Ausnahme unter 250 Beschäftigten nur eingeschränkt", "Art. 30"]]}},
        {h:"Datenschutzbeauftragte", list:["Pflicht zum Beispiel bei Behörden und umfangreicher, systematischer Überwachung (Art. 37)", "In Deutschland auch, wenn in der Regel mindestens 20 Personen ständig automatisiert personenbezogene Daten verarbeiten (§ 38 BDSG)"]},
        {h:"Technik und Bußgelder", list:["Pseudonymisierung: Daten sind ohne gesondert aufbewahrte Zusatzinfos keiner Person mehr zuzuordnen", "Art. 25: Datenschutz durch Technik und datenschutzfreundliche Voreinstellungen", "Art. 32 nennt unter anderem Pseudonymisierung, Verschlüsselung, schnelle Wiederherstellung und regelmäßige Überprüfung", "Bußgeld bis 10 Mio. Euro oder 2 % des Jahresumsatzes (Art. 83 Abs. 4)", "Bußgeld bis 20 Mio. Euro oder 4 % des Jahresumsatzes (Art. 83 Abs. 5), jeweils der höhere Betrag"]}]
    },
    addUnits:[
      {id:"bsi", title:"Empfehlungen des BSI", sum:"Passwörter, Zwei-Faktor und Schutz vor Ransomware.", sec:[
        {h:"Sichere Passwörter", list:["Mindestens 8 Zeichen, wenn vier Zeichenarten vorkommen", "Mindestens 25 Zeichen bei wenig Komplexität", "WLAN-Passwort mindestens 20 Zeichen", "Passphrasen aus 5 bis 6 Wörtern sind eine gute Alternative", "Passwortmanager helfen beim Verwalten"]},
        {p:"Das BSI empfiehlt zusätzlich die Zwei-Faktor-Authentisierung für Online-Konten."},
        {h:"Aus den Top-10-Maßnahmen gegen Ransomware", list:["Offline-Backups anlegen, getrennt vom Netz", "Den Wiederanlauf regelmäßig testen", "Einen geübten Notfallplan bereithalten", "Wichtige Telefonnummern auch offline aufbewahren"]},
        {tip:"Eine Sicherung, die dauerhaft am Netz hängt, kann Ransomware mit verschlüsseln. Deshalb die Trennung vom Netz."}
      ]}
    ],
    sources:{
      ziele:[["BSI: Schutzbedarf für IT-Systeme", "https://www.bsi.bund.de/DE/Themen/Unternehmen-und-Organisationen/Standards-und-Zertifizierung/IT-Grundschutz/Zertifizierte-Informationssicherheit/IT-Grundschutzschulung/Online-Kurs-IT-Grundschutz/Lektion_4_Schutzbedarfsfeststellung/Lektion_4_05/Lektion_4_05_node.html"], ["BSI-Standard 200-2", "https://www.bsi.bund.de/DE/Themen/Unternehmen-und-Organisationen/Standards-und-Zertifizierung/IT-Grundschutz/BSI-Standards/BSI-Standard-200-2-IT-Grundschutz-Methodik/bsi-standard-200-2-it-grundschutz-methodik_node.html"]],
      dsgvo:[DSGVO(5), DSGVO(6), DSGVO(9), DSGVO(12), DSGVO(30), DSGVO(32), DSGVO(33), DSGVO(34), DSGVO(37), DSGVO(83), GESETZ("BDSG", "bdsg_2018", 38)],
      bsi:[["BSI: Sichere Passwörter", "https://www.bsi.bund.de/DE/Themen/Verbraucherinnen-und-Verbraucher/Informationen-und-Empfehlungen/Cyber-Sicherheitsempfehlungen/Accountschutz/Sichere-Passwoerter-erstellen/sichere-passwoerter-erstellen_node.html"], ["BSI: Accountschutz", "https://www.bsi.bund.de/DE/Themen/Verbraucherinnen-und-Verbraucher/Informationen-und-Empfehlungen/Cyber-Sicherheitsempfehlungen/Accountschutz/accountschutz_node.html"], ["BSI: Top 10 gegen Ransomware", "https://www.bsi.bund.de/DE/Themen/Unternehmen-und-Organisationen/Cyber-Sicherheitslage/Analysen-und-Prognosen/Ransomware-Angriffe/Top-10-Ransomware-Massnahmen/top-10-ransomware-massnahmen_node.html"]]
    },
    cards:[
      {u:"ziele", f:"Was ist der Kumulationseffekt?", b:"Viele kleine Schäden auf einem System ergeben zusammen einen höheren Schutzbedarf"},
      {u:"ziele", f:"Was ist der Verteilungseffekt?", b:"Läuft nur ein unwesentlicher Teil einer Anwendung auf einem System, kann der Schutzbedarf dort niedriger sein"},
      {u:"ziele", f:"Vorgehensweisen nach BSI 200-2", b:"Basis-, Standard- und Kern-Absicherung"},
      {u:"dsgvo", f:"Antwortfrist auf einen Auskunftsantrag", b:"Unverzüglich, spätestens binnen eines Monats"},
      {u:"dsgvo", f:"Art. 34 DSGVO: wann Betroffene informieren?", b:"Unverzüglich bei voraussichtlich hohem Risiko"},
      {u:"dsgvo", f:"Was ist Pseudonymisierung?", b:"Daten sind ohne gesondert aufbewahrte Zusatzinfos keiner Person mehr zuzuordnen"},
      {u:"dsgvo", f:"Datenschutzbeauftragter nach § 38 BDSG", b:"Wenn in der Regel mindestens 20 Personen ständig automatisiert personenbezogene Daten verarbeiten"},
      {u:"dsgvo", f:"Bußgeld nach Art. 83 Abs. 4 DSGVO", b:"Bis 10 Mio. Euro oder 2 % des Jahresumsatzes, der höhere Betrag zählt"},
      {u:"dsgvo", f:"Was verlangt Rechenschaftspflicht (Art. 5 Abs. 2)?", b:"Der Verantwortliche muss die Einhaltung der Grundsätze nachweisen können"},
      {u:"bsi", f:"BSI: Mindestlänge fürs WLAN-Passwort", b:"20 Zeichen"},
      {u:"bsi", f:"Wie schützt das BSI Backups vor Ransomware?", b:"Offline-Backups, getrennt vom Netz, und getesteter Wiederanlauf"}
    ],
    questions:[
      {u:"ziele", ap:"AP2", q:"Zwei gespiegelte Server mit normalem Schutzbedarf stehen im selben Raum. Ein Brand träfe beide. Welcher Effekt kann den Schutzbedarf des Raums erhöhen?", o:["Kumulationseffekt","Verteilungseffekt","Maximumprinzip","Least Privilege"], e:"Das BSI nennt genau dieses Beispiel für den Kumulationseffekt."},
      {u:"ziele", ap:"AP2", q:"Auf einem System läuft nur ein unwesentlicher Teil einer kritischen Anwendung. Welcher Effekt kann den Schutzbedarf senken?", o:["Verteilungseffekt","Kumulationseffekt","Maximumprinzip","Lawineneffekt"], e:"Der Verteilungseffekt wirkt relativierend."},
      {u:"dsgvo", ap:"AP1", q:"Binnen welcher Frist muss eine Firma einen Auskunftsantrag regelmäßig beantworten?", o:["Innerhalb eines Monats","Innerhalb von 72 Stunden","Innerhalb eines Jahres","Innerhalb von 14 Tagen"], e:"Art. 12 Abs. 3: unverzüglich, in jedem Fall innerhalb eines Monats. Eine Verlängerung um zwei Monate ist möglich."},
      {u:"dsgvo", ap:"AP1", q:"Worauf kann sich die Verarbeitung von Kundendaten für einen Kaufvertrag stützen?", o:["Art. 6 Abs. 1 lit. b: Vertragserfüllung","Nur auf eine Einwilligung","Auf die Handwerksordnung","Es braucht keine Grundlage"], e:"Die Vertragserfüllung ist eine der sechs Bedingungen in Art. 6 Abs. 1."},
      {u:"dsgvo", ap:"AP1", q:"Gesundheitsdaten fallen unter welche Regel?", o:["Art. 9: besondere Kategorien, grundsätzlich untersagt","Sie gelten nicht als personenbezogen","Art. 83: nur Bußgelder","Sie dürfen immer verarbeitet werden"], e:"Ausnahmen stehen in Art. 9 Abs. 2, zum Beispiel die ausdrückliche Einwilligung."},
      {u:"dsgvo", ap:"AP2", q:"Wann muss eine deutsche Firma einen Datenschutzbeauftragten benennen?", o:["Wenn in der Regel mindestens 20 Personen ständig automatisiert personenbezogene Daten verarbeiten","Immer ab einem Mitarbeiter","Erst ab 250 Beschäftigten","Nur bei Aktiengesellschaften"], e:"§ 38 Abs. 1 BDSG ergänzt so die Pflichten aus Art. 37 DSGVO."},
      {u:"dsgvo", ap:"AP2", q:"Wann sind zusätzlich zur Behörde auch die betroffenen Personen zu benachrichtigen?", o:["Bei voraussichtlich hohem Risiko","Bei jeder Änderung einer Adresse","Nur auf Anfrage der Polizei","Nie"], e:"Art. 34 Abs. 1 DSGVO."},
      {u:"dsgvo", ap:"AP2", q:"Was gilt bei der Höhe eines Bußgelds nach Art. 83 Abs. 5 DSGVO?", o:["Bis 20 Mio. Euro oder bis 4 % des Jahresumsatzes, der höhere Betrag zählt","Immer genau 20 Mio. Euro","Höchstens 10.000 Euro","Nur 1 % des Gewinns"], e:"Bei Verstößen unter Abs. 4 liegt die Grenze bei 10 Mio. Euro oder 2 %."},
      {u:"bsi", ap:"AP1", q:"Wie lang soll ein WLAN-Passwort laut BSI mindestens sein?", o:["20 Zeichen","8 Zeichen","6 Zeichen","64 Zeichen"], e:"Das BSI nennt für WLAN mindestens 20 Zeichen."},
      {u:"bsi", ap:"both", q:"Was empfiehlt das BSI beim Backup gegen Ransomware?", o:["Offline-Backups getrennt vom Netz und getesteter Wiederanlauf","Ein Backup dauerhaft als Netzlaufwerk einbinden","Nur RAID 1","Keine Backups, nur Virenschutz"], e:"Top-10-Maßnahme: Offline-Backup. Nur wer den Wiederanlauf testet, weiß, dass er funktioniert."}
    ]
  },
  {id:"admin",
    addSec:{
      linux:[{h:"Spezielle Rechte", table:{head:["Oktal", "Bit", "Wirkung"], rows:[["4", "setuid", "Programm läuft mit der User-ID des Besitzers"], ["2", "setgid", "Programm läuft mit der Group-ID der Gruppe"], ["1", "Sticky", "auf Verzeichnissen: nur eigene Dateien löschen oder umbenennen, typisch /tmp"]]}},
        {h:"Dienste richtig verstehen", list:["systemctl start: startet den Dienst jetzt", "systemctl enable: legt nur Symlinks an, damit er künftig automatisch startet, und startet ihn nicht", "journalctl -u: Meldungen einer Unit", "journalctl -f: neue Meldungen laufend zeigen", "journalctl -b: Meldungen eines Bootvorgangs"]},
        {h:"Offene Ports mit ss", list:["-t: TCP-Sockets", "-u: UDP-Sockets", "-l: nur lauschende Sockets", "-n: Dienstnamen nicht auflösen", "-p: zugehörige Prozesse anzeigen"]},
        {h:"Weitere Verzeichnisse", list:["/boot: Dateien für den Bootloader", "/dev: Gerätedateien", "/proc: Informationen zu Prozessen und Kernel", "/tmp: temporäre Dateien, können ohne Ankündigung gelöscht werden"]}],
      windows:[{h:"Verarbeitung von Gruppenrichtlinien genauer", list:["Reihenfolge: lokal, Standort, Domäne, OU, bei verschachtelten OUs erst die übergeordnete", "Spätere Richtlinien überschreiben frühere bei einem Konflikt", "Enforced: Diese Verknüpfung lässt sich nicht überschreiben", "Block Inheritance: unterbricht die Vererbung an einer Stelle"]},
        {h:"Bausteine von AD DS", list:["Schema: Regeln für Objektklassen und Attribute", "Globaler Katalog: enthält Informationen über jedes Objekt", "Replikation: Alle Domänencontroller einer Domäne haben eine vollständige Kopie der Daten ihrer Domäne"]},
        {h:"Befehle genauer", list:["gpupdate ohne Option: nur geänderte Einstellungen", "gpupdate /force: wendet alle Einstellungen erneut an", "gpresult /r: Zusammenfassung des Richtlinienergebnisses (RSoP)", "gpresult /h: Bericht als HTML-Datei"]}],
      raid:[{h:"Regel für gemischte Platten", p:"Die nutzbare Kapazität richtet sich nach der kleinsten Platte im Verbund. Bei RAID 1 entspricht sie der kleinsten gespiegelten Platte."}],
      speicher:[{h:"Grenzen", list:["NTFS: Volumes bis 8 PB ab Windows Server 2019 und Windows 10 1709, vorher 256 TB", "MBR: höchstens vier Partitionstabellen-Einträge, bei 512-Byte-Sektoren bis 2 TB", "GPT: theoretisch bis 2 hoch 64 logische Blöcke", "BitLocker: Das Betriebssystemlaufwerk muss NTFS sein, höchster Schutz mit TPM"]}],
      virtual:[{h:"NIST-Definition der Cloud", p:"NIST SP 800-145 beschreibt fünf wesentliche Merkmale (On-Demand Self-Service, breiter Netzzugang, Ressourcen-Pooling, schnelle Elastizität, gemessene Dienste), drei Servicemodelle (IaaS, PaaS, SaaS) und vier Bereitstellungsmodelle (private, community, public, hybrid)."},
        {h:"Wie Docker Container erklärt", p:"Ein Container ist ein isolierter Prozess mit allen Dateien, die er zum Laufen braucht. Mehrere Container teilen sich denselben Kernel. Eine VM ist dagegen ein ganzes Betriebssystem mit eigenem Kernel und eigenen Treibern."}],
      skripte:[{h:"Cron und find genau gelesen", list:["Wertebereiche: Minute 0-59, Stunde 0-23, Tag 1-31, Monat 1-12, Wochentag 0-7", "Beim Wochentag bedeuten 0 und 7 beide Sonntag", "Schritte sind möglich: */15 heißt alle 15 Einheiten", "Sind Tag und Wochentag beide eingeschränkt, läuft der Job, wenn eines zutrifft", "find -mtime +1 trifft erst Dateien, die mindestens zwei Tage alt sind, weil Bruchteile wegfallen"]}],
      betrieb:[{h:"USV-Klassen nach IEC 62040-3", table:{head:["Klasse", "Ausgang", "Bauform"], rows:[["VFI", "unabhängig von Spannung und Frequenz am Eingang", "Doppelwandler (Online)"], ["VI", "Spannung unabhängig, Frequenz folgt dem Eingang", "Line-Interactive"], ["VFD", "hängt von Spannung und Frequenz am Eingang ab", "Offline, Standby"]]}}]
    },
    sources:{
      linux:[MAN("chmod", 1), MAN("systemctl", 1), MAN("journalctl", 1), MAN("ss", 8), MAN("hier", 7)],
      windows:[["MS-GPOL: GPO Processing Order", "https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-gpol/41d4bdd2-352b-46bc-a8a8-5eba011bab52"], ["Microsoft: Group Policy scope", "https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-policy/group-policy-scope"], ["Microsoft: AD DS", "https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview"], ["Microsoft: Kerberos", "https://learn.microsoft.com/en-us/windows-server/security/kerberos/kerberos-authentication-overview"], ["Microsoft: gpupdate", "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/gpupdate"], ["Microsoft: gpresult", "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/gpresult"], ["Microsoft Q&A: Freigabe und NTFS", "https://learn.microsoft.com/en-us/answers/questions/2822069/which-permissions-override-when-using-folder-permi"]],
      raid:[["IBM Redpaper: RAID Solutions", "https://www.redbooks.ibm.com/redpapers/pdfs/redp5234.pdf"], ["Red Hat: Managing RAID", "https://docs.redhat.com/de/documentation/red_hat_enterprise_linux/9/html/managing_storage_devices/managing-raid_managing-storage-devices"]],
      speicher:[["Microsoft: NTFS", "https://learn.microsoft.com/en-us/windows-server/storage/file-server/ntfs-overview"], ["Microsoft: GPT-FAQ", "https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/windows-and-gpt-faq"], ["Microsoft: BitLocker", "https://learn.microsoft.com/en-us/windows/security/operating-system-security/data-protection/bitlocker/"], ["Microsoft Q&A: FAT32", "https://learn.microsoft.com/en-us/answers/questions/2530317/what-is-the-maximum-file-size-fat-fat32-ntfs-file"]],
      virtual:[["NIST SP 800-145", "https://csrc.nist.gov/pubs/sp/800/145/final"], ["Docker: Was ist ein Container?", "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/"], ["Red Hat: Hypervisor", "https://www.redhat.com/en/topics/virtualization/what-is-a-hypervisor"], ["Microsoft: Hyper-V", "https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/hyper-v-technology-overview"]],
      skripte:[MAN("crontab", 5), MAN("find", 1)],
      betrieb:[["Eaton: IEC 62040-3", "http://taa-ups.eaton.com/Deutschland/Products-services/Services/IEC/DE-class.asp"], ["Vertiv: Betriebsarten", "https://www.vertiv.com/4ab0b8/globalassets/shared/liebert-high-efficiency-modes-of-operation-wp-en-emea.pdf"]]
    },
    cards:[
      {u:"linux", f:"systemctl enable vs. start", b:"enable: künftiger Autostart, startet nicht.<br>start: startet jetzt."},
      {u:"linux", f:"Was bewirkt das Sticky-Bit auf /tmp?", b:"Nutzer können nur eigene Dateien löschen oder umbenennen"},
      {u:"linux", f:"Oktalwerte der Spezialrechte", b:"4 setuid, 2 setgid, 1 Sticky"},
      {u:"linux", f:"Welche Optionen zeigen lauschende TCP-Ports mit Prozess?", b:"ss -tlnp"},
      {u:"windows", f:"gpupdate ohne und mit /force", b:"Ohne: nur Geändertes.<br>Mit /force: alles neu anwenden."},
      {u:"windows", f:"Was bewirkt Enforced bei einer GPO?", b:"Die Einstellungen lassen sich nicht überschreiben"},
      {u:"windows", f:"Was enthält der globale Katalog?", b:"Informationen über jedes Objekt im Verzeichnis"},
      {u:"speicher", f:"Maximale NTFS-Volumegröße heute", b:"8 PB ab Windows Server 2019 und Windows 10 1709"},
      {u:"speicher", f:"Wie viele Einträge hat die MBR-Tabelle?", b:"Vier"},
      {u:"virtual", f:"NIST-Cloud: wie viele Merkmale und Modelle?", b:"5 Merkmale, 3 Servicemodelle, 4 Bereitstellungsmodelle"},
      {u:"virtual", f:"Bereitstellungsmodelle nach NIST", b:"Private, Community, Public, Hybrid"},
      {u:"skripte", f:"Cron: Was bedeuten 0 und 7 beim Wochentag?", b:"Beide Sonntag"},
      {u:"betrieb", f:"USV-Klasse VI", b:"Spannung am Ausgang unabhängig, Frequenz folgt dem Eingang"}
    ],
    questions:[
      {u:"linux", ap:"AP2", q:"Ein Dienst soll ab jetzt laufen und auch nach jedem Neustart. Was ist richtig?", o:["systemctl enable und systemctl start","Nur systemctl enable","Nur systemctl status","chmod +x auf den Dienst"], e:"Die Manpage: enable startet die Unit nicht. Beides ist unabhängig voneinander."},
      {u:"linux", ap:"AP2", q:"Welche Oktalzahl setzt das Sticky-Bit und volle Rechte für alle, wie bei /tmp üblich?", o:["1777","4777","2777","0777"], e:"Die erste Ziffer: 4 setuid, 2 setgid, 1 Sticky."},
      {u:"linux", ap:"AP2", q:"Welcher Befehl zeigt laufend neue Logzeilen des Dienstes ssh?", o:["journalctl -u ssh -f","journalctl -b ssh","systemctl enable ssh","ss -u ssh"], e:"-u wählt die Unit, -f folgt den neuen Einträgen."},
      {u:"linux", ap:"AP2", q:"Was enthält das Verzeichnis /proc?", o:["Informationen zu Prozessen und Kernel","Benutzerdaten","Den Bootloader","Konfigurationsdateien"], e:"Laut hier(7) ist es der Einhängepunkt des proc-Dateisystems."},
      {u:"windows", ap:"AP2", q:"Was macht gpupdate ohne die Option /force?", o:["Es wendet nur geänderte Einstellungen an","Es löscht alle Richtlinien","Es startet den Rechner neu","Es zeigt nur einen Bericht"], e:"/force wendet dagegen alle Einstellungen erneut an."},
      {u:"windows", ap:"AP2", q:"Eine Domänen-GPO soll sich von einer OU nicht überschreiben lassen. Was setzt du?", o:["Enforced","Block Inheritance","Loopback","Ein Sticky-Bit"], e:"Block Inheritance tut das Gegenteil und unterbricht die Vererbung."},
      {u:"windows", ap:"AP2", q:"Eine GPO hängt an einer übergeordneten OU, eine andere an der untergeordneten. Welche wird zuletzt angewandt?", o:["Die der untergeordneten OU","Die der übergeordneten OU","Die lokale","Die des Standorts"], e:"GPOs übergeordneter OUs werden vor denen untergeordneter angewandt, spätere überschreiben frühere."},
      {u:"speicher", ap:"AP2", q:"Wie viele Einträge hat die Partitionstabelle einer MBR-Platte?", o:["Vier","Zwei","128","Unbegrenzt"], e:"Laut Microsoft-FAQ zu GPT unterstützen MBR-Platten nur vier Einträge."},
      {u:"virtual", ap:"AP2", q:"Was teilen sich mehrere Container auf einem Host?", o:["Den Kernel","Ein eigenes Gastbetriebssystem je Container","Den BIOS-Chip jedes Containers","Nichts, sie sind VMs"], e:"Docker: Mehrere Container teilen sich denselben Kernel."},
      {u:"virtual", ap:"AP2", q:"Welche vier Bereitstellungsmodelle nennt NIST SP 800-145?", o:["Private, Community, Public, Hybrid","IaaS, PaaS, SaaS, FaaS","Typ 1, Typ 2, Typ 3, Typ 4","DAS, NAS, SAN, Cloud"], e:"IaaS, PaaS und SaaS sind die drei Servicemodelle."},
      {u:"skripte", ap:"AP2", q:"Wann läuft der Cron-Eintrag */15 * * * *?", o:["Alle 15 Minuten","Einmal täglich um 0:15 Uhr","Am 15. jedes Monats","Alle 15 Stunden"], e:"Das erste Feld ist die Minute, */15 bedeutet alle 15 Einheiten."},
      {u:"betrieb", ap:"AP2", q:"Bei welcher USV-Klasse hängt der Ausgang weder von Spannung noch Frequenz am Eingang ab?", o:["VFI","VI","VFD","VGA"], e:"VFI steht für Voltage and Frequency Independent, typisch beim Doppelwandler."}
    ]
  },
  {id:"platz",
    addSec:{
      hardware:[{h:"USB und Stromversorgung", list:["USB 3.2 kennt drei Datenraten: 5, 10 und 20 Gbit/s", "20 Gbit/s entstehen aus zwei Lanes mit je 10 Gbit/s", "USB Power Delivery 3.1 liefert über USB-C bis zu 240 W", "Thunderbolt 4 garantiert 40 Gbit/s bei passenden Kabeln"]}],
      einrichtung:[{h:"BitLocker-Voraussetzungen", list:["Verschlüsselt ganze Volumes", "Höchster Schutz in Verbindung mit einem TPM ab Version 1.2", "Das Betriebssystemlaufwerk muss NTFS sein", "Bei UEFI muss das Systemlaufwerk mit FAT32 formatiert sein"]}],
      uebergabe:[{h:"Definitionen nach ITIL 4", list:["Incident: eine ungeplante Unterbrechung eines Dienstes oder eine Minderung seiner Qualität", "Problem: die Ursache oder mögliche Ursache eines oder mehrerer Incidents"]}]
    },
    sources:{
      hardware:[["USB-IF: USB 3.2", "https://www.usb.org/usb-32-0"], ["USB-IF: Power Delivery", "https://www.usb.org/usb-charger-pd"], ["Phoronix: Thunderbolt 4", "https://www.phoronix.com/news/Intel-Thunderbolt-4"]],
      einrichtung:[["Microsoft: BitLocker", "https://learn.microsoft.com/en-us/windows/security/operating-system-security/data-protection/bitlocker/"], ["Microsoft: GPT-FAQ", "https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/windows-and-gpt-faq"]],
      uebergabe:[["Global Knowledge: Incident und Problem", "https://www.globalknowledge.com/en-ca/resources/articles/how-itil-differentiates-problems-and-incidents"]]
    },
    cards:[
      {u:"hardware", f:"Datenraten von USB 3.2", b:"5, 10 und 20 Gbit/s"},
      {u:"hardware", f:"Maximale Leistung von USB PD 3.1", b:"240 W"},
      {u:"einrichtung", f:"Womit erreicht BitLocker den höchsten Schutz?", b:"Mit einem TPM ab Version 1.2"},
      {u:"uebergabe", f:"Incident nach ITIL 4", b:"Ungeplante Unterbrechung eines Dienstes oder Minderung seiner Qualität"},
      {u:"uebergabe", f:"Problem nach ITIL 4", b:"Ursache oder mögliche Ursache eines oder mehrerer Incidents"}
    ],
    questions:[
      {u:"hardware", ap:"AP1", q:"Wie entstehen 20 Gbit/s bei USB 3.2?", o:["Durch zwei Lanes mit je 10 Gbit/s","Durch einen zweiten Stecker am Gerät","Durch Thunderbolt","Durch ein längeres Kabel"], e:"Das beschreibt das USB Implementers Forum zu USB 3.2."},
      {u:"hardware", ap:"AP1", q:"Welche Leistung ermöglicht USB Power Delivery 3.1 maximal?", o:["240 W","100 W","60 W","15 W"], e:"Mit 48 V sind bis zu 240 W möglich."},
      {u:"einrichtung", ap:"AP1", q:"Welches Dateisystem braucht das Betriebssystemlaufwerk für BitLocker?", o:["NTFS","FAT32","exFAT","ext4"], e:"Das Betriebssystemlaufwerk muss laut Microsoft NTFS sein."},
      {u:"uebergabe", ap:"AP1", q:"Wie definiert ITIL 4 ein Problem?", o:["Als Ursache oder mögliche Ursache von Incidents","Als jede Beschwerde eines Kunden","Als geplante Änderung","Als Anfrage nach einem neuen Passwort"], e:"Die Unterbrechung selbst ist der Incident."},
      {u:"uebergabe", ap:"AP1", q:"Der E-Mail-Dienst ist deutlich langsamer als vereinbart, aber nicht ausgefallen. Was ist das nach ITIL 4?", o:["Ein Incident","Kein Vorfall, weil er noch läuft","Ein Change","Ein Release"], e:"Auch eine Minderung der Qualität zählt als Incident."}
    ]
  },
  {id:"wiso",
    addSec:{
      recht:[{h:"Minderjährige und Taschengeld", list:["Für Geschäfte, die nicht nur rechtlich vorteilhaft sind, brauchen Minderjährige die Einwilligung (§ 107 BGB)", "Ohne sie hängt die Wirksamkeit von der Genehmigung ab, nach Aufforderung höchstens 2 Wochen (§ 108 BGB)", "Wirksam von Anfang an, wenn mit Mitteln bezahlt wurde, die zur freien Verfügung überlassen wurden (§ 110 BGB)"]},
        {h:"Antrag und Annahme", list:["Der Antragende ist an seinen Antrag gebunden, außer er schließt das aus (§ 145 BGB)", "Unter Anwesenden und am Telefon: nur sofort annehmbar (§ 147 BGB)", "Unter Abwesenden: bis eine Antwort regelmäßig zu erwarten ist"]},
        {h:"Rechte bei Mängeln (§ 437 BGB)", list:["Nacherfüllung: Der Käufer wählt zwischen Reparatur und mangelfreier Sache", "Rücktritt oder Minderung", "Schadensersatz oder Ersatz vergeblicher Aufwendungen", "Die Kosten der Nacherfüllung trägt der Verkäufer (§ 439 Abs. 2 BGB)"]},
        {h:"Zahlungsverzug (§ 286 BGB)", list:["In der Regel durch Mahnung nach Fälligkeit", "Ohne Mahnung bei kalendermäßig bestimmter Zeit oder endgültiger Weigerung", "Bei Entgeltforderungen spätestens 30 Tage nach Fälligkeit und Rechnungszugang, bei Verbrauchern nur mit Hinweis in der Rechnung"]},
        {h:"Widerruf bei Fernabsatz", p:"Verbraucher haben bei Fernabsatz und Verträgen außerhalb von Geschäftsräumen ein Widerrufsrecht. Die Frist beträgt 14 Tage (§ 355 BGB), eine Begründung ist nicht nötig. Für individuell angefertigte Waren besteht es zum Beispiel nicht (§ 312g BGB)."}],
      unternehmen:[{h:"Rechtsformen genauer", list:["UG: Stammkapital unter 25.000 €, voll einzuzahlen, Sacheinlagen ausgeschlossen", "UG: Ein Viertel des Jahresüberschusses geht in eine Rücklage", "OHG: Alle Gesellschafter haften persönlich als Gesamtschuldner", "KG: Der Kommanditist haftet bis zur Haftsumme, nicht soweit die Einlage geleistet ist", "AG: Der Vorstand leitet in eigener Verantwortung, der Aufsichtsrat überwacht"]}],
      kalkulation:[{h:"Umsatzsteuer (§ 12 UStG)", list:["Regelsatz: 19 %", "Ermäßigter Satz: 7 %, zum Beispiel für Gegenstände der Anlage 2 und kurzfristige Beherbergung"]}],
      arbeit:[{h:"Kündigung und Fristen genauer", table:{head:["Betriebszugehörigkeit", "Frist des Arbeitgebers zum Monatsende"], rows:[["ab 2 Jahre", "1 Monat"], ["ab 5 Jahre", "2 Monate"], ["ab 8 Jahre", "3 Monate"], ["ab 10 Jahre", "4 Monate"], ["ab 12 Jahre", "5 Monate"], ["ab 15 Jahre", "6 Monate"], ["ab 20 Jahre", "7 Monate"]]}},
        {list:["In einer vereinbarten Probezeit bis 6 Monate: 2 Wochen Frist (§ 622 Abs. 3 BGB)", "Kündigungsschutz nach dem KSchG: Arbeitsverhältnis länger als 6 Monate", "Gründe: in der Person, im Verhalten oder dringende betriebliche Erfordernisse", "Soziale Auswahl: Betriebszugehörigkeit, Alter, Unterhaltspflichten, Schwerbehinderung"]},
        {h:"Mitbestimmung des Betriebsrats (§ 87 BetrVG)", list:["Beginn und Ende der täglichen Arbeitszeit, Pausen", "Urlaubsgrundsätze und Urlaubsplan", "Technische Einrichtungen zur Überwachung", "Gesundheitsschutz", "Mobile Arbeit"]}]
    },
    addUnits:[
      {id:"azubi", title:"Pflichten in der Ausbildung", sum:"BBiG: Azubi, Betrieb, Vergütung und Kündigung.", sec:[
        {h:"Pflichten der Auszubildenden (§ 13 BBiG)", list:["Sich bemühen, die Handlungsfähigkeit zu erwerben", "Aufgaben sorgfältig ausführen", "An Maßnahmen teilnehmen, für die sie freigestellt sind, etwa Berufsschule", "Weisungen folgen und die Ordnung der Ausbildungsstätte beachten", "Werkzeug und Maschinen pfleglich behandeln", "Betriebs- und Geschäftsgeheimnisse wahren", "Einen schriftlichen oder elektronischen Ausbildungsnachweis führen"]},
        {h:"Pflichten des Betriebs (§ 14 BBiG)", list:["Planmäßig, zeitlich und sachlich gegliedert ausbilden", "Selbst ausbilden oder einen Ausbilder ausdrücklich beauftragen", "Ausbildungsmittel kostenlos stellen", "Zum Berufsschulbesuch anhalten", "Ausbildungsnachweise regelmäßig durchsehen", "Nur Aufgaben übertragen, die dem Ausbildungszweck dienen"]},
        {h:"Vergütung (§§ 17, 19 BBiG)", list:["Angemessen, und sie steigt mindestens jährlich", "Mehrarbeit besonders vergüten oder durch Freizeit ausgleichen", "Fortzahlung auch für die Freistellung", "Bis zu 6 Wochen, wenn die Ausbildung ausfällt oder man unverschuldet verhindert ist"]},
        {h:"Ende und Kündigung (§§ 21, 22 BBiG)", list:["Das Ausbildungsverhältnis endet mit Ablauf der Ausbildungsdauer", "Besteht man vorher, endet es mit Bekanntgabe des Prüfungsergebnisses", "Nicht bestanden: auf Verlangen Verlängerung bis zur Wiederholung, höchstens 1 Jahr", "Kündigung schriftlich, nach der Probezeit mit Angabe der Gründe, elektronisch ist ausgeschlossen", "Kündigung aus wichtigem Grund ist unwirksam, wenn die Tatsachen länger als 2 Wochen bekannt sind"]}
      ]},
      {id:"jugend", title:"Jugendarbeitsschutz", sum:"Was unter 18 anders gilt: Arbeitszeit, Pausen, Urlaub.", sec:[
        {h:"Erwachsene und Jugendliche im Vergleich", table:{head:["Regel", "ArbZG (ab 18)", "JArbSchG (unter 18)"], rows:[["Arbeitszeit täglich", "8 Stunden, bis 10 mit Ausgleich", "höchstens 8 Stunden"], ["Arbeitszeit wöchentlich", "keine eigene Wochengrenze im § 3", "höchstens 40 Stunden"], ["Pause", "30 Min. bei mehr als 6 Std., 45 Min. bei mehr als 9 Std.", "30 Min. bei mehr als 4,5 Std., 60 Min. bei mehr als 6 Std."], ["Ruhezeit", "11 Stunden", "12 Stunden"]]}},
        {h:"Pausen bei Jugendlichen", list:["Als Pause zählt nur eine Unterbrechung von mindestens 15 Minuten", "Frühestens 1 Stunde nach Beginn, spätestens 1 Stunde vor Ende", "Nie länger als 4,5 Stunden ohne Pause"]},
        {h:"Urlaub im Vergleich", table:{head:["Alter zu Beginn des Jahres", "Mindesturlaub"], rows:[["unter 16", "30 Werktage"], ["unter 17", "27 Werktage"], ["unter 18", "25 Werktage"], ["ab 18 (BUrlG)", "24 Werktage"]]}},
        {tip:"Werktage sind alle Tage außer Sonn- und Feiertagen, also auch der Samstag. Deshalb entsprechen 24 Werktage bei einer 5-Tage-Woche 20 Arbeitstagen."}
      ]}
    ],
    sources:{
      recht:[GESETZ("BGB", "bgb", 107), GESETZ("BGB", "bgb", 110), GESETZ("BGB", "bgb", 145), GESETZ("BGB", "bgb", 286), GESETZ("BGB", "bgb", 433), GESETZ("BGB", "bgb", 437), GESETZ("BGB", "bgb", 438), GESETZ("BGB", "bgb", 439), GESETZ("BGB", "bgb", 611), GESETZ("BGB", "bgb", 631), GESETZ("BGB", "bgb", 355), GESETZ("BGB", "bgb", "312g")],
      unternehmen:[GESETZ("GmbHG", "gmbhg", 5), GESETZ("GmbHG", "gmbhg", "5a"), GESETZ("AktG", "aktg", 7), GESETZ("AktG", "aktg", 76), GESETZ("AktG", "aktg", 111), GESETZ("HGB", "hgb", 126), GESETZ("HGB", "hgb", 161), GESETZ("HGB", "hgb", 171)],
      kalkulation:[GESETZ("UStG", "ustg_1980", 12)],
      arbeit:[GESETZ("BGB", "bgb", 622), GESETZ("KSchG", "kschg", 1), GESETZ("KSchG", "kschg", 4), GESETZ("BetrVG", "betrvg", 1), GESETZ("BetrVG", "betrvg", 60), GESETZ("BetrVG", "betrvg", 87), GESETZ("ArbZG", "arbzg", 3), GESETZ("ArbZG", "arbzg", 4), GESETZ("ArbZG", "arbzg", 5), GESETZ("BUrlG", "burlg", 3)],
      azubi:[GESETZ("BBiG", "bbig_2005", 13), GESETZ("BBiG", "bbig_2005", 14), GESETZ("BBiG", "bbig_2005", 17), GESETZ("BBiG", "bbig_2005", 19), GESETZ("BBiG", "bbig_2005", 20), GESETZ("BBiG", "bbig_2005", 21), GESETZ("BBiG", "bbig_2005", 22)],
      jugend:[GESETZ("JArbSchG", "jarbschg", 8), GESETZ("JArbSchG", "jarbschg", 11), GESETZ("JArbSchG", "jarbschg", 13), GESETZ("JArbSchG", "jarbschg", 19), GESETZ("ArbZG", "arbzg", 4), GESETZ("BUrlG", "burlg", 3)],
      sozial:[GESETZ("SGB IV", "sgb_4", 1), GESETZ("SGB VII", "sgb_7", 8), GESETZ("SGB VII", "sgb_7", 150)]
    },
    cards:[
      {u:"azubi", f:"Wo stehen die Azubi-Pflichten?", b:"§ 13 BBiG"},
      {u:"azubi", f:"Wo stehen die Pflichten des Ausbildungsbetriebs?", b:"§ 14 BBiG"},
      {u:"azubi", f:"Ausbildungsmittel: wer zahlt?", b:"Der Betrieb stellt sie kostenlos (§ 14 BBiG)"},
      {u:"azubi", f:"Abschlussprüfung nicht bestanden", b:"Auf Verlangen Verlängerung bis zur Wiederholung, höchstens 1 Jahr"},
      {u:"azubi", f:"Wann endet die Ausbildung bei früher bestandener Prüfung?", b:"Mit Bekanntgabe des Prüfungsergebnisses"},
      {u:"azubi", f:"Form der Kündigung in der Ausbildung", b:"Schriftlich, elektronisch ausgeschlossen, nach der Probezeit mit Gründen"},
      {u:"jugend", f:"Pausen unter 18", b:"30 Minuten bei mehr als 4,5 Stunden, 60 Minuten bei mehr als 6 Stunden"},
      {u:"jugend", f:"Ruhezeit unter 18", b:"12 Stunden"},
      {u:"jugend", f:"Mindesturlaub unter 18", b:"Unter 16: 30, unter 17: 27, unter 18: 25 Werktage"},
      {u:"jugend", f:"Arbeitszeit unter 18", b:"Höchstens 8 Stunden täglich, 40 Stunden wöchentlich"},
      {u:"recht", f:"Widerrufsfrist im Fernabsatz", b:"14 Tage (§ 355 BGB)"},
      {u:"recht", f:"Was regelt der Taschengeldparagraph?", b:"§ 110 BGB: wirksam, wenn mit überlassenen eigenen Mitteln bewirkt"},
      {u:"recht", f:"Rechte des Käufers bei Mängeln", b:"Nacherfüllung, Rücktritt oder Minderung, Schadensersatz"},
      {u:"arbeit", f:"Kündigungsfrist in der Probezeit", b:"2 Wochen (§ 622 Abs. 3 BGB)"},
      {u:"arbeit", f:"Ab wann gilt das Kündigungsschutzgesetz personell?", b:"Bei einem Arbeitsverhältnis von mehr als 6 Monaten"},
      {u:"kalkulation", f:"Umsatzsteuersätze", b:"19 % Regelsatz, 7 % ermäßigt"},
      {u:"unternehmen", f:"Wie viel Jahresüberschuss geht bei der UG in die Rücklage?", b:"Ein Viertel"}
    ],
    questions:[
      {u:"azubi", ap:"AP2", q:"Wer trägt die Kosten für das Werkzeug, das für die Ausbildung erforderlich ist?", o:["Der Ausbildungsbetrieb","Der Azubi","Die Berufsschule","Die IHK"], e:"§ 14 BBiG: Ausbildungsmittel sind kostenlos zur Verfügung zu stellen."},
      {u:"azubi", ap:"AP2", q:"Eine Auszubildende fällt durch die Abschlussprüfung. Was gilt auf ihr Verlangen?", o:["Verlängerung bis zur nächsten Wiederholungsprüfung, höchstens 1 Jahr","Das Verhältnis endet sofort ohne Anspruch","Verlängerung um beliebig viele Jahre","Automatische Übernahme als Fachkraft"], e:"So regelt es § 21 Abs. 3 BBiG."},
      {u:"azubi", ap:"AP2", q:"Ein Azubi kündigt nach der Probezeit, weil er die Ausbildung aufgibt. Welche Frist gilt?", o:["4 Wochen","Keine","2 Wochen","3 Monate"], e:"§ 22 Abs. 2 BBiG, die Kündigung muss schriftlich mit Gründen erfolgen."},
      {u:"azubi", ap:"AP2", q:"Der Betrieb will wegen eines Vorfalls fristlos kündigen, den er seit drei Wochen kennt. Was gilt?", o:["Die Kündigung ist unwirksam","Sie ist wirksam, da fristlos immer möglich ist","Sie ist nur mündlich wirksam","Die IHK muss zustimmen"], e:"§ 22 Abs. 4 BBiG: unwirksam, wenn die Tatsachen länger als zwei Wochen bekannt sind."},
      {u:"azubi", ap:"AP2", q:"Was müssen Auszubildende laut § 13 BBiG führen?", o:["Einen schriftlichen oder elektronischen Ausbildungsnachweis","Ein Kassenbuch","Ein Lastenheft","Eine Bilanz"], e:"Der Betrieb muss ihn regelmäßig durchsehen (§ 14 Abs. 2 BBiG)."},
      {u:"azubi", ap:"AP2", q:"Darf ein Azubi Mehrarbeit ohne Ausgleich leisten müssen?", o:["Nein, sie ist besonders zu vergüten oder durch Freizeit auszugleichen","Ja, Azubis haben keinen Anspruch","Ja, wenn der Betrieb klein ist","Nur Ausgleich mit Urlaub im Folgejahr"], e:"§ 17 Abs. 7 BBiG."},
      {u:"jugend", ap:"AP2", q:"Ein 17-jähriger Azubi arbeitet 7 Stunden. Wie lang muss die Pause mindestens sein?", o:["60 Minuten","30 Minuten","45 Minuten","15 Minuten"], e:"§ 11 JArbSchG: 60 Minuten bei mehr als 6 Stunden. Bei Erwachsenen wären es 30."},
      {u:"jugend", ap:"AP2", q:"Wie viel Freizeit steht Jugendlichen nach Arbeitsende mindestens zu?", o:["12 Stunden","11 Stunden","8 Stunden","10 Stunden"], e:"§ 13 JArbSchG. Bei Erwachsenen sind es 11 Stunden."},
      {u:"jugend", ap:"AP2", q:"Eine Auszubildende ist zu Beginn des Kalenderjahres 16 Jahre alt. Wie viel Urlaub hat sie mindestens?", o:["27 Werktage","30 Werktage","25 Werktage","24 Werktage"], e:"§ 19 JArbSchG: noch nicht 17 Jahre bedeutet 27 Werktage."},
      {u:"jugend", ap:"AP2", q:"Was zählt bei Jugendlichen als Ruhepause?", o:["Eine Unterbrechung von mindestens 15 Minuten","Jede Unterbrechung ab einer Minute","Nur eine volle Stunde","Der Weg zur Berufsschule"], e:"§ 11 JArbSchG."},
      {u:"recht", ap:"AP2", q:"Eine 15-Jährige kauft vom überlassenen Taschengeld eine Maus und zahlt sofort. Wie ist der Vertrag?", o:["Von Anfang an wirksam","Schwebend unwirksam","Immer nichtig","Erst mit 18 wirksam"], e:"§ 110 BGB: Sie bewirkt die Leistung mit überlassenen Mitteln."},
      {u:"recht", ap:"AP2", q:"Ein Kunde bestellt online einen Standard-Monitor. Wie lang ist die Widerrufsfrist?", o:["14 Tage","30 Tage","7 Tage","2 Jahre"], e:"§ 355 Abs. 2 BGB. Eine Begründung ist nicht nötig."},
      {u:"recht", ap:"AP2", q:"Ein Geschäftskunde zahlt nicht. Wann gerät er ohne Mahnung spätestens in Verzug?", o:["30 Tage nach Fälligkeit und Rechnungszugang","Sofort mit Rechnungsdatum","Nach 2 Jahren","Nie ohne Mahnung"], e:"§ 286 Abs. 3 BGB. Verbraucher müssen zusätzlich in der Rechnung darauf hingewiesen werden."},
      {u:"recht", ap:"AP2", q:"Wer trägt die Transportkosten bei einer Nacherfüllung?", o:["Der Verkäufer","Der Käufer","Beide je zur Hälfte","Der Hersteller immer"], e:"§ 439 Abs. 2 BGB."},
      {u:"recht", ap:"AP2", q:"Kannst du ein am Telefon gemachtes Angebot erst morgen annehmen, ohne dass etwas vereinbart ist?", o:["Nein, es kann nur sofort angenommen werden","Ja, eine Woche lang","Ja, immer","Nur schriftlich"], e:"§ 147 Abs. 1 BGB behandelt Telefonate wie Anwesende."},
      {u:"arbeit", ap:"AP2", q:"Ein Arbeitgeber kündigt nach 8 Jahren Betriebszugehörigkeit. Welche gesetzliche Frist gilt mindestens?", o:["3 Monate zum Monatsende","1 Monat zum Monatsende","4 Wochen zum 15.","7 Monate"], e:"§ 622 Abs. 2 BGB."},
      {u:"arbeit", ap:"AP2", q:"Was gehört zu den Kriterien der sozialen Auswahl nach § 1 KSchG?", o:["Betriebszugehörigkeit, Alter, Unterhaltspflichten, Schwerbehinderung","Haarfarbe und Hobby","Nur das Gehalt","Nur die Note im Zeugnis"], e:"§ 1 Abs. 3 KSchG."},
      {u:"arbeit", ap:"AP2", q:"Wobei hat der Betriebsrat nach § 87 BetrVG mitzubestimmen?", o:["Einführung technischer Überwachung","Höhe der Dividende","Wahl des Aufsichtsrats der Lieferanten","Inhalt der Abschlussprüfung"], e:"§ 87 Abs. 1 Nr. 6 BetrVG."},
      {u:"unternehmen", ap:"AP2", q:"Was gilt bei der Gründung einer UG (haftungsbeschränkt)?", o:["Sacheinlagen sind ausgeschlossen","Mindestens 25.000 € Stammkapital","Es braucht einen Aufsichtsrat","Die Gesellschafter haften privat"], e:"§ 5a Abs. 2 GmbHG. Das Stammkapital ist voll einzuzahlen."},
      {u:"kalkulation", ap:"AP1", q:"Wie hoch ist der allgemeine Umsatzsteuersatz?", o:["19 %","7 %","16 %","21 %"], e:"§ 12 Abs. 1 UStG."}
    ]
  }
];
