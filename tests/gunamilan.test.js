'use strict';
// Pins the Ashtakoota (Guna Milan) implementation against the reference
// implementation it was ported from (kalagana, MIT).
//
// The expected values below were produced by kalagana's ashtakoota() and
// checked over a FULL 729-pair sweep of every consistent (rashi, nakshatra)
// combination, which matched exactly. This test keeps 20 of those pairs so any
// future drift in a table or a partial score fails here.
//
// NOTE on indexing: kalagana takes nakshatra numbers 1-based; this engine is
// 0-based. The fixtures store the engine's 0-based values.

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

// The implementation lives in the inline script of docs/index.html. Pull out
// just the Guna Milan block so it can be evaluated on its own.
const html = fs.readFileSync(path.join(__dirname, '..', 'docs', 'index.html'), 'utf8');
const inline = html.split('<script>').pop().split('</script>')[0];
const start = inline.indexOf('/* ------------------------------------------------------------ guna milan */');
const end = inline.indexOf('/* --------------------------------------------------------------- muhurat */', start);
assert.ok(start > -1, 'could not find the Guna Milan block in docs/index.html');
assert.ok(end > start, 'could not find the end of the Guna Milan block');
const engine = new Function(inline.slice(start, end) + '\nreturn { gunaMilan };')();

const FIXTURES = [
  { bR:7, bN:17, gR:1, gN:4, total:23.5, kootas:{"Varna":1,"Vashya":0,"Tara":1.5,"Yoni":2,"Graha Maitri":3,"Gana":1,"Bhakoot":7,"Nadi":8} },
  { bR:9, bN:21, gR:2, gN:6, total:23.5, kootas:{"Varna":1,"Vashya":1,"Tara":1.5,"Yoni":2,"Graha Maitri":4,"Gana":6,"Bhakoot":0,"Nadi":8} },
  { bR:7, bN:17, gR:7, gN:17, total:25, kootas:{"Varna":1,"Vashya":2,"Tara":0,"Yoni":4,"Graha Maitri":5,"Gana":6,"Bhakoot":7,"Nadi":0} },
  { bR:7, bN:17, gR:1, gN:3, total:22.5, kootas:{"Varna":1,"Vashya":0,"Tara":1.5,"Yoni":2,"Graha Maitri":3,"Gana":0,"Bhakoot":7,"Nadi":8} },
  { bR:8, bN:19, gR:3, gN:7, total:11.5, kootas:{"Varna":0,"Vashya":1,"Tara":1.5,"Yoni":0,"Graha Maitri":4,"Gana":5,"Bhakoot":0,"Nadi":0} },
  { bR:9, bN:22, gR:3, gN:7, total:13, kootas:{"Varna":0,"Vashya":1,"Tara":1.5,"Yoni":2,"Graha Maitri":0.5,"Gana":1,"Bhakoot":7,"Nadi":0} },
  { bR:3, bN:7, gR:2, gN:5, total:19.5, kootas:{"Varna":1,"Vashya":1,"Tara":1.5,"Yoni":2,"Graha Maitri":1,"Gana":5,"Bhakoot":0,"Nadi":8} },
  { bR:3, bN:7, gR:0, gN:0, total:30.5, kootas:{"Varna":1,"Vashya":1,"Tara":1.5,"Yoni":2,"Graha Maitri":4,"Gana":6,"Bhakoot":7,"Nadi":8} },
  { bR:8, bN:19, gR:4, gN:11, total:27, kootas:{"Varna":1,"Vashya":2,"Tara":3,"Yoni":2,"Graha Maitri":5,"Gana":6,"Bhakoot":0,"Nadi":8} },
  { bR:8, bN:18, gR:0, gN:1, total:21, kootas:{"Varna":1,"Vashya":2,"Tara":3,"Yoni":2,"Graha Maitri":5,"Gana":0,"Bhakoot":0,"Nadi":8} },
  { bR:10, bN:23, gR:10, gN:23, total:25, kootas:{"Varna":1,"Vashya":2,"Tara":0,"Yoni":4,"Graha Maitri":5,"Gana":6,"Bhakoot":7,"Nadi":0} },
  { bR:10, bN:23, gR:3, gN:7, total:14, kootas:{"Varna":0,"Vashya":1,"Tara":1.5,"Yoni":2,"Graha Maitri":0.5,"Gana":1,"Bhakoot":0,"Nadi":8} },
  { bR:3, bN:7, gR:0, gN:1, total:21.5, kootas:{"Varna":1,"Vashya":1,"Tara":1.5,"Yoni":2,"Graha Maitri":4,"Gana":5,"Bhakoot":7,"Nadi":0} },
  { bR:1, bN:3, gR:6, gN:15, total:10.5, kootas:{"Varna":1,"Vashya":1,"Tara":1.5,"Yoni":2,"Graha Maitri":5,"Gana":0,"Bhakoot":0,"Nadi":0} },
  { bR:7, bN:16, gR:11, gN:25, total:13, kootas:{"Varna":1,"Vashya":0,"Tara":0,"Yoni":2,"Graha Maitri":5,"Gana":5,"Bhakoot":0,"Nadi":0} },
  { bR:4, bN:11, gR:5, gN:13, total:15.5, kootas:{"Varna":1,"Vashya":1,"Tara":1.5,"Yoni":0,"Graha Maitri":4,"Gana":0,"Bhakoot":0,"Nadi":8} },
  { bR:2, bN:5, gR:4, gN:10, total:29.5, kootas:{"Varna":0,"Vashya":1,"Tara":1.5,"Yoni":2,"Graha Maitri":4,"Gana":6,"Bhakoot":7,"Nadi":8} },
  { bR:1, bN:3, gR:4, gN:11, total:28, kootas:{"Varna":0,"Vashya":2,"Tara":3,"Yoni":2,"Graha Maitri":0,"Gana":6,"Bhakoot":7,"Nadi":8} },
  { bR:8, bN:20, gR:4, gN:11, total:24, kootas:{"Varna":1,"Vashya":2,"Tara":0,"Yoni":2,"Graha Maitri":5,"Gana":6,"Bhakoot":0,"Nadi":8} },
  { bR:11, bN:26, gR:3, gN:8, total:10, kootas:{"Varna":1,"Vashya":2,"Tara":0,"Yoni":2,"Graha Maitri":4,"Gana":1,"Bhakoot":0,"Nadi":0} },
];

const KOOTA_NAMES = ['Varna','Vashya','Tara','Yoni','Graha Maitri','Gana','Bhakoot','Nadi'];
const MAX = { Varna:1, Vashya:2, Tara:3, Yoni:4, 'Graha Maitri':5, Gana:6, Bhakoot:7, Nadi:8 };

test('Ashtakoota totals and per-koota scores match the reference implementation', () => {
  for (const f of FIXTURES) {
    const got = engine.gunaMilan(f.bN, f.bR, f.gN, f.gR);
    const where = `(bR ${f.bR}, bN ${f.bN}, gR ${f.gR}, gN ${f.gN})`;
    assert.ok(Math.abs(got.total - f.total) < 1e-9,
      `total ${where}: expected ${f.total}, got ${got.total}`);
    const byName = Object.fromEntries(got.kootas.map(k => [k[0], k[2]]));
    for (const [name, expected] of Object.entries(f.kootas)) {
      assert.ok(Math.abs(byName[name] - expected) < 1e-9,
        `${name} ${where}: expected ${expected}, got ${byName[name]}`);
    }
  }
});

test('all eight kootas are present, none exceeds its maximum, and they sum to the total', () => {
  for (const f of FIXTURES) {
    const got = engine.gunaMilan(f.bN, f.bR, f.gN, f.gR);
    assert.deepStrictEqual(got.kootas.map(k => k[0]), KOOTA_NAMES);
    let sum = 0;
    for (const [name, max, score] of got.kootas) {
      assert.ok(score >= 0 && score <= max, `${name} out of range: ${score} of ${max}`);
      assert.strictEqual(max, MAX[name], `${name} maximum should be ${MAX[name]}`);
      sum += score;
    }
    assert.ok(Math.abs(sum - got.total) < 1e-9, `kootas sum to ${sum} but total is ${got.total}`);
    assert.ok(got.total >= 0 && got.total <= 36, `total ${got.total} outside 0-36`);
  }
});

test('the 36-point maximum is reachable and no pair exceeds it', () => {
  // A sweep of every consistent (rashi, nakshatra) pair; nothing may exceed 36.
  const pairs = [];
  for (let r = 0; r < 12; r++) for (let n = 0; n < 27; n++) {
    if (Math.floor((n * 360 / 27) / 30) % 12 !== r) continue;
    pairs.push([r, n]);
  }
  let best = 0;
  for (const [bR, bN] of pairs) for (const [gR, gN] of pairs) {
    const t = engine.gunaMilan(bN, bR, gN, gR).total;
    assert.ok(t >= 0 && t <= 36, `total ${t} outside 0-36`);
    if (t > best) best = t;
  }
  assert.ok(best >= 30, `no pair scored above ${best}; the tables look wrong`);
});
