/* Register Netzwerke. Neue Karten und Fragen nur hinten anhängen: Die Position bestimmt die ID und damit den Lernstand. */
(window.LERN_MODULES = window.LERN_MODULES || []).push({
  id:"netz", title:"Netzwerke", sub:"IP, Subnetting, Routing, Dienste", icon:"globe", color:"#0a84ff", ap:"AP1 und AP2",
  exam:"Analyse und Entwicklung von Netzwerken (AP2, 10 %), Grundlagen auch in AP1",
  drills:["subnet", "binary"],
  units:[
    {id:"ipv4", title:"IPv4-Adressen", sum:"Aufbau, Adressklassen, private Bereiche und Sonderadressen.", sec:[
      {p:"Eine IPv4-Adresse ist 32 Bit lang und wird in vier Oktetten dezimal geschrieben, zum Beispiel 192.168.10.25. Jedes Oktett reicht von 0 bis 255. Die Subnetzmaske legt fest, welcher Teil das Netz und welcher den Host bezeichnet."},
      {h:"Private Adressbereiche (RFC 1918)", table:{head:["Bereich", "CIDR", "Typisch für"], rows:[["10.0.0.0 bis 10.255.255.255", "/8", "Große Firmennetze"], ["172.16.0.0 bis 172.31.255.255", "/12", "Mittlere Netze"], ["192.168.0.0 bis 192.168.255.255", "/16", "Heimnetze, kleine Büros"]]}},
      {h:"Sonderadressen", list:["127.0.0.1: Loopback, das eigene Gerät", "169.254.0.0/16: APIPA, automatisch vergeben, wenn kein DHCP antwortet", "Netzadresse: alle Hostbits 0, nicht an Geräte vergebbar", "Broadcast: alle Hostbits 1, erreicht alle Hosts im Subnetz"]},
      {tip:"APIPA-Adresse im Ticket? Das Gerät hat keinen DHCP-Server erreicht. Prüfe zuerst Kabel, VLAN und DHCP-Dienst."}
    ]},
    {id:"subnet", title:"Subnetting", sum:"Netze aufteilen und Hosts berechnen, das Rechenthema schlechthin.", sec:[
      {p:"Subnetting teilt ein Netz in kleinere Netze. Das begrenzt Broadcasts, trennt Abteilungen und erhöht die Sicherheit. Die Präfixlänge sagt, wie viele Bits zum Netz gehören."},
      {h:"Die drei Formeln", list:["Hosts pro Subnetz = 2 hoch Hostbits, minus 2", "Anzahl Subnetze = 2 hoch geliehene Bits", "Blockgröße = 256 minus Maskenwert im interessanten Oktett"]},
      {h:"Häufige Präfixe", table:{head:["Präfix", "Maske", "Nutzbare Hosts"], rows:[["/24", "255.255.255.0", "254"], ["/25", "255.255.255.128", "126"], ["/26", "255.255.255.192", "62"], ["/27", "255.255.255.224", "30"], ["/28", "255.255.255.240", "14"], ["/29", "255.255.255.248", "6"], ["/30", "255.255.255.252", "2"]]}},
      {h:"Beispiel: 192.168.5.70/26", list:["Maske 255.255.255.192, Blockgröße 256 - 192 = 64", "Netze beginnen bei 0, 64, 128, 192", "70 liegt im Block ab 64: Netzadresse 192.168.5.64", "Broadcast ist die letzte Adresse des Blocks: 192.168.5.127", "Nutzbar: 192.168.5.65 bis 192.168.5.126, also 62 Hosts"]},
      {tip:"Benötigst du 50 Hosts, suche die kleinste Zweierpotenz über 52 (50 + Netz + Broadcast): 64, also 6 Hostbits und damit /26."}
    ]},
    {id:"ipv6", title:"IPv6", sum:"128-Bit-Adressen, Kurzschreibweise und Adresstypen.", sec:[
      {p:"IPv6-Adressen sind 128 Bit lang und werden in acht Blöcken zu je vier Hexadezimalziffern geschrieben. Üblich ist ein /64-Netz: 64 Bit für das Netz, 64 Bit für die Schnittstelle."},
      {h:"Kürzen in zwei Schritten", list:["Führende Nullen je Block weglassen: 0db8 wird db8", "Einmalig eine Folge von Null-Blöcken durch :: ersetzen", "Beispiel: 2001:0db8:0000:0000:0000:0000:0000:0001 wird 2001:db8::1"]},
      {h:"Adresstypen", table:{head:["Präfix", "Typ", "Bedeutung"], rows:[["2000::/3", "Global Unicast", "Weltweit routbar"], ["fe80::/10", "Link-Local", "Nur im lokalen Segment, immer vorhanden"], ["fc00::/7", "Unique Local", "Privat, vergleichbar mit RFC 1918"], ["ff00::/8", "Multicast", "Ersetzt den Broadcast"], ["::1/128", "Loopback", "Das eigene Gerät"]]}},
      {warn:"IPv6 kennt keinen Broadcast. Aufgaben von ARP übernimmt das Neighbor Discovery Protocol (NDP) über ICMPv6."}
    ]},
    {id:"switch", title:"Switching und VLAN", sum:"MAC-Tabellen, VLANs, Trunks und Schleifenschutz.", sec:[
      {p:"Ein Switch arbeitet auf Schicht 2. Er lernt die Absender-MAC jedes Frames und leitet Daten nur an den passenden Port weiter. Unbekannte Ziele und Broadcasts flutet er an alle Ports desselben VLANs."},
      {h:"VLAN-Begriffe", list:["VLAN: trennt ein physisches Netz logisch in eigene Broadcast-Domänen", "Access-Port: gehört zu einem VLAN, Frames sind ungetaggt", "Trunk-Port: transportiert mehrere VLANs, Frames tragen ein Tag nach IEEE 802.1Q", "Zwischen VLANs vermittelt nur ein Router oder Layer-3-Switch"]},
      {h:"Weitere Funktionen", list:["STP (IEEE 802.1D, heute meist RSTP): verhindert Schleifen und Broadcast-Stürme", "Link Aggregation (LACP): bündelt mehrere Leitungen zu einer logischen", "PoE (IEEE 802.3af/at/bt): Strom über das Datenkabel, etwa für Access Points und Telefone"]},
      {tip:"Merksatz: Ein Router trennt Broadcast-Domänen, ein Switch trennt Kollisionsdomänen."}
    ]},
    {id:"routing", title:"Routing und NAT", sum:"Routingtabelle, Gateway, statisch und dynamisch, NAT und Portweiterleitung.", sec:[
      {p:"Ein Router verbindet Netze und entscheidet anhand seiner Routingtabelle. Bei mehreren passenden Einträgen gewinnt der mit dem längsten Präfix. Findet sich nichts Spezielleres, nutzt er die Default-Route 0.0.0.0/0."},
      {h:"Routingarten", table:{head:["Art", "Beispiel", "Eigenschaft"], rows:[["Statisch", "manuell eingetragen", "einfach, aber nicht selbstheilend"], ["Distanzvektor", "RIP", "zählt Hops, maximal 15"], ["Link-State", "OSPF", "kennt die Topologie, schnelle Konvergenz"], ["Pfadvektor", "BGP", "Routing zwischen Providern im Internet"]]}},
      {h:"NAT", list:["NAT übersetzt private in öffentliche Adressen", "PAT (NAT Overload): viele interne Geräte teilen sich eine öffentliche IP über Ports", "Portweiterleitung: macht einen internen Dienst von außen erreichbar"]},
      {warn:"Ein Host ohne korrektes Standardgateway erreicht sein eigenes Netz, aber kein anderes. Genau das ist ein beliebtes Fehlerbild in Aufgaben."}
    ]},
    {id:"dienste", title:"Netzwerkdienste", sum:"DHCP, DNS und die wichtigsten Ports.", sec:[
      {h:"DHCP: der DORA-Ablauf", list:["Discover: Client sucht per Broadcast einen Server", "Offer: Server bietet eine Adresse an", "Request: Client fordert die Adresse an", "Acknowledge: Server bestätigt die Lease"]},
      {h:"DNS-Eintragstypen", table:{head:["Typ", "Zweck"], rows:[["A", "Name zu IPv4-Adresse"], ["AAAA", "Name zu IPv6-Adresse"], ["CNAME", "Aliasname"], ["MX", "Mailserver der Domäne"], ["PTR", "IP-Adresse zu Name (Reverse)"], ["NS", "Zuständiger Nameserver"], ["TXT", "Freier Text, etwa SPF"]]}},
      {h:"Ports, die du kennen musst", table:{head:["Port", "Dienst"], rows:[["22", "SSH"], ["25", "SMTP"], ["53", "DNS"], ["67/68", "DHCP"], ["80 / 443", "HTTP / HTTPS"], ["123", "NTP"], ["143 / 993", "IMAP / IMAPS"], ["161", "SNMP"], ["389 / 636", "LDAP / LDAPS"], ["445", "SMB"], ["3389", "RDP"]]}}
    ]},
    {id:"wlan", title:"WLAN und Medien", sum:"Funkstandards, Verschlüsselung, Kabeltypen und Topologien.", sec:[
      {h:"WLAN-Standards", table:{head:["Bezeichnung", "Standard", "Band"], rows:[["Wi-Fi 4", "802.11n", "2,4 und 5 GHz"], ["Wi-Fi 5", "802.11ac", "5 GHz, die meisten Geräte zusätzlich 2,4 GHz"], ["Wi-Fi 6 / 6E", "802.11ax", "2,4, 5 und bei 6E auch 6 GHz"], ["Wi-Fi 7", "802.11be", "2,4, 5 und 6 GHz"]]}},
      {h:"Sicherheit im WLAN", list:["WEP und WPA gelten als gebrochen und sind tabu", "WPA2 oder besser WPA3 verwenden", "Im Unternehmen: WPA2/3-Enterprise mit IEEE 802.1X und RADIUS-Server, jeder Nutzer meldet sich einzeln an", "Gäste in ein eigenes VLAN legen"]},
      {h:"Kabel", list:["Kupfer Cat 6: 10 Gbit/s auf kurzen Strecken bis etwa 55 m", "Kupfer Cat 6A: 10 Gbit/s bis 100 m", "Glasfaser Multimode: kurze Strecken im Gebäude", "Glasfaser Singlemode: lange Strecken, teils viele Kilometer"]}
    ]},
    {id:"betrieb", title:"Monitoring und Fehlersuche", sum:"Verfügbarkeit überwachen und Störungen systematisch eingrenzen.", sec:[
      {p:"Netze müssen im Betrieb überwacht werden. SNMP liest Werte von Geräten aus, Syslog sammelt Meldungen zentral. Monitoring-Werkzeuge schlagen Alarm, bevor Nutzer die Störung bemerken."},
      {h:"Verfügbarkeit berechnen", list:["Verfügbarkeit = Betriebszeit geteilt durch Gesamtzeit", "99,9 % im Jahr erlauben rund 8,76 Stunden Ausfall", "99,99 % im Jahr erlauben rund 53 Minuten Ausfall", "Redundanz erhöht die Verfügbarkeit: zweite Leitung, VRRP für das Gateway"]},
      {h:"Befehle zur Fehlersuche", table:{head:["Windows", "Linux", "Zweck"], rows:[["ipconfig /all", "ip addr", "Adressen anzeigen"], ["ping", "ping", "Erreichbarkeit prüfen"], ["tracert", "traceroute", "Weg zum Ziel zeigen"], ["nslookup", "dig", "DNS abfragen"], ["netstat -an", "ss -tulpn", "Offene Ports und Verbindungen"], ["arp -a", "ip neigh", "Bekannte MAC-Adressen"]]}},
      {tip:"Systematisch von unten nach oben suchen: Link vorhanden? IP korrekt? Gateway per ping erreichbar? DNS antwortet? Dienst läuft?"}
    ]}
  ],
  cards:[
    {u:"ipv4", f:"Wie lang ist eine IPv4-Adresse?", b:"32 Bit, geschrieben als vier Oktette"},
    {u:"ipv4", f:"Private IPv4-Bereiche", b:"10.0.0.0/8<br>172.16.0.0/12<br>192.168.0.0/16"},
    {u:"ipv4", f:"Was ist 169.254.x.x?", b:"APIPA: selbst vergebene Adresse, wenn kein DHCP-Server antwortet"},
    {u:"ipv4", f:"Was ist die Loopback-Adresse?", b:"127.0.0.1, das eigene Gerät"},
    {u:"subnet", f:"Formel: nutzbare Hosts", b:"2 hoch Hostbits, minus 2 (Netz und Broadcast)"},
    {u:"subnet", f:"Nutzbare Hosts bei /26", b:"62"},
    {u:"subnet", f:"Nutzbare Hosts bei /27", b:"30"},
    {u:"subnet", f:"Nutzbare Hosts bei /30", b:"2, typisch für Punkt-zu-Punkt-Verbindungen"},
    {u:"subnet", f:"Maske von /25", b:"255.255.255.128"},
    {u:"subnet", f:"Maske von /28", b:"255.255.255.240"},
    {u:"subnet", f:"Wie berechnet man die Blockgröße?", b:"256 minus Maskenwert im interessanten Oktett"},
    {u:"ipv6", f:"Wie lang ist eine IPv6-Adresse?", b:"128 Bit, acht Blöcke mit je vier Hexziffern"},
    {u:"ipv6", f:"Wie oft darf :: in einer IPv6-Adresse stehen?", b:"Nur einmal"},
    {u:"ipv6", f:"Link-Local-Präfix", b:"fe80::/10"},
    {u:"ipv6", f:"Was ersetzt ARP bei IPv6?", b:"Neighbor Discovery Protocol (NDP) über ICMPv6"},
    {u:"ipv6", f:"Was ersetzt den Broadcast bei IPv6?", b:"Multicast"},
    {u:"switch", f:"Wofür steht IEEE 802.1Q?", b:"VLAN-Tagging auf Trunk-Ports"},
    {u:"switch", f:"Access-Port vs. Trunk-Port", b:"Access: ein VLAN, ungetaggt.<br>Trunk: mehrere VLANs, getaggt."},
    {u:"switch", f:"Wozu dient STP?", b:"Es verhindert Schleifen im geswitchten Netz und damit Broadcast-Stürme"},
    {u:"switch", f:"Was macht LACP?", b:"Bündelt mehrere Leitungen zu einer logischen Verbindung"},
    {u:"routing", f:"Welche Route gewinnt bei mehreren Treffern?", b:"Die mit dem längsten Präfix"},
    {u:"routing", f:"Wie sieht die Default-Route aus?", b:"0.0.0.0/0"},
    {u:"routing", f:"OSPF: welche Art von Protokoll?", b:"Link-State-Routingprotokoll"},
    {u:"routing", f:"Was ist PAT?", b:"Viele interne Geräte teilen sich eine öffentliche IP-Adresse über verschiedene Ports"},
    {u:"dienste", f:"DHCP-Ablauf", b:"DORA: Discover, Offer, Request, Acknowledge"},
    {u:"dienste", f:"DNS-Eintrag für IPv6", b:"AAAA"},
    {u:"dienste", f:"DNS-Eintrag für Mailserver", b:"MX"},
    {u:"dienste", f:"DNS-Eintrag IP zu Name", b:"PTR"},
    {u:"dienste", f:"Port von RDP", b:"3389"},
    {u:"dienste", f:"Port von SMB", b:"445"},
    {u:"wlan", f:"Welche Norm steckt hinter Wi-Fi 6?", b:"IEEE 802.11ax"},
    {u:"wlan", f:"Wie authentifiziert sich WPA-Enterprise?", b:"Über IEEE 802.1X und einen RADIUS-Server"},
    {u:"wlan", f:"Singlemode vs. Multimode", b:"Singlemode: lange Strecken.<br>Multimode: kurze Strecken im Gebäude."},
    {u:"betrieb", f:"Erlaubte Ausfallzeit bei 99,9 % pro Jahr", b:"Rund 8,76 Stunden"},
    {u:"betrieb", f:"Wofür steht SNMP?", b:"Simple Network Management Protocol, liest Werte von Netzwerkgeräten aus"},
    {u:"betrieb", f:"Wozu dient VRRP?", b:"Mehrere Router teilen sich eine virtuelle Gateway-Adresse und sichern so das Gateway ab"}
  ],
  questions:[
    {u:"ipv4", ap:"AP1", q:"Welche Adresse ist eine private IPv4-Adresse?", o:["172.20.1.5","172.32.1.5","192.169.1.5","11.0.0.1"], e:"Privat ist 172.16.0.0 bis 172.31.255.255. 172.20.1.5 liegt darin, 172.32.1.5 nicht mehr."},
    {u:"ipv4", ap:"AP1", q:"Ein PC hat die Adresse 169.254.12.7. Was ist die wahrscheinlichste Ursache?", o:["Der PC erreicht keinen DHCP-Server","Der DNS-Server ist ausgefallen","Das Standardgateway ist falsch","Der Router macht NAT"], e:"169.254.0.0/16 ist der APIPA-Bereich. Das Gerät nimmt ihn, wenn keine DHCP-Antwort kommt."},
    {u:"ipv4", ap:"AP1", q:"Wie heißt die Adresse, bei der alle Hostbits auf 1 stehen?", o:["Broadcastadresse","Netzadresse","Loopback","Gateway"], e:"Alle Hostbits 1 ergeben den Broadcast, alle Hostbits 0 die Netzadresse."},
    {u:"subnet", ap:"both", q:"Wie viele Hosts sind in einem /27-Netz nutzbar?", o:["30","32","62","14"], e:"32 Bit minus 27 ergibt 5 Hostbits. 2 hoch 5 sind 32, minus Netz und Broadcast bleiben 30."},
    {u:"subnet", ap:"both", q:"Welche Maske gehört zu /26?", o:["255.255.255.192","255.255.255.128","255.255.255.224","255.255.192.0"], e:"Im letzten Oktett sind die obersten 2 Bit gesetzt: 128 + 64 = 192."},
    {u:"subnet", ap:"both", q:"Wie lautet die Netzadresse von 192.168.5.70/26?", o:["192.168.5.64","192.168.5.0","192.168.5.70","192.168.5.128"], e:"Die Blockgröße ist 64. Die Netze beginnen bei 0, 64, 128 und 192, also liegt .70 im Block ab .64."},
    {u:"subnet", ap:"both", q:"Wie lautet die Broadcastadresse von 10.0.0.130/25?", o:["10.0.0.255","10.0.0.127","10.0.0.128","10.0.0.254"], e:"/25 teilt in die Blöcke 0 bis 127 und 128 bis 255. .130 liegt im oberen Block, die letzte Adresse ist .255."},
    {u:"subnet", ap:"AP2", q:"Du brauchst ein Netz für 100 Geräte und willst möglichst wenige Adressen verschwenden. Welches Präfix passt?", o:["/25","/24","/26","/27"], e:"/25 bietet 126 nutzbare Hosts. /26 hat mit 62 zu wenige, /24 verschwendet mehr."},
    {u:"subnet", ap:"AP2", q:"Ein /24-Netz wird in acht gleich große Subnetze geteilt. Welches Präfix entsteht?", o:["/27","/26","/28","/25"], e:"Acht Subnetze brauchen 3 geliehene Bits, 24 + 3 = 27."},
    {u:"subnet", ap:"AP2", q:"Welches Präfix nutzt man üblicherweise für eine Punkt-zu-Punkt-Verbindung zwischen zwei Routern?", o:["/30","/24","/28","/16"], e:"/30 bietet genau zwei nutzbare Adressen, eine je Router."},
    {u:"ipv6", ap:"AP2", q:"Wie lautet die korrekte Kurzform von 2001:0db8:0000:0000:0001:0000:0000:0001?", o:["2001:db8::1:0:0:1","2001:db8::1::1","2001:db8:0:1:1","2001:db8::11"], e:":: darf nur einmal vorkommen und ersetzt hier die erste Null-Folge. Die zweite Folge bleibt als 0:0 stehen."},
    {u:"ipv6", ap:"AP2", q:"Welcher Präfix kennzeichnet Link-Local-Adressen?", o:["fe80::/10","2000::/3","ff00::/8","fc00::/7"], e:"fe80::/10 gilt nur im lokalen Segment. 2000::/3 ist global, ff00::/8 Multicast, fc00::/7 Unique Local."},
    {u:"ipv6", ap:"AP2", q:"Welches Protokoll übernimmt bei IPv6 die Aufgabe von ARP?", o:["NDP","DHCPv6","ICMPv4","RARP"], e:"Das Neighbor Discovery Protocol löst mit ICMPv6-Nachrichten Adressen auf."},
    {u:"switch", ap:"both", q:"Was ist die Hauptaufgabe eines VLANs?", o:["Ein physisches Netz logisch in Broadcast-Domänen trennen","Daten verschlüsseln","Öffentliche IP-Adressen sparen","Die Kabellänge erhöhen"], e:"VLANs trennen auf Schicht 2. Verkehr zwischen VLANs braucht Routing."},
    {u:"switch", ap:"AP2", q:"Wie verbindet man zwei Switches, wenn über die Leitung mehrere VLANs laufen sollen?", o:["Über einen Trunk nach IEEE 802.1Q","Über einen Access-Port","Über NAT","Über STP"], e:"Ein Trunk transportiert mehrere VLANs und kennzeichnet die Frames mit einem Tag."},
    {u:"switch", ap:"AP2", q:"Zwei Switches sind doppelt verkabelt, das Netz bricht durch einen Broadcast-Sturm zusammen. Was fehlt?", o:["Spanning Tree Protocol","DHCP-Relay","OSPF","PoE"], e:"STP blockiert redundante Pfade und verhindert so Schleifen."},
    {u:"switch", ap:"AP2", q:"PCs in VLAN 10 sollen PCs in VLAN 20 erreichen. Was wird benötigt?", o:["Router oder Layer-3-Switch","Ein weiterer Access-Port","Ein Hub","WPA3"], e:"VLANs sind getrennte Netze. Nur Routing verbindet sie."},
    {u:"routing", ap:"AP2", q:"Die Routingtabelle enthält 10.0.0.0/8 und 10.1.0.0/16. Welche Route nutzt ein Paket an 10.1.2.3?", o:["10.1.0.0/16","10.0.0.0/8","Die Default-Route","Beide abwechselnd"], e:"Es gewinnt der längste passende Präfix, hier /16."},
    {u:"routing", ap:"both", q:"Ein PC erreicht Geräte im eigenen Netz, aber nichts außerhalb. Was ist die wahrscheinlichste Ursache?", o:["Falsches Standardgateway","Defektes Netzteil","Falscher MX-Eintrag","Fehlendes VLAN-Tag am Access-Port"], e:"Für alles außerhalb des eigenen Netzes braucht der Host das Standardgateway."},
    {u:"routing", ap:"AP2", q:"Was unterscheidet OSPF von RIP?", o:["OSPF ist ein Link-State-Protokoll, RIP zählt nur Hops","OSPF läuft nur in IPv6-Netzen","RIP konvergiert schneller","OSPF ist ein statisches Verfahren"], e:"RIP ist ein Distanzvektorprotokoll mit maximal 15 Hops, OSPF kennt die gesamte Topologie."},
    {u:"routing", ap:"both", q:"Wodurch können viele Geräte über eine einzige öffentliche IP-Adresse ins Internet?", o:["PAT (NAT Overload)","STP","DHCP","LACP"], e:"PAT unterscheidet die internen Geräte anhand der Portnummern."},
    {u:"dienste", ap:"both", q:"In welcher Reihenfolge läuft DHCP ab?", o:["Discover, Offer, Request, Acknowledge","Request, Offer, Discover, Acknowledge","Offer, Discover, Acknowledge, Request","Discover, Request, Offer, Acknowledge"], e:"Merkhilfe DORA. Der Client sucht, der Server bietet an, der Client fordert an, der Server bestätigt."},
    {u:"dienste", ap:"both", q:"Welcher DNS-Eintrag verweist auf den Mailserver einer Domäne?", o:["MX","A","CNAME","PTR"], e:"MX steht für Mail Exchanger."},
    {u:"dienste", ap:"both", q:"Über welchen Port läuft HTTPS standardmäßig?", o:["443","80","22","8080"], e:"HTTPS nutzt TCP 443, unverschlüsseltes HTTP dagegen 80."},
    {u:"dienste", ap:"AP2", q:"Clients in einem anderen Subnetz sollen denselben DHCP-Server nutzen. Was richtest du ein?", o:["Einen DHCP-Relay-Agent","Einen zweiten MX-Eintrag","Einen Trunk ohne Tag","NAT"], e:"DHCP startet per Broadcast, und Router leiten den nicht weiter. Der Relay-Agent reicht die Anfragen gezielt durch."},
    {u:"dienste", ap:"AP1", q:"Welche Aufgabe hat DNS?", o:["Namen in IP-Adressen auflösen","IP-Adressen automatisch vergeben","Daten verschlüsseln","Pakete zwischen Netzen routen"], e:"DNS löst Namen auf. Die automatische Vergabe von IP-Adressen übernimmt DHCP."},
    {u:"wlan", ap:"AP1", q:"Welcher WLAN-Schutz ist heute zu bevorzugen?", o:["WPA3","WEP","WPA","Offenes WLAN mit versteckter SSID"], e:"WEP und WPA gelten als unsicher, eine versteckte SSID schützt nicht wirklich."},
    {u:"wlan", ap:"AP2", q:"Jeder Mitarbeiter soll sich mit eigenen Zugangsdaten am WLAN anmelden. Was setzt du ein?", o:["WPA-Enterprise mit 802.1X und RADIUS","WPA-Personal mit gemeinsamem Passwort","MAC-Filter allein","WEP"], e:"Enterprise authentifiziert jeden Nutzer einzeln über einen RADIUS-Server."},
    {u:"wlan", ap:"AP1", q:"Zwei 2 km entfernte Gebäude sollen vernetzt werden. Welches Medium passt am besten?", o:["Singlemode-Glasfaser","Cat-6-Kupferkabel","Multimode für 100 m ausgelegt","Koaxialkabel"], e:"Kupfer reicht bis etwa 100 m. Singlemode überbrückt problemlos mehrere Kilometer."},
    {u:"betrieb", ap:"AP2", q:"Eine Verfügbarkeit von 99,9 % erlaubt pro Jahr ungefähr wie viel Ausfall?", o:["8,76 Stunden","53 Minuten","3,65 Tage","87,6 Stunden"], e:"0,1 % von 8.760 Stunden ergeben 8,76 Stunden."},
    {u:"betrieb", ap:"AP2", q:"Mit welchem Protokoll liest ein Monitoring-System Werte von Switches aus?", o:["SNMP","SMTP","SFTP","STP"], e:"Das Simple Network Management Protocol ist dafür gemacht."},
    {u:"betrieb", ap:"both", q:"ping auf eine IP-Adresse klappt, ping auf den Namen nicht. Wo liegt der Fehler vermutlich?", o:["Beim DNS","Beim Kabel","Beim Standardgateway","Beim Switch"], e:"Die Verbindung steht, denn die IP-Adresse antwortet. Es fehlt nur die Namensauflösung."},
    {u:"betrieb", ap:"AP2", q:"Welches Werkzeug zeigt den Weg eines Pakets über die einzelnen Router?", o:["tracert / traceroute","nslookup","ipconfig","arp"], e:"traceroute listet jeden Hop mit den Antwortzeiten auf."}
  ]
});
