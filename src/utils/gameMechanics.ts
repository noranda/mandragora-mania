import {type GameArea, type MandragoraPiece} from '../types';

/**
 * Checks if a move is valid according to the game rules.
 * A move is valid if:
 * - The area exists and has pieces
 * - The area is controlled by the current player
 *
 * @param areaId - The area to check
 * @param areas - Current state of all game areas
 * @param isPlayerTurn - Whether it's the player's turn
 * @returns true if the move is valid
 */
export function isValidMove(
  areaId: number,
  areas: GameArea[],
  isPlayerTurn: boolean,
): boolean {
  const area = areas.find(a => a.id === areaId);
  if (!area || area.pieces.length === 0) return false;

  if (isPlayerTurn) {
    return area.allowedPlayer === 'player' || area.allowedPlayer === 'both';
  } else {
    return area.allowedPlayer === 'opponent' || area.allowedPlayer === 'both';
  }
}

/**
 * Distributes pieces according to the movement rules, handling scoring and extra turns.
 * This is the core logic shared between makeMove and simulateMove.
 *
 * @param pieces - The pieces to distribute (in last-in-first-out order)
 * @param distributionPattern - The pattern of areas to distribute pieces to
 * @param areas - Current state of all game areas
 * @param isPlayerTurn - Whether it's the player's turn
 * @returns Object containing:
 *          - newAreas: Updated game areas after distribution
 *          - scoringPieces: Pieces that landed in bases
 *          - extraTurn: Whether the last piece landed in the player's own base
 */
export function distributePieces(
  pieces: MandragoraPiece[],
  distributionPattern: number[],
  areas: GameArea[],
  isPlayerTurn: boolean,
): {
  newAreas: GameArea[];
  scoringPieces: MandragoraPiece[];
  extraTurn: boolean;
} {
  // Create new areas array (shallow copy of areas, deep copy of pieces)
  const newAreas = areas.map(area => ({
    ...area,
    pieces: [...area.pieces],
  }));

  const scoringPieces: MandragoraPiece[] = [];
  let extraTurn = false;

  // Distribute pieces according to the pattern
  pieces.forEach((piece, index) => {
    const targetAreaId = distributionPattern[index];
    const isBase =
      (isPlayerTurn && targetAreaId === 0) ||
      (!isPlayerTurn && targetAreaId === 9);

    if (isBase) {
      scoringPieces.push(piece);
      if (index === pieces.length - 1) {
        extraTurn = true;
      }
    } else {
      const targetArea = newAreas.find(a => a.id === targetAreaId);
      if (targetArea) {
        targetArea.pieces.push(piece);
      }
    }
  });

  return {newAreas, scoringPieces, extraTurn};
}
