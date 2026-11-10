/* Daily Bodh — mount guard.
 *
 * WHY THIS EXISTS
 *
 * The page builds each tab lazily: renderNumerology(), renderKundli() and the
 * rest do `section.innerHTML = "..."` the first time you open them. Any add-on
 * that appended a card before that moment is wiped, and an add-on that only
 * polls for a few seconds at load never comes back. The screen looks like the
 * feature does not exist.
 *
 * This watches every section. When a module's card disappears, it re-loads that
 * module's script, which re-runs it and re-appends the card.
 *
 * TWO BUGS THIS FIXES
 *
 * 1. The list had drifted badly. The loader carried 34 modules while this
 *    watched 13, so twenty-one add-ons were unprotected and vanished the first
 *    time their tab rendered. That is why features "were not there".
 *
 * 2. choghadiya.js creates #choghost, but this file was watching
 *    #choghadiyahost, a div that does not exist. It could never remount it.
 *
 * KEEP THIS LIST IN STEP WITH loader.js. Every module that creates a host div
 * needs an entry here, with the section it lives in and the exact id it uses.
 *
 *   <script src="mount-guard.js"></script>   (load this LAST)
 */
(function () {
  'use strict';

  /* file -> { section it appends into, element id it creates }
     The Today section has no id in the markup, so myprofile.js cannot be
     watched here — it falls back to the first <section> itself. */
  var WATCH = [
    /* --- Panchang --- */
    { section: 'panchang',   file: 'choghadiya.js',           host: 'choghost' },
    { section: 'panchang',   file: 'live-panchang.js',        host: 'livepanchang' },
    { section: 'panchang',   file: 'calendar-links.js',       host: 'calhost' },

    /* --- Horoscope --- */
    { section: 'horoscope',  file: 'weekly.js',               host: 'weeklyhost' },

    /* --- Kundli --- */
    { section: 'kundli',     file: 'sadesati.js',             host: 'sshost' },
    { section: 'kundli',     file: 'dasha.js',                host: 'dashahost' },
    { section: 'kundli',     file: 'house-system.js',         host: 'househost' },
    { section: 'kundli',     file: 'houses.js',               host: 'houseshost' },
    { section: 'kundli',     file: 'kp-astrology.js',         host: 'kphost' },

    /* --- Matching --- */
    { section: 'match',      file: 'rajju.js',                host: 'rajjuhost' },
    { section: 'match',      file: 'zodiac-compatibility.js', host: 'zodhost' },

    /* --- Numerology --- */
    { section: 'numerology', file: 'numerology-report.js',    host: 'reporthost' },
    { section: 'numerology', file: 'numerology-kit.js',       host: 'kithost' },
    { section: 'numerology', file: 'cycles.js',               host: 'cycleshost' },
    { section: 'numerology', file: 'number-compatibility.js', host: 'comphost' },
    { section: 'numerology', file: 'numerology-classical.js', host: 'classichost' },
    { section: 'numerology', file: 'numerology-lenses.js',    host: 'lenshost' },
    { section: 'numerology', file: 'numbers-check.js',        host: 'numcheckhost' },

    /* --- Shastra --- */
    { section: 'shastra',    file: 'sacred.js',               host: 'sacredhost' },
    { section: 'shastra',    file: 'forms.js',                host: 'formshost' },
    { section: 'shastra',    file: 'scriptures.js',           host: 'scripturehost' },
    { section: 'shastra',    file: 'vedas.js',                host: 'vedashost' },
    { section: 'shastra',    file: 'kamasutra.js',            host: 'kamsutrahost' },

    /* --- Jyotish --- */
    { section: 'jyotish',    file: 'market-astrology.js',     host: 'markethost' },

    /* --- Ayurveda --- */
    { section: 'ayurveda',   file: 'ayurveda.js',             host: 'ayurhost' },
    { section: 'ayurveda',   file: 'garbha.js',               host: 'garbhahost' },

    /* --- Chakras --- */
    { section: 'chakras',    file: 'chakras.js',              host: 'chakrashost' },
    { section: 'chakras',    file: 'meditation.js',           host: 'medhost' },

    /* --- About --- */
    { section: 'about',      file: 'about-calc.js',           host: 'calchost' }
  ];

  var reloading = {};

  function remount(entry) {
    var sec = document.getElementById(entry.section);
    if (!sec) return;
    if (document.getElementById(entry.host)) return;   // already mounted
    if (!sec.innerHTML.trim()) return;                  // tab has not rendered yet
    if (reloading[entry.file]) return;

    reloading[entry.file] = true;
    var s = document.createElement('script');
    s.src = entry.file + '?r=' + Date.now();            // cache-bust so it re-executes
    s.async = false;
    s.onload = function () { reloading[entry.file] = false; };
    s.onerror = function () { reloading[entry.file] = false; };
    document.body.appendChild(s);
  }

  function checkAll() { WATCH.forEach(remount); }

  function boot() {
    var sections = {};
    WATCH.forEach(function (e) { sections[e.section] = true; });

    Object.keys(sections).forEach(function (id) {
      var sec = document.getElementById(id);
      if (!sec) return;
      var mo = new MutationObserver(function () { setTimeout(checkAll, 0); });
      mo.observe(sec, { childList: true });
    });

    window.addEventListener('hashchange', function () {
      setTimeout(checkAll, 120);
      setTimeout(checkAll, 600);
    });

    setTimeout(checkAll, 400);
    [1200, 2500, 4000, 7000].forEach(function (t) { setTimeout(checkAll, t); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
