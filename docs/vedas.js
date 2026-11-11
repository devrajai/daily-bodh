/* Daily Bodh — Vedas and Puranas held in Drive.
 *
 * Kept separate from scriptures.js so the existing library is not rewritten
 * each time a text is added. Both cards sit on the Shastra tab.
 *
 * Only texts whose file is uploaded and verified appear here.
 *
 *   <script src="vedas.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  var TEXTS = [
    {
      name: 'Rigveda', sk: '\u090b\u0917\u094d\u0935\u0947\u0926',
      translator: 'Ralph T. H. Griffith', year: '1897', size: '1.4 MB',
      note: 'All 1,028 hymns across ten mandalas. Griffith\u2019s verse translation is the standard ' +
        'public-domain English Rigveda. The oldest of the four Vedas, and the oldest surviving ' +
        'Indo-European religious text \u2014 the hymns were composed over centuries before being ' +
        'written down.',
      drive: 'https://drive.google.com/file/d/1sMZbWHiTnE6Z5oVZmVlldIW2u830mHyv/view'
    },
    {
      name: 'Yajurveda (White)', sk: '\u092f\u091c\u0941\u0930\u094d\u0935\u0947\u0926',
      translator: 'Ralph T. H. Griffith', year: '1899', size: '0.9 MB',
      note: 'The Shukla (white) Yajurveda \u2014 the liturgical Veda: the formulas and directions ' +
        'for the sacrifice. Griffith\u2019s verse translation, public domain.',
      drive: 'https://drive.google.com/file/d/12-s2HA1QW5el2cVwDfdmddhI22_Q8Qgm/view'
    },
    {
      name: 'Vishnu Purana', sk: '\u0935\u093f\u0937\u094d\u0923\u0941 \u092a\u0941\u0930\u093e\u0923',
      translator: 'H. H. Wilson', year: '1866', size: '0.7 MB',
      note: 'The first Purana translated into English, and still the one scholars cite. Covers the ' +
        'creation, the Manvantaras, the royal dynasties, and the life of Krishna in one of its ' +
        'fullest early tellings.',
      drive: 'https://drive.google.com/file/d/1P3yRkkchYInhc4gKCyQvFdsbZpEQ9-tA/view'
    },
    {
      name: 'Sushruta Samhita \u2014 Vol 2', sk: '\u0938\u0941\u0936\u094d\u0930\u0941\u0924 \u0938\u0902\u0939\u093f\u0924\u093e',
      translator: 'Kaviraj Kunja Lal Bhishagratna', year: '1907', size: '1.6 MB',
      note: 'Nidana, Sharira and Chikitsa \u2014 diagnosis, anatomy and therapeutics. With Vols 1 ' +
        'and 3 this completes Bhishagratna\u2019s translation.',
      drive: 'https://drive.google.com/file/d/1QhvSRQhHuHBMw-M1a8AlqYUdrkohOEkj/view'
    }
  ];

  var PENDING = [
    { name: 'Atharvaveda', translator: 'Griffith', year: '1895\u201396',
      why: 'No clean full text located yet; the available copies are partial or modern editions.' },
    { name: 'Samaveda', translator: '\u2014', year: '\u2014',
      why: 'No public-domain English translation located. The archive holds only an index and modern editions.' },
    { name: 'Garuda Purana', translator: 'M. N. Dutt', year: '1890s',
      why: 'The archive copies are Gita Press editions, which are in copyright.' },
    { name: 'Shiv Purana', translator: '\u2014', year: '\u2014',
      why: 'Only modern copyrighted translations were found. The classical Shiva Purana has no clean public-domain English text on the accessible archives.' }
  ];

  function render() {
    var host = el('vedashost');
    if (!host) return;

    host.innerHTML =
      '<div class="card"><h3>Vedas and Puranas</h3>' +
      '<p class="muted">Held in Drive rather than bundled, for the same reason as the rest of the ' +
      'library \u2014 the texts are far larger than the whole site.</p>' +
      TEXTS.map(function (t) {
        return '<div style="padding:12px 0;border-bottom:1px solid #eee">' +
          '<div style="font-weight:700;font-size:15px;color:var(--accent)">' + esc(t.name) +
          ' <span class="muted" style="font-weight:400;font-size:13px">' + esc(t.sk) + '</span></div>' +
          '<div class="muted" style="font-size:12.5px;margin-top:3px">' + esc(t.translator) + ', ' +
          esc(t.year) + ' \u00b7 ' + esc(t.size) + '</div>' +
          '<div style="margin-top:6px">' + esc(t.note) + '</div>' +
          '<p style="margin-top:8px"><a href="' + esc(t.drive) + '" target="_blank" rel="noopener">' +
          'Open in Drive \u2192</a></p></div>';
      }).join('') +
      '<div class="warn">These open in Drive and need a connection. The rest of the site does not.</div></div>' +

      '<div class="card"><h3>Not yet added, and why</h3>' +
      '<p class="muted">Each of these is a specific, checkable blocker rather than a refusal.</p>' +
      PENDING.map(function (p) {
        return '<div style="padding:9px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:13.5px">' + esc(p.name) + '</strong>' +
          '<span class="muted" style="font-size:12.5px"> \u2014 ' + esc(p.translator) + ' (' +
          esc(p.year) + ')</span>' +
          '<div class="muted" style="font-size:12.5px;margin-top:3px">' + esc(p.why) + '</div></div>';
      }).join('') +
      '<div class="warn">A note on the Puranas specifically. Of the eighteen Mahapuranas, only a ' +
      'handful were translated into English before 1930. The complete set has never been done in ' +
      'public-domain English, and the Bhagavata in particular has no free complete translation at ' +
      'all. Any site offering you one is reproducing a copyrighted edition.</div></div>';
  }

  function attach() {
    var sec = el('shastra') || el('jyotish');
    if (!sec) return;
    var host = el('vedashost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'vedashost';
      sec.appendChild(host);
    }
    if (!host.innerHTML.trim()) render();
  }

  function boot() {
    var tries = 0;
    var iv = setInterval(function () {
      if (el('shastra') || el('jyotish')) { attach(); clearInterval(iv); }
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
