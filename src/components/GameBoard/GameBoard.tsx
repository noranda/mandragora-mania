import {useEffect, useLayoutEffect} from 'react';

import {makeMove} from '@/utils/gameLogic';
import {isValidMove} from '@/utils/gameMechanics';
import {analyzeMoves} from '@/utils/moveAnalyzer';
import {getDistributionPattern} from '@/utils/movementPaths';
import {calculatePoints} from '@/utils/scoring';
import {boardPatterns} from '../../config/boardPatterns';
import {type GameArea} from '../../types';
import BaseLegend from './BaseLegend';
import BasePanel from './BasePanel';
import GameControls from './GameControls';
import GameOverBanner from './GameOverBanner';
import GameStatsModal from './GameStatsModal';
import HexagonalBoard, {renderMovingPieces} from './HexagonalBoard';
import MoveAnalysis from './MoveAnalysis';
import TurnBanner from './TurnBanner';
import {useGameReducer} from './useGameReducer';
import {useGameUIState} from './useGameUIState';

// Main GameBoard component
const GameBoard: React.FC = () => {
  // --- Game logic state (reducer) ---
  const [state, dispatch] = useGameReducer();

  // --- UI state (custom hook) ---
  const {
    basePositions,
    boardAreaContainerRef,
    boardRef,
    hexPositions,
    opponentBaseAnchorRef,
    opponentBasePanelRef,
    playerBaseAnchorRef,
    playerBasePanelRef,
    setBasePositions,
    setHexPositions,
    setStatsOpen,
    statsOpen,
  } = useGameUIState();

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

  // Update base panel positions on mount and window resize
  useEffect(() => {
    const updateBasePositions = () => {
      setBasePositions({
        opponent: opponentBasePanelRef.current?.getBoundingClientRect() || null,
        player: playerBasePanelRef.current?.getBoundingClientRect() || null,
      });
    };
    updateBasePositions();
    window.addEventListener('resize', updateBasePositions);
    return () => window.removeEventListener('resize', updateBasePositions);
  }, [setBasePositions, opponentBasePanelRef, playerBasePanelRef]);

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

  // --- Handle user clicking a board area (hex) ---
  const handleAreaClick = async (areaId: number) => {
    if (state.isGameOver || !state.gameStarted) return;
    if (!isValidMove(areaId, state.areas, state.isPlayerTurn)) return;
    const sourceArea = state.areas.find(a => a.id === areaId);
    if (!sourceArea) return;
    // Calculate piece movements based on the distribution pattern
    const distributionPattern = getDistributionPattern(
      areaId,
      sourceArea.pieces.length,
      state.isPlayerTurn,
    );
    // Create animation sequence - pieces move from back to front (last in, first out)
    const animDelay = 0.25;
    const animations = [...sourceArea.pieces].reverse().map((piece, index) => ({
      piece,
      fromArea: areaId,
      toArea: distributionPattern[index],
      delay: index * animDelay,
    }));
    // Start animations
    dispatch({type: 'START_MOVE_ANIMATION', movingPieces: animations});
    // Wait for all animations to complete before updating game state
    const totalDuration = animations.length * animDelay + 0.1;
    await new Promise(resolve => setTimeout(resolve, totalDuration * 1000));
    // Make the move and get the new state
    const {newAreas, newPlayerScore, newOpponentScore, extraTurn} = makeMove(
      areaId,
      state.areas,
      state.playerScore,
      state.opponentScore,
      state.isPlayerTurn,
    );
    // --- Record move ---
    dispatch({
      type: 'MAKE_MOVE',
      areaId,
      newAreas,
      newPlayerScore,
      newOpponentScore,
      moveRecord: {
        player: state.isPlayerTurn ? 'player' : 'opponent',
        fromArea: areaId,
        toArea: distributionPattern,
        piecesMoved: [...sourceArea.pieces],
        timestamp: Date.now(),
        extraTurn,
      },
      extraTurn,
      isGameOver: (() => {
        const hasValidMoves = (areasToCheck: GameArea[], isPlayer: boolean) => {
          return areasToCheck.some(area => {
            const isPlayerArea = area.allowedPlayer === 'player' || area.allowedPlayer === 'both';
            const isOpponentArea =
              area.allowedPlayer === 'opponent' || area.allowedPlayer === 'both';
            return (
              area.pieces.length > 0 &&
              ((isPlayer && isPlayerArea) || (!isPlayer && isOpponentArea))
            );
          });
        };
        const nextTurn = !extraTurn ? !state.isPlayerTurn : state.isPlayerTurn;
        return !hasValidMoves(newAreas, nextTurn);
      })(),
    });
    dispatch({type: 'END_MOVE_ANIMATION'});
  };

  // --- Scoring and move analysis ---
  const playerScoreValue = calculatePoints(state.playerScore, true);
  const opponentScoreValue = calculatePoints(state.opponentScore, false);
  // Sort moveAnalysis by totalValue descending for recommendations
  const sortedMoveAnalysis = [...state.moveAnalysis].sort((a, b) => b.totalValue - a.totalValue);
  // Convert move analysis to board recommendations for highlighting
  const recommendedMoves = sortedMoveAnalysis.map((analysis, index) => ({
    areaId: analysis.areaId,
    rank: index + 1,
  }));

  return (
    <div className="mx-8 flex w-full flex-col gap-8 rounded-xl border border-slate-700 bg-slate-800 p-8 shadow-2xl">
      {/* Game controls: undo, redo, pattern selection, start/reset */}
      <GameControls state={state} dispatch={dispatch} patternOptions={boardPatterns} />

      {/* FLEX ROW: Base panels and board */}
      <div
        className="mt-8 flex w-full flex-row items-center justify-between"
        style={{aspectRatio: '2.5/1', minHeight: 400}}
      >
        {/* Opponent base (left) */}
        <div className="flex h-full items-center">
          <BasePanel
            title="Opponent"
            score={opponentScoreValue}
            scoreColor="#22c55e" // green-500
            borderColor="#16a34a" // green-600
            pieces={state.opponentScore}
            panelRef={opponentBasePanelRef}
          />
        </div>

        {/* Board grid and animation anchors */}
        <div
          className="relative flex h-full flex-1 items-center justify-center"
          style={{height: '100%'}}
        >
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

          {/* Invisible anchors for animation (opponent/player base) */}
          <div
            className="absolute left-0 top-1/2"
            style={{
              width: 0,
              height: 0,
              pointerEvents: 'none',
              transform: 'translateY(-50%)',
            }}
            ref={opponentBaseAnchorRef}
            aria-hidden="true"
          />

          <div
            className="absolute right-0 top-1/2"
            style={{
              width: 0,
              height: 0,
              pointerEvents: 'none',
              transform: 'translateY(-50%)',
            }}
            ref={playerBaseAnchorRef}
            aria-hidden="true"
          />

          {/* Main hexagonal board */}
          <HexagonalBoard
            state={state}
            dispatch={dispatch}
            uiState={{basePositions, boardRef, hexPositions}}
          />

          {/* Opponent base legend (bottom left) */}
          <div className="absolute left-0" style={{zIndex: 2, top: 'calc(50% - 50px + 16.5rem)'}}>
            <BaseLegend
              isPlayer={false}
              playerGoesFirst={state.playerGoesFirst}
              gameStarted={state.gameStarted}
            />
          </div>

          {/* Player base legend (bottom right) */}
          <div className="absolute right-0" style={{zIndex: 2, top: 'calc(50% - 50px + 16.5rem)'}}>
            <BaseLegend
              isPlayer={true}
              playerGoesFirst={state.playerGoesFirst}
              gameStarted={state.gameStarted}
            />
          </div>

          {/* Render animated moving pieces */}
          {renderMovingPieces({
            movingPieces: state.movingPieces,
            basePositions,
            hexPositions,
            parentRef: boardAreaContainerRef as React.RefObject<HTMLDivElement>,
          })}
        </div>

        {/* Player base (right) */}
        <div className="flex h-full items-center">
          <BasePanel
            title="You"
            score={playerScoreValue}
            scoreColor="#3b82f6" // blue-500
            borderColor="#2563eb" // blue-600
            pieces={state.playerScore}
            panelRef={playerBasePanelRef}
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
