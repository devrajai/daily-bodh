/* Daily Bodh — numerology report.
 *
 * Enter a name and a birth date, get a full report, and download it as a
 * self-contained HTML file you can keep, print to PDF, or send to someone.
 *
 * Everything is computed and assembled in the browser from data already in the
 * repo. Nothing is uploaded, no account, no server, no charge.
 *
 *   <script src="numerology-report.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }
  function reduce(n) {
    n = Math.abs(n);
    while (n > 9) n = String(n).split('').reduce(function (a, b) { return a + +b; }, 0);
    return n;
  }
  function t(v) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    if (Array.isArray(v)) return v.map(t).join('; ');
    if (typeof v === 'object') {
      if (v.en) return v.en;
      return Object.keys(v).map(function (k) { return k + ': ' + t(v[k]); }).join('; ');
    }
    return String(v);
  }

  /* Chaldean letter values, the system the site already uses for name numbers. */
  var CHALDEAN = {
    A: 1, I: 1, J: 1, Q: 1, Y: 1,
    B: 2, K: 2, R: 2,
    C: 3, G: 3, L: 3, S: 3,
    D: 4, M: 4, T: 4,
    E: 5, H: 5, N: 5, X: 5,
    U: 6, V: 6, W: 6,
    O: 7, Z: 7,
    F: 8, P: 8
  };

  function nameNumber(name) {
    var s = String(name || '').toUpperCase().replace(/[^A-Z]/g, '');
    if (!s) return null;
    var sum = 0;
    for (var i = 0; i < s.length; i++) sum += CHALDEAN[s[i]] || 0;
    return { raw: sum, reduced: reduce(sum) };
  }

  var EXALTED = { 1: [28], 2: [29], 3: [12], 4: [31], 5: [23, 32], 6: [24, 33], 7: [25, 34], 8: [26, 35], 9: [27, 36] };
  var PLANET = { 1: 'Sun', 2: 'Moon', 3: 'Jupiter', 4: 'Rahu', 5: 'Mercury', 6: 'Venus', 7: 'Ketu', 8: 'Saturn', 9: 'Mars' };

  var G = null, A = null;

  function loadAll() {
    if (G && A) return Promise.resolve();
    return Promise.all([
      fetch('data/numerology-guide.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }),
      fetch('data/numerology-advanced.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
    ]).then(function (res) { G = res[0]; A = res[1]; });
  }

  function numBlock(label, num, extra) {
    var d = G && G.numbers ? G.numbers[String(num)] : null;
    var h = '<div class="rp-sec"><h3>' + esc(label) + ': ' + num +
      (PLANET[num] ? ' <span class="rp-muted">' + PLANET[num] + '</span>' : '') + '</h3>';
    if (extra) h += '<p class="rp-muted">' + esc(extra) + '</p>';
    if (!d) return h + '</div>';
    if (d.colours) h += '<p class="rp-muted">' + esc(t(d.colours)) + ' &middot; ' + esc(t(d.day || '')) + '</p>';
    function list(title, v, cls) {
      if (!v) return '';
      var arr = Array.isArray(v) ? v : [v];
      return '<h4 class="' + (cls || '') + '">' + esc(title) + '</h4><ul>' +
        arr.map(function (x) { return '<li>' + esc(t(x)) + '</li>'; }).join('') + '</ul>';
    }
    h += list('Strengths', d.pros, 'rp-good');
    h += list('Weaknesses', d.cons, 'rp-bad');
    if (d.career) h += '<h4>Career</h4><p>' + esc(t(d.career)) + '</p>';
    if (d.love) h += '<h4>Love</h4><p>' + esc(t(d.love)) + '</p>';
    if (d.money) h += '<h4>Money</h4><p>' + esc(t(d.money)) + '</p>';
    if (d.health) h += '<h4>Health</h4><p>' + esc(t(d.health)) + '</p>';
    if (d.remedies) h += list('Remedies (traditional)', d.remedies);
    if (d.mantra) h += '<h4>Mantra</h4><p>' + esc(t(d.mantra)) + '</p>';
    return h + '</div>';
  }

  function build(name, dobStr) {
    var d = new Date(dobStr + 'T00:00:00');
    if (isNaN(d)) return '<p>Please enter a valid birth date.</p>';
    var now = new Date();

    var mulank = reduce(d.getDate());
    var bhagyank = reduce(reduce(d.getDate()) + reduce(d.getMonth() + 1) + reduce(d.getFullYear()));
    var nm = nameNumber(name);
    var py = reduce(mulank + reduce(d.getMonth() + 1) + reduce(now.getFullYear()));
    var pm = reduce(py + reduce(now.getMonth() + 1));
    var pd = reduce(pm + reduce(now.getDate()));

    var ex = (EXALTED[mulank] || []).indexOf(d.getDate()) >= 0;

    var h = '';
    h += '<div class="rp-sec rp-head"><h2>' + esc(name || 'Numerology report') + '</h2>' +
      '<p class="rp-muted">Born ' + esc(dobStr) + ' &middot; report generated ' +
      now.toISOString().slice(0, 10) + '</p></div>';

    h += '<div class="rp-sec"><h3>Your numbers</h3><table class="rp-tab">' +
      '<tr><td>Mulank (birth day)</td><td><strong>' + mulank + '</strong> &middot; ' + PLANET[mulank] + '</td></tr>' +
      '<tr><td>Bhagyank (full date)</td><td><strong>' + bhagyank + '</strong> &middot; ' + PLANET[bhagyank] + '</td></tr>' +
      (nm ? '<tr><td>Name number (Chaldean)</td><td><strong>' + nm.reduced + '</strong> &middot; ' + PLANET[nm.reduced] + ' <span class="rp-muted">(from ' + nm.raw + ')</span></td></tr>' : '') +
      '<tr><td>Personal year</td><td><strong>' + py + '</strong></td></tr>' +
      '<tr><td>Personal month</td><td><strong>' + pm + '</strong></td></tr>' +
      '<tr><td>Personal day</td><td><strong>' + pd + '</strong></td></tr>' +
      '</table>' +
      (ex ? '<p class="rp-good"><strong>Exalted mulank.</strong> Born on the ' + d.getDate() +
        ', which is the exalted source for ' + mulank + ' &mdash; the tradition treats this as giving the number extra force.</p>'
        : '<p class="rp-muted">Exalted sources for ' + mulank + ' are ' + (EXALTED[mulank] || []).join(' and ') + '.</p>') +
      '</div>';

    h += numBlock('Mulank', mulank);
    if (bhagyank !== mulank) h += numBlock('Bhagyank', bhagyank);
    if (nm && nm.reduced !== mulank && nm.reduced !== bhagyank) h += numBlock('Name number', nm.reduced);

    if (G && G.personalYear && G.personalYear[String(py)]) {
      h += '<div class="rp-sec"><h3>This year: personal year ' + py + '</h3><p>' +
        esc(t(G.personalYear[String(py)])) + '</p>';
      if (A && A.yearDeep && A.yearDeep[String(py)]) {
        var yd = A.yearDeep[String(py)];
        Object.keys(yd).forEach(function (k) {
          h += '<h4>' + esc(k.charAt(0).toUpperCase() + k.slice(1)) + '</h4><p>' + esc(t(yd[k])) + '</p>';
        });
      }
      h += '</div>';
    }

    if (A && A.karmic) {
      var kd = A.karmic[String(d.getDate())] || A.karmic[String(reduce(d.getDate()))];
      if (kd) h += '<div class="rp-sec"><h3>Karmic lesson</h3><p><strong>' + esc(t(kd.name)) +
        '</strong><br>' + esc(t(kd.lesson)) + '</p></div>';
    }

    if (A && A.dailyTip && A.dailyTip[String(mulank)]) {
      h += '<div class="rp-sec"><h3>A daily practice</h3><p>' + esc(t(A.dailyTip[String(mulank)])) + '</p></div>';
    }

    if (A && A.gemVastu && A.gemVastu[String(mulank)]) {
      var gv = A.gemVastu[String(mulank)];
      h += '<div class="rp-sec"><h3>Gemstone and vastu (traditional)</h3>';
      Object.keys(gv).forEach(function (k) {
        h += '<h4>' + esc(k.charAt(0).toUpperCase() + k.slice(1)) + '</h4><p>' + esc(t(gv[k])) + '</p>';
      });
      h += '<p class="rp-muted">Gems are expensive and are not a substitute for anything. These are recorded as tradition, not advice to buy.</p></div>';
    }

    h += '<div class="rp-sec rp-warn"><p><strong>Please read.</strong> Numerology is a traditional system of ' +
      'reflection, not a science and not a prediction. Nothing here determines what will happen in your life. ' +
      'Health notes are traditional associations, not medical advice &mdash; see a doctor for anything that matters. ' +
      'Financial notes are not advice &mdash; see a qualified adviser.</p></div>';

    return h;
  }

  var CSS = 'body{font-family:Georgia,serif;max-width:720px;margin:0 auto;padding:28px 20px;' +
    'color:#221c2e;background:#fdfcfa;line-height:1.65}' +
    '.rp-sec{margin:0 0 22px;padding:16px 18px;background:#fff;border:1px solid #e6e0ee;border-radius:12px}' +
    '.rp-head{background:#4c1d95;color:#fff;border:0}.rp-head h2{margin:0 0 4px;font-size:24px}' +
    '.rp-head .rp-muted{color:#ddd}' +
    'h3{font-size:18px;margin:0 0 8px;color:#4c1d95}h4{font-size:14px;margin:14px 0 4px;color:#333}' +
    'ul{margin:4px 0 0;padding-left:20px}li{margin:3px 0}' +
    '.rp-muted{color:#6b6478;font-size:13.5px}' +
    '.rp-good{color:#15803d}.rp-bad{color:#b91c1c}' +
    '.rp-tab{width:100%;border-collapse:collapse}.rp-tab td{padding:5px 0;border-bottom:1px solid #f0eef4}' +
    '.rp-warn{background:#fff8e6;border-color:#f0dca8;font-size:13.5px}' +
    '@media print{body{background:#fff}.rp-sec{break-inside:avoid;border:1px solid #ddd}}';

  function download(html, name) {
    var doc = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<title>' + esc(name || 'Numerology report') + ' — Daily Bodh</title>' +
      '<style>' + CSS + '</style></head><body>' + html +
      '<p style="text-align:center;color:#6b6478;font-size:12px;margin-top:24px">' +
      'Generated by Daily Bodh — free, offline, nothing collected.</p></body></html>';
    var blob = new Blob([doc], { type: 'text/html;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (String(name || 'numerology-report').replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'numerology-report') + '.html';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  function render() {
    var host = el('reporthost');
    if (!host) return;
    var nm = (el('rpname') && el('rpname').value) || '';
    var dob = (el('rpdob') && el('rpdob').value) || '';

    host.innerHTML =
      '<div class="card"><h3>Your full report</h3>' +
      '<p class="muted">Enter a name and birth date. Everything is computed in your browser &mdash; ' +
      'nothing is sent anywhere, there is no account, and it is free.</p>' +
      '<label>Name</label><input id="rpname" placeholder="Full name as usually written" value="' + esc(nm) + '">' +
      '<label>Birth date</label><input id="rpdob" type="date" value="' + esc(dob) + '">' +
      '<div id="rpout" style="margin-top:14px"></div></div>';

    var out = el('rpout');

    function go() {
      var n = el('rpname').value, b = el('rpdob').value;
      if (!b) { out.innerHTML = '<p class="muted">Pick a birth date to generate the report.</p>'; return; }
      loadAll().then(function () {
        var html = build(n, b);
        out.innerHTML = '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">' +
          '<button class="chip" id="rpdl">Download report</button>' +
          '<button class="chip" id="rppr">Print / save as PDF</button></div>' +
          '<div id="rprender" style="border:1px solid #e6e0ee;border-radius:12px;padding:10px;background:#fdfcfa">' +
          html + '</div>';
        var st = document.createElement('style');
        st.textContent = CSS.replace(/body\{/, '#rprender{');
        out.appendChild(st);
        el('rpdl').onclick = function () { download(build(n, b), n); };
        el('rppr').onclick = function () {
          var w = window.open('', '_blank');
          if (!w) return;
          w.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>' +
            esc(n || 'Report') + '</title><style>' + CSS + '</style></head><body>' +
            build(n, b) + '</body></html>');
          w.document.close();
          setTimeout(function () { w.print(); }, 400);
        };
      });
    }

    el('rpname').oninput = function () { if (el('rpdob').value) go(); };
    el('rpdob').onchange = go;
    if (dob) go();
  }

  function attach() {
    var sec = el('numerology');
    if (!sec) return;
    var host = el('reporthost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'reporthost';
      sec.insertBefore(host, sec.firstChild ? sec.firstChild.nextSibling : null);
    }
    if (!host.innerHTML.trim()) render();
  }

  function boot() {
    var tries = 0;
    var iv = setInterval(function () {
      if (el('numerology')) { attach(); clearInterval(iv); }
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
