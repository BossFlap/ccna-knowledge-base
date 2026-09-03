// ===== Domain 6: Automation & Programmability (10%) — Erweiterungen nach Blueprint v1.1 =====

// ---------- 6.4 KI & ML im Netzwerkbetrieb (NEU in v1.1) ----------
registerTopic({
  id: "ai-ml",
  domain: "Automation & Programmability",
  domainPct: "10%",
  icon: "🧠",
  title: "KI & Machine Learning im Netzwerkbetrieb",
  tags: ["Blueprint 6.4", "NEU in v1.1", "AIOps"],
  content: `
    <div class="content-section">
      <h3>🧠 Begriffe einordnen</h3>
      <p>Thema 6.4 ist <strong>neu im Blueprint v1.1</strong> (seit August 2024). Du musst <em>erklären</em> können, was generative und prädiktive KI sowie Machine Learning sind und wie sie den Netzwerkbetrieb verändern — keine Mathematik, keine Modelle trainieren.</p>
      <div class="table-wrap"><table>
        <tr><th>Begriff</th><th>Definition</th><th>Netzwerk-Beispiel</th></tr>
        <tr><td><strong>Artificial Intelligence (KI)</strong></td><td>Oberbegriff: Systeme, die Aufgaben lösen, die normalerweise menschliche Intelligenz erfordern</td><td>Ein Assistent, der Netzwerkprobleme analysiert und Lösungen vorschlägt</td></tr>
        <tr><td><strong>Machine Learning (ML)</strong></td><td>Teilgebiet der KI: Algorithmen <strong>lernen Muster aus Daten</strong>, statt explizit programmiert zu werden. Arten: <em>supervised</em> (mit Labels), <em>unsupervised</em> (Cluster/Anomalien), <em>reinforcement</em> (Belohnung)</td><td>Modell lernt das „normale“ Traffic-Profil eines Standorts und erkennt Abweichungen</td></tr>
        <tr><td><strong>Predictive AI</strong> (prädiktiv)</td><td>Nutzt historische Daten, um <strong>zukünftige Ereignisse oder Werte vorherzusagen</strong> (Klassifikation, Regression, Zeitreihen)</td><td>„Der WAN-Link wird in 3 Wochen zu 95 % ausgelastet sein“ · „Diese Festplatte fällt bald aus“ · „Dieser Client wird Roaming-Probleme haben“</td></tr>
        <tr><td><strong>Generative AI</strong> (generativ)</td><td>Erzeugt <strong>neue Inhalte</strong> (Text, Code, Konfigurationen, Bilder) auf Basis großer Modelle — <strong>LLMs</strong> (Large Language Models) wie GPT, Claude, Gemini</td><td>„Erstelle eine ACL, die HTTPS von 10.1.0.0/16 zum Webserver erlaubt“ · Zusammenfassung von 10.000 Syslog-Zeilen · Chat-Assistent im Management-Tool</td></tr>
        <tr><td><strong>AIOps</strong></td><td>AI for IT Operations — KI/ML zur Automatisierung von Monitoring, Ereigniskorrelation, Root-Cause-Analyse und Remediation</td><td>Cisco Catalyst Center AI Network Analytics, Meraki Health, ThousandEyes</td></tr>
      </table></div>
      <div class="callout callout-tip"><strong>Prüfungslogik: prädiktiv vs. generativ</strong>Wird etwas <strong>vorhergesagt</strong> (Ausfall, Auslastung, Anomalie)? → <em>Predictive</em>. Wird etwas <strong>erzeugt</strong> (Konfiguration, Text, Zusammenfassung, Antwort)? → <em>Generative</em>.</div>
    </div>

    <div class="content-section">
      <h3>⚙️ Wie KI/ML den Netzwerkbetrieb verändert</h3>
      <div class="table-wrap"><table>
        <tr><th>Anwendungsfall</th><th>Traditionell</th><th>Mit KI/ML</th></tr>
        <tr><td><strong>Anomalie-Erkennung</strong></td><td>Statische Schwellwerte („CPU &gt; 80 % = Alarm“) → viele Fehlalarme</td><td>Dynamische Baselines pro Gerät/Tageszeit; Alarm nur bei echter Abweichung vom gelernten Normalverhalten</td></tr>
        <tr><td><strong>Predictive Maintenance</strong></td><td>Reagieren nach dem Ausfall</td><td>Vorhersage von Hardware-/Link-Ausfällen (Optik-Degradation, Fehlerzähler-Trends) und Kapazitätsengpässen</td></tr>
        <tr><td><strong>Root-Cause-Analyse</strong></td><td>Manuell Logs und Metriken vieler Geräte korrelieren</td><td>Automatische Ereigniskorrelation: „500 Client-Alarme → Ursache: DHCP-Server antwortet nicht“</td></tr>
        <tr><td><strong>RF-Optimierung (WLAN)</strong></td><td>Manuelle Kanal-/Leistungsplanung, statisches RRM</td><td>AI-Enhanced RRM lernt Nutzungsmuster und optimiert Kanäle/Leistung proaktiv</td></tr>
        <tr><td><strong>Security</strong></td><td>Signaturen bekannter Angriffe</td><td>Verhaltensanalyse erkennt unbekannte Bedrohungen; Encrypted Traffic Analytics erkennt Malware in TLS-Traffic ohne Entschlüsselung</td></tr>
        <tr><td><strong>Konfiguration &amp; Doku</strong></td><td>CLI tippen, Doku von Hand</td><td>Generative KI erzeugt Konfigurationsvorschläge, erklärt Fehlermeldungen, beantwortet Fragen in natürlicher Sprache</td></tr>
        <tr><td><strong>Traffic Engineering</strong></td><td>Statische Policies</td><td>Vorhersage von Lastspitzen, automatische Pfadanpassung in SD-WAN</td></tr>
      </table></div>
      <h4>Cisco-Beispiele (Namen kennen reicht)</h4>
      <ul>
        <li><strong>Cisco Catalyst Center (ehem. DNA Center) — AI Network Analytics</strong>: Baselines, Anomalie-Erkennung, „Network Reasoning Engine“ für Troubleshooting.</li>
        <li><strong>Cisco AI Assistant</strong>: generative KI in Security Cloud, Catalyst Center und Meraki — natürliche Sprache für Policies und Troubleshooting.</li>
        <li><strong>Meraki AI-Enhanced RRM</strong>, <strong>ThousandEyes</strong> (Vorhersage von Internet-Pfad-Problemen), <strong>Cisco Talos</strong> (ML-basierte Threat Intelligence).</li>
      </ul>
    </div>

    <div class="content-section">
      <h3>⚖️ Chancen und Grenzen</h3>
      <div class="table-wrap"><table>
        <tr><th>Vorteile</th><th>Herausforderungen / Risiken</th></tr>
        <tr><td>Schnellere Fehlererkennung (MTTR sinkt)</td><td><strong>Datenqualität</strong>: Modelle sind nur so gut wie ihre Trainingsdaten (Telemetrie, Logs)</td></tr>
        <tr><td>Weniger Fehlalarme, weniger manuelle Arbeit</td><td><strong>Halluzinationen</strong>: Generative KI kann falsche, plausibel klingende Konfigurationen erzeugen → immer prüfen, im Lab testen</td></tr>
        <tr><td>Proaktiv statt reaktiv</td><td><strong>Erklärbarkeit</strong>: „Warum hat das Modell das entschieden?“ ist oft schwer nachvollziehbar</td></tr>
        <tr><td>Skaliert auf tausende Geräte</td><td><strong>Datenschutz / Sicherheit</strong>: Konfigurationen und Logs enthalten sensible Daten — wohin gehen sie (Cloud)?</td></tr>
        <tr><td>Natürliche Sprache senkt Einstiegshürde</td><td><strong>Verantwortung bleibt beim Menschen</strong>: KI empfiehlt, der Engineer entscheidet (Human-in-the-Loop), besonders bei automatischer Remediation</td></tr>
      </table></div>
      <div class="callout callout-info"><strong>Zusammenhang mit Intent-Based Networking</strong>KI/ML ist der Motor hinter „Assurance“ in IBN: Der Controller vergleicht ständig den <em>Ist-Zustand</em> (Telemetrie) mit dem <em>Soll-Zustand</em> (Intent) und schlägt Korrekturen vor oder führt sie aus. Siehe Thema <em>Automation &amp; SDN</em>.</div>
    </div>
  `
}, {
  after: "automation",
  quiz: [
    {
      q: "Ein Netzwerk-Tool meldet: 'Der Uplink von SW3 wird voraussichtlich in 14 Tagen dauerhaft über 90 % Auslastung liegen.' Welche Art von KI ist das?",
      options: ["Generative AI", "Predictive AI", "Reinforcement Learning", "Regelbasiertes Expertensystem"],
      correct: 1,
      explanation: "Eine Vorhersage zukünftiger Werte aus historischen Daten ist prädiktive KI (Zeitreihenprognose).",
      theoryRef: "ai-ml"
    },
    {
      q: "Ein Admin bittet einen Assistenten im Management-Tool: 'Erstelle eine Konfiguration für ein Gast-VLAN mit DHCP.' Welche KI-Art wird genutzt?",
      options: ["Predictive AI", "Generative AI", "Unsupervised Clustering", "Anomalie-Erkennung"],
      correct: 1,
      explanation: "Das Erzeugen neuer Inhalte (Text, Code, Konfigurationen) in natürlicher Sprache ist generative KI, typischerweise ein LLM.",
      theoryRef: "ai-ml"
    },
    {
      q: "Was ist Machine Learning?",
      options: ["Manuell programmierte Wenn-Dann-Regeln", "Algorithmen, die Muster aus Daten lernen, statt explizit programmiert zu werden", "Ein Routing-Protokoll", "Eine Form von Hardware-Beschleunigung"],
      correct: 1,
      explanation: "ML ist ein Teilgebiet der KI: Das System verbessert seine Leistung anhand von Daten (Training), z.B. um das normale Traffic-Profil zu lernen.",
      theoryRef: "ai-ml"
    },
    {
      q: "Welcher Vorteil ergibt sich durch ML-basierte Anomalie-Erkennung gegenüber statischen Schwellwerten?",
      options: ["Sie benötigt keine Daten", "Sie lernt dynamische Baselines und reduziert Fehlalarme", "Sie ersetzt SNMP komplett", "Sie funktioniert nur ohne Internet"],
      correct: 1,
      explanation: "ML-Modelle lernen das Normalverhalten pro Gerät und Zeitraum und melden nur echte Abweichungen — statische Schwellwerte erzeugen oft Fehlalarme.",
      theoryRef: "ai-ml"
    },
    {
      q: "Welches Risiko ist speziell mit generativer KI verbunden, wenn sie Netzwerkkonfigurationen erzeugt?",
      options: ["Sie verbraucht zu viel Bandbreite", "Halluzinationen — plausibel klingende, aber falsche Ausgaben, die geprüft werden müssen", "Sie funktioniert nur mit IPv6", "Sie kann keine Texte verarbeiten"],
      correct: 1,
      explanation: "LLMs können fehlerhafte Inhalte selbstsicher ausgeben. Konfigurationen aus generativer KI müssen immer validiert und getestet werden (Human-in-the-Loop).",
      theoryRef: "ai-ml"
    }
  ],
  flashcards: [
    { front: "Predictive AI", back: "Vorhersage zukünftiger Ereignisse/Werte aus historischen Daten (Ausfall, Auslastung)" },
    { front: "Generative AI", back: "Erzeugt neue Inhalte (Text, Code, Konfigurationen) — LLMs" },
    { front: "Machine Learning", back: "Teilgebiet der KI — lernt Muster aus Daten statt fester Regeln" },
    { front: "AIOps", back: "KI/ML für IT-Betrieb: Anomalie-Erkennung, Korrelation, Root Cause, Remediation" },
    { front: "Halluzination", back: "Generative KI liefert plausible, aber falsche Ausgabe → immer prüfen" },
    { front: "Cisco AI Network Analytics", back: "Baselines + Anomalie-Erkennung in Catalyst Center (Assurance)" },
    { front: "Supervised vs. Unsupervised", back: "Lernen mit gelabelten Daten vs. Muster/Cluster ohne Labels finden" }
  ]
});

// ---------- 6.6 / 6.7 Ansible, Terraform & JSON ----------
registerTopic({
  id: "config-mgmt-json",
  domain: "Automation & Programmability",
  domainPct: "10%",
  icon: "🧾",
  title: "Ansible, Terraform & JSON",
  tags: ["Blueprint 6.6", "Blueprint 6.7", "IaC", "Datenformate"],
  content: `
    <div class="content-section">
      <h3>🧾 Konfigurationsmanagement (Blueprint 6.6)</h3>
      <p>Statt Geräte per CLI einzeln zu konfigurieren („Box-by-Box“), beschreibt man den gewünschten Zustand in Dateien und lässt ein Werkzeug ihn umsetzen — <strong>Infrastructure as Code (IaC)</strong>. Vorteile: Wiederholbarkeit, Versionierung (Git), weniger Tippfehler, Konsistenz über hunderte Geräte.</p>
      <div class="table-wrap"><table>
        <tr><th>Merkmal</th><th>Ansible</th><th>Terraform</th></tr>
        <tr><td>Hersteller</td><td>Red Hat (Open Source)</td><td>HashiCorp (Open Source / BSL)</td></tr>
        <tr><td>Hauptzweck</td><td><strong>Konfigurationsmanagement</strong> und Orchestrierung bestehender Geräte/Server</td><td><strong>Provisionierung</strong> von Infrastruktur (Cloud-Ressourcen, VMs, Netzwerkobjekte über APIs)</td></tr>
        <tr><td>Ansatz</td><td>Überwiegend <strong>prozedural</strong> (Schritte in Reihenfolge), Module oft idempotent</td><td><strong>Deklarativ</strong> — beschreibt den Zielzustand, Terraform berechnet den Weg</td></tr>
        <tr><td>Architektur</td><td><strong>Agentless</strong>, <strong>Push</strong>: Control Node verbindet sich per SSH / NETCONF / API zu den Geräten</td><td><strong>Agentless</strong>, spricht über <strong>Provider</strong> mit APIs (AWS, Azure, Cisco ACI, Meraki, IOS-XE)</td></tr>
        <tr><td>Sprache</td><td><strong>YAML</strong> (Playbooks), Jinja2-Templates</td><td><strong>HCL</strong> (HashiCorp Configuration Language)</td></tr>
        <tr><td>Kernbegriffe</td><td><strong>Inventory</strong> (Geräteliste), <strong>Playbook</strong> (Datei mit Plays), <strong>Play</strong> (Ziel-Hosts + Tasks), <strong>Task</strong> (ein Modulaufruf), <strong>Module</strong> (ios_config, ios_command…), <strong>Role</strong> (wiederverwendbares Bündel), <strong>Variables</strong>, <strong>Templates</strong></td><td><strong>Provider</strong>, <strong>Resource</strong>, <strong>Data Source</strong>, <strong>Variable</strong>, <strong>Module</strong>, <strong>State</strong> (terraform.tfstate — merkt sich, was existiert)</td></tr>
        <tr><td>Workflow</td><td><code>ansible-playbook site.yml</code> (optional <code>--check</code> für Dry-Run)</td><td><code>terraform init</code> → <code>plan</code> (zeigt Änderungen) → <code>apply</code> → <code>destroy</code></td></tr>
        <tr><td>Stärke</td><td>Netzwerkgeräte-Konfiguration, Ad-hoc-Befehle, Reihenfolge-abhängige Schritte</td><td>Zustandsverfolgung, Drift-Erkennung, Cloud/Multi-Cloud</td></tr>
      </table></div>
      <h4>Ansible-Playbook (YAML)</h4>
      <pre><code>---
- name: NTP auf allen Switches setzen
  hosts: switches                 <span class="cli-comment"># Gruppe aus dem Inventory</span>
  gather_facts: no
  connection: network_cli
  tasks:
    - name: NTP-Server konfigurieren
      cisco.ios.ios_config:
        lines:
          - ntp server 10.1.1.1
          - ntp server 10.1.1.2 prefer
    - name: Konfiguration speichern
      cisco.ios.ios_config:
        save_when: modified</code></pre>
      <h4>Terraform (HCL)</h4>
      <pre><code>provider "meraki" {
  api_key = var.meraki_api_key
}

resource "meraki_networks_appliance_vlans" "gast" {
  network_id = var.network_id
  vlan_id    = "30"
  name       = "GAST"
  subnet     = "10.30.0.0/24"
  appliance_ip = "10.30.0.1"
}</code></pre>
      <div class="callout callout-info"><strong>Idempotenz</strong>Ein Vorgang ist idempotent, wenn er beliebig oft ausgeführt dasselbe Ergebnis liefert — beim zweiten Lauf ändert sich nichts mehr („ok“ statt „changed“). Beide Tools streben das an; Terraform garantiert es durch den State-Vergleich.</div>
      <div class="callout callout-warn"><strong>Blueprint-Änderung v1.1</strong>Puppet und Chef wurden gestrichen, <strong>Terraform</strong> kam dazu. Merken: Ansible = YAML, agentless, Push. Terraform = HCL, deklarativ, State, plan/apply.</div>
    </div>

    <div class="content-section">
      <h3>📐 Datenformate: JSON, XML, YAML</h3>
      <div class="table-wrap"><table>
        <tr><th></th><th>JSON</th><th>XML</th><th>YAML</th></tr>
        <tr><td>Name</td><td>JavaScript Object Notation</td><td>eXtensible Markup Language</td><td>YAML Ain't Markup Language</td></tr>
        <tr><td>Syntax</td><td><code>{ }</code> Objekte, <code>[ ]</code> Arrays, <code>"key": value</code></td><td>Tags <code>&lt;name&gt;…&lt;/name&gt;</code></td><td>Einrückung, <code>key: value</code>, <code>- Listenelement</code></td></tr>
        <tr><td>Kommentare</td><td>Nein</td><td><code>&lt;!-- --&gt;</code></td><td><code>#</code></td></tr>
        <tr><td>Typischer Einsatz</td><td><strong>REST APIs</strong> (RESTCONF, Meraki, Catalyst Center)</td><td>NETCONF, SOAP, ältere APIs</td><td>Ansible-Playbooks, Kubernetes, Konfigdateien</td></tr>
        <tr><td>Lesbarkeit</td><td>Gut, kompakt</td><td>Ausführlich (verbose)</td><td>Sehr gut (für Menschen)</td></tr>
      </table></div>
    </div>

    <div class="content-section">
      <h3>🔎 JSON — Komponenten erkennen (Blueprint 6.7)</h3>
      <pre><code>{                                              <span class="cli-comment">← Objekt beginnt (geschweifte Klammer)</span>
  "hostname": "SW1",                           <span class="cli-comment">← Key "hostname" (String) : Value "SW1" (String)</span>
  "uptime_days": 142,                          <span class="cli-comment">← Number (ohne Anführungszeichen!)</span>
  "is_stack": false,                           <span class="cli-comment">← Boolean: true / false (klein, ohne Anführungszeichen)</span>
  "location": null,                            <span class="cli-comment">← null = kein Wert</span>
  "vlans": [10, 20, 30],                       <span class="cli-comment">← Array (eckige Klammern), Werte durch Komma getrennt</span>
  "interfaces": [                              <span class="cli-comment">← Array von Objekten</span>
    { "name": "Gi1/0/1", "status": "up",   "vlan": 10 },
    { "name": "Gi1/0/2", "status": "down", "vlan": 20 }
  ],
  "mgmt": {                                    <span class="cli-comment">← verschachteltes Objekt</span>
    "ip": "10.99.0.10",
    "mask": "255.255.255.0"
  }
}                                              <span class="cli-comment">← kein Komma nach dem letzten Element!</span></code></pre>
      <div class="table-wrap"><table>
        <tr><th>Komponente</th><th>Schreibweise</th><th>Beispiel</th></tr>
        <tr><td><strong>Object</strong></td><td><code>{ }</code> — ungeordnete Menge von Key-Value-Paaren</td><td><code>{"ip": "10.1.1.1"}</code></td></tr>
        <tr><td><strong>Array</strong></td><td><code>[ ]</code> — geordnete Liste von Werten</td><td><code>[10, 20, 30]</code></td></tr>
        <tr><td><strong>Key</strong></td><td>Immer ein String in <strong>doppelten</strong> Anführungszeichen</td><td><code>"hostname"</code></td></tr>
        <tr><td><strong>String</strong></td><td>In doppelten Anführungszeichen</td><td><code>"up"</code></td></tr>
        <tr><td><strong>Number</strong></td><td>Ohne Anführungszeichen, Ganzzahl oder Dezimal</td><td><code>142</code>, <code>3.14</code></td></tr>
        <tr><td><strong>Boolean</strong></td><td><code>true</code> / <code>false</code> (kleingeschrieben)</td><td><code>false</code></td></tr>
        <tr><td><strong>null</strong></td><td>Leerer Wert</td><td><code>null</code></td></tr>
      </table></div>
      <h4>Häufige Fehler in Prüfungsfragen</h4>
      <ul>
        <li>Einfache Anführungszeichen <code>'key'</code> → <strong>ungültig</strong> (nur doppelte).</li>
        <li>Komma nach dem letzten Element (<em>trailing comma</em>) → ungültig.</li>
        <li><code>"42"</code> ist ein <strong>String</strong>, <code>42</code> eine <strong>Number</strong> — nicht dasselbe.</li>
        <li><code>True</code> / <code>FALSE</code> großgeschrieben → ungültig.</li>
        <li>Kommentare sind in JSON nicht erlaubt.</li>
      </ul>
      <pre><code><span class="cli-comment"># Dasselbe in YAML (Ansible) — Einrückung statt Klammern</span>
hostname: SW1
uptime_days: 142
is_stack: false
vlans:
  - 10
  - 20
  - 30
mgmt:
  ip: 10.99.0.10
  mask: 255.255.255.0

<span class="cli-comment"># Und in XML (NETCONF)</span>
&lt;device&gt;
  &lt;hostname&gt;SW1&lt;/hostname&gt;
  &lt;uptime_days&gt;142&lt;/uptime_days&gt;
&lt;/device&gt;</code></pre>
      <div class="callout callout-tip"><strong>Wo JSON im CCNA vorkommt</strong>REST-API-Antworten (Catalyst Center, Meraki, RESTCONF), <code>show ... | format json</code> auf IOS-XE, Webhooks. Übung: Öffne eine JSON-Antwort und benenne jedes Element als Object, Array, Key, String, Number, Boolean oder null.</div>
    </div>
  `
}, {
  after: "ai-ml",
  quiz: [
    {
      q: "Welche Aussage beschreibt Ansible korrekt?",
      options: ["Agent-basiert, Pull-Modell, Ruby-Skripte", "Agentless, Push-Modell, YAML-Playbooks über SSH", "Deklarativ mit HCL und State-Datei", "Nur für Cloud-Provisionierung"],
      correct: 1,
      explanation: "Ansible benötigt keine Agents auf den Zielgeräten, verbindet sich per SSH/API (Push) und beschreibt Aufgaben in YAML-Playbooks.",
      theoryRef: "config-mgmt-json"
    },
    {
      q: "Welches Merkmal ist typisch für Terraform?",
      options: ["Prozedurale Playbooks in YAML", "Deklarative Beschreibung des Zielzustands in HCL mit 'plan' und 'apply' sowie einer State-Datei", "Agent auf jedem Gerät", "Nur für Cisco-Geräte"],
      correct: 1,
      explanation: "Terraform beschreibt den gewünschten Endzustand (deklarativ), zeigt mit 'terraform plan' die Änderungen und setzt sie mit 'apply' um. Der State verfolgt, was existiert.",
      theoryRef: "config-mgmt-json"
    },
    {
      q: "Welches JSON-Fragment ist syntaktisch korrekt?",
      options: ["{'hostname': 'SW1'}", "{\"hostname\": \"SW1\", \"vlans\": [10, 20],}", "{\"hostname\": \"SW1\", \"vlans\": [10, 20]}", "{hostname: SW1}"],
      correct: 2,
      explanation: "JSON verlangt doppelte Anführungszeichen für Keys und Strings und erlaubt kein Komma nach dem letzten Element.",
      theoryRef: "config-mgmt-json"
    },
    {
      q: "Welchen Datentyp hat der Wert in '\"enabled\": true'?",
      options: ["String", "Number", "Boolean", "Array"],
      correct: 2,
      explanation: "true/false ohne Anführungszeichen sind Boolean. \"true\" mit Anführungszeichen wäre ein String.",
      theoryRef: "config-mgmt-json"
    },
    {
      q: "Wie wird in JSON eine geordnete Liste von Werten dargestellt?",
      options: ["Mit geschweiften Klammern { }", "Mit eckigen Klammern [ ]", "Mit runden Klammern ( )", "Mit spitzen Klammern < >"],
      correct: 1,
      explanation: "Eckige Klammern kennzeichnen ein Array (Liste). Geschweifte Klammern kennzeichnen ein Object (Key-Value-Paare).",
      theoryRef: "config-mgmt-json"
    },
    {
      q: "In welchem Datenformat werden Ansible-Playbooks geschrieben?",
      options: ["JSON", "XML", "YAML", "HCL"],
      correct: 2,
      explanation: "Ansible nutzt YAML (Einrückung, key: value, - Listen). HCL ist die Sprache von Terraform, XML wird von NETCONF verwendet.",
      theoryRef: "config-mgmt-json"
    }
  ],
  flashcards: [
    { front: "Ansible", back: "Agentless, Push, YAML-Playbooks, SSH/API — Konfigurationsmanagement" },
    { front: "Terraform", back: "Deklarativ, HCL, Provider, State-Datei, init → plan → apply — Provisionierung" },
    { front: "Ansible Begriffe", back: "Inventory · Playbook · Play · Task · Module · Role" },
    { front: "Idempotenz", back: "Mehrfaches Ausführen → gleiches Ergebnis, keine weiteren Änderungen" },
    { front: "JSON Object vs. Array", back: "{ } Key-Value-Paare vs. [ ] geordnete Liste" },
    { front: "JSON Datentypen", back: "String, Number, Boolean (true/false), null, Object, Array" },
    { front: "JSON Anführungszeichen", back: "Nur doppelte \" \" für Keys und Strings; Zahlen/Booleans ohne" },
    { front: "YAML / JSON / XML Einsatz", back: "Ansible, K8s / REST APIs / NETCONF" }
  ]
});

// Zusätzliche Fragen zum bestehenden Thema Automation & SDN
extendTopic("automation", {
  quiz: [
    {
      q: "Welche API-Schnittstelle eines SDN-Controllers kommuniziert mit den Netzwerkgeräten?",
      options: ["Northbound API", "Southbound API", "Eastbound API", "REST API"],
      correct: 1,
      explanation: "Southbound APIs (NETCONF, RESTCONF, OpenFlow, SSH/CLI) verbinden Controller und Geräte. Northbound APIs (REST) verbinden Controller und Anwendungen/Skripte.",
      theoryRef: "automation"
    },
    {
      q: "Was beschreibt in einer SDN-Architektur der Begriff 'Underlay'?",
      options: ["Die virtuellen Tunnel (VXLAN) zwischen Endpunkten", "Das physische Netzwerk aus Switches, Routern und Links, das die Basiskonnektivität liefert", "Die Management-GUI", "Die Northbound API"],
      correct: 1,
      explanation: "Underlay = physisches Netz (IP-Routing zwischen den Geräten). Overlay = logische Tunnel (z.B. VXLAN) darüber. Fabric = Underlay + Overlay als Einheit (z.B. Cisco SD-Access).",
      theoryRef: "automation"
    },
    {
      q: "Welche HTTP-Methode entspricht der CRUD-Operation 'Read' bei einer REST-API?",
      options: ["POST", "GET", "PUT", "DELETE"],
      correct: 1,
      explanation: "GET = Read, POST = Create, PUT/PATCH = Update, DELETE = Delete.",
      theoryRef: "automation"
    },
    {
      q: "Welcher HTTP-Statuscode zeigt an, dass eine REST-Anfrage wegen fehlender oder ungültiger Authentifizierung abgelehnt wurde?",
      options: ["200", "201", "401", "404"],
      correct: 2,
      explanation: "401 Unauthorized = Authentifizierung fehlt/ungültig. 403 = keine Berechtigung, 404 = nicht gefunden, 200 = OK, 201 = Created.",
      theoryRef: "automation"
    }
  ],
  flashcards: [
    { front: "Northbound vs. Southbound API", back: "Controller ↔ Anwendungen (REST) vs. Controller ↔ Geräte (NETCONF, RESTCONF, OpenFlow)" },
    { front: "Underlay / Overlay / Fabric", back: "Physisches Netz / logische Tunnel (VXLAN) / beides zusammen (SD-Access)" },
    { front: "CRUD ↔ HTTP", back: "Create=POST, Read=GET, Update=PUT/PATCH, Delete=DELETE" },
    { front: "HTTP 200 / 201 / 401 / 404", back: "OK / Created / Unauthorized / Not Found" },
    { front: "REST-Authentifizierung", back: "Basic Auth, API-Key, Bearer Token (OAuth)" },
    { front: "Control Plane vs. Data Plane", back: "Entscheidungen (Routing, STP) vs. Weiterleitung der Pakete; SDN zentralisiert die Control Plane" }
  ]
});
