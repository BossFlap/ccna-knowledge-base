// ===== Subnetting-Trainer =====

const SUBNET = {
  mode: 'mix',          // net | mask | wildcard | same | plan | mix
  range: 'all',         // all | c (nur /24–/30)
  task: null,
  checked: false,
  start: 0,
  stats: loadJSON('ccna-subnet', { total: 0, correct: 0, timeSum: 0, streak: 0, best: 0, byMode: {} })
};
const SUBNET_MODES = {
  mix:      { label: '🎲 Gemischt',            desc: 'Zufällig aus allen Aufgabentypen — so wie in der Prüfung.' },
  net:      { label: '🧮 Netz bestimmen',      desc: 'IP + Präfix → Netzadresse, Broadcast, Host-Bereich, Anzahl Hosts. Der Klassiker.' },
  mask:     { label: '🔄 Maske ↔ CIDR',        desc: 'Präfixlänge in Dotted-Decimal umrechnen und zurück.' },
  wildcard: { label: '🎭 Wildcard-Maske',      desc: 'Für ACLs und OSPF network-Befehle: Maske → Wildcard.' },
  same:     { label: '🤝 Gleiches Subnetz?',   desc: 'Liegen zwei Hosts im selben Subnetz? Schnell entscheiden.' },
  plan:     { label: '📐 Subnetz planen',       desc: 'Wie viele Hosts / Subnetze brauche ich → welcher Präfix passt?' }
};

// ---------- IPv4-Helfer ----------
function ip2int(ip) { return ip.split('.').reduce((a, o) => (a << 8) + (+o), 0) >>> 0; }
function int2ip(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }
function prefix2mask(p) { return p === 0 ? 0 : (0xFFFFFFFF << (32 - p)) >>> 0; }
function mask2prefix(m) { let n = 0; while (m & 0x80000000) { n++; m = (m << 1) >>> 0; } return n; }
function isValidMask(m) { const p = mask2prefix(m); return prefix2mask(p) === m; }
function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
function randIp(privateOnly) {
  const r = Math.random();
  if (r < 0.4) return ip2int(`10.${rnd(0, 255)}.${rnd(0, 255)}.${rnd(1, 254)}`);
  if (r < 0.7) return ip2int(`192.168.${rnd(0, 255)}.${rnd(1, 254)}`);
  if (r < 0.85) return ip2int(`172.${rnd(16, 31)}.${rnd(0, 255)}.${rnd(1, 254)}`);
  return ip2int(`${rnd(1, 223)}.${rnd(0, 255)}.${rnd(0, 255)}.${rnd(1, 254)}`);
}
function randPrefix() { return SUBNET.range === 'c' ? rnd(24, 30) : (Math.random() < 0.6 ? rnd(20, 30) : rnd(8, 19)); }
function bin(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].map(o => o.toString(2).padStart(8, '0')).join('.'); }
function parseIpInput(s) {
  s = (s || '').trim();
  if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(s)) return null;
  if (s.split('.').some(o => +o > 255)) return null;
  return ip2int(s);
}
function parsePrefixInput(s) { s = (s || '').trim().replace(/^\//, ''); if (!/^\d{1,2}$/.test(s) || +s > 32) return null; return +s; }
function parseNumInput(s) { s = (s || '').trim().replace(/[.\s']/g, ''); if (!/^\d+$/.test(s)) return null; return +s; }

// ---------- Aufgaben erzeugen ----------
function genTask(mode) {
  if (mode === 'mix') { const keys = ['net', 'net', 'mask', 'wildcard', 'same', 'plan']; mode = keys[rnd(0, keys.length - 1)]; }
  const t = { mode };
  if (mode === 'net') {
    t.prefix = randPrefix(); t.ip = randIp();
    t.mask = prefix2mask(t.prefix); t.net = (t.ip & t.mask) >>> 0; t.bc = (t.net | (~t.mask >>> 0)) >>> 0;
    t.hosts = Math.pow(2, 32 - t.prefix) - 2; t.first = t.net + 1; t.last = t.bc - 1;
  } else if (mode === 'mask') {
    t.prefix = randPrefix(); t.mask = prefix2mask(t.prefix); t.dir = Math.random() < 0.5 ? 'toMask' : 'toCidr';
  } else if (mode === 'wildcard') {
    t.prefix = randPrefix(); t.mask = prefix2mask(t.prefix); t.wild = (~t.mask) >>> 0; t.given = Math.random() < 0.5 ? 'cidr' : 'mask';
  } else if (mode === 'same') {
    t.prefix = randPrefix(); t.mask = prefix2mask(t.prefix); t.a = randIp();
    const netA = (t.a & t.mask) >>> 0; const size = Math.pow(2, 32 - t.prefix);
    if (Math.random() < 0.5) { t.b = (netA + rnd(1, Math.max(1, size - 2))) >>> 0; if (t.b === t.a) t.b = (t.b + 1) >>> 0; }
    else { const off = rnd(1, 3) * size * (Math.random() < 0.5 ? 1 : -1); t.b = ((netA + off + rnd(1, Math.max(1, size - 2))) >>> 0); }
    t.same = ((t.a & t.mask) >>> 0) === ((t.b & t.mask) >>> 0);
  } else if (mode === 'plan') {
    t.kind = Math.random() < 0.6 ? 'hosts' : 'subnets';
    t.base = Math.random() < 0.5 ? '192.168.' + rnd(0, 255) + '.0/24' : (Math.random() < 0.5 ? '172.16.0.0/16' : '10.0.0.0/8');
    const basePrefix = +t.base.split('/')[1];
    if (t.kind === 'hosts') {
      t.need = [2, 5, 12, 25, 30, 50, 60, 100, 120, 200, 250, 300, 500, 1000, 2000][rnd(0, 14)];
      let h = 2; let p = 30; while (Math.pow(2, h) - 2 < t.need) { h++; p--; }
      t.answerPrefix = p; t.answerHosts = Math.pow(2, h) - 2;
      if (t.answerPrefix <= basePrefix) { t.base = '10.0.0.0/8'; }
    } else {
      t.need = [2, 3, 4, 6, 8, 12, 16, 30, 50, 60][rnd(0, 9)];
      let bits = 0; while (Math.pow(2, bits) < t.need) bits++;
      t.answerPrefix = basePrefix + bits; t.answerSubnets = Math.pow(2, bits); t.answerHosts = Math.pow(2, 32 - t.answerPrefix) - 2;
    }
    t.answerMask = prefix2mask(t.answerPrefix);
  }
  return t;
}

// ---------- Ansicht ----------
function renderSubnet() {
  state.currentView = 'subnet';
  if (!SUBNET.task) newSubnetTask();
  const s = SUBNET.stats;
  const acc = s.total ? Math.round((s.correct / s.total) * 100) : 0;
  const avg = s.total ? Math.round(s.timeSum / s.total) : 0;
  document.getElementById('content-area').innerHTML = `
    <div id="subnet-view" class="anim-in">
      <div class="topic-header">
        <h2>🧮 Subnetting-Trainer</h2>
        <div class="th-meta"><span class="tag">Blueprint 1.6 · Konfigurieren &amp; Verifizieren</span><span class="tag">Ziel: unter 60 s pro Aufgabe</span></div>
      </div>
      <div class="subnet-modes">
        ${Object.entries(SUBNET_MODES).map(([k, m]) => `<button class="guide-tab ${SUBNET.mode === k ? 'active' : ''}" onclick="setSubnetMode('${k}')" title="${m.desc}">${m.label}</button>`).join('')}
        <label class="sim-toggle" style="margin-left:auto"><input type="checkbox" ${SUBNET.range === 'c' ? 'checked' : ''} onchange="SUBNET.range=this.checked?'c':'all'; newSubnetTask(); renderSubnet()"> Nur /24–/30</label>
      </div>
      <p class="kbd-hint" style="margin-bottom:14px">${SUBNET_MODES[SUBNET.mode].desc} <kbd>Enter</kbd> prüft bzw. lädt die nächste Aufgabe.</p>

      <div class="question-card" id="subnet-card">${renderSubnetTask()}</div>

      <div class="subnet-stats">
        <div class="stat-mini"><div class="sm-num">${s.total}</div><div class="sm-label">Aufgaben</div></div>
        <div class="stat-mini"><div class="sm-num" style="color:${acc >= 80 ? 'var(--success)' : acc >= 60 ? 'var(--warning)' : 'var(--error)'}">${acc}%</div><div class="sm-label">Richtig</div></div>
        <div class="stat-mini"><div class="sm-num">${avg}s</div><div class="sm-label">Ø Zeit</div></div>
        <div class="stat-mini"><div class="sm-num">🔥 ${s.streak}</div><div class="sm-label">Serie (Best ${s.best})</div></div>
        <button class="btn-secondary" onclick="resetSubnetStats()">Statistik zurücksetzen</button>
      </div>

      <div class="content-section">
        <h3>🧠 Spickzettel</h3>
        <div class="table-wrap"><table>
          <tr><th>CIDR</th><th>Maske</th><th>Wildcard</th><th>Blockgröße</th><th>Hosts</th></tr>
          ${[24, 25, 26, 27, 28, 29, 30].map(p => { const m = prefix2mask(p); return `<tr><td>/${p}</td><td>${int2ip(m)}</td><td>${int2ip(~m >>> 0)}</td><td>${Math.pow(2, 32 - p)}</td><td>${Math.pow(2, 32 - p) - 2}</td></tr>`; }).join('')}
          <tr><td>/16 … /23</td><td>255.255.0.0 … 255.255.254.0</td><td>0.0.255.255 … 0.0.1.255</td><td>im 3. Oktett: 256 … 2</td><td>65.534 … 510</td></tr>
        </table></div>
        <div class="callout callout-tip"><strong>Der schnelle Weg</strong>1) Interessantes Oktett finden (das mit Wert ≠ 0 und ≠ 255 in der Maske). 2) Blockgröße = 256 − Maskenwert dort. 3) Netzadresse = grösstes Vielfaches der Blockgröße ≤ IP-Oktett. 4) Broadcast = nächstes Netz − 1. Hosts = 2^(Host-Bits) − 2. Wildcard = 255.255.255.255 − Maske.</div>
      </div>
    </div>`;
  const first = document.querySelector('#subnet-card input');
  if (first && !SUBNET.checked) first.focus();
  scrollTop();
}

function setSubnetMode(m) { SUBNET.mode = m; newSubnetTask(); renderSubnet(); }
function newSubnetTask() { SUBNET.task = genTask(SUBNET.mode); SUBNET.checked = false; SUBNET.start = Date.now(); }
function nextSubnetTask() { newSubnetTask(); const card = document.getElementById('subnet-card'); if (card) { card.innerHTML = renderSubnetTask(); const f = card.querySelector('input'); if (f) f.focus(); } }
function subnetEnter() { if (SUBNET.checked) nextSubnetTask(); else checkSubnetTask(); }
function resetSubnetStats() { if (!confirm('Subnetting-Statistik zurücksetzen?')) return; SUBNET.stats = { total: 0, correct: 0, timeSum: 0, streak: 0, best: 0, byMode: {} }; saveJSON('ccna-subnet', SUBNET.stats); renderSubnet(); }

function inputField(id, label, placeholder, wide) {
  return `<label class="sn-field ${wide ? 'wide' : ''}"><span>${label}</span><input type="text" id="${id}" placeholder="${placeholder}" autocomplete="off" spellcheck="false" onkeydown="if(event.key==='Enter'){event.preventDefault();subnetEnter()}"></label>`;
}

function renderSubnetTask() {
  const t = SUBNET.task;
  let body = '';
  if (t.mode === 'net') {
    body = `<div class="question-num">Netz bestimmen</div>
      <div class="question-text">Host <code class="sn-big">${int2ip(t.ip)}/${t.prefix}</code> — bestimme das Subnetz.</div>
      <div class="sn-grid">
        ${inputField('sn-net', 'Netzadresse', 'z.B. 10.1.2.0')}
        ${inputField('sn-bc', 'Broadcast-Adresse', 'z.B. 10.1.2.255')}
        ${inputField('sn-first', 'Erster Host', '')}
        ${inputField('sn-last', 'Letzter Host', '')}
        ${inputField('sn-hosts', 'Nutzbare Hosts', 'Anzahl')}
      </div>`;
  } else if (t.mode === 'mask') {
    body = t.dir === 'toMask'
      ? `<div class="question-num">CIDR → Maske</div><div class="question-text">Wie lautet die Subnetzmaske für <code class="sn-big">/${t.prefix}</code>?</div><div class="sn-grid">${inputField('sn-mask', 'Subnetzmaske (dotted decimal)', '255.255.255.0', true)}</div>`
      : `<div class="question-num">Maske → CIDR</div><div class="question-text">Welche Präfixlänge entspricht <code class="sn-big">${int2ip(t.mask)}</code>?</div><div class="sn-grid">${inputField('sn-cidr', 'Präfix', '/24')}</div>`;
  } else if (t.mode === 'wildcard') {
    body = `<div class="question-num">Wildcard-Maske</div>
      <div class="question-text">Welche Wildcard-Maske gehört zu <code class="sn-big">${t.given === 'cidr' ? '/' + t.prefix : int2ip(t.mask)}</code>? <span class="kbd-hint">(z.B. für <code>access-list</code> oder <code>network … area 0</code>)</span></div>
      <div class="sn-grid">${inputField('sn-wild', 'Wildcard', '0.0.0.255', true)}</div>`;
  } else if (t.mode === 'same') {
    body = `<div class="question-num">Gleiches Subnetz?</div>
      <div class="question-text">Liegen <code class="sn-big">${int2ip(t.a)}</code> und <code class="sn-big">${int2ip(t.b)}</code> mit Maske <code class="sn-big">/${t.prefix}</code> im selben Subnetz?</div>
      <div class="sn-yesno"><button class="option-btn" onclick="checkSubnetTask(true)"><span class="opt-letter">J</span>Ja, gleiches Subnetz</button><button class="option-btn" onclick="checkSubnetTask(false)"><span class="opt-letter">N</span>Nein, verschiedene Subnetze</button></div>`;
  } else if (t.mode === 'plan') {
    body = t.kind === 'hosts'
      ? `<div class="question-num">Subnetz planen</div><div class="question-text">Aus <code class="sn-big">${t.base}</code> brauchst du ein Subnetz für <strong>${t.need} Hosts</strong>. Welcher Präfix ist der <em>kleinstmögliche</em> (= grösste Präfixlänge), der reicht?</div>
        <div class="sn-grid">${inputField('sn-pfx', 'Präfixlänge', '/27')}${inputField('sn-ph', 'Nutzbare Hosts damit', 'Anzahl')}</div>`
      : `<div class="question-num">Subnetz planen</div><div class="question-text">Das Netz <code class="sn-big">${t.base}</code> soll in mindestens <strong>${t.need} gleich grosse Subnetze</strong> aufgeteilt werden. Welche Präfixlänge brauchst du?</div>
        <div class="sn-grid">${inputField('sn-pfx', 'Neue Präfixlänge', '/27')}${inputField('sn-ph', 'Nutzbare Hosts pro Subnetz', 'Anzahl')}</div>`;
  }
  const timer = `<div class="sn-timer" id="sn-timer">⏱️ 0 s</div>`;
  const controls = t.mode === 'same' ? '' : `<div class="quiz-controls"><span></span><button class="btn-primary" onclick="checkSubnetTask()">Prüfen ✓</button></div>`;
  startSubnetTimer();
  return timer + body + controls + `<div class="feedback-box" id="sn-feedback"></div>`;
}

let _snTimer = null;
function startSubnetTimer() {
  clearInterval(_snTimer);
  _snTimer = setInterval(() => {
    const el = document.getElementById('sn-timer');
    if (!el || state.currentView !== 'subnet') { clearInterval(_snTimer); return; }
    if (!SUBNET.checked) el.textContent = '⏱️ ' + Math.round((Date.now() - SUBNET.start) / 1000) + ' s';
  }, 500);
}

function v(id) { const el = document.getElementById(id); return el ? el.value : ''; }
function mark(id, ok) { const el = document.getElementById(id); if (el) { el.classList.add(ok ? 'ok' : 'bad'); el.disabled = true; } }

function checkSubnetTask(yesNo) {
  if (SUBNET.checked) return;
  const t = SUBNET.task;
  const secs = Math.round((Date.now() - SUBNET.start) / 1000);
  let allOk = true; let expl = '';

  if (t.mode === 'net') {
    const checks = [
      ['sn-net', parseIpInput(v('sn-net')) === t.net, int2ip(t.net)],
      ['sn-bc', parseIpInput(v('sn-bc')) === t.bc, int2ip(t.bc)],
      ['sn-first', parseIpInput(v('sn-first')) === t.first, int2ip(t.first)],
      ['sn-last', parseIpInput(v('sn-last')) === t.last, int2ip(t.last)],
      ['sn-hosts', parseNumInput(v('sn-hosts')) === t.hosts, t.hosts.toLocaleString('de-DE')]
    ];
    checks.forEach(([id, ok]) => { mark(id, ok); if (!ok) allOk = false; });
    const oct = Math.floor((t.prefix - 1) / 8);               // interessantes Oktett (0-basiert)
    const maskOct = (t.mask >>> ((3 - oct) * 8)) & 255;
    const block = 256 - maskOct;
    const ipOct = (t.ip >>> ((3 - oct) * 8)) & 255;
    expl = `<div class="sn-solution">
      <div><strong>Lösung:</strong> Netz <code>${int2ip(t.net)}</code> · Broadcast <code>${int2ip(t.bc)}</code> · Hosts <code>${int2ip(t.first)}</code> – <code>${int2ip(t.last)}</code> · <code>${t.hosts.toLocaleString('de-DE')}</code> nutzbar</div>
      <pre><code>Maske /${t.prefix} = ${int2ip(t.mask)}
IP    ${bin(t.ip)}
Maske ${bin(t.mask)}
      ${'^'.repeat(t.prefix + Math.floor((t.prefix - 1) / 8))} Netzanteil (${t.prefix} Bit)   Hostanteil ${32 - t.prefix} Bit → 2^${32 - t.prefix} − 2 = ${t.hosts.toLocaleString('de-DE')}

Interessantes Oktett: Nr. ${oct + 1} (Maskenwert ${maskOct}) → Blockgröße 256 − ${maskOct} = ${block}
${ipOct} liegt im Block ${Math.floor(ipOct / block) * block} … ${Math.floor(ipOct / block) * block + block - 1}
→ Netz ${int2ip(t.net)}, Broadcast ${int2ip(t.bc)}</code></pre></div>`;
    ['sn-net', 'sn-bc', 'sn-first', 'sn-last', 'sn-hosts'].forEach(id => { const el = document.getElementById(id); if (el && el.classList.contains('bad')) el.value = el.value + '   → ' + checks.find(c => c[0] === id)[2]; });
  } else if (t.mode === 'mask') {
    if (t.dir === 'toMask') { const ok = parseIpInput(v('sn-mask')) === t.mask; mark('sn-mask', ok); allOk = ok; }
    else { const ok = parsePrefixInput(v('sn-cidr')) === t.prefix; mark('sn-cidr', ok); allOk = ok; }
    expl = `<div class="sn-solution"><div><strong>Lösung:</strong> /${t.prefix} = <code>${int2ip(t.mask)}</code></div><pre><code>${bin(t.mask)}   ← ${t.prefix} Einsen von links
Merkwerte: 128 192 224 240 248 252 254 255  (1…8 Bit im Oktett)</code></pre></div>`;
  } else if (t.mode === 'wildcard') {
    const ok = parseIpInput(v('sn-wild')) === t.wild; mark('sn-wild', ok); allOk = ok;
    expl = `<div class="sn-solution"><div><strong>Lösung:</strong> Wildcard <code>${int2ip(t.wild)}</code></div><pre><code>255.255.255.255
− ${int2ip(t.mask).padEnd(15)}  (Maske /${t.prefix})
= ${int2ip(t.wild)}</code></pre></div>`;
  } else if (t.mode === 'same') {
    allOk = (yesNo === t.same);
    document.querySelectorAll('#subnet-card .option-btn').forEach((b, i) => { b.disabled = true; const isYes = i === 0; if (isYes === t.same) b.classList.add('correct'); if (isYes === yesNo && !allOk) b.classList.add('wrong'); });
    expl = `<div class="sn-solution"><div><strong>Lösung:</strong> ${t.same ? 'Ja — gleiches Subnetz' : 'Nein — verschiedene Subnetze'}</div><pre><code>${int2ip(t.a).padEnd(16)} AND /${t.prefix} → ${int2ip((t.a & t.mask) >>> 0)}
${int2ip(t.b).padEnd(16)} AND /${t.prefix} → ${int2ip((t.b & t.mask) >>> 0)}</code></pre></div>`;
  } else if (t.mode === 'plan') {
    const okP = parsePrefixInput(v('sn-pfx')) === t.answerPrefix; mark('sn-pfx', okP);
    const okH = parseNumInput(v('sn-ph')) === t.answerHosts; mark('sn-ph', okH);
    allOk = okP && okH;
    expl = t.kind === 'hosts'
      ? `<div class="sn-solution"><div><strong>Lösung:</strong> /${t.answerPrefix} (${int2ip(t.answerMask)}) → ${t.answerHosts.toLocaleString('de-DE')} nutzbare Hosts</div><pre><code>Gesucht: 2^h − 2 ≥ ${t.need}  →  h = ${32 - t.answerPrefix} Host-Bits (2^${32 - t.answerPrefix} − 2 = ${t.answerHosts.toLocaleString('de-DE')})
Präfix = 32 − ${32 - t.answerPrefix} = /${t.answerPrefix}</code></pre></div>`
      : `<div class="sn-solution"><div><strong>Lösung:</strong> /${t.answerPrefix} (${int2ip(t.answerMask)}) → ${t.answerSubnets} Subnetze à ${t.answerHosts.toLocaleString('de-DE')} Hosts</div><pre><code>Gesucht: 2^n ≥ ${t.need}  →  n = ${t.answerPrefix - +t.base.split('/')[1]} geliehene Bits (2^${t.answerPrefix - +t.base.split('/')[1]} = ${t.answerSubnets} Subnetze)
Neuer Präfix = /${t.base.split('/')[1]} + ${t.answerPrefix - +t.base.split('/')[1]} = /${t.answerPrefix}</code></pre></div>`;
  }

  SUBNET.checked = true;
  clearInterval(_snTimer);
  const s = SUBNET.stats;
  s.total++; s.timeSum += secs;
  if (allOk) { s.correct++; s.streak++; s.best = Math.max(s.best, s.streak); } else s.streak = 0;
  const bm = s.byMode[t.mode] || (s.byMode[t.mode] = { total: 0, correct: 0 });
  bm.total++; if (allOk) bm.correct++;
  saveJSON('ccna-subnet', s);
  logActivity('questions');

  const fb = document.getElementById('sn-feedback');
  fb.classList.add('visible', allOk ? 'correct-fb' : 'wrong-fb');
  fb.innerHTML = `<div class="fb-title">${allOk ? '✅ Richtig' : '❌ Nicht ganz'} — ${secs} s${allOk && secs <= 60 ? ' · unter einer Minute 👍' : ''}</div>${expl}
    <div class="quiz-controls" style="margin-top:12px"><span></span><button class="btn-primary" id="sn-next" onclick="nextSubnetTask()">Nächste Aufgabe → <kbd style="margin-left:6px">Enter</kbd></button></div>`;
  const nb = document.getElementById('sn-next'); if (nb) nb.focus();
  const statsEl = document.querySelector('.subnet-stats');
  if (statsEl) { const acc = Math.round((s.correct / s.total) * 100); statsEl.querySelectorAll('.sm-num')[0].textContent = s.total; statsEl.querySelectorAll('.sm-num')[1].textContent = acc + '%'; statsEl.querySelectorAll('.sm-num')[2].textContent = Math.round(s.timeSum / s.total) + 's'; statsEl.querySelectorAll('.sm-num')[3].textContent = '🔥 ' + s.streak; }
}
