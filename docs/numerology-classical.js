/* Daily Bodh — classical numerology notes.
 *
 * Summaries in our own words of well-established rules found across the
 * Indian numerology tradition (the same material appears in Harish Johari's
 * Numerology: With Tantra, Ayurveda, and Astrology, Destiny Books, which is
 * in copyright until 2059 and is NOT reproduced here). What follows are the
 * rules themselves - which are facts and freely stated - not that book's text.
 *
 * Three things it adds that the site did not have:
 *
 *   1. Exaltation - a single number carries more force when it reduces from a
 *      particular double number (a 1 from 28, not a 1 from 19).
 *   2. Odd and even qualities - solar/dynamic against lunar/static.
 *   3. The friendly-enemy paradox - the tradition holds that enemy pairings
 *      activate and friendly pairings settle. Worth knowing before reading
 *      any compatibility score as simply "good" or "bad".
 *
 * Only APPENDS to the Numerology tab.
 *   <script src="numerology-classical.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  /* Exalted reductions: single number -> the double numbers it is exalted from. */
  var EXALTED = {
    1: [28], 2: [29], 3: [12], 4: [31], 5: [23, 32],
    6: [24, 33], 7: [25, 34], 8: [26, 35], 9: [27, 36]
  };

  /* Every double number that reduces to each single number, for context. */
  var SOURCES = {
    1: [1, 10, 19, 28, 37, 46, 55, 64, 73, 82, 91],
    2: [2, 11, 20, 29, 38, 47, 56, 65, 74, 83, 92],
    3: [3, 12, 21, 30, 39, 48, 57, 66, 75, 84, 93],
    4: [4, 13, 22, 31, 40, 49, 58, 67, 76, 85, 94],
    5: [5, 14, 23, 32, 41, 50, 59, 68, 77, 86, 95],
    6: [6, 15, 24, 33, 42, 51, 60, 69, 78, 87, 96],
    7: [7, 16, 25, 34, 43, 52, 61, 70, 79, 88, 97],
    8: [8, 17, 26, 35, 44, 53, 62, 71, 80, 89, 98],
    9: [9, 18, 27, 36, 45, 54, 63, 72, 81, 90, 99]
  };

  function reduce(n) {
    n = Math.abs(n);
    while (n > 9) n = String(n).split('').reduce(function (a, b) { return a + +b; }, 0);
    return n;
  }

  function exaltation(day) {
    if (!day) return null;
    var single = reduce(day);
    var from = EXALTED[single] || [];
    return {
      day: day,
      single: single,
      exalted: from.indexOf(day) >= 0,
      sources: from
    };
  }

  function block(e) {
    if (!e) return '';
    var rows = (SOURCES[e.single] || []).map(function (d) {
      var isEx = (EXALTED[e.single] || []).indexOf(d) >= 0;
      var isMine = d === e.day;
      return '<span style="display:inline-block;padding:3px 8px;margin:2px;border-radius:8px;' +
        'font-size:13px;' +
        (isMine ? 'background:var(--accent);color:#fff;font-weight:700;' :
         isEx ? 'background:#ede7fb;color:#4c1d95;font-weight:600;' :
                'background:#f3f1ec;color:#555;') + '">' + d +
        (isEx && !isMine ? ' \u2726' : '') + '</span>';
    }).join('');

    return '<div class="card"><h3>Exaltation <span class="muted" style="font-weight:400;' +
      'font-size:13px">mulank ' + e.single + '</span></h3>' +
      '<p class="muted">A single number carries more force when it reduces from a particular ' +
      'double number. Your birth day is <strong>' + e.day + '</strong>, which reduces to ' +
      '<strong>' + e.single + '</strong>.</p>' +
      (e.exalted
        ? '<p style="color:var(--good)"><strong>Exalted.</strong> ' + e.day +
          ' is the exalted source for ' + e.single + ' \u2014 the tradition treats this as ' +
          'giving the number extra force.</p>'
        : '<p class="muted">Not an exalted source. The exalted sources for ' + e.single +
          ' are ' + e.sources.join(' and ') + '.</p>') +
      '<p class="muted" style="font-size:12px">All the double numbers that reduce to ' +
      e.single + ' \u2014 \u2726 marks the exalted ones:</p>' +
      '<div style="margin-top:4px">' + rows + '</div>' +
      '<div class="warn">Exaltation is a traditional grading of the same single number. It ' +
      'does not make one person better than another born on a different day.</div></div>';
  }

  function static_() {
    return '<div class="card"><h3>Odd and even</h3>' +
      '<p class="muted">The tradition splits the numbers by temperament, and it is worth ' +
      'knowing because it explains why some numbers feel alike.</p>' +
      '<table>' +
      '<tr><td class="k" style="width:26%">Odd &mdash; 1, 3, 5, 7, 9</td>' +
      '<td>Solar, masculine, electrical, dynamic. One number always remains unpaired, ' +
      'which is what makes them active.</td></tr>' +
      '<tr><td class="k">Even &mdash; 2, 4, 6, 8</td>' +
      '<td>Lunar, feminine, magnetic, static. They pair off completely, which is what ' +
      'makes them stable and slower to move.</td></tr>' +
      '</table>' +
      '<p class="muted" style="margin-top:10px">Two numbers of the same parity are held to ' +
      'be less productive together: even plus even stays even and static, odd plus odd also ' +
      'settles. Odd with even stays odd, and that is the dynamic pairing.</p></div>';
  }

  function paradox() {
    return '<div class="card"><h3>Friendly and enemy numbers</h3>' +
      '<p>This one surprises people, and it is worth reading before you take any ' +
      'compatibility score at face value.</p>' +
      '<p>The tradition holds that <strong>friendly numbers together are not very ' +
      'productive</strong> &mdash; like two friends relaxing, nothing gets done. ' +
      '<strong>Enemy numbers together make each other alert and active</strong>, so the ' +
      'pairing that looks worse on a chart is often the one that produces movement.</p>' +
      '<p class="muted">Read in that light, the number checker\u2019s compatibility score is ' +
      'a measure of <em>ease</em>, not of outcome. A low score means friction, and friction ' +
      'is what makes things happen.</p>' +
      '<div class="warn">Different schools weight this differently. Treat it as a lens, ' +
      'not a rule about what will occur.</div></div>';
  }

  function render() {
    var host = el('classichost');
    if (!host) return;
    var nd = el('nd');
    var e = null;
    if (nd && nd.value) {
      var d = new Date(nd.value + 'T00:00:00');
      if (!isNaN(d)) e = exaltation(d.getDate());
    }
    host.innerHTML = (e ? block(e) : '') + static_() + paradox();
  }

  function attach() {
    var sec = el('numerology');
    if (!sec) return;
    var host = el('classichost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'classichost';
      sec.appendChild(host);
    }
    render();
  }

  function boot() {
    document.addEventListener('change', function (ev) {
      if (ev.target && ev.target.id === 'nd') setTimeout(attach, 0);
    }, true);
    document.addEventListener('input', function (ev) {
      if (ev.target && ev.target.id === 'nd') setTimeout(attach, 0);
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
