/* ============================================================
   BTD.App — hash router + page shells (i18n-aware)
   Routes: #/  #/chapter/:id  #/labs  #/lab/:id  #/glossary
           #/pokerpedia  #/tutorial  #/about
   All page furniture comes from the I18N pack; chapter prose,
   quizzes and the glossary fall back to the English modules.
   cha0smagicklabs.com · MIT
   ============================================================ */
(function () {
  "use strict";
  window.BTD = window.BTD || {};
  const C = window.BTD.Content, Q = window.BTD.Quizzes, G = window.BTD.Glossary;

  /* I18N with a null-object shim: if a pack file ever fails to
     load, the site still renders in the source language. */
  const I = window.BTD.I18N || {
    lang: "en",
    ui: (k) => k,
    page: () => ({}),
    chapter: (id) => C.chapters.find((c) => c.id === id),
    quiz: (id) => Q.data[id] || [],
    glossary: () => G.terms,
    f: (o, fld) => (o && o[fld]),
    init: () => {},
  };
  const T = (k) => I.ui(k);

  let cleanup = null; // current view's cleanup fn (kills timers)
  const app = () => document.getElementById("app");

  function setCleanup(fn) {
    if (cleanup) { try { cleanup(); } catch (e) {} }
    cleanup = fn || null;
  }

  /* ---------- shared page pieces ---------- */
  function chapterNav(idx) {
    const list = I.chapters ? I.chapters() : C.chapters;
    const prev = list[idx - 1], next = list[idx + 1];
    return `<div class="chapnav">
      ${prev ? `<a class="btn" href="#/chapter/${prev.id}">← ${prev.num}. ${prev.title}</a>` : "<span></span>"}
      ${next ? `<a class="btn primary" href="#/chapter/${next.id}">${next.num}. ${next.title} →</a>` : `<a class="btn primary" href="#/labs">${T("quiz.labLink")}</a>`}
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
    return b ? `${b.ico} ${I.f(b, "name")}` : id;
  }

  function welcomeModal() {
    const w = I.page("welcome");
    if (!w.title) return; // pack missing → skip silently
    try { if (localStorage.getItem("btd-welcome-v1")) return; } catch (e) {}
    const seen = () => { try { localStorage.setItem("btd-welcome-v1", "1"); } catch (e) {} };
    const ov = document.createElement("div");
    ov.className = "modal-overlay";
    ov.innerHTML = `
      <div class="modal welcome" role="dialog" aria-modal="true" aria-label="${w.title}">
        <h2>${w.title}</h2>
        <p>${w.text}</p>
        <div class="btn-row">
          <a class="btn primary" href="#/tutorial">${w.bTutorial}</a>
          <a class="btn" href="#/chapter/story">${w.bChapter}</a>
          <a class="btn" href="#/labs">${w.bExplore}</a>
        </div>
        <button class="btn small ghost" data-a="dismiss">${w.dismiss}</button>
      </div>`;
    ov.addEventListener("click", (e) => {
      seen();
      if (e.target === ov || (e.target.closest && e.target.closest("[data-a=dismiss]"))) ov.remove();
    });
    document.body.appendChild(ov);
  }

  /* ---------- pages ---------- */
  function home() {
    const Store = window.BTD.Store;
    const P = I.page("home");
    const chapters = I.chapters();
    const done = chapters.filter((c) => Store.chapterDone(c.id)).length;
    const won = Store.load().badges.length;
    app().innerHTML = `
    <section class="page">
      <div class="hero-split home-hero">
        <div data-hero-table></div>
        <div class="home-hero-text">
          <h1>${P.heroTitle}</h1>
          <p>${P.heroText}</p>
          <div class="btn-row">
            <a class="btn primary" href="#/tutorial">${P.ctaTutorial}</a>
            <a class="btn" href="#/chapter/story">${P.ctaCourse}</a>
            <a class="btn" href="#/labs">${P.ctaLabs}</a>
          </div>
          <p class="byline">${done}/9 ${P.chaptersWord} · ${won}/${window.BTD.BADGES.length} ${P.badgesWord} · ${P.levelWord} ${Store.level()}</p>
        </div>
      </div>

      <h2>${P.secCourse}</h2>
      <div class="cards-grid">
        ${chapters.map((c) => `
        <a class="card chapter-card ${Store.chapterDone(c.id) ? "done" : ""}" href="#/chapter/${c.id}">
          <span class="card-num">${c.num}</span>
          <span class="card-kicker">${c.kicker}</span>
          <h3>${c.title}</h3>
          <p>${c.tagline}</p>
          <span class="card-foot">${Store.chapterDone(c.id) ? P.completed : c.book}</span>
        </a>`).join("")}
      </div>

      <h2>${P.secLabs}</h2>
      <div class="cards-grid">
        ${Object.values(window.BTD.Labs).map((lab) => `
        <a class="card" href="#/lab/${lab.id}">
          <span class="card-ico">${lab.icon}</span>
          <h3>${I.f(lab, "name")}</h3>
          <p>${I.f(lab, "blurb")}</p>
        </a>`).join("")}
      </div>

      <h2>${P.secRecord}</h2>
      ${Store.badgesHTML()}
      <div class="btn-row"><button class="btn small danger" data-a="reset">${P.reset}</button></div>
    </section>`;
    const hero = app().querySelector("[data-hero-table]");
    if (hero) hero.appendChild(window.BTD.UI.tableHero());
    const reset = app().querySelector("[data-a=reset]");
    if (reset) reset.addEventListener("click", () => {
      if (confirm("Erase all XP, badges and progress?")) { Store.reset(); window.BTD.UI.toast("Progress reset."); home(); }
    });
    welcomeModal();
    setCleanup(null);
  }

  function chapter(id) {
    const idx = C.chapters.findIndex((c) => c.id === id);
    if (idx === -1) return notFound();
    const c = I.chapter(id);
    const Store = window.BTD.Store;
    app().innerHTML = `
    <section class="page chapter-page">
      <header class="chapter-head">
        <span class="card-kicker">${c.kicker}</span>
        <h1><span class="card-num big">${c.num}</span> ${c.title}</h1>
        <p class="lede">${c.tagline}</p>
        <p class="byline">${c.book} · <a href="#/">${T("quiz.allchapters")}</a></p>
      </header>
      <div class="prose" data-prose>${c.html}</div>
      <div class="quiz-wrap">
        <h2>${T("quiz.header")}</h2>
        <div data-quiz></div>
      </div>
      <div class="btn-row">
        <button class="btn ${Store.chapterDone(id) ? "" : "primary"}" data-a="mark">
          ${Store.chapterDone(id) ? T("quiz.markDone") : T("quiz.mark")}
        </button>
      </div>
      ${chapterNav(idx)}
    </section>`;
    const prose = app().querySelector("[data-prose]");
    mountWidgets(prose);
    const quizHost = app().querySelector("[data-quiz]");
    const qs = I.quiz(id);
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
      markBtn.textContent = Store.chapterDone(id) ? T("quiz.markDone") : T("quiz.mark");
      markBtn.classList.toggle("primary", !Store.chapterDone(id));
    }
    markBtn.addEventListener("click", () => {
      Store.markChapter(id);
      if (id === "story") Store.award("storyteller");
      if (id === "rules") Store.award("first-deal");
      if (id === "money") Store.award("kelly-heir");
      window.BTD.UI.toast(Store.chapterDone(id) ? T("quiz.toastDone") : T("quiz.toastKept"));
      refreshMarkBtn();
    });
    setCleanup(null);
    window.scrollTo(0, 0);
  }

  function labsIndex() {
    const P = I.page("labs");
    app().innerHTML = `
    <section class="page">
      <h1>${P.title}</h1>
      <p class="lede">${P.lede}</p>
      <div class="cards-grid">
        ${Object.values(window.BTD.Labs).map((lab) => `
        <a class="card" href="#/lab/${lab.id}">
          <span class="card-ico">${lab.icon}</span>
          <h3>${I.f(lab, "name")}</h3>
          <p>${I.f(lab, "blurb")}</p>
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
        <span class="card-kicker">${T("nav.labs")}</span>
        <h1><span class="card-ico big">${lab.icon}</span> ${I.f(lab, "name")}</h1>
        <p class="lede">${I.f(lab, "blurb")}</p>
        <p class="byline"><a href="#/labs">← ${T("nav.labs")}</a></p>
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
    const P = I.page("glossary");
    const terms = I.glossary();
    app().innerHTML = `
    <section class="page">
      <h1>${P.title}</h1>
      <p class="lede">${terms.length} · ${P.lede}</p>
      <input class="search" type="search" placeholder="${T("gloss.ph")}" data-out="q" aria-label="${T("gloss.ph")}">
      <div data-out="list"></div>
    </section>`;
    const q = app().querySelector("[data-out=q]");
    const list = app().querySelector("[data-out=list]");
    function render() {
      const term = q.value.trim().toLowerCase();
      const items = terms.filter((t) =>
        !term || t.term.toLowerCase().includes(term) || t.def.toLowerCase().includes(term) || (t.tag && t.tag.includes(term)));
      list.innerHTML = items.length
        ? `<dl class="gloss-grid">` + items.map((t) =>
            `<div class="gloss-item"><dt>${t.term}${t.tag ? ` <span class="chip-tag">${t.tag}</span>` : ""}</dt><dd>${t.def}</dd></div>`).join("") + `</dl>`
        : `<p class='feedback'>${P.none}</p>`;
    }
    q.addEventListener("input", render);
    render();
    setCleanup(null);
    window.scrollTo(0, 0);
  }

  /* ---------- pokerpedia ---------- */
  function pokerpedia() {
    const P = I.page("pokerpedia");
    const PK = window.BTD.Pokerpedia;
    if (!PK) return notFound();
    app().innerHTML = `
    <section class="page">
      <h1>${P.title}</h1>
      <p class="lede">${P.lede}</p>
      <div class="pillnav" role="tablist">
        <button class="pill" data-go="pk-hands">${P.hands}</button>
        <button class="pill" data-go="pk-names">${P.names}</button>
        <button class="pill" data-go="pk-terms">${P.terms}</button>
        <button class="pill" data-go="pk-lore">${P.lore}</button>
      </div>

      <h2 id="pk-hands">${P.hands}</h2>
      <p class="note">${P.handsNote}</p>
      <div class="pk-scroll">
      <table class="data pk-hands">
        <thead><tr><th>#</th><th>${P.hands}</th><th></th><th></th><th></th></tr></thead>
        <tbody>
        ${PK.hands.map((h, i) => `
          <tr>
            <td class="pk-rank">${i + 1}</td>
            <td class="pk-name">${I.f(h, "name")}</td>
            <td class="pk-ex">${h.ex}</td>
            <td class="pk-prob">${I.f(h, "prob")}</td>
            <td class="pk-note">${I.f(h, "note")}</td>
          </tr>`).join("")}
        </tbody>
      </table>
      </div>

      <h2 id="pk-names">${P.names}</h2>
      <p class="note">${P.namesNote}</p>
      <div class="cards-grid pk-nick">
        ${PK.nicknames.map((n) => `
        <div class="card pk-nick-card">
          <div class="pk-cards">${n.cards}</div>
          <h3>${I.f(n, "name")}</h3>
          <p>${I.f(n, "note")}</p>
        </div>`).join("")}
      </div>

      <h2 id="pk-terms">${P.terms}</h2>
      <input class="search" type="search" placeholder="${P.termsPh}" data-out="pkq" aria-label="${P.termsPh}">
      <div data-out="pklist"></div>

      <h2 id="pk-lore">${P.lore}</h2>
      <div class="lore-list">
        ${PK.lore.map((l) => `
        <article class="lore-card">
          <div class="lore-when">${I.f(l, "when")}</div>
          <h3>${I.f(l, "title")}</h3>
          <div class="prose">${I.f(l, "html")}</div>
        </article>`).join("")}
      </div>
    </section>`;

    app().querySelectorAll("[data-go]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const t = app().querySelector("#" + btn.getAttribute("data-go"));
        if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
      }));

    const q = app().querySelector("[data-out=pkq]");
    const list = app().querySelector("[data-out=pklist]");
    function render() {
      const term = q.value.trim().toLowerCase();
      const items = PK.terms.filter((t) =>
        !term || t.term.toLowerCase().includes(term) || t.def.toLowerCase().includes(term));
      list.innerHTML = items.length
        ? `<dl class="gloss-grid">` + items.map((t) =>
            `<div class="gloss-item"><dt>${I.f(t, "term")}</dt><dd>${I.f(t, "def")}</dd></div>`).join("") + `</dl>`
        : `<p class='feedback'>${P.none || "—"}</p>`;
    }
    q.addEventListener("input", render);
    render();
    setCleanup(null);
    window.scrollTo(0, 0);
  }

  /* ---------- tutorial ---------- */
  function tutorial() {
    const P = I.page("tutorial");
    const Store = window.BTD.Store;
    const badges = Store.load().badges;
    const checkDone = (check) => {
      if (!check) return false;
      const [kind, id] = check.split(":");
      if (kind === "chapter") return Store.chapterDone(id);
      if (kind === "badge") return id.split("|").some((b) => badges.indexOf(b) >= 0);
      return false;
    };
    const steps = P.steps || [];
    const doneCount = steps.filter((s) => checkDone(s.check)).length;
    app().innerHTML = `
    <section class="page">
      <h1>${P.title}</h1>
      <p class="lede">${P.lede}</p>
      <p class="byline">${doneCount}/${steps.length} ✓</p>
      <div class="tut-path">
      ${steps.map((s, i) => {
        const done = checkDone(s.check);
        return `
        <div class="tut-step ${done ? "done" : ""}">
          <span class="tut-num">${done ? "✓" : i + 1}</span>
          <div class="tut-body">
            <h3>${s.title}</h3>
            <p>${s.text}</p>
            <div class="btn-row">
              ${(s.links || []).map(([label, href]) => `<a class="btn small ${done ? "" : "primary"}" href="${href}">${label}</a>`).join("")}
              ${s.badge && !badges.includes(s.badge) ? `<span class="chip-tag">🏅 ${badge(s.badge)}</span>` : ""}
            </div>
          </div>
        </div>`;
      }).join("")}
      </div>
      <h2>${P.tipsTitle}</h2>
      <div class="tips-grid">
        ${(P.tips || []).map(([tt, tx]) => `
        <div class="tip-card"><h3>💡 ${tt}</h3><p>${tx}</p></div>`).join("")}
      </div>
      <div class="btn-row"><a class="btn primary" href="#/chapter/story">${I.page("home").ctaCourse}</a></div>
    </section>`;
    setCleanup(null);
    window.scrollTo(0, 0);
  }

  function about() {
    const P = I.page("about");
    const Store = window.BTD.Store;
    app().innerHTML = `
    <section class="page">
      <h1>${P.title}</h1>
      <div class="prose">${P.html}</div>
      <h2>${I.page("home").secRecord}</h2>
      ${Store.badgesHTML()}
      <div class="btn-row"><a class="btn" href="#/">← ${I.page("home").secCourse}</a></div>
    </section>`;
    setCleanup(null);
    window.scrollTo(0, 0);
  }

  function notFound() {
    const P = I.page("notfound");
    app().innerHTML = `
    <section class="page">
      <h1>${P.title || "404"}</h1>
      <p class="lede">${P.text || ""}</p>
      <div class="btn-row"><a class="btn primary" href="#/">${P.cta || "← Home"}</a></div>
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
    if (parts[0] === "pokerpedia") return pokerpedia();
    if (parts[0] === "tutorial") return tutorial();
    if (parts[0] === "about") return about();
    return notFound();
  }

  window.addEventListener("hashchange", route);
  I.init();
  window.BTD.Store.refreshHUD();
  route();
})();
