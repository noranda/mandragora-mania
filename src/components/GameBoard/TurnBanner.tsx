import {motion} from 'framer-motion';

import {Button} from '@/components/ui/button';
import {useBannerClass, useBannerPosition, useGameOverMessage} from './hooks/useTurnBannerHelpers';

type TurnBannerProps = {
  isGameOver: boolean;
  isPlayerTurn: boolean;
  onViewStats: () => void;
  opponentScoreValue: number;
  playerScoreValue: number;
};

const TurnBanner: React.FC<TurnBannerProps> = ({
  isGameOver,
  isPlayerTurn,
  onViewStats,
  opponentScoreValue,
  playerScoreValue,
}) => {
  const getGameOverMessage = useGameOverMessage();
  const getBannerPosition = useBannerPosition();
  const getBannerClass = useBannerClass();

  return (
    <motion.div
      animate={getBannerPosition(isGameOver, isPlayerTurn)}
      className={getBannerClass(isGameOver, isPlayerTurn)}
      initial={false}
      transition={{damping: 30, stiffness: 300, type: 'spring'}}
    >
      {isGameOver ? (
        <div className="flex w-full items-center justify-between">
          <span className="flex-1 text-left">
            {getGameOverMessage(playerScoreValue, opponentScoreValue)}
          </span>
          <Button
            className="-mr-3 ml-6 w-14 rounded bg-slate-800 px-4 py-1 text-base font-semibold text-white hover:bg-slate-700"
            onClick={onViewStats}
          >
            Stats
          </Button>
        </div>
      ) : isPlayerTurn ? (
        '🎲 Your Turn'
      ) : (
        "⏳ Opponent's Turn"
      )}
    </motion.div>
  );
};

export default TurnBanner;
