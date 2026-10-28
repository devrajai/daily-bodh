/* Daily Bodh — the Home landing page.
 *
 * A front door. Everything here comes from data the site already ships:
 * today's panchang (with sunrise, sunset, moonrise and moonset computed from
 * the DE421 kernel), the era names, and a grid linking to the screens that
 * already exist.
 *
 * Registers itself as the FIRST tab, so index.html needs one line:
 *   <script src="home.js"></script>   (after kundli.js, after ask.js)
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function todayIso() {
    var d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  }
  function longDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                  'August', 'September', 'October', 'November', 'December'];
    return days[d.getDay()] + ', ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  /* The four tiles. Inline SVG so there is no image to download and the
     strokes take the current text colour. */
  var ICON = {
    sunrise: '<svg viewBox="0 0 48 48" width="44" height="44" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round"><path d="M24 6v10M18 10l6-6 6 6"/>' +
      '<path d="M10 34h28M14 34a10 10 0 0 1 20 0"/><path d="M8 40h32"/>' +
      '<path d="M14 26l-4-4M34 26l4-4"/></svg>',
    sunset: '<svg viewBox="0 0 48 48" width="44" height="44" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round"><path d="M24 6v10M18 12l6 6 6-6"/>' +
      '<path d="M10 34h28M14 34a10 10 0 0 1 20 0"/><path d="M8 40h32"/>' +
      '<path d="M14 26l-4-4M34 26l4-4"/></svg>',
    moonrise: '<svg viewBox="0 0 48 48" width="44" height="44" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round"><path d="M24 4v9M18 8l6-4 6 4"/>' +
      '<path d="M30 22a10 10 0 1 0-12 0"/><path d="M8 38h32"/>' +
      '<circle cx="34" cy="14" r="1.5" fill="currentColor" stroke="none"/>' +
      '<circle cx="39" cy="20" r="1" fill="currentColor" stroke="none"/></svg>',
    moonset: '<svg viewBox="0 0 48 48" width="44" height="44" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round"><path d="M24 4v9M18 10l6 6 6-6"/>' +
      '<path d="M30 22a10 10 0 1 0-12 0"/><path d="M8 38h32"/>' +
      '<circle cx="34" cy="14" r="1.5" fill="currentColor" stroke="none"/>' +
      '<circle cx="39" cy="20" r="1" fill="currentColor" stroke="none"/></svg>'
  };

  var TILES = [
    ['sunrise', 'Sunrise', 'Sunrise', '#e8710a', '#fdf0e3'],
    ['sunset',  'Sunset',  'Sunset',  '#e8710a', '#fdf0e3'],
    ['moonrise','Moonrise','Moonrise','#2f4d9e', '#e9edf8'],
    ['moonset', 'Moonset', 'Moonset', '#2f4d9e', '#e9edf8']
  ];

  /* The grid of calculators. Every one of these is a screen that already
     exists — this is navigation, not new machinery. */
  var GRID = [
    ['kundli',   'Kundli',      'Birth chart with a real ascendant'],
    ['match',    'Kundali match','Ashtakoota, 36 points'],
    ['horoscope','Horoscope',   'Transit-driven, by Moon sign'],
    ['muhurat',  'Muhurat',     'Auspicious days for a function'],
    ['panchang', 'Panchang',    'Tithi, nakshatra, timings'],
    ['numerology','Numerology', 'Mulank, bhagyank, Lo Shu'],
    ['ask',      'Ask',         'Ask a question in plain words'],
    ['jyotish',  'Jyotish',     'Doshas, dashas, remedies']
  ];

  function tile(key, label, value) {
    var t = TILES.filter(function (x) { return x[0] === key; })[0];
    var colour = t[3], bg = t[4];
    return '<div style="background:' + bg + ';border-radius:14px;padding:14px 10px;text-align:center">' +
      '<div style="color:' + colour + ';display:flex;justify-content:center">' + ICON[key] + '</div>' +
      '<div style="font-weight:700;font-size:17px;color:' + colour + ';margin-top:6px;' +
      'font-variant-numeric:tabular-nums">' + (value ? esc(value) : '&mdash;') + '</div>' +
      '<div class="muted" style="font-size:11.5px;margin-top:2px">' + esc(label) + '</div></div>';
  }

  function row(label, value) {
    if (!value) return '';
    return '<tr><td class="k">' + esc(label) + '</td><td>' + value + '</td></tr>';
  }

  async function render() {
    var s = el('home');
    if (!s) return;
    var day = todayIso();
    var P, d;
    try {
      P = await data('panchang.json');
      d = (P.days || []).filter(function (x) { return x.d === day; })[0];
    } catch (e) {
      s.innerHTML = '<h2>Today</h2><p class="muted">The panchang could not be loaded: ' +
        esc(e.message) + '</p>';
      return;
    }

    var tiles = d
      ? tile('sunrise', 'Sunrise', d.sunrise) + tile('sunset', 'Sunset', d.sunset) +
        tile('moonrise', 'Moonrise', d.moonrise) + tile('moonset', 'Moonset', d.moonset)
      : '';

    var head = d
      ? '<div class="big" style="font-size:22px">' + esc(d.vara) + ' &middot; ' +
        esc(d.paksha) + ' ' + esc(d.tithi) + '</div>' +
        '<p class="muted" style="margin:4px 0 0">' + esc(longDate(day)) + ' &middot; ' +
        esc(P.location || 'Delhi') + '</p>'
      : '<div class="big" style="font-size:20px">' + esc(longDate(day)) + '</div>' +
        '<p class="muted">No panchang is bundled for today. The range is ' +
        esc(P.from) + ' to ' + esc(P.to) + '.</p>';

    var detail = d
      ? '<div class="card"><h3>The day in full</h3><table>' +
        row('Tithi', esc(d.tithi) + (d.tithiEnd ? ' <span class="muted">till ' + esc(d.tithiEnd) + '</span>' : '')) +
        row('Nakshatra', esc(d.nakshatra) + (d.nakEnd ? ' <span class="muted">till ' + esc(d.nakEnd) + '</span>' : '')) +
        row('Yoga', esc(d.yoga) + (d.yoga_end ? ' <span class="muted">till ' + esc(d.yoga_end) + '</span>' : '')) +
        row('Karana', esc(d.karana) + (d.karana_end ? ' <span class="muted">till ' + esc(d.karana_end) + '</span>' : '')) +
        row('Month', 'Amanta <strong>' + esc(d.masa || '') + '</strong>' +
            (d.masa_purnimanta ? ' &middot; Purnimanta <strong>' + esc(d.masa_purnimanta) + '</strong>' : '')) +
        row('Samvat', (d.samvat_vikram ? 'Vikram <strong>' + d.samvat_vikram + '</strong>' : '') +
            (d.samvat_shaka ? ' &middot; Shaka <strong>' + d.samvat_shaka + '</strong>' : '') +
            (d.samvatsara ? ' &middot; ' + esc(d.samvatsara) : '')) +
        row('Rahu kalam', esc(d.rahu || '')) +
        row('Abhijit', esc(d.abhijit || '')) +
        '</table></div>'
      : '';

    var grid = '<div class="card"><h3>Calculators</h3><div style="display:grid;' +
      'grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin-top:8px">' +
      GRID.map(function (g) {
        return '<button class="go" data-go="' + g[0] + '" style="margin:0;text-align:left;' +
          'padding:12px 13px;background:#f3eefc;color:var(--ink);border:1px solid #ddd0f5">' +
          '<span style="display:block;font-weight:650;color:var(--accent)">' + esc(g[1]) + '</span>' +
          '<span style="display:block;font-weight:400;font-size:12px;color:var(--muted);' +
          'margin-top:2px;line-height:1.35">' + esc(g[2]) + '</span></button>';
      }).join('') + '</div></div>';

    s.innerHTML =
      '<h2>Today</h2>' +
      '<div class="card" style="padding:18px">' + head +
      '  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px">' +
      tiles + '</div>' +
      '</div>' +
      detail + grid +
      '<div class="warn">Timings are for ' + esc(P.location || 'Delhi') + ', IST, and are computed ' +
      'from positional astronomy. Sunrise, sunset, moonrise and moonset come from the JPL DE421 ' +
      'ephemeris; regional panchangs differ by a day on some observances.</div>';

    Array.prototype.forEach.call(s.querySelectorAll('[data-go]'), function (b) {
      b.onclick = function () {
        if (typeof show === 'function') show(b.dataset.go);
      };
    });
  }

  function mount() {
    var main = document.querySelector('main');
    if (!main || el('home')) return;
    var s = document.createElement('section');
    s.id = 'home';
    s.setAttribute('role', 'tabpanel');
    s.setAttribute('tabindex', '0');
    main.insertBefore(s, main.firstChild);

    if (typeof TABS !== 'undefined' && Array.isArray(TABS)) {
      // Home goes first, ahead of everything else.
      TABS.unshift(['home', 'Today', render]);
      var tabs = el('tabs');
      if (tabs) {
        tabs.innerHTML = TABS.map(function (t) {
          return '<button data-t="' + t[0] + '" role="tab" aria-controls="' + t[0] + '">' +
            t[1] + '</button>';
        }).join('');
        Array.prototype.forEach.call(tabs.querySelectorAll('button'), function (b) {
          b.onclick = function () { show(b.dataset.t); };
        });
      }
    }
  }

  mount();
})();
