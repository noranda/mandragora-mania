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
        <div className="flex items-center gap-4">
          {getGameOverMessage(playerScoreValue, opponentScoreValue)}
          <Button onClick={onViewStats}>View stats</Button>
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
