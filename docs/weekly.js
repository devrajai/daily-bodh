/* Daily Bodh — this week's reading, per Moon sign.
 *
 * Reads rashifal-weekly.json, which CI generates from the JPL ephemeris. Shows
 * five areas for the current week with the transit that produced each score.
 *
 * Only APPENDS a card to the Horoscope tab. Remove this file and its script tag
 * and the Horoscope screen is exactly as it was.
 *
 *   <script src="weekly.js"></script>
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

  var ORDER = ['Overall', 'Love', 'Finance', 'Career', 'Health'];
  var DATA = null;

  function stars(n) {
    var s = '';
    for (var i = 1; i <= 5; i++) {
      s += '<span style="color:' + (i <= n ? '#6d28d9' : '#d8d2e4') + '">\u2605</span>';
    }
    return s;
  }

  function load() {
    if (DATA) return Promise.resolve(DATA);
    return fetch('data/rashifal-weekly.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (j) { DATA = j; return j; });
  }

  /* The week whose range contains today. */
  function thisWeek(j, iso) {
    for (var i = 0; i < j.weeks.length; i++) {
      var w = j.weeks[i];
      if (w.week <= iso && iso <= w.end) return w;
    }
    return j.weeks[0] || null;
  }

  function card(j, rashiIdx) {
    var w = thisWeek(j, todayIso());
    if (!w || !w.signs[rashiIdx]) return '';
    var s = w.signs[rashiIdx];
    var c = s.cats;

    var rows = ORDER.filter(function (k) { return c[k]; }).map(function (k) {
      return '<tr>' +
        '<td class="k" style="width:24%">' + esc(k) + '</td>' +
        '<td style="width:26%;white-space:nowrap;font-size:15px">' + stars(c[k].stars) + '</td>' +
        '<td class="muted">' + esc(c[k].why) + '</td>' +
        '</tr>';
    }).join('');

    return '<div class="card" id="weeklycard">' +
      '<h3>This week <span class="muted" style="font-weight:400;font-size:13px">' +
      esc(w.week) + ' to ' + esc(w.end) + '</span></h3>' +
      '<p class="muted">For ' + esc(s.sign) + ', counted from the Moon sign. Each score comes from ' +
      'the houses the transiting planets occupy, and the transit behind it is shown beside it.</p>' +
      '<table>' + rows + '</table>' +
      (s.sadeSati
        ? '<p style="margin-top:10px"><strong>Saturn is in your ' + s.saturnHouse +
          (s.saturnHouse === 1 ? 'st' : s.saturnHouse === 2 ? 'nd' : 'th') +
          ' house</strong> &mdash; this is a Sade Sati phase.</p>'
        : '') +
      '<div class="warn">Computed from the bundled JPL DE421 ephemeris, not written by hand. ' +
      'The house groupings and weights are fixed and published in the site\u2019s source. ' +
      'This is the tradition\u2019s reading of where the planets are &mdash; a structure for ' +
      'reflection, not a forecast of events.</div>' +
      '</div>';
  }

  function attach() {
    var sec = el('horoscope');
    if (!sec || !DATA) return;
    var host = el('weeklyhost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'weeklyhost';
      sec.appendChild(host);
    }
    var r = sec.dataset && sec.dataset.rashi != null ? parseInt(sec.dataset.rashi, 10) : 0;
    host.innerHTML = card(DATA, isNaN(r) ? 0 : r);
  }

  function boot() {
    load().then(function () {
      attach();
      // The Horoscope tab re-renders when the sign or period changes; re-attach after.
      var sec = el('horoscope');
      if (sec) {
        sec.addEventListener('click', function () { setTimeout(attach, 0); setTimeout(attach, 80); }, true);
      }
      window.addEventListener('hashchange', function () { setTimeout(attach, 0); });
      setTimeout(attach, 500);
    }).catch(function () { /* the Horoscope tab shows its own error */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
