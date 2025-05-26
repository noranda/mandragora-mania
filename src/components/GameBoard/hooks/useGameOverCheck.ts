import type {GameArea} from '@/types';

/**
 * useGameOverCheck
 *
 * Returns a function to check if the game is over after a move.
 *
 * The returned function takes:
 *   - newAreas: GameArea[] (the board state after a move)
 *   - nextTurn: boolean (true if it's the player's turn next, false for opponent)
 *
 * Returns true if the game is over (no valid moves for the next player), false otherwise.
 *
 * Usage:
 *   const isGameOverAfterMove = useGameOverCheck();
 *   const gameIsOver = isGameOverAfterMove(newAreas, nextTurn);
 */
export function useGameOverCheck() {
  function isGameOverAfterMove(newAreas: GameArea[], nextTurn: boolean) {
    // Helper to check if any area has valid moves for the given player
    const hasValidMoves = (areasToCheck: GameArea[], isPlayer: boolean) =>
      areasToCheck.some(area => {
        const isPlayerArea = area.allowedPlayer === 'player' || area.allowedPlayer === 'both';
        const isOpponentArea = area.allowedPlayer === 'opponent' || area.allowedPlayer === 'both';
        return (
          area.pieces.length > 0 && ((isPlayer && isPlayerArea) || (!isPlayer && isOpponentArea))
        );
      });
    // Game is over if there are no valid moves for the next player
    return !hasValidMoves(newAreas, nextTurn);
  }

  return isGameOverAfterMove;
}
