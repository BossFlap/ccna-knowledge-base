# CCNA 200-301 v1.1 — Knowledge Base

Eine komplette, offline nutzbare Lernplattform (reines HTML/CSS/JS, keine Abhängigkeiten) zur Vorbereitung auf die Cisco-Prüfung **CCNA 200-301 v1.1**.

## Was drin ist

- **38 Themen** entlang des offiziellen Blueprints v1.1 — jede der sechs Domänen ist vollständig abgedeckt (Network Fundamentals, Network Access, IP Connectivity, IP Services, Security Fundamentals, Automation & Programmability), inklusive der v1.1-Neuerungen (KI/ML im Netzwerkbetrieb, Terraform, Cloud-Managed-Zugriff).
- **Quiz pro Thema** mit Erklärungen und Link zur Theorie; Antwortoptionen werden gemischt, Ergebnisse gespeichert.
- **Flashcards pro Thema** mit Tastatursteuerung (Leertaste, Pfeiltasten, S = mischen).
- **Prüfungs-Guide**: Fakten zur Prüfung, Fragetypen, Pro-Tipps aus dem Cisco Certification Guide, Gewichtung der Domänen, Blueprint-Verben.
- **Blueprint-Checkliste**: alle 53 offiziellen Prüfungspunkte zum Abhaken, jeweils mit Verb-Stufe (Beschreiben / Interpretieren / Konfigurieren) und Links zu den passenden Themen.
- **10-Wochen-Lernplan** mit Fortschrittsanzeige.
- **Prüfungssimulation**: 20/40/60 Fragen, gezogen nach der offiziellen Domänengewichtung, mit Timer, kein Zurückblättern, Auswertung pro Domäne, Verlauf.
- **CLI-Cheatsheet**: über 180 IOS-Befehle nach Aufgabe gruppiert, durchsuchbar, Klick kopiert den Befehl.
- **Ressourcen & Glossar** aus dem offiziellen Cisco CCNA Certification Guide.
- **Volltextsuche** über alle Inhalte (Theorie-Abschnitte, Befehle, Glossar, Blueprint, Flashcards, Quizfragen): Suchfeld in der Kopfzeile mit Live-Vorschlägen, `Strg+K` oder `/` von überall, Treffer werden im Thema hervorgehoben.
- Inhaltsverzeichnis pro Thema, Kopier-Button auf jedem Code-Block, „Nach oben“-Button, Druckansicht.
- Dark Mode, Hash-Routing (Themen sind verlinkbar), Fortschritt im `localStorage`.

## Starten

Einfach `index.html` im Browser öffnen. Alternativ einen kleinen Webserver starten:

```bash
python -m http.server 8080
```

und `http://localhost:8080` aufrufen.

## Struktur

```
index.html            Grundgerüst, lädt Daten und App
css/style.css         Styles (inkl. Dark Mode)
js/data.js            Ursprüngliche 14 Kernthemen + Quiz + Flashcards + Registry-Helfer
js/topics/01-06*.js   Erweiterungen pro Domäne (registerTopic / extendTopic)
js/exam.js            Prüfungsfakten, Blueprint v1.1, Lernplan, Ressourcen, Glossar, CLI-Befehle
js/search.js          Volltextsuche (Index, Ranking, Ergebnisseite, Topbar-Dropdown), Topic-Enhancements
js/app.js             Rendering, Routing, Quiz, Flashcards, Guide, Simulation, Cheatsheet
```

### Neues Thema hinzufügen

In einer Datei unter `js/topics/`:

```js
registerTopic({
  id: "mein-thema", domain: "IP Services", domainPct: "10%", icon: "🧩",
  title: "Mein Thema", tags: ["Blueprint 4.x"],
  content: `<div class="content-section"><h3>…</h3></div>`
}, {
  after: "dns",                 // Position innerhalb der Domäne (oder before: "…")
  quiz: [{ q, options: [4], correct: 0, explanation, theoryRef: "mein-thema" }],
  flashcards: [{ front, back }]
});
```

Anschließend den Blueprint-Punkt in `js/exam.js` (`BLUEPRINT[…].items[…].refs`) auf die neue ID zeigen lassen.

## Quellen

- Cisco, *CCNA Exam v1.1 (200-301) Exam Topics*, 2024
- Cisco, *CCNA Certification Guide 2024 V8* (Study Guide, Exam Success, Resources, Vocabulary, CLI-Cheatsheet)
