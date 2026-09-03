// ===== Domain 1: Network Fundamentals (20%) — Erweiterungen nach Blueprint v1.1 =====

// ---------- 1.1 Netzwerkkomponenten ----------
registerTopic({
  id: "network-components",
  domain: "Network Fundamentals",
  domainPct: "20%",
  icon: "🧩",
  title: "Netzwerkkomponenten",
  tags: ["Blueprint 1.1", "Grundlagen", "Geräte"],
  content: `
    <div class="content-section">
      <h3>🧩 Rolle und Funktion der Netzwerkkomponenten</h3>
      <p>Der Blueprint verlangt, dass du die <strong>Rolle und Funktion</strong> jeder Komponente erklären kannst — also <em>was</em> das Gerät macht, <em>auf welcher Schicht</em> es arbeitet und <em>wo</em> es im Netzwerk steht.</p>
      <div class="table-wrap"><table>
        <tr><th>Komponente</th><th>OSI-Layer</th><th>Funktion</th><th>Typischer Einsatz</th></tr>
        <tr><td><strong>Router</strong></td><td>3</td><td>Leitet Pakete zwischen Netzen anhand der IP-Zieladresse weiter, trennt Broadcast-Domänen, NAT, ACLs, WAN-Anbindung</td><td>Grenze LAN ↔ WAN / Internet, zwischen Standorten</td></tr>
        <tr><td><strong>Layer-2-Switch</strong></td><td>2</td><td>Leitet Frames anhand der MAC-Adresstabelle weiter, trennt Kollisionsdomänen, VLANs, STP</td><td>Access-Layer: Anschluss von Endgeräten</td></tr>
        <tr><td><strong>Layer-3-Switch</strong></td><td>2 + 3</td><td>Switching <em>und</em> Routing in Hardware (ASIC), Inter-VLAN-Routing via SVIs, Routed Ports</td><td>Distribution-/Core-Layer im Campus</td></tr>
        <tr><td><strong>Next-Generation Firewall (NGFW)</strong></td><td>3–7</td><td>Stateful Filtering + Application Awareness, URL-Filtering, integriertes IPS, Malware-Schutz, User-Identität</td><td>Perimeter, zwischen Sicherheitszonen (Cisco Firepower / ASA)</td></tr>
        <tr><td><strong>IPS (Intrusion Prevention System)</strong></td><td>3–7</td><td>Erkennt Angriffsmuster (Signaturen, Anomalien) <em>inline</em> und blockiert sie aktiv. IDS = nur erkennen/alarmieren (out-of-band)</td><td>Hinter der Firewall, vor Servern</td></tr>
        <tr><td><strong>Access Point (AP)</strong></td><td>1–2</td><td>Übersetzt 802.11 (WLAN) ↔ 802.3 (Ethernet), stellt BSS/SSID bereit</td><td>WLAN-Abdeckung, angeschlossen am Access-Switch (oft PoE)</td></tr>
        <tr><td><strong>Controller (WLC / SDN-Controller)</strong></td><td>Mgmt</td><td>Zentrale Verwaltung: WLC steuert Lightweight-APs (CAPWAP); SDN-Controller (z.B. Catalyst Center) zentralisiert Control Plane/Policy</td><td>Rechenzentrum / Campus-Core</td></tr>
        <tr><td><strong>Endpoints</strong></td><td>1–7</td><td>Endgeräte, die Traffic erzeugen/konsumieren: PC, Laptop, Smartphone, IP-Telefon, IoT, Drucker</td><td>Access-Layer</td></tr>
        <tr><td><strong>Server</strong></td><td>1–7</td><td>Stellen Dienste bereit (Web, DNS, DHCP, Mail, Datei), oft virtualisiert</td><td>Rechenzentrum / Cloud</td></tr>
      </table></div>
      <div class="callout callout-info"><strong>Kollisions- vs. Broadcast-Domäne</strong>Jeder Switch-Port = eigene <strong>Kollisionsdomäne</strong>. Jedes VLAN / jedes Router-Interface = eigene <strong>Broadcast-Domäne</strong>. Ein Hub bildet eine einzige Kollisionsdomäne für alle Ports.</div>
    </div>

    <div class="content-section">
      <h3>🔥 Firewall-Typen im Vergleich</h3>
      <div class="table-wrap"><table>
        <tr><th>Typ</th><th>Prüft</th><th>Merkmal</th></tr>
        <tr><td>Paketfilter (stateless)</td><td>L3/L4-Header pro Paket</td><td>Wie eine ACL — kennt keinen Verbindungszustand</td></tr>
        <tr><td>Stateful Firewall</td><td>Verbindungs-Zustand (Session-Tabelle)</td><td>Erlaubt Rückverkehr einer erlaubten ausgehenden Verbindung automatisch</td></tr>
        <tr><td>NGFW</td><td>+ Applikation (L7), User, URL, Malware</td><td>AVC (Application Visibility &amp; Control), integriertes NGIPS, TLS-Inspektion, Cloud-Threat-Intelligence (Talos)</td></tr>
      </table></div>
    </div>

    <div class="content-section">
      <h3>🔌 PoE — Power over Ethernet</h3>
      <p>PoE liefert Strom über das Ethernet-Kabel — das Gerät braucht kein eigenes Netzteil. Der Switch (<strong>PSE</strong> — Power Sourcing Equipment) versorgt das Endgerät (<strong>PD</strong> — Powered Device) und erkennt vorher per <em>Detection</em>, ob und wie viel Leistung es braucht.</p>
      <div class="table-wrap"><table>
        <tr><th>Standard</th><th>Name</th><th>Leistung am PSE</th><th>Beim PD</th><th>Adernpaare</th><th>Typische Geräte</th></tr>
        <tr><td>802.3af</td><td>PoE (Type 1)</td><td>15,4 W</td><td>12,95 W</td><td>2</td><td>IP-Telefone, einfache APs</td></tr>
        <tr><td>802.3at</td><td>PoE+ (Type 2)</td><td>30 W</td><td>25,5 W</td><td>2</td><td>802.11ac-APs, PTZ-Kameras</td></tr>
        <tr><td>802.3bt</td><td>PoE++ / UPoE (Type 3)</td><td>60 W</td><td>51 W</td><td>4</td><td>Wi-Fi 6 APs, Displays</td></tr>
        <tr><td>802.3bt</td><td>PoE++ / UPoE+ (Type 4)</td><td>90–100 W</td><td>71 W</td><td>4</td><td>Laptops, Thin Clients, Beleuchtung</td></tr>
      </table></div>
      <pre><code><span class="cli-comment"># PoE pro Port steuern / prüfen</span>
Switch(config-if)# power inline auto        <span class="cli-comment"># Standard: automatisch erkennen</span>
Switch(config-if)# power inline never       <span class="cli-comment"># PoE deaktivieren</span>
Switch# show power inline
Switch# show power inline gi1/0/5 detail</code></pre>
      <div class="callout callout-tip"><strong>Prüfungstipp</strong>Ein PoE-Switch hat ein <strong>Power Budget</strong>. Wenn mehr Geräte Strom anfordern als verfügbar ist, werden Ports nach Priorität (<code>power inline police</code>/Priority) versorgt oder abgeschaltet.</div>
    </div>
  `
}, {
  before: "osi-model",
  quiz: [
    {
      q: "Welches Gerät trennt standardmäßig Broadcast-Domänen?",
      options: ["Hub", "Layer-2-Switch", "Router", "Access Point"],
      correct: 2,
      explanation: "Ein Router (bzw. jedes Layer-3-Interface) begrenzt eine Broadcast-Domäne. Ein Layer-2-Switch trennt nur Kollisionsdomänen — außer man nutzt VLANs.",
      theoryRef: "network-components"
    },
    {
      q: "Was unterscheidet eine Next-Generation Firewall (NGFW) von einer klassischen Stateful Firewall?",
      options: ["Sie arbeitet nur auf Layer 3", "Sie kann Applikationen (Layer 7) erkennen und hat oft ein integriertes IPS", "Sie benötigt keine Regeln", "Sie ersetzt den Router vollständig"],
      correct: 1,
      explanation: "NGFWs bieten Application Visibility & Control, URL-Filtering, integriertes NGIPS und Malware-Schutz — weit über die reine L3/L4-Zustandsprüfung hinaus.",
      theoryRef: "network-components"
    },
    {
      q: "Wie viel Leistung stellt ein Switch-Port nach IEEE 802.3at (PoE+) maximal bereit?",
      options: ["15,4 W", "30 W", "60 W", "90 W"],
      correct: 1,
      explanation: "802.3af = 15,4 W, 802.3at (PoE+) = 30 W, 802.3bt Type 3 = 60 W, 802.3bt Type 4 = 90–100 W.",
      theoryRef: "network-components"
    },
    {
      q: "Welche Aussage zu IPS und IDS ist korrekt?",
      options: ["IDS blockiert Angriffe inline, IPS alarmiert nur", "IPS sitzt inline im Datenpfad und kann Angriffe aktiv blockieren", "Beide arbeiten ausschließlich auf Layer 2", "IPS ist ein anderes Wort für Firewall"],
      correct: 1,
      explanation: "Ein IPS arbeitet inline und verwirft bösartigen Traffic aktiv. Ein IDS analysiert eine Kopie des Traffics (out-of-band) und alarmiert nur.",
      theoryRef: "network-components"
    },
    {
      q: "Welche Funktion hat ein Wireless LAN Controller (WLC)?",
      options: ["Er ersetzt den Router im WAN", "Er verwaltet zentral Lightweight-APs (Konfiguration, Kanäle, Sicherheit) über CAPWAP", "Er verbindet Glasfaserstrecken", "Er stellt DHCP für alle Clients bereit"],
      correct: 1,
      explanation: "Ein WLC steuert Lightweight-Access-Points zentral: WLAN-Konfiguration, RF-Management, Client-Roaming und Sicherheit — Kommunikation über CAPWAP-Tunnel.",
      theoryRef: "network-components"
    }
  ],
  flashcards: [
    { front: "Layer-3-Switch", back: "Switch mit Routing-Funktion in Hardware (ASIC) — Inter-VLAN-Routing via SVI / Routed Ports" },
    { front: "NGFW", back: "Next-Generation Firewall — Stateful + Application Awareness (L7), URL-Filter, integriertes IPS" },
    { front: "IPS vs. IDS", back: "IPS: inline, blockiert aktiv. IDS: out-of-band, alarmiert nur" },
    { front: "PoE 802.3af / 802.3at / 802.3bt", back: "15,4 W / 30 W (PoE+) / 60–100 W (PoE++, UPoE)" },
    { front: "PSE / PD", back: "Power Sourcing Equipment (Switch) / Powered Device (AP, IP-Telefon)" },
    { front: "Kollisionsdomäne vs. Broadcast-Domäne", back: "Switch-Port trennt Kollisionsdomänen; Router / VLAN trennt Broadcast-Domänen" }
  ]
});

// ---------- 1.2 Topologien & Architekturen ----------
registerTopic({
  id: "topologies",
  domain: "Network Fundamentals",
  domainPct: "20%",
  icon: "🏗️",
  title: "Topologien & Architekturen",
  tags: ["Blueprint 1.2", "Design", "Campus", "WAN"],
  content: `
    <div class="content-section">
      <h3>🏗️ Three-Tier — Das klassische Campus-Design</h3>
      <pre><code>          ┌────────┐   ┌────────┐
  CORE    │ Core 1 │═══│ Core 2 │      schnelles L3-Backbone, keine Policy
          └───┬────┘   └────┬───┘
        ┌─────┼─────────────┼─────┐
  DIST  │ ┌───┴───┐     ┌───┴───┐ │    Routing, ACLs, QoS, Redundanz (FHRP)
        │ │ Dist1 │═════│ Dist2 │ │    Grenze L2 ↔ L3
        │ └─┬───┬─┘     └─┬───┬─┘ │
  ACCESS  ┌─┴─┐ ┌┴──┐   ┌┴──┐ ┌┴─┐     Endgeräte, VLANs, PoE, Port Security
          │SW1│ │SW2│   │SW3│ │SW4│
          └───┘ └───┘   └───┘ └───┘</code></pre>
      <div class="table-wrap"><table>
        <tr><th>Layer</th><th>Aufgabe</th><th>Typische Features</th></tr>
        <tr><td><strong>Access</strong></td><td>Anschluss der Endgeräte</td><td>VLANs, PoE, Port Security, 802.1X, QoS-Marking, STP PortFast</td></tr>
        <tr><td><strong>Distribution</strong></td><td>Aggregation der Access-Switches, Policy</td><td>Inter-VLAN-Routing, ACLs, Redistribution, FHRP (HSRP), Summarization</td></tr>
        <tr><td><strong>Core</strong></td><td>Schnelles Backbone zwischen Distribution-Blöcken</td><td>Hohe Bandbreite, L3-Redundanz, <em>keine</em> komplexen Policies (Geschwindigkeit!)</td></tr>
      </table></div>
    </div>

    <div class="content-section">
      <h3>🏢 Two-Tier (Collapsed Core)</h3>
      <p>Bei kleineren/mittleren Standorten werden <strong>Core und Distribution zusammengelegt</strong> („collapsed core“). Weniger Geräte, günstiger, weniger Skalierung. Access-Switches hängen direkt an den Collapsed-Core-Switches.</p>
      <div class="callout callout-tip"><strong>Wann Three-Tier?</strong>Wenn mehrere Gebäude/Distribution-Blöcke vorhanden sind. Faustregel: ab ~3 Distribution-Paaren lohnt sich ein dedizierter Core.</div>
    </div>

    <div class="content-section">
      <h3>🌿 Spine-Leaf (Rechenzentrum)</h3>
      <pre><code>   SPINE      ┌───────┐    ┌───────┐    ┌───────┐
              │Spine 1│    │Spine 2│    │Spine 3│
              └─┬─┬─┬─┘    └─┬─┬─┬─┘    └─┬─┬─┬─┘
   (Full Mesh:  jeder Leaf mit JEDEM Spine verbunden)
   LEAF     ┌──┴──┐ ┌──┴──┐ ┌──┴──┐ ┌──┴──┐
            │Leaf1│ │Leaf2│ │Leaf3│ │Leaf4│
            └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘
             Server  Server  Server  Server</code></pre>
      <ul>
        <li><strong>Leaf</strong> = Top-of-Rack-Switch, an dem Server hängen. <strong>Spine</strong> = Backbone.</li>
        <li>Jeder Leaf ist mit <em>jedem</em> Spine verbunden — Leafs sind <em>nicht</em> untereinander verbunden, Spines auch nicht.</li>
        <li>Jeder Server ist immer genau <strong>2 Hops</strong> (Leaf → Spine → Leaf) von jedem anderen entfernt → vorhersagbare Latenz.</li>
        <li>Optimiert für <strong>East-West-Traffic</strong> (Server ↔ Server), Skalierung durch Hinzufügen von Spines. Basis für Cisco ACI.</li>
      </ul>
    </div>

    <div class="content-section">
      <h3>🌍 WAN, SOHO, On-Premises &amp; Cloud</h3>
      <div class="table-wrap"><table>
        <tr><th>Architektur</th><th>Beschreibung</th><th>Merkmale</th></tr>
        <tr><td><strong>WAN</strong></td><td>Verbindet geografisch getrennte Standorte</td><td>MPLS, Metro Ethernet, Internet-VPN, SD-WAN, Leased Lines; Topologien: Hub-and-Spoke, Full/Partial Mesh, Point-to-Point</td></tr>
        <tr><td><strong>SOHO</strong></td><td>Small Office / Home Office</td><td>Ein „All-in-one“-Gerät: Router + Switch + AP + Firewall + DHCP + NAT. Anbindung über DSL, Kabel, Glasfaser, 4G/5G</td></tr>
        <tr><td><strong>On-Premises</strong></td><td>Eigene Hardware im eigenen Rechenzentrum</td><td>Volle Kontrolle, hohe Investitionskosten (CapEx), eigene Wartung</td></tr>
        <tr><td><strong>Cloud</strong></td><td>Ressourcen beim Provider (AWS, Azure, GCP)</td><td>Pay-as-you-go (OpEx), elastisch, schnell bereitgestellt. Modelle: Public, Private, Hybrid, Community</td></tr>
      </table></div>
      <h4>Cloud-Servicemodelle (NIST)</h4>
      <div class="table-wrap"><table>
        <tr><th>Modell</th><th>Du verwaltest</th><th>Provider verwaltet</th><th>Beispiel</th></tr>
        <tr><td><strong>IaaS</strong></td><td>OS, Middleware, Apps, Daten</td><td>Virtualisierung, Server, Storage, Netzwerk</td><td>AWS EC2, Azure VMs</td></tr>
        <tr><td><strong>PaaS</strong></td><td>Apps, Daten</td><td>+ OS, Runtime, Middleware</td><td>Azure App Service, Heroku</td></tr>
        <tr><td><strong>SaaS</strong></td><td>Nur Nutzung</td><td>Alles</td><td>Microsoft 365, Webex, Salesforce</td></tr>
      </table></div>
      <div class="callout callout-info"><strong>NIST-Merkmale einer Cloud</strong>On-Demand Self-Service · Broad Network Access · Resource Pooling · Rapid Elasticity · Measured Service.</div>
    </div>
  `
}, {
  after: "network-components",
  quiz: [
    {
      q: "In welcher Schicht des Three-Tier-Designs werden typischerweise ACLs, QoS-Policies und Inter-VLAN-Routing umgesetzt?",
      options: ["Access Layer", "Distribution Layer", "Core Layer", "Leaf Layer"],
      correct: 1,
      explanation: "Der Distribution Layer ist die Policy- und Routing-Grenze zwischen Access (L2) und Core (L3). Der Core soll nur schnell weiterleiten.",
      theoryRef: "topologies"
    },
    {
      q: "Welche Aussage beschreibt eine Spine-Leaf-Architektur korrekt?",
      options: ["Leaf-Switches sind untereinander vollvermascht", "Jeder Leaf-Switch ist mit jedem Spine-Switch verbunden, Leafs nicht untereinander", "Spine-Switches verbinden die Endgeräte", "Es gibt genau einen Spine pro Rechenzentrum"],
      correct: 1,
      explanation: "Spine-Leaf: Jeder Leaf hat einen Uplink zu jedem Spine. Leafs sind nicht direkt untereinander verbunden, Spines ebenfalls nicht. Ergebnis: immer 2 Hops zwischen Servern.",
      theoryRef: "topologies"
    },
    {
      q: "Was versteht man unter einem 'Collapsed Core'?",
      options: ["Ein ausgefallener Core-Switch", "Core und Distribution Layer sind auf denselben Geräten zusammengefasst (Two-Tier)", "Ein Core ohne Redundanz", "Ein Core, der nur Layer 2 spricht"],
      correct: 1,
      explanation: "Im Two-Tier-Design (Collapsed Core) übernehmen dieselben Switches die Funktionen von Core und Distribution — üblich für kleinere Standorte.",
      theoryRef: "topologies"
    },
    {
      q: "Bei welchem Cloud-Servicemodell verwaltet der Kunde Betriebssystem, Middleware und Anwendungen selbst?",
      options: ["SaaS", "PaaS", "IaaS", "FaaS"],
      correct: 2,
      explanation: "Bei IaaS stellt der Provider nur die Infrastruktur (Compute, Storage, Netzwerk) — alles ab dem OS liegt beim Kunden.",
      theoryRef: "topologies"
    },
    {
      q: "Welches Gerät ist typisch für eine SOHO-Umgebung?",
      options: ["Ein Spine-Switch mit 100G-Uplinks", "Ein integriertes Gerät mit Router, Switch, AP und Firewall in einem", "Ein WLC mit 500 APs", "Ein MPLS Provider Edge Router"],
      correct: 1,
      explanation: "SOHO-Netze nutzen meist ein einziges Multifunktionsgerät, das Routing, Switching, WLAN, NAT, DHCP und Firewall kombiniert.",
      theoryRef: "topologies"
    }
  ],
  flashcards: [
    { front: "Three-Tier Layer", back: "Access (Endgeräte) → Distribution (Policy, Routing) → Core (schnelles Backbone)" },
    { front: "Collapsed Core", back: "Two-Tier: Core + Distribution auf denselben Switches" },
    { front: "Spine-Leaf", back: "DC-Design: jeder Leaf mit jedem Spine verbunden; immer 2 Hops; für East-West-Traffic" },
    { front: "SOHO", back: "Small Office / Home Office — ein integriertes Gerät (Router+Switch+AP+FW)" },
    { front: "IaaS / PaaS / SaaS", back: "Infrastruktur / Plattform / Software as a Service — abnehmende eigene Verantwortung" },
    { front: "CapEx vs. OpEx", back: "On-Prem = Investition (CapEx); Cloud = laufende Kosten (OpEx, pay-as-you-go)" }
  ]
});

// ---------- 1.3 / 1.4 Kabel, Interfaces, Fehler ----------
registerTopic({
  id: "cabling",
  domain: "Network Fundamentals",
  domainPct: "20%",
  icon: "🔌",
  title: "Kabel, Interfaces & Fehler",
  tags: ["Blueprint 1.3", "Blueprint 1.4", "Physical", "Troubleshooting"],
  content: `
    <div class="content-section">
      <h3>🔌 Kupfer — UTP-Kategorien</h3>
      <div class="table-wrap"><table>
        <tr><th>Kategorie</th><th>Max. Geschwindigkeit</th><th>Distanz</th><th>Ethernet-Standard</th></tr>
        <tr><td>Cat 5e</td><td>1 Gbit/s</td><td>100 m</td><td>1000BASE-T</td></tr>
        <tr><td>Cat 6</td><td>10 Gbit/s (bis 55 m) / 1 Gbit/s</td><td>55 m / 100 m</td><td>10GBASE-T</td></tr>
        <tr><td>Cat 6a</td><td>10 Gbit/s</td><td>100 m</td><td>10GBASE-T</td></tr>
        <tr><td>Cat 7 / 8</td><td>10 / 25–40 Gbit/s</td><td>100 m / 30 m</td><td>Rechenzentrum</td></tr>
      </table></div>
      <ul>
        <li><strong>UTP</strong> (Unshielded Twisted Pair) — 4 Adernpaare, RJ-45-Stecker, Standard-Reichweite <strong>100 m</strong>.</li>
        <li><strong>STP</strong> (Shielded) — geschirmt gegen EMI (Elektromagnetische Störungen).</li>
        <li><strong>Straight-Through</strong> (T568A–T568A oder B–B): PC ↔ Switch, Router ↔ Switch (ungleiche Geräte).</li>
        <li><strong>Crossover</strong> (A–B): Switch ↔ Switch, PC ↔ PC, Router ↔ Router (gleiche Geräte) — dank <strong>Auto-MDIX</strong> heute meist egal.</li>
        <li><strong>Rollover/Console</strong>-Kabel: PC (RJ-45/USB) ↔ Console-Port des Geräts.</li>
      </ul>
      <div class="callout callout-info"><strong>Ethernet-Namensschema</strong><code>1000BASE-T</code> → 1000 Mbit/s · BASEband · T = Twisted Pair. <code>10GBASE-SR</code> → 10G · Short Range (Multimode). <code>10GBASE-LR</code> → Long Range (Singlemode).</div>
    </div>

    <div class="content-section">
      <h3>💡 Glasfaser — Singlemode vs. Multimode</h3>
      <div class="table-wrap"><table>
        <tr><th>Merkmal</th><th>Multimode (MMF)</th><th>Singlemode (SMF)</th></tr>
        <tr><td>Kerndurchmesser</td><td>50 / 62,5 µm</td><td>8–10 µm</td></tr>
        <tr><td>Lichtquelle</td><td>LED / VCSEL (günstig)</td><td>Laser (teurer)</td></tr>
        <tr><td>Wellenlänge</td><td>850 nm / 1300 nm</td><td>1310 nm / 1550 nm</td></tr>
        <tr><td>Reichweite</td><td>bis ~550 m (OM3/OM4 bei 10G, 300–400 m)</td><td>10 km, 40 km, 80 km+</td></tr>
        <tr><td>Farbe (Mantel)</td><td>Orange (OM1/2), Aqua (OM3/4), Lime (OM5)</td><td>Gelb (OS1/OS2)</td></tr>
        <tr><td>Einsatz</td><td>Gebäudeintern, Rechenzentrum</td><td>Campus, WAN, Metro</td></tr>
      </table></div>
      <p><strong>Transceiver:</strong> SFP (1G), SFP+ (10G), QSFP+ (40G), QSFP28 (100G). Sie werden in den Switch gesteckt und bestimmen Medium/Reichweite. Steckertypen: LC (am häufigsten, klein), SC, ST, MPO (Parallel-Optik, 40/100G).</p>
      <div class="callout callout-tip"><strong>Vorteile von Glasfaser</strong>Keine EMI-Anfälligkeit, große Distanzen, hohe Bandbreite, abhörsicherer. Nachteile: teurer, empfindlich (Biegeradius), Spleißen aufwendig.</div>
    </div>

    <div class="content-section">
      <h3>↔️ Shared Media vs. Point-to-Point</h3>
      <ul>
        <li><strong>Shared Media (Legacy):</strong> Hub / Koax — alle Stationen teilen ein Medium, <strong>Half-Duplex</strong>, Zugriff über <strong>CSMA/CD</strong> (Carrier Sense Multiple Access / Collision Detection). Kollisionen sind normal.</li>
        <li><strong>Point-to-Point (heute):</strong> Switch-Port ↔ Endgerät — dediziertes Segment, <strong>Full-Duplex</strong>, keine Kollisionen, CSMA/CD deaktiviert.</li>
        <li>WLAN nutzt <strong>CSMA/CA</strong> (Collision <em>Avoidance</em>), weil Kollisionen im Funk nicht erkannt werden können.</li>
      </ul>
    </div>

    <div class="content-section">
      <h3>🩺 Interface- und Kabelfehler erkennen (Blueprint 1.4)</h3>
      <pre><code>Switch# show interfaces gi0/1
GigabitEthernet0/1 is up, line protocol is up (connected)
  Hardware is Gigabit Ethernet, address is 0011.2233.4455
  MTU 1500 bytes, BW 1000000 Kbit/sec
  <span class="cli-output">Full-duplex, 1000Mb/s</span>, media type is 10/100/1000BaseTX
  ...
     1234567 packets input, 987654321 bytes
     <span class="cli-output">0 input errors, 0 CRC, 0 frame, 0 runts, 0 giants</span>
     ...
     <span class="cli-output">0 output errors, 0 collisions, 0 late collision</span></code></pre>
      <div class="table-wrap"><table>
        <tr><th>Zähler</th><th>Bedeutung</th><th>Wahrscheinliche Ursache</th></tr>
        <tr><td><strong>Runts</strong></td><td>Frames &lt; 64 Byte</td><td>Kollisionen, defekte NIC</td></tr>
        <tr><td><strong>Giants</strong></td><td>Frames &gt; 1518 Byte (ohne Jumbo)</td><td>MTU-Mismatch, defekte NIC</td></tr>
        <tr><td><strong>CRC / Input Errors</strong></td><td>Prüfsumme falsch</td><td>Schlechtes Kabel, EMI, <strong>Duplex-Mismatch</strong></td></tr>
        <tr><td><strong>Collisions</strong></td><td>Kollisionen im Half-Duplex-Betrieb</td><td>Normal bei Half-Duplex; bei Full-Duplex = Fehler</td></tr>
        <tr><td><strong>Late Collisions</strong></td><td>Kollision nach den ersten 64 Byte</td><td>Klassisches Symptom für <strong>Duplex-Mismatch</strong> oder Kabel zu lang (&gt;100 m)</td></tr>
        <tr><td><strong>Output Drops</strong></td><td>Pakete verworfen (Queue voll)</td><td>Überlastung / Congestion — QoS nötig</td></tr>
      </table></div>
      <h4>Interface-Status interpretieren</h4>
      <div class="table-wrap"><table>
        <tr><th>Line Status / Protocol</th><th>Bedeutung</th><th>Prüfen</th></tr>
        <tr><td>up / up</td><td>Alles ok</td><td>—</td></tr>
        <tr><td>down / down</td><td>Layer-1-Problem</td><td>Kabel, Gegenseite aus, Speed-Mismatch, defekter Port</td></tr>
        <tr><td>administratively down / down</td><td>Port ist mit <code>shutdown</code> deaktiviert</td><td><code>no shutdown</code></td></tr>
        <tr><td>up / down</td><td>Layer-2-Problem</td><td>Encapsulation-Mismatch, Keepalives, Clocking (Serial)</td></tr>
        <tr><td>err-disabled</td><td>Durch Schutzfunktion gesperrt</td><td>Port Security, BPDU Guard → <code>shutdown</code> / <code>no shutdown</code></td></tr>
      </table></div>
      <h4>Speed &amp; Duplex</h4>
      <p>Beide Seiten sollten <strong>Autonegotiation</strong> nutzen <em>oder</em> beide fest konfiguriert sein. Ist nur eine Seite fest auf Full-Duplex und die andere auf Auto, fällt die Auto-Seite auf <strong>Half-Duplex</strong> zurück → Duplex-Mismatch (funktioniert, aber langsam, viele Late Collisions/CRC). Bei <strong>Speed-Mismatch</strong> kommt der Link gar nicht hoch.</p>
      <pre><code>Switch(config-if)# speed auto  |  speed 100  |  speed 1000
Switch(config-if)# duplex auto |  duplex full
Switch# show interfaces status          <span class="cli-comment"># Übersicht: connected / notconnect / err-disabled, VLAN, Duplex, Speed</span>
Switch# show interfaces gi0/1 counters errors
Switch# show controllers ethernet-controller gi0/1 phy | include MDIX</code></pre>
    </div>
  `
}, {
  after: "topologies",
  quiz: [
    {
      q: "Ein Switch-Port zeigt viele 'late collisions' und CRC-Fehler, der Link ist aber up/up. Was ist die wahrscheinlichste Ursache?",
      options: ["Speed-Mismatch", "Duplex-Mismatch", "Falsches VLAN", "STP blockiert den Port"],
      correct: 1,
      explanation: "Late Collisions und CRC-Fehler bei einem funktionierenden Link sind das klassische Symptom eines Duplex-Mismatch (eine Seite Half-, die andere Full-Duplex). Bei Speed-Mismatch käme der Link gar nicht hoch.",
      theoryRef: "cabling"
    },
    {
      q: "Welche Glasfaser hat den kleineren Kerndurchmesser und eignet sich für lange Distanzen (10 km+)?",
      options: ["Multimode OM3", "Multimode OM4", "Singlemode", "Koaxial"],
      correct: 2,
      explanation: "Singlemode-Fasern (8–10 µm Kern) nutzen Laser und überbrücken 10 km und weit mehr. Multimode (50/62,5 µm) ist auf einige hundert Meter begrenzt.",
      theoryRef: "cabling"
    },
    {
      q: "Was bedeutet der Interface-Status 'up / down' (Line up, Protocol down)?",
      options: ["Layer-1-Problem, z.B. Kabel gezogen", "Port wurde administrativ deaktiviert", "Layer-2-Problem, z.B. Encapsulation-Mismatch oder fehlende Keepalives", "Alles funktioniert korrekt"],
      correct: 2,
      explanation: "Line Protocol up heißt Layer 1 ist ok. Protocol down deutet auf ein Layer-2-Problem (Encapsulation, Keepalive, Clocking).",
      theoryRef: "cabling"
    },
    {
      q: "Wie werden Ethernet-Frames bezeichnet, die kleiner als 64 Byte sind?",
      options: ["Giants", "Runts", "Jumbo Frames", "Babygiants"],
      correct: 1,
      explanation: "Runts sind zu kleine Frames (< 64 Byte), meist Folge von Kollisionen. Giants sind zu große Frames (> 1518 Byte).",
      theoryRef: "cabling"
    },
    {
      q: "Welche maximale Kabellänge gilt für UTP-Kabel (Cat 5e/6a) bei Ethernet?",
      options: ["55 m", "100 m", "300 m", "550 m"],
      correct: 1,
      explanation: "Die Standard-Segmentlänge für Twisted-Pair-Ethernet beträgt 100 m (90 m fest verlegt + 10 m Patchkabel).",
      theoryRef: "cabling"
    }
  ],
  flashcards: [
    { front: "UTP max. Länge", back: "100 m" },
    { front: "Multimode vs. Singlemode", back: "MMF: 50/62,5 µm Kern, LED, kurze Distanz (~550 m). SMF: 9 µm, Laser, 10 km+" },
    { front: "Late Collisions + CRC bei up/up", back: "Duplex-Mismatch" },
    { front: "Runts / Giants", back: "Frames < 64 Byte / > 1518 Byte" },
    { front: "Status up / down", back: "Layer-2-Problem (Encapsulation, Keepalive)" },
    { front: "CSMA/CD vs. CSMA/CA", back: "CD = Ethernet Half-Duplex (Collision Detection); CA = WLAN (Collision Avoidance)" },
    { front: "SFP / SFP+ / QSFP28", back: "1G / 10G / 100G Transceiver" }
  ]
});

// ---------- 1.10 IP-Parameter auf Client-OS ----------
registerTopic({
  id: "client-ip",
  domain: "Network Fundamentals",
  domainPct: "20%",
  icon: "💻",
  title: "IP-Parameter am Client (Win/Mac/Linux)",
  tags: ["Blueprint 1.10", "Troubleshooting", "Client"],
  content: `
    <div class="content-section">
      <h3>💻 IP-Einstellungen am Endgerät prüfen</h3>
      <p>Für die Prüfung musst du die Ausgabe der Client-Befehle <strong>interpretieren</strong> können: IP, Maske, Gateway, DNS, MAC, DHCP-Server, Lease.</p>
      <div class="table-wrap"><table>
        <tr><th>Aufgabe</th><th>Windows</th><th>macOS</th><th>Linux</th></tr>
        <tr><td>IP, Maske, Gateway anzeigen</td><td><code>ipconfig</code> / <code>ipconfig /all</code></td><td><code>ifconfig</code>, <code>networksetup -getinfo Wi-Fi</code></td><td><code>ip addr</code> (<code>ip a</code>), <code>ifconfig</code> (alt)</td></tr>
        <tr><td>Default Gateway / Routing-Tabelle</td><td><code>route print</code>, <code>netstat -r</code></td><td><code>netstat -rn</code>, <code>route -n get default</code></td><td><code>ip route</code>, <code>route -n</code></td></tr>
        <tr><td>DNS-Server</td><td><code>ipconfig /all</code></td><td><code>scutil --dns</code>, Systemeinstellungen</td><td><code>cat /etc/resolv.conf</code>, <code>resolvectl status</code></td></tr>
        <tr><td>DHCP erneuern</td><td><code>ipconfig /release</code> + <code>ipconfig /renew</code></td><td><code>sudo ipconfig set en0 DHCP</code></td><td><code>sudo dhclient -r</code> + <code>sudo dhclient</code></td></tr>
        <tr><td>DNS-Cache leeren</td><td><code>ipconfig /flushdns</code></td><td><code>sudo dscacheutil -flushcache</code></td><td><code>resolvectl flush-caches</code></td></tr>
        <tr><td>ARP-Tabelle</td><td><code>arp -a</code></td><td><code>arp -a</code></td><td><code>ip neigh</code>, <code>arp -n</code></td></tr>
        <tr><td>Namensauflösung testen</td><td><code>nslookup</code></td><td><code>nslookup</code>, <code>dig</code></td><td><code>dig</code>, <code>nslookup</code>, <code>host</code></td></tr>
        <tr><td>Pfad verfolgen</td><td><code>tracert</code></td><td><code>traceroute</code></td><td><code>traceroute</code>, <code>mtr</code></td></tr>
      </table></div>
    </div>

    <div class="content-section">
      <h3>🪟 Beispiel: Windows <code>ipconfig /all</code></h3>
      <pre><code>Ethernet adapter Ethernet0:
   Description . . . . . . . . . . . : Intel(R) Ethernet Connection
   Physical Address. . . . . . . . . : 00-1A-2B-3C-4D-5E          <span class="cli-comment">← MAC-Adresse</span>
   DHCP Enabled. . . . . . . . . . . : Yes                        <span class="cli-comment">← per DHCP bezogen</span>
   Link-local IPv6 Address . . . . . : fe80::1c2d:3e4f:5a6b:7c8d%12
   IPv4 Address. . . . . . . . . . . : 192.168.10.57(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.255.0              <span class="cli-comment">← /24</span>
   Lease Obtained. . . . . . . . . . : Montag, 1. September 2026 08:12:03
   Lease Expires . . . . . . . . . . : Dienstag, 2. September 2026 08:12:03
   Default Gateway . . . . . . . . . : 192.168.10.1
   DHCP Server . . . . . . . . . . . : 192.168.10.1
   DNS Servers . . . . . . . . . . . : 192.168.10.1
                                       8.8.8.8</code></pre>
      <div class="callout callout-warn"><strong>APIPA — 169.254.x.x</strong>Zeigt Windows eine Adresse aus <code>169.254.0.0/16</code>, hat der Client <strong>keinen DHCP-Server erreicht</strong> (Automatic Private IP Addressing). Ursache: DHCP-Server down, VLAN falsch, Relay fehlt, Kabelproblem.</div>
    </div>

    <div class="content-section">
      <h3>🐧 Beispiel: Linux <code>ip addr</code> und <code>ip route</code></h3>
      <pre><code>$ ip addr show eth0
2: eth0: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 state UP
    link/ether 00:1a:2b:3c:4d:5e brd ff:ff:ff:ff:ff:ff
    inet 192.168.10.57/24 brd 192.168.10.255 scope global dynamic eth0
    inet6 fe80::21a:2bff:fe3c:4d5e/64 scope link

$ ip route
default via 192.168.10.1 dev eth0 proto dhcp        <span class="cli-comment">← Default Gateway</span>
192.168.10.0/24 dev eth0 proto kernel scope link src 192.168.10.57</code></pre>
      <h4>Typischer Troubleshooting-Ablauf (Bottom-up)</h4>
      <ol>
        <li><code>ping 127.0.0.1</code> → TCP/IP-Stack ok?</li>
        <li><code>ping &lt;eigene IP&gt;</code> → NIC ok?</li>
        <li><code>ping &lt;Default Gateway&gt;</code> → LAN ok?</li>
        <li><code>ping 8.8.8.8</code> → Routing/Internet ok?</li>
        <li><code>ping google.com</code> → DNS ok? (Wenn 4 klappt, aber 5 nicht → DNS-Problem)</li>
      </ol>
    </div>
  `
}, {
  after: "ipv6",
  quiz: [
    {
      q: "Ein Windows-PC zeigt die IPv4-Adresse 169.254.23.101. Was bedeutet das?",
      options: ["Der PC hat eine gültige Adresse vom DHCP-Server erhalten", "Der PC konnte keinen DHCP-Server erreichen und hat sich eine APIPA-Adresse gegeben", "Der PC nutzt eine öffentliche IP", "Der PC ist im Loopback-Netz"],
      correct: 1,
      explanation: "169.254.0.0/16 ist der APIPA-Bereich (Link-Local). Windows vergibt ihn selbst, wenn kein DHCP-Server antwortet.",
      theoryRef: "client-ip"
    },
    {
      q: "Mit welchem Befehl zeigst du unter Windows DHCP-Server, Lease-Zeit und DNS-Server an?",
      options: ["ipconfig", "ipconfig /all", "netstat -an", "arp -a"],
      correct: 1,
      explanation: "'ipconfig' zeigt nur IP, Maske und Gateway. 'ipconfig /all' zeigt zusätzlich MAC, DHCP-Server, Lease und DNS-Server.",
      theoryRef: "client-ip"
    },
    {
      q: "Welcher Linux-Befehl zeigt die Routing-Tabelle inklusive Default Gateway?",
      options: ["ip addr", "ip route", "ip neigh", "ifconfig"],
      correct: 1,
      explanation: "'ip route' (oder 'route -n') zeigt die Routen; die Zeile 'default via ...' ist das Default Gateway. 'ip neigh' zeigt die ARP-Tabelle.",
      theoryRef: "client-ip"
    },
    {
      q: "Ein Client kann 8.8.8.8 anpingen, aber nicht www.cisco.com. Wo liegt das Problem am wahrscheinlichsten?",
      options: ["Default Gateway falsch", "Subnetzmaske falsch", "DNS-Konfiguration", "Kabel defekt"],
      correct: 2,
      explanation: "IP-Konnektivität ins Internet funktioniert (Ping auf IP klappt). Scheitert nur die Namensauflösung, ist DNS das Problem.",
      theoryRef: "client-ip"
    },
    {
      q: "Welcher macOS-Befehl zeigt die Routing-Tabelle?",
      options: ["ipconfig /all", "netstat -rn", "route print", "ip route"],
      correct: 1,
      explanation: "Unter macOS (BSD-basiert) zeigt 'netstat -rn' die Routing-Tabelle. 'route print' ist Windows, 'ip route' ist Linux.",
      theoryRef: "client-ip"
    }
  ],
  flashcards: [
    { front: "169.254.x.x", back: "APIPA — kein DHCP-Server erreicht (Windows Link-Local)" },
    { front: "Windows: alle IP-Details", back: "ipconfig /all" },
    { front: "Linux: IP-Adressen / Routen / ARP", back: "ip addr / ip route / ip neigh" },
    { front: "macOS: Routing-Tabelle", back: "netstat -rn" },
    { front: "DNS-Cache leeren (Windows)", back: "ipconfig /flushdns" },
    { front: "Ping auf IP ok, auf Name nicht", back: "DNS-Problem" }
  ]
});

// ---------- 1.11 Wireless-Grundlagen ----------
registerTopic({
  id: "wireless-basics",
  domain: "Network Fundamentals",
  domainPct: "20%",
  icon: "📶",
  title: "Wireless-Grundlagen (RF, Kanäle, SSID)",
  tags: ["Blueprint 1.11", "WLAN", "802.11"],
  content: `
    <div class="content-section">
      <h3>📶 RF-Grundlagen</h3>
      <p>WLAN (IEEE 802.11) überträgt Daten per <strong>Funk</strong> (Radio Frequency). Das Medium ist <em>geteilt</em> und <strong>Half-Duplex</strong>: Zugriff über <strong>CSMA/CA</strong>.</p>
      <div class="table-wrap"><table>
        <tr><th>Begriff</th><th>Bedeutung</th></tr>
        <tr><td><strong>Frequenz</strong></td><td>Schwingungen pro Sekunde (Hz). WLAN: 2,4 GHz, 5 GHz, 6 GHz (Wi-Fi 6E/7)</td></tr>
        <tr><td><strong>Kanal</strong></td><td>Frequenzbereich einer bestimmten Breite (20/40/80/160 MHz)</td></tr>
        <tr><td><strong>Dämpfung / Absorption</strong></td><td>Signalverlust durch Distanz, Wände, Wasser (Menschen!)</td></tr>
        <tr><td><strong>Reflexion / Refraktion / Diffraktion / Streuung</strong></td><td>Signalveränderung an Metall, Glas, Kanten, rauen Oberflächen → Multipath</td></tr>
        <tr><td><strong>Interferenz</strong></td><td>Störung durch andere Sender auf demselben Kanal (Co-Channel) oder Nachbarkanal (Adjacent-Channel), Mikrowellen, Bluetooth</td></tr>
        <tr><td><strong>RSSI</strong></td><td>Received Signal Strength Indicator, in dBm (z.B. −65 dBm gut, −80 dBm schwach)</td></tr>
        <tr><td><strong>SNR</strong></td><td>Signal-to-Noise Ratio — je höher, desto besser (&gt; 25 dB für VoIP)</td></tr>
      </table></div>
    </div>

    <div class="content-section">
      <h3>📻 Bänder und nicht überlappende Kanäle</h3>
      <div class="table-wrap"><table>
        <tr><th>Band</th><th>Kanäle</th><th>Nicht überlappend (20 MHz)</th><th>Eigenschaften</th></tr>
        <tr><td><strong>2,4 GHz</strong></td><td>1–13 (EU), 1–11 (USA), je 22 MHz breit, 5 MHz Abstand</td><td><strong>1, 6, 11</strong> (EU alternativ 1, 5, 9, 13)</td><td>Große Reichweite, wenig Kanäle, viele Störer (Bluetooth, Mikrowelle)</td></tr>
        <tr><td><strong>5 GHz</strong></td><td>36–64, 100–144, 149–165 (UNII-1 bis UNII-3)</td><td>~24 Kanäle à 20 MHz — alle nicht überlappend</td><td>Mehr Kanäle, höhere Datenraten, kürzere Reichweite; DFS-Kanäle (Radar) beachten</td></tr>
        <tr><td><strong>6 GHz</strong></td><td>Wi-Fi 6E / 7</td><td>bis 59 Kanäle à 20 MHz</td><td>Sehr viel Spektrum, nur WPA3, kurze Reichweite</td></tr>
      </table></div>
      <pre><code>2,4-GHz-Band — warum 1 / 6 / 11?

Kanal:  1     2     3     4     5     6     7     8     9    10    11
MHz:  2412  2417  2422  2427  2432  2437  2442  2447  2452  2457  2462
       ├─────── 22 MHz ───────┤
                               ├─────── 22 MHz ───────┤
                                                       ├─────── 22 MHz ───────┤
Kanal 1, 6 und 11 überlappen sich NICHT → benachbarte APs bekommen diese Kanäle.</code></pre>
      <div class="callout callout-tip"><strong>Prüfungsklassiker</strong>Benachbarte APs im 2,4-GHz-Band immer auf <strong>1, 6, 11</strong> setzen (Honeycomb-Design). Gleiche Kanäle bei Nachbarn = Co-Channel Interference → Durchsatz sinkt.</div>
    </div>

    <div class="content-section">
      <h3>🏷️ SSID, BSS, ESS und Co.</h3>
      <div class="table-wrap"><table>
        <tr><th>Begriff</th><th>Bedeutung</th></tr>
        <tr><td><strong>SSID</strong></td><td>Service Set Identifier — der Name des WLANs (max. 32 Zeichen). Wird in Beacons ausgestrahlt (kann versteckt werden — ist aber keine Sicherheit)</td></tr>
        <tr><td><strong>BSS</strong></td><td>Basic Service Set — ein AP mit seinen Clients (eine Funkzelle)</td></tr>
        <tr><td><strong>BSSID</strong></td><td>MAC-Adresse des AP-Radios, identifiziert die BSS eindeutig</td></tr>
        <tr><td><strong>ESS</strong></td><td>Extended Service Set — mehrere APs mit <em>derselben SSID</em>, verbunden über ein Distribution System (LAN) → <strong>Roaming</strong></td></tr>
        <tr><td><strong>IBSS / Ad-hoc</strong></td><td>Clients direkt untereinander, ohne AP</td></tr>
        <tr><td><strong>Infrastructure Mode</strong></td><td>Clients kommunizieren immer über den AP (Normalfall)</td></tr>
        <tr><td><strong>Beacon</strong></td><td>Frame, den der AP regelmäßig sendet (SSID, unterstützte Raten, Sicherheit)</td></tr>
        <tr><td><strong>Association</strong></td><td>Anmeldevorgang: Probe → Authentication → Association</td></tr>
      </table></div>
    </div>

    <div class="content-section">
      <h3>📜 802.11-Standards</h3>
      <div class="table-wrap"><table>
        <tr><th>Standard</th><th>Marketing</th><th>Band</th><th>Max. Rate (theoretisch)</th></tr>
        <tr><td>802.11b</td><td>—</td><td>2,4 GHz</td><td>11 Mbit/s</td></tr>
        <tr><td>802.11a</td><td>—</td><td>5 GHz</td><td>54 Mbit/s</td></tr>
        <tr><td>802.11g</td><td>—</td><td>2,4 GHz</td><td>54 Mbit/s</td></tr>
        <tr><td>802.11n</td><td>Wi-Fi 4</td><td>2,4 + 5 GHz</td><td>600 Mbit/s (MIMO)</td></tr>
        <tr><td>802.11ac</td><td>Wi-Fi 5</td><td>5 GHz</td><td>~6,9 Gbit/s (MU-MIMO, 160 MHz)</td></tr>
        <tr><td>802.11ax</td><td>Wi-Fi 6 / 6E</td><td>2,4 + 5 (+ 6) GHz</td><td>~9,6 Gbit/s (OFDMA)</td></tr>
        <tr><td>802.11be</td><td>Wi-Fi 7</td><td>2,4 + 5 + 6 GHz</td><td>~46 Gbit/s (320 MHz, MLO)</td></tr>
      </table></div>
      <h4>Verschlüsselung — Überblick</h4>
      <p>WEP (RC4, geknackt) → WPA (TKIP) → <strong>WPA2 (AES-CCMP)</strong> → <strong>WPA3 (AES-GCMP, SAE statt PSK-Handshake)</strong>. Details im Thema <em>Wireless-Sicherheit</em>.</p>
    </div>
  `
}, {
  after: "client-ip",
  quiz: [
    {
      q: "Welche Kanäle im 2,4-GHz-Band überlappen sich nicht und sollten für benachbarte APs verwendet werden?",
      options: ["1, 2, 3", "1, 6, 11", "36, 40, 44", "1, 5, 10"],
      correct: 1,
      explanation: "Im 2,4-GHz-Band sind die Kanäle 22 MHz breit bei 5 MHz Abstand. Nur 1, 6 und 11 überlappen sich nicht.",
      theoryRef: "wireless-basics"
    },
    {
      q: "Was ist ein ESS (Extended Service Set)?",
      options: ["Ein einzelner AP mit seinen Clients", "Mehrere APs mit derselben SSID, verbunden über ein Distribution System, ermöglichen Roaming", "Ein Ad-hoc-Netz ohne AP", "Die MAC-Adresse des AP"],
      correct: 1,
      explanation: "ESS = mehrere BSS (APs) mit gleicher SSID über das LAN verbunden. Clients können zwischen den APs roamen. BSSID ist die MAC des AP-Radios.",
      theoryRef: "wireless-basics"
    },
    {
      q: "Welches Zugriffsverfahren nutzt WLAN (802.11)?",
      options: ["CSMA/CD", "CSMA/CA", "Token Passing", "Polling"],
      correct: 1,
      explanation: "WLAN nutzt CSMA/CA (Collision Avoidance), weil Funkstationen Kollisionen nicht erkennen können. Ethernet Half-Duplex nutzt CSMA/CD.",
      theoryRef: "wireless-basics"
    },
    {
      q: "Welcher Vorteil spricht für das 5-GHz-Band gegenüber 2,4 GHz?",
      options: ["Größere Reichweite durch Wände", "Mehr nicht überlappende Kanäle und weniger Störquellen", "Kompatibilität mit 802.11b", "Geringerer Energieverbrauch"],
      correct: 1,
      explanation: "5 GHz bietet ~24 nicht überlappende 20-MHz-Kanäle und weniger Interferenz (kein Bluetooth/Mikrowelle). Die Reichweite ist dafür geringer.",
      theoryRef: "wireless-basics"
    },
    {
      q: "Was bezeichnet die BSSID?",
      options: ["Den Namen des WLANs", "Die MAC-Adresse des AP-Radios, die eine Funkzelle eindeutig identifiziert", "Die IP-Adresse des WLC", "Die Kanalnummer"],
      correct: 1,
      explanation: "Die BSSID ist die MAC-Adresse des Access-Point-Radios. Die SSID ist der lesbare Netzwerkname.",
      theoryRef: "wireless-basics"
    }
  ],
  flashcards: [
    { front: "Nicht überlappende 2,4-GHz-Kanäle", back: "1, 6, 11" },
    { front: "SSID / BSSID", back: "Name des WLANs / MAC-Adresse des AP-Radios" },
    { front: "BSS vs. ESS", back: "BSS = ein AP + Clients; ESS = mehrere APs mit gleicher SSID (Roaming)" },
    { front: "WLAN Zugriffsverfahren", back: "CSMA/CA — Collision Avoidance, Half-Duplex" },
    { front: "Wi-Fi 5 / Wi-Fi 6", back: "802.11ac (5 GHz) / 802.11ax (2,4 + 5 + 6 GHz, OFDMA)" },
    { front: "RSSI / SNR", back: "Empfangsstärke in dBm / Signal-Rausch-Abstand in dB (höher = besser)" }
  ]
});

// ---------- 1.12 Virtualisierung ----------
registerTopic({
  id: "virtualization",
  domain: "Network Fundamentals",
  domainPct: "20%",
  icon: "🗄️",
  title: "Virtualisierung (VMs, Container, VRF)",
  tags: ["Blueprint 1.12", "Server", "Cloud"],
  content: `
    <div class="content-section">
      <h3>🗄️ Server-Virtualisierung</h3>
      <p>Ein <strong>Hypervisor</strong> erlaubt es, mehrere <strong>virtuelle Maschinen (VMs)</strong> mit eigenem Betriebssystem auf <em>einem</em> physischen Server zu betreiben. Jede VM bekommt virtuelle CPU, RAM, Disk und <strong>vNICs</strong>.</p>
      <div class="table-wrap"><table>
        <tr><th>Hypervisor-Typ</th><th>Läuft auf</th><th>Beispiele</th><th>Einsatz</th></tr>
        <tr><td><strong>Typ 1 (bare-metal / native)</strong></td><td>Direkt auf der Hardware</td><td>VMware ESXi, Microsoft Hyper-V, KVM, Citrix XenServer</td><td>Rechenzentrum, Produktion</td></tr>
        <tr><td><strong>Typ 2 (hosted)</strong></td><td>Auf einem Host-OS als Anwendung</td><td>VMware Workstation, VirtualBox, Parallels</td><td>Desktop, Labs, Tests</td></tr>
      </table></div>
      <h4>Virtuelles Netzwerk im Host</h4>
      <pre><code>┌──────────────── Physischer Server ────────────────┐
│  ┌─────┐  ┌─────┐  ┌─────┐                        │
│  │ VM1 │  │ VM2 │  │ VM3 │   je eigene vNIC + IP   │
│  └──┬──┘  └──┬──┘  └──┬──┘                        │
│  ┌──┴────────┴────────┴──┐                        │
│  │   Virtual Switch (vSwitch) — VLANs, Trunk      │
│  └───────────┬───────────┘                        │
│              │ physische NIC(s) — meist Trunk       │
└──────────────┼────────────────────────────────────┘
               ▼  physischer Switch</code></pre>
      <ul>
        <li>Der <strong>vSwitch</strong> verbindet VMs untereinander und mit der Außenwelt; er unterstützt VLANs und ist oft per <strong>802.1Q-Trunk</strong> mit dem physischen Switch verbunden.</li>
        <li>Vorteile: bessere Auslastung, schnelle Bereitstellung, Snapshots, Live-Migration (vMotion), Isolierung.</li>
      </ul>
    </div>

    <div class="content-section">
      <h3>📦 Container</h3>
      <p>Container virtualisieren <strong>auf OS-Ebene</strong>: Alle Container teilen sich den Kernel des Hosts, bringen aber ihre eigenen Bibliotheken/Abhängigkeiten mit. Sie sind viel leichter als VMs (MB statt GB, Start in Sekunden).</p>
      <div class="table-wrap"><table>
        <tr><th>Merkmal</th><th>Virtuelle Maschine</th><th>Container</th></tr>
        <tr><td>Eigenes Betriebssystem</td><td>Ja (Gast-OS)</td><td>Nein — teilt Host-Kernel</td></tr>
        <tr><td>Größe</td><td>GB</td><td>MB</td></tr>
        <tr><td>Startzeit</td><td>Minuten</td><td>Sekunden</td></tr>
        <tr><td>Isolation</td><td>Stark (Hypervisor)</td><td>Schwächer (Namespaces, cgroups)</td></tr>
        <tr><td>Verwaltung</td><td>Hypervisor (ESXi, KVM)</td><td>Container Engine (Docker), Orchestrierung (Kubernetes)</td></tr>
      </table></div>
      <div class="callout callout-info"><strong>Begriffe</strong><strong>Image</strong> = Vorlage · <strong>Container</strong> = laufende Instanz · <strong>Docker</strong> = Engine · <strong>Kubernetes (K8s)</strong> = Orchestrierung (Skalierung, Self-Healing) · <strong>Pod</strong> = kleinste K8s-Einheit.</div>
    </div>

    <div class="content-section">
      <h3>🛤️ VRF — Virtual Routing and Forwarding</h3>
      <p>VRF virtualisiert den <strong>Router</strong>: Ein physischer Router hält <strong>mehrere unabhängige Routing-Tabellen</strong>. Interfaces werden einer VRF zugewiesen; Traffic zwischen VRFs ist standardmäßig <em>nicht</em> möglich — selbst bei überlappenden IP-Bereichen.</p>
      <ul>
        <li>Vergleich: <strong>VLAN</strong> trennt Layer 2 auf einem Switch, <strong>VRF</strong> trennt Layer 3 auf einem Router.</li>
        <li>Einsatz: Mandantentrennung (Multi-Tenant), Service-Provider (MPLS L3VPN), Management-Netz getrennt vom Produktivnetz (<em>Mgmt-VRF</em>), Gast-Netz.</li>
      </ul>
      <pre><code><span class="cli-comment"># VRF-Lite auf Cisco IOS</span>
Router(config)# vrf definition KUNDE-A
Router(config-vrf)# address-family ipv4
Router(config-vrf)# exit-address-family
Router(config)# interface gi0/1
Router(config-if)# vrf forwarding KUNDE-A      <span class="cli-comment"># Achtung: löscht die IP-Adresse des Interfaces!</span>
Router(config-if)# ip address 10.1.1.1 255.255.255.0

Router# show ip route vrf KUNDE-A
Router# ping vrf KUNDE-A 10.1.1.2
Router# show vrf</code></pre>
      <div class="callout callout-warn"><strong>Prüfungsfalle</strong>Nach <code>vrf forwarding</code> auf einem Interface wird dessen IP-Adresse entfernt — sie muss neu gesetzt werden.</div>
    </div>
  `
}, {
  after: "wireless-basics",
  quiz: [
    {
      q: "Welcher Hypervisor-Typ läuft direkt auf der Hardware ohne Host-Betriebssystem?",
      options: ["Typ 1 (bare-metal), z.B. VMware ESXi", "Typ 2 (hosted), z.B. VirtualBox", "Container-Engine wie Docker", "vSwitch"],
      correct: 0,
      explanation: "Typ-1-Hypervisoren (ESXi, Hyper-V, KVM) laufen direkt auf der Hardware. Typ 2 (VirtualBox, VMware Workstation) läuft als Programm auf einem Host-OS.",
      theoryRef: "virtualization"
    },
    {
      q: "Was ist der wesentliche Unterschied zwischen Containern und virtuellen Maschinen?",
      options: ["Container haben ein eigenes Gast-Betriebssystem", "Container teilen sich den Kernel des Host-OS und sind dadurch leichtgewichtiger", "VMs starten schneller als Container", "Container benötigen einen Typ-1-Hypervisor"],
      correct: 1,
      explanation: "Container nutzen den Host-Kernel (OS-Level-Virtualisierung) und bringen nur Anwendung + Abhängigkeiten mit — daher MB statt GB und Start in Sekunden.",
      theoryRef: "virtualization"
    },
    {
      q: "Was ermöglicht VRF (Virtual Routing and Forwarding) auf einem Router?",
      options: ["Mehrere VLANs auf einem Trunk", "Mehrere unabhängige Routing-Tabellen auf einem physischen Router", "Virtuelle Maschinen auf dem Router auszuführen", "Load Balancing zwischen zwei ISPs"],
      correct: 1,
      explanation: "VRF erzeugt getrennte Routing-Instanzen (eigene Tabellen) auf einem Gerät. Interfaces werden einer VRF zugewiesen; überlappende IP-Bereiche sind möglich.",
      theoryRef: "virtualization"
    },
    {
      q: "Wie ist der vSwitch eines Hypervisor-Hosts typischerweise mit dem physischen Switch verbunden, wenn VMs in verschiedenen VLANs liegen?",
      options: ["Über einen Access-Port", "Über einen 802.1Q-Trunk", "Über ein Konsolenkabel", "Über einen Routed Port"],
      correct: 1,
      explanation: "Damit VMs in unterschiedlichen VLANs kommunizieren können, wird die physische NIC des Hosts als 802.1Q-Trunk mit dem Switch verbunden.",
      theoryRef: "virtualization"
    },
    {
      q: "Welche Aussage trifft auf VRF zu?",
      options: ["VRF trennt Layer 2 wie ein VLAN", "Traffic zwischen zwei VRFs wird standardmäßig geroutet", "VRF trennt Layer 3 — Routing-Tabellen sind voneinander isoliert", "VRF ist nur auf Switches verfügbar"],
      correct: 2,
      explanation: "VRF ist die Layer-3-Entsprechung zum VLAN: getrennte Routing-Tabellen, kein Traffic zwischen VRFs ohne explizite Route-Leaking-Konfiguration.",
      theoryRef: "virtualization"
    }
  ],
  flashcards: [
    { front: "Hypervisor Typ 1 vs. Typ 2", back: "Typ 1 = bare-metal (ESXi, Hyper-V, KVM); Typ 2 = auf Host-OS (VirtualBox, Workstation)" },
    { front: "Container", back: "OS-Level-Virtualisierung — teilen Host-Kernel, leichtgewichtig (Docker, Kubernetes)" },
    { front: "VRF", back: "Virtual Routing and Forwarding — mehrere getrennte Routing-Tabellen auf einem Router (L3-Pendant zum VLAN)" },
    { front: "vSwitch", back: "Virtueller Switch im Hypervisor, verbindet vNICs der VMs; Uplink meist als Trunk" },
    { front: "Kubernetes", back: "Container-Orchestrierung (Skalierung, Self-Healing); kleinste Einheit = Pod" }
  ]
});

// ---------- 1.13 Switching-Konzepte ----------
registerTopic({
  id: "switching-concepts",
  domain: "Network Fundamentals",
  domainPct: "20%",
  icon: "🔀",
  title: "Switching-Konzepte (MAC-Tabelle)",
  tags: ["Blueprint 1.13", "Layer 2", "Switching"],
  content: `
    <div class="content-section">
      <h3>🔀 Wie ein Switch Frames weiterleitet</h3>
      <p>Ein Switch lernt <strong>Quell-MAC-Adressen</strong> und entscheidet anhand der <strong>Ziel-MAC</strong>, wohin ein Frame geht. Die Tabelle heißt <strong>MAC-Adresstabelle</strong> (auch CAM-Tabelle — Content Addressable Memory).</p>
      <div class="table-wrap"><table>
        <tr><th>Vorgang</th><th>Was passiert</th></tr>
        <tr><td><strong>Learning</strong></td><td>Frame kommt an Port → Switch trägt <em>Quell-MAC + Port + VLAN</em> in die Tabelle ein (bzw. setzt den Timer zurück)</td></tr>
        <tr><td><strong>Forwarding (Filtering)</strong></td><td>Ziel-MAC ist bekannt → Frame wird <em>nur</em> zum passenden Port gesendet (alle anderen Ports werden gefiltert)</td></tr>
        <tr><td><strong>Flooding</strong></td><td>Ziel-MAC unbekannt (<em>Unknown Unicast</em>), Broadcast (FFFF.FFFF.FFFF) oder Multicast → Frame geht an <strong>alle Ports des VLANs außer dem Eingangsport</strong></td></tr>
        <tr><td><strong>Aging</strong></td><td>Eintrag wird gelöscht, wenn <strong>300 Sekunden</strong> (Standard) kein Frame von dieser MAC eintrifft</td></tr>
      </table></div>
      <pre><code>Beispiel: PC-A (MAC AAAA) an Fa0/1 sendet an PC-B (MAC BBBB), Tabelle leer

1. Frame AAAA → BBBB kommt an Fa0/1
2. LEARN:  AAAA → Fa0/1 (VLAN 1) wird eingetragen
3. LOOKUP: BBBB unbekannt → FLOOD an Fa0/2, Fa0/3, ... (nicht Fa0/1)
4. PC-B antwortet: BBBB → AAAA kommt an Fa0/2
5. LEARN:  BBBB → Fa0/2
6. LOOKUP: AAAA bekannt → FORWARD nur an Fa0/1</code></pre>
    </div>

    <div class="content-section">
      <h3>📋 MAC-Adresstabelle lesen und verwalten</h3>
      <pre><code>Switch# show mac address-table
          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
   1    0011.2233.aaaa    DYNAMIC     Fa0/1
   1    0011.2233.bbbb    DYNAMIC     Fa0/2
  10    0011.2233.cccc    STATIC      Gi0/1
 All    0100.0ccc.cccc    STATIC      CPU        <span class="cli-comment">← CDP/VTP/PAgP Multicast</span>

Switch# show mac address-table dynamic
Switch# show mac address-table interface fa0/1
Switch# show mac address-table vlan 10
Switch# show mac address-table aging-time
Switch# show mac address-table count

<span class="cli-comment"># Statischen Eintrag anlegen</span>
Switch(config)# mac address-table static 0011.2233.cccc vlan 10 interface gi0/1

<span class="cli-comment"># Aging-Zeit ändern (Sekunden), Tabelle leeren</span>
Switch(config)# mac address-table aging-time 600
Switch# clear mac address-table dynamic</code></pre>
      <ul>
        <li><strong>DYNAMIC</strong> — gelernt, unterliegt Aging. <strong>STATIC</strong> — manuell oder durch Port Security (sticky) gesetzt.</li>
        <li>Die Tabelle ist <strong>pro VLAN</strong> getrennt — dieselbe MAC kann in zwei VLANs an verschiedenen Ports stehen.</li>
        <li>Eine MAC an einem Port, der Port wechselt (z.B. Roaming, Loop!) → „MAC flapping“-Meldung.</li>
      </ul>
    </div>

    <div class="content-section">
      <h3>⚙️ Switching-Methoden und Frame-Aufbau</h3>
      <div class="table-wrap"><table>
        <tr><th>Methode</th><th>Beschreibung</th></tr>
        <tr><td><strong>Store-and-Forward</strong></td><td>Ganzer Frame wird empfangen, <strong>FCS/CRC geprüft</strong>, dann weitergeleitet. Fehlerhafte Frames werden verworfen. Standard bei Cisco Catalyst.</td></tr>
        <tr><td><strong>Cut-Through</strong></td><td>Weiterleitung beginnt, sobald die Ziel-MAC gelesen ist — geringe Latenz, aber keine Fehlerprüfung. (Fragment-Free = Variante, wartet auf die ersten 64 Byte)</td></tr>
      </table></div>
      <pre><code>Ethernet-Frame (IEEE 802.3)
┌──────────┬─────┬──────────┬──────────┬──────┬───────────────┬─────┐
│ Preamble │ SFD │ Ziel-MAC │ Quell-MAC│ Type │ Daten         │ FCS │
│  7 Byte  │ 1 B │  6 Byte  │  6 Byte  │ 2 B  │ 46–1500 Byte  │ 4 B │
└──────────┴─────┴──────────┴──────────┴──────┴───────────────┴─────┘
Header 14 Byte + Trailer 4 Byte → Frame 64–1518 Byte (ohne Preamble)</code></pre>
      <div class="callout callout-info"><strong>MAC-Adresse</strong>48 Bit, hexadezimal, z.B. <code>00:1A:2B:3C:4D:5E</code>. Erste 24 Bit = <strong>OUI</strong> (Hersteller), letzte 24 Bit = geräteeindeutig. Broadcast = <code>FF:FF:FF:FF:FF:FF</code>. Multicast-Bit = niedrigstwertiges Bit des ersten Bytes (z.B. <code>01:00:5E</code> = IPv4-Multicast).</div>
    </div>
  `
}, {
  after: "virtualization",
  quiz: [
    {
      q: "Ein Switch empfängt einen Frame, dessen Ziel-MAC nicht in der MAC-Tabelle steht. Was macht er?",
      options: ["Er verwirft den Frame", "Er sendet den Frame an alle Ports desselben VLANs außer dem Eingangsport (Flooding)", "Er sendet den Frame an den Router", "Er sendet eine ARP-Anfrage"],
      correct: 1,
      explanation: "Unknown Unicast wird geflutet: an alle Ports im VLAN außer dem Eingangsport. Sobald das Ziel antwortet, lernt der Switch dessen MAC.",
      theoryRef: "switching-concepts"
    },
    {
      q: "Anhand welcher Adresse lernt ein Switch Einträge für seine MAC-Adresstabelle?",
      options: ["Ziel-MAC-Adresse", "Quell-MAC-Adresse", "Quell-IP-Adresse", "Ziel-IP-Adresse"],
      correct: 1,
      explanation: "Der Switch lernt aus der Quell-MAC eingehender Frames (plus Eingangsport und VLAN). Die Ziel-MAC nutzt er nur für die Weiterleitungsentscheidung.",
      theoryRef: "switching-concepts"
    },
    {
      q: "Wie lange bleibt ein dynamisch gelernter MAC-Eintrag standardmäßig in der Tabelle, wenn keine Frames mehr von dieser MAC eintreffen?",
      options: ["30 Sekunden", "120 Sekunden", "300 Sekunden", "24 Stunden"],
      correct: 2,
      explanation: "Die Standard-Aging-Time auf Cisco-Switches beträgt 300 Sekunden (5 Minuten).",
      theoryRef: "switching-concepts"
    },
    {
      q: "Welche Switching-Methode prüft die FCS/CRC des gesamten Frames, bevor sie ihn weiterleitet?",
      options: ["Cut-Through", "Fragment-Free", "Store-and-Forward", "Fast-Forward"],
      correct: 2,
      explanation: "Store-and-Forward empfängt den kompletten Frame, prüft die Prüfsumme und verwirft defekte Frames. Cut-Through leitet sofort nach der Ziel-MAC weiter.",
      theoryRef: "switching-concepts"
    },
    {
      q: "Mit welchem Befehl zeigst du nur die dynamisch gelernten MAC-Adressen an?",
      options: ["show mac address-table static", "show mac address-table dynamic", "show arp", "show cam dynamic"],
      correct: 1,
      explanation: "'show mac address-table dynamic' filtert auf gelernte Einträge. 'show arp' zeigt die IP-zu-MAC-Zuordnung des Geräts selbst — nicht die Switching-Tabelle.",
      theoryRef: "switching-concepts"
    }
  ],
  flashcards: [
    { front: "Switch lernt anhand …", back: "der Quell-MAC (+ Port + VLAN)" },
    { front: "Unknown Unicast", back: "Ziel-MAC unbekannt → Flooding an alle Ports im VLAN außer Eingangsport" },
    { front: "MAC Aging-Time (Standard)", back: "300 Sekunden" },
    { front: "Store-and-Forward", back: "Ganzer Frame empfangen, CRC prüfen, dann weiterleiten (Cisco-Standard)" },
    { front: "Ethernet-Frame Größe", back: "64–1518 Byte (Header 14 + Daten 46–1500 + FCS 4)" },
    { front: "OUI", back: "Erste 24 Bit der MAC = Herstellerkennung" }
  ]
});

// Flashcards für bestehendes Thema IPv6
extendTopic("ipv6", {
  flashcards: [
    { front: "IPv6 Adresslänge", back: "128 Bit — 8 Gruppen à 4 Hex-Ziffern" },
    { front: "Link-Local Präfix", back: "FE80::/10 — automatisch auf jedem IPv6-Interface" },
    { front: "Global Unicast Präfix", back: "2000::/3" },
    { front: "Unique Local Präfix", back: "FC00::/7 (praktisch FD00::/8) — privat, nicht routebar" },
    { front: "IPv6 Multicast Präfix", back: "FF00::/8 — FF02::1 alle Nodes, FF02::2 alle Router" },
    { front: "EUI-64", back: "MAC teilen, FFFE einfügen, 7. Bit invertieren → 64-Bit Interface-ID" },
    { front: "Ersatz für ARP in IPv6", back: "NDP (Neighbor Discovery, ICMPv6) — NS/NA und RS/RA" },
    { front: "SLAAC", back: "Stateless Address Autoconfiguration — Präfix aus Router Advertisement + eigene Interface-ID" },
    { front: "Anycast", back: "Gleiche Unicast-Adresse auf mehreren Geräten — nächstes antwortet" }
  ]
});
