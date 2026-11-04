/* Daily Bodh — conception, pregnancy and birth in the classical texts.
 *
 * What Charaka and Sushruta actually say about garbha (the embryo), the
 * samskaras around pregnancy, and antenatal conduct — described as the tradition
 * it is, alongside where modern medicine has superseded it.
 *
 * It names pumsavana honestly as a male-preference ritual rather than glossing
 * it, because that is what it is and because the surrounding modern practice is
 * illegal in India.
 *
 * Appends to the Ayurveda tab.
 *   <script src="garbha.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  var MONTHS = [
    { m: 1, sk: 'Kalala', says: 'A jelly-like form. The texts describe the union of the two seeds and the entry of the soul as one event.', modern: 'A fertilised egg implants; by week four it is a few millimetres long.' },
    { m: 2, sk: 'Ghana', says: 'A solid mass, the five elements beginning to differentiate.', modern: 'The heart starts beating around week six; limb buds appear.' },
    { m: 3, sk: 'Avayava', says: 'Limbs and the sense organs begin to form. Charaka lists this as the month the embryo becomes recognisably a body.', modern: 'Fingers and toes separate; the embryo is about 3 cm.' },
    { m: 4, sk: 'Vyaktanga', says: 'The limbs become distinct and the heart is said to be established. This is when the pregnancy is traditionally announced.', modern: 'The sex can be seen on ultrasound \u2014 and is legally not to be determined in India.' },
    { m: 5, sk: 'Chetana', says: 'Consciousness is said to enter. Many texts describe the mind becoming present from this month.', modern: 'Movement is felt. This is a claim about the mind, not an observation.' },
    { m: 6, sk: 'Buddhi', says: 'Intellect and the capacity for thought are described as developing.', modern: 'The fetus responds to sound; the lungs are not yet viable.' },
    { m: 7, sk: 'Sarvanga', says: 'All limbs and organs are complete. Considered the point of full formation.', modern: 'Survival outside the womb becomes possible with intensive care.' },
    { m: 8, sk: 'Ojas', says: 'The ojas \u2014 vital essence \u2014 is said to move, and the texts describe this month as unstable. Charaka warns it is the riskiest.', modern: 'Rapid weight gain; the lungs continue maturing.' },
    { m: 9, sk: 'Prasava', says: 'The time of delivery. Charaka describes the fetus turning and the onset of labour.', modern: 'Full term from around week 37.' }
  ];

  var SAMSKARAS = [
    { name: 'Garbhadhana', when: 'At conception', note: 'The ritual of conception itself, described as an act of intention rather than accident. It is the first of the sixteen samskaras.' },
    { name: 'Pumsavana', when: 'Around the third month', note: 'Literally "male-making". A ritual historically performed with the stated aim of a son. It is named plainly here because it is a male-preference rite, and because its modern equivalent \u2014 trying to choose a child\u2019s sex \u2014 is illegal in India.' },
    { name: 'Simantonnayana', when: 'Fourth to seventh month', note: 'The parting of the hair, performed by the husband. The stated purpose is to calm the mother and mark the pregnancy publicly.' },
    { name: 'Jatakarma', when: 'At birth', note: 'The birth rites \u2014 touching the child, whispering a mantra, feeding honey and ghee in some traditions.' },
    { name: 'Namakarana', when: 'Tenth or twelfth day', note: 'The naming ceremony. The naming syllable is traditionally chosen from the child\u2019s birth nakshatra, which this site already computes.' }
  ];

  var CARE = [
    { point: 'Food', note: 'Sushruta advises warm, light, nourishing food, and warns against heavy, stale or excessively hot and dry items. Much of this is ordinary sense; some of it is not.' },
    { point: 'Conduct', note: 'The texts advise against fear, grief and anger, and against lifting heavy things. They also advise pleasant company and gentle activity \u2014 advice no modern clinician would argue with.' },
    { point: 'Rest and sleep', note: 'Adequate sleep is emphasised, with daytime sleeping discouraged after the first months.' },
    { point: 'Monthly review', note: 'Charaka describes examining the mother each month. Whether this was done in practice is unclear, but the intent is recognisably antenatal care.' }
  ];

  function render() {
    var host = el('garbhahost');
    if (!host) return;

    host.innerHTML =
      '<div class="card"><h3>Conception and pregnancy in the classical texts</h3>' +
      '<p>The <strong>Charaka Samhita</strong>, in its Sharira Sthana, devotes a chapter to ' +
      '<em>Garbhavakranti</em> \u2014 the descent of the embryo. The <strong>Sushruta Samhita</strong> ' +
      'covers antenatal conduct. Together they form the oldest continuous Indian writing on the subject.</p>' +
      '<p class="muted">Charaka describes the embryo as formed from four contributions: from the mother, ' +
      'from the father, from the soul, and from nutrition. That fourfold frame is the tradition\u2019s, ' +
      'and it is worth knowing before the month-by-month account below.</p>' +
      '<div class="warn"><strong>This is a description of a historical system, not medical guidance.</strong> ' +
      'Pregnancy care in the classical texts predates germ theory, ultrasound and blood testing by two ' +
      'thousand years. Modern antenatal care \u2014 scans, blood pressure, iron and folic acid, glucose ' +
      'testing, skilled attendance at birth \u2014 is what actually saves mothers and babies. Nothing here ' +
      'replaces it.</div></div>' +

      '<div class="card"><h3>The nine months, as Charaka describes them</h3>' +
      '<p class="muted">Each row gives the classical account, then what is actually known now. Where ' +
      'they disagree, the modern column is the one to trust.</p>' +
      MONTHS.map(function (x) {
        return '<div style="padding:10px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:13.5px;color:var(--accent)">Month ' + x.m + ' \u00b7 ' +
          esc(x.sk) + '</strong>' +
          '<div style="margin-top:4px;font-size:13.5px">' + esc(x.says) + '</div>' +
          '<div class="muted" style="margin-top:3px;font-size:12.5px"><strong>Now:</strong> ' +
          esc(x.modern) + '</div></div>';
      }).join('') +
      '<p class="muted" style="margin-top:10px">Charaka\u2019s month-by-month progression \u2014 jelly, ' +
      'then mass, then limbs, then organs \u2014 is a genuine observation and roughly correct. His ' +
      'account of consciousness entering in month five is not an observation and cannot be tested.</p></div>' +

      '<div class="card"><h3>The samskaras around birth</h3>' +
      SAMSKARAS.map(function (s) {
        return '<div style="padding:9px 0;border-bottom:1px solid #eee">' +
          '<strong style="font-size:13.5px">' + esc(s.name) + '</strong>' +
          '<span class="muted" style="font-size:12.5px"> \u2014 ' + esc(s.when) + '</span>' +
          '<div style="font-size:13px;margin-top:3px">' + esc(s.note) + '</div></div>';
      }).join('') +
      '<div class="warn">On <strong>pumsavana</strong>: it is a real historical ritual, and it is ' +
      'male-preference. Modern attempts to choose a child\u2019s sex are not merely unscientific \u2014 ' +
      'they are illegal in India under the PCPNDT Act, 1994, and they sit inside a documented harm: ' +
      'the child sex ratio fell from 962 girls per 1,000 boys in 1981 to 919 in 2011. The tradition is ' +
      'recorded here as history. It is not offered as method.</div></div>' +

      '<div class="card"><h3>Antenatal conduct in Sushruta</h3>' +
      CARE.map(function (c) {
        return '<div style="padding:8px 0;border-bottom:1px solid #f2f0f6">' +
          '<strong style="font-size:13.5px">' + esc(c.point) + '</strong><br>' +
          '<span class="muted" style="font-size:12.5px">' + esc(c.note) + '</span></div>';
      }).join('') + '</div>' +

      '<div class="card"><h3>What the tradition got right, and what it could not know</h3>' +
      '<p><strong>Right, in substance:</strong> that the fetus develops in stages rather than arriving ' +
      'complete; that the mother\u2019s nutrition matters; that fear and grief affect a pregnancy; that ' +
      'the first and eighth months carry particular risk; that antenatal attention should be regular.</p>' +
      '<p><strong>Could not know:</strong> genetics, infection, blood pressure, gestational diabetes, ' +
      'the anatomy of the placenta, or that a child\u2019s sex is set by the father\u2019s sperm. ' +
      'Classical Indian embryology assumed both parents contributed "seed" and that their relative ' +
      'strength decided the sex \u2014 a reasonable guess for its time, and wrong.</p>' +
      '<div class="warn">If you are pregnant or trying to conceive, the useful thing is a doctor and a ' +
      'midwife, not a chapter of Charaka. This page exists so you know what the tradition says \u2014 ' +
      'not so you act on it in place of care that works.</div></div>';
  }

  function attach() {
    var sec = el('ayurveda') || el('jyotish');
    if (!sec) return;
    var host = el('garbhahost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'garbhahost';
      sec.appendChild(host);
    }
    if (!host.innerHTML.trim()) render();
  }

  function boot() {
    var tries = 0;
    var iv = setInterval(function () {
      if (el('ayurveda') || el('jyotish')) { attach(); clearInterval(iv); }
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
