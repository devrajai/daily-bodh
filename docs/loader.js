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
 *  2. Modules append their cards in load order, so load order is visual order.
 *     The richest numerology card (the full guide, which carries money, health,
 *     remedies and mantra) loads first so it sits at the top of the tab instead
 *     of below the thinner ones.
 *
 * mulank.js is deliberately NOT loaded: the full guide supersedes it and
 * showing both put a shorter card above a longer one.
 *
 * mount-guard.js must be LAST: it re-mounts any module whose card was wiped by
 * a tab renderer doing section.innerHTML = "...".
 */
(function () {
  'use strict';

  var MODULES = [
    'home.js',                 // Today landing page (registers itself first)
    'ask.js',                  // Ask screen
    'choghadiya.js',           // Choghadiya, Hora, Panchak on the Panchang tab
    'rajju.js',                // Rajju and Vedha on the Matching screen
    'vastu.js',                // Vastu reference tab
    'weekly.js',               // This week's reading on the Horoscope tab
    'timezone.js',             // Historical Indian UTC offset on the Kundli screen
    'numerology-kit.js',       // FIRST on the tab: the full guide (richest card)
    'cycles.js',               // Personal year, month, day and the week ahead
    'numbers-check.js',        // Mobile / vehicle / house number checker
    'numerology-classical.js', // Exaltation, odd/even, the friendly-enemy paradox
    'mount-guard.js'           // LAST: re-mounts anything a tab render wiped
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
    // By the time this file runs the page has declared TABS. Say so plainly if not,
    // because the symptom (no tabs appearing) is otherwise baffling.
    var haveTabs = false;
    try { haveTabs = (typeof TABS !== 'undefined' && Array.isArray(TABS)); } catch (e) { haveTabs = false; }
    if (!haveTabs) {
      console.warn('[Daily Bodh] loader.js ran before the page defined TABS. ' +
        'Move the <script src="loader.js"> tag to the end of <body>, after the main ' +
        'inline script, or the add-on tabs will not register.');
    }

    // Sequential, so the visual order of the cards is predictable.
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
