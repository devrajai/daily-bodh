/* Daily Bodh — historical Indian UTC offset.
 *
 * The birth time on the Kundli screen is a local clock reading, and the chart
 * needs a UTC offset to turn it into a Julian Day. That offset has NOT always
 * been +5:30, and assuming it is puts older charts in the wrong house.
 *
 * The offsets below are read from the IANA tzdata (Asia/Kolkata) and were
 * produced by the same code run twice - once here and once in Colab - with
 * identical output. Exact instants, to the minute:
 *
 *   1905-12-31 18:39 UTC   +5:21:10  -> +5:30   IST adopted
 *   1941-09-30 18:30 UTC   +5:30     -> +6:30   war time begins
 *   1942-05-14 17:30 UTC   +6:30     -> +5:30
 *   1942-08-31 18:30 UTC   +5:30     -> +6:30
 *   1945-10-14 17:30 UTC   +6:30     -> +5:30   war time ends
 *
 * The war-time year matters most: a birth in 1943 read as +5:30 is an hour out,
 * which moves the ascendant by roughly a whole sign.
 *
 * This module only FILLS the existing "UTC offset" field on the Kundli screen.
 * It does not change any calculation. Clear the field or edit it and the site
 * behaves exactly as before.
 *
 *   <script src="timezone.js"></script>
 */
(function () {
  'use strict';

  /* [from UTC instant, offset hours] — first entry before 1905 is Kolkata's
     local mean time; for other places before 1906 the caller should use
     longitude / 15 instead. */
  var STEPS = [
    ['-inf',                5 + 21 / 60 + 10 / 3600],
    ['1905-12-31T18:39:00Z', 5.5],
    ['1941-09-30T18:30:00Z', 6.5],
    ['1942-05-14T17:30:00Z', 5.5],
    ['1942-08-31T18:30:00Z', 6.5],
    ['1945-10-14T17:30:00Z', 5.5]
  ];

  function el(id) { return document.getElementById(id); }

  /* Offset in hours for a local birth date/time and the place's longitude. */
  function offsetFor(dateStr, timeStr, lon) {
    if (!dateStr) return null;
    var d = new Date(dateStr + 'T' + (timeStr || '12:00') + ':00');
    if (isNaN(d)) return null;

    // Before IST, local mean time applied: longitude / 15 hours.
    if (dateStr < '1906-01-01') {
      if (typeof lon === 'number' && !isNaN(lon)) {
        return { hours: lon / 15, note: 'local mean time before 1906 (longitude / 15)' };
      }
      return { hours: 5 + 21 / 60 + 10 / 3600, note: 'Kolkata local mean time before 1906' };
    }

    // Otherwise take the last step whose instant is at or before the birth,
    // allowing for the offset itself (the stored instants are in UTC).
    var best = STEPS[1];
    for (var i = 1; i < STEPS.length; i++) {
      var utc = new Date(STEPS[i][0]);
      // the local clock reading minus the offset is the UTC instant
      var asUtc = new Date(d.getTime() - STEPS[i][1] * 3600e3);
      if (asUtc >= utc) best = STEPS[i];
    }
    var note = best[1] === 6.5
      ? 'India ran an hour ahead (war time) from 1941 to 1945'
      : 'Indian Standard Time';
    return { hours: best[1], note: note };
  }

  function place() {
    try { if (typeof PSEL !== 'undefined' && PSEL) return PSEL; } catch (e) {}
    return null;
  }

  function apply() {
    var kd = el('kd'), kt = el('kt'), ko = el('ko');
    if (!kd || !ko) return;
    if (kd.dataset && kd.dataset.tzManual === '1') return;  // the reader has overridden it

    var p = place();
    var r = offsetFor(kd.value, kt ? kt.value : '12:00', p ? p.lon : null);
    if (!r) return;

    var next = String(Math.round(r.hours * 100) / 100);
    if (ko.value !== next) ko.value = next;

    var note = el('tznote');
    if (!note) {
      note = document.createElement('div');
      note.id = 'tznote';
      note.className = 'muted';
      note.style.cssText = 'font-size:12px;margin-top:4px';
      ko.parentNode.appendChild(note);
    }
    note.innerHTML = 'Set from the birth date: <strong>' + next + '</strong> hours &mdash; ' +
      r.note + '. <a href="#" id="tzedit" style="color:var(--accent)">edit</a>';
    var ed = el('tzedit');
    if (ed) ed.onclick = function (e) {
      e.preventDefault();
      ko.dataset.tzManual = '1';
      note.innerHTML = 'Using your own value. <a href="#" id="tzreset" ' +
        'style="color:var(--accent)">reset</a>';
      var rs = el('tzreset');
      if (rs) rs.onclick = function (ev) {
        ev.preventDefault();
        delete ko.dataset.tzManual;
        apply();
      };
    };
  }

  function boot() {
    // The Kundli screen is built on demand, so watch for its inputs appearing.
    document.addEventListener('change', function (e) {
      if (e.target && (e.target.id === 'kd' || e.target.id === 'kt')) setTimeout(apply, 0);
    }, true);
    document.addEventListener('input', function (e) {
      if (e.target && (e.target.id === 'kd' || e.target.id === 'kt')) setTimeout(apply, 0);
    }, true);
    var tries = 0;
    var iv = setInterval(function () {
      if (el('ko')) { apply(); clearInterval(iv); }
      else if (++tries > 40) clearInterval(iv);
    }, 250);
    window.addEventListener('hashchange', function () { setTimeout(apply, 120); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
