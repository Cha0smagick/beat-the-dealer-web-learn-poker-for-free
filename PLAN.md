# PLAN — "Beat the Dealer: The Interactive Study"

An interactive, self-contained educational website that turns Edward O. Thorp's
*Beat the Dealer* (1962; rev. ed. 1966) into a complete course on twenty-one
(blackjack) — the card game the book actually teaches — with labs, quizzes,
drills, and casino-grade visuals.

- **Built free by** cha0smagicklabs.com
- **Target**: GitHub Pages, deployed by GitHub Actions, zero build step,
  zero third-party libraries, zero trackers.
- **Language**: English (UI + content).
- **Content policy**: 100% original exposition of the book's ideas and
  mathematics. No text reproduced from the book. Facts only; approximations
  are labeled as approximations. Historical facts use only well-documented
  claims (web search was unavailable during the build — anything not fully
  certain is marked "approximate" in the site copy).

> Truth note: *Beat the Dealer* is a book about **blackjack (twenty-one)**,
> not poker. The site teaches the game the book teaches, and says so plainly
> on the home page.

---

## 1. Non-goals

- No real-money gambling, no casino links, no "where to play" content.
- No backend, no accounts, no analytics. Progress lives in `localStorage`.
- No frameworks, no npm, no CDN fonts. Everything ships as static files.

## 2. Architecture

```
/                          (site root — deployed as-is)
├── PLAN.md                ← this file
├── README.md              ← setup + deploy instructions
├── LICENSE                ← MIT (code); card art credited separately
├── .github/workflows/deploy.yml
├── index.html             ← shell: header, <main id="app">, footer, script tags
├── favicon.svg
├── robots.txt
├── 404.html
├── assets/
│   ├── css/main.css       ← casino design system (single stylesheet)
│   ├── cards/*.svg        ← David Bellot's SVG-cards 1.3 (52 faces)
│   └── js/
│       ├── engine.js      ← cards, hand eval, exact-EV strategy engine, counts
│       ├── ui.js          ← shared widgets: cards, chips, tables, toasts, tabs
│       ├── charts.js      ← tiny canvas line/bar charts
│       ├── content.js     ← all chapter prose (original writing)
│       ├── quizzes.js     ← quiz banks + "Spot the Cheat" scenarios
│       ├── glossary.js    ← glossary terms
│       ├── app.js         ← router, progress, badges, boot (loads LAST)
│       └── labs/
│           ├── count.js   ← Card Counting Trainer (Ten-Count & Hi-Lo)
│           ├── drill.js   ← Basic Strategy Drill
│           ├── table.js   ← The Table (play blackjack vs dealer, coach mode)
│           ├── monte.js   ← Monte Carlo: flat bet vs counter, 10k+ hands
│           ├── prob.js    ← Probability Explorer (live dealer/odds math)
│           └── compute.js ← "The IBM 704 in Your Browser": compute strategy
│                             tables live from the rules
└── tools/test-engine.mjs  ← Node validation of the engine (dev only)
```

Script loading: classic `<script defer>` tags (no ES modules) so the site
works even when opened via `file://`. Global namespace: `window.BTD`.

## 3. Design system (casino facade)

- Palette: night-casino — felt green `#0f5132/#0b3d2e`, mahogany `#4a2c17`,
  gold `#d4af37`, cream `#f5ead6`, card red `#b3202c`, ink `#141414`.
- Type: system serif stack (`Palatino, Georgia`) for display; system UI sans
  for body. No webfonts.
- Components: felt table hero (SVG arc table with betting spots + "BLACKJACK
  PAYS 3 TO 2 · DEALER MUST STAND ON 17" rim text), real card faces from
  SVG-cards (CSS 3D flip, patterned back drawn in CSS), casino chips in
  standard denominations ($1 white, $5 red, $25 green, $100 black, $500 purple),
  marquee bulb header, badges, XP bar.
- A11y: focus-visible rings, ARIA labels on all interactive cards/buttons,
  `prefers-reduced-motion` kills flips/marquee, keyboard play in every lab.

## 4. Curriculum (maps to the book)

| # | Route | Chapter | Book source |
|---|-------|---------|-------------|
| 1 | `#/chapter/story` | The Man Who Beat the Dealer | Foreword & Introduction; history |
| 2 | `#/chapter/rules` | Twenty-One: The Rules | Ch. 2 "The Rules of Blackjack" |
| 3 | `#/chapter/why` | Why the Game Can Be Beaten | Introduction + appendices math |
| 4 | `#/chapter/basic` | The Basic Strategy | Ch. 3 "The Basic Strategy" |
| 5 | `#/chapter/tencount` | The Ten-Count | 1st-edition winning system |
| 6 | `#/chapter/hilo` | The Hi-Lo Count | 2nd-edition "simple point count" (Braun) |
| 7 | `#/chapter/complete` | The Complete Point Count | 2nd-edition refinement (Braun) |
| 8 | `#/chapter/money` | Betting & Money Management | Betting/money-management chapters; Kelly |
| 9 | `#/chapter/survival` | Casino Survival: Camouflage & Cheating | Camouflage + cheating chapters |
| — | `#/labs` | The Laboratory (hub) | — |
| — | `#/glossary` | Glossary | — |
| — | `#/about` | About & Credits | — |

Every chapter: original prose, key-idea cards, at least one interactive widget,
a "Check Yourself" quiz (stored score), and a "Mark chapter complete" action.

Verified/derivable numbers used on the site:
- P(player natural | single deck) = 2·(16/52)·(4/51) ≈ **4.83%** (exact math).
- Ten-Count values: A–9 = **+4**, 10s = **−9** (balances: 36·4 = 16·9 = 144).
- Hi-Lo values: 2–6 = **+1**, 7–9 = **0**, 10–A = **−1** (balanced).
- Insurance: pays 2:1, correct when ten-density exceeds 1/3 (≈ Hi-Lo TC ≥ +3,
  the classic Braun threshold).
- Edge ≈ +0.5% per true-count point (approximation, labeled as such).
- Kelly fraction: bet edge ÷ variance (explained, with calculator).
- Anything else (dealer bust tables, EV cells) is **computed live by the
  engine**, not hand-copied — that is the anti-slop guarantee.

## 5. Engine spec (`engine.js`) — the correctness core

- `BTD.Engine`: rank indices 0..12 (A..K); `handValue(cards)` → {total, soft};
  `isNatural`; dealer play (`S17`/`H17` toggle); shoe with Fisher–Yates.
- Exact single-deck EV via composition recursion + memoization:
  `evStand`, `evHit`, `evDouble`, `evSplit` (split depth limited to one
  resplit level; documented approximation). Dealer up A/10: condition on
  "no dealer natural" (peek convention), stated in the UI.
- Infinite-deck probability mode for 4/8-deck questions (constant draw probs).
- Counting systems: `tencount` (+4/−9), `hilo` (+1/0/−1); running count,
  true count (single deck: TC = RC × 13/52-remaining… implemented as RC /
  decksRemaining), insurance point, bet ramps.
- Validation (`tools/test-engine.mjs`, Node):
  1. P(natural) single deck ≈ 0.04826 (±1e-4).
  2. Hard 20 vs 10 → stand (EV stand > EV hit).
  3. Hard 5–8 vs any → hit.
  4. 11 vs 6 → double (single deck).
  5. A,A vs anything → split.
  6. 8,8 vs 10 → split (single-deck S17) — if the engine disagrees with
     documented single-deck charts after debugging, fall back to the
     universally-agreed cell and note it.
  7. Dealer bust probability vs 6 > vs 10 (sanity).
- Acceptance: `node tools/test-engine.mjs` exits 0.

## 6. Labs spec

1. **Counting Trainer** (`#/lab/count`): streams cards (SVG), user calls the
   count; Ten-Count & Hi-Lo modes; penetration %, speed control, keyboard
   (Space = reveal/next), accuracy report per session, perfect-deck badge.
2. **Basic Strategy Drill** (`#/lab/drill`): random 2-card hand vs up-card;
   Hit/Stand/Double/Split buttons; correct play from the engine; streak,
   accuracy, timing; coach explanation on misses.
3. **The Table** (`#/lab/table`): full blackjack against the dealer on an SVG
   casino table; bankroll in chips; optional coach (shows engine's play) and
   live count + edge estimate; bet sizing by ramp.
4. **Monte Carlo Casino** (`#/lab/monte`): N-hand simulation, flat bettor vs
   counter (Hi-Lo ramp), bankroll curve chart, edge/SD/max-drawdown table.
   Chunked so the UI never freezes.
5. **Probability Explorer** (`#/lab/prob`): remove cards from a single deck;
   live dealer-bust-by-upcard chart, natural frequency, basic-strategy EV of
   a chosen matchup — everything recomputed by the engine.
6. **The IBM 704 in Your Browser** (`#/lab/compute`): pick rules (decks 1/∞,
   S17/H17, DAS); computes hard/soft/pairs tables with a progress bar; shows
   Thorp's method ("your browser just did what Thorp did on an IBM 704").

## 7. Gamification

- XP per action (read section, correct quiz, drill streaks), level bar.
- Badges: First Deal, Rules Lawyer, Basic Adept (≥90% drill over ≥20 hands),
  Ten-Counter, Hi-Lo Counter, Card Sense (perfect counted deck), Kelly's Heir,
  Cheat Detective (≥80% scenarios), Bookworm (all 9 chapters).
- All state in `localStorage["btd-progress-v1"]`; reset button in About.

## 8. GitHub Actions (`.github/workflows/deploy.yml`)

Standard official Pages flow, no build:
`actions/checkout@v4` → `actions/configure-pages@v5` →
`actions/upload-pages-artifact@v3` (path: `.`) → `actions/deploy-pages@v4`;
`permissions: pages: write, id-token: write`; `concurrency` group `pages`;
triggers: push to `main` + `workflow_dispatch`.

## 9. Build order (do top to bottom; check off as done)

- [x] 0. Inspect workspace; note SVG-cards pack present.
- [x] 1. Write this plan.
- [x] 2. Copy the 52 card SVGs to `assets/cards/`; delete non-card extras
      (jokers, *2.svg large court variants) from the copied set.
- [x] 3. Scaffold: `.github/workflows/deploy.yml`, `robots.txt`, `404.html`,
      `favicon.svg`, `LICENSE`, `README.md`.
- [x] 4. `index.html` shell + `main.css` design system.
- [x] 5. `engine.js` + `tools/test-engine.cjs`; run tests until green.
- [x] 6. `ui.js` (cards/chips/tables/toasts/tabs) + `charts.js`.
- [x] 7. `content.js` — write all 9 chapters (original prose, widgets hooks).
- [x] 8. `quizzes.js` (per-chapter banks + Spot-the-Cheat) + `glossary.js`.
- [x] 9. Labs: count → drill → table → monte → prob → compute.
- [x] 10. `app.js` (router, progress, badges, boot), wire everything.
- [x] 11. QA: `node --check` every JS file; run engine tests; hash-route
      spot-check; a11y pass (labels, contrast, reduced motion).
- [x] 12. `git init` + initial commit; print deploy instructions
      (create repo → push → Settings ▸ Pages ▸ Source: GitHub Actions).

## 10. Definition of done

- `node tools/test-engine.mjs` passes.
- Every route renders, every lab plays, every quiz scores, progress persists.
- Footer credits: cha0smagicklabs.com (site), E. O. Thorp (the book),
  David Bellot (SVG-cards). Educational disclaimer, no real money.
- Repo ready to push; Pages deploy needs only "Source: GitHub Actions".
