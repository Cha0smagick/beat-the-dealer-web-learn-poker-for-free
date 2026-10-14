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
- **7 labs**: card-counting trainer, basic-strategy drill, a playable
  blackjack table with a counting coach, a 10,000-hand Monte Carlo casino,
  a live probability explorer, and a strategy-table computer that recomputes
  basic strategy **from the rules, in your browser** — exactly what Thorp did
  on an IBM 704 in 1959.
- **Quizzes** after every chapter, a glossary, XP, and badges.
- Everything computed locally. The odds tables are not copied from anywhere:
  they are derived live by an exact card-composition engine shipped with the
  site.

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
