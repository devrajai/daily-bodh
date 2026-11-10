/* Daily Bodh — Bhairav, Hanuman's forms, the Saptarishi, the Shaktipeeths,
 * and how the festivals are actually kept.
 *
 * Every entry names its source. Where the tradition disagrees with itself, the
 * entry says so rather than picking a version and presenting it as the only one.
 *
 * Appends to the Shastra tab.
 *   <script src="forms.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  var BHAIRAVA_STORY =
    'Brahma once claimed to be the supreme creator, and produced a fifth head to assert it. ' +
    'Shiva cut that head off. The skull stuck to his hand and would not come away \u2014 the ' +
    'consequence of Brahmahatya, the guilt of killing a brahmin. Shiva wandered the earth as a ' +
    'beggar with the skull for years. It fell from his hand only at Kapala Tirtha in Kashi. ' +
    'Having been freed there, he stayed, and became the kotwal \u2014 the night guardian \u2014 of the city. ' +
    'That is why every Kashi pilgrim is said to need Bhairava\u2019s permission, and why the ' +
    'Kala Bhairava temple at Visheshwarganj sits at the edge of the old city.';

  var ASHTA = [
    { n: 'Asitanga', note: 'The dark-limbed. Associated with the east and with the colour black.' },
    { n: 'Ruru', note: 'The dog-formed. Ruru is also the name of a deer; the form is depicted with a dog, which is Bhairava\u2019s vahana.' },
    { n: 'Chanda', note: 'The fierce. One of the eight in the Shiva Purana\u2019s list of forms guarding the directions.' },
    { n: 'Krodha', note: 'The wrathful. Wrath here is a function of protection, not temper \u2014 the form is invoked against harm.' },
    { n: 'Unmatta', note: 'The intoxicated. Depicted wild-haired; the tradition reads the wildness as freedom from convention, not madness.' },
    { n: 'Kapala', note: 'The skull-bearer. The form most directly tied to the Brahma story above.' },
    { n: 'Bhishana', note: 'The terrifying. Guarding a boundary; the fearfulness is the point.' },
    { n: 'Samhara', note: 'The destroyer. The form associated with the dissolution that makes renewal possible.' }
  ];

  var HANUMAN_FORMS = [
    { name: 'Panchamukhi Hanuman', note: 'The five-faced form \u2014 Hanuman, Narasimha, Garuda, Varaha and Hayagriva. The account is in the Ramayana tradition: to rescue Rama and Lakshmana from Ahiravana in Patala, Hanuman took five faces to extinguish five lamps at once. The five faces are usually read as the five directions plus the centre.' },
    { name: 'Bala Hanuman', note: 'The child, reaching for the sun. Most South Indian and many North Indian depictions show this form in domestic shrines.' },
    { name: 'Vira Hanuman', note: 'The warrior, with mace and mountain. The form on fort walls and at village boundaries.' },
    { name: 'Dasa Hanuman', note: 'The servant, kneeling with hands joined, heart opened to show Rama and Sita. The most common devotional image.' },
    { name: 'Yogini Hanuman', note: 'Seated in meditation, often with a yogapatta. Rare in the north, common in some Deccan traditions.' },
    { name: 'Regional faces', note: 'North Indian images often show a moustache; South Indian ones usually do not. Some Bengal and Odisha traditions give a more human face. None of these is the "correct" one \u2014 the iconography is regional, not doctrinal.' }
  ];

  var SAPTARISHI = [
    { name: 'Kashyapa', note: 'Regarded as the father of much of creation in the Puranas \u2014 the lineage of devas, asuras and nagas is traced to him.' },
    { name: 'Atri', note: 'Author of several Rigvedic hymns. His wife Anasuya is a model of chastity in the Puranas; the Trimurti are said to have tested her.' },
    { name: 'Vasishtha', note: 'The family priest of the Ikshvaku kings, and the rival of Vishvamitra. Several Rigvedic hymns are attributed to him.' },
    { name: 'Vishvamitra', note: 'A king who became a brahmarshi through austerity. The Gayatri mantra is attributed to him. His rivalry with Vasishtha runs through the Ramayana.' },
    { name: 'Gautama', note: 'Author of the Nyaya school of logic. In the Ramayana, his wife Ahalya is cursed by Indra\u2019s deception.' },
    { name: 'Jamadagni', note: 'Father of Parashurama, the sixth avatar of Vishnu. His cow Kamadhenu is the cause of the conflict with Kartavirya Arjuna.' },
    { name: 'Bharadvaja', note: 'Author of parts of the Rigveda; the Bharadvaja gotra descends from him. His ashram appears in the Ramayana.' }
  ];

  var SHAKTI = [
    { name: 'Kamakhya', place: 'Nilachal Hill, Guwahati, Assam', note: 'The yoni peetha, and the most visited. The annual Ambubachi festival marks the menstruation of the goddess; the temple closes for three days.' },
    { name: 'Kalighat', place: 'Kolkata, West Bengal', note: 'One of the four Adi Shaktipeeths. Associated with the toes of Sati\u2019s right foot.' },
    { name: 'Vimala', place: 'Puri, Odisha', note: 'Inside the Jagannath temple complex. Associated with Sati\u2019s feet.' },
    { name: 'Vaishno Devi', place: 'Katra, Jammu and Kashmir', note: 'A cave shrine in the Trikuta hills. The most-visited pilgrimage in India after Tirupati.' },
    { name: 'Jwalamukhi', place: 'Kangra, Himachal Pradesh', note: 'A natural gas flame issues from the rock and is worshipped as the goddess. Associated with Sati\u2019s tongue.' },
    { name: 'Naina Devi', place: 'Bilaspur, Himachal Pradesh', note: 'Associated with Sati\u2019s eyes. One of the three Shakti shrines of Himachal with Jwalamukhi and Chintpurni.' },
    { name: 'Chintpurni', place: 'Una, Himachal Pradesh', note: 'The remover of anxiety. Associated with Sati\u2019s forehead.' },
    { name: 'Vindhyavasini', place: 'Mirzapur, Uttar Pradesh', note: 'The goddess of the Vindhya range, invoked in the Devi Mahatmya.' },
    { name: 'Tara Tarini', place: 'Ganjam, Odisha', note: 'Associated with Sati\u2019s breasts. A major festival falls at Chaitra.' },
    { name: 'Sharda Peeth', place: 'Neelum Valley, Pakistan-administered Kashmir', note: 'One of the four Adi Shaktipeeths, and now inaccessible to most Indian pilgrims. Its surviving shrine is across the Line of Control.' },
    { name: 'Hinglaj', place: 'Lasbela, Balochistan, Pakistan', note: 'The Kuldevi of many Hindu communities of Sindh and Gujarat. The annual pilgrimage is still made, from Pakistan.' },
    { name: 'Mansa Devi', place: 'Haridwar, Uttarakhand', note: 'The wish-fulfilling form. Reached by ropeway from Haridwar; paired with Chandi Devi across the Ganga.' }
  ];

  var FESTIVALS = [
    { name: 'Makar Sankranti', when: '14 or 15 January', how: 'The sun enters Capricorn \u2014 the only major festival fixed by the solar calendar rather than the lunar one, which is why the date barely moves. Marked by sesame and jaggery, kite flying in Gujarat, and a ritual bath in the Ganga. Called Pongal in Tamil Nadu, Bihu in Assam, Lohri in Punjab.', why: 'The end of the winter solstice period; the light begins to lengthen.' },
    { name: 'Maha Shivaratri', when: 'The fourteenth night of the dark half of Magha, in February or March', how: 'A night vigil with four rounds of abhisheka \u2014 milk, curd, ghee, honey \u2014 and fasting. The linga is bathed and bel leaves offered. Observed through the night rather than the day, which is unusual.', why: 'Traditionally the night Shiva drank the halahala poison during the churning and held it in his throat.' },
    { name: 'Holi', when: 'The full moon of Phalguna, in March', how: 'Holika Dahan the night before \u2014 a bonfire marking the burning of Holika \u2014 then colour the next morning. In Braj the celebrations run for weeks and include Lathmar Holi.', why: 'The burning of Holika, and the survival of Prahlada. The colour is a later accretion; the bonfire is the older rite.' },
    { name: 'Navratri and Durga Puja', when: 'Nine nights in Chaitra (March\u2013April) and again in Ashvin (September\u2013October)', how: 'Nine nights of fasting, garba and dandiya in Gujarat, Durga Puja pandals in Bengal, Golu displays in Tamil Nadu, and Dussehra on the tenth day. Each region keeps it completely differently \u2014 there is no single practice.', why: 'The nine nights of the goddess, ending with the defeat of Mahishasura.' },
    { name: 'Ganesh Chaturthi', when: 'The fourth day of the bright half of Bhadrapada, in August or September', how: 'A clay image is installed, worshipped daily, and immersed in water on the final day \u2014 one and a half, five, seven or eleven days later depending on the household. The public pandal version was popularised by Lokmanya Tilak in the 1890s as a communal gathering.', why: 'Ganesha\u2019s birth. The immersion is the point: the form is made to be dissolved.' },
    { name: 'Janmashtami', when: 'The eighth night of the dark half of Bhadrapada, in August or September', how: 'A fast broken at midnight, the hour of Krishna\u2019s birth. Cradles are rocked, bhajans sung, and in Maharashtra the dahi handi \u2014 a pot of curd strung high and broken by a human pyramid.', why: 'Krishna\u2019s birth in Mathura, and the escape from Kamsa.' },
    { name: 'Diwali', when: 'The new moon of Kartika, in October or November', how: 'Lamps, a clean house, Lakshmi puja in the evening, and sweets. In Gujarat the new business year begins. In Bengal, Kali Puja is kept instead. In Maharashtra, Vasu Baras opens the season.', why: 'The return of Rama to Ayodhya after fourteen years. Different regions give different reasons \u2014 Krishna\u2019s defeat of Narakasura, or the release of Bali.' },
    { name: 'Ekadashi', when: 'The eleventh day of each lunar fortnight \u2014 twice a month', how: 'A grain fast, usually with fruit and milk permitted. The strictest form takes no water. Each of the twenty-four in the year has its own name and its own account in the Puranas.', why: 'The tradition holds that Vishnu sleeps on this night, and that the fast is kept for him.' }
  ];

  function render() {
    var host = el('formshost');
    if (!host) return;

    host.innerHTML =
      '<div class="card"><h3>Bhairava</h3>' +
      '<p>' + esc(BHAIRAVA_STORY) + '</p>' +
      '<p class="muted">Source: Shiva Purana; Kashi Khanda of the Skanda Purana.</p>' +
      '<h4 style="margin-top:14px">The eight forms</h4>' +
      '<p class="muted">The Ashtabhairava, each guarding a direction in the Shiva Purana\u2019s account. The lists differ between texts; this is the common one.</p>' +
      ASHTA.map(function (a) {
        return '<div style="padding:7px 0;border-bottom:1px solid #f2f0f6">' +
          '<strong style="font-size:13.5px">' + esc(a.n) + '</strong><br>' +
          '<span class="muted" style="font-size:12.5px">' + esc(a.note) + '</span></div>';
      }).join('') + '</div>' +

      '<div class="card"><h3>Hanuman\u2019s forms</h3>' +
      '<p class="muted">There is no single "face of Hanuman". The iconography changes by region and by mood, and the differences are real, not errors.</p>' +
      HANUMAN_FORMS.map(function (h) {
        return '<div style="padding:10px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:14px">' + esc(h.name) + '</strong>' +
          '<div style="margin-top:4px;font-size:13.5px">' + esc(h.note) + '</div></div>';
      }).join('') +
      '<p class="muted" style="margin-top:8px">Source: Ramayana tradition; regional iconographic conventions.</p></div>' +

      '<div class="card"><h3>The Saptarishi</h3>' +
      '<p class="muted">The seven sages of the current manvantara \u2014 Vaivasvata. The list changes between manvantaras; these seven are the ones named for ours.</p>' +
      SAPTARISHI.map(function (s) {
        return '<div style="padding:9px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:13.5px">' + esc(s.name) + '</strong>' +
          '<div class="muted" style="font-size:12.5px;margin-top:3px">' + esc(s.note) + '</div></div>';
      }).join('') +
      '<p class="muted" style="margin-top:8px">The seven are also the seven stars of the Big Dipper \u2014 the Saptarishi Mandala.</p></div>' +

      '<div class="card"><h3>The Shaktipeeths</h3>' +
      '<div class="warn">The lists genuinely differ. The <em>Pithanirnaya</em> and Devi Bhagavata give 51; some traditions 52; popular modern lists show 12 or 18. Several are in present-day Bangladesh and Pakistan. Rather than invent a definitive set, the twelve most-visited and best-attested are given here.</div>' +
      SHAKTI.map(function (s) {
        return '<div style="padding:10px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:13.5px">' + esc(s.name) + '</strong>' +
          '<span class="muted" style="font-size:12.5px"> \u2014 ' + esc(s.place) + '</span>' +
          '<div style="margin-top:3px;font-size:13px">' + esc(s.note) + '</div></div>';
      }).join('') + '</div>' +

      '<div class="card"><h3>How the festivals are actually kept</h3>' +
      '<p class="muted">Which day, what is done, and why. Where regions differ, the differences are named \u2014 because they are large and there is no single correct way.</p>' +
      FESTIVALS.map(function (f) {
        return '<div style="padding:11px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:14.5px;color:var(--accent)">' + esc(f.name) + '</strong>' +
          '<div class="muted" style="font-size:12.5px;margin-top:2px"><strong>When:</strong> ' + esc(f.when) + '</div>' +
          '<div style="margin-top:5px;font-size:13.5px"><strong>How:</strong> ' + esc(f.how) + '</div>' +
          '<div class="muted" style="margin-top:4px;font-size:12.5px"><strong>Why:</strong> ' + esc(f.why) + '</div></div>';
      }).join('') +
      '<p class="muted" style="margin-top:10px">Exact dates for the coming years are on the Panchang tab, and the whole list can be subscribed to as a calendar there.</p></div>';
  }

  function attach() {
    var sec = el('shastra') || el('jyotish');
    if (!sec) return;
    var host = el('formshost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'formshost';
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
