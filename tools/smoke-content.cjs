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

const B = window.BTD;
const C = B.Content;

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

console.log(fails ? "\nSMOKE FAILED: " + fails + " problem(s)" : "\nALL SMOKE TESTS PASSED");
process.exit(fails ? 1 : 0);
