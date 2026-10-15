/* ============================================================
   BTD.UI + BTD.Store — shared widgets & progress store
   cha0smagicklabs.com · MIT
   ============================================================ */
(function () {
  "use strict";
  window.BTD = window.BTD || {};
  const E = window.BTD.Engine;

  /* ---------- tiny DOM helper ---------- */
  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }

  /* ---------- playing cards ---------- */
  const RANK_NAMES = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
  const SUITS = ["spades", "hearts", "diamonds", "clubs"];

  function cardEl(card, opts) {
    opts = opts || {};
    const size = opts.size ? " " + opts.size : "";
    const wrap = el("div", "pcard" + size);
    const inner = el("div", "pcard-inner");
    const face = el("div", "pcard-face");
    const name = RANK_NAMES[card.rank] + "_of_" + SUITS[card.suit];
    const img = new Image();
    img.alt = opts.label || (E.RANK_CHARS[card.rank] + " of " + SUITS[card.suit]);
    img.draggable = false;
    img.src = "assets/cards/" + name + ".svg";
    img.onerror = function () { this.onerror = null; this.src = "assets/cards/png/" + name + ".png"; };
    face.appendChild(img);
    inner.appendChild(face);
    inner.appendChild(el("div", "pcard-back"));
    wrap.appendChild(inner);
    wrap.setAttribute("role", "img");
    if (opts.faceDown) {
      wrap.classList.add("flipped");
      wrap.setAttribute("aria-label", "Face-down card");
      wrap._reveal = () => {
        wrap.classList.remove("flipped");
        wrap.setAttribute("aria-label", img.alt);
      };
    } else {
      wrap.setAttribute("aria-label", img.alt);
      wrap._reveal = () => {};
    }
    return wrap;
  }

  /* inline text card for prose */
  function tcard(text, red) {
    const s = el("span", "tcard" + (red ? " red" : ""), text);
    return s;
  }

  /* ---------- chips ---------- */
  const DENOMS = [[500, "c500"], [100, "c100"], [25, "c25"], [5, "c5"], [1, "c1"]];
  function chipEl(amount, cls) {
    const c = el("span", "chip " + (cls || ""), String(amount));
    return c;
  }
  function chipStack(amount) {
    const stack = el("span", "chip-stack");
    stack.title = "$" + amount;
    let rest = amount;
    if (rest <= 0) rest = 1;
    for (const [v, cls] of DENOMS) {
      while (rest >= v && stack.children.length < 8) {
        stack.appendChild(chipEl(v, cls));
        rest -= v;
      }
    }
    return stack;
  }

  /* ---------- casino table hero ---------- */
  function tableHero() {
    return el("div", "table-hero", `
<svg viewBox="0 0 800 430" role="img" aria-label="Blackjack table">
  <defs>
    <radialGradient id="feltg" cx="50%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#17754a"/><stop offset="100%" stop-color="#0b3d2e"/>
    </radialGradient>
    <linearGradient id="woodg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6b4423"/><stop offset="100%" stop-color="#3a2210"/>
    </linearGradient>
    <path id="arc1" d="M 150 330 A 250 250 0 0 1 650 330" fill="none"/>
    <path id="arc2" d="M 170 330 A 230 230 0 0 1 630 330" fill="none"/>
  </defs>
  <path d="M 60 330 A 340 320 0 0 1 740 330 L 740 352 A 340 340 0 0 1 60 352 Z" fill="url(#woodg)" stroke="#d4af37" stroke-width="3"/>
  <path d="M 100 330 A 300 275 0 0 1 700 330 Z" fill="url(#feltg)" stroke="#d4af37" stroke-width="2"/>
  <text font-family="Georgia,serif" font-size="30" font-weight="bold" fill="#f0cf6b" letter-spacing="6">
    <textPath href="#arc1" startOffset="50%" text-anchor="middle">BLACKJACK PAYS 3 TO 2</textPath>
  </text>
  <text font-family="Georgia,serif" font-size="17" fill="#cfc3a9" letter-spacing="4">
    <textPath href="#arc2" startOffset="50%" text-anchor="middle">DEALER MUST STAND ON 17 · INSURANCE PAYS 2 TO 1</textPath>
  </text>
  <g fill="none" stroke="#d4af37" stroke-width="2.5" stroke-dasharray="7 5">
    <circle cx="250" cy="300" r="30"/><circle cx="325" cy="282" r="30"/>
    <circle cx="400" cy="276" r="30"/><circle cx="475" cy="282" r="30"/>
    <circle cx="550" cy="300" r="30"/>
  </g>
  <g font-family="Georgia,serif" fill="#d4af37" text-anchor="middle">
    <g transform="translate(400 150)">
      <rect x="-46" y="-46" width="92" height="92" transform="rotate(45)" fill="none" stroke="#d4af37" stroke-width="3"/>
      <text x="0" y="16" font-size="52" font-weight="bold" fill="#f5ead6">21</text>
    </g>
  </g>
</svg>`);
  }

  /* ---------- misc widgets ---------- */
  function stat(k, v) {
    return `<div class="stat"><span class="v">${v}</span><span class="k">${k}</span></div>`;
  }
  function toast(msg) {
    let t = document.getElementById("toast");
    if (!t) { t = el("div"); t.id = "toast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._h);
    toast._h = setTimeout(() => t.classList.remove("show"), 2600);
  }
  const pct = (x) => (x >= 0 ? "+" : "") + (x * 100).toFixed(2) + "%";

  /* ---------- progress store ---------- */
  const KEY = "btd-progress-v1";
  const BADGES = [
    { id: "first-deal", ico: "🃏", name: "First Deal", desc: "Finish the Rules chapter" },
    { id: "storyteller", ico: "📖", name: "Storyteller", desc: "Finish the Story chapter" },
    { id: "rules-lawyer", ico: "⚖️", name: "Rules Lawyer", desc: "Score 100% on the Rules quiz" },
    { id: "basic-adept", ico: "🎯", name: "Basic Adept", desc: "90%+ over 20+ drill hands" },
    { id: "ten-counter", ico: "🔟", name: "Ten-Counter", desc: "Count a full deck in Ten-Count" },
    { id: "hilo-counter", ico: "➕", name: "Hi-Lo Counter", desc: "Count a full deck in Hi-Lo" },
    { id: "card-sense", ico: "🧠", name: "Card Sense", desc: "Perfect deck: zero counting errors" },
    { id: "kelly-heir", ico: "📈", name: "Kelly's Heir", desc: "Finish Money Management" },
    { id: "cheat-detective", ico: "🕵️", name: "Cheat Detective", desc: "80%+ on Spot the Cheat" },
    { id: "bookworm", ico: "🏆", name: "Bookworm", desc: "Complete all nine chapters" },
  ];

  const Store = {
    _s: null,
    load() {
      if (this._s) return this._s;
      try { this._s = JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { this._s = null; }
      if (!this._s) this._s = { xp: 0, chapters: {}, badges: [], records: {} };
      return this._s;
    },
    save() { try { localStorage.setItem(KEY, JSON.stringify(this._s)); } catch (e) {} this.refreshHUD(); },
    addXP(n) { const s = this.load(); s.xp += n; this.save(); },
    level() { return 1 + Math.floor(this.load().xp / 300); },
    markChapter(id) {
      const s = this.load();
      if (!s.chapters[id]) s.chapters[id] = {};
      if (!s.chapters[id].done) { s.chapters[id].done = true; s.xp += 60; }
      if (Object.keys(s.chapters).filter(k => s.chapters[k].done).length >= 9) this.award("bookworm");
      this.save();
    },
    chapterDone(id) { const c = this.load().chapters[id]; return !!(c && c.done); },
    quizBest(id) { const c = this.load().chapters[id]; return c && c.quizBest !== undefined ? c.quizBest : null; },
    recordQuiz(id, score, total) {
      const s = this.load();
      if (!s.chapters[id]) s.chapters[id] = {};
      const prev = s.chapters[id].quizBest;
      if (prev === undefined || score > prev) {
        s.chapters[id].quizBest = score;
        s.xp += 10 * Math.max(0, score - (prev || 0));
      }
      this.save();
    },
    record(k, v) { const s = this.load(); s.records[k] = v; this.save(); },
    rec(k) { return this.load().records[k]; },
    award(id) {
      const s = this.load();
      if (s.badges.indexOf(id) === -1) {
        s.badges.push(id);
        s.xp += 120;
        const b = BADGES.find(x => x.id === id);
        toast("🏅 Badge earned — " + (b ? b.name : id));
        this.save();
      }
    },
    has(id) { return this.load().badges.indexOf(id) !== -1; },
    reset() { this._s = { xp: 0, chapters: {}, badges: [], records: {} }; this.save(); },
    refreshHUD() {
      const fill = document.getElementById("xp-fill");
      const label = document.getElementById("xp-label");
      if (!fill || !label) return;
      const s = this.load();
      const into = s.xp % 300;
      fill.style.width = (100 * into / 300) + "%";
      label.textContent = "Level " + this.level() + " · " + s.xp + " XP";
    },
    badgesHTML() {
      const s = this.load();
      return '<div class="badges">' + BADGES.map(b =>
        `<div class="badge ${s.badges.indexOf(b.id) >= 0 ? "won" : ""}"><span class="ico">${b.ico}</span>` +
        `<span class="nm">${window.BTD.I18N ? window.BTD.I18N.f(b, "name") : b.name}</span><span class="ds">${window.BTD.I18N ? window.BTD.I18N.f(b, "desc") : b.desc}</span></div>`).join("") + "</div>";
    },
  };

  /* ---------- quiz renderer ---------- */
  function mountQuiz(container, chapterId, questions, opts) {
    opts = opts || {};
    let score = 0, answered = 0;
    const state = Store.load();

    function render() {
      score = 0; answered = 0;
      container.innerHTML = "";
      questions.forEach((q, qi) => {
        const block = el("div", "quiz-block");
        block.appendChild(el("div", "quiz-q", (qi + 1) + ". " + q.q));
        q.choices.forEach((c, ci) => {
          const btn = el("button", "choice", c);
          btn.addEventListener("click", () => {
            if (block._done) return;
            block._done = true;
            const correct = ci === q.a;
            if (correct) score++;
            answered++;
            btn.classList.add(correct ? "correct" : "wrong");
            block.querySelectorAll(".choice").forEach((b, bi) => {
              b.disabled = true;
              if (bi === q.a) b.classList.add("correct");
            });
            block.appendChild(el("div", "quiz-explain", (correct ? "✔ " : "✘ ") + q.why));
            if (answered === questions.length) finish();
          });
          block.appendChild(btn);
        });
        container.appendChild(block);
      });
    }

    function finish() {
      const total = questions.length;
      const best = Store.quizBest(chapterId);
      Store.recordQuiz(chapterId, score, total);
      const I18 = window.BTD.I18N;
      const sc = I18 ? I18.ui("quiz.score") : "Score";
      const bt = I18 ? I18.ui("quiz.best") : "best";
      const nb = I18 ? I18.ui("quiz.newBest") : "new best!";
      const pill = el("p", "", `<span class="score-pill">${sc}: ${score} / ${total}` +
        (best !== null && score <= best ? ` · ${bt} ${best}` : ` · ${nb}`) + `</span>`);
      container.appendChild(pill);
      if (opts.onFinish) opts.onFinish(score, total);
      const retry = el("button", "btn small", I18 ? I18.ui("quiz.retry") : "Retry quiz");
      retry.addEventListener("click", render);
      container.appendChild(retry);
    }
    render();
  }

  window.BTD.UI = { el, cardEl, tcard, chipEl, chipStack, tableHero, stat, toast, pct, mountQuiz };
  window.BTD.Store = Store;
  window.BTD.BADGES = BADGES;
})();
