/* Daily Bodh — Rajju and Vedha, two kootas beyond Ashtakoota.
 *
 * Both are table lookups on the two birth stars, so nothing is downloaded and
 * nothing is stored. This module only APPENDS a card to the Kundali matching
 * screen after the existing 36-point result; it never rewrites that result.
 *
 *   <script src="rajju.js"></script>
 *
 * Tables checked against the classical list: all twelve Vedha pairs and the
 * Mrigashira/Chitra/Dhanishta triple.
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  /* Nakshatras grouped by the part of the body the Rajju runs through.
     The five groups are not equal in size - Shira has three, the rest six. */
  var RAJJU = [
    ['Pada',  'feet',   [0, 8, 9, 17, 18, 26]],
    ['Kati',  'waist',  [1, 7, 10, 16, 19, 25]],
    ['Nabhi', 'navel',  [2, 6, 11, 15, 20, 24]],
    ['Kantha','throat', [3, 5, 12, 14, 21, 23]],
    ['Shira', 'head',   [4, 13, 22]]
  ];

  /* Nakshatras that pierce one another. If the two stars form a pair the
     matching is traditionally held to be inauspicious. */
  var VEDHA = [[0, 17], [1, 16], [2, 15], [3, 14], [5, 21], [6, 20],
               [7, 19], [8, 18], [9, 26], [10, 25], [11, 24], [12, 23]];
  var VEDHA_TRIPLE = [4, 13, 22];   // Mrigashira, Chitra, Dhanishta

  function rajjuOf(n) {
    for (var i = 0; i < RAJJU.length; i++) {
      if (RAJJU[i][2].indexOf(n) >= 0) return RAJJU[i];
    }
    return null;
  }

  function vedhaOf(a, b) {
    for (var i = 0; i < VEDHA.length; i++) {
      var p = VEDHA[i];
      if ((a === p[0] && b === p[1]) || (a === p[1] && b === p[0])) return true;
    }
    if (a !== b && VEDHA_TRIPLE.indexOf(a) >= 0 && VEDHA_TRIPLE.indexOf(b) >= 0) return true;
    return false;
  }

  function card(nakA, nakB) {
    var ra = rajjuOf(nakA), rb = rajjuOf(nakB);
    if (!ra || !rb) return '';
    var same = ra[0] === rb[0];
    var vedha = vedhaOf(nakA, nakB);
    var nameA = (typeof NAK !== 'undefined' && NAK[nakA]) || ('#' + nakA);
    var nameB = (typeof NAK !== 'undefined' && NAK[nakB]) || ('#' + nakB);

    return '<div class="card" id="rajjucard">' +
      '<h3>Rajju and Vedha <span class="muted" style="font-weight:400;font-size:13px">' +
      '(beyond the 36 points)</span></h3>' +
      '<table>' +
      '<tr><td class="k" style="width:34%">Rajju &mdash; first</td>' +
      '<td>' + esc(nameA) + ' &middot; <strong>' + esc(ra[0]) + '</strong> ' +
      '<span class="muted">(' + esc(ra[1]) + ')</span></td></tr>' +
      '<tr><td class="k">Rajju &mdash; second</td>' +
      '<td>' + esc(nameB) + ' &middot; <strong>' + esc(rb[0]) + '</strong> ' +
      '<span class="muted">(' + esc(rb[1]) + ')</span></td></tr>' +
      '<tr><td class="k">Rajju dosha</td>' +
      '<td>' + (same
        ? '<span class="no">Same rajju (' + esc(ra[0]) + ')</span>'
        : '<span class="ok">Different rajju</span>') + '</td></tr>' +
      '<tr><td class="k">Vedha</td>' +
      '<td>' + (vedha
        ? '<span class="no">These two stars pierce one another</span>'
        : '<span class="ok">No vedha</span>') + '</td></tr>' +
      '</table>' +
      '<p class="muted" style="margin-top:10px">Rajju groups the 27 stars by the part of the body ' +
      'the Rajju runs through &mdash; feet, waist, navel, throat, head. Sharing a rajju is ' +
      'traditionally held to be inauspicious, and the concern is usually weighed more heavily for ' +
      'the bride. Vedha is a fixed list of stars that are said to pierce one another.</p>' +
      '<p class="muted">Two points where practice differs: many traditions cancel Vedha when both ' +
      'charts share the same rashi, and some schools apply Rajju only when the stars are the same ' +
      'rather than merely in the same group. Neither cancellation is applied here, so read this as ' +
      'the raw rule.</p>' +
      '<div class="warn">These are two additional traditional tests, not part of the 36-point ' +
      'Ashtakoota score above and not included in its total. A strong or weak result here does not ' +
      'change that score.</div>' +
      '</div>';
  }

  /* Append after the existing matching result, without touching it. */
  function attach() {
    var sec = el('match');
    if (!sec) return;
    var p = sec.person;
    if (!p || !p.A || !p.B) return;
    var host = el('rajjuhost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'rajjuhost';
      sec.appendChild(host);
    }
    host.innerHTML = card(p.A.nak, p.B.nak);
  }

  function boot() {
    // The Calculate button is #mgo2 and writes its result to #mout2. We wait for
    // that render to finish, then append ours after it.
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (t && t.id === 'mgo2') {
        setTimeout(attach, 0);
        setTimeout(attach, 120);
      }
    }, true);
    // Changing a birth star or date updates the model; refresh if a result is showing.
    var sec = el('match');
    if (sec) {
      sec.addEventListener('change', function () {
        if (el('mout2') && el('mout2').innerHTML.trim()) setTimeout(attach, 60);
      });
    }
    window.addEventListener('hashchange', function () {
      if (el('mout2') && el('mout2').innerHTML.trim()) setTimeout(attach, 60);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
