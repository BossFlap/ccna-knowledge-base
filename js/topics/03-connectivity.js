// ===== Domain 3: IP Connectivity (25%) — Erweiterungen nach Blueprint v1.1 =====

// ---------- 3.1 / 3.2 Routing-Tabelle & Forwarding ----------
registerTopic({
  id: "routing-table",
  domain: "IP Connectivity",
  domainPct: "25%",
  icon: "📖",
  title: "Routing-Tabelle & Forwarding",
  tags: ["Blueprint 3.1", "Blueprint 3.2", "Routing", "Longest Prefix Match"],
  content: `
    <div class="content-section">
      <h3>📖 Die Routing-Tabelle lesen (Blueprint 3.1)</h3>
      <pre><code>R1# show ip route
Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2
       i - IS-IS, * - candidate default, ...

<span class="cli-output">Gateway of last resort is 203.0.113.1 to network 0.0.0.0</span>

S*    0.0.0.0/0 [1/0] via 203.0.113.1
      10.0.0.0/8 is variably subnetted, 4 subnets, 2 masks
C        10.1.1.0/24 is directly connected, GigabitEthernet0/0
L        10.1.1.1/32 is directly connected, GigabitEthernet0/0
O        10.2.2.0/24 [110/2] via 10.1.1.2, 00:12:34, GigabitEthernet0/0
D        10.3.3.0/24 [90/30720] via 10.1.1.3, 01:02:03, GigabitEthernet0/0
S        192.168.5.0/24 [1/0] via 10.1.1.2</code></pre>
      <div class="table-wrap"><table>
        <tr><th>Bestandteil</th><th>Beispiel</th><th>Bedeutung</th></tr>
        <tr><td><strong>Routing-Protocol-Code</strong></td><td><code>O</code>, <code>D</code>, <code>S</code>, <code>C</code>, <code>L</code></td><td>Quelle der Route: OSPF, EIGRP, static, connected, local (eigene Interface-IP als /32)</td></tr>
        <tr><td><strong>Prefix</strong></td><td><code>10.2.2.0</code></td><td>Zielnetz</td></tr>
        <tr><td><strong>Network Mask</strong></td><td><code>/24</code></td><td>Präfixlänge — bestimmt, wie viele Bits übereinstimmen müssen</td></tr>
        <tr><td><strong>Administrative Distance</strong></td><td><code>[110/…]</code></td><td>Vertrauenswürdigkeit der Quelle (erste Zahl in Klammern)</td></tr>
        <tr><td><strong>Metric</strong></td><td><code>[…/2]</code></td><td>„Kosten“ innerhalb des Protokolls (zweite Zahl) — OSPF Cost, EIGRP composite, RIP Hops</td></tr>
        <tr><td><strong>Next Hop</strong></td><td><code>via 10.1.1.2</code></td><td>IP des nächsten Routers</td></tr>
        <tr><td><strong>Alter / Exit-Interface</strong></td><td><code>00:12:34, Gi0/0</code></td><td>Zeit seit letztem Update (nur dynamisch) und ausgehendes Interface</td></tr>
        <tr><td><strong>Gateway of Last Resort</strong></td><td><code>S* 0.0.0.0/0</code></td><td>Default Route — greift, wenn kein spezifischerer Eintrag passt</td></tr>
      </table></div>
      <div class="callout callout-info"><strong>C vs. L</strong>Jedes aktive Interface erzeugt <strong>zwei</strong> Einträge: <code>C</code> für das Netz (/24) und <code>L</code> für die eigene Adresse (/32). Der L-Eintrag lässt den Router Pakete an sich selbst erkennen.</div>
    </div>

    <div class="content-section">
      <h3>🎯 Wie entscheidet der Router? (Blueprint 3.2)</h3>
      <p>Drei Stufen — in <strong>dieser Reihenfolge</strong>:</p>
      <div class="table-wrap"><table>
        <tr><th>Stufe</th><th>Kriterium</th><th>Wann?</th></tr>
        <tr><td><strong>1. Longest Prefix Match</strong></td><td>Der Eintrag mit der <strong>längsten übereinstimmenden Präfixlänge</strong> gewinnt — <em>immer</em>, unabhängig von AD oder Metric</td><td>Beim Forwarding jedes einzelnen Pakets</td></tr>
        <tr><td><strong>2. Administrative Distance</strong></td><td>Bieten <em>mehrere Quellen</em> dasselbe Präfix an (gleiche Länge), kommt nur die Route mit der <strong>niedrigsten AD</strong> in die Tabelle</td><td>Beim Befüllen der Routing-Tabelle</td></tr>
        <tr><td><strong>3. Metric</strong></td><td>Innerhalb <em>desselben</em> Protokolls gewinnt die <strong>niedrigste Metric</strong>; gleiche Metric → Load Balancing (ECMP)</td><td>Beim Befüllen der Routing-Tabelle</td></tr>
      </table></div>
      <pre><code>Beispiel — Paket an 10.1.5.77, Tabelle enthält:
  S  0.0.0.0/0        via 203.0.113.1
  O  10.0.0.0/8       via 10.1.1.2
  D  10.1.0.0/16      via 10.1.1.3
  S  10.1.5.0/24      via 10.1.1.4     ← gewinnt (längster Match, /24)
  O  10.1.5.64/26     via 10.1.1.5     ← NEIN, gewinnt noch mehr! /26 ist länger

→ 10.1.5.77 liegt in 10.1.5.64/26 (64–127) → Next Hop 10.1.1.5
   AD (OSPF 110 vs. static 1) spielt hier KEINE Rolle — nur die Präfixlänge.</code></pre>
      <div class="callout callout-warn"><strong>Häufiger Denkfehler</strong>„Statische Routen (AD 1) werden immer bevorzugt“ — <strong>falsch</strong>. AD vergleicht nur Routen zum <em>exakt gleichen</em> Präfix. Ein spezifischerer OSPF-Eintrag schlägt eine allgemeinere statische Route.</div>
    </div>

    <div class="content-section">
      <h3>📊 Administrative Distance und Metrics im Überblick</h3>
      <div class="table-wrap"><table>
        <tr><th>Quelle</th><th>AD</th><th>Metric</th></tr>
        <tr><td>Connected</td><td>0</td><td>—</td></tr>
        <tr><td>Static</td><td>1</td><td>—</td></tr>
        <tr><td>EIGRP Summary</td><td>5</td><td>—</td></tr>
        <tr><td>eBGP</td><td>20</td><td>Path Attributes</td></tr>
        <tr><td>EIGRP (intern)</td><td>90</td><td>Composite: Bandbreite + Delay (K-Werte)</td></tr>
        <tr><td>OSPF</td><td>110</td><td>Cost = Referenzbandbreite / Interface-Bandbreite (Summe entlang des Pfads)</td></tr>
        <tr><td>IS-IS</td><td>115</td><td>Cost (Standard 10 pro Link)</td></tr>
        <tr><td>RIP</td><td>120</td><td>Hop Count (max. 15)</td></tr>
        <tr><td>EIGRP (extern)</td><td>170</td><td>Composite</td></tr>
        <tr><td>iBGP</td><td>200</td><td>Path Attributes</td></tr>
        <tr><td>Unbekannt</td><td>255</td><td>Route wird nicht installiert</td></tr>
      </table></div>
      <h4>Weitere nützliche Befehle</h4>
      <pre><code>R1# show ip route 10.1.5.77            <span class="cli-comment"># zeigt GENAU den Eintrag, der für dieses Ziel verwendet würde</span>
R1# show ip route ospf
R1# show ip route summary
R1# show ip protocols                  <span class="cli-comment"># aktive Routing-Protokolle, AD, Netze, Nachbarn</span>
R1# show ip cef 10.1.5.77              <span class="cli-comment"># Forwarding-Tabelle (CEF/FIB) — was die Hardware wirklich nutzt</span>
R1# show ipv6 route</code></pre>
      <div class="callout callout-tip"><strong>Control Plane vs. Data Plane</strong>Routing-Protokolle bauen die <strong>RIB</strong> (Routing-Tabelle, Control Plane). Daraus wird die <strong>FIB</strong> (CEF, Data Plane) erzeugt, mit der Pakete in Hardware weitergeleitet werden. Zusätzlich hält CEF eine <strong>Adjacency-Tabelle</strong> mit den L2-Headern (MACs) der Next Hops.</div>
    </div>
  `
}, {
  before: "static-routing",
  quiz: [
    {
      q: "Ein Router hat folgende Routen: S 10.0.0.0/8 via A, O 10.1.0.0/16 via B, D 10.1.1.0/24 via C. Wohin geht ein Paket an 10.1.1.50?",
      options: ["Via A — statische Route hat AD 1", "Via B — OSPF ist zuverlässiger", "Via C — längster Präfix-Match (/24)", "Es wird verworfen"],
      correct: 2,
      explanation: "Der Longest Prefix Match hat immer Vorrang vor AD und Metric. /24 ist der spezifischste Eintrag, also via C (EIGRP).",
      theoryRef: "routing-table"
    },
    {
      q: "Was bedeutet in 'O 10.2.2.0/24 [110/2] via 10.1.1.2' die Zahl 2?",
      options: ["Administrative Distance", "Anzahl Hops", "Die OSPF-Metric (Cost)", "Die Anzahl der Next Hops"],
      correct: 2,
      explanation: "In [AD/Metric] ist 110 die AD von OSPF und 2 die OSPF-Cost zum Ziel.",
      theoryRef: "routing-table"
    },
    {
      q: "Wann wird die Administrative Distance zur Entscheidung herangezogen?",
      options: ["Bei jedem Paket zuerst", "Wenn mehrere Routing-Quellen eine Route zum exakt gleichen Präfix anbieten", "Nur bei statischen Routen", "Nur wenn keine Default Route existiert"],
      correct: 1,
      explanation: "AD entscheidet, welche Route in die Tabelle kommt, wenn zwei Quellen dasselbe Präfix (gleiche Länge) anbieten. Beim Forwarding zählt der Longest Prefix Match.",
      theoryRef: "routing-table"
    },
    {
      q: "Welcher Routing-Code kennzeichnet die eigene Interface-Adresse eines Routers als /32-Eintrag?",
      options: ["C", "L", "S", "O"],
      correct: 1,
      explanation: "L (local) = eigene Interface-IP als /32-Host-Route. C (connected) = das direkt angeschlossene Netz.",
      theoryRef: "routing-table"
    },
    {
      q: "Was zeigt 'Gateway of last resort is 203.0.113.1 to network 0.0.0.0' an?",
      options: ["Der Router hat keine Default Route", "Der Router nutzt 203.0.113.1 als Default Route für alle Ziele ohne spezifischeren Eintrag", "203.0.113.1 ist der OSPF-DR", "Alle Pakete werden an 203.0.113.1 gesendet"],
      correct: 1,
      explanation: "Das Gateway of Last Resort ist der Next Hop der Default Route (0.0.0.0/0). Es greift nur, wenn kein spezifischerer Eintrag passt.",
      theoryRef: "routing-table"
    }
  ],
  flashcards: [
    { front: "Reihenfolge der Forwarding-Entscheidung", back: "1. Longest Prefix Match → 2. Administrative Distance → 3. Metric" },
    { front: "[110/2] bedeutet", back: "AD 110 (OSPF) / Metric 2 (Cost)" },
    { front: "Code L", back: "Local — eigene Interface-IP als /32" },
    { front: "Gateway of Last Resort", back: "Next Hop der Default Route 0.0.0.0/0" },
    { front: "RIB vs. FIB", back: "RIB = Routing-Tabelle (Control Plane); FIB = CEF-Forwarding-Tabelle (Data Plane)" },
    { front: "AD: Connected / Static / eBGP / EIGRP / OSPF / RIP", back: "0 / 1 / 20 / 90 / 110 / 120" }
  ]
});

// ---------- 3.5 First Hop Redundancy Protocols ----------
registerTopic({
  id: "fhrp",
  domain: "IP Connectivity",
  domainPct: "25%",
  icon: "🛟",
  title: "FHRP — HSRP, VRRP, GLBP",
  tags: ["Blueprint 3.5", "Redundanz", "Gateway"],
  content: `
    <div class="content-section">
      <h3>🛟 Warum First Hop Redundancy?</h3>
      <p>Endgeräte kennen genau <strong>ein Default Gateway</strong>. Fällt dieser Router aus, ist das Subnetz vom Rest der Welt abgeschnitten — auch wenn ein zweiter Router existiert. FHRPs lösen das: Mehrere Router teilen sich eine <strong>virtuelle IP</strong> und eine <strong>virtuelle MAC</strong>. Die Clients zeigen auf die virtuelle IP; wer gerade aktiv ist, ist ihnen egal.</p>
      <pre><code>                 PC: Default Gateway = 10.1.1.1 (virtuelle IP)
                          │
              ┌───────────┴───────────┐
        ┌─────┴─────┐           ┌─────┴─────┐
        │    R1     │           │    R2     │
        │ 10.1.1.2  │  Hellos   │ 10.1.1.3  │
        │  ACTIVE   │◄─────────►│  STANDBY  │
        └───────────┘           └───────────┘
        Virtuelle IP 10.1.1.1 · virtuelle MAC 0000.0C07.AC0A (HSRP Gruppe 10)</code></pre>
    </div>

    <div class="content-section">
      <h3>📊 Die drei Protokolle im Vergleich</h3>
      <div class="table-wrap"><table>
        <tr><th>Merkmal</th><th>HSRP</th><th>VRRP</th><th>GLBP</th></tr>
        <tr><td>Standard</td><td>Cisco-proprietär (RFC 2281 informational)</td><td>IETF-Standard (RFC 5798)</td><td>Cisco-proprietär</td></tr>
        <tr><td>Rollen</td><td><strong>Active</strong> / <strong>Standby</strong> (+ Listen)</td><td><strong>Master</strong> / <strong>Backup</strong></td><td><strong>AVG</strong> (Active Virtual Gateway) + bis zu 4 <strong>AVF</strong> (Active Virtual Forwarder)</td></tr>
        <tr><td>Virtuelle IP</td><td>Eigene Adresse (nicht die eines Routers)</td><td>Kann die reale IP des Masters sein</td><td>Eigene Adresse</td></tr>
        <tr><td>Virtuelle MAC</td><td>v1: <code>0000.0C07.ACxx</code> (xx = Gruppe hex)<br>v2: <code>0000.0C9F.Fxxx</code></td><td><code>0000.5E00.01xx</code></td><td><code>0007.B400.xxyy</code> (xx = Gruppe, yy = Forwarder)</td></tr>
        <tr><td>Multicast</td><td>v1: 224.0.0.2 (UDP 1985)<br>v2: 224.0.0.102</td><td>224.0.0.18 (IP-Protokoll 112)</td><td>224.0.0.102 (UDP 3222)</td></tr>
        <tr><td>Timer (Hello/Hold)</td><td>3 s / 10 s</td><td>1 s / 3 s</td><td>3 s / 10 s</td></tr>
        <tr><td>Priorität</td><td>0–255, Standard <strong>100</strong>; höchste gewinnt, Tie → höchste IP</td><td>1–254, Standard 100</td><td>1–255, Standard 100</td></tr>
        <tr><td>Preemption</td><td>Standardmäßig <strong>aus</strong> (<code>standby preempt</code>)</td><td>Standardmäßig <strong>an</strong></td><td>Standardmäßig aus (für AVG)</td></tr>
        <tr><td>Load Balancing</td><td>Nur über mehrere Gruppen (pro VLAN eine andere Active)</td><td>Nur über mehrere Gruppen</td><td><strong>Eingebaut</strong>: AVG verteilt die AVF-MACs per ARP an die Clients (round-robin, weighted, host-dependent)</td></tr>
        <tr><td>IPv6</td><td>HSRPv2</td><td>VRRPv3</td><td>Ja</td></tr>
      </table></div>
    </div>

    <div class="content-section">
      <h3>⚙️ HSRP konfigurieren</h3>
      <pre><code><span class="cli-comment"># R1 — soll Active werden</span>
R1(config)# interface gi0/1
R1(config-if)# ip address 10.1.1.2 255.255.255.0
R1(config-if)# standby version 2
R1(config-if)# standby 10 ip 10.1.1.1              <span class="cli-comment"># virtuelle IP, Gruppe 10</span>
R1(config-if)# standby 10 priority 110             <span class="cli-comment"># höher als Standard 100</span>
R1(config-if)# standby 10 preempt                  <span class="cli-comment"># Rolle zurückholen, wenn R1 wieder da ist</span>
R1(config-if)# standby 10 track gi0/0 20           <span class="cli-comment"># WAN-Link down → Priorität −20 → 90 &lt; 100 → R2 wird Active</span>
R1(config-if)# standby 10 authentication md5 key-string Hsrp!Key

<span class="cli-comment"># R2 — Standby</span>
R2(config-if)# ip address 10.1.1.3 255.255.255.0
R2(config-if)# standby version 2
R2(config-if)# standby 10 ip 10.1.1.1
R2(config-if)# standby 10 preempt

<span class="cli-comment"># Verifikation</span>
R1# show standby
R1# show standby brief
                     P indicates configured to preempt.
Interface   Grp  Pri P State   Active          Standby         Virtual IP
Gi0/1       10   110 P Active  local           10.1.1.3        10.1.1.1</code></pre>
      <ul>
        <li><strong>Preempt</strong>: Ohne Preempt bleibt der zuerst gestartete Router Active, auch wenn ein höher priorisierter Router hinzukommt. Nach einem Reboot von R1 übernimmt R1 nur mit <code>preempt</code> wieder.</li>
        <li><strong>Tracking</strong>: Fällt das getrackte Interface (z.B. WAN-Uplink), sinkt die Priorität, damit der andere Router mit funktionierendem Uplink Active wird. Der andere Router braucht <code>preempt</code>, um übernehmen zu können!</li>
        <li>HSRP-Gruppen-Nummer und virtuelle IP müssen auf beiden Routern <strong>identisch</strong> sein; die HSRP-Version ebenfalls (v1 und v2 sind nicht kompatibel).</li>
      </ul>
      <div class="callout callout-tip"><strong>Blueprint-Verb: „Describe“</strong>Für 3.5 musst du Zweck, Funktion und Konzepte (Active/Standby, virtuelle IP/MAC, Priorität, Preempt) erklären können — die Konfiguration ist Bonus.</div>
    </div>
  `
}, {
  after: "ospf",
  quiz: [
    {
      q: "Welches First Hop Redundancy Protocol ist ein offener IETF-Standard?",
      options: ["HSRP", "VRRP", "GLBP", "STP"],
      correct: 1,
      explanation: "VRRP (RFC 5798) ist herstellerneutral. HSRP und GLBP sind Cisco-proprietär.",
      theoryRef: "fhrp"
    },
    {
      q: "R1 (Priorität 110) startet nach einem Ausfall neu, R2 (Priorität 100) ist derzeit HSRP-Active. Was passiert, wenn auf R1 kein 'standby preempt' konfiguriert ist?",
      options: ["R1 wird sofort Active", "R2 bleibt Active, R1 wird Standby", "Beide werden Active", "HSRP wird deaktiviert"],
      correct: 1,
      explanation: "Ohne Preempt übernimmt ein Router die Active-Rolle nicht aktiv zurück, auch wenn seine Priorität höher ist. R2 bleibt Active.",
      theoryRef: "fhrp"
    },
    {
      q: "Welches FHRP bietet Load Balancing über mehrere Gateways innerhalb einer Gruppe?",
      options: ["HSRP", "VRRP", "GLBP", "Alle drei gleichermaßen"],
      correct: 2,
      explanation: "GLBP nutzt einen AVG, der bis zu vier AVFs verschiedene virtuelle MACs zuweist und diese per ARP an Clients verteilt — Load Balancing ohne mehrere Gruppen.",
      theoryRef: "fhrp"
    },
    {
      q: "Welche Aussage zur HSRP-Standardpriorität und Auswahl des Active-Routers ist korrekt?",
      options: ["Standard 100; niedrigste Priorität gewinnt", "Standard 100; höchste Priorität gewinnt, bei Gleichstand die höchste IP", "Standard 32768; höchste MAC gewinnt", "Standard 1; niedrigste IP gewinnt"],
      correct: 1,
      explanation: "HSRP-Standardpriorität ist 100. Der Router mit der höchsten Priorität wird Active; bei Gleichstand gewinnt die höhere Interface-IP.",
      theoryRef: "fhrp"
    },
    {
      q: "Wie lautet die virtuelle MAC-Adresse für HSRP Version 1, Gruppe 10?",
      options: ["0000.5E00.010A", "0000.0C07.AC0A", "0007.B400.0A01", "0100.5E00.000A"],
      correct: 1,
      explanation: "HSRPv1 nutzt 0000.0C07.ACxx mit xx = Gruppennummer in Hex (10 = 0A). 0000.5E00.01xx ist VRRP, 0007.B400.xxyy ist GLBP.",
      theoryRef: "fhrp"
    }
  ],
  flashcards: [
    { front: "HSRP Rollen", back: "Active / Standby (Cisco-proprietär)" },
    { front: "VRRP Rollen", back: "Master / Backup (IETF-Standard, RFC 5798)" },
    { front: "GLBP Rollen", back: "AVG (Active Virtual Gateway) + bis zu 4 AVF (Forwarder) — Load Balancing" },
    { front: "HSRP virtuelle MAC (v1)", back: "0000.0C07.ACxx (xx = Gruppe hex)" },
    { front: "VRRP virtuelle MAC", back: "0000.5E00.01xx" },
    { front: "HSRP Standard-Priorität / Timer", back: "100 / Hello 3 s, Hold 10 s" },
    { front: "standby preempt", back: "Router holt sich Active-Rolle zurück, wenn seine Priorität höher ist (Standard: aus)" },
    { front: "HSRP Multicast", back: "v1: 224.0.0.2 · v2: 224.0.0.102 (UDP 1985)" }
  ]
});

// Zusätzliche Fragen zu bestehenden Themen
extendTopic("static-routing", {
  quiz: [
    {
      q: "Welche IPv6-Route konfiguriert eine Default Route über das Interface Gi0/0 mit Link-Local-Next-Hop?",
      options: ["ipv6 route ::/0 FE80::1", "ipv6 route ::/0 gi0/0 FE80::1", "ipv6 route 0.0.0.0/0 gi0/0", "ip route ::/0 gi0/0"],
      correct: 1,
      explanation: "Für IPv6 ist die Default Route ::/0. Bei einem Link-Local-Next-Hop (FE80::) muss zwingend das Exit-Interface mit angegeben werden.",
      theoryRef: "static-routing"
    },
    {
      q: "Was ist eine 'Floating Static Route'?",
      options: ["Eine Route ohne Next Hop", "Eine statische Route mit höherer AD als die primäre Route, die nur bei deren Ausfall aktiv wird", "Eine Route, die zwischen Interfaces wechselt", "Eine Default Route"],
      correct: 1,
      explanation: "Floating Static = Backup-Route: durch eine höhere AD (z.B. 'ip route ... 10.0.1.2 5') bleibt sie inaktiv, solange die bevorzugte Route (niedrigere AD) existiert.",
      theoryRef: "static-routing"
    },
    {
      q: "Welche Subnetzmaske kennzeichnet eine IPv4-Host-Route?",
      options: ["255.255.255.0", "255.255.255.252", "255.255.255.255", "0.0.0.0"],
      correct: 2,
      explanation: "Eine Host-Route zielt auf genau eine Adresse: /32 = 255.255.255.255 (IPv6: /128).",
      theoryRef: "static-routing"
    }
  ],
  flashcards: [
    { front: "IPv6 Default Route", back: "ipv6 route ::/0 <next-hop> — bei Link-Local: Exit-Interface Pflicht" },
    { front: "Host Route", back: "/32 (IPv4) bzw. /128 (IPv6) — Route zu genau einem Host" },
    { front: "Floating Static Route", back: "Backup-Route mit höherer AD (z.B. AD 5), aktiv nur bei Ausfall der primären" },
    { front: "Standard-AD statische Route", back: "1 (Exit-Interface und Next-Hop gleich)" }
  ]
});

extendTopic("ospf", {
  quiz: [
    {
      q: "Zwei OSPF-Router werden keine Nachbarn. Welche Parameter MÜSSEN übereinstimmen?",
      options: ["Router-ID und Prozess-ID", "Area-ID, Hello/Dead-Timer, Subnetz/Maske, Authentifizierung, Netzwerktyp", "Nur die Prozess-ID", "Interface-Bandbreite und Cost"],
      correct: 1,
      explanation: "Für eine Adjacency müssen Area-ID, Hello- und Dead-Intervall, Subnetz und Maske, Authentifizierung, Stub-Flags und MTU (für Full-State) passen. Die Prozess-ID ist lokal und darf abweichen; die Router-ID muss unterschiedlich sein.",
      theoryRef: "ospf"
    },
    {
      q: "Wie wird die OSPF Router-ID bestimmt, wenn sie nicht manuell konfiguriert ist?",
      options: ["Niedrigste IP eines physischen Interfaces", "Höchste IP eines Loopback-Interfaces, sonst höchste IP eines aktiven physischen Interfaces", "Die MAC-Adresse des ersten Interfaces", "Immer 1.1.1.1"],
      correct: 1,
      explanation: "Reihenfolge: 1. router-id Befehl, 2. höchste Loopback-IP, 3. höchste IP eines aktiven physischen Interfaces.",
      theoryRef: "ospf"
    },
    {
      q: "Auf einem Point-to-Point-Link zwischen zwei OSPF-Routern — wer wird DR?",
      options: ["Der Router mit der höheren Priorität", "Der Router mit der höheren Router-ID", "Es wird kein DR/BDR gewählt", "Beide werden DR"],
      correct: 2,
      explanation: "Der Netzwerktyp Point-to-Point wählt keinen DR/BDR. Nur Broadcast- (Ethernet) und NBMA-Netze führen eine DR/BDR-Wahl durch.",
      theoryRef: "ospf"
    }
  ]
});
