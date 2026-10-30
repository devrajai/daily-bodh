/* Daily Bodh — numerology cycles: personal year, month, day, and the week ahead.
 *
 * Enter a birth date and this shows the number governing today, this month,
 * this year, and each of the next seven days.
 *
 * The cycles are the standard ones:
 *   personal year  = reduce(day + month + current year)
 *   personal month = reduce(personal year + current month)
 *   personal day   = reduce(personal month + current day)
 *
 * There is no classical "personal week" in numerology - the tradition counts
 * years, months and days. Rather than invent a fourth cycle, this shows the
 * seven personal days ahead, which is the same information without inventing.
 *
 * Only APPENDS to the Numerology tab.
 *   <script src="cycles.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }
  function reduce(n) { n = Math.abs(n); while (n > 9) n = String(n).split('').reduce(function (a, b) { return a + +b; }, 0); return n; }

  /* The nine-step cycle, the tradition's own sequence. */
  var MEANING = {
    1: ['Beginnings', 'Start things. Initiate, propose, plant. A year or day for first moves, not for waiting.'],
    2: ['Patience', 'Cooperate and wait. Progress comes through others, not by pushing. Good for agreements.'],
    3: ['Expression', 'Say it, make it, show it. Social and creative energy; a poor time to hide.'],
    4: ['Foundation', 'Work, order, the unglamorous part. Build the structure the other numbers will use.'],
    5: ['Change', 'Movement, travel, surprise. Plans shift; flexibility is the whole skill here.'],
    6: ['Responsibility', 'Home, family, service. Others need you; say yes where it matters.'],
    7: ['Reflection', 'Study, rest, go inward. Not a time to force outcomes. Analysis beats action.'],
    8: ['Results', 'Money, power, consequence. What was built gets weighed. Deal with the practical.'],
    9: ['Completion', 'Finish and release. Clear out what is done. A poor time to begin something new.']
  };

  var DAYNAME = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function personalDay(d, ref) {
    var py = reduce(reduce(d.getDate()) + reduce(d.getMonth() + 1) + reduce(ref.getFullYear()));
    var pm = reduce(py + reduce(ref.getMonth() + 1));
    return { py: py, pm: pm, pd: reduce(pm + reduce(ref.getDate())) };
  }

  function card(n, label, when) {
    var m = MEANING[n] || ['', ''];
    return '<tr>' +
      '<td class="k" style="width:26%">' + esc(label) + '</td>' +
      '<td style="width:12%;font-size:20px;font-weight:700;color:var(--accent)">' + n + '</td>' +
      '<td><strong>' + esc(m[0]) + '</strong> <span class="muted">&mdash; ' + esc(m[1]) + '</span>' +
      (when ? '<br><span class="muted" style="font-size:12px">' + esc(when) + '</span>' : '') +
      '</td></tr>';
  }

  function render() {
    var host = el('cycleshost');
    if (!host) return;
    var nd = el('nd');
    var v = nd ? nd.value : '';
    if (!v) {
      host.innerHTML = '<div class="card"><h3>Your cycles</h3>' +
        '<p class="muted">Enter your birth date above and the personal year, month and day appear here, ' +
        'with the week ahead.</p></div>';
      return;
    }
    var d = new Date(v + 'T00:00:00');
    if (isNaN(d)) return;
    var now = new Date();

    var today = personalDay(d, now);
    var thisMonth = personalDay(d, new Date(now.getFullYear(), now.getMonth(), 1));

    var week = '';
    for (var i = 0; i < 7; i++) {
      var day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      var c = personalDay(d, day);
      var m = MEANING[c.pd] || ['', ''];
      week += '<tr' + (i === 0 ? ' style="background:#f3eefc"' : '') + '>' +
        '<td class="k" style="width:26%">' + DAYNAME[day.getDay()] + ' ' +
        day.getDate() + '/' + (day.getMonth() + 1) + '</td>' +
        '<td style="width:12%;font-weight:700;color:var(--accent)">' + c.pd + '</td>' +
        '<td><strong>' + esc(m[0]) + '</strong> <span class="muted">' + esc(m[1].split('.')[0]) + '.</span></td></tr>';
    }

    host.innerHTML =
      '<div class="card"><h3>Your cycles</h3>' +
      '<p class="muted">Counted from your birth day and month. These are the numbers governing the ' +
      'period you are in, not a forecast of events.</p>' +
      '<table>' +
      card(today.pd, 'Today', now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear()) +
      card(thisMonth.pm, 'This month', now.toLocaleString('en', { month: 'long' }) + ' ' + now.getFullYear()) +
      card(today.py, 'This year', String(now.getFullYear())) +
      '</table></div>' +
      '<div class="card"><h3>The week ahead</h3>' +
      '<p class="muted">Seven personal days. There is no classical personal-week cycle in numerology, ' +
      'so this shows the days themselves rather than inventing one.</p>' +
      '<table>' + week + '</table></div>' +
      '<div class="warn">Numerology cycles are the tradition\u2019s framework for reflection. They are not ' +
      'a prediction, and the number governing a day does not determine what happens on it.</div>';
  }

  function attach() {
    var sec = el('numerology');
    if (!sec) return;
    var host = el('cycleshost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'cycleshost';
      sec.appendChild(host);
    }
    render();
  }

  function boot() {
    document.addEventListener('change', function (e) {
      if (e.target && e.target.id === 'nd') setTimeout(attach, 0);
    }, true);
    document.addEventListener('input', function (e) {
      if (e.target && e.target.id === 'nd') setTimeout(attach, 0);
    }, true);
    var tries = 0;
    var iv = setInterval(function () {
      if (el('numerology') && el('nd')) { attach(); clearInterval(iv); }
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
