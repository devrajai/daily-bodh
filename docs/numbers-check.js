/* Daily Bodh — check any number against your mulank.
 *
 * Mobile numbers, vehicle numbers, house numbers, business names: enter any
 * number and this reduces it, compares it to your mulank and bhagyank, and says
 * whether it harmonises.
 *
 * The compatibility table is the classical planetary friendship used in Jyotish,
 * mapped onto the numbers:
 *
 *   1 Sun   2 Moon   3 Jupiter   4 Rahu   5 Mercury
 *   6 Venus 7 Ketu   8 Saturn    9 Mars
 *
 * That mapping is why 6 and 8 sit well together (Venus and Saturn are friends)
 * and why 3 finds 5 hard (Jupiter and Mercury are not). Different books draw the
 * friendship slightly differently; this uses the standard Parashari relation
 * and says so on the card. Note that in Parashari the Moon has no natural
 * enemies, which is why 2 has an empty enemy list here even though popular
 * numerology often calls 2 and 8 a clash.
 *
 * Only APPENDS to the Numerology tab.
 *   <script src="numbers-check.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  var PLANET = { 1: 'Sun', 2: 'Moon', 3: 'Jupiter', 4: 'Rahu', 5: 'Mercury',
                 6: 'Venus', 7: 'Ketu', 8: 'Saturn', 9: 'Mars' };

  /* Classical Parashari friendship, as number relations.
     friends = natural friends; enemies = natural enemies; the rest are neutral. */
  var FRIEND = {
    1: [2, 3, 9], 2: [1, 5], 3: [1, 2, 9], 4: [5, 6, 8], 5: [1, 6],
    6: [5, 8], 7: [6, 8, 9], 8: [4, 5, 6], 9: [1, 2, 3]
  };
  var ENEMY = {
    1: [6, 8], 2: [], 3: [5, 6], 4: [1, 2, 9], 5: [2],
    6: [1, 2], 7: [1, 2], 8: [1, 2, 9], 9: [5]
  };

  function reduce(n) {
    n = Math.abs(n);
    while (n > 9) n = String(n).split('').reduce(function (a, b) { return a + +b; }, 0);
    return n;
  }

  function relation(base, other) {
    if (base === other) return { kind: 'own', label: 'Same number', tone: 'good' };
    if ((FRIEND[base] || []).indexOf(other) >= 0) return { kind: 'friend', label: 'Friendly', tone: 'good' };
    if ((ENEMY[base] || []).indexOf(other) >= 0) return { kind: 'enemy', label: 'Friction', tone: 'bad' };
    return { kind: 'neutral', label: 'Neutral', tone: 'mid' };
  }

  function score(rel) {
    return rel.kind === 'own' ? 3 : rel.kind === 'friend' ? 2 : rel.kind === 'neutral' ? 1 : 0;
  }

  function verdict(total, mul, bhag) {
    var r1 = mul ? relation(mul, total) : null;
    var r2 = bhag ? relation(bhag, total) : null;
    var s = (r1 ? score(r1) : 0) + (r2 ? score(r2) : 0);
    var max = (r1 ? 3 : 0) + (r2 ? 3 : 0);
    var pct = max ? Math.round((s / max) * 100) : 0;
    if (!r1 && !r2) return { pct: null, label: 'Enter your birth date to compare' };
    if (pct >= 80) return { pct: pct, label: 'Strongly supportive' };
    if (pct >= 55) return { pct: pct, label: 'Workable' };
    if (pct >= 35) return { pct: pct, label: 'Mixed' };
    return { pct: pct, label: 'Strained' };
  }

  function digitsOf(s) {
    return String(s).replace(/\D/g, '');
  }

  function card(raw, mul, bhag) {
    var digits = digitsOf(raw);
    if (!digits) return '';
    var sum = digits.split('').reduce(function (a, b) { return a + +b; }, 0);
    var total = reduce(sum);
    var v = verdict(total, mul, bhag);

    var rows = '';
    if (mul) {
      var r1 = relation(mul, total);
      rows += '<tr><td class="k" style="width:34%">Against mulank ' + mul +
        ' (' + PLANET[mul] + ')</td><td style="color:' +
        (r1.tone === 'good' ? 'var(--good)' : r1.tone === 'bad' ? 'var(--bad)' : 'inherit') +
        '">' + r1.label + '</td></tr>';
    }
    if (bhag) {
      var r2 = relation(bhag, total);
      rows += '<tr><td class="k">Against bhagyank ' + bhag +
        ' (' + PLANET[bhag] + ')</td><td style="color:' +
        (r2.tone === 'good' ? 'var(--good)' : r2.tone === 'bad' ? 'var(--bad)' : 'inherit') +
        '">' + r2.label + '</td></tr>';
    }

    return '<div class="card" id="numcheckcard">' +
      '<h3>' + esc(raw) + ' <span class="muted" style="font-weight:400;font-size:13px">' +
      digits.length + ' digits</span></h3>' +
      '<table>' +
      '<tr><td class="k" style="width:34%">Digit sum</td><td>' + sum + '</td></tr>' +
      '<tr><td class="k">Reduced to</td><td><strong style="font-size:20px;color:var(--accent)">' +
      total + '</strong> &middot; ' + esc(PLANET[total]) + '</td></tr>' +
      rows +
      '</table>' +
      (v.pct !== null
        ? '<p style="margin-top:12px"><strong>Compatibility ' + v.pct + '%</strong> &mdash; ' + esc(v.label) + '</p>'
        : '<p class="muted" style="margin-top:12px">' + esc(v.label) + '</p>') +
      '<div class="warn">Compatibility uses the classical planetary friendship ' +
      '(Parashari), mapped to numbers. Books differ slightly on these relations, and ' +
      'no number arrangement decides how a life goes. This is a traditional reading, ' +
      'not a guarantee about a phone, a car or a house.</div>' +
      '</div>';
  }

  function render() {
    var host = el('numcheckhost');
    if (!host) return;
    var nd = el('nd');
    var mul = null, bhag = null;
    if (nd && nd.value) {
      var d = new Date(nd.value + 'T00:00:00');
      if (!isNaN(d)) {
        mul = reduce(d.getDate());
        bhag = reduce(reduce(d.getDate()) + reduce(d.getMonth() + 1) + reduce(d.getFullYear()));
      }
    }
    var val = (el('numcheck') && el('numcheck').value) || '';

    host.innerHTML =
      '<div class="card"><h3>Check a number</h3>' +
      '<p class="muted">Mobile, vehicle, house or business number. It is reduced the same way ' +
      'as your own numbers, then compared with your mulank and bhagyank.</p>' +
      '<input id="numcheck" type="text" inputmode="numeric" placeholder="e.g. 9876543210" ' +
      'value="' + esc(val) + '" style="width:100%;padding:10px;border-radius:10px;' +
      'border:1px solid #d8d2e4;font-size:16px">' +
      (mul ? '<p class="muted" style="font-size:12px;margin-top:6px">Comparing against your ' +
        'mulank ' + mul + ' and bhagyank ' + bhag + '.</p>'
        : '<p class="muted" style="font-size:12px;margin-top:6px">Enter your birth date above ' +
          'to compare against your own numbers.</p>') +
      '<div id="numresult" style="margin-top:12px"></div></div>';

    var inp = el('numcheck');
    inp.oninput = function () {
      var r = el('numresult');
      r.innerHTML = card(inp.value, mul, bhag);
    };
    if (val) el('numresult').innerHTML = card(val, mul, bhag);
  }

  function attach() {
    var sec = el('numerology');
    if (!sec) return;
    var host = el('numcheckhost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'numcheckhost';
      sec.appendChild(host);
    }
    // re-render when the birth date changes so the comparison updates
    render();
  }

  function boot() {
    document.addEventListener('change', function (e) {
      if (e.target && e.target.id === 'nd') setTimeout(attach, 0);
    }, true);
    var tries = 0;
    var iv = setInterval(function () {
      if (el('numerology') && el('nd')) { attach(); clearInterval(iv); }
      else if (++tries > 40) clearInterval(iv);
    }, 250);
    window.addEventListener('hashchange', function () { setTimeout(attach, 150); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
