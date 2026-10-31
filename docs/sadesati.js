/* Daily Bodh — Sade Sati checker.
 *
 * Sade Sati is the seven-and-a-half year period when Saturn transits the 12th,
 * 1st and 2nd signs from the natal Moon. The site already holds the computed
 * windows (docs/data/sadesati.json, derived from the bundled DE421 ephemeris),
 * so this shows which window you are in, how much is left, and the phase.
 *
 * Phase boundaries are given as thirds of the window. The exact boundary is the
 * moment Saturn changes sign, which can be a few weeks off a strict third — the
 * card says so rather than pretending otherwise.
 *
 * Appends to the Kundli tab.
 *   <script src="sadesati.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }
  function d(s) {
    var p = String(s).split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function fmt(dt) {
    return dt.getDate() + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][dt.getMonth()] + ' ' + dt.getFullYear();
  }
  function months(a, b) {
    return Math.max(0, Math.round((b - a) / (1000 * 60 * 60 * 24 * 30.44)));
  }

  var DATA = null;

  function load() {
    if (DATA) return Promise.resolve(DATA);
    return fetch('data/sadesati.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { DATA = j; return j; })
      .catch(function () { return null; });
  }

  function currentPhase(start, end, now) {
    if (now < start) return { key: 'before', label: 'Not yet begun', idx: -1 };
    if (now > end) return { key: 'after', label: 'Completed', idx: 3 };
    var span = end - start;
    var t = (now - start) / span;
    if (t < 1 / 3) return { key: 'rising', label: 'Phase 1 \u2014 rising', idx: 0,
      note: 'Saturn in the 12th from your Moon. Traditionally the settling-in phase: expenses, sleep, letting go of what is finished.' };
    if (t < 2 / 3) return { key: 'peak', label: 'Phase 2 \u2014 peak', idx: 1,
      note: 'Saturn over your Moon. Traditionally the heaviest of the three: pressure on the body, the mind and close relationships.' };
    return { key: 'setting', label: 'Phase 3 \u2014 setting', idx: 2,
      note: 'Saturn in the 2nd from your Moon. Traditionally the winding-down: finances, family, and the rebuilding afterwards.' };
  }

  function render() {
    var host = el('sshost');
    if (!host) return;

    host.innerHTML = '<div class="card"><h3>Sade Sati</h3>' +
      '<p class="muted">Loading the computed windows…</p></div>';

    load().then(function (j) {
      if (!j || !j.windows || !j.rashi) {
        host.innerHTML = '<div class="card"><h3>Sade Sati</h3>' +
          '<p class="muted">The Sade Sati data could not be loaded.</p></div>';
        return;
      }

      var opts = j.rashi.map(function (r, i) {
        return '<option value="' + i + '">' + esc(r) + '</option>';
      }).join('');

      host.innerHTML =
        '<div class="card"><h3>Sade Sati</h3>' +
        '<p class="muted">The seven and a half years when Saturn crosses the twelfth, first and ' +
        'second signs from your <strong>Moon</strong> \u2014 not your Sun sign. If you do not know ' +
        'your Moon sign, the Kundli screen computes it from your birth details.</p>' +
        '<label>Your Moon sign (rashi)</label>' +
        '<select id="sssel">' + opts + '</select>' +
        '<div id="ssout" style="margin-top:14px"></div></div>';

      function go() {
        var i = +el('sssel').value;
        var list = j.windows[String(i)] || [];
        var now = new Date();
        var out = el('ssout');

        if (!list.length) {
          out.innerHTML = '<p class="muted">No windows in the computed range for this sign.</p>';
          return;
        }

        var live = null;
        list.forEach(function (w) {
          var s = d(w[0]), e = d(w[1]);
          if (now >= s && now <= e) live = { s: s, e: e, years: w[2] };
        });

        var head;
        if (live) {
          var ph = currentPhase(live.s, live.e, now);
          var left = months(now, live.e);
          var done = Math.round(((now - live.s) / (live.e - live.s)) * 100);
          head = '<div class="warn" style="background:#fff4e6;border-color:#f0c48a">' +
            '<strong>You are in Sade Sati now.</strong><br>' +
            fmt(live.s) + ' to ' + fmt(live.e) + ' \u00b7 ' + live.years + ' years<br>' +
            '<strong>' + esc(ph.label) + '</strong>' +
            (ph.note ? '<br><span style="font-size:12.5px">' + esc(ph.note) + '</span>' : '') +
            '<br><span style="font-size:12.5px">About ' + left + ' months remaining \u00b7 ' +
            done + '% elapsed</span>' +
            '<div style="margin-top:8px;height:8px;background:#eee;border-radius:4px;overflow:hidden">' +
            '<div style="height:8px;width:' + Math.min(100, done) + '%;background:#b45309"></div></div>' +
            '</div>';
        } else {
          var next = null;
          list.forEach(function (w) {
            var s = d(w[0]);
            if (s > now && (!next || s < next.s)) next = { s: s, e: d(w[1]), years: w[2] };
          });
          head = '<div class="warn" style="background:#eef7f0;border-color:#a9d3b5">' +
            '<strong>You are not in Sade Sati today.</strong>' +
            (next ? '<br>Next window: ' + fmt(next.s) + ' to ' + fmt(next.e) +
              ' (' + next.years + ' years, begins in about ' + months(now, next.s) + ' months).'
              : '') + '</div>';
        }

        var rows = list.slice().reverse().map(function (w) {
          var s = d(w[0]), e = d(w[1]);
          var isNow = now >= s && now <= e;
          return '<tr' + (isNow ? ' style="background:#fdf4e3;font-weight:700"' : '') + '>' +
            '<td>' + fmt(s) + '</td><td>' + fmt(e) + '</td>' +
            '<td>' + w[2] + ' yr</td></tr>';
        }).join('');

        out.innerHTML = head +
          '<h4 style="margin-top:14px">All computed windows for ' + esc(j.rashi[i]) + '</h4>' +
          '<table><tr><td class="k">From</td><td class="k">To</td><td class="k">Length</td></tr>' +
          rows + '</table>' +
          '<div class="warn">Sade Sati is a traditional marker, not a verdict. Millions of people ' +
          'live through it without catastrophe, and the classical texts themselves describe it as a ' +
          'period of pressure and maturation rather than misfortune. Phase boundaries here are ' +
          'thirds of the window \u2014 the exact moment Saturn changes sign can differ by a few weeks. ' +
          'If a period feels genuinely hard, that is a matter for a person you can talk to, not for ' +
          'a chart.</div>';
      }

      el('sssel').onchange = go;

      // Pre-select the Moon sign if the Kundli screen has computed one.
      try {
        if (typeof PSEL !== 'undefined' && PSEL && PSEL.moonRashi) {
          var idx = j.rashi.indexOf(PSEL.moonRashi);
          if (idx >= 0) el('sssel').value = String(idx);
        }
      } catch (e) {}

      go();
    });
  }

  function attach() {
    var sec = el('kundli');
    if (!sec) return;
    var host = el('sshost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'sshost';
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
