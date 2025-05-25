/**
 * Defines the movement paths and distribution pattern calculation for the game.
 * Movement follows these rules:
 * - Counterclockwise movement is default
 * - Movement continues along the path until all pieces are placed
 */

// Complete movement paths
export const PLAYER_PATH = [1, 2, 3, 4, 5, 0, 6, 4, 7, 2, 8]; // 0 is player's base
export const OPPONENT_PATH = [6, 4, 7, 2, 8, 9, 1, 2, 3, 4, 5]; // 9 is opponent's base

/**
 * Calculates the sequence of areas where pieces will land when moved from a given area.
 * Movement paths:
 * Player path: 1 -> 2 -> 3 -> 4 -> 5 -> 0 -> 6 -> 4 -> 7 -> 2 -> 8 -> 1
 * Opponent path: 6 -> 4 -> 7 -> 2 -> 8 -> 9 -> 1 -> 2 -> 3 -> 4 -> 5 -> 6
 *
 * @param areaId - The area pieces are being moved from
 * @param numPieces - Number of pieces being moved
 * @param isPlayerTurn - Whether it's the player's turn
 * @returns Array of area IDs where pieces will land, in order
 */
export function getDistributionPattern(
  areaId: number,
  numPieces: number,
  isPlayerTurn: boolean,
): number[] {
  if (numPieces === 0) return [];

  const pattern: number[] = [];
  const path = isPlayerTurn ? PLAYER_PATH : OPPONENT_PATH;

  // Find the first occurrence of the area in the path
  let currentIndex = path.indexOf(areaId);

  // For each piece, follow the path
  for (let i = 0; i < numPieces; i++) {
    // Move to the next position and wrap around if needed
    currentIndex = (currentIndex + 1) % path.length;
    pattern.push(path[currentIndex]);
  }

  return pattern;
}
