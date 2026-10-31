/* Daily Bodh — module loader.
 *
 * One script tag for every add-on, instead of one per module.
 *
 * The tag is installed at the end of <body> by .github/workflows/install-loader.yml,
 * because docs/index.html is too large to edit by hand reliably.
 *
 * Order matters, twice over:
 *
 *  1. The main page declares `const TABS` in its inline script. A classic
 *     <script> that runs BEFORE that one sees `typeof TABS === "undefined"` -
 *     no error, just undefined - so every module that checks
 *     `if (typeof TABS !== 'undefined')` quietly skips registering its tab.
 *     Loading after the inline script avoids this entirely.
 *
 *  2. Modules append their cards in load order, so load order IS visual order.
 *
 * mount-guard.js must be the very LAST entry: it re-mounts any module whose
 * card was wiped by a tab renderer doing section.innerHTML = "...".
 *
 * Not loaded on purpose:
 *   numerology-advanced.js  - renderers need repairing first
 *   numerology-sources.js   - the sources card was removed from the tab
 *   mulank.js               - superseded by the fuller 1-9 guide
 */
(function () {
  'use strict';

  var MODULES = [
    'home.js',                  // Today landing page (registers itself first)
    'ask.js',                   // Ask screen
    'choghadiya.js',            // Choghadiya, Hora, Panchak on the Panchang tab
    'live-panchang.js',         // Panchang times for the chosen place, not Delhi
    'rajju.js',                 // Rajju and Vedha on the Matching screen
    'vastu.js',                 // Vastu reference tab
    'chakras.js',               // Chakras, kundalini, reiki, crystals (own tab)
    'meditation.js',            // Meditation timer and methods (Chakras tab)
    'weekly.js',                // This week's reading on the Horoscope tab
    'timezone.js',              // Historical Indian UTC offset on the Kundli screen
    'sadesati.js',              // Kundli tab: Sade Sati phase and windows
    'house-system.js',          // Kundli tab: which house system, and why
    'houses.js',                // Kundli tab: the twelve houses explained
    'kp-astrology.js',          // Kundli tab: KP, and how it differs

    /* --- Numerology tab, in display order --- */
    'numerology-report.js',     // 1. full report (uses the page's own form)
    'numerology-kit.js',        // 2. the 1-9 guide
    'cycles.js',                // 3. personal year, month, day
    'number-compatibility.js',  // 4. compare two numbers
    'numerology-classical.js',  // 5. exaltation, odd/even, the paradox
    'numerology-lenses.js',     // 6. Cheiro beside Bullinger
    'numbers-check.js',         // 7. LAST: check a mobile / vehicle / house number

    'mount-guard.js'            // Very last: re-mounts anything a tab render wiped
  ];

  function loadOne(src) {
    return new Promise(function (resolve) {
      var s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = function () { resolve({ src: src, ok: true }); };
      s.onerror = function () { resolve({ src: src, ok: false }); };
      document.body.appendChild(s);
    });
  }

  function run() {
    var haveTabs = false;
    try { haveTabs = (typeof TABS !== 'undefined' && Array.isArray(TABS)); } catch (e) { haveTabs = false; }
    if (!haveTabs) {
      console.warn('[Daily Bodh] loader.js ran before the page defined TABS. ' +
        'Move the <script src="loader.js"> tag to the end of <body>, after the main ' +
        'inline script, or the add-on tabs will not register.');
    }

    var p = Promise.resolve();
    MODULES.forEach(function (m) {
      p = p.then(function () { return loadOne(m); });
    });
    p.then(function () {
      var loaded = MODULES.filter(function (m) {
        var id = m.replace('.js', '');
        return !!document.getElementById(id);
      });
      if (loaded.length) {
        console.info('[Daily Bodh] add-ons loaded: ' + loaded.join(', '));
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
