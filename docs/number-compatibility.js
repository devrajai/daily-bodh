/* Daily Bodh — number compatibility.
 *
 * Compare any two numbers, or derive them from two birth dates. Shows how the
 * two relate in the classical planetary friendship, in BOTH directions - the
 * relation is not symmetric, and pretending it is would be a lie of convenience.
 *
 * Also renders the full 9x9 grid so a reader can see every pair at once.
 *
 * The table is the Parashari natural friendship mapped onto the numbers:
 *   1 Sun  2 Moon  3 Jupiter  4 Rahu  5 Mercury
 *   6 Venus 7 Ketu 8 Saturn   9 Mars
 *
 * Only APPENDS to the Numerology tab.
 *   <script src="number-compatibility.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }
  function reduce(n) {
    n = Math.abs(n);
    while (n > 9) n = String(n).split('').reduce(function (a, b) { return a + +b; }, 0);
    return n;
  }

  var PLANET = { 1: 'Sun', 2: 'Moon', 3: 'Jupiter', 4: 'Rahu', 5: 'Mercury',
                 6: 'Venus', 7: 'Ketu', 8: 'Saturn', 9: 'Mars' };

  var FRIEND = {
    1: [2, 3, 9], 2: [1, 5], 3: [1, 2, 9], 4: [5, 6, 8], 5: [1, 6],
    6: [5, 8], 7: [6, 8, 9], 8: [4, 5, 6], 9: [1, 2, 3]
  };
  var ENEMY = {
    1: [6, 8], 2: [], 3: [5, 6], 4: [1, 2, 9], 5: [2],
    6: [1, 2], 7: [1, 2], 8: [1, 2, 9], 9: [5]
  };

  function rel(a, b) {
    if (a === b) return 'own';
    if ((FRIEND[a] || []).indexOf(b) >= 0) return 'friend';
    if ((ENEMY[a] || []).indexOf(b) >= 0) return 'enemy';
    return 'neutral';
  }

  var WORD = { own: 'Same number', friend: 'Friendly', neutral: 'Neutral', enemy: 'Friction' };
  var SCORE = { own: 3, friend: 2, neutral: 1, enemy: 0 };

  function colour(k) {
    return k === 'own' || k === 'friend' ? 'var(--good)'
      : k === 'enemy' ? 'var(--bad)' : '#6b6478';
  }
  function bg(k) {
    return k === 'own' ? '#ede7fb' : k === 'friend' ? '#e8f5ec'
      : k === 'enemy' ? '#fdeaea' : '#f3f1ec';
  }

  function pairCard(a, b) {
    var ab = rel(a, b), ba = rel(b, a);
    var score = SCORE[ab] + SCORE[ba];
    var pct = Math.round((score / 6) * 100);
    var label = pct >= 80 ? 'Strongly compatible' : pct >= 55 ? 'Workable'
      : pct >= 35 ? 'Mixed' : 'Strained';

    return '<div class="card"><h3>' + a + ' &amp; ' + b + '</h3>' +
      '<p class="muted">' + esc(PLANET[a]) + ' with ' + esc(PLANET[b]) + '</p>' +
      '<table>' +
      '<tr><td class="k" style="width:38%">' + a + ' &rarr; ' + b + '</td>' +
      '<td style="color:' + colour(ab) + '"><strong>' + WORD[ab] + '</strong></td></tr>' +
      '<tr><td class="k">' + b + ' &rarr; ' + a + '</td>' +
      '<td style="color:' + colour(ba) + '"><strong>' + WORD[ba] + '</strong></td></tr>' +
      '</table>' +
      (ab !== ba
        ? '<p class="muted" style="margin-top:8px">The relation runs both ways differently here: ' +
          esc(PLANET[a]) + ' treats ' + esc(PLANET[b]) + ' as ' + WORD[ab].toLowerCase() + ', while ' +
          esc(PLANET[b]) + ' treats ' + esc(PLANET[a]) + ' as ' + WORD[ba].toLowerCase() +
          '. Planetary friendship is not always mutual, and the tradition records it that way.</p>'
        : '') +
      '<p style="margin-top:10px"><strong>Compatibility ' + pct + '%</strong> &mdash; ' + label + '</p>' +
      '<div class="warn">Read with care: the tradition also holds that <strong>friendly numbers ' +
      'settle and enemy numbers activate</strong>. A low score means friction, and friction is what ' +
      'makes things move. It is not a verdict on a person.</div></div>';
  }

  function grid() {
    var head = '<tr><td class="k" style="width:12%"></td>';
    for (var c = 1; c <= 9; c++) head += '<td style="text-align:center;font-weight:700">' + c + '</td>';
    head += '</tr>';

    var body = '';
    for (var r = 1; r <= 9; r++) {
      body += '<tr><td class="k" style="font-weight:700">' + r + '</td>';
      for (var c2 = 1; c2 <= 9; c2++) {
        var k = rel(r, c2);
        body += '<td title="' + r + ' → ' + c2 + ': ' + WORD[k] + '" ' +
          'style="text-align:center;background:' + bg(k) + ';color:' + colour(k) +
          ';font-size:13px;padding:5px 0">' + (k === 'own' ? '\u2022' : k === 'friend' ? '\u2713'
            : k === 'enemy' ? '\u2717' : '\u2013') + '</td>';
      }
      body += '</tr>';
    }

    return '<div class="card"><h3>All 81 pairs</h3>' +
      '<p class="muted">Read a row against a column: the number on the left, meeting the number on top. ' +
      '\u2713 friendly &middot; \u2717 friction &middot; \u2013 neutral &middot; \u2022 same number.</p>' +
      '<div style="overflow-x:auto"><table style="min-width:320px">' + head + body + '</table></div>' +
      '<div class="warn">Different books draw the planetary friendship slightly differently. This uses ' +
      'the standard Parashari relation, in which the Moon has no natural enemies - which is why row 2 ' +
      'shows no friction at all, even though popular numerology often calls 2 and 8 a clash.</div></div>';
  }

  function render() {
    var host = el('comphost');
    if (!host) return;

    var a = (el('cmpA') && el('cmpA').value) || '';
    var b = (el('cmpB') && el('cmpB').value) || '';

    host.innerHTML =
      '<div class="card"><h3>Compare two numbers</h3>' +
      '<p class="muted">Enter two mulank numbers, or two birth dates and the mulank is worked out for you.</p>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">' +
      '<div style="flex:1;min-width:130px"><label>First</label>' +
      '<input id="cmpA" inputmode="numeric" placeholder="1 to 9" value="' + esc(a) + '"></div>' +
      '<div style="flex:1;min-width:130px"><label>Second</label>' +
      '<input id="cmpB" inputmode="numeric" placeholder="1 to 9" value="' + esc(b) + '"></div>' +
      '</div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px">' +
      '<div style="flex:1;min-width:130px"><label>Or first birth date</label>' +
      '<input id="cmpDA" type="date"></div>' +
      '<div style="flex:1;min-width:130px"><label>Or second birth date</label>' +
      '<input id="cmpDB" type="date"></div>' +
      '</div>' +
      '<div id="cmpout" style="margin-top:14px"></div></div>' +
      grid();

    function current() {
      var da = el('cmpDA').value, db = el('cmpDB').value;
      var na = el('cmpA').value ? parseInt(el('cmpA').value, 10) : null;
      var nb = el('cmpB').value ? parseInt(el('cmpB').value, 10) : null;
      if (da) { var d1 = new Date(da + 'T00:00:00'); if (!isNaN(d1)) na = reduce(d1.getDate()); }
      if (db) { var d2 = new Date(db + 'T00:00:00'); if (!isNaN(d2)) nb = reduce(d2.getDate()); }
      if (na && (na < 1 || na > 9)) na = reduce(na);
      if (nb && (nb < 1 || nb > 9)) nb = reduce(nb);
      return [na, nb];
    }

    function go() {
      var p = current();
      el('cmpout').innerHTML = (p[0] && p[1]) ? pairCard(p[0], p[1])
        : '<p class="muted">Enter two numbers, or two birth dates.</p>';
    }

    ['cmpA', 'cmpB'].forEach(function (id) {
      var n = el(id); if (n) n.oninput = go;
    });
    ['cmpDA', 'cmpDB'].forEach(function (id) {
      var n = el(id); if (n) n.onchange = go;
    });
    go();
  }

  function attach() {
    var sec = el('numerology');
    if (!sec) return;
    var host = el('comphost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'comphost';
      sec.appendChild(host);
    }
    if (!host.innerHTML.trim()) render();
  }

  function boot() {
    var tries = 0;
    var iv = setInterval(function () {
      if (el('numerology')) { attach(); clearInterval(iv); }
      else if (++tries > 40) clearInterval(iv);
    }, 250);
    window.addEventListener('hashchange', function () { setTimeout(attach, 200); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
