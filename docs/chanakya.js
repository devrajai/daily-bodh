/* Daily Bodh — Chanakya Niti, honestly read.
 *
 * The maxims that hold up on trust, friendship and character — and a straight
 * account of the verses about women, which are not reproduced as advice because
 * they are not advice. They are 4th-century BCE courtly assumptions, and saying
 * so is more useful than quietly dropping them.
 *
 * Appends to the Shastra tab.
 *   <script src="chanakya.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var MAXIMS = [
    { theme: 'Trust', t: 'Never share a secret with someone who cannot keep their own.',
      note: 'The test of a confidant is what they do with their own information, not what they promise about yours.' },
    { theme: 'Trust', t: 'Test a person in small matters before trusting them with large ones.',
      note: 'Small tests cost nothing and reveal a great deal. Most betrayals are visible early and ignored.' },
    { theme: 'Friendship', t: 'A friend who abandons you in difficulty was never a friend in the first place.',
      note: 'Adversity is the only reliable test. Prosperity produces company, not friendship.' },
    { theme: 'Friendship', t: 'Do not make a friend of someone far above or far below your station; the imbalance will curdle it.',
      note: 'Not a rule about class \u2014 an observation about what happens when one person can always afford to lose the friendship.' },
    { theme: 'Character', t: 'The fragrance of a flower travels only with the wind. The goodness of a person travels in every direction.',
      note: 'Reputation is what people say; character is what spreads without being carried.' },
    { theme: 'Character', t: 'A person should be judged by their conduct, not their birth.',
      note: 'A radical line for its period, and the one Chanakya repeats most often.' },
    { theme: 'Speech', t: 'Speak the truth, but speak it pleasantly. A truth that wounds serves the speaker, not the listener.',
      note: 'This is the maxim most often ignored by people quoting him to justify bluntness.' },
    { theme: 'Speech', t: 'One who cannot control their tongue cannot control anything else.',
      note: 'Anger is a momentary loss of reason, and the words said in it outlive the reason.' },
    { theme: 'Conflict', t: 'Do not begin a quarrel you cannot afford to lose.',
      note: 'Written for a court, but it applies to households. Some arguments cost more to win than to avoid.' },
    { theme: 'Conflict', t: 'Reconcile with an enemy who has become weak; do not humiliate them.',
      note: 'Humiliation creates a permanent enemy out of a temporary one. The advice is about consequences, not kindness.' },
    { theme: 'Patience', t: 'A river carves stone not by force but by persistence.',
      note: 'The most quoted line in the whole text, and the one most at odds with how it is usually applied.' },
    { theme: 'Patience', t: 'Do not be too straight in your dealings \u2014 in the forest, the straight trees are cut first.',
      note: 'The most uncomfortable maxim here, and Chanakya means it. It is political advice from a court minister, not a moral one.' },
    { theme: 'Self', t: 'Before beginning anything, ask why you are doing it, what the result may be, and whether you are capable.',
      note: 'Three questions that prevent most regret.' },
    { theme: 'Self', t: 'Do not be afraid of failure once you have begun. Fear of it is more costly than the thing itself.',
      note: 'He means: hesitation during execution loses more than the failure would have.' },
    { theme: 'Learning', t: 'Knowledge is the one thing that cannot be taken from you.',
      note: 'Written by a man who was, by the tradition, mocked for his appearance and answered it with study.' },
    { theme: 'Wealth', t: 'Do not hoard. Wealth is for use, and unused wealth is a burden carried for nothing.',
      note: 'Consistent with his broader point that money is a tool of action, never an end.' }
  ];

  var WOMEN = [
    { h: 'The text does contain verses about women that are degrading',
      p: 'Several maxims in the Chanakya Niti list women alongside things a man should not trust, treat a wife chiefly as a matter of management, or advise suspicion of women\u2019s motives. They are not isolated lines; they are consistent with the courtly politics of the period. You will find them quoted approvingly online, usually without the surrounding context.' },
    { h: 'Why they are not reproduced here as advice',
      p: 'Because they are not advice. They are the assumptions of a 4th-century BCE political court, in which marriages were alliances, women rarely held property, and a minister\u2019s advice was about managing a household the way one manages a treasury. Presenting them as guidance for a relationship today would be taking a line written about asset management and applying it to a person.' },
    { h: 'What that does not mean',
      p: 'It does not mean the whole text is worthless, and it does not mean the verses should be scrubbed from history. Chanakya was a genuinely formidable political thinker and much of his writing on trust, speech and patience holds up. The honest reading keeps both facts: some of it is sharp, and some of it is the product of a world you would not want to live in.' },
    { h: 'The test to apply to any old text',
      p: 'Ask who it was written for and what problem it was solving. The Chanakya Niti was written for a king\u2019s minister managing a state. Where its advice is about human conduct, it often travels. Where it is about managing people as assets, it does not \u2014 and no amount of antiquity makes it correct.' }
  ];

  function render() {
    var host = el('chanakyahost');
    if (!host) return;

    var themes = {};
    MAXIMS.forEach(function (m) { themes[m.theme] = (themes[m.theme] || 0) + 1; });

    host.innerHTML =
      '<div class="card"><h3>Chanakya Niti on trust, speech and conduct</h3>' +
      '<p class="muted">Attributed to Chanakya \u2014 also called Kautilya \u2014 the minister credited with ' +
      'placing Chandragupta Maurya on the throne around 320 BCE. The Niti is a collection of maxims; ' +
      'his larger work is the Arthashastra, a treatise on statecraft. The Sanskrit is public domain.</p>' +
      MAXIMS.map(function (m) {
        return '<div style="padding:10px 0;border-bottom:1px solid #eee">' +
          '<span class="muted" style="font-size:11.5px;text-transform:uppercase;letter-spacing:.04em">' +
          esc(m.theme) + '</span>' +
          '<div style="margin-top:3px;font-size:13.5px"><strong>' + esc(m.t) + '</strong></div>' +
          '<div class="muted" style="margin-top:3px;font-size:12.5px">' + esc(m.note) + '</div></div>';
      }).join('') + '</div>' +

      '<div class="card"><h3>On the verses about women</h3>' +
      '<p class="muted">This needs saying plainly rather than being left out.</p>' +
      WOMEN.map(function (w) {
        return '<div style="padding:10px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:13.5px">' + esc(w.h) + '</strong>' +
          '<div style="margin-top:4px;font-size:13px">' + esc(w.p) + '</div></div>';
      }).join('') +
      '<div class="warn">If you came here looking for what Chanakya said about women to apply it in a ' +
      'relationship: he was writing about managing a court, not about loving a person. The parts of ' +
      'this text worth carrying forward are about how you speak, how you keep a secret, and how long ' +
      'you are willing to be patient. Those apply to everyone equally.</div></div>' +

      '<div class="card"><h3>Reading it well</h3>' +
      '<p class="muted">Three things worth knowing before quoting any maxim.</p>' +
      '<p><strong>It is a compilation, not a book.</strong> The verses were collected over centuries and ' +
      'attributed to him; they are not all from one hand or one period.</p>' +
      '<p><strong>It was written for power.</strong> Much of it is advice on acquiring and keeping ' +
      'authority. That is why some of it is cold, and why some of it is shrewd.</p>' +
      '<p><strong>Its best lines are about self-control.</strong> Speech, patience, testing before ' +
      'trusting, asking why before beginning. Those are the ones that survive the distance.</p></div>';
  }

  function attach() {
    var sec = el('shastra') || el('jyotish');
    if (!sec) return;
    var host = el('chanakyahost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'chanakyahost';
      sec.appendChild(host);
    }
    if (!host.innerHTML.trim()) render();
  }

  function boot() {
    var tries = 0;
    var iv = setInterval(function () {
      if (el('shastra') || el('jyotish')) { attach(); clearInterval(iv); }
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
