// ===== CCNA Knowledge Base — App Logic =====

const state = {
  currentView: 'home',
  currentTopic: null,
  quizState: null,
  simState: null,
  flashcardIndex: 0,
  flashcardFlipped: false,
  flashcardOrder: null,
  theme: localStorage.getItem('ccna-theme') || 'light',
  progress: JSON.parse(localStorage.getItem('ccna-progress') || '{}'),
  quizScores: JSON.parse(localStorage.getItem('ccna-scores') || '{}'),
  blueprint: JSON.parse(localStorage.getItem('ccna-blueprint') || '{}'),
  simHistory: JSON.parse(localStorage.getItem('ccna-sim-history') || '[]'),
  suppressHash: false,
  pendingHighlight: null,
  lastQuery: '',
  searchResults: [],
  searchFilter: 'all'
};

const DOMAIN_ORDER = ['Network Fundamentals', 'Network Access', 'IP Connectivity', 'IP Services', 'Security Fundamentals', 'Automation & Programmability'];
const DOMAIN_ICONS = { 'Network Fundamentals': '🔗', 'Network Access': '🏷️', 'IP Connectivity': '🛤️', 'IP Services': '📋', 'Security Fundamentals': '🛡️', 'Automation & Programmability': '🤖' };

const TOOLS = [
  { id: 'search', icon: '🔍', title: 'Volltextsuche', short: 'Volltextsuche', desc: 'Begriffe, Protokolle, Ports und Befehle über alle Themen, Flashcards, Quizfragen und das Cheatsheet suchen.' },
  { id: 'guide', icon: '📋', title: 'Prüfungs-Guide & Blueprint', short: 'Prüfungs-Guide', desc: 'Fakten zur Prüfung, offizieller Blueprint als Checkliste, Lernplan, Ressourcen, Glossar.' },
  { id: 'sim', icon: '🎓', title: 'Prüfungssimulation', short: 'Simulation', desc: 'Gemischte Fragen aus allen Domänen, nach Prüfungsgewichtung, mit Timer und Auswertung.' },
  { id: 'commands', icon: '⌨️', title: 'CLI-Cheatsheet', short: 'CLI-Cheatsheet', desc: 'Alle prüfungsrelevanten IOS-Befehle nach Aufgabe gruppiert, durchsuchbar.' }
];

// ===== HELPERS =====
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function topicById(id) { return TOPICS.find(t => t.id === id); }
function domainsGrouped() {
  const domains = {};
  DOMAIN_ORDER.forEach(d => { domains[d] = []; });
  TOPICS.forEach(t => { if (!domains[t.domain]) domains[t.domain] = []; domains[t.domain].push(t); });
  Object.keys(domains).forEach(d => { if (!domains[d].length) delete domains[d]; });
  return domains;
}
function blueprintDomain(name) { return BLUEPRINT.find(d => d.name === name); }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function escapeAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
function setHash(h) {
  if (location.hash === '#' + h) return;
  state.suppressHash = true;
  location.hash = h;
}
function scrollTop() { const c = document.getElementById('content-area'); if (c) c.scrollTop = 0; }

// ===== INIT =====
function init() {
  applyTheme();
  renderSidebar();
  document.getElementById('sidebar-search').addEventListener('input', onSearch);
  document.getElementById('menu-toggle').addEventListener('click', toggleSidebar);
  document.getElementById('content-area').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
  });
  window.addEventListener('hashchange', () => {
    if (state.suppressHash) { state.suppressHash = false; return; }
    route();
  });
  document.addEventListener('keydown', onKeyDown);
  document.getElementById('sidebar-search').addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.value.trim()) { doSearch(e.target.value); e.target.value = ''; onSearch({ target: e.target }); }
  });
  document.getElementById('content-area').addEventListener('scroll', onContentScroll);
  buildSearchIndex();
  initGlobalSearch();
  route();
}

// ===== ROUTING (Hash) =====
function route() {
  const h = location.hash.replace(/^#/, '');
  const [view, id] = h.split('/');
  if (view === 'topic' && id && topicById(id)) return navigateTopic(id, true);
  if (view === 'quiz' && id && QUIZZES[id]) return startQuiz(id, true);
  if (view === 'flash' && id && FLASHCARDS[id]) return startFlashcards(id, true);
  if (view === 'guide') return navigateTool('guide', true);
  if (view === 'sim') return navigateTool('sim', true);
  if (view === 'commands') return navigateTool('commands', true);
  if (view === 'search') return renderSearch(decodeURIComponent(h.slice(7)), true);
  navigateHome(true);
}

// ===== THEME =====
function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  const btn = document.getElementById('dark-toggle');
  if (btn) btn.textContent = state.theme === 'dark' ? '☀️ Hell' : '🌙 Dunkel';
}
function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('ccna-theme', state.theme);
  applyTheme();
}

// ===== SIDEBAR =====
function renderSidebar() {
  const nav = document.getElementById('sidebar-nav');
  const domains = domainsGrouped();

  const tools = `
    <div class="domain-section">
      <div class="domain-label">Werkzeuge</div>
      ${TOOLS.map(t => `<div class="nav-item ${state.currentView === t.id ? 'active' : ''}" data-search="${escapeAttr(t.title + ' ' + t.desc)}" onclick="navigateTool('${t.id}')">
        <span class="topic-icon">${t.icon}</span><span class="topic-title">${t.short}</span>
      </div>`).join('')}
    </div>`;

  nav.innerHTML = tools + Object.entries(domains).map(([domain, topics]) => {
    const bp = blueprintDomain(domain);
    return `
    <div class="domain-section">
      <div class="domain-label">
        ${domain}
        <span class="domain-pct">${bp ? bp.weight + '%' : topics[0].domainPct}</span>
      </div>
      ${topics.map(t => {
        const done = state.progress[t.id];
        const score = state.quizScores[t.id];
        const badge = score !== undefined
          ? `<span class="topic-badge ${score >= 80 ? 'done' : score >= 60 ? 'ok' : 'low'}">${score}%</span>`
          : (done ? '<span class="topic-badge done">✓</span>' : '');
        return `<div class="nav-item ${state.currentView === 'topic' && state.currentTopic === t.id ? 'active' : ''}"
          data-search="${escapeAttr(t.title + ' ' + t.tags.join(' '))}" onclick="navigateTopic('${t.id}')">
          <span class="topic-icon">${t.icon}</span>
          <span class="topic-title">${t.title}</span>
          ${badge}
        </div>`;
      }).join('')}
    </div>`;
  }).join('');
}

function onSearch(e) {
  const q = e.target.value.toLowerCase().trim();
  document.querySelectorAll('.nav-item').forEach(el => {
    const hay = (el.dataset.search || el.textContent).toLowerCase();
    el.style.display = hay.includes(q) ? '' : 'none';
  });
  document.querySelectorAll('.domain-section').forEach(sec => {
    const visible = [...sec.querySelectorAll('.nav-item')].some(el => el.style.display !== 'none');
    sec.style.display = visible ? '' : 'none';
  });
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }

// ===== NAVIGATION =====
function navigateTopic(id, fromRoute) {
  if (!topicById(id)) return;
  state.currentTopic = id;
  state.currentView = 'topic';
  state.simState = null;
  document.getElementById('sidebar').classList.remove('open');
  if (!fromRoute) setHash('topic/' + id);
  renderSidebar();
  renderTopic(id);
}

function navigateHome(fromRoute) {
  state.currentTopic = null;
  state.currentView = 'home';
  state.simState = null;
  if (!fromRoute) setHash('home');
  renderSidebar();
  renderHome();
}

function navigateTool(tool, fromRoute) {
  state.currentTopic = null;
  state.currentView = tool;
  if (tool !== 'sim') state.simState = null;
  document.getElementById('sidebar').classList.remove('open');
  if (!fromRoute && tool !== 'search') setHash(tool);
  renderSidebar();
  if (tool === 'guide') renderGuide();
  else if (tool === 'sim') renderSim();
  else if (tool === 'commands') renderCommands();
  else if (tool === 'search') renderSearch(state.lastQuery || '', true);
}

function setBreadcrumb(parts) {
  document.getElementById('breadcrumb').innerHTML =
    parts.map((p, i) => i < parts.length - 1
      ? `<span class="bc-link" style="cursor:pointer" onclick="${p.action}">${p.label}</span><span class="bc-sep">›</span>`
      : `<span class="bc-current">${p.label}</span>`
    ).join('');
}

function updateTopbarActions(view, topicId) {
  const actions = document.getElementById('topbar-actions');
  const themeBtn = `<button class="btn-icon" id="dark-toggle" onclick="toggleTheme()">${state.theme === 'dark' ? '☀️ Hell' : '🌙 Dunkel'}</button>`;
  if (view === 'topic' && topicId) {
    actions.innerHTML = `
      ${QUIZZES[topicId] ? `<button class="btn-icon" onclick="startQuiz('${topicId}')">🎯 Quiz</button>` : ''}
      ${FLASHCARDS[topicId] ? `<button class="btn-icon" onclick="startFlashcards('${topicId}')">🃏 Flashcards</button>` : ''}
      ${themeBtn}`;
  } else {
    actions.innerHTML = themeBtn;
  }
}

// ===== STATS =====
function computeStats() {
  const totalTopics = TOPICS.length;
  const doneTopics = TOPICS.filter(t => state.progress[t.id]).length;
  const scored = TOPICS.filter(t => state.quizScores[t.id] !== undefined);
  const avgScore = scored.length ? Math.round(scored.reduce((a, t) => a + state.quizScores[t.id], 0) / scored.length) : 0;
  const totalQuestions = Object.values(QUIZZES).reduce((a, q) => a + q.length, 0);
  const totalCards = Object.values(FLASHCARDS).reduce((a, c) => a + c.length, 0);
  const bpItems = BLUEPRINT.reduce((a, d) => a + d.items.length, 0);
  const bpDone = BLUEPRINT.reduce((a, d) => a + d.items.filter(i => state.blueprint[i.num]).length, 0);
  return { totalTopics, doneTopics, quizzed: scored.length, avgScore, totalQuestions, totalCards, bpItems, bpDone };
}

function weakTopics(limit) {
  // Nicht gelesen oder Quiz < 80 % — sortiert nach Domänengewicht und Score
  const list = TOPICS.map(t => {
    const bp = blueprintDomain(t.domain);
    const score = state.quizScores[t.id];
    const read = !!state.progress[t.id];
    let priority = 0;
    if (!read) priority = 2;
    else if (score === undefined) priority = 1.5;
    else if (score < 60) priority = 3;
    else if (score < 80) priority = 1;
    return { t, score, read, priority, weight: bp ? bp.weight : 10 };
  }).filter(x => x.priority > 0)
    .sort((a, b) => (b.priority * b.weight) - (a.priority * a.weight));
  return list.slice(0, limit || 6);
}

// ===== HOME VIEW =====
function renderHome() {
  setBreadcrumb([{ label: 'CCNA Knowledge Base' }]);
  updateTopbarActions('home');
  const s = computeStats();
  const domains = domainsGrouped();
  const weak = weakTopics(6);
  const lastSim = state.simHistory.length ? state.simHistory[state.simHistory.length - 1] : null;

  document.getElementById('content-area').innerHTML = `
    <div id="home-view" class="anim-in">
      <div class="home-hero">
        <h2>CCNA 200-301 v1.1 — Wissensbase</h2>
        <p>Deine komplette Lernplattform für die CCNA-Prüfung: Theorie zu jedem Blueprint-Punkt, Quizze, Flashcards, Prüfungssimulation und CLI-Cheatsheet. Fortschritt wird lokal im Browser gespeichert.</p>
        <div class="hero-search">
          <input type="text" id="home-search" placeholder="🔍 Begriff, Protokoll, Port oder Befehl suchen …" autocomplete="off" onkeydown="if(event.key==='Enter'&&this.value.trim())doSearch(this.value)">
          <button onclick="var v=document.getElementById('home-search').value; if(v.trim()) doSearch(v)">Suchen</button>
        </div>
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-num">${s.doneTopics}/${s.totalTopics}</div><div class="stat-label">Themen gelesen</div></div>
          <div class="stat-card"><div class="stat-num">${s.quizzed}/${s.totalTopics}</div><div class="stat-label">Quizze absolviert</div></div>
          <div class="stat-card"><div class="stat-num">${s.avgScore > 0 ? s.avgScore + '%' : '—'}</div><div class="stat-label">Ø Quiz-Score</div></div>
          <div class="stat-card"><div class="stat-num">${s.bpDone}/${s.bpItems}</div><div class="stat-label">Blueprint-Punkte sicher</div></div>
          <div class="stat-card"><div class="stat-num">${lastSim ? lastSim.pct + '%' : '—'}</div><div class="stat-label">Letzte Simulation</div></div>
        </div>
      </div>

      <div class="section-title">🧭 Werkzeuge</div>
      <div class="tool-grid">
        ${TOOLS.map(t => `<div class="tool-card" onclick="navigateTool('${t.id}')">
          <div class="tool-icon">${t.icon}</div>
          <div><h3>${t.title}</h3><p>${t.desc}</p></div>
        </div>`).join('')}
      </div>

      <div class="home-columns">
        <div>
          <div class="section-title">📚 Lernbereiche</div>
          <div class="domains-overview">
            ${Object.entries(domains).map(([name, topics]) => {
              const bp = blueprintDomain(name);
              const done = topics.filter(t => state.progress[t.id]).length;
              const pct = Math.round((done / topics.length) * 100);
              const scored = topics.filter(t => state.quizScores[t.id] !== undefined);
              const avg = scored.length ? Math.round(scored.reduce((a, t) => a + state.quizScores[t.id], 0) / scored.length) : null;
              return `<div class="domain-card" onclick="navigateTopic('${topics[0].id}')" style="border-top:3px solid ${bp ? bp.color : 'var(--accent)'}">
                <div class="dc-header"><span class="dc-icon">${DOMAIN_ICONS[name] || topics[0].icon}</span><h3>${name}</h3></div>
                <div class="dc-sub">${bp ? bp.weight : topics[0].domainPct}% der Prüfung · ${bp ? bp.items.length + ' Blueprint-Punkte' : ''}</div>
                <div class="dc-topics">${topics.length} Themen · ${done} gelesen${avg !== null ? ` · Ø Quiz ${avg}%` : ''}</div>
                <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${bp ? bp.color : 'var(--accent)'}"></div></div>
              </div>`;
            }).join('')}
          </div>
        </div>
        <div>
          <div class="section-title">🎯 Als Nächstes empfohlen</div>
          <div class="reco-list">
            ${weak.length ? weak.map(w => `<div class="reco-item" onclick="navigateTopic('${w.t.id}')">
              <span class="topic-icon">${w.t.icon}</span>
              <div class="reco-text"><strong>${w.t.title}</strong><span>${!w.read ? 'Noch nicht gelesen' : w.score === undefined ? 'Quiz noch offen' : 'Quiz: ' + w.score + '% — wiederholen'}</span></div>
              <span class="chip" style="background:${blueprintDomain(w.t.domain)?.color || 'var(--accent)'}22;color:${blueprintDomain(w.t.domain)?.color || 'var(--accent)'}">${blueprintDomain(w.t.domain)?.weight || ''}%</span>
            </div>`).join('') : '<div class="callout callout-tip"><strong>Stark!</strong>Alle Themen gelesen und alle Quizze ≥ 80 %. Zeit für die Prüfungssimulation.</div>'}
          </div>
          <div class="section-title" style="margin-top:24px">📌 Prüfung auf einen Blick</div>
          <div class="facts-mini">
            ${EXAM_INFO.facts.slice(0, 4).map(f => `<div class="fact-mini"><span>${f.icon}</span><div><div class="fm-label">${f.label}</div><div class="fm-value">${f.value}</div></div></div>`).join('')}
          </div>
          <button class="btn-secondary" style="margin-top:12px;width:100%" onclick="navigateTool('guide')">📋 Zum Prüfungs-Guide →</button>
        </div>
      </div>
    </div>
  `;
  scrollTop();
}

// ===== TOPIC VIEW =====
function renderTopic(id) {
  const topic = topicById(id);
  if (!topic) return;

  state.progress[id] = true;
  save('ccna-progress', state.progress);
  renderSidebar();

  setBreadcrumb([
    { label: 'Home', action: "navigateHome()" },
    { label: topic.domain, action: `navigateTopic('${id}')` },
    { label: topic.title }
  ]);
  updateTopbarActions('topic', id);

  const hasQuiz = QUIZZES[id] && QUIZZES[id].length > 0;
  const hasFlash = FLASHCARDS[id] && FLASHCARDS[id].length > 0;
  const score = state.quizScores[id];
  const bp = blueprintDomain(topic.domain);
  const bpItems = BLUEPRINT.flatMap(d => d.items).filter(i => i.refs.includes(id));

  // Vorheriges / nächstes Thema
  const idx = TOPICS.findIndex(t => t.id === id);
  const prev = idx > 0 ? TOPICS[idx - 1] : null;
  const next = idx < TOPICS.length - 1 ? TOPICS[idx + 1] : null;

  document.getElementById('content-area').innerHTML = `
    <div id="topic-view" class="anim-in">
      <div class="topic-header" style="border-left:4px solid ${bp ? bp.color : 'var(--accent)'}">
        <h2>${topic.icon} ${topic.title}</h2>
        <div class="th-meta">
          <span class="tag">📁 ${topic.domain}</span>
          <span class="tag">🎯 ${bp ? bp.weight + '%' : topic.domainPct} der Prüfung</span>
          ${topic.tags.map(tg => `<span class="tag">${tg}</span>`).join('')}
          ${score !== undefined ? `<span class="tag" style="background:var(--success-bg);color:var(--success)">Quiz: ${score}%</span>` : ''}
        </div>
        ${bpItems.length ? `<div class="bp-refs">Blueprint: ${bpItems.map(i => `<span class="chip chip-link" title="${escapeAttr(i.text)}" onclick="navigateTool('guide');setTimeout(()=>scrollToBlueprint('${i.num}'),50)">${i.num} · ${VERB_LEVELS[i.verb].label}${i.isNew ? ' · NEU' : ''}</span>`).join('')}</div>` : ''}
      </div>

      <div id="topic-toc"></div>
      ${topic.content}

      <div class="topic-actions">
        ${hasQuiz ? `<button class="btn-primary" onclick="startQuiz('${id}')">🎯 Quiz starten (${QUIZZES[id].length} Fragen)</button>` : ''}
        ${hasFlash ? `<button class="btn-secondary" onclick="startFlashcards('${id}')">🃏 Flashcards (${FLASHCARDS[id].length})</button>` : ''}
        ${bpItems.length ? `<button class="btn-secondary" onclick="toggleBlueprintFromTopic('${id}')">${bpItems.every(i => state.blueprint[i.num]) ? '☑ Blueprint-Punkte als sicher markiert' : '☐ Blueprint-Punkte als sicher markieren'}</button>` : ''}
      </div>
      <div class="topic-nav">
        ${prev ? `<button class="btn-secondary" onclick="navigateTopic('${prev.id}')">← ${prev.icon} ${prev.title}</button>` : '<span></span>'}
        ${next ? `<button class="btn-secondary" onclick="navigateTopic('${next.id}')">${next.icon} ${next.title} →</button>` : '<span></span>'}
      </div>
    </div>
  `;
  enhanceTopicView(id);
  scrollTop();
}

function toggleBlueprintFromTopic(topicId) {
  const items = BLUEPRINT.flatMap(d => d.items).filter(i => i.refs.includes(topicId));
  const allDone = items.every(i => state.blueprint[i.num]);
  items.forEach(i => { if (allDone) delete state.blueprint[i.num]; else state.blueprint[i.num] = true; });
  save('ccna-blueprint', state.blueprint);
  renderTopic(topicId);
}

// ===== QUIZ =====
function startQuiz(topicId, fromRoute) {
  const topic = topicById(topicId);
  const questions = QUIZZES[topicId];
  if (!questions) return;
  state.currentView = 'quiz';
  state.currentTopic = topicId;
  if (!fromRoute) setHash('quiz/' + topicId);

  state.quizState = {
    topicId, topicTitle: topic.title,
    questions: shuffle(questions).map(shuffleOptions),
    current: 0, answers: [], answered: false
  };

  setBreadcrumb([
    { label: 'Home', action: "navigateHome()" },
    { label: topic.domain },
    { label: topic.title, action: `navigateTopic('${topicId}')` },
    { label: 'Quiz' }
  ]);
  updateTopbarActions('quiz');
  renderSidebar();
  renderQuizQuestion();
}

function shuffleOptions(q) {
  const idx = shuffle(q.options.map((_, i) => i));
  return { ...q, options: idx.map(i => q.options[i]), correct: idx.indexOf(q.correct) };
}

function renderQuizQuestion() {
  const qs = state.quizState;
  const q = qs.questions[qs.current];
  const total = qs.questions.length;
  const pct = Math.round((qs.current / total) * 100);
  const letters = ['A', 'B', 'C', 'D'];

  document.getElementById('content-area').innerHTML = `
    <div id="quiz-view" class="anim-in">
      <div class="quiz-header">
        <h2>🎯 ${qs.topicTitle} — Quiz</h2>
        <div class="quiz-meta">
          <span>Frage ${qs.current + 1} von ${total}</span><span>·</span>
          <span>${qs.answers.filter(a => a.correct).length} richtig</span><span>·</span>
          <span class="kbd-hint">Tasten <kbd>1</kbd>–<kbd>4</kbd> antworten, <kbd>Enter</kbd> weiter</span>
        </div>
        <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${pct}%"></div></div>
      </div>

      <div class="question-card">
        <div class="question-num">Frage ${qs.current + 1}</div>
        <div class="question-text">${q.q}</div>
        <div class="options-list" id="options-list">
          ${q.options.map((opt, i) => `
            <button class="option-btn" onclick="selectAnswer(${i})" id="opt-${i}">
              <span class="opt-letter">${letters[i]}</span>${opt}
            </button>`).join('')}
        </div>
        <div class="feedback-box" id="feedback-box"></div>
      </div>

      <div class="quiz-controls">
        <button class="btn-secondary" onclick="navigateTopic('${qs.topicId}')">← Zurück zur Theorie</button>
        <button class="btn-primary" id="next-btn" onclick="nextQuestion()" disabled>
          ${qs.current < total - 1 ? 'Weiter →' : 'Ergebnis anzeigen'}
        </button>
      </div>
    </div>
  `;
  state.quizState.answered = false;
  scrollTop();
}

function selectAnswer(index) {
  if (!state.quizState || state.quizState.answered) return;
  state.quizState.answered = true;

  const qs = state.quizState;
  const q = qs.questions[qs.current];
  const isCorrect = index === q.correct;
  const letters = ['A', 'B', 'C', 'D'];
  qs.answers.push({ correct: isCorrect, q, chosen: index });

  const opts = document.querySelectorAll('.option-btn');
  opts.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add(isCorrect ? 'correct' : 'show-correct');
    if (i === index && !isCorrect) btn.classList.add('wrong');
  });

  const fb = document.getElementById('feedback-box');
  fb.classList.add('visible');
  if (isCorrect) {
    fb.classList.add('correct-fb');
    fb.innerHTML = `<div class="fb-title">✅ Richtig!</div><div>${q.explanation}</div>`;
  } else {
    fb.classList.add('wrong-fb');
    fb.innerHTML = `
      <div class="fb-title">❌ Nicht ganz — richtig wäre: ${letters[q.correct]}</div>
      <div>${q.explanation}</div>
      <span class="theory-link" onclick="navigateTopic('${q.theoryRef}')">📖 Theorie nachschlagen →</span>`;
  }
  document.getElementById('next-btn').disabled = false;
}

function nextQuestion() {
  const qs = state.quizState;
  if (!qs || !qs.answered) return;
  qs.current++;
  if (qs.current >= qs.questions.length) showQuizResult();
  else renderQuizQuestion();
}

function showQuizResult() {
  const qs = state.quizState;
  const correct = qs.answers.filter(a => a.correct).length;
  const total = qs.questions.length;
  const pct = Math.round((correct / total) * 100);

  state.quizScores[qs.topicId] = pct;
  save('ccna-scores', state.quizScores);
  renderSidebar();

  const scoreClass = pct >= 80 ? 'great' : pct >= 60 ? 'ok' : 'poor';
  const scoreMsg = pct >= 80 ? '🎉 Ausgezeichnet!' : pct >= 60 ? '👍 Gut — noch etwas üben!' : '📖 Theorie nochmals wiederholen!';
  const scoreSub = pct >= 80 ? 'Du hast das Thema gut im Griff.' : pct >= 60 ? 'Schau dir die falsch beantworteten Fragen nochmals an.' : 'Lies die Theorie durch und versuche das Quiz erneut.';
  const wrong = qs.answers.filter(a => !a.correct);

  document.getElementById('content-area').innerHTML = `
    <div id="quiz-view" class="anim-in">
      <div class="quiz-result">
        <div class="result-score ${scoreClass}">${pct}%</div>
        <div class="result-label">${scoreMsg}</div>
        <div class="result-sub">${scoreSub}</div>
        <div class="result-breakdown">
          <div class="result-stat"><div class="rs-num rs-correct">${correct}</div><div class="rs-label">Richtig</div></div>
          <div class="result-stat"><div class="rs-num rs-wrong">${total - correct}</div><div class="rs-label">Falsch</div></div>
          <div class="result-stat"><div class="rs-num">${total}</div><div class="rs-label">Gesamt</div></div>
        </div>
        <div class="result-actions">
          <button class="btn-secondary" onclick="navigateTopic('${qs.topicId}')">📖 Theorie anzeigen</button>
          <button class="btn-primary" onclick="startQuiz('${qs.topicId}')">🔁 Quiz wiederholen</button>
          <button class="btn-secondary" onclick="navigateHome()">🏠 Home</button>
        </div>
      </div>
      ${wrong.length ? `<div class="section-title" style="margin-top:28px">📝 Falsch beantwortet</div>${renderReviewList(wrong)}` : ''}
    </div>
  `;
  scrollTop();
}

function renderReviewList(items) {
  const letters = ['A', 'B', 'C', 'D'];
  return `<div class="review-list">${items.map(a => `
    <div class="review-item">
      <div class="review-q">${a.q.q}</div>
      <div class="review-a wrong">✗ Deine Antwort: ${letters[a.chosen]} — ${a.q.options[a.chosen]}</div>
      <div class="review-a right">✓ Richtig: ${letters[a.q.correct]} — ${a.q.options[a.q.correct]}</div>
      <div class="review-exp">${a.q.explanation}</div>
      <span class="theory-link" onclick="navigateTopic('${a.q.theoryRef}')">📖 ${topicById(a.q.theoryRef)?.title || 'Theorie'} →</span>
    </div>`).join('')}</div>`;
}

// ===== FLASHCARDS =====
function startFlashcards(topicId, fromRoute) {
  const topic = topicById(topicId);
  const cards = FLASHCARDS[topicId];
  if (!cards) return;
  state.currentView = 'flash';
  state.currentTopic = topicId;
  state.flashcardIndex = 0;
  state.flashcardFlipped = false;
  state.flashcardOrder = cards.map((_, i) => i);
  if (!fromRoute) setHash('flash/' + topicId);

  setBreadcrumb([
    { label: 'Home', action: "navigateHome()" },
    { label: topic.title, action: `navigateTopic('${topicId}')` },
    { label: 'Flashcards' }
  ]);
  updateTopbarActions('quiz');
  renderSidebar();
  renderFlashcard(topicId);
}

function renderFlashcard(topicId) {
  const cards = FLASHCARDS[topicId];
  const order = state.flashcardOrder || cards.map((_, i) => i);
  const card = cards[order[state.flashcardIndex]];
  const total = cards.length;

  document.getElementById('content-area').innerHTML = `
    <div id="flashcard-view" class="anim-in">
      <div class="section-title">🃏 Flashcards — ${topicById(topicId).title}</div>
      <p class="kbd-hint" style="margin-bottom:16px;">Klicke auf die Karte oder drücke <kbd>Leertaste</kbd> zum Umdrehen · <kbd>←</kbd> <kbd>→</kbd> blättern · <kbd>S</kbd> mischen</p>

      <div class="flashcard-container">
        <div class="flashcard ${state.flashcardFlipped ? 'flipped' : ''}" onclick="flipCard('${topicId}')">
          <div class="flashcard-front"><div class="fc-hint">Begriff</div><div class="fc-text">${card.front}</div></div>
          <div class="flashcard-back"><div class="fc-hint" style="color:rgba(255,255,255,0.6)">Antwort</div><div class="fc-text">${card.back}</div></div>
        </div>
      </div>

      <div class="fc-nav" style="margin-top:24px;">
        <button class="btn-secondary" onclick="prevCard('${topicId}')" ${state.flashcardIndex === 0 ? 'disabled' : ''}>← Zurück</button>
        <span class="fc-counter">${state.flashcardIndex + 1} / ${total}</span>
        <button class="btn-primary" onclick="nextCard('${topicId}')" ${state.flashcardIndex === total - 1 ? 'disabled' : ''}>Weiter →</button>
      </div>
      <div class="fc-nav" style="margin-top:16px;">
        <button class="btn-secondary" onclick="shuffleCards('${topicId}')">🔀 Mischen</button>
        <button class="btn-secondary" onclick="navigateTopic('${topicId}')">← Zurück zur Theorie</button>
        ${QUIZZES[topicId] ? `<button class="btn-secondary" onclick="startQuiz('${topicId}')">🎯 Quiz</button>` : ''}
      </div>
    </div>
  `;
}

function flipCard(topicId) { state.flashcardFlipped = !state.flashcardFlipped; renderFlashcard(topicId); }
function nextCard(topicId) {
  if (state.flashcardIndex >= FLASHCARDS[topicId].length - 1) return;
  state.flashcardIndex++; state.flashcardFlipped = false; renderFlashcard(topicId);
}
function prevCard(topicId) {
  if (state.flashcardIndex <= 0) return;
  state.flashcardIndex--; state.flashcardFlipped = false; renderFlashcard(topicId);
}
function shuffleCards(topicId) {
  state.flashcardOrder = shuffle(FLASHCARDS[topicId].map((_, i) => i));
  state.flashcardIndex = 0; state.flashcardFlipped = false; renderFlashcard(topicId);
}

// ===== KEYBOARD =====
function onKeyDown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); focusGlobalSearch(); return; }
  if (e.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
  if (e.key === '/') { e.preventDefault(); focusGlobalSearch(); return; }
  if (e.key === 'Escape' && state.currentView === 'topic') { clearHighlights(); return; }
  if (state.currentView === 'flash' && state.currentTopic) {
    if (e.code === 'Space' || e.key === 'Enter') { e.preventDefault(); flipCard(state.currentTopic); }
    else if (e.key === 'ArrowRight') nextCard(state.currentTopic);
    else if (e.key === 'ArrowLeft') prevCard(state.currentTopic);
    else if (e.key.toLowerCase() === 's') shuffleCards(state.currentTopic);
  } else if (state.currentView === 'quiz' && state.quizState) {
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) selectAnswer(n - 1);
    else if (['a', 'b', 'c', 'd'].includes(e.key.toLowerCase())) selectAnswer('abcd'.indexOf(e.key.toLowerCase()));
    else if (e.key === 'Enter') nextQuestion();
  } else if (state.currentView === 'sim' && state.simState && state.simState.phase === 'run') {
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) simSelect(n - 1);
    else if (['a', 'b', 'c', 'd'].includes(e.key.toLowerCase())) simSelect('abcd'.indexOf(e.key.toLowerCase()));
    else if (e.key === 'Enter') simNext();
  }
}

// ===== PRÜFUNGS-GUIDE =====
function renderGuide() {
  setBreadcrumb([{ label: 'Home', action: "navigateHome()" }, { label: 'Prüfungs-Guide & Blueprint' }]);
  updateTopbarActions('guide');
  const s = computeStats();
  const bpPct = Math.round((s.bpDone / s.bpItems) * 100);

  document.getElementById('content-area').innerHTML = `
    <div id="guide-view" class="anim-in">
      <div class="topic-header">
        <h2>📋 Prüfungs-Guide — CCNA ${EXAM_INFO.code} ${EXAM_INFO.version}</h2>
        <div class="th-meta"><span class="tag">${EXAM_INFO.title}</span></div>
      </div>

      <div class="guide-tabs">
        <button class="guide-tab active" data-tab="facts" onclick="switchGuideTab('facts')">📌 Fakten & Tipps</button>
        <button class="guide-tab" data-tab="blueprint" onclick="switchGuideTab('blueprint')">✅ Blueprint-Checkliste (${bpPct}%)</button>
        <button class="guide-tab" data-tab="plan" onclick="switchGuideTab('plan')">🗓️ Lernplan</button>
        <button class="guide-tab" data-tab="resources" onclick="switchGuideTab('resources')">🔗 Ressourcen</button>
        <button class="guide-tab" data-tab="glossary" onclick="switchGuideTab('glossary')">📖 Glossar</button>
      </div>

      <div class="guide-panel" id="gp-facts">${renderGuideFacts()}</div>
      <div class="guide-panel hidden" id="gp-blueprint">${renderBlueprint()}</div>
      <div class="guide-panel hidden" id="gp-plan">${renderStudyPlan()}</div>
      <div class="guide-panel hidden" id="gp-resources">${renderResources()}</div>
      <div class="guide-panel hidden" id="gp-glossary">${renderGlossary()}</div>
    </div>
  `;
  scrollTop();
}

function switchGuideTab(tab) {
  document.querySelectorAll('.guide-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.guide-panel').forEach(p => p.classList.toggle('hidden', p.id !== 'gp-' + tab));
}

function renderGuideFacts() {
  return `
    <div class="content-section">
      <h3>📌 Die Prüfung in Zahlen</h3>
      <div class="facts-grid">
        ${EXAM_INFO.facts.map(f => `<div class="fact"><div class="fact-icon">${f.icon}</div><div class="fact-label">${f.label}</div><div class="fact-value">${f.value}</div>${f.hint ? `<div class="fact-hint">${f.hint}</div>` : ''}</div>`).join('')}
      </div>
    </div>

    <div class="content-section">
      <h3>⚖️ Gewichtung der sechs Domänen</h3>
      <div class="weight-bar">
        ${BLUEPRINT.map(d => `<div class="weight-seg" style="flex:${d.weight};background:${d.color}" title="${d.name} — ${d.weight}%"><span>${d.weight}%</span></div>`).join('')}
      </div>
      <div class="weight-legend">
        ${BLUEPRINT.map(d => {
          const topics = TOPICS.filter(t => t.domain === d.name);
          const read = topics.filter(t => state.progress[t.id]).length;
          const done = d.items.filter(i => state.blueprint[i.num]).length;
          return `<div class="weight-row" onclick="navigateTopic('${topics[0]?.id}')">
            <span class="weight-dot" style="background:${d.color}"></span>
            <span class="weight-name">${d.num} ${d.name}</span>
            <span class="weight-meta">${d.weight}% · ${d.items.length} Punkte · ${topics.length} Themen · ${read} gelesen · ${done}/${d.items.length} sicher</span>
          </div>`;
        }).join('')}
      </div>
      <div class="callout callout-info"><strong>Rechenbeispiel</strong>Bei ~100 Fragen entfallen etwa 25 auf IP Connectivity, je 20 auf Network Fundamentals und Network Access, 15 auf Security und je 10 auf IP Services und Automation. Subnetting und Routing alleine sind also fast die Hälfte.</div>
    </div>

    <div class="content-section">
      <h3>❓ Fragetypen</h3>
      <div class="table-wrap"><table>
        <tr><th>Typ</th><th>Was dich erwartet</th></tr>
        ${EXAM_INFO.questionTypes.map(q => `<tr><td><strong>${q.type}</strong></td><td>${q.desc}</td></tr>`).join('')}
      </table></div>
    </div>

    <div class="content-section">
      <h3>💡 Pro-Tipps (aus dem Cisco Certification Guide)</h3>
      <div class="tips-grid">
        ${EXAM_INFO.proTips.map(t => `<div class="tip-card"><div class="tip-icon">${t.icon}</div><h4>${t.title}</h4><p>${t.text}</p></div>`).join('')}
      </div>
    </div>

    <div class="content-section">
      <h3>🔤 Blueprint-Verben verstehen</h3>
      <p>Jeder Blueprint-Punkt beginnt mit einem Verb. Es verrät dir, wie tief du das Thema beherrschen musst:</p>
      <div class="table-wrap"><table>
        <tr><th>Stufe</th><th>Verben</th><th>Bedeutung</th><th>So lernst du</th></tr>
        <tr><td><span class="verb-badge lvl1">Stufe 1</span></td><td>Describe, Explain, Compare, Define, Recognize</td><td>Konzepte kennen und erklären können</td><td>Theorie lesen, Flashcards, Vergleichstabellen</td></tr>
        <tr><td><span class="verb-badge lvl2">Stufe 2</span></td><td>Interpret, Identify, Determine, Verify</td><td>Ausgaben von show-Befehlen / GUI lesen und Schlüsse ziehen</td><td>Beispiel-Ausgaben in dieser KB analysieren, im Lab show-Befehle ausführen</td></tr>
        <tr><td><span class="verb-badge lvl3">Stufe 3</span></td><td>Configure and Verify</td><td>Selbst konfigurieren, Fehler finden — Lab-Items in der Prüfung!</td><td>Jede Konfiguration in Packet Tracer / CML nachbauen, bis sie ohne Nachschauen sitzt</td></tr>
      </table></div>
    </div>`;
}

function renderBlueprint() {
  const s = computeStats();
  return `
    <div class="content-section">
      <h3>✅ Offizieller Blueprint als Checkliste</h3>
      <p>Hake jeden Punkt ab, sobald du ihn <em>sicher</em> beherrschst (Theorie gelesen, Quiz ≥ 80 %, im Lab geübt). Die Chips führen zu den passenden Themen in der Knowledge Base.</p>
      <div class="bp-overall">
        <div class="progress-bar" style="height:10px"><div class="progress-fill" style="width:${Math.round((s.bpDone / s.bpItems) * 100)}%"></div></div>
        <div class="bp-overall-label">${s.bpDone} von ${s.bpItems} Punkten als sicher markiert (${Math.round((s.bpDone / s.bpItems) * 100)}%)</div>
        <button class="btn-secondary" onclick="resetBlueprint()">Zurücksetzen</button>
      </div>
    </div>
    ${BLUEPRINT.map(d => {
      const done = d.items.filter(i => state.blueprint[i.num]).length;
      return `<div class="content-section bp-domain" style="border-left:4px solid ${d.color}">
        <h3><span style="color:${d.color}">${d.num}</span> ${d.name} <span class="domain-pct-inline" style="background:${d.color}">${d.weight}%</span><span class="bp-domain-progress">${done}/${d.items.length}</span></h3>
        <div class="progress-bar"><div class="progress-fill" style="width:${Math.round((done / d.items.length) * 100)}%;background:${d.color}"></div></div>
        ${d.items.map(i => renderBlueprintItem(i)).join('')}
      </div>`;
    }).join('')}`;
}

function renderBlueprintItem(i) {
  const v = VERB_LEVELS[i.verb];
  const checked = !!state.blueprint[i.num];
  const refs = i.refs.map(r => topicById(r)).filter(Boolean);
  const scores = refs.map(t => state.quizScores[t.id]).filter(x => x !== undefined);
  const best = scores.length ? Math.max(...scores) : null;
  return `<div class="bp-item ${checked ? 'checked' : ''}" id="bp-${i.num.replace('.', '-')}">
    <label class="bp-check"><input type="checkbox" ${checked ? 'checked' : ''} onchange="toggleBlueprint('${i.num}')"><span></span></label>
    <div class="bp-body">
      <div class="bp-head">
        <span class="bp-num">${i.num}</span>
        <span class="verb-badge lvl${v.level}">${v.label}</span>
        ${i.isNew ? '<span class="verb-badge new">NEU in v1.1</span>' : ''}
        ${best !== null ? `<span class="chip ${best >= 80 ? 'chip-good' : best >= 60 ? 'chip-ok' : 'chip-low'}">Quiz ${best}%</span>` : ''}
      </div>
      <div class="bp-text">${i.text}</div>
      ${i.sub ? `<ul class="bp-sub">${i.sub.map(sx => `<li>${sx}</li>`).join('')}</ul>` : ''}
      <div class="bp-refs">${refs.map(t => `<span class="chip chip-link" onclick="navigateTopic('${t.id}')">${t.icon} ${t.title}${state.progress[t.id] ? ' ✓' : ''}</span>`).join('')}</div>
    </div>
  </div>`;
}

function toggleBlueprint(num) {
  if (state.blueprint[num]) delete state.blueprint[num]; else state.blueprint[num] = true;
  save('ccna-blueprint', state.blueprint);
  const panel = document.getElementById('gp-blueprint');
  if (panel) panel.innerHTML = renderBlueprint();
  const tab = document.querySelector('.guide-tab[data-tab="blueprint"]');
  const s = computeStats();
  if (tab) tab.textContent = `✅ Blueprint-Checkliste (${Math.round((s.bpDone / s.bpItems) * 100)}%)`;
}
function resetBlueprint() {
  if (!confirm('Alle Blueprint-Häkchen zurücksetzen?')) return;
  state.blueprint = {}; save('ccna-blueprint', state.blueprint);
  const panel = document.getElementById('gp-blueprint');
  if (panel) panel.innerHTML = renderBlueprint();
}
function scrollToBlueprint(num) {
  switchGuideTab('blueprint');
  const el = document.getElementById('bp-' + num.replace('.', '-'));
  if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('highlight'); setTimeout(() => el.classList.remove('highlight'), 2000); }
}

function renderStudyPlan() {
  return `
    <div class="content-section">
      <h3>🗓️ 10-Wochen-Lernplan</h3>
      <p>Ein realistischer Plan bei ~8–10 Stunden pro Woche. Jede Woche: Theorie lesen → Quiz bis ≥ 80 % → Flashcards → Konfigurationen im Lab nachbauen. Passe das Tempo an dein Vorwissen an.</p>
      <div class="plan-list">
        ${EXAM_INFO.studyPlan.map(w => {
          const topics = w.topics.map(id => topicById(id)).filter(Boolean);
          const read = topics.filter(t => state.progress[t.id]).length;
          const pct = topics.length ? Math.round((read / topics.length) * 100) : 0;
          return `<div class="plan-week">
            <div class="plan-num">W${w.week}</div>
            <div class="plan-body">
              <div class="plan-title">${w.title} ${topics.length ? `<span class="plan-progress">${read}/${topics.length} gelesen</span>` : ''}</div>
              <div class="plan-goal">🎯 ${w.goal}</div>
              <div class="bp-refs">${topics.map(t => `<span class="chip chip-link" onclick="navigateTopic('${t.id}')">${t.icon} ${t.title}${state.quizScores[t.id] !== undefined ? ` · ${state.quizScores[t.id]}%` : state.progress[t.id] ? ' ✓' : ''}</span>`).join('')}
              ${!topics.length ? `<span class="chip chip-link" onclick="navigateTool('sim')">🎓 Prüfungssimulation starten</span>` : ''}</div>
              ${topics.length ? `<div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
    <div class="content-section">
      <h3>📆 Die letzte Woche vor der Prüfung</h3>
      <ul>
        <li><strong>Tag 7–5:</strong> Zwei Simulationen mit 60 Fragen. Jede falsche Frage → Theorie lesen → Blueprint-Punkt nochmals prüfen.</li>
        <li><strong>Tag 4–3:</strong> Labs: VLAN + Trunk + Inter-VLAN, OSPF Single Area, NAT/PAT, ACL, DHCP, SSH, Port Security, DHCP Snooping — jeweils ohne Nachschauen konfigurieren.</li>
        <li><strong>Tag 2:</strong> Alle Flashcards durchgehen (Ports, AD-Werte, Timer, Syslog-Levels, Wildcard-Masken). Subnetting-Aufgaben unter Zeitdruck.</li>
        <li><strong>Tag 1:</strong> Nur noch leicht wiederholen, Systemcheck für Online-Prüfung bzw. Anfahrt planen, Ausweis bereitlegen, früh schlafen.</li>
        <li><strong>Prüfungstag:</strong> Fragen genau lesen („choose two“!), Lab-Items zuerst grob verstehen, dann konfigurieren und mit show-Befehlen verifizieren. Kein Zurückblättern — entscheiden und weiter.</li>
      </ul>
    </div>`;
}

function renderResources() {
  return `
    <div class="content-section">
      <h3>🔗 Offizielle Lernressourcen</h3>
      <p>Zusammengestellt aus dem Cisco CCNA Certification Guide. Alle Links öffnen sich in einem neuen Tab.</p>
    </div>
    ${RESOURCES.map(g => `<div class="content-section">
      <h3>${g.group}</h3>
      <div class="res-list">
        ${g.items.map(r => `<a class="res-item" href="${r.url}" target="_blank" rel="noopener">
          <div class="res-name">${r.name} ↗</div><div class="res-desc">${r.desc}</div>
        </a>`).join('')}
      </div>
    </div>`).join('')}`;
}

function renderGlossary() {
  return `
    <div class="content-section">
      <h3>📖 Glossar — Schlüsselbegriffe</h3>
      <p>Die Vokabelliste aus dem Cisco Certification Guide, ergänzt und ins Deutsche übertragen. Klicke auf einen Begriff, um zum passenden Thema zu springen.</p>
      <input type="text" class="cmd-filter" placeholder="🔍 Begriff filtern…" oninput="filterGlossary(this.value)">
      <div class="glossary-list" id="glossary-list">
        ${GLOSSARY.map(g => `<div class="glossary-item" data-search="${escapeAttr(g.term + ' ' + g.def)}">
          <div class="glossary-term" onclick="navigateTopic('${g.ref}')">${g.term} <span class="glossary-link">→ ${topicById(g.ref)?.title || ''}</span></div>
          <div class="glossary-def">${g.def}</div>
        </div>`).join('')}
      </div>
    </div>`;
}
function filterGlossary(q) {
  q = q.toLowerCase();
  document.querySelectorAll('.glossary-item').forEach(el => { el.style.display = el.dataset.search.toLowerCase().includes(q) ? '' : 'none'; });
}

// ===== CLI-CHEATSHEET =====
function renderCommands() {
  setBreadcrumb([{ label: 'Home', action: "navigateHome()" }, { label: 'CLI-Cheatsheet' }]);
  updateTopbarActions('commands');
  const total = COMMANDS.reduce((a, g) => a + g.items.length, 0);
  document.getElementById('content-area').innerHTML = `
    <div id="commands-view" class="anim-in">
      <div class="topic-header">
        <h2>⌨️ CLI-Cheatsheet — Cisco IOS</h2>
        <div class="th-meta"><span class="tag">${total} Befehle</span><span class="tag">${COMMANDS.length} Kategorien</span><span class="tag">Modus: &gt; User · # Privileged · (config) Global · (config-if) Interface</span></div>
      </div>
      <input type="text" class="cmd-filter" id="cmd-filter" placeholder="🔍 Befehl oder Beschreibung suchen… (z.B. 'trunk', 'ospf', 'show ip')" oninput="filterCommands(this.value)" autofocus>
      <div class="cmd-groups-nav">
        ${COMMANDS.map((g, i) => `<span class="chip chip-link" onclick="document.getElementById('cmd-g-${i}').scrollIntoView({behavior:'smooth',block:'start'})">${g.group}</span>`).join('')}
      </div>
      <div id="cmd-groups">
        ${COMMANDS.map((g, i) => `<div class="content-section cmd-group" id="cmd-g-${i}">
          <h3>${g.group} <span class="cmd-count">${g.items.length}</span></h3>
          <div class="table-wrap"><table class="cmd-table">
            <tr><th style="width:42%">Befehl</th><th style="width:12%">Modus</th><th>Beschreibung</th></tr>
            ${g.items.map(c => `<tr class="cmd-row" data-search="${escapeAttr(c.cmd + ' ' + c.desc + ' ' + g.group)}">
              <td><code class="cmd-code" onclick="copyCmd(this)" title="Klicken zum Kopieren">${c.cmd}</code></td>
              <td><span class="mode-badge">${c.mode}</span></td>
              <td>${c.desc}</td>
            </tr>`).join('')}
          </table></div>
        </div>`).join('')}
      </div>
      <div class="callout callout-tip" id="cmd-empty" style="display:none"><strong>Nichts gefunden</strong>Versuche einen anderen Suchbegriff, z.B. „vlan“, „route“, „snooping“.</div>
    </div>
  `;
  scrollTop();
}
function filterCommands(q) {
  q = q.toLowerCase().trim();
  let any = false;
  document.querySelectorAll('.cmd-row').forEach(r => { const show = r.dataset.search.toLowerCase().includes(q); r.style.display = show ? '' : 'none'; if (show) any = true; });
  document.querySelectorAll('.cmd-group').forEach(g => { const visible = [...g.querySelectorAll('.cmd-row')].some(r => r.style.display !== 'none'); g.style.display = visible ? '' : 'none'; });
  document.getElementById('cmd-empty').style.display = any ? 'none' : '';
}
function copyCmd(el) {
  const text = el.textContent;
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => { el.classList.add('copied'); setTimeout(() => el.classList.remove('copied'), 900); });
}

// ===== PRÜFUNGSSIMULATION =====
function renderSim() {
  setBreadcrumb([{ label: 'Home', action: "navigateHome()" }, { label: 'Prüfungssimulation' }]);
  updateTopbarActions('sim');
  if (state.simState && state.simState.phase === 'run') return renderSimQuestion();
  if (state.simState && state.simState.phase === 'result') return renderSimResult();

  const totalAvailable = Object.values(QUIZZES).reduce((a, q) => a + q.length, 0);
  const hist = [...state.simHistory].reverse().slice(0, 8);
  document.getElementById('content-area').innerHTML = `
    <div id="sim-view" class="anim-in">
      <div class="topic-header">
        <h2>🎓 Prüfungssimulation</h2>
        <div class="th-meta"><span class="tag">${totalAvailable} Fragen im Pool</span><span class="tag">Gewichtung wie in der echten Prüfung</span><span class="tag">Kein Feedback bis zum Ende</span></div>
      </div>
      <div class="content-section">
        <h3>⚙️ Simulation konfigurieren</h3>
        <p>Die Fragen werden zufällig aus allen Themen gezogen — anteilig nach der offiziellen Domänengewichtung (25 % IP Connectivity, je 20 % Fundamentals/Access, 15 % Security, je 10 % Services/Automation). Antwortoptionen werden gemischt. Wie in der echten Prüfung gibt es <strong>kein Zurückblättern</strong> und kein Feedback während des Tests. Der Timer entspricht ca. 72 Sekunden pro Frage (120 Minuten bei 100 Fragen).</p>
        <div class="sim-options">
          ${[20, 40, 60].map(n => `<button class="sim-option" onclick="startSim(${n})">
            <div class="sim-n">${n}</div><div class="sim-l">Fragen</div><div class="sim-t">⏱️ ${Math.round(n * 72 / 60)} Min</div>
          </button>`).join('')}
        </div>
        <label class="sim-toggle"><input type="checkbox" id="sim-timer-toggle" checked> Mit Zeitlimit</label>
      </div>
      ${hist.length ? `<div class="content-section">
        <h3>📈 Bisherige Simulationen</h3>
        <div class="table-wrap"><table>
          <tr><th>Datum</th><th>Fragen</th><th>Ergebnis</th><th>Schwächste Domäne</th><th>Dauer</th></tr>
          ${hist.map(h => `<tr><td>${h.date}</td><td>${h.total}</td><td><strong class="${h.pct >= 80 ? 'rs-correct' : h.pct >= 60 ? '' : 'rs-wrong'}">${h.pct}%</strong> (${h.correct}/${h.total})</td><td>${h.weakest || '—'}</td><td>${h.duration}</td></tr>`).join('')}
        </table></div>
        <button class="btn-secondary" onclick="clearSimHistory()">Verlauf löschen</button>
      </div>` : ''}
      <div class="callout callout-info"><strong>Zielwert</strong>Cisco nennt keinen offiziellen Passing Score. Erfahrungsgemäß solltest du in Simulationen stabil <strong>≥ 85 %</strong> erreichen, bevor du dich anmeldest — die echte Prüfung ist szenariobasierter als ein Quiz.</div>
    </div>
  `;
  scrollTop();
}

function startSim(n) {
  const withTimer = document.getElementById('sim-timer-toggle') ? document.getElementById('sim-timer-toggle').checked : true;
  // Fragen pro Domäne nach Gewichtung ziehen
  const pool = {};
  BLUEPRINT.forEach(d => { pool[d.name] = []; });
  TOPICS.forEach(t => { (QUIZZES[t.id] || []).forEach(q => { if (pool[t.domain]) pool[t.domain].push({ ...q, domain: t.domain, topicId: t.id }); }); });
  let chosen = [];
  const remainders = [];
  BLUEPRINT.forEach(d => {
    const exact = n * d.weight / 100;
    const take = Math.min(Math.floor(exact), pool[d.name].length);
    const sh = shuffle(pool[d.name]);
    chosen = chosen.concat(sh.slice(0, take));
    remainders.push({ d, frac: exact - Math.floor(exact), rest: sh.slice(take) });
  });
  remainders.sort((a, b) => b.frac - a.frac);
  let i = 0;
  while (chosen.length < n && remainders.some(r => r.rest.length)) {
    const r = remainders[i % remainders.length];
    if (r.rest.length) chosen.push(r.rest.shift());
    i++;
  }
  chosen = shuffle(chosen).map(shuffleOptions);

  state.simState = {
    phase: 'run', questions: chosen, current: 0, answers: [], selected: null,
    start: Date.now(), limit: withTimer ? n * 72 : null, timerId: null
  };
  if (withTimer) state.simState.timerId = setInterval(simTick, 1000);
  renderSimQuestion();
}

function simTick() {
  const st = state.simState;
  if (!st || st.phase !== 'run') { clearInterval(state.simState?.timerId); return; }
  const el = document.getElementById('sim-timer');
  const elapsed = Math.floor((Date.now() - st.start) / 1000);
  const left = st.limit - elapsed;
  if (el) {
    el.textContent = '⏱️ ' + fmtTime(Math.max(0, left));
    el.classList.toggle('warn', left < 120);
  }
  if (left <= 0) finishSim(true);
}
function fmtTime(sec) { const m = Math.floor(sec / 60), s = sec % 60; return `${m}:${s.toString().padStart(2, '0')}`; }

function renderSimQuestion() {
  const st = state.simState;
  const q = st.questions[st.current];
  const total = st.questions.length;
  const letters = ['A', 'B', 'C', 'D'];
  const bp = blueprintDomain(q.domain);
  document.getElementById('content-area').innerHTML = `
    <div id="sim-view" class="anim-in">
      <div class="quiz-header">
        <div class="sim-topline">
          <h2>🎓 Prüfungssimulation</h2>
          ${st.limit ? `<span class="sim-timer" id="sim-timer">⏱️ ${fmtTime(Math.max(0, st.limit - Math.floor((Date.now() - st.start) / 1000)))}</span>` : '<span class="sim-timer">ohne Zeitlimit</span>'}
        </div>
        <div class="quiz-meta">
          <span>Frage ${st.current + 1} von ${total}</span><span>·</span>
          <span class="chip" style="background:${bp?.color || '#888'}22;color:${bp?.color || '#888'}">${q.domain}</span><span>·</span>
          <span class="kbd-hint"><kbd>1</kbd>–<kbd>4</kbd> wählen, <kbd>Enter</kbd> weiter</span>
        </div>
        <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${Math.round((st.current / total) * 100)}%"></div></div>
      </div>

      <div class="question-card">
        <div class="question-num">Frage ${st.current + 1}</div>
        <div class="question-text">${q.q}</div>
        <div class="options-list">
          ${q.options.map((opt, i) => `<button class="option-btn ${st.selected === i ? 'selected' : ''}" id="opt-${i}" onclick="simSelect(${i})"><span class="opt-letter">${letters[i]}</span>${opt}</button>`).join('')}
        </div>
      </div>

      <div class="quiz-controls">
        <button class="btn-secondary" onclick="abortSim()">✕ Abbrechen</button>
        <button class="btn-primary" id="next-btn" onclick="simNext()" ${st.selected === null ? 'disabled' : ''}>${st.current < total - 1 ? 'Weiter →' : 'Abgeben'}</button>
      </div>
    </div>
  `;
  scrollTop();
}

function simSelect(i) {
  const st = state.simState;
  if (!st || st.phase !== 'run') return;
  st.selected = i;
  document.querySelectorAll('.option-btn').forEach((b, k) => b.classList.toggle('selected', k === i));
  const nb = document.getElementById('next-btn'); if (nb) nb.disabled = false;
}
function simNext() {
  const st = state.simState;
  if (!st || st.phase !== 'run' || st.selected === null) return;
  const q = st.questions[st.current];
  st.answers.push({ q, chosen: st.selected, correct: st.selected === q.correct });
  st.selected = null;
  st.current++;
  if (st.current >= st.questions.length) finishSim(false);
  else renderSimQuestion();
}
function abortSim() {
  if (!confirm('Simulation wirklich abbrechen? Der Fortschritt geht verloren.')) return;
  clearInterval(state.simState?.timerId);
  state.simState = null;
  renderSim();
}

function finishSim(timeout) {
  const st = state.simState;
  clearInterval(st.timerId);
  st.phase = 'result';
  st.timeout = timeout;
  st.duration = Math.floor((Date.now() - st.start) / 1000);
  const correct = st.answers.filter(a => a.correct).length;
  const total = st.questions.length;
  st.pct = Math.round((correct / total) * 100);

  // Auswertung pro Domäne
  st.byDomain = BLUEPRINT.map(d => {
    const qs = st.answers.filter(a => a.q.domain === d.name);
    const c = qs.filter(a => a.correct).length;
    return { name: d.name, color: d.color, weight: d.weight, total: qs.length, correct: c, pct: qs.length ? Math.round((c / qs.length) * 100) : null };
  });
  const weakest = [...st.byDomain].filter(d => d.total > 0).sort((a, b) => a.pct - b.pct)[0];

  state.simHistory.push({ date: new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }), total, correct, pct: st.pct, weakest: weakest ? `${weakest.name} (${weakest.pct}%)` : null, duration: fmtTime(st.duration) });
  if (state.simHistory.length > 30) state.simHistory.shift();
  save('ccna-sim-history', state.simHistory);
  renderSimResult();
}

function renderSimResult() {
  const st = state.simState;
  const correct = st.answers.filter(a => a.correct).length;
  const total = st.questions.length;
  const unanswered = total - st.answers.length;
  const wrong = st.answers.filter(a => !a.correct);
  const scoreClass = st.pct >= 85 ? 'great' : st.pct >= 70 ? 'ok' : 'poor';
  const msg = st.pct >= 85 ? '🎉 Prüfungsreif!' : st.pct >= 70 ? '👍 Auf gutem Weg' : '📖 Noch nicht bereit';
  const sub = st.pct >= 85 ? 'Stabil über 85 % — jetzt Labs festigen und anmelden.' : st.pct >= 70 ? 'Arbeite die schwächsten Domänen gezielt nach und wiederhole die Simulation.' : 'Gehe die falsch beantworteten Fragen durch und lies die verlinkte Theorie.';

  // Schwache Themen aus falschen Antworten
  const topicMiss = {};
  wrong.forEach(a => { topicMiss[a.q.topicId] = (topicMiss[a.q.topicId] || 0) + 1; });
  const weakTopicsList = Object.entries(topicMiss).sort((a, b) => b[1] - a[1]).slice(0, 6);

  document.getElementById('content-area').innerHTML = `
    <div id="sim-view" class="anim-in">
      <div class="quiz-result">
        <div class="result-score ${scoreClass}">${st.pct}%</div>
        <div class="result-label">${msg}</div>
        <div class="result-sub">${sub}${st.timeout ? ' <strong>Die Zeit ist abgelaufen</strong> — nicht beantwortete Fragen zählen als falsch.' : ''}</div>
        <div class="result-breakdown">
          <div class="result-stat"><div class="rs-num rs-correct">${correct}</div><div class="rs-label">Richtig</div></div>
          <div class="result-stat"><div class="rs-num rs-wrong">${total - correct}</div><div class="rs-label">Falsch${unanswered ? ` (${unanswered} offen)` : ''}</div></div>
          <div class="result-stat"><div class="rs-num">${fmtTime(st.duration)}</div><div class="rs-label">Dauer</div></div>
        </div>
        <div class="result-actions">
          <button class="btn-primary" onclick="state.simState=null;renderSim()">🔁 Neue Simulation</button>
          <button class="btn-secondary" onclick="navigateTool('guide')">📋 Blueprint prüfen</button>
          <button class="btn-secondary" onclick="navigateHome()">🏠 Home</button>
        </div>
      </div>

      <div class="content-section">
        <h3>📊 Ergebnis nach Domäne</h3>
        ${st.byDomain.map(d => `<div class="domain-result-row">
          <span class="weight-dot" style="background:${d.color}"></span>
          <span class="dr-name">${d.name} <small>(${d.weight}%)</small></span>
          <div class="dr-bar"><div class="dr-fill" style="width:${d.pct ?? 0}%;background:${d.color}"></div></div>
          <span class="dr-pct">${d.pct !== null ? d.pct + '%' : '—'} <small>${d.correct}/${d.total}</small></span>
        </div>`).join('')}
      </div>

      ${weakTopicsList.length ? `<div class="content-section">
        <h3>🎯 Diese Themen nacharbeiten</h3>
        <div class="bp-refs">${weakTopicsList.map(([id, n]) => { const t = topicById(id); return t ? `<span class="chip chip-link chip-low" onclick="navigateTopic('${id}')">${t.icon} ${t.title} · ${n} falsch</span>` : ''; }).join('')}</div>
      </div>` : ''}

      ${wrong.length ? `<div class="section-title" style="margin-top:8px">📝 Falsch beantwortete Fragen (${wrong.length})</div>${renderReviewList(wrong)}` : '<div class="callout callout-tip"><strong>Perfekt!</strong>Alle Fragen richtig beantwortet.</div>'}
    </div>
  `;
  scrollTop();
}
function clearSimHistory() {
  if (!confirm('Simulationsverlauf löschen?')) return;
  state.simHistory = []; save('ccna-sim-history', state.simHistory); renderSim();
}

// ===== BOOT =====
document.addEventListener('DOMContentLoaded', init);
