/* Daily Bodh — Vimshottari dasha timeline.
 *
 * The 120-year cycle, computed from the birth nakshatra and pada. Shows the
 * mahadasha and antardasha you are in now, with dates, and the periods ahead.
 *
 * Where the input comes from: the birth nakshatra and pada fix the starting
 * lord and the balance of the first period. The position within the nakshatra
 * is taken as the midpoint of the chosen pada, because that is the finest
 * division a reader can reliably supply without a full chart. The card says so.
 *
 * Appends to the Kundli tab.
 *   <script src="dasha.js"></script>
 */
(function () {
  'use strict';

  var KEY = 'dailybodh.dasha.v1';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  /* Vimshottari: order and years, summing to 120. */
  var LORDS = [
    { name: 'Ketu', years: 7 }, { name: 'Venus', years: 20 }, { name: 'Sun', years: 6 },
    { name: 'Moon', years: 10 }, { name: 'Mars', years: 7 }, { name: 'Rahu', years: 18 },
    { name: 'Jupiter', years: 16 }, { name: 'Saturn', years: 19 }, { name: 'Mercury', years: 17 }
  ];

  var NAKSHATRA = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
    'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
    'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
    'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
    'Uttara Bhadrapada', 'Revati'
  ];

  function lordIndexFor(nakIndex) {
    // Ashwini (0) is Ketu, then the sequence repeats every nine.
    return nakIndex % 9;
  }

  function addYears(date, years) {
    // 365.2425 days per year keeps the cycle aligned over a lifetime.
    return new Date(date.getTime() + years * 365.2425 * 86400000);
  }

  function fmt(d) {
    return d.getDate() + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()] + ' ' + d.getFullYear();
  }

  /* Build the mahadasha sequence from birth, with the first period part-elapsed. */
  function mahadashas(birth, nakIndex, pada) {
    var start = lordIndexFor(nakIndex);
    var frac = (pada - 0.5) / 4;                 // midpoint of the chosen pada
    var out = [];
    var cursor = new Date(birth.getTime());

    // First period: only the balance remains at birth.
    var firstLord = LORDS[start];
    var balance = firstLord.years * (1 - frac);
    out.push({ lord: firstLord.name, years: firstLord.years, from: cursor,
               to: addYears(cursor, balance), partial: true, balance: balance });
    cursor = out[0].to;

    for (var k = 1; k < 9; k++) {
      var L = LORDS[(start + k) % 9];
      var to = addYears(cursor, L.years);
      out.push({ lord: L.name, years: L.years, from: new Date(cursor.getTime()), to: to, partial: false });
      cursor = to;
    }
    return out;
  }

  /* Antardashas inside a mahadasha: same order, proportional to sub-years. */
  function antardashas(md) {
    var idx = LORDS.map(function (l) { return l.name; }).indexOf(md.lord);
    var out = [];
    var cursor = new Date(md.from.getTime());
    for (var k = 0; k < 9; k++) {
      var L = LORDS[(idx + k) % 9];
      var share = (md.years * L.years) / 120;
      var to = new Date(cursor.getTime() + share * 365.2425 * 86400000);
      out.push({ lord: L.name, from: new Date(cursor.getTime()), to: to });
      cursor = to;
    }
    // guard against float drift: snap the last to the parent's end
    out[8].to = new Date(md.to.getTime());
    return out;
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function save(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); return true; } catch (e) { return false; } }

  function formHTML(p) {
    var nakOpts = NAKSHATRA.map(function (n, i) {
      return '<option value="' + i + '"' + (p && p.nak === i ? ' selected' : '') + '>' + (i + 1) + '. ' + n + '</option>';
    }).join('');
    var padaOpts = [1, 2, 3, 4].map(function (k) {
      return '<option value="' + k + '"' + (p && p.pada === k ? ' selected' : '') + '>' + k + '</option>';
    }).join('');
    return '<div class="card"><h3>Vimshottari dasha</h3>' +
      '<p class="muted">The 120-year cycle of planetary periods. Your starting lord is fixed by the ' +
      'nakshatra the Moon occupied at birth.</p>' +
      '<label>Birth date</label>' +
      '<input id="dsdob" type="date" value="' + esc(p && p.dob || '') + '">' +
      '<label style="margin-top:8px">Birth nakshatra</label>' +
      '<select id="dsnak"><option value="">Choose…</option>' + nakOpts + '</select>' +
      '<label style="margin-top:8px">Pada (quarter of the nakshatra)</label>' +
      '<select id="dspada">' + padaOpts + '</select>' +
      '<div style="margin-top:12px"><button class="chip" id="dssave">Build timeline</button></div>' +
      '<p class="muted" style="margin-top:8px;font-size:12px">The nakshatra and pada come from your ' +
      'birth chart — the Kundli tab computes the Moon\u2019s nakshatra if you enter your birth details. ' +
      'The exact position inside the nakshatra is taken as the midpoint of the chosen pada, which can ' +
      'shift a period boundary by a few weeks.</p></div>';
  }

  function timelineHTML(p) {
    var birth = new Date(p.dob + 'T00:00:00');
    var mds = mahadashas(birth, p.nak, p.pada);
    var now = new Date();

    var current = null, currentAd = null;
    mds.forEach(function (m) {
      if (now >= m.from && now <= m.to) {
        current = m;
        antardashas(m).forEach(function (a) {
          if (now >= a.from && now <= a.to) currentAd = a;
        });
      }
    });

    var head;
    if (current) {
      var elapsed = Math.round(((now - current.from) / (current.to - current.from)) * 100);
      head = '<div class="warn" style="background:#f3eefc;border-color:#c9b8e8">' +
        '<strong>Mahadasha: ' + esc(current.lord) + '</strong><br>' +
        fmt(current.from) + ' to ' + fmt(current.to) + ' \u00b7 ' + elapsed + '% elapsed' +
        '<div style="margin-top:8px;height:8px;background:#e2d9f2;border-radius:4px;overflow:hidden">' +
        '<div style="height:8px;width:' + Math.min(100, elapsed) + '%;background:#6d28d9"></div></div>' +
        (currentAd ? '<div style="margin-top:10px"><strong>Antardasha: ' + esc(currentAd.lord) +
          '</strong><br><span style="font-size:12.5px">' + fmt(currentAd.from) + ' to ' +
          fmt(currentAd.to) + '</span></div>' : '') + '</div>';
    } else {
      head = '<div class="warn">The date given falls outside the computed cycle.</div>';
    }

    var rows = mds.map(function (m) {
      var isNow = current && m.lord === current.lord && m.from.getTime() === current.from.getTime();
      return '<tr' + (isNow ? ' style="background:#f3eefc;font-weight:700"' : '') + '>' +
        '<td><strong style="font-size:13px">' + esc(m.lord) + '</strong></td>' +
        '<td style="font-size:12.5px">' + fmt(m.from) + '</td>' +
        '<td style="font-size:12.5px">' + fmt(m.to) + '</td>' +
        '<td class="muted" style="font-size:12px">' + (m.partial ? m.balance.toFixed(1) + ' yr left' : m.years + ' yr') + '</td>' +
        '</tr>';
    }).join('');

    var ads = current ? antardashas(current) : [];
    var adRows = ads.map(function (a) {
      var isNow = currentAd && a.lord === currentAd.lord;
      return '<tr' + (isNow ? ' style="background:#f3eefc;font-weight:700"' : '') + '>' +
        '<td style="font-size:13px">' + esc(a.lord) + '</td>' +
        '<td style="font-size:12.5px">' + fmt(a.from) + '</td>' +
        '<td style="font-size:12.5px">' + fmt(a.to) + '</td></tr>';
    }).join('');

    return '<div class="card"><h3>Your dasha timeline</h3>' +
      '<p class="muted">Born ' + esc(p.dob) + ' \u00b7 ' + esc(NAKSHATRA[p.nak]) + ', pada ' + p.pada +
      ' \u00b7 starting lord ' + esc(LORDS[lordIndexFor(p.nak)].name) + '</p>' +
      head +
      '<h4 style="margin-top:14px">The nine mahadashas</h4>' +
      '<table><tr><td class="k">Lord</td><td class="k">From</td><td class="k">To</td><td class="k">Length</td></tr>' +
      rows + '</table>' +
      (current ? '<h4 style="margin-top:14px">Antardashas within ' + esc(current.lord) + '</h4>' +
        '<table><tr><td class="k">Lord</td><td class="k">From</td><td class="k">To</td></tr>' + adRows + '</table>' : '') +
      '<div style="margin-top:12px"><button class="chip" id="dsedit">Change details</button></div>' +
      '<div class="warn">Dasha periods are a traditional way of dividing a life into chapters. They ' +
      'describe a theme, not an outcome — the classical texts are explicit that a period\u2019s effect ' +
      'depends on the strength of the lord in the chart, which this does not compute.</div></div>';
  }

  function render() {
    var host = el('dashahost');
    if (!host) return;
    var p = load();
    var ok = p && p.dob && typeof p.nak === 'number';
    host.innerHTML = ok ? timelineHTML(p) : formHTML(null);
    if (ok) {
      el('dsedit').onclick = function () { host.innerHTML = formHTML(p); wire(); };
    } else {
      wire();
    }
  }

  function wire() {
    var b = el('dssave');
    if (b) b.onclick = function () {
      var dob = el('dsdob').value;
      var nak = el('dsnak').value;
      if (!dob || nak === '') { if (!dob) el('dsdob').focus(); else el('dsnak').focus(); return; }
      save({ dob: dob, nak: parseInt(nak, 10), pada: parseInt(el('dspada').value, 10) });
      render();
    };
  }

  function attach() {
    var sec = el('kundli');
    if (!sec) return;
    var host = el('dashahost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'dashahost';
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
