/* ============================================================
   Lab · Monte Carlo — flat bettor vs Hi-Lo counter, same cards
   cha0smagicklabs.com · MIT
   ============================================================ */
(function () {
  "use strict";
  window.BTD = window.BTD || {};
  const L = (window.BTD.Labs = window.BTD.Labs || {});
  const E = window.BTD.Engine;

  L.monte = {
    id: "monte",
    name: "Flat Bet vs Counter",
    icon: "📈",
    blurb: "Two players, the exact same cards, one difference: the counter bets by the true count. Watch the edge get monetized — or not.",
    mount(root) {
      const U = window.BTD.UI;
      let chart = null, running = false, cancel = false, timer = null;

      root.innerHTML = `
      <p class="byline">Single-deck shoes (so the count moves fast). Decisions from the multi-deck basic chart for both players — the ONLY differences are bet sizing and insurance. Splits are played as hit/stand (a slight undercount of player edge, noted for honesty).</p>
      <div class="btn-row">
        <label class="byline">Hands:</label>
        <select data-out="n">
          <option value="5000">5,000</option>
          <option value="10000">10,000</option>
          <option value="20000" selected>20,000</option>
          <option value="40000">40,000</option>
        </select>
        <button class="btn primary" data-a="run">Run simulation</button>
        <button class="btn danger" data-a="cancel" disabled>Cancel</button>
      </div>
      <p class="feedback" data-out="prog">The simulation plays both players on identical card sequences, hand by hand.</p>
      <canvas data-out="cv" style="width:100%;height:300px"></canvas>
      <div class="lab-status" data-out="stats"></div>
      <p class="byline" data-out="verdict"></p>`;

      const prog = root.querySelector("[data-out=prog]");
      const cv = root.querySelector("[data-out=cv]");
      const statsBox = root.querySelector("[data-out=stats]");
      const verdict = root.querySelector("[data-out=verdict]");
      const cancelBtn = root.querySelector("[data-a=cancel]");

      /* ---------- basic strategy lookup (modern chart) ---------- */
      function decide(chart, cards, up) {
        const hv = E.handValue(cards);
        const pair = cards.length === 2 && cards[0].rank === cards[1].rank;
        if (pair) {
          const k = E.RANK_CHARS[cards[0].rank];
          const p = chart.pairs[k][up];
          if (p) return p;
        }
        if (hv.total >= 21) return "S";
        const row = hv.soft && hv.total >= 13 && hv.total <= 20 ? chart.soft[hv.total] : chart.hard[Math.max(5, Math.min(20, hv.total))];
        return row[up];
      }

      /* ---------- one hand on a shoe ---------- */
      function playHand(shoe, state) {
        const dealtRanks = state.dealtRanks;
        let p = [shoe.pop(), shoe.pop()];
        const up = shoe.pop().rank;
        const hole = shoe.pop();
        dealtRanks.push(p[0].rank, p[1].rank, up);

        const betC = E.betUnitsHiLo(E.trueCount(E.runningCount(dealtRanks, "hilo"), shoe.length, 52));

        // naturals & peek
        const pNat = E.handValue(p).total === 21;
        const dNat = E.handValue([up, hole]).total === 21;
        let insC = 0;
        if (up === 0 && !pNat) {
          const comp = E.shoeComp(shoe); comp[hole.rank]++;
          const dens = E.tensIn(comp) / E.compTotal(comp);
          if (dens > 1 / 3) { insC = Math.ceil(betC / 2); state.wagerC += insC; }
        }
        if (dNat && (up === 0 || E.isTen(up))) {
          dealtRanks.push(hole.rank);
          if (pNat) { state.netF += 0; state.netC += 0; }
          else { state.netF -= 1; state.netC -= betC; }
          if (insC) state.netC += insC * 2;
          state.hands++;
          state.wagerF += 1; state.wagerC += betC;
          return { pn: pNat ? 0 : -1, bn: 0 };
        }
        if (pNat) {
          dealtRanks.push(hole.rank);
          state.hands++; state.wagerF += 1; state.wagerC += betC;
          state.netF += 1.5; state.netC += 1.5 * betC;
          return { pn: 1.5, bn: 0 };
        }

        // player plays (double/split once), dealer draws S17
        let unitF = 1, unitC = betC;
        let hands = [{ cards: p, fromSplit: false }];
        // initial decision per hand
        const queue = hands.slice();
        while (queue.length) {
          const h = queue.shift();
          let d = decide(chart, h.cards, up);
          if (d === "D" && h.cards.length === 2 && !h.fromSplit) {
            const c = shoe.pop(); h.cards.push(c); dealtRanks.push(c.rank);
            unitF *= 2; unitC *= 2;
            continue;
          }
          if (d === "D") d = "H"; // can't double after hits
          if (d === "P" && h.cards.length === 2 && !h.fromSplit) {
            const c1 = shoe.pop(), c2 = shoe.pop();
            dealtRanks.push(c1.rank, c2.rank);
            h.fromSplit = true;
            const h2 = { cards: [h.cards.pop(), c2], fromSplit: true };
            h.cards.push(c1);
            // each split hand gets its play from the chart; treat 'P' as H
            hands.push(h2);
            queue.push(h, h2);
            unitF *= 2; unitC *= 2;
            continue;
          }
          if (d === "P") d = "H"; // no resplit in this simulation
          if (d === "H") {
            // hit loop
            for (;;) {
              const t = E.handValue(h.cards).total;
              if (t >= 21) break;
              const hv = E.handValue(h.cards);
              const row = hv.soft && hv.total >= 13 && hv.total <= 20 ? chart.soft[hv.total] : chart.hard[Math.max(5, Math.min(20, hv.total))];
              if (row[up] !== "H") break;
              const c = shoe.pop(); h.cards.push(c); dealtRanks.push(c.rank);
            }
          }
        }
        // dealer
        dealtRanks.push(hole.rank);
        const dhand = [up, hole];
        while (E.handValue(dhand).total < 17) {
          const c = shoe.pop(); dhand.push(c); dealtRanks.push(c.rank);
        }
        const dt = E.handValue(dhand).total;
        let pn = 0;
        for (const h of hands) {
          const pt = E.handValue(h.cards).total;
          if (pt > 21) pn -= 1;
          else if (dt > 21 || pt > dt) pn += 1;
          else if (pt === dt) pn += 0;
          else pn -= 1;
        }
        state.hands++;
        state.wagerF += unitF; state.wagerC += unitC;
        state.netF += pn * unitF; state.netC += pn * unitC;
        return { pn, bn: 0 };
      }

      /* ---------- chunked runner ---------- */
      async function run(totalHands) {
        running = true; cancel = false;
        cancelBtn.disabled = false;
        if (!chart) {
          prog.textContent = "Precomputing the basic strategy chart…";
          chart = await E.buildBasicStrategy(E.optsFor("modern"), null);
        }
        const state = { netF: 0, netC: 0, wagerF: 0, wagerC: 0, hands: 0, dealtRanks: [] };
        let shoe = E.makeShoe(1);
        const ptsF = [0], ptsC = [0];
        let done = 0;
        const t0 = performance.now();

        function chunk() {
          if (cancel) { finish(true); return; }
          const end = Math.min(done + 1000, totalHands);
          for (; done < end; done++) {
            if (shoe.length < 25) { shoe = E.makeShoe(1); state.dealtRanks = []; }
            playHand(shoe, state);
            if (done % 25 === 0) { ptsF.push(state.netF); ptsC.push(state.netC); }
          }
          prog.textContent = `Simulating… ${done.toLocaleString("en-US")} / ${totalHands.toLocaleString("en-US")} hands (${Math.round(100 * done / totalHands)}%)`;
          window.BTD.Charts.line(cv, [
            { label: "Flat bettor", color: "#e0454f", data: ptsF },
            { label: "Hi-Lo counter", color: "#58d68d", data: ptsC },
          ], { fmt: (y) => Math.round(y) + "u", zero: true });
          if (done < totalHands) { timer = setTimeout(chunk, 0); }
          else finish(false);
        }

        function finish(aborted) {
          running = false;
          cancelBtn.disabled = true;
          const rf = state.netF / state.wagerF, rc2 = state.netC / state.wagerC;
          statsBox.innerHTML =
            U.stat("Hands", state.hands.toLocaleString("en-US")) +
            U.stat("Flat: net", state.netF.toFixed(0) + "u") +
            U.stat("Flat: ROI", (rf * 100).toFixed(2) + "%") +
            U.stat("Counter: net", state.netC.toFixed(0) + "u") +
            U.stat("Counter: ROI", (rc2 * 100).toFixed(2) + "%") +
            U.stat("Counter avg bet", (state.wagerC / Math.max(1, state.hands)).toFixed(2) + "u");
          verdict.textContent = aborted
            ? "Simulation cancelled."
            : `Both players saw the identical ${state.hands.toLocaleString("en-US")} hands. The flat bettor ${state.netF >= 0 ? "survived" : "bled"} at ${(rf * 100).toFixed(2)}% of money wagered; the counter turned the SAME cards into ${(rc2 * 100).toFixed(2)}% by betting more only when the deck was rich. Same cards — different money. (Run took ${Math.round(performance.now() - t0)} ms.)`;
          window.BTD.Store.record("monteHands", state.hands);
          window.BTD.Store.record("monteRoi", rc2);
        }

        chunk();
      }

      root.addEventListener("click", (ev) => {
        const a = ev.target.getAttribute && ev.target.getAttribute("data-a");
        if (a === "run" && !running) { verdict.textContent = ""; run(+root.querySelector("[data-out=n]").value); }
        if (a === "cancel") cancel = true;
      });

      return () => { cancel = true; if (timer) clearTimeout(timer); };
    },
  };
})();
