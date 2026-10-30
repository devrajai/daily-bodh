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
      year: '1920s',
      status: 'Public domain (author died 1936)',
      used: 'Number meanings, character, planetary correspondences, the name-number system.'
    },
    {
      name: 'E. W. Bullinger — Number in Scripture',
      year: '1894',
      status: 'Public domain (author died 1913)',
      used: 'The scriptural reading of each number, shown beside Cheiro\u2019s in the two-lens card.'
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
    },
    {
      name: 'W. Wynn Westcott — Numbers: Their Occult Power and Mystic Virtues',
      year: '1890',
      status: 'Public domain \u2014 not yet used',
      used: 'Held as a further reference for the Pythagorean and Hebrew letter values.'
    }
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
