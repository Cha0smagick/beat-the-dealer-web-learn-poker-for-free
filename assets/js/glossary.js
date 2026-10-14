/* ============================================================
   BTD.Glossary — blackjack & counting vocabulary
   Original definitions · cha0smagicklabs.com · MIT
   ============================================================ */
(function () {
  "use strict";
  window.BTD = window.BTD || {};
  const G = window.BTD.Glossary = { terms: [] };

  const T = (term, def, tag) => G.terms.push({ term, def, tag: tag || "" });

  T("Ace-rich", "A remaining deck holding proportionally more Aces than a fresh deck. Powerful for naturals and soft doubles; the reason advanced systems run an ace side count.", "composition");
  T("Barring", "A casino's refusal to let a player continue — the standard, legal response to suspected counting. 'Barred' players are politely escorted out and photographed.", "fieldcraft");
  T("Basic strategy", "The mathematically optimal way to play every total against every dealer up-card with no knowledge of the remaining deck. Computed by exact expected-value comparison — never memorized from folklore.", "system");
  T("Bet ramp", "The schedule mapping true count → bet size. Its shape should be Kelly logic; its ceiling is bounded by bankroll and by casino tolerance.", "money");
  T("Bust", "A hand exceeding 21, an automatic loss. The player can bust; the dealer can too — and is forced to try, whenever required to draw on 12–16.", "rules");
  T("Camouflage", "Deliberate behavior (loose play, tipping, chatter, small deliberate 'mistakes' at minimum bet) that makes a counter look like an ordinary gambler. Trades a little edge for a lot of anonymity.", "fieldcraft");
  T("Cold deck", "A stacked or prepared deck introduced at the shuffle, engineered to produce losing sequences. Documented by Thorp as an era-standard cheat. Signature: impossible outcome runs.", "cheating");
  T("Composition-dependent", "A strategy whose play changes with the exact cards remaining (the book's single-deck tables). Contrast with total-dependent (only the count matters).", "composition");
  T("Cut card", "A colored card inserted by a player that defines the shuffle point. 'Shallow penetration' (early cut) is the modern casino's main defense against counters.", "modern game");
  T("Deck penetration", "How deeply into the shoe the dealer deals before shuffling. The deeper the penetration, the more information a counter ever gets to see.", "modern game");
  T("Double down", "First-two-cards option: double your bet in exchange for exactly one more card, then stand. The biggest single weapon in basic strategy.", "rules");
  T("Expected value (EV)", "The average result of a decision per unit bet over infinite repetition, expressed as a fraction of the wager (e.g. −0.18 means losing 18 cents per dollar on average). All strategy cells are EV comparisons.", "math");
  T("First base", "The seat that receives cards first. irrelevant to strategy but beloved of dealers' patter.", "table");
  T("Flat bet", "Betting the same amount every hand regardless of the count. Guarantees you never monetize counting — the house edge slowly wins anyway.", "money");
  T("Hard hand", "A hand with no Ace counted as 11 (or whose Ace must already count as 1). Hard hands can bust with one card.", "rules");
  T("Heat", "Casino attention directed at a suspected counter: watching, chatting pit bosses, early shuffles, and eventually barring. Managed with camouflage and session discipline.", "fieldcraft");
  T("Hi-Lo", "The balanced level-one count adopted for the 1966 second edition after Julian Braun's simulations: 2–6 = +1, 7–9 = 0, tens/A = −1. The template for most practical systems since.", "system");
  T("Hole card", "The dealer's face-down card. The entire information problem of blackjack is that you must act before it is exposed.", "rules");
  T("Insurance", "A side bet (up to half your wager) that the dealer's hole card is a ten-valued card, offered only when the dealer shows an Ace. Pays 2:1; correct exactly when ten-density exceeds 1/3 — the first play counters ever 'owned'.", "rules");
  T("Kelly criterion", "John Kelly Jr.'s 1956 result: the growth-optimal fraction of capital to risk is f* = edge ÷ variance. Thorp imported it into blackjack betting and later into finance.", "money");
  T("Marked cards", "Cards doctored (pin-pricks, shading, gloss patterns) so an accomplice can read their backs. An era-standard cheat targeting everyone at the table.", "cheating");
  T("Natural (blackjack)", "Ace + ten-valued card on the original two cards. Pays 3 to 2 — the player's biggest standing privilege, and the one most sensitive to ten-density.", "rules");
  T("Penetration", "See 'Deck penetration'. The single most important number on any modern table you're evaluating.", "modern game");
  T("Peek", "The dealer's glance at the hole card for a natural when showing an Ace or ten. Modern games rule out player losses to dealer naturals after doubles/splits — the engine's 'peek convention' conditions EVs the same way.", "rules");
  T("Running count", "The cumulative sum of count values of all cards seen since the shuffle. Raw material; must be converted to true count for betting.", "system");
  T("Second dealing", "Serving the second card from the top while pretending it is the first — the era's classic crooked-dealer move. Watch the grip, not the outcomes.", "cheating");
  T("Shoe", "The box holding multiple decks (4–8 in modern games) from which cards are dealt. Multi-deck shoes were adopted because of this book.", "modern game");
  T("Soft hand", "A hand containing an Ace still counted as 11. Cannot bust on the next card — the Ace demotes to 1. Soft-hand strategy is the most counter-intuitive part of basic strategy.", "rules");
  T("Spotter", "A team-play member who flat-bets and counts at a crowded table, signaling a 'big player' to join only when the deck is rich.", "fieldcraft");
  T("Stand", "To stop drawing. Everything the dealer is forced to do afterward happens blind to your stake's fate.", "rules");
  T("Stiff", "A hard total of 12–16: too weak to stand happily, too strong to hit safely. Both the player's pain and the dealer's forced-draw trap.", "table");
  T("Ten-density", "The fraction of ten-valued cards among the remaining cards. Above 1/3, insurance flips to the player's side.", "composition");
  T("Ten-rich / ten-poor", "A remaining deck with (respectively) above/below the fresh-deck proportion of ten-valued cards. Ten-rich is the counter's payday: naturals, doubles, dealer busts.", "composition");
  T("Third base", "The last seat to act, with the most information before the dealer plays. Folk wisdom says it 'takes the dealer's bust card' — it does no such thing; shuffling the seating order changes nothing.", "table");
  T("True count", "Running count ÷ decks remaining. The density measure that actually prices bets and play deviations.", "system");
  T("True count (TC) threshold", "The TC at which a play flips (e.g. insurance at ≈ +3 for multi-deck Hi-Lo). Thresholds differ between the 1962 single-deck game and modern shoes — another reason the tables here are computed, not copied.", "system");
  T("Unit", "One standard betting increment, defined by your bankroll and Kelly sizing (a 1% edge → a bet of ≈ 1% of bankroll). All EVs in this course are quoted in units.", "money");
  T("Up-card", "The dealer's single exposed card. The column header of every strategy table.", "rules");
  T("Variance", "The statistical spread of outcomes per bet (blackjack: SD ≈ 1.15 units per hand, variance ≈ 1.15–1.3). Variance is why bankroll sizing, not just edge, decides survival.", "math");
})();
