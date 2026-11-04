/* Register IT-Arbeitsplatz. Neue Karten und Fragen nur hinten anhängen: Die Position bestimmt die ID und damit den Lernstand. */
(window.LERN_MODULES = window.LERN_MODULES || []).push({
  id:"platz", title:"IT-Arbeitsplatz", sub:"Hardware, Beratung, Beschaffung, Übergabe", icon:"device", color:"#30d158", ap:"AP1",
  exam:"Einrichten eines IT-gestützten Arbeitsplatzes (AP1, 20 %)",
  drills:["units"],
  units:[
    {id:"hardware", title:"Hardware", sum:"CPU, RAM, Mainboard, Grafik und Schnittstellen.", sec:[
      {h:"Komponenten", table:{head:["Bauteil", "Wichtige Kennwerte"], rows:[["CPU", "Kerne, Threads, Takt, Cache"], ["RAM", "Kapazität, Takt, Typ wie DDR5"], ["Mainboard", "Sockel, Chipsatz, Steckplätze"], ["Massenspeicher", "HDD, SATA-SSD, NVMe-SSD"], ["Grafik", "integriert oder dediziert, VRAM"], ["Netzteil", "Leistung in Watt, Effizienz"]]}},
      {h:"Anschlüsse", list:["USB 3.2 Gen 1: 5 Gbit/s", "USB 3.2 Gen 2: 10 Gbit/s", "USB4 und Thunderbolt 4: bis 40 Gbit/s über USB-C", "HDMI und DisplayPort: Bild und Ton", "RJ45: Netzwerk"]},
      {p:"Für die Auswahl zählt der Einsatzzweck. Eine Sachbearbeitung braucht wenig Grafikleistung, CAD und Videoschnitt dagegen viel. Ergonomie gehört ebenfalls dazu: Bildschirmgröße, Anschlüsse, Lautstärke und Gewicht beim Notebook."},
      {tip:"Nicht nur nennen, sondern begründen: Welches Bauteil passt, weil der Kunde genau diese Anforderung hat?"}
    ]},
    {id:"einheiten", title:"Einheiten und Rechnen", sum:"Bit, Byte, Datenraten, Speicher und Übertragungsdauer.", sec:[
      {h:"Dezimal oder binär", table:{head:["Dezimal", "Wert", "Binär", "Wert"], rows:[["1 KB", "1.000 Byte", "1 KiB", "1.024 Byte"], ["1 MB", "1.000 KB", "1 MiB", "1.024 KiB"], ["1 GB", "1.000 MB", "1 GiB", "1.024 MiB"], ["1 TB", "1.000 GB", "1 TiB", "1.024 GiB"]]}},
      {h:"Übertragungsdauer", list:["Dauer = Datenmenge in Bit ÷ Datenrate in Bit/s", "1 Byte = 8 Bit", "Beispiel: 500 MB über 100 Mbit/s", "500 MB × 8 = 4.000 Mbit", "4.000 Mbit ÷ 100 Mbit/s = 40 Sekunden"]},
      {h:"Bildgröße unkomprimiert", list:["Größe = Breite × Höhe × Farbtiefe in Bit", "Beispiel: 1920 × 1080 × 24 Bit", "= 49.766.400 Bit ÷ 8 = 6.220.800 Byte, rund 6,2 MB"]},
      {h:"Stromkosten", list:["Kosten = Leistung in kW × Stunden × Preis pro kWh", "Beispiel: 200 W, 8 h, 220 Tage, 0,35 €/kWh", "0,2 kW × 1.760 h = 352 kWh", "352 kWh × 0,35 € = 123,20 €"]},
      {warn:"Provider nennen Mbit/s, Dateien haben MB. Der Faktor 8 ist die häufigste Fehlerquelle in Rechenaufgaben."}
    ]},
    {id:"beratung", title:"Kundenberatung und Bedarf", sum:"Bedarf ermitteln, Lasten- und Pflichtenheft, Kommunikation.", sec:[
      {p:"Bevor etwas beschafft wird, klärst du, was der Kunde wirklich braucht. Offene Fragen helfen beim Ermitteln, geschlossene beim Bestätigen. Fachbegriffe passt du an dein Gegenüber an."},
      {h:"Lastenheft oder Pflichtenheft", table:{head:["Dokument", "Erstellt von", "Inhalt"], rows:[["Lastenheft", "Auftraggeber", "WAS und WOFÜR soll erreicht werden?"], ["Pflichtenheft", "Auftragnehmer", "WIE und WOMIT wird es umgesetzt?"]]}},
      {h:"Kommunikation", list:["Vier-Seiten-Modell (Schulz von Thun): Sachinhalt, Selbstoffenbarung, Beziehung, Appell", "Aktives Zuhören: nachfragen, zusammenfassen", "Bei Beschwerden: ruhig bleiben, ernst nehmen, Lösung anbieten"]},
      {h:"Anforderungen", list:["Funktionale Anforderung: Was soll das System tun?", "Nicht-funktionale Anforderung: Wie gut, also Leistung, Sicherheit, Ergonomie"]},
      {tip:"Merkhilfe: LAstenheft kommt vom Auftraggeber, PFlichtenheft vom Lieferanten, der das Vorhaben pflichtgemäß umsetzt."}
    ]},
    {id:"beschaffung", title:"Beschaffung und Angebote", sum:"Angebotsvergleich, Nutzwertanalyse, TCO und Leasing.", sec:[
      {h:"Nutzwertanalyse", list:["Kriterien festlegen, etwa Leistung, Preis, Service", "Kriterien gewichten, zusammen 100 %", "Jedes Angebot pro Kriterium bewerten", "Punkte × Gewichtung rechnen und addieren", "Höchste Summe gewinnt"]},
      {h:"Beispiel", table:{head:["Kriterium", "Gewicht", "A (Punkte)", "B (Punkte)"], rows:[["Leistung", "50 %", "8", "6"], ["Preis", "30 %", "5", "9"], ["Service", "20 %", "7", "7"], ["Nutzwert", "", "6,9", "7,1"]]}},
      {h:"Kosten betrachten", list:["TCO (Total Cost of Ownership): Anschaffung und laufende Kosten über die ganze Nutzung", "Skonto: Preisnachlass bei schneller Zahlung", "Rabatt: Preisnachlass auf den Listenpreis", "Leasing: nutzen statt kaufen, laufende Raten statt hoher Anschaffung"]},
      {h:"Lizenzen", table:{head:["Modell", "Bedeutung"], rows:[["OEM", "an ein Gerät gebunden"], ["Volumenlizenz", "viele Plätze im Unternehmen"], ["Abo / SaaS", "laufende Gebühr"], ["Open Source", "Quelltext offen, Lizenzbedingungen trotzdem beachten"]]}},
      {warn:"Das billigste Gerät ist nicht automatisch das wirtschaftlichste. Berücksichtige auch Strom, Wartung und Lebensdauer."}
    ]},
    {id:"einrichtung", title:"Einrichten und Testen", sum:"Installation, Konfiguration, Tests und Qualitätssicherung.", sec:[
      {h:"Typischer Ablauf", list:["Hardware prüfen und anschließen", "BIOS/UEFI einstellen, Secure Boot aktivieren", "Betriebssystem installieren oder Image verteilen", "Treiber, Updates und Programme einspielen", "In Domäne aufnehmen, Benutzer und Rechte einrichten", "Daten übernehmen, sicher einstellen und testen"]},
      {h:"Sicherheit am Arbeitsplatz", list:["Festplatte verschlüsseln, etwa mit BitLocker", "Automatische Bildschirmsperre", "Keine Administratorrechte im Alltag", "Virenschutz und Firewall aktiv", "Automatische Updates"]},
      {h:"Tests", table:{head:["Testart", "Prüft"], rows:[["Funktionstest", "Tut das System, was es soll?"], ["Abnahmetest", "Erfüllt es die Anforderungen des Kunden?"], ["Lasttest", "Hält es bei hoher Nutzung?"], ["Regressionstest", "Funktioniert Altes nach Änderungen noch?"]]}},
      {tip:"BIOS oder UEFI: UEFI bringt Secure Boot und unterstützt GPT für Platten über 2 TB."}
    ]},
    {id:"uebergabe", title:"Übergabe und Support", sum:"Einweisung, Protokolle, Ticketsystem, ITIL und Vertragsarten.", sec:[
      {h:"Leistung abschließen", list:["Kunden in die Nutzung einweisen", "Abnahmeprotokoll: Leistung ist erbracht und abgenommen", "Arbeitszeit und Material dokumentieren", "Rechnung stellen"]},
      {h:"Support-Stufen", table:{head:["Level", "Aufgabe"], rows:[["1st Level", "Annahme, Standardlösungen"], ["2nd Level", "tiefere Analyse durch Spezialisten"], ["3rd Level", "Hersteller oder Entwickler"]]}},
      {h:"ITIL-Begriffe", list:["Incident: Störung, schnell wiederherstellen", "Problem: Ursache hinter wiederholten Störungen", "Change: geplante Änderung", "Service Request: Standardanfrage, etwa neues Passwort", "SLA: vereinbarte Leistung, etwa Reaktionszeit"]},
      {h:"Qualität", p:"Der PDCA-Zyklus verbessert Abläufe stetig: Plan, Do, Check, Act. Die Normenreihe ISO 9000 ff. beschreibt Qualitätsmanagement, ISO/IEC 27001 das Informationssicherheits-Management."},
      {warn:"Ein Incident behebt die Auswirkung, ein Problem die Ursache. Das wird in Aufgaben gerne verwechselt."}
    ]}
  ],
  cards:[
    {u:"hardware", f:"Datenrate von USB 3.2 Gen 2", b:"10 Gbit/s"},
    {u:"hardware", f:"Datenrate von Thunderbolt 4", b:"Bis 40 Gbit/s"},
    {u:"hardware", f:"Wichtige CPU-Kennwerte", b:"Kerne, Threads, Takt, Cache"},
    {u:"hardware", f:"SATA-SSD vs. NVMe-SSD", b:"SATA: bis etwa 550 MB/s.<br>NVMe: über PCIe, ein Vielfaches schneller."},
    {u:"hardware", f:"Wozu dient VRAM?", b:"Speicher der Grafikkarte, wichtig für CAD und Video"},
    {u:"einheiten", f:"1 KiB entspricht ...", b:"1.024 Byte"},
    {u:"einheiten", f:"1 KB entspricht ...", b:"1.000 Byte"},
    {u:"einheiten", f:"1 Byte entspricht ...", b:"8 Bit"},
    {u:"einheiten", f:"Formel: Übertragungsdauer", b:"Datenmenge in Bit ÷ Datenrate in Bit/s"},
    {u:"einheiten", f:"Formel: Bildgröße unkomprimiert", b:"Breite × Höhe × Farbtiefe in Bit, dann ÷ 8 für Byte"},
    {u:"einheiten", f:"Formel: Stromkosten", b:"kW × Stunden × Preis pro kWh"},
    {u:"einheiten", f:"Wie viele Farben hat 24 Bit Farbtiefe?", b:"2 hoch 24, rund 16,7 Millionen"},
    {u:"beratung", f:"Lastenheft", b:"Vom Auftraggeber: WAS und WOFÜR"},
    {u:"beratung", f:"Pflichtenheft", b:"Vom Auftragnehmer: WIE und WOMIT"},
    {u:"beratung", f:"Vier Seiten einer Nachricht", b:"Sachinhalt, Selbstoffenbarung, Beziehung, Appell"},
    {u:"beratung", f:"Funktionale vs. nicht-funktionale Anforderung", b:"Funktional: was das System tut.<br>Nicht-funktional: wie gut es das tut."},
    {u:"beschaffung", f:"Was ist eine Nutzwertanalyse?", b:"Gewichteter Vergleich von Angeboten anhand mehrerer Kriterien"},
    {u:"beschaffung", f:"Wofür steht TCO?", b:"Total Cost of Ownership: alle Kosten über die gesamte Nutzung"},
    {u:"beschaffung", f:"Skonto vs. Rabatt", b:"Skonto: für schnelle Zahlung.<br>Rabatt: Nachlass auf den Listenpreis."},
    {u:"beschaffung", f:"OEM-Lizenz", b:"An ein bestimmtes Gerät gebunden"},
    {u:"einrichtung", f:"Vorteile von UEFI", b:"Secure Boot, GPT-Unterstützung, Platten über 2 TB"},
    {u:"einrichtung", f:"Was macht BitLocker?", b:"Verschlüsselt Windows-Laufwerke"},
    {u:"einrichtung", f:"Was prüft ein Regressionstest?", b:"Ob nach Änderungen das Alte noch funktioniert"},
    {u:"einrichtung", f:"Was prüft ein Abnahmetest?", b:"Ob das System die Anforderungen des Kunden erfüllt"},
    {u:"uebergabe", f:"Incident vs. Problem", b:"Incident: Störung schnell beheben.<br>Problem: die Ursache finden."},
    {u:"uebergabe", f:"Was ist ein SLA?", b:"Service Level Agreement: vereinbarte Leistung, etwa Reaktionszeit"},
    {u:"uebergabe", f:"Was bestätigt ein Abnahmeprotokoll?", b:"Die Leistung wurde erbracht und vom Kunden abgenommen"},
    {u:"uebergabe", f:"PDCA-Zyklus", b:"Plan, Do, Check, Act"},
    {u:"uebergabe", f:"Support-Stufen", b:"1st Level: Annahme und Standard.<br>2nd Level: Spezialisten.<br>3rd Level: Hersteller."},
    {u:"uebergabe", f:"Welche Norm regelt das ISMS?", b:"ISO/IEC 27001"}
  ],
  questions:[
    {u:"hardware", ap:"AP1", q:"Ein Mitarbeiter arbeitet mit aufwendigem Videoschnitt. Welche Komponente ist besonders wichtig?", o:["Dedizierte Grafikkarte mit viel VRAM","Zusätzliches optisches Laufwerk","Möglichst viele USB-2.0-Anschlüsse","Ein größeres Gehäuse"], e:"Videoschnitt profitiert stark von der GPU und ihrem Speicher."},
    {u:"hardware", ap:"AP1", q:"Welcher Anschluss schafft bis zu 40 Gbit/s?", o:["Thunderbolt 4","USB 2.0","USB 3.2 Gen 1","RJ45 mit 1 GbE"], e:"Thunderbolt 4 und USB4 erreichen bis zu 40 Gbit/s."},
    {u:"hardware", ap:"AP1", q:"Welcher Speichertyp bietet die höchste Geschwindigkeit?", o:["NVMe-SSD","SATA-SSD","HDD mit 7.200 U/min","USB-Stick 2.0"], e:"NVMe läuft direkt über PCIe."},
    {u:"hardware", ap:"AP1", q:"Was muss zum Mainboard passen, wenn du eine neue CPU auswählst?", o:["Der Sockel","Die Monitorgröße","Der Drucker","Das WLAN-Passwort"], e:"CPU und Mainboard müssen im Sockel und Chipsatz zusammenpassen."},
    {u:"einheiten", ap:"AP1", q:"Wie lange dauert die Übertragung von 500 MB bei 100 Mbit/s?", o:["40 Sekunden","5 Sekunden","50 Sekunden","400 Sekunden"], e:"500 MB × 8 = 4.000 Mbit. 4.000 ÷ 100 = 40 Sekunden."},
    {u:"einheiten", ap:"AP1", q:"Wie groß ist ein unkomprimiertes Bild mit 1000 × 1000 Pixeln und 24 Bit Farbtiefe?", o:["3 MB","24 MB","1 MB","8 MB"], e:"1.000.000 Pixel × 3 Byte = 3.000.000 Byte, also 3 MB."},
    {u:"einheiten", ap:"AP1", q:"Wie viele Byte sind 1 KiB?", o:["1.024","1.000","8","512"], e:"Binärpräfixe rechnen mit 2 hoch 10."},
    {u:"einheiten", ap:"AP1", q:"Warum zeigt eine 1-TB-Festplatte unter Windows rund 931 GB an?", o:["Windows rechnet binär, der Hersteller dezimal","Das Betriebssystem belegt 69 GB","Die Platte ist defekt","Windows komprimiert automatisch"], e:"1.000.000.000.000 Byte sind rund 931 GiB."},
    {u:"einheiten", ap:"AP1", q:"Ein PC mit 200 W läuft 1.000 Stunden im Jahr, 1 kWh kostet 0,30 €. Was kostet das?", o:["60 €","600 €","6 €","200 €"], e:"0,2 kW × 1.000 h = 200 kWh. 200 × 0,30 € = 60 €."},
    {u:"einheiten", ap:"AP1", q:"Wie viele Farben lassen sich mit 8 Bit darstellen?", o:["256","8","16","1.024"], e:"2 hoch 8 ergibt 256 Werte."},
    {u:"beratung", ap:"AP1", q:"Wer erstellt das Lastenheft?", o:["Der Auftraggeber","Der Auftragnehmer","Die IHK","Der Hersteller"], e:"Der Auftraggeber beschreibt, was er wofür braucht."},
    {u:"beratung", ap:"AP1", q:"Was beschreibt das Pflichtenheft?", o:["Wie und womit die Anforderungen umgesetzt werden","Nur das Budget des Kunden","Die Ausbildungsinhalte","Die Betriebsordnung"], e:"Es enthält die Umsetzung aus Sicht des Auftragnehmers."},
    {u:"beratung", ap:"AP1", q:"Welche Anforderung ist nicht-funktional?", o:["Die Suche antwortet in unter einer Sekunde","Das System erstellt Rechnungen","Nutzer können sich anmelden","Kunden können Tickets anlegen"], e:"Nicht-funktional beschreibt, wie gut etwas funktioniert, hier die Leistung."},
    {u:"beratung", ap:"AP1", q:"Welche Frage hilft am besten, den Bedarf zu ermitteln?", o:["Wofür nutzen Sie den Rechner im Alltag?","Soll es dieses Modell sein?","Reicht Ihnen das?","Haben Sie schon bestellt?"], e:"Offene Fragen liefern Informationen, geschlossene nur Ja oder Nein."},
    {u:"beratung", ap:"AP1", q:"\"Der Drucker geht schon wieder nicht!\" Welche Seite der Nachricht ist der Appell?", o:["Kümmere dich bitte darum","Der Drucker ist defekt","Ich bin genervt","Du bist für ihn zuständig"], e:"Der Appell ist, wozu der Sender den Empfänger bewegen will."},
    {u:"beschaffung", ap:"AP1", q:"Mit welcher Methode vergleichst du Angebote anhand gewichteter Kriterien?", o:["Nutzwertanalyse","Netzplantechnik","Kundenbefragung","RAID-Berechnung"], e:"Bewertung mal Gewichtung, dann addieren: Die höchste Summe gewinnt."},
    {u:"beschaffung", ap:"AP1", q:"Leistung (Gewicht 60 %) hat 5 Punkte, Preis (Gewicht 40 %) hat 10 Punkte. Wie hoch ist der Nutzwert?", o:["7","7,5","15","6"], e:"5 × 0,6 + 10 × 0,4 = 3 + 4 = 7."},
    {u:"beschaffung", ap:"AP1", q:"Was umfasst die Betrachtung der Total Cost of Ownership?", o:["Anschaffung und alle laufenden Kosten","Nur den Kaufpreis","Nur den Strom","Nur die Lizenzen"], e:"Auch Strom, Wartung, Support und Entsorgung zählen."},
    {u:"beschaffung", ap:"AP1", q:"Listenpreis 1.000 €, 10 % Rabatt, 2 % Skonto. Was zahlst du?", o:["882 €","880 €","900 €","980 €"], e:"1.000 € minus 10 % sind 900 €. Davon 2 % Skonto ergeben 18 €, es bleiben 882 €."},
    {u:"beschaffung", ap:"AP1", q:"Welche Lizenz ist an ein bestimmtes Gerät gebunden?", o:["OEM","Open Source","Volumenlizenz","Freeware"], e:"OEM-Software wird mit dem Gerät verkauft und bleibt dort."},
    {u:"einrichtung", ap:"AP1", q:"Was schützt ein verlorenes Notebook am wirksamsten vor Datenzugriff?", o:["Festplattenverschlüsselung","Ein langes Windows-Passwort allein","Eine Hülle","Ein aktueller Browser"], e:"Ohne Verschlüsselung lässt sich die Platte in einem anderen Rechner auslesen."},
    {u:"einrichtung", ap:"AP1", q:"Warum sollten Mitarbeiter im Alltag keine Administratorrechte haben?", o:["Schadsoftware bekommt sonst volle Rechte","Der PC startet sonst nicht","Es spart Lizenzkosten","Das Netz wird schneller"], e:"Das entspricht dem Prinzip der geringsten Rechte."},
    {u:"einrichtung", ap:"AP1", q:"Welcher Test prüft, ob ein System die Anforderungen des Kunden erfüllt?", o:["Abnahmetest","Lasttest","Hardwaretest","Unit-Test"], e:"Er findet zusammen mit dem Kunden statt."},
    {u:"einrichtung", ap:"AP1", q:"Welche Partitionstabelle wird für Systemplatten über 2 TB gebraucht?", o:["GPT","MBR","FAT32","NTFS"], e:"MBR ist auf 2 TB begrenzt. NTFS und FAT32 sind Dateisysteme."},
    {u:"einrichtung", ap:"AP1", q:"Wozu dient Secure Boot?", o:["Es lässt nur signierte Bootloader starten","Es verschlüsselt alle Dokumente","Es sichert Daten in die Cloud","Es beschleunigt den Start"], e:"So startet keine manipulierte Software vor dem Betriebssystem."},
    {u:"uebergabe", ap:"AP1", q:"Welches Dokument bestätigt, dass der Kunde die Leistung angenommen hat?", o:["Abnahmeprotokoll","Lastenheft","Angebot","Anfrage"], e:"Mit der Abnahme gilt die Leistung als erbracht."},
    {u:"uebergabe", ap:"AP1", q:"Der Drucker fällt aus, und der Service sorgt schnell für Ersatz. Wie heißt das nach ITIL?", o:["Incident","Problem","Change","Release"], e:"Ein Incident ist eine Störung. Ziel ist die schnelle Wiederherstellung."},
    {u:"uebergabe", ap:"AP1", q:"Derselbe Fehler taucht immer wieder auf, nun wird die Ursache gesucht. Was ist das?", o:["Problem Management","Incident Management","Change Management","Asset Management"], e:"Problem Management findet die Ursache hinter wiederholten Störungen."},
    {u:"uebergabe", ap:"AP1", q:"Wo legt ein Vertrag eine garantierte Reaktionszeit im Support fest?", o:["Im SLA","Im Lastenheft","Im Lieferschein","In der DSGVO"], e:"Das Service Level Agreement regelt die vereinbarte Leistung."},
    {u:"uebergabe", ap:"AP1", q:"Wer nimmt Störungsmeldungen an und löst Standardfälle?", o:["1st Level Support","3rd Level Support","Die Geschäftsführung","Der Hersteller"], e:"Was er nicht lösen kann, gibt er an den 2nd Level weiter."},
    {u:"uebergabe", ap:"AP1", q:"Was steht im PDCA-Zyklus nach Plan und Do?", o:["Check, dann Act","Act, dann Check","Report, dann Close","Review, dann Delete"], e:"Plan, Do, Check, Act: planen, umsetzen, prüfen, verbessern."}
  ]
});
