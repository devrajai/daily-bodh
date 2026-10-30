/* Daily Bodh — sources and contact, at the end of the Numerology tab.
 *
 * A reader who reaches the bottom of this tab has seen six different cards, each
 * citing something different. This gathers the sources in one place and gives a
 * way to report a mistake, which is the only honest thing to offer when the
 * content comes from many books.
 *
 * No form, no server, no data collection: the contact link is a plain mailto, so
 * nothing is transmitted unless the reader chooses to send it.
 *
 * Only APPENDS to the Numerology tab, and loads last so it sits at the bottom.
 *   <script src="numerology-sources.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  var SOURCES = [
    {
      name: 'Cheiro — Book of Numbers',
      year: '1926',
      status: 'Public domain (author died 1936)',
      used: 'Number meanings, character, planetary correspondences, the name-number system. This is the backbone of the tab.'
    },
    {
      name: 'E. W. Bullinger — Number in Scripture',
      year: '1894',
      status: 'Public domain (author died 1913)',
      used: 'The scriptural reading of each number, shown beside Cheiro in the two-lens card.'
    },
    {
      name: 'Harish Johari — Numerology: With Tantra, Ayurveda, and Astrology',
      year: 'Destiny Books',
      status: 'In copyright \u2014 rules restated, text not reproduced',
      used: 'Exaltation, odd and even qualities, the friendly-enemy paradox. The rules are facts and freely stated; his prose is not reproduced.'
    },
    {
      name: 'Classical Jyotish (Parashari) planetary friendship',
      year: 'traditional',
      status: 'Public domain',
      used: 'The compatibility table behind the number checker.'
    }
  ];

  /* The wider public-domain canon. Every title here was published before 1929,
     so the copyright has expired and the full text may be read, quoted and
     adapted. None of these are used yet - they are listed so the reader can see
     what this tab could draw on, and so nobody has to guess about permissions. */
  var AVAILABLE = [
    { name: 'L. Dow Balliett — The Philosophy of Numbers', year: '1908', note: 'Founder of Western numerology. Number vibration, tone and colour.' },
    { name: 'L. Dow Balliett — Nature\u2019s Symphony', year: '1911', note: 'Name vibration and birth date applied to daily living.' },
    { name: 'Clifford W. Cheasley — Numerology: Its Facts and Secrets', year: '1914', note: 'Popularised the word "numerology"; Life Path and Destiny numbers.' },
    { name: 'Sepharial — The Kabala of Numbers', year: '1911\u20131913', note: 'Kabbalistic values, planetary hours, geometric forms.' },
    { name: 'W. Wynn Westcott — Numbers: Their Occult Power', year: '1890', note: 'Pythagorean, Gnostic, Kabbalistic and Hermetic readings of 1\u201312.' },
    { name: 'Curtiss — The Key to the Universe', year: '1915', note: 'Numbers 1\u201310, sacred geometry and Tarot correspondences.' },
    { name: 'Curtiss — The Key of Destiny', year: '1919', note: 'Numbers 11\u201322, including the master numbers.' },
    { name: 'Isidore Kozminsky — Numbers, Their Meaning and Magic', year: '1912', note: 'Chaldean, Hebrew and Egyptian correspondences.' },
    { name: 'Nicomachus — Introduction to Arithmetic', year: 'c. 100 CE', note: 'The root treatise on odd, even, prime and perfect numbers.' },
    { name: 'Iamblichus — The Theology of Arithmetic', year: 'c. 4th c. CE', note: 'The Monad through the Decad.' }
  ];

  function render() {
    var host = el('sourceshost');
    if (!host) return;

    var rows = SOURCES.map(function (s) {
      return '<div style="padding:11px 0;border-bottom:1px solid #eee">' +
        '<strong>' + esc(s.name) + '</strong>' +
        ' <span class="muted" style="font-size:12px">' + esc(s.year) + '</span><br>' +
        '<span class="muted" style="font-size:12.5px">' + esc(s.status) + '</span><br>' +
        '<span>' + esc(s.used) + '</span></div>';
    }).join('');

    host.innerHTML =
      '<div class="card"><h3>Sources used on this tab</h3>' +
      '<p class="muted">Every card above draws on one or more of these. Where a book is still in ' +
      'copyright, the rule is restated in our own words rather than copied \u2014 which is why some ' +
      'entries read shorter than the original.</p>' +
      rows +
      '<h4 style="margin:18px 0 6px;font-size:14px">Also in the public domain, not yet used</h4>' +
      '<p class="muted" style="font-size:12.5px">All published before 1929, so free to read and quote in full. ' +
      'Listed so the scope of this tab is visible.</p>' +
      AVAILABLE.map(function (a) {
        return '<div style="padding:7px 0;border-bottom:1px solid #f2f0f6">' +
          '<strong style="font-size:13.5px">' + esc(a.name) + '</strong> ' +
          '<span class="muted" style="font-size:12px">' + esc(a.year) + '</span><br>' +
          '<span class="muted" style="font-size:12.5px">' + esc(a.note) + '</span></div>';
      }).join('') +
      '<div class="warn"><strong>Found something wrong?</strong> Numbers are arithmetic and should be ' +
      'checkable; if a sum or a date looks off, that is a bug worth fixing. Send a note to ' +
      '<a href="mailto:916355477058@phone.sarvam.ai?subject=Daily%20Bodh%20%E2%80%94%20numerology%20correction" ' +
      'style="color:var(--accent)">916355477058@phone.sarvam.ai</a> with the number and what you ' +
      'expected. Nothing is collected automatically \u2014 the link only opens your own mail app.</div>' +
      '<p class="muted" style="margin-top:12px;font-size:12.5px">Numerology here is presented as a ' +
      'tradition to think with, not as a science and not as a forecast. If something on this tab ' +
      'matters to a real decision \u2014 health, money, a relationship \u2014 talk to a doctor, a ' +
      'qualified adviser, or someone who knows you well.</p>' +
      '</div>';
  }

  function attach() {
    var sec = el('numerology');
    if (!sec) return;
    var host = el('sourceshost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'sourceshost';
      sec.appendChild(host);   // appended, so it lands at the bottom
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
