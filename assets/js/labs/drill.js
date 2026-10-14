/* ============================================================
   Lab · Basic Strategy Drill — engine-graded decisions
   cha0smagicklabs.com · MIT
   ============================================================ */
(function () {
  "use strict";
  window.BTD = window.BTD || {};
  const L = (window.BTD.Labs = window.BTD.Labs || {});
  const E = window.BTD.Engine;

  L.drill = {
    id: "drill",
    name: "Basic Strategy Drill",
    icon: "🎯",
    blurb: "Random hands, graded by the exact engine. Every wrong answer shows you the expected values — losing less is a skill too.",
    mount(root) {
      const U = window.BTD.UI;
      let opts = E.optsFor("era"), includePairs = true, includeSoft = true;
      let hands = 0, right = 0, streak = 0, best = 0;
      let hand = [], up = 0, comp = null, bp = null, memo = new Map();

      root.innerHTML = `
      <div class="btn-row">
        <label class="byline">Rule set:</label>
        <select data-out="opts">
          <option value="era">1962 single deck (exact)</option>
          <option value="modern">Modern multi-deck</option>
        </select>
        <label class="byline"><input type="checkbox" data-out="soft" checked> soft hands</label>
        <label class="byline"><input type="checkbox" data-out="pairs" checked> pairs</label>
      </div>
      <div class="lab-status">
        ${U.stat("Hands", "0")}${U.stat("Correct", "—")}${U.stat("Streak", "0")}${U.stat("Best streak", "0")}
      </div>
      <div class="hand-label">Dealer shows</div>
      <div class="hand" data-out="dealer"></div>
      <div class="hand-label">Your hand <span class="hand-total" data-out="total"></span></div>
      <div class="hand" data-out="player"></div>
      <div class="btn-row" data-out="actions" style="margin-top:1rem"></div>
      <p class="feedback" data-out="note"></p>
      <p class="byline" data-out="evs"></p>`;

      const dealerRow = root.querySelector("[data-out=dealer]");
      const playerRow = root.querySelector("[data-out=player]");
      const actions = root.querySelector("[data-out=actions]");
      const note = root.querySelector("[data-out=note]");
      const evsLine = root.querySelector("[data-out=evs]");
      const total = root.querySelector("[data-out=total]");
      const stats = root.querySelectorAll(".stat .v");

      function randomRank() { return Math.floor(Math.random() * 13); }

      function freshDeal() {
        if (opts.mode === "exact") {
          comp = E.newComp(1);
          const take = () => {
            let r;
            do { r = randomRank(); } while (comp[r] <= 0);
            comp[r]--;
            return r;
          };
          hand = [take(), take()];
          up = take();
        } else {
          comp = null;
          hand = [randomRank(), randomRank()];
          up = randomRank();
        }
      }

      function categoryOk() {
        const hv = E.handValue(hand);
        const pair = hand[0] === hand[1];
        if (pair) return includePairs;
        return hv.soft ? includeSoft : true;
      }

      function deal() {
        memo = new Map();
        note.textContent = ""; evsLine.textContent = ""; actions.innerHTML = "";
        for (let k = 0; k < 200; k++) { freshDeal(); if (categoryOk()) break; }
        const dh = dealerRow; dh.innerHTML = "";
        dh.appendChild(U.cardEl({ rank: up, suit: (up * 2 + 1) % 4 }));
        const ph = playerRow; ph.innerHTML = "";
        hand.forEach((r, ix) => ph.appendChild(U.cardEl({ rank: r, suit: (r + ix * 3) % 4 })));
        const hv = E.handValue(hand);
        total.textContent = hv.total + (hv.soft ? " soft" : " hard") + (hand[0] === hand[1] ? " · pair" : "");
        bp = E.bestPlay(comp, hand, up, opts, memo);
        renderActions();
      }

      function renderActions() {
        actions.innerHTML = "";
        const hv = E.handValue(hand);
        const can = {
          H: true, S: true,
          D: hand.length === 2,
          P: hand.length === 2 && hand[0] === hand[1],
        };
        [["H", "Hit"], ["S", "Stand"], ["D", "Double"], ["P", "Split"]].forEach(([k, label]) => {
          if (!can[k]) return;
          const b = U.el("button", "btn primary", label);
          b.addEventListener("click", () => answer(k));
          actions.appendChild(b);
        });
      }

      function answer(play) {
        hands++;
        const good = play === bp.play;
        if (good) { right++; streak++; best = Math.max(best, streak); }
        else streak = 0;
        stats[0].textContent = hands;
        stats[1].textContent = Math.round((100 * right) / hands) + "%";
        stats[2].textContent = streak;
        stats[3].textContent = best;

        const parts = [];
        for (const k of ["S", "H", "D", "P"]) {
          const v = bp.evs[k];
          if (v === null || v === undefined) continue;
          parts.push(k + " " + (v >= 0 ? "+" : "") + v.toFixed(3));
        }
        evsLine.textContent = "Engine EVs: " + parts.join("  ·  ");
        note.innerHTML = good
          ? "<span class='good'>✔ Correct — " + playName(bp.play) + ".</span>" + (bp.evs[play] < 0 ? " (It still loses money on average — some hands are about losing less.)" : "")
          : "<span class='bad'>✘ The engine plays <b>" + playName(bp.play) + "</b> (" + (bp.evs[bp.play] >= 0 ? "+" : "") + bp.evs[bp.play].toFixed(3) +
            ") over " + playName(play) + " (" + (bp.evs[play] >= 0 ? "+" : "") + (bp.evs[play] || 0).toFixed(3) + ").</span>";

        actions.innerHTML = "";
        const nx = U.el("button", "btn primary", "Next hand");
        nx.addEventListener("click", deal);
        actions.appendChild(nx);

        if (hands >= 20 && right / hands >= 0.9) window.BTD.Store.award("basic-adept");
        window.BTD.Store.addXP(good ? 2 : 1);
      }

      function playName(p) {
        return { H: "Hit", S: "Stand", D: "Double", P: "Split" }[p] || p;
      }

      root.querySelector("[data-out=opts]").addEventListener("change", (e) => { opts = E.optsFor(e.target.value); deal(); });
      root.querySelector("[data-out=soft]").addEventListener("change", (e) => { includeSoft = e.target.checked; deal(); });
      root.querySelector("[data-out=pairs]").addEventListener("change", (e) => { includePairs = e.target.checked; deal(); });

      deal();
    },
  };
})();
