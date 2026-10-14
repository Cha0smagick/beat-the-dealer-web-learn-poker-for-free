/* ============================================================
   Lab · Playable Table — 1-deck shoe, live count, engine coach
   Rules: Thorp-era (S17, double any two, split once, no resplit,
   peek on A/10). cha0smagicklabs.com · MIT
   ============================================================ */
(function () {
  "use strict";
  window.BTD = window.BTD || {};
  const L = (window.BTD.Labs = window.BTD.Labs || {});
  const E = window.BTD.Engine;
  const CUT = 13;          // ~75% penetration on a 52-card shoe
  const SYS = "hilo";      // count displayed at the table

  L.table = {
    id: "table",
    name: "Play the Table",
    icon: "♠",
    blurb: "A single-deck 1962 game with the count on screen and the engine whispering the correct play. Bet, deal, double, split, insure — and watch the shoe.",
    mount(root) {
      const U = window.BTD.UI;
      const S = {
        bank: 1000, bet: 10, shoe: [], dealt: [],
        hands: [], dealer: [], hole: null, phase: "bet", active: 0,
        insurance: 0, coach: true, memo: new Map(), log: "Welcome to the table. Place a bet and deal.",
      };

      root.innerHTML = `
      <div class="lab-status">
        ${U.stat("Bankroll", "$1,000")}${U.stat("Bet", "$10")}
        ${U.stat("Hi-Lo running", "0")}${U.stat("True count", "0.0")}${U.stat("Cards left", "52")}
      </div>
      <div class="felt-panel">
        <div class="hand-label">Dealer <span class="hand-total" data-out="dtot"></span></div>
        <div class="hand" data-out="dealer"></div>
        <div class="hand-label">Your hands</div>
        <div class="hands-row" data-out="player"></div>
        <p class="feedback" data-out="msg"></p>
      </div>
      <div class="btn-row" data-out="chips"></div>
      <div class="btn-row" data-out="actions"></div>
      <p class="byline" data-out="coach"></p>
      <p class="byline" data-out="count-advice"></p>`;

      const dealerRow = root.querySelector("[data-out=dealer]");
      const playerRow = root.querySelector("[data-out=player]");
      const msg = root.querySelector("[data-out=msg]");
      const coachLine = root.querySelector("[data-out=coach]");
      const countAdvice = root.querySelector("[data-out=count-advice]");
      const chipsRow = root.querySelector("[data-out=chips]");
      const actions = root.querySelector("[data-out=actions]");
      const stats = root.querySelectorAll(".stat .v");
      const dtot = root.querySelector("[data-out=dtot]");

      /* ---------- shoe & counting ---------- */
      function shuffle() {
        S.shoe = E.makeShoe(1);
        S.dealt = [];
        S.log = "Shuffled a fresh deck.";
      }
      function draw() {
        if (!S.shoe.length) { S.shoe = E.makeShoe(1); S.dealt = []; S.log += " (shoe ran dry — fresh deck mid-hand)"; }
        return S.shoe.pop();
      }
      function reveal(card) { S.dealt.push(card.rank); updateCount(); }
      function updateCount() {
        const rc = E.runningCount(S.dealt, SYS);
        const tc = E.trueCount(rc, S.shoe.length, 52);
        return { rc, tc };
      }

      /* ---------- rendering ---------- */
      function render() {
        const { rc, tc } = updateCount();
        stats[0].textContent = "$" + S.bank;
        stats[1].textContent = "$" + S.bet;
        stats[2].textContent = (rc > 0 ? "+" : "") + rc;
        stats[3].textContent = (tc > 0 ? "+" : "") + tc.toFixed(1);
        stats[4].textContent = S.shoe.length;

        dealerRow.innerHTML = "";
        S.dealer.forEach((c, ix) => {
          const isHole = ix === 1 && S.hole === null;
          const elc = U.cardEl(c, { faceDown: isHole });
          dealerRow.appendChild(elc);
          if (!isHole && !c._shown) { c._shown = true; reveal(c); }
        });
        dtot.textContent = S.dealer.length && S.hole !== null
          ? E.handValue(S.dealer).total : "";

        playerRow.innerHTML = "";
        S.hands.forEach((h, hi) => {
          const wrap = U.el("div", "hand hand-box" + (hi === S.active && S.phase === "player" ? " active-hand" : ""));
          h.cards.forEach((c) => wrap.appendChild(U.cardEl(c)));
          const hv = E.handValue(h.cards);
          const lbl = U.el("div", "hand-total",
            "$" + h.bet + (h.doubled ? " (doubled)" : "") + " · " + hv.total + (hv.soft ? " soft" : "") +
            (hv.total > 21 ? " · BUST" : "") + (E.isNatural(h.cards) && !h.fromSplit ? " · BLACKJACK" : ""));
          wrap.appendChild(lbl);
          playerRow.appendChild(wrap);
        });

        msg.textContent = S.phase === "bet" ? S.log : S.log;
        renderChips();
        renderActions();
        advice();
      }

      function renderChips() {
        chipsRow.innerHTML = "";
        if (S.phase !== "bet") { chipsRow.style.display = "none"; return; }
        chipsRow.style.display = "";
        [1, 5, 25, 100].forEach((v) => {
          const b = U.el("button", "btn small", "+$" + v);
          b.addEventListener("click", () => { if (S.bet + v <= Math.max(S.bank, 1)) { S.bet += v; render(); } });
          chipsRow.appendChild(b);
        });
        const clr = U.el("button", "btn small", "Reset bet");
        clr.addEventListener("click", () => { S.bet = 10; render(); });
        chipsRow.appendChild(clr);
      }

      function renderActions() {
        actions.innerHTML = "";
        coachLine.textContent = "";
        const add = (label, fn, cls) => {
          const b = U.el("button", "btn " + (cls || ""), label);
          b.addEventListener("click", fn);
          actions.appendChild(b);
          return b;
      };
        const coachToggle = add(S.coach ? "Coach: ON" : "Coach: OFF", () => { S.coach = !S.coach; render(); }, "small");
        coachToggle.title = "Toggle the engine's advice";
        if (S.phase === "bet") {
          add("DEAL", dealHand, "primary");
        } else if (S.phase === "insurance") {
          add("Take insurance", () => resolveInsurance(true), "primary");
          add("No insurance", () => resolveInsurance(false), "danger");
        } else if (S.phase === "player") {
          const h = S.hands[S.active];
          const hv = E.handValue(h.cards);
          add("Hit", hit, "primary");
          add("Stand", stand);
          if (h.cards.length === 2 && S.bank >= h.bet) add("Double", dbl);
          if (h.cards.length === 2 && h.cards[0].rank === h.cards[1].rank &&
              S.hands.length === 1 && S.bank >= h.bet) add("Split", split);
          add("Next hand →", nextHand, "small");
        } else if (S.phase === "done") {
          add("NEW HAND", () => { S.phase = "bet"; S.log = "Place your bet."; render(); }, "primary");
        }
      }

      function advice() {
        countAdvice.textContent = "";
        if (S.phase !== "player" || !S.coach) return;
        const { tc } = updateCount();
        const bet = E.betUnitsHiLo(tc);
        countAdvice.textContent =
          "Count check: at true count " + (tc > 0 ? "+" : "") + tc.toFixed(1) +
          ", the Hi-Lo ramp suggests betting ~" + bet + " unit" + (bet > 1 ? "s" : "") +
          (tc >= 3 ? " — and taking insurance." : tc <= 0 ? " — table minimum territory." : ".");
        const h = S.hands[S.active];
        if (!h) return;
        const comp = E.shoeComp(S.shoe);
        comp[S.hole.rank]++; // the hole card is undealt from the player's point of view
        S.memo = new Map();
        const bp = E.bestPlay(comp, h.cards, S.dealer[0].rank, E.optsFor("era"), S.memo);
        coachLine.textContent =
          "Coach: engine plays " + playName(bp.play) +
          " (EV " + (bp.evs[bp.play] >= 0 ? "+" : "") + bp.evs[bp.play].toFixed(3) + " units).";
      }

      function playName(p) { return { H: "Hit", S: "Stand", D: "Double", P: "Split" }[p] || p; }

      /* ---------- hand flow ---------- */
      function dealHand() {
        if (S.bank < S.bet || S.bet < 1) { S.log = "Set a bet you can cover."; render(); return; }
        if (S.shoe.length < 20) shuffle();
        S.bank -= S.bet;
        S.memo = new Map();
        S.hands = [{ cards: [draw(), draw()], bet: S.bet }];
        S.dealer = [draw(), draw()];
        S.hole = null; S.active = 0; S.insurance = 0;
        S.dealer.forEach((c) => { c._shown = false; });
        S.hole = S.dealer[1];
        const up = S.dealer[0].rank;
        const pNat = E.isNatural(S.hands[0].cards);
        // peek conventions: dealer natural with A/10 up ends the hand immediately
        const dNat = E.handValue(S.dealer).total === 21;
        if (dNat && (up === 0 || E.isTen(up))) {
          revealHole();
          if (pNat) { S.hands[0].result = "push"; S.bank += S.hands[0].bet; S.log = "Two naturals — a push."; }
          else { S.hands[0].result = "lose"; S.log = "Dealer has blackjack. Hand lost."; }
          S.phase = "done"; settleLog(); render(); return;
        }
        if (up === 0 && !pNat) {
          S.phase = "insurance";
          S.log = "Dealer shows an Ace. Insurance costs $" + Math.floor(S.bet / 2) + " and pays 2:1 if the hole card is a ten.";
          render(); return;
        }
        if (pNat) {
          S.bank += Math.floor(S.hands[0].bet * 2.5);
          S.hands[0].result = "natural";
          S.log = "BLACKJACK! Paid 3 to 2: +$" + Math.floor(S.hands[0].bet * 1.5) + ".";
          S.phase = "done"; settleLog(); render(); return;
        }
        S.phase = "player";
        S.log = "Your move" + (S.coach ? " — the coach is watching." : ".");
        render();
      }

      function resolveInsurance(take) {
        if (take) {
          const amt = Math.floor(S.hands[0].bet / 2);
          S.bank -= amt;
          S.insurance = amt;
        }
        const dNat = E.handValue(S.dealer).total === 21;
        if (dNat) {
          revealHole();
          if (S.insurance) { S.bank += S.insurance * 3; S.log = "Dealer had blackjack — insurance pays 2:1 (+" + (S.insurance * 2) + "), but the hand loses."; }
          else S.log = "Dealer had blackjack.";
          S.hands[0].result = "lose";
          S.phase = "done"; settleLog(); render(); return;
        }
        if (S.insurance) S.log = "Insurance lost — the hole card wasn't a ten. Playing on.";
        else S.log = "No insurance. Your move.";
        S.phase = "player";
        render();
      }

      function revealHole() {
        S.hole = null; // flag: no longer hidden
        render();
      }

      function hit() {
        const h = S.hands[S.active];
        h.cards.push(draw());
        if (E.handValue(h.cards).total > 21) { h.done = true; advance(); }
        else { S.log = "Hit again, or stand."; }
        render();
      }

      function stand() { S.hands[S.active].done = true; advance(); }

      function dbl() {
        const h = S.hands[S.active];
        S.bank -= h.bet;
        h.bet *= 2; h.doubled = true;
        h.cards.push(draw());
        h.done = true;
        S.log = "Doubled — one card, as the rules demand.";
        advance();
      }

      function split() {
        const h = S.hands[0];
        S.bank -= h.bet;
        const isAces = h.cards[0].rank === 0;
        S.hands = [
          { cards: [h.cards[0], draw()], bet: h.bet, done: isAces, fromSplit: true },
          { cards: [h.cards[1], draw()], bet: h.bet, done: isAces, fromSplit: true },
        ];
        S.log = isAces
          ? "Split aces — one card each, by the rules of the era."
          : "Split — two hands, second bet placed.";
        S.active = isAces ? 1 : 0;
        if (!isAces) { S.phase = "player"; render(); return; }
        dealerTurn();
      }

      function advance() {
        while (S.active < S.hands.length && S.hands[S.active].done) S.active++;
        if (S.active >= S.hands.length) { dealerTurn(); return; }
        S.log = "Next hand.";
        render();
      }

      function nextHand() {
        // concession: reveal nothing, just finish standing as-is (quick stand-all)
        S.hands.forEach((h) => { if (!h.done) h.done = true; });
        dealerTurn();
      }

      function dealerTurn() {
        revealHole();
        const dv = () => E.handValue(S.dealer);
        let guard = 0;
        while (dv().total < 17 && guard++ < 20) {
          const c = draw();
          S.dealer.push(c);
          reveal(c);
        }
        const dt = dv().total;
        let net = 0;
        S.hands.forEach((h) => {
          const pt = E.handValue(h.cards).total;
          if (pt > 21) { h.result = "bust"; net -= h.bet; }
          else if (dt > 21 || pt > dt) { h.result = "win"; S.bank += h.bet * 2; net += h.bet; }
          else if (pt === dt) { h.result = "push"; S.bank += h.bet; net += 0; }
          else { h.result = "lose"; net -= h.bet; }
        });
        S.phase = "done";
        S.log = dt > 21
          ? "Dealer busts with " + dt + "! Settle up below."
          : "Dealer stands on " + dt + ". Settle up below.";
        settleLog(net);
        render();
      }

      function settleLog(net) {
        if (typeof net === "number" && S.phase === "done") {
          S.log += net > 0 ? "  Net: +$" + net + "." : net < 0 ? "  Net: −$" + (-net) + "." : "  Net: $0.";
        }
        countAdvice.textContent = "";
      }

      shuffle();
      render();
    },
  };
})();
