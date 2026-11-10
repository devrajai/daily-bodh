/* Daily Bodh — why the same festival falls on two dates.
 *
 * The question that makes people distrust panchangs, answered from the rules
 * rather than dismissed. Kshaya and vriddhi tithi, Adhik Maas, the sunrise rule,
 * and why Gujarat and Bengal keep Diwali differently.
 *
 * Appends to the Panchang tab.
 *   <script src="why-dates.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  var SECTIONS = [
    {
      h: 'A tithi is not a day',
      p: 'The most common misunderstanding is that a tithi is a date. It is not. A tithi is a ' +
         'measure of angle: the distance between the Sun and the Moon, divided into thirty parts of ' +
         'twelve degrees each. A tithi ends when that angle is reached, wherever in the clock that ' +
         'falls \u2014 which is why a tithi can begin at 3am and end at 9pm the same day, or run ' +
         'across two midnights.'
    },
    {
      h: 'Why a tithi is not 24 hours',
      p: 'The Moon moves faster than the Sun, but not at a constant rate. Near perigee it covers ' +
         'ground quickly and a tithi can be over in about 19 hours. Near apogee it is slow and a ' +
         'tithi can last 26 hours. So the lunar month is not a tidy 30 days \u2014 it drifts, and ' +
         'that drift is the source of almost every date disagreement.'
    },
    {
      h: 'The sunrise rule',
      p: 'The tithi that is running at sunrise is the tithi that names the day. That single ' +
         'convention decides most disputes. If a tithi begins at 4am and sunrise is at 6am, that ' +
         'day carries it. If the same tithi begins at 7am \u2014 an hour after sunrise \u2014 the ' +
         'day belongs to the previous tithi, and the festival moves to the next day.'
    },
    {
      h: 'Kshaya tithi \u2014 the tithi that disappears',
      p: 'Because tithis vary in length, one can begin after one sunrise and finish before the ' +
         'next. It is then never running at any sunrise, so it is skipped entirely. This is a ' +
         'kshaya tithi. A festival tied to it can appear to vanish from the calendar for that ' +
         'month \u2014 which is exactly what people notice and cannot explain.'
    },
    {
      h: 'Vriddhi tithi \u2014 the tithi that repeats',
      p: 'The reverse. A long tithi can be running at two consecutive sunrises. It then occupies ' +
         'two days, and a festival tied to it may be observed on either. Different panchangs choose ' +
         'differently, and both can defend the choice from the same rulebook.'
    },
    {
      h: 'Adhik Maas \u2014 the extra month',
      p: 'The lunar year is about eleven days shorter than the solar one. Left alone, the months ' +
         'would drift out of the seasons. The correction is an intercalary month: roughly every ' +
         'thirty-two months a lunar month passes with no solar ingress (the Sun does not change ' +
         'sign during it), and that month is repeated as Adhik Maas. Festivals are generally not ' +
         'held in it, which is why a festival can seem to skip a year.'
    },
    {
      h: 'Purnimanta and Amanta \u2014 two month systems',
      p: 'North India ends the month at the full moon (Purnimanta). Most of the south and east ends ' +
         'it at the new moon (Amanta). The tithi numbers stay the same, but the month name shifts ' +
         'by a fortnight. This is why the same ritual can be described as belonging to two ' +
         'different months depending on which panchang you read, with no one actually wrong.'
    },
    {
      h: 'Why Diwali differs between Gujarat and Bengal',
      p: 'In most of India, Diwali falls on the new-moon day of Kartika, with Lakshmi puja in the ' +
         'evening. In Bengal the same night is Kali Puja. In Gujarat the new business year begins ' +
         'the next morning, so the commercial observance is a day later than the ritual one. These ' +
         'are not competing claims about astronomy \u2014 they are different observances that happen ' +
         'to share a lunar date.'
    }
  ];

  function render() {
    var host = el('whyhost');
    if (!host) return;

    host.innerHTML =
      '<div class="card"><h3>Why the same festival falls on two dates</h3>' +
      '<p class="muted">Every year someone asks why one panchang says Tuesday and another says ' +
      'Wednesday. The answer is not that one is wrong. It comes from four rules, and once you know ' +
      'them the disagreements stop looking like errors.</p>' +
      SECTIONS.map(function (s) {
        return '<div style="padding:11px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:14px;color:var(--accent)">' + esc(s.h) + '</strong>' +
          '<div style="margin-top:5px;font-size:13.5px">' + esc(s.p) + '</div></div>';
      }).join('') +
      '<div class="warn">Two panchangs can disagree and both be right, because they are answering ' +
      'slightly different questions. Where your family or temple follows a particular reckoning, ' +
      'follow theirs \u2014 the date on this site is computed from the rules above, at Delhi, and ' +
      'is offered as one defensible reading rather than the only one.</div></div>' +

      '<div class="card"><h3>What this site does</h3>' +
      '<p class="muted">The panchang here uses the sunrise rule, Purnimanta months for the north ' +
      'Indian convention, and Lahiri ayanamsa. Times are computed for the place you select on the ' +
      'Kundli screen \u2014 which matters, because sunrise differs by up to forty minutes across ' +
      'India, and that can move a tithi boundary across a sunrise.</p></div>';
  }

  function attach() {
    var sec = el('panchang');
    if (!sec) return;
    var host = el('whyhost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'whyhost';
      sec.appendChild(host);
    }
    if (!host.innerHTML.trim()) render();
  }

  function boot() {
    var tries = 0;
    var iv = setInterval(function () {
      if (el('panchang')) { attach(); clearInterval(iv); }
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
