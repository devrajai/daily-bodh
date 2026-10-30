/* Daily Bodh — advanced numerology.
 *
 * Reads data/numerology-advanced.json (32 KB) and shows eight further sections
 * that were not on the site before:
 *
 *   arrows      the eight Lo Shu planes, filled and empty
 *   karmic      the four karmic-debt lessons
 *   challenges  the nine challenge numbers
 *   triad       number triads
 *   yearDeep    the personal year, in depth
 *   dailyTip    a daily practice per number
 *   gemVastu    gemstone and vastu notes
 *   angel       angel numbers
 *
 * Angel numbers are flagged as a modern practice rather than classical, because
 * they are - they date from the 2000s and are not in Cheiro or the Indian texts.
 *
 * Only APPENDS to the Numerology tab.
 *   <script src="numerology-advanced.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }
  function t(v) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    if (Array.isArray(v)) return v.map(t).join(' ');
    return v.en || '';
  }

  var DATA = null;

  function load() {
    if (DATA) return Promise.resolve(DATA);
    return fetch('data/numerology-advanced.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (j) { DATA = j; return j; });
  }

  function section(title, note, body) {
    return '<div class="card"><h3>' + esc(title) + '</h3>' +
      (note ? '<p class="muted">' + esc(note) + '</p>' : '') + body + '</div>';
  }

  function rows(obj, render) {
    return Object.keys(obj).map(function (k) { return render(k, obj[k]); }).join('');
  }

  /* One entry may be a plain string, an {en,hi} pair, or an object of named
     sub-fields (triad, yearDeep and gemVastu are all shaped that way). */
  function entryBody(v) {
    if (v == null) return '';
    if (typeof v === 'string') return esc(v);
    if (typeof v !== 'object') return esc(String(v));
    if (v.en || v.hi) return esc(t(v));
    return Object.keys(v).map(function (k) {
      var sub = t(v[k]);
      if (!sub) return '';
      return '<div style="margin-top:4px"><span class="muted" style="text-transform:capitalize">' +
        esc(k) + ':</span> ' + esc(sub) + '</div>';
    }).join('');
  }

  function render() {
    var host = el('advhost');
    if (!host) return;
    var J = DATA;
    if (!J) return;

    var out = '';

    /* Lo Shu arrows / planes */
    if (J.arrows) {
      out += section('Lo Shu planes',
        'The eight lines of the three-by-three grid. A line is read from the numbers present on it, and the same line empty has its own meaning.',
        rows(J.arrows, function (k, v) {
          var name = t(v.name), full = t(v.full), empty = t(v.empty);
          return '<div style="padding:9px 0;border-bottom:1px solid #eee">' +
            '<strong>' + esc(name) + '</strong> <span class="muted" style="font-size:12px">' +
            esc(k) + '</span><br>' +
            '<span>' + esc(full) + '</span>' +
            (empty ? '<br><span class="muted">Empty: ' + esc(empty) + '</span>' : '') +
            '</div>';
        }));
    }

    /* Karmic debts */
    if (J.karmic) {
      out += section('Karmic lessons',
        'The four numbers the tradition calls debts. Each is framed as a lesson to work with, not a punishment.',
        rows(J.karmic, function (k, v) {
          return '<div style="padding:9px 0;border-bottom:1px solid #eee">' +
            '<strong>' + esc(t(v.name)) + '</strong><br>' +
            '<span class="muted">' + esc(t(v.lesson)) + '</span></div>';
        }));
    }

    /* Challenges */
    if (J.challenges) {
      out += section('Challenge numbers',
        'The obstacle each number tends to meet.',
        rows(J.challenges, function (k, v) {
          return '<div style="padding:7px 0;border-bottom:1px solid #f0f0f0">' +
            '<strong>' + esc(k) + '</strong> &mdash; <span class="muted">' + esc(t(v)) + '</span></div>';
        }));
    }

    /* Triads */
    if (J.triad) {
      out += section('Triads', 'Numbers that work as a group of three.',
        rows(J.triad, function (k, v) {
            '<strong>' + esc(k) + '</strong>' + entryBody(v) + '</div>';
        }));
    }

    /* Personal year in depth */
    if (J.yearDeep) {
      out += section('Personal year in depth',
        'The same nine-year cycle, with more on what each year asks of you.',
        rows(J.yearDeep, function (k, v) {
            '<strong>' + esc(k) + '</strong>' + entryBody(v) + '</div>';
        }));
    }

    /* Daily tips */
    if (J.dailyTip) {
      out += section('A daily practice for each number',
        'One small thing to do, matched to the number.',
        rows(J.dailyTip, function (k, v) {
          return '<div style="padding:7px 0;border-bottom:1px solid #f0f0f0">' +
            '<strong>' + esc(k) + '</strong> &mdash; <span class="muted">' + esc(t(v)) + '</span></div>';
        }));
    }

    /* Gem and vastu */
    if (J.gemVastu) {
      out += section('Gemstone and vastu notes',
        'Traditional correspondences only. Gems are expensive and are not a substitute for anything - treat these as the tradition records them, not as advice to buy.',
        rows(J.gemVastu, function (k, v) {
            '<strong>' + esc(k) + '</strong>' + entryBody(v) + '</div>';
        }));
    }

    /* Angel numbers */
    if (J.angel) {
      out += section('Angel numbers',
        'A modern popular practice, not part of classical numerology - it dates from the 2000s and appears in neither Cheiro nor the Indian texts. Included because people ask about it, and labelled so you know what it is.',
        rows(J.angel, function (k, v) {
          return '<div style="padding:7px 0;border-bottom:1px solid #f0f0f0">' +
            '<strong>' + esc(k) + '</strong> &mdash; <span class="muted">' + esc(t(v)) + '</span></div>';
        }));
    }

    host.innerHTML = out;
  }

  function attach() {
    var sec = el('numerology');
    if (!sec) return;
    var host = el('advhost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'advhost';
      sec.appendChild(host);
    }
    if (DATA && !host.innerHTML.trim()) render();
  }

  function boot() {
    load().then(function () {
      var tries = 0;
      var iv = setInterval(function () {
        attach();
        if (el('advhost') && el('advhost').innerHTML.trim()) clearInterval(iv);
        else if (++tries > 40) clearInterval(iv);
      }, 250);
      window.addEventListener('hashchange', function () { setTimeout(attach, 150); });
    }).catch(function (e) {
      console.info('[Daily Bodh] numerology-advanced.json not found (' + e.message + ')');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
