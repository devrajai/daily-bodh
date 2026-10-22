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
    drawKundli();
  }
}

async function drawKundli(){
  const box = $('#kout'); if(!box) return;
  const dateStr = $('#kd').value, timeStr = $('#kt').value || '12:00';
  const off = parseFloat($('#ko').value) || 0;
  const p = (await places())[+$('#kp').value];
  if(!dateStr){ box.innerHTML=''; return; }
  box.innerHTML = '<p class="muted">Casting…</p>';

  const [hh,mm] = timeStr.split(':').map(Number);
  const frac = (hh + mm/60) / 24;
  const P = await planetsAt(dateStr, frac);
  if(!P){ box.innerHTML='<p class="muted">No ephemeris for that date (1930-2035).</p>'; return; }

  const jd = jdFromLocal(dateStr, timeStr, off);
  const asc = ascendant(jd, p.lat, p.lon);
  const ascRashi = rashiOf(asc);
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
    if(KENDRA.includes(hL)) mp.push(`${MAHAPURUSHA[g]} — ${g} in its own or exalted sign, in kendra house ${hL} from the lagna`);
    else if(KENDRA.includes(hM)) mp.push(`${MAHAPURUSHA[g]} — ${g} in its own or exalted sign, in kendra house ${hM} from the Moon`);
  });

  /* ---- raja yoga ---- */
  const kLords = [...new Set(KENDRA.map(lordOfHouse))];
  const tLords = [...new Set(TRIKONA.map(lordOfHouse))];
  const raja = [];
  kLords.forEach(k=>tLords.forEach(t=>{
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

  box.innerHTML = `
    <div class="card">
      <h3>Lagna</h3>
      <div class="big">${RASHI[ascRashi]}</div>
      <p class="muted">Ascendant at ${(asc%30).toFixed(2)}° of ${RASHI[ascRashi].split(' (')[0]} (sidereal, Lahiri), cast for ${p.name} (${p.lat}, ${p.lon}) at ${timeStr} local, UTC${off>=0?'+':''}${off}.</p>
      <p class="muted">Tropical ascendant: ${RASHI[Math.floor(tropicalOf(asc,jd)/30)%12].split(' (')[0]} ${(tropicalOf(asc,jd)%30).toFixed(2)}° · Lagna lord: <strong>${GRAHAS[SIGN_LORD[ascRashi]]}</strong> · Moon ${RASHI[rashiOf(P.Moon)].split(' (')[0]}, ${NAK[b.nak]} pada ${b.pada}</p>
    </div>
    <div class="card">
      <h3>The nine grahas</h3>
      <table>
        <tr class="muted"><td>Graha</td><td>Rashi</td><td>Deg</td><td>Nakshatra</td><td>House</td><td>from Moon</td><td>Dignity</td><td>Digbala</td><td>D9</td></tr>
        ${rows}
      </table>
      <p class="muted" style="margin-top:10px">Sidereal positions, Lahiri ayanamsa (${ayanamsa(jd).toFixed(2)}°). D9 is the navamsa sign. House is from the lagna; "from Moon" is the reading to use when the birth time is uncertain.</p>
    </div>
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
        <tr><td class="k">Mars from the lagna</td><td>house ${fromL} — <span class="${bad.includes(fromL)?'no':'ok'}">${bad.includes(fromL)?'affected':'clear'}</span></td></tr>
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
      <div class="warn">${S.howto.note}</div>`;
    packList(J.items, $('#jy')); s.dataset.built='1';
  }
}
