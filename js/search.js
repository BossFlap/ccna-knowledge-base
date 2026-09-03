// ===== Volltextsuche über alle Inhalte + Topic-Enhancements (TOC, Copy-Buttons, Hervorhebung) =====

let SEARCH_INDEX = [];
const SEARCH_TYPES = {
  topic: { label: 'Themen (Theorie)', icon: '📖', weight: 3 },
  cmd:   { label: 'CLI-Befehle',      icon: '⌨️', weight: 2.5 },
  gloss: { label: 'Glossar',          icon: '📚', weight: 2 },
  bp:    { label: 'Blueprint',        icon: '✅', weight: 2 },
  flash: { label: 'Flashcards',       icon: '🃏', weight: 1.5 },
  quiz:  { label: 'Quizfragen',       icon: '🎯', weight: 1 }
};
const SEARCH_SUGGESTIONS = ['ospf', 'port 22', 'trunk native vlan', 'dhcp snooping', 'wildcard', 'syslog level', 'hsrp preempt', 'eui-64', 'wpa3', 'show ip route', 'administrative distance', 'capwap', 'longest prefix', 'tacacs', '802.1q', 'subnetting'];

// ---------- Index ----------
function normText(s) { return String(s).replace(/\s+/g, ' ').trim(); }
function htmlToDom(html) { const d = document.createElement('div'); d.innerHTML = html; return d; }

function buildSearchIndex() {
  SEARCH_INDEX = [];
  TOPICS.forEach(t => {
    const dom = htmlToDom(t.content);
    // Block-Elemente mit Leerzeichen trennen, damit Tabellenzellen/Listenpunkte im Text nicht zusammenkleben
    dom.querySelectorAll('td, th, li, p, h4, tr, pre, div').forEach(el => el.append(' '));
    SEARCH_INDEX.push({ type: 'topic', topicId: t.id, section: -1, title: t.title, text: normText(t.tags.join(' · ') + ' · ' + t.domain), topicTitle: t.title });
    dom.querySelectorAll('.content-section').forEach((sec, i) => {
      const h = sec.querySelector('h3');
      const title = h ? normText(h.textContent) : t.title;
      const body = [...sec.childNodes].filter(n => n !== h).map(n => n.textContent).join(' ');
      SEARCH_INDEX.push({ type: 'topic', topicId: t.id, section: i, title, text: normText(body), topicTitle: t.title });
    });
  });
  Object.entries(QUIZZES).forEach(([id, qs]) => qs.forEach((q, i) =>
    SEARCH_INDEX.push({ type: 'quiz', topicId: id, idx: i, title: q.q, text: normText(q.options.join(' · ') + ' — ' + q.explanation), q })));
  Object.entries(FLASHCARDS).forEach(([id, cs]) => cs.forEach((c, i) =>
    SEARCH_INDEX.push({ type: 'flash', topicId: id, idx: i, title: c.front, text: normText(c.back) })));
  COMMANDS.forEach(g => g.items.forEach(c =>
    SEARCH_INDEX.push({ type: 'cmd', title: c.cmd, text: normText(c.desc), group: g.group, mode: c.mode })));
  GLOSSARY.forEach(g => SEARCH_INDEX.push({ type: 'gloss', title: g.term, text: normText(g.def), ref: g.ref }));
  BLUEPRINT.forEach(d => d.items.forEach(i =>
    SEARCH_INDEX.push({ type: 'bp', title: i.num + ' ' + i.text, text: normText((i.sub || []).join(' · ')), num: i.num, domain: d.name })));
  SEARCH_INDEX.forEach(e => { e._t = e.title.toLowerCase(); e._x = e.text.toLowerCase(); });
}

// ---------- Suche ----------
function tokenize(q) { return String(q).toLowerCase().split(/\s+/).filter(Boolean); }
function countOcc(s, sub) { let n = 0, i = 0; while ((i = s.indexOf(sub, i)) !== -1 && n < 20) { n++; i += sub.length; } return n; }

function searchIndex(query, limit) {
  const tokens = tokenize(query);
  if (!tokens.length) return [];
  const res = [];
  for (const e of SEARCH_INDEX) {
    let score = 0, ok = true;
    for (const tk of tokens) {
      const inT = e._t.includes(tk), inX = e._x.includes(tk);
      if (!inT && !inX) { ok = false; break; }
      if (inT) score += 6 + (e._t === tk ? 8 : e._t.startsWith(tk) ? 2 : 0);
      if (inX) score += Math.min(4, countOcc(e._x, tk));
    }
    if (!ok) continue;
    score *= SEARCH_TYPES[e.type].weight;
    if (e.type === 'topic' && e.section === -1) score += 5;
    res.push({ e, score });
  }
  res.sort((a, b) => b.score - a.score);
  return limit ? res.slice(0, limit) : res;
}

function escHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function hlText(text, tokens) {
  if (!tokens.length) return escHtml(text);
  const re = new RegExp('(' + tokens.map(escRe).join('|') + ')', 'gi');
  return escHtml(text).replace(re, '<mark>$1</mark>');
}
function snippet(text, tokens, len) {
  len = len || 170;
  const low = text.toLowerCase();
  let pos = -1;
  for (const t of tokens) { const p = low.indexOf(t); if (p !== -1 && (pos === -1 || p < pos)) pos = p; }
  if (pos === -1) return hlText(text.slice(0, len), tokens) + (text.length > len ? '…' : '');
  let start = Math.max(0, pos - Math.floor(len / 3));
  if (start > 0) { const sp = text.lastIndexOf(' ', start); if (sp > 0 && start - sp < 25) start = sp + 1; }
  const end = Math.min(text.length, start + len);
  return (start > 0 ? '…' : '') + hlText(text.slice(start, end), tokens) + (end < text.length ? '…' : '');
}

// ---------- Such-Ansicht ----------
function doSearch(query) {
  query = normText(query);
  closeSearchDropdown();
  renderSearch(query, false);
}

function renderSearch(query, fromRoute) {
  state.currentView = 'search';
  state.currentTopic = null;
  state.simState = null;
  state.lastQuery = query;
  state.searchFilter = 'all';
  if (!fromRoute) setHash(query ? 'search/' + encodeURIComponent(query) : 'search');
  renderSidebar();
  setBreadcrumb(query
    ? [{ label: 'Home', action: 'navigateHome()' }, { label: 'Suche', action: "renderSearch('')" }, { label: '„' + query + '“' }]
    : [{ label: 'Home', action: 'navigateHome()' }, { label: 'Volltextsuche' }]);
  updateTopbarActions('search');
  const gs = document.getElementById('global-search'); if (gs) gs.value = query;

  const tokens = tokenize(query);
  state.searchResults = query ? searchIndex(query) : [];
  const total = state.searchResults.length;
  const counts = {};
  state.searchResults.forEach(r => { counts[r.e.type] = (counts[r.e.type] || 0) + 1; });

  document.getElementById('content-area').innerHTML = `
    <div id="search-view" class="anim-in">
      <div class="search-head">
        <h2>🔍 Volltextsuche</h2>
        <div class="search-bar">
          <input type="text" id="search-input" value="${escHtml(query)}" placeholder="Begriff, Protokoll, Port, Befehl … z.B. „dhcp snooping“ oder „port 443“" autocomplete="off"
            onkeydown="if(event.key==='Enter'){doSearch(this.value)}">
          <button class="btn-primary" onclick="doSearch(document.getElementById('search-input').value)">Suchen</button>
        </div>
        <p class="kbd-hint">Durchsucht die Theorie aller ${TOPICS.length} Themen, ${COMMANDS.reduce((a, g) => a + g.items.length, 0)} CLI-Befehle, Glossar, Blueprint, Flashcards und Quizfragen. Mehrere Wörter: alle müssen vorkommen. <kbd>Strg</kbd>+<kbd>K</kbd> oder <kbd>/</kbd> öffnet die Suche von überall.</p>
      </div>
      ${query ? `
        <div class="search-summary">
          <strong>${total}</strong> Treffer für „${escHtml(query)}“
        </div>
        ${total ? `<div class="search-filters" id="search-filters">
          <span class="chip chip-link active" data-f="all" onclick="setSearchFilter('all')">Alle · ${total}</span>
          ${Object.keys(SEARCH_TYPES).filter(t => counts[t]).map(t => `<span class="chip chip-link" data-f="${t}" onclick="setSearchFilter('${t}')">${SEARCH_TYPES[t].icon} ${SEARCH_TYPES[t].label} · ${counts[t]}</span>`).join('')}
        </div>
        <div id="search-results">${renderSearchResults(tokens)}</div>`
        : `<div class="callout callout-warn"><strong>Keine Treffer</strong>Probiere einen kürzeren Begriff, die englische Schreibweise (z.B. „trunk“ statt „Trunkport“) oder nur ein Wort. Beispiele: ${SEARCH_SUGGESTIONS.slice(0, 6).map(s => `<span class="chip chip-link" onclick="doSearch('${s}')">${s}</span>`).join(' ')}</div>`}`
      : `
        <div class="content-section">
          <h3>💡 Beliebte Suchen</h3>
          <div class="bp-refs">${SEARCH_SUGGESTIONS.map(s => `<span class="chip chip-link" onclick="doSearch('${s}')">${s}</span>`).join('')}</div>
        </div>
        <div class="content-section">
          <h3>📦 Was durchsucht wird</h3>
          <div class="table-wrap"><table>
            <tr><th>Bereich</th><th>Einträge</th><th>Beispiel</th></tr>
            <tr><td>📖 Theorie-Abschnitte aller Themen</td><td>${SEARCH_INDEX.filter(e => e.type === 'topic').length}</td><td>„late collision“, „stratum“, „root guard“</td></tr>
            <tr><td>⌨️ CLI-Befehle</td><td>${SEARCH_INDEX.filter(e => e.type === 'cmd').length}</td><td>„ip helper-address“, „show spanning-tree“</td></tr>
            <tr><td>📚 Glossar</td><td>${SEARCH_INDEX.filter(e => e.type === 'gloss').length}</td><td>„SIEM“, „YANG“</td></tr>
            <tr><td>✅ Blueprint-Punkte</td><td>${SEARCH_INDEX.filter(e => e.type === 'bp').length}</td><td>„3.4“, „first hop“</td></tr>
            <tr><td>🃏 Flashcards</td><td>${SEARCH_INDEX.filter(e => e.type === 'flash').length}</td><td>„port 123“, „AD 110“</td></tr>
            <tr><td>🎯 Quizfragen</td><td>${SEARCH_INDEX.filter(e => e.type === 'quiz').length}</td><td>„duplex mismatch“</td></tr>
          </table></div>
        </div>`}
    </div>`;
  const inp = document.getElementById('search-input');
  if (inp && !query) inp.focus();
  scrollTop();
}

function setSearchFilter(f) {
  state.searchFilter = f;
  document.querySelectorAll('#search-filters .chip').forEach(c => c.classList.toggle('active', c.dataset.f === f));
  const el = document.getElementById('search-results');
  if (el) el.innerHTML = renderSearchResults(tokenize(state.lastQuery));
}

function renderSearchResults(tokens) {
  const results = state.searchResults.map((r, i) => ({ ...r, i })).filter(r => state.searchFilter === 'all' || r.e.type === state.searchFilter);
  if (!results.length) return '<div class="callout callout-info"><strong>Keine Treffer in dieser Kategorie</strong></div>';
  // Nach Typ gruppieren, Gruppen in Reihenfolge der besten Treffer
  const groups = {};
  results.forEach(r => { (groups[r.e.type] = groups[r.e.type] || []).push(r); });
  const order = Object.keys(groups).sort((a, b) => groups[b][0].score - groups[a][0].score);
  return order.map(type => {
    const list = groups[type];
    const shown = state.searchFilter === 'all' ? list.slice(0, 8) : list;
    return `<div class="sr-group">
      <div class="sr-group-head">${SEARCH_TYPES[type].icon} ${SEARCH_TYPES[type].label} <span class="cmd-count">${list.length}</span>
        ${state.searchFilter === 'all' && list.length > shown.length ? `<span class="chip chip-link" onclick="setSearchFilter('${type}')">alle ${list.length} anzeigen →</span>` : ''}</div>
      ${shown.map(r => renderSearchItem(r, tokens)).join('')}
    </div>`;
  }).join('');
}

function renderSearchItem(r, tokens) {
  const e = r.e;
  const t = topicById(e.topicId);
  const bp = t ? blueprintDomain(t.domain) : null;
  const color = bp ? bp.color : 'var(--accent)';
  switch (e.type) {
    case 'topic':
      return `<div class="sr-item" onclick="openSearchResult(${r.i})" style="border-left-color:${color}">
        <div class="sr-crumb">${t.icon} ${escHtml(t.domain)} › ${escHtml(t.title)}${e.section >= 0 ? ' › Abschnitt' : ''}</div>
        <div class="sr-title">${e.section >= 0 ? hlText(e.title, tokens) : hlText(t.title, tokens)}</div>
        <div class="sr-snip">${snippet(e.text, tokens)}</div>
        <div class="sr-action">📖 Im Thema öffnen und Treffer hervorheben →</div>
      </div>`;
    case 'cmd':
      return `<div class="sr-item" onclick="openSearchResult(${r.i})">
        <div class="sr-crumb">⌨️ CLI-Cheatsheet › ${escHtml(e.group)} <span class="mode-badge">${escHtml(e.mode)}</span></div>
        <div class="sr-title"><code class="cmd-code">${hlText(e.title, tokens)}</code></div>
        <div class="sr-snip">${hlText(e.text, tokens)}</div>
      </div>`;
    case 'gloss':
      return `<div class="sr-item" onclick="openSearchResult(${r.i})">
        <div class="sr-crumb">📚 Glossar${t ? ' › ' + escHtml(t.title) : ''}</div>
        <div class="sr-title">${hlText(e.title, tokens)}</div>
        <div class="sr-snip">${hlText(e.text, tokens)}</div>
      </div>`;
    case 'bp': {
      const d = BLUEPRINT.find(x => x.name === e.domain);
      return `<div class="sr-item" onclick="openSearchResult(${r.i})" style="border-left-color:${d ? d.color : color}">
        <div class="sr-crumb">✅ Blueprint › ${escHtml(e.domain)}</div>
        <div class="sr-title">${hlText(e.title, tokens)}</div>
        ${e.text ? `<div class="sr-snip">${hlText(e.text, tokens)}</div>` : ''}
      </div>`;
    }
    case 'flash':
      return `<div class="sr-item" onclick="openSearchResult(${r.i})" style="border-left-color:${color}">
        <div class="sr-crumb">🃏 Flashcard › ${escHtml(t.title)}</div>
        <div class="sr-title">${hlText(e.title, tokens)}</div>
        <div class="sr-snip"><strong>Antwort:</strong> ${hlText(e.text, tokens)}</div>
      </div>`;
    case 'quiz': {
      const letters = ['A', 'B', 'C', 'D'];
      return `<div class="sr-item sr-quiz" style="border-left-color:${color}">
        <div class="sr-crumb">🎯 Quizfrage › ${escHtml(t.title)}</div>
        <div class="sr-title">${hlText(e.title, tokens)}</div>
        <details class="sr-details">
          <summary>Antwort anzeigen</summary>
          <div class="sr-snip"><strong>✓ ${letters[e.q.correct]} — ${hlText(e.q.options[e.q.correct], tokens)}</strong><br>${hlText(e.q.explanation, tokens)}</div>
        </details>
        <div class="sr-action" onclick="openSearchResult(${r.i})">📖 Theorie öffnen → &nbsp;·&nbsp; <span onclick="event.stopPropagation();startQuiz('${e.topicId}')">🎯 Quiz starten</span></div>
      </div>`;
    }
  }
  return '';
}

function openSearchResult(i) {
  const r = state.searchResults[i];
  if (r) openSearchEntry(r.e, state.lastQuery);
}

function openSearchEntry(e, query) {
  const tokens = tokenize(query || '');
  closeSearchDropdown();
  switch (e.type) {
    case 'topic':
      state.pendingHighlight = { tokens, section: e.section, query };
      navigateTopic(e.topicId);
      break;
    case 'quiz':
      state.pendingHighlight = { tokens, section: -1, query };
      navigateTopic(e.topicId);
      break;
    case 'cmd':
      navigateTool('commands');
      setTimeout(() => { const inp = document.getElementById('cmd-filter'); if (inp) { inp.value = e.title; filterCommands(e.title); } }, 30);
      break;
    case 'gloss':
      navigateTool('guide');
      setTimeout(() => {
        switchGuideTab('glossary');
        const inp = document.querySelector('#gp-glossary .cmd-filter'); if (inp) { inp.value = e.title; filterGlossary(e.title); }
      }, 30);
      break;
    case 'bp':
      navigateTool('guide');
      setTimeout(() => scrollToBlueprint(e.num), 60);
      break;
    case 'flash':
      startFlashcards(e.topicId);
      state.flashcardIndex = e.idx;
      state.flashcardFlipped = false;
      renderFlashcard(e.topicId);
      break;
  }
}

// ---------- Globales Suchfeld (Topbar) mit Live-Vorschlägen ----------
let _ddTimer = null;
function initGlobalSearch() {
  const inp = document.getElementById('global-search');
  if (!inp) return;
  inp.addEventListener('input', () => {
    clearTimeout(_ddTimer);
    _ddTimer = setTimeout(() => showSearchDropdown(inp.value), 120);
  });
  inp.addEventListener('keydown', e => {
    const dd = document.getElementById('search-dropdown');
    const items = dd ? [...dd.querySelectorAll('.dd-item')] : [];
    let active = items.findIndex(x => x.classList.contains('active'));
    if (e.key === 'Enter') {
      e.preventDefault();
      if (active >= 0 && items[active]) items[active].click();
      else if (inp.value.trim()) doSearch(inp.value);
    } else if (e.key === 'Escape') { closeSearchDropdown(); inp.blur(); }
    else if (e.key === 'ArrowDown' && items.length) { e.preventDefault(); items.forEach(x => x.classList.remove('active')); items[(active + 1) % items.length].classList.add('active'); }
    else if (e.key === 'ArrowUp' && items.length) { e.preventDefault(); items.forEach(x => x.classList.remove('active')); items[(active - 1 + items.length) % items.length].classList.add('active'); }
  });
  inp.addEventListener('focus', () => { if (inp.value.trim().length >= 2) showSearchDropdown(inp.value); });
  document.addEventListener('click', e => { if (!e.target.closest('.topbar-search')) closeSearchDropdown(); });
}

function focusGlobalSearch() {
  const inp = document.getElementById('global-search');
  if (inp && inp.offsetParent !== null) { inp.focus(); inp.select(); }
  else renderSearch(state.lastQuery || '', false);
}

function showSearchDropdown(q) {
  q = normText(q);
  const wrap = document.querySelector('.topbar-search');
  if (!wrap) return;
  let dd = document.getElementById('search-dropdown');
  if (q.length < 2) { closeSearchDropdown(); return; }
  const tokens = tokenize(q);
  const res = searchIndex(q, 8);
  state.dropdownResults = res;
  if (!dd) { dd = document.createElement('div'); dd.id = 'search-dropdown'; wrap.appendChild(dd); }
  dd.innerHTML = res.length
    ? res.map((r, i) => {
        const e = r.e; const t = topicById(e.topicId);
        const crumb = e.type === 'topic' ? `${t.title}${e.section >= 0 ? ' › ' + e.title : ''}` : e.type === 'cmd' ? e.group : e.type === 'bp' ? e.domain : e.type === 'gloss' ? 'Glossar' : t ? t.title : '';
        const title = e.type === 'topic' && e.section >= 0 ? e.title : e.type === 'topic' ? t.title : e.title;
        return `<div class="dd-item" onclick="openDropdownResult(${i})">
          <span class="dd-icon">${SEARCH_TYPES[e.type].icon}</span>
          <div class="dd-body"><div class="dd-title">${hlText(title, tokens)}</div><div class="dd-crumb">${escHtml(crumb)}</div></div>
        </div>`;
      }).join('') + `<div class="dd-item dd-all" onclick="doSearch('${escHtml(q).replace(/'/g, '&#39;')}')">🔍 Alle Treffer für „${escHtml(q)}“ anzeigen <kbd>Enter</kbd></div>`
    : `<div class="dd-empty">Keine Treffer für „${escHtml(q)}“</div>`;
}
function openDropdownResult(i) {
  const r = state.dropdownResults && state.dropdownResults[i];
  const q = document.getElementById('global-search').value;
  if (r) { state.lastQuery = normText(q); openSearchEntry(r.e, q); }
}
function closeSearchDropdown() { const dd = document.getElementById('search-dropdown'); if (dd) dd.remove(); }

// ---------- Topic-Enhancements: Inhaltsverzeichnis, Copy-Buttons, Hervorhebung ----------
function enhanceTopicView(topicId) {
  const view = document.getElementById('topic-view');
  if (!view) return;
  const secs = [...view.querySelectorAll('.content-section')];
  secs.forEach((s, i) => { s.id = 'sec-' + i; });

  // Inhaltsverzeichnis ab 3 Abschnitten
  const toc = document.getElementById('topic-toc');
  if (toc && secs.length >= 3) {
    toc.innerHTML = `<nav class="toc"><span class="toc-label">Inhalt</span>${secs.map((s, i) => {
      const h = s.querySelector('h3'); return h ? `<a onclick="scrollToSection(${i})">${escHtml(normText(h.textContent))}</a>` : '';
    }).join('')}</nav>`;
  }

  // Copy-Button auf jedem Code-Block
  view.querySelectorAll('pre').forEach(pre => {
    const text = pre.textContent;
    const b = document.createElement('button');
    b.className = 'copy-btn'; b.type = 'button'; b.textContent = 'Kopieren'; b.title = 'Code-Block kopieren';
    b.onclick = ev => {
      ev.stopPropagation();
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(text).then(() => { b.textContent = 'Kopiert ✓'; b.classList.add('done'); setTimeout(() => { b.textContent = 'Kopieren'; b.classList.remove('done'); }, 1400); });
    };
    pre.appendChild(b);
  });

  // Suchtreffer hervorheben
  const ph = state.pendingHighlight; state.pendingHighlight = null;
  if (ph && ph.tokens && ph.tokens.length) {
    const n = highlightTerms(view, ph.tokens);
    showHighlightBar(ph.query, n);
    if (ph.section >= 0) setTimeout(() => scrollToSection(ph.section), 80);
    else if (n) setTimeout(() => { const m = view.querySelector('mark.hl'); if (m) m.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 80);
  }
}

function scrollToSection(i) {
  const el = document.getElementById('sec-' + i);
  if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); el.classList.add('sec-flash'); setTimeout(() => el.classList.remove('sec-flash'), 1200); }
}

function highlightTerms(root, tokens) {
  const re = new RegExp('(' + tokens.map(escRe).join('|') + ')', 'gi');
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const p = n.parentElement;
      if (!p || p.closest('.toc, .copy-btn, .hl-bar, mark, .topic-header, .topic-actions, .topic-nav, button')) return NodeFilter.FILTER_REJECT;
      return re.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  let count = 0;
  nodes.forEach(node => {
    const parts = node.nodeValue.split(re);
    if (parts.length < 2) return;
    const frag = document.createDocumentFragment();
    parts.forEach((part, k) => {
      if (k % 2 === 1) { const m = document.createElement('mark'); m.className = 'hl'; m.textContent = part; frag.appendChild(m); count++; }
      else if (part) frag.appendChild(document.createTextNode(part));
    });
    node.parentNode.replaceChild(frag, node);
  });
  return count;
}

function showHighlightBar(query, n) {
  const view = document.getElementById('topic-view');
  if (!view) return;
  const bar = document.createElement('div');
  bar.className = 'hl-bar';
  bar.innerHTML = `<span>🔍 <strong>${n}</strong> Treffer für „${escHtml(query)}“ hervorgehoben</span>
    <span class="hl-actions">
      <button class="btn-secondary" onclick="doSearch('${escHtml(query).replace(/'/g, '&#39;')}')">← Zurück zur Suche</button>
      <button class="btn-secondary" onclick="clearHighlights()">✕ Ausblenden</button>
    </span>`;
  view.insertBefore(bar, view.firstChild);
}
function clearHighlights() {
  document.querySelectorAll('#topic-view mark.hl').forEach(m => m.replaceWith(document.createTextNode(m.textContent)));
  const bar = document.querySelector('.hl-bar'); if (bar) bar.remove();
}

// ---------- Nach-oben-Button ----------
function onContentScroll() {
  const btn = document.getElementById('back-top');
  const c = document.getElementById('content-area');
  if (btn && c) btn.classList.toggle('show', c.scrollTop > 500);
}
