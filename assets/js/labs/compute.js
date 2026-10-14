/* ============================================================
   Lab · The IBM 704 in Your Browser — live strategy computation
   cha0smagicklabs.com · MIT
   ============================================================ */
(function () {
  "use strict";
  window.BTD = window.BTD || {};
  const L = (window.BTD.Labs = window.BTD.Labs || {});
  const E = window.BTD.Engine;

  L.compute = {
    id: "compute",
    name: "The IBM 704 in Your Browser",
    icon: "🖥️",
    blurb: "Recompute what took Thorp's mainframe hours: the full basic strategy table — then diff the 1962 single-deck answer against the modern multi-deck one.",
    mount(root) {
      const U = window.BTD.UI;
      let charts = {};        // {era, modern}
      let view = "play";      // play | S | H | D | P
      let diffMode = false;

      root.innerHTML = `
      <div class="btn-row">
        <label class="byline">View:</label>
        <select data-out="view">
          <option value="play">Recommended play</option>
          <option value="S">EV of Stand</option>
          <option value="H">EV of Hit</option>
          <option value="D">EV of Double</option>
          <option value="P">EV of Split</option>
        </select>
        <label class="byline"><input type="checkbox" data-out="diff"> Diff: single deck (1962) vs multi-deck (modern)</label>
      </div>
      <p class="feedback" data-out="prog">Idle. 340 exact decisions await.</p>
      <div class="btn-row"><button class="btn primary" data-a="compute">Compute</button></div>
      <div data-out="out"></div>`;

      const prog = root.querySelector("[data-out=prog]");
      const out = root.querySelector("[data-out=out]");
      const viewSel = root.querySelector("[data-out=view]");
      const diffBox = root.querySelector("[data-out=diff]");
      const ups = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

      function cellHTML(chartA, chartB, section, rowKey, up) {
        const a = chartA[section][rowKey][up];
        if (view === "play") {
          const diff = diffMode && chartB && chartB[section][rowKey][up] !== a;
          return `<td class="${a}${diff ? " diff" : ""}">${a}</td>`;
        }
        const ev = chartA.evs[section][rowKey][up];
        const val = ev && ev[view] !== undefined && ev[view] !== null ? ev[view].toFixed(2) : "—";
        const diff = diffMode && chartB && chartB[section][rowKey][up] !== a;
        return `<td class="${val >= 0 ? "pos" : "neg"}${diff ? " diff" : ""}">${val}</td>`;
      }

      function render() {
        const A = diffMode ? charts.era : (charts.era || charts.modern);
        if (!A) return;
        const B = diffMode ? charts.modern : null;
        const ruleNote = diffMode
          ? "Gold border = the single-deck 1962 game and the modern multi-deck model disagree. Every disagreement is composition mathematics, not taste."
          : "";
        let html = "";
        const head = "<tr><th></th>" + ups.map(u => `<th>${E.RANK_CHARS[u]}</th>`).join("") + "</tr>";
        html += `<h3>Hard totals</h3><div class="table-wrap"><table class="data">${head}`;
        for (let t = 5; t <= 20; t++)
          html += `<tr><td class="rowhead">${t}</td>${ups.map(u => cellHTML(A, B, "hard", t, u)).join("")}</tr>`;
        html += "</table></div>";
        html += `<h3>Soft totals</h3><div class="table-wrap"><table class="data">${head}`;
        for (let t = 13; t <= 20; t++)
          html += `<tr><td class="rowhead">A,${E.RANK_CHARS[t - 12]}</td>${ups.map(u => cellHTML(A, B, "soft", t, u)).join("")}</tr>`;
        html += "</table></div>";
        html += `<h3>Pairs</h3><div class="table-wrap"><table class="data">${head}`;
        for (const r of [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]) {
          const k = E.RANK_CHARS[r];
          html += `<tr><td class="rowhead">${k},${k}</td>${ups.map(u => cellHTML(A, B, "pairs", k, u)).join("")}</tr>`;
        }
        html += "</table></div>";
        html += `<p class="byline">${ruleNote}</p>`;
        out.innerHTML = html;
      }

      async function compute() {
        prog.textContent = "Computing single-deck exact table… (this is what the IBM 704 did in 1959)";
        const t0 = performance.now();
        let rows = 0;
        charts.era = await E.buildBasicStrategy(E.optsFor("era"), () => {
          rows++;
          prog.textContent = `Single deck: row ${rows}/34…`;
        });
        prog.textContent = "Computing multi-deck model…";
        charts.modern = await E.buildBasicStrategy(E.optsFor("modern"), null);
        prog.textContent = `Done: 340 exact decisions in ${Math.round(performance.now() - t0)} ms. Toggle the view or the diff — recomputation is free once the engine has run.`;
        render();
      }

      viewSel.addEventListener("change", (e) => { view = e.target.value; if (charts.era) render(); });
      diffBox.addEventListener("change", (e) => { diffMode = e.target.checked; if (charts.era && charts.modern) render(); });
      root.addEventListener("click", (ev) => {
        const a = ev.target.getAttribute && ev.target.getAttribute("data-a");
        if (a === "compute" && !compute._busy) {
          compute._busy = true;
          compute().finally(() => { compute._busy = false; });
        }
      });
    },
  };
})();
