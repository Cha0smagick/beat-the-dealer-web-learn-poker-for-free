/* Engine validation — run: node tools/test-engine.mjs */
global.window = global;
require("../assets/js/engine.js");

const E = window.BTD.Engine;
let failures = 0;
const ok = (name, cond, detail) => {
  console.log((cond ? "PASS " : "FAIL ") + name + (detail !== undefined ? "  -> " + detail : ""));
  if (!cond) failures++;
};
const approx = (a, b, eps) => Math.abs(a - b) <= eps;

/* Independent brute-force dealer enumeration (no memo, plain recursion) */
function bruteDealer(comp, total, soft, h17) {
  if (total > 21) return { 22: 1 };
  if (total >= 17 && (!soft || !h17)) return { [total]: 1 };
  const out = {};
  const N = E.compTotal(comp);
  for (let r = 0; r < 13; r++) {
    if (comp[r] === 0) continue;
    const p = comp[r] / N;
    const c2 = E.cloneComp(comp); c2[r]--;
    const nt = total + E.bjValue(r);
    let a = (soft || r === 0) ? 1 : 0, t2 = nt;
    while (t2 > 21 && a > 0) { t2 -= 10; a--; }
    const sub = bruteDealer(c2, t2, a > 0, h17);
    for (const k of Object.keys(sub)) out[k] = (out[k] || 0) + p * sub[k];
  }
  return out;
}
function bruteStand(comp, playerTotal, up) {
  const cond = up === 0 || E.isTen(up); // peek conditioning
  const N = E.compTotal(comp);
  let pBJ = 0;
  const branches = [];
  for (let h = 0; h < 13; h++) {
    if (comp[h] === 0) continue;
    const p = comp[h] / N;
    if (cond && ((up === 0 && E.isTen(h)) || (E.isTen(up) && h === 0))) { pBJ += p; continue; }
    const c2 = E.cloneComp(comp); c2[h]--;
    const hv = E.handValue([up, h]);
    branches.push([p, c2, hv.total, hv.soft]);
  }
  const norm = 1 - pBJ;
  const agg = {};
  for (const [p, c2, t, s] of branches) {
    const sub = bruteDealer(c2, t, s, false);
    for (const k of Object.keys(sub)) agg[k] = (agg[k] || 0) + (p / norm) * sub[k];
  }
  let ev = 0;
  for (const k of Object.keys(agg)) {
    const t = +k;
    if (t === 22) ev += agg[k];
    else ev += agg[k] * (t > playerTotal ? -1 : t < playerTotal ? 1 : 0);
  }
  return ev;
}

/* 1. P(natural) full single deck = 2*(4/52)*(16/51) = 0.048265 */
{
  const comp = E.newComp(1);
  const p = E.pNatural(comp);
  ok("P(natural) single deck ≈ 0.04826", approx(p, 0.048265, 1e-4), p.toFixed(5));
}

/* 2. Structural strategy checks (single-deck era rules) */
{
  const opts = E.optsFor("era");
  const memo = new Map();
  const fresh = (ranks) => { const c = E.newComp(1); for (const r of ranks) c[r]--; return c; };

  // hard 20 (10+K) vs 10 -> stand
  let bp = E.bestPlay(fresh([9, 12, 9]), [9, 12], 9, opts, memo);
  ok("hard 20 v 10 -> S", bp.play === "S", JSON.stringify(bp.evs, (k, v) => typeof v === "number" ? +v.toFixed(4) : v));

  // hard 8 (2+6) vs 6 -> hit
  bp = E.bestPlay(fresh([1, 5, 5]), [1, 5], 5, opts, memo);
  ok("hard 8 v 6 -> H", bp.play === "H", bp.play);

  // hard 11 (2+9) vs 6 -> double
  bp = E.bestPlay(fresh([1, 8, 5]), [1, 8], 5, opts, memo);
  ok("hard 11 v 6 -> D", bp.play === "D", bp.play);

  // A,A vs 6 -> split
  bp = E.bestPlay(fresh([0, 0, 5]), [0, 0], 5, opts, memo);
  ok("A,A v 6 -> P", bp.play === "P", bp.play);

  // 10,10 vs 6 -> stand (never split tens)
  bp = E.bestPlay(fresh([9, 12, 5]), [9, 12], 5, opts, memo);
  ok("10,10 v 6 -> S", bp.play === "S", bp.play);

  // 5,5 vs 6 -> double or hit, never split
  bp = E.bestPlay(fresh([4, 4, 5]), [4, 4], 5, opts, memo);
  ok("5,5 v 6 in {D,H}", bp.play === "D" || bp.play === "H", bp.play);

  // The famous single-deck cell: hard 16 (10+6) vs 10.
  // Composition-dependent exact math with two tens gone -> hit.
  // Cross-checked below against an independent brute-force enumeration.
  bp = E.bestPlay(fresh([9, 5, 9]), [9, 5], 9, opts, memo);
  console.log("   hard 16 v 10 EVs:", JSON.stringify(bp.evs, (k, v) => typeof v === "number" ? +v.toFixed(4) : v), "->", bp.play);
  ok("hard 16 v 10 stand EV = brute force", approx(bp.evs.S, bruteStand(fresh([9, 5, 9]), 16, 9), 1e-9),
    bp.evs.S.toFixed(5));
  ok("hard 16 v 10 -> best of {H,S} chosen", bp.play === (bp.evs.H > bp.evs.S ? "H" : "S"), bp.play);

  // soft 18 (A+7) vs 6 single deck: double or stand both defensible
  bp = E.bestPlay(fresh([0, 6, 5]), [0, 6], 5, opts, memo);
  ok("soft 18 v 6 in {D,S}", bp.play === "D" || bp.play === "S", bp.play);
}

/* 3. Dealer bust sanity: up 6 busts more than up 10 */
{
  const opts = E.optsFor("era");
  const bust = E.dealerBustChart(opts);
  ok("dealer bust v6 > v10", bust[5].bust > bust[9].bust,
    "v6=" + (bust[5].bust * 100).toFixed(1) + "% v10=" + (bust[9].bust * 100).toFixed(1) + "%");
  ok("dealer bust v5 > v2", bust[4].bust > bust[1].bust,
    "v5=" + (bust[4].bust * 100).toFixed(1) + "% v2=" + (bust[1].bust * 100).toFixed(1) + "%");
}

/* 4. Infinite-deck model produces a sane full table (spot cells) */
{
  const opts = E.optsFor("modern");
  E.buildBasicStrategy(opts, null).then((chart) => {
    ok("inf: hard 16 v 10 -> H", chart.hard[16][9] === "H", chart.hard[16][9]);
    ok("inf: hard 12 v 4 -> S", chart.hard[12][3] === "S", chart.hard[12][3]);
    ok("inf: hard 12 v 2 -> H", chart.hard[12][1] === "H", chart.hard[12][1]);
    ok("inf: A,7 v 9 -> H", chart.soft[18][8] === "H", chart.soft[18][8]);
    ok("inf: 8,8 v 10 -> P", chart.pairs["8"][9] === "P", chart.pairs["8"][9]);
    ok("inf: 10,10 -> S", chart.pairs["10"][5] === "S", chart.pairs["10"][5]);
    ok("inf: A,A v A -> P", chart.pairs["A"][0] === "P", chart.pairs["A"][0]);
    console.log("\n--- Infinite-deck hard table (rows 5..20) ---");
    const ups = [1,2,3,4,5,6,7,8,9,0];
    console.log("total | " + ups.map(u => u===0?"A":E.RANK_CHARS[u]).join(" "));
    for (let t = 5; t <= 20; t++) console.log(String(t).padStart(4) + "  | " + ups.map(u => chart.hard[t][u]).join("  "));
    console.log("--- soft ---");
    for (let t = 13; t <= 20; t++) console.log(String(t).padStart(4) + "  | " + ups.map(u => chart.soft[t][u]).join("  "));
    console.log("--- pairs ---");
    for (const r of [1,2,3,4,5,6,7,8,9,0]) console.log(E.RANK_CHARS[r].padStart(4) + "  | " + ups.map(u => chart.pairs[E.RANK_CHARS[r]][u]).join("  "));

    /* 5. Exact single-deck full table print */
    return E.buildBasicStrategy(E.optsFor("era"), null);
  }).then((chart) => {
    console.log("\n--- Single-deck era hard table ---");
    const ups = [1,2,3,4,5,6,7,8,9,0];
    console.log("total | " + ups.map(u => u===0?"A":E.RANK_CHARS[u]).join(" "));
    for (let t = 5; t <= 20; t++) console.log(String(t).padStart(4) + "  | " + ups.map(u => chart.hard[t][u]).join("  "));
    console.log("--- soft ---");
    for (let t = 13; t <= 20; t++) console.log(String(t).padStart(4) + "  | " + ups.map(u => chart.soft[t][u]).join("  "));
    console.log("--- pairs ---");
    for (const r of [1,2,3,4,5,6,7,8,9,0]) console.log(E.RANK_CHARS[r].padStart(4) + "  | " + ups.map(u => chart.pairs[E.RANK_CHARS[r]][u]).join("  "));
    console.log("\n" + (failures === 0 ? "ALL TESTS PASSED" : failures + " TEST(S) FAILED"));
    process.exit(failures === 0 ? 0 : 1);
  }).catch((e) => { console.error("ERROR:", e); process.exit(2); });
}
