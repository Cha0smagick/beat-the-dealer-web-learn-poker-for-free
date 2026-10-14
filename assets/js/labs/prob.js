/* ============================================================
   Lab · Composition Explorer — remove cards, watch the odds
   cha0smagicklabs.com · MIT
   ============================================================ */
(function () {
  "use strict";
  window.BTD = window.BTD || {};
  const L = (window.BTD.Labs = window.BTD.Labs || {});
  const E = window.BTD.Engine;

  L.prob = {
    id: "prob",
    name: "Composition Explorer",
    icon: "🧮",
    blurb: "Remove any cards you like from a single deck, then watch the dealer's bust rate and the exact EV of any hand move. This is the book's engine room.",
    mount(root) {
      const U = window.BTD.UI;
      let removed = new Array(13).fill(0); // per rank: 0..4 removed
      const ups = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

      root.innerHTML = `
      <h3 style="margin-top:0">The remaining deck</h3>
      <p class="byline">Click dots to remove cards from play. Four dots = all four copies still inside.</p>
      <div class="table-wrap"><table class="data" data-out="deck"></table></div>
      <div class="btn-row" style="margin:.6rem 0">
        <button class="btn small" data-a="fresh">Fresh deck</button>
        <button class="btn small" data-a="poorten">Remove 8 tens</button>
        <button class="btn small" data-a="no5s">Remove all 5s</button>
        <button class="btn small" data-a="smallout">Remove all 2–6</button>
      </div>
      <div class="two-col">
        <div class="panel-tight">
          <h3>Dealer outcomes</h3>
          <div class="field"><label>Dealer up-card</label>
            <select data-out="dup">${ups.map(u => `<option value="${u}">${E.RANK_CHARS[u]}</option>`).join("")}</select></div>
          <canvas data-out="dcv" style="width:100%;height:200px"></canvas>
          <p class="feedback" data-out="dnote"></p>
        </div>
        <div class="panel-tight">
          <h3>Hand EV explorer</h3>
          <div class="field-row">
            <label>Card 1 <select data-out="c1">${[0,1,2,3,4,5,6,7,8,9].map(r => `<option value="${r}">${E.RANK_CHARS[r]}</option>`).join("")}</select></label>
            <label>Card 2 <select data-out="c2">${[0,1,2,3,4,5,6,7,8,9].map(r => `<option value="${r}">${E.RANK_CHARS[r]}</option>`).join("")}</select></label>
            <label>Dealer <select data-out="pup">${ups.map(u => `<option value="${u}">${E.RANK_CHARS[u]}</option>`).join("")}</select></label>
          </div>
          <div class="lab-status" data-out="evs"></div>
          <p class="feedback" data-out="pnote"></p>
        </div>
      </div>`;

      const deckTable = root.querySelector("[data-out=deck]");
      const dupSel = root.querySelector("[data-out=dup]");
      const c1Sel = root.querySelector("[data-out=c1]");
      const c2Sel = root.querySelector("[data-out=c2]");
      const pupSel = root.querySelector("[data-out=pup]");
      const dcv = root.querySelector("[data-out=dcv]");
      const dnote = root.querySelector("[data-out=dnote]");
      const evsBox = root.querySelector("[data-out=evs]");
      const pnote = root.querySelector("[data-out=pnote]");

      function remaining() {
        const comp = new Int8Array(13);
        for (let r = 0; r < 13; r++) comp[r] = 4 - removed[r];
        return comp;
      }

      function renderDeck() {
        let html = "<tr><th>Rank</th>" + [0,1,2,3,4,5,6,7,8,9,10,11,12].map(r => "<th>" + E.RANK_CHARS[r] + "</th>").join("") + "</tr>";
        html += "<tr><td class='rowhead'>In deck</td>";
        for (let r = 0; r < 13; r++) {
          html += "<td data-r='" + r + "' style='cursor:pointer;white-space:nowrap'>";
          for (let d = 0; d < 4; d++) {
            html += "<span class='dot " + (d < 4 - removed[r] ? "on" : "off") + "' data-r='" + r + "' data-d='" + d + "'>●</span>";
          }
          html += "</td>";
        }
        html += "</tr>";
        deckTable.innerHTML = html;
      }

      deckTable.addEventListener("click", (ev) => {
        const r = ev.target.getAttribute && ev.target.getAttribute("data-r");
        if (r === null || r === undefined) return;
        const rank = +r;
        const inDeck = 4 - removed[rank];
        removed[rank] = inDeck > 0 ? removed[rank] + 1 : 0;
        renderDeck(); update();
      });

      root.addEventListener("click", (ev) => {
        const a = ev.target.getAttribute && ev.target.getAttribute("data-a");
        if (!a) return;
        if (a === "fresh") removed = new Array(13).fill(0);
        if (a === "poorten") { removed = new Array(13).fill(0); removed[9] = 4; removed[10] = 4; }
        if (a === "no5s") { removed = new Array(13).fill(0); removed[4] = 4; }
        if (a === "smallout") { removed = new Array(13).fill(0); for (let r = 1; r <= 5; r++) removed[r] = 4; }
        renderDeck(); update();
      });

      function update() {
        const comp = remaining();
        const total = E.compTotal(comp);
        if (total < 6) { dnote.textContent = "Leave at least a few cards in the deck."; return; }

        // dealer panel
        const up = +dupSel.value;
        const c = E.cloneComp(comp); c[up]--;
        const memo = new Map();
        const dist = E.dealerDist(c, up, false, (up === 0 || E.isTen(up)) && true, memo);
        const labels = ["17", "18", "19", "20", "21", "Bust"];
        const vals = [dist[17], dist[18], dist[19], dist[20], dist[21], dist[22]].map(x => x * 100);
        window.BTD.Charts.bars(dcv, vals, labels, { fmt: (y) => y.toFixed(0) + "%", min: 0, max: Math.max(50, ...vals) * 1.05 });
        dnote.textContent = (up === 0
          ? "Dealer natural chance with this deck: " + (100 * E.tensIn(c) / E.compTotal(c)).toFixed(1) + "% of hole cards. "
          : "") +
          "Computed by exact recursion over the remaining composition — " + total + " cards.";

        // player EV panel
        const a = +c1Sel.value, b = +c2Sel.value, pup = +pupSel.value;
        if (comp[a] <= 0 || comp[b] <= 0 || comp[pup] <= 0) {
          evsBox.innerHTML = "";
          pnote.textContent = "One of those cards has been removed from play — pick cards still in the deck.";
          return;
        }
        const pc = E.cloneComp(comp);
        pc[a]--; pc[b]--; pc[pup]--;
        if (a === b && pc[a] < 0) { pnote.textContent = "Not enough copies of that rank left."; return; }
        const memo2 = new Map();
        const bp = E.bestPlay(pc, [a, b], pup, E.optsFor("era"), memo2);
        const hv = E.handValue([a, b]);
        const rows = [["S", "Stand"], ["H", "Hit"], ["D", "Double"], ["P", "Split"]];
        let html = "";
        for (const [k, label] of rows) {
          const v = bp.evs[k];
          if (v === null || v === undefined) continue;
          html += `<div class="stat ${k === bp.play ? "best" : ""}"><span class="v">${v >= 0 ? "+" : ""}${v.toFixed(3)}</span><span class="k">${label} (${k})</span></div>`;
        }
        evsBox.innerHTML = html;
        pnote.textContent = "Hand: " + E.RANK_CHARS[a] + "+" + E.RANK_CHARS[b] + " = " + hv.total + (hv.soft ? " soft" : " hard") +
          " vs " + E.RANK_CHARS[pup] + ". Best play: " + bp.play + ". Everything recomputed over YOUR deck.";
      }

      [dupSel, c1Sel, c2Sel, pupSel].forEach((s) => s.addEventListener("change", update));
      renderDeck();
      update();
    },
  };
})();
