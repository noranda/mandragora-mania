import {type GameArea, type MandragoraPiece} from '../types';
import {distributePieces, isValidMove} from './gameMechanics';
import {getDistributionPattern} from './movementPaths';

/**
 * Executes a move in the game, updating the game state.
 * This function:
 * 1. Validates the move is legal
 * 2. Picks up all pieces from the source area
 * 3. Distributes them according to movement rules
 * 4. Updates player scores if pieces land in bases
 * 5. Determines if an extra turn is earned
 *
 * The function maintains immutability by creating new arrays for all state updates.
 *
 * @param areaId - The area pieces are being moved from
 * @param areas - Current state of all game areas
 * @param playerScore - Current player's scored pieces
 * @param opponentScore - Current opponent's scored pieces
 * @param isPlayerTurn - Whether it's the player's turn (true) or opponent's turn (false)
 * @returns Object containing:
 * - newAreas: Updated state of all areas after the move
 * - newPlayerScore: Updated player score including any newly scored pieces
 * - newOpponentScore: Updated opponent score including any newly scored pieces
 * - extraTurn: Whether the last piece landed in the player's own base (grants extra turn)
 * @throws Error if the move is invalid (wrong player's area or no pieces)
 */
export const makeMove = (
  areaId: number,
  areas: GameArea[],
  playerScore: MandragoraPiece[],
  opponentScore: MandragoraPiece[],
  isPlayerTurn: boolean,
): {
  newAreas: GameArea[];
  newPlayerScore: MandragoraPiece[];
  newOpponentScore: MandragoraPiece[];
  extraTurn: boolean;
} => {
  const sourceArea = areas.find(a => a.id === areaId);
  if (!sourceArea || !isValidMove(areaId, areas, isPlayerTurn)) {
    throw new Error('Invalid move');
  }

  // Get all pieces from source area in last-in-first-out order
  const pieces = [...sourceArea.pieces].reverse();

  // Get the distribution pattern for the pieces
  const distributionPattern = getDistributionPattern(areaId, pieces.length, isPlayerTurn);

  // Distribute pieces and get results
  const {newAreas, scoringPieces, extraTurn} = distributePieces(
    pieces,
    distributionPattern,
    areas.map(area => ({
      ...area,
      pieces: area.id === areaId ? [] : [...area.pieces],
    })),
    isPlayerTurn,
  );

  // Update scores based on which player scored
  const newPlayerScore = [...playerScore];
  const newOpponentScore = [...opponentScore];

  if (isPlayerTurn) {
    newPlayerScore.push(...scoringPieces);
  } else {
    newOpponentScore.push(...scoringPieces);
  }

  return {
    newAreas,
    newPlayerScore,
    newOpponentScore,
    extraTurn,
  };
};

/**
 * Gets a valid move from the available areas.
 * Currently implements a simple strategy of picking the first valid area.
 * This could be enhanced to use more sophisticated selection criteria.
 *
 * @param areas - Current state of all game areas
 * @param isPlayerTurn - Whether it's the player's turn
 * @returns The area ID of a valid move, or null if no moves are available
 */
export const getBestMove = (areas: GameArea[], isPlayerTurn: boolean): number | null => {
  const validAreas = areas.filter(
    area => isValidMove(area.id, areas, isPlayerTurn) && area.pieces.length > 0,
  );

  return validAreas.length > 0 ? validAreas[0].id : null;
};
