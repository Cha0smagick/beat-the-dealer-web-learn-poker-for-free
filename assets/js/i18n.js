/* ============================================================
   BTD.I18N — internationalization core
   Two translation layers:

   1. Native packs — hand-curated, complete, offline. Register
      with BTD.I18N.register("xx", { meta:{name}, ui:{}, pages:{},
      chapters:{}, quizzes:{}, glossary:[] }). Every lookup falls
      back to English, so a partial pack never breaks anything.

   2. Google overlay — ~46 machine-translated languages driven by
      the free Google Translate element. Choosing one sets the
      `googtrans` cookie and loads Google's widget; it translates
      the English base on the fly. Canvas charts and the switcher
      itself are excluded (notranslate). Curated packs always win.

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

  /* Machine-translated languages (Google Translate overlay).
     n = native name, f = flagcdn.com country code.
     "iw" is Google's legacy code for Hebrew; zh-CN / zh-TW are
     Google's Chinese variants. */
  const GOOGLE = {
    fr: { n: "Français", f: "fr" }, de: { n: "Deutsch", f: "de" },
    it: { n: "Italiano", f: "it" }, pt: { n: "Português", f: "pt" },
    nl: { n: "Nederlands", f: "nl" }, sv: { n: "Svenska", f: "se" },
    no: { n: "Norsk", f: "no" }, da: { n: "Dansk", f: "dk" },
    fi: { n: "Suomi", f: "fi" }, is: { n: "Íslenska", f: "is" },
    pl: { n: "Polski", f: "pl" }, cs: { n: "Čeština", f: "cz" },
    sk: { n: "Slovenčina", f: "sk" }, hu: { n: "Magyar", f: "hu" },
    ro: { n: "Română", f: "ro" }, bg: { n: "Български", f: "bg" },
    el: { n: "Ελληνικά", f: "gr" }, tr: { n: "Türkçe", f: "tr" },
    uk: { n: "Українська", f: "ua" }, ru: { n: "Русский", f: "ru" },
    sr: { n: "Српски", f: "rs" }, hr: { n: "Hrvatski", f: "hr" },
    sl: { n: "Slovenščina", f: "si" }, lt: { n: "Lietuvių", f: "lt" },
    lv: { n: "Latviešu", f: "lv" }, et: { n: "Eesti", f: "ee" },
    ga: { n: "Gaeilge", f: "ie" },
    iw: { n: "עברית", f: "il" }, ar: { n: "العربية", f: "sa" },
    fa: { n: "فارسی", f: "ir" }, ur: { n: "اردو", f: "pk" },
    hi: { n: "हिन्दी", f: "in" }, bn: { n: "বাংলা", f: "bd" },
    ta: { n: "தமிழ்", f: "in" },
    th: { n: "ไทย", f: "th" }, vi: { n: "Tiếng Việt", f: "vn" },
    id: { n: "Bahasa Indonesia", f: "id" }, ms: { n: "Bahasa Melayu", f: "my" },
    tl: { n: "Tagalog", f: "ph" },
    "zh-CN": { n: "中文（简体）", f: "cn" }, "zh-TW": { n: "中文（繁體）", f: "tw" },
    ja: { n: "日本語", f: "jp" }, ko: { n: "한국어", f: "kr" },
    sw: { n: "Kiswahili", f: "ke" }, af: { n: "Afrikaans", f: "za" },
  };

  const I = window.BTD.I18N = {
    packs: { en: {} },
    lang: "en",
    fallback: "en",
    goog: "",     // active Google overlay language ("" = none)
    GOOGLE,       // exposed for tests / future switcher extensions

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

    /* language selection: ?lang=xx beats stored beats browser beats English.
       xx may be a curated pack code or a Google overlay code. */
    detect() {
      try {
        const q = new URLSearchParams(location.search).get("lang");
        if (q) {
          if (this.packs[q]) { this._disableGoog(); return q; }
          if (GOOGLE[q]) { this._enableGoog(q); return "en"; }
        }
      } catch (e) {}
      try {
        const g = localStorage.getItem("btd-goog") || "";
        if (g) {
          if (GOOGLE[g]) {
            const l = localStorage.getItem("btd-lang") || "en";
            if (this.packs[l] && l !== "en") this._disableGoog(); // pack wins over stale overlay
            else this._enableGoog(g);
          } else {
            this._disableGoog();
          }
        }
      } catch (e) {}
      if (this.goog) return "en";
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
      document.documentElement.setAttribute("lang", this.goog || this.lang);
      this._buildSwitcher();
      this._staticText();
      this._wired = true;
      if (this.goog) this._loadGoogleTranslate();
    },

    set(lang) {
      const isGoog = !!GOOGLE[lang];
      if (isGoog && this.goog === lang) return;
      if (!isGoog && !this.goog && (lang === this.lang || !this.packs[lang])) return;
      try {
        if (isGoog) {
          localStorage.setItem("btd-lang", "en"); // overlay always starts from the English base
          localStorage.setItem("btd-goog", lang);
          this._setGoogCookie(lang);
        } else {
          localStorage.setItem("btd-lang", lang);
          localStorage.removeItem("btd-goog");
        }
      } catch (e) {}
      if (!isGoog) this._clearGoogCookie();
      location.reload(); // full clean re-render; route is preserved by the hash
    },

    /* ---- Google overlay plumbing ---- */

    _meta(code) {
      if (this.packs[code]) {
        const m = this.packs[code].meta || {};
        return { n: m.name || code.toUpperCase(), f: m.flag || (code === "en" ? "gb" : code), tag: this.ui("lang.nativeTag") };
      }
      const g = GOOGLE[code];
      return g ? { n: g.n, f: g.f, tag: "" } : { n: code, f: "", tag: "" };
    },

    _flagImg(code, cls) {
      if (!code) return "";
      return '<img class="' + (cls || "ls-flag") + '" src="https://flagcdn.com/w40/' + code
        + '.png" srcset="https://flagcdn.com/w80/' + code + '.png 2x" width="21" height="14"'
        + ' loading="lazy" alt="">';
    },

    /* custom flag dropdown — a native <select> cannot show images */
    _buildSwitcher() {
      const host = document.getElementById("lang-switcher");
      if (!host) return;
      host.setAttribute("translate", "no");
      host.classList.add("notranslate"); // Google must never translate the language menu
      host.innerHTML = "";

      const cur = this.goog || this.lang;
      const curMeta = this._meta(cur);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ls-btn";
      btn.setAttribute("aria-haspopup", "listbox");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", this.ui("lang.label"));
      btn.innerHTML = this._flagImg(curMeta.f, "ls-flag")
        + '<span class="ls-name">' + curMeta.n + '</span><span class="ls-caret">▾</span>';

      const panel = document.createElement("div");
      panel.className = "ls-panel";
      panel.hidden = true;

      const close = () => { panel.hidden = true; btn.setAttribute("aria-expanded", "false"); };
      const mkHead = (txt) => {
        const h = document.createElement("div");
        h.className = "ls-head";
        h.textContent = txt;
        return h;
      };
      const mkOpt = (code) => {
        const m = this._meta(code);
        const b = document.createElement("button");
        b.type = "button";
        b.className = "ls-opt" + (code === cur ? " current" : "");
        b.setAttribute("role", "option");
        b.setAttribute("aria-selected", code === cur ? "true" : "false");
        b.innerHTML = this._flagImg(m.f)
          + '<span class="ls-name">' + m.n + "</span>"
          + (m.tag ? '<span class="ls-tag">' + m.tag + "</span>" : "");
        b.addEventListener("click", () => { close(); this.set(code); });
        panel.appendChild(b);
      };

      panel.appendChild(mkHead(this.ui("lang.nativeSection")));
      Object.keys(this.packs).sort().forEach((c) => mkOpt(c));
      const googCodes = Object.keys(GOOGLE);
      if (googCodes.length) {
        panel.appendChild(mkHead(this.ui("lang.googleSection")));
        googCodes.forEach((c) => mkOpt(c));
      }

      btn.addEventListener("click", () => {
        panel.hidden = !panel.hidden;
        btn.setAttribute("aria-expanded", String(!panel.hidden));
      });
      if (!host._wired) {
        host._wired = true;
        document.addEventListener("click", (e) => {
          const p = host._panel, b = host._btn;
          if (p && !p.hidden && b && !b.contains(e.target) && !p.contains(e.target)) {
            p.hidden = true; b.setAttribute("aria-expanded", "false");
          }
        });
        document.addEventListener("keydown", (e) => {
          const p = host._panel, b = host._btn;
          if (e.key === "Escape" && p && !p.hidden) {
            p.hidden = true; b.setAttribute("aria-expanded", "false"); b.focus();
          }
        });
      }
      host._btn = btn;
      host._panel = panel;
      host.appendChild(btn);
      host.appendChild(panel);
    },

    _setGoogCookie(code) {
      try {
        document.cookie = "googtrans=/en/" + code + "; path=/; SameSite=Lax";
        const h = location.hostname;
        if (h) document.cookie = "googtrans=/en/" + code + "; path=/; domain=" + h + "; SameSite=Lax";
      } catch (e) {}
    },
    _clearGoogCookie() {
      const kill = (extra) => {
        try { document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/" + extra; } catch (e) {}
      };
      kill("");
      try { kill("; domain=" + location.hostname); kill("; domain=." + location.hostname); } catch (e) {}
    },

    _enableGoog(code) {
      this.goog = code;
      try { localStorage.setItem("btd-goog", code); } catch (e) {}
      this._setGoogCookie(code); // refreshed on every load; the widget reads it at script time
    },
    _disableGoog() {
      this.goog = "";
      try { localStorage.removeItem("btd-goog"); } catch (e) {}
      this._clearGoogCookie();
    },

    /* load the free Google Translate element, hidden in the footer anchor */
    _loadGoogleTranslate() {
      if (this._gteRequested || !this.goog) return;
      this._gteRequested = true;
      const code = this.goog;
      window.btdGteInit = () => {
        try {
          new window.google.translate.TranslateElement({
            pageLanguage: "en",
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          }, "google_translate_element");
        } catch (e) {}
        this._driveCombo(code);
      };
      const s = document.createElement("script");
      s.src = "https://translate.google.com/translate_a/element.js?cb=btdGteInit";
      s.async = true;
      (document.head || document.body).appendChild(s);
      setTimeout(() => this._driveCombo(code), 4000); // belt and braces if the callback stalls
    },

    /* make sure the widget's hidden <select> points at the target language */
    _driveCombo(code) {
      let tries = 0;
      const tick = () => {
        const combo = document.querySelector("select.goog-te-combo");
        if (combo) {
          if (combo.value !== code) {
            try {
              combo.value = code;
              combo.dispatchEvent(new Event("change", { bubbles: true }));
            } catch (e) {}
          }
          return;
        }
        if (tries++ < 24) setTimeout(tick, 500);
      };
      tick();
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
