// ===== CCNA Knowledge Base — Content Data =====

const TOPICS = [
  // ============ DOMAIN 1: NETWORK FUNDAMENTALS ============
  {
    id: "osi-model",
    domain: "Network Fundamentals",
    domainPct: "20%",
    icon: "🔗",
    title: "OSI-Modell",
    tags: ["Theorie", "Grundlagen"],
    content: `
      <div class="content-section">
        <h3>🔗 Das OSI-Referenzmodell</h3>
        <p>Das <strong>OSI-Modell</strong> (Open Systems Interconnection) ist ein konzeptionelles 7-Schichten-Modell, das beschreibt, wie Netzwerkkommunikation funktioniert. Jede Schicht hat definierte Aufgaben und kommuniziert nur mit den benachbarten Schichten.</p>
        <div class="callout callout-tip"><strong>Merkhilfe (oben → unten)</strong>All People Seem To Need Data Processing<br><em>Application · Presentation · Session · Transport · Network · Data Link · Physical</em></div>
        <div class="table-wrap"><table>
          <tr><th>#</th><th>Schicht</th><th>Englisch</th><th>PDU</th><th>Protokolle / Geräte</th></tr>
          <tr><td><strong>7</strong></td><td>Anwendung</td><td>Application</td><td>Data</td><td>HTTP, FTP, DNS, DHCP, SMTP</td></tr>
          <tr><td><strong>6</strong></td><td>Darstellung</td><td>Presentation</td><td>Data</td><td>SSL/TLS, JPEG, ASCII, Verschlüsselung</td></tr>
          <tr><td><strong>5</strong></td><td>Sitzung</td><td>Session</td><td>Data</td><td>NetBIOS, RPC, Sitzungsaufbau/-abbau</td></tr>
          <tr><td><strong>4</strong></td><td>Transport</td><td>Transport</td><td>Segment</td><td>TCP, UDP</td></tr>
          <tr><td><strong>3</strong></td><td>Netzwerk</td><td>Network</td><td>Paket</td><td>IP, ICMP, Router</td></tr>
          <tr><td><strong>2</strong></td><td>Datensicherung</td><td>Data Link</td><td>Frame</td><td>Ethernet, MAC, Switch, Bridge</td></tr>
          <tr><td><strong>1</strong></td><td>Bitübertragung</td><td>Physical</td><td>Bit</td><td>Kabel, Hub, NIC, Signale</td></tr>
        </table></div>
      </div>

      <div class="content-section">
        <h3>📦 Encapsulation & Decapsulation</h3>
        <p>Beim Senden wird an jeder Schicht ein Header (und ggf. Trailer) hinzugefügt — das nennt sich <strong>Encapsulation</strong>. Beim Empfangen wird dieser Prozess umgekehrt (<strong>Decapsulation</strong>).</p>
        <ul>
          <li><strong>Schicht 7–5:</strong> Daten werden als „Data" weitergegeben</li>
          <li><strong>Schicht 4:</strong> TCP/UDP-Header wird hinzugefügt → <em>Segment</em></li>
          <li><strong>Schicht 3:</strong> IP-Header wird hinzugefügt → <em>Paket</em></li>
          <li><strong>Schicht 2:</strong> Ethernet-Header + Trailer → <em>Frame</em></li>
          <li><strong>Schicht 1:</strong> Umwandlung in Bits/elektrische Signale</li>
        </ul>
        <div class="callout callout-info"><strong>Wichtig für die Prüfung</strong>Switches arbeiten auf Schicht 2 (lesen MAC-Adressen), Router auf Schicht 3 (lesen IP-Adressen), Hubs auf Schicht 1 (reines Signal-Repeating).</div>
      </div>

      <div class="content-section">
        <h3>🔄 TCP/IP-Modell (Vergleich)</h3>
        <div class="table-wrap"><table>
          <tr><th>TCP/IP-Schicht</th><th>OSI-Entsprechung</th><th>Protokolle</th></tr>
          <tr><td>Application</td><td>7 + 6 + 5</td><td>HTTP, HTTPS, FTP, SSH, DNS, DHCP</td></tr>
          <tr><td>Transport</td><td>4</td><td>TCP, UDP</td></tr>
          <tr><td>Internet</td><td>3</td><td>IP, ICMP, ARP</td></tr>
          <tr><td>Network Access</td><td>2 + 1</td><td>Ethernet, Wi-Fi, PPP</td></tr>
        </table></div>
      </div>
    `
  },
  {
    id: "tcp-udp",
    domain: "Network Fundamentals",
    domainPct: "20%",
    icon: "📡",
    title: "TCP vs. UDP",
    tags: ["Transport", "Protokolle"],
    content: `
      <div class="content-section">
        <h3>📡 TCP — Transmission Control Protocol</h3>
        <p>TCP ist <strong>verbindungsorientiert</strong> und zuverlässig. Vor der Datenübertragung wird eine Verbindung via <strong>Three-Way-Handshake</strong> aufgebaut.</p>
        <h4>Three-Way-Handshake</h4>
        <pre><code><span class="cli-comment"># Client                    Server</span>
SYN        ──────────────►
           ◄────────────── SYN-ACK
ACK        ──────────────►
<span class="cli-comment"># Verbindung aufgebaut — Datenaustausch beginnt</span></code></pre>
        <ul>
          <li>Sequenznummern & ACKs sichern Reihenfolge</li>
          <li>Flow Control via Sliding Window</li>
          <li>Verbindungsabbau: FIN → FIN-ACK → FIN → ACK (4-Way)</li>
        </ul>
        <div class="callout callout-tip"><strong>TCP-Ports merken</strong>HTTP=80, HTTPS=443, FTP=21 (Control)/20 (Data), SSH=22, Telnet=23, DNS=53, DHCP=67/68, SMTP=25, POP3=110, IMAP=143</div>
      </div>

      <div class="content-section">
        <h3>⚡ UDP — User Datagram Protocol</h3>
        <p>UDP ist <strong>verbindungslos</strong> und unzuverlässig — kein Handshake, keine Bestätigung. Dafür sehr schnell und ressourcenschonend.</p>
        <div class="table-wrap"><table>
          <tr><th>Merkmal</th><th>TCP</th><th>UDP</th></tr>
          <tr><td>Verbindung</td><td>Verbindungsorientiert</td><td>Verbindungslos</td></tr>
          <tr><td>Zuverlässigkeit</td><td>Garantiert (ACK)</td><td>Nicht garantiert</td></tr>
          <tr><td>Reihenfolge</td><td>Garantiert</td><td>Nicht garantiert</td></tr>
          <tr><td>Overhead</td><td>Hoch (Header 20 Byte)</td><td>Gering (Header 8 Byte)</td></tr>
          <tr><td>Geschwindigkeit</td><td>Langsamer</td><td>Schneller</td></tr>
          <tr><td>Verwendung</td><td>HTTP, FTP, SSH, E-Mail</td><td>DNS, DHCP, VoIP, Video-Stream, TFTP</td></tr>
        </table></div>
      </div>

      <div class="content-section">
        <h3>🔢 Wichtige Port-Nummern</h3>
        <div class="table-wrap"><table>
          <tr><th>Port</th><th>Protokoll</th><th>Transport</th><th>Beschreibung</th></tr>
          <tr><td>20/21</td><td>FTP</td><td>TCP</td><td>File Transfer (Data/Control)</td></tr>
          <tr><td>22</td><td>SSH</td><td>TCP</td><td>Secure Shell</td></tr>
          <tr><td>23</td><td>Telnet</td><td>TCP</td><td>Unsichere Remote-Verwaltung</td></tr>
          <tr><td>25</td><td>SMTP</td><td>TCP</td><td>E-Mail senden</td></tr>
          <tr><td>53</td><td>DNS</td><td>UDP/TCP</td><td>Name Resolution</td></tr>
          <tr><td>67/68</td><td>DHCP</td><td>UDP</td><td>IP-Adressvergabe</td></tr>
          <tr><td>80</td><td>HTTP</td><td>TCP</td><td>Web (unverschlüsselt)</td></tr>
          <tr><td>110</td><td>POP3</td><td>TCP</td><td>E-Mail empfangen</td></tr>
          <tr><td>161/162</td><td>SNMP</td><td>UDP</td><td>Netzwerk-Management</td></tr>
          <tr><td>443</td><td>HTTPS</td><td>TCP</td><td>Web (verschlüsselt)</td></tr>
          <tr><td>514</td><td>Syslog</td><td>UDP</td><td>Logging</td></tr>
        </table></div>
      </div>
    `
  },
  {
    id: "ipv4",
    domain: "Network Fundamentals",
    domainPct: "20%",
    icon: "🌐",
    title: "IPv4 Adressierung",
    tags: ["IP", "Adressierung"],
    content: `
      <div class="content-section">
        <h3>🌐 IPv4 Grundlagen</h3>
        <p>Eine IPv4-Adresse ist <strong>32 Bit</strong> lang, in 4 Oktette aufgeteilt und wird dezimal dargestellt (z.B. <code>192.168.1.1</code>). Sie besteht aus <strong>Netzwerkanteil</strong> und <strong>Hostanteil</strong>.</p>
        <div class="table-wrap"><table>
          <tr><th>Klasse</th><th>Bereich (erstes Oktett)</th><th>Standard-Maske</th><th>Netzwerke</th><th>Hosts/Netz</th></tr>
          <tr><td>A</td><td>1–126</td><td>/8 (255.0.0.0)</td><td>126</td><td>16.777.214</td></tr>
          <tr><td>B</td><td>128–191</td><td>/16 (255.255.0.0)</td><td>16.384</td><td>65.534</td></tr>
          <tr><td>C</td><td>192–223</td><td>/24 (255.255.255.0)</td><td>2.097.152</td><td>254</td></tr>
          <tr><td>D</td><td>224–239</td><td>–</td><td>Multicast</td><td>–</td></tr>
          <tr><td>E</td><td>240–255</td><td>–</td><td>Reserviert</td><td>–</td></tr>
        </table></div>
        <div class="callout callout-warn"><strong>127.x.x.x</strong> ist Loopback (localhost) — keine Klasse A-Hosts!</div>
      </div>

      <div class="content-section">
        <h3>🔒 Private IP-Adressen (RFC 1918)</h3>
        <div class="table-wrap"><table>
          <tr><th>Bereich</th><th>CIDR</th><th>Klasse</th></tr>
          <tr><td>10.0.0.0 – 10.255.255.255</td><td>10.0.0.0/8</td><td>A</td></tr>
          <tr><td>172.16.0.0 – 172.31.255.255</td><td>172.16.0.0/12</td><td>B</td></tr>
          <tr><td>192.168.0.0 – 192.168.255.255</td><td>192.168.0.0/16</td><td>C</td></tr>
        </table></div>
        <p>Private Adressen sind im Internet <strong>nicht routebar</strong> — NAT ist erforderlich.</p>
      </div>

      <div class="content-section">
        <h3>🧮 Subnetting — Schritt für Schritt</h3>
        <p>Subnetting teilt ein Netzwerk in kleinere Teilnetze auf. Die <strong>Subnetzmaske</strong> legt fest, welcher Teil Netzwerk und welcher Host ist.</p>
        <h4>Formel</h4>
        <ul>
          <li>Anzahl Subnetze: <code>2^n</code> (n = geliehene Bits)</li>
          <li>Anzahl Hosts/Subnetz: <code>2^h - 2</code> (h = Host-Bits; -2 für Netz- und Broadcast-Adresse)</li>
          <li>Subnetz-Increment: <code>256 - letztes Oktett der Maske</code></li>
        </ul>
        <h4>Beispiel: 192.168.1.0/26</h4>
        <pre><code>Maske:        /26 = 255.255.255.192 = 11111111.11111111.11111111.11000000
Host-Bits:    6   → 2^6 - 2 = 62 Hosts pro Subnetz
Subnetze:     4   → 2^2 = 4 Subnetze
Increment:    256 - 192 = 64

Subnetz 0:   192.168.1.0   – 192.168.1.63   (Host: .1 – .62,   BC: .63)
Subnetz 1:   192.168.1.64  – 192.168.1.127  (Host: .65 – .126, BC: .127)
Subnetz 2:   192.168.1.128 – 192.168.1.191  (Host: .129 – .190, BC: .191)
Subnetz 3:   192.168.1.192 – 192.168.1.255  (Host: .193 – .254, BC: .255)</code></pre>
        <div class="callout callout-tip"><strong>Cheat-Sheet CIDR</strong>/24=256 hosts · /25=128 · /26=64 · /27=32 · /28=16 · /29=8 · /30=4 (2 Hosts) · /31=2 (P2P) · /32=1 (Host)</div>
      </div>
    `
  },
  {
    id: "ipv6",
    domain: "Network Fundamentals",
    domainPct: "20%",
    icon: "🔵",
    title: "IPv6 Grundlagen",
    tags: ["IP", "IPv6"],
    content: `
      <div class="content-section">
        <h3>🔵 IPv6 Überblick</h3>
        <p>IPv6 verwendet <strong>128-Bit-Adressen</strong> (gegenüber 32 Bit bei IPv4), dargestellt als 8 Gruppen von je 4 Hex-Ziffern, getrennt durch <code>:</code>.</p>
        <pre><code>Vollständig:  2001:0DB8:0000:0000:0000:0000:0000:0001
Verkürzt:     2001:DB8::1        (führende Nullen weglassen, :: = aufeinanderfolgende 0-Gruppen)</code></pre>
        <h4>Verkürzungsregeln</h4>
        <ul>
          <li>Führende Nullen in jeder Gruppe weglassen: <code>0DB8</code> → <code>DB8</code></li>
          <li><code>::</code> ersetzt eine oder mehrere aufeinanderfolgende Gruppen aus nur Nullen — <strong>nur einmal</strong> pro Adresse!</li>
        </ul>
      </div>

      <div class="content-section">
        <h3>📋 IPv6 Adresstypen</h3>
        <div class="table-wrap"><table>
          <tr><th>Typ</th><th>Präfix</th><th>Beschreibung</th></tr>
          <tr><td>Global Unicast</td><td>2000::/3</td><td>Öffentlich routebar (wie IPv4 public)</td></tr>
          <tr><td>Link-Local</td><td>FE80::/10</td><td>Nur im lokalen Segment, automatisch konfiguriert</td></tr>
          <tr><td>Unique Local</td><td>FC00::/7</td><td>Privat (wie RFC-1918), nicht routebar</td></tr>
          <tr><td>Multicast</td><td>FF00::/8</td><td>Gruppe von Empfängern (ersetzt Broadcast)</td></tr>
          <tr><td>Loopback</td><td>::1/128</td><td>Localhost (entspricht 127.0.0.1)</td></tr>
          <tr><td>Unspecified</td><td>::/128</td><td>Nicht zugewiesen (wie 0.0.0.0)</td></tr>
          <tr><td>Anycast</td><td>(normale Unicast-Adresse)</td><td>Dieselbe Adresse auf mehreren Geräten — Paket geht zum <em>nächsten</em> (Routing-Metrik). Mit <code>ipv6 address ... anycast</code> konfiguriert.</td></tr>
          <tr><td>Solicited-Node Multicast</td><td>FF02::1:FF00:0/104</td><td>Wird für NDP (Ersatz für ARP) genutzt — die letzten 24 Bit der Unicast-Adresse werden angehängt</td></tr>
        </table></div>
        <h4>Wichtige Multicast-Gruppen</h4>
        <ul>
          <li><code>FF02::1</code> — alle Nodes im Link (entspricht Broadcast)</li>
          <li><code>FF02::2</code> — alle Router im Link</li>
          <li><code>FF02::5</code> / <code>FF02::6</code> — OSPFv3 (alle Router / DR-BDR)</li>
        </ul>
        <div class="callout callout-info"><strong>Kein Broadcast in IPv6</strong>IPv6 kennt keinen Broadcast. ARP wird durch <strong>NDP</strong> (Neighbor Discovery Protocol, ICMPv6) ersetzt: Neighbor Solicitation / Neighbor Advertisement (Adressauflösung) und Router Solicitation / Router Advertisement (Gateway &amp; Präfix-Info für SLAAC).</div>
      </div>

      <div class="content-section">
        <h3>🧮 Modified EUI-64 — Schritt für Schritt</h3>
        <p>Aus einer 48-Bit-MAC wird eine 64-Bit-Interface-ID:</p>
        <pre><code>MAC-Adresse:       00:1A:2B:3C:4D:5E
1. Teilen:         001A2B | 3C4D5E
2. FFFE einfügen:  001A2B FFFE 3C4D5E
3. 7. Bit kippen:  00 = 0000 0000 → 0000 0010 = 02
Interface-ID:      021A:2BFF:FE3C:4D5E
Adresse:           2001:DB8:1:1:021A:2BFF:FE3C:4D5E/64</code></pre>
        <div class="callout callout-tip"><strong>Merkhilfe 7. Bit</strong>Erstes Byte in Binär schreiben, das 7. Bit von links (U/L-Bit) invertieren. 00→02, 02→00, 08→0A, 0C→0E, 10→12, 3C→3E.</div>
        <pre><code>Router(config-if)# ipv6 address 2001:DB8:1:1::/64 eui-64
Router(config-if)# ipv6 enable                       <span class="cli-comment"># nur Link-Local erzeugen</span>
Router# show ipv6 interface gi0/0</code></pre>
      </div>

      <div class="content-section">
        <h3>⚙️ IPv6 Konfiguration (IOS)</h3>
        <pre><code><span class="cli-comment"># IPv6 global aktivieren</span>
Router(config)# ipv6 unicast-routing

<span class="cli-comment"># Adresse auf Interface setzen</span>
Router(config-if)# ipv6 address 2001:DB8:1:1::1/64

<span class="cli-comment"># SLAAC (Stateless Address Autoconfiguration)</span>
Router(config-if)# ipv6 address autoconfig

<span class="cli-comment"># Link-Local anzeigen</span>
Router# show ipv6 interface brief</code></pre>
        <div class="callout callout-info"><strong>EUI-64</strong>Bei EUI-64 wird die MAC-Adresse (48 Bit) durch Einfügen von FFFE in der Mitte und Invertieren des 7. Bits auf 64 Bit erweitert → Interface-ID der IPv6-Adresse.</div>
      </div>
    `
  },

  // ============ DOMAIN 2: NETWORK ACCESS ============
  {
    id: "vlans",
    domain: "Network Access",
    domainPct: "20%",
    icon: "🏷️",
    title: "VLANs",
    tags: ["Switching", "Layer 2"],
    content: `
      <div class="content-section">
        <h3>🏷️ VLANs — Virtual Local Area Networks</h3>
        <p>Ein VLAN ist ein <strong>logisch getrenntes Netzwerksegment</strong> auf einem oder mehreren Switches. Geräte im gleichen VLAN kommunizieren direkt; zwischen VLANs ist ein Router (oder L3-Switch) nötig.</p>
        <div class="callout callout-tip"><strong>Vorteile</strong>Sicherheit (Trennung), Performance (kleinere Broadcast-Domänen), Flexibilität (unabhängig von physischer Position)</div>
        <h4>VLAN-Typen</h4>
        <ul>
          <li><strong>Default VLAN:</strong> VLAN 1 — alle Ports sind standardmäßig hier. Sollte aus Sicherheitsgründen umbenannt/nicht genutzt werden.</li>
          <li><strong>Data VLAN:</strong> Für User-Traffic</li>
          <li><strong>Voice VLAN:</strong> Für VoIP-Traffic (priorisiert)</li>
          <li><strong>Management VLAN:</strong> Für Switch-Verwaltung (SVI)</li>
          <li><strong>Native VLAN:</strong> Ungetaggter Traffic auf Trunk-Links (Standard: VLAN 1)</li>
        </ul>
      </div>

      <div class="content-section">
        <h3>⚙️ VLAN Konfiguration</h3>
        <pre><code><span class="cli-comment"># VLAN erstellen</span>
Switch(config)# vlan 10
Switch(config-vlan)# name Buchhaltung
Switch(config-vlan)# exit

<span class="cli-comment"># Access-Port zuweisen</span>
Switch(config)# interface fa0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10

<span class="cli-comment"># Voice VLAN</span>
Switch(config-if)# switchport voice vlan 20

<span class="cli-comment"># Trunk-Port konfigurieren</span>
Switch(config)# interface gi0/1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk native vlan 99
Switch(config-if)# switchport trunk allowed vlan 10,20,30

<span class="cli-comment"># Verifikation</span>
Switch# show vlan brief
Switch# show interfaces trunk</code></pre>
      </div>

      <div class="content-section">
        <h3>🔗 Inter-VLAN Routing</h3>
        <p>Drei Methoden für Routing zwischen VLANs:</p>
        <ol>
          <li><strong>Legacy:</strong> Physischer Router mit einem Interface pro VLAN</li>
          <li><strong>Router-on-a-Stick:</strong> Ein physisches Interface, mehrere Subinterfaces (je VLAN)</li>
          <li><strong>L3-Switch (SVI):</strong> Switch mit IP-Routing — empfohlen</li>
        </ol>
        <pre><code><span class="cli-comment"># Router-on-a-Stick (Subinterfaces)</span>
Router(config)# interface gi0/0.10
Router(config-subif)# encapsulation dot1Q 10
Router(config-subif)# ip address 192.168.10.1 255.255.255.0

Router(config)# interface gi0/0.20
Router(config-subif)# encapsulation dot1Q 20
Router(config-subif)# ip address 192.168.20.1 255.255.255.0

<span class="cli-comment"># L3-Switch SVI</span>
Switch(config)# ip routing
Switch(config)# interface vlan 10
Switch(config-if)# ip address 192.168.10.1 255.255.255.0
Switch(config-if)# no shutdown</code></pre>
      </div>
    `
  },
  {
    id: "stp",
    domain: "Network Access",
    domainPct: "20%",
    icon: "🌲",
    title: "Spanning Tree Protocol",
    tags: ["Switching", "STP", "Redundanz"],
    content: `
      <div class="content-section">
        <h3>🌲 STP — Warum wird es gebraucht?</h3>
        <p>In redundanten Switch-Topologien entstehen <strong>Layer-2-Schleifen</strong> (Broadcast-Storms). STP (IEEE 802.1D) verhindert Loops, indem bestimmte Ports blockiert werden.</p>
        <h4>STP Port-Zustände (802.1D)</h4>
        <div class="table-wrap"><table>
          <tr><th>Zustand</th><th>Dauer</th><th>Beschreibung</th></tr>
          <tr><td>Blocking</td><td>–</td><td>Empfängt BPDUs, leitet keinen Traffic weiter</td></tr>
          <tr><td>Listening</td><td>15 s</td><td>Sendet/empfängt BPDUs, bestimmt Root</td></tr>
          <tr><td>Learning</td><td>15 s</td><td>Lernt MAC-Adressen, kein Forwarding</td></tr>
          <tr><td>Forwarding</td><td>–</td><td>Leitet Traffic weiter (normaler Betrieb)</td></tr>
          <tr><td>Disabled</td><td>–</td><td>Administrativ deaktiviert</td></tr>
        </table></div>
        <div class="callout callout-warn"><strong>Konvergenzzeit 802.1D</strong>Bis zu 50 Sekunden! Deshalb wird heute RSTP (802.1w) verwendet: Konvergenz in &lt;1 Sekunde.</div>
      </div>

      <div class="content-section">
        <h3>👑 Root Bridge Wahl</h3>
        <p>Der Switch mit der <strong>niedrigsten Bridge-ID</strong> wird Root Bridge. Bridge-ID = Priority (2 Byte) + MAC-Adresse (6 Byte).</p>
        <ul>
          <li>Standard-Priority: <strong>32768</strong> (+ VLAN-ID bei PVST+)</li>
          <li>Priority muss Vielfaches von 4096 sein</li>
          <li>Bei gleicher Priority gewinnt die <strong>niedrigere MAC-Adresse</strong></li>
        </ul>
        <pre><code><span class="cli-comment"># Root Bridge manuell setzen</span>
Switch(config)# spanning-tree vlan 1 priority 4096
<span class="cli-comment"># Oder mit Macro:</span>
Switch(config)# spanning-tree vlan 1 root primary
Switch(config)# spanning-tree vlan 1 root secondary

<span class="cli-comment"># Verifikation</span>
Switch# show spanning-tree vlan 1
Switch# show spanning-tree summary</code></pre>
      </div>

      <div class="content-section">
        <h3>⚡ RSTP & PortFast</h3>
        <p><strong>RSTP (802.1w)</strong> — Rapid STP: Konvergenz in Millisekunden durch neue Port-Rollen und direkten Austausch mit Nachbar-Switches.</p>
        <p><strong>PortFast:</strong> Überspringt Listening/Learning-Phase → Port sofort im Forwarding-Zustand. <strong>Nur für Access-Ports!</strong></p>
        <p><strong>BPDU Guard:</strong> Deaktiviert Port, wenn BPDU empfangen wird (schützt vor unbeabsichtigten Switches).</p>
        <pre><code><span class="cli-comment"># RSTP aktivieren (Cisco Catalyst)</span>
Switch(config)# spanning-tree mode rapid-pvst

<span class="cli-comment"># PortFast + BPDU Guard auf Access-Port</span>
Switch(config-if)# spanning-tree portfast
Switch(config-if)# spanning-tree bpduguard enable

<span class="cli-comment"># Global für alle Access-Ports</span>
Switch(config)# spanning-tree portfast default
Switch(config)# spanning-tree portfast bpduguard default</code></pre>
      </div>

      <div class="content-section">
        <h3>🧭 Rapid PVST+ — Port-Rollen &amp; Zustände</h3>
        <p>Cisco-Switches nutzen standardmäßig <strong>PVST+</strong> (eine STP-Instanz pro VLAN). <strong>Rapid PVST+</strong> kombiniert RSTP (802.1w) mit dem Per-VLAN-Ansatz. Prüfungsrelevant sind vor allem die Port-Rollen und die reduzierten Zustände.</p>
        <div class="table-wrap"><table>
          <tr><th>Rolle</th><th>Beschreibung</th></tr>
          <tr><td><strong>Root Port</strong></td><td>Bester Pfad eines Non-Root-Switches zur Root Bridge (niedrigste Root Path Cost)</td></tr>
          <tr><td><strong>Designated Port</strong></td><td>Pro Segment genau ein Port, der Traffic Richtung Root weiterleitet (alle Ports der Root Bridge sind Designated)</td></tr>
          <tr><td><strong>Alternate Port</strong></td><td>Backup zum Root Port (empfängt bessere BPDUs von einem anderen Switch) — blockiert</td></tr>
          <tr><td><strong>Backup Port</strong></td><td>Backup zu einem Designated Port auf demselben Segment (nur bei Hubs / Shared Media) — blockiert</td></tr>
        </table></div>
        <div class="table-wrap"><table>
          <tr><th>802.1D (STP)</th><th>802.1w (RSTP)</th><th>Forwarding?</th><th>Lernt MACs?</th></tr>
          <tr><td>Disabled</td><td>Discarding</td><td>Nein</td><td>Nein</td></tr>
          <tr><td>Blocking</td><td>Discarding</td><td>Nein</td><td>Nein</td></tr>
          <tr><td>Listening</td><td>Discarding</td><td>Nein</td><td>Nein</td></tr>
          <tr><td>Learning</td><td>Learning</td><td>Nein</td><td>Ja</td></tr>
          <tr><td>Forwarding</td><td>Forwarding</td><td>Ja</td><td>Ja</td></tr>
        </table></div>
        <h4>Root-Bridge-Wahl und Tie-Breaker (Reihenfolge merken!)</h4>
        <ol>
          <li>Niedrigste <strong>Bridge-ID</strong> → Root Bridge</li>
          <li>Niedrigste <strong>Root Path Cost</strong> → Root Port</li>
          <li>Niedrigste <strong>Sender Bridge-ID</strong></li>
          <li>Niedrigste <strong>Sender Port-ID</strong> (Priority + Portnummer)</li>
        </ol>
        <div class="table-wrap"><table>
          <tr><th>Link-Speed</th><th>STP Cost (klassisch)</th></tr>
          <tr><td>10 Mbit/s</td><td>100</td></tr>
          <tr><td>100 Mbit/s</td><td>19</td></tr>
          <tr><td>1 Gbit/s</td><td>4</td></tr>
          <tr><td>10 Gbit/s</td><td>2</td></tr>
        </table></div>
      </div>

      <div class="content-section">
        <h3>🛡️ STP-Schutzmechanismen (Blueprint 2.5.d)</h3>
        <div class="table-wrap"><table>
          <tr><th>Feature</th><th>Wo?</th><th>Was passiert?</th><th>Schützt vor</th></tr>
          <tr><td><strong>PortFast</strong></td><td>Access-Ports</td><td>Sofort Forwarding, kein Listening/Learning</td><td>Langsamer Konvergenz für Endgeräte</td></tr>
          <tr><td><strong>BPDU Guard</strong></td><td>Access-Ports (mit PortFast)</td><td>Port wird <em>err-disabled</em>, sobald eine BPDU eintrifft</td><td>Unbefugt angeschlossenen Switches</td></tr>
          <tr><td><strong>BPDU Filter</strong></td><td>Access-Ports</td><td>Sendet/empfängt keine BPDUs (Port ist „STP-blind“)</td><td>Unnötigen BPDUs zu Endgeräten — Vorsicht: Loop-Gefahr</td></tr>
          <tr><td><strong>Root Guard</strong></td><td>Designated Ports Richtung Access-Layer</td><td>Empfängt Port eine <em>bessere</em> BPDU → Zustand „root-inconsistent“ (blockiert)</td><td>Fremdem Switch, der Root Bridge werden will</td></tr>
          <tr><td><strong>Loop Guard</strong></td><td>Root-/Alternate-Ports</td><td>Bleiben BPDUs plötzlich aus → Port wird „loop-inconsistent“ statt Forwarding</td><td>Unidirektionalen Link-Fehlern (Loop-Bildung)</td></tr>
        </table></div>
        <pre><code><span class="cli-comment"># Root Guard auf einem Uplink zum Access-Switch</span>
Switch(config-if)# spanning-tree guard root

<span class="cli-comment"># Loop Guard (interface oder global)</span>
Switch(config-if)# spanning-tree guard loop
Switch(config)# spanning-tree loopguard default

<span class="cli-comment"># BPDU Filter (Vorsicht!)</span>
Switch(config-if)# spanning-tree bpdufilter enable

<span class="cli-comment"># Verifikation</span>
Switch# show spanning-tree inconsistentports
Switch# show spanning-tree interface gi0/1 detail</code></pre>
        <div class="callout callout-tip"><strong>Merkhilfe</strong>BPDU Guard = „Ich erwarte KEINE BPDUs“ (Endgeräte-Port). Root Guard = „Ich erwarte BPDUs, aber keine BESSEREN als meine“ (Richtung Downstream). Loop Guard = „Ich erwarte BPDUs — wenn sie ausbleiben, traue ich dem Link nicht“.</div>
      </div>
    `
  },
  {
    id: "etherchannel",
    domain: "Network Access",
    domainPct: "20%",
    icon: "⚡",
    title: "EtherChannel",
    tags: ["Switching", "Aggregation"],
    content: `
      <div class="content-section">
        <h3>⚡ EtherChannel — Link Aggregation</h3>
        <p>EtherChannel bündelt mehrere physische Links zu einem <strong>logischen Link</strong>. Vorteile: mehr Bandbreite + Redundanz. STP sieht den Kanal als einen einzigen Link.</p>
        <div class="table-wrap"><table>
          <tr><th>Protokoll</th><th>Standard</th><th>Modi</th></tr>
          <tr><td><strong>LACP</strong></td><td>IEEE 802.3ad (offen)</td><td>active / passive</td></tr>
          <tr><td><strong>PAgP</strong></td><td>Cisco-proprietär</td><td>desirable / auto</td></tr>
          <tr><td><strong>Static</strong></td><td>–</td><td>on / on</td></tr>
        </table></div>
        <div class="callout callout-info"><strong>Modi-Kombinationen</strong>LACP: active-active oder active-passive ✓ | passive-passive ✗<br>PAgP: desirable-desirable oder desirable-auto ✓ | auto-auto ✗</div>
      </div>

      <div class="content-section">
        <h3>⚙️ EtherChannel Konfiguration</h3>
        <pre><code><span class="cli-comment"># LACP EtherChannel (empfohlen)</span>
Switch(config)# interface range gi0/1 - 2
Switch(config-if-range)# channel-group 1 mode active
Switch(config-if-range)# exit

Switch(config)# interface port-channel 1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20

<span class="cli-comment"># Verifikation</span>
Switch# show etherchannel summary
Switch# show etherchannel port-channel
Switch# show interfaces port-channel 1</code></pre>
        <div class="callout callout-warn"><strong>Voraussetzung</strong>Alle gebündelten Ports müssen identische Konfiguration haben: gleiche Geschwindigkeit, Duplex, VLAN-Konfiguration, Trunk-Einstellungen.</div>
      </div>
    `
  },

  // ============ DOMAIN 3: IP CONNECTIVITY ============
  {
    id: "static-routing",
    domain: "IP Connectivity",
    domainPct: "25%",
    icon: "🛤️",
    title: "Static Routing",
    tags: ["Routing", "Layer 3"],
    content: `
      <div class="content-section">
        <h3>🛤️ Statisches Routing</h3>
        <p>Bei statischem Routing werden Routen <strong>manuell</strong> konfiguriert. Kein Overhead durch Routing-Protokolle, aber keine automatische Anpassung bei Topologieänderungen.</p>
        <pre><code><span class="cli-comment"># Syntax: ip route [Zielnetz] [Maske] [Next-Hop IP | Exit-Interface]</span>
Router(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2
Router(config)# ip route 192.168.3.0 255.255.255.0 gi0/1

<span class="cli-comment"># Default Route (Gateway of Last Resort)</span>
Router(config)# ip route 0.0.0.0 0.0.0.0 10.0.0.1

<span class="cli-comment"># Floating Static Route (höhere AD = Backup)</span>
Router(config)# ip route 192.168.2.0 255.255.255.0 10.0.1.2 5

<span class="cli-comment"># Verifikation</span>
Router# show ip route
Router# show ip route static
Router# ping 192.168.2.1</code></pre>
      </div>

      <div class="content-section">
        <h3>🗂️ Routentypen (Blueprint 3.3)</h3>
        <div class="table-wrap"><table>
          <tr><th>Typ</th><th>Beispiel IPv4</th><th>Beispiel IPv6</th><th>Zweck</th></tr>
          <tr><td><strong>Network Route</strong></td><td><code>ip route 10.1.0.0 255.255.0.0 10.0.0.2</code></td><td><code>ipv6 route 2001:DB8:1::/64 2001:DB8::2</code></td><td>Route zu einem (Teil-)Netz</td></tr>
          <tr><td><strong>Host Route</strong></td><td><code>ip route 10.1.1.5 255.255.255.255 10.0.0.2</code></td><td><code>ipv6 route 2001:DB8:1::5/128 2001:DB8::2</code></td><td>Route zu genau einem Host (/32 bzw. /128)</td></tr>
          <tr><td><strong>Default Route</strong></td><td><code>ip route 0.0.0.0 0.0.0.0 10.0.0.1</code></td><td><code>ipv6 route ::/0 2001:DB8::1</code></td><td>Gateway of Last Resort — alles, was sonst nicht passt</td></tr>
          <tr><td><strong>Floating Static</strong></td><td><code>ip route 10.1.0.0 255.255.0.0 10.0.1.2 <strong>5</strong></code></td><td><code>ipv6 route 2001:DB8:1::/64 2001:DB8:F::2 <strong>5</strong></code></td><td>Backup-Route mit höherer AD, erscheint nur, wenn die primäre Route ausfällt</td></tr>
        </table></div>
        <h4>Next-Hop vs. Exit-Interface</h4>
        <ul>
          <li><strong>Next-Hop-IP:</strong> Router muss die Next-Hop-Adresse rekursiv auflösen (recursive lookup). Standard und sauber auf Multi-Access-Links (Ethernet).</li>
          <li><strong>Exit-Interface:</strong> Direkt angeschlossen (AD 1, wird in der Tabelle wie „directly connected“ behandelt). Auf Ethernet problematisch → ARP für jedes Ziel. Gut für Point-to-Point (Serial).</li>
          <li><strong>Fully specified:</strong> <code>ip route 10.1.0.0 255.255.0.0 gi0/0 10.0.0.2</code> — beides angegeben, kein rekursiver Lookup.</li>
        </ul>
        <pre><code><span class="cli-comment"># IPv6 statisches Routing</span>
Router(config)# ipv6 unicast-routing
Router(config)# ipv6 route 2001:DB8:2::/64 2001:DB8:12::2
Router(config)# ipv6 route ::/0 gi0/0 FE80::2     <span class="cli-comment"># Link-Local als Next-Hop → Exit-Interface Pflicht!</span>
Router# show ipv6 route
Router# show ipv6 route static</code></pre>
        <div class="callout callout-warn"><strong>Prüfungsfalle</strong>Wird ein <strong>Link-Local</strong> (FE80::) als IPv6-Next-Hop verwendet, MUSS das Exit-Interface mit angegeben werden, weil Link-Local-Adressen nicht eindeutig sind.</div>
      </div>

      <div class="content-section">
        <h3>📊 Administrative Distance (AD)</h3>
        <p>AD bestimmt die Vertrauenswürdigkeit einer Route-Quelle. Niedrigere AD = bevorzugte Route.</p>
        <div class="table-wrap"><table>
          <tr><th>Quelle</th><th>AD</th></tr>
          <tr><td>Connected (direkt verbunden)</td><td>0</td></tr>
          <tr><td>Static Route</td><td>1</td></tr>
          <tr><td>EIGRP (summary)</td><td>5</td></tr>
          <tr><td>BGP (external)</td><td>20</td></tr>
          <tr><td>EIGRP (internal)</td><td>90</td></tr>
          <tr><td>OSPF</td><td>110</td></tr>
          <tr><td>IS-IS</td><td>115</td></tr>
          <tr><td>RIP</td><td>120</td></tr>
          <tr><td>EIGRP (external)</td><td>170</td></tr>
          <tr><td>Unknown / Unreachable</td><td>255</td></tr>
        </table></div>
      </div>
    `
  },
  {
    id: "ospf",
    domain: "IP Connectivity",
    domainPct: "25%",
    icon: "🔄",
    title: "OSPF",
    tags: ["Routing", "Dynamic", "Link-State"],
    content: `
      <div class="content-section">
        <h3>🔄 OSPF — Open Shortest Path First</h3>
        <p>OSPF ist ein <strong>Link-State Routing-Protokoll</strong> (IGP), das den Dijkstra-Algorithmus (SPF) verwendet. Es konvergiert schnell und skaliert gut.</p>
        <ul>
          <li>Verwendet <strong>Cost</strong> als Metrik: <code>Cost = 100 Mbps / Bandbreite</code></li>
          <li>Multicast-Adressen: <code>224.0.0.5</code> (alle OSPF-Router), <code>224.0.0.6</code> (DR/BDR)</li>
          <li>Protocol-Nummer: <strong>89</strong></li>
          <li>AD: <strong>110</strong></li>
        </ul>
      </div>

      <div class="content-section">
        <h3>👥 DR & BDR auf Multi-Access Netzwerken</h3>
        <p>Auf Ethernet-Segmenten wird ein <strong>Designated Router (DR)</strong> und ein <strong>Backup DR (BDR)</strong> gewählt, um Adjacencies zu reduzieren.</p>
        <ul>
          <li>Wahl: höchste <strong>OSPF Priority</strong> (Standard: 1), bei Gleichstand → höchste Router-ID</li>
          <li>Priority 0 = kann nie DR/BDR werden</li>
          <li>Router-ID: höchste Loopback-IP &gt; höchste aktive Interface-IP</li>
        </ul>
      </div>

      <div class="content-section">
        <h3>⚙️ OSPF Konfiguration (Single-Area)</h3>
        <pre><code><span class="cli-comment"># OSPF aktivieren</span>
Router(config)# router ospf 1
Router(config-router)# router-id 1.1.1.1

<span class="cli-comment"># Netzwerke ankündigen (Wildcard = invertierte Maske)</span>
Router(config-router)# network 192.168.1.0 0.0.0.255 area 0
Router(config-router)# network 10.0.0.0 0.0.0.3 area 0

<span class="cli-comment"># Passive Interface (kein Hello, aber Netz wird angekündigt)</span>
Router(config-router)# passive-interface gi0/1

<span class="cli-comment"># Default Route propagieren</span>
Router(config-router)# default-information originate

<span class="cli-comment"># Cost manuell setzen</span>
Router(config-if)# ip ospf cost 10

<span class="cli-comment"># Verifikation</span>
Router# show ip ospf neighbor
Router# show ip ospf database
Router# show ip route ospf</code></pre>
        <div class="callout callout-info"><strong>Wildcard Maske</strong>Wildcard = 255.255.255.255 minus Subnetzmaske. Beispiel: /24 → 255.255.255.0 → Wildcard = 0.0.0.255</div>
      </div>
    `
  },

  // ============ DOMAIN 4: IP SERVICES ============
  {
    id: "dhcp",
    domain: "IP Services",
    domainPct: "10%",
    icon: "📋",
    title: "DHCP",
    tags: ["Services", "IP-Vergabe"],
    content: `
      <div class="content-section">
        <h3>📋 DHCP — Dynamic Host Configuration Protocol</h3>
        <p>DHCP vergibt automatisch IP-Adressen und weitere Netzwerkinformationen (Gateway, DNS, Subnetzmaske) an Clients.</p>
        <h4>DORA-Prozess</h4>
        <pre><code>Client                          DHCP-Server
  │                                    │
  ├──── DISCOVER (Broadcast) ─────────►│
  │◄─── OFFER (Unicast/BC) ────────────┤
  ├──── REQUEST (Broadcast) ──────────►│
  │◄─── ACK (Bestätigung) ─────────────┤</code></pre>
        <div class="callout callout-tip"><strong>Ports</strong>DHCP Server: UDP 67 | DHCP Client: UDP 68</div>
      </div>

      <div class="content-section">
        <h3>⚙️ DHCP auf Cisco IOS</h3>
        <pre><code><span class="cli-comment"># DHCP Pool konfigurieren</span>
Router(config)# ip dhcp pool BUERO
Router(dhcp-config)# network 192.168.1.0 255.255.255.0
Router(dhcp-config)# default-router 192.168.1.1
Router(dhcp-config)# dns-server 8.8.8.8
Router(dhcp-config)# lease 7

<span class="cli-comment"># Adressen ausschließen (z.B. für Router/Server)</span>
Router(config)# ip dhcp excluded-address 192.168.1.1 192.168.1.20

<span class="cli-comment"># DHCP Relay (Helper-Address) — wenn Server in anderem Segment</span>
Router(config-if)# ip helper-address 10.0.0.100

<span class="cli-comment"># Router-Interface als DHCP-CLIENT (z.B. WAN-Port zum ISP)</span>
Router(config-if)# ip address dhcp

<span class="cli-comment"># Verifikation</span>
Router# show ip dhcp binding
Router# show ip dhcp pool
Router# show ip dhcp conflict</code></pre>
      </div>
    `
  },
  {
    id: "nat",
    domain: "IP Services",
    domainPct: "10%",
    icon: "🔀",
    title: "NAT & PAT",
    tags: ["Services", "Adressübersetzung"],
    content: `
      <div class="content-section">
        <h3>🔀 NAT — Network Address Translation</h3>
        <p>NAT übersetzt private IP-Adressen in öffentliche (und zurück), um den Internetzugang zu ermöglichen und IPv4-Adressen zu schonen.</p>
        <div class="table-wrap"><table>
          <tr><th>Typ</th><th>Beschreibung</th><th>Verhältnis</th></tr>
          <tr><td>Static NAT</td><td>Feste 1:1-Zuordnung</td><td>1 privat = 1 öffentlich</td></tr>
          <tr><td>Dynamic NAT</td><td>Pool öffentlicher Adressen</td><td>n privat = m öffentlich</td></tr>
          <tr><td>PAT (Overload)</td><td>Viele private → eine öffentliche (Port-Multiplexing)</td><td>n privat = 1 öffentlich</td></tr>
        </table></div>
        <div class="callout callout-tip"><strong>Inside/Outside</strong>Inside Local = private Adresse des Hosts | Inside Global = öffentliche Adresse (nach NAT) | Outside Global = Adresse des Ziels im Internet</div>
      </div>

      <div class="content-section">
        <h3>⚙️ PAT Konfiguration (häufigste Form)</h3>
        <pre><code><span class="cli-comment"># Interface-Rollen definieren</span>
Router(config-if)# ip nat inside     <span class="cli-comment"># Internes Interface</span>
Router(config-if)# ip nat outside    <span class="cli-comment"># Externes Interface (WAN)</span>

<span class="cli-comment"># ACL für zu übersetzende Adressen</span>
Router(config)# access-list 1 permit 192.168.1.0 0.0.0.255

<span class="cli-comment"># PAT mit Interface-Adresse (Overload)</span>
Router(config)# ip nat inside source list 1 interface gi0/0 overload

<span class="cli-comment"># Static NAT (Server-Weiterleitung)</span>
Router(config)# ip nat inside source static 192.168.1.100 203.0.113.10

<span class="cli-comment"># Verifikation</span>
Router# show ip nat translations
Router# show ip nat statistics</code></pre>
      </div>
    `
  },

  // ============ DOMAIN 5: SECURITY ============
  {
    id: "acl",
    domain: "Security Fundamentals",
    domainPct: "15%",
    icon: "🛡️",
    title: "Access Control Lists",
    tags: ["Security", "ACL", "Filterung"],
    content: `
      <div class="content-section">
        <h3>🛡️ ACLs — Access Control Lists</h3>
        <p>ACLs filtern Netzwerkverkehr anhand von Regeln (Permit/Deny). Sie werden auf Router-Interfaces angewendet und verarbeiten Pakete <strong>sequenziell</strong>. Am Ende steht immer ein implizites <code>deny any</code>!</p>
        <div class="table-wrap"><table>
          <tr><th>Typ</th><th>Nummernbereich</th><th>Filtert nach</th><th>Platzierung</th></tr>
          <tr><td>Standard ACL</td><td>1–99, 1300–1999</td><td>Quell-IP</td><td>Nah am Ziel</td></tr>
          <tr><td>Extended ACL</td><td>100–199, 2000–2699</td><td>Quelle, Ziel, Protokoll, Port</td><td>Nah an der Quelle</td></tr>
          <tr><td>Named ACL</td><td>Name (Text)</td><td>Beide Typen mit Name</td><td>Je nach Typ</td></tr>
        </table></div>
      </div>

      <div class="content-section">
        <h3>⚙️ ACL Konfiguration</h3>
        <pre><code><span class="cli-comment"># Standard ACL (nur Quell-IP)</span>
Router(config)# access-list 10 permit 192.168.1.0 0.0.0.255
Router(config)# access-list 10 deny any

<span class="cli-comment"># Extended ACL (Quelle, Ziel, Port)</span>
Router(config)# access-list 110 permit tcp 192.168.1.0 0.0.0.255 any eq 80
Router(config)# access-list 110 permit tcp 192.168.1.0 0.0.0.255 any eq 443
Router(config)# access-list 110 deny ip any any

<span class="cli-comment"># Named Extended ACL (empfohlen)</span>
Router(config)# ip access-list extended WEB-FILTER
Router(config-ext-nacl)# permit tcp 192.168.1.0 0.0.0.255 any eq 80
Router(config-ext-nacl)# permit tcp 192.168.1.0 0.0.0.255 any eq 443
Router(config-ext-nacl)# deny ip any any log

<span class="cli-comment"># ACL auf Interface anwenden</span>
Router(config-if)# ip access-group 110 in   <span class="cli-comment"># eingehend</span>
Router(config-if)# ip access-group 10 out   <span class="cli-comment"># ausgehend</span>

<span class="cli-comment"># Verifikation</span>
Router# show access-lists
Router# show ip interface gi0/0</code></pre>
        <div class="callout callout-warn"><strong>Wichtig</strong>Pro Interface, pro Protokoll (IP), pro Richtung (in/out) nur EINE ACL! Standard ACLs nah ans Ziel, Extended ACLs nah an die Quelle.</div>
      </div>
    `
  },
  {
    id: "device-security",
    domain: "Security Fundamentals",
    domainPct: "15%",
    icon: "🔐",
    title: "Gerätesicherheit",
    tags: ["Security", "Passwörter", "SSH"],
    content: `
      <div class="content-section">
        <h3>🔐 Cisco IOS Gerätesicherheit</h3>
        <pre><code><span class="cli-comment"># Hostname setzen</span>
Router(config)# hostname R1

<span class="cli-comment"># Passwörter konfigurieren</span>
R1(config)# enable secret Cisco123     <span class="cli-comment"># MD5-verschlüsselt (bevorzugt)</span>
R1(config)# service password-encryption  <span class="cli-comment"># Alle Passwörter verschlüsseln</span>

<span class="cli-comment"># Console-Linie sichern</span>
R1(config)# line console 0
R1(config-line)# password Con-Pass
R1(config-line)# login
R1(config-line)# exec-timeout 5 0      <span class="cli-comment"># 5 Minuten Timeout</span>

<span class="cli-comment"># VTY-Linien (Telnet/SSH)</span>
R1(config)# line vty 0 4
R1(config-line)# transport input ssh   <span class="cli-comment"># Nur SSH erlauben</span>
R1(config-line)# login local

<span class="cli-comment"># SSH konfigurieren</span>
R1(config)# ip domain-name ccna.local
R1(config)# crypto key generate rsa modulus 2048
R1(config)# ip ssh version 2
R1(config)# username admin privilege 15 secret AdminPass

<span class="cli-comment"># Login-Banner</span>
R1(config)# banner motd #Unauthorized access prohibited!#

<span class="cli-comment"># Verifikation</span>
R1# show users
R1# show ssh</code></pre>
      </div>

      <div class="content-section">
        <h3>🔒 Port Security</h3>
        <p>Port Security begrenzt die Anzahl erlaubter MAC-Adressen pro Switch-Port und schützt vor MAC-Flooding-Angriffen.</p>
        <pre><code><span class="cli-comment"># Port Security aktivieren (nur auf Access-Ports)</span>
Switch(config-if)# switchport mode access
Switch(config-if)# switchport port-security
Switch(config-if)# switchport port-security maximum 2
Switch(config-if)# switchport port-security mac-address sticky
Switch(config-if)# switchport port-security violation restrict
<span class="cli-comment"># Violation: protect (drop), restrict (drop+log), shutdown (err-disabled)</span>

<span class="cli-comment"># Err-disabled Port wiederherstellen</span>
Switch(config-if)# shutdown
Switch(config-if)# no shutdown

<span class="cli-comment"># Verifikation</span>
Switch# show port-security
Switch# show port-security interface fa0/1</code></pre>
      </div>
    `
  },

  // ============ DOMAIN 6: AUTOMATION ============
  {
    id: "automation",
    domain: "Automation & Programmability",
    domainPct: "10%",
    icon: "🤖",
    title: "Automation & SDN",
    tags: ["Automation", "SDN", "API"],
    content: `
      <div class="content-section">
        <h3>🤖 Netzwerk-Automatisierung</h3>
        <p>Traditionelles Netzwerk-Management (CLI, Box-by-Box) wird zunehmend durch Automatisierung ersetzt.</p>
        <div class="table-wrap"><table>
          <tr><th>Tool</th><th>Typ</th><th>Beschreibung</th></tr>
          <tr><td><strong>Ansible</strong></td><td>Agentless, Push, prozedural</td><td>YAML-Playbooks, SSH-basiert, keine Agents nötig — im Blueprint v1.1 (6.6)</td></tr>
          <tr><td><strong>Terraform</strong></td><td>Agentless, deklarativ (IaC)</td><td>HCL-Konfiguration, plan → apply, State-File — im Blueprint v1.1 (6.6)</td></tr>
          <tr><td>Puppet / Chef</td><td>Agent-based, Pull</td><td>Nur noch Hintergrundwissen — seit v1.1 nicht mehr explizit im Blueprint</td></tr>
          <tr><td>Python + NETCONF/RESTCONF</td><td>Programmierbar</td><td>Direkte Konfiguration via API und YANG-Modelle</td></tr>
        </table></div>
      </div>

      <div class="content-section">
        <h3>🌐 SDN — Software Defined Networking</h3>
        <p>SDN trennt die <strong>Control Plane</strong> (Routing-Entscheidungen) von der <strong>Data Plane</strong> (Paket-Weiterleitung) und zentralisiert die Steuerung.</p>
        <ul>
          <li><strong>Northbound API:</strong> Zwischen Controller und Applikationen</li>
          <li><strong>Southbound API:</strong> Zwischen Controller und Netzwerkgeräten (OpenFlow, NETCONF)</li>
        </ul>
        <h4>Cisco DNA Center (Intent-Based Networking)</h4>
        <ul>
          <li>Zentrale Verwaltung und Automatisierung</li>
          <li>REST API für Northbound-Integration</li>
          <li>Verwendet YANG-Datenmodelle + NETCONF/RESTCONF</li>
        </ul>
      </div>

      <div class="content-section">
        <h3>📡 REST API Grundlagen</h3>
        <p>REST APIs verwenden HTTP-Methoden und JSON/XML zur Kommunikation mit Netzwerkgeräten.</p>
        <div class="table-wrap"><table>
          <tr><th>HTTP-Methode</th><th>CRUD-Operation</th><th>Beschreibung</th></tr>
          <tr><td>GET</td><td>Read</td><td>Daten lesen</td></tr>
          <tr><td>POST</td><td>Create</td><td>Neue Ressource erstellen</td></tr>
          <tr><td>PUT</td><td>Update/Replace</td><td>Ressource ersetzen</td></tr>
          <tr><td>PATCH</td><td>Update/Modify</td><td>Ressource teilweise ändern</td></tr>
          <tr><td>DELETE</td><td>Delete</td><td>Ressource löschen</td></tr>
        </table></div>
        <div class="callout callout-info"><strong>Datenformate</strong>JSON (leichtgewichtig, weit verbreitet) und XML (strukturiert, ausführlicher) — CCNA fokussiert auf JSON und YANG-Modelle.</div>
      </div>
    `
  }
];

// ============ QUIZ DATA ============
const QUIZZES = {
  "osi-model": [
    {
      q: "Auf welchem OSI-Layer arbeitet ein normaler (managed) Switch?",
      options: ["Layer 1 – Physical", "Layer 2 – Data Link", "Layer 3 – Network", "Layer 4 – Transport"],
      correct: 1,
      explanation: "Ein Switch arbeitet auf Layer 2 (Data Link) und trifft Weiterleitungsentscheidungen basierend auf MAC-Adressen. Layer-3-Switches können zusätzlich auf Schicht 3 routen.",
      theoryRef: "osi-model"
    },
    {
      q: "Welche PDU (Protocol Data Unit) wird auf Layer 4 (Transport) verwendet?",
      options: ["Bit", "Frame", "Paket", "Segment"],
      correct: 3,
      explanation: "Layer 4 (Transport) verwendet Segmente. Layer 3 = Paket, Layer 2 = Frame, Layer 1 = Bit.",
      theoryRef: "osi-model"
    },
    {
      q: "Welches Protokoll gehört zu Layer 3 des OSI-Modells?",
      options: ["TCP", "Ethernet", "IP", "HTTP"],
      correct: 2,
      explanation: "IP (Internet Protocol) arbeitet auf Layer 3 (Network). TCP = Layer 4, Ethernet = Layer 2, HTTP = Layer 7.",
      theoryRef: "osi-model"
    },
    {
      q: "Ein Router arbeitet primär auf welchem OSI-Layer?",
      options: ["Layer 1", "Layer 2", "Layer 3", "Layer 4"],
      correct: 2,
      explanation: "Router arbeiten auf Layer 3 (Network Layer) und treffen Routing-Entscheidungen basierend auf IP-Adressen.",
      theoryRef: "osi-model"
    },
    {
      q: "Was macht die Presentation Layer (Layer 6)?",
      options: ["Stellt Verbindungen zwischen Anwendungen her", "Übernimmt Verschlüsselung und Datenformatierung", "Steuert den Datenaustausch über physische Medien", "Segmentiert und reassembliert Daten"],
      correct: 1,
      explanation: "Layer 6 (Presentation) kümmert sich um Datendarstellung, Verschlüsselung (SSL/TLS) und Kodierung (ASCII, JPEG).",
      theoryRef: "osi-model"
    }
  ],
  "tcp-udp": [
    {
      q: "Welches Protokoll nutzt ein Three-Way-Handshake vor der Datenübertragung?",
      options: ["UDP", "ICMP", "TCP", "ARP"],
      correct: 2,
      explanation: "TCP baut Verbindungen mit einem Three-Way-Handshake auf: SYN → SYN-ACK → ACK. UDP ist verbindungslos.",
      theoryRef: "tcp-udp"
    },
    {
      q: "Auf welchem Port läuft HTTPS?",
      options: ["80", "8080", "443", "22"],
      correct: 2,
      explanation: "HTTPS (verschlüsseltes HTTP) läuft auf Port 443/TCP. HTTP (unverschlüsselt) läuft auf Port 80.",
      theoryRef: "tcp-udp"
    },
    {
      q: "Welches Protokoll und Port verwendet DNS primär?",
      options: ["TCP 53", "UDP 53", "UDP 67", "TCP 80"],
      correct: 1,
      explanation: "DNS verwendet primär UDP Port 53 für Abfragen. TCP 53 wird für Zone-Transfers oder große Antworten verwendet.",
      theoryRef: "tcp-udp"
    },
    {
      q: "Welche Aussage über UDP ist KORREKT?",
      options: ["UDP garantiert die Reihenfolge der Pakete", "UDP verwendet einen Three-Way-Handshake", "UDP ist verbindungslos und hat geringen Overhead", "UDP ist langsamer als TCP"],
      correct: 2,
      explanation: "UDP ist verbindungslos, hat keinen Handshake und nur 8 Byte Header-Overhead. Es ist schneller als TCP, aber ohne Zuverlässigkeitsgarantie.",
      theoryRef: "tcp-udp"
    },
    {
      q: "Welcher Port wird von SSH verwendet?",
      options: ["21", "22", "23", "25"],
      correct: 1,
      explanation: "SSH (Secure Shell) verwendet Port 22/TCP. Telnet = 23, FTP = 21, SMTP = 25.",
      theoryRef: "tcp-udp"
    }
  ],
  "ipv4": [
    {
      q: "Wie viele verwendbare Hosts hat ein /28-Netzwerk?",
      options: ["14", "16", "30", "62"],
      correct: 0,
      explanation: "/28 bedeutet 4 Host-Bits. 2^4 = 16 Adressen, minus 2 (Netz + Broadcast) = 14 verwendbare Hosts.",
      theoryRef: "ipv4"
    },
    {
      q: "Welche IP-Adresse gehört zum privaten Adressraum (RFC 1918)?",
      options: ["172.32.0.1", "192.169.1.1", "10.0.0.1", "11.0.0.1"],
      correct: 2,
      explanation: "10.0.0.0/8 ist ein privater Adressbereich. 172.16.0.0–172.31.255.255 und 192.168.0.0/16 ebenfalls. 172.32.x.x ist NICHT privat.",
      theoryRef: "ipv4"
    },
    {
      q: "Ein Host hat die IP 192.168.1.100/26. Welches ist die Broadcast-Adresse seines Subnetzes?",
      options: ["192.168.1.127", "192.168.1.255", "192.168.1.128", "192.168.1.63"],
      correct: 0,
      explanation: "/26 = 64er Blöcke. 192.168.1.64–192.168.1.127 ist das zweite Subnetz (da .100 dort liegt). Broadcast = .127.",
      theoryRef: "ipv4"
    },
    {
      q: "Was ist die Subnetzmaske für /22?",
      options: ["255.255.252.0", "255.255.248.0", "255.255.254.0", "255.255.255.0"],
      correct: 0,
      explanation: "/22 bedeutet 22 Einsen: 11111111.11111111.11111100.00000000 = 255.255.252.0",
      theoryRef: "ipv4"
    },
    {
      q: "Welche Adressklasse hat standardmäßig die Maske 255.255.0.0?",
      options: ["Klasse A", "Klasse B", "Klasse C", "Klasse D"],
      correct: 1,
      explanation: "Klasse B (128–191) hat die Standard-Subnetzmaske /16 = 255.255.0.0.",
      theoryRef: "ipv4"
    }
  ],
  "ipv6": [
    {
      q: "Wie viele Bits hat eine IPv6-Adresse?",
      options: ["32", "64", "128", "256"],
      correct: 2,
      explanation: "IPv6-Adressen sind 128 Bit lang (vs. 32 Bit bei IPv4), dargestellt als 8 Gruppen à 4 Hex-Ziffern.",
      theoryRef: "ipv6"
    },
    {
      q: "Mit welchem Präfix beginnen IPv6 Link-Local-Adressen?",
      options: ["2001::/32", "FE80::/10", "FC00::/7", "FF00::/8"],
      correct: 1,
      explanation: "Link-Local-Adressen beginnen mit FE80::/10. Sie werden automatisch konfiguriert und sind nur im lokalen Segment gültig.",
      theoryRef: "ipv6"
    },
    {
      q: "Welche IPv6-Adresse entspricht der IPv4-Loopback-Adresse 127.0.0.1?",
      options: ["FE80::1", "::1", "FF02::1", "2001::1"],
      correct: 1,
      explanation: "::1/128 ist die IPv6-Loopback-Adresse (entspricht IPv4 127.0.0.1).",
      theoryRef: "ipv6"
    },
    {
      q: "Was ersetzt bei IPv6 den IPv4-Broadcast?",
      options: ["Unicast", "Anycast", "Multicast", "Link-Local"],
      correct: 2,
      explanation: "IPv6 hat keinen Broadcast. Stattdessen wird Multicast verwendet (z.B. FF02::1 für alle Nodes im Segment).",
      theoryRef: "ipv6"
    }
  ],
  "vlans": [
    {
      q: "Auf welchem VLAN ist ein Cisco Switch-Port standardmäßig?",
      options: ["VLAN 0", "VLAN 1", "VLAN 99", "VLAN 1000"],
      correct: 1,
      explanation: "Alle Ports sind standardmäßig in VLAN 1 (Default VLAN). Aus Sicherheitsgründen sollten Ports in andere VLANs verschoben werden.",
      theoryRef: "vlans"
    },
    {
      q: "Welches IEEE-Protokoll wird für VLAN-Tagging auf Trunk-Ports verwendet?",
      options: ["802.1Q", "802.3ad", "802.1D", "802.1w"],
      correct: 0,
      explanation: "IEEE 802.1Q ist das Standardprotokoll für VLAN-Tagging. Es fügt einen 4-Byte-Tag in den Ethernet-Frame ein.",
      theoryRef: "vlans"
    },
    {
      q: "Was ist das Native VLAN auf einem Trunk-Port?",
      options: ["Das VLAN für Management", "Das VLAN, dessen Traffic ungetaggt übertragen wird", "Das erste VLAN im Allowed-VLAN-List", "Das VLAN mit der niedrigsten ID"],
      correct: 1,
      explanation: "Das Native VLAN ist das einzige VLAN, dessen Frames auf einem Trunk ungetaggt übertragen werden. Standard ist VLAN 1.",
      theoryRef: "vlans"
    },
    {
      q: "Welcher Befehl zeigt alle VLANs und ihre zugewiesenen Ports?",
      options: ["show vlan brief", "show interfaces trunk", "show vlan database", "show switchport"],
      correct: 0,
      explanation: "'show vlan brief' zeigt eine Übersicht aller VLANs mit ihren zugehörigen Ports. 'show interfaces trunk' zeigt Trunk-Informationen.",
      theoryRef: "vlans"
    },
    {
      q: "Welche Methode für Inter-VLAN-Routing wird für hohe Performance empfohlen?",
      options: ["Legacy (ein Interface pro VLAN)", "Router-on-a-Stick", "Layer-3-Switch mit SVIs", "Alle Methoden sind gleichwertig"],
      correct: 2,
      explanation: "Ein Layer-3-Switch mit SVIs (Switched Virtual Interfaces) ist die empfohlene Methode: kein externer Router nötig, hohes Performance durch Hardware-Routing.",
      theoryRef: "vlans"
    }
  ],
  "stp": [
    {
      q: "Warum ist STP notwendig?",
      options: ["Um die Bandbreite zu erhöhen", "Um Layer-2-Loops und Broadcast-Storms zu verhindern", "Um VLANs zu segmentieren", "Um Routing zu ermöglichen"],
      correct: 1,
      explanation: "STP verhindert Layer-2-Loops in redundanten Switch-Topologien. Ohne STP würden Broadcasts endlos im Netzwerk kreisen (Broadcast Storm).",
      theoryRef: "stp"
    },
    {
      q: "Welcher Switch wird als Root Bridge gewählt?",
      options: ["Der mit der höchsten MAC-Adresse", "Der mit der höchsten Bridge-ID", "Der mit der niedrigsten Bridge-ID", "Der zuerst eingeschaltete Switch"],
      correct: 2,
      explanation: "Der Switch mit der niedrigsten Bridge-ID (Priority + MAC) wird Root Bridge. Standard Priority = 32768.",
      theoryRef: "stp"
    },
    {
      q: "Wie lange dauert die Konvergenz bei klassischem 802.1D STP?",
      options: ["Weniger als 1 Sekunde", "Etwa 15 Sekunden", "Bis zu 50 Sekunden", "Bis zu 5 Minuten"],
      correct: 2,
      explanation: "802.1D STP benötigt bis zu 50 Sekunden (2x Forward Delay à 15s + Max Age). RSTP (802.1w) konvergiert in unter 1 Sekunde.",
      theoryRef: "stp"
    },
    {
      q: "Was bewirkt PortFast auf einem Switch-Port?",
      options: ["Erhöht die Port-Geschwindigkeit", "Überspringt Listening/Learning und geht direkt in Forwarding", "Aktiviert BPDU Guard automatisch", "Verhindert Loop-Bildung"],
      correct: 1,
      explanation: "PortFast überspringt die Listening- und Learning-Zustände. Der Port geht sofort in den Forwarding-Zustand. Nur für Access-Ports verwenden!",
      theoryRef: "stp"
    },
    {
      q: "Was passiert, wenn ein Port mit aktivem BPDU Guard eine BPDU empfängt?",
      options: ["Er ignoriert die BPDU", "Er wird in den Blocking-Zustand versetzt", "Er wird err-disabled (shutdown)", "Er sendet eine Warnung an den Admin"],
      correct: 2,
      explanation: "BPDU Guard versetzt den Port in den err-disabled Zustand, wenn eine BPDU empfangen wird. Der Port muss manuell wiederhergestellt werden.",
      theoryRef: "stp"
    }
  ],
  "etherchannel": [
    {
      q: "Welches EtherChannel-Protokoll ist ein offener IEEE-Standard?",
      options: ["PAgP", "LACP", "STP", "RSTP"],
      correct: 1,
      explanation: "LACP (Link Aggregation Control Protocol) ist IEEE 802.3ad — ein offener Standard. PAgP ist Cisco-proprietär.",
      theoryRef: "etherchannel"
    },
    {
      q: "Welche LACP-Modi-Kombination bildet KEIN EtherChannel?",
      options: ["active – active", "active – passive", "passive – passive", "Alle bilden ein EtherChannel"],
      correct: 2,
      explanation: "Passive – Passive bildet kein EtherChannel, da beide Seiten darauf warten, dass die andere Seite aktiv verhandelt.",
      theoryRef: "etherchannel"
    },
    {
      q: "Was passiert, wenn die gebündelten Ports unterschiedliche VLAN-Konfigurationen haben?",
      options: ["EtherChannel funktioniert trotzdem", "EtherChannel kann nicht gebildet werden", "Nur der erste Port wird aktiv", "STP blockiert automatisch"],
      correct: 1,
      explanation: "Alle Ports in einem EtherChannel müssen identische Konfiguration haben (Speed, Duplex, VLAN, Trunk-Settings). Unterschiede verhindern die Kanalbildung.",
      theoryRef: "etherchannel"
    }
  ],
  "static-routing": [
    {
      q: "Welche Administrative Distance hat eine statische Route standardmäßig?",
      options: ["0", "1", "90", "110"],
      correct: 1,
      explanation: "Statische Routen haben eine AD von 1. Nur direkt verbundene Routen (AD=0) sind vertrauenswürdiger.",
      theoryRef: "static-routing"
    },
    {
      q: "Welcher Befehl konfiguriert eine Default-Route?",
      options: [
        "ip route 0.0.0.0 255.255.255.255 10.0.0.1",
        "ip route 0.0.0.0 0.0.0.0 10.0.0.1",
        "ip route default 10.0.0.1",
        "ip default-gateway 10.0.0.1"
      ],
      correct: 1,
      explanation: "'ip route 0.0.0.0 0.0.0.0 <next-hop>' konfiguriert eine Default-Route (Gateway of Last Resort). ip default-gateway wird nur auf Switches ohne IP-Routing verwendet.",
      theoryRef: "static-routing"
    },
    {
      q: "Was ist eine Floating Static Route?",
      options: ["Eine Route, die sich automatisch ändert", "Eine Backup-Route mit höherer AD als die primäre Route", "Eine Route über ein physisch bewegliches Interface", "Eine Route mit Lastverteilung"],
      correct: 1,
      explanation: "Eine Floating Static Route hat eine höhere AD (z.B. 5) als die primäre dynamische Route. Sie wird nur aktiv, wenn die primäre Route wegfällt.",
      theoryRef: "static-routing"
    },
    {
      q: "Welche AD hat OSPF?",
      options: ["90", "100", "110", "120"],
      correct: 2,
      explanation: "OSPF hat eine Administrative Distance von 110. EIGRP (intern) = 90, RIP = 120.",
      theoryRef: "static-routing"
    }
  ],
  "ospf": [
    {
      q: "Welchen Algorithmus verwendet OSPF zur Berechnung des besten Pfades?",
      options: ["Bellman-Ford", "Dijkstra (SPF)", "Distance Vector", "Spanning Tree"],
      correct: 1,
      explanation: "OSPF verwendet den Dijkstra SPF (Shortest Path First) Algorithmus — deshalb ist es ein Link-State-Protokoll.",
      theoryRef: "ospf"
    },
    {
      q: "Wie berechnet OSPF den Cost eines Links mit 100 Mbps Bandbreite?",
      options: ["Cost = 10", "Cost = 100", "Cost = 1", "Cost = 1000"],
      correct: 2,
      explanation: "OSPF Cost = Referenzbandbreite / Interface-Bandbreite = 100 Mbps / 100 Mbps = 1. Für FastEthernet ist Cost=1.",
      theoryRef: "ospf"
    },
    {
      q: "Was ist die Multicast-Adresse für alle OSPF-Router?",
      options: ["224.0.0.1", "224.0.0.5", "224.0.0.6", "239.0.0.1"],
      correct: 1,
      explanation: "224.0.0.5 wird von OSPF für alle OSPF-Router verwendet. 224.0.0.6 ist für DR/BDR-Router reserviert.",
      theoryRef: "ospf"
    },
    {
      q: "Welcher Befehl zeigt die OSPF-Nachbarn eines Routers?",
      options: ["show ip ospf database", "show ip route ospf", "show ip ospf neighbor", "show ip ospf interface"],
      correct: 2,
      explanation: "'show ip ospf neighbor' zeigt alle OSPF-Adjacencies mit Status (FULL = korrekt).",
      theoryRef: "ospf"
    },
    {
      q: "In welchem OSPF-Befehl wird die Wildcard-Maske verwendet?",
      options: ["ip ospf cost", "network [IP] [wildcard] area [ID]", "ospf router-id", "passive-interface"],
      correct: 1,
      explanation: "Der 'network'-Befehl in OSPF verwendet Wildcard-Masken (invertierte Subnetzmaske). Beispiel: network 192.168.1.0 0.0.0.255 area 0",
      theoryRef: "ospf"
    }
  ],
  "dhcp": [
    {
      q: "Was bedeutet das Akronym DORA im DHCP-Prozess?",
      options: ["Detect, Obtain, Respond, Acknowledge", "Discover, Offer, Request, Acknowledge", "Distribute, Order, Receive, Assign", "Discover, Order, Request, Authenticate"],
      correct: 1,
      explanation: "DORA = Discover (Client sucht Server) → Offer (Server bietet IP an) → Request (Client bestätigt) → Acknowledge (Server bestätigt Zuweisung).",
      theoryRef: "dhcp"
    },
    {
      q: "Welche Ports verwendet DHCP?",
      options: ["TCP 67 und 68", "UDP 67 (Server) und 68 (Client)", "UDP 53 und 54", "TCP 80 und 81"],
      correct: 1,
      explanation: "DHCP verwendet UDP Port 67 (Server) und UDP Port 68 (Client). UDP, weil beim Discovery noch keine IP-Verbindung besteht.",
      theoryRef: "dhcp"
    },
    {
      q: "Welcher IOS-Befehl leitet DHCP-Broadcasts an einen Remote-Server weiter?",
      options: ["ip dhcp relay", "ip helper-address", "ip dhcp forward", "ip broadcast-relay"],
      correct: 1,
      explanation: "'ip helper-address [Server-IP]' auf dem Router-Interface leitet DHCP-Broadcasts (und andere UDP-Services) an den Server weiter.",
      theoryRef: "dhcp"
    }
  ],
  "nat": [
    {
      q: "Welche NAT-Variante ermöglicht es, dass viele interne Hosts eine einzige öffentliche IP teilen?",
      options: ["Static NAT", "Dynamic NAT", "PAT (Overload)", "Bidirektionales NAT"],
      correct: 2,
      explanation: "PAT (Port Address Translation / NAT Overload) multiplexiert viele interne Adressen auf eine öffentliche IP durch Nutzung unterschiedlicher Quellports.",
      theoryRef: "nat"
    },
    {
      q: "Was ist 'Inside Global' bei NAT?",
      options: ["Die private IP des internen Hosts", "Die öffentliche IP, die nach der Übersetzung repräsentiert wird", "Die IP des externen Servers", "Die IP des ISP-Routers"],
      correct: 1,
      explanation: "Inside Global = die öffentliche Adresse, die den internen Host nach der NAT-Übersetzung darstellt. Inside Local = private Original-IP des Hosts.",
      theoryRef: "nat"
    },
    {
      q: "Welcher Befehl zeigt aktive NAT-Übersetzungen?",
      options: ["show ip nat table", "show nat translations", "show ip nat translations", "debug ip nat all"],
      correct: 2,
      explanation: "'show ip nat translations' zeigt alle aktiven NAT-Einträge mit Original- und übersetzten Adressen.",
      theoryRef: "nat"
    }
  ],
  "acl": [
    {
      q: "Was steht am Ende jeder ACL, auch wenn es nicht explizit konfiguriert ist?",
      options: ["permit any", "deny any (implicit deny)", "permit established", "log any"],
      correct: 1,
      explanation: "Am Ende jeder ACL gibt es ein implizites 'deny any'. Traffic, der keiner Permit-Regel entspricht, wird automatisch geblockt.",
      theoryRef: "acl"
    },
    {
      q: "Wo sollte eine Standard-ACL platziert werden?",
      options: ["Nah an der Quelle", "Nah am Ziel", "Auf dem Core-Switch", "Auf jedem Interface"],
      correct: 1,
      explanation: "Standard-ACLs filtern nur nach Quell-IP. Sie werden nah am Ziel platziert, um nicht zu viel Traffic zu blockieren. Extended ACLs = nah an der Quelle.",
      theoryRef: "acl"
    },
    {
      q: "Welche ACL-Nummern sind für Extended ACLs reserviert?",
      options: ["1–99", "100–199", "200–299", "1000–1099"],
      correct: 1,
      explanation: "Extended ACLs verwenden Nummern 100–199 und 2000–2699. Standard ACLs: 1–99 und 1300–1999.",
      theoryRef: "acl"
    },
    {
      q: "Wie viele ACLs können pro Interface, pro Richtung und pro Protokoll angewendet werden?",
      options: ["Unbegrenzt", "Maximal 2", "Genau 1", "Maximal 5"],
      correct: 2,
      explanation: "Pro Interface, pro Protokoll (z.B. IP) und pro Richtung (in/out) kann nur EINE ACL angewendet werden.",
      theoryRef: "acl"
    },
    {
      q: "Was filtert eine Extended ACL zusätzlich zur Quell-IP?",
      options: ["Nur Ziel-IP", "Nur Port-Nummern", "Ziel-IP, Protokoll und Ports", "VLAN-IDs"],
      correct: 2,
      explanation: "Extended ACLs können nach Quell-IP, Ziel-IP, Protokoll (TCP/UDP/ICMP) und Ports filtern — sehr granulare Kontrolle.",
      theoryRef: "acl"
    }
  ],
  "device-security": [
    {
      q: "Was ist der Unterschied zwischen 'enable password' und 'enable secret'?",
      options: ["Kein Unterschied", "enable secret verwendet stärkere MD5-Verschlüsselung, enable password ist schwächer", "enable password ist neuer", "enable secret gilt nur für SSH"],
      correct: 1,
      explanation: "'enable secret' verwendet MD5-Hashing und ist sicherer. 'enable password' ist schwächer (reversible Verschlüsselung mit Type-7). Immer 'enable secret' verwenden!",
      theoryRef: "device-security"
    },
    {
      q: "Welcher Befehl wird benötigt, bevor SSH konfiguriert werden kann?",
      options: ["ip ssh enable", "crypto key generate rsa", "ip domain-name", "Beides: ip domain-name UND crypto key generate rsa"],
      correct: 3,
      explanation: "Für SSH wird zuerst ein Domain-Name ('ip domain-name') benötigt, dann können RSA-Schlüssel generiert werden ('crypto key generate rsa').",
      theoryRef: "device-security"
    },
    {
      q: "Was macht 'switchport port-security violation shutdown'?",
      options: ["Loggt den Verstoß und verwirft Pakete", "Verwirft nur Pakete ohne Logging", "Deaktiviert den Port (err-disabled) bei Verstoß", "Setzt den Port in VLAN 1"],
      correct: 2,
      explanation: "'shutdown' ist die restriktivste Violation-Aktion: der Port wird err-disabled und muss manuell wiederhergestellt werden.",
      theoryRef: "device-security"
    }
  ],
  "automation": [
    {
      q: "Welches Automatisierungstool ist agentless und verwendet SSH?",
      options: ["Puppet", "Chef", "Ansible", "SaltStack"],
      correct: 2,
      explanation: "Ansible ist agentless — es braucht keine Software auf den Zielgeräten und kommuniziert über SSH. Puppet und Chef benötigen Agents.",
      theoryRef: "automation"
    },
    {
      q: "Was ist der Unterschied zwischen Control Plane und Data Plane bei SDN?",
      options: ["Control Plane leitet Pakete weiter, Data Plane trifft Routing-Entscheidungen", "Control Plane trifft Routing-Entscheidungen, Data Plane leitet Pakete weiter", "Beide Planes sind identisch bei SDN", "SDN hat keine separate Data Plane"],
      correct: 1,
      explanation: "Control Plane = Routing-Entscheidungen (wo soll das Paket hin?). Data Plane = tatsächliche Paketweiterleitung. SDN zentralisiert die Control Plane im Controller.",
      theoryRef: "automation"
    },
    {
      q: "Welche HTTP-Methode wird bei REST APIs für das Lesen von Daten verwendet?",
      options: ["POST", "PUT", "GET", "PATCH"],
      correct: 2,
      explanation: "GET = Daten lesen (Read). POST = erstellen, PUT = ersetzen, PATCH = teilweise ändern, DELETE = löschen.",
      theoryRef: "automation"
    }
  ]
};

// Flashcards (term → definition)
const FLASHCARDS = {
  "osi-model": [
    { front: "OSI Layer 2", back: "Data Link Layer — MAC-Adressen, Frames, Switches" },
    { front: "OSI Layer 3", back: "Network Layer — IP-Adressen, Pakete, Router" },
    { front: "OSI Layer 4", back: "Transport Layer — TCP/UDP, Segmente, Ports" },
    { front: "PDU auf Layer 3", back: "Paket (Packet)" },
    { front: "Encapsulation", back: "Hinzufügen von Headern pro Schicht beim Senden" },
    { front: "Hub", back: "Layer-1-Gerät — wiederholt Signale an alle Ports (Shared Medium)" }
  ],
  "tcp-udp": [
    { front: "Three-Way Handshake", back: "SYN → SYN-ACK → ACK (TCP-Verbindungsaufbau)" },
    { front: "HTTP Port", back: "80/TCP" },
    { front: "HTTPS Port", back: "443/TCP" },
    { front: "SSH Port", back: "22/TCP" },
    { front: "DNS Port", back: "53/UDP (primär) und TCP (Zone Transfer)" },
    { front: "DHCP Ports", back: "Server: 67/UDP, Client: 68/UDP" }
  ],
  "ipv4": [
    { front: "Anzahl Hosts bei /30", back: "2 (2^2 - 2 = 2, typisch für Point-to-Point)" },
    { front: "Private Klasse A", back: "10.0.0.0/8" },
    { front: "Private Klasse B", back: "172.16.0.0/12" },
    { front: "Private Klasse C", back: "192.168.0.0/16" },
    { front: "Loopback-Adresse IPv4", back: "127.0.0.1 (Bereich 127.x.x.x)" },
    { front: "CIDR /24 → Hosts", back: "254 (2^8 - 2)" }
  ],
  "vlans": [
    { front: "Native VLAN", back: "VLAN, dessen Traffic auf einem Trunk ungetaggt wird (Standard: VLAN 1)" },
    { front: "802.1Q", back: "IEEE-Standard für VLAN-Tagging auf Trunk-Ports" },
    { front: "Access Port", back: "Switch-Port der zu genau einem VLAN gehört (für Endgeräte)" },
    { front: "Trunk Port", back: "Switch-Port der Traffic mehrerer VLANs trägt" },
    { front: "SVI", back: "Switched Virtual Interface — IP-Interface für ein VLAN auf einem L3-Switch" }
  ],
  "ospf": [
    { front: "OSPF Algorithmus", back: "Dijkstra SPF (Shortest Path First)" },
    { front: "OSPF AD", back: "110" },
    { front: "OSPF Multicast (alle Router)", back: "224.0.0.5" },
    { front: "OSPF DR/BDR Multicast", back: "224.0.0.6" },
    { front: "OSPF Cost Formel", back: "100 Mbps / Interface-Bandbreite" },
    { front: "OSPF Protocol Number", back: "89" }
  ],
  "acl": [
    { front: "Standard ACL Nummern", back: "1–99 und 1300–1999 (nur Quell-IP)" },
    { front: "Extended ACL Nummern", back: "100–199 und 2000–2699" },
    { front: "Implizites Ende jeder ACL", back: "deny any (alle nicht erlaubten Pakete werden geblockt)" },
    { front: "Standard ACL Platzierung", back: "Nah am Ziel" },
    { front: "Extended ACL Platzierung", back: "Nah an der Quelle" }
  ]
};

// ============ REGISTRY HELPER ============
// Wird von den Erweiterungsdateien (js/topics/*.js) genutzt, um Themen an der
// richtigen Stelle innerhalb ihrer Domäne einzufügen.
function registerTopic(topic, opts) {
  opts = opts || {};
  if (TOPICS.some(t => t.id === topic.id)) return;
  let idx = TOPICS.length;
  if (opts.before) {
    const i = TOPICS.findIndex(t => t.id === opts.before);
    if (i >= 0) idx = i;
  } else if (opts.after) {
    const i = TOPICS.findIndex(t => t.id === opts.after);
    if (i >= 0) idx = i + 1;
  }
  TOPICS.splice(idx, 0, topic);
  if (opts.quiz) QUIZZES[topic.id] = opts.quiz;
  if (opts.flashcards) FLASHCARDS[topic.id] = opts.flashcards;
}

// Ergänzt bestehende Themen um zusätzliche Quizfragen / Flashcards
function extendTopic(id, opts) {
  opts = opts || {};
  if (opts.quiz) QUIZZES[id] = (QUIZZES[id] || []).concat(opts.quiz);
  if (opts.flashcards) FLASHCARDS[id] = (FLASHCARDS[id] || []).concat(opts.flashcards);
}
