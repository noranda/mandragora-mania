# Mandragora Mania - Analyzer Scoring Rules (Modern Analyzer)

This document describes the scoring system used by the minimax/alpha-beta **move analyzer** to evaluate and rank possible moves. The analyzer is designed to recommend moves that maximize your chances of winning, using a combination of immediate rewards, lookahead, and phase-aware evaluation.

---

## 1. Immediate Points

- **+10** for each point scored (i.e., each piece that lands in your base and scores).
- **Rationale:** Scoring is the primary way to win, so it is heavily weighted in the evaluation.

## 2. Extra Turn Bonus

- **Explained:** If a move grants an extra turn (the last piece lands in your base), this is reflected in the move's explanation and the minimax search continues with the same player.
- **Rationale:** Extra turns are extremely valuable, often leading to chain moves and more scoring. The analyzer's lookahead will recursively evaluate the value of these chains.

## 3. Minimax Lookahead (with Alpha-Beta Pruning)

- The analyzer simulates up to a configurable depth (default: 3 moves ahead) using a minimax algorithm with alpha-beta pruning.
- **Discount Factor:** The value of future moves is multiplied by a discount factor (**0.8** by default) to prioritize immediate gains but still reward strong follow-ups.
- **Rationale:** This rewards moves that set up strong sequences, not just immediate points.

## 4. Phase-Aware Evaluation Function

- The analyzer uses a different evaluation function depending on the phase of the game:
  - **Early Game (many pieces left):**
    - Prioritizes mobility (number of valid moves) and extra turn potential.
    - Formula: `(playerScore - opponentScore) * 5 + mobility * 3`
    - **Mobility:** Number of valid moves available to the current player.
  - **Late Game (few pieces left):**
    - Prioritizes the score difference.
    - Formula: `(playerScore - opponentScore) * 15`
- **Rationale:** Early in the game, flexibility and options are important; late in the game, maximizing your score lead is critical.

---

## Additional Notes

- **No Arbitrary Bonuses:** The analyzer does not use explicit bonuses for board presence, perfect moves, average piece value, or flexibility. All strategic value is captured by the phase-aware evaluation and lookahead.
- **No Explicit Opponent Penalties:** Instead of explicit penalization for opponent opportunities, the minimax search naturally accounts for the best possible opponent responses.
- **Transparency:** The system is designed to be transparent and easily adjustable as the game evolves. All scoring logic is contained in the analyzer code and this document.

---

**Summary Table:**

| Rule                  | Value/Formula                                  | Rationale                                    |
| --------------------- | ---------------------------------------------- | -------------------------------------------- |
| Immediate Points      | +10 per point scored                           | Scoring is the main objective                |
| Extra Turn            | Recursively evaluated in lookahead             | Extra turns are highly valuable              |
| Minimax Lookahead     | Up to 3 moves, discount factor 0.8             | Rewards strong sequences, not just immediacy |
| Early Game Evaluation | (playerScore - opponentScore) * 5 + mobility*3 | Flexibility is key early                     |
| Late Game Evaluation  | (playerScore - opponentScore) \* 15            | Score lead is key late                       |
| Score Range           | Unbounded (not clamped/normalized)             | Reflects true value of move                  |

---

**If you have questions or want to adjust the analyzer, see the comments in `src/utils/moveAnalyzer.ts`.**
