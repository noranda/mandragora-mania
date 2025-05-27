import {type GameArea, type MandragoraPiece} from '../types';
import {
  calculateAveragePieceValueBonus,
  calculateBoardPresenceBonus,
  calculateFlexibilityBonus,
  calculateFuturePerfectMovesBonus,
  getOpponentThreatPenalty,
  normalizeAnalyzerValue,
} from './analyzerUtils.js';
import {distributePieces} from './gameMechanics';
import {getDistributionPattern} from './movementPaths';
import {calculatePoints} from './scoring';

/**
 * Represents the analysis of a potential move, including its strategic value,
 * immediate scoring potential, and explanation of why it might be a good choice.
 */
type MoveAnalysis = {
  areaId: number; // The area being moved from
  explanation: string; // Human-readable explanation of the move's value
  totalValue: number; // Combined value of immediate points and strategic value
};

// Maximum depth for look-ahead analysis
const MAX_DEPTH = 3;

// Discount factor for future moves (we care less about moves further in the future)
const DISCOUNT_FACTOR = 0.8;

/**
 * Simulates making a move and returns the new game state without modifying the actual game.
 * Exported for use in analyzerUtils.ts (shared simulation logic).
 * For each piece in the source area:
 * - Pieces are distributed one at a time in last-in-first-out order
 * - Pieces that land in a base (0 for player, 9 for opponent) are collected for scoring
 * - An extra turn is granted if the last piece lands in the player's own base
 *
 * @param areaId - The area pieces are being moved from
 * @param areas - Current state of all game areas
 * @param isPlayerTurn - Whether it's the player's turn
 * @returns Object containing:
 *          - newAreas: Updated game areas after the move
 *          - scoringPieces: Pieces that landed in bases and will score points
 *          - extraTurn: Whether the last piece landed in the player's own base
 */
export function simulateMove(
  areaId: number,
  areas: GameArea[],
  isPlayerTurn: boolean,
): {
  newAreas: GameArea[];
  scoringPieces: MandragoraPiece[];
  extraTurn: boolean;
} {
  const sourceArea = areas.find(a => a.id === areaId);
  if (!sourceArea) {
    throw new Error('Invalid area');
  }

  const pieces = [...sourceArea.pieces].reverse(); // Last in, first out
  const distributionPattern = getDistributionPattern(areaId, pieces.length, isPlayerTurn);

  // Use shared distribution logic
  return distributePieces(
    pieces,
    distributionPattern,
    areas.map(area => ({
      ...area,
      pieces: area.id === areaId ? [] : [...area.pieces],
    })),
    isPlayerTurn,
  );
}

/**
 * Recursively analyzes future moves up to a certain depth.
 * Uses minimax-like algorithm to evaluate positions.
 */
function analyzeMovesRecursive(
  areas: GameArea[],
  isPlayerTurn: boolean,
  depth = 0,
  alpha = -Infinity,
  beta = Infinity,
): {
  bestValue: number;
  bestMove?: number;
  warning?: string;
} {
  // Base case: reached maximum depth or no valid moves
  if (depth >= MAX_DEPTH) {
    return {bestValue: evaluateStrategicValue(areas, isPlayerTurn)};
  }

  const validAreas = areas.filter(
    area =>
      area.pieces.length > 0 &&
      (isPlayerTurn
        ? area.allowedPlayer === 'player' || area.allowedPlayer === 'both'
        : area.allowedPlayer === 'opponent' || area.allowedPlayer === 'both'),
  );

  if (validAreas.length === 0) {
    return {bestValue: evaluateStrategicValue(areas, isPlayerTurn)};
  }

  let bestValue = isPlayerTurn ? -Infinity : Infinity;
  let bestMove: number | undefined;

  // Track if all moves are penalized and the warning to propagate
  let allPenalized = true;
  let penalizationWarning: string | undefined = undefined;

  for (const area of validAreas) {
    // Simulate this move
    const {newAreas, scoringPieces, extraTurn} = simulateMove(area.id, areas, isPlayerTurn);

    // Calculate immediate value from this move
    const immediatePoints = calculatePoints(scoringPieces, isPlayerTurn);
    const positionValue = evaluateStrategicValue(newAreas, isPlayerTurn);

    // Add significant bonus for extra turn
    const extraTurnBonus = extraTurn ? 30 : 0;

    // Recursively analyze the next move
    const {bestValue: futureValue, warning: futureWarning} = analyzeMovesRecursive(
      newAreas,
      !isPlayerTurn,
      depth + 1,
      alpha,
      beta,
    );

    // Combine values
    let moveValue =
      immediatePoints * 10 + positionValue + extraTurnBonus + DISCOUNT_FACTOR * futureValue;

    // Use correct arguments and deduction logic (areas, isPlayerTurn, newAreas)
    const penalization = getOpponentThreatPenalty(areas, isPlayerTurn, newAreas);
    let warning: string | undefined = undefined;
    let isPenalized = false;
    if (penalization) {
      moveValue = 0;
      warning = penalization.warning;
      isPenalized = true;
    } else if (futureWarning) {
      moveValue = 0;
      warning = futureWarning;
      isPenalized = true;
    }
    // Clamp penalized moves to max 0
    moveValue = normalizeAnalyzerValue(moveValue, isPenalized);

    // Track penalization for all moves
    if (!isPenalized) {
      allPenalized = false;
    } else if (!penalizationWarning && warning) {
      penalizationWarning = warning;
    }

    if (isPlayerTurn) {
      if (moveValue > bestValue) {
        bestValue = moveValue;
        bestMove = area.id;
        alpha = Math.max(alpha, bestValue);
        if (beta <= alpha) break;
      }
    } else {
      if (moveValue < bestValue) {
        bestValue = moveValue;
        bestMove = area.id;
        beta = Math.min(beta, bestValue);
        if (beta <= alpha) break;
      }
    }
  }

  // Only propagate warning if all moves are penalized
  if (allPenalized && penalizationWarning) {
    return {bestValue, bestMove, warning: penalizationWarning};
  } else {
    return {bestValue, bestMove};
  }
}

/**
 * Evaluates the overall strategic value of a board position.
 * This is different from evaluateStrategicValue as it looks at the entire board,
 * not just a single move.
 */
function evaluateStrategicValue(areas: GameArea[], isPlayerTurn: boolean): number {
  let value = 0;
  const totalPieces = areas.reduce((sum, a) => sum + a.pieces.length, 0);
  const isEarlyGame = totalPieces > 15;

  // Key areas for each player (lowered)
  const playerKeyAreas = isPlayerTurn ? [3, 4, 5] : [7, 2, 8];
  const playerStartingAreas = isPlayerTurn ? [1, 3, 5] : [6, 7, 8];

  for (const areaId of playerKeyAreas) {
    const area = areas.find(a => a.id === areaId);
    if (area && area.pieces.length > 0) {
      value += area.pieces.length * 10;
      const highValuePieces = area.pieces.filter(p =>
        ['Adenium', 'Citrillus', 'Korrigan', 'Pachypodium'].includes(p.type),
      );
      value += highValuePieces.length * 7;
    }
  }

  // Early game development bonus (lowered)
  if (isEarlyGame) {
    for (const areaId of playerStartingAreas) {
      const area = areas.find(a => a.id === areaId);
      if (area && area.pieces.length > 0) {
        value += area.pieces.length * 5;
      }
    }
  }

  // Special bonus for area 3 (lowered)
  const area3 = areas.find(a => a.id === 3);
  if (area3 && area3.pieces.length > 0 && isPlayerTurn) {
    value += area3.pieces.length * 10;
  }

  // Value high-value pieces more (lowered)
  for (const area of areas) {
    for (const piece of area.pieces) {
      if (piece.type === 'Adenium') {
        value += 4;
      } else if (piece.type === 'Citrillus') {
        value += 3;
      } else if (piece.type === 'Korrigan' || piece.type === 'Pachypodium') {
        value += 2;
      }
    }
  }

  // Normalize value to be between -100 and 100 (divide by 8)
  return Math.max(-100, Math.min(100, value / 8));
}

/**
 * Analyzes all possible moves from the current board state and ranks them by value.
 * Now includes look-ahead analysis of future moves.
 */
export function analyzeMoves(areas: GameArea[], isPlayerTurn: boolean): MoveAnalysis[] {
  const validAreas = areas.filter(
    area =>
      area.pieces.length > 0 &&
      (isPlayerTurn
        ? area.allowedPlayer === 'player' || area.allowedPlayer === 'both'
        : area.allowedPlayer === 'opponent' || area.allowedPlayer === 'both'),
  );

  if (validAreas.length === 0) {
    return [];
  }

  // Precompute board state before the move for strategic bonuses
  const beforeBoardPresence = calculateBoardPresenceBonus(areas, isPlayerTurn);
  const beforePerfectMoves = calculateFuturePerfectMovesBonus(areas, isPlayerTurn);
  const beforeAvgPieceValue = calculateAveragePieceValueBonus(areas, isPlayerTurn);
  const beforeFlexibility = calculateFlexibilityBonus(areas, isPlayerTurn);

  const movesWithRawValues = validAreas.map(area => {
    // Simulate this move
    const {scoringPieces, extraTurn, newAreas} = simulateMove(area.id, areas, isPlayerTurn);
    const immediatePoints = calculatePoints(scoringPieces, isPlayerTurn);

    // Strategic bonuses: compare before and after
    const afterBoardPresence = calculateBoardPresenceBonus(newAreas, isPlayerTurn);
    const afterPerfectMoves = calculateFuturePerfectMovesBonus(newAreas, isPlayerTurn);
    const afterAvgPieceValue = calculateAveragePieceValueBonus(newAreas, isPlayerTurn);
    const afterFlexibility = calculateFlexibilityBonus(newAreas, isPlayerTurn);

    // Calculate strategic value bonuses
    const boardPresenceBonus = afterBoardPresence - beforeBoardPresence;
    const perfectMovesBonus = afterPerfectMoves - beforePerfectMoves;
    const avgPieceValueBonus = afterAvgPieceValue - beforeAvgPieceValue;
    const flexibilityBonus = afterFlexibility - beforeFlexibility;

    // Immediate points and extra turn bonus
    let rawValue = 0;
    rawValue += immediatePoints * 10;
    if (extraTurn) rawValue += 90;
    rawValue += boardPresenceBonus * 5;
    rawValue += perfectMovesBonus * 20;
    rawValue += avgPieceValueBonus * 20; // +2 per 0.1 increase
    rawValue += flexibilityBonus * 3;

    // Look-ahead analysis (recursive, up to 3 moves ahead)
    const {bestValue: futureValue, warning: futureWarning} = analyzeMovesRecursive(
      newAreas,
      !isPlayerTurn,
    );

    // Penalization for opponent opportunities
    const penalization = getOpponentThreatPenalty(areas, isPlayerTurn, newAreas);
    let warning: string | undefined = undefined;
    let isPenalized = false;
    if (penalization) {
      rawValue += penalization.deduction;
      warning = penalization.warning;
      isPenalized = true;
    }
    if (futureWarning) {
      warning = futureWarning;
      isPenalized = true;
    }
    // Normalize at the end
    const normalizedValue = normalizeAnalyzerValue(rawValue, isPenalized);
    // Build explanation (always show all values)
    let explanation = `Area ${area.id}: `;
    const reasons: string[] = [];
    reasons.push(`gains ${immediatePoints} point${immediatePoints === 1 ? '' : 's'}`);
    reasons.push(extraTurn ? '★ EXTRA TURN - last piece lands in base' : '');
    reasons.push(`controls ${boardPresenceBonus} more pieces`);
    reasons.push(`sets up ${perfectMovesBonus} new perfect moves`);
    reasons.push(`increases avg piece value by ${avgPieceValueBonus.toFixed(2)}`);
    reasons.push(`adds ${flexibilityBonus} new valid moves`);
    reasons.push(`future position value: ${futureValue.toFixed(1)}`);
    explanation += reasons.filter(Boolean).join(', ');
    if (isPenalized && warning) {
      explanation += ` | ${warning}`;
    }
    return {
      areaId: area.id,
      explanation,
      totalValue: normalizedValue,
    };
  });

  return movesWithRawValues;
}
