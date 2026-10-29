/* Daily Bodh — module loader.
 *
 * One script tag for every add-on, instead of one per module.
 *
 * PLACE THIS AT THE END OF <body>, after the main inline <script>:
 *
 *     ... </script>
 *     <script src="loader.js"></script>
 *   </body>
 *
 * Order matters and this is why. The main page declares `const TABS` in its
 * inline script. A classic <script> that runs BEFORE that one sees
 * `typeof TABS === "undefined"` - no error, just undefined - so every module
 * that checks `if (typeof TABS !== 'undefined')` quietly skips registering its
 * tab. The screen gets built but no drawer entry appears, which looks like the
 * feature is missing. Loading after the inline script avoids this entirely.
 *
 * If a module is missing, it is skipped and the rest still load.
 */
(function () {
  'use strict';

  var MODULES = [
    'home.js',        // Today landing page (registers itself first)
    'ask.js',         // Ask screen
    'choghadiya.js',  // Choghadiya, Hora, Panchak on the Panchang tab
    'rajju.js',       // Rajju and Vedha on the Matching screen
    'vastu.js',       // Vastu reference tab
    'weekly.js'       // This week's reading on the Horoscope tab
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

    // Sequential, so a module that registers itself first (home.js) keeps its place.
    var p = Promise.resolve();
    MODULES.forEach(function (m) {
      p = p.then(function () { return loadOne(m); });
    });
    p.then(function () {
      var loaded = MODULES.filter(function (m) {
        // a module that loaded has either created its section or added its tab
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
