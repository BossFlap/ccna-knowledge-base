// ===== Domain 5: Security Fundamentals (15%) — Erweiterungen nach Blueprint v1.1 =====

// ---------- 5.1 / 5.2 / 5.4 Sicherheitskonzepte ----------
registerTopic({
  id: "security-concepts",
  domain: "Security Fundamentals",
  domainPct: "15%",
  icon: "🧠",
  title: "Sicherheitskonzepte & Passwort-Policy",
  tags: ["Blueprint 5.1", "Blueprint 5.2", "Blueprint 5.4", "Threats", "MFA"],
  content: `
    <div class="content-section">
      <h3>🧠 Grundbegriffe (Blueprint 5.1)</h3>
      <div class="table-wrap"><table>
        <tr><th>Begriff</th><th>Definition</th><th>Beispiel</th></tr>
        <tr><td><strong>Asset</strong></td><td>Etwas Schützenswertes</td><td>Daten, Server, Reputation</td></tr>
        <tr><td><strong>Vulnerability</strong> (Schwachstelle)</td><td>Eine Schwäche, die ausgenutzt werden <em>könnte</em></td><td>Ungepatchtes IOS, Standardpasswort, offener Telnet-Port</td></tr>
        <tr><td><strong>Exploit</strong></td><td>Werkzeug/Methode, um eine Schwachstelle tatsächlich auszunutzen</td><td>Skript, das den Buffer Overflow auslöst</td></tr>
        <tr><td><strong>Threat</strong> (Bedrohung)</td><td>Potenzielle Gefahr, dass jemand/etwas eine Schwachstelle ausnutzt</td><td>Angreifer, Malware, Insider, Naturereignis</td></tr>
        <tr><td><strong>Risk</strong></td><td>Wahrscheinlichkeit × Auswirkung</td><td>Hoch, wenn Schwachstelle bekannt und Exploit verfügbar</td></tr>
        <tr><td><strong>Mitigation</strong></td><td>Maßnahme, die Schwachstelle beseitigt oder Risiko reduziert</td><td>Patchen, Härten, Segmentieren, Firewall, Schulung</td></tr>
      </table></div>
      <div class="callout callout-info"><strong>CIA-Triade</strong><strong>Confidentiality</strong> (Vertraulichkeit — Verschlüsselung, Zugriffskontrolle) · <strong>Integrity</strong> (Integrität — Hashes, Signaturen) · <strong>Availability</strong> (Verfügbarkeit — Redundanz, DoS-Schutz).</div>
    </div>

    <div class="content-section">
      <h3>⚔️ Häufige Angriffe und Gegenmaßnahmen</h3>
      <div class="table-wrap"><table>
        <tr><th>Angriff</th><th>Wie</th><th>Mitigation</th></tr>
        <tr><td><strong>DoS / DDoS</strong></td><td>Dienst mit Anfragen überfluten (SYN-Flood, Amplification), verteilt via Botnet</td><td>Rate Limiting, Firewalls, Scrubbing-Dienste, Anti-Spoofing (uRPF)</td></tr>
        <tr><td><strong>Spoofing</strong></td><td>Absender fälschen: IP-, MAC-, ARP-, DHCP-Spoofing</td><td>ACLs, DHCP Snooping, DAI, Port Security, IP Source Guard</td></tr>
        <tr><td><strong>Man-in-the-Middle</strong></td><td>Sich zwischen zwei Parteien schalten (ARP-Poisoning, Rogue DHCP/AP)</td><td>DAI, DHCP Snooping, Verschlüsselung (TLS, SSH), 802.1X</td></tr>
        <tr><td><strong>Reconnaissance</strong></td><td>Ausspähen: Ping Sweeps, Port-Scans, CDP-Infos</td><td>ICMP begrenzen, CDP/LLDP an Edge-Ports aus, IPS</td></tr>
        <tr><td><strong>Buffer Overflow</strong></td><td>Mehr Daten als Speicher → Code ausführen</td><td>Patchen, Input-Validierung</td></tr>
        <tr><td><strong>Malware</strong></td><td>Virus (braucht Wirt), Wurm (verbreitet sich selbst), Trojaner (getarnt), Ransomware (verschlüsselt), Spyware</td><td>Endpoint-Schutz (AMP), Patching, Backups, Segmentierung</td></tr>
        <tr><td><strong>Social Engineering</strong></td><td>Menschen manipulieren: <strong>Phishing</strong> (Massen-Mail), <strong>Spear Phishing</strong> (gezielt), <strong>Whaling</strong> (Führungskräfte), <strong>Vishing</strong> (Telefon), <strong>Smishing</strong> (SMS), <strong>Pretexting</strong>, <strong>Tailgating</strong>, <strong>Baiting</strong> (USB-Stick)</td><td><strong>User Awareness &amp; Training</strong>, MFA, E-Mail-Filter</td></tr>
        <tr><td><strong>Passwort-Angriffe</strong></td><td>Brute Force, Dictionary, Credential Stuffing, Rainbow Tables</td><td>Komplexe Passwörter, Lockout, MFA, Hashing mit Salt</td></tr>
        <tr><td><strong>VLAN Hopping</strong></td><td>Double Tagging, Switch Spoofing (DTP)</td><td>DTP aus (nonegotiate), Native VLAN ändern, ungenutzte Ports in Parking-VLAN</td></tr>
      </table></div>
    </div>

    <div class="content-section">
      <h3>🏛️ Security-Programm: Awareness, Training, physischer Zugang (Blueprint 5.2)</h3>
      <ul>
        <li><strong>User Awareness</strong>: Mitarbeitende für Gefahren sensibilisieren — Phishing-Simulationen, Newsletter, Poster. Ziel: gesunde Skepsis („Ist diese Mail echt?“).</li>
        <li><strong>Training</strong>: Formale, rollenbezogene Schulungen — sichere Passwörter, Umgang mit Daten, Meldewege bei Vorfällen, Compliance (DSGVO). Regelmäßig wiederholen und dokumentieren.</li>
        <li><strong>Physical Access Control</strong>: Türen mit Badge/Biometrie, Mantraps, Videoüberwachung, Besucherprotokoll, verschlossene Racks und Serverräume, Kabel-Schlösser. Wer physischen Zugang zu einem Switch hat, kann Password Recovery durchführen!</li>
      </ul>
      <div class="callout callout-tip"><strong>Prüfungslogik</strong>Der Mensch ist die größte Schwachstelle. Fragen zu „Phishing-Mail wurde geöffnet“ → Antwort ist fast immer <em>User Awareness / Training</em>, nicht eine technische Maßnahme.</div>
    </div>

    <div class="content-section">
      <h3>🔑 Passwort-Policy und Alternativen (Blueprint 5.4)</h3>
      <div class="table-wrap"><table>
        <tr><th>Element</th><th>Empfehlung</th></tr>
        <tr><td><strong>Management</strong></td><td>Passwort-Manager nutzen, keine Wiederverwendung, keine Klartext-Speicherung, Standardpasswörter sofort ändern, sichere Übergabe, regelmäßige Rotation (bzw. bei Verdacht)</td></tr>
        <tr><td><strong>Complexity</strong></td><td>Länge (≥ 12–14 Zeichen wichtiger als Sonderzeichen), Mix aus Groß/Klein/Ziffern/Sonderzeichen, keine Wörterbuchwörter oder persönliche Infos; Passphrasen</td></tr>
        <tr><td><strong>Lockout / History</strong></td><td>Sperre nach X Fehlversuchen, alte Passwörter nicht wiederverwenden, Ablaufdatum</td></tr>
        <tr><td><strong>Multifactor Authentication (MFA)</strong></td><td>Mindestens zwei Faktoren aus: <strong>Wissen</strong> (Passwort, PIN), <strong>Besitz</strong> (Token, Smartphone-App, Smartcard), <strong>Inhärenz</strong> (Biometrie). Beispiel: Passwort + Duo-Push</td></tr>
        <tr><td><strong>Zertifikate</strong></td><td>Digitale Zertifikate (X.509) von einer <strong>CA</strong> — Gerät/Benutzer weist Identität kryptografisch nach (802.1X EAP-TLS, VPN, HTTPS). Kein Passwort, das gestohlen werden kann</td></tr>
        <tr><td><strong>Biometrie</strong></td><td>Fingerabdruck, Gesicht, Iris — „etwas, das du bist“. Bequem, aber nicht änderbar bei Kompromittierung</td></tr>
      </table></div>
      <pre><code><span class="cli-comment"># Passwort-Härtung auf Cisco IOS</span>
R1(config)# security passwords min-length 12
R1(config)# login block-for 120 attempts 3 within 60     <span class="cli-comment"># 3 Fehlversuche in 60 s → 120 s Sperre (Brute-Force-Schutz)</span>
R1(config)# login delay 2
R1(config)# username admin secret Str0ng!Passphrase        <span class="cli-comment"># secret = gehasht (Typ 5 MD5 / Typ 8-9 scrypt)</span>
R1(config)# enable algorithm-type scrypt secret Adm1n!Secret
R1(config)# service password-encryption                    <span class="cli-comment"># Typ 7 — nur Verschleierung, leicht umkehrbar!</span>
R1# show login</code></pre>
      <div class="callout callout-warn"><strong>Passwort-Typen merken</strong>Typ 0 = Klartext · Typ 7 = <code>service password-encryption</code> (schwach, umkehrbar) · Typ 5 = MD5 (<code>secret</code>) · Typ 8 = PBKDF2-SHA256 · Typ 9 = scrypt (am stärksten). <code>enable secret</code> schlägt <code>enable password</code>.</div>
    </div>
  `
}, {
  before: "acl",
  quiz: [
    {
      q: "Wie lautet die korrekte Zuordnung: Ungepatchtes IOS → Skript, das die Lücke ausnutzt → Angreifer, der das Skript einsetzen könnte?",
      options: ["Threat → Exploit → Vulnerability", "Vulnerability → Exploit → Threat", "Exploit → Vulnerability → Threat", "Risk → Threat → Mitigation"],
      correct: 1,
      explanation: "Die Schwachstelle (Vulnerability) ist das ungepatchte System, der Exploit ist das Werkzeug, die Bedrohung (Threat) ist der potenzielle Angreifer.",
      theoryRef: "security-concepts"
    },
    {
      q: "Ein Mitarbeiter erhält eine gezielt auf ihn zugeschnittene E-Mail, die angeblich vom CFO stammt. Um welche Angriffsart handelt es sich?",
      options: ["DDoS", "Spear Phishing", "Buffer Overflow", "VLAN Hopping"],
      correct: 1,
      explanation: "Spear Phishing ist gezieltes Phishing gegen eine bestimmte Person/Organisation. Whaling zielt speziell auf Führungskräfte. Gegenmaßnahme: User Awareness Training.",
      theoryRef: "security-concepts"
    },
    {
      q: "Welche Kombination ist ein Beispiel für echte Multifactor Authentication?",
      options: ["Passwort + PIN", "Passwort + Push-Benachrichtigung auf dem Smartphone", "Fingerabdruck + Gesichtserkennung", "Zwei verschiedene Passwörter"],
      correct: 1,
      explanation: "MFA braucht Faktoren aus verschiedenen Kategorien: Wissen (Passwort) + Besitz (Smartphone). Passwort + PIN sind beide 'Wissen', zwei Biometrien beide 'Inhärenz'.",
      theoryRef: "security-concepts"
    },
    {
      q: "Welche Aussage über 'service password-encryption' ist korrekt?",
      options: ["Es erzeugt starke, nicht umkehrbare Hashes", "Es verschleiert Klartext-Passwörter mit dem schwachen, umkehrbaren Typ-7-Algorithmus", "Es ist gleichwertig mit 'enable secret'", "Es aktiviert SSH"],
      correct: 1,
      explanation: "Typ-7-Verschlüsselung schützt nur vor 'Schulterblick' und ist in Sekunden umkehrbar. Für echte Sicherheit 'secret' (Typ 5/8/9) verwenden.",
      theoryRef: "security-concepts"
    },
    {
      q: "Welche Maßnahme adressiert am direktesten das Risiko, dass Mitarbeitende auf Phishing-Links klicken?",
      options: ["Port Security", "User Awareness Training", "Spanning Tree PortFast", "NTP-Authentifizierung"],
      correct: 1,
      explanation: "Phishing zielt auf Menschen. Awareness-Programme und Training reduzieren die Klickrate — technische Filter ergänzen, ersetzen es aber nicht.",
      theoryRef: "security-concepts"
    },
    {
      q: "Welcher Befehl schützt vor Brute-Force-Login-Versuchen, indem er nach 3 Fehlversuchen in 60 Sekunden Logins für 2 Minuten blockiert?",
      options: ["login block-for 120 attempts 3 within 60", "security passwords min-length 12", "login delay 3", "aaa authentication attempts 3"],
      correct: 0,
      explanation: "'login block-for <Sekunden> attempts <Anzahl> within <Sekunden>' aktiviert den Quiet Mode nach zu vielen Fehlversuchen.",
      theoryRef: "security-concepts"
    }
  ],
  flashcards: [
    { front: "Vulnerability / Exploit / Threat", back: "Schwachstelle / Werkzeug zum Ausnutzen / potenzielle Gefahr (Angreifer)" },
    { front: "CIA-Triade", back: "Confidentiality, Integrity, Availability" },
    { front: "MFA-Faktoren", back: "Wissen (Passwort) · Besitz (Token, App) · Inhärenz (Biometrie)" },
    { front: "Phishing / Spear Phishing / Whaling / Vishing", back: "Massen-Mail / gezielt / Führungskräfte / per Telefon" },
    { front: "Passwort-Typ 7 vs. Typ 9", back: "service password-encryption (schwach, umkehrbar) vs. scrypt (stark)" },
    { front: "Brute-Force-Schutz IOS", back: "login block-for 120 attempts 3 within 60" },
    { front: "Security-Programm Elemente", back: "User Awareness · Training · Physical Access Control" }
  ]
});

// ---------- 5.5 VPN & IPsec ----------
registerTopic({
  id: "vpn",
  domain: "Security Fundamentals",
  domainPct: "15%",
  icon: "🔒",
  title: "VPN & IPsec",
  tags: ["Blueprint 5.5", "IPsec", "Site-to-Site", "Remote Access"],
  content: `
    <div class="content-section">
      <h3>🔒 Was ist ein VPN?</h3>
      <p>Ein <strong>Virtual Private Network</strong> baut einen <strong>verschlüsselten Tunnel</strong> über ein unsicheres Netz (Internet), sodass Daten vertraulich, integer und authentisch übertragen werden. Günstige Alternative zu dedizierten WAN-Leitungen (MPLS, Leased Line).</p>
      <div class="table-wrap"><table>
        <tr><th>Typ</th><th>Zwischen</th><th>Technologie</th><th>Merkmal</th></tr>
        <tr><td><strong>Site-to-Site VPN</strong></td><td>Router/Firewall ↔ Router/Firewall (Standort ↔ Standort)</td><td><strong>IPsec</strong> (oft GRE over IPsec, DMVPN, FlexVPN)</td><td>Dauerhaft, transparent für Nutzer — Endgeräte brauchen keine VPN-Software</td></tr>
        <tr><td><strong>Remote Access VPN</strong></td><td>Einzelner Client (Laptop, Smartphone) ↔ VPN-Gateway (ASA, Firepower, Router)</td><td><strong>TLS/SSL</strong> (Cisco Secure Client / AnyConnect) oder <strong>IPsec/IKEv2</strong></td><td>Wird bei Bedarf vom Nutzer aufgebaut; Client-Software oder Browser (clientless SSL VPN)</td></tr>
      </table></div>
      <pre><code>Site-to-Site:
  LAN A ── R1 ═══════ IPsec-Tunnel über Internet ═══════ R2 ── LAN B
           (alles zwischen den LANs wird verschlüsselt, Hosts merken nichts)

Remote Access:
  Laptop (Secure Client) ═══ TLS / IPsec ═══ ASA/Firepower ── Firmen-LAN
  Split Tunneling: nur Firmen-Traffic durch den Tunnel, Internet direkt</code></pre>
    </div>

    <div class="content-section">
      <h3>🧱 IPsec — die Bausteine</h3>
      <p>IPsec ist ein <strong>Framework</strong> (kein einzelnes Protokoll) auf Layer 3 und bietet vier Dienste:</p>
      <div class="table-wrap"><table>
        <tr><th>Dienst</th><th>Mittel</th><th>Algorithmen</th></tr>
        <tr><td><strong>Confidentiality</strong> (Vertraulichkeit)</td><td>Verschlüsselung</td><td>AES (128/192/256, GCM) — DES/3DES veraltet</td></tr>
        <tr><td><strong>Integrity</strong> (Integrität)</td><td>Hashing / HMAC</td><td>SHA-256, SHA-1 (veraltet), MD5 (veraltet)</td></tr>
        <tr><td><strong>Authentication</strong> (Authentizität der Peers)</td><td>Pre-Shared Key (PSK) oder digitale Zertifikate (RSA/ECDSA)</td><td>—</td></tr>
        <tr><td><strong>Anti-Replay</strong></td><td>Sequenznummern</td><td>—</td></tr>
      </table></div>
      <div class="table-wrap"><table>
        <tr><th>Komponente</th><th>Rolle</th></tr>
        <tr><td><strong>IKE</strong> (Internet Key Exchange, UDP <strong>500</strong>; NAT-T UDP <strong>4500</strong>)</td><td>Baut den Tunnel auf: authentifiziert die Peers, handelt Algorithmen aus, erzeugt Schlüssel (Diffie-Hellman). <strong>IKEv1</strong>: Phase 1 (ISAKMP SA, Main/Aggressive Mode) + Phase 2 (IPsec SA, Quick Mode). <strong>IKEv2</strong>: schlanker, schneller, unterstützt EAP, MOBIKE — Standard heute</td></tr>
        <tr><td><strong>ESP</strong> (Encapsulating Security Payload, IP-Protokoll <strong>50</strong>)</td><td>Verschlüsselung + Integrität + Authentifizierung — <em>der</em> Standard</td></tr>
        <tr><td><strong>AH</strong> (Authentication Header, IP-Protokoll <strong>51</strong>)</td><td>Nur Integrität/Authentifizierung, <strong>keine Verschlüsselung</strong> — funktioniert nicht durch NAT, kaum genutzt</td></tr>
        <tr><td><strong>SA</strong> (Security Association)</td><td>Vereinbarung über Algorithmen und Schlüssel — <em>unidirektional</em>, daher zwei SAs pro Tunnel</td></tr>
        <tr><td><strong>Diffie-Hellman</strong> (DH-Gruppen 14, 19, 20…)</td><td>Sicherer Schlüsselaustausch über ein unsicheres Medium</td></tr>
      </table></div>
      <h4>Tunnel Mode vs. Transport Mode</h4>
      <pre><code>Original:        [IP-Header][TCP][Daten]

Transport Mode:  [IP-Header][ESP][TCP][Daten][ESP-Trailer]      ← nur Payload verschlüsselt, Host-zu-Host
Tunnel Mode:     [NEUER IP-Header][ESP][IP-Header][TCP][Daten]  ← ganzes Paket verschlüsselt, Gateway-zu-Gateway (Site-to-Site)</code></pre>
    </div>

    <div class="content-section">
      <h3>🔀 GRE over IPsec, DMVPN und Co.</h3>
      <div class="table-wrap"><table>
        <tr><th>Technologie</th><th>Beschreibung</th><th>Warum</th></tr>
        <tr><td><strong>GRE</strong> (Generic Routing Encapsulation, IP-Protokoll 47)</td><td>Einfacher Tunnel ohne Verschlüsselung, transportiert <em>beliebige</em> Protokolle inkl. <strong>Multicast/Broadcast</strong></td><td>IPsec allein kann kein Multicast → keine Routing-Protokolle (OSPF) durch den Tunnel</td></tr>
        <tr><td><strong>GRE over IPsec</strong></td><td>GRE-Tunnel, der komplett in IPsec verschlüsselt wird</td><td>Kombiniert Flexibilität (OSPF, EIGRP im Tunnel) mit Sicherheit — klassisches Site-to-Site</td></tr>
        <tr><td><strong>DMVPN</strong> (Dynamic Multipoint VPN)</td><td>Cisco: mGRE + NHRP + IPsec — Hub-and-Spoke, Spokes bauen dynamisch direkte Tunnel zueinander auf</td><td>Skaliert für viele Standorte ohne Full-Mesh-Konfiguration</td></tr>
        <tr><td><strong>FlexVPN</strong></td><td>Cisco-Framework auf IKEv2-Basis (Site-to-Site, Remote Access, Hub-Spoke)</td><td>Einheitliche Konfiguration für alle VPN-Typen</td></tr>
        <tr><td><strong>SSL/TLS VPN</strong></td><td>Nutzt TLS (TCP 443) — funktioniert fast überall, wo HTTPS funktioniert</td><td>Remote Access (Cisco Secure Client), clientless via Browser-Portal</td></tr>
        <tr><td><strong>SD-WAN</strong></td><td>Overlay aus IPsec-Tunneln, zentral orchestriert (Cisco Catalyst SD-WAN / Meraki)</td><td>Moderner Ersatz für klassische WAN-VPNs</td></tr>
      </table></div>
      <div class="callout callout-tip"><strong>Blueprint-Verb „Describe“</strong>Für 5.5 musst du Site-to-Site vs. Remote Access unterscheiden, die IPsec-Dienste (Confidentiality, Integrity, Authentication, Anti-Replay) und die Rolle von IKE/ESP nennen können. Kein Konfigurationsdetail nötig.</div>
    </div>
  `
}, {
  before: "automation",
  quiz: [
    {
      q: "Welche VPN-Art verbindet zwei Firmenstandorte dauerhaft, ohne dass auf den Endgeräten VPN-Software nötig ist?",
      options: ["Remote Access VPN", "Site-to-Site VPN", "Clientless SSL VPN", "Split Tunneling"],
      correct: 1,
      explanation: "Site-to-Site VPNs werden zwischen Gateways (Router/Firewall) aufgebaut. Der Tunnel ist für die Hosts in den LANs transparent.",
      theoryRef: "vpn"
    },
    {
      q: "Welches IPsec-Protokoll bietet Verschlüsselung, Integrität und Authentifizierung?",
      options: ["AH (Authentication Header)", "ESP (Encapsulating Security Payload)", "GRE", "IKE"],
      correct: 1,
      explanation: "ESP (IP-Protokoll 50) verschlüsselt und authentifiziert. AH (Protokoll 51) bietet nur Integrität/Authentifizierung ohne Verschlüsselung.",
      theoryRef: "vpn"
    },
    {
      q: "Warum wird häufig GRE over IPsec statt reinem IPsec für Site-to-Site-Tunnel verwendet?",
      options: ["GRE ist sicherer als IPsec", "GRE kann Multicast/Broadcast und damit Routing-Protokolle wie OSPF durch den Tunnel transportieren", "IPsec funktioniert nicht über das Internet", "GRE ist schneller als ESP"],
      correct: 1,
      explanation: "Reines IPsec transportiert nur Unicast-IP. GRE kapselt beliebige Protokolle inkl. Multicast — IPsec verschlüsselt den GRE-Tunnel dann.",
      theoryRef: "vpn"
    },
    {
      q: "Welche Aufgabe hat IKE (Internet Key Exchange)?",
      options: ["Verschlüsselt die Nutzdaten", "Authentifiziert die Peers, handelt Algorithmen aus und erzeugt die Schlüssel für den IPsec-Tunnel", "Komprimiert die Daten", "Leitet Pakete zwischen VLANs weiter"],
      correct: 1,
      explanation: "IKE (UDP 500, NAT-T 4500) ist das Steuerprotokoll: Peer-Authentifizierung (PSK/Zertifikat), Aushandlung der Security Associations, Diffie-Hellman-Schlüsselaustausch.",
      theoryRef: "vpn"
    },
    {
      q: "Welches Protokoll nutzt ein typischer Remote-Access-VPN-Client wie Cisco Secure Client (AnyConnect), um auch durch restriktive Firewalls zu funktionieren?",
      options: ["TLS/SSL über TCP 443", "AH über Protokoll 51", "GRE über Protokoll 47", "Telnet über TCP 23"],
      correct: 0,
      explanation: "SSL/TLS-VPNs nutzen TCP 443 (wie HTTPS) und funktionieren daher fast überall. Secure Client unterstützt zusätzlich IKEv2/IPsec.",
      theoryRef: "vpn"
    }
  ],
  flashcards: [
    { front: "Site-to-Site vs. Remote Access", back: "Gateway ↔ Gateway (IPsec, transparent) vs. Client ↔ Gateway (TLS oder IPsec, Client-Software)" },
    { front: "IPsec-Dienste", back: "Confidentiality (AES), Integrity (SHA), Authentication (PSK/Zertifikat), Anti-Replay" },
    { front: "ESP vs. AH", back: "ESP (Prot. 50) = Verschlüsselung + Integrität; AH (Prot. 51) = nur Integrität, kein NAT" },
    { front: "IKE Ports", back: "UDP 500 (IKE), UDP 4500 (NAT-Traversal)" },
    { front: "GRE", back: "IP-Protokoll 47 — Tunnel ohne Verschlüsselung, transportiert Multicast (Routing-Protokolle)" },
    { front: "Tunnel vs. Transport Mode", back: "Ganzes IP-Paket verschlüsselt (Site-to-Site) vs. nur Payload (Host-zu-Host)" },
    { front: "DMVPN", back: "mGRE + NHRP + IPsec — dynamische Spoke-to-Spoke-Tunnel" }
  ]
});

// ---------- 5.7 Layer-2-Sicherheit ----------
registerTopic({
  id: "l2-security",
  domain: "Security Fundamentals",
  domainPct: "15%",
  icon: "🧱",
  title: "Layer-2-Security (DHCP Snooping, DAI)",
  tags: ["Blueprint 5.7", "DHCP Snooping", "DAI", "Port Security"],
  content: `
    <div class="content-section">
      <h3>🧱 Warum Layer-2-Sicherheit?</h3>
      <p>Firewalls schützen die Grenze — aber ein Angreifer <em>im</em> LAN kann Switches direkt angreifen: gefälschte DHCP-Server, ARP-Poisoning (Man-in-the-Middle), MAC-Flooding. Die drei Blueprint-Features arbeiten zusammen:</p>
      <pre><code>  Port Security  ──► begrenzt MAC-Adressen pro Port (gegen MAC-Flooding / CAM-Overflow)
  DHCP Snooping  ──► filtert DHCP-Server-Antworten von untrusted Ports (gegen Rogue DHCP)
                     └─► baut die DHCP-Snooping-Binding-Tabelle (IP ↔ MAC ↔ Port ↔ VLAN)
  DAI            ──► prüft ARP-Pakete gegen diese Binding-Tabelle (gegen ARP-Spoofing/Poisoning)
  IP Source Guard──► prüft Quell-IP/MAC von Datenpaketen gegen die Binding-Tabelle</code></pre>
    </div>

    <div class="content-section">
      <h3>🍯 DHCP Snooping</h3>
      <p><strong>Angriff:</strong> Ein Rogue DHCP-Server antwortet schneller als der echte und verteilt sich selbst als Gateway/DNS → Man-in-the-Middle. Oder ein Angreifer erschöpft den Pool (DHCP Starvation) mit gefälschten Discover-Paketen.</p>
      <p><strong>Lösung:</strong> Ports werden in <strong>trusted</strong> (Richtung echter DHCP-Server / Uplinks) und <strong>untrusted</strong> (alle anderen, Standard) eingeteilt.</p>
      <div class="table-wrap"><table>
        <tr><th>Port-Typ</th><th>DHCP-Server-Nachrichten (OFFER, ACK, NAK)</th><th>DHCP-Client-Nachrichten (DISCOVER, REQUEST)</th></tr>
        <tr><td><strong>Trusted</strong></td><td>Erlaubt</td><td>Erlaubt</td></tr>
        <tr><td><strong>Untrusted</strong></td><td><strong>Verworfen</strong></td><td>Erlaubt (mit Prüfungen: Quell-MAC = Client-MAC im Paket; Rate Limit)</td></tr>
      </table></div>
      <pre><code><span class="cli-comment"># Global aktivieren + pro VLAN</span>
SW1(config)# ip dhcp snooping
SW1(config)# ip dhcp snooping vlan 10,20

<span class="cli-comment"># Uplink zum DHCP-Server / zum anderen Switch als trusted</span>
SW1(config)# interface gi0/24
SW1(config-if)# ip dhcp snooping trust

<span class="cli-comment"># Access-Ports: Rate Limit gegen Starvation (Pakete/Sekunde)</span>
SW1(config)# interface range fa0/1 - 20
SW1(config-if-range)# ip dhcp snooping limit rate 10

<span class="cli-comment"># Option 82 (Relay Information) — abschalten, wenn der DHCP-Server sie nicht versteht</span>
SW1(config)# no ip dhcp snooping information option

<span class="cli-comment"># Verifikation</span>
SW1# show ip dhcp snooping
SW1# show ip dhcp snooping binding
MacAddress          IpAddress        Lease(sec)  Type           VLAN  Interface
------------------  ---------------  ----------  -------------  ----  --------------
00:1A:2B:3C:4D:5E   10.1.10.57       86312       dhcp-snooping   10   FastEthernet0/3</code></pre>
      <div class="callout callout-warn"><strong>Klassische Prüfungsfalle</strong>Nach dem Aktivieren von DHCP Snooping bekommen Clients keine IP mehr → der Port zum <strong>DHCP-Server bzw. der Uplink wurde nicht als trusted</strong> markiert. Auch Ports zwischen Switches müssen trusted sein, sonst werden die Server-Antworten dort verworfen.</div>
    </div>

    <div class="content-section">
      <h3>🕵️ DAI — Dynamic ARP Inspection</h3>
      <p><strong>Angriff (ARP Poisoning / Spoofing):</strong> Der Angreifer sendet gefälschte <em>Gratuitous ARP</em>-Antworten („Die IP des Gateways gehört zu MEINER MAC“). Alle Hosts schicken ihren Traffic dann zum Angreifer → Man-in-the-Middle.</p>
      <p><strong>Lösung:</strong> DAI prüft auf <em>untrusted</em> Ports jedes ARP-Paket: Passt IP ↔ MAC zur <strong>DHCP-Snooping-Binding-Tabelle</strong> (oder einer statischen ARP-ACL)? Wenn nicht → verwerfen und loggen.</p>
      <pre><code><span class="cli-comment"># Voraussetzung: DHCP Snooping läuft (liefert die Binding-Tabelle)</span>
SW1(config)# ip arp inspection vlan 10,20

<span class="cli-comment"># Uplinks / Ports zu anderen Switches als trusted</span>
SW1(config)# interface gi0/24
SW1(config-if)# ip arp inspection trust

<span class="cli-comment"># Zusätzliche Validierung der ARP-Paketfelder</span>
SW1(config)# ip arp inspection validate src-mac dst-mac ip

<span class="cli-comment"># Statische Hosts ohne DHCP über eine ARP-ACL erlauben</span>
SW1(config)# arp access-list STATIC-HOSTS
SW1(config-arp-nacl)# permit ip host 10.1.10.5 mac host 0011.2233.4455
SW1(config)# ip arp inspection filter STATIC-HOSTS vlan 10

<span class="cli-comment"># Rate Limit (Standard 15 pps auf untrusted) — bei Überschreitung → err-disabled</span>
SW1(config-if)# ip arp inspection limit rate 20
SW1(config)# errdisable recovery cause arp-inspection

<span class="cli-comment"># Verifikation</span>
SW1# show ip arp inspection
SW1# show ip arp inspection interfaces
SW1# show ip arp inspection statistics vlan 10</code></pre>
      <div class="callout callout-info"><strong>Gratuitous ARP</strong>Eine ARP-Antwort ohne vorherige Anfrage. Legitim genutzt (z.B. HSRP-Failover, um MAC-Tabellen zu aktualisieren) — aber auch das Werkzeug für ARP-Poisoning.</div>
    </div>

    <div class="content-section">
      <h3>🔒 Port Security — Kurzreferenz</h3>
      <p>Ausführlich im Thema <em>Gerätesicherheit</em>. Hier die prüfungsrelevanten Kernpunkte:</p>
      <div class="table-wrap"><table>
        <tr><th>Violation Mode</th><th>Frames verwerfen</th><th>Syslog/SNMP + Zähler</th><th>Port err-disabled</th></tr>
        <tr><td><strong>protect</strong></td><td>Ja</td><td>Nein</td><td>Nein</td></tr>
        <tr><td><strong>restrict</strong></td><td>Ja</td><td>Ja</td><td>Nein</td></tr>
        <tr><td><strong>shutdown</strong> (Standard)</td><td>Ja</td><td>Ja</td><td><strong>Ja</strong></td></tr>
      </table></div>
      <pre><code>SW1(config-if)# switchport mode access                    <span class="cli-comment"># Pflicht — auf dynamic-Ports geht Port Security nicht</span>
SW1(config-if)# switchport port-security
SW1(config-if)# switchport port-security maximum 2         <span class="cli-comment"># z.B. IP-Telefon + PC</span>
SW1(config-if)# switchport port-security mac-address sticky <span class="cli-comment"># gelernte MACs in die running-config schreiben</span>
SW1(config-if)# switchport port-security violation restrict
SW1(config-if)# switchport port-security aging time 60

<span class="cli-comment"># Err-disabled automatisch wieder aktivieren (Standard: 300 s)</span>
SW1(config)# errdisable recovery cause psecure-violation
SW1(config)# errdisable recovery interval 120

SW1# show port-security interface fa0/1
SW1# show port-security address
SW1# show interfaces status err-disabled</code></pre>
      <div class="callout callout-tip"><strong>Weitere L2-Härtung</strong>Ungenutzte Ports <code>shutdown</code> und in ein „Parking“-VLAN legen · DTP deaktivieren (<code>switchport nonegotiate</code>) · Native VLAN auf Trunks ändern (nicht VLAN 1) · Trunk-VLANs einschränken (<code>allowed vlan</code>) · BPDU Guard auf Access-Ports.</div>
    </div>
  `
}, {
  after: "device-security",
  quiz: [
    {
      q: "Nach Aktivierung von DHCP Snooping erhalten Clients keine IP-Adressen mehr. Was ist die wahrscheinlichste Ursache?",
      options: ["Der DHCP-Pool ist leer", "Der Port zum DHCP-Server wurde nicht als 'trusted' konfiguriert", "DAI blockiert DHCP", "Port Security ist aktiv"],
      correct: 1,
      explanation: "Auf untrusted Ports werden DHCP-Server-Nachrichten (OFFER/ACK) verworfen. Der Uplink Richtung DHCP-Server muss 'ip dhcp snooping trust' haben.",
      theoryRef: "l2-security"
    },
    {
      q: "Welche Informationsquelle nutzt Dynamic ARP Inspection, um ARP-Pakete zu validieren?",
      options: ["Die MAC-Adresstabelle", "Die Routing-Tabelle", "Die DHCP-Snooping-Binding-Tabelle (oder ARP-ACLs)", "Die CDP-Nachbartabelle"],
      correct: 2,
      explanation: "DAI vergleicht IP-MAC-Paare in ARP-Paketen mit der DHCP-Snooping-Binding-Tabelle. Für statische Hosts nutzt man ARP-ACLs.",
      theoryRef: "l2-security"
    },
    {
      q: "Welchen Angriff verhindert Dynamic ARP Inspection primär?",
      options: ["DHCP Starvation", "MAC-Flooding", "ARP-Poisoning / Man-in-the-Middle", "VLAN Hopping"],
      correct: 2,
      explanation: "DAI verwirft gefälschte ARP-Antworten (Gratuitous ARP mit falscher IP-MAC-Zuordnung) und verhindert so ARP-Poisoning-basierte MITM-Angriffe.",
      theoryRef: "l2-security"
    },
    {
      q: "Welcher Port-Security-Violation-Mode verwirft unerlaubte Frames, erzeugt Syslog-Meldungen, lässt den Port aber aktiv?",
      options: ["protect", "restrict", "shutdown", "err-disable"],
      correct: 1,
      explanation: "restrict = verwerfen + loggen + Zähler, Port bleibt up. protect = nur verwerfen (kein Log). shutdown (Standard) = Port err-disabled.",
      theoryRef: "l2-security"
    },
    {
      q: "Welcher Befehl konfiguriert einen Port als vertrauenswürdig für DHCP Snooping?",
      options: ["ip dhcp snooping trust", "ip dhcp trust", "switchport trust dhcp", "ip dhcp snooping limit rate 0"],
      correct: 0,
      explanation: "'ip dhcp snooping trust' im Interface-Modus. Alle Ports sind standardmäßig untrusted.",
      theoryRef: "l2-security"
    },
    {
      q: "Welche Voraussetzung muss ein Switchport erfüllen, damit Port Security aktiviert werden kann?",
      options: ["Er muss ein Trunk sein", "Er muss statisch als Access-Port (oder Trunk) konfiguriert sein — nicht 'dynamic'", "Er muss PoE unterstützen", "Er muss in VLAN 1 sein"],
      correct: 1,
      explanation: "Port Security funktioniert nicht auf Ports im DTP-Modus 'dynamic auto/desirable'. Zuerst 'switchport mode access' setzen.",
      theoryRef: "l2-security"
    }
  ],
  flashcards: [
    { front: "DHCP Snooping — untrusted Port", back: "Verwirft DHCP-Server-Nachrichten (OFFER/ACK/NAK); Standard für alle Ports" },
    { front: "DHCP Snooping Binding-Tabelle", back: "IP ↔ MAC ↔ Port ↔ VLAN — Basis für DAI und IP Source Guard" },
    { front: "DAI schützt vor", back: "ARP-Poisoning / ARP-Spoofing (Man-in-the-Middle)" },
    { front: "Port Security Violation Modes", back: "protect (drop) · restrict (drop + log) · shutdown (err-disabled, Standard)" },
    { front: "Sticky MAC", back: "switchport port-security mac-address sticky — gelernte MACs in running-config" },
    { front: "Err-disabled Port wiederherstellen", back: "shutdown → no shutdown oder errdisable recovery cause ..." },
    { front: "Gratuitous ARP", back: "Unaufgeforderte ARP-Antwort — legitim (HSRP) oder Angriff (Poisoning)" }
  ]
});

// ---------- 5.8 AAA ----------
registerTopic({
  id: "aaa",
  domain: "Security Fundamentals",
  domainPct: "15%",
  icon: "🪪",
  title: "AAA & 802.1X",
  tags: ["Blueprint 5.8", "Authentication", "RADIUS", "802.1X"],
  content: `
    <div class="content-section">
      <h3>🪪 Authentication, Authorization, Accounting</h3>
      <div class="table-wrap"><table>
        <tr><th>A</th><th>Frage</th><th>Beispiel</th><th>Mittel</th></tr>
        <tr><td><strong>Authentication</strong></td><td><em>Wer bist du?</em></td><td>Login mit Benutzername/Passwort, Zertifikat, MFA</td><td>Lokale Datenbank, RADIUS, TACACS+, LDAP/AD</td></tr>
        <tr><td><strong>Authorization</strong></td><td><em>Was darfst du?</em></td><td>Privilege Level 15 vs. 1, erlaubte Befehle, VLAN-Zuweisung, dACL</td><td>Policies auf dem AAA-Server (ISE), Rollen</td></tr>
        <tr><td><strong>Accounting</strong></td><td><em>Was hast du getan?</em></td><td>Login-Zeit, ausgeführte Befehle, übertragene Bytes</td><td>Start/Stop-Records an RADIUS/TACACS+, Syslog</td></tr>
      </table></div>
      <div class="callout callout-tip"><strong>Merkhilfe</strong>Ausweis zeigen (Authentication) → Zutrittsberechtigung prüfen (Authorization) → Besucherbuch (Accounting).</div>
    </div>

    <div class="content-section">
      <h3>🖧 Zentral statt lokal — mit Cisco ISE</h3>
      <p>Lokale Benutzer auf jedem Gerät skalieren nicht. Ein zentraler <strong>AAA-Server</strong> (Cisco <strong>ISE</strong> — Identity Services Engine, oder FreeRADIUS, Microsoft NPS) verwaltet Benutzer/Geräte und Policies. Zwei Protokolle zwischen Netzwerkgerät (<em>NAS</em> / <em>Authenticator</em>) und Server:</p>
      <div class="table-wrap"><table>
        <tr><th></th><th>RADIUS</th><th>TACACS+</th></tr>
        <tr><td>Standard</td><td>Offen (RFC 2865)</td><td>Cisco</td></tr>
        <tr><td>Transport</td><td>UDP 1812/1813 (alt 1645/1646)</td><td>TCP 49</td></tr>
        <tr><td>Verschlüsselung</td><td>Nur Passwort</td><td>Ganzer Payload</td></tr>
        <tr><td>AAA-Funktionen</td><td>AuthN + AuthZ kombiniert, Accounting separat</td><td>Alle drei getrennt</td></tr>
        <tr><td>Ideal für</td><td><strong>Netzwerkzugang</strong>: 802.1X, WLAN, VPN</td><td><strong>Device Administration</strong>: Befehlsautorisierung</td></tr>
      </table></div>
      <pre><code><span class="cli-comment"># AAA aktivieren — ACHTUNG: aaa new-model ändert sofort das Login-Verhalten aller Lines!</span>
R1(config)# username fallback privilege 15 secret L0cal!Only   <span class="cli-comment"># lokaler Notfall-User ZUERST</span>
R1(config)# aaa new-model

<span class="cli-comment"># RADIUS-Server definieren</span>
R1(config)# radius server ISE1
R1(config-radius-server)# address ipv4 10.1.1.50 auth-port 1812 acct-port 1813
R1(config-radius-server)# key R4dius!Key
R1(config)# aaa group server radius ISE-GROUP
R1(config-sg-radius)# server name ISE1

<span class="cli-comment"># Methodenlisten: erst Server-Gruppe, dann lokal (Fallback bei Server-Ausfall)</span>
R1(config)# aaa authentication login default group ISE-GROUP local
R1(config)# aaa authorization exec default group ISE-GROUP local
R1(config)# aaa accounting exec default start-stop group ISE-GROUP
R1(config)# aaa accounting commands 15 default start-stop group ISE-GROUP

<span class="cli-comment"># Eigene Liste nur für die Console (immer lokal)</span>
R1(config)# aaa authentication login CONSOLE local
R1(config)# line console 0
R1(config-line)# login authentication CONSOLE

<span class="cli-comment"># Testen</span>
R1# test aaa group ISE-GROUP testuser Passw0rd new-code
R1# show aaa servers
R1# debug aaa authentication</code></pre>
      <div class="callout callout-warn"><strong>Reihenfolge der Methodenliste</strong><code>group ISE-GROUP local</code> heißt: lokal wird <em>nur</em> gefragt, wenn der Server <strong>nicht erreichbar</strong> ist — <em>nicht</em>, wenn der Server das Login ablehnt. Immer einen lokalen Fallback konfigurieren, sonst sperrt man sich bei Server-Ausfall aus.</div>
    </div>

    <div class="content-section">
      <h3>🔐 802.1X — Port-based Network Access Control</h3>
      <p>Der Switch-Port bleibt gesperrt, bis sich das Endgerät <strong>authentifiziert</strong> hat. Drei Rollen:</p>
      <pre><code>  Supplicant              Authenticator                  Authentication Server
  (Client-Software:       (Switch / WLC / AP)            (RADIUS — Cisco ISE)
   Windows, Secure Client)
        │                       │                                │
        │◄── EAPoL (802.1X) ───►│◄──── RADIUS (EAP in RADIUS) ──►│
        │   nur EAP-Frames       │   Port ist "unauthorized"       │
        │   dürfen durch         │   für alles andere              │
        │                        │                                 │
   Erfolg → Port "authorized", optional: VLAN, dACL, SGT vom Server zugewiesen</code></pre>
      <div class="table-wrap"><table>
        <tr><th>EAP-Methode</th><th>Authentifizierung</th><th>Merkmal</th></tr>
        <tr><td><strong>EAP-TLS</strong></td><td>Zertifikat auf Client <em>und</em> Server</td><td>Am sichersten, braucht PKI</td></tr>
        <tr><td><strong>PEAP</strong> (MSCHAPv2)</td><td>Server-Zertifikat + Benutzername/Passwort im TLS-Tunnel</td><td>Am weitesten verbreitet (Windows/AD)</td></tr>
        <tr><td><strong>EAP-FAST</strong></td><td>Cisco, PAC statt Zertifikat</td><td>Legacy</td></tr>
        <tr><td><strong>EAP-TTLS</strong></td><td>Wie PEAP, flexibler</td><td>—</td></tr>
      </table></div>
      <pre><code><span class="cli-comment"># 802.1X auf dem Switch</span>
SW1(config)# aaa new-model
SW1(config)# aaa authentication dot1x default group radius
SW1(config)# aaa authorization network default group radius
SW1(config)# dot1x system-auth-control                     <span class="cli-comment"># global aktivieren</span>
SW1(config)# interface fa0/5
SW1(config-if)# switchport mode access
SW1(config-if)# authentication port-control auto            <span class="cli-comment"># auto = 802.1X erzwingen (force-authorized = aus)</span>
SW1(config-if)# dot1x pae authenticator
SW1(config-if)# authentication host-mode multi-domain       <span class="cli-comment"># PC + IP-Telefon am selben Port</span>
SW1# show dot1x all summary
SW1# show authentication sessions interface fa0/5</code></pre>
      <div class="callout callout-info"><strong>MAB — MAC Authentication Bypass</strong>Für Geräte ohne Supplicant (Drucker, Kameras, IoT): Der Switch sendet die MAC-Adresse als „Benutzername“ an den RADIUS-Server, der sie gegen eine Whitelist prüft.</div>
    </div>
  `
}, {
  after: "l2-security",
  quiz: [
    {
      q: "Welcher AAA-Bestandteil legt fest, welche Befehle ein authentifizierter Administrator ausführen darf?",
      options: ["Authentication", "Authorization", "Accounting", "Auditing"],
      correct: 1,
      explanation: "Authentication = Identität prüfen. Authorization = Rechte festlegen (Privilege Level, erlaubte Befehle). Accounting = Aktivitäten protokollieren.",
      theoryRef: "aaa"
    },
    {
      q: "In 'aaa authentication login default group radius local' — wann wird die lokale Datenbank verwendet?",
      options: ["Wenn der RADIUS-Server das Login ablehnt", "Wenn der RADIUS-Server nicht erreichbar ist", "Immer zusätzlich zum RADIUS-Server", "Nie — local ist nur ein Platzhalter"],
      correct: 1,
      explanation: "Methodenlisten arbeiten als Fallback-Kette: Die nächste Methode kommt nur bei Nichterreichbarkeit (Timeout/Error) zum Zug, nicht bei einem 'Reject'.",
      theoryRef: "aaa"
    },
    {
      q: "Welche drei Rollen gibt es bei 802.1X?",
      options: ["Client, Server, Router", "Supplicant, Authenticator, Authentication Server", "User, Admin, Guest", "Requester, Responder, Verifier"],
      correct: 1,
      explanation: "Supplicant = Client-Software auf dem Endgerät, Authenticator = Switch/WLC, Authentication Server = RADIUS (z.B. Cisco ISE).",
      theoryRef: "aaa"
    },
    {
      q: "Welches Protokoll läuft zwischen Supplicant und Authenticator bei 802.1X?",
      options: ["RADIUS", "TACACS+", "EAPoL (EAP over LAN)", "SSH"],
      correct: 2,
      explanation: "Zwischen Client und Switch werden EAP-Frames direkt in Ethernet transportiert (EAPoL). Der Switch verpackt EAP dann in RADIUS zum Server.",
      theoryRef: "aaa"
    },
    {
      q: "Ein Drucker unterstützt kein 802.1X. Welche Funktion erlaubt ihm trotzdem den Netzwerkzugang über den AAA-Server?",
      options: ["PortFast", "MAB (MAC Authentication Bypass)", "DHCP Snooping", "Root Guard"],
      correct: 1,
      explanation: "MAB sendet die MAC-Adresse des Geräts als Identität an den RADIUS-Server, der sie gegen eine Liste bekannter Geräte prüft.",
      theoryRef: "aaa"
    },
    {
      q: "Welches Protokoll ist die beste Wahl für zentralisierten Netzwerkzugang von Endgeräten (802.1X, WLAN)?",
      options: ["TACACS+", "RADIUS", "SNMP", "Syslog"],
      correct: 1,
      explanation: "RADIUS ist der Standard für Netzwerkzugangskontrolle (NAC) und wird von 802.1X, WLANs und VPNs verwendet. TACACS+ ist auf Geräte-Administration spezialisiert.",
      theoryRef: "aaa"
    }
  ],
  flashcards: [
    { front: "AAA", back: "Authentication (wer?), Authorization (was darf?), Accounting (was getan?)" },
    { front: "aaa new-model", back: "Aktiviert AAA — vorher lokalen Fallback-User anlegen!" },
    { front: "group radius local — Bedeutung", back: "local nur, wenn RADIUS-Server nicht erreichbar (nicht bei Reject)" },
    { front: "802.1X Rollen", back: "Supplicant (Client) · Authenticator (Switch/WLC) · Authentication Server (RADIUS/ISE)" },
    { front: "EAPoL", back: "EAP over LAN — zwischen Supplicant und Authenticator" },
    { front: "MAB", back: "MAC Authentication Bypass — für Geräte ohne 802.1X-Supplicant" },
    { front: "EAP-TLS vs. PEAP", back: "Zertifikate beidseitig vs. Server-Zertifikat + Passwort im TLS-Tunnel" },
    { front: "Cisco ISE", back: "Identity Services Engine — zentraler AAA-/NAC-Server (RADIUS + TACACS+)" }
  ]
});

// ---------- 5.9 / 5.10 Wireless-Sicherheit ----------
registerTopic({
  id: "wireless-security",
  domain: "Security Fundamentals",
  domainPct: "15%",
  icon: "📡",
  title: "Wireless-Sicherheit (WPA2/WPA3)",
  tags: ["Blueprint 5.9", "Blueprint 5.10", "WPA3", "PSK", "802.1X"],
  content: `
    <div class="content-section">
      <h3>📡 Evolution der WLAN-Sicherheit (Blueprint 5.9)</h3>
      <div class="table-wrap"><table>
        <tr><th>Standard</th><th>Jahr</th><th>Verschlüsselung</th><th>Integrität</th><th>Authentifizierung</th><th>Status</th></tr>
        <tr><td><strong>WEP</strong></td><td>1999</td><td>RC4 (40/104 Bit, statischer Key)</td><td>CRC-32</td><td>Open / Shared Key</td><td><strong>Geknackt</strong> — niemals nutzen</td></tr>
        <tr><td><strong>WPA</strong></td><td>2003</td><td><strong>TKIP</strong> (RC4 mit Key-Rotation)</td><td>MIC (Michael)</td><td>PSK oder 802.1X</td><td>Übergangslösung, unsicher</td></tr>
        <tr><td><strong>WPA2</strong> (802.11i)</td><td>2004</td><td><strong>AES-CCMP</strong></td><td>CBC-MAC</td><td>PSK oder 802.1X</td><td>Weit verbreitet, gilt mit starkem PSK als ok (KRACK-Patches nötig)</td></tr>
        <tr><td><strong>WPA3</strong></td><td>2018</td><td><strong>AES-GCMP</strong> (128/256)</td><td>GMAC</td><td><strong>SAE</strong> (Personal) oder 802.1X mit 192-Bit-Suite (Enterprise)</td><td>Aktueller Standard, Pflicht für Wi-Fi 6E/6 GHz</td></tr>
      </table></div>
      <h4>Was WPA3 besser macht</h4>
      <ul>
        <li><strong>SAE</strong> (Simultaneous Authentication of Equals, „Dragonfly“): ersetzt den WPA2-PSK-4-Way-Handshake, der offline Brute-Force erlaubte. Jeder Login braucht Interaktion mit dem AP → Wörterbuchangriffe unpraktisch.</li>
        <li><strong>Forward Secrecy</strong>: ein gestohlener Key entschlüsselt keine früheren Sitzungen.</li>
        <li><strong>PMF (Protected Management Frames)</strong> ist Pflicht → schützt vor Deauthentication-Angriffen.</li>
        <li><strong>OWE (Opportunistic Wireless Encryption / „Enhanced Open“)</strong>: verschlüsselt offene Gast-WLANs ohne Passwort.</li>
        <li><strong>WPA3-Enterprise 192-Bit</strong>: stärkere Suite (GCMP-256, SHA-384, ECDSA-384) für Behörden/Finanz.</li>
      </ul>
    </div>

    <div class="content-section">
      <h3>👤 Personal vs. Enterprise</h3>
      <div class="table-wrap"><table>
        <tr><th></th><th>Personal (PSK / SAE)</th><th>Enterprise (802.1X / EAP)</th></tr>
        <tr><td>Anmeldung</td><td>Ein gemeinsames Passwort (Pre-Shared Key) für alle</td><td>Individuelle Benutzer-/Gerätekonten oder Zertifikate über RADIUS-Server</td></tr>
        <tr><td>Verwaltung</td><td>Einfach — aber Key-Wechsel bei Mitarbeiterwechsel nötig</td><td>Zentral (ISE/AD), pro Nutzer sperrbar, dynamische VLAN-Zuweisung</td></tr>
        <tr><td>Schlüssel</td><td>Aus PSK abgeleitet (PMK) → pro Client Session Keys (PTK) via 4-Way-Handshake / SAE</td><td>PMK aus EAP-Austausch — pro Nutzer unterschiedlich</td></tr>
        <tr><td>Einsatz</td><td>Zuhause, Kleinbetrieb, IoT</td><td>Unternehmen, Bildung</td></tr>
      </table></div>
      <div class="callout callout-info"><strong>Weitere Authentifizierungsformen</strong><strong>Open</strong> (keine — nur mit Captive Portal/Web-Auth für Gäste sinnvoll) · <strong>MAC-Filtering</strong> (leicht fälschbar, keine echte Sicherheit) · <strong>Hidden SSID</strong> (nur Verschleierung).</div>
    </div>

    <div class="content-section">
      <h3>🖥️ WLAN mit WPA2-PSK in der WLC-GUI konfigurieren (Blueprint 5.10)</h3>
      <ol>
        <li><strong>WLANs → Create New → Go</strong>: Type <em>WLAN</em>, Profile Name <code>MITARBEITER</code>, SSID <code>Firma-WLAN</code>, ID <code>1</code> → Apply.</li>
        <li><strong>General</strong>: Status ☑ Enabled · Radio Policy <em>All</em> · Interface/Interface Group: <code>vlan10-mitarbeiter</code> (Dynamic Interface = VLAN) · ☑ Broadcast SSID.</li>
        <li><strong>Security → Layer 2</strong>: Layer 2 Security <strong>WPA+WPA2</strong> (oder WPA2+WPA3 für Übergang) · ☐ WPA Policy · ☑ <strong>WPA2 Policy</strong> · WPA2 Encryption ☑ <strong>AES</strong> (☐ TKIP) · Authentication Key Management ☑ <strong>PSK</strong> (☐ 802.1X) · PSK Format <em>ASCII</em> · Pre-Shared Key: <code>mind. 8, besser 20+ Zeichen</code>.</li>
        <li><strong>Security → Layer 3</strong>: Layer 3 Security <em>None</em>.</li>
        <li><strong>Security → AAA Servers</strong>: nicht nötig bei PSK (nur bei 802.1X).</li>
        <li><strong>QoS</strong>: Profil <em>Silver</em> (Standard) oder <em>Platinum</em> bei Voice.</li>
        <li><strong>Advanced</strong>: ggf. Client Exclusion, Session Timeout, P2P Blocking.</li>
        <li><strong>Apply</strong> → oben rechts <strong>Save Configuration</strong>.</li>
      </ol>
      <pre><code>Zusammenfassung der Security-Einstellungen für WPA2-PSK:
  Layer 2 Security:            WPA+WPA2
  WPA2 Policy:                 [x]    WPA2 Encryption: [x] AES  [ ] TKIP
  Auth Key Mgmt:               [x] PSK   [ ] 802.1X   [ ] CCKM   [ ] FT
  PSK Format:                  ASCII     Pre-Shared Key: ********************

Für WPA3-Personal:             Layer 2 Security: WPA3 · Encryption: AES(CCMP128) oder GCMP · Auth Key Mgmt: SAE
Für WPA2-Enterprise:           Auth Key Mgmt: 802.1X · AAA Servers → RADIUS-Server auswählen</code></pre>
      <div class="callout callout-tip"><strong>Typische Prüfungsfragen zur GUI</strong>„Clients mit alten Geräten können sich nicht verbinden“ → WPA3-only aktiviert, Übergangsmodus (WPA2+WPA3) nutzen. „Kein RADIUS vorhanden, trotzdem sicher“ → WPA2/WPA3-Personal mit PSK/SAE. „Jeder Nutzer soll eigene Zugangsdaten haben“ → 802.1X (Enterprise) + AAA-Server.</div>
    </div>
  `
}, {
  before: "automation",
  quiz: [
    {
      q: "Welches Verschlüsselungsverfahren verwendet WPA2 standardmäßig?",
      options: ["RC4", "TKIP", "AES-CCMP", "AES-GCMP"],
      correct: 2,
      explanation: "WPA2 (802.11i) nutzt AES mit CCMP. TKIP war WPA (Übergang), RC4 war WEP, GCMP gehört zu WPA3.",
      theoryRef: "wireless-security"
    },
    {
      q: "Welche Neuerung in WPA3-Personal ersetzt den angreifbaren PSK-Handshake von WPA2?",
      options: ["TKIP", "SAE (Simultaneous Authentication of Equals)", "MAC-Filtering", "Hidden SSID"],
      correct: 1,
      explanation: "SAE (Dragonfly) verhindert Offline-Wörterbuchangriffe auf das Passwort und bietet Forward Secrecy.",
      theoryRef: "wireless-security"
    },
    {
      q: "Ein Unternehmen möchte, dass sich jeder Mitarbeiter mit eigenen Zugangsdaten am WLAN anmeldet. Welche Konfiguration ist nötig?",
      options: ["WPA2-Personal mit langem PSK", "WPA2/WPA3-Enterprise mit 802.1X und RADIUS-Server", "WEP mit 128-Bit-Key", "Open mit MAC-Filtering"],
      correct: 1,
      explanation: "Individuelle Konten erfordern 802.1X/EAP (Enterprise) mit einem Authentication Server (RADIUS, z.B. Cisco ISE). PSK ist ein gemeinsames Passwort.",
      theoryRef: "wireless-security"
    },
    {
      q: "Welche Einstellungen wählst du in der WLC-GUI unter Security → Layer 2 für ein WPA2-PSK-WLAN?",
      options: ["Layer 2 Security: None, Auth Key Mgmt: 802.1X", "Layer 2 Security: WPA+WPA2, WPA2 Policy + AES, Auth Key Mgmt: PSK", "Layer 2 Security: WEP, Shared Key", "Layer 3 Security: Web Policy"],
      correct: 1,
      explanation: "WPA+WPA2 als Layer-2-Security, WPA2 Policy mit AES-Verschlüsselung aktivieren, als Key Management PSK wählen und den Pre-Shared Key eintragen.",
      theoryRef: "wireless-security"
    },
    {
      q: "Welches Feature von WPA3 verschlüsselt offene Gast-WLANs ohne Passwort?",
      options: ["PMF", "OWE (Enhanced Open)", "TKIP", "CCKM"],
      correct: 1,
      explanation: "OWE (Opportunistic Wireless Encryption / Wi-Fi Enhanced Open) handelt pro Client individuelle Schlüssel aus, ohne dass ein Passwort nötig ist.",
      theoryRef: "wireless-security"
    }
  ],
  flashcards: [
    { front: "WEP / WPA / WPA2 / WPA3 Verschlüsselung", back: "RC4 / TKIP / AES-CCMP / AES-GCMP" },
    { front: "SAE", back: "Simultaneous Authentication of Equals — WPA3-Personal, ersetzt PSK-4-Way-Handshake" },
    { front: "Personal vs. Enterprise", back: "Gemeinsamer PSK/SAE vs. individuelle Anmeldung über 802.1X + RADIUS" },
    { front: "PMF", back: "Protected Management Frames — Pflicht in WPA3, schützt vor Deauth-Angriffen" },
    { front: "OWE", back: "Opportunistic Wireless Encryption — verschlüsseltes offenes WLAN (Enhanced Open)" },
    { front: "WLC GUI: WPA2-PSK", back: "Layer 2: WPA+WPA2 → WPA2 Policy → AES → Auth Key Mgmt: PSK → Key eintragen" },
    { front: "802.11i", back: "IEEE-Standard hinter WPA2" }
  ]
});

// Zusätzliche Fragen zu bestehenden Themen
extendTopic("acl", {
  quiz: [
    {
      q: "Welche Wildcard-Maske passt auf das Netz 192.168.16.0/22?",
      options: ["0.0.0.255", "0.0.3.255", "0.0.7.255", "255.255.252.0"],
      correct: 1,
      explanation: "/22 = 255.255.252.0 → Wildcard = 255.255.255.255 − Maske = 0.0.3.255.",
      theoryRef: "acl"
    },
    {
      q: "Was bewirkt 'access-list 100 permit tcp any host 10.1.1.5 eq 443'?",
      options: ["Erlaubt HTTPS von jedem Absender zum Host 10.1.1.5", "Erlaubt HTTPS vom Host 10.1.1.5 an alle", "Blockiert HTTPS", "Erlaubt jeden TCP-Traffic"],
      correct: 0,
      explanation: "Extended ACL: Protokoll tcp, Quelle any, Ziel host 10.1.1.5, Zielport eq 443 (HTTPS).",
      theoryRef: "acl"
    },
    {
      q: "Eine ACL wurde erstellt, filtert aber nichts. Was wurde wahrscheinlich vergessen?",
      options: ["Die implizite deny-Regel", "Die ACL mit 'ip access-group <nr> in|out' auf ein Interface (oder VTY mit access-class) anzuwenden", "Ein Neustart des Routers", "Der Befehl 'access-list enable'"],
      correct: 1,
      explanation: "Eine ACL wirkt erst, wenn sie einem Interface (ip access-group) oder den VTY-Lines (access-class) in einer Richtung zugewiesen ist.",
      theoryRef: "acl"
    }
  ],
  flashcards: [
    { front: "Wildcard-Maske berechnen", back: "255.255.255.255 − Subnetzmaske (z.B. /26 → 0.0.0.63)" },
    { front: "host 10.1.1.5 entspricht", back: "10.1.1.5 0.0.0.0" },
    { front: "any entspricht", back: "0.0.0.0 255.255.255.255" },
    { front: "ACL auf Interface anwenden", back: "ip access-group <nr|name> in|out" },
    { front: "Named ACL erstellen", back: "ip access-list extended NAME → permit/deny …" }
  ]
});

// Flashcards für bestehendes Thema Gerätesicherheit
extendTopic("device-security", {
  flashcards: [
    { front: "enable secret vs. enable password", back: "secret = gehasht (bevorzugt), password = Klartext/Typ 7; secret gewinnt" },
    { front: "service password-encryption", back: "Verschleiert Klartext-Passwörter (Typ 7, schwach)" },
    { front: "SSH-Voraussetzungen", back: "hostname · ip domain-name · crypto key generate rsa · username · line vty: transport input ssh + login local" },
    { front: "exec-timeout 5 0", back: "Sitzung nach 5 Min 0 Sek Inaktivität beenden" },
    { front: "Port Security Voraussetzung", back: "switchport mode access (kein dynamic)" },
    { front: "Port Security Violation Modes", back: "protect · restrict · shutdown (Standard, err-disabled)" },
    { front: "banner motd", back: "Rechtlicher Hinweis vor dem Login — Begrenzungszeichen frei wählbar" },
    { front: "show port-security interface", back: "Status, Max/Current MACs, Violation Mode und Zähler" }
  ]
});
