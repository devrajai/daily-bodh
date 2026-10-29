/* Daily Bodh — Choghadiya, Hora and Panchak.
 *
 * All three are pure functions of data the site already ships: the weekday,
 * sunrise and sunset from panchang.json, and the Moon's nakshatra. Nothing is
 * downloaded and nothing is stored.
 *
 * This module only APPENDS a card to the Panchang tab. It does not touch the
 * existing markup, so if you remove this file and its script tag the Panchang
 * screen is exactly as it was.
 *
 *   <script src="choghadiya.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }
  function todayIso() {
    var d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  }

  /* ---------------------------------------------------------- Choghadiya
     The day from sunrise to sunset is cut into eight equal parts, and the night
     from sunset to the next sunrise into eight more. Each part takes a name from
     a sequence fixed by the weekday. The order below is the classical one. */
  var CHOG_DAY = {
    0: ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg'],
    1: ['Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit'],
    2: ['Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'],
    3: ['Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh'],
    4: ['Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh'],
    5: ['Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char'],
    6: ['Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal']
  };
  var CHOG_NIGHT = {
    0: ['Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh'],
    1: ['Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char'],
    2: ['Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal'],
    3: ['Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg'],
    4: ['Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit'],
    5: ['Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog'],
    6: ['Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh']
  };
  /* Amrit, Shubh, Labh and Char are auspicious; Kaal, Rog and Udveg are not. */
  var QUALITY = {
    Amrit: ['good', 'best'], Shubh: ['good', 'auspicious'], Labh: ['good', 'profitable'],
    Char: ['good', 'movable'], Udveg: ['bad', 'anxiety'], Rog: ['bad', 'illness'],
    Kaal: ['bad', 'loss']
  };

  /* ---------------------------------------------------------------- Hora
     Twenty-four planetary hours of unequal length between sunrise and the next
     sunrise. The lords run in the fixed order Sun, Venus, Mercury, Moon, Saturn,
     Jupiter, Mars, and each weekday opens with its own lord. */
  var HORA_ORDER = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];
  var DAY_LORD = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

  function mins(hhmm) {
    if (!hhmm) return null;
    var p = String(hhmm).split(':');
    if (p.length < 2) return null;
    var h = parseInt(p[0], 10), m = parseInt(p[1], 10);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
  }
  function clock(m) {
    m = ((m % 1440) + 1440) % 1440;
    var h = Math.floor(m / 60), mm = Math.round(m % 60);
    if (mm === 60) { mm = 0; h = (h + 1) % 24; }
    return (h < 10 ? '0' : '') + h + ':' + (mm < 10 ? '0' : '') + mm;
  }
  function span(a, b) { return b > a ? b - a : b + 1440 - a; }

  function build(d) {
    var rise = mins(d.sunrise), set = mins(d.sunset);
    if (rise == null || set == null) return null;
    var dow = new Date(d.d + 'T00:00:00').getDay();
    var out = { chog: [], hora: [], panchak: null };

    // ---- choghadiya: eight day parts, eight night parts ----
    var dayLen = span(rise, set) / 8;
    for (var i = 0; i < 8; i++) {
      var nm = CHOG_DAY[dow][i];
      out.chog.push({ part: 'Day', name: nm, q: QUALITY[nm][0],
        from: clock(rise + i * dayLen), to: clock(rise + (i + 1) * dayLen) });
    }
    var nightLen = span(set, rise) / 8;
    for (var j = 0; j < 8; j++) {
      var nn = CHOG_NIGHT[dow][j];
      out.chog.push({ part: 'Night', name: nn, q: QUALITY[nn][0],
        from: clock(set + j * nightLen), to: clock(set + (j + 1) * nightLen) });
    }

    // ---- hora: 24 equal parts from sunrise to the next sunrise ----
    var horaLen = span(rise, rise + 1440) / 24;
    var start = HORA_ORDER.indexOf(DAY_LORD[dow]);
    for (var k = 0; k < 24; k++) {
      out.hora.push({ lord: HORA_ORDER[(start + k) % 7],
        from: clock(rise + k * horaLen), to: clock(rise + (k + 1) * horaLen) });
    }

    // ---- panchak: the Moon in the last five nakshatras, Dhanishta to Revati ----
    var idx = null;
    if (typeof NAK !== 'undefined' && d.nakshatra) {
      for (var n = 0; n < NAK.length; n++) {
        if (d.nakshatra.indexOf(NAK[n].split(' ')[0]) === 0) { idx = n; break; }
      }
    }
    out.panchak = idx != null && idx >= 22;   // Dhanishta is index 22
    return out;
  }

  function markup(d) {
    var b = build(d);
    if (!b) return '';
    var now = new Date();
    var nowM = now.getHours() * 60 + now.getMinutes();
    var inDay = d.d === todayIso();

    var chog = b.chog.map(function (c) {
      var live = inDay && nowM >= mins(c.from) && nowM < mins(c.to) &&
                 (mins(c.to) > mins(c.from) || nowM >= mins(c.from));
      return '<tr' + (live ? ' style="background:#f3eefc"' : '') + '>' +
        '<td class="k" style="width:26%">' + esc(c.part) + '</td>' +
        '<td style="width:26%"><strong style="color:' +
        (c.q === 'good' ? 'var(--good)' : 'var(--bad)') + '">' + esc(c.name) + '</strong></td>' +
        '<td class="muted">' + esc(c.from) + ' – ' + esc(c.to) + '</td></tr>';
    }).join('');

    var hora = b.hora.map(function (h) {
      var live = inDay && nowM >= mins(h.from) && nowM < mins(h.to) &&
                 (mins(h.to) > mins(h.from) || nowM >= mins(h.from));
      return '<tr' + (live ? ' style="background:#f3eefc"' : '') + '>' +
        '<td class="k" style="width:26%">' + esc(h.lord) + '</td>' +
        '<td class="muted" colspan="2">' + esc(h.from) + ' – ' + esc(h.to) + '</td></tr>';
    }).join('');

    return '<div class="card" id="chogcard">' +
      '<h3>Choghadiya <span class="muted" style="font-weight:400;font-size:13px">' +
      '(auspicious windows)</span></h3>' +
      '<p class="muted">The day from sunrise to sunset is cut into eight equal parts, the night ' +
      'into eight more. Amrit, Shubh, Labh and Char are taken as favourable; Kaal, Rog and Udveg ' +
      'as not. The window running now is highlighted.</p>' +
      '<table>' + chog + '</table>' +
      (b.panchak ? '<p style="margin-top:12px"><strong>Panchak:</strong> the Moon is in the last ' +
        'five nakshatras (Dhanishta to Revati). Traditionally avoided for some new beginnings.</p>'
        : '<p class="muted" style="margin-top:12px">Not in Panchak today.</p>') +
      '</div>' +
      '<div class="card">' +
      '<h3>Hora <span class="muted" style="font-weight:400;font-size:13px">' +
      '(planetary hours)</span></h3>' +
      '<p class="muted">Twenty-four planetary hours from sunrise to the next sunrise, each ruled ' +
      'by a planet in the fixed order Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars. ' +
      'Tradition assigns each hour to the activities of its lord.</p>' +
      '<table>' + hora + '</table>' +
      '</div>' +
      '<div class="warn">Choghadiya and Hora are traditional divisions of the day, computed here ' +
      'from the sunrise and sunset already on this page. Sources differ on the exact sequence for ' +
      'some weekdays, and on which choghadiyas count as favourable.</div>';
  }

  /* Append to the Panchang tab without disturbing what is already there. */
  function attach() {
    var sec = el('panchang');
    if (!sec) return false;
    var host = el('choghost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'choghost';
      sec.appendChild(host);
    }
    var P = sec.dataset && sec.dataset.date ? sec.dataset.date : todayIso();
    if (!window.__chogData) return false;
    var d = window.__chogData(P);
    host.innerHTML = d ? markup(d) : '';
    return true;
  }

  /* The Panchang tab re-renders on date change, so watch for that and re-attach.
     We read the day's record from the same panchang.json the tab already loaded. */
  var DAYS = null;
  function loadDays() {
    if (DAYS) return Promise.resolve(DAYS);
    return fetch('data/panchang.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (j) { DAYS = j.days || []; window.__chogData = findDay; return DAYS; });
  }
  function findDay(iso) {
    if (!DAYS) return null;
    for (var i = 0; i < DAYS.length; i++) if (DAYS[i].d === iso) return DAYS[i];
    return null;
  }

  function boot() {
    loadDays().then(function () {
      attach();
      // the tab rebuilds its own markup on a date change, so re-attach after it
      var sec = el('panchang');
      if (sec) {
        sec.addEventListener('change', function () { setTimeout(attach, 0); });
      }
      document.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'pd') setTimeout(attach, 60);
      }, true);
      window.addEventListener('hashchange', function () { setTimeout(attach, 0); });
      setTimeout(attach, 400);
    }).catch(function () { /* the Panchang tab shows its own error */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
