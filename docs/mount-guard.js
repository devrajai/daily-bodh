/* Daily Bodh — mount guard.
 *
 * WHY THIS EXISTS
 *
 * The page builds each tab lazily: renderNumerology(), renderPanchang() and the
 * rest do `section.innerHTML = "..."` the first time you open them. Any add-on
 * that appended a card before that moment gets wiped, and because the add-ons
 * only polled for a few seconds at load they never came back. The screen looked
 * like the feature did not exist.
 *
 * This watches every section. When a module's card disappears, it re-loads that
 * module's script, which re-runs it and re-appends the card. Cheap, and it works
 * for every add-on without changing any of them.
 *
 * KEEP THIS LIST IN STEP WITH loader.js. Anything watched here gets re-injected
 * whether or not the loader loads it - which is how the retired mulank card kept
 * reappearing after the fuller guide had replaced it.
 *
 *   <script src="mount-guard.js"></script>   (load this LAST)
 */
(function () {
  'use strict';

  /* module script -> the element id it creates inside its section */
  var WATCH = [
    { section: 'panchang',   file: 'choghadiya.js',           host: 'choghadiyahost' },
    { section: 'horoscope',  file: 'weekly.js',               host: 'weeklyhost' },
    { section: 'kundli',     file: 'house-system.js',         host: 'househost' },
    { section: 'kundli',     file: 'houses.js',               host: 'houseshost' },
    { section: 'kundli',     file: 'kp-astrology.js',         host: 'kphost' },
    { section: 'numerology', file: 'numerology-report.js',    host: 'reporthost' },
    { section: 'numerology', file: 'numerology-kit.js',       host: 'kithost' },
    { section: 'numerology', file: 'cycles.js',               host: 'cycleshost' },
    { section: 'numerology', file: 'numbers-check.js',        host: 'numcheckhost' },
    { section: 'numerology', file: 'number-compatibility.js', host: 'comphost' },
    { section: 'numerology', file: 'zodiac-compatibility.js', host: 'zodhost' },
    { section: 'numerology', file: 'numerology-classical.js', host: 'classichost' },
    { section: 'numerology', file: 'numerology-lenses.js',    host: 'lenshost' }
  ];

  var reloading = {};    // file -> true while a reload is in flight

  function remount(entry) {
    var sec = document.getElementById(entry.section);
    if (!sec) return;
    // If the module's host is present, it is mounted - nothing to do.
    if (document.getElementById(entry.host)) return;
    // Only act if the section actually has content (i.e. the tab has rendered).
    if (!sec.innerHTML.trim()) return;
    if (reloading[entry.file]) return;

    reloading[entry.file] = true;
    var s = document.createElement('script');
    s.src = entry.file + '?r=' + Date.now();   // cache-bust so it re-executes
    s.async = false;
    s.onload = function () { reloading[entry.file] = false; };
    s.onerror = function () { reloading[entry.file] = false; };
    document.body.appendChild(s);
  }

  function checkAll() {
    WATCH.forEach(remount);
  }

  function boot() {
    var sections = {};
    WATCH.forEach(function (e) { sections[e.section] = true; });

    Object.keys(sections).forEach(function (id) {
      var sec = document.getElementById(id);
      if (!sec) return;
      // Watch for the tab renderer replacing the section's contents.
      var mo = new MutationObserver(function () {
        // one tick, so the renderer has finished writing
        setTimeout(checkAll, 0);
      });
      mo.observe(sec, { childList: true });
    });

    // Opening a tab can render it later than the observer fires; re-check then.
    window.addEventListener('hashchange', function () {
      setTimeout(checkAll, 120);
      setTimeout(checkAll, 600);
    });

    // A first pass shortly after load, then a few spaced retries for slow data.
    setTimeout(checkAll, 400);
    [1200, 2500, 4000].forEach(function (t) { setTimeout(checkAll, t); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
