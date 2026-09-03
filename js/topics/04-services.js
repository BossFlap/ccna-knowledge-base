// ===== Domain 4: IP Services (10%) — Erweiterungen nach Blueprint v1.1 =====

// ---------- 4.2 NTP ----------
registerTopic({
  id: "ntp",
  domain: "IP Services",
  domainPct: "10%",
  icon: "⏰",
  title: "NTP — Network Time Protocol",
  tags: ["Blueprint 4.2", "Services", "Zeit"],
  content: `
    <div class="content-section">
      <h3>⏰ Warum NTP?</h3>
      <p>Synchronisierte Uhren sind Voraussetzung für <strong>korrelierbare Logs</strong> (Syslog, SNMP-Traps), <strong>Zertifikate</strong> (Gültigkeitszeiträume), <strong>Kerberos/AAA</strong>, zeitbasierte ACLs und Troubleshooting. NTP läuft über <strong>UDP 123</strong>.</p>
      <h4>Stratum — die Hierarchie</h4>
      <pre><code>Stratum 0   Atomuhr / GPS (Referenzuhr, kein Netzwerkgerät)
   │
Stratum 1   NTP-Server direkt an Stratum 0 (z.B. pool.ntp.org-Server, GPS-Appliance)
   │
Stratum 2   Router/Server, der von Stratum 1 synchronisiert  ← typischer Firmen-NTP-Server
   │
Stratum 3   Geräte, die von Stratum 2 lernen                 ← Switches, Router im Campus
   ...
Stratum 16  = nicht synchronisiert (unsynchronized)</code></pre>
      <ul>
        <li>Jeder Hop erhöht das Stratum um 1. Niedrigeres Stratum = näher an der Referenz = genauer.</li>
        <li>Ein Gerät kann gleichzeitig <strong>Client</strong> (holt Zeit) und <strong>Server</strong> (verteilt Zeit weiter) sein.</li>
        <li>Bester Praxis: 2–3 externe Quellen für den zentralen Router, alle internen Geräte synchronisieren sich vom zentralen Router (Stratum 3).</li>
      </ul>
    </div>

    <div class="content-section">
      <h3>⚙️ NTP Client- und Server-Modus (Blueprint 4.2)</h3>
      <pre><code><span class="cli-comment"># ── R1: Client zu einem externen Server UND Server für das interne Netz ──</span>
R1(config)# ntp server 216.239.35.0            <span class="cli-comment"># Client-Modus: Zeit von diesem Server holen</span>
R1(config)# ntp server 216.239.35.4 prefer     <span class="cli-comment"># bevorzugte Quelle</span>
R1(config)# ntp master 3                       <span class="cli-comment"># Server-Modus mit eigenem Stratum (nur falls keine externe Quelle!)</span>
R1(config)# ntp source loopback0               <span class="cli-comment"># Quell-IP für NTP-Pakete</span>
R1(config)# ntp update-calendar                <span class="cli-comment"># Hardware-Uhr mit NTP aktualisieren</span>

<span class="cli-comment"># ── SW1: Client von R1 ──</span>
SW1(config)# ntp server 10.1.1.1

<span class="cli-comment"># ── Zeitzone &amp; Sommerzeit (NTP liefert UTC!) ──</span>
R1(config)# clock timezone CET 1 0
R1(config)# clock summer-time CEST recurring last Sun Mar 2:00 last Sun Oct 3:00

<span class="cli-comment"># ── Authentifizierung (optional, empfohlen) ──</span>
R1(config)# ntp authenticate
R1(config)# ntp authentication-key 1 md5 NtpSecret
R1(config)# ntp trusted-key 1
SW1(config)# ntp server 10.1.1.1 key 1

<span class="cli-comment"># ── Verifikation ──</span>
R1# show ntp status
Clock is synchronized, stratum 2, reference is 216.239.35.4
nominal freq is 250.0000 Hz, actual freq is 249.9998 Hz, precision is 2**10
...
R1# show ntp associations
  address         ref clock       st   when   poll reach  delay  offset   disp
*~216.239.35.4    .GOOG.           1     41     64   377  12.3   -0.51    1.2
+~216.239.35.0    .GOOG.           1     22     64   377  13.1    0.22    1.4
 * sys.peer, # selected, + candidate, - outlyer, x falseticker, ~ configured

R1# show clock detail
*14:22:31.123 CEST Wed Sep 3 2026
Time source is NTP</code></pre>
      <div class="table-wrap"><table>
        <tr><th>Befehl</th><th>Modus</th><th>Bedeutung</th></tr>
        <tr><td><code>ntp server &lt;ip&gt;</code></td><td>Client</td><td>Von diesem Server synchronisieren. Das Gerät wird automatisch auch Server für andere (Stratum +1)</td></tr>
        <tr><td><code>ntp master [stratum]</code></td><td>Server (authoritativ)</td><td>Gerät nutzt seine eigene Uhr als Referenz — nur ohne externe Quelle sinnvoll (Standard-Stratum 8)</td></tr>
        <tr><td><code>ntp peer &lt;ip&gt;</code></td><td>Symmetrisch</td><td>Zwei Geräte synchronisieren sich gegenseitig</td></tr>
      </table></div>
      <div class="callout callout-warn"><strong>Prüfungsfallen</strong>1) <code>show ntp status</code> zeigt „unsynchronized“ → prüfe Erreichbarkeit (UDP 123), ACLs und ob der Server selbst synchron ist. 2) NTP liefert <strong>UTC</strong> — ohne <code>clock timezone</code> stimmt die angezeigte Ortszeit nicht. 3) Synchronisierung kann einige Minuten dauern.</div>
    </div>
  `
}, {
  after: "nat",
  quiz: [
    {
      q: "Welchen Port verwendet NTP?",
      options: ["TCP 123", "UDP 123", "UDP 161", "TCP 514"],
      correct: 1,
      explanation: "NTP nutzt UDP Port 123. UDP 161 ist SNMP, 514 Syslog.",
      theoryRef: "ntp"
    },
    {
      q: "Ein Router synchronisiert sich mit einem Stratum-2-Server. Welches Stratum hat der Router selbst?",
      options: ["1", "2", "3", "16"],
      correct: 2,
      explanation: "Jeder Hop erhöht das Stratum um 1. Ein Client eines Stratum-2-Servers ist Stratum 3.",
      theoryRef: "ntp"
    },
    {
      q: "Mit welchem Befehl konfigurierst du einen Router so, dass er einen externen NTP-Server als Zeitquelle nutzt?",
      options: ["ntp master 2", "ntp server 216.239.35.0", "clock set 12:00:00", "ntp peer 216.239.35.0"],
      correct: 1,
      explanation: "'ntp server <ip>' = Client-Modus. 'ntp master' macht das Gerät zur eigenständigen Referenz, 'clock set' setzt die Uhr nur manuell.",
      theoryRef: "ntp"
    },
    {
      q: "Was bedeutet Stratum 16?",
      options: ["Höchste Genauigkeit", "Das Gerät ist nicht synchronisiert", "Das Gerät ist eine Atomuhr", "Das Gerät ist ein Peer"],
      correct: 1,
      explanation: "Stratum 16 kennzeichnet ein unsynchronisiertes Gerät. Stratum 0 wäre die Referenzuhr (Atomuhr/GPS).",
      theoryRef: "ntp"
    },
    {
      q: "Welcher Befehl zeigt, ob die Uhr synchronisiert ist und mit welchem Stratum?",
      options: ["show clock", "show ntp associations", "show ntp status", "show ntp config"],
      correct: 2,
      explanation: "'show ntp status' zeigt 'Clock is synchronized, stratum X, reference is ...'. 'show ntp associations' listet die konfigurierten Server mit Status-Symbolen.",
      theoryRef: "ntp"
    }
  ],
  flashcards: [
    { front: "NTP Port", back: "UDP 123" },
    { front: "Stratum 0 / 1 / 16", back: "Referenzuhr (Atom/GPS) / direkt daran angeschlossener Server / nicht synchronisiert" },
    { front: "ntp server vs. ntp master", back: "Client-Modus (von Server lernen) vs. eigene Uhr als autoritative Referenz" },
    { front: "NTP-Status prüfen", back: "show ntp status · show ntp associations · show clock detail" },
    { front: "NTP liefert …", back: "UTC — Zeitzone mit clock timezone / clock summer-time setzen" }
  ]
});

// ---------- 4.3 DNS ----------
registerTopic({
  id: "dns",
  domain: "IP Services",
  domainPct: "10%",
  icon: "📇",
  title: "DNS — Domain Name System",
  tags: ["Blueprint 4.3", "Services", "Namensauflösung"],
  content: `
    <div class="content-section">
      <h3>📇 Rolle von DNS im Netzwerk</h3>
      <p>DNS übersetzt <strong>Namen in IP-Adressen</strong> (und umgekehrt). Ohne DNS müssten Nutzer IPs auswendig kennen. Es ist ein hierarchisches, verteiltes System: Root-Server → TLD-Server (.com, .de) → autoritative Server der Domain.</p>
      <pre><code>Client fragt: www.cisco.com ?
   │
   ▼  (1) rekursive Anfrage
Resolver (z.B. 8.8.8.8 oder Firmen-DNS) — hat Cache?
   │ nein → iterative Anfragen:
   ├─► (2) Root-Server:        "frag den .com-Server"
   ├─► (3) .com TLD-Server:    "frag ns1.cisco.com"
   └─► (4) autoritativer Server cisco.com:  "www = 72.163.4.185"
   │
   ▼  (5) Antwort an Client, Ergebnis wird gecacht (TTL)</code></pre>
      <div class="table-wrap"><table>
        <tr><th>Merkmal</th><th>Wert</th></tr>
        <tr><td>Port</td><td><strong>UDP 53</strong> (Abfragen), <strong>TCP 53</strong> (Zone Transfers, große Antworten &gt; 512 Byte, DNS over TLS = 853)</td></tr>
        <tr><td>Resolver (rekursiv)</td><td>Beantwortet Client-Anfragen vollständig, fragt selbst iterativ nach</td></tr>
        <tr><td>Autoritativer Server</td><td>Hält die Zone und ist die „Wahrheit“ für eine Domain</td></tr>
        <tr><td>Cache / TTL</td><td>Antworten werden für die Time-to-Live gespeichert — beschleunigt, kann aber veraltete Einträge liefern</td></tr>
        <tr><td>FQDN</td><td>Fully Qualified Domain Name, z.B. <code>www.cisco.com.</code> (Host + Domain)</td></tr>
      </table></div>
    </div>

    <div class="content-section">
      <h3>📑 Wichtige Record-Typen</h3>
      <div class="table-wrap"><table>
        <tr><th>Typ</th><th>Bedeutung</th><th>Beispiel</th></tr>
        <tr><td><strong>A</strong></td><td>Name → IPv4</td><td><code>www.firma.de → 203.0.113.10</code></td></tr>
        <tr><td><strong>AAAA</strong></td><td>Name → IPv6</td><td><code>www.firma.de → 2001:DB8::10</code></td></tr>
        <tr><td><strong>CNAME</strong></td><td>Alias auf einen anderen Namen</td><td><code>shop.firma.de → www.firma.de</code></td></tr>
        <tr><td><strong>MX</strong></td><td>Mail-Server der Domain</td><td><code>firma.de → mail.firma.de (Prio 10)</code></td></tr>
        <tr><td><strong>NS</strong></td><td>Autoritative Nameserver</td><td><code>firma.de → ns1.firma.de</code></td></tr>
        <tr><td><strong>PTR</strong></td><td>IP → Name (Reverse Lookup)</td><td><code>10.113.0.203.in-addr.arpa → www.firma.de</code></td></tr>
        <tr><td><strong>SOA</strong></td><td>Start of Authority — Zonen-Metadaten (Serial, Refresh)</td><td>—</td></tr>
        <tr><td><strong>TXT</strong></td><td>Freitext (SPF, DKIM, Domain-Verifikation)</td><td><code>v=spf1 include:...</code></td></tr>
        <tr><td><strong>SRV</strong></td><td>Dienst-Lokalisierung (Port + Host)</td><td><code>_sip._tcp.firma.de</code></td></tr>
      </table></div>
    </div>

    <div class="content-section">
      <h3>⚙️ DNS auf Cisco IOS</h3>
      <p>Router/Switches nutzen DNS selbst, um Hostnamen in <code>ping</code>, <code>traceroute</code> oder <code>ssh</code> aufzulösen. Standardmäßig versucht IOS <em>jeden unbekannten Befehl</em> als Hostnamen aufzulösen (nervige Verzögerung bei Tippfehlern).</p>
      <pre><code><span class="cli-comment"># DNS-Client konfigurieren</span>
R1(config)# ip domain-lookup                 <span class="cli-comment"># Namensauflösung an (Standard)</span>
R1(config)# ip name-server 10.1.1.53 8.8.8.8 <span class="cli-comment"># bis zu 6 Server</span>
R1(config)# ip domain-name firma.local       <span class="cli-comment"># Standard-Domain — wird an kurze Namen angehängt</span>
R1(config)# ip domain-list firma.local lab.local

<span class="cli-comment"># Auflösung bei Tippfehlern abschalten (Lab-Klassiker)</span>
R1(config)# no ip domain-lookup

<span class="cli-comment"># Statische Host-Einträge (lokale "hosts"-Datei)</span>
R1(config)# ip host SW1 10.1.1.10
R1(config)# ip host SRV-WEB 10.1.2.80

<span class="cli-comment"># Router als (Caching-)DNS-Server für das LAN</span>
R1(config)# ip dns server

<span class="cli-comment"># Verifikation</span>
R1# show hosts                     <span class="cli-comment"># statische Einträge + Cache</span>
R1# ping SRV-WEB
R1# clear host *</code></pre>
      <div class="callout callout-info"><strong>DHCP und DNS arbeiten zusammen</strong>DHCP verteilt neben IP und Gateway auch die <strong>DNS-Server-Adresse</strong> (Option 6) und den <strong>Domain-Namen</strong> (Option 15) an Clients. Im DHCP-Pool: <code>dns-server 10.1.1.53</code> und <code>domain-name firma.local</code>.</div>
      <div class="callout callout-tip"><strong>Troubleshooting</strong>Ping auf IP klappt, auf Name nicht → DNS. Am Client: <code>nslookup www.cisco.com</code> / <code>dig</code>. Am Router: <code>show hosts</code>, ist <code>ip name-server</code> erreichbar (UDP 53 durch ACL/Firewall erlaubt)?</div>
    </div>
  `
}, {
  after: "ntp",
  quiz: [
    {
      q: "Welcher DNS-Record-Typ ordnet einem Namen eine IPv6-Adresse zu?",
      options: ["A", "AAAA", "PTR", "CNAME"],
      correct: 1,
      explanation: "A = IPv4, AAAA = IPv6, PTR = Reverse (IP → Name), CNAME = Alias.",
      theoryRef: "dns"
    },
    {
      q: "Welcher Befehl verhindert, dass ein Cisco-Router bei einem vertippten Befehl versucht, diesen per DNS aufzulösen?",
      options: ["no ip name-server", "no ip domain-lookup", "no dns resolve", "ip dns server"],
      correct: 1,
      explanation: "'no ip domain-lookup' deaktiviert die DNS-Namensauflösung am Router — Tippfehler führen dann nicht mehr zu einer Wartezeit.",
      theoryRef: "dns"
    },
    {
      q: "Welchen Transport nutzt DNS für normale Abfragen bzw. für Zone Transfers?",
      options: ["TCP 53 / UDP 53", "UDP 53 / TCP 53", "UDP 67 / UDP 68", "TCP 80 / TCP 443"],
      correct: 1,
      explanation: "Standardabfragen laufen über UDP 53, Zone Transfers und große Antworten über TCP 53.",
      theoryRef: "dns"
    },
    {
      q: "Mit welchem Befehl definierst du den DNS-Server, den der Router für die Namensauflösung nutzen soll?",
      options: ["ip dns server 8.8.8.8", "ip host 8.8.8.8", "ip name-server 8.8.8.8", "dns-server 8.8.8.8"],
      correct: 2,
      explanation: "'ip name-server <ip>' setzt den DNS-Server des Routers. 'dns-server' ist der Befehl innerhalb eines DHCP-Pools, 'ip dns server' macht den Router selbst zum DNS-Server.",
      theoryRef: "dns"
    },
    {
      q: "Welche Aufgabe hat ein PTR-Record?",
      options: ["Mail-Server bestimmen", "Alias auf einen anderen Namen", "Reverse Lookup: IP-Adresse → Name", "Nameserver der Zone angeben"],
      correct: 2,
      explanation: "PTR-Records (in der in-addr.arpa-Zone) lösen eine IP-Adresse in einen Namen auf.",
      theoryRef: "dns"
    }
  ],
  flashcards: [
    { front: "DNS Ports", back: "UDP 53 (Abfragen), TCP 53 (Zone Transfer, große Antworten)" },
    { front: "A / AAAA / CNAME / MX / PTR", back: "IPv4 / IPv6 / Alias / Mail-Server / Reverse Lookup" },
    { front: "no ip domain-lookup", back: "Router löst Tippfehler nicht mehr als Hostnamen auf" },
    { front: "ip name-server", back: "DNS-Server für den Router setzen (bis zu 6)" },
    { front: "Rekursiv vs. iterativ", back: "Resolver beantwortet Client vollständig (rekursiv), fragt selbst Schritt für Schritt (iterativ)" },
    { front: "DHCP-Option für DNS-Server", back: "Option 6 (Domain-Name: Option 15)" }
  ]
});

// ---------- 4.4 / 4.5 SNMP & Syslog ----------
registerTopic({
  id: "snmp-syslog",
  domain: "IP Services",
  domainPct: "10%",
  icon: "📊",
  title: "SNMP & Syslog",
  tags: ["Blueprint 4.4", "Blueprint 4.5", "Monitoring", "Logging"],
  content: `
    <div class="content-section">
      <h3>📊 SNMP — Simple Network Management Protocol (Blueprint 4.4)</h3>
      <p>SNMP dient dem <strong>Monitoring und Management</strong> von Netzwerkgeräten. Ein zentrales <strong>NMS</strong> (Network Management System, z.B. SolarWinds, PRTG, LibreNMS) fragt Geräte ab oder wird von ihnen benachrichtigt.</p>
      <div class="table-wrap"><table>
        <tr><th>Komponente</th><th>Rolle</th></tr>
        <tr><td><strong>SNMP Manager (NMS)</strong></td><td>Sendet Anfragen, empfängt Antworten und Traps, stellt Graphen/Alarme bereit</td></tr>
        <tr><td><strong>SNMP Agent</strong></td><td>Software auf dem Gerät (Router, Switch) — beantwortet Anfragen, sendet Traps</td></tr>
        <tr><td><strong>MIB</strong></td><td>Management Information Base — hierarchische Datenbank aller abfragbaren Werte</td></tr>
        <tr><td><strong>OID</strong></td><td>Object Identifier — Adresse eines Werts in der MIB, z.B. <code>1.3.6.1.2.1.1.5.0</code> = sysName</td></tr>
      </table></div>
      <div class="table-wrap"><table>
        <tr><th>Nachricht</th><th>Richtung</th><th>Bedeutung</th></tr>
        <tr><td><strong>Get / GetNext / GetBulk</strong></td><td>NMS → Agent (UDP <strong>161</strong>)</td><td>Werte lesen (Polling)</td></tr>
        <tr><td><strong>Set</strong></td><td>NMS → Agent (UDP 161)</td><td>Wert schreiben (z.B. Interface deaktivieren)</td></tr>
        <tr><td><strong>Trap</strong></td><td>Agent → NMS (UDP <strong>162</strong>)</td><td>Unaufgeforderte Meldung eines Ereignisses — <em>ohne</em> Bestätigung</td></tr>
        <tr><td><strong>Inform</strong></td><td>Agent → NMS (UDP 162)</td><td>Wie Trap, aber <em>mit</em> Bestätigung durch das NMS (zuverlässig)</td></tr>
      </table></div>
      <h4>Versionen</h4>
      <div class="table-wrap"><table>
        <tr><th>Version</th><th>Sicherheit</th><th>Merkmal</th></tr>
        <tr><td>SNMPv1</td><td>Community-String im <strong>Klartext</strong></td><td>Veraltet</td></tr>
        <tr><td>SNMPv2c</td><td>Community-String im <strong>Klartext</strong></td><td>+ GetBulk, Inform, 64-Bit-Counter — noch weit verbreitet</td></tr>
        <tr><td><strong>SNMPv3</strong></td><td><strong>Authentifizierung + Verschlüsselung</strong> (User-basiert)</td><td>Security Levels: <em>noAuthNoPriv</em> · <em>authNoPriv</em> (MD5/SHA) · <em>authPriv</em> (SHA + AES) — Best Practice</td></tr>
      </table></div>
      <pre><code><span class="cli-comment"># SNMPv2c — Read-only Community, auf NMS begrenzt via ACL</span>
R1(config)# access-list 10 permit host 10.1.1.100
R1(config)# snmp-server community MonitorRO ro 10
R1(config)# snmp-server community AdminRW rw 10
R1(config)# snmp-server location Serverraum-EG
R1(config)# snmp-server contact netadmin@firma.de
R1(config)# snmp-server host 10.1.1.100 version 2c MonitorRO
R1(config)# snmp-server enable traps                <span class="cli-comment"># alle Trap-Typen (oder gezielt: ... traps snmp linkdown linkup)</span>

<span class="cli-comment"># SNMPv3 — authPriv</span>
R1(config)# snmp-server view ALL iso included
R1(config)# snmp-server group NETADMIN v3 priv read ALL write ALL access 10
R1(config)# snmp-server user monitor NETADMIN v3 auth sha AuthPass123 priv aes 128 PrivPass123
R1(config)# snmp-server host 10.1.1.100 version 3 priv monitor

<span class="cli-comment"># Verifikation</span>
R1# show snmp
R1# show snmp community
R1# show snmp user
R1# show snmp host</code></pre>
      <div class="callout callout-warn"><strong>Sicherheit</strong>Niemals die Standard-Communities <code>public</code>/<code>private</code> lassen. SNMPv1/v2c nur mit ACL und read-only; für Schreibzugriff SNMPv3 authPriv.</div>
    </div>

    <div class="content-section">
      <h3>📝 Syslog — Facilities und Severity Levels (Blueprint 4.5)</h3>
      <p>Syslog ist das Standardformat für <strong>Log-Meldungen</strong>. Cisco-Geräte senden sie an die Console, den Terminal-Monitor (VTY), den internen Buffer und/oder einen <strong>Syslog-Server</strong> (UDP <strong>514</strong>).</p>
      <pre><code>*Sep  3 14:22:31.123: %LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to down
 └─ Zeitstempel      └ Facility  │ └ Mnemonic        └ Beschreibung
                                 └ Severity (5 = Notification)</code></pre>
      <div class="table-wrap"><table>
        <tr><th>Level</th><th>Name</th><th>Schlüsselwort</th><th>Bedeutung / Beispiel</th></tr>
        <tr><td><strong>0</strong></td><td>Emergency</td><td><code>emergencies</code></td><td>System unbenutzbar</td></tr>
        <tr><td><strong>1</strong></td><td>Alert</td><td><code>alerts</code></td><td>Sofortiges Handeln nötig (Temperatur kritisch)</td></tr>
        <tr><td><strong>2</strong></td><td>Critical</td><td><code>critical</code></td><td>Kritischer Zustand (Hardware-Fehler)</td></tr>
        <tr><td><strong>3</strong></td><td>Error</td><td><code>errors</code></td><td>Fehler (Duplex-Mismatch, %LINK-3-UPDOWN)</td></tr>
        <tr><td><strong>4</strong></td><td>Warning</td><td><code>warnings</code></td><td>Warnung (Konfigurationsproblem)</td></tr>
        <tr><td><strong>5</strong></td><td>Notification</td><td><code>notifications</code></td><td>Normal, aber bedeutsam — <strong>Interface up/down, Config geändert (%SYS-5-CONFIG_I)</strong></td></tr>
        <tr><td><strong>6</strong></td><td>Informational</td><td><code>informational</code></td><td>Info — <strong>ACL-Log-Treffer, NAT-Übersetzungen</strong></td></tr>
        <tr><td><strong>7</strong></td><td>Debugging</td><td><code>debugging</code></td><td>Debug-Ausgaben (<code>debug ...</code>)</td></tr>
      </table></div>
      <div class="callout callout-tip"><strong>Merkhilfe 0→7</strong>„<strong>E</strong>very <strong>A</strong>wesome <strong>C</strong>isco <strong>E</strong>ngineer <strong>W</strong>ill <strong>N</strong>eed <strong>I</strong>ce cream <strong>D</strong>aily“ — Emergency, Alert, Critical, Error, Warning, Notification, Informational, Debugging. Ein konfiguriertes Level schließt <strong>alle niedrigeren Nummern</strong> (= schwerwiegenderen) mit ein: <code>logging trap 4</code> sendet 0–4.</div>
      <p><strong>Facility</strong> (in der Meldung) = die Komponente, die die Meldung erzeugt: <code>%LINK</code>, <code>%LINEPROTO</code>, <code>%SYS</code>, <code>%OSPF</code>, <code>%DUAL</code> (EIGRP), <code>%SEC</code> (ACL), <code>%PORT_SECURITY</code>. Zusätzlich gibt es die <em>Syslog-Facility</em> für den Server (local0–local7, Standard <code>local7</code>), mit der der Server Meldungen sortiert.</p>
      <pre><code><span class="cli-comment"># Ziele und Level</span>
R1(config)# logging console 4                 <span class="cli-comment"># Console: nur 0–4 (Warnings und schlimmer)</span>
R1(config)# logging monitor 6                 <span class="cli-comment"># VTY-Sitzungen — braucht zusätzlich 'terminal monitor' in der Session</span>
R1(config)# logging buffered 16384 6          <span class="cli-comment"># interner Puffer 16 KB, Level 6</span>
R1(config)# logging host 10.1.1.200           <span class="cli-comment"># Syslog-Server (UDP 514)</span>
R1(config)# logging trap 5                    <span class="cli-comment"># Level für Syslog-Server: 0–5</span>
R1(config)# logging facility local6
R1(config)# logging source-interface loopback0

<span class="cli-comment"># Zeitstempel (ohne NTP nutzlos!) und Sequenznummern</span>
R1(config)# service timestamps log datetime msec localtime show-timezone
R1(config)# service sequence-numbers

<span class="cli-comment"># Syslog-Meldungen unterbrechen die Eingabe nicht</span>
R1(config)# line console 0
R1(config-line)# logging synchronous

<span class="cli-comment"># Verifikation</span>
R1# show logging                              <span class="cli-comment"># Einstellungen + Buffer-Inhalt</span>
R1# terminal monitor                          <span class="cli-comment"># Meldungen in der aktuellen SSH-Sitzung anzeigen</span>
R1# clear logging</code></pre>
      <div class="callout callout-info"><strong>SNMP vs. Syslog</strong>SNMP = <strong>strukturierte Werte abfragen</strong> (Bandbreite, CPU, Interface-Status) + Traps. Syslog = <strong>Textmeldungen über Ereignisse</strong>. Beide gehören in ein zentrales Monitoring; ein SIEM korreliert Syslog-Daten vieler Quellen.</div>
    </div>
  `
}, {
  after: "dns",
  quiz: [
    {
      q: "Welche Syslog-Severity hat die Meldung '%LINEPROTO-5-UPDOWN'?",
      options: ["Level 3 – Error", "Level 5 – Notification", "Level 6 – Informational", "Level 7 – Debugging"],
      correct: 1,
      explanation: "Die Zahl zwischen Facility und Mnemonic ist der Severity Level: 5 = Notification (normal, aber bedeutsam).",
      theoryRef: "snmp-syslog"
    },
    {
      q: "Ein Router hat 'logging trap 4' konfiguriert. Welche Meldungen gehen an den Syslog-Server?",
      options: ["Nur Level 4", "Level 4 bis 7", "Level 0 bis 4", "Alle Meldungen"],
      correct: 2,
      explanation: "Ein konfiguriertes Level schließt alle schwerwiegenderen (niedrigere Nummern) ein: 0 (Emergency) bis 4 (Warning).",
      theoryRef: "snmp-syslog"
    },
    {
      q: "Welche Ports verwendet SNMP für Anfragen (Get/Set) und für Traps?",
      options: ["UDP 161 für Anfragen, UDP 162 für Traps", "TCP 161 für alles", "UDP 514 und UDP 123", "UDP 162 für Anfragen, UDP 161 für Traps"],
      correct: 0,
      explanation: "Der Agent lauscht auf UDP 161 (Get/Set vom NMS). Traps und Informs sendet er an das NMS auf UDP 162.",
      theoryRef: "snmp-syslog"
    },
    {
      q: "Welche SNMP-Version bietet Authentifizierung und Verschlüsselung?",
      options: ["SNMPv1", "SNMPv2c", "SNMPv3", "Alle Versionen"],
      correct: 2,
      explanation: "Nur SNMPv3 bietet User-basierte Sicherheit mit Authentifizierung (MD5/SHA) und Verschlüsselung (AES) — Level authPriv. v1/v2c nutzen Klartext-Communities.",
      theoryRef: "snmp-syslog"
    },
    {
      q: "Du bist per SSH verbunden und siehst keine Syslog-Meldungen, obwohl 'logging monitor 7' konfiguriert ist. Was fehlt?",
      options: ["logging console 7", "terminal monitor in der aktuellen Sitzung", "logging buffered", "service timestamps"],
      correct: 1,
      explanation: "Für VTY-Sitzungen (SSH/Telnet) muss zusätzlich 'terminal monitor' im Privileged-Modus eingegeben werden. Console-Sitzungen sehen Meldungen automatisch.",
      theoryRef: "snmp-syslog"
    },
    {
      q: "Was ist der Unterschied zwischen einem SNMP-Trap und einem Inform?",
      options: ["Traps gehen vom NMS zum Agent, Informs umgekehrt", "Informs werden vom NMS bestätigt, Traps nicht", "Traps sind verschlüsselt, Informs nicht", "Es gibt keinen Unterschied"],
      correct: 1,
      explanation: "Beide sind unaufgeforderte Meldungen des Agents an das NMS. Nur Informs werden vom NMS quittiert und sind daher zuverlässig.",
      theoryRef: "snmp-syslog"
    }
  ],
  flashcards: [
    { front: "Syslog Severity 0–7", back: "Emergency, Alert, Critical, Error, Warning, Notification, Informational, Debugging" },
    { front: "Syslog Port", back: "UDP 514" },
    { front: "SNMP Ports", back: "UDP 161 (Get/Set an Agent), UDP 162 (Traps/Informs an NMS)" },
    { front: "MIB / OID", back: "Datenbank der abfragbaren Werte / Adresse eines Werts (1.3.6.1...)" },
    { front: "SNMPv3 Security Levels", back: "noAuthNoPriv · authNoPriv · authPriv (Best Practice)" },
    { front: "Interface up/down Meldung", back: "%LINEPROTO-5-UPDOWN — Level 5 Notification" },
    { front: "Syslog in SSH-Sitzung sehen", back: "terminal monitor (+ logging monitor <level>)" },
    { front: "Trap vs. Inform", back: "Trap = ohne Bestätigung; Inform = NMS quittiert" }
  ]
});

// ---------- 4.7 QoS ----------
registerTopic({
  id: "qos",
  domain: "IP Services",
  domainPct: "10%",
  icon: "🎚️",
  title: "QoS — Quality of Service",
  tags: ["Blueprint 4.7", "PHB", "VoIP"],
  content: `
    <div class="content-section">
      <h3>🎚️ Warum QoS?</h3>
      <p>Bei <strong>Congestion</strong> (Überlast — mehr Traffic als ein Link/Queue verkraftet) verwerfen Geräte Pakete oder verzögern sie. QoS sorgt dafür, dass <strong>wichtiger Traffic bevorzugt</strong> wird. Vier Kennzahlen, die QoS beeinflusst:</p>
      <div class="table-wrap"><table>
        <tr><th>Kennzahl</th><th>Bedeutung</th><th>Ziel für VoIP (Cisco)</th></tr>
        <tr><td><strong>Bandwidth</strong></td><td>Verfügbare Kapazität</td><td>~30–100 kbit/s pro Gespräch</td></tr>
        <tr><td><strong>Delay</strong> (Latenz)</td><td>Laufzeit Ende-zu-Ende</td><td>&lt; 150 ms (one-way)</td></tr>
        <tr><td><strong>Jitter</strong></td><td>Schwankung des Delays</td><td>&lt; 30 ms</td></tr>
        <tr><td><strong>Loss</strong></td><td>Paketverlust</td><td>&lt; 1 %</td></tr>
      </table></div>
      <div class="callout callout-info"><strong>Per-Hop Behavior (PHB)</strong>QoS wird <strong>an jedem Gerät einzeln</strong> angewendet — jeder Hop entscheidet selbst anhand der Markierung im Paket, wie er es behandelt. Das Modell dahinter heißt <strong>DiffServ</strong> (Differentiated Services). Alternative: <em>IntServ</em> (RSVP-Reservierung, kaum genutzt) und <em>Best Effort</em> (kein QoS).</div>
    </div>

    <div class="content-section">
      <h3>🧰 Die QoS-Werkzeuge (Blueprint 4.7)</h3>
      <div class="table-wrap"><table>
        <tr><th>Werkzeug</th><th>Was es tut</th><th>Wo</th></tr>
        <tr><td><strong>Classification</strong></td><td>Traffic in Klassen einteilen — anhand ACL (IP/Port), DSCP/CoS, Interface, <strong>NBAR</strong> (Application Recognition, L7)</td><td>Ingress, möglichst nah an der Quelle</td></tr>
        <tr><td><strong>Marking</strong></td><td>Klasse in den Header schreiben, damit spätere Hops nicht neu klassifizieren müssen: <strong>DSCP</strong> (L3, 6 Bit im IP-ToS-Feld) oder <strong>CoS</strong> (L2, 3 Bit im 802.1Q-Tag)</td><td>Am <strong>Trust Boundary</strong> (Access-Switch / IP-Telefon)</td></tr>
        <tr><td><strong>Queuing</strong></td><td>Pakete in getrennte Ausgangs-Queues stellen und nach Regeln bedienen: <strong>CBWFQ</strong> (Bandbreitengarantie pro Klasse), <strong>LLQ</strong> (CBWFQ + Priority Queue für Voice), FIFO, WFQ</td><td>Egress an jedem Hop</td></tr>
        <tr><td><strong>Congestion Avoidance</strong></td><td>Queue-Überlauf vermeiden, indem <em>vorher</em> gezielt Pakete verworfen werden: <strong>WRED</strong> (Weighted Random Early Detection) — TCP drosselt dann von selbst. Gegenteil: Tail Drop (alles verwerfen, wenn voll → TCP Global Synchronization)</td><td>Egress-Queues</td></tr>
        <tr><td><strong>Policing</strong></td><td>Rate begrenzen — überschüssiger Traffic wird <strong>verworfen</strong> oder <strong>neu markiert</strong> (re-mark). Kein Puffern, keine Verzögerung.</td><td>Ingress, typisch am ISP / Provider Edge</td></tr>
        <tr><td><strong>Shaping</strong></td><td>Rate begrenzen — überschüssiger Traffic wird <strong>gepuffert</strong> und verzögert gesendet (glättet Bursts). Erhöht Delay/Jitter.</td><td>Egress, typisch am Kunden-Router Richtung ISP (unter die Policer-Rate bleiben)</td></tr>
      </table></div>
      <pre><code>Policing:                         Shaping:
Rate ─────────────────            Rate ─────────────────
     ▲   ▄▄  ✂ drop                    ▲   ▄▄
     │  ████▄▄                          │  ████▄▄▄▄▄▄   ← Überschuss wird
     │ ██████████                       │ ████████████     gepuffert &amp; später gesendet
     └──────────────► t                 └──────────────► t</code></pre>
    </div>

    <div class="content-section">
      <h3>🏷️ Markierungswerte, die du kennen musst</h3>
      <div class="table-wrap"><table>
        <tr><th>Traffic</th><th>DSCP (Name)</th><th>DSCP (dezimal)</th><th>CoS (802.1p)</th><th>Behandlung</th></tr>
        <tr><td><strong>Voice (RTP)</strong></td><td><strong>EF</strong> (Expedited Forwarding)</td><td><strong>46</strong></td><td>5</td><td>Priority Queue (LLQ) — minimale Latenz</td></tr>
        <tr><td>Video</td><td>AF41</td><td>34</td><td>4</td><td>Garantierte Bandbreite</td></tr>
        <tr><td>Call Signaling</td><td>CS3</td><td>24</td><td>3</td><td>Garantiert, kleine Bandbreite</td></tr>
        <tr><td>Business-kritische Daten</td><td>AF21 / AF31</td><td>18 / 26</td><td>2 / 3</td><td>Garantierte Bandbreite</td></tr>
        <tr><td>Best Effort</td><td>DF / CS0</td><td>0</td><td>0</td><td>Rest</td></tr>
        <tr><td>Scavenger (unwichtig)</td><td>CS1</td><td>8</td><td>1</td><td>Weniger als Best Effort</td></tr>
        <tr><td>Network Control (Routing)</td><td>CS6</td><td>48</td><td>6</td><td>Höchste Priorität für Protokolle</td></tr>
      </table></div>
      <ul>
        <li><strong>AFxy</strong>: x = Klasse (1–4, höher = besser), y = Drop Precedence (1–3, höher = eher verwerfen). AF41 → DSCP 34 (Formel 8x + 2y).</li>
        <li><strong>CSx</strong> (Class Selector): rückwärtskompatibel zu IP Precedence, DSCP = 8x.</li>
        <li><strong>Trust Boundary</strong>: Der Punkt, ab dem Markierungen vertraut wird — typisch das IP-Telefon (markiert Voice EF, setzt PC-Traffic auf 0) oder der Access-Switch. Niemals PC-Markierungen ungeprüft vertrauen.</li>
      </ul>
    </div>

    <div class="content-section">
      <h3>⚙️ MQC — Modular QoS CLI (Grundmuster)</h3>
      <pre><code><span class="cli-comment"># 1. Klassifizieren</span>
R1(config)# class-map match-any VOICE
R1(config-cmap)# match dscp ef
R1(config-cmap)# match protocol rtp audio       <span class="cli-comment"># NBAR</span>
R1(config)# class-map match-all VIDEO
R1(config-cmap)# match dscp af41

<span class="cli-comment"># 2. Policy: Was passiert mit jeder Klasse?</span>
R1(config)# policy-map WAN-OUT
R1(config-pmap)# class VOICE
R1(config-pmap-c)# priority percent 20          <span class="cli-comment"># LLQ: Priority Queue, max. 20 %</span>
R1(config-pmap)# class VIDEO
R1(config-pmap-c)# bandwidth percent 30         <span class="cli-comment"># CBWFQ: garantierte Bandbreite</span>
R1(config-pmap)# class class-default
R1(config-pmap-c)# fair-queue
R1(config-pmap-c)# random-detect                <span class="cli-comment"># WRED</span>

<span class="cli-comment"># 3. Anwenden (Service Policy) — Richtung beachten</span>
R1(config)# interface gi0/0
R1(config-if)# service-policy output WAN-OUT

<span class="cli-comment"># Shaping auf die ISP-Rate (z.B. 50 Mbit/s), darunter die Queues</span>
R1(config)# policy-map SHAPE-50M
R1(config-pmap)# class class-default
R1(config-pmap-c)# shape average 50000000
R1(config-pmap-c)# service-policy WAN-OUT       <span class="cli-comment"># hierarchisches QoS</span>

<span class="cli-comment"># Verifikation</span>
R1# show policy-map interface gi0/0
R1# show class-map</code></pre>
      <div class="callout callout-tip"><strong>Blueprint-Verb „Explain“</strong>Du musst die Begriffe erklären und zuordnen können (Policing vs. Shaping, Marking vs. Classification, EF = Voice). Detaillierte MQC-Syntax wird selten abgefragt.</div>
    </div>
  `
}, {
  after: "snmp-syslog",
  quiz: [
    {
      q: "Was ist der Hauptunterschied zwischen Policing und Shaping?",
      options: ["Policing puffert überschüssigen Traffic, Shaping verwirft ihn", "Shaping puffert überschüssigen Traffic und sendet ihn verzögert, Policing verwirft oder re-markiert ihn", "Beide verwerfen Traffic gleichermaßen", "Shaping funktioniert nur auf Layer 2"],
      correct: 1,
      explanation: "Shaping glättet Bursts durch Puffern (erhöht Delay). Policing hält die Rate hart ein und verwirft oder markiert überschüssige Pakete neu.",
      theoryRef: "qos"
    },
    {
      q: "Welchen DSCP-Wert verwendet man standardmäßig für Voice-Traffic (RTP)?",
      options: ["AF41 (34)", "CS3 (24)", "EF (46)", "DF (0)"],
      correct: 2,
      explanation: "Voice wird mit EF (Expedited Forwarding, DSCP 46) markiert und in der Priority Queue (LLQ) bedient.",
      theoryRef: "qos"
    },
    {
      q: "Welches Queuing-Verfahren kombiniert garantierte Bandbreite pro Klasse mit einer strikten Priority Queue für latenzempfindlichen Traffic?",
      options: ["FIFO", "WRED", "LLQ", "Tail Drop"],
      correct: 2,
      explanation: "LLQ (Low Latency Queuing) = CBWFQ + eine Priority Queue, die immer zuerst bedient wird (typisch Voice). WRED ist Congestion Avoidance, FIFO eine einfache Queue.",
      theoryRef: "qos"
    },
    {
      q: "Wo werden DSCP und CoS im Frame/Paket transportiert?",
      options: ["DSCP im 802.1Q-Tag, CoS im IP-Header", "DSCP im IP-Header (Layer 3), CoS im 802.1Q-Tag (Layer 2)", "Beide im TCP-Header", "Beide im Ethernet-Header"],
      correct: 1,
      explanation: "DSCP = 6 Bit im IP-ToS/Traffic-Class-Feld (L3, überlebt Routing). CoS = 3 Bit im 802.1Q-VLAN-Tag (L2, nur auf Trunks).",
      theoryRef: "qos"
    },
    {
      q: "Was macht WRED (Weighted Random Early Detection)?",
      options: ["Priorisiert Voice-Pakete", "Verwirft gezielt Pakete, bevor die Queue voll ist, um TCP zum Drosseln zu bewegen", "Begrenzt die Bandbreite einer Klasse", "Markiert Pakete mit DSCP"],
      correct: 1,
      explanation: "WRED ist Congestion Avoidance: Es verwirft bei steigender Queue-Füllung zufällig Pakete (bevorzugt niedrig priorisierte), um Tail Drop und TCP Global Synchronization zu verhindern.",
      theoryRef: "qos"
    },
    {
      q: "Was versteht man unter der 'Trust Boundary' bei QoS?",
      options: ["Die Firewall-Grenze", "Der Punkt im Netz, ab dem den QoS-Markierungen der Pakete vertraut wird", "Die maximale Bandbreite eines Links", "Der Übergang von IPv4 zu IPv6"],
      correct: 1,
      explanation: "Die Trust Boundary liegt typischerweise am IP-Telefon oder Access-Switch. Markierungen von PCs werden davor nicht vertraut und ggf. auf 0 gesetzt.",
      theoryRef: "qos"
    }
  ],
  flashcards: [
    { front: "Voice DSCP", back: "EF = 46 (CoS 5) → LLQ Priority Queue" },
    { front: "Policing vs. Shaping", back: "Policing = verwerfen/re-mark (Ingress, ISP); Shaping = puffern/verzögern (Egress, Kunde)" },
    { front: "Classification vs. Marking", back: "Erkennen und Klasse zuweisen vs. Wert in den Header schreiben (DSCP/CoS)" },
    { front: "LLQ", back: "Low Latency Queuing = CBWFQ + strikte Priority Queue" },
    { front: "WRED", back: "Congestion Avoidance — frühzeitiges, gewichtetes Verwerfen statt Tail Drop" },
    { front: "DSCP vs. CoS", back: "6 Bit im IP-Header (L3) vs. 3 Bit im 802.1Q-Tag (L2)" },
    { front: "VoIP-Grenzwerte", back: "Delay < 150 ms, Jitter < 30 ms, Loss < 1 %" },
    { front: "AF41 als DSCP-Zahl", back: "34 (8·4 + 2·1) — Video" }
  ]
});

// ---------- 4.9 TFTP / FTP ----------
registerTopic({
  id: "tftp-ftp",
  domain: "IP Services",
  domainPct: "10%",
  icon: "📤",
  title: "TFTP & FTP (IOS-Dateien)",
  tags: ["Blueprint 4.9", "Backup", "IOS-Upgrade"],
  content: `
    <div class="content-section">
      <h3>📤 Wofür TFTP und FTP im Netzwerk?</h3>
      <p>Netzwerkgeräte müssen Dateien <strong>übertragen</strong>: Konfigurations-Backups, IOS-Images für Upgrades, Lizenzen, Zertifikate. Dafür nutzen sie TFTP, FTP (und SCP/SFTP).</p>
      <div class="table-wrap"><table>
        <tr><th>Merkmal</th><th>TFTP</th><th>FTP</th></tr>
        <tr><td>Name</td><td>Trivial File Transfer Protocol</td><td>File Transfer Protocol</td></tr>
        <tr><td>Transport</td><td><strong>UDP 69</strong></td><td><strong>TCP 21</strong> (Control) + <strong>TCP 20</strong> (Data, Active Mode) bzw. dynamischer Port (Passive Mode)</td></tr>
        <tr><td>Authentifizierung</td><td><strong>Keine</strong></td><td>Benutzername + Passwort (Klartext!)</td></tr>
        <tr><td>Zuverlässigkeit</td><td>Eigene einfache ACKs pro Block (512 Byte), Lockstep</td><td>TCP — zuverlässig, schnell bei großen Dateien</td></tr>
        <tr><td>Funktionen</td><td>Nur Lesen/Schreiben einer Datei</td><td>Verzeichnisse auflisten, löschen, umbenennen, Rechte</td></tr>
        <tr><td>Verschlüsselung</td><td>Nein</td><td>Nein (FTPS = FTP + TLS; SFTP = SSH-basiert, anderes Protokoll)</td></tr>
        <tr><td>Einsatz</td><td>Kleine Dateien im LAN, Config-Backups, PXE-Boot, Recovery (ROMMON)</td><td>Große IOS-Images, WAN-Übertragung</td></tr>
      </table></div>
      <div class="callout callout-info"><strong>FTP Active vs. Passive</strong><strong>Active</strong>: Server öffnet von Port 20 eine Verbindung <em>zum Client</em> — scheitert oft an Client-Firewalls/NAT. <strong>Passive</strong>: Client öffnet auch die Datenverbindung (Server nennt einen hohen Port) — firewall-freundlich, heute Standard.</div>
    </div>

    <div class="content-section">
      <h3>⚙️ Dateien auf Cisco IOS kopieren</h3>
      <pre><code><span class="cli-comment"># Syntax: copy &lt;quelle&gt; &lt;ziel&gt;</span>

<span class="cli-comment"># Konfig-Backup auf TFTP-Server</span>
R1# copy running-config tftp:
Address or name of remote host []? 10.1.1.200
Destination filename [r1-confg]? R1-backup-2026-09-03.cfg
!!
1234 bytes copied in 0.5 secs

<span class="cli-comment"># Konfig vom TFTP zurückspielen (merge in running-config!)</span>
R1# copy tftp: running-config

<span class="cli-comment"># IOS-Image per FTP holen (Benutzer/Passwort global hinterlegen)</span>
R1(config)# ip ftp username admin
R1(config)# ip ftp password Ftp!Pass
R1(config)# ip ftp passive
R1# copy ftp://10.1.1.200/c2900-universalk9-mz.SPA.157-3.M8.bin flash:

<span class="cli-comment"># Alternativ direkt in der URL</span>
R1# copy ftp://admin:Ftp!Pass@10.1.1.200/image.bin flash:

<span class="cli-comment"># Sicher: SCP (nutzt SSH, TCP 22) — Router als SCP-Server</span>
R1(config)# ip scp server enable
R1# copy scp://admin@10.1.1.200/image.bin flash:

<span class="cli-comment"># Kurzformen</span>
R1# copy run start          <span class="cli-comment"># = write memory</span>
R1# copy start run</code></pre>
    </div>

    <div class="content-section">
      <h3>🔄 IOS-Upgrade — Ablauf</h3>
      <ol>
        <li>Freien Speicher prüfen: <code>show flash:</code> / <code>dir flash:</code></li>
        <li>Image übertragen: <code>copy tftp: flash:</code> oder <code>copy ftp: flash:</code></li>
        <li>Integrität prüfen: <code>verify /md5 flash:image.bin</code> (Hash mit Cisco-Website vergleichen)</li>
        <li>Boot-Image setzen: <code>boot system flash:image.bin</code> (alte Einträge mit <code>no boot system</code> entfernen)</li>
        <li>Speichern: <code>copy run start</code></li>
        <li>Neustart: <code>reload</code> → danach <code>show version</code> prüfen</li>
      </ol>
      <pre><code>R1# show version
Cisco IOS Software, C2900 Software (C2900-UNIVERSALK9-M), Version 15.7(3)M8
...
System image file is "flash0:c2900-universalk9-mz.SPA.157-3.M8.bin"
...
Configuration register is 0x2102        <span class="cli-comment">← 0x2102 = normal; 0x2142 = startup-config ignorieren (Password Recovery)</span></code></pre>
      <div class="callout callout-tip"><strong>Prüfungswissen</strong>TFTP = UDP 69, keine Authentifizierung, für kleine Dateien. FTP = TCP 20/21 mit Login. Bei <code>copy tftp: running-config</code> wird die Konfiguration <strong>zusammengeführt</strong> (merge), bei <code>copy tftp: startup-config</code> <strong>ersetzt</strong>.</div>
    </div>
  `
}, {
  after: "qos",
  quiz: [
    {
      q: "Welchen Port und welches Transportprotokoll nutzt TFTP?",
      options: ["TCP 21", "UDP 69", "TCP 69", "UDP 21"],
      correct: 1,
      explanation: "TFTP nutzt UDP Port 69. FTP nutzt TCP 21 (Control) und TCP 20 (Data).",
      theoryRef: "tftp-ftp"
    },
    {
      q: "Welche Aussage über TFTP im Vergleich zu FTP ist korrekt?",
      options: ["TFTP unterstützt Authentifizierung, FTP nicht", "TFTP nutzt TCP und ist deshalb zuverlässiger", "TFTP hat keine Authentifizierung und minimalen Funktionsumfang, FTP bietet Login und Verzeichnisoperationen", "Beide verschlüsseln die Daten"],
      correct: 2,
      explanation: "TFTP ist bewusst trivial: keine Authentifizierung, nur Lesen/Schreiben, UDP. FTP bietet Login, Verzeichnisbefehle und nutzt TCP.",
      theoryRef: "tftp-ftp"
    },
    {
      q: "Welcher Befehl sichert die aktuelle Konfiguration auf einen TFTP-Server?",
      options: ["copy tftp: running-config", "copy running-config tftp:", "backup config tftp", "write tftp"],
      correct: 1,
      explanation: "Syntax ist 'copy <Quelle> <Ziel>'. Backup = von running-config nach tftp:.",
      theoryRef: "tftp-ftp"
    },
    {
      q: "Welche Ports nutzt FTP im Active Mode?",
      options: ["TCP 20 (Data) und TCP 21 (Control)", "UDP 20 und 21", "TCP 22 und 23", "TCP 69 und 70"],
      correct: 0,
      explanation: "FTP Control läuft über TCP 21, die Datenverbindung im Active Mode über TCP 20 (im Passive Mode über einen dynamischen Port).",
      theoryRef: "tftp-ftp"
    },
    {
      q: "Was passiert bei 'copy tftp: running-config'?",
      options: ["Die running-config wird komplett ersetzt", "Die Datei wird mit der running-config zusammengeführt (merge)", "Der Router startet neu", "Die startup-config wird gelöscht"],
      correct: 1,
      explanation: "Kopieren in die running-config führt zu einem Merge: bestehende Befehle bleiben, neue kommen hinzu. Nur startup-config wird komplett ersetzt.",
      theoryRef: "tftp-ftp"
    }
  ],
  flashcards: [
    { front: "TFTP Port", back: "UDP 69 — keine Authentifizierung" },
    { front: "FTP Ports", back: "TCP 21 Control, TCP 20 Data (Active Mode)" },
    { front: "Config-Backup auf TFTP", back: "copy running-config tftp:" },
    { front: "copy tftp: running-config", back: "Merge (zusammenführen), nicht ersetzen" },
    { front: "IOS-Image prüfen", back: "verify /md5 flash:image.bin" },
    { front: "Config-Register 0x2142", back: "Startup-Config beim Boot ignorieren (Password Recovery); normal = 0x2102" },
    { front: "Sichere Alternative zu FTP/TFTP", back: "SCP (über SSH, TCP 22) — ip scp server enable" }
  ]
});

// Zusätzliche Fragen zu bestehenden Themen
extendTopic("dhcp", {
  quiz: [
    {
      q: "Ein DHCP-Server steht in einem anderen Subnetz als die Clients. Welcher Befehl auf dem Router-Interface der Clients löst das Problem?",
      options: ["ip dhcp pool", "ip helper-address <Server-IP>", "ip dhcp relay enable", "service dhcp forward"],
      correct: 1,
      explanation: "'ip helper-address' macht das Interface zum DHCP-Relay: Broadcast-Discover-Pakete werden als Unicast an den Server weitergeleitet (mit dem GIADDR-Feld = Interface-IP, damit der Server den richtigen Pool wählt).",
      theoryRef: "dhcp"
    },
    {
      q: "Welche Nachricht sendet der Client, um ein DHCP-Angebot anzunehmen?",
      options: ["DISCOVER", "OFFER", "REQUEST", "ACK"],
      correct: 2,
      explanation: "DORA: Discover (Client, Broadcast) → Offer (Server) → Request (Client, akzeptiert Angebot) → Ack (Server bestätigt).",
      theoryRef: "dhcp"
    },
    {
      q: "Mit welchem Befehl bezieht ein Router-Interface selbst eine IP-Adresse per DHCP?",
      options: ["ip address auto", "ip address dhcp", "ip dhcp client", "dhcp enable"],
      correct: 1,
      explanation: "'ip address dhcp' im Interface-Modus macht das Interface zum DHCP-Client, typisch am WAN-Port zum ISP.",
      theoryRef: "dhcp"
    }
  ],
  flashcards: [
    { front: "DORA", back: "Discover → Offer → Request → Acknowledge" },
    { front: "DHCP Relay", back: "ip helper-address <server> auf dem Client-seitigen Interface" },
    { front: "Router-Interface als DHCP-Client", back: "ip address dhcp" },
    { front: "ip dhcp excluded-address", back: "Adressen vom Pool ausnehmen (Gateway, Server, Drucker)" }
  ]
});

extendTopic("nat", {
  quiz: [
    {
      q: "Was bedeutet 'Inside Global' in der NAT-Terminologie?",
      options: ["Die private IP eines internen Hosts", "Die öffentliche IP, unter der ein interner Host im Internet erscheint", "Die IP eines externen Servers", "Die IP des NAT-Routers im LAN"],
      correct: 1,
      explanation: "Inside Local = private IP intern; Inside Global = öffentliche IP nach der Übersetzung; Outside Global = IP des Ziels im Internet.",
      theoryRef: "nat"
    },
    {
      q: "Welcher NAT-Typ übersetzt viele private Adressen auf eine öffentliche Adresse anhand von Port-Nummern?",
      options: ["Static NAT", "Dynamic NAT", "PAT (NAT Overload)", "Reverse NAT"],
      correct: 2,
      explanation: "PAT / NAT Overload nutzt Quellports, um viele interne Hosts über eine (oder wenige) öffentliche IP zu multiplexen — Standard in fast jedem Heim- und Firmennetz.",
      theoryRef: "nat"
    },
    {
      q: "Welcher Befehl zeigt die aktiven NAT-Übersetzungen?",
      options: ["show ip nat statistics", "show ip nat translations", "show nat table", "show ip route nat"],
      correct: 1,
      explanation: "'show ip nat translations' listet Inside/Outside Local/Global. 'show ip nat statistics' zeigt Zähler, Interfaces und Pools.",
      theoryRef: "nat"
    }
  ],
  flashcards: [
    { front: "Inside Local / Inside Global", back: "Private IP des internen Hosts / öffentliche IP nach Übersetzung" },
    { front: "PAT", back: "Port Address Translation (Overload) — viele private IPs → eine öffentliche, unterschieden per Port" },
    { front: "NAT-Interfaces markieren", back: "ip nat inside / ip nat outside" },
    { front: "NAT-Übersetzungen anzeigen", back: "show ip nat translations · show ip nat statistics" }
  ]
});
