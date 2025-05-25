import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';

import {Button} from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {makeMove} from '@/utils/gameLogic';
import {isValidMove} from '@/utils/gameMechanics';
import {analyzeMoves} from '@/utils/moveAnalyzer';
import {getDistributionPattern} from '@/utils/movementPaths';
import {calculatePoints} from '@/utils/scoring';
import {boardPatterns} from '../config/boardPatterns';
import {type GameArea, type MandragoraPiece} from '../types';
import GameStatsModal from './GameStatsModal';
import HexagonalBoard, {renderMovingPieces} from './HexagonalBoard';
import MandragoraPieceComponent from './MandragoraPiece';

// --- Types for move and state history ---
type MoveRecord = {
  player: 'player' | 'opponent';
  fromArea: number;
  toArea: number[];
  piecesMoved: MandragoraPiece[];
  timestamp: number;
  extraTurn?: boolean;
};

type GameStateSnapshot = {
  areas: GameArea[];
  playerScore: MandragoraPiece[];
  opponentScore: MandragoraPiece[];
  isPlayerTurn: boolean;
  isGameOver: boolean;
};

const GameBoard: React.FC = () => {
  const [areas, setAreas] = useState<GameArea[]>([]);
  const [playerScore, setPlayerScore] = useState<MandragoraPiece[]>([]);
  const [opponentScore, setOpponentScore] = useState<MandragoraPiece[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<string>('');
  const [playerGoesFirst, setPlayerGoesFirst] = useState<boolean | null>(null);
  const [moveAnalysis, setMoveAnalysis] = useState<
    ReturnType<typeof analyzeMoves>
  >([]);
  const [movingPieces, setMovingPieces] = useState<
    {
      piece: MandragoraPiece;
      fromArea: number;
      toArea: number;
      delay: number;
    }[]
  >([]);
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  const [gameStateHistory, setGameStateHistory] = useState<GameStateSnapshot[]>(
    [],
  );
  const [redoStack, setRedoStack] = useState<MoveRecord[]>([]);
  const [redoGameStateStack, setRedoGameStateStack] = useState<
    GameStateSnapshot[]
  >([]);
  const opponentBaseAnchorRef = useRef<HTMLDivElement>(null);
  const playerBaseAnchorRef = useRef<HTMLDivElement>(null);
  const playerBasePanelRef = useRef<HTMLDivElement>(null);
  const opponentBasePanelRef = useRef<HTMLDivElement>(null);
  const [basePositions, setBasePositions] = useState<{
    opponent: DOMRect | null;
    player: DOMRect | null;
  }>({opponent: null, player: null});
  const boardAreaContainerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [hexPositions, setHexPositions] = useState<Record<number, DOMRect>>({});
  const [statsOpen, setStatsOpen] = useState(false);

  // --- Undo logic ---
  const handleUndo = () => {
    if (moveHistory.length === 0 || gameStateHistory.length === 0) return;
    const prevState = gameStateHistory[gameStateHistory.length - 1];
    const undoneMove = moveHistory[moveHistory.length - 1];
    setRedoStack(r => [...r, undoneMove]);
    setRedoGameStateStack(r => [
      ...r,
      {
        areas: JSON.parse(JSON.stringify(areas)),
        playerScore: [...playerScore],
        opponentScore: [...opponentScore],
        isPlayerTurn,
        isGameOver,
      },
    ]);
    setAreas(prevState.areas);
    setPlayerScore(prevState.playerScore);
    setOpponentScore(prevState.opponentScore);
    setIsPlayerTurn(prevState.isPlayerTurn);
    setIsGameOver(prevState.isGameOver);
    setMoveHistory(h => h.slice(0, -1));
    setGameStateHistory(h => h.slice(0, -1));
  };

  // --- Redo logic ---
  const handleRedo = () => {
    if (redoStack.length === 0 || redoGameStateStack.length === 0) return;
    const redoMove = redoStack[redoStack.length - 1];
    const redoState = redoGameStateStack[redoGameStateStack.length - 1];
    setAreas(redoState.areas);
    setPlayerScore(redoState.playerScore);
    setOpponentScore(redoState.opponentScore);
    setIsPlayerTurn(redoState.isPlayerTurn);
    setIsGameOver(redoState.isGameOver);
    setMoveHistory(h => [...h, redoMove]);
    setGameStateHistory(h => [...h, redoState]);
    setRedoStack(r => r.slice(0, -1));
    setRedoGameStateStack(r => r.slice(0, -1));
  };

  const initializeGame = () => {
    if (gameStarted) {
      // Reset everything
      setGameStarted(false);
      setSelectedPattern('');
      setPlayerGoesFirst(null);
      setMoveAnalysis([]);
      setMovingPieces([]);
      setMoveHistory([]);
      setGameStateHistory([]);
      setRedoStack([]);
      setRedoGameStateStack([]);
    } else {
      // Start new game
      if (playerGoesFirst === null || !selectedPattern) return;

      const pattern = boardPatterns.find(p => p.id === selectedPattern);
      if (!pattern) return;

      setGameStarted(true);
      setMoveAnalysis([]);
      setMovingPieces([]);
      setMoveHistory([]);
      // Save the initial state as the first entry in gameStateHistory
      setGameStateHistory([
        {
          areas: JSON.parse(JSON.stringify(pattern.areas)),
          playerScore: [],
          opponentScore: [],
          isPlayerTurn: playerGoesFirst,
          isGameOver: false,
        },
      ]);
      setAreas(JSON.parse(JSON.stringify(pattern.areas)));
      setPlayerScore([]);
      setOpponentScore([]);
      setIsPlayerTurn(playerGoesFirst);
      setIsGameOver(false);
      setRedoStack([]);
      setRedoGameStateStack([]);
    }
  };

  // Automatically analyze moves when it's the player's turn
  useEffect(() => {
    if (gameStarted && !isGameOver && isPlayerTurn) {
      const analysis = analyzeMoves(areas, isPlayerTurn);
      setMoveAnalysis(analysis);
    } else {
      setMoveAnalysis([]);
    }
  }, [areas, isPlayerTurn, gameStarted, isGameOver]);

  // Update base positions when the component mounts or window resizes
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
  }, []);

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
  }, [gameStateHistory]);

  const handleAreaClick = async (areaId: number) => {
    if (isGameOver || !gameStarted) return;

    if (!isValidMove(areaId, areas, isPlayerTurn)) {
      return;
    }

    const sourceArea = areas.find(a => a.id === areaId);
    if (!sourceArea) return;

    // Clear redo stack on new move
    setRedoStack([]);
    setRedoGameStateStack([]);

    // Calculate piece movements based on the distribution pattern
    const distributionPattern = getDistributionPattern(
      areaId,
      sourceArea.pieces.length,
      isPlayerTurn,
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
    setMovingPieces(animations);

    // Wait for all animations to complete before updating game state
    const totalDuration = animations.length * animDelay + 0.1;
    await new Promise(resolve => setTimeout(resolve, totalDuration * 1000));

    const {newAreas, newPlayerScore, newOpponentScore, extraTurn} = makeMove(
      areaId,
      areas,
      playerScore,
      opponentScore,
      isPlayerTurn,
    );

    // --- Record move ---
    setMoveHistory(h => [
      ...h,
      {
        player: isPlayerTurn ? 'player' : 'opponent',
        fromArea: areaId,
        toArea: distributionPattern,
        piecesMoved: [...sourceArea.pieces],
        timestamp: Date.now(),
        extraTurn,
      },
    ]);

    setMovingPieces([]);

    // Check if game is over using the updated newAreas
    const hasValidMoves = (areasToCheck: GameArea[], isPlayer: boolean) => {
      return areasToCheck.some(area => {
        const isPlayerArea =
          area.allowedPlayer === 'player' || area.allowedPlayer === 'both';
        const isOpponentArea =
          area.allowedPlayer === 'opponent' || area.allowedPlayer === 'both';
        return (
          area.pieces.length > 0 &&
          ((isPlayer && isPlayerArea) || (!isPlayer && isOpponentArea))
        );
      });
    };

    const nextTurn = !extraTurn ? !isPlayerTurn : isPlayerTurn;
    const gameOver = !hasValidMoves(newAreas, nextTurn);

    setGameStateHistory(h => [
      ...h,
      {
        areas: JSON.parse(JSON.stringify(newAreas)),
        playerScore: newPlayerScore,
        opponentScore: newOpponentScore,
        isPlayerTurn: nextTurn,
        isGameOver: gameOver,
      },
    ]);
  };

  const playerScoreValue = calculatePoints(playerScore, true);
  const opponentScoreValue = calculatePoints(opponentScore, false);

  // Sort moveAnalysis by totalValue descending
  const sortedMoveAnalysis = [...moveAnalysis].sort(
    (a, b) => b.totalValue - a.totalValue,
  );

  // Convert move analysis to board recommendations
  const recommendedMoves = sortedMoveAnalysis.map((analysis, index) => ({
    areaId: analysis.areaId,
    rank: index + 1,
  }));

  return (
    <div className="w-full rounded-xl border border-slate-700 bg-slate-800 p-8 shadow-2xl">
      <div className="flex w-full flex-col items-stretch gap-8">
        <div className="w-full">
          <div className="relative mb-6 flex h-11 flex-col items-center md:flex-row">
            {/* Undo/Redo Buttons (always visible, but disabled if not available) */}
            <div
              className="absolute left-0 top-1/2 flex -translate-y-1/2 gap-2"
              style={{zIndex: 10}}
            >
              <button
                className="flex h-10 items-center rounded-full bg-slate-700 px-4 py-2 text-base font-semibold text-white shadow hover:bg-slate-800 hover:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={handleUndo}
                disabled={moveHistory.length === 0}
              >
                Undo
              </button>
              <button
                className="flex h-10 items-center rounded-full bg-slate-700 px-4 py-2 text-base font-semibold text-white shadow hover:bg-slate-800 hover:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={handleRedo}
                disabled={redoStack.length === 0}
              >
                Redo
              </button>
            </div>
            <div className="absolute right-0 flex items-center gap-4">
              <Select
                value={selectedPattern}
                onValueChange={value => setSelectedPattern(value)}
                disabled={gameStarted}
              >
                <SelectTrigger className="w-40 border-slate-600 bg-slate-700 text-white">
                  <SelectValue placeholder="Which pattern?" />
                </SelectTrigger>
                <SelectContent>
                  {[...boardPatterns]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(pattern => (
                      <SelectItem key={pattern.id} value={pattern.id}>
                        {pattern.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {!gameStarted && (
                <Select
                  value={
                    playerGoesFirst === null
                      ? ''
                      : playerGoesFirst
                        ? 'player'
                        : 'opponent'
                  }
                  onValueChange={value =>
                    setPlayerGoesFirst(value === 'player')
                  }
                >
                  <SelectTrigger className="w-48 border-slate-600 bg-slate-700 text-white">
                    <SelectValue placeholder="Who goes first?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="player">You go first</SelectItem>
                    <SelectItem value="opponent">
                      Opponent goes first
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Button
                onClick={initializeGame}
                disabled={
                  !gameStarted && (playerGoesFirst === null || !selectedPattern)
                }
                size="lg"
                className="w-40 bg-gradient-to-r from-purple-400 to-pink-400 text-base font-semibold text-white shadow-lg hover:from-purple-500 hover:to-pink-500 hover:shadow-purple-500/20"
              >
                {gameStarted ? 'Reset Game' : 'Start Game'}
              </Button>
            </div>

            <div className="flex h-11 flex-1 justify-center"></div>
          </div>

          <div
            ref={boardAreaContainerRef}
            className="relative mt-8 w-full"
            style={{aspectRatio: '2.5/1', minHeight: 400}}
          >
            {/* Animated Turn Banner: absolute, animates between top and bottom */}
            {gameStarted && (
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
                } `}
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
                      onClick={() => setStatsOpen(true)}
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
            )}
            {/* Opponent base (left) */}
            <div
              ref={opponentBasePanelRef}
              className="absolute left-0 top-[calc(50%-50px)] flex h-[29.7rem] w-40 -translate-y-1/2 flex-col rounded-xl border-2 border-green-600 bg-slate-700 shadow-lg"
              style={{zIndex: 2}}
            >
              <h3 className="border-b border-green-500 p-4 text-center text-lg font-bold text-green-400">
                <span className="font-bold">Opponent</span>
              </h3>
              <div className="flex flex-1 flex-wrap-reverse content-start items-center justify-start gap-x-3 overflow-y-auto px-2 pb-2 pt-2">
                <AnimatePresence>
                  {opponentScore.map((piece, index, array) => (
                    <div
                      key={`opponent-${index}`}
                      className={`aspect-2/3 relative w-[18%] ${index >= 4 ? '-mb-5' : ''}`}
                      style={{zIndex: array.length - index}}
                    >
                      <MandragoraPieceComponent
                        type={piece.type}
                        color={piece.color}
                        showLabel={true}
                      />
                    </div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="border-t border-green-500 bg-slate-800/50 p-4 text-center text-green-400">
                <span className="font-bold">Score:</span>{' '}
                <span className="font-bold">{opponentScoreValue}</span>
              </div>
            </div>
            {/* Player base (right) */}
            <div
              ref={playerBasePanelRef}
              className="absolute right-0 top-[calc(50%-50px)] flex h-[29.7rem] w-40 -translate-y-1/2 flex-col rounded-xl border-2 border-[#3b82f6] bg-slate-700 shadow-lg"
              style={{zIndex: 2}}
            >
              <h3 className="border-b border-[#3b82f6] p-4 text-center text-lg font-bold text-[#3b82f6]">
                <span className="font-bold">You</span>
              </h3>
              <div className="flex flex-1 flex-wrap-reverse content-start items-center justify-start gap-x-3 overflow-y-auto px-2 pb-2 pt-2">
                <AnimatePresence>
                  {playerScore.map((piece, index, array) => (
                    <div
                      key={`player-${index}`}
                      className={`aspect-2/3 relative w-[18%] ${index >= 4 ? '-mb-5' : ''}`}
                      style={{zIndex: array.length - index}}
                    >
                      <MandragoraPieceComponent
                        type={piece.type}
                        color={piece.color}
                        showLabel={true}
                      />
                    </div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="border-t border-[#3b82f6] bg-slate-800/50 p-4 text-center text-[#3b82f6]">
                <span className="font-bold">Score:</span>{' '}
                <span className="font-bold">{playerScoreValue}</span>
              </div>
            </div>
            {/* Board grid and animation anchors */}
            <div
              className="absolute left-1/2 top-1/2 w-[calc(100%-20rem)] -translate-x-1/2 -translate-y-1/2"
              style={{zIndex: 1}}
            >
              <div
                ref={opponentBaseAnchorRef}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  width: 0,
                  height: 0,
                  pointerEvents: 'none',
                }}
                aria-hidden="true"
              />
              <div
                ref={playerBaseAnchorRef}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  width: 0,
                  height: 0,
                  pointerEvents: 'none',
                }}
                aria-hidden="true"
              />
              <HexagonalBoard
                areas={areas}
                onAreaClick={handleAreaClick}
                isValidMove={areaId => isValidMove(areaId, areas, isPlayerTurn)}
                recommendedMoves={recommendedMoves}
                boardRef={boardRef as React.RefObject<HTMLDivElement>}
                hexPositions={hexPositions}
                basePositions={basePositions}
                isPlayerTurn={isPlayerTurn}
              />
            </div>
            {/* Opponent base legend */}
            <div
              className="absolute left-0 w-40 rounded-lg bg-slate-800 p-3"
              style={{zIndex: 2, top: 'calc(50% - 50px + 16.5rem)'}}
            >
              <div className="flex w-full items-end justify-evenly">
                <div className="flex flex-col items-center justify-end">
                  <div className="aspect-2/3 w-6">
                    <MandragoraPieceComponent
                      type="Adenium"
                      color="Pink"
                      showLabel={true}
                    />
                  </div>
                  {gameStarted && (
                    <span className="mt-1 font-bold text-pink-400">
                      {!playerGoesFirst ? '3' : '4'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="aspect-2/3 w-6">
                    <MandragoraPieceComponent
                      type="Citrillus"
                      color="Green"
                      showLabel={true}
                    />
                  </div>
                  {gameStarted && (
                    <span className="mt-1 font-bold text-green-400">
                      {!playerGoesFirst ? '3' : '4'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="aspect-2/3 w-6">
                    <MandragoraPieceComponent
                      type="Korrigan"
                      color="Black"
                      showLabel={true}
                    />
                  </div>
                  {gameStarted && (
                    <span className="mt-1 font-bold text-white">
                      {!playerGoesFirst ? '2' : '3'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="aspect-2/3 w-6">
                    <MandragoraPieceComponent
                      type="Pachypodium"
                      color="Black"
                      showLabel={true}
                    />
                  </div>
                  {gameStarted && (
                    <span className="mt-1 font-bold text-white">
                      {!playerGoesFirst ? '2' : '3'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="aspect-2/3 w-6">
                    <MandragoraPieceComponent
                      type="Mandragora"
                      color="White"
                      showLabel={true}
                    />
                  </div>
                  {gameStarted && (
                    <span className="mt-1 font-bold text-white">1</span>
                  )}
                </div>
              </div>
            </div>
            {/* Player base legend */}
            <div
              className="absolute right-0 w-40 rounded-lg bg-slate-800 p-3"
              style={{zIndex: 2, top: 'calc(50% - 50px + 16.5rem)'}}
            >
              <div className="flex w-full items-end justify-evenly">
                <div className="flex flex-col items-center justify-end">
                  <div className="aspect-2/3 w-6">
                    <MandragoraPieceComponent
                      type="Adenium"
                      color="Pink"
                      showLabel={true}
                    />
                  </div>
                  {gameStarted && (
                    <span className="mt-1 font-bold text-pink-400">
                      {playerGoesFirst ? '3' : '4'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="aspect-2/3 w-6">
                    <MandragoraPieceComponent
                      type="Citrillus"
                      color="Green"
                      showLabel={true}
                    />
                  </div>
                  {gameStarted && (
                    <span className="mt-1 font-bold text-green-400">
                      {playerGoesFirst ? '3' : '4'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="aspect-2/3 w-6">
                    <MandragoraPieceComponent
                      type="Korrigan"
                      color="Black"
                      showLabel={true}
                    />
                  </div>
                  {gameStarted && (
                    <span className="mt-1 font-bold text-white">
                      {playerGoesFirst ? '2' : '3'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="aspect-2/3 w-6">
                    <MandragoraPieceComponent
                      type="Pachypodium"
                      color="Black"
                      showLabel={true}
                    />
                  </div>
                  {gameStarted && (
                    <span className="mt-1 font-bold text-white">
                      {playerGoesFirst ? '2' : '3'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="aspect-2/3 w-6">
                    <MandragoraPieceComponent
                      type="Mandragora"
                      color="White"
                      showLabel={true}
                    />
                  </div>
                  {gameStarted && (
                    <span className="mt-1 font-bold text-white">1</span>
                  )}
                </div>
              </div>
            </div>
            {renderMovingPieces({
              movingPieces,
              basePositions,
              hexPositions,
              parentRef:
                boardAreaContainerRef as React.RefObject<HTMLDivElement>,
            })}
          </div>

          {sortedMoveAnalysis.length > 0 && (
            <div className="mt-8 rounded-lg border border-slate-700 bg-slate-800 p-4">
              <h3 className="mb-2 text-lg font-semibold text-white">
                Move Analysis
              </h3>
              <div className="space-y-2">
                {sortedMoveAnalysis.map((analysis, index) => {
                  const isRecommended = index === 0;
                  return (
                    <div
                      key={analysis.areaId}
                      className="flex items-center gap-3 rounded border border-slate-600 bg-slate-700 p-3"
                    >
                      <span
                        className={
                          isRecommended
                            ? 'rounded-full bg-yellow-400 px-3 py-1 text-base font-bold text-black shadow'
                            : 'rounded-full bg-black/50 px-3 py-1 text-base font-bold text-white'
                        }
                        style={{
                          minWidth: 70,
                          display: 'inline-block',
                          textAlign: 'center',
                        }}
                      >
                        Area {analysis.areaId}
                      </span>
                      <p className="mb-0 flex-1 text-white">
                        <span className="font-semibold">
                          Total Value: {analysis.totalValue.toFixed(1)}
                        </span>
                        <span className="mx-2">|</span>
                        {analysis.explanation
                          .replace(/^Area \d+:\s*/, '')
                          .replace(
                            'WARNING: grants opponent an extra move',
                            'WARNING: grants opponent an extra move opportunity',
                          )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {isGameOver && (
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            className="mt-8 rounded-xl border-2 border-purple-500/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-8 text-center text-white backdrop-blur-sm"
          >
            <h2 className="mb-3 text-3xl font-bold">Game Over!</h2>
            <p className="mb-2 text-2xl">
              {playerScoreValue > opponentScoreValue
                ? '🎉 You Win! 🎉'
                : playerScoreValue < opponentScoreValue
                  ? '😔 Opponent Wins!'
                  : "It's a Tie!"}
            </p>
            <p className="text-xl text-slate-300">
              Final Score: {playerScoreValue} - {opponentScoreValue}
            </p>
          </motion.div>
        )}

        {/* Stats Modal */}
        <GameStatsModal
          open={statsOpen}
          onOpenChange={setStatsOpen}
          playerScoreValue={playerScoreValue}
          opponentScoreValue={opponentScoreValue}
          moveHistory={moveHistory}
        />
      </div>
    </div>
  );
};

export default GameBoard;
