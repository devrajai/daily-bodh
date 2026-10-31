/* Daily Bodh — chakras, kundalini, reiki, crystals.
 *
 * The seven chakras and kundalini are classical tantric frameworks with real
 * textual history, and are described here as such. Reiki is a 20th-century
 * Japanese practice and is labelled that way. Crystal correspondences are given
 * as the tradition records them, with an explicit note that no evidence supports
 * any healing claim.
 *
 * Creates its own tab if it can reach TABS; otherwise the section still exists
 * and is reachable by hash, so it never silently vanishes.
 *
 *   <script src="chakras.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  var CHAKRAS = [
    { n: 1, sk: 'Muladhara', name: 'Root', place: 'Base of the spine',
      colour: 'Red', element: 'Earth', mantra: 'LAM', sense: 'Smell',
      governs: 'Survival, safety, grounding, the body\u2019s sense of having a place to stand.',
      note: 'The tradition places the coiled kundalini here, asleep, at the base.' },
    { n: 2, sk: 'Svadhisthana', name: 'Sacral', place: 'Lower abdomen, below the navel',
      colour: 'Orange', element: 'Water', mantra: 'VAM', sense: 'Taste',
      governs: 'Pleasure, desire, creativity, reproduction, and the flow of feeling.',
      note: 'The water element is why this centre is associated with movement and fluidity rather than fixity.' },
    { n: 3, sk: 'Manipura', name: 'Solar plexus', place: 'Upper abdomen, at the navel',
      colour: 'Yellow', element: 'Fire', mantra: 'RAM', sense: 'Sight',
      governs: 'Will, confidence, digestion, personal power and the capacity to act.',
      note: 'Fire here is not anger \u2014 it is the heat of transformation and of digesting experience.' },
    { n: 4, sk: 'Anahata', name: 'Heart', place: 'Centre of the chest',
      colour: 'Green', element: 'Air', mantra: 'YAM', sense: 'Touch',
      governs: 'Love, compassion, connection, and the meeting point of the lower and upper centres.',
      note: '"Anahata" means unstruck \u2014 the sound that is not made by two things hitting.' },
    { n: 5, sk: 'Vishuddha', name: 'Throat', place: 'Base of the throat',
      colour: 'Blue', element: 'Ether', mantra: 'HAM', sense: 'Hearing',
      governs: 'Speech, expression, truthfulness, and the ability to be heard.',
      note: 'The element is akasha, space \u2014 the medium in which sound exists.' },
    { n: 6, sk: 'Ajna', name: 'Third eye', place: 'Between the eyebrows',
      colour: 'Indigo', element: 'Mind', mantra: 'OM', sense: 'Intuition',
      governs: 'Insight, imagination, perception beyond the senses, and witness consciousness.',
      note: '"Ajna" means command \u2014 the centre that receives instruction rather than issuing it.' },
    { n: 7, sk: 'Sahasrara', name: 'Crown', place: 'Above the crown of the head',
      colour: 'Violet or white', element: 'Consciousness', mantra: 'Silence', sense: '\u2014',
      governs: 'Union, transcendence, and the dissolution of the separate self.',
      note: 'Often described as a thousand-petalled lotus \u2014 and as having no bija mantra, because it is beyond sound.' }
  ];

  var CRYSTALS = [
    { stone: 'Red jasper, garnet', chakra: 'Root', note: 'Red stones are assigned to the root in the modern crystal literature.' },
    { stone: 'Carnelian, orange calcite', chakra: 'Sacral', note: 'Orange stones to the sacral centre.' },
    { stone: 'Citrine, yellow jasper', chakra: 'Solar plexus', note: 'Yellow stones to the solar plexus.' },
    { stone: 'Rose quartz, green aventurine', chakra: 'Heart', note: 'Green and pink stones to the heart.' },
    { stone: 'Lapis lazuli, blue lace agate', chakra: 'Throat', note: 'Blue stones to the throat.' },
    { stone: 'Amethyst, iolite', chakra: 'Third eye', note: 'Indigo and violet stones to the third eye.' },
    { stone: 'Clear quartz, selenite', chakra: 'Crown', note: 'Clear and white stones to the crown.' }
  ];

  function chakraRows() {
    return CHAKRAS.map(function (c) {
      return '<div style="padding:12px 0;border-bottom:1px solid #eee">' +
        '<div style="font-weight:700;font-size:15px;color:var(--accent)">' + c.n + '. ' +
        esc(c.name) + ' <span class="muted" style="font-weight:400;font-size:12px">' +
        esc(c.sk) + '</span></div>' +
        '<div class="muted" style="font-size:12.5px;margin-top:3px">' + esc(c.place) + '</div>' +
        '<div style="margin-top:6px">' + esc(c.governs) + '</div>' +
        '<table style="margin-top:6px">' +
        '<tr><td class="k" style="width:22%">Colour</td><td>' + esc(c.colour) + '</td></tr>' +
        '<tr><td class="k">Element</td><td>' + esc(c.element) + '</td></tr>' +
        '<tr><td class="k">Bija mantra</td><td>' + esc(c.mantra) + '</td></tr>' +
        '<tr><td class="k">Sense</td><td>' + esc(c.sense) + '</td></tr>' +
        '</table>' +
        '<div class="muted" style="margin-top:5px;font-size:12.5px">' + esc(c.note) + '</div>' +
        '</div>';
    }).join('');
  }

  function render() {
    var host = el('chakrashost');
    if (!host) return;

    host.innerHTML =
      '<div class="card"><h3>The seven chakras</h3>' +
      '<p class="muted">A classical tantric framework: seven centres along the spine, each with an ' +
      'element, a seed syllable and a domain of experience. This is a map of the subtle body, not of ' +
      'anatomy \u2014 no such organs exist, and the tradition does not claim they do.</p>' +
      chakraRows() + '</div>' +

      '<div class="card"><h3>Kundalini</h3>' +
      '<p>In the tantric texts kundalini is described as a coiled energy resting at the base of the ' +
      'spine, pictured as a serpent. The aim of the practices built around it is to raise that energy ' +
      'upward through the chakras to the crown, where it is said to unite with consciousness.</p>' +
      '<p class="muted">The word means "coiled". The classical texts are careful to say the raising ' +
      'is not a single event but a long discipline, and that forcing it is dangerous \u2014 which is ' +
      'why traditional teaching is one-to-one rather than from a book.</p>' +
      '<div class="warn">Kundalini awakening is described in the literature as capable of producing ' +
      'distress \u2014 anxiety, insomnia, dissociation. If you experience anything like that, it is a ' +
      'mental-health matter and belongs with a professional, not with a breathing technique.</div></div>' +

      '<div class="card"><h3>Reiki</h3>' +
      '<p class="muted">A modern practice, not a classical one.</p>' +
      '<p>Reiki was developed in Japan in the 1920s by Mikao Usui, and brought to the West in the ' +
      '1930s. A practitioner places hands lightly on or near a clothed person, and the tradition holds ' +
      'that a universal energy flows through them.</p>' +
      '<p class="muted">It is worth knowing what it is: a twentieth-century Japanese practice with no ' +
      'connection to the Vedic or tantric texts on this page, despite often being presented alongside ' +
      'them. Some people find a session relaxing, and relaxation is real. Reiki is not a treatment for ' +
      'any medical condition.</p></div>' +

      '<div class="card"><h3>Crystals and their traditional correspondences</h3>' +
      '<p class="muted">The modern crystal literature assigns stones to chakras largely by colour. ' +
      'This is a recent convention, not a classical one \u2014 the older texts discuss gemstones as ' +
      'planetary remedies, which is a different system.</p>' +
      CRYSTALS.map(function (x) {
        return '<div style="padding:7px 0;border-bottom:1px solid #f2f0f6">' +
          '<strong style="font-size:13.5px">' + esc(x.stone) + '</strong> &mdash; ' +
          '<span class="muted">' + esc(x.chakra) + '</span><br>' +
          '<span class="muted" style="font-size:12.5px">' + esc(x.note) + '</span></div>';
      }).join('') +
      '<div class="warn"><strong>Please read this one.</strong> There is no reliable evidence that ' +
      'crystals heal anything. They are pretty, some people enjoy holding them, and that is the honest ' +
      'extent of it. Nothing here treats, cures or prevents any illness. If you have a health problem, ' +
      'see a doctor \u2014 and do not delay an appointment because of a stone.</div></div>' +

      '<div class="card"><h3>Where this sits on the site</h3>' +
      '<p class="muted">Everything else here \u2014 the panchang, the kundli, the dashas \u2014 is ' +
      'calculated from planetary positions and can be checked against the sky. This page cannot be. ' +
      'It is a description of a tradition and of two modern practices, and it is offered as exactly ' +
      'that: something to read, not something to rely on.</p></div>';
  }

  function section() {
    var s = el('chakras');
    if (s) return s;
    s = document.createElement('section');
    s.id = 'chakras';
    var main = document.querySelector('main') || document.body;
    main.appendChild(s);
    return s;
  }

  function attach() {
    var sec = section();
    var host = el('chakrashost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'chakrashost';
      sec.appendChild(host);
    }
    if (!host.innerHTML.trim()) render();
  }

  function register() {
    // Add a drawer entry if the page's tab list is reachable. If it is not, the
    // section still exists and can be reached by hash, so nothing is lost.
    try {
      if (typeof TABS === 'undefined' || !Array.isArray(TABS)) return;
      if (TABS.some(function (t) { return t[0] === 'chakras'; })) return;
      TABS.push(['chakras', 'Chakras', function () { render(); }]);
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
    } catch (e) { /* fall back to the hash */ }
  }

  function boot() {
    attach();
    register();
    var tries = 0;
    var iv = setInterval(function () {
      attach();
      if (el('chakrashost') && el('chakrashost').innerHTML.trim()) clearInterval(iv);
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
