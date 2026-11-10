/* Daily Bodh — my profile.
 *
 * Saves birth details in the browser's localStorage and shows a "Today for you"
 * card on the home screen. Nothing is transmitted: there is no account, no
 * server call, and clearing site data removes it completely.
 *
 * Everything computed here is exact from the birth DATE alone — mulank, bhagyank
 * and the personal day number. The Moon sign cannot be derived from a date
 * (the Moon changes sign every ~2.25 days), so it is asked for, not guessed.
 *
 * Appends to the Today tab. That section carries no id in the page markup, so
 * the fallback to the first <section> is what actually makes this work.
 *   <script src="myprofile.js"></script>
 */
(function () {
  'use strict';

  var KEY = 'dailybodh.profile.v1';

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

  var PLANET = { 1: 'Sun', 2: 'Moon', 3: 'Jupiter', 4: 'Rahu', 5: 'Mercury',
                 6: 'Venus', 7: 'Ketu', 8: 'Saturn', 9: 'Mars' };
  var SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
               'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

  /* One line per number, for the daily card. Deliberately short and non-predictive. */
  var DAYLINE = {
    1: 'A day for starting something yourself rather than waiting to be asked.',
    2: 'A day for listening. Partnerships and quiet conversations go better than solo pushes.',
    3: 'A day for expression \u2014 writing, teaching, or saying the thing you have been holding.',
    4: 'A day for systems. Fix the thing that keeps breaking instead of working around it.',
    5: 'A day for movement and change. Expect interruption; use it.',
    6: 'A day for home and the people in it. Care given now tends to return.',
    7: 'A day for study and solitude. Understanding deepens; conversation may not.',
    8: 'A day for practical decisions about money and effort. Look at the numbers.',
    9: 'A day for finishing and releasing. Complete something rather than adding to it.'
  };

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var p = JSON.parse(raw);
      if (!p || !p.dob) return null;
      return p;
    } catch (e) { return null; }
  }

  function save(p) {
    try { localStorage.setItem(KEY, JSON.stringify(p)); return true; }
    catch (e) { return false; }
  }

  function clear() {
    try { localStorage.removeItem(KEY); } catch (e) {}
  }

  function calc(p) {
    var d = new Date(p.dob + 'T00:00:00');
    if (isNaN(d)) return null;
    var now = new Date();
    var mulank = reduce(d.getDate());
    var bhagyank = reduce(reduce(d.getDate()) + reduce(d.getMonth() + 1) + reduce(d.getFullYear()));
    var py = reduce(mulank + reduce(d.getMonth() + 1) + reduce(now.getFullYear()));
    var pm = reduce(py + reduce(now.getMonth() + 1));
    var pd = reduce(pm + reduce(now.getDate()));
    return { mulank: mulank, bhagyank: bhagyank, py: py, pm: pm, pd: pd };
  }

  function formHTML(p) {
    var opts = SIGNS.map(function (s) {
      return '<option value="' + s + '"' + (p && p.rashi === s ? ' selected' : '') + '>' + s + '</option>';
    }).join('');
    return '<div class="card"><h3>Today for you</h3>' +
      '<p class="muted">Save your birth details on this device and the home screen will open with ' +
      'your numbers. It is stored in your browser only \u2014 nothing is sent anywhere, and there is ' +
      'no account.</p>' +
      '<label>Name (optional)</label>' +
      '<input id="pfname" placeholder="Your name" value="' + esc(p && p.name || '') + '">' +
      '<label style="margin-top:8px">Birth date</label>' +
      '<input id="pfdob" type="date" value="' + esc(p && p.dob || '') + '">' +
      '<label style="margin-top:8px">Moon sign (optional)</label>' +
      '<select id="pfrashi"><option value="">Not sure</option>' + opts + '</select>' +
      '<div style="display:flex;gap:8px;margin-top:12px">' +
      '<button class="chip" id="pfsave">Save</button>' +
      (p ? '<button class="chip" id="pfclear">Remove</button>' : '') +
      '</div>' +
      '<p class="muted" style="margin-top:8px;font-size:12px">Your birth date gives an exact mulank ' +
      'and personal-day number. The Moon sign cannot be worked out from a date alone \u2014 the Moon ' +
      'changes sign roughly every two and a half days \u2014 so it is asked for rather than guessed.</p>' +
      '</div>';
  }

  function todayHTML(p, c) {
    var now = new Date();
    return '<div class="card" id="pftoday"><h3>Today for you' +
      (p.name ? ', ' + esc(p.name) : '') + '</h3>' +
      '<p class="muted">' + now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear() +
      (p.rashi ? ' \u00b7 Moon in ' + esc(p.rashi) : '') + '</p>' +
      '<table>' +
      '<tr><td class="k" style="width:46%">Personal day</td><td><strong>' + c.pd + '</strong> \u00b7 ' +
      PLANET[c.pd] + '</td></tr>' +
      '<tr><td class="k">Personal month</td><td>' + c.pm + '</td></tr>' +
      '<tr><td class="k">Personal year</td><td>' + c.py + '</td></tr>' +
      '<tr><td class="k">Mulank</td><td>' + c.mulank + ' \u00b7 ' + PLANET[c.mulank] + '</td></tr>' +
      '<tr><td class="k">Bhagyank</td><td>' + c.bhagyank + ' \u00b7 ' + PLANET[c.bhagyank] + '</td></tr>' +
      '</table>' +
      '<p style="margin-top:10px">' + esc(DAYLINE[c.pd] || '') + '</p>' +
      '<div style="display:flex;gap:8px;margin-top:10px">' +
      '<button class="chip" id="pfedit">Edit details</button></div>' +
      '<div class="warn">Numerology is a traditional system of reflection, not a forecast. ' +
      'This line describes a theme, not what will happen today.</div></div>';
  }

  function render() {
    var host = el('pfhost');
    if (!host) return;
    var p = load();
    var c = p ? calc(p) : null;

    host.innerHTML = (p && c) ? todayHTML(p, c) : formHTML(null);

    if (p && c) {
      el('pfedit').onclick = function () {
        host.innerHTML = formHTML(p);
        wireForm(p);
      };
    } else {
      wireForm(p);
    }
  }

  function wireForm(existing) {
    var saveBtn = el('pfsave');
    if (saveBtn) saveBtn.onclick = function () {
      var dob = el('pfdob').value;
      if (!dob) { el('pfdob').focus(); return; }
      var p = { name: (el('pfname').value || '').trim(), dob: dob, rashi: el('pfrashi').value || '' };
      if (!save(p)) {
        alert('This browser blocked local storage, so the profile could not be saved.');
        return;
      }
      render();
    };
    var clr = el('pfclear');
    if (clr) clr.onclick = function () { clear(); render(); };
  }

  function attach() {
    // The Today section carries no id in the page markup, so fall back to the
    // first <section>, which is what it is. Without this the card never mounted.
    var sec = el('today') || el('home') || document.querySelector('section');
    if (!sec) return;
    var host = el('pfhost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'pfhost';
      // Put it at the very top: this is the first thing a returning visitor wants.
      sec.insertBefore(host, sec.firstChild);
    }
    if (!host.innerHTML.trim()) render();
  }

  function boot() {
    var tries = 0;
    var iv = setInterval(function () {
      if (el('today') || el('home') || document.querySelector('section')) { attach(); clearInterval(iv); }
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
