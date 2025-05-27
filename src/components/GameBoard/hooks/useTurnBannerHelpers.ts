import {cn} from '@/lib/utils';

/**
 * useGameOverMessage
 * Returns a function to get the game over message based on player and opponent scores.
 */
export function useGameOverMessage() {
  return (playerScore: number, opponentScore: number) => {
    if (playerScore > opponentScore)
      return `Game Complete! You win! (${playerScore} - ${opponentScore})`;
    if (playerScore < opponentScore)
      return `Game Complete! Opponent wins. (${opponentScore} - ${playerScore})`;
    return `Game Complete! Draw! (${playerScore} - ${opponentScore})`;
  };
}

/**
 * useBannerPosition
 * Returns a function to get the banner's top/bottom position based on game state.
 */
export function useBannerPosition() {
  return (isGameOver: boolean, isPlayerTurn: boolean) => ({
    top: isGameOver ? 0 : isPlayerTurn ? 'auto' : 0,
    bottom: isGameOver ? 'auto' : isPlayerTurn ? 0 : 'auto',
  });
}

/**
 * useBannerClass
 * Returns a function to get the banner's className based on game state.
 */
export function useBannerClass() {
  return (isGameOver: boolean, isPlayerTurn: boolean) =>
    cn(
      'absolute left-1/2 z-20 flex h-11 min-w-[260px] -translate-x-1/2 items-center justify-center rounded-sm py-2 px-4 text-center text-xl font-bold shadow-md backdrop-blur-sm',
      isGameOver
        ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white'
        : isPlayerTurn
          ? 'bg-gradient-to-r from-blue-500/40 via-blue-400/40 to-blue-500/40 text-blue-100'
          : 'bg-gradient-to-r from-green-500/40 via-green-400/40 to-green-500/40 text-green-100',
    );
}
