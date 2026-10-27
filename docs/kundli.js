/* Daily Bodh — the Kundli screen and the Jyotish reference tab.
   Loaded after chart.js and before the main inline script, so the renderers
   exist by the time index.html registers its tabs.

   Everything here is free: no API, no key, no account, no paid service.
   Positions come from the bundled ephemeris, the tables are classical, and
   the interpretive text is the tradition's own. */

let PLACES = null;
async function places(){
  if(!PLACES) PLACES = (await data('places.json')).places;
  return PLACES;
}

/* ------------------------------------------------- western aspects + vargas */
const ASPECTS = [["Conjunction",0,8],["Opposition",180,8],["Trine",120,7],
                 ["Square",90,7],["Sextile",60,5]];
function aspectBetween(a,b){
  let d = Math.abs(a-b) % 360; if(d > 180) d = 360 - d;
  for(const [name,ang,orb] of ASPECTS){
    const off = Math.abs(d-ang);
    if(off <= orb) return {name, off};
  }
  return null;
}
/* D9 navamsa: each sign divided into nine parts of 3 degrees 20 minutes.
   The continuous division is exactly equivalent to the classical rule that a
   movable sign starts its navamsa from itself, a fixed sign from the ninth,
   and a dual sign from the fifth - verified for all twelve signs. */
const navamsaOf = lon => Math.floor(lon/(30/9)) % 12;
/* tropical = sidereal + ayanamsa (the Western zodiac) */
const tropicalOf = (lon, jd) => norm360(lon + ayanamsa(jd));

async function renderKundli(){
  const s = $('#kundli');
  const P = await places();
  if(!s.dataset.built){
    s.innerHTML = `
      <h2>Kundli</h2>
      <p class="lead">A birth chart with a real ascendant: enter the date, the time and the place, and the lagna, the twelve bhavas, the aspects, the navamsa and the current transits are all cast from them.</p>
      <div class="card">
        <div class="row">
          <div><label>Birth date</label><input type="date" id="kd" value="1990-03-15"></div>
          <div><label>Birth time</label><input type="time" id="kt" value="12:00"></div>
        </div>
        <div style="margin-top:10px">
          <label style="display:flex;align-items:center;gap:8px;margin:0;font-size:14px">
            <input type="checkbox" id="kunknown" style="width:auto;margin:0">
            <span>I don't know my birth time</span>
          </label>
        </div>
        <div class="row">
          <div><label>Place</label><select id="kp">${P.map((p,i)=>`<option value="${i}">${p.name}</option>`).join('')}</select></div>
          <div><label>UTC offset (hours)</label><input type="number" id="ko" step="0.25" value="5.5"></div>
        </div>
        <button class="go" id="kgo">Cast the chart</button>
      </div>
      <div id="kout"></div>
      <div class="warn">The ascendant needs an exact birth time — a few minutes moves it. If the time is a guess, read the chart from the Moon instead, which is what the "from Moon" column is for. Planets are interpolated between noon positions, so a fast-moving Moon can be a fraction of a degree out.</div>
    `;
    s.dataset.built='1';
    $('#kp').addEventListener('change',()=>{
      const p = PLACES[+$('#kp').value];
      $('#ko').value = p.offset;
    });
    $('#kgo').addEventListener('click', drawKundli);
    $('#kd').addEventListener('change', drawKundli);
    $('#kt').addEventListener('change', drawKundli);
    $('#kunknown').addEventListener('change', drawKundli);
    drawKundli();
  }
}

async function drawKundli(){
  const box = $('#kout'); if(!box) return;
  const dateStr = $('#kd').value;
  const unknown = !!(document.getElementById('kunknown') && document.getElementById('kunknown').checked);
  const timeStr = unknown ? '12:00' : ($('#kt').value || '12:00');
  const off = parseFloat($('#ko').value) || 0;
  const p = (await places())[+$('#kp').value];
  if(!dateStr){ box.innerHTML=''; return; }
  box.innerHTML = '<p class="muted">Casting…</p>';

  const [hh,mm] = timeStr.split(':').map(Number);
  const frac = (hh + mm/60) / 24;
  const P = await planetsAt(dateStr, frac);
  if(!P){ box.innerHTML='<p class="muted">No ephemeris for that date (1930-2035).</p>'; return; }

  const jd = jdFromLocal(dateStr, timeStr, off);
  const asc = unknown ? null : ascendant(jd, p.lat, p.lon);

  // Without a birth time the ascendant is unknowable - it moves through a whole
  // sign in about two hours. Inventing one would be worse than showing none, so
  // fall back to the Moon, which is the classical answer, and say so.
  let moonR0 = rashiOf(P.Moon), moonR1 = rashiOf(P.Moon), moonMoves = false;
  if(unknown){
    const P0 = await planetsAt(dateStr, 0);
    const P1 = await planetsAt(dateStr, 0.9993);
    if(P0 && P1){ moonR0 = rashiOf(P0.Moon); moonR1 = rashiOf(P1.Moon); moonMoves = moonR0 !== moonR1; }
  }
  const ascRashi = unknown ? moonR0 : rashiOf(asc);
  const rashiByPlanet = {};
  GRAHAS.forEach(g => rashiByPlanet[g] = rashiOf(P[g]));

  const signOfHouse = h => (ascRashi + h - 1) % 12;
  const lordOfHouse = h => SIGN_LORD[signOfHouse(h)];

  /* ---- the graha table ---- */
  const rows = GRAHAS.map(g=>{
    const lon = P[g], h = houseOf(ascRashi, lon), hMoon = houseOf(rashiOf(P.Moon), lon);
    const dig = DIGBALA[g] === h ? '<span class="ok">yes</span>' : '<span class="muted">no</span>';
    return `<tr>
      <td style="width:15%"><strong>${g}</strong></td>
      <td style="width:16%">${RASHI[rashiOf(lon)].split(' (')[0]}</td>
      <td style="width:11%">${(lon%30).toFixed(1)}°</td>
      <td style="width:14%">${NAK[nakOf(lon)]} ${padaOf(lon)}</td>
      <td style="width:8%">${h}</td>
      <td style="width:9%">${hMoon}</td>
      <td style="width:13%">${dignity(g, lon)}</td>
      <td style="width:7%">${dig}</td>
      <td style="width:7%">${RASHI[navamsaOf(lon)].split(' (')[0]}</td>
    </tr>`;
  }).join('');

  /* ---- western aspects ---- */
  const aspRows = [];
  for(let i=0;i<9;i++) for(let j=i+1;j<9;j++){
    const a=GRAHAS[i], b=GRAHAS[j];
    const as = aspectBetween(P[a], P[b]);
    if(as) aspRows.push(`<tr><td style="width:34%">${a} – ${b}</td>
      <td style="width:26%">${as.name}</td>
      <td class="muted">${as.off.toFixed(1)}° from exact${as.off<1?' <span class="ok">(tight)</span>':''}</td></tr>`);
  }

  /* ---- parashari special aspects ---- */
  const drishti = GRAHAS.filter(g=>SPECIAL_ASPECT[g]).map(g=>
    `${g} in house ${houseOf(ascRashi,P[g])} aspects houses ${aspectsOf(g, houseOf(ascRashi,P[g])).join(', ')}`);

  /* ---- transits today against the natal chart ---- */
  const nowP = await planetsAt(iso(today()), (today().getHours())/24);
  let transits = '';
  if(nowP){
    transits = GRAHAS.map(g=>{
      const hL = houseOf(ascRashi, nowP[g]), hM = houseOf(rashiOf(P.Moon), nowP[g]);
      const natalR = rashiOf(P[g]);
      const moved = rashiOf(nowP[g]) !== natalR;
      return `<tr><td style="width:16%"><strong>${g}</strong></td>
        <td style="width:26%">${RASHI[rashiOf(nowP[g])].split(' (')[0]}</td>
        <td style="width:14%">house ${hL}</td>
        <td style="width:14%">from Moon ${hM}</td>
        <td class="muted">${moved ? 'moved from natal '+RASHI[natalR].split(' (')[0] : 'same sign as natal'}</td></tr>`;
    }).join('');
  }

  /* ---- Panch Mahapurusha ---- */
  const mp = [];
  Object.keys(MAHAPURUSHA).forEach(g=>{
    const lon=P[g], r=rashiOf(lon);
    const strong = (EXALT[g]===r) || (MOOLA[g]===r) || (OWN[g]||[]).includes(r);
    if(!strong) return;
    const hL = houseOf(ascRashi, lon), hM = houseOf(rashiOf(P.Moon), lon);
    if(!unknown && KENDRA.includes(hL)) mp.push(`${MAHAPURUSHA[g]} — ${g} in its own or exalted sign, in kendra house ${hL} from the lagna`);
    else if(KENDRA.includes(hM)) mp.push(`${MAHAPURUSHA[g]} — ${g} in its own or exalted sign, in kendra house ${hM} from the Moon`);
  });

  /* ---- raja yoga ---- */
  const kLords = [...new Set(KENDRA.map(lordOfHouse))];
  const tLords = [...new Set(TRIKONA.map(lordOfHouse))];
  const raja = [];
  kLords.forEach(k=>tLords.forEach(t=>{
    if(unknown) return;   // houses are counted from the Moon here, not a lagna
    if(k===t) return;
    const kSign=rashiByPlanet[GRAHAS[k]], tSign=rashiByPlanet[GRAHAS[t]];
    if(kSign===tSign)
      raja.push(`${GRAHAS[k]} (lord of kendra) and ${GRAHAS[t]} (lord of trikona) are conjunct in ${RASHI[kSign].split(' (')[0]}`);
    else if(rashiByPlanet[GRAHAS[k]]===tSign && rashiByPlanet[GRAHAS[t]]===kSign)
      raja.push(`${GRAHAS[k]} and ${GRAHAS[t]} are in mutual exchange`);
  }));

  /* ---- doshas ---- */
  const fromL = houseOf(ascRashi, P.Mars), fromM = houseOf(rashiOf(P.Moon), P.Mars), fromV = houseOf(rashiOf(P.Venus), P.Mars);
  const bad = [1,4,7,8,12];
  const ks = kaalSarp(P);
  let sade = null;
  if(nowP){
    const h = houseOf(rashiOf(P.Moon), nowP.Saturn);
    sade = {house:h, active:[12,1,2].includes(h), satRashi:rashiOf(nowP.Saturn)};
  }
  const b = await birthStar(dateStr);
  const age = (today() - new Date(dateStr+'T00:00:00'))/864e5/365.25;
  const md = vimshottari(P.Moon, age);

  const maitri = [];
  for(let i=0;i<7;i++) for(let j=i+1;j<7;j++)
    maitri.push(`${GRAHAS[i]}–${GRAHAS[j]}: <strong>${panchadha(GRAHAS[i],GRAHAS[j],rashiByPlanet)}</strong>`);

  /* ---- the chart wheel ---- */
  let chartHtml = '';
  try {
    const SHORT = {Sun:'Su', Moon:'Mo', Mars:'Ma', Mercury:'Me',
                   Jupiter:'Ju', Venus:'Ve', Saturn:'Sa', Rahu:'Ra', Ketu:'Ke'};
    const byName = {};
    GRAHAS.forEach(g => { byName[SHORT[g]] = houseOf(ascRashi, P[g]); });
    const wheel = new KundliChartRenderer({width: 420, height: 420});
    chartHtml = `<div class="card">
      <h3>${unknown ? 'Chandra chart (counted from the Moon)' : 'Birth chart'}</h3>
      <div style="max-width:420px;margin:0 auto">${wheel.renderNorthIndianSVG(ascRashi + 1, byName)}</div>
      <p class="muted">North Indian style: the houses are fixed and the ascendant sits at the top. Su Sun, Mo Moon, Ma Mars, Me Mercury, Ju Jupiter, Ve Venus, Sa Saturn, Ra Rahu, Ke Ketu.${unknown ? ' Counted from the Moon, because no birth time was given.' : ''}</p>
    </div>`;
  } catch(e) { /* the tables below still show every placement */ }

  box.innerHTML = `
    <div class="card">
      <h3>${unknown ? 'Moon sign (birth time not given)' : 'Lagna'}</h3>
      <div class="big">${unknown
        ? (moonMoves ? RASHI[moonR0].split(' (')[0]+' or '+RASHI[moonR1].split(' (')[0] : RASHI[ascRashi])
        : RASHI[ascRashi]}</div>
      ${ unknown
        ? `<p class="muted"><strong>No ascendant is shown, because none can be known without a birth time.</strong> The lagna moves through a whole sign in about two hours, so any value here would be invented. Everything below is counted from the <strong>Moon</strong> instead, which is the classical fallback.${moonMoves ? ' The Moon changes sign during this day, so the house numbers below may shift by one — give an approximate time to narrow it.' : ''}</p>`
        : `<p class="muted">Ascendant at ${(asc%30).toFixed(2)}° of ${RASHI[ascRashi].split(' (')[0]} (sidereal, Lahiri), cast for ${p.name} (${p.lat}, ${p.lon}) at ${timeStr} local, UTC${off>=0?'+':''}${off}.</p>` }
      <p class="muted">${unknown
        ? 'Lagna lord: not available'
        : 'Tropical ascendant: '+RASHI[Math.floor(tropicalOf(asc,jd)/30)%12].split(' (')[0]+' '+(tropicalOf(asc,jd)%30).toFixed(2)+'° · Lagna lord: <strong>'+GRAHAS[SIGN_LORD[ascRashi]]+'</strong>'} · Moon ${RASHI[rashiOf(P.Moon)].split(' (')[0]}, ${NAK[b.nak]} pada ${b.pada}</p>
    </div>
    <div class="card">
      <h3>The nine grahas</h3>
      <table>
        <tr class="muted"><td>Graha</td><td>Rashi</td><td>Deg</td><td>Nakshatra</td><td>House</td><td>from Moon</td><td>Dignity</td><td>Digbala</td><td>D9</td></tr>
        ${rows}
      </table>
      <p class="muted" style="margin-top:10px">Sidereal positions, Lahiri ayanamsa (${ayanamsa(jd).toFixed(2)}°). D9 is the navamsa sign. ${unknown ? '<strong>House is counted from the Moon</strong>, since there is no birth time.' : 'House is from the lagna; "from Moon" is the reading to use when the birth time is uncertain.'}</p>
    </div>
    ${chartHtml}
    <div class="card">
      <h3>Transits today</h3>
      ${ nowP ? `<table>${transits}</table>
        <p class="muted">Where each graha sits now, and the house it occupies counted from your lagna and from your natal Moon.</p>`
        : '<p class="muted">No ephemeris for today.</p>' }
    </div>
    <div class="card">
      <h3>Aspects</h3>
      ${ aspRows.length ? `<table>${aspRows.join('')}</table>` : '<p class="muted">No aspects within orb.</p>' }
      <p class="muted" style="margin-top:10px">Orbs: 8° for conjunction and opposition, 7° for trine and square, 5° for sextile.</p>
      <p style="margin-top:12px"><strong>Parashari special aspects (drishti)</strong></p>
      ${drishti.map(x=>`<p class="muted">${x}</p>`).join('')}
      <p class="muted">Every planet also aspects the 7th from itself. The nodes are not given special aspects here, because practice differs.</p>
    </div>
    <div class="card">
      <h3>Vimshottari dasha</h3>
      <p>${md.lord} mahadasha, ${md.ant} antardasha <span class="muted">(born in ${md.start}, balance ${md.balance.toFixed(1)} years)</span></p>
    </div>
    <div class="card">
      <h3>Mangal dosha</h3>
      <table>
        ${unknown ? '<tr><td class="k">Mars from the lagna</td><td><span class="muted">not available without a birth time</span></td></tr>'
                  : `<tr><td class="k">Mars from the lagna</td><td>house ${fromL} — <span class="${bad.includes(fromL)?'no':'ok'}">${bad.includes(fromL)?'affected':'clear'}</span></td></tr>`}
        <tr><td class="k">Mars from the Moon</td><td>house ${fromM} — <span class="${bad.includes(fromM)?'no':'ok'}">${bad.includes(fromM)?'affected':'clear'}</span></td></tr>
        <tr><td class="k">Mars from Venus</td><td>house ${fromV} — <span class="${bad.includes(fromV)?'no':'ok'}">${bad.includes(fromV)?'affected':'clear'}</span></td></tr>
      </table>
      <p class="muted">Cancellation rules (dosha bhanga) are not applied — in the tradition they cancel the dosha frequently, so read this as the raw rule only.</p>
    </div>
    <div class="card">
      <h3>Kaal Sarp</h3>
      <p>${ ks.present
        ? `<span class="no">Present</span> — all seven grahas lie on the ${ks.side} side. Rahu is in house ${houseOf(ascRashi, P.Rahu)} from the lagna, in ${RASHI[ks.rahuRashi].split(' (')[0]}, giving the type <strong>${KS_NAMES[houseOf(ascRashi, P.Rahu)-1]}</strong>.`
        : '<span class="ok">Not present</span> — the seven grahas are not all on one side of the Rahu–Ketu axis.' }</p>
    </div>
    <div class="card">
      <h3>Sade Sati</h3>
      ${ sade ? `<p>${ sade.active
        ? `<span class="no">Running</span> — Saturn is in house ${sade.house} from the natal Moon.`
        : `<span class="ok">Not running</span> — Saturn is in house ${sade.house} from the natal Moon (Sade Sati is houses 12, 1 and 2).` }</p>
        <p class="muted">Saturn today: ${RASHI[sade.satRashi].split(' (')[0]}.</p>` : '' }
    </div>
    <div class="card">
      <h3>Yogas found</h3>
      ${ mp.length ? `<p><strong>Panch Mahapurusha</strong></p><ul>${mp.map(x=>`<li>${x}</li>`).join('')}</ul>`
                   : '<p class="muted">No Panch Mahapurusha yoga — none of Mars, Mercury, Jupiter, Venus or Saturn is both dignified and in a kendra.</p>' }
      ${ raja.length ? `<p style="margin-top:12px"><strong>Raja yoga (kendra–trikona)</strong></p><ul>${raja.map(x=>`<li>${x}</li>`).join('')}</ul>`
                     : '<p class="muted" style="margin-top:12px">No plain kendra–trikona raja yoga by conjunction or exchange. The texts count many subtler forms, which are not checked here.</p>' }
    </div>
    <div class="card">
      <h3>Panchadha maitri <span class="muted" style="font-weight:400;font-size:13px">(five-fold relationship)</span></h3>
      <p class="muted">${maitri.join(' · ')}</p>
    </div>
    <div class="warn">No Shadbala, Ashtakavarga or the other divisional charts beyond D9 are computed — those are large tables I could not verify against an authoritative source from here, so the app leaves them out rather than guess. Everything on this page is computed in your browser from files bundled with the site: no API, no key, no account, no paid service.</div>
  `;
}

async function renderJyotish(){
  const s = $('#jyotish');
  if(!s.dataset.built){
    const J = await data('jyotish.json');
    const S = await data('sources.json');
    const D = await data('doshas.json');
    s.innerHTML = `<h2>Jyotish</h2>
      <p class="lead">${J.description||''}</p><div class="card" id="jy"></div>

      <h2 style="margin-top:30px">${S.title}</h2>
      <p class="lead">${S.intro}</p>

      <div class="card">
        <h3>${S.branches.title}</h3>
        ${S.branches.items.map(b=>`<p style="margin:9px 0"><strong>${b.name}</strong><br><span class="muted">${b.covers}</span></p>`).join('')}
        <p class="muted" style="margin-top:8px">${S.branches.note}</p>
      </div>

      <div class="card">
        <h3>${S.bphs.title}</h3>
        <p class="muted">${S.bphs.note}</p>
        <ul>${S.bphs.facts.map(f=>`<li style="margin:7px 0">${f}</li>`).join('')}</ul>
        <table>${S.bphs.editions.map(e=>`<tr>
          <td class="k" style="width:11%">${e.year}</td>
          <td><strong>${e.by}</strong><br><span class="muted">${e.note}</span></td></tr>`).join('')}</table>
        <p class="muted" style="margin-top:10px">${S.bphs.source}</p>
      </div>

      <div class="card">
        <h3>${S.sources.title}</h3>
        <p class="muted">${S.sources.note}</p>
        ${S.sources.items.map(x=>`<div style="border-top:1px solid var(--line);padding:11px 0">
          <strong>${x.name}</strong><br><span class="muted">${x.kind}</span>
          <p style="margin:7px 0 0;font-size:14.5px">${x.used}</p>
          <p class="muted" style="margin:5px 0 0"><em>Licence:</em> ${x.licence}</p>
        </div>`).join('')}
      </div>

      <div class="card">
        <h3>${S.howto.title}</h3>
        ${S.howto.points.map(p=>`<p style="margin:9px 0">${p}</p>`).join('')}
      </div>
      <div class="warn">${S.howto.note}</div>

      <h2 style="margin-top:34px">${D.title}</h2>
      <p class="lead">${D.intro}</p>
      <div class="card" id="dh"></div>`;
    packList(J.items, $('#jy'));
    packList(D.items, $('#dh')); s.dataset.built='1';
  }
}

/* ---------------------------------------------- the chart wheel (SVG) */
/**
 * Daily Bodh - Kundli Chart Renderer (Pure SVG)
 * Zero dependencies. Renders both North Indian (Diamond) and South Indian (Square) charts.
 * Clean, responsive, customizable styling matching Vedic aesthetics.
 */

class KundliChartRenderer {
  constructor(config = {}) {
    this.width = config.width || 500;
    this.height = config.height || 500;
    this.theme = {
      bgColor: config.bgColor || "#0e1117",
      strokeColor: config.strokeColor || "#d4af37", // Vedic Gold
      strokeWidth: config.strokeWidth || 2,
      textColor: config.textColor || "#e6edf3",
      rashiColor: config.rashiColor || "#8b949e",
      planetColor: config.planetColor || "#f0883e",
      fontFamily: config.fontFamily || "system-ui, -apple-system, sans-serif"
    };

    this.rashiNamesShort = ["Mes", "Vri", "Mit", "Kar", "Sim", "Kan", "Tul", "Vri", "Dha", "Mak", "Kum", "Mee"];
  }

  /**
   * Render North Indian Diamond Chart SVG
   * @param {number} ascendantSign 1-12 (Lagna)
   * @param {Object} planets Map of planetName -> { house: 1-12, isRetrograde: bool, isCombust: bool }
   */
  renderNorthIndianSVG(ascendantSign = 1, planets = {}) {
    const W = this.width;
    const H = this.height;
    const stroke = this.theme.strokeColor;
    const strokeW = this.theme.strokeWidth;
    const bg = this.theme.bgColor;

    // Center coordinates of all 12 houses in North Indian layout
    const houseCenters = {
      1:  { x: W * 0.50, y: H * 0.25 },
      2:  { x: W * 0.25, y: H * 0.12 },
      3:  { x: W * 0.12, y: H * 0.25 },
      4:  { x: W * 0.25, y: H * 0.50 },
      5:  { x: W * 0.12, y: H * 0.75 },
      6:  { x: W * 0.25, y: H * 0.88 },
      7:  { x: W * 0.50, y: H * 0.75 },
      8:  { x: W * 0.75, y: H * 0.88 },
      9:  { x: W * 0.88, y: H * 0.75 },
      10: { x: W * 0.75, y: H * 0.50 },
      11: { x: W * 0.88, y: H * 0.25 },
      12: { x: W * 0.75, y: H * 0.12 }
    };

    // Group planets by house
    const planetsByHouse = {};
    for (let h = 1; h <= 12; h++) planetsByHouse[h] = [];
    for (const [pName, pData] of Object.entries(planets)) {
      const h = typeof pData === 'number' ? pData : (pData.house || 1);
      if (planetsByHouse[h]) {
        planetsByHouse[h].push({ name: pName, ...pData });
      }
    }

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%" style="background-color: ${bg}; font-family: ${this.theme.fontFamily}; user-select: none;">`;

    // Outer rectangle
    svg += `<rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="${stroke}" stroke-width="${strokeW}"/>`;

    // Main Diagonals
    svg += `<line x1="0" y1="0" x2="${W}" y2="${H}" stroke="${stroke}" stroke-width="${strokeW}"/>`;
    svg += `<line x1="${W}" y1="0" x2="0" y2="${H}" stroke="${stroke}" stroke-width="${strokeW}"/>`;

    // Inner Diamond
    svg += `<polygon points="${W/2},0 ${W},${H/2} ${W/2},${H} 0,${H/2}" fill="none" stroke="${stroke}" stroke-width="${strokeW}"/>`;

    // Render House Numbers (Rashi sign assigned to each house)
    for (let h = 1; h <= 12; h++) {
      const sign = ((ascendantSign - 1 + (h - 1)) % 12) + 1;
      const center = houseCenters[h];

      // Sign number label (small, subtle)
      svg += `<text x="${center.x}" y="${center.y - 18}" fill="${this.theme.rashiColor}" font-size="12" font-weight="600" text-anchor="middle">${sign}</text>`;

      // Planet labels in this house
      const housePlanets = planetsByHouse[h];
      if (housePlanets.length > 0) {
        let pY = center.y;
        housePlanets.forEach((p, idx) => {
          let label = p.name.substring(0, 3);
          if (p.isRetrograde) label += "(R)";
          if (p.isCombust) label += "*";
          svg += `<text x="${center.x}" y="${pY + (idx * 15)}" fill="${this.theme.planetColor}" font-size="12" font-weight="bold" text-anchor="middle">${label}</text>`;
        });
      }
    }

    // Lagna badge in House 1
    svg += `<text x="${houseCenters[1].x}" y="${houseCenters[1].y - 32}" fill="${this.theme.strokeColor}" font-size="11" font-weight="bold" text-anchor="middle">ASC</text>`;

    svg += `</svg>`;
    return svg;
  }

  /**
   * Render South Indian Square Chart SVG
   * Fixed Rashi positions:
   * [12 Pisces] [ 1 Aries ] [ 2 Taurus] [ 3 Gemini ]
   * [11 Aqua  ] [        CENTRAL       ] [ 4 Cancer ]
   * [10 Capri ] [         SPACE        ] [ 5 Leo    ]
   * [ 9 Sagit ] [ 8 Scorp ] [ 7 Libra ] [ 6 Virgo  ]
   */
  renderSouthIndianSVG(ascendantSign = 1, planets = {}) {
    const W = this.width;
    const H = this.height;
    const stroke = this.theme.strokeColor;
    const strokeW = this.theme.strokeWidth;
    const bg = this.theme.bgColor;
    const cellW = W / 4;
    const cellH = H / 4;

    // Coordinates of 12 signs in 4x4 perimeter
    const signBoxes = {
      12: { col: 0, row: 0 }, 1: { col: 1, row: 0 }, 2: { col: 2, row: 0 }, 3: { col: 3, row: 0 },
      4:  { col: 3, row: 1 }, 5: { col: 3, row: 2 }, 6: { col: 3, row: 3 },
      7:  { col: 2, row: 3 }, 8: { col: 1, row: 3 }, 9: { col: 0, row: 3 },
      10: { col: 0, row: 2 }, 11: { col: 0, row: 1 }
    };

    // Group planets by sign
    const planetsBySign = {};
    for (let s = 1; s <= 12; s++) planetsBySign[s] = [];
    for (const [pName, pData] of Object.entries(planets)) {
      // If house is given, sign = ((ascendantSign - 1 + house - 1) % 12) + 1
      const house = typeof pData === 'number' ? pData : (pData.house || 1);
      const sign = ((ascendantSign - 1 + house - 1) % 12) + 1;
      if (planetsBySign[sign]) {
        planetsBySign[sign].push({ name: pName, ...pData });
      }
    }

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%" style="background-color: ${bg}; font-family: ${this.theme.fontFamily}; user-select: none;">`;

    // Outer border
    svg += `<rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="${stroke}" stroke-width="${strokeW}"/>`;

    // Inner center box (empty)
    svg += `<rect x="${cellW}" y="${cellH}" width="${cellW * 2}" height="${cellH * 2}" fill="rgba(212,175,55,0.03)" stroke="${stroke}" stroke-width="${strokeW}"/>`;

    // Grid lines for the 12 boxes
    for (let i = 1; i <= 3; i++) {
      // Horizontal lines
      svg += `<line x1="0" y1="${i * cellH}" x2="${W}" y2="${i * cellH}" stroke="${stroke}" stroke-width="${strokeW}"/>`;
      // Vertical lines
      svg += `<line x1="${i * cellW}" y1="0" x2="${i * cellW}" y2="${H}" stroke="${stroke}" stroke-width="${strokeW}"/>`;
    }

    // Render contents for each sign
    for (let sign = 1; sign <= 12; sign++) {
      const box = signBoxes[sign];
      const x = box.col * cellW;
      const y = box.row * cellH;

      // Sign name badge
      const isLagna = (sign === ascendantSign);
      svg += `<text x="${x + 8}" y="${y + 18}" fill="${isLagna ? stroke : this.theme.rashiColor}" font-size="11" font-weight="${isLagna ? 'bold' : 'normal'}">${this.rashiNamesShort[sign - 1]}${isLagna ? ' (ASC)' : ''}</text>`;

      // If Lagna, draw subtle diagonal line in top-right corner
      if (isLagna) {
        svg += `<line x1="${x}" y1="${y}" x2="${x + 25}" y2="${y + 25}" stroke="${stroke}" stroke-width="2"/>`;
      }

      // Render planets
      const pList = planetsBySign[sign];
      let pY = y + 36;
      pList.forEach((p, idx) => {
        let label = p.name.substring(0, 3);
        if (p.isRetrograde) label += "(R)";
        svg += `<text x="${x + cellW / 2}" y="${pY + (idx * 15)}" fill="${this.theme.planetColor}" font-size="12" font-weight="bold" text-anchor="middle">${label}</text>`;
      });
    }

    // Central Title
    svg += `<text x="${W/2}" y="${H/2 - 10}" fill="${stroke}" font-size="16" font-weight="bold" text-anchor="middle">Daily Bodh</text>`;
    svg += `<text x="${W/2}" y="${H/2 + 15}" fill="${this.theme.textColor}" font-size="12" text-anchor="middle">South Indian Kundli</text>`;

    svg += `</svg>`;
    return svg;
  }
}
