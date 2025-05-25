// Analyzer utility functions for Mandragora Mania
// Implements the scoring rules described in docs/ANALYZER_SCORING_RULES.md
import {type GameArea, type MandragoraPiece} from '../types';
import {simulateMove} from './moveAnalyzer';
// import {getDistributionPattern} from './movementPaths';

/**
 * Calculates the total number of pieces controlled by the player (including those in base).
 * See: Board Presence Bonus in ANALYZER_SCORING_RULES.md
 */
export function calculateBoardPresenceBonus(
  areas: GameArea[],
  isPlayerTurn: boolean,
): number {
  const playerAreas = isPlayerTurn
    ? [0, 1, 3, 5, 2, 4] // Player's base, owned, and shared
    : [9, 6, 7, 8, 2, 4]; // Opponent's base, owned, and shared
  return areas
    .filter(a => playerAreas.includes(a.id))
    .reduce((sum, a) => sum + a.pieces.length, 0);
}

/**
 * Calculates the number of possible moves that would result in a perfect score (last piece lands in base).
 * For each area the player can move from, simulate the move and count if it ends in base.
 * See: Future Perfect Moves Bonus in ANALYZER_SCORING_RULES.md
 */
export function calculateFuturePerfectMovesBonus(
  areas: GameArea[],
  isPlayerTurn: boolean,
): number {
  const playerAreas = areas.filter(
    a =>
      a.pieces.length > 0 &&
      (isPlayerTurn
        ? a.allowedPlayer === 'player' || a.allowedPlayer === 'both'
        : a.allowedPlayer === 'opponent' || a.allowedPlayer === 'both'),
  );
  let count = 0;
  for (const area of playerAreas) {
    // Simulate moving all pieces from this area
    const {extraTurn} = simulateMove(area.id, areas, isPlayerTurn);
    if (extraTurn) count++;
  }
  return count;
}

/**
 * Calculates the average value of pieces controlled by the player (including those in base).
 * See: Average Piece Value Bonus in ANALYZER_SCORING_RULES.md
 */
export function calculateAveragePieceValueBonus(
  areas: GameArea[],
  isPlayerTurn: boolean,
): number {
  const playerAreas = isPlayerTurn ? [0, 1, 3, 5, 2, 4] : [9, 6, 7, 8, 2, 4];
  const pieces: MandragoraPiece[] = [];
  for (const area of areas) {
    if (playerAreas.includes(area.id)) {
      pieces.push(...area.pieces);
    }
  }
  if (pieces.length === 0) return 0;
  const total = pieces.reduce((sum, p) => sum + (p.value?.firstPlayer || 1), 0);
  return total / pieces.length;
}

/**
 * Calculates the number of valid moves the player has (flexibility).
 * See: Flexibility Bonus in ANALYZER_SCORING_RULES.md
 */
export function calculateFlexibilityBonus(
  areas: GameArea[],
  isPlayerTurn: boolean,
): number {
  return areas.filter(
    a =>
      a.pieces.length > 0 &&
      (isPlayerTurn
        ? a.allowedPlayer === 'player' || a.allowedPlayer === 'both'
        : a.allowedPlayer === 'opponent' || a.allowedPlayer === 'both'),
  ).length;
}

/**
 * Penalizes moves that grant the opponent a new extra turn or scoring opportunity.
 * Returns a deduction and a warning string if penalized.
 * See: Penalization for Opponent Opportunities in ANALYZER_SCORING_RULES.md
 *
 * @param areas - The board state before the move
 * @param isPlayerTurn - Whether it's the player's turn
 * @param newAreas - The board state after the move
 */
export function getOpponentThreatPenalty(
  areas: GameArea[],
  isPlayerTurn: boolean,
  newAreas: GameArea[],
): {deduction: number; warning: string} | null {
  // Only consider valid opponent moves (areas with pieces, allowedPlayer is 'opponent' or 'both')
  const getValidOpponentAreas = (areasToCheck: GameArea[]) =>
    areasToCheck.filter(
      a =>
        a.pieces.length > 0 &&
        (isPlayerTurn
          ? a.allowedPlayer === 'opponent' || a.allowedPlayer === 'both'
          : a.allowedPlayer === 'player' || a.allowedPlayer === 'both'),
    );

  // Find opponent scoring/extra turn opportunities BEFORE the move
  const opponentAreasBefore = getValidOpponentAreas(areas);
  let beforeExtraTurn = 0;
  let beforeScore = 0;
  for (const areaB of opponentAreasBefore) {
    if (areaB.allowedPlayer === 'opponent' || areaB.allowedPlayer === 'both') {
      const {scoringPieces, extraTurn} = simulateMove(areaB.id, areas, false);
      if (extraTurn) beforeExtraTurn++;
      if (scoringPieces.length > 0) beforeScore++;
    }
  }
  // Find opponent scoring/extra turn opportunities AFTER the move
  const opponentAreasAfter = getValidOpponentAreas(newAreas);
  let afterExtraTurn = 0;
  let afterScore = 0;
  for (const areaA of opponentAreasAfter) {
    if (areaA.allowedPlayer === 'opponent' || areaA.allowedPlayer === 'both') {
      const {scoringPieces, extraTurn} = simulateMove(
        areaA.id,
        newAreas,
        false,
      );
      if (extraTurn) afterExtraTurn++;
      if (scoringPieces.length > 0) afterScore++;
    }
  }
  // Only penalize if the number of opportunities increases
  if (afterExtraTurn > beforeExtraTurn) {
    return {deduction: -100, warning: 'WARNING: grants opponent an extra move'};
  } else if (afterScore > beforeScore) {
    return {
      deduction: -80,
      warning: 'WARNING: grants opponent scoring opportunity',
    };
  }
  return null;
}

/**
 * Normalizes the analyzer value to -100 to 100.
 * If not penalized, minimum is 0. If penalized, maximum is 0.
 * See: Normalization in ANALYZER_SCORING_RULES.md
 */
export function normalizeAnalyzerValue(
  rawValue: number,
  penalized: boolean,
): number {
  const norm = Math.max(-100, Math.min(100, rawValue));
  if (penalized) {
    // Penalized moves cannot be positive
    return Math.min(norm, 0);
  } else {
    // Non-penalized moves cannot be negative
    return Math.max(norm, 0);
  }
}
