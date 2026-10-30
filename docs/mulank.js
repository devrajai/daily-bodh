/* Daily Bodh — Mulank reference: pick a number, read the whole thing.
 *
 * If you already know your mulank you should not have to enter a birth date to
 * read about it. This adds a 1-9 picker to the Numerology tab and shows the
 * full entry for the number you choose.
 *
 * Only APPENDS to the Numerology tab. Remove this file and its tag and the
 * screen is exactly as it was.
 *
 *   <script src="mulank.js"></script>
 *
 * Content follows the Cheiro system (public domain, d. 1936) with the Indian
 * planetary correspondences - 4 is Rahu and 7 is Ketu, where Cheiro used Uranus
 * and Neptune. Strengths and weaknesses are the tradition's characterisation,
 * not a claim about any person.
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  var NUMBERS = [
    {
      n: 1, planet: 'Sun', day: 'Sunday', colour: 'Red and gold', direction: 'East',
      dates: '1, 10, 19, 28', element: 'Fire', gem: 'Ruby (traditional)',
      core: 'The individual. Self, will, beginnings.',
      strengths: ['Pioneering — starts what others only discuss', 'Original thinking, not derivative',
                  'Courageous under pressure', 'Natural authority without being taught'],
      weaknesses: ['Domineering; takes over without noticing', 'Egotism dressed as conviction',
                   'Stubborn once committed, even when wrong', 'Poor at taking orders'],
      career: 'Founder, leader, surgeon, officer, anything where one person is accountable.',
      relations: 'Loyal but needs to be central. Struggles to share the front seat.',
      note: 'The Sun does not negotiate. A 1 who learns to ask rather than declare goes far.'
    },
    {
      n: 2, planet: 'Moon', day: 'Monday', colour: 'White and silver', direction: 'North-West',
      dates: '2, 11, 20, 29', element: 'Water', gem: 'Pearl (traditional)',
      core: 'The partner. Sensitivity, intuition, reflection.',
      strengths: ['Reads a room before anyone speaks', 'Diplomatic; finds the third option',
                  'Genuinely good at supporting others', 'Patient and receptive'],
      weaknesses: ['Indecisive; waits for a signal that never comes', 'Mood that shifts with the tide',
                   'Over-dependent on approval', 'Takes on others\' feelings as their own'],
      career: 'Counsellor, teacher, nurse, diplomat, mediator, researcher.',
      relations: 'Deeply devoted. The risk is losing the self inside the partnership.',
      note: 'The Moon has no light of its own — and does not need any. Reflection is the gift.'
    },
    {
      n: 3, planet: 'Jupiter', day: 'Thursday', colour: 'Yellow', direction: 'North-East',
      dates: '3, 12, 21, 30', element: 'Ether', gem: 'Yellow sapphire (traditional)',
      core: 'The expresser. Creativity, joy, teaching.',
      strengths: ['Communicates easily and warmly', 'Optimistic; lifts a room',
                  'Artistic and inventive', 'Generous with knowledge'],
      weaknesses: ['Scattered across too many interests', 'Extravagant with money and promises',
                   'Superficial when bored', 'Avoids the unglamorous work'],
      career: 'Writer, teacher, performer, designer, advertiser, anything visible.',
      relations: 'Warm and sociable. Needs a partner who tolerates a wide circle of friends.',
      note: 'Jupiter is the teacher. A 3 who finishes one thing beats one who starts ten.'
    },
    {
      n: 4, planet: 'Rahu', day: 'Saturday', colour: 'Blue and grey', direction: 'South-West',
      dates: '4, 13, 22, 31', element: 'Air', gem: 'Hessonite (traditional)',
      core: 'The builder. Structure, method, endurance.',
      strengths: ['Systematic; builds what lasts', 'Reliable to a fault',
                  'Unusual, non-obvious solutions', 'Works when others have stopped'],
      weaknesses: ['Rigid; mistakes the method for the goal', 'Secretive about motives',
                   'Rebellious against authority it did not choose', 'Prone to sudden reversals'],
      career: 'Engineer, architect, auditor, administrator, anything technical.',
      relations: 'Steady but hard to read. Trust is given slowly and withdrawn suddenly.',
      note: 'Rahu is the eclipse — unconventional by nature. Structure is the remedy, not the cage.'
    },
    {
      n: 5, planet: 'Mercury', day: 'Wednesday', colour: 'Green', direction: 'North',
      dates: '5, 14, 23', element: 'Earth', gem: 'Emerald (traditional)',
      core: 'The communicator. Change, movement, freedom.',
      strengths: ['Quick, versatile, learns fast', 'Talks to anyone about anything',
                  'Adapts when plans collapse', 'Sees the commercial angle'],
      weaknesses: ['Restless; leaves before finishing', 'Impulsive with words and money',
                   'Unreliable when bored', 'Nervous energy mistaken for progress'],
      career: 'Sales, trade, journalism, teaching, travel, brokering.',
      relations: 'Fun and attentive early, then needs air. Possessiveness kills it.',
      note: 'Mercury is the messenger, not the message. Depth is the discipline a 5 lacks.'
    },
    {
      n: 6, planet: 'Venus', day: 'Friday', colour: 'White and pink', direction: 'South-East',
      dates: '6, 15, 24', element: 'Water', gem: 'Diamond (traditional)',
      core: 'The carer. Home, love, responsibility.',
      strengths: ['Genuinely nurturing; people come to them', 'Aesthetic sense in all things',
                  'Takes responsibility for family without being asked', 'Harmonises conflict'],
      weaknesses: ['Possessive of the people they care for', 'Self-righteous about their sacrifices',
                   'Overbearing under the name of love', 'Perfectionism about the home'],
      career: 'Medicine, teaching, hospitality, design, counselling, family business.',
      relations: 'The centre of their world. The risk is loving people into a cage.',
      note: 'Venus rules both love and beauty. A 6 who gives without an invoice is unbeatable.'
    },
    {
      n: 7, planet: 'Ketu', day: 'Monday', colour: 'Grey and white', direction: 'South-West',
      dates: '7, 16, 25', element: 'Air', gem: 'Cat\'s eye (traditional)',
      core: 'The seeker. Analysis, solitude, the unseen.',
      strengths: ['Analytical to a rare depth', 'Original; distrusts received opinion',
                  'Comfortable alone', 'Draws conclusions others miss'],
      weaknesses: ['Aloof; leaves people feeling shut out', 'Secretive to the point of suspicion',
                   'Sceptical of everything, including good advice', 'Detached when presence is needed'],
      career: 'Research, philosophy, science, analysis, writing, spiritual teaching.',
      relations: 'Needs solitude a partner must not read as rejection.',
      note: 'Ketu is the severed head — already past what others are still learning. Loneliness is the price.'
    },
    {
      n: 8, planet: 'Saturn', day: 'Saturday', colour: 'Black and dark blue', direction: 'West',
      dates: '8, 17, 26', element: 'Earth', gem: 'Blue sapphire (traditional)',
      core: 'The administrator. Power, material outcome, consequence.',
      strengths: ['Ambitious and disciplined', 'Resilient; survives what breaks others',
                  'Handles money and authority', 'Sees the long game'],
      weaknesses: ['Cold when warmth is what is needed', 'Harsh self-judgement',
                   'Workaholic; confuses worth with output', 'Slow to forgive'],
      career: 'Finance, law, management, property, politics, anything with scale.',
      relations: 'Shows love through provision rather than presence.',
      note: 'Saturn rewards slowly and exactly. An 8 in a hurry suffers; an 8 who waits, rarely does.'
    },
    {
      n: 9, planet: 'Mars', day: 'Tuesday', colour: 'Red', direction: 'South',
      dates: '9, 18, 27', element: 'Fire', gem: 'Red coral (traditional)',
      core: 'The finisher. Energy, completion, service to something larger.',
      strengths: ['Courageous; moves when others hesitate', 'Generous with energy and money',
                  'Driven by a cause, not just a goal', 'Completes what a 1 began'],
      weaknesses: ['Aggressive when frustrated', 'Impatient with process',
                   'Burns out without noticing', 'Fights battles that are not theirs'],
      career: 'Military, surgery, sport, engineering, emergency services, social reform.',
      relations: 'Passionate and protective. Anger arrives before thought.',
      note: 'Mars ends the cycle and starts the next. A 9 without a cause is a fire with no hearth.'
    }
  ];

  function list(arr) {
    return '<ul style="margin:4px 0 0;padding-left:18px">' +
      arr.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
  }

  function card(d) {
    return '<div class="card" id="mulankcard">' +
      '<h3>Mulank ' + d.n + ' <span class="muted" style="font-weight:400;font-size:13px">' +
      esc(d.planet) + ' &middot; ' + esc(d.element) + '</span></h3>' +
      '<p class="muted" style="margin:0 0 10px">' + esc(d.core) + '</p>' +
      '<table>' +
      '<tr><td class="k" style="width:30%">Ruling planet</td><td><strong>' + esc(d.planet) + '</strong></td></tr>' +
      '<tr><td class="k">Day</td><td>' + esc(d.day) + '</td></tr>' +
      '<tr><td class="k">Colour</td><td>' + esc(d.colour) + '</td></tr>' +
      '<tr><td class="k">Direction</td><td>' + esc(d.direction) + '</td></tr>' +
      '<tr><td class="k">Favourable dates</td><td>' + esc(d.dates) + '</td></tr>' +
      '<tr><td class="k">Gem (traditional)</td><td>' + esc(d.gem) + '</td></tr>' +
      '</table>' +
      '<p style="margin-top:12px"><strong style="color:var(--good)">Strengths</strong></p>' + list(d.strengths) +
      '<p style="margin-top:12px"><strong style="color:var(--bad)">Weaknesses</strong></p>' + list(d.weaknesses) +
      '<p style="margin-top:12px"><strong>Career</strong><br><span class="muted">' + esc(d.career) + '</span></p>' +
      '<p><strong>Relationships</strong><br><span class="muted">' + esc(d.relations) + '</span></p>' +
      '<div class="warn">' + esc(d.note) + '</div>' +
      '</div>';
  }

  function render() {
    var host = el('mulankhost');
    if (!host) return;

    var chips = '<div class="chips" id="mchips">' +
      NUMBERS.map(function (d, i) {
        return '<button class="chip" data-m="' + i + '" aria-pressed="' + (i === 0) + '">' +
          d.n + '</button>';
      }).join('') + '</div>';

    host.innerHTML =
      '<div class="card"><h3>Know your number? Read it directly</h3>' +
      '<p class="muted">Pick your mulank and read the whole entry. You do not need to enter a birth date.</p>' +
      chips + '<div id="mone" style="margin-top:12px"></div></div>';

    function show(i) {
      el('mone').innerHTML = card(NUMBERS[i]);
      Array.prototype.forEach.call(el('mchips').querySelectorAll('[data-m]'), function (b) {
        b.setAttribute('aria-pressed', String(+b.dataset.m === i));
      });
    }
    Array.prototype.forEach.call(el('mchips').querySelectorAll('[data-m]'), function (b) {
      b.onclick = function () { show(+b.dataset.m); };
    });
    show(0);
  }

  function attach() {
    var sec = el('numerology');
    if (!sec) return;
    var host = el('mulankhost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'mulankhost';
      sec.appendChild(host);
    }
    if (!host.innerHTML.trim()) render();
  }

  function boot() {
    attach();
    // the Numerology tab builds itself on first visit, so keep checking briefly
    var tries = 0;
    var iv = setInterval(function () {
      attach();
      if (el('mulankhost') && el('mulankhost').innerHTML.trim()) clearInterval(iv);
      else if (++tries > 40) clearInterval(iv);
    }, 250);
    window.addEventListener('hashchange', function () { setTimeout(attach, 150); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
