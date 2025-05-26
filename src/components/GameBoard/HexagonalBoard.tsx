import {makeMove} from '@/utils/gameLogic';
import {isValidMove} from '@/utils/gameMechanics';
import {getDistributionPattern} from '@/utils/movementPaths';
import {calculatePoints} from '@/utils/scoring';
import type {GameArea} from '../../types';
import {useGameOverCheck} from './hooks/useGameOverCheck';
import {useGameUIState} from './hooks/useGameUIState';
import {useMoveAnimation} from './hooks/useMoveAnimation';
import {useMoveRecord} from './hooks/useMoveRecord';
import HexagonArea from './HexagonArea';
import MovingPiecesLayer from './MovingPiecesLayer';
import TurnBanner from './TurnBanner';
import type {GameAction, GameState} from './useGameReducer';

// UI state type for refs and positions
export type HexagonalBoardUIState = {
  basePositions: {opponent: DOMRect | null; player: DOMRect | null};
  boardRef: React.RefObject<HTMLDivElement>;
  hexPositions: Record<number, DOMRect>;
};

type HexagonalBoardProps = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  uiState: HexagonalBoardUIState;
};

const HexagonalBoard: React.FC<HexagonalBoardProps> = ({state, dispatch, uiState}) => {
  const {setStatsOpen} = useGameUIState();
  const createMoveAnimations = useMoveAnimation();
  const isGameOverAfterMove = useGameOverCheck();
  const buildMoveRecord = useMoveRecord();

  // --- Scoring ---
  const playerScoreValue = calculatePoints(state.playerScore, true);
  const opponentScoreValue = calculatePoints(state.opponentScore, false);

  // Find the recommended move areaId (first in moveAnalysis, if any)
  const recommendedMoveAreaId = state.moveAnalysis.length > 0 ? state.moveAnalysis[0].areaId : null;

  // Move handleAreaClick logic here
  const handleAreaClick = async (areaId: number) => {
    // --- Validation ---
    if (state.isGameOver || !state.gameStarted) return;
    if (!isValidMove(areaId, state.areas, state.isPlayerTurn)) return;
    const sourceArea = state.areas.find((a: GameArea) => a.id === areaId);
    if (!sourceArea) return;

    // --- Animation ---
    const distributionPattern = getDistributionPattern(
      areaId,
      sourceArea.pieces.length,
      state.isPlayerTurn,
    );
    const animDelay = 0.25;
    const animations = createMoveAnimations(
      animDelay,
      areaId,
      distributionPattern,
      sourceArea.pieces,
    );
    dispatch({type: 'START_MOVE_ANIMATION', movingPieces: animations});
    const totalDuration = animations.length * animDelay + 0.1;
    await new Promise(resolve => setTimeout(resolve, totalDuration * 1000));

    // --- Game Logic ---
    const {newAreas, newPlayerScore, newOpponentScore, extraTurn} = makeMove(
      areaId,
      state.areas,
      state.playerScore,
      state.opponentScore,
      state.isPlayerTurn,
    );
    const moveRecord = buildMoveRecord({
      areaId,
      distributionPattern,
      pieces: sourceArea.pieces,
      isPlayerTurn: state.isPlayerTurn,
      extraTurn,
    });
    const nextTurn = !extraTurn ? !state.isPlayerTurn : state.isPlayerTurn;
    const gameIsOver = isGameOverAfterMove(newAreas, nextTurn);

    dispatch({
      type: 'MAKE_MOVE',
      areaId,
      newAreas,
      newPlayerScore,
      newOpponentScore,
      moveRecord,
      extraTurn,
      isGameOver: gameIsOver,
    });

    dispatch({type: 'END_MOVE_ANIMATION'});
  };

  // Calculate positions for a hexagonal layout
  const boardLayout = {
    topRow: [
      // Areas 8, 7, 6 (left to right)
      state.areas.find((a: GameArea) => a.id === 8),
      state.areas.find((a: GameArea) => a.id === 7),
      state.areas.find((a: GameArea) => a.id === 6),
    ].filter(Boolean) as GameArea[],
    middleRow: [
      // Areas 2, 4 (left to right)
      state.areas.find((a: GameArea) => a.id === 2),
      state.areas.find((a: GameArea) => a.id === 4),
    ].filter(Boolean) as GameArea[],
    bottomRow: [
      // Areas 1, 3, 5 (left to right)
      state.areas.find((a: GameArea) => a.id === 1),
      state.areas.find((a: GameArea) => a.id === 3),
      state.areas.find((a: GameArea) => a.id === 5),
    ].filter(Boolean) as GameArea[],
  };

  return (
    <div className="relative mx-auto w-full" ref={uiState.boardRef}>
      {/* Animated Turn Banner */}
      {state.gameStarted && (
        <TurnBanner
          isGameOver={state.isGameOver}
          isPlayerTurn={state.isPlayerTurn}
          playerScoreValue={playerScoreValue}
          opponentScoreValue={opponentScoreValue}
          onViewStats={() => setStatsOpen(true)}
        />
      )}

      <div className="relative flex h-full w-full flex-col items-center justify-center">
        {/* Top row (opponent) */}
        <div className="flex w-full justify-center gap-[14%]">
          {boardLayout.topRow.map(area => (
            <HexagonArea
              area={area}
              color="green"
              isValidMove={isValidMove(area.id, state.areas, state.isPlayerTurn)}
              key={area.id}
              onClick={() => handleAreaClick(area.id)}
              recommendedMoveAreaId={recommendedMoveAreaId}
            />
          ))}
        </div>

        {/* Middle row (shared) */}
        <div className="-mb-[9%] -mt-[9%] flex w-full justify-center gap-[14%]">
          {boardLayout.middleRow.map(area => (
            <HexagonArea
              area={area}
              color="brown"
              isValidMove={isValidMove(area.id, state.areas, state.isPlayerTurn)}
              key={area.id}
              onClick={() => handleAreaClick(area.id)}
              recommendedMoveAreaId={recommendedMoveAreaId}
            />
          ))}
        </div>

        {/* Bottom row (player) */}
        <div className="flex w-full justify-center gap-[14%]">
          {boardLayout.bottomRow.map(area => (
            <HexagonArea
              area={area}
              color="blue"
              isValidMove={isValidMove(area.id, state.areas, state.isPlayerTurn)}
              key={area.id}
              onClick={() => handleAreaClick(area.id)}
              recommendedMoveAreaId={recommendedMoveAreaId}
            />
          ))}
        </div>
      </div>

      {/* Animated pieces layer */}
      <MovingPiecesLayer
        movingPieces={state.movingPieces}
        basePositions={uiState.basePositions}
        hexPositions={uiState.hexPositions}
        parentRef={uiState.boardRef}
      />
    </div>
  );
};

export default HexagonalBoard;
