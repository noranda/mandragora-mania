import React from 'react';
import {motion} from 'framer-motion';

type TurnBannerProps = {
  isGameOver: boolean;
  isPlayerTurn: boolean;
  playerScoreValue: number;
  opponentScoreValue: number;
  onViewStats: () => void;
};

const TurnBanner: React.FC<TurnBannerProps> = ({
  isGameOver,
  isPlayerTurn,
  playerScoreValue,
  opponentScoreValue,
  onViewStats,
}) => (
  <motion.div
    initial={false}
    animate={{
      top: isGameOver ? -80 : isPlayerTurn ? 'auto' : 0,
      bottom: isGameOver ? 'auto' : isPlayerTurn ? 0 : 'auto',
    }}
    transition={{type: 'spring', stiffness: 300, damping: 30}}
    className={`absolute left-1/2 z-20 flex h-11 min-w-[260px] -translate-x-1/2 items-center justify-center rounded-sm px-10 py-2 text-center text-xl font-bold shadow-md backdrop-blur-sm ${
      isGameOver
        ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white'
        : isPlayerTurn
          ? 'bg-gradient-to-r from-blue-500/40 via-blue-400/40 to-blue-500/40 text-blue-100'
          : 'bg-gradient-to-r from-green-500/40 via-green-400/40 to-green-500/40 text-green-100'
    }`}
    style={{
      left: '50%',
      transform: 'translateX(-50%)',
      top: isGameOver ? 0 : isPlayerTurn ? 'auto' : 0,
      bottom: isGameOver ? 'auto' : isPlayerTurn ? 0 : 'auto',
    }}
  >
    {isGameOver ? (
      <>
        {playerScoreValue > opponentScoreValue
          ? 'Game Over. You win!'
          : playerScoreValue < opponentScoreValue
            ? 'Game Over. Opponent wins!'
            : "Game Over. It's a tie!"}
        <button
          className="ml-6 rounded bg-purple-700 px-4 py-1 text-base font-semibold text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-pink-300"
          style={{marginLeft: 24}}
          onClick={onViewStats}
        >
          View stats
        </button>
      </>
    ) : isPlayerTurn ? (
      '🎲 Your Turn'
    ) : (
      "⏳ Opponent's Turn"
    )}
  </motion.div>
);

export default TurnBanner;
