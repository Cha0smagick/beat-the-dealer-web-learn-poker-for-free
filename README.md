# Beat the Dealer — The Interactive Study

A free, complete, interactive course that turns Edward O. Thorp's classic
**Beat the Dealer** (1962; rev. 1966) into a learn-by-doing website about
**blackjack (twenty-one)** — the game the book actually teaches.

**Built free by [cha0smagicklabs.com](https://cha0smagicklabs.com).**
No ads, no trackers, no accounts, no real money. Just the math.

## What's inside

- **9 chapters** covering the whole book: the story, the rules, why the game
  can be beaten, the basic strategy, the **Ten-Count**, the **Hi-Lo count**,
  the complete point count, betting & money management (Kelly criterion,
  risk of ruin), and casino survival (camouflage, heat, cheating detection).
- **A guided tutorial** (`#/tutorial`) — seven self-checking steps from zero
  to table-ready, each one marked automatically by your chapter progress and
  badges, plus ten pro tips distilled from the book.
- **6 labs**: card-counting trainer, basic-strategy drill, a playable
  blackjack table with a counting coach, a 10,000-hand Monte Carlo casino,
  a live probability explorer, and a strategy-table computer that recomputes
  basic strategy **from the rules, in your browser** — exactly what Thorp did
  on an IBM 704 in 1959.
- **The Pokerpedia** (`#/pokerpedia`) — a bilingual encyclopedia of poker:
  the 10 hand rankings with exact five-card odds, 22 hand nicknames
  (Pocket Rockets, Big Slick, the Dead Man's Hand…), a 42-term poker
  glossary, and seven legends from Hickok to Moneymaker.
- **Quizzes** after every chapter, two glossaries (blackjack + poker), a
  welcome onboarding, XP, and badges.
- **Translatable to any language** — the whole UI, chapters, quizzes and
  glossaries load from language packs (Spanish ships included; see below).
- Everything computed locally. The odds tables are not copied from anywhere:
  they are derived live by an exact card-composition engine shipped with the
  site.

## Languages

The site is pack-based and self-healing: every string lookup falls back to
English, so a half-finished translation never breaks anything.

- **Language selection**: `?lang=xx` URL param → saved choice
  (localStorage `btd-lang`) → browser language → English. The masthead
  selector persists your choice and reloads the page.
- **Architecture**: `assets/js/i18n.js` holds the core (`register`, `ui`,
  `page`, `chapter`, `quiz`, `glossary`, `f`). The English modules
  (`content.js`, `quizzes.js`, `glossary.js`) *are* the English source; a
  pack only overrides fields it carries, deep-merged on load.
- **Inline bilingual data**: Pokerpedia entries and lab/badge names carry
  `field__es` siblings (e.g. `name__es`) read via `I18N.f(obj, field)` —
  add `field__fr`, `field__de`… to extend.

### Add a language (e.g. French)

1. Copy `assets/js/i18n/es.js` → `fr.js`, translate the `meta`, `ui`,
   `pages`, and `glossary` sections, and change every `register("es", …)`
   to `register("fr", …)` (also in the chapters/quizzes files).
2. Copy `i18n/es-chapters.js` and `i18n/es-quizzes.js`, translate, keeping
   the `data-widget` divs in place and quiz answer indices identical.
3. Add the three `<script defer>` tags to `index.html` **after** the labs
   and before `app.js` (labs must load first so packs can inject translated
   names into them).
4. Run `node tools\smoke-content.cjs` — it validates that your pack covers
   every UI key, every chapter widget reference, and every quiz answer key.

Known limits (contribution points): the interior strings of the six lab
widgets and two data-driven widgets (`spotTheCheat`, `countWalkthrough`
walk-through copy) remain English in v1; the pack keys for the counting
trainer (`count.lab.*`) are already in place for wiring them.

## Run it locally

Any static server works. For example:

```bash
# Python
python -m http.server 8000
# or Node
npx serve .
```

Then open http://localhost:8000. (Opening `index.html` directly also works —
the site uses no ES modules.)

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository (branch `main`).
2. In the repo: **Settings → Pages → Build and deployment → Source:
   GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) deploys on every
   push to `main`. That's it.

## Credits

- **Edward O. Thorp** — *Beat the Dealer* (Blaisdell, 1962; Vintage rev. ed.,
  1966). This site is an original educational exposition of the book's ideas;
  no text from the book is reproduced.
- **Julian Braun** — computer-refined strategy tables (IBM 704/7090) behind
  the second edition's count systems.
- **David Bellot** — playing-card artwork, from the open-source
  *SVG-cards 1.3* pack (see `assets/cards/`).
- **cha0smagicklabs.com** — design, code, engine, labs, and curriculum.

## Disclaimer

Educational only. Casinos are real, the house edge is real, and card counting
is legal but unwelcome. The point of this project is the mathematics — learn
it, don't lose your shirt. 21+.
