/* Daily Bodh — which house system the chart uses, and why.
 *
 * The kundli engine uses whole-sign houses: the sign containing the ascendant
 * is the first house, and each following sign is the next house in order. That
 * is the classical Indian method. The site never said so, and a reader deserves
 * to know which of several conventions produced the chart in front of them.
 *
 * The argument for it is not only tradition. Kevin Heng Ser Guan's undergraduate
 * research paper "The Mathematics of Astrology: Does House Division Make Sense?"
 * works through the geometry at 70 degrees north and shows that at certain
 * moments the ecliptic, the horizon and the central meridian meet at one point -
 * at which the ascendant jumps from south to north, and houses X to XII cannot
 * be defined at all. Quadrant systems (Placidus, Koch, Campanus) inherit that
 * discontinuity. Whole-sign houses do not, because they only ask which sign the
 * ascendant falls in, not where inside it.
 *
 * Only APPENDS to the Kundli tab.
 *   <script src="house-system.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  var SYSTEMS = [
    { name: 'Whole-sign (used here)', note: 'The sign holding the ascendant is house 1; each following sign is the next house. Classical Indian method. Does not break at high latitude.' },
    { name: 'Equal house', note: 'House 1 starts at the ascendant degree and each house spans exactly 30 degrees. Simple, but houses drift away from signs.' },
    { name: 'Placidus', note: 'Divides the time taken for degrees to rise. The most common modern Western system. Undefined inside the polar circles.' },
    { name: 'Koch', note: 'Based on the place of birth. Also undefined at high latitude.' },
    { name: 'Campanus', note: 'Divides the prime vertical into twelve. Geometrically tidy; also fails near the poles.' },
    { name: 'Regiomontanus', note: 'Divides the celestial equator into twelve. Historically important, same polar limitation.' }
  ];

  function render() {
    var host = el('househost');
    if (!host) return;

    host.innerHTML =
      '<div class="card"><h3>Which house system this chart uses</h3>' +
      '<p>Every chart on this site is drawn with <strong>whole-sign houses</strong>: the sign that ' +
      'holds your ascendant is the first house, and each following sign is the next house in order. ' +
      'That is the classical Indian convention, and it is what the rashi chart has always used.</p>' +
      '<p class="muted">It matters that you know this, because other systems put the same planet in a ' +
      'different house. A chart is not a fact about the sky until you say which convention drew it.</p>' +

      '<h4 style="margin-top:14px">The systems in use</h4>' +
      SYSTEMS.map(function (s) {
        return '<div style="padding:7px 0;border-bottom:1px solid #f2f0f6">' +
          '<strong style="font-size:13.5px">' + esc(s.name) + '</strong><br>' +
          '<span class="muted" style="font-size:12.5px">' + esc(s.note) + '</span></div>';
      }).join('') +

      '<h4 style="margin-top:16px">Why whole-sign is a defensible choice</h4>' +
      '<p>Not only because it is traditional. Kevin Heng Ser Guan\u2019s research paper ' +
      '<em>The Mathematics of Astrology: Does House Division Make Sense?</em> works the geometry at ' +
      '70&deg; north and finds a point where the ecliptic, the horizon and the central meridian all ' +
      'meet. At that moment the ascendant jumps from south to north, and <strong>houses X to XII ' +
      'cannot be defined at all</strong>. Quadrant systems inherit that discontinuity.</p>' +
      '<p>Whole-sign houses do not, because they only ask which sign the ascendant falls in \u2014 not ' +
      'where inside that sign it sits. For a birth in northern Europe, northern Russia or Canada, that ' +
      'is not a technicality: it is the difference between a chart and a chart with missing houses.</p>' +

      '<div class="warn">This is a description of a methodological choice, not a claim that one system ' +
      'is true. Each convention answers a slightly different question, and competent astrologers ' +
      'disagree about which to use. What would be dishonest is drawing a chart without saying which ' +
      'one produced it.</div></div>';
  }

  function attach() {
    var sec = el('kundli');
    if (!sec) return;
    var host = el('househost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'househost';
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
