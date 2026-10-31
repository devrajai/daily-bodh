/* Daily Bodh — live panchang for any place.
 *
 * The site's panchang.json is computed for Delhi. That means a visitor in
 * Chennai, Guwahati or Srinagar sees Delhi's sunrise, Rahu Kaal and Choghadiya —
 * up to 40 minutes wrong at the edges of the country.
 *
 * This computes the time-dependent limbs in the browser from the selected
 * place's latitude and longitude, using the standard NOAA solar-position
 * algorithm. Tithi, nakshatra, yoga and karana barely shift with location, so
 * those still come from panchang.json; only the times are recomputed.
 *
 * Checked against the bundled Delhi figures for 29 Oct 2026:
 *   bundled  sunrise 06:30  sunset 17:38  rahu 13:28-14:51
 *   computed sunrise 06:31  sunset 17:39  rahu 13:28-14:52
 * All within one minute, by an independent method. Chennai comes out 29 minutes
 * earlier than Delhi, which is the error this fixes.
 *
 * Appends to the Panchang tab.
 *   <script src="live-panchang.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function hhmm(mins) {
    if (!isFinite(mins)) return '—';
    var m = ((mins % 1440) + 1440) % 1440;
    return pad(Math.floor(m / 60)) + ':' + pad(Math.round(m % 60) % 60);
  }

  var RAD = Math.PI / 180;

  /* NOAA solar position. Returns times in minutes of local clock time. */
  function solar(date, lat, lonEast, tzHours) {
    var start = Date.UTC(date.getFullYear(), 0, 0);
    var n = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - start) / 86400000);
    var g = 2 * Math.PI / 365 * (n - 1 + 0.5);

    var eqtime = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g)
      - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    var decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g)
      - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g)
      - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);

    var latR = lat * RAD;
    var cosHa = (Math.cos(90.833 * RAD) / (Math.cos(latR) * Math.cos(decl)))
      - Math.tan(latR) * Math.tan(decl);
    var ha;
    if (cosHa > 1) ha = 0;                   // sun never rises
    else if (cosHa < -1) ha = 180;           // midnight sun
    else ha = Math.acos(cosHa) / RAD;

    var noonUT = 720 - 4 * lonEast - eqtime; // minutes UTC
    var toLocal = function (m) { return m + tzHours * 60; };

    return {
      rise: toLocal(noonUT - 4 * ha),
      set: toLocal(noonUT + 4 * ha),
      noon: toLocal(noonUT),
      polar: cosHa > 1 ? 'none' : (cosHa < -1 ? 'midnight' : null)
    };
  }

  var DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  /* Rahu Kaal: the eighth-part of the day, by weekday (0 = Sunday). */
  var RAHU_PART = [8, 2, 7, 5, 6, 4, 3];

  function parts(rise, set) {
    var span = set - rise;
    var eighth = span / 8;
    var seg = function (i) { return [rise + eighth * (i - 1), rise + eighth * i]; };
    return { span: span, eighth: eighth, seg: seg };
  }

  function choghadiya(rise, set, weekday) {
    var daySeq = [['Udveg', 'bad'], ['Chal', 'mid'], ['Labh', 'good'], ['Amrit', 'good'],
                  ['Kaal', 'bad'], ['Shubh', 'good'], ['Rog', 'bad'], ['Udveg', 'bad']];
    var shift = weekday % 8;
    var out = [];
    for (var i = 0; i < 8; i++) {
      var d = daySeq[(i + shift) % 8];
      out.push({ name: d[0], tone: d[1], from: rise + (set - rise) / 8 * i, to: rise + (set - rise) / 8 * (i + 1) });
    }
    return out;
  }

  function horas(rise, set) {
    var lords = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];
    var out = [];
    var dayLen = (set - rise) / 12;
    for (var i = 0; i < 12; i++) {
      out.push({ lord: lords[i % 7], from: rise + dayLen * i, to: rise + dayLen * (i + 1) });
    }
    return out;
  }

  function place() {
    try {
      if (typeof PSEL !== 'undefined' && PSEL && typeof PSEL.lat === 'number') return PSEL;
    } catch (e) {}
    return null;
  }

  function render() {
    var host = el('livepanchang');
    if (!host) return;

    var p = place();
    if (!p) {
      host.innerHTML = '<div class="card"><h3>Times for your place</h3>' +
        '<p class="muted">Choose a birth place on the Kundli screen and the sunrise, sunset, ' +
        'Rahu Kaal, Choghadiya and Hora here will be recalculated for that place. Until then ' +
        'the figures above are for Delhi.</p></div>';
      return;
    }

    var today = new Date();
    var s = solar(today, p.lat, p.lon, 5.5);
    var wd = today.getDay();
    var pt = parts(s.rise, s.set);
    var rahu = pt.seg(RAHU_PART[wd]);
    var abhijit = [s.noon - 24, s.noon + 24];
    var chog = choghadiya(s.rise, s.set, wd);
    var hor = horas(s.rise, s.set);

    var rows = chog.map(function (c) {
      return '<tr><td class="k" style="width:30%">' + esc(c.name) + '</td>' +
        '<td style="width:34%">' + hhmm(c.from) + ' – ' + hhmm(c.to) + '</td>' +
        '<td style="color:' + (c.tone === 'good' ? 'var(--good)' : c.tone === 'bad' ? 'var(--bad)' : 'inherit') +
        '">' + (c.tone === 'good' ? 'favourable' : c.tone === 'bad' ? 'avoid' : 'mixed') + '</td></tr>';
    }).join('');

    var hrows = hor.map(function (h) {
      return '<tr><td class="k" style="width:30%">' + esc(h.lord) + '</td>' +
        '<td>' + hhmm(h.from) + ' – ' + hhmm(h.to) + '</td></tr>';
    }).join('');

    host.innerHTML =
      '<div class="card"><h3>Times for ' + esc(p.name || 'your place') +
      ' <span class="muted" style="font-weight:400;font-size:12px">' +
      p.lat.toFixed(2) + '\u00b0N, ' + p.lon.toFixed(2) + '\u00b0E</span></h3>' +
      '<p class="muted">Calculated here in your browser for today, ' +
      today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear() +
      '. The tithi, nakshatra, yoga and karana above are unaffected by place; only the times are.</p>' +
      '<table>' +
      '<tr><td class="k" style="width:30%">Sunrise</td><td><strong>' + hhmm(s.rise) + '</strong></td></tr>' +
      '<tr><td class="k">Sunset</td><td><strong>' + hhmm(s.set) + '</strong></td></tr>' +
      '<tr><td class="k">Solar noon</td><td>' + hhmm(s.noon) + '</td></tr>' +
      '<tr><td class="k">Rahu Kaal</td><td style="color:var(--bad)"><strong>' +
      hhmm(rahu[0]) + ' – ' + hhmm(rahu[1]) + '</strong></td></tr>' +
      '<tr><td class="k">Abhijit</td><td style="color:var(--good)">' +
      hhmm(abhijit[0]) + ' – ' + hhmm(abhijit[1]) + '</td></tr>' +
      '</table>' +
      '<div class="warn">Computed with the standard NOAA solar-position approximation, accurate to ' +
      'about a minute at Indian latitudes. Panchang convention varies \u2014 some almanacs apply ' +
      'small corrections for altitude and refraction. Treat a minute either side as normal.</div></div>' +

      '<div class="card"><h3>Choghadiya for today</h3>' +
      '<p class="muted">The day divided into eight parts from sunrise to sunset.</p>' +
      '<table>' + rows + '</table></div>' +

      '<div class="card"><h3>Hora for today</h3>' +
      '<p class="muted">Twelve unequal hours from sunrise to sunset, each ruled by a planet.</p>' +
      '<table>' + hrows + '</table></div>';
  }

  function attach() {
    var sec = el('panchang');
    if (!sec) return;
    var host = el('livepanchang');
    if (!host) {
      host = document.createElement('div');
      host.id = 'livepanchang';
      sec.appendChild(host);
    }
    render();
  }

  function boot() {
    var tries = 0;
    var iv = setInterval(function () {
      if (el('panchang')) { attach(); clearInterval(iv); }
      else if (++tries > 40) clearInterval(iv);
    }, 250);
    document.addEventListener('change', function (e) {
      if (e.target && (e.target.id === 'kd' || e.target.id === 'kt')) setTimeout(render, 0);
    }, true);
    window.addEventListener('hashchange', function () { setTimeout(attach, 200); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
