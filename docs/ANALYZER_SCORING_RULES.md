# Mandragora Mania - Analyzer Scoring Rules

This document describes the scoring system used by the move analyzer to evaluate and rank possible moves. The analyzer's goal is to recommend moves that maximize your chances of winning, based on both immediate and strategic factors.

Based on the game rules, the following strategic elements are important:

- Controlling more pieces (board presence).
- Setting up future scoring or extra turn opportunities (perfect moves).
- Maximizing the value of pieces you control (high-value Mandragoras).
- Denying the opponent opportunities (penalization).
- Immediate scoring and extra turns (core to winning).
- Flexibility and move options (not getting stuck).

---

## 1. Immediate Points

- **+10** for each point scored (i.e., each piece that lands in your base and scores).
- **Rationale:** Scoring is the primary way to win, so it is heavily weighted.

## 2. Extra Turn Bonus

- **+90** if the move grants an extra turn (the last piece lands in your base).
- **Rationale:** Extra turns are extremely valuable, often leading to chain moves and more scoring.

## 3. Strategic Value Bonuses

- **Board Presence:**
  - **+5** for each net increase in the number of pieces you control after the move (including those moved to your base).
  - _Example:_ If you control 10 pieces before and 12 after, you get +10.
- **Future Perfect Moves:**
  - **+20** for each new possible move (after your move) that would result in a perfect score (last piece lands in your base).
  - _Example:_ If you have 1 such move before and 3 after, you get +40.
- **Average Piece Value:**
  - **+2** for each 0.1 increase in the average value of pieces you control after the move (compared to before).
  - _Example:_ If your average piece value goes from 1.0 to 1.3, you get +6.
- **Flexibility:**
  - **+3** for each additional valid move you have after the move (compared to before).
  - _Example:_ If you have 4 valid moves before and 6 after, you get +6.

## 4. Penalization for Opponent Opportunities

- **-100** if your move grants the opponent a new extra turn opportunity.
  - Explanation: `WARNING: grants opponent an extra move`
- **-80** if your move grants the opponent a new scoring opportunity.
  - Explanation: `WARNING: grants opponent scoring opportunity`
- **Rationale:** Moves that set up the opponent for big gains are heavily penalized.

## 5. Look-Ahead Value

- The analyzer simulates up to 3 moves ahead (using a minimax-like approach).
- The value of the best future move is multiplied by a discount factor (**0.8**) and added to the current move's value.
- **Rationale:** This rewards moves that set up strong follow-ups, not just immediate gains.

## 6. Normalization

- After all calculations, the total value is normalized to a **-100 to 100** scale.
- **If not penalized:** The minimum value is **0** (no move can be worse than neutral unless penalized).
- **If penalized:** The maximum value is **0** (penalized moves cannot be positive, even if other factors would make them so).
- **Rationale:** This makes it easy to interpret move quality: positive is good, negative is bad, zero is neutral.

---

**Note:**

- All bonuses and penalties are applied before normalization.
- The analyzer does not use arbitrary minimums for specific move types; the above rules apply to all moves.
- This system is designed to be transparent and easily adjustable as the game evolves.
