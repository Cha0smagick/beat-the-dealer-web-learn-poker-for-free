/* ============================================================
   BTD.Engine — blackjack math core
   Exact single-deck composition EV + infinite-deck model.
   Part of "Beat the Dealer — The Interactive Study"
   cha0smagicklabs.com · MIT
   ------------------------------------------------------------
   Conventions:
   - Ranks are indices 0..12:  A,2,3,4,5,6,7,8,9,10,J,Q,K
   - Ten-valued ranks: 9,10,11,12
   - All ev* functions receive `comp`, an Int8Array(13) of the
     UNSEEN cards (player cards and dealer up-card removed).
   - Peek convention: EVs vs A/10 up-cards are conditioned on
     the dealer not having a natural (standard basic-strategy
     tables use the same convention).
   - "Infinite deck" mode (comp === null) draws each rank with
     probability 1/13 — the classic 4/8-deck approximation.
   ============================================================ */
(function () {
  "use strict";
  window.BTD = window.BTD || {};

  const RANK_CHARS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const RANK_NAMES = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
  const SUITS = ["spades", "hearts", "diamonds", "clubs"];

  const isTen = (r) => r >= 9;
  const bjValue = (r) => (r === 0 ? 11 : isTen(r) ? 10 : r + 1);

  function handValue(cards) {
    let total = 0, aces = 0;
    for (const r of cards) {
      total += bjValue(r);
      if (r === 0) aces++;
    }
    let soft = aces > 0;
    while (total > 21 && aces > 0) { total -= 10; aces--; }
    if (aces === 0) soft = false;
    return { total, soft };
  }
  const isNatural = (cards) =>
    cards.length === 2 && handValue(cards).total === 21;
  const naturalPair = (up, hole) =>
    (up === 0 && isTen(hole)) || (isTen(up) && hole === 0);

  /* ---------- composition helpers ---------- */
  function newComp(decks) {
    const c = new Int8Array(13);
    for (let r = 0; r < 13; r++) c[r] = 4 * decks;
    return c;
  }
  const cloneComp = (c) => Int8Array.from(c);
  const compTotal = (c) => { let n = 0; for (let i = 0; i < 13; i++) n += c[i]; return n; };
  function compKey(c) {
    if (c === null) return "I";
    let s = "";
    for (let i = 0; i < 13; i++) s += String.fromCharCode(48 + c[i]);
    return s;
  }
  const tensIn = (c) => c[9] + c[10] + c[11] + c[12];

  /* ---------- dealer outcome distribution ----------
     Returns Float64Array(23): index 17..21 = final totals,
     index 22 = bust. Conditioned on no natural when condNoBJ. */
  function dealerDist(comp, up, h17, condNoBJ, memo) {
    const key = compKey(comp) + "|" + up + (h17 ? "h" : "s");
    if (memo.has(key)) return memo.get(key);
    const dist = new Float64Array(23);
    const cond = condNoBJ && (up === 0 || isTen(up));

    if (comp === null) {
      let pBJ = 0;
      const branches = [];
      for (let h = 0; h < 13; h++) {
        const p = 1 / 13;
        if (cond && naturalPair(up, h)) { pBJ += p; continue; }
        const hv = handValue([up, h]);
        branches.push([p, hv.total, hv.soft]);
      }
      const norm = 1 - pBJ;
      for (const [p, t, s] of branches) {
        const sub = new Float64Array(23);
        drawDealerInf(t, h17, sub, s);
        for (let i = 17; i <= 22; i++) dist[i] += (p / norm) * sub[i];
      }
      memo.set(key, dist);
      return dist;
    }

    const N = compTotal(comp);
    let pBJ = 0;
    const branches = [];
    for (let h = 0; h < 13; h++) {
      if (comp[h] === 0) continue;
      const p = comp[h] / N;
      if (cond && naturalPair(up, h)) { pBJ += p; continue; }
      const c2 = cloneComp(comp);
      c2[h]--;
      branches.push([p, c2, h]);
    }
    const norm = 1 - pBJ;
    if (norm <= 0) { dist[21] = 1; memo.set(key, dist); return dist; } // degenerate
    // play out each branch
    for (const [p, c2, h] of branches) {
      const hv = handValue([up, h]);
      const sub = drawDealer(c2, hv.total, hv.soft, h17, memo);
      for (let i = 17; i <= 22; i++) dist[i] += (p / norm) * sub[i];
    }
    memo.set(key, dist);
    return dist;
  }

  function drawDealer(comp, total, soft, h17, memo) {
    const key = compKey(comp) + "|" + total + (soft ? "s" : "h");
    if (memo.has(key)) return memo.get(key);
    const dist = new Float64Array(23);
    if (total > 21) { dist[22] = 1; return dist; }
    if (total >= 17 && (!soft || !h17)) { dist[total] = 1; return dist; }
    if (comp === null) { drawDealerInf(total, h17, dist, soft); return dist; }
    const N = compTotal(comp);
    for (let r = 0; r < 13; r++) {
      if (comp[r] === 0) continue;
      const p = comp[r] / N;
      const c2 = cloneComp(comp);
      c2[r]--;
      let t2 = total + bjValue(r), s2 = soft;
      if (r === 0) { if (s2) t2 = total + 1; else s2 = true; }
      while (t2 > 21 && s2) { t2 -= 10; s2 = false; }
      const sub = drawDealer(c2, t2, s2, h17, memo);
      for (let i = 17; i <= 22; i++) dist[i] += p * sub[i];
    }
    memo.set(key, dist);
    return dist;
  }

  function drawDealerInf(total, h17, dist, soft) {
    if (total > 21) { dist[22] = 1; return; }
    if (total >= 17 && (!soft || !h17)) { dist[total] = 1; return; }
    for (let r = 0; r < 13; r++) {
      const p = 1 / 13;
      let t2 = total + bjValue(r), s2 = soft;
      if (r === 0) { if (s2) t2 = total + 1; else s2 = true; }
      while (t2 > 21 && s2) { t2 -= 10; s2 = false; }
      const sub = new Float64Array(23);
      drawDealerInf(t2, h17, sub, s2);
      for (let i = 17; i <= 22; i++) dist[i] += p * sub[i];
    }
  }

  /* ---------- EV primitives ---------- */
  function evStand(comp, total, up, opts, memo) {
    const key = compKey(comp) + "|S" + total + "u" + up + opts.id;
    if (memo.has(key)) return memo.get(key);
    const dist = dealerDist(comp, up, opts.h17, (up === 0 || isTen(up)) && opts.peek, memo);
    let ev = 0;
    for (let t = 17; t <= 21; t++) {
      if (dist[t] === 0) continue;
      ev += dist[t] * (t > total ? -1 : t < total ? 1 : 0);
    }
    ev += dist[22]; // dealer busts
    memo.set(key, ev);
    return ev;
  }

  function evHit(comp, total, soft, up, opts, memo) {
    if (total > 21) return -1;
    const key = compKey(comp) + "|H" + total + (soft ? "s" : "h") + "u" + up + opts.id;
    if (memo.has(key)) return memo.get(key);
    let ev = 0, norm = 0;
    const N = comp === null ? 13 : compTotal(comp);
    for (let r = 0; r < 13; r++) {
      const p = comp === null ? 1 / 13 : (comp[r] === 0 ? 0 : comp[r] / N);
      if (p === 0) continue;
      norm += p;
      let t2 = total + bjValue(r), s2 = soft;
      if (r === 0) { if (s2) t2 = total + 1; else s2 = true; }
      while (t2 > 21 && s2) { t2 -= 10; s2 = false; }
      let e;
      if (t2 > 21) e = -1;
      else {
        let c2 = comp;
        if (comp !== null) { c2 = cloneComp(comp); c2[r]--; }
        const s = evStand(c2, t2, up, opts, memo);
        const h = evHit(c2, t2, s2, up, opts, memo);
        e = Math.max(s, h);
      }
      ev += p * e;
    }
    ev /= norm;
    memo.set(key, ev);
    return ev;
  }

  function evDouble(comp, total, soft, up, opts, memo) {
    let ev = 0, norm = 0;
    const N = comp === null ? 13 : compTotal(comp);
    for (let r = 0; r < 13; r++) {
      const p = comp === null ? 1 / 13 : (comp[r] === 0 ? 0 : comp[r] / N);
      if (p === 0) continue;
      norm += p;
      let t2 = total + bjValue(r), s2 = soft;
      if (r === 0) { if (s2) t2 = total + 1; else s2 = true; }
      while (t2 > 21 && s2) { t2 -= 10; s2 = false; }
      let c2 = comp;
      if (comp !== null) { c2 = cloneComp(comp); c2[r]--; }
      ev += p * (t2 > 21 ? -1 : evStand(c2, t2, up, opts, memo));
    }
    return 2 * (ev / norm);
  }

  // Split: expected value of ONE split hand, doubled (shared-deck
  // correlation ignored — standard approximation, documented).
  function evSplit(comp, pairRank, up, opts, memo) {
    const evOne = splitHandEV(comp, pairRank, up, opts, memo, 1);
    return 2 * evOne;
  }
  function splitHandEV(comp, pairRank, up, opts, memo, depth) {
    let ev = 0, norm = 0;
    const N = comp === null ? 13 : compTotal(comp);
    for (let r = 0; r < 13; r++) {
      const p = comp === null ? 1 / 13 : (comp[r] === 0 ? 0 : comp[r] / N);
      if (p === 0) continue;
      norm += p;
      let c2 = comp;
      if (comp !== null) { c2 = cloneComp(comp); c2[r]--; }
      const cards = [pairRank, r];
      const hv = handValue(cards);
      let e;
      if (isNatural(cards)) {
        // 21 after split pays 1:1, not 3:2
        e = evStand(c2, 21, up, opts, memo);
      } else if (r === pairRank && depth > 0 && opts.resplit) {
        const again = splitHandEV(c2, pairRank, up, opts, memo, depth - 1);
        const s = evStand(c2, hv.total, up, opts, memo);
        const h = evHit(c2, hv.total, hv.soft, up, opts, memo);
        const d = hv.total <= 11 || hv.soft ? evDouble(c2, hv.total, hv.soft, up, opts, memo) : -Infinity;
        const base = Math.max(s, h, opts.das ? d : -Infinity);
        e = Math.max(base, 2 * again);
      } else {
        const s = evStand(c2, hv.total, up, opts, memo);
        const h = evHit(c2, hv.total, hv.soft, up, opts, memo);
        const d = opts.das ? evDouble(c2, hv.total, hv.soft, up, opts, memo) : -Infinity;
        e = Math.max(s, h, d);
      }
      ev += p * e;
    }
    return ev / norm;
  }

  /* ---------- decisions ---------- */
  function bestPlay(comp, cards, up, opts, memo) {
    memo = memo || new Map();
    const hv = handValue(cards);
    const pair = cards.length === 2 && bjValue(cards[0]) === bjValue(cards[1]);
    const canDouble = cards.length === 2;
    const S = evStand(comp, hv.total, up, opts, memo);
    const H = evHit(comp, hv.total, hv.soft, up, opts, memo);
    const D = canDouble ? evDouble(comp, hv.total, hv.soft, up, opts, memo) : -Infinity;
    const P = pair ? evSplit(comp, cards[0], up, opts, memo) : -Infinity;
    let play = "S", best = S;
    if (H > best) { best = H; play = "H"; }
    if (D > best) { best = D; play = "D"; }
    if (P > best) { best = P; play = "P"; }
    return { play, ev: best, evs: { S, H, D, P }, total: hv.total, soft: hv.soft };
  }

  function evNatural(comp, up, opts, memo) {
    // Player natural, dealer peeked no-blackjack: pays 3:2.
    const dist = dealerDist(comp, up, opts.h17, true, memo);
    const pPush = dist[21];
    return 1.5 * (1 - pPush);
  }

  /* ---------- full strategy tables (async, chunked) ---------- */
  const HARD_COMBOS = (() => {
    const m = {};
    for (let t = 5; t <= 11; t++) m[t] = [1, t - 3];         // 2 + (t-2)
    for (let t = 12; t <= 19; t++) m[t] = [9, t - 11];       // 10 + (t-10)
    m[20] = [9, 12];                                          // 10 + K (non-pair)
    return m;
  })();

  async function buildBasicStrategy(opts, onProgress) {
    const memo = new Map();
    const ups = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]; // 2..9,10,A
    const tick = async () => { if (onProgress) onProgress(); await new Promise((r) => setTimeout(r, 0)); };
    const fresh = (extraCards) => {
      let c = opts.mode === "exact" ? newComp(1) : null;
      if (c !== null) for (const r of extraCards) c[r]--;
      return c;
    };
    const chart = { hard: {}, soft: {}, pairs: {}, evs: { hard: {}, soft: {}, pairs: {} } };

    for (let t = 5; t <= 20; t++) {
      chart.hard[t] = {}; chart.evs.hard[t] = {};
      const combo = HARD_COMBOS[t];
      for (const up of ups) {
        const comp = fresh([...combo, up]);
        const bp = bestPlay(comp, combo, up, opts, memo);
        chart.hard[t][up] = bp.play;
        chart.evs.hard[t][up] = bp.evs;
      }
      await tick();
    }
    for (let t = 13; t <= 20; t++) {
      chart.soft[t] = {}; chart.evs.soft[t] = {};
      const combo = [0, t - 12]; // A + card of value (t-11): rank index t-12
      for (const up of ups) {
        const comp = fresh([...combo, up]);
        const bp = bestPlay(comp, combo, up, opts, memo);
        chart.soft[t][up] = bp.play;
        chart.evs.soft[t][up] = bp.evs;
      }
      await tick();
    }
    for (const r of [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]) {
      const label = RANK_CHARS[r];
      chart.pairs[label] = {}; chart.evs.pairs[label] = {};
      for (const up of ups) {
        const comp = fresh([r, r, up]);
        const bp = bestPlay(comp, [r, r], up, opts, memo);
        chart.pairs[label][up] = bp.play;
        chart.evs.pairs[label][up] = bp.evs;
      }
      await tick();
    }
    return chart;
  }

  function dealerBustChart(opts) {
    const memo = new Map();
    const out = {};
    const ups = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    const comp = opts.mode === "exact" ? newComp(1) : null;
    for (const up of ups) {
      const c = comp === null ? null : (() => { const c2 = cloneComp(comp); c2[up]--; return c2; })();
      const dist = dealerDist(c, up, opts.h17, (up === 0 || isTen(up)) && opts.peek, memo);
      out[up] = { bust: dist[22], bj: 0 };
    }
    return out;
  }

  /* ---------- probability of natural (composition-aware) ---------- */
  function pNatural(comp) {
    const N = compTotal(comp);
    if (N < 2) return 0;
    const tens = tensIn(comp);
    return 2 * (comp[0] / N) * (tens / (N - 1));
  }
  function pDealerBJ(comp, up) {
    const N = compTotal(comp);
    if (up === 0) return tensIn(comp) / N;
    if (isTen(up)) return comp[0] / N;
    return 0;
  }
  const evInsurance = (comp) => 3 * pDealerBJ(comp, 0) - 1; // pays 2:1

  /* ---------- shoe / dealing (for labs) ---------- */
  function makeShoe(decks) {
    const cards = [];
    for (let d = 0; d < decks; d++)
      for (let s = 0; s < 4; s++)
        for (let r = 0; r < 13; r++) cards.push({ rank: r, suit: s });
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }
  function shoeComp(cards) {
    const c = new Int8Array(13);
    for (const card of cards) c[card.rank]++;
    return c;
  }

  /* ---------- counting systems ---------- */
  const COUNT_SYSTEMS = {
    tencount: {
      name: "Ten-Count",
      short: "TC-10",
      desc: "Thorp's 1962 system. A through 9 count +4; all ten-valued cards count −9.",
      value: (r) => (isTen(r) ? -9 : 4),
      labels: ["+4", "−9"],
    },
    hilo: {
      name: "Hi-Lo",
      short: "Hi-Lo",
      desc: "The second-edition simple point count. 2–6 count +1; 7–9 count 0; 10–A count −1.",
      value: (r) => (r >= 1 && r <= 5 ? 1 : r >= 6 && r <= 8 ? 0 : -1),
      labels: ["+1", "0", "−1"],
    },
  };
  function runningCount(dealtRanks, system) {
    let rc = 0;
    for (const r of dealtRanks) rc += COUNT_SYSTEMS[system].value(r);
    return rc;
  }
  function trueCount(rc, unseenCards, perDeck) {
    perDeck = perDeck || 52;
    const decks = Math.max(unseenCards / perDeck, 0.25);
    return rc / decks;
  }
  function betUnitsHiLo(tc) {
    if (tc <= 1) return 1;
    return Math.min(12, Math.pow(2, Math.floor(tc) - 1));
  }
  function betUnitsTenCount(tens, others) {
    const r0 = 16 / 36;
    if (others <= 0) return 12;
    const ratio = tens / others;
    return Math.max(1, Math.min(12, Math.round(Math.pow(ratio / r0, 2))));
  }

  /* ---------- option presets ---------- */
  function optsFor(preset) {
    const base = { h17: false, das: false, resplit: false, peek: true, id: "" };
    if (preset === "era") Object.assign(base, { mode: "exact", decks: 1 });
    else Object.assign(base, { mode: "inf", decks: 8, das: true, resplit: true });
    base.id = (base.mode === "exact" ? "X" : "I") + (base.h17 ? "h" : "s") + (base.das ? "d" : "n") + (base.resplit ? "r" : "n");
    return base;
  }

  window.BTD.Engine = {
    RANK_CHARS, RANK_NAMES, SUITS, isTen, bjValue, handValue, isNatural,
    newComp, cloneComp, compTotal, compKey, tensIn,
    dealerDist, evStand, evHit, evDouble, evSplit, bestPlay, evNatural,
    buildBasicStrategy, dealerBustChart, pNatural, pDealerBJ, evInsurance,
    makeShoe, shoeComp,
    COUNT_SYSTEMS, runningCount, trueCount, betUnitsHiLo, betUnitsTenCount,
    optsFor, HARD_COMBOS,
  };
})();
