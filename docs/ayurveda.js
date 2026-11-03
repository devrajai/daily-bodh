/* Daily Bodh — Ayurveda, described.
 *
 * The classical framework: the three doshas, the six tastes, the daily and
 * seasonal routines, and the texts they come from. This is a description of a
 * tradition, not a prescription service.
 *
 * It carries the safety facts that matter — heavy-metal contamination in some
 * classical preparations, and herb-drug interactions — because a page that lists
 * remedies without them is only telling half the story.
 *
 *   <script src="ayurveda.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  var DOSHAS = [
    { name: 'Vata', sk: '\u0935\u093e\u0924', elements: 'Air + ether',
      qualities: 'Dry, light, cold, rough, mobile, subtle',
      governs: 'All movement \u2014 breath, circulation, nerve impulses, the passage of food, speech and thought.',
      excess: 'Anxiety, insomnia, dry skin, constipation, gas, joint cracking, feeling ungrounded.',
      reduce: 'Warm, oily, heavy, regular food; routine; warmth; oil massage. Avoid skipping meals and late nights.' },
    { name: 'Pitta', sk: '\u092a\u093f\u0924\u094d\u0924', elements: 'Fire + water',
      qualities: 'Hot, sharp, light, liquid, spreading',
      governs: 'Transformation \u2014 digestion, metabolism, body temperature, the processing of food and experience.',
      excess: 'Irritability, acidity, heartburn, inflammation, skin rashes, loose stools, feeling overheated.',
      reduce: 'Cool, mild, non-spicy food; avoiding alcohol and excess caffeine; not working through lunch; moonlight rather than midday sun.' },
    { name: 'Kapha', sk: '\u0915\u092b', elements: 'Water + earth',
      qualities: 'Heavy, slow, cold, oily, smooth, dense, static',
      governs: 'Structure and lubrication \u2014 tissue, joint fluid, mucus membranes, immunity, stamina.',
      excess: 'Lethargy, weight gain, congestion, sluggish digestion, heaviness, oversleeping, attachment.',
      reduce: 'Light, warm, dry, spiced food; movement; early rising; stimulation. Avoid daytime sleeping and heavy dairy.' }
  ];

  var TASTES = [
    { taste: 'Sweet', sk: 'Madhura', elements: 'Earth + water', effect: 'Builds tissue. Calms Vata and Pitta; increases Kapha.' },
    { taste: 'Sour', sk: 'Amla', elements: 'Earth + fire', effect: 'Stimulates digestion. Calms Vata; increases Pitta and Kapha.' },
    { taste: 'Salty', sk: 'Lavana', elements: 'Water + fire', effect: 'Retains water, softens tissue. Calms Vata; increases Pitta and Kapha.' },
    { taste: 'Pungent', sk: 'Katu', elements: 'Fire + air', effect: 'Burns and dries. Increases Vata and Pitta; reduces Kapha.' },
    { taste: 'Bitter', sk: 'Tikta', elements: 'Air + ether', effect: 'Dries and clears. Increases Vata; reduces Pitta and Kapha.' },
    { taste: 'Astringent', sk: 'Kashaya', elements: 'Air + earth', effect: 'Contracts and binds. Increases Vata; reduces Pitta and Kapha.' }
  ];

  var TEXTS = [
    { name: 'Charaka Samhita', subject: 'Internal medicine', note: 'The core text on diagnosis and treatment. Attributed to Charaka, redacted by Dridhabala, roughly the 2nd century CE.' },
    { name: 'Sushruta Samhita', subject: 'Surgery', note: 'The oldest surgical text in the world, describing procedures and instruments. Dates are debated, between several centuries BCE and the 2nd century CE.' },
    { name: 'Ashtanga Hridaya', subject: 'Summary of all eight branches', note: 'By Vagbhata, around the 7th century. The text most Ayurvedic students still learn from first.' },
    { name: 'Madhava Nidana', subject: 'Diagnosis', note: 'A later text devoted entirely to how to identify a condition from its signs.' },
    { name: 'Sharangadhara Samhita', subject: 'Pharmacy', note: 'Preparations, doses and the making of medicines.' }
  ];

  var ROUTINE = [
    { step: 'Rise before sunrise', note: 'The classical dinacharya begins in the brahma muhurta, roughly 96 minutes before dawn. The claim is that the mind is clearest then.' },
    { step: 'Clean the mouth', note: 'Teeth, then the tongue scraped from back to front \u2014 the tradition reads the coating as a sign of how digestion is doing.' },
    { step: 'Oil the body', note: 'Abhyanga: warm sesame or coconut oil worked into the skin before bathing. Low risk, and the one classical practice with a plausible mechanical benefit.' },
    { step: 'Move', note: 'Vyayama \u2014 exercise to about half your capacity. The classical instruction is to stop while you can still breathe through the nose comfortably.' },
    { step: 'Eat at fixed times', note: 'The largest meal at midday, when digestion is held to be strongest. Not eating between meals is part of the method, not an afterthought.' },
    { step: 'Sleep early', note: 'Before about 10pm, and not through the morning. The tradition treats daytime sleeping as a cause of imbalance.' }
  ];

  function render() {
    var host = el('ayurhost');
    if (!host) return;

    host.innerHTML =
      '<div class="card"><h3>Ayurveda, described</h3>' +
      '<p>Ayurveda is a real medical tradition with a continuous textual history going back more than two ' +
      'thousand years. This page describes it as a system. It does not diagnose you, and it does not ' +
      'prescribe for any condition.</p>' +
      '<div class="warn"><strong>Please read this before anything else.</strong> Ayurveda is not a ' +
      'substitute for medical treatment. Some classical preparations have been found to contain lead, ' +
      'mercury and arsenic; several herbs interact seriously with prescription medicines. If you take ' +
      'medication, are pregnant, or are unwell, talk to a doctor before starting anything on this page. ' +
      'Do not stop prescribed treatment because of what you read here.</div></div>' +

      '<div class="card"><h3>The three doshas</h3>' +
      '<p class="muted">Ayurveda groups bodily function into three tendencies. Everyone has all three; ' +
      'the proportions differ, and the tradition reads ill-health as one of them having drifted out of ' +
      'balance. It is a model of tendencies, not three types of person.</p>' +
      DOSHAS.map(function (d) {
        return '<div style="padding:11px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:14.5px;color:var(--accent)">' + esc(d.name) +
          ' <span class="muted" style="font-weight:400">' + esc(d.sk) + '</span></strong>' +
          '<span class="muted" style="font-size:12.5px"> \u2014 ' + esc(d.elements) + '</span>' +
          '<div class="muted" style="font-size:12.5px;margin-top:3px">' + esc(d.qualities) + '</div>' +
          '<div style="margin-top:5px;font-size:13.5px"><strong>Governs:</strong> ' + esc(d.governs) + '</div>' +
          '<div style="margin-top:4px;font-size:13.5px"><strong>When excess:</strong> ' + esc(d.excess) + '</div>' +
          '<div class="muted" style="margin-top:4px;font-size:12.5px"><strong>Traditionally reduced by:</strong> ' +
          esc(d.reduce) + '</div></div>';
      }).join('') + '</div>' +

      '<div class="card"><h3>The six tastes</h3>' +
      '<p class="muted">The classical idea is that a meal should carry all six, and that the balance of ' +
      'them is what acts on the doshas \u2014 not calories or macros.</p>' +
      '<table><tr><td class="k" style="width:22%">Taste</td><td class="k" style="width:16%">Sanskrit</td>' +
      '<td class="k" style="width:20%">Elements</td><td class="k">Effect</td></tr>' +
      TASTES.map(function (t) {
        return '<tr><td><strong style="font-size:13px">' + esc(t.taste) + '</strong></td>' +
          '<td class="muted" style="font-size:12.5px">' + esc(t.sk) + '</td>' +
          '<td class="muted" style="font-size:12.5px">' + esc(t.elements) + '</td>' +
          '<td style="font-size:12.5px">' + esc(t.effect) + '</td></tr>';
      }).join('') + '</table></div>' +

      '<div class="card"><h3>Dinacharya \u2014 the daily routine</h3>' +
      '<p class="muted">The part of Ayurveda with the least to lose from following it. None of this ' +
      'is dramatic, and most of it is what any doctor would also suggest.</p>' +
      ROUTINE.map(function (r) {
        return '<div style="padding:8px 0;border-bottom:1px solid #f2f0f6">' +
          '<strong style="font-size:13.5px">' + esc(r.step) + '</strong><br>' +
          '<span class="muted" style="font-size:12.5px">' + esc(r.note) + '</span></div>';
      }).join('') + '</div>' +

      '<div class="card"><h3>The classical texts</h3>' +
      TEXTS.map(function (t) {
        return '<div style="padding:9px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:13.5px">' + esc(t.name) + '</strong>' +
          '<span class="muted" style="font-size:12.5px"> \u2014 ' + esc(t.subject) + '</span>' +
          '<div class="muted" style="font-size:12.5px;margin-top:3px">' + esc(t.note) + '</div></div>';
      }).join('') + '</div>' +

      '<div class="card"><h3>What the evidence says, honestly</h3>' +
      '<p>Some Ayurvedic practices are supported by ordinary reasoning rather than trial evidence \u2014 ' +
      'eating at regular times, sleeping adequately, moving daily. Those are unglamorous and they work.</p>' +
      '<p><strong>Two things are genuinely worth knowing:</strong></p>' +
      '<p>First, <strong>heavy metals</strong>. Analyses of imported Ayurvedic products have repeatedly ' +
      'found detectable lead, mercury or arsenic in a proportion of them, particularly in rasa shastra ' +
      'preparations that use metal ingredients deliberately. This is not a rare anecdote; it has been ' +
      'published in mainstream medical journals.</p>' +
      '<p>Second, <strong>interactions</strong>. Several common Ayurvedic herbs affect how prescription ' +
      'medicines are metabolised, and some are unsafe in pregnancy or with thyroid, blood-thinning or ' +
      'diabetes medication. "Natural" is not a safety category.</p>' +
      '<div class="warn">If you want to try something from this tradition, tell your doctor what you are ' +
      'taking \u2014 including herbs you bought yourself. That single sentence prevents most of the harm ' +
      'this page could otherwise cause.</div></div>';
  }

  function section() {
    var s = el('ayurveda');
    if (s) return s;
    s = document.createElement('section');
    s.id = 'ayurveda';
    var main = document.querySelector('main') || document.body;
    main.appendChild(s);
    return s;
  }

  function attach() {
    var sec = section();
    var host = el('ayurhost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'ayurhost';
      sec.appendChild(host);
    }
    if (!host.innerHTML.trim()) render();
  }

  function register() {
    try {
      if (typeof TABS === 'undefined' || !Array.isArray(TABS)) return;
      if (TABS.some(function (t) { return t[0] === 'ayurveda'; })) return;
      TABS.push(['ayurveda', 'Ayurveda', function () { render(); }]);
      var bar = document.getElementById('tabs');
      if (bar) {
        bar.innerHTML = TABS.map(function (t) {
          return '<button data-t="' + t[0] + '" aria-selected="false">' + t[1] + '</button>';
        }).join('');
        Array.prototype.forEach.call(bar.querySelectorAll('[data-t]'), function (b) {
          b.onclick = function () {
            if (typeof show === 'function') show(b.dataset.t);
            else location.hash = b.dataset.t;
          };
        });
      }
    } catch (e) { /* reachable by hash regardless */ }
  }

  function boot() {
    attach();
    register();
    var tries = 0;
    var iv = setInterval(function () {
      attach();
      if (el('ayurhost') && el('ayurhost').innerHTML.trim()) clearInterval(iv);
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
