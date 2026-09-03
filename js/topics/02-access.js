// ===== Domain 2: Network Access (20%) — Erweiterungen nach Blueprint v1.1 =====

// ---------- 2.3 CDP & LLDP ----------
registerTopic({
  id: "cdp-lldp",
  domain: "Network Access",
  domainPct: "20%",
  icon: "🔍",
  title: "CDP & LLDP",
  tags: ["Blueprint 2.3", "Discovery", "Layer 2"],
  content: `
    <div class="content-section">
      <h3>🔍 Layer-2-Discovery-Protokolle</h3>
      <p>CDP und LLDP lassen direkt verbundene Geräte <strong>Informationen über sich austauschen</strong>: Hostname, Plattform, IP, Port, Software-Version, VLAN. Extrem nützlich für Dokumentation und Troubleshooting („Was hängt am anderen Ende?“) — aber auch ein Sicherheitsrisiko an ungesicherten Ports.</p>
      <div class="table-wrap"><table>
        <tr><th>Merkmal</th><th>CDP</th><th>LLDP</th></tr>
        <tr><td>Standard</td><td>Cisco-proprietär</td><td>IEEE 802.1AB (herstellerneutral)</td></tr>
        <tr><td>Standardmäßig aktiv?</td><td><strong>Ja</strong> (global + alle Interfaces)</td><td><strong>Nein</strong> (muss aktiviert werden)</td></tr>
        <tr><td>Sendeintervall</td><td>60 s</td><td>30 s</td></tr>
        <tr><td>Holdtime</td><td>180 s</td><td>120 s</td></tr>
        <tr><td>Multicast-MAC</td><td>0100.0CCC.CCCC</td><td>0180.C200.000E</td></tr>
        <tr><td>Richtung pro Interface</td><td>ein/aus</td><td>getrennt: <code>lldp transmit</code> / <code>lldp receive</code></td></tr>
        <tr><td>Erweiterung</td><td>—</td><td>LLDP-MED (Media Endpoint Discovery — VoIP, Voice-VLAN, PoE)</td></tr>
      </table></div>
    </div>

    <div class="content-section">
      <h3>⚙️ CDP konfigurieren und verifizieren</h3>
      <pre><code><span class="cli-comment"># Global aus/an</span>
Switch(config)# no cdp run
Switch(config)# cdp run

<span class="cli-comment"># Pro Interface (z.B. auf Ports zu Endgeräten / Internet deaktivieren)</span>
Switch(config-if)# no cdp enable

<span class="cli-comment"># Timer</span>
Switch(config)# cdp timer 60
Switch(config)# cdp holdtime 180

<span class="cli-comment"># Verifikation</span>
Switch# show cdp
Switch# show cdp neighbors
Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge
                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone

Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID
R1               Gig 0/1           156            R S I   ISR4331   Gig 0/0/0
SW2              Gig 0/2           142            S I     WS-C2960  Gig 0/1

Switch# show cdp neighbors detail        <span class="cli-comment"># + IP-Adresse, IOS-Version, Native VLAN, Duplex</span>
Switch# show cdp entry R1
Switch# show cdp interface gi0/1
Switch# show cdp traffic</code></pre>
      <div class="callout callout-tip"><strong>Spaltentrick</strong><em>Local Intrfce</em> = MEIN Port · <em>Port ID</em> = Port des NACHBARN. In Prüfungsfragen wird das gerne vertauscht.</div>
    </div>

    <div class="content-section">
      <h3>⚙️ LLDP konfigurieren und verifizieren</h3>
      <pre><code><span class="cli-comment"># Global aktivieren</span>
Switch(config)# lldp run

<span class="cli-comment"># Pro Interface — Senden und Empfangen getrennt steuerbar</span>
Switch(config-if)# no lldp transmit
Switch(config-if)# no lldp receive

<span class="cli-comment"># Timer</span>
Switch(config)# lldp timer 30
Switch(config)# lldp holdtime 120
Switch(config)# lldp reinit 2

<span class="cli-comment"># Verifikation</span>
Switch# show lldp
Switch# show lldp neighbors
Capability codes:
    (R) Router, (B) Bridge, (T) Telephone, (C) DOCSIS Cable Device
    (W) WLAN Access Point, (P) Repeater, (S) Station, (O) Other

Device ID           Local Intf     Hold-time  Capability      Port ID
R1                  Gi0/1          120        R               Gi0/0/0
Switch# show lldp neighbors detail
Switch# show lldp entry R1</code></pre>
      <div class="callout callout-warn"><strong>Sicherheit</strong>CDP/LLDP verraten IOS-Version, IP und Plattform. Best Practice: auf Ports zu Endgeräten, Gastnetzen und ISP-Uplinks <strong>deaktivieren</strong>. IP-Telefone brauchen CDP oder LLDP-MED aber für das Voice-VLAN!</div>
    </div>
  `
}, {
  after: "vlans",
  quiz: [
    {
      q: "Welche Aussage zu CDP und LLDP ist korrekt?",
      options: ["Beide sind IEEE-Standards", "CDP ist Cisco-proprietär und standardmäßig aktiv, LLDP ist IEEE 802.1AB und standardmäßig deaktiviert", "LLDP ist Cisco-proprietär", "Beide sind auf Cisco-Geräten standardmäßig deaktiviert"],
      correct: 1,
      explanation: "CDP: Cisco-proprietär, standardmäßig an. LLDP: IEEE 802.1AB, herstellerneutral, muss mit 'lldp run' aktiviert werden.",
      theoryRef: "cdp-lldp"
    },
    {
      q: "Welche Standard-Timer hat CDP (Sendeintervall / Holdtime)?",
      options: ["30 s / 120 s", "60 s / 180 s", "10 s / 40 s", "5 s / 15 s"],
      correct: 1,
      explanation: "CDP sendet alle 60 Sekunden, Holdtime 180 s. LLDP: 30 s / 120 s.",
      theoryRef: "cdp-lldp"
    },
    {
      q: "In der Ausgabe von 'show cdp neighbors' — was zeigt die Spalte 'Port ID'?",
      options: ["Den lokalen Port", "Den Port des Nachbargeräts", "Die VLAN-ID", "Die Port-Priorität"],
      correct: 1,
      explanation: "'Local Intrfce' ist der eigene Port, 'Port ID' der Port auf dem Nachbargerät.",
      theoryRef: "cdp-lldp"
    },
    {
      q: "Mit welchem Befehl deaktivierst du CDP nur auf einem bestimmten Interface?",
      options: ["no cdp run", "no cdp enable", "cdp disable", "no cdp interface"],
      correct: 1,
      explanation: "'no cdp enable' im Interface-Modus deaktiviert CDP pro Port. 'no cdp run' (global) schaltet CDP auf dem ganzen Gerät ab.",
      theoryRef: "cdp-lldp"
    },
    {
      q: "Welcher Befehl zeigt die IP-Adresse und IOS-Version eines CDP-Nachbarn?",
      options: ["show cdp neighbors", "show cdp neighbors detail", "show cdp traffic", "show cdp interface"],
      correct: 1,
      explanation: "'show cdp neighbors detail' (oder 'show cdp entry <name>') liefert zusätzlich IP-Adresse, Software-Version, Native VLAN und Duplex.",
      theoryRef: "cdp-lldp"
    }
  ],
  flashcards: [
    { front: "CDP Timer", back: "60 s Sendeintervall / 180 s Holdtime" },
    { front: "LLDP Timer", back: "30 s Sendeintervall / 120 s Holdtime" },
    { front: "LLDP Standard", back: "IEEE 802.1AB — herstellerneutral, standardmäßig aus" },
    { front: "CDP pro Interface aus", back: "no cdp enable (global: no cdp run)" },
    { front: "LLDP aktivieren", back: "lldp run (global)" },
    { front: "Port ID in show cdp neighbors", back: "Port des Nachbargeräts (Local Intrfce = eigener Port)" }
  ]
});

// ---------- 2.6 / 2.7 / 2.9 Wireless-Architekturen & WLC ----------
registerTopic({
  id: "wireless-arch",
  domain: "Network Access",
  domainPct: "20%",
  icon: "📡",
  title: "Wireless-Architekturen & WLC",
  tags: ["Blueprint 2.6", "Blueprint 2.7", "Blueprint 2.9", "WLAN", "WLC", "CAPWAP"],
  content: `
    <div class="content-section">
      <h3>📡 Autonomous vs. Lightweight vs. Cloud-based</h3>
      <div class="table-wrap"><table>
        <tr><th>Architektur</th><th>Beschreibung</th><th>Vor-/Nachteile</th></tr>
        <tr><td><strong>Autonomous AP</strong></td><td>Jeder AP ist eigenständig (eigenes IOS, eigene Konfiguration via CLI/GUI). Verbindung zum Switch meist als <strong>Trunk</strong> (mehrere SSIDs → VLANs).</td><td>Einfach für 1–5 APs; skaliert schlecht, kein zentrales RF-Management</td></tr>
        <tr><td><strong>Lightweight AP + WLC</strong> (Split-MAC)</td><td>Der AP übernimmt nur Echtzeit-Funktionen (Funk, Beacons, ACKs, Verschlüsselung). Der <strong>WLC</strong> übernimmt Management-Funktionen (Authentifizierung, Roaming, RF-Management, Policies). Kommunikation über <strong>CAPWAP</strong>.</td><td>Zentral, skaliert auf tausende APs, Roaming, RRM; WLC = Single Point of Failure → HA</td></tr>
        <tr><td><strong>Cloud-based</strong> (z.B. Cisco Meraki)</td><td>Management-Plane in der Cloud (Dashboard). Der Daten-Traffic bleibt lokal — nur Management/Telemetrie geht in die Cloud.</td><td>Sehr einfaches Management, Multi-Site; Abhängigkeit vom Abonnement/Internet</td></tr>
      </table></div>
    </div>

    <div class="content-section">
      <h3>🔗 CAPWAP — Control and Provisioning of Wireless Access Points</h3>
      <ul>
        <li>Zwei Tunnel zwischen AP und WLC: <strong>Control</strong> (UDP <strong>5246</strong>, verschlüsselt via DTLS) und <strong>Data</strong> (UDP <strong>5247</strong>, optional DTLS).</li>
        <li>Client-Traffic wird standardmäßig <em>durch den Tunnel</em> zum WLC geschickt und dort in das richtige VLAN gesetzt (<strong>central switching</strong>).</li>
        <li>AP findet den WLC über: statische Konfiguration, DHCP Option 43, DNS (<code>CISCO-CAPWAP-CONTROLLER.domain</code>), Broadcast im Subnetz, zuvor bekannte WLCs.</li>
      </ul>
      <pre><code>   Lightweight AP  ══ CAPWAP Control (UDP 5246) ══►  WLC
                   ══ CAPWAP Data    (UDP 5247) ══►
   Access-Port (1 VLAN)                        Trunk (alle Client-VLANs + Mgmt)</code></pre>
    </div>

    <div class="content-section">
      <h3>🎛️ AP-Modi (Blueprint 2.6)</h3>
      <div class="table-wrap"><table>
        <tr><th>Modus</th><th>Funktion</th></tr>
        <tr><td><strong>Local</strong></td><td>Standard. Bedient Clients (BSS), Traffic zentral über WLC. Scannt zwischendurch andere Kanäle (Rogue-Erkennung, RRM).</td></tr>
        <tr><td><strong>FlexConnect</strong></td><td>Für Außenstellen: bei WAN-Ausfall zum WLC arbeitet der AP <strong>eigenständig weiter</strong>; Traffic kann lokal geswitcht werden.</td></tr>
        <tr><td><strong>Monitor</strong></td><td>Bedient <em>keine</em> Clients — nur Scannen: Rogue-APs, IDS, Location (Standortbestimmung).</td></tr>
        <tr><td><strong>Sniffer</strong></td><td>Zeichnet 802.11-Frames auf einem Kanal auf und sendet sie an einen Analyzer (Wireshark).</td></tr>
        <tr><td><strong>Rogue Detector</strong></td><td>Radio aus; lauscht am kabelgebundenen Netz nach MAC-Adressen von Rogue-Clients/APs.</td></tr>
        <tr><td><strong>Bridge / Mesh</strong></td><td>Punkt-zu-Punkt- oder Punkt-zu-Mehrpunkt-Brücke zwischen Gebäuden (Root AP / Mesh AP).</td></tr>
        <tr><td><strong>Flex+Bridge</strong></td><td>FlexConnect + Mesh kombiniert.</td></tr>
        <tr><td><strong>SE-Connect</strong></td><td>Spectrum Expert — Spektrumanalyse (Störquellen finden), bedient keine Clients.</td></tr>
      </table></div>
    </div>

    <div class="content-section">
      <h3>🔌 Physische Anbindung: AP, WLC, Access/Trunk, LAG (Blueprint 2.7)</h3>
      <div class="table-wrap"><table>
        <tr><th>Verbindung</th><th>Port-Typ</th><th>Warum</th></tr>
        <tr><td>Lightweight AP ↔ Switch</td><td><strong>Access-Port</strong> (im AP-Management-VLAN), PoE</td><td>Client-Traffic geht getunnelt zum WLC — der AP braucht nur ein VLAN</td></tr>
        <tr><td>Autonomous AP ↔ Switch</td><td><strong>Trunk</strong></td><td>Jede SSID wird lokal auf ein VLAN gemappt</td></tr>
        <tr><td>FlexConnect AP (lokal geswitcht) ↔ Switch</td><td><strong>Trunk</strong></td><td>Client-VLANs müssen lokal am AP anliegen</td></tr>
        <tr><td>WLC ↔ Switch</td><td><strong>Trunk</strong> + <strong>LAG</strong> (EtherChannel, Mode ON)</td><td>WLC setzt Client-Traffic in die jeweiligen VLANs; LAG bündelt Bandbreite und Redundanz</td></tr>
      </table></div>
      <h4>WLC-Ports und -Interfaces</h4>
      <div class="table-wrap"><table>
        <tr><th>Physische Ports</th><th>Logische Interfaces</th></tr>
        <tr><td><strong>Service Port</strong> — Out-of-band-Management (eigenes Netz)</td><td><strong>Management Interface</strong> — In-band-Management, CAPWAP-Terminierung, SSH/HTTPS</td></tr>
        <tr><td><strong>Distribution System Ports</strong> — Trunk-Uplinks zum Switch (als LAG gebündelt)</td><td><strong>Virtual Interface</strong> — Pseudo-IP (z.B. 192.0.2.1) für Client-DHCP-Relay, Web-Auth, Mobility</td></tr>
        <tr><td><strong>Console Port</strong></td><td><strong>Dynamic Interfaces</strong> — pro Client-VLAN eine (wie SVIs), werden WLANs zugeordnet</td></tr>
        <tr><td><strong>Redundancy Port</strong> — HA-Paar (SSO)</td><td><strong>AP-Manager Interface</strong> — (ältere WLCs) CAPWAP-Endpunkt</td></tr>
      </table></div>
      <div class="callout callout-info"><strong>LAG am WLC</strong>Der WLC unterstützt <strong>kein LACP/PAgP</strong> — die Switch-Seite muss <code>channel-group 1 mode on</code> nutzen. Alle DS-Ports werden zu einem LAG zusammengefasst.</div>
    </div>

    <div class="content-section">
      <h3>🖥️ WLAN in der WLC-GUI anlegen (Blueprint 2.9)</h3>
      <p>Für die Prüfung musst du die GUI-Konfiguration <strong>interpretieren</strong> können. Ablauf auf einem klassischen AireOS-WLC (Catalyst 9800 ist ähnlich strukturiert):</p>
      <ol>
        <li><strong>Controller → Interfaces → New:</strong> Dynamic Interface anlegen (Name, VLAN-ID, IP, Gateway, DHCP-Server).</li>
        <li><strong>WLANs → Create New:</strong> Profile Name, <strong>SSID</strong>, WLAN-ID (1–16 werden standardmäßig von APs ausgestrahlt, &gt;16 nur über AP-Groups).</li>
        <li><strong>General-Tab:</strong> Status <em>Enabled</em>, Radio Policy (All / 2,4 / 5 GHz), <strong>Interface</strong> (= VLAN), <strong>Broadcast SSID</strong> an/aus.</li>
        <li><strong>Security → Layer 2:</strong> WPA+WPA2 / WPA3, Encryption AES (CCMP), Auth Key Mgmt: <strong>PSK</strong> (Pre-Shared Key eintragen) oder <strong>802.1X</strong> (RADIUS). Optional MAC-Filtering.</li>
        <li><strong>Security → Layer 3:</strong> Web Policy (Web-Auth / Passthrough für Gastportale) — normalerweise <em>None</em>.</li>
        <li><strong>Security → AAA Servers:</strong> RADIUS-Server für 802.1X auswählen.</li>
        <li><strong>QoS-Tab:</strong> Profil <strong>Platinum (Voice)</strong> · <strong>Gold (Video)</strong> · <strong>Silver (Best Effort, Standard)</strong> · <strong>Bronze (Background)</strong>; WMM Policy (Allowed/Required), Call Admission Control.</li>
        <li><strong>Advanced-Tab:</strong> Session Timeout, <strong>Client Exclusion</strong> (Sperrzeit nach Fehlversuchen), <strong>Peer-to-Peer Blocking</strong>, DHCP Address Assignment <em>Required</em>, Client Band Select, Load Balancing, AP Groups, FlexConnect Local Switching, 802.11k/v/r (Fast Roaming), Maximum Allowed Clients.</li>
        <li><strong>Apply</strong> → Konfiguration mit <strong>Save Configuration</strong> speichern.</li>
      </ol>
      <div class="callout callout-tip"><strong>Typische Prüfungsfragen</strong>„Clients können das WLAN nicht sehen“ → <em>Broadcast SSID</em> aus oder WLAN-Status <em>Disabled</em>. „Clients verbinden sich, bekommen aber keine IP“ → falsches <em>Interface/VLAN</em> oder DHCP-Server fehlt. „VoIP ruckelt“ → QoS-Profil auf <em>Platinum</em>.</div>
    </div>
  `
}, {
  after: "etherchannel",
  quiz: [
    {
      q: "Welche UDP-Ports verwendet CAPWAP für Control- und Data-Tunnel?",
      options: ["5246 (Control) und 5247 (Data)", "1812 und 1813", "500 und 4500", "161 und 162"],
      correct: 0,
      explanation: "CAPWAP Control = UDP 5246 (DTLS-verschlüsselt), CAPWAP Data = UDP 5247. 1812/1813 ist RADIUS, 500/4500 IKE/NAT-T, 161/162 SNMP.",
      theoryRef: "wireless-arch"
    },
    {
      q: "In welchem AP-Modus bedient der AP weiterhin Clients, auch wenn die Verbindung zum WLC ausfällt?",
      options: ["Local", "Monitor", "FlexConnect", "Sniffer"],
      correct: 2,
      explanation: "FlexConnect ist für Außenstellen gedacht: Bei WAN-/WLC-Ausfall wechselt der AP in den Standalone-Modus und bedient Clients weiterhin lokal.",
      theoryRef: "wireless-arch"
    },
    {
      q: "Wie sollte der Switch-Port zu einem Lightweight-AP im Local-Modus konfiguriert werden?",
      options: ["Als Trunk mit allen Client-VLANs", "Als Access-Port im AP-Management-VLAN", "Als Routed Port", "Als EtherChannel mit LACP"],
      correct: 1,
      explanation: "Beim Split-MAC-Modell wird der Client-Traffic per CAPWAP zum WLC getunnelt. Der AP braucht daher nur ein VLAN → Access-Port. Der WLC hängt am Trunk.",
      theoryRef: "wireless-arch"
    },
    {
      q: "Welches QoS-Profil im WLC ist für Sprache (VoIP) vorgesehen?",
      options: ["Bronze", "Silver", "Gold", "Platinum"],
      correct: 3,
      explanation: "Platinum = Voice, Gold = Video, Silver = Best Effort (Standard), Bronze = Background.",
      theoryRef: "wireless-arch"
    },
    {
      q: "Welcher Modus muss auf dem Switch für den EtherChannel (LAG) zum WLC konfiguriert werden?",
      options: ["active (LACP)", "desirable (PAgP)", "on", "auto"],
      correct: 2,
      explanation: "Der WLC unterstützt kein LACP oder PAgP. Der Switch muss 'channel-group X mode on' verwenden.",
      theoryRef: "wireless-arch"
    },
    {
      q: "Welches logische WLC-Interface wird für Client-DHCP-Relay und Web-Authentifizierung mit einer Pseudo-IP genutzt?",
      options: ["Management Interface", "Service Port", "Virtual Interface", "Dynamic Interface"],
      correct: 2,
      explanation: "Das Virtual Interface (z.B. 192.0.2.1) dient als DHCP-Relay-Adresse, für Web-Auth-Redirects und Mobility. Dynamic Interfaces entsprechen Client-VLANs.",
      theoryRef: "wireless-arch"
    }
  ],
  flashcards: [
    { front: "CAPWAP Ports", back: "UDP 5246 Control (DTLS), UDP 5247 Data" },
    { front: "Split-MAC", back: "AP = Echtzeit (Funk, Beacons, ACK); WLC = Management (Auth, Roaming, RRM)" },
    { front: "FlexConnect", back: "AP-Modus für Außenstellen — arbeitet bei WLC-Ausfall eigenständig weiter" },
    { front: "Monitor-Modus", back: "Bedient keine Clients — nur Scannen (Rogue, IDS, Location)" },
    { front: "Lightweight-AP Switchport", back: "Access-Port (Mgmt-VLAN); WLC = Trunk + LAG (mode on)" },
    { front: "WLC QoS-Profile", back: "Platinum (Voice) · Gold (Video) · Silver (Best Effort) · Bronze (Background)" },
    { front: "WLC Virtual Interface", back: "Pseudo-IP (192.0.2.1) für DHCP-Relay, Web-Auth, Mobility" },
    { front: "WLC Dynamic Interface", back: "Entspricht einem Client-VLAN (wie SVI), wird dem WLAN zugeordnet" }
  ]
});

// ---------- 2.8 Geräteverwaltung & Zugriff ----------
registerTopic({
  id: "mgmt-access",
  domain: "Network Access",
  domainPct: "20%",
  icon: "🖥️",
  title: "Management-Zugriff auf Geräte",
  tags: ["Blueprint 2.8", "Console", "SSH", "TACACS+", "RADIUS"],
  content: `
    <div class="content-section">
      <h3>🖥️ Zugriffswege auf Cisco-Geräte</h3>
      <div class="table-wrap"><table>
        <tr><th>Zugang</th><th>Typ</th><th>Port</th><th>Sicherheit</th><th>Einsatz</th></tr>
        <tr><td><strong>Console</strong></td><td>Out-of-band, seriell (RJ-45/USB, 9600 8N1)</td><td>—</td><td>Physischer Zugang nötig</td><td>Erstkonfiguration, Recovery, Netzausfall</td></tr>
        <tr><td><strong>AUX</strong></td><td>Out-of-band (Modem)</td><td>—</td><td>Legacy</td><td>Remote-Konsole per Modem</td></tr>
        <tr><td><strong>Telnet</strong></td><td>In-band CLI</td><td>TCP 23</td><td><strong>Unverschlüsselt</strong> — nicht verwenden!</td><td>Nur Lab / Legacy</td></tr>
        <tr><td><strong>SSH</strong></td><td>In-band CLI</td><td>TCP 22</td><td>Verschlüsselt (SSHv2)</td><td>Standard für Remote-CLI</td></tr>
        <tr><td><strong>HTTP</strong></td><td>In-band GUI</td><td>TCP 80</td><td>Unverschlüsselt</td><td>Vermeiden</td></tr>
        <tr><td><strong>HTTPS</strong></td><td>In-band GUI</td><td>TCP 443</td><td>TLS-verschlüsselt</td><td>WLC-GUI, Web-UI von Switches/Routern</td></tr>
        <tr><td><strong>Cloud managed</strong></td><td>Management via Cloud-Dashboard</td><td>TLS (443)</td><td>Gerät baut ausgehenden Tunnel zur Cloud</td><td>Meraki, Catalyst über Meraki Dashboard</td></tr>
      </table></div>
      <div class="callout callout-info"><strong>In-band vs. Out-of-band</strong><strong>In-band</strong> = Management über das produktive Netz (SSH über das Daten-VLAN). <strong>Out-of-band</strong> = eigener Weg (Console, Service Port, dediziertes Mgmt-Netz) — funktioniert auch, wenn das Produktivnetz ausgefallen ist.</div>
    </div>

    <div class="content-section">
      <h3>⚙️ Konfiguration der Zugänge</h3>
      <pre><code><span class="cli-comment"># Console absichern</span>
R1(config)# line console 0
R1(config-line)# password C0nsole!
R1(config-line)# login                  <span class="cli-comment"># oder: login local (Benutzerdatenbank)</span>
R1(config-line)# exec-timeout 10 0
R1(config-line)# logging synchronous    <span class="cli-comment"># Syslog-Meldungen unterbrechen Eingabe nicht</span>

<span class="cli-comment"># SSH (Voraussetzungen: Hostname, Domain-Name, RSA-Key, lokaler User)</span>
R1(config)# hostname R1
R1(config)# ip domain-name firma.local
R1(config)# crypto key generate rsa modulus 2048
R1(config)# ip ssh version 2
R1(config)# username admin privilege 15 secret S3cret!
R1(config)# line vty 0 15
R1(config-line)# transport input ssh     <span class="cli-comment"># Telnet aus; 'transport input none' = kein Remote-Zugang</span>
R1(config-line)# login local
R1(config-line)# access-class 10 in      <span class="cli-comment"># ACL: nur Management-Netz darf sich verbinden</span>

<span class="cli-comment"># HTTPS-Server (Web-UI) an, HTTP aus</span>
R1(config)# no ip http server
R1(config)# ip http secure-server
R1(config)# ip http authentication local

<span class="cli-comment"># Management-Interface auf einem Switch (SVI) + Default Gateway</span>
SW1(config)# interface vlan 99
SW1(config-if)# ip address 10.99.0.10 255.255.255.0
SW1(config-if)# no shutdown
SW1(config)# ip default-gateway 10.99.0.1

<span class="cli-comment"># Verifikation</span>
R1# show ip ssh
R1# show ssh
R1# show users
R1# show line</code></pre>
    </div>

    <div class="content-section">
      <h3>🔑 Zentrale Authentifizierung: TACACS+ vs. RADIUS</h3>
      <p>Statt lokaler Benutzer auf jedem Gerät nutzt man einen <strong>AAA-Server</strong> (z.B. Cisco ISE). Zwei Protokolle:</p>
      <div class="table-wrap"><table>
        <tr><th>Merkmal</th><th>TACACS+</th><th>RADIUS</th></tr>
        <tr><td>Herkunft</td><td>Cisco-proprietär</td><td>Offener Standard (IETF)</td></tr>
        <tr><td>Transport</td><td><strong>TCP 49</strong></td><td><strong>UDP 1812</strong> (Auth) / <strong>1813</strong> (Acct) — legacy 1645/1646</td></tr>
        <tr><td>Verschlüsselung</td><td>Gesamtes Paket</td><td>Nur das Passwort</td></tr>
        <tr><td>AAA-Trennung</td><td>Authentication, Authorization, Accounting <strong>getrennt</strong></td><td>Authentication + Authorization <strong>kombiniert</strong></td></tr>
        <tr><td>Stärke</td><td><strong>Device Administration</strong> — Befehlsautorisierung pro Kommando</td><td><strong>Netzwerkzugang</strong> — 802.1X, WLAN, VPN-Nutzer</td></tr>
      </table></div>
      <pre><code><span class="cli-comment"># AAA mit TACACS+ und lokalem Fallback</span>
R1(config)# aaa new-model
R1(config)# tacacs server ISE
R1(config-server-tacacs)# address ipv4 10.1.1.50
R1(config-server-tacacs)# key TacacsKey!
R1(config)# aaa authentication login default group tacacs+ local
R1(config)# aaa authorization exec default group tacacs+ local
R1(config)# aaa accounting exec default start-stop group tacacs+</code></pre>
      <div class="callout callout-tip"><strong>Merkhilfe</strong><strong>T</strong>ACACS+ = <strong>T</strong>CP, <strong>T</strong>otal verschlüsselt, für <strong>T</strong>echniker (Geräte-Admin). RADIUS = UDP, für <strong>User</strong> (Netzwerkzugang).</div>
    </div>
  `
}, {
  after: "wireless-arch",
  quiz: [
    {
      q: "Welches Protokoll nutzt TCP Port 49 und verschlüsselt das gesamte Paket?",
      options: ["RADIUS", "TACACS+", "SSH", "SNMPv3"],
      correct: 1,
      explanation: "TACACS+ (Cisco) nutzt TCP 49 und verschlüsselt den gesamten Payload. RADIUS nutzt UDP 1812/1813 und verschlüsselt nur das Passwort.",
      theoryRef: "mgmt-access"
    },
    {
      q: "Welche Befehle sind Voraussetzung, damit ein Router RSA-Schlüssel für SSH generieren kann?",
      options: ["enable secret und banner motd", "hostname und ip domain-name", "ip ssh version 2 und line vty", "username und login local"],
      correct: 1,
      explanation: "Der RSA-Schlüssel wird aus Hostname + Domain-Name benannt. Ohne beide schlägt 'crypto key generate rsa' fehl.",
      theoryRef: "mgmt-access"
    },
    {
      q: "Was bewirkt 'transport input ssh' auf den VTY-Lines?",
      options: ["Erlaubt Telnet und SSH", "Erlaubt nur SSH als Remote-Zugang, Telnet wird abgelehnt", "Deaktiviert den Remote-Zugang komplett", "Aktiviert HTTPS"],
      correct: 1,
      explanation: "'transport input ssh' beschränkt eingehende VTY-Verbindungen auf SSH. 'transport input all' erlaubt Telnet+SSH, 'none' sperrt alles.",
      theoryRef: "mgmt-access"
    },
    {
      q: "Welcher Zugriffsweg gilt als Out-of-band-Management?",
      options: ["SSH über das Daten-VLAN", "HTTPS über das Internet", "Console-Port", "Telnet über das Management-VLAN"],
      correct: 2,
      explanation: "Out-of-band = unabhängig vom produktiven Datennetz, z.B. Console-Port oder Service Port. SSH/HTTPS über das Netz sind In-band.",
      theoryRef: "mgmt-access"
    },
    {
      q: "Für welchen Anwendungsfall ist TACACS+ gegenüber RADIUS besser geeignet?",
      options: ["802.1X-Netzwerkzugang für Clients", "WLAN-Nutzerauthentifizierung", "Geräte-Administration mit Befehlsautorisierung pro Kommando", "VPN-Benutzer-Login"],
      correct: 2,
      explanation: "TACACS+ trennt Authorization von Authentication und kann jeden einzelnen CLI-Befehl autorisieren — ideal für Device Administration. RADIUS ist der Standard für Netzwerkzugang.",
      theoryRef: "mgmt-access"
    }
  ],
  flashcards: [
    { front: "TACACS+ Port", back: "TCP 49 — gesamtes Paket verschlüsselt, AAA getrennt" },
    { front: "RADIUS Ports", back: "UDP 1812 (Authentication) / 1813 (Accounting); legacy 1645/1646" },
    { front: "SSH-Voraussetzungen", back: "hostname, ip domain-name, crypto key generate rsa, username, line vty → transport input ssh + login local" },
    { front: "Console-Einstellungen", back: "9600 Baud, 8 Datenbits, keine Parität, 1 Stoppbit (8N1)" },
    { front: "In-band vs. Out-of-band", back: "Über das Produktivnetz (SSH) vs. getrennt (Console, Service Port)" },
    { front: "access-class 10 in", back: "ACL auf VTY-Lines — begrenzt, wer sich per SSH/Telnet verbinden darf" }
  ]
});

// Flashcards für bestehende Themen STP und EtherChannel
extendTopic("stp", {
  flashcards: [
    { front: "Root Bridge wird …", back: "Switch mit niedrigster Bridge-ID (Priority + MAC)" },
    { front: "Standard STP-Priority", back: "32768 (+ VLAN-ID bei PVST+), Schritte von 4096" },
    { front: "RSTP Port-Rollen", back: "Root · Designated · Alternate · Backup" },
    { front: "RSTP Port-Zustände", back: "Discarding · Learning · Forwarding" },
    { front: "802.1D Konvergenz", back: "30–50 s (Listening 15 s + Learning 15 s + Max Age 20 s)" },
    { front: "PortFast", back: "Access-Port sofort forwarding — nur an Endgeräte-Ports" },
    { front: "BPDU Guard", back: "Port err-disabled bei BPDU-Empfang — schützt Access-Ports" },
    { front: "Root Guard", back: "Blockiert Port, der eine bessere BPDU empfängt (root-inconsistent)" },
    { front: "Loop Guard", back: "Verhindert Forwarding, wenn BPDUs plötzlich ausbleiben (loop-inconsistent)" },
    { front: "STP Cost 10M / 100M / 1G / 10G", back: "100 / 19 / 4 / 2" },
    { front: "Rapid PVST+ aktivieren", back: "spanning-tree mode rapid-pvst" }
  ]
});
extendTopic("etherchannel", {
  flashcards: [
    { front: "LACP Modi", back: "active / passive (IEEE 802.3ad) — mind. eine Seite active" },
    { front: "PAgP Modi", back: "desirable / auto (Cisco) — mind. eine Seite desirable" },
    { front: "channel-group mode on", back: "Statisch, keine Aushandlung — beide Seiten on (z.B. zum WLC)" },
    { front: "Max. Links pro EtherChannel", back: "8 aktive (LACP: bis 16 konfiguriert, 8 aktiv)" },
    { front: "Voraussetzungen EtherChannel", back: "Gleiche Speed, Duplex, VLAN/Trunk-Konfig, Native VLAN, allowed VLANs auf allen Ports" },
    { front: "show etherchannel summary Flags", back: "P = bundled, SU = L2 in use, RU = L3 in use, D = down, s = suspended" },
    { front: "Layer-3 EtherChannel", back: "interface port-channel X → no switchport → ip address" }
  ]
});
