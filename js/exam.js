// ===== CCNA 200-301 v1.1 — Prüfungsdaten (Blueprint, Ressourcen, Glossar, CLI-Cheatsheet) =====
// Quellen: Cisco "CCNA Exam v1.1 (200-301)" Exam Topics (2024) und
//          Cisco "CCNA Certification Guide 2024 V8" (Study Guide / Exam Success / Resources)

const EXAM_INFO = {
  code: "200-301",
  version: "v1.1",
  title: "Implementing and Administering Cisco Solutions (CCNA)",
  facts: [
    { icon: "⏱️", label: "Dauer", value: "120 Minuten" },
    { icon: "❓", label: "Fragen", value: "variabel (ca. 100–120)", hint: "Wegen Performance-based Lab-Items kann die Anzahl variieren." },
    { icon: "🏢", label: "Anbieter", value: "Pearson VUE", hint: "Testcenter oder Online-Proctoring — vorher Systemcheck unter cisco.com/go/onlinetesting." },
    { icon: "🌐", label: "Sprachen", value: "Englisch, Japanisch" },
    { icon: "📅", label: "Gültigkeit", value: "3 Jahre", hint: "Rezertifizierung durch Prüfung oder Continuing Education Credits." },
    { icon: "🎯", label: "Bestehensgrenze", value: "nicht veröffentlicht", hint: "Cisco nennt keinen fixen Passing Score; die Skala reicht von 300 bis 1000." },
    { icon: "📘", label: "Blueprint", value: "v1.1 seit 20. Aug 2024", hint: "Neu: KI/ML (6.4), Terraform statt Puppet/Chef, Cloud-Managed-Zugriff." },
    { icon: "🛡️", label: "Safeguard", value: "kostenlose Wiederholung", hint: "Cisco Exam Safeguard: 2. Versuch inklusive; Safeguard Plus zusätzlich mit Practice Exam." }
  ],
  questionTypes: [
    { type: "Multiple Choice (Single Answer)", desc: "Eine richtige Antwort aus vier Optionen — die häufigste Form." },
    { type: "Multiple Choice (Multiple Answer)", desc: "„Choose two/three“ — genau die geforderte Anzahl markieren, sonst 0 Punkte." },
    { type: "Drag and Drop", desc: "Begriffe zuordnen, z.B. Protokolle zu OSI-Schichten oder Befehle zu Aufgaben." },
    { type: "Fill-in-the-blank", desc: "Einen Wert eintippen, z.B. eine Subnetzmaske oder Broadcast-Adresse." },
    { type: "Performance-based Lab Items", desc: "Echte IOS-CLI in einer simulierten Topologie: konfigurieren, verifizieren, Fehler beheben. Deshalb: Lab early, lab often!" },
    { type: "Simlet / Testlet", desc: "Ein Szenario mit Zugriff auf show-Befehle, dazu mehrere Fragen." }
  ],
  // Was Cisco im Certification Guide empfiehlt
  proTips: [
    { icon: "🔤", title: "Auf das Verb achten", text: "Steht im Blueprint „describe“ oder „explain“, reicht konzeptionelles Wissen. Bei „configure and verify“ musst du die Befehle beherrschen und Ausgaben interpretieren. Bei „interpret“ geht es um das Lesen von show-Ausgaben und GUI-Screens." },
    { icon: "🧪", title: "Lab early, lab often", text: "Deine Fähigkeit, Aufgaben in der CLI umzusetzen, wird geprüft. Packet Tracer (kostenlos über NetAcad) oder Cisco Modeling Labs — jede Konfiguration aus dieser Knowledge Base selbst nachbauen." },
    { icon: "⚖️", title: "Gewichtung nutzen", text: "IP Connectivity (25 %) und die beiden 20 %-Domänen machen zwei Drittel der Prüfung aus. Subnetting, Routing-Tabelle, OSPF, VLANs und STP müssen sitzen." },
    { icon: "⏲️", title: "Zeitmanagement", text: "Rund 60–70 Sekunden pro Frage. Lab-Items brauchen länger — bei Textfragen Tempo machen. Zurückblättern ist nicht möglich: Frage beantworten und weiter." },
    { icon: "📖", title: "Exam Topics Review", text: "Die Videoserie „CCNA Exam Topics Review“ auf dem Learn-with-Cisco-YouTube-Kanal geht jedes Blueprint-Thema durch — ideal zur Wiederholung." },
    { icon: "🧠", title: "Erst verstehen, dann auswendig lernen", text: "Portnummern, AD-Werte, Timer und Standards gehören auf Flashcards. Aber Fragen prüfen meist das Verständnis in einem Szenario — die Konzepte hinter den Zahlen zählen." }
  ],
  studyPlan: [
    { week: 1, title: "Grundlagen I", topics: ["network-components", "topologies", "cabling", "osi-model", "tcp-udp"], goal: "OSI/TCP-IP sicher, Komponenten und Designs erklären können" },
    { week: 2, title: "IPv4 & Subnetting", topics: ["ipv4", "client-ip"], goal: "Subnetting in unter 60 Sekunden pro Aufgabe — täglich üben" },
    { week: 3, title: "IPv6, Wireless, Virtualisierung, Switching", topics: ["ipv6", "wireless-basics", "virtualization", "switching-concepts"], goal: "EUI-64, Adresstypen, Kanäle 1/6/11, MAC-Tabelle" },
    { week: 4, title: "Network Access", topics: ["vlans", "cdp-lldp", "etherchannel", "stp"], goal: "VLANs/Trunks/STP konfigurieren und show-Ausgaben lesen" },
    { week: 5, title: "Wireless & Management", topics: ["wireless-arch", "mgmt-access"], goal: "WLC-Architektur, AP-Modi, SSH/TACACS+/RADIUS" },
    { week: 6, title: "IP Connectivity", topics: ["routing-table", "static-routing", "ospf", "fhrp"], goal: "Longest Prefix Match, AD, OSPF-Adjacency, HSRP" },
    { week: 7, title: "IP Services", topics: ["dhcp", "nat", "ntp", "dns", "snmp-syslog", "qos", "tftp-ftp"], goal: "NAT/DHCP konfigurieren, Syslog-Levels, QoS-Begriffe" },
    { week: 8, title: "Security", topics: ["security-concepts", "vpn", "acl", "l2-security", "aaa", "wireless-security", "device-security"], goal: "ACLs schreiben, DHCP Snooping/DAI, WPA2/WPA3" },
    { week: 9, title: "Automation & Wiederholung", topics: ["automation", "ai-ml", "config-mgmt-json"], goal: "REST/JSON/SDN erklären; alle Quizze auf ≥ 80 %" },
    { week: 10, title: "Prüfungssimulation", topics: [], goal: "Mehrere Simulationen mit 60 Fragen, Schwachstellen gezielt nacharbeiten, Labs wiederholen" }
  ]
};

// Verben aus dem Blueprint → Tiefe des geforderten Wissens
const VERB_LEVELS = {
  explain:   { label: "Erklären",     level: 1 },
  describe:  { label: "Beschreiben",  level: 1 },
  compare:   { label: "Vergleichen",  level: 1 },
  define:    { label: "Definieren",   level: 1 },
  recognize: { label: "Erkennen",     level: 1 },
  identify:  { label: "Identifizieren", level: 2 },
  interpret: { label: "Interpretieren", level: 2 },
  determine: { label: "Bestimmen",    level: 2 },
  verify:    { label: "Verifizieren", level: 2 },
  configure: { label: "Konfigurieren & Verifizieren", level: 3 }
};

// Offizieller Blueprint 200-301 v1.1 — deutsch, mit Verweis auf die Themen der Knowledge Base
const BLUEPRINT = [
  {
    num: "1.0", name: "Network Fundamentals", weight: 20, color: "#2563eb",
    items: [
      { num: "1.1", verb: "explain", text: "Rolle und Funktion von Netzwerkkomponenten erklären", sub: ["Router", "Layer-2- und Layer-3-Switches", "Next-Generation Firewalls und IPS", "Access Points", "Controller", "Endpoints", "Server", "PoE"], refs: ["network-components"] },
      { num: "1.2", verb: "describe", text: "Merkmale von Netzwerk-Topologie-Architekturen beschreiben", sub: ["Two-Tier", "Three-Tier", "Spine-Leaf", "WAN", "Small Office/Home Office (SOHO)", "On-Premises und Cloud"], refs: ["topologies"] },
      { num: "1.3", verb: "compare", text: "Physische Interface- und Kabeltypen vergleichen", sub: ["Singlemode-Glasfaser, Multimode-Glasfaser, Kupfer", "Verbindungen (Ethernet Shared Media und Point-to-Point)"], refs: ["cabling"] },
      { num: "1.4", verb: "identify", text: "Interface- und Kabelprobleme identifizieren (Kollisionen, Fehler, Duplex- und/oder Speed-Mismatch)", refs: ["cabling"] },
      { num: "1.5", verb: "compare", text: "TCP mit UDP vergleichen", refs: ["tcp-udp", "osi-model"] },
      { num: "1.6", verb: "configure", text: "IPv4-Adressierung und Subnetting konfigurieren und verifizieren", refs: ["ipv4"] },
      { num: "1.7", verb: "describe", text: "Private IPv4-Adressierung beschreiben", refs: ["ipv4", "nat"] },
      { num: "1.8", verb: "configure", text: "IPv6-Adressierung und Präfix konfigurieren und verifizieren", refs: ["ipv6"] },
      { num: "1.9", verb: "describe", text: "IPv6-Adresstypen beschreiben", sub: ["Unicast (global, unique local, link local)", "Anycast", "Multicast", "Modified EUI 64"], refs: ["ipv6"] },
      { num: "1.10", verb: "verify", text: "IP-Parameter für Client-Betriebssysteme verifizieren (Windows, Mac OS, Linux)", refs: ["client-ip"] },
      { num: "1.11", verb: "describe", text: "Wireless-Prinzipien beschreiben", sub: ["Nicht überlappende Wi-Fi-Kanäle", "SSID", "RF", "Verschlüsselung"], refs: ["wireless-basics", "wireless-security"] },
      { num: "1.12", verb: "explain", text: "Grundlagen der Virtualisierung erklären (Server-Virtualisierung, Container und VRFs)", refs: ["virtualization"] },
      { num: "1.13", verb: "describe", text: "Switching-Konzepte beschreiben", sub: ["MAC Learning und Aging", "Frame Switching", "Frame Flooding", "MAC-Adresstabelle"], refs: ["switching-concepts"] }
    ]
  },
  {
    num: "2.0", name: "Network Access", weight: 20, color: "#7c3aed",
    items: [
      { num: "2.1", verb: "configure", text: "VLANs (Normal Range) über mehrere Switches konfigurieren und verifizieren", sub: ["Access Ports (Data und Voice)", "Default VLAN", "InterVLAN-Konnektivität"], refs: ["vlans"] },
      { num: "2.2", verb: "configure", text: "Interswitch-Konnektivität konfigurieren und verifizieren", sub: ["Trunk Ports", "802.1Q", "Native VLAN"], refs: ["vlans"] },
      { num: "2.3", verb: "configure", text: "Layer-2-Discovery-Protokolle konfigurieren und verifizieren (Cisco Discovery Protocol und LLDP)", refs: ["cdp-lldp"] },
      { num: "2.4", verb: "configure", text: "(Layer 2/Layer 3) EtherChannel (LACP) konfigurieren und verifizieren", refs: ["etherchannel"] },
      { num: "2.5", verb: "interpret", text: "Grundlegende Funktionsweise von Rapid PVST+ Spanning Tree Protocol interpretieren", sub: ["Root Port, Root Bridge (primary/secondary) und weitere Portnamen", "Port-Zustände und -Rollen", "PortFast", "Root Guard, Loop Guard, BPDU Filter und BPDU Guard"], refs: ["stp"] },
      { num: "2.6", verb: "describe", text: "Cisco Wireless-Architekturen und AP-Modi beschreiben", refs: ["wireless-arch"] },
      { num: "2.7", verb: "describe", text: "Physische Infrastrukturverbindungen von WLAN-Komponenten beschreiben (AP, WLC, Access-/Trunk-Ports und LAG)", refs: ["wireless-arch"] },
      { num: "2.8", verb: "describe", text: "Management-Zugriff auf Netzwerkgeräte beschreiben (Telnet, SSH, HTTP, HTTPS, Console, TACACS+/RADIUS und Cloud Managed)", refs: ["mgmt-access", "device-security"] },
      { num: "2.9", verb: "interpret", text: "Die Wireless-LAN-GUI-Konfiguration für Client-Konnektivität interpretieren (WLAN-Erstellung, Security-Einstellungen, QoS-Profile, Advanced Settings)", refs: ["wireless-arch", "wireless-security"] }
    ]
  },
  {
    num: "3.0", name: "IP Connectivity", weight: 25, color: "#059669",
    items: [
      { num: "3.1", verb: "interpret", text: "Bestandteile der Routing-Tabelle interpretieren", sub: ["Routing-Protocol-Code", "Prefix", "Network Mask", "Next Hop", "Administrative Distance", "Metric", "Gateway of Last Resort"], refs: ["routing-table"] },
      { num: "3.2", verb: "determine", text: "Bestimmen, wie ein Router standardmäßig seine Forwarding-Entscheidung trifft", sub: ["Longest Prefix Match", "Administrative Distance", "Routing-Protocol-Metric"], refs: ["routing-table", "static-routing"] },
      { num: "3.3", verb: "configure", text: "Statisches Routing für IPv4 und IPv6 konfigurieren und verifizieren", sub: ["Default Route", "Network Route", "Host Route", "Floating Static"], refs: ["static-routing"] },
      { num: "3.4", verb: "configure", text: "Single-Area OSPFv2 konfigurieren und verifizieren", sub: ["Neighbor Adjacencies", "Point-to-Point", "Broadcast (DR/BDR-Wahl)", "Router ID"], refs: ["ospf"] },
      { num: "3.5", verb: "describe", text: "Zweck, Funktionen und Konzepte von First Hop Redundancy Protocols beschreiben", refs: ["fhrp"] }
    ]
  },
  {
    num: "4.0", name: "IP Services", weight: 10, color: "#d97706",
    items: [
      { num: "4.1", verb: "configure", text: "Inside Source NAT mit statischen Einträgen und Pools konfigurieren und verifizieren", refs: ["nat"] },
      { num: "4.2", verb: "configure", text: "NTP im Client- und Server-Modus konfigurieren und verifizieren", refs: ["ntp"] },
      { num: "4.3", verb: "explain", text: "Rolle von DHCP und DNS im Netzwerk erklären", refs: ["dhcp", "dns"] },
      { num: "4.4", verb: "explain", text: "Funktion von SNMP im Netzwerkbetrieb erklären", refs: ["snmp-syslog"] },
      { num: "4.5", verb: "describe", text: "Nutzung von Syslog-Funktionen beschreiben, inkl. Facilities und Severity Levels", refs: ["snmp-syslog"] },
      { num: "4.6", verb: "configure", text: "DHCP-Client und -Relay konfigurieren und verifizieren", refs: ["dhcp"] },
      { num: "4.7", verb: "explain", text: "Per-Hop-Behavior (PHB) für QoS erklären: Classification, Marking, Queuing, Congestion, Policing, Shaping", refs: ["qos"] },
      { num: "4.8", verb: "configure", text: "Netzwerkgeräte für Remote-Zugriff per SSH konfigurieren", refs: ["device-security", "mgmt-access"] },
      { num: "4.9", verb: "describe", text: "Fähigkeiten und Funktionen von TFTP/FTP im Netzwerk beschreiben", refs: ["tftp-ftp"] }
    ]
  },
  {
    num: "5.0", name: "Security Fundamentals", weight: 15, color: "#dc2626",
    items: [
      { num: "5.1", verb: "define", text: "Zentrale Sicherheitsbegriffe definieren (Threats, Vulnerabilities, Exploits und Mitigation-Techniken)", refs: ["security-concepts"] },
      { num: "5.2", verb: "describe", text: "Elemente eines Security-Programms beschreiben (User Awareness, Training und physische Zugangskontrolle)", refs: ["security-concepts"] },
      { num: "5.3", verb: "configure", text: "Gerätezugriffskontrolle mit lokalen Passwörtern konfigurieren und verifizieren", refs: ["device-security"] },
      { num: "5.4", verb: "describe", text: "Elemente einer Passwort-Policy beschreiben: Management, Komplexität und Alternativen (MFA, Zertifikate, Biometrie)", refs: ["security-concepts"] },
      { num: "5.5", verb: "describe", text: "IPsec Remote-Access- und Site-to-Site-VPNs beschreiben", refs: ["vpn"] },
      { num: "5.6", verb: "configure", text: "Access Control Lists konfigurieren und verifizieren", refs: ["acl"] },
      { num: "5.7", verb: "configure", text: "Layer-2-Security-Features konfigurieren und verifizieren (DHCP Snooping, Dynamic ARP Inspection und Port Security)", refs: ["l2-security", "device-security"] },
      { num: "5.8", verb: "compare", text: "Konzepte von Authentication, Authorization und Accounting vergleichen", refs: ["aaa", "mgmt-access"] },
      { num: "5.9", verb: "describe", text: "Wireless-Security-Protokolle beschreiben (WPA, WPA2 und WPA3)", refs: ["wireless-security"] },
      { num: "5.10", verb: "configure", text: "WLAN in der GUI mit WPA2 PSK konfigurieren und verifizieren", refs: ["wireless-security", "wireless-arch"] }
    ]
  },
  {
    num: "6.0", name: "Automation & Programmability", weight: 10, color: "#0891b2",
    items: [
      { num: "6.1", verb: "explain", text: "Erklären, wie Automatisierung das Netzwerkmanagement beeinflusst", refs: ["automation"] },
      { num: "6.2", verb: "compare", text: "Traditionelle Netzwerke mit Controller-basiertem Networking vergleichen", refs: ["automation"] },
      { num: "6.3", verb: "describe", text: "Controller-basierte, softwaredefinierte Architektur beschreiben (Overlay, Underlay und Fabric)", sub: ["Trennung von Control Plane und Data Plane", "Northbound- und Southbound-APIs"], refs: ["automation"] },
      { num: "6.4", verb: "explain", text: "KI (generativ und prädiktiv) und Machine Learning im Netzwerkbetrieb erklären", refs: ["ai-ml"], isNew: true },
      { num: "6.5", verb: "describe", text: "Merkmale REST-basierter APIs beschreiben (Authentifizierungsarten, CRUD, HTTP-Verben und Datencodierung)", refs: ["automation", "config-mgmt-json"] },
      { num: "6.6", verb: "recognize", text: "Fähigkeiten von Konfigurationsmanagement-Mechanismen wie Ansible und Terraform erkennen", refs: ["config-mgmt-json"], isNew: true },
      { num: "6.7", verb: "recognize", text: "Bestandteile JSON-codierter Daten erkennen", refs: ["config-mgmt-json"] }
    ]
  }
];

// Offizielle Lernressourcen aus dem Cisco Certification Guide
const RESOURCES = [
  { group: "Kostenlos (Cisco Networking Academy)", items: [
    { name: "CCNA: Introduction to Networks", desc: "Kurs 1 von 3 — Grundlagen, OSI, IPv4/IPv6, Ethernet, Switching-Basics.", url: "https://www.netacad.com/courses/ccna-introduction-networks" },
    { name: "CCNA: Switching, Routing, and Wireless Essentials", desc: "Kurs 2 von 3 — VLANs, STP, EtherChannel, OSPF-Einstieg, WLAN, Security.", url: "https://www.netacad.com/courses/ccna-switching-routing-wireless-essentials" },
    { name: "CCNA: Enterprise Networking, Security, and Automation", desc: "Kurs 3 von 3 — OSPF, ACLs, NAT, QoS, VPN, Automation.", url: "https://www.netacad.com/courses/ccna-enterprise-networking-security-automation" },
    { name: "Cisco Packet Tracer", desc: "Kostenloser Netzwerksimulator — unverzichtbar zum Labben.", url: "https://www.netacad.com/cisco-packet-tracer" },
    { name: "CCST Networking", desc: "Einstiegszertifizierung, falls CCNA noch zu früh ist.", url: "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/entry/ccst-networking/index.html" }
  ]},
  { group: "Cisco U. & Learning Network", items: [
    { name: "Implementing and Administering Cisco Solutions — CCNA Learning Path", desc: "Offizieller On-Demand-Kurs auf Cisco U.", url: "https://u.cisco.com/paths/ccna" },
    { name: "Cisco Exam Review: CCNA (Practice Exam)", desc: "Offizielles Übungsexamen — in Safeguard Plus enthalten.", url: "https://u.cisco.com" },
    { name: "Cisco Learning Network — CCNA Community", desc: "Study Groups, Lernpläne, 58+ Stunden Trainingsvideos, Vokabelliste, CLI-Cheatsheet.", url: "https://learningnetwork.cisco.com/s/ccna" },
    { name: "CCNA Exam Topics Review (YouTube, Learn with Cisco)", desc: "Videoserie, die jedes Blueprint-Thema durchgeht.", url: "https://www.youtube.com/@LearnwithCisco" },
    { name: "Cisco Modeling Labs (CML)", desc: "Virtuelle IOS-Geräte für realistische Labs — CML Personal für Selbstlerner.", url: "https://www.cisco.com/site/us/en/products/networking/cisco-modeling-labs/index.html" },
    { name: "Offizielle Exam Topics 200-301 v1.1", desc: "Der Blueprint als PDF — dein Master-Checklist.", url: "https://learningnetwork.cisco.com/s/ccna-exam-topics" }
  ]},
  { group: "Bücher (Cisco Press)", items: [
    { name: "CCNA 200-301 Official Cert Guide, Volume 1 & 2 (Wendell Odom)", desc: "Der Standard — vollständig zum Blueprint v1.1 aktualisiert, mit Übungsfragen und Labs.", url: "https://www.ciscopress.com/store/ccna-200-301-official-cert-guide-library-9780138221393" },
    { name: "CCNA 200-301 Portable Command Guide, 5th Edition", desc: "Alle Befehle kompakt zum Nachschlagen — Rabattcode CCNACOMM aus dem Guide.", url: "https://www.ciscopress.com" }
  ]},
  { group: "Prüfungsanmeldung", items: [
    { name: "Pearson VUE — Cisco", desc: "Termin buchen: Testcenter oder Online-Proctored.", url: "https://home.pearsonvue.com/cisco" },
    { name: "Cisco Exam Safeguard / Safeguard Plus", desc: "Zweiter Versuch ohne Zusatzkosten; Plus mit Practice Exam.", url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/safeguard.html" },
    { name: "Cisco Certification Exam Tutorial Videos", desc: "Demo aller Fragetypen — vor der Prüfung anschauen.", url: "https://www.cisco.com/c/en/us/training-events/training-certifications/exams/exam-tutorials.html" }
  ]}
];

// Vokabelliste aus dem Cisco Certification Guide (gekürzt/übersetzt) + prüfungsrelevante Ergänzungen
const GLOSSARY = [
  { term: "API / REST API", def: "Veröffentlichte Schnittstelle, um mit einem Produkt oder Dienst programmatisch zu interagieren. REST nutzt HTTP-Verben (GET, POST, PUT, DELETE) und meist JSON.", ref: "automation" },
  { term: "Attack Surface", def: "Die Summe aller möglichen Angriffspfade, über die ein Angreifer oder Malware geschützte Daten kompromittieren könnte.", ref: "security-concepts" },
  { term: "AAA / RADIUS / TACACS+", def: "Authentication (wer?), Authorization (was darf?), Accounting (was wurde getan?). RADIUS für Netzwerkzugang, TACACS+ für Geräteadministration.", ref: "aaa" },
  { term: "CI/CD", def: "Continuous Integration / Continuous Delivery — automatisierte Builds, Tests und Deployments; Änderungen bleiben klein und werden laufend in den Hauptzweig integriert.", ref: "automation" },
  { term: "Datenformate (JSON, XML, YAML)", def: "Maschinen- und menschenlesbare Formate für den Datenaustausch mit APIs und Konfigurationswerkzeugen.", ref: "config-mgmt-json" },
  { term: "DevOps", def: "Development + Operations: Automatisierung, kleine Fehler früh und automatisch beheben, Entwickler tragen Verantwortung für Deployment und Infrastruktur (Infrastructure as Code).", ref: "config-mgmt-json" },
  { term: "DNS", def: "Domain Name System — das „Telefonbuch“ des Internets: übersetzt Namen wie www.cisco.com in IP-Adressen (A/AAAA) und zurück (PTR).", ref: "dns" },
  { term: "Infrastruktur, Container, VMs", def: "Infrastruktur = zugrunde liegende physische oder virtuelle Geräte. VMs emulieren komplette Rechner mit eigenem OS. Container bündeln Anwendung + Abhängigkeiten und teilen den Host-Kernel.", ref: "virtualization" },
  { term: "IP-Adresse (IPv4/IPv6)", def: "Eindeutige Adresse jedes Hosts im Netz — wie eine Straßenadresse. IPv4 = 32 Bit, IPv6 = 128 Bit.", ref: "ipv4" },
  { term: "Malware-Analyse", def: "Untersuchung von Funktion, Herkunft und Auswirkung einer Schadsoftware.", ref: "security-concepts" },
  { term: "NAT", def: "Network Address Translation — lässt viele private Adressen eine oder wenige öffentliche IPv4-Adressen teilen (IPv4 hat nur ~4 Mrd. Adressen).", ref: "nat" },
  { term: "Netzwerk-Datenmodelle (YANG, NETCONF, RESTCONF)", def: "YANG modelliert Konfigurations- und Zustandsdaten; NETCONF (XML, SSH) und RESTCONF (JSON/XML, HTTPS) sind die Protokolle, um so modellierte Geräte zu konfigurieren.", ref: "automation" },
  { term: "Packet", def: "Dateneinheit auf Layer 3 mit Header (Routing-Informationen), Payload und ggf. Trailer.", ref: "osi-model" },
  { term: "Python", def: "Interpretierte, gut lesbare Programmiersprache — de facto Standard für Netzwerkautomatisierung (Netmiko, NAPALM, requests).", ref: "automation" },
  { term: "Role-based Access Control (RBAC)", def: "Zugriffsrechte werden anhand der Rolle/Funktion einer Person vergeben, nicht individuell.", ref: "aaa" },
  { term: "Router", def: "Verbindet unterschiedliche Netze und bestimmt den Pfad zwischen ihnen — „Router bauen das Internet“.", ref: "network-components" },
  { term: "Routing-Protokolle (OSPF, EIGRP, BGP)", def: "Liefern die „Landkarte“ und Wegbeschreibung, damit Pakete ihr Ziel finden. OSPF und EIGRP intern (IGP), BGP zwischen autonomen Systemen (EGP).", ref: "ospf" },
  { term: "SIEM", def: "Security Information and Event Management — sammelt Syslog, Events und Logs vieler Quellen, korreliert sie und erzeugt Alarme/Tickets.", ref: "snmp-syslog" },
  { term: "SOAR", def: "Security Orchestration, Automation and Response — automatisierte Workflows, um auf SIEM-Alarme zu reagieren.", ref: "security-concepts" },
  { term: "SDK", def: "Software Development Kit — Werkzeuge, Bibliotheken und Doku, um Programme gegen eine API zu schreiben.", ref: "automation" },
  { term: "Subnetz", def: "Aufteilung eines IP-Netzes in kleinere Teilnetze zur effizienten Adressvergabe und Segmentierung.", ref: "ipv4" },
  { term: "Switch", def: "Verbindet Hosts und Server innerhalb eines Netzes (Layer 2); routet nicht zwischen Netzen (außer Layer-3-Switch).", ref: "switching-concepts" },
  { term: "Threat Hunting", def: "Proaktives, iteratives Durchsuchen des Netzes nach fortgeschrittenen Bedrohungen, die automatische Systeme übersehen.", ref: "security-concepts" },
  { term: "Threat Intelligence", def: "Faktenbasiertes Wissen über bestehende oder neue Bedrohungen — Kontext, Indikatoren, Handlungsempfehlungen (z.B. Cisco Talos).", ref: "security-concepts" },
  { term: "Time-based Access Control", def: "Temporärer Zugriff für einen definierten Zeitraum nach Bedarf.", ref: "acl" },
  { term: "VLAN", def: "Virtual LAN — logische Trennung eines Switches in mehrere Broadcast-Domänen, z.B. „Sales“ getrennt von „Engineering“.", ref: "vlans" }
];

// CLI-Cheatsheet — nach Aufgaben gruppiert (basiert auf dem Cisco Guide, deutlich erweitert)
const COMMANDS = [
  { group: "Grundlagen & Modi", items: [
    { cmd: "enable", mode: ">", desc: "Von User EXEC (Router>) in Privileged EXEC (Router#) wechseln" },
    { cmd: "disable", mode: "#", desc: "Zurück in User EXEC" },
    { cmd: "configure terminal", mode: "#", desc: "Global Configuration Mode (Router(config)#) — Kurzform: conf t" },
    { cmd: "exit", mode: "*", desc: "Eine Ebene zurück (z.B. von (config-if)# nach (config)#)" },
    { cmd: "end", mode: "(config)", desc: "Direkt zurück nach Privileged EXEC (auch Ctrl+Z)" },
    { cmd: "hostname R1", mode: "(config)", desc: "Gerätename setzen" },
    { cmd: "no ip domain-lookup", mode: "(config)", desc: "DNS-Auflösung bei Tippfehlern abschalten" },
    { cmd: "banner motd # Text #", mode: "(config)", desc: "Login-Banner (Message of the Day); # ist Begrenzer" },
    { cmd: "do show ip interface brief", mode: "(config)", desc: "show-Befehl aus dem Config-Modus ausführen" },
    { cmd: "show running-config", mode: "#", desc: "Aktive Konfiguration (RAM) anzeigen — Kurzform: sh run" },
    { cmd: "show startup-config", mode: "#", desc: "Gespeicherte Konfiguration (NVRAM)" },
    { cmd: "copy running-config startup-config", mode: "#", desc: "Konfiguration speichern — auch: write memory / wr" },
    { cmd: "erase startup-config", mode: "#", desc: "Startkonfiguration löschen (dann reload)" },
    { cmd: "reload", mode: "#", desc: "Gerät neu starten" },
    { cmd: "show version", mode: "#", desc: "IOS-Version, Uptime, Image, Config-Register, Seriennummer" },
    { cmd: "show history", mode: "#", desc: "Zuletzt eingegebene Befehle" },
    { cmd: "terminal length 0", mode: "#", desc: "Ausgabe ohne --More-- Pausen" },
    { cmd: "show running-config | include ip route", mode: "#", desc: "Ausgabe filtern: include / exclude / begin / section" }
  ]},
  { group: "Zugriff sichern (Console, VTY, SSH)", items: [
    { cmd: "enable secret Pass", mode: "(config)", desc: "Gehashtes Enable-Passwort (schlägt enable password)" },
    { cmd: "service password-encryption", mode: "(config)", desc: "Klartext-Passwörter in der Config verschleiern (Typ 7)" },
    { cmd: "username admin privilege 15 secret Pass", mode: "(config)", desc: "Lokalen Benutzer mit gehashtem Passwort anlegen" },
    { cmd: "line console 0", mode: "(config)", desc: "Console-Line konfigurieren" },
    { cmd: "password Pass", mode: "(config-line)", desc: "Line-Passwort setzen" },
    { cmd: "login", mode: "(config-line)", desc: "Passwortabfrage aktivieren (login local = lokale User)" },
    { cmd: "exec-timeout 5 0", mode: "(config-line)", desc: "Sitzung nach 5 Min Inaktivität beenden" },
    { cmd: "logging synchronous", mode: "(config-line)", desc: "Syslog-Meldungen unterbrechen die Eingabe nicht" },
    { cmd: "line vty 0 4", mode: "(config)", desc: "Virtuelle Terminal-Lines 0–4 (5 Sitzungen) für Telnet/SSH" },
    { cmd: "transport input ssh", mode: "(config-line)", desc: "Nur SSH erlauben (all = Telnet+SSH, none = nichts)" },
    { cmd: "access-class 10 in", mode: "(config-line)", desc: "ACL auf VTY-Zugriff anwenden" },
    { cmd: "ip domain-name firma.local", mode: "(config)", desc: "Domain-Name — Voraussetzung für RSA-Key" },
    { cmd: "crypto key generate rsa modulus 2048", mode: "(config)", desc: "RSA-Schlüsselpaar für SSH erzeugen" },
    { cmd: "ip ssh version 2", mode: "(config)", desc: "Nur SSHv2 zulassen" },
    { cmd: "show ip ssh", mode: "#", desc: "SSH-Status, Version, Timeout" },
    { cmd: "show users", mode: "#", desc: "Aktive Sitzungen" },
    { cmd: "login block-for 120 attempts 3 within 60", mode: "(config)", desc: "Brute-Force-Schutz: nach 3 Fehlversuchen 120 s sperren" },
    { cmd: "security passwords min-length 10", mode: "(config)", desc: "Mindestlänge für Passwörter" }
  ]},
  { group: "Interfaces & IP-Adressen", items: [
    { cmd: "interface gigabitEthernet 0/1", mode: "(config)", desc: "Interface-Konfigurationsmodus — Kurzform: int g0/1" },
    { cmd: "interface range fa0/1 - 24", mode: "(config)", desc: "Mehrere Interfaces gleichzeitig" },
    { cmd: "ip address 192.168.1.1 255.255.255.0", mode: "(config-if)", desc: "IPv4-Adresse und Maske" },
    { cmd: "ip address dhcp", mode: "(config-if)", desc: "Interface als DHCP-Client" },
    { cmd: "ipv6 address 2001:DB8:1::1/64", mode: "(config-if)", desc: "IPv6-Adresse (eui-64 am Ende für automatische Interface-ID)" },
    { cmd: "ipv6 enable", mode: "(config-if)", desc: "Nur Link-Local-Adresse erzeugen" },
    { cmd: "no shutdown", mode: "(config-if)", desc: "Interface aktivieren (Router-Ports sind standardmäßig aus)" },
    { cmd: "description Uplink zu SW1", mode: "(config-if)", desc: "Beschreibung" },
    { cmd: "speed 1000 / duplex full", mode: "(config-if)", desc: "Speed und Duplex fest setzen (Standard: auto)" },
    { cmd: "show ip interface brief", mode: "#", desc: "Alle Interfaces mit IP und Status — wichtigster Überblick" },
    { cmd: "show interfaces gi0/1", mode: "#", desc: "Details: Duplex, Speed, Fehler, Counter, MTU" },
    { cmd: "show interfaces status", mode: "#", desc: "Switch: connected/notconnect/err-disabled, VLAN, Duplex, Speed" },
    { cmd: "show ipv6 interface brief", mode: "#", desc: "IPv6-Adressen aller Interfaces" },
    { cmd: "show controllers ethernet-controller gi0/1 phy", mode: "#", desc: "PHY-Details, Auto-MDIX-Status" },
    { cmd: "interface loopback 0", mode: "(config)", desc: "Loopback-Interface (immer up, für Router-ID, NTP-Quelle)" }
  ]},
  { group: "VLANs & Trunks", items: [
    { cmd: "vlan 10", mode: "(config)", desc: "VLAN anlegen und in VLAN-Modus wechseln" },
    { cmd: "name VERTRIEB", mode: "(config-vlan)", desc: "VLAN benennen" },
    { cmd: "switchport mode access", mode: "(config-if)", desc: "Port als Access-Port (ein VLAN)" },
    { cmd: "switchport access vlan 10", mode: "(config-if)", desc: "Access-Port VLAN 10 zuweisen" },
    { cmd: "switchport voice vlan 20", mode: "(config-if)", desc: "Voice-VLAN für IP-Telefon am selben Port" },
    { cmd: "switchport mode trunk", mode: "(config-if)", desc: "Port als 802.1Q-Trunk" },
    { cmd: "switchport trunk encapsulation dot1q", mode: "(config-if)", desc: "Bei älteren Switches vor mode trunk nötig" },
    { cmd: "switchport trunk allowed vlan 10,20,30", mode: "(config-if)", desc: "Erlaubte VLANs auf dem Trunk (add / remove / all)" },
    { cmd: "switchport trunk native vlan 99", mode: "(config-if)", desc: "Native VLAN (ungetaggt) — auf beiden Seiten gleich!" },
    { cmd: "switchport nonegotiate", mode: "(config-if)", desc: "DTP abschalten" },
    { cmd: "show vlan brief", mode: "#", desc: "VLANs und zugeordnete Ports" },
    { cmd: "show interfaces trunk", mode: "#", desc: "Trunk-Ports, Native VLAN, erlaubte/aktive VLANs" },
    { cmd: "show interfaces gi0/1 switchport", mode: "#", desc: "Modus (access/trunk), DTP-Status, Native VLAN eines Ports" },
    { cmd: "interface vlan 10", mode: "(config)", desc: "SVI für Inter-VLAN-Routing auf L3-Switch" },
    { cmd: "ip routing", mode: "(config)", desc: "Routing auf einem Layer-3-Switch aktivieren" },
    { cmd: "no switchport", mode: "(config-if)", desc: "Routed Port auf L3-Switch (IP direkt am Port)" },
    { cmd: "interface gi0/0.10 → encapsulation dot1q 10", mode: "(config-subif)", desc: "Router-on-a-Stick: Subinterface pro VLAN" },
    { cmd: "ip default-gateway 10.1.1.1", mode: "(config)", desc: "Default Gateway für L2-Switch-Management" }
  ]},
  { group: "STP & EtherChannel", items: [
    { cmd: "spanning-tree mode rapid-pvst", mode: "(config)", desc: "Rapid PVST+ aktivieren" },
    { cmd: "spanning-tree vlan 10 root primary", mode: "(config)", desc: "Switch als Root Bridge für VLAN 10 (secondary = Backup)" },
    { cmd: "spanning-tree vlan 10 priority 4096", mode: "(config)", desc: "Priorität manuell (Vielfaches von 4096)" },
    { cmd: "spanning-tree portfast", mode: "(config-if)", desc: "Access-Port sofort forwarding" },
    { cmd: "spanning-tree bpduguard enable", mode: "(config-if)", desc: "Port bei BPDU-Empfang err-disabled" },
    { cmd: "spanning-tree portfast bpduguard default", mode: "(config)", desc: "BPDU Guard global auf allen PortFast-Ports" },
    { cmd: "spanning-tree guard root", mode: "(config-if)", desc: "Root Guard" },
    { cmd: "spanning-tree guard loop", mode: "(config-if)", desc: "Loop Guard" },
    { cmd: "show spanning-tree", mode: "#", desc: "Root Bridge, Rollen, Zustände pro VLAN" },
    { cmd: "show spanning-tree vlan 10", mode: "#", desc: "STP-Details für ein VLAN" },
    { cmd: "channel-group 1 mode active", mode: "(config-if)", desc: "LACP: active/passive · PAgP: desirable/auto · statisch: on" },
    { cmd: "interface port-channel 1", mode: "(config)", desc: "Logisches EtherChannel-Interface konfigurieren" },
    { cmd: "show etherchannel summary", mode: "#", desc: "Bundle-Status: SU = Layer 2 in use, P = bundled" },
    { cmd: "show etherchannel port-channel", mode: "#", desc: "Details zum Port-Channel" }
  ]},
  { group: "CDP & LLDP", items: [
    { cmd: "show cdp neighbors", mode: "#", desc: "Direkt verbundene Cisco-Geräte (detail = + IP, IOS)" },
    { cmd: "no cdp run", mode: "(config)", desc: "CDP global aus" },
    { cmd: "no cdp enable", mode: "(config-if)", desc: "CDP auf einem Interface aus" },
    { cmd: "lldp run", mode: "(config)", desc: "LLDP global aktivieren (Standard: aus)" },
    { cmd: "no lldp transmit / no lldp receive", mode: "(config-if)", desc: "LLDP-Richtung pro Interface" },
    { cmd: "show lldp neighbors detail", mode: "#", desc: "LLDP-Nachbarn mit Details" }
  ]},
  { group: "Routing (statisch, OSPF, FHRP)", items: [
    { cmd: "ip route 10.2.0.0 255.255.0.0 10.1.1.2", mode: "(config)", desc: "Statische Route via Next Hop (alternativ Exit-Interface)" },
    { cmd: "ip route 0.0.0.0 0.0.0.0 203.0.113.1", mode: "(config)", desc: "Default Route" },
    { cmd: "ip route 10.2.0.0 255.255.0.0 10.1.2.2 5", mode: "(config)", desc: "Floating Static Route (AD 5)" },
    { cmd: "ipv6 unicast-routing", mode: "(config)", desc: "IPv6-Routing aktivieren" },
    { cmd: "ipv6 route ::/0 gi0/0 FE80::1", mode: "(config)", desc: "IPv6-Default-Route (bei Link-Local: Exit-Interface Pflicht)" },
    { cmd: "show ip route", mode: "#", desc: "Routing-Tabelle (ospf / static / connected filtern)" },
    { cmd: "show ip route 10.2.5.7", mode: "#", desc: "Welche Route wird für dieses Ziel genutzt?" },
    { cmd: "router ospf 1", mode: "(config)", desc: "OSPF-Prozess 1 (lokal, muss nicht übereinstimmen)" },
    { cmd: "router-id 1.1.1.1", mode: "(config-router)", desc: "Router-ID manuell setzen (clear ip ospf process danach)" },
    { cmd: "network 10.1.1.0 0.0.0.255 area 0", mode: "(config-router)", desc: "Interfaces in OSPF aufnehmen (Wildcard!)" },
    { cmd: "ip ospf 1 area 0", mode: "(config-if)", desc: "OSPF direkt am Interface aktivieren" },
    { cmd: "passive-interface gi0/1", mode: "(config-router)", desc: "Keine Hellos senden (LAN-Seite)" },
    { cmd: "default-information originate", mode: "(config-router)", desc: "Default Route in OSPF verteilen" },
    { cmd: "ip ospf priority 255", mode: "(config-if)", desc: "DR-Wahl beeinflussen (0 = nie DR)" },
    { cmd: "ip ospf cost 10", mode: "(config-if)", desc: "OSPF-Cost manuell" },
    { cmd: "auto-cost reference-bandwidth 10000", mode: "(config-router)", desc: "Referenzbandbreite in Mbit/s (für 10G-Links)" },
    { cmd: "show ip ospf neighbor", mode: "#", desc: "Nachbarn, Zustand (FULL/2WAY), DR/BDR" },
    { cmd: "show ip ospf interface brief", mode: "#", desc: "OSPF-Interfaces, Area, Cost, Zustand" },
    { cmd: "show ip protocols", mode: "#", desc: "Routing-Protokolle, Router-ID, Netze, Nachbarn" },
    { cmd: "show ip ospf database", mode: "#", desc: "LSDB" },
    { cmd: "standby 1 ip 10.1.1.1", mode: "(config-if)", desc: "HSRP-Gruppe 1 mit virtueller IP" },
    { cmd: "standby 1 priority 110 / standby 1 preempt", mode: "(config-if)", desc: "HSRP-Priorität und Preemption" },
    { cmd: "show standby brief", mode: "#", desc: "HSRP-Status: Active/Standby, Priorität, virtuelle IP" }
  ]},
  { group: "DHCP, DNS, NTP", items: [
    { cmd: "ip dhcp pool LAN", mode: "(config)", desc: "DHCP-Pool anlegen" },
    { cmd: "network 192.168.1.0 255.255.255.0", mode: "(dhcp-config)", desc: "Adressbereich" },
    { cmd: "default-router 192.168.1.1", mode: "(dhcp-config)", desc: "Gateway für Clients" },
    { cmd: "dns-server 8.8.8.8", mode: "(dhcp-config)", desc: "DNS-Server für Clients (Option 6)" },
    { cmd: "lease 7", mode: "(dhcp-config)", desc: "Lease-Dauer in Tagen" },
    { cmd: "ip dhcp excluded-address 192.168.1.1 192.168.1.20", mode: "(config)", desc: "Adressen vom Pool ausnehmen" },
    { cmd: "ip helper-address 10.0.0.100", mode: "(config-if)", desc: "DHCP-Relay zum Server in anderem Subnetz" },
    { cmd: "show ip dhcp binding", mode: "#", desc: "Vergebene Adressen" },
    { cmd: "show ip dhcp pool / conflict", mode: "#", desc: "Pool-Status / Adresskonflikte" },
    { cmd: "ip name-server 8.8.8.8", mode: "(config)", desc: "DNS-Server für den Router" },
    { cmd: "ip host SW1 10.1.1.10", mode: "(config)", desc: "Statischer Host-Eintrag" },
    { cmd: "show hosts", mode: "#", desc: "Hosts-Tabelle und DNS-Cache" },
    { cmd: "ntp server 10.1.1.1 prefer", mode: "(config)", desc: "NTP-Client" },
    { cmd: "ntp master 3", mode: "(config)", desc: "NTP-Server mit eigener Uhr (Stratum 3)" },
    { cmd: "clock timezone CET 1", mode: "(config)", desc: "Zeitzone" },
    { cmd: "show ntp status / associations", mode: "#", desc: "Synchronisiert? Stratum? Server-Liste" },
    { cmd: "show clock detail", mode: "#", desc: "Aktuelle Zeit und Zeitquelle" }
  ]},
  { group: "NAT", items: [
    { cmd: "ip nat inside", mode: "(config-if)", desc: "LAN-Interface markieren" },
    { cmd: "ip nat outside", mode: "(config-if)", desc: "WAN-Interface markieren" },
    { cmd: "ip nat inside source static 192.168.1.10 203.0.113.10", mode: "(config)", desc: "Statisches NAT 1:1" },
    { cmd: "ip nat pool POOL 203.0.113.10 203.0.113.20 netmask 255.255.255.0", mode: "(config)", desc: "Pool öffentlicher Adressen" },
    { cmd: "ip nat inside source list 1 pool POOL", mode: "(config)", desc: "Dynamisches NAT (ACL 1 definiert, wer übersetzt wird)" },
    { cmd: "ip nat inside source list 1 interface gi0/0 overload", mode: "(config)", desc: "PAT auf die Interface-Adresse" },
    { cmd: "show ip nat translations", mode: "#", desc: "Aktive Übersetzungen" },
    { cmd: "show ip nat statistics", mode: "#", desc: "Zähler, Interfaces, Pools" },
    { cmd: "clear ip nat translation *", mode: "#", desc: "Übersetzungstabelle leeren" }
  ]},
  { group: "ACLs", items: [
    { cmd: "access-list 10 permit 192.168.1.0 0.0.0.255", mode: "(config)", desc: "Standard-ACL (1–99, 1300–1999) — nur Quelle" },
    { cmd: "access-list 100 permit tcp any host 10.1.1.5 eq 443", mode: "(config)", desc: "Extended ACL (100–199, 2000–2699) — Protokoll, Quelle, Ziel, Port" },
    { cmd: "ip access-list extended WEB", mode: "(config)", desc: "Benannte ACL (Einträge mit Sequenznummern editierbar)" },
    { cmd: "10 permit tcp 10.1.0.0 0.0.255.255 any eq www", mode: "(config-ext-nacl)", desc: "Eintrag mit Sequenznummer" },
    { cmd: "ip access-group 100 in", mode: "(config-if)", desc: "ACL auf Interface anwenden (in/out)" },
    { cmd: "show access-lists", mode: "#", desc: "ACLs mit Trefferzählern" },
    { cmd: "show ip interface gi0/1", mode: "#", desc: "Welche ACL ist auf dem Interface (in/out)?" },
    { cmd: "no access-list 100", mode: "(config)", desc: "Nummerierte ACL komplett löschen (Vorsicht!)" }
  ]},
  { group: "Layer-2-Security", items: [
    { cmd: "switchport port-security", mode: "(config-if)", desc: "Port Security aktivieren (Port muss access sein)" },
    { cmd: "switchport port-security maximum 2", mode: "(config-if)", desc: "Max. MAC-Adressen" },
    { cmd: "switchport port-security mac-address sticky", mode: "(config-if)", desc: "Gelernte MACs in die Config übernehmen" },
    { cmd: "switchport port-security violation restrict", mode: "(config-if)", desc: "protect / restrict / shutdown (Standard)" },
    { cmd: "show port-security interface fa0/1", mode: "#", desc: "Status, Violation-Zähler, gelernte MACs" },
    { cmd: "errdisable recovery cause psecure-violation", mode: "(config)", desc: "Automatische Wiederherstellung err-disabled Ports" },
    { cmd: "ip dhcp snooping", mode: "(config)", desc: "DHCP Snooping global" },
    { cmd: "ip dhcp snooping vlan 10,20", mode: "(config)", desc: "DHCP Snooping für VLANs" },
    { cmd: "ip dhcp snooping trust", mode: "(config-if)", desc: "Uplink / Server-Port als trusted" },
    { cmd: "ip dhcp snooping limit rate 10", mode: "(config-if)", desc: "DHCP-Pakete/Sekunde begrenzen" },
    { cmd: "show ip dhcp snooping binding", mode: "#", desc: "Binding-Tabelle (IP-MAC-Port-VLAN)" },
    { cmd: "ip arp inspection vlan 10,20", mode: "(config)", desc: "Dynamic ARP Inspection" },
    { cmd: "ip arp inspection trust", mode: "(config-if)", desc: "Uplink für DAI als trusted" },
    { cmd: "show ip arp inspection", mode: "#", desc: "DAI-Status und Statistiken" }
  ]},
  { group: "Logging, SNMP, Dateien", items: [
    { cmd: "logging host 10.1.1.200", mode: "(config)", desc: "Syslog-Server" },
    { cmd: "logging trap 5", mode: "(config)", desc: "Level 0–5 an Server senden" },
    { cmd: "logging buffered 16384 6", mode: "(config)", desc: "Interner Log-Puffer" },
    { cmd: "logging console 4", mode: "(config)", desc: "Console-Meldungen begrenzen" },
    { cmd: "service timestamps log datetime msec", mode: "(config)", desc: "Zeitstempel in Logs" },
    { cmd: "terminal monitor", mode: "#", desc: "Syslog in SSH-Sitzung anzeigen" },
    { cmd: "show logging", mode: "#", desc: "Logging-Konfiguration und Puffer" },
    { cmd: "snmp-server community RO ro 10", mode: "(config)", desc: "SNMPv2c Community read-only, begrenzt durch ACL 10" },
    { cmd: "snmp-server host 10.1.1.100 version 2c RO", mode: "(config)", desc: "Trap-Empfänger" },
    { cmd: "snmp-server enable traps", mode: "(config)", desc: "Traps aktivieren" },
    { cmd: "copy running-config tftp:", mode: "#", desc: "Konfig-Backup auf TFTP" },
    { cmd: "copy tftp: flash:", mode: "#", desc: "IOS-Image herunterladen" },
    { cmd: "show flash: / dir", mode: "#", desc: "Dateien im Flash" },
    { cmd: "verify /md5 flash:image.bin", mode: "#", desc: "Image-Integrität prüfen" },
    { cmd: "boot system flash:image.bin", mode: "(config)", desc: "Boot-Image festlegen" }
  ]},
  { group: "Troubleshooting", items: [
    { cmd: "ping 10.1.1.1", mode: "#", desc: "Erreichbarkeit (erweitert: ping ohne Argumente → Optionen)" },
    { cmd: "ping 10.1.1.1 source loopback0", mode: "#", desc: "Ping mit bestimmter Quelladresse" },
    { cmd: "traceroute 8.8.8.8", mode: "#", desc: "Pfad Hop für Hop" },
    { cmd: "show arp", mode: "#", desc: "ARP-Tabelle des Geräts" },
    { cmd: "show mac address-table", mode: "#", desc: "MAC-Tabelle des Switches (dynamic / interface / vlan)" },
    { cmd: "show ip interface gi0/1", mode: "#", desc: "L3-Details: ACLs, Helper, NAT, MTU" },
    { cmd: "show interfaces gi0/1 | include errors|duplex", mode: "#", desc: "Fehler und Duplex gezielt anzeigen" },
    { cmd: "show cdp neighbors detail", mode: "#", desc: "Was hängt am anderen Ende?" },
    { cmd: "show processes cpu / memory", mode: "#", desc: "Auslastung" },
    { cmd: "show tech-support", mode: "#", desc: "Alles für den Support (sehr lang)" },
    { cmd: "debug ip ospf adj", mode: "#", desc: "OSPF-Adjacency live debuggen (undebug all zum Beenden)" },
    { cmd: "clear counters", mode: "#", desc: "Interface-Zähler zurücksetzen" }
  ]}
];
