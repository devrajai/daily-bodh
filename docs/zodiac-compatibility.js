/* Daily Bodh — zodiac sign compatibility.
 *
 * Compare any two signs, or derive them from two birth dates. The score is built
 * from the three things the tradition actually uses, not from a vibe:
 *
 *   1. Element  - Fire, Earth, Air, Water. Same element harmonises; Fire with
 *                 Air and Earth with Water support each other; Fire with Water
 *                 and Air with Earth work against each other.
 *   2. Modality - Cardinal, Fixed, Mutable. Two of the same modality compete.
 *   3. Aspect   - the angular distance between the signs. Trine and sextile are
 *                 easy, square is hard, opposition is attraction with friction.
 *
 * Each part is stated on the card so the score can be argued with.
 *
 * Only APPENDS to the Numerology tab.
 *   <script src="zodiac-compatibility.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  var SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
               'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  var SHORT = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];

  var ELEMENT = {
    Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
    Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
    Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
    Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
  };
  var MODALITY = {
    Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
    Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
    Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable'
  };

  function elementScore(a, b) {
    var x = ELEMENT[a], y = ELEMENT[b];
    if (x === y) return { s: 1, why: 'Same element (' + x + ') — they understand each other without explaining.' };
    if ((x === 'Fire' && y === 'Air') || (x === 'Air' && y === 'Fire'))
      return { s: 1, why: 'Fire and Air feed each other — air gives fire its oxygen.' };
    if ((x === 'Earth' && y === 'Water') || (x === 'Water' && y === 'Earth'))
      return { s: 1, why: 'Earth and Water support each other — water nourishes, earth holds.' };
    if ((x === 'Fire' && y === 'Water') || (x === 'Water' && y === 'Fire'))
      return { s: -1, why: 'Fire and Water cancel — one heats, the other cools and quenches.' };
    return { s: -1, why: x + ' and ' + y + ' pull in different directions.' };
  }

  function modalityScore(a, b) {
    // The same sign is a conjunction, not a contest. Two different signs of the
    // same modality do compete; one sign with itself does not.
    if (a === b) return { s: 0, why: 'The same sign — no competing modality.' };
    if (MODALITY[a] === MODALITY[b])
      return { s: -1, why: 'Both ' + MODALITY[a].toLowerCase() + ' — they want the same role and compete for it.' };
    return { s: 0, why: MODALITY[a] + ' with ' + MODALITY[b] + ' — different tempos, which usually helps.' };
  }

  function aspect(a, b) {
    var i = SIGNS.indexOf(a), j = SIGNS.indexOf(b);
    var d = (j - i + 12) % 12;
    var m = d > 6 ? 12 - d : d;   // 0..6
    var table = {
      0: { name: 'Conjunction', s: 2, why: 'Same sign — intense recognition, and no distance to see yourself.' },
      1: { name: 'Semi-sextile', s: 0, why: 'One sign apart — mild, neither helpful nor difficult.' },
      2: { name: 'Sextile', s: 2, why: 'Two signs apart — easy cooperation, opportunity.' },
      3: { name: 'Square', s: -2, why: 'Three signs apart — friction. The classic hard aspect.' },
      4: { name: 'Trine', s: 3, why: 'Four signs apart — the easiest aspect in the tradition.' },
      5: { name: 'Quincunx', s: -1, why: 'Five signs apart — awkward, they keep missing each other.' },
      6: { name: 'Opposition', s: 1, why: 'Opposite signs — strong attraction and strong friction at once.' }
    };
    return table[m];
  }

  function analyse(a, b) {
    var e = elementScore(a, b), mo = modalityScore(a, b), as = aspect(a, b);
    var raw = e.s + mo.s + as.s;          // roughly -4 .. +5
    // Map the raw range (-4..+5) onto 10..95 rather than 0..100. A flat 0%
    // would read as "impossible", which no part of the tradition claims, and
    // 100% would read as "guaranteed". The extremes are capped deliberately.
    var pct = Math.round(10 + ((raw + 4) / 9) * 85);
    pct = Math.max(10, Math.min(95, pct));
    var label = pct >= 78 ? 'Very compatible' : pct >= 58 ? 'Compatible'
      : pct >= 40 ? 'Mixed' : 'Difficult';
    return { e: e, m: mo, a: as, raw: raw, pct: pct, label: label };
  }

  function card(a, b) {
    var r = analyse(a, b);
    function row(label, s, why) {
      return '<tr><td class="k" style="width:26%">' + esc(label) + '</td>' +
        '<td style="width:10%;color:' + (s > 0 ? 'var(--good)' : s < 0 ? 'var(--bad)' : '#6b6478') +
        ';font-weight:700">' + (s > 0 ? '+' + s : s) + '</td>' +
        '<td class="muted" style="font-size:12.5px">' + esc(why) + '</td></tr>';
    }
    return '<div class="card" id="zodcard"><h3>' + esc(a) + ' &amp; ' + esc(b) + '</h3>' +
      '<p class="muted">' + esc(ELEMENT[a]) + ' / ' + esc(MODALITY[a]) + ' with ' +
      esc(ELEMENT[b]) + ' / ' + esc(MODALITY[b]) + '</p>' +
      '<table>' +
      row('Element', r.e.s, r.e.why) +
      row('Modality', r.m.s, r.m.why) +
      row(r.a.name, r.a.s, r.a.why) +
      '</table>' +
      '<p style="margin-top:12px"><strong>' + r.pct + '% — ' + r.label + '</strong></p>' +
      '<div class="warn">This scores the signs, not the people. Two charts with the same signs can differ ' +
      'enormously once the Moon, the ascendant and the rest of the chart are read — which is what the ' +
      'Matching tab is for. A sign pairing is the coarsest possible reading, and it is offered as a ' +
      'starting point, not a verdict.</div></div>';
  }

  function grid() {
    var head = '<tr><td class="k" style="width:12%"></td>';
    for (var c = 0; c < 12; c++) head += '<td style="text-align:center;font-size:11px;font-weight:700">' +
      SHORT[c] + '</td>';
    head += '</tr>';

    var body = '';
    for (var i = 0; i < 12; i++) {
      body += '<tr><td class="k" style="font-size:11.5px;font-weight:700">' + SHORT[i] + '</td>';
      for (var j = 0; j < 12; j++) {
        var r = analyse(SIGNS[i], SIGNS[j]);
        var bg = r.pct >= 70 ? '#e8f5ec' : r.pct >= 50 ? '#f3f1ec' : r.pct >= 35 ? '#fdf4e3' : '#fdeaea';
        body += '<td title="' + SIGNS[i] + ' &amp; ' + SIGNS[j] + ': ' + r.pct + '%" ' +
          'style="text-align:center;background:' + bg + ';font-size:11px;padding:4px 0">' +
          r.pct + '</td>';
      }
      body += '</tr>';
    }

    return '<div class="card"><h3>All 144 sign pairs</h3>' +
      '<p class="muted">Read a row against a column. The number is the compatibility percentage for ' +
      'that pairing of signs.</p>' +
      '<div style="overflow-x:auto"><table style="min-width:420px">' + head + body + '</table></div>' +
      '<div class="warn">Element, modality and aspect are the traditional building blocks and every ' +
      'astrologer weights them differently. This is one defensible weighting, stated so you can see it ' +
      'and disagree.</div></div>';
  }

  function render() {
    var host = el('zodhost');
    if (!host) return;

    var opts = SIGNS.map(function (s) { return '<option value="' + s + '">' + s + '</option>'; }).join('');

    host.innerHTML =
      '<div class="card"><h3>Compare two signs</h3>' +
      '<p class="muted">Pick two signs, or two birth dates and the Sun sign is worked out for you.</p>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">' +
      '<div style="flex:1;min-width:130px"><label>First sign</label>' +
      '<select id="zodA">' + opts + '</select></div>' +
      '<div style="flex:1;min-width:130px"><label>Second sign</label>' +
      '<select id="zodB">' + opts + '</select></div>' +
      '</div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px">' +
      '<div style="flex:1;min-width:130px"><label>Or first birth date</label>' +
      '<input id="zodDA" type="date"></div>' +
      '<div style="flex:1;min-width:130px"><label>Or second birth date</label>' +
      '<input id="zodDB" type="date"></div>' +
      '</div>' +
      '<div id="zodout" style="margin-top:14px"></div></div>' +
      grid();

    /* Sun sign from a date. Cusp dates vary by a day between years, so this uses
       the common table and says so. */
    function sunSign(md) {
      var m = md.getMonth() + 1, d = md.getDate();
      var cuts = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
      var idx = d < cuts[m - 1] ? m - 1 : m;
      return SIGNS[(idx + 9) % 12];   // Jan 1 area -> Capricorn
    }

    function go() {
      var a = el('zodA').value, b = el('zodB').value;
      var da = el('zodDA').value, db = el('zodDB').value;
      if (da) { var d1 = new Date(da + 'T00:00:00'); if (!isNaN(d1)) a = sunSign(d1); }
      if (db) { var d2 = new Date(db + 'T00:00:00'); if (!isNaN(d2)) b = sunSign(d2); }
      el('zodout').innerHTML = card(a, b);
    }

    el('zodA').onchange = go;
    el('zodB').onchange = go;
    el('zodDA').onchange = go;
    el('zodDB').onchange = go;
    el('zodB').selectedIndex = 4;   // Leo, so the first view is not Aries-Aries
    go();
  }

  function attach() {
    var sec = el('match');
    if (!sec) return;
    var host = el('zodhost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'zodhost';
      sec.appendChild(host);
    }
    if (!host.innerHTML.trim()) render();
  }

  function boot() {
    var tries = 0;
    var iv = setInterval(function () {
      if (el('match')) { attach(); clearInterval(iv); }
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
