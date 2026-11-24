/* Daily Bodh — the 27 nakshatras.
 *
 * Each with its ruling planet, deity, symbol and gana, then strengths,
 * weaknesses, how it shows in childhood, marriage, career, relationship and
 * money.
 *
 * The nakshatra is the finest division the tradition uses for character, and it
 * is read from the Moon — not the Sun. The card says so.
 *
 * Appends to the Horoscope tab.
 *   <script src="nakshatras.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var N = [
    { n: 'Ashwini', sk: '\u0905\u0936\u094d\u0935\u093f\u0928\u0940', lord: 'Ketu', deity: 'Ashwini Kumaras', symbol: 'Horse\u2019s head', gana: 'Deva',
      pros: ['Quick to act and quick to recover', 'Healing instinct \u2014 good in a crisis', 'Youthful energy that persists'],
      cons: ['Impatient and impulsive', 'Starts before thinking', 'Can be restless to the point of scattering'],
      birth: 'A fast, alert child who learns by doing rather than listening.', marriage: 'Early or impulsive marriage; a partner who values independence.', career: 'Medicine, sport, transport, anything requiring speed and nerve.', money: 'Earned fast, spent fast. Needs structure imposed from outside.', rel: 'Direct and physical. Bored by hesitation in a partner.' },

    { n: 'Bharani', sk: '\u092d\u0930\u0923\u0940', lord: 'Venus', deity: 'Yama', symbol: 'Yoni', gana: 'Manushya',
      pros: ['Carries responsibility others avoid', 'Genuinely creative and sensual', 'Can hold two sides of a hard decision'],
      cons: ['Can be possessive and jealous', 'Struggles to let go of anything', 'Intensity can overwhelm partners'],
      birth: 'A serious child who takes on more than their share.', marriage: 'Deep and demanding; jealousy is the recurring difficulty.', career: 'Art, entertainment, finance, law, anything with a threshold.', money: 'Good with money and possessive of it.', rel: 'Intense and loyal. Expects total commitment and gives it.' },

    { n: 'Krittika', sk: '\u0915\u0943\u0924\u094d\u0924\u093f\u0915\u093e', lord: 'Sun', deity: 'Agni', symbol: 'Razor or flame', gana: 'Rakshasa',
      pros: ['Cuts through to the truth', 'Purifying instinct \u2014 removes what is rotten', 'Genuinely self-reliant'],
      cons: ['Sharp to the point of harsh', 'Can be self-righteous', 'Difficult to live with when convinced'],
      birth: 'A sharp, critical child with a strong sense of fairness.', marriage: 'Delay is common; once committed, enduring.', career: 'Surgery, the military, teaching, cooking, anything that cuts or purifies.', money: 'Earns through effort and dislikes waste.', rel: 'Direct and demanding. Does not soften the truth for anyone.' },

    { n: 'Rohini', sk: '\u0930\u094b\u0939\u093f\u0923\u0940', lord: 'Moon', deity: 'Brahma', symbol: 'Ox-cart', gana: 'Manushya',
      pros: ['Genuinely charming and attractive', 'Creative and fertile in ideas', 'Good taste in everything'],
      cons: ['Can be possessive and materialistic', 'Jealous of attention', 'Comfort can slide into indulgence'],
      birth: 'An attractive, well-liked child, often the favourite.', marriage: 'Sought after and devoted; jealousy is the shadow.', career: 'Art, design, food, fashion, anything requiring taste.', money: 'Attracts money and enjoys spending it on beauty.', rel: 'Warm and sensual. Needs to feel chosen above others.' },

    { n: 'Mrigashira', sk: '\u092e\u0943\u0917\u0936\u093f\u0930\u093e', lord: 'Mars', deity: 'Soma', symbol: 'Deer\u2019s head', gana: 'Deva',
      pros: ['Genuinely curious and searching', 'Gentle and sensitive', 'Quick to learn anything new'],
      cons: ['Restless and hard to settle', 'Can be anxious and indecisive', 'Searches for what they already have'],
      birth: 'A curious, gentle child who asks endless questions.', marriage: 'Late or hesitant; the search matters more than the finding.', career: 'Research, writing, travel, anything exploratory.', money: 'Irregular; comes through enquiry and movement.', rel: 'Gentle and attentive, but difficult to pin down.' },

    { n: 'Ardra', sk: '\u0906\u0930\u094d\u0926\u094d\u0930\u093e', lord: 'Rahu', deity: 'Rudra', symbol: 'Teardrop', gana: 'Manushya',
      pros: ['Extraordinary capacity for renewal after loss', 'Sharp, penetrating intelligence', 'Genuinely empathetic to suffering'],
      cons: ['Melancholy and stormy', 'Can be destructive when hurt', 'Emotional weather changes fast'],
      birth: 'An intense child, often with a difficult early period.', marriage: 'Stormy; needs a partner who can weather moods.', career: 'Research, technology, medicine, anything transforming.', money: 'Unpredictable; often better after a crisis than before.', rel: 'Deep and turbulent. Loyalty is total once trust is built.' },

    { n: 'Punarvasu', sk: '\u092a\u0941\u0928\u0930\u094d\u0935\u0938\u0941', lord: 'Jupiter', deity: 'Aditi', symbol: 'Quiver of arrows', gana: 'Deva',
      pros: ['Genuinely optimistic and forgiving', 'Returns to what matters after setbacks', 'Warm and philosophical'],
      cons: ['Can be over-optimistic', 'Repeats mistakes out of hope', 'Avoids hard endings'],
      birth: 'A cheerful, resilient child who bounces back quickly.', marriage: 'Can involve a return \u2014 a reconciliation or a second marriage.', career: 'Teaching, law, writing, anything requiring renewal.', money: 'Generally comfortable; not driven by it.', rel: 'Warm and generous. Forgives readily, sometimes too readily.' },

    { n: 'Pushya', sk: '\u092a\u0941\u0937\u094d\u092f', lord: 'Saturn', deity: 'Brihaspati', symbol: 'Cow\u2019s udder', gana: 'Deva',
      pros: ['The most nurturing of the 27', 'Reliable and genuinely kind', 'Excellent at caring for others'],
      cons: ['Can be over-protective', 'Suppresses own needs', 'Can be rigid about duty'],
      birth: 'A responsible, caring child, often the dependable one.', marriage: 'Stable and nurturing; the most auspicious nakshatra for marriage.', career: 'Teaching, medicine, care work, anything nourishing.', money: 'Careful and steady; saves for others.', rel: 'Devoted and protective. Can neglect their own needs.' },

    { n: 'Ashlesha', sk: '\u0906\u0936\u094d\u0932\u0947\u0937\u093e', lord: 'Mercury', deity: 'Nagas', symbol: 'Coiled serpent', gana: 'Rakshasa',
      pros: ['Sees through people instantly', 'Hypnotic and persuasive', 'Extraordinary strategic patience'],
      cons: ['Can be manipulative', 'Holds a grudge a long time', 'Charm used as a tool'],
      birth: 'A watchful, clever child who notices everything.', marriage: 'Intense and possessive; trust is the central issue.', career: 'Psychology, business, politics, anything requiring insight into people.', money: 'Good at acquiring; can be secretive about it.', rel: 'Magnetic and complex. Needs to be trusted and to trust.' },

    { n: 'Magha', sk: '\u092e\u0918\u093e', lord: 'Ketu', deity: 'Pitris', symbol: 'Throne', gana: 'Rakshasa',
      pros: ['Natural dignity and authority', 'Honours ancestry and tradition', 'Genuinely proud in the best sense'],
      cons: ['Can be arrogant and entitled', 'Looks down on those without lineage', 'Pride makes apology hard'],
      birth: 'A child who expects respect and usually gets it.', marriage: 'Marries into status, or seeks it.', career: 'Leadership, politics, law, anything with a seat of authority.', money: 'Comes through position and inheritance.', rel: 'Loyal and proud. Needs respect more than affection.' },

    { n: 'Purva Phalguni', sk: '\u092a\u0942\u0930\u094d\u0935\u093e \u092b\u093e\u0932\u094d\u0917\u0941\u0928\u0940', lord: 'Venus', deity: 'Bhaga', symbol: 'Front legs of a bed', gana: 'Manushya',
      pros: ['Genuinely charming and generous', 'Creative and fun to be around', 'Loves well and openly'],
      cons: ['Can be lazy and pleasure-seeking', 'Avoids difficulty', 'Vanity is the weak point'],
      birth: 'A charming, sociable child, often spoiled.', marriage: 'Romantic and affectionate; needs play in the relationship.', career: 'Art, entertainment, design, hospitality.', money: 'Spends on pleasure; needs a manager.', rel: 'Warm, playful, sensual. Difficulty with the unglamorous parts.' },

    { n: 'Uttara Phalguni', sk: '\u0909\u0924\u094d\u0924\u0930\u093e \u092b\u093e\u0932\u094d\u0917\u0941\u0928\u0940', lord: 'Sun', deity: 'Aryaman', symbol: 'Back legs of a bed', gana: 'Manushya',
      pros: ['Genuinely loyal and dependable', 'Natural leadership without display', 'Excellent in partnership'],
      cons: ['Can be rigid about obligation', 'Suppresses resentment', 'Over-commits'],
      birth: 'A steady, responsible child, well-liked by adults.', marriage: 'One of the best nakshatras for a lasting marriage.', career: 'Administration, law, business, anything requiring trust.', money: 'Steady and well-managed.', rel: 'Loyal and supportive. Expects the same and is hurt when it is absent.' },

    { n: 'Hasta', sk: '\u0939\u0938\u094d\u0924', lord: 'Moon', deity: 'Savitar', symbol: 'Hand', gana: 'Deva',
      pros: ['Extraordinarily skilled with the hands', 'Clever and resourceful', 'Genuinely helpful'],
      cons: ['Can be anxious and over-controlling', 'Restless mind', 'Busy without progress'],
      birth: 'A capable child who fixes things and helps without being asked.', marriage: 'Domestic and practical; the working partner.', career: 'Craft, surgery, art, healing, anything manual and skilled.', money: 'Earned through skill; generally well managed.', rel: 'Practical and attentive. Shows love through doing.' },

    { n: 'Chitra', sk: '\u091a\u093f\u0924\u094d\u0930\u093e', lord: 'Mars', deity: 'Tvashtar', symbol: 'Bright jewel', gana: 'Rakshasa',
      pros: ['Genuinely artistic and striking', 'Builds beautiful things', 'Bold and confident'],
      cons: ['Can be vain and showy', 'Jealous of others\u2019 success', 'Perfectionism stalls work'],
      birth: 'An eye-catching child, often artistic early.', marriage: 'Attracted to beauty; the partner must be impressive.', career: 'Design, architecture, film, jewellery, anything made to be seen.', money: 'Comes through creative work; spent on appearance.', rel: 'Passionate and demanding. Needs to be admired.' },

    { n: 'Swati', sk: '\u0938\u094d\u0935\u093e\u0924\u093f', lord: 'Rahu', deity: 'Vayu', symbol: 'Young shoot', gana: 'Deva',
      pros: ['Genuinely independent', 'Adaptable as wind', 'Fair-minded and diplomatic'],
      cons: ['Hard to pin down', 'Avoids commitment', 'Restless to the point of rootlessness'],
      birth: 'An independent child who resists being directed.', marriage: 'Late; values freedom more than status.', career: 'Business, diplomacy, law, anything requiring flexibility.', money: 'Comes through movement and negotiation.', rel: 'Fair and easy, but difficult to hold.' },

    { n: 'Vishakha', sk: '\u0935\u093f\u0936\u093e\u0916\u093e', lord: 'Jupiter', deity: 'Indra-Agni', symbol: 'Triumphal arch', gana: 'Rakshasa',
      pros: ['Extraordinary determination', 'Goal-focused and relentless', 'Genuinely ambitious'],
      cons: ['Can be obsessive about a goal', 'Envious of rivals', 'Neglects relationships for achievement'],
      birth: 'A driven child with a clear goal early.', marriage: 'Delayed; ambition competes with partnership.', career: 'Politics, business, anything with a ladder to climb.', money: 'Earned through relentless effort.', rel: 'Intense and focused. The goal often comes first.' },

    { n: 'Anuradha', sk: '\u0905\u0928\u0941\u0930\u093e\u0927\u093e', lord: 'Saturn', deity: 'Mitra', symbol: 'Lotus', gana: 'Deva',
      pros: ['Genuinely loyal and friendly', 'Deep capacity for devotion', 'Works well with others'],
      cons: ['Can be melancholic', 'Overlooks own needs for the group', 'Struggles when away from home'],
      birth: 'A friendly, cooperative child, well-liked.', marriage: 'Deeply devoted; the most loyal of the nakshatras.', career: 'Teaching, group work, diplomacy, anything requiring cooperation.', money: 'Steady; shared generously.', rel: 'Loyal and devoted. Needs reciprocal warmth.' },

    { n: 'Jyeshtha', sk: '\u091c\u094d\u092f\u0947\u0937\u094d\u0920\u093e', lord: 'Mercury', deity: 'Indra', symbol: 'Circular amulet', gana: 'Rakshasa',
      pros: ['Natural authority and seniority', 'Protective of those beneath them', 'Capable of real responsibility'],
      cons: ['Can be arrogant and domineering', 'Jealous of equals', 'Isolation is a recurring theme'],
      birth: 'A child given responsibility early, often the eldest.', marriage: 'Delay or difficulty; authority clashes.', career: 'Leadership, administration, anything senior.', money: 'Comes with position.', rel: 'Protective and demanding. Needs to be respected.' },

    { n: 'Mula', sk: '\u092e\u0942\u0932', lord: 'Ketu', deity: 'Nirriti', symbol: 'Bundle of roots', gana: 'Rakshasa',
      pros: ['Extraordinary capacity to reach the root of a thing', 'Fearless in enquiry', 'Rebuilds from nothing'],
      cons: ['Can be destructive and self-sabotaging', 'Uproots what it touches', 'Restless and intense'],
      birth: 'A difficult early period is common; resilience follows.', marriage: 'Can involve loss before stability.', career: 'Research, investigation, medicine, anything that digs.', money: 'Comes and goes; rebuilt repeatedly.', rel: 'Intense and honest. Does not tolerate surface.' },

    { n: 'Purva Ashadha', sk: '\u092a\u0942\u0930\u094d\u0935\u093e \u0906\u0937\u093e\u0922\u093c\u093e', lord: 'Venus', deity: 'Apas', symbol: 'Elephant tusk', gana: 'Manushya',
      pros: ['Genuinely persuasive and charming', 'Invincible confidence', 'Enjoys life fully'],
      cons: ['Can be overconfident', 'Stubborn about winning', 'Indulgent'],
      birth: 'A confident, persuasive child.', marriage: 'Passionate; needs to be won.', career: 'Sales, law, entertainment, anything persuasive.', money: 'Attracts it easily; spends freely.', rel: 'Charming and passionate. Dislikes losing an argument.' },

    { n: 'Uttara Ashadha', sk: '\u0909\u0924\u094d\u0924\u0930\u093e \u0906\u0937\u093e\u0922\u093c\u093e', lord: 'Sun', deity: 'Vishvadevas', symbol: 'Elephant tusk', gana: 'Manushya',
      pros: ['Enduring and principled', 'Achieves late but permanently', 'Genuinely fair'],
      cons: ['Can be rigid and slow', 'Overly serious', 'Misses the moment by waiting'],
      birth: 'A serious, principled child.', marriage: 'Stable, often later than average.', career: 'Law, politics, administration, anything requiring endurance.', money: 'Slow, steady, retained.', rel: 'Reliable and principled. Expects integrity.' },

    { n: 'Shravana', sk: '\u0936\u094d\u0930\u0935\u0923', lord: 'Moon', deity: 'Vishnu', symbol: 'Ear', gana: 'Deva',
      pros: ['Extraordinary listener', 'Learns from everyone', 'Genuinely wise'],
      cons: ['Can be indecisive from hearing too much', 'Gossip is the weak point', 'Over-influenced by others'],
      birth: 'A child who listens more than speaks.', marriage: 'Harmonious; the partner is often met through learning.', career: 'Teaching, counselling, journalism, anything requiring listening.', money: 'Steady; often through knowledge.', rel: 'Attentive and understanding. Needs to be heard too.' },

    { n: 'Dhanishta', sk: '\u0927\u0928\u093f\u0937\u094d\u0920\u093e', lord: 'Mars', deity: 'Vasus', symbol: 'Drum', gana: 'Rakshasa',
      pros: ['Genuinely musical and rhythmic', 'Wealthy instinct', 'Capable of hard work'],
      cons: ['Can be arrogant about money', 'Restless and loud', 'Jealous of others\u2019 prosperity'],
      birth: 'A lively child, often musical.', marriage: 'Often delayed; career first.', career: 'Music, business, finance, anything rhythmic or lucrative.', money: 'Good at acquiring; can be boastful.', rel: 'Warm and generous, with a competitive streak.' },

    { n: 'Shatabhisha', sk: '\u0936\u0924\u092d\u093f\u0937\u093e', lord: 'Rahu', deity: 'Varuna', symbol: 'Empty circle', gana: 'Rakshasa',
      pros: ['Genuinely original thinker', 'Healing insight', 'Sees the hidden pattern'],
      cons: ['Solitary to the point of isolation', 'Can be secretive and odd', 'Detached from relationships'],
      birth: 'A solitary, unusual child.', marriage: 'Often delayed or unconventional.', career: 'Medicine, research, technology, astrology.', money: 'Unpredictable; comes through the unusual.', rel: 'Private and complex. Needs space above closeness.' },

    { n: 'Purva Bhadrapada', sk: '\u092a\u0942\u0930\u094d\u0935\u093e \u092d\u093e\u0926\u094d\u0930\u092a\u0926\u093e', lord: 'Jupiter', deity: 'Aja Ekapada', symbol: 'Front of a funeral cot', gana: 'Manushya',
      pros: ['Extraordinary intensity and depth', 'Capable of spiritual insight', 'Genuinely transformative'],
      cons: ['Can be extreme and volatile', 'Anxious about death', 'Difficult to live with'],
      birth: 'An intense, unusual child.', marriage: 'Intense; often later or unconventional.', career: 'Anything involving transformation, death, healing or the occult.', money: 'Irregular; not the priority.', rel: 'Deep and demanding. Needs a partner unafraid of intensity.' },

    { n: 'Uttara Bhadrapada', sk: '\u0909\u0924\u094d\u0924\u0930\u093e \u092d\u093e\u0926\u094d\u0930\u092a\u0926\u093e', lord: 'Saturn', deity: 'Ahir Budhnya', symbol: 'Back of a funeral cot', gana: 'Manushya',
      pros: ['Genuinely wise and calm', 'Deep and steady', 'Excellent with those in crisis'],
      cons: ['Can be withdrawn and passive', 'Melancholy', 'Detached from worldly ambition'],
      birth: 'A quiet, deep child.', marriage: 'Stable and enduring.', career: 'Teaching, healing, counselling, spiritual work.', money: 'Steady and unambitious.', rel: 'Deep and loyal. Needs a partner content with quiet.' },

    { n: 'Revati', sk: '\u0930\u0947\u0935\u0924\u0940', lord: 'Mercury', deity: 'Pushan', symbol: 'Fish', gana: 'Deva',
      pros: ['Genuinely compassionate', 'Protective of the vulnerable', 'Creative and imaginative'],
      cons: ['Can be naive and easily led', 'Over-protective', 'Escapes from harshness'],
      birth: 'A gentle, imaginative child.', marriage: 'Gentle and nurturing; can be too accommodating.', career: 'Care work, art, teaching, anything protecting the vulnerable.', money: 'Generous to a fault.', rel: 'Kind and accommodating. Needs to be protected too.' }
  ];

  function card(k) {
    return '<div style="padding:12px 0;border-bottom:1px solid #eee">' +
      '<div style="font-weight:700;font-size:15px;color:var(--accent)">' + esc(k.n) +
      ' <span class="muted" style="font-weight:400;font-size:12.5px">' + esc(k.sk) + '</span></div>' +
      '<div class="muted" style="font-size:12px;margin-top:2px">' + esc(k.lord) + ' \u00b7 ' +
      esc(k.deity) + ' \u00b7 ' + esc(k.symbol) + ' \u00b7 ' + esc(k.gana) + ' gana</div>' +
      '<div style="margin-top:6px"><strong style="font-size:12.5px;color:#15803d">Strengths</strong><ul style="margin:2px 0 0;padding-left:17px">' +
      k.pros.map(function (p) { return '<li style="font-size:12.5px">' + esc(p) + '</li>'; }).join('') + '</ul></div>' +
      '<div style="margin-top:5px"><strong style="font-size:12.5px;color:#b91c1c">Weaknesses</strong><ul style="margin:2px 0 0;padding-left:17px">' +
      k.cons.map(function (p) { return '<li style="font-size:12.5px">' + esc(p) + '</li>'; }).join('') + '</ul></div>' +
      '<div style="margin-top:6px;font-size:12.5px"><strong>In childhood:</strong> ' + esc(k.birth) + '</div>' +
      '<div style="margin-top:3px;font-size:12.5px"><strong>Marriage:</strong> ' + esc(k.marriage) + '</div>' +
      '<div style="margin-top:3px;font-size:12.5px"><strong>Relationship:</strong> ' + esc(k.rel) + '</div>' +
      '<div style="margin-top:3px;font-size:12.5px"><strong>Career:</strong> ' + esc(k.career) + '</div>' +
      '<div style="margin-top:3px;font-size:12.5px"><strong>Money:</strong> ' + esc(k.money) + '</div>' +
      '</div>';
  }

  function render() {
    var host = el('nakhhost');
    if (!host) return;

    var opts = N.map(function (k, i) {
      return '<option value="' + i + '">' + (i + 1) + '. ' + esc(k.n) + '</option>';
    }).join('');

    host.innerHTML =
      '<div class="card"><h3>The 27 nakshatras</h3>' +
      '<p class="muted">The lunar mansions \u2014 the finest division the tradition uses for character. ' +
      'Your nakshatra comes from the Moon, not the Sun, and is the single most personal marker in ' +
      'the chart after the ascendant.</p>' +
      '<label>Jump to a nakshatra</label>' +
      '<select id="nksel">' + opts + '</select>' +
      '<div id="nkout" style="margin-top:12px"></div>' +
      '<div class="warn">Read as the tradition reads them. A nakshatra describes a disposition, not a ' +
      'destiny \u2014 the pada, the ruling planet\u2019s strength and the rest of the chart all modify it. ' +
      'Nothing here is a prediction about a particular person.</div></div>' +

      '<div class="card"><h3>All 27</h3>' + N.map(card).join('') + '</div>';

    function show() {
      el('nkout').innerHTML = '<div style="border:1px solid #e6e0ee;border-radius:10px;padding:4px 12px;background:#fdfcfa">' +
        card(N[+el('nksel').value]) + '</div>';
    }
    el('nksel').onchange = show;
    show();
  }

  function attach() {
    var sec = el('horoscope');
    if (!sec) return;
    var host = el('nakhhost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'nakhhost';
      sec.appendChild(host);
    }
    if (!host.innerHTML.trim()) render();
  }

  function boot() {
    var tries = 0;
    var iv = setInterval(function () {
      if (el('horoscope')) { attach(); clearInterval(iv); }
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
