/* Daily Bodh — glossary.
 *
 * Every Sanskrit term the site uses, defined in one line, so a first-time
 * visitor does not have to already know the vocabulary.
 *
 * Appends to the Jyotish tab.
 *   <script src="glossary.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var TERMS = [
    { t: 'Panchang', sk: '\u092a\u091e\u094d\u091a\u093e\u0919\u094d\u0917', m: 'Literally "five limbs". The five daily markers a Hindu almanac records: tithi, nakshatra, yoga, karana and vara (weekday). A panchang is the almanac itself.' },
    { t: 'Tithi', sk: '\u0924\u093f\u0925\u093f', m: 'A lunar day \u2014 one thirtieth of the angle between the Sun and the Moon. Not 24 hours; it varies from about 19 to 26 hours.' },
    { t: 'Nakshatra', sk: '\u0928\u0915\u094d\u0937\u0924\u094d\u0930', m: 'A lunar mansion. The zodiac is divided into 27 nakshatras of 13\u00b020\u2032 each, and each has a ruling planet and four quarters (padas).' },
    { t: 'Pada', sk: '\u092a\u093e\u0926', m: 'A quarter of a nakshatra, 3\u00b020\u2032 wide. The finest division used for naming a child and for fine timing.' },
    { t: 'Yoga (panchang)', sk: '\u092f\u094b\u0917', m: 'One of 27 daily combinations of Sun and Moon longitude. Not the same word as the planetary yoga below \u2014 context decides.' },
    { t: 'Karana', sk: '\u0915\u0930\u0923', m: 'Half a tithi. Eleven karanas repeat through the month.' },
    { t: 'Rashi', sk: '\u0930\u093e\u0936\u093f', m: 'A zodiac sign, one of twelve, each 30\u00b0 wide. Your "rashi" in common usage means your Moon sign.' },
    { t: 'Lagna', sk: '\u0932\u0917\u094d\u0928', m: 'The ascendant \u2014 the sign rising on the eastern horizon at the moment of birth. The first house of the chart.' },
    { t: 'Kundli', sk: '\u0915\u0941\u0923\u094d\u0921\u0932\u0940', m: 'A birth chart. Also spelled kundali. The diagram showing where every planet sat at birth.' },
    { t: 'Graha', sk: '\u0917\u094d\u0930\u0939', m: 'A planet, in the Jyotish sense. Includes the Sun and Moon, and Rahu and Ketu, which are not physical bodies.' },
    { t: 'Rahu and Ketu', sk: '\u0930\u093e\u0939\u0941 / \u0915\u0947\u0924\u0941', m: 'The lunar nodes \u2014 the two points where the Moon\u2019s orbit crosses the ecliptic. Treated as planets in Jyotish, though they are not.' },
    { t: 'Bhava', sk: '\u092d\u093e\u0935', m: 'A house. Twelve divisions of the chart, each covering a department of life.' },
    { t: 'Kendra', sk: '\u0915\u0947\u0928\u094d\u0926\u094d\u0930', m: 'The four pillar houses \u2014 1st, 4th, 7th and 10th. Strongest for visible life.' },
    { t: 'Trikona', sk: '\u0924\u094d\u0930\u093f\u0915\u094b\u0923', m: 'The trine houses \u2014 1st, 5th and 9th. The most auspicious.' },
    { t: 'Dusthana', sk: '\u0926\u0941\u0938\u094d\u0925\u093e\u0928', m: 'The difficult houses \u2014 6th, 8th and 12th.' },
    { t: 'Dasha', sk: '\u0926\u0936\u093e', m: 'A planetary period. Vimshottari dasha divides a life into nine periods totalling 120 years, each ruled by one planet.' },
    { t: 'Mahadasha', sk: '\u092e\u0939\u093e\u0926\u0936\u093e', m: 'The major period within a dasha cycle \u2014 years long. Each contains nine antardashas.' },
    { t: 'Antardasha', sk: '\u0905\u0928\u094d\u0924\u0930\u0926\u0936\u093e', m: 'A sub-period inside a mahadasha, ruled by a second planet. The two together give the period its character.' },
    { t: 'Gochar', sk: '\u0917\u094b\u091a\u0930', m: 'Transit \u2014 where a planet is now, as opposed to where it was at birth. Transit readings are what a rashifal is based on.' },
    { t: 'Sade Sati', sk: '\u0938\u093e\u0922\u0947 \u0938\u093e\u0924\u0940', m: 'The roughly seven-and-a-half years when Saturn transits the 12th, 1st and 2nd signs from your Moon. A period of pressure and maturation, not misfortune.' },
    { t: 'Ayanamsa', sk: '\u0905\u092f\u0928\u093e\u0902\u0936', m: 'The gap between the tropical and sidereal zodiacs, caused by the slow wobble of the Earth\u2019s axis. Lahiri is the Indian standard.' },
    { t: 'Sidereal vs tropical', sk: '\u2014', m: 'Sidereal measures from fixed stars (Indian); tropical measures from the equinox (Western). They differ by about 24\u00b0 today, which is almost a whole sign.' },
    { t: 'Muhurat', sk: '\u092e\u0941\u0939\u0942\u0930\u094d\u0924', m: 'An auspicious window for beginning something. Chosen by eliminating inauspicious periods rather than by picking a lucky one.' },
    { t: 'Rahu Kaal', sk: '\u0930\u093e\u0939\u0941 \u0915\u093e\u0932', m: 'A roughly 90-minute inauspicious window each day, one eighth of the daylight, fixed by weekday. Avoided for starting anything important.' },
    { t: 'Abhijit', sk: '\u0905\u092d\u093f\u091c\u093f\u0924', m: 'The window around solar noon \u2014 about 24 minutes \u2014 held to be auspicious for most beginnings regardless of other factors.' },
    { t: 'Choghadiya', sk: '\u091a\u094c\u0918\u0921\u093f\u092f\u093e', m: 'The day and night each divided into eight parts, each labelled good, mixed or avoid. A practical daily timing tool.' },
    { t: 'Hora', sk: '\u0939\u094b\u0930\u093e', m: 'Twelve unequal hours from sunrise to sunset, each ruled by a planet. Used for choosing an hour.' },
    { t: 'Panchak', sk: '\u092a\u091e\u094d\u091a\u0915', m: 'The last five nakshatras (Dhanishta to Revati). Certain activities are avoided in this window.' },
    { t: 'Adhik Maas', sk: '\u0905\u0927\u093f\u0915 \u092e\u093e\u0938', m: 'An intercalary lunar month, inserted roughly every 32 months to keep the lunar year aligned with the seasons.' },
    { t: 'Purnimanta / Amanta', sk: '\u2014', m: 'Two ways of ending the lunar month: at the full moon (north India) or the new moon (south and east). The month name shifts by a fortnight.' },
    { t: 'Puja', sk: '\u092a\u0942\u091c\u093e', m: 'Worship \u2014 the ritual offering of light, flowers, food and incense to a deity.' },
    { t: 'Aarti', sk: '\u0906\u0930\u0924\u0940', m: 'The lamp-offering at the end of a puja, and the song sung while it is waved.' },
    { t: 'Mantra', sk: '\u092e\u0928\u094d\u0924\u094d\u0930', m: 'A syllable or phrase repeated in practice. "Bija" mantras are single seed-syllables such as LAM or RAM.' },
    { t: 'Japa', sk: '\u091c\u092a', m: 'Repetition of a mantra. Can be audible, whispered, or mental.' },
    { t: 'Dosha (Ayurveda)', sk: '\u0926\u094b\u0937', m: 'One of three bodily tendencies \u2014 Vata, Pitta, Kapha. Not the same as a Jyotish dosha such as Mangal dosh.' },
    { t: 'Dosha (Jyotish)', sk: '\u0926\u094b\u0937', m: 'A defect in a chart \u2014 Mangal dosh, Kaal Sarp dosh, Pitru dosh. Same word, different system; context decides.' },
    { t: 'Yoga (planetary)', sk: '\u092f\u094b\u0917', m: 'A specific combination of planets producing a named result \u2014 Gaja Kesari, Raja yoga, Dhana yoga.' },
    { t: 'Mulank', sk: '\u092e\u0942\u0932\u093e\u0902\u0915', m: 'The root number \u2014 your birth day reduced to a single digit. The core number in Indian numerology.' },
    { t: 'Bhagyank', sk: '\u092d\u093e\u0917\u094d\u092f\u093e\u0902\u0915', m: 'The destiny number \u2014 your full birth date reduced to a single digit.' },
    { t: 'Namank', sk: '\u0928\u093e\u092e\u093e\u0902\u0915', m: 'The name number, from the letter values of your name in the Chaldean system.' },
    { t: 'Vastu', sk: '\u0935\u093e\u0938\u094d\u0924\u0941', m: 'The traditional system of placing a building and its rooms by direction and element.' },
    { t: 'Brahmasthan', sk: '\u092c\u094d\u0930\u0939\u094d\u092e\u0938\u094d\u0925\u093e\u0928', m: 'The centre of a building in Vastu \u2014 held to be the most sensitive point, ideally left open.' },
    { t: 'Jyotirlinga', sk: '\u091c\u094d\u092f\u094b\u0924\u093f\u0930\u094d\u0932\u093f\u0919\u094d\u0917', m: 'One of twelve shrines of Shiva named in the Shiva Purana.' },
    { t: 'Shaktipeeth', sk: '\u0936\u0915\u094d\u0924\u093f\u092a\u0940\u0920', m: 'A shrine of the goddess. The lists give 51, 52 or more depending on the text.' },
    { t: 'Samskara', sk: '\u0938\u0902\u0938\u094d\u0915\u093e\u0930', m: 'A life-cycle rite. Sixteen are traditionally listed, from conception to death.' },
    { t: 'Purushartha', sk: '\u092a\u0941\u0930\u0941\u0937\u093e\u0930\u094d\u0925', m: 'One of the four aims of a human life: dharma (conduct), artha (livelihood), kama (desire), moksha (liberation).' }
  ];

  function render() {
    var host = el('glosshost');
    if (!host) return;

    var rows = TERMS.map(function (x) {
      return '<div style="padding:8px 0;border-bottom:1px solid #f2f0f6">' +
        '<strong style="font-size:13.5px">' + esc(x.t) + '</strong>' +
        (x.sk && x.sk !== '\u2014' ? ' <span class="muted" style="font-size:13px">' + esc(x.sk) + '</span>' : '') +
        '<div style="font-size:13px;margin-top:2px">' + esc(x.m) + '</div></div>';
    }).join('');

    host.innerHTML =
      '<div class="card"><h3>Glossary</h3>' +
      '<p class="muted">Every Sanskrit term this site uses, in one line each. If you have ever read a ' +
      'panchang and understood none of it, start here.</p>' +
      '<input id="glossq" placeholder="Filter terms\u2026" style="margin-bottom:10px">' +
      '<div id="glosslist">' + rows + '</div>' +
      '<p class="muted" style="margin-top:10px;font-size:12px" id="glosscount">' +
      TERMS.length + ' terms</p></div>';

    var q = el('glossq');
    if (q) q.oninput = function () {
      var v = q.value.toLowerCase().trim();
      var list = el('glosslist');
      var shown = 0;
      list.innerHTML = TERMS.filter(function (x) {
        var hay = (x.t + ' ' + x.m).toLowerCase();
        return !v || hay.indexOf(v) >= 0;
      }).map(function (x) {
        shown++;
        return '<div style="padding:8px 0;border-bottom:1px solid #f2f0f6">' +
          '<strong style="font-size:13.5px">' + esc(x.t) + '</strong>' +
          (x.sk && x.sk !== '\u2014' ? ' <span class="muted" style="font-size:13px">' + esc(x.sk) + '</span>' : '') +
          '<div style="font-size:13px;margin-top:2px">' + esc(x.m) + '</div></div>';
      }).join('') || '<p class="muted">No term matches.</p>';
      var c = el('glosscount');
      if (c) c.textContent = shown + ' of ' + TERMS.length + ' terms';
    };
  }

  function attach() {
    var sec = el('jyotish') || el('shastra');
    if (!sec) return;
    var host = el('glosshost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'glosshost';
      sec.appendChild(host);
    }
    if (!host.innerHTML.trim()) render();
  }

  function boot() {
    var tries = 0;
    var iv = setInterval(function () {
      if (el('jyotish') || el('shastra')) { attach(); clearInterval(iv); }
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
