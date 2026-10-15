/* ============================================================
   Smoke test — data integrity without a browser
   Loads engine + content + quizzes + glossary with stubs,
   validates structure. Run: node tools\smoke-content.cjs
   ============================================================ */
"use strict";

/* --- minimal browser stubs --- */
global.window = global;
global.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
function mkEl() {
  return {
    style: {}, children: [], _listeners: {},
    setAttribute() {}, getAttribute() { return null; },
    appendChild(c) { this.children.push(c); return c; },
    removeChild(c) { this.children = this.children.filter((x) => x !== c); },
    addEventListener() {}, removeEventListener() {},
    classList: { add() {}, remove() {}, toggle() {} },
    querySelector() { return null; }, querySelectorAll() { return []; },
  };
}
global.document = {
  createElement: () => mkEl(),
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener() {},
  body: mkEl(),
};

const path = require("path");
const root = path.join(__dirname, "..");
function load(rel) { require(path.join(root, rel)); }

let fails = 0;
const ok = (cond, msg) => {
  if (cond) console.log("  ok  " + msg);
  else { fails++; console.log("  FAIL " + msg); }
};

/* --- load modules in page order --- */
load("assets/js/engine.js");
load("assets/js/ui.js");
load("assets/js/charts.js");
load("assets/js/content.js");
load("assets/js/content-more.js");
load("assets/js/quizzes.js");
load("assets/js/glossary.js");
load("assets/js/pokerpedia.js");
try {
  ["count", "drill", "table", "monte", "prob", "compute"].forEach((n) => load("assets/js/labs/" + n + ".js"));
} catch (e) { console.log("  (labs not loadable in node: " + e.message + ")"); }
load("assets/js/i18n.js");
load("assets/js/i18n/en.js");
load("assets/js/i18n/es.js");
load("assets/js/i18n/es-chapters.js");
load("assets/js/i18n/es-quizzes.js");

const B = window.BTD;
const C = B.Content;
const I = B.I18N;

console.log("== chapters ==");
ok(C.chapters.length === 9, "9 chapters (got " + C.chapters.length + ")");
const ids = new Set();
for (const c of C.chapters) {
  const good = c.id && Number.isInteger(c.num) && c.title && c.kicker && c.tagline && c.book
    && typeof c.html === "string" && c.html.length > 400;
  ok(good, "ch" + c.num + " '" + c.id + "' fields + prose intact");
  ids.add(c.id);
}
ok(new Set(C.chapters.map((c) => c.num)).size === 9, "chapter numbers unique");

console.log("== widgets ==");
const widgetRefs = [];
for (const c of C.chapters) {
  const re = /data-widget="(\w+)"/g; let m;
  while ((m = re.exec(c.html))) widgetRefs.push(m[1]);
}
const missing = widgetRefs.filter((w) => typeof C.widgets[w] !== "function");
ok(widgetRefs.length >= 8, "widget references found (" + widgetRefs.length + ")");
ok(missing.length === 0, "every referenced widget has a mount" + (missing.length ? " — missing: " + missing.join(",") : ""));

console.log("== cheat scenarios ==");
ok(Array.isArray(C.cheats) && C.cheats.length >= 5, "spot-the-cheat scenarios present (" + (C.cheats ? C.cheats.length : 0) + ")");

console.log("== quizzes ==");
for (const c of C.chapters) {
  const qs = B.Quizzes.data[c.id];
  if (!ok(Array.isArray(qs) && qs.length >= 6, c.id + ": quiz with >=6 questions" + (qs ? " (" + qs.length + ")" : " — MISSING"))) continue;
  qs.forEach((q, i) => {
    const good = q.q && Array.isArray(q.choices) && q.choices.length >= 2
      && Number.isInteger(q.a) && q.a >= 0 && q.a < q.choices.length
      && typeof q.why === "string" && q.why.length > 20;
    ok(good, c.id + " q" + (i + 1) + " answer index + explanation valid");
  });
}

console.log("== glossary ==");
ok(B.Glossary.terms.length >= 30, ">=30 terms (got " + B.Glossary.terms.length + ")");
ok(B.Glossary.terms.every((t) => t.term && t.def && t.def.length > 25), "every term has a real definition");
const sorted = [...B.Glossary.terms].every((t, i, a) => i === 0 || a[i - 1].term.toLowerCase() <= t.term.toLowerCase());
ok(sorted, "terms alphabetically ordered");

console.log("== template hygiene ==");
for (const c of C.chapters) {
  ok(!/\bundefined\b|\[object Object\]|\bNaN\b/.test(c.html), "ch" + c.num + " html free of undefined/NaN leakage");
}

/* ============================================================
   i18n packs + Pokerpedia
   ============================================================ */
console.log("== i18n core ==");
ok(I && typeof I.register === "function", "I18N core present");
ok(I.detect && typeof I.detect === "function", "I18N.detect present");
ok(I.lang === "en", "default language is en (got " + I.lang + ")");
ok(I.ui("quiz.header") === "Test yourself", "ui() resolves en keys");
ok(I.ui("nonexistent.key") === "nonexistent.key", "ui() falls back to the key itself");
ok(I.f({ name: "X", name__es: "X-es" }, "name") === "X", "f() returns base field in en");
I.set ? null : null; // set() reloads the page — not testable in node

console.log("== en pack ==");
const enPack = I.packs && I.packs.en;
ok(!!enPack, "en pack registered");
if (enPack) {
  ok(enPack.pages && enPack.pages.home && enPack.pages.tutorial && enPack.pages.welcome && enPack.pages.pokerpedia, "en pages: home/tutorial/welcome/pokerpedia");
  const steps = enPack.pages.tutorial.steps || [];
  ok(steps.length === 7, "tutorial has 7 steps (got " + steps.length + ")");
  ok((enPack.pages.tutorial.tips || []).length === 10, "tutorial has 10 pro tips");
  ok(steps.every((s) => s.title && s.text && s.check), "every tutorial step has title/text/check");
}

console.log("== es pack ==");
const esPack = I.packs && I.packs.es;
ok(!!esPack, "es pack registered");
if (esPack && enPack) {
  const enKeys = Object.keys(enPack.ui || {});
  const missingUi = enKeys.filter((k) => !(k in (esPack.ui || {})));
  ok(missingUi.length === 0, "es ui covers all en keys" + (missingUi.length ? " — missing: " + missingUi.slice(0, 6).join(",") : ""));
  const enPages = Object.keys(enPack.pages || {});
  const missingPages = enPages.filter((p) => !esPack.pages || !esPack.pages[p]);
  ok(missingPages.length === 0, "es pages cover all en pages" + (missingPages.length ? " — missing: " + missingPages.join(",") : ""));
}

console.log("== es chapters ==");
for (const c of C.chapters) {
  const es = esPack && esPack.chapters && esPack.chapters[c.id];
  if (!ok(!!es, c.id + ": es translation present")) continue;
  const refs = (h) => { const out = []; const re = /data-widget="(\w+)"( data-sys="(\w+)")?/g; let m; while ((m = re.exec(h))) out.push(m[1] + (m[3] ? ":" + m[3] : "")); return out; };
  const enR = refs(c.html).join("|"), esR = refs(es.html || "").join("|");
  ok(enR === esR, c.id + ": widget refs match en (" + (esR || "none") + ")");
  ok(typeof es.html === "string" && es.html.length > 3000, c.id + ": es prose substantial (" + ((es.html || "").length) + " chars)");
  ok((es.html || "").includes("protip"), c.id + ": es chapter carries a pro tip");
  ok(!/\bundefined\b|\[object Object\]|\bNaN\b/.test(es.html || ""), c.id + ": es html free of undefined/NaN leakage");
}

console.log("== es quizzes ==");
for (const c of C.chapters) {
  const en = B.Quizzes.data[c.id];
  const es = esPack && esPack.quizzes && esPack.quizzes[c.id];
  if (!ok(Array.isArray(es) && es.length === en.length, c.id + ": es quiz has " + en.length + " questions" + (es ? " (got " + es.length + ")" : " — MISSING"))) continue;
  es.forEach((q, i) => {
    const good = q.q && Array.isArray(q.choices) && q.choices.length === en[i].choices.length
      && Number.isInteger(q.a) && q.a >= 0 && q.a < q.choices.length
      && q.a === en[i].a
      && typeof q.why === "string" && q.why.length > 20;
    ok(good, c.id + " es q" + (i + 1) + " mirrors en choices + answer key");
  });
}

console.log("== es glossary ==");
ok(esPack && Array.isArray(esPack.glossary) && esPack.glossary.length === B.Glossary.terms.length,
  "es glossary mirrors en term count (" + (esPack && esPack.glossary ? esPack.glossary.length : 0) + "/" + B.Glossary.terms.length + ")");
ok(esPack && (esPack.glossary || []).every((t) => t.term && t.def && t.def.length > 25), "every es term has a real definition");

console.log("== lab & badge injections ==");
ok(B.Labs && B.Labs.count && B.Labs.count.name__es, "count lab carries name__es");
ok(B.Labs && B.Labs.compute && B.Labs.compute.blurb__es, "compute lab carries blurb__es");
ok(Array.isArray(B.BADGES) && B.BADGES.every((b) => b.name__es && b.desc__es), "every badge carries es name + desc");

console.log("== pokerpedia ==");
const PK = B.Pokerpedia;
ok(!!PK, "Pokerpedia data present");
if (PK) {
  ok(PK.hands.length === 10, "10 hand rankings (got " + PK.hands.length + ")");
  ok(PK.hands.every((h) => h.name && h.name__es && h.ex.includes("tcard") && h.prob && h.prob__es && h.note && h.note__es), "hands fully bilingual with card examples");
  ok(PK.nicknames.length >= 15, ">=15 nicknames (got " + PK.nicknames.length + ")");
  ok(PK.nicknames.every((n) => n.cards.includes("tcard") && n.name && n.name__es && n.note && n.note__es), "nicknames bilingual with card examples");
  ok(PK.terms.length >= 30, ">=30 poker terms (got " + PK.terms.length + ")");
  ok(PK.terms.every((t) => t.term && t.term__es && t.def && t.def__es), "poker terms bilingual");
  ok(PK.lore.length >= 5, ">=5 lore stories (got " + PK.lore.length + ")");
  ok(PK.lore.every((l) => l.title && l.title__es && l.when && l.when__es && (l.html || "").length > 200 && (l.html__es || "").length > 200), "lore stories bilingual and substantial");
}

console.log(fails ? "\nSMOKE FAILED: " + fails + " problem(s)" : "\nALL SMOKE TESTS PASSED");
process.exit(fails ? 1 : 0);
