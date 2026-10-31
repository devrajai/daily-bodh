/* Daily Bodh — subscribe to the festival calendar.
 *
 * The .ics files are generated from docs/data/festivals.json by
 * .github/workflows/build-calendars.yml and refreshed weekly. This puts the
 * subscribe links where a visitor will find them.
 *
 * Appends to the Panchang tab.
 *   <script src="calendar-links.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }

  function render() {
    var host = el('calhost');
    if (!host) return;

    host.innerHTML =
      '<div class="card"><h3>Festival calendar you can subscribe to</h3>' +
      '<p>Add the Hindu festival dates to your own calendar once, and they update themselves. ' +
      'The file is generated from the same festival data this site uses, covers ' +
      '2026 to 2031, and is refreshed every week.</p>' +
      '<table>' +
      '<tr><td class="k" style="width:44%">All entries</td>' +
      '<td><a href="calendar/festivals.ics">festivals.ics</a> <span class="muted">' +
      '900 dates, festivals and observances</span></td></tr>' +
      '<tr><td class="k">Festivals only</td>' +
      '<td><a href="calendar/festivals-only.ics">festivals-only.ics</a> <span class="muted">' +
      '661 entries, without national days</span></td></tr>' +
      '</table>' +
      '<h4 style="margin-top:14px">How to add it</h4>' +
      '<p class="muted" style="font-size:13px"><strong>Google Calendar:</strong> open ' +
      'calendar.google.com &rarr; Other calendars &rarr; <em>+</em> &rarr; From URL &rarr; paste the ' +
      'link to the .ics file.<br>' +
      '<strong>iPhone:</strong> Settings &rarr; Calendar &rarr; Accounts &rarr; Add Account &rarr; ' +
      'Other &rarr; Add Subscribed Calendar &rarr; paste the link.<br>' +
      '<strong>Outlook:</strong> Calendar &rarr; Add calendar &rarr; Subscribe from web &rarr; ' +
      'paste the link.</p>' +
      '<div class="warn">These are the dates the site computes and bundles, at Delhi. Festival dates ' +
      'can shift by a day between regions and between almanacs \u2014 where your family or temple ' +
      'follows a different reckoning, follow theirs. The calendar is a convenience, not an authority.</div>' +
      '</div>';
  }

  function attach() {
    var sec = el('panchang');
    if (!sec) return;
    var host = el('calhost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'calhost';
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
