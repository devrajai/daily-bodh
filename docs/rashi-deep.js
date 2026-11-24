/* Daily Bodh — the twelve rashis, in depth.
 *
 * Each sign with its lord, element, modality and symbol, then strengths,
 * weaknesses, how it handles relationship, anger and happiness, the traits that
 * should raise a flag and the ones that should reassure, and its money and
 * career signature.
 *
 * Written as the tradition reads the signs. Not a prediction about any person —
 * a Sun-sign reading is the coarsest layer there is, and the card says so.
 *
 * Appends to the Horoscope tab.
 *   <script src="rashi-deep.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var RASHI = [
    { n: 'Aries', sk: '\u092e\u0947\u0937', lord: 'Mars', element: 'Fire', mode: 'Cardinal', symbol: 'Ram',
      pros: ['Moves first; does not wait for permission', 'Says what they mean without dressing it up', 'Recovers from setbacks faster than any other sign', 'Genuinely brave in a crisis', 'Starts things other people only talk about'],
      cons: ['Acts before the full picture is in', 'Loses interest once the hard part is done', 'Can be blunt to the point of careless', 'Reads patience as being ignored', 'Keeps score in arguments'],
      love: 'Direct and demonstrative. Courts openly, gets bored without chase, and needs a partner who can hold their own rather than agree with everything.',
      anger: 'Fast and loud, then gone. Rarely carries a grudge for long \u2014 but the flash itself does damage that outlasts the mood.',
      happy: 'When moving. Stillness reads to them as being stuck, so rest has to be earned before they can enjoy it.',
      red: ['Decides alone and announces afterwards', 'Rushes a commitment you have not finished discussing', 'Turns every disagreement into a contest'],
      green: ['Apologises without being asked', 'Follows through after the exciting part is over', 'Asks your opinion and then actually uses it'],
      money: 'Earns quickly and spends at the same speed. Good at starting income, poor at keeping it \u2014 the discipline has to come from somewhere else.',
      career: 'Suits work with visible wins and short cycles: sales, sport, surgery, the armed forces, anything entrepreneurial. Poorly suited to slow committee work.' },

    { n: 'Taurus', sk: '\u0935\u0943\u0937\u092d', lord: 'Venus', element: 'Earth', mode: 'Fixed', symbol: 'Bull',
      pros: ['Extraordinarily reliable once committed', 'Good taste, and the patience to build something fine', 'Steady under pressure', 'Keeps promises', 'Comfortable with slow, unglamorous progress'],
      cons: ['Immovable once decided, even when wrong', 'Resists change past the point where it costs them', 'Can mistake stubbornness for principle', 'Holds on to things \u2014 objects, people, grievances', 'Slow to forgive being rushed'],
      love: 'Devoted, physical and loyal. Courts slowly and expects permanence. Jealousy is the shadow side of that loyalty.',
      anger: 'Slow to rise and slower to cool. The silence is more serious than any shouting.',
      happy: 'Through the senses \u2014 good food, comfort, familiar places, physical affection. Simple pleasures are not simple to them; they are the point.',
      red: ['Refuses to discuss something and calls it settled', 'Withholds affection as punishment', 'Makes decisions about shared money alone'],
      green: ['Changes their mind when given real evidence', 'Shows up on the boring days too', 'Talks about the future in concrete terms'],
      money: 'The best saver of the twelve. Builds slowly and holds. Risk is the weak point \u2014 they can be talked into a bad investment by someone they trust.',
      career: 'Finance, property, agriculture, food, design, anything where patience compounds. Poorly suited to jobs that change every quarter.' },

    { n: 'Gemini', sk: '\u092e\u093f\u0925\u0941\u0928', lord: 'Mercury', element: 'Air', mode: 'Dual', symbol: 'Twins',
      pros: ['Learns faster than almost anyone', 'Can talk to anybody about anything', 'Sees several sides of a question at once', 'Quick, funny, genuinely curious', 'Adapts without drama'],
      cons: ['Starts more than they finish', 'Can argue a position they do not hold', 'Restlessness reads as unreliability', 'Says the convenient thing under pressure', 'Depth is harder for them than breadth'],
      love: 'Needs conversation more than romance. Bores faster than any other sign, and will not say so \u2014 they just drift.',
      anger: 'Verbal and quick. Says the cutting thing, then is surprised it landed.',
      happy: 'With new information, new people, new places. Repetition is what wears them down.',
      red: ['Tells a different version of events to different people', 'Uses charm to avoid a real answer', 'Never commits to a plan more than a week out'],
      green: ['Stays when the conversation gets uncomfortable', 'Finishes the thing they started', 'Tells you the hard truth even when the easy one would do'],
      money: 'Comes and goes. Good at several small income streams, poor at consolidation. Needs a system they cannot talk their way out of.',
      career: 'Writing, journalism, teaching, sales, translation, anything involving words and variety. Poorly suited to solitary, repetitive work.' },

    { n: 'Cancer', sk: '\u0915\u0930\u094d\u0915', lord: 'Moon', element: 'Water', mode: 'Cardinal', symbol: 'Crab',
      pros: ['Protective in a way people remember for decades', 'Reads a room emotionally before anyone speaks', 'Loyal to family and history', 'Remembers what you told them once', 'Tender without needing credit'],
      cons: ['Takes things personally that were not about them', 'Withdraws instead of saying what is wrong', 'Clings to the past', 'Mood governs decisions more than they admit', 'Can be passive-aggressive rather than direct'],
      love: 'Deeply nurturing and deeply guarded. Takes a long time to trust and a long time to recover when trust breaks.',
      anger: 'Rarely open. It comes out sideways \u2014 coldness, withdrawal, or a remark with a hook in it.',
      happy: 'At home, with the people they consider theirs. Security is the precondition for everything else.',
      red: ['Goes silent and will not say why', 'Keeps a list of past hurts', 'Makes you responsible for their mood'],
      green: ['Says the hurtful thing out loud instead of withdrawing', 'Lets people change', 'Protects your interests when you are not there'],
      money: 'Careful and security-driven. Saves for the family rather than the self. Can be manipulated through guilt about family obligation.',
      career: 'Care work, teaching, hospitality, property, anything with a home base. Poorly suited to work that requires leaving people behind.' },

    { n: 'Leo', sk: '\u0938\u093f\u0902\u0939', lord: 'Sun', element: 'Fire', mode: 'Fixed', symbol: 'Lion',
      pros: ['Generous with money, credit and warmth', 'Stands up for people who cannot stand up for themselves', 'Genuinely dignified under pressure', 'Loyal to their people', 'Creates occasions that make others feel seen'],
      cons: ['Needs recognition and will sulk without it', 'Can mistake being admired for being loved', 'Pride makes apology difficult', 'Overpromises in the warm moment', 'Rarely asks for help'],
      love: 'Romantic and grand. Wants to be chosen publicly. The need for admiration can crowd out attention to the partner.',
      anger: 'Regal and wounded. Loud if the pride is touched, cold if it is humiliated.',
      happy: 'When seen. Praise is not vanity to a Leo; it is oxygen.',
      red: ['Needs to win even small disagreements', 'Takes credit that is not theirs', 'Makes a scene when not the centre'],
      green: ['Gives credit away easily', 'Apologises even when it costs face', 'Shows up for someone else\u2019s moment'],
      money: 'Spends on presentation and generosity. Earns well, saves badly, and is often more broke than they appear.',
      career: 'Leadership, performance, teaching, politics, anything with a stage. Poorly suited to anonymous back-room work.' },

    { n: 'Virgo', sk: '\u0915\u0928\u094d\u092f\u093e', lord: 'Mercury', element: 'Earth', mode: 'Dual', symbol: 'Maiden',
      pros: ['Notices what everyone else missed', 'Improves everything they touch', 'Reliable in the unglamorous details', 'Honest about their own failings', 'Genuinely useful in a crisis'],
      cons: ['Criticism lands harder than intended', 'Perfectionism stalls completion', 'Anxiety disguises itself as thoroughness', 'Can be hard on themselves in a way they would never be on others', 'Struggles to accept help'],
      love: 'Shows love through service rather than declaration. Finds it hard to believe they are wanted as they are.',
      anger: 'Not loud \u2014 precise. Finds the exact thing that will sting, and often regrets it.',
      happy: 'When things work properly. Order is a genuine pleasure to them, not a chore.',
      red: ['Corrects you in front of others', 'Cannot let a small mistake go', 'Uses "I was only being honest" as cover'],
      green: ['Accepts "good enough" when it matters', 'Praises as readily as they correct', 'Admits being wrong without a fight'],
      money: 'Careful, tracked, well-planned. The risk is over-caution \u2014 missing opportunity while checking the numbers again.',
      career: 'Analysis, medicine, editing, engineering, audit, anything requiring precision. Poorly suited to vague briefs.' },

    { n: 'Libra', sk: '\u0924\u0941\u0932\u093e', lord: 'Venus', element: 'Air', mode: 'Cardinal', symbol: 'Scales',
      pros: ['Sees both sides honestly', 'Makes people feel at ease', 'Genuinely fair-minded', 'Good taste and social instinct', 'Can hold a relationship together through difficulty'],
      cons: ['Avoids conflict until it festers', 'Says yes when they mean no', 'Can be indecisive past the point of usefulness', 'Needs approval more than they admit', 'Keeps the peace at their own expense'],
      love: 'Relationships are the centre of a Libra life. Deeply romantic, deeply afraid of being alone, and capable of staying too long.',
      anger: 'Suppressed, then delivered as cool reason that cuts more than shouting would.',
      happy: 'In harmony \u2014 with a partner, with friends, with their surroundings. Discord genuinely makes them unwell.',
      red: ['Agrees with whoever is in the room', 'Will not state a position under pressure', 'Keeps a relationship going for appearance'],
      green: ['Says the uncomfortable thing when it matters', 'Takes a side', 'Ends something honestly rather than drifting'],
      money: 'Spends on beauty and on other people. Not naturally frugal; benefits from structure imposed from outside.',
      career: 'Law, design, diplomacy, HR, counselling, anything requiring balance. Poorly suited to work that demands unilateral decisions.' },

    { n: 'Scorpio', sk: '\u0935\u0943\u0936\u094d\u091a\u093f\u0915', lord: 'Mars', element: 'Water', mode: 'Fixed', symbol: 'Scorpion',
      pros: ['Sees through people with unnerving accuracy', 'Loyal beyond reason once committed', 'Can endure what would break others', 'Keeps a secret absolutely', 'Capable of total regeneration after loss'],
      cons: ['Holds a grudge indefinitely', 'Tests people to see if they will leave', 'Control disguises itself as care', 'Jealousy runs deeper than they show', 'Silence is a weapon they use'],
      red: ['Checks your phone and calls it intuition', 'Punishes you for something you did not do', 'Will not tell you what is wrong'],
      green: ['Tells you the difficult truth about themselves', 'Forgives without pretending nothing happened', 'Lets you have privacy without suspicion'],
      love: 'All or nothing. Intense, private, physical. The trust, once broken, is rarely rebuilt.',
      anger: 'Cold and long. They do not forget and they do not need to act immediately.',
      happy: 'When trusted completely. Guard is the default state; being known is the relief.',
      money: 'Good with other people\u2019s money and with hidden value. Can be secretive about their own, which creates problems in partnership.',
      career: 'Research, medicine, investigation, psychology, finance, anything requiring depth. Poorly suited to surface-level work.' },

    { n: 'Sagittarius', sk: '\u0927\u0928\u0941', lord: 'Jupiter', element: 'Fire', mode: 'Dual', symbol: 'Archer',
      pros: ['Genuinely optimistic in a way that lifts others', 'Honest even when it costs them', 'Curious about everything', 'Generous with what they have', 'Can laugh at their own mistakes'],
      cons: ['Blunt to the point of tactless', 'Commits and then wants to leave', 'Promises more than they can deliver', 'Preaches more than they practise', 'Restless when things get routine'],
      love: 'Needs freedom inside the relationship. Genuinely loving, but allergic to being contained.',
      anger: 'Quick flare, quickly over. Rarely malicious \u2014 more careless than cruel.',
      happy: 'When learning, travelling, or arguing about ideas. Stagnation is the thing that breaks them.',
      red: ['Calls their bluntness honesty and refuses to soften it', 'Makes plans they have no intention of keeping', 'Disappears when things get heavy'],
      green: ['Stays through the boring part', 'Softens the truth without hiding it', 'Keeps a promise made casually'],
      money: 'Generous to a fault, optimistic about future income. Needs someone to hold the actual accounts.',
      career: 'Teaching, travel, law, publishing, anything involving movement and ideas. Poorly suited to confined routine.' },

    { n: 'Capricorn', sk: '\u092e\u0915\u0930', lord: 'Saturn', element: 'Earth', mode: 'Cardinal', symbol: 'Crocodile',
      pros: ['Builds things that last', 'Reliable under real pressure', 'Disciplined without needing to be watched', 'Takes responsibility before being asked', 'Gets better with age'],
      cons: ['Suppresses feeling until it comes out wrong', 'Measures worth by achievement', 'Pessimism disguises itself as realism', 'Works too much and calls it duty', 'Slow to trust warmth'],
      love: 'Serious and slow. Commits late but completely. Shows love through provision rather than words.',
      anger: 'Contained and cold. Withdraws rather than confronts, and the withdrawal is the message.',
      happy: 'When something is finished and holds. Rest feels unearned to them.',
      red: ['Treats work as more important than you, every time', 'Judges your worth by your output', 'Cannot say what they feel without a reason'],
      green: ['Puts the relationship before the job once', 'Says the feeling without justifying it', 'Admits they were wrong about someone'],
      money: 'The most reliable accumulator. Slow, steady, unglamorous. Can become miserly from fear of loss.',
      career: 'Business, engineering, administration, property, anything with a ladder. Poorly suited to chaotic environments.' },

    { n: 'Aquarius', sk: '\u0915\u0941\u092e\u094d\u092d', lord: 'Saturn', element: 'Air', mode: 'Fixed', symbol: 'Water-bearer',
      pros: ['Thinks independently of the crowd', 'Genuinely principled about fairness', 'Loyal to friends over long periods', 'Sees the systemic problem others miss', 'Unimpressed by status, which keeps them honest'],
      cons: ['Detached to the point of coldness', 'Principled about strangers and careless with intimates', 'Contrarian almost reflexively', 'Cannot be told anything directly', 'Treats feeling as a problem to be solved'],
      love: 'Needs friendship first and space always. Can love humanity in general and one person badly.',
      anger: 'Rational and remote. Explains why they are right rather than saying they are hurt.',
      happy: 'When free and among people who do not demand conformity.',
      red: ['Treats your feelings as an interesting data point', 'Argues the principle while ignoring your pain', 'Disappears into a cause'],
      green: ['Shows up for one person the way they show up for the world', 'Says "I was wrong" without a lecture attached', 'Stays when it stops being interesting'],
      money: 'Unpredictable. Generous in principle, oddly detached from their own finances. Often does better than they notice.',
      career: 'Technology, science, activism, research, anything new. Poorly suited to rigid hierarchy.' },

    { n: 'Pisces', sk: '\u092e\u0940\u0928', lord: 'Jupiter', element: 'Water', mode: 'Dual', symbol: 'Fish',
      pros: ['Compassion that does not keep accounts', 'Imagination that solves problems sideways', 'Absorbs what others feel and understands it', 'Forgives more readily than any other sign', 'Genuinely comfortable with mystery'],
      cons: ['Boundaries are almost absent', 'Avoids conflict by disappearing', 'Can be talked into things against their interest', 'Escapes rather than confronts', 'Absorbs others\u2019 moods as their own'],
      love: 'Boundless and merging. Loves the ideal as much as the person, which can be hard on both.',
      anger: 'Almost never direct. It leaks out as withdrawal, illness or sudden distance.',
      happy: 'In beauty, music, water, solitude, or service to someone. Harsh reality is what depletes them.',
      red: ['Vanishes instead of saying no', 'Tells you what you want to hear', 'Makes you responsible for rescuing them'],
      green: ['Holds a boundary even when it hurts', 'Says the difficult thing directly', 'Shows up on time and stays'],
      money: 'Poor at boundaries around money and generous to the wrong people. Needs structure they will not build themselves.',
      career: 'Art, music, healing, care work, film, anything requiring imagination. Poorly suited to ruthless commerce.' }
  ];

  function card(r) {
    return '<div style="padding:13px 0;border-bottom:1px solid #eee">' +
      '<div style="font-weight:700;font-size:16px;color:var(--accent)">' + esc(r.n) +
      ' <span class="muted" style="font-weight:400;font-size:13px">' + esc(r.sk) + '</span></div>' +
      '<div class="muted" style="font-size:12.5px;margin-top:2px">' + esc(r.lord) + ' \u00b7 ' +
      esc(r.element) + ' \u00b7 ' + esc(r.mode) + ' \u00b7 ' + esc(r.symbol) + '</div>' +

      '<div style="margin-top:8px"><strong style="font-size:13px;color:#15803d">Strengths</strong><ul style="margin:3px 0 0;padding-left:18px">' +
      r.pros.map(function (p) { return '<li style="font-size:13px">' + esc(p) + '</li>'; }).join('') + '</ul></div>' +

      '<div style="margin-top:7px"><strong style="font-size:13px;color:#b91c1c">Weaknesses</strong><ul style="margin:3px 0 0;padding-left:18px">' +
      r.cons.map(function (p) { return '<li style="font-size:13px">' + esc(p) + '</li>'; }).join('') + '</ul></div>' +

      '<div style="margin-top:8px;font-size:13px"><strong>In relationship:</strong> ' + esc(r.love) + '</div>' +
      '<div style="margin-top:4px;font-size:13px"><strong>When angry:</strong> ' + esc(r.anger) + '</div>' +
      '<div style="margin-top:4px;font-size:13px"><strong>When happy:</strong> ' + esc(r.happy) + '</div>' +

      '<div style="margin-top:7px"><strong style="font-size:13px;color:#b91c1c">Red flags</strong><ul style="margin:3px 0 0;padding-left:18px">' +
      r.red.map(function (p) { return '<li style="font-size:12.5px">' + esc(p) + '</li>'; }).join('') + '</ul></div>' +

      '<div style="margin-top:6px"><strong style="font-size:13px;color:#15803d">Green flags</strong><ul style="margin:3px 0 0;padding-left:18px">' +
      r.green.map(function (p) { return '<li style="font-size:12.5px">' + esc(p) + '</li>'; }).join('') + '</ul></div>' +

      '<div style="margin-top:7px;font-size:13px"><strong>Money:</strong> ' + esc(r.money) + '</div>' +
      '<div style="margin-top:4px;font-size:13px"><strong>Career:</strong> ' + esc(r.career) + '</div>' +
      '</div>';
  }

  function render() {
    var host = el('rashihost');
    if (!host) return;

    var opts = RASHI.map(function (r, i) {
      return '<option value="' + i + '">' + esc(r.n) + '</option>';
    }).join('');

    host.innerHTML =
      '<div class="card"><h3>The twelve rashis in depth</h3>' +
      '<p class="muted">Each sign with its lord, element and modality, then how it behaves in the ' +
      'situations that actually matter \u2014 love, anger, money, work, and the traits worth noticing ' +
      'in either direction.</p>' +
      '<label>Jump to a sign</label>' +
      '<select id="rssel">' + opts + '</select>' +
      '<div id="rsout" style="margin-top:12px"></div>' +
      '<div class="warn">This describes the <strong>sign</strong>, not you. A Sun-sign reading is the ' +
      'coarsest layer in astrology \u2014 two people born under the same sign can differ completely ' +
      'once the Moon, the ascendant and the rest of the chart are read. Take what fits and leave the ' +
      'rest; nothing here is a verdict on a person.</div></div>' +

      '<div class="card"><h3>All twelve</h3>' + RASHI.map(card).join('') + '</div>';

    function show() {
      var i = +el('rssel').value;
      el('rsout').innerHTML = '<div style="border:1px solid #e6e0ee;border-radius:10px;padding:4px 12px;background:#fdfcfa">' +
        card(RASHI[i]) + '</div>';
    }
    el('rssel').onchange = show;
    show();
  }

  function attach() {
    var sec = el('horoscope');
    if (!sec) return;
    var host = el('rashihost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'rashihost';
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
