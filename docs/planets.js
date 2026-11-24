/* Daily Bodh — the nine grahas, and what each does in each house.
 *
 * Every planet with its significations and dignity, then twelve short readings —
 * one per house — so a reader can look up "Mars in the 7th" directly.
 *
 * These are the traditional readings, stated as the tradition holds them. The
 * card says plainly that a real judgement depends on the whole chart.
 *
 * Appends to the Kundli tab.
 *   <script src="planets.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var PLANETS = [
    { n: 'Sun', sk: '\u0938\u0942\u0930\u094d\u092f', abbr: 'Su',
      rules: 'Leo', exalt: 'Aries 10\u00b0', debil: 'Libra 10\u00b0', day: 'Sunday', gem: 'Ruby',
      sig: 'The self, the father, authority, vitality, the bones, the eyes, government, reputation. What you are rather than what you do.',
      nature: 'Malefic in classical terms, but a mild one \u2014 the Sun burns what it touches without meaning harm. Strong Sun gives dignity; weak Sun gives a fragile sense of self.',
      houses: [
        'Confident presence, strong constitution, ego tied to how you appear. Can be imperious.',
        'Wealth through position or authority; pride in family. Speech carries weight.',
        'Courage and initiative; strong relationship with siblings or friction with them.',
        'Comfort at home and a strong bond with the mother; property comes. Emotional security matters.',
        'Authority over children; creative confidence. Can be demanding as a parent.',
        'Friction with authority, and health that needs watching. Good for service and discipline.',
        'Partner is strong-willed or in a position of authority. Marriage is a place the ego gets tested.',
        'Longevity and interest in what is hidden. Inheritance or sudden change. A difficult placement for the ego.',
        'Fortune through dharma and the father. Strong ethics, and often a teacher in the life.',
        'Career built on authority and visibility. Reputation matters more than money here.',
        'Gains through position and influential friends. Ambition pays.',
        'Expense through ego; the self is spent. Good for retreat, poor for display.'
      ] },

    { n: 'Moon', sk: '\u091a\u0928\u094d\u0926\u094d\u0930', abbr: 'Mo',
      rules: 'Cancer', exalt: 'Taurus 3\u00b0', debil: 'Scorpio 3\u00b0', day: 'Monday', gem: 'Pearl',
      sig: 'The mind, the mother, emotions, memory, the body\u2019s fluids, comfort, the public. What you feel.',
      nature: 'Benefic when waxing, and the most important planet in Jyotish after the ascendant \u2014 your rashi is the Moon\u2019s sign. A strong Moon steadies everything else.',
      houses: [
        'Sensitive, changeable, emotionally legible. The face shows what the mind feels.',
        'Income tied to the public or to the mother. Emotional relationship with money.',
        'Mind is active and communicative; close to siblings. Restless.',
        'Deep attachment to home and mother. Emotional security is the foundation of everything.',
        'Nurturing toward children; a romantic, imaginative mind.',
        'Emotional worry, and health tied to anxiety. Good for care work.',
        'Emotional need for partnership. The partner is nurturing or needs nurturing.',
        'Intense emotional life, kept private. Interest in the occult. A restless mind.',
        'A fortunate, ethical mind; strong intuition. Often a spiritual bent.',
        'Career in the public eye, or work involving care, food or the sea.',
        'Gains through the public and through networks. Wishes tend to be fulfilled.',
        'A withdrawn or imaginative mind. Good for solitude, poor for worldly drive.'
      ] },

    { n: 'Mars', sk: '\u092e\u0902\u0917\u0932', abbr: 'Ma',
      rules: 'Aries, Scorpio', exalt: 'Capricorn 28\u00b0', debil: 'Cancer 28\u00b0', day: 'Tuesday', gem: 'Red coral',
      sig: 'Energy, courage, brothers, land, surgery, machinery, anger, blood, competition.',
      nature: 'A malefic \u2014 sharp and hot. Strong Mars gives courage and physical capability; afflicted Mars gives accident, conflict and inflammation.',
      houses: [
        'Physically strong, assertive, quick to act. Prone to injury and to rushing.',
        'Forceful speech; money earned through effort or conflict.',
        'Excellent \u2014 courage, initiative, strong siblings. The best house for Mars.',
        'Friction at home; property disputes. Energy spent on the household.',
        'Competitive with children; strong creative drive.',
        'Excellent \u2014 Mars destroys enemies here. Good for service, sport and medicine.',
        'The classic Mangal dosh placement. Friction in marriage; a partner who fights or is fought with.',
        'Accident risk, surgery, conflict over inheritance. Also endurance and occult power.',
        'Courage in belief; friction with teachers or father. Strong principles.',
        'Career in engineering, defence, surgery, sport or land. Driven and effective.',
        'Gains through effort and competition. Strong and capable friends.',
        'Energy spent or misdirected; conflict abroad or in secret. Good for solitary effort.'
      ] },

    { n: 'Mercury', sk: '\u092c\u0941\u0927', abbr: 'Me',
      rules: 'Gemini, Virgo', exalt: 'Virgo 15\u00b0', debil: 'Pisces 15\u00b0', day: 'Wednesday', gem: 'Emerald',
      sig: 'Intelligence, speech, writing, commerce, calculation, humour, the nerves and skin.',
      nature: 'Neutral \u2014 takes the colour of whatever it sits with. The most adaptable planet, and the one that most rewards a good chart.',
      houses: [
        'Quick, articulate, youthful appearance. Identified with the intellect.',
        'Wealth through trade or communication; persuasive speech.',
        'Excellent \u2014 writing, commerce, strong siblings. A busy, capable mind.',
        'Education at home; property through paperwork. A thoughtful household.',
        'Intelligent children; skill in teaching and in creative calculation.',
        'Analytical and detail-driven; good for accounts, medicine and editing.',
        'A partner who is clever and talkative. Business partnership favoured.',
        'Research, investigation, sharp insight into what is hidden.',
        'Philosophical intelligence; good for law, teaching and publishing.',
        'Career in commerce, writing, analysis or administration.',
        'Gains through networks and communication.',
        'Imaginative and private thinking; good for research and for writing alone.'
      ] },

    { n: 'Jupiter', sk: '\u0917\u0941\u0930\u0941', abbr: 'Ju',
      rules: 'Sagittarius, Pisces', exalt: 'Cancer 5\u00b0', debil: 'Capricorn 5\u00b0', day: 'Thursday', gem: 'Yellow sapphire',
      sig: 'Wisdom, teachers, dharma, children, fortune, expansion, law, the liver and fat.',
      nature: 'The great benefic. Where Jupiter sits, the chart is protected \u2014 though excess is its own problem.',
      houses: [
        'Optimistic, ethical, well-liked. A fortunate presence.',
        'Wealth and good speech; a generous relationship with money.',
        'Good fortune, capable siblings, strong communication.',
        'Happiness at home; a large or fortunate household.',
        'Excellent \u2014 the best house for Jupiter. Wise children, strong merit.',
        'Protection in health; ethical in service. Jupiter here softens the dusthana.',
        'A fortunate, wise partner. Marriage brings growth.',
        'Long life and interest in the hidden; inheritance. Guarded against harm.',
        'Excellent \u2014 the best placement for fortune, dharma and teachers.',
        'Career in law, teaching, finance or advisory work. Respected.',
        'Abundant gains; influential and generous friends.',
        'Protection in foreign lands; spiritual inclination. Expenditure on good causes.'
      ] },

    { n: 'Venus', sk: '\u0936\u0941\u0915\u094d\u0930', abbr: 'Ve',
      rules: 'Taurus, Libra', exalt: 'Pisces 27\u00b0', debil: 'Virgo 27\u00b0', day: 'Friday', gem: 'Diamond',
      sig: 'Love, beauty, art, pleasure, marriage, vehicles, luxury, the reproductive system.',
      nature: 'A benefic. Strong Venus gives charm, taste and comfort; afflicted Venus gives indulgence and difficulty in relationship.',
      houses: [
        'Attractive, charming, pleasure-seeking. Good for art and for the body.',
        'Wealth through beauty, food or luxury; pleasant speech.',
        'Artistic skill; affectionate siblings.',
        'Comfort at home, vehicles, a beautiful house.',
        'Romantic, artistic, fond of children.',
        'Pleasure in service; can indicate indulgence affecting health.',
        'Excellent \u2014 the best house for Venus. A loving, attractive partner.',
        'Intense pleasure and secrecy; interest in the occult.',
        'Love of travel and beauty; fortunate in higher learning.',
        'Career in art, design, beauty, hospitality or entertainment.',
        'Gains through beauty and through influential friends.',
        'Pleasure in solitude; expense on comfort. Good for spiritual practice.'
      ] },

    { n: 'Saturn', sk: '\u0936\u0928\u093f', abbr: 'Sa',
      rules: 'Capricorn, Aquarius', exalt: 'Libra 20\u00b0', debil: 'Aries 20\u00b0', day: 'Saturday', gem: 'Blue sapphire',
      sig: 'Discipline, delay, endurance, old age, labour, the bones, karma, responsibility.',
      nature: 'A malefic, and the one people fear most \u2014 unfairly. Saturn gives slowly and takes slowly; what it gives, it keeps.',
      houses: [
        'Serious, reserved, slow to mature. A long life but a hard early one.',
        'Slow accumulation; frugal speech. Wealth comes late.',
        'Steady effort; cautious with siblings.',
        'Responsibility at home; a strict or distant upbringing.',
        'Delay with children; serious approach to creativity.',
        'Excellent \u2014 Saturn is strong in the 6th and defeats enemies here.',
        'A serious or older partner; delay in marriage, then endurance.',
        'Long life and endurance; slow, deep change.',
        'Ethical and austere; fortune comes late but holds.',
        'Excellent \u2014 Saturn is strong in the 10th. Career built slowly and kept.',
        'Gains through persistence; older friends.',
        'Isolation or foreign residence; expenditure. Good for renunciation.'
      ] },

    { n: 'Rahu', sk: '\u0930\u093e\u0939\u0941', abbr: 'Ra',
      rules: 'None (co-ruler of Aquarius in some schools)', exalt: 'Taurus (varies)', debil: 'Scorpio (varies)', day: 'Saturday', gem: 'Hessonite',
      sig: 'Obsession, ambition, foreign things, technology, illusion, sudden rise. The north node \u2014 a point, not a body.',
      nature: 'A malefic that behaves like Saturn but with more appetite and less patience. Rahu amplifies whatever it touches, and never feels satisfied.',
      houses: [
        'Unconventional identity; strong ambition and a restless self.',
        'Unusual income; money from foreign or technological sources.',
        'Bold communication; ambitious siblings.',
        'Unsettled home; foreign residence. Emotional restlessness.',
        'Unconventional creativity; intense ambition through children.',
        'Strong against enemies, but health is unpredictable.',
        'Foreign or unconventional partner; strong desire in relationship.',
        'Intense interest in the hidden; sudden change. The classic occult placement.',
        'Unconventional beliefs; foreign travel and fortune.',
        'Strong ambition and rapid rise; reputation can be unstable.',
        'Large gains through unconventional means.',
        'Foreign residence, expense, and a strong pull toward escape.'
      ] },

    { n: 'Ketu', sk: '\u0915\u0947\u0924\u0941', abbr: 'Ke',
      rules: 'None', exalt: 'Scorpio (varies)', debil: 'Taurus (varies)', day: 'Tuesday', gem: 'Cat\u2019s eye',
      sig: 'Detachment, liberation, loss, spiritual insight, the past. The south node.',
      nature: 'A malefic that behaves like Mars but without direction. Ketu gives skill without interest, and takes away what it touches \u2014 sometimes as a gift.',
      houses: [
        'Detached from the self and the body; a spiritual bent.',
        'Indifference to money; irregular income.',
        'Detached from siblings; intuitive communication.',
        'Detachment from home; a sense of not belonging.',
        'Detachment from children; spiritual creativity.',
        'Excellent \u2014 Ketu is strong in the 6th. Enemies fall away.',
        'Detachment in marriage; the partner may be absent or unusual.',
        'Strong occult insight; sudden loss or gain. The classic mystical placement.',
        'Detached belief; a spiritual teacher or none at all.',
        'Career without ambition; skill that does not translate into position.',
        'Gains come and go; detachment from networks.',
        'Excellent \u2014 the best house for Ketu. Liberation, and freedom from attachment.'
      ] }
  ];

  function render() {
    var host = el('planethost');
    if (!host) return;

    var opts = PLANETS.map(function (p, i) {
      return '<option value="' + i + '">' + esc(p.n) + '</option>';
    }).join('');

    function card(p) {
      var rows = p.houses.map(function (h, i) {
        return '<tr><td class="k" style="width:14%">' + (i + 1) + '</td>' +
          '<td style="font-size:12.5px">' + esc(h) + '</td></tr>';
      }).join('');
      return '<div style="padding:6px 0">' +
        '<div style="font-weight:700;font-size:16px;color:var(--accent)">' + esc(p.n) +
        ' <span class="muted" style="font-weight:400;font-size:13px">' + esc(p.sk) + '</span></div>' +
        '<div class="muted" style="font-size:12.5px;margin-top:2px">Rules ' + esc(p.rules) +
        ' \u00b7 Exalted ' + esc(p.exalt) + ' \u00b7 Debilitated ' + esc(p.debil) +
        ' \u00b7 ' + esc(p.day) + ' \u00b7 ' + esc(p.gem) + '</div>' +
        '<div style="margin-top:6px;font-size:13.5px"><strong>Signifies:</strong> ' + esc(p.sig) + '</div>' +
        '<div style="margin-top:4px;font-size:13.5px"><strong>Nature:</strong> ' + esc(p.nature) + '</div>' +
        '<h4 style="margin-top:10px">In each house</h4>' +
        '<table>' + rows + '</table></div>';
    }

    host.innerHTML =
      '<div class="card"><h3>The nine grahas</h3>' +
      '<p class="muted">What each planet signifies, its dignity, and what it produces in each of the ' +
      'twelve houses. Look up "Mars in the 7th" directly.</p>' +
      '<label>Jump to a planet</label>' +
      '<select id="plsel">' + opts + '</select>' +
      '<div id="plout" style="margin-top:12px"></div>' +
      '<div class="warn">These are the traditional readings, stated as the tradition holds them. A real ' +
      'judgement depends on the whole chart \u2014 the sign the planet sits in, its aspects, the dasha ' +
      'running, and the strength of its dispositor. One placement read alone is the beginning of a ' +
      'reading, not the end of one.</div></div>' +

      '<div class="card"><h3>All nine</h3>' + PLANETS.map(card).join('') + '</div>';

    function show() {
      el('plout').innerHTML =
        '<div style="border:1px solid #e6e0ee;border-radius:10px;padding:4px 12px;background:#fdfcfa">' +
        card(PLANETS[+el('plsel').value]) + '</div>';
    }
    el('plsel').onchange = show;
    show();
  }

  function attach() {
    var sec = el('kundli');
    if (!sec) return;
    var host = el('planethost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'planethost';
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
