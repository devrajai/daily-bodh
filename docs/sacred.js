/* Daily Bodh — sacred places and the stories behind them.
 *
 * The twelve Jyotirlingas, a set of deity stories with their Puranic sources,
 * and a daily rotation that picks one by date.
 *
 * Sourcing rule: every entry names the text it comes from. Where traditions
 * differ, the entry says so. Nothing here is invented to fill a slot — a story
 * without a source is not included.
 *
 * Appends to the Shastra tab.
 *   <script src="sacred.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  var JYOTIRLINGA = [
    { n: 1, name: 'Somnath', place: 'Prabhas Patan, Gir Somnath, Gujarat',
      story: 'Soma, the moon, was cursed by Daksha to waste away. He prayed here and was released from the curse, though the waning remained as a reminder. The temple has been destroyed and rebuilt several times \u2014 the present structure is a 1951 reconstruction after Mahmud of Ghazni\u2019s raid in 1026.',
      source: 'Shiva Purana, Kotirudra Samhita' },
    { n: 2, name: 'Mallikarjuna', place: 'Srisailam, Andhra Pradesh',
      story: 'Kartikeya, angered that Ganesha was married first, left Kailasa for the Krauncha mountain. Shiva and Parvati followed to console him and stayed here as Mallikarjuna and Bhramaramba.',
      source: 'Shiva Purana; Srisailam Mahatmya' },
    { n: 3, name: 'Mahakaleshwar', place: 'Ujjain, Madhya Pradesh',
      story: 'A boy named Shrikar slew the demon Dushana and his army to protect the sages of Mahakal forest. Shiva granted him a boon and took residence here as Mahakala \u2014 the lord of time. This is the only Jyotirlinga facing south.',
      source: 'Shiva Purana; Avanti Khanda of the Skanda Purana' },
    { n: 4, name: 'Omkareshwar', place: 'Mandhata island, Narmada, Madhya Pradesh',
      story: 'The Vindhya mountains, jealous of Meru, performed penance here to be humbled. Shiva appeared and took up residence on the island, which is shaped like the syllable Om.',
      source: 'Shiva Purana; Narmada Mahatmya' },
    { n: 5, name: 'Kedarnath', place: 'Rudraprayag, Uttarakhand',
      story: 'After the Kurukshetra war the Pandavas sought Shiva to be released from the sin of killing kin. He hid among the five Kedars; Bhima pursued him and Shiva sank into the ground, leaving his hump here.',
      source: 'Shiva Purana; Kedara Khanda of the Skanda Purana' },
    { n: 6, name: 'Bhimashankar', place: 'Pune district, Maharashtra',
      story: 'Bhimashankar was born of Shiva to destroy the demon Tripurasura, who had been granted that he could only be killed by a son of Shiva. The battle exhausted him and he took up residence here.',
      source: 'Shiva Purana; Bhimashankar Mahatmya' },
    { n: 7, name: 'Kashi Vishwanath', place: 'Varanasi, Uttar Pradesh',
      story: 'Shiva chose Varanasi as his home after the city was founded by Divodasa. The present temple was built by Ahilyabai Holkar in 1780, after Aurangzeb\u2019s demolition of the earlier one in 1669.',
      source: 'Kashi Khanda of the Skanda Purana' },
    { n: 8, name: 'Trimbakeshwar', place: 'Nashik, Maharashtra',
      story: 'Gautama Rishi, falsely accused of killing a cow, prayed to Shiva to bring the Godavari down to purify the land. Shiva appeared as Trimbaka \u2014 the three-eyed.',
      source: 'Shiva Purana; Nasik Mahatmya' },
    { n: 9, name: 'Baidyanath', place: 'Deoghar, Jharkhand',
      story: 'Ravana performed severe penance to Shiva and offered his ten heads one by one. Shiva, pleased, healed him and asked what he wanted \u2014 Ravana asked that Shiva come to Lanka. Shiva agreed, on condition that he be set down and not moved; he was set down here.',
      source: 'Shiva Purana; regional Deoghar tradition' },
    { n: 10, name: 'Nageshwar', place: 'Dwarka, Gujarat',
      story: 'The demon Daruka imprisoned a Shiva devotee, Supriya, and his companions. Supriya prayed, and Shiva appeared from a linga to destroy Daruka and free them. The linga is said to be guarded by a Naga.',
      source: 'Shiva Purana; Dwarka Mahatmya' },
    { n: 11, name: 'Rameshwaram', place: 'Ramanathapuram, Tamil Nadu',
      story: 'Returning from Lanka, Rama worshipped Shiva here to be released from the sin of killing Ravana, a Brahmin. Sita is said to have made the linga from sand, which Rama consecrated.',
      source: 'Ramayana; Skanda Purana, Setu Mahatmya' },
    { n: 12, name: 'Grishneshwar', place: 'Ellora, Maharashtra',
      story: 'A devotee named Kusuma worshipped Shiva by immersing a linga in a tank each day. Her sister-in-law, jealous, killed Kusuma\u2019s son; Kusuma\u2019s prayer brought him back, and Shiva appeared here.',
      source: 'Shiva Purana; regional Ellora tradition' }
  ];

  var STORIES = [
    { key: 'ganesha', name: 'Why Ganesha has an elephant\u2019s head',
      story: 'Parvati, wanting a guardian of her own, formed a boy from the turmeric paste she had used on her body and set him at her door with instructions to let no one pass. Shiva returned and was refused entry. He cut the boy\u2019s head off. When Parvati\u2019s grief threatened the world, Shiva sent his attendants to bring the head of the first creature they found facing north \u2014 an elephant. The boy was restored and made first among the gods.',
      variants: 'A Maharashtra tradition adds that Shani\u2019s gaze burned the original head away, which is why Shani is propitiated before Ganesha in some households. The Shiv Purana does not include that detail.',
      source: 'Shiva Purana, Rudra Samhita' },
    { key: 'kartikeya', name: 'Kartikeya and the killing of Tarakasura',
      story: 'Tarakasura had a boon that he could only die by a son of Shiva \u2014 and Shiva, in grief after Sati, was in no state to father one. The gods sent Kama to disturb his meditation; Shiva burned him to ash. Later, Shiva\u2019s seed was carried by Agni and deposited in the Ganga, from where it was born among the reeds of the Saravana forest and nursed by the six Krittika sisters. He grew in days, was given command of the divine army, and killed Tarakasura with a spear.',
      variants: 'The number of faces varies by tradition \u2014 six to match the Krittikas in most accounts, though some give one.',
      source: 'Shiva Purana, Rudra Samhita; Mahabharata, Vana Parva' },
    { key: 'hanuman', name: 'Why Hanuman\u2019s jaw is marked',
      story: 'As a child, Hanuman mistook the rising sun for a ripe fruit and leapt to eat it. Indra struck him with the vajra, breaking his jaw \u2014 hanu \u2014 and he fell to earth. Vayu, his father, withdrew the air from the world in grief, and the gods had to revive the child and grant him boons to restore it. The name Hanuman comes from that broken jaw.',
      variants: 'The Ramayana gives this in the Bala Kanda; the detail of which god struck him varies between Valmiki and the later retellings.',
      source: 'Ramayana, Bala Kanda; Valmiki' },
    { key: 'ravana', name: 'Ravana\u2019s ten heads',
      story: 'Ravana performed penance to Brahma and asked for a boon of near-invulnerability. The ten heads are traditionally read as his mastery of the four Vedas and six Shastras \u2014 knowledge rather than monstrosity. His flaw was not stupidity but the belief that knowledge entitled him to anything he wanted, which is what the epic tests.',
      variants: 'The boon, the severed head that regrew each time he offered it, and the interpretation of the ten heads all differ between the Valmiki Ramayana and later regional versions.',
      source: 'Ramayana, Uttara Kanda; regional traditions' },
    { key: 'markandeya', name: 'Markandeya and the defeat of death',
      story: 'Markandeya was granted by Shiva the boon of sixteen years of life and great wisdom. When the sixteenth year ended, Yama came to take him. Markandeya clung to the linga at Tiruvannamalai, and Shiva emerged from it and struck Yama down. Markandeya was granted deathlessness and the vision of the cosmic form.',
      variants: 'The Mritunjaya mantra is the one given in this episode. The age at which Yama came is given variously as sixteen or twenty-five.',
      source: 'Shiva Purana; Linga Purana' },
    { key: 'shani', name: 'Why Shani is propitiated first',
      story: 'Shani, son of Surya, is the slowest-moving graha and the one the tradition associates with consequences arriving on time. The practice of lighting a lamp to Shani on Saturdays before beginning anything is a propitiation \u2014 not worship of harm, but acknowledgement that some things cannot be hurried. The classical texts describe Saturn as the significator of delay and discipline rather than misfortune.',
      variants: 'The idea that Shani must be worshipped before Ganesha is a household custom, strongest in Maharashtra and Gujarat, and is not a classical injunction.',
      source: 'Classical Jyotish; regional custom' }
  ];

  function dayIndex(n) {
    var d = new Date();
    var seed = d.getFullYear() * 372 + (d.getMonth() + 1) * 31 + d.getDate();
    return ((seed % n) + n) % n;
  }

  function render() {
    var host = el('sacredhost');
    if (!host) return;

    var all = JYOTIRLINGA.map(function (j) {
      return { name: j.name, body: j.story, source: j.source, place: j.place };
    }).concat(STORIES.map(function (s) {
      return { name: s.name, body: s.story, source: s.source, place: s.variants };
    }));

    var pick = all[dayIndex(all.length)];

    host.innerHTML =
      '<div class="card" style="border-color:#e8d5a8;background:#fffdf6">' +
      '<h3>Today\u2019s story</h3>' +
      '<div style="font-weight:700;font-size:16px;color:var(--accent);margin-top:4px">' +
      esc(pick.name) + '</div>' +
      (pick.place ? '<div class="muted" style="font-size:12.5px;margin-top:2px">' + esc(pick.place) + '</div>' : '') +
      '<p style="margin-top:8px">' + esc(pick.body) + '</p>' +
      '<p class="muted" style="font-size:12px"><strong>Source:</strong> ' + esc(pick.source) + '</p>' +
      '<p class="muted" style="font-size:12px">A different story appears here each day.</p></div>' +

      '<div class="card"><h3>The twelve Jyotirlingas</h3>' +
      '<p class="muted">The twelve shrines of Shiva named in the Shiva Purana. Each entry gives the place, the account the text records, and the text itself \u2014 so a reader can check it.</p>' +
      JYOTIRLINGA.map(function (j) {
        return '<div style="padding:11px 0;border-bottom:1px solid #eee">' +
          '<div style="font-weight:700;font-size:14.5px;color:var(--accent)">' + j.n + '. ' + esc(j.name) + '</div>' +
          '<div class="muted" style="font-size:12.5px;margin-top:2px">' + esc(j.place) + '</div>' +
          '<div style="margin-top:5px;font-size:13.5px">' + esc(j.story) + '</div>' +
          '<div class="muted" style="font-size:12px;margin-top:4px"><strong>Source:</strong> ' +
          esc(j.source) + '</div></div>';
      }).join('') + '</div>' +

      '<div class="card"><h3>Stories and where they come from</h3>' +
      '<p class="muted">Six accounts that are widely told, each with the text behind it and, where they exist, the variants that differ between regions.</p>' +
      STORIES.map(function (s) {
        return '<div style="padding:11px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:14px">' + esc(s.name) + '</strong>' +
          '<div style="margin-top:5px;font-size:13.5px">' + esc(s.story) + '</div>' +
          '<div class="muted" style="margin-top:5px;font-size:12.5px"><strong>Variants:</strong> ' +
          esc(s.variants) + '</div>' +
          '<div class="muted" style="font-size:12px;margin-top:3px"><strong>Source:</strong> ' +
          esc(s.source) + '</div></div>';
      }).join('') + '</div>' +

      '<div class="card"><h3>On the Shaktipeeths, and on local temple legends</h3>' +
      '<p>The Shaktipeeth lists vary more than most people realise. The classical <em>Pithanirnaya</em> and the Devi Bhagavata give 51; some traditions give 52; popular modern lists often show 12 or 18. The differences are not errors \u2014 different texts count different shrines, and several are in present-day Bangladesh and Pakistan. A single authoritative list does not exist, so none is presented here as definitive.</p>' +
      '<div class="warn"><strong>Why there is no village-by-village temple database here.</strong> Most local temple legends are oral tradition. They are rarely written down, and where they are, the sources are modern devotional booklets or unverifiable pages. Generating them would mean inventing plausible-sounding stories for real places \u2014 which would make this site untrustworthy in exactly the way its calculations are not. For genuine local history the <em>District Gazetteers</em> are the right source: every Indian district has one, they record temples, builders, materials and dates, and many British-era volumes are public domain.</div></div>';
  }

  function attach() {
    var sec = el('shastra') || el('jyotish');
    if (!sec) return;
    var host = el('sacredhost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'sacredhost';
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
