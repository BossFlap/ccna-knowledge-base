// ===== Lernsystem: Spaced Repetition, Fehler-Pool, Aktivität/Streak, Prüfungsdatum, Dashboard =====

function loadJSON(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (e) { return fallback; } }
function saveJSON(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

const SRS_INTERVALS = [0, 1, 3, 7, 14, 30, 60];   // Tage pro Box (Leitner-Prinzip)
const SRS_BOX_LABELS = ['Neu', 'Box 1 · täglich', 'Box 2 · 3 Tage', 'Box 3 · 1 Woche', 'Box 4 · 2 Wochen', 'Box 5 · 1 Monat', 'Box 6 · gefestigt'];
const DAY_MS = 86400000;

const LEARN = {
  srs: loadJSON('ccna-srs', {}),
  qhist: loadJSON('ccna-qhist', {}),
  activity: loadJSON('ccna-activity', {}),
  settings: Object.assign({ examDate: '', dailyCards: 20, newCards: 15, dailyQuestions: 10 }, loadJSON('ccna-settings', {})),
  last: loadJSON('ccna-last', null),
  review: null
};

// ---------- Datum ----------
function dateKey(d) { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function dayStartMs(d) { d = d ? new Date(d) : new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); }
function fmtDate(ms) { return new Date(ms).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
function daysBetween(a, b) { return Math.round((dayStartMs(b) - dayStartMs(a)) / DAY_MS); }

// ---------- Aktivität & Streak ----------
function logActivity(field, n) {
  const k = dateKey();
  const a = LEARN.activity[k] || (LEARN.activity[k] = { cards: 0, questions: 0, topics: 0 });
  a[field] = (a[field] || 0) + (n || 1);
  saveJSON('ccna-activity', LEARN.activity);
}
function todayActivity() { return LEARN.activity[dateKey()] || { cards: 0, questions: 0, topics: 0 }; }
function hasActivity(a) { return a && (a.cards > 0 || a.questions > 0 || a.topics > 0); }
function computeStreak() {
  let streak = 0;
  const d = new Date();
  if (!hasActivity(LEARN.activity[dateKey(d)])) d.setDate(d.getDate() - 1);   // heute noch nichts → Streak bis gestern zählt
  while (hasActivity(LEARN.activity[dateKey(d)])) { streak++; d.setDate(d.getDate() - 1); }
  return streak;
}
function activityLast14() {
  const out = [];
  for (let i = 13; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const a = LEARN.activity[dateKey(d)]; out.push({ key: dateKey(d), a, weekday: d.toLocaleDateString('de-DE', { weekday: 'short' }) }); }
  return out;
}

// ---------- Prüfungsdatum ----------
function daysUntilExam() {
  if (!LEARN.settings.examDate) return null;
  return daysBetween(new Date(), new Date(LEARN.settings.examDate + 'T00:00:00'));
}
function saveSettings(patch) { Object.assign(LEARN.settings, patch); saveJSON('ccna-settings', LEARN.settings); }
function setExamDate(v) { saveSettings({ examDate: v || '' }); if (state.currentView === 'home') renderHome(); else if (state.currentView === 'review') renderReviewHome(); }

// ---------- Letzte Position ----------
function rememberPosition(title) {
  const hash = location.hash || '#home';
  if (hash === '#home' || hash.startsWith('#search')) return;
  LEARN.last = { hash, title, ts: Date.now() };
  saveJSON('ccna-last', LEARN.last);
}

// ---------- Spaced Repetition ----------
function cardKey(topicId, card) { return topicId + '|' + card.front; }
function allCards() {
  return TOPICS.flatMap(t => (FLASHCARDS[t.id] || []).map((card, idx) => ({ topicId: t.id, idx, card, key: cardKey(t.id, card) })));
}
function cardEntry(key) { return LEARN.srs[key]; }
function dueCards() { const now = Date.now(); return allCards().filter(c => { const e = LEARN.srs[c.key]; return e && e.due <= now; }); }
function newCards() { return allCards().filter(c => !LEARN.srs[c.key]); }
function learnedCards() { return allCards().filter(c => LEARN.srs[c.key]); }
function nextDueInfo() {
  const future = learnedCards().map(c => LEARN.srs[c.key].due).filter(d => d > Date.now()).sort((a, b) => a - b);
  if (!future.length) return null;
  const days = daysBetween(new Date(), new Date(future[0]));
  const count = future.filter(d => dayStartMs(d) === dayStartMs(future[0])).length;
  return { days, count };
}

// rating: 'again' | 'hard' | 'good'
function rateCard(topicId, card, rating) {
  const key = cardKey(topicId, card);
  const e = LEARN.srs[key] || { box: 0, due: 0, reps: 0, lapses: 0, last: 0 };
  e.reps++;
  e.last = Date.now();
  if (rating === 'again') { e.box = 0; e.due = Date.now(); e.lapses++; }
  else if (rating === 'hard') { e.box = Math.max(1, e.box); e.due = dayStartMs() + DAY_MS; }
  else { e.box = Math.min(SRS_INTERVALS.length - 1, e.box + 1); e.due = dayStartMs() + SRS_INTERVALS[e.box] * DAY_MS; }
  LEARN.srs[key] = e;
  saveJSON('ccna-srs', LEARN.srs);
  logActivity('cards');
  return e;
}
function cardStatusHtml(topicId, card) {
  const e = LEARN.srs[cardKey(topicId, card)];
  if (!e) return '<span class="chip">🆕 Neu</span>';
  const days = daysBetween(new Date(), new Date(e.due));
  const due = e.due <= Date.now() ? '<span class="chip chip-ok">fällig</span>' : `<span class="chip">wieder in ${days} Tag${days === 1 ? '' : 'en'}</span>`;
  return `<span class="chip ${e.box >= 4 ? 'chip-good' : ''}">${SRS_BOX_LABELS[e.box]}</span>${due}`;
}
function renderRatingButtons(fnPrefix) {
  return `<div class="rating-row">
    <button class="rate-btn rate-again" onclick="${fnPrefix}('again')"><span>❌ Nicht gewusst</span><small>nochmal · <kbd>1</kbd></small></button>
    <button class="rate-btn rate-hard" onclick="${fnPrefix}('hard')"><span>🟡 Schwer</span><small>morgen · <kbd>2</kbd></small></button>
    <button class="rate-btn rate-good" onclick="${fnPrefix}('good')"><span>✅ Gewusst</span><small>später · <kbd>3</kbd></small></button>
  </div>`;
}

// Bewertung aus der Themen-Flashcard-Ansicht heraus
function rateTopicCard(rating) {
  const topicId = state.currentTopic;
  const cards = FLASHCARDS[topicId];
  if (!cards) return;
  const order = state.flashcardOrder || cards.map((_, i) => i);
  const card = cards[order[state.flashcardIndex]];
  rateCard(topicId, card, rating);
  renderSidebar();
  if (state.flashcardIndex < cards.length - 1) { state.flashcardIndex++; state.flashcardFlipped = false; renderFlashcard(topicId); }
  else { state.flashcardFlipped = false; renderFlashcard(topicId); }
}

// ---------- Wiederholungs-Session ----------
function startReview(onlyDue) {
  const due = shuffle(dueCards());
  const fresh = onlyDue ? [] : shuffle(newCards()).slice(0, LEARN.settings.newCards);
  const queue = due.concat(fresh);
  if (!queue.length) { renderReviewHome(); return; }
  LEARN.review = { queue, current: 0, flipped: false, done: 0, again: 0, good: 0, hard: 0, start: Date.now(), total: queue.length };
  state.currentView = 'review';
  state.currentTopic = null;
  setHash('review/session');
  renderSidebar();
  setBreadcrumb([{ label: 'Home', action: 'navigateHome()' }, { label: 'Wiederholen', action: "navigateTool('review')" }, { label: 'Session' }]);
  updateTopbarActions('review');
  renderReviewCard();
}

function renderReviewCard() {
  const r = LEARN.review;
  if (!r) return renderReviewHome();
  if (r.current >= r.queue.length) return renderReviewDone();
  const item = r.queue[r.current];
  const t = topicById(item.topicId);
  const bp = blueprintDomain(t.domain);
  const pct = Math.round((r.current / r.queue.length) * 100);
  document.getElementById('content-area').innerHTML = `
    <div id="review-view" class="anim-in">
      <div class="quiz-header">
        <h2>🔁 Wiederholung</h2>
        <div class="quiz-meta">
          <span>Karte ${r.current + 1} von ${r.queue.length}</span><span>·</span>
          <span>✅ ${r.good} · 🟡 ${r.hard} · ❌ ${r.again}</span><span>·</span>
          <span class="kbd-hint"><kbd>Leertaste</kbd> umdrehen · <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> bewerten</span>
        </div>
        <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="review-topic"><span class="chip" style="background:${bp?.color || 'var(--accent)'}22;color:${bp?.color || 'var(--accent)'}">${t.icon} ${t.title}</span> ${cardStatusHtml(item.topicId, item.card)} <span class="chip chip-link" onclick="navigateTopic('${item.topicId}')">📖 Theorie</span></div>
      <div class="flashcard-container">
        <div class="flashcard ${r.flipped ? 'flipped' : ''}" onclick="reviewFlip()">
          <div class="flashcard-front"><div class="fc-hint">Begriff</div><div class="fc-text">${item.card.front}</div></div>
          <div class="flashcard-back"><div class="fc-hint" style="color:rgba(255,255,255,0.6)">Antwort</div><div class="fc-text">${item.card.back}</div></div>
        </div>
      </div>
      ${r.flipped ? renderRatingButtons('reviewRate') : '<div class="fc-nav" style="margin-top:20px"><button class="btn-primary" onclick="reviewFlip()">Antwort zeigen</button></div>'}
      <div style="text-align:center;margin-top:20px"><button class="btn-secondary" onclick="endReview()">Session beenden</button></div>
    </div>`;
  attachSwipe(document.querySelector('#review-view .flashcard-container'), () => { if (r.flipped) reviewRate('good'); }, () => { if (r.flipped) reviewRate('again'); });
  scrollTop();
}
function reviewFlip() { if (!LEARN.review) return; LEARN.review.flipped = !LEARN.review.flipped; renderReviewCard(); }
function reviewRate(rating) {
  const r = LEARN.review;
  if (!r || !r.flipped) return;
  const item = r.queue[r.current];
  rateCard(item.topicId, item.card, rating);
  r[rating]++;
  r.done++;
  if (rating === 'again') r.queue.push(item);        // nochmal ans Ende der Session
  r.current++;
  r.flipped = false;
  renderReviewCard();
}
function endReview() { renderReviewDone(); }
function renderReviewDone() {
  const r = LEARN.review || { done: 0, good: 0, hard: 0, again: 0, start: Date.now(), total: 0 };
  LEARN.review = null;
  renderSidebar();
  const mins = Math.max(1, Math.round((Date.now() - r.start) / 60000));
  const nd = nextDueInfo();
  document.getElementById('content-area').innerHTML = `
    <div id="review-view" class="anim-in">
      <div class="quiz-result">
        <div class="result-score great">${r.done}</div>
        <div class="result-label">Karten wiederholt 🎉</div>
        <div class="result-sub">In ${mins} Minute${mins === 1 ? '' : 'n'} · Streak: ${computeStreak()} Tag${computeStreak() === 1 ? '' : 'e'}</div>
        <div class="result-breakdown">
          <div class="result-stat"><div class="rs-num rs-correct">${r.good}</div><div class="rs-label">Gewusst</div></div>
          <div class="result-stat"><div class="rs-num" style="color:var(--warning)">${r.hard}</div><div class="rs-label">Schwer</div></div>
          <div class="result-stat"><div class="rs-num rs-wrong">${r.again}</div><div class="rs-label">Nicht gewusst</div></div>
        </div>
        <p style="color:var(--text-muted);font-size:13px;margin-bottom:20px">${dueCards().length ? `Noch <strong>${dueCards().length}</strong> Karten heute fällig.` : nd ? `Alles erledigt. Die nächsten ${nd.count} Karten werden in ${nd.days} Tag${nd.days === 1 ? '' : 'en'} fällig.` : 'Alles erledigt.'}</p>
        <div class="result-actions">
          ${dueCards().length ? `<button class="btn-primary" onclick="startReview(true)">🔁 Weiter (${dueCards().length})</button>` : `<button class="btn-primary" onclick="startReview(false)">➕ Neue Karten lernen</button>`}
          ${errorPool().length ? `<button class="btn-secondary" onclick="startErrorQuiz()">❌ Fehler üben (${errorPool().length})</button>` : ''}
          <button class="btn-secondary" onclick="navigateHome()">🏠 Home</button>
        </div>
      </div>
    </div>`;
  scrollTop();
}

// Startseite des Werkzeugs „Wiederholen“
function renderReviewHome() {
  state.currentView = 'review';
  LEARN.review = null;
  const due = dueCards(), fresh = newCards(), learned = learnedCards();
  const pool = errorPool();
  const boxes = [0, 0, 0, 0, 0, 0, 0];
  learned.forEach(c => boxes[LEARN.srs[c.key].box]++);
  const total = allCards().length;
  const nd = nextDueInfo();
  const perTopic = TOPICS.filter(t => FLASHCARDS[t.id]).map(t => {
    const cards = FLASHCARDS[t.id];
    const entries = cards.map(c => LEARN.srs[cardKey(t.id, c)]).filter(Boolean);
    const dueN = entries.filter(e => e.due <= Date.now()).length;
    const solid = entries.filter(e => e.box >= 4).length;
    return { t, total: cards.length, learned: entries.length, dueN, solid };
  });
  document.getElementById('content-area').innerHTML = `
    <div id="review-view" class="anim-in">
      <div class="topic-header">
        <h2>🔁 Tägliche Wiederholung</h2>
        <div class="th-meta"><span class="tag">${total} Karten</span><span class="tag">${learned.length} im System</span><span class="tag">🔥 Streak ${computeStreak()} ${computeStreak() === 1 ? 'Tag' : 'Tage'}</span></div>
      </div>

      <div class="review-grid">
        <div class="content-section review-card-cta">
          <div class="big-num" style="color:${due.length ? 'var(--warning)' : 'var(--success)'}">${due.length}</div>
          <div class="big-label">Karten heute fällig</div>
          <p>${due.length ? 'Wiederhole zuerst die fälligen Karten, dann kommen neue dazu.' : nd ? `Nichts fällig. Nächste ${nd.count} Karten in ${nd.days} Tag${nd.days === 1 ? '' : 'en'}.` : 'Starte mit neuen Karten, um das System zu füllen.'}</p>
          <button class="btn-primary" onclick="startReview(false)" ${!due.length && !fresh.length ? 'disabled' : ''}>🔁 Session starten (${due.length} fällig + ${Math.min(fresh.length, LEARN.settings.newCards)} neu)</button>
          ${due.length ? `<button class="btn-secondary" onclick="startReview(true)">Nur fällige Karten</button>` : ''}
        </div>
        <div class="content-section review-card-cta">
          <div class="big-num" style="color:${pool.length ? 'var(--error)' : 'var(--success)'}">${pool.length}</div>
          <div class="big-label">Fragen im Fehler-Pool</div>
          <p>${pool.length ? 'Falsch beantwortete Quiz- und Simulationsfragen. Zweimal in Folge richtig → raus aus dem Pool.' : 'Keine offenen Fehler. Jede falsch beantwortete Frage landet automatisch hier.'}</p>
          <button class="btn-primary" onclick="startErrorQuiz()" ${!pool.length ? 'disabled' : ''}>❌ Meine Fehler üben</button>
        </div>
      </div>

      <div class="content-section">
        <h3>📦 Lernstand der Karten</h3>
        <div class="box-bar">${boxes.map((n, i) => n ? `<div class="box-seg box-${i}" style="flex:${n}" title="${SRS_BOX_LABELS[i]}: ${n}"><span>${n}</span></div>` : '').join('')}${fresh.length ? `<div class="box-seg box-new" style="flex:${fresh.length}" title="Neu: ${fresh.length}"><span>${fresh.length}</span></div>` : ''}</div>
        <div class="box-legend">${SRS_BOX_LABELS.map((l, i) => `<span><i class="box-dot box-${i}"></i>${l}: ${boxes[i]}</span>`).join('')}<span><i class="box-dot box-new"></i>Noch nie gesehen: ${fresh.length}</span></div>
        <div class="callout callout-info"><strong>So funktioniert es</strong>Jede Karte wandert bei „Gewusst“ eine Box weiter, die Abstände wachsen (1 → 3 → 7 → 14 → 30 → 60 Tage). „Nicht gewusst“ setzt sie zurück und zeigt sie in derselben Session noch einmal. Bewerten kannst du auch in den Flashcards jedes Themas.</div>
      </div>

      <div class="content-section">
        <h3>⚙️ Einstellungen</h3>
        <div class="settings-row">
          <label>Neue Karten pro Session <input type="number" min="5" max="60" step="5" value="${LEARN.settings.newCards}" onchange="saveSettings({newCards: +this.value}); renderReviewHome()"></label>
          <label>Tagesziel Karten <input type="number" min="5" max="200" step="5" value="${LEARN.settings.dailyCards}" onchange="saveSettings({dailyCards: +this.value})"></label>
          <label>Tagesziel Quizfragen <input type="number" min="5" max="100" step="5" value="${LEARN.settings.dailyQuestions}" onchange="saveSettings({dailyQuestions: +this.value})"></label>
          <label>Prüfungsdatum <input type="date" value="${LEARN.settings.examDate}" onchange="setExamDate(this.value)"></label>
        </div>
      </div>

      <div class="content-section">
        <h3>📚 Nach Thema</h3>
        <div class="table-wrap"><table>
          <tr><th>Thema</th><th>Karten</th><th>Im System</th><th>Gefestigt</th><th>Fällig</th><th></th></tr>
          ${perTopic.map(p => `<tr><td>${p.t.icon} ${p.t.title}</td><td>${p.total}</td><td>${p.learned}</td><td>${p.solid}</td><td>${p.dueN ? `<strong style="color:var(--warning)">${p.dueN}</strong>` : '—'}</td><td><span class="chip chip-link" onclick="startFlashcards('${p.t.id}')">🃏 Lernen</span></td></tr>`).join('')}
        </table></div>
      </div>
    </div>`;
  scrollTop();
}

// ---------- Fehler-Pool ----------
function qKey(topicId, q) { return topicId + '|' + q.q; }
function recordAnswer(topicId, q, correct) {
  const k = qKey(topicId, q);
  const h = LEARN.qhist[k] || { w: 0, r: 0, streak: 0, pool: false, lastWrong: 0 };
  if (correct) { h.r++; h.streak++; if (h.pool && h.streak >= 2) h.pool = false; }
  else { h.w++; h.streak = 0; h.pool = true; h.lastWrong = Date.now(); }
  LEARN.qhist[k] = h;
  saveJSON('ccna-qhist', LEARN.qhist);
  logActivity('questions');
}
function errorPool() {
  const out = [];
  Object.entries(QUIZZES).forEach(([id, qs]) => qs.forEach(q => { const h = LEARN.qhist[qKey(id, q)]; if (h && h.pool) out.push({ topicId: id, q, h }); }));
  return out;
}
function startErrorQuiz() {
  const pool = errorPool();
  if (!pool.length) { navigateTool('review'); return; }
  state.currentView = 'quiz';
  state.currentTopic = null;
  state.quizState = {
    topicId: 'errors', topicTitle: 'Meine Fehler', mode: 'errors',
    questions: shuffle(pool).map(p => shuffleOptions({ ...p.q, _topicId: p.topicId })),
    current: 0, answers: [], answered: false
  };
  setHash('errors');
  renderSidebar();
  setBreadcrumb([{ label: 'Home', action: 'navigateHome()' }, { label: 'Wiederholen', action: "navigateTool('review')" }, { label: 'Fehler üben' }]);
  updateTopbarActions('quiz');
  renderQuizQuestion();
}

// ---------- Dashboard (Startseite) ----------
function renderDashboardCards() {
  const due = dueCards().length, fresh = newCards().length, pool = errorPool().length;
  const streak = computeStreak();
  const days = daysUntilExam();
  const act = todayActivity();
  const goalCards = Math.min(LEARN.settings.dailyCards, Math.max(due, 1));
  const goals = [
    { label: 'Karten wiederholt', done: act.cards, target: LEARN.settings.dailyCards, action: 'startReview(false)' },
    { label: 'Quizfragen beantwortet', done: act.questions, target: LEARN.settings.dailyQuestions, action: pool ? 'startErrorQuiz()' : "navigateTool('sim')" },
    { label: 'Thema gelesen', done: act.topics, target: 1, action: 'openNextTopic()' }
  ];
  const goalPct = Math.round(goals.reduce((a, g) => a + Math.min(1, g.done / g.target), 0) / goals.length * 100);
  const unread = TOPICS.filter(t => !state.progress[t.id]).length;
  const pace = days && days > 0 && unread ? Math.ceil(unread / days * 7) : null;
  const last14 = activityLast14();

  return `
    <div class="section-title">📅 Heute</div>
    <div class="dash-grid">
      <div class="dash-card dash-exam">
        ${days === null
          ? `<div class="dash-label">Prüfungsdatum</div><div class="dash-value">—</div><div class="dash-sub">Setze dein Datum, dann rechnet die Seite Countdown und Tempo aus.</div><input type="date" class="dash-input" onchange="setExamDate(this.value)">`
          : days >= 0
            ? `<div class="dash-label">Prüfung in</div><div class="dash-value">${days}<small> Tag${days === 1 ? '' : 'en'}</small></div><div class="dash-sub">${fmtDate(new Date(LEARN.settings.examDate + 'T00:00:00').getTime())}${pace ? ` · ${unread} Themen offen → ca. ${pace} pro Woche` : unread ? ` · ${unread} Themen offen` : ' · alle Themen gelesen'}</div><input type="date" class="dash-input" value="${LEARN.settings.examDate}" onchange="setExamDate(this.value)">`
            : `<div class="dash-label">Prüfungsdatum</div><div class="dash-value">vorbei</div><div class="dash-sub">Bestanden? Glückwunsch! Sonst neues Datum setzen.</div><input type="date" class="dash-input" value="${LEARN.settings.examDate}" onchange="setExamDate(this.value)">`}
      </div>
      <div class="dash-card">
        <div class="dash-label">Streak</div>
        <div class="dash-value">${streak === 0 ? '🔥' : '🔥 ' + streak}<small> ${streak === 0 ? 'starte heute' : streak === 1 ? 'Tag' : 'Tage'}</small></div>
        <div class="dash-heat">${last14.map(d => `<i class="${hasActivity(d.a) ? 'on' : ''} ${d.key === dateKey() ? 'today' : ''}" title="${d.key}${d.a ? `: ${d.a.cards} Karten, ${d.a.questions} Fragen, ${d.a.topics} Themen` : ''}"></i>`).join('')}</div>
        <div class="dash-sub">Letzte 14 Tage</div>
      </div>
      <div class="dash-card dash-click" onclick="startReview(false)">
        <div class="dash-label">Fällige Karten</div>
        <div class="dash-value" style="color:${due ? 'var(--warning)' : 'var(--success)'}">${due}<small> ${fresh ? `+ ${Math.min(fresh, LEARN.settings.newCards)} neu` : ''}</small></div>
        <div class="dash-sub">${due ? 'Jetzt wiederholen →' : fresh ? 'Neue Karten lernen →' : 'Alles gelernt 🎉'}</div>
      </div>
      <div class="dash-card dash-click" onclick="${pool ? 'startErrorQuiz()' : "navigateTool('sim')"}">
        <div class="dash-label">Fehler-Pool</div>
        <div class="dash-value" style="color:${pool ? 'var(--error)' : 'var(--success)'}">${pool}<small> Fragen</small></div>
        <div class="dash-sub">${pool ? 'Meine Fehler üben →' : 'Keine offenen Fehler · Simulation →'}</div>
      </div>
      <div class="dash-card dash-goal">
        <div class="dash-label">Tagesziel <span class="dash-pct">${goalPct}%</span></div>
        <div class="progress-bar" style="height:8px;margin:8px 0 10px"><div class="progress-fill" style="width:${goalPct}%;background:${goalPct >= 100 ? 'var(--success)' : 'var(--accent)'}"></div></div>
        ${goals.map(g => `<div class="goal-row ${g.done >= g.target ? 'done' : ''}" onclick="${g.action}"><span>${g.done >= g.target ? '☑' : '☐'} ${g.label}</span><span>${Math.min(g.done, g.target)}/${g.target}</span></div>`).join('')}
      </div>
      <div class="dash-card dash-click dash-continue" onclick="continueLearning()">
        <div class="dash-label">Weiter lernen</div>
        <div class="dash-value dash-value-sm">${LEARN.last ? escHtml(LEARN.last.title) : (TOPICS.find(t => !state.progress[t.id]) || TOPICS[0]).title}</div>
        <div class="dash-sub">${LEARN.last ? 'Zuletzt geöffnet →' : 'Nächstes ungelesenes Thema →'}</div>
      </div>
    </div>`;
}
function continueLearning() {
  if (LEARN.last && LEARN.last.hash) { location.hash = LEARN.last.hash; route(); }
  else openNextTopic();
}
function openNextTopic() {
  const t = TOPICS.find(x => !state.progress[x.id]) || TOPICS[0];
  navigateTopic(t.id);
}

// ---------- Touch: Wischen ----------
function attachSwipe(el, onLeft, onRight) {
  if (!el) return;
  let x0 = null, y0 = null;
  el.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  el.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) { if (dx < 0) onLeft && onLeft(); else onRight && onRight(); }
  }, { passive: true });
}
