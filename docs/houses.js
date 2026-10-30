/* Daily Bodh — the twelve houses.
 *
 * The chart says "7th house" and most readers have no idea why that means
 * partnership. This gives each house its significations, the classical reason
 * it carries them, and where the Indian and Western readings diverge.
 *
 * The significations themselves are the tradition's common property - they run
 * through Brihat Parashara Hora Shastra, Phaladeepika and every later manual.
 * The wording here is our own.
 *
 * Only APPENDS to the Kundli tab.
 *   <script src="houses.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  var HOUSES = [
    { n: 1, sk: 'Tanu bhava', name: 'Body and self',
      means: 'The body, appearance, vitality, temperament, and the way you begin things. The ascendant itself.',
      why: 'House one is the eastern horizon at the moment of birth - the point actually rising. Everything else is measured from it, which is why it stands for the self rather than any one topic.',
      west: 'Western astrology calls it the Ascendant or rising sign and reads it the same way: persona and outward manner.' },

    { n: 2, sk: 'Dhana bhava', name: 'Wealth and speech',
      means: 'Money, food, possessions, family you are born into, speech, and what you value.',
      why: 'Once there is a body, it must be sustained. The second house is what feeds and maintains the first.',
      west: 'Similar, with more emphasis on personal values and self-worth than on family.' },

    { n: 3, sk: 'Sahaja bhava', name: 'Siblings and courage',
      means: 'Brothers and sisters, courage, communication, short journeys, the hands, and acquired skills.',
      why: 'The immediate circle around the self - peers, siblings, neighbours - and the nerve to act within it.',
      west: 'Shifts toward communication, learning and short travel; siblings matter less.' },

    { n: 4, sk: 'Bandhu bhava', name: 'Home and mother',
      means: 'Mother, home, property, vehicles, the ground you stand on, and inner peace.',
      why: 'One of the four pillars (kendra). The fourth is the lowest point of the sky at birth - what lies beneath, the foundation.',
      west: 'Also home and roots, with the father sometimes placed here instead of the mother.' },

    { n: 5, sk: 'Putra bhava', name: 'Children and creativity',
      means: 'Children, intelligence, romance, creative work, mantra, and past merit (purva punya).',
      why: 'One of the trines (trikona), and the most auspicious after the ninth. What you produce and send forward.',
      west: 'Romance, creativity and play; children are read here too.' },

    { n: 6, sk: 'Shatru bhava', name: 'Obstacles and service',
      means: 'Enemies, disease, debts, daily work, service, competition and discipline.',
      why: 'A difficult house (dusthana) - the friction that shapes a person. It also rules the effort of showing up daily.',
      west: 'Health, service and routine; enemies are read more weakly than in the Indian system.' },

    { n: 7, sk: 'Kalatra bhava', name: 'Partnership',
      means: 'Spouse, business partners, contracts, the public, and anyone you meet as an equal.',
      why: 'Directly opposite the self. The seventh is the other person - the horizon at sunset, where the self meets what is not itself.',
      west: 'Marriage and open enemies both; the Indian reading leans more to partnership.' },

    { n: 8, sk: 'Ayur bhava', name: 'Transformation and the hidden',
      means: 'Longevity, death, inheritance, secrets, the occult, other people\u2019s money, and sudden change.',
      why: 'A difficult house. What is concealed, what ends, and what is passed on rather than earned.',
      west: 'Sex, death and shared resources - a stronger emphasis on intimacy than the Indian reading.' },

    { n: 9, sk: 'Dharma bhava', name: 'Fortune and meaning',
      means: 'Religion, philosophy, higher learning, the teacher, long journeys, and good fortune.',
      why: 'The best trine. The highest point of the ecliptic above the horizon - the far horizon, what life is for.',
      west: 'Higher education, travel and belief; also called the house of the guru in Western tradition.' },

    { n: 10, sk: 'Karma bhava', name: 'Career and standing',
      means: 'Profession, status, authority, public action, reputation, and the father in some schools.',
      why: 'The meridian - the highest point of the sky at birth, what is visible to everyone. Hence public life.',
      west: 'Career and public role, with the mother sometimes placed here rather than the father.' },

    { n: 11, sk: 'Labha bhava', name: 'Gains and friends',
      means: 'Income, gains, friends, elder siblings, aspirations, and the fulfilment of desires.',
      why: 'What the tenth house\u2019s action earns. One of the growth houses (upachaya), which improve with time.',
      west: 'Friends, hopes and wishes; income is read here too.' },

    { n: 12, sk: 'Vyaya bhava', name: 'Loss and release',
      means: 'Expenses, loss, foreign lands, sleep, isolation, the unconscious, and liberation (moksha).',
      why: 'The last difficult house. What is given up, dissolved, or spent - and in the classical reading, what frees you.',
      west: 'The unconscious, hidden things and institutions; liberation is read less often.' }
  ];

  var GROUPS = [
    { name: 'Kendras (1, 4, 7, 10)', note: 'The four pillars. Angles of the chart, strongest for visible life.' },
    { name: 'Trikonas (1, 5, 9)', note: 'Trines. The most auspicious houses - purpose and merit.' },
    { name: 'Dusthanas (6, 8, 12)', note: 'Difficult houses. Friction, loss and what is hidden.' },
    { name: 'Upachaya (3, 6, 10, 11)', note: 'Growth houses - said to improve as life goes on.' },
    { name: 'Self and other', note: 'Houses 1-6 describe you and your immediate world; 7-12 describe others and the wider one.' }
  ];

  function render() {
    var host = el('houseshost');
    if (!host) return;

    var cards = HOUSES.map(function (h) {
      return '<div style="padding:12px 0;border-bottom:1px solid #eee">' +
        '<div style="font-weight:700;font-size:15px;color:var(--accent)">' +
        h.n + '. ' + esc(h.name) +
        ' <span class="muted" style="font-weight:400;font-size:12px">' + esc(h.sk) + '</span></div>' +
        '<div style="margin-top:5px">' + esc(h.means) + '</div>' +
        '<div style="margin-top:6px;font-size:12.5px" class="muted"><strong>Why this house means this:</strong> ' +
        esc(h.why) + '</div>' +
        '<div style="margin-top:4px;font-size:12.5px" class="muted"><strong>Western reading:</strong> ' +
        esc(h.west) + '</div></div>';
    }).join('');

    host.innerHTML =
      '<div class="card"><h3>The twelve houses</h3>' +
      '<p class="muted">A house is a department of life. The chart tells you which planet sits in which ' +
      'department - but the meanings themselves come from the tradition, not from the arithmetic.</p>' +
      cards +
      '</div>' +
      '<div class="card"><h3>How the houses group</h3>' +
      GROUPS.map(function (g) {
        return '<div style="padding:7px 0;border-bottom:1px solid #f2f0f6">' +
          '<strong style="font-size:13.5px">' + esc(g.name) + '</strong><br>' +
          '<span class="muted" style="font-size:12.5px">' + esc(g.note) + '</span></div>';
      }).join('') +
      '<div class="warn">House meanings are the tradition\u2019s common property and differ between schools - ' +
      'the Indian and Western readings above are not always the same, and competent astrologers disagree. ' +
      'Nothing here is a prediction about your life.</div></div>';
  }

  function attach() {
    var sec = el('kundli');
    if (!sec) return;
    var host = el('houseshost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'houseshost';
      sec.appendChild(host);
    }
    if (!host.innerHTML.trim()) render();
  }

  function boot() {
    var tries = 0;
    var iv = setInterval(function () {
      if (el('kundli')) { attach(); clearInterval(iv); }
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
