/* Daily Bodh — the Ask screen.
 *
 * Two layers, and the distinction between them matters:
 *
 * 1. COMPUTED ANSWERS. A fixed set of question shapes matched against data the
 *    site already ships. These are exact, work offline, and cannot be wrong in
 *    the way a model is wrong — they either find the number or say they cannot.
 *
 * 2. AN OPTIONAL MODEL. Off by default. The site ships with NO key: the reader
 *    pastes their own free Gemini or Groq key, which is kept in their browser's
 *    localStorage and never in this repository. Everything it answers is
 *    labelled as generated and may be wrong. Remove the key and it is gone.
 *
 * Nothing here sends birth data to a model. Only the question text is sent, so
 * the model can explain a concept but cannot see anyone's chart.
 *
 * This file registers its own tab, so index.html needs one line:
 *   <script src="ask.js"></script>   (after kundli.js)
 */
(function () {
  'use strict';

  var DAILY_LIMIT = 20;               // model calls per browser per day
  var KEY_STORE = 'db_ai_key', PROVIDER_STORE = 'db_ai_provider', COUNT_STORE = 'db_ai_count';

  /* ------------------------------------------------------------ utilities */
  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function todayIso() {
    var d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  }

  /* The place and birth date come from the Kundli screen when it has them. */
  function birthDate() {
    var kd = el('kd');
    return (kd && kd.value) ? kd.value : '';
  }

  /* ------------------------------------------------------- the answer set
     Each entry: keywords that trigger it, and a function returning HTML.
     Keeping these explicit is the point: the screen never invents an answer. */
  var INTENTS = [
    {
      id: 'sadesati',
      match: /sade\s*sati|shani\s*sade|sadhe\s*sati/i,
      run: async function () {
        var d = birthDate();
        if (!d) return need('a birth date');
        var SAD = await data('sadesati.json');
        var b = await birthStar(d);
        if (!b) return need('a birth date in the bundled range (1930–2035)');
        var wins = (SAD.windows && SAD.windows[String(b.rashi)]) || [];
        var now = todayIso();
        var cur = wins.filter(function (w) { return w[0] <= now && now <= w[1]; })[0];
        var next = wins.filter(function (w) { return w[0] > now; })[0];
        var out = '<p>Your Moon is in <strong>' + esc(RASHI[b.rashi].split(' (')[0]) +
          '</strong> (birth star ' + esc(NAK[b.nak]) + ', pada ' + b.pada + ').</p>';
        if (cur) out += '<p><strong>You are in Sade Sati now:</strong> ' + cur[0] + ' to ' + cur[1] + ' (' + cur[2] + ' years).</p>';
        else if (next) out += '<p><strong>Next Sade Sati:</strong> ' + next[0] + ' to ' + next[1] + ' (' + next[2] + ' years).</p>';
        else out += '<p>No Sade Sati window for this Moon sign falls inside the bundled range.</p>';
        return out + '<p class="muted">Saturn transiting the 12th, 1st and 2nd from the natal Moon. Severity depends on Saturn\'s strength in the full chart, which this does not assess.</p>';
      }
    },
    {
      id: 'retrograde',
      match: /retrograde|vakri|mercury\s*retro/i,
      run: async function () {
        var RG = await data('retrograde.json');
        var now = todayIso();
        var rows = [];
        Object.keys(RG.retrograde).forEach(function (b) {
          var w = RG.retrograde[b];
          var cur = w.filter(function (x) { return x[0] <= now && now <= x[1]; })[0];
          var next = w.filter(function (x) { return x[0] > now; })[0];
          if (cur) rows.push('<tr><td>' + b + '</td><td><span class="no">Retrograde now</span></td><td>' + cur[0] + ' to ' + cur[1] + '</td></tr>');
          else if (next) rows.push('<tr><td>' + b + '</td><td class="muted">next</td><td>' + next[0] + ' to ' + next[1] + '</td></tr>');
        });
        return '<table>' + rows.join('') + '</table><p class="muted">Computed from the bundled JPL DE421 ephemeris.</p>';
      }
    },
    {
      id: 'nakshatra',
      match: /nakshatra|birth\s*star|rashi|moon\s*sign|naam\s*akshar|naming|namkaran|namakaran/i,
      run: async function () {
        var d = birthDate();
        if (!d) return need('a birth date');
        var b = await birthStar(d);
        if (!b) return need('a birth date in the bundled range');
        var out = '<p>Moon sign: <strong>' + esc(RASHI[b.rashi]) + '</strong><br>' +
          'Birth star: <strong>' + esc(NAK[b.nak]) + '</strong>, pada ' + b.pada + '</p>';
        try {
          var N = await data('naamakaran.json');
          var key = null;
          Object.keys(N.padas).forEach(function (k) {
            if (k.indexOf(NAK[b.nak].split(' ')[0]) === 0) key = k;
          });
          if (key) {
            out += '<p>Naming syllables for this pada: <strong>' + esc(N.padas[key][b.pada - 1]) +
              '</strong> <span class="muted">(all four: ' + esc(N.padas[key].join(', ')) + ')</span></p>';
          }
        } catch (e) { /* the naming table is optional */ }
        return out + '<p class="muted">The star is taken from the Moon at noon, so a birth late or early in the day may differ. Use the exact star if you know it.</p>';
      }
    },
    {
      id: 'panchang',
      match: /panchang|tithi|today|aaj|auspicious\s*today/i,
      run: async function () {
        var P = await data('panchang.json');
        var day = todayIso();
        var d = P.days.filter(function (x) { return x.d === day; })[0];
        if (!d) return '<p>No panchang bundled for today. The range is ' + P.from + ' to ' + P.to + '.</p>';
        return '<p><strong>' + esc(d.vara) + ' · ' + esc(d.paksha) + ' ' + esc(d.tithi) + '</strong></p><table>' +
          '<tr><td class="k">Nakshatra</td><td>' + esc(d.nakshatra) + ' till ' + esc(d.nakEnd) + '</td></tr>' +
          '<tr><td class="k">Yoga</td><td>' + esc(d.yoga) + '</td></tr>' +
          '<tr><td class="k">Karana</td><td>' + esc(d.karana) + '</td></tr>' +
          '<tr><td class="k">Sunrise / sunset</td><td>' + esc(d.sunrise) + ' / ' + esc(d.sunset) + '</td></tr>' +
          '<tr><td class="k">Rahu kalam</td><td>' + esc(d.rahu) + '</td></tr>' +
          '<tr><td class="k">Abhijit</td><td>' + esc(d.abhijit) + '</td></tr>' +
          '</table><p class="muted">Delhi, IST. Regional panchangs differ by a day on some observances.</p>';
      }
    },
    {
      id: 'remedy',
      match: /remedy|remedies|upay|mantra|pooja|puja|daan|what\s*should\s*i\s*do/i,
      run: async function () {
        var D = await data('doshas.json');
        var it = D.items.filter(function (x) { return x.id === 'd-remedies'; })[0];
        if (!it) return need('the remedies reference');
        return '<p><strong>' + esc(it.text) + '</strong></p><p>' + esc(it.summary_2to3line) + '</p>' +
          '<ol>' + (it.steps || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' +
          '<div class="warn">' + esc(it.bodh_3to4line) + '</div>';
      }
    },
    {
      id: 'numerology',
      match: /numerolog|mulank|bhagyank|lucky\s*number|lo\s*shu/i,
      run: async function () {
        var d = birthDate();
        if (!d) return need('a birth date');
        var dt = new Date(d + 'T00:00:00');
        if (isNaN(dt)) return need('a valid birth date');
        var mul = reduce(dt.getDate());
        var bh = reduce(reduce(dt.getFullYear()) + reduce(dt.getMonth() + 1) + reduce(dt.getDate()));
        return '<p>Mulank (psychic): <strong>' + mul + '</strong><br>Bhagyank (destiny): <strong>' + bh + '</strong></p>' +
          '<p class="muted">Traditional numerological reduction of your birth date. Not a forecast.</p>';
      }
    }
  ];

  function need(what) {
    return '<p class="muted">To answer that I need ' + esc(what) + '. Enter it on the Kundli screen, then ask again.</p>';
  }

  /* Full-text search over the reference packs, for questions with no intent. */
  async function search(q) {
    var packs = ['doshas.json', 'jyotish.json', 'shastra.json', 'palmistry.json', 'lalkitab.json'];
    var words = q.toLowerCase().split(/\s+/).filter(function (w) { return w.length > 3; });
    if (!words.length) return '';
    var hits = [];
    for (var i = 0; i < packs.length; i++) {
      try {
        var P = await data(packs[i]);
        (P.items || []).forEach(function (it) {
          var hay = ((it.text || '') + ' ' + (it.summary_1line || '') + ' ' +
                     (it.summary_2to3line || '') + ' ' + (it.bodh_3to4line || '')).toLowerCase();
          var score = words.filter(function (w) { return hay.indexOf(w) >= 0; }).length;
          if (score) hits.push({ score: score, it: it, pack: packs[i] });
        });
      } catch (e) { /* a missing pack is fine */ }
    }
    hits.sort(function (a, b) { return b.score - a.score; });
    if (!hits.length) return '';
    return '<p class="muted">From the reference library:</p>' + hits.slice(0, 3).map(function (h) {
      return '<div class="item"><div class="t">' + esc(h.it.text || h.it.id) + '</div>' +
        '<div class="muted">' + esc(h.it.summary_1line || '') + '</div>' +
        '<div class="b" style="display:block">' + esc(h.it.summary_2to3line || '') + '</div></div>';
    }).join('');
  }

  /* ------------------------------------------------------------- the model
     Optional, off unless the reader supplies a key. The key lives in their
     browser only. Only the question is sent — never a birth chart. */
  var PROVIDERS = {
    gemini: {
      label: 'Google Gemini (free tier)',
      url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      call: async function (key, prompt) {
        var r = await fetch(this.url + '?key=' + encodeURIComponent(key), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: SYSTEM + '\n\nQuestion: ' + prompt }] }] })
        });
        if (!r.ok) throw new Error('Gemini returned HTTP ' + r.status);
        var j = await r.json();
        return (j.candidates && j.candidates[0] && j.candidates[0].content &&
                j.candidates[0].content.parts[0].text) || '';
      }
    },
    groq: {
      label: 'Groq (free tier)',
      url: 'https://api.groq.com/openai/v1/chat/completions',
      call: async function (key, prompt) {
        var r = await fetch(this.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              { role: 'system', content: SYSTEM },
              { role: 'user', content: prompt }
            ],
            max_tokens: 400
          })
        });
        if (!r.ok) throw new Error('Groq returned HTTP ' + r.status);
        var j = await r.json();
        return (j.choices && j.choices[0] && j.choices[0].message.content) || '';
      }
    }
  };

  var SYSTEM =
    'You explain Indian astrology (jyotisha), numerology and palmistry as traditional knowledge. ' +
    'Rules: answer in at most 120 words. Never predict a specific event, death, illness, marriage ' +
    'date or financial outcome. Never tell anyone to buy a gemstone, pay for a ritual, fast ' +
    'unsafely or stop medical treatment. If asked for a prediction, say plainly that the tradition ' +
    'offers themes for reflection, not forecasts. If you are unsure of a classical rule, say so.';

  function key() { try { return localStorage.getItem(KEY_STORE) || ''; } catch (e) { return ''; } }
  function provider() { try { return localStorage.getItem(PROVIDER_STORE) || 'gemini'; } catch (e) { return 'gemini'; } }

  function usage() {
    try {
      var raw = JSON.parse(localStorage.getItem(COUNT_STORE) || '{}');
      if (raw.d !== todayIso()) return { d: todayIso(), n: 0 };
      return raw;
    } catch (e) { return { d: todayIso(), n: 0 }; }
  }
  function bump() {
    var u = usage(); u.n++;
    try { localStorage.setItem(COUNT_STORE, JSON.stringify(u)); } catch (e) {}
    return u;
  }

  async function askModel(q) {
    var k = key();
    if (!k) return '<p class="muted">No key set. Add one below to use the model.</p>';
    var u = usage();
    if (u.n >= DAILY_LIMIT) {
      return '<p class="muted">Daily limit reached (' + DAILY_LIMIT + ' questions). It resets tomorrow, ' +
        'which keeps a free tier from being exhausted.</p>';
    }
    var P = PROVIDERS[provider()] || PROVIDERS.gemini;
    try {
      var out = await P.call(k, q);
      bump();
      return '<div class="warn" style="background:#f3eefc;border-color:#ddd0f5;color:#4a3d63">' +
        '<strong>Generated by ' + esc(P.label) + ' — not from this site\'s data, and it may be wrong.</strong></div>' +
        '<p>' + esc(out.trim()).replace(/\n{2,}/g, '</p><p>') + '</p>';
    } catch (e) {
      return '<p class="muted">The model could not be reached: ' + esc(e.message) + '. ' +
        'Check the key, or ask something the site can compute.</p>';
    }
  }

  /* --------------------------------------------------------------- render */
  function shell() {
    var k = key(), u = usage();
    var provs = Object.keys(PROVIDERS).map(function (p) {
      return '<option value="' + p + '"' + (p === provider() ? ' selected' : '') + '>' +
        esc(PROVIDERS[p].label) + '</option>';
    }).join('');
    return '' +
      '<h2>Ask</h2>' +
      '<p class="lead">Ask about a term, a dosha, a date, or your own chart. Answers marked ' +
      '<em>computed</em> come from this site\'s own data and are exact; anything from a model is labelled.</p>' +
      '<div class="card">' +
      '  <label for="askq">Your question</label>' +
      '  <input id="askq" placeholder="e.g. when is my Sade Sati? / what is Kaal Sarp? / is today good for a puja?">' +
      '  <button class="go" id="askgo">Ask</button>' +
      '  <div id="askout" style="margin-top:14px"></div>' +
      '</div>' +
      '<div class="card">' +
      '  <h3>Ask a model <span class="muted" style="font-weight:400;font-size:13px">(optional)</span></h3>' +
      '  <p class="muted">This site ships with <strong>no API key</strong>. If you paste your own free key ' +
      'it is stored only in this browser and used only when you ask. Only your question is sent — ' +
      'never your birth details. Leave it empty and this section does nothing.</p>' +
      '  <label for="askprov">Provider</label>' +
      '  <select id="askprov">' + provs + '</select>' +
      '  <label for="askkey">Your API key</label>' +
      '  <input id="askkey" type="password" placeholder="paste your free key" value="' + esc(k) + '">' +
      '  <div class="row" style="margin-top:10px">' +
      '    <button class="go" id="asksave" style="margin-top:0">Save key</button>' +
      '    <button class="go" id="askclear" style="margin-top:0;background:#7a5a2b">Remove key</button>' +
      '  </div>' +
      '  <p class="muted" id="askstatus" style="margin-top:10px">' +
      (k ? 'Key saved. ' + u.n + ' of ' + DAILY_LIMIT + ' questions used today.'
         : 'No key saved — the model is off.') + '</p>' +
      '  <div class="warn">A model can state classical rules that do not exist, and can be confidently ' +
      'wrong about your chart. Treat anything it says as a starting point to check, not an answer. ' +
      'Nothing here is medical, legal or financial advice.</div>' +
      '</div>';
  }

  function mount() {
    var main = document.querySelector('main');
    if (!main || document.getElementById('ask')) return;
    var s = document.createElement('section');
    s.id = 'ask'; s.setAttribute('role', 'tabpanel'); s.setAttribute('tabindex', '0');
    main.appendChild(s);

    if (typeof TABS !== 'undefined' && Array.isArray(TABS)) {
      TABS.push(['ask', 'Ask', render]);
      var tabs = document.getElementById('tabs');
      if (tabs) {
        tabs.innerHTML = TABS.map(function (t) {
          return '<button data-t="' + t[0] + '" role="tab" aria-controls="' + t[0] + '">' + t[1] + '</button>';
        }).join('');
        Array.prototype.forEach.call(tabs.querySelectorAll('button'), function (b) {
          b.onclick = function () { show(b.dataset.t); };
        });
      }
    }
  }

  async function render() {
    var s = document.getElementById('ask');
    if (!s) return;
    s.innerHTML = shell();
    el('askgo').onclick = run;
    el('askq').onkeydown = function (e) { if (e.key === 'Enter') run(); };
    el('asksave').onclick = function () {
      try {
        localStorage.setItem(KEY_STORE, el('askkey').value.trim());
        localStorage.setItem(PROVIDER_STORE, el('askprov').value);
      } catch (e) {}
      render();
    };
    el('askclear').onclick = function () {
      try { localStorage.removeItem(KEY_STORE); localStorage.removeItem(COUNT_STORE); } catch (e) {}
      render();
    };
  }

  async function run() {
    var q = (el('askq').value || '').trim();
    var out = el('askout');
    if (!q) { out.innerHTML = ''; return; }
    out.innerHTML = '<p class="muted">Looking…</p>';
    var body = '';
    try {
      var hit = INTENTS.filter(function (i) { return i.match.test(q); })[0];
      if (hit) body += await hit.run();
      if (!body) body = await search(q);
      if (!body) {
        body = '<p class="muted">This site can answer questions about Sade Sati, retrograde planets, ' +
          'your nakshatra and naming syllables, today\'s panchang, remedies, and numerology — ' +
          'and it can search its reference library. It will not guess at anything else.</p>';
      }
    } catch (e) {
      body = '<p class="muted">Could not answer that: ' + esc(e.message) + '</p>';
    }
    var ai = '';
    if (key()) ai = await askModel(q);
    out.innerHTML = '<div class="card" style="margin:0">' + body + '</div>' + ai;
  }

  mount();
})();
