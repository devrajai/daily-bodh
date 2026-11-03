/* Daily Bodh — how this site calculates, what it stores, and who to credit.
 *
 * The trust page. It sets out the ephemeris, the ayanamsa, the house system, the
 * cross-checks and their limits, then the privacy position and every data source.
 *
 * Creates its own tab if TABS is reachable; the section still exists otherwise.
 *
 *   <script src="about-calc.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  var CHECKS = [
    { what: 'Planetary positions', how: 'Cross-checked against a second, independently written engine (astro-jyotish-lite) for the same date. Eight bodies agreed to within 3.52 arc-minutes.',
      limit: 'The residual is the known difference between the DE421 barycentre and a geocentric position \u2014 Jupiter 3.13\u2032, Saturn 3.52\u2032. It is not an error in either engine.' },
    { what: 'Panchang limbs', how: 'Tithi, nakshatra, yoga and karana for 29 October 2026 matched a second engine exactly: Chaturthi, Rohini, Parigha, Bava.',
      limit: 'Boundary cases \u2014 a limb ending within minutes of sunrise \u2014 can differ between almanacs by convention.' },
    { what: 'Sunrise and sunset', how: 'Computed live in the browser from latitude and longitude using the standard NOAA solar-position algorithm. Against the bundled Delhi figures for 29 October 2026 it gave 06:31 and 17:39 against 06:30 and 17:38.',
      limit: 'About a minute at Indian latitudes. Some almanacs apply small corrections for altitude and refraction.' },
    { what: 'Historical time zones', how: 'Indian UTC offsets taken from the IANA time-zone database, not a hand-written table. India ran on UTC+6:30 during 1941\u201345; before 1906 local mean time was used.',
      limit: 'A birth recorded in local mean time before 1906 depends on the recorder having used it.' }
  ];

  var CREDITS = [
    { src: 'NASA JPL \u2014 DE421 ephemeris', lic: 'Public domain', use: 'Planetary positions behind every chart, panchang and dasha.' },
    { src: 'GeoNames', lic: 'CC BY 4.0', use: 'Place gazetteer, 558,013 places. Attribution required and shown on the Kundli screen.' },
    { src: 'IANA time-zone database', lic: 'Public domain', use: 'Historical UTC offsets for India and abroad.' },
    { src: 'kalagana (Python package)', lic: 'MIT', use: 'Base festival table; gaps derived from our own panchang.' },
    { src: 'Cheiro \u2014 Book of Numbers (1926)', lic: 'Public domain, d. 1936', use: 'Number meanings and the name-number system.' },
    { src: 'E. W. Bullinger \u2014 Number in Scripture (1894)', lic: 'Public domain, d. 1913', use: 'The scriptural reading of numbers.' },
    { src: 'Brihat Parashara Hora Shastra', lic: 'Sanskrit original, public domain', use: 'House and planet significations, restated in our own words.' },
    { src: 'Kisari Mohan Ganguli \u2014 Mahabharata (1883\u201396)', lic: 'Public domain', use: 'The full text in the scripture library.' },
    { src: 'Kevin Heng Ser Guan \u2014 The Mathematics of Astrology', lic: 'Academic paper, cited', use: 'The house-division and polar-discontinuity argument.' },
    { src: 'Harish Johari \u2014 Numerology', lic: 'In copyright to 2059', use: 'Rules restated in our own words. No text reproduced.' }
  ];

  function render() {
    var host = el('calchost');
    if (!host) return;

    host.innerHTML =
      '<div class="card"><h3>How this site calculates</h3>' +
      '<p>Most astrology sites do not tell you where their numbers come from. This page does, ' +
      'including where the method is weaker than it looks.</p>' +
      '<table>' +
      '<tr><td class="k" style="width:32%">Ephemeris</td><td>NASA JPL DE421</td></tr>' +
      '<tr><td class="k">Ayanamsa</td><td>Lahiri (Chitrapaksha), the Indian government standard</td></tr>' +
      '<tr><td class="k">House system</td><td>Whole-sign \u2014 see the Kundli tab for why</td></tr>' +
      '<tr><td class="k">Node convention</td><td>Mean nodes for Rahu and Ketu</td></tr>' +
      '<tr><td class="k">Sunrise</td><td>NOAA solar-position algorithm, computed in your browser</td></tr>' +
      '</table></div>' +

      '<div class="card"><h3>What we checked, and what it does not prove</h3>' +
      '<p class="muted">Every claim below was tested against something independent. The limits ' +
      'column matters as much as the result.</p>' +
      CHECKS.map(function (c) {
        return '<div style="padding:10px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:14px">' + esc(c.what) + '</strong>' +
          '<div style="margin-top:4px;font-size:13.5px">' + esc(c.how) + '</div>' +
          '<div class="muted" style="margin-top:4px;font-size:12.5px"><strong>Limit:</strong> ' +
          esc(c.limit) + '</div></div>';
      }).join('') +
      '<div class="warn">Agreement to three arc-minutes shows the arithmetic is sound. It says ' +
      'nothing about whether astrology describes anything real. Those are separate questions, and ' +
      'this site only claims the first.</div></div>' +

      '<div class="card"><h3>What this site stores about you</h3>' +
      '<p><strong>Nothing leaves your device.</strong> There is no account, no login, no analytics, ' +
      'no advertising and no third-party script.</p>' +
      '<table>' +
      '<tr><td class="k" style="width:38%">Saved profile</td><td>Name, birth date and optional Moon ' +
      'sign, in your browser\u2019s local storage. Removed by the Remove button or by clearing site data.</td></tr>' +
      '<tr><td class="k">Charts and reports</td><td>Computed in the browser. Never transmitted.</td></tr>' +
      '<tr><td class="k">Cookies</td><td>None.</td></tr>' +
      '<tr><td class="k">Server logs</td><td>The site is static files on GitHub Pages; we operate no ' +
      'server and see no logs.</td></tr>' +
      '</table>' +
      '<p class="muted">The Android build has no INTERNET permission at all, so the app cannot ' +
      'transmit anything even in principle.</p></div>' +

      '<div class="card"><h3>Credits</h3>' +
      '<p class="muted">Everything this site stands on, and the terms it is used under.</p>' +
      '<table><tr><td class="k" style="width:34%">Source</td><td class="k" style="width:26%">Licence</td>' +
      '<td class="k">Used for</td></tr>' +
      CREDITS.map(function (c) {
        return '<tr><td><strong style="font-size:12.5px">' + esc(c.src) + '</strong></td>' +
          '<td class="muted" style="font-size:12px">' + esc(c.lic) + '</td>' +
          '<td style="font-size:12.5px">' + esc(c.use) + '</td></tr>';
      }).join('') + '</table>' +
      '<div class="warn">No copyrighted translation or commentary is reproduced anywhere on this ' +
      'site. Where a work is still in copyright, only the underlying rule is restated, in our own ' +
      'words. If you believe something here infringes, write to us and it will be removed.</div></div>' +

      '<div class="card"><h3>If you find an error</h3>' +
      '<p>A wrong date or a wrong calculation is worth reporting, and it will be fixed in public. ' +
      'The arithmetic on this site is checkable \u2014 that is the point of publishing the cross-checks ' +
      'above.</p>' +
      '<p class="muted">Corrections are more useful than complaints, and both are welcome.</p></div>';
  }

  function section() {
    var s = el('about');
    if (s) return s;
    s = document.createElement('section');
    s.id = 'about';
    var main = document.querySelector('main') || document.body;
    main.appendChild(s);
    return s;
  }

  function attach() {
    var sec = section();
    var host = el('calchost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'calchost';
      sec.appendChild(host);
    }
    if (!host.innerHTML.trim()) render();
  }

  function register() {
    try {
      if (typeof TABS === 'undefined' || !Array.isArray(TABS)) return;
      if (TABS.some(function (t) { return t[0] === 'about'; })) return;
      TABS.push(['about', 'How we calculate', function () { render(); }]);
      var bar = document.getElementById('tabs');
      if (bar) {
        bar.innerHTML = TABS.map(function (t) {
          return '<button data-t="' + t[0] + '" aria-selected="false">' + t[1] + '</button>';
        }).join('');
        Array.prototype.forEach.call(bar.querySelectorAll('[data-t]'), function (b) {
          b.onclick = function () {
            if (typeof show === 'function') show(b.dataset.t);
            else location.hash = b.dataset.t;
          };
        });
      }
    } catch (e) { /* section still reachable by hash */ }
  }

  function boot() {
    attach();
    register();
    var tries = 0;
    var iv = setInterval(function () {
      attach();
      if (el('calchost') && el('calchost').innerHTML.trim()) clearInterval(iv);
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
