/* ============================================================
   BTD.Content — chapters 1–5 + interactive widgets
   Original educational exposition of E. O. Thorp's
   "Beat the Dealer" (1962; rev. 1966). No book text reproduced.
   cha0smagicklabs.com · MIT
   ============================================================ */
(function () {
  "use strict";
  window.BTD = window.BTD || {};
  const E = window.BTD.Engine;
  const C = window.BTD.Content = window.BTD.Content || { chapters: [], widgets: {} };
  const UI = () => window.BTD.UI;

  /* ============ Chapter 1 — The Story ============ */
  C.chapters.push({
    id: "story", num: 1, title: "The Man Who Beat the Dealer",
    kicker: "The Story", book: "Foreword & Introduction",
    tagline: "How a young mathematician with an IBM 704 broke the casino's favorite game — and started a revolution.",
    html: `
<p class="lede">In 1958, blackjack was considered unbeatable. The dealer's rules seemed
designed so the house always won in the end. A 26-year-old mathematician named
<b>Edward Oakley Thorp</b> didn't believe the folklore — he believed in computation. This
is the story the book tells, and it is the reason you are reading a web page about it today.</p>

<div class="keyideas">
  <div class="keyidea"><strong>The insight</strong>Blackjack is not a game of independent
  trials. Cards leave the deck and do not come back, so the odds of every future hand
  depend on which cards are gone.</div>
  <div class="keyidea"><strong>The method</strong>Thorp didn't guess. He programmed an
  IBM 704 mainframe to play millions of hands and extracted an exact strategy.</div>
  <div class="keyidea"><strong>The proof</strong>He tested the strategy in Nevada with
  real money — and won.</div>
  <div class="keyidea"><strong>The consequence</strong>Casinos rewrote their own game to
  survive. The whole modern industry of "advantage play" begins with this book.</div>
</div>

<h2>The timeline</h2>
<div class="timeline">
  <div class="tl-item"><span class="tl-year">1956</span><p>Bell Labs mathematician
  John L. Kelly Jr. publishes <em>"A New Interpretation of Information Rate"</em> — a formula
  for how much of your bankroll to risk when you have an edge. It will become the
  mathematical heart of Chapter 8.</p></div>
  <div class="tl-item"><span class="tl-year">1957</span><p>Four U.S. Army analysts —
  Baldwin, Cantey, Maisel and McDermott — publish <em>Playing Blackjack to Win</em>, with a
  nearly-correct basic strategy computed by hand-held calculators. Almost nobody notices.</p></div>
  <div class="tl-item"><span class="tl-year">1958–59</span><p>Thorp reads their work,
  spots the deeper idea — that the odds shift as cards are removed — and gets access to
  MIT's IBM 704. He refines the strategy and proves that <em>counting the cards already
  played</em> turns blackjack into a winning game.</p></div>
  <div class="tl-item"><span class="tl-year">1961</span><p>Thorp announces his results at
  an American Mathematical Society meeting and makes the national news wires. He teams up
  with the legendary information theorist <b>Claude Shannon</b>; together they build the
  world's first wearable computer — for predicting roulette. In the spring, financed by a
  mysterious wealthy gambler the book calls <b>"Mr. X"</b> (later revealed to be New York
  businessman Manny Kimmel), Thorp and his friend Ed Hand take the strategy to Reno and
  Lake Tahoe. They win about <b>$11,000</b> — real proof that the mathematics works.</p></div>
  <div class="tl-item"><span class="tl-year">1962</span><p><em>Beat the Dealer</em> is
  published. Casino floors fill with people silently moving their lips while counting
  cards. The Ten-Count system in Chapter 5 of this course is the book's original weapon.</p></div>
  <div class="tl-item"><span class="tl-year">1963–66</span><p>IBM programmer
  <b>Julian Braun</b> re-runs the simulations on faster machines and sharpens the strategy
  tables. Thorp adopts the simpler, stronger <b>Hi-Lo point count</b> for the 1966 second
  edition. Casinos fight back: more decks, earlier shuffles, barring suspected counters —
  and, as the book documents, outright cheating.</p></div>
  <div class="tl-item"><span class="tl-year">After</span><p>Thorp, barred from casinos,
  turns his Kelly-style money management to the stock market and becomes one of the most
  successful quantitative investors of the century. The book sells over a million copies.
  Every card counter since is walking a road Thorp surveyed first.</p></div>
</div>

<div class="callout"><span class="tag">Why it matters to you</span>
Everything in this course is downstream of one sentence: <b>the composition of the
remaining deck changes your odds.</b> The next chapters turn that sentence into
a playing system.</div>

<div class="callout warn"><span class="tag">Honesty note</span>
Some dates and dollar figures in popular histories vary slightly between sources; the
ones above follow the account given in the book itself. The mathematics that follows
needs no history at all — it is recomputed live in your browser.</div>

<div class="protip"><span class="pt-tag">💡 Pro tip</span> <span>Learning order matters more than
learning speed. Rules → basic strategy → counting → bet sizing. Skipping the basic strategy to
"go straight to counting" is building a roof with no walls: counting only monetizes what the
basic strategy protects.</span></div>
`,
  });

  /* ============ Chapter 2 — The Rules ============ */
  C.chapters.push({
    id: "rules", num: 2, title: "Twenty-One: The Rules of the Game",
    kicker: "Fundamentals", book: "Chapter 2 · The Rules of Blackjack",
    tagline: "You cannot beat a game you don't understand at the level of its constraints.",
    html: `
<p class="lede">Blackjack — "twenty-one", "vingt-et-un" — is a comparing card game between
you and the dealer. Everyone at the table plays against the dealer alone; the other
players' hands are irrelevant to you. That single fact is what makes a lone mathematician
dangerous.</p>

<div class="keyideas">
  <div class="keyidea"><strong>Card values</strong>2–10 count face value. Jacks, Queens
  and Kings count 10. The Ace counts 11 — or 1, whichever helps the hand.</div>
  <div class="keyidea"><strong>The deal</strong>One card face up to each player, one face
  up to the dealer, a second card to each player, then the dealer's hole card.</div>
  <div class="keyidea"><strong>The dealer's cage</strong>The dealer has no choices: draw
  until reaching 17 or more, then stop. (The 1962 Las Vegas game: stand on <em>all</em> 17s,
  soft included.)</div>
  <div class="keyidea"><strong>The natural</strong>An Ace plus a ten-card on the first two
  cards is a "blackjack" and pays 3 to 2 — unless the dealer has one too, which is a push.</div>
</div>

<h2>Your options, in order of power</h2>
<div class="table-wrap"><table class="data">
<tr><th>Option</th><th>When</th><th>What it does</th><th>Why it matters</th></tr>
<tr><td class="rowhead">Hit</td><td>Any hand</td><td>Take another card</td><td>Fixes stiff totals; risks busting</td></tr>
<tr><td class="rowhead">Stand</td><td>Any hand</td><td>Stop drawing</td><td>Freezes a good total; the dealer must then beat it blind</td></tr>
<tr><td class="rowhead">Double down</td><td>First two cards</td><td>Double your bet, one card only</td><td>The book's favorite weapon: when you have the edge, press it hard</td></tr>
<tr><td class="rowhead">Split</td><td>A pair</td><td>Split into two hands, second bet equal to the first</td><td>Turns one bad hand into two good ones — or doubles a disaster if done wrong</td></tr>
<tr><td class="rowhead">Insurance</td><td>Dealer shows an Ace</td><td>Side bet up to half your wager that the hole card is a ten</td><td>Pays 2:1. A trap at normal odds, a correct bet when the deck is ten-rich — the first play a counter changes</td></tr>
</table></div>

<h2>Hard, soft, and the language of totals</h2>
<p>A <b>hard hand</b> has no Ace counted as 11 (or has an Ace that must already count as 1):
<span class='tcard'>10</span><span class='tcard red'>7</span> = hard 17 — draw again and only busting is
impossible to undo. A <b>soft hand</b> contains an Ace still counted as 11:
<span class='tcard'>A</span><span class='tcard red'>7</span> = soft 18. Soft hands are safe to improve:
<span class='tcard'>A</span><span class='tcard red'>7</span> + <span class='tcard red'>K</span> = soft 18 — the Ace
silently becomes 1 and you live to hit again. This asymmetry is why soft-hand strategy
looks so strange.</p>

<div class="panel" data-widget="dealDemo"></div>

<h2>The rules of Thorp's era (and why we care)</h2>
<div class="callout"><span class="tag">The 1962 Las Vegas game</span>
Single deck, shuffled reasonably often · dealer stands on all 17s · blackjack pays 3:2 ·
double on any first two cards · split any pair · insurance available. Every strategy table
in <em>Beat the Dealer</em> is computed for this game — so every table in this course is
computed for it too, live, by your browser.</div>
<p>Modern casinos use 4–8 decks, hit soft 17 more often than not, and shuffle long before
the deck runs out. Each change trims the counter's edge a little. None of them erase the
principle. In the Basic Strategy chapter you can toggle between the 1962 game and the
modern game and watch the tables shift.</p>
<div class="callout warn"><span class="tag">Read before you bet</span>
Different casinos, different tables, different rules. The rules are printed on the felt —
the most honest advertising in the building. Always check: number of decks, soft-17 rule,
blackjack payoff (never play a 6:5 table), and doubling restrictions.</div>

<div class="protip"><span class="pt-tag">💡 Pro tip</span> <span>Before your first real hand, watch a
table for thirty minutes and count the other players' totals under your breath. When you can
anticipate the dealer's move before he makes it, you're ready for chapter 3.</span></div>
`,
  });

  /* ============ Chapter 3 — Why the game can be beaten ============ */
  C.chapters.push({
    id: "why", num: 3, title: "Why the Game Can Be Beaten",
    kicker: "The Mathematics", book: "Introduction & Appendices",
    tagline: "Roulette has no memory. Blackjack remembers everything.",
    html: `
<p class="lede">Spin a roulette wheel twice and the second spin knows nothing about the
first. Deal a blackjack hand after a hand full of small cards and the deck <em>is
different</em>. Thorp's entire discovery lives in this one distinction between
<b>independent</b> and <b>dependent</b> trials.</p>

<h2>Anatomy of the edge</h2>
<p>Left alone, the rules favor the house: you must act <em>first</em>, without seeing the
hole card, and you can bust before the dealer ever plays. To make the game attractive,
casinos granted players three privileges:</p>
<div class="keyideas">
  <div class="keyidea"><strong>Naturals pay 3:2</strong>Worth about 2.3% to the player — and it grows when ten-cards and Aces become more frequent.</div>
  <div class="keyidea"><strong>Doubling</strong>Worth roughly 1.5% when used correctly — and it grows when the dealer is likely to bust.</div>
  <div class="keyidea"><strong>Splitting</strong>Worth roughly 0.5% when used correctly — pairs like A,A feed on ten-rich decks.</div>
</div>
<p>With good basic play these privileges claw back almost everything the house takes —
in the single-deck game of 1962, right to the brink of equality. What tips the scale
<em>permanently</em> to the player is the fourth privilege nobody put on the felt:
<b>the player is allowed to remember the past</b>.</p>

<h2>What the dealer's cage really costs</h2>
<p>The dealer must draw on every total of 16 or less. When the deck is full of small
cards, the dealer safely limps to a standing total. When the deck is full of tens, every
draw the dealer is forced to take is a coin-flip toward disaster. That is why the
composition of the deck changes the dealer's bust rate — not by opinion, but by
arithmetic you can watch below.</p>

<div class="panel" data-widget="bustChart"></div>

<h2>Watch the naturals move</h2>
<p>A natural needs an Ace plus a ten-card. In a fresh single deck the chance is
2 · (4/52) · (16/51) ≈ <b>4.83%</b>. Remove ten-cards from play and it collapses; remove
small cards and it climbs. Because naturals pay 3:2, their frequency is money. This is
the first fractional piece of Thorp's machine: <b>bet more when naturals and dealer busts
become more likely — which is exactly when small cards have left the deck.</b></p>

<div class="panel" data-widget="naturalCalc"></div>

<div class="callout"><span class="tag">The whole book in one paragraph</span>
Small cards leave the game faster than tens (the dealer eats them, forced to draw on
stiffs). A deck poor in small cards and rich in tens means: more naturals at 3:2, better
doubles, more dealer busts, worse outcomes for the dealer's forced draws. Count the
balance of small cards versus tens as it drains, bet more when the balance favors you,
and adjust borderline plays. The rest of this course is engineering detail.</div>

<div class="protip"><span class="pt-tag">💡 Pro tip</span> <span>Memorize one number from this lesson:
against a 6, the dealer busts ~42% of the time. Whenever you doubt a basic decision, ask
"am I helping or hurting the dealer's obligation to hit?" Most of the chart's answers fall
out of that question.</span></div>
`,
  });

  /* ============ Chapter 4 — Basic Strategy ============ */
  C.chapters.push({
    id: "basic", num: 4, title: "The Basic Strategy",
    kicker: "Core System", book: "Chapter 3 · The Basic Strategy",
    tagline: "Before you count a single card, stop losing money you don't have to lose.",
    html: `
<p class="lede">Basic strategy is the mathematically best way to play <em>every</em> total
against <em>every</em> dealer up-card when you know nothing about the remaining deck. It
does not win by itself — it <b>stops the bleeding</b>. The average player gives away
several percent; the basic-strategy player in Thorp's single-deck game gives away
essentially nothing. Counting profit is built on this foundation.</p>

<div class="keyideas">
  <div class="keyidea"><strong>It is exact</strong>Not folklore. Every cell is an expected-value computation. Your browser will recompute the whole table below from the rules — the same thing Thorp did on an IBM 704 in 1959.</div>
  <div class="keyidea"><strong>Dealer 2–6 are weak</strong>The dealer must play out those stiff hands. Stand on your stiffs and let the bust rate work.</div>
  <div class="keyidea"><strong>Dealer 7–A are strong</strong>The dealer often makes 17–21. Against them, play to maximize your own total — hit the stiffs, double the elevens.</div>
  <div class="keyidea"><strong>Doubles and splits are where the money is</strong>The hardest habits to build and the biggest payoffs: double 11 against everything in the single-deck game, always split Aces and 8s, never split 10s or 5s.</div>
</div>

<h2>The live-computed table</h2>
<div class="panel" data-widget="strategyTable"></div>

<h2>How to memorize it without suffering</h2>
<p>Learn it in three passes, each one a smaller list than you fear:</p>
<ol>
<li><b>Hard stiffs:</b> stand on 12–16 versus 2–6; hit them versus 7–A. Everything 17+ stands.</li>
<li><b>Soft hands:</b> treat A+7 (soft 18) as a double-or-stand hand, not a "stand" hand — this single correction is worth more than most players' entire strategy.</li>
<li><b>Pairs:</b> always split A,A and 8,8; never split 10s, 5s or (in this era) 4s; the rest follow the stiff-hand rules.</li>
</ol>

<div class="callout"><span class="tag">Practice like it matters</span>
Reading a chart is not knowing a chart. The <a href="#/lab/drill">Basic Strategy Drill</a>
fires hands at you and scores every decision — the only way this becomes reflex before
you ever sit down.</div>

<div class="protip"><span class="pt-tag">💡 Pro tip</span> <span>Learn in order of profitability:
doubles first, then hard hands, then pairs, then soft hands. Doubles return the most
percentage points and are the easiest rows to memorize — and say every play out loud
while you drill: "12 versus 4: stand." The mouth teaches the finger.</span></div>
`,
  });

  /* ============ Chapter 5 — The Ten-Count ============ */
  C.chapters.push({
    id: "tencount", num: 5, title: "The Ten-Count",
    kicker: "System I", book: "First edition · the 1962 winning strategy",
    tagline: "The system that emptied a hundred card rooms: count only what matters — the tens.",
    html: `
<p class="lede">The first edition of <em>Beat the Dealer</em> carried a single weapon:
the <b>Ten-Count</b>. It is beautifully simple. Of the 52 cards, 16 are ten-valued
(10, J, Q, K) and 36 are not. The Ten-Count ignores every distinction except that one.</p>

<div class="table-wrap"><table class="data">
<tr><th>Cards</th><th>Count value</th></tr>
<tr><td class="rowhead">A, 2, 3, 4, 5, 6, 7, 8, 9</td><td class="H">+4 each</td></tr>
<tr><td class="rowhead">10, J, Q, K</td><td class="D">−9 each</td></tr>
</table></div>

<p>The values are engineered so a <b>complete deck counts to zero</b>:
36 × 4 = 16 × 9 = 144. As the deck drains, the count drifts. The count divided by the
cards remaining gives you the <b>tens ratio</b> — the fraction of ten-cards left compared
with non-tens. A fresh deck has a ratio of 16/36. When the ratio rises above that,
ten-cards are more crowded in the remaining deck than in a fresh one, and every privilege
in Chapter 3 gets richer: more naturals at 3:2, better doubles, more dealer busts.</p>

<div class="keyideas">
  <div class="keyidea"><strong>Bet by the ratio</strong>Fresh deck: minimum bet. Rising ratio: scale bets up — the book bet several units at high ratios. The lab below does the arithmetic for you.</div>
  <div class="keyidea"><strong>Insure by the ratio</strong>Insurance wins when the hole card is a ten — that is more likely than 1/3 exactly when the ratio says so. Ten-Count players made the first "impossible" money at insurance.</div>
  <div class="keyidea"><strong>Adjust a few plays</strong>At high ratios, stand on borderline stiffs (16 vs 10, 12 vs 3) because the dealer's forced draws have turned toxic. At low ratios, hit them.</div>
</div>

<h2>Watch a deck be counted</h2>
<div class="panel" data-widget="countWalkthrough" data-sys="tencount"></div>

<div class="callout"><span class="tag">Historical note</span>
The Ten-Count is heavier arithmetic than it looks — balancing +4s and −9s in your head
for hours is work. When Julian Braun's computer-refined tables arrived, Thorp switched
the second edition to the simpler Hi-Lo count. But make no mistake: in 1962, men walked
into single-deck games with this system and walked out with the casino's week. The next
chapter teaches the refinement.</div>

<div class="protip"><span class="pt-tag">💡 Pro tip</span> <span>Count in pairs: two cards seen, one
mental step. An Ace and a 4 cancel (+4 then −1) — three at a stroke. A full deck becomes 16
steps instead of 52, and that is where casino-speed counting begins.</span></div>
`,
  });

  /* ============ Widgets ============ */
  const W = C.widgets;

  /* --- Chapter 2: deal demo --- */
  W.dealDemo = function (root) {
    const U = UI();
    let shoe = E.makeShoe(1), hand = [], dealer = [];
    root.innerHTML = `<h3 style="margin-top:0">Deal yourself a hand</h3>
      <p class="byline">Fresh single deck each deal, like Thorp's tables. Totals update as cards land.</p>
      <div class="btn-row">
        <button class="btn primary" data-a="deal">Deal</button>
        <button class="btn" data-a="hit">Hit</button>
        <button class="btn" data-a="clear">Clear</button>
      </div>
      <div class="hand-label">Dealer shows</div><div class="hand" data-out="dealer"></div>
      <div class="hand-label">Your hand <span class="hand-total" data-out="total">—</span></div>
      <div class="hand" data-out="hand"></div>
      <p class="feedback" data-out="note"></p>`;
    const out = (n) => root.querySelector('[data-out="' + n + '"]');
    function draw() { return shoe.length ? shoe.pop() : null; }
    function render() {
      const dh = out("dealer"); dh.innerHTML = "";
      dealer.forEach((c, i) => dh.appendChild(U.cardEl(c, { faceDown: i === 1 && hand.length > 0 })));
      const hh = out("hand"); hh.innerHTML = "";
      hand.forEach((c) => hh.appendChild(U.cardEl(c)));
      const note = out("note");
      if (!hand.length) { out("total").textContent = "—"; note.textContent = ""; return; }
      const hv = E.handValue(hand);
      out("total").textContent = hv.total + (hv.soft ? " soft" : " hard");
      if (E.isNatural(hand)) note.textContent = "BLACKJACK! Ace + ten-card — this hand pays 3 to 2.";
      else if (hv.total > 21) note.textContent = "Bust. You acted first — the dealer never had to show anything. This is the house's structural edge.";
      else if (hv.soft) note.textContent = "Soft hand: the Ace can fall back to 1, so you cannot bust with one more card. Improve it.";
      else if (hv.total >= 17) note.textContent = "Hard 17+: a standing hand. From here the dealer's forced draws do the work.";
      else note.textContent = "Hard " + hv.total + " — a decision hand. What would basic strategy say? (Chapter 4.)";
    }
    root.addEventListener("click", (ev) => {
      const a = ev.target.getAttribute && ev.target.getAttribute("data-a");
      if (!a) return;
      if (a === "deal") { shoe = E.makeShoe(1); hand = [draw(), draw()]; dealer = [draw(), draw()]; }
      if (a === "hit" && hand.length && E.handValue(hand).total <= 21) hand.push(draw());
      if (a === "clear") { hand = []; dealer = []; }
      render();
    });
    render();
  };

  /* --- Chapter 3: dealer bust chart --- */
  W.bustChart = function (root) {
    const U = UI();
    root.innerHTML = `<h3 style="margin-top:0">Dealer bust rate by up-card</h3>
      <p class="byline">Computed live for a fresh single deck, dealer stands on all 17s, conditioned on no dealer natural — the same conventions as the book's tables.</p>
      <canvas data-out="cv" style="width:100%;height:240px"></canvas>
      <p class="feedback" data-out="note"></p>`;
    const ups = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    const labels = ups.map(r => E.RANK_CHARS[r]);
    const chart = E.dealerBustChart(E.optsFor("era"));
    const vals = ups.map(u => chart[u].bust * 100);
    window.BTD.Charts.bars(root.querySelector("[data-out=cv]"), vals, labels, {
      fmt: (y) => y.toFixed(0) + "%",
    });
    root.querySelector("[data-out=note]").innerHTML =
      `Against a <b>6</b> the dealer busts <b>${vals[4].toFixed(1)}%</b> of the time —
       against a <b>10</b> only <b>${vals[8].toFixed(1)}%</b>. That gap is why basic strategy
       stands on stiffs against 2–6 and attacks against 7–A.`;
  };

  /* --- Chapter 3: natural probability --- */
  W.naturalCalc = function (root) {
    const U = UI();
    root.innerHTML = `<h3 style="margin-top:0">Remove cards, watch the naturals move</h3>
      <p class="byline">A fresh single deck starts at 4.83%. Slide the slider to remove ten-valued cards from play and see the live probability.</p>
      <div class="field"><label>Ten-valued cards removed (10, J, Q, K)</label>
      <input type="range" min="0" max="16" value="0" data-out="sl" style="width:100%"></div>
      <div class="lab-status">
        ${U.stat("P(natural)", "—")}
        <p class="feedback" data-out="note"></p>
      </div>`;
    const sl = root.querySelector("[data-out=sl]");
    function upd() {
      const k = +sl.value;
      const comp = E.newComp(1);
      // remove k tens: take from rank 9 first, then 10, 11, 12
      let left = k;
      for (const r of [9, 10, 11, 12]) { const take = Math.min(4, left); comp[r] -= take; left -= take; }
      const p = E.pNatural(comp);
      root.querySelector(".stat .v").textContent = (p * 100).toFixed(2) + "%";
      root.querySelector("[data-out=note]").textContent = k === 0
        ? "Fresh deck: 4.83%."
        : k < 8
          ? "Fewer tens → fewer naturals → less 3:2 income. A ten-poor deck is a betting desert."
          : "Ten-cards heavily removed: naturals are rare. This is when a counter bets the minimum — or leaves the table.";
    }
    sl.addEventListener("input", upd);
    upd();
  };

  /* --- Chapter 4: strategy table --- */
  W.strategyTable = function (root) {
    const U = UI();
    root.innerHTML = `<h3 style="margin-top:0">Basic strategy, computed in your browser</h3>
      <div class="btn-row">
        <label class="byline" for="btd-ruleset">Rule set:</label>
        <select id="btd-ruleset" data-out="mode">
          <option value="era">1962 Las Vegas — single deck, S17</option>
          <option value="modern">Modern — 4–8 decks, S17 (infinite-deck model)</option>
        </select>
      </div>
      <p class="byline" data-out="prog">The engine is thinking…</p>
      <div data-out="out"></div>
      <p class="byline"><b>H</b> Hit · <b>S</b> Stand · <b>D</b> Double (if you can't, the 3-card rule follows) · <b>P</b> Split</p>`;
    const out = root.querySelector("[data-out=out]");
    const prog = root.querySelector("[data-out=prog]");
    const modeSel = root.querySelector("[data-out=mode]");
    const ups = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    const head = "<tr><th></th>" + ups.map(u => "<th>" + E.RANK_CHARS[u] + "</th>").join("") + "</tr>";
    function renderChart(chart) {
      let html = "<h3>Hard totals</h3><div class='table-wrap'><table class='data'>" + head;
      for (let t = 5; t <= 20; t++) {
        html += "<tr><td class='rowhead'>" + t + "</td>" + ups.map(u => "<td class='" + chart.hard[t][u] + "'>" + chart.hard[t][u] + "</td>").join("") + "</tr>";
      }
      html += "</table></div><h3>Soft totals</h3><div class='table-wrap'><table class='data'>" + head;
      for (let t = 13; t <= 20; t++) {
        html += "<tr><td class='rowhead'>A," + E.RANK_CHARS[t - 12] + "</td>" + ups.map(u => "<td class='" + chart.soft[t][u] + "'>" + chart.soft[t][u] + "</td>").join("") + "</tr>";
      }
      html += "</table></div><h3>Pairs</h3><div class='table-wrap'><table class='data'>" + head;
      for (const r of [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]) {
        const k = E.RANK_CHARS[r];
        html += "<tr><td class='rowhead'>" + k + "," + k + "</td>" + ups.map(u => "<td class='" + chart.pairs[k][u] + "'>" + chart.pairs[k][u] + "</td>").join("") + "</tr>";
      }
      html += "</table></div>";
      out.innerHTML = html;
    }
    async function run() {
      prog.textContent = "Computing all " + (16 + 8 + 10) * 10 + " cells… (the IBM 704 took longer)";
      const t0 = performance.now();
      const chart = await E.buildBasicStrategy(E.optsFor(modeSel.value), null);
      renderChart(chart);
      prog.textContent = "Computed " + (16 + 8 + 10) * 10 + " exact decisions in " + Math.round(performance.now() - t0) + " ms.";
    }
    modeSel.addEventListener("change", run);
    run();
  };

  /* --- Chapter 5: counting walkthrough --- */
  W.countWalkthrough = function (root) {
    const U = UI();
    const sys = root.getAttribute("data-sys") || "tencount";
    const SYS = E.COUNT_SYSTEMS[sys];
    const shoe = E.makeShoe(1).slice(0, 17);
    let i = 0, rc = 0;
    root.innerHTML = `<h3 style="margin-top:0">Seventeen cards, one system: ${SYS.name}</h3>
      <p class="byline">${SYS.desc} A full deck always counts back to zero.</p>
      <div class="btn-row"><button class="btn primary" data-a="next">Next card</button>
      <button class="btn" data-a="restart">Restart</button></div>
      <div class="lab-status">
        ${U.stat("Card " + 0 + "/17", "—")}
        ${U.stat("Value", "—")}
        ${U.stat("Running count", "0")}
      </div>
      <div class="hand" data-out="row" style="margin-top:.8rem"></div>
      <p class="feedback" data-out="note"></p>`;
    const row = root.querySelector("[data-out=row]");
    const note = root.querySelector("[data-out=note]");
    const stats = root.querySelectorAll(".stat .v");
    function upd() {
      stats[0].textContent = i + "/17";
      stats[2].textContent = (rc > 0 ? "+" : "") + rc;
    }
    upd();
    root.addEventListener("click", (ev) => {
      const a = ev.target.getAttribute && ev.target.getAttribute("data-a");
      if (!a) return;
      if (a === "restart") { root.replaceWith(root.cloneNode(false)); W.countWalkthrough(root); return; }
      if (a !== "next" || i >= shoe.length) return;
      const c = shoe[i];
      const v = SYS.value(c.rank);
      rc += v;
      const ce = U.cardEl(c);
      row.appendChild(ce);
      ce._reveal();
      i++;
      stats[1].textContent = (v > 0 ? "+" : "") + v;
      upd();
      if (i === shoe.length) {
        note.textContent = rc === 0
          ? "Deck segment complete and the count is " + rc + " — the arithmetic self-checks."
          : "Count stands at " + rc + " (a partial deck need not return to zero — only the full 52 does).";
        if (sys === "tencount") { BTD.Store.award("ten-counter"); }
        else { BTD.Store.award("hilo-counter"); }
      } else {
        note.textContent = "";
      }
    });
  };
})();
