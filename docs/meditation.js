/* Daily Bodh — meditation.
 *
 * Two halves: a plain timer you can actually use, and descriptions of the
 * methods the Indian tradition names. The timer runs in the browser, needs no
 * account and no network, and stores nothing.
 *
 * Appends to the Chakras tab.
 *   <script src="meditation.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  var METHODS = [
    { name: 'Dhyana', sk: '\u0927\u094d\u092f\u093e\u0928', origin: 'Classical (Upanishads, Yoga Sutra)',
      how: 'Sustained attention on a single object — the breath, a mantra, a point of light, or an image. The Yoga Sutra treats it as the seventh limb, following dharana (concentration) and leading to samadhi.',
      good: 'The default. If you do not know what to practise, start here.' },
    { name: 'Mantra japa', sk: '\u091c\u092a', origin: 'Classical',
      how: 'Repetition of a syllable or phrase, aloud or silently. The tradition distinguishes vaikhari (audible), upamsu (whispered) and manasika (mental) repetition.',
      good: 'Gives the restless mind a job. Useful when sitting quietly feels impossible.' },
    { name: 'Trataka', sk: '\u0924\u094d\u0930\u093e\u091f\u0915', origin: 'Classical (Hatha Yoga texts)',
      how: 'Steady gazing at a single point — usually a candle flame — without blinking, then closing the eyes and holding the after-image.',
      good: 'Sharpens attention quickly. Skip it if you have eye problems, and do not strain.' },
    { name: 'Yoga nidra', sk: '\u092f\u094b\u0917 \u0928\u093f\u0926\u094d\u0930\u093e', origin: 'Modern systematisation of an older practice',
      how: 'Guided lying-down practice, moving attention systematically through the body while staying awake. Usually 20 to 40 minutes with a recording.',
      good: 'Rest without sleep. Helpful when you are too tired to sit.' },
    { name: 'Vipassana', sk: '\u0935\u093f\u092a\u0936\u094d\u092f\u0928\u093e', origin: 'Buddhist (Theravada)',
      how: 'Observation of sensation as it arises, without reaction. Traditionally taught on a ten-day residential course, not from a page.',
      good: 'Builds insight into how reaction works. Better learned from a teacher.' },
    { name: 'Ajapa japa', sk: '\u0905\u091c\u092a\u093e \u091c\u092a', origin: 'Classical (Hatha)',
      how: 'Following the breath and its natural sound — "hamsa", said to repeat itself without effort. The name means repetition that is not done.',
      good: 'For people who find deliberate counting too effortful.' },
    { name: 'Walking meditation', sk: '\u2014', origin: 'Buddhist; used across traditions',
      how: 'Slow walking with attention on the sensation of the feet and the breath. Usually paced to a short indoor circuit.',
      good: 'When sitting is painful or restlessness is too strong.' }
  ];

  var timer = { id: null, left: 0, total: 0 };

  function fmt(s) {
    var m = Math.floor(s / 60), r = s % 60;
    return m + ':' + (r < 10 ? '0' : '') + r;
  }

  function tick() {
    timer.left -= 1;
    var disp = el('medtime');
    if (disp) disp.textContent = fmt(Math.max(0, timer.left));
    if (timer.left <= 0) {
      stop();
      var d = el('medtime');
      if (d) d.textContent = 'Done';
      try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = 528; g.gain.value = 0.08;
        o.start(); o.stop(ctx.currentTime + 1.2);
      } catch (e) { /* no sound available; the text says Done */ }
    }
  }

  function stop() {
    if (timer.id) { clearInterval(timer.id); timer.id = null; }
  }

  function start(mins) {
    stop();
    timer.total = mins * 60;
    timer.left = timer.total;
    var disp = el('medtime');
    if (disp) disp.textContent = fmt(timer.left);
    timer.id = setInterval(tick, 1000);
  }

  function render() {
    var host = el('medhost');
    if (!host) return;

    host.innerHTML =
      '<div class="card"><h3>Meditation timer</h3>' +
      '<p class="muted">Runs entirely in your browser. No account, no network, nothing stored. ' +
      'It will keep counting while this tab is open.</p>' +
      '<div id="medtime" style="font-size:44px;font-weight:700;color:var(--accent);' +
      'text-align:center;margin:10px 0;font-variant-numeric:tabular-nums">0:00</div>' +
      '<div class="chips" id="medchips">' +
      [5, 10, 15, 20, 30, 45].map(function (m) {
        return '<button class="chip" data-m="' + m + '">' + m + ' min</button>';
      }).join('') + '</div>' +
      '<div style="display:flex;gap:8px;margin-top:10px">' +
      '<button class="chip" id="medstop">Stop</button></div>' +
      '<p class="muted" style="margin-top:10px;font-size:12.5px">A single soft tone plays at the end. ' +
      'If your browser blocks sound, the timer still shows Done.</p></div>' +

      '<div class="card"><h3>Methods the tradition names</h3>' +
      '<p class="muted">Different practices, different aims. None of them requires a subscription.</p>' +
      METHODS.map(function (m) {
        return '<div style="padding:11px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:14.5px">' + esc(m.name) +
          ' <span class="muted" style="font-weight:400">' + esc(m.sk) + '</span></strong><br>' +
          '<span class="muted" style="font-size:12px">' + esc(m.origin) + '</span>' +
          '<div style="margin-top:5px">' + esc(m.how) + '</div>' +
          '<div class="muted" style="margin-top:4px;font-size:12.5px"><strong>Good for:</strong> ' +
          esc(m.good) + '</div></div>';
      }).join('') + '</div>' +

      '<div class="card"><h3>How to start, plainly</h3>' +
      '<p>Sit upright somewhere you will not be interrupted. Set a timer shorter than you think you ' +
      'need — five minutes is enough at first. Put your attention on the breath at the nostrils, and ' +
      'when you notice it has wandered, bring it back. That returning <em>is</em> the practice; the ' +
      'wandering is not failure.</p>' +
      '<p class="muted">Do it at the same time daily for two weeks before deciding whether it suits ' +
      'you. Most people quit in the first week because they expect the mind to be quiet, and it is not.</p>' +
      '<div class="warn">Meditation is not a treatment for a mental-health condition, and intensive ' +
      'practice can occasionally unsettle people who are already struggling. If you have anxiety, ' +
      'trauma or dissociation, talk to a professional before taking up long sits — and stop if it ' +
      'makes things worse rather than better.</div></div>';
  }

  function wire() {
    var chips = el('medchips');
    if (chips) {
      Array.prototype.forEach.call(chips.querySelectorAll('[data-m]'), function (b) {
        b.onclick = function () { start(+b.dataset.m); };
      });
    }
    var s = el('medstop');
    if (s) s.onclick = function () {
      stop();
      var d = el('medtime');
      if (d) d.textContent = '0:00';
    };
  }

  function attach() {
    var sec = el('chakras');
    if (!sec) return;
    var host = el('medhost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'medhost';
      sec.appendChild(host);
    }
    if (!host.innerHTML.trim()) { render(); wire(); }
  }

  function boot() {
    var tries = 0;
    var iv = setInterval(function () {
      attach();
      if (el('medhost') && el('medhost').innerHTML.trim()) clearInterval(iv);
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
