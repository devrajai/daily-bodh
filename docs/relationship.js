/* Daily Bodh — relationships: by number, and by evidence.
 *
 * Two halves. The first is the traditional numerology reading of how each mulank
 * and bhagyank behaves in relationship. The second is what relationship research
 * actually finds — including why claims that "women are like X" do not survive
 * testing, which is the honest answer to a question people ask constantly.
 *
 * Appends to the Numerology tab.
 *   <script src="relationship.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var MULANK = [
    { n: 1, planet: 'Sun',
      needs: 'Respect, and to be seen as capable. Criticism in front of others lands far harder than criticism in private.',
      gives: 'Loyalty, direction, and someone who will carry the weight when it matters.',
      friction: 'Turns partnership into a hierarchy without noticing. Will decide and then announce.',
      advice: 'Ask before deciding, even when you are sure. The asking is the point, not the answer.' },
    { n: 2, planet: 'Moon',
      needs: 'Reassurance, and to feel emotionally met rather than logically answered.',
      gives: 'Deep attentiveness. Notices the mood before you speak.',
      friction: 'Absorbs the partner\u2019s mood and then cannot tell whose feeling it is. Withdraws instead of saying what is wrong.',
      advice: 'Name the feeling out loud in the moment. Silence reads as punishment, even when it is not.' },
    { n: 3, planet: 'Jupiter',
      needs: 'Growth, conversation, and a partner who is also a student of something.',
      gives: 'Generosity, optimism, and a widening of the other person\u2019s world.',
      friction: 'Preaches. Gives advice nobody asked for and calls it care.',
      advice: 'Ask "do you want thoughts or do you want company?" before offering either.' },
    { n: 4, planet: 'Rahu',
      needs: 'Novelty, and a partner who does not require them to be predictable.',
      gives: 'Excitement, unconventional thinking, and freedom from routine.',
      friction: 'Restless. Commits in the moment and then feels trapped by the commitment.',
      advice: 'Be honest about what you actually want before you promise, not after.' },
    { n: 5, planet: 'Mercury',
      needs: 'Conversation and variety. Silence in a relationship reads to them as failure.',
      gives: 'Playfulness, wit, and the ability to talk through anything.',
      friction: 'Says what is convenient under pressure. Can talk their way out of accountability.',
      advice: 'Say the hard thing plainly once, rather than the easy thing three times.' },
    { n: 6, planet: 'Venus',
      needs: 'Beauty, affection, and to feel chosen rather than tolerated.',
      gives: 'Devotion, care, and a real talent for making a home feel good.',
      friction: 'Possessive. Care can become control, and affection can be withdrawn as punishment.',
      advice: 'Ask for what you need instead of testing whether they will guess.' },
    { n: 7, planet: 'Ketu',
      needs: 'Space, and a partner who does not read distance as rejection.',
      gives: 'Calm, perspective, and an unusual ability to let things go.',
      friction: 'Detaches under stress. Disappears rather than argues.',
      advice: 'Say "I need a day" instead of going quiet. The sentence costs nothing and prevents everything.' },
    { n: 8, planet: 'Saturn',
      needs: 'Reliability, and to see the relationship as something being built rather than felt.',
      gives: 'Endurance. Stays when it is difficult, which most people do not.',
      friction: 'Slow to commit, and can be cold without meaning to be. Measures the relationship by what it produces.',
      advice: 'Say the feeling without justifying it. "I am glad you are here" needs no reason attached.' },
    { n: 9, planet: 'Mars',
      needs: 'Directness and physical affection. Hinting does not register.',
      gives: 'Passion, courage, and someone who will fight for the relationship in public.',
      friction: 'Anger arrives fast and loud. Turns disagreement into a contest to be won.',
      advice: 'Wait one hour before replying to anything that stung. The hour is the whole technique.' }
  ];

  var BHAGYANK = [
    { n: 1, path: 'Learning to lead without controlling. The lesson repeats until partnership stops feeling like a threat to autonomy.' },
    { n: 2, path: 'Learning to be close without disappearing into the other person. Boundaries are the work.' },
    { n: 3, path: 'Learning to stay when it stops being interesting. Depth is the thing avoided and the thing needed.' },
    { n: 4, path: 'Learning that freedom and commitment are not opposites. Restlessness is the recurring test.' },
    { n: 5, path: 'Learning to mean what is said. Words come easily; follow-through is the lesson.' },
    { n: 6, path: 'Learning to love without owning. Care that does not become control is the whole task.' },
    { n: 7, path: 'Learning to stay present. Withdrawal is the habit, and presence is the practice.' },
    { n: 8, path: 'Learning to be warm before being useful. Tenderness is the missing piece, not effort.' },
    { n: 9, path: 'Learning patience with slowness \u2014 their own and other people\u2019s. Haste is the recurring cost.' }
  ];

  var RESEARCH = [
    { h: 'The four things that predict breakdown',
      p: 'John Gottman\u2019s long-running observational work on couples identified four behaviours that predict divorce far better than the content of the arguments: criticism (attacking the person rather than the behaviour), contempt (mockery, eye-rolling, superiority), defensiveness (turning a complaint into a counter-complaint), and stonewalling (shutting down and withdrawing). Contempt is the strongest single predictor.',
      note: 'The useful part is that all four are behaviours, not feelings. They can be noticed and changed.' },
    { h: 'The ratio that matters more than the argument',
      p: 'Gottman found that stable couples show roughly five positive interactions for every negative one during conflict. It is not that they argue less \u2014 they argue about the same things \u2014 but the surrounding texture is different. Repair attempts during an argument matter more than avoiding the argument.',
      note: 'This is the most actionable finding in the field, and it is unglamorous.' },
    { h: 'Attachment styles',
      p: 'Attachment research describes four patterns formed early and carried into adult relationships: secure (comfortable with closeness and distance), anxious (fears abandonment, seeks reassurance), avoidant (uncomfortable with closeness, values independence), and disorganised (both at once). Roughly half of adults are secure.',
      note: 'These are patterns, not diagnoses, and they shift with the relationship and with time.' },
    { h: 'The soulmate belief makes things worse',
      p: 'Studies by Raymond Knee and others found that people who believe relationships are either meant to be or not \u2014 the "destiny" belief \u2014 cope worse with conflict and are quicker to leave. Those who believe relationships are grown rather than found report more satisfaction after difficulties.',
      note: 'Believing it should be effortless is itself a risk factor.' },
    { h: 'What actually predicts satisfaction',
      p: 'Across decades of research the reliable predictors are unremarkable: how the couple handles conflict, whether they feel understood, expressed appreciation, shared meaning, and physical affection. Not compatibility scores, not shared hobbies, not similar personalities.',
      note: 'Personality similarity predicts very little. Complementarity predicts very little. Process predicts a lot.' }
  ];

  var GENDER = [
    { h: 'The finding that answers the question directly',
      p: 'Janet Shibley Hyde\u2019s 2005 review, "The Gender Similarities Hypothesis", pooled 46 meta-analyses covering millions of people. It found that 78% of reported gender differences were small or close to zero. On most psychological variables \u2014 including many about communication and emotion \u2014 the overlap between men and women is far larger than the difference between their averages.',
      note: 'This is the honest answer to "how do girls think". Mostly, they think like people.' },
    { h: 'Where real differences do appear',
      p: 'Some differences are robust but small: on average, women score slightly higher on measures of agreeableness and neuroticism and slightly lower on physical aggression. These are averages across populations. Knowing the average tells you almost nothing about the individual in front of you.',
      note: 'A difference in averages is not a rule for a person. That distinction is the whole of statistics.' },
    { h: 'Why the generalisations persist',
      p: 'Claims that "women want X" and "men want Y" survive because they are unfalsifiable \u2014 when someone does not fit, they are called an exception. They also survive because they are flattering to whoever is reading them. A claim that cannot be wrong is not insight.',
      note: 'The site takes the same position here as it does on prediction: if it cannot be checked, it is not offered as fact.' },
    { h: 'What actually helps you understand a person',
      p: 'Ask. Then listen without preparing a reply. Notice what they do when they are tired, because that is closer to the truth than what they say when they are comfortable. Watch how they treat people who cannot help them. And state your own needs plainly rather than hoping they will be inferred.',
      note: 'None of this is gendered. All of it works better than any category.' }
  ];

  function render() {
    var host = el('relhost');
    if (!host) return;

    host.innerHTML =
      '<div class="card"><h3>Relationship by mulank</h3>' +
      '<p class="muted">Your mulank comes from the day of the month you were born. This is how the ' +
      'tradition reads each number in partnership \u2014 what it needs, what it gives, where it ' +
      'friction, and the one piece of advice that follows.</p>' +
      MULANK.map(function (m) {
        return '<div style="padding:11px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:14px;color:var(--accent)">' + m.n + ' \u00b7 ' + esc(m.planet) + '</strong>' +
          '<div style="margin-top:4px;font-size:13px"><strong>Needs:</strong> ' + esc(m.needs) + '</div>' +
          '<div style="margin-top:3px;font-size:13px"><strong>Gives:</strong> ' + esc(m.gives) + '</div>' +
          '<div style="margin-top:3px;font-size:13px"><strong>Friction:</strong> ' + esc(m.friction) + '</div>' +
          '<div class="muted" style="margin-top:4px;font-size:12.5px"><strong>Advice:</strong> ' + esc(m.advice) + '</div>' +
          '</div>';
      }).join('') + '</div>' +

      '<div class="card"><h3>Relationship by bhagyank</h3>' +
      '<p class="muted">Your bhagyank comes from the full birth date. Where mulank is temperament, ' +
      'bhagyank is the recurring lesson \u2014 the thing that keeps coming up until it is learned.</p>' +
      '<table><tr><td class="k" style="width:12%">No.</td><td class="k">The lesson</td></tr>' +
      BHAGYANK.map(function (b) {
        return '<tr><td><strong>' + b.n + '</strong></td>' +
          '<td style="font-size:13px">' + esc(b.path) + '</td></tr>';
      }).join('') + '</table></div>' +

      '<div class="card"><h3>What relationship research actually finds</h3>' +
      '<p class="muted">Not astrology, and not opinion \u2014 the findings that replicate. Worth knowing ' +
      'before any of the above, because these are checkable.</p>' +
      RESEARCH.map(function (r) {
        return '<div style="padding:10px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:13.5px">' + esc(r.h) + '</strong>' +
          '<div style="margin-top:4px;font-size:13px">' + esc(r.p) + '</div>' +
          '<div class="muted" style="margin-top:4px;font-size:12.5px">' + esc(r.note) + '</div></div>';
      }).join('') + '</div>' +

      '<div class="card"><h3>On "understanding women"</h3>' +
      '<p class="muted">This is asked constantly, so it gets a straight answer rather than a ' +
      'list of generalisations.</p>' +
      GENDER.map(function (g) {
        return '<div style="padding:10px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:13.5px">' + esc(g.h) + '</strong>' +
          '<div style="margin-top:4px;font-size:13px">' + esc(g.p) + '</div>' +
          '<div class="muted" style="margin-top:4px;font-size:12.5px">' + esc(g.note) + '</div></div>';
      }).join('') +
      '<div class="warn">A page titled "women\u2019s psychology" that tells you what women are like ' +
      'would be selling you a category instead of a person. The research says the category predicts ' +
      'very little. Ask, listen, and watch what someone does when they are tired \u2014 that will tell ' +
      'you more about the individual than any list of traits.</div></div>' +

      '<div class="card"><h3>Where to read the sign and nakshatra readings</h3>' +
      '<p class="muted">Relationship content for each zodiac sign is on the <strong>Horoscope</strong> ' +
      'tab under "The twelve rashis in depth" \u2014 every sign has its own relationship, anger and ' +
      'red-flag entry. The same for the 27 nakshatras, under "The 27 nakshatras". Both are more ' +
      'specific than the number readings here.</p></div>';
  }

  function attach() {
    var sec = el('numerology');
    if (!sec) return;
    var host = el('relhost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'relhost';
      sec.appendChild(host);
    }
    if (!host.innerHTML.trim()) render();
  }

  function boot() {
    var tries = 0;
    var iv = setInterval(function () {
      if (el('numerology')) { attach(); clearInterval(iv); }
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
