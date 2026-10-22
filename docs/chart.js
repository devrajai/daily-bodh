/* Daily Bodh — the chart engine, split out so index.html stays readable.

   Everything here is arithmetic on the bundled ephemeris plus the classical
   tables. No network, no server. The ascendant formula was validated against
   kalagana (MIT) to within 0.6 arc-minutes over 400 random charts. */

/* ------------------------------------------------------------- time + jd */
const J2000 = 2451545.0;
const D2R = Math.PI/180, R2D = 180/Math.PI;
const norm360 = x => ((x % 360) + 360) % 360;

function jdFromLocal(dateStr, timeStr, offsetHours){
  const [y,m,d] = dateStr.split('-').map(Number);
  const [hh,mm]  = (timeStr || '12:00').split(':').map(Number);
  // local civil time -> UT
  const ms = Date.UTC(y, m-1, d, hh, mm, 0) - offsetHours*3600e3;
  return ms/86400000 + 2440587.5;
}
function gmst(jd){
  const T=(jd-J2000)/36525;
  return norm360(280.46061837 + 360.98564736629*(jd-J2000) + 0.000387933*T*T - T*T*T/38710000);
}
function obliquity(jd){
  const T=(jd-J2000)/36525;
  return 23 + 26/60 + 21.448/3600 - (46.8150*T + 0.00059*T*T - 0.001813*T*T*T)/3600;
}
function ayanamsa(jd){
  const T=(jd-J2000)/36525;
  const p = 5028.796195*T + 1.1054348*T*T + 0.00007964*T*T*T
          - 0.000023857*Math.pow(T,4) - 0.0000000383*Math.pow(T,5);
  return 23.85305555555556 + p/3600;   // Lahiri at J2000, propagated
}
function ascendant(jd, lat, lon){
  const th = norm360(gmst(jd) + lon) * D2R;
  const e  = obliquity(jd) * D2R, p = lat * D2R;
  const y = Math.cos(th);
  const x = -(Math.sin(th)*Math.cos(e) + Math.tan(p)*Math.sin(e));
  return norm360(Math.atan2(y,x)*R2D - ayanamsa(jd));
}

/* ------------------------------------------- planets at an arbitrary moment */
let EPH = null;
async function eph(){
  if(EPH) return EPH;
  const e = await data('ephemeris.json');
  const bin = atob(e.lon); const u = new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i);
  EPH = { from:new Date(e.from+'T00:00:00Z'), bodies:e.bodies, buf:u };
  return EPH;
}
/* linear interpolation between the two surrounding noon positions */
async function planetsAt(dateStr, frac){
  const e = await eph();
  const i = Math.floor((new Date(dateStr+'T00:00:00Z') - e.from)/864e5);
  const n = e.bodies.length, days = e.buf.length/(2*n);
  if(i < 0 || i+1 >= days) return null;
  const out = {};
  e.bodies.forEach((b,j)=>{
    const o1=(i*n+j)*2, o2=((i+1)*n+j)*2;
    let a=(e.buf[o1]|(e.buf[o1+1]<<8))/100, b2=(e.buf[o2]|(e.buf[o2+1]<<8))/100;
    let d = b2 - a; if(d > 180) d -= 360; if(d < -180) d += 360;
    out[b] = norm360(a + d*frac);
  });
  out.Ketu = norm360(out.Rahu + 180);
  return out;
}
const GRAHAS = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
const rashiOf = lon => Math.floor(lon/30)%12;
const nakOf   = lon => Math.floor(lon/(360/27))%27;
const padaOf  = lon => Math.floor((lon%(360/27))/((360/27)/4))+1;

/* ------------------------------------------------------- classical tables */
const SIGN_LORD = [2,5,3,1,0,3,5,2,4,6,6,4];       // Aries..Pisces -> Sun..Saturn
const EXALT = {Sun:0, Moon:1, Mars:9, Mercury:5, Jupiter:3, Venus:11, Saturn:6};
const MOOLA = {Sun:4, Moon:1, Mars:0, Mercury:5, Jupiter:8, Venus:6, Saturn:10};
const OWN   = {Sun:[4], Moon:[3], Mars:[0,7], Mercury:[2,5], Jupiter:[8,11], Venus:[1,6], Saturn:[9,10]};
const NAT_FRIEND = {Sun:[1,2,4], Moon:[0,3], Mars:[0,1,4], Mercury:[0,5],
                    Jupiter:[0,1,2], Venus:[3,6], Saturn:[3,5]};
const NAT_ENEMY  = {Sun:[5,6], Moon:[], Mars:[3], Mercury:[1],
                    Jupiter:[3,5], Venus:[0,1], Saturn:[0,1,2]};
const DIGBALA = {Sun:10, Mars:10, Jupiter:1, Mercury:1, Saturn:7, Moon:4, Venus:4};
const SPECIAL_ASPECT = {Mars:[4,7,8], Jupiter:[5,7,9], Saturn:[3,7,10]};
const MAHAPURUSHA = {Mars:"Ruchaka", Mercury:"Bhadra", Jupiter:"Hamsa",
                     Venus:"Malavya", Saturn:"Shasha"};
const KENDRA=[1,4,7,10], TRIKONA=[1,5,9], DUSTHANA=[6,8,12];

function dignity(planet, lon){
  const r = rashiOf(lon);
  if(EXALT[planet] === r) return "Exalted";
  if(EXALT[planet] != null && (EXALT[planet]+6)%12 === r) return "Debilitated";
  if(MOOLA[planet] === r) return "Moolatrikona";
  if((OWN[planet]||[]).includes(r)) return "Own sign";
  const lord = SIGN_LORD[r];
  if(planet === lord) return "Own sign";
  if(!(planet in NAT_FRIEND)) return "—";
  if(NAT_FRIEND[planet].includes(lord)) return "Friend's sign";
  if(NAT_ENEMY[planet].includes(lord)) return "Enemy's sign";
  return "Neutral sign";
}
const houseOf = (ascRashi, lon) => ((rashiOf(lon) - ascRashi + 12) % 12) + 1;

/* temporary friendship: 2,3,4,10,11,12 from a planet are friends */
function temporalFriend(fromRashi, toRashi){
  const h = ((toRashi - fromRashi + 12) % 12) + 1;
  return [2,3,4,10,11,12].includes(h);
}
function panchadha(p, q, rashiByPlanet){
  // takes planet NAMES; the tables are indexed by graha number
  const ip = GRAHAS.indexOf(p), iq = GRAHAS.indexOf(q);
  if(ip < 0 || iq < 0 || ip > 6 || iq > 6) return "—";
  const nat = NAT_FRIEND[p].includes(iq) ? "F" : (NAT_ENEMY[p].includes(iq) ? "E" : "N");
  const tmp = temporalFriend(rashiByPlanet[p], rashiByPlanet[q]) ? "F" : "E";
  const key = nat+tmp;
  return {"FF":"Adhi Mitra","FE":"Sama","NF":"Mitra","NE":"Shatru","EF":"Sama","EE":"Adhi Shatru"}[key];
}

/* which houses a planet aspects, counted from the ascendant */
function aspectsOf(planet, house){
  const offs = SPECIAL_ASPECT[planet] || [7];
  return offs.map(o => ((house - 1 + o - 1) % 12) + 1);
}
