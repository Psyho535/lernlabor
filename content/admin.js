/* Register Server und Administration. Neue Karten und Fragen nur hinten anhängen: Die Position bestimmt die ID und damit den Lernstand. */
(window.LERN_MODULES = window.LERN_MODULES || []).push({
  id:"admin", title:"Server & Administration", sub:"Linux, Windows, Speicher, Virtualisierung, Skripte", icon:"server", color:"#5e5ce6", ap:"AP2",
  exam:"Konzeption und Administration von IT-Systemen (AP2, 10 %)",
  drills:["raid"],
  units:[
    {id:"linux", title:"Linux-Administration", sum:"Befehle, Rechte, Dienste und Pakete.", sec:[
      {h:"Wichtige Befehle", table:{head:["Befehl", "Zweck"], rows:[["ls -l", "Dateien mit Rechten anzeigen"], ["cd, pwd", "Verzeichnis wechseln, anzeigen"], ["cp, mv, rm", "Kopieren, verschieben, löschen"], ["grep", "Text in Dateien suchen"], ["ps, top", "Prozesse anzeigen"], ["df -h, du -sh", "Plattenplatz prüfen"], ["systemctl status ssh", "Dienst prüfen"], ["journalctl -u ssh", "Protokoll eines Dienstes lesen"], ["apt install", "Paket installieren (Debian, Ubuntu)"], ["sudo", "Befehl mit Admin-Rechten ausführen"]]}},
      {h:"Dateirechte", p:"ls -l zeigt zum Beispiel -rwxr-x---. Die drei Gruppen stehen für Besitzer, Gruppe und alle anderen. Oktal zählt r als 4, w als 2 und x als 1. Also bedeutet chmod 750: Besitzer alles (7), Gruppe lesen und ausführen (5), andere nichts (0)."},
      {h:"Wichtige Verzeichnisse", list:["/etc: Konfigurationsdateien", "/var/log: Protokolle", "/home: Benutzerverzeichnisse", "/root: Verzeichnis des Administrators", "/usr/bin: Programme"]},
      {tip:"Rechte schnell berechnen: 6 ist rw-, 5 ist r-x, 4 ist r--, 7 ist rwx."}
    ]},
    {id:"windows", title:"Windows Server und AD", sum:"Active Directory, Gruppenrichtlinien, Freigaben und Rechte.", sec:[
      {p:"Active Directory (AD) verwaltet Benutzer, Computer und Gruppen zentral in einer Domäne. Der Domänencontroller speichert die Datenbank und prüft Anmeldungen, Kerberos ist das Standardverfahren. AD braucht DNS, sonst finden Clients den Domänencontroller nicht."},
      {h:"Begriffe", list:["Domäne: Verwaltungseinheit mit gemeinsamer Datenbank", "Organisationseinheit (OU): Container zum Strukturieren und für Richtlinien", "Gruppenrichtlinie (GPO): verteilt Einstellungen zentral", "Reihenfolge der GPO: lokal, Standort, Domäne, OU (LSDOU). Die zuletzt angewandte gewinnt", "AGDLP: Konten in globale Gruppen, diese in domänenlokale Gruppen, diese bekommen die Rechte"]},
      {h:"Freigabe- und NTFS-Rechte", p:"Beim Zugriff übers Netz gelten beide. Wirksam ist immer das restriktivere Ergebnis. Lokal am Server greifen nur die NTFS-Rechte. Innerhalb von NTFS gewinnt ein explizites Verweigern gegenüber dem Erlauben."},
      {h:"Häufige Windows-Befehle", table:{head:["Befehl", "Zweck"], rows:[["gpupdate /force", "Richtlinien sofort anwenden"], ["gpresult /r", "Angewandte Richtlinien anzeigen"], ["whoami /groups", "Eigene Gruppen zeigen"], ["Get-Service", "Dienste in PowerShell auflisten"], ["Get-ADUser", "AD-Benutzer abfragen"]]}}
    ]},
    {id:"raid", title:"RAID", sum:"Level, Kapazität und Ausfallsicherheit berechnen.", sec:[
      {h:"RAID-Level", table:{head:["Level", "Mindestens", "Nutzbar", "Fällt aus ohne Datenverlust"], rows:[["RAID 0", "2", "n × Größe", "keine Platte"], ["RAID 1", "2", "eine Platte", "alle bis auf eine"], ["RAID 5", "3", "(n - 1) × Größe", "1 Platte"], ["RAID 6", "4", "(n - 2) × Größe", "2 Platten"], ["RAID 10", "4", "n ÷ 2 × Größe", "1 je Spiegelpaar"]]}},
      {h:"Beispiel", list:["RAID 5 aus 4 Platten mit je 2 TB", "Nutzbar: (4 - 1) × 2 TB = 6 TB", "RAID 10 aus denselben Platten: 4 ÷ 2 × 2 TB = 4 TB"]},
      {p:"RAID 0 verteilt Daten für mehr Tempo, bietet aber keine Sicherheit. RAID 5 verteilt Parität über alle Platten. RAID 10 kombiniert Spiegeln und Verteilen und eignet sich für schreibintensive Datenbanken. Ein Hot Spare springt automatisch ein, wenn eine Platte ausfällt."},
      {warn:"RAID erhöht die Verfügbarkeit, ersetzt aber kein Backup."}
    ]},
    {id:"speicher", title:"Speicherlösungen", sum:"DAS, NAS, SAN, Protokolle und Cloud-Speicher.", sec:[
      {h:"Vergleich", table:{head:["Lösung", "Zugriff", "Protokolle", "Typischer Einsatz"], rows:[["DAS", "direkt am Server", "SATA, SAS", "ein einzelner Server"], ["NAS", "dateibasiert übers LAN", "SMB, NFS", "Dateiablage im Team"], ["SAN", "blockbasiert, eigenes Netz", "iSCSI, Fibre Channel", "Datenbanken, Virtualisierung"]]}},
      {h:"Laufwerke", list:["HDD: viel Kapazität, günstig, mechanisch", "SATA-SSD: schnell, bis etwa 550 MB/s", "NVMe-SSD: über PCIe, ein Vielfaches schneller"]},
      {h:"Dateisysteme", table:{head:["System", "Einsatz"], rows:[["NTFS", "Windows, mit Rechten und Journaling"], ["ReFS", "Windows Server, für große Volumes"], ["FAT32", "Austausch, Dateien nur bis 4 GB"], ["exFAT", "USB-Sticks, ohne 4-GB-Grenze"], ["ext4 / XFS", "Linux"]]}},
      {tip:"Merkhilfe: NAS liefert Dateien, SAN liefert Blöcke. Beim SAN sieht der Server eine Platte, die er selbst formatiert."}
    ]},
    {id:"virtual", title:"Virtualisierung und Container", sum:"Hypervisor-Typen, Container und Cloud-Modelle.", sec:[
      {h:"Hypervisor", table:{head:["Typ", "Läuft auf", "Beispiele", "Einsatz"], rows:[["Typ 1 (Bare Metal)", "direkt auf der Hardware", "VMware ESXi, Hyper-V, Proxmox", "Rechenzentrum"], ["Typ 2 (Hosted)", "auf einem Betriebssystem", "VirtualBox, VMware Workstation", "Test, Arbeitsplatz"]]}},
      {h:"VM oder Container?", table:{head:["", "Virtuelle Maschine", "Container"], rows:[["Bringt mit", "eigenes Betriebssystem", "nur Anwendung und Bibliotheken"], ["Start", "Minuten", "Sekunden"], ["Isolation", "sehr stark", "teilt den Host-Kernel"], ["Beispiel", "Hyper-V-VM", "Docker"]]}},
      {h:"Vorteile der Virtualisierung", list:["Bessere Hardware-Auslastung, weniger Strom und Platz", "Snapshots vor riskanten Änderungen", "Live-Migration zwischen Hosts", "Schnelle Bereitstellung aus Vorlagen"]},
      {h:"Cloud-Modelle", table:{head:["Modell", "Der Anbieter stellt", "Beispiel"], rows:[["IaaS", "Server, Netz, Speicher", "virtuelle Server"], ["PaaS", "zusätzlich die Laufzeitumgebung", "Hosting für Anwendungen"], ["SaaS", "die fertige Anwendung", "Microsoft 365"]]}},
      {warn:"Ein Snapshot ist kein Backup: Er hängt von der Originalplatte ab und bremst bei langer Laufzeit."}
    ]},
    {id:"skripte", title:"Automatisierung mit Skripten", sum:"Bash und PowerShell lesen und schreiben.", sec:[
      {p:"Die Prüfung verlangt Programme für die automatisierte Systemadministration. Wichtig sind Variablen, Bedingungen und Schleifen. Du solltest ein kurzes Skript lesen können und wissen, was es tut."},
      {h:"Bash: alte Logs löschen", code:"#!/bin/bash\nziel=\"/var/log/app\"\nif [ -d \"$ziel\" ]; then\n  find \"$ziel\" -name \"*.log\" -mtime +30 -delete\n  echo \"Alte Logs entfernt\"\nfi"},
      {h:"PowerShell: gestoppte Dienste", code:"Get-Service |\n  Where-Object { $_.Status -eq 'Stopped' } |\n  Select-Object Name, DisplayName"},
      {h:"Zeitgesteuert ausführen", list:["Linux: cron, zum Beispiel 0 2 * * * /opt/backup.sh jeden Tag um 2 Uhr", "Reihenfolge bei cron: Minute, Stunde, Tag, Monat, Wochentag", "Windows: Aufgabenplanung"]},
      {h:"Häufige Bausteine", table:{head:["Zweck", "Bash", "PowerShell"], rows:[["Variable", "name=\"Wert\"", "$name = \"Wert\""], ["Ausgabe", "echo", "Write-Output"], ["Schleife", "for f in *.log; do ... done", "foreach ($f in $liste) { ... }"], ["Vergleich", "[ \"$a\" = \"$b\" ]", "$a -eq $b"]]}},
      {tip:"Vor dem Automatisieren: Erst von Hand testen, Pfade prüfen und nichts blind löschen."}
    ]},
    {id:"betrieb", title:"Serverbetrieb", sum:"Monitoring, USV, Hochverfügbarkeit und Patches.", sec:[
      {h:"Hochverfügbarkeit", list:["Cluster: Ein zweiter Server übernimmt bei Ausfall (Failover)", "Load Balancer: verteilt Anfragen auf mehrere Server", "Redundante Netzteile und Netzwerkanschlüsse", "USV: überbrückt Stromausfälle und fährt Server sauber herunter"]},
      {h:"USV-Typen", table:{head:["Typ", "Bezeichnung", "Schutz"], rows:[["VFD", "Offline", "Grundschutz bei Ausfall"], ["VI", "Line-Interactive", "gleicht zusätzlich Spannungsschwankungen aus"], ["VFI", "Online", "höchster Schutz, permanente Doppelwandlung"]]}},
      {h:"Laufender Betrieb", list:["Patch-Management: Updates erst testen, dann ausrollen", "Protokolle zentral sammeln", "Dokumentation aktuell halten", "Lizenzen und Laufzeiten im Blick behalten", "Rollback-Plan für jede größere Änderung"]},
      {tip:"Prüfungsformel für die Leistung: Scheinleistung in VA = Wirkleistung in Watt geteilt durch den Leistungsfaktor."}
    ]}
  ],
  cards:[
    {u:"linux", f:"Was bedeutet chmod 750?", b:"Besitzer rwx, Gruppe r-x, andere keine Rechte"},
    {u:"linux", f:"Wofür steht 644?", b:"Besitzer rw-, Gruppe r--, andere r--"},
    {u:"linux", f:"Wo liegen Linux-Konfigurationsdateien?", b:"/etc"},
    {u:"linux", f:"Wo liegen Linux-Logs?", b:"/var/log"},
    {u:"linux", f:"Dienststatus prüfen", b:"systemctl status dienstname"},
    {u:"linux", f:"Plattenplatz prüfen", b:"df -h"},
    {u:"windows", f:"Was ist Active Directory?", b:"Zentraler Verzeichnisdienst für Benutzer, Computer und Gruppen"},
    {u:"windows", f:"Was ist eine GPO?", b:"Gruppenrichtlinie, verteilt Einstellungen zentral"},
    {u:"windows", f:"Reihenfolge bei Gruppenrichtlinien", b:"LSDOU: lokal, Standort, Domäne, OU"},
    {u:"windows", f:"Was bedeutet AGDLP?", b:"Account, Global, Domain Local, Permission"},
    {u:"windows", f:"Freigabe- und NTFS-Rechte zusammen", b:"Das restriktivere Recht wirkt"},
    {u:"windows", f:"Anmeldeprotokoll im AD", b:"Kerberos"},
    {u:"raid", f:"RAID 1: Prinzip und Minimum", b:"Spiegelung, mindestens 2 Platten"},
    {u:"raid", f:"RAID 5: Kapazität", b:"(n - 1) × Plattengröße, mindestens 3 Platten"},
    {u:"raid", f:"RAID 6: Kapazität", b:"(n - 2) × Plattengröße, mindestens 4 Platten"},
    {u:"raid", f:"RAID 10: Kapazität", b:"n ÷ 2 × Plattengröße, mindestens 4 Platten"},
    {u:"raid", f:"RAID 0: Ausfallsicherheit", b:"Keine: Fällt eine Platte aus, sind alle Daten weg"},
    {u:"raid", f:"Was ist ein Hot Spare?", b:"Ersatzplatte, die bei einem Ausfall automatisch einspringt"},
    {u:"speicher", f:"NAS vs. SAN", b:"NAS: dateibasiert (SMB, NFS).<br>SAN: blockbasiert (iSCSI, Fibre Channel)."},
    {u:"speicher", f:"Dateigrößengrenze bei FAT32", b:"4 GB"},
    {u:"speicher", f:"Welches Protokoll nutzt iSCSI?", b:"SCSI-Befehle über TCP/IP, also blockbasiert übers Netz"},
    {u:"speicher", f:"Worüber läuft NVMe?", b:"Über PCIe, deutlich schneller als SATA"},
    {u:"virtual", f:"Hypervisor Typ 1", b:"Läuft direkt auf der Hardware, etwa ESXi, Hyper-V"},
    {u:"virtual", f:"Hypervisor Typ 2", b:"Läuft auf einem Betriebssystem, etwa VirtualBox"},
    {u:"virtual", f:"Container vs. VM", b:"Container teilen den Host-Kernel und starten schnell.<br>VMs bringen ein eigenes Betriebssystem mit."},
    {u:"virtual", f:"IaaS, PaaS, SaaS", b:"Infrastruktur, Plattform, fertige Software"},
    {u:"skripte", f:"Reihenfolge der cron-Felder", b:"Minute, Stunde, Tag, Monat, Wochentag"},
    {u:"skripte", f:"Was bedeutet 0 2 * * * in cron?", b:"Jeden Tag um 2:00 Uhr"},
    {u:"skripte", f:"Wozu dient #!/bin/bash?", b:"Das Shebang legt den Interpreter des Skripts fest"},
    {u:"skripte", f:"PowerShell: gleich vergleichen", b:"-eq"},
    {u:"betrieb", f:"USV-Klasse mit höchstem Schutz", b:"VFI (Online), permanente Doppelwandlung"},
    {u:"betrieb", f:"Was macht ein Load Balancer?", b:"Verteilt Anfragen auf mehrere Server"},
    {u:"betrieb", f:"Was ist Failover?", b:"Ein zweites System übernimmt beim Ausfall automatisch"}
  ],
  questions:[
    {u:"linux", ap:"AP2", q:"Welche Rechte vergibt chmod 640 datei.txt?", o:["Besitzer rw-, Gruppe r--, andere ---","Besitzer rwx, Gruppe r--, andere ---","Besitzer rw-, Gruppe rw-, andere ---","Besitzer r--, Gruppe rw-, andere ---"], e:"6 ist rw-, 4 ist r--, 0 ist ---."},
    {u:"linux", ap:"AP2", q:"Welcher Befehl zeigt den Status des Dienstes nginx?", o:["systemctl status nginx","ls nginx","chmod nginx","apt status nginx"], e:"systemctl steuert Dienste unter systemd."},
    {u:"linux", ap:"AP2", q:"In welchem Verzeichnis suchst du Linux-Protokolle?", o:["/var/log","/etc","/home","/bin"], e:"/var/log enthält die Logdateien, /etc die Konfiguration."},
    {u:"linux", ap:"AP2", q:"Welcher Befehl findet das Wort error in einer Logdatei?", o:["grep error app.log","cp error app.log","find app.log error","chmod error app.log"], e:"grep sucht Text in Dateien."},
    {u:"linux", ap:"AP2", q:"Der Server meldet, dass kein Speicher mehr frei ist. Welcher Befehl zeigt die Belegung der Dateisysteme?", o:["df -h","ps aux","pwd","ip addr"], e:"df zeigt den belegten und freien Platz, -h macht die Werte lesbar."},
    {u:"windows", ap:"AP2", q:"Clients finden den Domänencontroller nicht. Welcher Dienst ist die erste Prüfstelle?", o:["DNS","DHCP","SMTP","NTP"], e:"Clients finden den Domänencontroller über DNS-Einträge."},
    {u:"windows", ap:"AP2", q:"Freigabe gewährt Vollzugriff, NTFS nur Lesen. Was darf ein Nutzer über das Netz?", o:["Nur lesen","Vollzugriff","Gar nichts","Nur schreiben"], e:"Über das Netz wirkt das restriktivere der beiden Rechte."},
    {u:"windows", ap:"AP2", q:"Mit welchem Befehl wendest du Gruppenrichtlinien sofort an?", o:["gpupdate /force","ipconfig /renew","chkdsk /f","net start"], e:"gpupdate /force lädt alle Richtlinien sofort neu."},
    {u:"windows", ap:"AP2", q:"Welche Richtlinie setzt sich bei einem Konflikt durch?", o:["Die auf der OU","Die lokale","Die vom Standort","Die erste geladene"], e:"LSDOU: Die zuletzt angewandte gewinnt, und das ist in der Regel die OU."},
    {u:"windows", ap:"AP2", q:"Wozu dienen Organisationseinheiten im AD?", o:["Objekte strukturieren und Richtlinien zuweisen","IP-Adressen vergeben","Festplatten spiegeln","Pakete routen"], e:"OUs sind Container, an die sich auch GPOs binden lassen."},
    {u:"raid", ap:"AP2", q:"Wie viel Speicher ist bei RAID 5 aus 4 Platten mit je 4 TB nutzbar?", o:["12 TB","16 TB","8 TB","4 TB"], e:"(4 - 1) × 4 TB = 12 TB. Eine Platte geht für Parität drauf."},
    {u:"raid", ap:"AP2", q:"Wie viel Speicher ist bei RAID 10 aus 6 Platten mit je 2 TB nutzbar?", o:["6 TB","12 TB","10 TB","8 TB"], e:"6 ÷ 2 × 2 TB = 6 TB, denn die Hälfte ist Spiegel."},
    {u:"raid", ap:"AP2", q:"Wie viele Platten dürfen bei RAID 6 gleichzeitig ausfallen?", o:["2","1","3","Keine"], e:"RAID 6 hat doppelte Parität."},
    {u:"raid", ap:"AP2", q:"Welches RAID bietet keine Ausfallsicherheit?", o:["RAID 0","RAID 1","RAID 5","RAID 10"], e:"RAID 0 verteilt nur für mehr Tempo. Eine defekte Platte zerstört alle Daten."},
    {u:"raid", ap:"AP2", q:"Wie viele Platten braucht RAID 5 mindestens?", o:["3","2","4","5"], e:"Mindestens zwei für Daten und eine Kapazität für Parität."},
    {u:"speicher", ap:"AP2", q:"Ein Team braucht einfach eine zentrale Dateiablage per SMB. Was passt?", o:["NAS","SAN","DAS an jedem PC","RAM-Disk"], e:"Ein NAS stellt Dateien im LAN bereit."},
    {u:"speicher", ap:"AP2", q:"Was stellt ein SAN dem Server bereit?", o:["Blockspeicher","Fertige Dateifreigaben","Nur Bandlaufwerke","DNS-Einträge"], e:"Der Server sieht ein Laufwerk und formatiert es selbst."},
    {u:"speicher", ap:"AP2", q:"Welches Protokoll gehört zum SAN?", o:["iSCSI","SMB","NFS","SMTP"], e:"SMB und NFS arbeiten dateibasiert, iSCSI blockbasiert."},
    {u:"speicher", ap:"AP1", q:"Eine 6-GB-Datei lässt sich nicht auf einen USB-Stick kopieren. Welches Dateisystem ist vermutlich schuld?", o:["FAT32","exFAT","NTFS","ext4"], e:"FAT32 erlaubt Dateien nur bis 4 GB."},
    {u:"virtual", ap:"AP2", q:"Welcher Hypervisor läuft direkt auf der Hardware?", o:["VMware ESXi","VirtualBox","VMware Workstation","Docker"], e:"ESXi ist Typ 1. Docker ist kein Hypervisor."},
    {u:"virtual", ap:"AP2", q:"Was unterscheidet Container von virtuellen Maschinen?", o:["Container teilen sich den Kernel des Hosts","Container brauchen immer eigene Hardware","Container bringen ein eigenes Betriebssystem mit","Container können nicht vernetzt werden"], e:"Deshalb starten sie so schnell und sparen Ressourcen."},
    {u:"virtual", ap:"AP2", q:"Eine Firma mietet nur virtuelle Server und installiert alles selbst. Welches Modell ist das?", o:["IaaS","SaaS","PaaS","BaaS"], e:"Der Anbieter stellt nur die Infrastruktur."},
    {u:"virtual", ap:"AP1", q:"Ein Team nutzt Microsoft 365 aus dem Browser. Welches Modell ist das?", o:["SaaS","IaaS","PaaS","On-Premises"], e:"Die fertige Software kommt vom Anbieter."},
    {u:"virtual", ap:"AP2", q:"Wofür eignet sich ein Snapshot am besten?", o:["Als schneller Rückweg vor einem Update","Als dauerhaftes Backup","Als Ersatz für RAID","Zum Verschlüsseln der VM"], e:"Snapshots sind kurzfristig und hängen von der Originalplatte ab."},
    {u:"skripte", ap:"AP2", q:"Was bewirkt der Cron-Eintrag 30 1 * * 0?", o:["Jeden Sonntag um 1:30 Uhr","Jeden Tag um 30 Minuten nach Mitternacht","Am 1. jedes Monats um 0:30 Uhr","Alle 30 Minuten"], e:"Felder: Minute 30, Stunde 1, Wochentag 0 ist Sonntag."},
    {u:"skripte", ap:"AP2", q:"Was tut find /var/log/app -name \"*.log\" -mtime +30 -delete?", o:["Löscht .log-Dateien, die älter als 30 Tage sind","Löscht alle Dateien jünger als 30 Tage","Kopiert Logs nach 30 Tagen","Zeigt nur die Anzahl der Logs"], e:"-mtime +30 trifft Dateien, die vor mehr als 30 Tagen geändert wurden."},
    {u:"skripte", ap:"AP2", q:"Was gibt Get-Service | Where-Object { $_.Status -eq 'Stopped' } aus?", o:["Alle gestoppten Dienste","Alle laufenden Dienste","Es startet alle Dienste","Es stoppt alle Dienste"], e:"Where-Object filtert die Dienste nach ihrem Status."},
    {u:"skripte", ap:"AP2", q:"Womit legst du in Bash eine Variable korrekt an?", o:["name=\"Max\"","$name = \"Max\"","name = \"Max\"","set-name Max"], e:"In Bash stehen keine Leerzeichen um das Gleichheitszeichen."},
    {u:"betrieb", ap:"AP2", q:"Welche USV-Klasse bietet den höchsten Schutz?", o:["VFI","VFD","VI","USB"], e:"VFI (Online) versorgt die Last permanent über die Doppelwandlung."},
    {u:"betrieb", ap:"AP2", q:"Ein Webdienst soll viele Anfragen auf drei Server verteilen. Was setzt du ein?", o:["Load Balancer","USV","DHCP-Relay","RAID 1"], e:"Der Load Balancer verteilt Anfragen und erkennt ausgefallene Server."},
    {u:"betrieb", ap:"AP2", q:"Wie geht man bei wichtigen Server-Updates sinnvoll vor?", o:["Erst testen, dann mit Rollback-Plan ausrollen","Sofort auf allen Servern gleichzeitig installieren","Nie installieren, solange alles läuft","Nur die Clients aktualisieren"], e:"So bleibt das Risiko klein, und Sicherheitslücken werden trotzdem geschlossen."},
    {u:"betrieb", ap:"AP2", q:"Eine Server-Last beträgt 800 W bei einem Leistungsfaktor von 0,8. Welche Scheinleistung muss die USV mindestens liefern?", o:["1000 VA","640 VA","800 VA","1600 VA"], e:"800 W geteilt durch 0,8 ergibt 1000 VA."}
  ]
});
