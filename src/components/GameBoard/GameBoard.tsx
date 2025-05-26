import {useEffect, useLayoutEffect} from 'react';

import {analyzeMoves} from '@/utils/moveAnalyzer';
import {calculatePoints} from '@/utils/scoring';
import {boardPatterns} from '../../config/boardPatterns';
import {useGameReducer} from './hooks/useGameReducer';
import {useGameUIState} from './hooks/useGameUIState';
import BaseLegend from './BaseLegend';
import BasePanel from './BasePanel';
import GameControls from './GameControls';
import GameOverBanner from './GameOverBanner';
import GameStatsModal from './GameStatsModal';
import HexagonalBoard from './HexagonalBoard';
import MoveAnalysis from './MoveAnalysis';

// Main GameBoard component
const GameBoard: React.FC = () => {
  const [state, dispatch] = useGameReducer();

  // --- UI state (custom hook) ---
  const {boardRef, hexPositions, setHexPositions, setStatsOpen, statsOpen} = useGameUIState();

  // --- Scoring and move analysis ---
  const playerScoreValue = calculatePoints(state.playerScore, true);
  const opponentScoreValue = calculatePoints(state.opponentScore, false);

  // --- Effects ---
  // Analyze possible moves whenever the board or turn changes
  useEffect(() => {
    if (state.gameStarted && !state.isGameOver && state.isPlayerTurn) {
      const analysis = analyzeMoves(state.areas, state.isPlayerTurn);
      dispatch({type: 'ANALYZE_MOVES', analysis});
    } else {
      dispatch({type: 'ANALYZE_MOVES', analysis: []});
    }
  }, [state.areas, state.isPlayerTurn, state.gameStarted, state.isGameOver, dispatch]);

  // Update hex positions for animation after each game state change
  useLayoutEffect(() => {
    if (boardRef.current) {
      const newPositions: Record<number, DOMRect> = {};
      const hexElements = boardRef.current.querySelectorAll('[data-hex-id]');
      hexElements.forEach(hex => {
        const id = parseInt(hex.getAttribute('data-hex-id') || '0');
        newPositions[id] = hex.getBoundingClientRect();
      });
      setHexPositions(prev => {
        const prevKeys = Object.keys(prev);
        const newKeys = Object.keys(newPositions);
        if (
          prevKeys.length === newKeys.length &&
          prevKeys.every(
            key =>
              newPositions[key as any] &&
              prev[key as any].left === newPositions[key as any].left &&
              prev[key as any].top === newPositions[key as any].top &&
              prev[key as any].width === newPositions[key as any].width &&
              prev[key as any].height === newPositions[key as any].height,
          )
        ) {
          return prev; // No change, don't trigger re-render
        }
        return newPositions;
      });
    }
  }, [state.gameStateHistory, boardRef, setHexPositions]);

  return (
    <div className="flex w-full max-w-[1600px] flex-1 flex-col gap-8 rounded-xl border border-slate-700 bg-slate-800 p-8 shadow-2xl">
      {/* Game controls: undo, redo, pattern selection, start/reset */}
      <GameControls state={state} dispatch={dispatch} patternOptions={boardPatterns} />

      <div className="flex w-full justify-between">
        {/* Opponent base (left) */}
        <div className="flex h-full flex-col items-center gap-2">
          <BasePanel pieces={state.opponentScore} score={opponentScoreValue} title="Opponent" />
          <BaseLegend
            gameStarted={state.gameStarted}
            isPlayer={false}
            playerGoesFirst={state.playerGoesFirst}
          />
        </div>

        {/* Main hexagonal board */}
        <HexagonalBoard
          state={state}
          dispatch={dispatch}
          uiState={{
            boardRef,
            hexPositions,
          }}
          onViewStats={() => setStatsOpen(true)}
        />

        {/* Player base (right) */}
        <div className="flex h-full flex-col items-center gap-2">
          <BasePanel pieces={state.playerScore} score={playerScoreValue} title="You" />
          <BaseLegend
            isPlayer={true}
            playerGoesFirst={state.playerGoesFirst}
            gameStarted={state.gameStarted}
          />
        </div>
      </div>

      {/* Move analysis table (shows best moves) */}
      <MoveAnalysis state={state} />

      {/* Game over banner (shows winner/loser) */}
      {state.isGameOver && (
        <GameOverBanner
          playerScoreValue={playerScoreValue}
          opponentScoreValue={opponentScoreValue}
        />
      )}

      {/* Stats Modal (shows move history and scores) */}
      <GameStatsModal state={state} statsOpen={statsOpen} setStatsOpen={setStatsOpen} />
    </div>
  );
};

export default GameBoard;
