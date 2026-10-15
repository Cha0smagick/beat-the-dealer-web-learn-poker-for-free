/* ============================================================
   BTD.Content (continued) — chapters 6–9 + widgets
   Original educational exposition · cha0smagicklabs.com · MIT
   ============================================================ */
(function () {
  "use strict";
  window.BTD = window.BTD || {};
  const E = window.BTD.Engine;
  const C = window.BTD.Content;
  const UI = () => window.BTD.UI;

  /* ============ Chapter 6 — Hi-Lo ============ */
  C.chapters.push({
    id: "hilo", num: 6, title: "The Hi-Lo Count",
    kicker: "System II", book: "Second edition (1966) · the simple point count",
    tagline: "Julian Braun's computer, Thorp's simplification: the counting system that conquered the world.",
    html: `
<p class="lede">The 1966 edition of <em>Beat the Dealer</em> replaced the Ten-Count with a
system derived from Julian Braun's millions of simulated hands on IBM machines. It is
called <b>Hi-Lo</b>, and in one form or another it is what nearly every card counter has
used since. Where the Ten-Count sorts cards into two buckets with awkward values, Hi-Lo
sorts them into three with perfect manners.</p>

<div class="table-wrap"><table class="data">
<tr><th>Cards</th><th>Count value</th><th>Why</th></tr>
<tr><td class="rowhead">2 · 3 · 4 · 5 · 6</td><td class="H">+1</td><td>The dealer's food. As they drain, the dealer starves on stiffs</td></tr>
<tr><td class="rowhead">7 · 8 · 9</td><td>0</td><td>Neutral — nearly irrelevant to the odds</td></tr>
<tr><td class="rowhead">10 · J · Q · K · A</td><td class="D">−1</td><td>The player's ammunition: naturals, doubles, dealer-busters</td></tr>
</table></div>

<p>A full deck counts to zero: 20 × (+1) = 20 × (−1). As cards are exposed you keep a
<b>running count</b>. Then comes the one idea that separates counters from
count-keepers: the same running count means different things depending on how much deck
is left. Five extra tens in 48 unseen cards is a stampede; five extra tens in five unseen
cards is a certainty. Divide the running count by the number of half-decks remaining and
you get the <b>true count</b> — the number that actually prices your bets.</p>

<div class="keyideas">
  <div class="keyidea"><strong>Running count → true count</strong>TC = RC ÷ decks remaining. In a single deck, 26 unseen cards = 0.5 decks, so +3 running becomes +6 true. Practice this division until it is as automatic as breathing.</div>
  <div class="keyidea"><strong>Bet the true count</strong>Every +1 of true count is worth roughly half a percent of edge (approximation of the book-era numbers). Below +1: table minimum. Above: scale up, roughly doubling with each +2 — the shape of the ramp is Kelly logic, Chapter 8.</div>
  <div class="keyidea"><strong>Insure at +3</strong>The hole card is a ten more often than 1/3 when the true count is about +3 or higher (multi-deck rule of thumb; the single-deck threshold is lower). Insurance flips from sucker bet to the best bet on the table.</div>
  <div class="keyidea"><strong>Play a few deviations</strong>At high counts, stand on 16 vs 10 and 12 vs 3; at low counts hit them. The big money is still in bet sizing, not exotic plays.</div>
</div>

<h2>The true-count machine</h2>
<div class="panel" data-widget="tcConverter"></div>

<div class="callout"><span class="tag">Practice plan</span>
Counting is a motor skill, not a fact. Go to the
<a href="#/lab/count">Card Counting Trainer</a> and count ten full decks in Hi-Lo before
you ever judge yourself ready. Accuracy first, speed second, camouflage third.</div>

<div class="protip"><span class="pt-tag">💡 Pro tip</span> <span>Drill the true-count conversion
separately: have a friend shout a running count and a decks figure ("+11, three decks") and
answer with the true count in one second (+3.7 ≈ +4). Counting is memory; conversion is
surgical arithmetic. Train them apart.</span></div>
`,
  });

  /* ============ Chapter 7 — The Complete Point Count ============ */
  C.chapters.push({
    id: "complete", num: 7, title: "The Complete Point Count",
    kicker: "System III", book: "Second edition · Braun's refined tables",
    tagline: "More precision, more weight classes, more work. Know what it buys — and what it costs.",
    html: `
<p class="lede">The second edition also carried a heavier instrument: the
<b>complete point count</b>, built on Julian Braun's computer-optimized tables. Its idea is
simple to state: cards do not affect the odds <em>equally</em>, so a perfect system should
not weight them equally. The 5 is far more valuable to the dealer than the 2; the Ace is
worth more to the player than any single ten-card, because it powers naturals
<em>and</em> soft doubling. Multi-level counts give each rank a weight closer to its true
economic effect.</p>

<div class="keyideas">
  <div class="keyidea"><strong>Unequal weights, unequal work</strong>Multi-level systems (values like +2/−2) track the deck more finely — and demand more of your brain under casino noise.</div>
  <div class="keyidea"><strong>The Ace question</strong>High Aces are worth more for <em>betting</em> (naturals pay 3:2) than for <em>playing</em>. Advanced systems count Aces separately for each purpose — an "ace side count".</div>
  <div class="keyidea"><strong>The honest trade</strong>In the single-deck game of 1962, Hi-Lo already won decisively. The complete point count bought a fraction of a percent more edge for a large increase in error rate. An error-prone expert system loses to an error-free simple one.</div>
</div>

<h2>Three systems side by side</h2>
<div class="table-wrap"><table class="data">
<tr><th>System</th><th>Era</th><th>Weights</th><th>Effort</th><th>Power in 1962 conditions</th></tr>
<tr><td class="rowhead">Ten-Count</td><td>1962, 1st ed.</td><td>+4 / −9</td><td>High (awkward arithmetic)</td><td>Decisive — beat the single-deck game</td></tr>
<tr><td class="rowhead">Hi-Lo</td><td>1966, 2nd ed.</td><td>+1 / 0 / −1</td><td>Low</td><td>Nearly all of the complete count's edge, fraction of the effort</td></tr>
<tr><td class="rowhead">Complete point count</td><td>1966, 2nd ed.</td><td>Multi-level, refined tables</td><td>High</td><td>The book's ceiling — with Braun's play tables as its teeth</td></tr>
</table></div>

<h2>One card, three verdicts</h2>
<div class="panel" data-widget="cardValueCompare"></div>

<div class="callout"><span class="tag">What happened next</span>
Thorp's book spawned a family of descendant systems, each tuning Braun's idea — the
balanced multi-level counts that advantage players still study today are its
grandchildren. For this course, Hi-Lo is the working tool: it is what the trainer and
simulator labs use, and it is the system whose logic you must own before any heavier
arithmetic is worth your time.</div>

<div class="protip"><span class="pt-tag">💡 Pro tip</span> <span>If you ever graduate to a system with
unequal weights, side-count the Aces first. Aces decide bet profitability; tens decide play
profitability. Separating them is cheaper than fusing them.</span></div>
`,
  });

  /* ============ Chapter 8 — Money Management ============ */
  C.chapters.push({
    id: "money", num: 8, title: "Betting & Money Management",
    kicker: "Capital", book: "Betting chapters · the Kelly criterion",
    tagline: "An edge you bet wrongly is an edge you do not have. Sizing is the half of the system nobody films.",
    html: `
<p class="lede">Counting tells you <em>when</em> you have the edge. Money management
decides <em>how much</em> of your bankroll that edge is worth. Thorp learned it from
John Kelly's 1956 information-theory paper: if you know your advantage, there is a
mathematically optimal fraction of your capital to risk — big enough to grow fast,
small enough that ruin stays a rounding error.</p>

<div class="keyideas">
  <div class="keyidea"><strong>The Kelly fraction</strong>For a bet with edge <em>e</em> and variance <em>v</em>, the growth-optimal fraction is <b>f* = e / v</b>. A blackjack hand has variance around 1.15–1.3 (square of the ~1.15-unit standard deviation), so a 1% edge wants a bet of roughly 1% of your bankroll.</div>
  <div class="keyidea"><strong>Fluctuations are the real enemy</strong>With edge <em>e</em> per hand, your expected profit after <em>n</em> hands is <em>e·n</em> — but the standard deviation of your result is about 1.15·√n. Expectation grows in a straight line; luck grows in a square root. They cross surprisingly late.</div>
  <div class="keyidea"><strong>Bet ramp = Kelly in disguise</strong>That is why Hi-Lo ramps double roughly every +2 of true count: edge grows linearly in the count, so the Kelly bet does too.</div>
  <div class="keyidea"><strong>Thorp's rules of thumb</strong>Never bet so big that a bad hour hurts; never chase losses (the count doesn't owe you anything); quit at pre-set win/stop levels; and never play a game you haven't verified is honest.</div>
</div>

<h2>The Kelly calculator</h2>
<div class="panel" data-widget="kellyCalc"></div>

<h2>Expectation versus fluctuation</h2>
<p>The chart below shows the war every counter fights: expected profit (a straight line)
against one standard deviation of pure luck (a curve). Early on, luck drowns the edge.
The crossing point — where the edge reliably dominates one swing — is the honest answer
to "how long until this pays?"</p>
<div class="panel" data-widget="fluctChart"></div>

<div class="callout warn"><span class="tag">Risk of ruin, plainly</span>
Bet a small fixed fraction of a large bankroll and ruin is nearly impossible. Bet large
fractions of a small bankroll and ruin is nearly certain — <em>even with a winning
system</em>. Over-betting turns a mathematically winning strategy into a guaranteed
loss. This is the most valuable sentence in this chapter.</div>

<div class="protip"><span class="pt-tag">💡 Pro tip</span> <span>Size your bet from the bankroll, never
from the mood. Losing streaks are not information about your edge — they are variance doing
its job. If your bankroll can't survive 100 max bets, your Kelly ceiling is lower than you
think.</span></div>
`,
  });

  /* ============ Chapter 9 — Casino Survival ============ */
  C.chapters.push({
    id: "survival", num: 9, title: "Casino Survival: Camouflage, Heat & Cheating",
    kicker: "Fieldcraft", book: "Camouflage & cheating chapters",
    tagline: "The book's last lesson is not mathematics. It is people.",
    html: `
<p class="lede">A perfect counting system fails in one place: the casino floor. Thorp's
final chapters are field notes on surviving an institution that does not want you to
win — and on the older enemy, outright cheating.</p>

<h2>Heat and barring</h2>
<p>Card counting is not against the law — but a private club may refuse your action for
any reason it likes. Surveillance crews profile bet patterns: small bets on rich decks,
big bets on poor ones, insurance suddenly appearing at +3. When the pit boss starts
chatting, shuffling early, or watching your stack, the "heat" is on, and the likely end
is a polite escort to the door. The book's countermeasures are psychological, not
mathematical:</p>
<div class="keyideas">
  <div class="keyidea"><strong>Camouflage</strong>Look like a gambler, not an auditor: act loosely, tip, vary bets with a story, occasionally make a deliberate "bad" small play that costs a little and buys a lot of anonymity.</div>
  <div class="keyidea"><strong>Session discipline</strong>Short sessions, moving tables, honest-looking bet spreads rather than maximum aggression.</div>
  <div class="keyidea"><strong>Team play</strong>Spotters count and bet small at crowded tables; a rested "big player" joins only when the count is rich. The book discusses partnerships; the refinements were invented by teams that grew from its readers.</div>
  <div class="keyidea"><strong>Know the game changed</strong>Because of this book, casinos adopted multi-deck shoes, cut cards and earlier shuffles. Every rule on the felt today is a scar from 1962.</div>
</div>

<h2>Cheating: the chapter that paid for itself</h2>
<p>Thorp documented how dealers and houses of that era could beat even a perfect player:
<b>second dealing</b> (dealing the second card from the top while pretending it's the
first), <b>peeking</b> at the hole card, <b>stacked</b> or "cold" decks introduced at the
shuffle, <b>marked cards</b>, and rigged dealing boxes. His advice is unheroic and
correct: <em>the defense is observation and exit</em>. Learn the tells, play only where
the dealing is transparent, and leave the moment the deck behaves impossibly. The money
you keep is the money you don't donate to a crooked table.</p>

<h2>Spot the cheat</h2>
<p>Six situations from the era of the book. Decide whether the game is crooked before
you flip the card.</p>
<div class="panel" data-widget="spotTheCheat"></div>

<div class="callout"><span class="tag">The finish line</span>
You now hold the whole argument of <em>Beat the Dealer</em>: the rules, the reason the
game can be beaten, the basic strategy, three counting systems, the money management
that sizes bets, and the fieldcraft that keeps you welcome — or at least solvent. Go to
the <a href="#/labs">Laboratory</a> and make it reflex.</div>

<div class="protip"><span class="pt-tag">💡 Pro tip</span> <span>Look like a player, think like an
accountant. The cheapest camouflage is being the boring one: minimum bets, tips, small talk,
and leaving when the count drops without a dramatic sigh. Nobody photographs the players
who look like they're losing pleasantly.</span></div>
`,
  });

  /* ============ Widgets (6–9) ============ */
  const W = C.widgets;

  /* --- Chapter 6: true count converter --- */
  W.tcConverter = function (root) {
    const U = UI();
    root.innerHTML = `<h3 style="margin-top:0">Running count → true count → bet</h3>
      <div class="field"><label>Running count: <b data-out="rcv">+4</b></label>
        <input type="range" min="-20" max="20" value="4" data-out="rc" style="width:100%"></div>
      <div class="field"><label>Unseen cards: <b data-out="unv">26</b> of 52 (single deck)</label>
        <input type="range" min="6" max="52" value="26" data-out="un" style="width:100%"></div>
      <div class="lab-status">
        ${U.stat("Decks left", "—")}${U.stat("True count", "—")}
        ${U.stat("Bet (units)", "—")}${U.stat("Insurance?", "—")}
      </div>
      <p class="feedback" data-out="note"></p>`;
    const rc = root.querySelector("[data-out=rc]"), un = root.querySelector("[data-out=un]");
    const stats = root.querySelectorAll(".stat .v");
    function upd() {
      const r = +rc.value, u = +un.value;
      root.querySelector("[data-out=rcv]").textContent = (r > 0 ? "+" : "") + r;
      root.querySelector("[data-out=unv]").textContent = u;
      const decks = u / 52;
      const tc = r / decks;
      const bet = E.betUnitsHiLo(tc);
      const insure = tc >= 3;
      stats[0].textContent = decks.toFixed(2);
      stats[1].textContent = (tc > 0 ? "+" : "") + tc.toFixed(1);
      stats[2].textContent = bet + "×";
      stats[3].textContent = insure ? "TAKE" : "no";
      const edge = (tc - 1) * 0.5;
      root.querySelector("[data-out=note]").textContent =
        tc >= 3 ? "Rich deck: ~" + edge.toFixed(1) + "% estimated edge — this is when the book says press." :
        tc <= 0 ? "Poor deck: minimum bet, or take a walk. No edge, no bet." :
                  "Small edge only — bet small and stay unnoticed.";
    }
    rc.addEventListener("input", upd);
    un.addEventListener("input", upd);
    upd();
  };

  /* --- Chapter 7: one card, three verdicts --- */
  W.cardValueCompare = function (root) {
    const U = UI();
    const ranks = [0, 4, 9]; // A, 5, 10
    root.innerHTML = `<h3 style="margin-top:0">The same card under three systems</h3>
      <p class="byline">Pick a card. Note how the 5 — the dealer's favorite meal — weighs
      more than the 2, and how the Ace is worth more than its ten-brothers to a complete
      system.</p>
      <div class="btn-row" data-out="pick"></div>
      <div class="lab-status" data-out="vals"></div>
      <div class="hand" data-out="hand" style="margin-top:.8rem"></div>`;
    const pick = root.querySelector("[data-out=pick]");
    const vals = root.querySelector("[data-out=vals]");
    const hand = root.querySelector("[data-out=hand]");
    ranks.forEach((r) => {
      const b = U.el("button", "btn", "Card: " + E.RANK_CHARS[r]);
      b.addEventListener("click", () => show(r));
      pick.appendChild(b);
    });
    function show(r) {
      hand.innerHTML = "";
      const c = U.cardEl({ rank: r, suit: (r * 3) % 4 });
      hand.appendChild(c); c._reveal();
      const t10 = E.COUNT_SYSTEMS.tencount.value(r);
      const hl = E.COUNT_SYSTEMS.hilo.value(r);
      const rows = [
        ["Ten-Count (1962)", (t10 > 0 ? "+" : "") + t10],
        ["Hi-Lo (1966)", (hl > 0 ? "+" : "") + hl],
        ["Complete point count", r === 0 ? "−2 and a separate Ace side count" : r === 4 ? "+2 (heavier than the 2)" : "−2"],
      ];
      vals.innerHTML = rows.map(x => `<div class="stat"><span class="v">${x[1]}</span><span class="k">${x[0]}</span></div>`).join("");
      vals.insertAdjacentHTML("beforeend", `<p class="feedback">${
        r === 0 ? "The Ace: over-weighted by simple counts for betting, under-weighted for play — hence side counts."
        : r === 4 ? "The 5: the single most important small card. Removing it moves the odds toward the player more than any other card."
        : "A ten: slightly more valuable to the dealer's survival than the Ace is to the dealer's busting — the systems disagree on its exact weight."}</p>`);
    }
    show(4);
  };

  /* --- Chapter 8: Kelly calculator --- */
  W.kellyCalc = function (root) {
    const U = UI();
    root.innerHTML = `<h3 style="margin-top:0">Kelly: f* = edge ÷ variance</h3>
      <div class="field"><label>Estimated edge: <b data-out="ev">+1.0%</b></label>
        <input type="range" min="-10" max="60" value="10" data-out="e" style="width:100%"></div>
      <div class="field"><label>Bankroll: $<b data-out="bv">1,000</b></label>
        <input type="range" min="100" max="20000" step="100" value="1000" data-out="b" style="width:100%"></div>
      <div class="lab-status">
        ${U.stat("Kelly fraction", "—")}${U.stat("Bet size", "—")}
        ${U.stat("Half-Kelly (safer)", "—")}
      </div>
      <p class="feedback" data-out="note"></p>`;
    const e = root.querySelector("[data-out=e]"), b = root.querySelector("[data-out=b]");
    const stats = root.querySelectorAll(".stat .v");
    const VARIANCE = 1.15; // blackjack hand SD ≈ 1.15 units → v ≈ 1.15–1.3; we use 1.15
    function upd() {
      const edge = (+e.value) / 1000;   // slider in ‰ → fraction
      const bank = +b.value;
      root.querySelector("[data-out=ev]").textContent = (edge >= 0 ? "+" : "") + (edge * 100).toFixed(1) + "%";
      root.querySelector("[data-out=bv]").textContent = bank.toLocaleString("en-US");
      const f = edge / VARIANCE;
      stats[0].textContent = (f * 100).toFixed(2) + "%";
      stats[1].textContent = "$" + Math.max(0, Math.round(bank * f));
      stats[2].textContent = "$" + Math.max(0, Math.round(bank * f / 2));
      root.querySelector("[data-out=note]").textContent = f <= 0
        ? "No edge (or negative): the Kelly bet is zero. Everything you bet beyond zero is purchased with luck alone."
        : f > 0.15
          ? "Fraction above 15% — realistic blackjack edges never reach this. This is what over-betting looks like: growth-optimal on paper, ruinous in practice."
          : "Growth-optimal under Kelly. Professionals often bet half this (" + stats[2].textContent + ") to smooth the ride — tiny growth cost, large variance cost savings.";
    }
    e.addEventListener("input", upd);
    b.addEventListener("input", upd);
    upd();
  };

  /* --- Chapter 8: expectation vs fluctuation --- */
  W.fluctChart = function (root) {
    root.innerHTML = `<h3 style="margin-top:0">Edge (straight) vs luck (square root)</h3>
      <p class="byline">Edge +1% per hand, hand standard deviation 1.15 units. Solid: expected profit. Dashed: one standard deviation of pure chance.</p>
      <canvas data-out="cv" style="width:100%;height:280px"></canvas>
      <p class="feedback" data-out="note"></p>`;
    const steps = [];
    for (let n = 100; n <= 40000; n = Math.round(n * 1.25)) steps.push(n);
    const EDGE = 0.01, SD = 1.15;
    const exp = steps.map(n => EDGE * n);
    const luck = steps.map(n => SD * Math.sqrt(n));
    const cross = Math.round(Math.pow(SD / EDGE, 2)); // n where e·n = 1.15·√n
    window.BTD.Charts.line(root.querySelector("[data-out=cv]"), [
      { label: "Expected profit", color: "#58d68d", data: exp },
      { label: "1 SD of luck", color: "#e0454f", data: luck },
    ], { fmt: (y) => Math.round(y) + "u", zero: true });
    root.querySelector("[data-out=note]").textContent =
      "The lines cross near " + cross.toLocaleString("en-US") +
      " hands: before that, even a perfect counter's result is mostly noise; after it, the edge owns the curve. This is why bankroll size and session length are mathematical decisions, not moods.";
  };

  /* --- Chapter 9: spot the cheat --- */
  C.cheats = [
    { title: "The dealer's fingers", story: "On stiff hands you watch the dealer deliver cards with a smooth motion — but twice, the card that lands in front of you was clearly the second one from the top, the top card slipping back under the deck.", tell: "Second dealing", verdict: true,
      explain: "Classic second dealing: the top card is retained (held back by a finger grip) and the next card is served. A fair dealer's top card always lands first. When you see it, you are not watching a bad dealer — you are watching theft. Leave and report." },
    { title: "A warm welcome", story: "You sit down, bet modestly, play basic strategy. The dealer is friendly, the deck is a normal shuffled 52, and a supervisor watches you bet the minimum while the count is low.", tell: "Ordinary dealing", verdict: false,
      explain: "Nothing here is crooked — being watched while betting small on a bad deck is precisely what a correct counter looks like. Watch the dealing, not the watchers." },
    { title: "The cold shuffle", story: "You have won three big hands in a row. The dealer calls for a new deck, and the supervisor performs an unusually long, one-sided shuffle away from the table's view. Immediately, tens vanish: five hands in a row you draw stiff after stiff against dealer 20s.", tell: "A stacked (cold) deck", verdict: true,
      explain: "New decks arrive legitimately — but the long, concealed, one-handed shuffle is the era's classic stack. A fair shuffle cannot reliably produce five consecutive terrible sequences. The count that plunges for no compositional reason is a signature, not variance." },
    { title: "Insurance logic", story: "The dealer shows an Ace. You hold a 20 and take insurance on a whim. It wins, and the table nods approvingly at your 'good luck'.", tell: "Normal insurance", verdict: false,
      explain: "Winning insurance occasionally is arithmetic, not a sign of cheating — the dealer's hole card is a ten about 30.8% of the time in a fresh deck. Crooked insurance is a hole-card peek followed by a signal; watch the dealer's eyes and hands, not the outcomes." },
    { title: "The helpful box", story: "From a dealing box, cards emerge extremely slowly and the dealer's hand always seems to hover over the box's lip. Your naturals stop appearing exactly when your bets are largest.", tell: "A rigged dealing box", verdict: true,
      explain: "Mechanized boxes can be machined to hide selected cards or let a practiced dealer control the slide. Slow, deliberate delivery combined with outcome patterns that track your bet sizes is the era's documented hardware cheat. Exit politely, note the table, and report." },
    { title: "The marked stranger", story: "Another player wins repeatedly with absurd calls — standing on stiff hands that 'feel right'. You notice faint gloss patterns on some card backs under the table light.", tell: "Marked cards", verdict: true,
      explain: "Shaded backs, pin-pricks and gloss patterns are era-standard card marking, and the player who mysteriously reads the deck is reading the marks, not the future. It is fraud against everyone at the table, including you. Leave." },
  ];

  W.spotTheCheat = function (root) {
    const U = UI();
    let idx = 0, right = 0;
    root.innerHTML = `<div data-out="stage"></div>
      <div class="btn-row" data-out="nav"></div>
      <p class="feedback" data-out="score"></p>`;
    const stage = root.querySelector("[data-out=stage]");
    const nav = root.querySelector("[data-out=nav]");
    const scoreEl = root.querySelector("[data-out=score]");
    function render() {
      const c = C.cheats[idx];
      stage.innerHTML = `<h3 style="margin-top:0">${idx + 1}/6 · ${c.title}</h3>
        <p>${c.story}</p>
        <div class="btn-row"><button class="btn primary" data-a="honest">Honest game</button>
        <button class="btn danger" data-a="crooked">Crooked — walk away</button></div>
        <div data-out="rev"></div>`;
      const rev = stage.querySelector("[data-out=rev]");
      stage.querySelectorAll("button").forEach((b) => {
        b.addEventListener("click", () => {
          const said = b.getAttribute("data-a") === "crooked";
          const good = said === c.verdict;
          if (good) right++;
          b.disabled = true;
          stage.querySelectorAll("button").forEach((x) => { x.disabled = true; });
          rev.innerHTML = `<div class="quiz-explain"><b>${c.verdict ? "✔ Crooked: " : "✔ Honest: "}${c.tell}.</b> ${c.explain}</div>`;
          const nxt = U.el("button", "btn primary", idx < 5 ? "Next case" : "See results");
          nxt.addEventListener("click", () => { idx++; idx < 6 ? render() : finish(); });
          nav.innerHTML = ""; nav.appendChild(nxt);
          scoreEl.textContent = `Cases resolved correctly: ${right}/${idx + 1}`;
        });
      });
    }
    function finish() {
      const pctScore = right / 6;
      scoreEl.innerHTML = `<span class="score-pill">Cheat detection: ${Math.round(pctScore * 100)}%</span>`;
      if (pctScore >= 0.8) BTD.Store.award("cheat-detective");
      const again = U.el("button", "btn", "Run the cases again");
      again.addEventListener("click", () => { idx = 0; right = 0; scoreEl.textContent = ""; render(); });
      nav.innerHTML = ""; nav.appendChild(again);
      stage.innerHTML = pctScore >= 0.8
        ? "<p class='feedback good'>Thorp-worthy instincts: you watch hands, shuffles and patterns — not outcomes. The book's advice is yours.</p>"
        : "<p class='feedback bad'>Review the tells above — the defense is observation and exit, and observation is a skill like counting.</p>";
    }
    render();
  };
})();
