/* Daily Bodh — two lenses on the same number.
 *
 * Every number meaning on this site so far comes from Cheiro's system. That is
 * one tradition. This adds a second, older and independent one, so the reader
 * can see that "7" does not mean the same thing to everyone.
 *
 *   Cheiro (early 1900s)      - planetary temperament, character
 *   Bullinger, Number in Scripture (1894) - scriptural symbolism
 *
 * E. W. Bullinger died in 1913 and his book was published in 1894, so it is in
 * the public domain; the summaries below follow his own chapter arguments.
 *
 * Only APPENDS to the Numerology tab.
 *   <script src="numerology-lenses.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }
  function t(v) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    if (Array.isArray(v)) return v.map(t).join('; ');
    return v.en || '';
  }

  /* Bullinger's chapter arguments, summarised in our own words. */
  var BULLINGER = {
    1: { key: 'Unity', text: 'Unity and primacy. One is indivisible and not made up of other numbers, so it is independent of all and the source of all - his argument for the sovereignty of the First Cause.' },
    2: { key: 'Difference', text: 'Difference and division. One excludes all difference; two affirms that there is another. The difference may be for good or for evil, which is why he treats two as carrying a two-fold character.' },
    3: { key: 'Divine perfection', text: 'Divine perfection. Three is the first figure that can enclose a space - two straight lines cannot form a plane figure, and three dimensions are needed for a solid. Hence the cube, the simplest solid.' },
    4: { key: 'Creation', text: 'Creation. Four is three plus one: the revelation of God followed by the works of God. He marks it as the number of the world that was made.' },
    5: { key: 'Grace', text: 'Grace and redemption. Five is four plus one - creation followed by a people called out, redeemed and saved. Redemption follows creation.' },
    6: { key: 'Man', text: 'Man. Six is 4+2, 5+1 or 7-1, and he reads each of those as man falling short: man\'s world with man\'s enmity, grace made of none effect, or coming short of spiritual perfection. The human number, and the number of imperfection.' },
    7: { key: 'Spiritual perfection', text: 'Spiritual perfection. He calls it the great number, occupying the largest place in nature and in Scripture.' },
    8: { key: 'Superabundance', text: 'Superabundance and new beginning. From the Hebrew root for "to make fat", "to super-abound". Seven was the day of completion and rest; eight is the eighth day, the day that follows completion - resurrection and a new start.' },
    9: { key: 'Finality', text: 'Finality. He notes the mathematical property that the digits of any multiple of nine sum to a multiple of nine, and reads nine as the last of the digits - the end of a matter.' }
  };

  var DATA = null;

  function load() {
    if (DATA) return Promise.resolve(DATA);
    return fetch('data/numerology-guide.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { DATA = j; return j; })
      .catch(function () { return null; });
  }

  function render() {
    var host = el('lenshost');
    if (!host) return;

    var rows = '';
    for (var n = 1; n <= 9; n++) {
      var ch = DATA && DATA.numbers && DATA.numbers[String(n)] ? DATA.numbers[String(n)] : null;
      var cheiro = ch ? (t(ch.keywords) || (Array.isArray(ch.pros) ? t(ch.pros[0]) : '')) : '';
      var b = BULLINGER[n];
      rows += '<div style="padding:12px 0;border-bottom:1px solid #eee">' +
        '<div style="font-size:17px;font-weight:700;color:var(--accent)">' + n + '</div>' +
        '<div style="margin-top:5px"><span class="muted" style="font-size:12px;' +
        'text-transform:uppercase;letter-spacing:.04em">Cheiro</span><br>' +
        esc(cheiro || 'See the full guide above.') + '</div>' +
        '<div style="margin-top:7px"><span class="muted" style="font-size:12px;' +
        'text-transform:uppercase;letter-spacing:.04em">Bullinger &middot; ' + esc(b.key) +
        '</span><br>' + esc(b.text) + '</div></div>';
    }

    host.innerHTML =
      '<div class="card"><h3>Two traditions, same numbers</h3>' +
      '<p class="muted">Everything else on this tab follows Cheiro, who read numbers through the planets. ' +
      'E. W. Bullinger read them through scripture instead. They often disagree, and that is the point: ' +
      'the number is the same, the lens is not.</p>' +
      rows +
      '<div class="warn">Neither reading is a fact about you. Two well-documented traditions, two different ' +
      'answers &mdash; which is worth knowing before trusting any single book. Bullinger, <em>Number in ' +
      'Scripture</em> (1894), is in the public domain; the summaries above follow his own chapter arguments.</div>' +
      '</div>';
  }

  function attach() {
    var sec = el('numerology');
    if (!sec) return;
    var host = el('lenshost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'lenshost';
      sec.appendChild(host);
    }
    if (!host.innerHTML.trim()) render();
  }

  function boot() {
    load().then(function () {
      var tries = 0;
      var iv = setInterval(function () {
        attach();
        if (el('lenshost') && el('lenshost').innerHTML.trim()) clearInterval(iv);
        else if (++tries > 40) clearInterval(iv);
      }, 250);
      window.addEventListener('hashchange', function () { setTimeout(attach, 150); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
