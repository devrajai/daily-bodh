/* Daily Bodh — the Kamasutra, as a classical text.
 *
 * Kama is one of the four purusharthas, alongside dharma, artha and moksha, and
 * the Kamasutra is its principal text. This card describes it as literature and
 * social history and links to the public-domain editions on archive.org.
 *
 * It deliberately does NOT host an uploaded copy. The editions circulating on
 * archive.org are mostly twentieth-century ones carrying new editorial matter
 * and introductions that are still in copyright, even though Burton's 1883
 * translation itself is not. Linking is lawful; rehosting those editions is not.
 *
 * Appends to the Shastra tab.
 *   <script src="kamasutra.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  var BOOKS = [
    { n: 1, name: 'Sadharanam', subject: 'General principles', note: 'What the text is for, the three aims of life, the branches of knowledge, and the place of kama among them.' },
    { n: 2, name: 'Samprayogikam', subject: 'Union', note: 'The book most people mean when they say Kamasutra. It is about a fifth of the whole.' },
    { n: 3, name: 'Kanyakasamprayogikam', subject: 'Courtship and marriage', note: 'How to court, how to choose a partner, and the customs surrounding marriage.' },
    { n: 4, name: 'Bharyadhikarikam', subject: 'The wife', note: 'Conduct within marriage \u2014 a section that reads as social history more than as instruction.' },
    { n: 5, name: 'Paradarikam', subject: 'The wives of others', note: 'On adultery. The text spends much of this book warning against it and describing its consequences.' },
    { n: 6, name: 'Vaishikam', subject: 'Courtesans', note: 'On the lives of courtesans \u2014 among the most detailed social documents of its period.' },
    { n: 7, name: 'Aupamishadikam', subject: 'Attaining mastery', note: 'How to succeed in the practice as a whole, and the dispositions that make it work.' }
  ];

  function render() {
    var host = el('kamsutrahost');
    if (!host) return;

    host.innerHTML =
      '<div class="card"><h3>Kamasutra \u2014 a classical text</h3>' +
      '<p>Kama is one of the four <em>purusharthas</em>: the recognised aims of a human life, alongside ' +
      'dharma (right conduct), artha (livelihood) and moksha (liberation). The Kamasutra is its ' +
      'principal text \u2014 a treatise on the place of desire in an ordered life, not a catalogue.</p>' +
      '<p class="muted">Attributed to Vatsyayana, dated by most scholars to roughly the 3rd century CE. ' +
      'It is written in terse aphorisms and is far more concerned with conduct, courtship and ' +
      'householding than its modern reputation suggests.</p>' +
      '<div class="warn">This card is a description. The full text is for adults and is not hosted here ' +
      '\u2014 see the note at the bottom for why.</div></div>' +

      '<div class="card"><h3>The seven books</h3>' +
      BOOKS.map(function (b) {
        return '<div style="padding:9px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:13.5px">' + b.n + '. ' + esc(b.name) + '</strong>' +
          '<span class="muted" style="font-size:12.5px"> \u2014 ' + esc(b.subject) + '</span>' +
          '<div class="muted" style="font-size:12.5px;margin-top:3px">' + esc(b.note) + '</div></div>';
      }).join('') +
      '<p class="muted" style="margin-top:10px">The text is best known in English through Sir Richard ' +
      'Burton\u2019s translation of 1883, which is in the public domain. It is also the translation ' +
      'most often criticised: Burton embellished, and his footnotes say more about Victorian England ' +
      'than about ancient India.</p></div>' +

      '<div class="card"><h3>Where it sits in this library</h3>' +
      '<p>The other texts here are about dharma and moksha \u2014 the Mahabharata on conduct, the ' +
      'Sushruta Samhita on the body. The Kamasutra is the one that takes the third aim seriously. ' +
      'A site that treats Indian thought as purely ascetic is telling half the story.</p>' +
      '<div class="warn">A note on the source. Burton\u2019s 1883 translation is public domain, but the ' +
      'editions actually circulating on archive.org are mostly twentieth-century ones carrying new ' +
      'editorial matter and introductions that remain in copyright. Linking to them is lawful; ' +
      'uploading a copy is not. That is why there is no file on this card, and why the other texts in ' +
      'this library were checked edition by edition before they went up.</div></div>' +

      '<div class="card"><h3>Reading it</h3>' +
      '<p class="muted">Public-domain editions are on archive.org. Search for ' +
      '\u201cKama Sutra Vatsyayana Burton\u201d and check the publication date on the edition itself ' +
      'before downloading \u2014 anything dated after 1929 is likely to carry copyrighted editorial ' +
      'material even when the translation is free.</p>' +
      '<p><a href="https://archive.org/search?query=kama+sutra+vatsyayana+burton" ' +
      'target="_blank" rel="noopener">Search archive.org \u2192</a></p></div>';
  }

  function attach() {
    var sec = el('shastra') || el('jyotish');
    if (!sec) return;
    var host = el('kamsutrahost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'kamsutrahost';
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
