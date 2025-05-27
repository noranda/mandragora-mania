import {DISCOUNT_FACTOR, MAX_DEPTH} from '@/constants/gameSettings';
import {type GameArea, type MandragoraPiece} from '../types';
import {distributePieces} from './gameMechanics';
import {getDistributionPattern} from './movementPaths';
import {calculatePoints} from './scoring';

// --- State modeling ---
// We'll use a flat array/object for board state, but keep compatibility with GameArea[] for now.

export type MoveAnalysis = {
  areaId: number;
  explanation: string;
  totalValue: number;
};

// --- Pure move simulation ---
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

// --- Minimax with alpha-beta pruning ---
function minimax(
  areas: GameArea[],
  isPlayerTurn: boolean,
  depth: number,
  alpha: number,
  beta: number,
): number {
  if (depth === 0 || isTerminal(areas)) {
    return evaluate(areas, isPlayerTurn);
  }
  const validAreas = areas.filter(
    area =>
      area.pieces.length > 0 &&
      (isPlayerTurn
        ? area.allowedPlayer === 'player' || area.allowedPlayer === 'both'
        : area.allowedPlayer === 'opponent' || area.allowedPlayer === 'both'),
  );
  if (validAreas.length === 0) {
    return evaluate(areas, isPlayerTurn);
  }
  if (isPlayerTurn) {
    let value = -Infinity;
    for (const area of validAreas) {
      const {newAreas, scoringPieces, extraTurn} = simulateMove(area.id, areas, isPlayerTurn);
      const immediate = calculatePoints(scoringPieces, isPlayerTurn) * 10;
      let childValue;
      if (extraTurn) {
        childValue = minimax(newAreas, isPlayerTurn, depth - 1, alpha, beta);
      } else {
        childValue = minimax(newAreas, !isPlayerTurn, depth - 1, alpha, beta);
      }
      value = Math.max(value, immediate + DISCOUNT_FACTOR * childValue);
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return value;
  } else {
    let value = Infinity;
    for (const area of validAreas) {
      const {newAreas, scoringPieces, extraTurn} = simulateMove(area.id, areas, isPlayerTurn);
      const immediate = -calculatePoints(scoringPieces, !isPlayerTurn) * 10;
      let childValue;
      if (extraTurn) {
        childValue = minimax(newAreas, isPlayerTurn, depth - 1, alpha, beta);
      } else {
        childValue = minimax(newAreas, !isPlayerTurn, depth - 1, alpha, beta);
      }
      value = Math.min(value, immediate + DISCOUNT_FACTOR * childValue);
      beta = Math.min(beta, value);
      if (alpha >= beta) break;
    }
    return value;
  }
}

// --- Terminal state check ---
function isTerminal(areas: GameArea[]): boolean {
  // End if no valid moves for either player
  return (
    !areas.some(
      a => a.pieces.length > 0 && (a.allowedPlayer === 'player' || a.allowedPlayer === 'both'),
    ) &&
    !areas.some(
      a => a.pieces.length > 0 && (a.allowedPlayer === 'opponent' || a.allowedPlayer === 'both'),
    )
  );
}

// --- Evaluation function ---
function evaluate(areas: GameArea[], isPlayerTurn: boolean): number {
  // Phase-aware: early game = mobility, late game = score diff
  const totalPieces = areas.reduce((sum, a) => sum + a.pieces.length, 0);
  const playerScore = areas.find(a => a.id === 0)?.pieces.length || 0;
  const opponentScore = areas.find(a => a.id === 9)?.pieces.length || 0;
  if (totalPieces > 15) {
    // Early game: prioritize mobility and extra turn potential
    const mobility = areas.filter(
      a =>
        a.pieces.length > 0 &&
        (isPlayerTurn
          ? a.allowedPlayer === 'player' || a.allowedPlayer === 'both'
          : a.allowedPlayer === 'opponent' || a.allowedPlayer === 'both'),
    ).length;
    return (playerScore - opponentScore) * 5 + mobility * 3;
  } else {
    // Late game: prioritize score difference
    return (playerScore - opponentScore) * 15;
  }
}

// --- Main analyzer function ---
export function analyzeMoves(areas: GameArea[], isPlayerTurn: boolean): MoveAnalysis[] {
  const validAreas = areas.filter(
    area =>
      area.pieces.length > 0 &&
      (isPlayerTurn
        ? area.allowedPlayer === 'player' || area.allowedPlayer === 'both'
        : area.allowedPlayer === 'opponent' || area.allowedPlayer === 'both'),
  );
  if (validAreas.length === 0) return [];
  return validAreas.map(area => {
    const {newAreas, scoringPieces, extraTurn} = simulateMove(area.id, areas, isPlayerTurn);
    const immediatePoints = calculatePoints(scoringPieces, isPlayerTurn);
    const futureValue = minimax(
      newAreas,
      extraTurn ? isPlayerTurn : !isPlayerTurn,
      MAX_DEPTH - 1,
      -Infinity,
      Infinity,
    );
    const totalValue = immediatePoints * 10 + DISCOUNT_FACTOR * futureValue;
    let explanation = `Area ${area.id}: gains ${immediatePoints} point${immediatePoints === 1 ? '' : 's'}`;
    if (extraTurn) explanation += ', ★ EXTRA TURN';
    explanation += `, future value: ${futureValue.toFixed(1)}`;
    return {
      areaId: area.id,
      explanation,
      totalValue,
    };
  });
}
