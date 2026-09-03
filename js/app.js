// ===== CCNA Knowledge Base — App Logic =====

const state = {
  currentView: 'home',
  currentTopic: null,
  quizState: null,
  flashcardIndex: 0,
  flashcardFlipped: false,
  theme: localStorage.getItem('ccna-theme') || 'light',
  progress: JSON.parse(localStorage.getItem('ccna-progress') || '{}'),
  quizScores: JSON.parse(localStorage.getItem('ccna-scores') || '{}'),
};

// ===== INIT =====
function init() {
  applyTheme();
  renderSidebar();
  renderHome();
  document.getElementById('sidebar-search').addEventListener('input', onSearch);
  document.getElementById('menu-toggle').addEventListener('click', toggleSidebar);
  document.getElementById('content-area').addEventListener('click', e => {
    if (document.getElementById('sidebar').classList.contains('open')) {
      document.getElementById('sidebar').classList.remove('open');
    }
  });
}

// ===== THEME =====
function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  document.getElementById('dark-toggle').textContent = state.theme === 'dark' ? '☀️ Hell' : '🌙 Dunkel';
}
function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('ccna-theme', state.theme);
  applyTheme();
}

// ===== SIDEBAR =====
function renderSidebar() {
  const nav = document.getElementById('sidebar-nav');
  const domains = {};
  TOPICS.forEach(t => {
    if (!domains[t.domain]) domains[t.domain] = [];
    domains[t.domain].push(t);
  });

  nav.innerHTML = Object.entries(domains).map(([domain, topics]) => `
    <div class="domain-section">
      <div class="domain-label">
        ${domain}
        <span class="domain-pct">${topics[0].domainPct}</span>
      </div>
      ${topics.map(t => {
        const done = state.progress[t.id];
        const score = state.quizScores[t.id];
        return `<div class="nav-item ${state.currentTopic === t.id ? 'active' : ''}"
          onclick="navigateTopic('${t.id}')">
          <span class="topic-icon">${t.icon}</span>
          <span class="topic-title">${t.title}</span>
          ${score !== undefined ? `<span class="topic-badge done">${score}%</span>` : (done ? '<span class="topic-badge done">✓</span>' : '')}
        </div>`;
      }).join('')}
    </div>
  `).join('');
}

function onSearch(e) {
  const q = e.target.value.toLowerCase();
  document.querySelectorAll('.nav-item').forEach(el => {
    el.style.display = el.querySelector('.topic-title').textContent.toLowerCase().includes(q) ? '' : 'none';
  });
  document.querySelectorAll('.domain-label').forEach(el => el.style.display = q ? 'none' : '');
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ===== NAVIGATION =====
function navigateTopic(id) {
  state.currentTopic = id;
  state.currentView = 'topic';
  document.getElementById('sidebar').classList.remove('open');
  renderSidebar();
  renderTopic(id);
}

function navigateHome() {
  state.currentTopic = null;
  state.currentView = 'home';
  renderSidebar();
  renderHome();
}

function setBreadcrumb(parts) {
  document.getElementById('breadcrumb').innerHTML =
    parts.map((p, i) => i < parts.length - 1
      ? `<span class="bc-link" style="cursor:pointer" onclick="${p.action}">${p.label}</span><span class="bc-sep">›</span>`
      : `<span class="bc-current">${p.label}</span>`
    ).join('');
}

// ===== HOME VIEW =====
function renderHome() {
  setBreadcrumb([{ label: 'CCNA Knowledge Base' }]);
  updateTopbarActions('home');

  const totalTopics = TOPICS.length;
  const doneTopics = Object.keys(state.progress).length;
  const quizzedTopics = Object.keys(state.quizScores).length;
  const avgScore = quizzedTopics > 0
    ? Math.round(Object.values(state.quizScores).reduce((a, b) => a + b, 0) / quizzedTopics)
    : 0;

  const domains = {};
  TOPICS.forEach(t => {
    if (!domains[t.domain]) domains[t.domain] = { topics: [], icon: t.icon };
    domains[t.domain].topics.push(t);
  });

  document.getElementById('content-area').innerHTML = `
    <div id="home-view" class="anim-in">
      <div class="home-hero">
        <h2>CCNA 200-301 — Wissensbase</h2>
        <p>Deine komplette Lernplattform für die CCNA-Prüfung. Lerne Theorie pro Kategorie, teste dein Wissen mit Quizzen und verfolge deinen Fortschritt.</p>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-num">${doneTopics}/${totalTopics}</div>
            <div class="stat-label">Themen gelesen</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">${quizzedTopics}</div>
            <div class="stat-label">Quizze absolviert</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">${avgScore > 0 ? avgScore + '%' : '—'}</div>
            <div class="stat-label">Ø Quiz-Score</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">${TOPICS.length}</div>
            <div class="stat-label">Gesamtthemen</div>
          </div>
        </div>
      </div>

      <div class="section-title">📚 Lernbereiche</div>
      <div class="domains-overview">
        ${Object.entries(domains).map(([name, d]) => {
          const done = d.topics.filter(t => state.progress[t.id]).length;
          const pct = Math.round((done / d.topics.length) * 100);
          return `<div class="domain-card" onclick="navigateTopic('${d.topics[0].id}')">
            <div class="dc-header">
              <span class="dc-icon">${d.topics[0].icon}</span>
              <h3>${name}</h3>
            </div>
            <div class="dc-sub">${d.topics[0].domainPct} der Prüfung</div>
            <div class="dc-topics">${d.topics.length} Themen · ${done} gelesen</div>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          </div>`;
        }).join('')}
      </div>
    </div>
  `;
}

// ===== TOPIC VIEW =====
function renderTopic(id) {
  const topic = TOPICS.find(t => t.id === id);
  if (!topic) return;

  state.progress[id] = true;
  localStorage.setItem('ccna-progress', JSON.stringify(state.progress));
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

  document.getElementById('content-area').innerHTML = `
    <div id="topic-view" class="anim-in">
      <div class="topic-header">
        <h2>${topic.icon} ${topic.title}</h2>
        <div class="th-meta">
          <span class="tag">📁 ${topic.domain}</span>
          <span class="tag">🎯 ${topic.domainPct} der Prüfung</span>
          ${topic.tags.map(tg => `<span class="tag">${tg}</span>`).join('')}
          ${score !== undefined ? `<span class="tag" style="background:var(--success-bg);color:var(--success)">Quiz: ${score}%</span>` : ''}
        </div>
      </div>

      ${topic.content}

      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px;">
        ${hasQuiz ? `<button class="btn-primary" onclick="startQuiz('${id}')">🎯 Quiz starten (${QUIZZES[id].length} Fragen)</button>` : ''}
        ${hasFlash ? `<button class="btn-secondary" onclick="startFlashcards('${id}')">🃏 Flashcards</button>` : ''}
      </div>
    </div>
  `;
}

function updateTopbarActions(view, topicId) {
  const actions = document.getElementById('topbar-actions');
  if (view === 'topic' && topicId) {
    const hasQuiz = QUIZZES[topicId];
    actions.innerHTML = `
      ${hasQuiz ? `<button class="btn-icon" onclick="startQuiz('${topicId}')">🎯 Quiz</button>` : ''}
      ${FLASHCARDS[topicId] ? `<button class="btn-icon" onclick="startFlashcards('${topicId}')">🃏 Flashcards</button>` : ''}
      <button class="btn-icon" id="dark-toggle" onclick="toggleTheme()">${state.theme === 'dark' ? '☀️ Hell' : '🌙 Dunkel'}</button>
    `;
  } else {
    actions.innerHTML = `<button class="btn-icon" id="dark-toggle" onclick="toggleTheme()">${state.theme === 'dark' ? '☀️ Hell' : '🌙 Dunkel'}</button>`;
  }
}

// ===== QUIZ =====
function startQuiz(topicId) {
  const topic = TOPICS.find(t => t.id === topicId);
  const questions = QUIZZES[topicId];
  if (!questions) return;

  state.quizState = {
    topicId,
    topicTitle: topic.title,
    questions: [...questions],
    current: 0,
    answers: [],
    answered: false
  };

  setBreadcrumb([
    { label: 'Home', action: "navigateHome()" },
    { label: topic.domain },
    { label: topic.title, action: `navigateTopic('${topicId}')` },
    { label: 'Quiz' }
  ]);
  updateTopbarActions('quiz');
  renderQuizQuestion();
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
          <span>Frage ${qs.current + 1} von ${total}</span>
          <span>·</span>
          <span>${qs.answers.filter(a => a.correct).length} richtig</span>
        </div>
        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" style="width:${pct}%"></div>
        </div>
      </div>

      <div class="question-card">
        <div class="question-num">Frage ${qs.current + 1}</div>
        <div class="question-text">${q.q}</div>
        <div class="options-list" id="options-list">
          ${q.options.map((opt, i) => `
            <button class="option-btn" onclick="selectAnswer(${i})" id="opt-${i}">
              <span class="opt-letter">${letters[i]}</span>
              ${opt}
            </button>
          `).join('')}
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
}

function selectAnswer(index) {
  if (state.quizState.answered) return;
  state.quizState.answered = true;

  const qs = state.quizState;
  const q = qs.questions[qs.current];
  const isCorrect = index === q.correct;
  const letters = ['A', 'B', 'C', 'D'];

  qs.answers.push({ correct: isCorrect });

  const opts = document.querySelectorAll('.option-btn');
  opts.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add(index === q.correct ? 'correct' : 'show-correct');
    if (i === index && !isCorrect) btn.classList.add('wrong');
  });
  if (isCorrect) opts[index].classList.remove('show-correct');
  if (isCorrect) opts[index].classList.add('correct');

  const fb = document.getElementById('feedback-box');
  fb.classList.add('visible');
  if (isCorrect) {
    fb.classList.add('correct-fb');
    fb.innerHTML = `<div class="fb-title">✅ Richtig!</div><div>${q.explanation}</div>`;
  } else {
    fb.classList.add('wrong-fb');
    fb.innerHTML = `
      <div class="fb-title">❌ Nicht ganz — Richtig wäre: ${letters[q.correct]}</div>
      <div>${q.explanation}</div>
      <span class="theory-link" onclick="navigateTopic('${q.theoryRef}')">📖 Theorie nachschlagen →</span>
    `;
  }

  document.getElementById('next-btn').disabled = false;
}

function nextQuestion() {
  const qs = state.quizState;
  qs.current++;
  if (qs.current >= qs.questions.length) {
    showQuizResult();
  } else {
    renderQuizQuestion();
  }
}

function showQuizResult() {
  const qs = state.quizState;
  const correct = qs.answers.filter(a => a.correct).length;
  const total = qs.questions.length;
  const pct = Math.round((correct / total) * 100);

  state.quizScores[qs.topicId] = pct;
  localStorage.setItem('ccna-scores', JSON.stringify(state.quizScores));
  renderSidebar();

  const scoreClass = pct >= 80 ? 'great' : pct >= 60 ? 'ok' : 'poor';
  const scoreMsg = pct >= 80 ? '🎉 Ausgezeichnet!' : pct >= 60 ? '👍 Gut — noch etwas üben!' : '📖 Theorie nochmals wiederholen!';
  const scoreSub = pct >= 80 ? 'Du hast das Thema gut im Griff.' : pct >= 60 ? 'Schau dir die falsch beantworteten Fragen nochmals an.' : 'Lies die Theorie durch und versuche das Quiz erneut.';

  document.getElementById('content-area').innerHTML = `
    <div id="quiz-view" class="anim-in">
      <div class="quiz-result">
        <div class="result-score ${scoreClass}">${pct}%</div>
        <div class="result-label">${scoreMsg}</div>
        <div class="result-sub">${scoreSub}</div>
        <div class="result-breakdown">
          <div class="result-stat">
            <div class="rs-num rs-correct">${correct}</div>
            <div class="rs-label">Richtig</div>
          </div>
          <div class="result-stat">
            <div class="rs-num rs-wrong">${total - correct}</div>
            <div class="rs-label">Falsch</div>
          </div>
          <div class="result-stat">
            <div class="rs-num">${total}</div>
            <div class="rs-label">Gesamt</div>
          </div>
        </div>
        <div class="result-actions">
          <button class="btn-secondary" onclick="navigateTopic('${qs.topicId}')">📖 Theorie anzeigen</button>
          <button class="btn-primary" onclick="startQuiz('${qs.topicId}')">🔁 Quiz wiederholen</button>
          <button class="btn-secondary" onclick="navigateHome()">🏠 Home</button>
        </div>
      </div>
    </div>
  `;
}

// ===== FLASHCARDS =====
function startFlashcards(topicId) {
  const topic = TOPICS.find(t => t.id === topicId);
  const cards = FLASHCARDS[topicId];
  if (!cards) return;

  state.currentTopic = topicId;
  state.flashcardIndex = 0;
  state.flashcardFlipped = false;

  setBreadcrumb([
    { label: 'Home', action: "navigateHome()" },
    { label: topic.title, action: `navigateTopic('${topicId}')` },
    { label: 'Flashcards' }
  ]);
  updateTopbarActions('quiz');
  renderFlashcard(topicId);
}

function renderFlashcard(topicId) {
  const cards = FLASHCARDS[topicId];
  const card = cards[state.flashcardIndex];
  const total = cards.length;

  document.getElementById('content-area').innerHTML = `
    <div id="flashcard-view" class="anim-in">
      <div class="section-title">🃏 Flashcards — ${TOPICS.find(t => t.id === topicId).title}</div>
      <p style="color:var(--text-muted);font-size:13px;margin-bottom:16px;">Klicke auf die Karte, um sie umzudrehen.</p>

      <div class="flashcard-container">
        <div class="flashcard ${state.flashcardFlipped ? 'flipped' : ''}" onclick="flipCard('${topicId}')">
          <div class="flashcard-front">
            <div class="fc-hint">Begriff</div>
            <div class="fc-text">${card.front}</div>
          </div>
          <div class="flashcard-back">
            <div class="fc-hint" style="color:rgba(255,255,255,0.6)">Antwort</div>
            <div class="fc-text">${card.back}</div>
          </div>
        </div>
      </div>

      <div class="fc-nav" style="margin-top:24px;">
        <button class="btn-secondary" onclick="prevCard('${topicId}')" ${state.flashcardIndex === 0 ? 'disabled' : ''}>← Zurück</button>
        <span class="fc-counter">${state.flashcardIndex + 1} / ${total}</span>
        <button class="btn-primary" onclick="nextCard('${topicId}')" ${state.flashcardIndex === total - 1 ? 'disabled' : ''}>Weiter →</button>
      </div>
      <div style="text-align:center;margin-top:16px;">
        <button class="btn-secondary" onclick="navigateTopic('${topicId}')">← Zurück zur Theorie</button>
      </div>
    </div>
  `;
}

function flipCard(topicId) {
  state.flashcardFlipped = !state.flashcardFlipped;
  renderFlashcard(topicId);
}
function nextCard(topicId) {
  state.flashcardIndex++;
  state.flashcardFlipped = false;
  renderFlashcard(topicId);
}
function prevCard(topicId) {
  state.flashcardIndex--;
  state.flashcardFlipped = false;
  renderFlashcard(topicId);
}

// ===== BOOT =====
document.addEventListener('DOMContentLoaded', init);
