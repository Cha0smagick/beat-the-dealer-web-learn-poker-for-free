/* ============================================================
   Lab · Card Counting Trainer — Ten-Count & Hi-Lo
   cha0smagicklabs.com · MIT
   ============================================================ */
(function () {
  "use strict";
  window.BTD = window.BTD || {};
  const L = (window.BTD.Labs = window.BTD.Labs || {});
  const E = window.BTD.Engine;

  L.count = {
    id: "count",
    name: "Card Counting Trainer",
    icon: "🂠",
    blurb: "Count a full deck in Ten-Count or Hi-Lo. Guided mode grades every card; speed test flips the deck and checks your final count.",
    mount(root) {
      const U = window.BTD.UI;
      let sysKey = "hilo", mode = "guided", deck = [], i = 0, rc = 0, errors = 0;
      let timer = null, speed = 700, started = false;

      root.innerHTML = `
      <div class="btn-row">
        <label class="byline">System:</label>
        <select data-out="sys">
          <option value="hilo">Hi-Lo (+1 / 0 / −1)</option>
          <option value="tencount">Ten-Count (+4 / −9)</option>
        </select>
        <label class="byline">Mode:</label>
        <select data-out="mode">
          <option value="guided">Guided — grade every card</option>
          <option value="speed">Speed test — count silently</option>
        </select>
        <label class="byline">Speed:</label>
        <select data-out="speed">
          <option value="1000">Slow (1.0s)</option>
          <option value="700" selected>Normal (0.7s)</option>
          <option value="450">Fast (0.45s)</option>
          <option value="250">Blur (0.25s)</option>
        </select>
      </div>
      <div class="lab-status">
        ${U.stat("Card", "0/52")}${U.stat("Running count", "0")}${U.stat("Errors", "0")}
      </div>
      <div class="hand" data-out="row" style="margin:1rem 0"></div>
      <div class="btn-row" data-out="values"></div>
      <div class="btn-row">
        <button class="btn primary" data-a="start">Start deck</button>
        <button class="btn" data-a="restart">Restart</button>
      </div>
      <p class="feedback" data-out="note">Pick a system and press <b>Start deck</b>. A full deck always counts back to zero — use it to self-check.</p>
      <div data-out="final" style="margin-top:.6rem"></div>`;

      const row = root.querySelector("[data-out=row]");
      const values = root.querySelector("[data-out=values]");
      const note = root.querySelector("[data-out=note]");
      const final = root.querySelector("[data-out=final]");
      const stats = root.querySelectorAll(".stat .v");

      function reset() {
        if (timer) { clearTimeout(timer); timer = null; }
        deck = E.makeShoe(1); i = 0; rc = 0; errors = 0; started = false;
        row.innerHTML = ""; values.innerHTML = ""; final.innerHTML = "";
        stats[0].textContent = "0/52"; stats[1].textContent = "0"; stats[2].textContent = "0";
        note.textContent = "Pick a system and press Start deck. A full deck always counts back to zero — use it to self-check.";
      }

      function showCard() {
        const c = deck[i];
        const ce = U.cardEl(c);
        row.appendChild(ce);
        while (row.children.length > 9) row.removeChild(row.firstChild);
        ce._reveal();
        i++;
        stats[0].textContent = i + "/52";
        if (mode === "guided") {
          const S = E.COUNT_SYSTEMS[sysKey];
          // distinct count values across all ranks (avoid parsing typographic minus signs)
          const vals = [];
          for (let r = 0; r < 13; r++) { const v = S.value(r); if (vals.indexOf(v) === -1) vals.push(v); }
          values.innerHTML = "";
          vals.forEach((v) => {
            const b = U.el("button", "btn", (v > 0 ? "+" : "") + v);
            b.addEventListener("click", () => {
              if (v === S.value(c.rank)) { note.textContent = "✔ " + (v > 0 ? "+" : "") + v + " — running count " + fmt(rc + v); }
              else { errors++; stats[2].textContent = errors; note.textContent = "✘ That card is " + (S.value(c.rank) > 0 ? "+" : "") + S.value(c.rank) + ". " + S.desc; }
              rc += v;
              stats[1].textContent = fmt(rc);
              values.querySelectorAll("button").forEach((x) => { x.disabled = true; });
              if (i < 52) timer = setTimeout(showCard, 350); else finishGuided();
            });
            values.appendChild(b);
          });
          note.textContent = "What is the " + S.name + " value of this card?";
        } else if (i < 52) {
          timer = setTimeout(showCard, speed);
        } else {
          finishSpeed();
        }
      }

      function fmt(x) { return (x > 0 ? "+" : "") + x; }

      function finishGuided() {
        note.textContent = "Deck complete. Final count: " + fmt(rc) + " (a full deck must be 0). Errors: " + errors + ".";
        final.innerHTML = rc === 0
          ? "<span class='score-pill'>Self-check passed — the deck counted back to zero.</span>"
          : "<span class='score-pill bad'>Count should be 0 — you drifted. Restart and slow down.</span>";
        if (rc === 0) {
          if (sysKey === "tencount") window.BTD.Store.award("ten-counter");
          else window.BTD.Store.award("hilo-counter");
          if (errors === 0) window.BTD.Store.award("card-sense");
        }
      }

      function finishSpeed() {
        note.textContent = "Deck complete. Now: what was the final running count?";
        values.innerHTML = "";
        const input = U.el("input"); input.type = "number"; input.style.width = "6rem";
        input.setAttribute("aria-label", "Final running count");
        const ok = U.el("button", "btn primary", "Check");
        values.appendChild(input); values.appendChild(ok);
        ok.addEventListener("click", () => {
          const guess = parseInt(input.value, 10);
          const good = guess === rc;
          if (!good) errors++;
          final.innerHTML = good
            ? "<span class='score-pill'>Correct — " + fmt(rc) + ". Deck counted.</span>"
            : "<span class='score-pill bad'>You said " + (isNaN(guess) ? "?" : fmt(guess)) + "; the deck was " + fmt(rc) + ".</span>";
          if (good) {
            if (sysKey === "tencount") window.BTD.Store.award("ten-counter");
            else window.BTD.Store.award("hilo-counter");
            if (errors === 0) window.BTD.Store.award("card-sense");
          }
          values.innerHTML = "";
        });
      }

      root.addEventListener("click", (ev) => {
        const a = ev.target.getAttribute && ev.target.getAttribute("data-a");
        if (!a) return;
        if (a === "start") {
          if (started) { reset(); }
          started = true;
          timer = setTimeout(showCard, 400);
          note.textContent = mode === "guided"
            ? "What is the " + E.COUNT_SYSTEMS[sysKey].name + " value of each card?"
            : "Count silently — the cards will flip on their own.";
        }
        if (a === "restart") reset();
      });
      root.querySelector("[data-out=sys]").addEventListener("change", (e) => { sysKey = e.target.value; reset(); });
      root.querySelector("[data-out=mode]").addEventListener("change", (e) => { mode = e.target.value; reset(); });
      root.querySelector("[data-out=speed]").addEventListener("change", (e) => { speed = +e.target.value; });

      return () => { if (timer) clearTimeout(timer); };
    },
  };
})();
