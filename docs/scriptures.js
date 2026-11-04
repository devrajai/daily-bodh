/* Daily Bodh — scripture library.
 *
 * The full texts are far too large to bundle, so they live in Drive and this
 * screen links to them. Everything listed here is a public-domain translation,
 * not a modern copyrighted one.
 *
 * The texts are NOT offline. They open in Drive and need a connection — the
 * card says so, because the rest of the site does not.
 *
 * Appends to the Shastra tab, falling back to Jyotish if that section is absent.
 *   <script src="scriptures.js"></script>
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c];
    });
  }

  /* Only entries whose file is actually uploaded and verified go here. */
  var TEXTS = [
    {
      name: 'Mahabharata', sk: '\u092e\u0939\u093e\u092d\u093e\u0930\u0924',
      translator: 'Kisari Mohan Ganguli',
      year: '1883\u20131896',
      words: '2,552,881',
      size: '15 MB',
      note: 'The complete eighteen parvas, unabridged. Ganguli\u2019s is the first full English ' +
        'translation and the only one in the public domain. It includes the Bhagavad Gita in ' +
        'context, within the Bhishma Parva.',
      drive: 'https://drive.google.com/file/d/1SFdSxLZad9GQscz9SSFcXTTsay9Umzpr/view',
      live: true
    },
    {
      name: 'Sushruta Samhita \u2014 Vol 1', sk: '\u0938\u0941\u0936\u094d\u0930\u0941\u0924 \u0938\u0902\u0939\u093f\u0924\u093e',
      translator: 'Kaviraj Kunja Lal Bhishagratna',
      year: '1907',
      words: '\u2014',
      size: '1.1 MB',
      note: 'The Sutrasthana \u2014 the foundational book on theory, training, instruments and ' +
        'the principles of treatment. The oldest surgical treatise in the world, and the one that ' +
        'describes rhinoplasty and cataract surgery.',
      drive: 'https://drive.google.com/file/d/1YRE6BSDq8LLE0M7o58hhk8WWTSdPlFng/view',
      live: true
    },
    {
      name: 'Sushruta Samhita \u2014 Vol 3', sk: '\u0938\u0941\u0936\u094d\u0930\u0941\u0924 \u0938\u0902\u0939\u093f\u0924\u093e',
      translator: 'Kaviraj Kunja Lal Bhishagratna',
      year: '1916',
      words: '\u2014',
      size: '1.0 MB',
      note: 'The Uttaratantra \u2014 the supplementary book, covering eye disease, ENT, ' +
        'paediatrics and toxicology. Bhishagratna\u2019s is the standard English translation.',
      drive: 'https://drive.google.com/file/d/1zaF_rV60ApayI-X_-gTuwBAQVFyciwxW/view',
      live: true
    }
  ];

  var PLANNED = [
    { name: 'Sushruta Samhita \u2014 Vol 2', translator: 'K. K. Bhishagratna', year: '1907' },
    { name: 'Ramayana', translator: 'Ralph T. H. Griffith', year: '1870\u20131874' },
    { name: 'Rigveda', translator: 'Ralph T. H. Griffith', year: '1896' },
    { name: 'Yajurveda', translator: 'Ralph T. H. Griffith', year: '1899' },
    { name: 'Atharvaveda', translator: 'Ralph T. H. Griffith', year: '1895\u20131896' },
    { name: 'Principal Upanishads', translator: 'Max M\u00fcller', year: '1879' },
    { name: 'Vishnu Purana', translator: 'H. H. Wilson', year: '1840' },
    { name: 'Markandeya Purana', translator: 'M. N. Dutt', year: '1890s' },
    { name: 'Garuda Purana', translator: 'M. N. Dutt', year: '1890s' }
  ];

  function render() {
    var host = el('scripturehost');
    if (!host) return;

    var live = TEXTS.filter(function (t) { return t.live; }).map(function (t) {
      return '<div style="padding:12px 0;border-bottom:1px solid #eee">' +
        '<div style="font-weight:700;font-size:15px;color:var(--accent)">' + esc(t.name) +
        ' <span class="muted" style="font-weight:400;font-size:13px">' + esc(t.sk) + '</span></div>' +
        '<div class="muted" style="font-size:12.5px;margin-top:3px">' +
        esc(t.translator) + ', ' + esc(t.year) + ' \u00b7 ' + esc(t.size) + '</div>' +
        '<div style="margin-top:6px">' + esc(t.note) + '</div>' +
        '<p style="margin-top:8px"><a href="' + esc(t.drive) + '" target="_blank" rel="noopener">' +
        'Open the full text in Drive \u2192</a></p>' +
        '</div>';
    }).join('');

    var planned = PLANNED.map(function (t) {
      return '<tr><td class="k" style="width:38%">' + esc(t.name) + '</td>' +
        '<td>' + esc(t.translator) + ' <span class="muted">(' + esc(t.year) + ')</span></td></tr>';
    }).join('');

    host.innerHTML =
      '<div class="card"><h3>Scripture library</h3>' +
      '<p class="muted">Full texts, in public-domain English translations. These are held in Drive ' +
      'rather than bundled with the site, because the corpus runs to tens of megabytes \u2014 ' +
      'the Mahabharata alone is 15 MB, six times the size of everything else here combined.</p>' +
      live +
      '<div class="warn"><strong>These open in Drive and need a connection.</strong> Everything else ' +
      'on this site works offline; this screen does not. That is the trade for holding whole texts ' +
      'instead of summaries.</div></div>' +

      '<div class="card"><h3>Why these translations</h3>' +
      '<p>The Sanskrit originals are thousands of years old and belong to nobody. But most English ' +
      'translations people recognise \u2014 Gita Press, Bhaktivedanta, the modern Purana editions ' +
      '\u2014 are still in copyright, and reproducing them would be a straightforward infringement.</p>' +
      '<p class="muted">Every text here uses a translation published before 1930, whose translator ' +
      'died more than seventy years ago. They are old-fashioned in places and occasionally wrong ' +
      'about technical terms, but they are lawful to share and they are complete.</p></div>' +

      '<div class="card"><h3>Still to add</h3>' +
      '<p class="muted">Identified and available in public-domain translation. Each needs locating, ' +
      'checking and uploading before it appears above \u2014 nothing is listed as ready until the ' +
      'file is actually there.</p>' +
      '<table><tr><td class="k">Text</td><td class="k">Translation</td></tr>' + planned + '</table>' +
      '<div class="warn">Two gaps worth knowing. <strong>Charaka Samhita</strong> has no complete ' +
      'public-domain English translation on any accessible archive \u2014 the Kaviratna 1897 edition ' +
      'survives only in fragments. And the eighteen <strong>Mahapuranas</strong> have never been ' +
      'completed in public-domain English at all; the Bhagavata in particular has no free complete ' +
      'translation, so anyone offering one is almost certainly reproducing a copyrighted edition.</div></div>';
  }

  function attach() {
    // The Shastra tab's section id is not guaranteed; fall back to Jyotish so
    // the library is never silently unreachable.
    var sec = el('shastra') || el('jyotish');
    if (!sec) return;
    var host = el('scripturehost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'scripturehost';
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
