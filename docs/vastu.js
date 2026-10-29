/* Daily Bodh — Vastu Shastra.
 *
 * A reference for the eight directions, the five element zones and the usual
 * room placement, plus a picker so you can read one direction at a time.
 *
 * Registers its own tab, so index.html needs one line:
 *   <script src="vastu.js"></script>
 *
 * Everything here is the tradition's own scheme. It is not engineering, not
 * structural advice, and not a claim that a room's position changes a life.
 * Schools genuinely differ - north Indian and south Indian Vastu disagree on
 * several placements - so each entry notes where practice varies.
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  /* The eight directions with their presiding deity, element and the rooms the
     tradition puts there. "Good" and "avoid" are the usual recommendations, not
     absolutes. */
  var DIRS = [
    {
      key: 'N', name: 'North', skt: 'Uttara', lord: 'Kubera', element: 'Water (Jal)',
      governs: 'Wealth, opportunity, career',
      good: ['Living room', 'Safe or locker (opening north or east)', 'Water source', 'Main door'],
      avoid: ['Kitchen', 'Toilet', 'Heavy storage', 'Staircase'],
      note: 'Kubera, the lord of wealth, sits in the north. A north opening or a safe here is the classical placement for money.'
    },
    {
      key: 'NE', name: 'North-East', skt: 'Ishanya', lord: 'Ishvara (Shiva)', element: 'Water (Jal)',
      governs: 'Spirituality, health, clarity',
      good: ['Puja or prayer room', 'Water tank or well', 'Meditation space', 'Study'],
      avoid: ['Kitchen', 'Toilet', 'Master bedroom', 'Staircase', 'Heavy storage'],
      note: 'The most sensitive corner in Vastu. It should be light, open and clean; almost every school agrees the toilet and kitchen must not be here.'
    },
    {
      key: 'E', name: 'East', skt: 'Purva', lord: 'Indra', element: 'Air (Vayu)',
      governs: 'Growth, health, social standing',
      good: ['Main door', 'Living room', 'Study', 'Bathroom', 'Open windows'],
      avoid: ['Heavy storage', 'Toilet in the corner', 'Kitchen'],
      note: 'The rising sun. East openings are favoured for the main door and for rooms used in the morning.'
    },
    {
      key: 'SE', name: 'South-East', skt: 'Agneya', lord: 'Agni', element: 'Fire (Agni)',
      governs: 'Energy, digestion, finance',
      good: ['Kitchen', 'Electrical equipment', 'Fireplace', 'Geyser'],
      avoid: ['Water tank', 'Puja room', 'Master bedroom', 'Toilet'],
      note: 'The fire corner. The kitchen belongs here in most schools; a water source in the fire zone is the classic conflict to avoid.'
    },
    {
      key: 'S', name: 'South', skt: 'Dakshina', lord: 'Yama', element: 'Earth and Fire',
      governs: 'Fame, ancestors, rest',
      good: ['Storage', 'Staircase', 'Heavy furniture', 'Bedroom (not the master)'],
      avoid: ['Main door', 'Water source', 'Puja room', 'Openings'],
      note: 'Yama governs the south. It is a direction for weight and storage rather than for entrances.'
    },
    {
      key: 'SW', name: 'South-West', skt: 'Nairutya', lord: 'Nairutya (Pitru)', element: 'Earth (Prithvi)',
      governs: 'Stability, relationships, lineage',
      good: ['Master bedroom', 'Heavy storage', 'Safe', 'Load-bearing walls'],
      avoid: ['Toilet', 'Water tank', 'Kitchen', 'Main door', 'Staircase'],
      note: 'The heaviest corner, and the one the tradition gives to the head of the household. Weight here is said to steady the house.'
    },
    {
      key: 'W', name: 'West', skt: 'Paschima', lord: 'Varuna', element: 'Water (Jal)',
      governs: 'Gains, expenditure, completion',
      good: ['Dining room', "Children's room", 'Toilet', 'Storage of grain'],
      avoid: ['Puja room', 'Heavy storage', 'Main door'],
      note: 'Varuna governs water and the west. Dining and children\u2019s rooms are commonly placed here.'
    },
    {
      key: 'NW', name: 'North-West', skt: 'Vayavya', lord: 'Vayu', element: 'Air (Vayu)',
      governs: 'Movement, support, guests',
      good: ['Guest room', 'Bathroom', 'Toilet', 'Store for grain', 'Garage'],
      avoid: ['Kitchen', 'Puja room', 'Master bedroom', 'Safe'],
      note: 'The air corner, associated with movement. Guests, bathrooms and vehicles sit here in most schools.'
    }
  ];

  var CENTRE = {
    name: 'Centre', skt: 'Brahmasthan',
    text: 'The middle of the plot is left open in Vastu — no pillar, no staircase, no toilet, no heavy load. ' +
      'It is the Brahmasthan, the space the whole plan is arranged around. Modern construction often puts a ' +
      'staircase or a bathroom here, which is the single most common conflict a Vastu reading will point out.'
  };

  var ELEMENTS = [
    ['Water (Jal)', 'North-East', 'Purity, flow, wisdom'],
    ['Fire (Agni)', 'South-East', 'Energy, transformation, digestion'],
    ['Earth (Prithvi)', 'South-West', 'Stability, weight, foundation'],
    ['Air (Vayu)', 'North-West', 'Movement, breath, change'],
    ['Space (Akash)', 'Centre', 'Openness, the whole']
  ];

  function card(d, open) {
    return '<div class="card" data-dir="' + d.key + '">' +
      '<h3>' + esc(d.name) + ' <span class="muted" style="font-weight:400;font-size:13px">' +
      esc(d.skt) + ' &middot; ' + esc(d.lord) + ' &middot; ' + esc(d.element) + '</span></h3>' +
      '<p class="muted" style="margin:0 0 8px">Governs ' + esc(d.governs.toLowerCase()) + '.</p>' +
      '<table>' +
      '<tr><td class="k" style="width:26%">Put here</td><td>' +
        d.good.map(function (g) { return '<span class="pill">' + esc(g) + '</span>'; }).join('') + '</td></tr>' +
      '<tr><td class="k">Avoid</td><td>' +
        d.avoid.map(function (g) {
          return '<span class="pill" style="background:#fbe9e9;color:#8c2f2f">' + esc(g) + '</span>';
        }).join('') + '</td></tr>' +
      '</table>' +
      '<p class="muted" style="margin-top:8px">' + esc(d.note) + '</p>' +
      '</div>';
  }

  function render() {
    var s = el('vastu');
    if (!s) return;
    if (s.dataset.built) return;
    s.dataset.built = '1';

    var picker = '<div class="chips" id="vchips">' +
      DIRS.map(function (d, i) {
        return '<button class="chip" data-v="' + i + '" aria-pressed="' + (i === 0) + '">' +
          esc(d.name) + '</button>';
      }).join('') + '</div>';

    var all = DIRS.map(function (d) { return card(d); }).join('');

    var rooms = [
      ['Puja / prayer', 'North-East', 'The most consistent rule in Vastu across schools'],
      ['Kitchen', 'South-East', 'Agni, the fire corner'],
      ['Master bedroom', 'South-West', 'Weight and stability; the head of the household'],
      ["Children's room", 'West or North-West', ''],
      ['Bathroom / toilet', 'North-West or West', 'Never in the north-east'],
      ['Living room', 'North, East or North-East', ''],
      ['Study', 'North-East, East or North', ''],
      ['Safe / locker', 'South-West, opening north or east', 'Some schools put it in the north instead'],
      ['Water tank / borewell', 'North-East or North', 'Never in the south-west or south-east'],
      ['Staircase', 'South, West or South-West', 'Never in the north-east or the centre'],
      ['Septic tank', 'North-West or West', ''],
      ['Main door', 'North, East or North-East', 'Avoid south-west and south']
    ];

    s.innerHTML =
      '<h2>Vastu <span class="muted" style="font-size:14px;font-weight:400">(placement reference)</span></h2>' +
      '<p class="lead">The eight directions, their presiding deities and element zones, and where the ' +
      'tradition places each room. This is the classical scheme, not engineering advice.</p>' +
      '<div class="card"><h3>Read one direction</h3>' + picker +
      '<div id="vone" style="margin-top:10px"></div></div>' +
      '<div class="card"><h3>Room placement</h3><table>' +
      rooms.map(function (r) {
        return '<tr><td class="k" style="width:34%">' + esc(r[0]) + '</td><td><strong>' +
          esc(r[1]) + '</strong>' + (r[2] ? ' <span class="muted">&mdash; ' + esc(r[2]) + '</span>' : '') +
          '</td></tr>';
      }).join('') + '</table></div>' +
      '<div class="card"><h3>The five element zones</h3><table>' +
      ELEMENTS.map(function (e) {
        return '<tr><td class="k" style="width:34%">' + esc(e[0]) + '</td><td><strong>' +
          esc(e[1]) + '</strong> <span class="muted">&mdash; ' + esc(e[2]) + '</span></td></tr>';
      }).join('') + '</table></div>' +
      '<div class="card"><h3>' + esc(CENTRE.name) + ' &middot; ' + esc(CENTRE.skt) + '</h3>' +
      '<p>' + esc(CENTRE.text) + '</p></div>' +
      '<div class="card"><h3>All eight directions</h3></div>' + all +
      '<div class="warn">Vastu Shastra is a classical Indian shastra with its own texts and reasoning, ' +
      'and it is a different order of knowledge from structural engineering. Schools disagree on several ' +
      'placements &mdash; north Indian and south Indian Vastu differ, and some traditions weight the ' +
      'plot\u2019s shape and slope above room position. Nothing here is a substitute for a structural ' +
      'engineer, an architect, or a Vastu practitioner who has actually seen the plot.</div>';

    var one = el('vone');
    function showDir(i) {
      one.innerHTML = card(DIRS[i]);
      Array.prototype.forEach.call(el('vchips').querySelectorAll('[data-v]'), function (b) {
        b.setAttribute('aria-pressed', String(+b.dataset.v === i));
      });
    }
    Array.prototype.forEach.call(el('vchips').querySelectorAll('[data-v]'), function (b) {
      b.onclick = function () { showDir(+b.dataset.v); };
    });
    showDir(0);
  }

  function mount() {
    var main = document.querySelector('main');
    if (!main || el('vastu')) return;
    var s = document.createElement('section');
    s.id = 'vastu';
    s.setAttribute('role', 'tabpanel');
    s.setAttribute('tabindex', '0');
    main.appendChild(s);

    if (typeof TABS !== 'undefined' && Array.isArray(TABS)) {
      // Place it after Jyotish, before Reading, so the reading material stays last.
      var at = TABS.findIndex(function (t) { return t[0] === 'reading'; });
      if (at < 0) at = TABS.length;
      TABS.splice(at, 0, ['vastu', 'Vastu', render]);
      var tabs = el('tabs');
      if (tabs) {
        tabs.innerHTML = TABS.map(function (t) {
          return '<button data-t="' + t[0] + '" role="tab" aria-controls="' + t[0] + '">' +
            t[1] + '</button>';
        }).join('');
        Array.prototype.forEach.call(tabs.querySelectorAll('button'), function (b) {
          b.onclick = function () { show(b.dataset.t); };
        });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
