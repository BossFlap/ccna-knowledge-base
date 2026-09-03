// ===== Glossar-Tooltips für Abkürzungen im Text + verwandte Themen =====

const ABBREVIATIONS = {
  'AAA': 'Authentication, Authorization, Accounting — wer bist du, was darfst du, was hast du getan',
  'ACL': 'Access Control List — Regelliste zum Filtern von Paketen (permit/deny)',
  'AD': 'Administrative Distance — Vertrauenswürdigkeit einer Routenquelle (niedriger = besser)',
  'AES': 'Advanced Encryption Standard — symmetrische Verschlüsselung (WPA2/WPA3, IPsec)',
  'AP': 'Access Point — verbindet WLAN-Clients mit dem kabelgebundenen Netz',
  'ARP': 'Address Resolution Protocol — löst IPv4-Adressen in MAC-Adressen auf',
  'BPDU': 'Bridge Protocol Data Unit — STP-Nachricht zwischen Switches',
  'BSSID': 'Basic Service Set Identifier — MAC-Adresse des AP-Radios',
  'CAPWAP': 'Control and Provisioning of Wireless Access Points — Tunnelprotokoll AP ↔ WLC (UDP 5246/5247)',
  'CDP': 'Cisco Discovery Protocol — Cisco-eigenes Nachbar-Erkennungsprotokoll (60 s / 180 s)',
  'CEF': 'Cisco Express Forwarding — Hardware-Weiterleitung mit FIB und Adjacency-Tabelle',
  'CIDR': 'Classless Inter-Domain Routing — Präfixschreibweise wie /24 statt Klassen',
  'CoS': 'Class of Service — 3-Bit-QoS-Markierung im 802.1Q-Tag (Layer 2)',
  'CRC': 'Cyclic Redundancy Check — Prüfsumme im Ethernet-Trailer (FCS)',
  'CSMA/CA': 'Carrier Sense Multiple Access / Collision Avoidance — WLAN-Zugriffsverfahren',
  'CSMA/CD': 'Carrier Sense Multiple Access / Collision Detection — Ethernet-Zugriffsverfahren (Half-Duplex)',
  'DAI': 'Dynamic ARP Inspection — prüft ARP-Pakete gegen die DHCP-Snooping-Tabelle',
  'DHCP': 'Dynamic Host Configuration Protocol — automatische IP-Vergabe (UDP 67/68, DORA)',
  'DNS': 'Domain Name System — Namen ↔ IP-Adressen (UDP/TCP 53)',
  'DR': 'Designated Router — von OSPF auf Multi-Access-Netzen gewählter Verteiler',
  'BDR': 'Backup Designated Router — Stellvertreter des DR in OSPF',
  'DSCP': 'Differentiated Services Code Point — 6-Bit-QoS-Markierung im IP-Header (Layer 3)',
  'DTP': 'Dynamic Trunking Protocol — Cisco-Aushandlung von Trunks (aus Sicherheitsgründen abschalten)',
  'EAP': 'Extensible Authentication Protocol — Rahmen für Authentifizierungsmethoden bei 802.1X',
  'EIGRP': 'Enhanced Interior Gateway Routing Protocol — Cisco-Distance-Vector-Protokoll (AD 90)',
  'ESP': 'Encapsulating Security Payload — IPsec-Protokoll für Verschlüsselung + Integrität (IP-Protokoll 50)',
  'ESS': 'Extended Service Set — mehrere APs mit derselben SSID (Roaming)',
  'EUI-64': 'Extended Unique Identifier — bildet aus der MAC eine 64-Bit-IPv6-Interface-ID',
  'FHRP': 'First Hop Redundancy Protocol — Oberbegriff für HSRP, VRRP, GLBP',
  'FIB': 'Forwarding Information Base — CEF-Weiterleitungstabelle (Data Plane)',
  'FTP': 'File Transfer Protocol — Dateiübertragung mit Login (TCP 20/21)',
  'GLBP': 'Gateway Load Balancing Protocol — Cisco-FHRP mit Lastverteilung (AVG/AVF)',
  'GRE': 'Generic Routing Encapsulation — Tunnel ohne Verschlüsselung, transportiert Multicast (IP-Protokoll 47)',
  'HSRP': 'Hot Standby Router Protocol — Cisco-FHRP mit Active/Standby',
  'IaaS': 'Infrastructure as a Service — Cloud stellt Compute, Storage, Netz bereit',
  'IKE': 'Internet Key Exchange — baut IPsec-Tunnel auf, tauscht Schlüssel (UDP 500/4500)',
  'IPS': 'Intrusion Prevention System — erkennt und blockiert Angriffe inline',
  'IDS': 'Intrusion Detection System — erkennt Angriffe und alarmiert (nicht inline)',
  'IPsec': 'IP Security — Framework für verschlüsselte VPN-Tunnel (ESP, AH, IKE)',
  'ISE': 'Identity Services Engine — Ciscos zentraler AAA-/NAC-Server (RADIUS, TACACS+)',
  'LACP': 'Link Aggregation Control Protocol — IEEE-Standard für EtherChannel (active/passive)',
  'LAG': 'Link Aggregation Group — gebündelte Links, z.B. WLC ↔ Switch',
  'LLDP': 'Link Layer Discovery Protocol — herstellerneutrale Nachbar-Erkennung (IEEE 802.1AB)',
  'LLQ': 'Low Latency Queuing — CBWFQ plus strikte Priority Queue für Voice',
  'MAB': 'MAC Authentication Bypass — 802.1X-Ersatz für Geräte ohne Supplicant',
  'MFA': 'Multifactor Authentication — mindestens zwei Faktoren: Wissen, Besitz, Inhärenz',
  'MIB': 'Management Information Base — Datenbank der per SNMP abfragbaren Werte',
  'MTU': 'Maximum Transmission Unit — größte Paketgröße auf einem Link (Ethernet 1500 Byte)',
  'NAT': 'Network Address Translation — übersetzt private in öffentliche Adressen',
  'PAT': 'Port Address Translation — NAT Overload, viele private IPs auf eine öffentliche per Port',
  'NDP': 'Neighbor Discovery Protocol — IPv6-Ersatz für ARP (ICMPv6)',
  'NGFW': 'Next-Generation Firewall — Stateful Firewall mit Applikationserkennung und IPS',
  'NMS': 'Network Management System — zentrale Monitoring-Software (SNMP-Manager)',
  'NTP': 'Network Time Protocol — Zeitsynchronisation (UDP 123, Stratum)',
  'OID': 'Object Identifier — Adresse eines Werts in der SNMP-MIB',
  'OSPF': 'Open Shortest Path First — Link-State-Routingprotokoll (AD 110, Dijkstra)',
  'OUI': 'Organizationally Unique Identifier — Herstellerkennung, erste 24 Bit der MAC',
  'PaaS': 'Platform as a Service — Cloud stellt Laufzeitumgebung bereit',
  'PHB': 'Per-Hop Behavior — QoS-Behandlung eines Pakets auf jedem einzelnen Gerät',
  'PoE': 'Power over Ethernet — Stromversorgung über das Netzwerkkabel (802.3af/at/bt)',
  'PSK': 'Pre-Shared Key — gemeinsames WLAN-Passwort (WPA2-Personal)',
  'PVST+': 'Per-VLAN Spanning Tree Plus — Cisco: eine STP-Instanz pro VLAN',
  'QoS': 'Quality of Service — Priorisierung von Traffic (Classification, Marking, Queuing …)',
  'RADIUS': 'Remote Authentication Dial-In User Service — AAA-Protokoll für Netzwerkzugang (UDP 1812/1813)',
  'RIB': 'Routing Information Base — die Routing-Tabelle (Control Plane)',
  'RSTP': 'Rapid Spanning Tree Protocol — schnelle STP-Variante (IEEE 802.1w)',
  'SAE': 'Simultaneous Authentication of Equals — WPA3-Handshake, ersetzt PSK-4-Way',
  'SaaS': 'Software as a Service — fertige Anwendung aus der Cloud',
  'SDN': 'Software Defined Networking — zentrale Control Plane über einen Controller',
  'SLAAC': 'Stateless Address Autoconfiguration — IPv6-Adressbildung aus Router Advertisements',
  'SNMP': 'Simple Network Management Protocol — Monitoring/Management (UDP 161/162)',
  'SOHO': 'Small Office / Home Office — kleines Netz mit einem All-in-one-Gerät',
  'SSH': 'Secure Shell — verschlüsselter Remote-Zugriff (TCP 22)',
  'SSID': 'Service Set Identifier — Name eines WLANs',
  'STP': 'Spanning Tree Protocol — verhindert Layer-2-Schleifen (IEEE 802.1D)',
  'SVI': 'Switched Virtual Interface — Layer-3-Interface eines VLANs auf einem Switch',
  'TACACS+': 'Terminal Access Controller Access-Control System Plus — Cisco-AAA für Geräteadministration (TCP 49)',
  'TFTP': 'Trivial File Transfer Protocol — einfache Dateiübertragung ohne Login (UDP 69)',
  'TKIP': 'Temporal Key Integrity Protocol — WPA-Verschlüsselung (veraltet)',
  'TTL': 'Time to Live — Hop-Zähler im IP-Header bzw. Gültigkeit eines DNS-Eintrags',
  'UTP': 'Unshielded Twisted Pair — ungeschirmtes Kupferkabel (Cat 5e/6/6a, max. 100 m)',
  'VLAN': 'Virtual LAN — logische Trennung eines Switches in Broadcast-Domänen',
  'VPN': 'Virtual Private Network — verschlüsselter Tunnel über ein unsicheres Netz',
  'VRF': 'Virtual Routing and Forwarding — mehrere getrennte Routing-Tabellen auf einem Router',
  'VRRP': 'Virtual Router Redundancy Protocol — herstellerneutrales FHRP (Master/Backup)',
  'VTY': 'Virtual Teletype — virtuelle Terminal-Lines für Telnet/SSH',
  'WLC': 'Wireless LAN Controller — verwaltet Lightweight-APs zentral',
  'WPA2': 'Wi-Fi Protected Access 2 — WLAN-Sicherheit mit AES-CCMP (802.11i)',
  'WPA3': 'Wi-Fi Protected Access 3 — aktueller WLAN-Standard mit SAE und PMF',
  'WRED': 'Weighted Random Early Detection — verwirft Pakete frühzeitig gegen Tail Drop',
  'YANG': 'Yet Another Next Generation — Datenmodellierungssprache für NETCONF/RESTCONF',
  'NETCONF': 'Network Configuration Protocol — XML-basierte Gerätekonfiguration über SSH',
  'RESTCONF': 'REST-basierte Variante von NETCONF über HTTPS (JSON/XML)',
  'JSON': 'JavaScript Object Notation — Datenformat für REST-APIs ({ }, [ ], "key": value)',
  'LLDP-MED': 'LLDP Media Endpoint Discovery — Erweiterung für IP-Telefone (Voice-VLAN, PoE)'
};

let _abbrRegex = null;
function abbrRegex() {
  if (_abbrRegex) return _abbrRegex;
  const terms = Object.keys(ABBREVIATIONS).sort((a, b) => b.length - a.length).map(escRe);
  _abbrRegex = new RegExp('(?<![A-Za-z0-9/-])(' + terms.join('|') + ')(?![A-Za-z0-9-])', 'g');
  return _abbrRegex;
}

// Erste Erwähnung jeder Abkürzung pro Abschnitt bekommt einen Tooltip
function addGlossaryTooltips(root) {
  const sections = root.querySelectorAll('.content-section');
  sections.forEach(sec => {
    const seen = new Set();
    const walker = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const p = n.parentElement;
        if (!p || p.closest('pre, code, kbd, h3, h4, abbr, mark, a, button, .toc, .callout > strong, th, .chip, .tag')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    const re = abbrRegex();
    nodes.forEach(node => {
      const text = node.nodeValue;
      re.lastIndex = 0;
      let m, last = 0, frag = null;
      while ((m = re.exec(text)) !== null) {
        const term = m[1];
        if (seen.has(term)) continue;
        seen.add(term);
        if (!frag) frag = document.createDocumentFragment();
        frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        const ab = document.createElement('abbr');
        ab.className = 'gl'; ab.textContent = term; ab.tabIndex = 0;
        ab.setAttribute('data-tip', ABBREVIATIONS[term]);
        frag.appendChild(ab);
        last = m.index + term.length;
      }
      if (frag) { frag.appendChild(document.createTextNode(text.slice(last))); node.parentNode.replaceChild(frag, node); }
    });
  });
}

// Verwandte Themen: gemeinsame Blueprint-Punkte, gleiche Domäne, gemeinsame Tags
function relatedTopics(topicId, limit) {
  const t = topicById(topicId);
  if (!t) return [];
  const myBp = new Set(BLUEPRINT.flatMap(d => d.items).filter(i => i.refs.includes(topicId)).map(i => i.num));
  const myTags = new Set(t.tags.filter(x => !/^Blueprint/.test(x)));
  const scored = TOPICS.filter(o => o.id !== topicId).map(o => {
    let score = 0;
    BLUEPRINT.flatMap(d => d.items).forEach(i => { if (i.refs.includes(o.id) && myBp.has(i.num)) score += 4; });
    if (o.domain === t.domain) score += 1;
    o.tags.forEach(tag => { if (myTags.has(tag)) score += 2; });
    // Erwähnt der andere Text den Titel dieses Themas (oder umgekehrt)?
    const key = t.title.split(/[\s—(]/)[0].toLowerCase();
    if (key.length > 3 && o.content.toLowerCase().includes(key)) score += 1;
    return { o, score };
  }).filter(x => x.score > 1).sort((a, b) => b.score - a.score);
  const out = scored.slice(0, limit || 4).map(x => x.o);
  // Auffüllen mit Nachbarn derselben Domäne (nach Reihenfolge), falls zu wenige Treffer
  if (out.length < 3) {
    const idx = TOPICS.findIndex(x => x.id === topicId);
    const neighbors = TOPICS.map((o, i) => ({ o, d: Math.abs(i - idx) })).filter(x => x.o.id !== topicId && x.o.domain === t.domain && !out.includes(x.o)).sort((a, b) => a.d - b.d);
    neighbors.slice(0, 3 - out.length).forEach(x => out.push(x.o));
  }
  return out;
}
function renderRelatedTopics(topicId) {
  const rel = relatedTopics(topicId, 4);
  const el = document.getElementById('related-topics');
  if (!el || !rel.length) return;
  el.innerHTML = `<div class="related">
    <div class="related-label">🔗 Verwandte Themen</div>
    <div class="related-grid">${rel.map(o => {
      const bp = blueprintDomain(o.domain);
      const score = state.quizScores[o.id];
      return `<div class="related-card" onclick="navigateTopic('${o.id}')" style="border-left-color:${bp ? bp.color : 'var(--accent)'}">
        <div class="related-title">${o.icon} ${o.title}</div>
        <div class="related-meta">${o.domain}${state.progress[o.id] ? ' · ✅ gelesen' : ''}${score !== undefined ? ` · Quiz ${score}%` : ''}</div>
      </div>`;
    }).join('')}</div>
  </div>`;
}

// Tooltip per Klick/Tipp umschalten (Touch-Geräte haben kein Hover)
document.addEventListener('click', e => {
  const ab = e.target.closest && e.target.closest('abbr.gl');
  document.querySelectorAll('abbr.gl.open').forEach(x => { if (x !== ab) x.classList.remove('open'); });
  if (ab) { e.stopPropagation(); ab.classList.toggle('open'); }
});
