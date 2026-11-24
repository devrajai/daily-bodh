/* Daily Bodh — what the philosophers said about relationship.
 *
 * Osho, the Stoics, the Buddhists and Kahlil Gibran, each described in plain
 * terms rather than quoted at length. Osho's talks are in copyright, so his
 * position is summarised rather than reproduced.
 *
 * Appends to the Shastra tab.
 *   <script src="philosophy.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var SCHOOLS = [
    {
      name: 'Osho', who: 'Bhagwan Shree Rajneesh, 1931\u20131990',
      core: 'His central claim about relationship is that most people use it to avoid being alone, and that this is the source of the trouble. Two people who cannot bear their own company will cling, and clinging produces jealousy, possession and fear. His prescription is the reverse of the usual one: become comfortable alone first, and then relationship becomes a sharing rather than a need.',
      more: 'He described relationship as a mirror \u2014 the partner shows you the parts of yourself you would rather not see, which is why intimacy is uncomfortable rather than simply pleasant. Love, in his framing, is not an emotion you feel toward someone but a state you are in; attachment is what remains when that state is replaced by dependency.',
      note: 'The talks are in copyright and are not reproduced here. He is also a genuinely contested figure \u2014 the Rajneeshpuram period in Oregon included a documented bioterror attack in 1984, and any honest account of him has to hold the teaching and the record together rather than picking one.',
      take: 'The useful part, which stands on its own: if you need the relationship to make you whole, you will not be able to tolerate the other person being separate from you.'
    },
    {
      name: 'The Stoics', who: 'Epictetus, Marcus Aurelius, 1st\u20132nd century CE',
      core: 'The Stoic contribution to relationship is a single distinction: some things are up to you and some are not. Your own conduct is up to you. Whether the other person loves you, stays, or changes is not. Suffering comes from treating the second category as though it were the first.',
      more: 'Marcus Aurelius returns repeatedly to the idea that you should expect people to behave badly and love them anyway \u2014 not as sentiment, but as a discipline. Epictetus is blunter: if you want your relationships to go well, do not require the other person to be someone they are not.',
      note: 'The Enchiridion and the Meditations are public domain. The tradition is often misread as cold; it is closer to the opposite \u2014 it is about not wasting your warmth on things you cannot control.',
      take: 'Ask of any relationship difficulty: what part of this is actually mine to act on? Then act only on that.'
    },
    {
      name: 'The Buddhists', who: 'The Pali canon and later teachers',
      core: 'The Buddhist analysis separates love from attachment. Metta \u2014 loving-kindness \u2014 is a wish for another\u2019s wellbeing that does not require anything back. Attachment is the version that does: it is love with a condition attached, and the condition is what produces jealousy and grief.',
      more: 'The practice is not to love less but to hold more lightly. The traditional image is of holding a bird: too loose and it flies, too tight and it dies. The point is not detachment from people but detachment from the demand that they remain unchanged.',
      note: 'This is a living tradition with many schools, and the summary here is deliberately broad. The Metta Sutta is public domain.',
      take: 'Notice whether your care for someone changes when they stop giving you what you wanted. That difference is the difference between the two.'
    },
    {
      name: 'Kahlil Gibran', who: 'The Prophet, 1923',
      core: 'In the passage on marriage, Gibran makes the case for space inside closeness: let there be spaces in your togetherness, and let the winds of the heavens dance between you. Two people should stand together but not too close, because the pillars of a temple stand apart and the oak and the cypress do not grow in each other\u2019s shadow.',
      more: 'It is the most quoted passage on marriage in the English language, and it is short. It is also genuinely unusual for its period in arguing that closeness and separateness are not opposites.',
      note: 'Published 1923 and in the public domain in most jurisdictions. Gibran died in 1931.',
      take: 'Love that requires constant proximity is usually anxiety wearing the costume of devotion.'
    },
    {
      name: 'The Upanishadic view', who: 'Brihadaranyaka Upanishad, c. 8th century BCE',
      core: 'The Brihadaranyaka contains the oldest sustained argument on this in Indian thought: a person is dear not for the sake of the person, but for the sake of the self within them. The claim is that what you love in another is ultimately the same consciousness you are \u2014 which reframes love from a transaction between two separate things into a recognition.',
      more: 'This is also the text that contains the teaching to Maitreyi on the nature of the self, given to her directly and treated as equal to any teaching given to a man.',
      note: 'Sanskrit original is public domain. The translation here is a paraphrase, not a quotation.',
      take: 'What you are drawn to in someone is often something you have not yet allowed in yourself.'
    }
  ];

  var PRACTICE = [
    { h: 'Say the thing before it becomes a resentment', p: 'Every school above converges on this. The Stoics frame it as acting on what is yours; the Buddhists as not letting a feeling harden into a demand; Osho as not pretending. The mechanism is the same \u2014 unspoken things do not disappear, they accumulate.' },
    { h: 'Distinguish the person from your idea of them', p: 'Most relationship pain comes from the gap between who someone is and who you have decided they are. The gap is usually invisible until it opens. Naming what you actually observe, rather than what you assume, closes it.' },
    { h: 'Notice what you do when you are tired', p: 'Character is what shows when the performance is not sustainable. This applies to you as much as to anyone you are trying to understand.' },
    { h: 'Keep something that is only yours', p: 'Every tradition here says the same thing in different words: a person with no separate life has nothing to bring to a shared one. This is not a recipe for distance \u2014 it is what makes closeness possible.' }
  ];

  function render() {
    var host = el('philhost');
    if (!host) return;

    host.innerHTML =
      '<div class="card"><h3>On relationship: five traditions</h3>' +
      '<p class="muted">Different centuries, different metaphysics, and a surprising amount of ' +
      'agreement about what actually goes wrong.</p>' +
      SCHOOLS.map(function (s) {
        return '<div style="padding:12px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:14.5px;color:var(--accent)">' + esc(s.name) + '</strong>' +
          '<div class="muted" style="font-size:12px">' + esc(s.who) + '</div>' +
          '<div style="margin-top:5px;font-size:13.5px">' + esc(s.core) + '</div>' +
          '<div style="margin-top:4px;font-size:13px">' + esc(s.more) + '</div>' +
          '<div class="muted" style="margin-top:5px;font-size:12.5px">' + esc(s.note) + '</div>' +
          '<div style="margin-top:5px;font-size:13px;padding:7px 10px;background:#faf8fd;border-radius:8px">' +
          '<strong>Carry this:</strong> ' + esc(s.take) + '</div></div>';
      }).join('') + '</div>' +

      '<div class="card"><h3>What all five agree on</h3>' +
      '<p class="muted">Strip the metaphysics and the same four practices remain. None of them are ' +
      'gendered, and none of them require believing anything in particular.</p>' +
      PRACTICE.map(function (p) {
        return '<div style="padding:9px 0;border-bottom:1px solid #f2f0f6">' +
          '<strong style="font-size:13.5px">' + esc(p.h) + '</strong>' +
          '<div class="muted" style="font-size:12.5px;margin-top:2px">' + esc(p.p) + '</div></div>';
      }).join('') + '</div>' +

      '<div class="card"><h3>A note on quoting</h3>' +
      '<p class="muted">None of the above is a direct quotation. Osho\u2019s talks are in copyright ' +
      'and are summarised rather than reproduced; the Upanishadic passage is a paraphrase; the Stoic ' +
      'and Buddhist material is described in modern terms rather than translated. Where a text is ' +
      'public domain \u2014 Gibran, Epictetus, Marcus Aurelius \u2014 the original is worth reading ' +
      'rather than taking second-hand.</p>' +
      '<div class="warn">Philosophy is not therapy. If a relationship is causing real distress \u2014 ' +
      'fear, coercion, or a sense that you cannot leave \u2014 the useful thing is a person qualified ' +
      'to help, not a passage from a book.</div></div>';
  }

  function attach() {
    var sec = el('shastra') || el('jyotish');
    if (!sec) return;
    var host = el('philhost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'philhost';
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
