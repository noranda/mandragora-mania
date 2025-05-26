import {type MandragoraPiece} from '../types';

/**
 * Calculates points for a collection of pieces based on piece type and player order.
 * Points are awarded as follows:
 * - Normal Mandragoras: Always 1 point
 * - Korrigans/Pachypodiums: 2 points (first player) / 3 points (second player)
 * - Citrullus/Adenium: 3 points (first player) / 4 points (second player)
 *
 * @param pieces - Array of pieces to calculate points for
 * @param isFirstPlayer - Whether the scoring player moved first in the game
 * @returns Total points that would be scored
 */
export function calculatePoints(pieces: MandragoraPiece[], isFirstPlayer: boolean): number {
  return pieces.reduce((sum, piece) => {
    // Handle undefined/null pieces
    if (!piece) return sum;

    // Handle malformed pieces without type
    if (!piece.type) return sum;

    if (piece.type === 'Mandragora') {
      return sum + 1;
    } else if (piece.type === 'Korrigan' || piece.type === 'Pachypodium') {
      return sum + (isFirstPlayer ? 2 : 3);
    } else if (piece.type === 'Citrillus' || piece.type === 'Adenium') {
      return sum + (isFirstPlayer ? 3 : 4);
    }
    return sum;
  }, 0);
}
