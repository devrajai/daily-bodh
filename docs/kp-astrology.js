/* Daily Bodh — KP (Krishnamurti Paddhati), and how it differs from this site.
 *
 * KP is one of the most widely practised systems in India and it disagrees with
 * classical Vedic on the points that matter most. Rather than pretend one is
 * correct, this sets out what KP does and where the chart on this site would
 * differ if it were drawn the KP way.
 *
 * The site does NOT compute KP. This is an explanation, not a chart.
 *
 * Only APPENDS to the Kundli tab.
 *   <script src="kp-astrology.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  /* Vimshottari order and years - the basis of the sub-lord division. */
  var SUB_LORDS = [
    { lord: 'Ketu', years: 7, span: 0.7778 },
    { lord: 'Venus', years: 20, span: 2.2222 },
    { lord: 'Sun', years: 6, span: 0.6667 },
    { lord: 'Moon', years: 10, span: 1.1111 },
    { lord: 'Mars', years: 7, span: 0.7778 },
    { lord: 'Rahu', years: 18, span: 2.0 },
    { lord: 'Jupiter', years: 16, span: 1.7778 },
    { lord: 'Saturn', years: 19, span: 2.1111 },
    { lord: 'Mercury', years: 17, span: 1.8889 }
  ];

  var DIFFS = [
    {
      topic: 'House division',
      classical: 'Whole-sign — the sign holding the ascendant is house 1.',
      kp: 'Placidus cusps. A planet can sit in a different house than it would in the whole-sign chart.',
      note: 'This is the biggest difference, and it is not cosmetic. The same birth can give different houses, and therefore different readings, under the two systems.'
    },
    {
      topic: 'Ayanamsa',
      classical: 'Lahiri (Chitrapaksha), the Indian government standard.',
      kp: 'The KP ayanamsa, slightly different from Lahiri.',
      note: 'A small shift in the sidereal zero point. It matters most for planets near a sign boundary.'
    },
    {
      topic: 'The unit of judgement',
      classical: 'The planet, the sign it occupies, and the house it sits in.',
      kp: 'The sub-lord. Each nakshatra is divided into nine subs, and the sub-lord is read rather than the star lord.',
      note: 'This is KP\u2019s signature technique. Two planets in the same nakshatra can have different sub-lords, and KP treats them as behaving differently.'
    },
    {
      topic: 'Timing',
      classical: 'Vimshottari dasha periods, read from the Moon\u2019s nakshatra.',
      kp: 'Cuspal sub-lords and ruling planets at the moment of the question.',
      note: 'KP is built around answering a specific question rather than describing a life, which is why ruling planets matter so much in it.'
    }
  ];

  function render() {
    var host = el('kphost');
    if (!host) return;

    var subs = SUB_LORDS.map(function (s) {
      return '<tr><td class="k" style="width:34%">' + esc(s.lord) + '</td>' +
        '<td>' + s.years + ' years &middot; ' + s.span.toFixed(4) + '&deg;</td></tr>';
    }).join('');

    var diffs = DIFFS.map(function (d) {
      return '<div style="padding:11px 0;border-bottom:1px solid #eee">' +
        '<strong>' + esc(d.topic) + '</strong>' +
        '<div style="margin-top:5px"><span class="muted" style="font-size:12px;' +
        'text-transform:uppercase;letter-spacing:.04em">Classical Vedic (this site)</span><br>' +
        esc(d.classical) + '</div>' +
        '<div style="margin-top:5px"><span class="muted" style="font-size:12px;' +
        'text-transform:uppercase;letter-spacing:.04em">KP</span><br>' + esc(d.kp) + '</div>' +
        '<div class="muted" style="margin-top:5px;font-size:12.5px">' + esc(d.note) + '</div>' +
        '</div>';
    }).join('');

    host.innerHTML =
      '<div class="card"><h3>KP astrology, and how it differs</h3>' +
      '<p>Krishnamurti Paddhati — KP — is one of the most widely practised systems in India. ' +
      'It is not a variant of what this site does; on the central questions it disagrees.</p>' +
      '<p class="muted">The charts here are classical Vedic. <strong>This site does not compute KP.</strong> ' +
      'What follows is an explanation of the difference, so you know which system produced the chart ' +
      'you are looking at.</p>' +
      diffs +
      '</div>' +

      '<div class="card"><h3>The sub-lord division</h3>' +
      '<p>Each nakshatra spans 13&deg;20&prime;. KP divides that span into nine parts proportional to the ' +
      'Vimshottari dasha years, and each part takes the name of its lord. The whole 120-year cycle ' +
      'scales down into 13&deg;20&prime; of zodiac.</p>' +
      '<table>' + subs +
      '<tr><td class="k">Total</td><td>120 years &middot; 13.3333&deg;</td></tr></table>' +
      '<div class="warn">KP reads the sub-lord rather than the star lord, and treats the cusp as the ' +
      'significant point rather than the whole sign. Because it uses Placidus cusps, it inherits the ' +
      'same high-latitude limitation as every other quadrant system — the discontinuity documented in ' +
      'the house-system note above.</div></div>' +

      '<div class="card"><h3>Which should you use?</h3>' +
      '<p>Whichever your teacher uses, and consistently. Mixing them produces a chart that belongs to ' +
      'neither system — a whole-sign ascendant read with Placidus cusps is not a compromise, it is an ' +
      'error.</p>' +
      '<div class="warn">Both systems are widely practised and competent astrologers disagree about ' +
      'which is more reliable. This site uses the classical method and says so. It makes no claim that ' +
      'KP is wrong, and none that it is right.</div></div>';
  }

  function attach() {
    var sec = el('kundli');
    if (!sec) return;
    var host = el('kphost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'kphost';
      sec.appendChild(host);
    }
    if (!host.innerHTML.trim()) render();
  }

  function boot() {
    var tries = 0;
    var iv = setInterval(function () {
      if (el('kundli')) { attach(); clearInterval(iv); }
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
