/* ============================================================
   BTD.App — hash router + page shells
   Routes: #/  #/chapter/:id  #/labs  #/lab/:id  #/glossary  #/about
   cha0smagicklabs.com · MIT
   ============================================================ */
(function () {
  "use strict";
  window.BTD = window.BTD || {};
  const C = window.BTD.Content, Q = window.BTD.Quizzes, G = window.BTD.Glossary;

  let cleanup = null; // current view's cleanup fn (kills timers)

  const app = () => document.getElementById("app");

  function setCleanup(fn) {
    if (cleanup) { try { cleanup(); } catch (e) {} }
    cleanup = fn || null;
  }

  /* ---------- shared page pieces ---------- */
  function chapterNav(idx) {
    const prev = C.chapters[idx - 1], next = C.chapters[idx + 1];
    return `<div class="chapnav">
      ${prev ? `<a class="btn" href="#/chapter/${prev.id}">← ${prev.num}. ${prev.title}</a>` : "<span></span>"}
      ${next ? `<a class="btn primary" href="#/chapter/${next.id}">${next.num}. ${next.title} →</a>` : `<a class="btn primary" href="#/labs">Go to the Laboratory →</a>`}
    </div>`;
  }

  function mountWidgets(rootEl) {
    rootEl.querySelectorAll("[data-widget]").forEach((el) => {
      const name = el.getAttribute("data-widget");
      const fn = C.widgets[name];
      if (fn) { try { fn(el); } catch (e) { el.innerHTML = "<p class='feedback bad'>Widget failed to load.</p>"; console.error(e); } }
    });
  }

  function badge(id) {
    const b = window.BTD.BADGES.find((x) => x.id === id);
    return b ? `${b.ico} ${b.name}` : id;
  }

  /* ---------- pages ---------- */
  function home() {
    const Store = window.BTD.Store;
    const done = C.chapters.filter((c) => Store.chapterDone(c.id)).length;
    const won = Store.load().badges.length;
    app().innerHTML = `
    <section class="page">
      <div class="hero-split home-hero">
        <div data-hero-table></div>
        <div class="home-hero-text">
          <h1>Learn to beat the dealer — the way it was actually done.</h1>
          <p>A free interactive course built on Edward O. Thorp's <em>Beat the Dealer</em>:
          nine chapters from the history to the mathematics to the fieldcraft, with a live
          exact-computation engine, six laboratories, and quizzes that grade you.</p>
          <div class="btn-row">
            <a class="btn primary" href="#/chapter/story">Start Chapter 1 →</a>
            <a class="btn" href="#/labs">Skip to the Labs</a>
          </div>
          <p class="byline">${done}/9 chapters · ${won}/${window.BTD.BADGES.length} badges · Level ${Store.level()}</p>
        </div>
      </div>

      <h2>The course</h2>
      <div class="cards-grid">
        ${C.chapters.map((c) => `
        <a class="card chapter-card ${Store.chapterDone(c.id) ? "done" : ""}" href="#/chapter/${c.id}">
          <span class="card-num">${c.num}</span>
          <span class="card-kicker">${c.kicker}</span>
          <h3>${c.title}</h3>
          <p>${c.tagline}</p>
          <span class="card-foot">${Store.chapterDone(c.id) ? "✔ completed" : c.book}</span>
        </a>`).join("")}
      </div>

      <h2>The laboratory</h2>
      <div class="cards-grid">
        ${Object.values(window.BTD.Labs).map((lab) => `
        <a class="card" href="#/lab/${lab.id}">
          <span class="card-ico">${lab.icon}</span>
          <h3>${lab.name}</h3>
          <p>${lab.blurb}</p>
        </a>`).join("")}
      </div>

      <h2>Your record</h2>
      ${Store.badgesHTML()}
      <div class="btn-row"><button class="btn small danger" data-a="reset">Reset all progress</button></div>
    </section>`;
    const hero = app().querySelector("[data-hero-table]");
    if (hero) hero.appendChild(window.BTD.UI.tableHero());
    const reset = app().querySelector("[data-a=reset]");
    if (reset) reset.addEventListener("click", () => {
      if (confirm("Erase all XP, badges and progress?")) { Store.reset(); window.BTD.UI.toast("Progress reset."); home(); }
    });
    setCleanup(null);
  }

  function chapter(id) {
    const idx = C.chapters.findIndex((c) => c.id === id);
    if (idx === -1) return notFound();
    const c = C.chapters[idx];
    const Store = window.BTD.Store;
    app().innerHTML = `
    <section class="page chapter-page">
      <header class="chapter-head">
        <span class="card-kicker">${c.kicker}</span>
        <h1><span class="card-num big">${c.num}</span> ${c.title}</h1>
        <p class="lede">${c.tagline}</p>
        <p class="byline">${c.book} · <a href="#/">all chapters</a></p>
      </header>
      <div class="prose" data-prose>${c.html}</div>
      <div class="quiz-wrap">
        <h2>Test yourself</h2>
        <div data-quiz></div>
      </div>
      <div class="btn-row">
        <button class="btn ${Store.chapterDone(id) ? "" : "primary"}" data-a="mark">
          ${Store.chapterDone(id) ? "✔ Chapter completed" : "Mark chapter complete"}
        </button>
      </div>
      ${chapterNav(idx)}
    </section>`;
    const prose = app().querySelector("[data-prose]");
    mountWidgets(prose);
    const quizHost = app().querySelector("[data-quiz]");
    const qs = Q.data[id];
    if (qs && qs.length) {
      window.BTD.UI.mountQuiz(quizHost, id, qs, {
        onFinish: (score, total) => {
          if (id === "rules" && score === total) Store.award("rules-lawyer");
          if (score / total >= 0.75) { Store.markChapter(id); refreshMarkBtn(); }
        },
      });
    }
    const markBtn = app().querySelector("[data-a=mark]");
    function refreshMarkBtn() {
      markBtn.textContent = Store.chapterDone(id) ? "✔ Chapter completed" : "Mark chapter complete";
      markBtn.classList.toggle("primary", !Store.chapterDone(id));
    }
    markBtn.addEventListener("click", () => {
      Store.markChapter(id);
      if (id === "story") Store.award("storyteller");
      if (id === "rules") Store.award("first-deal");
      if (id === "money") Store.award("kelly-heir");
      window.BTD.UI.toast(Store.chapterDone(id) ? "Chapter complete. Onward." : "Progress kept.");
      refreshMarkBtn();
    });
    setCleanup(null);
    window.scrollTo(0, 0);
  }

  function labsIndex() {
    app().innerHTML = `
    <section class="page">
      <h1>The Laboratory</h1>
      <p class="lede">Six machines that turn reading into reflex. Every number is computed by the engine in your browser — nothing here is a canned answer.</p>
      <div class="cards-grid">
        ${Object.values(window.BTD.Labs).map((lab) => `
        <a class="card" href="#/lab/${lab.id}">
          <span class="card-ico">${lab.icon}</span>
          <h3>${lab.name}</h3>
          <p>${lab.blurb}</p>
        </a>`).join("")}
      </div>
    </section>`;
    setCleanup(null);
    window.scrollTo(0, 0);
  }

  function lab(id) {
    const lab = window.BTD.Labs[id];
    if (!lab) return notFound();
    app().innerHTML = `
    <section class="page lab-page">
      <header class="chapter-head">
        <span class="card-kicker">Laboratory</span>
        <h1><span class="card-ico big">${lab.icon}</span> ${lab.name}</h1>
        <p class="lede">${lab.blurb}</p>
        <p class="byline"><a href="#/labs">← all labs</a></p>
      </header>
      <div class="lab-shell" data-lab></div>
    </section>`;
    const host = app().querySelector("[data-lab]");
    let fn = null;
    try { fn = lab.mount(host); } catch (e) { host.innerHTML = "<p class='feedback bad'>Lab failed to start.</p>"; console.error(e); }
    setCleanup(typeof fn === "function" ? fn : null);
    window.scrollTo(0, 0);
  }

  function glossary() {
    app().innerHTML = `
    <section class="page">
      <h1>Glossary</h1>
      <p class="lede">${G.terms.length} terms, from Ace-rich to Variance — the vocabulary of the book and the tables.</p>
      <input class="search" type="search" placeholder="Search terms…" data-out="q" aria-label="Search glossary">
      <div data-out="list"></div>
    </section>`;
    const q = app().querySelector("[data-out=q]");
    const list = app().querySelector("[data-out=list]");
    function render() {
      const term = q.value.trim().toLowerCase();
      const items = G.terms.filter((t) =>
        !term || t.term.toLowerCase().includes(term) || t.def.toLowerCase().includes(term) || (t.tag && t.tag.includes(term)));
      list.innerHTML = items.length
        ? `<dl class="gloss-grid">` + items.map((t) =>
            `<div class="gloss-item"><dt>${t.term}${t.tag ? ` <span class="chip-tag">${t.tag}</span>` : ""}</dt><dd>${t.def}</dd></div>`).join("") + `</dl>`
        : "<p class='feedback'>Nothing matches — try another word.</p>";
    }
    q.addEventListener("input", render);
    render();
    setCleanup(null);
    window.scrollTo(0, 0);
  }

  function about() {
    const Store = window.BTD.Store;
    app().innerHTML = `
    <section class="page">
      <h1>About this site</h1>
      <div class="prose">
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
        anywhere, for anything: 21+, within your means, and never as an investment plan.</p>
      </div>
      <h2>Your badges</h2>
      ${Store.badgesHTML()}
      <div class="btn-row"><a class="btn" href="#/">← Back to the course</a></div>
    </section>`;
    setCleanup(null);
    window.scrollTo(0, 0);
  }

  function notFound() {
    app().innerHTML = `
    <section class="page">
      <h1>Card not found</h1>
      <p class="lede">That route fell out of the shoe. Back to the course:</p>
      <div class="btn-row"><a class="btn primary" href="#/">← Home</a></div>
    </section>`;
    setCleanup(null);
  }

  /* ---------- router ---------- */
  function route() {
    const h = location.hash.replace(/^#\/?/, "");
    const parts = h.split("/").filter(Boolean);
    if (!parts.length) return home();
    if (parts[0] === "chapter" && parts[1]) return chapter(parts[1]);
    if (parts[0] === "labs") return labsIndex();
    if (parts[0] === "lab" && parts[1]) return lab(parts[1]);
    if (parts[0] === "glossary") return glossary();
    if (parts[0] === "about") return about();
    return notFound();
  }

  window.addEventListener("hashchange", route);
  window.BTD.Store.refreshHUD();
  route();
})();
