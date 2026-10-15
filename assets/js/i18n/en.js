/* ============================================================
   I18N · English base pack
   Chapters / quizzes / blackjack glossary stay in their source
   modules (content.js, content-more.js, quizzes.js, glossary.js)
   — the I18N layer reads them as the English originals. This
   file carries everything that is NOT chapter prose: navigation,
   page shells, quiz furniture, shared buttons, the tutorial.
   ============================================================ */
(function () {
  "use strict";
  window.BTD = window.BTD || {};
  window.BTD.I18N.register("en", {
    meta: { name: "English" },

    ui: {
      "brand.tagline": "The Interactive Study — a free course by cha0smagicklabs.com",
      "lang.label": "Language",
      "lang.nativeSection": "Site languages",
      "lang.googleSection": "More — via Google",
      "lang.nativeTag": "native",

      "nav.story": "Story", "nav.rules": "Rules", "nav.why": "Math",
      "nav.basic": "Strategy", "nav.counts": "Counts", "nav.money": "Money",
      "nav.labs": "Labs", "nav.glossary": "Glossary", "nav.pokerpedia": "Pokerpedia",
      "nav.tutorial": "Start Here", "nav.about": "About",

      "footer.l1": "<strong>Beat the Dealer — The Interactive Study.</strong> An original educational exposition of Edward O. Thorp's <em>Beat the Dealer</em> (1962; rev. 1966). No text from the book is reproduced.",
      "footer.l2": "Site, engine, labs & curriculum built free by <a href=\"https://cha0smagicklabs.com\" rel=\"noopener\">cha0smagicklabs.com</a>. Card art: David Bellot's open-source <em>SVG-cards</em>. Strategy tables are computed live in your browser — nothing is copied.",
      "footer.l3": "Educational only. No real money. The math is honest; casinos are, too. 21+.",

      "c.deal": "DEAL", "c.hit": "Hit", "c.stand": "Stand", "c.double": "Double",
      "c.split": "Split", "c.next": "Next", "c.restart": "Restart", "c.start": "Start",
      "c.cancel": "Cancel", "c.reset": "Reset", "c.check": "Check", "c.compute": "Compute",
      "c.run": "Run", "c.close": "Close", "c.retry": "Retry",

      "quiz.header": "Test yourself",
      "quiz.score": "Score",
      "quiz.newBest": "new best!",
      "quiz.best": "best",
      "quiz.retry": "Retry quiz",
      "quiz.mark": "Mark chapter complete",
      "quiz.markDone": "✔ Chapter completed",
      "quiz.allchapters": "all chapters",
      "quiz.labLink": "Go to the Laboratory →",
      "quiz.toastDone": "Chapter complete. Onward.",
      "quiz.toastKept": "Progress kept.",

      "gloss.ph": "Search terms…",
      "count.lab.sys": "System:", "count.lab.mode": "Mode:", "count.lab.speed": "Speed:",
      "count.lab.guided": "Guided — grade every card",
      "count.lab.speedtest": "Speed test — count silently",
      "count.lab.note0": "Pick a system and press <b>Start deck</b>. A full deck always counts back to zero — use it to self-check.",
      "count.lab.ask": "What is the {SYS} value of this card?",
      "count.lab.silent": "Count silently — the cards will flip on their own.",
    },

    pages: {
      home: {
        heroTitle: "Learn to beat the dealer — the way it was actually done.",
        heroText: "A free interactive course built on Edward O. Thorp's <em>Beat the Dealer</em>: nine chapters from the history to the mathematics to the fieldcraft, with a live exact-computation engine, six laboratories, quizzes that grade you — and a full Pokerpedia.",
        ctaCourse: "Start the course →",
        ctaTutorial: "New here? Take the tutorial",
        ctaLabs: "Skip to the Labs",
        secCourse: "The course",
        secLabs: "The laboratory",
        secRecord: "Your record",
        reset: "Reset all progress",
        completed: "✔ completed",
        chaptersWord: "chapters",
        badgesWord: "badges",
        levelWord: "Level",
      },
      labs: {
        title: "The Laboratory",
        lede: "Six machines that turn reading into reflex. Every number is computed by the engine in your browser — nothing here is a canned answer.",
      },
      glossary: {
        title: "Glossary",
        lede: "From Ace-rich to Variance — the vocabulary of the book and the tables.",
        none: "Nothing matches — try another word.",
      },
      notfound: {
        title: "Card not found",
        text: "That route fell out of the shoe. Back to the course:",
        cta: "← Home",
      },
      about: {
        title: "About this site",
        html: `
        <p class="lede">A free, open study companion to Edward O. Thorp's <em>Beat the Dealer</em>
        (1962; revised 1966) — the book that turned blackjack from a pastime into a solved
        frontier and launched the quant age. Built and given away by
        <a href="https://cha0smagicklabs.com" rel="noopener">cha0smagicklabs.com</a>.</p>

        <h2>The anti-slop guarantee</h2>
        <p>Most blackjack sites copy strategy charts from other sites, with typos — and no
        way to check them. This site ships a small exact-computation engine
        (<code>engine.js</code>): it computes expected values by recursion over the exact
        remaining deck composition (single-deck mode) or a fresh-shoe model (multi-deck
        mode), cross-checked against an independent brute-force implementation during
        development. Every strategy table, bust chart, EV and lab verdict on this site is
        computed <em>live, in your browser, at load time</em>. Nothing is transcribed.</p>
        <p>Approximations that cannot be made exact (the half-percent-per-count rule of
        thumb, the +3 insurance threshold, hand standard deviation) are labeled as
        approximations in the text.</p>

        <h2>Credits</h2>
        <ul>
          <li><b>Edward O. Thorp</b> — author of <em>Beat the Dealer</em>. This site explains
          the book's ideas; no text from the book is reproduced. Read the original.</li>
          <li><b>Julian Braun</b> — whose IBM simulations refined the tables the second
          edition carried, and whose method this engine imitates in miniature.</li>
          <li><b>David Bellot</b> — the open-source <em>SVG-cards</em> artwork used for every
          playing card on the site.</li>
          <li><b>cha0smagicklabs.com</b> — site, curriculum, engine, labs and design,
          released under the MIT license.</li>
        </ul>

        <h2>Play honestly</h2>
        <p>Educational only: no real-money play, no wagers, no affiliations. Card counting
        is legal thinking; casinos may still refuse your action — the book's last chapters
        explain exactly why, and what the era's crooked games looked like. If you gamble
        anywhere, for anything: 21+, within your means, and never as an investment plan.</p>`,
      },
      tutorial: {
        title: "Start Here",
        lede: "Seven steps from zero to a player the pit respects. Each step checks itself off as you finish chapters and earn badges — your progress, your pace.",
        stepsTitle: "The path",
        tipsTitle: "Ten pro tips from the book's veterans",
        steps: [
          { title: "Learn the felt", text: "Rules first: totals, the Ace's double life, naturals, when you may double or split. Ten minutes here saves a hundred mistakes later.", links: [["Chapter 2 — Rules", "#/chapter/rules"]], check: "chapter:rules" },
          { title: "See why it can be beaten", text: "One idea unlocks everything: dealt cards leave play, so the odds move. Watch the dealer-bust chart and the natural calculator.", links: [["Chapter 3 — The Mathematics", "#/chapter/why"]], check: "chapter:why" },
          { title: "Stop losing money you don't have to lose", text: "Basic strategy is the multi-percent fix. Drill it until the engine grades you 90%+ over twenty hands.", links: [["Chapter 4 — Basic Strategy", "#/chapter/basic"], ["Lab: Strategy Drill", "#/lab/drill"]], check: "chapter:basic", badge: "basic-adept" },
          { title: "Meet the Ten-Count", text: "The 1962 original: +4 and −9, one ratio, one bet decision. Count a full deck in the trainer.", links: [["Chapter 5 — Ten-Count", "#/chapter/tencount"], ["Lab: Count Trainer", "#/lab/count"]], check: "chapter:tencount", badge: "ten-counter" },
          { title: "Go modern with Hi-Lo", text: "+1 / 0 / −1 and the true count. The system almost every professional descends from.", links: [["Chapter 6 — Hi-Lo", "#/chapter/hilo"]], check: "chapter:hilo", badge: "hilo-counter" },
          { title: "Learn to bet like Kelly", text: "Edge means nothing without sizing. The Kelly criterion, the ramp, and why survivors bet less than they want to.", links: [["Chapter 8 — Money", "#/chapter/money"]], check: "chapter:money" },
          { title: "Play the table — and survive it", text: "Sit at the single-deck lab table with the count on screen, then read the era's cheating chapter so nobody ever owns you.", links: [["Lab: Play the Table", "#/lab/table"], ["Chapter 9 — Survival", "#/chapter/survival"]], check: "chapter:survival", badge: "cheat-detective" },
        ],
        tips: [
          ["Count in pairs", "Read two cards as one number. A,4 is a wash (+4 then −1)… you will halve your mental load in a day."],
          ["Never insure a fresh deck", "Insurance needs ten-density above 1/3. A fresh shoe sits under it. Only the count can move you across."],
          ["Doubles before splits", "Doubling earns the most, and is the easiest part of basic strategy. Learn the double rows first."],
          ["Say it out loud", "Verbalizing '16 against ten: hit' while drilling wires the reflex faster than silent clicking."],
          ["Bet from the bankroll, not the mood", "Kelly sizes the bet from edge and variance. Losing streaks are not information."],
          ["Stand on 16 vs 10 only when rich", "The famous play deviation flips only at high counts. At zero, the engine still says hit."],
          ["The Ace is worth more than a ten", "Aces power naturals (paid 3:2); tens merely feed doubles. Advanced counts treat them differently — remember that when you meet side counts."],
          ["Walk on negative shoes", "Table minimum, or leave. Walking is a correct bet of zero."],
          ["Look like a gambler, think like an accountant", "Camouflage is personality, not arithmetic. Chat, tip, lose small on purpose — at minimum bet only."],
          ["Judge nothing by one weekend", "Edge surfaces over thousands of hands. Variance owns the short run; discipline owns the long one."],
        ],
      },
      pokerpedia: {
        title: "The Pokerpedia",
        lede: "Poker's whole culture in four rooms: what beats what, what the hands are called, what the words mean, and the stories that built the game.",
        hands: "Hand rankings",
        names: "Hand nicknames",
        terms: "Poker glossary",
        lore: "Lore & legends",
        handsNote: "Probabilities are exact for five-card poker (draw). In seven-card games like Texas Hold'em the frequencies shift — a pair lands in ~58% of hands — but the ranking order never changes.",
        namesNote: "The names players actually use. Learn a dozen and you'll understand half of every poker conversation.",
        termsPh: "Search poker terms…",
        none: "Nothing matches — try another word.",
      },
      welcome: {
        title: "Welcome to the table",
        text: "Three doors: a guided path, the full course, or the laboratory. Your progress and language are remembered on this device.",
        bTutorial: "🎓 Take the tutorial",
        bChapter: "📖 Start the course",
        bExplore: "🔬 Straight to the labs",
        dismiss: "I'll explore on my own",
      },
    },
  });
})();
