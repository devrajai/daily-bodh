/* Daily Bodh — astrology and the markets, as history.
 *
 * A page about financial astrology rather than a tool for it. It sets out what
 * the classical texts actually say about wealth, traces where the modern
 * planet-to-sector table came from, and is honest about what the evidence shows.
 *
 * No predictions. No "best day to invest". The card says plainly why.
 *
 * Appends to the Jyotish tab.
 *   <script src="market-astrology.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  var CLASSICAL = [
    { point: 'The second house (dhana bhava)', note: 'Wealth, food, possessions, family resources and speech. Read with its lord and the planets in it.' },
    { point: 'The eleventh house (labha bhava)', note: 'Gains and income \u2014 what the tenth house\u2019s action earns. One of the growth houses, said to improve with age.' },
    { point: 'Dhana yogas', note: 'Combinations linking the lords of the 2nd, 5th, 9th and 11th. The classical texts give many, with conditions.' },
    { point: 'Jupiter and Venus', note: 'Jupiter as the significator of expansion and fortune; Venus of comfort and enjoyment. Neither is a market signal.' },
    { point: 'Saturn', note: 'Delay, discipline and slow accumulation. In the classical reading Saturn builds wealth slowly and takes it away slowly.' }
  ];

  var TIMELINE = [
    { when: 'Classical period', what: 'Jyotish discusses a person\u2019s relationship with money across a life \u2014 houses, yogas, dashas. It contains no sector table, because there were no equity markets to map.' },
    { when: 'Early 1900s', what: 'W. D. Gann, an American trader, publicly claimed to forecast markets using geometry and astrology. His methods are still sold today.' },
    { when: 'The legend', what: 'Gann is said to have turned a small account into a large fortune in 1930. The claim rests on his own advertising, and his surviving brokerage records examined by later researchers do not show returns of that kind. He reportedly left a modest estate.' },
    { when: '1929', what: 'Financial astrologers of the period largely failed to predict the crash. Accounts afterwards claiming otherwise were written after the fact.' },
    { when: '2001', what: 'A widely cited study by Dichev and Janes reported higher stock returns around the new moon than the full moon. It became the standard citation for a lunar effect.' },
    { when: 'After 2001', what: 'Later tests on data outside the original sample did not reproduce the effect. That is the normal fate of small statistical findings, and it is the honest end of the story.' },
    { when: '2009 onward', what: 'Bitcoin and crypto appear. Astrologers assign them to Rahu. Rahu has been in the texts for two thousand years; crypto is fifteen years old. The association was made after the fact.' }
  ];

  var WHY = [
    { title: 'The table is fitted to the past', body: 'Each planet is matched to whichever sector has done something memorable. Saturn means corrections, Rahu means sudden gains, Ketu means reversals \u2014 between them they cover every outcome. A scheme that explains everything predicts nothing.' },
    { title: 'The crypto test is decisive', body: 'If planetary positions governed asset classes, the mapping would have to be discovered before the class existed. Rahu and crypto were joined in the 2010s, not in the shastras. That is retrofitting, and it is the clearest evidence the rest of the table is too.' },
    { title: 'Nothing to act on', body: 'Even if a lunar effect existed, a retail investor could not profit from it after brokerage, taxes and the spread. A real edge of a few basis points disappears the moment you try to use it.' },
    { title: 'The cost lands on the reader', body: 'If someone delays a monthly investment because a page said Wednesday belongs to Mercury, the loss is theirs. No chart bears it. That asymmetry is why this page gives no timings.' }
  ];

  function render() {
    var host = el('markethost');
    if (!host) return;

    host.innerHTML =
      '<div class="card"><h3>Astrology and the markets</h3>' +
      '<p class="muted">A page about financial astrology, not a tool for it. It is here because the ' +
      'question gets asked constantly and because a great deal of what circulates online is recent ' +
      'invention presented as ancient.</p>' +
      '<div class="warn"><strong>This page gives no investment timing.</strong> No planet has ever ' +
      'been shown to move a price. Markets move on earnings, interest rates, flows and geopolitics. ' +
      'Nothing here is financial advice \u2014 for anything that matters, speak to a SEBI-registered ' +
      'adviser.</div></div>' +

      '<div class="card"><h3>What the classical texts do say about wealth</h3>' +
      '<p>Jyotish is not silent on money. It simply talks about a person\u2019s relationship with it ' +
      'over a lifetime, not about when to buy.</p>' +
      CLASSICAL.map(function (c) {
        return '<div style="padding:8px 0;border-bottom:1px solid #f2f0f6">' +
          '<strong style="font-size:13.5px">' + esc(c.point) + '</strong><br>' +
          '<span class="muted" style="font-size:12.5px">' + esc(c.note) + '</span></div>';
      }).join('') +
      '<p class="muted" style="margin-top:10px">Notice what is absent: no sectors, no indices, no ' +
      'days of the week for trading. Those are not omissions \u2014 equity markets did not exist when ' +
      'these texts were written.</p></div>' +

      '<div class="card"><h3>Where the planet-to-sector table came from</h3>' +
      TIMELINE.map(function (t) {
        return '<div style="padding:9px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:13px;color:var(--accent)">' + esc(t.when) + '</strong>' +
          '<div style="margin-top:3px;font-size:13.5px">' + esc(t.what) + '</div></div>';
      }).join('') + '</div>' +

      '<div class="card"><h3>Why the table does not hold up</h3>' +
      WHY.map(function (w) {
        return '<div style="padding:10px 0;border-bottom:1px solid #eee">' +
          '<strong>' + esc(w.title) + '</strong>' +
          '<div style="margin-top:4px;font-size:13.5px">' + esc(w.body) + '</div></div>';
      }).join('') + '</div>' +

      '<div class="card"><h3>On the studies</h3>' +
      '<p>The lunar-effect literature is worth understanding because it is the strongest-looking ' +
      'evidence anyone has produced. A 2001 study reported that returns near the new moon exceeded ' +
      'those near the full moon. It was widely cited.</p>' +
      '<p class="muted">Then people tested it on data the original authors had not used, and the ' +
      'effect did not hold. This is not unusual \u2014 most small statistical findings fail when ' +
      'tested independently. The honest summary is that the search for planetary effects on market ' +
      'returns has produced nothing that survives replication.</p>' +
      '<p class="muted">That is a statement about evidence, not about whether astrology means ' +
      'anything to you. Plenty of people find the tradition valuable. It simply does not forecast ' +
      'prices.</p></div>' +

      '<div class="card"><h3>If you want to follow it anyway</h3>' +
      '<p>Some people do, and that is their business. If you do, three things are worth keeping ' +
      'separate: a practice you find meaningful, a claim that can be tested, and a decision about ' +
      'money. The first is yours. The second has been tested. The third should be made on ' +
      'fundamentals, and with someone qualified.</p>' +
      '<div class="warn">In India, investment advice is regulated by SEBI. Giving it without ' +
      'registration is an offence, whether or not a site charges money. A free page telling readers ' +
      'when to invest is still advisory.</div></div>';
  }

  function attach() {
    var sec = el('jyotish') || el('shastra');
    if (!sec) return;
    var host = el('markethost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'markethost';
      sec.appendChild(host);
    }
    if (!host.innerHTML.trim()) render();
  }

  function boot() {
    var tries = 0;
    var iv = setInterval(function () {
      if (el('jyotish') || el('shastra')) { attach(); clearInterval(iv); }
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
