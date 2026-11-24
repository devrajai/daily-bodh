/* Daily Bodh — the full moon, by sign and by number.
 *
 * What a full moon actually is, what it does in each of the twelve signs (the
 * Moon's sign against the Sun's opposite), what it means for each mulank, and
 * an honest note on what the evidence shows about lunar effects on people.
 *
 * Appends to the Panchang tab.
 *   <script src="fullmoon.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var SIGNS = [
    { s: 'Aries', sun: 'Libra',
      theme: 'The full moon in Aries lights up the self against the partner. Whatever you have been holding back about your own needs surfaces, and it tends to come out sideways at whoever is closest.',
      do: 'Say the thing about yourself rather than the thing about them.',
      watch: 'Picking a fight to avoid admitting you want something.' },
    { s: 'Taurus', sun: 'Scorpio',
      theme: 'Resources against shared resources. Money, possessions and what you own versus what you owe or share. Security feels suddenly urgent.',
      do: 'Look at the actual numbers rather than the feeling about them.',
      watch: 'A fight about money that is really a fight about control.' },
    { s: 'Gemini', sun: 'Sagittarius',
      theme: 'Information against belief. A detail you have been ignoring meets a conviction you have been holding. Something gets said that cannot be unsaid.',
      do: 'Ask what you actually believe before defending it.',
      watch: 'Confusing being articulate with being right.' },
    { s: 'Cancer', sun: 'Capricorn',
      theme: 'Home against career. The pull between the people you belong to and the work that takes you from them. Emotional needs surface and feel inconvenient.',
      do: 'Name what you need at home out loud, before it becomes resentment.',
      watch: 'Withdrawing into work to avoid asking for care.' },
    { s: 'Leo', sun: 'Aquarius',
      theme: 'The self against the group. What you want to be seen for meets what the collective expects. Recognition is the theme, and its absence stings.',
      do: 'Give credit away and notice how it feels.',
      watch: 'Making a scene when you are not the centre of one.' },
    { s: 'Virgo', sun: 'Pisces',
      theme: 'Detail against dissolution. The practical list meets the thing that cannot be fixed by a list. Health and daily routine come into focus.',
      do: 'Fix one real thing rather than cataloguing everything.',
      watch: 'Criticism as a way of managing anxiety.' },
    { s: 'Libra', sun: 'Aries',
      theme: 'The partner against the self. A relationship truth surfaces \u2014 something you have known and not said. Balance is the theme, and imbalance the symptom.',
      do: 'Take a side. Yours counts.',
      watch: 'Agreeing in the room and resenting it afterwards.' },
    { s: 'Scorpio', sun: 'Taurus',
      theme: 'What is shared against what is yours. Depth, intimacy and things kept hidden come up. Jealousy or suspicion may surface with very little evidence behind it.',
      do: 'Ask directly rather than investigating.',
      watch: 'Treating a suspicion as a fact.' },
    { s: 'Sagittarius', sun: 'Gemini',
      theme: 'Belief against information. A conviction meets a fact that does not fit it. Travel, study and meaning come into focus.',
      do: 'Change your mind about one small thing, deliberately.',
      watch: 'Preaching at someone who asked a simple question.' },
    { s: 'Capricorn', sun: 'Cancer',
      theme: 'Career against home. Status meets belonging. What you have built meets what it cost you, and the cost becomes visible.',
      do: 'Put the relationship before the work once, and watch what happens.',
      watch: 'Calling overwork duty when it is avoidance.' },
    { s: 'Aquarius', sun: 'Leo',
      theme: 'The group against the self. Community, friendship and principle meet personal recognition. Distance appears where warmth was expected.',
      do: 'Show up for one person the way you show up for the cause.',
      watch: 'Arguing the principle while ignoring the person in front of you.' },
    { s: 'Pisces', sun: 'Virgo',
      theme: 'Dissolution against detail. Boundaries soften, intuition rises, and the practical world feels remote. Sleep and imagination are affected.',
      do: 'Write down what you understood. It will not survive the morning otherwise.',
      watch: 'Vanishing instead of saying no.' }
  ];

  var MULANK = [
    { n: 1, planet: 'Sun', eff: 'The full moon opposes your Sun. Attention you were relying on can feel withdrawn, and the response is to push harder. The useful move is the opposite: let someone else be seen tonight.',
      tip: 'Notice where you are performing rather than being.' },
    { n: 2, planet: 'Moon', eff: 'The Moon is your own planet at full strength, and you feel it more than anyone. Emotion runs high and close to the surface \u2014 which is a resource if you use it, and a flood if you do not.',
      tip: 'Write the feeling down before you say it to a person.' },
    { n: 3, planet: 'Jupiter', eff: 'Ideas arrive faster than judgement. You will want to explain something at length to someone who did not ask. Useful for writing, poor for conversation.',
      tip: 'Draft it. Do not send it tonight.' },
    { n: 4, planet: 'Rahu', eff: 'Restlessness peaks. The urge to change something \u2014 a plan, a room, a relationship \u2014 is strong and not necessarily well judged. Novelty feels like clarity.',
      tip: 'Wait three days before acting on anything decided tonight.' },
    { n: 5, planet: 'Mercury', eff: 'The mind is quick and the mouth quicker. Good for conversation, risky for anything that needs to be said carefully. Messages sent tonight are often regretted.',
      tip: 'Say it out loud to yourself first.' },
    { n: 6, planet: 'Venus', eff: 'Warmth and the wish to be close are strong. So is the sensitivity to not being chosen. Affection given tonight is remembered; so is its absence.',
      tip: 'Ask for what you want instead of testing for it.' },
    { n: 7, planet: 'Ketu', eff: 'Detachment deepens. You may feel distant from people you love, without any reason. It is a mood, not a message about the relationship.',
      tip: 'Say "I need a quiet night" rather than going silent.' },
    { n: 8, planet: 'Saturn', eff: 'Structure feels heavy and feelings feel inaccessible. You are likely to work through it rather than feel it. That works, briefly.',
      tip: 'Say one true feeling without a reason attached.' },
    { n: 9, planet: 'Mars', eff: 'Energy and irritability both rise. The impulse to act is strong and the patience is thin. Physical effort helps; argument does not.',
      tip: 'Move first, talk after.' }
  ];

  var EVIDENCE = [
    { h: 'The popular claims do not hold',
      p: 'The idea that full moons cause madness, raise crime, trigger births or fill hospital emergency rooms has been tested repeatedly and does not survive. Large studies of psychiatric admissions, birth records and police logs find no lunar pattern beyond chance. The word "lunacy" is a folk etymology, not a finding.' },
    { h: 'Sleep is the one place something shows',
      p: 'A 2013 study by Cajochen and colleagues found that around the full moon participants took longer to fall asleep and spent less time in deep sleep, even in a windowless lab. It is a striking result \u2014 but later attempts to replicate it have produced mixed results, and the honest position is that the effect, if real, is small.' },
    { h: 'Why the belief persists anyway',
      p: 'Because we notice what confirms it. A strange night during a full moon is memorable; a strange night during a new moon is not. This is confirmation bias, and it is powerful enough to keep the belief alive in the face of the data.' },
    { h: 'What that means for this page',
      p: 'The readings above are the tradition\u2019s interpretation, and they are offered as a framework for reflection rather than as a prediction. The Moon does move the oceans; it has not been shown to move your Tuesday. Both statements are true at once, and this site does not need to pretend otherwise.' }
  ];

  function render() {
    var host = el('fmhost');
    if (!host) return;

    host.innerHTML =
      '<div class="card"><h3>The full moon</h3>' +
      '<p class="muted">Astronomically, the full moon is the moment the Sun and Moon sit 180\u00b0 apart ' +
      'as seen from Earth, so the whole face is lit. In the Hindu calendar it is Purnima, the end of ' +
      'the lunar fortnight.</p>' +
      '<p style="font-size:13.5px">In Jyotish the full moon is when the Moon is at maximum strength \u2014 ' +
      'the mind, the emotions and the public are all amplified. It is traditionally a time for ' +
      'completion and for letting go, not for beginning things. The full moon always falls in one sign ' +
      'while the Sun sits in the sign opposite, and that axis is what the readings below describe.</p>' +
      '<div class="warn">The full moon affects the whole chart at once, not one number or one sign. ' +
      'Read the sign entry for the emotional climate and the mulank entry for your own reaction to it.</div></div>' +

      '<div class="card"><h3>Full moon in each sign</h3>' +
      '<p class="muted">The Moon\u2019s sign is the one named; the Sun is in the sign opposite, and the ' +
      'tension between them is the theme.</p>' +
      SIGNS.map(function (x) {
        return '<div style="padding:11px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:14px;color:var(--accent)">' + esc(x.s) + '</strong>' +
          '<span class="muted" style="font-size:12px"> \u00b7 Sun in ' + esc(x.sun) + '</span>' +
          '<div style="margin-top:4px;font-size:13.5px">' + esc(x.theme) + '</div>' +
          '<div style="margin-top:4px;font-size:12.5px"><strong>Do:</strong> ' + esc(x.do) + '</div>' +
          '<div class="muted" style="margin-top:2px;font-size:12.5px"><strong>Watch:</strong> ' + esc(x.watch) + '</div></div>';
      }).join('') + '</div>' +

      '<div class="card"><h3>Full moon for each mulank</h3>' +
      '<p class="muted">Your mulank comes from the day of the month you were born. This is how each ' +
      'number tends to react to the amplified Moon.</p>' +
      MULANK.map(function (m) {
        return '<div style="padding:10px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:13.5px;color:var(--accent)">' + m.n + ' \u00b7 ' + esc(m.planet) + '</strong>' +
          '<div style="margin-top:3px;font-size:13px">' + esc(m.eff) + '</div>' +
          '<div class="muted" style="margin-top:3px;font-size:12.5px"><strong>Practical:</strong> ' + esc(m.tip) + '</div></div>';
      }).join('') + '</div>' +

      '<div class="card"><h3>What the evidence says</h3>' +
      '<p class="muted">This site has a rule: where a claim can be checked, it says what the checking ' +
      'found.</p>' +
      EVIDENCE.map(function (e) {
        return '<div style="padding:10px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:13.5px">' + esc(e.h) + '</strong>' +
          '<div style="margin-top:4px;font-size:13px">' + esc(e.p) + '</div></div>';
      }).join('') + '</div>';
  }

  function attach() {
    var sec = el('panchang');
    if (!sec) return;
    var host = el('fmhost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'fmhost';
      sec.appendChild(host);
    }
    if (!host.innerHTML.trim()) render();
  }

  function boot() {
    var tries = 0;
    var iv = setInterval(function () {
      if (el('panchang')) { attach(); clearInterval(iv); }
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
