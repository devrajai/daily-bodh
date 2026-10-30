/* Daily Bodh — the full numerology guide, bilingual.
 *
 * Reads data/numerology-guide.json, which carries every field in English and
 * Hindi: planet, element, day, direction, colours, gem, keywords, tagline,
 * overview, pros, cons, career, love, money, health, remedies, mantra, plus
 * master numbers, the personal-year cycle, Lo Shu missing numbers and an FAQ.
 *
 * If the file is not there, this module says so and does nothing else - it does
 * not break the tab. mulank.js remains the built-in fallback either way.
 *
 * Only APPENDS to the Numerology tab.
 *   <script src="numerology-kit.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }
  /* Every field may be a plain string or an {en, hi} pair. */
  function t(v, lang) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    if (Array.isArray(v)) return v.map(function (x) { return t(x, lang); }).join(' ');
    return v[lang] || v.en || '';
  }

  var DATA = null;
  var LANG = 'en';

  function load() {
    if (DATA) return Promise.resolve(DATA);
    return fetch('data/numerology-guide.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (j) { DATA = j; return j; });
  }

  function bullets(v) {
    if (!v) return '';
    var arr = Array.isArray(v) ? v : (typeof v === 'string' ? v.split(/[.;]\s+/) : []);
    if (!arr.length) return '<p>' + esc(t(v, LANG)) + '</p>';
    return '<ul style="margin:4px 0 0;padding-left:18px">' +
      arr.map(function (x) { return '<li>' + esc(t(x, LANG)) + '</li>'; }).join('') + '</ul>';
  }

  function row(k, v) {
    var s = t(v, LANG);
    if (!s) return '';
    return '<tr><td class="k" style="width:30%">' + esc(k) + '</td><td>' + esc(s) + '</td></tr>';
  }

  function numCard(n, d) {
    return '<div class="card">' +
      '<h3>' + esc(t(d.keywords, LANG).split(',')[0] || ('Number ' + n)) +
      ' <span class="muted" style="font-weight:400;font-size:13px">' + n + ' &middot; ' +
      esc(t(d.planet, LANG)) + '</span></h3>' +
      (t(d.tagline, LANG) ? '<p class="muted" style="margin:0 0 8px">' + esc(t(d.tagline, LANG)) + '</p>' : '') +
      (t(d.overview, LANG) ? '<p>' + esc(t(d.overview, LANG)) + '</p>' : '') +
      '<table>' +
      row('Ruling planet', d.planet) + row('Element', d.element) + row('Day', d.day) +
      row('Direction', d.direction) + row('Colours', d.colours) + row('Gem', d.gem) +
      '</table>' +
      '<p style="margin-top:12px"><strong style="color:var(--good)">Strengths</strong></p>' + bullets(d.pros) +
      '<p style="margin-top:10px"><strong style="color:var(--bad)">Weaknesses</strong></p>' + bullets(d.cons) +
      '<p style="margin-top:10px"><strong>Career</strong></p>' + bullets(d.career) +
      '<p style="margin-top:10px"><strong>Love</strong></p>' + bullets(d.love) +
      '<p style="margin-top:10px"><strong>Money</strong></p>' + bullets(d.money) +
      '<p style="margin-top:10px"><strong>Health</strong></p>' + bullets(d.health) +
      '<p style="margin-top:10px"><strong>Remedies</strong></p>' + bullets(d.remedies) +
      (t(d.mantra, LANG) ? '<p><strong>Mantra</strong><br><span class="muted">' + esc(t(d.mantra, LANG)) + '</span></p>' : '') +
      (t(d.famousTrait, LANG) ? '<p><strong>Often known for</strong><br><span class="muted">' + esc(t(d.famousTrait, LANG)) + '</span></p>' : '') +
      '</div>';
  }

  function render() {
    var host = el('kithost');
    if (!host) return;
    var J = DATA;
    if (!J) return;

    var nums = J.numbers || {};
    var keys = Object.keys(nums);

    var chips = '<div class="chips" id="kchips">' +
      keys.map(function (k, i) {
        return '<button class="chip" data-k="' + i + '" aria-pressed="' + (i === 0) + '">' + k + '</button>';
      }).join('') + '</div>';

    var langToggle = '<div class="chips" id="klang">' +
      '<button class="chip" data-l="en" aria-pressed="' + (LANG === 'en') + '">English</button>' +
      '<button class="chip" data-l="hi" aria-pressed="' + (LANG === 'hi') + '">हिन्दी</button></div>';

    host.innerHTML =
      '<div class="card"><h3>Full guide <span class="muted" style="font-weight:400;font-size:13px">' +
      '(strengths, weaknesses, career, love, money, health, remedies)</span></h3>' +
      langToggle + chips + '<div id="kone" style="margin-top:12px"></div></div>' +
      '<div id="kmaster"></div>';

    function show(i) {
      var k = keys[i];
      el('kone').innerHTML = numCard(k, nums[k]);
      Array.prototype.forEach.call(el('kchips').querySelectorAll('[data-k]'), function (b) {
        b.setAttribute('aria-pressed', String(+b.dataset.k === i));
      });
    }
    Array.prototype.forEach.call(el('kchips').querySelectorAll('[data-k]'), function (b) {
      b.onclick = function () { show(+b.dataset.k); };
    });
    Array.prototype.forEach.call(el('klang').querySelectorAll('[data-l]'), function (b) {
      b.onclick = function () { LANG = b.dataset.l; render(); };
    });
    show(0);

    // master numbers, if present
    var M = J.master;
    if (M) {
      var mk = Object.keys(M);
      el('kmaster').innerHTML = '<div class="card"><h3>Master numbers</h3>' +
        mk.map(function (k) {
          var v = M[k];
          return '<p><strong>' + esc(k) + '</strong><br><span class="muted">' +
            esc(t(v && (v.en ? v : (v.overview || v.meaning || v)), LANG)) + '</span></p>';
        }).join('') + '</div>';
    }
  }

  function attach() {
    var sec = el('numerology');
    if (!sec) return;
    var host = el('kithost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'kithost';
      sec.appendChild(host);
    }
    if (DATA && !host.innerHTML.trim()) render();
  }

  function boot() {
    load().then(function () {
      var tries = 0;
      var iv = setInterval(function () {
        attach();
        if (el('kithost') && el('kithost').innerHTML.trim()) clearInterval(iv);
        else if (++tries > 40) clearInterval(iv);
      }, 250);
      window.addEventListener('hashchange', function () { setTimeout(attach, 150); });
    }).catch(function (e) {
      // No file: say so once, quietly, and leave the tab working.
      console.info('[Daily Bodh] numerology-guide.json not found (' + e.message +
        '). Upload it to docs/data/ to enable the full guide.');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
