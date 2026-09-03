// ===== Einstellungen, Export/Import des Lernstands, PWA (Installation, Updates), Einführung =====

const APP_VERSION = '5';
const STORAGE_KEYS = ['ccna-theme', 'ccna-progress', 'ccna-scores', 'ccna-blueprint', 'ccna-sim-history', 'ccna-srs', 'ccna-qhist',
  'ccna-activity', 'ccna-settings', 'ccna-last', 'ccna-subnet', 'ccna-sidebar', 'ccna-progress-v2', 'ccna-onboarded'];

// ---------- Export ----------
function exportData() {
  const data = {};
  STORAGE_KEYS.forEach(k => { const v = localStorage.getItem(k); if (v !== null) data[k] = v; });
  return { app: 'ccna-kb', version: APP_VERSION, exportedAt: new Date().toISOString(), data };
}
function exportJSON() { return JSON.stringify(exportData()); }
function downloadExport() {
  const blob = new Blob([JSON.stringify(exportData(), null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `ccna-lernstand-${dateKey()}.json`;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  showToast('📤 Lernstand als Datei exportiert');
}
async function copyExport() {
  const ta = document.getElementById('export-text');
  try {
    await navigator.clipboard.writeText(exportJSON());
    showToast('📋 Lernstand in die Zwischenablage kopiert — am anderen Gerät unter „Aus Text importieren“ einfügen');
  } catch (e) {
    if (ta) { ta.hidden = false; ta.value = exportJSON(); ta.focus(); ta.select(); showToast('Text ist markiert — mit Strg+C kopieren'); }
  }
}

// ---------- Import ----------
function parseImport(text) {
  let obj;
  try { obj = JSON.parse(text); } catch (e) { throw new Error('Kein gültiges JSON.'); }
  if (!obj || obj.app !== 'ccna-kb' || !obj.data) throw new Error('Das ist keine Export-Datei dieser Knowledge Base.');
  return obj;
}
function importFromFile(input) {
  const f = input.files && input.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => importText(r.result);
  r.readAsText(f);
}
function importFromTextarea() {
  const ta = document.getElementById('import-text');
  if (ta && ta.value.trim()) importText(ta.value); else showToast('Bitte zuerst den exportierten Text einfügen.');
}
function importText(text) {
  let obj;
  try { obj = parseImport(text); } catch (e) { showToast('❌ ' + e.message); return; }
  const mode = (document.querySelector('input[name=import-mode]:checked') || {}).value || 'merge';
  applyImport(obj, mode);
  showToast(`✅ Lernstand ${mode === 'merge' ? 'zusammengeführt' : 'ersetzt'} — Seite wird neu geladen`);
  setTimeout(() => location.reload(), 1000);
}
function applyImport(obj, mode) {
  const inc = obj.data;
  const get = k => { try { return JSON.parse(inc[k]); } catch (e) { return undefined; } };
  if (mode === 'replace') {
    STORAGE_KEYS.forEach(k => { if (k === 'ccna-theme') return; if (inc[k] !== undefined) localStorage.setItem(k, inc[k]); else localStorage.removeItem(k); });
    localStorage.setItem('ccna-progress-v2', '1'); localStorage.setItem('ccna-onboarded', '1');
    return;
  }
  const mergeObj = (k, fn) => { const a = loadJSON(k, {}), b = get(k) || {}; localStorage.setItem(k, JSON.stringify(fn(a, b))); };
  mergeObj('ccna-progress', (a, b) => Object.assign({}, a, b));
  mergeObj('ccna-blueprint', (a, b) => Object.assign({}, a, b));
  mergeObj('ccna-scores', (a, b) => { const o = { ...a }; Object.entries(b).forEach(([k, v]) => { o[k] = Math.max(o[k] ?? 0, v); }); return o; });
  mergeObj('ccna-srs', (a, b) => { const o = { ...a }; Object.entries(b).forEach(([k, v]) => { const cur = o[k]; if (!cur || (v.last || 0) > (cur.last || 0)) o[k] = v; }); return o; });
  mergeObj('ccna-qhist', (a, b) => {
    const o = { ...a };
    Object.entries(b).forEach(([k, v]) => {
      const cur = o[k]; if (!cur) { o[k] = v; return; }
      o[k] = { w: cur.w + v.w, r: cur.r + v.r, streak: Math.min(cur.streak, v.streak), pool: cur.pool || v.pool, lastWrong: Math.max(cur.lastWrong || 0, v.lastWrong || 0) };
    });
    return o;
  });
  mergeObj('ccna-activity', (a, b) => {
    const o = { ...a };
    Object.entries(b).forEach(([d, v]) => { const cur = o[d] || { cards: 0, questions: 0, topics: 0 }; o[d] = { cards: Math.max(cur.cards, v.cards || 0), questions: Math.max(cur.questions, v.questions || 0), topics: Math.max(cur.topics, v.topics || 0) }; });
    return o;
  });
  mergeObj('ccna-settings', (a, b) => Object.assign({}, a, b));
  mergeObj('ccna-subnet', (a, b) => {
    if (!b.total) return a; if (!a.total) return b;
    return { total: a.total + b.total, correct: a.correct + b.correct, timeSum: a.timeSum + b.timeSum, streak: 0, best: Math.max(a.best, b.best), byMode: a.byMode };
  });
  const hist = loadJSON('ccna-sim-history', []), inH = get('ccna-sim-history') || [];
  const seen = new Set(hist.map(h => h.date + h.total + h.pct));
  inH.forEach(h => { if (!seen.has(h.date + h.total + h.pct)) hist.push(h); });
  localStorage.setItem('ccna-sim-history', JSON.stringify(hist.slice(-30)));
  const la = loadJSON('ccna-last', null), lb = get('ccna-last');
  if (lb && (!la || (lb.ts || 0) > (la.ts || 0))) localStorage.setItem('ccna-last', JSON.stringify(lb));
  localStorage.setItem('ccna-progress-v2', '1'); localStorage.setItem('ccna-onboarded', '1');
}
function resetAllData() {
  if (!confirm('Wirklich ALLE Lerndaten löschen (Lesestatus, Quiz-Scores, Karten, Fehler-Pool, Verlauf)?\nTipp: vorher exportieren.')) return;
  STORAGE_KEYS.filter(k => k !== 'ccna-theme').forEach(k => localStorage.removeItem(k));
  localStorage.setItem('ccna-progress-v2', '1'); localStorage.setItem('ccna-onboarded', '1');
  location.reload();
}
function dataSummary() {
  return {
    topics: Object.keys(state.progress).length, scores: Object.keys(state.quizScores).length, bp: Object.keys(state.blueprint).length,
    cards: Object.keys(LEARN.srs).length, qhist: Object.keys(LEARN.qhist).length, days: Object.keys(LEARN.activity).length, sims: state.simHistory.length,
    bytes: exportJSON().length
  };
}

// ---------- PWA ----------
let deferredInstall = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstall = e;
  document.querySelectorAll('.install-btn').forEach(b => { b.hidden = false; });
});
window.addEventListener('appinstalled', () => { deferredInstall = null; showToast('📲 Installiert — die App liegt jetzt auf deinem Startbildschirm'); });
function isStandalone() { return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true; }
function installApp() {
  if (deferredInstall) { deferredInstall.prompt(); deferredInstall.userChoice.then(() => { deferredInstall = null; }); return; }
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  showToast(ios ? 'Safari: Teilen-Symbol → „Zum Home-Bildschirm“' : 'Browser-Menü (⋮) → „App installieren“ bzw. „Zum Startbildschirm hinzufügen“');
}
let swRegistration = null;
function registerSW() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  navigator.serviceWorker.register('sw.js').then(reg => {
    swRegistration = reg;
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      if (!nw) return;
      nw.addEventListener('statechange', () => { if (nw.state === 'installed' && navigator.serviceWorker.controller) showUpdateToast(); });
    });
  }).catch(() => {});
}
function showUpdateToast() {
  showToast('');
  const t = document.getElementById('toast');
  if (!t) return;
  t.innerHTML = '🔄 Neue Version verfügbar &nbsp;<button class="toast-btn" onclick="location.reload()">Jetzt laden</button>';
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 15000);
}
function checkForUpdates() {
  if (swRegistration) swRegistration.update().then(() => showToast('Nach Updates gesucht — falls vorhanden, erscheint ein Hinweis.'));
  else location.reload();
}

// ---------- Einstellungsseite ----------
function renderSettings() {
  state.currentView = 'settings';
  const s = dataSummary();
  const offline = !!(navigator.serviceWorker && navigator.serviceWorker.controller);
  document.getElementById('content-area').innerHTML = `
    <div id="settings-view" class="anim-in">
      <div class="topic-header">
        <h2>⚙️ Einstellungen & Daten</h2>
        <div class="th-meta"><span class="tag">Version ${APP_VERSION}</span><span class="tag">${isStandalone() ? '📲 Läuft als App' : '🌐 Läuft im Browser'}</span><span class="tag">${offline ? '✅ Offline verfügbar' : '⏳ Offline-Cache wird beim nächsten Laden aktiv'}</span></div>
      </div>

      <div class="content-section">
        <h3>🎯 Prüfung & Tagesziele</h3>
        <div class="settings-row">
          <label>Prüfungsdatum <input type="date" value="${LEARN.settings.examDate}" onchange="saveSettings({examDate: this.value})"></label>
          <label>Tagesziel Karten <input type="number" min="5" max="200" step="5" value="${LEARN.settings.dailyCards}" onchange="saveSettings({dailyCards: +this.value})"></label>
          <label>Tagesziel Quizfragen <input type="number" min="5" max="100" step="5" value="${LEARN.settings.dailyQuestions}" onchange="saveSettings({dailyQuestions: +this.value})"></label>
          <label>Neue Karten pro Session <input type="number" min="5" max="60" step="5" value="${LEARN.settings.newCards}" onchange="saveSettings({newCards: +this.value})"></label>
        </div>
      </div>

      <div class="content-section">
        <h3>🎨 Darstellung</h3>
        <div class="settings-actions">
          <button class="btn-secondary" onclick="toggleTheme(); renderSettings()">${state.theme === 'dark' ? '☀️ Helles Design' : '🌙 Dunkles Design'}</button>
          <button class="btn-secondary" onclick="setAllDomains(true)">Sidebar: alle Domänen einklappen</button>
          <button class="btn-secondary" onclick="setAllDomains(false)">Sidebar: alle ausklappen</button>
          <button class="btn-secondary" onclick="showOnboarding()">👋 Einführung erneut anzeigen</button>
        </div>
      </div>

      <div class="content-section">
        <h3>💾 Lernstand sichern & übertragen</h3>
        <p>Dein Fortschritt liegt nur in diesem Browser. Um ihn auf ein anderes Gerät zu bringen (z.B. PC ↔ Handy), exportierst du ihn hier und importierst ihn dort. Beim <strong>Zusammenführen</strong> bleibt auf beiden Seiten das Bessere erhalten (höhere Quiz-Scores, jüngere Kartenstände, alle gelesenen Themen).</p>
        <div class="data-summary">
          <span class="chip">📖 ${s.topics} Themen gelesen</span><span class="chip">🎯 ${s.scores} Quiz-Scores</span><span class="chip">✅ ${s.bp} Blueprint-Punkte</span>
          <span class="chip">🃏 ${s.cards} Karten im System</span><span class="chip">❓ ${s.qhist} Fragen-Historie</span><span class="chip">📅 ${s.days} Lerntage</span><span class="chip">🎓 ${s.sims} Simulationen</span><span class="chip">${(s.bytes / 1024).toFixed(1)} KB</span>
        </div>
        <h4>Exportieren</h4>
        <div class="settings-actions">
          <button class="btn-primary" onclick="downloadExport()">📤 Als Datei herunterladen</button>
          <button class="btn-secondary" onclick="copyExport()">📋 In die Zwischenablage kopieren</button>
        </div>
        <textarea id="export-text" class="data-text" hidden readonly></textarea>
        <h4>Importieren</h4>
        <div class="import-mode">
          <label><input type="radio" name="import-mode" value="merge" checked> Zusammenführen (empfohlen)</label>
          <label><input type="radio" name="import-mode" value="replace"> Ersetzen — alles Lokale wird überschrieben</label>
        </div>
        <div class="settings-actions">
          <label class="btn-secondary file-btn">📂 Datei auswählen <input type="file" accept=".json,application/json" onchange="importFromFile(this)" hidden></label>
        </div>
        <textarea id="import-text" class="data-text" placeholder="…oder den kopierten Export-Text hier einfügen"></textarea>
        <div class="settings-actions"><button class="btn-secondary" onclick="importFromTextarea()">📥 Aus Text importieren</button></div>
      </div>

      <div class="content-section">
        <h3>📲 App & Offline</h3>
        <p>Die Knowledge Base ist eine Progressive Web App: Einmal geladen, funktioniert sie auch ohne Internet, und sie lässt sich wie eine App auf dem Startbildschirm ablegen.</p>
        <div class="settings-actions">
          <button class="btn-primary install-btn" onclick="installApp()" ${isStandalone() ? 'hidden' : ''}>📲 Als App installieren</button>
          <button class="btn-secondary" onclick="checkForUpdates()">🔄 Nach Updates suchen</button>
        </div>
        <div class="callout callout-info"><strong>Installation</strong>Android/Chrome: Menü ⋮ → „App installieren“. iPhone/Safari: Teilen-Symbol → „Zum Home-Bildschirm“. Desktop Chrome/Edge: Symbol in der Adressleiste rechts.</div>
      </div>

      <div class="content-section">
        <h3>🗑️ Zurücksetzen</h3>
        <div class="settings-actions">
          <button class="btn-secondary" onclick="if(confirm('Lesestatus aller Themen zurücksetzen?')){state.progress={};save('ccna-progress',state.progress);renderSidebar();showToast('Lesestatus zurückgesetzt');}">Lesestatus zurücksetzen</button>
          <button class="btn-secondary" onclick="if(confirm('Alle Quiz-Scores löschen?')){state.quizScores={};save('ccna-scores',state.quizScores);renderSidebar();showToast('Quiz-Scores gelöscht');}">Quiz-Scores löschen</button>
          <button class="btn-secondary" onclick="if(confirm('Alle Karten auf „neu“ zurücksetzen?')){LEARN.srs={};saveJSON('ccna-srs',LEARN.srs);renderSidebar();showToast('Kartenstände zurückgesetzt');}">Kartenstände zurücksetzen</button>
          <button class="btn-secondary danger" onclick="resetAllData()">Alle Lerndaten löschen</button>
        </div>
      </div>
    </div>`;
  scrollTop();
}

// ---------- Einführung (erster Besuch) ----------
function maybeShowOnboarding() { if (!localStorage.getItem('ccna-onboarded')) showOnboarding(); }
function showOnboarding() {
  if (document.getElementById('onboarding')) return;
  const el = document.createElement('div');
  el.id = 'onboarding';
  el.innerHTML = `
    <div class="ob-card anim-in">
      <div class="ob-head"><div class="logo-icon">CC</div><div><h2>Willkommen in deiner CCNA-Lernplattform</h2><p>So holst du am meisten raus — in vier Schritten.</p></div></div>
      <div class="ob-steps">
        <div class="ob-step"><span class="ob-num">1</span><div><strong>📖 Thema lesen</strong><p>Links in der Sidebar, am besten in Blueprint-Reihenfolge. Ein Thema gilt als gelesen, wenn du genug Zeit darin verbracht und bis unten gescrollt hast.</p></div></div>
        <div class="ob-step"><span class="ob-num">2</span><div><strong>🎯 Quiz & 🃏 Karten</strong><p>Nach jedem Thema das Quiz machen und die Flashcards mit „Gewusst / Nicht gewusst“ bewerten. Falsche Fragen landen automatisch im Fehler-Pool.</p></div></div>
        <div class="ob-step"><span class="ob-num">3</span><div><strong>🔁 Täglich wiederholen</strong><p>Das Dashboard zeigt, welche Karten heute fällig sind. 10 Minuten am Tag reichen — der Streak hilft dranzubleiben.</p></div></div>
        <div class="ob-step"><span class="ob-num">4</span><div><strong>🧮 Subnetting & 🎓 Simulation</strong><p>Subnetting täglich ein paar Aufgaben, bis es unter einer Minute sitzt. Vor der Prüfung mehrere Simulationen mit 60 Fragen.</p></div></div>
      </div>
      <div class="ob-extra">
        <label>📅 Wann ist deine Prüfung? <input type="date" value="${LEARN.settings.examDate}" onchange="saveSettings({examDate: this.value})"></label>
        <span class="kbd-hint"><kbd>Strg</kbd>+<kbd>K</kbd> durchsucht alles · Auf dem Handy: ⚙️ Einstellungen → „Als App installieren“</span>
      </div>
      <div class="ob-actions">
        <button class="btn-secondary" onclick="closeOnboarding(); navigateTool('guide')">📋 Erst den Prüfungs-Guide lesen</button>
        <button class="btn-primary" onclick="closeOnboarding(); navigateTopic('network-components')">🚀 Mit Thema 1 starten</button>
        <button class="btn-secondary" onclick="closeOnboarding()">Schließen</button>
      </div>
    </div>`;
  document.body.appendChild(el);
}
function closeOnboarding() {
  localStorage.setItem('ccna-onboarded', '1');
  const el = document.getElementById('onboarding'); if (el) el.remove();
  if (state.currentView === 'home') renderHome();
}

// ---------- Sidebar-Domänen ----------
function setAllDomains(collapsed) {
  const o = {};
  if (collapsed) DOMAIN_ORDER.forEach(d => { o[d] = true; });
  saveJSON('ccna-sidebar', o);
  renderSidebar();
}
