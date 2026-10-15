/* ============================================================
   BTD.I18N — internationalization core
   Any number of language packs; every lookup falls back to
   English, and every page falls back to working. A pack file
   is just:  BTD.I18N.register("xx", { meta:{name}, ui:{},
   pages:{}, chapters:{}, quizzes:{}, glossary:[] }).
   cha0smagicklabs.com · MIT
   ============================================================ */
(function () {
  "use strict";
  window.BTD = window.BTD || {};

  function deepMerge(base, over) {
    if (over === undefined || over === null) return base;
    if (Array.isArray(over) || typeof over !== "object" || typeof base !== "object" || base === null || Array.isArray(base)) return over;
    const out = Object.assign({}, base);
    for (const k of Object.keys(over)) out[k] = deepMerge(base[k], over[k]);
    return out;
  }

  const I = window.BTD.I18N = {
    packs: { en: {} },
    lang: "en",
    fallback: "en",

    register(lang, pack) {
      if (!lang || !pack || typeof pack !== "object") return;
      this.packs[lang] = deepMerge(this.packs[lang] || {}, pack);
      if (this._wired) this._buildSwitcher(); // new language appears live
    },

    pack() { return this.packs[this.lang] || {}; },
    en() { return this.packs.en || {}; },

    /* flat UI string: ui("c.deal") — current pack, then English, then key */
    ui(key) {
      const parts = key.split(".");
      const get = (root) => parts.reduce((o, p) => (o && o[p] !== undefined ? o[p] : undefined), root);
      /* packs may store keys flat ("quiz.header") or nested ({quiz:{header}}) */
      let v = (this.pack().ui || {})[key];
      if (v === undefined) v = get(this.pack().ui || {});
      if (v !== undefined) return v;
      let e = (this.en().ui || {})[key];
      if (e === undefined) e = get(this.en().ui || {});
      return e !== undefined ? e : key;
    },

    /* page shell: pages.home → merged {en ← current} */
    page(route) {
      const e = (this.en().pages || {})[route] || {};
      const c = (this.pack().pages || {})[route] || {};
      return Object.assign({}, e, c);
    },

    /* chapters: BTD.Content (English) overridden field-by-field */
    chapter(id) {
      const base = (window.BTD.Content.chapters || []).find((c) => c.id === id);
      if (!base) return null;
      const ov = (this.pack().chapters || {})[id] || {};
      return Object.assign({}, base, ov);
    },
    chapters() {
      return (window.BTD.Content.chapters || []).map((c) => this.chapter(c.id)).filter(Boolean);
    },

    /* quizzes: translated array or the English original */
    quiz(id) {
      const ov = (this.pack().quizzes || {})[id];
      if (Array.isArray(ov) && ov.length) return ov;
      return (window.BTD.Quizzes.data || {})[id] || [];
    },

    /* glossary: translated list or the English original */
    glossary() {
      const ov = this.pack().glossary;
      return (Array.isArray(ov) && ov.length) ? ov : (window.BTD.Glossary.terms || []);
    },

    /* localized field on data objects (labs, badges, pokerpedia):
       f(lab, "name") → lab["name__es"] when lang=es, else lab.name */
    f(obj, field) {
      if (!obj) return "";
      if (this.lang !== "en") {
        const v = obj[field + "__" + this.lang];
        if (v !== undefined && v !== null && v !== "") return v;
      }
      return obj[field];
    },

    /* language selection: ?lang=xx beats stored beats browser beats English */
    detect() {
      try {
        const q = new URLSearchParams(location.search).get("lang");
        if (q && this.packs[q]) return q;
      } catch (e) {}
      try {
        const s = localStorage.getItem("btd-lang");
        if (s && this.packs[s]) return s;
      } catch (e) {}
      const nav = (navigator.language || "en").toLowerCase();
      for (const code of Object.keys(this.packs)) {
        if (code !== "en" && nav.startsWith(code)) return code;
      }
      return "en";
    },

    init() {
      this.lang = this.detect();
      document.documentElement.setAttribute("lang", this.lang);
      this._buildSwitcher();
      this._staticText();
    },

    set(lang) {
      if (!this.packs[lang] || lang === this.lang) return;
      try { localStorage.setItem("btd-lang", lang); } catch (e) {}
      location.reload(); // full clean re-render; route is preserved by the hash
    },

    _buildSwitcher() {
      const sel = document.getElementById("lang-select");
      if (!sel) return;
      sel.innerHTML = "";
      Object.keys(this.packs).sort().forEach((code) => {
        const meta = this.packs[code].meta || {};
        const o = document.createElement("option");
        o.value = code;
        o.textContent = meta.name || code.toUpperCase();
        if (code === this.lang) o.selected = true;
        sel.appendChild(o);
      });
      sel.style.display = Object.keys(this.packs).length > 1 ? "" : "none";
      if (!sel._wired) {
        sel._wired = true;
        sel.addEventListener("change", (e) => this.set(e.target.value));
      }
    },

    /* static furniture (nav, brand, footer) via data-i18n attributes */
    _staticText() {
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const v = this.ui(el.getAttribute("data-i18n"));
        if (v) el.innerHTML = v;
      });
    },
  };
})();
