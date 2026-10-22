const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');

const chartSrc = fs.readFileSync('docs/chart.js', 'utf8');
const kundliSrc = fs.readFileSync('docs/kundli.js', 'utf8');
const indexHtml = fs.readFileSync('docs/index.html', 'utf8');
const scriptMatch = indexHtml.match(/<script>([\s\S]*?)<\/script>/);
const inlineScript = scriptMatch ? scriptMatch[1] : '';

const combinedSrc = `
const atob = str => Buffer.from(str, 'base64').toString('binary');
const $ = () => ({ innerHTML: '', querySelectorAll: () => [], dataset: {} });
const data = async () => ({});

${chartSrc}
${kundliSrc}

const NAK = ["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya",
"Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha",
"Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha",
"Purva Bhadrapada","Uttara Bhadrapada","Revati"];
const RASHI = ["Aries (Mesh)","Taurus (Vrishabh)","Gemini (Mithun)","Cancer (Kark)","Leo (Simha)",
"Virgo (Kanya)","Libra (Tula)","Scorpio (Vrishchik)","Sagittarius (Dhanu)","Capricorn (Makar)",
"Aquarius (Kumbh)","Pisces (Meen)"];
const iso = d => d.toISOString().slice(0,10);
const today = () => { const d=new Date(); return new Date(d.getTime()-d.getTimezoneOffset()*6e4); };

return {
  navamsaOf, aspectBetween, dignity, panchadha, aspectsOf, ascendant, jdFromLocal,
  GRAHAS, NAT_FRIEND, NAT_ENEMY, SIGN_LORD, MOOLA, EXALT, OWN, rashiOf
};
`;

const engine = new Function(combinedSrc)();

test('navamsaOf classical rules', (t) => {
  assert.strictEqual(engine.navamsaOf(0), 0);
  assert.strictEqual(engine.navamsaOf(4), 1);
  assert.strictEqual(engine.navamsaOf(30), 9);

  assert.strictEqual(engine.navamsaOf(0), 0);
  assert.strictEqual(engine.navamsaOf(90), 3);
  assert.strictEqual(engine.navamsaOf(180), 6);
  assert.strictEqual(engine.navamsaOf(270), 9);

  assert.strictEqual(engine.navamsaOf(30), 9);
  assert.strictEqual(engine.navamsaOf(120), 0);
  assert.strictEqual(engine.navamsaOf(210), 3);
  assert.strictEqual(engine.navamsaOf(300), 6);

  assert.strictEqual(engine.navamsaOf(60), 6);
  assert.strictEqual(engine.navamsaOf(150), 9);
  assert.strictEqual(engine.navamsaOf(240), 0);
  assert.strictEqual(engine.navamsaOf(330), 3);
});

test('aspectBetween', (t) => {
  assert.strictEqual(engine.aspectBetween(10, 190).name, 'Opposition');
  assert.strictEqual(engine.aspectBetween(10, 70).name, 'Sextile');
  assert.strictEqual(engine.aspectBetween(10, 100).name, 'Square');
  assert.strictEqual(engine.aspectBetween(10, 50), null);
});

test('dignity', (t) => {
  assert.strictEqual(engine.dignity('Sun', 10), 'Exalted');
  assert.strictEqual(engine.dignity('Sun', 190), 'Debilitated');
  assert.strictEqual(engine.dignity('Mars', 5), 'Moolatrikona');
});

test('panchadha', (t) => {
  assert.strictEqual(engine.panchadha('Sun', 'Moon', {Sun:0, Moon:1}), 'Adhi Mitra');
  assert.strictEqual(engine.panchadha('Sun', 'Moon', {Sun:0, Moon:7}), 'Sama');
  assert.strictEqual(engine.panchadha('Sun', 'Venus', {Sun:0, Venus:7}), 'Adhi Shatru');
});

test('aspectsOf', (t) => {
  assert.deepStrictEqual(engine.aspectsOf('Mars', 2), [5, 8, 9]);
  assert.deepStrictEqual(engine.aspectsOf('Saturn', 1), [3, 7, 10]);
  assert.deepStrictEqual(engine.aspectsOf('Jupiter', 1), [5, 7, 9]);
});

test('Ascendant', (t) => {
  const jd = engine.jdFromLocal('1990-03-15', '14:30', 5.5);
  const asc = engine.ascendant(jd, 28.6139, 77.209);
  assert.ok(asc >= 90 && asc < 120, 'Ascendant is not in Cancer (90-120)');
});
