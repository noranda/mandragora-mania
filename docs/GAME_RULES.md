# Mandragora Mania - Game Rules

## Game Board Layout

### Areas

The game board consists of 10 areas total: 8 playing areas (numbered 1-8) and 2 base areas (0 and 9) which are used for scoring. The playable areas are arranged in 3 rows with the player base to the far right and the opponent base to the far left.

```
[9]--[8]  [7]  [6]----
|      \ /  \ /      |
|      [2]  [4]      |
|      / \  / \      |
----[1]  [3]  [5]--[0]
```

Area 0: Player's base to the right of the board
Area 1: 1st area in bottom row, Player owns
Area 2: 1st area in middle row, Both player and opponent own
Area 3: 2nd area in bottom row, Player owns
Area 4: 2nd area in middle row, Both player and opponent own
Area 5: 3rd area in bottom row, Player owns
Area 6: 3rd area in the top row, Opponent owns
Area 7: 2nd area in the top row, Opponent owns
Area 8: 1st area in the top row, Opponent owns
Area 9: Opponent's base to the left of the board.

The 8 playing areas are arranged in a counterclockwise circular pattern, with shared areas (2 and 4). When pieces are played, they follow these paths in a loop until all pieces are played:

Player's path: 1 - 2 - 3 - 4 - 5 - 0 - 6 - 4 - 7 - 2 - 8 - 1
Opponent's path: 6 - 4 - 7 - 2 - 8 - 9 - 1 - 2 - 3 - 4 - 5 - 6

## Turn Mechanics

### Area Selection

On a player's turn, they can only select areas they control:

- Player can select:
  - Their owned areas (1, 3, 5)
  - Shared areas (2, 4)
- Opponent can select:
  - Their owned areas (6, 7, 8)
  - Shared areas (2, 4)
- Base areas (0, 9) cannot be selected; they are only used for scoring
- Players cannot select areas controlled by their opponent

### Taking a Turn

1. Player selects one of their valid areas containing at least one piece
2. All pieces from that area are picked up
3. Pieces are distributed one at a time following the movement rules
4. Effects (scoring, extra turns) are determined by where the last piece lands

## Movement Rules

### Basic Movement

1. When an area is selected, ALL pieces from that area must be moved
2. Pieces are distributed one at a time, following the movement paths
3. Distribution continues until all pieces have been placed
4. Movement follows a counterclockwise pattern around the board, except for special cases with shared areas

### Regular Movement Paths

When moving from a non-shared area, pieces follow these paths:

- Player's Path (counterclockwise):
  - Starting from areas 1, 3, or 5: Follow 1 -> 2 -> 3 -> 4 -> 5 -> 0 (base)
  - If movement continues past base: 0 -> 6 -> 4 -> 7 -> 2 -> 8 -> 1 (loop continues)
- Opponent's Path (counterclockwise):
  - Starting from areas 6, 7, or 8: Follow 6 -> 4 -> 7 -> 2 -> 8 -> 9 (base)
  - If movement continues past base: 9 -> 1 -> 2 -> 3 -> 4 -> 5 -> 6 (loop continues)

### Shared Area Movement

When moving from shared areas (2 or 4), the direction depends on who controls the pieces:

- Player (moving RIGHT from Area 2):
  - Path: 2 -> 3 -> 4 -> 5 -> 0 (base)
  - If continuing: Follow regular player path
- Opponent (moving LEFT from Area 2):
  - Path: 2 -> 8 -> 9 (base)
  - If continuing: Follow regular opponent path
- Player (moving RIGHT from Area 4):
  - Path: 4 -> 5 -> 0 (base)
  - If continuing: Follow regular player path
- Opponent (moving LEFT from Area 4):
  - Path: 4 -> 7 -> 2 -> 8 -> 9 (base)
  - If continuing: Follow regular opponent path

### Movement Examples

1. First player selects Area 1 with 3 pieces:
   - First piece -> Area 2
   - Second piece -> Area 3
   - Last piece -> Area 4
2. Second player selects Area 6 with 4 pieces:
   - First piece -> Area 4
   - Second piece -> Area 7
   - Third piece -> Area 2
   - Last piece -> Area 8

## Game Start

Either player can be randomly selected to move first. This only determines turn order and does not affect which areas they control:

- Player always controls areas 1, 3, 5 and can use shared areas 2, 4
- Opponent always controls areas 6, 7, 8 and can use shared areas 2, 4
- Base areas (0 for Player, 9 for Opponent) are only used for scoring

## Scoring Rules

### Mandragora Types and Values

There are different types of Mandragoras, each worth different points:

1. Normal Mandragoras

   - Always worth 1 point regardless of turn order

2. Korrigans and Pachypodiums

   - Worth 2 points if collected by the player who moved first
   - Worth 3 points if collected by the player who moved second

3. Citrullus and Adenium
   - Worth 3 points if collected by the player who moved first
   - Worth 4 points if collected by the player who moved second

### Scoring Moves

Points are earned when:

- A piece lands in the player's own base area (Area 0 for Player, Area 9 for Opponent)
- The points earned depend on both the Mandragora type and whether the scoring player moved first or second in the game

### Extra Turns

A player receives an extra turn when:

- The last piece of their move lands exactly in their base (Area 0 for Player, Area 9 for Opponent)
- This can happen from any valid move that ends with the final piece in their base
- The move can start from any area they control (their owned areas or shared areas)

## Game End Conditions

- The game ends immediately if, at the start of their turn, a player has no valid moves they can make.
  - A valid move requires selecting an area they control (owned or shared) that contains at least one piece.
- The player with the highest score at the moment the game ends is the winner.
- If both players have the same score when the game ends, the game is a tie.
- There are no additional final scoring rules; the scores at the point the game ends are the final scores.

## Setup

### Starting Player

- As detailed in the "Game Start" section, either player is randomly selected to move first.

### Initial Piece Distribution

- Each of the 8 playable areas (Areas 1 through 8) begins the game with 3 Mandragora pieces.
- Base areas (Area 0 for Player, Area 9 for Opponent) start empty.
- This results in a total of 24 Mandragora pieces on the board at the start of the game.

### Mandragora Piece Types & Placement Patterns

- The 3 pieces in each area are a specific combination of the different Mandragora types: Normal Mandragoras (M), Korrigans (K), Pachypodiums (P), Citrullus (C), and Adenium (A).
- The game can be set up using one of the following patterns. The choice of pattern can be agreed upon by the players or selected randomly.

**Pattern A**

- 1:MMM, 2:KMK, 3:MAM, 4:MMM, 5:MMM, 6:MCM, 7:PMP, 8:MMM

**Pattern B**

- 1:MMM, 2:MCM, 3:MMM, 4:MAM, 5:PMP, 6:MMM, 7:MMM, 8:KMK

**Pattern C**

- 1:MMM, 2:MCM, 3:PMP, 4:MAM, 5:MMM, 6:MMM, 7:KMK, 8:MMM

**Pattern D**

- 1:MMM, 2:MCM, 3:PMP, 4:MAM, 5:MMM, 6:MMM, 7:KMK, 8:MMM

**Pattern E**

- 1:MMM, 2:MAM, 3:KMK, 4:MMM, 5:MMM, 6:PMP, 7:MCM, 8:MMM

_(Note: Piece types are abbreviated: M=Mandragora, K=Korrigan, P=Pachypodium, C=Citrillus, A=Adenium)_

---

_Note: This document is a living reference. Rules should be updated and clarified as the implementation progresses._
